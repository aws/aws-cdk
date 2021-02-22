import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import * as ecs from '../lib';

/* eslint-disable dot-notation */

nodeunitShim({
  'ecs.EnvironmentFile.fromAsset': {
    'fails if asset is not a single file'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const fileAsset = ecs.EnvironmentFile.fromAsset(path.join(__dirname, 'demo-envfiles'));

      // THEN
      test.throws(() => defineContainerDefinition(stack, fileAsset), /Asset must be a single file/);
      test.done();
    },

    'only one environment file asset object is created even if multiple container definitions use the same file'(test: Test) {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app);
      const fileAsset = ecs.EnvironmentFile.fromAsset(path.join(__dirname, 'demo-envfiles/test-envfile.env'));

      // WHEN
      const image = ecs.ContainerImage.fromRegistry('/aws/aws-example-app');
      const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
      const containerDefinitionProps: ecs.ContainerDefinitionProps = {
        environmentFiles: [fileAsset],
        image,
        memoryLimitMiB: 512,
        taskDefinition,
      };

      new ecs.ContainerDefinition(stack, 'ContainerOne', containerDefinitionProps);
      new ecs.ContainerDefinition(stack, 'ContainerTwo', containerDefinitionProps);

      // THEN
      const assembly = app.synth();
      const synthesized = assembly.stacks[0];

      // container one has an asset, container two does not
      test.deepEqual(synthesized.assets.length, 1);
      test.done();
    },
  },
});

function defineContainerDefinition(stack: cdk.Stack, environmentFile: ecs.EnvironmentFile) {
  const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

  return new ecs.ContainerDefinition(stack, 'Container', {
    environmentFiles: [environmentFile],
    image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
    memoryLimitMiB: 512,
    taskDefinition,
  });
}
