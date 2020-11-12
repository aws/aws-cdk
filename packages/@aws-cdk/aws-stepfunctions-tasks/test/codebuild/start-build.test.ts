import * as codebuild from '@aws-cdk/aws-codebuild';
import * as s3 from '@aws-cdk/aws-s3';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { CodeBuildStartBuild } from '../../lib';

let stack: cdk.Stack;
let codebuildProject: codebuild.Project;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();

  codebuildProject = new codebuild.Project(stack, 'Project', {
    projectName: 'MyTestProject',
    buildSpec: codebuild.BuildSpec.fromObject({
      version: '0.2',
      phases: {
        build: {
          commands: [
            'echo "Hello, CodeBuild!"',
          ],
        },
      },
    }),
  });
});

test('Task with only the required parameters', () => {
  // WHEN
  const task = new CodeBuildStartBuild(stack, 'Task', {
    project: codebuildProject,
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::codebuild:startBuild.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      ProjectName: {
        Ref: 'ProjectC78D97AD',
      },
    },
  });
});

test('Task with env variables parameters', () => {
  // WHEN
  const task = new CodeBuildStartBuild(stack, 'Task', {
    project: codebuildProject,
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    overrides: {
      environmentVariables: {
        env: {
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
          value: 'prod',
        },
      },
    },
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::codebuild:startBuild.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      ProjectName: {
        Ref: 'ProjectC78D97AD',
      },
      EnvironmentVariablesOverride: [
        {
          Name: 'env',
          Type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
          Value: 'prod',
        },
      ],
    },
  });
});

test('Task with env variables parameters using the deprecated ', () => {
  // WHEN
  const task = new CodeBuildStartBuild(stack, 'Task', {
    project: codebuildProject,
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    environmentVariablesOverride: {
      env: {
        type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
        value: 'prod',
      },
    },
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::codebuild:startBuild.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      ProjectName: {
        Ref: 'ProjectC78D97AD',
      },
      EnvironmentVariablesOverride: [
        {
          Name: 'env',
          Type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
          Value: 'prod',
        },
      ],
    },
  });
});

test('Task with additional parameters(source, cache, artifacts and so on).', () => {
  const bucket = new s3.Bucket(stack, 'Bucket');
  // WHEN
  const task = new CodeBuildStartBuild(stack, 'Task', {
    project: codebuildProject,
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    overrides: {
      timeout: cdk.Duration.seconds(60*60),
      source: codebuild.Source.gitHub({
        branchOrRef: 'my-commit-hash',
        owner: 'aws',
        repo: 'aws-cdk',
      }),
      environment: {
        computeType: codebuild.ComputeType.LARGE,
      },
      secondaryArtifacts: [
        codebuild.Artifacts.s3({
          bucket,
        }),
      ],
      secondarySources: [
        codebuild.Source.gitHub({
          owner: 'aws',
          repo: 'aws-cdk',
          cloneDepth: 1,
          branchOrRef: 'feature-branch',
          identifier: 'source2',
        }),
      ],
    },
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::codebuild:startBuild.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      ComputeTypeOverride: 'BUILD_GENERAL1_LARGE',
      ProjectName: {
        Ref: 'ProjectC78D97AD',
      },
      ReportBuildStatusOverride: true,
      SecondaryArtifactsOverride: [
        {
          type: 'S3',
          location: {
            Ref: 'Bucket83908E77',
          },
          namespaceType: 'BUILD_ID',
          overrideArtifactName: true,
          packaging: 'ZIP',
        },
      ],
      SecondarySourcesOverride: [
        {
          gitCloneDepth: 1,
          location: 'https://github.com/aws/aws-cdk.git',
          reportBuildStatus: true,
          type: 'GITHUB',
          sourceIdentifier: 'source2',
        },
      ],
      SecondarySourcesVersionOverride: [
        {
          sourceIdentifier: 'source2',
          sourceVersion: 'feature-branch',
        },
      ],
      SourceLocationOverride: 'https://github.com/aws/aws-cdk.git',
      SourceTypeOverride: 'GITHUB',
      SourceVersion: 'my-commit-hash',
      TimeoutInMinutesOverride: 60,
    },
  });
});

test('Task with illegal queuedTimeoutInMinutesOverride parameter', () => {
  expect(() => {
    new CodeBuildStartBuild(stack, 'Task', {
      project: codebuildProject,
      overrides: {
        timeout: cdk.Duration.seconds(180),
      },
    });
  }).toThrow(
    /The value of override property "timeout" must be between 5 and 480 minutes./,
  );

  expect(() => {
    new CodeBuildStartBuild(stack, 'Task2', {
      project: codebuildProject,
      overrides: {
        timeout: cdk.Duration.hours(10),
      },
    });
  }).toThrow(
    /The value of override property "timeout" must be between 5 and 480 minutes./,
  );
});

test('Task with illegal ovriride secondaryArtifacts parameter', () => {
  expect(() => {
    const bucket = new s3.Bucket(stack, 'Bucket');
    new CodeBuildStartBuild(stack, 'Task', {
      project: codebuildProject,
      overrides: {
        secondaryArtifacts: Array.apply(null, Array(13)).map((_x, _i) => codebuild.Artifacts.s3({ bucket, path: _i.toString() })),
      },
    });
  }).toThrow(
    /The maximum overrides that can be specified for 'secondaryArtifacts' is 12. Received: 13/,
  );
});

test('Task with illegal ovriride secondarySources parameter', () => {
  expect(() => {
    new CodeBuildStartBuild(stack, 'Task', {
      project: codebuildProject,
      overrides: {
        secondarySources: Array.apply(null, Array(14)).map((_x, _i) => codebuild.Source.gitHub({
          owner: 'aws',
          repo: 'aws-cdk',
        })),
      },
    });
  }).toThrow(
    /The maximum overrides that can be specified for 'secondarySources' is 12. Received: 14/,
  );
});

test('supports tokens', () => {
  // WHEN
  const task = new CodeBuildStartBuild(stack, 'Task', {
    project: codebuildProject,
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    environmentVariablesOverride: {
      ZONE: {
        type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
        value: sfn.JsonPath.stringAt('$.envVariables.zone'),
      },
    },
  });

  // THEN
  expect(stack.resolve(task.toStateJson())).toEqual({
    Type: 'Task',
    Resource: {
      'Fn::Join': [
        '',
        [
          'arn:',
          {
            Ref: 'AWS::Partition',
          },
          ':states:::codebuild:startBuild.sync',
        ],
      ],
    },
    End: true,
    Parameters: {
      ProjectName: {
        Ref: 'ProjectC78D97AD',
      },
      EnvironmentVariablesOverride: [
        {
          'Name': 'ZONE',
          'Type': codebuild.BuildEnvironmentVariableType.PLAINTEXT,
          'Value.$': '$.envVariables.zone',
        },
      ],
    },
  });
});


test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new CodeBuildStartBuild(stack, 'Task', {
      project: codebuildProject,
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
    });
  }).toThrow(
    /Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE,RUN_JOB. Received: WAIT_FOR_TASK_TOKEN/,
  );
});
