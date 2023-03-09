import { Capture, Match, Template } from '@aws-cdk/assertions';
import * as ccommit from '@aws-cdk/aws-codecommit';
import { CodeCommitTrigger, GitHubTrigger } from '@aws-cdk/aws-codepipeline-actions';
import * as ecr from '@aws-cdk/aws-ecr';
import { AnyPrincipal, Role } from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { SecretValue, Stack, Token } from '@aws-cdk/core';
import * as cdkp from '../../lib';
import { PIPELINE_ENV, TestApp, ModernTestGitHubNpmPipeline } from '../testhelpers';

let app: TestApp;
let pipelineStack: Stack;

beforeEach(() => {
  app = new TestApp();
  pipelineStack = new Stack(app, 'PipelineStack', { env: PIPELINE_ENV });
});

afterEach(() => {
  app.cleanup();
});

test('CodeCommit source handles tokenized names correctly', () => {
  const repo = new ccommit.Repository(pipelineStack, 'Repo', {
    repositoryName: 'MyRepo',
  });
  new ModernTestGitHubNpmPipeline(pipelineStack, 'Pipeline', {
    input: cdkp.CodePipelineSource.codeCommit(repo, 'main'),
  });

  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'Source',
      Actions: [
        Match.objectLike({
          Configuration: Match.objectLike({
            RepositoryName: { 'Fn::GetAtt': [Match.anyValue(), 'Name'] },
          }),
          Name: { 'Fn::GetAtt': [Match.anyValue(), 'Name'] },
        }),
      ],
    }]),
  });
});

test('CodeCommit source honors all valid properties', () => {
  const repo = new ccommit.Repository(pipelineStack, 'Repo', {
    repositoryName: 'MyRepo',
  });
  new ModernTestGitHubNpmPipeline(pipelineStack, 'Pipeline', {
    input: cdkp.CodePipelineSource.codeCommit(repo, 'main', {
      codeBuildCloneOutput: true,
      trigger: CodeCommitTrigger.POLL,
      eventRole: new Role(pipelineStack, 'role', {
        assumedBy: new AnyPrincipal(),
        roleName: 'some-role',
      }),
    }),
  });

  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'Source',
      Actions: [
        Match.objectLike({
          Configuration: Match.objectLike({
            BranchName: 'main',
            PollForSourceChanges: true,
            OutputArtifactFormat: 'CODEBUILD_CLONE_REF',
          }),
          RoleArn: { 'Fn::GetAtt': [Match.anyValue(), 'Arn'] },
        }),
      ],
    }]),
  });
});

test('S3 source handles tokenized names correctly', () => {
  const bucket = new s3.Bucket(pipelineStack, 'Bucket');
  new ModernTestGitHubNpmPipeline(pipelineStack, 'Pipeline', {
    input: cdkp.CodePipelineSource.s3(bucket, 'thefile.zip'),
  });

  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'Source',
      Actions: [
        Match.objectLike({
          Configuration: Match.objectLike({
            S3Bucket: { Ref: Match.anyValue() },
            S3ObjectKey: 'thefile.zip',
          }),
          Name: { Ref: Match.anyValue() },
        }),
      ],
    }]),
  });
});

test('ECR source handles tokenized and namespaced names correctly', () => {
  const repository = new ecr.Repository(pipelineStack, 'Repository', { repositoryName: 'namespace/repo' });
  new ModernTestGitHubNpmPipeline(pipelineStack, 'Pipeline', {
    input: cdkp.CodePipelineSource.ecr(repository),
  });

  const template = Template.fromStack(pipelineStack);
  template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'Source',
      Actions: [
        Match.objectLike({
          Configuration: Match.objectLike({
            RepositoryName: { Ref: Match.anyValue() },
          }),
          Name: Match.objectLike({
            'Fn::Join': [
              '_',
              {
                'Fn::Split': [
                  '/',
                  {
                    Ref: Match.anyValue(),
                  },
                ],
              },
            ],
          }),
        }),
      ],
    }]),
  });
});

test('GitHub source honors all valid properties', () => {
  new ModernTestGitHubNpmPipeline(pipelineStack, 'Pipeline', {
    input: cdkp.CodePipelineSource.gitHub('owner/repo', 'main', {
      trigger: GitHubTrigger.POLL,
      authentication: SecretValue.unsafePlainText('super-secret'),
    }),
  });

  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'Source',
      Actions: [
        Match.objectLike({
          Configuration: Match.objectLike({
            Owner: 'owner',
            Repo: 'repo',
            Branch: 'main',
            PollForSourceChanges: true,
            OAuthToken: 'super-secret',
          }),
          Name: 'owner_repo',
        }),
      ],
    }]),
  });
});

test('GitHub source does not accept ill-formatted identifiers', () => {
  expect(() => {
    new ModernTestGitHubNpmPipeline(pipelineStack, 'Pipeline', {
      input: cdkp.CodePipelineSource.gitHub('repo-only', 'main'),
    });
  }).toThrow('GitHub repository name should be a resolved string like \'<owner>/<repo>\', got \'repo-only\'');
});

test('GitHub source does not accept unresolved identifiers', () => {
  expect(() => {
    new ModernTestGitHubNpmPipeline(pipelineStack, 'Pipeline', {
      input: cdkp.CodePipelineSource.gitHub(Token.asString({}), 'main'),
    });
  }).toThrow(/Step id cannot be unresolved/);
});

test('Dashes in repo names are removed from artifact names', () => {
  new ModernTestGitHubNpmPipeline(pipelineStack, 'Pipeline', {
    input: cdkp.CodePipelineSource.gitHub('owner/my-repo', 'main'),
  });

  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'Source',
      Actions: [
        Match.objectLike({
          OutputArtifacts: [
            { Name: 'owner_my_repo_Source' },
          ],
        }),
      ],
    }]),
  });
});

test('artifact names are never longer than 128 characters', () => {
  new ModernTestGitHubNpmPipeline(pipelineStack, 'Pipeline', {
    input: cdkp.CodePipelineSource.gitHub('owner/' + 'my-repo'.repeat(100), 'main'),
  });

  const artifactId = new Capture();
  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'Source',
      Actions: [
        Match.objectLike({
          OutputArtifacts: [
            { Name: artifactId },
          ],
        }),
      ],
    }]),
  });

  expect(artifactId.asString().length).toBeLessThanOrEqual(128);
});

test('can use source attributes in pipeline', () => {
  const gitHub = cdkp.CodePipelineSource.gitHub('owner/my-repo', 'main');

  // WHEN
  new ModernTestGitHubNpmPipeline(pipelineStack, 'Pipeline', {
    input: gitHub,
    synth: new cdkp.ShellStep('Synth', {
      env: {
        GITHUB_URL: gitHub.sourceAttribute('CommitUrl'),
      },
      commands: [
        'echo "Click here: $GITHUB_URL"',
      ],
    }),
    selfMutation: false,
  });

  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: [
      { Name: 'Source' },
      {
        Name: 'Build',
        Actions: [
          {
            Name: 'Synth',
            Configuration: Match.objectLike({
              EnvironmentVariables: Match.serializedJson([
                {
                  name: 'GITHUB_URL',
                  type: 'PLAINTEXT',
                  value: '#{Source@owner_my-repo.CommitUrl}',
                },
              ]),
            }),
          },
        ],
      },
    ],
  });
});

test('pass role to s3 codepipeline source', () => {
  const bucket = new s3.Bucket(pipelineStack, 'Bucket');
  const role = new Role(pipelineStack, 'TestRole', {
    assumedBy: new AnyPrincipal(),
  });
  new ModernTestGitHubNpmPipeline(pipelineStack, 'Pipeline', {
    input: cdkp.CodePipelineSource.s3(bucket, 'thefile.zip', {
      role,
    }),
  });

  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'Source',
      Actions: [
        Match.objectLike({
          Configuration: Match.objectLike({
            S3Bucket: { Ref: Match.anyValue() },
            S3ObjectKey: 'thefile.zip',
          }),
          Name: { Ref: Match.anyValue() },
          RoleArn: {
            'Fn::GetAtt': [
              Match.stringLikeRegexp('TestRole.*'),
              'Arn',
            ],
          },
        }),
      ],
    }]),
  });
});

type SourceFactory = (stack: Stack) => cdkp.CodePipelineSource;

test.each([
  ['CodeCommit', (stack) => {
    const repo = new ccommit.Repository(stack, 'Repo', {
      repositoryName: 'MyRepo',
    });
    return cdkp.CodePipelineSource.codeCommit(repo, 'main', {
      actionName: 'ConfiguredName',
    });
  }],
  ['S3', (stack) => {
    const bucket = new s3.Bucket(stack, 'Bucket');
    return cdkp.CodePipelineSource.s3(bucket, 'thefile.zip', {
      actionName: 'ConfiguredName',
    });
  }],
  ['ECR', (stack) => {
    const repository = new ecr.Repository(stack, 'Repository', { repositoryName: 'namespace/repo' });
    return cdkp.CodePipelineSource.ecr(repository, {
      actionName: 'ConfiguredName',
    });
  }],
  ['GitHub', () => {
    return cdkp.CodePipelineSource.gitHub('owner/repo', 'main', {
      actionName: 'ConfiguredName',
    });
  }],
  ['CodeStar', () => {
    return cdkp.CodePipelineSource.connection('owner/repo', 'main', {
      connectionArn: 'arn:aws:codestar-connections:us-west-2:123456789012:connection/39e4c34d-e13a-4e94-a886',
      actionName: 'ConfiguredName',
    });
  }],
] as Array<[string, SourceFactory]>)('can configure actionName for %s', (_name: string, fac: SourceFactory) => {
  new ModernTestGitHubNpmPipeline(pipelineStack, 'Pipeline', {
    input: fac(pipelineStack),
  });

  Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
    Stages: Match.arrayWith([{
      Name: 'Source',
      Actions: [
        Match.objectLike({
          Name: 'ConfiguredName',
        }),
      ],
    }]),
  });
});
