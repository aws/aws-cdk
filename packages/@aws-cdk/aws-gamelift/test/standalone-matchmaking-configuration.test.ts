import { Template } from '@aws-cdk/assertions';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as cdk from '@aws-cdk/core';
import { Duration } from '@aws-cdk/core';
import * as gamelift from '../lib';

describe('standaloneMatchmakingConfiguration', () => {

  describe('new', () => {
    let stack: cdk.Stack;
    const ruleSetBody = JSON.stringify('{}');
    let ruleSet: gamelift.MatchmakingRuleSet;

    beforeEach(() => {
      stack = new cdk.Stack();
      ruleSet = new gamelift.MatchmakingRuleSet(stack, 'MyMatchmakingRuleSet', {
        matchmakingRuleSetName: 'test-ruleSet',
        content: gamelift.RuleSetContent.fromInline(ruleSetBody),
      });
    });

    test('default StandaloneMatchmakingConfiguration', () => {
      new gamelift.StandaloneMatchmakingConfiguration(stack, 'MyStandaloneMatchmakingConfiguration', {
        matchmakingConfigurationName: 'test-config-name',
        ruleSet: ruleSet,
      });

      Template.fromStack(stack).hasResource('AWS::GameLift::MatchmakingConfiguration', {
        Properties:
            {
              Name: 'test-config-name',
              NotificationTarget: { Ref: 'MyStandaloneMatchmakingConfigurationTopicDEF24815' },
              FlexMatchMode: 'STANDALONE',
              AcceptanceRequired: false,
              RequestTimeoutSeconds: 300,
              RuleSetName: { Ref: 'MyMatchmakingRuleSet41F295C4' },
            },
      });
    });

    test('with all properties', () => {
      new gamelift.StandaloneMatchmakingConfiguration(stack, 'MyStandaloneMatchmakingConfiguration', {
        matchmakingConfigurationName: 'test-standaloneMatchmakingConfiguration',
        ruleSet: ruleSet,
      });

      Template.fromStack(stack).hasResource('AWS::GameLift::MatchmakingConfiguration', {
        Properties:
            {
              Name: 'test-standaloneMatchmakingConfiguration',
              NotificationTarget: { Ref: 'MyStandaloneMatchmakingConfigurationTopicDEF24815' },
              FlexMatchMode: 'STANDALONE',
              AcceptanceRequired: false,
              RequestTimeoutSeconds: 300,
              RuleSetName: { Ref: 'MyMatchmakingRuleSet41F295C4' },
            },
      });
    });

    test('with an incorrect name', () => {
      let incorrectName = '';
      for (let i = 0; i < 129; i++) {
        incorrectName += 'A';
      }

      expect(() => new gamelift.StandaloneMatchmakingConfiguration(stack, 'MyStandaloneMatchmakingConfiguration', {
        matchmakingConfigurationName: incorrectName,
        ruleSet: ruleSet,
      })).toThrow(/Matchmaking configuration name can not be longer than 128 characters but has 129 characters./);
    });

    test('with an incorrect name format', () => {
      let incorrectName = 'test with space';

      expect(() => new gamelift.StandaloneMatchmakingConfiguration(stack, 'MyStandaloneMatchmakingConfiguration', {
        matchmakingConfigurationName: incorrectName,
        ruleSet: ruleSet,
      })).toThrow(/Matchmaking configuration name test with space can contain only letters, numbers, hyphens, back slash or dot with no spaces./);
    });

    test('with an incorrect description', () => {
      let incorrectDescription = '';
      for (let i = 0; i < 1025; i++) {
        incorrectDescription += 'A';
      }

      expect(() => new gamelift.StandaloneMatchmakingConfiguration(stack, 'MyStandaloneMatchmakingConfiguration', {
        matchmakingConfigurationName: 'test-config-name',
        ruleSet: ruleSet,
        description: incorrectDescription,
      })).toThrow(/Matchmaking configuration description can not be longer than 1024 characters but has 1025 characters./);
    });

    test('with an incorrect custom event data length', () => {
      let incorrectField: string = '';
      for (let i = 0; i < 257; i++) {
        incorrectField += 'A';
      }

      expect(() => new gamelift.StandaloneMatchmakingConfiguration(stack, 'MyStandaloneMatchmakingConfiguration', {
        matchmakingConfigurationName: 'test-config-name',
        ruleSet: ruleSet,
        customEventData: incorrectField,
      })).toThrow(/Matchmaking configuration custom event data can not be longer than 256 characters but has 257 characters./);
    });

    test('with an incorrect acceptance timeout', () => {
      expect(() => new gamelift.StandaloneMatchmakingConfiguration(stack, 'MyStandaloneMatchmakingConfiguration', {
        matchmakingConfigurationName: 'test-config-name',
        ruleSet: ruleSet,
        acceptanceTimeout: Duration.seconds(700),
      })).toThrow(/Matchmaking configuration acceptance timeout can not exceed 600 seconds, actual 700 seconds./);
    });

    test('with an incorrect request timeout', () => {
      expect(() => new gamelift.StandaloneMatchmakingConfiguration(stack, 'MyStandaloneMatchmakingConfiguration', {
        matchmakingConfigurationName: 'test-config-name',
        ruleSet: ruleSet,
        requestTimeout: Duration.seconds(43300),
      })).toThrow(/Matchmaking configuration request timeout can not exceed 43200 seconds, actual 43300 seconds./);
    });
  });

  describe('metric methods provide a Metric with configured and attached properties', () => {
    let stack: cdk.Stack;
    const ruleSetBody = JSON.stringify('{}');
    let ruleSet: gamelift.MatchmakingRuleSet;
    let standaloneMatchmakingConfiguration: gamelift.StandaloneMatchmakingConfiguration;

    beforeEach(() => {
      stack = new cdk.Stack(undefined, undefined, { env: { account: '000000000000', region: 'us-west-1' } });
      ruleSet = new gamelift.MatchmakingRuleSet(stack, 'MyMatchmakingRuleSet', {
        matchmakingRuleSetName: 'test-ruleSet',
        content: gamelift.RuleSetContent.fromInline(ruleSetBody),
      });
      standaloneMatchmakingConfiguration = new gamelift.StandaloneMatchmakingConfiguration(stack, 'MyStandaloneMatchmakingConfiguration', {
        matchmakingConfigurationName: 'test-config-name',
        ruleSet: ruleSet,
      });
    });

    test('metric', () => {
      const metric = standaloneMatchmakingConfiguration.metric('CurrentTickets');

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'CurrentTickets',
        dimensions: {
          MatchmakingConfigurationName: standaloneMatchmakingConfiguration.matchmakingConfigurationName,
        },
      });
    });

    test('metricPlayersStarted', () => {
      const metric = standaloneMatchmakingConfiguration.metricPlayersStarted();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'PlayersStarted',
        statistic: cloudwatch.Stats.AVERAGE,
        dimensions: {
          MatchmakingConfigurationName: standaloneMatchmakingConfiguration.matchmakingConfigurationName,
        },
      });
    });

    test('metricMatchesRejected', () => {
      const metric = standaloneMatchmakingConfiguration.metricMatchesRejected();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'MatchesRejected',
        statistic: cloudwatch.Stats.AVERAGE,
        dimensions: {
          MatchmakingConfigurationName: standaloneMatchmakingConfiguration.matchmakingConfigurationName,
        },
      });
    });

    test('metricMatchesPlaced', () => {
      const metric = standaloneMatchmakingConfiguration.metricMatchesPlaced();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'MatchesPlaced',
        statistic: cloudwatch.Stats.AVERAGE,
        dimensions: {
          MatchmakingConfigurationName: standaloneMatchmakingConfiguration.matchmakingConfigurationName,
        },
      });
    });

    test('metricMatchesCreated', () => {
      const metric = standaloneMatchmakingConfiguration.metricMatchesCreated();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'MatchesCreated',
        statistic: cloudwatch.Stats.AVERAGE,
        dimensions: {
          MatchmakingConfigurationName: standaloneMatchmakingConfiguration.matchmakingConfigurationName,
        },
      });
    });

    test('metricMatchesAccepted', () => {
      const metric = standaloneMatchmakingConfiguration.metricMatchesAccepted();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'MatchesAccepted',
        statistic: cloudwatch.Stats.AVERAGE,
        dimensions: {
          MatchmakingConfigurationName: standaloneMatchmakingConfiguration.matchmakingConfigurationName,
        },
      });
    });

    test('metricCurrentTickets', () => {
      const metric = standaloneMatchmakingConfiguration.metricCurrentTickets();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'CurrentTickets',
        statistic: cloudwatch.Stats.AVERAGE,
        dimensions: {
          MatchmakingConfigurationName: standaloneMatchmakingConfiguration.matchmakingConfigurationName,
        },
      });
    });


  });

  describe('test import methods', () => {
    test('StandaloneMatchmakingConfiguration.fromStandaloneMatchmakingConfigurationArn', () => {
      // GIVEN
      const stack2 = new cdk.Stack();

      // WHEN
      const imported = gamelift.StandaloneMatchmakingConfiguration.fromStandaloneMatchmakingConfigurationArn(stack2, 'Imported', 'arn:aws:gamelift:us-east-1:123456789012:matchmakingconfiguration/sample-standaloneMatchmakingConfiguration-name');

      // THEN
      expect(imported.matchmakingConfigurationArn).toEqual('arn:aws:gamelift:us-east-1:123456789012:matchmakingconfiguration/sample-standaloneMatchmakingConfiguration-name');
      expect(imported.matchmakingConfigurationName).toEqual('sample-standaloneMatchmakingConfiguration-name');
    });

    test('StandaloneMatchmakingConfiguration.fromStandaloneMatchmakingConfigurationName', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const imported = gamelift.StandaloneMatchmakingConfiguration.fromStandaloneMatchmakingConfigurationName(stack, 'Imported', 'sample-matchmakingConfiguration-name');

      // THEN
      expect(stack.resolve(imported.matchmakingConfigurationArn)).toStrictEqual({
        'Fn::Join': ['', [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':gamelift:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':matchmakingconfiguration/sample-matchmakingConfiguration-name',
        ]],
      });
      expect(stack.resolve(imported.matchmakingConfigurationName)).toStrictEqual('sample-matchmakingConfiguration-name');
    });
  });

  describe('StandaloneMatchmakingConfiguration.fromStandaloneMatchmakingConfigurationAttributes()', () => {
    let stack: cdk.Stack;
    const matchmakingConfigurationName = 'matchmakingConfiguration-test-name';
    const matchmakingConfigurationArn = `arn:aws:gamelift:matchmakingConfiguration-region:123456789012:matchmakingconfiguration/${matchmakingConfigurationName}`;

    beforeEach(() => {
      const app = new cdk.App();
      stack = new cdk.Stack(app, 'Base', {
        env: { account: '111111111111', region: 'stack-region' },
      });
    });

    describe('', () => {
      test('with required attrs only', () => {
        const importedFleet = gamelift.StandaloneMatchmakingConfiguration.fromMatchmakingConfigurationAttributes(stack, 'ImportedStandaloneMatchmakingConfiguration', { matchmakingConfigurationArn });

        expect(importedFleet.matchmakingConfigurationName).toEqual(matchmakingConfigurationName);
        expect(importedFleet.matchmakingConfigurationArn).toEqual(matchmakingConfigurationArn);
        expect(importedFleet.env.account).toEqual('123456789012');
        expect(importedFleet.env.region).toEqual('matchmakingConfiguration-region');
      });

      test('with missing attrs', () => {
        expect(() => gamelift.StandaloneMatchmakingConfiguration.fromMatchmakingConfigurationAttributes(stack, 'ImportedStandaloneMatchmakingConfiguration', { }))
          .toThrow(/Either matchmakingConfigurationName or matchmakingConfigurationArn must be provided in MatchmakingConfigurationAttributes/);
      });

      test('with invalid ARN', () => {
        expect(() => gamelift.StandaloneMatchmakingConfiguration.fromMatchmakingConfigurationAttributes(stack, 'ImportedStandaloneMatchmakingConfiguration', { matchmakingConfigurationArn: 'arn:aws:gamelift:matchmakingConfiguration-region:123456789012:matchmakingconfiguration' }))
          .toThrow(/No matchmaking configuration name found in ARN: 'arn:aws:gamelift:matchmakingConfiguration-region:123456789012:matchmakingconfiguration'/);
      });
    });

    describe('for an standaloneMatchmakingConfiguration in a different account and region', () => {
      let standaloneMatchmakingConfiguration: gamelift.IMatchmakingConfiguration;

      beforeEach(() => {
        standaloneMatchmakingConfiguration = gamelift.StandaloneMatchmakingConfiguration.fromMatchmakingConfigurationAttributes(stack, 'ImportedStandaloneMatchmakingConfiguration', { matchmakingConfigurationArn });
      });

      test("the standaloneMatchmakingConfiguration's region is taken from the ARN", () => {
        expect(standaloneMatchmakingConfiguration.env.region).toBe('matchmakingConfiguration-region');
      });

      test("the standaloneMatchmakingConfiguration's account is taken from the ARN", () => {
        expect(standaloneMatchmakingConfiguration.env.account).toBe('123456789012');
      });
    });
  });
});