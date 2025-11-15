/// !cdk-integ pragma:disable-update-workflow
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from 'aws-cdk-lib/aws-eks';

const CLUSTER_VERSION = eks.KubernetesVersion.V1_31;

class EksClusterStack extends Stack {
  private cluster: eks.Cluster;
  private vpc: ec2.IVpc;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const mastersRole = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    const secretsEncryptionKey = new kms.Key(this, 'SecretsKey');

    this.vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 3, natGateways: 1, restrictDefaultSecurityGroup: false });

    // create the cluster with a default nodegroup capacity
    this.cluster = new eks.Cluster(this, 'Cluster', {
      vpc: this.vpc,
      mastersRole,
      defaultCapacity: 2,
      ...getClusterVersionConfig(this, CLUSTER_VERSION),
      secretsEncryptionKey,
      tags: {
        foo: 'bar',
      },
      clusterLogging: [
        eks.ClusterLoggingTypes.API,
        eks.ClusterLoggingTypes.AUTHENTICATOR,
        eks.ClusterLoggingTypes.SCHEDULER,
      ],
    });

    this.assertCapacityX86MixedInstancesPolicy();
  }

  private assertCapacityX86MixedInstancesPolicy() {
    this.cluster.addAutoScalingGroupCapacity('NodesMixedInstancesPolicy', {
      minCapacity: 3,
      mixedInstancesPolicy: {
        launchTemplate: new ec2.LaunchTemplate(this, 'template', {
          launchTemplateName: 'launchTemplate',
          instanceType: new ec2.InstanceType('t2.medium'),
          machineImage: new eks.EksOptimizedImage({
            nodeType: eks.NodeType.STANDARD,
            cpuArch: eks.CpuArch.X86_64,
            kubernetesVersion: CLUSTER_VERSION.version,
          }),
          securityGroup: this.cluster.clusterSecurityGroup,
          role: new iam.Role(this, 'role', { assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com') }),
        }),
        launchTemplateOverrides: [],
      },
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new EksClusterStack(app, 'aws-cdk-eks-cluster-mixed-instances-test');
new integ.IntegTest(app, 'aws-cdk-eks-cluster-mixed-instances', {
  testCases: [stack],
  // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
  diffAssets: false,
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});
app.synth();

