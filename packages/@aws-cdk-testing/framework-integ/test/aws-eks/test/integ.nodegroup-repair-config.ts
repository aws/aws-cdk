import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { App, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from 'aws-cdk-lib/aws-eks';
import { NodegroupAmiType } from 'aws-cdk-lib/aws-eks';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'aws-cdk-eks-nodegroup-repair-config-test');

const mastersRole = new iam.Role(stack, 'AdminRole', {
  assumedBy: new iam.AccountRootPrincipal(),
});

const vpc = new ec2.Vpc(stack, 'Vpc', { natGateways: 1, restrictDefaultSecurityGroup: false });

const cluster = new eks.Cluster(stack, 'Cluster', {
  vpc,
  mastersRole,
  defaultCapacity: 0,
  ...getClusterVersionConfig(stack, eks.KubernetesVersion.V1_31),
});

const nodegroup = cluster.addNodegroupCapacity('MNG_AL2023_X86_64_STANDARD', {
  amiType: NodegroupAmiType.AL2023_X86_64_STANDARD,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
  enableNodeAutoRepair: true,
});

const integTest = new IntegTest(app, 'aws-cdk-eks-nodegroup-repair-config', {
  testCases: [stack],
  // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
  diffAssets: false,
});

integTest.assertions.awsApiCall('eks', 'describeNodegroup', {
  clusterName: cluster.clusterName,
  nodegroupName: nodegroup.nodegroupName,
}).expect(ExpectedResult.objectLike({
  nodegroup: {
    nodeRepairConfig: {
      enabled: true,
    },
  },
}));
