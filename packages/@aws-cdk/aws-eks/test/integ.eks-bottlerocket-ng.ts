/// !cdk-integ pragma:ignore-assets
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
// import * as kms from '@aws-cdk/aws-kms';
import { App } from '@aws-cdk/core';
// import * as cdk8s from 'cdk8s';
// import * as kplus from 'cdk8s-plus';
// import * as constructs from 'constructs';
import * as eks from '../lib';
import { NodegroupAmiType } from '../lib';
// import * as hello from './hello-k8s';
// import { Pinger } from './pinger/pinger';
import { TestStack } from './util';


class EksClusterStack extends TestStack {

  private cluster: eks.Cluster;
  private vpc: ec2.IVpc;

  constructor(scope: App, id: string) {
    super(scope, id);

    // allow all account users to assume this role in order to admin the cluster
    const mastersRole = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    // just need one nat gateway to simplify the test
    this.vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 3, natGateways: 1 });

    // create the cluster with a default nodegroup capacity
    this.cluster = new eks.Cluster(this, 'Cluster', {
      vpc: this.vpc,
      mastersRole,
      defaultCapacity: 0,
      version: eks.KubernetesVersion.V1_21,
    });

    this.cluster.addNodegroupCapacity('BottlerocketNG', {
      amiType: NodegroupAmiType.BOTTLEROCKET_X86_64,
    })
  }
}

const app = new App();

// since the EKS optimized AMI is hard-coded here based on the region,
// we need to actually pass in a specific region.
new EksClusterStack(app, 'aws-cdk-eks-cluster-test');

app.synth();
