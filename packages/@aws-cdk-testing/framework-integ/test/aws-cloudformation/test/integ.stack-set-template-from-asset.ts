import * as path from 'path';
import type { Construct } from 'constructs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, ArnFormat, Stack } from 'aws-cdk-lib';
import type { StackProps } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cfn from 'aws-cdk-lib/aws-cloudformation';

/**
 * Deploys a StackSet whose template is a local file, uploaded as an asset of the
 * stack that contains the StackSet. The requirements for running this test are:
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
const targetAccount = process.env.CDK_INTEG_ACCOUNT ?? process.env.INTEG_TARGET_ACCOUNT;
const targetRegion = process.env.INTEG_TARGET_REGION ?? 'us-east-1';
const executionRoleName = 'AWSCloudFormationStackSetExecutionRole-from-asset';
const adminRoleName = 'AWSCloudFormationStackSetAdministrationRole-from-asset';
const stackSetName = 'integ-stackset-template-from-asset';

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

    new cfn.StackSet(this, 'StackSet', {
      stackSetName,
      target: cfn.StackSetTarget.fromAccounts({
        accounts: [targetAccount!],
        regions: [targetRegion],
      }),
      template: cfn.StackSetTemplate.fromAsset(path.join(__dirname, 'stack-set-template', 'template.json')),
      deploymentType: cfn.DeploymentType.selfManaged({
        executionRoleName: props.executionRole.roleName,
        adminRole,
      }),
    });
  }
}

const supportStack = new SupportStack(app, 'integ-stack-set-template-from-asset-support', {
  env: {
    account: targetAccount,
    region: targetRegion,
  },
});

const testCase = new TestCase(app, 'integ-stack-set-template-from-asset', {
  env: {
    account: deploymentAccount,
    region: process.env.CDK_INTEG_REGION ?? process.env.CDK_DEFAULT_REGION,
  },
  executionRole: supportStack.executionRole,
});

testCase.addStackDependency(supportStack);

const integ = new IntegTest(app, 'integ-stack-set-template-from-asset-test', {
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
