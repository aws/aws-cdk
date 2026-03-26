/// !cdk-integ pragma:disable-update-workflow
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from 'aws-cdk-lib/aws-eks';
import { EKS_USE_NATIVE_OIDC_PROVIDER, IAM_OIDC_REJECT_UNAUTHORIZED_CONNECTIONS } from 'aws-cdk-lib/cx-api';

class EksClusterInferenceStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    // just need one nat gateway to simplify the test
    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });

    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      defaultCapacity: 0,
      ...getClusterVersionConfig(this),
      albController: {
        version: eks.AlbControllerVersion.V2_6_2,
      },
    });

    cluster.addNodegroupCapacity('DefaultCapacity', {
      minSize: 2,
      amiType: eks.NodegroupAmiType.AL2023_X86_64_STANDARD,
    });

    cluster.addNodegroupCapacity('InferenceInstances', {
      instanceTypes: [new ec2.InstanceType('inf1.2xlarge')],
      amiType: eks.NodegroupAmiType.AL2023_X86_64_NEURON,
    });

    cluster.addNodegroupCapacity('Inference2Instances', {
      instanceTypes: [new ec2.InstanceType('inf2.xlarge')],
      amiType: eks.NodegroupAmiType.AL2023_X86_64_NEURON,
    });
  }
}

const app = new App({
  context: { '@aws-cdk/core:disableGitSource': true },
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    [IAM_OIDC_REJECT_UNAUTHORIZED_CONNECTIONS]: false,
    [EKS_USE_NATIVE_OIDC_PROVIDER]: false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new EksClusterInferenceStack(app, 'aws-cdk-eks-cluster-inference-nodegroup');
new integ.IntegTest(app, 'aws-cdk-eks-cluster-interence-nodegroup-integ', {
  testCases: [stack],
  // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
  diffAssets: false,
  // inf1.2xlarge and inf2.xlarge (AWS Inferentia) instances are only available in select regions.
  // Verified via: aws ec2 describe-instance-type-offerings --filters Name=instance-type,Values=inf2.xlarge
  regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-south-1', 'sa-east-1'],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
    // Teardown may fail due to ENIs/ALBs holding subnet dependencies.
    // See https://github.com/aws/aws-cdk/issues/9970
    destroy: {
      expectError: true,
    },
  },
});
app.synth();
