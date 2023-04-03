"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const logs = require("@aws-cdk/aws-logs");
const cdk = require("@aws-cdk/core");
const apigateway = require("../lib");
const lib_1 = require("../lib");
describe('stage', () => {
    test('minimal setup', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
        const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
        api.root.addMethod('GET');
        // WHEN
        new apigateway.Stage(stack, 'my-stage', { deployment });
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                testapiD6451F70: {
                    Type: 'AWS::ApiGateway::RestApi',
                    Properties: {
                        Name: 'test-api',
                    },
                },
                testapiGETD8DE4ED1: {
                    Type: 'AWS::ApiGateway::Method',
                    Properties: {
                        HttpMethod: 'GET',
                        ResourceId: {
                            'Fn::GetAtt': [
                                'testapiD6451F70',
                                'RootResourceId',
                            ],
                        },
                        RestApiId: {
                            Ref: 'testapiD6451F70',
                        },
                        AuthorizationType: 'NONE',
                        Integration: {
                            Type: 'MOCK',
                        },
                    },
                },
                mydeployment71ED3B4B5ce82e617e0729f75657ddcca51e3b91: {
                    Type: 'AWS::ApiGateway::Deployment',
                    Properties: {
                        RestApiId: {
                            Ref: 'testapiD6451F70',
                        },
                    },
                    DependsOn: [
                        'testapiGETD8DE4ED1',
                    ],
                },
                mystage7483BE9A: {
                    Type: 'AWS::ApiGateway::Stage',
                    Properties: {
                        RestApiId: {
                            Ref: 'testapiD6451F70',
                        },
                        DeploymentId: {
                            Ref: 'mydeployment71ED3B4B5ce82e617e0729f75657ddcca51e3b91',
                        },
                        StageName: 'prod',
                    },
                },
            },
        });
    });
    test('RestApi - stage depends on the CloudWatch role when it exists', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: true, deploy: false });
        const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
        api.root.addMethod('GET');
        // WHEN
        new apigateway.Stage(stack, 'my-stage', { deployment });
        // THEN
        assertions_1.Template.fromStack(stack).hasResource('AWS::ApiGateway::Stage', {
            DependsOn: ['testapiAccount9B907665'],
        });
    });
    test('SpecRestApi - stage depends on the CloudWatch role when it exists', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.SpecRestApi(stack, 'test-api', { apiDefinition: apigateway.ApiDefinition.fromInline({ foo: 'bar' }) });
        const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
        api.root.addMethod('GET');
        // WHEN
        new apigateway.Stage(stack, 'my-stage', { deployment });
        // THEN
        assertions_1.Template.fromStack(stack).hasResource('AWS::ApiGateway::Stage', {
            DependsOn: ['testapiAccount9B907665'],
        });
    });
    test('common method settings can be set at the stage level', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
        const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
        api.root.addMethod('GET');
        // WHEN
        new apigateway.Stage(stack, 'my-stage', {
            deployment,
            loggingLevel: apigateway.MethodLoggingLevel.INFO,
            throttlingRateLimit: 12,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Stage', {
            MethodSettings: [
                {
                    DataTraceEnabled: false,
                    HttpMethod: '*',
                    LoggingLevel: 'INFO',
                    ResourcePath: '/*',
                    ThrottlingRateLimit: 12,
                },
            ],
        });
    });
    test('"stageResourceArn" returns the ARN for the stage', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'test-api');
        const deployment = new apigateway.Deployment(stack, 'test-deploymnet', {
            api,
        });
        api.root.addMethod('GET');
        // WHEN
        const stage = new apigateway.Stage(stack, 'test-stage', {
            deployment,
        });
        // THEN
        expect(stack.resolve(stage.stageArn)).toEqual({
            'Fn::Join': [
                '',
                [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':apigateway:',
                    { Ref: 'AWS::Region' },
                    '::/restapis/',
                    { Ref: 'testapiD6451F70' },
                    '/stages/',
                    { Ref: 'teststage8788861E' },
                ],
            ],
        });
    });
    test('custom method settings can be set by their path', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
        const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
        api.root.addMethod('GET');
        // WHEN
        new apigateway.Stage(stack, 'my-stage', {
            deployment,
            loggingLevel: apigateway.MethodLoggingLevel.INFO,
            throttlingRateLimit: 12,
            methodOptions: {
                '/goo/bar/GET': {
                    loggingLevel: apigateway.MethodLoggingLevel.ERROR,
                },
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Stage', {
            MethodSettings: [
                {
                    DataTraceEnabled: false,
                    HttpMethod: '*',
                    LoggingLevel: 'INFO',
                    ResourcePath: '/*',
                    ThrottlingRateLimit: 12,
                },
                {
                    DataTraceEnabled: false,
                    HttpMethod: 'GET',
                    LoggingLevel: 'ERROR',
                    ResourcePath: '/~1goo~1bar',
                },
            ],
        });
    });
    test('default "cacheClusterSize" is 0.5 (if cache cluster is enabled)', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
        const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
        api.root.addMethod('GET');
        // WHEN
        new apigateway.Stage(stack, 'my-stage', {
            deployment,
            cacheClusterEnabled: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Stage', {
            CacheClusterEnabled: true,
            CacheClusterSize: '0.5',
        });
    });
    test('setting "cacheClusterSize" implies "cacheClusterEnabled"', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
        const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
        api.root.addMethod('GET');
        // WHEN
        new apigateway.Stage(stack, 'my-stage', {
            deployment,
            cacheClusterSize: '0.5',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Stage', {
            CacheClusterEnabled: true,
            CacheClusterSize: '0.5',
        });
    });
    test('fails when "cacheClusterEnabled" is "false" and "cacheClusterSize" is set', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
        const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
        api.root.addMethod('GET');
        // THEN
        expect(() => new apigateway.Stage(stack, 'my-stage', {
            deployment,
            cacheClusterSize: '0.5',
            cacheClusterEnabled: false,
        })).toThrow(/Cannot set "cacheClusterSize" to 0.5 and "cacheClusterEnabled" to "false"/);
    });
    test('if "cachingEnabled" in method settings, implicitly enable cache cluster', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
        const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
        api.root.addMethod('GET');
        // WHEN
        new apigateway.Stage(stack, 'my-stage', {
            deployment,
            cachingEnabled: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Stage', {
            CacheClusterEnabled: true,
            CacheClusterSize: '0.5',
            MethodSettings: [
                {
                    DataTraceEnabled: false,
                    CachingEnabled: true,
                    HttpMethod: '*',
                    ResourcePath: '/*',
                },
            ],
            StageName: 'prod',
        });
    });
    test('if caching cluster is explicitly disabled, do not auto-enable cache cluster when "cachingEnabled" is set in method options', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
        const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
        api.root.addMethod('GET');
        // THEN
        expect(() => new apigateway.Stage(stack, 'my-stage', {
            cacheClusterEnabled: false,
            deployment,
            cachingEnabled: true,
        })).toThrow(/Cannot enable caching for method \/\*\/\* since cache cluster is disabled on stage/);
    });
    test('if only the custom log destination log group is set', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
        const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
        api.root.addMethod('GET');
        // WHEN
        const testLogGroup = new logs.LogGroup(stack, 'LogGroup');
        new apigateway.Stage(stack, 'my-stage', {
            deployment,
            accessLogDestination: new apigateway.LogGroupLogDestination(testLogGroup),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Stage', {
            AccessLogSetting: {
                DestinationArn: {
                    'Fn::GetAtt': [
                        'LogGroupF5B46931',
                        'Arn',
                    ],
                },
                Format: '$context.identity.sourceIp $context.identity.caller $context.identity.user [$context.requestTime] "$context.httpMethod $context.resourcePath $context.protocol" $context.status $context.responseLength $context.requestId',
            },
            StageName: 'prod',
        });
    });
    test('if the custom log destination log group and format is set', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
        const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
        api.root.addMethod('GET');
        // WHEN
        const testLogGroup = new logs.LogGroup(stack, 'LogGroup');
        const testFormat = apigateway.AccessLogFormat.jsonWithStandardFields();
        new apigateway.Stage(stack, 'my-stage', {
            deployment,
            accessLogDestination: new apigateway.LogGroupLogDestination(testLogGroup),
            accessLogFormat: testFormat,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Stage', {
            AccessLogSetting: {
                DestinationArn: {
                    'Fn::GetAtt': [
                        'LogGroupF5B46931',
                        'Arn',
                    ],
                },
                Format: '{"requestId":"$context.requestId","ip":"$context.identity.sourceIp","user":"$context.identity.user","caller":"$context.identity.caller","requestTime":"$context.requestTime","httpMethod":"$context.httpMethod","resourcePath":"$context.resourcePath","status":"$context.status","protocol":"$context.protocol","responseLength":"$context.responseLength"}',
            },
            StageName: 'prod',
        });
    });
    describe('access log check', () => {
        test('fails when access log format does not contain `contextRequestId()` or `contextExtendedRequestId()', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
            const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
            api.root.addMethod('GET');
            // WHEN
            const testLogGroup = new logs.LogGroup(stack, 'LogGroup');
            const testFormat = apigateway.AccessLogFormat.custom('');
            // THEN
            expect(() => new apigateway.Stage(stack, 'my-stage', {
                deployment,
                accessLogDestination: new apigateway.LogGroupLogDestination(testLogGroup),
                accessLogFormat: testFormat,
            })).toThrow('Access log must include either `AccessLogFormat.contextRequestId()` or `AccessLogFormat.contextExtendedRequestId()`');
        });
        test('succeeds when access log format contains `contextRequestId()`', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
            const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
            api.root.addMethod('GET');
            // WHEN
            const testLogGroup = new logs.LogGroup(stack, 'LogGroup');
            const testFormat = apigateway.AccessLogFormat.custom(JSON.stringify({
                requestId: apigateway.AccessLogField.contextRequestId(),
            }));
            // THEN
            expect(() => new apigateway.Stage(stack, 'my-stage', {
                deployment,
                accessLogDestination: new apigateway.LogGroupLogDestination(testLogGroup),
                accessLogFormat: testFormat,
            })).not.toThrow();
        });
        test('succeeds when access log format contains `contextExtendedRequestId()`', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
            const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
            api.root.addMethod('GET');
            // WHEN
            const testLogGroup = new logs.LogGroup(stack, 'LogGroup');
            const testFormat = apigateway.AccessLogFormat.custom(JSON.stringify({
                extendedRequestId: apigateway.AccessLogField.contextExtendedRequestId(),
            }));
            // THEN
            expect(() => new apigateway.Stage(stack, 'my-stage', {
                deployment,
                accessLogDestination: new apigateway.LogGroupLogDestination(testLogGroup),
                accessLogFormat: testFormat,
            })).not.toThrow();
        });
        test('succeeds when access log format contains both `contextRequestId()` and `contextExtendedRequestId`', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
            const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
            api.root.addMethod('GET');
            // WHEN
            const testLogGroup = new logs.LogGroup(stack, 'LogGroup');
            const testFormat = apigateway.AccessLogFormat.custom(JSON.stringify({
                requestId: apigateway.AccessLogField.contextRequestId(),
                extendedRequestId: apigateway.AccessLogField.contextExtendedRequestId(),
            }));
            // THEN
            expect(() => new apigateway.Stage(stack, 'my-stage', {
                deployment,
                accessLogDestination: new apigateway.LogGroupLogDestination(testLogGroup),
                accessLogFormat: testFormat,
            })).not.toThrow();
        });
        test('fails when access log format contains `contextRequestIdXxx`', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
            const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
            api.root.addMethod('GET');
            // WHEN
            const testLogGroup = new logs.LogGroup(stack, 'LogGroup');
            const testFormat = apigateway.AccessLogFormat.custom(JSON.stringify({
                requestIdXxx: '$context.requestIdXxx',
            }));
            // THEN
            expect(() => new apigateway.Stage(stack, 'my-stage', {
                deployment,
                accessLogDestination: new apigateway.LogGroupLogDestination(testLogGroup),
                accessLogFormat: testFormat,
            })).toThrow('Access log must include either `AccessLogFormat.contextRequestId()` or `AccessLogFormat.contextExtendedRequestId()`');
        });
        test('does not fail when access log format is a token', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
            const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
            api.root.addMethod('GET');
            // WHEN
            const testLogGroup = new logs.LogGroup(stack, 'LogGroup');
            const testFormat = apigateway.AccessLogFormat.custom(cdk.Lazy.string({ produce: () => 'test' }));
            // THEN
            expect(() => new apigateway.Stage(stack, 'my-stage', {
                deployment,
                accessLogDestination: new apigateway.LogGroupLogDestination(testLogGroup),
                accessLogFormat: testFormat,
            })).not.toThrow();
        });
        test('fails when access log destination is empty', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false, deploy: false });
            const deployment = new apigateway.Deployment(stack, 'my-deployment', { api });
            api.root.addMethod('GET');
            // WHEN
            const testFormat = apigateway.AccessLogFormat.jsonWithStandardFields();
            // THEN
            expect(() => new apigateway.Stage(stack, 'my-stage', {
                deployment,
                accessLogFormat: testFormat,
            })).toThrow(/Access log format is specified without a destination/);
        });
    });
    test('default throttling settings', () => {
        // GIVEN
        const stack = new cdk.Stack();
        new apigateway.SpecRestApi(stack, 'testapi', {
            apiDefinition: lib_1.ApiDefinition.fromInline({
                openapi: '3.0.2',
            }),
            deployOptions: {
                throttlingBurstLimit: 0,
                throttlingRateLimit: 0,
                metricsEnabled: false,
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::Stage', {
            MethodSettings: [{
                    DataTraceEnabled: false,
                    HttpMethod: '*',
                    ResourcePath: '/*',
                    ThrottlingBurstLimit: 0,
                    ThrottlingRateLimit: 0,
                }],
        });
    });
    test('addApiKey is supported', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false });
        api.root.addMethod('GET');
        const stage = new apigateway.Stage(stack, 'Stage', {
            deployment: api.latestDeployment,
        });
        // WHEN
        stage.addApiKey('MyKey');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
            StageKeys: [
                {
                    RestApiId: {
                        Ref: 'testapiD6451F70',
                    },
                    StageName: {
                        Ref: 'Stage0E8C2AF5',
                    },
                },
            ],
        });
    });
    test('addApiKey is supported on an imported stage', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'test-api', { cloudWatchRole: false });
        api.root.addMethod('GET');
        const stage = apigateway.Stage.fromStageAttributes(stack, 'Stage', {
            restApi: api,
            stageName: 'MyStage',
        });
        // WHEN
        stage.addApiKey('MyKey');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
            StageKeys: [
                {
                    RestApiId: {
                        Ref: 'testapiD6451F70',
                    },
                    StageName: 'MyStage',
                },
            ],
        });
    });
    describe('Metrics', () => {
        test('metric', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const api = new apigateway.RestApi(stack, 'test-api');
            const metricName = '4XXError';
            const statistic = 'Sum';
            const metric = api.deploymentStage.metric(metricName, { statistic });
            // THEN
            expect(metric.namespace).toEqual('AWS/ApiGateway');
            expect(metric.metricName).toEqual(metricName);
            expect(metric.statistic).toEqual(statistic);
            expect(metric.dimensions).toEqual({ ApiName: 'test-api', Stage: api.deploymentStage.stageName });
        });
        test('metricClientError', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const api = new apigateway.RestApi(stack, 'test-api');
            const color = '#00ff00';
            const metric = api.deploymentStage.metricClientError({ color });
            // THEN
            expect(metric.metricName).toEqual('4XXError');
            expect(metric.statistic).toEqual('Sum');
            expect(metric.color).toEqual(color);
            expect(metric.dimensions).toEqual({ ApiName: 'test-api', Stage: api.deploymentStage.stageName });
        });
        test('metricServerError', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const api = new apigateway.RestApi(stack, 'test-api');
            const color = '#00ff00';
            const metric = api.deploymentStage.metricServerError({ color });
            // THEN
            expect(metric.metricName).toEqual('5XXError');
            expect(metric.statistic).toEqual('Sum');
            expect(metric.color).toEqual(color);
            expect(metric.dimensions).toEqual({ ApiName: 'test-api', Stage: api.deploymentStage.stageName });
        });
        test('metricCacheHitCount', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const api = new apigateway.RestApi(stack, 'test-api');
            const color = '#00ff00';
            const metric = api.deploymentStage.metricCacheHitCount({ color });
            // THEN
            expect(metric.metricName).toEqual('CacheHitCount');
            expect(metric.statistic).toEqual('Sum');
            expect(metric.color).toEqual(color);
            expect(metric.dimensions).toEqual({ ApiName: 'test-api', Stage: api.deploymentStage.stageName });
        });
        test('metricCacheMissCount', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const api = new apigateway.RestApi(stack, 'test-api');
            const color = '#00ff00';
            const metric = api.deploymentStage.metricCacheMissCount({ color });
            // THEN
            expect(metric.metricName).toEqual('CacheMissCount');
            expect(metric.statistic).toEqual('Sum');
            expect(metric.color).toEqual(color);
            expect(metric.dimensions).toEqual({ ApiName: 'test-api', Stage: api.deploymentStage.stageName });
        });
        test('metricCount', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const api = new apigateway.RestApi(stack, 'test-api');
            const color = '#00ff00';
            const metric = api.deploymentStage.metricCount({ color });
            // THEN
            expect(metric.metricName).toEqual('Count');
            expect(metric.statistic).toEqual('SampleCount');
            expect(metric.color).toEqual(color);
            expect(metric.dimensions).toEqual({ ApiName: 'test-api', Stage: api.deploymentStage.stageName });
        });
        test('metricIntegrationLatency', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const api = new apigateway.RestApi(stack, 'test-api');
            const color = '#00ff00';
            const metric = api.deploymentStage.metricIntegrationLatency({ color });
            // THEN
            expect(metric.metricName).toEqual('IntegrationLatency');
            expect(metric.statistic).toEqual('Average');
            expect(metric.color).toEqual(color);
            expect(metric.dimensions).toEqual({ ApiName: 'test-api', Stage: api.deploymentStage.stageName });
        });
        test('metricLatency', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const api = new apigateway.RestApi(stack, 'test-api');
            const color = '#00ff00';
            const metric = api.deploymentStage.metricLatency({ color });
            // THEN
            expect(metric.metricName).toEqual('Latency');
            expect(metric.statistic).toEqual('Average');
            expect(metric.color).toEqual(color);
            expect(metric.dimensions).toEqual({ ApiName: 'test-api', Stage: api.deploymentStage.stageName });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhZ2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0YWdlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0MsMENBQTBDO0FBQzFDLHFDQUFxQztBQUNyQyxxQ0FBcUM7QUFDckMsZ0NBQXVDO0FBRXZDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO0lBQ3JCLElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1FBQ3pCLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDaEcsTUFBTSxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzlFLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFFeEQsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQztZQUN4QyxTQUFTLEVBQUU7Z0JBQ1QsZUFBZSxFQUFFO29CQUNmLElBQUksRUFBRSwwQkFBMEI7b0JBQ2hDLFVBQVUsRUFBRTt3QkFDVixJQUFJLEVBQUUsVUFBVTtxQkFDakI7aUJBQ0Y7Z0JBQ0Qsa0JBQWtCLEVBQUU7b0JBQ2xCLElBQUksRUFBRSx5QkFBeUI7b0JBQy9CLFVBQVUsRUFBRTt3QkFDVixVQUFVLEVBQUUsS0FBSzt3QkFDakIsVUFBVSxFQUFFOzRCQUNWLFlBQVksRUFBRTtnQ0FDWixpQkFBaUI7Z0NBQ2pCLGdCQUFnQjs2QkFDakI7eUJBQ0Y7d0JBQ0QsU0FBUyxFQUFFOzRCQUNULEdBQUcsRUFBRSxpQkFBaUI7eUJBQ3ZCO3dCQUNELGlCQUFpQixFQUFFLE1BQU07d0JBQ3pCLFdBQVcsRUFBRTs0QkFDWCxJQUFJLEVBQUUsTUFBTTt5QkFDYjtxQkFDRjtpQkFDRjtnQkFDRCxvREFBb0QsRUFBRTtvQkFDcEQsSUFBSSxFQUFFLDZCQUE2QjtvQkFDbkMsVUFBVSxFQUFFO3dCQUNWLFNBQVMsRUFBRTs0QkFDVCxHQUFHLEVBQUUsaUJBQWlCO3lCQUN2QjtxQkFDRjtvQkFDRCxTQUFTLEVBQUU7d0JBQ1Qsb0JBQW9CO3FCQUNyQjtpQkFDRjtnQkFDRCxlQUFlLEVBQUU7b0JBQ2YsSUFBSSxFQUFFLHdCQUF3QjtvQkFDOUIsVUFBVSxFQUFFO3dCQUNWLFNBQVMsRUFBRTs0QkFDVCxHQUFHLEVBQUUsaUJBQWlCO3lCQUN2Qjt3QkFDRCxZQUFZLEVBQUU7NEJBQ1osR0FBRyxFQUFFLHNEQUFzRDt5QkFDNUQ7d0JBQ0QsU0FBUyxFQUFFLE1BQU07cUJBQ2xCO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywrREFBK0QsRUFBRSxHQUFHLEVBQUU7UUFDekUsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUMvRixNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDOUUsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUV4RCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDLHdCQUF3QixFQUFFO1lBQzlELFNBQVMsRUFBRSxDQUFDLHdCQUF3QixDQUFDO1NBQ3RDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG1FQUFtRSxFQUFFLEdBQUcsRUFBRTtRQUM3RSxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFBRSxhQUFhLEVBQUUsVUFBVSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbkksTUFBTSxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzlFLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFFeEQsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsRUFBRTtZQUM5RCxTQUFTLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQztTQUN0QyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxzREFBc0QsRUFBRSxHQUFHLEVBQUU7UUFDaEUsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNoRyxNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDOUUsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO1lBQ3RDLFVBQVU7WUFDVixZQUFZLEVBQUUsVUFBVSxDQUFDLGtCQUFrQixDQUFDLElBQUk7WUFDaEQsbUJBQW1CLEVBQUUsRUFBRTtTQUN4QixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7WUFDeEUsY0FBYyxFQUFFO2dCQUNkO29CQUNFLGdCQUFnQixFQUFFLEtBQUs7b0JBQ3ZCLFVBQVUsRUFBRSxHQUFHO29CQUNmLFlBQVksRUFBRSxNQUFNO29CQUNwQixZQUFZLEVBQUUsSUFBSTtvQkFDbEIsbUJBQW1CLEVBQUUsRUFBRTtpQkFDeEI7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGtEQUFrRCxFQUFFLEdBQUcsRUFBRTtRQUM1RCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN0RCxNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFO1lBQ3JFLEdBQUc7U0FDSixDQUFDLENBQUM7UUFDSCxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUxQixPQUFPO1FBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7WUFDdEQsVUFBVTtTQUNYLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDNUMsVUFBVSxFQUFFO2dCQUNWLEVBQUU7Z0JBQ0Y7b0JBQ0UsTUFBTTtvQkFDTixFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRTtvQkFDekIsY0FBYztvQkFDZCxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUU7b0JBQ3RCLGNBQWM7b0JBQ2QsRUFBRSxHQUFHLEVBQUUsaUJBQWlCLEVBQUU7b0JBQzFCLFVBQVU7b0JBQ1YsRUFBRSxHQUFHLEVBQUUsbUJBQW1CLEVBQUU7aUJBQzdCO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxpREFBaUQsRUFBRSxHQUFHLEVBQUU7UUFDM0QsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNoRyxNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDOUUsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO1lBQ3RDLFVBQVU7WUFDVixZQUFZLEVBQUUsVUFBVSxDQUFDLGtCQUFrQixDQUFDLElBQUk7WUFDaEQsbUJBQW1CLEVBQUUsRUFBRTtZQUN2QixhQUFhLEVBQUU7Z0JBQ2IsY0FBYyxFQUFFO29CQUNkLFlBQVksRUFBRSxVQUFVLENBQUMsa0JBQWtCLENBQUMsS0FBSztpQkFDbEQ7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN4RSxjQUFjLEVBQUU7Z0JBQ2Q7b0JBQ0UsZ0JBQWdCLEVBQUUsS0FBSztvQkFDdkIsVUFBVSxFQUFFLEdBQUc7b0JBQ2YsWUFBWSxFQUFFLE1BQU07b0JBQ3BCLFlBQVksRUFBRSxJQUFJO29CQUNsQixtQkFBbUIsRUFBRSxFQUFFO2lCQUN4QjtnQkFDRDtvQkFDRSxnQkFBZ0IsRUFBRSxLQUFLO29CQUN2QixVQUFVLEVBQUUsS0FBSztvQkFDakIsWUFBWSxFQUFFLE9BQU87b0JBQ3JCLFlBQVksRUFBRSxhQUFhO2lCQUM1QjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsaUVBQWlFLEVBQUUsR0FBRyxFQUFFO1FBQzNFLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDaEcsTUFBTSxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQzlFLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtZQUN0QyxVQUFVO1lBQ1YsbUJBQW1CLEVBQUUsSUFBSTtTQUMxQixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7WUFDeEUsbUJBQW1CLEVBQUUsSUFBSTtZQUN6QixnQkFBZ0IsRUFBRSxLQUFLO1NBQ3hCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDBEQUEwRCxFQUFFLEdBQUcsRUFBRTtRQUNwRSxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ2hHLE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM5RSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUxQixPQUFPO1FBQ1AsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDdEMsVUFBVTtZQUNWLGdCQUFnQixFQUFFLEtBQUs7U0FDeEIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO1lBQ3hFLG1CQUFtQixFQUFFLElBQUk7WUFDekIsZ0JBQWdCLEVBQUUsS0FBSztTQUN4QixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywyRUFBMkUsRUFBRSxHQUFHLEVBQUU7UUFDckYsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNoRyxNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDOUUsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFMUIsT0FBTztRQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtZQUNuRCxVQUFVO1lBQ1YsZ0JBQWdCLEVBQUUsS0FBSztZQUN2QixtQkFBbUIsRUFBRSxLQUFLO1NBQzNCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywyRUFBMkUsQ0FBQyxDQUFDO0lBQzNGLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHlFQUF5RSxFQUFFLEdBQUcsRUFBRTtRQUNuRixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ2hHLE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM5RSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUxQixPQUFPO1FBQ1AsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDdEMsVUFBVTtZQUNWLGNBQWMsRUFBRSxJQUFJO1NBQ3JCLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN4RSxtQkFBbUIsRUFBRSxJQUFJO1lBQ3pCLGdCQUFnQixFQUFFLEtBQUs7WUFDdkIsY0FBYyxFQUFFO2dCQUNkO29CQUNFLGdCQUFnQixFQUFFLEtBQUs7b0JBQ3ZCLGNBQWMsRUFBRSxJQUFJO29CQUNwQixVQUFVLEVBQUUsR0FBRztvQkFDZixZQUFZLEVBQUUsSUFBSTtpQkFDbkI7YUFDRjtZQUNELFNBQVMsRUFBRSxNQUFNO1NBQ2xCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDRIQUE0SCxFQUFFLEdBQUcsRUFBRTtRQUN0SSxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ2hHLE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM5RSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUxQixPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO1lBQ25ELG1CQUFtQixFQUFFLEtBQUs7WUFDMUIsVUFBVTtZQUNWLGNBQWMsRUFBRSxJQUFJO1NBQ3JCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxvRkFBb0YsQ0FBQyxDQUFDO0lBQ3BHLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHFEQUFxRCxFQUFFLEdBQUcsRUFBRTtRQUMvRCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ2hHLE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM5RSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUxQixPQUFPO1FBQ1AsTUFBTSxZQUFZLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMxRCxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtZQUN0QyxVQUFVO1lBQ1Ysb0JBQW9CLEVBQUUsSUFBSSxVQUFVLENBQUMsc0JBQXNCLENBQUMsWUFBWSxDQUFDO1NBQzFFLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN4RSxnQkFBZ0IsRUFBRTtnQkFDaEIsY0FBYyxFQUFFO29CQUNkLFlBQVksRUFBRTt3QkFDWixrQkFBa0I7d0JBQ2xCLEtBQUs7cUJBQ047aUJBQ0Y7Z0JBQ0QsTUFBTSxFQUFFLDROQUE0TjthQUNyTztZQUNELFNBQVMsRUFBRSxNQUFNO1NBQ2xCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDJEQUEyRCxFQUFFLEdBQUcsRUFBRTtRQUNyRSxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ2hHLE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM5RSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUxQixPQUFPO1FBQ1AsTUFBTSxZQUFZLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztRQUMxRCxNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsZUFBZSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDdkUsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDdEMsVUFBVTtZQUNWLG9CQUFvQixFQUFFLElBQUksVUFBVSxDQUFDLHNCQUFzQixDQUFDLFlBQVksQ0FBQztZQUN6RSxlQUFlLEVBQUUsVUFBVTtTQUM1QixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7WUFDeEUsZ0JBQWdCLEVBQUU7Z0JBQ2hCLGNBQWMsRUFBRTtvQkFDZCxZQUFZLEVBQUU7d0JBQ1osa0JBQWtCO3dCQUNsQixLQUFLO3FCQUNOO2lCQUNGO2dCQUNELE1BQU0sRUFBRSw4VkFBOFY7YUFDdlc7WUFDRCxTQUFTLEVBQUUsTUFBTTtTQUNsQixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7UUFDaEMsSUFBSSxDQUFDLG1HQUFtRyxFQUFFLEdBQUcsRUFBRTtZQUM3RyxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ2hHLE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUM5RSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUUxQixPQUFPO1lBQ1AsTUFBTSxZQUFZLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztZQUMxRCxNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUV6RCxPQUFPO1lBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO2dCQUNuRCxVQUFVO2dCQUNWLG9CQUFvQixFQUFFLElBQUksVUFBVSxDQUFDLHNCQUFzQixDQUFDLFlBQVksQ0FBQztnQkFDekUsZUFBZSxFQUFFLFVBQVU7YUFDNUIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLHFIQUFxSCxDQUFDLENBQUM7UUFDckksQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsK0RBQStELEVBQUUsR0FBRyxFQUFFO1lBQ3pFLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDaEcsTUFBTSxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQzlFLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTFCLE9BQU87WUFDUCxNQUFNLFlBQVksR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzFELE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ2xFLFNBQVMsRUFBRSxVQUFVLENBQUMsY0FBYyxDQUFDLGdCQUFnQixFQUFFO2FBQ3hELENBQUMsQ0FBQyxDQUFDO1lBRUosT0FBTztZQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtnQkFDbkQsVUFBVTtnQkFDVixvQkFBb0IsRUFBRSxJQUFJLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLENBQUM7Z0JBQ3pFLGVBQWUsRUFBRSxVQUFVO2FBQzVCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyx1RUFBdUUsRUFBRSxHQUFHLEVBQUU7WUFDakYsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUNoRyxNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDOUUsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFMUIsT0FBTztZQUNQLE1BQU0sWUFBWSxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDMUQsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDbEUsaUJBQWlCLEVBQUUsVUFBVSxDQUFDLGNBQWMsQ0FBQyx3QkFBd0IsRUFBRTthQUN4RSxDQUFDLENBQUMsQ0FBQztZQUVKLE9BQU87WUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7Z0JBQ25ELFVBQVU7Z0JBQ1Ysb0JBQW9CLEVBQUUsSUFBSSxVQUFVLENBQUMsc0JBQXNCLENBQUMsWUFBWSxDQUFDO2dCQUN6RSxlQUFlLEVBQUUsVUFBVTthQUM1QixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsbUdBQW1HLEVBQUUsR0FBRyxFQUFFO1lBQzdHLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDaEcsTUFBTSxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQzlFLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTFCLE9BQU87WUFDUCxNQUFNLFlBQVksR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzFELE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ2xFLFNBQVMsRUFBRSxVQUFVLENBQUMsY0FBYyxDQUFDLGdCQUFnQixFQUFFO2dCQUN2RCxpQkFBaUIsRUFBRSxVQUFVLENBQUMsY0FBYyxDQUFDLHdCQUF3QixFQUFFO2FBQ3hFLENBQUMsQ0FBQyxDQUFDO1lBRUosT0FBTztZQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtnQkFDbkQsVUFBVTtnQkFDVixvQkFBb0IsRUFBRSxJQUFJLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLENBQUM7Z0JBQ3pFLGVBQWUsRUFBRSxVQUFVO2FBQzVCLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyw2REFBNkQsRUFBRSxHQUFHLEVBQUU7WUFDdkUsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUNoRyxNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDOUUsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFMUIsT0FBTztZQUNQLE1BQU0sWUFBWSxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDMUQsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDbEUsWUFBWSxFQUFFLHVCQUF1QjthQUN0QyxDQUFDLENBQUMsQ0FBQztZQUVKLE9BQU87WUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7Z0JBQ25ELFVBQVU7Z0JBQ1Ysb0JBQW9CLEVBQUUsSUFBSSxVQUFVLENBQUMsc0JBQXNCLENBQUMsWUFBWSxDQUFDO2dCQUN6RSxlQUFlLEVBQUUsVUFBVTthQUM1QixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMscUhBQXFILENBQUMsQ0FBQztRQUNySSxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxpREFBaUQsRUFBRSxHQUFHLEVBQUU7WUFDN0QsUUFBUTtZQUNOLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzlCLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUNoRyxNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDOUUsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFMUIsT0FBTztZQUNQLE1BQU0sWUFBWSxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDMUQsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRWpHLE9BQU87WUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7Z0JBQ25ELFVBQVU7Z0JBQ1Ysb0JBQW9CLEVBQUUsSUFBSSxVQUFVLENBQUMsc0JBQXNCLENBQUMsWUFBWSxDQUFDO2dCQUN6RSxlQUFlLEVBQUUsVUFBVTthQUM1QixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsNENBQTRDLEVBQUUsR0FBRyxFQUFFO1lBQ3hELFFBQVE7WUFDTixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDaEcsTUFBTSxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQzlFLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTFCLE9BQU87WUFDUCxNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsZUFBZSxDQUFDLHNCQUFzQixFQUFFLENBQUM7WUFFdkUsT0FBTztZQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtnQkFDbkQsVUFBVTtnQkFDVixlQUFlLEVBQUUsVUFBVTthQUM1QixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsc0RBQXNELENBQUMsQ0FBQztRQUN0RSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtRQUN2QyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsSUFBSSxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDM0MsYUFBYSxFQUFFLG1CQUFhLENBQUMsVUFBVSxDQUFDO2dCQUN0QyxPQUFPLEVBQUUsT0FBTzthQUNqQixDQUFDO1lBQ0YsYUFBYSxFQUFFO2dCQUNiLG9CQUFvQixFQUFFLENBQUM7Z0JBQ3ZCLG1CQUFtQixFQUFFLENBQUM7Z0JBQ3RCLGNBQWMsRUFBRSxLQUFLO2FBQ3RCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO1lBQ3hFLGNBQWMsRUFBRSxDQUFDO29CQUNmLGdCQUFnQixFQUFFLEtBQUs7b0JBQ3ZCLFVBQVUsRUFBRSxHQUFHO29CQUNmLFlBQVksRUFBRSxJQUFJO29CQUNsQixvQkFBb0IsRUFBRSxDQUFDO29CQUN2QixtQkFBbUIsRUFBRSxDQUFDO2lCQUN2QixDQUFDO1NBQ0gsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO1FBQ2xDLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ2pGLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQ2pELFVBQVUsRUFBRSxHQUFHLENBQUMsZ0JBQWlCO1NBQ2xDLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXpCLE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx5QkFBeUIsRUFBRTtZQUN6RSxTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsU0FBUyxFQUFFO3dCQUNULEdBQUcsRUFBRSxpQkFBaUI7cUJBQ3ZCO29CQUNELFNBQVMsRUFBRTt3QkFDVCxHQUFHLEVBQUUsZUFBZTtxQkFDckI7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDZDQUE2QyxFQUFFLEdBQUcsRUFBRTtRQUN2RCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNqRixHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQixNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDakUsT0FBTyxFQUFFLEdBQUc7WUFDWixTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV6QixPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMseUJBQXlCLEVBQUU7WUFDekUsU0FBUyxFQUFFO2dCQUNUO29CQUNFLFNBQVMsRUFBRTt3QkFDVCxHQUFHLEVBQUUsaUJBQWlCO3FCQUN2QjtvQkFDRCxTQUFTLEVBQUUsU0FBUztpQkFDckI7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUVMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7UUFDdkIsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7WUFDbEIsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRTlCLE9BQU87WUFDUCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3RELE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQztZQUM5QixNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDeEIsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUVyRSxPQUFPO1lBQ1AsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUNuRCxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM5QyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM1QyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUNuRyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7WUFDN0IsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRTlCLE9BQU87WUFDUCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3RELE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQztZQUN4QixNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUVoRSxPQUFPO1lBQ1AsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDOUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFDbkcsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO1lBQzdCLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUU5QixPQUFPO1lBQ1AsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztZQUN0RCxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUM7WUFDeEIsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFFaEUsT0FBTztZQUNQLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBQ25HLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtZQUMvQixRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7WUFFOUIsT0FBTztZQUNQLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDdEQsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDO1lBQ3hCLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsbUJBQW1CLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBRWxFLE9BQU87WUFDUCxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNuRCxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUNuRyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7WUFDaEMsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRTlCLE9BQU87WUFDUCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3RELE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQztZQUN4QixNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUVuRSxPQUFPO1lBQ1AsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUNwRCxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUNuRyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO1lBQ3ZCLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUU5QixPQUFPO1lBQ1AsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztZQUN0RCxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUM7WUFDeEIsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBRTFELE9BQU87WUFDUCxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMzQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNoRCxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUNuRyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7WUFDcEMsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRTlCLE9BQU87WUFDUCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ3RELE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQztZQUN4QixNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLHdCQUF3QixDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUV2RSxPQUFPO1lBQ1AsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUN4RCxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM1QyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUNuRyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1lBQ3pCLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUU5QixPQUFPO1lBQ1AsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztZQUN0RCxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUM7WUFDeEIsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBRTVELE9BQU87WUFDUCxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM3QyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM1QyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUNuRyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgbG9ncyBmcm9tICdAYXdzLWNkay9hd3MtbG9ncyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBhcGlnYXRld2F5IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBBcGlEZWZpbml0aW9uIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ3N0YWdlJywgKCkgPT4ge1xuICB0ZXN0KCdtaW5pbWFsIHNldHVwJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaShzdGFjaywgJ3Rlc3QtYXBpJywgeyBjbG91ZFdhdGNoUm9sZTogZmFsc2UsIGRlcGxveTogZmFsc2UgfSk7XG4gICAgY29uc3QgZGVwbG95bWVudCA9IG5ldyBhcGlnYXRld2F5LkRlcGxveW1lbnQoc3RhY2ssICdteS1kZXBsb3ltZW50JywgeyBhcGkgfSk7XG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgYXBpZ2F0ZXdheS5TdGFnZShzdGFjaywgJ215LXN0YWdlJywgeyBkZXBsb3ltZW50IH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICB0ZXN0YXBpRDY0NTFGNzA6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpBcGlHYXRld2F5OjpSZXN0QXBpJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBOYW1lOiAndGVzdC1hcGknLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHRlc3RhcGlHRVREOERFNEVEMToge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OkFwaUdhdGV3YXk6Ok1ldGhvZCcsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgSHR0cE1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICBSZXNvdXJjZUlkOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICd0ZXN0YXBpRDY0NTFGNzAnLFxuICAgICAgICAgICAgICAgICdSb290UmVzb3VyY2VJZCcsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUmVzdEFwaUlkOiB7XG4gICAgICAgICAgICAgIFJlZjogJ3Rlc3RhcGlENjQ1MUY3MCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgQXV0aG9yaXphdGlvblR5cGU6ICdOT05FJyxcbiAgICAgICAgICAgIEludGVncmF0aW9uOiB7XG4gICAgICAgICAgICAgIFR5cGU6ICdNT0NLJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgbXlkZXBsb3ltZW50NzFFRDNCNEI1Y2U4MmU2MTdlMDcyOWY3NTY1N2RkY2NhNTFlM2I5MToge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OkFwaUdhdGV3YXk6OkRlcGxveW1lbnQnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFJlc3RBcGlJZDoge1xuICAgICAgICAgICAgICBSZWY6ICd0ZXN0YXBpRDY0NTFGNzAnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIERlcGVuZHNPbjogW1xuICAgICAgICAgICAgJ3Rlc3RhcGlHRVREOERFNEVEMScsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgbXlzdGFnZTc0ODNCRTlBOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6QXBpR2F0ZXdheTo6U3RhZ2UnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFJlc3RBcGlJZDoge1xuICAgICAgICAgICAgICBSZWY6ICd0ZXN0YXBpRDY0NTFGNzAnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIERlcGxveW1lbnRJZDoge1xuICAgICAgICAgICAgICBSZWY6ICdteWRlcGxveW1lbnQ3MUVEM0I0QjVjZTgyZTYxN2UwNzI5Zjc1NjU3ZGRjY2E1MWUzYjkxJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTdGFnZU5hbWU6ICdwcm9kJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnUmVzdEFwaSAtIHN0YWdlIGRlcGVuZHMgb24gdGhlIENsb3VkV2F0Y2ggcm9sZSB3aGVuIGl0IGV4aXN0cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScsIHsgY2xvdWRXYXRjaFJvbGU6IHRydWUsIGRlcGxveTogZmFsc2UgfSk7XG4gICAgY29uc3QgZGVwbG95bWVudCA9IG5ldyBhcGlnYXRld2F5LkRlcGxveW1lbnQoc3RhY2ssICdteS1kZXBsb3ltZW50JywgeyBhcGkgfSk7XG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgYXBpZ2F0ZXdheS5TdGFnZShzdGFjaywgJ215LXN0YWdlJywgeyBkZXBsb3ltZW50IH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6QXBpR2F0ZXdheTo6U3RhZ2UnLCB7XG4gICAgICBEZXBlbmRzT246IFsndGVzdGFwaUFjY291bnQ5QjkwNzY2NSddLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdTcGVjUmVzdEFwaSAtIHN0YWdlIGRlcGVuZHMgb24gdGhlIENsb3VkV2F0Y2ggcm9sZSB3aGVuIGl0IGV4aXN0cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlNwZWNSZXN0QXBpKHN0YWNrLCAndGVzdC1hcGknLCB7IGFwaURlZmluaXRpb246IGFwaWdhdGV3YXkuQXBpRGVmaW5pdGlvbi5mcm9tSW5saW5lKCB7IGZvbzogJ2JhcicgfSkgfSk7XG4gICAgY29uc3QgZGVwbG95bWVudCA9IG5ldyBhcGlnYXRld2F5LkRlcGxveW1lbnQoc3RhY2ssICdteS1kZXBsb3ltZW50JywgeyBhcGkgfSk7XG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgYXBpZ2F0ZXdheS5TdGFnZShzdGFjaywgJ215LXN0YWdlJywgeyBkZXBsb3ltZW50IH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6QXBpR2F0ZXdheTo6U3RhZ2UnLCB7XG4gICAgICBEZXBlbmRzT246IFsndGVzdGFwaUFjY291bnQ5QjkwNzY2NSddLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjb21tb24gbWV0aG9kIHNldHRpbmdzIGNhbiBiZSBzZXQgYXQgdGhlIHN0YWdlIGxldmVsJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaShzdGFjaywgJ3Rlc3QtYXBpJywgeyBjbG91ZFdhdGNoUm9sZTogZmFsc2UsIGRlcGxveTogZmFsc2UgfSk7XG4gICAgY29uc3QgZGVwbG95bWVudCA9IG5ldyBhcGlnYXRld2F5LkRlcGxveW1lbnQoc3RhY2ssICdteS1kZXBsb3ltZW50JywgeyBhcGkgfSk7XG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgYXBpZ2F0ZXdheS5TdGFnZShzdGFjaywgJ215LXN0YWdlJywge1xuICAgICAgZGVwbG95bWVudCxcbiAgICAgIGxvZ2dpbmdMZXZlbDogYXBpZ2F0ZXdheS5NZXRob2RMb2dnaW5nTGV2ZWwuSU5GTyxcbiAgICAgIHRocm90dGxpbmdSYXRlTGltaXQ6IDEyLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OlN0YWdlJywge1xuICAgICAgTWV0aG9kU2V0dGluZ3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIERhdGFUcmFjZUVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgIEh0dHBNZXRob2Q6ICcqJyxcbiAgICAgICAgICBMb2dnaW5nTGV2ZWw6ICdJTkZPJyxcbiAgICAgICAgICBSZXNvdXJjZVBhdGg6ICcvKicsXG4gICAgICAgICAgVGhyb3R0bGluZ1JhdGVMaW1pdDogMTIsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdcInN0YWdlUmVzb3VyY2VBcm5cIiByZXR1cm5zIHRoZSBBUk4gZm9yIHRoZSBzdGFnZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScpO1xuICAgIGNvbnN0IGRlcGxveW1lbnQgPSBuZXcgYXBpZ2F0ZXdheS5EZXBsb3ltZW50KHN0YWNrLCAndGVzdC1kZXBsb3ltbmV0Jywge1xuICAgICAgYXBpLFxuICAgIH0pO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc3RhZ2UgPSBuZXcgYXBpZ2F0ZXdheS5TdGFnZShzdGFjaywgJ3Rlc3Qtc3RhZ2UnLCB7XG4gICAgICBkZXBsb3ltZW50LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHN0YWdlLnN0YWdlQXJuKSkudG9FcXVhbCh7XG4gICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICcnLFxuICAgICAgICBbXG4gICAgICAgICAgJ2FybjonLFxuICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgJzphcGlnYXRld2F5OicsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAnOjovcmVzdGFwaXMvJyxcbiAgICAgICAgICB7IFJlZjogJ3Rlc3RhcGlENjQ1MUY3MCcgfSxcbiAgICAgICAgICAnL3N0YWdlcy8nLFxuICAgICAgICAgIHsgUmVmOiAndGVzdHN0YWdlODc4ODg2MUUnIH0sXG4gICAgICAgIF0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjdXN0b20gbWV0aG9kIHNldHRpbmdzIGNhbiBiZSBzZXQgYnkgdGhlaXIgcGF0aCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScsIHsgY2xvdWRXYXRjaFJvbGU6IGZhbHNlLCBkZXBsb3k6IGZhbHNlIH0pO1xuICAgIGNvbnN0IGRlcGxveW1lbnQgPSBuZXcgYXBpZ2F0ZXdheS5EZXBsb3ltZW50KHN0YWNrLCAnbXktZGVwbG95bWVudCcsIHsgYXBpIH0pO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGFwaWdhdGV3YXkuU3RhZ2Uoc3RhY2ssICdteS1zdGFnZScsIHtcbiAgICAgIGRlcGxveW1lbnQsXG4gICAgICBsb2dnaW5nTGV2ZWw6IGFwaWdhdGV3YXkuTWV0aG9kTG9nZ2luZ0xldmVsLklORk8sXG4gICAgICB0aHJvdHRsaW5nUmF0ZUxpbWl0OiAxMixcbiAgICAgIG1ldGhvZE9wdGlvbnM6IHtcbiAgICAgICAgJy9nb28vYmFyL0dFVCc6IHtcbiAgICAgICAgICBsb2dnaW5nTGV2ZWw6IGFwaWdhdGV3YXkuTWV0aG9kTG9nZ2luZ0xldmVsLkVSUk9SLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpTdGFnZScsIHtcbiAgICAgIE1ldGhvZFNldHRpbmdzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBEYXRhVHJhY2VFbmFibGVkOiBmYWxzZSxcbiAgICAgICAgICBIdHRwTWV0aG9kOiAnKicsXG4gICAgICAgICAgTG9nZ2luZ0xldmVsOiAnSU5GTycsXG4gICAgICAgICAgUmVzb3VyY2VQYXRoOiAnLyonLFxuICAgICAgICAgIFRocm90dGxpbmdSYXRlTGltaXQ6IDEyLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgRGF0YVRyYWNlRW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgSHR0cE1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgTG9nZ2luZ0xldmVsOiAnRVJST1InLFxuICAgICAgICAgIFJlc291cmNlUGF0aDogJy9+MWdvb34xYmFyJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RlZmF1bHQgXCJjYWNoZUNsdXN0ZXJTaXplXCIgaXMgMC41IChpZiBjYWNoZSBjbHVzdGVyIGlzIGVuYWJsZWQpJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaShzdGFjaywgJ3Rlc3QtYXBpJywgeyBjbG91ZFdhdGNoUm9sZTogZmFsc2UsIGRlcGxveTogZmFsc2UgfSk7XG4gICAgY29uc3QgZGVwbG95bWVudCA9IG5ldyBhcGlnYXRld2F5LkRlcGxveW1lbnQoc3RhY2ssICdteS1kZXBsb3ltZW50JywgeyBhcGkgfSk7XG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgYXBpZ2F0ZXdheS5TdGFnZShzdGFjaywgJ215LXN0YWdlJywge1xuICAgICAgZGVwbG95bWVudCxcbiAgICAgIGNhY2hlQ2x1c3RlckVuYWJsZWQ6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6U3RhZ2UnLCB7XG4gICAgICBDYWNoZUNsdXN0ZXJFbmFibGVkOiB0cnVlLFxuICAgICAgQ2FjaGVDbHVzdGVyU2l6ZTogJzAuNScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3NldHRpbmcgXCJjYWNoZUNsdXN0ZXJTaXplXCIgaW1wbGllcyBcImNhY2hlQ2x1c3RlckVuYWJsZWRcIicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScsIHsgY2xvdWRXYXRjaFJvbGU6IGZhbHNlLCBkZXBsb3k6IGZhbHNlIH0pO1xuICAgIGNvbnN0IGRlcGxveW1lbnQgPSBuZXcgYXBpZ2F0ZXdheS5EZXBsb3ltZW50KHN0YWNrLCAnbXktZGVwbG95bWVudCcsIHsgYXBpIH0pO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGFwaWdhdGV3YXkuU3RhZ2Uoc3RhY2ssICdteS1zdGFnZScsIHtcbiAgICAgIGRlcGxveW1lbnQsXG4gICAgICBjYWNoZUNsdXN0ZXJTaXplOiAnMC41JyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpTdGFnZScsIHtcbiAgICAgIENhY2hlQ2x1c3RlckVuYWJsZWQ6IHRydWUsXG4gICAgICBDYWNoZUNsdXN0ZXJTaXplOiAnMC41JyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgd2hlbiBcImNhY2hlQ2x1c3RlckVuYWJsZWRcIiBpcyBcImZhbHNlXCIgYW5kIFwiY2FjaGVDbHVzdGVyU2l6ZVwiIGlzIHNldCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScsIHsgY2xvdWRXYXRjaFJvbGU6IGZhbHNlLCBkZXBsb3k6IGZhbHNlIH0pO1xuICAgIGNvbnN0IGRlcGxveW1lbnQgPSBuZXcgYXBpZ2F0ZXdheS5EZXBsb3ltZW50KHN0YWNrLCAnbXktZGVwbG95bWVudCcsIHsgYXBpIH0pO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBhcGlnYXRld2F5LlN0YWdlKHN0YWNrLCAnbXktc3RhZ2UnLCB7XG4gICAgICBkZXBsb3ltZW50LFxuICAgICAgY2FjaGVDbHVzdGVyU2l6ZTogJzAuNScsXG4gICAgICBjYWNoZUNsdXN0ZXJFbmFibGVkOiBmYWxzZSxcbiAgICB9KSkudG9UaHJvdygvQ2Fubm90IHNldCBcImNhY2hlQ2x1c3RlclNpemVcIiB0byAwLjUgYW5kIFwiY2FjaGVDbHVzdGVyRW5hYmxlZFwiIHRvIFwiZmFsc2VcIi8pO1xuICB9KTtcblxuICB0ZXN0KCdpZiBcImNhY2hpbmdFbmFibGVkXCIgaW4gbWV0aG9kIHNldHRpbmdzLCBpbXBsaWNpdGx5IGVuYWJsZSBjYWNoZSBjbHVzdGVyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaShzdGFjaywgJ3Rlc3QtYXBpJywgeyBjbG91ZFdhdGNoUm9sZTogZmFsc2UsIGRlcGxveTogZmFsc2UgfSk7XG4gICAgY29uc3QgZGVwbG95bWVudCA9IG5ldyBhcGlnYXRld2F5LkRlcGxveW1lbnQoc3RhY2ssICdteS1kZXBsb3ltZW50JywgeyBhcGkgfSk7XG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgYXBpZ2F0ZXdheS5TdGFnZShzdGFjaywgJ215LXN0YWdlJywge1xuICAgICAgZGVwbG95bWVudCxcbiAgICAgIGNhY2hpbmdFbmFibGVkOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OlN0YWdlJywge1xuICAgICAgQ2FjaGVDbHVzdGVyRW5hYmxlZDogdHJ1ZSxcbiAgICAgIENhY2hlQ2x1c3RlclNpemU6ICcwLjUnLFxuICAgICAgTWV0aG9kU2V0dGluZ3M6IFtcbiAgICAgICAge1xuICAgICAgICAgIERhdGFUcmFjZUVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgIENhY2hpbmdFbmFibGVkOiB0cnVlLFxuICAgICAgICAgIEh0dHBNZXRob2Q6ICcqJyxcbiAgICAgICAgICBSZXNvdXJjZVBhdGg6ICcvKicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgU3RhZ2VOYW1lOiAncHJvZCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2lmIGNhY2hpbmcgY2x1c3RlciBpcyBleHBsaWNpdGx5IGRpc2FibGVkLCBkbyBub3QgYXV0by1lbmFibGUgY2FjaGUgY2x1c3RlciB3aGVuIFwiY2FjaGluZ0VuYWJsZWRcIiBpcyBzZXQgaW4gbWV0aG9kIG9wdGlvbnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHN0YWNrLCAndGVzdC1hcGknLCB7IGNsb3VkV2F0Y2hSb2xlOiBmYWxzZSwgZGVwbG95OiBmYWxzZSB9KTtcbiAgICBjb25zdCBkZXBsb3ltZW50ID0gbmV3IGFwaWdhdGV3YXkuRGVwbG95bWVudChzdGFjaywgJ215LWRlcGxveW1lbnQnLCB7IGFwaSB9KTtcbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBuZXcgYXBpZ2F0ZXdheS5TdGFnZShzdGFjaywgJ215LXN0YWdlJywge1xuICAgICAgY2FjaGVDbHVzdGVyRW5hYmxlZDogZmFsc2UsXG4gICAgICBkZXBsb3ltZW50LFxuICAgICAgY2FjaGluZ0VuYWJsZWQ6IHRydWUsXG4gICAgfSkpLnRvVGhyb3coL0Nhbm5vdCBlbmFibGUgY2FjaGluZyBmb3IgbWV0aG9kIFxcL1xcKlxcL1xcKiBzaW5jZSBjYWNoZSBjbHVzdGVyIGlzIGRpc2FibGVkIG9uIHN0YWdlLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2lmIG9ubHkgdGhlIGN1c3RvbSBsb2cgZGVzdGluYXRpb24gbG9nIGdyb3VwIGlzIHNldCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScsIHsgY2xvdWRXYXRjaFJvbGU6IGZhbHNlLCBkZXBsb3k6IGZhbHNlIH0pO1xuICAgIGNvbnN0IGRlcGxveW1lbnQgPSBuZXcgYXBpZ2F0ZXdheS5EZXBsb3ltZW50KHN0YWNrLCAnbXktZGVwbG95bWVudCcsIHsgYXBpIH0pO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdGVzdExvZ0dyb3VwID0gbmV3IGxvZ3MuTG9nR3JvdXAoc3RhY2ssICdMb2dHcm91cCcpO1xuICAgIG5ldyBhcGlnYXRld2F5LlN0YWdlKHN0YWNrLCAnbXktc3RhZ2UnLCB7XG4gICAgICBkZXBsb3ltZW50LFxuICAgICAgYWNjZXNzTG9nRGVzdGluYXRpb246IG5ldyBhcGlnYXRld2F5LkxvZ0dyb3VwTG9nRGVzdGluYXRpb24odGVzdExvZ0dyb3VwKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpTdGFnZScsIHtcbiAgICAgIEFjY2Vzc0xvZ1NldHRpbmc6IHtcbiAgICAgICAgRGVzdGluYXRpb25Bcm46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdMb2dHcm91cEY1QjQ2OTMxJyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIEZvcm1hdDogJyRjb250ZXh0LmlkZW50aXR5LnNvdXJjZUlwICRjb250ZXh0LmlkZW50aXR5LmNhbGxlciAkY29udGV4dC5pZGVudGl0eS51c2VyIFskY29udGV4dC5yZXF1ZXN0VGltZV0gXCIkY29udGV4dC5odHRwTWV0aG9kICRjb250ZXh0LnJlc291cmNlUGF0aCAkY29udGV4dC5wcm90b2NvbFwiICRjb250ZXh0LnN0YXR1cyAkY29udGV4dC5yZXNwb25zZUxlbmd0aCAkY29udGV4dC5yZXF1ZXN0SWQnLFxuICAgICAgfSxcbiAgICAgIFN0YWdlTmFtZTogJ3Byb2QnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpZiB0aGUgY3VzdG9tIGxvZyBkZXN0aW5hdGlvbiBsb2cgZ3JvdXAgYW5kIGZvcm1hdCBpcyBzZXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHN0YWNrLCAndGVzdC1hcGknLCB7IGNsb3VkV2F0Y2hSb2xlOiBmYWxzZSwgZGVwbG95OiBmYWxzZSB9KTtcbiAgICBjb25zdCBkZXBsb3ltZW50ID0gbmV3IGFwaWdhdGV3YXkuRGVwbG95bWVudChzdGFjaywgJ215LWRlcGxveW1lbnQnLCB7IGFwaSB9KTtcbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHRlc3RMb2dHcm91cCA9IG5ldyBsb2dzLkxvZ0dyb3VwKHN0YWNrLCAnTG9nR3JvdXAnKTtcbiAgICBjb25zdCB0ZXN0Rm9ybWF0ID0gYXBpZ2F0ZXdheS5BY2Nlc3NMb2dGb3JtYXQuanNvbldpdGhTdGFuZGFyZEZpZWxkcygpO1xuICAgIG5ldyBhcGlnYXRld2F5LlN0YWdlKHN0YWNrLCAnbXktc3RhZ2UnLCB7XG4gICAgICBkZXBsb3ltZW50LFxuICAgICAgYWNjZXNzTG9nRGVzdGluYXRpb246IG5ldyBhcGlnYXRld2F5LkxvZ0dyb3VwTG9nRGVzdGluYXRpb24odGVzdExvZ0dyb3VwKSxcbiAgICAgIGFjY2Vzc0xvZ0Zvcm1hdDogdGVzdEZvcm1hdCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpTdGFnZScsIHtcbiAgICAgIEFjY2Vzc0xvZ1NldHRpbmc6IHtcbiAgICAgICAgRGVzdGluYXRpb25Bcm46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdMb2dHcm91cEY1QjQ2OTMxJyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIEZvcm1hdDogJ3tcInJlcXVlc3RJZFwiOlwiJGNvbnRleHQucmVxdWVzdElkXCIsXCJpcFwiOlwiJGNvbnRleHQuaWRlbnRpdHkuc291cmNlSXBcIixcInVzZXJcIjpcIiRjb250ZXh0LmlkZW50aXR5LnVzZXJcIixcImNhbGxlclwiOlwiJGNvbnRleHQuaWRlbnRpdHkuY2FsbGVyXCIsXCJyZXF1ZXN0VGltZVwiOlwiJGNvbnRleHQucmVxdWVzdFRpbWVcIixcImh0dHBNZXRob2RcIjpcIiRjb250ZXh0Lmh0dHBNZXRob2RcIixcInJlc291cmNlUGF0aFwiOlwiJGNvbnRleHQucmVzb3VyY2VQYXRoXCIsXCJzdGF0dXNcIjpcIiRjb250ZXh0LnN0YXR1c1wiLFwicHJvdG9jb2xcIjpcIiRjb250ZXh0LnByb3RvY29sXCIsXCJyZXNwb25zZUxlbmd0aFwiOlwiJGNvbnRleHQucmVzcG9uc2VMZW5ndGhcIn0nLFxuICAgICAgfSxcbiAgICAgIFN0YWdlTmFtZTogJ3Byb2QnLFxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnYWNjZXNzIGxvZyBjaGVjaycsICgpID0+IHtcbiAgICB0ZXN0KCdmYWlscyB3aGVuIGFjY2VzcyBsb2cgZm9ybWF0IGRvZXMgbm90IGNvbnRhaW4gYGNvbnRleHRSZXF1ZXN0SWQoKWAgb3IgYGNvbnRleHRFeHRlbmRlZFJlcXVlc3RJZCgpJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaShzdGFjaywgJ3Rlc3QtYXBpJywgeyBjbG91ZFdhdGNoUm9sZTogZmFsc2UsIGRlcGxveTogZmFsc2UgfSk7XG4gICAgICBjb25zdCBkZXBsb3ltZW50ID0gbmV3IGFwaWdhdGV3YXkuRGVwbG95bWVudChzdGFjaywgJ215LWRlcGxveW1lbnQnLCB7IGFwaSB9KTtcbiAgICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHRlc3RMb2dHcm91cCA9IG5ldyBsb2dzLkxvZ0dyb3VwKHN0YWNrLCAnTG9nR3JvdXAnKTtcbiAgICAgIGNvbnN0IHRlc3RGb3JtYXQgPSBhcGlnYXRld2F5LkFjY2Vzc0xvZ0Zvcm1hdC5jdXN0b20oJycpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4gbmV3IGFwaWdhdGV3YXkuU3RhZ2Uoc3RhY2ssICdteS1zdGFnZScsIHtcbiAgICAgICAgZGVwbG95bWVudCxcbiAgICAgICAgYWNjZXNzTG9nRGVzdGluYXRpb246IG5ldyBhcGlnYXRld2F5LkxvZ0dyb3VwTG9nRGVzdGluYXRpb24odGVzdExvZ0dyb3VwKSxcbiAgICAgICAgYWNjZXNzTG9nRm9ybWF0OiB0ZXN0Rm9ybWF0LFxuICAgICAgfSkpLnRvVGhyb3coJ0FjY2VzcyBsb2cgbXVzdCBpbmNsdWRlIGVpdGhlciBgQWNjZXNzTG9nRm9ybWF0LmNvbnRleHRSZXF1ZXN0SWQoKWAgb3IgYEFjY2Vzc0xvZ0Zvcm1hdC5jb250ZXh0RXh0ZW5kZWRSZXF1ZXN0SWQoKWAnKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3N1Y2NlZWRzIHdoZW4gYWNjZXNzIGxvZyBmb3JtYXQgY29udGFpbnMgYGNvbnRleHRSZXF1ZXN0SWQoKWAnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHN0YWNrLCAndGVzdC1hcGknLCB7IGNsb3VkV2F0Y2hSb2xlOiBmYWxzZSwgZGVwbG95OiBmYWxzZSB9KTtcbiAgICAgIGNvbnN0IGRlcGxveW1lbnQgPSBuZXcgYXBpZ2F0ZXdheS5EZXBsb3ltZW50KHN0YWNrLCAnbXktZGVwbG95bWVudCcsIHsgYXBpIH0pO1xuICAgICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgdGVzdExvZ0dyb3VwID0gbmV3IGxvZ3MuTG9nR3JvdXAoc3RhY2ssICdMb2dHcm91cCcpO1xuICAgICAgY29uc3QgdGVzdEZvcm1hdCA9IGFwaWdhdGV3YXkuQWNjZXNzTG9nRm9ybWF0LmN1c3RvbShKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHJlcXVlc3RJZDogYXBpZ2F0ZXdheS5BY2Nlc3NMb2dGaWVsZC5jb250ZXh0UmVxdWVzdElkKCksXG4gICAgICB9KSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiBuZXcgYXBpZ2F0ZXdheS5TdGFnZShzdGFjaywgJ215LXN0YWdlJywge1xuICAgICAgICBkZXBsb3ltZW50LFxuICAgICAgICBhY2Nlc3NMb2dEZXN0aW5hdGlvbjogbmV3IGFwaWdhdGV3YXkuTG9nR3JvdXBMb2dEZXN0aW5hdGlvbih0ZXN0TG9nR3JvdXApLFxuICAgICAgICBhY2Nlc3NMb2dGb3JtYXQ6IHRlc3RGb3JtYXQsXG4gICAgICB9KSkubm90LnRvVGhyb3coKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3N1Y2NlZWRzIHdoZW4gYWNjZXNzIGxvZyBmb3JtYXQgY29udGFpbnMgYGNvbnRleHRFeHRlbmRlZFJlcXVlc3RJZCgpYCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScsIHsgY2xvdWRXYXRjaFJvbGU6IGZhbHNlLCBkZXBsb3k6IGZhbHNlIH0pO1xuICAgICAgY29uc3QgZGVwbG95bWVudCA9IG5ldyBhcGlnYXRld2F5LkRlcGxveW1lbnQoc3RhY2ssICdteS1kZXBsb3ltZW50JywgeyBhcGkgfSk7XG4gICAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCB0ZXN0TG9nR3JvdXAgPSBuZXcgbG9ncy5Mb2dHcm91cChzdGFjaywgJ0xvZ0dyb3VwJyk7XG4gICAgICBjb25zdCB0ZXN0Rm9ybWF0ID0gYXBpZ2F0ZXdheS5BY2Nlc3NMb2dGb3JtYXQuY3VzdG9tKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgZXh0ZW5kZWRSZXF1ZXN0SWQ6IGFwaWdhdGV3YXkuQWNjZXNzTG9nRmllbGQuY29udGV4dEV4dGVuZGVkUmVxdWVzdElkKCksXG4gICAgICB9KSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiBuZXcgYXBpZ2F0ZXdheS5TdGFnZShzdGFjaywgJ215LXN0YWdlJywge1xuICAgICAgICBkZXBsb3ltZW50LFxuICAgICAgICBhY2Nlc3NMb2dEZXN0aW5hdGlvbjogbmV3IGFwaWdhdGV3YXkuTG9nR3JvdXBMb2dEZXN0aW5hdGlvbih0ZXN0TG9nR3JvdXApLFxuICAgICAgICBhY2Nlc3NMb2dGb3JtYXQ6IHRlc3RGb3JtYXQsXG4gICAgICB9KSkubm90LnRvVGhyb3coKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3N1Y2NlZWRzIHdoZW4gYWNjZXNzIGxvZyBmb3JtYXQgY29udGFpbnMgYm90aCBgY29udGV4dFJlcXVlc3RJZCgpYCBhbmQgYGNvbnRleHRFeHRlbmRlZFJlcXVlc3RJZGAnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHN0YWNrLCAndGVzdC1hcGknLCB7IGNsb3VkV2F0Y2hSb2xlOiBmYWxzZSwgZGVwbG95OiBmYWxzZSB9KTtcbiAgICAgIGNvbnN0IGRlcGxveW1lbnQgPSBuZXcgYXBpZ2F0ZXdheS5EZXBsb3ltZW50KHN0YWNrLCAnbXktZGVwbG95bWVudCcsIHsgYXBpIH0pO1xuICAgICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgdGVzdExvZ0dyb3VwID0gbmV3IGxvZ3MuTG9nR3JvdXAoc3RhY2ssICdMb2dHcm91cCcpO1xuICAgICAgY29uc3QgdGVzdEZvcm1hdCA9IGFwaWdhdGV3YXkuQWNjZXNzTG9nRm9ybWF0LmN1c3RvbShKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHJlcXVlc3RJZDogYXBpZ2F0ZXdheS5BY2Nlc3NMb2dGaWVsZC5jb250ZXh0UmVxdWVzdElkKCksXG4gICAgICAgIGV4dGVuZGVkUmVxdWVzdElkOiBhcGlnYXRld2F5LkFjY2Vzc0xvZ0ZpZWxkLmNvbnRleHRFeHRlbmRlZFJlcXVlc3RJZCgpLFxuICAgICAgfSkpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4gbmV3IGFwaWdhdGV3YXkuU3RhZ2Uoc3RhY2ssICdteS1zdGFnZScsIHtcbiAgICAgICAgZGVwbG95bWVudCxcbiAgICAgICAgYWNjZXNzTG9nRGVzdGluYXRpb246IG5ldyBhcGlnYXRld2F5LkxvZ0dyb3VwTG9nRGVzdGluYXRpb24odGVzdExvZ0dyb3VwKSxcbiAgICAgICAgYWNjZXNzTG9nRm9ybWF0OiB0ZXN0Rm9ybWF0LFxuICAgICAgfSkpLm5vdC50b1Rocm93KCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdmYWlscyB3aGVuIGFjY2VzcyBsb2cgZm9ybWF0IGNvbnRhaW5zIGBjb250ZXh0UmVxdWVzdElkWHh4YCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScsIHsgY2xvdWRXYXRjaFJvbGU6IGZhbHNlLCBkZXBsb3k6IGZhbHNlIH0pO1xuICAgICAgY29uc3QgZGVwbG95bWVudCA9IG5ldyBhcGlnYXRld2F5LkRlcGxveW1lbnQoc3RhY2ssICdteS1kZXBsb3ltZW50JywgeyBhcGkgfSk7XG4gICAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCB0ZXN0TG9nR3JvdXAgPSBuZXcgbG9ncy5Mb2dHcm91cChzdGFjaywgJ0xvZ0dyb3VwJyk7XG4gICAgICBjb25zdCB0ZXN0Rm9ybWF0ID0gYXBpZ2F0ZXdheS5BY2Nlc3NMb2dGb3JtYXQuY3VzdG9tKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgcmVxdWVzdElkWHh4OiAnJGNvbnRleHQucmVxdWVzdElkWHh4JyxcbiAgICAgIH0pKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IG5ldyBhcGlnYXRld2F5LlN0YWdlKHN0YWNrLCAnbXktc3RhZ2UnLCB7XG4gICAgICAgIGRlcGxveW1lbnQsXG4gICAgICAgIGFjY2Vzc0xvZ0Rlc3RpbmF0aW9uOiBuZXcgYXBpZ2F0ZXdheS5Mb2dHcm91cExvZ0Rlc3RpbmF0aW9uKHRlc3RMb2dHcm91cCksXG4gICAgICAgIGFjY2Vzc0xvZ0Zvcm1hdDogdGVzdEZvcm1hdCxcbiAgICAgIH0pKS50b1Rocm93KCdBY2Nlc3MgbG9nIG11c3QgaW5jbHVkZSBlaXRoZXIgYEFjY2Vzc0xvZ0Zvcm1hdC5jb250ZXh0UmVxdWVzdElkKClgIG9yIGBBY2Nlc3NMb2dGb3JtYXQuY29udGV4dEV4dGVuZGVkUmVxdWVzdElkKClgJyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdkb2VzIG5vdCBmYWlsIHdoZW4gYWNjZXNzIGxvZyBmb3JtYXQgaXMgYSB0b2tlbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHN0YWNrLCAndGVzdC1hcGknLCB7IGNsb3VkV2F0Y2hSb2xlOiBmYWxzZSwgZGVwbG95OiBmYWxzZSB9KTtcbiAgICAgIGNvbnN0IGRlcGxveW1lbnQgPSBuZXcgYXBpZ2F0ZXdheS5EZXBsb3ltZW50KHN0YWNrLCAnbXktZGVwbG95bWVudCcsIHsgYXBpIH0pO1xuICAgICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgdGVzdExvZ0dyb3VwID0gbmV3IGxvZ3MuTG9nR3JvdXAoc3RhY2ssICdMb2dHcm91cCcpO1xuICAgICAgY29uc3QgdGVzdEZvcm1hdCA9IGFwaWdhdGV3YXkuQWNjZXNzTG9nRm9ybWF0LmN1c3RvbShjZGsuTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiAndGVzdCcgfSkpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QoKCkgPT4gbmV3IGFwaWdhdGV3YXkuU3RhZ2Uoc3RhY2ssICdteS1zdGFnZScsIHtcbiAgICAgICAgZGVwbG95bWVudCxcbiAgICAgICAgYWNjZXNzTG9nRGVzdGluYXRpb246IG5ldyBhcGlnYXRld2F5LkxvZ0dyb3VwTG9nRGVzdGluYXRpb24odGVzdExvZ0dyb3VwKSxcbiAgICAgICAgYWNjZXNzTG9nRm9ybWF0OiB0ZXN0Rm9ybWF0LFxuICAgICAgfSkpLm5vdC50b1Rocm93KCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdmYWlscyB3aGVuIGFjY2VzcyBsb2cgZGVzdGluYXRpb24gaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaShzdGFjaywgJ3Rlc3QtYXBpJywgeyBjbG91ZFdhdGNoUm9sZTogZmFsc2UsIGRlcGxveTogZmFsc2UgfSk7XG4gICAgICBjb25zdCBkZXBsb3ltZW50ID0gbmV3IGFwaWdhdGV3YXkuRGVwbG95bWVudChzdGFjaywgJ215LWRlcGxveW1lbnQnLCB7IGFwaSB9KTtcbiAgICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHRlc3RGb3JtYXQgPSBhcGlnYXRld2F5LkFjY2Vzc0xvZ0Zvcm1hdC5qc29uV2l0aFN0YW5kYXJkRmllbGRzKCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiBuZXcgYXBpZ2F0ZXdheS5TdGFnZShzdGFjaywgJ215LXN0YWdlJywge1xuICAgICAgICBkZXBsb3ltZW50LFxuICAgICAgICBhY2Nlc3NMb2dGb3JtYXQ6IHRlc3RGb3JtYXQsXG4gICAgICB9KSkudG9UaHJvdygvQWNjZXNzIGxvZyBmb3JtYXQgaXMgc3BlY2lmaWVkIHdpdGhvdXQgYSBkZXN0aW5hdGlvbi8pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdkZWZhdWx0IHRocm90dGxpbmcgc2V0dGluZ3MnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgYXBpZ2F0ZXdheS5TcGVjUmVzdEFwaShzdGFjaywgJ3Rlc3RhcGknLCB7XG4gICAgICBhcGlEZWZpbml0aW9uOiBBcGlEZWZpbml0aW9uLmZyb21JbmxpbmUoe1xuICAgICAgICBvcGVuYXBpOiAnMy4wLjInLFxuICAgICAgfSksXG4gICAgICBkZXBsb3lPcHRpb25zOiB7XG4gICAgICAgIHRocm90dGxpbmdCdXJzdExpbWl0OiAwLFxuICAgICAgICB0aHJvdHRsaW5nUmF0ZUxpbWl0OiAwLFxuICAgICAgICBtZXRyaWNzRW5hYmxlZDogZmFsc2UsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OlN0YWdlJywge1xuICAgICAgTWV0aG9kU2V0dGluZ3M6IFt7XG4gICAgICAgIERhdGFUcmFjZUVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICBIdHRwTWV0aG9kOiAnKicsXG4gICAgICAgIFJlc291cmNlUGF0aDogJy8qJyxcbiAgICAgICAgVGhyb3R0bGluZ0J1cnN0TGltaXQ6IDAsXG4gICAgICAgIFRocm90dGxpbmdSYXRlTGltaXQ6IDAsXG4gICAgICB9XSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkQXBpS2V5IGlzIHN1cHBvcnRlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScsIHsgY2xvdWRXYXRjaFJvbGU6IGZhbHNlIH0pO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG4gICAgY29uc3Qgc3RhZ2UgPSBuZXcgYXBpZ2F0ZXdheS5TdGFnZShzdGFjaywgJ1N0YWdlJywge1xuICAgICAgZGVwbG95bWVudDogYXBpLmxhdGVzdERlcGxveW1lbnQhLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIHN0YWdlLmFkZEFwaUtleSgnTXlLZXknKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpBcGlLZXknLCB7XG4gICAgICBTdGFnZUtleXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlc3RBcGlJZDoge1xuICAgICAgICAgICAgUmVmOiAndGVzdGFwaUQ2NDUxRjcwJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFN0YWdlTmFtZToge1xuICAgICAgICAgICAgUmVmOiAnU3RhZ2UwRThDMkFGNScsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZEFwaUtleSBpcyBzdXBwb3J0ZWQgb24gYW4gaW1wb3J0ZWQgc3RhZ2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHN0YWNrLCAndGVzdC1hcGknLCB7IGNsb3VkV2F0Y2hSb2xlOiBmYWxzZSB9KTtcbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpO1xuICAgIGNvbnN0IHN0YWdlID0gYXBpZ2F0ZXdheS5TdGFnZS5mcm9tU3RhZ2VBdHRyaWJ1dGVzKHN0YWNrLCAnU3RhZ2UnLCB7XG4gICAgICByZXN0QXBpOiBhcGksXG4gICAgICBzdGFnZU5hbWU6ICdNeVN0YWdlJyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBzdGFnZS5hZGRBcGlLZXkoJ015S2V5Jyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6QXBpS2V5Jywge1xuICAgICAgU3RhZ2VLZXlzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZXN0QXBpSWQ6IHtcbiAgICAgICAgICAgIFJlZjogJ3Rlc3RhcGlENjQ1MUY3MCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBTdGFnZU5hbWU6ICdNeVN0YWdlJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ01ldHJpY3MnLCAoKSA9PiB7XG4gICAgdGVzdCgnbWV0cmljJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHN0YWNrLCAndGVzdC1hcGknKTtcbiAgICAgIGNvbnN0IG1ldHJpY05hbWUgPSAnNFhYRXJyb3InO1xuICAgICAgY29uc3Qgc3RhdGlzdGljID0gJ1N1bSc7XG4gICAgICBjb25zdCBtZXRyaWMgPSBhcGkuZGVwbG95bWVudFN0YWdlLm1ldHJpYyhtZXRyaWNOYW1lLCB7IHN0YXRpc3RpYyB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KG1ldHJpYy5uYW1lc3BhY2UpLnRvRXF1YWwoJ0FXUy9BcGlHYXRld2F5Jyk7XG4gICAgICBleHBlY3QobWV0cmljLm1ldHJpY05hbWUpLnRvRXF1YWwobWV0cmljTmFtZSk7XG4gICAgICBleHBlY3QobWV0cmljLnN0YXRpc3RpYykudG9FcXVhbChzdGF0aXN0aWMpO1xuICAgICAgZXhwZWN0KG1ldHJpYy5kaW1lbnNpb25zKS50b0VxdWFsKHsgQXBpTmFtZTogJ3Rlc3QtYXBpJywgU3RhZ2U6IGFwaS5kZXBsb3ltZW50U3RhZ2Uuc3RhZ2VOYW1lIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbWV0cmljQ2xpZW50RXJyb3InLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScpO1xuICAgICAgY29uc3QgY29sb3IgPSAnIzAwZmYwMCc7XG4gICAgICBjb25zdCBtZXRyaWMgPSBhcGkuZGVwbG95bWVudFN0YWdlLm1ldHJpY0NsaWVudEVycm9yKHsgY29sb3IgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChtZXRyaWMubWV0cmljTmFtZSkudG9FcXVhbCgnNFhYRXJyb3InKTtcbiAgICAgIGV4cGVjdChtZXRyaWMuc3RhdGlzdGljKS50b0VxdWFsKCdTdW0nKTtcbiAgICAgIGV4cGVjdChtZXRyaWMuY29sb3IpLnRvRXF1YWwoY29sb3IpO1xuICAgICAgZXhwZWN0KG1ldHJpYy5kaW1lbnNpb25zKS50b0VxdWFsKHsgQXBpTmFtZTogJ3Rlc3QtYXBpJywgU3RhZ2U6IGFwaS5kZXBsb3ltZW50U3RhZ2Uuc3RhZ2VOYW1lIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbWV0cmljU2VydmVyRXJyb3InLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScpO1xuICAgICAgY29uc3QgY29sb3IgPSAnIzAwZmYwMCc7XG4gICAgICBjb25zdCBtZXRyaWMgPSBhcGkuZGVwbG95bWVudFN0YWdlLm1ldHJpY1NlcnZlckVycm9yKHsgY29sb3IgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChtZXRyaWMubWV0cmljTmFtZSkudG9FcXVhbCgnNVhYRXJyb3InKTtcbiAgICAgIGV4cGVjdChtZXRyaWMuc3RhdGlzdGljKS50b0VxdWFsKCdTdW0nKTtcbiAgICAgIGV4cGVjdChtZXRyaWMuY29sb3IpLnRvRXF1YWwoY29sb3IpO1xuICAgICAgZXhwZWN0KG1ldHJpYy5kaW1lbnNpb25zKS50b0VxdWFsKHsgQXBpTmFtZTogJ3Rlc3QtYXBpJywgU3RhZ2U6IGFwaS5kZXBsb3ltZW50U3RhZ2Uuc3RhZ2VOYW1lIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbWV0cmljQ2FjaGVIaXRDb3VudCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaShzdGFjaywgJ3Rlc3QtYXBpJyk7XG4gICAgICBjb25zdCBjb2xvciA9ICcjMDBmZjAwJztcbiAgICAgIGNvbnN0IG1ldHJpYyA9IGFwaS5kZXBsb3ltZW50U3RhZ2UubWV0cmljQ2FjaGVIaXRDb3VudCh7IGNvbG9yIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QobWV0cmljLm1ldHJpY05hbWUpLnRvRXF1YWwoJ0NhY2hlSGl0Q291bnQnKTtcbiAgICAgIGV4cGVjdChtZXRyaWMuc3RhdGlzdGljKS50b0VxdWFsKCdTdW0nKTtcbiAgICAgIGV4cGVjdChtZXRyaWMuY29sb3IpLnRvRXF1YWwoY29sb3IpO1xuICAgICAgZXhwZWN0KG1ldHJpYy5kaW1lbnNpb25zKS50b0VxdWFsKHsgQXBpTmFtZTogJ3Rlc3QtYXBpJywgU3RhZ2U6IGFwaS5kZXBsb3ltZW50U3RhZ2Uuc3RhZ2VOYW1lIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbWV0cmljQ2FjaGVNaXNzQ291bnQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScpO1xuICAgICAgY29uc3QgY29sb3IgPSAnIzAwZmYwMCc7XG4gICAgICBjb25zdCBtZXRyaWMgPSBhcGkuZGVwbG95bWVudFN0YWdlLm1ldHJpY0NhY2hlTWlzc0NvdW50KHsgY29sb3IgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChtZXRyaWMubWV0cmljTmFtZSkudG9FcXVhbCgnQ2FjaGVNaXNzQ291bnQnKTtcbiAgICAgIGV4cGVjdChtZXRyaWMuc3RhdGlzdGljKS50b0VxdWFsKCdTdW0nKTtcbiAgICAgIGV4cGVjdChtZXRyaWMuY29sb3IpLnRvRXF1YWwoY29sb3IpO1xuICAgICAgZXhwZWN0KG1ldHJpYy5kaW1lbnNpb25zKS50b0VxdWFsKHsgQXBpTmFtZTogJ3Rlc3QtYXBpJywgU3RhZ2U6IGFwaS5kZXBsb3ltZW50U3RhZ2Uuc3RhZ2VOYW1lIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbWV0cmljQ291bnQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScpO1xuICAgICAgY29uc3QgY29sb3IgPSAnIzAwZmYwMCc7XG4gICAgICBjb25zdCBtZXRyaWMgPSBhcGkuZGVwbG95bWVudFN0YWdlLm1ldHJpY0NvdW50KHsgY29sb3IgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChtZXRyaWMubWV0cmljTmFtZSkudG9FcXVhbCgnQ291bnQnKTtcbiAgICAgIGV4cGVjdChtZXRyaWMuc3RhdGlzdGljKS50b0VxdWFsKCdTYW1wbGVDb3VudCcpO1xuICAgICAgZXhwZWN0KG1ldHJpYy5jb2xvcikudG9FcXVhbChjb2xvcik7XG4gICAgICBleHBlY3QobWV0cmljLmRpbWVuc2lvbnMpLnRvRXF1YWwoeyBBcGlOYW1lOiAndGVzdC1hcGknLCBTdGFnZTogYXBpLmRlcGxveW1lbnRTdGFnZS5zdGFnZU5hbWUgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdtZXRyaWNJbnRlZ3JhdGlvbkxhdGVuY3knLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScpO1xuICAgICAgY29uc3QgY29sb3IgPSAnIzAwZmYwMCc7XG4gICAgICBjb25zdCBtZXRyaWMgPSBhcGkuZGVwbG95bWVudFN0YWdlLm1ldHJpY0ludGVncmF0aW9uTGF0ZW5jeSh7IGNvbG9yIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QobWV0cmljLm1ldHJpY05hbWUpLnRvRXF1YWwoJ0ludGVncmF0aW9uTGF0ZW5jeScpO1xuICAgICAgZXhwZWN0KG1ldHJpYy5zdGF0aXN0aWMpLnRvRXF1YWwoJ0F2ZXJhZ2UnKTtcbiAgICAgIGV4cGVjdChtZXRyaWMuY29sb3IpLnRvRXF1YWwoY29sb3IpO1xuICAgICAgZXhwZWN0KG1ldHJpYy5kaW1lbnNpb25zKS50b0VxdWFsKHsgQXBpTmFtZTogJ3Rlc3QtYXBpJywgU3RhZ2U6IGFwaS5kZXBsb3ltZW50U3RhZ2Uuc3RhZ2VOYW1lIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbWV0cmljTGF0ZW5jeScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaShzdGFjaywgJ3Rlc3QtYXBpJyk7XG4gICAgICBjb25zdCBjb2xvciA9ICcjMDBmZjAwJztcbiAgICAgIGNvbnN0IG1ldHJpYyA9IGFwaS5kZXBsb3ltZW50U3RhZ2UubWV0cmljTGF0ZW5jeSh7IGNvbG9yIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3QobWV0cmljLm1ldHJpY05hbWUpLnRvRXF1YWwoJ0xhdGVuY3knKTtcbiAgICAgIGV4cGVjdChtZXRyaWMuc3RhdGlzdGljKS50b0VxdWFsKCdBdmVyYWdlJyk7XG4gICAgICBleHBlY3QobWV0cmljLmNvbG9yKS50b0VxdWFsKGNvbG9yKTtcbiAgICAgIGV4cGVjdChtZXRyaWMuZGltZW5zaW9ucykudG9FcXVhbCh7IEFwaU5hbWU6ICd0ZXN0LWFwaScsIFN0YWdlOiBhcGkuZGVwbG95bWVudFN0YWdlLnN0YWdlTmFtZSB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==