import * as cp_actions from '@aws-cdk/aws-codepipeline-actions';
import { SecretValue, Token } from '@aws-cdk/core';
import { FileSet, Step } from '../blueprint';
import { CodePipelineActionFactoryResult, ProduceActionOptions, ICodePipelineActionFactory } from './codepipeline-action-factory';

/**
 * CodePipeline source steps
 *
 * This class contains a number of factory methods for the different types
 * of sources that CodePipeline supports.
 */
export abstract class CodePipelineSource extends Step implements ICodePipelineActionFactory {
  /**
   * Parse a URL from common source providers and return an appropriate Source action
   *
   * The input string cannot be a token.
   */
  public static fromUrl(repoString: string): CodePipelineSource {
    if (Token.isUnresolved(repoString)) {
      throw new Error('Argument to CodePipelineSource.fromString() cannot be unresolved');
    }

    const githubPrefix = 'https://github.com/';
    if (repoString.startsWith(githubPrefix)) {
      return CodePipelineSource.github(repoString.substr(githubPrefix.length).replace(/\.git$/, ''));
    }

    throw new Error(`CodePipelineSource.fromString(): unrecognized string format: '${repoString}'`);
  }

  /**
   * Return a GitHub source
   *
   * Pass in the owner and repository in a single string, like this:
   *
   * ```ts
   * CodePipelineSource.github('owner/repo', {
   *   branch: 'master',
   * });
   * ```
   *
   * The branch is `main` unless specified otherwise, and authentication
   * will be done by a secret called `github-token` in AWS Secrets Manager
   * (unless specified otherwise).
   *
   * The token should have these permissions:
   *
   * * **repo** - to read the repository
   * * **admin:repo_hook** - if you plan to use webhooks (true by default)
   */
  public static github(repoString: string, props: GitHubSourceOptions = {}): CodePipelineSource {
    return new GitHubSource(repoString, props);
  }

  // tells `PipelineGraph` to hoist a "Source" step
  public readonly isSource = true;

  public abstract produceAction(options: ProduceActionOptions): CodePipelineActionFactoryResult;
}

/**
 * Options for GitHub sources
 */
export interface GitHubSourceOptions {
  /**
   * The branch to use.
   *
   * @default "main"
   */
  readonly branch?: string;

  /**
   * A GitHub OAuth token to use for authentication.
   *
   * It is recommended to use a Secrets Manager `Secret` to obtain the token:
   *
   * ```ts
   * const oauth = cdk.SecretValue.secretsManager('my-github-token');
   * new GitHubSource(this, 'GitHubSource', { oauthToken: oauth, ... });
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
}

/**
 * Extend CodePipelineSource so we can type-test in the CodePipelineEngine.
 */
class GitHubSource extends CodePipelineSource {
  public primaryOutput?: FileSet | undefined;
  private readonly owner: string;
  private readonly repo: string;
  private readonly branch: string;
  private readonly authentication: SecretValue;

  constructor(repoString: string, props: GitHubSourceOptions) {
    super(repoString);

    const parts = repoString.split('/');
    if (parts.length !== 2) {
      throw new Error(`GitHub repository name should look like '<owner>/<repo>', got '${repoString}'`);
    }
    this.owner = parts[0];
    this.repo = parts[1];
    this.branch = props.branch ?? 'main';
    this.authentication = props.authentication ?? SecretValue.secretsManager('github-token');
    this.primaryOutput = new FileSet('Source', this);
  }

  public produceAction(options: ProduceActionOptions): CodePipelineActionFactoryResult {
    options.stage.addAction(new cp_actions.GitHubSourceAction({
      actionName: options.actionName,
      oauthToken: this.authentication,
      output: options.artifacts.toCodePipeline(this.primaryOutput!),
      owner: this.owner,
      repo: this.repo,
      branch: this.branch,
      runOrder: options.runOrder,
      trigger: cp_actions.GitHubTrigger.WEBHOOK,
    }));

    return { runOrdersConsumed: 1 };
  }
}