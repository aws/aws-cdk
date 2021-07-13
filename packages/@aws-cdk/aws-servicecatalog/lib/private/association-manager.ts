import * as cdk from '@aws-cdk/core';
import { TagUpdateConstraintOptions } from '../constraints';
import { IPortfolio } from '../portfolio';
import { IProduct } from '../product';
import { CfnPortfolioProductAssociation, CfnResourceUpdateConstraint } from '../servicecatalog.generated';
import { hashValues } from './util';
import { InputValidator } from './validation';

/**
 * Simplify type for constraint map to hold the L1 constraint and association resources.
 */
type AssociationOrConstraint = CfnPortfolioProductAssociation | CfnResourceUpdateConstraint;

export class AssociationManager {
  public static associateProductWithPortfolio(scope: cdk.Resource, portfolio: IPortfolio, product: IProduct): void {
    const associationKey = this.getAssociationKey(scope, portfolio, product);
    if (this.checkConstraintOrAssocationExists(associationKey, Constraints.ASSOCIATION)) {
      const association = new CfnPortfolioProductAssociation(scope, `PortfolioProductAssociation${associationKey}`, {
        portfolioId: portfolio.portfolioId,
        productId: product.productId,
      });

      const associationValue = new Map<Constraints, AssociationOrConstraint>();
      associationValue.set(Constraints.ASSOCIATION, association);
      this.associationMap.set(associationKey, associationValue);
    }
  }

  public static allowTagUpdates(
    scope: cdk.Resource, portfolio: IPortfolio, product: IProduct,
    options: TagUpdateConstraintOptions,
  ): void {
    InputValidator.validateLength(this.prettyPrintAssociation(portfolio, product), 'description', 0, 2000, options.description);
    const associationKey = this.ensureProductIsAssociatedWithPortfolio(scope, portfolio, product);
    if (this.checkConstraintOrAssocationExists(associationKey, Constraints.RESOURCE_UPDATE)) {
      const constraint = new CfnResourceUpdateConstraint(scope, `ResourceUpdateConstraint${associationKey}`, {
        acceptLanguage: options.messageLanguage,
        description: options.description,
        portfolioId: portfolio.portfolioId,
        productId: product.productId,
        tagUpdateOnProvisionedProduct: options.allowUpdatingProvisionedProductTags === false ? 'NOT_ALLOWED' : 'ALLOWED',
      });

      // Add dependsOn to force proper order in deployment.
      constraint.addDependsOn(this.associationMap.get(associationKey)!.get(Constraints.ASSOCIATION)!);
      this.associationMap.get(associationKey)!.set(Constraints.RESOURCE_UPDATE, constraint);
    } else {
      throw new Error(`Cannot have multiple resource update constraints for association ${this.prettyPrintAssociation(portfolio, product)}`);
    }
  }

  private static associationMap = new Map<string, Map<Constraints, AssociationOrConstraint>>();

  private static getAssociationKey(scope: cdk.Resource, portfolio: IPortfolio, product: IProduct): string {
    return hashValues(portfolio.node.addr, product.node.addr, scope.stack.node.addr);
  }

  private static ensureProductIsAssociatedWithPortfolio(scope: cdk.Resource, portfolio: IPortfolio, product: IProduct): string {
    const associationKey = this.getAssociationKey(scope, portfolio, product);
    // We can still call this because it will check if the association already exists before creating a new one
    this.associateProductWithPortfolio(scope, portfolio, product);
    return associationKey;
  }

  private static checkConstraintOrAssocationExists(associationKey: string, constraint: Constraints): boolean {
    if (constraint === Constraints.ASSOCIATION) {
      return !this.associationMap.has(associationKey);
    }
    return !this.associationMap.get(associationKey)!.has(constraint);
  }

  private static prettyPrintAssociation(portfolio: IPortfolio, product: IProduct): string {
    return `- Portfolio: ${portfolio.node.path} | Product: ${product.node.path}`;
  }
}

/**
 * Constraint keys for map
 */
enum Constraints {
  /**
   * Association key
   */
  ASSOCIATION = 'association',

  /**
   * Resource update constraint key
   */
  RESOURCE_UPDATE = 'resourceUpdate'
}