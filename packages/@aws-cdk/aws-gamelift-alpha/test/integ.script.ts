import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as gamelift from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new gamelift.Script(this, 'Script', {
      content: gamelift.Content.fromAsset(path.join(__dirname, 'my-game-script')),
    });
  }
}

// Beginning of the test suite
const app = new cdk.App();
const stack = new TestStack(app, 'aws-gamelift-script');
new IntegTest(app, 'Script', {
  testCases: [stack],
});

app.synth();
