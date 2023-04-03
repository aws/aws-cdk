"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const autoscaling = require("../lib");
describe('lifecycle hooks', () => {
    test('we can add a lifecycle hook with no role and with a notifcationTarget to an ASG', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const asg = newASG(stack);
        // WHEN
        asg.addLifecycleHook('Transition', {
            notificationTarget: new FakeNotificationTarget(),
            lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_LAUNCHING,
            defaultResult: autoscaling.DefaultResult.ABANDON,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LifecycleHook', {
            LifecycleTransition: 'autoscaling:EC2_INSTANCE_LAUNCHING',
            DefaultResult: 'ABANDON',
            NotificationTargetARN: 'target:arn',
        });
        // Lifecycle Hook has a dependency on the policy object
        assertions_1.Template.fromStack(stack).hasResource('AWS::AutoScaling::LifecycleHook', {
            DependsOn: [
                'ASGLifecycleHookTransitionRoleDefaultPolicy2E50C7DB',
                'ASGLifecycleHookTransitionRole3AAA6BB7',
            ],
        });
        // A default role is provided
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
        // FakeNotificationTarget.bind() was executed
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'action:Work',
                        Effect: 'Allow',
                        Resource: '*',
                    },
                ],
            },
        });
    });
});
test('we can add a lifecycle hook to an ASG with no role and with no notificationTargetArn', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const asg = newASG(stack);
    // WHEN
    asg.addLifecycleHook('Transition', {
        lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_LAUNCHING,
        defaultResult: autoscaling.DefaultResult.ABANDON,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LifecycleHook', {
        LifecycleTransition: 'autoscaling:EC2_INSTANCE_LAUNCHING',
        DefaultResult: 'ABANDON',
    });
    // A default role is NOT provided
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', assertions_1.Match.not({
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
    }));
    // FakeNotificationTarget.bind() was NOT executed
    assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
});
test('we can add a lifecycle hook to an ASG with a role and with a notificationTargetArn', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const asg = newASG(stack);
    const myrole = new iam.Role(stack, 'MyRole', {
        assumedBy: new iam.ServicePrincipal('custom.role.domain.com'),
    });
    // WHEN
    asg.addLifecycleHook('Transition', {
        lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_LAUNCHING,
        defaultResult: autoscaling.DefaultResult.ABANDON,
        notificationTarget: new FakeNotificationTarget(),
        role: myrole,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::AutoScaling::LifecycleHook', {
        NotificationTargetARN: 'target:arn',
        LifecycleTransition: 'autoscaling:EC2_INSTANCE_LAUNCHING',
        DefaultResult: 'ABANDON',
    });
    // the provided role (myrole), not the default role, is used
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
test('adding a lifecycle hook with a role and with no notificationTarget to an ASG throws an error', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const asg = newASG(stack);
    const myrole = new iam.Role(stack, 'MyRole', {
        assumedBy: new iam.ServicePrincipal('custom.role.domain.com'),
    });
    // WHEN
    expect(() => {
        asg.addLifecycleHook('Transition', {
            lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_LAUNCHING,
            defaultResult: autoscaling.DefaultResult.ABANDON,
            role: myrole,
        });
    }).toThrow(/'notificationTarget' parameter required when 'role' parameter is specified/);
});
class FakeNotificationTarget {
    createRole(scope, _role) {
        let role = _role;
        if (!role) {
            role = new iam.Role(scope, 'Role', {
                assumedBy: new iam.ServicePrincipal('autoscaling.amazonaws.com'),
            });
        }
        return role;
    }
    bind(_scope, options) {
        const role = this.createRole(options.lifecycleHook, options.role);
        role.addToPrincipalPolicy(new iam.PolicyStatement({
            actions: ['action:Work'],
            resources: ['*'],
        }));
        return { notificationTargetArn: 'target:arn', createdRole: role };
    }
}
function newASG(stack) {
    const vpc = new ec2.Vpc(stack, 'VPC');
    return new autoscaling.AutoScalingGroup(stack, 'ASG', {
        vpc,
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.M4, ec2.InstanceSize.MICRO),
        machineImage: new ec2.AmazonLinuxImage(),
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlmZWN5Y2xlaG9va3MudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxpZmVjeWNsZWhvb2tzLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFDdEQsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4QyxxQ0FBcUM7QUFFckMsc0NBQXNDO0FBRXRDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7SUFDL0IsSUFBSSxDQUFDLGlGQUFpRixFQUFFLEdBQUcsRUFBRTtRQUMzRixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTFCLE9BQU87UUFDUCxHQUFHLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxFQUFFO1lBQ2pDLGtCQUFrQixFQUFFLElBQUksc0JBQXNCLEVBQUU7WUFDaEQsbUJBQW1CLEVBQUUsV0FBVyxDQUFDLG1CQUFtQixDQUFDLGtCQUFrQjtZQUN2RSxhQUFhLEVBQUUsV0FBVyxDQUFDLGFBQWEsQ0FBQyxPQUFPO1NBQ2pELENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxpQ0FBaUMsRUFBRTtZQUNqRixtQkFBbUIsRUFBRSxvQ0FBb0M7WUFDekQsYUFBYSxFQUFFLFNBQVM7WUFDeEIscUJBQXFCLEVBQUUsWUFBWTtTQUNwQyxDQUFDLENBQUM7UUFFSCx1REFBdUQ7UUFDdkQscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDLGlDQUFpQyxFQUFFO1lBQ3ZFLFNBQVMsRUFBRTtnQkFDVCxxREFBcUQ7Z0JBQ3JELHdDQUF3QzthQUN6QztTQUNGLENBQUMsQ0FBQztRQUVILDZCQUE2QjtRQUM3QixxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFL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RSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDO1FBQy9FLFlBQVksRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtLQUN6QyxDQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjb25zdHJ1Y3RzIGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgYXV0b3NjYWxpbmcgZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ2xpZmVjeWNsZSBob29rcycsICgpID0+IHtcbiAgdGVzdCgnd2UgY2FuIGFkZCBhIGxpZmVjeWNsZSBob29rIHdpdGggbm8gcm9sZSBhbmQgd2l0aCBhIG5vdGlmY2F0aW9uVGFyZ2V0IHRvIGFuIEFTRycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGFzZyA9IG5ld0FTRyhzdGFjayk7XG5cbiAgICAvLyBXSEVOXG4gICAgYXNnLmFkZExpZmVjeWNsZUhvb2soJ1RyYW5zaXRpb24nLCB7XG4gICAgICBub3RpZmljYXRpb25UYXJnZXQ6IG5ldyBGYWtlTm90aWZpY2F0aW9uVGFyZ2V0KCksXG4gICAgICBsaWZlY3ljbGVUcmFuc2l0aW9uOiBhdXRvc2NhbGluZy5MaWZlY3ljbGVUcmFuc2l0aW9uLklOU1RBTkNFX0xBVU5DSElORyxcbiAgICAgIGRlZmF1bHRSZXN1bHQ6IGF1dG9zY2FsaW5nLkRlZmF1bHRSZXN1bHQuQUJBTkRPTixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpBdXRvU2NhbGluZzo6TGlmZWN5Y2xlSG9vaycsIHtcbiAgICAgIExpZmVjeWNsZVRyYW5zaXRpb246ICdhdXRvc2NhbGluZzpFQzJfSU5TVEFOQ0VfTEFVTkNISU5HJyxcbiAgICAgIERlZmF1bHRSZXN1bHQ6ICdBQkFORE9OJyxcbiAgICAgIE5vdGlmaWNhdGlvblRhcmdldEFSTjogJ3RhcmdldDphcm4nLFxuICAgIH0pO1xuXG4gICAgLy8gTGlmZWN5Y2xlIEhvb2sgaGFzIGEgZGVwZW5kZW5jeSBvbiB0aGUgcG9saWN5IG9iamVjdFxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6QXV0b1NjYWxpbmc6OkxpZmVjeWNsZUhvb2snLCB7XG4gICAgICBEZXBlbmRzT246IFtcbiAgICAgICAgJ0FTR0xpZmVjeWNsZUhvb2tUcmFuc2l0aW9uUm9sZURlZmF1bHRQb2xpY3kyRTUwQzdEQicsXG4gICAgICAgICdBU0dMaWZlY3ljbGVIb29rVHJhbnNpdGlvblJvbGUzQUFBNkJCNycsXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gQSBkZWZhdWx0IHJvbGUgaXMgcHJvdmlkZWRcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgU2VydmljZTogJ2F1dG9zY2FsaW5nLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIEZha2VOb3RpZmljYXRpb25UYXJnZXQuYmluZCgpIHdhcyBleGVjdXRlZFxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdhY3Rpb246V29yaycsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG50ZXN0KCd3ZSBjYW4gYWRkIGEgbGlmZWN5Y2xlIGhvb2sgdG8gYW4gQVNHIHdpdGggbm8gcm9sZSBhbmQgd2l0aCBubyBub3RpZmljYXRpb25UYXJnZXRBcm4nLCAoKT0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IGFzZyA9IG5ld0FTRyhzdGFjayk7XG5cbiAgLy8gV0hFTlxuICBhc2cuYWRkTGlmZWN5Y2xlSG9vaygnVHJhbnNpdGlvbicsIHtcbiAgICBsaWZlY3ljbGVUcmFuc2l0aW9uOiBhdXRvc2NhbGluZy5MaWZlY3ljbGVUcmFuc2l0aW9uLklOU1RBTkNFX0xBVU5DSElORyxcbiAgICBkZWZhdWx0UmVzdWx0OiBhdXRvc2NhbGluZy5EZWZhdWx0UmVzdWx0LkFCQU5ET04sXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkxpZmVjeWNsZUhvb2snLCB7XG4gICAgTGlmZWN5Y2xlVHJhbnNpdGlvbjogJ2F1dG9zY2FsaW5nOkVDMl9JTlNUQU5DRV9MQVVOQ0hJTkcnLFxuICAgIERlZmF1bHRSZXN1bHQ6ICdBQkFORE9OJyxcbiAgfSk7XG5cbiAgLy8gQSBkZWZhdWx0IHJvbGUgaXMgTk9UIHByb3ZpZGVkXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIE1hdGNoLm5vdCh7XG4gICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICBTZXJ2aWNlOiAnYXV0b3NjYWxpbmcuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSkpO1xuXG4gIC8vIEZha2VOb3RpZmljYXRpb25UYXJnZXQuYmluZCgpIHdhcyBOT1QgZXhlY3V0ZWRcbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6SUFNOjpQb2xpY3knLCAwKTtcbn0pO1xuXG50ZXN0KCd3ZSBjYW4gYWRkIGEgbGlmZWN5Y2xlIGhvb2sgdG8gYW4gQVNHIHdpdGggYSByb2xlIGFuZCB3aXRoIGEgbm90aWZpY2F0aW9uVGFyZ2V0QXJuJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgYXNnID0gbmV3QVNHKHN0YWNrKTtcbiAgY29uc3QgbXlyb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnTXlSb2xlJywge1xuICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdjdXN0b20ucm9sZS5kb21haW4uY29tJyksXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgYXNnLmFkZExpZmVjeWNsZUhvb2soJ1RyYW5zaXRpb24nLCB7XG4gICAgbGlmZWN5Y2xlVHJhbnNpdGlvbjogYXV0b3NjYWxpbmcuTGlmZWN5Y2xlVHJhbnNpdGlvbi5JTlNUQU5DRV9MQVVOQ0hJTkcsXG4gICAgZGVmYXVsdFJlc3VsdDogYXV0b3NjYWxpbmcuRGVmYXVsdFJlc3VsdC5BQkFORE9OLFxuICAgIG5vdGlmaWNhdGlvblRhcmdldDogbmV3IEZha2VOb3RpZmljYXRpb25UYXJnZXQoKSxcbiAgICByb2xlOiBteXJvbGUsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6QXV0b1NjYWxpbmc6OkxpZmVjeWNsZUhvb2snLCB7XG4gICAgTm90aWZpY2F0aW9uVGFyZ2V0QVJOOiAndGFyZ2V0OmFybicsXG4gICAgTGlmZWN5Y2xlVHJhbnNpdGlvbjogJ2F1dG9zY2FsaW5nOkVDMl9JTlNUQU5DRV9MQVVOQ0hJTkcnLFxuICAgIERlZmF1bHRSZXN1bHQ6ICdBQkFORE9OJyxcbiAgfSk7XG5cbiAgLy8gdGhlIHByb3ZpZGVkIHJvbGUgKG15cm9sZSksIG5vdCB0aGUgZGVmYXVsdCByb2xlLCBpcyB1c2VkXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICB7XG4gICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgIFNlcnZpY2U6ICdjdXN0b20ucm9sZS5kb21haW4uY29tJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdhZGRpbmcgYSBsaWZlY3ljbGUgaG9vayB3aXRoIGEgcm9sZSBhbmQgd2l0aCBubyBub3RpZmljYXRpb25UYXJnZXQgdG8gYW4gQVNHIHRocm93cyBhbiBlcnJvcicsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IGFzZyA9IG5ld0FTRyhzdGFjayk7XG4gIGNvbnN0IG15cm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ015Um9sZScsIHtcbiAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnY3VzdG9tLnJvbGUuZG9tYWluLmNvbScpLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIGV4cGVjdCgoKSA9PiB7XG4gICAgYXNnLmFkZExpZmVjeWNsZUhvb2soJ1RyYW5zaXRpb24nLCB7XG4gICAgICBsaWZlY3ljbGVUcmFuc2l0aW9uOiBhdXRvc2NhbGluZy5MaWZlY3ljbGVUcmFuc2l0aW9uLklOU1RBTkNFX0xBVU5DSElORyxcbiAgICAgIGRlZmF1bHRSZXN1bHQ6IGF1dG9zY2FsaW5nLkRlZmF1bHRSZXN1bHQuQUJBTkRPTixcbiAgICAgIHJvbGU6IG15cm9sZSxcbiAgICB9KTtcbiAgfSkudG9UaHJvdygvJ25vdGlmaWNhdGlvblRhcmdldCcgcGFyYW1ldGVyIHJlcXVpcmVkIHdoZW4gJ3JvbGUnIHBhcmFtZXRlciBpcyBzcGVjaWZpZWQvKTtcbn0pO1xuXG5jbGFzcyBGYWtlTm90aWZpY2F0aW9uVGFyZ2V0IGltcGxlbWVudHMgYXV0b3NjYWxpbmcuSUxpZmVjeWNsZUhvb2tUYXJnZXQge1xuICBwcml2YXRlIGNyZWF0ZVJvbGUoc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBfcm9sZT86IGlhbS5JUm9sZSkge1xuICAgIGxldCByb2xlID0gX3JvbGU7XG4gICAgaWYgKCFyb2xlKSB7XG4gICAgICByb2xlID0gbmV3IGlhbS5Sb2xlKHNjb3BlLCAnUm9sZScsIHtcbiAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2F1dG9zY2FsaW5nLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByb2xlO1xuICB9XG5cbiAgcHVibGljIGJpbmQoX3Njb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgb3B0aW9uczogYXV0b3NjYWxpbmcuQmluZEhvb2tUYXJnZXRPcHRpb25zKTogYXV0b3NjYWxpbmcuTGlmZWN5Y2xlSG9va1RhcmdldENvbmZpZyB7XG4gICAgY29uc3Qgcm9sZSA9IHRoaXMuY3JlYXRlUm9sZShvcHRpb25zLmxpZmVjeWNsZUhvb2ssIG9wdGlvbnMucm9sZSk7XG5cbiAgICByb2xlLmFkZFRvUHJpbmNpcGFsUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnYWN0aW9uOldvcmsnXSxcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHsgbm90aWZpY2F0aW9uVGFyZ2V0QXJuOiAndGFyZ2V0OmFybicsIGNyZWF0ZWRSb2xlOiByb2xlIH07XG4gIH1cbn1cblxuZnVuY3Rpb24gbmV3QVNHKHN0YWNrOiBjZGsuU3RhY2spIHtcbiAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnKTtcblxuICByZXR1cm4gbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdBU0cnLCB7XG4gICAgdnBjLFxuICAgIGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZS5vZihlYzIuSW5zdGFuY2VDbGFzcy5NNCwgZWMyLkluc3RhbmNlU2l6ZS5NSUNSTyksXG4gICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgfSk7XG59XG4iXX0=