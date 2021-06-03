import * as iam from '@aws-cdk/aws-iam';
import { IResource, Names, Resource, Tag } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { AcceptLanguage, TagOption } from './common';
import { AddEventNotificationsProps, SetLaunchRoleProps, AddProvisioningRulesProps, AllowTagUpdatesProps, StackSetConstraintProps } from './constraints';
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
   *
   * @attribute
   */
  readonly portfolioArn: string;

  /**
   * The ID of the portfolio.
   *
   * @attribute
   */
  readonly portfolioId: string;

  /**
   * The name of the portfolio.
   *
   * @attribute
   */
  readonly portfolioName: string;

  /**
   * Associate portfolio with a principal
   * (Role/Group/User).
   * @param principal an IAM principal role
   */
  giveAccess(principal: iam.IIdentity): void;

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
  addEventNotifications(props: AddEventNotificationsProps): void;

  /**
   * Add a Launch Role Constraint.
   */
  addLaunchRole(props: SetLaunchRoleProps): void;

  /**
  * Add a Launch Template Constraint.
  */
  addProvisioningRules(props: AddProvisioningRulesProps): void;

  /**
  * Add a Resource Update Constraint.
  */
  allowTagUpdates(props: AllowTagUpdatesProps): void;

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
   * Enable the Portfolio for a specific Role, User or Group
   */
  public giveAccess(principal: iam.IIdentity) {
    const principalId = Names.nodeUniqueId(principal.node);
    switch (true) {
      case ('roleArn' in principal):
        this.associatePrincipal((principal as iam.Role).roleArn, principalId);
        break;
      case ('userArn' in principal):
        this.associatePrincipal((principal as iam.User).userArn, principalId);
        break;
      case ('groupArn' in principal):
        this.associatePrincipal((principal as iam.Group).groupArn, principalId);
        break;
      default:
        throw new Error(`Unrecognized end user type ${principal}`);
    }

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
   *
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
   *
   */
  public addEventNotifications(props: AddEventNotificationsProps) {
    InputValidator.validateLength('description', props.description, 0, 2000);
    AssociationManager.addLaunchNotificationConstraint(this, props);
  }

  /**
   * Add a launch role constraint.
   *
   */
  public addLaunchRole(props: SetLaunchRoleProps) {
    InputValidator.validateLength('description', props.description, 0, 2000);
    AssociationManager.addLaunchRoleConstraint(this, props);
  }

  /**
   * Add a launch template constraint.
   *
   */
  public addProvisioningRules(props: AddProvisioningRulesProps) {
    InputValidator.validateLength('description', props.description, 0, 2000);
    AssociationManager.addTemplateConstraint(this, props);
  }

  /**
   * Add a resource template constraint.
   *
   */
  public allowTagUpdates(props: AllowTagUpdatesProps) {
    InputValidator.validateLength('description', props.description, 0, 2000);
    AssociationManager.addResourceUpdateConstraint(this, props);
  }

  /**
   * Add a stack set template constraint.
   */
  public addStackSetConstraint(props: StackSetConstraintProps) {
    InputValidator.validateLength('description', props.description, 0, 2000);
    AssociationManager.addStackSetConstraint(this, props);
  }

  /**
 * add tagOptions
 * @param tagOption
 */
  public addTagOptions(tagOption: TagOption) {
    Object.keys(tagOption).forEach(key => {
      InputValidator.validateLength('key', key, 1, 128);
      tagOption[key].forEach(value => {
        InputValidator.validateLength('value', value.value, 1, 256);
      });
    });
    AssociationManager.associateTagOption(this, this.portfolioId, tagOption);
  }

  /**
   * Create a unique id based off the L1 portfolio.
   *
   */
  protected abstract getKeyForPortfolio(value: string): string;
}

/**
 * Properties for a Portfolio.
 */
export interface PortfolioProps {

  /**
     * Enforces a particular physical portfolio name.
     * @default <generated>
     */
  readonly portfolioName: string;

  /**
     * The provider name.
     *
     */
  readonly providerName: string;

  /**
     * The accept language.
     * @default
     */
  readonly acceptLanguage?: AcceptLanguage;

  /**
     * Description for portfolio.
     *
     * @default
     */
  readonly description?: string;


  /**
     * A collection of tags attached to portfolio.
     * @default
     *
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
    class Import extends PortfolioBase {
      public readonly id = id
      public readonly portfolioId = attrs.portfolioArn.split('/').pop()!
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
      resourceName: this.portfolio.ref,
    });

    this.portfolioName = this.getResourceNameAttribute(props.portfolioName);

    this.portfolioId = this.getResourceNameAttribute(this.portfolio.ref);

  }

  protected getKeyForPortfolio(value: string): string {
    return getIdentifier(Names.nodeUniqueId(this.portfolio.node), value);
  }

  private validatePortfolioProps(props: PortfolioProps) {
    InputValidator.validateLength('portfolioName', props.portfolioName, 1, 100);
    InputValidator.validateLength('providerName', props.providerName, 1, 50);
    InputValidator.validateLength('description', props.description, 0, 2000);
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