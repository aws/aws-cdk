import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as cpactions from '../../lib';

export = {
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

    "sets the target service as the action's backing resource"(test: Test) {
      const service = anyEcsService();
      const artifact = new codepipeline.Artifact('Artifact');

      const action = new cpactions.EcsDeployAction({
        actionName: 'ECS',
        service,
        input: artifact
      });

      test.equal(action.actionProperties.resource, service);

      test.done();
    },
  },
};

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
