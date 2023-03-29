/// !cdk-integ pragma:disable-update-workflow
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { App, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from '../lib';
import { NodegroupAmiType } from '../lib';

class EksClusterStack extends Stack {

  private cluster: eks.Cluster;
  private vpc: ec2.IVpc;

  constructor(scope: App, id: string) {
    super(scope, id);

    // allow all account users to assume this role in order to admin the cluster
    const mastersRole = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    // just need one nat gateway to simplify the test
    this.vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1 });

    // create the cluster with a default nodegroup capacity
    this.cluster = new eks.Cluster(this, 'Cluster', {
      vpc: this.vpc,
      mastersRole,
      defaultCapacity: 0,
      ...getClusterVersionConfig(this),
    });

    this.cluster.addNodegroupCapacity('BottlerocketNG1', {
      amiType: NodegroupAmiType.BOTTLEROCKET_X86_64,
    });
    this.cluster.addNodegroupCapacity('BottlerocketNG2', {
      amiType: NodegroupAmiType.BOTTLEROCKET_ARM_64,
    });
  }
}

const app = new App();

const stack = new EksClusterStack(app, 'aws-cdk-eks-cluster-bottlerocket-ng-test');
new integ.IntegTest(app, 'aws-cdk-eks-cluster-bottlerocket-ng', {
  testCases: [stack],
});
app.synth();
