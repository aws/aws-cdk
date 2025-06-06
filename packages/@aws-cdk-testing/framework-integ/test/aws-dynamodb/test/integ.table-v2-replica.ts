import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as path from 'path';
import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

class TestStack extends Stack {
  public constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const lambdaFunction = new Function(this, 'Function', {
      functionName: 'global-table-lambda',
      runtime: Runtime.PYTHON_3_11,
      code: Code.fromAsset(path.join(__dirname, 'replica-handler')),
      handler: 'index.handler',
    });

    const globalTable = new TableV2(this, 'GlobalTable', {
      tableName: 'global-table',
      removalPolicy: RemovalPolicy.DESTROY,
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      replicas: [
        { region: 'us-west-1' },
        { region: 'us-east-2' },
      ],
    });

    globalTable.replica('us-west-1').grantWriteData(lambdaFunction);
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const integTest = new IntegTest(app, 'aws-cdk-global-table-replica-integ', {
  testCases: [new TestStack(app, 'BarStack', { env: { region: 'us-east-1' } })],
  regions: ['us-east-1'],
  stackUpdateWorkflow: false,
});

const invoke = integTest.assertions.invokeFunction({ functionName: 'global-table-lambda' });
invoke.expect(ExpectedResult.objectLike({
  Payload: {
    status_code: 200,
  },
}));
