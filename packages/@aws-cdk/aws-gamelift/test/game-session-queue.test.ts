
import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as gamelift from '../lib';

describe('gameSessionQueue', () => {

  describe('new', () => {
    let stack: cdk.Stack;
    let fleet: gamelift.FleetBase;

    beforeEach(() => {
      stack = new cdk.Stack();
      fleet = new gamelift.BuildFleet(stack, 'MyBuildFleet', {
        fleetName: 'test-fleet',
        content: gamelift.Build.fromAsset(stack, 'Build', path.join(__dirname, 'my-game-build')),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
        runtimeConfiguration: {
          serverProcesses: [{
            launchPath: 'test-launch-path',
          }],
        },
      });
    });

    test('default fleet gameSessionQueue', () => {
      new gamelift.GameSessionQueue(stack, 'MyGameSessionQueue', {
        gameSessionQueueName: 'test-gameSessionQueue',
        destinations: [fleet],
      });

      Template.fromStack(stack).hasResource('AWS::GameLift::GameSessionQueue', {
        Properties:
            {
              Name: 'test-gameSessionQueue',
              Destinations: [
                {
                  DestinationArn: {
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
                        ':fleet/',
                        {
                          Ref: 'MyBuildFleet0F4EADEC',
                        },
                      ],
                    ],
                  },
                },
              ],
            },
      });
    });

    test('default alias gameSessionQueue', () => {
      const alias = new gamelift.Alias(stack, 'MyAlias', {
        aliasName: 'test-alias',
        fleet: fleet,
      });

      new gamelift.GameSessionQueue(stack, 'MyGameSessionQueue', {
        gameSessionQueueName: 'test-gameSessionQueue',
        destinations: [alias],
      });

      Template.fromStack(stack).hasResource('AWS::GameLift::GameSessionQueue', {
        Properties:
              {
                Name: 'test-gameSessionQueue',
                Destinations: [
                  {
                    DestinationArn: {
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
                          ':alias/',
                          {
                            Ref: 'MyAlias9A08CB8C',
                          },
                        ],
                      ],
                    },
                  },
                ],
              },
      });
    });

    test('add new destination', () => {
      const alias = new gamelift.Alias(stack, 'MyAlias', {
        aliasName: 'test-alias',
        fleet: fleet,
      });

      const queue = new gamelift.GameSessionQueue(stack, 'MyGameSessionQueue', {
        gameSessionQueueName: 'test-gameSessionQueue',
        destinations: [fleet],
      });

      queue.addDestination(alias);

      Template.fromStack(stack).hasResource('AWS::GameLift::GameSessionQueue', {
        Properties:
              {
                Name: 'test-gameSessionQueue',
                Destinations: [
                  {
                    DestinationArn: {
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
                          ':fleet/',
                          {
                            Ref: 'MyBuildFleet0F4EADEC',
                          },
                        ],
                      ],
                    },
                  },
                  {
                    DestinationArn: {
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
                          ':alias/',
                          {
                            Ref: 'MyAlias9A08CB8C',
                          },
                        ],
                      ],
                    },
                  },
                ],
              },
      });
    });

    test('with all properties', () => {
      const topic = new sns.Topic(stack, 'MyTopic', {});

      new gamelift.GameSessionQueue(stack, 'MyGameSessionQueue', {
        gameSessionQueueName: 'test-gameSessionQueue',
        destinations: [fleet],
        customEventData: 'test-event-data',
        allowedLocations: ['eu-west-1', 'eu-west-2'],
        notificationTarget: topic,
        playerLatencyPolicies: [{
          maximumIndividualPlayerLatency: cdk.Duration.millis(100),
          policyDuration: cdk.Duration.seconds(300),
        }],
        priorityConfiguration: {
          locationOrder: [
            'eu-west-1',
            'eu-west-2',
          ],
          priorityOrder: [
            gamelift.PriorityType.LATENCY,
            gamelift.PriorityType.COST,
            gamelift.PriorityType.DESTINATION,
            gamelift.PriorityType.LOCATION,
          ],
        },
        timeout: cdk.Duration.seconds(300),

      });

      Template.fromStack(stack).hasResource('AWS::GameLift::GameSessionQueue', {
        Properties:
            {
              Name: 'test-gameSessionQueue',
              CustomEventData: 'test-event-data',
              FilterConfiguration: {
                AllowedLocations: [
                  'eu-west-1',
                  'eu-west-2',
                ],
              },
              NotificationTarget: { Ref: 'MyTopic86869434' },
              PlayerLatencyPolicies: [{
                MaximumIndividualPlayerLatencyMilliseconds: 100,
                PolicyDurationSeconds: 300,
              }],
              PriorityConfiguration: {
                LocationOrder: [
                  'eu-west-1',
                  'eu-west-2',
                ],
                PriorityOrder: [
                  'LATENCY',
                  'COST',
                  'DESTINATION',
                  'LOCATION',
                ],
              },
              TimeoutInSeconds: 300,
              Destinations: [
                {
                  DestinationArn: {
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
                        ':fleet/',
                        {
                          Ref: 'MyBuildFleet0F4EADEC',
                        },
                      ],
                    ],
                  },
                },
              ],
            },
      });
    });

    test('with an invlaid priority configuration location order', () => {
      let incorrectLocationOrder: string[] = [];
      for (let i = 0; i < 101; i++) {
        incorrectLocationOrder.push('test-location');
      }

      expect(() => new gamelift.GameSessionQueue(stack, 'MyGameSessionQueue', {
        gameSessionQueueName: 'test-name',
        destinations: [fleet],
        priorityConfiguration: {
          locationOrder: incorrectLocationOrder,
          priorityOrder: [
            gamelift.PriorityType.COST,
          ],
        },
      })).toThrow(/No more than 100 locations are allowed per priority configuration, given 101/);
    });

    test('with an invlaid priority configuration priority order', () => {
      let incorrectPriorityOrder: gamelift.PriorityType[] = [];
      for (let i = 0; i < 5; i++) {
        incorrectPriorityOrder.push(gamelift.PriorityType.COST);
      }

      expect(() => new gamelift.GameSessionQueue(stack, 'MyGameSessionQueue', {
        gameSessionQueueName: 'test-name',
        destinations: [fleet],
        priorityConfiguration: {
          locationOrder: ['eu-west-1', 'eu-west-2'],
          priorityOrder: incorrectPriorityOrder,
        },
      })).toThrow(/No more than 4 priorities are allowed per priority configuration, given 5/);
    });

    test('with an incorrect name', () => {
      let incorrectName = '';
      for (let i = 0; i < 129; i++) {
        incorrectName += 'A';
      }

      expect(() => new gamelift.GameSessionQueue(stack, 'MyGameSessionQueue', {
        gameSessionQueueName: incorrectName,
        destinations: [fleet],
      })).toThrow(/GameSessionQueue name can not be longer than 128 characters but has 129 characters./);
    });

    test('with an incorrect name format', () => {
      let incorrectName = 'test with space';

      expect(() => new gamelift.GameSessionQueue(stack, 'MyGameSessionQueue', {
        gameSessionQueueName: incorrectName,
        destinations: [fleet],
      })).toThrow(/GameSessionQueue name test with space can contain only letters, numbers, hyphens with no spaces./);
    });

    test('with an incorrect custom event data', () => {
      let incorrectCustomEventData = '';
      for (let i = 0; i < 257; i++) {
        incorrectCustomEventData += 'A';
      }

      expect(() => new gamelift.GameSessionQueue(stack, 'MyGameSessionQueue', {
        gameSessionQueueName: 'test-name',
        destinations: [fleet],
        customEventData: incorrectCustomEventData,
      })).toThrow(/GameSessionQueue custom event data can not be longer than 256 characters but has 257 characters./);
    });

    test('with an incorrect number of locations', () => {
      let incorrectLocations: string[] = [];
      for (let i = 0; i < 101; i++) {
        incorrectLocations.push('test');
      }

      expect(() => new gamelift.GameSessionQueue(stack, 'MyGameSessionQueue', {
        gameSessionQueueName: 'test-name',
        destinations: [fleet],
        allowedLocations: incorrectLocations,
      })).toThrow(/No more than 100 allowed locations are allowed per game session queue, given 101/);
    });
  });

  describe('metric methods provide a Metric with configured and attached properties', () => {
    let stack: cdk.Stack;
    let fleet: gamelift.BuildFleet;
    let gameSessionQueue: gamelift.GameSessionQueue;

    beforeEach(() => {
      stack = new cdk.Stack(undefined, undefined, { env: { account: '000000000000', region: 'us-west-1' } });
      fleet = new gamelift.BuildFleet(stack, 'MyBuildFleet', {
        fleetName: 'test-fleet',
        content: gamelift.Build.fromAsset(stack, 'Build', path.join(__dirname, 'my-game-build')),
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.C4, ec2.InstanceSize.LARGE),
        runtimeConfiguration: {
          serverProcesses: [{
            launchPath: 'test-launch-path',
          }],
        },
      });
      gameSessionQueue = new gamelift.GameSessionQueue(stack, 'MyGameSessionQueue', {
        gameSessionQueueName: 'test-gameSessionQueue',
        destinations: [fleet],
      });
    });

    test('metric', () => {
      const metric = gameSessionQueue.metric('AverageWaitTime');

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'AverageWaitTime',
        dimensions: {
          GameSessionQueueName: gameSessionQueue.gameSessionQueueName,
        },
      });
    });

    test('metricAverageWaitTime', () => {
      const metric = gameSessionQueue.metricAverageWaitTime();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'AverageWaitTime',
        statistic: cloudwatch.Stats.AVERAGE,
        dimensions: {
          GameSessionQueueName: gameSessionQueue.gameSessionQueueName,
        },
      });
    });

    test('metricPlacementsCanceled', () => {
      const metric = gameSessionQueue.metricPlacementsCanceled();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'PlacementsCanceled',
        statistic: cloudwatch.Stats.AVERAGE,
        dimensions: {
          GameSessionQueueName: gameSessionQueue.gameSessionQueueName,
        },
      });
    });

    test('metricPlacementsFailed', () => {
      const metric = gameSessionQueue.metricPlacementsFailed();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'PlacementsFailed',
        statistic: cloudwatch.Stats.AVERAGE,
        dimensions: {
          GameSessionQueueName: gameSessionQueue.gameSessionQueueName,
        },
      });
    });

    test('metricPlacementsStarted', () => {
      const metric = gameSessionQueue.metricPlacementsStarted();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'PlacementsStarted',
        statistic: cloudwatch.Stats.AVERAGE,
        dimensions: {
          GameSessionQueueName: gameSessionQueue.gameSessionQueueName,
        },
      });
    });

    test('metricPlacementsSucceeded', () => {
      const metric = gameSessionQueue.metricPlacementsSucceeded();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'PlacementsSucceeded',
        statistic: cloudwatch.Stats.AVERAGE,
        dimensions: {
          GameSessionQueueName: gameSessionQueue.gameSessionQueueName,
        },
      });
    });

    test('metricPlacementsTimedOut', () => {
      const metric = gameSessionQueue.metricPlacementsTimedOut();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'PlacementsTimedOut',
        statistic: cloudwatch.Stats.AVERAGE,
        dimensions: {
          GameSessionQueueName: gameSessionQueue.gameSessionQueueName,
        },
      });
    });


  });

  describe('test import methods', () => {
    test('GameSessionQueue.fromGameSessionQueueArn', () => {
      // GIVEN
      const stack2 = new cdk.Stack();

      // WHEN
      const imported = gamelift.GameSessionQueue.fromGameSessionQueueArn(stack2, 'Imported', 'arn:aws:gamelift:us-east-1:123456789012:gamesessionqueue/sample-gameSessionQueue-name');

      // THEN
      expect(imported.gameSessionQueueArn).toEqual('arn:aws:gamelift:us-east-1:123456789012:gamesessionqueue/sample-gameSessionQueue-name');
      expect(imported.gameSessionQueueName).toEqual('sample-gameSessionQueue-name');
    });

    test('GameSessionQueue.fromGameSessionQueueId', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const imported = gamelift.GameSessionQueue.fromGameSessionQueueName(stack, 'Imported', 'sample-gameSessionQueue-name');

      // THEN
      expect(stack.resolve(imported.gameSessionQueueArn)).toStrictEqual({
        'Fn::Join': ['', [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':gamelift:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':gamesessionqueue/sample-gameSessionQueue-name',
        ]],
      });
      expect(stack.resolve(imported.gameSessionQueueName)).toStrictEqual('sample-gameSessionQueue-name');
    });
  });

  describe('GameSessionQueue.fromGameSessionQueueAttributes()', () => {
    let stack: cdk.Stack;
    const gameSessionQueueName = 'gameSessionQueue-test-name';
    const gameSessionQueueArn = `arn:aws:gamelift:gameSessionQueue-region:123456789012:gamesessionqueue/${gameSessionQueueName}`;

    beforeEach(() => {
      const app = new cdk.App();
      stack = new cdk.Stack(app, 'Base', {
        env: { account: '111111111111', region: 'stack-region' },
      });
    });

    describe('', () => {
      test('with required attrs only', () => {
        const importedFleet = gamelift.GameSessionQueue.fromGameSessionQueueAttributes(stack, 'ImportedGameSessionQueue', { gameSessionQueueArn });

        expect(importedFleet.gameSessionQueueName).toEqual(gameSessionQueueName);
        expect(importedFleet.gameSessionQueueArn).toEqual(gameSessionQueueArn);
        expect(importedFleet.env.account).toEqual('123456789012');
        expect(importedFleet.env.region).toEqual('gameSessionQueue-region');
      });

      test('with missing attrs', () => {
        expect(() => gamelift.GameSessionQueue.fromGameSessionQueueAttributes(stack, 'ImportedGameSessionQueue', { }))
          .toThrow(/Either gameSessionQueueName or gameSessionQueueArn must be provided in GameSessionQueueAttributes/);
      });

      test('with invalid ARN', () => {
        expect(() => gamelift.GameSessionQueue.fromGameSessionQueueAttributes(stack, 'ImportedGameSessionQueue', { gameSessionQueueArn: 'arn:aws:gamelift:gameSessionQueue-region:123456789012:gamesessionqueue' }))
          .toThrow(/No gameSessionQueue name found in ARN: 'arn:aws:gamelift:gameSessionQueue-region:123456789012:gamesessionqueue'/);
      });
    });

    describe('for an gameSessionQueue in a different account and region', () => {
      let gameSessionQueue: gamelift.IGameSessionQueue;

      beforeEach(() => {
        gameSessionQueue = gamelift.GameSessionQueue.fromGameSessionQueueAttributes(stack, 'ImportedGameSessionQueue', { gameSessionQueueArn });
      });

      test("the gameSessionQueue's region is taken from the ARN", () => {
        expect(gameSessionQueue.env.region).toBe('gameSessionQueue-region');
      });

      test("the gameSessionQueue's account is taken from the ARN", () => {
        expect(gameSessionQueue.env.account).toBe('123456789012');
      });
    });
  });
});