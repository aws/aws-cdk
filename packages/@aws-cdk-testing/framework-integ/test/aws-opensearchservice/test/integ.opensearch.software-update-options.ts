import type { StackProps } from 'aws-cdk-lib';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  public readonly domain: opensearch.Domain;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.domain = new opensearch.Domain(this, 'Domain', {
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

const integ = new IntegTest(app, 'OpenSearchSoftwareUpdateOptionsInteg', {
  testCases: [stack],
});

// Verify the software update options are set correctly on the deployed domain
const describeResponse = integ.assertions.awsApiCall('OpenSearch', 'describeDomain', {
  DomainName: stack.domain.domainName,
});

describeResponse.expect(ExpectedResult.objectLike({
  DomainStatus: {
    SoftwareUpdateOptions: {
      AutoSoftwareUpdateEnabled: true,
      UseLatestServiceSoftwareForBlueGreen: true,
    },
  },
}));
