#!/usr/bin/env node
import { App, Stack } from '@aws-cdk/core';
import { User } from '@aws-cdk/iam';
import { Bucket, BucketEncryption } from '../lib';

const app = new App(process.argv);

const stack = new Stack(app, 'aws-cdk-s3');

const bucket = new Bucket(stack, 'MyBucket', {
    encryption: BucketEncryption.Kms
});

const user = new User(stack, 'MyUser');
bucket.grantReadWrite(user);

process.stdout.write(app.run());
