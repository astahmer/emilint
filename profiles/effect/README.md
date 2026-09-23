# effect-antislop

Opt-in rules for repositories that use Effect. The Oxlint plugin accepts one
options object per rule:

```json
{
  "domainPaths": ["packages/core/src/domain"],
  "implementationPaths": ["packages/core/src"],
  "databasePaths": ["packages/backend/src/db"],
  "streamPaths": ["packages/backend/src/streams"],
  "excludePaths": ["/tests/", "/generated/"]
}
```

Path values are fragments, not repository-root assumptions. `serviceNames`
adds Context.Service identifiers for `no-service-flat-map-facade`; the default
also recognizes names ending in `Database`, `Reader`, `Writer`, `Store`,
`Repository`, or `Service`.

`prefer-datetime-duration-arithmetic` applies to `src` paths by default. Set its
`paths` option to scope the rule to a project's application sources. Test,
specification, and benchmark files are skipped by filename.

The ast-grep rules are structural and intentionally have no `files` globs.
Run them only over the domain or implementation paths that match the project's
Effect architecture.
