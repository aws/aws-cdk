import * as cdk from '@aws-cdk/core';

const app = new cdk.App();
new cdk.Stack(app, 'AppStack1');
new cdk.Stack(app, 'AppStack2');

app.synth();
