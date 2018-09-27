import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './ecr.generated';
import { CountType, LifecycleRule, TagStatus } from './lifecycle';
import { RepositoryRef } from "./repository-ref";

export interface RepositoryProps {
  /**
   * Name for this repository
   *
   * @default Automatically generated name.
   */
  repositoryName?: string;

  /**
   * Life cycle rules to apply to this registry
   *
   * @default No life cycle rules
   */
  lifecycleRules?: LifecycleRule[];

  /**
   * The AWS account ID associated with the registry that contains the repository.
   *
   * @see https://docs.aws.amazon.com/AmazonECR/latest/APIReference/API_PutLifecyclePolicy.html
   * @default The default registry is assumed.
   */
  lifecycleRegistryId?: string;

  /**
   * Retain the repository on stack deletion
   *
   * If you don't set this to true, the registry must be empty, otherwise
   * your stack deletion will fail.
   *
   * @default false
   */
  retain?: boolean;
}

/**
 * Define an ECR repository
 */
export class Repository extends RepositoryRef {
  public readonly repositoryName: string;
  public readonly repositoryArn: string;
  private readonly lifecycleRules = new Array<LifecycleRule>();
  private readonly registryId?: string;
  private policyDocument?: cdk.PolicyDocument;

  constructor(parent: cdk.Construct, id: string, props: RepositoryProps = {}) {
    super(parent, id);

    const resource = new cloudformation.RepositoryResource(this, 'Resource', {
      repositoryName: props.repositoryName,
      // It says "Text", but they actually mean "Object".
      repositoryPolicyText: new cdk.Token(() => this.policyDocument),
      lifecyclePolicy: new cdk.Token(() => this.renderLifecyclePolicy()),
    });

    if (props.retain) {
      resource.options.deletionPolicy = cdk.DeletionPolicy.Retain;
    }

    this.registryId = props.lifecycleRegistryId;
    if (props.lifecycleRules) {
      props.lifecycleRules.forEach(this.addLifecycleRule.bind(this));
    }

    this.repositoryName = resource.repositoryName;
    this.repositoryArn = resource.repositoryArn;
  }

  public addToResourcePolicy(statement: cdk.PolicyStatement) {
    if (this.policyDocument === undefined) {
      this.policyDocument = new cdk.PolicyDocument();
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
      rule.tagStatus = rule.tagPrefixList === undefined ? TagStatus.Any : TagStatus.Tagged;
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
  private renderLifecyclePolicy(): cloudformation.RepositoryResource.LifecyclePolicyProperty | undefined {
    let lifecyclePolicyText: any;

    if (this.lifecycleRules.length === 0 && !this.registryId) { return undefined; }

    if (this.lifecycleRules.length > 0) {
      lifecyclePolicyText = JSON.stringify(cdk.resolve({
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
