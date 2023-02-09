import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import { CfnOutput } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as gamelift from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ruleSet = new gamelift.MatchmakingRuleSet(this, 'StandaloneMatchmakingConfiguration', {
      matchmakingRuleSetName: 'my-test-ruleset',
      content: gamelift.RuleSetContent.fromJsonFile(path.join(__dirname, 'my-ruleset/ruleset.json')),
    });

    const matchmakingConfiguration = new gamelift.StandaloneMatchmakingConfiguration(this, 'MyStandaloneMatchmakingConfiguration', {
      matchmakingConfigurationName: 'test-config-name',
      ruleSet: ruleSet,
      customEventData: 'event-data',
      description: 'test description',
      requestTimeout: cdk.Duration.seconds(30),
      requireAcceptance: true,
      acceptanceTimeout: cdk.Duration.seconds(30),
    });

    new CfnOutput(this, 'MatchmakingConfigurationArn', { value: matchmakingConfiguration.matchmakingConfigurationArn });
    new CfnOutput(this, 'MatchmakingConfigurationName', { value: matchmakingConfiguration.matchmakingConfigurationName });
  }
}

// Beginning of the test suite
const app = new cdk.App();
const stack = new TestStack(app, 'aws-gamelift-standalone-matchmaking-configuration');
new IntegTest(app, 'StandaloneMatchmakingConfiguration', {
  testCases: [stack],
});

app.synth();
