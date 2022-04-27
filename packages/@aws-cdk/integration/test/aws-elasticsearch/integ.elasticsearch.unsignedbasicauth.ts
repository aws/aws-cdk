/// !cdk-integ pragma:ignore-assets
import * as es from '@aws-cdk/aws-elasticsearch';
import { App, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';

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

const app = new App();
new TestStack(app, 'cdk-integ-elasticsearch-unsignedbasicauth');
app.synth();
