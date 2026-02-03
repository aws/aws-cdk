import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { App, Stack, Duration } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult, Match } from '@aws-cdk/integ-tests-alpha';
import { MockIntegration, PassthroughBehavior, RestApi, TokenAuthorizer, Cors } from 'aws-cdk-lib/aws-apigateway';
import { STANDARD_NODEJS_RUNTIME } from '../../../config';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'TokenAuthorizerInteg');

const authorizerFn = new lambda.Function(stack, 'MyAuthorizerFunction', {
  runtime: STANDARD_NODEJS_RUNTIME,
  handler: 'index.handler',
  code: lambda.AssetCode.fromAsset(path.join(__dirname, 'integ.token-authorizer.handler'), { exclude: ['*.ts'] }),
});

const authorizer = new TokenAuthorizer(stack, 'MyAuthorizer', {
  handler: authorizerFn,
  resultsCacheTtl: Duration.minutes(10),
});

const restapi = new RestApi(stack, 'MyRestApi', {
  cloudWatchRole: true,
  defaultMethodOptions: {
    authorizer,
  },
  defaultCorsPreflightOptions: {
    allowOrigins: Cors.ALL_ORIGINS,
  },
});

restapi.root.addMethod('ANY', new MockIntegration({
  integrationResponses: [
    { statusCode: '200' },
  ],
  passthroughBehavior: PassthroughBehavior.NEVER,
  requestTemplates: {
    'application/json': '{ "statusCode": 200 }',
  },
}), {
  methodResponses: [
    { statusCode: '200' },
  ],
});

const integ = new IntegTest(app, 'apigw-token-auth', {
  testCases: [stack],
});
const hostName = `${restapi.restApiId}.execute-api.${stack.region}.${stack.urlSuffix}`;
const testFunc = new lambda.Function(stack, 'InvokeFunction', {
  memorySize: 250,
  timeout: Duration.seconds(10),
  code: lambda.Code.fromInline(`
const https = require('https');
const options = {
  hostname: '${hostName}',
  path: '/${restapi.deploymentStage.stageName}',
};
exports.handler = async function(event) {
  console.log(event);
  options.method = event.method;
  if ('authorization' in event) {
    options.headers = {
      Authorization: event.authorization,
    };
  }
  let dataString = '';
  const response = await new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.on('data', data => {
        dataString += data;
      })
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: dataString,
        });
      })
    });
    req.on('error', err => {
      reject({
        statusCode: 500,
        body: JSON.stringify({
          cause: 'Something went wrong',
          error: err,
        })
      });
    });
    req.end();
  });
  return response;
}
`),
  handler: 'index.handler',
  runtime: STANDARD_NODEJS_RUNTIME,
});

const invokeGet = integ.assertions.invokeFunction({
  functionName: testFunc.functionName,
  payload: JSON.stringify({
    method: 'GET',
    authorization: 'allow',
  }),
});
invokeGet.expect(ExpectedResult.objectLike({
  Payload: { statusCode: 200 },
}));

const invokeGetDeny = integ.assertions.invokeFunction({
  functionName: testFunc.functionName,
  payload: JSON.stringify({
    method: 'GET',
    authorization: 'deny',
  }),
});
invokeGetDeny.expect(ExpectedResult.objectLike({
  Payload: { body: Match.stringLikeRegexp('User is not authorized to access this resource with an explicit deny') },
}));

const invokeOptions = integ.assertions.invokeFunction({
  functionName: testFunc.functionName,
  payload: JSON.stringify({
    method: 'OPTIONS',
  }),
});
invokeOptions.expect(ExpectedResult.objectLike({
  Payload: { statusCode: 204 },
}));
