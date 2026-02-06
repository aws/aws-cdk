/**
 * Unit tests for AWS StepFunctions encryption-at-rest mixins.
 *
 * Tests cover:
 * - AWS::StepFunctions::Activity
 * - AWS::StepFunctions::StateMachine
 *
 * StepFunctions supports optional KMS encryption. Uses AWS managed key by default.
 * When a KMS key is provided, customer-managed encryption is enabled via the
 * encryptionConfiguration.kmsKeyId property.
 */

import { CfnActivity, CfnStateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { createTestContext, EncryptionTestAssertions } from './test-utils';
import {
  CfnActivityEncryptionAtRestMixin,
  CfnStateMachineEncryptionAtRestMixin,
} from '../../../lib/services/aws-stepfunctions/encryption-at-rest-mixins.generated';

describe('CfnActivityEncryptionAtRestMixin', () => {
  test('supports CfnActivity', () => {
    const { stack } = createTestContext();
    const resource = new CfnActivity(stack, 'Resource', {
      name: 'test-activity',
    });
    const mixin = new CfnActivityEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnActivityEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnActivity(stack, 'Resource', {
      name: 'test-activity',
    });
    const mixin = new CfnActivityEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::StepFunctions::Activity', {
      Name: 'test-activity',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnActivity(stack, 'Resource', {
      name: 'test-activity',
    });
    const mixin = new CfnActivityEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::StepFunctions::Activity', {
      Name: 'test-activity',
      EncryptionConfiguration: {
        KmsKeyId: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });

  test('preserves existing configuration when applying KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnActivity(stack, 'Resource', {
      name: 'test-activity',
      tags: [{ key: 'Environment', value: 'Test' }],
    });
    const mixin = new CfnActivityEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::StepFunctions::Activity', {
      Name: 'test-activity',
      Tags: [{ Key: 'Environment', Value: 'Test' }],
      EncryptionConfiguration: {
        KmsKeyId: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnActivity(stack, 'Resource', {
      name: 'test-activity',
    });
    const mixin = new CfnActivityEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});

describe('CfnStateMachineEncryptionAtRestMixin', () => {
  test('supports CfnStateMachine', () => {
    const { stack } = createTestContext();
    const resource = new CfnStateMachine(stack, 'Resource', {
      roleArn: 'arn:aws:iam::123456789012:role/stepfunctions-role',
    });
    const mixin = new CfnStateMachineEncryptionAtRestMixin();
    expect(mixin.supports(resource)).toBe(true);
  });

  test('does not support non-CfnResource constructs', () => {
    const { stack } = createTestContext();
    const mixin = new CfnStateMachineEncryptionAtRestMixin();
    EncryptionTestAssertions.doesNotSupportNonCfnResource(mixin, stack);
  });

  test('applies encryption without KMS key (uses AWS managed key by default)', () => {
    const { stack, template } = createTestContext();
    const resource = new CfnStateMachine(stack, 'Resource', {
      roleArn: 'arn:aws:iam::123456789012:role/stepfunctions-role',
      definitionString: JSON.stringify({
        StartAt: 'HelloWorld',
        States: {
          HelloWorld: {
            Type: 'Pass',
            End: true,
          },
        },
      }),
    });
    const mixin = new CfnStateMachineEncryptionAtRestMixin();
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::StepFunctions::StateMachine', {
      RoleArn: 'arn:aws:iam::123456789012:role/stepfunctions-role',
    });
  });

  test('applies encryption with KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnStateMachine(stack, 'Resource', {
      roleArn: 'arn:aws:iam::123456789012:role/stepfunctions-role',
      definitionString: JSON.stringify({
        StartAt: 'HelloWorld',
        States: {
          HelloWorld: {
            Type: 'Pass',
            End: true,
          },
        },
      }),
    });
    const mixin = new CfnStateMachineEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::StepFunctions::StateMachine', {
      RoleArn: 'arn:aws:iam::123456789012:role/stepfunctions-role',
      EncryptionConfiguration: {
        KmsKeyId: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });

  test('preserves existing configuration when applying KMS key', () => {
    const { stack, kmsKey, template } = createTestContext();
    const resource = new CfnStateMachine(stack, 'Resource', {
      stateMachineName: 'test-state-machine',
      stateMachineType: 'STANDARD',
      roleArn: 'arn:aws:iam::123456789012:role/stepfunctions-role',
      definitionString: JSON.stringify({
        StartAt: 'HelloWorld',
        States: {
          HelloWorld: {
            Type: 'Pass',
            End: true,
          },
        },
      }),
      tags: [{ key: 'Environment', value: 'Test' }],
    });
    const mixin = new CfnStateMachineEncryptionAtRestMixin(kmsKey);
    mixin.applyTo(resource);
    template().hasResourceProperties('AWS::StepFunctions::StateMachine', {
      StateMachineName: 'test-state-machine',
      StateMachineType: 'STANDARD',
      Tags: [{ Key: 'Environment', Value: 'Test' }],
      EncryptionConfiguration: {
        KmsKeyId: {
          'Fn::GetAtt': ['TestKey4CACAF33', 'Arn'],
        },
      },
    });
  });

  test('applies without error', () => {
    const { stack } = createTestContext();
    const resource = new CfnStateMachine(stack, 'Resource', {
      roleArn: 'arn:aws:iam::123456789012:role/stepfunctions-role',
    });
    const mixin = new CfnStateMachineEncryptionAtRestMixin();
    EncryptionTestAssertions.appliesWithoutError(mixin, resource);
  });
});
