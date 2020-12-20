import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import { Resource, Stack, Aws, Fn, Token, Annotations } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnRepository } from './codeartifact.generated';
import { ExternalConnection } from './external-connection';
import { IRepository, IDomain, RepositoryAttributes } from './interfaces';
import { REPOSITORY_READ_ACTIONS, REPOSITORY_WRITE_ACTIONS } from './perms';
import { validate } from './validation';

/**
 * Properties for a new CodeArtifact repository
 * @experimental
 */
export interface RepositoryProps {
  /**
     * Name the repository
     * @default AWS Unique id
     */
  readonly repositoryName?: string,
  /**
     * A text description of the repository.
     * @default ''
     */
  readonly description?: string,
  /**
     * The name of the domain that contains the repository.
     * @attribute
     * @default None
     */
  readonly domain: IDomain,
  /**
     * Upstream repositories for the repository
     * @see https://docs.aws.amazon.com/codeartifact/latest/ug/repos-upstream.html
     * @default None
     */
  readonly upstreams?: IRepository[],
  /**
     * An array of external connections associated with the repository.
     * @default None
     * @see https://docs.aws.amazon.com/codeartifact/latest/ug/external-connection.html#adding-an-external-connection
     */
  readonly externalConnections?: ExternalConnection[],

  /**
     * Principal to associate allow access to the repository
     * @default AccountRootPrincipal
     */
  readonly principal?: iam.IPrincipal

  /**
   * Principal to associate allow access to the repository
   * @default Read/Write
   */
  readonly policyDocument?: iam.PolicyDocument
}

/**
 * Properties for a new CodeArtifact repository policy restricting package manipulation
 * @experimental
 */
export interface PolicyRepositoryPackage {
  /**
     * Package format
     */
  readonly packageFormat: string,
  /**
     * Package namespace
     */
  readonly packageNamespace: string,
  /**
     * Package name
     */
  readonly packageName: string,
}

/**
 * A new CodeArtifacft repository
 * @experimental
 */
export class Repository extends Resource implements IRepository {
  /**
     * Import an existing Repository provided an ARN
     *
     * @param scope The parent creating construct
     * @param id The construct's name
     * @param repositoryArn repository ARN (i.e. arn:aws:codeartifact:us-east-2:444455556666:repository/my-domain/my-repo)
     */
  public static fromRepositoryArn(scope: Construct, id: string, repositoryArn: string): IRepository {
    return Repository.fromRepositoryAttributes(scope, id, { repositoryArn: repositoryArn });
  }

  /**
   * Import an existing repository
   */
  public static fromRepositoryAttributes(scope: Construct, id: string, attrs: RepositoryAttributes): IRepository {
    const stack = Stack.of(scope);
    const parsed = stack.parseArn(attrs.repositoryArn ?? '');

    if (Token.isUnresolved(attrs.repositoryArn)) {
      throw new Error(`'repositoryArn' must resolve, got: '${attrs.repositoryArn}'`);
    }

    const spl = Fn.split('/', parsed.resourceName ?? '');
    const domainName = Fn.select(0, spl);
    const repositoryName = Fn.select(1, spl);

    if (!repositoryName || repositoryName == '') {
      throw new Error('\'RepositoryName\' is required and cannot be empty');
    }

    if (!domainName || domainName == '') {
      throw new Error('Domain name is required with the ARN');
    }

    class Import extends Resource implements IRepository {
      repositoryDescription?: string | undefined;
      repositoryDomainName?: string | undefined;
      repositoryArn = attrs.repositoryArn;
      repositoryName = repositoryName as string;
      repositoryDomainOwner = parsed.account ?? '';

      grantFactory(operation: string, _identity: iam.IGrantable): iam.Grant {
        Annotations.of(this).addWarning(`${operation} is a no-op`);
        return iam.Grant.drop(_identity, 'no-op');
      }

      grantRead(_identity: iam.IGrantable): iam.Grant { return this.grantFactory('grantRead', _identity); };

      grantWrite(_identity: iam.IGrantable): iam.Grant { return this.grantFactory('grantWrite', _identity); };

      grantReadWrite(_identity: iam.IGrantable): iam.Grant { return this.grantFactory('grantReadWrite', _identity); };

      onEvent(_id: string, _options?: events.OnEventOptions | undefined): events.Rule {
        return Repository._onEvent(this, _id, this, _options);
      }

      onPackageVersionStateChange(_id: string, _options?: events.OnEventOptions | undefined): events.Rule {
        return Repository._onPackageVersionStateChange(this, _id, this, _options);
      }

      assignDomain(_domain: IDomain): void {
        Annotations.of(this).addWarning('assignDomain is a no-op');
        this.repositoryDomainName = _domain.domainName;
        this.repositoryDomainOwner = _domain.domainOwner ?? '';
      }
    }

    const instance = new Import(scope, id);
    instance.repositoryName = repositoryName;
    instance.repositoryDomainName = domainName;
    instance.repositoryDomainOwner = parsed.account || '';

    return instance;
  }

  /**
     * Defines a CloudWatch event rule which triggers for repository events. Use
     * `rule.addEventPattern(pattern)` to specify a filter.
     */
  private static _onEvent(scope : Resource, id: string, context : IRepository, options: events.OnEventOptions = {}) {
    const rule = new events.Rule(scope, id, options);
    rule.addEventPattern({
      source: ['aws.codeartifact'],
      detail: {
        domainName: [context.repositoryDomainName],
        domainOwner: [context.repositoryDomainOwner],
        repositoryName: [context.repositoryName],
      },
    });
    rule.addTarget(options.target);
    return rule;
  }

  /**
     * Defines a CloudWatch event rule which triggers when a "CodeArtifact Package
     *  Version State Change" event occurs.
     */
  private static _onPackageVersionStateChange(scope : Resource, id: string, context : IRepository, options: events.OnEventOptions = {}): events.Rule {
    const rule = Repository._onEvent(scope, id, context, options);
    rule.addEventPattern({
      detailType: ['CodeArtifact Package Version State Change'],
    });
    return rule;
  }

  public readonly repositoryArn?: string;
  public readonly repositoryName: string;
  public readonly repositoryNameAttr?: string;
  public readonly repositoryDomainOwner?: string;
  public readonly repositoryDomainName?: string;
  public readonly repositoryDescription?: string;
  private readonly cfnRepository: CfnRepository;

  constructor(scope: Construct, id: string, props: RepositoryProps) {
    super(scope, id, {});

    const repositoryDomainName = props?.domain?.domainNameAttr;
    const repositoryName = props.repositoryName ?? this.node.uniqueId;
    const repositoryDescription = props.description;

    this.validateProps(repositoryName, repositoryDomainName, repositoryDescription);

    this.cfnRepository = new CfnRepository(this, id, {
      domainName: repositoryDomainName ?? '', //this is required but need coalesce. The validation will catch this.
      repositoryName: repositoryName,
      description: repositoryDescription,
      upstreams: props.upstreams?.map(u => u.repositoryName),
      externalConnections: props.externalConnections,
    });

    if (props.upstreams) {
      props.upstreams.forEach(u => this.node.addDependency(u));
    }

    this.repositoryArn = this.cfnRepository.attrArn;
    this.repositoryName = repositoryName;
    this.repositoryNameAttr = this.cfnRepository.attrName;
    this.repositoryDomainOwner = this.cfnRepository.attrDomainOwner;
    this.repositoryDomainName = this.cfnRepository.attrDomainName;
    this.repositoryDescription = this.cfnRepository.description;

    if (!props.policyDocument) {
      const p = props.principal || new iam.AccountRootPrincipal();
      this.allowReadFromRepository(p).allowWriteToRepository(p);
    } else {
      this.cfnRepository.permissionsPolicyDocument = props.policyDocument;
    }
  }

  /**
   * Assign the repository to a domain
   * @param domain The domain the repository will be assigned to
   */
  public assignDomain(domain: IDomain): void {
    // This should be added to the L1 props soon, but until then this is required to create a Repository
    // this.cfnRepository.node.addDependency(domain);

    this.cfnRepository.domainName = domain.domainNameAttr ?? '';
  }

  /**
   * Adds a statement to the IAM resource policy associated with this repository.
   */
  public addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult {

    if (!this.cfnRepository.permissionsPolicyDocument) {
      const p = this.cfnRepository.permissionsPolicyDocument as iam.PolicyDocument || new iam.PolicyDocument();

      p.addStatements(statement);

      this.cfnRepository.permissionsPolicyDocument = p;

      return { statementAdded: true, policyDependable: p };
    }

    return { statementAdded: false };
  }

  public grantRead(identity: iam.IGrantable): iam.Grant {
    return this.grant(identity, [...REPOSITORY_READ_ACTIONS]);
  }

  public grantWrite(identity: iam.IGrantable): iam.Grant {
    return this.grant(identity, [...REPOSITORY_WRITE_ACTIONS]);
  }

  public grantReadWrite(identity: iam.IGrantable): iam.Grant {
    return this.grant(identity, [...REPOSITORY_READ_ACTIONS, ...REPOSITORY_WRITE_ACTIONS]);
  }

  private grant(identity: iam.IGrantable, actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipalOrResource({
      grantee: identity,
      actions: actions,
      resourceArns: [this.repositoryArn || ''],
      resource: this,
    });
  }

  /**
     * Defines a CloudWatch event rule which triggers for repository events. Use
     * `rule.addEventPattern(pattern)` to specify a filter.
     */
  public onEvent(id: string, options: events.OnEventOptions = {}) {
    const rule = new events.Rule(this, id, options);
    rule.addEventPattern({
      source: ['aws.codeartifact'],
      detail: {
        domainName: [this.repositoryDomainName],
        domainOwner: [this.repositoryDomainOwner],
        repositoryName: [this.repositoryName],
      },
    });
    rule.addTarget(options.target);
    return rule;
  }

  /**
     * Defines a CloudWatch event rule which triggers when a "CodeArtifact Package
     *  Version State Change" event occurs.
     */
  public onPackageVersionStateChange(id: string, options: events.OnEventOptions = {}): events.Rule {
    const rule = this.onEvent(id, options);
    rule.addEventPattern({
      detailType: ['CodeArtifact Package Version State Change'],
    });
    return rule;
  }

  private validateProps(repositoryName : string, repositoryDomainName? : string, repositoryDescription? : string) {
    validate('Description',
      { maxLength: 1000, pattern: /\P{C}+/gi, documentationLink: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-description' },
      repositoryDescription);

    validate('DomainName',
      { required: true, minLength: 2, maxLength: 50, pattern: /[a-z][a-z0-9\-]{0,48}[a-z0-9]/gi, documentationLink: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-domainname' },
      repositoryDomainName);

    validate('RepositoryName',
      { required: true, minLength: 2, maxLength: 100, pattern: /[A-Za-z0-9][A-Za-z0-9._\-]{1,99}/gi, documentationLink: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codeartifact-repository.html#cfn-codeartifact-repository-repositoryname' },
      repositoryName);
  }

  private createPolicy(principal: iam.IPrincipal, iamActions: string[], resource: string = '*') {
    const p = this.cfnRepository.permissionsPolicyDocument as iam.PolicyDocument || new iam.PolicyDocument();

    p.addStatements(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [
        principal,
      ],
      resources: [resource],
      actions: iamActions,
    }));

    this.cfnRepository.permissionsPolicyDocument = p;
  }

  /**
     * Adds read actions for the principal to the repository's
     * resource policy
     * @param principal The principal for the policy
     * @see https://docs.aws.amazon.com/codeartifact/latest/ug/repo-policies.html
     */
  public allowReadFromRepository(principal: iam.IPrincipal): Repository {
    this.createPolicy(principal,
      ['codeartifact:DescribePackageVersion',
        'codeartifact:DescribeRepository',
        'codeartifact:GetPackageVersionReadme',
        'codeartifact:GetRepositoryEndpoint',
        'codeartifact:ListPackageVersionAssets',
        'codeartifact:ListPackageVersionDependencies',
        'codeartifact:ListPackageVersions',
        'codeartifact:ListPackages',
        'codeartifact:ReadFromRepository'],
    );
    return this;
  }

  /**
     * Allows PublishPackageVersion and PutPackageMetadata only for the package and namespace
     * when acted upon by the principal.
     * @param principal The principal for the policy
     * @see https://docs.aws.amazon.com/codeartifact/latest/ug/repo-policies.html
     */
  public allowWriteToRepositoryPackage(principal: iam.IPrincipal, repositoryPackage: PolicyRepositoryPackage): Repository {
    this.allowWriteToRepository(principal,
      `arn:aws:codeartifact:${Aws.REGION}:${this.repositoryDomainOwner}:package/${this.repositoryDomainName}/${this.repositoryName}/${repositoryPackage.packageFormat}/${repositoryPackage.packageNamespace}/${repositoryPackage.packageName}`,
    );
    return this;
  }

  /**
     * Adds PublishPackageVersion and PutPackageMetadata for the principal to the repository's
     * resource policy
     * @param principal The principal for the policy
     * @see https://docs.aws.amazon.com/codeartifact/latest/ug/repo-policies.html
     */
  public allowWriteToRepository(principal: iam.IPrincipal, resource: string = '*'): Repository {
    this.createPolicy(principal,
      ['codeartifact:PublishPackageVersion',
        'codeartifact:PutPackageMetadata'],
      resource,
    );
    return this;
  }
  /**
     * Adds DeletePacakgeVersion for the principal to the repository's
     * resource policy
     * @param principal The principal for the policy
     * @see https://docs.aws.amazon.com/codeartifact/latest/ug/repo-policies.html
     */
  public allowDeleteFromRepository(principal: iam.IPrincipal): Repository {
    this.createPolicy(principal,
      ['codeartifact:DeletePackageVersion'],
    );
    return this;
  }

  /**
     * External connections to pull from
     * @default None
     * @see https://docs.aws.amazon.com/codeartifact/latest/ug/external-connection.html#adding-an-external-connection
   */
  public withExternalConnections(...externalConnections: ExternalConnection[]): IRepository {
    if (externalConnections.length) {
      this.cfnRepository.externalConnections = externalConnections;
    }

    return this;
  }

  /**
     * Add upstream repository to the repository
     * @param repository The upstream repository
     * @see https://docs.aws.amazon.com/codeartifact/latest/ug/repos-upstream.html
     */
  public withUpstream(...repository: IRepository[]): IRepository {
    this.cfnRepository.upstreams = repository.map(f => f.repositoryName || '');

    return this;
  }
}

