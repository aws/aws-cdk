import * as path from 'path';
import { main, findWorkspacePath } from '../lib';

const MONOPACKAGE_ROOT = process.cwd();

const ROOT_PATH = findWorkspacePath();
const UBER_PACKAGE_JSON_PATH = path.join(MONOPACKAGE_ROOT, 'package.json');

const EXCLUDED_PACKAGES = ['@aws-cdk/example-construct-library'];

main({
  monoPackageRoot: MONOPACKAGE_ROOT,
  rootPath: ROOT_PATH,
  uberPackageJsonPath: UBER_PACKAGE_JSON_PATH,
  excludedPackages: EXCLUDED_PACKAGES,
}).then(
  () => process.exit(0),
  (err) => {
    // eslint-disable-next-line no-console
    console.error('❌ An error occurred: ', err.stack);
    process.exit(1);
  },
);
