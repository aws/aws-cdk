import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as secretsmanager from '../lib';
import { AttachmentTargetType, ISecretAttachmentTarget } from '../lib';

class MockAttachmentTarget extends cdk.Resource implements ISecretAttachmentTarget {
  asSecretAttachmentTarget(): secretsmanager.SecretAttachmentTargetProps {
    return {
      targetId: 'mock-id',
      targetType: AttachmentTargetType.RDS_DB_INSTANCE,
    };
  }
}

describe.each([
  [false, 2],
  [true, 1],
])('@aws-cdk/aws-secretsmanager:useAttachedSecretResourcePolicyForSecretTargetAttachments=%s', (featureFlagValue, expectedResourcePolicyCount) => {
  const app = new cdk.App({
    context: {
      [cxapi.SECRETS_MANAGER_TARGET_ATTACHMENT_RESOURCE_POLICY]: featureFlagValue,
    },
  });
  const stack = new cdk.Stack(app);

  test('using addToResourcePolicy on a Secret and on a SecretAttachmentTarget attaching this Secret', () => {
    // GIVEN

    const secret = new secretsmanager.Secret(stack, 'Secret');
    const servicePrincipalOne = new iam.ServicePrincipal('some-service-a');
    const servicePrincipalTwo = new iam.ServicePrincipal('some-service-b');
    const secretAttachment = secret.attach(new MockAttachmentTarget(stack, 'mock-target'));

    // WHEN
    secret.grantRead(servicePrincipalOne);
    secretAttachment.grantRead(servicePrincipalTwo);

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::SecretsManager::ResourcePolicy', expectedResourcePolicyCount);
  });
});
