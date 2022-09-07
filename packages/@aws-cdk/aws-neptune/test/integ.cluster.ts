import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as constructs from 'constructs';
import { DatabaseCluster, EngineVersion, InstanceType, ParameterGroupFamily } from '../lib';
import { ClusterParameterGroup } from '../lib/parameter-group';

/*
 * Test creating a cluster without specifying engine version.
 * This defaults to  engine version < 1.2.0.0 and associated parameter group with family neptune1
 *
 * Stack verification steps:
 * * aws docdb describe-db-clusters --db-cluster-identifier <deployed db cluster identifier>
 */

interface TestStackProps extends cdk.StackProps {
  engineVersion?: EngineVersion;
  parameterGroupFamily?: ParameterGroupFamily;
}

class TestStack extends cdk.Stack {
  constructor(scope: constructs.Construct, id: string, props?: TestStackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2 });

    const params = new ClusterParameterGroup(this, 'Params', {
      family: props?.parameterGroupFamily,
      description: 'A nice parameter group',
      parameters: {
        neptune_enable_audit_log: '1',
        neptune_query_timeout: '100000',
      },
    });

    const kmsKey = new kms.Key(this, 'DbSecurity', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const cluster = new DatabaseCluster(this, 'Database', {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      instanceType: InstanceType.R5_LARGE,
      clusterParameterGroup: params,
      kmsKey,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      engineVersion: props?.engineVersion,
    });

    cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');
  }
}

const app = new cdk.App();

// Test creating a cluster without specifying engine version that defaults to engine version < 1.2.0.0 and associated parameter group with family neptune1
const defaultEngineVersionCluster = new TestStack(app, 'aws-cdk-neptune-cluster-default-ev-integ');

// Test creating a cluster with engine version 1.2.0.0 and associated parameter group with family neptune1.2
const engineVersion12Cluster = new TestStack(app, 'aws-cdk-neptune-cluster-12-ev-integ', {
  engineVersion: EngineVersion.V1_2_0_0,
  parameterGroupFamily: ParameterGroupFamily.NEPTUNE_1_2,
});

new integ.IntegTest(app, 'ClusterTest', {
  testCases: [defaultEngineVersionCluster, engineVersion12Cluster],
});

app.synth();
