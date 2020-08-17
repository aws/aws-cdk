import * as codebuild from '@aws-cdk/aws-codebuild';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as tasks from '../../lib';

/*
 * Stack verification steps:
 * * aws stepfunctions start-execution --state-machine-arn <deployed state machine arn> : should return execution arn
 * * aws codebuild list-builds-for-project --project-name <deployed project name>: should return a list of projects with size greater than 0
 * *
 * * aws codebuild batch-get-builds --ids <build id returned by list-builds-for-project> --query 'builds[0].buildStatus': wait until the status is 'SUCCEEDED'
 * * aws stepfunctions describe-execution --execution-arn <exection-arn generated before> --query 'status': should return status as SUCCEEDED
 */

class StartBuildStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    let project = new codebuild.Project(this, 'Project', {
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
      environmentVariables: {
        zone: {
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
          value: 'defaultZone',
        },
      },
    });

    let startBuild = new tasks.CodeBuildStartBuild(this, 'build-task', {
      project: project,
      environmentVariablesOverride: [{
        name: 'ZONE',
        type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
        value: sfn.JsonPath.stringAt('$.envVariables.zone'),
      }],
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
        modes: ['LOCAL_SOURCE_CACHE'],
        type: 'S3',
      },
      certificateOverride: 'string',
      computeTypeOverride: codebuild.ComputeType.MEDIUM,
      debugSessionEnabled: false,
      encryptionKeyOverride: 'string',
      environmentTypeOverride: 'LINUX_CONTAINER',
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

    const definition = new sfn.Pass(this, 'Start', {
      result: sfn.Result.fromObject({ bar: 'SomeValue' }),
    }).next(startBuild);

    const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition,
    });

    new cdk.CfnOutput(this, 'ProjectName', {
      value: project.projectName,
    });
    new cdk.CfnOutput(this, 'StateMachineArn', {
      value: stateMachine.stateMachineArn,
    });
  }
}

const app = new cdk.App();
new StartBuildStack(app, 'aws-stepfunctions-integ');
app.synth();
