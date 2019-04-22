import codepipeline = require('@aws-cdk/aws-codepipeline');
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import cpactions = require('../../lib');

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

      const action = new cpactions.EcsDeployAction({
        actionName: 'ECS',
        service,
        input: artifact,
      });

      test.equal(action.configuration.FileName, undefined);

      test.done();
    },

    'can be created just by specifying the imageFile'(test: Test) {
      const service = anyEcsService();
      const artifact = new codepipeline.Artifact('Artifact');

      const action = new cpactions.EcsDeployAction({
        actionName: 'ECS',
        service,
        imageFile: artifact.atPath('imageFile.json'),
      });

      test.equal(action.configuration.FileName, 'imageFile.json');

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
  },
};

function anyEcsService(): ecs.FargateService {
  const stack = new cdk.Stack();
  const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDefinition');
  taskDefinition.addContainer('MainContainer', {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  });
  const vpc = new ec2.VpcNetwork(stack, 'VPC');
  const cluster = new ecs.Cluster(stack, 'Cluster', {
    vpc,
  });
  return new ecs.FargateService(stack, 'FargateService', {
    cluster,
    taskDefinition,
  });
}
