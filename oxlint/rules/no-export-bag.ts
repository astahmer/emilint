import { defineRule, type ESTree } from "../compat.ts";

const escapePattern = (value: string): string => value.replace(/[|\\{}()[\]^$+?.]/gu, "\\$&");

const pathPattern = (pattern: string): RegExp => {
  const normalizedPattern = pattern.replaceAll("\\", "/");
  let source = "";
  for (let index = 0; index < normalizedPattern.length; index += 1) {
    const character = normalizedPattern[index];
    if (character !== "*") {
      source += escapePattern(character ?? "");
      continue;
    }
    if (normalizedPattern[index + 1] !== "*") {
      source += "[^/]*";
      continue;
    }
    if (normalizedPattern[index + 2] === "/") {
      source += "(?:[^/]+/)*";
      index += 2;
      continue;
    }
    source += ".*";
    index += 1;
  }
  return new RegExp(`(?:^|/)${source}(?:$|/)`, "u");
};

const domainCallableExports = (program: ESTree.Program) => {
  const callableExports = [];
  for (const statement of program.body ?? []) {
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

export const noExportBagRule = defineRule({
  meta: {
    type: "problem",
    docs: {
      description:
        "Group related domain functions under one namespace class or an injected service instead of exporting a bag of helpers.",
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
  create(context) {
    const option = context.options?.[0] ?? { minExports: 3, excludePaths: [] };
    const minExports = option.minExports ?? 3;
    const excludePaths = (option.excludePaths ?? []).map(pathPattern);
    const filename = context.getFilename().replaceAll("\\", "/");
    if (
      filename.endsWith(".tsx") ||
      /\.(?:test|spec)\.[cm]?[jt]sx?$/u.test(filename) ||
      /\/(?:e2e|generated|node_modules)\//u.test(filename) ||
      excludePaths.some((pattern: RegExp) => pattern.test(filename))
    ) {
      return {};
    }

    return {
      "Program:exit"(program: ESTree.Program) {
        const callableExports = domainCallableExports(program);
        if (callableExports.length < minExports) return;
        context.report({
          node: callableExports[0]?.node ?? program,
          messageId: "exportBag",
        });
      },
    };
  },
});
