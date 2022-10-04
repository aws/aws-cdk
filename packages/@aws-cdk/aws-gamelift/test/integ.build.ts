import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as gamelift from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-gamelift-build');

new gamelift.Build(stack, 'Build', {
  content: gamelift.Content.fromAsset(path.join(__dirname, 'my-game-build')),
});

app.synth();
