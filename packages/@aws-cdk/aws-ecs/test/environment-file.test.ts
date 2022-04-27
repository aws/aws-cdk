import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as ecs from '../lib';

/* eslint-disable dot-notation */

describe('environment file', () => {
  describe('ecs.EnvironmentFile.fromAsset', () => {
    test('fails if asset is not a single file', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const fileAsset = ecs.EnvironmentFile.fromAsset(path.join(__dirname, 'demo-envfiles'));

      // THEN
      expect(() => defineContainerDefinition(stack, fileAsset)).toThrow(/Asset must be a single file/);

    });

    test('only one environment file asset object is created even if multiple container definitions use the same file', () => {
      // GIVEN
      const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
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
      expect(synthesized.assets.length).toEqual(1);

    });
  });
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
