import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as cdk from 'aws-cdk-lib';
import { AuroraMysqlEngineVersion, ClusterInstance, Credentials, DatabaseCluster, DatabaseClusterEngine, ParameterGroup } from 'aws-cdk-lib/aws-rds';
import { AURORA_CLUSTER_CHANGE_SCOPE_OF_INSTANCE_PARAMETER_GROUP_WITH_EACH_PARAMETERS } from 'aws-cdk-lib/cx-api';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

let featureFlag = false;

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

    const params = new ParameterGroup(this, 'Params', {
      engine: DatabaseClusterEngine.auroraMysql({
        version: AuroraMysqlEngineVersion.VER_3_07_1,
      }),
      description: 'A nice parameter group',
      parameters: {
        character_set_database: 'utf8mb4',
      },
    });

    const kmsKey = new kms.Key(this, 'DbSecurity');

    const instanceProps = {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
      isFromLegacyInstanceProps: true,
      preferredMaintenanceWindow: 'Sat:22:15-Sat:22:45',
    };

    const readers = featureFlag
      ? [
        ClusterInstance.provisioned('Instance2', {
          ...instanceProps,
          parameters: {},
        }),
        ClusterInstance.provisioned('Instance3', {
          ...instanceProps,
          parameters: {},
        }),
      ]
      : [
        ClusterInstance.provisioned('Instance2', {
          ...instanceProps,
          parameters: {},
        }),
      ];

    const cluster = new DatabaseCluster(this, 'Database', {
      engine: DatabaseClusterEngine.auroraMysql({
        version: AuroraMysqlEngineVersion.VER_3_07_1,
      }),
      credentials: Credentials.fromUsername('admin', { password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6') }),
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      vpc,
      writer: ClusterInstance.provisioned('Instance1', {
        ...instanceProps,
      }),
      readers: readers,
      parameterGroup: params,
      storageEncryptionKey: kmsKey,
      autoMinorVersionUpgrade: false,
    });

    cluster.connections.allowDefaultPortFromAnyIpv4('Open to the world');

    const role = new iam.Role(this, 'ClusterIamAccess', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });
    const clusterIamAuthArn = this.formatArn({
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
  }
}

const app = new cdk.App();
const stack = new TestStack(app, 'aws-cdk-rds-integ');
new IntegTest(app, 'test-rds-cluster', {
  testCases: [stack],
});
app.synth();

featureFlag = true;
const appWithFeatureFlag = new cdk.App({
  context: { [AURORA_CLUSTER_CHANGE_SCOPE_OF_INSTANCE_PARAMETER_GROUP_WITH_EACH_PARAMETERS]: true },
});
const stackWithFeatureFlag = new TestStack(appWithFeatureFlag, 'aws-cdk-rds-integ-with-feature-flag');
new IntegTest(appWithFeatureFlag, 'test-rds-cluster-with-feature-flag', {
  testCases: [stackWithFeatureFlag],
});
appWithFeatureFlag.synth();
