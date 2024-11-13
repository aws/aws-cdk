import { promises as fs } from 'fs';
import * as path from 'path';
import { withToolContext } from './with-tool-context';
import { integTest, ShellHelper, TemporaryDirectoryContext } from '../../lib';

const TIMEOUT = 1800_000;

integTest('amplify integration', withToolContext(async (context) => {
  const shell = ShellHelper.fromContext(context);

  await shell.shell(['npm', 'create', '-y', 'amplify@latest']);
  await shell.shell(['npx', 'ampx', 'configure', 'telemetry', 'disable']);

  // This will create 'package.json' implicating a certain version of the CDK
  await updateCdkDependency(context, context.packages.requestedCliVersion(), context.packages.requestedFrameworkVersion());
  await shell.shell(['npm', 'install']);

  await shell.shell(['npx', 'ampx', 'sandbox', '--once'], {
    modEnv: {
      AWS_REGION: context.aws.region,
    },
  });
  try {

    // Future code goes here, putting the try/finally here already so it doesn't
    // get forgotten.

  } finally {
    await shell.shell(['npx', 'ampx', 'sandbox', 'delete', '--yes'], {
      modEnv: {
        AWS_REGION: context.aws.region,
      },
    });
  }
}), TIMEOUT);

async function updateCdkDependency(context: TemporaryDirectoryContext, cliVersion: string, libVersion: string) {
  const filename = path.join(context.integTestDir, 'package.json');
  const pj = JSON.parse(await fs.readFile(filename, { encoding: 'utf-8' }));
  pj.devDependencies['aws-cdk'] = cliVersion;
  pj.devDependencies['aws-cdk-lib'] = libVersion;
  await fs.writeFile(filename, JSON.stringify(pj, undefined, 2), { encoding: 'utf-8' });
}
