/// !cdk-integ pragma:disable-update-workflow
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as hello from './hello-k8s';
import * as eks from 'aws-cdk-lib/aws-eks';

class EksAutoModeClusterStack extends Stack {
  private cluster: eks.Cluster;
  private vpc: ec2.IVpc;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const clusterRole = new iam.Role(this, 'EksAutoClusterRole', {
      assumedBy: new iam.ServicePrincipal('eks.amazonaws.com'),
      roleName: 'AmazonEKSAutoClusterRole',
    });
    clusterRole.assumeRolePolicy?.addStatements(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('eks.amazonaws.com')],
        actions: ['sts:TagSession'],
      }),
    );
    clusterRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSComputePolicy'));
    clusterRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSBlockStoragePolicy'));
    clusterRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSLoadBalancingPolicy'));
    clusterRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSNetworkingPolicy'));
    clusterRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSClusterPolicy'));

    const nodeRole = new iam.Role(this, 'EksAutoNodeRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      roleName: 'AmazonEKSAutoNodeRole',
    });
    nodeRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSWorkerNodeMinimalPolicy'));
    nodeRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryPullOnly'));

    this.vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 3, natGateways: 1 });

    this.cluster = new eks.Cluster(this, 'AutoModeCluster', {
      vpc: this.vpc,
      role: clusterRole,
      version: eks.KubernetesVersion.V1_31,
      clusterName: 'auto-mode-cluster',
      authenticationMode: eks.AuthenticationMode.API,
      computeConfig: {
        enabled: true,
        nodePools: ['system'],
        nodeRoleArn: nodeRole.roleArn,
      },
      storageConfig: {
        blockStorage: {
          enabled: true,
        },
      },
      elasticLoadBalancing: {
        enabled: true,
      },
    });

    this.assertSimpleManifest();
  }

  private assertSimpleManifest() {
    // apply a kubernetes manifest
    this.cluster.addManifest('HelloApp', ...hello.resources);
  }
}
const app = new App();

const stack = new EksAutoModeClusterStack(app, 'aws-cdk-eks-auto-mode-cluster', {
  env: { region: 'us-east-1' },
});

new integ.IntegTest(app, 'aws-cdk-eks-auto-mode-cluster-integ', {
  testCases: [stack],
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
