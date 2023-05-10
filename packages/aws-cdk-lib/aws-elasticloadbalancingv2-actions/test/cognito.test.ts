import { Template } from '../../assertions';
import * as cognito from '../../aws-cognito';
import * as ec2 from '../../aws-ec2';
import * as elbv2 from '../../aws-elasticloadbalancingv2';
import { Duration, Stack } from '../../core';
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

test('Cognito authentication action allows HTTPS outbound', () => {
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
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
    GroupDescription: 'Automatically created Security Group for ELB LB',
    SecurityGroupEgress: [
      {
        CidrIp: '0.0.0.0/0',
        Description: 'Allow to IdP endpoint',
        FromPort: 443,
        IpProtocol: 'tcp',
        ToPort: 443,
      },
    ],
    SecurityGroupIngress: [
      {
        CidrIp: '0.0.0.0/0',
        Description: 'Allow from anyone on port 80',
        FromPort: 80,
        IpProtocol: 'tcp',
        ToPort: 80,
      },
    ],
    VpcId: { Ref: 'Stack8A423254' },
  });
});

test('Cognito authentication action not allows HTTPS outbound when allowHttpsOutbound is false', () => {
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
      allowHttpsOutbound: false,
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
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
    GroupDescription: 'Automatically created Security Group for ELB LB',
    SecurityGroupEgress: [
      {
        CidrIp: '255.255.255.255/32',
        Description: 'Disallow all traffic',
        FromPort: 252,
        IpProtocol: 'icmp',
        ToPort: 86,
      },
    ],
    SecurityGroupIngress: [
      {
        CidrIp: '0.0.0.0/0',
        Description: 'Allow from anyone on port 80',
        FromPort: 80,
        IpProtocol: 'tcp',
        ToPort: 80,
      },
    ],
    VpcId: { Ref: 'Stack8A423254' },
  });
});

test('Can set sessionTimeout for actions and defaultActions', () => {
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
  const action = new actions.AuthenticateCognitoAction({
    userPool,
    userPoolClient,
    userPoolDomain,
    sessionTimeout: Duration.days(1),
    next: elbv2.ListenerAction.fixedResponse(200, {
      contentType: 'text/plain',
      messageBody: 'Authenticated',
    }),
  });

  // WHEN
  const listener = lb.addListener('Listener', {
    protocol: elbv2.ApplicationProtocol.HTTP,
    defaultAction: action,
  });
  listener.addAction('Action2', {
    priority: 1,
    conditions: [elbv2.ListenerCondition.pathPatterns(['/action2*'])],
    action: action,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
    DefaultActions: [
      {
        AuthenticateCognitoConfig: {
          UserPoolArn: { 'Fn::GetAtt': ['UserPool6BA7E5F2', 'Arn'] },
          UserPoolClientId: { Ref: 'Client4A7F64DF' },
          UserPoolDomain: { Ref: 'Domain66AC69E0' },
          // SessionTimeout in DefaultActions is string
          SessionTimeout: '86400',
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
  Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
    Actions: [
      {
        AuthenticateCognitoConfig: {
          UserPoolArn: { 'Fn::GetAtt': ['UserPool6BA7E5F2', 'Arn'] },
          UserPoolClientId: { Ref: 'Client4A7F64DF' },
          UserPoolDomain: { Ref: 'Domain66AC69E0' },
          // SessionTimeout in Actions is number
          SessionTimeout: 86400,
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
