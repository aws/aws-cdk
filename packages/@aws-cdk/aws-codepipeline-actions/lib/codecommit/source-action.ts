import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import targets = require('@aws-cdk/aws-events-targets');
import iam = require('@aws-cdk/aws-iam');
import { sourceArtifactBounds } from '../common';

/**
 * How should the CodeCommit Action detect changes.
 * This is the type of the {@link CodeCommitSourceAction.trigger} property.
 */
export enum CodeCommitTrigger {
  /**
   * The Action will never detect changes -
   * the Pipeline it's part of will only begin a run when explicitly started.
   */
  NONE = 'None',

  /**
   * CodePipeline will poll the repository to detect changes.
   */
  POLL = 'Poll',

  /**
   * CodePipeline will use CloudWatch Events to be notified of changes.
   * This is the default method of detecting changes.
   */
  EVENTS = 'Events',
}

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
   * How should CodePipeline detect source changes for this Action.
   *
   * @default CodeCommitTrigger.EVENTS
   */
  readonly trigger?: CodeCommitTrigger;

  /**
   * The CodeCommit repository.
   */
  readonly repository: codecommit.IRepository;
}

/**
 * CodePipeline Source that is provided by an AWS CodeCommit repository.
 */
export class CodeCommitSourceAction extends codepipeline.Action {
  private readonly repository: codecommit.IRepository;
  private readonly branch: string;
  private readonly createEvent: boolean;

  constructor(props: CodeCommitSourceActionProps) {
    const branch = props.branch || 'master';

    super({
      ...props,
      category: codepipeline.ActionCategory.SOURCE,
      provider: 'CodeCommit',
      artifactBounds: sourceArtifactBounds(),
      outputs: [props.output],
      configuration: {
        RepositoryName: props.repository.repositoryName,
        BranchName: branch,
        PollForSourceChanges: props.trigger === CodeCommitTrigger.POLL,
      },
    });

    this.repository = props.repository;
    this.branch = branch;
    this.createEvent = props.trigger === undefined ||
      props.trigger === CodeCommitTrigger.EVENTS;
  }

  protected bind(info: codepipeline.ActionBind): void {
    if (this.createEvent) {
      this.repository.onCommit(info.pipeline.node.uniqueId + 'EventRule', {
        target: new targets.CodePipeline(info.pipeline),
        branches: [this.branch],
      });
    }

    // https://docs.aws.amazon.com/codecommit/latest/userguide/auth-and-access-control-permissions-reference.html#aa-acp
    info.role.addToPolicy(new iam.PolicyStatement({
      resources: [this.repository.repositoryArn],
      actions: [
        'codecommit:GetBranch',
        'codecommit:GetCommit',
        'codecommit:UploadArchive',
        'codecommit:GetUploadArchiveStatus',
        'codecommit:CancelUploadArchive',
      ],
    }));
  }
}
