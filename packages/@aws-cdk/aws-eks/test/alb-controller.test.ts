import { SynthUtils } from '@aws-cdk/assert-internal';
import '@aws-cdk/assert-internal/jest';
import { Cluster, KubernetesVersion, AlbController, AlbControllerVersion } from '../lib';
import { testFixture } from './util';

test('minimal snapshot', () => {

  const { stack } = testFixture();

  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_21,
  });

  AlbController.create(stack, {
    cluster,
    version: AlbControllerVersion.V2_3_0,
  });

  expect(SynthUtils.synthesize(stack).template).toMatchSnapshot();

});

test('can configure a custom repository', () => {

  const { stack } = testFixture();

  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_21,
  });

  AlbController.create(stack, {
    cluster,
    version: AlbControllerVersion.V2_3_0,
    repository: 'custom',
  });

  expect(SynthUtils.synthesize(stack).template).toMatchSnapshot();

});

test('throws when a policy is not defined for a custom version', () => {

  const { stack } = testFixture();

  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_21,
  });

  expect(() => AlbController.create(stack, {
    cluster,
    version: AlbControllerVersion.of('custom'),
  })).toThrowError("'albControllerOptions.policy' is required when using a custom controller version");

});