# `individual-pkg-gen`

The tool contains the logic of the copying the packages we release individually,
instead of vending them inside `aws-cdk-lib`,
from their original V1 form in `packages/@aws-cdk/` to `packages/individual-packages`.
It's called from the [`transform.sh` script](../../../scripts/transform.sh).

We do the translation in 2 phases:

1. Copy all files from the V1 versions of the modules,
  and remove all dependencies from the packages besides other experimental ones.
  Save the original dependencies in a `_package.json` files of the copied modules.
  This is done in the [`transform-packages.ts` file](transform-packages.ts).
2. Run `lerna bootstrap`.
3. In phase 2, bring back the dependencies by renaming the `_package.json` files to `package.json`.
   This is done in the [`restore-package-jsons.ts` file](restore-package-jsons.ts).

We have to do it this way,
because otherwise `lerna bootstrap` would fail on the main monorepo packages like `cdk-build-tools`.

The entrypoint of the package is the [`bin/individual-pkg-gen` file](bin/individual-pkg-gen).
