import * as path from 'path';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { CfnOutput } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as gamelift from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ruleSet = new gamelift.MatchmakingRuleSet(this, 'MatchmakingRuleSet', {
      matchmakingRuleSetName: 'my-test-ruleset-mr',
      content: gamelift.RuleSetContent.fromJsonFile(path.join(__dirname, 'my-ruleset', 'ruleset.json')),
    });

    new CfnOutput(this, 'MatchmakingRuleSetArn', { value: ruleSet.matchmakingRuleSetArn });
    new CfnOutput(this, 'MatchmakingRuleSetName', { value: ruleSet.matchmakingRuleSetName });
  }
}

// Beginning of the test suite
const app = new cdk.App();
const stack = new TestStack(app, 'aws-gamelift-matchmaking-ruleset');
new IntegTest(app, 'MatchmakingRuleSet', {
  testCases: [stack],
  regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-northeast-1', 'ap-northeast-2', 'ap-southeast-2'],
});

app.synth();
