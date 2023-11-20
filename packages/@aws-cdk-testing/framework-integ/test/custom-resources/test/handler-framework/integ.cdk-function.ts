import * as path from 'path';
import { Construct } from 'constructs';
import { CdkFunction } from 'aws-cdk-lib/custom-resources/lib/handler-framework/cdk-function';
import { CdkHandler } from 'aws-cdk-lib/custom-resources/lib/handler-framework/cdk-handler';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, CustomResource, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

class ProviderStack extends Stack {
  public readonly provider: Provider;
  public readonly onEventFunction: CdkFunction;

  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const onEventHandler = CdkHandler.fromAsset(path.join(__dirname, 'test-handler'), {
      handler: 'index.onEventHandler',
      compatibleRuntimes: [Runtime.NODEJS_18_X],
    });

    this.onEventFunction = new CdkFunction(this, 'OnEventHandler', {
      handler: onEventHandler,
      timeout: Duration.minutes(3),
    });

    this.provider = new Provider(this, 'Provider', {
      onEventHandler: this.onEventFunction,
    });
  }
}

class TestStack extends Stack {
  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const providerStack = new ProviderStack(this, 'ProviderStack');

    const date = new Date();
    new CustomResource(this, 'CdkFunctionInteg', {
      serviceToken: providerStack.provider.serviceToken,
      resourceType: 'Custom::CdkFunction',
      properties: {
        TableName: 'CdkFunctionTable',
        Region: this.region,
        RequestTime: date.toISOString(),
      },
    });
  }
}

const app = new App();
const testStack = new TestStack(app, 'TestStack');

new IntegTest(app, 'cdk-function-integ', {
  testCases: [testStack],
});
