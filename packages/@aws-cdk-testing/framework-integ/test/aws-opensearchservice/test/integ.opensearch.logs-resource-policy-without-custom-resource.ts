import { App, Stack, StackProps } from 'aws-cdk-lib';
import { OPENSEARCHSERVICE_CREATE_CLOUDFORMATION_RESOURCE_POLICY } from 'aws-cdk-lib/cx-api';
import { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const domainProps: opensearch.DomainProps = {
      version: opensearch.EngineVersion.ELASTICSEARCH_7_1,
      logging: {
        slowSearchLogEnabled: true,
        appLogEnabled: true,
      },
      capacity: {
        multiAzWithStandbyEnabled: false,
      },
    };

    new opensearch.Domain(this, 'Domain', domainProps);
  }
}

const app = new App({
  context: { [OPENSEARCHSERVICE_CREATE_CLOUDFORMATION_RESOURCE_POLICY]: true },
});
const stack = new TestStack(app, 'cdk-integ-opensearch-logs-resource-policy-without-custom-resource');

new IntegTest(app, 'OpenSearchLogsResourcePolicyWithoutCustomResourceInteg', {
  testCases: [stack],
  diffAssets: true,
});
app.synth();
