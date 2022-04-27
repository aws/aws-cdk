import * as opensearch from '@aws-cdk/aws-opensearchservice';
import { App, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new opensearch.Domain(this, 'Domain', {
      removalPolicy: RemovalPolicy.DESTROY,
      version: opensearch.EngineVersion.ELASTICSEARCH_7_1,
      capacity: {
        masterNodes: 2,
        warmNodes: 2,
      },
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-opensearch-ultrawarm');
app.synth();
