import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { AuroraMysqlEngineVersion, ClusterInstance, Credentials, DatabaseCluster, DatabaseClusterEngine } from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

class ClusterDeleteAutomatedBackupsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    new DatabaseCluster(this, 'Database', {
      engine: DatabaseClusterEngine.auroraMysql({
        version: AuroraMysqlEngineVersion.VER_3_07_1,
      }),
      credentials: Credentials.fromUsername('admin', {
        password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6'),
      }),
      vpc,
      writer: ClusterInstance.provisioned('Writer'),
      deleteAutomatedBackups: true,
    });
  }
}

const stack = new ClusterDeleteAutomatedBackupsStack(app, 'cluster-delete-automated-backups');
new IntegTest(app, 'test-cluster-delete-automated-backups', {
  testCases: [stack],
});
