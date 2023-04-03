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
    group1 = new elbv2.NetworkTargetGroup(stack, 'TargetGroup1', { vpc, port: 80 });
    group2 = new elbv2.NetworkTargetGroup(stack, 'TargetGroup2', { vpc, port: 80 });
    lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
});
describe('tests', () => {
    test('Forward to multiple targetgroups with an Action and stickiness', () => {
        // WHEN
        lb.addListener('Listener', {
            port: 80,
            defaultAction: elbv2.NetworkListenerAction.forward([group1, group2], {
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
            defaultAction: elbv2.NetworkListenerAction.weightedForward([
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9ucy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWN0aW9ucy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUF3QztBQUN4QyxxQ0FBcUM7QUFDckMsbUNBQW1DO0FBRW5DLElBQUksS0FBZ0IsQ0FBQztBQUNyQixJQUFJLE1BQWdDLENBQUM7QUFDckMsSUFBSSxNQUFnQyxDQUFDO0FBQ3JDLElBQUksRUFBNkIsQ0FBQztBQUVsQyxVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3hCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDeEMsTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDaEYsTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDaEYsRUFBRSxHQUFHLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQzNELENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDckIsSUFBSSxDQUFDLGdFQUFnRSxFQUFFLEdBQUcsRUFBRTtRQUMxRSxPQUFPO1FBQ1AsRUFBRSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEVBQUU7WUFDekIsSUFBSSxFQUFFLEVBQUU7WUFDUixhQUFhLEVBQUUsS0FBSyxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBRTtnQkFDbkUsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQzFDLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUNBQXVDLEVBQUU7WUFDdkYsY0FBYyxFQUFFO2dCQUNkO29CQUNFLGFBQWEsRUFBRTt3QkFDYiwyQkFBMkIsRUFBRTs0QkFDM0IsZUFBZSxFQUFFLElBQUk7NEJBQ3JCLE9BQU8sRUFBRSxJQUFJO3lCQUNkO3dCQUNELFlBQVksRUFBRTs0QkFDWjtnQ0FDRSxjQUFjLEVBQUUsRUFBRSxHQUFHLEVBQUUsc0JBQXNCLEVBQUU7NkJBQ2hEOzRCQUNEO2dDQUNFLGNBQWMsRUFBRSxFQUFFLEdBQUcsRUFBRSxzQkFBc0IsRUFBRTs2QkFDaEQ7eUJBQ0Y7cUJBQ0Y7b0JBQ0QsSUFBSSxFQUFFLFNBQVM7aUJBQ2hCO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywwREFBMEQsRUFBRSxHQUFHLEVBQUU7UUFDcEUsT0FBTztRQUNQLEVBQUUsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFO1lBQ3pCLElBQUksRUFBRSxFQUFFO1lBQ1IsYUFBYSxFQUFFLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUM7Z0JBQ3pELEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFO2dCQUNuQyxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRTthQUNwQyxFQUFFO2dCQUNELGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzthQUMxQyxDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHVDQUF1QyxFQUFFO1lBQ3ZGLGNBQWMsRUFBRTtnQkFDZDtvQkFDRSxhQUFhLEVBQUU7d0JBQ2IsMkJBQTJCLEVBQUU7NEJBQzNCLGVBQWUsRUFBRSxJQUFJOzRCQUNyQixPQUFPLEVBQUUsSUFBSTt5QkFDZDt3QkFDRCxZQUFZLEVBQUU7NEJBQ1o7Z0NBQ0UsY0FBYyxFQUFFLEVBQUUsR0FBRyxFQUFFLHNCQUFzQixFQUFFO2dDQUMvQyxNQUFNLEVBQUUsRUFBRTs2QkFDWDs0QkFDRDtnQ0FDRSxjQUFjLEVBQUUsRUFBRSxHQUFHLEVBQUUsc0JBQXNCLEVBQUU7Z0NBQy9DLE1BQU0sRUFBRSxFQUFFOzZCQUNYO3lCQUNGO3FCQUNGO29CQUNELElBQUksRUFBRSxTQUFTO2lCQUNoQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlbGJ2MiBmcm9tICcuLi8uLi9saWInO1xuXG5sZXQgc3RhY2s6IGNkay5TdGFjaztcbmxldCBncm91cDE6IGVsYnYyLk5ldHdvcmtUYXJnZXRHcm91cDtcbmxldCBncm91cDI6IGVsYnYyLk5ldHdvcmtUYXJnZXRHcm91cDtcbmxldCBsYjogZWxidjIuTmV0d29ya0xvYWRCYWxhbmNlcjtcblxuYmVmb3JlRWFjaCgoKSA9PiB7XG4gIHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1N0YWNrJyk7XG4gIGdyb3VwMSA9IG5ldyBlbGJ2Mi5OZXR3b3JrVGFyZ2V0R3JvdXAoc3RhY2ssICdUYXJnZXRHcm91cDEnLCB7IHZwYywgcG9ydDogODAgfSk7XG4gIGdyb3VwMiA9IG5ldyBlbGJ2Mi5OZXR3b3JrVGFyZ2V0R3JvdXAoc3RhY2ssICdUYXJnZXRHcm91cDInLCB7IHZwYywgcG9ydDogODAgfSk7XG4gIGxiID0gbmV3IGVsYnYyLk5ldHdvcmtMb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHsgdnBjIH0pO1xufSk7XG5cbmRlc2NyaWJlKCd0ZXN0cycsICgpID0+IHtcbiAgdGVzdCgnRm9yd2FyZCB0byBtdWx0aXBsZSB0YXJnZXRncm91cHMgd2l0aCBhbiBBY3Rpb24gYW5kIHN0aWNraW5lc3MnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGxiLmFkZExpc3RlbmVyKCdMaXN0ZW5lcicsIHtcbiAgICAgIHBvcnQ6IDgwLFxuICAgICAgZGVmYXVsdEFjdGlvbjogZWxidjIuTmV0d29ya0xpc3RlbmVyQWN0aW9uLmZvcndhcmQoW2dyb3VwMSwgZ3JvdXAyXSwge1xuICAgICAgICBzdGlja2luZXNzRHVyYXRpb246IGNkay5EdXJhdGlvbi5ob3VycygxKSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyJywge1xuICAgICAgRGVmYXVsdEFjdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEZvcndhcmRDb25maWc6IHtcbiAgICAgICAgICAgIFRhcmdldEdyb3VwU3RpY2tpbmVzc0NvbmZpZzoge1xuICAgICAgICAgICAgICBEdXJhdGlvblNlY29uZHM6IDM2MDAsXG4gICAgICAgICAgICAgIEVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgVGFyZ2V0R3JvdXBzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBUYXJnZXRHcm91cEFybjogeyBSZWY6ICdUYXJnZXRHcm91cDFFNTQ4MEY1MScgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFRhcmdldEdyb3VwQXJuOiB7IFJlZjogJ1RhcmdldEdyb3VwMkQ1NzFFNUQ3JyB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFR5cGU6ICdmb3J3YXJkJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ1dlaWdodGVkIGZvcndhcmQgdG8gbXVsdGlwbGUgdGFyZ2V0Z3JvdXBzIHdpdGggYW4gQWN0aW9uJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBsYi5hZGRMaXN0ZW5lcignTGlzdGVuZXInLCB7XG4gICAgICBwb3J0OiA4MCxcbiAgICAgIGRlZmF1bHRBY3Rpb246IGVsYnYyLk5ldHdvcmtMaXN0ZW5lckFjdGlvbi53ZWlnaHRlZEZvcndhcmQoW1xuICAgICAgICB7IHRhcmdldEdyb3VwOiBncm91cDEsIHdlaWdodDogMTAgfSxcbiAgICAgICAgeyB0YXJnZXRHcm91cDogZ3JvdXAyLCB3ZWlnaHQ6IDUwIH0sXG4gICAgICBdLCB7XG4gICAgICAgIHN0aWNraW5lc3NEdXJhdGlvbjogY2RrLkR1cmF0aW9uLmhvdXJzKDEpLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXInLCB7XG4gICAgICBEZWZhdWx0QWN0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgRm9yd2FyZENvbmZpZzoge1xuICAgICAgICAgICAgVGFyZ2V0R3JvdXBTdGlja2luZXNzQ29uZmlnOiB7XG4gICAgICAgICAgICAgIER1cmF0aW9uU2Vjb25kczogMzYwMCxcbiAgICAgICAgICAgICAgRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBUYXJnZXRHcm91cHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFRhcmdldEdyb3VwQXJuOiB7IFJlZjogJ1RhcmdldEdyb3VwMUU1NDgwRjUxJyB9LFxuICAgICAgICAgICAgICAgIFdlaWdodDogMTAsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBUYXJnZXRHcm91cEFybjogeyBSZWY6ICdUYXJnZXRHcm91cDJENTcxRTVENycgfSxcbiAgICAgICAgICAgICAgICBXZWlnaHQ6IDUwLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFR5cGU6ICdmb3J3YXJkJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=