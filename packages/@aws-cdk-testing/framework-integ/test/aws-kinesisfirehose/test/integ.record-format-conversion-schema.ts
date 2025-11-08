import * as firehose from 'aws-cdk-lib/aws-kinesisfirehose';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as glue from 'aws-cdk-lib/aws-glue';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';

const app = new cdk.App();

const SCHEMA_COLUMNS = [
  {
    name: 'column_a',
    type: 'string',
  },
  {
    name: 'column_b',
    type: 'string',
  },
];

class TestStack extends cdk.Stack {
  public readonly deliveryStreamsToTest: firehose.IDeliveryStream[];
  public readonly bucket: s3.Bucket;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.bucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const database = new glue.CfnDatabase(this, 'Database', {
      databaseInput: {
        description: 'My database',
      },
      catalogId: this.account,
    });

    const registry = new glue.CfnRegistry(this, 'SchemaRegistry', {
      name: 'my_schema_registry',
    });

    const inlineSchemaTable = this.createTableWithInlineSchema(database);
    const inlineSchemaDeliveryStream = this.createDeliveryStreamWithDataFormatConversion('InlineSchema', {
      schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(inlineSchemaTable),
      inputFormat: firehose.InputFormat.OPENX_JSON,
      outputFormat: firehose.OutputFormat.PARQUET,
    });

    const registrySchemaTable = this.createTableWithRegistrySchema(database, registry);
    const registrySchemaDeliveryStream = this.createDeliveryStreamWithDataFormatConversion('RegistrySchema', {
      schemaConfiguration: firehose.SchemaConfiguration.fromCfnTable(registrySchemaTable),
      inputFormat: firehose.InputFormat.OPENX_JSON,
      outputFormat: firehose.OutputFormat.PARQUET,
    });

    this.deliveryStreamsToTest = [
      inlineSchemaDeliveryStream,
      registrySchemaDeliveryStream,
    ];
  }

  private createTableWithInlineSchema(database: glue.CfnDatabase): glue.CfnTable {
    return new glue.CfnTable(this, 'InlineSchemaTable', {
      catalogId: database.catalogId,
      databaseName: database.ref,
      tableInput: {
        storageDescriptor: {
          columns: SCHEMA_COLUMNS,
        },
      },
    });
  }

  private createTableWithRegistrySchema(database: glue.CfnDatabase, registry: glue.CfnRegistry): glue.CfnTable {
    const schemaDefinition = JSON.stringify({
      type: 'record',
      name: 'MyRecord',
      fields: SCHEMA_COLUMNS,
    });

    const schema = new glue.CfnSchema(this, 'Schema', {
      registry: {
        arn: registry.attrArn,
      },
      compatibility: 'NONE',
      dataFormat: 'AVRO',
      name: 'my_schema',
      schemaDefinition: schemaDefinition,
    });

    return new glue.CfnTable(this, 'RegistrySchemaTable', {
      catalogId: database.catalogId,
      databaseName: database.ref,
      tableInput: {
        storageDescriptor: {
          schemaReference: {
            schemaVersionId: schema.attrInitialSchemaVersionId,
          },
        },
      },
    });
  }

  private createDeliveryStreamWithDataFormatConversion(
    id: string,
    dataFormatConversion: firehose.DataFormatConversionProps,
  ): firehose.DeliveryStream {
    return new firehose.DeliveryStream(this, id, {
      destination: new firehose.S3Bucket(this.bucket, {
        dataOutputPrefix: `success/${id}/`,
        errorOutputPrefix: `error/${id}/`,
        bufferingInterval: cdk.Duration.seconds(0),
        dataFormatConversion: dataFormatConversion,
      }),
    });
  }
}

const stack = new TestStack(app, 'RecordFormatConversionSchema');
const testCase = new integ.IntegTest(app, 'RecordFormatConversionSchemaTest', {
  testCases: [stack],
});

const assertions = testCase.assertions;

// Test each delivery stream with the same input, and verify that each writes the output to the success prefix
// Relies on waiting timeout to tell if record format conversion failed.
stack.deliveryStreamsToTest.forEach(deliveryStream => {
  const putDataCall = assertions.awsApiCall('Firehose', 'putRecord', {
    DeliveryStreamName: deliveryStream.deliveryStreamName,
    Record: {
      Data: JSON.stringify({
        Column_A: 'foo',
        Column_B: 'bar',
      }),
    },
  });

  const waitForResultCall = assertions.awsApiCall('S3', 'listObjectsV2', {
    Bucket: stack.bucket.bucketName,
    Prefix: `success/${deliveryStream.node.id}/`,
  }).expect(integ.ExpectedResult.objectLike({
    KeyCount: 1,
  })).waitForAssertions({
    interval: cdk.Duration.seconds(5),
    totalTimeout: cdk.Duration.minutes(2),
  });

  const api = waitForResultCall as integ.AwsApiCall;
  api.waiterProvider?.addPolicyStatementFromSdkCall('s3', 'ListBucket', [stack.bucket.bucketArn]);
  api.waiterProvider?.addPolicyStatementFromSdkCall('s3', 'GetObject', [stack.bucket.arnForObjects('*')]);
  putDataCall.next(waitForResultCall);
});
