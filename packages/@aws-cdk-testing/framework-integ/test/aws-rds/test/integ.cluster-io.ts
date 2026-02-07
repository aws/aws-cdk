import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Credentials, DatabaseCluster, DatabaseClusterEngine, AuroraPostgresEngineVersion, DBClusterStorageType, ClusterInstance } from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-io-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const cluster = new DatabaseCluster(stack, 'Database', {
  engine: DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.VER_17_6 }),
  credentials: Credentials.fromUsername('adminuser', { password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6') }),
  vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  storageType: DBClusterStorageType.AURORA_IOPT1,
  writer: ClusterInstance.provisioned('writer', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.R6G, ec2.InstanceSize.XLARGE),
  }),
  readers: [
    ClusterInstance.provisioned('reader', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.R6G, ec2.InstanceSize.XLARGE),
    }),
  ],
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');

const role = new iam.Role(stack, 'ClusterIamAccess', {
  assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
});
const clusterIamAuthArn = stack.formatArn({
  service: 'rds-db',
  resource: `dbuser:${cluster.clusterResourceIdentifier}`,
  resourceName: 'db_user',
});
role.addToPolicy(
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: ['rds-db:connect'],
    resources: [clusterIamAuthArn],
  }),
);

new IntegTest(app, 'IntegClusterIO', {
  testCases: [stack],
});

app.synth();
