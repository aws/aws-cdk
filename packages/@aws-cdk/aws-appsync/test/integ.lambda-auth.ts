import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as appsync from '../lib';

class GraphQLApiLambdaAuthStack extends cdk.Stack {
  constructor(scope: Construct) {
    super(scope, 'appsync-lambda-auth');

    const func = new lambda.Function(this, 'func', {
      code: lambda.Code.fromAsset(
        path.join(__dirname, 'verify/lambda-tutorial'),
      ),
      handler: 'lambda-tutorial.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
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

const app = new cdk.App();
const testCase = new GraphQLApiLambdaAuthStack(app);
new IntegTest(app, 'GraphQlApiLambdaAuth', {
  testCases: [testCase],
});

app.synth();
