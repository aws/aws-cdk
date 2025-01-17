import * as fs from 'node:fs';
import * as path from 'node:path';
import { Toolkit } from '../../lib';
import { determineOutputDirectory } from '../../lib/api/cloud-assembly/private';

export * from './test-io-host';

function fixturePath(...parts: string[]): string {
  return path.normalize(path.join(__dirname, '..', '_fixtures', ...parts));
}

export async function appFixture(toolkit: Toolkit, name: string) {
  const appPath = fixturePath(name, 'app.js');
  if (!fs.existsSync(appPath)) {
    throw new Error(`App Fixture ${name} does not exist in ${appPath}`);
  }
  const app = `cat ${appPath} | node --input-type=module`;
  return toolkit.fromCdkApp(app, {
    outdir: determineOutputDirectory(),
  });
}

export function builderFixture(toolkit: Toolkit, name: string) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const builder = require(path.join(__dirname, '..', '_fixtures', name)).default;
  return toolkit.fromAssemblyBuilder(builder, {
    outdir: determineOutputDirectory(),
  });
}

export function cdkOutFixture(toolkit: Toolkit, name: string) {
  const outdir = path.join(__dirname, '..', '_fixtures', name, 'cdk.out');
  if (!fs.existsSync(outdir)) {
    throw new Error(`Assembly Dir Fixture ${name} does not exist in ${outdir}`);
  }
  return toolkit.fromAssemblyDirectory(outdir);
}
