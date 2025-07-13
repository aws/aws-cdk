import * as cdk from 'aws-cdk-lib';
import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cxapi from 'aws-cdk-lib/cx-api';
import * as appsync from 'aws-cdk-lib/aws-appsync';

const myFeatureFlag = {
  [cxapi.APPSYNC_GRAPHQLAPI_SCOPE_LAMBDA_FUNCTION_PERMISSION]: true,
  '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
};

const app = new cdk.App({
  context: myFeatureFlag,
});
const stack = new cdk.Stack(app, 'aws-graphql-lambda-permissions');

const authorizer = new lambda.Function(stack, 'AuthorizerFunction', {
  runtime: lambda.Runtime.NODEJS_18_X,
  code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          console.log("Authorization event:", JSON.stringify(event));
          
          const isAuthorized = true;
          if (isAuthorized) {
            return {
              isAuthorized: true,
              resolverContext: {
                userId: 'user-id-example'
              }
            };
          } else {
            return {
              isAuthorized: false
            };
          }
        };
      `),
  handler: 'index.handler',
});

new appsync.GraphqlApi(stack, 'api', {
  name: 'api',
  definition: {
    schema: appsync.SchemaFile.fromAsset(
      path.join(__dirname, 'integ.graphql-lambda-permission.graphql'),
    ),
  },
  authorizationConfig: {
    defaultAuthorization: {
      authorizationType: appsync.AuthorizationType.LAMBDA,
      lambdaAuthorizerConfig: {
        handler: authorizer,
      },
    },
  },
});

new integ.IntegTest(app, 'GraphqlApiLambdaPermissionTest', {
  testCases: [stack],
});
