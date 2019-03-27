import codebuild = require('@aws-cdk/aws-codebuild');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import cpactions = require('@aws-cdk/aws-codepipeline-actions');
import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import secretsmanager = require('@aws-cdk/aws-secretsmanager');
import { CfnOutput, Construct, Secret } from '@aws-cdk/cdk';
import { BuildAction } from '../lib/build';
import { DeployAction } from '../lib/deploy';

export interface PipelineProps {
  /**
   * Github oauth secrets manager ARN.
   */
  readonly oauthSecret: string;

  /**
   * The GitHub https URL.
   */
  readonly source: string;

  /**
   * @default - default branch
   */
  readonly branch?: string;

  /**
   * Working directory to run build command.
   * @default - root directory of your repository
   */
  readonly workdir?: string;

  /**
   * Names of all the stacks to deploy.
   * @default - deploys all stacks in the assembly that are not marked "autoDeploy: false"
   */
  readonly stacks?: string[];

  /**
   * CodeBuild environment to use.
   */
  readonly environment?: codebuild.BuildEnvironment;

  /**
   * @default "npm ci"
   */
  readonly install?: string;

  /**
   * @default "npm run build && npm test"
   */
  readonly build?: string;

  /**
   * Indicates if only these stacks should be deployed or also any dependencies.
   * @default false deploys all stacks and their dependencies in topological order.
   */
  readonly exclusively?: boolean;

  /**
   * Grant administrator privilages on your account to the build & deploy
   * CodeBuild project.
   *
   * @default true
   */
  readonly admin?: boolean;

  /**
   * CDK toolchain version.
   * @default - latest
   */
  readonly version?: string;
}

export class Pipeline extends Construct {
  constructor(scope: Construct, id: string, props: PipelineProps) {
    super(scope, id);

    const sourcePrefix = 'https://github.com/';
    if (!props.source.startsWith(sourcePrefix)) {
      throw new Error(`"source" must start with ${sourcePrefix}`);
    }
    const source = props.source.substr(sourcePrefix.length);
    const [ owner, repo ] = source.split('/');

    // const oauth = new secretsmanager.SecretString(this, 'OauthTokenSecret', {
    //   secretId: props.oauthSecret
    // });

    const version = props.version || 'latest';
    const branch  = props.branch;

    const sourceAction = new cpactions.GitHubSourceAction({
      actionName: 'Pull',
      owner,
      repo,
      oauthToken: cdk.SecretValue.secretsManager(props.oauthSecret),
      outputArtifactName: 'Source',
      branch
    });

    const buildAction = new BuildAction(this, 'BuildDeploy', {
      sourceArtifact: sourceAction.outputArtifact,
      workdir: props.workdir,
      build: props.build,
      environment: props.environment,
      install: props.install,
      version: props.version
    }).action;
    const environment = props.environment || {
      buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_1_0,
    };

    const buildSpec = {
      version: '0.2',
      phases: {
        install: {
          commands: [
            `cd ${workdir}`,
            install,
          ]
        },
        build: {
          commands: [
            build,
            `npx --package aws-cdk@${version} -- cdk deploy ${stacks.join(' ')} --require-approval=never`
          ]
        }
      },
      artifacts: {
        'files': [ '**/*' ],
        'base-directory': workdir
      }
    };

    const buildProject = new codebuild.PipelineProject(this, 'Build', {
      environment,
      buildSpec
    });

    buildProject.addToRolePolicy(new iam.PolicyStatement()
      .addAllResources()
      .addAction('*'));

    const buildAction = new cpactions.CodeBuildBuildAction({
      inputArtifact: sourceAction.outputArtifact,
      project: buildProject,
      actionName: 'Build',
    });

    const publishBucket = new s3.Bucket(this, 'Publish', {
      versioned: true
    });

    const objectKey = 'cloud-assembly.zip';

    const publishAction = new cpactions.S3DeployAction({
      inputArtifact: buildAction.outputArtifact,
      actionName: 'Publish',
      bucket: publishBucket,
      objectKey,
      extract: false
    });

    const deployAction = new DeployAction({
      admin: true,
      assembly: buildAction.outputArtifact,
      stacks: props.stacks,
      version: props.version,
      exclusively: props.exclusively
    });

    new codepipeline.Pipeline(this, 'Bootstrap', {
      restartExecutionOnUpdate: true,
      stages: [
        { name: 'Source',  actions: [ sourceAction  ] },
        { name: 'Build',   actions: [ buildAction   ] },
        { name: 'Deploy',  actions: [ deployAction  ] },
        { name: 'Publish', actions: [ publishAction ] }
      ]
    });

    const exportPrefix = `cdk-pipeline:${id}`;

    new CfnOutput(this, 'PublishBucketName', {
      value: publishBucket.bucketName,
      export: `${exportPrefix}-bucket`
    });

    new CfnOutput(this, 'PublishObjectKey', {
      value: objectKey,
      export: `${exportPrefix}-object-key`
    });

    new CfnOutput(this, 'ToolchainVersion', {
      value: version,
      export: `${exportPrefix}-toolchain-version`
    });
  }
}
