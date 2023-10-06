import * as sns from 'aws-cdk-lib/aws-sns';
import { App, Fn, NestedStack, Stack } from 'aws-cdk-lib';

const app = new App();
const top = new Stack(app, 'nested-stacks-multi-refs');
const level1 = new sns.Topic(top, 'Level1');
const nested1 = new NestedStack(top, 'Nested1');
const nested2 = new NestedStack(nested1, 'Nested2');
const nested3 = new NestedStack(nested2, 'Nested3');

// WHEN
const level2 = new sns.Topic(nested2, 'Level2ReferencesLevel1', {
  displayName: shortName(level1.topicName),
});

new sns.Topic(nested3, 'Level3ReferencesLevel1', {
  displayName: shortName(level1.topicName),
});

new sns.Topic(nested3, 'Level3ReferencesLevel2', {
  displayName: shortName(level2.topicName),
});

app.synth();

// topicName is too long for displayName, so just take the second part:
// Stack1-NestedUnderStack1NestedStackNestedUnderStack1NestedStackResourceF616305B-EM64TEGA04J9-TopicInNestedUnderStack115E329C4-HEO7NLYC1AFL
function shortName(topicName: string) {
  return Fn.select(1, Fn.split('-', topicName));
}
