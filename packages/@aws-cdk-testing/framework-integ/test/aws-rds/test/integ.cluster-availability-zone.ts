import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-cluster-availability-zone');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const cluster = new rds.DatabaseCluster(stack, 'Cluster', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_11_1 }),
  vpc,
  writer: rds.ClusterInstance.provisioned('writer', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
    availabilityZone: vpc.availabilityZones[0],
  }),
  readers: [
    rds.ClusterInstance.serverlessV2('reader', {
      scaleWithWriter: true,
      availabilityZone: vpc.availabilityZones[1],
    }),
  ],
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const integ = new IntegTest(app, 'cluster-availability-zone-integ-test', {
  testCases: [stack],
});

// Verify writer is in the correct AZ
integ.assertions.awsApiCall('RDS', 'describeDBInstances', {
  DBInstanceIdentifier: cluster.instanceIdentifiers[0],
}).expect(ExpectedResult.objectLike({
  DBInstances: [
    {
      AvailabilityZone: vpc.availabilityZones[0],
    },
  ],
}));

// Verify reader is in the correct AZ
integ.assertions.awsApiCall('RDS', 'describeDBInstances', {
  DBInstanceIdentifier: cluster.instanceIdentifiers[1],
}).expect(ExpectedResult.objectLike({
  DBInstances: [
    {
      AvailabilityZone: vpc.availabilityZones[1],
    },
  ],
}));

app.synth();
