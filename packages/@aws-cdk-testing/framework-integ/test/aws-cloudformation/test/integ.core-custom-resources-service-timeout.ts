import { App, CustomResource, CustomResourceProvider, CustomResourceProviderRuntime, Duration, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/*
 * Stack verification steps:
 * - Deploy with `--no-clean`
 * - Verify that `ServiceTimeout` is set to 60 in the CloudWatch Logs for the Lambda function that creates custom resources.
 */

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const resourceType = 'Custom::Reflect';

    const serviceToken = CustomResourceProvider.getOrCreate(this, resourceType, {
      codeDirectory: `${__dirname}/core-custom-resource-provider-fixture`,
      runtime: CustomResourceProviderRuntime.NODEJS_18_X,
      description: 'veni vidi vici',
    });

    new CustomResource(this, 'MyResource', {
      resourceType,
      serviceToken,
      serviceTimeout: Duration.seconds(60),
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'custom-resource-test-service-timeout');
new IntegTest(app, 'custom-resource-test-service-timeout-integ-test', {
  testCases: [stack],
});
