import cfn = require('@aws-cdk/aws-cloudformation');
import { Role } from '@aws-cdk/aws-iam';
import { ServicePrincipal } from '@aws-cdk/aws-iam';
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-cloudformation');

const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

const bucket = new s3.Bucket(stack, 'PipelineBucket', {
  versioned: true,
  removalPolicy: cdk.RemovalPolicy.Destroy,
});

const source = new s3.PipelineSourceAction({
  actionName: 'Source',
  outputArtifactName: 'SourceArtifact',
  bucket,
  bucketKey: 'key',
});
const sourceStage = {
  name: 'Source',
  actions: [source],
};

const changeSetName = "ChangeSetIntegTest";
const stackName = "IntegTest-TestActionStack";
const role = new Role(stack, 'CfnChangeSetRole', {
  assumedBy: new ServicePrincipal('cloudformation.amazonaws.com'),
});

pipeline.addStage(sourceStage);
pipeline.addStage({
  name: 'CFN',
  actions: [
    new cfn.PipelineCreateReplaceChangeSetAction({
      actionName: 'DeployCFN',
      changeSetName,
      stackName,
      deploymentRole: role,
      templatePath: source.outputArtifact.atPath('test.yaml'),
      adminPermissions: false,
      parameterOverrides: {
        BucketName: source.outputArtifact.bucketName,
        ObjectKey: source.outputArtifact.objectKey,
        Url: source.outputArtifact.url,
        OtherParam: source.outputArtifact.getParam('params.json', 'OtherParam'),
      },
    }),
  ],
});

app.run();
