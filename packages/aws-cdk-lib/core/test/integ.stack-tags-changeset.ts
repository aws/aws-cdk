/**
 * Integration test for stack tagging behavior with explicitStackTags feature flag.
 * This test verifies that ChangeSets receive proper tags even when the explicitStackTags
 * feature flag is enabled, ensuring compliance with SCP policies that require tags on ChangeSets.
 */

import { App, Stack, Tags, CfnOutput } from 'aws-cdk-lib';

const app = new App({
  context: {
    '@aws-cdk/core:explicitStackTags': true,
  },
});

// Stack with Tags.of(stack).add() - should apply to ChangeSets  
const stack = new Stack(app, 'integ-stack-tags-changeset', {
  env: { region: 'us-east-1' },
});

// Add tags using Tags.of(stack).add() - these should be applied to ChangeSets
Tags.of(stack).add('Environment', 'IntegTest');
Tags.of(stack).add('Project', 'CDK-Core');
Tags.of(stack).add('Owner', 'CDK-Team');
Tags.of(stack).add('CostCenter', 'Engineering');

// Test the new applyToChangeSets property
Tags.of(stack).add('ChangeSetTag', 'ShouldAppear');
Tags.of(stack).add('NoChangeSetTag', 'ShouldNotAppear', { applyToChangeSets: false });

// Add direct stack tags as well
stack.addStackTag('DirectTag', 'DirectValue');

// Add a simple resource to make the stack deployable
new CfnOutput(stack, 'TestOutput', {
  value: 'test-value',
  description: 'Test output for integration test',
});

app.synth();