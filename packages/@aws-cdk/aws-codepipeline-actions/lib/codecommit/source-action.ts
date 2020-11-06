import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as targets from '@aws-cdk/aws-events-targets';
import * as iam from '@aws-cdk/aws-iam';
import { Construct, Names, Token } from '@aws-cdk/core';
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
 * The CodePipeline variables emitted by the CodeCommit source Action.
 */
export interface CodeCommitSourceVariables {
  /** The name of the repository this action points to. */
  readonly repositoryName: string;

  /** The name of the branch this action tracks. */
  readonly branchName: string;

  /** The date the currently last commit on the tracked branch was authored, in ISO-8601 format. */
  readonly authorDate: string;

  /** The date the currently last commit on the tracked branch was committed, in ISO-8601 format. */
  readonly committerDate: string;

  /** The SHA1 hash of the currently last commit on the tracked branch. */
  readonly commitId: string;

  /** The message of the currently last commit on the tracked branch. */
  readonly commitMessage: string;
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

  /**
   * Role to be used by on commit event rule.
   * Used only when trigger value is CodeCommitTrigger.EVENTS.
   *
   * @default a new role will be created.
   */
  readonly eventRole?: iam.IRole;
}

/**
 * CodePipeline Source that is provided by an AWS CodeCommit repository.
 */
export class CodeCommitSourceAction extends Action {
  private readonly branch: string;
  private readonly props: CodeCommitSourceActionProps;

  constructor(props: CodeCommitSourceActionProps) {
    const branch = props.branch ?? 'master';
    if (!branch) {
      throw new Error("'branch' parameter cannot be an empty string");
    }

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

  /** The variables emitted by this action. */
  public get variables(): CodeCommitSourceVariables {
    return {
      repositoryName: this.variableExpression('RepositoryName'),
      branchName: this.variableExpression('BranchName'),
      authorDate: this.variableExpression('AuthorDate'),
      committerDate: this.variableExpression('CommitterDate'),
      commitId: this.variableExpression('CommitId'),
      commitMessage: this.variableExpression('CommitMessage'),
    };
  }

  protected bound(_scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    const createEvent = this.props.trigger === undefined ||
      this.props.trigger === CodeCommitTrigger.EVENTS;
    if (createEvent) {
      const eventId = this.generateEventId(stage);
      this.props.repository.onCommit(eventId, {
        target: new targets.CodePipeline(stage.pipeline, {
          eventRole: this.props.eventRole,
        }),
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

  private generateEventId(stage: codepipeline.IStage): string {
    const baseId = Names.nodeUniqueId(stage.pipeline.node);
    if (Token.isUnresolved(this.branch)) {
      let candidate = '';
      let counter = 0;
      do {
        candidate = this.eventIdFromPrefix(`${baseId}${counter}`);
        counter += 1;
      } while (this.props.repository.node.tryFindChild(candidate) !== undefined);
      return candidate;
    } else {
      const branchIdDisambiguator = this.branch === 'master' ? '' : `-${this.branch}-`;
      return this.eventIdFromPrefix(`${baseId}${branchIdDisambiguator}`);
    }
  }

  private eventIdFromPrefix(eventIdPrefix: string) {
    return `${eventIdPrefix}EventRule`;
  }
}
