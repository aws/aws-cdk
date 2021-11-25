// Helper script to regen all CFN-only library readmes from the template.
import { promises as fs } from 'fs';
import * as path from 'path';
import { createLibraryReadme } from '../lib';

async function main() {
  const root = path.resolve(__dirname, '..', '..');

  for (const packageName of await fs.readdir(root, { encoding: 'utf-8' })) {
    const packageDir = path.join(root, packageName);
    const packageJson = JSON.parse(await fs.readFile(path.join(packageDir, 'package.json'), { encoding: 'utf-8' }));

    if (packageJson.maturity === 'cfn-only' && packageJson['cdk-build']?.cloudformation) {
      // eslint-disable-next-line no-console
      console.log(packageDir);

      // 'cloudformation' setting is either a string or an array of strings
      const namespace = packageJson['cdk-build']?.cloudformation;
      const namespaces = Array.isArray(namespace) ? namespace : [namespace];

      await createLibraryReadme(namespaces[0], path.join(packageDir, 'README.md'));
    }
  }
}


main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});
