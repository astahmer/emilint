# emilint

Reusable code-quality rules and profiles for TypeScript projects.

The repository name is `emilint`; the executable rule family is `antislop`.
The package is split into profiles so a project can opt into the generic
baseline or add the Effect rules only when it actually uses Effect.

## Use from a project

Install the public GitHub repository directly:

```bash
pnpm add --save-dev astahmer/emilint#main
```

pnpm records the resolved Git commit in `pnpm-lock.yaml`; commit that lockfile
so local installs and CI use the same rules. Replace `main` with a commit hash
in `package.json` too when you want the dependency declaration itself pinned.
See [`DISTRIBUTION.md`](DISTRIBUTION.md) for update guidance.

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
```

The starting-point file is also available at
`node_modules/emilint/configs/sgconfig-generic.yml`. Keep `testConfigs` for
emilint's own fixtures out of a consumer config unless the consumer is
intentionally running those upstream tests.

Run the configured structural profile with:

```bash
pnpm exec ast-grep scan --config sgconfig.yml src
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

The generic Oxlint starter config enables 13 of the 14 generic rules.
`antislop/no-module-mocking` is deliberately opt-in because some test suites
need module replacement. The complete rule IDs and profile status are in
[`CATALOG.md`](CATALOG.md).

## Portable agent guidance

Portable workflow skills extracted from the projects under `~/dev` are
maintained in the [`astahmer/agents`](https://github.com/astahmer/agents)
repository. This package intentionally does not duplicate that general skill
catalog; it owns executable lint rules and the two lint companion skills under
`skills/`.

Keep project commands, paths, runtime choices, and exceptions in the project's
local AGENTS or skill overlay. The practice extraction decisions live in the
[`agents` survey](https://github.com/astahmer/agents/blob/main/PRACTICES-SURVEY.md).

## Local validation

The package does not install a second Oxlint or ast-grep binary implicitly.
Run the checks with the versions selected by the consuming workspace, or add
those tools as dev dependencies in a published package workflow:

```bash
pnpm test
```

This command tests emilint itself. It does not automatically lint a consuming
repository; consumers run their own `oxlint` and `ast-grep scan` commands.

See [CATALOG.md](CATALOG.md) for rule intent and status, [DISTRIBUTION.md](DISTRIBUTION.md)
for adoption and updates, and [SURVEY.md](SURVEY.md) for the extraction
decisions from the projects under `~/dev`.
