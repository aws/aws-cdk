"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const apigw = require("../lib");
const DUMMY_AUTHORIZER = {
    authorizerId: 'dummyauthorizer',
    authorizationType: apigw.AuthorizationType.CUSTOM,
};
describe('method', () => {
    test('default setup', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
        // WHEN
        new apigw.Method(stack, 'my-method', {
            httpMethod: 'POST',
            resource: api.root,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'POST',
            AuthorizationType: 'NONE',
            Integration: {
                Type: 'MOCK',
            },
        });
    });
    test('method options can be specified', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
        // WHEN
        new apigw.Method(stack, 'my-method', {
            httpMethod: 'POST',
            resource: api.root,
            options: {
                apiKeyRequired: true,
                operationName: 'MyOperation',
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            ApiKeyRequired: true,
            OperationName: 'MyOperation',
        });
    });
    test('integration can be set via a property', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
        // WHEN
        new apigw.Method(stack, 'my-method', {
            httpMethod: 'POST',
            resource: api.root,
            integration: new apigw.AwsIntegration({ service: 's3', path: 'bucket/key' }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            Integration: {
                IntegrationHttpMethod: 'POST',
                Type: 'AWS',
                Uri: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:', { Ref: 'AWS::Partition' }, ':apigateway:',
                            { Ref: 'AWS::Region' }, ':s3:path/bucket/key',
                        ],
                    ],
                },
            },
        });
    });
    test('integration can be set for a service in the provided region', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
        // WHEN
        new apigw.Method(stack, 'my-method', {
            httpMethod: 'POST',
            resource: api.root,
            integration: new apigw.AwsIntegration({ service: 'sqs', path: 'queueName', region: 'eu-west-1' }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            Integration: {
                IntegrationHttpMethod: 'POST',
                Type: 'AWS',
                Uri: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:', { Ref: 'AWS::Partition' }, ':apigateway:eu-west-1:sqs:path/queueName',
                        ],
                    ],
                },
            },
        });
    });
    test('integration with a custom http method can be set via a property', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
        // WHEN
        new apigw.Method(stack, 'my-method', {
            httpMethod: 'POST',
            resource: api.root,
            integration: new apigw.AwsIntegration({ service: 's3', path: 'bucket/key', integrationHttpMethod: 'GET' }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            Integration: {
                IntegrationHttpMethod: 'GET',
            },
        });
    });
    test('use default integration from api', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const defaultIntegration = new apigw.Integration({ type: apigw.IntegrationType.HTTP_PROXY, uri: 'https://amazon.com' });
        const api = new apigw.RestApi(stack, 'test-api', {
            cloudWatchRole: false,
            deploy: false,
            defaultIntegration,
        });
        // WHEN
        new apigw.Method(stack, 'my-method', {
            httpMethod: 'POST',
            resource: api.root,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            Integration: {
                Type: 'HTTP_PROXY',
                Uri: 'https://amazon.com',
            },
        });
    });
    test('"methodArn" returns the ARN execute-api ARN for this method in the current stage', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api');
        // WHEN
        const method = new apigw.Method(stack, 'my-method', {
            httpMethod: 'POST',
            resource: api.root,
        });
        // THEN
        expect(stack.resolve(method.methodArn)).toEqual({
            'Fn::Join': [
                '',
                [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':execute-api:',
                    { Ref: 'AWS::Region' },
                    ':',
                    { Ref: 'AWS::AccountId' },
                    ':',
                    { Ref: 'testapiD6451F70' },
                    '/',
                    { Ref: 'testapiDeploymentStageprod5C9E92A4' },
                    '/POST/',
                ],
            ],
        });
    });
    test('"testMethodArn" returns the ARN of the "test-invoke-stage" stage (console UI)', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api');
        // WHEN
        const method = new apigw.Method(stack, 'my-method', {
            httpMethod: 'POST',
            resource: api.root,
        });
        // THEN
        expect(stack.resolve(method.testMethodArn)).toEqual({
            'Fn::Join': [
                '',
                [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':execute-api:',
                    { Ref: 'AWS::Region' },
                    ':',
                    { Ref: 'AWS::AccountId' },
                    ':',
                    { Ref: 'testapiD6451F70' },
                    '/test-invoke-stage/POST/',
                ],
            ],
        });
    });
    test('"methodArn" returns an arn with "*" as its stage when deploymentStage is not set', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api', { deploy: false });
        // WHEN
        const method = new apigw.Method(stack, 'my-method', { httpMethod: 'POST', resource: api.root });
        // THEN
        expect(stack.resolve(method.methodArn)).toEqual({
            'Fn::Join': [
                '',
                [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':execute-api:',
                    { Ref: 'AWS::Region' },
                    ':',
                    { Ref: 'AWS::AccountId' },
                    ':',
                    { Ref: 'testapiD6451F70' },
                    '/*/POST/',
                ],
            ],
        });
    });
    test('"methodArn" and "testMethodArn" replace path parameters with asterisks', () => {
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api');
        const petId = api.root.addResource('pets').addResource('{petId}');
        const commentId = petId.addResource('comments').addResource('{commentId}');
        const method = commentId.addMethod('GET');
        expect(stack.resolve(method.methodArn)).toEqual({
            'Fn::Join': [
                '',
                [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':execute-api:',
                    { Ref: 'AWS::Region' },
                    ':',
                    { Ref: 'AWS::AccountId' },
                    ':',
                    { Ref: 'testapiD6451F70' },
                    '/',
                    { Ref: 'testapiDeploymentStageprod5C9E92A4' },
                    '/GET/pets/*/comments/*',
                ],
            ],
        });
        expect(stack.resolve(method.testMethodArn)).toEqual({
            'Fn::Join': [
                '',
                [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':execute-api:',
                    { Ref: 'AWS::Region' },
                    ':',
                    { Ref: 'AWS::AccountId' },
                    ':',
                    { Ref: 'testapiD6451F70' },
                    '/test-invoke-stage/GET/pets/*/comments/*',
                ],
            ],
        });
    });
    test('integration "credentialsRole" can be used to assume a role when calling backend', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api', { deploy: false });
        const role = new iam.Role(stack, 'MyRole', { assumedBy: new iam.ServicePrincipal('foo') });
        // WHEN
        api.root.addMethod('GET', new apigw.Integration({
            type: apigw.IntegrationType.AWS_PROXY,
            options: {
                credentialsRole: role,
            },
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            Integration: {
                Credentials: { 'Fn::GetAtt': ['MyRoleF48FFE04', 'Arn'] },
            },
        });
    });
    test('integration "credentialsPassthrough" can be used to passthrough user credentials to backend', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api', { deploy: false });
        // WHEN
        api.root.addMethod('GET', new apigw.Integration({
            type: apigw.IntegrationType.AWS_PROXY,
            options: {
                credentialsPassthrough: true,
            },
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            Integration: {
                Credentials: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::*:user/*']] },
            },
        });
    });
    test('methodResponse set one or more method responses via options', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api', { deploy: false });
        // WHEN
        new apigw.Method(stack, 'method-man', {
            httpMethod: 'GET',
            resource: api.root,
            options: {
                methodResponses: [{
                        statusCode: '200',
                    }, {
                        statusCode: '400',
                        responseParameters: {
                            'method.response.header.killerbees': false,
                        },
                    }, {
                        statusCode: '500',
                        responseParameters: {
                            'method.response.header.errthing': true,
                        },
                        responseModels: {
                            'application/json': apigw.Model.EMPTY_MODEL,
                            'text/plain': apigw.Model.ERROR_MODEL,
                        },
                    }],
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'GET',
            MethodResponses: [{
                    StatusCode: '200',
                }, {
                    StatusCode: '400',
                    ResponseParameters: {
                        'method.response.header.killerbees': false,
                    },
                }, {
                    StatusCode: '500',
                    ResponseParameters: {
                        'method.response.header.errthing': true,
                    },
                    ResponseModels: {
                        'application/json': 'Empty',
                        'text/plain': 'Error',
                    },
                }],
        });
    });
    test('multiple integration responses can be used', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api', { deploy: false });
        // WHEN
        api.root.addMethod('GET', new apigw.AwsIntegration({
            service: 'foo-service',
            action: 'BarAction',
            options: {
                integrationResponses: [
                    {
                        statusCode: '200',
                        responseTemplates: { 'application/json': JSON.stringify({ success: true }) },
                    },
                    {
                        selectionPattern: 'Invalid',
                        statusCode: '503',
                        responseTemplates: { 'application/json': JSON.stringify({ success: false, message: 'Invalid Request' }) },
                    },
                ],
            },
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            Integration: {
                IntegrationHttpMethod: 'POST',
                IntegrationResponses: [
                    {
                        ResponseTemplates: { 'application/json': '{"success":true}' },
                        StatusCode: '200',
                    },
                    {
                        ResponseTemplates: { 'application/json': '{"success":false,"message":"Invalid Request"}' },
                        SelectionPattern: 'Invalid',
                        StatusCode: '503',
                    },
                ],
                Type: 'AWS',
                Uri: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':apigateway:', { Ref: 'AWS::Region' }, ':foo-service:action/BarAction']] },
            },
        });
    });
    test('method is always set as uppercase', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'api');
        // WHEN
        api.root.addMethod('get');
        api.root.addMethod('PoSt');
        api.root.addMethod('PUT');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', { HttpMethod: 'POST' });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', { HttpMethod: 'GET' });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', { HttpMethod: 'PUT' });
    });
    test('requestModel can be set', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api', { deploy: false });
        const model = api.addModel('test-model', {
            contentType: 'application/json',
            modelName: 'test-model',
            schema: {
                title: 'test',
                type: apigw.JsonSchemaType.OBJECT,
                properties: { message: { type: apigw.JsonSchemaType.STRING } },
            },
        });
        // WHEN
        new apigw.Method(stack, 'method-man', {
            httpMethod: 'GET',
            resource: api.root,
            options: {
                requestModels: {
                    'application/json': model,
                },
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'GET',
            RequestModels: {
                'application/json': { Ref: stack.getLogicalId(model.node.findChild('Resource')) },
            },
        });
    });
    test('methodResponse has a mix of response modes', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api', { deploy: false });
        const htmlModel = api.addModel('my-model', {
            schema: {
                schema: apigw.JsonSchemaVersion.DRAFT4,
                title: 'test',
                type: apigw.JsonSchemaType.OBJECT,
                properties: { message: { type: apigw.JsonSchemaType.STRING } },
            },
        });
        // WHEN
        new apigw.Method(stack, 'method-man', {
            httpMethod: 'GET',
            resource: api.root,
            options: {
                methodResponses: [{
                        statusCode: '200',
                    }, {
                        statusCode: '400',
                        responseParameters: {
                            'method.response.header.killerbees': false,
                        },
                    }, {
                        statusCode: '500',
                        responseParameters: {
                            'method.response.header.errthing': true,
                        },
                        responseModels: {
                            'application/json': apigw.Model.EMPTY_MODEL,
                            'text/plain': apigw.Model.ERROR_MODEL,
                            'text/html': htmlModel,
                        },
                    }],
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'GET',
            MethodResponses: [{
                    StatusCode: '200',
                }, {
                    StatusCode: '400',
                    ResponseParameters: {
                        'method.response.header.killerbees': false,
                    },
                }, {
                    StatusCode: '500',
                    ResponseParameters: {
                        'method.response.header.errthing': true,
                    },
                    ResponseModels: {
                        'application/json': 'Empty',
                        'text/plain': 'Error',
                        'text/html': { Ref: stack.getLogicalId(htmlModel.node.findChild('Resource')) },
                    },
                }],
        });
    });
    test('method has a request validator', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api', { deploy: false });
        const validator = api.addRequestValidator('validator', {
            validateRequestBody: true,
            validateRequestParameters: false,
        });
        // WHEN
        new apigw.Method(stack, 'method-man', {
            httpMethod: 'GET',
            resource: api.root,
            options: {
                requestValidator: validator,
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            RequestValidatorId: { Ref: stack.getLogicalId(validator.node.findChild('Resource')) },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RequestValidator', {
            RestApiId: { Ref: stack.getLogicalId(api.node.findChild('Resource')) },
            ValidateRequestBody: true,
            ValidateRequestParameters: false,
        });
    });
    test('use default requestParameters', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api', {
            cloudWatchRole: false,
            deploy: false,
            defaultMethodOptions: {
                requestParameters: { 'method.request.path.proxy': true },
            },
        });
        // WHEN
        new apigw.Method(stack, 'defaultRequestParameters', {
            httpMethod: 'POST',
            resource: api.root,
            options: {
                operationName: 'defaultRequestParameters',
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            OperationName: 'defaultRequestParameters',
            RequestParameters: {
                'method.request.path.proxy': true,
            },
        });
    });
    test('authorizer is bound correctly', () => {
        const stack = new cdk.Stack();
        const restApi = new apigw.RestApi(stack, 'myrestapi');
        restApi.root.addMethod('ANY', undefined, {
            authorizer: DUMMY_AUTHORIZER,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'ANY',
            AuthorizationType: 'CUSTOM',
            AuthorizerId: DUMMY_AUTHORIZER.authorizerId,
        });
    });
    test('authorizer via default method options', () => {
        const stack = new cdk.Stack();
        const func = new lambda.Function(stack, 'myfunction', {
            handler: 'handler',
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_14_X,
        });
        const auth = new apigw.TokenAuthorizer(stack, 'myauthorizer1', {
            authorizerName: 'myauthorizer1',
            handler: func,
        });
        const restApi = new apigw.RestApi(stack, 'myrestapi', {
            defaultMethodOptions: {
                authorizer: auth,
            },
        });
        restApi.root.addMethod('ANY');
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Authorizer', {
            Name: 'myauthorizer1',
            Type: 'TOKEN',
            RestApiId: stack.resolve(restApi.restApiId),
        });
    });
    test('fails when authorization type does not match the authorizer', () => {
        const stack = new cdk.Stack();
        const restApi = new apigw.RestApi(stack, 'myrestapi');
        expect(() => {
            restApi.root.addMethod('ANY', undefined, {
                authorizationType: apigw.AuthorizationType.IAM,
                authorizer: DUMMY_AUTHORIZER,
            });
        }).toThrow(/Authorization type is set to AWS_IAM which is different from what is required by the authorizer/);
    });
    test('fails when authorization type does not match the authorizer in default method options', () => {
        const stack = new cdk.Stack();
        const restApi = new apigw.RestApi(stack, 'myrestapi', {
            defaultMethodOptions: {
                authorizer: DUMMY_AUTHORIZER,
            },
        });
        expect(() => {
            restApi.root.addMethod('ANY', undefined, {
                authorizationType: apigw.AuthorizationType.NONE,
            });
        }).toThrow(/Authorization type is set to NONE which is different from what is required by the authorizer/);
    });
    test('method has Auth Scopes', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
        // WHEN
        new apigw.Method(stack, 'my-method', {
            httpMethod: 'POST',
            resource: api.root,
            options: {
                apiKeyRequired: true,
                authorizationScopes: ['AuthScope1', 'AuthScope2'],
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            ApiKeyRequired: true,
            AuthorizationScopes: ['AuthScope1', 'AuthScope2'],
        });
    });
    test('use default Auth Scopes', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api', {
            cloudWatchRole: false,
            deploy: false,
            defaultMethodOptions: {
                authorizationScopes: ['DefaultAuth'],
            },
        });
        // WHEN
        new apigw.Method(stack, 'defaultAuthScopes', {
            httpMethod: 'POST',
            resource: api.root,
            options: {
                operationName: 'defaultAuthScopes',
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            OperationName: 'defaultAuthScopes',
            AuthorizationScopes: ['DefaultAuth'],
        });
    });
    test('Method options Auth Scopes is picked up', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api', {
            cloudWatchRole: false,
            deploy: false,
            defaultMethodOptions: {
                authorizationScopes: ['DefaultAuth'],
            },
        });
        // WHEN
        new apigw.Method(stack, 'MethodAuthScopeUsed', {
            httpMethod: 'POST',
            resource: api.root,
            options: {
                apiKeyRequired: true,
                authorizationScopes: ['MethodAuthScope'],
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            ApiKeyRequired: true,
            AuthorizationScopes: ['MethodAuthScope'],
        });
    });
    test('Auth Scopes absent', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api', {
            cloudWatchRole: false,
            deploy: false,
        });
        // WHEN
        new apigw.Method(stack, 'authScopesAbsent', {
            httpMethod: 'POST',
            resource: api.root,
            options: {
                operationName: 'authScopesAbsent',
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            OperationName: 'authScopesAbsent',
            AuthorizationScopes: assertions_1.Match.absent(),
        });
    });
    test('method has a request validator with provided properties', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api', { deploy: false });
        // WHEN
        new apigw.Method(stack, 'method-man', {
            httpMethod: 'GET',
            resource: api.root,
            options: {
                requestValidatorOptions: {
                    requestValidatorName: 'test-validator',
                    validateRequestBody: true,
                    validateRequestParameters: false,
                },
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RequestValidator', {
            RestApiId: stack.resolve(api.restApiId),
            ValidateRequestBody: true,
            ValidateRequestParameters: false,
            Name: 'test-validator',
        });
    });
    test('method does not have a request validator', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api', { deploy: false });
        // WHEN
        new apigw.Method(stack, 'method-man', {
            httpMethod: 'GET',
            resource: api.root,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            RequestValidatorId: assertions_1.Match.absent(),
        });
    });
    test('method does not support both request validator and request validator options', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigw.RestApi(stack, 'test-api', { deploy: false });
        const validator = api.addRequestValidator('test-validator1', {
            validateRequestBody: true,
            validateRequestParameters: false,
        });
        // WHEN
        const methodProps = {
            httpMethod: 'GET',
            resource: api.root,
            options: {
                requestValidatorOptions: {
                    requestValidatorName: 'test-validator2',
                    validateRequestBody: true,
                    validateRequestParameters: false,
                },
                requestValidator: validator,
            },
        };
        // THEN
        expect(() => new apigw.Method(stack, 'method', methodProps))
            .toThrow(/Only one of 'requestValidator' or 'requestValidatorOptions' must be specified./);
    });
    cdk_build_tools_1.testDeprecated('"restApi" and "api" properties return the RestApi correctly', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const api = new apigw.RestApi(stack, 'test-api');
        const method = api.root.addResource('pets').addMethod('GET');
        // THEN
        expect(method.restApi).toBeDefined();
        expect(method.api).toBeDefined();
        expect(stack.resolve(method.api.restApiId)).toEqual(stack.resolve(method.restApi.restApiId));
    });
    cdk_build_tools_1.testDeprecated('"restApi" throws an error on imported while "api" returns correctly', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const api = apigw.RestApi.fromRestApiAttributes(stack, 'test-api', {
            restApiId: 'test-rest-api-id',
            rootResourceId: 'test-root-resource-id',
        });
        const method = api.root.addResource('pets').addMethod('GET');
        // THEN
        expect(() => method.restApi).toThrow(/not available on Resource not connected to an instance of RestApi/);
        expect(method.api).toBeDefined();
    });
    describe('Metrics', () => {
        test('metric', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const api = new apigw.RestApi(stack, 'test-api');
            const method = api.root.addResource('pets').addMethod('GET');
            const metricName = '4XXError';
            const statistic = 'Sum';
            const metric = method.metric(metricName, api.deploymentStage, { statistic });
            // THEN
            expect(metric.namespace).toEqual('AWS/ApiGateway');
            expect(metric.metricName).toEqual(metricName);
            expect(metric.statistic).toEqual(statistic);
            expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
        });
        test('metricClientError', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const api = new apigw.RestApi(stack, 'test-api');
            const method = api.root.addResource('pets').addMethod('GET');
            const color = '#00ff00';
            const metric = method.metricClientError(api.deploymentStage, { color });
            // THEN
            expect(metric.metricName).toEqual('4XXError');
            expect(metric.statistic).toEqual('Sum');
            expect(metric.color).toEqual(color);
            expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
        });
        test('metricServerError', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const api = new apigw.RestApi(stack, 'test-api');
            const method = api.root.addResource('pets').addMethod('GET');
            const color = '#00ff00';
            const metric = method.metricServerError(api.deploymentStage, { color });
            // THEN
            expect(metric.metricName).toEqual('5XXError');
            expect(metric.statistic).toEqual('Sum');
            expect(metric.color).toEqual(color);
            expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
        });
        test('metricCacheHitCount', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const api = new apigw.RestApi(stack, 'test-api');
            const method = api.root.addResource('pets').addMethod('GET');
            const color = '#00ff00';
            const metric = method.metricCacheHitCount(api.deploymentStage, { color });
            // THEN
            expect(metric.metricName).toEqual('CacheHitCount');
            expect(metric.statistic).toEqual('Sum');
            expect(metric.color).toEqual(color);
            expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
        });
        test('metricCacheMissCount', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const api = new apigw.RestApi(stack, 'test-api');
            const method = api.root.addResource('pets').addMethod('GET');
            const color = '#00ff00';
            const metric = method.metricCacheMissCount(api.deploymentStage, { color });
            // THEN
            expect(metric.metricName).toEqual('CacheMissCount');
            expect(metric.statistic).toEqual('Sum');
            expect(metric.color).toEqual(color);
            expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
        });
        test('metricCount', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const api = new apigw.RestApi(stack, 'test-api');
            const method = api.root.addResource('pets').addMethod('GET');
            const color = '#00ff00';
            const metric = method.metricCount(api.deploymentStage, { color });
            // THEN
            expect(metric.metricName).toEqual('Count');
            expect(metric.statistic).toEqual('SampleCount');
            expect(metric.color).toEqual(color);
            expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
        });
        test('metricIntegrationLatency', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const api = new apigw.RestApi(stack, 'test-api');
            const method = api.root.addResource('pets').addMethod('GET');
            const color = '#00ff00';
            const metric = method.metricIntegrationLatency(api.deploymentStage, { color });
            // THEN
            expect(metric.metricName).toEqual('IntegrationLatency');
            expect(metric.statistic).toEqual('Average');
            expect(metric.color).toEqual(color);
            expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
        });
        test('metricLatency', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const api = new apigw.RestApi(stack, 'test-api');
            const method = api.root.addResource('pets').addMethod('GET');
            const color = '#00ff00';
            const metric = method.metricLatency(api.deploymentStage, { color });
            // THEN
            expect(metric.metricName).toEqual('Latency');
            expect(metric.statistic).toEqual('Average');
            expect(metric.color).toEqual(color);
            expect(metric.dimensions).toEqual({ ApiName: 'test-api', Method: 'GET', Resource: '/pets', Stage: api.deploymentStage.stageName });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0aG9kLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtZXRob2QudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCx3Q0FBd0M7QUFDeEMsOENBQThDO0FBQzlDLDhEQUEwRDtBQUMxRCxxQ0FBcUM7QUFDckMsZ0NBQWdDO0FBRWhDLE1BQU0sZ0JBQWdCLEdBQXNCO0lBQzFDLFlBQVksRUFBRSxpQkFBaUI7SUFDL0IsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE1BQU07Q0FDbEQsQ0FBQztBQUVGLFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO0lBQ3RCLElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1FBQ3pCLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFM0YsT0FBTztRQUNQLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFO1lBQ25DLFVBQVUsRUFBRSxNQUFNO1lBQ2xCLFFBQVEsRUFBRSxHQUFHLENBQUMsSUFBSTtTQUNuQixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMseUJBQXlCLEVBQUU7WUFDekUsVUFBVSxFQUFFLE1BQU07WUFDbEIsaUJBQWlCLEVBQUUsTUFBTTtZQUN6QixXQUFXLEVBQUU7Z0JBQ1gsSUFBSSxFQUFFLE1BQU07YUFDYjtTQUNGLENBQUMsQ0FBQztJQUdMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFB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LElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRTlCLE9BQU87WUFDUCxNQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM3RCxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUM7WUFDeEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUVwRSxPQUFPO1lBQ1AsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDN0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDNUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBQ3JJLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hdGNoLCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgdGVzdERlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgYXBpZ3cgZnJvbSAnLi4vbGliJztcblxuY29uc3QgRFVNTVlfQVVUSE9SSVpFUjogYXBpZ3cuSUF1dGhvcml6ZXIgPSB7XG4gIGF1dGhvcml6ZXJJZDogJ2R1bW15YXV0aG9yaXplcicsXG4gIGF1dGhvcml6YXRpb25UeXBlOiBhcGlndy5BdXRob3JpemF0aW9uVHlwZS5DVVNUT00sXG59O1xuXG5kZXNjcmliZSgnbWV0aG9kJywgKCkgPT4ge1xuICB0ZXN0KCdkZWZhdWx0IHNldHVwJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScsIHsgY2xvdWRXYXRjaFJvbGU6IGZhbHNlLCBkZXBsb3k6IGZhbHNlIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBhcGlndy5NZXRob2Qoc3RhY2ssICdteS1tZXRob2QnLCB7XG4gICAgICBodHRwTWV0aG9kOiAnUE9TVCcsXG4gICAgICByZXNvdXJjZTogYXBpLnJvb3QsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywge1xuICAgICAgSHR0cE1ldGhvZDogJ1BPU1QnLFxuICAgICAgQXV0aG9yaXphdGlvblR5cGU6ICdOT05FJyxcbiAgICAgIEludGVncmF0aW9uOiB7XG4gICAgICAgIFR5cGU6ICdNT0NLJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdtZXRob2Qgb3B0aW9ucyBjYW4gYmUgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScsIHsgY2xvdWRXYXRjaFJvbGU6IGZhbHNlLCBkZXBsb3k6IGZhbHNlIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBhcGlndy5NZXRob2Qoc3RhY2ssICdteS1tZXRob2QnLCB7XG4gICAgICBodHRwTWV0aG9kOiAnUE9TVCcsXG4gICAgICByZXNvdXJjZTogYXBpLnJvb3QsXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGFwaUtleVJlcXVpcmVkOiB0cnVlLFxuICAgICAgICBvcGVyYXRpb25OYW1lOiAnTXlPcGVyYXRpb24nLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCB7XG4gICAgICBBcGlLZXlSZXF1aXJlZDogdHJ1ZSxcbiAgICAgIE9wZXJhdGlvbk5hbWU6ICdNeU9wZXJhdGlvbicsXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdpbnRlZ3JhdGlvbiBjYW4gYmUgc2V0IHZpYSBhIHByb3BlcnR5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScsIHsgY2xvdWRXYXRjaFJvbGU6IGZhbHNlLCBkZXBsb3k6IGZhbHNlIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBhcGlndy5NZXRob2Qoc3RhY2ssICdteS1tZXRob2QnLCB7XG4gICAgICBodHRwTWV0aG9kOiAnUE9TVCcsXG4gICAgICByZXNvdXJjZTogYXBpLnJvb3QsXG4gICAgICBpbnRlZ3JhdGlvbjogbmV3IGFwaWd3LkF3c0ludGVncmF0aW9uKHsgc2VydmljZTogJ3MzJywgcGF0aDogJ2J1Y2tldC9rZXknIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIEludGVncmF0aW9uOiB7XG4gICAgICAgIEludGVncmF0aW9uSHR0cE1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBUeXBlOiAnQVdTJyxcbiAgICAgICAgVXJpOiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICdhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzphcGlnYXRld2F5OicsXG4gICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sICc6czM6cGF0aC9idWNrZXQva2V5JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdpbnRlZ3JhdGlvbiBjYW4gYmUgc2V0IGZvciBhIHNlcnZpY2UgaW4gdGhlIHByb3ZpZGVkIHJlZ2lvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAndGVzdC1hcGknLCB7IGNsb3VkV2F0Y2hSb2xlOiBmYWxzZSwgZGVwbG95OiBmYWxzZSB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgYXBpZ3cuTWV0aG9kKHN0YWNrLCAnbXktbWV0aG9kJywge1xuICAgICAgaHR0cE1ldGhvZDogJ1BPU1QnLFxuICAgICAgcmVzb3VyY2U6IGFwaS5yb290LFxuICAgICAgaW50ZWdyYXRpb246IG5ldyBhcGlndy5Bd3NJbnRlZ3JhdGlvbih7IHNlcnZpY2U6ICdzcXMnLCBwYXRoOiAncXVldWVOYW1lJywgcmVnaW9uOiAnZXUtd2VzdC0xJyB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCB7XG4gICAgICBJbnRlZ3JhdGlvbjoge1xuICAgICAgICBJbnRlZ3JhdGlvbkh0dHBNZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgVHlwZTogJ0FXUycsXG4gICAgICAgIFVyaToge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6YXBpZ2F0ZXdheTpldS13ZXN0LTE6c3FzOnBhdGgvcXVldWVOYW1lJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ludGVncmF0aW9uIHdpdGggYSBjdXN0b20gaHR0cCBtZXRob2QgY2FuIGJlIHNldCB2aWEgYSBwcm9wZXJ0eScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAndGVzdC1hcGknLCB7IGNsb3VkV2F0Y2hSb2xlOiBmYWxzZSwgZGVwbG95OiBmYWxzZSB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgYXBpZ3cuTWV0aG9kKHN0YWNrLCAnbXktbWV0aG9kJywge1xuICAgICAgaHR0cE1ldGhvZDogJ1BPU1QnLFxuICAgICAgcmVzb3VyY2U6IGFwaS5yb290LFxuICAgICAgaW50ZWdyYXRpb246IG5ldyBhcGlndy5Bd3NJbnRlZ3JhdGlvbih7IHNlcnZpY2U6ICdzMycsIHBhdGg6ICdidWNrZXQva2V5JywgaW50ZWdyYXRpb25IdHRwTWV0aG9kOiAnR0VUJyB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCB7XG4gICAgICBJbnRlZ3JhdGlvbjoge1xuICAgICAgICBJbnRlZ3JhdGlvbkh0dHBNZXRob2Q6ICdHRVQnLFxuICAgICAgfSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ3VzZSBkZWZhdWx0IGludGVncmF0aW9uIGZyb20gYXBpJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgZGVmYXVsdEludGVncmF0aW9uID0gbmV3IGFwaWd3LkludGVncmF0aW9uKHsgdHlwZTogYXBpZ3cuSW50ZWdyYXRpb25UeXBlLkhUVFBfUFJPWFksIHVyaTogJ2h0dHBzOi8vYW1hem9uLmNvbScgfSk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScsIHtcbiAgICAgIGNsb3VkV2F0Y2hSb2xlOiBmYWxzZSxcbiAgICAgIGRlcGxveTogZmFsc2UsXG4gICAgICBkZWZhdWx0SW50ZWdyYXRpb24sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGFwaWd3Lk1ldGhvZChzdGFjaywgJ215LW1ldGhvZCcsIHtcbiAgICAgIGh0dHBNZXRob2Q6ICdQT1NUJyxcbiAgICAgIHJlc291cmNlOiBhcGkucm9vdCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCB7XG4gICAgICBJbnRlZ3JhdGlvbjoge1xuICAgICAgICBUeXBlOiAnSFRUUF9QUk9YWScsXG4gICAgICAgIFVyaTogJ2h0dHBzOi8vYW1hem9uLmNvbScsXG4gICAgICB9LFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnXCJtZXRob2RBcm5cIiByZXR1cm5zIHRoZSBBUk4gZXhlY3V0ZS1hcGkgQVJOIGZvciB0aGlzIG1ldGhvZCBpbiB0aGUgY3VycmVudCBzdGFnZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAndGVzdC1hcGknKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBtZXRob2QgPSBuZXcgYXBpZ3cuTWV0aG9kKHN0YWNrLCAnbXktbWV0aG9kJywge1xuICAgICAgaHR0cE1ldGhvZDogJ1BPU1QnLFxuICAgICAgcmVzb3VyY2U6IGFwaS5yb290LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKG1ldGhvZC5tZXRob2RBcm4pKS50b0VxdWFsKHtcbiAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgJycsXG4gICAgICAgIFtcbiAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAnOmV4ZWN1dGUtYXBpOicsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAnOicsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAnOicsXG4gICAgICAgICAgeyBSZWY6ICd0ZXN0YXBpRDY0NTFGNzAnIH0sXG4gICAgICAgICAgJy8nLFxuICAgICAgICAgIHsgUmVmOiAndGVzdGFwaURlcGxveW1lbnRTdGFnZXByb2Q1QzlFOTJBNCcgfSxcbiAgICAgICAgICAnL1BPU1QvJyxcbiAgICAgICAgXSxcbiAgICAgIF0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdcInRlc3RNZXRob2RBcm5cIiByZXR1cm5zIHRoZSBBUk4gb2YgdGhlIFwidGVzdC1pbnZva2Utc3RhZ2VcIiBzdGFnZSAoY29uc29sZSBVSSknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ3Rlc3QtYXBpJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbWV0aG9kID0gbmV3IGFwaWd3Lk1ldGhvZChzdGFjaywgJ215LW1ldGhvZCcsIHtcbiAgICAgIGh0dHBNZXRob2Q6ICdQT1NUJyxcbiAgICAgIHJlc291cmNlOiBhcGkucm9vdCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShtZXRob2QudGVzdE1ldGhvZEFybikpLnRvRXF1YWwoe1xuICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAnJyxcbiAgICAgICAgW1xuICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICc6ZXhlY3V0ZS1hcGk6JyxcbiAgICAgICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICc6JyxcbiAgICAgICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgICAgICc6JyxcbiAgICAgICAgICB7IFJlZjogJ3Rlc3RhcGlENjQ1MUY3MCcgfSxcbiAgICAgICAgICAnL3Rlc3QtaW52b2tlLXN0YWdlL1BPU1QvJyxcbiAgICAgICAgXSxcbiAgICAgIF0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdcIm1ldGhvZEFyblwiIHJldHVybnMgYW4gYXJuIHdpdGggXCIqXCIgYXMgaXRzIHN0YWdlIHdoZW4gZGVwbG95bWVudFN0YWdlIGlzIG5vdCBzZXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ3Rlc3QtYXBpJywgeyBkZXBsb3k6IGZhbHNlIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IG1ldGhvZCA9IG5ldyBhcGlndy5NZXRob2Qoc3RhY2ssICdteS1tZXRob2QnLCB7IGh0dHBNZXRob2Q6ICdQT1NUJywgcmVzb3VyY2U6IGFwaS5yb290IH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKG1ldGhvZC5tZXRob2RBcm4pKS50b0VxdWFsKHtcbiAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgJycsXG4gICAgICAgIFtcbiAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAnOmV4ZWN1dGUtYXBpOicsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAnOicsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAnOicsXG4gICAgICAgICAgeyBSZWY6ICd0ZXN0YXBpRDY0NTFGNzAnIH0sXG4gICAgICAgICAgJy8qL1BPU1QvJyxcbiAgICAgICAgXSxcbiAgICAgIF0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdcIm1ldGhvZEFyblwiIGFuZCBcInRlc3RNZXRob2RBcm5cIiByZXBsYWNlIHBhdGggcGFyYW1ldGVycyB3aXRoIGFzdGVyaXNrcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ3Rlc3QtYXBpJyk7XG4gICAgY29uc3QgcGV0SWQgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgncGV0cycpLmFkZFJlc291cmNlKCd7cGV0SWR9Jyk7XG4gICAgY29uc3QgY29tbWVudElkID0gcGV0SWQuYWRkUmVzb3VyY2UoJ2NvbW1lbnRzJykuYWRkUmVzb3VyY2UoJ3tjb21tZW50SWR9Jyk7XG4gICAgY29uc3QgbWV0aG9kID0gY29tbWVudElkLmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShtZXRob2QubWV0aG9kQXJuKSkudG9FcXVhbCh7XG4gICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICcnLFxuICAgICAgICBbXG4gICAgICAgICAgJ2FybjonLFxuICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgJzpleGVjdXRlLWFwaTonLFxuICAgICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgJzonLFxuICAgICAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAgICAgJzonLFxuICAgICAgICAgIHsgUmVmOiAndGVzdGFwaUQ2NDUxRjcwJyB9LFxuICAgICAgICAgICcvJyxcbiAgICAgICAgICB7IFJlZjogJ3Rlc3RhcGlEZXBsb3ltZW50U3RhZ2Vwcm9kNUM5RTkyQTQnIH0sXG4gICAgICAgICAgJy9HRVQvcGV0cy8qL2NvbW1lbnRzLyonLFxuICAgICAgICBdLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKG1ldGhvZC50ZXN0TWV0aG9kQXJuKSkudG9FcXVhbCh7XG4gICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICcnLFxuICAgICAgICBbXG4gICAgICAgICAgJ2FybjonLFxuICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgJzpleGVjdXRlLWFwaTonLFxuICAgICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgJzonLFxuICAgICAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAgICAgJzonLFxuICAgICAgICAgIHsgUmVmOiAndGVzdGFwaUQ2NDUxRjcwJyB9LFxuICAgICAgICAgICcvdGVzdC1pbnZva2Utc3RhZ2UvR0VUL3BldHMvKi9jb21tZW50cy8qJyxcbiAgICAgICAgXSxcbiAgICAgIF0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdpbnRlZ3JhdGlvbiBcImNyZWRlbnRpYWxzUm9sZVwiIGNhbiBiZSB1c2VkIHRvIGFzc3VtZSBhIHJvbGUgd2hlbiBjYWxsaW5nIGJhY2tlbmQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ3Rlc3QtYXBpJywgeyBkZXBsb3k6IGZhbHNlIH0pO1xuICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdNeVJvbGUnLCB7IGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdmb28nKSB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcsIG5ldyBhcGlndy5JbnRlZ3JhdGlvbih7XG4gICAgICB0eXBlOiBhcGlndy5JbnRlZ3JhdGlvblR5cGUuQVdTX1BST1hZLFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICBjcmVkZW50aWFsc1JvbGU6IHJvbGUsXG4gICAgICB9LFxuICAgIH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCB7XG4gICAgICBJbnRlZ3JhdGlvbjoge1xuICAgICAgICBDcmVkZW50aWFsczogeyAnRm46OkdldEF0dCc6IFsnTXlSb2xlRjQ4RkZFMDQnLCAnQXJuJ10gfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnaW50ZWdyYXRpb24gXCJjcmVkZW50aWFsc1Bhc3N0aHJvdWdoXCIgY2FuIGJlIHVzZWQgdG8gcGFzc3Rocm91Z2ggdXNlciBjcmVkZW50aWFscyB0byBiYWNrZW5kJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScsIHsgZGVwbG95OiBmYWxzZSB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcsIG5ldyBhcGlndy5JbnRlZ3JhdGlvbih7XG4gICAgICB0eXBlOiBhcGlndy5JbnRlZ3JhdGlvblR5cGUuQVdTX1BST1hZLFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICBjcmVkZW50aWFsc1Bhc3N0aHJvdWdoOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywge1xuICAgICAgSW50ZWdyYXRpb246IHtcbiAgICAgICAgQ3JlZGVudGlhbHM6IHsgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOmlhbTo6Kjp1c2VyLyonXV0gfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnbWV0aG9kUmVzcG9uc2Ugc2V0IG9uZSBvciBtb3JlIG1ldGhvZCByZXNwb25zZXMgdmlhIG9wdGlvbnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ3Rlc3QtYXBpJywgeyBkZXBsb3k6IGZhbHNlIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBhcGlndy5NZXRob2Qoc3RhY2ssICdtZXRob2QtbWFuJywge1xuICAgICAgaHR0cE1ldGhvZDogJ0dFVCcsXG4gICAgICByZXNvdXJjZTogYXBpLnJvb3QsXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIG1ldGhvZFJlc3BvbnNlczogW3tcbiAgICAgICAgICBzdGF0dXNDb2RlOiAnMjAwJyxcbiAgICAgICAgfSwge1xuICAgICAgICAgIHN0YXR1c0NvZGU6ICc0MDAnLFxuICAgICAgICAgIHJlc3BvbnNlUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIua2lsbGVyYmVlcyc6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzdGF0dXNDb2RlOiAnNTAwJyxcbiAgICAgICAgICByZXNwb25zZVBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLmVycnRoaW5nJzogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlc3BvbnNlTW9kZWxzOiB7XG4gICAgICAgICAgICAnYXBwbGljYXRpb24vanNvbic6IGFwaWd3Lk1vZGVsLkVNUFRZX01PREVMLFxuICAgICAgICAgICAgJ3RleHQvcGxhaW4nOiBhcGlndy5Nb2RlbC5FUlJPUl9NT0RFTCxcbiAgICAgICAgICB9LFxuICAgICAgICB9XSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywge1xuICAgICAgSHR0cE1ldGhvZDogJ0dFVCcsXG4gICAgICBNZXRob2RSZXNwb25zZXM6IFt7XG4gICAgICAgIFN0YXR1c0NvZGU6ICcyMDAnLFxuICAgICAgfSwge1xuICAgICAgICBTdGF0dXNDb2RlOiAnNDAwJyxcbiAgICAgICAgUmVzcG9uc2VQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIua2lsbGVyYmVlcyc6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgfSwge1xuICAgICAgICBTdGF0dXNDb2RlOiAnNTAwJyxcbiAgICAgICAgUmVzcG9uc2VQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIuZXJydGhpbmcnOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBSZXNwb25zZU1vZGVsczoge1xuICAgICAgICAgICdhcHBsaWNhdGlvbi9qc29uJzogJ0VtcHR5JyxcbiAgICAgICAgICAndGV4dC9wbGFpbic6ICdFcnJvcicsXG4gICAgICAgIH0sXG4gICAgICB9XSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ211bHRpcGxlIGludGVncmF0aW9uIHJlc3BvbnNlcyBjYW4gYmUgdXNlZCcsICgpID0+IHsgLy8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1jZGsvaXNzdWVzLzE2MDhcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAndGVzdC1hcGknLCB7IGRlcGxveTogZmFsc2UgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnLCBuZXcgYXBpZ3cuQXdzSW50ZWdyYXRpb24oe1xuICAgICAgc2VydmljZTogJ2Zvby1zZXJ2aWNlJyxcbiAgICAgIGFjdGlvbjogJ0JhckFjdGlvbicsXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIGludGVncmF0aW9uUmVzcG9uc2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhdHVzQ29kZTogJzIwMCcsXG4gICAgICAgICAgICByZXNwb25zZVRlbXBsYXRlczogeyAnYXBwbGljYXRpb24vanNvbic6IEpTT04uc3RyaW5naWZ5KHsgc3VjY2VzczogdHJ1ZSB9KSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc2VsZWN0aW9uUGF0dGVybjogJ0ludmFsaWQnLFxuICAgICAgICAgICAgc3RhdHVzQ29kZTogJzUwMycsXG4gICAgICAgICAgICByZXNwb25zZVRlbXBsYXRlczogeyAnYXBwbGljYXRpb24vanNvbic6IEpTT04uc3RyaW5naWZ5KHsgc3VjY2VzczogZmFsc2UsIG1lc3NhZ2U6ICdJbnZhbGlkIFJlcXVlc3QnIH0pIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIEludGVncmF0aW9uOiB7XG4gICAgICAgIEludGVncmF0aW9uSHR0cE1ldGhvZDogJ1BPU1QnLFxuICAgICAgICBJbnRlZ3JhdGlvblJlc3BvbnNlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlc3BvbnNlVGVtcGxhdGVzOiB7ICdhcHBsaWNhdGlvbi9qc29uJzogJ3tcInN1Y2Nlc3NcIjp0cnVlfScgfSxcbiAgICAgICAgICAgIFN0YXR1c0NvZGU6ICcyMDAnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVzcG9uc2VUZW1wbGF0ZXM6IHsgJ2FwcGxpY2F0aW9uL2pzb24nOiAne1wic3VjY2Vzc1wiOmZhbHNlLFwibWVzc2FnZVwiOlwiSW52YWxpZCBSZXF1ZXN0XCJ9JyB9LFxuICAgICAgICAgICAgU2VsZWN0aW9uUGF0dGVybjogJ0ludmFsaWQnLFxuICAgICAgICAgICAgU3RhdHVzQ29kZTogJzUwMycsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVHlwZTogJ0FXUycsXG4gICAgICAgIFVyaTogeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6YXBpZ2F0ZXdheTonLCB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LCAnOmZvby1zZXJ2aWNlOmFjdGlvbi9CYXJBY3Rpb24nXV0gfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnbWV0aG9kIGlzIGFsd2F5cyBzZXQgYXMgdXBwZXJjYXNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICdhcGknKTtcblxuICAgIC8vIFdIRU5cbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ2dldCcpO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnUG9TdCcpO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnUFVUJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywgeyBIdHRwTWV0aG9kOiAnUE9TVCcgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywgeyBIdHRwTWV0aG9kOiAnR0VUJyB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCB7IEh0dHBNZXRob2Q6ICdQVVQnIH0pO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ3JlcXVlc3RNb2RlbCBjYW4gYmUgc2V0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScsIHsgZGVwbG95OiBmYWxzZSB9KTtcbiAgICBjb25zdCBtb2RlbCA9IGFwaS5hZGRNb2RlbCgndGVzdC1tb2RlbCcsIHtcbiAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICBtb2RlbE5hbWU6ICd0ZXN0LW1vZGVsJyxcbiAgICAgIHNjaGVtYToge1xuICAgICAgICB0aXRsZTogJ3Rlc3QnLFxuICAgICAgICB0eXBlOiBhcGlndy5Kc29uU2NoZW1hVHlwZS5PQkpFQ1QsXG4gICAgICAgIHByb3BlcnRpZXM6IHsgbWVzc2FnZTogeyB0eXBlOiBhcGlndy5Kc29uU2NoZW1hVHlwZS5TVFJJTkcgfSB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgYXBpZ3cuTWV0aG9kKHN0YWNrLCAnbWV0aG9kLW1hbicsIHtcbiAgICAgIGh0dHBNZXRob2Q6ICdHRVQnLFxuICAgICAgcmVzb3VyY2U6IGFwaS5yb290LFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICByZXF1ZXN0TW9kZWxzOiB7XG4gICAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiBtb2RlbCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywge1xuICAgICAgSHR0cE1ldGhvZDogJ0dFVCcsXG4gICAgICBSZXF1ZXN0TW9kZWxzOiB7XG4gICAgICAgICdhcHBsaWNhdGlvbi9qc29uJzogeyBSZWY6IHN0YWNrLmdldExvZ2ljYWxJZChtb2RlbC5ub2RlLmZpbmRDaGlsZCgnUmVzb3VyY2UnKSBhcyBjZGsuQ2ZuRWxlbWVudCkgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdtZXRob2RSZXNwb25zZSBoYXMgYSBtaXggb2YgcmVzcG9uc2UgbW9kZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ3Rlc3QtYXBpJywgeyBkZXBsb3k6IGZhbHNlIH0pO1xuICAgIGNvbnN0IGh0bWxNb2RlbCA9IGFwaS5hZGRNb2RlbCgnbXktbW9kZWwnLCB7XG4gICAgICBzY2hlbWE6IHtcbiAgICAgICAgc2NoZW1hOiBhcGlndy5Kc29uU2NoZW1hVmVyc2lvbi5EUkFGVDQsXG4gICAgICAgIHRpdGxlOiAndGVzdCcsXG4gICAgICAgIHR5cGU6IGFwaWd3Lkpzb25TY2hlbWFUeXBlLk9CSkVDVCxcbiAgICAgICAgcHJvcGVydGllczogeyBtZXNzYWdlOiB7IHR5cGU6IGFwaWd3Lkpzb25TY2hlbWFUeXBlLlNUUklORyB9IH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBhcGlndy5NZXRob2Qoc3RhY2ssICdtZXRob2QtbWFuJywge1xuICAgICAgaHR0cE1ldGhvZDogJ0dFVCcsXG4gICAgICByZXNvdXJjZTogYXBpLnJvb3QsXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIG1ldGhvZFJlc3BvbnNlczogW3tcbiAgICAgICAgICBzdGF0dXNDb2RlOiAnMjAwJyxcbiAgICAgICAgfSwge1xuICAgICAgICAgIHN0YXR1c0NvZGU6ICc0MDAnLFxuICAgICAgICAgIHJlc3BvbnNlUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgJ21ldGhvZC5yZXNwb25zZS5oZWFkZXIua2lsbGVyYmVlcyc6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzdGF0dXNDb2RlOiAnNTAwJyxcbiAgICAgICAgICByZXNwb25zZVBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLmVycnRoaW5nJzogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlc3BvbnNlTW9kZWxzOiB7XG4gICAgICAgICAgICAnYXBwbGljYXRpb24vanNvbic6IGFwaWd3Lk1vZGVsLkVNUFRZX01PREVMLFxuICAgICAgICAgICAgJ3RleHQvcGxhaW4nOiBhcGlndy5Nb2RlbC5FUlJPUl9NT0RFTCxcbiAgICAgICAgICAgICd0ZXh0L2h0bWwnOiBodG1sTW9kZWwsXG4gICAgICAgICAgfSxcbiAgICAgICAgfV0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIEh0dHBNZXRob2Q6ICdHRVQnLFxuICAgICAgTWV0aG9kUmVzcG9uc2VzOiBbe1xuICAgICAgICBTdGF0dXNDb2RlOiAnMjAwJyxcbiAgICAgIH0sIHtcbiAgICAgICAgU3RhdHVzQ29kZTogJzQwMCcsXG4gICAgICAgIFJlc3BvbnNlUGFyYW1ldGVyczoge1xuICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLmtpbGxlcmJlZXMnOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIH0sIHtcbiAgICAgICAgU3RhdHVzQ29kZTogJzUwMCcsXG4gICAgICAgIFJlc3BvbnNlUGFyYW1ldGVyczoge1xuICAgICAgICAgICdtZXRob2QucmVzcG9uc2UuaGVhZGVyLmVycnRoaW5nJzogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgUmVzcG9uc2VNb2RlbHM6IHtcbiAgICAgICAgICAnYXBwbGljYXRpb24vanNvbic6ICdFbXB0eScsXG4gICAgICAgICAgJ3RleHQvcGxhaW4nOiAnRXJyb3InLFxuICAgICAgICAgICd0ZXh0L2h0bWwnOiB7IFJlZjogc3RhY2suZ2V0TG9naWNhbElkKGh0bWxNb2RlbC5ub2RlLmZpbmRDaGlsZCgnUmVzb3VyY2UnKSBhcyBjZGsuQ2ZuRWxlbWVudCkgfSxcbiAgICAgICAgfSxcbiAgICAgIH1dLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnbWV0aG9kIGhhcyBhIHJlcXVlc3QgdmFsaWRhdG9yJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScsIHsgZGVwbG95OiBmYWxzZSB9KTtcbiAgICBjb25zdCB2YWxpZGF0b3IgPSBhcGkuYWRkUmVxdWVzdFZhbGlkYXRvcigndmFsaWRhdG9yJywge1xuICAgICAgdmFsaWRhdGVSZXF1ZXN0Qm9keTogdHJ1ZSxcbiAgICAgIHZhbGlkYXRlUmVxdWVzdFBhcmFtZXRlcnM6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBhcGlndy5NZXRob2Qoc3RhY2ssICdtZXRob2QtbWFuJywge1xuICAgICAgaHR0cE1ldGhvZDogJ0dFVCcsXG4gICAgICByZXNvdXJjZTogYXBpLnJvb3QsXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIHJlcXVlc3RWYWxpZGF0b3I6IHZhbGlkYXRvcixcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywge1xuICAgICAgUmVxdWVzdFZhbGlkYXRvcklkOiB7IFJlZjogc3RhY2suZ2V0TG9naWNhbElkKHZhbGlkYXRvci5ub2RlLmZpbmRDaGlsZCgnUmVzb3VyY2UnKSBhcyBjZGsuQ2ZuRWxlbWVudCkgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpSZXF1ZXN0VmFsaWRhdG9yJywge1xuICAgICAgUmVzdEFwaUlkOiB7IFJlZjogc3RhY2suZ2V0TG9naWNhbElkKGFwaS5ub2RlLmZpbmRDaGlsZCgnUmVzb3VyY2UnKSBhcyBjZGsuQ2ZuRWxlbWVudCkgfSxcbiAgICAgIFZhbGlkYXRlUmVxdWVzdEJvZHk6IHRydWUsXG4gICAgICBWYWxpZGF0ZVJlcXVlc3RQYXJhbWV0ZXJzOiBmYWxzZSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ3VzZSBkZWZhdWx0IHJlcXVlc3RQYXJhbWV0ZXJzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScsIHtcbiAgICAgIGNsb3VkV2F0Y2hSb2xlOiBmYWxzZSxcbiAgICAgIGRlcGxveTogZmFsc2UsXG4gICAgICBkZWZhdWx0TWV0aG9kT3B0aW9uczoge1xuICAgICAgICByZXF1ZXN0UGFyYW1ldGVyczogeyAnbWV0aG9kLnJlcXVlc3QucGF0aC5wcm94eSc6IHRydWUgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGFwaWd3Lk1ldGhvZChzdGFjaywgJ2RlZmF1bHRSZXF1ZXN0UGFyYW1ldGVycycsIHtcbiAgICAgIGh0dHBNZXRob2Q6ICdQT1NUJyxcbiAgICAgIHJlc291cmNlOiBhcGkucm9vdCxcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgb3BlcmF0aW9uTmFtZTogJ2RlZmF1bHRSZXF1ZXN0UGFyYW1ldGVycycsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIE9wZXJhdGlvbk5hbWU6ICdkZWZhdWx0UmVxdWVzdFBhcmFtZXRlcnMnLFxuICAgICAgUmVxdWVzdFBhcmFtZXRlcnM6IHtcbiAgICAgICAgJ21ldGhvZC5yZXF1ZXN0LnBhdGgucHJveHknOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2F1dGhvcml6ZXIgaXMgYm91bmQgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgcmVzdEFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnbXlyZXN0YXBpJyk7XG4gICAgcmVzdEFwaS5yb290LmFkZE1ldGhvZCgnQU5ZJywgdW5kZWZpbmVkLCB7XG4gICAgICBhdXRob3JpemVyOiBEVU1NWV9BVVRIT1JJWkVSLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywge1xuICAgICAgSHR0cE1ldGhvZDogJ0FOWScsXG4gICAgICBBdXRob3JpemF0aW9uVHlwZTogJ0NVU1RPTScsXG4gICAgICBBdXRob3JpemVySWQ6IERVTU1ZX0FVVEhPUklaRVIuYXV0aG9yaXplcklkLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnYXV0aG9yaXplciB2aWEgZGVmYXVsdCBtZXRob2Qgb3B0aW9ucycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IGZ1bmMgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnbXlmdW5jdGlvbicsIHtcbiAgICAgIGhhbmRsZXI6ICdoYW5kbGVyJyxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhdXRoID0gbmV3IGFwaWd3LlRva2VuQXV0aG9yaXplcihzdGFjaywgJ215YXV0aG9yaXplcjEnLCB7XG4gICAgICBhdXRob3JpemVyTmFtZTogJ215YXV0aG9yaXplcjEnLFxuICAgICAgaGFuZGxlcjogZnVuYyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc3RBcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ215cmVzdGFwaScsIHtcbiAgICAgIGRlZmF1bHRNZXRob2RPcHRpb25zOiB7XG4gICAgICAgIGF1dGhvcml6ZXI6IGF1dGgsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHJlc3RBcGkucm9vdC5hZGRNZXRob2QoJ0FOWScpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6QXV0aG9yaXplcicsIHtcbiAgICAgIE5hbWU6ICdteWF1dGhvcml6ZXIxJyxcbiAgICAgIFR5cGU6ICdUT0tFTicsXG4gICAgICBSZXN0QXBpSWQ6IHN0YWNrLnJlc29sdmUocmVzdEFwaS5yZXN0QXBpSWQpLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgd2hlbiBhdXRob3JpemF0aW9uIHR5cGUgZG9lcyBub3QgbWF0Y2ggdGhlIGF1dGhvcml6ZXInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCByZXN0QXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICdteXJlc3RhcGknKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICByZXN0QXBpLnJvb3QuYWRkTWV0aG9kKCdBTlknLCB1bmRlZmluZWQsIHtcbiAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IGFwaWd3LkF1dGhvcml6YXRpb25UeXBlLklBTSxcbiAgICAgICAgYXV0aG9yaXplcjogRFVNTVlfQVVUSE9SSVpFUixcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL0F1dGhvcml6YXRpb24gdHlwZSBpcyBzZXQgdG8gQVdTX0lBTSB3aGljaCBpcyBkaWZmZXJlbnQgZnJvbSB3aGF0IGlzIHJlcXVpcmVkIGJ5IHRoZSBhdXRob3JpemVyLyk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdmYWlscyB3aGVuIGF1dGhvcml6YXRpb24gdHlwZSBkb2VzIG5vdCBtYXRjaCB0aGUgYXV0aG9yaXplciBpbiBkZWZhdWx0IG1ldGhvZCBvcHRpb25zJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgcmVzdEFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnbXlyZXN0YXBpJywge1xuICAgICAgZGVmYXVsdE1ldGhvZE9wdGlvbnM6IHtcbiAgICAgICAgYXV0aG9yaXplcjogRFVNTVlfQVVUSE9SSVpFUixcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgcmVzdEFwaS5yb290LmFkZE1ldGhvZCgnQU5ZJywgdW5kZWZpbmVkLCB7XG4gICAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBhcGlndy5BdXRob3JpemF0aW9uVHlwZS5OT05FLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvQXV0aG9yaXphdGlvbiB0eXBlIGlzIHNldCB0byBOT05FIHdoaWNoIGlzIGRpZmZlcmVudCBmcm9tIHdoYXQgaXMgcmVxdWlyZWQgYnkgdGhlIGF1dGhvcml6ZXIvKTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ21ldGhvZCBoYXMgQXV0aCBTY29wZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ3Rlc3QtYXBpJywgeyBjbG91ZFdhdGNoUm9sZTogZmFsc2UsIGRlcGxveTogZmFsc2UgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGFwaWd3Lk1ldGhvZChzdGFjaywgJ215LW1ldGhvZCcsIHtcbiAgICAgIGh0dHBNZXRob2Q6ICdQT1NUJyxcbiAgICAgIHJlc291cmNlOiBhcGkucm9vdCxcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgYXBpS2V5UmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIGF1dGhvcml6YXRpb25TY29wZXM6IFsnQXV0aFNjb3BlMScsICdBdXRoU2NvcGUyJ10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIEFwaUtleVJlcXVpcmVkOiB0cnVlLFxuICAgICAgQXV0aG9yaXphdGlvblNjb3BlczogWydBdXRoU2NvcGUxJywgJ0F1dGhTY29wZTInXSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ3VzZSBkZWZhdWx0IEF1dGggU2NvcGVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScsIHtcbiAgICAgIGNsb3VkV2F0Y2hSb2xlOiBmYWxzZSxcbiAgICAgIGRlcGxveTogZmFsc2UsXG4gICAgICBkZWZhdWx0TWV0aG9kT3B0aW9uczoge1xuICAgICAgICBhdXRob3JpemF0aW9uU2NvcGVzOiBbJ0RlZmF1bHRBdXRoJ10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBhcGlndy5NZXRob2Qoc3RhY2ssICdkZWZhdWx0QXV0aFNjb3BlcycsIHtcbiAgICAgIGh0dHBNZXRob2Q6ICdQT1NUJyxcbiAgICAgIHJlc291cmNlOiBhcGkucm9vdCxcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgb3BlcmF0aW9uTmFtZTogJ2RlZmF1bHRBdXRoU2NvcGVzJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywge1xuICAgICAgT3BlcmF0aW9uTmFtZTogJ2RlZmF1bHRBdXRoU2NvcGVzJyxcbiAgICAgIEF1dGhvcml6YXRpb25TY29wZXM6IFsnRGVmYXVsdEF1dGgnXSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ01ldGhvZCBvcHRpb25zIEF1dGggU2NvcGVzIGlzIHBpY2tlZCB1cCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAndGVzdC1hcGknLCB7XG4gICAgICBjbG91ZFdhdGNoUm9sZTogZmFsc2UsXG4gICAgICBkZXBsb3k6IGZhbHNlLFxuICAgICAgZGVmYXVsdE1ldGhvZE9wdGlvbnM6IHtcbiAgICAgICAgYXV0aG9yaXphdGlvblNjb3BlczogWydEZWZhdWx0QXV0aCddLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgYXBpZ3cuTWV0aG9kKHN0YWNrLCAnTWV0aG9kQXV0aFNjb3BlVXNlZCcsIHtcbiAgICAgIGh0dHBNZXRob2Q6ICdQT1NUJyxcbiAgICAgIHJlc291cmNlOiBhcGkucm9vdCxcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgYXBpS2V5UmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIGF1dGhvcml6YXRpb25TY29wZXM6IFsnTWV0aG9kQXV0aFNjb3BlJ10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIEFwaUtleVJlcXVpcmVkOiB0cnVlLFxuICAgICAgQXV0aG9yaXphdGlvblNjb3BlczogWydNZXRob2RBdXRoU2NvcGUnXSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ0F1dGggU2NvcGVzIGFic2VudCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAndGVzdC1hcGknLCB7XG4gICAgICBjbG91ZFdhdGNoUm9sZTogZmFsc2UsXG4gICAgICBkZXBsb3k6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBhcGlndy5NZXRob2Qoc3RhY2ssICdhdXRoU2NvcGVzQWJzZW50Jywge1xuICAgICAgaHR0cE1ldGhvZDogJ1BPU1QnLFxuICAgICAgcmVzb3VyY2U6IGFwaS5yb290LFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICBvcGVyYXRpb25OYW1lOiAnYXV0aFNjb3Blc0Fic2VudCcsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIE9wZXJhdGlvbk5hbWU6ICdhdXRoU2NvcGVzQWJzZW50JyxcbiAgICAgIEF1dGhvcml6YXRpb25TY29wZXM6IE1hdGNoLmFic2VudCgpLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnbWV0aG9kIGhhcyBhIHJlcXVlc3QgdmFsaWRhdG9yIHdpdGggcHJvdmlkZWQgcHJvcGVydGllcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAndGVzdC1hcGknLCB7IGRlcGxveTogZmFsc2UgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGFwaWd3Lk1ldGhvZChzdGFjaywgJ21ldGhvZC1tYW4nLCB7XG4gICAgICBodHRwTWV0aG9kOiAnR0VUJyxcbiAgICAgIHJlc291cmNlOiBhcGkucm9vdCxcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgcmVxdWVzdFZhbGlkYXRvck9wdGlvbnM6IHtcbiAgICAgICAgICByZXF1ZXN0VmFsaWRhdG9yTmFtZTogJ3Rlc3QtdmFsaWRhdG9yJyxcbiAgICAgICAgICB2YWxpZGF0ZVJlcXVlc3RCb2R5OiB0cnVlLFxuICAgICAgICAgIHZhbGlkYXRlUmVxdWVzdFBhcmFtZXRlcnM6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpSZXF1ZXN0VmFsaWRhdG9yJywge1xuICAgICAgUmVzdEFwaUlkOiBzdGFjay5yZXNvbHZlKGFwaS5yZXN0QXBpSWQpLFxuICAgICAgVmFsaWRhdGVSZXF1ZXN0Qm9keTogdHJ1ZSxcbiAgICAgIFZhbGlkYXRlUmVxdWVzdFBhcmFtZXRlcnM6IGZhbHNlLFxuICAgICAgTmFtZTogJ3Rlc3QtdmFsaWRhdG9yJyxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ21ldGhvZCBkb2VzIG5vdCBoYXZlIGEgcmVxdWVzdCB2YWxpZGF0b3InLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ3Rlc3QtYXBpJywgeyBkZXBsb3k6IGZhbHNlIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBhcGlndy5NZXRob2Qoc3RhY2ssICdtZXRob2QtbWFuJywge1xuICAgICAgaHR0cE1ldGhvZDogJ0dFVCcsXG4gICAgICByZXNvdXJjZTogYXBpLnJvb3QsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywge1xuICAgICAgUmVxdWVzdFZhbGlkYXRvcklkOiBNYXRjaC5hYnNlbnQoKSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ21ldGhvZCBkb2VzIG5vdCBzdXBwb3J0IGJvdGggcmVxdWVzdCB2YWxpZGF0b3IgYW5kIHJlcXVlc3QgdmFsaWRhdG9yIG9wdGlvbnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ3Rlc3QtYXBpJywgeyBkZXBsb3k6IGZhbHNlIH0pO1xuICAgIGNvbnN0IHZhbGlkYXRvciA9IGFwaS5hZGRSZXF1ZXN0VmFsaWRhdG9yKCd0ZXN0LXZhbGlkYXRvcjEnLCB7XG4gICAgICB2YWxpZGF0ZVJlcXVlc3RCb2R5OiB0cnVlLFxuICAgICAgdmFsaWRhdGVSZXF1ZXN0UGFyYW1ldGVyczogZmFsc2UsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgbWV0aG9kUHJvcHMgPSB7XG4gICAgICBodHRwTWV0aG9kOiAnR0VUJyxcbiAgICAgIHJlc291cmNlOiBhcGkucm9vdCxcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgcmVxdWVzdFZhbGlkYXRvck9wdGlvbnM6IHtcbiAgICAgICAgICByZXF1ZXN0VmFsaWRhdG9yTmFtZTogJ3Rlc3QtdmFsaWRhdG9yMicsXG4gICAgICAgICAgdmFsaWRhdGVSZXF1ZXN0Qm9keTogdHJ1ZSxcbiAgICAgICAgICB2YWxpZGF0ZVJlcXVlc3RQYXJhbWV0ZXJzOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgcmVxdWVzdFZhbGlkYXRvcjogdmFsaWRhdG9yLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBuZXcgYXBpZ3cuTWV0aG9kKHN0YWNrLCAnbWV0aG9kJywgbWV0aG9kUHJvcHMpKVxuICAgICAgLnRvVGhyb3coL09ubHkgb25lIG9mICdyZXF1ZXN0VmFsaWRhdG9yJyBvciAncmVxdWVzdFZhbGlkYXRvck9wdGlvbnMnIG11c3QgYmUgc3BlY2lmaWVkLi8pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ1wicmVzdEFwaVwiIGFuZCBcImFwaVwiIHByb3BlcnRpZXMgcmV0dXJuIHRoZSBSZXN0QXBpIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAndGVzdC1hcGknKTtcbiAgICBjb25zdCBtZXRob2QgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgncGV0cycpLmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KG1ldGhvZC5yZXN0QXBpKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdChtZXRob2QuYXBpKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKG1ldGhvZC5hcGkucmVzdEFwaUlkKSkudG9FcXVhbChzdGFjay5yZXNvbHZlKG1ldGhvZC5yZXN0QXBpLnJlc3RBcGlJZCkpO1xuXG5cbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ1wicmVzdEFwaVwiIHRocm93cyBhbiBlcnJvciBvbiBpbXBvcnRlZCB3aGlsZSBcImFwaVwiIHJldHVybnMgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXBpID0gYXBpZ3cuUmVzdEFwaS5mcm9tUmVzdEFwaUF0dHJpYnV0ZXMoc3RhY2ssICd0ZXN0LWFwaScsIHtcbiAgICAgIHJlc3RBcGlJZDogJ3Rlc3QtcmVzdC1hcGktaWQnLFxuICAgICAgcm9vdFJlc291cmNlSWQ6ICd0ZXN0LXJvb3QtcmVzb3VyY2UtaWQnLFxuICAgIH0pO1xuICAgIGNvbnN0IG1ldGhvZCA9IGFwaS5yb290LmFkZFJlc291cmNlKCdwZXRzJykuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gbWV0aG9kLnJlc3RBcGkpLnRvVGhyb3coL25vdCBhdmFpbGFibGUgb24gUmVzb3VyY2Ugbm90IGNvbm5lY3RlZCB0byBhbiBpbnN0YW5jZSBvZiBSZXN0QXBpLyk7XG4gICAgZXhwZWN0KG1ldGhvZC5hcGkpLnRvQmVEZWZpbmVkKCk7XG5cblxuICB9KTtcblxuICBkZXNjcmliZSgnTWV0cmljcycsICgpID0+IHtcbiAgICB0ZXN0KCdtZXRyaWMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAndGVzdC1hcGknKTtcbiAgICAgIGNvbnN0IG1ldGhvZCA9IGFwaS5yb290LmFkZFJlc291cmNlKCdwZXRzJykuYWRkTWV0aG9kKCdHRVQnKTtcbiAgICAgIGNvbnN0IG1ldHJpY05hbWUgPSAnNFhYRXJyb3InO1xuICAgICAgY29uc3Qgc3RhdGlzdGljID0gJ1N1bSc7XG4gICAgICBjb25zdCBtZXRyaWMgPSBtZXRob2QubWV0cmljKG1ldHJpY05hbWUsIGFwaS5kZXBsb3ltZW50U3RhZ2UsIHsgc3RhdGlzdGljIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QobWV0cmljLm5hbWVzcGFjZSkudG9FcXVhbCgnQVdTL0FwaUdhdGV3YXknKTtcbiAgICAgIGV4cGVjdChtZXRyaWMubWV0cmljTmFtZSkudG9FcXVhbChtZXRyaWNOYW1lKTtcbiAgICAgIGV4cGVjdChtZXRyaWMuc3RhdGlzdGljKS50b0VxdWFsKHN0YXRpc3RpYyk7XG4gICAgICBleHBlY3QobWV0cmljLmRpbWVuc2lvbnMpLnRvRXF1YWwoeyBBcGlOYW1lOiAndGVzdC1hcGknLCBNZXRob2Q6ICdHRVQnLCBSZXNvdXJjZTogJy9wZXRzJywgU3RhZ2U6IGFwaS5kZXBsb3ltZW50U3RhZ2Uuc3RhZ2VOYW1lIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbWV0cmljQ2xpZW50RXJyb3InLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAndGVzdC1hcGknKTtcbiAgICAgIGNvbnN0IG1ldGhvZCA9IGFwaS5yb290LmFkZFJlc291cmNlKCdwZXRzJykuYWRkTWV0aG9kKCdHRVQnKTtcbiAgICAgIGNvbnN0IGNvbG9yID0gJyMwMGZmMDAnO1xuICAgICAgY29uc3QgbWV0cmljID0gbWV0aG9kLm1ldHJpY0NsaWVudEVycm9yKGFwaS5kZXBsb3ltZW50U3RhZ2UsIHsgY29sb3IgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChtZXRyaWMubWV0cmljTmFtZSkudG9FcXVhbCgnNFhYRXJyb3InKTtcbiAgICAgIGV4cGVjdChtZXRyaWMuc3RhdGlzdGljKS50b0VxdWFsKCdTdW0nKTtcbiAgICAgIGV4cGVjdChtZXRyaWMuY29sb3IpLnRvRXF1YWwoY29sb3IpO1xuICAgICAgZXhwZWN0KG1ldHJpYy5kaW1lbnNpb25zKS50b0VxdWFsKHsgQXBpTmFtZTogJ3Rlc3QtYXBpJywgTWV0aG9kOiAnR0VUJywgUmVzb3VyY2U6ICcvcGV0cycsIFN0YWdlOiBhcGkuZGVwbG95bWVudFN0YWdlLnN0YWdlTmFtZSB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ21ldHJpY1NlcnZlckVycm9yJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ3Rlc3QtYXBpJyk7XG4gICAgICBjb25zdCBtZXRob2QgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgncGV0cycpLmFkZE1ldGhvZCgnR0VUJyk7XG4gICAgICBjb25zdCBjb2xvciA9ICcjMDBmZjAwJztcbiAgICAgIGNvbnN0IG1ldHJpYyA9IG1ldGhvZC5tZXRyaWNTZXJ2ZXJFcnJvcihhcGkuZGVwbG95bWVudFN0YWdlLCB7IGNvbG9yIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QobWV0cmljLm1ldHJpY05hbWUpLnRvRXF1YWwoJzVYWEVycm9yJyk7XG4gICAgICBleHBlY3QobWV0cmljLnN0YXRpc3RpYykudG9FcXVhbCgnU3VtJyk7XG4gICAgICBleHBlY3QobWV0cmljLmNvbG9yKS50b0VxdWFsKGNvbG9yKTtcbiAgICAgIGV4cGVjdChtZXRyaWMuZGltZW5zaW9ucykudG9FcXVhbCh7IEFwaU5hbWU6ICd0ZXN0LWFwaScsIE1ldGhvZDogJ0dFVCcsIFJlc291cmNlOiAnL3BldHMnLCBTdGFnZTogYXBpLmRlcGxveW1lbnRTdGFnZS5zdGFnZU5hbWUgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdtZXRyaWNDYWNoZUhpdENvdW50JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ3Rlc3QtYXBpJyk7XG4gICAgICBjb25zdCBtZXRob2QgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgncGV0cycpLmFkZE1ldGhvZCgnR0VUJyk7XG4gICAgICBjb25zdCBjb2xvciA9ICcjMDBmZjAwJztcbiAgICAgIGNvbnN0IG1ldHJpYyA9IG1ldGhvZC5tZXRyaWNDYWNoZUhpdENvdW50KGFwaS5kZXBsb3ltZW50U3RhZ2UsIHsgY29sb3IgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChtZXRyaWMubWV0cmljTmFtZSkudG9FcXVhbCgnQ2FjaGVIaXRDb3VudCcpO1xuICAgICAgZXhwZWN0KG1ldHJpYy5zdGF0aXN0aWMpLnRvRXF1YWwoJ1N1bScpO1xuICAgICAgZXhwZWN0KG1ldHJpYy5jb2xvcikudG9FcXVhbChjb2xvcik7XG4gICAgICBleHBlY3QobWV0cmljLmRpbWVuc2lvbnMpLnRvRXF1YWwoeyBBcGlOYW1lOiAndGVzdC1hcGknLCBNZXRob2Q6ICdHRVQnLCBSZXNvdXJjZTogJy9wZXRzJywgU3RhZ2U6IGFwaS5kZXBsb3ltZW50U3RhZ2Uuc3RhZ2VOYW1lIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbWV0cmljQ2FjaGVNaXNzQ291bnQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAndGVzdC1hcGknKTtcbiAgICAgIGNvbnN0IG1ldGhvZCA9IGFwaS5yb290LmFkZFJlc291cmNlKCdwZXRzJykuYWRkTWV0aG9kKCdHRVQnKTtcbiAgICAgIGNvbnN0IGNvbG9yID0gJyMwMGZmMDAnO1xuICAgICAgY29uc3QgbWV0cmljID0gbWV0aG9kLm1ldHJpY0NhY2hlTWlzc0NvdW50KGFwaS5kZXBsb3ltZW50U3RhZ2UsIHsgY29sb3IgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChtZXRyaWMubWV0cmljTmFtZSkudG9FcXVhbCgnQ2FjaGVNaXNzQ291bnQnKTtcbiAgICAgIGV4cGVjdChtZXRyaWMuc3RhdGlzdGljKS50b0VxdWFsKCdTdW0nKTtcbiAgICAgIGV4cGVjdChtZXRyaWMuY29sb3IpLnRvRXF1YWwoY29sb3IpO1xuICAgICAgZXhwZWN0KG1ldHJpYy5kaW1lbnNpb25zKS50b0VxdWFsKHsgQXBpTmFtZTogJ3Rlc3QtYXBpJywgTWV0aG9kOiAnR0VUJywgUmVzb3VyY2U6ICcvcGV0cycsIFN0YWdlOiBhcGkuZGVwbG95bWVudFN0YWdlLnN0YWdlTmFtZSB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ21ldHJpY0NvdW50JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ3Rlc3QtYXBpJyk7XG4gICAgICBjb25zdCBtZXRob2QgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgncGV0cycpLmFkZE1ldGhvZCgnR0VUJyk7XG4gICAgICBjb25zdCBjb2xvciA9ICcjMDBmZjAwJztcbiAgICAgIGNvbnN0IG1ldHJpYyA9IG1ldGhvZC5tZXRyaWNDb3VudChhcGkuZGVwbG95bWVudFN0YWdlLCB7IGNvbG9yIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QobWV0cmljLm1ldHJpY05hbWUpLnRvRXF1YWwoJ0NvdW50Jyk7XG4gICAgICBleHBlY3QobWV0cmljLnN0YXRpc3RpYykudG9FcXVhbCgnU2FtcGxlQ291bnQnKTtcbiAgICAgIGV4cGVjdChtZXRyaWMuY29sb3IpLnRvRXF1YWwoY29sb3IpO1xuICAgICAgZXhwZWN0KG1ldHJpYy5kaW1lbnNpb25zKS50b0VxdWFsKHsgQXBpTmFtZTogJ3Rlc3QtYXBpJywgTWV0aG9kOiAnR0VUJywgUmVzb3VyY2U6ICcvcGV0cycsIFN0YWdlOiBhcGkuZGVwbG95bWVudFN0YWdlLnN0YWdlTmFtZSB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ21ldHJpY0ludGVncmF0aW9uTGF0ZW5jeScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScpO1xuICAgICAgY29uc3QgbWV0aG9kID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ3BldHMnKS5hZGRNZXRob2QoJ0dFVCcpO1xuICAgICAgY29uc3QgY29sb3IgPSAnIzAwZmYwMCc7XG4gICAgICBjb25zdCBtZXRyaWMgPSBtZXRob2QubWV0cmljSW50ZWdyYXRpb25MYXRlbmN5KGFwaS5kZXBsb3ltZW50U3RhZ2UsIHsgY29sb3IgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChtZXRyaWMubWV0cmljTmFtZSkudG9FcXVhbCgnSW50ZWdyYXRpb25MYXRlbmN5Jyk7XG4gICAgICBleHBlY3QobWV0cmljLnN0YXRpc3RpYykudG9FcXVhbCgnQXZlcmFnZScpO1xuICAgICAgZXhwZWN0KG1ldHJpYy5jb2xvcikudG9FcXVhbChjb2xvcik7XG4gICAgICBleHBlY3QobWV0cmljLmRpbWVuc2lvbnMpLnRvRXF1YWwoeyBBcGlOYW1lOiAndGVzdC1hcGknLCBNZXRob2Q6ICdHRVQnLCBSZXNvdXJjZTogJy9wZXRzJywgU3RhZ2U6IGFwaS5kZXBsb3ltZW50U3RhZ2Uuc3RhZ2VOYW1lIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbWV0cmljTGF0ZW5jeScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScpO1xuICAgICAgY29uc3QgbWV0aG9kID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ3BldHMnKS5hZGRNZXRob2QoJ0dFVCcpO1xuICAgICAgY29uc3QgY29sb3IgPSAnIzAwZmYwMCc7XG4gICAgICBjb25zdCBtZXRyaWMgPSBtZXRob2QubWV0cmljTGF0ZW5jeShhcGkuZGVwbG95bWVudFN0YWdlLCB7IGNvbG9yIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QobWV0cmljLm1ldHJpY05hbWUpLnRvRXF1YWwoJ0xhdGVuY3knKTtcbiAgICAgIGV4cGVjdChtZXRyaWMuc3RhdGlzdGljKS50b0VxdWFsKCdBdmVyYWdlJyk7XG4gICAgICBleHBlY3QobWV0cmljLmNvbG9yKS50b0VxdWFsKGNvbG9yKTtcbiAgICAgIGV4cGVjdChtZXRyaWMuZGltZW5zaW9ucykudG9FcXVhbCh7IEFwaU5hbWU6ICd0ZXN0LWFwaScsIE1ldGhvZDogJ0dFVCcsIFJlc291cmNlOiAnL3BldHMnLCBTdGFnZTogYXBpLmRlcGxveW1lbnRTdGFnZS5zdGFnZU5hbWUgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=