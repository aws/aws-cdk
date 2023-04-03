"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/core");
const apigw = require("../lib");
describe('lambda api', () => {
    test('LambdaRestApi defines a REST API with Lambda proxy integration', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const handler = new lambda.Function(stack, 'handler', {
            handler: 'index.handler',
            code: lambda.Code.fromInline('boom'),
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        // WHEN
        const api = new apigw.LambdaRestApi(stack, 'lambda-rest-api', { handler });
        // THEN -- can't customize further
        expect(() => {
            api.root.addResource('cant-touch-this');
        }).toThrow();
        // THEN -- template proxies everything
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', {
            PathPart: '{proxy+}',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'ANY',
            ResourceId: {
                Ref: 'lambdarestapiproxyE3AE07E3',
            },
            RestApiId: {
                Ref: 'lambdarestapiAAD10924',
            },
            AuthorizationType: 'NONE',
            Integration: {
                IntegrationHttpMethod: 'POST',
                Type: 'AWS_PROXY',
                Uri: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {
                                Ref: 'AWS::Partition',
                            },
                            ':apigateway:',
                            {
                                Ref: 'AWS::Region',
                            },
                            ':lambda:path/2015-03-31/functions/',
                            {
                                'Fn::GetAtt': [
                                    'handlerE1533BD5',
                                    'Arn',
                                ],
                            },
                            '/invocations',
                        ],
                    ],
                },
            },
        });
    });
    test('LambdaRestApi supports function Alias', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const handler = new lambda.Function(stack, 'handler', {
            handler: 'index.handler',
            code: lambda.Code.fromInline('boom'),
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const alias = new lambda.Alias(stack, 'alias', {
            aliasName: 'my-alias',
            version: new lambda.Version(stack, 'version', {
                lambda: handler,
            }),
        });
        // WHEN
        const api = new apigw.LambdaRestApi(stack, 'lambda-rest-api', { handler: alias });
        // THEN -- can't customize further
        expect(() => {
            api.root.addResource('cant-touch-this');
        }).toThrow();
        // THEN -- template proxies everything
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', {
            PathPart: '{proxy+}',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'ANY',
            ResourceId: {
                Ref: 'lambdarestapiproxyE3AE07E3',
            },
            RestApiId: {
                Ref: 'lambdarestapiAAD10924',
            },
            AuthorizationType: 'NONE',
            Integration: {
                IntegrationHttpMethod: 'POST',
                Type: 'AWS_PROXY',
                Uri: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {
                                Ref: 'AWS::Partition',
                            },
                            ':apigateway:',
                            {
                                Ref: 'AWS::Region',
                            },
                            ':lambda:path/2015-03-31/functions/',
                            {
                                Ref: 'alias68BF17F5',
                            },
                            '/invocations',
                        ],
                    ],
                },
            },
        });
    });
    test('when "proxy" is set to false, users need to define the model', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const handler = new lambda.Function(stack, 'handler', {
            handler: 'index.handler',
            code: lambda.Code.fromInline('boom'),
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        // WHEN
        const api = new apigw.LambdaRestApi(stack, 'lambda-rest-api', { handler, proxy: false });
        const tasks = api.root.addResource('tasks');
        tasks.addMethod('GET');
        tasks.addMethod('POST');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', assertions_1.Match.not({
            PathPart: '{proxy+}',
        }));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', {
            PathPart: 'tasks',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'GET',
            ResourceId: { Ref: 'lambdarestapitasks224418C8' },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'POST',
            ResourceId: { Ref: 'lambdarestapitasks224418C8' },
        });
    });
    test('when "proxy" is false, AWS_PROXY is still used', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const handler = new lambda.Function(stack, 'handler', {
            handler: 'index.handler',
            code: lambda.Code.fromInline('boom'),
            runtime: lambda.Runtime.NODEJS_10_X,
        });
        // WHEN
        const api = new apigw.LambdaRestApi(stack, 'lambda-rest-api', { handler, proxy: false });
        const tasks = api.root.addResource('tasks');
        tasks.addMethod('GET');
        tasks.addMethod('POST');
        // THEN
        const template = assertions_1.Template.fromStack(stack);
        // Ensure that all methods have "AWS_PROXY" integrations.
        const methods = template.findResources('AWS::ApiGateway::Mathod');
        const hasProxyIntegration = assertions_1.Match.objectLike({ Integration: assertions_1.Match.objectLike({ Type: 'AWS_PROXY' }) });
        for (const method of Object.values(methods)) {
            expect(hasProxyIntegration.test(method)).toBeTruthy();
        }
    });
    test('fails if options.defaultIntegration is also set', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const handler = new lambda.Function(stack, 'handler', {
            handler: 'index.handler',
            code: lambda.Code.fromInline('boom'),
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        expect(() => new apigw.LambdaRestApi(stack, 'lambda-rest-api', {
            handler,
            defaultIntegration: new apigw.HttpIntegration('https://foo/bar'),
        })).toThrow(/Cannot specify \"defaultIntegration\" since Lambda integration is automatically defined/);
        expect(() => new apigw.LambdaRestApi(stack, 'lambda-rest-api', {
            handler,
            defaultIntegration: new apigw.HttpIntegration('https://foo/bar'),
        })).toThrow(/Cannot specify \"defaultIntegration\" since Lambda integration is automatically defined/);
    });
    test('LambdaRestApi defines a REST API with CORS enabled', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const handler = new lambda.Function(stack, 'handler', {
            handler: 'index.handler',
            code: lambda.Code.fromInline('boom'),
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        // WHEN
        new apigw.LambdaRestApi(stack, 'lambda-rest-api', {
            handler,
            defaultCorsPreflightOptions: {
                allowOrigins: ['https://aws.amazon.com'],
                allowMethods: ['GET', 'PUT'],
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'OPTIONS',
            ResourceId: { Ref: 'lambdarestapiproxyE3AE07E3' },
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
    test('LambdaRestApi defines a REST API with CORS enabled and defaultMethodOptions', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const handler = new lambda.Function(stack, 'handler', {
            handler: 'index.handler',
            code: lambda.Code.fromInline('boom'),
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        // WHEN
        new apigw.LambdaRestApi(stack, 'lambda-rest-api', {
            handler,
            defaultMethodOptions: {
                authorizationType: apigw.AuthorizationType.IAM,
            },
            defaultCorsPreflightOptions: {
                allowOrigins: ['https://aws.amazon.com'],
                allowMethods: ['GET', 'PUT'],
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'OPTIONS',
            ResourceId: { Ref: 'lambdarestapiproxyE3AE07E3' },
            AuthorizationType: 'NONE',
            AuthorizerId: assertions_1.Match.absent(),
            ApiKeyRequired: assertions_1.Match.absent(),
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
    test('LambdaRestApi allows passing GENERATE_IF_NEEDED as the physical name', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new apigw.LambdaRestApi(stack, 'lambda-rest-api', {
            handler: new lambda.Function(stack, 'handler', {
                handler: 'index.handler',
                code: lambda.Code.fromInline('boom'),
                runtime: lambda.Runtime.NODEJS_14_X,
            }),
            restApiName: cdk.PhysicalName.GENERATE_IF_NEEDED,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
            Name: assertions_1.Match.absent(),
        });
    });
    test('provided integrationOptions are applied', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const handler = new lambda.Function(stack, 'handler', {
            handler: 'index.handler',
            code: lambda.Code.fromInline('boom'),
            runtime: lambda.Runtime.NODEJS_10_X,
        });
        // WHEN
        new apigw.LambdaRestApi(stack, 'lamda-rest-api', {
            handler,
            integrationOptions: {
                timeout: cdk.Duration.seconds(1),
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            Integration: {
                TimeoutInMillis: 1000,
                Type: 'AWS_PROXY',
            },
        });
    });
    test('setting integrationOptions.proxy to false retains {proxy+} path part', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const handler = new lambda.Function(stack, 'handler', {
            handler: 'index.handler',
            code: lambda.Code.fromInline('boom'),
            runtime: lambda.Runtime.NODEJS_10_X,
        });
        // WHEN
        new apigw.LambdaRestApi(stack, 'lamda-rest-api', {
            handler,
            integrationOptions: {
                proxy: false,
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', {
            PathPart: '{proxy+}',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            Integration: {
                Type: 'AWS',
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLWFwaS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGFtYmRhLWFwaS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELDhDQUE4QztBQUM5QyxxQ0FBcUM7QUFDckMsZ0NBQWdDO0FBRWhDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBQzFCLElBQUksQ0FBQyxnRUFBZ0UsRUFBRSxHQUFHLEVBQUU7UUFDMUUsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTlCLE1BQU0sT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ3BELE9BQU8sRUFBRSxlQUFlO1lBQ3hCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7WUFDcEMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztTQUNwQyxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFFM0Usa0NBQWtDO1FBQ2xDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDVixHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRWIsc0NBQXNDO1FBQ3RDLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDJCQUEyQixFQUFFO1lBQzNFLFFBQVEsRUFBRSxVQUFVO1NBQ3JCLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHlC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IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgYXBpZ3cgZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ2xhbWJkYSBhcGknLCAoKSA9PiB7XG4gIHRlc3QoJ0xhbWJkYVJlc3RBcGkgZGVmaW5lcyBhIFJFU1QgQVBJIHdpdGggTGFtYmRhIHByb3h5IGludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBoYW5kbGVyID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ2hhbmRsZXInLCB7XG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdib29tJyksXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuTGFtYmRhUmVzdEFwaShzdGFjaywgJ2xhbWJkYS1yZXN0LWFwaScsIHsgaGFuZGxlciB9KTtcblxuICAgIC8vIFRIRU4gLS0gY2FuJ3QgY3VzdG9taXplIGZ1cnRoZXJcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ2NhbnQtdG91Y2gtdGhpcycpO1xuICAgIH0pLnRvVGhyb3coKTtcblxuICAgIC8vIFRIRU4gLS0gdGVtcGxhdGUgcHJveGllcyBldmVyeXRoaW5nXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6UmVzb3VyY2UnLCB7XG4gICAgICBQYXRoUGFydDogJ3twcm94eSt9JyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIEh0dHBNZXRob2Q6ICdBTlknLFxuICAgICAgUmVzb3VyY2VJZDoge1xuICAgICAgICBSZWY6ICdsYW1iZGFyZXN0YXBpcHJveHlFM0FFMDdFMycsXG4gICAgICB9LFxuICAgICAgUmVzdEFwaUlkOiB7XG4gICAgICAgIFJlZjogJ2xhbWJkYXJlc3RhcGlBQUQxMDkyNCcsXG4gICAgICB9LFxuICAgICAgQXV0aG9yaXphdGlvblR5cGU6ICdOT05FJyxcbiAgICAgIEludGVncmF0aW9uOiB7XG4gICAgICAgIEludGVncmF0aW9uSHR0cE1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBUeXBlOiAnQVdTX1BST1hZJyxcbiAgICAgICAgVXJpOiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJzphcGlnYXRld2F5OicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICc6bGFtYmRhOnBhdGgvMjAxNS0wMy0zMS9mdW5jdGlvbnMvJyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ2hhbmRsZXJFMTUzM0JENScsXG4gICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnL2ludm9jYXRpb25zJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0xhbWJkYVJlc3RBcGkgc3VwcG9ydHMgZnVuY3Rpb24gQWxpYXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnaGFuZGxlcicsIHtcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2Jvb20nKSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIH0pO1xuICAgIGNvbnN0IGFsaWFzID0gbmV3IGxhbWJkYS5BbGlhcyhzdGFjaywgJ2FsaWFzJywge1xuICAgICAgYWxpYXNOYW1lOiAnbXktYWxpYXMnLFxuICAgICAgdmVyc2lvbjogbmV3IGxhbWJkYS5WZXJzaW9uKHN0YWNrLCAndmVyc2lvbicsIHtcbiAgICAgICAgbGFtYmRhOiBoYW5kbGVyLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LkxhbWJkYVJlc3RBcGkoc3RhY2ssICdsYW1iZGEtcmVzdC1hcGknLCB7IGhhbmRsZXI6IGFsaWFzIH0pO1xuXG4gICAgLy8gVEhFTiAtLSBjYW4ndCBjdXN0b21pemUgZnVydGhlclxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBhcGkucm9vdC5hZGRSZXNvdXJjZSgnY2FudC10b3VjaC10aGlzJyk7XG4gICAgfSkudG9UaHJvdygpO1xuXG4gICAgLy8gVEhFTiAtLSB0ZW1wbGF0ZSBwcm94aWVzIGV2ZXJ5dGhpbmdcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpSZXNvdXJjZScsIHtcbiAgICAgIFBhdGhQYXJ0OiAne3Byb3h5K30nLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywge1xuICAgICAgSHR0cE1ldGhvZDogJ0FOWScsXG4gICAgICBSZXNvdXJjZUlkOiB7XG4gICAgICAgIFJlZjogJ2xhbWJkYXJlc3RhcGlwcm94eUUzQUUwN0UzJyxcbiAgICAgIH0sXG4gICAgICBSZXN0QXBpSWQ6IHtcbiAgICAgICAgUmVmOiAnbGFtYmRhcmVzdGFwaUFBRDEwOTI0JyxcbiAgICAgIH0sXG4gICAgICBBdXRob3JpemF0aW9uVHlwZTogJ05PTkUnLFxuICAgICAgSW50ZWdyYXRpb246IHtcbiAgICAgICAgSW50ZWdyYXRpb25IdHRwTWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIFR5cGU6ICdBV1NfUFJPWFknLFxuICAgICAgICBVcmk6IHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnOmFwaWdhdGV3YXk6JyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJzpsYW1iZGE6cGF0aC8yMDE1LTAzLTMxL2Z1bmN0aW9ucy8nLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnYWxpYXM2OEJGMTdGNScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICcvaW52b2NhdGlvbnMnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnd2hlbiBcInByb3h5XCIgaXMgc2V0IHRvIGZhbHNlLCB1c2VycyBuZWVkIHRvIGRlZmluZSB0aGUgbW9kZWwnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnaGFuZGxlcicsIHtcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2Jvb20nKSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5MYW1iZGFSZXN0QXBpKHN0YWNrLCAnbGFtYmRhLXJlc3QtYXBpJywgeyBoYW5kbGVyLCBwcm94eTogZmFsc2UgfSk7XG5cbiAgICBjb25zdCB0YXNrcyA9IGFwaS5yb290LmFkZFJlc291cmNlKCd0YXNrcycpO1xuICAgIHRhc2tzLmFkZE1ldGhvZCgnR0VUJyk7XG4gICAgdGFza3MuYWRkTWV0aG9kKCdQT1NUJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6UmVzb3VyY2UnLCBNYXRjaC5ub3Qoe1xuICAgICAgUGF0aFBhcnQ6ICd7cHJveHkrfScsXG4gICAgfSkpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6UmVzb3VyY2UnLCB7XG4gICAgICBQYXRoUGFydDogJ3Rhc2tzJyxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIEh0dHBNZXRob2Q6ICdHRVQnLFxuICAgICAgUmVzb3VyY2VJZDogeyBSZWY6ICdsYW1iZGFyZXN0YXBpdGFza3MyMjQ0MThDOCcgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIEh0dHBNZXRob2Q6ICdQT1NUJyxcbiAgICAgIFJlc291cmNlSWQ6IHsgUmVmOiAnbGFtYmRhcmVzdGFwaXRhc2tzMjI0NDE4QzgnIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3doZW4gXCJwcm94eVwiIGlzIGZhbHNlLCBBV1NfUFJPWFkgaXMgc3RpbGwgdXNlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgaGFuZGxlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdoYW5kbGVyJywge1xuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnYm9vbScpLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzEwX1gsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LkxhbWJkYVJlc3RBcGkoc3RhY2ssICdsYW1iZGEtcmVzdC1hcGknLCB7IGhhbmRsZXIsIHByb3h5OiBmYWxzZSB9KTtcblxuICAgIGNvbnN0IHRhc2tzID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ3Rhc2tzJyk7XG4gICAgdGFza3MuYWRkTWV0aG9kKCdHRVQnKTtcbiAgICB0YXNrcy5hZGRNZXRob2QoJ1BPU1QnKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgLy8gRW5zdXJlIHRoYXQgYWxsIG1ldGhvZHMgaGF2ZSBcIkFXU19QUk9YWVwiIGludGVncmF0aW9ucy5cbiAgICBjb25zdCBtZXRob2RzID0gdGVtcGxhdGUuZmluZFJlc291cmNlcygnQVdTOjpBcGlHYXRld2F5OjpNYXRob2QnKTtcbiAgICBjb25zdCBoYXNQcm94eUludGVncmF0aW9uID0gTWF0Y2gub2JqZWN0TGlrZSh7IEludGVncmF0aW9uOiBNYXRjaC5vYmplY3RMaWtlKHsgVHlwZTogJ0FXU19QUk9YWScgfSkgfSk7XG4gICAgZm9yIChjb25zdCBtZXRob2Qgb2YgT2JqZWN0LnZhbHVlcyhtZXRob2RzKSkge1xuICAgICAgZXhwZWN0KGhhc1Byb3h5SW50ZWdyYXRpb24udGVzdChtZXRob2QpKS50b0JlVHJ1dGh5KCk7XG4gICAgfVxuICB9KTtcblxuICB0ZXN0KCdmYWlscyBpZiBvcHRpb25zLmRlZmF1bHRJbnRlZ3JhdGlvbiBpcyBhbHNvIHNldCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgaGFuZGxlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdoYW5kbGVyJywge1xuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnYm9vbScpLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IGFwaWd3LkxhbWJkYVJlc3RBcGkoc3RhY2ssICdsYW1iZGEtcmVzdC1hcGknLCB7XG4gICAgICBoYW5kbGVyLFxuICAgICAgZGVmYXVsdEludGVncmF0aW9uOiBuZXcgYXBpZ3cuSHR0cEludGVncmF0aW9uKCdodHRwczovL2Zvby9iYXInKSxcbiAgICB9KSkudG9UaHJvdygvQ2Fubm90IHNwZWNpZnkgXFxcImRlZmF1bHRJbnRlZ3JhdGlvblxcXCIgc2luY2UgTGFtYmRhIGludGVncmF0aW9uIGlzIGF1dG9tYXRpY2FsbHkgZGVmaW5lZC8pO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBhcGlndy5MYW1iZGFSZXN0QXBpKHN0YWNrLCAnbGFtYmRhLXJlc3QtYXBpJywge1xuICAgICAgaGFuZGxlcixcbiAgICAgIGRlZmF1bHRJbnRlZ3JhdGlvbjogbmV3IGFwaWd3Lkh0dHBJbnRlZ3JhdGlvbignaHR0cHM6Ly9mb28vYmFyJyksXG4gICAgfSkpLnRvVGhyb3coL0Nhbm5vdCBzcGVjaWZ5IFxcXCJkZWZhdWx0SW50ZWdyYXRpb25cXFwiIHNpbmNlIExhbWJkYSBpbnRlZ3JhdGlvbiBpcyBhdXRvbWF0aWNhbGx5IGRlZmluZWQvKTtcbiAgfSk7XG5cbiAgdGVzdCgnTGFtYmRhUmVzdEFwaSBkZWZpbmVzIGEgUkVTVCBBUEkgd2l0aCBDT1JTIGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnaGFuZGxlcicsIHtcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2Jvb20nKSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBhcGlndy5MYW1iZGFSZXN0QXBpKHN0YWNrLCAnbGFtYmRhLXJlc3QtYXBpJywge1xuICAgICAgaGFuZGxlcixcbiAgICAgIGRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9uczoge1xuICAgICAgICBhbGxvd09yaWdpbnM6IFsnaHR0cHM6Ly9hd3MuYW1hem9uLmNvbSddLFxuICAgICAgICBhbGxvd01ldGhvZHM6IFsnR0VUJywgJ1BVVCddLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCB7XG4gICAgICBIdHRwTWV0aG9kOiAnT1BUSU9OUycsXG4gICAgICBSZXNvdXJjZUlkOiB7IFJlZjogJ2xhbWJkYXJlc3RhcGlwcm94eUUzQUUwN0UzJyB9LFxuICAgICAgSW50ZWdyYXRpb246IHtcbiAgICAgICAgSW50ZWdyYXRpb25SZXNwb25zZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZXNwb25zZVBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6IFwiJ0NvbnRlbnQtVHlwZSxYLUFtei1EYXRlLEF1dGhvcml6YXRpb24sWC1BcGktS2V5LFgtQW16LVNlY3VyaXR5LVRva2VuLFgtQW16LVVzZXItQWdlbnQnXCIsXG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6IFwiJ2h0dHBzOi8vYXdzLmFtYXpvbi5jb20nXCIsXG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLlZhcnknOiBcIidPcmlnaW4nXCIsXG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiBcIidHRVQsUFVUJ1wiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFN0YXR1c0NvZGU6ICcyMDQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFJlcXVlc3RUZW1wbGF0ZXM6IHtcbiAgICAgICAgICAnYXBwbGljYXRpb24vanNvbic6ICd7IHN0YXR1c0NvZGU6IDIwMCB9JyxcbiAgICAgICAgfSxcbiAgICAgICAgVHlwZTogJ01PQ0snLFxuICAgICAgfSxcbiAgICAgIE1ldGhvZFJlc3BvbnNlczogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVzcG9uc2VQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJzogdHJ1ZSxcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6IHRydWUsXG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5WYXJ5JzogdHJ1ZSxcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHMnOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgU3RhdHVzQ29kZTogJzIwNCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdMYW1iZGFSZXN0QXBpIGRlZmluZXMgYSBSRVNUIEFQSSB3aXRoIENPUlMgZW5hYmxlZCBhbmQgZGVmYXVsdE1ldGhvZE9wdGlvbnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnaGFuZGxlcicsIHtcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2Jvb20nKSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBhcGlndy5MYW1iZGFSZXN0QXBpKHN0YWNrLCAnbGFtYmRhLXJlc3QtYXBpJywge1xuICAgICAgaGFuZGxlcixcbiAgICAgIGRlZmF1bHRNZXRob2RPcHRpb25zOiB7XG4gICAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBhcGlndy5BdXRob3JpemF0aW9uVHlwZS5JQU0sXG4gICAgICB9LFxuICAgICAgZGVmYXVsdENvcnNQcmVmbGlnaHRPcHRpb25zOiB7XG4gICAgICAgIGFsbG93T3JpZ2luczogWydodHRwczovL2F3cy5hbWF6b24uY29tJ10sXG4gICAgICAgIGFsbG93TWV0aG9kczogWydHRVQnLCAnUFVUJ10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIEh0dHBNZXRob2Q6ICdPUFRJT05TJyxcbiAgICAgIFJlc291cmNlSWQ6IHsgUmVmOiAnbGFtYmRhcmVzdGFwaXByb3h5RTNBRTA3RTMnIH0sXG4gICAgICBBdXRob3JpemF0aW9uVHlwZTogJ05PTkUnLFxuICAgICAgQXV0aG9yaXplcklkOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgIEFwaUtleVJlcXVpcmVkOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgIEludGVncmF0aW9uOiB7XG4gICAgICAgIEludGVncmF0aW9uUmVzcG9uc2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVzcG9uc2VQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnOiBcIidDb250ZW50LVR5cGUsWC1BbXotRGF0ZSxBdXRob3JpemF0aW9uLFgtQXBpLUtleSxYLUFtei1TZWN1cml0eS1Ub2tlbixYLUFtei1Vc2VyLUFnZW50J1wiLFxuICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiBcIidodHRwczovL2F3cy5hbWF6b24uY29tJ1wiLFxuICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5WYXJ5JzogXCInT3JpZ2luJ1wiLFxuICAgICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogXCInR0VULFBVVCdcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTdGF0dXNDb2RlOiAnMjA0JyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBSZXF1ZXN0VGVtcGxhdGVzOiB7XG4gICAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiAneyBzdGF0dXNDb2RlOiAyMDAgfScsXG4gICAgICAgIH0sXG4gICAgICAgIFR5cGU6ICdNT0NLJyxcbiAgICAgIH0sXG4gICAgICBNZXRob2RSZXNwb25zZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlc3BvbnNlUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyc6IHRydWUsXG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4nOiB0cnVlLFxuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuVmFyeSc6IHRydWUsXG4gICAgICAgICAgICAnbWV0aG9kLnJlc3BvbnNlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzJzogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFN0YXR1c0NvZGU6ICcyMDQnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnTGFtYmRhUmVzdEFwaSBhbGxvd3MgcGFzc2luZyBHRU5FUkFURV9JRl9ORUVERUQgYXMgdGhlIHBoeXNpY2FsIG5hbWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgYXBpZ3cuTGFtYmRhUmVzdEFwaShzdGFjaywgJ2xhbWJkYS1yZXN0LWFwaScsIHtcbiAgICAgIGhhbmRsZXI6IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdoYW5kbGVyJywge1xuICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2Jvb20nKSxcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICB9KSxcbiAgICAgIHJlc3RBcGlOYW1lOiBjZGsuUGh5c2ljYWxOYW1lLkdFTkVSQVRFX0lGX05FRURFRCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpSZXN0QXBpJywge1xuICAgICAgTmFtZTogTWF0Y2guYWJzZW50KCksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Byb3ZpZGVkIGludGVncmF0aW9uT3B0aW9ucyBhcmUgYXBwbGllZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgaGFuZGxlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdoYW5kbGVyJywge1xuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnYm9vbScpLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzEwX1gsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGFwaWd3LkxhbWJkYVJlc3RBcGkoc3RhY2ssICdsYW1kYS1yZXN0LWFwaScsIHtcbiAgICAgIGhhbmRsZXIsXG4gICAgICBpbnRlZ3JhdGlvbk9wdGlvbnM6IHtcbiAgICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMSksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIEludGVncmF0aW9uOiB7XG4gICAgICAgIFRpbWVvdXRJbk1pbGxpczogMTAwMCxcbiAgICAgICAgVHlwZTogJ0FXU19QUk9YWScsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzZXR0aW5nIGludGVncmF0aW9uT3B0aW9ucy5wcm94eSB0byBmYWxzZSByZXRhaW5zIHtwcm94eSt9IHBhdGggcGFydCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgaGFuZGxlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdoYW5kbGVyJywge1xuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnYm9vbScpLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzEwX1gsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGFwaWd3LkxhbWJkYVJlc3RBcGkoc3RhY2ssICdsYW1kYS1yZXN0LWFwaScsIHtcbiAgICAgIGhhbmRsZXIsXG4gICAgICBpbnRlZ3JhdGlvbk9wdGlvbnM6IHtcbiAgICAgICAgcHJveHk6IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpSZXNvdXJjZScsIHtcbiAgICAgIFBhdGhQYXJ0OiAne3Byb3h5K30nLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIEludGVncmF0aW9uOiB7XG4gICAgICAgIFR5cGU6ICdBV1MnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==