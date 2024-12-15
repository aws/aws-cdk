import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { S3Location, SageMakerCreateTrainingJob, InputMode } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { StateMachine, IntegrationPattern } from 'aws-cdk-lib/aws-stepfunctions';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'step-functions-sagemaker-create-training-job-no-input');

const trainingData = new Bucket(stack, 'TrainingData', {
  removalPolicy: RemovalPolicy.DESTROY,
});

new StateMachine(stack, 'StateMachine', {
  definition: new SageMakerCreateTrainingJob(stack, 'TrainTask', {
    trainingJobName: 'MyTrainingJob',
    integrationPattern: IntegrationPattern.RUN_JOB,
    algorithmSpecification: {
      algorithmName: 'BlazingText',
      trainingInputMode: InputMode.FAST_FILE,
    },
    outputDataConfig: {
      s3OutputLocation: S3Location.fromBucket(trainingData, 'result/'),
    },
  }),
});

new integ.IntegTest(app, 'StepFunctionSageMakerCreateTrainingJobNoInput', {
  testCases: [stack],
});

app.synth();
