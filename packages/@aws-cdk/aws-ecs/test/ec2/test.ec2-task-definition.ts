import { expect, haveResource } from '@aws-cdk/assert';
import { Protocol } from '@aws-cdk/aws-ec2';
// import iam = require('@aws-cdk/aws-iam'); // importing this is throwing a really weird error in line 11?
import cdk = require('@aws-cdk/cdk');
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
        PlacementConstraints: [],
        Volumes: [],
        NetworkMode: ecs.NetworkMode.Bridge,
        RequiresCompatibilities: [ecs.Compatibilities.Ec2]
      }));

      // test error if no container defs?
      test.done();
    },

    "correctly sets network mode"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
        networkMode: ecs.NetworkMode.AwsVpc
      });

      // THEN
      expect(stack).to(haveResource("AWS::ECS::TaskDefinition", {
        NetworkMode: ecs.NetworkMode.AwsVpc,
      }));

      test.done();
    },

    "correctly sets containers"(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();

      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef');

      const container = taskDefinition.addContainer("web", {
        image: ecs.DockerHub.image("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512 // add validation?
      });

      // TODO test other containerDefinition methods
      container.addPortMappings({
        containerPort: 3000
      });

      container.addUlimits({
        hardLimit: 128,
        name: ecs.UlimitName.Rss,
        softLimit: 128
      });

      // THEN
      expect(stack).to(haveResource("AWS::ECS::TaskDefinition", {
        Family: "Ec2TaskDef",
        ContainerDefinitions: [{
          Essential: true,
          Memory: 512,
          Image: "amazon/amazon-ecs-sample",
          Links: [],
          LinuxParameters: {
            Capabilities: {
              Add: [],
              Drop: []
            },
            Devices: [],
            Tmpfs: []
          },
          MountPoints: [],
          Name: "web",
          PortMappings: [{
            ContainerPort: 3000,
            HostPort: 0,
            Protocol: Protocol.Tcp
          }],
          Ulimits: [{
            HardLimit: 128,
            Name: "rss",
            SoftLimit: 128
          }],
          VolumesFrom: []
        }],
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
        image: ecs.DockerHub.image("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512
      });

      // this needs to be a better API -- should auto-add volumes
      container.addMountPoints({
        containerPath: "./cache",
        readOnly: true,
        sourceVolume: "scratch",
      });

      // THEN
      expect(stack).to(haveResource("AWS::ECS::TaskDefinition", {
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
        placementConstraints: [{
          expression: "attribute:ecs.instance-type =~ t2.*",
          type: ecs.PlacementConstraintType.MemberOf
        }]
      });

      taskDefinition.addContainer("web", {
        memoryLimitMiB: 1024,
        image: ecs.DockerHub.image("amazon/amazon-ecs-sample")
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

    // "correctly sets taskRole"(test: Test) {
    //   // GIVEN
    //   const stack = new cdk.Stack();
    //   const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {
    //     taskRole: new iam.Role(this, 'TaskRole', {
    //       assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    //     })
    //   });

    //   taskDefinition.addContainer("web", {
    //     image: ecs.DockerHub.image("amazon/amazon-ecs-sample"),
    //     memoryLimitMiB: 512
    //   });

    //   // THEN
    //   expect(stack).to(haveResource("AWS::ECS::TaskDefinition", {
    //     TaskRole: "roleArn"
    //   }));

    //   test.done();
    // },

    // "correctly sets taskExecutionRole if containerDef uses ECR"(test: Test) {
    //   // GIVEN
    //   const stack = new cdk.Stack();
    //   const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'Ec2TaskDef', {});
    //   const container = taskDefinition.addContainer("web", {
    //     image: ecs.DockerHub.image("amazon/amazon-ecs-sample"),
    //     memoryLimitMiB: 512 // add validation?
    //   });

    //   container.useEcrImage();

    //   // THEN
    //   expect(stack).to(haveResource("AWS::ECS::TaskDefinition", {
    //     TaskExecutionRole: "roleArn"
    //   }));

    //   test.done();
    // },
  }
};
