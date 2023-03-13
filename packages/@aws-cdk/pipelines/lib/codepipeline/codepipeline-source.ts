import * as codecommit from '@aws-cdk/aws-codecommit';
import * as cp from '@aws-cdk/aws-codepipeline';
import { Artifact } from '@aws-cdk/aws-codepipeline';
import * as cp_actions from '@aws-cdk/aws-codepipeline-actions';
import { Action, CodeCommitTrigger, GitHubTrigger, S3Trigger } from '@aws-cdk/aws-codepipeline-actions';
import { IRepository } from '@aws-cdk/aws-ecr';
import * as iam from '@aws-cdk/aws-iam';
import { IBucket } from '@aws-cdk/aws-s3';
import { Fn, SecretValue, Token } from '@aws-cdk/core';
import { Node } from 'constructs';
import { CodePipelineActionFactoryResult, ProduceActionOptions, ICodePipelineActionFactory } from './codepipeline-action-factory';
import { makeCodePipelineOutput } from './private/outputs';
import { FileSet, Step } from '../blueprint';

/**
 * Factory for CodePipeline source steps
 *
 * This class contains a number of factory methods for the different types
 * of sources that CodePipeline supports.
 */
export abstract class CodePipelineSource extends Step implements ICodePipelineActionFactory {
  /**
   * Returns a GitHub source, using OAuth tokens to authenticate with
   * GitHub and a separate webhook to detect changes. This is no longer
   * the recommended method. Please consider using `connection()`
   * instead.
   *
   * Pass in the owner and repository in a single string, like this:
   *
   * ```ts
   * pipelines.CodePipelineSource.gitHub('owner/repo', 'main');
   * ```
   *
   * Authentication will be done by a secret called `github-token` in AWS
   * Secrets Manager (unless specified otherwise).
   *
   * If you rotate the value in the Secret, you must also change at least one property
   * on the Pipeline, to force CloudFormation to re-read the secret.
   *
   * The token should have these permissions:
   *
   * * **repo** - to read the repository
   * * **admin:repo_hook** - if you plan to use webhooks (true by default)
   *
   * If you need access to symlinks or the repository history, use a source of type
   * `connection` instead.
   */
  public static gitHub(repoString: string, branch: string, props: GitHubSourceOptions = {}): CodePipelineSource {
    return new GitHubSource(repoString, branch, props);
  }

  /**
   * Returns an S3 source.
   *
   * @param bucket The bucket where the source code is located.
   * @param props The options, which include the key that identifies the source code file and
   * and how the pipeline should be triggered.
   *
   * @example
   * declare const bucket: s3.Bucket;
   * pipelines.CodePipelineSource.s3(bucket, 'path/to/file.zip');
   */
  public static s3(bucket: IBucket, objectKey: string, props: S3SourceOptions = {}): CodePipelineSource {
    return new S3Source(bucket, objectKey, props);
  }

  /**
   * Returns an ECR source.
   *
   * @param repository The repository that will be watched for changes.
   * @param props The options, which include the image tag to be checked for changes.
   *
   * @example
   * declare const repository: ecr.IRepository;
   * pipelines.CodePipelineSource.ecr(repository, {
   *   imageTag: 'latest',
   * });
   */
  public static ecr(repository: IRepository, props: ECRSourceOptions = {}): CodePipelineSource {
    return new ECRSource(repository, props);
  }

  /**
   * Returns a CodeStar connection source. A CodeStar connection allows AWS CodePipeline to
   * access external resources, such as repositories in GitHub, GitHub Enterprise or
   * BitBucket.
   *
   * To use this method, you first need to create a CodeStar connection
   * using the AWS console. In the process, you may have to sign in to the external provider
   * -- GitHub, for example -- to authorize AWS to read and modify your repository.
   * Once you have done this, copy the connection ARN and use it to create the source.
   *
   * Example:
   *
   * ```ts
   * pipelines.CodePipelineSource.connection('owner/repo', 'main', {
   *   connectionArn: 'arn:aws:codestar-connections:us-east-1:222222222222:connection/7d2469ff-514a-4e4f-9003-5ca4a43cdc41', // Created using the AWS console
   * });
   * ```
   *
   * If you need access to symlinks or the repository history, be sure to set
   * `codeBuildCloneOutput`.
   *
   * @param repoString A string that encodes owner and repository separated by a slash (e.g. 'owner/repo').
   * @param branch The branch to use.
   * @param props The source properties, including the connection ARN.
   *
   * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/welcome-connections.html
   */
  public static connection(repoString: string, branch: string, props: ConnectionSourceOptions): CodePipelineSource {
    return new CodeStarConnectionSource(repoString, branch, props);
  }

  /**
   * Returns a CodeCommit source.
   *
   * If you need access to symlinks or the repository history, be sure to set
   * `codeBuildCloneOutput`.
   *
   *
   * @param repository The CodeCommit repository.
   * @param branch The branch to use.
   * @param props The source properties.
   *
   * @example
   * declare const repository: codecommit.IRepository;
   * pipelines.CodePipelineSource.codeCommit(repository, 'main');
   */
  public static codeCommit(repository: codecommit.IRepository, branch: string, props: CodeCommitSourceOptions = {}): CodePipelineSource {
    return new CodeCommitSource(repository, branch, props);
  }

  // tells `PipelineGraph` to hoist a "Source" step
  public readonly isSource = true;

  public produceAction(stage: cp.IStage, options: ProduceActionOptions): CodePipelineActionFactoryResult {
    const output = options.artifacts.toCodePipeline(this.primaryOutput!);

    const action = this.getAction(output, options.actionName, options.runOrder, options.variablesNamespace);
    stage.addAction(action);
    return { runOrdersConsumed: 1 };
  }

  protected abstract getAction(output: Artifact, actionName: string, runOrder: number, variablesNamespace?: string): Action;

  /**
   * Return an attribute of the current source revision
   *
   * These values can be passed into the environment variables of pipeline steps,
   * so your steps can access information about the source revision.
   *
   * Pipeline synth step has some source attributes predefined in the environment.
   * If these suffice, you don't need to use this method for the synth step.
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-env-vars.html
   *
   * What attributes are available depends on the type of source. These attributes
   * are supported:
   *
   * - GitHub, CodeCommit, and CodeStarSourceConnection
   *   - `AuthorDate`
   *   - `BranchName`
   *   - `CommitId`
   *   - `CommitMessage`
   * - GitHub, CodeCommit and ECR
   *   - `RepositoryName`
   * - GitHub and CodeCommit
   *   - `CommitterDate`
   * - GitHub
   *   - `CommitUrl`
   * - CodeStarSourceConnection
   *   - `FullRepositoryName`
   * - S3
   *   - `ETag`
   *   - `VersionId`
   * - ECR
   *   - `ImageDigest`
   *   - `ImageTag`
   *   - `ImageURI`
   *   - `RegistryId`
   *
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-variables.html#reference-variables-list
   * @example
   * // Access the CommitId of a GitHub source in the synth
   * const source = pipelines.CodePipelineSource.gitHub('owner/repo', 'main');
   *
   * const pipeline = new pipelines.CodePipeline(scope, 'MyPipeline', {
   *   synth: new pipelines.ShellStep('Synth', {
   *     input: source,
   *     commands: [],
   *     env: {
   *       'COMMIT_ID': source.sourceAttribute('CommitId'),
   *     }
   *   })
   * });
   */
  public sourceAttribute(name: string): string {
    return makeCodePipelineOutput(this, name);
  }
}

/**
 * Options for GitHub sources
 */
export interface GitHubSourceOptions {
  /**
   * A GitHub OAuth token to use for authentication.
   *
   * It is recommended to use a Secrets Manager `Secret` to obtain the token:
   *
   * ```ts
   * const oauth = cdk.SecretValue.secretsManager('my-github-token');
   * ```
   *
   * The GitHub Personal Access Token should have these scopes:
   *
   * * **repo** - to read the repository
   * * **admin:repo_hook** - if you plan to use webhooks (true by default)
   *
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/GitHub-create-personal-token-CLI.html
   *
   * @default - SecretValue.secretsManager('github-token')
   */
  readonly authentication?: SecretValue;

  /**
   * How AWS CodePipeline should be triggered
   *
   * With the default value "WEBHOOK", a webhook is created in GitHub that triggers the action.
   * With "POLL", CodePipeline periodically checks the source for changes.
   * With "None", the action is not triggered through changes in the source.
   *
   * To use `WEBHOOK`, your GitHub Personal Access Token should have
   * **admin:repo_hook** scope (in addition to the regular **repo** scope).
   *
   * @default GitHubTrigger.WEBHOOK
   */
  readonly trigger?: GitHubTrigger;

  /**
   * The action name used for this source in the CodePipeline
   *
   * @default - The repository string
   */
  readonly actionName?: string;
}

/**
 * Extend CodePipelineSource so we can type-test in the CodePipelineEngine.
 */
class GitHubSource extends CodePipelineSource {
  private readonly owner: string;
  private readonly repo: string;
  private readonly authentication: SecretValue;

  constructor(repoString: string, readonly branch: string, readonly props: GitHubSourceOptions) {
    super(repoString);

    const parts = repoString.split('/');
    if (Token.isUnresolved(repoString) || parts.length !== 2) {
      throw new Error(`GitHub repository name should be a resolved string like '<owner>/<repo>', got '${repoString}'`);
    }
    this.owner = parts[0];
    this.repo = parts[1];
    this.authentication = props.authentication ?? SecretValue.secretsManager('github-token');
    this.configurePrimaryOutput(new FileSet('Source', this));
  }

  protected getAction(output: Artifact, actionName: string, runOrder: number, variablesNamespace?: string) {
    return new cp_actions.GitHubSourceAction({
      output,
      actionName: this.props.actionName ?? actionName,
      runOrder,
      oauthToken: this.authentication,
      owner: this.owner,
      repo: this.repo,
      branch: this.branch,
      trigger: this.props.trigger,
      variablesNamespace,
    });
  }
}

/**
 * Options for S3 sources
 */
export interface S3SourceOptions {
  /**
   * How should CodePipeline detect source changes for this Action.
   * Note that if this is S3Trigger.EVENTS, you need to make sure to include the source Bucket in a CloudTrail Trail,
   * as otherwise the CloudWatch Events will not be emitted.
   *
   * @default S3Trigger.POLL
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/log-s3-data-events.html
   */
  readonly trigger?: S3Trigger;

  /**
   * The action name used for this source in the CodePipeline
   *
   * @default - The bucket name
   */
  readonly actionName?: string;

  /**
   * The role that will be assumed by the pipeline prior to executing
   * the `S3Source` action.
   *
   * @default - a new role will be generated
   */
  readonly role?: iam.IRole;
}

class S3Source extends CodePipelineSource {
  constructor(readonly bucket: IBucket, private readonly objectKey: string, readonly props: S3SourceOptions) {
    super(Node.of(bucket).addr);

    this.configurePrimaryOutput(new FileSet('Source', this));
  }

  protected getAction(output: Artifact, _actionName: string, runOrder: number, variablesNamespace?: string) {
    return new cp_actions.S3SourceAction({
      output,
      // Bucket names are guaranteed to conform to ActionName restrictions
      actionName: this.props.actionName ?? this.bucket.bucketName,
      runOrder,
      bucketKey: this.objectKey,
      trigger: this.props.trigger,
      bucket: this.bucket,
      role: this.props.role,
      variablesNamespace,
    });
  }
}

/**
 * Options for ECR sources
 */
export interface ECRSourceOptions {
  /**
   * The image tag that will be checked for changes.
   *
   * @default latest
   */
  readonly imageTag?: string;

  /**
   * The action name used for this source in the CodePipeline
   *
   * @default - The repository name
   */
  readonly actionName?: string;
}

class ECRSource extends CodePipelineSource {
  constructor(readonly repository: IRepository, readonly props: ECRSourceOptions) {
    super(Node.of(repository).addr);

    this.configurePrimaryOutput(new FileSet('Source', this));
  }

  protected getAction(output: Artifact, _actionName: string, runOrder: number, variablesNamespace: string) {
    // RepositoryName can contain '/' that is not a valid ActionName character, use '_' instead
    const formattedRepositoryName = Fn.join('_', Fn.split('/', this.repository.repositoryName));
    return new cp_actions.EcrSourceAction({
      output,
      actionName: this.props.actionName ?? formattedRepositoryName,
      runOrder,
      repository: this.repository,
      imageTag: this.props.imageTag,
      variablesNamespace,
    });
  }
}

/**
 * Configuration options for CodeStar source
 */
export interface ConnectionSourceOptions {
  /**
   * The ARN of the CodeStar Connection created in the AWS console
   * that has permissions to access this GitHub or BitBucket repository.
   *
   * @example 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh'
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/connections-create.html
   */
  readonly connectionArn: string;

  // long URL in @see
  /**
   * If this is set, the next CodeBuild job clones the repository (instead of CodePipeline downloading the files).
   *
   * This provides access to repository history, and retains symlinks (symlinks would otherwise be
   * removed by CodePipeline).
   *
   * **Note**: if this option is true, only CodeBuild jobs can use the output artifact.
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
   */
  readonly triggerOnPush?: boolean;

  /**
   * The action name used for this source in the CodePipeline
   *
   * @default - The repository string
   */
  readonly actionName?: string;
}

class CodeStarConnectionSource extends CodePipelineSource {
  private readonly owner: string;
  private readonly repo: string;

  constructor(repoString: string, readonly branch: string, readonly props: ConnectionSourceOptions) {
    super(repoString);

    const parts = repoString.split('/');
    if (Token.isUnresolved(repoString) || parts.length !== 2) {
      throw new Error(`CodeStar repository name should be a resolved string like '<owner>/<repo>', got '${repoString}'`);
    }
    this.owner = parts[0];
    this.repo = parts[1];
    this.configurePrimaryOutput(new FileSet('Source', this));
  }

  protected getAction(output: Artifact, actionName: string, runOrder: number, variablesNamespace?: string) {
    return new cp_actions.CodeStarConnectionsSourceAction({
      output,
      actionName: this.props.actionName ?? actionName,
      runOrder,
      connectionArn: this.props.connectionArn,
      owner: this.owner,
      repo: this.repo,
      branch: this.branch,
      codeBuildCloneOutput: this.props.codeBuildCloneOutput,
      triggerOnPush: this.props.triggerOnPush,
      variablesNamespace,
    });
  }
}

/**
 * Configuration options for a CodeCommit source
 */
export interface CodeCommitSourceOptions {
  /**
   * How should CodePipeline detect source changes for this Action.
   *
   * @default CodeCommitTrigger.EVENTS
   */
  readonly trigger?: CodeCommitTrigger;

  /**
   * Role to be used by on commit event rule.
   * Used only when trigger value is CodeCommitTrigger.EVENTS.
   *
   * @default a new role will be created.
   */
  readonly eventRole?: iam.IRole;

  /**
   * If this is set, the next CodeBuild job clones the repository (instead of CodePipeline downloading the files).
   *
   * This provides access to repository history, and retains symlinks (symlinks would otherwise be
   * removed by CodePipeline).
   *
   * **Note**: if this option is true, only CodeBuild jobs can use the output artifact.
   *
   * @default false
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-CodeCommit.html
   */
  readonly codeBuildCloneOutput?: boolean;

  /**
   * The action name used for this source in the CodePipeline
   *
   * @default - The repository name
   */
  readonly actionName?: string;
}

class CodeCommitSource extends CodePipelineSource {
  constructor(private readonly repository: codecommit.IRepository, private readonly branch: string, private readonly props: CodeCommitSourceOptions) {
    super(Token.isUnresolved(repository.repositoryName)
      ? Node.of(repository).addr
      : repository.repositoryName);

    this.configurePrimaryOutput(new FileSet('Source', this));
  }

  protected getAction(output: Artifact, _actionName: string, runOrder: number, variablesNamespace?: string) {
    return new cp_actions.CodeCommitSourceAction({
      output,
      // Guaranteed to be okay as action name
      actionName: this.props.actionName ?? this.repository.repositoryName,
      runOrder,
      branch: this.branch,
      trigger: this.props.trigger,
      repository: this.repository,
      eventRole: this.props.eventRole,
      codeBuildCloneOutput: this.props.codeBuildCloneOutput,
      variablesNamespace,
    });
  }
}
