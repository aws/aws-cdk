import { Bucket } from '@aws-cdk/aws-s3';
import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { BucketDeployment, Source } from '../lib';

const app = new App();
const stack = new Stack(app, 'TestBucketDeploymentContent');
const bucket = new Bucket(stack, 'Bucket');

const file1 = Source.data('file1.txt', 'boom');
const file2 = Source.data('path/to/file2.txt', `bam! ${bucket.bucketName}`);
const file3 = Source.jsonData('my/config.json', { website_url: bucket.bucketWebsiteUrl });

new BucketDeployment(stack, 'DeployMe', {
  destinationBucket: bucket,
  sources: [file1, file2, file3],
  destinationKeyPrefix: 'deploy/here/',
});

new CfnOutput(stack, 'BucketName', { value: bucket.bucketName });

app.synth();