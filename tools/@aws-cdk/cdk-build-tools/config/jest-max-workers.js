const { cpus } = require('node:os');

/**
 * Canonical jest maxWorkers policy for the CDK monorepo.
 *
 * Up to 50% of cores, but hard-capped at 8. On small and medium machines this
 * equals the old '50%'. On large CI machines (for example the 72 vCPU CodeBuild
 * box) it prevents the many packages running jest concurrently under build.sh
 * from spawning hundreds of workers and exhausting container memory (ENOMEM /
 * OOM kill). Per-worker memory is expected to grow over time (more code, more
 * default validations), so the worker count must be bounded rather than scale
 * with cores. This restores the pre-#30393 (commit 5ec3ec97cb) absolute cap.
 *
 * Override with the CDKBUILD_JEST_MAX_WORKERS environment variable (a positive
 * integer); any other value falls back to the computed cap.
 */
function jestMaxWorkers() {
  const override = Number(process.env.CDKBUILD_JEST_MAX_WORKERS);
  if (Number.isInteger(override) && override > 0) {
    return override;
  }
  return Math.max(1, Math.min(Math.floor(cpus().length / 2), 8));
}

module.exports = { jestMaxWorkers };
