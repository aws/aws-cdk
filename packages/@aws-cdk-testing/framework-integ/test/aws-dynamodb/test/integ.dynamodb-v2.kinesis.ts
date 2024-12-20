import * as kinesis from 'aws-cdk-lib/aws-kinesis';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { ApproximateCreationDateTimePrecision, AttributeType, TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

class TestStack extends Stack {
  public constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const stream = new kinesis.Stream(this, 'Stream');

    new TableV2(this, 'Table', {
      partitionKey: { name: 'hashKey', type: AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      kinesisStream: stream,
      kinesisPrecisionTimestamp: ApproximateCreationDateTimePrecision.MILLISECOND,
      replicas: [
        {
          region: 'eu-west-2',
        },
      ],
    });
  }
}

const app = new App();
new IntegTest(app, 'kinesis-stream-precision-timestamp-test', {
  testCases: [new TestStack(app, 'kinesis-stream-precision-timestamp', { env: { region: 'eu-west-1' } })],
  regions: ['eu-west-1'],
  stackUpdateWorkflow: false,
});
