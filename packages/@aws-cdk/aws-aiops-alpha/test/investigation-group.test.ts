import { Duration, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { InvestigationGroup } from '../lib/investigation-group';

describe('InvestigationGroup', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
  });

  test('creates investigation group with minimal configuration', () => {
    // WHEN
    new InvestigationGroup(stack, 'TestInvestigationGroup', {
      investigationGroupName: 'test-investigation-group',
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::AIOps::InvestigationGroup', {
      Name: 'test-investigation-group',
    });

    // Should create a default role
    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [{
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'aiops.amazonaws.com',
          },
        }],
        Version: '2012-10-17',
      },
    });
  });

  test('creates investigation group with all properties', () => {
    // GIVEN
    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('aiops.amazonaws.com'),
    });
    const key = new kms.Key(stack, 'TestKey');

    // WHEN
    new InvestigationGroup(stack, 'TestInvestigationGroup', {
      investigationGroupName: 'test-investigation-group',
      role,
      encryptionKey: key,
      isCloudTrailEventHistoryEnabled: true,
      retention: Duration.days(30),
      removalPolicy: RemovalPolicy.DESTROY,
      tagKeyBoundaries: ['Environment', 'Team'],
      chatbotNotificationChannels: ['arn:aws:sns:us-east-1:123456789012:test-topic'],
      crossAccountConfigurations: ['arn:aws:iam::123456789012:role/CrossAccountRole'],
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::AIOps::InvestigationGroup', {
      Name: 'test-investigation-group',
      RoleArn: {
        'Fn::GetAtt': ['TestRole6C9272DF', 'Arn'],
      },
      EncryptionConfig: {
        EncryptionConfigurationType: 'CUSTOMER_MANAGED_KEY',
        KmsKeyId: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
      IsCloudTrailEventHistoryEnabled: true,
      RetentionInDays: 30,
      TagKeyBoundaries: ['Environment', 'Team'],
      ChatbotNotificationChannels: [{
        SNSTopicArn: 'arn:aws:sns:us-east-1:123456789012:test-topic',
      }],
      CrossAccountConfigurations: [{
        SourceRoleArn: 'arn:aws:iam::123456789012:role/CrossAccountRole',
      }],
    });

    template.hasResource('AWS::AIOps::InvestigationGroup', {
      DeletionPolicy: 'Delete',
    });
  });

  test('validates retention period range', () => {
    expect(() => {
      new InvestigationGroup(stack, 'TestInvestigationGroup', {
        investigationGroupName: 'test-investigation-group',
        retention: Duration.days(6),
      });
    }).toThrow(RangeError);

    expect(() => {
      new InvestigationGroup(stack, 'TestInvestigationGroup2', {
        investigationGroupName: 'test-investigation-group',
        retention: Duration.days(91),
      });
    }).toThrow(RangeError);
  });

  test('validates cross account configurations limit', () => {
    const configs = Array.from({ length: 26 }, (_, i) => ({
      sourceRoleArn: `arn:aws:iam::123456789012:role/CrossAccountRole${i}`,
    }));

    expect(() => {
      new InvestigationGroup(stack, 'TestInvestigationGroup', {
        investigationGroupName: 'test-investigation-group',
        crossAccountConfigurations: configs,
      });
    }).toThrow(RangeError);
  });

  test('validates ARN format for cross account configurations', () => {
    expect(() => {
      new InvestigationGroup(stack, 'TestInvestigationGroup', {
        investigationGroupName: 'test-investigation-group',
        crossAccountConfigurations: [{
          sourceRoleArn: 'invalid-arn',
        }],
      });
    }).toThrow(TypeError);
  });

  test('validates ARN format for SNS topic', () => {
    expect(() => {
      new InvestigationGroup(stack, 'TestInvestigationGroup', {
        investigationGroupName: 'test-investigation-group',
        chatbotNotificationChannels: [{
          snsTopicArn: 'invalid-arn',
        }],
      });
    }).toThrow(TypeError);
  });

  test('addCrossAccountConfiguration method', () => {
    // GIVEN
    const investigationGroup = new InvestigationGroup(stack, 'TestInvestigationGroup', {
      investigationGroupName: 'test-investigation-group',
    });

    // WHEN
    investigationGroup.addCrossAccountConfiguration({
      sourceRoleArn: 'arn:aws:iam::123456789012:role/CrossAccountRole',
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::AIOps::InvestigationGroup', {
      CrossAccountConfigurations: [{
        SourceRoleArn: 'arn:aws:iam::123456789012:role/CrossAccountRole',
      }],
    });
  });

  test('addChatbotNotification method', () => {
    // GIVEN
    const investigationGroup = new InvestigationGroup(stack, 'TestInvestigationGroup', {
      investigationGroupName: 'test-investigation-group',
    });

    // WHEN
    investigationGroup.addChatbotNotification({
      snsTopicArn: 'arn:aws:sns:us-east-1:123456789012:test-topic',
      chatConfigurationArns: ['arn:aws:chatbot::123456789012:chat-configuration/slack/test-config'],
    });

    // THEN
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::AIOps::InvestigationGroup', {
      ChatbotNotificationChannels: [{
        SNSTopicArn: 'arn:aws:sns:us-east-1:123456789012:test-topic',
        ChatConfigurationArns: ['arn:aws:chatbot::123456789012:chat-configuration/slack/test-config'],
      }],
    });
  });

  test('addToResourcePolicy method', () => {
    // GIVEN
    const investigationGroup = new InvestigationGroup(stack, 'TestInvestigationGroup', {
      investigationGroupName: 'test-investigation-group',
    });

    const statement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [new iam.AccountPrincipal('123456789012')],
      actions: ['aiops:GetInvestigationGroup'],
      resources: ['*'],
    });

    // WHEN
    const result = investigationGroup.addToResourcePolicy(statement);

    // THEN
    expect(result.statementAdded).toBe(true);
    // TODO does it need to verify the policy, add policy construct?
  });

  test('grantCreate method', () => {
    // GIVEN
    const investigationGroup = new InvestigationGroup(stack, 'TestInvestigationGroup', {
      investigationGroupName: 'test-investigation-group',
    });
    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    // WHEN
    investigationGroup.grantCreate(role);
  });

  test('exposes investigation group name', () => {
    // GIVEN
    const investigationGroup = new InvestigationGroup(stack, 'TestInvestigationGroup', {
      investigationGroupName: 'test-investigation-group',
    });

    // THEN
    expect(investigationGroup.investigationGroupName).toBe('test-investigation-group');
  });

  test('exposes role', () => {
    // GIVEN
    const role = new iam.Role(stack, 'TestRole', {
      assumedBy: new iam.ServicePrincipal('aiops.amazonaws.com'),
    });
    const investigationGroup = new InvestigationGroup(stack, 'TestInvestigationGroup', {
      investigationGroupName: 'test-investigation-group',
      role,
    });

    // THEN
    expect(investigationGroup.role).toBe(role);
  });

  test('creates default role when none provided', () => {
    // GIVEN
    const investigationGroup = new InvestigationGroup(stack, 'TestInvestigationGroup', {
      investigationGroupName: 'test-investigation-group',
    });

    // THEN
    expect(investigationGroup.role).toBeDefined();
    expect(investigationGroup.role.assumeRoleAction).toBeDefined();
  });

  test('uses provided encryption key', () => {
    // GIVEN
    const key = new kms.Key(stack, 'TestKey');
    const investigationGroup = new InvestigationGroup(stack, 'TestInvestigationGroup', {
      investigationGroupName: 'test-investigation-group',
      encryptionKey: key,
    });

    // THEN
    expect(investigationGroup.encryptionKey).toBe(key);
  });

  test('encryption key is undefined when not provided', () => {
    // GIVEN
    const investigationGroup = new InvestigationGroup(stack, 'TestInvestigationGroup', {
      investigationGroupName: 'test-investigation-group',
    });

    // THEN
    expect(investigationGroup.encryptionKey).toBeUndefined();
  });
});
