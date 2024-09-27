import { InstanceClass, InstanceSize, InstanceType, SubnetSelection, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { App, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cxapi from 'aws-cdk-lib/cx-api';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'Vpc', {
      restrictDefaultSecurityGroup: false,
      maxAzs: 2,
      subnetConfiguration: [
        {
          name: 'isolated',
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    const instanceType = InstanceType.of(InstanceClass.T3, InstanceSize.SMALL);

    const vpcSubnets: SubnetSelection = { subnetType: SubnetType.PRIVATE_ISOLATED };

    const postgresSource = new rds.DatabaseInstance(this, 'PostgresSource', {
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_16_3 }),
      backupRetention: Duration.days(5),
      instanceType,
      vpc,
      vpcSubnets,
    });

    new rds.DatabaseInstanceReadReplica(this, 'PostgresReplica', {
      sourceDatabaseInstance: postgresSource,
      instanceType,
      vpc,
      vpcSubnets,
    });

    const mysqlSource = new rds.DatabaseInstance(this, 'MysqlSource', {
      engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0 }),
      backupRetention: Duration.days(5),
      instanceType,
      vpc,
      vpcSubnets,
    });

    const parameterGroup = new rds.ParameterGroup(this, 'ReplicaParameterGroup', {
      engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0 }),
      parameters: {
        wait_timeout: '86400',
      },
    });

    const mysqlReadReplicaInstance = new rds.DatabaseInstanceReadReplica(this, 'MysqlReplica', {
      sourceDatabaseInstance: mysqlSource,
      backupRetention: Duration.days(3),
      instanceType,
      vpc,
      vpcSubnets,
      parameterGroup,
    });

    const role = new iam.Role(this, 'DBRole', {
      assumedBy: new iam.AccountPrincipal(this.account),
    });

    const user = new iam.User(this, 'DBUser', {
      userName: 'dbuser',
    });

    mysqlReadReplicaInstance.grantConnect(role, user.userName);
  }
}

const app = new App({ context: { [cxapi.USE_CORRECT_VALUE_FOR_INSTANCE_RESOURCE_ID_PROPERTY]: true } });
const stack = new TestStack(app, 'cdk-rds-read-replica');

new IntegTest(app, 'instance-dual-test', {
  testCases: [stack],
});

app.synth();
