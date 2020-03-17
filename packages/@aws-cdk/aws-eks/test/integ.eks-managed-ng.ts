import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { App, CfnOutput } from '@aws-cdk/core';
import * as eks from '../lib';
import { TestStack } from './util';

class EksClusterStack extends TestStack {
  constructor(scope: App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 3,
      natGateways: 1
    });

    // allow all account users to assume this role in order to admin the cluster
    const mastersRole = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal()
    });

    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      mastersRole,
      defaultCapacity: 0,
      version: '1.15'
    });

    const ng = cluster.addNodegroup('nodegroup', {
      instanceType: new ec2.InstanceType('m5.large'),
      minSize: 4,
    });

    new CfnOutput(this, 'ClusterEndpoint', { value: cluster.clusterEndpoint });
    new CfnOutput(this, 'ClusterArn', { value: cluster.clusterArn });
    new CfnOutput(this, 'ClusterName', { value: cluster.clusterName });
    new CfnOutput(this, 'NodegroupName', { value: ng.nodegroupName });
    new CfnOutput(this, 'NodegroupArn', { value: ng.nodegroupArn });
    new CfnOutput(this, 'NodegroupInstanceRole', { value: ng.role.roleName });

  }
}

const app = new App();

// since the EKS optimized AMI is hard-coded here based on the region,
// we need to actually pass in a specific region.
new EksClusterStack(app, 'aws-cdk-eks-ng2');

app.synth();
