import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as cdk from 'aws-cdk-lib';
import { AuroraPostgresEngineVersion, ClusterInstance, DatabaseCluster, DatabaseClusterEngine } from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    const kmsKey = new kms.Key(this, 'DbSecurity');

    const cluster = new DatabaseCluster(this, 'Database', {
      engine: DatabaseClusterEngine.auroraPostgres({
        version: AuroraPostgresEngineVersion.VER_16_1,
      }),
      credentials: { username: 'testMasterUsername', encryptionKey: kmsKey },
      manageMasterUserPassword: true,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      vpc,
      writer: ClusterInstance.serverlessV2('writer'),
    });

    cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');

  }
}

const app = new cdk.App();
new IntegTest(app, 'IntegClusterManagedPasswordTest', {
  testCases: [new TestStack(app, 'integ-cluster-managed-password')],
});

app.synth();
