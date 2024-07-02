import { Construct } from 'constructs';
import { Trigger } from './trigger';
import * as codepipeline from '../../../aws-codepipeline';
import * as iam from '../../../aws-iam';
import { Action } from '../action';
import { sourceArtifactBounds } from '../common';

const ACTION_PROVIDER = 'CodeStarSourceConnection';

/**
 * The CodePipeline variables emitted by CodeStar source Action.
 */
export interface CodeStarSourceVariables {
  /** The name of the repository this action points to. */
  readonly fullRepositoryName: string;
  /** The name of the branch this action tracks. */
  readonly branchName: string;
  /** The date the currently last commit on the tracked branch was authored, in ISO-8601 format. */
  readonly authorDate: string;
  /** The SHA1 hash of the currently last commit on the tracked branch. */
  readonly commitId: string;
  /** The message of the currently last commit on the tracked branch. */
  readonly commitMessage: string;
  /** The connection ARN this source uses. */
  readonly connectionArn: string;
}

/**
 * Construction properties for `CodeStarConnectionsSourceAction`.
 */
export interface CodeStarConnectionsSourceActionProps extends codepipeline.CommonAwsActionProps {
  /**
   * The output artifact that this action produces.
   * Can be used as input for further pipeline actions.
   */
  readonly output: codepipeline.Artifact;

  /**
   * The ARN of the CodeStar Connection created in the AWS console
   * that has permissions to access this GitHub or BitBucket repository.
   *
   * @example 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh'
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/connections-create.html
   */
  readonly connectionArn: string;

  /**
   * The owning user or organization of the repository.
   *
   * @example 'aws'
   */
  readonly owner: string;

  /**
   * The name of the repository.
   *
   * @example 'aws-cdk'
   */
  readonly repo: string;

  /**
   * The branch to build.
   *
   * @default 'master'
   */
  readonly branch?: string;

  // long URL in @see
  /**
   * Whether the output should be the contents of the repository
   * (which is the default),
   * or a link that allows CodeBuild to clone the repository before building.
   *
   * **Note**: if this option is true,
   * then only CodeBuild actions can use the resulting `output`.
   *
   * @default false
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-CodestarConnectionSource.html#action-reference-CodestarConnectionSource-config
   */
  readonly codeBuildCloneOutput?: boolean;

  /**
   * Controls automatically starting your pipeline when a new commit
   * is made on the configured repository and branch. If unspecified,
   * the default value is true, and the field does not display by default.
   *
   * @default true
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-CodestarConnectionSource.html
   *
   * @deprecated - use `trigger` instead.
   */
  readonly triggerOnPush?: boolean;

  /**
   * The trigger configuration for this action.
   *
   * In a V1 pipeline, only `Trigger.ALL` or `Trigger.NONE` may be used.
   *
   * In a V2 pipeline, a trigger may have up to three of each type of filter
   * (Pull Request or Push) or may trigger on every change to the default branch
   * if no filters are provided.
   *
   * @default - The pipeline is triggered on all changes to the default branch.
   */
  readonly trigger?: Trigger;
}

/**
 * A CodePipeline source action for the CodeStar Connections source,
 * which allows connecting to GitHub and BitBucket.
 */
export class CodeStarConnectionsSourceAction extends Action {
  /**
   * The name of the property that holds the ARN of the CodeStar Connection
   * inside of the CodePipeline Artifact's metadata.
   *
   * @internal
   */
  public static readonly _CONNECTION_ARN_PROPERTY = 'CodeStarConnectionArnProperty';

  private readonly props: CodeStarConnectionsSourceActionProps;

  constructor(props: CodeStarConnectionsSourceActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.SOURCE,
      owner: 'AWS', // because props also has a (different!) owner property!
      provider: ACTION_PROVIDER,
      artifactBounds: sourceArtifactBounds(),
      outputs: [props.output],
    });

    this.props = props;
  }

  /** The variables emitted by this action. */
  public get variables(): CodeStarSourceVariables {
    return {
      fullRepositoryName: this.variableExpression('FullRepositoryName'),
      branchName: this.variableExpression('BranchName'),
      authorDate: this.variableExpression('AuthorDate'),
      commitId: this.variableExpression('CommitId'),
      commitMessage: this.variableExpression('CommitMessage'),
      connectionArn: this.variableExpression('ConnectionArn'),
    };
  }

  protected bound(_scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig {
    // https://docs.aws.amazon.com/codepipeline/latest/userguide/security-iam.html#how-to-update-role-new-services
    options.role.addToPolicy(new iam.PolicyStatement({
      actions: [
        'codestar-connections:UseConnection',
      ],
      resources: [
        this.props.connectionArn,
      ],
    }));

    // the action needs to write the output to the pipeline bucket
    options.bucket.grantReadWrite(options.role);
    options.bucket.grantPutAcl(options.role);

    // if codeBuildCloneOutput is true,
    // save the connectionArn in the Artifact instance
    // to be read by the CodeBuildAction later
    if (this.props.codeBuildCloneOutput === true) {
      this.props.output.setMetadata(CodeStarConnectionsSourceAction._CONNECTION_ARN_PROPERTY,
        this.props.connectionArn);
    }

    return {
      configuration: {
        ConnectionArn: this.props.connectionArn,
        FullRepositoryId: `${this.props.owner}/${this.props.repo}`,
        BranchName: this.props.branch ?? 'master',
        OutputArtifactFormat: this.props.codeBuildCloneOutput === true
          ? 'CODEBUILD_CLONE_REF'
          : undefined,
        // For a v2 pipeline, if `trigger` is set this configuration property is disabled
        // and the trigger setting is used. For a v1 pipeline, `trigger` can still be used to
        // turn on/off `DetectChanges`.
        //
        // __attachActionToPipeline() will update this value so that it is handled correctly depending
        // on the pipeline version.
        DetectChanges: this.props.trigger ? this.renderDetectChanges(this.props.trigger) : this.props.triggerOnPush,
      },
    };
  }

  private renderTriggerGitConfiguration(trigger: Trigger): codepipeline.CfnPipeline.PipelineTriggerDeclarationProperty {
    const providerType = ACTION_PROVIDER;
    const push: codepipeline.CfnPipeline.GitPushFilterProperty[] = trigger._filters.map((_filter) =>
      _filter._push).filter(item => item) as codepipeline.CfnPipeline.GitPushFilterProperty[];

    const pullRequest: codepipeline.CfnPipeline.GitPullRequestFilterProperty[] = trigger._filters.map((_filter) =>
      _filter._pullRequest).filter(item => item) as codepipeline.CfnPipeline.GitPullRequestFilterProperty[];

    return (push.length === 0 && pullRequest.length === 0) ? {
      providerType,
    } : {
      providerType,
      gitConfiguration: {
        push: push.length > 0 ? push : undefined,
        pullRequest: pullRequest.length > 0 ? pullRequest : undefined,
        sourceActionName: this.actionProperties.actionName,
      },
    };
  }

  private renderDetectChanges(trigger: Trigger): boolean | codepipeline.CfnPipeline.PipelineTriggerDeclarationProperty {
    // No trigger or change detection
    if (!trigger._enabled) return false;

    return this.renderTriggerGitConfiguration(trigger);
  }
}
