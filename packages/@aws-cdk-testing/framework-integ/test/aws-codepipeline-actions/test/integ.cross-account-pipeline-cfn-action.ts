import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, Fn, PhysicalName, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as path from 'path';
import { Construct } from 'constructs';
import { Key } from 'aws-cdk-lib/aws-kms';

/**
 * Notes on how to run this integ test
 * Replace 123456789012 and 234567890123 with your own account numbers
 *
 * 1. Configure Accounts
 *   a. Account A (123456789012) should be bootstrapped for us-east-1
 *      and needs to set trust permissions for account B (234567890123)
 *      - `cdk bootstrap --trust 234567890123 --cloudformation-execution-policies 'arn:aws:iam::aws:policy/AdministratorAccess'`
 *      - assuming this is the default profile for aws credentials
 *   b. Account B (234567890123) should be bootstrapped for us-east-1
 *     - assuming this account is configured with the profile 'cross-account' for aws credentials
 *
 * 2. Set environment variables
 *   a. `export CDK_INTEG_ACCOUNT=123456789012`
 *   b. `export CDK_INTEG_CROSS_ACCOUNT=234567890123`
 *
 * 3. Run the integ test (from the @aws-cdk-testing/framework-integ/test directory)
 *   a. Get temporary console access credentials for account B
 *     - `yarn integ pipelines/test/integ.cross-account-pipeline-action.js`
 *   b. Fall back if temp credentials do not work (account info may be in snapshot)
 *     - `yarn integ pipelines/test/integ.cross-account-pipeline-action.js --profiles cross-account`
 *
 * 4. Before you commit, set both accounts to dummy values, run integ test in dry run mode, and then push the snapshot.
 */

const account = process.env.CDK_INTEG_ACCOUNT || '123456789012';
const crossAccount = process.env.CDK_INTEG_CROSS_ACCOUNT || '234567890123';
const region = process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION;

class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceBucketKey = new Key(this, 'SourceBucketKey');

    const bucket = new s3.Bucket(this, 'SourceBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      versioned: true,
      encryptionKey: sourceBucketKey,
    });

    const bucketDeployment = new s3deploy.BucketDeployment(this, 'BucketDeployment', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'cloudformation', 'test-artifact'))],
      destinationBucket: bucket,
      extract: false,
    });
    const zipKey = Fn.select(0, bucketDeployment.objectKeys);

    const sourceOutput = new codepipeline.Artifact('SourceArtifact');
    const sourceAction = new codepipeline_actions.S3SourceAction({
      actionName: 'Source',
      output: sourceOutput,
      bucket,
      bucketKey: zipKey,
    });
    const buildOutput = new codepipeline.Artifact('BuildOutput');

    // Create the pipeline
    const pipeline = new codepipeline.Pipeline(this, 'CrossAccountCloudformationPipeline', {
      pipelineName: 'cross-account-cfn-pipeline',
      crossAccountKeys: true,
      artifactBucket: new s3.Bucket(this, 'ArtifactBucket', {
        encryption: s3.BucketEncryption.KMS,
        removalPolicy: RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
        bucketName: PhysicalName.GENERATE_IF_NEEDED,
      }),
    });

    // Add the source stage
    pipeline.addStage({
      stageName: 'Source',
      actions: [
        sourceAction,
      ],
    });

    // Add a build stage
    pipeline.addStage({
      stageName: 'Build',
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: 'BuildAction',
          project: new codebuild.PipelineProject(this, 'BuildProject', {
            environment: {
              buildImage: codebuild.LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_3_0,
              computeType: codebuild.ComputeType.SMALL,
            },
            buildSpec: codebuild.BuildSpec.fromObject({
              version: '0.2',
              phases: {
                install: {
                  commands: [
                    'npm install -y jq',
                  ],
                },
                build: {
                  commands: [
                    'echo "Starting build..."',
                  ],
                },
              },
            }),
          }),
          input: sourceOutput,
          outputs: [buildOutput],
        }),
      ],
    });

    // Add the CloudFormation deploy stage
    pipeline.addStage({
      stageName: 'CFN',
      actions: [
        new codepipeline_actions.CloudFormationCreateUpdateStackAction({
          actionName: 'CFNDeploy',
          stackName: 'aws-cdk-codepipeline-cross-account-deploy-stack',
          templatePath: sourceOutput.atPath('template.yaml'),
          adminPermissions: false,
          account: crossAccount,
        }),
      ],
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/pipelines:reduceCrossAccountActionRoleTrustScope': true,
  },
});

// Pipeline stack in source account
const pipelineStack = new PipelineStack(app, 'CdkPipelineCfnActionStack', {
  env: {
    account: account,
    region,
  },
});

new integ.IntegTest(app, 'integ-pipeline-cfn-cross-account', {
  testCases: [pipelineStack],
  diffAssets: true,
});

app.synth();
