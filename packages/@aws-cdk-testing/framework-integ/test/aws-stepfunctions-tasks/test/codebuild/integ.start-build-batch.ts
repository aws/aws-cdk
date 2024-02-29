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
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
      },
      timeout: cdk.Duration.hours(1),
      buildSpec: codebuild.BuildSpec.fromObjectToYaml({
        version: 0.2,
        batch: {
          'fast-fail': true,
          'build-list': [
            {
              identifier: 'linux_small',
              env: {
                'compute-type': 'BUILD_GENERAL1_SMALL',
                'image': 'aws/codebuild/standard:5.0',
                'type': 'LINUX_CONTAINER',
                'variables': {
                  key1: 'value1',
                },
              },
              buildspec: 'version: 0.2\nphases:\n  build:\n    commands:\n      - echo "Hello, from small!"',
            },
            {
              identifier: 'linux_medium',
              env: {
                'compute-type': 'BUILD_GENERAL1_MEDIUM',
                'image': 'aws/codebuild/standard:4.0',
                'type': 'LINUX_CONTAINER',
                'variables': {
                  key2: 'value2',
                },
              },
              buildspec: 'version: 0.2\nphases:\n  build:\n    commands:\n      - echo "Hello, from medium!"',
            },
          ],
        },
      }),
    });
    const buildconfig = project.enableBatchBuilds();

    if (buildconfig == null) {
      throw new Error('Batch builds not enabled');
    }

    const startBuildBatch1 = new tasks.CodeBuildStartBuildBatch(this, 'buildTask1', {
      project,
      integrationPattern: sfn.IntegrationPattern.REQUEST_RESPONSE,
      environmentVariablesOverride: {
        test: {
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
          value: 'testValue',
        },
      },
    });

    const startBuildBatch2 = new tasks.CodeBuildStartBuildBatch(this, 'buildTask2', {
      project,
      integrationPattern: sfn.IntegrationPattern.RUN_JOB,
      environmentVariablesOverride: {
        test: {
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
          value: 'testValue',
        },
      },
    });

    const definition = new sfn.Pass(this, 'Start', {
      result: sfn.Result.fromObject({ bar: 'SomeValue' }),
    }).next(startBuildBatch1).next(startBuildBatch2);

    new sfn.StateMachine(this, 'StateMachine', {
      definition,
    });
  }
}

const app = new cdk.App();
const stack = new TestStack(app, 'StartBuildBatch');
new IntegTest(app, 'StartBuildBatchInteg', {
  testCases: [stack],
});

app.synth();
