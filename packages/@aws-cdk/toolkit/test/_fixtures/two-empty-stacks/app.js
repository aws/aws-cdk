import * as cdk from 'aws-cdk-lib/core';

const app = new cdk.App({ autoSynth: false });
new cdk.Stack(app, 'Stack1');
new cdk.Stack(app, 'Stack2');

app.synth();
