import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { INTEG_TEST_LATEST_AURORA_MYSQL } from './db-versions';
import * as cdk from 'aws-cdk-lib';
import { IntegTestBaseStack } from './integ-test-base-stack';
import * as integTests from '@aws-cdk/integ-tests-alpha';
import type * as constructs from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';

interface RollingInstanceUpdateTestStackProps extends cdk.StackProps {
  instanceUpdateBehaviour: rds.InstanceUpdateBehaviour;
}

class RollingInstanceUpdateTestStack extends IntegTestBaseStack {
  constructor(scope: constructs.Construct, id: string, props: RollingInstanceUpdateTestStackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'Vpc', {
      restrictDefaultSecurityGroup: false,
      maxAzs: 2,
    });

    new rds.DatabaseCluster(this, 'DatabaseCluster', {
      engine: rds.DatabaseClusterEngine.auroraMysql({
        version: INTEG_TEST_LATEST_AURORA_MYSQL,
      }),
      instances: 3,
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
        vpc,
      },
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

