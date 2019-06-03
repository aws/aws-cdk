import '@aws-cdk/assert/jest';
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import events = require('@aws-cdk/aws-events');
import cdk = require('@aws-cdk/cdk');
import targets = require('../../lib');

test("Can use EC2 taskdef as EventRule target", () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAZs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
  cluster.addCapacity('DefaultAutoScalingGroup', {
    instanceType: new ec2.InstanceType('t2.micro')
  });

  const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
  taskDefinition.addContainer('TheContainer', {
    image: ecs.ContainerImage.fromRegistry('henk'),
    memoryLimitMiB: 256
  });

  const rule = new events.Rule(stack, 'Rule', {
    scheduleExpression: 'rate(1 minute)',
  });

  // WHEN
  rule.addTarget(new targets.EcsTask({
    cluster,
    taskDefinition,
    taskCount: 1,
    containerOverrides: [{
      containerName: 'TheContainer',
      command: ['echo', events.EventField.fromPath('$.detail.event')],
    }]
  }));

  // THEN
  expect(stack).toHaveResourceLike('AWS::Events::Rule', {
    Targets: [
      {
        Arn: { "Fn::GetAtt": ["EcsCluster97242B84", "Arn"] },
        EcsParameters: {
          TaskCount: 1,
          TaskDefinitionArn: { Ref: "TaskDef54694570" }
        },
        InputTransformer: {
          InputPathsMap: {
            f1: "$.detail.event"
          },
          InputTemplate: "{\"containerOverrides\":[{\"name\":\"TheContainer\",\"command\":[\"echo\",<f1>]}]}"
        },
        RoleArn: { "Fn::GetAtt": ["TaskDefEventsRoleFB3B67B8", "Arn"] }
      }
    ]
  });
});

test("Can use Fargate taskdef as EventRule target", () => {
  // GIVEN
  const stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Vpc', { maxAZs: 1 });
  const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

  const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
  taskDefinition.addContainer('TheContainer', {
    image: ecs.ContainerImage.fromRegistry('henk'),
  });

  const rule = new events.Rule(stack, 'Rule', {
    scheduleExpression: 'rate(1 minute)',
  });

  // WHEN
  rule.addTarget(new targets.EcsTask({
    cluster,
    taskDefinition,
    taskCount: 1,
    containerOverrides: [{
      containerName: 'TheContainer',
      command: ['echo', events.EventField.fromPath('$.detail.event')],
    }]
  }));

  // THEN
  expect(stack).toHaveResourceLike('Custom::AWS', {
    Update: {
      service: "CloudWatchEvents",
      apiVersion: "2015-10-07",
      action: "putTargets",
      parameters: {
        Rule: {
          "Fn::Select": [
            1,
            {
              "Fn::Split": [
                "/",
                {
                  "Fn::Select": [
                    5,
                    {
                      "Fn::Split": [
                        ":",
                        {
                          "Fn::GetAtt": [
                            "Rule4C995B7F",
                            "Arn"
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        Targets: [
          {
            Arn: {
              "Fn::GetAtt": [
                "EcsCluster97242B84",
                "Arn"
              ]
            },
            Id: "TaskDef-on-EcsCluster",
            EcsParameters: {
              TaskDefinitionArn: {
                Ref: "TaskDef54694570"
              },
              LaunchType: "FARGATE",
              NetworkConfiguration: {
                awsvpcConfiguration: {
                  Subnets: [
                    {
                      Ref: "VpcPrivateSubnet1Subnet536B997A"
                    }
                  ],
                  AssignPublicIp: "DISABLED",
                  SecurityGroups: [
                    {
                      "Fn::GetAtt": [
                        "TaskDefSecurityGroupD50E7CF0",
                        "GroupId"
                      ]
                    }
                  ]
                }
              },
              TaskCount: 1
            },
            Input: "{\"containerOverrides\":[{\"name\":\"TheContainer\",\"command\":[\"echo\",\"$.detail.event\"]}]}",
            RoleArn: {
              "Fn::GetAtt": [
                "TaskDefEventsRoleFB3B67B8",
                "Arn"
              ]
            }
          }
        ]
      },
      physicalResourceId: "TaskDef-on-EcsCluster"
    }
  });
});
