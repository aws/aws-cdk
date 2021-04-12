import { App, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as es from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new es.Domain(this, 'Domain', {
      removalPolicy: RemovalPolicy.DESTROY,
      version: es.ElasticsearchVersion.V7_1,
      capacity: {
        masterNodes: 2,
        warmNodes: 2,
      },
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-elasticsearch-ultrawarm');
app.synth();
