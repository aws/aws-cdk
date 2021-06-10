import * as cdk from '@aws-cdk/core';
import { CfnPortfolio } from './servicecatalog.generated';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from 'constructs';

/**
 * A Service Catalog portfolio.
 */
export interface IPortfolio extends cdk.IResource {
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
}

/**
 * Represents a Service Catalog portfolio.
 */
export class Portfolio extends cdk.Resource implements IPortfolio {
  /**
   * Imports a Portfolio construct created outside the CDK.
   *
   * @param scope the parent creating construct (usually `this`).
   * @param id the logical ID of the Portfolio
   * @param portfolioArn the Amazon Resource Name of the existing Portfolio
   */
  public static fromPortfolioArn(scope: Construct, id: string, portfolioArn: string): IPortfolio {
    const arn = cdk.Stack.of(scope).parseArn(portfolioArn);
    const portfolioId = arn.resourceName;

    if (!portfolioId) {
      throw new Error('Missing required Portfolio ID from Portfolio ARN: ' + portfolioArn);
    }

    return new class extends cdk.Resource implements IPortfolio {
      public readonly portfolioArn = portfolioArn;
      public readonly portfolioId = portfolioId!; // this is safe because of the check above
    }(scope, id, {
      environmentFromArn: portfolioArn,
    });
  }

  public readonly portfolioArn: string;

  public readonly portfolioId: string;

  constructor(scope: Construct, id: string, props: PortfolioProps) {
    super(scope, id);

    const cfnPortfolio = new CfnPortfolio(this, 'Resource', {
      displayName: props.portfolioName,
      providerName: props.providerName,
    });

    this.portfolioId = cfnPortfolio.ref;
    this.portfolioArn = cdk.Stack.of(this).formatArn({
      service: 'servicecatalog',
      resource: 'portfolio',
      resourceName: this.portfolioId,
    });
  }
}
