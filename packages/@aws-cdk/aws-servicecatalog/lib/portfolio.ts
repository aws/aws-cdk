import * as iam from '@aws-cdk/aws-iam';
import { IBucket } from '@aws-cdk/aws-s3';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { Construct, IConstruct } from 'constructs';
import { MessageLanguage } from './common';
import {
  CloudFormationRuleConstraintOptions, CommonConstraintOptions,
  StackSetsConstraintOptions, TagUpdateConstraintOptions,
} from './constraints';
import { AssociationManager } from './private/association-manager';
import { hashValues } from './private/util';
import { InputValidator } from './private/validation';
import { IProduct } from './product';
import { CfnPortfolio, CfnPortfolioPrincipalAssociation, CfnPortfolioShare } from './servicecatalog.generated';
import { TagOptions } from './tag-options';

/**
 * Options for portfolio share.
 */
export interface PortfolioShareOptions {
  /**
   * Whether to share tagOptions as a part of the portfolio share
   *
   * @default - share not specified
   */
  readonly shareTagOptions?: boolean;

  /**
   * The message language of the share.
   * Controls status and error message language for share.
   *
   * @default - English
   */
  readonly messageLanguage?: MessageLanguage;
}

/**
 * A Service Catalog portfolio.
 */
export interface IPortfolio extends cdk.IResource {
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
   * Associate portfolio with an IAM Group.
   * @param group an IAM Group
   */
  giveAccessToGroup(group: iam.IGroup): void;

  /**
   * Initiate a portfolio share with another account.
   * @param accountId AWS account to share portfolio with
   * @param options Options for the initiate share
   */
  shareWithAccount(accountId: string, options?: PortfolioShareOptions): void;

  /**
   * Associate portfolio with the given product.
   * @param product A service catalog produt.
   */
  addProduct(product: IProduct): void;

  /**
   * Associate Tag Options.
   * A TagOption is a key-value pair managed in AWS Service Catalog.
   * It is not an AWS tag, but serves as a template for creating an AWS tag based on the TagOption.
   */
  associateTagOptions(tagOptions: TagOptions): void;

  /**
   * Add a Resource Update Constraint.
   */
  constrainTagUpdates(product: IProduct, options?: TagUpdateConstraintOptions): void;

  /**
   * Add notifications for supplied topics on the provisioned product.
   * @param product A service catalog product.
   * @param topic A SNS Topic to receive notifications on events related to the provisioned product.
   */
  notifyOnStackEvents(product: IProduct, topic: sns.ITopic, options?: CommonConstraintOptions): void;

  /**
   * Set provisioning rules for the product.
   * @param product A service catalog product.
   * @param options options for the constraint.
   */
  constrainCloudFormationParameters(product: IProduct, options: CloudFormationRuleConstraintOptions): void;

  /**
   * Force users to assume a certain role when launching a product.
   * This sets the launch role using the role arn which is tied to the account this role exists in.
   * This is useful if you will be provisioning products from the account where this role exists.
   * If you intend to share the portfolio across accounts, use a local launch role.
   *
   * @param product A service catalog product.
   * @param launchRole The IAM role a user must assume when provisioning the product.
   * @param options options for the constraint.
   */
  setLaunchRole(product: IProduct, launchRole: iam.IRole, options?: CommonConstraintOptions): void;

  /**
   * Force users to assume a certain role when launching a product.
   * The role will be referenced by name in the local account instead of a static role arn.
   * A role with this name will automatically be created and assumable by Service Catalog in this account.
   * This is useful when sharing the portfolio with multiple accounts.
   *
   * @param product A service catalog product.
   * @param launchRoleName The name of the IAM role a user must assume when provisioning the product. A role with this name must exist in the account where the portolio is created and the accounts it is shared with.
   * @param options options for the constraint.
   */
  setLocalLaunchRoleName(product: IProduct, launchRoleName: string, options?: CommonConstraintOptions): iam.IRole;

  /**
   * Force users to assume a certain role when launching a product.
   * The role name will be referenced by in the local account and must be set explicitly.
   * This is useful when sharing the portfolio with multiple accounts.
   *
   * @param product A service catalog product.
   * @param launchRole The IAM role a user must assume when provisioning the product. A role with this name must exist in the account where the portolio is created and the accounts it is shared with. The role name must be set explicitly.
   * @param options options for the constraint.
   */
  setLocalLaunchRole(product: IProduct, launchRole: iam.IRole, options?: CommonConstraintOptions): void;

  /**
   * Configure deployment options using AWS Cloudformation StackSets
   *
   * @param product A service catalog product.
   * @param options Configuration options for the constraint.
   */
  deployWithStackSets(product: IProduct, options: StackSetsConstraintOptions): void;
}

abstract class PortfolioBase extends cdk.Resource implements IPortfolio {
  public abstract readonly portfolioArn: string;
  public abstract readonly portfolioId: string;
  private readonly associatedPrincipals: Set<string> = new Set();
  private readonly assetBuckets: Set<IBucket> = new Set<IBucket>();
  private readonly sharedAccounts: string[] = [];

  public giveAccessToRole(role: iam.IRole): void {
    this.associatePrincipal(role.roleArn, role.node.addr);
  }

  public giveAccessToUser(user: iam.IUser): void {
    this.associatePrincipal(user.userArn, user.node.addr);
  }

  public giveAccessToGroup(group: iam.IGroup): void {
    this.associatePrincipal(group.groupArn, group.node.addr);
  }

  public addProduct(product: IProduct): void {
    if (product.assetBuckets) {
      for (const bucket of product.assetBuckets) {
        this.assetBuckets.add(bucket);
      }
    }
    AssociationManager.associateProductWithPortfolio(this, product, undefined);
  }

  public shareWithAccount(accountId: string, options: PortfolioShareOptions = {}): void {
    const hashId = this.generateUniqueHash(accountId);
    this.sharedAccounts.push(accountId);
    new CfnPortfolioShare(this, `PortfolioShare${hashId}`, {
      portfolioId: this.portfolioId,
      accountId: accountId,
      shareTagOptions: options.shareTagOptions,
      acceptLanguage: options.messageLanguage,
    });
  }

  public associateTagOptions(tagOptions: TagOptions) {
    AssociationManager.associateTagOptions(this, this.portfolioId, tagOptions);
  }

  public constrainTagUpdates(product: IProduct, options: TagUpdateConstraintOptions = {}): void {
    AssociationManager.constrainTagUpdates(this, product, options);
  }

  public notifyOnStackEvents(product: IProduct, topic: sns.ITopic, options: CommonConstraintOptions = {}): void {
    AssociationManager.notifyOnStackEvents(this, product, topic, options);
  }

  public constrainCloudFormationParameters(product: IProduct, options: CloudFormationRuleConstraintOptions): void {
    AssociationManager.constrainCloudFormationParameters(this, product, options);
  }

  public setLaunchRole(product: IProduct, launchRole: iam.IRole, options: CommonConstraintOptions = {}): void {
    AssociationManager.setLaunchRole(this, product, launchRole, options);
  }

  public setLocalLaunchRoleName(product: IProduct, launchRoleName: string, options: CommonConstraintOptions = {}): iam.IRole {
    const launchRole: iam.IRole = new iam.Role(this, `LaunchRole${launchRoleName}`, {
      roleName: launchRoleName,
      assumedBy: new iam.ServicePrincipal('servicecatalog.amazonaws.com'),
    });
    AssociationManager.setLocalLaunchRoleName(this, product, launchRole.roleName, options);
    return launchRole;
  }

  public setLocalLaunchRole(product: IProduct, launchRole: iam.IRole, options: CommonConstraintOptions = {}): void {
    InputValidator.validateRoleNameSetForLocalLaunchRole(launchRole);
    AssociationManager.setLocalLaunchRoleName(this, product, launchRole.roleName, options);
  }

  public deployWithStackSets(product: IProduct, options: StackSetsConstraintOptions) {
    AssociationManager.deployWithStackSets(this, product, options);
  }

  /**
   * Associate a principal with the portfolio.
   * If the principal is already associated, it will skip.
   */
  private associatePrincipal(principalArn: string, principalId: string): void {
    if (!this.associatedPrincipals.has(principalArn)) {
      const hashId = this.generateUniqueHash(principalId);
      new CfnPortfolioPrincipalAssociation(this, `PortolioPrincipalAssociation${hashId}`, {
        portfolioId: this.portfolioId,
        principalArn: principalArn,
        principalType: 'IAM',
      });
      this.associatedPrincipals.add(principalArn);
    }
  }

  /**
   * Gives access to Asset Buckets to Shared Accounts.
   *
   */
  protected addBucketPermissionsToSharedAccounts() {
    if (this.sharedAccounts.length > 0) {
      for (const bucket of this.assetBuckets) {
        bucket.grantRead(new iam.CompositePrincipal(...this.sharedAccounts.map(account => new iam.AccountPrincipal(account))),
        );
      }
    }
  }

  /**
   * Create a unique id based off the L1 CfnPortfolio or the arn of an imported portfolio.
   */
  protected abstract generateUniqueHash(value: string): string;
}

/**
 * Properties for a Portfolio.
 */
export interface PortfolioProps {
  /**
   * The name of the portfolio.
   */
  readonly displayName: string;

  /**
   * The provider name.
   */
  readonly providerName: string;

  /**
   * The message language. Controls language for
   * status logging and errors.
   *
   * @default - English
   */
  readonly messageLanguage?: MessageLanguage;

  /**
   * Description for portfolio.
   *
   * @default - No description provided
   */
  readonly description?: string;

  /**
   * TagOptions associated directly to a portfolio.
   *
   * @default - No tagOptions provided
   */
  readonly tagOptions?: TagOptions
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
   * @param portfolioArn the Amazon Resource Name of the existing portfolio.
   */
  public static fromPortfolioArn(scope: Construct, id: string, portfolioArn: string): IPortfolio {
    const arn = cdk.Stack.of(scope).splitArn(portfolioArn, cdk.ArnFormat.SLASH_RESOURCE_NAME);
    const portfolioId = arn.resourceName;

    if (!portfolioId) {
      throw new Error('Missing required Portfolio ID from Portfolio ARN: ' + portfolioArn);
    }

    class Import extends PortfolioBase {
      public readonly portfolioArn = portfolioArn;
      public readonly portfolioId = portfolioId!;

      protected generateUniqueHash(value: string): string {
        return hashValues(this.portfolioArn, value);
      }
    }

    return new Import(scope, id, {
      environmentFromArn: portfolioArn,
    });
  }

  public readonly portfolioArn: string;
  public readonly portfolioId: string;
  private readonly portfolio: CfnPortfolio;

  constructor(scope: Construct, id: string, props: PortfolioProps) {
    super(scope, id);

    this.validatePortfolioProps(props);

    this.portfolio = new CfnPortfolio(this, 'Resource', {
      displayName: props.displayName,
      providerName: props.providerName,
      description: props.description,
      acceptLanguage: props.messageLanguage,
    });
    this.portfolioId = this.portfolio.ref;
    this.portfolioArn = cdk.Stack.of(this).formatArn({
      service: 'catalog',
      resource: 'portfolio',
      resourceName: this.portfolioId,
    });
    if (props.tagOptions !== undefined) {
      this.associateTagOptions(props.tagOptions);
    }

    const portfolioNodeId = this.node.id;
    cdk.Aspects.of(this).add({
      visit(c: IConstruct) {
        if (c.node.id === portfolioNodeId) {
          (c as Portfolio).addBucketPermissionsToSharedAccounts();
        };
      },
    });
  }

  protected generateUniqueHash(value: string): string {
    return hashValues(cdk.Names.nodeUniqueId(this.portfolio.node), value);
  }

  private validatePortfolioProps(props: PortfolioProps) {
    InputValidator.validateLength(this.node.path, 'portfolio display name', 1, 100, props.displayName);
    InputValidator.validateLength(this.node.path, 'portfolio provider name', 1, 50, props.providerName);
    InputValidator.validateLength(this.node.path, 'portfolio description', 0, 2000, props.description);
  }
}
