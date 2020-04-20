import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import { Construct, IResource, Resource } from '@aws-cdk/core';
import { AwsCustomResource, AwsCustomResourcePolicy, AwsSdkCall, PhysicalResourceId } from '@aws-cdk/custom-resources';
import { CfnUserPoolDomain } from './cognito.generated';
import { IUserPool } from './user-pool';

/**
 * Represents a user pool domain.
 */
export interface IUserPoolDomain extends IResource {
  /**
   * The domain that was specified to be created.
   * If `customDomain` was selected, this holds the full domain name that was specified.
   * If the `cognitoDomain` was used, it contains the prefix to the Cognito hosted domain.
   * @attribute
   */
  readonly domainName: string;
}

/**
 * Options while specifying custom domain
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-add-custom-domain.html
 */
export interface CustomDomainOptions {
  /**
   * The custom domain name that you would like to associate with this User Pool.
   */
  readonly domainName: string;

  /**
   * The certificate to associate with this domain.
   */
  readonly certificate: ICertificate;
}

/**
 * Options while specifying a cognito prefix domain.
 * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-assign-domain-prefix.html
 */
export interface CognitoDomainOptions {
  /**
   * The prefix to the Cognito hosted domain name that will be associated with the user pool.
   */
  readonly domainPrefix: string;
}

interface UserPoolDomainTypeConfig {
  readonly domain: string;

  readonly certificate?: ICertificate;
}

/**
 * The type of user pool domain. Two types are currently supported - custom domain and cognito domain.
 */
export class UserPoolDomainType {
  /**
   * Associate a custom domain with your user pool
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-add-custom-domain.html
   */
  public static customDomain(options: CustomDomainOptions): UserPoolDomainType {
    return new UserPoolDomainType({
      domain: options.domainName,
      certificate: options.certificate,
    });
  }

  /**
   * Associate a cognito prefix domain with your user pool
   * @see https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-assign-domain-prefix.html
   */
  public static cognitoDomain(options: CognitoDomainOptions): UserPoolDomainType {
    if (options.domainPrefix && !/^[a-z0-9-]+$/.test(options.domainPrefix)) {
      throw new Error('domainPrefix for cognitoDomain can contain only lowercase alphabets, numbers and hyphens');
    }
    return new UserPoolDomainType({
      domain: options.domainPrefix,
    });
  }

  private constructor(private readonly domainConfig: UserPoolDomainTypeConfig) {}

  /**
   * @internal
   */
  public _domainConfig(): UserPoolDomainTypeConfig {
    return this.domainConfig;
  }
}

/**
 * Options to create a UserPoolDomain
 */
export interface UserPoolDomainOptions {
  /**
   * Domain configuration options for the two types of user pool domains.
   * Create a cognito prefix domain via `UserPoolDomainType.cognitoPrefixDomain()` or,
   * a custom domain via `UserPoolDomainType.customDomain()`,
   */
  readonly domain: UserPoolDomainType;
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

    const domainConfig = props.domain._domainConfig();
    const resource = new CfnUserPoolDomain(this, 'Resource', {
      userPoolId: props.userPool.userPoolId,
      domain: domainConfig.domain,
      customDomainConfig: domainConfig.certificate ? { certificateArn: domainConfig.certificate.certificateArn } : undefined,
    });

    this.domainName = resource.ref;
  }

  /**
   * The domain name of the CloudFront distribution associated with the user pool domain.
   */
  public get cloudFrontDomainName(): string {
    const sdkCall: AwsSdkCall = {
      service: 'CognitoIdentityServiceProvider',
      action: 'describeUserPoolDomain',
      parameters: {
        Domain: this.domainName,
      },
      physicalResourceId: PhysicalResourceId.of(this.domainName),
    };
    const customResource = new AwsCustomResource(this, 'CloudFrontDomainName', {
      resourceType: 'Custom::UserPoolCloudFrontDomainName',
      onCreate: sdkCall,
      onUpdate: sdkCall,
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        // DescribeUserPoolDomain only supports access level '*'
        // https://docs.aws.amazon.com/IAM/latest/UserGuide/list_amazoncognitouserpools.html#amazoncognitouserpools-actions-as-permissions
        resources: [ '*' ],
      }),
    });
    return customResource.getResponseField('DomainDescription.CloudFrontDistribution');
  }
}
