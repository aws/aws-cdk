import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import targets = require('@aws-cdk/aws-events-targets');
import iam = require('@aws-cdk/aws-iam');
import { sourceArtifactBounds } from '../common';

/**
 * Construction properties of the {@link CodeCommitSourceAction CodeCommit source CodePipeline Action}.
 */
export interface CodeCommitSourceActionProps extends codepipeline.CommonActionProps {
  /**
   *
   */
  readonly output: codepipeline.Artifact;

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
export class CodeCommitSourceAction extends codepipeline.Action {
  private readonly props: CodeCommitSourceActionProps;

  constructor(props: CodeCommitSourceActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.SOURCE,
      provider: 'CodeCommit',
      artifactBounds: sourceArtifactBounds(),
      outputs: [props.output],
      configuration: {
        RepositoryName: props.repository.repositoryName,
        BranchName: props.branch || 'master',
        PollForSourceChanges: props.pollForSourceChanges || false,
      },
    });

    this.props = props;
  }

  protected bind(info: codepipeline.ActionBind): void {
    if (!this.props.pollForSourceChanges) {
      this.props.repository.onCommit(info.pipeline.node.uniqueId + 'EventRule', {
        target: new targets.CodePipeline(info.pipeline),
        branches: [this.props.branch || 'master']
      });
    }

    // https://docs.aws.amazon.com/codecommit/latest/userguide/auth-and-access-control-permissions-reference.html#aa-acp
    const actions = [
      'codecommit:GetBranch',
      'codecommit:GetCommit',
      'codecommit:UploadArchive',
      'codecommit:GetUploadArchiveStatus',
      'codecommit:CancelUploadArchive',
    ];

    info.role.addToPolicy(new iam.PolicyStatement({
      resources: [this.props.repository.repositoryArn],
      actions
    }));
  }
}
