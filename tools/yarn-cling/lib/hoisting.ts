import { PackageLockPackage } from "./types";

/**
 * Hoist package-lock dependencies in-place
 */
export function hoistDependencies(packageLockDeps: Record<string, PackageLockPackage>) {
  for (const pkg of Object.values(packageLockDeps)) {
    recurse(pkg, packageLockDeps);
  }

  return packageLockDeps;

  // For each of the deps, move each dependency that has the same version into the current array
  function recurse(mutableParent: PackageLockPackage, into: Record<string, PackageLockPackage>) {
    if (!mutableParent.dependencies) { return; }

    // First simplify each child of the mutable parent (this may add more dependencies into the
    // mutable parent)
    for (const depPackage of Object.values(mutableParent.dependencies)) {
      // First simplify the package in question as much as possible
      recurse(depPackage, mutableParent.dependencies);
    }

    // Then push packages from the mutable parent into ITS parent
    for (const [depName, depPackage] of Object.entries(mutableParent.dependencies)) {
      if (!into[depName]) {
        // It's new, we can move it up.
        // tslint:disable-next-line:no-console
        into[depName] = depPackage;
        delete mutableParent.dependencies[depName];
      } else if (into[depName].version === depPackage.version) {
        // Already exists, no conflict, delete the child
        // tslint:disable-next-line:no-console
        delete mutableParent.dependencies[depName];
      }
      // Else: there is a conflict, leave the second package where it is.
    }

    // Cleanup for nice printing
    if (Object.keys(mutableParent.dependencies).length === 0) {
      delete mutableParent.dependencies;
    }
  }
}
