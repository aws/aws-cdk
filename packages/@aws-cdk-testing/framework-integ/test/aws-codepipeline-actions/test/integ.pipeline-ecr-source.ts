import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';

/**
 * Manual validation steps
 *
 * Run test with `-vv` so that the outputs are printed and
 * `--no-clean` flag so that the stack is not deleted after the deployment is complete
 *
 * You should see output like:
 *
 * Outputs:
 * aws-cdk-codepipeline-ecr-source.PipelineConsoleLink = https://us-east-1.console.aws.amazon.com/codesuite/codepipeline/pipelines/aws-cdk-codepipeline-ecr-source-MyPipelineAED38ECF-1P0OYRLWF8FHY/view?region=us-east-1
 * aws-cdk-codepipeline-ecr-source.LoginCommand = aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 11111111111.dkr.ecr.us-east-1.amazonaws.com
 * aws-cdk-codepipeline-ecr-source.PushCommand = docker tag public.ecr.aws/lambda/provided 11111111111.dkr.ecr.us-east-1.amazonaws.com/aws-cdk-codepipeline-ecr-source-myecrrepo767466d0-gsrntpvfwc5w:latest \
 * && docker push 11111111111.dkr.ecr.us-east-1.amazonaws.com/aws-cdk-codepipeline-ecr-source-myecrrepo767466d0-gsrntpvfwc5w:latest
 *
 * Run the LoginCommand & PushCommand to tag and push an image to the ECR repository.
 * Then use the PipelineConsoleLink to navigate to the pipeline console page to validate that the pipeline
 * was triggered successfully.
 */

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-codepipeline:defaultPipelineTypeToV2': false,
    '@aws-cdk/pipelines:reduceStageRoleTrustScope': false,
  },
});

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-ecr-source');

const bucket = new s3.Bucket(stack, 'MyBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline', {
  artifactBucket: bucket,
});

const repository = new ecr.Repository(stack, 'MyEcrRepo', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const sourceStage = pipeline.addStage({ stageName: 'Source' });
sourceStage.addAction(new cpactions.EcrSourceAction({
  actionName: 'ECR_Source',
  output: new codepipeline.Artifact(),
  repository,
}));

const approveStage = pipeline.addStage({ stageName: 'Approve' });
approveStage.addAction(new cpactions.ManualApprovalAction({ actionName: 'ManualApproval' }));

new cdk.CfnOutput(stack, 'LoginCommand', {
  value: `aws ecr get-login-password --region ${stack.region} | docker login --username AWS --password-stdin ${stack.account}.dkr.ecr.${stack.region}.amazonaws.com`,
});

new cdk.CfnOutput(stack, 'PushCommand', {
  value: `docker tag public.ecr.aws/lambda/provided ${repository.repositoryUriForTag('latest')} && docker push ${repository.repositoryUriForTag('latest')}`,
});

new cdk.CfnOutput(stack, 'PipelineConsoleLink', {
  value: `https://${stack.region}.console.aws.amazon.com/codesuite/codepipeline/pipelines/${pipeline.pipelineName}/view?region=${stack.region}`,
});

new IntegTest(app, 'ecr-source-action', {
  testCases: [stack],
});
