import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new opensearch.Domain(this, 'IPv4', {
      version: opensearch.EngineVersion.ELASTICSEARCH_7_1,
      removalPolicy: RemovalPolicy.DESTROY,
      ipAddressType: opensearch.IpAddressType.IPV4,
      capacity: {
        multiAzWithStandbyEnabled: false,
      },
    });

    new opensearch.Domain(this, 'DualStack', {
      version: opensearch.EngineVersion.ELASTICSEARCH_7_1,
      removalPolicy: RemovalPolicy.DESTROY,
      ipAddressType: opensearch.IpAddressType.DUAL_STACK,
      capacity: {
        multiAzWithStandbyEnabled: false,
      },
    });
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-opensearch-ip-address-type');

new IntegTest(app, 'OpenSearchIpAddressTypeInteg', {
  testCases: [stack],
  diffAssets: true,
});
app.synth();
