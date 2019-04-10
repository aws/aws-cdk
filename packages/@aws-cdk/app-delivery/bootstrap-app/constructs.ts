import codebuild = require('@aws-cdk/aws-codebuild');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import cpactions = require('@aws-cdk/aws-codepipeline-actions');
import iam = require('@aws-cdk/aws-iam');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');

export interface BootstrapPipelineProps {
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
   * Version of the CDK Toolkit to use.
   * @default - uses latest version
   */
  readonly version?: string;

  /**
   * Stack names to deploy
   * @default - deploy all stacks don't have `autoDeploy: false`
   */
  readonly stacks?: string[];
}

export class BootstrapPipeline extends cdk.Construct {
  constructor(scope: cdk.Stack, id: string, props: BootstrapPipelineProps) {
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

    const workdir = props.workdir || '.';
    const install = props.install || 'npx npm@latest ci';
    const build   = props.build   || 'npm run build';
    const version = props.version || 'latest';
    const stacks  = props.stacks  || [];
    const branch  = props.branch;

    const sourceAction = new cpactions.GitHubSourceAction({
      actionName: 'Pull',
      owner,
      repo,
      oauthToken: cdk.SecretValue.secretsManager(props.oauthSecret),
      outputArtifactName: 'Source',
      branch
    });

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

    new codepipeline.Pipeline(this, 'Bootstrap', {
      restartExecutionOnUpdate: true,
      stages: [
        { name: 'Source',  actions: [ sourceAction  ] },
        { name: 'Build',   actions: [ buildAction   ] },
        { name: 'Publish', actions: [ publishAction ] }
      ]
    });

    const exportPrefix = `cdk-pipeline:${id}`;

    new cdk.CfnOutput(this, 'PublishBucketName', {
      value: publishBucket.bucketName,
      export: `${exportPrefix}-bucket`
    });

    new cdk.CfnOutput(this, 'PublishObjectKey', {
      value: objectKey,
      export: `${exportPrefix}-object-key`
    });

    new cdk.CfnOutput(this, 'ToolkitVersion', {
      value: version,
      export: `${exportPrefix}-toolkit-version`
    });
  }
}
