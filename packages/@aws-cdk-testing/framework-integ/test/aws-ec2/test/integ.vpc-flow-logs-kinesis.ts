import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { FlowLog, FlowLogDestination, FlowLogResourceType, Vpc } from 'aws-cdk-lib/aws-ec2';
import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';

const app = new App();

class TestStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'VPC', { natGateways: 1 });

    new FlowLog(this, 'FlowLogsCW', {
      resourceType: FlowLogResourceType.fromVpc(vpc),
      flowLogName: 'CustomFlowLogName',
    });

    const destinationBucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const deliveryStreamRole = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('firehose.amazonaws.com'),
    });
    destinationBucket.grantReadWrite(deliveryStreamRole);
    deliveryStreamRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'kinesis:DescribeStream',
        'kinesis:GetShardIterator',
        'kinesis:GetRecords',
        'kinesis:ListShards',
      ],
      resources: ['*'],
    }));

    const deliveryStream = new firehose.CfnDeliveryStream(this, 'DeliveryStream', {
      s3DestinationConfiguration: {
        bucketArn: destinationBucket.bucketArn,
        roleArn: deliveryStreamRole.roleArn,
      },
    });

    vpc.addFlowLog('FlowLogsKinesisDataFirehose', {
      destination: FlowLogDestination.toKinesisDataFirehoseDestination(deliveryStream.attrArn),
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
