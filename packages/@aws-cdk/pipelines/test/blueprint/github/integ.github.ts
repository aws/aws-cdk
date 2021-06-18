import * as fs from 'fs';
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import { App, RemovalPolicy, Stack, Stage, StageProps } from '@aws-cdk/core';
import { Pipeline, SynthStep } from '../../../lib';
import { TestApp } from '../testutil';
import { GitHubEngine } from './github-engine';

const repodir = '/Users/benisrae/code/test-app-cdkpipeline';
const workflows = path.join(repodir, '.github/workflows');

fs.mkdirSync(workflows, { recursive: true });

const app = new TestApp({ outdir: path.join(repodir, 'cdk.out') });

const github = new GitHubEngine({
  workflowPath: path.join(workflows, 'deploy.yml'),
  preSynthed: true,
});

class MyStage extends Stage {
  constructor(scope: App, id: string, props: StageProps) {
    super(scope, id, props);

    const fnStack = new Stack(this, 'FunctionStack');
    const bucketStack = new Stack(this, 'BucketStack');

    const bucket = new s3.Bucket(bucketStack, 'Bucket', {
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const fn = new lambda.Function(fnStack, 'Function', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'fixtures')),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      environment: {
        BUCKET_NAME: bucket.bucketName, // <-- cross stack reference
      },
    });

    bucket.grantRead(fn);
  }
}

const stageUS = new MyStage(app, 'StageUS', {
  env: {
    account: '585695036304',
    region: 'us-east-1',
  },
});

const stageEU = new MyStage(app, 'StageEU', {
  env: {
    account: '585695036304',
    region: 'eu-west-2',
  },
});

const pipeline = new Pipeline(app, 'MyPipeline', {
  engine: github,
  synthStep: new SynthStep('Build', {
    commands: ['echo "nothing to do (cdk.out is committed)"'],
  }),
});

pipeline.addStage(stageUS);
pipeline.addStage(stageEU);

app.synth();
