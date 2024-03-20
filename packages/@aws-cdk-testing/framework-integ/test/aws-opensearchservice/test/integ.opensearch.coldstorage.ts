import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new opensearch.Domain(this, 'Domain', {
      removalPolicy: RemovalPolicy.DESTROY,
      version: opensearch.EngineVersion.ELASTICSEARCH_7_10,
      capacity: {
        masterNodes: 2,
        warmNodes: 2,
        multiAzWithStandbyEnabled: false,
      },
      coldStorageEnabled: true,
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-opensearch-coldstorage');

new IntegTest(app, 'OpenSearchColdStorageInteg', {
  testCases: [stack],
  diffAssets: true,
});
app.synth();
