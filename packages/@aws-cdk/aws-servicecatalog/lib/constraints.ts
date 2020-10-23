import * as iam from '@aws-cdk/aws-iam';
import * as core from '@aws-cdk/core';
import * as constructs from 'constructs';
import { Language } from './language';
import { IPortfolio } from './portfolio';
import { IProduct } from './product';
import * as servicecatalog from './servicecatalog.generated';

export interface IConstraint extends core.IResource {
}

interface BaseConstraintProps {
  readonly acceptLanguage?: Language;
  readonly description?: string;
  readonly portfolio?: IPortfolio;
  readonly product?: IProduct;
}

export interface LaunchNotificationConstraintProps extends BaseConstraintProps {
  readonly notificationArns: string[];
}
export interface LaunchRoleConstraintProps extends BaseConstraintProps {
  readonly localRoleName?: string;
  readonly role?: iam.IRole;
}
export interface LaunchTemplateConstraintProps extends BaseConstraintProps {
  // TODO: make this it's own type
  readonly rules: string;
}
export interface ResourceUpdateConstraintProps extends BaseConstraintProps {
  readonly allowTagUpdateOnProvisionedProduct: boolean;
}
export interface StackSetConstraintProps extends BaseConstraintProps {
  readonly accounts: string[];
  readonly adminRole: iam.IRole;
  readonly executionRole: iam.IRole;
  readonly regions: string[];
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
  // This function could potentially made to be more generic so that callers only need to pass the diff between base props and their specific props.
  protected absApply<R extends core.CfnResource, RP>(R: new (scope: core.Construct, id: string, props: RP) => R, baseProps: RP) {
    new R(this, 'productContraint', baseProps);
  }
}

export class LaunchNotificationConstraint extends ConstraintBase implements IConstraint {
  readonly notificationArns: string[];
  constructor(scope: constructs.Construct, id: string, props: LaunchNotificationConstraintProps) {
    super(scope, id, props);
    this.notificationArns = props.notificationArns;

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
      notificationArns: this.notificationArns,
    });
  }
}
export class LaunchRoleConstraint extends ConstraintBase implements IConstraint {
  readonly localRoleName?: string;
  readonly role?: iam.IRole;
  constructor(scope: constructs.Construct, id: string, props: LaunchRoleConstraintProps) {
    super(scope, id, props);
    this.localRoleName = props.localRoleName;
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
      localRoleName: this.localRoleName,
      roleArn: this.role?.roleArn,
    });
  }
}
export class LaunchTemplateConstraint extends ConstraintBase implements IConstraint {
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
export class ResourceUpdateConstraint extends ConstraintBase implements IConstraint {
  readonly allowTagUpdateOnProvisionedProduct: boolean;
  private tagUpdateOnProvisionedProduct: 'ALLOWED' | 'NOT_ALLOWED'

  constructor(scope: constructs.Construct, id: string, props: ResourceUpdateConstraintProps) {
    super(scope, id, props);
    this.allowTagUpdateOnProvisionedProduct = props.allowTagUpdateOnProvisionedProduct;
    if (this.allowTagUpdateOnProvisionedProduct) {
      this.tagUpdateOnProvisionedProduct = 'ALLOWED';
    } else {
      this.tagUpdateOnProvisionedProduct = 'NOT_ALLOWED';
    }

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

export class StackSetConstraint extends ConstraintBase implements IConstraint {
  readonly accounts: string[];
  readonly adminRole: iam.IRole;
  readonly executionRole: iam.IRole;
  readonly regions: string[];
  readonly allowStackInstanceControl: boolean;
  private stackInstanceControl: 'ALLOWED' | 'NOT_ALLOWED';

  constructor(scope: constructs.Construct, id: string, props: StackSetConstraintProps) {
    super(scope, id, props);
    this.accounts = props.accounts;
    this.adminRole = props.adminRole;
    this.executionRole = props.executionRole;
    this.regions = props.regions;
    this.allowStackInstanceControl = props.allowStackInstanceControl;

    // As of 2020-10-23 the CloudFormation Resource Specification says the "Description" parameter of this resource is required.
    // This is likely a bug and this field can be removed once this issue is resolved.
    this.description === undefined ? props.description : 'No description';

    if (this.allowStackInstanceControl) {
      this.stackInstanceControl = 'ALLOWED';
    } else {
      this.stackInstanceControl = 'NOT_ALLOWED';
    }
    if (props.product && props.portfolio) {
      this.apply(props.product, props.portfolio);
    }
  }
  public apply(product: IProduct, portfolio: IPortfolio) {
    new servicecatalog.CfnStackSetConstraint(this, 'stackSetConstraint', {
      acceptLanguage: this.acceptLanguage,
      description: this.description!,
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
