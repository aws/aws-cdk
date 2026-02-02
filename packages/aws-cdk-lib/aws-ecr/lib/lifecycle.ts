import { Duration, UnscopedValidationError } from '../../core';

/**
 * An ECR life cycle rule
 */
export interface LifecycleRule {
  /**
   * Controls the order in which rules are evaluated (low to high)
   *
   * All rules must have a unique priority, where lower numbers have
   * higher precedence. The first rule that matches is applied to an image.
   *
   * There can only be one rule with a tagStatus of Any, and it must have
   * the highest rulePriority.
   *
   * All rules without a specified priority will have incrementing priorities
   * automatically assigned to them, higher than any rules that DO have priorities.
   *
   * @default Automatically assigned
   */
  readonly rulePriority?: number;

  /**
   * Describes the purpose of the rule
   *
   * @default No description
   */
  readonly description?: string;

  /**
   * Select images based on tags
   *
   * Only one rule is allowed to select untagged images, and it must
   * have the highest rulePriority.
   *
   * @default TagStatus.Tagged if tagPrefixList or tagPatternList is
   * given, TagStatus.Any otherwise
   */
  readonly tagStatus?: TagStatus;

  /**
   * Select images that have ALL the given prefixes in their tag.
   *
   * Both tagPrefixList and tagPatternList cannot be specified
   * together in a rule.
   *
   * Only if tagStatus == TagStatus.Tagged
   */
  readonly tagPrefixList?: string[];

  /**
   * Select images that have ALL the given patterns in their tag.
   *
   * There is a maximum limit of four wildcards (*) per string.
   * For example, ["*test*1*2*3", "test*1*2*3*"] is valid but
   * ["test*1*2*3*4*5*6"] is invalid.
   *
   * Both tagPrefixList and tagPatternList cannot be specified
   * together in a rule.
   *
   * Only if tagStatus == TagStatus.Tagged
   */
  readonly tagPatternList?: string[];

  /**
   * The maximum number of images to retain
   *
   * Specify exactly one of maxImageCount and maxImageAge.
   */
  readonly maxImageCount?: number;

  /**
   * The maximum age of images to retain. The value must represent a number of days.
   *
   * Specify exactly one of maxImageCount and maxImageAge.
   */
  readonly maxImageAge?: Duration;
}

/**
 * Select images based on tags
 */
export enum TagStatus {
  /**
   * Rule applies to all images
   */
  ANY = 'any',

  /**
   * Rule applies to tagged images
   */
  TAGGED = 'tagged',

  /**
   * Rule applies to untagged images
   */
  UNTAGGED = 'untagged',
}

/**
 * Properties for creating a LifecycleRule
 */
export interface LifecycleRuleProps extends LifecycleRule {}

/**
 * An ECR lifecycle rule class that provides JSON serialization capability
 *
 * This class provides the same properties as the LifecycleRule interface and adds a toJSON() method
 * for use with L1 constructs that require JSON serialization of lifecycle rules.
 *
 * @example
 * // For use with L1 constructs
 * declare const stack: Stack;
 *
 * const lifecycleRule = new ecr.LifecycleRuleClass({
 *   maxImageCount: 5,
 *   tagStatus: ecr.TagStatus.TAGGED,
 *   tagPrefixList: ['prod']
 * });
 *
 * const template = new ecr.CfnRepositoryCreationTemplate(stack, 'Template', {
 *   appliedFor: ['PULL_THROUGH_CACHE'],
 *   prefix: 'my-prefix',
 *   lifecyclePolicy: JSON.stringify({
 *     rules: [lifecycleRule.toJSON()]
 *   })
 * });
 */
export class LifecycleRuleClass {
  /**
   * Controls the order in which rules are evaluated (low to high)
   */
  public readonly rulePriority?: number;

  /**
   * Describes the purpose of the rule
   */
  public readonly description?: string;

  /**
   * Select images based on tags
   */
  public readonly tagStatus?: TagStatus;

  /**
   * Select images that have ALL the given prefixes in their tag
   */
  public readonly tagPrefixList?: string[];

  /**
   * Select images that have ALL the given patterns in their tag
   */
  public readonly tagPatternList?: string[];

  /**
   * The maximum number of images to retain
   */
  public readonly maxImageCount?: number;

  /**
   * The maximum age of images to retain
   */
  public readonly maxImageAge?: Duration;

  constructor(props: LifecycleRuleProps) {
    // Apply default tagStatus logic (same as Repository.addLifecycleRule)
    const tagStatus = props.tagStatus ??
      (props.tagPrefixList === undefined && props.tagPatternList === undefined ? TagStatus.ANY : TagStatus.TAGGED);

    // Validate the rule (same validation as Repository.addLifecycleRule)
    this.validateRule({ ...props, tagStatus });

    // Set properties
    this.rulePriority = props.rulePriority;
    this.description = props.description;
    this.tagStatus = tagStatus;
    this.tagPrefixList = props.tagPrefixList;
    this.tagPatternList = props.tagPatternList;
    this.maxImageCount = props.maxImageCount;
    this.maxImageAge = props.maxImageAge;
  }

  /**
   * Serialize the lifecycle rule to JSON format compatible with CloudFormation
   *
   * This method produces the same JSON structure as the internal renderLifecycleRule
   * function used by the Repository class, ensuring compatibility with existing
   * CloudFormation templates.
   *
   * @returns JSON object representing the lifecycle rule
   */
  public toJSON(): any {
    return {
      rulePriority: this.rulePriority,
      description: this.description,
      selection: {
        tagStatus: this.tagStatus || TagStatus.ANY,
        tagPrefixList: this.tagPrefixList,
        tagPatternList: this.tagPatternList,
        countType: this.maxImageAge !== undefined ? 'sinceImagePushed' : 'imageCountMoreThan',
        countNumber: this.maxImageAge?.toDays() ?? this.maxImageCount,
        countUnit: this.maxImageAge !== undefined ? 'days' : undefined,
      },
      action: {
        type: 'expire',
      },
    };
  }

  /**
   * Validate the lifecycle rule properties
   *
   * This method implements the same validation logic as Repository.addLifecycleRule
   * to ensure consistency across both interface and class usage.
   */
  private validateRule(rule: LifecycleRule & { tagStatus: TagStatus }): void {
    if (rule.tagStatus === TagStatus.TAGGED
      && (rule.tagPrefixList === undefined || rule.tagPrefixList.length === 0)
      && (rule.tagPatternList === undefined || rule.tagPatternList.length === 0)
    ) {
      throw new UnscopedValidationError('TagStatus.Tagged requires the specification of a tagPrefixList or a tagPatternList');
    }

    if (rule.tagStatus !== TagStatus.TAGGED && (rule.tagPrefixList !== undefined || rule.tagPatternList !== undefined)) {
      throw new UnscopedValidationError('tagPrefixList and tagPatternList can only be specified when tagStatus is set to Tagged');
    }

    if (rule.tagPrefixList !== undefined && rule.tagPatternList !== undefined) {
      throw new UnscopedValidationError('Both tagPrefixList and tagPatternList cannot be specified together in a rule');
    }

    if (rule.tagPatternList !== undefined) {
      rule.tagPatternList.forEach((pattern) => {
        const splitPatternLength = pattern.split('*').length;
        if (splitPatternLength > 5) {
          throw new UnscopedValidationError(`A tag pattern cannot contain more than four wildcard characters (*), pattern: ${pattern}, counts: ${splitPatternLength - 1}`);
        }
      });
    }

    if ((rule.maxImageAge !== undefined) === (rule.maxImageCount !== undefined)) {
      throw new UnscopedValidationError(`Life cycle rule must contain exactly one of 'maxImageAge' and 'maxImageCount', got: ${JSON.stringify(rule)}`);
    }
  }
}
