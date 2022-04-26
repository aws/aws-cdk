import * as codecommit from '@aws-cdk/aws-codecommit';
import { SecretValue } from '@aws-cdk/core';
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
   * A personal access token with the `repo` scope
   */
  readonly oauthToken: SecretValue;
}

/**
 * GitHub source code provider
 */
export class GitHubSourceCodeProvider implements ISourceCodeProvider {
  constructor(private readonly props: GitHubSourceCodeProviderProps) {}

  public bind(_app: App): SourceCodeProviderConfig {
    return {
      repository: `https://github.com/${this.props.owner}/${this.props.repository}`,
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
   * A personal access token with the `repo` scope
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
