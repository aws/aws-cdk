import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import { IResource, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDomain } from './codeartifact.generated';
import { validate } from './validation';

/**
 * Represents a CodeArtifact domain
 */
export interface IDomain extends IResource {
/**
 * The ARN of domain resource.
 * Equivalent to doing `{ 'Fn::GetAtt': ['LogicalId', 'Arn' ]}`
 * in CloudFormation if the underlying CloudFormation resource
 * surfaces the ARN as a return value -
 * if not, we usually construct the ARN "by hand" in the construct,
 * using the Fn::Join function.
 *
 * It needs to be annotated with '@attribute' if the underlying CloudFormation resource
 * surfaces the ARN as a return value.
 *
 * @attribute
 */
  readonly domainArn: string;

  /**
   * The physical name of the domain resource.
   * Often, equivalent to doing `{ 'Ref': 'LogicalId' }`
   * (but not always - depends on the particular resource modeled)
   * in CloudFormation.
   * Also needs to be annotated with '@attribute'.
   *
   * @attribute
   */
  readonly domainName: string;

  /**
   * The domain owner
   * Often, equivalent to the account id.
   * @attribute
   */
  readonly domainOwner: string;

  /**
   * The KMS encryption key used for the domain resource.
   * @default AWS Managed Key
   * @attribute
   */
  readonly domainEncryptionKey: kms.IKey;

  /**
   * The underlying CloudFormation domain
   * @attribute
   */
  readonly cfnDomain: CfnDomain;
}

/**
 * Properties for a new CodeArtifact domain
 */
export interface DomainProps {
  /**
  * The name of the domain
  */
  readonly domainName: string;

  /**
   * The KMS encryption key used for the domain resource.
   * @default AWS Managed Key
   * @attribute
   */
  readonly domainEncryptionKey?: kms.IKey;
  /**
     * Principal for the resource policy for the domain
     * @default AccountRootPrincipal
     */
  readonly principal?: iam.IPrincipal

  /**
   * Resource policy for the domain
   * @default Read/Create/Authorize
   */
  readonly policyDocument?: iam.PolicyDocument
}

/**
 * Either a new or imported Domain
 */
export abstract class DomainBase extends Resource implements IDomain {

  /** @attribute */
  abstract readonly domainArn: string = '';
  /** @attribute */
  abstract readonly domainName: string = '';
  /** @attribute */
  abstract readonly domainOwner: string = '';
  /** @attribute */
  abstract readonly domainEncryptionKey: kms.IKey;
  /** @attribute */
  abstract readonly cfnDomain: CfnDomain;

  constructor(scope: Construct, id: string) {
    super(scope, id, {});
  }
}

/**
 * A new CodeArtifacft domain
 */
export class Domain extends DomainBase {
  /**
 * Import an existing domain provided an ARN
 *
 * @param scope The parent creating construct
 * @param id The construct's name
 * @param domainArn Domain ARN (i.e. arn:aws:codeartifact:us-east-2:444455556666:domain/MyDomain)
 */
  public static fromDomainArn(scope: Construct, id: string, domainArn: string): IDomain {
    const parsed = Stack.of(scope).parseArn(domainArn);
    const domainName = parsed.resourceName || '';

    class Import extends Domain {
      public readonly domainName: string = parsed.resourceName || '';
      public readonly domainOwner: string = parsed.account || '';
      public readonly domainArn = domainArn;
    }

    return new Import(scope, id, { domainName: domainName });
  }

  public readonly domainArn: string = '';
  public readonly domainName: string = '';
  public readonly domainOwner: string = '';
  public readonly domainEncryptionKey: kms.IKey;
  public readonly cfnDomain: CfnDomain;

  constructor(scope: Construct, id: string, props: DomainProps) {
    super(scope, id);

    this.cfnDomain = new CfnDomain(this, id, {
      domainName: props.domainName,
    });


    if (props.domainEncryptionKey) {
      this.cfnDomain.addPropertyOverride('EncryptionKey', props.domainEncryptionKey);
    }

    this.domainArn = this.cfnDomain.attrArn;
    this.domainName = props.domainName;
    this.domainOwner = this.cfnDomain.attrOwner;
    this.domainEncryptionKey = kms.Key.fromKeyArn(scope, 'EncryptionKey', this.cfnDomain.attrEncryptionKey);

    this.Validate();

    if (!props.policyDocument) {
      const p = props.principal || new iam.AccountRootPrincipal();
      this.allowAuthorization(p).allowCreateRepository(p).allowReadFromDomain(p);
    } else {
      this.cfnDomain.permissionsPolicyDocument = props.policyDocument;
    }
  }

  private Validate() {
    validate('DomainName', { required: true, minLength: 2, maxLength: 50, pattern: /[a-z][a-z0-9\-]{0,48}[a-z0-9]/gi }, this.domainName);
    validate('EncryptionKey', { minLength: 1, maxLength: 2048, pattern: /\S+/gi }, this.domainEncryptionKey.keyArn);
  }

  private createPolicy(principal: iam.IPrincipal, iamActions: string[], resource: string = '*') {
    const p = this.cfnDomain.permissionsPolicyDocument as iam.PolicyDocument || new iam.PolicyDocument();

    p.addStatements(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [
        principal,
      ],
      resources: [resource],
      actions: iamActions,
    }));

    this.cfnDomain.permissionsPolicyDocument = p;
  }

  /**
     * Adds read actions for the principal to the domain's
     * resource policy
     * @param principal The principal for the policy
     * @see https://docs.aws.amazon.com/codeartifact/latest/ug/domain-policies.html
     */
  public allowReadFromDomain(principal : iam.IPrincipal) : Domain {
    this.createPolicy(principal,
      ['codeartifact:GetDomainPermissionsPolicy',
        'codeartifact:ListRepositoriesInDomain',
        'codeartifact:DescribeDomain'],
    );
    return this;
  }
  /**
     * Adds GetAuthorizationToken for the principal to the domain's
     * resource policy
     * @param principal The principal for the policy
     * @see https://docs.aws.amazon.com/codeartifact/latest/ug/domain-policies.html
     */
  public allowAuthorization(principal : iam.IPrincipal) : Domain {
    this.createPolicy(principal,
      ['codeartifact:GetAuthorizationToken'],
    );
    return this;
  }
  /**
     * Adds CreateRepository for the principal to the domain's
     * resource policy
     * @param principal The principal for the policy
     * @see https://docs.aws.amazon.com/codeartifact/latest/ug/domain-policies.html
     */
  public allowCreateRepository(principal : iam.IPrincipal) : Domain {
    this.createPolicy(principal,
      ['codeartifact:CreateRepository'],
    );
    return this;
  }
}