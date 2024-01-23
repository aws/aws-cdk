import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ds from 'aws-cdk-lib/aws-directoryservice';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'instance-kerberos');
const vpc = new ec2.Vpc(stack, 'VPC');

const iamRole = new iam.Role(stack, 'Role', {
  assumedBy: new iam.CompositePrincipal(
    new iam.ServicePrincipal('rds.amazonaws.com'),
    new iam.ServicePrincipal('directoryservice.rds.amazonaws.com'),
  ),
  managedPolicies: [
    iam.ManagedPolicy.fromManagedPolicyArn(stack, 'RdsRole', 'arn:aws:iam::aws:policy/service-role/AmazonRDSDirectoryServiceAccess'),
  ],
});

const activeDirectory = new ds.CfnMicrosoftAD(stack, 'AD', {
  name: 'test-directory.com',
  password: 'Password123!',
  vpcSettings: {
    vpcId: vpc.vpcId,
    subnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
  },
});

new rds.DatabaseInstance(stack, 'Database', {
  engine: rds.DatabaseInstanceEngine.mysql({
    version: rds.MysqlEngineVersion.VER_8_0_35,
  }),
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  vpc,
  domain: activeDirectory.ref,
  domainRole: iamRole,
});

new integ.IntegTest(app, 'integ-instance-kerberos', {
  testCases: [stack],
});

app.synth();