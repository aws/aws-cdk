import { integTest, withTemporaryDirectory, ShellHelper, withPackages } from '../../lib';

['app', 'sample-app'].forEach(template => {
  integTest(`init C♯ ${template}`, withTemporaryDirectory(withPackages(async (context) => {
    context.packages.assertJsiiPackagesAvailable();

    const shell = ShellHelper.fromContext(context);
    await context.packages.makeCliAvailable();

    await shell.shell(['cdk', 'init', '-l', 'csharp', template]);
    await context.packages.initializeDotnetPackages(context.integTestDir);
    await shell.shell(['cdk', 'synth']);
  })));
});


