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
        const template = util_1.toCloudFormation(stack);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWNvZGVkZXBsb3ktYmx1ZS1ncmVlbi1ob29rLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZm4tY29kZWRlcGxveS1ibHVlLWdyZWVuLWhvb2sudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUEwQztBQUMxQyxnQ0FBa0Y7QUFFbEYsUUFBUSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtJQUNyRCxJQUFJLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO1FBQ2hELE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7UUFDMUIsSUFBSSxnQ0FBMEIsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1lBQzlDLG9CQUFvQixFQUFFO2dCQUNwQixJQUFJLEVBQUUsMkJBQXFCLENBQUMsaUJBQWlCO2dCQUM3QyxlQUFlLEVBQUU7b0JBQ2YsWUFBWSxFQUFFLEVBQUU7aUJBQ2pCO2FBQ0Y7WUFDRCxZQUFZLEVBQUU7Z0JBQ1o7b0JBQ0UsYUFBYSxFQUFFO3dCQUNiLGNBQWMsRUFBRTs0QkFDZCxZQUFZLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxvQkFBb0IsQ0FBQzs0QkFDekQsZ0JBQWdCLEVBQUU7Z0NBQ2hCLFNBQVMsRUFBRSxZQUFZO2dDQUN2QixJQUFJLEVBQUUsdUNBQXVDOzZCQUM5Qzs0QkFDRCxnQkFBZ0IsRUFBRTtnQ0FDaEIsU0FBUyxFQUFFLFlBQVk7Z0NBQ3ZCLElBQUksRUFBRSx1Q0FBdUM7NkJBQzlDO3lCQUNGO3dCQUNELFFBQVEsRUFBRSxDQUFDLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQzt3QkFDN0MsZUFBZSxFQUFFLENBQUMsZUFBZSxFQUFFLGdCQUFnQixDQUFDO3FCQUNyRDtvQkFDRCxNQUFNLEVBQUU7d0JBQ04sU0FBUyxFQUFFLFdBQVc7d0JBQ3RCLElBQUksRUFBRSxtQkFBbUI7cUJBQzFCO2lCQUNGO2FBQ0Y7WUFDRCxXQUFXLEVBQUUsaUJBQWlCO1NBQy9CLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHLHVCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxhQUFhLENBQUM7WUFDN0IsS0FBSyxFQUFFO2dCQUNMLE1BQU0sRUFBRTtvQkFDTixJQUFJLEVBQUUsNEJBQTRCO29CQUNsQyxVQUFVLEVBQUU7d0JBQ1YsNENBQTRDO3dCQUM1Qyw4Q0FBOEM7d0JBQzlDLG9CQUFvQixFQUFFOzRCQUNwQiwwQ0FBMEM7NEJBQzFDLElBQUksRUFBRSxpQkFBaUI7NEJBQ3ZCLGVBQWUsRUFBRTtnQ0FDZixZQUFZLEVBQUUsRUFBRTs2QkFDakI7eUJBQ0Y7d0JBQ0QsWUFBWSxFQUFFOzRCQUNaO2dDQUNFLGFBQWEsRUFBRTtvQ0FDYixlQUFlLEVBQUU7d0NBQ2YsZUFBZTt3Q0FDZixnQkFBZ0I7cUNBQ2pCO29DQUNELFFBQVEsRUFBRTt3Q0FDUixlQUFlO3dDQUNmLGdCQUFnQjtxQ0FDakI7b0NBQ0QsY0FBYyxFQUFFO3dDQUNkLFlBQVksRUFBRTs0Q0FDWixtQkFBbUI7NENBQ25CLG9CQUFvQjt5Q0FDckI7d0NBQ0QsZ0JBQWdCLEVBQUU7NENBQ2hCLFNBQVMsRUFBRSxZQUFZOzRDQUN2QixJQUFJLEVBQUUsdUNBQXVDO3lDQUM5Qzt3Q0FDRCxnQkFBZ0IsRUFBRTs0Q0FDaEIsU0FBUyxFQUFFLFlBQVk7NENBQ3ZCLElBQUksRUFBRSx1Q0FBdUM7eUNBQzlDO3FDQUNGO2lDQUNGO2dDQUNELE1BQU0sRUFBRTtvQ0FDTixTQUFTLEVBQUUsV0FBVztvQ0FDdEIsSUFBSSxFQUFFLG1CQUFtQjtpQ0FDMUI7NkJBQ0Y7eUJBQ0Y7d0JBQ0QsV0FBVyxFQUFFLGlCQUFpQjtxQkFDL0I7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0b0Nsb3VkRm9ybWF0aW9uIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IENmbkNvZGVEZXBsb3lCbHVlR3JlZW5Ib29rLCBDZm5UcmFmZmljUm91dGluZ1R5cGUsIFN0YWNrIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ0NvZGVEZXBsb3kgYmx1ZS1ncmVlbiBkZXBsb3ltZW50IEhvb2snLCAoKSA9PiB7XG4gIHRlc3QoJ29ubHkgcmVuZGVycyB0aGUgcHJvdmlkZWQgcHJvcGVydGllcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIG5ldyBDZm5Db2RlRGVwbG95Qmx1ZUdyZWVuSG9vayhzdGFjaywgJ015SG9vaycsIHtcbiAgICAgIHRyYWZmaWNSb3V0aW5nQ29uZmlnOiB7XG4gICAgICAgIHR5cGU6IENmblRyYWZmaWNSb3V0aW5nVHlwZS5USU1FX0JBU0VEX0xJTkVBUixcbiAgICAgICAgdGltZUJhc2VkTGluZWFyOiB7XG4gICAgICAgICAgYmFrZVRpbWVNaW5zOiAxNSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBhcHBsaWNhdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGVjc0F0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIHRyYWZmaWNSb3V0aW5nOiB7XG4gICAgICAgICAgICAgIHRhcmdldEdyb3VwczogWydibHVlLXRhcmdldC1ncm91cCcsICdncmVlbi10YXJnZXQtZ3JvdXAnXSxcbiAgICAgICAgICAgICAgdGVzdFRyYWZmaWNSb3V0ZToge1xuICAgICAgICAgICAgICAgIGxvZ2ljYWxJZDogJ2xvZ2ljYWxJZDEnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgcHJvZFRyYWZmaWNSb3V0ZToge1xuICAgICAgICAgICAgICAgIGxvZ2ljYWxJZDogJ2xvZ2ljYWxJZDInLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdBV1M6OkVsYXN0aWNMb2FkQmFsYW5jaW5nVjI6Okxpc3RlbmVyJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0YXNrU2V0czogWydibHVlLXRhc2stc2V0JywgJ2dyZWVuLXRhc2stc2V0J10sXG4gICAgICAgICAgICB0YXNrRGVmaW5pdGlvbnM6IFsnYmx1ZS10YXNrLWRlZicsICdncmVlbi10YXNrLWRlZiddLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdGFyZ2V0OiB7XG4gICAgICAgICAgICBsb2dpY2FsSWQ6ICdsb2dpY2FsSWQnLFxuICAgICAgICAgICAgdHlwZTogJ0FXUzo6RUNTOjpTZXJ2aWNlJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIHNlcnZpY2VSb2xlOiAnbXktc2VydmljZS1yb2xlJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gdG9DbG91ZEZvcm1hdGlvbihzdGFjayk7XG4gICAgZXhwZWN0KHRlbXBsYXRlKS50b1N0cmljdEVxdWFsKHtcbiAgICAgIEhvb2tzOiB7XG4gICAgICAgIE15SG9vazoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OkNvZGVEZXBsb3k6OkJsdWVHcmVlbicsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgLy8gbm8gZW1wdHkgQWRkaXRpb25hbE9wdGlvbnMgb2JqZWN0IHByZXNlbnRcbiAgICAgICAgICAgIC8vIG5vIGVtcHR5IExpZmVjeWNsZUV2ZW50SG9va3Mgb2JqZWN0IHByZXNlbnRcbiAgICAgICAgICAgIFRyYWZmaWNSb3V0aW5nQ29uZmlnOiB7XG4gICAgICAgICAgICAgIC8vIG5vIGVtcHR5IFRpbWVCYXNlZENhbmFyeSBvYmplY3QgcHJlc2VudFxuICAgICAgICAgICAgICBUeXBlOiAnVGltZUJhc2VkTGluZWFyJyxcbiAgICAgICAgICAgICAgVGltZUJhc2VkTGluZWFyOiB7XG4gICAgICAgICAgICAgICAgQmFrZVRpbWVNaW5zOiAxNSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBBcHBsaWNhdGlvbnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEVDU0F0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICAgIFRhc2tEZWZpbml0aW9uczogW1xuICAgICAgICAgICAgICAgICAgICAnYmx1ZS10YXNrLWRlZicsXG4gICAgICAgICAgICAgICAgICAgICdncmVlbi10YXNrLWRlZicsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgVGFza1NldHM6IFtcbiAgICAgICAgICAgICAgICAgICAgJ2JsdWUtdGFzay1zZXQnLFxuICAgICAgICAgICAgICAgICAgICAnZ3JlZW4tdGFzay1zZXQnLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIFRyYWZmaWNSb3V0aW5nOiB7XG4gICAgICAgICAgICAgICAgICAgIFRhcmdldEdyb3VwczogW1xuICAgICAgICAgICAgICAgICAgICAgICdibHVlLXRhcmdldC1ncm91cCcsXG4gICAgICAgICAgICAgICAgICAgICAgJ2dyZWVuLXRhcmdldC1ncm91cCcsXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIFByb2RUcmFmZmljUm91dGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICBMb2dpY2FsSUQ6ICdsb2dpY2FsSWQyJyxcbiAgICAgICAgICAgICAgICAgICAgICBUeXBlOiAnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lcicsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIFRlc3RUcmFmZmljUm91dGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICBMb2dpY2FsSUQ6ICdsb2dpY2FsSWQxJyxcbiAgICAgICAgICAgICAgICAgICAgICBUeXBlOiAnQVdTOjpFbGFzdGljTG9hZEJhbGFuY2luZ1YyOjpMaXN0ZW5lcicsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgVGFyZ2V0OiB7XG4gICAgICAgICAgICAgICAgICBMb2dpY2FsSUQ6ICdsb2dpY2FsSWQnLFxuICAgICAgICAgICAgICAgICAgVHlwZTogJ0FXUzo6RUNTOjpTZXJ2aWNlJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFNlcnZpY2VSb2xlOiAnbXktc2VydmljZS1yb2xlJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==