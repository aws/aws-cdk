import type { StackProps } from 'aws-cdk-lib';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const streamPolicy = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          actions: [
            'dynamodb:DescribeStream',
            'dynamodb:GetRecords',
            'dynamodb:GetShardIterator',
          ],
          principals: [new iam.ArnPrincipal('arn:aws:iam::111111111111:root')],
          resources: ['*'],
        }),
      ],
    });

    // Table with stream resource policy on primary and replica
    new dynamodb.TableV2(this, 'GlobalTable', {
      partitionKey: {
        name: 'pk',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      dynamoStream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      streamResourcePolicy: streamPolicy,
      replicas: [
        {
          region: 'us-west-1',
          streamResourcePolicy: streamPolicy,
        },
      ],
    });

    // Table using addToStreamResourcePolicy
    const table = new dynamodb.TableV2(this, 'GlobalTableImperative', {
      partitionKey: {
        name: 'pk',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      dynamoStream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      replicas: [
        { region: 'us-west-1' },
      ],
    });

    table.addToStreamResourcePolicy(new iam.PolicyStatement({
      actions: [
        'dynamodb:DescribeStream',
        'dynamodb:GetRecords',
        'dynamodb:GetShardIterator',
      ],
      principals: [new iam.ArnPrincipal('arn:aws:iam::111111111111:root')],
      resources: ['*'],
    }));
  }
}

const stack = new TestStack(app, 'StreamResourcePolicyTest-v2', {
  env: { region: 'us-east-1' },
});

new IntegTest(app, 'table-v2-stream-resource-policy-integ-test', {
  testCases: [stack],
  stackUpdateWorkflow: false,
});
