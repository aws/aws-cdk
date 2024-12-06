import { App, Stack, StackProps } from 'aws-cdk-lib';
import { InstanceType, InstanceClass, InstanceSize } from 'aws-cdk-lib/aws-ec2';
import { SageMakerCreateTransformJob, S3DataType } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { StateMachine, IntegrationPattern, DefinitionBody } from 'aws-cdk-lib/aws-stepfunctions';
import * as integ from '@aws-cdk/integ-tests-alpha';

class StepFunctionsTaskCreateTransformJobIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const task = new SageMakerCreateTransformJob(this, 'BatchInferenceTask', {
      transformJobName: 'MyTransformJob',
      modelName: 'MyModelName',
      transformInput: {
        transformDataSource: {
          s3DataSource: {
            s3Uri: 's3://inputbucket/prefix',
            s3DataType: S3DataType.S3_PREFIX,
          },
        },
      },
      transformOutput: {
        s3OutputPath: 's3://outputbucket/result',
      },
      transformResources: {
        instanceCount: 1,
        instanceType: InstanceType.of(InstanceClass.M4, InstanceSize.XLARGE),
      },
      integrationPattern: IntegrationPattern.RUN_JOB,
    });

    new StateMachine(this, 'SimpleStateMachine', {
      definitionBody: DefinitionBody.fromChainable(task),
    });
  }
}

const app = new App();
const stack = new StepFunctionsTaskCreateTransformJobIntegStack(app, 'aws-cdk-step-functions-task-create-transform-job-integ');

new integ.IntegTest(app, 'SqsTest', {
  testCases: [stack],
});

app.synth();
