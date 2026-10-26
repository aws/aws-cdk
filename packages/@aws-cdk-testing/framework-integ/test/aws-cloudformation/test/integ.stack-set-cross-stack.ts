import type { Construct } from 'constructs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import type { CfnResource, StackProps } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cfn from 'aws-cdk-lib/aws-cloudformation';

/**
 * A StackSet whose StackSetStack is defined in another stack.
 *
 * The stack with the StackSet hosts the template of the StackSetStack, so the
 * StackSet deploys without depending on the stack that contains the StackSetStack.
 *
 * Requirements for running this test:
 *
 * - 2 accounts:
 *  - A "deployment" account which will be the account that the test case runs in and
 *    deploys the stackset.
 *  - A "target" account which is where the stackset will deploy into
 *
 * - The target account must be bootstrapped to trust the deployment account
 * - The below environment variables must be set appropriately
 */

const deploymentAccount = process.env.CDK_INTEG_ACCOUNT ?? process.env.INTEG_DEPLOYMENT_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT;
const deploymentRegion = process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION;
const targetAccount = process.env.CDK_INTEG_ACCOUNT ?? process.env.INTEG_TARGET_ACCOUNT;
const targetRegion = process.env.INTEG_TARGET_REGION ?? 'us-east-1';
const executionRoleName = 'AWSCloudFormationStackSetExecutionRole-integ-cross-stack';
const stackSetName = 'integ-stackset-cross-stack-test';

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
 * A StackSetStack that creates an SNS topic
 */
class TopicStackSet extends cfn.StackSetStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new sns.Topic(this, 'IntegStackSetSNSTopic');
  }
}

/**
 * A stack that contains the StackSetStack but has no StackSet using it
 */
class ScopeStack extends Stack {
  public readonly stackSetStack: cfn.StackSetStack;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new sns.Topic(this, 'ScopeTopic');
    this.stackSetStack = new TopicStackSet(this, 'shared-stack-set');
  }
}

interface ConsumerStackProps extends StackProps {
  readonly stackSetStack: cfn.StackSetStack;
}

/**
 * A stack with a StackSet that uses the StackSetStack of another stack
 */
class ConsumerStack extends Stack {
  constructor(scope: Construct, id: string, props: ConsumerStackProps) {
    super(scope, id, props);

    new cfn.StackSet(this, 'StackSet', {
      stackSetName,
      target: cfn.StackSetTarget.fromAccounts({
        accounts: [targetAccount!],
        regions: [targetRegion],
      }),
      template: cfn.StackSetTemplate.fromStackSetStack(props.stackSetStack),
      deploymentType: cfn.DeploymentType.selfManaged({ executionRoleName }),
    });
  }
}

const env = { account: deploymentAccount, region: deploymentRegion };

const supportStack = new SupportStack(app, 'integ-stackset-cross-stack-support', {
  env: { account: targetAccount, region: targetRegion },
});
const scopeStack = new ScopeStack(app, 'integ-stackset-cross-stack-scope', { env });
const consumerStack = new ConsumerStack(app, 'integ-stackset-cross-stack-consumer', {
  env,
  stackSetStack: scopeStack.stackSetStack,
});
consumerStack.addStackDependency(supportStack);

const integ = new IntegTest(app, 'integ-test-cross-stack', {
  testCases: [scopeStack, consumerStack],
  enableLookups: true,
});

integ.assertions.awsApiCall('CloudFormation', 'describeStackInstance', {
  StackSetName: stackSetName,
  StackInstanceAccount: targetAccount,
  StackInstanceRegion: targetRegion,
}).expect(ExpectedResult.objectLike({
  StackInstance: { Status: 'CURRENT' },
}));
