import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as integTests from '@aws-cdk/integ-tests';
import * as constructs from 'constructs';
import * as rds from '../lib';

interface ClusterLambdaTestStackProps extends cdk.StackProps {
  engine: rds.IClusterEngine;
}

class ClusterLambdaTestStack extends cdk.Stack {
  constructor(
    scope: constructs.Construct,
    id: string,
    props: ClusterLambdaTestStackProps,
  ) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'VPC');
    const role = new iam.Role(this, 'AssociatedRole', {
      assumedBy: new iam.ServicePrincipal('rds.amazonaws.com'),
    });

    new rds.DatabaseCluster(this, 'DatabaseCluster', {
      engine: props.engine,
      instances: 1,
      instanceProps: {
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.BURSTABLE3,
          ec2.InstanceSize.SMALL,
        ),
        vpc,
      },
      lambdaInvocationRole: role,
    });
  }
}

// Beginning of the test suite
const app = new cdk.App();
new integTests.IntegTest(app, 'InstanceUpdateBehaviorTests', {
  testCases: [
    new ClusterLambdaTestStack(app, 'Aurora', {
      engine: rds.DatabaseClusterEngine.AURORA,
    }),
    new ClusterLambdaTestStack(app, 'AuroraMySQLVersion', {
      engine: rds.DatabaseClusterEngine.auroraMysql({
        version: rds.AuroraMysqlEngineVersion.VER_3_02_0,
      }),
    }),
    new ClusterLambdaTestStack(app, 'AuroraPostgreSQLVersion', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_12_6,
      }),
    }),
  ],
});

app.synth();
