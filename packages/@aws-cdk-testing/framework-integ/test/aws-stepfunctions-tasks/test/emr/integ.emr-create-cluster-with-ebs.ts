import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { App, Duration, Size, Stack, Tags } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { EmrCreateCluster } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Vpc } from 'aws-cdk-lib/aws-ec2';

const app = new App();

const stack = new Stack(app, 'emr-create-cluster-ebs');
const vpc = new Vpc(stack, 'Vpc', { restrictDefaultSecurityGroup: false });
// https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-managed-iam-policies.html#manually-tagged-resources
Tags.of(vpc).add('for-use-with-amazon-emr-managed-policies', 'true');

const step = new EmrCreateCluster(stack, 'EmrCreateCluster', {
  instances: {
    instanceFleets: [
      {
        instanceFleetType: EmrCreateCluster.InstanceRoleType.CORE,
        instanceTypeConfigs: [
          {
            instanceType: 'm5.xlarge',
          },
        ],
        targetOnDemandCapacity: 1,
      },
      {
        instanceFleetType: EmrCreateCluster.InstanceRoleType.MASTER,
        instanceTypeConfigs: [
          {
            instanceType: 'm5.xlarge',
          },
        ],
        targetOnDemandCapacity: 1,
      },
    ],
    ec2SubnetId: vpc.publicSubnets[0].subnetId,
  },
  name: 'Cluster',
  releaseLabel: 'emr-7.9.0',
  integrationPattern: sfn.IntegrationPattern.RUN_JOB,
  ebsRootVolumeIops: 4000,
  ebsRootVolumeSize: Size.gibibytes(20),
  ebsRootVolumeThroughput: 200,
  managedScalingPolicy: {
    computeLimits: {
      unitType: EmrCreateCluster.ComputeLimitsUnitType.INSTANCE_FLEET_UNITS,
      maximumCapacityUnits: 4,
      minimumCapacityUnits: 1,
      maximumOnDemandCapacityUnits: 4,
      maximumCoreCapacityUnits: 2,
    },
  },
});

const sm = new sfn.StateMachine(stack, 'SM', {
  definition: step,
});

const integTest = new IntegTest(app, 'emr-create-cluster-ebs-integ', {
  testCases: [stack],
});

const start = integTest.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: sm.stateMachineArn,
});

const describe = integTest.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
});
start.next(describe);

describe.expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
})).waitForAssertions({
  interval: Duration.seconds(10),
  totalTimeout: Duration.minutes(5),
});
