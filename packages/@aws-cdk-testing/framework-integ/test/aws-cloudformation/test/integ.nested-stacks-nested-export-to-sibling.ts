/// !cdk-integ Stack1 Stack2

import * as sns from 'aws-cdk-lib/aws-sns';
import { App, Fn, NestedStack, Stack } from 'aws-cdk-lib';

const app = new App();
const stack1 = new Stack(app, 'Stack1');
const stack2 = new Stack(app, 'Stack2');

const nestedUnderStack1 = new NestedStack(stack1, 'NestedUnderStack1');
const topicInNestedUnderStack1 = new sns.Topic(nestedUnderStack1, 'TopicInNestedUnderStack1');

new sns.Topic(stack2, 'TopicInStack2', {
  // topicName is too long for displayName, so just take the second part:
  // Stack1-NestedUnderStack1NestedStackNestedUnderStack1NestedStackResourceF616305B-EM64TEGA04J9-TopicInNestedUnderStack115E329C4-HEO7NLYC1AFL
  displayName: Fn.select(1, Fn.split('-', topicInNestedUnderStack1.topicName)),
});

app.synth();
