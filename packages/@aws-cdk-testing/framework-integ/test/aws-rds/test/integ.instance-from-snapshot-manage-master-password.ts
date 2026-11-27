import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { DatabaseInstanceFromSnapshot, DatabaseInstanceEngine, OracleEngineVersion } from 'aws-cdk-lib/aws-rds';
import { IntegTestBaseStack } from './integ-test-base-stack';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends IntegTestBaseStack {
  public readonly instanceId: string;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    const instance = new DatabaseInstanceFromSnapshot(this, 'OracleFromSnapshot', {
      snapshotIdentifier: 'aws-cdk-rds-instance-from-snapshot-manage-master-password-integ',
      engine: DatabaseInstanceEngine.oracleSe2({
        version: OracleEngineVersion.VER_19_0_0_0_2020_04_R1,
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
      vpc,
      manageMasterUserPassword: true,
    });

    this.instanceId = instance.instanceIdentifier;
  }
}

const app = new cdk.App();
const stack = new TestStack(app, 'aws-cdk-rds-instance-from-snapshot-manage-master-password-integ');

new IntegTest(app, 'test-rds-instance-from-snapshot-manage-master-password', {
  testCases: [stack],
});
