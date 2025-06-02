import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { App, CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as actions from 'aws-cdk-lib/aws-elasticloadbalancingv2-actions';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53targets from 'aws-cdk-lib/aws-route53-targets';

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
            {
              Name: 'email',
              Value: props.username,
            },
            {
              Name: 'email_verified',
              Value: 'true',
            },
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

interface CognitoStackProps extends StackProps {
  hostedZoneId: string;
  hostedZoneName: string;
  domainName: string;
}

// This test can only be run as a dry-run at this time due to requiring a certificate
class CognitoStack extends Stack {
  public readonly userPool: cognito.UserPool;

  constructor(scope: Construct, id: string, props: CognitoStackProps) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Stack', {
      maxAzs: 2, restrictDefaultSecurityGroup: false,
    });

    const hostedZone = route53.PublicHostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId: props.hostedZoneId,
      zoneName: props.hostedZoneName,
    });
    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: props.domainName,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
      vpc,
      internetFacing: true,
    });

    this.userPool = new cognito.UserPool(this, 'UserPool', {
      removalPolicy: RemovalPolicy.DESTROY,
    });
    const userPoolClient = new cognito.UserPoolClient(this, 'Client', {
      userPool: this.userPool,

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
          `https://${props.domainName}/oauth2/idpresponse`,
        ],
      },
    });
    const cfnClient = userPoolClient.node.defaultChild as cognito.CfnUserPoolClient;
    cfnClient.addPropertyOverride('RefreshTokenValidity', 1);
    cfnClient.addPropertyOverride('SupportedIdentityProviders', ['COGNITO']);

    const userPoolDomain = new cognito.UserPoolDomain(this, 'Domain', {
      userPool: this.userPool,
      cognitoDomain: {
        domainPrefix: props.hostedZoneId.toLowerCase(),
      },
    });
    const action = new actions.AuthenticateCognitoAction({
      userPool: this.userPool,
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
    new route53.ARecord(this, 'ARecord', {
      target: route53.RecordTarget.fromAlias(new route53targets.LoadBalancerTarget(lb)),
      zone: hostedZone,
    });

    new CfnOutput(this, 'DNS', {
      value: props.domainName,
    });
  }
}

/**
 * In order to test this you need to have a valid public hosted zone that you can use
 * to request certificates for.
 *
 */
const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID ?? process.env.HOSTED_ZONE_ID;
if (!hostedZoneId) throw new Error('For this test you must provide your own HostedZoneId as an env var "HOSTED_ZONE_ID". See framework-integ/README.md for details.');
const hostedZoneName = process.env.CDK_INTEG_HOSTED_ZONE_NAME ?? process.env.HOSTED_ZONE_NAME;
if (!hostedZoneName) throw new Error('For this test you must provide your own HostedZoneName as an env var "HOSTED_ZONE_NAME". See framework-integ/README.md for details.');
const domainName = process.env.CDK_INTEG_DOMAIN_NAME ?? process.env.DOMAIN_NAME;
if (!domainName) throw new Error('For this test you must provide your own DomainName as an env var "DOMAIN_NAME". See framework-integ/README.md for details.');

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCase = new CognitoStack(app, 'integ-cognito', {
  hostedZoneId,
  hostedZoneName,
  domainName,
});
const test = new integ.IntegTest(app, 'integ-test-cognito', {
  testCases: [testCase],
  diffAssets: true,
});
const cognitoUserProps = {
  userPool: testCase.userPool,
  username: 'test-user@example.com',
  password: 'TestUser@123',
};
const testUser = new CognitoUser(testCase, 'User', cognitoUserProps);
// this function signs in to the website and returns text content of the authenticated page body
const signinFunction = new lambda.Function(testCase, 'Signin', {
  functionName: 'cdk-integ-alb-cognito-signin-handler',
  code: lambda.Code.fromAsset('alb-cognito-signin-handler', { exclude: ['*.ts'] }),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_18_X,
  environment: {
    TEST_USERNAME: testUser.username,
    TEST_PASSWORD: testUser.password,
    TEST_URL: `https://${domainName}`,
  },
  memorySize: 1024,
  timeout: Duration.minutes(5),
});
const invoke = test.assertions.invokeFunction({
  functionName: signinFunction.functionName,
});
invoke.expect(integ.ExpectedResult.objectLike({
  Payload: '"Authenticated"',
}));
const cognitoUser = test.assertions.awsApiCall('CognitoIdentityServiceProvider', 'adminGetUser', {
  UserPoolId: cognitoUserProps.userPool.userPoolId,
  Username: cognitoUserProps.username,
});
cognitoUser.expect(integ.ExpectedResult.objectLike({
  UserStatus: 'CONFIRMED',
  Enabled: true,
  UserAttributes: [
    {
      Name: 'email',
      Value: cognitoUserProps.username,
    },
    {
      Name: 'email_verified',
      Value: 'true',
    },
    {
      Name: 'sub',
      Value: integ.Match.stringLikeRegexp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'),
    },
  ],
}));
app.synth();
