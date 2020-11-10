import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';
import { ISource } from './source';

/**
 * Construction properties of the {@link BitBucket BitBucket source}.
 */
export interface BitBucketSourceProps {

  /**
   * The BitBucket repo slug. (e.g. "aws/aws-cdk")
   */
  readonly slug: string;

  /**
   * The branch to use.
   *
   * @default "master"
   */
  readonly branch?: string;

  /**
   * The ARN of the CodeStar Connection created in the AWS console
   * that has permissions to access this BitBucket repository.
   *
   * @example 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh'
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/connections-create.html
   */
  readonly connectionArn: string;

}

/**
 * A CDK Pipeline source provider for BitBucket.
 *
 * @experimental
 */
export class BitBucketSource implements ISource {

  constructor(private readonly props: BitBucketSourceProps) {
    //
  }

  public provideSourceAction(sourceArtifact: codepipeline.Artifact): codepipeline.IAction {
    const [owner, repo] = this.props.slug.split('/');
    return new codepipelineActions.BitBucketSourceAction({
      actionName: `${owner}-${repo}`,
      connectionArn: this.props.connectionArn,
      output: sourceArtifact,
      owner,
      repo,
      branch: this.props.branch,
    });
  }
}
