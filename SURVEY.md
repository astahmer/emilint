# Oxlint and ast-grep survey

Survey date: 2026-09-30. Scope: `/Users/astahmer/dev`, excluding `node_modules`
and VCS internals.

## Inventory

- 35 projects have an `.oxlintrc.json`.
- 30 of those load a JavaScript Oxlint plugin.
- 13 projects carry the Emisoup/HealthFit anti-slop directory: `emi-healthfit`,
  `emisoup`, and 11 Emisoup experiment or audit worktrees.
- The generic Emisoup Oxlint plugin source is byte-identical across those
  worktrees. The ast-grep copies differ mainly by repository file globs and
  product-specific additions.

The 13 paths are `emi-healthfit`, `emisoup`, `emisoup-channel-ui`,
`emisoup-covui`, `emisoup-header`, `emisoup-pandwind-compare`,
`emisoup-pandwind-compare-chakra-first`, `emisoup-pandwind-one-shot`,
`emisoup-sort-baseline`, `emisoup-tags`, `emisoup-visual-audit`,
`emisoup-visual-baseline`, and `emisoup-wrapper-audit`.

The custom-plugin projects fall into four families:

| Family            | Source                                                                           | Decision                                                                                                 |
| ----------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Emisoup/HealthFit | `scripts/oxlint/emi-plugin.mjs`, `tools/oxlint/anti-slop`, and `anti-slop/rules` | Extract the generic rules and the opt-in Effect profile. Keep product topology and workflow rules local. |
| Pandwind          | `packages/lint-plugin/dist/index.js`, `pandwind-extraction/*`                    | Keep local. Rules encode the Pandwind CSS extraction and migration model.                                |
| Actual            | `packages/eslint-plugin-actual/lib/index.js`, `actual/*`                         | Keep local. Rules encode Actual's navigation, translation, Redux, and package boundaries.                |
| Welii             | `tools/oxlint-plugin-typed-inject/dist/plugin.js`                                | Keep local. Rules encode Welii's injection metadata and resolver contract.                               |

The remaining Oxlint users use built-in Oxlint plugins and have no custom
anti-slop implementation worth extracting here.

## Extracted generic rules

These rules have no product package names, repository roots, framework wrappers,
or fixed source directories. Boundary rules are deliberately run over paths
selected by each consumer.

### Oxlint

- `no-chained-type-assertions`
- `no-broad-object-parameters` — renamed from the less precise source name
  `no-object-parameters`.
- `no-conditional-empty-object-spread`
- `no-known-value-widening`
- `no-module-mocking` — opt in for test suites where dependency injection is
  the intended seam.
- `no-passthrough-variable` — inline local const aliases that add no transform;
  required snapshots and narrowings need a local suppression with its reason.
- `no-reflect-apply`
- `no-reflect-get`
- `no-runtime-typeof`
- `no-unknown-parameters`
- `no-unknown-returns`
- `no-unknown-type-aliases`
- `no-unsafe-dictionary-type`
- `no-widen-then-assert`
- `require-safety-comment-for-type-assertion`

The Oxlint rules use scope and global-binding identity where needed. This is why
the reflection, mocking, and type-evidence checks are not duplicated as blind
ast-grep patterns.

### ast-grep

- `no-database-row-spread`
- `no-deeply-nested-ternary` — generalized from Emisoup's
  `no-nested-ternary` and extended to three-or-more cascading levels.
- `no-direct-json-parse` — framework-neutral message; the source wording was
  Effect-specific.
- `no-raw-response-json-assertion` — generalized name for the response
  `json()` assertion rule.
- `no-export-from`
- `no-index-import`
- `no-internal-export-boundary-import`
- `no-internal-forwarding-class`
- `no-wildcard-export`

The copied rules omit the source projects' `packages/**`, `apps/**`,
`mod.ts`, and `*.export.ts` assumptions. Consumers choose the paths and public
boundary exceptions in their own invocation/configuration.

## Extracted Effect profile

These rules are reusable across Effect projects but are not part of the generic
JavaScript/TypeScript profile:

- `no-domain-effect-run`
- `no-effect-context-reprovide`
- `no-catch-if-tagged-error`
- `no-service-flat-map-facade`
- `no-fallible-database-promise`
- `no-untyped-readable-stream-error`
- `no-sequential-effect-yield-in-loop`
- `no-silent-error-swallow`
- `prefer-datetime-duration-arithmetic`
- `no-local-effect-provide-wrapper`
- `no-unnecessary-effect-provider-wrapper`
- `no-variadic-effect-schema-literal`
- `require-explicit-schema-declare-type-guard`

The Oxlint profile accepts `domainPaths`, `implementationPaths`,
`databasePaths`, `streamPaths`, `excludePaths`, and `serviceNames`. Defaults are
path fragments such as `domain`, `ports`, `use-cases`, `db`, and `src`, not one
project's absolute or package-specific paths.

`no-silent-error-swallow` and `prefer-datetime-duration-arithmetic` came from
Emisoup's contextual plugin. The date rule uses a configurable source-path
scope so each project can apply it to its own application code.

## Not extracted

### HealthFit-only or infrastructure-specific ast-grep rules

- `no-core-migration-import`: points at a retired compatibility package.
- `no-nested-stack-use-sync`: Alchemy `Stack.useSync` resolution behavior.
- `no-parameterized-server-constructor`: assumes a particular DI boundary and
  would flag legitimate value-object constructors elsewhere.
- `no-raw-tool-optional-schema` and `no-raw-tool-parameter-schema`: depend on
  the project's Tool/ToolSchema API.
- `no-react-state-in-actor-runtime`: assumes an actor-owned React runtime.
- The imperative HTTP validation rules depend on the project's Effect HTTP
  schema conventions.

### Emisoup product rules

- `guard-rapid-submit-actions`: frontend mutation hooks and the Emisoup UI
  pending-state vocabulary.
- `no-ambient-runtime-dependency`: useful architecture, but its meaning comes
  from Emisoup's actor/workflow/runtime ownership and should stay in the
  project profile until a second Effect project supplies a stable contract.
- `no-handwritten-test-schema-ddl`: assumes generated test schema statements
  and a `schemaDdl` convention.
- `no-test-effect-runner-alias`: assumes the project's exact test-runner
  convention; keep local until shared test policy is intentional.
- `no-wrapped-tagged-error`: assumes every `new *Error` passed to `Effect.fail`
  is a tagged domain error.
- `no-abstract-domain-class` and `no-empty-private-constructor`: depend on
  which classes a project considers domain owners.
- `no-generic-platform-import`: needs a project-owned list of forbidden
  modules and contract paths, so a local configured rule is clearer.
- `no-effect-service-argument`: needs project service names and import-path
  conventions; the more stable service-facade rule is already in the Effect
  profile.
- `no-direct-fetch`: assumes a frontend API-client boundary.
- Workflow registration, task scheduling, detached task finalization, and
  sequential app-config resolution rules depend on Emisoup's workflow and
  backend files.
- `no-disable-validation`: the property is not universally forbidden; keep it
  as a product policy unless a project supplies an allowlist.
- `no-inline-discriminant-const` and `no-singular-plural-binding-pair` encode
  vocabulary or naming preferences with a high false-positive surface.
- `no-reassigned-composite-binding`: deterministic but too opinionated for a
  shared baseline; retain it as an Emisoup strict rule if desired.
- `prefer-object-arguments`: a reasonable local style rule, but not a general
  correctness contract and likely noisy at three positional parameters.

## Distribution decision

`emilint` is the right repository/folder name because it can hold more than
anti-slop rules later. `antislop` remains the Oxlint namespace and generic
profile name; `emi-antislop` would unnecessarily bind the package name to one
profile.

The package-first distribution is intentional:

1. Projects install one versioned dependency.
2. Oxlint loads the generated `emilint/oxlint` `.mjs` package export; Node
   cannot type-strip a `.ts` plugin under `node_modules`.
3. ast-grep reads the installed rule directory.
4. Project config owns paths, boundary exceptions, and profile selection.
5. `pnpm build` owns the committed Oxlint artifact. Portable agent guidance is
   owned by [`astahmer/agents`](https://github.com/astahmer/agents), while
   `nixfiles` assembles the pinned tool and skill inputs for machine deployment.

The concrete package, tarball, GitHub release, skill-vendoring, and update
workflows are documented in [`DISTRIBUTION.md`](DISTRIBUTION.md). There is no
custom emilint downloader: use the package manager for package dependencies,
`pnpm pack` for a reproducible local artifact, and `gh` only for GitHub release
assets.

Publishing is not done in this pass. The package is still private and can be
renamed to a scoped registry name when the registry/ownership choice is clear.
