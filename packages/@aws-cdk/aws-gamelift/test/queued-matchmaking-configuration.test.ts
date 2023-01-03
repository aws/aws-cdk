import { Template } from '@aws-cdk/assertions';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as cdk from '@aws-cdk/core';
import { Duration } from '@aws-cdk/core';
import * as gamelift from '../lib';

describe('queuedMatchmakingConfiguration', () => {

  describe('new', () => {
    let stack: cdk.Stack;
    const ruleSetBody = JSON.stringify('{}');
    let gameSessionQueue: gamelift.GameSessionQueueBase;
    let ruleSet: gamelift.MatchmakingRuleSet;

    beforeEach(() => {
      stack = new cdk.Stack();
      gameSessionQueue = new gamelift.GameSessionQueue(stack, 'MyGameSessionQueue', {
        gameSessionQueueName: 'test-queue-name',
        destinations: [],
      });
      ruleSet = new gamelift.MatchmakingRuleSet(stack, 'MyMatchmakingRuleSet', {
        matchmakingRuleSetName: 'test-ruleSet',
        content: gamelift.RuleSetContent.fromInline(ruleSetBody),
      });
    });

    test('default QueuedMatchmakingConfiguration', () => {
      new gamelift.QueuedMatchmakingConfiguration(stack, 'MyQueuedMatchmakingConfiguration', {
        matchmakingConfigurationName: 'test-config-name',
        gameSessionQueues: [gameSessionQueue],
        ruleSet: ruleSet,
      });

      Template.fromStack(stack).hasResource('AWS::GameLift::MatchmakingConfiguration', {
        Properties: {
          Name: 'test-config-name',
          NotificationTarget: { Ref: 'MyQueuedMatchmakingConfigurationTopicBAC3E679' },
          FlexMatchMode: 'WITH_QUEUE',
          BackfillMode: 'AUTOMATIC',
          AcceptanceRequired: false,
          RequestTimeoutSeconds: 300,
          RuleSetName: { Ref: 'MyMatchmakingRuleSet41F295C4' },
          GameSessionQueueArns: [
            {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':gamelift:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':gamesessionqueue/',
                  {
                    Ref: 'MyGameSessionQueue1A15CE31',
                  },
                ],
              ],
            },
          ],
        },
      });
    });

    test('add game session queue', () => {
      const gameSessionQueue2 = new gamelift.GameSessionQueue(stack, 'MyGameSessionQueue2', {
        gameSessionQueueName: 'test-queue-name-2',
        destinations: [],
      });

      const matchmakingConfiguration = new gamelift.QueuedMatchmakingConfiguration(stack, 'MyQueuedMatchmakingConfiguration', {
        matchmakingConfigurationName: 'test-config-name',
        gameSessionQueues: [gameSessionQueue],
        ruleSet: ruleSet,
      });

      matchmakingConfiguration.addGameSessionQueue(gameSessionQueue2);

      Template.fromStack(stack).hasResource('AWS::GameLift::MatchmakingConfiguration', {
        Properties: {
          Name: 'test-config-name',
          NotificationTarget: { Ref: 'MyQueuedMatchmakingConfigurationTopicBAC3E679' },
          FlexMatchMode: 'WITH_QUEUE',
          BackfillMode: 'AUTOMATIC',
          AcceptanceRequired: false,
          RequestTimeoutSeconds: 300,
          RuleSetName: { Ref: 'MyMatchmakingRuleSet41F295C4' },
          GameSessionQueueArns: [
            {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':gamelift:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':gamesessionqueue/',
                  {
                    Ref: 'MyGameSessionQueue1A15CE31',
                  },
                ],
              ],
            },
            {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':gamelift:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':gamesessionqueue/',
                  {
                    Ref: 'MyGameSessionQueue2EED85BF6',
                  },
                ],
              ],
            },
          ],
        },
      });
    });

    test('with all properties', () => {
      new gamelift.QueuedMatchmakingConfiguration(stack, 'MyQueuedMatchmakingConfiguration', {
        matchmakingConfigurationName: 'test-queuedMatchmakingConfiguration',
        gameSessionQueues: [gameSessionQueue],
        ruleSet: ruleSet,
        customEventData: 'event-data',
        gameProperties: [{
          key: 'test-key',
          value: 'test-value',
        }],
        gameSessionData: 'test-session-data',
        manualBackfillMode: true,
        additionalPlayerCount: 3,
        description: 'test description',
        requestTimeout: cdk.Duration.seconds(30),
        requireAcceptance: true,
        acceptanceTimeout: cdk.Duration.seconds(30),
      });

      Template.fromStack(stack).hasResource('AWS::GameLift::MatchmakingConfiguration', {
        Properties: {
          Name: 'test-queuedMatchmakingConfiguration',
          NotificationTarget: { Ref: 'MyQueuedMatchmakingConfigurationTopicBAC3E679' },
          FlexMatchMode: 'WITH_QUEUE',
          BackfillMode: 'MANUAL',
          AcceptanceRequired: true,
          RequestTimeoutSeconds: 30,
          RuleSetName: { Ref: 'MyMatchmakingRuleSet41F295C4' },
          AcceptanceTimeoutSeconds: 30,
          AdditionalPlayerCount: 3,
          GameSessionData: 'test-session-data',
          Description: 'test description',
          GameProperties: [
            {
              Key: 'test-key',
              Value: 'test-value',
            },
          ],
          GameSessionQueueArns: [
            {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':gamelift:',
                  {
                    Ref: 'AWS::Region',
                  },
                  ':',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':gamesessionqueue/',
                  {
                    Ref: 'MyGameSessionQueue1A15CE31',
                  },
                ],
              ],
            },
          ],
        },
      });
    });

    test('with an incorrect name', () => {
      let incorrectName = '';
      for (let i = 0; i < 129; i++) {
        incorrectName += 'A';
      }

      expect(() => new gamelift.QueuedMatchmakingConfiguration(stack, 'MyQueuedMatchmakingConfiguration', {
        matchmakingConfigurationName: incorrectName,
        gameSessionQueues: [gameSessionQueue],
        ruleSet: ruleSet,
      })).toThrow(/Matchmaking configuration name can not be longer than 128 characters but has 129 characters./);
    });

    test('with an incorrect name format', () => {
      let incorrectName = 'test with space';

      expect(() => new gamelift.QueuedMatchmakingConfiguration(stack, 'MyQueuedMatchmakingConfiguration', {
        matchmakingConfigurationName: incorrectName,
        gameSessionQueues: [gameSessionQueue],
        ruleSet: ruleSet,
      })).toThrow(/Matchmaking configuration name test with space can contain only letters, numbers, hyphens, back slash or dot with no spaces./);
    });

    test('with an incorrect description', () => {
      let incorrectDescription = '';
      for (let i = 0; i < 1025; i++) {
        incorrectDescription += 'A';
      }

      expect(() => new gamelift.QueuedMatchmakingConfiguration(stack, 'MyQueuedMatchmakingConfiguration', {
        matchmakingConfigurationName: 'test-config-name',
        gameSessionQueues: [gameSessionQueue],
        ruleSet: ruleSet,
        description: incorrectDescription,
      })).toThrow(/Matchmaking configuration description can not be longer than 1024 characters but has 1025 characters./);
    });

    test('with an incorrect number of game properties', () => {
      let incorrectField: gamelift.GameProperty[] = [];
      for (let i = 0; i < 17; i++) {
        incorrectField.push({
          key: 'test',
          value: 'test',
        });
      }

      expect(() => new gamelift.QueuedMatchmakingConfiguration(stack, 'MyQueuedMatchmakingConfiguration', {
        matchmakingConfigurationName: 'test-config-name',
        gameSessionQueues: [gameSessionQueue],
        ruleSet: ruleSet,
        gameProperties: incorrectField,
      })).toThrow(/The maximum number of game properties allowed in the matchmaking configuration cannot be higher than 16, given 17/);
    });

    test('with an incorrect game session data length', () => {
      let incorrectField: string = '';
      for (let i = 0; i < 4097; i++) {
        incorrectField += 'A';
      }

      expect(() => new gamelift.QueuedMatchmakingConfiguration(stack, 'MyQueuedMatchmakingConfiguration', {
        matchmakingConfigurationName: 'test-config-name',
        gameSessionQueues: [gameSessionQueue],
        ruleSet: ruleSet,
        gameSessionData: incorrectField,
      })).toThrow(/Matchmaking configuration game session data can not be longer than 4096 characters but has 4097 characters./);
    });

    test('with an incorrect custom event data length', () => {
      let incorrectField: string = '';
      for (let i = 0; i < 257; i++) {
        incorrectField += 'A';
      }

      expect(() => new gamelift.QueuedMatchmakingConfiguration(stack, 'MyQueuedMatchmakingConfiguration', {
        matchmakingConfigurationName: 'test-config-name',
        gameSessionQueues: [gameSessionQueue],
        ruleSet: ruleSet,
        customEventData: incorrectField,
      })).toThrow(/Matchmaking configuration custom event data can not be longer than 256 characters but has 257 characters./);
    });

    test('with an incorrect acceptance timeout', () => {
      expect(() => new gamelift.QueuedMatchmakingConfiguration(stack, 'MyQueuedMatchmakingConfiguration', {
        matchmakingConfigurationName: 'test-config-name',
        gameSessionQueues: [gameSessionQueue],
        ruleSet: ruleSet,
        acceptanceTimeout: Duration.seconds(700),
      })).toThrow(/Matchmaking configuration acceptance timeout can not exceed 600 seconds, actual 700 seconds./);
    });

    test('with an incorrect request timeout', () => {
      expect(() => new gamelift.QueuedMatchmakingConfiguration(stack, 'MyQueuedMatchmakingConfiguration', {
        matchmakingConfigurationName: 'test-config-name',
        gameSessionQueues: [gameSessionQueue],
        ruleSet: ruleSet,
        requestTimeout: Duration.seconds(43300),
      })).toThrow(/Matchmaking configuration request timeout can not exceed 43200 seconds, actual 43300 seconds./);
    });
  });

  describe('metric methods provide a Metric with configured and attached properties', () => {
    let stack: cdk.Stack;
    const ruleSetBody = JSON.stringify('{}');
    let gameSessionQueue: gamelift.GameSessionQueueBase;
    let ruleSet: gamelift.MatchmakingRuleSet;
    let queuedMatchmakingConfiguration: gamelift.QueuedMatchmakingConfiguration;

    beforeEach(() => {
      stack = new cdk.Stack(undefined, undefined, { env: { account: '000000000000', region: 'us-west-1' } });
      gameSessionQueue = new gamelift.GameSessionQueue(stack, 'MyGameSessionQueue', {
        gameSessionQueueName: 'test-queue-name',
        destinations: [],
      });
      ruleSet = new gamelift.MatchmakingRuleSet(stack, 'MyMatchmakingRuleSet', {
        matchmakingRuleSetName: 'test-ruleSet',
        content: gamelift.RuleSetContent.fromInline(ruleSetBody),
      });
      queuedMatchmakingConfiguration = new gamelift.QueuedMatchmakingConfiguration(stack, 'MyQueuedMatchmakingConfiguration', {
        matchmakingConfigurationName: 'test-config-name',
        gameSessionQueues: [gameSessionQueue],
        ruleSet: ruleSet,
      });
    });

    test('metric', () => {
      const metric = queuedMatchmakingConfiguration.metric('CurrentTickets');

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'CurrentTickets',
        dimensions: {
          MatchmakingConfigurationName: queuedMatchmakingConfiguration.matchmakingConfigurationName,
        },
      });
    });

    test('metricPlayersStarted', () => {
      const metric = queuedMatchmakingConfiguration.metricPlayersStarted();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'PlayersStarted',
        statistic: cloudwatch.Stats.AVERAGE,
        dimensions: {
          MatchmakingConfigurationName: queuedMatchmakingConfiguration.matchmakingConfigurationName,
        },
      });
    });

    test('metricMatchesRejected', () => {
      const metric = queuedMatchmakingConfiguration.metricMatchesRejected();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'MatchesRejected',
        statistic: cloudwatch.Stats.AVERAGE,
        dimensions: {
          MatchmakingConfigurationName: queuedMatchmakingConfiguration.matchmakingConfigurationName,
        },
      });
    });

    test('metricMatchesPlaced', () => {
      const metric = queuedMatchmakingConfiguration.metricMatchesPlaced();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'MatchesPlaced',
        statistic: cloudwatch.Stats.AVERAGE,
        dimensions: {
          MatchmakingConfigurationName: queuedMatchmakingConfiguration.matchmakingConfigurationName,
        },
      });
    });

    test('metricMatchesCreated', () => {
      const metric = queuedMatchmakingConfiguration.metricMatchesCreated();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'MatchesCreated',
        statistic: cloudwatch.Stats.AVERAGE,
        dimensions: {
          MatchmakingConfigurationName: queuedMatchmakingConfiguration.matchmakingConfigurationName,
        },
      });
    });

    test('metricMatchesAccepted', () => {
      const metric = queuedMatchmakingConfiguration.metricMatchesAccepted();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'MatchesAccepted',
        statistic: cloudwatch.Stats.AVERAGE,
        dimensions: {
          MatchmakingConfigurationName: queuedMatchmakingConfiguration.matchmakingConfigurationName,
        },
      });
    });

    test('metricCurrentTickets', () => {
      const metric = queuedMatchmakingConfiguration.metricCurrentTickets();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'CurrentTickets',
        statistic: cloudwatch.Stats.AVERAGE,
        dimensions: {
          MatchmakingConfigurationName: queuedMatchmakingConfiguration.matchmakingConfigurationName,
        },
      });
    });


  });

  describe('test import methods', () => {
    test('QueuedMatchmakingConfiguration.fromQueuedMatchmakingConfigurationArn', () => {
      // GIVEN
      const stack2 = new cdk.Stack();

      // WHEN
      const imported = gamelift.QueuedMatchmakingConfiguration.fromQueuedMatchmakingConfigurationArn(stack2, 'Imported', 'arn:aws:gamelift:us-east-1:123456789012:matchmakingconfiguration/sample-queuedMatchmakingConfiguration-name');

      // THEN
      expect(imported.matchmakingConfigurationArn).toEqual('arn:aws:gamelift:us-east-1:123456789012:matchmakingconfiguration/sample-queuedMatchmakingConfiguration-name');
      expect(imported.matchmakingConfigurationName).toEqual('sample-queuedMatchmakingConfiguration-name');
    });

    test('QueuedMatchmakingConfiguration.fromQueuedMatchmakingConfigurationName', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const imported = gamelift.QueuedMatchmakingConfiguration.fromQueuedMatchmakingConfigurationName(stack, 'Imported', 'sample-matchmakingConfiguration-name');

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

  describe('QueuedMatchmakingConfiguration.fromQueuedMatchmakingConfigurationAttributes()', () => {
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
        const importedFleet = gamelift.QueuedMatchmakingConfiguration.fromMatchmakingConfigurationAttributes(stack, 'ImportedQueuedMatchmakingConfiguration', { matchmakingConfigurationArn });

        expect(importedFleet.matchmakingConfigurationName).toEqual(matchmakingConfigurationName);
        expect(importedFleet.matchmakingConfigurationArn).toEqual(matchmakingConfigurationArn);
        expect(importedFleet.env.account).toEqual('123456789012');
        expect(importedFleet.env.region).toEqual('matchmakingConfiguration-region');
      });

      test('with missing attrs', () => {
        expect(() => gamelift.QueuedMatchmakingConfiguration.fromMatchmakingConfigurationAttributes(stack, 'ImportedQueuedMatchmakingConfiguration', { }))
          .toThrow(/Either matchmakingConfigurationName or matchmakingConfigurationArn must be provided in MatchmakingConfigurationAttributes/);
      });

      test('with invalid ARN', () => {
        expect(() => gamelift.QueuedMatchmakingConfiguration.fromMatchmakingConfigurationAttributes(stack, 'ImportedQueuedMatchmakingConfiguration', { matchmakingConfigurationArn: 'arn:aws:gamelift:matchmakingConfiguration-region:123456789012:matchmakingconfiguration' }))
          .toThrow(/No matchmaking configuration name found in ARN: 'arn:aws:gamelift:matchmakingConfiguration-region:123456789012:matchmakingconfiguration'/);
      });
    });

    describe('for an queuedMatchmakingConfiguration in a different account and region', () => {
      let queuedMatchmakingConfiguration: gamelift.IMatchmakingConfiguration;

      beforeEach(() => {
        queuedMatchmakingConfiguration = gamelift.QueuedMatchmakingConfiguration.fromMatchmakingConfigurationAttributes(stack, 'ImportedQueuedMatchmakingConfiguration', { matchmakingConfigurationArn });
      });

      test("the queuedMatchmakingConfiguration's region is taken from the ARN", () => {
        expect(queuedMatchmakingConfiguration.env.region).toBe('matchmakingConfiguration-region');
      });

      test("the queuedMatchmakingConfiguration's account is taken from the ARN", () => {
        expect(queuedMatchmakingConfiguration.env.account).toBe('123456789012');
      });
    });
  });
});