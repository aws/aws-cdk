import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as cxapi from 'aws-cdk-lib/cx-api';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

class GraphQLApiLambdaAuthStack extends cdk.Stack {
  constructor(scope: Construct) {
    super(scope, 'appsync-lambda-auth');

    const func = new lambda.Function(this, 'func', {
      code: lambda.Code.fromAsset(
        path.join(__dirname, 'verify', 'lambda-tutorial'),
      ),
      handler: 'lambda-tutorial.handler',
      runtime: STANDARD_NODEJS_RUNTIME,
    });

    new appsync.GraphqlApi(this, 'api1', {
      name: 'api1',
      schema: appsync.SchemaFile.fromAsset(
        path.join(__dirname, 'appsync.test.graphql'),
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.LAMBDA,
          lambdaAuthorizerConfig: {
            handler: func,
          },
        },
      },
    });

    new appsync.GraphqlApi(this, 'api2', {
      name: 'api2',
      schema: appsync.SchemaFile.fromAsset(
        path.join(__dirname, 'appsync.test.graphql'),
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.LAMBDA,
          lambdaAuthorizerConfig: {
            handler: func,
          },
        },
      },
    });
  }
}
const myFeatureFlag = {
  [cxapi.APPSYNC_GRAPHQLAPI_SCOPE_LAMBDA_FUNCTION_PERMISSION]: false,
  '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
};

const app = new cdk.App({
  postCliContext: myFeatureFlag,
});
const testCase = new GraphQLApiLambdaAuthStack(app);
new IntegTest(app, 'GraphQlApiLambdaAuth', {
  testCases: [testCase],
});

app.synth();
