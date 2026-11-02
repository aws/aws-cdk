import type { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import type { StackProps } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cfn from 'aws-cdk-lib/aws-cloudformation';

/**
 * A service managed StackSet that deploys to AWS Organizations organizational units.
 *
 * This test is snapshot-only. Deploying it needs an AWS Organizations management account
 * or a delegated administrator account for CloudFormation StackSets, with trusted access
 * enabled, and organizational units to deploy to. Set these environment variables to deploy it:
 *
 * - `INTEG_TARGET_OU`: an organizational unit to deploy to every account of
 * - `INTEG_SECOND_TARGET_OU`: another organizational unit, of which only `INTEG_TARGET_ACCOUNT` is deployed to
 * - `INTEG_TARGET_ACCOUNT`: an account in `INTEG_SECOND_TARGET_OU`
 */

const targetOu = process.env.INTEG_TARGET_OU ?? 'ou-abcd-11111111';
const secondTargetOu = process.env.INTEG_SECOND_TARGET_OU ?? 'ou-abcd-22222222';
const targetAccount = process.env.INTEG_TARGET_ACCOUNT ?? '111111111111';
const targetRegion = process.env.INTEG_TARGET_REGION ?? 'us-east-1';

const app = new App();

class TopicStackSet extends cfn.StackSetStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new sns.Topic(this, 'Topic');
  }
}

class TestCase extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const stackSet = new cfn.StackSet(this, 'StackSet', {
      target: cfn.StackSetTarget.fromOrganizationalUnits({
        organizationalUnits: [targetOu],
        regions: [targetRegion],
      }),
      deploymentType: cfn.DeploymentType.serviceManaged(),
      template: cfn.StackSetTemplate.fromStackSetStack(new TopicStackSet(scope, 'integ-stack-set-service-managed-template')),
    });

    stackSet.addTarget(cfn.StackSetTarget.fromOrganizationalUnits({
      organizationalUnits: [secondTargetOu],
      regions: [targetRegion],
      accountFilter: cfn.StackSetAccountFilter.intersection([targetAccount]),
    }));
  }
}

const testCase = new TestCase(app, 'integ-stack-set-service-managed');

new IntegTest(app, 'integ-stack-set-service-managed-test', {
  testCases: [testCase],
  cdkCommandOptions: {
    deploy: {
      enabled: false,
    },
    destroy: {
      enabled: false,
    },
  },
});
