import { expect, haveResource } from '@aws-cdk/assert';
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import secretsmanager = require('../lib');

export = {
  'create a secret attachment'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const secret = new secretsmanager.Secret(stack, 'Secret');

    // WHEN
    new secretsmanager.SecretTargetAttachment(stack, 'SecretTargetAttachment', {
      secret,
      targetId: 'instance',
      targetType: secretsmanager.AttachmentTargetType.Instance
    });

    // THEN
    expect(stack).to(haveResource('AWS::SecretsManager::SecretTargetAttachment', {
      SecretId: {
        Ref: 'SecretA720EF05'
      },
      TargetId: 'instance',
      TargetType: 'AWS::RDS::DBInstance'
    }));

    test.done();
  },

  'add a rotation schedule to the secret returned by a target attachment'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const secret = new secretsmanager.Secret(stack, 'Secret');
    const attachment = new secretsmanager.SecretTargetAttachment(stack, 'SecretTargetAttachment', {
      secret,
      targetId: 'instance',
      targetType: secretsmanager.AttachmentTargetType.Instance
    });
    const rotationLambda = new lambda.Function(stack, 'Lambda', {
      runtime: lambda.Runtime.NodeJS810,
      code: lambda.Code.inline('export.handler = event => event;'),
      handler: 'index.handler'
    });

    // WHEN
    attachment.secret.addRotationSchedule('RotationSchedule', {
      rotationLambda
    });

    // THEN
    expect(stack).to(haveResource('AWS::SecretsManager::RotationSchedule', {
      SecretId: {
        Ref: 'SecretTargetAttachment0F6F22EB' // The secret returned by the attachment, not the secret itself.
      }
    }));

    test.done();
  }
};
