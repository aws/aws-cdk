import * as path from 'path';
import * as fs from 'fs-extra';
import * as semver from 'semver';

type Flags = {[key: string]: any} | undefined

/* eslint-disable jest/no-export */

/**
 * jest helper function to be used when testing feature flags.
 *
 * This function is for writing jest tests that test feature flags that are present in CDKv1
 * and will be removed in CDKv2. This helps execute tests written for CDKv1 in the context of CDKv2.
 *
 * The version of CDK is determined by running `scripts/resolve-version.js`, and the logic is as follows:
 *
 * When run in CDKv1, the tests are executed as normal.
 *
 * When run in CDKv2, tests that are intended to verify the behaviour when the feature flag is set
 * (via CDK app context) are executed but without setting the app context. This is because CDKv2
 * defaults to the behaviour for the flag being enabled.
 *
 * When run in CDKv2, tests that are intended to verify the behaviour when the feature flag is not
 * set are skipped.
 */
export function withFeatureFlag<T>(
  name: string,
  flags: Flags,
  cdkApp: new (flags: Flags) => T,
  fn: (app: T) => void,
  repoRoot: string = path.join(process.cwd(), '..', '..', '..')) {

  const resolveVersionPath = path.join(repoRoot, 'scripts', 'resolve-version.js');
  if (!fs.existsSync(resolveVersionPath)) {
    throw new Error(`file not present at path ${resolveVersionPath}. You will likely need to set 'repoRoot'.`);
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ver = require(resolveVersionPath).version;
  const sem = semver.parse(ver);
  if (!sem) {
    throw new Error(`version ${ver} is not a semver`);
  }
  if (sem.major === 2) {
    if (flags === undefined || Object.keys(flags).length === 0) {
      // If no feature flag is set, the test is asserting the old behaviour, i.e., feature flag disabled
      // In CDKv2, this behaviour is not supported. Skip the test.
      return;
    } else {
      // If feature flags are passed, the test is asserting the new behaviour, i.e., feature flag enabled
      // In CDKv2, ignore the context as the default behaviour is as if the feature flag is enabled.
      const app = new cdkApp(undefined);
      return test(name, async () => fn(app));
    }
  }
  const app = new cdkApp({ context: flags });
  return test(name, () => fn(app));
}

/**
 * Same as withFeatureFlag() but used for test cases that verify behaviour
 * when the feature flag is disabled.
 */
export function withFeatureFlagDisabled<T>(
  name: string,
  cdkApp: new (flags: Flags) => T,
  fn: (app: T) => void,
  repoRoot: string = path.join(process.cwd(), '..', '..', '..')) {
  return withFeatureFlag(name, undefined, cdkApp, fn, repoRoot);
}