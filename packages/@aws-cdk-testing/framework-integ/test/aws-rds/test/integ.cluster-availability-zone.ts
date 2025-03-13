import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as rds from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'rds-cluster-with-availability-zone');

const vpc = new ec2.Vpc(stack, 'VPC', { natGateways: 0, restrictDefaultSecurityGroup: false });
const [azForWriter, azForReader] = vpc.availabilityZones;

new rds.DatabaseCluster(stack, 'Cluster', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_08_1 }),
  credentials: rds.Credentials.fromUsername('admin', { password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6') }),
  writer: rds.ClusterInstance.provisioned('Writer', {
    instanceIdentifier: 'writer-instance',
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MEDIUM),
    availabilityZone: azForWriter,
  }),
  readers: [
    rds.ClusterInstance.serverlessV2('Reader', {
      instanceIdentifier: 'reader-instance',
      availabilityZone: azForReader,
      scaleWithWriter: true,
    }),
  ],
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const integ = new IntegTest(app, 'cluster-with-availability-zone-integ', {
  testCases: [stack],
});

integ.assertions.awsApiCall('rds', 'describeDbInstances', {
  DBInstanceIdentifier: 'writer-instance',
}).expect(ExpectedResult.objectLike({
  DBInstances: [{ AvailabilityZone: azForWriter }],
}));

integ.assertions.awsApiCall('rds', 'describeDbInstances', {
  DBInstanceIdentifier: 'reader-instance',
}).expect(ExpectedResult.objectLike({
  DBInstances: [{ AvailabilityZone: azForReader }],
}));
