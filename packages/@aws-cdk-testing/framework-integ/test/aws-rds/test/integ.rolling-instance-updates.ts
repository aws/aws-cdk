import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integTests from '@aws-cdk/integ-tests-alpha';
import * as constructs from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';

interface RollingInstanceUpdateTestStackProps extends cdk.StackProps {
  instanceUpdateBehaviour: rds.InstanceUpdateBehaviour;
}

class RollingInstanceUpdateTestStack extends cdk.Stack {
  constructor(scope: constructs.Construct, id: string, props: RollingInstanceUpdateTestStackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'Vpc', {
      restrictDefaultSecurityGroup: false,
      maxAzs: 2,
    });

    new rds.DatabaseCluster(this, 'DatabaseCluster', {
      engine: rds.DatabaseClusterEngine.auroraMysql({
        version: rds.AuroraMysqlEngineVersion.VER_3_07_1,
      }),
      instances: 3,
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
        vpc,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      instanceUpdateBehaviour: props.instanceUpdateBehaviour,
    });
  }
}

// Beginning of the test suite
const app = new cdk.App();
new integTests.IntegTest(app, 'InstanceUpdateBehaviorTests', {
  testCases: [
    new RollingInstanceUpdateTestStack(app, 'BulkUpdate', {
      instanceUpdateBehaviour: rds.InstanceUpdateBehaviour.BULK,
    }),
    new RollingInstanceUpdateTestStack(app, 'RollingUpdate', {
      instanceUpdateBehaviour: rds.InstanceUpdateBehaviour.ROLLING,
    }),
  ],
});

app.synth();
