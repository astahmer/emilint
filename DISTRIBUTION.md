# Distribution and adoption

`emilint` has two consumption surfaces:

- executable Oxlint and ast-grep rules, kept as a versioned package dependency;
- portable `SKILL.md` files, which a repository may vendor into its own agent
  skill tree.

The package is private in this repository. Until it is published to a registry,
use the tarball workflow below to test or distribute a pinned build.

## Recommended: install the package

After publishing to a registry or serving it from an internal registry:

```bash
pnpm add --save-dev emilint@<version>
```

Keep the dependency in the consumer's lockfile. The package exposes these
stable surfaces:

| Surface                                    | Use                                           |
| ------------------------------------------ | --------------------------------------------- |
| `emilint/oxlint`                           | Generic Oxlint plugin, generated as `.mjs`    |
| `emilint/profiles/effect/oxlint`           | Opt-in Effect Oxlint plugin                   |
| `emilint/ast-grep/rules/*`                 | Generic structural rules                      |
| `emilint/profiles/effect/ast-grep/rules/*` | Effect structural rules                       |
| `emilint/configs/*`                        | Starting-point Oxlint and ast-grep configs    |
| `emilint/skills/*`                         | Portable agent skills for selective vendoring |

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

## Current option: install a packed tarball

Build the same artifact that a registry would receive:

```bash
mkdir -p .artifacts
pnpm pack --pack-destination .artifacts
```

Install the resulting `emilint-<version>.tgz` in another repository:

```bash
pnpm add --save-dev /absolute/path/to/emilint-<version>.tgz
```

This is useful for local integration and release testing. It is not a good
long-term dependency reference because a local path is not available to other
machines or CI.

## GitHub release assets

When a GitHub repository and release process exist, upload the packed tarball
as a release asset:

```bash
gh release create v<version> .artifacts/emilint-<version>.tgz \
  --title v<version> --generate-notes
```

Consumers can then pin the immutable release asset:

```bash
pnpm add --save-dev \
  https://github.com/<owner>/emilint/releases/download/v<version>/emilint-<version>.tgz
```

`gh` is useful for publishing and downloading a release asset; it is not a
rule-selection tool. `git` is useful for source checkout but does not create a
stable package boundary. `shadcn` is not a fit because emilint is a package of
lint plugins, structural rules, and agent skills rather than UI components.

## Vendor a selected skill

Keep lint rules as a package dependency when possible. Vendor only a skill when
the consuming agent must have a checked-in local copy or the project cannot
read skills from `node_modules`.

From an installed package:

```bash
mkdir -p .agents/skills/focused-validation
cp node_modules/emilint/skills/focused-validation/SKILL.md \
  .agents/skills/focused-validation/SKILL.md
```

From a packed tarball, extract it to a temporary directory and copy only the
selected `skills/<name>/SKILL.md` file. Keep the source version or release tag
in the consuming repository's skill index so updates can be audited.

To update a vendored skill, download or install the new pinned package, repeat
the copy, and review the resulting diff. Do not silently replace local
commands, paths, or deliberate exceptions; keep those in the project's local
AGENTS or skill overlay.

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
