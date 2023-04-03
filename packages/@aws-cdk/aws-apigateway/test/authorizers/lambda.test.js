"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../../lib");
describe('lambda authorizer', () => {
    test('default token authorizer', () => {
        const stack = new core_1.Stack();
        const func = new lambda.Function(stack, 'myfunction', {
            handler: 'handler',
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const auth = new lib_1.TokenAuthorizer(stack, 'myauthorizer', {
            handler: func,
        });
        const restApi = new lib_1.RestApi(stack, 'myrestapi');
        restApi.root.addMethod('ANY', undefined, {
            authorizer: auth,
            authorizationType: lib_1.AuthorizationType.CUSTOM,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Authorizer', {
            Type: 'TOKEN',
            RestApiId: stack.resolve(restApi.restApiId),
            IdentitySource: 'method.request.header.Authorization',
            AuthorizerUri: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        {
                            'Fn::Select': [
                                1,
                                {
                                    'Fn::Split': [
                                        ':',
                                        {
                                            'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                                        },
                                    ],
                                },
                            ],
                        },
                        ':apigateway:',
                        {
                            'Fn::Select': [
                                3,
                                {
                                    'Fn::Split': [
                                        ':',
                                        {
                                            'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                                        },
                                    ],
                                },
                            ],
                        },
                        ':lambda:path/2015-03-31/functions/',
                        {
                            'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                        },
                        '/invocations',
                    ],
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
            Action: 'lambda:InvokeFunction',
            Principal: 'apigateway.amazonaws.com',
        });
        expect(auth.authorizerArn.endsWith(`/authorizers/${auth.authorizerId}`)).toBeTruthy();
    });
    test('default request authorizer', () => {
        const stack = new core_1.Stack();
        const func = new lambda.Function(stack, 'myfunction', {
            handler: 'handler',
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const auth = new lib_1.RequestAuthorizer(stack, 'myauthorizer', {
            handler: func,
            resultsCacheTtl: core_1.Duration.seconds(0),
            identitySources: [],
        });
        const restApi = new lib_1.RestApi(stack, 'myrestapi');
        restApi.root.addMethod('ANY', undefined, {
            authorizer: auth,
            authorizationType: lib_1.AuthorizationType.CUSTOM,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Authorizer', {
            Type: 'REQUEST',
            RestApiId: stack.resolve(restApi.restApiId),
            AuthorizerUri: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        {
                            'Fn::Select': [
                                1,
                                {
                                    'Fn::Split': [
                                        ':',
                                        {
                                            'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                                        },
                                    ],
                                },
                            ],
                        },
                        ':apigateway:',
                        {
                            'Fn::Select': [
                                3,
                                {
                                    'Fn::Split': [
                                        ':',
                                        {
                                            'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                                        },
                                    ],
                                },
                            ],
                        },
                        ':lambda:path/2015-03-31/functions/',
                        {
                            'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                        },
                        '/invocations',
                    ],
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
            Action: 'lambda:InvokeFunction',
            Principal: 'apigateway.amazonaws.com',
        });
        expect(auth.authorizerArn.endsWith(`/authorizers/${auth.authorizerId}`)).toBeTruthy();
    });
    test('invalid request authorizer config', () => {
        const stack = new core_1.Stack();
        const func = new lambda.Function(stack, 'myfunction', {
            handler: 'handler',
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        expect(() => new lib_1.RequestAuthorizer(stack, 'myauthorizer', {
            handler: func,
            resultsCacheTtl: core_1.Duration.seconds(1),
            identitySources: [],
        })).toThrow('At least one Identity Source is required for a REQUEST-based Lambda authorizer if caching is enabled.');
    });
    test('token authorizer with all parameters specified', () => {
        const stack = new core_1.Stack();
        const func = new lambda.Function(stack, 'myfunction', {
            handler: 'handler',
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const auth = new lib_1.TokenAuthorizer(stack, 'myauthorizer', {
            handler: func,
            identitySource: 'method.request.header.whoami',
            validationRegex: 'a-hacker',
            authorizerName: 'myauthorizer',
            resultsCacheTtl: core_1.Duration.minutes(1),
        });
        const restApi = new lib_1.RestApi(stack, 'myrestapi');
        restApi.root.addMethod('ANY', undefined, {
            authorizer: auth,
            authorizationType: lib_1.AuthorizationType.CUSTOM,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Authorizer', {
            Type: 'TOKEN',
            RestApiId: stack.resolve(restApi.restApiId),
            IdentitySource: 'method.request.header.whoami',
            IdentityValidationExpression: 'a-hacker',
            Name: 'myauthorizer',
            AuthorizerResultTtlInSeconds: 60,
            AuthorizerUri: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        {
                            'Fn::Select': [
                                1,
                                {
                                    'Fn::Split': [
                                        ':',
                                        {
                                            'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                                        },
                                    ],
                                },
                            ],
                        },
                        ':apigateway:',
                        {
                            'Fn::Select': [
                                3,
                                {
                                    'Fn::Split': [
                                        ':',
                                        {
                                            'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                                        },
                                    ],
                                },
                            ],
                        },
                        ':lambda:path/2015-03-31/functions/',
                        {
                            'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                        },
                        '/invocations',
                    ],
                ],
            },
        });
    });
    test('request authorizer with all parameters specified', () => {
        const stack = new core_1.Stack();
        const func = new lambda.Function(stack, 'myfunction', {
            handler: 'handler',
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const auth = new lib_1.RequestAuthorizer(stack, 'myauthorizer', {
            handler: func,
            identitySources: [lib_1.IdentitySource.header('whoami')],
            authorizerName: 'myauthorizer',
            resultsCacheTtl: core_1.Duration.minutes(1),
        });
        const restApi = new lib_1.RestApi(stack, 'myrestapi');
        restApi.root.addMethod('ANY', undefined, {
            authorizer: auth,
            authorizationType: lib_1.AuthorizationType.CUSTOM,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Authorizer', {
            Type: 'REQUEST',
            RestApiId: stack.resolve(restApi.restApiId),
            IdentitySource: 'method.request.header.whoami',
            Name: 'myauthorizer',
            AuthorizerResultTtlInSeconds: 60,
            AuthorizerUri: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        {
                            'Fn::Select': [
                                1,
                                {
                                    'Fn::Split': [
                                        ':',
                                        {
                                            'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                                        },
                                    ],
                                },
                            ],
                        },
                        ':apigateway:',
                        {
                            'Fn::Select': [
                                3,
                                {
                                    'Fn::Split': [
                                        ':',
                                        {
                                            'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                                        },
                                    ],
                                },
                            ],
                        },
                        ':lambda:path/2015-03-31/functions/',
                        {
                            'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                        },
                        '/invocations',
                    ],
                ],
            },
        });
    });
    test('token authorizer with assume role', () => {
        const stack = new core_1.Stack();
        const func = new lambda.Function(stack, 'myfunction', {
            handler: 'handler',
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const role = new iam.Role(stack, 'authorizerassumerole', {
            assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
            roleName: 'authorizerassumerole',
        });
        const auth = new lib_1.TokenAuthorizer(stack, 'myauthorizer', {
            handler: func,
            assumeRole: role,
        });
        const restApi = new lib_1.RestApi(stack, 'myrestapi');
        restApi.root.addMethod('ANY', undefined, {
            authorizer: auth,
            authorizationType: lib_1.AuthorizationType.CUSTOM,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Authorizer', {
            Type: 'TOKEN',
            RestApiId: stack.resolve(restApi.restApiId),
            AuthorizerUri: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        {
                            'Fn::Select': [
                                1,
                                {
                                    'Fn::Split': [
                                        ':',
                                        {
                                            'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                                        },
                                    ],
                                },
                            ],
                        },
                        ':apigateway:',
                        {
                            'Fn::Select': [
                                3,
                                {
                                    'Fn::Split': [
                                        ':',
                                        {
                                            'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                                        },
                                    ],
                                },
                            ],
                        },
                        ':lambda:path/2015-03-31/functions/',
                        {
                            'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                        },
                        '/invocations',
                    ],
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResource('AWS::IAM::Role', assertions_1.Match.anyValue());
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            Roles: [
                stack.resolve(role.roleName),
            ],
            PolicyDocument: {
                Statement: [
                    {
                        Resource: stack.resolve(func.resourceArnsForGrantInvoke),
                        Action: 'lambda:InvokeFunction',
                        Effect: 'Allow',
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 0);
    });
    test('request authorizer with assume role', () => {
        const stack = new core_1.Stack();
        const func = new lambda.Function(stack, 'myfunction', {
            handler: 'handler',
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const role = new iam.Role(stack, 'authorizerassumerole', {
            assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
            roleName: 'authorizerassumerole',
        });
        const auth = new lib_1.RequestAuthorizer(stack, 'myauthorizer', {
            handler: func,
            assumeRole: role,
            resultsCacheTtl: core_1.Duration.seconds(0),
            identitySources: [],
        });
        const restApi = new lib_1.RestApi(stack, 'myrestapi');
        restApi.root.addMethod('ANY', undefined, {
            authorizer: auth,
            authorizationType: lib_1.AuthorizationType.CUSTOM,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Authorizer', {
            Type: 'REQUEST',
            RestApiId: stack.resolve(restApi.restApiId),
            AuthorizerUri: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        {
                            'Fn::Select': [
                                1,
                                {
                                    'Fn::Split': [
                                        ':',
                                        {
                                            'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                                        },
                                    ],
                                },
                            ],
                        },
                        ':apigateway:',
                        {
                            'Fn::Select': [
                                3,
                                {
                                    'Fn::Split': [
                                        ':',
                                        {
                                            'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                                        },
                                    ],
                                },
                            ],
                        },
                        ':lambda:path/2015-03-31/functions/',
                        {
                            'Fn::GetAtt': ['myfunction9B95E948', 'Arn'],
                        },
                        '/invocations',
                    ],
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResource('AWS::IAM::Role', assertions_1.Match.anyValue());
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            Roles: [
                stack.resolve(role.roleName),
            ],
            PolicyDocument: {
                Statement: [
                    {
                        Resource: stack.resolve(func.resourceArnsForGrantInvoke),
                        Action: 'lambda:InvokeFunction',
                        Effect: 'Allow',
                    },
                ],
            },
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Lambda::Permission', 0);
    });
    test('token authorizer throws when not attached to a rest api', () => {
        const stack = new core_1.Stack();
        const func = new lambda.Function(stack, 'myfunction', {
            handler: 'handler',
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const auth = new lib_1.TokenAuthorizer(stack, 'myauthorizer', {
            handler: func,
        });
        expect(() => stack.resolve(auth.authorizerArn)).toThrow(/must be attached to a RestApi/);
    });
    test('request authorizer throws when not attached to a rest api', () => {
        const stack = new core_1.Stack();
        const func = new lambda.Function(stack, 'myfunction', {
            handler: 'handler',
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const auth = new lib_1.RequestAuthorizer(stack, 'myauthorizer', {
            handler: func,
            identitySources: [lib_1.IdentitySource.header('myheader')],
        });
        expect(() => stack.resolve(auth.authorizerArn)).toThrow(/must be attached to a RestApi/);
    });
    test('rest api depends on the token authorizer when @aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId is enabled', () => {
        const stack = new core_1.Stack();
        stack.node.setContext('@aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId', true);
        const func = new lambda.Function(stack, 'myfunction', {
            handler: 'handler',
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_18_X,
        });
        const auth = new lib_1.TokenAuthorizer(stack, 'myauthorizer', {
            handler: func,
        });
        const restApi = new lib_1.RestApi(stack, 'myrestapi');
        restApi.root.addMethod('ANY', undefined, {
            authorizer: auth,
            authorizationType: lib_1.AuthorizationType.CUSTOM,
        });
        const template = assertions_1.Template.fromStack(stack);
        const authorizerId = Object.keys(template.findResources('AWS::ApiGateway::Authorizer'))[0];
        const deployment = Object.values(template.findResources('AWS::ApiGateway::Deployment'))[0];
        expect(deployment.DependsOn).toEqual(expect.arrayContaining([authorizerId]));
    });
    test('rest api depends on the request authorizer when @aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId is enabled', () => {
        const stack = new core_1.Stack();
        stack.node.setContext('@aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId', true);
        const func = new lambda.Function(stack, 'myfunction', {
            handler: 'handler',
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const auth = new lib_1.RequestAuthorizer(stack, 'myauthorizer', {
            handler: func,
            resultsCacheTtl: core_1.Duration.seconds(0),
            identitySources: [],
        });
        const restApi = new lib_1.RestApi(stack, 'myrestapi');
        restApi.root.addMethod('ANY', undefined, {
            authorizer: auth,
            authorizationType: lib_1.AuthorizationType.CUSTOM,
        });
        const template = assertions_1.Template.fromStack(stack);
        const authorizerId = Object.keys(template.findResources('AWS::ApiGateway::Authorizer'))[0];
        const deployment = Object.values(template.findResources('AWS::ApiGateway::Deployment'))[0];
        expect(deployment.DependsOn).toEqual(expect.arrayContaining([authorizerId]));
    });
    test('a new deployment is created when a lambda function changes name and @aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId is enabled', () => {
        const createApiTemplate = (lambdaFunctionName) => {
            const stack = new core_1.Stack();
            stack.node.setContext('@aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId', true);
            const func = new lambda.Function(stack, 'myfunction', {
                handler: 'handler',
                functionName: lambdaFunctionName,
                code: lambda.Code.fromInline('foo'),
                runtime: lambda.Runtime.NODEJS_18_X,
            });
            const auth = new lib_1.RequestAuthorizer(stack, 'myauthorizer', {
                handler: func,
                resultsCacheTtl: core_1.Duration.seconds(0),
                identitySources: [],
            });
            const restApi = new lib_1.RestApi(stack, 'myrestapi');
            restApi.root.addMethod('ANY', undefined, {
                authorizer: auth,
                authorizationType: lib_1.AuthorizationType.CUSTOM,
            });
            return assertions_1.Template.fromStack(stack);
        };
        const oldTemplate = createApiTemplate('foo');
        const newTemplate = createApiTemplate('bar');
        const oldDeploymentId = Object.keys(oldTemplate.findResources('AWS::ApiGateway::Deployment'))[0];
        const newDeploymentId = Object.keys(newTemplate.findResources('AWS::ApiGateway::Deployment'))[0];
        expect(oldDeploymentId).not.toEqual(newDeploymentId);
    });
    test('a new deployment is created when an imported lambda function changes name and @aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId is enabled', () => {
        const createApiTemplate = (lambdaFunctionName) => {
            const stack = new core_1.Stack();
            stack.node.setContext('@aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId', true);
            const func = lambda.Function.fromFunctionName(stack, 'myfunction', lambdaFunctionName);
            const auth = new lib_1.RequestAuthorizer(stack, 'myauthorizer', {
                handler: func,
                resultsCacheTtl: core_1.Duration.seconds(0),
                identitySources: [],
            });
            const restApi = new lib_1.RestApi(stack, 'myrestapi');
            restApi.root.addMethod('ANY', undefined, {
                authorizer: auth,
                authorizationType: lib_1.AuthorizationType.CUSTOM,
            });
            return assertions_1.Template.fromStack(stack);
        };
        const oldTemplate = createApiTemplate('foo');
        const newTemplate = createApiTemplate('bar');
        const oldDeploymentId = Object.keys(oldTemplate.findResources('AWS::ApiGateway::Deployment'))[0];
        const newDeploymentId = Object.keys(newTemplate.findResources('AWS::ApiGateway::Deployment'))[0];
        expect(oldDeploymentId).not.toEqual(newDeploymentId);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYW1iZGEudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCx3Q0FBd0M7QUFDeEMsOENBQThDO0FBQzlDLHdDQUFnRDtBQUNoRCxtQ0FBMkc7QUFFM0csUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtJQUNqQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1FBQ3BDLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7WUFDcEQsT0FBTyxFQUFFLFNBQVM7WUFDbEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztZQUNuQyxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXO1NBQ3BDLENBQUMsQ0FBQztRQUVILE1BQU0sSUFBSSxHQUFHLElBQUkscUJBQWUsQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFO1lBQ3RELE9BQU8sRUFBRSxJQUFJO1NBQ2QsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsSUFBSSxhQUFPLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ2hELE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDdkMsVUFBVSxFQUFFLElBQUk7WUFDaEIsaUJBQWlCLEVBQUUsdUJBQWlCLENBQUMsTUFBTTtTQUM1QyxDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw2QkFBNkIsRUFBRTtZQUM3RSxJQUFJLEVBQUUsT0FBTztZQUNiLFNBQVMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxT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QWlCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFN0MsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqRyxNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWpHLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ3ZELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCB7IER1cmF0aW9uLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQXV0aG9yaXphdGlvblR5cGUsIElkZW50aXR5U291cmNlLCBSZXF1ZXN0QXV0aG9yaXplciwgUmVzdEFwaSwgVG9rZW5BdXRob3JpemVyIH0gZnJvbSAnLi4vLi4vbGliJztcblxuZGVzY3JpYmUoJ2xhbWJkYSBhdXRob3JpemVyJywgKCkgPT4ge1xuICB0ZXN0KCdkZWZhdWx0IHRva2VuIGF1dGhvcml6ZXInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IGZ1bmMgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnbXlmdW5jdGlvbicsIHtcbiAgICAgIGhhbmRsZXI6ICdoYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhdXRoID0gbmV3IFRva2VuQXV0aG9yaXplcihzdGFjaywgJ215YXV0aG9yaXplcicsIHtcbiAgICAgIGhhbmRsZXI6IGZ1bmMsXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXN0QXBpID0gbmV3IFJlc3RBcGkoc3RhY2ssICdteXJlc3RhcGknKTtcbiAgICByZXN0QXBpLnJvb3QuYWRkTWV0aG9kKCdBTlknLCB1bmRlZmluZWQsIHtcbiAgICAgIGF1dGhvcml6ZXI6IGF1dGgsXG4gICAgICBhdXRob3JpemF0aW9uVHlwZTogQXV0aG9yaXphdGlvblR5cGUuQ1VTVE9NLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6QXV0aG9yaXplcicsIHtcbiAgICAgIFR5cGU6ICdUT0tFTicsXG4gICAgICBSZXN0QXBpSWQ6IHN0YWNrLnJlc29sdmUocmVzdEFwaS5yZXN0QXBpSWQpLFxuICAgICAgSWRlbnRpdHlTb3VyY2U6ICdtZXRob2QucmVxdWVzdC5oZWFkZXIuQXV0aG9yaXphdGlvbicsXG4gICAgICBBdXRob3JpemVyVXJpOiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgICAgIDEsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ215ZnVuY3Rpb245Qjk1RTk0OCcsICdBcm4nXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnOmFwaWdhdGV3YXk6JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgICAgMyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFsnbXlmdW5jdGlvbjlCOTVFOTQ4JywgJ0FybiddLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6bGFtYmRhOnBhdGgvMjAxNS0wMy0zMS9mdW5jdGlvbnMvJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ215ZnVuY3Rpb245Qjk1RTk0OCcsICdBcm4nXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnL2ludm9jYXRpb25zJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6UGVybWlzc2lvbicsIHtcbiAgICAgIEFjdGlvbjogJ2xhbWJkYTpJbnZva2VGdW5jdGlvbicsXG4gICAgICBQcmluY2lwYWw6ICdhcGlnYXRld2F5LmFtYXpvbmF3cy5jb20nLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KGF1dGguYXV0aG9yaXplckFybi5lbmRzV2l0aChgL2F1dGhvcml6ZXJzLyR7YXV0aC5hdXRob3JpemVySWR9YCkpLnRvQmVUcnV0aHkoKTtcbiAgfSk7XG5cbiAgdGVzdCgnZGVmYXVsdCByZXF1ZXN0IGF1dGhvcml6ZXInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IGZ1bmMgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnbXlmdW5jdGlvbicsIHtcbiAgICAgIGhhbmRsZXI6ICdoYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhdXRoID0gbmV3IFJlcXVlc3RBdXRob3JpemVyKHN0YWNrLCAnbXlhdXRob3JpemVyJywge1xuICAgICAgaGFuZGxlcjogZnVuYyxcbiAgICAgIHJlc3VsdHNDYWNoZVR0bDogRHVyYXRpb24uc2Vjb25kcygwKSxcbiAgICAgIGlkZW50aXR5U291cmNlczogW10sXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXN0QXBpID0gbmV3IFJlc3RBcGkoc3RhY2ssICdteXJlc3RhcGknKTtcbiAgICByZXN0QXBpLnJvb3QuYWRkTWV0aG9kKCdBTlknLCB1bmRlZmluZWQsIHtcbiAgICAgIGF1dGhvcml6ZXI6IGF1dGgsXG4gICAgICBhdXRob3JpemF0aW9uVHlwZTogQXV0aG9yaXphdGlvblR5cGUuQ1VTVE9NLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6QXV0aG9yaXplcicsIHtcbiAgICAgIFR5cGU6ICdSRVFVRVNUJyxcbiAgICAgIFJlc3RBcGlJZDogc3RhY2sucmVzb2x2ZShyZXN0QXBpLnJlc3RBcGlJZCksXG4gICAgICBBdXRob3JpemVyVXJpOiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgICAgIDEsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ215ZnVuY3Rpb245Qjk1RTk0OCcsICdBcm4nXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnOmFwaWdhdGV3YXk6JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgICAgMyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFsnbXlmdW5jdGlvbjlCOTVFOTQ4JywgJ0FybiddLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6bGFtYmRhOnBhdGgvMjAxNS0wMy0zMS9mdW5jdGlvbnMvJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ215ZnVuY3Rpb245Qjk1RTk0OCcsICdBcm4nXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnL2ludm9jYXRpb25zJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6UGVybWlzc2lvbicsIHtcbiAgICAgIEFjdGlvbjogJ2xhbWJkYTpJbnZva2VGdW5jdGlvbicsXG4gICAgICBQcmluY2lwYWw6ICdhcGlnYXRld2F5LmFtYXpvbmF3cy5jb20nLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KGF1dGguYXV0aG9yaXplckFybi5lbmRzV2l0aChgL2F1dGhvcml6ZXJzLyR7YXV0aC5hdXRob3JpemVySWR9YCkpLnRvQmVUcnV0aHkoKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2ludmFsaWQgcmVxdWVzdCBhdXRob3JpemVyIGNvbmZpZycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgZnVuYyA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdteWZ1bmN0aW9uJywge1xuICAgICAgaGFuZGxlcjogJ2hhbmRsZXInLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgUmVxdWVzdEF1dGhvcml6ZXIoc3RhY2ssICdteWF1dGhvcml6ZXInLCB7XG4gICAgICBoYW5kbGVyOiBmdW5jLFxuICAgICAgcmVzdWx0c0NhY2hlVHRsOiBEdXJhdGlvbi5zZWNvbmRzKDEpLFxuICAgICAgaWRlbnRpdHlTb3VyY2VzOiBbXSxcbiAgICB9KSkudG9UaHJvdygnQXQgbGVhc3Qgb25lIElkZW50aXR5IFNvdXJjZSBpcyByZXF1aXJlZCBmb3IgYSBSRVFVRVNULWJhc2VkIExhbWJkYSBhdXRob3JpemVyIGlmIGNhY2hpbmcgaXMgZW5hYmxlZC4nKTtcbiAgfSk7XG5cbiAgdGVzdCgndG9rZW4gYXV0aG9yaXplciB3aXRoIGFsbCBwYXJhbWV0ZXJzIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgZnVuYyA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdteWZ1bmN0aW9uJywge1xuICAgICAgaGFuZGxlcjogJ2hhbmRsZXInLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIGNvbnN0IGF1dGggPSBuZXcgVG9rZW5BdXRob3JpemVyKHN0YWNrLCAnbXlhdXRob3JpemVyJywge1xuICAgICAgaGFuZGxlcjogZnVuYyxcbiAgICAgIGlkZW50aXR5U291cmNlOiAnbWV0aG9kLnJlcXVlc3QuaGVhZGVyLndob2FtaScsXG4gICAgICB2YWxpZGF0aW9uUmVnZXg6ICdhLWhhY2tlcicsXG4gICAgICBhdXRob3JpemVyTmFtZTogJ215YXV0aG9yaXplcicsXG4gICAgICByZXN1bHRzQ2FjaGVUdGw6IER1cmF0aW9uLm1pbnV0ZXMoMSksXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXN0QXBpID0gbmV3IFJlc3RBcGkoc3RhY2ssICdteXJlc3RhcGknKTtcbiAgICByZXN0QXBpLnJvb3QuYWRkTWV0aG9kKCdBTlknLCB1bmRlZmluZWQsIHtcbiAgICAgIGF1dGhvcml6ZXI6IGF1dGgsXG4gICAgICBhdXRob3JpemF0aW9uVHlwZTogQXV0aG9yaXphdGlvblR5cGUuQ1VTVE9NLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6QXV0aG9yaXplcicsIHtcbiAgICAgIFR5cGU6ICdUT0tFTicsXG4gICAgICBSZXN0QXBpSWQ6IHN0YWNrLnJlc29sdmUocmVzdEFwaS5yZXN0QXBpSWQpLFxuICAgICAgSWRlbnRpdHlTb3VyY2U6ICdtZXRob2QucmVxdWVzdC5oZWFkZXIud2hvYW1pJyxcbiAgICAgIElkZW50aXR5VmFsaWRhdGlvbkV4cHJlc3Npb246ICdhLWhhY2tlcicsXG4gICAgICBOYW1lOiAnbXlhdXRob3JpemVyJyxcbiAgICAgIEF1dGhvcml6ZXJSZXN1bHRUdGxJblNlY29uZHM6IDYwLFxuICAgICAgQXV0aG9yaXplclVyaToge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAxLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydteWZ1bmN0aW9uOUI5NUU5NDgnLCAnQXJuJ10sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJzphcGlnYXRld2F5OicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgICAgIDMsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ215ZnVuY3Rpb245Qjk1RTk0OCcsICdBcm4nXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnOmxhbWJkYTpwYXRoLzIwMTUtMDMtMzEvZnVuY3Rpb25zLycsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydteWZ1bmN0aW9uOUI5NUU5NDgnLCAnQXJuJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJy9pbnZvY2F0aW9ucycsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JlcXVlc3QgYXV0aG9yaXplciB3aXRoIGFsbCBwYXJhbWV0ZXJzIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgZnVuYyA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdteWZ1bmN0aW9uJywge1xuICAgICAgaGFuZGxlcjogJ2hhbmRsZXInLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIGNvbnN0IGF1dGggPSBuZXcgUmVxdWVzdEF1dGhvcml6ZXIoc3RhY2ssICdteWF1dGhvcml6ZXInLCB7XG4gICAgICBoYW5kbGVyOiBmdW5jLFxuICAgICAgaWRlbnRpdHlTb3VyY2VzOiBbSWRlbnRpdHlTb3VyY2UuaGVhZGVyKCd3aG9hbWknKV0sXG4gICAgICBhdXRob3JpemVyTmFtZTogJ215YXV0aG9yaXplcicsXG4gICAgICByZXN1bHRzQ2FjaGVUdGw6IER1cmF0aW9uLm1pbnV0ZXMoMSksXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXN0QXBpID0gbmV3IFJlc3RBcGkoc3RhY2ssICdteXJlc3RhcGknKTtcbiAgICByZXN0QXBpLnJvb3QuYWRkTWV0aG9kKCdBTlknLCB1bmRlZmluZWQsIHtcbiAgICAgIGF1dGhvcml6ZXI6IGF1dGgsXG4gICAgICBhdXRob3JpemF0aW9uVHlwZTogQXV0aG9yaXphdGlvblR5cGUuQ1VTVE9NLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6QXV0aG9yaXplcicsIHtcbiAgICAgIFR5cGU6ICdSRVFVRVNUJyxcbiAgICAgIFJlc3RBcGlJZDogc3RhY2sucmVzb2x2ZShyZXN0QXBpLnJlc3RBcGlJZCksXG4gICAgICBJZGVudGl0eVNvdXJjZTogJ21ldGhvZC5yZXF1ZXN0LmhlYWRlci53aG9hbWknLFxuICAgICAgTmFtZTogJ215YXV0aG9yaXplcicsXG4gICAgICBBdXRob3JpemVyUmVzdWx0VHRsSW5TZWNvbmRzOiA2MCxcbiAgICAgIEF1dGhvcml6ZXJVcmk6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgICAgMSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFsnbXlmdW5jdGlvbjlCOTVFOTQ4JywgJ0FybiddLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6YXBpZ2F0ZXdheTonLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAzLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydteWZ1bmN0aW9uOUI5NUU5NDgnLCAnQXJuJ10sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJzpsYW1iZGE6cGF0aC8yMDE1LTAzLTMxL2Z1bmN0aW9ucy8nLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFsnbXlmdW5jdGlvbjlCOTVFOTQ4JywgJ0FybiddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICcvaW52b2NhdGlvbnMnLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0b2tlbiBhdXRob3JpemVyIHdpdGggYXNzdW1lIHJvbGUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IGZ1bmMgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnbXlmdW5jdGlvbicsIHtcbiAgICAgIGhhbmRsZXI6ICdoYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG5cbiAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnYXV0aG9yaXplcmFzc3VtZXJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnYXBpZ2F0ZXdheS5hbWF6b25hd3MuY29tJyksXG4gICAgICByb2xlTmFtZTogJ2F1dGhvcml6ZXJhc3N1bWVyb2xlJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGF1dGggPSBuZXcgVG9rZW5BdXRob3JpemVyKHN0YWNrLCAnbXlhdXRob3JpemVyJywge1xuICAgICAgaGFuZGxlcjogZnVuYyxcbiAgICAgIGFzc3VtZVJvbGU6IHJvbGUsXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXN0QXBpID0gbmV3IFJlc3RBcGkoc3RhY2ssICdteXJlc3RhcGknKTtcbiAgICByZXN0QXBpLnJvb3QuYWRkTWV0aG9kKCdBTlknLCB1bmRlZmluZWQsIHtcbiAgICAgIGF1dGhvcml6ZXI6IGF1dGgsXG4gICAgICBhdXRob3JpemF0aW9uVHlwZTogQXV0aG9yaXphdGlvblR5cGUuQ1VTVE9NLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6QXV0aG9yaXplcicsIHtcbiAgICAgIFR5cGU6ICdUT0tFTicsXG4gICAgICBSZXN0QXBpSWQ6IHN0YWNrLnJlc29sdmUocmVzdEFwaS5yZXN0QXBpSWQpLFxuICAgICAgQXV0aG9yaXplclVyaToge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAxLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydteWZ1bmN0aW9uOUI5NUU5NDgnLCAnQXJuJ10sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJzphcGlnYXRld2F5OicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6U2VsZWN0JzogW1xuICAgICAgICAgICAgICAgIDMsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpTcGxpdCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ215ZnVuY3Rpb245Qjk1RTk0OCcsICdBcm4nXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnOmxhbWJkYTpwYXRoLzIwMTUtMDMtMzEvZnVuY3Rpb25zLycsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydteWZ1bmN0aW9uOUI5NUU5NDgnLCAnQXJuJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJy9pbnZvY2F0aW9ucycsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OklBTTo6Um9sZScsIE1hdGNoLmFueVZhbHVlKCkpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBSb2xlczogW1xuICAgICAgICBzdGFjay5yZXNvbHZlKHJvbGUucm9sZU5hbWUpLFxuICAgICAgXSxcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlc291cmNlOiBzdGFjay5yZXNvbHZlKGZ1bmMucmVzb3VyY2VBcm5zRm9yR3JhbnRJbnZva2UpLFxuICAgICAgICAgICAgQWN0aW9uOiAnbGFtYmRhOkludm9rZUZ1bmN0aW9uJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkxhbWJkYTo6UGVybWlzc2lvbicsIDApO1xuICB9KTtcblxuICB0ZXN0KCdyZXF1ZXN0IGF1dGhvcml6ZXIgd2l0aCBhc3N1bWUgcm9sZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgZnVuYyA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdteWZ1bmN0aW9uJywge1xuICAgICAgaGFuZGxlcjogJ2hhbmRsZXInLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdhdXRob3JpemVyYXNzdW1lcm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdhcGlnYXRld2F5LmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIHJvbGVOYW1lOiAnYXV0aG9yaXplcmFzc3VtZXJvbGUnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYXV0aCA9IG5ldyBSZXF1ZXN0QXV0aG9yaXplcihzdGFjaywgJ215YXV0aG9yaXplcicsIHtcbiAgICAgIGhhbmRsZXI6IGZ1bmMsXG4gICAgICBhc3N1bWVSb2xlOiByb2xlLFxuICAgICAgcmVzdWx0c0NhY2hlVHRsOiBEdXJhdGlvbi5zZWNvbmRzKDApLFxuICAgICAgaWRlbnRpdHlTb3VyY2VzOiBbXSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc3RBcGkgPSBuZXcgUmVzdEFwaShzdGFjaywgJ215cmVzdGFwaScpO1xuICAgIHJlc3RBcGkucm9vdC5hZGRNZXRob2QoJ0FOWScsIHVuZGVmaW5lZCwge1xuICAgICAgYXV0aG9yaXplcjogYXV0aCxcbiAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBBdXRob3JpemF0aW9uVHlwZS5DVVNUT00sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpBdXRob3JpemVyJywge1xuICAgICAgVHlwZTogJ1JFUVVFU1QnLFxuICAgICAgUmVzdEFwaUlkOiBzdGFjay5yZXNvbHZlKHJlc3RBcGkucmVzdEFwaUlkKSxcbiAgICAgIEF1dGhvcml6ZXJVcmk6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpTZWxlY3QnOiBbXG4gICAgICAgICAgICAgICAgMSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnRm46OlNwbGl0JzogW1xuICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFsnbXlmdW5jdGlvbjlCOTVFOTQ4JywgJ0FybiddLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6YXBpZ2F0ZXdheTonLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFtcbiAgICAgICAgICAgICAgICAzLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbXG4gICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydteWZ1bmN0aW9uOUI5NUU5NDgnLCAnQXJuJ10sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJzpsYW1iZGE6cGF0aC8yMDE1LTAzLTMxL2Z1bmN0aW9ucy8nLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFsnbXlmdW5jdGlvbjlCOTVFOTQ4JywgJ0FybiddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICcvaW52b2NhdGlvbnMnLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpJQU06OlJvbGUnLCBNYXRjaC5hbnlWYWx1ZSgpKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUm9sZXM6IFtcbiAgICAgICAgc3RhY2sucmVzb2x2ZShyb2xlLnJvbGVOYW1lKSxcbiAgICAgIF0sXG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZXNvdXJjZTogc3RhY2sucmVzb2x2ZShmdW5jLnJlc291cmNlQXJuc0ZvckdyYW50SW52b2tlKSxcbiAgICAgICAgICAgIEFjdGlvbjogJ2xhbWJkYTpJbnZva2VGdW5jdGlvbicsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpMYW1iZGE6OlBlcm1pc3Npb24nLCAwKTtcbiAgfSk7XG5cbiAgdGVzdCgndG9rZW4gYXV0aG9yaXplciB0aHJvd3Mgd2hlbiBub3QgYXR0YWNoZWQgdG8gYSByZXN0IGFwaScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGZ1bmMgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnbXlmdW5jdGlvbicsIHtcbiAgICAgIGhhbmRsZXI6ICdoYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG4gICAgY29uc3QgYXV0aCA9IG5ldyBUb2tlbkF1dGhvcml6ZXIoc3RhY2ssICdteWF1dGhvcml6ZXInLCB7XG4gICAgICBoYW5kbGVyOiBmdW5jLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IHN0YWNrLnJlc29sdmUoYXV0aC5hdXRob3JpemVyQXJuKSkudG9UaHJvdygvbXVzdCBiZSBhdHRhY2hlZCB0byBhIFJlc3RBcGkvKTtcbiAgfSk7XG5cbiAgdGVzdCgncmVxdWVzdCBhdXRob3JpemVyIHRocm93cyB3aGVuIG5vdCBhdHRhY2hlZCB0byBhIHJlc3QgYXBpJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgZnVuYyA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdteWZ1bmN0aW9uJywge1xuICAgICAgaGFuZGxlcjogJ2hhbmRsZXInLFxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICB9KTtcbiAgICBjb25zdCBhdXRoID0gbmV3IFJlcXVlc3RBdXRob3JpemVyKHN0YWNrLCAnbXlhdXRob3JpemVyJywge1xuICAgICAgaGFuZGxlcjogZnVuYyxcbiAgICAgIGlkZW50aXR5U291cmNlczogW0lkZW50aXR5U291cmNlLmhlYWRlcignbXloZWFkZXInKV0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QoKCkgPT4gc3RhY2sucmVzb2x2ZShhdXRoLmF1dGhvcml6ZXJBcm4pKS50b1Rocm93KC9tdXN0IGJlIGF0dGFjaGVkIHRvIGEgUmVzdEFwaS8pO1xuICB9KTtcblxuICB0ZXN0KCdyZXN0IGFwaSBkZXBlbmRzIG9uIHRoZSB0b2tlbiBhdXRob3JpemVyIHdoZW4gQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXk6YXV0aG9yaXplckNoYW5nZURlcGxveW1lbnRMb2dpY2FsSWQgaXMgZW5hYmxlZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dCgnQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXk6YXV0aG9yaXplckNoYW5nZURlcGxveW1lbnRMb2dpY2FsSWQnLCB0cnVlKTtcblxuICAgIGNvbnN0IGZ1bmMgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnbXlmdW5jdGlvbicsIHtcbiAgICAgIGhhbmRsZXI6ICdoYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE4X1gsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhdXRoID0gbmV3IFRva2VuQXV0aG9yaXplcihzdGFjaywgJ215YXV0aG9yaXplcicsIHtcbiAgICAgIGhhbmRsZXI6IGZ1bmMsXG4gICAgfSk7XG5cbiAgICBjb25zdCByZXN0QXBpID0gbmV3IFJlc3RBcGkoc3RhY2ssICdteXJlc3RhcGknKTtcbiAgICByZXN0QXBpLnJvb3QuYWRkTWV0aG9kKCdBTlknLCB1bmRlZmluZWQsIHtcbiAgICAgIGF1dGhvcml6ZXI6IGF1dGgsXG4gICAgICBhdXRob3JpemF0aW9uVHlwZTogQXV0aG9yaXphdGlvblR5cGUuQ1VTVE9NLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuXG4gICAgY29uc3QgYXV0aG9yaXplcklkID0gT2JqZWN0LmtleXModGVtcGxhdGUuZmluZFJlc291cmNlcygnQVdTOjpBcGlHYXRld2F5OjpBdXRob3JpemVyJykpWzBdO1xuICAgIGNvbnN0IGRlcGxveW1lbnQgPSBPYmplY3QudmFsdWVzKHRlbXBsYXRlLmZpbmRSZXNvdXJjZXMoJ0FXUzo6QXBpR2F0ZXdheTo6RGVwbG95bWVudCcpKVswXTtcblxuICAgIGV4cGVjdChkZXBsb3ltZW50LkRlcGVuZHNPbikudG9FcXVhbChleHBlY3QuYXJyYXlDb250YWluaW5nKFthdXRob3JpemVySWRdKSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc3QgYXBpIGRlcGVuZHMgb24gdGhlIHJlcXVlc3QgYXV0aG9yaXplciB3aGVuIEBhd3MtY2RrL2F3cy1hcGlnYXRld2F5OmF1dGhvcml6ZXJDaGFuZ2VEZXBsb3ltZW50TG9naWNhbElkIGlzIGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBzdGFjay5ub2RlLnNldENvbnRleHQoJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5OmF1dGhvcml6ZXJDaGFuZ2VEZXBsb3ltZW50TG9naWNhbElkJywgdHJ1ZSk7XG5cbiAgICBjb25zdCBmdW5jID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ215ZnVuY3Rpb24nLCB7XG4gICAgICBoYW5kbGVyOiAnaGFuZGxlcicsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdmb28nKSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYXV0aCA9IG5ldyBSZXF1ZXN0QXV0aG9yaXplcihzdGFjaywgJ215YXV0aG9yaXplcicsIHtcbiAgICAgIGhhbmRsZXI6IGZ1bmMsXG4gICAgICByZXN1bHRzQ2FjaGVUdGw6IER1cmF0aW9uLnNlY29uZHMoMCksXG4gICAgICBpZGVudGl0eVNvdXJjZXM6IFtdLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcmVzdEFwaSA9IG5ldyBSZXN0QXBpKHN0YWNrLCAnbXlyZXN0YXBpJyk7XG4gICAgcmVzdEFwaS5yb290LmFkZE1ldGhvZCgnQU5ZJywgdW5kZWZpbmVkLCB7XG4gICAgICBhdXRob3JpemVyOiBhdXRoLFxuICAgICAgYXV0aG9yaXphdGlvblR5cGU6IEF1dGhvcml6YXRpb25UeXBlLkNVU1RPTSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcblxuICAgIGNvbnN0IGF1dGhvcml6ZXJJZCA9IE9iamVjdC5rZXlzKHRlbXBsYXRlLmZpbmRSZXNvdXJjZXMoJ0FXUzo6QXBpR2F0ZXdheTo6QXV0aG9yaXplcicpKVswXTtcbiAgICBjb25zdCBkZXBsb3ltZW50ID0gT2JqZWN0LnZhbHVlcyh0ZW1wbGF0ZS5maW5kUmVzb3VyY2VzKCdBV1M6OkFwaUdhdGV3YXk6OkRlcGxveW1lbnQnKSlbMF07XG5cbiAgICBleHBlY3QoZGVwbG95bWVudC5EZXBlbmRzT24pLnRvRXF1YWwoZXhwZWN0LmFycmF5Q29udGFpbmluZyhbYXV0aG9yaXplcklkXSkpO1xuICB9KTtcblxuICB0ZXN0KCdhIG5ldyBkZXBsb3ltZW50IGlzIGNyZWF0ZWQgd2hlbiBhIGxhbWJkYSBmdW5jdGlvbiBjaGFuZ2VzIG5hbWUgYW5kIEBhd3MtY2RrL2F3cy1hcGlnYXRld2F5OmF1dGhvcml6ZXJDaGFuZ2VEZXBsb3ltZW50TG9naWNhbElkIGlzIGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgY29uc3QgY3JlYXRlQXBpVGVtcGxhdGUgPSAobGFtYmRhRnVuY3Rpb25OYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBzdGFjay5ub2RlLnNldENvbnRleHQoJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5OmF1dGhvcml6ZXJDaGFuZ2VEZXBsb3ltZW50TG9naWNhbElkJywgdHJ1ZSk7XG5cbiAgICAgIGNvbnN0IGZ1bmMgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnbXlmdW5jdGlvbicsIHtcbiAgICAgICAgaGFuZGxlcjogJ2hhbmRsZXInLFxuICAgICAgICBmdW5jdGlvbk5hbWU6IGxhbWJkYUZ1bmN0aW9uTmFtZSxcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZm9vJyksXG4gICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xOF9YLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGF1dGggPSBuZXcgUmVxdWVzdEF1dGhvcml6ZXIoc3RhY2ssICdteWF1dGhvcml6ZXInLCB7XG4gICAgICAgIGhhbmRsZXI6IGZ1bmMsXG4gICAgICAgIHJlc3VsdHNDYWNoZVR0bDogRHVyYXRpb24uc2Vjb25kcygwKSxcbiAgICAgICAgaWRlbnRpdHlTb3VyY2VzOiBbXSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCByZXN0QXBpID0gbmV3IFJlc3RBcGkoc3RhY2ssICdteXJlc3RhcGknKTtcbiAgICAgIHJlc3RBcGkucm9vdC5hZGRNZXRob2QoJ0FOWScsIHVuZGVmaW5lZCwge1xuICAgICAgICBhdXRob3JpemVyOiBhdXRoLFxuICAgICAgICBhdXRob3JpemF0aW9uVHlwZTogQXV0aG9yaXphdGlvblR5cGUuQ1VTVE9NLFxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgIH07XG5cbiAgICBjb25zdCBvbGRUZW1wbGF0ZSA9IGNyZWF0ZUFwaVRlbXBsYXRlKCdmb28nKTtcbiAgICBjb25zdCBuZXdUZW1wbGF0ZSA9IGNyZWF0ZUFwaVRlbXBsYXRlKCdiYXInKTtcblxuICAgIGNvbnN0IG9sZERlcGxveW1lbnRJZCA9IE9iamVjdC5rZXlzKG9sZFRlbXBsYXRlLmZpbmRSZXNvdXJjZXMoJ0FXUzo6QXBpR2F0ZXdheTo6RGVwbG95bWVudCcpKVswXTtcbiAgICBjb25zdCBuZXdEZXBsb3ltZW50SWQgPSBPYmplY3Qua2V5cyhuZXdUZW1wbGF0ZS5maW5kUmVzb3VyY2VzKCdBV1M6OkFwaUdhdGV3YXk6OkRlcGxveW1lbnQnKSlbMF07XG5cbiAgICBleHBlY3Qob2xkRGVwbG95bWVudElkKS5ub3QudG9FcXVhbChuZXdEZXBsb3ltZW50SWQpO1xuICB9KTtcblxuICB0ZXN0KCdhIG5ldyBkZXBsb3ltZW50IGlzIGNyZWF0ZWQgd2hlbiBhbiBpbXBvcnRlZCBsYW1iZGEgZnVuY3Rpb24gY2hhbmdlcyBuYW1lIGFuZCBAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheTphdXRob3JpemVyQ2hhbmdlRGVwbG95bWVudExvZ2ljYWxJZCBpcyBlbmFibGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IGNyZWF0ZUFwaVRlbXBsYXRlID0gKGxhbWJkYUZ1bmN0aW9uTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgc3RhY2subm9kZS5zZXRDb250ZXh0KCdAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheTphdXRob3JpemVyQ2hhbmdlRGVwbG95bWVudExvZ2ljYWxJZCcsIHRydWUpO1xuXG4gICAgICBjb25zdCBmdW5jID0gbGFtYmRhLkZ1bmN0aW9uLmZyb21GdW5jdGlvbk5hbWUoc3RhY2ssICdteWZ1bmN0aW9uJywgbGFtYmRhRnVuY3Rpb25OYW1lKTtcblxuICAgICAgY29uc3QgYXV0aCA9IG5ldyBSZXF1ZXN0QXV0aG9yaXplcihzdGFjaywgJ215YXV0aG9yaXplcicsIHtcbiAgICAgICAgaGFuZGxlcjogZnVuYyxcbiAgICAgICAgcmVzdWx0c0NhY2hlVHRsOiBEdXJhdGlvbi5zZWNvbmRzKDApLFxuICAgICAgICBpZGVudGl0eVNvdXJjZXM6IFtdLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHJlc3RBcGkgPSBuZXcgUmVzdEFwaShzdGFjaywgJ215cmVzdGFwaScpO1xuICAgICAgcmVzdEFwaS5yb290LmFkZE1ldGhvZCgnQU5ZJywgdW5kZWZpbmVkLCB7XG4gICAgICAgIGF1dGhvcml6ZXI6IGF1dGgsXG4gICAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBBdXRob3JpemF0aW9uVHlwZS5DVVNUT00sXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgfTtcblxuICAgIGNvbnN0IG9sZFRlbXBsYXRlID0gY3JlYXRlQXBpVGVtcGxhdGUoJ2ZvbycpO1xuICAgIGNvbnN0IG5ld1RlbXBsYXRlID0gY3JlYXRlQXBpVGVtcGxhdGUoJ2JhcicpO1xuXG4gICAgY29uc3Qgb2xkRGVwbG95bWVudElkID0gT2JqZWN0LmtleXMob2xkVGVtcGxhdGUuZmluZFJlc291cmNlcygnQVdTOjpBcGlHYXRld2F5OjpEZXBsb3ltZW50JykpWzBdO1xuICAgIGNvbnN0IG5ld0RlcGxveW1lbnRJZCA9IE9iamVjdC5rZXlzKG5ld1RlbXBsYXRlLmZpbmRSZXNvdXJjZXMoJ0FXUzo6QXBpR2F0ZXdheTo6RGVwbG95bWVudCcpKVswXTtcblxuICAgIGV4cGVjdChvbGREZXBsb3ltZW50SWQpLm5vdC50b0VxdWFsKG5ld0RlcGxveW1lbnRJZCk7XG4gIH0pO1xufSk7XG4iXX0=