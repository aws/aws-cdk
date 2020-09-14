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

    const owner = 'aws';
    const repo = 'aws-cdk';
    const source = codebuild.Source.gitHub({
      owner,
      repo,
      branchOrRef: 'master',
    });

    let project = new codebuild.Project(this, 'Project', {
      projectName: 'MyTestProject',
      source,
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

    const sourceOverride = codebuild.Source.gitHub({
      branchOrRef: sfn.JsonPath.stringAt('$.sourceCommit'),
      owner,
      repo,
    });
    let startBuild = new tasks.CodeBuildStartBuild(this, 'build-task', {
      project: project,
      overrides: {
        source: sourceOverride,
        environment: {
          computeType: codebuild.ComputeType.X2_LARGE,
        },
        environmentVariables: {
          ZONE: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: sfn.JsonPath.stringAt('$.envVariables.zone'),
          },
        },
      },
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
new StartBuildStack(app, 'aws-stepfunctions-tasks-codebuild-start-build-integ');
app.synth();
