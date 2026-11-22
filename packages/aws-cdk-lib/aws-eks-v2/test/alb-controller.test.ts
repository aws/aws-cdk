import * as fs from 'fs';
import * as path from 'path';
import { KubectlV31Layer } from '@aws-cdk/lambda-layer-kubectl-v31';
import { testFixture } from './util';
import { Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import { App, Stack } from '../../core';
import * as cxapi from '../../cx-api';
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

describe('default image repository with the albControllerRegionalImageRepository feature flag', () => {
  const IMAGE_NAME = 'amazon/aws-load-balancer-controller';
  const LEGACY_REPOSITORY = `602401143452.dkr.ecr.us-west-2.amazonaws.com/${IMAGE_NAME}`;

  function createController(region: string | undefined, flag: boolean, repository?: string) {
    const app = new App({ context: { [cxapi.EKS_ALB_CONTROLLER_REGIONAL_IMAGE_REPOSITORY]: flag } });
    const stack = new Stack(app, 'Stack', { env: region ? { region } : undefined });
    const cluster = new Cluster(stack, 'Cluster', {
      version: KubernetesVersion.V1_27,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV31Layer(stack, 'kubectlLayer'),
      },
    });
    AlbController.create(stack, {
      cluster,
      version: AlbControllerVersion.V2_8_2,
      repository,
    });
    return Template.fromStack(stack);
  }

  function expectValues(template: Template, ...parts: any[]) {
    template.hasResourceProperties(HelmChart.RESOURCE_TYPE, {
      Values: { 'Fn::Join': ['', Match.arrayWith(parts)] },
    });
  }

  test('uses the us-west-2 repository when the flag is disabled', () => {
    const template = createController('us-east-2', false);

    expectValues(template, `","image":{"repository":"${LEGACY_REPOSITORY}","tag":"v2.8.2"}}`);
  });

  test.each([
    ['us-east-2', '602401143452'],
    ['af-south-1', '877085696533'],
    ['cn-north-1', '918309763551'],
    ['us-gov-west-1', '013241004608'],
  ])('uses the repository of the stack region %s', (region, account) => {
    const template = createController(region, true);

    expectValues(template,
      `","image":{"repository":"${account}.dkr.ecr.${region}.`,
      { Ref: 'AWS::URLSuffix' },
      `/${IMAGE_NAME}","tag":"v2.8.2"}}`,
    );
  });

  test.each(['me-west-1', 'us-iso-east-1'])('uses the us-west-2 repository in region %s, which has no known registry', (region) => {
    const template = createController(region, true);

    expectValues(template, `","image":{"repository":"${LEGACY_REPOSITORY}","tag":"v2.8.2"}}`);
  });

  test('looks up the repository at deployment time when the stack region is a token', () => {
    const template = createController(undefined, true);

    expectValues(template,
      '","image":{"repository":"',
      { 'Fn::FindInMap': ['EksAddonRepositoryAccountMap', { Ref: 'AWS::Region' }, 'value'] },
      '.dkr.ecr.',
      { Ref: 'AWS::Region' },
      '.',
      { Ref: 'AWS::URLSuffix' },
      `/${IMAGE_NAME}","tag":"v2.8.2"}}`,
    );
    template.hasMapping('EksAddonRepositoryAccountMap', {
      'us-east-1': { value: '602401143452' },
      'af-south-1': { value: '877085696533' },
      'cn-north-1': { value: '918309763551' },
    });
  });

  test('uses the specified repository when the flag is enabled', () => {
    const template = createController('us-east-2', true, 'custom');

    expectValues(template, '","image":{"repository":"custom","tag":"v2.8.2"}}');
  });
});
