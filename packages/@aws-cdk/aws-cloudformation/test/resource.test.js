"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const lambda = require("@aws-cdk/aws-lambda");
const sns = require("@aws-cdk/aws-sns");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const lib_1 = require("../lib");
/* eslint-disable @aws-cdk/no-core-construct */
/* eslint-disable quote-props */
cdk_build_tools_1.describeDeprecated('custom resources honor removalPolicy', () => {
    test('unspecified (aka .Destroy)', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Test');
        // WHEN
        new TestCustomResource(stack, 'Custom');
        // THEN
        assertions_1.Template.fromStack(stack).hasResource('AWS::CloudFormation::CustomResource', {});
        expect(app.synth().tryGetArtifact(stack.stackName).findMetadataByType('aws:cdk:protected').length).toEqual(0);
    });
    test('.Destroy', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Test');
        // WHEN
        new TestCustomResource(stack, 'Custom', { removalPolicy: cdk.RemovalPolicy.DESTROY });
        // THEN
        assertions_1.Template.fromStack(stack).hasResource('AWS::CloudFormation::CustomResource', {});
        expect(app.synth().tryGetArtifact(stack.stackName).findMetadataByType('aws:cdk:protected').length).toEqual(0);
    });
    test('.Retain', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Test');
        // WHEN
        new TestCustomResource(stack, 'Custom', { removalPolicy: cdk.RemovalPolicy.RETAIN });
        // THEN
        assertions_1.Template.fromStack(stack).hasResource('AWS::CloudFormation::CustomResource', {
            DeletionPolicy: 'Retain',
            UpdateReplacePolicy: 'Retain',
        });
    });
});
cdk_build_tools_1.testDeprecated('custom resource is added twice, lambda is added once', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Test');
    // WHEN
    new TestCustomResource(stack, 'Custom1');
    new TestCustomResource(stack, 'Custom2');
    // THEN
    assertions_1.Template.fromStack(stack).templateMatches({
        'Resources': {
            'SingletonLambdaTestCustomResourceProviderServiceRole81FEAB5C': {
                'Type': 'AWS::IAM::Role',
                'Properties': {
                    'AssumeRolePolicyDocument': {
                        'Statement': [
                            {
                                'Action': 'sts:AssumeRole',
                                'Effect': 'Allow',
                                'Principal': {
                                    'Service': 'lambda.amazonaws.com',
                                },
                            },
                        ],
                        'Version': '2012-10-17',
                    },
                    'ManagedPolicyArns': [
                        {
                            'Fn::Join': ['', [
                                    'arn:', { 'Ref': 'AWS::Partition' }, ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                                ]],
                        },
                    ],
                },
            },
            'SingletonLambdaTestCustomResourceProviderA9255269': {
                'Type': 'AWS::Lambda::Function',
                'Properties': {
                    'Code': {
                        'ZipFile': 'def hello(): pass',
                    },
                    'Handler': 'index.hello',
                    'Role': {
                        'Fn::GetAtt': [
                            'SingletonLambdaTestCustomResourceProviderServiceRole81FEAB5C',
                            'Arn',
                        ],
                    },
                    'Runtime': 'python3.9',
                    'Timeout': 300,
                },
                'DependsOn': [
                    'SingletonLambdaTestCustomResourceProviderServiceRole81FEAB5C',
                ],
            },
            'Custom1D319B237': {
                'Type': 'AWS::CloudFormation::CustomResource',
                'DeletionPolicy': 'Delete',
                'UpdateReplacePolicy': 'Delete',
                'Properties': {
                    'ServiceToken': {
                        'Fn::GetAtt': [
                            'SingletonLambdaTestCustomResourceProviderA9255269',
                            'Arn',
                        ],
                    },
                },
            },
            'Custom2DD5FB44D': {
                'Type': 'AWS::CloudFormation::CustomResource',
                'DeletionPolicy': 'Delete',
                'UpdateReplacePolicy': 'Delete',
                'Properties': {
                    'ServiceToken': {
                        'Fn::GetAtt': [
                            'SingletonLambdaTestCustomResourceProviderA9255269',
                            'Arn',
                        ],
                    },
                },
            },
        },
    });
});
cdk_build_tools_1.testDeprecated('custom resources can specify a resource type that starts with Custom::', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Test');
    new lib_1.CustomResource(stack, 'MyCustomResource', {
        resourceType: 'Custom::MyCustomResourceType',
        provider: lib_1.CustomResourceProvider.fromTopic(new sns.Topic(stack, 'Provider')),
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::MyCustomResourceType', {});
});
cdk_build_tools_1.describeDeprecated('fails if custom resource type is invalid', () => {
    test('does not start with "Custom::"', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Test');
        expect(() => {
            new lib_1.CustomResource(stack, 'MyCustomResource', {
                resourceType: 'NoCustom::MyCustomResourceType',
                provider: lib_1.CustomResourceProvider.fromTopic(new sns.Topic(stack, 'Provider')),
            });
        }).toThrow(/Custom resource type must begin with "Custom::"/);
    });
    test('has invalid characters', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Test');
        expect(() => {
            new lib_1.CustomResource(stack, 'MyCustomResource', {
                resourceType: 'Custom::My Custom?ResourceType',
                provider: lib_1.CustomResourceProvider.fromTopic(new sns.Topic(stack, 'Provider')),
            });
        }).toThrow(/Custom resource type name can only include alphanumeric characters and/);
    });
    test('is longer than 60 characters', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'Test');
        expect(() => {
            new lib_1.CustomResource(stack, 'MyCustomResource', {
                resourceType: 'Custom::0123456789012345678901234567890123456789012345678901234567891',
                provider: lib_1.CustomResourceProvider.fromTopic(new sns.Topic(stack, 'Provider')),
            });
        }).toThrow(/Custom resource type length > 60/);
    });
});
cdk_build_tools_1.testDeprecated('.ref returns the intrinsic reference (physical name)', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const res = new TestCustomResource(stack, 'myResource');
    // THEN
    expect(stack.resolve(res.resource.ref)).toEqual({ Ref: 'myResourceC6A188A9' });
});
class TestCustomResource extends constructs_1.Construct {
    constructor(scope, id, opts = {}) {
        super(scope, id);
        const singletonLambda = new lambda.SingletonFunction(this, 'Lambda', {
            uuid: 'TestCustomResourceProvider',
            code: new lambda.InlineCode('def hello(): pass'),
            runtime: lambda.Runtime.PYTHON_3_9,
            handler: 'index.hello',
            timeout: cdk.Duration.minutes(5),
        });
        this.resource = new lib_1.CustomResource(this, 'Resource', {
            ...opts,
            provider: lib_1.CustomResourceProvider.fromLambda(singletonLambda),
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlc291cmNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0MsOENBQThDO0FBQzlDLHdDQUF3QztBQUN4Qyw4REFBOEU7QUFDOUUscUNBQXFDO0FBQ3JDLDJDQUF1QztBQUN2QyxnQ0FBZ0U7QUFFaEUsK0NBQStDO0FBQy9DLGdDQUFnQztBQUVoQyxvQ0FBa0IsQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7SUFDOUQsSUFBSSxDQUFDLDRCQUE0QixFQUFFLEdBQUcsRUFBRTtRQUN0QyxRQUFRO1FBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUV6QyxPQUFPO1FBQ1AsSUFBSSxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFeEMsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxxQ0FBcUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNqRixNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFFLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakgsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtRQUNwQixRQUFRO1FBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFB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SUFBSSxFQUFFLFFBQVEsRUFBRTtZQUNuRSxJQUFJLEVBQUUsNEJBQTRCO1lBQ2xDLElBQUksRUFBRSxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUM7WUFDaEQsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUNsQyxPQUFPLEVBQUUsYUFBYTtZQUN0QixPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQ2pDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxvQkFBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDbkQsR0FBRyxJQUFJO1lBQ1AsUUFBUSxFQUFFLDRCQUFzQixDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUM7U0FDN0QsQ0FBQyxDQUFDO0tBQ0o7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBzbnMgZnJvbSAnQGF3cy1jZGsvYXdzLXNucyc7XG5pbXBvcnQgeyBkZXNjcmliZURlcHJlY2F0ZWQsIHRlc3REZXByZWNhdGVkIH0gZnJvbSAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ3VzdG9tUmVzb3VyY2UsIEN1c3RvbVJlc291cmNlUHJvdmlkZXIgfSBmcm9tICcuLi9saWInO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBAYXdzLWNkay9uby1jb3JlLWNvbnN0cnVjdCAqL1xuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuZGVzY3JpYmVEZXByZWNhdGVkKCdjdXN0b20gcmVzb3VyY2VzIGhvbm9yIHJlbW92YWxQb2xpY3knLCAoKSA9PiB7XG4gIHRlc3QoJ3Vuc3BlY2lmaWVkIChha2EgLkRlc3Ryb3kpJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnVGVzdCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBUZXN0Q3VzdG9tUmVzb3VyY2Uoc3RhY2ssICdDdXN0b20nKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkNsb3VkRm9ybWF0aW9uOjpDdXN0b21SZXNvdXJjZScsIHt9KTtcbiAgICBleHBlY3QoYXBwLnN5bnRoKCkudHJ5R2V0QXJ0aWZhY3Qoc3RhY2suc3RhY2tOYW1lKSEuZmluZE1ldGFkYXRhQnlUeXBlKCdhd3M6Y2RrOnByb3RlY3RlZCcpLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgfSk7XG5cbiAgdGVzdCgnLkRlc3Ryb3knLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdUZXN0Jyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFRlc3RDdXN0b21SZXNvdXJjZShzdGFjaywgJ0N1c3RvbScsIHsgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkNsb3VkRm9ybWF0aW9uOjpDdXN0b21SZXNvdXJjZScsIHt9KTtcbiAgICBleHBlY3QoYXBwLnN5bnRoKCkudHJ5R2V0QXJ0aWZhY3Qoc3RhY2suc3RhY2tOYW1lKSEuZmluZE1ldGFkYXRhQnlUeXBlKCdhd3M6Y2RrOnByb3RlY3RlZCcpLmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgfSk7XG5cbiAgdGVzdCgnLlJldGFpbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1Rlc3QnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgVGVzdEN1c3RvbVJlc291cmNlKHN0YWNrLCAnQ3VzdG9tJywgeyByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5SRVRBSU4gfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpDbG91ZEZvcm1hdGlvbjo6Q3VzdG9tUmVzb3VyY2UnLCB7XG4gICAgICBEZWxldGlvblBvbGljeTogJ1JldGFpbicsXG4gICAgICBVcGRhdGVSZXBsYWNlUG9saWN5OiAnUmV0YWluJyxcbiAgICB9KTtcbiAgfSk7XG59KTtcblxudGVzdERlcHJlY2F0ZWQoJ2N1c3RvbSByZXNvdXJjZSBpcyBhZGRlZCB0d2ljZSwgbGFtYmRhIGlzIGFkZGVkIG9uY2UnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdUZXN0Jyk7XG5cbiAgLy8gV0hFTlxuICBuZXcgVGVzdEN1c3RvbVJlc291cmNlKHN0YWNrLCAnQ3VzdG9tMScpO1xuICBuZXcgVGVzdEN1c3RvbVJlc291cmNlKHN0YWNrLCAnQ3VzdG9tMicpO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAnU2luZ2xldG9uTGFtYmRhVGVzdEN1c3RvbVJlc291cmNlUHJvdmlkZXJTZXJ2aWNlUm9sZTgxRkVBQjVDJzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OklBTTo6Um9sZScsXG4gICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICdBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0FjdGlvbic6ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHtcbiAgICAgICAgICAgICAgICAgICdTZXJ2aWNlJzogJ2xhbWJkYS5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ01hbmFnZWRQb2xpY3lBcm5zJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgICAnYXJuOicsIHsgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzppYW06OmF3czpwb2xpY3kvc2VydmljZS1yb2xlL0FXU0xhbWJkYUJhc2ljRXhlY3V0aW9uUm9sZScsXG4gICAgICAgICAgICAgIF1dLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgICdTaW5nbGV0b25MYW1iZGFUZXN0Q3VzdG9tUmVzb3VyY2VQcm92aWRlckE5MjU1MjY5Jzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnQ29kZSc6IHtcbiAgICAgICAgICAgICdaaXBGaWxlJzogJ2RlZiBoZWxsbygpOiBwYXNzJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdIYW5kbGVyJzogJ2luZGV4LmhlbGxvJyxcbiAgICAgICAgICAnUm9sZSc6IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnU2luZ2xldG9uTGFtYmRhVGVzdEN1c3RvbVJlc291cmNlUHJvdmlkZXJTZXJ2aWNlUm9sZTgxRkVBQjVDJyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1J1bnRpbWUnOiAncHl0aG9uMy45JyxcbiAgICAgICAgICAnVGltZW91dCc6IDMwMCxcbiAgICAgICAgfSxcbiAgICAgICAgJ0RlcGVuZHNPbic6IFtcbiAgICAgICAgICAnU2luZ2xldG9uTGFtYmRhVGVzdEN1c3RvbVJlc291cmNlUHJvdmlkZXJTZXJ2aWNlUm9sZTgxRkVBQjVDJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICAnQ3VzdG9tMUQzMTlCMjM3Jzoge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OkNsb3VkRm9ybWF0aW9uOjpDdXN0b21SZXNvdXJjZScsXG4gICAgICAgICdEZWxldGlvblBvbGljeSc6ICdEZWxldGUnLFxuICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdEZWxldGUnLFxuICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAnU2VydmljZVRva2VuJzoge1xuICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICdTaW5nbGV0b25MYW1iZGFUZXN0Q3VzdG9tUmVzb3VyY2VQcm92aWRlckE5MjU1MjY5JyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgJ0N1c3RvbTJERDVGQjQ0RCc6IHtcbiAgICAgICAgJ1R5cGUnOiAnQVdTOjpDbG91ZEZvcm1hdGlvbjo6Q3VzdG9tUmVzb3VyY2UnLFxuICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnRGVsZXRlJyxcbiAgICAgICAgJ1VwZGF0ZVJlcGxhY2VQb2xpY3knOiAnRGVsZXRlJyxcbiAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgJ1NlcnZpY2VUb2tlbic6IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnU2luZ2xldG9uTGFtYmRhVGVzdEN1c3RvbVJlc291cmNlUHJvdmlkZXJBOTI1NTI2OScsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0RGVwcmVjYXRlZCgnY3VzdG9tIHJlc291cmNlcyBjYW4gc3BlY2lmeSBhIHJlc291cmNlIHR5cGUgdGhhdCBzdGFydHMgd2l0aCBDdXN0b206OicsICgpID0+IHtcbiAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1Rlc3QnKTtcbiAgbmV3IEN1c3RvbVJlc291cmNlKHN0YWNrLCAnTXlDdXN0b21SZXNvdXJjZScsIHtcbiAgICByZXNvdXJjZVR5cGU6ICdDdXN0b206Ok15Q3VzdG9tUmVzb3VyY2VUeXBlJyxcbiAgICBwcm92aWRlcjogQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5mcm9tVG9waWMobmV3IHNucy5Ub3BpYyhzdGFjaywgJ1Byb3ZpZGVyJykpLFxuICB9KTtcbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6TXlDdXN0b21SZXNvdXJjZVR5cGUnLCB7fSk7XG59KTtcblxuZGVzY3JpYmVEZXByZWNhdGVkKCdmYWlscyBpZiBjdXN0b20gcmVzb3VyY2UgdHlwZSBpcyBpbnZhbGlkJywgKCkgPT4ge1xuICB0ZXN0KCdkb2VzIG5vdCBzdGFydCB3aXRoIFwiQ3VzdG9tOjpcIicsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdUZXN0Jyk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IEN1c3RvbVJlc291cmNlKHN0YWNrLCAnTXlDdXN0b21SZXNvdXJjZScsIHtcbiAgICAgICAgcmVzb3VyY2VUeXBlOiAnTm9DdXN0b206Ok15Q3VzdG9tUmVzb3VyY2VUeXBlJyxcbiAgICAgICAgcHJvdmlkZXI6IEN1c3RvbVJlc291cmNlUHJvdmlkZXIuZnJvbVRvcGljKG5ldyBzbnMuVG9waWMoc3RhY2ssICdQcm92aWRlcicpKSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL0N1c3RvbSByZXNvdXJjZSB0eXBlIG11c3QgYmVnaW4gd2l0aCBcIkN1c3RvbTo6XCIvKTtcbiAgfSk7XG5cbiAgdGVzdCgnaGFzIGludmFsaWQgY2hhcmFjdGVycycsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdUZXN0Jyk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IEN1c3RvbVJlc291cmNlKHN0YWNrLCAnTXlDdXN0b21SZXNvdXJjZScsIHtcbiAgICAgICAgcmVzb3VyY2VUeXBlOiAnQ3VzdG9tOjpNeSBDdXN0b20/UmVzb3VyY2VUeXBlJyxcbiAgICAgICAgcHJvdmlkZXI6IEN1c3RvbVJlc291cmNlUHJvdmlkZXIuZnJvbVRvcGljKG5ldyBzbnMuVG9waWMoc3RhY2ssICdQcm92aWRlcicpKSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL0N1c3RvbSByZXNvdXJjZSB0eXBlIG5hbWUgY2FuIG9ubHkgaW5jbHVkZSBhbHBoYW51bWVyaWMgY2hhcmFjdGVycyBhbmQvKTtcbiAgfSk7XG5cbiAgdGVzdCgnaXMgbG9uZ2VyIHRoYW4gNjAgY2hhcmFjdGVycycsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdUZXN0Jyk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IEN1c3RvbVJlc291cmNlKHN0YWNrLCAnTXlDdXN0b21SZXNvdXJjZScsIHtcbiAgICAgICAgcmVzb3VyY2VUeXBlOiAnQ3VzdG9tOjowMTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkxJyxcbiAgICAgICAgcHJvdmlkZXI6IEN1c3RvbVJlc291cmNlUHJvdmlkZXIuZnJvbVRvcGljKG5ldyBzbnMuVG9waWMoc3RhY2ssICdQcm92aWRlcicpKSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL0N1c3RvbSByZXNvdXJjZSB0eXBlIGxlbmd0aCA+IDYwLyk7XG4gIH0pO1xufSk7XG5cbnRlc3REZXByZWNhdGVkKCcucmVmIHJldHVybnMgdGhlIGludHJpbnNpYyByZWZlcmVuY2UgKHBoeXNpY2FsIG5hbWUpJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgcmVzID0gbmV3IFRlc3RDdXN0b21SZXNvdXJjZShzdGFjaywgJ215UmVzb3VyY2UnKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHJlcy5yZXNvdXJjZS5yZWYpKS50b0VxdWFsKHsgUmVmOiAnbXlSZXNvdXJjZUM2QTE4OEE5JyB9KTtcbn0pO1xuXG5jbGFzcyBUZXN0Q3VzdG9tUmVzb3VyY2UgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBwdWJsaWMgcmVhZG9ubHkgcmVzb3VyY2U6IEN1c3RvbVJlc291cmNlO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIG9wdHM6IHsgcmVtb3ZhbFBvbGljeT86IGNkay5SZW1vdmFsUG9saWN5IH0gPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBzaW5nbGV0b25MYW1iZGEgPSBuZXcgbGFtYmRhLlNpbmdsZXRvbkZ1bmN0aW9uKHRoaXMsICdMYW1iZGEnLCB7XG4gICAgICB1dWlkOiAnVGVzdEN1c3RvbVJlc291cmNlUHJvdmlkZXInLFxuICAgICAgY29kZTogbmV3IGxhbWJkYS5JbmxpbmVDb2RlKCdkZWYgaGVsbG8oKTogcGFzcycpLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oZWxsbycsXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24ubWludXRlcyg1KSxcbiAgICB9KTtcblxuICAgIHRoaXMucmVzb3VyY2UgPSBuZXcgQ3VzdG9tUmVzb3VyY2UodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgLi4ub3B0cyxcbiAgICAgIHByb3ZpZGVyOiBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLmZyb21MYW1iZGEoc2luZ2xldG9uTGFtYmRhKSxcbiAgICB9KTtcbiAgfVxufVxuIl19