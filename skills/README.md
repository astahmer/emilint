# Portable engineering skills

These are opt-in workflow skills extracted from repeated repository guidance.
They are deliberately product-neutral: a consuming repository supplies its own
paths, commands, framework choices, and policy exceptions.

| Skill                         | Use when                                                                           |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| `runtime-boundary-audit`      | Reviewing ownership between UI, actors, services, adapters, and package boundaries |
| `actor-state-ownership`       | Designing XState or actor-based frontend state and async work                      |
| `durable-async-work`          | Deciding whether work should be inline, queued, retried, cancelled, or resumed     |
| `safe-transformations`        | Running codemods, migrations, generators, or other source-to-source changes        |
| `focused-validation`          | Choosing proportionate checks and reporting evidence without noisy full-suite runs |
| `library-architecture`        | Designing public APIs, registries, adapters, and extension points                  |
| `frontend-evidence-audit`     | Auditing React behavior with static findings plus browser/runtime evidence         |
| `generated-artifact-workflow` | Changing schemas, specifications, generated clients, snapshots, or derived files   |

These skills do not replace project-specific runbooks. They provide the
portable contract; the project keeps its concrete commands and local ownership
rules. See [`DISTRIBUTION.md`](../DISTRIBUTION.md) for package, tarball, and
selective-vendoring workflows.
