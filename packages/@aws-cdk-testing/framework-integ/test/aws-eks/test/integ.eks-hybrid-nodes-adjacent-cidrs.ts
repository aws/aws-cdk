/// !cdk-integ pragma:disable-update-workflow
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as eks from 'aws-cdk-lib/aws-eks';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';

// Regression coverage: remote node and pod CIDRs 10.0.2.0/23 and 10.0.20.0/24
// are numerically disjoint but previously tripped a false-positive overlap
// check that compared dotted-decimal IPs lexicographically ("20" sorts before
// "3" as a string).
class EksHybridNodesAdjacentCidrsStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
      natGateways: 1,
      restrictDefaultSecurityGroup: false,
      ipAddresses: ec2.IpAddresses.cidr('192.168.0.0/16'),
    });
    new eks.Cluster(this, 'Cluster', {
      vpc,
      ...getClusterVersionConfig(this, eks.KubernetesVersion.V1_30),
      defaultCapacity: 0,
      remoteNodeNetworks: [
        {
          cidrs: ['10.0.2.0/23'],
        },
      ],
      remotePodNetworks: [
        {
          cidrs: ['10.0.20.0/24'],
        },
      ],
      authenticationMode: eks.AuthenticationMode.API,
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new EksHybridNodesAdjacentCidrsStack(app, 'aws-cdk-eks-cluster-hybrid-nodes-adjacent-cidrs');
new integ.IntegTest(app, 'aws-cdk-eks-cluster-hybrid-nodes-adjacent-cidrs-integ', {
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
