# `individual-packages-gen`

The tool contains the logic of the copying the packages we release individually,
instead of vending them inside `aws-cdk-lib`,
from their original V1 form in `packages/@aws-cdk/` to `packages/individual-packages`.
It's called from the [`transform.sh` script](../../scripts/transform.sh).

We do the translation in 2 phases:

1. Copy all files from the V1 versions of the modules,
  and remove all dependencies from the packages besides other experimental ones.
  Save the dependencies in keys like `tmp_dependencies`,
  `tmp_devDependencies`, etc. in the `package.json` files of the copied modules.
   This is done in the [`gen-phase1.js` file](gen-phase1.ts).
2. Run `lerna bootstrap`.
3. In phase 2, bring back the dependencies using the `tmp_` keys saved in the files.
   This is done in the [`gen-phase2.js` file](gen-phase2.ts).

We have to do it this way,
because otherwise `lerna bootstrap` would fail on the main monorepo packages like `cdk-build-tools`.

The entrypoint of the package is the [`bin/individual-packages-gen.sh` file](bin/individual-packages-gen.sh).
