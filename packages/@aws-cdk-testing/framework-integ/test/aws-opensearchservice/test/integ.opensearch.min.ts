import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // deploy the latest opensearch domain with minimal configuration
    const domainProps: opensearch.DomainProps = {
      version: opensearch.EngineVersion.OPENSEARCH_2_11,
      removalPolicy: RemovalPolicy.DESTROY,
      capacity: {
        multiAzWithStandbyEnabled: false,
      },
    };

    new opensearch.Domain(this, 'Domain', domainProps);
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-opensearch');

new IntegTest(app, 'Integ', { testCases: [stack] });
