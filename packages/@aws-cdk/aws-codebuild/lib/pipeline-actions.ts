import codepipeline = require('@aws-cdk/aws-codepipeline-api');
import cdk = require('@aws-cdk/cdk');
import { ProjectRef } from './project';

/**
 * Common properties for creating {@link PipelineBuildAction} -
 * either directly, through its constructor,
 * or through {@link ProjectRef#addBuildToPipeline}.
 */
export interface CommonPipelineBuildActionProps {
  /**
   * The source to use as input for this build
   */
  inputArtifact: codepipeline.Artifact;

  /**
   * The name of the build's output artifact
   */
  artifactName?: string;
}

/**
 * Construction properties of the {@link PipelineBuildAction CodeBuild build CodePipeline Action}.
 */
export interface PipelineBuildActionProps extends CommonPipelineBuildActionProps, codepipeline.CommonActionProps {
  /**
   * The build project
   */
  project: ProjectRef;
}

/**
 * CodePipeline build Action that uses AWS CodeBuild.
 */
export class PipelineBuildAction extends codepipeline.BuildAction {
  constructor(parent: cdk.Construct, name: string, props: PipelineBuildActionProps) {
    // This happened when ProjectName was accidentally set to the project's ARN:
    // https://qiita.com/ikeisuke/items/2fbc0b80b9bbd981b41f

    super(parent, name, {
      stage: props.stage,
      provider: 'CodeBuild',
      inputArtifact: props.inputArtifact,
      artifactName: props.artifactName,
      configuration: {
        ProjectName: props.project.projectName
      }
    });

    const actions = [
      'codebuild:BatchGetBuilds',
      'codebuild:StartBuild',
      'codebuild:StopBuild',
    ];

    props.stage.pipelineRole.addToPolicy(new cdk.PolicyStatement()
      .addResource(props.project.projectArn)
      .addActions(...actions));

    // allow codebuild to read and write artifacts to the pipline's artifact bucket.
    if (props.project.role) {
      props.stage.grantPipelineBucketReadWrite(props.project.role);
    }

    // policy must be added as a dependency to the pipeline!!
    // TODO: grants - build.addResourcePermission() and also make sure permission
    // includes the pipeline role AWS principal.
  }
}
