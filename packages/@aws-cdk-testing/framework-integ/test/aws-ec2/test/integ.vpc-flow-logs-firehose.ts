import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { FlowLog, FlowLogDestination, FlowLogResourceType, Vpc } from 'aws-cdk-lib/aws-ec2';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new App();

class TestStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'VPC', { natGateways: 0, restrictDefaultSecurityGroup: false });

    new FlowLog(this, 'FlowLogsCW', {
      resourceType: FlowLogResourceType.fromVpc(vpc),
      flowLogName: 'CustomFlowLogName',
    });

    const destinationBucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    const deliveryStream = new firehose.DeliveryStream(this, 'DeliveryStream', {
      destination: new firehose.S3Bucket(destinationBucket, {
        loggingConfig: new firehose.DisableLogging(),
      }),
    });

    vpc.addFlowLog('FlowLogsFirehose', {
      destination: FlowLogDestination.toFirehose(deliveryStream),
    });
  }
}

const stack = new TestStack(app, 'FlowLogsTestStack');

new IntegTest(app, 'FlowLogs', {
  testCases: [stack],
});
