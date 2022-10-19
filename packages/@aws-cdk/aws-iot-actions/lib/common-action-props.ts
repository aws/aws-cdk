import * as iam from '@aws-cdk/aws-iam';

/**
 * Common properties shared by Actions it access to AWS service.
 */
export interface CommonActionProps {
  /**
   * The IAM role that allows access to AWS service.
   *
   * @default a new role will be created
   */
  readonly role?: iam.IRole;
}
