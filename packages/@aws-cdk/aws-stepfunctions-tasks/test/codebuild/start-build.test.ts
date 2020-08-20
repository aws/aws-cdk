import * as codebuild from '@aws-cdk/aws-codebuild';
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

test('Task with all the parameters', () => {
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
