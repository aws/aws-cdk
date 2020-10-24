import * as iam from '@aws-cdk/aws-iam';
import * as core from '@aws-cdk/core';
import * as actions from './actions';
import * as ca from './codeartifact.generated';
import * as d from './domain';
import * as e from './external-connection';

export interface IRepository extends
  // all L2 interfaces need to extend IResource
  core.IResource {
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
   * Grants the given IAM identity permissions to read from the repository
   */
  grantRead(identity: iam.IGrantable): iam.Grant;

  /**
   * Grants the given IAM identity permissions to write from the repository
   */
  grantWrite(identity: iam.IGrantable): iam.Grant;

  /**
   * Add external connections to the repository
   */
  grantReadWrite(identity: iam.IGrantable): iam.Grant;

  withExternalConnections(externalConnections: e.ExternalConnection[]): IRepository;
  /**
   * Add upstream repository to the repository
   */
  withUpstream(repository: IRepository): IRepository;
}

export interface IRepositoryProps {
  name: string,
  domain: d.IDomain,
  upstreams? : IRepository[],
  externalConnections? : e.ExternalConnection[],
  principal?: iam.IPrincipal
}


abstract class RepositoryBase extends core.Resource implements IRepository {

  readonly repositoryArn: string = '';
  readonly repositoryName: string = '';
  protected cfnRepository : ca.CfnRepository;

  constructor(scope: core.Construct, id: string, props: IRepositoryProps) {
    super(scope, id, {});

    this.cfnRepository = new ca.CfnRepository(this, id, {
      repositoryName: props.name,
    });

    this.cfnRepository.addPropertyOverride('DomainName', props.domain.domainName);

    this.repositoryName = this.cfnRepository.attrName;
    this.repositoryArn = this.cfnRepository.attrArn;
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

  /** Implement the {@link IRepository.withExternalConnections} method. */
  public withExternalConnections(externalConnections: e.ExternalConnection[]): IRepository {
    if (externalConnections.length) {
      this.cfnRepository.externalConnections = externalConnections;
    }

    return this;
  }

  /** Implement the {@link IRepository.withUpstream} method. */
  public withUpstream(repository: IRepository): IRepository {
    this.cfnRepository.upstreams = [repository.repositoryName];

    return this;
  }
}

export class Repository extends RepositoryBase {
  constructor(scope: core.Construct, id: string, props: IRepositoryProps) {
    super(scope, id, props);

    if (props.upstreams) {
      this.cfnRepository.upstreams = props.upstreams.map(u => u.repositoryName);
    }

    if (props.externalConnections) {
      this.withExternalConnections(props.externalConnections || []);
    }

    // this.cfnRepository = policy.addPolicy(this.cfnRepository, new iam.AccountRootPrincipal(), [...sample.readActions, ...sample.writeActions]);
  }
}