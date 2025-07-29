/// !cdk-integ *

import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'Table', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      replicationRegions: [
        'eu-west-2',
        'eu-central-1',
      ],
    });

    table.addGlobalSecondaryIndex({
      indexName: 'my-index',
      partitionKey: {
        name: 'key',
        type: dynamodb.AttributeType.STRING,
      },
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
    '@aws-cdk/aws-dynamodb:retainTableReplica': false,
  },
});
const stack = new TestStack(app, 'cdk-dynamodb-global-20191121', { env: { region: 'eu-west-1' } });

new IntegTest(app, 'cdk-dynamodb-global-20191121-test', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();
