import * as path from 'path';
import * as fs from 'fs-extra';
import * as semver from 'semver';

/* eslint-disable jest/no-export */

type Flags = {[key: string]: any};

/**
 * jest helper function to be used when testing future flags. Twin function of the `testLegacyBehavior()`.
 * This should be used for testing future flags that will be removed in CDKv2, and updated such that these
 * will be the default behaviour.
 *
 * This function is specifically for unit tests that verify the behaviour when future flags are enabled.
 *
 * The version of CDK is determined by running `scripts/resolve-version.js`, and the logic is as follows:
 *
 * When run in CDKv1, the specified 'flags' parameter are passed into the CDK App's context, and then
 * the test is executed.
 *
 * When run in CDKv2, the specified 'flags' parameter is ignored, since the default behaviour should be as if
 * they are enabled, and then the test is executed.
 */
export function testFutureBehavior<T>(
  name: string,
  flags: Flags,
  cdkApp: new (props?: { context: Flags }) => T,
  fn: (app: T) => void,
  repoRoot: string = path.join(process.cwd(), '..', '..', '..')) {

  const major = cdkMajorVersion(repoRoot);
  if (major === 2) {
    // In CDKv2, the default behaviour is as if the feature flags are enabled. So, ignore the feature flags passed.
    const app = new cdkApp();
    return test(name, async () => fn(app));
  }
  const app = new cdkApp({ context: flags });
  return test(name, () => fn(app));
}

/**
 * jest helper function to be used when testing future flags. Twin function of the `testFutureBehavior()`.
 * This should be used for testing future flags that will be removed in CDKv2, and updated such that these
 * will be the default behaviour.
 *
 * This function is specifically for unit tests that verify the behaviour when future flags are disabled.
 *
 * The version of CDK is determined by running `scripts/resolve-version.js`, and the logic is as follows:
 *
 * When run in CDKv1, the test is executed as normal.
 *
 * When run in CDKv2, the test is skipped, since the feature flag usage is unsupported and blocked.
 */
export function testLegacyBehavior<T>(
  name: string,
  cdkApp: new () => T,
  fn: (app: T) => void,
  repoRoot: string = path.join(process.cwd(), '..', '..', '..')) {

  const major = cdkMajorVersion(repoRoot);
  if (major === 2) {
    // In CDKv2, legacy behaviour is not supported. Skip the test.
    return;
  }
  const app = new cdkApp();
  return test(name, () => fn(app));
}

function cdkMajorVersion(repoRoot: string) {
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
  return sem.major;
}