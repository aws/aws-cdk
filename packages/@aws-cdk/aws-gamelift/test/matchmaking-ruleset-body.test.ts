import * as fs from 'fs';
import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as gamelift from '../lib';

describe('MatchmakingRuleSetBody', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  describe('gamelift.MatchmakingRuleSetBody.fromInline', () => {
    test('new RuleSetBody from Inline content', () => {
      const ruleSet = gamelift.RuleSetBody.fromInline('{}');
      const content = ruleSet.bind(stack);
      expect(content.ruleSetBody).toEqual('{}');
    });

    test('fails if empty content', () => {
      expect(() => gamelift.RuleSetBody.fromInline(''))
        .toThrow(/Matchmaking ruleSet body cannot be empty/);
    });

    test('fails if content too large', () => {
      let incorrectContent = '';
      for (let i = 0; i < 65536; i++) {
        incorrectContent += 'A';
      }

      expect(() => gamelift.RuleSetBody.fromInline(incorrectContent))
        .toThrow(/Matchmaking ruleSet body cannot exceed 65535 characters, actual 65536/);
    });
  });

  describe('gamelift.MatchmakingRuleSetBody.fromJsonFile', () => {
    test('new RuleSetBody from Json file', () => {
      const ruleSet = gamelift.RuleSetBody.fromJsonFile(path.join(__dirname, 'my-ruleset/ruleset.json'));
      const content = ruleSet.bind(stack);
      const result = fs.readFileSync(path.join(__dirname, 'my-ruleset/ruleset.json'));
      expect(content.ruleSetBody).toEqual(result.toString());
    });

    test('fails if file not exist', () => {
      const content = path.join(__dirname, 'my-ruleset/file-not-exist.json');
      expect(() => gamelift.RuleSetBody.fromJsonFile(content))
        .toThrow(`Matchmaking ruleSet path does not exist, please verify it, actual ${content}`);
    });

    test('fails if file is a directory', () => {
      const content = path.join(__dirname, 'my-ruleset');
      expect(() => gamelift.RuleSetBody.fromJsonFile(content))
        .toThrow(`Matchmaking ruleSet path is not link to a single file, please verify your path, actual ${content}`);
    });
  });
});