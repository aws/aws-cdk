import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { InvestigationGroup } from '../lib/investigation-group';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-aiops-investigation-group-integ-stack');

// Create investigation group with default role
new InvestigationGroup(stack, 'DefaultRoleInvestigationGroup', {
  investigationGroupName: 'default-role-investigation-group',
});

// Create investigation group with custom role
const customRole = new cdk.aws_iam.Role(stack, 'CustomInvestigationRole', {
  assumedBy: new cdk.aws_iam.ServicePrincipal('aiops.amazonaws.com'),
  description: 'Custom role for AIOps investigation group',
  managedPolicies: [
    cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchReadOnlyAccess'),
    cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLogsReadOnlyAccess'),
    cdk.aws_iam.ManagedPolicy.fromAwsManagedPolicyName('AIOpsAssistantPolicy'),
  ],
});

new InvestigationGroup(stack, 'CustomRoleInvestigationGroup', {
  investigationGroupName: 'custom-role-investigation-group',
  role: customRole,
});

new IntegTest(app, 'AIOpsInvestigationGroupIntegTest', {
  testCases: [stack],
  diffAssets: true,
  stackUpdateWorkflow: true,
});
