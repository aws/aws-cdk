import * as cdk from '@aws-cdk/core';
import { TagOption } from '../common';
import { TagUpdatesOptions } from '../constraints';
import { IPortfolio } from '../portfolio';
import { IProduct } from '../product';
import { CfnPortfolioProductAssociation, CfnResourceUpdateConstraint, CfnTagOption, CfnTagOptionAssociation } from '../servicecatalog.generated';
import { hashValues } from './util';
import { InputValidator } from './validation';

export class AssociationManager {
  public static associateProductWithPortfolio(scope: cdk.Resource, portfolio: IPortfolio, product: IProduct) {
    const associationKey = hashValues(portfolio.node.addr, product.node.addr, scope.stack.node.addr);
    if (!this.associationMap.has(associationKey)) {
      const association = new CfnPortfolioProductAssociation(scope, `PortfolioProductAssociation${associationKey}`, {
        portfolioId: portfolio.portfolioId,
        productId: product.productId,
      });

      const associationValue = new Map<Constraints, CfnConstraintResource>();
      associationValue.set(Constraints.ASSOCIATION, association);
      this.associationMap.set(associationKey, associationValue);
    }
  }

  public static addResourceUpdateConstraint(scope: cdk.Resource, portfolio: IPortfolio, product: IProduct, options: TagUpdatesOptions) {
    const associationKey = this.associationPrecheck(scope, portfolio, product);
    InputValidator.validateLength(this.prettyPrintAssociation(scope, portfolio, product), 'description', 0, 2000, options.description);
    if (!this.associationMap.get(associationKey)!.has(Constraints.RESOURCE_UPDATE)) {
      const constraint = new CfnResourceUpdateConstraint(scope, `ResourceUpdateConstraint${associationKey}`, {
        acceptLanguage: options.acceptedMessageLanguage,
        description: options.description,
        portfolioId: portfolio.portfolioId,
        productId: product.productId,
        tagUpdateOnProvisionedProduct: options.allowUpdatingProvisionedProductTags === false ? Allowed.NOT_ALLOWED : Allowed.ALLOWED,
      });

      constraint.addDependsOn(this.associationMap.get(associationKey)!.get(Constraints.ASSOCIATION)!);
      this.associationMap.get(associationKey)!.set(Constraints.RESOURCE_UPDATE, constraint);
    } else {
      throw new Error(`Cannot have multiple resource update constraints for association ${this.prettyPrintAssociation(scope, portfolio, product)}`);
    }
  }

  public static associateTagOption(scope: cdk.Resource, resourceId: string, tagOption: TagOption) {
    Object.keys(tagOption).forEach(key => {
      InputValidator.validateLength(resourceId, 'TagOption key', 1, 128, key);
      tagOption[key].forEach(value => {
        InputValidator.validateLength(resourceId, 'TagOption value', 1, 256, value.value);
        const tagOptionKey = hashValues(key, value.value, scope.stack.node.addr);
        if (!this.tagOptionMap.has(tagOptionKey)) {
          const cfnTagOption = new CfnTagOption(scope, `TagOption${tagOptionKey}`, {
            key: key,
            value: value.value,
            active: value.active ?? true,
          });
          this.tagOptionMap.set(tagOptionKey, cfnTagOption);

          new CfnTagOptionAssociation(scope, `TagOptionAssociation${hashValues(scope.node.addr, tagOptionKey)}`, {
            resourceId: resourceId,
            tagOptionId: this.tagOptionMap.get(tagOptionKey)!.ref,
          });
        }
      });
    });
  }


  private static associationMap = new Map<string, Map<Constraints, CfnConstraintResource>>();
  private static tagOptionMap = new Map<string, CfnTagOption>();

  private static associationPrecheck(scope: cdk.Resource, portfolio: IPortfolio, product: IProduct): string {
    const associationKey = hashValues(portfolio.node.addr, product.node.addr, scope.stack.node.addr);
    if (!this.associationMap.has(associationKey)) {
      this.associateProductWithPortfolio(scope, portfolio, product);
    }
    return associationKey;
  }

  private static prettyPrintAssociation(scope: cdk.Resource, portfolio: IPortfolio, product: IProduct) {
    return `- Portfolio: ${scope.stack.resolve(portfolio.node.path)} | Product: ${scope.stack.resolve(product.node.path)}`;
  }
}

/**
 * Simplify type for constraint map to hold the L1 constraint resources.
 */
type CfnConstraintResource = CfnPortfolioProductAssociation | CfnResourceUpdateConstraint;


/**
 * Custom allow code
 */
enum Allowed {
  /**
   * Allow operation
   */
  ALLOWED = 'ALLOWED',

  /**
   * Not allowed operation
   */
  NOT_ALLOWED = 'NOT_ALLOWED'
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