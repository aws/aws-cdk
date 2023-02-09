import { promises as fs } from 'fs';
import * as path from 'path';
import { integTest, withTemporaryDirectory, ShellHelper, withPackages, TemporaryDirectoryContext } from '../../lib';
import { typescriptVersionsSync } from '../../lib/npm';

['app', 'sample-app'].forEach(template => {
  integTest(`typescript init ${template}`, withTemporaryDirectory(withPackages(async (context) => {
    const shell = ShellHelper.fromContext(context);
    await context.packages.makeCliAvailable();

    await shell.shell(['cdk', 'init', '-l', 'typescript', template]);

    await shell.shell(['npm', 'prune']);
    await shell.shell(['npm', 'ls']); // this will fail if we have unmet peer dependencies
    await shell.shell(['npm', 'run', 'build']);
    await shell.shell(['npm', 'run', 'test']);

    await shell.shell(['cdk', 'synth']);
  })));
});

/**
 * Test our generated code with various versions of TypeScript
 */
typescriptVersionsSync().forEach(tsVersion => {
  integTest(`typescript ${tsVersion} init app`, withTemporaryDirectory(withPackages(async (context) => {
    const shell = ShellHelper.fromContext(context);
    await context.packages.makeCliAvailable();

    await shell.shell(['node', '--version']);
    await shell.shell(['npm', '--version']);

    await shell.shell(['cdk', 'init', '-l', 'typescript', 'app', '--generate-only']);

    // Necessary because recent versions of ts-jest require TypeScript>=4.3 but we
    // still want to test with older versions as well.
    await removeDevDependencies(context);

    await shell.shell(['npm', 'install', '--save-dev', `typescript@${tsVersion}`]);
    await shell.shell(['npm', 'install']); // Older versions of npm require this to be a separate step from the one above
    await shell.shell(['npx', 'tsc', '--version']);
    await shell.shell(['npm', 'prune']);
    await shell.shell(['npm', 'ls']); // this will fail if we have unmet peer dependencies

    // We just removed the 'jest' dependency so remove the tests as well because they won't compile
    await shell.shell(['rm', '-rf', 'test/']);

    await shell.shell(['npm', 'run', 'build']);
    await shell.shell(['cdk', 'synth']);
  })));
});

async function removeDevDependencies(context: TemporaryDirectoryContext) {
  const filename = path.join(context.integTestDir, 'package.json');
  const pj = JSON.parse(await fs.readFile(filename, { encoding: 'utf-8' }));
  delete pj.devDependencies;
  await fs.writeFile(filename, JSON.stringify(pj, undefined, 2), { encoding: 'utf-8' });
}