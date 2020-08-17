import * as codebuild from '@aws-cdk/aws-codebuild';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { CodeBuildStartBuild, CacheMode } from '../../lib';

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
    artifactsOverride: {
      artifactIdentifier: 'id',
      encryptionDisabled: false,
      location: 'string',
      name: 'string',
      namespaceType: 'BUILD_ID',
      overrideArtifactName: false,
      packaging: 'ZIP',
      path: 'string',
      type: 'S3',
    },
    buildspecOverride: 'string',
    buildStatusConfigOverride: {
      context: 'string',
      targetUrl: 'string',
    },
    cacheOverride: {
      location: 'string',
      modes: [CacheMode.LOCAL_CUSTOM_CACHE],
      type: 'S3',
    },
    certificateOverride: 'string',
    computeTypeOverride: codebuild.ComputeType.MEDIUM,
    debugSessionEnabled: false,
    encryptionKeyOverride: 'string',
    environmentTypeOverride: 'LINUX_CONTAINER',
    environmentVariablesOverride: [
      {
        name: 'string',
        type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
        value: 'string',
      },
    ],
    gitCloneDepthOverride: 0,
    gitSubmodulesConfigOverride: {
      fetchSubmodules: false,
    },
    idempotencyToken: 'string',
    imageOverride: 'string',
    imagePullCredentialsTypeOverride: codebuild.ImagePullPrincipalType.CODEBUILD,
    insecureSslOverride: false,
    logsConfigOverride: {
      cloudWatchLogs: {
        groupName: 'string',
        status: 'ENABLED',
        streamName: 'string',
      },
      s3Logs: {
        encryptionDisabled: false,
        location: 'string',
        status: 'ENABLED',
      },
    },
    privilegedModeOverride: false,
    queuedTimeoutInMinutesOverride: 60,
    registryCredentialOverride: {
      credential: 'string',
      credentialProvider: 'SECRETS_MANAGER',
    },
    reportBuildStatusOverride: false,
    secondaryArtifactsOverride: [
      {
        artifactIdentifier: 'string',
        encryptionDisabled: false,
        location: 'string',
        name: 'string',
        namespaceType: 'BUILD_ID',
        overrideArtifactName: false,
        packaging: 'ZIP',
        path: 'string',
        type: 'S3',
      },
    ],
    secondarySourcesOverride: [
      {
        auth: {
          resource: 'string',
          type: 'OAUTH',
        },
        buildspec: 'string',
        buildStatusConfig: {
          context: 'string',
          targetUrl: 'string',
        },
        gitCloneDepth: 0,
        gitSubmodulesConfig: {
          fetchSubmodules: false,
        },
        insecureSsl: false,
        location: 'string',
        reportBuildStatus: false,
        sourceIdentifier: 'string',
        type: 'S3',
      },
    ],
    secondarySourcesVersionOverride: [
      {
        sourceIdentifier: 'string',
        sourceVersion: 'string',
      },
    ],
    serviceRoleOverride: 'string',
    sourceAuthOverride: {
      resource: 'string',
      type: 'OAUTH',
    },
    sourceLocationOverride: 'string',
    sourceTypeOverride: 'S3',
    sourceVersion: 'string',
    timeoutInMinutesOverride: 60,
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
      ArtifactsOverride: {
        ArtifactIdentifier: 'id',
        EncryptionDisabled: false,
        Location: 'string',
        Name: 'string',
        NamespaceType: 'BUILD_ID',
        OverrideArtifactName: false,
        Packaging: 'ZIP',
        Path: 'string',
        Type: 'S3',
      },
      BuildspecOverride: 'string',
      BuildStatusConfigOverride: {
        Context: 'string',
        TargetUrl: 'string',
      },
      CacheOverride: {
        Location: 'string',
        Modes: [CacheMode.LOCAL_CUSTOM_CACHE],
        Type: 'S3',
      },
      CertificateOverride: 'string',
      ComputeTypeOverride: codebuild.ComputeType.MEDIUM,
      DebugSessionEnabled: false,
      EncryptionKeyOverride: 'string',
      EnvironmentTypeOverride: 'LINUX_CONTAINER',
      EnvironmentVariablesOverride: [
        {
          Name: 'string',
          Type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
          Value: 'string',
        },
      ],
      GitCloneDepthOverride: 0,
      GitSubmodulesConfigOverride: {
        FetchSubmodules: false,
      },
      IdempotencyToken: 'string',
      ImageOverride: 'string',
      ImagePullCredentialsTypeOverride: 'CODEBUILD',
      InsecureSslOverride: false,
      LogsConfigOverride: {
        CloudWatchLogs: {
          GroupName: 'string',
          Status: 'ENABLED',
          StreamName: 'string',
        },
        S3Logs: {
          EncryptionDisabled: false,
          Location: 'string',
          Status: 'ENABLED',
        },
      },
      PrivilegedModeOverride: false,
      QueuedTimeoutInMinutesOverride: 60,
      RegistryCredentialOverride: {
        Credential: 'string',
        CredentialProvider: 'SECRETS_MANAGER',
      },
      ReportBuildStatusOverride: false,
      SecondaryArtifactsOverride: [
        {
          ArtifactIdentifier: 'string',
          EncryptionDisabled: false,
          Location: 'string',
          Name: 'string',
          NamespaceType: 'BUILD_ID',
          OverrideArtifactName: false,
          Packaging: 'ZIP',
          Path: 'string',
          Type: 'S3',
        },
      ],
      SecondarySourcesOverride: [
        {
          Auth: {
            Resource: 'string',
            Type: 'OAUTH',
          },
          Buildspec: 'string',
          BuildStatusConfig: {
            Context: 'string',
            TargetUrl: 'string',
          },
          GitCloneDepth: 0,
          GitSubmodulesConfig: {
            FetchSubmodules: false,
          },
          InsecureSsl: false,
          Location: 'string',
          ReportBuildStatus: false,
          SourceIdentifier: 'string',
          Type: 'S3',
        },
      ],
      SecondarySourcesVersionOverride: [
        {
          SourceIdentifier: 'string',
          SourceVersion: 'string',
        },
      ],
      ServiceRoleOverride: 'string',
      SourceAuthOverride: {
        Resource: 'string',
        Type: 'OAUTH',
      },
      SourceLocationOverride: 'string',
      SourceTypeOverride: 'S3',
      SourceVersion: 'string',
      TimeoutInMinutesOverride: 60,
    },
  });
});

test('supports tokens', () => {
  // WHEN
  const task = new CodeBuildStartBuild(stack, 'Task', {
    project: codebuildProject,
    integrationPattern: sfn.IntegrationPattern.RUN_JOB,
    gitCloneDepthOverride: sfn.JsonPath.numberAt('$.gitCloneDepth'),
    environmentVariablesOverride: [
      {
        name: 'ZONE',
        type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
        value: sfn.JsonPath.stringAt('$.envVariables.zone'),
      },
    ],
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
      'ProjectName': {
        Ref: 'ProjectC78D97AD',
      },
      'GitCloneDepthOverride.$': '$.gitCloneDepth',
      'EnvironmentVariablesOverride': [
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
