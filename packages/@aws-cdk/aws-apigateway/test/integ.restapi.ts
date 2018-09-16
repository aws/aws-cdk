import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import apigateway = require('../lib');

class Test extends cdk.Stack {
    constructor(parent: cdk.App, id: string) {
        super(parent, id);

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

        const v1 = api.addResource('v1');

        const integration = new apigateway.LambdaIntegration(handler);

        const toys = v1.addResource('toys');
        toys.onMethod('GET', integration);
        toys.onMethod('POST');
        toys.onMethod('PUT');

        const appliances = v1.addResource('appliances');
        appliances.onMethod('GET');

        const books = v1.addResource('books');
        books.onMethod('GET', integration);
        books.onMethod('POST', integration);

        function handlerCode(event: any, _: any, callback: any) {
            return callback(undefined, {
                isBase64Encoded: false,
                statusCode: 200,
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(event)
            });
        }
    }
}

const app = new cdk.App(process.argv);

new Test(app, 'test-apigateway-restapi');

process.stdout.write(app.run());