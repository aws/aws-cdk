import { ExecutionSourceAction, SourceType } from '../../graph/source-actions';
import { Authentication } from '../../shared/source-authentication';
import { AddSourceToGraphOptions, Source } from './index';

export interface GitHubSourceProps {
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
   * @default - Authentication.storedToken('GitHub')
   */
  readonly authentication?: Authentication;

  // TODO: WebHook/Poll customization?
}

export class GitHubSource extends Source {
  private readonly owner: string;
  private readonly repo: string;
  private readonly branch: string;
  private readonly authentication: Authentication;

  constructor(repo: string, props: GitHubSourceProps = {}) {
    super();

    const parts = repo.split('/');
    if (parts.length !== 2) {
      throw new Error(`GitHub repository name should look like '<owner>/<repo>', got '${repo}'`);
    }
    this.owner = parts[0];
    this.repo = parts[1];
    this.branch = props.branch ?? 'main';
    this.authentication = props.authentication ?? Authentication.storedToken('GitHub');
  }

  public addToExecutionGraph(options: AddSourceToGraphOptions): void {
    const action = new ExecutionSourceAction(`${this.owner}/${this.repo}`, this, {
      type: SourceType.GITHUB,
      gitHubSource: {
        authentication: this.authentication,
        branch: this.branch,
        owner: this.owner,
        repo: this.repo,
      },
    });
    options.parent.add(action);
  }
}