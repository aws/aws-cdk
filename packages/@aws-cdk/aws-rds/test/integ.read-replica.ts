import { InstanceClass, InstanceSize, InstanceType, SubnetSelection, SubnetType, Vpc } from '@aws-cdk/aws-ec2';
import { App, Duration, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as rds from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'Vpc', {
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
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_13 }),
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

    new rds.DatabaseInstanceReadReplica(this, 'MysqlReplica', {
      sourceDatabaseInstance: mysqlSource,
      backupRetention: Duration.days(3),
      instanceType,
      vpc,
      vpcSubnets,
      parameterGroup,
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-rds-read-replica');
app.synth();
