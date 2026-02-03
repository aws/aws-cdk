import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as cdk from 'aws-cdk-lib';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

/*
 * Creates a state machine with a task states needed to deploy the SageMaker Endpoint
 *
 * SageMaker jobs need training algorithms. These can be found in the AWS marketplace
 * or created.
 *
 * Stack verification steps:
 * The generated State Machine can be executed from the CLI (or Step Functions console)
 * and runs with an execution status of `Succeeded`.
 *
 * -- aws stepfunctions start-execution --state-machine-arn <state-machine-arn-from-output> provides execution arn
 * -- aws stepfunctions describe-execution --execution-arn <state-machine-arn-from-output> returns a status of `Succeeded`
 */

class CallSageMakerStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const encryptionKey = new kms.Key(this, 'EncryptionKey', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const trainingData = new s3.Bucket(this, 'TrainingData', {
      encryption: s3.BucketEncryption.KMS,
      encryptionKey,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const trainingJob = new tasks.SageMakerCreateTrainingJob(this, 'Train Task', {
      algorithmSpecification: {
        algorithmName: 'arn:aws:sagemaker:us-east-1:865070037744:algorithm/scikit-decision-trees-15423055-57b73412d2e93e9239e4e16f83298b8f',
      },
      inputDataConfig: [{
        channelName: 'InputData',
        dataSource: {
          s3DataSource: {
            s3Location: tasks.S3Location.fromBucket(trainingData, 'data/'),
          },
        },
      }],
      outputDataConfig: { s3OutputLocation: tasks.S3Location.fromBucket(trainingData, 'result/') },
      trainingJobName: 'mytrainingjob',
      resultPath: '$.TrainingJob',
    });
    const createModelTask = new tasks.SageMakerCreateModel(this, 'Create Model', {
      modelName: sfn.JsonPath.stringAt('$.Endpoint.Model'),
      primaryContainer: new tasks.ContainerDefinition({
        image: tasks.DockerImage.fromJsonExpression(sfn.JsonPath.stringAt('$.Endpoint.Image')),
        mode: tasks.Mode.SINGLE_MODEL,
        modelS3Location: tasks.S3Location.fromJsonExpression('$.TrainingJob.ModelArtifacts.S3ModelArtifacts'),
      }),
      resultPath: '$.Model',
    });

    const createEndpointConfigTask = new tasks.SageMakerCreateEndpointConfig(this, 'Create enpoint config', {
      endpointConfigName: sfn.JsonPath.stringAt('$.Endpoint.Config'),
      productionVariants: [{
        initialInstanceCount: 1,
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE),
        variantName: 'awesome-variant',
        modelName: sfn.JsonPath.stringAt('$.Endpoint.Model'),
      }],
      resultPath: '$.EndpointConfig',
    });

    const createEndpointTask = new tasks.SageMakerCreateEndpoint(this, 'Create endpoint', {
      endpointConfigName: sfn.JsonPath.stringAt('$.Endpoint.Config'),
      endpointName: sfn.JsonPath.stringAt('$.Endpoint.Name'),
      tags: sfn.TaskInput.fromObject([{
        Key: 'Endpoint',
        Value: 'New',
      }]),
      resultPath: '$.EndpointDeployed',
    });

    const updateEndpointTask = new tasks.SageMakerUpdateEndpoint(this, 'Update endpoint', {
      endpointConfigName: sfn.JsonPath.stringAt('$.Endpoint.Config'),
      endpointName: sfn.JsonPath.stringAt('$.Endpoint.Name'),
    });

    createEndpointTask.addCatch(updateEndpointTask, {
      errors: ['States.TaskFailed'],
      resultPath: '$.EndpointDeployed',
    });
    const definition = new sfn.Pass(this, 'Start', {
      result: sfn.Result.fromObject(
        {
          Endpoint: {
            // Change to real parameters for the actual run & put the testing data in the training bucket
            Image: 'ImageArn',
            Config: 'MyEndpointConfig',
            Name: 'MyEndpointName',
            Model: 'MyEndpointModelName',
          },
        }),
    })
      .next(trainingJob)
      .next(createModelTask)
      .next(createEndpointConfigTask)
      .next(createEndpointTask);

    const stateMachine = new sfn.StateMachine(this, 'StateMachine', {
      definition,
    });

    new cdk.CfnOutput(this, 'StateMachineArn', {
      value: stateMachine.stateMachineArn,
    });
  }
}

const app = new cdk.App();
new CallSageMakerStack(app, 'aws-stepfunctions-integ-sagemaker');
app.synth();

