import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();

class DatabaseInstanceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { restrictDefaultSecurityGroup: false });

    new rds.DatabaseInstance(this, 'Instance', {
      engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_21 }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
      credentials: rds.Credentials.fromGeneratedSecret('admin', { excludeCharacters: '!&*^#@()' }),
      vpc,
      databaseName: 'CDKDB',
      storageEncrypted: true,
      backupRetention: cdk.Duration.days(0),
      deleteAutomatedBackups: true,
    });
  }
}

new DatabaseInstanceStack(app, 'aws-cdk-rds-fixed-username');
app.synth();
