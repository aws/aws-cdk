import * as iot from '@aws-cdk/aws-iot';
import * as cdk from '@aws-cdk/core';
import * as actions from '../lib';


// --------------------------------
// Define a rule that triggers to republish received data.
// Automatically creates invoke lambda permission
//
const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-topic-rule-republish-action');

// Create an IoT topic rule with an error action.
new iot.TopicRule(stack, 'MyRepublishTopicRule', {
  sql: 'SELECT * FROM \'topic/subtopic\'',
  actions: [
    new actions.Republish({
      topic: 'some/topic',
    }),
  ],
});

app.synth();
