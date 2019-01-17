import cloudformation = require('@aws-cdk/aws-cloudformation');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('../lib');

const app = new cdk.App();

const region = 'us-west-2'; // hardcode the region
const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-cloudformation-cross-region', {
  env: {
    region,
  },
});

const bucket = new s3.Bucket(stack, 'MyBucket', {
  versioned: true,
  removalPolicy: cdk.RemovalPolicy.Destroy,
});

const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline', {
  artifactsStore: new codepipeline.ArtifactsStore(stack, 'ArtifactsStore', { bucket } )
});

const sourceStage = pipeline.addStage('Source');
const sourceAction = bucket.addToPipeline(sourceStage, 'S3', {
  bucketKey: 'some/path',
});

const cfnStage = pipeline.addStage('CFN');
new cloudformation.PipelineCreateUpdateStackAction(stack, 'CFN_Deploy', {
  stage: cfnStage,
  stackName: 'aws-cdk-codepipeline-cross-region-deploy-stack',
  templatePath: sourceAction.outputArtifact.atPath('template.yml'),
  adminPermissions: false,
  region,
});

app.run();
