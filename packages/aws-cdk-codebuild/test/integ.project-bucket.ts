#!/usr/bin/env node
import { App, Stack } from 'aws-cdk';
import { Bucket } from 'aws-cdk-s3';
import { BuildProject, ComputeType, S3BucketSource } from '..';

const app = new App(process.argv);

const stack = new Stack(app, 'aws-cdk-codebuild');

const bucket = new Bucket(stack, 'MyBucket');

new BuildProject(stack, 'MyProject', {
    source: new S3BucketSource(bucket, 'path/to/my/source.zip'),
    environment: {
        computeType: ComputeType.Large
    }
});

process.stdout.write(app.run());