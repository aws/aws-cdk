import { RuntimeIntegrationTestUpdater } from './runtime-updater';

export async function main() {
  const integTestFiles = {
    NODEJS: __dirname + '../../../../../packages/@aws-cdk-testing/framework-integ/test/aws-lambda-nodejs/test/integ.nodejs.build.images.ts',
    PYTHON: __dirname + '../../../../../packages/@aws-cdk/aws-lambda-python-alpha/test/integ.python.build.images.ts',
    OTHER: __dirname + '../../../../../packages/@aws-cdk/aws-lambda-go-alpha/test/integ.function.provided.runtimes.ts',
  };
  const updater = new RuntimeIntegrationTestUpdater(integTestFiles);
  await updater.execute();
}