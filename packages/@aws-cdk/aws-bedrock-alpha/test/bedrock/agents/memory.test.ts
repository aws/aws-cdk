import { App } from 'aws-cdk-lib/core';
import * as core from 'aws-cdk-lib/core';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Memory } from '../../../bedrock/agents/memory';
import { Template } from 'aws-cdk-lib/assertions';
import * as bedrock from '../../../lib';

describe('Memory', () => {
  let stack: core.Stack;
  let foundationModel: bedrock.IBedrockInvokable;

  beforeEach(() => {
    const app = new App();
    stack = new core.Stack(app, 'test-stack');
    foundationModel = {
      invokableArn: 'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2',
      grantInvoke: (grantee) => {
        return iam.Grant.addToPrincipal({
          grantee,
          actions: ['bedrock:InvokeModel*', 'bedrock:GetFoundationModel'],
          resourceArns: ['arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2'],
        });
      },
    };
  });

  describe('sessionSummary', () => {
    test('sets session summary memory configuration correctly', () => {
      new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
        memory: Memory.sessionSummary({
          memoryDuration: core.Duration.days(30),
          maxRecentSessions: 20,
        }),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
        MemoryConfiguration: {
          EnabledMemoryTypes: ['SESSION_SUMMARY'],
          StorageDays: 30,
          SessionSummaryConfiguration: {
            MaxRecentSessions: 20,
          },
        },
      });
    });

    test('validates memory duration days range', () => {
      expect(() => {
        Memory.sessionSummary({
          memoryDuration: core.Duration.days(0),
          maxRecentSessions: 20,
        });
      }).toThrow(/memoryDuration must be between 1 and 365 days/);

      expect(() => {
        Memory.sessionSummary({
          memoryDuration: core.Duration.days(366),
          maxRecentSessions: 20,
        });
      }).toThrow(/memoryDuration must be between 1 and 365 days/);
    });

    test('validates maxRecentSessions range', () => {
      expect(() => {
        Memory.sessionSummary({
          memoryDuration: core.Duration.days(30),
          maxRecentSessions: 0,
        });
      }).toThrow(/maxRecentSessions must be greater than 0/);
    });

    test('uses default values when not provided', () => {
      new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
        memory: Memory.sessionSummary({}),
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
        MemoryConfiguration: {
          EnabledMemoryTypes: ['SESSION_SUMMARY'],
          StorageDays: 30,
          SessionSummaryConfiguration: {
            MaxRecentSessions: 20,
          },
        },
      });
    });
  });

  describe('SESSION_SUMMARY', () => {
    test('uses static SESSION_SUMMARY property', () => {
      new bedrock.Agent(stack, 'TestAgent', {
        instruction: 'This is a test instruction that must be at least 40 characters long to be valid',
        foundationModel,
        memory: Memory.SESSION_SUMMARY,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Bedrock::Agent', {
        MemoryConfiguration: {
          EnabledMemoryTypes: ['SESSION_SUMMARY'],
          StorageDays: 30,
          SessionSummaryConfiguration: {
            MaxRecentSessions: 20,
          },
        },
      });
    });
  });
});
