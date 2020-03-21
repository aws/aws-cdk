import * as codecommit from '@aws-cdk/aws-codecommit';
import * as iam from '@aws-cdk/aws-iam';
import { SecretValue } from '@aws-cdk/core';

/**
 * Configuration for the source code provider
 */
export interface SourceCodeProviderConfig {
  /**
   * The repository for the application. Must use the `HTTPS` protocol.
   *
   * @example https://github.com/aws/aws-cdk
   */
  readonly repository: string;

  /**
   * OAuth token for 3rd party source control system for an Amplify App, used
   * to create webhook and read-only deploy key. OAuth token is not stored.
   *
   * Either `accessToken` or `oauthToken` must be specified if `repository`
   * is sepcified.
   *
   * @default - do not use a token
   */
  readonly oauthToken?: SecretValue;

  /**
   * Personal Access token for 3rd party source control system for an Amplify
   * App, used to create webhook and read-only deploy key. Token is not stored.
   *
   * Either `accessToken` or `oauthToken` must be specified if `repository`
   * is sepcified.
   *
   * @default - do not use a token
   */
  readonly accessToken?: SecretValue;
}

/**
 * A source code provider
 */
export interface ISourceCodeProvider {
  /**
   * Binds the source code provider to an app
   *
   * @param role The role associated with the app
   */
  bind(role: iam.IRole): SourceCodeProviderConfig;
}

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

  public bind(_role: iam.IRole): SourceCodeProviderConfig {
    return {
      repository: `https://github.com/${this.props.owner}/${this.props.repository}`,
      oauthToken: this.props.oauthToken
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

  public bind(role: iam.IRole): SourceCodeProviderConfig {
    this.props.repository.grantPull(role);

    return {
      repository: this.props.repository.repositoryCloneUrlHttp
    };
  }
}
