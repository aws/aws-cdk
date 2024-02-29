import * as codebuild from '../../../aws-codebuild';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
import { CodeBuildStartBuildBatch } from '../../lib';

let stack: cdk.Stack;
let codebuildProject: codebuild.Project;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();

  codebuildProject = new codebuild.Project(stack, 'Project', {
    projectName: 'MyTestProject',
    buildSpec: codebuild.BuildSpec.fromObjectToYaml({
      version: '0.2',
      batch: {
        'fast-fail': true,
        'build-list': [
          {
            identifier: 'id',
            buildspec: 'version: 0.2\nphases:\n  build:\n    commands:\n      - echo "Hello, CodeBuild!"',
          },
        ],
      },
    }),
  });
  codebuildProject.enableBatchBuilds();
});

test('only the required parameters', () => {
  // WHEN
  const task = new CodeBuildStartBuildBatch(stack, 'Task', {
    project: codebuildProject,
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
          ':states:::codebuild:startBuildBatch',
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

test('supports tokens', () => {
  // WHEN
  const task = new CodeBuildStartBuildBatch(stack, 'Task', {
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
          ':states:::codebuild:startBuildBatch.sync',
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

test('with the all parameters', () => {
  // WHEN
  const task = new CodeBuildStartBuildBatch(stack, 'Task', {
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
          ':states:::codebuild:startBuildBatch.sync',
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

test('Task throws if WAIT_FOR_TASK_TOKEN is supplied as service integration pattern', () => {
  expect(() => {
    new CodeBuildStartBuildBatch(stack, 'Task', {
      project: codebuildProject,
      integrationPattern: sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
    });
  }).toThrow(
    /Unsupported service integration pattern. Supported Patterns: REQUEST_RESPONSE,RUN_JOB. Received: WAIT_FOR_TASK_TOKEN/,
  );
});
