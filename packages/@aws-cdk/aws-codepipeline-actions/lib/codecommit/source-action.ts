import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import iam = require('@aws-cdk/aws-iam');

/**
 * Construction properties of the {@link CodeCommitSourceAction CodeCommit source CodePipeline Action}.
 */
export interface CodeCommitSourceActionProps extends codepipeline.CommonActionProps {
  /**
   * The name of the source's output artifact.
   * Output artifacts are used by CodePipeline as inputs into other actions.
   *
   * @default a name will be auto-generated
   */
  readonly outputArtifactName?: string;

  /**
   * @default 'master'
   */
  readonly branch?: string;

  /**
   * Whether AWS CodePipeline should poll for source changes.
   * If this is `false`, the Pipeline will use CloudWatch Events to detect source changes instead.
   *
   * @default false
   */
  readonly pollForSourceChanges?: boolean;

  /**
   * The CodeCommit repository.
   */
  readonly repository: codecommit.IRepository;
}

/**
 * CodePipeline Source that is provided by an AWS CodeCommit repository.
 */
export class CodeCommitSourceAction extends codepipeline.SourceAction {
  private readonly props: CodeCommitSourceActionProps;

  constructor(props: CodeCommitSourceActionProps) {
    super({
      ...props,
      provider: 'CodeCommit',
      configuration: {
        RepositoryName: props.repository.repositoryName,
        BranchName: props.branch || 'master',
        PollForSourceChanges: props.pollForSourceChanges || false,
      },
      outputArtifactName: props.outputArtifactName || `Artifact_${props.actionName}_${props.repository.node.uniqueId}`,
    });

    this.props = props;
  }

  protected bind(info: codepipeline.ActionBind): void {
    if (!this.props.pollForSourceChanges) {
      this.props.repository.onCommit(info.pipeline.node.uniqueId + 'EventRule',
          info.pipeline, this.props.branch || 'master');
    }

    // https://docs.aws.amazon.com/codecommit/latest/userguide/auth-and-access-control-permissions-reference.html#aa-acp
    const actions = [
      'codecommit:GetBranch',
      'codecommit:GetCommit',
      'codecommit:UploadArchive',
      'codecommit:GetUploadArchiveStatus',
      'codecommit:CancelUploadArchive',
    ];

    info.role.addToPolicy(new iam.PolicyStatement()
      .addResource(this.props.repository.repositoryArn)
      .addActions(...actions));
  }
}
