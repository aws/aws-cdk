import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import * as codedeploy from '../../lib';

describe('CodeDeploy ECS AppSpec', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('cannot create with undefined list of targetServices', () => {
    expect(() => {
      new codedeploy.EcsAppSpec();
    }).toThrow('targetServices must have a length of 1');
  });

  test('cannot create with list of 2 targetServices', () => {
    expect(() => {
      new codedeploy.EcsAppSpec({
        taskDefinition: {} as ecs.ITaskDefinition,
        containerName: 'foo',
        containerPort: 80,
      }, {
        taskDefinition: {} as ecs.ITaskDefinition,
        containerName: 'bar',
        containerPort: 81,
      });
    }).toThrow('targetServices must have a length of 1');
  });

  test('can create without network configuration', () => {
    const arn = 'taskdefarn';
    const taskDefinition = ecs.FargateTaskDefinition.fromFargateTaskDefinitionArn(stack, 'taskdef', arn);
    const appspec = new codedeploy.EcsAppSpec({
      taskDefinition: taskDefinition,
      containerName: 'foo',
      containerPort: 80,
    });
    const appspecJson = JSON.parse(appspec.toString());
    expect(appspecJson).toEqual({
      version: '0.0',
      Resources: [{
        TargetService: {
          Type: 'AWS::ECS::Service',
          Properties: {
            TaskDefinition: arn,
            LoadBalancerInfo: {
              ContainerName: 'foo',
              ContainerPort: 80,
            },
          },
        },
      }],
    });
  });

  test('can create with all configuration', () => {
    const arn = 'taskdefarn';
    const vpc = ec2.Vpc.fromVpcAttributes(stack, 'vpc', {
      vpcId: 'vpc-0000',
      availabilityZones: ['us-west-2a', 'us-west2b'],
    });
    const sg = ec2.SecurityGroup.fromSecurityGroupId(stack, 'sg', 'sg-00000000');
    const taskDefinition = ecs.FargateTaskDefinition.fromFargateTaskDefinitionArn(stack, 'taskdef', arn);
    const appspec = new codedeploy.EcsAppSpec({
      taskDefinition: taskDefinition,
      containerName: 'foo',
      containerPort: 80,
      platformVersion: ecs.FargatePlatformVersion.VERSION1_3,
      awsvpcConfiguration: {
        vpc,
        vpcSubnets: vpc.selectSubnets({
          subnets: [
            ec2.Subnet.fromSubnetAttributes(stack, 'subnet', {
              subnetId: 'subnet-11111111',
              availabilityZone: 'us-west-2a',
            }),
          ],
        }),
        securityGroups: [sg],
        assignPublicIp: true,
      },
      capacityProviderStrategy: [
        {
          capacityProvider: 'fargate',
          base: 2,
          weight: 4,
        },
        {
          capacityProvider: 'ec2',
          base: 3,
          weight: 5,
        },
      ],
    });
    const appspecJson = JSON.parse(appspec.toString());
    expect(appspecJson).toEqual({
      version: '0.0',
      Resources: [{
        TargetService: {
          Type: 'AWS::ECS::Service',
          Properties: {
            TaskDefinition: arn,
            LoadBalancerInfo: {
              ContainerName: 'foo',
              ContainerPort: 80,
            },
            PlatformVersion: '1.3.0',
            NetworkConfiguration: {
              awsvpcConfiguration: {
                assignPublicIp: 'ENABLED',
                subnets: ['subnet-11111111'],
                securityGroups: ['sg-00000000'],
              },
            },
            CapacityProviderStrategy: [
              {
                Base: 2,
                Weight: 4,
                CapacityProvider: 'fargate',
              },
              {
                Base: 3,
                Weight: 5,
                CapacityProvider: 'ec2',
              },
            ],
          },
        },
      }],
    });
  });
});
