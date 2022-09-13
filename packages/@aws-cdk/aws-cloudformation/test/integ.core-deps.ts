/*
 * Real replaceDependency use case to test
 *
 * TestStack verification steps:
 * - Deploy with `--no-clean`
 * - Verify that the CloudFormation stack LogRetention CfnResource dependencies list CustomPolicy, not DefaultPolicy
 *
 * TestNestedStack verification steps:
 * - Deploy with `--no-clean`
 * - Verify that Stack2 lists Stack1 in DependsOn
 */
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { RetentionDays } from '@aws-cdk/aws-logs';
import { App, Stack, CfnResource, NestedStack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';

class TestStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    new lambda.Function(this, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      logRetention: RetentionDays.ONE_DAY,
    });
    const logRetentionFunction = this.node.tryFindChild('LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a')!;
    const serviceRole = logRetentionFunction.node.tryFindChild('ServiceRole') as iam.Role;
    const defaultPolicy = serviceRole.node.tryFindChild('DefaultPolicy')!.node.defaultChild! as iam.CfnPolicy;
    const customPolicy = new iam.CfnManagedPolicy(this, 'CustomPolicy', {
      policyDocument: defaultPolicy.policyDocument,
      roles: defaultPolicy.roles,
    });
    const logRetentionResource = logRetentionFunction.node.tryFindChild('Resource') as CfnResource;
    // Without replacing the dependency, Cfn will reject the template because it references this non-existent logical id
    logRetentionResource.replaceDependency(defaultPolicy, customPolicy);
    serviceRole.node.tryRemoveChild('DefaultPolicy');
  }
}

class TestNestedStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const stack1 = new NestedStack(this, 'Stack1');
    const stack2 = new NestedStack(this, 'Stack2');
    const resource1 = new lambda.Function(stack1, 'Lambda1', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
    }).node.defaultChild! as CfnResource;
    const resource2 = new lambda.Function(stack2, 'Lambda2', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
    }).node.defaultChild! as CfnResource;

    // The following two statements should cancel each other out
    resource1.addDependency(resource2);
    resource1.removeDependency(resource2);

    resource2.addDependency(resource1);
  }
}

const app = new App();
const stack = new TestStack(app, 'replace-depends-on-test');
const nestedStack = new TestNestedStack(app, 'nested-stack-depends-test');

new integ.IntegTest(app, 'DependsOnTest', {
  testCases: [stack, nestedStack],
});

app.synth();
