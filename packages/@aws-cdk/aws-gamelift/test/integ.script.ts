import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as gamelift from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-gamelift-script');

new gamelift.Script(stack, 'Script', {
  content: gamelift.Content.fromAsset(path.join(__dirname, 'my-game-script')),
});

app.synth();
