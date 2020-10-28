import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import { Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDomain } from './codeartifact.generated';
import { IDomain, IRepository, DomainAttributes } from './interfaces';
import { DOMAIN_CREATE_ACTIONS, DOMAIN_LOGIN_ACTIONS, DOMAIN_READ_ACTIONS } from './perms';
import { validate } from './validation';

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
 * A new CodeArtifacft domain
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

    class Import extends Domain { }

    return new Import(scope, id, { domainName: domainName || '', domainEncryptionKey: attrs.domainEncryptionKey });
  }


  public readonly domainArn: string = '';
  public readonly domainName?: string = '';
  public readonly domainOwner?: string = '';
  public readonly domainEncryptionKey?: kms.IKey;
  private readonly cfnDomain: CfnDomain;

  constructor(scope: Construct, id: string, props: DomainProps) {
    super(scope, id);

    // Set domain and encryption key as we will validate them before creation
    this.domainName = props.domainName;

    if (props.domainEncryptionKey) {
      this.domainEncryptionKey = props.domainEncryptionKey;
    }

    this.validateProps();


    // Creae the CFN domain instance
    this.cfnDomain = new CfnDomain(this, 'Resource', {
      domainName: props.domainName,
    });

    if (props.domainEncryptionKey) {
      this.cfnDomain.addPropertyOverride('EncryptionKey', props.domainEncryptionKey);
    }

    this.domainName = this.cfnDomain.domainName;
    this.domainArn = this.cfnDomain.attrArn;
    this.domainOwner = this.cfnDomain.attrOwner;
    this.domainEncryptionKey = kms.Key.fromKeyArn(scope, 'EncryptionKey', this.cfnDomain.attrEncryptionKey);

    if (!props.policyDocument) {
      const p = props.principal || new iam.AccountRootPrincipal();
      this.grantLogin(p);
      this.grantCreate(p);
      this.grantRead(p);
    } else {
      this.cfnDomain.permissionsPolicyDocument = props.policyDocument;
    }
  }

  addRepositories(...repositories: IRepository[]): IDomain {
    if (repositories.length > 0) {
      repositories.forEach(r => r.assignDomain(this));
    }

    return this;
  }

  cfn(): CfnDomain {
    return this.cfnDomain;
  }

  private validateProps() {
    validate('DomainName',
      { required: true, minLength: 2, maxLength: 50, pattern: /[a-z][a-z0-9\-]{0,48}[a-z0-9]/gi, documentationLink: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-domain.html#cfn-codeartifact-domain-domainname' },
      this.domainName);

    validate('EncryptionKey',
      { minLength: 1, maxLength: 2048, pattern: /\S+/gi, documentationLink: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-domain.html#cfn-codeartifact-domain-encryptionkey' },
      this.domainEncryptionKey?.keyArn || '');
  }

  /**
   * Adds a statement to the IAM resource policy associated with this domain.
   */
  public addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult {

    if (!this.cfnDomain.permissionsPolicyDocument) {
      const p = this.cfnDomain.permissionsPolicyDocument as iam.PolicyDocument || new iam.PolicyDocument();

      p.addStatements(statement);

      this.cfnDomain.permissionsPolicyDocument = p;

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
     * Adds read actions for the principal to the domain's
     * resource policy
     * @param principal The principal for the policy
     * @see https://docs.aws.amazon.com/codeartifact/latest/ug/domain-policies.html
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