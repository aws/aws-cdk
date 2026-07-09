import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as cdk from 'aws-cdk-lib';
import { Credentials, DatabaseInstance, DatabaseInstanceEngine, MysqlEngineVersion } from 'aws-cdk-lib/aws-rds';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends cdk.Stack {
  public readonly instanceId: string;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    // Create a KMS key for secrets encryption
    const kmsKey = new kms.Key(this, 'SecretsKey', {
      description: 'KMS key for RDS secrets encryption',
    });

    // Create a database instance with manageMasterUserPassword enabled
    const instance = new DatabaseInstance(this, 'DatabaseInstance', {
      engine: DatabaseInstanceEngine.mysql({
        version: MysqlEngineVersion.VER_8_0_46,
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      manageMasterUserPassword: true,
      credentials: Credentials.fromUsername('testadmin', {
        encryptionKey: kmsKey,
      }),
    });

    this.instanceId = instance.instanceIdentifier;
  }
}

const app = new cdk.App();
const stack = new TestStack(app, 'aws-cdk-rds-instance-manage-master-password-integ');
const integ = new IntegTest(app, 'test-rds-instance-manage-master-password', {
  testCases: [stack],
});

// Verify that RDS created and manages the master user secret
integ.assertions.awsApiCall('RDS', 'describeDBInstances', {
  DBInstanceIdentifier: stack.instanceId,
}).expect(ExpectedResult.objectLike({
  DBInstances: [{ MasterUserSecret: { SecretStatus: 'active' } }],
}));
