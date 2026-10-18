import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const oxlintBinary = process.env.OXLINT_BIN ?? "oxlint";

const runOxlint = (config, fixture, quiet = true) =>
  spawnSync(oxlintBinary, ["--config", config, ...(quiet ? ["--quiet"] : []), fixture], {
    cwd: repositoryRoot,
    encoding: "utf8",
  });

const assertExit = (result, expected, description) => {
  if (result.status === expected) return;
  throw new Error(
    `${description} expected exit ${expected}, received ${result.status}.\n${result.stdout ?? ""}${result.stderr ?? ""}`,
  );
};

const checks = [
  [
    "oxlint.test.config.json",
    "tests/oxlint/valid-broad-object.ts",
    0,
    "valid broad-object fixture",
  ],
  [
    "oxlint.test.config.json",
    "tests/oxlint/invalid-broad-object.ts",
    1,
    "invalid broad-object fixture",
  ],
  ["oxlint.test.config.json", "tests/oxlint/valid-reflect.ts", 0, "valid reflect fixture"],
  ["oxlint.test.config.json", "tests/oxlint/invalid-reflect.ts", 1, "invalid reflect fixture"],
  ["oxlint.test.config.json", "tests/oxlint/valid-generic.ts", 0, "valid generic fixture"],
  [
    "oxlint.test.config.json",
    "tests/oxlint/valid-passthrough-variable.ts",
    0,
    "valid passthrough-variable fixture",
  ],
  [
    "oxlint.export-bag.test.config.json",
    "tests/oxlint/valid-export-bag.ts",
    0,
    "valid export-bag fixture",
  ],
  [
    "oxlint.export-bag.test.config.json",
    "tests/oxlint/invalid-export-bag.ts",
    1,
    "invalid export-bag fixture",
  ],
  [
    "oxlint.export-bag.options.test.config.json",
    "tests/oxlint/invalid-export-bag.ts",
    0,
    "custom export-bag threshold below minimum",
  ],
  [
    "oxlint.export-bag.options.test.config.json",
    "tests/oxlint/threshold-export-bag-four.ts",
    1,
    "custom export-bag threshold reached",
  ],
  [
    "oxlint.export-bag.options.test.config.json",
    "tests/oxlint/excluded-export-bag.ts",
    0,
    "excluded export-bag fixture",
  ],
  [
    "profiles/effect/oxlint.test.config.json",
    "profiles/effect/tests/oxlint/adapters/valid-run.ts",
    0,
    "valid Effect adapter fixture",
  ],
  [
    "profiles/effect/oxlint.test.config.json",
    "profiles/effect/tests/oxlint/domain/invalid-run.ts",
    1,
    "invalid Effect domain fixture",
  ],
  [
    "profiles/effect/oxlint.test.config.json",
    "profiles/effect/tests/oxlint/implementation/valid-silent-error.ts",
    0,
    "valid silent-error fixture",
  ],
  [
    "profiles/effect/oxlint.test.config.json",
    "profiles/effect/tests/oxlint/implementation/invalid-silent-error.ts",
    1,
    "invalid silent-error fixture",
  ],
];

for (const [config, fixture, expected, description] of checks) {
  assertExit(runOxlint(config, fixture), expected, description);
}

const genericViolationRules = [
  "no-chained-type-assertions",
  "no-conditional-empty-object-spread",
  "no-known-value-widening",
  "no-module-mocking",
  "no-broad-object-parameters",
  "no-passthrough-variable",
  "no-reflect-apply",
  "no-reflect-get",
  "no-runtime-typeof",
  "no-unsafe-dictionary-type",
  "no-unknown-parameters",
  "no-unknown-returns",
  "no-unknown-type-aliases",
  "no-widen-then-assert",
  "require-safety-comment-for-type-assertion",
];
const invalidGenericResult = runOxlint(
  "oxlint.test.config.json",
  "tests/oxlint/invalid-generic.ts",
  false,
);
assertExit(invalidGenericResult, 1, "invalid generic fixture");
const invalidGenericOutput = `${invalidGenericResult.stdout ?? ""}${invalidGenericResult.stderr ?? ""}`;
for (const rule of genericViolationRules) {
  if (!invalidGenericOutput.includes(`anti-slop(${rule})`)) {
    throw new Error(`invalid generic fixture did not exercise anti-slop/${rule}`);
  }
}

console.log(
  `Oxlint fixtures passed (${checks.length + 1} checks and ${genericViolationRules.length} rule hits).`,
);
