import { Match, Template } from '../../assertions';
import * as kms from '../../aws-kms';
import { App, Stack } from '../../core';
import * as cxapi from '../../cx-api';
import { LogGroup } from '../lib';

const FLAG = cxapi.LOG_GROUP_GRANT_ENCRYPTION_KEY;

function stackWithFlag(enabled: boolean): Stack {
  const app = new App({ context: { [FLAG]: enabled } });
  return new Stack(app, 'Stack', { env: { account: '123456789012', region: 'us-east-1' } });
}

const GRANT_ACTIONS = [
  'kms:Encrypt*',
  'kms:Decrypt*',
  'kms:ReEncrypt*',
  'kms:GenerateDataKey*',
  'kms:Describe*',
];
describe('log group encryption key grant', () => {
  test('grants the logs service principal usage of an owned key, scoped to the auto-named log group', () => {
    // GIVEN
    const stack = stackWithFlag(true);
    const encryptionKey = new kms.Key(stack, 'Key');

    // WHEN
    new LogGroup(stack, 'LogGroup', { encryptionKey });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Effect: 'Allow',
            Principal: { Service: 'logs.us-east-1.amazonaws.com' },
            Action: GRANT_ACTIONS,
            Resource: '*',
            Condition: {
              ArnLike: {
                'kms:EncryptionContext:aws:logs:arn': {
                  'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':logs:us-east-1:123456789012:log-group:*']],
                },
              },
            },
          }),
        ]),
      },
    });
  });

  test('scopes the grant precisely when the log group name is known at synth time', () => {
    // GIVEN
    const stack = stackWithFlag(true);
    const encryptionKey = new kms.Key(stack, 'Key');

    // WHEN
    new LogGroup(stack, 'LogGroup', { encryptionKey, logGroupName: 'my-group' });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Principal: { Service: 'logs.us-east-1.amazonaws.com' },
            Action: GRANT_ACTIONS,
            Condition: {
              ArnEquals: {
                'kms:EncryptionContext:aws:logs:arn': {
                  'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':logs:us-east-1:123456789012:log-group:my-group']],
                },
              },
            },
          }),
        ]),
      },
    });
  });

  test('does not modify the key policy when the feature flag is disabled', () => {
    // GIVEN
    const stack = stackWithFlag(false);
    const encryptionKey = new kms.Key(stack, 'Key');

    // WHEN
    new LogGroup(stack, 'LogGroup', { encryptionKey });

    // THEN: the log group is still encrypted, but no logs-service statement is added
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::Logs::LogGroup', {
      KmsKeyId: { 'Fn::GetAtt': [Match.stringLikeRegexp('Key'), 'Arn'] },
    });
    const keys = template.findResources('AWS::KMS::Key');
    const statements = Object.values(keys)[0].Properties.KeyPolicy.Statement as any[];
    const logsStatements = statements.filter(
      (s) => s.Principal?.Service === 'logs.us-east-1.amazonaws.com',
    );
    expect(logsStatements).toHaveLength(0);
  });

  test('does not attempt to modify an imported key', () => {
    // GIVEN
    const stack = stackWithFlag(true);
    const encryptionKey = kms.Key.fromKeyArn(
      stack,
      'ImportedKey',
      'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012',
    );

    // WHEN
    new LogGroup(stack, 'LogGroup', { encryptionKey });

    // THEN: imported keys are not synthesized and no crash occurs
    const template = Template.fromStack(stack);
    template.resourceCountIs('AWS::KMS::Key', 0);
    template.hasResourceProperties('AWS::Logs::LogGroup', {
      KmsKeyId: 'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012',
    });
  });

  test('does nothing when no encryption key is provided', () => {
    // GIVEN
    const stack = stackWithFlag(true);

    // WHEN
    new LogGroup(stack, 'LogGroup');

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::KMS::Key', 0);
  });

  test('synthesizes without a circular dependency for an owned key', () => {
    // GIVEN
    const stack = stackWithFlag(true);
    const encryptionKey = new kms.Key(stack, 'Key');

    // WHEN
    new LogGroup(stack, 'LogGroup', { encryptionKey });

    // THEN: synthesis (which resolves dependencies) does not throw
    expect(() => Template.fromStack(stack)).not.toThrow();
  });
});
