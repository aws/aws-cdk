import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import {
  FlowLogDestination,
  Instance,
  InstanceClass,
  InstanceSize,
  InstanceType,
  MachineImage,
  SubnetType,
  UserData,
  Vpc,
} from 'aws-cdk-lib/aws-ec2';
import { EC2_FLOW_LOGS_CLOUDWATCH_LOGS_PERMISSIONS_SCOPED } from 'aws-cdk-lib/cx-api';

const app = new App();
const stack = new Stack(app, 'VPCFlowLogsScopedPermissions');
stack.node.setContext(EC2_FLOW_LOGS_CLOUDWATCH_LOGS_PERMISSIONS_SCOPED, true);

const vpc = new Vpc(stack, 'VPC', {
  natGateways: 0,
});
const flowLog = vpc.addFlowLog('CloudWatchLogs', {
  destination: FlowLogDestination.toCloudWatchLogs(),
});

const userData = UserData.forLinux();
userData.addCommands(
  'while true; do curl --silent --max-time 5 https://example.com/ >/dev/null || true; sleep 30; done',
);

const instance = new Instance(stack, 'TrafficSource', {
  vpc,
  vpcSubnets: { subnetType: SubnetType.PUBLIC },
  instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
  machineImage: MachineImage.latestAmazonLinux2023(),
  associatePublicIpAddress: true,
  userData,
});
instance.node.addDependency(flowLog);

const test = new IntegTest(app, 'FlowLogsScopedPermissions', {
  testCases: [stack],
});

const describeFlowLogs = test.assertions.awsApiCall('EC2', 'describeFlowLogs', {
  FlowLogIds: [flowLog.flowLogId],
});
describeFlowLogs
  .assertAtPath('FlowLogs.0.DeliverLogsStatus', ExpectedResult.stringLikeRegexp('^SUCCESS$'))
  .waitForAssertions({
    interval: Duration.seconds(30),
    totalTimeout: Duration.minutes(10),
  });

const logEvents = test.assertions.awsApiCall('CloudWatchLogs', 'filterLogEvents', {
  logGroupName: flowLog.logGroup!.logGroupName,
});
describeFlowLogs.next(logEvents);

logEvents
  .assertAtPath('events.0.logStreamName', ExpectedResult.stringLikeRegexp('.+'))
  .waitForAssertions({
    interval: Duration.seconds(30),
    totalTimeout: Duration.minutes(15),
  });
