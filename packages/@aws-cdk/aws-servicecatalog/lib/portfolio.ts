import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { AcceptLanguage } from './common';
import { hashValues } from './private/util';
import { InputValidator } from './private/validation';
import { CfnPortfolio, CfnPortfolioPrincipalAssociation, CfnPortfolioShare } from './servicecatalog.generated';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from 'constructs';

/**
 * Options for portfolio share.
 */
export interface PortfolioShareOptions {
  /**
   * Whether to share tagOptions as a part of the portfolio share
   * @default - share not specified
   */
  readonly shareTagOptions?: boolean;

  /**
   * The accept language of the share
   * @default - accept language not specified
   */
  readonly acceptLanguage?: AcceptLanguage;
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
}

abstract class PortfolioBase extends cdk.Resource implements IPortfolio {
  public abstract readonly portfolioArn: string;
  public abstract readonly portfolioId: string;
  private readonly associatedPrincipals: Set<string> = new Set();

  public giveAccessToRole(role: iam.IRole): void {
    this.associatePrincipal(role.roleArn, role.node.addr);
  }

  public giveAccessToUser(user: iam.IUser): void {
    this.associatePrincipal(user.userArn, user.node.addr);
  }

  public giveAccessToGroup(group: iam.IGroup): void {
    this.associatePrincipal(group.groupArn, group.node.addr);
  }

  public shareWithAccount(accountId: string, options: PortfolioShareOptions = {}): void {
    const hashId = this.generateUniqueHash(accountId);
    new CfnPortfolioShare(this, `PortfolioShare${hashId}`, {
      portfolioId: this.portfolioId,
      accountId: accountId,
      shareTagOptions: options.shareTagOptions,
      acceptLanguage: options.acceptLanguage,
    });
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
   * The accept language.
   * @default - No accept language provided
   */
  readonly acceptLanguage?: AcceptLanguage;

  /**
   * Description for portfolio.
   * @default - No description provided
   */
  readonly description?: string;
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
    const arn = cdk.Stack.of(scope).parseArn(portfolioArn);
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
      acceptLanguage: props.acceptLanguage,
    });
    this.portfolioId = this.portfolio.ref;
    this.portfolioArn = cdk.Stack.of(this).formatArn({
      service: 'servicecatalog',
      resource: 'portfolio',
      resourceName: this.portfolioId,
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
