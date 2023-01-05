import { Resource, SecretValue } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnSourceCredential } from './codebuild.generated';

/**
 * Creation properties for `GitHubSourceCredentials`.
 */
export interface GitHubSourceCredentialsProps {
  /**
   * The personal access token to use when contacting the GitHub API.
   */
  readonly accessToken: SecretValue;
}

/**
 * The source credentials used when contacting the GitHub API.
 *
 * **Note**: CodeBuild only allows a single credential for GitHub
 * to be saved in a given AWS account in a given region -
 * any attempt to add more than one will result in an error.
 *
 * @resource AWS::CodeBuild::SourceCredential
 */
export class GitHubSourceCredentials extends Resource {
  constructor(scope: Construct, id: string, props: GitHubSourceCredentialsProps) {
    super(scope, id);

    new CfnSourceCredential(this, 'Resource', {
      serverType: 'GITHUB',
      authType: 'PERSONAL_ACCESS_TOKEN',
      token: props.accessToken.unsafeUnwrap(), // Safe usage
    });
  }
}

/**
 * Creation properties for `GitHubEnterpriseSourceCredentials`.
 */
export interface GitHubEnterpriseSourceCredentialsProps {
  /**
   * The personal access token to use when contacting the
   * instance of the GitHub Enterprise API.
   */
  readonly accessToken: SecretValue;
}

/**
 * The source credentials used when contacting the GitHub Enterprise API.
 *
 * **Note**: CodeBuild only allows a single credential for GitHub Enterprise
 * to be saved in a given AWS account in a given region -
 * any attempt to add more than one will result in an error.
 *
 * @resource AWS::CodeBuild::SourceCredential
 */
export class GitHubEnterpriseSourceCredentials extends Resource {
  constructor(scope: Construct, id: string, props: GitHubEnterpriseSourceCredentialsProps) {
    super(scope, id);

    new CfnSourceCredential(this, 'Resource', {
      serverType: 'GITHUB_ENTERPRISE',
      authType: 'PERSONAL_ACCESS_TOKEN',
      token: props.accessToken.unsafeUnwrap(), // Safe usage
    });
  }
}

/**
 * Construction properties of `BitBucketSourceCredentials`.
 */
export interface BitBucketSourceCredentialsProps {
  /** Your BitBucket username. */
  readonly username: SecretValue;

  /** Your BitBucket application password. */
  readonly password: SecretValue;
}

/**
 * The source credentials used when contacting the BitBucket API.
 *
 * **Note**: CodeBuild only allows a single credential for BitBucket
 * to be saved in a given AWS account in a given region -
 * any attempt to add more than one will result in an error.
 *
 * @resource AWS::CodeBuild::SourceCredential
 */
export class BitBucketSourceCredentials extends Resource {
  constructor(scope: Construct, id: string, props: BitBucketSourceCredentialsProps) {
    super(scope, id);

    new CfnSourceCredential(this, 'Resource', {
      serverType: 'BITBUCKET',
      authType: 'BASIC_AUTH',
      username: props.username.unsafeUnwrap(), // Safe usage
      token: props.password.unsafeUnwrap(), // Safe usage
    });
  }
}
