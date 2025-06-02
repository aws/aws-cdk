import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new opensearch.Domain(this, 'Domain', {
      removalPolicy: RemovalPolicy.DESTROY,
      version: opensearch.EngineVersion.ELASTICSEARCH_7_1,
      useUnsignedBasicAuth: true,
      capacity: {
        multiAzWithStandbyEnabled: false,
      },
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new TestStack(app, 'cdk-integ-opensearch-unsignedbasicauth');

new IntegTest(app, 'OpenSearchUnsignedBasicAuthInteg', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();
