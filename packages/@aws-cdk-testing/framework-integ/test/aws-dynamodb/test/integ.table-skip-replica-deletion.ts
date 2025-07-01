/// !cdk-integ *

import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import {
  IntegTest,
} from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  public table?: dynamodb.Table;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.table = new dynamodb.Table(this, 'Table', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      replicaRemovalPolicy: RemovalPolicy.DESTROY,
      removalPolicy: RemovalPolicy.DESTROY,
      replicationRegions: ['eu-west-2'],
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-dynamodb:retainTableReplica': true,
  },
});
const stack = new TestStack(app, 'cdk-dynamodb-skip-replica-deletion');

new IntegTest(
  app,
  'cdk-dynamodb-skip-replica-deletion-test',
  {
    testCases: [stack],
  },
);
