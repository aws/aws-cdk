import type { Duration } from '../../core';

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
   * Specify exactly one of maxImageCount, maxImageAge, maxDaysSinceLastPull, and maxDaysSinceArchived.
   */
  readonly maxImageCount?: number;

  /**
   * The maximum age of images to retain (days since pushed).
   *
   * Specify exactly one of maxImageCount, maxImageAge, maxDaysSinceLastPull, and maxDaysSinceArchived.
   */
  readonly maxImageAge?: Duration;

  /**
   * The maximum number of days since an image was last pulled before it can be transitioned.
   * Only the TRANSITION (archive) action is allowed with this count type.
   *
   * Specify exactly one of maxImageCount, maxImageAge, maxDaysSinceLastPull, and maxDaysSinceArchived.
   */
  readonly maxDaysSinceLastPull?: Duration;

  /**
   * The maximum number of days since an image was archived before it can be expired.
   * Only applies to images already in the archive storage class.
   * Only the EXPIRE action is allowed with this count type.
   *
   * Specify exactly one of maxImageCount, maxImageAge, maxDaysSinceLastPull, and maxDaysSinceArchived.
   */
  readonly maxDaysSinceArchived?: Duration;

  /**
   * The action to perform on matching images: expire (delete) or transition (move to archive storage).
   * When using maxDaysSinceLastPull, only TRANSITION is allowed.
   * When using maxDaysSinceArchived, only EXPIRE is allowed.
   * Both actions are allowed for maxImageCount and maxImageAge.
   *
   * @default LifecycleAction.EXPIRE (or TRANSITION when maxDaysSinceLastPull is used)
   */
  readonly action?: LifecycleAction;
}

/**
 * Action to perform on images that match a lifecycle rule
 */
export enum LifecycleAction {
  /**
   * Delete matching images
   */
  EXPIRE = 'expire',

  /**
   * Move matching images to archive storage class
   */
  TRANSITION = 'transition',
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
