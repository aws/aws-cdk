import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // deploy opensearch domain with OpenSearch 3.0
    new opensearch.Domain(this, 'Domain', {
      version: opensearch.EngineVersion.OPENSEARCH_3_0,
      removalPolicy: RemovalPolicy.DESTROY,
      capacity: {
        multiAzWithStandbyEnabled: false,
      },
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-opensearch-v3-0');

new IntegTest(app, 'integ-opensearch-v3-0', { testCases: [stack] });
