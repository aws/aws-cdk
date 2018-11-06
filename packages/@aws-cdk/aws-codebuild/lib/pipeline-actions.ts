import codepipeline = require('@aws-cdk/aws-codepipeline-api');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { ProjectRef } from './project';

/**
 * Common properties for creating {@link PipelineBuildAction} -
 * either directly, through its constructor,
 * or through {@link ProjectRef#addBuildToPipeline}.
 */
export interface CommonPipelineBuildActionProps extends codepipeline.CommonActionProps {
  /**
   * The source to use as input for this build.
   *
   * @default CodePipeline will use the output of the last Action from a previous Stage as input
   */
  inputArtifact?: codepipeline.Artifact;

  /**
   * The name of the build's output artifact.
   *
   * @default an auto-generated name will be used
   */
  outputArtifactName?: string;
}

/**
 * Construction properties of the {@link PipelineBuildAction CodeBuild build CodePipeline Action}.
 */
export interface PipelineBuildActionProps extends CommonPipelineBuildActionProps,
    codepipeline.CommonActionConstructProps {
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
      provider: 'CodeBuild',
      configuration: {
        ProjectName: props.project.projectName,
      },
      ...props,
    });

    setCodeBuildNeededPermissions(props.stage, props.project, true);
  }
}

/**
 * Common properties for creating {@link PipelineTestAction} -
 * either directly, through its constructor,
 * or through {@link ProjectRef#addTestToPipeline}.
 */
export interface CommonPipelineTestActionProps extends codepipeline.CommonActionProps {
  /**
   * The source to use as input for this test.
   *
   * @default CodePipeline will use the output of the last Action from a previous Stage as input
   */
  inputArtifact?: codepipeline.Artifact;

  /**
   * The optional name of the output artifact.
   * If you provide a value here,
   * then the `outputArtifact` property of your Action will be non-null.
   * If you don't, `outputArtifact` will be `null`.
   *
   * @default the Action will not have an output artifact
   */
  outputArtifactName?: string;
}

/**
 * Construction properties of the {@link PipelineTestAction CodeBuild test CodePipeline Action}.
 */
export interface PipelineTestActionProps extends CommonPipelineTestActionProps,
    codepipeline.CommonActionConstructProps {
  /**
   * The build Project.
   */
  project: ProjectRef;
}

export class PipelineTestAction extends codepipeline.TestAction {
  constructor(parent: cdk.Construct, name: string, props: PipelineTestActionProps) {
    super(parent, name, {
      provider: 'CodeBuild',
      configuration: {
        ProjectName: props.project.projectName,
      },
      ...props,
    });

    // the Action needs write permissions only if it's producing an output artifact
    setCodeBuildNeededPermissions(props.stage, props.project, !!props.outputArtifactName);
  }
}

function setCodeBuildNeededPermissions(stage: codepipeline.IStage, project: ProjectRef,
                                       needsPipelineBucketWrite: boolean) {
  // grant the Pipeline role the required permissions to this Project
  stage.pipeline.role.addToPolicy(new iam.PolicyStatement()
    .addResource(project.projectArn)
    .addActions(
      'codebuild:BatchGetBuilds',
      'codebuild:StartBuild',
      'codebuild:StopBuild',
    ));

  // allow the Project access to the Pipline's artifact Bucket
  if (needsPipelineBucketWrite) {
    stage.pipeline.grantBucketReadWrite(project.role);
  } else {
    stage.pipeline.grantBucketRead(project.role);
  }
}
