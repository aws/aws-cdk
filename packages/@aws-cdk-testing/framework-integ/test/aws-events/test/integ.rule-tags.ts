import { App, Stack, Tags, Duration } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';

/**
 * Integration test for EventBridge Rule tagging (Issue #4907)
 *
 * This test verifies that tags applied to EventBridge Rules via Tags.of().add()
 * are properly propagated to the CloudFormation template and deployed to AWS.
 */
const app = new App();

const stack = new Stack(app, 'RuleTagsStack');

// Apply a tag at the stack level to test inheritance
Tags.of(stack).add('StackLevelTag', 'StackLevelValue');

// Create a rule with a schedule and apply tags
const scheduledRule = new Rule(stack, 'ScheduledRule', {
  ruleName: 'TaggedScheduledRule',
  schedule: Schedule.rate(Duration.hours(1)),
  description: 'A scheduled rule with tags for testing',
});

// Apply multiple tags to the rule
Tags.of(scheduledRule).add('Environment', 'Test');
Tags.of(scheduledRule).add('Team', 'Platform');
Tags.of(scheduledRule).add('CostCenter', '12345');

// Create a rule with an event pattern and apply tags
const eventPatternRule = new Rule(stack, 'EventPatternRule', {
  ruleName: 'TaggedEventPatternRule',
  eventPattern: {
    source: ['aws.ec2'],
    detailType: ['EC2 Instance State-change Notification'],
  },
  description: 'An event pattern rule with tags for testing',
});

Tags.of(eventPatternRule).add('Environment', 'Test');
Tags.of(eventPatternRule).add('Purpose', 'EC2Monitoring');

new IntegTest(app, 'IntegTest-RuleTags', {
  testCases: [stack],
});
