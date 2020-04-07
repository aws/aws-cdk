import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import { Construct, IResource, Resource } from '@aws-cdk/core';
import { CfnUserPoolDomain } from './cognito.generated';
import { IUserPool } from './user-pool';

/**
 * Represents a user pool domain.
 */
export interface IUserPoolDomain extends IResource {
  /**
   * The domain that was specified to be created.
   * If a customDomain was selected, this holds the full domain name that was specified.
   * If the `cognitoDomainPrefix` was used, it contains the prefix to the Cognito hosted domain.
   * @attribute
   */
  readonly domainName: string;
}

/**
 * Options to create a UserPoolDomain
 */
export interface UserPoolDomainOptions {
  /**
   * The domain name that you would like to associate with this User Pool.
   * If this is specified, the `certificate` property must also be specified.
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-add-custom-domain.html
   * Both `userPoolDomainName` and `cognitoDomainPrefix` cannot be specified.
   * @default - none
   */
  readonly userPoolDomainName?: string;

  /**
   * The prefix to the Cognito hosted domain name that will be associated with the user pool.
   * The final domain name will be '[customPrefixDomain].auth.[region].amazoncognito.com'.
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-assign-domain-prefix.html
   * Both `userPoolDomainName` and `cognitoDomainPrefix` cannot be specified.
   * @default - CDK will generate a unique prefix, unless `userPoolDomainName` is specified.
   */
  readonly cognitoDomainPrefix?: string;

  /**
   * The certificate to associate with this domain when `userPoolDomainName` property is used.
   * @default - none
   */
  readonly certificate?: ICertificate;
}

/**
 * Props for UserPoolDomain construct
 */
export interface UserPoolDomainProps extends UserPoolDomainOptions {
  /**
   * The user pool to which this domain should be associated.
   */
  readonly userPool: IUserPool;
}

/**
 * Define a user pool domain
 */
export class UserPoolDomain extends Resource implements IUserPoolDomain {
  public readonly domainName: string;

  constructor(scope: Construct, id: string, props: UserPoolDomainProps) {
    super(scope, id);

    if ((props.cognitoDomainPrefix && props.userPoolDomainName) || (!props.cognitoDomainPrefix && !props.userPoolDomainName)) {
      throw new Error('One, and only one, of cognitoDomainPrefix and userPoolDomainName must be specified');
    }
    if (props.userPoolDomainName && !props.certificate) {
      throw new Error('A certificate must be specified when creating your own domain');
    }

    const domain = props.userPoolDomainName ?? props.cognitoDomainPrefix!;
    const resource = new CfnUserPoolDomain(this, 'Resource', {
      userPoolId: props.userPool.userPoolId,
      domain,
      customDomainConfig: props.certificate ? { certificateArn: props.certificate.certificateArn } : undefined,
    });

    this.domainName = resource.ref;
  }
}
