# Actions for AWS Elastic Load Balancing V2


This package contains integration actions for ELBv2. See the README of the `@aws-cdk/aws-elasticloadbalancingv2` library.

## Cognito

ELB allows for requests to be authenticated against a Cognito user pool using
the `AuthenticateCognitoAction`. For details on the setup's requirements,
read [Prepare to use Amazon
Cognito](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/listener-authenticate-users.html#cognito-requirements).
Here's an example:

```ts
import { aws_certificatemanager as acm } from 'aws-cdk-lib';

declare const vpc: ec2.Vpc;
declare const certificate: acm.Certificate;

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

lb.addListener('Listener', {
  port: 443,
  certificates: [certificate],
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

new CfnOutput(this, 'DNS', {
  value: lb.loadBalancerDnsName,
});

```
