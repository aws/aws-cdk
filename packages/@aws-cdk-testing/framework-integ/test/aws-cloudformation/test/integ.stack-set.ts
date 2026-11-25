import type { Construct } from 'constructs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import {
  App,
  CfnOutput,
  CfnParameter,
  Stack,
} from 'aws-cdk-lib';
import type { CfnResource, StackProps } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cfn from 'aws-cdk-lib/aws-cloudformation';

/**
 * It's a little difficult to create an integration test for stacksets since it requires
 * multiple accounts. So the requirements for running this test are:
 *
 * - 2 accounts:
 *  - A "deployment" account which will be the account that the test case runs in and
 *    deploys the stackset.
 *  - A "target" account which is where the stackset will deploy into
 *
 * - The deployment account must be bootstrapped in its region
 * - The target account must be bootstrapped in the target region to trust the deployment account
 * - The below environment variables must be set appropriately:
 *  - `INTEG_DEPLOYMENT_ACCOUNT` and `INTEG_TARGET_ACCOUNT`: the accounts. `CDK_INTEG_ACCOUNT`
 *    takes precedence over both, so it must be unset for a real deployment
 *  - `CDK_INTEG_REGION` (or `CDK_DEFAULT_REGION`): the region of the stack that contains the StackSet
 *  - `INTEG_TARGET_REGION` (default `us-east-1`): the region of the first target
 *  - `INTEG_SECOND_TARGET_REGION` (default `us-west-2`): the region of a second target in the
 *    same target account, with its own parameter override. It must differ from `INTEG_TARGET_REGION`
 *
 * A StackSet with file assets is tested in `integ.stack-set-assets.ts`.
 *
 * The snapshot must be recorded by a real deployment of this test.
 */

const deploymentAccount = process.env.CDK_INTEG_ACCOUNT ?? process.env.INTEG_DEPLOYMENT_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT;
const targetAccount = process.env.CDK_INTEG_ACCOUNT ?? process.env.INTEG_TARGET_ACCOUNT;
const targetRegion = process.env.INTEG_TARGET_REGION ?? 'us-east-1';
const secondTargetRegion = process.env.INTEG_SECOND_TARGET_REGION ?? 'us-west-2';
const topicDisplayName = 'integ-stackset-topic';
const secondRegionTopicDisplayName = 'integ-stackset-topic-second-region';
const executionRoleName = 'AWSCloudFormationStackSetExecutionRole-integ-test';
const stackSetName = 'integ-stackset-test';

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
    (this.executionRole.node.defaultChild as CfnResource).addMetadata('guard', {
      SuppressedRules: ['IAM_ROLE_ROOT_PRINCIPAL_NEEDS_CONDITIONS'],
    });
  }
}

/**
 * Create a StackSet which just creates a simple SNS topic, named by a parameter
 */
class MyStackSet extends cfn.StackSet {
  constructor(scope: Construct, id: string, props: cfn.StackSetProps) {
    super(scope, id, props);

    const displayName = new CfnParameter(this, 'TopicDisplayName', { type: 'String' });
    new sns.Topic(this, 'IntegStackSetSNSTopic', { displayName: displayName.valueAsString });
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

    const stackSet = new MyStackSet(this, 'StackSet', {
      stackSetName,
      parameters: { TopicDisplayName: topicDisplayName },
      // Each target is one group of stack instances
      targets: [
        cfn.StackSetTarget.fromAccounts({
          accounts: [targetAccount!],
          regions: [targetRegion],
        }),
        cfn.StackSetTarget.fromAccounts({
          accounts: [targetAccount!],
          regions: [secondTargetRegion],
          parameterOverrides: { TopicDisplayName: secondRegionTopicDisplayName },
        }),
      ],
      deploymentType: cfn.DeploymentType.selfManaged({
        executionRoleName: props.executionRole.roleName,
      }),
      operationPreferences: {
        failureTolerance: cfn.StackSetFailureTolerance.count(1),
        maxConcurrency: cfn.StackSetMaxConcurrency.count(2),
        concurrencyMode: cfn.StackSetConcurrencyMode.SOFT_FAILURE_TOLERANCE,
      },
    });

    // Values of the admin role that the StackSet creates, passed to the template as StackSet parameters
    new CfnOutput(stackSet, 'AdminRoleName', { value: stackSet.adminRole!.roleName });
    new CfnOutput(stackSet, 'AdminRoleArn', { value: stackSet.adminRole!.roleArn });
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

const integ = new IntegTest(app, 'integ-test', {
  testCases: [testCase],
  enableLookups: true,
});

integ.assertions.awsApiCall('CloudFormation', 'describeStackInstance', {
  StackSetName: stackSetName,
  StackInstanceAccount: targetAccount,
  StackInstanceRegion: targetRegion,
}).expect(ExpectedResult.objectLike({
  StackInstance: { Status: 'CURRENT' },
}));

integ.assertions.awsApiCall('CloudFormation', 'describeStackInstance', {
  StackSetName: stackSetName,
  StackInstanceAccount: targetAccount,
  StackInstanceRegion: secondTargetRegion,
}).expect(ExpectedResult.objectLike({
  StackInstance: {
    Status: 'CURRENT',
    ParameterOverrides: [{ ParameterKey: 'TopicDisplayName', ParameterValue: secondRegionTopicDisplayName }],
  },
}));
