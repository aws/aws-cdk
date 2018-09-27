import codepipeline = require('@aws-cdk/aws-codepipeline-api');
import cdk = require('@aws-cdk/cdk');
import { RepositoryRef } from './repository';

/**
 * Common properties for creating {@link PipelineSourceAction} -
 * either directly, through its constructor,
 * or through {@link RepositoryRef#addToPipeline}.
 */
export interface CommonPipelineSourceActionProps {
  /**
   * The name of the source's output artifact.
   * Output artifacts are used by CodePipeline as inputs into other actions.
   */
  artifactName: string;

  /**
   * @default 'master'
   */
  branch?: string;

  // TODO: use CloudWatch events instead
  /**
   * Whether or not AWS CodePipeline should poll for source changes.
   *
   * @default true
   */
  pollForSourceChanges?: boolean;
}

/**
 * Construction properties of the {@link PipelineSourceAction CodeCommit source CodePipeline Action}.
 */
export interface PipelineSourceActionProps extends CommonPipelineSourceActionProps, codepipeline.CommonActionProps {
  /**
   * The CodeCommit repository.
   */
  repository: RepositoryRef;
}

/**
 * CodePipeline Source that is provided by an AWS CodeCommit repository.
 */
export class PipelineSourceAction extends codepipeline.SourceAction {
  constructor(parent: cdk.Construct, name: string, props: PipelineSourceActionProps) {
    super(parent, name, {
      stage: props.stage,
      provider: 'CodeCommit',
      configuration: {
        RepositoryName: props.repository.repositoryName,
        BranchName: props.branch || 'master',
        PollForSourceChanges: props.pollForSourceChanges !== undefined ? props.pollForSourceChanges : true
      },
      artifactName: props.artifactName
    });

    // https://docs.aws.amazon.com/codecommit/latest/userguide/auth-and-access-control-permissions-reference.html#aa-acp
    const actions = [
      'codecommit:GetBranch',
      'codecommit:GetCommit',
      'codecommit:UploadArchive',
      'codecommit:GetUploadArchiveStatus',
      'codecommit:CancelUploadArchive',
    ];

    props.stage.pipelineRole.addToPolicy(new cdk.PolicyStatement()
      .addResource(props.repository.repositoryArn)
      .addActions(...actions));
  }
}
