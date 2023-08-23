import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';

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
      capacity: {
        multiAzWithStandbyEnabled: false,
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
