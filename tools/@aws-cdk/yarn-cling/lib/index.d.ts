import { PackageLock, PackageLockEntry, PackageLockPackage } from './types';
export interface ShrinkwrapOptions {
    /**
     * The package.json file to start scanning for dependencies
     */
    packageJsonFile: string;
    /**
     * The output lockfile to generate
     *
     * @default - Don't generate the file, just return the calculated output
     */
    outputFile?: string;
    /**
     * Whether to hoist dependencies
     *
     * @default true
     */
    hoist?: boolean;
}
export declare function generateShrinkwrap(options: ShrinkwrapOptions): Promise<PackageLock>;
export declare function formatPackageLock(entry: PackageLockEntry): string;
/**
 * We may sometimes try to adjust a package version to a version that's incompatible with the declared requirement.
 *
 * For example, this recently happened for 'netmask', where the package we
 * depend on has `{ requires: { netmask: '^1.0.6', } }`, but we need to force-substitute in version `2.0.1`.
 *
 * If NPM processes the shrinkwrap and encounters the following situation:
 *
 * ```
 * {
 *   netmask: { version: '2.0.1' },
 *   resolver: {
 *     requires: {
 *       netmask: '^1.0.6'
 *     }
 *   }
 * }
 * ```
 *
 * NPM is going to disregard the swhinkrwap and still give `resolver` its own private
 * copy of netmask `^1.0.6`.
 *
 * We tried overriding the `requires` version, and that works for `npm install` (yay)
 * but if anyone runs `npm ls` afterwards, `npm ls` is going to check the actual source
 * `package.jsons` against the actual `node_modules` file tree, and complain that the
 * versions don't match.
 *
 * We run `npm ls` in our tests to make sure our dependency tree is sane, and our customers
 * might too, so this is not a great solution.
 *
 * To cut any discussion short in the future, we're going to detect this situation and
 * tell our future selves that is cannot and will not work, and we should find another
 * solution.
 */
export declare function checkRequiredVersions(root: PackageLock | PackageLockPackage): void;
