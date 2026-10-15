import { defineRule } from "../compat.ts";

import type { ESTree } from "../compat.ts";

type CallableExport = { readonly name: string; readonly node: ESTree.Node };

const escapePattern = (value: string): string => value.replace(/[|\\{}()[\]^$+?.]/gu, "\\$&");

const pathPattern = (pattern: string): RegExp => {
  const source = pattern
    .replaceAll("\\", "/")
    .split("/")
    .map((segment) => {
      if (segment === "**") return ".*";
      if (segment === "*") return "[^/]+";
      return escapePattern(segment);
    })
    .join("/");
  return new RegExp(`(?:^|/)${source}(?:$|/)`, "u");
};

const domainCallableExports = (program: ESTree.Program): readonly CallableExport[] => {
  const callableExports: CallableExport[] = [];
  for (const statement of program.body) {
    if (statement.type !== "ExportNamedDeclaration" || statement.declaration === null) continue;
    const declaration = statement.declaration;
    if (
      declaration.type === "FunctionDeclaration" &&
      declaration.id !== null &&
      declaration.body !== null
    ) {
      callableExports.push({ name: declaration.id.name, node: declaration });
      continue;
    }
    if (declaration.type !== "VariableDeclaration") continue;
    for (const declarator of declaration.declarations) {
      const name = declarator.id?.type === "Identifier" ? declarator.id.name : undefined;
      const initializerType = declarator.init?.type;
      if (
        name !== undefined &&
        (initializerType === "ArrowFunctionExpression" || initializerType === "FunctionExpression")
      ) {
        callableExports.push({ name, node: declarator });
      }
    }
  }
  return callableExports.filter(
    (callable) => !/^use[A-Z]/u.test(callable.name) && !/^[A-Z]/u.test(callable.name),
  );
};

/** Group cohesive callable exports under one owner rather than growing a peer-export bag. */
export const noExportBagRule = defineRule({
  meta: {
    type: "problem",
    docs: {
      description:
        "Groups related domain functions under a domain class or an Effect service instead of exporting a bag of helpers.",
    },
    messages: {
      exportBag:
        "Group cohesive exported domain helpers under one namespace class with static methods. Move dependency-bearing operations to an injected service; keep boundary and hook exports explicit.",
    },
    schema: [
      {
        type: "object",
        properties: {
          minExports: { type: "integer", minimum: 1 },
          excludePaths: { type: "array", items: { type: "string" } },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [{ minExports: 3, excludePaths: [] }],
  },
  createOnce(context) {
    return {
      "Program:exit"(program: ESTree.Program) {
        const option = context.options?.[0];
        const minExports =
          typeof option === "object" &&
          option !== null &&
          !Array.isArray(option) &&
          Number.isInteger(option.minExports) &&
          option.minExports > 0
            ? option.minExports
            : 3;
        const excludePaths =
          typeof option === "object" &&
          option !== null &&
          !Array.isArray(option) &&
          Array.isArray(option.excludePaths)
            ? option.excludePaths
                .filter((path: unknown): path is string => typeof path === "string")
                .map(pathPattern)
            : [];
        const filename = context.getFilename().replaceAll("\\", "/");
        if (
          filename.endsWith(".tsx") ||
          /\.(?:test|spec)\.[cm]?[jt]sx?$/u.test(filename) ||
          /\/(?:e2e|generated|node_modules)\//u.test(filename) ||
          excludePaths.some((pattern) => pattern.test(filename))
        ) {
          return;
        }

        const callableExports = domainCallableExports(program);
        if (callableExports.length < minExports) return;
        context.report({
          node: callableExports[0]?.node ?? program,
          messageId: "exportBag",
          data: { minExports },
        });
      },
    };
  },
});
