import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Table, AttributeType, InputCompressionType, InputFormat } from 'aws-cdk-lib/aws-dynamodb';
import { Bucket, IBucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

class S3Stack extends Stack {
  public readonly bucket: Bucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.bucket = new Bucket(this, 'Bucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new BucketDeployment(this, 'BucketDeployment', {
      destinationBucket: this.bucket,
      sources: [
        Source.jsonData('dynamodb-json-format.json', {
          Item: {
            id: {
              S: '1',
            },
          },
        }),
        Source.data('ion-format.ion', `$ion_1_0 {
            Item:{
                id:"1",
            }
        }`),
        Source.data('csv-format.csv', 'id\n1'),
      ],
    });
  }
}

interface DynamoStackProps extends StackProps {
  bucket: IBucket;
}

class DynamoStack extends Stack {
  public readonly dynamoDBJsonTable: Table;
  public readonly ionTable: Table;
  public readonly csvTable: Table;

  constructor(scope: Construct, id: string, props: DynamoStackProps) {
    super(scope, id, props);

    this.dynamoDBJsonTable = new Table(this, 'DynamoDBJsonTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      importSource: {
        compressionType: InputCompressionType.NONE,
        inputFormat: InputFormat.dynamoDBJson(),
        bucket: props.bucket,
        keyPrefix: 'dynamodb-json',
      },
    });

    this.ionTable = new Table(this, 'IonTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      importSource: {
        compressionType: InputCompressionType.NONE,
        inputFormat: InputFormat.ion(),
        bucket: props.bucket,
        keyPrefix: 'ion',
      },
    });

    this.csvTable = new Table(this, 'CsvTable', {
      partitionKey: { name: 'id', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      importSource: {
        compressionType: InputCompressionType.NONE,
        inputFormat: InputFormat.csv(),
        bucket: props.bucket,
        keyPrefix: 'csv',
      },
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const s3Stack = new S3Stack(app, 'S3Stack');

const dynamoStack = new DynamoStack(app, 'DynamoStack', {
  bucket: s3Stack.bucket,
});

const integTest = new IntegTest(app, 'DynamoImportSourceIntegTest', {
  testCases: [s3Stack, dynamoStack],
  diffAssets: true,
});

// Assertions
function getFromTable(tableName: string) {
  return integTest.assertions.awsApiCall('DynamoDB', 'getItem', {
    TableName: tableName,
    Key: {
      id: {
        S: '1',
      },
    },
  }).expect(ExpectedResult.objectLike({
    Item: {
      id: {
        S: '1',
      },
    },
  }));
}

const getFromDynamoDBJsonTable = getFromTable(dynamoStack.dynamoDBJsonTable.tableName);
const getFromIonTable = getFromTable(dynamoStack.ionTable.tableName);
const getFromCsvTable = getFromTable(dynamoStack.csvTable.tableName);

getFromDynamoDBJsonTable.next(getFromIonTable).next(getFromCsvTable);
