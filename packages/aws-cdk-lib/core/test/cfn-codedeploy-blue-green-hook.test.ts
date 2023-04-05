import { toCloudFormation } from './util';
import { CfnCodeDeployBlueGreenHook, CfnTrafficRoutingType, Stack } from '../lib';

describe('CodeDeploy blue-green deployment Hook', () => {
  test('only renders the provided properties', () => {
    const stack = new Stack();
    new CfnCodeDeployBlueGreenHook(stack, 'MyHook', {
      trafficRoutingConfig: {
        type: CfnTrafficRoutingType.TIME_BASED_LINEAR,
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

    const template = toCloudFormation(stack);
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
