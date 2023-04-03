"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const lambda = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
const apigw = require("../lib");
describe('cors', () => {
    test('adds an OPTIONS method to a resource', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'api');
        const resource = api.root.addResource('MyResource');
        // WHEN
        resource.addCorsPreflight({
            allowOrigins: ['https://amazon.com'],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'OPTIONS',
            ResourceId: { Ref: 'apiMyResourceD5CDB490' },
            Integration: {
                IntegrationResponses: [
                    {
                        ResponseParameters: {
                            'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                            'method.response.header.Access-Control-Allow-Origin': "'https://amazon.com'",
                            'method.response.header.Vary': "'Origin'",
                            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
                        },
                        StatusCode: '204',
                    },
                ],
                RequestTemplates: {
                    'application/json': '{ statusCode: 200 }',
                },
                Type: 'MOCK',
            },
            MethodResponses: [
                {
                    ResponseParameters: {
                        'method.response.header.Access-Control-Allow-Headers': true,
                        'method.response.header.Access-Control-Allow-Origin': true,
                        'method.response.header.Vary': true,
                        'method.response.header.Access-Control-Allow-Methods': true,
                    },
                    StatusCode: '204',
                },
            ],
        });
    });
    test('allowCredentials', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'api');
        const resource = api.root.addResource('MyResource');
        // WHEN
        resource.addCorsPreflight({
            allowOrigins: ['https://amazon.com'],
            allowCredentials: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'OPTIONS',
            ResourceId: { Ref: 'apiMyResourceD5CDB490' },
            Integration: {
                IntegrationResponses: [
                    {
                        ResponseParameters: {
                            'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                            'method.response.header.Access-Control-Allow-Origin': "'https://amazon.com'",
                            'method.response.header.Vary': "'Origin'",
                            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
                            'method.response.header.Access-Control-Allow-Credentials': "'true'",
                        },
                        StatusCode: '204',
                    },
                ],
                RequestTemplates: {
                    'application/json': '{ statusCode: 200 }',
                },
                Type: 'MOCK',
            },
            MethodResponses: [
                {
                    ResponseParameters: {
                        'method.response.header.Access-Control-Allow-Headers': true,
                        'method.response.header.Access-Control-Allow-Origin': true,
                        'method.response.header.Vary': true,
                        'method.response.header.Access-Control-Allow-Methods': true,
                        'method.response.header.Access-Control-Allow-Credentials': true,
                    },
                    StatusCode: '204',
                },
            ],
        });
    });
    test('allowMethods', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'api');
        const resource = api.root.addResource('MyResource');
        // WHEN
        resource.addCorsPreflight({
            allowOrigins: ['https://aws.amazon.com'],
            allowMethods: ['GET', 'PUT'],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'OPTIONS',
            ResourceId: { Ref: 'apiMyResourceD5CDB490' },
            Integration: {
                IntegrationResponses: [
                    {
                        ResponseParameters: {
                            'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                            'method.response.header.Access-Control-Allow-Origin': "'https://aws.amazon.com'",
                            'method.response.header.Vary': "'Origin'",
                            'method.response.header.Access-Control-Allow-Methods': "'GET,PUT'",
                        },
                        StatusCode: '204',
                    },
                ],
                RequestTemplates: {
                    'application/json': '{ statusCode: 200 }',
                },
                Type: 'MOCK',
            },
            MethodResponses: [
                {
                    ResponseParameters: {
                        'method.response.header.Access-Control-Allow-Headers': true,
                        'method.response.header.Access-Control-Allow-Origin': true,
                        'method.response.header.Vary': true,
                        'method.response.header.Access-Control-Allow-Methods': true,
                    },
                    StatusCode: '204',
                },
            ],
        });
    });
    test('allowMethods ANY will expand to all supported methods', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'api');
        const resource = api.root.addResource('MyResource');
        // WHEN
        resource.addCorsPreflight({
            allowOrigins: ['https://aws.amazon.com'],
            allowMethods: ['ANY'],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'OPTIONS',
            ResourceId: { Ref: 'apiMyResourceD5CDB490' },
            Integration: {
                IntegrationResponses: [
                    {
                        ResponseParameters: {
                            'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                            'method.response.header.Access-Control-Allow-Origin': "'https://aws.amazon.com'",
                            'method.response.header.Vary': "'Origin'",
                            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
                        },
                        StatusCode: '204',
                    },
                ],
                RequestTemplates: {
                    'application/json': '{ statusCode: 200 }',
                },
                Type: 'MOCK',
            },
            MethodResponses: [
                {
                    ResponseParameters: {
                        'method.response.header.Access-Control-Allow-Headers': true,
                        'method.response.header.Access-Control-Allow-Origin': true,
                        'method.response.header.Vary': true,
                        'method.response.header.Access-Control-Allow-Methods': true,
                    },
                    StatusCode: '204',
                },
            ],
        });
    });
    test('allowMethods ANY cannot be used with any other method', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'api');
        const resource = api.root.addResource('MyResource');
        // THEN
        expect(() => resource.addCorsPreflight({
            allowOrigins: ['https://aws.amazon.com'],
            allowMethods: ['ANY', 'PUT'],
        })).toThrow(/ANY cannot be used with any other method. Received: ANY,PUT/);
    });
    test('statusCode can be used to set the response status code', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'api');
        const resource = api.root.addResource('MyResource');
        // WHEN
        resource.addCorsPreflight({
            allowOrigins: ['https://aws.amazon.com'],
            statusCode: 200,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'OPTIONS',
            ResourceId: { Ref: 'apiMyResourceD5CDB490' },
            Integration: {
                IntegrationResponses: [
                    {
                        ResponseParameters: {
                            'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                            'method.response.header.Access-Control-Allow-Origin': "'https://aws.amazon.com'",
                            'method.response.header.Vary': "'Origin'",
                            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
                        },
                        StatusCode: '200',
                    },
                ],
                RequestTemplates: {
                    'application/json': '{ statusCode: 200 }',
                },
                Type: 'MOCK',
            },
            MethodResponses: [
                {
                    ResponseParameters: {
                        'method.response.header.Access-Control-Allow-Headers': true,
                        'method.response.header.Access-Control-Allow-Origin': true,
                        'method.response.header.Vary': true,
                        'method.response.header.Access-Control-Allow-Methods': true,
                    },
                    StatusCode: '200',
                },
            ],
        });
    });
    test('allowOrigins must contain at least one origin', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'api');
        const resource = api.root.addResource('MyResource');
        // WHEN
        expect(() => resource.addCorsPreflight({
            allowOrigins: [],
        })).toThrow(/allowOrigins must contain at least one origin/);
    });
    test('allowOrigins can be used to specify multiple origins', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'api');
        const resource = api.root.addResource('MyResource');
        // WHEN
        resource.addCorsPreflight({
            allowOrigins: ['https://twitch.tv', 'https://amazon.com', 'https://aws.amazon.com'],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'OPTIONS',
            ResourceId: { Ref: 'apiMyResourceD5CDB490' },
            Integration: {
                IntegrationResponses: [
                    {
                        ResponseParameters: {
                            'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                            'method.response.header.Access-Control-Allow-Origin': "'https://twitch.tv'",
                            'method.response.header.Vary': "'Origin'",
                            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
                        },
                        ResponseTemplates: {
                            'application/json': '#set($origin = $input.params().header.get("Origin"))\n#if($origin == "") #set($origin = $input.params().header.get("origin")) #end\n#if($origin.matches("https://amazon.com") || $origin.matches("https://aws.amazon.com"))\n  #set($context.responseOverride.header.Access-Control-Allow-Origin = $origin)\n#end',
                        },
                        StatusCode: '204',
                    },
                ],
                RequestTemplates: {
                    'application/json': '{ statusCode: 200 }',
                },
                Type: 'MOCK',
            },
            MethodResponses: [
                {
                    ResponseParameters: {
                        'method.response.header.Access-Control-Allow-Headers': true,
                        'method.response.header.Access-Control-Allow-Origin': true,
                        'method.response.header.Vary': true,
                        'method.response.header.Access-Control-Allow-Methods': true,
                    },
                    StatusCode: '204',
                },
            ],
        });
    });
    test('maxAge can be used to specify Access-Control-Max-Age', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'api');
        const resource = api.root.addResource('MyResource');
        // WHEN
        resource.addCorsPreflight({
            allowOrigins: ['https://amazon.com'],
            maxAge: core_1.Duration.minutes(60),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'OPTIONS',
            ResourceId: { Ref: 'apiMyResourceD5CDB490' },
            Integration: {
                IntegrationResponses: [
                    {
                        ResponseParameters: {
                            'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                            'method.response.header.Access-Control-Allow-Origin': "'https://amazon.com'",
                            'method.response.header.Vary': "'Origin'",
                            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
                            'method.response.header.Access-Control-Max-Age': `'${60 * 60}'`,
                        },
                        StatusCode: '204',
                    },
                ],
                RequestTemplates: {
                    'application/json': '{ statusCode: 200 }',
                },
                Type: 'MOCK',
            },
            MethodResponses: [
                {
                    ResponseParameters: {
                        'method.response.header.Access-Control-Allow-Headers': true,
                        'method.response.header.Access-Control-Allow-Origin': true,
                        'method.response.header.Vary': true,
                        'method.response.header.Access-Control-Allow-Methods': true,
                        'method.response.header.Access-Control-Max-Age': true,
                    },
                    StatusCode: '204',
                },
            ],
        });
    });
    test('disableCache will set Max-Age to -1', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'api');
        const resource = api.root.addResource('MyResource');
        // WHEN
        resource.addCorsPreflight({
            allowOrigins: ['https://amazon.com'],
            disableCache: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'OPTIONS',
            ResourceId: { Ref: 'apiMyResourceD5CDB490' },
            Integration: {
                IntegrationResponses: [
                    {
                        ResponseParameters: {
                            'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                            'method.response.header.Access-Control-Allow-Origin': "'https://amazon.com'",
                            'method.response.header.Vary': "'Origin'",
                            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
                            'method.response.header.Access-Control-Max-Age': '\'-1\'',
                        },
                        StatusCode: '204',
                    },
                ],
                RequestTemplates: {
                    'application/json': '{ statusCode: 200 }',
                },
                Type: 'MOCK',
            },
            MethodResponses: [
                {
                    ResponseParameters: {
                        'method.response.header.Access-Control-Allow-Headers': true,
                        'method.response.header.Access-Control-Allow-Origin': true,
                        'method.response.header.Vary': true,
                        'method.response.header.Access-Control-Allow-Methods': true,
                        'method.response.header.Access-Control-Max-Age': true,
                    },
                    StatusCode: '204',
                },
            ],
        });
    });
    test('maxAge and disableCache are mutually exclusive', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'api');
        const resource = api.root.addResource('MyResource');
        // THEN
        expect(() => resource.addCorsPreflight({
            allowOrigins: ['https://amazon.com'],
            disableCache: true,
            maxAge: core_1.Duration.seconds(10),
        })).toThrow(/The options "maxAge" and "disableCache" are mutually exclusive/);
    });
    test('exposeHeaders can be used to specify Access-Control-Expose-Headers', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'api');
        const resource = api.root.addResource('MyResource');
        // WHEN
        resource.addCorsPreflight({
            allowOrigins: ['https://amazon.com'],
            exposeHeaders: ['Authorization', 'Foo'],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'OPTIONS',
            ResourceId: { Ref: 'apiMyResourceD5CDB490' },
            Integration: {
                IntegrationResponses: [
                    {
                        ResponseParameters: {
                            'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                            'method.response.header.Access-Control-Allow-Origin': "'https://amazon.com'",
                            'method.response.header.Vary': "'Origin'",
                            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
                            'method.response.header.Access-Control-Expose-Headers': "'Authorization,Foo'",
                        },
                        StatusCode: '204',
                    },
                ],
                RequestTemplates: {
                    'application/json': '{ statusCode: 200 }',
                },
                Type: 'MOCK',
            },
            MethodResponses: [
                {
                    ResponseParameters: {
                        'method.response.header.Access-Control-Allow-Headers': true,
                        'method.response.header.Access-Control-Allow-Origin': true,
                        'method.response.header.Vary': true,
                        'method.response.header.Access-Control-Allow-Methods': true,
                        'method.response.header.Access-Control-Expose-Headers': true,
                    },
                    StatusCode: '204',
                },
            ],
        });
    });
    test('defaultCorsPreflightOptions can be used to specify CORS for all resource tree', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'api');
        // WHEN
        const resource = api.root.addResource('MyResource', {
            defaultCorsPreflightOptions: {
                allowOrigins: ['https://amazon.com'],
            },
        });
        resource.addResource('MyChildResource');
        // THEN
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ApiGateway::Method', 2); // on both resources
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'OPTIONS',
            ResourceId: { Ref: 'apiMyResourceD5CDB490' },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'OPTIONS',
            ResourceId: { Ref: 'apiMyResourceMyChildResource2DC010C5' },
        });
    });
    test('defaultCorsPreflightOptions can be specified at the API level to apply to all resources', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const api = new apigw.RestApi(stack, 'api', {
            defaultCorsPreflightOptions: {
                allowOrigins: ['https://amazon.com'],
            },
        });
        const child1 = api.root.addResource('child1');
        child1.addResource('child2');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'OPTIONS',
            ResourceId: { 'Fn::GetAtt': ['apiC8550315', 'RootResourceId'] },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'OPTIONS',
            ResourceId: { Ref: 'apichild1841A5840' },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'OPTIONS',
            ResourceId: { Ref: 'apichild1child26A9A7C47' },
        });
    });
    test('Vary: Origin is sent back if Allow-Origin is not "*"', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'api');
        // WHEN
        api.root.addResource('AllowAll', {
            defaultCorsPreflightOptions: {
                allowOrigins: apigw.Cors.ALL_ORIGINS,
            },
        });
        api.root.addResource('AllowSpecific', {
            defaultCorsPreflightOptions: {
                allowOrigins: ['http://specific.com'],
            },
        });
        // THENB
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            ResourceId: {
                Ref: 'apiAllowAll2F5BC564',
            },
            Integration: {
                IntegrationResponses: [
                    {
                        ResponseParameters: {
                            'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                            'method.response.header.Access-Control-Allow-Origin': "'*'",
                            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
                        },
                        StatusCode: '204',
                    },
                ],
                RequestTemplates: {
                    'application/json': '{ statusCode: 200 }',
                },
                Type: 'MOCK',
            },
            MethodResponses: [
                {
                    ResponseParameters: {
                        'method.response.header.Access-Control-Allow-Headers': true,
                        'method.response.header.Access-Control-Allow-Origin': true,
                        'method.response.header.Access-Control-Allow-Methods': true,
                    },
                    StatusCode: '204',
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            ResourceId: {
                Ref: 'apiAllowSpecific77DD8AF1',
            },
            Integration: {
                IntegrationResponses: [
                    {
                        ResponseParameters: {
                            'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
                            'method.response.header.Access-Control-Allow-Origin': "'http://specific.com'",
                            'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
                            'method.response.header.Vary': "'Origin'",
                        },
                        StatusCode: '204',
                    },
                ],
                RequestTemplates: {
                    'application/json': '{ statusCode: 200 }',
                },
                Type: 'MOCK',
            },
            MethodResponses: [
                {
                    ResponseParameters: {
                        'method.response.header.Access-Control-Allow-Headers': true,
                        'method.response.header.Access-Control-Allow-Origin': true,
                        'method.response.header.Access-Control-Allow-Methods': true,
                        'method.response.header.Vary': true,
                    },
                    StatusCode: '204',
                },
            ],
        });
    });
    test('If "*" is specified in allow-origin, it cannot be mixed with specific origins', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'api');
        // WHEN
        expect(() => api.root.addResource('AllowAll', {
            defaultCorsPreflightOptions: {
                allowOrigins: ['https://bla.com', '*', 'https://specific'],
            },
        })).toThrow(/Invalid "allowOrigins" - cannot mix "\*" with specific origins: https:\/\/bla\.com,\*,https:\/\/specific/);
    });
    test('defaultCorsPreflightOptions can be used to specify CORS for all resource tree [LambdaRestApi]', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const handler = new lambda.Function(stack, 'handler', {
            handler: 'index.handler',
            code: lambda.Code.fromInline('boom'),
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        // WHEN
        new apigw.LambdaRestApi(stack, 'lambda-rest-api', {
            handler,
            defaultCorsPreflightOptions: {
                allowOrigins: ['https://amazon.com'],
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ApiGateway::Method', 4); // two ANY and two OPTIONS resources
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'OPTIONS',
            ResourceId: {
                'Fn::GetAtt': [
                    'lambdarestapiAAD10924',
                    'RootResourceId',
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'OPTIONS',
            ResourceId: {
                Ref: 'lambdarestapiproxyE3AE07E3',
            },
        });
    });
    test('CORS and proxy resources', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const api = new apigw.RestApi(stack, 'API', {
            defaultCorsPreflightOptions: { allowOrigins: ['*'] },
        });
        api.root.addProxy();
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'OPTIONS',
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ycy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29ycy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLDhDQUE4QztBQUM5Qyx3Q0FBZ0Q7QUFDaEQsZ0NBQWdDO0FBRWhDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0lBQ3BCLElBQUksQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7UUFDaEQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1QyxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVwRCxPQUFPO1FBQ1AsUUFBUSxDQUFDLGdCQUFnQixDQUFDO1lBQ3hCLFlBQVksRUFBRSxDQUFDLG9CQUFvQixDQUFDO1NBQ3JDLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx5QkFBeUIsRUFBRTtZQUN6RSxVQUFVLEVBQUUsU0FBUztZQUNyQixVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsdUJBQXVCLEVBQUU7WUFDNUMsV0FBVyxFQUFFO2dCQUNYLG9CQUFvQixFQUFFO29CQUNwQjt3QkFDRSxrQkFBa0IsRUFBRTs0QkFDbEIscURBQXFELEVBQUUseUZBQXlGOzRCQUNoSixvREFBb0QsRUFBRSxzQkFBc0I7NEJBQzVFLDZCQUE2QixFQUFFLFVBQVU7NEJBQ3pDLHFEQUFxRCxFQUFFLDBDQUEwQzt5QkFDbEc7d0JBQ0QsVUFBVSxFQUFFLEtBQUs7cUJBQ2xCO2lCQUNGO2dCQUNELGdCQUFnQixFQUFFO29CQUNoQixrQkFBa0IsRUFBRSxxQkFBcUI7aUJBQzFDO2dCQUNE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ZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBEdXJhdGlvbiwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGFwaWd3IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdjb3JzJywgKCkgPT4ge1xuICB0ZXN0KCdhZGRzIGFuIE9QVElPTlMgbWV0aG9kIHRvIGEgcmVzb3VyY2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnYXBpJyk7XG4gICAgY29uc3QgcmVzb3VyY2UgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgnTXlSZXNvdXJjZScpO1xuXG4gICAgLy8gV0hFTlxuICAgIHJlc291cmNlLmFkZENvcnNQcmVmbGlnaHQoe1xuICAgICAgYWxsb3dPcmlnaW5zOiBbJ2h0dHBzOi8vYW1hem9uLmNvbSddLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIEh0dHBNZXRob2Q6ICdPUFRJT05TJyxcbiAgICAgIFJlc291cmNlSWQ6IHsgUmVmOiAnYXBpTXlSZXNvdXJjZUQ1Q0RCNDkwJyB9LFxuICAgICAgSW50ZWdyYXRpb246IHtcbiAgICAgICAgSW50ZWdyYXRpb25SZXNwb25zZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZXNwb25zZVBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6IFwiJ0NvbnRlbnQtVHlwZSxYLUFtei1EYXRlLEF1dGhvcml6YXRpb24sWC1BcGktS2V5LFgtQW16LVNlY3VyaXR5LVRva2VuLFgtQW16LVVzZXItQWdlbnQnXCIsXG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6IFwiJ2h0dHBzOi8vYW1hem9uLmNvbSdcIixcbiAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuVmFyeSc6IFwiJ09yaWdpbidcIixcbiAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyc6IFwiJ09QVElPTlMsR0VULFBVVCxQT1NULERFTEVURSxQQVRDSCxIRUFEJ1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFN0YXR1c0NvZGU6ICcyMDQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFJlcXVlc3RUZW1wbGF0ZXM6IHtcbiAgICAgICAgICAnYXBwbGljYXRpb24vanNvbic6ICd7IHN0YXR1c0NvZGU6IDIwMCB9JyxcbiAgICAgICAgfSxcbiAgICAgICAgVHlwZTogJ01PQ0snLFxuICAgICAgfSxcbiAgICAgIE1ldGhvZFJlc3BvbnNlczogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVzcG9uc2VQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogdHJ1ZSxcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6IHRydWUsXG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5WYXJ5JzogdHJ1ZSxcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgU3RhdHVzQ29kZTogJzIwNCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhbGxvd0NyZWRlbnRpYWxzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ2FwaScpO1xuICAgIGNvbnN0IHJlc291cmNlID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ015UmVzb3VyY2UnKTtcblxuICAgIC8vIFdIRU5cbiAgICByZXNvdXJjZS5hZGRDb3JzUHJlZmxpZ2h0KHtcbiAgICAgIGFsbG93T3JpZ2luczogWydodHRwczovL2FtYXpvbi5jb20nXSxcbiAgICAgIGFsbG93Q3JlZGVudGlhbHM6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywge1xuICAgICAgSHR0cE1ldGhvZDogJ09QVElPTlMnLFxuICAgICAgUmVzb3VyY2VJZDogeyBSZWY6ICdhcGlNeVJlc291cmNlRDVDREI0OTAnIH0sXG4gICAgICBJbnRlZ3JhdGlvbjoge1xuICAgICAgICBJbnRlZ3JhdGlvblJlc3BvbnNlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlc3BvbnNlUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogXCInQ29udGVudC1UeXBlLFgtQW16LURhdGUsQXV0aG9yaXphdGlvbixYLUFwaS1LZXksWC1BbXotU2VjdXJpdHktVG9rZW4sWC1BbXotVXNlci1BZ2VudCdcIixcbiAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogXCInaHR0cHM6Ly9hbWF6b24uY29tJ1wiLFxuICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5WYXJ5JzogXCInT3JpZ2luJ1wiLFxuICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogXCInT1BUSU9OUyxHRVQsUFVULFBPU1QsREVMRVRFLFBBVENILEhFQUQnXCIsXG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzJzogXCIndHJ1ZSdcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTdGF0dXNDb2RlOiAnMjA0JyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBSZXF1ZXN0VGVtcGxhdGVzOiB7XG4gICAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiAneyBzdGF0dXNDb2RlOiAyMDAgfScsXG4gICAgICAgIH0sXG4gICAgICAgIFR5cGU6ICdNT0NLJyxcbiAgICAgIH0sXG4gICAgICBNZXRob2RSZXNwb25zZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlc3BvbnNlUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6IHRydWUsXG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiB0cnVlLFxuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuVmFyeSc6IHRydWUsXG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogdHJ1ZSxcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzJzogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFN0YXR1c0NvZGU6ICcyMDQnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWxsb3dNZXRob2RzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ2FwaScpO1xuICAgIGNvbnN0IHJlc291cmNlID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ015UmVzb3VyY2UnKTtcblxuICAgIC8vIFdIRU5cbiAgICByZXNvdXJjZS5hZGRDb3JzUHJlZmxpZ2h0KHtcbiAgICAgIGFsbG93T3JpZ2luczogWydodHRwczovL2F3cy5hbWF6b24uY29tJ10sXG4gICAgICBhbGxvd01ldGhvZHM6IFsnR0VUJywgJ1BVVCddLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIEh0dHBNZXRob2Q6ICdPUFRJT05TJyxcbiAgICAgIFJlc291cmNlSWQ6IHsgUmVmOiAnYXBpTXlSZXNvdXJjZUQ1Q0RCNDkwJyB9LFxuICAgICAgSW50ZWdyYXRpb246IHtcbiAgICAgICAgSW50ZWdyYXRpb25SZXNwb25zZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZXNwb25zZVBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6IFwiJ0NvbnRlbnQtVHlwZSxYLUFtei1EYXRlLEF1dGhvcml6YXRpb24sWC1BcGktS2V5LFgtQW16LVNlY3VyaXR5LVRva2VuLFgtQW16LVVzZXItQWdlbnQnXCIsXG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6IFwiJ2h0dHBzOi8vYXdzLmFtYXpvbi5jb20nXCIsXG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLlZhcnknOiBcIidPcmlnaW4nXCIsXG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiBcIidHRVQsUFVUJ1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFN0YXR1c0NvZGU6ICcyMDQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFJlcXVlc3RUZW1wbGF0ZXM6IHtcbiAgICAgICAgICAnYXBwbGljYXRpb24vanNvbic6ICd7IHN0YXR1c0NvZGU6IDIwMCB9JyxcbiAgICAgICAgfSxcbiAgICAgICAgVHlwZTogJ01PQ0snLFxuICAgICAgfSxcbiAgICAgIE1ldGhvZFJlc3BvbnNlczogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVzcG9uc2VQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogdHJ1ZSxcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6IHRydWUsXG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5WYXJ5JzogdHJ1ZSxcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgU3RhdHVzQ29kZTogJzIwNCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhbGxvd01ldGhvZHMgQU5ZIHdpbGwgZXhwYW5kIHRvIGFsbCBzdXBwb3J0ZWQgbWV0aG9kcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICdhcGknKTtcbiAgICBjb25zdCByZXNvdXJjZSA9IGFwaS5yb290LmFkZFJlc291cmNlKCdNeVJlc291cmNlJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgcmVzb3VyY2UuYWRkQ29yc1ByZWZsaWdodCh7XG4gICAgICBhbGxvd09yaWdpbnM6IFsnaHR0cHM6Ly9hd3MuYW1hem9uLmNvbSddLFxuICAgICAgYWxsb3dNZXRob2RzOiBbJ0FOWSddLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIEh0dHBNZXRob2Q6ICdPUFRJT05TJyxcbiAgICAgIFJlc291cmNlSWQ6IHsgUmVmOiAnYXBpTXlSZXNvdXJjZUQ1Q0RCNDkwJyB9LFxuICAgICAgSW50ZWdyYXRpb246IHtcbiAgICAgICAgSW50ZWdyYXRpb25SZXNwb25zZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZXNwb25zZVBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6IFwiJ0NvbnRlbnQtVHlwZSxYLUFtei1EYXRlLEF1dGhvcml6YXRpb24sWC1BcGktS2V5LFgtQW16LVNlY3VyaXR5LVRva2VuLFgtQW16LVVzZXItQWdlbnQnXCIsXG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6IFwiJ2h0dHBzOi8vYXdzLmFtYXpvbi5jb20nXCIsXG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLlZhcnknOiBcIidPcmlnaW4nXCIsXG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiBcIidPUFRJT05TLEdFVCxQVVQsUE9TVCxERUxFVEUsUEFUQ0gsSEVBRCdcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTdGF0dXNDb2RlOiAnMjA0JyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBSZXF1ZXN0VGVtcGxhdGVzOiB7XG4gICAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiAneyBzdGF0dXNDb2RlOiAyMDAgfScsXG4gICAgICAgIH0sXG4gICAgICAgIFR5cGU6ICdNT0NLJyxcbiAgICAgIH0sXG4gICAgICBNZXRob2RSZXNwb25zZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlc3BvbnNlUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6IHRydWUsXG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiB0cnVlLFxuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuVmFyeSc6IHRydWUsXG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFN0YXR1c0NvZGU6ICcyMDQnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWxsb3dNZXRob2RzIEFOWSBjYW5ub3QgYmUgdXNlZCB3aXRoIGFueSBvdGhlciBtZXRob2QnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnYXBpJyk7XG4gICAgY29uc3QgcmVzb3VyY2UgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgnTXlSZXNvdXJjZScpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiByZXNvdXJjZS5hZGRDb3JzUHJlZmxpZ2h0KHtcbiAgICAgIGFsbG93T3JpZ2luczogWydodHRwczovL2F3cy5hbWF6b24uY29tJ10sXG4gICAgICBhbGxvd01ldGhvZHM6IFsnQU5ZJywgJ1BVVCddLFxuICAgIH0pKS50b1Rocm93KC9BTlkgY2Fubm90IGJlIHVzZWQgd2l0aCBhbnkgb3RoZXIgbWV0aG9kLiBSZWNlaXZlZDogQU5ZLFBVVC8pO1xuICB9KTtcblxuICB0ZXN0KCdzdGF0dXNDb2RlIGNhbiBiZSB1c2VkIHRvIHNldCB0aGUgcmVzcG9uc2Ugc3RhdHVzIGNvZGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnYXBpJyk7XG4gICAgY29uc3QgcmVzb3VyY2UgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgnTXlSZXNvdXJjZScpO1xuXG4gICAgLy8gV0hFTlxuICAgIHJlc291cmNlLmFkZENvcnNQcmVmbGlnaHQoe1xuICAgICAgYWxsb3dPcmlnaW5zOiBbJ2h0dHBzOi8vYXdzLmFtYXpvbi5jb20nXSxcbiAgICAgIHN0YXR1c0NvZGU6IDIwMCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCB7XG4gICAgICBIdHRwTWV0aG9kOiAnT1BUSU9OUycsXG4gICAgICBSZXNvdXJjZUlkOiB7IFJlZjogJ2FwaU15UmVzb3VyY2VENUNEQjQ5MCcgfSxcbiAgICAgIEludGVncmF0aW9uOiB7XG4gICAgICAgIEludGVncmF0aW9uUmVzcG9uc2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVzcG9uc2VQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiBcIidDb250ZW50LVR5cGUsWC1BbXotRGF0ZSxBdXRob3JpemF0aW9uLFgtQXBpLUtleSxYLUFtei1TZWN1cml0eS1Ub2tlbixYLUFtei1Vc2VyLUFnZW50J1wiLFxuICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiBcIidodHRwczovL2F3cy5hbWF6b24uY29tJ1wiLFxuICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5WYXJ5JzogXCInT3JpZ2luJ1wiLFxuICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogXCInT1BUSU9OUyxHRVQsUFVULFBPU1QsREVMRVRFLFBBVENILEhFQUQnXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU3RhdHVzQ29kZTogJzIwMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgUmVxdWVzdFRlbXBsYXRlczoge1xuICAgICAgICAgICdhcHBsaWNhdGlvbi9qc29uJzogJ3sgc3RhdHVzQ29kZTogMjAwIH0nLFxuICAgICAgICB9LFxuICAgICAgICBUeXBlOiAnTU9DSycsXG4gICAgICB9LFxuICAgICAgTWV0aG9kUmVzcG9uc2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZXNwb25zZVBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiB0cnVlLFxuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogdHJ1ZSxcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLlZhcnknOiB0cnVlLFxuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyc6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBTdGF0dXNDb2RlOiAnMjAwJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FsbG93T3JpZ2lucyBtdXN0IGNvbnRhaW4gYXQgbGVhc3Qgb25lIG9yaWdpbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICdhcGknKTtcbiAgICBjb25zdCByZXNvdXJjZSA9IGFwaS5yb290LmFkZFJlc291cmNlKCdNeVJlc291cmNlJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgZXhwZWN0KCgpID0+IHJlc291cmNlLmFkZENvcnNQcmVmbGlnaHQoe1xuICAgICAgYWxsb3dPcmlnaW5zOiBbXSxcbiAgICB9KSkudG9UaHJvdygvYWxsb3dPcmlnaW5zIG11c3QgY29udGFpbiBhdCBsZWFzdCBvbmUgb3JpZ2luLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FsbG93T3JpZ2lucyBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IG11bHRpcGxlIG9yaWdpbnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnYXBpJyk7XG4gICAgY29uc3QgcmVzb3VyY2UgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgnTXlSZXNvdXJjZScpO1xuXG4gICAgLy8gV0hFTlxuICAgIHJlc291cmNlLmFkZENvcnNQcmVmbGlnaHQoe1xuICAgICAgYWxsb3dPcmlnaW5zOiBbJ2h0dHBzOi8vdHdpdGNoLnR2JywgJ2h0dHBzOi8vYW1hem9uLmNvbScsICdodHRwczovL2F3cy5hbWF6b24uY29tJ10sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywge1xuICAgICAgSHR0cE1ldGhvZDogJ09QVElPTlMnLFxuICAgICAgUmVzb3VyY2VJZDogeyBSZWY6ICdhcGlNeVJlc291cmNlRDVDREI0OTAnIH0sXG4gICAgICBJbnRlZ3JhdGlvbjoge1xuICAgICAgICBJbnRlZ3JhdGlvblJlc3BvbnNlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlc3BvbnNlUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogXCInQ29udGVudC1UeXBlLFgtQW16LURhdGUsQXV0aG9yaXphdGlvbixYLUFwaS1LZXksWC1BbXotU2VjdXJpdHktVG9rZW4sWC1BbXotVXNlci1BZ2VudCdcIixcbiAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogXCInaHR0cHM6Ly90d2l0Y2gudHYnXCIsXG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLlZhcnknOiBcIidPcmlnaW4nXCIsXG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiBcIidPUFRJT05TLEdFVCxQVVQsUE9TVCxERUxFVEUsUEFUQ0gsSEVBRCdcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBSZXNwb25zZVRlbXBsYXRlczoge1xuICAgICAgICAgICAgICAnYXBwbGljYXRpb24vanNvbic6ICcjc2V0KCRvcmlnaW4gPSAkaW5wdXQucGFyYW1zKCkuaGVhZGVyLmdldChcIk9yaWdpblwiKSlcXG4jaWYoJG9yaWdpbiA9PSBcIlwiKSAjc2V0KCRvcmlnaW4gPSAkaW5wdXQucGFyYW1zKCkuaGVhZGVyLmdldChcIm9yaWdpblwiKSkgI2VuZFxcbiNpZigkb3JpZ2luLm1hdGNoZXMoXCJodHRwczovL2FtYXpvbi5jb21cIikgfHwgJG9yaWdpbi5tYXRjaGVzKFwiaHR0cHM6Ly9hd3MuYW1hem9uLmNvbVwiKSlcXG4gICNzZXQoJGNvbnRleHQucmVzcG9uc2VPdmVycmlkZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luID0gJG9yaWdpbilcXG4jZW5kJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTdGF0dXNDb2RlOiAnMjA0JyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBSZXF1ZXN0VGVtcGxhdGVzOiB7XG4gICAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiAneyBzdGF0dXNDb2RlOiAyMDAgfScsXG4gICAgICAgIH0sXG4gICAgICAgIFR5cGU6ICdNT0NLJyxcbiAgICAgIH0sXG4gICAgICBNZXRob2RSZXNwb25zZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlc3BvbnNlUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6IHRydWUsXG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiB0cnVlLFxuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuVmFyeSc6IHRydWUsXG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFN0YXR1c0NvZGU6ICcyMDQnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnbWF4QWdlIGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgQWNjZXNzLUNvbnRyb2wtTWF4LUFnZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICdhcGknKTtcbiAgICBjb25zdCByZXNvdXJjZSA9IGFwaS5yb290LmFkZFJlc291cmNlKCdNeVJlc291cmNlJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgcmVzb3VyY2UuYWRkQ29yc1ByZWZsaWdodCh7XG4gICAgICBhbGxvd09yaWdpbnM6IFsnaHR0cHM6Ly9hbWF6b24uY29tJ10sXG4gICAgICBtYXhBZ2U6IER1cmF0aW9uLm1pbnV0ZXMoNjApLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIEh0dHBNZXRob2Q6ICdPUFRJT05TJyxcbiAgICAgIFJlc291cmNlSWQ6IHsgUmVmOiAnYXBpTXlSZXNvdXJjZUQ1Q0RCNDkwJyB9LFxuICAgICAgSW50ZWdyYXRpb246IHtcbiAgICAgICAgSW50ZWdyYXRpb25SZXNwb25zZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZXNwb25zZVBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6IFwiJ0NvbnRlbnQtVHlwZSxYLUFtei1EYXRlLEF1dGhvcml6YXRpb24sWC1BcGktS2V5LFgtQW16LVNlY3VyaXR5LVRva2VuLFgtQW16LVVzZXItQWdlbnQnXCIsXG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6IFwiJ2h0dHBzOi8vYW1hem9uLmNvbSdcIixcbiAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuVmFyeSc6IFwiJ09yaWdpbidcIixcbiAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyc6IFwiJ09QVElPTlMsR0VULFBVVCxQT1NULERFTEVURSxQQVRDSCxIRUFEJ1wiLFxuICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1NYXgtQWdlJzogYCckezYwICogNjB9J2AsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU3RhdHVzQ29kZTogJzIwNCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgUmVxdWVzdFRlbXBsYXRlczoge1xuICAgICAgICAgICdhcHBsaWNhdGlvbi9qc29uJzogJ3sgc3RhdHVzQ29kZTogMjAwIH0nLFxuICAgICAgICB9LFxuICAgICAgICBUeXBlOiAnTU9DSycsXG4gICAgICB9LFxuICAgICAgTWV0aG9kUmVzcG9uc2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZXNwb25zZVBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiB0cnVlLFxuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogdHJ1ZSxcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLlZhcnknOiB0cnVlLFxuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyc6IHRydWUsXG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1NYXgtQWdlJzogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFN0YXR1c0NvZGU6ICcyMDQnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZGlzYWJsZUNhY2hlIHdpbGwgc2V0IE1heC1BZ2UgdG8gLTEnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnYXBpJyk7XG4gICAgY29uc3QgcmVzb3VyY2UgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgnTXlSZXNvdXJjZScpO1xuXG4gICAgLy8gV0hFTlxuICAgIHJlc291cmNlLmFkZENvcnNQcmVmbGlnaHQoe1xuICAgICAgYWxsb3dPcmlnaW5zOiBbJ2h0dHBzOi8vYW1hem9uLmNvbSddLFxuICAgICAgZGlzYWJsZUNhY2hlOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIEh0dHBNZXRob2Q6ICdPUFRJT05TJyxcbiAgICAgIFJlc291cmNlSWQ6IHsgUmVmOiAnYXBpTXlSZXNvdXJjZUQ1Q0RCNDkwJyB9LFxuICAgICAgSW50ZWdyYXRpb246IHtcbiAgICAgICAgSW50ZWdyYXRpb25SZXNwb25zZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZXNwb25zZVBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6IFwiJ0NvbnRlbnQtVHlwZSxYLUFtei1EYXRlLEF1dGhvcml6YXRpb24sWC1BcGktS2V5LFgtQW16LVNlY3VyaXR5LVRva2VuLFgtQW16LVVzZXItQWdlbnQnXCIsXG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6IFwiJ2h0dHBzOi8vYW1hem9uLmNvbSdcIixcbiAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuVmFyeSc6IFwiJ09yaWdpbidcIixcbiAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyc6IFwiJ09QVElPTlMsR0VULFBVVCxQT1NULERFTEVURSxQQVRDSCxIRUFEJ1wiLFxuICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1NYXgtQWdlJzogJ1xcJy0xXFwnJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTdGF0dXNDb2RlOiAnMjA0JyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBSZXF1ZXN0VGVtcGxhdGVzOiB7XG4gICAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiAneyBzdGF0dXNDb2RlOiAyMDAgfScsXG4gICAgICAgIH0sXG4gICAgICAgIFR5cGU6ICdNT0NLJyxcbiAgICAgIH0sXG4gICAgICBNZXRob2RSZXNwb25zZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlc3BvbnNlUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6IHRydWUsXG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiB0cnVlLFxuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuVmFyeSc6IHRydWUsXG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogdHJ1ZSxcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLU1heC1BZ2UnOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgU3RhdHVzQ29kZTogJzIwNCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdtYXhBZ2UgYW5kIGRpc2FibGVDYWNoZSBhcmUgbXV0dWFsbHkgZXhjbHVzaXZlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ2FwaScpO1xuICAgIGNvbnN0IHJlc291cmNlID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ015UmVzb3VyY2UnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gcmVzb3VyY2UuYWRkQ29yc1ByZWZsaWdodCh7XG4gICAgICBhbGxvd09yaWdpbnM6IFsnaHR0cHM6Ly9hbWF6b24uY29tJ10sXG4gICAgICBkaXNhYmxlQ2FjaGU6IHRydWUsXG4gICAgICBtYXhBZ2U6IER1cmF0aW9uLnNlY29uZHMoMTApLFxuICAgIH0pKS50b1Rocm93KC9UaGUgb3B0aW9ucyBcIm1heEFnZVwiIGFuZCBcImRpc2FibGVDYWNoZVwiIGFyZSBtdXR1YWxseSBleGNsdXNpdmUvKTtcbiAgfSk7XG5cbiAgdGVzdCgnZXhwb3NlSGVhZGVycyBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IEFjY2Vzcy1Db250cm9sLUV4cG9zZS1IZWFkZXJzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ2FwaScpO1xuICAgIGNvbnN0IHJlc291cmNlID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ015UmVzb3VyY2UnKTtcblxuICAgIC8vIFdIRU5cbiAgICByZXNvdXJjZS5hZGRDb3JzUHJlZmxpZ2h0KHtcbiAgICAgIGFsbG93T3JpZ2luczogWydodHRwczovL2FtYXpvbi5jb20nXSxcbiAgICAgIGV4cG9zZUhlYWRlcnM6IFsnQXV0aG9yaXphdGlvbicsICdGb28nXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCB7XG4gICAgICBIdHRwTWV0aG9kOiAnT1BUSU9OUycsXG4gICAgICBSZXNvdXJjZUlkOiB7IFJlZjogJ2FwaU15UmVzb3VyY2VENUNEQjQ5MCcgfSxcbiAgICAgIEludGVncmF0aW9uOiB7XG4gICAgICAgIEludGVncmF0aW9uUmVzcG9uc2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVzcG9uc2VQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiBcIidDb250ZW50LVR5cGUsWC1BbXotRGF0ZSxBdXRob3JpemF0aW9uLFgtQXBpLUtleSxYLUFtei1TZWN1cml0eS1Ub2tlbixYLUFtei1Vc2VyLUFnZW50J1wiLFxuICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiBcIidodHRwczovL2FtYXpvbi5jb20nXCIsXG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLlZhcnknOiBcIidPcmlnaW4nXCIsXG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiBcIidPUFRJT05TLEdFVCxQVVQsUE9TVCxERUxFVEUsUEFUQ0gsSEVBRCdcIixcbiAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtRXhwb3NlLUhlYWRlcnMnOiBcIidBdXRob3JpemF0aW9uLEZvbydcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTdGF0dXNDb2RlOiAnMjA0JyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBSZXF1ZXN0VGVtcGxhdGVzOiB7XG4gICAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiAneyBzdGF0dXNDb2RlOiAyMDAgfScsXG4gICAgICAgIH0sXG4gICAgICAgIFR5cGU6ICdNT0NLJyxcbiAgICAgIH0sXG4gICAgICBNZXRob2RSZXNwb25zZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlc3BvbnNlUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6IHRydWUsXG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiB0cnVlLFxuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuVmFyeSc6IHRydWUsXG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogdHJ1ZSxcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUV4cG9zZS1IZWFkZXJzJzogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFN0YXR1c0NvZGU6ICcyMDQnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZGVmYXVsdENvcnNQcmVmbGlnaHRPcHRpb25zIGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgQ09SUyBmb3IgYWxsIHJlc291cmNlIHRyZWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnYXBpJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcmVzb3VyY2UgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgnTXlSZXNvdXJjZScsIHtcbiAgICAgIGRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9uczoge1xuICAgICAgICBhbGxvd09yaWdpbnM6IFsnaHR0cHM6Ly9hbWF6b24uY29tJ10sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJlc291cmNlLmFkZFJlc291cmNlKCdNeUNoaWxkUmVzb3VyY2UnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCAyKTsgLy8gb24gYm90aCByZXNvdXJjZXNcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCB7XG4gICAgICBIdHRwTWV0aG9kOiAnT1BUSU9OUycsXG4gICAgICBSZXNvdXJjZUlkOiB7IFJlZjogJ2FwaU15UmVzb3VyY2VENUNEQjQ5MCcgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCB7XG4gICAgICBIdHRwTWV0aG9kOiAnT1BUSU9OUycsXG4gICAgICBSZXNvdXJjZUlkOiB7IFJlZjogJ2FwaU15UmVzb3VyY2VNeUNoaWxkUmVzb3VyY2UyREMwMTBDNScgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZGVmYXVsdENvcnNQcmVmbGlnaHRPcHRpb25zIGNhbiBiZSBzcGVjaWZpZWQgYXQgdGhlIEFQSSBsZXZlbCB0byBhcHBseSB0byBhbGwgcmVzb3VyY2VzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ2FwaScsIHtcbiAgICAgIGRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9uczoge1xuICAgICAgICBhbGxvd09yaWdpbnM6IFsnaHR0cHM6Ly9hbWF6b24uY29tJ10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgY2hpbGQxID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ2NoaWxkMScpO1xuICAgIGNoaWxkMS5hZGRSZXNvdXJjZSgnY2hpbGQyJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywge1xuICAgICAgSHR0cE1ldGhvZDogJ09QVElPTlMnLFxuICAgICAgUmVzb3VyY2VJZDogeyAnRm46OkdldEF0dCc6IFsnYXBpQzg1NTAzMTUnLCAnUm9vdFJlc291cmNlSWQnXSB9LFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIEh0dHBNZXRob2Q6ICdPUFRJT05TJyxcbiAgICAgIFJlc291cmNlSWQ6IHsgUmVmOiAnYXBpY2hpbGQxODQxQTU4NDAnIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywge1xuICAgICAgSHR0cE1ldGhvZDogJ09QVElPTlMnLFxuICAgICAgUmVzb3VyY2VJZDogeyBSZWY6ICdhcGljaGlsZDFjaGlsZDI2QTlBN0M0NycgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnVmFyeTogT3JpZ2luIGlzIHNlbnQgYmFjayBpZiBBbGxvdy1PcmlnaW4gaXMgbm90IFwiKlwiJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ2FwaScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGFwaS5yb290LmFkZFJlc291cmNlKCdBbGxvd0FsbCcsIHtcbiAgICAgIGRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9uczoge1xuICAgICAgICBhbGxvd09yaWdpbnM6IGFwaWd3LkNvcnMuQUxMX09SSUdJTlMsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ0FsbG93U3BlY2lmaWMnLCB7XG4gICAgICBkZWZhdWx0Q29yc1ByZWZsaWdodE9wdGlvbnM6IHtcbiAgICAgICAgYWxsb3dPcmlnaW5zOiBbJ2h0dHA6Ly9zcGVjaWZpYy5jb20nXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOQlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIFJlc291cmNlSWQ6IHtcbiAgICAgICAgUmVmOiAnYXBpQWxsb3dBbGwyRjVCQzU2NCcsXG4gICAgICB9LFxuICAgICAgSW50ZWdyYXRpb246IHtcbiAgICAgICAgSW50ZWdyYXRpb25SZXNwb25zZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZXNwb25zZVBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6IFwiJ0NvbnRlbnQtVHlwZSxYLUFtei1EYXRlLEF1dGhvcml6YXRpb24sWC1BcGktS2V5LFgtQW16LVNlY3VyaXR5LVRva2VuLFgtQW16LVVzZXItQWdlbnQnXCIsXG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6IFwiJyonXCIsXG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiBcIidPUFRJT05TLEdFVCxQVVQsUE9TVCxERUxFVEUsUEFUQ0gsSEVBRCdcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTdGF0dXNDb2RlOiAnMjA0JyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBSZXF1ZXN0VGVtcGxhdGVzOiB7XG4gICAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiAneyBzdGF0dXNDb2RlOiAyMDAgfScsXG4gICAgICAgIH0sXG4gICAgICAgIFR5cGU6ICdNT0NLJyxcbiAgICAgIH0sXG4gICAgICBNZXRob2RSZXNwb25zZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlc3BvbnNlUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6IHRydWUsXG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiB0cnVlLFxuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyc6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBTdGF0dXNDb2RlOiAnMjA0JyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywge1xuICAgICAgUmVzb3VyY2VJZDoge1xuICAgICAgICBSZWY6ICdhcGlBbGxvd1NwZWNpZmljNzdERDhBRjEnLFxuICAgICAgfSxcbiAgICAgIEludGVncmF0aW9uOiB7XG4gICAgICAgIEludGVncmF0aW9uUmVzcG9uc2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVzcG9uc2VQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiBcIidDb250ZW50LVR5cGUsWC1BbXotRGF0ZSxBdXRob3JpemF0aW9uLFgtQXBpLUtleSxYLUFtei1TZWN1cml0eS1Ub2tlbixYLUFtei1Vc2VyLUFnZW50J1wiLFxuICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiBcIidodHRwOi8vc3BlY2lmaWMuY29tJ1wiLFxuICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogXCInT1BUSU9OUyxHRVQsUFVULFBPU1QsREVMRVRFLFBBVENILEhFQUQnXCIsXG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLlZhcnknOiBcIidPcmlnaW4nXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU3RhdHVzQ29kZTogJzIwNCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgUmVxdWVzdFRlbXBsYXRlczoge1xuICAgICAgICAgICdhcHBsaWNhdGlvbi9qc29uJzogJ3sgc3RhdHVzQ29kZTogMjAwIH0nLFxuICAgICAgICB9LFxuICAgICAgICBUeXBlOiAnTU9DSycsXG4gICAgICB9LFxuICAgICAgTWV0aG9kUmVzcG9uc2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZXNwb25zZVBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiB0cnVlLFxuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogdHJ1ZSxcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiB0cnVlLFxuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuVmFyeSc6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBTdGF0dXNDb2RlOiAnMjA0JyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0lmIFwiKlwiIGlzIHNwZWNpZmllZCBpbiBhbGxvdy1vcmlnaW4sIGl0IGNhbm5vdCBiZSBtaXhlZCB3aXRoIHNwZWNpZmljIG9yaWdpbnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnYXBpJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgZXhwZWN0KCgpID0+IGFwaS5yb290LmFkZFJlc291cmNlKCdBbGxvd0FsbCcsIHtcbiAgICAgIGRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9uczoge1xuICAgICAgICBhbGxvd09yaWdpbnM6IFsnaHR0cHM6Ly9ibGEuY29tJywgJyonLCAnaHR0cHM6Ly9zcGVjaWZpYyddLFxuICAgICAgfSxcbiAgICB9KSkudG9UaHJvdygvSW52YWxpZCBcImFsbG93T3JpZ2luc1wiIC0gY2Fubm90IG1peCBcIlxcKlwiIHdpdGggc3BlY2lmaWMgb3JpZ2luczogaHR0cHM6XFwvXFwvYmxhXFwuY29tLFxcKixodHRwczpcXC9cXC9zcGVjaWZpYy8pO1xuICB9KTtcblxuICB0ZXN0KCdkZWZhdWx0Q29yc1ByZWZsaWdodE9wdGlvbnMgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSBDT1JTIGZvciBhbGwgcmVzb3VyY2UgdHJlZSBbTGFtYmRhUmVzdEFwaV0nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgaGFuZGxlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdoYW5kbGVyJywge1xuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnYm9vbScpLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGFwaWd3LkxhbWJkYVJlc3RBcGkoc3RhY2ssICdsYW1iZGEtcmVzdC1hcGknLCB7XG4gICAgICBoYW5kbGVyLFxuICAgICAgZGVmYXVsdENvcnNQcmVmbGlnaHRPcHRpb25zOiB7XG4gICAgICAgIGFsbG93T3JpZ2luczogWydodHRwczovL2FtYXpvbi5jb20nXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywgNCk7IC8vIHR3byBBTlkgYW5kIHR3byBPUFRJT05TIHJlc291cmNlc1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIEh0dHBNZXRob2Q6ICdPUFRJT05TJyxcbiAgICAgIFJlc291cmNlSWQ6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ2xhbWJkYXJlc3RhcGlBQUQxMDkyNCcsXG4gICAgICAgICAgJ1Jvb3RSZXNvdXJjZUlkJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywge1xuICAgICAgSHR0cE1ldGhvZDogJ09QVElPTlMnLFxuICAgICAgUmVzb3VyY2VJZDoge1xuICAgICAgICBSZWY6ICdsYW1iZGFyZXN0YXBpcHJveHlFM0FFMDdFMycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdDT1JTIGFuZCBwcm94eSByZXNvdXJjZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnQVBJJywge1xuICAgICAgZGVmYXVsdENvcnNQcmVmbGlnaHRPcHRpb25zOiB7IGFsbG93T3JpZ2luczogWycqJ10gfSxcbiAgICB9KTtcblxuICAgIGFwaS5yb290LmFkZFByb3h5KCk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywge1xuICAgICAgSHR0cE1ldGhvZDogJ09QVElPTlMnLFxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19