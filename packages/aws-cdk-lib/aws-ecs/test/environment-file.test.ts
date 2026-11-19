import * as path from 'path';
import { Construct } from 'constructs';
import { Match, Template } from '../../assertions';
import type { Asset } from '../../aws-s3-assets';
import * as cdk from '../../core';
import * as cxapi from '../../cx-api';
import * as ecs from '../lib';
import { acknowledgeTestValidationRules } from './util';

describe('environment file', () => {
  describe('ecs.EnvironmentFile.fromAsset', () => {
    test('fails if asset is not a single file', () => {
      // GIVEN
      const stack = new cdk.Stack();
      acknowledgeTestValidationRules(stack);
      const fileAsset = ecs.EnvironmentFile.fromAsset(path.join(__dirname, 'demo-envfiles'));

      // THEN
      expect(() => defineContainerDefinition(stack, fileAsset)).toThrow(/Asset must be a single file/);
    });

    test('only one environment file asset object is created even if multiple container definitions use the same file', () => {
      // GIVEN
      const app = new cdk.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
      const stack = new cdk.Stack(app);
      acknowledgeTestValidationRules(stack);
      const fileAsset = ecs.EnvironmentFile.fromAsset(path.join(__dirname, 'demo-envfiles', 'test-envfile.env'));

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

    test.each(['other-envfile.env', 'test-envfile.env'])('supports separate asset objects for test-envfile.env and %s', (secondFile) => {
      const stack = new cdk.Stack();
      acknowledgeTestValidationRules(stack);

      const container = defineContainerDefinition(stack, [
        ecs.EnvironmentFile.fromAsset(path.join(__dirname, 'demo-envfiles', 'test-envfile.env')),
        ecs.EnvironmentFile.fromAsset(path.join(__dirname, 'demo-envfiles', secondFile)),
      ]);

      const firstAsset = container.node.findChild('EnvironmentFile') as Asset;
      const secondAsset = container.node.findChild('EnvironmentFile1') as Asset;
      expect(secondAsset.s3ObjectKey === firstAsset.s3ObjectKey).toEqual(secondFile === 'test-envfile.env');
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [Match.objectLike({
          EnvironmentFiles: [firstAsset, secondAsset].map(asset => ({
            Type: 's3',
            Value: stack.resolve(`arn:${stack.partition}:s3:::${asset.s3BucketName}/${asset.s3ObjectKey}`),
          })),
        })],
      });
    });

    test('retains the original asset path when the same object is repeated', () => {
      const stack = new cdk.Stack(undefined, 'Stack');
      acknowledgeTestValidationRules(stack);
      const environmentFile = ecs.EnvironmentFile.fromAsset(path.join(__dirname, 'demo-envfiles', 'test-envfile.env'));

      const container = defineContainerDefinition(stack, [environmentFile, environmentFile]);

      const asset = container.node.findChild('EnvironmentFile') as Asset;
      expect(asset.node.path).toEqual('Stack/Container/EnvironmentFile');
      expect(container.node.tryFindChild('EnvironmentFile1')).toBeUndefined();
      Template.fromStack(stack).hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: [Match.objectLike({
          EnvironmentFiles: [0, 1].map(() => ({
            Type: 's3',
            Value: stack.resolve(`arn:${stack.partition}:s3:::${asset.s3BucketName}/${asset.s3ObjectKey}`),
          })),
        })],
      });
    });

    test.each([
      { occupiedIds: ['EnvironmentFile'], expectedId: 'EnvironmentFile1' },
      { occupiedIds: ['EnvironmentFile', 'EnvironmentFile1', 'EnvironmentFile3'], expectedId: 'EnvironmentFile2' },
    ])('uses $expectedId when $occupiedIds are already occupied', ({ occupiedIds, expectedId }) => {
      const stack = new cdk.Stack();
      const scope = new Construct(stack, 'Scope');
      for (const id of occupiedIds) {
        new Construct(scope, id);
      }
      const environmentFile = ecs.EnvironmentFile.fromAsset(path.join(__dirname, 'demo-envfiles', 'test-envfile.env'));

      const config = environmentFile.bind(scope);

      const asset = scope.node.findChild(expectedId) as Asset;
      expect(config).toEqual({
        fileType: ecs.EnvironmentFileType.S3,
        s3Location: { bucketName: asset.s3BucketName, objectKey: asset.s3ObjectKey },
      });
      expect(environmentFile.bind(scope)).toEqual(config);
    });
  });
});

function defineContainerDefinition(stack: cdk.Stack, environmentFile: ecs.EnvironmentFile | ecs.EnvironmentFile[]) {
  const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');

  return new ecs.ContainerDefinition(stack, 'Container', {
    environmentFiles: Array.isArray(environmentFile) ? environmentFile : [environmentFile],
    image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
    memoryLimitMiB: 512,
    taskDefinition,
  });
}
