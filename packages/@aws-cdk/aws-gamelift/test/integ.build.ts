import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import { CfnOutput } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as gamelift from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const build = new gamelift.Build(this, 'Build', {
      content: gamelift.Content.fromAsset(path.join(__dirname, 'my-game-build')),
      operatingSystem: gamelift.OperatingSystem.AMAZON_LINUX_2,
      buildVersion: '1.0',
    });

    new CfnOutput(this, 'BuildArn', { value: build.buildArn });
    new CfnOutput(this, 'BuildId', { value: build.buildId });
  }
}

// Beginning of the test suite
const app = new cdk.App();
const stack = new TestStack(app, 'aws-gamelift-build');
new IntegTest(app, 'Build', {
  testCases: [stack],
});

app.synth();
