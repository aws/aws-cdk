import { App, Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as eks from '../lib';
import { KubectlV33Layer } from '@aws-cdk/lambda-layer-kubectl-v33';

class EksClusterStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1 });
    new eks.Cluster(this, 'Cluster', {
      vpc,
      version: eks.KubernetesVersion.V1_33,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV33Layer(this, 'kubectlLayer'),
      },
      defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
      defaultCapacity: 0,
      endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
      vpcSubnets: [{ subnetType: ec2.SubnetType.PUBLIC }],
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new EksClusterStack(app, 'aws-cdk-eks-cluster-stack');
new integ.IntegTest(app, 'aws-cdk-eks-cluster', {
  testCases: [stack],
  // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
  diffAssets: false,
});
