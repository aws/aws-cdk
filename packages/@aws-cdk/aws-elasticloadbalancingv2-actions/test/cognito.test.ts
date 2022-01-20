import { Template } from '@aws-cdk/assertions';
import * as cognito from '@aws-cdk/aws-cognito';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import { Stack } from '@aws-cdk/core';
import * as actions from '../lib';

test('Cognito Action', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new ec2.Vpc(stack, 'Stack');
  const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

  const userPool = new cognito.UserPool(stack, 'UserPool');
  const userPoolClient = new cognito.UserPoolClient(stack, 'Client', { userPool });
  const userPoolDomain = new cognito.UserPoolDomain(stack, 'Domain', {
    userPool,
    cognitoDomain: {
      domainPrefix: 'prefix',
    },
  });

  // WHEN
  lb.addListener('Listener', {
    port: 80,
    defaultAction: new actions.AuthenticateCognitoAction({
      userPool,
      userPoolClient,
      userPoolDomain,
      next: elbv2.ListenerAction.fixedResponse(200, {
        contentType: 'text/plain',
        messageBody: 'Authenticated',
      }),
    }),
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
    DefaultActions: [
      {
        AuthenticateCognitoConfig: {
          UserPoolArn: { 'Fn::GetAtt': ['UserPool6BA7E5F2', 'Arn'] },
          UserPoolClientId: { Ref: 'Client4A7F64DF' },
          UserPoolDomain: { Ref: 'Domain66AC69E0' },
        },
        Order: 1,
        Type: 'authenticate-cognito',
      },
      {
        FixedResponseConfig: {
          ContentType: 'text/plain',
          MessageBody: 'Authenticated',
          StatusCode: '200',
        },
        Order: 2,
        Type: 'fixed-response',
      },
    ],
  });
});
