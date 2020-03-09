import { InstanceClass, InstanceSize, InstanceType } from '@aws-cdk/aws-ec2';
import { Key } from '@aws-cdk/aws-kms';
import { Bucket, BucketEncryption } from '@aws-cdk/aws-s3';
import { Data, StateMachine, Task } from '@aws-cdk/aws-stepfunctions';
import { App, RemovalPolicy, Stack } from '@aws-cdk/core';
import { DockerImage, ModelContainerMode, S3Location, SagemakerCreateEndpointConfigTask, SagemakerCreateEndpointTask,
   SagemakerCreateModelTask, SagemakerTrainTask, SagemakerUpdateEndpointTask  } from '../lib';

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

const createTrainingJobTask = new Task(stack, 'Create Training Job', {
  task: new SagemakerTrainTask({
    algorithmSpecification: {
      algorithmName: 'GRADIENT_ASCENT',
    },
    inputDataConfig: [{ channelName: 'InputData', dataSource: {
      s3DataSource: {
        s3Location: S3Location.fromBucket(trainingData, 'data/')
      }
    } }],
    outputDataConfig: { s3OutputLocation: S3Location.fromBucket(trainingData, 'result/') },
    trainingJobName: 'MyTrainingJob'
  }),
  resultPath: '$.TrainingJob'
});

const createModelTask = new Task(stack, 'Create Model', {
  task: new SagemakerCreateModelTask({
    modelName: 'MyModel',
    primaryContainer: {
      image: DockerImage.fromRegistry(Data.stringAt('$.TrainingJob.image_name')),
      mode: ModelContainerMode.SINGLEMODEL,
      modelDataUrl: Data.stringAt("$.TrainingJob.ModelArtifacts.S3ModelArtifacts")
    }
  }),
  resultPath: '$.Model'
});

const createEndpointConfigTask = new Task(stack, 'Create Endpoint Config', {
  task: new SagemakerCreateEndpointConfigTask({
    endpointConfigName: Data.stringAt("$.endpoint.endpoint_config"),
    productionVariants: [{
      initialInstanceCount: Data.numberAt("$.endpoint.instance_config.instance_count"),
      instanceType:  InstanceType.of(InstanceClass.M5, InstanceSize.XLARGE),
      modelName: Data.stringAt("$.training.training_name"),
      variantName: "default-variant-name"
    }]
  }),
  resultPath: '$.EndpointConfig'
});

const createEndpointTask = new Task(stack, 'Create Endpoint', {
  task: new SagemakerCreateEndpointTask({
    endpointConfigName: Data.stringAt("$.endpoint.endpoint_config"),
    endpointName: Data.stringAt("$.endpoint.endpoint_name")
  }),
  resultPath: '$.Deploy'
});

const updateEndpointTask = new Task(stack, 'Update Endpoint', {
  task: new SagemakerUpdateEndpointTask({
    endpointConfigName: Data.stringAt("$.endpoint.endpoint_config"),
    endpointName: Data.stringAt("$.endpoint.endpoint_name")
  }),
  resultPath: '$.Deploy'
});

createEndpointTask.addCatch(updateEndpointTask, {
  errors: ["States.TaskFailed"],
  resultPath: "$.Deploy"
});

new StateMachine(stack, 'StateMachine', {
  definition: createTrainingJobTask.next(createModelTask).next(createEndpointConfigTask).next(createEndpointTask)
});
