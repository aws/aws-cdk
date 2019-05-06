import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import { Construct, DeletionPolicy, IConstruct, IResource, Resource, Token } from '@aws-cdk/cdk';
import { CfnRepository } from './ecr.generated';
import { CountType, LifecycleRule, TagStatus } from './lifecycle';

/**
 * Represents an ECR repository.
 */
export interface IRepository extends IResource {
  /**
   * The name of the repository
   * @attribute
   */
  readonly repositoryName: string;

  /**
   * The ARN of the repository
   * @attribute
   */
  readonly repositoryArn: string;

  /**
   * The URI of this repository (represents the latest image):
   *
   *    ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY
   *
   * @attribute
   */
  readonly repositoryUri: string;

  /**
   * Returns the URI of the repository for a certain tag. Can be used in `docker push/pull`.
   *
   *    ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY[:TAG]
   *
   * @param tag Image tag to use (tools usually default to "latest" if omitted)
   */
  repositoryUriForTag(tag?: string): string;

  /**
   * Add a policy statement to the repository's resource policy
   */
  addToResourcePolicy(statement: iam.PolicyStatement): void;

  /**
   * Grant the given principal identity permissions to perform the actions on this repository
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grant the given identity permissions to pull images in this repository.
   */
  grantPull(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant the given identity permissions to pull and push images to this repository.
   */
  grantPullPush(grantee: iam.IGrantable): iam.Grant;

  /**
   * Defines an AWS CloudWatch event rule that can trigger a target when an image is pushed to this
   * repository.
   * @param name The name of the rule
   * @param target An IEventRuleTarget to invoke when this event happens (you can add more targets using `addTarget`)
   * @param imageTag Only trigger on the specific image tag
   */
  onImagePushed(name: string, target?: events.IEventRuleTarget, imageTag?: string): events.EventRule;
}

/**
 * Base class for ECR repository. Reused between imported repositories and owned repositories.
 */
export abstract class RepositoryBase extends Resource implements IRepository {
  /**
   * The name of the repository
   */
  public abstract readonly repositoryName: string;

  /**
   * The ARN of the repository
   */
  public abstract readonly repositoryArn: string;

  /**
   * Add a policy statement to the repository's resource policy
   */
  public abstract addToResourcePolicy(statement: iam.PolicyStatement): void;

  /**
   * The URI of this repository (represents the latest image):
   *
   *    ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY
   *
   */
  public get repositoryUri() {
    return this.repositoryUriForTag();
  }

  /**
   * Returns the URL of the repository. Can be used in `docker push/pull`.
   *
   *    ACCOUNT.dkr.ecr.REGION.amazonaws.com/REPOSITORY[:TAG]
   *
   * @param tag Optional image tag
   */
  public repositoryUriForTag(tag?: string): string {
    const tagSuffix = tag ? `:${tag}` : '';
    const parts = this.node.stack.parseArn(this.repositoryArn);
    return `${parts.account}.dkr.ecr.${parts.region}.amazonaws.com/${this.repositoryName}${tagSuffix}`;
  }

  /**
   * Defines an AWS CloudWatch event rule that can trigger a target when an image is pushed to this
   * repository.
   * @param name The name of the rule
   * @param target An IEventRuleTarget to invoke when this event happens (you can add more targets using `addTarget`)
   * @param imageTag Only trigger on the specific image tag
   */
  public onImagePushed(name: string, target?: events.IEventRuleTarget, imageTag?: string): events.EventRule {
    return new events.EventRule(this, name, {
      targets: target ? [target] : undefined,
      eventPattern: {
        source: ['aws.ecr'],
        detail: {
          eventName: [
            'PutImage',
          ],
          requestParameters: {
            repositoryName: [
              this.repositoryName,
            ],
            imageTag: imageTag ? [imageTag] : undefined,
          },
        },
      },
    });
  }

  /**
   * Grant the given principal identity permissions to perform the actions on this repository
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]) {
    return iam.Grant.addToPrincipalOrResource({
      grantee,
      actions,
      resourceArns: [this.repositoryArn],
      resource: this,
    });
  }

  /**
   * Grant the given identity permissions to use the images in this repository
   */
  public grantPull(grantee: iam.IGrantable) {
    const ret = this.grant(grantee, "ecr:BatchCheckLayerAvailability", "ecr:GetDownloadUrlForLayer", "ecr:BatchGetImage");

    iam.Grant.addToPrincipal({
      grantee,
      actions: ["ecr:GetAuthorizationToken"],
      resourceArns: ['*'],
      scope: this,
    });

    return ret;
  }

  /**
   * Grant the given identity permissions to pull and push images to this repository.
   */
  public grantPullPush(grantee: iam.IGrantable) {
    this.grantPull(grantee);
    return this.grant(grantee,
      "ecr:PutImage",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload");
  }
}

export interface RepositoryProps {
  /**
   * Name for this repository
   *
   * @default Automatically generated name.
   */
  readonly repositoryName?: string;

  /**
   * Life cycle rules to apply to this registry
   *
   * @default No life cycle rules
   */
  readonly lifecycleRules?: LifecycleRule[];

  /**
   * The AWS account ID associated with the registry that contains the repository.
   *
   * @see https://docs.aws.amazon.com/AmazonECR/latest/APIReference/API_PutLifecyclePolicy.html
   * @default The default registry is assumed.
   */
  readonly lifecycleRegistryId?: string;

  /**
   * Retain the repository on stack deletion
   *
   * If you don't set this to true, the registry must be empty, otherwise
   * your stack deletion will fail.
   *
   * @default false
   */
  readonly retain?: boolean;
}

export interface RepositoryAttributes {
  readonly repositoryName: string;
  readonly repositoryArn: string;
}

/**
 * Define an ECR repository
 */
export class Repository extends RepositoryBase {
  /**
   * Import a repository
   */
  public static fromRepositoryAttributes(scope: Construct, id: string, attrs: RepositoryAttributes): IRepository {
    class Import extends RepositoryBase {
      public readonly repositoryName = attrs.repositoryName;
      public readonly repositoryArn = attrs.repositoryArn;

      public addToResourcePolicy(_statement: iam.PolicyStatement) {
        // dropped
      }
    }

    return new Import(scope, id);
  }

  public static fromRepositoryArn(scope: Construct, id: string, repositoryArn: string): IRepository {

    // if repositoryArn is a token, the repository name is also required. this is because
    // repository names can include "/" (e.g. foo/bar/myrepo) and it is impossible to
    // parse the name from an ARN using CloudFormation's split/select.
    if (Token.unresolved(repositoryArn)) {
      throw new Error('"repositoryArn" is a late-bound value, and therefore "repositoryName" is required. Use `fromRepositoryAttributes` instead');
    }

    const repositoryName = repositoryArn.split('/').slice(1).join('/');

    class Import extends RepositoryBase {
      public repositoryName = repositoryName;
      public repositoryArn = repositoryArn;

      public addToResourcePolicy(_statement: iam.PolicyStatement): void {
        // dropped
      }
    }

    return new Import(scope, id);
  }

  public static fromRepositoryName(scope: Construct, id: string, repositoryName: string): IRepository {
    class Import extends RepositoryBase {
      public repositoryName = repositoryName;
      public repositoryArn = Repository.arnForLocalRepository(repositoryName, scope);

      public addToResourcePolicy(_statement: iam.PolicyStatement): void {
        // dropped
      }
    }

    return new Import(scope, id);
  }

  /**
   * Returns an ECR ARN for a repository that resides in the same account/region
   * as the current stack.
   */
  public static arnForLocalRepository(repositoryName: string, scope: IConstruct): string {
    return scope.node.stack.formatArn({
      service: 'ecr',
      resource: 'repository',
      resourceName: repositoryName
    });
  }

  public readonly repositoryName: string;
  public readonly repositoryArn: string;
  private readonly lifecycleRules = new Array<LifecycleRule>();
  private readonly registryId?: string;
  private policyDocument?: iam.PolicyDocument;

  constructor(scope: Construct, id: string, props: RepositoryProps = {}) {
    super(scope, id);

    const resource = new CfnRepository(this, 'Resource', {
      repositoryName: props.repositoryName,
      // It says "Text", but they actually mean "Object".
      repositoryPolicyText: new Token(() => this.policyDocument),
      lifecyclePolicy: new Token(() => this.renderLifecyclePolicy()),
    });

    if (props.retain) {
      resource.options.deletionPolicy = DeletionPolicy.Retain;
    }

    this.registryId = props.lifecycleRegistryId;
    if (props.lifecycleRules) {
      props.lifecycleRules.forEach(this.addLifecycleRule.bind(this));
    }

    this.repositoryName = resource.repositoryName;
    this.repositoryArn = resource.repositoryArn;
  }

  public addToResourcePolicy(statement: iam.PolicyStatement) {
    if (this.policyDocument === undefined) {
      this.policyDocument = new iam.PolicyDocument();
    }
    this.policyDocument.addStatement(statement);
  }

  /**
   * Add a life cycle rule to the repository
   *
   * Life cycle rules automatically expire images from the repository that match
   * certain conditions.
   */
  public addLifecycleRule(rule: LifecycleRule) {
    // Validate rule here so users get errors at the expected location
    if (rule.tagStatus === undefined) {
      rule = { ...rule, tagStatus: rule.tagPrefixList === undefined ? TagStatus.Any : TagStatus.Tagged };
    }

    if (rule.tagStatus === TagStatus.Tagged && (rule.tagPrefixList === undefined || rule.tagPrefixList.length === 0)) {
      throw new Error('TagStatus.Tagged requires the specification of a tagPrefixList');
    }
    if (rule.tagStatus !== TagStatus.Tagged && rule.tagPrefixList !== undefined) {
      throw new Error('tagPrefixList can only be specified when tagStatus is set to Tagged');
    }
    if ((rule.maxImageAgeDays !== undefined) === (rule.maxImageCount !== undefined)) {
      throw new Error(`Life cycle rule must contain exactly one of 'maxImageAgeDays' and 'maxImageCount', got: ${JSON.stringify(rule)}`);
    }

    if (rule.tagStatus === TagStatus.Any && this.lifecycleRules.filter(r => r.tagStatus === TagStatus.Any).length > 0) {
      throw new Error('Life cycle can only have one TagStatus.Any rule');
    }

    this.lifecycleRules.push({ ...rule });
  }

  /**
   * Render the life cycle policy object
   */
  private renderLifecyclePolicy(): CfnRepository.LifecyclePolicyProperty | undefined {
    let lifecyclePolicyText: any;

    if (this.lifecycleRules.length === 0 && !this.registryId) { return undefined; }

    if (this.lifecycleRules.length > 0) {
      lifecyclePolicyText = JSON.stringify(this.node.resolve({
        rules: this.orderedLifecycleRules().map(renderLifecycleRule),
      }));
    }

    return {
      lifecyclePolicyText,
      registryId: this.registryId,
    };
  }

  /**
   * Return life cycle rules with automatic ordering applied.
   *
   * Also applies validation of the 'any' rule.
   */
  private orderedLifecycleRules(): LifecycleRule[] {
    if (this.lifecycleRules.length === 0) { return []; }

    const prioritizedRules = this.lifecycleRules.filter(r => r.rulePriority !== undefined && r.tagStatus !== TagStatus.Any);
    const autoPrioritizedRules = this.lifecycleRules.filter(r => r.rulePriority === undefined && r.tagStatus !== TagStatus.Any);
    const anyRules = this.lifecycleRules.filter(r => r.tagStatus === TagStatus.Any);
    if (anyRules.length > 0 && anyRules[0].rulePriority !== undefined && autoPrioritizedRules.length > 0) {
      // Supporting this is too complex for very little value. We just prohibit it.
      throw new Error("Cannot combine prioritized TagStatus.Any rule with unprioritized rules. Remove rulePriority from the 'Any' rule.");
    }

    const prios = prioritizedRules.map(r => r.rulePriority!);
    let autoPrio = (prios.length > 0 ? Math.max(...prios) : 0) + 1;

    const ret = new Array<LifecycleRule>();
    for (const rule of prioritizedRules.concat(autoPrioritizedRules).concat(anyRules)) {
      ret.push({
        ...rule,
        rulePriority: rule.rulePriority !== undefined ? rule.rulePriority : autoPrio++
      });
    }

    // Do validation on the final array--might still be wrong because the user supplied all prios, but incorrectly.
    validateAnyRuleLast(ret);
    return ret;
  }
}

function validateAnyRuleLast(rules: LifecycleRule[]) {
  const anyRules = rules.filter(r => r.tagStatus === TagStatus.Any);
  if (anyRules.length === 1) {
    const maxPrio = Math.max(...rules.map(r => r.rulePriority!));
    if (anyRules[0].rulePriority !== maxPrio) {
      throw new Error(`TagStatus.Any rule must have highest priority, has ${anyRules[0].rulePriority} which is smaller than ${maxPrio}`);
    }
  }
}

/**
 * Render the lifecycle rule to JSON
 */
function renderLifecycleRule(rule: LifecycleRule) {
  return {
    rulePriority: rule.rulePriority,
    description: rule.description,
    selection: {
      tagStatus: rule.tagStatus || TagStatus.Any,
      tagPrefixList: rule.tagPrefixList,
      countType: rule.maxImageAgeDays !== undefined ? CountType.SinceImagePushed : CountType.ImageCountMoreThan,
      countNumber: rule.maxImageAgeDays !== undefined ? rule.maxImageAgeDays : rule.maxImageCount,
      countUnit: rule.maxImageAgeDays !== undefined ? 'days' : undefined,
    },
    action: {
      type: 'expire'
    }
  };
}
