import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const project = new codebuild.Project(this, 'Project', {
      projectName: 'MyTestProject',
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        batch: {
          'fast-fail': true,
          'buildGraph': [
            {
              identifier: 'linux_small',
              env: {
                computeType: 'BUILD_GENERAL1_SMALL',
                image: 'aws/codebuild/standard:4.0',
                type: 'LINUX_CONTAINER',
              },
            },
            {
              'identifier': 'linux_medium',
              'env': {
                computeType: 'BUILD_GENERAL1_MEDIUM',
                image: 'aws/codebuild/standard:4.0',
                type: 'LINUX_CONTAINER',
              },
              'depends-on': ['linux_small'],
            },
          ],
        },
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
    const buildconfig = project.enableBatchBuilds();

    if (buildconfig == null) {
      throw new Error('Batch builds not enabled');
    }

    const startBuildBatch = new tasks.CodeBuildStartBuild(this, 'build-task', {
      project,
      environmentVariablesOverride: {
        ZONE: {
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
          value: sfn.JsonPath.stringAt('$.envVariables.zone'),
        },
      },
    });

    const definition = new sfn.Pass(this, 'Start', {
      result: sfn.Result.fromObject({ bar: 'SomeValue' }),
    }).next(startBuildBatch);

    new sfn.StateMachine(this, 'StateMachine', {
      definition,
    });
  }
}

const app = new cdk.App();
const stack = new TestStack(app, 'StartBuildBatch');
new IntegTest(app, 'StartBuildBatchinteg', {
  testCases: [stack],
});

app.synth();
