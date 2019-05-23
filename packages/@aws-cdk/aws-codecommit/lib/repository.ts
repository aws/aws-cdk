import events = require('@aws-cdk/aws-events');
import { Construct, IConstruct, IResource, Resource, Stack } from '@aws-cdk/cdk';
import { CfnRepository } from './codecommit.generated';

export interface IRepository extends IResource {
  /**
   * The ARN of this Repository.
   * @attribute
   */
  readonly repositoryArn: string;

  /**
   * The human-visible name of this Repository.
   * @attribute
   */
  readonly repositoryName: string;

  /**
   * The HTTP clone URL
   * @attribute
   */
  readonly repositoryCloneUrlHttp: string;

  /**
   * The SSH clone URL
   * @attribute
   */
  readonly repositoryCloneUrlSsh: string;

  /**
   * Defines a CloudWatch event rule which triggers for repository events. Use
   * `rule.addEventPattern(pattern)` to specify a filter.
   */
  onEvent(name: string, target?: events.IRuleTarget, options?: events.RuleProps): events.Rule;

  /**
   * Defines a CloudWatch event rule which triggers when a "CodeCommit
   * Repository State Change" event occurs.
   */
  onStateChange(name: string, target?: events.IRuleTarget, options?: events.RuleProps): events.Rule;

  /**
   * Defines a CloudWatch event rule which triggers when a reference is
   * created (i.e. a new branch/tag is created) to the repository.
   */
  onReferenceCreated(name: string, target?: events.IRuleTarget, options?: events.RuleProps): events.Rule;

  /**
   * Defines a CloudWatch event rule which triggers when a reference is
   * updated (i.e. a commit is pushed to an existing or new branch) from the repository.
   */
  onReferenceUpdated(name: string, target?: events.IRuleTarget, options?: events.RuleProps): events.Rule;

  /**
   * Defines a CloudWatch event rule which triggers when a reference is
   * delete (i.e. a branch/tag is deleted) from the repository.
   */
  onReferenceDeleted(name: string, target?: events.IRuleTarget, options?: events.RuleProps): events.Rule;

  /**
   * Defines a CloudWatch event rule which triggers when a pull request state is changed.
   */
  onPullRequestStateChange(name: string, target?: events.IRuleTarget, options?: events.RuleProps): events.Rule;

  /**
   * Defines a CloudWatch event rule which triggers when a comment is made on a pull request.
   */
  onCommentOnPullRequest(name: string, target?: events.IRuleTarget, options?: events.RuleProps): events.Rule;

  /**
   * Defines a CloudWatch event rule which triggers when a comment is made on a commit.
   */
  onCommentOnCommit(name: string, target?: events.IRuleTarget, options?: events.RuleProps): events.Rule;

  /**
   * Defines a CloudWatch event rule which triggers when a commit is pushed to a branch.
   * @param target The target of the event
   * @param branch The branch to monitor. Defaults to all branches.
   */
  onCommit(name: string, target?: events.IRuleTarget, branch?: string): events.Rule;
}

/**
 * Represents a reference to a CodeCommit Repository.
 *
 * If you want to create a new Repository managed alongside your CDK code,
 * use the {@link Repository} class.
 *
 * If you want to reference an already existing Repository,
 * use the {@link Repository.import} method.
 */
abstract class RepositoryBase extends Resource implements IRepository {
  /** The ARN of this Repository. */
  public abstract readonly repositoryArn: string;

  /** The human-visible name of this Repository. */
  public abstract readonly repositoryName: string;

  /** The HTTP clone URL */
  public abstract readonly repositoryCloneUrlHttp: string;

  /** The SSH clone URL */
  public abstract readonly repositoryCloneUrlSsh: string;

  /**
   * Defines a CloudWatch event rule which triggers for repository events. Use
   * `rule.addEventPattern(pattern)` to specify a filter.
   */
  public onEvent(name: string, target?: events.IRuleTarget, options?: events.RuleProps) {
    const rule = new events.Rule(this, name, options);
    rule.addEventPattern({
      source: [ 'aws.codecommit' ],
      resources: [ this.repositoryArn ]
    });
    rule.addTarget(target);
    return rule;
  }

  /**
   * Defines a CloudWatch event rule which triggers when a "CodeCommit
   * Repository State Change" event occurs.
   */
  public onStateChange(name: string, target?: events.IRuleTarget, options?: events.RuleProps) {
    const rule = this.onEvent(name, target, options);
    rule.addEventPattern({
      detailType: [ 'CodeCommit Repository State Change' ],
    });
    return rule;
  }

  /**
   * Defines a CloudWatch event rule which triggers when a reference is
   * created (i.e. a new branch/tag is created) to the repository.
   */
  public onReferenceCreated(name: string, target?: events.IRuleTarget, options?: events.RuleProps) {
    const rule = this.onStateChange(name, target, options);
    rule.addEventPattern({ detail: { event: [ 'referenceCreated' ] } });
    return rule;
  }

  /**
   * Defines a CloudWatch event rule which triggers when a reference is
   * updated (i.e. a commit is pushed to an existing or new branch) from the repository.
   */
  public onReferenceUpdated(name: string, target?: events.IRuleTarget, options?: events.RuleProps) {
    const rule = this.onStateChange(name, target, options);
    rule.addEventPattern({ detail: { event: [ 'referenceCreated', 'referenceUpdated' ] } });
    return rule;
  }

  /**
   * Defines a CloudWatch event rule which triggers when a reference is
   * delete (i.e. a branch/tag is deleted) from the repository.
   */
  public onReferenceDeleted(name: string, target?: events.IRuleTarget, options?: events.RuleProps) {
    const rule = this.onStateChange(name, target, options);
    rule.addEventPattern({ detail: { event: [ 'referenceDeleted' ] } });
    return rule;
  }

  /**
   * Defines a CloudWatch event rule which triggers when a pull request state is changed.
   */
  public onPullRequestStateChange(name: string, target?: events.IRuleTarget, options?: events.RuleProps) {
    const rule = this.onEvent(name, target, options);
    rule.addEventPattern({ detailType: [ 'CodeCommit Pull Request State Change' ] });
    return rule;
  }

  /**
   * Defines a CloudWatch event rule which triggers when a comment is made on a pull request.
   */
  public onCommentOnPullRequest(name: string, target?: events.IRuleTarget, options?: events.RuleProps) {
    const rule = this.onEvent(name, target, options);
    rule.addEventPattern({ detailType: [ 'CodeCommit Comment on Pull Request' ] });
    return rule;
  }

  /**
   * Defines a CloudWatch event rule which triggers when a comment is made on a commit.
   */
  public onCommentOnCommit(name: string, target?: events.IRuleTarget, options?: events.RuleProps) {
    const rule = this.onEvent(name, target, options);
    rule.addEventPattern({ detailType: [ 'CodeCommit Comment on Commit' ] });
    return rule;
  }

  /**
   * Defines a CloudWatch event rule which triggers when a commit is pushed to a branch.
   * @param target The target of the event
   * @param branch The branch to monitor. Defaults to all branches.
   */
  public onCommit(name: string, target?: events.IRuleTarget, branch?: string) {
    const rule = this.onReferenceUpdated(name, target);
    if (branch) {
      rule.addEventPattern({ detail: { referenceName: [ branch ] }});
    }
    return rule;
  }
}

export interface RepositoryProps {
  /**
   * Name of the repository. This property is required for all repositories.
   */
  readonly repositoryName: string;

  /**
   * A description of the repository. Use the description to identify the
   * purpose of the repository.
   *
   * @default - No description.
   */
  readonly description?: string;
}

/**
 * Provides a CodeCommit Repository
 */
export class Repository extends RepositoryBase {

  /**
   * Imports a codecommit repository.
   * @param repositoryArn (e.g. `arn:aws:codecommit:us-east-1:123456789012:MyDemoRepo`)
   */
  public static fromRepositoryArn(scope: Construct, id: string, repositoryArn: string): IRepository {
    const stack = scope.node.stack;
    const repositoryName = stack.parseArn(repositoryArn).resource;

    class Import extends RepositoryBase {
      public readonly repositoryArn = repositoryArn;
      public readonly repositoryName = repositoryName;
      public readonly repositoryCloneUrlHttp = Repository.makeCloneUrl(stack, repositoryName, 'https');
      public readonly repositoryCloneUrlSsh = Repository.makeCloneUrl(stack, repositoryName, 'ssh');
    }

    return new Import(scope, id);
  }

  public static fromRepositoryName(scope: Construct, id: string, repositoryName: string): IRepository {
    const stack = scope.node.stack;

    class Import extends RepositoryBase {
      public repositoryName = repositoryName;
      public repositoryArn = Repository.arnForLocalRepository(repositoryName, scope);
      public readonly repositoryCloneUrlHttp = Repository.makeCloneUrl(stack, repositoryName, 'https');
      public readonly repositoryCloneUrlSsh = Repository.makeCloneUrl(stack, repositoryName, 'ssh');
    }

    return new Import(scope, id);
  }

  private static makeCloneUrl(stack: Stack, repositoryName: string, protocol: 'https' | 'ssh') {
    return `${protocol}://git-codecommit.${stack.region}.${stack.urlSuffix}/v1/repos/${repositoryName}`;
  }

  private static arnForLocalRepository(repositoryName: string, scope: IConstruct): string {
    return scope.node.stack.formatArn({
      service: 'codecommit',
      resource: repositoryName,
    });
  }

  private readonly repository: CfnRepository;
  private readonly triggers = new Array<CfnRepository.RepositoryTriggerProperty>();

  constructor(scope: Construct, id: string, props: RepositoryProps) {
    super(scope, id);

    this.repository = new CfnRepository(this, 'Resource', {
      repositoryName: props.repositoryName,
      repositoryDescription: props.description,
      triggers: this.triggers
    });
  }

  public get repositoryArn() {
    return this.repository.repositoryArn;
  }

  public get repositoryCloneUrlHttp() {
    return this.repository.repositoryCloneUrlHttp;
  }

  public get repositoryCloneUrlSsh() {
    return this.repository.repositoryCloneUrlSsh;
  }

  public get repositoryName() {
    return this.repository.repositoryName;
  }

  /**
   * Create a trigger to notify another service to run actions on repository events.
   * @param arn   Arn of the resource that repository events will notify
   * @param options Trigger options to run actions
   */
  public notify(arn: string, options?: RepositoryTriggerOptions): Repository {

    let evt = options && options.events;
    if (evt && evt.length > 1 && evt.indexOf(RepositoryEventTrigger.All) > -1) {
      evt = [RepositoryEventTrigger.All];
    }

    const customData = options && options.customData;
    const branches = options && options.branches;

    let name = options && options.name;
    if (!name) {
      name = this.node.path + '/' + arn;
    }

    if (this.triggers.find(prop => prop.name === name)) {
      throw new Error(`Unable to set repository trigger named ${name} because trigger names must be unique`);
    }

    this.triggers.push({
      destinationArn: arn,
      name,
      customData,
      branches,
      events: evt || [RepositoryEventTrigger.All],
    });
    return this;
  }
}

/**
 * Creates for a repository trigger to an SNS topic or Lambda function.
 */
export interface RepositoryTriggerOptions {
   /**
    * A name for the trigger.Triggers on a repository must have unique names
    */
  readonly name?: string;

  /**
   * The repository events for which AWS CodeCommit sends information to the
   * target, which you specified in the DestinationArn property.If you don't
   * specify events, the trigger runs for all repository events.
   */
  readonly events?: RepositoryEventTrigger[];

  /**
   * The names of the branches in the AWS CodeCommit repository that contain
   * events that you want to include in the trigger. If you don't specify at
   * least one branch, the trigger applies to all branches.
   */
  readonly branches?: string[];

  /**
   * When an event is triggered, additional information that AWS CodeCommit
   * includes when it sends information to the target.
   */
  readonly customData?: string;
}

/**
 * Repository events that will cause the trigger to run actions in another service.
 */
export enum RepositoryEventTrigger {
  All = 'all',
  UpdateRef = 'updateReference',
  CreateRef = 'createReference',
  DeleteRef = 'deleteReference'
}
