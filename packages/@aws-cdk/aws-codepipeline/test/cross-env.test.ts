import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { Stack, App, Stage as CdkStage } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { FakeBuildAction } from './fake-build-action';
import { FakeSourceAction } from './fake-source-action';
import * as codepipeline from '../lib';

describe.each([
  ['legacy', false],
  ['legacy', true],
  ['modern', false],
  ['modern', true],
])('with %s synthesis, in Stage=%p', (synthesisStyle: string, inStage: boolean) => {
  let app: App;
  let stackScope: Construct;
  let stack: Stack;
  let sourceArtifact: codepipeline.Artifact;
  let initialStages: codepipeline.StageProps[];

  beforeEach(() => {
    app = new App({
      context: {
        ...synthesisStyle === 'modern' ? { '@aws-cdk/core:newStyleStackSynthesis': true } : undefined,
      },
    });
    stackScope = inStage ? new CdkStage(app, 'MyStage') : app;

    stack = new Stack(stackScope, 'PipelineStack', { env: { account: '2222', region: 'us-east-1' } });
    sourceArtifact = new codepipeline.Artifact();
    initialStages = [
      {
        stageName: 'Source',
        actions: [new FakeSourceAction({
          actionName: 'Source',
          output: sourceArtifact,
        })],
      },
      {
        stageName: 'Build',
        actions: [new FakeBuildAction({
          actionName: 'Build',
          input: sourceArtifact,
        })],
      },
    ];
  });

  describe('crossAccountKeys=false', () => {
    let pipeline: codepipeline.Pipeline;
    beforeEach(() => {
      pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
        crossAccountKeys: false,
        stages: initialStages,
      });
    });

    test('creates a bucket but no keys', () => {
      // THEN
      Template.fromStack(stack).resourceCountIs('AWS::KMS::Key', 0);
      Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
    });

    describe('prevents adding a cross-account action', () => {
      const expectedError = 'crossAccountKeys: true';

      let stage: codepipeline.IStage;
      beforeEach(() => {
        stage = pipeline.addStage({ stageName: 'Deploy' });
      });

      test('by role', () => {
        // WHEN
        expect(() => {
          stage.addAction(new FakeBuildAction({
            actionName: 'Deploy',
            input: sourceArtifact,
            role: iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::1111:role/some-role'),
          }));
        }).toThrow(expectedError);
      });

      test('by resource', () => {
        // WHEN
        expect(() => {
          stage.addAction(new FakeBuildAction({
            actionName: 'Deploy',
            input: sourceArtifact,
            resource: s3.Bucket.fromBucketAttributes(stack, 'Bucket', {
              bucketName: 'foo',
              account: '1111',
            }),
          }));
        }).toThrow(expectedError);
      });

      test('by declared account', () => {
        // WHEN
        expect(() => {
          stage.addAction(new FakeBuildAction({
            actionName: 'Deploy',
            input: sourceArtifact,
            account: '1111',
          }));
        }).toThrow(expectedError);
      });
    });

    describe('also affects cross-region support stacks', () => {
      let stage: codepipeline.IStage;
      beforeEach(() => {
        stage = pipeline.addStage({ stageName: 'Deploy' });
      });

      test('when making a support stack', () => {
        // WHEN
        stage.addAction(new FakeBuildAction({
          actionName: 'Deploy',
          input: sourceArtifact,
          // No resource to grab onto forces creating a fresh support stack
          region: 'eu-west-1',
        }));

        // THEN
        let asm = app.synth();
        asm = inStage ? asm.getNestedAssembly('assembly-MyStage') : asm;
        const supportStack = asm.getStackByName(`${stack.stackName}-support-eu-west-1`);

        // THEN
        Template.fromJSON(supportStack.template).resourceCountIs('AWS::KMS::Key', 0);
        Template.fromJSON(supportStack.template).hasResourceProperties('AWS::S3::Bucket', {
          PublicAccessBlockConfiguration: {
            BlockPublicAcls: true,
            BlockPublicPolicy: true,
            IgnorePublicAcls: true,
            RestrictPublicBuckets: true,
          },
        });
      });

      test('when twiddling another stack', () => {
        const stack2 = new Stack(stackScope, 'Stack2', { env: { account: '2222', region: 'eu-west-1' } });

        // WHEN
        stage.addAction(new FakeBuildAction({
          actionName: 'Deploy',
          input: sourceArtifact,
          resource: new iam.User(stack2, 'DoesntMatterWhatThisIs'),
        }));

        // THEN
        Template.fromStack(stack2).resourceCountIs('AWS::KMS::Key', 0);
        Template.fromStack(stack2).resourceCountIs('AWS::S3::Bucket', 1);
      });
    });
  });
});

describe('cross-environment CodePipeline', function () {
  test('correctly detects that an Action is cross-account from the account of the resource backing the Action', () => {
    const app = new App();

    const pipelineStack = new Stack(app, 'PipelineStack', {
      env: { account: '123', region: 'my-region' },
    });
    const sourceOutput = new codepipeline.Artifact();
    const pipeline = new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
      stages: [
        {
          stageName: 'Source',
          actions: [
            new FakeSourceAction({
              actionName: 'Source',
              output: sourceOutput,
            }),
          ],
        },
      ],
    });

    // Import a resource backing the FakeBuildAction into the pipeline's Stack,
    // but specify a different account for it during the import.
    // This should be correctly detected by the CodePipeline construct,
    // and a correct support Stack should be created.
    const deployBucket = s3.Bucket.fromBucketAttributes(pipelineStack, 'DeployBucket', {
      bucketName: 'my-bucket',
      account: '456',
    });
    pipeline.addStage({
      stageName: 'Build',
      actions: [
        new FakeBuildAction({
          actionName: 'Build',
          input: sourceOutput,
          resource: deployBucket,
        }),
      ],
    });

    const asm = app.synth();
    const supportStack = asm.getStackByName(`${pipelineStack.stackName}-support-456`);
    Template.fromJSON(supportStack.template).hasResourceProperties('AWS::IAM::Role', {
      RoleName: 'pipelinestack-support-456dbuildactionrole91c6f1a469fd11d52dfe',
    });

    Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      Stages: [
        { Name: 'Source' },
        {
          Name: 'Build',
          Actions: [
            {
              Name: 'Build',
              RoleArn: {
                'Fn::Join': ['', [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':iam::456:role/pipelinestack-support-456dbuildactionrole91c6f1a469fd11d52dfe',
                ]],
              },
            },
          ],
        },
      ],
    });
  });
});
