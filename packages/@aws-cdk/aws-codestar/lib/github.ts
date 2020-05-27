import { IBucket } from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as codestar from './codestar.generated';

/**
 * GitHubRepository resource interface
 */
export interface IGitHubRepository extends cdk.IResource {
  /**
   * a string combination of the repository owner and the repository name,
   * such as `my-GitHub-account/my-GitHub-repo`.
   */
  readonly repository: string
}

/**
 * Construction properties of {@link GitHubRepository}.
 */
export interface GitHubRepositoryProps {
  /**
   * The GitHub user name for the owner of the GitHub repository to be created. If this
   * repository should be owned by a GitHub organization, provide its name
   */
  readonly owner: string;
  /**
   * The name of the repository you want to create in GitHub with AWS CloudFormation stack creation
   */
  readonly gitHubRepositoryName: string;
  /**
   * The GitHub user's personal access token for the GitHub repository
   */
  readonly accessToken: cdk.SecretValue;
  /**
   * The name of the Amazon S3 bucket that contains the ZIP file with the content to be committed to the new repository
   */
  readonly bucket: IBucket;
  /**
   * The S3 object key or file name for the ZIP file
   */
  readonly key: string;
  /**
   * The object version of the ZIP file, if versioning is enabled for the Amazon S3 bucket
   *
   * @default - not specified
   */
  readonly version?: string;
  /**
   * Indicates whether to enable issues for the GitHub repository. You can use GitHub issues to track information
   * and bugs for your repository.
   *
   * @default false
   */
  readonly enableIssues?: boolean;
  /**
   * Indicates whether the GitHub repository is a private repository. If so, you choose who can see and commit to
   * this repository.
   *
   * @default false
   */
  readonly private?: boolean;
  /**
   * A comment or description about the new repository. This description is displayed in GitHub after the repository
   * is created.
   *
   * @default - no description
   */
  readonly description?: string;
}

/**
 * The GitHubRepository resource
 * @resource AWS::CodeStar::GitHubRepository
 */
export class GitHubRepository extends cdk.Resource implements IGitHubRepository {
  /**
   * a string combination of the repository owner and the repository name,
   * such as `my-GitHub-account/my-GitHub-repo`.
   */
  public readonly repository: string;
  constructor(scope: cdk.Construct, id: string, props: GitHubRepositoryProps) {
    super(scope, id);

    const resource = new codestar.CfnGitHubRepository(this, 'GitHubRepo', {
      repositoryOwner: props.owner,
      repositoryName: props.gitHubRepositoryName,
      repositoryAccessToken: props.accessToken.toString(),
      code: {
        s3: {
          bucket: props.bucket.bucketName,
          key: props.key,
        },
      },
      enableIssues: props.enableIssues ?? false,
      isPrivate: props.private ?? false,
      repositoryDescription: props.description,
    });
    this.repository = resource.ref;
  }
}
