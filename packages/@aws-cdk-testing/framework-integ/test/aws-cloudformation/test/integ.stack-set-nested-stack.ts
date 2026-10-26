import * as path from 'path';
import { Construct } from 'constructs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, CfnCapabilities, NestedStack, Stack } from 'aws-cdk-lib';
import type { CfnResource, StackProps } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cfn from 'aws-cdk-lib/aws-cloudformation';

/**
 * A StackSetStack in a construct of the stack of its StackSet, with a nested
 * stack and a Lambda function, whose template and code are file assets.
 *
 * The stack of the StackSet publishes the template and the file assets, and
 * the StackSet waits for the copies to the asset bucket.
 *
 * Requirements for running this test:
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
const deploymentRegion = process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION;
const targetAccount = process.env.CDK_INTEG_ACCOUNT ?? process.env.INTEG_TARGET_ACCOUNT;
const targetRegion = process.env.INTEG_TARGET_REGION ?? 'us-east-1';
const executionRoleName = 'AWSCloudFormationStackSetExecutionRole-integ-nested-stack';
const stackSetName = 'integ-stackset-nested-stack-test';

const app = new App({
  postCliContext: {
    '@aws-cdk/core:target-partitions': ['aws', 'aws-us-gov'],
  },
});

/**
 * The execution role that CloudFormation uses in the target account
 */
class SupportStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const executionRole = new iam.Role(this, 'CfnExecutionRole', {
      roleName: executionRoleName,
      assumedBy: new iam.ArnPrincipal(`arn:aws:iam::${deploymentAccount}:root`),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'),
      ],
    });
    (executionRole.node.defaultChild as CfnResource).addMetadata('guard', {
      SuppressedRules: ['IAM_ROLE_ROOT_PRINCIPAL_NEEDS_CONDITIONS'],
    });
  }
}

/**
 * A StackSetStack with a nested stack and a Lambda function
 */
class NestedStackSet extends cfn.StackSetStack {
  constructor(scope: Construct, id: string, props?: cfn.StackSetStackProps) {
    super(scope, id, props);

    new sns.Topic(new NestedStack(this, 'Nested'), 'IntegStackSetSNSTopic');

    new lambda.Function(this, 'Lambda', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
    });
  }
}

const supportStack = new SupportStack(app, 'integ-stackset-nested-stack-support', {
  env: { account: targetAccount, region: targetRegion },
});

const testStack = new Stack(app, 'integ-stackset-nested-stack', {
  env: { account: deploymentAccount, region: deploymentRegion },
});
testStack.addStackDependency(supportStack);

const stackSetStack = new NestedStackSet(new Construct(testStack, 'Templates'), 'stack-set', {
  assetBuckets: [s3.Bucket.fromBucketName(testStack, 'AssetBucket', `asset-bucket-${deploymentAccount}-${targetRegion}`)],
  assetBucketPrefix: `asset-bucket-${deploymentAccount}`,
});

new cfn.StackSet(testStack, 'StackSet', {
  stackSetName,
  target: cfn.StackSetTarget.fromAccounts({
    accounts: [targetAccount!],
    regions: [targetRegion],
  }),
  template: cfn.StackSetTemplate.fromStackSetStack(stackSetStack),
  deploymentType: cfn.DeploymentType.selfManaged({ executionRoleName }),
  capabilities: [CfnCapabilities.ANONYMOUS_IAM],
});

const integ = new IntegTest(app, 'integ-test-nested-stack', {
  testCases: [testStack],
  enableLookups: true,
});

integ.assertions.awsApiCall('CloudFormation', 'describeStackInstance', {
  StackSetName: stackSetName,
  StackInstanceAccount: targetAccount,
  StackInstanceRegion: targetRegion,
}).expect(ExpectedResult.objectLike({
  StackInstance: { Status: 'CURRENT' },
}));
