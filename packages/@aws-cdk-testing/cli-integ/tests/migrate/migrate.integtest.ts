import {
  integTest,
  withTemporaryDirectory,
  withPackages,
} from '../../lib';

integTest(
  'cdk migrate typescript',
  withTemporaryDirectory(
    withPackages(async () => {
      // const shell = ShellHelper.fromContext(context);
      // await context.packages.makeCliAvailable();

      // const tempPath = path.resolve(context.integTestDir);
      // const inputFile = path.join(__dirname, 'template.yml');

      // await shell.shell([
      //   'cdk',
      //   'migrate',
      //   '-l',
      //   'typescript',
      //   '--from-path',
      //   inputFile,
      //   '--output-path',
      //   tempPath,
      // ]);
    }),
  ),
);
