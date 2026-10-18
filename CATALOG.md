# Rule catalog

Each rule states a durable contract: avoid the low-evidence shape, prefer the
named or validated alternative, and keep the checker in exactly one tool.

## Exposed rule inventory

| Surface                          | Count | Enablement                                                                           |
| -------------------------------- | ----: | ------------------------------------------------------------------------------------ |
| `antislop/*` Oxlint rules        |    16 | 14 in the generic starter config; `no-module-mocking` and `no-export-bag` are opt-in |
| Generic ast-grep rules           |     9 | Load `ruleDirs`, then select paths or rules appropriate to the project               |
| `effect-antislop/*` Oxlint rules |     9 | Effect projects only; enable explicitly with path options                            |
| Effect ast-grep rules            |     4 | Effect projects only; load the Effect rule directory explicitly                      |

The package exports these surfaces through the paths shown in
[`DISTRIBUTION.md`](DISTRIBUTION.md). The rule names below are unqualified;
Oxlint IDs use the `antislop/` or `effect-antislop/` prefix shown above.

## Generic Oxlint profile

The rules below are enabled by `configs/oxlint-generic.json` unless marked
`opt-in`.

| Rule                                        | Avoid                                                                               | Prefer                                                                            | Why                                                                             |
| ------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `no-chained-type-assertions`                | `value as unknown as Target`                                                        | Parse, validate, or narrow once at the boundary                                   | Chained assertions discard evidence twice.                                      |
| `no-broad-object-parameters`                | Function inputs typed as `object`                                                   | A named owner type or boundary-decoded value                                      | Broad inputs erase the caller contract.                                         |
| `no-conditional-empty-object-spread`        | Conditional spreads that add `{}`                                                   | An explicit branch or named builder                                               | Output shape should remain visible.                                             |
| `no-export-bag` `[opt-in]`                  | Three or more peer lowercase callable exports in a non-test module                  | A namespace class with static methods; inject dependencies through a service      | Cohesive domain operations need one explicit owner.                             |
| `no-known-value-widening`                   | Widening a known initializer to `object`, `Record`, or another anonymous broad type | Preserve inference, `satisfies`, or a named owner contract                        | Widening throws away evidence the initializer already has.                      |
| `no-module-mocking` `[opt-in]`              | Vitest/Jest module replacement in application tests                                 | Dependency injection or a faithful in-memory implementation                       | Mocks can hide broken wiring. Enable only when the test architecture allows it. |
| `no-passthrough-variable`                   | A local `const alias = source` binding with no transform                            | Use `source` directly; explain required snapshots or narrowing with a suppression | Passthrough names obscure ownership without adding behavior.                    |
| `no-reflect-apply`                          | Global `Reflect.apply`                                                              | A typed direct call or named adapter                                              | Reflection hides the callable contract.                                         |
| `no-reflect-get`                            | Global `Reflect.get`                                                                | Typed property access or a validated adapter                                      | Reflection bypasses ordinary type evidence.                                     |
| `no-runtime-typeof`                         | `typeof` as a decoder for unparsed values                                           | Decode at the boundary, then narrow typed data                                    | Runtime probes are not a substitute for a contract.                             |
| `no-unknown-parameters`                     | `unknown` or `Promise<unknown>` internal inputs                                     | Decode first and accept a named validated type                                    | Internal callers need a usable contract.                                        |
| `no-unknown-returns`                        | `unknown` return contracts                                                          | Return a named validated type                                                     | Callers should not repeat boundary work.                                        |
| `no-unknown-type-aliases`                   | Aliases that merely hide `unknown`                                                  | Keep `unknown` at the parsing boundary                                            | Naming an escape hatch does not validate it.                                    |
| `no-unsafe-dictionary-type`                 | Dictionaries whose values are `unknown`, `any`, `object`, or `{}`                   | A named or schema-derived value type                                              | Dictionary reads otherwise spread uncertainty.                                  |
| `no-widen-then-assert`                      | Widening a known value and asserting it back                                        | Preserve the precise value type                                                   | The assertion launders lost evidence.                                           |
| `require-safety-comment-for-type-assertion` | Unexplained non-const assertions                                                    | A real narrowing operation or a nearby invariant comment                          | Unavoidable assertions need a stated invariant.                                 |

`no-export-bag` defaults to three callable exports and accepts `minExports` and `excludePaths` options. It ignores hook exports (`useX`), PascalCase names, TSX, test/spec files, e2e, generated, and `node_modules` paths.

## Generic ast-grep profile

| Rule                                 | Avoid                                                    | Prefer                                           | Why                                                          |
| ------------------------------------ | -------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------ |
| `no-database-row-spread`             | Spreading a row or caller record into an output          | Enumerate fields crossing the boundary           | Output contracts should not inherit storage or caller shape. |
| `no-deeply-nested-ternary`           | Three-or-more-level cascading ternaries                  | A `Record`, `switch`, or explicit state branches | Branch meaning becomes hard to review.                       |
| `no-direct-json-parse`               | Direct `JSON.parse` at transport or untrusted boundaries | The repository's validated decoder               | External data must be decoded once.                          |
| `no-raw-response-json-assertion`     | `(await response.json()) as Target`                      | Runtime validation followed by a typed result    | A static assertion cannot verify response data.              |
| `no-export-from`                     | Implementation-level re-exports                          | Bind exports in a public boundary                | Ownership stays explicit.                                    |
| `no-index-import`                    | Internal imports naming `index.ts`                       | Import the implementation or explicit boundary   | Hidden barrels obscure the dependency.                       |
| `no-internal-export-boundary-import` | Internal imports through `mod.ts`                        | Import the owning implementation                 | Public boundaries should be one-way.                         |
| `no-internal-forwarding-class`       | A class that only forwards a static member               | Use the owning domain directly                   | Empty nominal wrappers add no behavior.                      |
| `no-wildcard-export`                 | `export *` in implementation modules                     | Explicit named exports at the public boundary    | The public contract stays inspectable.                       |

## Effect profile

The Effect profile is opt-in and accepts path fragments so it does not assume
`packages/backend`, `apps/api`, or any other repository layout.

- `prefer-datetime-duration-arithmetic`: keep elapsed-time math in Effect
  `DateTime`/`Duration` values; convert to `Date` only at the boundary.
- `no-domain-effect-run`: preserve `Effect` programs in domain code; run them
  only at an outer application or platform edge.
- `no-effect-context-reprovide`: do not capture and re-provide context inside
  implementation code.
- `no-catch-if-tagged-error`: use `catch` or `catchTag` for tagged errors;
  reserve `catchIf` for genuinely predicate-based recovery.
- `no-service-flat-map-facade`: yield a service once instead of building static
  `Effect.flatMap(ServiceKey, ...)` facades.
- `no-fallible-database-promise`: preserve database failure channels with a
  tagged `tryPromise` boundary.
- `no-untyped-readable-stream-error`: map raw stream causes to a typed domain
  error.
- `no-sequential-effect-yield-in-loop`: batch independent work with
  `Effect.forEach` or `Effect.all`, or document required ordering.
- `no-silent-error-swallow`: do not recover an Effect with `Effect.void` or
  `Effect.unit` without an explicit meaningful policy.
- `no-local-effect-provide-wrapper` and
  `no-unnecessary-effect-provider-wrapper`: compose layers once at the outer
  boundary instead of hiding or nesting provider wrappers.
- `no-variadic-effect-schema-literal`: use `Schema.Literals` for multiple
  literal values.
- `require-explicit-schema-declare-type-guard`: a `Schema.declare` predicate
  must explicitly narrow to its declared type.

## Deliberate non-adoptions

Rules from the source projects stay local when their meaning depends on a
product path, package name, framework wrapper, migration, or vocabulary. The
full list and the reason for each exclusion are in [SURVEY.md](SURVEY.md).
