import { AcceptLanguage } from './common';

/**
 * Properties for governance mechanisms and constraints.
 */
export interface ConstraintProps {
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
export interface TagUpdatesOptions extends ConstraintProps {
  /**
   * Toggle for if users should be allowed to change tags
   * @default true
   */
  readonly tagUpdateOnProvisionedProductAllowed?: boolean;
}