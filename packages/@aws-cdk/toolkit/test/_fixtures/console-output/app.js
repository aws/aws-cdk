import * as cdk from 'aws-cdk-lib/core';

console.log('line one');
const app = new cdk.App({ autoSynth: false });
console.log('line two');
new cdk.Stack(app, 'Stack1');
console.log('line three');
app.synth();
console.log('line four');
