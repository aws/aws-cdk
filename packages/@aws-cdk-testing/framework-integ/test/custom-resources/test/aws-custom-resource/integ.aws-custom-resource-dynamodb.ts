import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as integ from '@aws-cdk/integ-tests-alpha';
export class AWSCustomResourceDynamoDb extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myTable = new dynamodb.Table(this, 'myTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new cr.AwsCustomResource(this, 'myCR', {
      memorySize: 1024,
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
      installLatestAwsSdk: true,
      onCreate: {
        service: 'DynamoDB',
        action: 'PutItem',
        parameters: {
          Item: {
            id: { S: 'test-value' },
          },
          TableName: myTable.tableName,
        },
        physicalResourceId: cr.PhysicalResourceId.of('myCRphysicalResourceID'),
      },
      onUpdate: {
        service: 'DynamoDB',
        action: 'PutItem',
        parameters: {
          service: 'DynamoDB',
          action: 'PutItem',
          parameters: {
            Item: {
              id: { S: 'test-value' },
            },
            TableName: myTable.tableName,
          },
          physicalResourceId: cr.PhysicalResourceId.of('myCRphysicalResourceID'),
        },
      },
    });
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

new integ.IntegTest(app, 'AwsCustomResourceDynamoDBTest', {
  testCases: [
    new AWSCustomResourceDynamoDb(app, 'aws-cdk-sdk-dynamodb'),
  ],
  diffAssets: true,
});

app.synth();
