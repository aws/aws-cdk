/**
 * This test requires manual setup and will fail without it:
 * - A Route53 public hosted zone you own (env vars: HOSTED_ZONE_ID, HOSTED_ZONE_NAME, DOMAIN_NAME)
 * - The hosted zone must be authoritative for the domain so ACM DNS validation succeeds
 * - A Cognito user pool is created to act as the JWT IdP
 * - A Lambda function authenticates via Cognito and calls the ALB with the JWT to verify the flow
 */
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53targets from 'aws-cdk-lib/aws-route53-targets';
import type { StackProps } from 'aws-cdk-lib/core';
import { App, Duration, RemovalPolicy, Stack, UnscopedValidationError, RemovalPolicies } from 'aws-cdk-lib/core';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import * as path from 'path';

interface CognitoUserProps {
  userPool: cognito.UserPool;
  username: string;
  password: string;
}

/**
 * Cognito User for testing
 */
class CognitoUser extends Construct {
  readonly username: string;
  readonly password: string;
  constructor(scope: Construct, id: string, props: CognitoUserProps) {
    super(scope, id);
    const user = new AwsCustomResource(this, 'Resource', {
      resourceType: 'Custom::CognitoUser',
      onCreate: {
        service: 'CognitoIdentityServiceProvider',
        action: 'adminCreateUser',
        parameters: {
          UserPoolId: props.userPool.userPoolId,
          Username: props.username,
          UserAttributes: [
            { Name: 'email', Value: props.username },
            { Name: 'email_verified', Value: 'true' },
          ],
          MessageAction: 'SUPPRESS',
        },
        physicalResourceId: PhysicalResourceId.of('User'),
      },
      policy: AwsCustomResourcePolicy.fromStatements([new iam.PolicyStatement({
        actions: ['cognito-idp:AdminCreateUser'],
        resources: [props.userPool.userPoolArn],
      })]),
    });

    new AwsCustomResource(this, 'SetUserPassword', {
      resourceType: 'Custom::CognitoUserPassword',
      onCreate: {
        service: 'CognitoIdentityServiceProvider',
        action: 'adminSetUserPassword',
        parameters: {
          UserPoolId: props.userPool.userPoolId,
          Username: user.getResponseField('User.Username'),
          Password: props.password,
          Permanent: true,
        },
        physicalResourceId: PhysicalResourceId.of('SetUserPassword'),
      },
      policy: AwsCustomResourcePolicy.fromStatements([new iam.PolicyStatement({
        actions: ['cognito-idp:AdminSetUserPassword'],
        resources: [props.userPool.userPoolArn],
      })]),
    }).node.addDependency(user);
    this.password = props.password;
    this.username = props.username;
  }
}

interface AlbJwtCognitoStackProps extends StackProps {
  hostedZoneId: string;
  hostedZoneName: string;
  domainName: string;
}

class AlbJwtCognitoStack extends Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;

  constructor(scope: Construct, id: string, props: AlbJwtCognitoStackProps) {
    super(scope, id);
    const albDomainName = `jwt-alb.${props.domainName}`;

    const hostedZone = route53.PublicHostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.hostedZoneName,
    });
    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: `*.${props.domainName}`,
      validation: acm.CertificateValidation.fromDns(hostedZone),
      subjectAlternativeNames: [hostedZone.zoneName],
    });

    // Create Cognito UserPool as IdP
    this.userPool = new cognito.UserPool(this, 'UserPool', {
      signInAliases: {
        email: true,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });
    this.userPoolClient = this.userPool.addClient('UserPoolClient', {
      authFlows: {
        adminUserPassword: true,
      },
    });

    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
    });

    const lb = new elbv2.ApplicationLoadBalancer(this, 'LoadBalancer', {
      vpc,
      internetFacing: true,
    });

    // Default action: authenticateJwtWithCognito (testable with real Cognito tokens)
    lb.addListener('Listener', {
      protocol: elbv2.ApplicationProtocol.HTTPS,
      certificates: [certificate],
      defaultAction: elbv2.ListenerAction.authenticateJwtWithCognito({
        userPool: this.userPool,
        next: elbv2.ListenerAction.fixedResponse(200, {
          contentType: 'text/plain',
          messageBody: 'Authenticated',
        }),
        allowHttpsOutbound: true,
      }),
    });

    // Route53 record for ALB access via HTTPS
    new route53.ARecord(this, 'ARecord', {
      recordName: albDomainName,
      target: route53.RecordTarget.fromAlias(new route53targets.LoadBalancerTarget(lb)),
      zone: hostedZone,
    });
  }
}

/**
 * In order to test this you need to have a valid public hosted zone that you can use
 * to request certificates for.
 */
const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID ?? process.env.HOSTED_ZONE_ID;
if (!hostedZoneId) throw new UnscopedValidationError(lit`HostedZoneIdRequired`, 'For this test you must provide your own HostedZoneId as an env var "HOSTED_ZONE_ID". See framework-integ/README.md for details.');
const hostedZoneName = process.env.CDK_INTEG_HOSTED_ZONE_NAME ?? process.env.HOSTED_ZONE_NAME;
if (!hostedZoneName) throw new UnscopedValidationError(lit`HostedZoneNameRequired`, 'For this test you must provide your own HostedZoneName as an env var "HOSTED_ZONE_NAME". See framework-integ/README.md for details.');
const domainName = process.env.CDK_INTEG_DOMAIN_NAME ?? process.env.DOMAIN_NAME;
if (!domainName) throw new UnscopedValidationError(lit`DomainNameRequired`, 'For this test you must provide your own DomainName as an env var "DOMAIN_NAME". See framework-integ/README.md for details.');

const app = new App();
const testCase = new AlbJwtCognitoStack(app, 'AlbJwtCognitoStack', {
  hostedZoneId,
  hostedZoneName,
  domainName,
});
RemovalPolicies.of(app).apply(RemovalPolicy.DESTROY);
const test = new integ.IntegTest(app, 'IntegTestAlbJwtCognito', {
  testCases: [testCase],
});

// Create a test user in Cognito
const cognitoUserProps = {
  userPool: testCase.userPool,
  username: 'test-user@example.com',
  password: 'TestUser@123',
};
const testUser = new CognitoUser(testCase, 'User', cognitoUserProps);

// Lambda function that authenticates with Cognito and calls ALB with the JWT
const signinFunction = new lambda.Function(testCase, 'JwtSignin', {
  functionName: 'cdk-integ-alb-jwt-signin-handler',
  code: lambda.Code.fromAsset(path.join(__dirname, 'alb-jwt-signin-handler'), { exclude: ['*.ts'] }),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_22_X,
  environment: {
    USER_POOL_ID: testCase.userPool.userPoolId,
    CLIENT_ID: testCase.userPoolClient.userPoolClientId,
    TEST_USERNAME: testUser.username,
    TEST_PASSWORD: testUser.password,
    TEST_URL: `https://jwt-alb.${domainName}`,
  },
  memorySize: 256,
  timeout: Duration.minutes(1),
});
signinFunction.addToRolePolicy(new iam.PolicyStatement({
  actions: ['cognito-idp:AdminInitiateAuth'],
  resources: [testCase.userPool.userPoolArn],
}));

// Assert: Lambda authenticates via Cognito, sends JWT to ALB, gets "Authenticated" response
const invoke = test.assertions.invokeFunction({
  functionName: signinFunction.functionName,
});
invoke.expect(integ.ExpectedResult.objectLike({
  Payload: '"Authenticated"',
}));

// Assert: Cognito user was created and confirmed
const cognitoUser = test.assertions.awsApiCall('CognitoIdentityServiceProvider', 'adminGetUser', {
  UserPoolId: cognitoUserProps.userPool.userPoolId,
  Username: cognitoUserProps.username,
});
cognitoUser.expect(integ.ExpectedResult.objectLike({
  UserStatus: 'CONFIRMED',
  Enabled: true,
}));
