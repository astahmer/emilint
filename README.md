# emilint

Reusable Oxlint and ast-grep policy for TypeScript projects.

The repository name is `emilint`; the rule family is `antislop`. The package is
split into profiles so a project can opt into the generic baseline and add the
Effect rules only when it actually uses Effect.

## Use from a project

Install this repository as a package dependency once it is published or served
from an internal registry:

```bash
pnpm add --save-dev emilint
```

Load the generic Oxlint plugin by package export:

```json
{
  "jsPlugins": [
    {
      "name": "antislop",
      "specifier": "emilint/oxlint"
    }
  ],
  "rules": {
    "antislop/no-chained-type-assertions": "error",
    "antislop/no-broad-object-parameters": "error",
    "antislop/no-reflect-get": "error"
  }
}
```

Load structural rules from the installed package in `sgconfig.yml`:

```yaml
ruleDirs:
  - node_modules/emilint/ast-grep/rules
testConfigs:
  - testDir: node_modules/emilint/ast-grep/tests
```

Use project paths or command-line globs to keep boundary rules away from public
entrypoints and tests where the project contract permits them.

Effect projects can load the opt-in profile alongside the generic plugin:

```json
{
  "jsPlugins": [
    {
      "name": "antislop",
      "specifier": "emilint/oxlint"
    },
    {
      "name": "effect-antislop",
      "specifier": "emilint/profiles/effect/oxlint"
    }
  ],
  "rules": {
    "effect-antislop/no-domain-effect-run": [
      "error",
      { "domainPaths": ["packages/core/src/domain"] }
    ]
  }
}
```

The package exports a generated `.mjs` Oxlint entrypoint because Node refuses
to type-strip TypeScript files under `node_modules`. The TypeScript source stays
in the repository and `pnpm build` regenerates `dist/oxlint/index.mjs`.

## Profiles

- `antislop`: generic TypeScript/JavaScript evidence, boundary, reflection,
  assertion, mocking, and data-shape rules.
- `effect-antislop`: Effect-specific program ownership, service context,
  database, stream, and concurrency rules. It accepts repository-local path
  fragments in its first options object.
- ast-grep rules are structural and intentionally do not encode one project's
  `packages/`, `apps/`, or public-boundary filenames.

Every rule has one canonical checker. Semantic and scope-sensitive rules live
in Oxlint; syntax-only rules live in ast-grep.

## Local validation

The package does not install a second Oxlint or ast-grep binary implicitly.
Run the checks with the versions selected by the consuming workspace, or add
those tools as dev dependencies in a published package workflow:

```bash
pnpm test
```

See [CATALOG.md](CATALOG.md) for rule intent and [SURVEY.md](SURVEY.md) for
the extraction decisions from the projects under `~/dev`.
