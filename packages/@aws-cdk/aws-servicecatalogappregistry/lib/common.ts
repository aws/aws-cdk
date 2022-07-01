import * as crypto from 'crypto';
import * as iam from '@aws-cdk/aws-iam';

/**
 * The options that are passed into a share of an Application or Attribute Group.
 */
export interface ShareOptions {
  /**
   * When set to true, this allows sharing of applications and attribute groups
   * with accounts outside of your AWS Organization. When set to false, sharing
   * is restricted to only accounts and principals which belong to the organization.
   *
   * @default true
   */
  readonly allowExternalPrincipals?: boolean;

  /**
   * A list of AWS accounts that the application will be shared with.
   *
   * @default - No accounts specified for share
   */
  readonly accounts?: string[];

  /**
   * A list of AWS Organization or Organizational Units (OUs) ARNs that the application will be shared with.
   *
   * @default - No AWS Organizations or OUs specified for share
   */
  readonly organizations?: string[];

  /**
   * A list of AWS IAM roles that the application will be shared with.
   *
   * @default - No IAM roles specified for share
   */
  readonly roles?: iam.IRole[];

  /**
   * A list of AWS IAM users that the application will be shared with.
   *
   * @default - No IAM Users specified for share
   */
  readonly users?: iam.IUser[];
}

/**
 * Generates a unique hash identfifer using SHA256 encryption algorithm.
 */
export function hashValues(...values: string[]): string {
  const sha256 = crypto.createHash('sha256');
  values.forEach(val => sha256.update(val));
  return sha256.digest('hex').slice(0, 12);
}

/**
 * Reformats share targets into a collapsed list necessary for handler.
 * @param options The share target options
 * @returns flat list of target ARNs
 */
export function getPrincipalsforSharing(options: ShareOptions): string[] {
  const principals = [
    ...options.accounts ?? [],
    ...options.organizations ?? [],
    ...options.users ? options.users.map(user => user.userArn) : [],
    ...options.roles ? options.roles.map(role => role.roleArn) : [],
  ];

  if (principals.length == 0) {
    throw new Error('An entity must be provided for the share');
  }

  return principals;
}
