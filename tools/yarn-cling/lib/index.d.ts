import { PackageLock, PackageLockEntry } from './types';
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
