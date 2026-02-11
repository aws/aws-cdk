import type { StackProps } from 'aws-cdk-lib';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new opensearch.Domain(this, 'Domain', {
      removalPolicy: RemovalPolicy.DESTROY,
      version: opensearch.EngineVersion.ELASTICSEARCH_7_1,
      capacity: {
        masterNodes: 2,
        warmNodes: 2,
        multiAzWithStandbyEnabled: false,
      },
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-opensearch-ultrawarm');
app.synth();
