import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as cdk from 'aws-cdk-lib';
import { AuroraMysqlEngineVersion, ClusterInstance, Credentials, DatabaseCluster, DatabaseClusterEngine, ParameterGroup } from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const params = new ParameterGroup(stack, 'Params', {
  engine: DatabaseClusterEngine.auroraMysql({
    version: AuroraMysqlEngineVersion.VER_3_03_0,
  }),
  description: 'A nice parameter group',
  parameters: {
    character_set_database: 'utf8mb4',
  },
});

const kmsKey = new kms.Key(stack, 'DbSecurity');

const instanceProps = {
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  isFromLegacyInstanceProps: true,
};
const cluster = new DatabaseCluster(stack, 'Database', {
  engine: DatabaseClusterEngine.auroraMysql({
    version: AuroraMysqlEngineVersion.VER_3_03_0,
  }),
  credentials: Credentials.fromUsername('admin', { password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6') }),
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  vpc,
  writer: ClusterInstance.provisioned('Instance1', {
    ...instanceProps,
  }),
  readers: [
    ClusterInstance.provisioned('Instance2', {
      ...instanceProps,
    }),
  ],
  parameterGroup: params,
  storageEncryptionKey: kmsKey,
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

app.synth();
