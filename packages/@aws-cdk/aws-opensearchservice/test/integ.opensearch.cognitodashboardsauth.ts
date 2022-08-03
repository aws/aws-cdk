/// !cdk-integ pragma:ignore-assets
import * as cognito from '@aws-cdk/aws-cognito';
import * as iam from '@aws-cdk/aws-iam';
import { App, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as opensearch from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Adding required resources per https://docs.aws.amazon.com/opensearch-service/latest/developerguide/cognito-auth.html#cognito-auth-config
    const identityPool = new cognito.CfnIdentityPool(this, 'IdentityPool', {
      allowUnauthenticatedIdentities: true,
    });

    const userPool = new cognito.UserPool(this, 'UserPool', {
      removalPolicy: RemovalPolicy.DESTROY,
    });
    userPool.addDomain('UserPoolDomain', {
      cognitoDomain: {
        domainPrefix: 'integ-test-domain-prefix',
      },
    });

    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('opensearchservice.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonOpenSearchServiceCognitoAccess'),
      ],
    });

    // Adding a domain with cognito dashboards auth configured
    new opensearch.Domain(this, 'Domain', {
      removalPolicy: RemovalPolicy.DESTROY,
      version: opensearch.EngineVersion.OPENSEARCH_1_0,
      cognitoDashboardsAuth: {
        role,
        identityPoolId: identityPool.ref,
        userPoolId: userPool.userPoolId,
      },
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-opensearch-cognitodashboardsauth');

new IntegTest(app, 'CognitoAuthForOpenSearchDashboards', {
  testCases: [stack],
});

app.synth();
