import type { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import type { StackProps } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cfn from 'aws-cdk-lib/aws-cloudformation';

/**
 * A service managed StackSet that deploys to an AWS Organizations organizational unit,
 * narrowed to one of its accounts by an intersection account filter.
 *
 * This test is snapshot-only. Deploying it needs an AWS Organizations management account
 * or a delegated administrator account for CloudFormation StackSets, with trusted access
 * enabled, and an organizational unit to deploy to. These environment variables apply when
 * you deploy the test by hand with `deploy` enabled:
 *
 * - `INTEG_TARGET_OU`: the organizational unit to deploy to, narrowed by the intersection filter
 * - `INTEG_TARGET_ACCOUNT`: an account in `INTEG_TARGET_OU` that the intersection filter deploys to
 */

const targetOu = process.env.INTEG_TARGET_OU ?? 'ou-abcd-11111111';
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

    new cfn.StackSet(this, 'StackSet', {
      target: cfn.StackSetTarget.fromOrganizationalUnits({
        organizationalUnits: [targetOu],
        regions: [targetRegion],
        accountFilter: cfn.StackSetAccountFilter.intersection([targetAccount]),
      }),
      deploymentType: cfn.DeploymentType.serviceManaged(),
      template: cfn.StackSetTemplate.fromStackSetStack(new TopicStackSet(this, 'integ-stack-set-service-managed-template')),
    });
  }
}

const testCase = new TestCase(app, 'integ-stack-set-service-managed');

new IntegTest(app, 'integ-stack-set-service-managed-test', {
  testCases: [testCase],
  // Service managed StackSets deploy only from an Organizations management or delegated admin account
  cdkCommandOptions: {
    deploy: {
      enabled: false,
    },
    destroy: {
      enabled: false,
    },
  },
});
