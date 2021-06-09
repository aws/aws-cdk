import * as iam from '@aws-cdk/aws-iam';
import { IResource, Names, Resource, Tag, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { AcceptLanguage, TagOption } from './common';
import { EventNotificationsProps, LaunchRoleProps, ProvisioningRulesProps, TagUpdatesProps, StackSetConstraintProps } from './constraints';
import { AssociationManager } from './private/association-manager';
import { getIdentifier } from './private/util';
import { InputValidator } from './private/validation';
import { IProduct } from './product';
import { CfnPortfolio, CfnPortfolioPrincipalAssociation, CfnPortfolioShare } from './servicecatalog.generated';

/**
 * A Service Catalog portfolio.
 */
export interface IPortfolio extends IResource {

  /**
   * The ARN of the portfolio.
   * @attribute
   */
  readonly portfolioArn: string;

  /**
   * The ID of the portfolio.
   * @attribute
   */
  readonly portfolioId: string;

  /**
   * The name of the portfolio.
   * @attribute
   */
  readonly portfolioName: string;

  /**
   * Associate portfolio with an IAM Role.
   * @param role an IAM role
   */
  giveAccessToRole(role: iam.IRole): void;

  /**
   * Associate portfolio with an IAM User.
   * @param user an IAM user
   */
  giveAccessToUser(user: iam.IUser): void;

  /**
   * Associate portfolio with a principal
   * (Group).
   * @param group an IAM Group
   */
  giveAccessToGroup(group: iam.IGroup): void;

  /**
   * Associate portfolio with the given product.
   * @param product A service catalog produt.
   */
  addProduct(product: IProduct): void;

  /**
   * Share portfolio with another account.
   * @param accountId AWS account to share portfolio with
   * @param shareTagOptions ability to share or not share tag options
   */
  share(accountId: string, shareTagOptions?: boolean, acceptLanguage?: AcceptLanguage): void;

  /**
   * Add a Launch Notification Constraint.
   */
  addEventNotifications(props: EventNotificationsProps): void;

  /**
   * Add a Launch Role Constraint.
   */
  addLaunchRole(props: LaunchRoleProps): void;

  /**
   * Add a Launch Template Constraint.
   */
  addProvisioningRules(props: ProvisioningRulesProps): void;

  /**
   * Add a Resource Update Constraint.
   */
  allowTagUpdates(props: TagUpdatesProps): void;

  /**
   * Add a Stack Set Constraint.
   */
  addStackSetConstraint(props: StackSetConstraintProps): void;

  /**
   * Associate Tag Options
   */
  addTagOptions(tagOptions: TagOption): void;
}

/**
 * A reference to a Service Catalog portfolio.
 */
export interface PortfolioAttributes {

  /**
   * The ARN of the portfolo.
   */
  readonly portfolioArn: string;

  /**
   * The name of the portfolo.
   */
  readonly portfolioName: string;
}

/**
 * Represents a Service Catalog portfolio.
 */
abstract class PortfolioBase extends Resource implements IPortfolio {

  /**
   * The ARN of the portfolio.
   */
  public abstract readonly portfolioArn: string;

  /**
   * The Id of the portfolio.
   */
  public abstract readonly portfolioId: string;

  /**
   * The name of the portfolio.
   */
  public abstract readonly portfolioName: string;

  /**
   * Enable the Portfolio for a specific Role
   */
  public giveAccessToRole(role: iam.IRole) {
    this.associatePrincipal(role.roleArn, role.node.addr);
  }

  /**
   * Enable the Portfolio for a specific User
   */
  public giveAccessToUser(user: iam.IUser) {
    this.associatePrincipal(user.userArn, user.node.addr);
  }

  /**
   * Enable the Portfolio for a specific Group
   */
  public giveAccessToGroup(group: iam.IGroup) {
    this.associatePrincipal(group.groupArn, group.node.addr);
  }

  /**
   * Associate a Service Catalog product to the portfolio.
   */
  public addProduct(product: IProduct) {
    AssociationManager.associateProductWithPortfolio(this, this, product);
  }

  /**
   * Share the portfolio with a designated account.
   */
  public share(accountId: string, shareTagOptions?: boolean, acceptLanguage?: AcceptLanguage) {
    const hashId = this.getKeyForPortfolio(accountId);
    new CfnPortfolioShare(this, `PortfolioShare${hashId}`, {
      portfolioId: this.portfolioId,
      accountId: accountId,
      shareTagOptions: shareTagOptions,
      acceptLanguage: acceptLanguage,
    });
  }

  /**
   * Associate a principal with the portfolio.
   */
  private associatePrincipal(principalArn: string, identifier: string) {
    const hashId = this.getKeyForPortfolio(identifier);
    new CfnPortfolioPrincipalAssociation(this, `PortolioPrincipalAssociation${hashId}`, {
      portfolioId: this.portfolioId,
      principalArn: principalArn,
      principalType: PrincipalType.IAM,
    });
  }

  /**
   * Add a launch notification constraint.
   */
  public addEventNotifications(props: EventNotificationsProps) {
    AssociationManager.addLaunchNotificationConstraint(this, props);
  }

  /**
   * Add a launch role constraint.
   */
  public addLaunchRole(props: LaunchRoleProps) {
    AssociationManager.addLaunchRoleConstraint(this, props);
  }

  /**
   * Add a launch template constraint.
   */
  public addProvisioningRules(props: ProvisioningRulesProps) {
    AssociationManager.addTemplateConstraint(this, props);
  }

  /**
   * Add a resource template constraint.
   */
  public allowTagUpdates(props: TagUpdatesProps) {
    AssociationManager.addResourceUpdateConstraint(this, props);
  }

  /**
   * Add a stack set template constraint.
   */
  public addStackSetConstraint(props: StackSetConstraintProps) {
    AssociationManager.addStackSetConstraint(this, props);
  }

  /**
   * Add tagOptions
   * @param tagOption
   */
  public addTagOptions(tagOption: TagOption) {
    AssociationManager.associateTagOption(this, this.portfolioId, tagOption);
  }

  /**
   * Create a unique id based off the L1 portfolio.
   */
  protected abstract getKeyForPortfolio(value: string): string;
}

/**
 * Properties for a Portfolio.
 */
export interface PortfolioProps {

  /**
   * Enforces a particular physical portfolio name.
   */
  readonly portfolioName: string;

  /**
   * The provider name.
   */
  readonly providerName: string;

  /**
   * The accept language.
   * @default - No accept language provided
   */
  readonly acceptLanguage?: AcceptLanguage;

  /**
   * Description for portfolio.
   * @default - No description provided
   */
  readonly description?: string;

  /**
   * A collection of tags attached to portfolio.
   * @default - No tags provided
   */
  readonly tags?: Tag[];
}

/**
 * A Service Catalog portfolio.
 */
export class Portfolio extends PortfolioBase {

  /**
   * Creates a Portfolio construct that represents an external portfolio.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param attrs Portfolio import properties
   */
  public static fromPortfolioAttributes(scope: Construct, id: string, attrs: PortfolioAttributes): IPortfolio {
    const parts = Stack.of(scope).parseArn(attrs.portfolioArn);
    function throwError(errorMessage: string): never {
      throw new Error(errorMessage);
    }
    class Import extends PortfolioBase {
      public readonly id = id
      public readonly portfolioId = parts.resourceName ?? throwError('Portfolio arn missing Portfolio ID during import from attributes');
      public readonly portfolioArn = attrs.portfolioArn;
      public readonly portfolioName = attrs.portfolioName;

      protected getKeyForPortfolio(value: string): string {
        return getIdentifier(this.portfolioArn, value);
      }
    }
    return new Import(scope, id);
  }

  public readonly portfolioArn: string;
  public readonly portfolioName: string;
  public readonly portfolioId: string;

  private readonly portfolio: CfnPortfolio;

  constructor(scope: Construct, id: string, props: PortfolioProps) {
    super(scope, id, {
      physicalName: props.portfolioName,
    });

    this.validatePortfolioProps(props);

    this.portfolio = new CfnPortfolio(this, 'Resource', {
      displayName: props.portfolioName,
      providerName: props.providerName,
      description: props.description,
      tags: props.tags,
      acceptLanguage: props.acceptLanguage,
    });

    this.portfolioArn = this.getResourceArnAttribute(this.portfolio.ref, {
      service: 'catalog',
      resource: 'portfolio',
      resourceName: this.physicalName,
    });

    this.portfolioName = this.getResourceNameAttribute(props.portfolioName);
    this.portfolioId = this.getResourceNameAttribute(this.portfolio.ref);
  }

  protected getKeyForPortfolio(value: string): string {
    return getIdentifier(Names.nodeUniqueId(this.portfolio.node), value);
  }

  private validatePortfolioProps(props: PortfolioProps) {
    InputValidator.validateLength(props.portfolioName, 'portfolioName', 1, 100, props.portfolioName);
    InputValidator.validateLength(props.portfolioName, 'providerName', 1, 50, props.providerName);
    InputValidator.validateLength(props.portfolioName, 'description', 0, 2000, props.description);
  }
}

/**
 * The principal type
 * Only supported version currently is IAM
 */
enum PrincipalType {
  /**
   * IAM
   */
  IAM = 'IAM'
}
