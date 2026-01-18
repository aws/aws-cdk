/// !cdk-integ pragma:disable-update-workflow
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from 'aws-cdk-lib/aws-eks';
import { EKS_NODEGROUP_USE_PULL_ONLY_ECR_POLICY } from 'aws-cdk-lib/cx-api';

/**
 * This integration test verifies that the EKS node group works correctly
 * when using the AmazonEC2ContainerRegistryPullOnly managed policy instead
 * of AmazonEC2ContainerRegistryReadOnly.
 *
 * The feature flag @aws-cdk/aws-eks:nodegroupUsePullOnlyEcrPolicy enables
 * the use of the more restrictive PullOnly policy which:
 * - Provides minimal permissions required to pull container images from ECR
 * - Supports ECR pull-through cache via ecr:BatchImportUpstreamImage action
 * - Aligns with least-privilege security principles
 */
class EksClusterEcrPullOnlyStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Just need one NAT gateway to simplify the test
    const vpc = new ec2.Vpc(this, 'Vpc', {
      natGateways: 1,
      restrictDefaultSecurityGroup: false,
    });

    // Create the cluster with a default managed nodegroup
    // The nodegroup role will use AmazonEC2ContainerRegistryPullOnly
    // because the feature flag is enabled
    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      defaultCapacity: 1,
      defaultCapacityInstance: new ec2.InstanceType('t3.medium'),
      ...getClusterVersionConfig(this, eks.KubernetesVersion.V1_32),
    });

    // Also test addNodegroupCapacity method
    cluster.addNodegroupCapacity('ExtraNodegroup', {
      instanceTypes: [new ec2.InstanceType('t3.medium')],
      minSize: 1,
      maxSize: 1,
    });
  }
}

const app = new App({
  postCliContext: {
    // Enable the ECR pull-only policy feature flag
    [EKS_NODEGROUP_USE_PULL_ONLY_ECR_POLICY]: true,
    // Disable other flags that may interfere
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

const stack = new EksClusterEcrPullOnlyStack(app, 'aws-cdk-eks-nodegroup-ecr-pull-only-test');

new integ.IntegTest(app, 'aws-cdk-eks-nodegroup-ecr-pull-only', {
  testCases: [stack],
  // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
  diffAssets: false,
});

app.synth();
