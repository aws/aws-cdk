import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import * as core from '@aws-cdk/core';
import * as constructs from 'constructs';
import { Language } from './language';
import { IPortfolio } from './portfolio';
import { IProduct } from './product';
import * as servicecatalog from './servicecatalog.generated';

/**
 * Represents an AWS ServiceCatalog constraint
 */
export interface IConstraint extends core.IResource {
  /**
   * The language code.
   *
   * @default en
   */
  readonly acceptLanguage?: Language;

  /**
   * The constraint's description.
   *
   * @default none
   */
  readonly description?: string;

  /**
   * The portfolio to associate this constraint to.
   *
   * @default none
   */
  readonly portfolio?: IPortfolio;

  /**
   * The product to associate this constraint to.
   *
   * @default none
   */
  readonly product?: IProduct;

  /**
   * Applies a constraint to a product/portfolio
   *
   * @param product The product to apply the constraint to.
   * @param portfolio The portfolio containing the product.
   */
  apply(product: IProduct, portfolio: IPortfolio): void
}

interface BaseConstraintProps {
  /**
   * The language code.
   *
   * @default en
   */
  readonly acceptLanguage?: Language;
  /**
   * Constraint description
   *
   * @default none
   */
  readonly description?: string;
  /**
   * Portfolio to associate the constraint with.
   *
   * @default none
   */
  readonly portfolio?: IPortfolio;
  /**
   * Product within the portfolio to associate the constraint with.
   *
   * @default none
   */
  readonly product?: IProduct;
}

/**
 * Launch Notification Constraint properties
 */
export interface LaunchNotificationConstraintProps extends BaseConstraintProps {
  /**
   * A list of topics to notify
   */
  readonly topics: sns.ITopic[];
}
/**
 * Launch Role Constraint properties
 */
export interface LaunchRoleConstraintProps extends BaseConstraintProps {
  /**
   * Role used to launch the stack.
   */
  readonly role: iam.IRole;
}
/**
 * Launch Template Constraint properties
 */
export interface LaunchTemplateConstraintProps extends BaseConstraintProps {
  // TODO: make this it's own type instead of a string
  /**
   * Launch Template Constraint Rules
   */
  readonly rules: string;
}
/**
 * Resource Update Constraint properties
 */
export interface ResourceUpdateConstraintProps extends BaseConstraintProps {
  /**
   * Whether or not to allow tag updates on provisioned product
   */
  readonly allowTagUpdateOnProvisionedProduct: boolean;
}
/**
 * StackSet Constraint properties
 */
export interface StackSetConstraintProps extends BaseConstraintProps {

  /**
   * One or more AWS accounts that will have access to the provisioned product.
   */
  readonly accounts: string[];
  /**
   * IAM Role used to manage the target accounts
   */
  readonly adminRole: iam.IRole;
  /**
   * IAM Role used to execute the StackSet.
   */
  readonly executionRole: iam.IRole;
  /**
   * One or more AWS Regions where the provisioned product will be available.
   */
  readonly regions: string[];
  /**
   * Whether or not to allow permission to create, update, and delete stack instances.
   */
  readonly allowStackInstanceControl: boolean;
}

abstract class ConstraintBase extends core.Resource implements IConstraint {
  readonly acceptLanguage?: Language;
  readonly description?: string;
  readonly portfolio?: IPortfolio;
  readonly product?: IProduct;

  constructor(scope: constructs.Construct, id: string, props: BaseConstraintProps) {
    super(scope, id);
    this.acceptLanguage = props.acceptLanguage;
    this.description = props.description;
    this.portfolio = props.portfolio;
    this.product = props.product;
  }
  abstract apply(product: IProduct, portfolio: IPortfolio): void
}

/**
 * Creates a Launch Notification Constraint
 *
 * @resource AWS::ServiceCatalog::LaunchNotificationConstraint
 */
export class LaunchNotificationConstraint extends ConstraintBase implements IConstraint {
  /**
   * A list of topics to notify
   */
  readonly topics: sns.ITopic[];
  constructor(scope: constructs.Construct, id: string, props: LaunchNotificationConstraintProps) {
    super(scope, id, props);
    this.topics = props.topics;

    if (props.product && props.portfolio) {
      this.apply(props.product, props.portfolio);
    }
  }
  public apply(product: IProduct, portfolio: IPortfolio) {
    new servicecatalog.CfnLaunchNotificationConstraint(this, 'launchNotificationConstraint', {
      acceptLanguage: this.acceptLanguage,
      description: this.description,
      portfolioId: portfolio.portfolioId,
      productId: product.productId,
      notificationArns: Array.from(this.topics, n => n.topicArn),
    });
  }
}
/**
 * Create a new Launch Role Constraint
 *
 * @resource AWS::ServiceCatalog::LaunchRoleConstraint
 */
export class LaunchRoleConstraint extends ConstraintBase implements IConstraint {
  /**
   * Role used to launch the stack.
   */
  readonly role?: iam.IRole;
  constructor(scope: constructs.Construct, id: string, props: LaunchRoleConstraintProps) {
    super(scope, id, props);
    this.role = props.role;

    if (props.product && props.portfolio) {
      this.apply(props.product, props.portfolio);
    }
  }
  public apply(product: IProduct, portfolio: IPortfolio) {
    new servicecatalog.CfnLaunchRoleConstraint(this, 'launchRoleConstraint', {
      acceptLanguage: this.acceptLanguage,
      description: this.description,
      portfolioId: portfolio.portfolioId,
      productId: product.productId,
      roleArn: this.role?.roleArn,
    });
  }
}
/**
 * Create a new Launch Template Constraint
 *
 * @resource AWS::ServiceCatalog::LaunchTemplateConstraint
 */
export class LaunchTemplateConstraint extends ConstraintBase implements IConstraint {
  /**
   * Launch Template Constraint Rules
   */
  readonly rules: string;
  constructor(scope: constructs.Construct, id: string, props: LaunchTemplateConstraintProps) {
    super(scope, id, props);
    this.rules = props.rules;

    if (props.product && props.portfolio) {
      this.apply(props.product, props.portfolio);
    }
  }
  public apply(product: IProduct, portfolio: IPortfolio) {
    new servicecatalog.CfnLaunchTemplateConstraint(this, 'launchTemplateConstraint', {
      acceptLanguage: this.acceptLanguage,
      description: this.description,
      portfolioId: portfolio.portfolioId,
      productId: product.productId,
      rules: this.rules,
    });
  }
}
/**
 * Create a new Resource Update Constraint
 *
 * @resource AWS::ServiceCatalog::ResourceUpdateConstraint
 */
export class ResourceUpdateConstraint extends ConstraintBase implements IConstraint {
  /**
   * Whether or not to allow tag updates on provisioned product
   */
  readonly allowTagUpdateOnProvisionedProduct: boolean;
  private tagUpdateOnProvisionedProduct: 'ALLOWED' | 'NOT_ALLOWED'

  constructor(scope: constructs.Construct, id: string, props: ResourceUpdateConstraintProps) {
    super(scope, id, props);
    this.allowTagUpdateOnProvisionedProduct = props.allowTagUpdateOnProvisionedProduct;
    this.tagUpdateOnProvisionedProduct = this.allowTagUpdateOnProvisionedProduct ? 'ALLOWED' : 'NOT_ALLOWED';

    if (props.product && props.portfolio) {
      this.apply(props.product, props.portfolio);
    }
  }
  public apply(product: IProduct, portfolio: IPortfolio) {
    new servicecatalog.CfnResourceUpdateConstraint(this, 'resourceUpdateConstraint', {
      acceptLanguage: this.acceptLanguage,
      description: this.description,
      portfolioId: portfolio.portfolioId,
      productId: product.productId,
      tagUpdateOnProvisionedProduct: this.tagUpdateOnProvisionedProduct,
    });
  }
}
/**
 * Create a new StackSetConstraint
 *
 * @resource AWS::ServiceCatalog::StackSetConstraint
 */
export class StackSetConstraint extends ConstraintBase implements IConstraint {
  /**
   * One or more AWS accounts that will have access to the provisioned product.
   */
  readonly accounts: string[];
  /**
   * IAM Role used to manage the target accounts
   */
  readonly adminRole: iam.IRole;
  /**
   * IAM Role used to execute the StackSet.
   */
  readonly executionRole: iam.IRole;
  /**
   * One or more AWS Regions where the provisioned product will be available.
   */
  readonly regions: string[];
  /**
   * Whether or not to allow permission to create, update, and delete stack instances.
   */
  readonly allowStackInstanceControl: boolean;
  private stackInstanceControl: 'ALLOWED' | 'NOT_ALLOWED';

  constructor(scope: constructs.Construct, id: string, props: StackSetConstraintProps) {
    super(scope, id, props);
    this.accounts = props.accounts;
    this.adminRole = props.adminRole;
    this.executionRole = props.executionRole;
    this.regions = props.regions;
    this.allowStackInstanceControl = props.allowStackInstanceControl;
    this.stackInstanceControl = this.allowStackInstanceControl ? 'ALLOWED' : 'NOT_ALLOWED';
    if (props.product && props.portfolio) {
      this.apply(props.product, props.portfolio);
    }
  }
  public apply(product: IProduct, portfolio: IPortfolio) {
    new servicecatalog.CfnStackSetConstraint(this, 'stackSetConstraint', {
      acceptLanguage: this.acceptLanguage,
      // As of 2020-10-23 the CloudFormation Resource Specification says the "Description" parameter of this resource is required.
      // This is likely a bug and these lines can be swapped once this issue is resolved.
      description: this.description || 'no description',
      // description: this.description,
      portfolioId: portfolio.portfolioId,
      productId: product.productId,
      stackInstanceControl: this.stackInstanceControl,
      accountList: this.accounts,
      adminRole: this.adminRole.roleArn,
      regionList: this.regions,
      executionRole: this.executionRole.roleArn,
    });
  }
}
