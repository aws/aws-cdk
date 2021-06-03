import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import { AcceptLanguage } from './common';
import { IPortfolio } from './portfolio';
import { IProduct } from './product';


/**
 * Properties for Constraints.
 */
export interface ConstraintProps {
  /**
  * The language code.
  * @default
  */
  readonly acceptLanguage?: AcceptLanguage;

  /**
  * The description of the constraint.
  * @default
  */
  readonly description?: string;

  /**
  * A reference to product.
  */
  readonly product: IProduct | IPortfolio;
}


/**
 * Properties for LaunchNotificationConstraint.
 */
export interface AddEventNotificationsProps extends ConstraintProps {

  /**
  * A list of SNS Topics to notify on Stack Events.
  */
  readonly snsTopics: sns.ITopic[];
}

/**
 * Properties for LaunchRoleConstraint.
 */
export interface SetLaunchRoleProps extends ConstraintProps {

  /**
  * A reference to a Role
  */
  readonly role: iam.IRole;
}


/**
 * Properties for LaunchTemplateConstraint.
 */
export interface AddProvisioningRulesProps extends ConstraintProps {

  /**
  * The rules for the template constraint
  * @default {}
  */
  readonly rules?: any;
}

/**
 * Properties for ResourceUpdateConstraint.
 */
export interface AllowTagUpdatesProps extends ConstraintProps {
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
  readonly accountList: string[];

  /**
  * One or more AWS Regions where the provisioned product will be available.
  */
  readonly regionList: string[];

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
