import * as iam from '@aws-cdk/aws-iam';
import { IResource, Names, Resource, Stack } from '@aws-cdk/core';
import { AcceptLanguage } from './common';
import { getIdentifier } from './private/util';
import { InputValidator } from './private/validation';
import { CfnPortfolio, CfnPortfolioPrincipalAssociation, CfnPortfolioShare } from './servicecatalog.generated';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from 'constructs';

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
   * Share portfolio with another account.
   * @param accountId AWS account to share portfolio with
   * @param options Options for the initiate share
   */
  share(accountId: string, options?: PortfolioShareOptions): void;
}

/**
 * Represents a Service Catalog Portfolio.
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
   * Share the portfolio with a designated account.
   */
  public share(accountId: string, options?: PortfolioShareOptions) {
    const hashId = this.getKeyForPortfolio(accountId);
    new CfnPortfolioShare(this, `PortfolioShare${hashId}`, {
      portfolioId: this.portfolioId,
      accountId: accountId,
      shareTagOptions: options?.shareTagOptions,
      acceptLanguage: options?.acceptLanguage,
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
   * Create a unique id based off the L1 CfnPortfolio or the arn of an imported portfolio.
   */
  protected abstract getKeyForPortfolio(value: string): string;
}

/**
 * Properties for a Portfolio.
 */
export interface PortfolioProps {

  /**
   * The name of the portfolio.
   */
  readonly name: string;

  /**
   * The provider name.
   */
  readonly provider: string;

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
    const arn = Stack.of(scope).parseArn(portfolioArn);
    const portfolioId = arn.resourceName;

    if (!portfolioId) {
      throw new Error('Missing required Portfolio ID from Portfolio ARN: ' + portfolioArn);
    }

    class Import extends PortfolioBase {
      portfolioArn = portfolioArn;
      portfolioId = portfolioId!;

      protected getKeyForPortfolio(value: string): string {
        return getIdentifier(this.portfolioArn, value);
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

    this.validatePortfolioProps(props, id);

    this.portfolio = new CfnPortfolio(this, 'Resource', {
      displayName: props.name,
      providerName: props.provider,
      description: props.description,
      acceptLanguage: props.acceptLanguage,
    });

    this.portfolioId = this.portfolio.ref;

    this.portfolioArn = Stack.of(this).formatArn({
      service: 'servicecatalog',
      resource: 'portfolio',
      resourceName: this.portfolioId,
    });
  }

  protected getKeyForPortfolio(value: string): string {
    return getIdentifier(Names.nodeUniqueId(this.portfolio.node), value);
  }

  private validatePortfolioProps(props: PortfolioProps, id: string) {
    InputValidator.validateLength(id, 'portfolio name', 1, 100, props.name);
    InputValidator.validateLength(id, 'provider name', 1, 50, props.provider);
    InputValidator.validateLength(id, 'description', 0, 2000, props.description);
  }
}

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
 * The principal type
 * Only supported version currently is IAM
 */
enum PrincipalType {
  /**
   * IAM
   */
  IAM = 'IAM'
}
