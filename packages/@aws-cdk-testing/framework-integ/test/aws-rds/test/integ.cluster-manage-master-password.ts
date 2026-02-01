import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as cdk from 'aws-cdk-lib';
import { AuroraMysqlEngineVersion, ClusterInstance, Credentials, DatabaseCluster, DatabaseClusterEngine } from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    // Create a KMS key for secrets encryption
    const kmsKey = new kms.Key(this, 'SecretsKey', {
      description: 'KMS key for RDS secrets encryption',
    });

    // Create a database cluster with manageMasterUserPassword enabled
    new DatabaseCluster(this, 'DatabaseCluster', {
      engine: DatabaseClusterEngine.auroraMysql({
        version: AuroraMysqlEngineVersion.VER_3_10_1,
      }),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      writer: ClusterInstance.provisioned('Writer', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
      }),
      manageMasterUserPassword: true,
      credentials: Credentials.fromUsername('testadmin', {
        encryptionKey: kmsKey,
      }),
    });
  }
}

const app = new cdk.App();
const stack = new TestStack(app, 'aws-cdk-rds-cluster-manage-master-password-integ');
new IntegTest(app, 'test-rds-cluster-manage-master-password', {
  testCases: [stack],
});
