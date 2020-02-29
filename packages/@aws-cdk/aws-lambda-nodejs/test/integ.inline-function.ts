import * as iam from '@aws-cdk/aws-iam';
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as AWS from 'aws-sdk';
import * as lambda from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const inlineFn = new lambda.NodejsInlineFunction(this, 'ListBuckets', {
      handler: async (event: { startsWith: string }) => {
        const s3 = new AWS.S3();
        const data = await s3.listBuckets().promise();
        return data.Buckets?.filter(b => b.Name?.startsWith(event.startsWith));
      }
    });

    inlineFn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['s3:ListAllMyBuckets'],
      resources: ['*']
    }));
  }
}

const app = new App();
new TestStack(app, 'cdk-integ-lambda-nodejs-inline');
app.synth();
