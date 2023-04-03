"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const autoscaling = require("@aws-cdk/aws-autoscaling");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const lambda = require("@aws-cdk/aws-lambda");
const sns = require("@aws-cdk/aws-sns");
const sqs = require("@aws-cdk/aws-sqs");
const core_1 = require("@aws-cdk/core");
const hooks = require("../lib");
describe('given an AutoScalingGroup and no role', () => {
    let stack;
    let asg;
    beforeEach(() => {
        stack = new core_1.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
            vpc,
            instanceType: new ec2.InstanceType('t2.micro'),
            machineImage: new ec2.AmazonLinuxImage(),
        });
    });
    afterEach(() => {
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: {
                            Service: 'autoscaling.amazonaws.com',
                        },
                    },
                ],
            },
        });
    });
    test('can use queue as hook target without providing a role', () => {
        // GIVEN
        const queue = new sqs.Queue(stack, 'Queue');
        // WHEN
        asg.addLifecycleHook('Trans', {
            lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_LAUNCHING,
            notificationTarget: new hooks.QueueHook(queue),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LifecycleHook', { NotificationTargetARN: { 'Fn::GetAtt': ['Queue4A7E3555', 'Arn'] } });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: [
                            'sqs:SendMessage',
                            'sqs:GetQueueAttributes',
                            'sqs:GetQueueUrl',
                        ],
                        Effect: 'Allow',
                        Resource: {
                            'Fn::GetAtt': [
                                'Queue4A7E3555',
                                'Arn',
                            ],
                        },
                    },
                ],
                Version: '2012-10-17',
            },
            PolicyName: 'ASGLifecycleHookTransRoleDefaultPolicy43D7C82A',
            Roles: [
                {
                    Ref: 'ASGLifecycleHookTransRole71E0A219',
                },
            ],
        });
    });
    test('can use topic as hook target without providing a role', () => {
        // GIVEN
        const topic = new sns.Topic(stack, 'Topic');
        // WHEN
        asg.addLifecycleHook('Trans', {
            lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_LAUNCHING,
            notificationTarget: new hooks.TopicHook(topic),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LifecycleHook', { NotificationTargetARN: { Ref: 'TopicBFC7AF6E' } });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'sns:Publish',
                        Effect: 'Allow',
                        Resource: {
                            Ref: 'TopicBFC7AF6E',
                        },
                    },
                ],
                Version: '2012-10-17',
            },
            PolicyName: 'ASGLifecycleHookTransRoleDefaultPolicy43D7C82A',
            Roles: [
                {
                    Ref: 'ASGLifecycleHookTransRole71E0A219',
                },
            ],
        });
    });
    test('can use Lambda function as hook target without providing a role', () => {
        // GIVEN
        const fn = new lambda.Function(stack, 'Fn', {
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.index',
        });
        // WHEN
        asg.addLifecycleHook('Trans', {
            lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_LAUNCHING,
            notificationTarget: new hooks.FunctionHook(fn),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LifecycleHook', { NotificationTargetARN: { Ref: 'ASGLifecycleHookTransTopic9B0D4842' } });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::Subscription', {
            Protocol: 'lambda',
            TopicArn: { Ref: 'ASGLifecycleHookTransTopic9B0D4842' },
            Endpoint: { 'Fn::GetAtt': ['Fn9270CBC0', 'Arn'] },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'sns:Publish',
                        Effect: 'Allow',
                        Resource: {
                            Ref: 'ASGLifecycleHookTransTopic9B0D4842',
                        },
                    },
                ],
                Version: '2012-10-17',
            },
            PolicyName: 'ASGLifecycleHookTransRoleDefaultPolicy43D7C82A',
            Roles: [
                {
                    Ref: 'ASGLifecycleHookTransRole71E0A219',
                },
            ],
        });
    });
    test('can use Lambda function as hook target with encrypted SNS', () => {
        // GIVEN
        const key = new kms.Key(stack, 'key');
        const fn = new lambda.Function(stack, 'Fn', {
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.index',
        });
        // WHEN
        asg.addLifecycleHook('Trans', {
            lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_LAUNCHING,
            notificationTarget: new hooks.FunctionHook(fn, key),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::Topic', {
            KmsMasterKeyId: {
                'Fn::GetAtt': [
                    'keyFEDD6EC0',
                    'Arn',
                ],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: assertions_1.Match.arrayWith([
                    {
                        Effect: 'Allow',
                        Action: [
                            'kms:Decrypt',
                            'kms:GenerateDataKey',
                        ],
                        Resource: {
                            'Fn::GetAtt': [
                                'keyFEDD6EC0',
                                'Arn',
                            ],
                        },
                    },
                ]),
            },
        });
    });
});
describe('given an AutoScalingGroup and a role', () => {
    let stack;
    let asg;
    beforeEach(() => {
        stack = new core_1.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC');
        asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
            vpc,
            instanceType: new ec2.InstanceType('t2.micro'),
            machineImage: new ec2.AmazonLinuxImage(),
        });
    });
    afterEach(() => {
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: {
                            Service: 'custom.role.domain.com',
                        },
                    },
                ],
            },
        });
    });
    test('can use queue as hook target with a role', () => {
        // GIVEN
        const queue = new sqs.Queue(stack, 'Queue');
        const myrole = new iam.Role(stack, 'MyRole', {
            assumedBy: new iam.ServicePrincipal('custom.role.domain.com'),
        });
        // WHEN
        asg.addLifecycleHook('Trans', {
            lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_LAUNCHING,
            notificationTarget: new hooks.QueueHook(queue),
            role: myrole,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LifecycleHook', { NotificationTargetARN: { 'Fn::GetAtt': ['Queue4A7E3555', 'Arn'] } });
    });
    test('can use topic as hook target with a role', () => {
        // GIVEN
        const topic = new sns.Topic(stack, 'Topic');
        const myrole = new iam.Role(stack, 'MyRole', {
            assumedBy: new iam.ServicePrincipal('custom.role.domain.com'),
        });
        // WHEN
        asg.addLifecycleHook('Trans', {
            lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_LAUNCHING,
            notificationTarget: new hooks.TopicHook(topic),
            role: myrole,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LifecycleHook', { NotificationTargetARN: { Ref: 'TopicBFC7AF6E' } });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'sns:Publish',
                        Effect: 'Allow',
                        Resource: {
                            Ref: 'TopicBFC7AF6E',
                        },
                    },
                ],
                Version: '2012-10-17',
            },
            PolicyName: 'MyRoleDefaultPolicyA36BE1DD',
            Roles: [
                {
                    Ref: 'MyRoleF48FFE04',
                },
            ],
        });
    });
    test('can use Lambda function as hook target with a role', () => {
        // GIVEN
        const fn = new lambda.Function(stack, 'Fn', {
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.index',
        });
        const myrole = new iam.Role(stack, 'MyRole', {
            assumedBy: new iam.ServicePrincipal('custom.role.domain.com'),
        });
        // WHEN
        asg.addLifecycleHook('Trans', {
            lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_LAUNCHING,
            notificationTarget: new hooks.FunctionHook(fn),
            role: myrole,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LifecycleHook', { NotificationTargetARN: { Ref: 'ASGLifecycleHookTransTopic9B0D4842' } });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SNS::Subscription', {
            Protocol: 'lambda',
            TopicArn: { Ref: 'ASGLifecycleHookTransTopic9B0D4842' },
            Endpoint: { 'Fn::GetAtt': ['Fn9270CBC0', 'Arn'] },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'sns:Publish',
                        Effect: 'Allow',
                        Resource: {
                            Ref: 'ASGLifecycleHookTransTopic9B0D4842',
                        },
                    },
                ],
                Version: '2012-10-17',
            },
            PolicyName: 'MyRoleDefaultPolicyA36BE1DD',
            Roles: [
                {
                    Ref: 'MyRoleF48FFE04',
                },
            ],
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhvb2tzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFDdEQsd0RBQXdEO0FBQ3hELHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLDhDQUE4QztBQUM5Qyx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLHdDQUFzQztBQUN0QyxnQ0FBZ0M7QUFHaEMsUUFBUSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtJQUNyRCxJQUFJLEtBQVksQ0FBQztJQUNqQixJQUFJLEdBQWlDLENBQUM7SUFFdEMsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRXBCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdEMsR0FBRyxHQUFHLElBQUksV0FBVyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7WUFDbkQsR0FBRztZQUNILFlBQVksRUFBRSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO1lBQzlDLFlBQVksRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtTQUN6QyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFNBQVMsQ0FBQyxHQUFHLEVBQUU7UUFDYixxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBZ0IsRUFBRTtZQUNoRSx3QkFBd0IsRUFBRTtnQkFDeEIsT0FBTyxFQUFFLFlBQVk7Z0JBQ3JCLFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxNQUFNLEVBQUUsZ0JBQWdCO3dCQUN4QixNQUFNLEVBQUUsT0FBTzt3QkFDZixTQUFTLEVBQUU7NEJBQ1QsT0FBTyxFQUFFLDJCQUEyQjt5QkFDckM7cUJBQ0Y7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QyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hdGNoLCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgYXV0b3NjYWxpbmcgZnJvbSAnQGF3cy1jZGsvYXdzLWF1dG9zY2FsaW5nJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdAYXdzLWNkay9hd3Mta21zJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIHNucyBmcm9tICdAYXdzLWNkay9hd3Mtc25zJztcbmltcG9ydCAqIGFzIHNxcyBmcm9tICdAYXdzLWNkay9hd3Mtc3FzJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBob29rcyBmcm9tICcuLi9saWInO1xuXG5cbmRlc2NyaWJlKCdnaXZlbiBhbiBBdXRvU2NhbGluZ0dyb3VwIGFuZCBubyByb2xlJywgKCkgPT4ge1xuICBsZXQgc3RhY2s6IFN0YWNrO1xuICBsZXQgYXNnOiBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwO1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICAgIGFzZyA9IG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnQVNHJywge1xuICAgICAgdnBjLFxuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWljcm8nKSxcbiAgICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjMi5BbWF6b25MaW51eEltYWdlKCksXG4gICAgfSk7XG4gIH0pO1xuXG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgIFNlcnZpY2U6ICdhdXRvc2NhbGluZy5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiB1c2UgcXVldWUgYXMgaG9vayB0YXJnZXQgd2l0aG91dCBwcm92aWRpbmcgYSByb2xlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnUXVldWUnKTtcblxuICAgIC8vIFdIRU5cbiAgICBhc2cuYWRkTGlmZWN5Y2xlSG9vaygnVHJhbnMnLCB7XG4gICAgICBsaWZlY3ljbGVUcmFuc2l0aW9uOiBhdXRvc2NhbGluZy5MaWZlY3ljbGVUcmFuc2l0aW9uLklOU1RBTkNFX0xBVU5DSElORyxcbiAgICAgIG5vdGlmaWNhdGlvblRhcmdldDogbmV3IGhvb2tzLlF1ZXVlSG9vayhxdWV1ZSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkxpZmVjeWNsZUhvb2snLCB7IE5vdGlmaWNhdGlvblRhcmdldEFSTjogeyAnRm46OkdldEF0dCc6IFsnUXVldWU0QTdFMzU1NScsICdBcm4nXSB9IH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICdzcXM6U2VuZE1lc3NhZ2UnLFxuICAgICAgICAgICAgICAnc3FzOkdldFF1ZXVlQXR0cmlidXRlcycsXG4gICAgICAgICAgICAgICdzcXM6R2V0UXVldWVVcmwnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdRdWV1ZTRBN0UzNTU1JyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICAgIFBvbGljeU5hbWU6ICdBU0dMaWZlY3ljbGVIb29rVHJhbnNSb2xlRGVmYXVsdFBvbGljeTQzRDdDODJBJyxcbiAgICAgIFJvbGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdBU0dMaWZlY3ljbGVIb29rVHJhbnNSb2xlNzFFMEEyMTknLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHVzZSB0b3BpYyBhcyBob29rIHRhcmdldCB3aXRob3V0IHByb3ZpZGluZyBhIHJvbGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB0b3BpYyA9IG5ldyBzbnMuVG9waWMoc3RhY2ssICdUb3BpYycpO1xuXG4gICAgLy8gV0hFTlxuICAgIGFzZy5hZGRMaWZlY3ljbGVIb29rKCdUcmFucycsIHtcbiAgICAgIGxpZmVjeWNsZVRyYW5zaXRpb246IGF1dG9zY2FsaW5nLkxpZmVjeWNsZVRyYW5zaXRpb24uSU5TVEFOQ0VfTEFVTkNISU5HLFxuICAgICAgbm90aWZpY2F0aW9uVGFyZ2V0OiBuZXcgaG9va3MuVG9waWNIb29rKHRvcGljKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6TGlmZWN5Y2xlSG9vaycsIHsgTm90aWZpY2F0aW9uVGFyZ2V0QVJOOiB7IFJlZjogJ1RvcGljQkZDN0FGNkUnIH0gfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzbnM6UHVibGlzaCcsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICBSZWY6ICdUb3BpY0JGQzdBRjZFJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICAgIFBvbGljeU5hbWU6ICdBU0dMaWZlY3ljbGVIb29rVHJhbnNSb2xlRGVmYXVsdFBvbGljeTQzRDdDODJBJyxcbiAgICAgIFJvbGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdBU0dMaWZlY3ljbGVIb29rVHJhbnNSb2xlNzFFMEEyMTknLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHVzZSBMYW1iZGEgZnVuY3Rpb24gYXMgaG9vayB0YXJnZXQgd2l0aG91dCBwcm92aWRpbmcgYSByb2xlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnRm4nLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdmb28nKSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmluZGV4JyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBhc2cuYWRkTGlmZWN5Y2xlSG9vaygnVHJhbnMnLCB7XG4gICAgICBsaWZlY3ljbGVUcmFuc2l0aW9uOiBhdXRvc2NhbGluZy5MaWZlY3ljbGVUcmFuc2l0aW9uLklOU1RBTkNFX0xBVU5DSElORyxcbiAgICAgIG5vdGlmaWNhdGlvblRhcmdldDogbmV3IGhvb2tzLkZ1bmN0aW9uSG9vayhmbiksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkxpZmVjeWNsZUhvb2snLCB7IE5vdGlmaWNhdGlvblRhcmdldEFSTjogeyBSZWY6ICdBU0dMaWZlY3ljbGVIb29rVHJhbnNUb3BpYzlCMEQ0ODQyJyB9IH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNOUzo6U3Vic2NyaXB0aW9uJywge1xuICAgICAgUHJvdG9jb2w6ICdsYW1iZGEnLFxuICAgICAgVG9waWNBcm46IHsgUmVmOiAnQVNHTGlmZWN5Y2xlSG9va1RyYW5zVG9waWM5QjBENDg0MicgfSxcbiAgICAgIEVuZHBvaW50OiB7ICdGbjo6R2V0QXR0JzogWydGbjkyNzBDQkMwJywgJ0FybiddIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzbnM6UHVibGlzaCcsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICBSZWY6ICdBU0dMaWZlY3ljbGVIb29rVHJhbnNUb3BpYzlCMEQ0ODQyJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICAgIFBvbGljeU5hbWU6ICdBU0dMaWZlY3ljbGVIb29rVHJhbnNSb2xlRGVmYXVsdFBvbGljeTQzRDdDODJBJyxcbiAgICAgIFJvbGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdBU0dMaWZlY3ljbGVIb29rVHJhbnNSb2xlNzFFMEEyMTknLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHVzZSBMYW1iZGEgZnVuY3Rpb24gYXMgaG9vayB0YXJnZXQgd2l0aCBlbmNyeXB0ZWQgU05TJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdrZXknKTtcbiAgICBjb25zdCBmbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdGbicsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaW5kZXgnLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGFzZy5hZGRMaWZlY3ljbGVIb29rKCdUcmFucycsIHtcbiAgICAgIGxpZmVjeWNsZVRyYW5zaXRpb246IGF1dG9zY2FsaW5nLkxpZmVjeWNsZVRyYW5zaXRpb24uSU5TVEFOQ0VfTEFVTkNISU5HLFxuICAgICAgbm90aWZpY2F0aW9uVGFyZ2V0OiBuZXcgaG9va3MuRnVuY3Rpb25Ib29rKGZuLCBrZXkpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNOUzo6VG9waWMnLCB7XG4gICAgICBLbXNNYXN0ZXJLZXlJZDoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAna2V5RkVERDZFQzAnLFxuICAgICAgICAgICdBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgJ2ttczpEZWNyeXB0JyxcbiAgICAgICAgICAgICAgJ2ttczpHZW5lcmF0ZURhdGFLZXknLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdrZXlGRURENkVDMCcsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0pLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2dpdmVuIGFuIEF1dG9TY2FsaW5nR3JvdXAgYW5kIGEgcm9sZScsICgpID0+IHtcbiAgbGV0IHN0YWNrOiBTdGFjaztcbiAgbGV0IGFzZzogYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cDtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcbiAgICBhc2cgPSBuZXcgYXV0b3NjYWxpbmcuQXV0b1NjYWxpbmdHcm91cChzdGFjaywgJ0FTRycsIHtcbiAgICAgIHZwYyxcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSgpLFxuICAgIH0pO1xuICB9KTtcblxuICBhZnRlckVhY2goKCkgPT4ge1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICBTZXJ2aWNlOiAnY3VzdG9tLnJvbGUuZG9tYWluLmNvbScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gdXNlIHF1ZXVlIGFzIGhvb2sgdGFyZ2V0IHdpdGggYSByb2xlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgcXVldWUgPSBuZXcgc3FzLlF1ZXVlKHN0YWNrLCAnUXVldWUnKTtcbiAgICBjb25zdCBteXJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdNeVJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnY3VzdG9tLnJvbGUuZG9tYWluLmNvbScpLFxuICAgIH0pO1xuICAgIC8vIFdIRU5cbiAgICBhc2cuYWRkTGlmZWN5Y2xlSG9vaygnVHJhbnMnLCB7XG4gICAgICBsaWZlY3ljbGVUcmFuc2l0aW9uOiBhdXRvc2NhbGluZy5MaWZlY3ljbGVUcmFuc2l0aW9uLklOU1RBTkNFX0xBVU5DSElORyxcbiAgICAgIG5vdGlmaWNhdGlvblRhcmdldDogbmV3IGhvb2tzLlF1ZXVlSG9vayhxdWV1ZSksXG4gICAgICByb2xlOiBteXJvbGUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkxpZmVjeWNsZUhvb2snLCB7IE5vdGlmaWNhdGlvblRhcmdldEFSTjogeyAnRm46OkdldEF0dCc6IFsnUXVldWU0QTdFMzU1NScsICdBcm4nXSB9IH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gdXNlIHRvcGljIGFzIGhvb2sgdGFyZ2V0IHdpdGggYSByb2xlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgdG9waWMgPSBuZXcgc25zLlRvcGljKHN0YWNrLCAnVG9waWMnKTtcbiAgICBjb25zdCBteXJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdNeVJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnY3VzdG9tLnJvbGUuZG9tYWluLmNvbScpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGFzZy5hZGRMaWZlY3ljbGVIb29rKCdUcmFucycsIHtcbiAgICAgIGxpZmVjeWNsZVRyYW5zaXRpb246IGF1dG9zY2FsaW5nLkxpZmVjeWNsZVRyYW5zaXRpb24uSU5TVEFOQ0VfTEFVTkNISU5HLFxuICAgICAgbm90aWZpY2F0aW9uVGFyZ2V0OiBuZXcgaG9va3MuVG9waWNIb29rKHRvcGljKSxcbiAgICAgIHJvbGU6IG15cm9sZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6TGlmZWN5Y2xlSG9vaycsIHsgTm90aWZpY2F0aW9uVGFyZ2V0QVJOOiB7IFJlZjogJ1RvcGljQkZDN0FGNkUnIH0gfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzbnM6UHVibGlzaCcsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICBSZWY6ICdUb3BpY0JGQzdBRjZFJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICAgIFBvbGljeU5hbWU6ICdNeVJvbGVEZWZhdWx0UG9saWN5QTM2QkUxREQnLFxuICAgICAgUm9sZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlZjogJ015Um9sZUY0OEZGRTA0JyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiB1c2UgTGFtYmRhIGZ1bmN0aW9uIGFzIGhvb2sgdGFyZ2V0IHdpdGggYSByb2xlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgZm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnRm4nLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdmb28nKSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmluZGV4JyxcbiAgICB9KTtcbiAgICBjb25zdCBteXJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdNeVJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnY3VzdG9tLnJvbGUuZG9tYWluLmNvbScpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGFzZy5hZGRMaWZlY3ljbGVIb29rKCdUcmFucycsIHtcbiAgICAgIGxpZmVjeWNsZVRyYW5zaXRpb246IGF1dG9zY2FsaW5nLkxpZmVjeWNsZVRyYW5zaXRpb24uSU5TVEFOQ0VfTEFVTkNISU5HLFxuICAgICAgbm90aWZpY2F0aW9uVGFyZ2V0OiBuZXcgaG9va3MuRnVuY3Rpb25Ib29rKGZuKSxcbiAgICAgIHJvbGU6IG15cm9sZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6TGlmZWN5Y2xlSG9vaycsIHsgTm90aWZpY2F0aW9uVGFyZ2V0QVJOOiB7IFJlZjogJ0FTR0xpZmVjeWNsZUhvb2tUcmFuc1RvcGljOUIwRDQ4NDInIH0gfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U05TOjpTdWJzY3JpcHRpb24nLCB7XG4gICAgICBQcm90b2NvbDogJ2xhbWJkYScsXG4gICAgICBUb3BpY0FybjogeyBSZWY6ICdBU0dMaWZlY3ljbGVIb29rVHJhbnNUb3BpYzlCMEQ0ODQyJyB9LFxuICAgICAgRW5kcG9pbnQ6IHsgJ0ZuOjpHZXRBdHQnOiBbJ0ZuOTI3MENCQzAnLCAnQXJuJ10gfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ3NuczpQdWJsaXNoJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgIFJlZjogJ0FTR0xpZmVjeWNsZUhvb2tUcmFuc1RvcGljOUIwRDQ4NDInLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgUG9saWN5TmFtZTogJ015Um9sZURlZmF1bHRQb2xpY3lBMzZCRTFERCcsXG4gICAgICBSb2xlczogW1xuICAgICAgICB7XG4gICAgICAgICAgUmVmOiAnTXlSb2xlRjQ4RkZFMDQnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==