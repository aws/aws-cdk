import { PackageLockPackage } from './types';
/**
 * Hoist package-lock dependencies in-place
 *
 * This happens in two phases:
 *
 * 1) Move every package into the parent scope (as long as it introduces no conflicts).
 *    This step mutates the dependency tree.
 * 2) Once no more packages can be moved up, clean up the tree. This step mutates the
 *    tree declarations but cannot change versions of required packages. Two cleanups:
 *    2a) Remove duplicates down the tree (same version that is inherited from above)
 *    2b) Remove useless packages that aren't depended upon by anything in that subtree.
 *        To determine whether a package is useful or useless in a tree, we record
 *        each package's original dependencies before we start messing around in the
 *        tree.
 *
 * This two-phase process replaces a proces that did move-and-delete as one step, which
 * sometimes would hoist a package into a place that was previously vacated by a conflicting
 * version, thereby causing the wrong version to be loaded.
 *
 * Hoisting is still rather expensive on a large tree (~100ms), we should find ways to
 * speed it up.
 */
export declare function hoistDependencies(packageTree: PackageLockPackage): void;
export declare function renderTree(tree: PackageLockPackage): string[];
