import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { Size } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

class Test extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const api = new apigateway.RestApi(this, 'my-api', {
      retainDeployments: true,
      cloudWatchRole: true,
      minCompressionSize: Size.bytes(1024),
      description: 'api description',
      deployOptions: {
        cacheClusterEnabled: true,
        stageName: 'beta',
        description: 'beta stage',
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        methodOptions: {
          '/api/appliances/GET': {
            cachingEnabled: true,
          },
        },
      },
    });

    const handler = new lambda.Function(this, 'MyHandler', {
      runtime: STANDARD_NODEJS_RUNTIME,
      code: lambda.Code.fromInline(`exports.handler = ${handlerCode}`),
      handler: 'index.handler',
    });

    const v1 = api.root.addResource('v1');

    const integration = new apigateway.LambdaIntegration(handler);

    const toys = v1.addResource('toys');
    const getToysMethod: apigateway.Method = toys.addMethod('GET', integration, { apiKeyRequired: true });
    toys.addMethod('POST');
    toys.addMethod('PUT');

    const appliances = v1.addResource('$appliances:all');
    appliances.addMethod('GET');

    const books = v1.addResource('books');
    books.addMethod('GET', integration);
    books.addMethod('POST', integration);

    function handlerCode(event: any, _: any, callback: any) {
      return callback(undefined, {
        isBase64Encoded: false,
        statusCode: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(event),
      });
    }

    const key = api.addApiKey('ApiKey');
    const plan = api.addUsagePlan('UsagePlan', {
      name: 'Basic',
      apiKey: key,
      description: 'Free tier monthly usage plan',
      throttle: { rateLimit: 5 },
      quota: {
        limit: 10000,
        period: apigateway.Period.MONTH,
      },
    });
    plan.addApiStage({
      stage: api.deploymentStage,
      throttle: [
        {
          method: getToysMethod,
          throttle: {
            rateLimit: 10,
            burstLimit: 2,
          },
        },
      ],
    });

    const testDeploy = new apigateway.Deployment(this, 'TestDeployment', {
      api,
      retainDeployments: false,
    });
    const testStage = new apigateway.Stage(this, 'TestStage', {
      deployment: testDeploy,
    });
    testStage.addApiKey('MyTestApiKey');
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const testCase = new Test(app, 'test-apigateway-restapi');
new IntegTest(app, 'apigateway-restapi', {
  testCases: [testCase],
});

