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

const sourceAction = bucket.toCodePipelineSourceAction({
  actionName: 'S3',
  bucketKey: 'some/path',
});
const sourceStage = {
  name: 'Source',
  actions: [sourceAction],
};

const role = new iam.Role(stack, 'ActionRole', {
  assumedBy: new iam.AccountPrincipal(cdk.Aws.accountId)
});
role.addToPolicy(new iam.PolicyStatement()
  .addAction('sqs:*')
  .addAllResources()
);
const cfnStage = {
  name: 'CFN',
  actions: [
    new cloudformation.PipelineCreateUpdateStackAction({
      actionName: 'CFN_Deploy',
      stackName: 'aws-cdk-codepipeline-cross-region-deploy-stack',
      templatePath: sourceAction.outputArtifact.atPath('template.yml'),
      adminPermissions: false,
      role
    }),
  ],
};

const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline', {
  artifactBucket: bucket,
  stages: [
    sourceStage,
    cfnStage,
  ],
});
pipeline.addToRolePolicy(new iam.PolicyStatement()
  .addActions("sts:AssumeRole", "iam:PassRole")
  .addAllResources()
);

app.run();
