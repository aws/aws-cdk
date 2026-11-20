import type { Construct } from 'constructs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, ArnFormat, NestedStack, Stack } from 'aws-cdk-lib';
import type { StackProps } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cfn from 'aws-cdk-lib/aws-cloudformation';

/**
 * Deploys a StackSet whose template contains a NestedStack. The nested template is a file
 * asset of the StackSet, so it is copied to the asset bucket of the target region, and the
 * stack instance fetches it from there. The requirements for running this test are:
 *
 * - 2 accounts (they may be the same account):
 *  - A "deployment" account which will be the account that the test case runs in and
 *    deploys the stackset.
 *  - A "target" account which is where the stackset will deploy into
 *
 * - The target account must be bootstrapped to trust the deployment account
 * - An S3 bucket named `asset-bucket-${deploymentAccount}-${targetRegion}`, created in advance
 *   in the deployment account and the target region. The deployment account must own it: the
 *   stack that contains the StackSet copies the nested template into it, and CloudFormation
 *   deploys that template in the target account. If the target account is not the deployment
 *   account, a bucket policy must let the target account read the objects in the bucket
 *   (`s3:GetObject` on `arn:aws:s3:::asset-bucket-${deploymentAccount}-${targetRegion}/*`)
 * - The target region is the region the test is deployed to, unless `INTEG_TARGET_REGION`
 *   says otherwise. The assertions run in the region of the test and read the topic of the
 *   nested stack, so the two regions must be the same
 * - The below environment variables must be set appropriately:
 *  - `INTEG_TARGET_ACCOUNT`: the target account
 *  - `INTEG_TARGET_REGION` (optional): the target region
 */

const deploymentAccount = process.env.CDK_INTEG_ACCOUNT ?? process.env.INTEG_DEPLOYMENT_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT;
const targetAccount = process.env.CDK_INTEG_ACCOUNT ?? process.env.INTEG_TARGET_ACCOUNT;
const targetRegion = process.env.INTEG_TARGET_REGION ?? process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION ?? 'us-east-1';
const executionRoleName = 'AWSCloudFormationStackSetExecutionRole-nested-stack';
const adminRoleName = 'AWSCloudFormationStackSetAdministrationRole-nested-stack';
const stackSetName = 'integ-stackset-nested-stack';
const topicName = 'integ-stackset-nested-stack-topic';
const assetBucketPrefix = `asset-bucket-${deploymentAccount}`;

const app = new App({
  postCliContext: {
    '@aws-cdk/core:target-partitions': ['aws', 'aws-us-gov'],
  },
});

/**
 * Create the execution role in the target account first.
 * Only the StackSet administration role of the deployment account can assume it.
 */
class SupportStack extends Stack {
  public readonly executionRole: iam.IRole;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.executionRole = new iam.Role(this, 'CfnExecutionRole', {
      roleName: executionRoleName,
      assumedBy: new iam.ArnPrincipal(`arn:${this.partition}:iam::${deploymentAccount}:root`).withConditions({
        ArnEquals: {
          'aws:PrincipalArn': `arn:${this.partition}:iam::${deploymentAccount}:role/${adminRoleName}`,
        },
      }),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'),
      ],
    });
  }
}

/**
 * A nested stack with a single topic
 */
class TopicNestedStack extends NestedStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const topic = new sns.Topic(this, 'Topic', { topicName });

    // The assertions run in the deployment account, which may not be the target account
    topic.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['sns:GetTopicAttributes'],
      principals: [new iam.ArnPrincipal(`arn:${this.partition}:iam::${deploymentAccount}:root`)],
      resources: [topic.topicArn],
    }));
  }
}

/**
 * Create a StackSet whose template contains a nested stack
 */
class NestedStackSet extends cfn.StackSet {
  constructor(scope: Construct, id: string, props: cfn.StackSetProps) {
    super(scope, id, props);

    new TopicNestedStack(this, 'Nested');
  }
}

interface TestCaseProps extends StackProps {
  readonly executionRole: iam.IRole;
}

/**
 * Create the stack which will create the StackSet resource
 */
class TestCase extends Stack {
  constructor(scope: Construct, id: string, props: TestCaseProps) {
    super(scope, id, props);

    // CloudFormation may only assume the administration role on behalf of StackSets in this account
    const adminRole = new iam.Role(this, 'AdminRole', {
      roleName: adminRoleName,
      assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com', {
        conditions: {
          StringEquals: { 'aws:SourceAccount': this.account },
          ArnLike: {
            'aws:SourceArn': this.formatArn({
              service: 'cloudformation',
              region: '*',
              resource: 'stackset',
              resourceName: '*',
              arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
            }),
          },
        },
      }),
    });

    new NestedStackSet(this, 'StackSet', {
      stackSetName,
      assetBuckets: [s3.Bucket.fromBucketName(this, 'AssetBucket', `${assetBucketPrefix}-${targetRegion}`)],
      assetBucketPrefix,
      target: cfn.StackSetTarget.fromAccounts({
        accounts: [targetAccount!],
        regions: [targetRegion],
      }),
      deploymentType: cfn.DeploymentType.selfManaged({
        executionRoleName: props.executionRole.roleName,
        adminRole,
      }),
    });
  }
}

const supportStack = new SupportStack(app, 'integ-stack-set-nested-stack-support', {
  env: {
    account: targetAccount,
    region: targetRegion,
  },
});

const testCase = new TestCase(app, 'integ-stack-set-nested-stack', {
  env: {
    account: deploymentAccount,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
  executionRole: supportStack.executionRole,
});

testCase.addStackDependency(supportStack);

const integ = new IntegTest(app, 'integ-stack-set-nested-stack-test', {
  testCases: [testCase],
  enableLookups: true,
});

// The stack instance, and so its nested stack, deployed successfully
const stackInstance = integ.assertions.awsApiCall('CloudFormation', 'describeStackInstance', {
  StackSetName: stackSetName,
  StackInstanceAccount: targetAccount,
  StackInstanceRegion: targetRegion,
}).expect(ExpectedResult.objectLike({
  StackInstance: {
    Status: 'CURRENT',
    StackInstanceStatus: { DetailedStatus: 'SUCCEEDED' },
  },
}));

// The resource of the nested stack exists in the target account and region
const topicArn = testCase.formatArn({
  service: 'sns',
  account: targetAccount,
  region: targetRegion,
  resource: topicName,
});
stackInstance.next(integ.assertions.awsApiCall('SNS', 'getTopicAttributes', {
  TopicArn: topicArn,
}).expect(ExpectedResult.objectLike({
  Attributes: { TopicArn: topicArn },
})));
