"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testLegacyBehavior = exports.testFutureBehavior = void 0;
const path = require("path");
const fs = require("fs-extra");
const semver = require("semver");
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
function testFutureBehavior(name, flags, cdkApp, fn, repoRoot = path.join(process.cwd(), '..', '..', '..')) {
    const major = cdkMajorVersion(repoRoot);
    if (major === 2) {
        const app = new cdkApp();
        return test(name, async () => fn(app));
    }
    const app = new cdkApp({ context: flags });
    return test(name, () => fn(app));
}
exports.testFutureBehavior = testFutureBehavior;
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
function testLegacyBehavior(name, cdkApp, fn, repoRoot = path.join(process.cwd(), '..', '..', '..')) {
    const major = cdkMajorVersion(repoRoot);
    if (major === 2) {
        return;
    }
    const app = new cdkApp();
    return test(name, () => fn(app));
}
exports.testLegacyBehavior = testLegacyBehavior;
function cdkMajorVersion(repoRoot) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVhdHVyZS1mbGFnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmVhdHVyZS1mbGFnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFDL0IsaUNBQWlDO0FBTWpDOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0gsU0FBZ0Isa0JBQWtCLENBQ2hDLElBQVksRUFDWixLQUFZLEVBQ1osTUFBNkMsRUFDN0MsRUFBb0IsRUFDcEIsV0FBbUIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUM7SUFFN0QsTUFBTSxLQUFLLEdBQUcsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3hDLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtRQUNmLE1BQU0sR0FBRyxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7UUFDekIsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDeEM7SUFDRCxNQUFNLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBZEQsZ0RBY0M7QUFFRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxTQUFnQixrQkFBa0IsQ0FDaEMsSUFBWSxFQUNaLE1BQW1CLEVBQ25CLEVBQW9CLEVBQ3BCLFdBQW1CLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDO0lBRTdELE1BQU0sS0FBSyxHQUFHLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN4QyxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7UUFDZixPQUFPO0tBQ1I7SUFDRCxNQUFNLEdBQUcsR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO0lBQ3pCLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBWkQsZ0RBWUM7QUFFRCxTQUFTLGVBQWUsQ0FBQyxRQUFnQjtJQUN2QyxNQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQ2hGLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLEVBQUU7UUFDdEMsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsa0JBQWtCLDJDQUEyQyxDQUFDLENBQUM7S0FDNUc7SUFDRCxpRUFBaUU7SUFDakUsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDO0lBQ2hELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDOUIsSUFBSSxDQUFDLEdBQUcsRUFBRTtRQUNSLE1BQU0sSUFBSSxLQUFLLENBQUMsV0FBVyxHQUFHLGtCQUFrQixDQUFDLENBQUM7S0FDbkQ7SUFDRCxPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUM7QUFDbkIsQ0FBQyJ9