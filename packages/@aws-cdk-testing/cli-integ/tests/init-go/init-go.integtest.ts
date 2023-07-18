import { integTest, withTemporaryDirectory, ShellHelper, withPackages } from '../../lib';

['app', 'sample-app'].forEach(template => {
  integTest(`init go ${template}`, withTemporaryDirectory(withPackages(async (context) => {
    context.packages.assertJsiiPackagesAvailable();

    const shell = ShellHelper.fromContext(context);
    await context.packages.makeCliAvailable();

    await shell.shell(['cdk', 'init', '-l', 'go', template]);
    await shell.shell(['go', 'mod', 'edit', '-replace', 'github.com/aws/aws-cdk-go/awscdk/v2=$CODEBUILD_SRC_DIR/go/awscdk']);
    await shell.shell(['go', 'mod', 'tidy']);
    await shell.shell(['go', 'test']);
    await shell.shell(['cdk', 'synth']);
  })));
});
