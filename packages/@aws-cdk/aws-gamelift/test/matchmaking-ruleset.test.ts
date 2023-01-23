import { Template } from '@aws-cdk/assertions';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as cdk from '@aws-cdk/core';
import * as gamelift from '../lib';

describe('MatchmakingRuleSet', () => {

  describe('new', () => {
    let stack: cdk.Stack;
    const ruleSetBody = JSON.stringify('{}');

    beforeEach(() => {
      stack = new cdk.Stack();
    });

    test('default new ruleSet', () => {
      new gamelift.MatchmakingRuleSet(stack, 'MyMatchmakingRuleSet', {
        matchmakingRuleSetName: 'test-ruleSet',
        content: gamelift.RuleSetContent.fromInline(ruleSetBody),
      });

      Template.fromStack(stack).hasResource('AWS::GameLift::MatchmakingRuleSet', {
        Properties:
            {
              Name: 'test-ruleSet',
              RuleSetBody: ruleSetBody,
            },
      });
    });

    test('with an incorrect name - too long', () => {
      let incorrectName = '';
      for (let i = 0; i < 129; i++) {
        incorrectName += 'A';
      }

      expect(() => new gamelift.MatchmakingRuleSet(stack, 'MyMatchmakingRuleSet', {
        matchmakingRuleSetName: incorrectName,
        content: gamelift.RuleSetContent.fromInline(ruleSetBody),
      })).toThrow(/RuleSet name can not be longer than 128 characters but has 129 characters./);
    });

    test('with an incorrect name - bad format', () => {
      let incorrectName = 'test with space';

      expect(() => new gamelift.MatchmakingRuleSet(stack, 'MyMatchmakingRuleSet', {
        matchmakingRuleSetName: incorrectName,
        content: gamelift.RuleSetContent.fromInline(ruleSetBody),
      })).toThrow(/RuleSet name test with space can contain only letters, numbers, hyphens, back slash or dot with no spaces./);
    });
  });

  describe('metric methods provide a Metric with configured and attached properties', () => {
    let stack: cdk.Stack;
    const ruleSetBody = JSON.stringify('{}');
    let ruleSet: gamelift.MatchmakingRuleSet;

    beforeEach(() => {
      stack = new cdk.Stack(undefined, undefined, { env: { account: '000000000000', region: 'us-west-1' } });
      ruleSet = new gamelift.MatchmakingRuleSet(stack, 'MyMatchmakingRuleSet', {
        matchmakingRuleSetName: 'test-ruleSet',
        content: gamelift.RuleSetContent.fromInline(ruleSetBody),
      });
    });

    test('metric', () => {
      const metric = ruleSet.metric('RuleEvaluationsPassed');

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'RuleEvaluationsPassed',
        dimensions: {
          MatchmakingRuleSetName: ruleSet.matchmakingRuleSetName,
        },
      });
    });

    test('RuleEvaluationsPassed', () => {
      const metric = ruleSet.metricRuleEvaluationsPassed();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'RuleEvaluationsPassed',
        statistic: cloudwatch.Stats.AVERAGE,
        dimensions: {
          MatchmakingRuleSetName: ruleSet.matchmakingRuleSetName,
        },
      });
    });

    test('RuleEvaluationsFailed', () => {
      const metric = ruleSet.metricRuleEvaluationsFailed();

      expect(metric).toMatchObject({
        account: stack.account,
        region: stack.region,
        namespace: 'AWS/GameLift',
        metricName: 'RuleEvaluationsFailed',
        statistic: cloudwatch.Stats.AVERAGE,
        dimensions: {
          MatchmakingRuleSetName: ruleSet.matchmakingRuleSetName,
        },
      });
    });
  });

  describe('test import methods', () => {
    test('MatchmakingRuleSet.fromMatchmakingRuleSetArn', () => {
      // GIVEN
      const stack2 = new cdk.Stack();

      // WHEN
      const imported = gamelift.MatchmakingRuleSet.fromMatchmakingRuleSetArn(stack2, 'Imported', 'arn:aws:gamelift:us-east-1:123456789012:matchmakingruleset/sample-ruleSet-name');

      // THEN
      expect(imported.matchmakingRuleSetArn).toEqual('arn:aws:gamelift:us-east-1:123456789012:matchmakingruleset/sample-ruleSet-name');
      expect(imported.matchmakingRuleSetName).toEqual('sample-ruleSet-name');
    });

    test('MatchmakingRuleSet.fromMatchmakingRuleSetName', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const imported = gamelift.MatchmakingRuleSet.fromMatchmakingRuleSetName(stack, 'Imported', 'sample-ruleSet-name');

      // THEN
      expect(stack.resolve(imported.matchmakingRuleSetArn)).toStrictEqual({
        'Fn::Join': ['', [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':gamelift:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':matchmakingruleset/sample-ruleSet-name',
        ]],
      });
      expect(stack.resolve(imported.matchmakingRuleSetName)).toStrictEqual('sample-ruleSet-name');
    });
  });

  describe('MatchmakingRuleSet.fromMatchmakingRuleSetAttributes()', () => {
    let stack: cdk.Stack;
    const matchmakingRuleSetName = 'ruleSet-test-identifier';
    const matchmakingRuleSetArn = `arn:aws:gamelift:ruleSet-region:123456789012:matchmakingruleset/${matchmakingRuleSetName}`;

    beforeEach(() => {
      const app = new cdk.App();
      stack = new cdk.Stack(app, 'Base', {
        env: { account: '111111111111', region: 'stack-region' },
      });
    });

    describe('', () => {
      test('with required attrs only', () => {
        const importedFleet = gamelift.MatchmakingRuleSet.fromMatchmakingRuleSetAttributes(stack, 'ImportedMatchmakingRuleSet', { matchmakingRuleSetArn });

        expect(importedFleet.matchmakingRuleSetName).toEqual(matchmakingRuleSetName);
        expect(importedFleet.matchmakingRuleSetArn).toEqual(matchmakingRuleSetArn);
        expect(importedFleet.env.account).toEqual('123456789012');
        expect(importedFleet.env.region).toEqual('ruleSet-region');
      });

      test('with missing attrs', () => {
        expect(() => gamelift.MatchmakingRuleSet.fromMatchmakingRuleSetAttributes(stack, 'ImportedMatchmakingRuleSet', { }))
          .toThrow(/Either matchmakingRuleSetName or matchmakingRuleSetArn must be provided in MatchmakingRuleSetAttributes/);
      });

      test('with invalid ARN', () => {
        expect(() => gamelift.MatchmakingRuleSet.fromMatchmakingRuleSetAttributes(stack, 'ImportedMatchmakingRuleSet', { matchmakingRuleSetArn: 'arn:aws:gamelift:ruleSet-region:123456789012:matchmakingruleset' }))
          .toThrow(/No matchmaking ruleSet identifier found in ARN: 'arn:aws:gamelift:ruleSet-region:123456789012:matchmakingruleset'/);
      });
    });

    describe('for an ruleSet in a different account and region', () => {
      let ruleSet: gamelift.IMatchmakingRuleSet;

      beforeEach(() => {
        ruleSet = gamelift.MatchmakingRuleSet.fromMatchmakingRuleSetAttributes(stack, 'ImportedMatchmakingRuleSet', { matchmakingRuleSetArn });
      });

      test("the ruleSet's region is taken from the ARN", () => {
        expect(ruleSet.env.region).toBe('ruleSet-region');
      });

      test("the ruleSet's account is taken from the ARN", () => {
        expect(ruleSet.env.account).toBe('123456789012');
      });
    });
  });
});