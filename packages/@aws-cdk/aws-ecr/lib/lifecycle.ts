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
  rulePriority?: number;

  /**
   * Describes the purpose of the rule
   *
   * @default No description
   */
  description?: string;

  /**
   * Select images based on tags
   *
   * Only one rule is allowed to select untagged images, and it must
   * have the highest rulePriority.
   *
   * @default TagStatus.Tagged if tagPrefixList is given, TagStatus.Any otherwise
   */
  tagStatus?: TagStatus;

  /**
   * Select images that have ALL the given prefixes in their tag.
   *
   * Only if tagStatus == TagStatus.Tagged
   */
  tagPrefixList?: string[];

  /**
   * The maximum number of images to retain
   *
   * Specify exactly one of maxImageCount and maxImageAgeDays.
   */
  maxImageCount?: number;

  /**
   * The maximum age of images to retain
   *
   * Specify exactly one of maxImageCount and maxImageAgeDays.
   */
  maxImageAgeDays?: number;
}

/**
 * Select images based on tags
 */
export enum TagStatus {
  /**
   * Rule applies to all images
   */
  Any = 'any',

  /**
   * Rule applies to tagged images
   */
  Tagged = 'tagged',

  /**
   * Rule applies to untagged images
   */
  Untagged = 'untagged',
}

/**
 * Select images based on counts
 */
export enum CountType {
  /**
   * Set a limit on the number of images in your repository
   */
  ImageCountMoreThan = 'imageCountMoreThan',

  /**
   * Set an age limit on the images in your repository
   */
  SinceImagePushed = 'sinceImagePushed',
}
