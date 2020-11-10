import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';
import { SecretValue } from '@aws-cdk/core';
import { ISource } from './source';

/**
 * Construction properties of the {@link GitHubSource GitHub source}.
 */
export interface GitHubSourceProps {

  /**
   * The GitHub repo slug. (e.g. "aws/aws-cdk")
   */
  readonly slug: string;

  /**
   * The branch to use.
   *
   * @default "master"
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
   * @default - use a SecretsManager secret called GitHub
   */
  readonly oauthToken?: SecretValue;

  /**
   * How AWS CodePipeline should be triggered
   *
   * With the default value "WEBHOOK", a webhook is created in GitHub that triggers the action
   * With "POLL", CodePipeline periodically checks the source for changes
   * With "None", the action is not triggered through changes in the source
   *
   * To use `WEBHOOK`, your GitHub Personal Access Token should have
   * **admin:repo_hook** scope (in addition to the regular **repo** scope).
   *
   * @default GitHubTrigger.WEBHOOK
   */
  readonly trigger?: codepipelineActions.GitHubTrigger;
}

/**
 * A CDK Pipeline source provider for GitHub.
 *
 * @experimental
 */
export class GitHubSource implements ISource {

  constructor(private readonly props: GitHubSourceProps) {
    //
  }

  public provideSourceAction(sourceArtifact: codepipeline.Artifact): codepipeline.IAction {
    const [owner, repo] = this.props.slug.split('/');
    return new codepipelineActions.GitHubSourceAction({
      actionName: `${owner}-${repo}`,
      oauthToken: this.props.oauthToken ?? SecretValue.secretsManager('GitHub'),
      output: sourceArtifact,
      owner,
      repo,
      branch: this.props.branch,
      trigger: this.props.trigger,
    });
  }
}
