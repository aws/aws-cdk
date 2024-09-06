import { Key } from 'aws-cdk-lib/aws-kms';
import { Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { App, CfnOutput, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { S3Location, SageMakerCreateTrainingJob, InputMode } from 'aws-cdk-lib/aws-stepfunctions-tasks';

/*
 * Creates a state machine with a task state to create a training job in AWS SageMaker
 * SageMaker jobs need training algorithms. These can be found in the AWS marketplace
 * or created.
 *
 * Subscribe to demo Algorithm vended by Amazon (free):
 * https://aws.amazon.com/marketplace/ai/procurement?productId=cc5186a0-b8d6-4750-a9bb-1dcdf10e787a
 * FIXME - create Input data pertinent for the training model and insert into S3 location specified in inputDataConfig.
 *
 * Stack verification steps:
 * The generated State Machine can be executed from the CLI (or Step Functions console)
 * and runs with an execution status of `Succeeded`.
 *
 * -- aws stepfunctions start-execution --state-machine-arn <state-machine-arn-from-output> provides execution arn
 * -- aws stepfunctions describe-execution --execution-arn <state-machine-arn-from-output> returns a status of `Succeeded`
 */
const app = new App();
const stack = new Stack(app, 'integ-stepfunctions-sagemaker');

const encryptionKey = new Key(stack, 'EncryptionKey', {
  removalPolicy: RemovalPolicy.DESTROY,
});
const trainingData = new Bucket(stack, 'TrainingData', {
  encryption: BucketEncryption.KMS,
  encryptionKey,
  removalPolicy: RemovalPolicy.DESTROY,
});

const sm = new StateMachine(stack, 'StateMachine', {
  definition: new SageMakerCreateTrainingJob(stack, 'TrainTask', {
    algorithmSpecification: {
      algorithmName: 'BlazingText',
      trainingInputMode: InputMode.FAST_FILE,
    },
    inputDataConfig: [{
      channelName: 'InputData',
      dataSource: {
        s3DataSource: {
          s3Location: S3Location.fromBucket(trainingData, 'data/'),
        },
      },
    }],
    outputDataConfig: { s3OutputLocation: S3Location.fromBucket(trainingData, 'result/') },
    trainingJobName: 'mytrainingjob',
  }),
});

const smWithoutInputData = new StateMachine(stack, 'StateMachineAnother', {
  definition: new SageMakerCreateTrainingJob(stack, 'TrainTaskAnother', {
    algorithmSpecification: {
      algorithmName: 'BlazingText',
      trainingInputMode: InputMode.FAST_FILE,
    },
    outputDataConfig: { s3OutputLocation: S3Location.fromBucket(trainingData, 'result/') },
    trainingJobName: 'mytrainingjob',
  }),
});

new CfnOutput(stack, 'stateMachineArn', {
  value: sm.stateMachineArn,
});

new CfnOutput(stack, 'stateMachineArn2', {
  value: smWithoutInputData.stateMachineArn,
});
