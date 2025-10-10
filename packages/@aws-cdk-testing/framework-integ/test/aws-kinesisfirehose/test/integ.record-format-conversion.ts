import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as glue from 'aws-cdk-lib/aws-glue';
import * as cdk from 'aws-cdk-lib';
import { AwsApiCall, ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';

const app = new cdk.App();

class RecordFormatConversionTestStack extends cdk.Stack {
  public readonly deliveryStreams: firehose.DeliveryStream[];
  public readonly bucket: s3.Bucket;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const database = new glue.CfnDatabase(this, 'Database', {
      databaseInput: {
        description: 'My database',
      },
      catalogId: this.account,
    });

    const columns = [
      {
        name: 'column_a',
        type: 'string',
      },
      {
        name: 'column_b',
        type: 'string',
      },
    ];

    const table = new glue.CfnTable(this, 'SchemaTable', {
      catalogId: database.catalogId,
      databaseName: database.ref,
      tableInput: {
        storageDescriptor: {
          columns: columns,
        },
      },
    });

    const bucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const commonProps = {
      dataOutputPrefix: 'success/',
      errorOutputPrefix: 'error/',
      bufferingInterval: cdk.Duration.seconds(0),
    };
    const schema = firehose.Schema.fromCfnTable(table);

    const deliveryStreams = [
      new firehose.DeliveryStream(this, 'DeliveryStream1', {
        destination: new firehose.S3Bucket(bucket, {
          ...commonProps,
          dataFormatConversion: {
            schema: schema,
            inputFormat: firehose.InputFormat.OPENX_JSON,
            outputFormat: firehose.OutputFormat.PARQUET,
          },
        }),
      }),
      new firehose.DeliveryStream(this, 'DeliveryStream2', {
        destination: new firehose.S3Bucket(bucket, {
          ...commonProps,
          dataFormatConversion: {
            schema: schema,
            inputFormat: firehose.InputFormat.HIVE_JSON,
            outputFormat: firehose.OutputFormat.ORC,
          },
        }),
      }),
      new firehose.DeliveryStream(this, 'DeliveryStream3', {
        destination: new firehose.S3Bucket(bucket, {
          ...commonProps,
          dataFormatConversion: {
            schema: schema,
            inputFormat: new firehose.HiveJsonInputFormat({
              timestampParsers: [
                firehose.TimestampParser.EPOCH_MILLIS,
                firehose.TimestampParser.fromFormatString('yyyy-MM-dd'),
              ],
            }),
            outputFormat: firehose.OutputFormat.ORC,
          },
        }),
      }),
    ];

    this.deliveryStreams = deliveryStreams;
    this.bucket = bucket;
  }
}
const stack = new RecordFormatConversionTestStack(app, 'FirehoseDeliveryStreamRecordFormatConversion');

const testCase = new IntegTest(app, 'RecordFormatConversionTest', {
  testCases: [stack],
});

const assertions = testCase.assertions;
const putDataCalls = stack.deliveryStreams.map(deliveryStream => assertions.awsApiCall('Firehose', 'putRecord', {
  DeliveryStreamName: deliveryStream.deliveryStreamName,
  Record: {
    Data: '{"Column_A":"foo","Column_B":"bar"}',
  },
}));

const waitForResults = assertions.awsApiCall('S3', 'listObjectsV2', {
  Bucket: stack.bucket.bucketName,
  Prefix: 'success',
}).expect(ExpectedResult.objectLike({
  KeyCount: stack.deliveryStreams.length,
})).waitForAssertions({
  interval: cdk.Duration.seconds(5),
  totalTimeout: cdk.Duration.minutes(2),
});

const api = waitForResults as AwsApiCall;
api.waiterProvider?.addPolicyStatementFromSdkCall('s3', 'ListBucket', [stack.bucket.bucketArn]);
api.waiterProvider?.addPolicyStatementFromSdkCall('s3', 'GetObject', [stack.bucket.arnForObjects('*')]);

putDataCalls.forEach(call => call.next(waitForResults));
