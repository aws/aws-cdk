import * as path from 'path';
import type { Construct } from 'constructs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, CfnCapabilities, Stack } from 'aws-cdk-lib';
import type { CfnResource, StackProps } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cfn from 'aws-cdk-lib/aws-cloudformation';

/**
 * A StackSetStack defined at App scope, with a file asset.
 *
 * The stack with the StackSet hosts the template and the file asset of the
 * StackSetStack, and copies the file asset to the asset bucket.
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
const executionRoleName = 'AWSCloudFormationStackSetExecutionRole-integ-app-scope';
const stackSetName = 'integ-stackset-app-scope-test';

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
 * A StackSetStack with a Lambda function, whose code is a file asset
 */
class LambdaStackSet extends cfn.StackSetStack {
  constructor(scope: Construct, id: string, props?: cfn.StackSetStackProps) {
    super(scope, id, props);

    new lambda.Function(this, 'Lambda', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
    });
  }
}

const supportStack = new SupportStack(app, 'integ-stackset-app-scope-support', {
  env: { account: targetAccount, region: targetRegion },
});

const consumerStack = new Stack(app, 'integ-stackset-app-scope-consumer', {
  env: { account: deploymentAccount, region: deploymentRegion },
});
consumerStack.addStackDependency(supportStack);

const stackSetStack = new LambdaStackSet(app, 'app-scoped-stack-set', {
  assetBuckets: [s3.Bucket.fromBucketName(consumerStack, 'AssetBucket', `asset-bucket-${deploymentAccount}-${targetRegion}`)],
  assetBucketPrefix: `asset-bucket-${deploymentAccount}`,
});

new cfn.StackSet(consumerStack, 'StackSet', {
  stackSetName,
  target: cfn.StackSetTarget.fromAccounts({
    accounts: [targetAccount!],
    regions: [targetRegion],
  }),
  template: cfn.StackSetTemplate.fromStackSetStack(stackSetStack),
  deploymentType: cfn.DeploymentType.selfManaged({ executionRoleName }),
  capabilities: [CfnCapabilities.ANONYMOUS_IAM],
});

const integ = new IntegTest(app, 'integ-test-app-scope', {
  testCases: [consumerStack],
  enableLookups: true,
});

integ.assertions.awsApiCall('CloudFormation', 'describeStackInstance', {
  StackSetName: stackSetName,
  StackInstanceAccount: targetAccount,
  StackInstanceRegion: targetRegion,
}).expect(ExpectedResult.objectLike({
  StackInstance: { Status: 'CURRENT' },
}));
