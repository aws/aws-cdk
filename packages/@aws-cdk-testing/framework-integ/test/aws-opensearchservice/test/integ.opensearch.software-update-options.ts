import type { StackProps } from 'aws-cdk-lib';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new opensearch.Domain(this, 'Domain', {
      version: opensearch.EngineVersion.OPENSEARCH_2_17,
      removalPolicy: RemovalPolicy.DESTROY,
      enableAutoSoftwareUpdate: true,
      useLatestServiceSoftwareForBlueGreen: true,
      capacity: {
        multiAzWithStandbyEnabled: false,
      },
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-opensearch-software-update-options');

new IntegTest(app, 'OpenSearchSoftwareUpdateOptionsInteg', {
  testCases: [stack],
});
