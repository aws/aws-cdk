import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import { AcceptLanguage } from './common';
import { IProduct } from './product';

/**
 * Properties for governance mechanisms and constraints.
 */
export interface ConstraintProps {

  /**
   * The language code.
   * @default - No accept language provided
   */
  readonly acceptLanguage?: AcceptLanguage;

  /**
   * The description of the constraint.
   * @default - No description provided
   */
  readonly description?: string;

  /**
   * A reference to product.
   */
  readonly product: IProduct;
}

/**
 * Properties for LaunchNotificationConstraint.
 */
export interface EventNotificationsProps extends ConstraintProps {

  /**
   * A list of SNS Topics to notify on Stack Events.
   */
  readonly topics: sns.ITopic[];
}

/**
 * Properties for LaunchRoleConstraint.
 */
export interface LaunchRoleProps extends ConstraintProps {

  /**
   * A reference to a Role
   */
  readonly role: iam.IRole;
}

/**
 * Rule for Service Catalog Template Constraint.
 */
interface Rule {

  /**
   * List of assertions
   */
  readonly Assertions: Assertion[],

  /**
   * When to apply assertions
   */
  readonly RuleCondition?: any
}

/**
 * Properties for LaunchTemplateConstraint.
 */
interface Assertion {

  /**
   * The cfn rules to apply to the template in valid CFN JSON
   * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-rules.html
   */
  readonly Assert: any,

  /**
   * Description message provided for rule
   */
  readonly AssertDescription: string
}

/**
 * Properties for LaunchTemplateConstraint.
 */
export interface TemplateRule {

  /**
   * List of rules
   */
  readonly [name: string]: Rule
}

// /**
//  * Properties for LaunchTemplateConstraint.
//  */
// export interface TemplateRules {

//   /**
//    * Provisiong rules
//    */
//   readonly Rules: TemplateRule
// }

/**
 * Properties for LaunchTemplateConstraint.
 */
export interface ProvisioningRulesProps extends ConstraintProps {

  /**
   * The rules for the template constraint
   * @default {}
   */
  readonly rules?: TemplateRule;
}

/**
 * Properties for ResourceUpdateConstraint.
 */
export interface TagUpdatesProps extends ConstraintProps {
  /**
   * Toggle for if users should be allowed to change tags
   * @default true
   */
  readonly tagUpdateOnProvisionedProductAllowed?: boolean;
}

/**
 * Properties for StackSetConstraint.
 */
export interface StackSetConstraintProps extends ConstraintProps {

  /**
   * One or more AWS accounts that will have access to the provisioned product
   */
  readonly accounts: string[];

  /**
   * One or more AWS Regions where the provisioned product will be available.
   */
  readonly regions: string[];

  /**
   * Admin Role
   */
  readonly adminRole: iam.IRole;

  /**
   * Execution Role
   */
  readonly executionRole: iam.IRole;

  /**
   * Toggle for permission to create, update, and delete stack instances.
   * @default true
   */
  readonly stackInstanceControlAllowed?: boolean;
}
