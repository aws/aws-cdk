import codebuild = require('@aws-cdk/aws-codebuild');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import cpactions = require('@aws-cdk/aws-codepipeline-actions');
import { Construct } from '@aws-cdk/cdk';

export interface BuildActionProps {
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
   * The source artifact to build from.
   */
  readonly sourceArtifact: codepipeline.Artifact;
}

export class BuildAction extends Construct {
  public readonly action: cpactions.CodeBuildBuildAction;

  constructor(scope: Construct, id: string, props: BuildActionProps) {
    super(scope, id);

    const workdir = props.workdir || '.';
    const install = props.install || 'npx npm@latest ci';
    const build   = props.build   || 'npm run build';

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
          ]
        }
      },
      artifacts: {
        'files': [ '**/*' ],
        'base-directory': workdir
      }
    };

    const buildProject = new codebuild.PipelineProject(this, 'BuildDeploy', {
      environment,
      buildSpec
    });

    this.action = new cpactions.CodeBuildBuildAction({
      inputArtifact: props.sourceArtifact,
      project: buildProject,
      actionName: 'Build',
    });
  }
}
