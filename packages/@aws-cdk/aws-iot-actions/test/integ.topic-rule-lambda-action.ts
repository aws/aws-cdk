import * as iot from '@aws-cdk/aws-iot';
import * as lambda from '@aws-cdk/aws-lambda';

import * as cdk from '@aws-cdk/core';
import * as actions from '../lib';


// --------------------------------
// Define a rule that triggers an Lambda funcion when data is received.
// Automatically creates invoke lambda permission
//
const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-topic-rule-lambda-action');

// Create an IoT topic rule with an error action.
new iot.TopicRule(stack, 'MyIotTopicRule', {
  sql: 'SELECT * FROM \'topic/subtopic\'',
  actions: [
    new actions.Lambda({
      function: new lambda.Function(stack, 'Function', {
        code: lambda.Code.fromInline('boom'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_12_X,
      }),
    }),
  ],
});

app.synth();
