import { PackageLockPackage } from "./types";
/**
 * Hoist package-lock dependencies in-place
 */
export declare function hoistDependencies(packageLockDeps: Record<string, PackageLockPackage>): void;
