import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codebuild-logging');

new codebuild.PipelineProject(stack, 'Project', {
  logging: {
    cloudWatch: {
      logGroup: new logs.LogGroup(stack, 'LogingGroup', {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }),
    },
    s3: {
      bucket: new s3.Bucket(stack, 'LoggingBucket', {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }),
    },
  },
});

app.synth();
