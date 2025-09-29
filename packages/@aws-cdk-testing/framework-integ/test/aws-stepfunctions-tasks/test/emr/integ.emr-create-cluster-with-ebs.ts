import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { App, Duration, Size, Stack, Tags } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { EmrCreateCluster } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Vpc } from 'aws-cdk-lib/aws-ec2';

const app = new App();

const stack = new Stack(app, 'emr-create-cluster-ebs');
const vpc = new Vpc(stack, 'Vpc', { restrictDefaultSecurityGroup: false });

const releaseLabel = 'emr-7.10.0';
const ebsRootVolumeIops = 4000;
const ebsRootVolumeSize = 20;
const ebsRootVolumeThroughput = 200;
const unitType = EmrCreateCluster.ComputeLimitsUnitType.INSTANCE_FLEET_UNITS;
const maximumCapacityUnits = 4;
const minimumCapacityUnits = 1;
const maximumOnDemandCapacityUnits = 4;
const maximumCoreCapacityUnits = 2;

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
  releaseLabel,
  integrationPattern: sfn.IntegrationPattern.RUN_JOB,
  ebsRootVolumeIops,
  ebsRootVolumeSize: Size.gibibytes(ebsRootVolumeSize),
  ebsRootVolumeThroughput,
  managedScalingPolicy: {
    computeLimits: {
      unitType,
      maximumCapacityUnits,
      minimumCapacityUnits,
      maximumOnDemandCapacityUnits,
      maximumCoreCapacityUnits,
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

const describeExecution = integTest.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
});
start.next(describeExecution);

const waitForExecution = describeExecution.expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
})).waitForAssertions({
  interval: Duration.seconds(30),
  totalTimeout: Duration.minutes(5),
});

const getClusterId = integTest.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
});
waitForExecution.next(getClusterId);

const clusterId = getClusterId.getAttString('output.ClusterId');

const describeCluster = integTest.assertions.awsApiCall('Emr', 'describeCluster', {
  ClusterId: clusterId,
});
getClusterId.next(describeCluster);

describeCluster.expect(ExpectedResult.objectLike({
  Cluster: {
    ReleaseLabel: releaseLabel,
    EbsRootVolumeIops: ebsRootVolumeIops,
    EbsRootVolumeSize: ebsRootVolumeSize,
    EbsRootVolumeThroughput: ebsRootVolumeThroughput,
  },
}));

const getManagedScalingPolicy = integTest.assertions.awsApiCall('Emr', 'getManagedScalingPolicy', {
  ClusterId: clusterId,
});
describeCluster.next(getManagedScalingPolicy);

getManagedScalingPolicy.expect(ExpectedResult.objectLike({
  ManagedScalingPolicy: {
    ComputeLimits: {
      UnitType: unitType,
      MaximumCapacityUnits: maximumCapacityUnits,
      MinimumCapacityUnits: minimumCapacityUnits,
      MaximumOnDemandCapacityUnits: maximumOnDemandCapacityUnits,
      MaximumCoreCapacityUnits: maximumCoreCapacityUnits,
    },
  },
}));
