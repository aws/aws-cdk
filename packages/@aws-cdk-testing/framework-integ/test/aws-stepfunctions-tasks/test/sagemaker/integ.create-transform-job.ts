import { App, Stack, StackProps } from 'aws-cdk-lib';
import { InstanceType, InstanceClass, InstanceSize } from 'aws-cdk-lib/aws-ec2';
import { SageMakerCreateTransformJob, S3DataType } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { StateMachine, IntegrationPattern, DefinitionBody } from 'aws-cdk-lib/aws-stepfunctions';

class StepFunctionsTaskCreateTransformJobIntegStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);
    const batch_inference_job = new SageMakerCreateTransformJob(this, 'Batch Inference', {
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
      definitionBody: DefinitionBody.fromChainable(batch_inference_job),
    });
  }
}

const app = new App();
new StepFunctionsTaskCreateTransformJobIntegStack(app, 'aws-cdk-step-functions-task-create-transform-job-integ');
app.synth();