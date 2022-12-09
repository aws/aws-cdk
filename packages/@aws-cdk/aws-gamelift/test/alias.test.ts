
import * as path from 'path';
import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as gamelift from '../lib';

describe('alias', () => {

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

    test('default fleet alias', () => {
      new gamelift.Alias(stack, 'MyAlias', {
        aliasName: 'test-alias',
        fleet: fleet,
      });

      Template.fromStack(stack).hasResource('AWS::GameLift::Alias', {
        Properties:
            {
              Name: 'test-alias',
              RoutingStrategy: {
                FleetId: { Ref: 'MyBuildFleet0F4EADEC' },
                Type: 'SIMPLE',
              },
            },
      });
    });

    test('default terminate alias', () => {
      new gamelift.Alias(stack, 'MyAlias', {
        aliasName: 'test-alias',
        terminalMessage: 'terminate message',
      });

      Template.fromStack(stack).hasResource('AWS::GameLift::Alias', {
        Properties:
              {
                Name: 'test-alias',
                RoutingStrategy: {
                  Message: 'terminate message',
                  Type: 'TERMINAL',
                },
              },
      });
    });

    test('with an incorrect alias name', () => {
      let incorrectName = '';
      for (let i = 0; i < 1025; i++) {
        incorrectName += 'A';
      }

      expect(() => new gamelift.Alias(stack, 'MyAlias', {
        aliasName: incorrectName,
        fleet: fleet,
      })).toThrow(/Alias name can not be longer than 1024 characters but has 1025 characters./);
    });

    test('with an incorrect description', () => {
      let incorrectDescription = '';
      for (let i = 0; i < 1025; i++) {
        incorrectDescription += 'A';
      }

      expect(() => new gamelift.Alias(stack, 'MyAlias', {
        aliasName: 'test-name',
        description: incorrectDescription,
        fleet: fleet,
      })).toThrow(/Alias description can not be longer than 1024 characters but has 1025 characters./);
    });

    test('with none of fleet and terminalMessage properties', () => {
      expect(() => new gamelift.Alias(stack, 'MyAlias', {
        aliasName: 'test-name',
        terminalMessage: 'a terminal message',
        fleet: fleet,
      })).toThrow(/Either a terminal message or a fleet must be binded to this Alias./);
    });

    test('with both fleet and terminalMessage properties', () => {
      expect(() => new gamelift.Alias(stack, 'MyAlias', {
        aliasName: 'test-name',
        terminalMessage: 'a terminal message',
        fleet: fleet,
      })).toThrow(/Either a terminal message or a fleet must be binded to this Alias, not both./);
    });
  });

  describe('test import methods', () => {
    test('Alias.fromAliasArn', () => {
      // GIVEN
      const stack2 = new cdk.Stack();

      // WHEN
      const imported = gamelift.Alias.fromAliasArn(stack2, 'Imported', 'arn:aws:gamelift:us-east-1:123456789012:alias/sample-alias-id');

      // THEN
      expect(imported.aliasArn).toEqual('arn:aws:gamelift:us-east-1:123456789012:alias/sample-alias-id');
      expect(imported.aliasId).toEqual('sample-alias-id');
    });

    test('Alias.fromAliasId', () => {
      // GIVEN
      const stack = new cdk.Stack();

      // WHEN
      const imported = gamelift.Alias.fromAliasId(stack, 'Imported', 'sample-alias-id');

      // THEN
      expect(stack.resolve(imported.aliasArn)).toStrictEqual({
        'Fn::Join': ['', [
          'arn:',
          { Ref: 'AWS::Partition' },
          ':gamelift:',
          { Ref: 'AWS::Region' },
          ':',
          { Ref: 'AWS::AccountId' },
          ':alias/sample-alias-id',
        ]],
      });
      expect(stack.resolve(imported.aliasId)).toStrictEqual('sample-alias-id');
    });
  });

  describe('Alias.fromAliasAttributes()', () => {
    let stack: cdk.Stack;
    const aliasId = 'alias-test-identifier';
    const aliasArn = `arn:aws:gamelift:alias-region:123456789012:alias/${aliasId}`;

    beforeEach(() => {
      const app = new cdk.App();
      stack = new cdk.Stack(app, 'Base', {
        env: { account: '111111111111', region: 'stack-region' },
      });
    });

    describe('', () => {
      test('with required attrs only', () => {
        const importedFleet = gamelift.Alias.fromAliasAttributes(stack, 'ImportedAlias', { aliasArn });

        expect(importedFleet.aliasId).toEqual(aliasId);
        expect(importedFleet.aliasArn).toEqual(aliasArn);
        expect(importedFleet.env.account).toEqual('123456789012');
        expect(importedFleet.env.region).toEqual('alias-region');
      });

      test('with missing attrs', () => {
        expect(() => gamelift.Alias.fromAliasAttributes(stack, 'ImportedAlias', { }))
          .toThrow(/Either aliasId or aliasArn must be provided in AliasAttributes/);
      });

      test('with invalid ARN', () => {
        expect(() => gamelift.Alias.fromAliasAttributes(stack, 'ImportedAlias', { aliasArn: 'arn:aws:gamelift:alias-region:123456789012:alias' }))
          .toThrow(/No alias identifier found in ARN: 'arn:aws:gamelift:alias-region:123456789012:alias'/);
      });
    });

    describe('for an alias in a different account and region', () => {
      let alias: gamelift.IAlias;

      beforeEach(() => {
        alias = gamelift.Alias.fromAliasAttributes(stack, 'ImportedAlias', { aliasArn });
      });

      test("the alias's region is taken from the ARN", () => {
        expect(alias.env.region).toBe('alias-region');
      });

      test("the alias's account is taken from the ARN", () => {
        expect(alias.env.account).toBe('123456789012');
      });
    });
  });
});