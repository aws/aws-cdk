import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import * as constructs from 'constructs';
import { DatabaseCluster, EngineVersion, InstanceType, ParameterGroupFamily } from '../lib';
import { ClusterParameterGroup } from '../lib/parameter-group';

/*
 * Stack verification steps:
 * * aws docdb describe-db-clusters --db-cluster-identifier <deployed db cluster identifier>
 */

class TestStack extends cdk.Stack {
  constructor(scope: constructs.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2 });

    const kmsKey = new kms.Key(this, 'DbSecurity', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Cluster with default engine (< 1.2.0.0) and associated parameter group (with family neptune1)
    const params = new ClusterParameterGroup(this, 'Params', {
      description: 'A nice parameter group',
      parameters: {
        neptune_enable_audit_log: '1',
        neptune_query_timeout: '100000',
      },
    });
    const cluster = new DatabaseCluster(this, 'Database', {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      instanceType: InstanceType.R5_LARGE,
      clusterParameterGroup: params,
      kmsKey,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoMinorVersionUpgrade: true,
    });
    cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');

    // Cluster with engine 1.2.0.0 and associated parameter group (with family neptune1.2)
    const params12 = new ClusterParameterGroup(this, 'Params12', {
      description: 'A nice parameter group',
      family: ParameterGroupFamily.NEPTUNE_1_2,
      parameters: {
        neptune_enable_audit_log: '1',
        neptune_query_timeout: '100000',
      },
    });
    const cluster12 = new DatabaseCluster(this, 'Database12', {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      instanceType: InstanceType.R5_LARGE,
      engineVersion: EngineVersion.V1_2_0_0,
      clusterParameterGroup: params12,
      kmsKey,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoMinorVersionUpgrade: true,
    });
    cluster12.connections.allowDefaultPortFromAnyIpv4('Open to the world');
  }
}

const app = new cdk.App();

new TestStack(app, 'aws-cdk-neptune-integ');

app.synth();
