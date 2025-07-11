import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import { App, Duration, Stack, Tags } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { EmrCreateCluster } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Vpc } from 'aws-cdk-lib/aws-ec2';

const app = new App({
});

const stack = new Stack(app, 'aws-cdk-emr-create-cluster-auto-deletion-policy-idle-timeout');

const vpc = new Vpc(stack, 'Vpc', { restrictDefaultSecurityGroup: false });
// https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-managed-iam-policies.html#manually-tagged-resources
Tags.of(vpc).add('for-use-with-amazon-emr-managed-policies', 'true');

const step = new EmrCreateCluster(stack, 'EmrCreateCluster', {
  instances: {
    instanceFleets: [
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
  releaseLabel: 'emr-6.15.0',
  integrationPattern: sfn.IntegrationPattern.RUN_JOB,
  autoTerminationPolicyIdleTimeout: Duration.seconds(100),
});

const stateMachine = new sfn.StateMachine(stack, 'SM', {
  definition: step,
});

const testCase = new IntegTest(app, 'EmrCreateClusterTestAutoDeletionPolicyIdleTimeout', {
  testCases: [stack],
});

testCase.assertions
  .awsApiCall('StepFunctions', 'describeStateMachine', {
    stateMachineArn: stateMachine.stateMachineArn,
  })
  .expect(ExpectedResult.objectLike({ status: 'ACTIVE' }))
  .waitForAssertions({
    interval: Duration.seconds(10),
    totalTimeout: Duration.minutes(5),
  });

// Start an execution
const start = testCase.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: stateMachine.stateMachineArn,
});

// describe the results of the execution
const describe = testCase.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: start.getAttString('executionArn'),
});
start.next(describe);

// assert the results
describe.expect(ExpectedResult.objectLike({
  status: 'SUCCEEDED',
})).waitForAssertions({
  interval: Duration.seconds(10),
  totalTimeout: Duration.minutes(5),
});
