import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import type * as constructs from 'constructs';
import { DatabaseCluster, ClusterParameterGroup } from 'aws-cdk-lib/aws-docdb';
import { DOCDB_ENGINE_VERSION, DOCDB_PARAMETER_GROUP_FAMILY } from './docdb-integ-test-constraints';

/*
 * Stack verification steps:
 * * aws docdb describe-db-clusters --db-cluster-identifier <deployed db cluster identifier>
 */

class TestStack extends cdk.Stack {
  constructor(scope: constructs.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    const params = new ClusterParameterGroup(this, 'Params', {
      family: DOCDB_PARAMETER_GROUP_FAMILY,
      description: 'A nice parameter group',
      parameters: {
        audit_logs: 'disabled',
        tls: 'enabled',
        ttl_monitor: 'enabled',
      },
    });

    const kmsKey = new kms.Key(this, 'DbSecurity', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const cluster = new DatabaseCluster(this, 'Database', {
      engineVersion: DOCDB_ENGINE_VERSION,
      masterUser: {
        username: 'docdb',
        password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6'),
      },
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.R5, ec2.InstanceSize.LARGE),
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      vpc,
      parameterGroup: params,
      kmsKey,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      enablePerformanceInsights: true,
    });

    cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');
  }
}

const app = new cdk.App();

new IntegTest(app, 'DocdbClusterInteg', {
  testCases: [new TestStack(app, 'aws-cdk-docdb-integ')],
});

app.synth();
