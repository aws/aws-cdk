import * as core from '@aws-cdk/core';
import * as constructs from 'constructs';
import { Language } from './language';
import { IProduct } from './product';
import { CfnPortfolio, CfnPortfolioProductAssociation } from './servicecatalog.generated';

/**
 * The interface that represents the portfolio.
*/
export interface IPortfolio extends core.IResource {
  /**
   * The portfolio arn.
   *
   * @attribute
   */
  readonly portfolioArn: string;

  /**
   * The portfolio identifier.
   *
   * @attribute
   */
  readonly portfolioId: string;

  /**
   * The portfolio name.
   *
   * @attribute
   */
  readonly portfolioName: string;

  /**
   * Associates a product to a portfolio.
   *
   * @param product Product to associate to the portfolio.
   * @returns boolean
   */
  associateProduct(product: IProduct): boolean
}

/**
 * Properties for the Portfolio
 */
export interface PortfolioProps {
  /**
   * Name of the portfolio.
   */
  readonly portfolioName: string;

  /**
   * The language code.
   *
   * @default en
   */
  readonly acceptLanguage?: Language

  /**
   * The name of the portfolio provider.
   */
  readonly provider: string;

  /**
   * The description of the portfolio.
   *
   * @default none
   */
  readonly description?: string;
}

/**
 * Attributes that represent the Portfolio resource.
 */
export interface PortfolioAttributes {
  /**
   * Arn of the portfolio.
   */
  readonly porfolioArn: string;
  /**
   * Name of the portfolio.
   */
  readonly portfolioName: string;
}

abstract class PortfolioBase extends core.Resource implements IPortfolio {
  public abstract readonly portfolioArn: string;
  public abstract readonly portfolioId: string;
  public abstract readonly portfolioName: string;
  public associateProduct(product: IProduct): boolean {
    new CfnPortfolioProductAssociation(this, 'associateProduct', { portfolioId: this.portfolioId, productId: product.productId });
    return true;
  }
}

/**
 * Creates an AWS Service Catalog Portfolio.
 */
export class Portfolio extends PortfolioBase {
  /**
   * Reference an existing portfolio, defined outside of the CDK code, by attributes.
   *
   * @param scope The parent construct
   * @param id The name of the portfolio construct
   * @param attrs attrs of the portfolio to import
   */
  public static fromPortfolioAttributes(scope: constructs.Construct, id: string, attrs: PortfolioAttributes): IPortfolio {
    class Import extends PortfolioBase {
      public readonly portfolioArn = attrs.porfolioArn;
      public readonly portfolioId = core.Stack.of(scope).parseArn(this.portfolioArn).resourceName!;
      public readonly portfolioName = attrs.portfolioName;
    }
    return new Import(scope, id);
  }
  public readonly portfolioArn: string;
  public readonly portfolioId: string;
  public readonly portfolioName: string;
  constructor(scope: constructs.Construct, id: string, props: PortfolioProps) {
    super(scope, id, { physicalName: props.portfolioName });
    const portfolio = new CfnPortfolio(this, 'Resource', { providerName: props.provider, displayName: props.portfolioName });
    this.portfolioArn = core.Stack.of(this).formatArn({ resource: 'portfolio', service: 'catalog', resourceName: portfolio.ref });
    this.portfolioName = portfolio.attrPortfolioName;
    this.portfolioId = portfolio.ref;
  }
}