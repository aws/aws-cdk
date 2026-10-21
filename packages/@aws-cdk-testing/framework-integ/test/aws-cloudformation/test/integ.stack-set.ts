import * as path from 'path';
import type { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import {
  App,
  CfnCapabilities,
  Stack,
} from 'aws-cdk-lib';
import type { StackProps } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cfn from 'aws-cdk-lib/aws-cloudformation';

/**
 * It's a little difficult to create an integration test for stacksets since it requires
 * multiple accounts. So the requirements for running this test are:
 *
 * - 2 accounts:
 *  - A "deployment" account which will be the account that the test case runs in and
 *    deploys the stackset. It must have the asset s3 bucket named `asset-bucket-${deploymentAccount}-${targetRegion}`.
 *  - A "target" account which is where the stackset will deploy into
 *
 * - The target account must be bootstrapped to trust the deployment account
 * - The below environment variables must be set appropriately
 */

const deploymentAccount = process.env.CDK_INTEG_ACCOUNT ?? process.env.INTEG_DEPLOYMENT_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT;
const targetAccount = process.env.CDK_INTEG_ACCOUNT ?? process.env.INTEG_TARGET_ACCOUNT;
const targetRegion = process.env.INTEG_TARGET_REGION ?? 'us-east-1';
const executionRoleName = 'AWSCloudFormationStackSetExecutionRole-integ-test';
const adminRoleName = 'AWSCloudFormationStackSetAdministrationRole-integ-test';

const app = new App({
  postCliContext: {
    '@aws-cdk/core:target-partitions': ['aws', 'aws-us-gov'],
  },
});

/**
 * Create the execution role in the target account first.
 * This is the role that CloudFormation will use (comparable to the cfn-exec bootstrap role)
 */
export class SupportStack extends Stack {
  public readonly executionRole: iam.IRole;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.executionRole = new iam.Role(this, 'CfnExecutionRole', {
      roleName: executionRoleName,
      assumedBy: new iam.ArnPrincipal(`arn:aws:iam::${deploymentAccount}:root`),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'),
      ],
    });
  }
}

/**
 * Create a StackSetStack which just creates a simple SNS topic
 */
class MyStackSet extends cfn.StackSetStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new sns.Topic(this, 'IntegStackSetSNSTopic');
  }
}

/**
 * Create a StackSetStack that has file assets
 */
class LambdaStackSet extends cfn.StackSetStack {
  constructor(scope: Construct, id: string, props?: cfn.StackSetStackProps) {
    super(scope, id, props);

    new lambda.Function(this, 'Lambda', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
    });
  }
}

interface TestCaseProps extends StackProps {
  executionRole: iam.IRole;
}

/**
 * Create the stack which will create the StackSet resource
 */
class TestCase extends Stack {
  constructor(scope: Construct, id: string, props: TestCaseProps) {
    super(scope, id, props);
    const adminRole = new iam.Role(this, 'AdminRole', {
      roleName: adminRoleName,
      assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
      inlinePolicies: {
        AssumeExecutionRole: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['sts:AssumeRole'],
              resources: [
                `arn:aws:iam::*:role/${executionRoleName}`,
              ],
            }),
          ],
        }),
      },
    });
    const stackSetStack = new MyStackSet(this, 'integ-stack-set');
    new cfn.StackSet(this, 'StackSet', {
      target: cfn.StackSetTarget.fromAccounts({
        accounts: [targetAccount!],
        regions: [targetRegion],
      }),
      template: cfn.StackSetTemplate.fromStackSetStack(stackSetStack),
      deploymentType: cfn.DeploymentType.selfManaged({
        executionRoleName: props.executionRole.roleName,
        adminRole,
      }),
    });
  }
}

/**
 * Create the stack which will create the StackSet resource
 */
class AssetTestCase extends Stack {
  constructor(scope: Construct, id: string, props: TestCaseProps) {
    super(scope, id);

    const stackSetStack = new LambdaStackSet(this, 'asset-stack-set', {
      assetBuckets: [s3.Bucket.fromBucketName(this, 'AssetBucket', `asset-bucket-${deploymentAccount}-${targetRegion}`)],
      assetBucketPrefix: `asset-bucket-${deploymentAccount}`,
    });
    new cfn.StackSet(this, 'StackSet', {
      target: cfn.StackSetTarget.fromAccounts({
        accounts: [targetAccount!],
        regions: [targetRegion],
      }),
      template: cfn.StackSetTemplate.fromStackSetStack(stackSetStack),
      deploymentType: cfn.DeploymentType.selfManaged({
        executionRoleName: props.executionRole.roleName,
      }),
      capabilities: [CfnCapabilities.ANONYMOUS_IAM],
    });
  }
}

const supportStack = new SupportStack(app, 'integ-stack-set-support', {
  env: {
    account: targetAccount,
    region: targetRegion,
  },
});

const testCase = new TestCase(app, 'integ-stackset-test', {
  env: {
    account: deploymentAccount,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
  executionRole: supportStack.executionRole,
});

testCase.addStackDependency(supportStack);

const assetTestCase = new AssetTestCase(app, 'integ-stackset-asset-test', {
  executionRole: supportStack.executionRole,
});

assetTestCase.addStackDependency(supportStack);

new IntegTest(app, 'integ-test', {
  testCases: [testCase, assetTestCase],
  enableLookups: true,
});
