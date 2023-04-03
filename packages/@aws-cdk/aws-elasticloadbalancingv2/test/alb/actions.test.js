"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const cdk = require("@aws-cdk/core");
const elbv2 = require("../../lib");
let stack;
let group1;
let group2;
let lb;
beforeEach(() => {
    stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    group1 = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup1', { vpc, port: 80 });
    group2 = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup2', { vpc, port: 80 });
    lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
});
describe('tests', () => {
    test('Forward action legacy rendering', () => {
        // WHEN
        lb.addListener('Listener', {
            port: 80,
            defaultAction: elbv2.ListenerAction.forward([group1]),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            DefaultActions: [
                {
                    TargetGroupArn: { Ref: 'TargetGroup1E5480F51' },
                    Type: 'forward',
                },
            ],
        });
    });
    test('Forward to multiple targetgroups with an Action and stickiness', () => {
        // WHEN
        lb.addListener('Listener', {
            port: 80,
            defaultAction: elbv2.ListenerAction.forward([group1, group2], {
                stickinessDuration: cdk.Duration.hours(1),
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            DefaultActions: [
                {
                    ForwardConfig: {
                        TargetGroupStickinessConfig: {
                            DurationSeconds: 3600,
                            Enabled: true,
                        },
                        TargetGroups: [
                            {
                                TargetGroupArn: { Ref: 'TargetGroup1E5480F51' },
                            },
                            {
                                TargetGroupArn: { Ref: 'TargetGroup2D571E5D7' },
                            },
                        ],
                    },
                    Type: 'forward',
                },
            ],
        });
    });
    test('Weighted forward to multiple targetgroups with an Action', () => {
        // WHEN
        lb.addListener('Listener', {
            port: 80,
            defaultAction: elbv2.ListenerAction.weightedForward([
                { targetGroup: group1, weight: 10 },
                { targetGroup: group2, weight: 50 },
            ], {
                stickinessDuration: cdk.Duration.hours(1),
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            DefaultActions: [
                {
                    ForwardConfig: {
                        TargetGroupStickinessConfig: {
                            DurationSeconds: 3600,
                            Enabled: true,
                        },
                        TargetGroups: [
                            {
                                TargetGroupArn: { Ref: 'TargetGroup1E5480F51' },
                                Weight: 10,
                            },
                            {
                                TargetGroupArn: { Ref: 'TargetGroup2D571E5D7' },
                                Weight: 50,
                            },
                        ],
                    },
                    Type: 'forward',
                },
            ],
        });
    });
    test('Chaining OIDC authentication action', () => {
        // WHEN
        lb.addListener('Listener', {
            port: 80,
            defaultAction: elbv2.ListenerAction.authenticateOidc({
                authorizationEndpoint: 'A',
                clientId: 'B',
                clientSecret: cdk.SecretValue.unsafePlainText('C'),
                issuer: 'D',
                tokenEndpoint: 'E',
                userInfoEndpoint: 'F',
                next: elbv2.ListenerAction.forward([group1]),
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
            DefaultActions: [
                {
                    AuthenticateOidcConfig: {
                        AuthorizationEndpoint: 'A',
                        ClientId: 'B',
                        ClientSecret: 'C',
                        Issuer: 'D',
                        TokenEndpoint: 'E',
                        UserInfoEndpoint: 'F',
                    },
                    Order: 1,
                    Type: 'authenticate-oidc',
                },
                {
                    Order: 2,
                    TargetGroupArn: { Ref: 'TargetGroup1E5480F51' },
                    Type: 'forward',
                },
            ],
        });
    });
    test('Add default Action and add Action with conditions', () => {
        // GIVEN
        const listener = lb.addListener('Listener', { port: 80 });
        // WHEN
        listener.addAction('Action1', {
            action: elbv2.ListenerAction.forward([group1]),
        });
        listener.addAction('Action2', {
            conditions: [elbv2.ListenerCondition.hostHeaders(['example.com'])],
            priority: 10,
            action: elbv2.ListenerAction.forward([group2]),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
            Actions: [
                {
                    TargetGroupArn: { Ref: 'TargetGroup2D571E5D7' },
                    Type: 'forward',
                },
            ],
        });
    });
    test('Add Action with multiple Conditions', () => {
        // GIVEN
        const listener = lb.addListener('Listener', { port: 80 });
        // WHEN
        listener.addAction('Action1', {
            action: elbv2.ListenerAction.forward([group1]),
        });
        listener.addAction('Action2', {
            conditions: [
                elbv2.ListenerCondition.hostHeaders(['example.com']),
                elbv2.ListenerCondition.sourceIps(['1.1.1.1/32']),
            ],
            priority: 10,
            action: elbv2.ListenerAction.forward([group2]),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
            Actions: [
                {
                    TargetGroupArn: { Ref: 'TargetGroup2D571E5D7' },
                    Type: 'forward',
                },
            ],
            Conditions: [
                {
                    Field: 'host-header',
                    HostHeaderConfig: {
                        Values: [
                            'example.com',
                        ],
                    },
                },
                {
                    Field: 'source-ip',
                    SourceIpConfig: {
                        Values: [
                            '1.1.1.1/32',
                        ],
                    },
                },
            ],
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9ucy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWN0aW9ucy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUF3QztBQUN4QyxxQ0FBcUM7QUFDckMsbUNBQW1DO0FBRW5DLElBQUksS0FBZ0IsQ0FBQztBQUNyQixJQUFJLE1BQW9DLENBQUM7QUFDekMsSUFBSSxNQUFvQyxDQUFDO0FBQ3pDLElBQUksRUFBaUMsQ0FBQztBQUV0QyxVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3hCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDeEMsTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDcEYsTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDcEYsRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQy9ELENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDckIsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtRQUMzQyxPQUFPO1FBQ1AsRUFBRSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUU7WUFDekIsSUFBSSxFQUFFLEVBQUU7WUFDUixhQUFhLEVBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMs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QUssQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUNsRDtZQUNELFFBQVEsRUFBRSxFQUFFO1lBQ1osTUFBTSxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDL0MsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDJDQUEyQyxFQUFFO1lBQzNGLE9BQU8sRUFBRTtnQkFDUDtvQkFDRSxjQUFjLEVBQUUsRUFBRSxHQUFHLEVBQUUsc0JBQXNCLEVBQUU7b0JBQy9DLElBQUksRUFBRSxTQUFTO2lCQUNoQjthQUNGO1lBQ0QsVUFBVSxFQUFFO2dCQUNWO29CQUNFLEtBQUssRUFBRSxhQUFhO29CQUNwQixnQkFBZ0IsRUFBRTt3QkFDaEIsTUFBTSxFQUFFOzRCQUNOLGFBQWE7eUJBQ2Q7cUJBQ0Y7aUJBQ0Y7Z0JBQ0Q7b0JBQ0UsS0FBSyxFQUFFLFdBQVc7b0JBQ2xCLGNBQWMsRUFBRTt3QkFDZCxNQUFNLEVBQUU7NEJBQ04sWUFBWTt5QkFDYjtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlbGJ2MiBmcm9tICcuLi8uLi9saWInO1xuXG5sZXQgc3RhY2s6IGNkay5TdGFjaztcbmxldCBncm91cDE6IGVsYnYyLkFwcGxpY2F0aW9uVGFyZ2V0R3JvdXA7XG5sZXQgZ3JvdXAyOiBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwO1xubGV0IGxiOiBlbGJ2Mi5BcHBsaWNhdGlvbkxvYWRCYWxhbmNlcjtcblxuYmVmb3JlRWFjaCgoKSA9PiB7XG4gIHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG4gIGdyb3VwMSA9IG5ldyBlbGJ2Mi5BcHBsaWNhdGlvblRhcmdldEdyb3VwKHN0YWNrLCAnVGFyZ2V0R3JvdXAxJywgeyB2cGMsIHBvcnQ6IDgwIH0pO1xuICBncm91cDIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25UYXJnZXRHcm91cChzdGFjaywgJ1RhcmdldEdyb3VwMicsIHsgdnBjLCBwb3J0OiA4MCB9KTtcbiAgbGIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHsgdnBjIH0pO1xufSk7XG5cbmRlc2NyaWJlKCd0ZXN0cycsICgpID0+IHtcbiAgdGVzdCgnRm9yd2FyZCBhY3Rpb24gbGVnYWN5IHJlbmRlcmluZycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbGIuYWRkTGlzdGVuZXIoJ0xpc3RlbmVyJywge1xuICAgICAgcG9ydDogODAsXG4gICAgICBkZWZhdWx0QWN0aW9uOiBlbGJ2Mi5MaXN0ZW5lckFjdGlvbi5mb3J3YXJkKFtncm91cDFdKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lcicsIHtcbiAgICAgIERlZmF1bHRBY3Rpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBUYXJnZXRHcm91cEFybjogeyBSZWY6ICdUYXJnZXRHcm91cDFFNTQ4MEY1MScgfSxcbiAgICAgICAgICBUeXBlOiAnZm9yd2FyZCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdGb3J3YXJkIHRvIG11bHRpcGxlIHRhcmdldGdyb3VwcyB3aXRoIGFuIEFjdGlvbiBhbmQgc3RpY2tpbmVzcycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbGIuYWRkTGlzdGVuZXIoJ0xpc3RlbmVyJywge1xuICAgICAgcG9ydDogODAsXG4gICAgICBkZWZhdWx0QWN0aW9uOiBlbGJ2Mi5MaXN0ZW5lckFjdGlvbi5mb3J3YXJkKFtncm91cDEsIGdyb3VwMl0sIHtcbiAgICAgICAgc3RpY2tpbmVzc0R1cmF0aW9uOiBjZGsuRHVyYXRpb24uaG91cnMoMSksXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lcicsIHtcbiAgICAgIERlZmF1bHRBY3Rpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBGb3J3YXJkQ29uZmlnOiB7XG4gICAgICAgICAgICBUYXJnZXRHcm91cFN0aWNraW5lc3NDb25maWc6IHtcbiAgICAgICAgICAgICAgRHVyYXRpb25TZWNvbmRzOiAzNjAwLFxuICAgICAgICAgICAgICBFbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFRhcmdldEdyb3VwczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgVGFyZ2V0R3JvdXBBcm46IHsgUmVmOiAnVGFyZ2V0R3JvdXAxRTU0ODBGNTEnIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBUYXJnZXRHcm91cEFybjogeyBSZWY6ICdUYXJnZXRHcm91cDJENTcxRTVENycgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUeXBlOiAnZm9yd2FyZCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdXZWlnaHRlZCBmb3J3YXJkIHRvIG11bHRpcGxlIHRhcmdldGdyb3VwcyB3aXRoIGFuIEFjdGlvbicsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgbGIuYWRkTGlzdGVuZXIoJ0xpc3RlbmVyJywge1xuICAgICAgcG9ydDogODAsXG4gICAgICBkZWZhdWx0QWN0aW9uOiBlbGJ2Mi5MaXN0ZW5lckFjdGlvbi53ZWlnaHRlZEZvcndhcmQoW1xuICAgICAgICB7IHRhcmdldEdyb3VwOiBncm91cDEsIHdlaWdodDogMTAgfSxcbiAgICAgICAgeyB0YXJnZXRHcm91cDogZ3JvdXAyLCB3ZWlnaHQ6IDUwIH0sXG4gICAgICBdLCB7XG4gICAgICAgIHN0aWNraW5lc3NEdXJhdGlvbjogY2RrLkR1cmF0aW9uLmhvdXJzKDEpLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXInLCB7XG4gICAgICBEZWZhdWx0QWN0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgRm9yd2FyZENvbmZpZzoge1xuICAgICAgICAgICAgVGFyZ2V0R3JvdXBTdGlja2luZXNzQ29uZmlnOiB7XG4gICAgICAgICAgICAgIER1cmF0aW9uU2Vjb25kczogMzYwMCxcbiAgICAgICAgICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBUYXJnZXRHcm91cHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFRhcmdldEdyb3VwQXJuOiB7IFJlZjogJ1RhcmdldEdyb3VwMUU1NDgwRjUxJyB9LFxuICAgICAgICAgICAgICAgIFdlaWdodDogMTAsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBUYXJnZXRHcm91cEFybjogeyBSZWY6ICdUYXJnZXRHcm91cDJENTcxRTVENycgfSxcbiAgICAgICAgICAgICAgICBXZWlnaHQ6IDUwLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFR5cGU6ICdmb3J3YXJkJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0NoYWluaW5nIE9JREMgYXV0aGVudGljYXRpb24gYWN0aW9uJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBsYi5hZGRMaXN0ZW5lcignTGlzdGVuZXInLCB7XG4gICAgICBwb3J0OiA4MCxcbiAgICAgIGRlZmF1bHRBY3Rpb246IGVsYnYyLkxpc3RlbmVyQWN0aW9uLmF1dGhlbnRpY2F0ZU9pZGMoe1xuICAgICAgICBhdXRob3JpemF0aW9uRW5kcG9pbnQ6ICdBJyxcbiAgICAgICAgY2xpZW50SWQ6ICdCJyxcbiAgICAgICAgY2xpZW50U2VjcmV0OiBjZGsuU2VjcmV0VmFsdWUudW5zYWZlUGxhaW5UZXh0KCdDJyksXG4gICAgICAgIGlzc3VlcjogJ0QnLFxuICAgICAgICB0b2tlbkVuZHBvaW50OiAnRScsXG4gICAgICAgIHVzZXJJbmZvRW5kcG9pbnQ6ICdGJyxcbiAgICAgICAgbmV4dDogZWxidjIuTGlzdGVuZXJBY3Rpb24uZm9yd2FyZChbZ3JvdXAxXSksXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lcicsIHtcbiAgICAgIERlZmF1bHRBY3Rpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBdXRoZW50aWNhdGVPaWRjQ29uZmlnOiB7XG4gICAgICAgICAgICBBdXRob3JpemF0aW9uRW5kcG9pbnQ6ICdBJyxcbiAgICAgICAgICAgIENsaWVudElkOiAnQicsXG4gICAgICAgICAgICBDbGllbnRTZWNyZXQ6ICdDJyxcbiAgICAgICAgICAgIElzc3VlcjogJ0QnLFxuICAgICAgICAgICAgVG9rZW5FbmRwb2ludDogJ0UnLFxuICAgICAgICAgICAgVXNlckluZm9FbmRwb2ludDogJ0YnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgT3JkZXI6IDEsXG4gICAgICAgICAgVHlwZTogJ2F1dGhlbnRpY2F0ZS1vaWRjJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIE9yZGVyOiAyLFxuICAgICAgICAgIFRhcmdldEdyb3VwQXJuOiB7IFJlZjogJ1RhcmdldEdyb3VwMUU1NDgwRjUxJyB9LFxuICAgICAgICAgIFR5cGU6ICdmb3J3YXJkJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0FkZCBkZWZhdWx0IEFjdGlvbiBhbmQgYWRkIEFjdGlvbiB3aXRoIGNvbmRpdGlvbnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHsgcG9ydDogODAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbGlzdGVuZXIuYWRkQWN0aW9uKCdBY3Rpb24xJywge1xuICAgICAgYWN0aW9uOiBlbGJ2Mi5MaXN0ZW5lckFjdGlvbi5mb3J3YXJkKFtncm91cDFdKSxcbiAgICB9KTtcblxuICAgIGxpc3RlbmVyLmFkZEFjdGlvbignQWN0aW9uMicsIHtcbiAgICAgIGNvbmRpdGlvbnM6IFtlbGJ2Mi5MaXN0ZW5lckNvbmRpdGlvbi5ob3N0SGVhZGVycyhbJ2V4YW1wbGUuY29tJ10pXSxcbiAgICAgIHByaW9yaXR5OiAxMCxcbiAgICAgIGFjdGlvbjogZWxidjIuTGlzdGVuZXJBY3Rpb24uZm9yd2FyZChbZ3JvdXAyXSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXJSdWxlJywge1xuICAgICAgQWN0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgVGFyZ2V0R3JvdXBBcm46IHsgUmVmOiAnVGFyZ2V0R3JvdXAyRDU3MUU1RDcnIH0sXG4gICAgICAgICAgVHlwZTogJ2ZvcndhcmQnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQWRkIEFjdGlvbiB3aXRoIG11bHRpcGxlIENvbmRpdGlvbnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBsaXN0ZW5lciA9IGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHsgcG9ydDogODAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbGlzdGVuZXIuYWRkQWN0aW9uKCdBY3Rpb24xJywge1xuICAgICAgYWN0aW9uOiBlbGJ2Mi5MaXN0ZW5lckFjdGlvbi5mb3J3YXJkKFtncm91cDFdKSxcbiAgICB9KTtcblxuICAgIGxpc3RlbmVyLmFkZEFjdGlvbignQWN0aW9uMicsIHtcbiAgICAgIGNvbmRpdGlvbnM6IFtcbiAgICAgICAgZWxidjIuTGlzdGVuZXJDb25kaXRpb24uaG9zdEhlYWRlcnMoWydleGFtcGxlLmNvbSddKSxcbiAgICAgICAgZWxidjIuTGlzdGVuZXJDb25kaXRpb24uc291cmNlSXBzKFsnMS4xLjEuMS8zMiddKSxcbiAgICAgIF0sXG4gICAgICBwcmlvcml0eTogMTAsXG4gICAgICBhY3Rpb246IGVsYnYyLkxpc3RlbmVyQWN0aW9uLmZvcndhcmQoW2dyb3VwMl0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyUnVsZScsIHtcbiAgICAgIEFjdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFRhcmdldEdyb3VwQXJuOiB7IFJlZjogJ1RhcmdldEdyb3VwMkQ1NzFFNUQ3JyB9LFxuICAgICAgICAgIFR5cGU6ICdmb3J3YXJkJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBDb25kaXRpb25zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBGaWVsZDogJ2hvc3QtaGVhZGVyJyxcbiAgICAgICAgICBIb3N0SGVhZGVyQ29uZmlnOiB7XG4gICAgICAgICAgICBWYWx1ZXM6IFtcbiAgICAgICAgICAgICAgJ2V4YW1wbGUuY29tJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEZpZWxkOiAnc291cmNlLWlwJyxcbiAgICAgICAgICBTb3VyY2VJcENvbmZpZzoge1xuICAgICAgICAgICAgVmFsdWVzOiBbXG4gICAgICAgICAgICAgICcxLjEuMS4xLzMyJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=