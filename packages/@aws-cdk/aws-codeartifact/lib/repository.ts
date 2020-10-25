import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import { IResource, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as actions from './actions';
import * as ca from './codeartifact.generated';
import * as e from './external-connection';
import { validate } from './validation';

/**
 * Represents a CodeArtifact repository
 */
export interface IRepository extends
  IResource {
  /**
     * The ARN of repository resource.
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
  readonly repositoryArn: string;

  /**
     * The physical name of the repository resource.
     * Often, equivalent to doing `{ 'Ref': 'LogicalId' }`
     * (but not always - depends on the particular resource modeled)
     * in CloudFormation.
     * Also needs to be annotated with '@attribute'.
     *
     * @attribute
     */
  readonly repositoryName: string;

  /**
     * A text description of the repository.
     * @attribute
     * @default ''
     */
  readonly repositoryDescription: string;

  /**
     * The domain repository owner
     * Often, equivalent to the account id.
     * @attribute
     */
  readonly repositoryDomainOwner: string;

  /**
     * The domain the repository belongs to
     * @attribute
     */
  readonly repositoryDomainName: string;

  /**
     * Grants the given IAM identity permissions to read from the repository
     */
  grantRead(identity: iam.IGrantable): iam.Grant;

  /**
     * Grants the given IAM identity permissions to write from the repository
     */
  grantWrite(identity: iam.IGrantable): iam.Grant;

  /**
     * Grants the given IAM identity permissions to read/write from the repository
     */
  grantReadWrite(identity: iam.IGrantable): iam.Grant;

  /**
     * Defines a CloudWatch event rule which triggers for repository events. Use
     * `rule.addEventPattern(pattern)` to specify a filter.
     */
  onEvent(id: string, options?: events.OnEventOptions): events.Rule;

  /**
     * Defines a CloudWatch event rule which triggers when a "CodeArtifact Package
     *  Version State Change" event occurs.
     */
  onPackageVersionStateChange(id: string, options?: events.OnEventOptions): events.Rule;
}

/**
 * Properties for a new CodeArtifact repository
 */
export interface RepositoryProps {
  /**
     * Name the repository
     */
  readonly repositoryName: string,
  /**
     * A text description of the repository.
     * @default ''
     */
  readonly description?: string,
  /**
     * The name of the domain that contains the repository.
     */
  readonly domainName: string,
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
  readonly externalConnections?: e.ExternalConnection[],
  /**
     * Principal to associate allow access to the repository
     * @default AccountRootPrincipal
     */
  readonly principal?: iam.IPrincipal
}

/**
 * Either a new or imported Repository
 */
export abstract class RepositoryBase extends Resource implements IRepository {

  /** @attribute */
  public abstract readonly repositoryArn: string = '';
  /** @attribute */
  public abstract readonly repositoryName: string = '';
  /** @attribute */
  public abstract readonly repositoryDescription: string = '';
  /** @attribute */
  public abstract readonly repositoryDomainOwner: string = '';
  /** @attribute */
  public abstract readonly repositoryDomainName: string = '';

  constructor(scope: Construct, id: string) {
    super(scope, id, {});
  }

  /** Implement the {@link IRepository.grantRead} method. */
  public grantRead(identity: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee: identity,
      actions: [...actions.readActions],
      resourceArns: [this.repositoryArn],
    });
  }

  /** Implement the {@link IRepository.grantWrite} method. */
  public grantWrite(identity: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee: identity,
      actions: [...actions.writeActions],
      resourceArns: [this.repositoryArn],
    });
  }

  /** Implement the {@link IRepository.grantReadWrite} method. */
  public grantReadWrite(identity: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee: identity,
      actions: [...actions.readActions, ...actions.writeActions],
      resourceArns: [this.repositoryArn],
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
}

/**
 * A new CodeArtifacft repository
 */
export class Repository extends RepositoryBase {
  /**
     * Import an existing Repository provided an ARN
     *
     * @param scope The parent creating construct
     * @param id The construct's name
     * @param repositoryArn repository ARN (i.e. arn:aws:codeartifact:us-east-2:444455556666:repository/my-domain/my-repo)
     */
  public static fromRepositoryArn(scope: Construct, id: string, repositoryArn: string): IRepository {
    const parsed = Stack.of(scope).parseArn(repositoryArn);
    const spl = parsed.resourceName?.split('/') || ['', ''];
    const repositoryName = spl[1];
    const domainName = spl[0];

    class Import extends RepositoryBase {
      public repositoryDescription: string = '';
      public repositoryName: string = repositoryName || '';
      public repositoryDomainOwner: string = parsed.account || '';
      public repositoryDomainName: string = domainName || '';
      public readonly repositoryArn = repositoryArn;
    }

    return new Import(scope, id);
  }

  public readonly repositoryArn: string;
  public readonly repositoryName: string;
  public readonly repositoryDomainOwner: string;
  public readonly repositoryDomainName: string;
  public readonly repositoryDescription: string;
  private readonly cfnRepository: ca.CfnRepository;

  constructor(scope: Construct, id: string, props: RepositoryProps) {
    super(scope, id);

    this.cfnRepository = new ca.CfnRepository(this, id, {
      repositoryName: props.repositoryName,
      description: props.description,
    });

    this.cfnRepository.addPropertyOverride('DomainName', props.domainName);

    this.repositoryName = props.repositoryName;
    this.repositoryDescription = props.description || '';
    this.repositoryArn = this.cfnRepository.attrArn;
    this.repositoryDomainOwner = this.cfnRepository.attrDomainOwner;
    this.repositoryDomainName = this.cfnRepository.attrDomainName;

    if (props.upstreams) {
      this.cfnRepository.upstreams = props.upstreams.map(u => u.repositoryName);
    }

    if (props.externalConnections) {
      this.withExternalConnections(...props.externalConnections || []);
    }

    this.Validate();

    // this.cfnRepository = policy.addPolicy(this.cfnRepository, new iam.AccountRootPrincipal(), [...sample.readActions, ...sample.writeActions]);
  }

  private Validate() {
    validate('Description', { maxLength: 1000, pattern: /\P{C}+/gi }, this.repositoryDescription);
    validate('DomainName', { required: true, minLength: 2, maxLength: 50, pattern: /[a-z][a-z0-9\-]{0,48}[a-z0-9]/gi }, this.repositoryDomainName);
    validate('RepositoryName', { required: true, minLength: 2, maxLength: 100, pattern: /[A-Za-z0-9][A-Za-z0-9._\-]{1,99}/gi }, this.repositoryName);
  }
  /**
     * External connections to pull from
     * @default None
     * @see https://docs.aws.amazon.com/codeartifact/latest/ug/external-connection.html#adding-an-external-connection
   */
  public withExternalConnections(...externalConnections: e.ExternalConnection[]): IRepository {
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
    this.cfnRepository.upstreams = repository.map(f => f.repositoryName);

    return this;
  }
}

