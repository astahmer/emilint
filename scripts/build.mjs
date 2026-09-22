import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const result = spawnSync(
  "esbuild",
  [
    "oxlint/index.ts",
    "--bundle",
    "--format=esm",
    "--platform=node",
    "--outfile=dist/oxlint/index.mjs",
    "--log-level=warning",
  ],
  {
    cwd: repositoryRoot,
    stdio: "inherit",
  },
);

if (result.status !== 0) process.exit(result.status ?? 1);

console.log("Generated dist/oxlint/index.mjs from oxlint/index.ts.");
