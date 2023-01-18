import { integTest, withTemporaryDirectory, ShellHelper, withPackages } from '../../lib';

['app', 'sample-app'].forEach(template => {
  integTest(`init javascript ${template}`, withTemporaryDirectory(withPackages(async (context) => {
    const shell = ShellHelper.fromContext(context);
    await context.packages.makeCliAvailable();

    await shell.shell(['cdk', 'init', '-l', 'javascript', template]);
    await shell.shell(['npm', 'prune']);
    await shell.shell(['npm', 'ls']); // this will fail if we have unmet peer dependencies
    await shell.shell(['npm', 'run', 'test']);

    await shell.shell(['cdk', 'synth']);
  })));
});
