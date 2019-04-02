import codebuild = require('@aws-cdk/aws-codebuild');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import actions = require('@aws-cdk/aws-codepipeline-actions');
import s3 = require('@aws-cdk/aws-s3');
import { Construct, SecretValue } from '@aws-cdk/cdk';

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

export class BootstrapPipeline extends Construct {
  constructor(scope: Construct, id: string, props: BootstrapPipelineProps) {
    super(scope, id);

    const sourcePrefix = 'https://github.com/';
    if (!props.source.startsWith(sourcePrefix)) {
      throw new Error(`"source" must start with ${sourcePrefix}`);
    }
    const source = props.source.substr(sourcePrefix.length);
    const [ owner, repo ] = source.split('/');

    const branch  = props.branch;
    const publishBucket = new s3.Bucket(this, 'Publish', { versioned: true });
    const objectKey = 'cloud-assembly.zip';

    const sourceAction = new actions.GitHubSourceAction({
      actionName: 'Pull',
      owner,
      repo,
      oauthToken: SecretValue.secretsManager(props.oauthSecret),
      outputArtifactName: 'Source',
      branch
    });

    const buildAction = new actions.CdkBuildAction(this, 'Build', {
      sourceArtifact: sourceAction.outputArtifact,
      workdir: props.workdir,
      build: props.build,
      environment: props.environment,
      install: props.install,
      version: props.version
    });

    const deployAction = new actions.CdkDeployAction(this, 'Deploy', {
      admin: true,
      assembly: buildAction.assembly,
      environment: props.environment,
      stacks: props.stacks,
      version: props.version,
      exclusively: props.exclusively
    });

    const publishAction = new actions.S3DeployAction({
      inputArtifact: buildAction.assembly,
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
        { name: 'Deploy',  actions: [ deployAction  ] },
        { name: 'Publish', actions: [ publishAction ] }
      ]
    });

    actions.CdkSourceAction.exportArtifacts(this, {
      boostrapId: id,
      bucketName: publishBucket.bucketName,
      objectKey
    });
  }
}
