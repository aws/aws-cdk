import { expect, haveResourceLike } from '@aws-cdk/assert-internal';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as cpactions from '../../lib';

nodeunitShim({
  'ECS deploy Action': {
    'throws an exception if neither inputArtifact nor imageFile were provided'(test: Test) {
      const service = anyEcsService();

      test.throws(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
        });
      }, /one of 'input' or 'imageFile' is required/);

      test.done();
    },

    'can be created just by specifying the inputArtifact'(test: Test) {
      const service = anyEcsService();
      const artifact = new codepipeline.Artifact('Artifact');

      test.doesNotThrow(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
          input: artifact,
        });
      });

      test.done();
    },

    'can be created just by specifying the imageFile'(test: Test) {
      const service = anyEcsService();
      const artifact = new codepipeline.Artifact('Artifact');

      test.doesNotThrow(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
          imageFile: artifact.atPath('imageFile.json'),
        });
      });

      test.done();
    },

    'throws an exception if both inputArtifact and imageFile were provided'(test: Test) {
      const service = anyEcsService();
      const artifact = new codepipeline.Artifact('Artifact');

      test.throws(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
          input: artifact,
          imageFile: artifact.atPath('file.json'),
        });
      }, /one of 'input' or 'imageFile' can be provided/);

      test.done();
    },

    'can be created with deploymentTimeout between 1-60 minutes'(test: Test) {
      const service = anyEcsService();
      const artifact = new codepipeline.Artifact('Artifact');

      test.doesNotThrow(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
          input: artifact,
          deploymentTimeout: cdk.Duration.minutes(30),
        });
      });

      test.done();
    },

    'throws an exception if deploymentTimeout is out of bounds'(test: Test) {
      const service = anyEcsService();
      const artifact = new codepipeline.Artifact('Artifact');

      test.throws(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
          input: artifact,
          deploymentTimeout: cdk.Duration.minutes(61),
        });
      }, /timeout must be between 1 and 60 minutes/);

      test.throws(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
          input: artifact,
          deploymentTimeout: cdk.Duration.minutes(0),
        });
      }, /timeout must be between 1 and 60 minutes/);

      test.throws(() => {
        new cpactions.EcsDeployAction({
          actionName: 'ECS',
          service,
          input: artifact,
          deploymentTimeout: cdk.Duration.seconds(30),
        });
      }, /cannot be converted into a whole number/);

      test.done();
    },

    "sets the target service as the action's backing resource"(test: Test) {
      const service = anyEcsService();
      const artifact = new codepipeline.Artifact('Artifact');

      const action = new cpactions.EcsDeployAction({
        actionName: 'ECS',
        service,
        input: artifact,
      });

      test.equal(action.actionProperties.resource, service);

      test.done();
    },

    'can be created by existing service'(test: Test) {
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

      expect(stack).to(haveResourceLike('AWS::CodePipeline::Pipeline', {
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
      }));

      test.done();
    },
  },
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
