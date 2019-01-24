import codepipeline = require('@aws-cdk/aws-codepipeline-api');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { IRepository } from './repository';

/**
 * Common properties for creating {@link PipelineSourceAction} -
 * either directly, through its constructor,
 * or through {@link IRepository#addToPipeline}.
 */
export interface CommonPipelineSourceActionProps extends codepipeline.CommonActionProps {
  /**
   * The name of the source's output artifact.
   * Output artifacts are used by CodePipeline as inputs into other actions.
   *
   * @default a name will be auto-generated
   */
  outputArtifactName?: string;

  /**
   * @default 'master'
   */
  branch?: string;

  /**
   * Whether AWS CodePipeline should poll for source changes.
   * If this is `false`, the Pipeline will use CloudWatch Events to detect source changes instead.
   *
   * @default false
   */
  pollForSourceChanges?: boolean;
}

/**
 * Construction properties of the {@link PipelineSourceAction CodeCommit source CodePipeline Action}.
 */
export interface PipelineSourceActionProps extends CommonPipelineSourceActionProps,
    codepipeline.CommonActionConstructProps {
  /**
   * The CodeCommit repository.
   */
  repository: IRepository;
}

/**
 * CodePipeline Source that is provided by an AWS CodeCommit repository.
 */
export class PipelineSourceAction extends codepipeline.SourceAction {
  constructor(scope: cdk.Construct, id: string, props: PipelineSourceActionProps) {
    super(scope, id, {
      ...props,
      provider: 'CodeCommit',
      configuration: {
        RepositoryName: props.repository.repositoryName,
        BranchName: props.branch || 'master',
        PollForSourceChanges: props.pollForSourceChanges || false,
      },
      outputArtifactName: props.outputArtifactName
    });

    if (!props.pollForSourceChanges) {
      props.repository.onCommit(props.stage.pipeline.node.uniqueId + 'EventRule', props.stage.pipeline, props.branch || 'master');
    }

    // https://docs.aws.amazon.com/codecommit/latest/userguide/auth-and-access-control-permissions-reference.html#aa-acp
    const actions = [
      'codecommit:GetBranch',
      'codecommit:GetCommit',
      'codecommit:UploadArchive',
      'codecommit:GetUploadArchiveStatus',
      'codecommit:CancelUploadArchive',
    ];

    props.stage.pipeline.role.addToPolicy(new iam.PolicyStatement()
      .addResource(props.repository.repositoryArn)
      .addActions(...actions));
  }
}
