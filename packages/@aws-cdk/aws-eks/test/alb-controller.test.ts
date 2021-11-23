import * as fs from 'fs';
import * as path from 'path';
import { SynthUtils } from '@aws-cdk/assert-internal';
import * as iam from '@aws-cdk/aws-iam';
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

test('all vended policies are valid', () => {

  const addOnsDir = path.join(__dirname, '..', 'lib', 'addons');

  for (const addOn of fs.readdirSync(addOnsDir)) {
    if (addOn.startsWith('alb-iam_policy')) {
      const policy = JSON.parse(fs.readFileSync(path.join(addOnsDir, addOn)).toString());
      try {

        for (const statement of policy.Statement) {
          iam.PolicyStatement.fromJson(statement);
        }

      } catch (error) {
        throw new Error(`Invalid policy: ${addOn}: ${error}`);
      }
    }
  }

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