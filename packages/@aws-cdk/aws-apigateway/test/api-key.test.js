"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const apigateway = require("../lib");
describe('api key', () => {
    test('default setup', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new apigateway.ApiKey(stack, 'my-api-key');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
            Enabled: true,
        });
    });
    cdk_build_tools_1.testDeprecated('throws if deploymentStage is not set', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const restApi = apigateway.RestApi.fromRestApiId(stack, 'imported', 'abc');
        // THEN
        expect(() => {
            new apigateway.ApiKey(stack, 'my-api-key', {
                resources: [restApi],
            });
        }).toThrow(/Cannot add an ApiKey to a RestApi that does not contain a "deploymentStage"/);
    });
    test('enabled flag is respected', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new apigateway.ApiKey(stack, 'my-api-key', {
            enabled: false,
            value: 'arandomstringwithmorethantwentycharacters',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
            Enabled: false,
            Value: 'arandomstringwithmorethantwentycharacters',
        });
    });
    cdk_build_tools_1.testDeprecated('specify props for apiKey', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'test-api', {
            cloudWatchRole: false,
            deploy: true,
            deployOptions: { stageName: 'test' },
        });
        api.root.addMethod('GET'); // api must have atleast one method.
        // WHEN
        new apigateway.ApiKey(stack, 'test-api-key', {
            customerId: 'test-customer',
            resources: [api],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
            CustomerId: 'test-customer',
            StageKeys: [
                {
                    RestApiId: { Ref: 'testapiD6451F70' },
                    StageName: { Ref: 'testapiDeploymentStagetest5869DF71' },
                },
            ],
        });
    });
    test('add description to apiKey', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'test-api');
        api.root.addMethod('GET'); // api must have atleast one method.
        // WHEN
        api.addApiKey('my-api-key', {
            description: 'The most secret api key',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
            Description: 'The most secret api key',
        });
    });
    test('add description to apiKey added to a stage', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'test-api');
        api.root.addMethod('GET'); // api must have atleast one method.
        const stage = apigateway.Stage.fromStageAttributes(stack, 'Stage', {
            restApi: api,
            stageName: 'MyStage',
        });
        // WHEN
        stage.addApiKey('my-api-key', {
            description: 'The most secret api key',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
            Description: 'The most secret api key',
        });
    });
    test('use an imported api key', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const api = new apigateway.RestApi(stack, 'test-api', {
            cloudWatchRole: false,
            deploy: true,
            deployOptions: { stageName: 'test' },
        });
        api.root.addMethod('GET'); // api must have atleast one method.
        // WHEN
        const importedKey = apigateway.ApiKey.fromApiKeyId(stack, 'imported', 'KeyIdabc');
        const usagePlan = api.addUsagePlan('plan');
        usagePlan.addApiKey(importedKey);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::UsagePlanKey', {
            KeyId: 'KeyIdabc',
            KeyType: 'API_KEY',
            UsagePlanId: {
                Ref: 'testapiplan1B111AFF',
            },
        });
    });
    test('grantRead', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const user = new iam.User(stack, 'User');
        const api = new apigateway.RestApi(stack, 'test-api', {
            cloudWatchRole: false,
            deploy: true,
            deployOptions: { stageName: 'test' },
        });
        api.root.addMethod('GET'); // api must have atleast one method.
        const stage = apigateway.Stage.fromStageAttributes(stack, 'Stage', {
            restApi: api,
            stageName: 'MyStage',
        });
        // WHEN
        const apiKey = new apigateway.ApiKey(stack, 'test-api-key', {
            customerId: 'test-customer',
            stages: [stage],
        });
        apiKey.grantRead(user);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'apigateway:GET',
                        Effect: 'Allow',
                        Resource: {
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
                                    '::/apikeys/',
                                    {
                                        Ref: 'testapikeyE093E501',
                                    },
                                ],
                            ],
                        },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('grantWrite', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const user = new iam.User(stack, 'User');
        const api = new apigateway.RestApi(stack, 'test-api', {
            cloudWatchRole: false,
            deploy: true,
            deployOptions: { stageName: 'test' },
        });
        api.root.addMethod('GET'); // api must have atleast one method.
        const stage = apigateway.Stage.fromStageAttributes(stack, 'Stage', {
            restApi: api,
            stageName: 'MyStage',
        });
        // WHEN
        const apiKey = new apigateway.ApiKey(stack, 'test-api-key', {
            customerId: 'test-customer',
            stages: [stage],
        });
        apiKey.grantWrite(user);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: [
                            'apigateway:POST',
                            'apigateway:PUT',
                            'apigateway:PATCH',
                            'apigateway:DELETE',
                        ],
                        Effect: 'Allow',
                        Resource: {
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
                                    '::/apikeys/',
                                    {
                                        Ref: 'testapikeyE093E501',
                                    },
                                ],
                            ],
                        },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('grantReadWrite', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const user = new iam.User(stack, 'User');
        const api = new apigateway.RestApi(stack, 'test-api', {
            cloudWatchRole: false,
            deploy: true,
            deployOptions: { stageName: 'test' },
        });
        api.root.addMethod('GET'); // api must have atleast one method.
        const stage = apigateway.Stage.fromStageAttributes(stack, 'Stage', {
            restApi: api,
            stageName: 'MyStage',
        });
        // WHEN
        const apiKey = new apigateway.ApiKey(stack, 'test-api-key', {
            customerId: 'test-customer',
            stages: [stage],
        });
        apiKey.grantReadWrite(user);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: [
                            'apigateway:GET',
                            'apigateway:POST',
                            'apigateway:PUT',
                            'apigateway:PATCH',
                            'apigateway:DELETE',
                        ],
                        Effect: 'Allow',
                        Resource: {
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
                                    '::/apikeys/',
                                    {
                                        Ref: 'testapikeyE093E501',
                                    },
                                ],
                            ],
                        },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    describe('rate limited', () => {
        test('default setup', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const api = new apigateway.RestApi(stack, 'my-api', { cloudWatchRole: false, deploy: false });
            api.root.addMethod('GET'); // Need at least one method on the api
            // WHEN
            new apigateway.RateLimitedApiKey(stack, 'my-api-key');
            // THEN
            // should have an api key with no props defined.
            assertions_1.Template.fromStack(stack).hasResource('AWS::ApiGateway::ApiKey', assertions_1.Match.anyValue());
            // should not have a usage plan.
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ApiGateway::UsagePlan', 0);
            // should not have a usage plan key.
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ApiGateway::UsagePlanKey', 0);
        });
        test('only api key is created when rate limiting properties are not provided', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const api = new apigateway.RestApi(stack, 'test-api', {
                cloudWatchRole: false,
                deploy: true,
                deployOptions: { stageName: 'test' },
            });
            api.root.addMethod('GET'); // api must have atleast one method.
            const stage = apigateway.Stage.fromStageAttributes(stack, 'Stage', {
                restApi: api,
                stageName: 'MyStage',
            });
            // WHEN
            new apigateway.RateLimitedApiKey(stack, 'test-api-key', {
                customerId: 'test-customer',
                stages: [stage],
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
                CustomerId: 'test-customer',
                StageKeys: [
                    {
                        RestApiId: { Ref: 'testapiD6451F70' },
                        StageName: 'MyStage',
                    },
                ],
            });
            // should not have a usage plan.
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ApiGateway::UsagePlan', 0);
            // should not have a usage plan key.
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::ApiGateway::UsagePlanKey', 0);
        });
        test('api key and usage plan are created and linked when rate limiting properties are provided', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const api = new apigateway.RestApi(stack, 'test-api', {
                cloudWatchRole: false,
                deploy: true,
                deployOptions: { stageName: 'test' },
            });
            api.root.addMethod('GET'); // api must have atleast one method.
            const stage = apigateway.Stage.fromStageAttributes(stack, 'Stage', {
                restApi: api,
                stageName: 'MyStage',
            });
            // WHEN
            new apigateway.RateLimitedApiKey(stack, 'test-api-key', {
                customerId: 'test-customer',
                stages: [stage],
                quota: {
                    limit: 10000,
                    period: apigateway.Period.MONTH,
                },
            });
            // THEN
            // should have an api key
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::ApiKey', {
                CustomerId: 'test-customer',
                StageKeys: [
                    {
                        RestApiId: { Ref: 'testapiD6451F70' },
                        StageName: 'MyStage',
                    },
                ],
            });
            // should have a usage plan with specified quota.
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::UsagePlan', {
                Quota: {
                    Limit: 10000,
                    Period: 'MONTH',
                },
            });
            // should have a usage plan key linking the api key and usage plan
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ApiGateway::UsagePlanKey', {
                KeyId: {
                    Ref: 'testapikey998028B6',
                },
                KeyType: 'API_KEY',
                UsagePlanId: {
                    Ref: 'testapikeyUsagePlanResource66DB63D6',
                },
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWtleS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBpLWtleS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELHdDQUF3QztBQUN4Qyw4REFBMEQ7QUFDMUQscUNBQXFDO0FBQ3JDLHFDQUFxQztBQUVyQyxRQUFRLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtJQUN2QixJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtRQUN6QixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsT0FBTztRQUNQLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFM0MsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHlCQUF5QixFQUFFO1lBQ3pFLE9BQU8sRUFBRSxJQUFJO1NBQ2QsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxnQ0FBYyxDQUFDLHNDQUFzQyxFQUFFLEdBQUcsRUFBRTtRQUMxRCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUUzRSxPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO2dCQUN6QyxTQUFTLEVBQUUsQ0FBQyxPQUFPLENBQUM7YUFDckIsQ0FBQyxDQUFDO1FBRUwsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDZFQUE2RSxDQUFDLENBQUM7SUFDNUYsQ0FBQyxDQUFDLENBQUM7SUFHSCxJQUFJ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RDtZQUNqRCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw0QkFBNEIsRUFBRTtnQkFDNUUsS0FBSyxFQUFFO29CQUNMLEtBQUssRUFBRSxLQUFLO29CQUNaLE1BQU0sRUFBRSxPQUFPO2lCQUNoQjthQUNGLENBQUMsQ0FBQztZQUNILGtFQUFrRTtZQUNsRSxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQywrQkFBK0IsRUFBRTtnQkFDL0UsS0FBSyxFQUFFO29CQUNMLEdBQUcsRUFBRSxvQkFBb0I7aUJBQzFCO2dCQUNELE9BQU8sRUFBRSxTQUFTO2dCQUNsQixXQUFXLEVBQUU7b0JBQ1gsR0FBRyxFQUFFLHFDQUFxQztpQkFDM0M7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IHRlc3REZXByZWNhdGVkIH0gZnJvbSAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGFwaWdhdGV3YXkgZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ2FwaSBrZXknLCAoKSA9PiB7XG4gIHRlc3QoJ2RlZmF1bHQgc2V0dXAnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgYXBpZ2F0ZXdheS5BcGlLZXkoc3RhY2ssICdteS1hcGkta2V5Jyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6QXBpS2V5Jywge1xuICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ3Rocm93cyBpZiBkZXBsb3ltZW50U3RhZ2UgaXMgbm90IHNldCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHJlc3RBcGkgPSBhcGlnYXRld2F5LlJlc3RBcGkuZnJvbVJlc3RBcGlJZChzdGFjaywgJ2ltcG9ydGVkJywgJ2FiYycpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgYXBpZ2F0ZXdheS5BcGlLZXkoc3RhY2ssICdteS1hcGkta2V5Jywge1xuICAgICAgICByZXNvdXJjZXM6IFtyZXN0QXBpXSxcbiAgICAgIH0pO1xuXG4gICAgfSkudG9UaHJvdygvQ2Fubm90IGFkZCBhbiBBcGlLZXkgdG8gYSBSZXN0QXBpIHRoYXQgZG9lcyBub3QgY29udGFpbiBhIFwiZGVwbG95bWVudFN0YWdlXCIvKTtcbiAgfSk7XG5cblxuICB0ZXN0KCdlbmFibGVkIGZsYWcgaXMgcmVzcGVjdGVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGFwaWdhdGV3YXkuQXBpS2V5KHN0YWNrLCAnbXktYXBpLWtleScsIHtcbiAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgdmFsdWU6ICdhcmFuZG9tc3RyaW5nd2l0aG1vcmV0aGFudHdlbnR5Y2hhcmFjdGVycycsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6QXBpS2V5Jywge1xuICAgICAgRW5hYmxlZDogZmFsc2UsXG4gICAgICBWYWx1ZTogJ2FyYW5kb21zdHJpbmd3aXRobW9yZXRoYW50d2VudHljaGFyYWN0ZXJzJyxcbiAgICB9KTtcbiAgfSk7XG5cblxuICB0ZXN0RGVwcmVjYXRlZCgnc3BlY2lmeSBwcm9wcyBmb3IgYXBpS2V5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaShzdGFjaywgJ3Rlc3QtYXBpJywge1xuICAgICAgY2xvdWRXYXRjaFJvbGU6IGZhbHNlLFxuICAgICAgZGVwbG95OiB0cnVlLFxuICAgICAgZGVwbG95T3B0aW9uczogeyBzdGFnZU5hbWU6ICd0ZXN0JyB9LFxuICAgIH0pO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7IC8vIGFwaSBtdXN0IGhhdmUgYXRsZWFzdCBvbmUgbWV0aG9kLlxuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBhcGlnYXRld2F5LkFwaUtleShzdGFjaywgJ3Rlc3QtYXBpLWtleScsIHtcbiAgICAgIGN1c3RvbWVySWQ6ICd0ZXN0LWN1c3RvbWVyJyxcbiAgICAgIHJlc291cmNlczogW2FwaV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6QXBpS2V5Jywge1xuICAgICAgQ3VzdG9tZXJJZDogJ3Rlc3QtY3VzdG9tZXInLFxuICAgICAgU3RhZ2VLZXlzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZXN0QXBpSWQ6IHsgUmVmOiAndGVzdGFwaUQ2NDUxRjcwJyB9LFxuICAgICAgICAgIFN0YWdlTmFtZTogeyBSZWY6ICd0ZXN0YXBpRGVwbG95bWVudFN0YWdldGVzdDU4NjlERjcxJyB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkIGRlc2NyaXB0aW9uIHRvIGFwaUtleScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScpO1xuICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7IC8vIGFwaSBtdXN0IGhhdmUgYXRsZWFzdCBvbmUgbWV0aG9kLlxuXG4gICAgLy8gV0hFTlxuICAgIGFwaS5hZGRBcGlLZXkoJ215LWFwaS1rZXknLCB7XG4gICAgICBkZXNjcmlwdGlvbjogJ1RoZSBtb3N0IHNlY3JldCBhcGkga2V5JyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpBcGlLZXknLCB7XG4gICAgICBEZXNjcmlwdGlvbjogJ1RoZSBtb3N0IHNlY3JldCBhcGkga2V5JyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkIGRlc2NyaXB0aW9uIHRvIGFwaUtleSBhZGRlZCB0byBhIHN0YWdlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWdhdGV3YXkuUmVzdEFwaShzdGFjaywgJ3Rlc3QtYXBpJyk7XG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTsgLy8gYXBpIG11c3QgaGF2ZSBhdGxlYXN0IG9uZSBtZXRob2QuXG5cbiAgICBjb25zdCBzdGFnZSA9IGFwaWdhdGV3YXkuU3RhZ2UuZnJvbVN0YWdlQXR0cmlidXRlcyhzdGFjaywgJ1N0YWdlJywge1xuICAgICAgcmVzdEFwaTogYXBpLFxuICAgICAgc3RhZ2VOYW1lOiAnTXlTdGFnZScsXG4gICAgfSk7XG4gICAgLy8gV0hFTlxuICAgIHN0YWdlLmFkZEFwaUtleSgnbXktYXBpLWtleScsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIG1vc3Qgc2VjcmV0IGFwaSBrZXknLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OkFwaUtleScsIHtcbiAgICAgIERlc2NyaXB0aW9uOiAnVGhlIG1vc3Qgc2VjcmV0IGFwaSBrZXknLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd1c2UgYW4gaW1wb3J0ZWQgYXBpIGtleScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScsIHtcbiAgICAgIGNsb3VkV2F0Y2hSb2xlOiBmYWxzZSxcbiAgICAgIGRlcGxveTogdHJ1ZSxcbiAgICAgIGRlcGxveU9wdGlvbnM6IHsgc3RhZ2VOYW1lOiAndGVzdCcgfSxcbiAgICB9KTtcbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpOyAvLyBhcGkgbXVzdCBoYXZlIGF0bGVhc3Qgb25lIG1ldGhvZC5cblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBpbXBvcnRlZEtleSA9IGFwaWdhdGV3YXkuQXBpS2V5LmZyb21BcGlLZXlJZChzdGFjaywgJ2ltcG9ydGVkJywgJ0tleUlkYWJjJyk7XG4gICAgY29uc3QgdXNhZ2VQbGFuID0gYXBpLmFkZFVzYWdlUGxhbigncGxhbicpO1xuICAgIHVzYWdlUGxhbi5hZGRBcGlLZXkoaW1wb3J0ZWRLZXkpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OlVzYWdlUGxhbktleScsIHtcbiAgICAgIEtleUlkOiAnS2V5SWRhYmMnLFxuICAgICAgS2V5VHlwZTogJ0FQSV9LRVknLFxuICAgICAgVXNhZ2VQbGFuSWQ6IHtcbiAgICAgICAgUmVmOiAndGVzdGFwaXBsYW4xQjExMUFGRicsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdncmFudFJlYWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHN0YWNrLCAnVXNlcicpO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScsIHtcbiAgICAgIGNsb3VkV2F0Y2hSb2xlOiBmYWxzZSxcbiAgICAgIGRlcGxveTogdHJ1ZSxcbiAgICAgIGRlcGxveU9wdGlvbnM6IHsgc3RhZ2VOYW1lOiAndGVzdCcgfSxcbiAgICB9KTtcbiAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpOyAvLyBhcGkgbXVzdCBoYXZlIGF0bGVhc3Qgb25lIG1ldGhvZC5cbiAgICBjb25zdCBzdGFnZSA9IGFwaWdhdGV3YXkuU3RhZ2UuZnJvbVN0YWdlQXR0cmlidXRlcyhzdGFjaywgJ1N0YWdlJywge1xuICAgICAgcmVzdEFwaTogYXBpLFxuICAgICAgc3RhZ2VOYW1lOiAnTXlTdGFnZScsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXBpS2V5ID0gbmV3IGFwaWdhdGV3YXkuQXBpS2V5KHN0YWNrLCAndGVzdC1hcGkta2V5Jywge1xuICAgICAgY3VzdG9tZXJJZDogJ3Rlc3QtY3VzdG9tZXInLFxuICAgICAgc3RhZ2VzOiBbc3RhZ2VdLFxuICAgIH0pO1xuICAgIGFwaUtleS5ncmFudFJlYWQodXNlcik7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdhcGlnYXRld2F5OkdFVCcsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzphcGlnYXRld2F5OicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOjovYXBpa2V5cy8nLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICd0ZXN0YXBpa2V5RTA5M0U1MDEnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdncmFudFdyaXRlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdXNlciA9IG5ldyBpYW0uVXNlcihzdGFjaywgJ1VzZXInKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHN0YWNrLCAndGVzdC1hcGknLCB7XG4gICAgICBjbG91ZFdhdGNoUm9sZTogZmFsc2UsXG4gICAgICBkZXBsb3k6IHRydWUsXG4gICAgICBkZXBsb3lPcHRpb25zOiB7IHN0YWdlTmFtZTogJ3Rlc3QnIH0sXG4gICAgfSk7XG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTsgLy8gYXBpIG11c3QgaGF2ZSBhdGxlYXN0IG9uZSBtZXRob2QuXG4gICAgY29uc3Qgc3RhZ2UgPSBhcGlnYXRld2F5LlN0YWdlLmZyb21TdGFnZUF0dHJpYnV0ZXMoc3RhY2ssICdTdGFnZScsIHtcbiAgICAgIHJlc3RBcGk6IGFwaSxcbiAgICAgIHN0YWdlTmFtZTogJ015U3RhZ2UnLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFwaUtleSA9IG5ldyBhcGlnYXRld2F5LkFwaUtleShzdGFjaywgJ3Rlc3QtYXBpLWtleScsIHtcbiAgICAgIGN1c3RvbWVySWQ6ICd0ZXN0LWN1c3RvbWVyJyxcbiAgICAgIHN0YWdlczogW3N0YWdlXSxcbiAgICB9KTtcbiAgICBhcGlLZXkuZ3JhbnRXcml0ZSh1c2VyKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAnYXBpZ2F0ZXdheTpQT1NUJyxcbiAgICAgICAgICAgICAgJ2FwaWdhdGV3YXk6UFVUJyxcbiAgICAgICAgICAgICAgJ2FwaWdhdGV3YXk6UEFUQ0gnLFxuICAgICAgICAgICAgICAnYXBpZ2F0ZXdheTpERUxFVEUnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOmFwaWdhdGV3YXk6JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6Oi9hcGlrZXlzLycsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ3Rlc3RhcGlrZXlFMDkzRTUwMScsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2dyYW50UmVhZFdyaXRlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgdXNlciA9IG5ldyBpYW0uVXNlcihzdGFjaywgJ1VzZXInKTtcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHN0YWNrLCAndGVzdC1hcGknLCB7XG4gICAgICBjbG91ZFdhdGNoUm9sZTogZmFsc2UsXG4gICAgICBkZXBsb3k6IHRydWUsXG4gICAgICBkZXBsb3lPcHRpb25zOiB7IHN0YWdlTmFtZTogJ3Rlc3QnIH0sXG4gICAgfSk7XG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTsgLy8gYXBpIG11c3QgaGF2ZSBhdGxlYXN0IG9uZSBtZXRob2QuXG4gICAgY29uc3Qgc3RhZ2UgPSBhcGlnYXRld2F5LlN0YWdlLmZyb21TdGFnZUF0dHJpYnV0ZXMoc3RhY2ssICdTdGFnZScsIHtcbiAgICAgIHJlc3RBcGk6IGFwaSxcbiAgICAgIHN0YWdlTmFtZTogJ015U3RhZ2UnLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFwaUtleSA9IG5ldyBhcGlnYXRld2F5LkFwaUtleShzdGFjaywgJ3Rlc3QtYXBpLWtleScsIHtcbiAgICAgIGN1c3RvbWVySWQ6ICd0ZXN0LWN1c3RvbWVyJyxcbiAgICAgIHN0YWdlczogW3N0YWdlXSxcbiAgICB9KTtcbiAgICBhcGlLZXkuZ3JhbnRSZWFkV3JpdGUodXNlcik7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgJ2FwaWdhdGV3YXk6R0VUJyxcbiAgICAgICAgICAgICAgJ2FwaWdhdGV3YXk6UE9TVCcsXG4gICAgICAgICAgICAgICdhcGlnYXRld2F5OlBVVCcsXG4gICAgICAgICAgICAgICdhcGlnYXRld2F5OlBBVENIJyxcbiAgICAgICAgICAgICAgJ2FwaWdhdGV3YXk6REVMRVRFJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzphcGlnYXRld2F5OicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOjovYXBpa2V5cy8nLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICd0ZXN0YXBpa2V5RTA5M0U1MDEnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgncmF0ZSBsaW1pdGVkJywgKCkgPT4ge1xuICAgIHRlc3QoJ2RlZmF1bHQgc2V0dXAnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHN0YWNrLCAnbXktYXBpJywgeyBjbG91ZFdhdGNoUm9sZTogZmFsc2UsIGRlcGxveTogZmFsc2UgfSk7XG4gICAgICBhcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpOyAvLyBOZWVkIGF0IGxlYXN0IG9uZSBtZXRob2Qgb24gdGhlIGFwaVxuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgYXBpZ2F0ZXdheS5SYXRlTGltaXRlZEFwaUtleShzdGFjaywgJ215LWFwaS1rZXknKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgLy8gc2hvdWxkIGhhdmUgYW4gYXBpIGtleSB3aXRoIG5vIHByb3BzIGRlZmluZWQuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkFwaUdhdGV3YXk6OkFwaUtleScsIE1hdGNoLmFueVZhbHVlKCkpO1xuICAgICAgLy8gc2hvdWxkIG5vdCBoYXZlIGEgdXNhZ2UgcGxhbi5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkFwaUdhdGV3YXk6OlVzYWdlUGxhbicsIDApO1xuICAgICAgLy8gc2hvdWxkIG5vdCBoYXZlIGEgdXNhZ2UgcGxhbiBrZXkuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpBcGlHYXRld2F5OjpVc2FnZVBsYW5LZXknLCAwKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ29ubHkgYXBpIGtleSBpcyBjcmVhdGVkIHdoZW4gcmF0ZSBsaW1pdGluZyBwcm9wZXJ0aWVzIGFyZSBub3QgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBhcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHN0YWNrLCAndGVzdC1hcGknLCB7XG4gICAgICAgIGNsb3VkV2F0Y2hSb2xlOiBmYWxzZSxcbiAgICAgICAgZGVwbG95OiB0cnVlLFxuICAgICAgICBkZXBsb3lPcHRpb25zOiB7IHN0YWdlTmFtZTogJ3Rlc3QnIH0sXG4gICAgICB9KTtcbiAgICAgIGFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7IC8vIGFwaSBtdXN0IGhhdmUgYXRsZWFzdCBvbmUgbWV0aG9kLlxuICAgICAgY29uc3Qgc3RhZ2UgPSBhcGlnYXRld2F5LlN0YWdlLmZyb21TdGFnZUF0dHJpYnV0ZXMoc3RhY2ssICdTdGFnZScsIHtcbiAgICAgICAgcmVzdEFwaTogYXBpLFxuICAgICAgICBzdGFnZU5hbWU6ICdNeVN0YWdlJyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgYXBpZ2F0ZXdheS5SYXRlTGltaXRlZEFwaUtleShzdGFjaywgJ3Rlc3QtYXBpLWtleScsIHtcbiAgICAgICAgY3VzdG9tZXJJZDogJ3Rlc3QtY3VzdG9tZXInLFxuICAgICAgICBzdGFnZXM6IFtzdGFnZV0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXBpR2F0ZXdheTo6QXBpS2V5Jywge1xuICAgICAgICBDdXN0b21lcklkOiAndGVzdC1jdXN0b21lcicsXG4gICAgICAgIFN0YWdlS2V5czogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlc3RBcGlJZDogeyBSZWY6ICd0ZXN0YXBpRDY0NTFGNzAnIH0sXG4gICAgICAgICAgICBTdGFnZU5hbWU6ICdNeVN0YWdlJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgICAvLyBzaG91bGQgbm90IGhhdmUgYSB1c2FnZSBwbGFuLlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6QXBpR2F0ZXdheTo6VXNhZ2VQbGFuJywgMCk7XG4gICAgICAvLyBzaG91bGQgbm90IGhhdmUgYSB1c2FnZSBwbGFuIGtleS5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkFwaUdhdGV3YXk6OlVzYWdlUGxhbktleScsIDApO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYXBpIGtleSBhbmQgdXNhZ2UgcGxhbiBhcmUgY3JlYXRlZCBhbmQgbGlua2VkIHdoZW4gcmF0ZSBsaW1pdGluZyBwcm9wZXJ0aWVzIGFyZSBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkoc3RhY2ssICd0ZXN0LWFwaScsIHtcbiAgICAgICAgY2xvdWRXYXRjaFJvbGU6IGZhbHNlLFxuICAgICAgICBkZXBsb3k6IHRydWUsXG4gICAgICAgIGRlcGxveU9wdGlvbnM6IHsgc3RhZ2VOYW1lOiAndGVzdCcgfSxcbiAgICAgIH0pO1xuICAgICAgYXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnKTsgLy8gYXBpIG11c3QgaGF2ZSBhdGxlYXN0IG9uZSBtZXRob2QuXG4gICAgICBjb25zdCBzdGFnZSA9IGFwaWdhdGV3YXkuU3RhZ2UuZnJvbVN0YWdlQXR0cmlidXRlcyhzdGFjaywgJ1N0YWdlJywge1xuICAgICAgICByZXN0QXBpOiBhcGksXG4gICAgICAgIHN0YWdlTmFtZTogJ015U3RhZ2UnLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBhcGlnYXRld2F5LlJhdGVMaW1pdGVkQXBpS2V5KHN0YWNrLCAndGVzdC1hcGkta2V5Jywge1xuICAgICAgICBjdXN0b21lcklkOiAndGVzdC1jdXN0b21lcicsXG4gICAgICAgIHN0YWdlczogW3N0YWdlXSxcbiAgICAgICAgcXVvdGE6IHtcbiAgICAgICAgICBsaW1pdDogMTAwMDAsXG4gICAgICAgICAgcGVyaW9kOiBhcGlnYXRld2F5LlBlcmlvZC5NT05USCxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICAvLyBzaG91bGQgaGF2ZSBhbiBhcGkga2V5XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBcGlHYXRld2F5OjpBcGlLZXknLCB7XG4gICAgICAgIEN1c3RvbWVySWQ6ICd0ZXN0LWN1c3RvbWVyJyxcbiAgICAgICAgU3RhZ2VLZXlzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVzdEFwaUlkOiB7IFJlZjogJ3Rlc3RhcGlENjQ1MUY3MCcgfSxcbiAgICAgICAgICAgIFN0YWdlTmFtZTogJ015U3RhZ2UnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICAgIC8vIHNob3VsZCBoYXZlIGEgdXNhZ2UgcGxhbiB3aXRoIHNwZWNpZmllZCBxdW90YS5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OlVzYWdlUGxhbicsIHtcbiAgICAgICAgUXVvdGE6IHtcbiAgICAgICAgICBMaW1pdDogMTAwMDAsXG4gICAgICAgICAgUGVyaW9kOiAnTU9OVEgnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICAvLyBzaG91bGQgaGF2ZSBhIHVzYWdlIHBsYW4ga2V5IGxpbmtpbmcgdGhlIGFwaSBrZXkgYW5kIHVzYWdlIHBsYW5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkFwaUdhdGV3YXk6OlVzYWdlUGxhbktleScsIHtcbiAgICAgICAgS2V5SWQ6IHtcbiAgICAgICAgICBSZWY6ICd0ZXN0YXBpa2V5OTk4MDI4QjYnLFxuICAgICAgICB9LFxuICAgICAgICBLZXlUeXBlOiAnQVBJX0tFWScsXG4gICAgICAgIFVzYWdlUGxhbklkOiB7XG4gICAgICAgICAgUmVmOiAndGVzdGFwaWtleVVzYWdlUGxhblJlc291cmNlNjZEQjYzRDYnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=