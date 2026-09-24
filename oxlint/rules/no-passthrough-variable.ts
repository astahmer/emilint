import { defineRule } from "../compat.ts";

/** Keep local const bindings from adding a name without adding behavior. */
export const noPassthroughVariableRule = defineRule({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow local const bindings that only alias another identifier.",
    },
    messages: {
      passthrough:
        "Inline passthrough binding `{{alias}}` and use `{{source}}` directly. Keep an alias only for a required snapshot or narrowing, with a local oxlint-disable comment explaining that invariant.",
    },
  },
  createOnce(context) {
    return {
      VariableDeclarator(node) {
        if (
          node.parent?.type !== "VariableDeclaration" ||
          node.parent.kind !== "const" ||
          node.id?.type !== "Identifier" ||
          node.init?.type !== "Identifier" ||
          node.id.name === node.init.name ||
          node.parent.parent?.type === "ExportNamedDeclaration"
        ) {
          return;
        }

        context.report({
          node: node.id,
          messageId: "passthrough",
          data: { alias: node.id.name, source: node.init.name },
        });
      },
    };
  },
});
