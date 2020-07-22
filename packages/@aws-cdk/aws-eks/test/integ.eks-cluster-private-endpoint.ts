/// !cdk-integ pragma:ignore-assets
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { App } from '@aws-cdk/core';
import * as eks from '../lib';
import { TestStack } from './util';

class EksClusterStack extends TestStack {
  constructor(scope: App, id: string) {
    super(scope, id);

    // allow all account users to assume this role in order to admin the cluster
    const mastersRole = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
      natGateways: 1, // just need one nat gateway to simplify the test
      // so that we also validate it works with multiple private subnets per az.
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PRIVATE,
          name: 'Private1',
        },
        {
          subnetType: ec2.SubnetType.PRIVATE,
          name: 'Private2',
        },
        {
          subnetType: ec2.SubnetType.PRIVATE,
          name: 'Private3',
        },
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: 'Public1',
        },
      ],
    });

    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      mastersRole,
      defaultCapacity: 2,
      version: eks.KubernetesVersion.V1_16,
      endpointAccess: eks.EndpointAccess.private(),
    });

    // this is the valdiation. it won't work if the private access is setup properly.
    cluster.addResource('config-map', {
      kind: 'ConfigMap',
      apiVersion: 'v1',
      data: {
        hello: 'world',
      },
      metadata: {
        name: 'config-map',
      },
    });

  }
}


const app = new App();

new EksClusterStack(app, 'aws-cdk-eks-cluster-private-endpoint-test');

app.synth();
