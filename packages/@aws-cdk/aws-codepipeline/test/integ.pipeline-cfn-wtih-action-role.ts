import cloudformation = require('@aws-cdk/aws-cloudformation');
import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('../lib');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-cloudformation-cross-region-with-action-role', {});

const bucket = new s3.Bucket(stack, 'MyBucket', {
  versioned: true,
  removalPolicy: cdk.RemovalPolicy.Destroy,
});

const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline', {
  artifactBucket: bucket,
});

const sourceStage = pipeline.addStage('Source');
const sourceAction = bucket.addToPipeline(sourceStage, 'S3', {
  bucketKey: 'some/path',
});

const cfnStage = pipeline.addStage('CFN');

const role = new iam.Role(stack, 'ActionRole', {
  assumedBy: new iam.AccountPrincipal(new cdk.Aws().accountId)
});
role.addToPolicy(new iam.PolicyStatement()
  .addAction('sqs:*')
  .addAllResources()
);

new cloudformation.PipelineCreateUpdateStackAction(stack, 'CFN_Deploy', {
  stage: cfnStage,
  stackName: 'aws-cdk-codepipeline-cross-region-deploy-stack',
  templatePath: sourceAction.outputArtifact.atPath('template.yml'),
  adminPermissions: false,
  actionRole: role
});

pipeline.addToRolePolicy(new iam.PolicyStatement()
  .addActions("sts:AssumeRole", "iam:PassRole")
  .addAllResources()
);

app.run();
