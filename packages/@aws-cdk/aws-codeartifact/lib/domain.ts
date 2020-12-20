import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import { Resource, Stack, Lazy, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDomain } from './codeartifact.generated';
import { IDomain, IRepository, DomainAttributes } from './interfaces';
import { DOMAIN_CREATE_ACTIONS, DOMAIN_LOGIN_ACTIONS, DOMAIN_READ_ACTIONS } from './perms';
import { validate } from './validation';

/**
 * Properties for a new CodeArtifact domain
 * @experimental
 */
export interface DomainProps {
  /**
  * The name of the domain
  * @default Unique id
  */
  readonly domainName?: string;

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
   * @default Open policy that allows principal to reader, create, and generate authorization token.
   */
  readonly policyDocument?: iam.PolicyDocument
}

/**
 * A new CodeArtifacft domain
 * @experimental
 */
export class Domain extends Resource implements IDomain {
  /**
 * Import an existing domain provided an ARN
 *
 * @param scope The parent creating construct
 * @param id The construct's name
 * @param domainArn Domain ARN (i.e. arn:aws:codeartifact:us-east-2:444455556666:domain/MyDomain)
 */
  public static fromDomainArn(scope: Construct, id: string, domainArn: string): IDomain {
    return Domain.fromDomainAttributes(scope, id, { domainArn: domainArn });
  }

  /**
   * Import an existing domain
   */
  public static fromDomainAttributes(scope: Construct, id: string, attrs: DomainAttributes): IDomain {
    const stack = Stack.of(scope);
    const domainName = attrs.domainName || stack.parseArn(attrs.domainArn).resourceName;

    if (!domainName || domainName == '') {
      throw new Error('Domain name is required as a resource name with the ARN');
    }

    class Import extends Resource implements IDomain {
      domainArn: string = '';
      domainName?: string | undefined;
      domainOwner?: string | undefined;
      domainEncryptionKey?: kms.IKey | undefined;
    }

    const instance = new Import(scope, id);
    instance.domainName = domainName;
    instance.domainArn = attrs.domainArn;
    instance.domainEncryptionKey = attrs.domainEncryptionKey;

    return instance;
  }

  public readonly domainName?: string;
  public readonly domainNameAttr?: string;
  public readonly domainArn: string = '';
  public readonly domainOwner?: string = '';
  public readonly domainEncryptionKey?: kms.IKey;
  public readonly policyDocument?: iam.PolicyDocument;
  private readonly cfnDomain: CfnDomain;

  constructor(scope: Construct, id: string, props?: DomainProps) {
    super(scope, id);

    // Set domain and encryption key as we will validate them before creation
    const domainName = props?.domainName ?? this.node.uniqueId;
    const domainEncryptionKey = props?.domainEncryptionKey ?? null;

    this.validateProps(domainName, domainEncryptionKey);

    // Create the CFN domain instance
    this.cfnDomain = new CfnDomain(this, 'Resource', {
      domainName: domainName,
      permissionsPolicyDocument: Lazy.anyValue({ produce: () => props?.policyDocument?.toJSON() }),
      encryptionKey: domainEncryptionKey?.keyId,
    });

    this.domainName = domainName;
    this.domainNameAttr = this.cfnDomain.attrName;
    this.domainArn = this.cfnDomain.attrArn;
    this.domainOwner = this.cfnDomain.attrOwner;
    this.policyDocument = props?.policyDocument;
  }

  /**
   * Add a repositories to the domain
   */
  addRepositories(...repositories: IRepository[]): IDomain {
    if (repositories.length > 0) {
      repositories.forEach(r => r.assignDomain(this));
    }

    return this;
  }

  private validateProps(domainName : string, domainEncryptionKey? : kms.IKey | null) {
    if (Token.isUnresolved(domainName)) {
      throw new Error(`'domainName' must resolve, got: '${domainName}'`);
    }

    validate('DomainName',
      { required: true, minLength: 2, maxLength: 50, pattern: /[a-z][a-z0-9\-]{0,48}[a-z0-9]/gi, documentationLink: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-domain.html#cfn-codeartifact-domain-domainname' },
      domainName);

    validate('EncryptionKey',
      { minLength: 1, maxLength: 2048, pattern: /\S+/gi, documentationLink: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-domain.html#cfn-codeartifact-domain-encryptionkey' },
      domainEncryptionKey?.keyArn || '');
  }

  /**
   * Adds a statement to the IAM resource policy associated with this domain.
   */
  public addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult {

    if (!this.policyDocument) {
      const p = this.policyDocument || new iam.PolicyDocument();

      p.addStatements(statement);

      return { statementAdded: true, policyDependable: p };
    }

    return { statementAdded: false };
  }

  private grant(principal: iam.IGrantable, iamActions: string[], resource: string = '*'): iam.Grant {
    return iam.Grant.addToPrincipalOrResource({
      grantee: principal,
      actions: iamActions,
      resourceArns: [resource],
      resource: this,
    });
  }

  /**
   * Assign default login, creation, and read for the domain.
   * @param principal The principal of for the policy
   * @see https://docs.aws.amazon.com/codeartifact/latest/ug/domain-policies.html#domain-policy-example
   */
  grantDefaultPolicy(principal: iam.IPrincipal): iam.Grant {
    const p = principal;
    this.grantLogin(p);
    this.grantCreate(p);
    return this.grantRead(p);
  }

  /**
     * Adds read actions for the principal to the domain's
     * resource policy
     * @param principal The principal for the policy
     * @see https://docs.aws.amazon.com/codeartifact/latest/ug/domain-spolicies.html
     */
  public grantRead(principal: iam.IPrincipal): iam.Grant {
    return this.grant(principal, DOMAIN_READ_ACTIONS);
  }
  /**
     * Adds GetAuthorizationToken for the principal to the domain's
     * resource policy
     * @param principal The principal for the policy
     * @see https://docs.aws.amazon.com/codeartifact/latest/ug/domain-policies.html
     */
  public grantLogin(principal: iam.IPrincipal): iam.Grant {
    return this.grant(principal, DOMAIN_LOGIN_ACTIONS);
  }
  /**
     * Adds CreateRepository for the principal to the domain's
     * resource policy
     * @param principal The principal for the policy
     * @see https://docs.aws.amazon.com/codeartifact/latest/ug/domain-policies.html
     */
  public grantCreate(principal: iam.IPrincipal): iam.Grant {
    return this.grant(principal, DOMAIN_CREATE_ACTIONS);
  }
}