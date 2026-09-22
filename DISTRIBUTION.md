# Distribution and adoption

`emilint` is consumed directly from its public GitHub repository. Portable
agent guidance is maintained separately in
[`astahmer/agents`](https://github.com/astahmer/agents).

## Install from GitHub

```bash
pnpm add --save-dev astahmer/emilint#main
```

pnpm resolves the branch to a commit and records that commit in the consumer's
`pnpm-lock.yaml`. Commit both `package.json` and the lockfile. For a fully
immutable manifest declaration, use a full commit hash instead of `main`:

```json
{
  "devDependencies": {
    "emilint": "github:astahmer/emilint#<full-commit-hash>"
  }
}
```

The package exposes these stable surfaces:

| Surface                                    | Use                                        |
| ------------------------------------------ | ------------------------------------------ |
| `emilint/oxlint`                           | Generic Oxlint plugin, generated as `.mjs` |
| `emilint/profiles/effect/oxlint`           | Opt-in Effect Oxlint plugin                |
| `emilint/ast-grep/rules/*`                 | Generic structural rules                   |
| `emilint/profiles/effect/ast-grep/rules/*` | Effect structural rules                    |
| `emilint/configs/*`                        | Starting-point Oxlint and ast-grep configs |
| `emilint/skills/*`                         | Lint companion skill documentation         |

Configure Oxlint with the snippets in [`README.md`](README.md), or merge the
corresponding `jsPlugins` and `rules` entries from
`node_modules/emilint/configs/oxlint-generic.json` into an existing config.
Do not overwrite a project's existing config blindly.

For ast-grep, merge the `ruleDirs` entry from
`node_modules/emilint/configs/sgconfig-generic.yml`, then scan only the paths
that fit the project's architecture:

```bash
pnpm exec ast-grep scan --config sgconfig.yml src
```

Run one structural rule in isolation when introducing it:

```bash
pnpm exec ast-grep scan \
  --rule node_modules/emilint/ast-grep/rules/no-direct-json-parse.yml \
  src
```

The `testConfigs` in emilint's repository configs point at emilint's own rule
fixtures. A consuming repository normally needs only `ruleDirs`; keep its own
rule tests in its own test directory.

## Updating

The branch selector is convenient for starting a project; the lockfile still
keeps installs reproducible. To move to newer rules, update the Git dependency
and commit the resulting lockfile. For a commit-pinned manifest, replace its
hash with the new emilint commit before running `pnpm install`.

## JSR later

JSR supports installation through pnpm, but publishing requires a JSR-scoped
package name, a versioned `jsr.json`, and `jsr publish`. Its npm-compatible
package is generated from declared module exports; emilint also needs to ship
ast-grep YAML rules, JSON/YAML configs, fixtures, and its generated Oxlint
entrypoints. Git dependency is simpler while we do not need registry versions.
Revisit JSR if we want a versioned registry and its package discovery/docs.

For one-off local integration, `pnpm pack` can still inspect the package
contents; it is not the cross-machine install path. For agent skill
distribution, use the separate [`agents` repository](https://github.com/astahmer/agents).

## Version and validation policy

- Node `>=20.19.0` is required.
- The package is developed and checked with Oxlint `1.82.0`, ast-grep CLI
  `0.45.3`, and Oxfmt `0.68.0`.
- `pnpm build` regenerates the committed Oxlint `.mjs` artifact before packing.
- `pnpm test` validates emilint's own rule fixtures; it is not a command that
  automatically scans a consuming repository.
- Before upgrading, run the consumer's focused lint checks and inspect new
  diagnostics separately from its existing baseline.

The complete rule inventory, including default and opt-in status, is in
[`CATALOG.md`](CATALOG.md).
