import * as path from 'path';
import * as fs from 'fs-extra';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const lerna_project = require('@lerna/project');

bringBackDependencies().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

async function bringBackDependencies(): Promise<void[]> {
  const project = new lerna_project.Project();
  const separatePackages = project.getPackagesSync();
  const promises = new Array<Promise<void>>();
  for (const separatePkg of separatePackages) {
    promises.push(fs.rename(path.join(separatePkg.location, '_package.json'), separatePkg.manifestLocation));
  }
  return Promise.all(promises);
}
