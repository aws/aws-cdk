import { Template, Match } from '@aws-cdk/assertions';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { App, Stack } from '@aws-cdk/core';
import * as cpactions from '../../lib';

/* eslint-disable quote-props */

describe('CodeStar Connections source Action', () => {
  describe('CodeStar Connections source Action', () => {
    test('produces the correct configuration when added to a pipeline', () => {
      const stack = new Stack();

      createBitBucketAndCodeBuildPipeline(stack, {
        codeBuildCloneOutput: false,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
        'Stages': [
          {
            'Name': 'Source',
            'Actions': [
              {
                'Name': 'BitBucket',
                'ActionTypeId': {
                  'Owner': 'AWS',
                  'Provider': 'CodeStarSourceConnection',
                },
                'Configuration': {
                  'ConnectionArn': 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
                  'FullRepositoryId': 'aws/aws-cdk',
                  'BranchName': 'master',
                },
              },
            ],
          },
          {
            'Name': 'Build',
            'Actions': [
              {
                'Name': 'CodeBuild',
              },
            ],
          },
        ],
      });


    });
  });

  test('setting codeBuildCloneOutput=true adds permission to use the connection to the following CodeBuild Project', () => {
    const stack = new Stack();

    createBitBucketAndCodeBuildPipeline(stack, {
      codeBuildCloneOutput: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      'PolicyDocument': {
        'Statement': [
          {
            'Action': [
              'logs:CreateLogGroup',
              'logs:CreateLogStream',
              'logs:PutLogEvents',
            ],
          },
          {},
          {},
          {},
          {},
          {
            'Action': 'codestar-connections:UseConnection',
            'Effect': 'Allow',
            'Resource': 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
          },
        ],
      },
    });


  });

  test('grant s3 putObjectACL to the following CodeBuild Project', () => {
    const stack = new Stack();

    createBitBucketAndCodeBuildPipeline(stack, {
      codeBuildCloneOutput: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      'PolicyDocument': {
        'Statement': Match.arrayWith([
          Match.objectLike({
            'Action': [
              's3:PutObjectAcl',
              's3:PutObjectVersionAcl',
            ],
            'Effect': 'Allow',
            'Resource': {
              'Fn::Join': ['', [
                { 'Fn::GetAtt': ['PipelineArtifactsBucket22248F97', 'Arn'] },
                '/*',
              ]],
            },
          }),
        ]),
      },
    });


  });

  test('setting triggerOnPush=false reflects in the configuration', () => {
    const stack = new Stack();

    createBitBucketAndCodeBuildPipeline(stack, {
      triggerOnPush: false,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Stages': [
        {
          'Name': 'Source',
          'Actions': [
            {
              'Name': 'BitBucket',
              'ActionTypeId': {
                'Owner': 'AWS',
                'Provider': 'CodeStarSourceConnection',
              },
              'Configuration': {
                'ConnectionArn': 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
                'FullRepositoryId': 'aws/aws-cdk',
                'BranchName': 'master',
                'DetectChanges': false,
              },
            },
          ],
        },
        {
          'Name': 'Build',
          'Actions': [
            {
              'Name': 'CodeBuild',
            },
          ],
        },
      ],
    });

  });

  test('exposes variables', () => {
    const stack = new Stack();
    createBitBucketAndCodeBuildPipeline(stack);

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Stages': [
        {
          'Name': 'Source',
        },
        {
          'Name': 'Build',
          'Actions': [
            {
              'Name': 'CodeBuild',
              'Configuration': {
                'EnvironmentVariables': '[{"name":"CommitId","type":"PLAINTEXT","value":"#{Source_BitBucket_NS.CommitId}"}]',
              },
            },
          ],
        },
      ],
    });
  });

  test('exposes variables with custom namespace', () => {
    const stack = new Stack();
    createBitBucketAndCodeBuildPipeline(stack, {
      variablesNamespace: 'kornicameister',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Stages': [
        {
          'Name': 'Source',
          'Actions': [
            {
              'Name': 'BitBucket',
              'Namespace': 'kornicameister',
            },
          ],
        },
        {
          'Name': 'Build',
          'Actions': [
            {
              'Name': 'CodeBuild',
              'Configuration': {
                'EnvironmentVariables': '[{"name":"CommitId","type":"PLAINTEXT","value":"#{kornicameister.CommitId}"}]',
              },
            },
          ],
        },
      ],
    });
  });

  test('fail if variable from unused action is referenced', () => {
    const app = new App();
    const stack = new Stack(app);
    const pipeline = createBitBucketAndCodeBuildPipeline(stack);

    const unusedSourceOutput = new codepipeline.Artifact();
    const unusedSourceAction = new cpactions.CodeStarConnectionsSourceAction({
      actionName: 'UnusedBitBucket',
      owner: 'aws',
      repo: 'aws-cdk',
      output: unusedSourceOutput,
      connectionArn: 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
    });
    const unusedBuildAction = new cpactions.CodeBuildAction({
      actionName: 'UnusedCodeBuild',
      project: new codebuild.PipelineProject(stack, 'UnusedMyProject'),
      input: unusedSourceOutput,
      environmentVariables: {
        CommitId: { value: unusedSourceAction.variables.commitId },
      },
    });
    pipeline.stage('Build').addAction(unusedBuildAction);

    expect(() => {
      App.of(stack)!.synth();
    }).toThrow(/Cannot reference variables of action 'UnusedBitBucket', as that action was never added to a pipeline/);
  });

  test('fail if variable from unused action with custom namespace is referenced', () => {
    const app = new App();
    const stack = new Stack(app);
    const pipeline = createBitBucketAndCodeBuildPipeline(stack, {
      variablesNamespace: 'kornicameister',
    });
    const unusedSourceOutput = new codepipeline.Artifact();
    const unusedSourceAction = new cpactions.CodeStarConnectionsSourceAction({
      actionName: 'UnusedBitBucket',
      owner: 'aws',
      repo: 'aws-cdk',
      output: unusedSourceOutput,
      connectionArn: 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
      variablesNamespace: 'kornicameister',
    });
    const unusedBuildAction = new cpactions.CodeBuildAction({
      actionName: 'UnusedCodeBuild',
      project: new codebuild.PipelineProject(stack, 'UnusedProject'),
      input: unusedSourceOutput,
      environmentVariables: {
        CommitId: { value: unusedSourceAction.variables.commitId },
      },
    });
    pipeline.stage('Build').addAction(unusedBuildAction);

    expect(() => {
      App.of(stack)!.synth();
    }).toThrow(/Cannot reference variables of action 'UnusedBitBucket', as that action was never added to a pipeline/);
  });
});

function createBitBucketAndCodeBuildPipeline(
  stack: Stack, props: Partial<cpactions.CodeStarConnectionsSourceActionProps> = {},
): codepipeline.Pipeline {
  const sourceOutput = new codepipeline.Artifact();
  const sourceAction = new cpactions.CodeStarConnectionsSourceAction({
    actionName: 'BitBucket',
    owner: 'aws',
    repo: 'aws-cdk',
    output: sourceOutput,
    connectionArn: 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
    ...props,
  });

  return new codepipeline.Pipeline(stack, 'Pipeline', {
    stages: [
      {
        stageName: 'Source',
        actions: [sourceAction],
      },
      {
        stageName: 'Build',
        actions: [
          new cpactions.CodeBuildAction({
            actionName: 'CodeBuild',
            project: new codebuild.PipelineProject(stack, 'MyProject'),
            input: sourceOutput,
            outputs: [new codepipeline.Artifact()],
            environmentVariables: {
              CommitId: { value: sourceAction.variables.commitId },
            },
          }),
        ],
      },
    ],
  });
}
