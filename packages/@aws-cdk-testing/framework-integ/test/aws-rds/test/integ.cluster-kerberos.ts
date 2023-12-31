import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new cdk.App();

const stack = new cdk.Stack(app);
const vpc = new ec2.Vpc(stack, 'VPC');

const iamRole = new iam.Role(stack, 'Role', {
  assumedBy: new iam.ServicePrincipal('rds.amazonaws.com'),
  managedPolicies: [
    iam.ManagedPolicy.fromManagedPolicyArn(stack, 'RdsRole', 'arn:aws:iam::aws:policy/service-role/AmazonRDSDirectoryServiceAccess'),
  ],
});

new rds.DatabaseCluster(stack, 'Database', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_05_1 }),
  writer: rds.ClusterInstance.provisioned('Instance', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  }),
  vpc,
  domain: 'myDomain.com',
  domainIamRoleName: iamRole.roleName,
});

new integ.IntegTest(app, 'cluster-kerberos', {
  testCases: [stack],
});

app.synth();