---
name: generated-artifact-workflow
description: Change schemas, specifications, migrations, generated clients, snapshots, and derived files through their source of truth.
---

# Generated artifact workflow

Use when a repository contains generated code, migrations, snapshots, schemas,
clients, metadata, manifests, or other derived output.

## Contract

Treat the source specification, schema, preset, configuration, or input corpus
as authoritative. Treat generated files as outputs and evidence of the current
source, not as a second implementation.

## Workflow

1. Locate the source of truth, generator, output paths, freshness markers, and
   consumer checks before editing.
2. Change the source or generator configuration, not the derived output.
3. Run the pinned generator or repository command.
4. Inspect the generated diff for accidental scope, imports, paths, and
   semantic changes.
5. Run focused generated-consumer typechecks/tests and the relevant runtime
   matrix.
6. Verify freshness, snapshots, migration application, or reconciliation
   checks before claiming completion.

Never hand-edit generated output to hide a source-of-truth or generator bug.
If an exceptional manual migration or fixture is necessary, document the
exception, ownership, and follow-up reconciliation path.
