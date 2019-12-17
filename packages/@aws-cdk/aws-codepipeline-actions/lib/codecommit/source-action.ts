import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as targets from '@aws-cdk/aws-events-targets';
import * as iam from '@aws-cdk/aws-iam';
import { Construct } from '@aws-cdk/core';
import { Action } from '../action';
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
export interface CodeCommitSourceActionProps extends codepipeline.CommonAwsActionProps {
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
export class CodeCommitSourceAction extends Action {
  private readonly branch: string;
  private readonly props: CodeCommitSourceActionProps;

  constructor(props: CodeCommitSourceActionProps) {
    const branch = props.branch || 'master';

    super({
      ...props,
      resource: props.repository,
      category: codepipeline.ActionCategory.SOURCE,
      provider: 'CodeCommit',
      artifactBounds: sourceArtifactBounds(),
      outputs: [props.output],
    });

    this.branch = branch;
    this.props = props;
  }

  protected bound(_scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
      codepipeline.ActionConfig {
    const createEvent = this.props.trigger === undefined ||
      this.props.trigger === CodeCommitTrigger.EVENTS;
    if (createEvent) {
      this.props.repository.onCommit(stage.pipeline.node.uniqueId + 'EventRule', {
        target: new targets.CodePipeline(stage.pipeline),
        branches: [this.branch],
      });
    }

    // the Action will write the contents of the Git repository to the Bucket,
    // so its Role needs write permissions to the Pipeline Bucket
    options.bucket.grantReadWrite(options.role);

    // https://docs.aws.amazon.com/codecommit/latest/userguide/auth-and-access-control-permissions-reference.html#aa-acp
    options.role.addToPolicy(new iam.PolicyStatement({
      resources: [this.props.repository.repositoryArn],
      actions: [
        'codecommit:GetBranch',
        'codecommit:GetCommit',
        'codecommit:UploadArchive',
        'codecommit:GetUploadArchiveStatus',
        'codecommit:CancelUploadArchive',
      ],
    }));

    return {
      configuration: {
        RepositoryName: this.props.repository.repositoryName,
        BranchName: this.branch,
        PollForSourceChanges: this.props.trigger === CodeCommitTrigger.POLL,
      },
    };
  }
}
