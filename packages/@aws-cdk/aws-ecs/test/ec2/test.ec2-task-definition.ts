import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import { Protocol } from '@aws-cdk/aws-ec2';
import { Repository } from '@aws-cdk/aws-ecr';
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import ecs = require('../../lib');

export = {
  "When creating an ECS TaskDefinition": {
    "with only required properties set, it correctly sets default properties"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      // THEN
      expect(stack).to(haveResource("AWS::ECS::TaskDefinition", {
        Family: "Ec2TaskDef",
        ContainerDefinitions: [],
        Volumes: [],
        NetworkMode: ecs.NetworkMode.BRIDGE,
        RequiresCompatibilities: ["EC2"]
      }));

      // test error if no container defs?
      test.done();
    },

    "correctly sets network mode"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        networkMode: ecs.NetworkMode.AWS_VPC
      });

      // THEN
      expect(stack).to(haveResource("AWS::ECS::TaskDefinition", {
        NetworkMode: ecs.NetworkMode.AWS_VPC,
      }));

      test.done();
    },

    "correctly sets containers"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      const container = taskDefinition.addContainer("web", {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512 // add validation?
      });

      container.addPortMappings({
        containerPort: 3000
      });

      container.addUlimits({
        hardLimit: 128,
        name: ecs.UlimitName.RSS,
        softLimit: 128
      });

      container.addVolumesFrom({
        sourceContainer: "foo",
        readOnly: true
      });

      container.addToExecutionPolicy(new iam.PolicyStatement({
        resources: ['*'],
        actions: ['ecs:*'],
      }));

      // THEN
      expect(stack).to(haveResource("AWS::ECS::TaskDefinition", {
        Family: "Ec2TaskDef",
        ContainerDefinitions: [{
          Essential: true,
          Memory: 512,
          Image: "amazon/amazon-ecs-sample",
          Name: "web",
          PortMappings: [{
            ContainerPort: 3000,
            HostPort: 0,
            Protocol: Protocol.TCP
          }],
          Ulimits: [
            {
              HardLimit: 128,
              Name: "rss",
              SoftLimit: 128
            }
          ],
          VolumesFrom: [
            {
              ReadOnly: true,
              SourceContainer: "foo"
            }
          ]
        }],
      }));

      expect(stack).to(haveResource('AWS::IAM::Policy', {
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: "ecs:*",
              Effect: "Allow",
              Resource: "*"
            }
          ],
        },
      }));

      test.done();
    },

    "correctly sets containers from ECR repository"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      taskDefinition.addContainer("web", {
        image: ecs.ContainerImage.fromEcrRepository(new Repository(stack, "myECRImage")),
        memoryLimitMiB: 512
      });

      // THEN
      expect(stack).to(haveResource("AWS::ECS::TaskDefinition", {
        Family: "Ec2TaskDef",
        ContainerDefinitions: [{
          Essential: true,
          Memory: 512,
          Image: {
            "Fn::Join": [
              "",
              [
                {
                  "Fn::Select": [
                    4,
                    {
                      "Fn::Split": [
                        ":",
                        {
                          "Fn::GetAtt": [
                            "myECRImage7DEAE474",
                            "Arn"
                          ]
                        }
                      ]
                    }
                  ]
                },
                ".dkr.ecr.",
                {
                  "Fn::Select": [
                    3,
                    {
                      "Fn::Split": [
                        ":",
                        {
                          "Fn::GetAtt": [
                            "myECRImage7DEAE474",
                            "Arn"
                          ]
                        }
                      ]
                    }
                  ]
                },
                ".",
                {
                  Ref: "AWS::URLSuffix"
                },
                "/",
                {
                  Ref: "myECRImage7DEAE474"
                },
                ":latest"
              ]
            ]
          },
          Name: "web"
        }],
      }));

      test.done();
    },

    "correctly sets scratch space"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      const container = taskDefinition.addContainer("web", {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512
      });

      container.addScratch({
        containerPath: "./cache",
        readOnly: true,
        sourcePath: "/tmp/cache",
        name: "scratch"
      });

      // THEN
      expect(stack).to(haveResourceLike("AWS::ECS::TaskDefinition", {
        Family: "Ec2TaskDef",
        ContainerDefinitions: [{
          MountPoints: [
            {
              ContainerPath: "./cache",
              ReadOnly: true,
              SourceVolume: "scratch"
            }
          ]
        }],
        Volumes: [{
          Host: {
            SourcePath: "/tmp/cache"
          },
          Name: "scratch"
        }]
      }));

      test.done();
    },
    "correctly sets container dependenices"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      const dependency1 = taskDefinition.addContainer('dependency1', {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512
      });

      const dependency2 = taskDefinition.addContainer('dependency2', {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512
      });

      const container = taskDefinition.addContainer("web", {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512
      });

      container.addContainerDependencies({
        container: dependency1
      },
      {
        container: dependency2,
        condition: ecs.ContainerDependencyCondition.SUCCESS
      }
      );

      // THEN
      expect(stack).to(haveResourceLike("AWS::ECS::TaskDefinition", {
        Family: "Ec2TaskDef",
        ContainerDefinitions: [{
          Name: "dependency1"
        },
        {
          Name: "dependency2"
        },
        {
          Name: "web",
          DependsOn: [{
              Condition: "HEALTHY",
              ContainerName: "dependency1"
            },
            {
              Condition: "SUCCESS",
              ContainerName: "dependency2"
            }]
        }]
      }));

      test.done();
    },
    "correctly sets links"(test: Test) {
      const stack = new cdk.Stack();

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        networkMode: ecs.NetworkMode.BRIDGE
      });

      const container = taskDefinition.addContainer("web", {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512
      });

      const linkedContainer1 = taskDefinition.addContainer("linked1", {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512
      });

      const linkedContainer2 = taskDefinition.addContainer("linked2", {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512
      });

      container.addLink(linkedContainer1, 'linked');
      container.addLink(linkedContainer2);

      // THEN
      expect(stack).to(haveResourceLike("AWS::ECS::TaskDefinition", {
        ContainerDefinitions: [
          {
            Links: [
              'linked1:linked',
              'linked2'
            ],
            Name: "web"
          },
          {
            Name: 'linked1'
          },
          {
            Name: 'linked2'
          }
        ]
      }));

      test.done();
    },

    "correctly set policy statement to the task IAM role"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      // WHEN
      taskDefinition.addToTaskRolePolicy(new iam.PolicyStatement({
        actions: ['test:SpecialName'],
        resources: ['*']
      }));

      // THEN
      expect(stack).to(haveResource('AWS::IAM::Policy', {
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: "test:SpecialName",
              Effect: "Allow",
              Resource: "*"
            }
          ],
        },
      }));

      test.done();
    },
    "correctly sets volumes from"(test: Test) {
      const stack = new cdk.Stack();

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {});

      const container = taskDefinition.addContainer("web", {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512
      });

      container.addVolumesFrom({
        sourceContainer: "SourceContainer",
        readOnly: true
      });

      // THEN
      expect(stack).to(haveResourceLike("AWS::ECS::TaskDefinition", {
        ContainerDefinitions: [{
          VolumesFrom: [
            {
              SourceContainer: "SourceContainer",
              ReadOnly: true,
            }
          ]
        }]
      }));

      test.done();
    },

    "correctly set policy statement to the task execution IAM role"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      // WHEN
      taskDefinition.addToExecutionRolePolicy(new iam.PolicyStatement({
        actions: ['test:SpecialName'],
        resources: ['*']
      }));

      // THEN
      expect(stack).to(haveResource('AWS::IAM::Policy', {
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: [
            {
              Action: "test:SpecialName",
              Effect: "Allow",
              Resource: "*"
            }
          ],
        },
      }));

      test.done();
    },

    "correctly sets volumes"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const volume = {
        host: {
          sourcePath: "/tmp/cache",
        },
        name: "scratch"
      };

      // Adding volumes via props is a bit clunky
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        volumes: [volume]
      });

      const container = taskDefinition.addContainer("web", {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512
      });

      // this needs to be a better API -- should auto-add volumes
      container.addMountPoints({
        containerPath: "./cache",
        readOnly: true,
        sourceVolume: "scratch",
      });

      // THEN
      expect(stack).to(haveResourceLike("AWS::ECS::TaskDefinition", {
        Family: "Ec2TaskDef",
        ContainerDefinitions: [{
          MountPoints: [
            {
              ContainerPath: "./cache",
              ReadOnly: true,
              SourceVolume: "scratch"
            }
          ]
        }],
        Volumes: [{
          Host: {
            SourcePath: "/tmp/cache"
          },
          Name: "scratch"
        }]
      }));

      test.done();
    },

    "correctly sets placement constraints"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        placementConstraints: [
          ecs.PlacementConstraint.memberOf("attribute:ecs.instance-type =~ t2.*"),
        ]
      });

      taskDefinition.addContainer("web", {
        memoryLimitMiB: 1024,
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample")
      });

      // THEN
      expect(stack).to(haveResource("AWS::ECS::TaskDefinition", {
        PlacementConstraints: [
          {
            Expression: "attribute:ecs.instance-type =~ t2.*",
            Type: "memberOf"
          }
        ]
      }));

      test.done();
    },

    "correctly sets taskRole"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        taskRole: new iam.Role(stack, 'TaskRole', {
          assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
        })
      });

      taskDefinition.addContainer("web", {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512
      });

      // THEN
      expect(stack).to(haveResourceLike("AWS::ECS::TaskDefinition", {
        TaskRoleArn: stack.resolve(taskDefinition.taskRole.roleArn)
      }));

      test.done();
    },

    "correctly sets dockerVolumeConfiguration"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const volume = {
        name: "scratch",
        dockerVolumeConfiguration: {
          driver: "local",
          scope: ecs.Scope.TASK
        }
      };

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        volumes: [volume]
      });

      taskDefinition.addContainer("web", {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512
      });

      // THEN
      expect(stack).to(haveResourceLike("AWS::ECS::TaskDefinition", {
        Family: "Ec2TaskDef",
        Volumes: [{
          Name: "scratch",
          DockerVolumeConfiguration: {
            Driver: "local",
            Scope: 'task'
          }
        }]
      }));

      test.done();
    },

  }
};
