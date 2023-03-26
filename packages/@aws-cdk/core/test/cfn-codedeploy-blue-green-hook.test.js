"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const lib_1 = require("../lib");
describe('CodeDeploy blue-green deployment Hook', () => {
    test('only renders the provided properties', () => {
        const stack = new lib_1.Stack();
        new lib_1.CfnCodeDeployBlueGreenHook(stack, 'MyHook', {
            trafficRoutingConfig: {
                type: lib_1.CfnTrafficRoutingType.TIME_BASED_LINEAR,
                timeBasedLinear: {
                    bakeTimeMins: 15,
                },
            },
            applications: [
                {
                    ecsAttributes: {
                        trafficRouting: {
                            targetGroups: ['blue-target-group', 'green-target-group'],
                            testTrafficRoute: {
                                logicalId: 'logicalId1',
                                type: 'AWS::ElasticLoadBalancingV2::Listener',
                            },
                            prodTrafficRoute: {
                                logicalId: 'logicalId2',
                                type: 'AWS::ElasticLoadBalancingV2::Listener',
                            },
                        },
                        taskSets: ['blue-task-set', 'green-task-set'],
                        taskDefinitions: ['blue-task-def', 'green-task-def'],
                    },
                    target: {
                        logicalId: 'logicalId',
                        type: 'AWS::ECS::Service',
                    },
                },
            ],
            serviceRole: 'my-service-role',
        });
        const template = (0, util_1.toCloudFormation)(stack);
        expect(template).toStrictEqual({
            Hooks: {
                MyHook: {
                    Type: 'AWS::CodeDeploy::BlueGreen',
                    Properties: {
                        // no empty AdditionalOptions object present
                        // no empty LifecycleEventHooks object present
                        TrafficRoutingConfig: {
                            // no empty TimeBasedCanary object present
                            Type: 'TimeBasedLinear',
                            TimeBasedLinear: {
                                BakeTimeMins: 15,
                            },
                        },
                        Applications: [
                            {
                                ECSAttributes: {
                                    TaskDefinitions: [
                                        'blue-task-def',
                                        'green-task-def',
                                    ],
                                    TaskSets: [
                                        'blue-task-set',
                                        'green-task-set',
                                    ],
                                    TrafficRouting: {
                                        TargetGroups: [
                                            'blue-target-group',
                                            'green-target-group',
                                        ],
                                        ProdTrafficRoute: {
                                            LogicalID: 'logicalId2',
                                            Type: 'AWS::ElasticLoadBalancingV2::Listener',
                                        },
                                        TestTrafficRoute: {
                                            LogicalID: 'logicalId1',
                                            Type: 'AWS::ElasticLoadBalancingV2::Listener',
                                        },
                                    },
                                },
                                Target: {
                                    LogicalID: 'logicalId',
                                    Type: 'AWS::ECS::Service',
                                },
                            },
                        ],
                        ServiceRole: 'my-service-role',
                    },
                },
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWNvZGVkZXBsb3ktYmx1ZS1ncmVlbi1ob29rLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZm4tY29kZWRlcGxveS1ibHVlLWdyZWVuLWhvb2sudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUEwQztBQUMxQyxnQ0FBa0Y7QUFFbEYsUUFBUSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtJQUNyRCxJQUFJLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO1FBQ2hELE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7UUFDMUIsSUFBSSxnQ0FBMEIsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1lBQzlDLG9CQUFvQixFQUFFO2dCQUNwQixJQUFJLEVBQUUsMkJBQXFCLENBQUMsaUJBQWlCO2dCQUM3QyxlQUFlLEVBQUU7b0JBQ2YsWUFBWSxFQUFFLEVBQUU7aUJBQ2pCO2FBQ0Y7WUFDRCxZQUFZLEVBQUU7Z0JBQ1o7b0JBQ0UsYUFBYSxFQUFFO3dCQUNiLGNBQWMsRUFBRTs0QkFDZCxZQUFZLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxvQkFBb0IsQ0FBQzs0QkFDekQsZ0JBQWdCLEVBQUU7Z0NBQ2hCLFNBQVMsRUFBRSxZQUFZO2dDQUN2QixJQUFJLEVBQUUsdUNBQXVDOzZCQUM5Qzs0QkFDRCxnQkFBZ0IsRUFBRTtnQ0FDaEIsU0FBUyxFQUFFLFlBQVk7Z0NBQ3ZCLElBQUksRUFBRSx1Q0FBdUM7NkJBQzlDO3lCQUNGO3dCQUNELFFBQVEsRUFBRSxDQUFDLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQzt3QkFDN0MsZUFBZSxFQUFFLENBQUMsZUFBZSxFQUFFLGdCQUFnQixDQUFDO3FCQUNyRDtvQkFDRCxNQUFNLEVBQUU7d0JBQ04sU0FBUyxFQUFFLFdBQVc7d0JBQ3RCLElBQUksRUFBRSxtQkFBbUI7cUJBQzFCO2lCQUNGO2FBQ0Y7WUFDRCxXQUFXLEVBQUUsaUJBQWlCO1NBQy9CLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHLElBQUEsdUJBQWdCLEVBQUMsS0FBSyxDQUFDLENBQUM7UUFDekMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGFBQWEsQ0FBQztZQUM3QixLQUFLLEVBQUU7Z0JBQ0wsTUFBTSxFQUFFO29CQUNOLElBQUksRUFBRSw0QkFBNEI7b0JBQ2xDLFVBQVUsRUFBRTt3QkFDViw0Q0FBNEM7d0JBQzVDLDhDQUE4Qzt3QkFDOUMsb0JBQW9CLEVBQUU7NEJBQ3BCLDBDQUEwQzs0QkFDMUMsSUFBSSxFQUFFLGlCQUFpQjs0QkFDdkIsZUFBZSxFQUFFO2dDQUNmLFlBQVksRUFBRSxFQUFFOzZCQUNqQjt5QkFDRjt3QkFDRCxZQUFZLEVBQUU7NEJBQ1o7Z0NBQ0UsYUFBYSxFQUFFO29DQUNiLGVBQWUsRUFBRTt3Q0FDZixlQUFlO3dDQUNmLGdCQUFnQjtxQ0FDakI7b0NBQ0QsUUFBUSxFQUFFO3dDQUNSLGVBQWU7d0NBQ2YsZ0JBQWdCO3FDQUNqQjtvQ0FDRCxjQUFjLEVBQUU7d0NBQ2QsWUFBWSxFQUFFOzRDQUNaLG1CQUFtQjs0Q0FDbkIsb0JBQW9CO3lDQUNyQjt3Q0FDRCxnQkFBZ0IsRUFBRTs0Q0FDaEIsU0FBUyxFQUFFLFlBQVk7NENBQ3ZCLElBQUksRUFBRSx1Q0FBdUM7eUNBQzlDO3dDQUNELGdCQUFnQixFQUFFOzRDQUNoQixTQUFTLEVBQUUsWUFBWTs0Q0FDdkIsSUFBSSxFQUFFLHVDQUF1Qzt5Q0FDOUM7cUNBQ0Y7aUNBQ0Y7Z0NBQ0QsTUFBTSxFQUFFO29DQUNOLFNBQVMsRUFBRSxXQUFXO29DQUN0QixJQUFJLEVBQUUsbUJBQW1CO2lDQUMxQjs2QkFDRjt5QkFDRjt3QkFDRCxXQUFXLEVBQUUsaUJBQWlCO3FCQUMvQjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHRvQ2xvdWRGb3JtYXRpb24gfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgQ2ZuQ29kZURlcGxveUJsdWVHcmVlbkhvb2ssIENmblRyYWZmaWNSb3V0aW5nVHlwZSwgU3RhY2sgfSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnQ29kZURlcGxveSBibHVlLWdyZWVuIGRlcGxveW1lbnQgSG9vaycsICgpID0+IHtcbiAgdGVzdCgnb25seSByZW5kZXJzIHRoZSBwcm92aWRlZCBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgbmV3IENmbkNvZGVEZXBsb3lCbHVlR3JlZW5Ib29rKHN0YWNrLCAnTXlIb29rJywge1xuICAgICAgdHJhZmZpY1JvdXRpbmdDb25maWc6IHtcbiAgICAgICAgdHlwZTogQ2ZuVHJhZmZpY1JvdXRpbmdUeXBlLlRJTUVfQkFTRURfTElORUFSLFxuICAgICAgICB0aW1lQmFzZWRMaW5lYXI6IHtcbiAgICAgICAgICBiYWtlVGltZU1pbnM6IDE1LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGFwcGxpY2F0aW9uczogW1xuICAgICAgICB7XG4gICAgICAgICAgZWNzQXR0cmlidXRlczoge1xuICAgICAgICAgICAgdHJhZmZpY1JvdXRpbmc6IHtcbiAgICAgICAgICAgICAgdGFyZ2V0R3JvdXBzOiBbJ2JsdWUtdGFyZ2V0LWdyb3VwJywgJ2dyZWVuLXRhcmdldC1ncm91cCddLFxuICAgICAgICAgICAgICB0ZXN0VHJhZmZpY1JvdXRlOiB7XG4gICAgICAgICAgICAgICAgbG9naWNhbElkOiAnbG9naWNhbElkMScsXG4gICAgICAgICAgICAgICAgdHlwZTogJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXInLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBwcm9kVHJhZmZpY1JvdXRlOiB7XG4gICAgICAgICAgICAgICAgbG9naWNhbElkOiAnbG9naWNhbElkMicsXG4gICAgICAgICAgICAgICAgdHlwZTogJ0FXUzo6RWxhc3RpY0xvYWRCYWxhbmNpbmdWMjo6TGlzdGVuZXInLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRhc2tTZXRzOiBbJ2JsdWUtdGFzay1zZXQnLCAnZ3JlZW4tdGFzay1zZXQnXSxcbiAgICAgICAgICAgIHRhc2tEZWZpbml0aW9uczogWydibHVlLXRhc2stZGVmJywgJ2dyZWVuLXRhc2stZGVmJ10sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0YXJnZXQ6IHtcbiAgICAgICAgICAgIGxvZ2ljYWxJZDogJ2xvZ2ljYWxJZCcsXG4gICAgICAgICAgICB0eXBlOiAnQVdTOjpFQ1M6OlNlcnZpY2UnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgc2VydmljZVJvbGU6ICdteS1zZXJ2aWNlLXJvbGUnLFxuICAgIH0pO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSB0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKTtcbiAgICBleHBlY3QodGVtcGxhdGUpLnRvU3RyaWN0RXF1YWwoe1xuICAgICAgSG9va3M6IHtcbiAgICAgICAgTXlIb29rOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6Q29kZURlcGxveTo6Qmx1ZUdyZWVuJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAvLyBubyBlbXB0eSBBZGRpdGlvbmFsT3B0aW9ucyBvYmplY3QgcHJlc2VudFxuICAgICAgICAgICAgLy8gbm8gZW1wdHkgTGlmZWN5Y2xlRXZlbnRIb29rcyBvYmplY3QgcHJlc2VudFxuICAgICAgICAgICAgVHJhZmZpY1JvdXRpbmdDb25maWc6IHtcbiAgICAgICAgICAgICAgLy8gbm8gZW1wdHkgVGltZUJhc2VkQ2FuYXJ5IG9iamVjdCBwcmVzZW50XG4gICAgICAgICAgICAgIFR5cGU6ICdUaW1lQmFzZWRMaW5lYXInLFxuICAgICAgICAgICAgICBUaW1lQmFzZWRMaW5lYXI6IHtcbiAgICAgICAgICAgICAgICBCYWtlVGltZU1pbnM6IDE1LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEFwcGxpY2F0aW9uczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgRUNTQXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgICAgVGFza0RlZmluaXRpb25zOiBbXG4gICAgICAgICAgICAgICAgICAgICdibHVlLXRhc2stZGVmJyxcbiAgICAgICAgICAgICAgICAgICAgJ2dyZWVuLXRhc2stZGVmJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBUYXNrU2V0czogW1xuICAgICAgICAgICAgICAgICAgICAnYmx1ZS10YXNrLXNldCcsXG4gICAgICAgICAgICAgICAgICAgICdncmVlbi10YXNrLXNldCcsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgVHJhZmZpY1JvdXRpbmc6IHtcbiAgICAgICAgICAgICAgICAgICAgVGFyZ2V0R3JvdXBzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgJ2JsdWUtdGFyZ2V0LWdyb3VwJyxcbiAgICAgICAgICAgICAgICAgICAgICAnZ3JlZW4tdGFyZ2V0LWdyb3VwJyxcbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgUHJvZFRyYWZmaWNSb3V0ZToge1xuICAgICAgICAgICAgICAgICAgICAgIExvZ2ljYWxJRDogJ2xvZ2ljYWxJZDInLFxuICAgICAgICAgICAgICAgICAgICAgIFR5cGU6ICdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgVGVzdFRyYWZmaWNSb3V0ZToge1xuICAgICAgICAgICAgICAgICAgICAgIExvZ2ljYWxJRDogJ2xvZ2ljYWxJZDEnLFxuICAgICAgICAgICAgICAgICAgICAgIFR5cGU6ICdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBUYXJnZXQ6IHtcbiAgICAgICAgICAgICAgICAgIExvZ2ljYWxJRDogJ2xvZ2ljYWxJZCcsXG4gICAgICAgICAgICAgICAgICBUeXBlOiAnQVdTOjpFQ1M6OlNlcnZpY2UnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgU2VydmljZVJvbGU6ICdteS1zZXJ2aWNlLXJvbGUnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19