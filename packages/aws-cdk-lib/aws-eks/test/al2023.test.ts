import { KubectlV31Layer } from '@aws-cdk/lambda-layer-kubectl-v31';
import { Template } from '../../assertions';
import * as autoscaling from '../../aws-autoscaling';
import * as ec2 from '../../aws-ec2';
import { App, Stack } from '../../core';
import * as eks from '../lib';
import { renderAmazonLinux2023UserData } from '../lib/user-data';

const SERVICE_CIDR = '172.20.0.0/16';

describe('Amazon Linux 2023 capacity', () => {
  describe('AMI selection', () => {
    test.each([
      ['m5.large', 'x86_64/standard'],
      ['m6g.large', 'arm64/standard'],
      ['g4dn.xlarge', 'x86_64/nvidia'],
      ['inf1.xlarge', 'x86_64/neuron'],
      ['trn1.2xlarge', 'x86_64/neuron'],
    ])('%s uses the amazon-linux-2023/%s image', (instanceType, amiPath) => {
      // GIVEN
      const { stack, cluster } = newCluster({ serviceIpv4Cidr: SERVICE_CIDR });

      // WHEN
      cluster.addAutoScalingGroupCapacity('Nodes', {
        instanceType: new ec2.InstanceType(instanceType),
        machineImageType: eks.MachineImageType.AMAZON_LINUX_2023,
      });

      // THEN
      expect(ssmParameterDefaults(stack)).toContain(
        `/aws/service/eks/optimized-ami/1.30/amazon-linux-2023/${amiPath}/recommended/image_id`);
    });

    test('Amazon Linux 2 remains the default', () => {
      // GIVEN
      const { stack, cluster } = newCluster();

      // WHEN
      cluster.addAutoScalingGroupCapacity('Nodes', { instanceType: new ec2.InstanceType('m5.large') });

      // THEN
      expect(ssmParameterDefaults(stack)).toContain('/aws/service/eks/optimized-ami/1.30/amazon-linux-2/recommended/image_id');
    });

    test('EksOptimizedImage resolves the arm64 NVIDIA image', () => {
      // GIVEN
      const { stack } = newCluster();

      // WHEN
      new eks.EksOptimizedImage({
        kubernetesVersion: '1.30',
        machineImageType: eks.MachineImageType.AMAZON_LINUX_2023,
        nodeType: eks.NodeType.GPU,
        cpuArch: eks.CpuArch.ARM_64,
      }).getImage(stack);

      // THEN
      expect(ssmParameterDefaults(stack)).toContain('/aws/service/eks/optimized-ami/1.30/amazon-linux-2023/arm64/nvidia/recommended/image_id');
    });

    test('EksOptimizedImage rejects Bottlerocket', () => {
      expect(() => new eks.EksOptimizedImage({ machineImageType: eks.MachineImageType.BOTTLEROCKET }))
        .toThrow(/does not support MachineImageType.BOTTLEROCKET/);
    });

    test('EksOptimizedImage rejects arm64 Neuron images', () => {
      expect(() => new eks.EksOptimizedImage({
        machineImageType: eks.MachineImageType.AMAZON_LINUX_2023,
        nodeType: eks.NodeType.INFERENTIA,
        cpuArch: eks.CpuArch.ARM_64,
      })).toThrow(/only published for x86_64/);
    });
  });

  describe('nodeadm user data', () => {
    test('renders a NodeConfig with the cluster coordinates and on-demand label', () => {
      // GIVEN
      const { stack, cluster, asg } = newClusterAndAsg();

      // WHEN
      const nodeConfig = stack.resolve(renderAmazonLinux2023UserData(cluster, asg, SERVICE_CIDR));

      // THEN
      expect(nodeConfig).toEqual({
        'Fn::Join': ['', [
          '---\napiVersion: node.eks.aws/v1alpha1\nkind: NodeConfig\nspec:\n  cluster:\n    name: ',
          { Ref: 'Cluster9EE0221C' },
          '\n    apiServerEndpoint: ',
          { 'Fn::GetAtt': ['Cluster9EE0221C', 'Endpoint'] },
          '\n    certificateAuthority: ',
          { 'Fn::GetAtt': ['Cluster9EE0221C', 'CertificateAuthorityData'] },
          '\n    cidr: 172.20.0.0/16\n  kubelet:\n    flags:\n    - "--node-labels=lifecycle=OnDemand"\n',
        ]],
      });
    });

    test('labels and taints spot instances like Amazon Linux 2', () => {
      // GIVEN
      const { stack, cluster, asg } = newClusterAndAsg(true);

      // WHEN
      const nodeConfig = JSON.stringify(stack.resolve(renderAmazonLinux2023UserData(cluster, asg, SERVICE_CIDR)));

      // THEN
      expect(nodeConfig).toContain('- \\"--node-labels=lifecycle=Ec2Spot\\"');
      expect(nodeConfig).toContain('- \\"--register-with-taints=spotInstance=true:PreferNoSchedule\\"');
    });

    test('passes kubeletExtraArgs as kubelet flags and dnsClusterIp as clusterDNS', () => {
      // GIVEN
      const { stack, cluster, asg } = newClusterAndAsg();

      // WHEN
      const nodeConfig = JSON.stringify(stack.resolve(renderAmazonLinux2023UserData(cluster, asg, SERVICE_CIDR, {
        kubeletExtraArgs: '--node-labels=team=platform  --max-pods=50',
        dnsClusterIp: '172.20.0.10',
      })));

      // THEN
      expect(nodeConfig).toContain('    config:\\n      clusterDNS:\\n      - 172.20.0.10\\n');
      expect(nodeConfig).toContain('    - \\"--node-labels=team=platform\\"\\n    - \\"--max-pods=50\\"\\n');
    });

    test.each([
      [{ enableDockerBridge: true }, 'enableDockerBridge'],
      [{ awsApiRetryAttempts: 5 }, 'awsApiRetryAttempts'],
      [{ dockerConfigJson: '{}' }, 'dockerConfigJson'],
      [{ additionalArgs: '--foo' }, 'additionalArgs'],
      [{ useMaxPods: false }, 'useMaxPods'],
    ])('rejects the Amazon Linux 2-only bootstrap option %j', (options: eks.BootstrapOptions, name: string) => {
      // GIVEN
      const { cluster, asg } = newClusterAndAsg();

      // THEN
      expect(() => renderAmazonLinux2023UserData(cluster, asg, SERVICE_CIDR, options))
        .toThrow(new RegExp(`bootstrapOptions ${name} are not supported for Amazon Linux 2023`));
    });

    test('requires the endpoint and CA of an imported cluster', () => {
      // GIVEN
      const { stack, asg } = newClusterAndAsg();
      const imported = eks.Cluster.fromClusterAttributes(stack, 'Imported', { clusterName: 'imported' });

      // THEN
      expect(() => renderAmazonLinux2023UserData(imported, asg, SERVICE_CIDR))
        .toThrow(/need the cluster endpoint and certificate authority data/);
    });
  });

  describe('addAutoScalingGroupCapacity', () => {
    test('adds the NodeConfig as an application/node.eks.aws part next to a shell script part', () => {
      // GIVEN
      const { stack, cluster } = newCluster({ serviceIpv4Cidr: SERVICE_CIDR });

      // WHEN
      const asg = cluster.addAutoScalingGroupCapacity('Nodes', {
        instanceType: new ec2.InstanceType('m5.large'),
        machineImageType: eks.MachineImageType.AMAZON_LINUX_2023,
      });
      asg.addUserData('echo custom-step');

      // THEN
      const userData = JSON.stringify(stack.resolve(asg.userData.render()));
      expect(userData).toContain('Content-Type: multipart/mixed');
      expect(userData).toContain('Content-Type: text/x-shellscript');
      expect(userData).toContain('echo custom-step');
      expect(userData).toContain('Content-Type: application/node.eks.aws');
      expect(userData).toContain('cidr: 172.20.0.0/16');
      expect(userData).not.toContain('/etc/eks/bootstrap.sh');
      expect(userData).not.toContain('cfn-signal');
    });

    test('bootstrapOptions.serviceCidr takes precedence over the cluster serviceIpv4Cidr', () => {
      // GIVEN
      const { stack, cluster } = newCluster({ serviceIpv4Cidr: SERVICE_CIDR });

      // WHEN
      const asg = cluster.addAutoScalingGroupCapacity('Nodes', {
        instanceType: new ec2.InstanceType('m5.large'),
        machineImageType: eks.MachineImageType.AMAZON_LINUX_2023,
        bootstrapOptions: { serviceCidr: '10.100.0.0/16' },
      });

      // THEN
      const userData = JSON.stringify(stack.resolve(asg.userData.render()));
      expect(userData).toContain('cidr: 10.100.0.0/16');
      expect(userData).not.toContain(SERVICE_CIDR);
    });

    test('fails with guidance when the service CIDR is unknown', () => {
      // GIVEN
      const { cluster } = newCluster();

      // THEN
      expect(() => cluster.addAutoScalingGroupCapacity('Nodes', {
        instanceType: new ec2.InstanceType('m5.large'),
        machineImageType: eks.MachineImageType.AMAZON_LINUX_2023,
      })).toThrow(/Set bootstrapOptions.serviceCidr.*Do not add serviceIpv4Cidr to an existing cluster/);
    });

    test('does not add bootstrap user data when bootstrapEnabled is false', () => {
      // GIVEN
      const { stack, cluster } = newCluster();

      // WHEN
      const asg = cluster.addAutoScalingGroupCapacity('Nodes', {
        instanceType: new ec2.InstanceType('m5.large'),
        machineImageType: eks.MachineImageType.AMAZON_LINUX_2023,
        bootstrapEnabled: false,
      });

      // THEN
      expect(JSON.stringify(stack.resolve(asg.userData.render()))).not.toContain('application/node.eks.aws');
    });
  });

  describe('connectAutoScalingGroupCapacity', () => {
    test('requires multipart user data on the auto scaling group', () => {
      // GIVEN
      const { cluster, asg } = newClusterAndAsg();

      // THEN
      expect(() => cluster.connectAutoScalingGroupCapacity(asg, {
        machineImageType: eks.MachineImageType.AMAZON_LINUX_2023,
        bootstrapOptions: { serviceCidr: SERVICE_CIDR },
      })).toThrow(/reads its configuration from MIME multipart user data/);
    });

    test('adds the NodeConfig to a group created with an AL2023 image', () => {
      // GIVEN
      const { stack, cluster } = newCluster();
      const asg = new autoscaling.AutoScalingGroup(stack, 'Self', {
        vpc: cluster.vpc,
        instanceType: new ec2.InstanceType('m5.large'),
        machineImage: new eks.EksOptimizedImage({
          kubernetesVersion: '1.30',
          machineImageType: eks.MachineImageType.AMAZON_LINUX_2023,
        }),
      });

      // WHEN
      cluster.connectAutoScalingGroupCapacity(asg, {
        machineImageType: eks.MachineImageType.AMAZON_LINUX_2023,
        bootstrapOptions: { serviceCidr: SERVICE_CIDR },
      });

      // THEN
      expect(JSON.stringify(stack.resolve(asg.userData.render()))).toContain('Content-Type: application/node.eks.aws');
      Template.fromStack(stack).resourceCountIs('AWS::AutoScaling::AutoScalingGroup', 1);
    });
  });
});

function newCluster(props: Partial<eks.ClusterProps> = {}) {
  const app = new App();
  const stack = new Stack(app, 'Stack');
  const cluster = new eks.Cluster(stack, 'Cluster', {
    version: eks.KubernetesVersion.V1_30,
    defaultCapacity: 0,
    kubectlLayer: new KubectlV31Layer(stack, 'KubectlLayer'),
    ...props,
  });
  return { stack, cluster };
}

function newClusterAndAsg(spot = false) {
  const { stack, cluster } = newCluster();
  const asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
    instanceType: new ec2.InstanceType('m5.large'),
    machineImage: new ec2.AmazonLinuxImage(),
    spotPrice: spot ? '0.01' : undefined,
    vpc: cluster.vpc,
  });
  return { stack, cluster, asg };
}

function ssmParameterDefaults(stack: Stack): string[] {
  return Object.values(Template.fromStack(stack).toJSON().Parameters ?? {}).map((p: any) => p.Default);
}
