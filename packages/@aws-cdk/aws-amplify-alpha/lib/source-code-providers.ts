import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import { SecretValue } from 'aws-cdk-lib/core';
import { App, ISourceCodeProvider, SourceCodeProviderConfig } from './app';

/**
 * Properties for a GitHub source code provider
 */
export interface GitHubSourceCodeProviderProps {
  /**
   * The user or organization owning the repository
   */
  readonly owner: string;

  /**
   * The name of the repository
   */
  readonly repository: string;

  /**
   * Personal Access token for GitHub repository using the Amplify GitHub App.
   * Required for new GitHub repositories.
   *
   * @default - no access token
   */
  readonly accessToken?: SecretValue;

  /**
   * OAuth token for GitHub repository.
   * @deprecated Use accessToken instead. OAuth tokens for GitHub repositories are supported
   * for backwards compatibility but we strongly recommend using accessToken with the Amplify GitHub App.
   * Existing Amplify apps deployed from a GitHub repository using OAuth continue to work with CI/CD.
   * However, we strongly recommend that you migrate these apps to use the GitHub App
   * https://docs.aws.amazon.com/amplify/latest/userguide/setting-up-GitHub-access.html#migrating-to-github-app-auth
   * @default - no OAuth token
   */
  readonly oauthToken?: SecretValue;
}

/**
 * GitHub source code provider
 */
export class GitHubSourceCodeProvider implements ISourceCodeProvider {
  constructor(private readonly props: GitHubSourceCodeProviderProps) {}

  public bind(_app: App): SourceCodeProviderConfig {
    return {
      repository: `https://github.com/${this.props.owner}/${this.props.repository}`,
      accessToken: this.props.accessToken,
      oauthToken: this.props.oauthToken,
    };
  }
}

/**
 * Properties for a GitLab source code provider
 */
export interface GitLabSourceCodeProviderProps {
  /**
   * The user or organization owning the repository
   */
  readonly owner: string;

  /**
   * The name of the repository
   */
  readonly repository: string;

  /**
   * OAuth token for GitLab repository with the `repo` scope
   */
  readonly oauthToken: SecretValue;
}

/**
 * GitLab source code provider
 */
export class GitLabSourceCodeProvider implements ISourceCodeProvider {
  constructor(private readonly props: GitLabSourceCodeProviderProps) { }

  public bind(_app: App): SourceCodeProviderConfig {
    return {
      repository: `https://gitlab.com/${this.props.owner}/${this.props.repository}`,
      oauthToken: this.props.oauthToken,
    };
  }
}

/**
 * Properties for a CodeCommit source code provider
 */
export interface CodeCommitSourceCodeProviderProps {
  /**
   * The CodeCommit repository
   */
  readonly repository: codecommit.IRepository;
}

/**
 * CodeCommit source code provider
 */
export class CodeCommitSourceCodeProvider implements ISourceCodeProvider {
  constructor(private readonly props: CodeCommitSourceCodeProviderProps) {}

  public bind(app: App): SourceCodeProviderConfig {
    this.props.repository.grantPull(app);

    return {
      repository: this.props.repository.repositoryCloneUrlHttp,
    };
  }
}
