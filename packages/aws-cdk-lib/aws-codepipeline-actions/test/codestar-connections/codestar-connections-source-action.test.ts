import { Template, Match } from '../../../assertions';
import * as codebuild from '../../../aws-codebuild';
import * as codepipeline from '../../../aws-codepipeline';
import { App, Stack } from '../../../core';
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

  test('setting trigger enabled reflected in the configuration and is fine for v1', () => {
    const stack = new Stack();

    createBitBucketAndCodeBuildPipeline(stack, {
      trigger: cpactions.Trigger.ENABLED,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
      'Triggers': Match.absent(),
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
                'DetectChanges': true,
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

  test('setting trigger enabled reflected in the configuration for v2', () => {
    const stack = new Stack();

    createBitBucketAndCodeBuildPipeline(stack, {
      trigger: cpactions.Trigger.ENABLED,
      pipelineType: codepipeline.PipelineType.V2,
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
                'DetectChanges': true,
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
      'Triggers': [
        {
          'ProviderType': 'CodeStarSourceConnection',
          'GitConfiguration': {
            'SourceActionName': 'BitBucket',
          },
        },
      ],
    });
  });

  test('setting trigger disabled reflects in the configuration for v1', () => {
    const stack = new Stack();

    createBitBucketAndCodeBuildPipeline(stack, {
      trigger: cpactions.Trigger.DISABLED,
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
      'Triggers': Match.absent(),
    });
  });

  test('setting trigger disabled reflects in the configuration for v2', () => {
    const stack = new Stack();

    createBitBucketAndCodeBuildPipeline(stack, {
      trigger: cpactions.Trigger.DISABLED,
      pipelineType: codepipeline.PipelineType.V2,
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
      'Triggers': Match.absent(),
    });
  });

  test('setting trigger with filters reflects in the configuration', () => {
    const stack = new Stack();

    createBitBucketAndCodeBuildPipeline(stack, {
      trigger: cpactions.Trigger.withFilters(cpactions.Filter.pullRequestClosed({ branches: { includes: ['main'] } })),
      pipelineType: codepipeline.PipelineType.V2,
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
                'DetectChanges': true,
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
      'Triggers': [
        {
          'ProviderType': 'CodeStarSourceConnection',
          'GitConfiguration': {
            'SourceActionName': 'BitBucket',
            'PullRequest': [
              {
                'Branches': {
                  'Includes': ['main'],
                },
                'Events': ['CLOSED'],
              },
            ],
          },
        },
      ],
    });
  });

  test('v1 pipeline throws error when triggers are included with filters', () => {
    const stack = new Stack();

    expect(() =>
      createBitBucketAndCodeBuildPipeline(stack, {
        trigger: cpactions.Trigger.withFilters(cpactions.Filter.pullRequestClosed({ branches: { includes: ['main'] } })),
        pipelineName: 'FailedV1Pipeline',
      }),
    ).toThrow('Invalid configuration for FailedV1Pipeline. Filters may only be set if PipelineType is set to V2.');

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

interface TestPipelineProps extends Partial<cpactions.CodeStarConnectionsSourceActionProps> {
  pipelineType?: codepipeline.PipelineType;
  pipelineName?: string;
}

function createBitBucketAndCodeBuildPipeline(
  stack: Stack, props: TestPipelineProps = {}, pipelineType?: codepipeline.PipelineType,
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
    pipelineType: props.pipelineType,
    pipelineName: props.pipelineName,
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
