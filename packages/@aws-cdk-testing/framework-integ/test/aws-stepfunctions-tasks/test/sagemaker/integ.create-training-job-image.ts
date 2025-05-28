/// !cdk-integ sfn-sm-training-job-image
import { App, Duration, Stack } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { S3Location, SageMakerCreateTrainingJob, InputMode, DockerImage } from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { StateMachine, IntegrationPattern } from 'aws-cdk-lib/aws-stepfunctions';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import * as path from 'path';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new Stack(app, 'sfn-sm-training-job-image');

// Please manually cleanup this bucket after testing.
// We cannot put remove policy DESTROY here as objects cannot be automatically deleted
const bucket = new Bucket(stack, 'Bucket');

// Reference https://docs.aws.amazon.com/sagemaker/latest/dg/blazingtext.html#bt-inputoutput
new BucketDeployment(stack, 'TrainSet', {
  sources: [Source.asset(path.join(__dirname, 'blazingtext-dataset'))],
  destinationBucket: bucket,
});

const sm = new StateMachine(stack, 'StateMachine', {
  definition: new SageMakerCreateTrainingJob(stack, 'TrainTask', {
    trainingJobName: 'MyBlazingTextTrainingJob',
    integrationPattern: IntegrationPattern.RUN_JOB,
    inputDataConfig: [{
      channelName: 'train',
      dataSource: {
        s3DataSource: {
          s3Location: S3Location.fromBucket(bucket, 'data/'),
        },
      },
    }],
    hyperparameters: {
      mode: 'supervised',
    },
    algorithmSpecification: {
      // AWS Account storing builtin BlazingText image
      trainingImage: DockerImage.fromRegistry(`811284229777.dkr.ecr.${stack.region}.amazonaws.com/blazingtext`),
      trainingInputMode: InputMode.FAST_FILE,
    },
    outputDataConfig: {
      s3OutputLocation: S3Location.fromBucket(bucket, 'result/'),
    },
  }),
});

const integTest = new integ.IntegTest(app, 'SfnSMTrainingJobImage', {
  testCases: [stack],
});

const startExecutionCall = integTest.assertions.awsApiCall('StepFunctions', 'startExecution', {
  stateMachineArn: sm.stateMachineArn,
});

integTest.assertions.awsApiCall('StepFunctions', 'describeExecution', {
  executionArn: startExecutionCall.getAttString('executionArn'),
  includedData: 'METADATA_ONLY',
})
  .expect(integ.ExpectedResult.objectLike({
    status: 'SUCCEEDED',
  }))
  .waitForAssertions({
    totalTimeout: Duration.minutes(10),
    interval: Duration.minutes(1),
  });

app.synth();
