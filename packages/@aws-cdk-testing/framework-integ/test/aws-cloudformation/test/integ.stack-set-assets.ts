import * as path from 'path';
import type { Construct } from 'constructs';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import {
  App,
  Aws,
  CfnCapabilities,
  RemovalPolicy,
  Stack,
} from 'aws-cdk-lib';
import type { CfnResource, StackProps } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cfn from 'aws-cdk-lib/aws-cloudformation';

/**
 * Deploys a self-managed StackSet whose template has a file asset (the code of a Lambda function)
 * into another region than the stack that contains the StackSet, and invokes the function.
 *
 * The requirements for running this test are:
 *
 * - 2 accounts:
 *  - A "deployment" account, which the test runs in. It holds the stack that contains the StackSet
 *    (in the host region), the administration role of the StackSet, and the asset bucket, in its
 *    own stack in the asset target region.
 *  - A "target" account, which the StackSet deploys into. It holds the execution role of the
 *    StackSet and the assertion stack, both in the asset target region.
 *
 * - The deployment account must be bootstrapped in the host region and in the asset target region
 * - The target account must be bootstrapped in the asset target region to trust the deployment
 *   account (`--trust <deployment account>`)
 * - The below environment variables must be set appropriately:
 *  - `INTEG_DEPLOYMENT_ACCOUNT` and `INTEG_TARGET_ACCOUNT`: the accounts. `CDK_INTEG_ACCOUNT`
 *    takes precedence over both, so it must be unset for a real deployment
 *  - `CDK_INTEG_REGION` (or `CDK_DEFAULT_REGION`): the region of the stack that contains the StackSet
 *  - `INTEG_ASSET_TARGET_REGION` (default `us-west-2`): the region the StackSet deploys to, which
 *    must differ from the region of the stack that contains the StackSet
 *
 * The roles and stacks have other names than those of `integ.stack-set.ts`, so both tests can be
 * deployed into the same accounts.
 *
 * The snapshot must be recorded by a real deployment of this test.
 */

const deploymentAccount = process.env.CDK_INTEG_ACCOUNT ?? process.env.INTEG_DEPLOYMENT_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT;
const targetAccount = process.env.CDK_INTEG_ACCOUNT ?? process.env.INTEG_TARGET_ACCOUNT;
const hostRegion = process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION;
const assetTargetRegion = process.env.INTEG_ASSET_TARGET_REGION ?? 'us-west-2';
const executionRoleName = 'AWSCloudFormationStackSetExecutionRole-integ-assets';
const adminRoleName = 'AWSCloudFormationStackSetAdministrationRole-integ-assets';
const stackSetName = 'integ-stackset-assets';
const functionName = 'integ-stackset-assets-echo';

const app = new App({
  postCliContext: {
    '@aws-cdk/core:target-partitions': ['aws', 'aws-us-gov'],
  },
});

/**
 * Create the execution role in the target account first.
 * This is the role that CloudFormation will use (comparable to the cfn-exec bootstrap role)
 */
class SupportStack extends Stack {
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
    (this.executionRole.node.defaultChild as CfnResource).addMetadata('guard', {
      SuppressedRules: ['IAM_ROLE_ROOT_PRINCIPAL_NEEDS_CONDITIONS'],
    });
  }
}

/**
 * Create the bucket that holds the file assets of the StackSet in the asset target region
 */
class AssetBucketStack extends Stack {
  public readonly bucket: s3.IBucket;
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.bucket = new s3.Bucket(this, 'AssetBucket', {
      bucketName: `integ-stackset-assets-${deploymentAccount}-${assetTargetRegion}`,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
  }
}

/**
 * Create a StackSet that has file assets
 */
class LambdaStackSet extends cfn.StackSet {
  constructor(scope: Construct, id: string, props: cfn.StackSetProps) {
    super(scope, id, props);

    new lambda.Function(this, 'Lambda', {
      functionName,
      runtime: lambda.Runtime.NODEJS_24_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
      // A log group named after the fixed function name would be kept and block the next deployment
      logGroup: new logs.LogGroup(this, 'LogGroup', { removalPolicy: RemovalPolicy.DESTROY }),
    });
  }
}

interface AssetTestCaseProps extends StackProps {
  executionRole: iam.IRole;
  assetBucket: s3.IBucket;
}

/**
 * Create the stack which will create the StackSet resource with file assets,
 * in another region than the asset bucket and the stack instance
 */
class AssetTestCase extends Stack {
  constructor(scope: Construct, id: string, props: AssetTestCaseProps) {
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

    const stackSet = new LambdaStackSet(this, 'StackSet', {
      assetBuckets: cfn.StackSetAssets.fromRegionalBuckets({ [assetTargetRegion]: props.assetBucket }),
      stackSetName,
      targets: [cfn.StackSetTarget.fromAccounts({
        accounts: [targetAccount!],
        regions: [assetTargetRegion],
      })],
      deploymentType: cfn.DeploymentType.selfManaged({
        executionRoleName: props.executionRole.roleName,
        adminRole,
      }),
      capabilities: [CfnCapabilities.ANONYMOUS_IAM],
    });

    // The stack instance reads the code of the function as the execution role of the target account.
    // The account is unknown when the test is synthesized without the environment variables.
    stackSet.grants.readAssets(new iam.AccountPrincipal(targetAccount ?? Aws.ACCOUNT_ID));
  }
}

const supportStack = new SupportStack(app, 'integ-stackset-assets-support', {
  env: {
    account: targetAccount,
    region: assetTargetRegion,
  },
});

const assetBucketStack = new AssetBucketStack(app, 'integ-stackset-assets-bucket', {
  env: {
    account: deploymentAccount,
    region: assetTargetRegion,
  },
});

// The stack that contains the StackSet depends on the stack of its asset bucket, which the StackSet adds
const assetTestCase = new AssetTestCase(app, 'integ-stackset-assets-test', {
  env: {
    account: deploymentAccount,
    region: hostRegion,
  },
  executionRole: supportStack.executionRole,
  assetBucket: assetBucketStack.bucket,
});

assetTestCase.addStackDependency(supportStack);

// The function is created by the stack instance, so the assertions run in its account and region
const assertionStack = new Stack(app, 'integ-stackset-assets-assertions', {
  env: {
    account: targetAccount,
    region: assetTargetRegion,
  },
});

// The test runner deploys the assertion stack after the test case, but destroys them together:
// the assertion stack, which grants invoke access on the function, is destroyed first
assertionStack.addStackDependency(assetTestCase);

const integ = new IntegTest(app, 'integ-stackset-assets', {
  testCases: [assetTestCase],
  assertionStack,
});

// The function only answers if it was created from the code in the asset bucket of its region
const payload = { message: 'read from the asset bucket of the region' };
integ.assertions.invokeFunction({
  functionName,
  payload: JSON.stringify(payload),
}).expect(ExpectedResult.objectLike({
  StatusCode: 200,
  Payload: Match.serializedJson(payload),
}));
