import * as fs from 'fs';
import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as gamelift from '../lib';

describe('MatchmakingRuleSetBody', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  describe('gamelift.MatchmakingRuleSetBody.fromInline', () => {
    test('new RuleSetBody from Inline content', () => {
      const ruleSet = gamelift.RuleSetContent.fromInline('{}');
      const content = ruleSet.bind(stack);
      expect(content.ruleSetBody).toEqual('{}');
    });

    test('fails if invlaid JSON format', () => {
      expect(() => gamelift.RuleSetContent.fromInline('{ name }'))
        .toThrow(/RuleSet body has an invalid Json format/);
    });

    test('fails if content too large', () => {
      let incorrectContent = '';
      for (let i = 0; i < 65536; i++) {
        incorrectContent += 'A';
      }

      expect(() => gamelift.RuleSetContent.fromInline(JSON.stringify({ name: incorrectContent })))
        .toThrow(/RuleSet body cannot exceed 65535 characters, actual 65547/);
    });
  });

  describe('gamelift.MatchmakingRuleSetBody.fromJsonFile', () => {
    test('new RuleSetBody from Json file', () => {
      const ruleSet = gamelift.RuleSetContent.fromJsonFile(path.join(__dirname, 'my-ruleset', 'ruleset.json'));
      const content = ruleSet.bind(stack);
      const result = JSON.parse(fs.readFileSync(path.join(__dirname, 'my-ruleset', 'ruleset.json')).toString());
      expect(content.ruleSetBody).toEqual(JSON.stringify(result));
    });

    test('fails if file not exist', () => {
      const content = path.join(__dirname, 'my-ruleset', 'file-not-exist.json');
      expect(() => gamelift.RuleSetContent.fromJsonFile(content))
        .toThrow(`RuleSet path does not exist, please verify it, actual ${content}`);
    });

    test('fails if file is a directory', () => {
      const contentPath = path.join(__dirname, 'my-ruleset');
      expect(() => gamelift.RuleSetContent.fromJsonFile(contentPath))
        .toThrow(`RuleSet path is not link to a single file, please verify your path, actual ${contentPath}`);
    });
  });
});
