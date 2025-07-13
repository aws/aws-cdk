import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-integ-instance-create-grant');

const vpc = new ec2.Vpc(stack, 'VPC');

const instance = new rds.DatabaseInstance(stack, 'Instance', {
  vpc,
  vpcSubnets: {
    subnetType: ec2.SubnetType.PUBLIC,
  },
  engine: rds.DatabaseInstanceEngine.postgres({
    version: rds.PostgresEngineVersion.VER_14,
  }),
  instanceType: ec2.InstanceType.of(
    ec2.InstanceClass.T3,
    ec2.InstanceSize.MICRO,
  ),
  credentials: rds.Credentials.fromGeneratedSecret('dbuser'),
  multiAz: false,
  deletionProtection: false,
  publiclyAccessible: false,
  backupRetention: cdk.Duration.days(0),
});

const role = new iam.Role(stack, 'DBRole', {
  assumedBy: new iam.AccountPrincipal(stack.account),
});

instance.grantConnect(role);

new integ.IntegTest(app, 'rds-integ-instance-create-grant', {
  testCases: [stack],
});

app.synth();
