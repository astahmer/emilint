# AGENTS and skills survey

Survey date: 2026-09-22. Scope: `/Users/astahmer/dev`, including hidden
`.agents`, `.codex`, `.claude`, and `.opencode` directories, excluding
`node_modules` and VCS internals.

## Inventory

- 44 `AGENTS.md` files.
- 289 `SKILL.md` files.
- 152 unique file contents after deduplicating repeated worktree copies.

Most repetition comes from Pandwind migration worktrees, Emisoup audit
worktrees, and Welii backend skill trees. The repeated files were treated as
one source until a variant added a genuinely different contract.

## Extracted into emilint

These patterns appeared across multiple projects or had a clean product-neutral
form:

| Skill                         | Main sources                                                                              | Generalization                                                                                |
| ----------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `runtime-boundary-audit`      | Emisoup and HealthFit runtime-boundary skills; AGENTS API/effect rules                    | UI, actor, service, adapter, package, and transport ownership without product paths           |
| `actor-state-ownership`       | Emisoup and HealthFit XState guidance                                                     | React presentation versus actor lifecycle, URL state, cancellation, and stale work            |
| `durable-async-work`          | Emisoup async-tasks and loop-batching guidance; Welii queue skills                        | Durable lifecycle, idempotency, retries, reaping, bounded progress, and explicit concurrency  |
| `safe-transformations`        | Pandwind codemod/migration skills; typed-openapi and generated-client guidance            | Preview, residuals, adapter ownership, idempotence, and runtime proof                         |
| `focused-validation`          | Emisoup release handoff; Actual, Formula, Dadabase, and typed-openapi validation guidance | Focused proof first, broad gates by scope, real-boundary tests, baseline separation           |
| `library-architecture`        | Pandwind interface-first and implementation-locality rules                                | Small public APIs, registries, neutral orchestration, injectable adapters, substitution tests |
| `frontend-evidence-audit`     | Emisoup/HealthFit React audit skills; Vitrine and Chrome DevTools workflows               | Machine findings plus browser evidence, leverage triage, and self-contained plans             |
| `generated-artifact-workflow` | Pandwind, Emisoup, Welii, typed-openapi, and Nix generated-output rules                   | Source of truth → generator → inspect → consumer/runtime validation                           |

The extracted skills intentionally omit repository commands, package names,
absolute paths, credentials, and product vocabulary. Projects supply those in
their local overlay.

## Already shared; not duplicated blindly

The Nix-managed global skill source at `nixfiles/assets/.agents/skills` already
contains reusable versions of `ast-outline`, `antislop`, `effect-antislop`,
`bug-investigation`, `browser-debugging`, `database-investigation`,
`generated-artifact-workflow`, `library-documentation-first`, `security-review`,
`structured-observability`, `compact-test-evidence`, `jj`, and related tooling.

The emilint copies are condensed vendor-friendly profiles. A future migration
should choose one source of truth and have Nix sync from it; maintaining both
trees independently would recreate the drift this survey is meant to remove.

## Kept project-local

These did not qualify for a portable profile:

- Actual-specific PR prefixes, VRT Docker workflow, release-note voice, and
  package architecture.
- Emisoup test-account/org-access setup, Pencil exports, design-system page
  registry, search schema/index details, and provider-specific runbooks.
- Pandwind typed API usage, target dialect vocabulary, generated bridge layout,
  and migration adapter inventory. The generic transformation and architecture
  contracts were extracted; Pandwind syntax remains local.
- Welii AMQP, Bull, MikroORM/Kysely, permission middleware, and feature-module
  instructions.
- Formula Better Auth, TanStack DB, Chrome extension, LinkedIn scraping, and
  React Scan setup.
- Nix/Home Manager activation, secret aliases, binary-cache policy, local
  machine packages, and deployment commands.
- Dadabase startup/MCP connection details, ntfy deployment/auth steps, GDPR
  service URLs, Folio file conventions, and other operational runbooks.
- Shadcn component composition rules and other design-system-specific markup.

These may be excellent local skills. They either require a concrete product,
machine, framework, credential, or file layout, or would become noisy when
applied as a shared baseline.

## Boundary decision

`emilint` now has two layers:

1. executable `antislop` and Effect lint profiles;
2. opt-in `skills/` for portable engineering workflows.

It is still not a replacement for project AGENTS files. The project owns its
commands, paths, deployment facts, and deliberate exceptions; emilint owns
portable quality contracts and deterministic checks.
