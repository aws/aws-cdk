import { join } from 'path';
import { Asset } from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';
import * as codecommit from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codecommit-assets');

const readmeAsset = new Asset(stack, 'ReadmeAsset', {
  path: join(__dirname, '/asset-test/'),
});

const repo = new codecommit.Repository(stack, 'Repo', {
  repositoryName: 'aws-cdk-codecommit-assets',
  code: {
    branchName: 'main',
    asset: readmeAsset,
  },
});

repo.repositoryArn;

app.synth();
