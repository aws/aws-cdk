/// !cdk-integ *
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Provider } from 'aws-cdk-lib/custom-resources';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

// This test is not deployable prior to this PR fix https://github.com/aws/aws-cdk/pull/32404/files
// due to integ-provider-with-waiter-state-machine-custom-role failed: ValidationError: Circular dependency
// between resources: [MyRoleDefaultPolicyA36BE1DD, MyProviderWithCustomRolewaiterstatemachineRoleDefaultPolicy4808872B,
// MyProviderWithCustomRoleframeworkonEventCE6B50CD, MyProviderWithCustomRoleframeworkonTimeout1A7D4C59,
// MyProviderWithCustomRoleframeworkisComplete10E48A2A, MyProviderWithCustomRolewaiterstatemachineA313C5FC,
// MyProviderWithCustomRolewaiterstatemachineLogGroup836672C3]

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const onEventHandler = new Function(this, 'OnEvent', {
      code: Code.fromInline('foo'),
      handler: 'index.onEvent',
      runtime: Runtime.NODEJS_LATEST,
    });
    const isCompleteHandler = new Function(this, 'IsComplete', {
      code: Code.fromInline('foo'),
      handler: 'index.isComplete',
      runtime: Runtime.NODEJS_LATEST,
    });

    new Provider(this, 'MyProviderWithCustomRole', {
      frameworkOnEventRole: new Role(this, 'MyRole', {
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
          ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        ],
      }),
      frameworkCompleteAndTimeoutRole: new Role(this, 'MyRole2', {
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
          ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        ],
      }),
      onEventHandler,
      isCompleteHandler,
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new TestStack(app, 'integ-provider-with-waiter-state-machine-custom-role');

new integ.IntegTest(app, 'IntegProviderWithWaiterStateMachineCustomRole', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();
