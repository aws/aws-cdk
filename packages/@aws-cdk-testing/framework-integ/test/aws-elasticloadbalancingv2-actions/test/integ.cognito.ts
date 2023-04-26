import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { App, CfnOutput, Duration, Stack } from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as actions from 'aws-cdk-lib/aws-elasticloadbalancingv2-actions';

// This test can only be run as a dry-run at this time due to requiring a certificate
class CognitoStack extends Stack {

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Stack', {
      maxAzs: 2,
    });

    const certificate: elbv2.IListenerCertificate = {
      certificateArn: process.env.SELF_SIGNED_CERT_ARN ?? '',
    };

    const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
      vpc,
      internetFacing: true,
    });

    const userPool = new cognito.UserPool(this, 'UserPool');
    const userPoolClient = new cognito.UserPoolClient(this, 'Client', {
      userPool,

      // Required minimal configuration for use with an ELB
      generateSecret: true,
      authFlows: {
        userPassword: true,
      },
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [cognito.OAuthScope.EMAIL],
        callbackUrls: [
          `https://${lb.loadBalancerDnsName}/oauth2/idpresponse`,
        ],
      },
    });
    const cfnClient = userPoolClient.node.defaultChild as cognito.CfnUserPoolClient;
    cfnClient.addPropertyOverride('RefreshTokenValidity', 1);
    cfnClient.addPropertyOverride('SupportedIdentityProviders', ['COGNITO']);

    const userPoolDomain = new cognito.UserPoolDomain(this, 'Domain', {
      userPool,
      cognitoDomain: {
        domainPrefix: 'test-cdk-prefix',
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
    const listener = lb.addListener('Listener', {
      port: 443,
      certificates: [certificate],
      defaultAction: action,
    });
    listener.addAction('Action2', {
      priority: 1,
      conditions: [elbv2.ListenerCondition.pathPatterns(['action2*'])],
      action,
    });

    new CfnOutput(this, 'DNS', {
      value: lb.loadBalancerDnsName,
    });
  }
}

const app = new App();
const testCase = new CognitoStack(app, 'integ-cognito');
new integ.IntegTest(app, 'integ-test-cognito', {
  testCases: [testCase],
});

app.synth();