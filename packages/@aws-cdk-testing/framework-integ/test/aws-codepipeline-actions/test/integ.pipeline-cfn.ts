import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-cloudformation');

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
  crossAccountKeys: true,
});

const bucket = new s3.Bucket(stack, 'PipelineBucket', {
  versioned: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const sourceOutput = new codepipeline.Artifact('SourceArtifact');
const additionalArtifact = new codepipeline.Artifact('AdditionalArtifact');
const source = new cpactions.S3SourceAction({
  actionName: 'Source',
  output: sourceOutput,
  bucket,
  bucketKey: 'key',
});
const sourceStage = {
  stageName: 'Source',
  actions: [
    source,
    new cpactions.S3SourceAction({
      actionName: 'AdditionalSource',
      output: additionalArtifact,
      bucket,
      bucketKey: 'additional/key',
    }),
  ],
};

const changeSetName = 'ChangeSetIntegTest';
const stackName = 'IntegTest-TestActionStack';
const role = new Role(stack, 'CfnChangeSetRole', {
  assumedBy: new ServicePrincipal('cloudformation.amazonaws.com'),
});

pipeline.addStage(sourceStage);
pipeline.addStage({
  stageName: 'CFN',
  actions: [
    new cpactions.CloudFormationCreateReplaceChangeSetAction({
      actionName: 'DeployCFN',
      changeSetName,
      stackName,
      deploymentRole: role,
      templatePath: sourceOutput.atPath('test.yaml'),
      adminPermissions: false,
      parameterOverrides: {
        BucketName: sourceOutput.bucketName,
        ObjectKey: sourceOutput.objectKey,
        Url: additionalArtifact.url,
        OtherParam: sourceOutput.getParam('params.json', 'OtherParam'),
      },
      extraInputs: [additionalArtifact],
    }),
  ],
});

app.synth();
