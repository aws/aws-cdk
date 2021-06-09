import * as cp_actions from '@aws-cdk/aws-codepipeline-actions';
import { SecretValue, Token } from '@aws-cdk/core';
import { FileSet, Step } from '../blueprint';
import { CodePipelineActionFactoryResult, CodePipelineActionOptions, ICodePipelineActionFactory } from './codepipeline-action-factory';


export abstract class CodePipelineSource extends Step implements ICodePipelineActionFactory {
  public static fromString(repoString: string): Step {
    if (Token.isUnresolved(repoString)) {
      throw new Error('Argument to CodePipelineSource.fromString() cannot be unresolved');
    }

    const githubPrefix = 'https://github.com/';
    if (repoString.startsWith(githubPrefix)) {
      return CodePipelineSource.gitHub(repoString.substr(githubPrefix.length));
    }

    throw new Error(`CodePipelineSource.fromString(): unrecognized string format: '${repoString}'`);
  }

  public static gitHub(repoString: string, props: GitHubSourceOptions = {}): Step {
    return new GitHubSource(repoString, props);
  }

  public abstract produce(options: CodePipelineActionOptions): CodePipelineActionFactoryResult;
}

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
   *   const oauth = cdk.SecretValue.secretsManager('my-github-token');
   *   new GitHubSource(this, 'GitHubSource', { oauthToken: oauth, ... });
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

  public produce(options: CodePipelineActionOptions): CodePipelineActionFactoryResult {
    return {
      action: new cp_actions.GitHubSourceAction({
        actionName: options.actionName,
        oauthToken: this.authentication,
        output: options.artifacts.toCodePipeline(this.primaryOutput!),
        owner: this.owner,
        repo: this.repo,
        branch: this.branch,
        runOrder: options.runOrder,
        trigger: cp_actions.GitHubTrigger.WEBHOOK,
      }),
    };
  }
}