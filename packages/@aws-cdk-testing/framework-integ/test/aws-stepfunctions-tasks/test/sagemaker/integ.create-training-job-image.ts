import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { S3Location, SageMakerCreateTrainingJob, InputMode, DockerImage } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { StateMachine, IntegrationPattern } from 'aws-cdk-lib/aws-stepfunctions';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { randomUUID } from 'crypto';

const app = new App();
const stack = new Stack(app, 'step-functions-sagemaker-create-training-job-image');

const trainingData = new Bucket(stack, 'TrainingData', {
  removalPolicy: RemovalPolicy.DESTROY,
});

new StateMachine(stack, 'StateMachine', {
  definition: new SageMakerCreateTrainingJob(stack, 'TrainTask', {
    trainingJobName: `MyTrainingJob-${randomUUID()}`,
    integrationPattern: IntegrationPattern.RUN_JOB,
    inputDataConfig: [{
      channelName: 'train',
      dataSource: {
        s3DataSource: {
          s3Location: S3Location.fromBucket(trainingData, 'data/'),
        },
      },
    }],
    hyperparameters: {
      mode: 'supervised',
    },
    algorithmSpecification: {
      // Account for AWS builtin BlazingText image
      trainingImage: DockerImage.fromRegistry(`811284229777.dkr.ecr.${stack.region}.amazonaws.com/blazingtext`), 
      trainingInputMode: InputMode.FAST_FILE,
    },
    outputDataConfig: {
      s3OutputLocation: S3Location.fromBucket(trainingData, 'result/'),
    },
  }),
});

new integ.IntegTest(app, 'StepFunctionSageMakerCreateTrainingJobImage', {
  testCases: [stack],
});

app.synth();
