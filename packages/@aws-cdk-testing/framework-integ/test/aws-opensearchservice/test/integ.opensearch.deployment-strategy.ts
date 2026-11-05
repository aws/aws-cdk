import type { StackProps } from 'aws-cdk-lib';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new opensearch.Domain(this, 'CapacityOptimized', {
      version: opensearch.EngineVersion.OPENSEARCH_2_11,
      removalPolicy: RemovalPolicy.DESTROY,
      deploymentStrategy: opensearch.DeploymentStrategy.CAPACITY_OPTIMIZED,
      capacity: {
        multiAzWithStandbyEnabled: false,
      },
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-opensearch-deployment-strategy');

new IntegTest(app, 'OpenSearchDeploymentStrategyInteg', {
  testCases: [stack],
});
