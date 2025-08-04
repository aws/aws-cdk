import { Template, Match } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as iam from '../../aws-iam';
import * as lambda from '../../aws-lambda';
import * as cdk from '../../core';
import { App, Stack } from '../../core';
import * as ecs from '../lib';

describe('DeploymentLifecycleHookTarget', () => {
  let stack: cdk.Stack;
  let vpc: ec2.Vpc;
  let cluster: ecs.Cluster;
  let taskDefinition: ecs.FargateTaskDefinition;
  let lambdaFunction: lambda.Function;

  beforeEach(() => {
    stack = new cdk.Stack();
    vpc = new ec2.Vpc(stack, 'Vpc');
    cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
    taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      portMappings: [{ containerPort: 80 }],
    });

    lambdaFunction = new lambda.Function(stack, 'TestFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => { return { hookStatus: "SUCCEEDED" }; }'),
    });
  });

  test('DeploymentLifecycleLambdaTarget creates default role when none provided', () => {
    // GIVEN
    const service = new ecs.FargateService(stack, 'FargateService', {
      cluster,
      taskDefinition,
    });

    // WHEN
    const hookTarget = new ecs.DeploymentLifecycleLambdaTarget(lambdaFunction, 'PreScaleUpHook', {
      lifecycleStages: [ecs.DeploymentLifecycleStage.PRE_SCALE_UP],
    });
    service.addLifecycleHook(hookTarget);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'ecs.amazonaws.com',
            },
          },
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'lambda:InvokeFunction',
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  Match.stringLikeRegexp('TestFunction'),
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        Match.stringLikeRegexp('TestFunction'),
                        'Arn',
                      ],
                    },
                    ':*',
                  ],
                ],
              },
            ],
          },
        ],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DeploymentConfiguration: {
        LifecycleHooks: [
          {
            LifecycleStages: ['PRE_SCALE_UP'],
            HookTargetArn: {
              'Fn::GetAtt': [
                Match.stringLikeRegexp('TestFunction'),
                'Arn',
              ],
            },
            RoleArn: {
              'Fn::GetAtt': [
                Match.stringLikeRegexp('Role'),
                'Arn',
              ],
            },
          },
        ],
      },
    });
  });

  test('DeploymentLifecycleLambdaTarget uses provided role', () => {
    // GIVEN
    const service = new ecs.FargateService(stack, 'FargateService', {
      cluster,
      taskDefinition,
    });

    const customRole = new iam.Role(stack, 'CustomRole', {
      assumedBy: new iam.ServicePrincipal('ecs.amazonaws.com'),
    });
    lambdaFunction.grantInvoke(customRole);

    // WHEN
    const hookTarget = new ecs.DeploymentLifecycleLambdaTarget(lambdaFunction, 'PreScaleUpHook', {
      lifecycleStages: [ecs.DeploymentLifecycleStage.PRE_SCALE_UP],
      role: customRole,
    });
    service.addLifecycleHook(hookTarget);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DeploymentConfiguration: {
        LifecycleHooks: [
          {
            LifecycleStages: ['PRE_SCALE_UP'],
            HookTargetArn: {
              'Fn::GetAtt': [
                Match.stringLikeRegexp('TestFunction'),
                'Arn',
              ],
            },
            RoleArn: {
              'Fn::GetAtt': [
                Match.stringLikeRegexp('CustomRole'),
                'Arn',
              ],
            },
          },
        ],
      },
    });
  });

  test('DeploymentLifecycleLambdaTarget supports multiple lifecycle stages', () => {
    // GIVEN
    const service = new ecs.FargateService(stack, 'FargateService', {
      cluster,
      taskDefinition,
    });

    // WHEN
    const hookTarget = new ecs.DeploymentLifecycleLambdaTarget(lambdaFunction, 'PreScaleUpHook', {
      lifecycleStages: [
        ecs.DeploymentLifecycleStage.PRE_SCALE_UP,
        ecs.DeploymentLifecycleStage.POST_SCALE_UP,
        ecs.DeploymentLifecycleStage.TEST_TRAFFIC_SHIFT,
      ],
    });
    service.addLifecycleHook(hookTarget);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DeploymentConfiguration: {
        LifecycleHooks: [
          {
            LifecycleStages: ['PRE_SCALE_UP', 'POST_SCALE_UP', 'TEST_TRAFFIC_SHIFT'],
            HookTargetArn: {
              'Fn::GetAtt': [
                Match.stringLikeRegexp('TestFunction'),
                'Arn',
              ],
            },
          },
        ],
      },
    });
  });

  test('addLifecycleHook throws when not using ECS deployment controller', () => {
    // GIVEN
    const service = new ecs.FargateService(stack, 'FargateService', {
      cluster,
      taskDefinition,
      deploymentController: {
        type: ecs.DeploymentControllerType.CODE_DEPLOY,
      },
    });

    const hookTarget = new ecs.DeploymentLifecycleLambdaTarget(lambdaFunction, 'PreScaleUpHook', {
      lifecycleStages: [ecs.DeploymentLifecycleStage.PRE_SCALE_UP],
    });

    // THEN
    expect(() => {
      service.addLifecycleHook(hookTarget);
    }).toThrow(/Deployment lifecycle hooks requires the ECS deployment controller/);
  });

  test('multiple lifecycle hooks can be added to a service', () => {
    // GIVEN
    const service = new ecs.FargateService(stack, 'FargateService', {
      cluster,
      taskDefinition,
    });

    const secondLambda = new lambda.Function(stack, 'SecondFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => { return { hookStatus: "SUCCEEDED" }; }'),
    });

    // WHEN
    const firstHook = new ecs.DeploymentLifecycleLambdaTarget(lambdaFunction, 'PreScaleUpHook', {
      lifecycleStages: [ecs.DeploymentLifecycleStage.PRE_SCALE_UP],
    });

    const secondHook = new ecs.DeploymentLifecycleLambdaTarget(secondLambda, 'PostScaleUpHook', {
      lifecycleStages: [ecs.DeploymentLifecycleStage.POST_SCALE_UP],
    });

    service.addLifecycleHook(firstHook);
    service.addLifecycleHook(secondHook);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ECS::Service', {
      DeploymentConfiguration: {
        LifecycleHooks: Match.arrayWith([
          Match.objectLike({
            LifecycleStages: ['PRE_SCALE_UP'],
            HookTargetArn: {
              'Fn::GetAtt': [
                Match.stringLikeRegexp('TestFunction'),
                'Arn',
              ],
            },
          }),
          Match.objectLike({
            LifecycleStages: ['POST_SCALE_UP'],
            HookTargetArn: {
              'Fn::GetAtt': [
                Match.stringLikeRegexp('SecondFunction'),
                'Arn',
              ],
            },
          }),
        ]),
      },
    });
  });

  test('lifecycle hooks cannot be added during service creation with non-ECS deployment controller', () => {
    // GIVEN
    const hookTarget = new ecs.DeploymentLifecycleLambdaTarget(lambdaFunction, 'PreScaleUpHook', {
      lifecycleStages: [ecs.DeploymentLifecycleStage.PRE_SCALE_UP],
    });

    // THEN
    expect(() => {
      const service = new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
        deploymentController: {
          type: ecs.DeploymentControllerType.CODE_DEPLOY,
        },
      });
      service.addLifecycleHook(hookTarget);
    }).toThrow(/Deployment lifecycle hooks requires the ECS deployment controller/);
  });
});
