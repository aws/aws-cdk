/// !cdk-integ pragma:disable-update-workflow
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { App, CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from 'aws-cdk-lib/aws-eks';

class EksClusterDeletionProtectionStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    // allow all account users to assume this role in order to admin the cluster
    const mastersRole = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    // just need one nat gateway to simplify the test
    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });

    // create cluster with deletion protection enabled
    const clusterWithProtection = new eks.Cluster(this, 'ClusterWithProtection', {
      vpc,
      mastersRole,
      defaultCapacity: 1,
      ...getClusterVersionConfig(this, eks.KubernetesVersion.V1_32),
      deletionProtection: true,
    });

    new CfnOutput(this, 'ClusterWithProtectionName', { value: clusterWithProtection.clusterName });
  }
}

const app = new App();

const stack = new EksClusterDeletionProtectionStack(app, 'aws-cdk-eks-cluster-deletion-protection', {
  env: { region: 'us-east-1' },
});

new integ.IntegTest(app, 'aws-cdk-eks-cluster-deletion-protection-integ', {
  testCases: [stack],
});
