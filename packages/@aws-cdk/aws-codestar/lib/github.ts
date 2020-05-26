import { IBucket } from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as codestar from './codestar.generated';

/**
 * Properties of GithubRepository
 */
export interface GithubRepositoryProps {
  /**
   * The GitHub user name for the owner of the GitHub repository to be created. If this
   * repository should be owned by a GitHub organization, provide its name
   */
  readonly owner: string;
  /**
   * The name of the repository you want to create in GitHub with AWS CloudFormation stack creation
   */
  readonly name: string;
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
   * @default - not specified
   */
  readonly version?: string;
}

/**
 * The GithubRepository resource
 */
export class GithubRepository extends cdk.Construct {
  /**
   * a string combination of the repository owner and the repository name,
   * such as `my-github-account/my-github-repo`.
   */
  public readonly repository: string;
  constructor(scope: cdk.Construct, id: string, props: GithubRepositoryProps) {
    super(scope, id);

    const resource = new codestar.CfnGitHubRepository(this, 'GithubRepo', {
      repositoryOwner: props.owner,
      repositoryName: props.name,
      repositoryAccessToken: props.accessToken.toString(),
      code: {
        s3: {
          bucket: props.bucket.bucketName,
          key: props.key,
        },
      },
    });
    this.repository = resource.ref;
  }
}
