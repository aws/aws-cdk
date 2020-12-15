import { App, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as s3 from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, 'Bucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
  }
}

const app = new App();
new TestStack(app, 'cdk-s3-bucket-auto-delete-objects');
app.synth();
