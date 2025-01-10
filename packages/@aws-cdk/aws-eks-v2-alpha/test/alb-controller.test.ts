import * as fs from 'fs';
import * as path from 'path';
import { testFixture } from './util';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Cluster, KubernetesVersion, AlbController, AlbControllerVersion, HelmChart, KubernetesManifest, AuthenticationMode } from '../lib';

const versions = Object.values(AlbControllerVersion);

test.each(versions)('support AlbControllerVersion (%s)', (version) => {
  const { stack } = testFixture();

  const cluster = new Cluster(stack, 'Cluster', {
    version: KubernetesVersion.V1_27,
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

describe('AlbController AwsAuth creation', () => {
  const setupTest = (authenticationMode?: AuthenticationMode) => {
    const { stack } = testFixture();
    const cluster = new Cluster(stack, 'Cluster', {
      version: KubernetesVersion.V1_27,
      authenticationMode,
    });
    AlbController.create(stack, {
      cluster,
      version: AlbControllerVersion.V2_6_2,
    });
    return stack;
  };

  const awsAuthManifest = {
    Manifest: {
      'Fn::Join': [
        '',
        [
          '[{"apiVersion":"v1","kind":"ConfigMap","metadata":{"name":"aws-auth","namespace":"kube-system","labels":{"aws.cdk.eks/prune-c82ececabf77e03e3590f2ebe02adba8641d1b3e76":""}},"data":{"mapRoles":"[{\\"rolearn\\":\\"',
          {
            'Fn::GetAtt': [
              'ClusterNodegroupDefaultCapacityNodeGroupRole55953B04',
              'Arn',
            ],
          },
          '\\",\\"username\\":\\"system:node:{{EC2PrivateDNSName}}\\",\\"groups\\":[\\"system:bootstrappers\\",\\"system:nodes\\"]}]","mapUsers":"[]","mapAccounts":"[]"}}]',
        ],
      ],
    },
  };

  test('will not create AwsAuth when the authenticationMode is API', () => {
    const stack = setupTest(AuthenticationMode.API);
    Template.fromStack(stack).hasResourceProperties(KubernetesManifest.RESOURCE_TYPE, Match.not(awsAuthManifest));
  });

  test.each([
    AuthenticationMode.API_AND_CONFIG_MAP,
    AuthenticationMode.CONFIG_MAP,
    undefined,
  ])('will create AwsAuth when the authenticationMode is %p', (authenticationMode) => {
    const stack = setupTest(authenticationMode);
    Template.fromStack(stack).hasResourceProperties(KubernetesManifest.RESOURCE_TYPE, awsAuthManifest);
  });
});
