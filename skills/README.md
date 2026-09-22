# Lint companion skills

`emilint` owns executable code-quality rules and the short agent guidance that
explains how to select and apply those rules. General workflow skills belong in
the separate [`astahmer/agents`](https://github.com/astahmer/agents)
repository.

| Skill             | Use                                         | Executable package surface                                                   |
| ----------------- | ------------------------------------------- | ---------------------------------------------------------------------------- |
| `antislop`        | Generic TypeScript/JavaScript anti-patterns | `emilint/oxlint`, `emilint/ast-grep/rules/*`                                 |
| `effect-antislop` | Opt-in Effect architecture rules            | `emilint/profiles/effect/oxlint`, `emilint/profiles/effect/ast-grep/rules/*` |

The skills are package documentation, not a second implementation. Keep rule
behavior, fixtures, and the inventory in the package root and its profile
directories.
