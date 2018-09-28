import actions = require('@aws-cdk/aws-codepipeline-api');
import events = require('@aws-cdk/aws-events');
import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './codecommit.generated';
import { CommonPipelineSourceActionProps, PipelineSourceAction } from './pipeline-action';

/**
 * Properties for the {@link RepositoryRef.import} method.
 */
export interface RepositoryRefProps {
  /**
   * The name of an existing CodeCommit Repository that we are referencing.
   * Must be in the same account and region as the root Stack.
   */
  repositoryName: string;
}

/**
 * Represents a reference to a CodeCommit Repository.
 *
 * If you want to create a new Repository managed alongside your CDK code,
 * use the {@link Repository} class.
 *
 * If you want to reference an already existing Repository,
 * use the {@link RepositoryRef.import} method.
 */
export abstract class RepositoryRef extends cdk.Construct {
  /**
   * Import a Repository defined either outside the CDK, or in a different Stack
   * (exported with the {@link export} method).
   *
   * @param parent the parent Construct for the Repository
   * @param name the name of the Repository Construct
   * @param props the properties used to identify the existing Repository
   * @returns a reference to the existing Repository
   */
  public static import(parent: cdk.Construct, name: string, props: RepositoryRefProps): RepositoryRef {
    return new ImportedRepositoryRef(parent, name, props);
  }

  /** The ARN of this Repository. */
  public abstract readonly repositoryArn: string;

  /** The human-visible name of this Repository. */
  public abstract readonly repositoryName: string;
  /** The HTTP clone URL */
  public abstract readonly repositoryCloneUrlHttp: string;
  /** The SSH clone URL */
  public abstract readonly repositoryCloneUrlSsh: string;

  /**
   * Exports this Repository. Allows the same Repository to be used in 2 different Stacks.
   *
   * @see import
   */
  public export(): RepositoryRefProps {
    return {
      repositoryName: new cdk.Output(this, 'RepositoryName', { value: this.repositoryName }).makeImportValue().toString()
    };
  }

  /**
   * Convenience method for creating a new {@link PipelineSourceAction},
   * and adding it to the given Stage.
   *
   * @param stage the Pipeline Stage to add the new Action to
   * @param name the name of the newly created Action
   * @param props the properties of the new Action
   * @returns the newly created {@link PipelineSourceAction}
   */
  public addToPipeline(stage: actions.IStage, name: string, props: CommonPipelineSourceActionProps): PipelineSourceAction {
    return new PipelineSourceAction(this.parent!, name, {
      stage,
      repository: this,
      ...props,
    });
  }

  /**
   * Defines a CloudWatch event rule which triggers for repository events. Use
   * `rule.addEventPattern(pattern)` to specify a filter.
   */
  public onEvent(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps) {
    const rule = new events.EventRule(this, name, options);
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
  public onStateChange(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps) {
    const rule = this.onEvent(name, target, options);
    rule.addEventPattern({
      detailType: [ 'CodeCommit Repository State Change' ],
    });
    return rule;
  }

  /**
   * Defines a CloudWatch event rule which triggers when a reference is
   * created (i.e. a new brach/tag is created) to the repository.
   */
  public onReferenceCreated(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps) {
    const rule = this.onStateChange(name, target, options);
    rule.addEventPattern({ detail: { event: [ 'referenceCreated' ] } });
    return rule;
  }

  /**
   * Defines a CloudWatch event rule which triggers when a reference is
   * updated (i.e. a commit is pushed to an existig branch) from the repository.
   */
  public onReferenceUpdated(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps) {
    const rule = this.onStateChange(name, target, options);
    rule.addEventPattern({ detail: { event: [ 'referenceUpdated' ] } });
    return rule;
  }

  /**
   * Defines a CloudWatch event rule which triggers when a reference is
   * delete (i.e. a branch/tag is deleted) from the repository.
   */
  public onReferenceDeleted(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps) {
    const rule = this.onStateChange(name, target, options);
    rule.addEventPattern({ detail: { event: [ 'referenceDeleted' ] } });
    return rule;
  }

  /**
   * Defines a CloudWatch event rule which triggers when a pull request state is changed.
   */
  public onPullRequestStateChange(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps) {
    const rule = this.onEvent(name, target, options);
    rule.addEventPattern({ detailType: [ 'CodeCommit Pull Request State Change' ] });
    return rule;
  }

  /**
   * Defines a CloudWatch event rule which triggers when a comment is made on a pull request.
   */
  public onCommentOnPullRequest(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps) {
    const rule = this.onEvent(name, target, options);
    rule.addEventPattern({ detailType: [ 'CodeCommit Comment on Pull Request' ] });
    return rule;
  }

  /**
   * Defines a CloudWatch event rule which triggers when a comment is made on a commit.
   */
  public onCommentOnCommit(name: string, target?: events.IEventRuleTarget, options?: events.EventRuleProps) {
    const rule = this.onEvent(name, target, options);
    rule.addEventPattern({ detailType: [ 'CodeCommit Comment on Commit' ] });
    return rule;
  }

  /**
   * Defines a CloudWatch event rule which triggers when a commit is pushed to a branch.
   * @param target The target of the event
   * @param branch The branch to monitor. Defaults to all branches.
   */
  public onCommit(name: string, target?: events.IEventRuleTarget, branch?: string) {
    const rule = this.onReferenceUpdated(name, target);
    if (branch) {
      rule.addEventPattern({ detail: { referenceName: [ branch ] }});
    }
    return rule;
  }
}

class ImportedRepositoryRef extends RepositoryRef {
  public readonly repositoryArn: string;
  public readonly repositoryName: string;

  constructor(parent: cdk.Construct, name: string, props: RepositoryRefProps) {
    super(parent, name);

    this.repositoryArn = cdk.ArnUtils.fromComponents({
      service: 'codecommit',
      resource: props.repositoryName,
    });
    this.repositoryName = props.repositoryName;
  }

  public get repositoryCloneUrlHttp() {
    return this.repositoryCloneUrl('https');
  }

  public get repositoryCloneUrlSsh() {
    return this.repositoryCloneUrl('ssh');
  }

  private repositoryCloneUrl(protocol: 'https' | 'ssh'): string {
    return new cdk.FnConcat(`${protocol}://git-codecommit.`,
                new cdk.AwsRegion(),
                '.',
                new cdk.AwsURLSuffix(),
                '/v1/repos/',
                this.repositoryName).toString();
  }
}

export interface RepositoryProps {
  /**
   * Name of the repository. This property is required for all repositories.
   */
  repositoryName: string;

  /**
   * A description of the repository. Use the description to identify the
   * purpose of the repository.
   */
  description?: string;
}

/**
 * Provides a CodeCommit Repository
 */
export class Repository extends RepositoryRef {
  private readonly repository: cloudformation.RepositoryResource;
  private readonly triggers = new Array<cloudformation.RepositoryResource.RepositoryTriggerProperty>();

  constructor(parent: cdk.Construct, name: string, props: RepositoryProps) {
    super(parent, name);

    this.repository = new cloudformation.RepositoryResource(this, 'Resource', {
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
      name = this.path + '/' + arn;
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
  name?: string;

  /**
   * The repository events for which AWS CodeCommit sends information to the
   * target, which you specified in the DestinationArn property.If you don't
   * specify events, the trigger runs for all repository events.
   */
  events?: RepositoryEventTrigger[];

  /**
   * The names of the branches in the AWS CodeCommit repository that contain
   * events that you want to include in the trigger. If you don't specify at
   * least one branch, the trigger applies to all branches.
   */
  branches?: string[];

  /**
   * When an event is triggered, additional information that AWS CodeCommit
   * includes when it sends information to the target.
   */
  customData?: string;
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
