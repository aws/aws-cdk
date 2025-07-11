import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const versions = [
      opensearch.EngineVersion.OPENSEARCH_2_13,
      opensearch.EngineVersion.OPENSEARCH_2_15,
      opensearch.EngineVersion.OPENSEARCH_2_17,
    ];

    // deploy opensearch domain with minimal configuration
    versions.forEach((version) => {
      const domainProps: opensearch.DomainProps = {
        version,
        removalPolicy: RemovalPolicy.DESTROY,
        capacity: {
          multiAzWithStandbyEnabled: false,
        },
      };

      new opensearch.Domain(this, version.version, domainProps);
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-opensearch-min');

new IntegTest(app, 'integ-openseach-min', { testCases: [stack] });
