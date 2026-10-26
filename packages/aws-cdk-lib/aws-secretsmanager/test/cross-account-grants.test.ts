import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import * as secretsmanager from '../lib';

describe('cross-account secret grants', () => {
  let stack: cdk.Stack;
  
  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('fallback grants when autoCreatePolicy is false', () => {
    // GIVEN
    const secretArn = 'arn:aws:secretsmanager:us-east-1:123456789012:secret:cross-account-secret-abcdef';
    const secret = secretsmanager.Secret.fromSecretAttributes(stack, 'CrossAccountSecret', {
      secretCompleteArn: secretArn,
    });
    const role = new iam.Role(stack, 'Role', { 
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com') 
    });

    // WHEN
    secret.grantRead(role);

    // THEN - Should create a managed policy attached to the role
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: [
            'secretsmanager:GetSecretValue',
            'secretsmanager:DescribeSecret',
          ],
          Effect: 'Allow',
          Resource: secretArn,
        }],
      },
      Roles: [{ Ref: 'Role1ABCC5F0' }],
    });
  });

  test('fallback grants for grantWrite when autoCreatePolicy is false', () => {
    // GIVEN
    const secretArn = 'arn:aws:secretsmanager:us-east-1:123456789012:secret:cross-account-secret-abcdef';
    const secret = secretsmanager.Secret.fromSecretAttributes(stack, 'CrossAccountSecret', {
      secretCompleteArn: secretArn,
    });
    const role = new iam.Role(stack, 'Role', { 
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com') 
    });

    // WHEN
    secret.grantWrite(role);

    // THEN - Should create a managed policy attached to the role
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: [
            'secretsmanager:PutSecretValue',
            'secretsmanager:UpdateSecret',
            'secretsmanager:UpdateSecretVersionStage',
          ],
          Effect: 'Allow',
          Resource: secretArn,
        }],
      },
      Roles: [{ Ref: 'Role1ABCC5F0' }],
    });
  });
});
