import * as fs from 'fs';
import * as path from 'path';
import { KubectlV31Layer } from '@aws-cdk/lambda-layer-kubectl-v31';
import { testFixture } from './util';
import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import { Cluster, KubernetesVersion, AlbController, AlbControllerVersion, HelmChart, KubernetesManifest } from '../lib';

const versions = Object.values(AlbControllerVersion);

test.each(versions)('support AlbControllerVersion (%s)', (version) => {
  const { stack } = testFixture();

  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_27,
    kubectlProviderOptions: {
      kubectlLayer: new KubectlV31Layer(stack, 'kubectlLayer'),
    },
  });
  AlbController.create(stack, {
    cluster,
    version,
  });

  Template.fromStack(stack).hasResourceProperties(HelmChart.RESOURCE_TYPE, {
    Version: version.helmChartVersion,
    Values: {
      'Fn::Join': [
        '',
        [
          '{"clusterName":"',
          {
            Ref: 'ClusterEB0386A7',
          },
          '","serviceAccount":{"create":false,"name":"aws-load-balancer-controller"},"region":"us-east-1","vpcId":"',
          {
            Ref: 'ClusterDefaultVpcFA9F2722',
          },
          `","image":{"repository":"602401143452.dkr.ecr.us-west-2.amazonaws.com/amazon/aws-load-balancer-controller","tag":"${version.version}"}}`,
        ],
      ],
    },
  });
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
    version: KubernetesVersion.V1_27,
    kubectlProviderOptions: {
      kubectlLayer: new KubectlV31Layer(stack, 'kubectlLayer'),
    },
  });

  AlbController.create(stack, {
    cluster,
    version: AlbControllerVersion.V2_6_2,
    repository: 'custom',
  });

  Template.fromStack(stack).hasResourceProperties(HelmChart.RESOURCE_TYPE, {
    Values: {
      'Fn::Join': [
        '',
        [
          '{"clusterName":"',
          {
            Ref: 'ClusterEB0386A7',
          },
          '","serviceAccount":{"create":false,"name":"aws-load-balancer-controller"},"region":"us-east-1","vpcId":"',
          {
            Ref: 'ClusterDefaultVpcFA9F2722',
          },
          '","image":{"repository":"custom","tag":"v2.6.2"}}',
        ],
      ],
    },
  });
});

test('throws when a policy is not defined for a custom version', () => {
  const { stack } = testFixture();

  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_27,
    kubectlProviderOptions: {
      kubectlLayer: new KubectlV31Layer(stack, 'kubectlLayer'),
    },
  });

  expect(() => AlbController.create(stack, {
    cluster,
    version: AlbControllerVersion.of('custom'),
  })).toThrow("'albControllerOptions.policy' is required when using a custom controller version");
});

test.each(['us-gov-west-1', 'cn-north-1'])('stack does not include hard-coded partition', (region) => {
  const { stack } = testFixture(region);
  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_27,
    kubectlProviderOptions: {
      kubectlLayer: new KubectlV31Layer(stack, 'kubectlLayer'),
    },
  });

  AlbController.create(stack, {
    cluster,
    version: AlbControllerVersion.V2_6_2,
  });

  const template = Template.fromStack(stack);
  expect(JSON.stringify(template)).not.toContain('arn:aws');
});

test('correct helm chart version is set for selected alb controller version', () => {
  const { stack } = testFixture();

  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_27,
    kubectlProviderOptions: {
      kubectlLayer: new KubectlV31Layer(stack, 'kubectlLayer'),
    },
  });

  AlbController.create(stack, {
    cluster,
    version: AlbControllerVersion.V2_6_2,
    repository: 'custom',
  });

  Template.fromStack(stack).hasResourceProperties(HelmChart.RESOURCE_TYPE, {
    Version: '1.6.2', // The helm chart version associated with AlbControllerVersion.V2_6_2
    Values: {
      'Fn::Join': [
        '',
        [
          '{"clusterName":"',
          {
            Ref: 'ClusterEB0386A7',
          },
          '","serviceAccount":{"create":false,"name":"aws-load-balancer-controller"},"region":"us-east-1","vpcId":"',
          {
            Ref: 'ClusterDefaultVpcFA9F2722',
          },
          '","image":{"repository":"custom","tag":"v2.6.2"}}',
        ],
      ],
    },
  });
});

test.each([
  { setting: 'enableWaf', value: false },
  { setting: 'enableWafv2', value: false },
  { setting: 'enableWaf', value: true },
  { setting: 'enableWafv2', value: true },
])('custom WAF settings - $setting', ({ setting, value }) => {
  // GIVEN
  const { stack } = testFixture();
  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_27,
    kubectlProviderOptions: {
      kubectlLayer: new KubectlV31Layer(stack, 'kubectlLayer'),
    },
  });

  // WHEN
  new AlbController(stack, 'AlbController', {
    cluster,
    version: AlbControllerVersion.V2_4_1,
    additionalHelmChartValues: {
      [setting]: value,
    },
  });

  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties(HelmChart.RESOURCE_TYPE, {
    Values: {
      'Fn::Join': [
        '',
        [
          '{"clusterName":"',
          { Ref: 'ClusterEB0386A7' },
          '","serviceAccount":{"create":false,"name":"aws-load-balancer-controller"},"region":"us-east-1","vpcId":"',
          { Ref: 'ClusterDefaultVpcFA9F2722' },
          `","image":{"repository":"602401143452.dkr.ecr.us-west-2.amazonaws.com/amazon/aws-load-balancer-controller","tag":"v2.4.1"},"${setting}":${value}}`,
        ],
      ],
    },
  });
});

test('should pass overwriteServiceAccount to service account', () => {
  // GIVEN
  const { stack } = testFixture();
  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_27,
    kubectlProviderOptions: {
      kubectlLayer: new KubectlV31Layer(stack, 'kubectlLayer'),
    },
  });

  // WHEN
  AlbController.create(stack, {
    cluster,
    version: AlbControllerVersion.V2_6_2,
    overwriteServiceAccount: true,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties(KubernetesManifest.RESOURCE_TYPE, {
    Overwrite: true,
  });
});
