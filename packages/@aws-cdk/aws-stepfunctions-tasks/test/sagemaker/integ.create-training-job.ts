import { Key } from '@aws-cdk/aws-kms';
import { Bucket, BucketEncryption } from '@aws-cdk/aws-s3';
import { StateMachine } from '@aws-cdk/aws-stepfunctions';
import { App, RemovalPolicy, Stack } from '@aws-cdk/core';
import { S3Location } from '../../lib';
import { SageMakerCreateTrainingJob } from '../../lib/sagemaker/create-training-job';

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

new StateMachine(stack, 'StateMachine', {
  definition: new SageMakerCreateTrainingJob(stack, 'TrainTask', {
    algorithmSpecification: {
      algorithmName: 'GRADIENT_ASCENT',
    },
    inputDataConfig: [{ channelName: 'InputData', dataSource: {
      s3DataSource: {
        s3Location: S3Location.fromBucket(trainingData, 'data/'),
      },
    } }],
    outputDataConfig: { s3OutputLocation: S3Location.fromBucket(trainingData, 'result/') },
    trainingJobName: 'MyTrainingJob',
  }),
});
