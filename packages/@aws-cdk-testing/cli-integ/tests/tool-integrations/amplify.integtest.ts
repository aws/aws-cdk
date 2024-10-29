import { promises as fs } from 'fs';
import * as path from 'path';
import { integTest, withTemporaryDirectory, ShellHelper, withPackages, TemporaryDirectoryContext } from '../../lib';

const TIMEOUT = 1800_000;

integTest('amplify integration', withTemporaryDirectory(withPackages(async (context) => {
  const shell = ShellHelper.fromContext(context);

  await shell.shell(['npm', 'create', '-y', 'amplify@latest']);
  await shell.shell(['npx', 'ampx', 'configure', 'telemetry', 'disable']);

  // This will create 'package.json' implicating a certain version of the CDK
  await updateCdkDependency(context, context.packages.requestedCliVersion(), context.packages.requestedFrameworkVersion());
  await shell.shell(['npm', 'install']);

  await shell.shell(['npx', 'ampx', 'sandbox', '--once']);
  await shell.shell(['npx', 'ampx', 'sandbox', 'delete', '--yes']);
})), TIMEOUT);

async function updateCdkDependency(context: TemporaryDirectoryContext, cliVersion: string, libVersion: string) {
  const filename = path.join(context.integTestDir, 'package.json');
  const pj = JSON.parse(await fs.readFile(filename, { encoding: 'utf-8' }));
  pj.devDependencies['aws-cdk'] = cliVersion;
  pj.devDependencies['aws-cdk-lib'] = libVersion;
  await fs.writeFile(filename, JSON.stringify(pj, undefined, 2), { encoding: 'utf-8' });
}
