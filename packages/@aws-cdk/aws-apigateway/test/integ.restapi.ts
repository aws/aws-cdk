import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import apigateway = require('../lib');

class Test extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const api = new apigateway.RestApi(this, 'my-api', {
      retainDeployments: true,
      deployOptions: {
        cacheClusterEnabled: true,
        stageName: 'beta',
        description: 'beta stage',
        loggingLevel: apigateway.MethodLoggingLevel.Info,
        dataTraceEnabled: true,
        methodOptions: {
          '/api/appliances/GET': {
            cachingEnabled: true
          }
        }
      }
    });

    const handler = new lambda.Function(this, 'MyHandler', {
      runtime: lambda.Runtime.NodeJS610,
      code: lambda.Code.inline(`exports.handler = ${handlerCode}`),
      handler: 'index.handler',
    });

    const v1 = api.root.addResource('v1');

    const integration = new apigateway.LambdaIntegration(handler);

    const toys = v1.addResource('toys');
    const getToysMethod: apigateway.Method = toys.addMethod('GET', integration, { apiKeyRequired: true });
    toys.addMethod('POST');
    toys.addMethod('PUT');

    const appliances = v1.addResource('appliances');
    appliances.addMethod('GET');

    const books = v1.addResource('books');
    books.addMethod('GET', integration);
    books.addMethod('POST', integration);

    function handlerCode(event: any, _: any, callback: any) {
      return callback(undefined, {
        isBase64Encoded: false,
        statusCode: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(event)
      });
    }

    const usagePlan: apigateway.UsagePlan = new apigateway.UsagePlan(this, 'UsagePlan', {
      name: 'Basic',
      description: 'Free tier monthly usage plan',
      quota: {
        limit: 10000,
        period: apigateway.Period.Month
      },
      throttle: {
        rateLimit: 50,
        burstLimit: 5
      },
      apiStages: [
        {
          api: api,
          stage: api.deploymentStage,
          throttle: [
            {
              method: getToysMethod,
              throttle: {
                rateLimit: 10,
                burstLimit: 2
              }
            }
          ]
        }
      ]
    });

    const apiKey: apigateway.ApiKey = new apigateway.ApiKey(this, 'ApiKey', {
      resources: [api]
    });

    usagePlan.addApiKey(apiKey);
  }
}

const app = new cdk.App();

new Test(app, 'test-apigateway-restapi');

app.run();
