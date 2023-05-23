import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, Stack, StackPolicy, StackPolicyStatement, Effect, StackProps, UpdateAction } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new iam.User(this, 'MyUser');
  }
}

const app = new App();
const statement = new StackPolicyStatement({
  effect: Effect.DENY,
  actions: [UpdateAction.UPDATE_MODIFY],
  resources: ['*'],
});
const stackPolicy = new StackPolicy({ statements: [statement] });
const stack = new TestStack(app, 'MyStack', { stackPolicy: stackPolicy });

const integTest = new integ.IntegTest(app, 'StackPolicyTest', {
  testCases: [stack],
});

const policy = integTest.assertions.awsApiCall('CloudFormation', 'getStackPolicy', {
  StackName: 'MyStack',
});

policy.expect(integ.ExpectedResult.objectLike(stackPolicy.toJSON()));

app.synth();

