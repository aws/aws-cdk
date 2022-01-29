import { Template } from '@aws-cdk/assertions';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as cpactions from '../../lib';

describe('ecs deploy action', () => {
  describe('ECS deploy Action', () => {
    test('throws an exception if neither inputArtifact nor imageFile were provided', () => {
      const service = anyEcsService();

      expect(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
        });
      }).toThrow(/one of 'input' or 'imageFile' is required/);


    });

    test('can be created just by specifying the inputArtifact', () => {
      const service = anyEcsService();
      const artifact = new codepipeline.Artifact('Artifact');

      expect(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
          input: artifact,
        });
      }).not.toThrow();


    });

    test('can be created just by specifying the imageFile', () => {
      const service = anyEcsService();
      const artifact = new codepipeline.Artifact('Artifact');

      expect(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
          imageFile: artifact.atPath('imageFile.json'),
        });
      }).not.toThrow();


    });

    test('throws an exception if both inputArtifact and imageFile were provided', () => {
      const service = anyEcsService();
      const artifact = new codepipeline.Artifact('Artifact');

      expect(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
          input: artifact,
          imageFile: artifact.atPath('file.json'),
        });
      }).toThrow(/one of 'input' or 'imageFile' can be provided/);


    });

    test('can be created with deploymentTimeout between 1-60 minutes', () => {
      const service = anyEcsService();
      const artifact = new codepipeline.Artifact('Artifact');

      expect(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
          input: artifact,
          deploymentTimeout: cdk.Duration.minutes(30),
        });
      }).not.toThrow();


    });

    test('throws an exception if deploymentTimeout is out of bounds', () => {
      const service = anyEcsService();
      const artifact = new codepipeline.Artifact('Artifact');

      expect(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
          input: artifact,
          deploymentTimeout: cdk.Duration.minutes(61),
        });
      }).toThrow(/timeout must be between 1 and 60 minutes/);

      expect(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
          input: artifact,
          deploymentTimeout: cdk.Duration.minutes(0),
        });
      }).toThrow(/timeout must be between 1 and 60 minutes/);

      expect(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
          input: artifact,
          deploymentTimeout: cdk.Duration.seconds(30),
        });
      }).toThrow(/cannot be converted into a whole number/);


    });

    test("sets the target service as the action's backing resource", () => {
      const service = anyEcsService();
      const artifact = new codepipeline.Artifact('Artifact');

      const action = new cpactions.EcsDeployAction({
        actionName: 'ECS',
        service,
        input: artifact,
      });

      expect(action.actionProperties.resource).toEqual(service);


    });

    test('can be created by existing service', () => {
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'Vpc');
      const service = ecs.FargateService.fromFargateServiceAttributes(stack, 'FargateService', {
        serviceName: 'service-name',
        cluster: ecs.Cluster.fromClusterAttributes(stack, 'Cluster', {
          vpc,
          securityGroups: [],
          clusterName: 'cluster-name',
        }),
      });
      const artifact = new codepipeline.Artifact('Artifact');
      const bucket = new s3.Bucket(stack, 'PipelineBucket', {
        versioned: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });
      const source = new cpactions.S3SourceAction({
        actionName: 'Source',
        output: artifact,
        bucket,
        bucketKey: 'key',
      });
      const action = new cpactions.EcsDeployAction({
        actionName: 'ECS',
        service,
        imageFile: artifact.atPath('imageFile.json'),
      });
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [source],
          },
          {
            stageName: 'Deploy',
            actions: [action],
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        Stages: [
          {},
          {
            Actions: [
              {
                Name: 'ECS',
                ActionTypeId: {
                  Category: 'Deploy',
                  Provider: 'ECS',
                },
                Configuration: {
                  ClusterName: 'cluster-name',
                  ServiceName: 'service-name',
                  FileName: 'imageFile.json',
                },
              },
            ],
          },
        ],
      });


    });

    test('can be created by existing service with cluster ARN format', () => {
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'PipelineStack', {
        env: {
          region: 'pipeline-region', account: 'pipeline-account',
        },
      });
      const clusterName = 'cluster-name';
      const serviceName = 'service-name';
      const region = 'service-region';
      const account = 'service-account';
      const serviceArn = `arn:aws:ecs:${region}:${account}:service/${clusterName}/${serviceName}`;
      const service = ecs.BaseService.fromServiceArnWithCluster(stack, 'FargateService', serviceArn);

      const artifact = new codepipeline.Artifact('Artifact');
      const bucket = new s3.Bucket(stack, 'PipelineBucket', {
        versioned: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });
      const source = new cpactions.S3SourceAction({
        actionName: 'Source',
        output: artifact,
        bucket,
        bucketKey: 'key',
      });
      const action = new cpactions.EcsDeployAction({
        actionName: 'ECS',
        service: service,
        input: artifact,
      });
      new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
          {
            stageName: 'Source',
            actions: [source],
          },
          {
            stageName: 'Deploy',
            actions: [action],
          },
        ],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        Stages: [
          {},
          {
            Actions: [
              {
                Name: 'ECS',
                ActionTypeId: {
                  Category: 'Deploy',
                  Provider: 'ECS',
                },
                Configuration: {
                  ClusterName: clusterName,
                  ServiceName: serviceName,
                },
                Region: region,
                RoleArn: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      `:iam::${account}:role/pipelinestack-support-serloyecsactionrole49867f847238c85af7c0`,
                    ],
                  ],
                },
              },
            ],
          },
        ],
      });
    });
  });
});

function anyEcsService(): ecs.FargateService {
  const stack = new cdk.Stack();
  const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDefinition');
  taskDefinition.addContainer('MainContainer', {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  });
  const vpc = new ec2.Vpc(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', {
    vpc,
  });
  return new ecs.FargateService(stack, 'FargateService', {
    cluster,
    taskDefinition,
  });
}
