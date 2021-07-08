import { AcceptLanguage } from './common';

/**
 * Properties for governance mechanisms and constraints.
 */
export interface CommonConstraintOptions {
  /**
   * The language code. Configures the language for error messages
   * from service catalog.
   * @default - No accept language provided
   */
  readonly acceptedMessageLanguage?: AcceptLanguage;

  /**
   * The description of the constraint.
   * @default - No description provided
   */
  readonly description?: string;
}

/**
 * Properties for ResourceUpdateConstraint.
 */
export interface TagUpdatesOptions extends CommonConstraintOptions {
  /**
   * Toggle for if users should be allowed to change tags
   * @default true
   */
  readonly allowUpdatingProvisionedProductTags?: boolean;
}