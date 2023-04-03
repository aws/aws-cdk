"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const core_1 = require("@aws-cdk/core");
const apigw = require("../lib");
describe('restapi', () => {
    test('minimal setup', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const api = new apigw.RestApi(stack, 'my-api');
        api.root.addMethod('GET'); // must have at least one method or an API definition
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                myapi4C7BF186: {
                    Type: 'AWS::ApiGateway::RestApi',
                    Properties: {
                        Name: 'my-api',
                    },
                },
                myapiGETF990CE3C: {
                    Type: 'AWS::ApiGateway::Method',
                    Properties: {
                        HttpMethod: 'GET',
                        ResourceId: { 'Fn::GetAtt': ['myapi4C7BF186', 'RootResourceId'] },
                        RestApiId: { Ref: 'myapi4C7BF186' },
                        AuthorizationType: 'NONE',
                        Integration: {
                            Type: 'MOCK',
                        },
                    },
                },
                myapiDeployment92F2CB4972a890db5063ec679071ba7eefc76f2a: {
                    Type: 'AWS::ApiGateway::Deployment',
                    Properties: {
                        RestApiId: { Ref: 'myapi4C7BF186' },
                        Description: 'Automatically created by the RestApi construct',
                    },
                    DependsOn: ['myapiGETF990CE3C'],
                },
                myapiDeploymentStageprod298F01AF: {
                    Type: 'AWS::ApiGateway::Stage',
                    Properties: {
                        RestApiId: { Ref: 'myapi4C7BF186' },
                        DeploymentId: { Ref: 'myapiDeployment92F2CB4972a890db5063ec679071ba7eefc76f2a' },
                        StageName: 'prod',
                    },
                    DependsOn: ['myapiAccountEC421A0A'],
                },
                myapiCloudWatchRole095452E5: {
                    Type: 'AWS::IAM::Role',
                    DeletionPolicy: 'Retain',
                    Properties: {
                        AssumeRolePolicyDocument: {
                            Statement: [
                                {
                                    Action: 'sts:AssumeRole',
                                    Effect: 'Allow',
                                    Principal: { Service: 'apigateway.amazonaws.com' },
                                },
                            ],
                            Version: '2012-10-17',
                        },
                        ManagedPolicyArns: [
                            { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs']] },
                        ],
                    },
                },
                myapiAccountEC421A0A: {
                    Type: 'AWS::ApiGateway::Account',
                    DeletionPolicy: 'Retain',
                    Properties: {
                        CloudWatchRoleArn: { 'Fn::GetAtt': ['myapiCloudWatchRole095452E5', 'Arn'] },
                    },
                    DependsOn: ['myapi4C7BF186'],
                },
            },
            Outputs: {
                myapiEndpoint3628AFE3: {
                    Value: {
                        'Fn::Join': ['', [
                                'https://',
                                { Ref: 'myapi4C7BF186' },
                                '.execute-api.',
                                { Ref: 'AWS::Region' },
                                '.',
                                { Ref: 'AWS::URLSuffix' },
                                '/',
                                { Ref: 'myapiDeploymentStageprod298F01AF' },
                                '/',
                            ]],
                    },
                },
            },
        });
    });
    test('restApiName is set correctly', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const myapi = new apigw.RestApi(stack, 'myapi');
        const yourapi = new apigw.RestApi(stack, 'yourapi', {
            restApiName: 'namedapi',
        });
        // THEN
        expect(myapi.restApiName).toEqual('myapi');
        expect(yourapi.restApiName).toEqual('namedapi');
    });
    test('defaultChild is set correctly', () => {
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'my-api');
        expect(api.node.defaultChild instanceof apigw.CfnRestApi).toBeDefined();
    });
    test('"name" is defaulted to resource physical name', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const api = new apigw.RestApi(stack, 'restapi', {
            deploy: false,
            cloudWatchRole: false,
        });
        api.root.addMethod('GET');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
            Name: 'restapi',
        });
    });
    test('fails in synthesis if there are no methods or definition', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'my-stack');
        const api = new apigw.RestApi(stack, 'API');
        // WHEN
        api.root.addResource('foo');
        api.root.addResource('bar').addResource('goo');
        // THEN
        expect(() => app.synth()).toThrow(/The REST API doesn't contain any methods/);
    });
    test('"addResource" can be used on "IRestApiResource" to form a tree', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'restapi', {
            deploy: false,
            cloudWatchRole: false,
            restApiName: 'my-rest-api',
        });
        api.root.addMethod('GET');
        // WHEN
        const foo = api.root.addResource('foo');
        api.root.addResource('bar');
        foo.addResource('{hello}');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', {
            PathPart: 'foo',
            ParentId: { 'Fn::GetAtt': ['restapiC5611D27', 'RootResourceId'] },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', {
            PathPart: 'bar',
            ParentId: { 'Fn::GetAtt': ['restapiC5611D27', 'RootResourceId'] },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', {
            PathPart: '{hello}',
            ParentId: { Ref: 'restapifooF697E056' },
        });
    });
    test('"addResource" allows configuration of proxy paths', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'restapi', {
            deploy: false,
            cloudWatchRole: false,
            restApiName: 'my-rest-api',
        });
        // WHEN
        const proxy = api.root.addResource('{proxy+}');
        proxy.addMethod('ANY');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', {
            PathPart: '{proxy+}',
            ParentId: { 'Fn::GetAtt': ['restapiC5611D27', 'RootResourceId'] },
        });
    });
    test('"addMethod" can be used to add methods to resources', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'restapi', { deploy: false, cloudWatchRole: false });
        const r1 = api.root.addResource('r1');
        // WHEN
        api.root.addMethod('GET');
        r1.addMethod('POST');
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                restapiC5611D27: {
                    Type: 'AWS::ApiGateway::RestApi',
                    Properties: {
                        Name: 'restapi',
                    },
                },
                restapir1CF2997EA: {
                    Type: 'AWS::ApiGateway::Resource',
                    Properties: {
                        ParentId: {
                            'Fn::GetAtt': [
                                'restapiC5611D27',
                                'RootResourceId',
                            ],
                        },
                        PathPart: 'r1',
                        RestApiId: {
                            Ref: 'restapiC5611D27',
                        },
                    },
                },
                restapir1POST766920C4: {
                    Type: 'AWS::ApiGateway::Method',
                    Properties: {
                        HttpMethod: 'POST',
                        ResourceId: {
                            Ref: 'restapir1CF2997EA',
                        },
                        RestApiId: {
                            Ref: 'restapiC5611D27',
                        },
                        AuthorizationType: 'NONE',
                        Integration: {
                            Type: 'MOCK',
                        },
                    },
                },
                restapiGET6FC1785A: {
                    Type: 'AWS::ApiGateway::Method',
                    Properties: {
                        HttpMethod: 'GET',
                        ResourceId: {
                            'Fn::GetAtt': [
                                'restapiC5611D27',
                                'RootResourceId',
                            ],
                        },
                        RestApiId: {
                            Ref: 'restapiC5611D27',
                        },
                        AuthorizationType: 'NONE',
                        Integration: {
                            Type: 'MOCK',
                        },
                    },
                },
            },
        });
    });
    test('resourcePath returns the full path of the resource within the API', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'restapi');
        // WHEN
        const r1 = api.root.addResource('r1');
        const r11 = r1.addResource('r1_1');
        const r12 = r1.addResource('r1_2');
        const r121 = r12.addResource('r1_2_1');
        const r2 = api.root.addResource('r2');
        // THEN
        expect(api.root.path).toEqual('/');
        expect(r1.path).toEqual('/r1');
        expect(r11.path).toEqual('/r1/r1_1');
        expect(r12.path).toEqual('/r1/r1_2');
        expect(r121.path).toEqual('/r1/r1_2/r1_2_1');
        expect(r2.path).toEqual('/r2');
    });
    test('resource path part validation', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'restapi');
        // THEN
        expect(() => api.root.addResource('foo/')).toThrow();
        api.root.addResource('boom-bam');
        expect(() => api.root.addResource('illegal()')).toThrow();
        api.root.addResource('{foo}');
        expect(() => api.root.addResource('foo{bar}')).toThrow();
    });
    test('fails if "deployOptions" is set with "deploy" disabled', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // THEN
        expect(() => new apigw.RestApi(stack, 'myapi', {
            deploy: false,
            deployOptions: { cachingEnabled: true },
        })).toThrow(/Cannot set 'deployOptions' if 'deploy' is disabled/);
    });
    test('CloudWatch role is created for API Gateway', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'myapi');
        api.root.addMethod('GET');
        // THEN
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ApiGateway::Account', 1);
    });
    test('featureFlag @aws-cdk/aws-apigateway:disableCloudWatchRole CloudWatch role is not created created for API Gateway', () => {
        // GIVEN
        const app = new core_1.App({
            context: {
                '@aws-cdk/aws-apigateway:disableCloudWatchRole': true,
            },
        });
        const stack = new core_1.Stack(app);
        const api = new apigw.RestApi(stack, 'myapi');
        api.root.addMethod('GET');
        // THEN
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ApiGateway::Account', 0);
    });
    test('"url" and "urlForPath" return the URL endpoints of the deployed API', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'api');
        api.root.addMethod('GET');
        // THEN
        expect(stack.resolve(api.url)).toEqual({
            'Fn::Join': ['',
                ['https://',
                    { Ref: 'apiC8550315' },
                    '.execute-api.',
                    { Ref: 'AWS::Region' },
                    '.',
                    { Ref: 'AWS::URLSuffix' },
                    '/',
                    { Ref: 'apiDeploymentStageprod896C8101' },
                    '/']],
        });
        expect(stack.resolve(api.urlForPath('/foo/bar'))).toEqual({
            'Fn::Join': ['',
                ['https://',
                    { Ref: 'apiC8550315' },
                    '.execute-api.',
                    { Ref: 'AWS::Region' },
                    '.',
                    { Ref: 'AWS::URLSuffix' },
                    '/',
                    { Ref: 'apiDeploymentStageprod896C8101' },
                    '/foo/bar']],
        });
    });
    test('"urlForPath" would not work if there is no deployment', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'api', { deploy: false });
        api.root.addMethod('GET');
        // THEN
        expect(() => api.url).toThrow(/Cannot determine deployment stage for API from "deploymentStage". Use "deploy" or explicitly set "deploymentStage"/);
        expect(() => api.urlForPath('/foo')).toThrow(/Cannot determine deployment stage for API from "deploymentStage". Use "deploy" or explicitly set "deploymentStage"/);
    });
    test('"urlForPath" requires that path will begin with "/"', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'api');
        api.root.addMethod('GET');
        // THEN
        expect(() => api.urlForPath('foo')).toThrow(/Path must begin with \"\/\": foo/);
    });
    test('"executeApiArn" returns the execute-api ARN for a resource/method', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'api');
        api.root.addMethod('GET');
        // WHEN
        const arn = api.arnForExecuteApi('method', '/path', 'stage');
        // THEN
        expect(stack.resolve(arn)).toEqual({
            'Fn::Join': ['',
                ['arn:',
                    { Ref: 'AWS::Partition' },
                    ':execute-api:',
                    { Ref: 'AWS::Region' },
                    ':',
                    { Ref: 'AWS::AccountId' },
                    ':',
                    { Ref: 'apiC8550315' },
                    '/stage/method/path']],
        });
    });
    test('"executeApiArn" path must begin with "/"', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'api');
        api.root.addMethod('GET');
        // THEN
        expect(() => api.arnForExecuteApi('method', 'hey-path', 'stage')).toThrow(/"path" must begin with a "\/": 'hey-path'/);
    });
    test('"executeApiArn" path can be a token', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'api');
        api.root.addMethod('GET');
        // THEN
        expect(() => api.arnForExecuteApi('method', core_1.Lazy.string(({ produce: () => 'path' })), 'stage')).not.toThrow();
    });
    test('"executeApiArn" will convert ANY to "*"', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'api');
        const method = api.root.addMethod('ANY');
        // THEN
        expect(stack.resolve(method.methodArn)).toEqual({
            'Fn::Join': ['',
                ['arn:',
                    { Ref: 'AWS::Partition' },
                    ':execute-api:',
                    { Ref: 'AWS::Region' },
                    ':',
                    { Ref: 'AWS::AccountId' },
                    ':',
                    { Ref: 'apiC8550315' },
                    '/',
                    { Ref: 'apiDeploymentStageprod896C8101' },
                    '/*/']],
        });
    });
    test('"endpointTypes" can be used to specify endpoint configuration for the api', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const api = new apigw.RestApi(stack, 'api', {
            endpointTypes: [apigw.EndpointType.EDGE, apigw.EndpointType.PRIVATE],
        });
        api.root.addMethod('GET');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
            EndpointConfiguration: {
                Types: [
                    'EDGE',
                    'PRIVATE',
                ],
            },
        });
    });
    test('"endpointConfiguration" can be used to specify endpoint types for the api', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const api = new apigw.RestApi(stack, 'api', {
            endpointConfiguration: {
                types: [apigw.EndpointType.EDGE, apigw.EndpointType.PRIVATE],
            },
        });
        api.root.addMethod('GET');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
            EndpointConfiguration: {
                Types: ['EDGE', 'PRIVATE'],
            },
        });
    });
    test('"endpointConfiguration" can be used to specify vpc endpoints on the API', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const api = new apigw.RestApi(stack, 'api', {
            endpointConfiguration: {
                types: [apigw.EndpointType.EDGE, apigw.EndpointType.PRIVATE],
                vpcEndpoints: [
                    aws_ec2_1.GatewayVpcEndpoint.fromGatewayVpcEndpointId(stack, 'ImportedEndpoint', 'vpcEndpoint'),
                    aws_ec2_1.GatewayVpcEndpoint.fromGatewayVpcEndpointId(stack, 'ImportedEndpoint2', 'vpcEndpoint2'),
                ],
            },
        });
        api.root.addMethod('GET');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
            EndpointConfiguration: {
                Types: [
                    'EDGE',
                    'PRIVATE',
                ],
                VpcEndpointIds: [
                    'vpcEndpoint',
                    'vpcEndpoint2',
                ],
            },
        });
    });
    test('"endpointTypes" and "endpointConfiguration" can NOT both be used to specify endpoint configuration for the api', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // THEN
        expect(() => new apigw.RestApi(stack, 'api', {
            endpointConfiguration: {
                types: [apigw.EndpointType.PRIVATE],
                vpcEndpoints: [aws_ec2_1.GatewayVpcEndpoint.fromGatewayVpcEndpointId(stack, 'ImportedEndpoint', 'vpcEndpoint')],
            },
            endpointTypes: [apigw.EndpointType.PRIVATE],
        })).toThrow(/Only one of the RestApi props, endpointTypes or endpointConfiguration, is allowed/);
    });
    test('"cloneFrom" can be used to clone an existing API', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const cloneFrom = apigw.RestApi.fromRestApiId(stack, 'RestApi', 'foobar');
        // WHEN
        const api = new apigw.RestApi(stack, 'api', {
            cloneFrom,
        });
        api.root.addMethod('GET');
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
            CloneFrom: 'foobar',
            Name: 'api',
        });
    });
    test('allow taking a dependency on the rest api (includes deployment and stage)', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'myapi');
        api.root.addMethod('GET');
        const resource = new core_1.CfnResource(stack, 'DependsOnRestApi', { type: 'My::Resource' });
        // WHEN
        resource.node.addDependency(api);
        // THEN
        assertions_1.Template.fromStack(stack).hasResource('My::Resource', {
            DependsOn: [
                'myapiAccountC3A4750C',
                'myapiCloudWatchRoleEB425128',
                'myapiGET9B7CD29E',
                'myapiDeploymentB7EF8EB7b8edc043bcd33e0d85a3c85151f47e98',
                'myapiDeploymentStageprod329F21FF',
                'myapi162F20B8',
            ],
        });
    });
    test('defaultIntegration and defaultMethodOptions can be used at any level', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const rootInteg = new apigw.AwsIntegration({
            service: 's3',
            action: 'GetObject',
        });
        // WHEN
        const api = new apigw.RestApi(stack, 'myapi', {
            defaultIntegration: rootInteg,
            defaultMethodOptions: {
                authorizer: { authorizerId: 'AUTHID' },
                authorizationType: apigw.AuthorizationType.IAM,
            },
        });
        // CASE #1: should inherit integration and options from root resource
        api.root.addMethod('GET');
        const child = api.root.addResource('child');
        // CASE #2: should inherit integration from root and method options, but
        // "authorizationType" will be overridden to "None" instead of "IAM"
        child.addMethod('POST', undefined, {
            authorizationType: apigw.AuthorizationType.COGNITO,
        });
        const child2 = api.root.addResource('child2', {
            defaultIntegration: new apigw.MockIntegration(),
            defaultMethodOptions: {
                authorizer: { authorizerId: 'AUTHID2' },
            },
        });
        // CASE #3: integartion and authorizer ID are inherited from child2
        child2.addMethod('DELETE');
        // CASE #4: same as case #3, but integration is customized
        child2.addMethod('PUT', new apigw.AwsIntegration({ action: 'foo', service: 'bar' }));
        // THEN
        // CASE #1
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'GET',
            ResourceId: { 'Fn::GetAtt': ['myapi162F20B8', 'RootResourceId'] },
            Integration: { Type: 'AWS' },
            AuthorizerId: 'AUTHID',
            AuthorizationType: 'AWS_IAM',
        });
        // CASE #2
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'POST',
            ResourceId: { Ref: 'myapichildA0A65412' },
            Integration: { Type: 'AWS' },
            AuthorizerId: 'AUTHID',
            AuthorizationType: 'COGNITO_USER_POOLS',
        });
        // CASE #3
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'DELETE',
            Integration: { Type: 'MOCK' },
            AuthorizerId: 'AUTHID2',
            AuthorizationType: 'AWS_IAM',
        });
        // CASE #4
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'PUT',
            Integration: { Type: 'AWS' },
            AuthorizerId: 'AUTHID2',
            AuthorizationType: 'AWS_IAM',
        });
    });
    test('addApiKey is supported', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'myapi');
        api.root.addMethod('OPTIONS');
        // WHEN
        api.addApiKey('myapikey', {
            apiKeyName: 'myApiKey1',
            value: '01234567890ABCDEFabcdef',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
            Enabled: true,
            Name: 'myApiKey1',
            StageKeys: [
                {
                    RestApiId: { Ref: 'myapi162F20B8' },
                    StageName: { Ref: 'myapiDeploymentStageprod329F21FF' },
                },
            ],
            Value: '01234567890ABCDEFabcdef',
        });
    });
    test('addModel is supported', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'myapi');
        api.root.addMethod('OPTIONS');
        // WHEN
        api.addModel('model', {
            schema: {
                schema: apigw.JsonSchemaVersion.DRAFT4,
                title: 'test',
                type: apigw.JsonSchemaType.OBJECT,
                properties: { message: { type: apigw.JsonSchemaType.STRING } },
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Model', {
            RestApiId: { Ref: stack.getLogicalId(api.node.findChild('Resource')) },
            Schema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                title: 'test',
                type: 'object',
                properties: { message: { type: 'string' } },
            },
        });
    });
    test('addRequestValidator is supported', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.RestApi(stack, 'myapi');
        api.root.addMethod('OPTIONS');
        // WHEN
        api.addRequestValidator('params-validator', {
            requestValidatorName: 'Parameters',
            validateRequestBody: false,
            validateRequestParameters: true,
        });
        api.addRequestValidator('body-validator', {
            requestValidatorName: 'Body',
            validateRequestBody: true,
            validateRequestParameters: false,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RequestValidator', {
            RestApiId: { Ref: stack.getLogicalId(api.node.findChild('Resource')) },
            Name: 'Parameters',
            ValidateRequestBody: false,
            ValidateRequestParameters: true,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RequestValidator', {
            RestApiId: { Ref: stack.getLogicalId(api.node.findChild('Resource')) },
            Name: 'Body',
            ValidateRequestBody: true,
            ValidateRequestParameters: false,
        });
    });
    test('creates output with given "exportName"', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const api = new apigw.RestApi(stack, 'myapi', { endpointExportName: 'my-given-export-name' });
        api.root.addMethod('GET');
        // THEN
        const outputs = assertions_1.Template.fromStack(stack).findOutputs('myapiEndpoint8EB17201');
        expect(outputs).toEqual({
            myapiEndpoint8EB17201: {
                Value: {
                    'Fn::Join': [
                        '',
                        [
                            'https://',
                            { Ref: 'myapi162F20B8' },
                            '.execute-api.',
                            { Ref: 'AWS::Region' },
                            '.',
                            { Ref: 'AWS::URLSuffix' },
                            '/',
                            { Ref: 'myapiDeploymentStageprod329F21FF' },
                            '/',
                        ],
                    ],
                },
                Export: { Name: 'my-given-export-name' },
            },
        });
    });
    test('creates output when "exportName" is not specified', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const api = new apigw.RestApi(stack, 'myapi');
        api.root.addMethod('GET');
        // THEN
        const outputs = assertions_1.Template.fromStack(stack).findOutputs('myapiEndpoint8EB17201');
        expect(outputs).toEqual({
            myapiEndpoint8EB17201: {
                Value: {
                    'Fn::Join': [
                        '',
                        [
                            'https://',
                            { Ref: 'myapi162F20B8' },
                            '.execute-api.',
                            { Ref: 'AWS::Region' },
                            '.',
                            { Ref: 'AWS::URLSuffix' },
                            '/',
                            { Ref: 'myapiDeploymentStageprod329F21FF' },
                            '/',
                        ],
                    ],
                },
            },
        });
    });
    cdk_build_tools_1.testDeprecated('"restApi" and "api" properties return the RestApi correctly', () => {
        // GIVEN
        const stack = new core_1.Stack();
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
        const stack = new core_1.Stack();
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
    test('RestApi minCompressionSize', () => {
        // GIVEN
        const app = new core_1.App({
            context: {
                '@aws-cdk/aws-apigateway:disableCloudWatchRole': true,
            },
        });
        const stack = new core_1.Stack(app);
        const api = new apigw.RestApi(stack, 'RestApi', {
            minCompressionSize: core_1.Size.bytes(1024),
        });
        // WHEN
        api.root.addMethod('GET');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
            Name: 'RestApi',
            MinimumCompressionSize: 1024,
        });
    });
    cdk_build_tools_1.testDeprecated('RestApi minimumCompressionSize', () => {
        // GIVEN
        const app = new core_1.App({
            context: {
                '@aws-cdk/aws-apigateway:disableCloudWatchRole': true,
            },
        });
        const stack = new core_1.Stack(app);
        const api = new apigw.RestApi(stack, 'RestApi', {
            minimumCompressionSize: 1024,
        });
        // WHEN
        api.root.addMethod('GET');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
            Name: 'RestApi',
            MinimumCompressionSize: 1024,
        });
    });
    cdk_build_tools_1.testDeprecated('throws error when both minimumCompressionSize and minCompressionSize are used', () => {
        // GIVEN
        const app = new core_1.App({
            context: {
                '@aws-cdk/aws-apigateway:disableCloudWatchRole': true,
            },
        });
        // WHEN
        const stack = new core_1.Stack(app);
        // THEN
        expect(() => new apigw.RestApi(stack, 'RestApi', {
            minCompressionSize: core_1.Size.bytes(500),
            minimumCompressionSize: 1024,
        })).toThrow(/both properties minCompressionSize and minimumCompressionSize cannot be set at once./);
    });
});
describe('Import', () => {
    test('fromRestApiId()', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const imported = apigw.RestApi.fromRestApiId(stack, 'imported-api', 'api-rxt4498f');
        // THEN
        expect(stack.resolve(imported.restApiId)).toEqual('api-rxt4498f');
        expect(imported.restApiName).toEqual('imported-api');
    });
    test('fromRestApiAttributes()', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const imported = apigw.RestApi.fromRestApiAttributes(stack, 'imported-api', {
            restApiId: 'test-restapi-id',
            rootResourceId: 'test-root-resource-id',
        });
        const resource = imported.root.addResource('pets');
        resource.addMethod('GET');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', {
            PathPart: 'pets',
            ParentId: stack.resolve(imported.restApiRootResourceId),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'GET',
            ResourceId: stack.resolve(resource.resourceId),
        });
        expect(imported.restApiName).toEqual('imported-api');
    });
    test('fromRestApiAttributes() with restApiName', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const imported = apigw.RestApi.fromRestApiAttributes(stack, 'imported-api', {
            restApiId: 'test-restapi-id',
            rootResourceId: 'test-root-resource-id',
            restApiName: 'test-restapi-name',
        });
        const resource = imported.root.addResource('pets');
        resource.addMethod('GET');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', {
            PathPart: 'pets',
            ParentId: stack.resolve(imported.restApiRootResourceId),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'GET',
            ResourceId: stack.resolve(resource.resourceId),
        });
        expect(imported.restApiName).toEqual('test-restapi-name');
    });
});
describe('SpecRestApi', () => {
    test('add Methods and Resources', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.SpecRestApi(stack, 'SpecRestApi', {
            apiDefinition: apigw.ApiDefinition.fromInline({ foo: 'bar' }),
        });
        // WHEN
        const resource = api.root.addResource('pets');
        resource.addMethod('GET');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Resource', {
            PathPart: 'pets',
            ParentId: stack.resolve(api.restApiRootResourceId),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Method', {
            HttpMethod: 'GET',
            ResourceId: stack.resolve(resource.resourceId),
        });
    });
    test('"endpointTypes" can be used to specify endpoint configuration for SpecRestApi', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const api = new apigw.SpecRestApi(stack, 'api', {
            apiDefinition: apigw.ApiDefinition.fromInline({ foo: 'bar' }),
            endpointTypes: [apigw.EndpointType.EDGE, apigw.EndpointType.PRIVATE],
        });
        api.root.addMethod('GET');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
            EndpointConfiguration: {
                Types: [
                    'EDGE',
                    'PRIVATE',
                ],
            },
        });
    });
    cdk_build_tools_1.testDeprecated('addApiKey is supported', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const api = new apigw.SpecRestApi(stack, 'myapi', {
            apiDefinition: apigw.ApiDefinition.fromInline({ foo: 'bar' }),
        });
        api.root.addMethod('OPTIONS');
        // WHEN
        api.addApiKey('myapikey', {
            apiKeyName: 'myApiKey1',
            value: '01234567890ABCDEFabcdef',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
            Enabled: true,
            Name: 'myApiKey1',
            StageKeys: [
                {
                    RestApiId: { Ref: 'myapi162F20B8' },
                    StageName: { Ref: 'myapiDeploymentStageprod329F21FF' },
                },
            ],
            Value: '01234567890ABCDEFabcdef',
        });
    });
    test('featureFlag @aws-cdk/aws-apigateway:disableCloudWatchRole CloudWatch role is not created created for API Gateway', () => {
        // GIVEN
        const app = new core_1.App({
            context: {
                '@aws-cdk/aws-apigateway:disableCloudWatchRole': true,
            },
        });
        const stack = new core_1.Stack(app);
        const api = new apigw.SpecRestApi(stack, 'SpecRestApi', {
            apiDefinition: apigw.ApiDefinition.fromInline({ foo: 'bar' }),
        });
        // WHEN
        const resource = api.root.addResource('pets');
        resource.addMethod('GET');
        // THEN
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ApiGateway::Account', 0);
    });
    test('SpecRestApi minimumCompressionSize', () => {
        // GIVEN
        const app = new core_1.App({
            context: {
                '@aws-cdk/aws-apigateway:disableCloudWatchRole': true,
            },
        });
        const stack = new core_1.Stack(app);
        const api = new apigw.SpecRestApi(stack, 'SpecRestApi', {
            apiDefinition: apigw.ApiDefinition.fromInline({ foo: 'bar' }),
            minCompressionSize: core_1.Size.bytes(1024),
        });
        // WHEN
        api.root.addMethod('GET');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
            Name: 'SpecRestApi',
            MinimumCompressionSize: 1024,
        });
    });
    describe('Metrics', () => {
        test('metric', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const api = new apigw.RestApi(stack, 'my-api');
            const metricName = '4XXError';
            const statistic = 'Sum';
            // WHEN
            const countMetric = api.metric(metricName, { statistic });
            // THEN
            expect(countMetric.namespace).toEqual('AWS/ApiGateway');
            expect(countMetric.metricName).toEqual(metricName);
            expect(countMetric.dimensions).toEqual({ ApiName: 'my-api' });
            expect(countMetric.statistic).toEqual(statistic);
        });
        test('metricClientError', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const api = new apigw.RestApi(stack, 'my-api');
            const color = '#00ff00';
            // WHEN
            const countMetric = api.metricClientError({ color });
            // THEN
            expect(countMetric.metricName).toEqual('4XXError');
            expect(countMetric.statistic).toEqual('Sum');
            expect(countMetric.color).toEqual(color);
        });
        test('metricServerError', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const api = new apigw.RestApi(stack, 'my-api');
            const color = '#00ff00';
            // WHEN
            const countMetric = api.metricServerError({ color });
            // THEN
            expect(countMetric.metricName).toEqual('5XXError');
            expect(countMetric.statistic).toEqual('Sum');
            expect(countMetric.color).toEqual(color);
        });
        test('metricCacheHitCount', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const api = new apigw.RestApi(stack, 'my-api');
            const color = '#00ff00';
            // WHEN
            const countMetric = api.metricCacheHitCount({ color });
            // THEN
            expect(countMetric.metricName).toEqual('CacheHitCount');
            expect(countMetric.statistic).toEqual('Sum');
            expect(countMetric.color).toEqual(color);
        });
        test('metricCacheMissCount', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const api = new apigw.RestApi(stack, 'my-api');
            const color = '#00ff00';
            // WHEN
            const countMetric = api.metricCacheMissCount({ color });
            // THEN
            expect(countMetric.metricName).toEqual('CacheMissCount');
            expect(countMetric.statistic).toEqual('Sum');
            expect(countMetric.color).toEqual(color);
        });
        test('metricCount', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const api = new apigw.RestApi(stack, 'my-api');
            const color = '#00ff00';
            // WHEN
            const countMetric = api.metricCount({ color });
            // THEN
            expect(countMetric.metricName).toEqual('Count');
            expect(countMetric.statistic).toEqual('SampleCount');
            expect(countMetric.color).toEqual(color);
        });
        test('metricIntegrationLatency', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const api = new apigw.RestApi(stack, 'my-api');
            const color = '#00ff00';
            // WHEN
            const countMetric = api.metricIntegrationLatency({ color });
            // THEN
            expect(countMetric.metricName).toEqual('IntegrationLatency');
            expect(countMetric.color).toEqual(color);
        });
        test('metricLatency', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const api = new apigw.RestApi(stack, 'my-api');
            const color = '#00ff00';
            // WHEN
            const countMetric = api.metricLatency({ color });
            // THEN
            expect(countMetric.metricName).toEqual('Latency');
            expect(countMetric.color).toEqual(color);
        });
    });
    test('disableExecuteApiEndpoint is false when set to false in RestApi', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const api = new apigw.RestApi(stack, 'my-api', { disableExecuteApiEndpoint: false });
        api.root.addMethod('GET');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
            DisableExecuteApiEndpoint: false,
        });
    });
    test('disableExecuteApiEndpoint is true when set to true in RestApi', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const api = new apigw.RestApi(stack, 'my-api', { disableExecuteApiEndpoint: true });
        api.root.addMethod('GET');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
            DisableExecuteApiEndpoint: true,
        });
    });
    test('disableExecuteApiEndpoint is false when set to false in SpecRestApi', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const api = new apigw.SpecRestApi(stack, 'my-api', {
            apiDefinition: apigw.ApiDefinition.fromInline({ foo: 'bar' }),
            disableExecuteApiEndpoint: false,
        });
        api.root.addMethod('GET');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
            DisableExecuteApiEndpoint: false,
        });
    });
    test('disableExecuteApiEndpoint is true when set to true in SpecRestApi', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const api = new apigw.SpecRestApi(stack, 'my-api', {
            apiDefinition: apigw.ApiDefinition.fromInline({ foo: 'bar' }),
            disableExecuteApiEndpoint: true,
        });
        api.root.addMethod('GET');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
            DisableExecuteApiEndpoint: true,
        });
    });
    describe('Description', () => {
        test('description can be set', () => {
            // GIVEN
            const stack = new core_1.Stack();
            // WHEN
            const api = new apigw.RestApi(stack, 'my-api', { description: 'My API' });
            api.root.addMethod('GET');
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {
                Description: 'My API',
            });
        });
        test('description is not set', () => {
            // GIVEN
            const stack = new core_1.Stack();
            // WHEN
            const api = new apigw.RestApi(stack, 'my-api');
            api.root.addMethod('GET');
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::RestApi', {});
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdGFwaS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVzdGFwaS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLDhDQUFzRDtBQUN0RCw4REFBMEQ7QUFDMUQsd0NBQWdGO0FBQ2hGLGdDQUFnQztBQUVoQyxRQUFRLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtJQUN2QixJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtRQUN6QixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBQ1AsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMvQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLHFEQUFxRDtRQUVoRixPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDO1lBQ3hDLFNBQVMsRUFBRTtnQkFDVCxhQUFhLEVBQUU7b0JBQ2IsSUFBSSxFQUFFLDBCQUEwQjtvQkFDaEMsVUFBVSxFQUFFO3dCQUNWLElBQUksRUFBRSxRQUFRO3FCQUNmO2lCQUNGO2dCQUNELGdCQUFnQixFQUFFO29CQUNoQixJQUFJLEVBQUUseUJBQXlCO29CQUMvQixVQUFVLEVBQUU7d0JBQ1YsVUFBVSxFQUFFLEtBQUs7d0JBQ2pCLFVBQVUsRUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFO3dCQUNqRSxTQUFTLEVBQUUsRUFBRSxHQUFHLEVBQUUsZUFBZSxFQUFFO3dCQUNuQyxpQkFBaUIsRUFBRSxNQUFNO3dCQUN6QixXQUFXLEVBQUU7NEJBQ1gsSUFBSSxFQUFFLE1BQU07eUJBQ2I7cUJBQ0Y7aUJBQ0Y7Z0JBQ0QsdURBQXVELEVBQUU7b0JBQ3ZELElB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RSxHQUFHLEVBQUU7WUFDbEMsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsT0FBTztZQUNQLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDL0MsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFMUIsT0FBTztZQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUM3QywwQkFBMEIsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgR2F0ZXdheVZwY0VuZHBvaW50IH0gZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgeyB0ZXN0RGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgeyBBcHAsIENmbkVsZW1lbnQsIENmblJlc291cmNlLCBMYXp5LCBTaXplLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgYXBpZ3cgZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ3Jlc3RhcGknLCAoKSA9PiB7XG4gIHRlc3QoJ21pbmltYWwgc2V0dXAnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnbXktYXBpJyk7XG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTsgLy8gbXVzdCBoYXZlIGF0IGxlYXN0IG9uZSBtZXRob2Qgb3IgYW4gQVBJIGRlZmluaXRpb25cblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgbXlhcGk0QzdCRjE4Njoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OkFwaUdhdGV3YXk6OlJlc3RBcGknLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIE5hbWU6ICdteS1hcGknLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIG15YXBpR0VURjk5MENFM0M6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIEh0dHBNZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgUmVzb3VyY2VJZDogeyAnRm46OkdldEF0dCc6IFsnbXlhcGk0QzdCRjE4NicsICdSb290UmVzb3VyY2VJZCddIH0sXG4gICAgICAgICAgICBSZXN0QXBpSWQ6IHsgUmVmOiAnbXlhcGk0QzdCRjE4NicgfSxcbiAgICAgICAgICAgIEF1dGhvcml6YXRpb25UeXBlOiAnTk9ORScsXG4gICAgICAgICAgICBJbnRlZ3JhdGlvbjoge1xuICAgICAgICAgICAgICBUeXBlOiAnTU9DSycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIG15YXBpRGVwbG95bWVudDkyRjJDQjQ5NzJhODkwZGI1MDYzZWM2NzkwNzFiYTdlZWZjNzZmMmE6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpBcGlHYXRld2F5OjpEZXBsb3ltZW50JyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBSZXN0QXBpSWQ6IHsgUmVmOiAnbXlhcGk0QzdCRjE4NicgfSxcbiAgICAgICAgICAgIERlc2NyaXB0aW9uOiAnQXV0b21hdGljYWxseSBjcmVhdGVkIGJ5IHRoZSBSZXN0QXBpIGNvbnN0cnVjdCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBEZXBlbmRzT246IFsnbXlhcGlHRVRGOTkwQ0UzQyddLFxuICAgICAgICB9LFxuICAgICAgICBteWFwaURlcGxveW1lbnRTdGFnZXByb2QyOThGMDFBRjoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OkFwaUdhdGV3YXk6OlN0YWdlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBSZXN0QXBpSWQ6IHsgUmVmOiAnbXlhcGk0QzdCRjE4NicgfSxcbiAgICAgICAgICAgIERlcGxveW1lbnRJZDogeyBSZWY6ICdteWFwaURlcGxveW1lbnQ5MkYyQ0I0OTcyYTg5MGRiNTA2M2VjNjc5MDcxYmE3ZWVmYzc2ZjJhJyB9LFxuICAgICAgICAgICAgU3RhZ2VOYW1lOiAncHJvZCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBEZXBlbmRzT246IFsnbXlhcGlBY2NvdW50RUM0MjFBMEEnXSxcbiAgICAgICAgfSxcbiAgICAgICAgbXlhcGlDbG91ZFdhdGNoUm9sZTA5NTQ1MkU1OiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpSb2xlJyxcbiAgICAgICAgICBEZWxldGlvblBvbGljeTogJ1JldGFpbicsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAgIFByaW5jaXBhbDogeyBTZXJ2aWNlOiAnYXBpZ2F0ZXdheS5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBNYW5hZ2VkUG9saWN5QXJuczogW1xuICAgICAgICAgICAgICB7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzppYW06OmF3czpwb2xpY3kvc2VydmljZS1yb2xlL0FtYXpvbkFQSUdhdGV3YXlQdXNoVG9DbG91ZFdhdGNoTG9ncyddXSB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBteWFwaUFjY291bnRFQzQyMUEwQToge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OkFwaUdhdGV3YXk6OkFjY291bnQnLFxuICAgICAgICAgIERlbGV0aW9uUG9saWN5OiAnUmV0YWluJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBDbG91ZFdhdGNoUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnbXlhcGlDbG91ZFdhdGNoUm9sZTA5NTQ1MkU1JywgJ0FybiddIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBEZXBlbmRzT246IFsnbXlhcGk0QzdCRjE4NiddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIE91dHB1dHM6IHtcbiAgICAgICAgbXlhcGlFbmRwb2ludDM2MjhBRkUzOiB7XG4gICAgICAgICAgVmFsdWU6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICAnaHR0cHM6Ly8nLFxuICAgICAgICAgICAgICB7IFJlZjogJ215YXBpNEM3QkYxODYnIH0sXG4gICAgICAgICAgICAgICcuZXhlY3V0ZS1hcGkuJyxcbiAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICAgJy4nLFxuICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6VVJMU3VmZml4JyB9LFxuICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgIHsgUmVmOiAnbXlhcGlEZXBsb3ltZW50U3RhZ2Vwcm9kMjk4RjAxQUYnIH0sXG4gICAgICAgICAgICAgICcvJyxcbiAgICAgICAgICAgIF1dLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXN0QXBpTmFtZSBpcyBzZXQgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBteWFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnbXlhcGknKTtcbiAgICBjb25zdCB5b3VyYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICd5b3VyYXBpJywge1xuICAgICAgcmVzdEFwaU5hbWU6ICduYW1lZGFwaScsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KG15YXBpLnJlc3RBcGlOYW1lKS50b0VxdWFsKCdteWFwaScpO1xuICAgIGV4cGVjdCh5b3VyYXBpLnJlc3RBcGlOYW1lKS50b0VxdWFsKCduYW1lZGFwaScpO1xuICB9KTtcblxuICB0ZXN0KCdkZWZhdWx0Q2hpbGQgaXMgc2V0IGNvcnJlY3RseScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnbXktYXBpJyk7XG4gICAgZXhwZWN0KGFwaS5ub2RlLmRlZmF1bHRDaGlsZCBpbnN0YW5jZW9mIGFwaWd3LkNmblJlc3RBcGkpLnRvQmVEZWZpbmVkKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ1wibmFtZVwiIGlzIGRlZmF1bHRlZCB0byByZXNvdXJjZSBwaHlzaWNhbCBuYW1lJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ3Jlc3RhcGknLCB7XG4gICAgICBkZXBsb3k6IGZhbHNlLFxuICAgICAgY2xvdWRXYXRjaFJvbGU6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpSZXN0QXBpJywge1xuICAgICAgTmFtZTogJ3Jlc3RhcGknLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyBpbiBzeW50aGVzaXMgaWYgdGhlcmUgYXJlIG5vIG1ldGhvZHMgb3IgZGVmaW5pdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdteS1zdGFjaycpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnQVBJJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ2ZvbycpO1xuICAgIGFwaS5yb290LmFkZFJlc291cmNlKCdiYXInKS5hZGRSZXNvdXJjZSgnZ29vJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGFwcC5zeW50aCgpKS50b1Rocm93KC9UaGUgUkVTVCBBUEkgZG9lc24ndCBjb250YWluIGFueSBtZXRob2RzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ1wiYWRkUmVzb3VyY2VcIiBjYW4gYmUgdXNlZCBvbiBcIklSZXN0QXBpUmVzb3VyY2VcIiB0byBmb3JtIGEgdHJlZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICdyZXN0YXBpJywge1xuICAgICAgZGVwbG95OiBmYWxzZSxcbiAgICAgIGNsb3VkV2F0Y2hSb2xlOiBmYWxzZSxcbiAgICAgIHJlc3RBcGlOYW1lOiAnbXktcmVzdC1hcGknLFxuICAgIH0pO1xuXG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBmb28gPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgnZm9vJyk7XG4gICAgYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ2JhcicpO1xuICAgIGZvby5hZGRSZXNvdXJjZSgne2hlbGxvfScpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OlJlc291cmNlJywge1xuICAgICAgUGF0aFBhcnQ6ICdmb28nLFxuICAgICAgUGFyZW50SWQ6IHsgJ0ZuOjpHZXRBdHQnOiBbJ3Jlc3RhcGlDNTYxMUQyNycsICdSb290UmVzb3VyY2VJZCddIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpSZXNvdXJjZScsIHtcbiAgICAgIFBhdGhQYXJ0OiAnYmFyJyxcbiAgICAgIFBhcmVudElkOiB7ICdGbjo6R2V0QXR0JzogWydyZXN0YXBpQzU2MTFEMjcnLCAnUm9vdFJlc291cmNlSWQnXSB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6UmVzb3VyY2UnLCB7XG4gICAgICBQYXRoUGFydDogJ3toZWxsb30nLFxuICAgICAgUGFyZW50SWQ6IHsgUmVmOiAncmVzdGFwaWZvb0Y2OTdFMDU2JyB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdcImFkZFJlc291cmNlXCIgYWxsb3dzIGNvbmZpZ3VyYXRpb24gb2YgcHJveHkgcGF0aHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAncmVzdGFwaScsIHtcbiAgICAgIGRlcGxveTogZmFsc2UsXG4gICAgICBjbG91ZFdhdGNoUm9sZTogZmFsc2UsXG4gICAgICByZXN0QXBpTmFtZTogJ215LXJlc3QtYXBpJyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBwcm94eSA9IGFwaS5yb290LmFkZFJlc291cmNlKCd7cHJveHkrfScpO1xuICAgIHByb3h5LmFkZE1ldGhvZCgnQU5ZJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6UmVzb3VyY2UnLCB7XG4gICAgICBQYXRoUGFydDogJ3twcm94eSt9JyxcbiAgICAgIFBhcmVudElkOiB7ICdGbjo6R2V0QXR0JzogWydyZXN0YXBpQzU2MTFEMjcnLCAnUm9vdFJlc291cmNlSWQnXSB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdcImFkZE1ldGhvZFwiIGNhbiBiZSB1c2VkIHRvIGFkZCBtZXRob2RzIHRvIHJlc291cmNlcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ3Jlc3RhcGknLCB7IGRlcGxveTogZmFsc2UsIGNsb3VkV2F0Y2hSb2xlOiBmYWxzZSB9KTtcbiAgICBjb25zdCByMSA9IGFwaS5yb290LmFkZFJlc291cmNlKCdyMScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG4gICAgcjEuYWRkTWV0aG9kKCdQT1NUJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIHJlc3RhcGlDNTYxMUQyNzoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OkFwaUdhdGV3YXk6OlJlc3RBcGknLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIE5hbWU6ICdyZXN0YXBpJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICByZXN0YXBpcjFDRjI5OTdFQToge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OkFwaUdhdGV3YXk6OlJlc291cmNlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBQYXJlbnRJZDoge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAncmVzdGFwaUM1NjExRDI3JyxcbiAgICAgICAgICAgICAgICAnUm9vdFJlc291cmNlSWQnLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFBhdGhQYXJ0OiAncjEnLFxuICAgICAgICAgICAgUmVzdEFwaUlkOiB7XG4gICAgICAgICAgICAgIFJlZjogJ3Jlc3RhcGlDNTYxMUQyNycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHJlc3RhcGlyMVBPU1Q3NjY5MjBDNDoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgSHR0cE1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgUmVzb3VyY2VJZDoge1xuICAgICAgICAgICAgICBSZWY6ICdyZXN0YXBpcjFDRjI5OTdFQScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUmVzdEFwaUlkOiB7XG4gICAgICAgICAgICAgIFJlZjogJ3Jlc3RhcGlDNTYxMUQyNycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQXV0aG9yaXphdGlvblR5cGU6ICdOT05FJyxcbiAgICAgICAgICAgIEludGVncmF0aW9uOiB7XG4gICAgICAgICAgICAgIFR5cGU6ICdNT0NLJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgcmVzdGFwaUdFVDZGQzE3ODVBOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBIdHRwTWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIFJlc291cmNlSWQ6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ3Jlc3RhcGlDNTYxMUQyNycsXG4gICAgICAgICAgICAgICAgJ1Jvb3RSZXNvdXJjZUlkJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBSZXN0QXBpSWQ6IHtcbiAgICAgICAgICAgICAgUmVmOiAncmVzdGFwaUM1NjExRDI3JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBBdXRob3JpemF0aW9uVHlwZTogJ05PTkUnLFxuICAgICAgICAgICAgSW50ZWdyYXRpb246IHtcbiAgICAgICAgICAgICAgVHlwZTogJ01PQ0snLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzb3VyY2VQYXRoIHJldHVybnMgdGhlIGZ1bGwgcGF0aCBvZiB0aGUgcmVzb3VyY2Ugd2l0aGluIHRoZSBBUEknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAncmVzdGFwaScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHIxID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ3IxJyk7XG4gICAgY29uc3QgcjExID0gcjEuYWRkUmVzb3VyY2UoJ3IxXzEnKTtcbiAgICBjb25zdCByMTIgPSByMS5hZGRSZXNvdXJjZSgncjFfMicpO1xuICAgIGNvbnN0IHIxMjEgPSByMTIuYWRkUmVzb3VyY2UoJ3IxXzJfMScpO1xuICAgIGNvbnN0IHIyID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ3IyJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGFwaS5yb290LnBhdGgpLnRvRXF1YWwoJy8nKTtcbiAgICBleHBlY3QocjEucGF0aCkudG9FcXVhbCgnL3IxJyk7XG4gICAgZXhwZWN0KHIxMS5wYXRoKS50b0VxdWFsKCcvcjEvcjFfMScpO1xuICAgIGV4cGVjdChyMTIucGF0aCkudG9FcXVhbCgnL3IxL3IxXzInKTtcbiAgICBleHBlY3QocjEyMS5wYXRoKS50b0VxdWFsKCcvcjEvcjFfMi9yMV8yXzEnKTtcbiAgICBleHBlY3QocjIucGF0aCkudG9FcXVhbCgnL3IyJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc291cmNlIHBhdGggcGFydCB2YWxpZGF0aW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ3Jlc3RhcGknKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ2Zvby8nKSkudG9UaHJvdygpO1xuICAgIGFwaS5yb290LmFkZFJlc291cmNlKCdib29tLWJhbScpO1xuICAgIGV4cGVjdCgoKSA9PiBhcGkucm9vdC5hZGRSZXNvdXJjZSgnaWxsZWdhbCgpJykpLnRvVGhyb3coKTtcbiAgICBhcGkucm9vdC5hZGRSZXNvdXJjZSgne2Zvb30nKTtcbiAgICBleHBlY3QoKCkgPT4gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ2Zvb3tiYXJ9JykpLnRvVGhyb3coKTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgaWYgXCJkZXBsb3lPcHRpb25zXCIgaXMgc2V0IHdpdGggXCJkZXBsb3lcIiBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnbXlhcGknLCB7XG4gICAgICBkZXBsb3k6IGZhbHNlLFxuICAgICAgZGVwbG95T3B0aW9uczogeyBjYWNoaW5nRW5hYmxlZDogdHJ1ZSB9LFxuICAgIH0pKS50b1Rocm93KC9DYW5ub3Qgc2V0ICdkZXBsb3lPcHRpb25zJyBpZiAnZGVwbG95JyBpcyBkaXNhYmxlZC8pO1xuICB9KTtcblxuICB0ZXN0KCdDbG91ZFdhdGNoIHJvbGUgaXMgY3JlYXRlZCBmb3IgQVBJIEdhdGV3YXknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnbXlhcGknKTtcbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OklBTTo6Um9sZScsIDEpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkFwaUdhdGV3YXk6OkFjY291bnQnLCAxKTtcbiAgfSk7XG5cbiAgdGVzdCgnZmVhdHVyZUZsYWcgQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXk6ZGlzYWJsZUNsb3VkV2F0Y2hSb2xlIENsb3VkV2F0Y2ggcm9sZSBpcyBub3QgY3JlYXRlZCBjcmVhdGVkIGZvciBBUEkgR2F0ZXdheScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICAgICAgY29udGV4dDoge1xuICAgICAgICAnQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXk6ZGlzYWJsZUNsb3VkV2F0Y2hSb2xlJzogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ215YXBpJyk7XG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlJvbGUnLCAwKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpBcGlHYXRld2F5OjpBY2NvdW50JywgMCk7XG4gIH0pO1xuXG4gIHRlc3QoJ1widXJsXCIgYW5kIFwidXJsRm9yUGF0aFwiIHJldHVybiB0aGUgVVJMIGVuZHBvaW50cyBvZiB0aGUgZGVwbG95ZWQgQVBJJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ2FwaScpO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoYXBpLnVybCkpLnRvRXF1YWwoe1xuICAgICAgJ0ZuOjpKb2luJzpcbiAgICBbJycsXG4gICAgICBbJ2h0dHBzOi8vJyxcbiAgICAgICAgeyBSZWY6ICdhcGlDODU1MDMxNScgfSxcbiAgICAgICAgJy5leGVjdXRlLWFwaS4nLFxuICAgICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAnLicsXG4gICAgICAgIHsgUmVmOiAnQVdTOjpVUkxTdWZmaXgnIH0sXG4gICAgICAgICcvJyxcbiAgICAgICAgeyBSZWY6ICdhcGlEZXBsb3ltZW50U3RhZ2Vwcm9kODk2QzgxMDEnIH0sXG4gICAgICAgICcvJ11dLFxuICAgIH0pO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGFwaS51cmxGb3JQYXRoKCcvZm9vL2JhcicpKSkudG9FcXVhbCh7XG4gICAgICAnRm46OkpvaW4nOlxuICAgIFsnJyxcbiAgICAgIFsnaHR0cHM6Ly8nLFxuICAgICAgICB7IFJlZjogJ2FwaUM4NTUwMzE1JyB9LFxuICAgICAgICAnLmV4ZWN1dGUtYXBpLicsXG4gICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICcuJyxcbiAgICAgICAgeyBSZWY6ICdBV1M6OlVSTFN1ZmZpeCcgfSxcbiAgICAgICAgJy8nLFxuICAgICAgICB7IFJlZjogJ2FwaURlcGxveW1lbnRTdGFnZXByb2Q4OTZDODEwMScgfSxcbiAgICAgICAgJy9mb28vYmFyJ11dLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdcInVybEZvclBhdGhcIiB3b3VsZCBub3Qgd29yayBpZiB0aGVyZSBpcyBubyBkZXBsb3ltZW50JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ2FwaScsIHsgZGVwbG95OiBmYWxzZSB9KTtcbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBhcGkudXJsKS50b1Rocm93KC9DYW5ub3QgZGV0ZXJtaW5lIGRlcGxveW1lbnQgc3RhZ2UgZm9yIEFQSSBmcm9tIFwiZGVwbG95bWVudFN0YWdlXCIuIFVzZSBcImRlcGxveVwiIG9yIGV4cGxpY2l0bHkgc2V0IFwiZGVwbG95bWVudFN0YWdlXCIvKTtcbiAgICBleHBlY3QoKCkgPT4gYXBpLnVybEZvclBhdGgoJy9mb28nKSkudG9UaHJvdygvQ2Fubm90IGRldGVybWluZSBkZXBsb3ltZW50IHN0YWdlIGZvciBBUEkgZnJvbSBcImRlcGxveW1lbnRTdGFnZVwiLiBVc2UgXCJkZXBsb3lcIiBvciBleHBsaWNpdGx5IHNldCBcImRlcGxveW1lbnRTdGFnZVwiLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ1widXJsRm9yUGF0aFwiIHJlcXVpcmVzIHRoYXQgcGF0aCB3aWxsIGJlZ2luIHdpdGggXCIvXCInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnYXBpJyk7XG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gYXBpLnVybEZvclBhdGgoJ2ZvbycpKS50b1Rocm93KC9QYXRoIG11c3QgYmVnaW4gd2l0aCBcXFwiXFwvXFxcIjogZm9vLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ1wiZXhlY3V0ZUFwaUFyblwiIHJldHVybnMgdGhlIGV4ZWN1dGUtYXBpIEFSTiBmb3IgYSByZXNvdXJjZS9tZXRob2QnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnYXBpJyk7XG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhcm4gPSBhcGkuYXJuRm9yRXhlY3V0ZUFwaSgnbWV0aG9kJywgJy9wYXRoJywgJ3N0YWdlJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoYXJuKSkudG9FcXVhbCh7XG4gICAgICAnRm46OkpvaW4nOlxuICAgIFsnJyxcbiAgICAgIFsnYXJuOicsXG4gICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICc6ZXhlY3V0ZS1hcGk6JyxcbiAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgJzonLFxuICAgICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgICAnOicsXG4gICAgICAgIHsgUmVmOiAnYXBpQzg1NTAzMTUnIH0sXG4gICAgICAgICcvc3RhZ2UvbWV0aG9kL3BhdGgnXV0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ1wiZXhlY3V0ZUFwaUFyblwiIHBhdGggbXVzdCBiZWdpbiB3aXRoIFwiL1wiJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ2FwaScpO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGFwaS5hcm5Gb3JFeGVjdXRlQXBpKCdtZXRob2QnLCAnaGV5LXBhdGgnLCAnc3RhZ2UnKSkudG9UaHJvdygvXCJwYXRoXCIgbXVzdCBiZWdpbiB3aXRoIGEgXCJcXC9cIjogJ2hleS1wYXRoJy8pO1xuICB9KTtcblxuICB0ZXN0KCdcImV4ZWN1dGVBcGlBcm5cIiBwYXRoIGNhbiBiZSBhIHRva2VuJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ2FwaScpO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGFwaS5hcm5Gb3JFeGVjdXRlQXBpKCdtZXRob2QnLCBMYXp5LnN0cmluZygoeyBwcm9kdWNlOiAoKSA9PiAncGF0aCcgfSkpLCAnc3RhZ2UnKSkubm90LnRvVGhyb3coKTtcbiAgfSk7XG5cbiAgdGVzdCgnXCJleGVjdXRlQXBpQXJuXCIgd2lsbCBjb252ZXJ0IEFOWSB0byBcIipcIicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ2FwaScpO1xuICAgIGNvbnN0IG1ldGhvZCA9IGFwaS5yb290LmFkZE1ldGhvZCgnQU5ZJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUobWV0aG9kLm1ldGhvZEFybikpLnRvRXF1YWwoe1xuICAgICAgJ0ZuOjpKb2luJzpcbiAgICBbJycsXG4gICAgICBbJ2FybjonLFxuICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAnOmV4ZWN1dGUtYXBpOicsXG4gICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICc6JyxcbiAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgJzonLFxuICAgICAgICB7IFJlZjogJ2FwaUM4NTUwMzE1JyB9LFxuICAgICAgICAnLycsXG4gICAgICAgIHsgUmVmOiAnYXBpRGVwbG95bWVudFN0YWdlcHJvZDg5NkM4MTAxJyB9LFxuICAgICAgICAnLyovJ11dLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdcImVuZHBvaW50VHlwZXNcIiBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IGVuZHBvaW50IGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBhcGknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnYXBpJywge1xuICAgICAgZW5kcG9pbnRUeXBlczogW2FwaWd3LkVuZHBvaW50VHlwZS5FREdFLCBhcGlndy5FbmRwb2ludFR5cGUuUFJJVkFURV0sXG4gICAgfSk7XG5cbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OlJlc3RBcGknLCB7XG4gICAgICBFbmRwb2ludENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgVHlwZXM6IFtcbiAgICAgICAgICAnRURHRScsXG4gICAgICAgICAgJ1BSSVZBVEUnLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnXCJlbmRwb2ludENvbmZpZ3VyYXRpb25cIiBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IGVuZHBvaW50IHR5cGVzIGZvciB0aGUgYXBpJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ2FwaScsIHtcbiAgICAgIGVuZHBvaW50Q29uZmlndXJhdGlvbjoge1xuICAgICAgICB0eXBlczogW2FwaWd3LkVuZHBvaW50VHlwZS5FREdFLCBhcGlndy5FbmRwb2ludFR5cGUuUFJJVkFURV0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpSZXN0QXBpJywge1xuICAgICAgRW5kcG9pbnRDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIFR5cGVzOiBbJ0VER0UnLCAnUFJJVkFURSddLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnXCJlbmRwb2ludENvbmZpZ3VyYXRpb25cIiBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IHZwYyBlbmRwb2ludHMgb24gdGhlIEFQSScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICdhcGknLCB7XG4gICAgICBlbmRwb2ludENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgdHlwZXM6IFthcGlndy5FbmRwb2ludFR5cGUuRURHRSwgYXBpZ3cuRW5kcG9pbnRUeXBlLlBSSVZBVEVdLFxuICAgICAgICB2cGNFbmRwb2ludHM6IFtcbiAgICAgICAgICBHYXRld2F5VnBjRW5kcG9pbnQuZnJvbUdhdGV3YXlWcGNFbmRwb2ludElkKHN0YWNrLCAnSW1wb3J0ZWRFbmRwb2ludCcsICd2cGNFbmRwb2ludCcpLFxuICAgICAgICAgIEdhdGV3YXlWcGNFbmRwb2ludC5mcm9tR2F0ZXdheVZwY0VuZHBvaW50SWQoc3RhY2ssICdJbXBvcnRlZEVuZHBvaW50MicsICd2cGNFbmRwb2ludDInKSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OlJlc3RBcGknLCB7XG4gICAgICBFbmRwb2ludENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgVHlwZXM6IFtcbiAgICAgICAgICAnRURHRScsXG4gICAgICAgICAgJ1BSSVZBVEUnLFxuICAgICAgICBdLFxuICAgICAgICBWcGNFbmRwb2ludElkczogW1xuICAgICAgICAgICd2cGNFbmRwb2ludCcsXG4gICAgICAgICAgJ3ZwY0VuZHBvaW50MicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdcImVuZHBvaW50VHlwZXNcIiBhbmQgXCJlbmRwb2ludENvbmZpZ3VyYXRpb25cIiBjYW4gTk9UIGJvdGggYmUgdXNlZCB0byBzcGVjaWZ5IGVuZHBvaW50IGNvbmZpZ3VyYXRpb24gZm9yIHRoZSBhcGknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ2FwaScsIHtcbiAgICAgIGVuZHBvaW50Q29uZmlndXJhdGlvbjoge1xuICAgICAgICB0eXBlczogW2FwaWd3LkVuZHBvaW50VHlwZS5QUklWQVRFXSxcbiAgICAgICAgdnBjRW5kcG9pbnRzOiBbR2F0ZXdheVZwY0VuZHBvaW50LmZyb21HYXRld2F5VnBjRW5kcG9pbnRJZChzdGFjaywgJ0ltcG9ydGVkRW5kcG9pbnQnLCAndnBjRW5kcG9pbnQnKV0sXG4gICAgICB9LFxuICAgICAgZW5kcG9pbnRUeXBlczogW2FwaWd3LkVuZHBvaW50VHlwZS5QUklWQVRFXSxcbiAgICB9KSkudG9UaHJvdygvT25seSBvbmUgb2YgdGhlIFJlc3RBcGkgcHJvcHMsIGVuZHBvaW50VHlwZXMgb3IgZW5kcG9pbnRDb25maWd1cmF0aW9uLCBpcyBhbGxvd2VkLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ1wiY2xvbmVGcm9tXCIgY2FuIGJlIHVzZWQgdG8gY2xvbmUgYW4gZXhpc3RpbmcgQVBJJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBjbG9uZUZyb20gPSBhcGlndy5SZXN0QXBpLmZyb21SZXN0QXBpSWQoc3RhY2ssICdSZXN0QXBpJywgJ2Zvb2JhcicpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnYXBpJywge1xuICAgICAgY2xvbmVGcm9tLFxuICAgIH0pO1xuXG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OlJlc3RBcGknLCB7XG4gICAgICBDbG9uZUZyb206ICdmb29iYXInLFxuICAgICAgTmFtZTogJ2FwaScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FsbG93IHRha2luZyBhIGRlcGVuZGVuY3kgb24gdGhlIHJlc3QgYXBpIChpbmNsdWRlcyBkZXBsb3ltZW50IGFuZCBzdGFnZSknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnbXlhcGknKTtcbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpO1xuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmblJlc291cmNlKHN0YWNrLCAnRGVwZW5kc09uUmVzdEFwaScsIHsgdHlwZTogJ015OjpSZXNvdXJjZScgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgcmVzb3VyY2Uubm9kZS5hZGREZXBlbmRlbmN5KGFwaSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnTXk6OlJlc291cmNlJywge1xuICAgICAgRGVwZW5kc09uOiBbXG4gICAgICAgICdteWFwaUFjY291bnRDM0E0NzUwQycsXG4gICAgICAgICdteWFwaUNsb3VkV2F0Y2hSb2xlRUI0MjUxMjgnLFxuICAgICAgICAnbXlhcGlHRVQ5QjdDRDI5RScsXG4gICAgICAgICdteWFwaURlcGxveW1lbnRCN0VGOEVCN2I4ZWRjMDQzYmNkMzNlMGQ4NWEzYzg1MTUxZjQ3ZTk4JyxcbiAgICAgICAgJ215YXBpRGVwbG95bWVudFN0YWdlcHJvZDMyOUYyMUZGJyxcbiAgICAgICAgJ215YXBpMTYyRjIwQjgnLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZGVmYXVsdEludGVncmF0aW9uIGFuZCBkZWZhdWx0TWV0aG9kT3B0aW9ucyBjYW4gYmUgdXNlZCBhdCBhbnkgbGV2ZWwnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHJvb3RJbnRlZyA9IG5ldyBhcGlndy5Bd3NJbnRlZ3JhdGlvbih7XG4gICAgICBzZXJ2aWNlOiAnczMnLFxuICAgICAgYWN0aW9uOiAnR2V0T2JqZWN0JyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ215YXBpJywge1xuICAgICAgZGVmYXVsdEludGVncmF0aW9uOiByb290SW50ZWcsXG4gICAgICBkZWZhdWx0TWV0aG9kT3B0aW9uczoge1xuICAgICAgICBhdXRob3JpemVyOiB7IGF1dGhvcml6ZXJJZDogJ0FVVEhJRCcgfSxcbiAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IGFwaWd3LkF1dGhvcml6YXRpb25UeXBlLklBTSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBDQVNFICMxOiBzaG91bGQgaW5oZXJpdCBpbnRlZ3JhdGlvbiBhbmQgb3B0aW9ucyBmcm9tIHJvb3QgcmVzb3VyY2VcbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpO1xuXG4gICAgY29uc3QgY2hpbGQgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgnY2hpbGQnKTtcblxuICAgIC8vIENBU0UgIzI6IHNob3VsZCBpbmhlcml0IGludGVncmF0aW9uIGZyb20gcm9vdCBhbmQgbWV0aG9kIG9wdGlvbnMsIGJ1dFxuICAgIC8vIFwiYXV0aG9yaXphdGlvblR5cGVcIiB3aWxsIGJlIG92ZXJyaWRkZW4gdG8gXCJOb25lXCIgaW5zdGVhZCBvZiBcIklBTVwiXG4gICAgY2hpbGQuYWRkTWV0aG9kKCdQT1NUJywgdW5kZWZpbmVkLCB7XG4gICAgICBhdXRob3JpemF0aW9uVHlwZTogYXBpZ3cuQXV0aG9yaXphdGlvblR5cGUuQ09HTklUTyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGNoaWxkMiA9IGFwaS5yb290LmFkZFJlc291cmNlKCdjaGlsZDInLCB7XG4gICAgICBkZWZhdWx0SW50ZWdyYXRpb246IG5ldyBhcGlndy5Nb2NrSW50ZWdyYXRpb24oKSxcbiAgICAgIGRlZmF1bHRNZXRob2RPcHRpb25zOiB7XG4gICAgICAgIGF1dGhvcml6ZXI6IHsgYXV0aG9yaXplcklkOiAnQVVUSElEMicgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBDQVNFICMzOiBpbnRlZ2FydGlvbiBhbmQgYXV0aG9yaXplciBJRCBhcmUgaW5oZXJpdGVkIGZyb20gY2hpbGQyXG4gICAgY2hpbGQyLmFkZE1ldGhvZCgnREVMRVRFJyk7XG5cbiAgICAvLyBDQVNFICM0OiBzYW1lIGFzIGNhc2UgIzMsIGJ1dCBpbnRlZ3JhdGlvbiBpcyBjdXN0b21pemVkXG4gICAgY2hpbGQyLmFkZE1ldGhvZCgnUFVUJywgbmV3IGFwaWd3LkF3c0ludGVncmF0aW9uKHsgYWN0aW9uOiAnZm9vJywgc2VydmljZTogJ2JhcicgfSkpO1xuXG4gICAgLy8gVEhFTlxuXG4gICAgLy8gQ0FTRSAjMVxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIEh0dHBNZXRob2Q6ICdHRVQnLFxuICAgICAgUmVzb3VyY2VJZDogeyAnRm46OkdldEF0dCc6IFsnbXlhcGkxNjJGMjBCOCcsICdSb290UmVzb3VyY2VJZCddIH0sXG4gICAgICBJbnRlZ3JhdGlvbjogeyBUeXBlOiAnQVdTJyB9LFxuICAgICAgQXV0aG9yaXplcklkOiAnQVVUSElEJyxcbiAgICAgIEF1dGhvcml6YXRpb25UeXBlOiAnQVdTX0lBTScsXG4gICAgfSk7XG5cbiAgICAvLyBDQVNFICMyXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TWV0aG9kJywge1xuICAgICAgSHR0cE1ldGhvZDogJ1BPU1QnLFxuICAgICAgUmVzb3VyY2VJZDogeyBSZWY6ICdteWFwaWNoaWxkQTBBNjU0MTInIH0sXG4gICAgICBJbnRlZ3JhdGlvbjogeyBUeXBlOiAnQVdTJyB9LFxuICAgICAgQXV0aG9yaXplcklkOiAnQVVUSElEJyxcbiAgICAgIEF1dGhvcml6YXRpb25UeXBlOiAnQ09HTklUT19VU0VSX1BPT0xTJyxcbiAgICB9KTtcblxuICAgIC8vIENBU0UgIzNcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCB7XG4gICAgICBIdHRwTWV0aG9kOiAnREVMRVRFJyxcbiAgICAgIEludGVncmF0aW9uOiB7IFR5cGU6ICdNT0NLJyB9LFxuICAgICAgQXV0aG9yaXplcklkOiAnQVVUSElEMicsXG4gICAgICBBdXRob3JpemF0aW9uVHlwZTogJ0FXU19JQU0nLFxuICAgIH0pO1xuXG4gICAgLy8gQ0FTRSAjNFxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIEh0dHBNZXRob2Q6ICdQVVQnLFxuICAgICAgSW50ZWdyYXRpb246IHsgVHlwZTogJ0FXUycgfSxcbiAgICAgIEF1dGhvcml6ZXJJZDogJ0FVVEhJRDInLFxuICAgICAgQXV0aG9yaXphdGlvblR5cGU6ICdBV1NfSUFNJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkQXBpS2V5IGlzIHN1cHBvcnRlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICdteWFwaScpO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnT1BUSU9OUycpO1xuXG4gICAgLy8gV0hFTlxuICAgIGFwaS5hZGRBcGlLZXkoJ215YXBpa2V5Jywge1xuICAgICAgYXBpS2V5TmFtZTogJ215QXBpS2V5MScsXG4gICAgICB2YWx1ZTogJzAxMjM0NTY3ODkwQUJDREVGYWJjZGVmJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpBcGlLZXknLCB7XG4gICAgICBFbmFibGVkOiB0cnVlLFxuICAgICAgTmFtZTogJ215QXBpS2V5MScsXG4gICAgICBTdGFnZUtleXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlc3RBcGlJZDogeyBSZWY6ICdteWFwaTE2MkYyMEI4JyB9LFxuICAgICAgICAgIFN0YWdlTmFtZTogeyBSZWY6ICdteWFwaURlcGxveW1lbnRTdGFnZXByb2QzMjlGMjFGRicgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBWYWx1ZTogJzAxMjM0NTY3ODkwQUJDREVGYWJjZGVmJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkTW9kZWwgaXMgc3VwcG9ydGVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ215YXBpJyk7XG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdPUFRJT05TJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgYXBpLmFkZE1vZGVsKCdtb2RlbCcsIHtcbiAgICAgIHNjaGVtYToge1xuICAgICAgICBzY2hlbWE6IGFwaWd3Lkpzb25TY2hlbWFWZXJzaW9uLkRSQUZUNCxcbiAgICAgICAgdGl0bGU6ICd0ZXN0JyxcbiAgICAgICAgdHlwZTogYXBpZ3cuSnNvblNjaGVtYVR5cGUuT0JKRUNULFxuICAgICAgICBwcm9wZXJ0aWVzOiB7IG1lc3NhZ2U6IHsgdHlwZTogYXBpZ3cuSnNvblNjaGVtYVR5cGUuU1RSSU5HIH0gfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6TW9kZWwnLCB7XG4gICAgICBSZXN0QXBpSWQ6IHsgUmVmOiBzdGFjay5nZXRMb2dpY2FsSWQoYXBpLm5vZGUuZmluZENoaWxkKCdSZXNvdXJjZScpIGFzIENmbkVsZW1lbnQpIH0sXG4gICAgICBTY2hlbWE6IHtcbiAgICAgICAgJHNjaGVtYTogJ2h0dHA6Ly9qc29uLXNjaGVtYS5vcmcvZHJhZnQtMDQvc2NoZW1hIycsXG4gICAgICAgIHRpdGxlOiAndGVzdCcsXG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7IG1lc3NhZ2U6IHsgdHlwZTogJ3N0cmluZycgfSB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkUmVxdWVzdFZhbGlkYXRvciBpcyBzdXBwb3J0ZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnbXlhcGknKTtcbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ09QVElPTlMnKTtcblxuICAgIC8vIFdIRU5cbiAgICBhcGkuYWRkUmVxdWVzdFZhbGlkYXRvcigncGFyYW1zLXZhbGlkYXRvcicsIHtcbiAgICAgIHJlcXVlc3RWYWxpZGF0b3JOYW1lOiAnUGFyYW1ldGVycycsXG4gICAgICB2YWxpZGF0ZVJlcXVlc3RCb2R5OiBmYWxzZSxcbiAgICAgIHZhbGlkYXRlUmVxdWVzdFBhcmFtZXRlcnM6IHRydWUsXG4gICAgfSk7XG4gICAgYXBpLmFkZFJlcXVlc3RWYWxpZGF0b3IoJ2JvZHktdmFsaWRhdG9yJywge1xuICAgICAgcmVxdWVzdFZhbGlkYXRvck5hbWU6ICdCb2R5JyxcbiAgICAgIHZhbGlkYXRlUmVxdWVzdEJvZHk6IHRydWUsXG4gICAgICB2YWxpZGF0ZVJlcXVlc3RQYXJhbWV0ZXJzOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpSZXF1ZXN0VmFsaWRhdG9yJywge1xuICAgICAgUmVzdEFwaUlkOiB7IFJlZjogc3RhY2suZ2V0TG9naWNhbElkKGFwaS5ub2RlLmZpbmRDaGlsZCgnUmVzb3VyY2UnKSBhcyBDZm5FbGVtZW50KSB9LFxuICAgICAgTmFtZTogJ1BhcmFtZXRlcnMnLFxuICAgICAgVmFsaWRhdGVSZXF1ZXN0Qm9keTogZmFsc2UsXG4gICAgICBWYWxpZGF0ZVJlcXVlc3RQYXJhbWV0ZXJzOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6UmVxdWVzdFZhbGlkYXRvcicsIHtcbiAgICAgIFJlc3RBcGlJZDogeyBSZWY6IHN0YWNrLmdldExvZ2ljYWxJZChhcGkubm9kZS5maW5kQ2hpbGQoJ1Jlc291cmNlJykgYXMgQ2ZuRWxlbWVudCkgfSxcbiAgICAgIE5hbWU6ICdCb2R5JyxcbiAgICAgIFZhbGlkYXRlUmVxdWVzdEJvZHk6IHRydWUsXG4gICAgICBWYWxpZGF0ZVJlcXVlc3RQYXJhbWV0ZXJzOiBmYWxzZSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlcyBvdXRwdXQgd2l0aCBnaXZlbiBcImV4cG9ydE5hbWVcIicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICdteWFwaScsIHsgZW5kcG9pbnRFeHBvcnROYW1lOiAnbXktZ2l2ZW4tZXhwb3J0LW5hbWUnIH0pO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3Qgb3V0cHV0cyA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuZmluZE91dHB1dHMoJ215YXBpRW5kcG9pbnQ4RUIxNzIwMScpO1xuICAgIGV4cGVjdChvdXRwdXRzKS50b0VxdWFsKHtcbiAgICAgIG15YXBpRW5kcG9pbnQ4RUIxNzIwMToge1xuICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnaHR0cHM6Ly8nLFxuICAgICAgICAgICAgICB7IFJlZjogJ215YXBpMTYyRjIwQjgnIH0sXG4gICAgICAgICAgICAgICcuZXhlY3V0ZS1hcGkuJyxcbiAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICAgJy4nLFxuICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6VVJMU3VmZml4JyB9LFxuICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgIHsgUmVmOiAnbXlhcGlEZXBsb3ltZW50U3RhZ2Vwcm9kMzI5RjIxRkYnIH0sXG4gICAgICAgICAgICAgICcvJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgRXhwb3J0OiB7IE5hbWU6ICdteS1naXZlbi1leHBvcnQtbmFtZScgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZXMgb3V0cHV0IHdoZW4gXCJleHBvcnROYW1lXCIgaXMgbm90IHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICdteWFwaScpO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3Qgb3V0cHV0cyA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuZmluZE91dHB1dHMoJ215YXBpRW5kcG9pbnQ4RUIxNzIwMScpO1xuICAgIGV4cGVjdChvdXRwdXRzKS50b0VxdWFsKHtcbiAgICAgIG15YXBpRW5kcG9pbnQ4RUIxNzIwMToge1xuICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnaHR0cHM6Ly8nLFxuICAgICAgICAgICAgICB7IFJlZjogJ215YXBpMTYyRjIwQjgnIH0sXG4gICAgICAgICAgICAgICcuZXhlY3V0ZS1hcGkuJyxcbiAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICAgJy4nLFxuICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6VVJMU3VmZml4JyB9LFxuICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgIHsgUmVmOiAnbXlhcGlEZXBsb3ltZW50U3RhZ2Vwcm9kMzI5RjIxRkYnIH0sXG4gICAgICAgICAgICAgICcvJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdcInJlc3RBcGlcIiBhbmQgXCJhcGlcIiBwcm9wZXJ0aWVzIHJldHVybiB0aGUgUmVzdEFwaSBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAndGVzdC1hcGknKTtcbiAgICBjb25zdCBtZXRob2QgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgncGV0cycpLmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KG1ldGhvZC5yZXN0QXBpKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdChtZXRob2QuYXBpKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKG1ldGhvZC5hcGkucmVzdEFwaUlkKSkudG9FcXVhbChzdGFjay5yZXNvbHZlKG1ldGhvZC5yZXN0QXBpLnJlc3RBcGlJZCkpO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnXCJyZXN0QXBpXCIgdGhyb3dzIGFuIGVycm9yIG9uIGltcG9ydGVkIHdoaWxlIFwiYXBpXCIgcmV0dXJucyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFwaSA9IGFwaWd3LlJlc3RBcGkuZnJvbVJlc3RBcGlBdHRyaWJ1dGVzKHN0YWNrLCAndGVzdC1hcGknLCB7XG4gICAgICByZXN0QXBpSWQ6ICd0ZXN0LXJlc3QtYXBpLWlkJyxcbiAgICAgIHJvb3RSZXNvdXJjZUlkOiAndGVzdC1yb290LXJlc291cmNlLWlkJyxcbiAgICB9KTtcbiAgICBjb25zdCBtZXRob2QgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgncGV0cycpLmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IG1ldGhvZC5yZXN0QXBpKS50b1Rocm93KC9ub3QgYXZhaWxhYmxlIG9uIFJlc291cmNlIG5vdCBjb25uZWN0ZWQgdG8gYW4gaW5zdGFuY2Ugb2YgUmVzdEFwaS8pO1xuICAgIGV4cGVjdChtZXRob2QuYXBpKS50b0JlRGVmaW5lZCgpO1xuICB9KTtcblxuICB0ZXN0KCdSZXN0QXBpIG1pbkNvbXByZXNzaW9uU2l6ZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICAgICAgY29udGV4dDoge1xuICAgICAgICAnQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXk6ZGlzYWJsZUNsb3VkV2F0Y2hSb2xlJzogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHApO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnUmVzdEFwaScsIHtcbiAgICAgIG1pbkNvbXByZXNzaW9uU2l6ZTogU2l6ZS5ieXRlcygxMDI0KSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OlJlc3RBcGknLCB7XG4gICAgICBOYW1lOiAnUmVzdEFwaScsXG4gICAgICBNaW5pbXVtQ29tcHJlc3Npb25TaXplOiAxMDI0LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnUmVzdEFwaSBtaW5pbXVtQ29tcHJlc3Npb25TaXplJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gICAgICBjb250ZXh0OiB7XG4gICAgICAgICdAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheTpkaXNhYmxlQ2xvdWRXYXRjaFJvbGUnOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICdSZXN0QXBpJywge1xuICAgICAgbWluaW11bUNvbXByZXNzaW9uU2l6ZTogMTAyNCxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OlJlc3RBcGknLCB7XG4gICAgICBOYW1lOiAnUmVzdEFwaScsXG4gICAgICBNaW5pbXVtQ29tcHJlc3Npb25TaXplOiAxMDI0LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgndGhyb3dzIGVycm9yIHdoZW4gYm90aCBtaW5pbXVtQ29tcHJlc3Npb25TaXplIGFuZCBtaW5Db21wcmVzc2lvblNpemUgYXJlIHVzZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5OmRpc2FibGVDbG91ZFdhdGNoUm9sZSc6IHRydWUsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnUmVzdEFwaScsIHtcbiAgICAgIG1pbkNvbXByZXNzaW9uU2l6ZTogU2l6ZS5ieXRlcyg1MDApLFxuICAgICAgbWluaW11bUNvbXByZXNzaW9uU2l6ZTogMTAyNCxcbiAgICB9KSkudG9UaHJvdygvYm90aCBwcm9wZXJ0aWVzIG1pbkNvbXByZXNzaW9uU2l6ZSBhbmQgbWluaW11bUNvbXByZXNzaW9uU2l6ZSBjYW5ub3QgYmUgc2V0IGF0IG9uY2UuLyk7XG4gIH0pO1xufSk7XG5cblxuZGVzY3JpYmUoJ0ltcG9ydCcsICgpID0+IHtcbiAgdGVzdCgnZnJvbVJlc3RBcGlJZCgpJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBpbXBvcnRlZCA9IGFwaWd3LlJlc3RBcGkuZnJvbVJlc3RBcGlJZChzdGFjaywgJ2ltcG9ydGVkLWFwaScsICdhcGktcnh0NDQ5OGYnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShpbXBvcnRlZC5yZXN0QXBpSWQpKS50b0VxdWFsKCdhcGktcnh0NDQ5OGYnKTtcbiAgICBleHBlY3QoaW1wb3J0ZWQucmVzdEFwaU5hbWUpLnRvRXF1YWwoJ2ltcG9ydGVkLWFwaScpO1xuICB9KTtcblxuICB0ZXN0KCdmcm9tUmVzdEFwaUF0dHJpYnV0ZXMoKScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgaW1wb3J0ZWQgPSBhcGlndy5SZXN0QXBpLmZyb21SZXN0QXBpQXR0cmlidXRlcyhzdGFjaywgJ2ltcG9ydGVkLWFwaScsIHtcbiAgICAgIHJlc3RBcGlJZDogJ3Rlc3QtcmVzdGFwaS1pZCcsXG4gICAgICByb290UmVzb3VyY2VJZDogJ3Rlc3Qtcm9vdC1yZXNvdXJjZS1pZCcsXG4gICAgfSk7XG4gICAgY29uc3QgcmVzb3VyY2UgPSBpbXBvcnRlZC5yb290LmFkZFJlc291cmNlKCdwZXRzJyk7XG4gICAgcmVzb3VyY2UuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpSZXNvdXJjZScsIHtcbiAgICAgIFBhdGhQYXJ0OiAncGV0cycsXG4gICAgICBQYXJlbnRJZDogc3RhY2sucmVzb2x2ZShpbXBvcnRlZC5yZXN0QXBpUm9vdFJlc291cmNlSWQpLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsIHtcbiAgICAgIEh0dHBNZXRob2Q6ICdHRVQnLFxuICAgICAgUmVzb3VyY2VJZDogc3RhY2sucmVzb2x2ZShyZXNvdXJjZS5yZXNvdXJjZUlkKSxcbiAgICB9KTtcbiAgICBleHBlY3QoaW1wb3J0ZWQucmVzdEFwaU5hbWUpLnRvRXF1YWwoJ2ltcG9ydGVkLWFwaScpO1xuICB9KTtcblxuICB0ZXN0KCdmcm9tUmVzdEFwaUF0dHJpYnV0ZXMoKSB3aXRoIHJlc3RBcGlOYW1lJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBpbXBvcnRlZCA9IGFwaWd3LlJlc3RBcGkuZnJvbVJlc3RBcGlBdHRyaWJ1dGVzKHN0YWNrLCAnaW1wb3J0ZWQtYXBpJywge1xuICAgICAgcmVzdEFwaUlkOiAndGVzdC1yZXN0YXBpLWlkJyxcbiAgICAgIHJvb3RSZXNvdXJjZUlkOiAndGVzdC1yb290LXJlc291cmNlLWlkJyxcbiAgICAgIHJlc3RBcGlOYW1lOiAndGVzdC1yZXN0YXBpLW5hbWUnLFxuICAgIH0pO1xuICAgIGNvbnN0IHJlc291cmNlID0gaW1wb3J0ZWQucm9vdC5hZGRSZXNvdXJjZSgncGV0cycpO1xuICAgIHJlc291cmNlLmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6UmVzb3VyY2UnLCB7XG4gICAgICBQYXRoUGFydDogJ3BldHMnLFxuICAgICAgUGFyZW50SWQ6IHN0YWNrLnJlc29sdmUoaW1wb3J0ZWQucmVzdEFwaVJvb3RSZXNvdXJjZUlkKSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCB7XG4gICAgICBIdHRwTWV0aG9kOiAnR0VUJyxcbiAgICAgIFJlc291cmNlSWQ6IHN0YWNrLnJlc29sdmUocmVzb3VyY2UucmVzb3VyY2VJZCksXG4gICAgfSk7XG4gICAgZXhwZWN0KGltcG9ydGVkLnJlc3RBcGlOYW1lKS50b0VxdWFsKCd0ZXN0LXJlc3RhcGktbmFtZScpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnU3BlY1Jlc3RBcGknLCAoKSA9PiB7XG4gIHRlc3QoJ2FkZCBNZXRob2RzIGFuZCBSZXNvdXJjZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5TcGVjUmVzdEFwaShzdGFjaywgJ1NwZWNSZXN0QXBpJywge1xuICAgICAgYXBpRGVmaW5pdGlvbjogYXBpZ3cuQXBpRGVmaW5pdGlvbi5mcm9tSW5saW5lKHsgZm9vOiAnYmFyJyB9KSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZXNvdXJjZSA9IGFwaS5yb290LmFkZFJlc291cmNlKCdwZXRzJyk7XG4gICAgcmVzb3VyY2UuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpSZXNvdXJjZScsIHtcbiAgICAgIFBhdGhQYXJ0OiAncGV0cycsXG4gICAgICBQYXJlbnRJZDogc3RhY2sucmVzb2x2ZShhcGkucmVzdEFwaVJvb3RSZXNvdXJjZUlkKSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpNZXRob2QnLCB7XG4gICAgICBIdHRwTWV0aG9kOiAnR0VUJyxcbiAgICAgIFJlc291cmNlSWQ6IHN0YWNrLnJlc29sdmUocmVzb3VyY2UucmVzb3VyY2VJZCksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ1wiZW5kcG9pbnRUeXBlc1wiIGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgZW5kcG9pbnQgY29uZmlndXJhdGlvbiBmb3IgU3BlY1Jlc3RBcGknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5TcGVjUmVzdEFwaShzdGFjaywgJ2FwaScsIHtcbiAgICAgIGFwaURlZmluaXRpb246IGFwaWd3LkFwaURlZmluaXRpb24uZnJvbUlubGluZSh7IGZvbzogJ2JhcicgfSksXG4gICAgICBlbmRwb2ludFR5cGVzOiBbYXBpZ3cuRW5kcG9pbnRUeXBlLkVER0UsIGFwaWd3LkVuZHBvaW50VHlwZS5QUklWQVRFXSxcbiAgICB9KTtcblxuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6UmVzdEFwaScsIHtcbiAgICAgIEVuZHBvaW50Q29uZmlndXJhdGlvbjoge1xuICAgICAgICBUeXBlczogW1xuICAgICAgICAgICdFREdFJyxcbiAgICAgICAgICAnUFJJVkFURScsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnYWRkQXBpS2V5IGlzIHN1cHBvcnRlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlNwZWNSZXN0QXBpKHN0YWNrLCAnbXlhcGknLCB7XG4gICAgICBhcGlEZWZpbml0aW9uOiBhcGlndy5BcGlEZWZpbml0aW9uLmZyb21JbmxpbmUoeyBmb286ICdiYXInIH0pLFxuICAgIH0pO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnT1BUSU9OUycpO1xuXG4gICAgLy8gV0hFTlxuICAgIGFwaS5hZGRBcGlLZXkoJ215YXBpa2V5Jywge1xuICAgICAgYXBpS2V5TmFtZTogJ215QXBpS2V5MScsXG4gICAgICB2YWx1ZTogJzAxMjM0NTY3ODkwQUJDREVGYWJjZGVmJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpBcGlLZXknLCB7XG4gICAgICBFbmFibGVkOiB0cnVlLFxuICAgICAgTmFtZTogJ215QXBpS2V5MScsXG4gICAgICBTdGFnZUtleXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlc3RBcGlJZDogeyBSZWY6ICdteWFwaTE2MkYyMEI4JyB9LFxuICAgICAgICAgIFN0YWdlTmFtZTogeyBSZWY6ICdteWFwaURlcGxveW1lbnRTdGFnZXByb2QzMjlGMjFGRicgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBWYWx1ZTogJzAxMjM0NTY3ODkwQUJDREVGYWJjZGVmJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZmVhdHVyZUZsYWcgQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXk6ZGlzYWJsZUNsb3VkV2F0Y2hSb2xlIENsb3VkV2F0Y2ggcm9sZSBpcyBub3QgY3JlYXRlZCBjcmVhdGVkIGZvciBBUEkgR2F0ZXdheScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICAgICAgY29udGV4dDoge1xuICAgICAgICAnQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXk6ZGlzYWJsZUNsb3VkV2F0Y2hSb2xlJzogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHApO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5TcGVjUmVzdEFwaShzdGFjaywgJ1NwZWNSZXN0QXBpJywge1xuICAgICAgYXBpRGVmaW5pdGlvbjogYXBpZ3cuQXBpRGVmaW5pdGlvbi5mcm9tSW5saW5lKHsgZm9vOiAnYmFyJyB9KSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZXNvdXJjZSA9IGFwaS5yb290LmFkZFJlc291cmNlKCdwZXRzJyk7XG4gICAgcmVzb3VyY2UuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlJvbGUnLCAwKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpBcGlHYXRld2F5OjpBY2NvdW50JywgMCk7XG4gIH0pO1xuXG4gIHRlc3QoJ1NwZWNSZXN0QXBpIG1pbmltdW1Db21wcmVzc2lvblNpemUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5OmRpc2FibGVDbG91ZFdhdGNoUm9sZSc6IHRydWUsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuU3BlY1Jlc3RBcGkoc3RhY2ssICdTcGVjUmVzdEFwaScsIHtcbiAgICAgIGFwaURlZmluaXRpb246IGFwaWd3LkFwaURlZmluaXRpb24uZnJvbUlubGluZSh7IGZvbzogJ2JhcicgfSksXG4gICAgICBtaW5Db21wcmVzc2lvblNpemU6IFNpemUuYnl0ZXMoMTAyNCksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpSZXN0QXBpJywge1xuICAgICAgTmFtZTogJ1NwZWNSZXN0QXBpJyxcbiAgICAgIE1pbmltdW1Db21wcmVzc2lvblNpemU6IDEwMjQsXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdNZXRyaWNzJywgKCkgPT4ge1xuICAgIHRlc3QoJ21ldHJpYycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICdteS1hcGknKTtcbiAgICAgIGNvbnN0IG1ldHJpY05hbWUgPSAnNFhYRXJyb3InO1xuICAgICAgY29uc3Qgc3RhdGlzdGljID0gJ1N1bSc7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGNvdW50TWV0cmljID0gYXBpLm1ldHJpYyhtZXRyaWNOYW1lLCB7IHN0YXRpc3RpYyB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGNvdW50TWV0cmljLm5hbWVzcGFjZSkudG9FcXVhbCgnQVdTL0FwaUdhdGV3YXknKTtcbiAgICAgIGV4cGVjdChjb3VudE1ldHJpYy5tZXRyaWNOYW1lKS50b0VxdWFsKG1ldHJpY05hbWUpO1xuICAgICAgZXhwZWN0KGNvdW50TWV0cmljLmRpbWVuc2lvbnMpLnRvRXF1YWwoeyBBcGlOYW1lOiAnbXktYXBpJyB9KTtcbiAgICAgIGV4cGVjdChjb3VudE1ldHJpYy5zdGF0aXN0aWMpLnRvRXF1YWwoc3RhdGlzdGljKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ21ldHJpY0NsaWVudEVycm9yJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ215LWFwaScpO1xuICAgICAgY29uc3QgY29sb3IgPSAnIzAwZmYwMCc7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGNvdW50TWV0cmljID0gYXBpLm1ldHJpY0NsaWVudEVycm9yKHsgY29sb3IgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChjb3VudE1ldHJpYy5tZXRyaWNOYW1lKS50b0VxdWFsKCc0WFhFcnJvcicpO1xuICAgICAgZXhwZWN0KGNvdW50TWV0cmljLnN0YXRpc3RpYykudG9FcXVhbCgnU3VtJyk7XG4gICAgICBleHBlY3QoY291bnRNZXRyaWMuY29sb3IpLnRvRXF1YWwoY29sb3IpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbWV0cmljU2VydmVyRXJyb3InLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnbXktYXBpJyk7XG4gICAgICBjb25zdCBjb2xvciA9ICcjMDBmZjAwJztcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgY291bnRNZXRyaWMgPSBhcGkubWV0cmljU2VydmVyRXJyb3IoeyBjb2xvciB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGNvdW50TWV0cmljLm1ldHJpY05hbWUpLnRvRXF1YWwoJzVYWEVycm9yJyk7XG4gICAgICBleHBlY3QoY291bnRNZXRyaWMuc3RhdGlzdGljKS50b0VxdWFsKCdTdW0nKTtcbiAgICAgIGV4cGVjdChjb3VudE1ldHJpYy5jb2xvcikudG9FcXVhbChjb2xvcik7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdtZXRyaWNDYWNoZUhpdENvdW50JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ215LWFwaScpO1xuICAgICAgY29uc3QgY29sb3IgPSAnIzAwZmYwMCc7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGNvdW50TWV0cmljID0gYXBpLm1ldHJpY0NhY2hlSGl0Q291bnQoeyBjb2xvciB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGNvdW50TWV0cmljLm1ldHJpY05hbWUpLnRvRXF1YWwoJ0NhY2hlSGl0Q291bnQnKTtcbiAgICAgIGV4cGVjdChjb3VudE1ldHJpYy5zdGF0aXN0aWMpLnRvRXF1YWwoJ1N1bScpO1xuICAgICAgZXhwZWN0KGNvdW50TWV0cmljLmNvbG9yKS50b0VxdWFsKGNvbG9yKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ21ldHJpY0NhY2hlTWlzc0NvdW50JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ215LWFwaScpO1xuICAgICAgY29uc3QgY29sb3IgPSAnIzAwZmYwMCc7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGNvdW50TWV0cmljID0gYXBpLm1ldHJpY0NhY2hlTWlzc0NvdW50KHsgY29sb3IgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChjb3VudE1ldHJpYy5tZXRyaWNOYW1lKS50b0VxdWFsKCdDYWNoZU1pc3NDb3VudCcpO1xuICAgICAgZXhwZWN0KGNvdW50TWV0cmljLnN0YXRpc3RpYykudG9FcXVhbCgnU3VtJyk7XG4gICAgICBleHBlY3QoY291bnRNZXRyaWMuY29sb3IpLnRvRXF1YWwoY29sb3IpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbWV0cmljQ291bnQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnbXktYXBpJyk7XG4gICAgICBjb25zdCBjb2xvciA9ICcjMDBmZjAwJztcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgY291bnRNZXRyaWMgPSBhcGkubWV0cmljQ291bnQoeyBjb2xvciB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGNvdW50TWV0cmljLm1ldHJpY05hbWUpLnRvRXF1YWwoJ0NvdW50Jyk7XG4gICAgICBleHBlY3QoY291bnRNZXRyaWMuc3RhdGlzdGljKS50b0VxdWFsKCdTYW1wbGVDb3VudCcpO1xuICAgICAgZXhwZWN0KGNvdW50TWV0cmljLmNvbG9yKS50b0VxdWFsKGNvbG9yKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ21ldHJpY0ludGVncmF0aW9uTGF0ZW5jeScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgYXBpID0gbmV3IGFwaWd3LlJlc3RBcGkoc3RhY2ssICdteS1hcGknKTtcbiAgICAgIGNvbnN0IGNvbG9yID0gJyMwMGZmMDAnO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBjb3VudE1ldHJpYyA9IGFwaS5tZXRyaWNJbnRlZ3JhdGlvbkxhdGVuY3koeyBjb2xvciB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KGNvdW50TWV0cmljLm1ldHJpY05hbWUpLnRvRXF1YWwoJ0ludGVncmF0aW9uTGF0ZW5jeScpO1xuICAgICAgZXhwZWN0KGNvdW50TWV0cmljLmNvbG9yKS50b0VxdWFsKGNvbG9yKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ21ldHJpY0xhdGVuY3knLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnbXktYXBpJyk7XG4gICAgICBjb25zdCBjb2xvciA9ICcjMDBmZjAwJztcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgY291bnRNZXRyaWMgPSBhcGkubWV0cmljTGF0ZW5jeSh7IGNvbG9yIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoY291bnRNZXRyaWMubWV0cmljTmFtZSkudG9FcXVhbCgnTGF0ZW5jeScpO1xuICAgICAgZXhwZWN0KGNvdW50TWV0cmljLmNvbG9yKS50b0VxdWFsKGNvbG9yKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZGlzYWJsZUV4ZWN1dGVBcGlFbmRwb2ludCBpcyBmYWxzZSB3aGVuIHNldCB0byBmYWxzZSBpbiBSZXN0QXBpJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ215LWFwaScsIHsgZGlzYWJsZUV4ZWN1dGVBcGlFbmRwb2ludDogZmFsc2UgfSk7XG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpSZXN0QXBpJywge1xuICAgICAgRGlzYWJsZUV4ZWN1dGVBcGlFbmRwb2ludDogZmFsc2UsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Rpc2FibGVFeGVjdXRlQXBpRW5kcG9pbnQgaXMgdHJ1ZSB3aGVuIHNldCB0byB0cnVlIGluIFJlc3RBcGknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnbXktYXBpJywgeyBkaXNhYmxlRXhlY3V0ZUFwaUVuZHBvaW50OiB0cnVlIH0pO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6UmVzdEFwaScsIHtcbiAgICAgIERpc2FibGVFeGVjdXRlQXBpRW5kcG9pbnQ6IHRydWUsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Rpc2FibGVFeGVjdXRlQXBpRW5kcG9pbnQgaXMgZmFsc2Ugd2hlbiBzZXQgdG8gZmFsc2UgaW4gU3BlY1Jlc3RBcGknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5TcGVjUmVzdEFwaShzdGFjaywgJ215LWFwaScsIHtcbiAgICAgIGFwaURlZmluaXRpb246IGFwaWd3LkFwaURlZmluaXRpb24uZnJvbUlubGluZSh7IGZvbzogJ2JhcicgfSksXG4gICAgICBkaXNhYmxlRXhlY3V0ZUFwaUVuZHBvaW50OiBmYWxzZSxcbiAgICB9KTtcbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OlJlc3RBcGknLCB7XG4gICAgICBEaXNhYmxlRXhlY3V0ZUFwaUVuZHBvaW50OiBmYWxzZSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZGlzYWJsZUV4ZWN1dGVBcGlFbmRwb2ludCBpcyB0cnVlIHdoZW4gc2V0IHRvIHRydWUgaW4gU3BlY1Jlc3RBcGknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5TcGVjUmVzdEFwaShzdGFjaywgJ215LWFwaScsIHtcbiAgICAgIGFwaURlZmluaXRpb246IGFwaWd3LkFwaURlZmluaXRpb24uZnJvbUlubGluZSh7IGZvbzogJ2JhcicgfSksXG4gICAgICBkaXNhYmxlRXhlY3V0ZUFwaUVuZHBvaW50OiB0cnVlLFxuICAgIH0pO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6UmVzdEFwaScsIHtcbiAgICAgIERpc2FibGVFeGVjdXRlQXBpRW5kcG9pbnQ6IHRydWUsXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdEZXNjcmlwdGlvbicsICgpID0+IHtcbiAgICB0ZXN0KCdkZXNjcmlwdGlvbiBjYW4gYmUgc2V0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHN0YWNrLCAnbXktYXBpJywgeyBkZXNjcmlwdGlvbjogJ015IEFQSScgfSk7XG4gICAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhcbiAgICAgICAgJ0FXUzo6QXBpR2F0ZXdheTo6UmVzdEFwaScsXG4gICAgICAgIHtcbiAgICAgICAgICBEZXNjcmlwdGlvbjogJ015IEFQSScsXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZGVzY3JpcHRpb24gaXMgbm90IHNldCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaShzdGFjaywgJ215LWFwaScpO1xuICAgICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoXG4gICAgICAgICdBV1M6OkFwaUdhdGV3YXk6OlJlc3RBcGknLCB7fSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=