import { arrayWith, objectLike, stringLike } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import { Construct, Stack, Stage, StageProps } from '@aws-cdk/core';
import * as cdkp from '../lib';
import { BucketStack, PIPELINE_ENV, TestApp, TestGitHubNpmPipeline } from './testutil';

let app: TestApp;
let pipelineStack: Stack;
let pipeline: cdkp.CdkPipeline;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
  pipeline = new TestGitHubNpmPipeline(pipelineStack, 'Cdk');
});

afterEach(() => {
  app.cleanup();
});

test('in a cross-account/cross-region setup, artifact bucket can be read by deploy role', () => {
  // WHEN
  pipeline.addApplicationStage(new TestApplication(app, 'MyApp', {
    env: { account: '321elsewhere', region: 'us-elsewhere' },
  }));

  // THEN
  app.synth();
  const supportStack = app.node.findAll().filter(Stack.isStack).find(s => s.stackName === 'PipelineStack-support-us-elsewhere');
  expect(supportStack).not.toBeUndefined();

  expect(supportStack).toHaveResourceLike('AWS::S3::BucketPolicy',  {
    PolicyDocument: {
      Statement: arrayWith(objectLike({
        Action: arrayWith('s3:GetObject*', 's3:GetBucket*', 's3:List*'),
        Principal: {
          AWS: {
            'Fn::Sub': stringLike('*-deploy-role-*'),
          },
        },
      })),
    },
  });
});

test('in a cross-account/same-region setup, artifact bucket can be read by deploy role', () => {
  // WHEN
  pipeline.addApplicationStage(new TestApplication(app, 'MyApp', {
    env: { account: '321elsewhere', region: PIPELINE_ENV.region },
  }));

  // THEN
  expect(pipelineStack).toHaveResourceLike('AWS::S3::BucketPolicy',  {
    PolicyDocument: {
      Statement: arrayWith(objectLike({
        Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
        Principal: {
          AWS: {
            'Fn::Sub': stringLike('*-deploy-role-*'),
          },
        },
      })),
    },
  });
});

/**
 * Our application
 */
class TestApplication extends Stage {
  constructor(scope: Construct, id: string, props: StageProps) {
    super(scope, id, props);
    new BucketStack(this, 'Stack');
  }
}