import * as fs from 'fs';
import * as path from 'path';
import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import { testFixture } from './util';
import { Cluster, KubernetesVersion, AlbController, AlbControllerVersion, HelmChart } from '../lib';

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
    version: AlbControllerVersion.V2_4_1,
    repository: 'custom',
  });

  Template.fromStack(stack).hasResourceProperties(HelmChart.RESOURCE_TYPE, {
    Values: {
      'Fn::Join': [
        '',
        [
          '{"clusterName":"',
          {
            Ref: 'Cluster9EE0221C',
          },
          '","serviceAccount":{"create":false,"name":"aws-load-balancer-controller"},"region":"us-east-1","vpcId":"',
          {
            Ref: 'ClusterDefaultVpcFA9F2722',
          },
          '","image":{"repository":"custom","tag":"v2.4.1"}}',
        ],
      ],
    },
  });
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

test('can configure custom repository with alb controller version 2.4.2', () => {
  const { stack } = testFixture();

  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_21,
  });

  AlbController.create(stack, {
    cluster,
    version: AlbControllerVersion.V2_4_2,
    repository: 'custom',
  });

  Template.fromStack(stack).hasResourceProperties(HelmChart.RESOURCE_TYPE, {
    Values: {
      'Fn::Join': [
        '',
        [
          '{"clusterName":"',
          {
            Ref: 'Cluster9EE0221C',
          },
          '","serviceAccount":{"create":false,"name":"aws-load-balancer-controller"},"region":"us-east-1","vpcId":"',
          {
            Ref: 'ClusterDefaultVpcFA9F2722',
          },
          '","image":{"repository":"custom","tag":"v2.4.2"}}',
        ],
      ],
    },
  });
});

test('can configure custom repository with alb controller version 2.4.3', () => {
  const { stack } = testFixture();

  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_21,
  });

  AlbController.create(stack, {
    cluster,
    version: AlbControllerVersion.V2_4_3,
    repository: 'custom',
  });

  Template.fromStack(stack).hasResourceProperties(HelmChart.RESOURCE_TYPE, {
    Values: {
      'Fn::Join': [
        '',
        [
          '{"clusterName":"',
          {
            Ref: 'Cluster9EE0221C',
          },
          '","serviceAccount":{"create":false,"name":"aws-load-balancer-controller"},"region":"us-east-1","vpcId":"',
          {
            Ref: 'ClusterDefaultVpcFA9F2722',
          },
          '","image":{"repository":"custom","tag":"v2.4.3"}}',
        ],
      ],
    },
  });
});

test('can configure custom repository with alb controller version 2.4.4', () => {
  const { stack } = testFixture();

  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_21,
  });

  AlbController.create(stack, {
    cluster,
    version: AlbControllerVersion.V2_4_4,
    repository: 'custom',
  });

  Template.fromStack(stack).hasResourceProperties(HelmChart.RESOURCE_TYPE, {
    Values: {
      'Fn::Join': [
        '',
        [
          '{"clusterName":"',
          {
            Ref: 'Cluster9EE0221C',
          },
          '","serviceAccount":{"create":false,"name":"aws-load-balancer-controller"},"region":"us-east-1","vpcId":"',
          {
            Ref: 'ClusterDefaultVpcFA9F2722',
          },
          '","image":{"repository":"custom","tag":"v2.4.4"}}',
        ],
      ],
    },
  });
});

test('can configure custom repository with alb controller version 2.4.5', () => {
  const { stack } = testFixture();

  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_21,
  });

  AlbController.create(stack, {
    cluster,
    version: AlbControllerVersion.V2_4_5,
    repository: 'custom',
  });

  Template.fromStack(stack).hasResourceProperties(HelmChart.RESOURCE_TYPE, {
    Values: {
      'Fn::Join': [
        '',
        [
          '{"clusterName":"',
          {
            Ref: 'Cluster9EE0221C',
          },
          '","serviceAccount":{"create":false,"name":"aws-load-balancer-controller"},"region":"us-east-1","vpcId":"',
          {
            Ref: 'ClusterDefaultVpcFA9F2722',
          },
          '","image":{"repository":"custom","tag":"v2.4.5"}}',
        ],
      ],
    },
  });
});

test('can configure custom repository with alb controller version 2.4.6', () => {
  const { stack } = testFixture();

  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_21,
  });

  AlbController.create(stack, {
    cluster,
    version: AlbControllerVersion.V2_4_6,
    repository: 'custom',
  });

  Template.fromStack(stack).hasResourceProperties(HelmChart.RESOURCE_TYPE, {
    Values: {
      'Fn::Join': [
        '',
        [
          '{"clusterName":"',
          {
            Ref: 'Cluster9EE0221C',
          },
          '","serviceAccount":{"create":false,"name":"aws-load-balancer-controller"},"region":"us-east-1","vpcId":"',
          {
            Ref: 'ClusterDefaultVpcFA9F2722',
          },
          '","image":{"repository":"custom","tag":"v2.4.6"}}',
        ],
      ],
    },
  });
});

test('can configure custom repository with alb controller version 2.4.7', () => {
  const { stack } = testFixture();

  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_21,
  });

  AlbController.create(stack, {
    cluster,
    version: AlbControllerVersion.V2_4_4,
    repository: 'custom',
  });

  Template.fromStack(stack).hasResourceProperties(HelmChart.RESOURCE_TYPE, {
    Values: {
      'Fn::Join': [
        '',
        [
          '{"clusterName":"',
          {
            Ref: 'Cluster9EE0221C',
          },
          '","serviceAccount":{"create":false,"name":"aws-load-balancer-controller"},"region":"us-east-1","vpcId":"',
          {
            Ref: 'ClusterDefaultVpcFA9F2722',
          },
          '","image":{"repository":"custom","tag":"v2.4.7"}}',
        ],
      ],
    },
  });
});

test('can configure custom repository with alb controller version 2.5.0', () => {
  const { stack } = testFixture();

  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_21,
  });

  AlbController.create(stack, {
    cluster,
    version: AlbControllerVersion.V2_5_0,
    repository: 'custom',
  });

  Template.fromStack(stack).hasResourceProperties(HelmChart.RESOURCE_TYPE, {
    Values: {
      'Fn::Join': [
        '',
        [
          '{"clusterName":"',
          {
            Ref: 'Cluster9EE0221C',
          },
          '","serviceAccount":{"create":false,"name":"aws-load-balancer-controller"},"region":"us-east-1","vpcId":"',
          {
            Ref: 'ClusterDefaultVpcFA9F2722',
          },
          '","image":{"repository":"custom","tag":"v2.5.0"}}',
        ],
      ],
    },
  });
});

test('can configure custom repository with alb controller version 2.5.1', () => {
  const { stack } = testFixture();

  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_21,
  });

  AlbController.create(stack, {
    cluster,
    version: AlbControllerVersion.V2_5_1,
    repository: 'custom',
  });

  Template.fromStack(stack).hasResourceProperties(HelmChart.RESOURCE_TYPE, {
    Values: {
      'Fn::Join': [
        '',
        [
          '{"clusterName":"',
          {
            Ref: 'Cluster9EE0221C',
          },
          '","serviceAccount":{"create":false,"name":"aws-load-balancer-controller"},"region":"us-east-1","vpcId":"',
          {
            Ref: 'ClusterDefaultVpcFA9F2722',
          },
          '","image":{"repository":"custom","tag":"v2.5.1"}}',
        ],
      ],
    },
  });
});
