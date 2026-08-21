# graduate-module

Automates graduating an experimental `@aws-cdk/aws-<service>-alpha` module into stable `aws-cdk-lib`.

> **Status: scaffold.** The mechanical transforms are implemented; the highest-risk
> steps (import rewriting, custom-resource migration) run automatically but are
> logged to a review report, and a few genuinely un-automatable steps are recorded
> as manual follow-ups. Always review `graduation-report.md` and the diff before
> opening a PR.

## Usage

```sh
# Preview everything without touching files
graduate-module aws-glue --dry-run

# Perform the stabilization move (adds the module to aws-cdk-lib; leaves the alpha in place)
graduate-module aws-glue

# Follow-up PR: delete the alpha package after the stable version has shipped
graduate-module aws-glue --cleanup
```

The `<service>` argument is accepted in any form: `glue`, `aws-glue`,
`aws-glue-alpha`, or `@aws-cdk/aws-glue-alpha`.

## What it does

**Phase 1 — Pre-flight (read-only):** scans for `@deprecated` APIs (warn, or block
with `--strict`), heuristically flags jsii-incompatible union types, probes whether
the target submodule already exists, and detects custom resources.

**Phase 2 — Move:**

| Step | Action |
|------|--------|
| Sources | Copy L2 `lib/*.ts` (skip generated L1s) into `aws-cdk-lib/aws-<svc>/lib`, merge the barrel |
| Imports | Rewrite `aws-cdk-lib` package imports to relative monorepo imports (every rewrite logged) |
| Tests | Unit tests → submodule `test/`; integ tests → `framework-integ` (imports retargeted) |
| awslint | Merge `exclude[]`, rewriting `@aws-cdk/aws-<svc>-alpha.` → `aws-cdk-lib.aws_<svc>.` |
| grants.json | Move into the submodule (spec2cdk regenerates the `*Grants` classes) |
| rosetta | Move fixtures into `aws-cdk-lib/rosetta/aws_<svc>/` |
| README | Move and strip the stability banner |
| Custom resources | Copy handler source into the central package under a non-alpha key (config edit is a manual step) |

**Phase 3 — Self-test:** build `aws-cdk-lib`, run the module's unit tests, awslint,
rosetta, build `framework-integ`, and lint.

## Design notes

- **Alpha deletion is deferred.** Stabilization leaves the alpha package in place;
  `--cleanup` deletes it in a separate follow-up PR, matching CDK precedent.
- **Auto + flag for review.** Risky transforms are applied automatically but every
  change is recorded in `graduation-report.md`. Exit code `2` means manual items remain.
- **No git.** The tool does not create branches, stash, or commit — it just mutates
  files in place. Create a branch and review/commit the diff yourself. To re-run,
  reset the working tree first (`git checkout` / `git clean`); collisions with
  existing stable files abort rather than overwrite.
