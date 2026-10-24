/// !cdk-integ pragma:disable-update-workflow
import * as integ from '@aws-cdk/integ-tests-alpha';
import { KubectlV33Layer } from '@aws-cdk/lambda-layer-kubectl-v33';
import { App, Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as eks from 'aws-cdk-lib/aws-eks-v2';

/**
 * Regression test: when endpoint access is PRIVATE, publicAccessCidrs must be
 * emitted as an empty array rather than omitted. Omitting it caused CloudFormation
 * to retain any previously-configured CIDRs during stack updates.
 */
class EksPrivateEndpointCidrsStack extends Stack {
  public readonly clusterName: string;

  constructor(scope: App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });

    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      endpointAccess: eks.EndpointAccess.PRIVATE,
      version: eks.KubernetesVersion.V1_33,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV33Layer(this, 'KubectlLayer'),
      },
    });

    this.clusterName = cluster.clusterName;
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new EksPrivateEndpointCidrsStack(app, 'aws-cdk-eks-private-endpoint-cidrs-test');
const integTest = new integ.IntegTest(app, 'aws-cdk-eks-private-endpoint-cidrs', {
  testCases: [stack],
  diffAssets: false,
});

// Verify that publicAccessCidrs is empty (not omitted) when endpoint access is PRIVATE.
integTest.assertions.awsApiCall('EKS', 'describeCluster', {
  name: stack.clusterName,
}).expect(integ.ExpectedResult.objectLike({
  cluster: {
    resourcesVpcConfig: {
      endpointPrivateAccess: true,
      endpointPublicAccess: false,
      publicAccessCidrs: [],
    },
  },
}));
