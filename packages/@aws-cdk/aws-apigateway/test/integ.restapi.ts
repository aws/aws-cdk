import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import apigateway = require('../lib');

class Test extends cdk.Stack {
    constructor(parent: cdk.App, id: string) {
        super(parent, id);

        const api = new apigateway.RestApi(this, 'my-api', {
            minimumCompressionSize: 0,
            autoDeployStageOptions: {
                cacheClusterEnabled: true,
                stageName: 'test',
                description: 'testing stage',
                methodOptions: {
                    loggingLevel: apigateway.MethodLoggingLevel.Info,
                    dataTraceEnabled: true
                },
                customMethodOptions: {
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

        const v1 = api.addResource('api');

        const toys = v1.addResource('toys');

        toys.onMethod('GET', {
            integration: new apigateway.LambdaMethodIntegration(handler)
        });

        toys.onMethod('POST');
        toys.onMethod('PUT');

        const appliances = v1.addResource('appliances');
        appliances.onMethod('GET');

        const books = v1.addResource('books');
        books.onMethod('GET');
        books.onMethod('POST');

        function handlerCode(event: any, _: any, callback: any) {
            // tslint:disable-next-line:no-console
            console.log(JSON.stringify(event, undefined, 2));

            return callback(undefined, {
                isBase64Encoded: false,
                statusCode: 200,
                headers: { },
                body: 'hi'
            });
        }
    }
}

const app = new cdk.App(process.argv);

new Test(app, 'test-apigateway-restapi');

process.stdout.write(app.run());