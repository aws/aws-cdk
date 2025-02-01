import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Cluster } from 'aws-cdk-lib/aws-ecs';
import { App, Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { FlowLog, FlowLogDestination, FlowLogResourceType, Vpc, LogFormat } from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

const app = new App();

class TestStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

    const vpc = new Vpc(this, 'VPC');

    new FlowLog(this, 'FlowLogsCW', {
      resourceType: FlowLogResourceType.fromVpc(vpc),
      logFormat: [
        LogFormat.SRC_PORT,
      ],
    });

    new Cluster(this, 'ECSCluster', { vpc });

    new FlowLog(this, 'FlowLogsAllFormatCW', {
      resourceType: FlowLogResourceType.fromVpc(vpc),
      logFormat: [
        LogFormat.VERSION,
        LogFormat.ACCOUNT_ID,
        LogFormat.INTERFACE_ID,
        LogFormat.SRC_ADDR,
        LogFormat.DST_ADDR,
        LogFormat.SRC_PORT,
        LogFormat.DST_PORT,
        LogFormat.PROTOCOL,
        LogFormat.PACKETS,
        LogFormat.BYTES,
        LogFormat.START_TIMESTAMP,
        LogFormat.END_TIMESTAMP,
        LogFormat.ACTION,
        LogFormat.LOG_STATUS,
        LogFormat.VPC_ID,
        LogFormat.SUBNET_ID,
        LogFormat.INSTANCE_ID,
        LogFormat.TCP_FLAGS,
        LogFormat.TRAFFIC_TYPE,
        LogFormat.PKT_SRC_ADDR,
        LogFormat.PKT_DST_ADDR,
        LogFormat.REGION,
        LogFormat.AZ_ID,
        LogFormat.SUBLOCATION_TYPE,
        LogFormat.SUBLOCATION_ID,
        LogFormat.PKT_SRC_AWS_SERVICE,
        LogFormat.PKT_DST_AWS_SERVICE,
        LogFormat.FLOW_DIRECTION,
        LogFormat.TRAFFIC_PATH,
        LogFormat.ECS_CLUSTER_ARN,
        LogFormat.ECS_CLUSTER_NAME,
        LogFormat.ECS_CONTAINER_INSTANCE_ARN,
        LogFormat.ECS_CONTAINER_INSTANCE_ID,
        LogFormat.ECS_CONTAINER_ID,
        LogFormat.ECS_SECOND_CONTAINER_ID,
        LogFormat.ECS_SERVICE_NAME,
        LogFormat.ECS_TASK_DEFINITION_ARN,
        LogFormat.ECS_TASK_ARN,
        LogFormat.ECS_TASK_ID,
      ],
    });

    const bucket = new Bucket(this, 'Bucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    vpc.addFlowLog('FlowLogsS3', {
      destination: FlowLogDestination.toS3(bucket, 'prefix/'),
      logFormat: [
        LogFormat.DST_PORT,
        LogFormat.SRC_PORT,
      ],
    });
  }
}

new IntegTest(app, 'FlowLogs', {
  testCases: [
    new TestStack(app, 'FlowLogsTestStack'),
  ],
  diffAssets: true,
});

app.synth();
