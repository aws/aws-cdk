import { App, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as es from 'aws-cdk-lib/aws-elasticsearch';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new es.Domain(this, 'Domain', {
      removalPolicy: RemovalPolicy.DESTROY,
      version: es.ElasticsearchVersion.V7_1,
      useUnsignedBasicAuth: true,
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new TestStack(app, 'cdk-integ-elasticsearch-unsignedbasicauth');
new IntegTest(app, 'ElasticSearchUnsignedBasicAuthInteg', {
  testCases: [stack],
  diffAssets: true,
});
app.synth();
