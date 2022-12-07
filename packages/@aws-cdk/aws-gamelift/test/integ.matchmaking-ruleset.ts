import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import { CfnOutput } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as gamelift from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ruleSet = new gamelift.MatchmakingRuleSet(this, 'MatchmakingRuleSet', {
      matchmakingRuleSetName: 'my-test-ruleset',
      content: gamelift.RuleSetContent.fromJsonFile(path.join(__dirname, 'my-ruleset/ruleset.json')),
    });

    new CfnOutput(this, 'MatchmakingRuleSetArn', { value: ruleSet.matchmakingRuleSetArn });
    new CfnOutput(this, 'MatchmakingRuleSetName', { value: ruleSet.matchmakingRuleSetName });
  }
}

// Beginning of the test suite
const app = new cdk.App();
const stack = new TestStack(app, 'aws-gamelift-build');
new IntegTest(app, 'Build', {
  testCases: [stack],
});

app.synth();
