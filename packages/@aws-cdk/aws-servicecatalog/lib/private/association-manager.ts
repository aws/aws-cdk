import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { CommonConstraintOptions, StackSetsConstraintOptions, TagUpdateConstraintOptions } from '../constraints';
import { IPortfolio } from '../portfolio';
import { IProduct } from '../product';
import {
  CfnLaunchNotificationConstraint, CfnLaunchRoleConstraint, CfnPortfolioProductAssociation,
  CfnResourceUpdateConstraint, CfnStackSetConstraint, CfnTagOption, CfnTagOptionAssociation,
} from '../servicecatalog.generated';
import { TagOptions } from '../tag-options';
import { hashValues } from './util';
import { InputValidator } from './validation';

export class AssociationManager {
  public static associateProductWithPortfolio(
    portfolio: IPortfolio, product: IProduct,
  ): { associationKey: string, cfnPortfolioProductAssociation: CfnPortfolioProductAssociation } {
    const associationKey = hashValues(portfolio.node.addr, product.node.addr, product.stack.node.addr);
    const constructId = `PortfolioProductAssociation${associationKey}`;
    const existingAssociation = portfolio.node.tryFindChild(constructId);
    const cfnAssociation = existingAssociation
      ? existingAssociation as CfnPortfolioProductAssociation
      : new CfnPortfolioProductAssociation(portfolio as unknown as cdk.Resource, constructId, {
        portfolioId: portfolio.portfolioId,
        productId: product.productId,
      });

    return {
      associationKey: associationKey,
      cfnPortfolioProductAssociation: cfnAssociation,
    };
  }

  public static constrainTagUpdates(portfolio: IPortfolio, product: IProduct, options: TagUpdateConstraintOptions): void {
    this.validateCommonConstraintOptions(portfolio, product, options);
    const association = this.associateProductWithPortfolio(portfolio, product);
    const constructId = `ResourceUpdateConstraint${association.associationKey}`;

    if (!portfolio.node.tryFindChild(constructId)) {
      const constraint = new CfnResourceUpdateConstraint(portfolio as unknown as cdk.Resource, constructId, {
        acceptLanguage: options.messageLanguage,
        description: options.description,
        portfolioId: portfolio.portfolioId,
        productId: product.productId,
        tagUpdateOnProvisionedProduct: options.allow === false ? 'NOT_ALLOWED' : 'ALLOWED',
      });

      // Add dependsOn to force proper order in deployment.
      constraint.addDependsOn(association.cfnPortfolioProductAssociation);
    } else {
      throw new Error(`Cannot have multiple tag update constraints for association ${this.prettyPrintAssociation(portfolio, product)}`);
    }
  }

  public static notifyOnStackEvents(portfolio: IPortfolio, product: IProduct, topic: sns.ITopic, options: CommonConstraintOptions): void {
    this.validateCommonConstraintOptions(portfolio, product, options);
    const association = this.associateProductWithPortfolio(portfolio, product);
    const constructId = `LaunchNotificationConstraint${hashValues(topic.node.addr, topic.stack.node.addr, association.associationKey)}`;

    if (!portfolio.node.tryFindChild(constructId)) {
      const constraint = new CfnLaunchNotificationConstraint(portfolio as unknown as cdk.Resource, constructId, {
        acceptLanguage: options.messageLanguage,
        description: options.description,
        portfolioId: portfolio.portfolioId,
        productId: product.productId,
        notificationArns: [topic.topicArn],
      });

      // Add dependsOn to force proper order in deployment.
      constraint.addDependsOn(association.cfnPortfolioProductAssociation);
    } else {
      throw new Error(`Topic ${topic.node.path} is already subscribed to association ${this.prettyPrintAssociation(portfolio, product)}`);
    }
  }

  public static setLaunchRole(portfolio: IPortfolio, product: IProduct, launchRole: iam.IRole, options: CommonConstraintOptions): void {
    this.validateCommonConstraintOptions(portfolio, product, options);
    const association = this.associateProductWithPortfolio(portfolio, product);
    // Check if a stackset deployment constraint has already been configured.
    if (portfolio.node.tryFindChild(this.stackSetConstraintLogicalId(association.associationKey))) {
      throw new Error(`Cannot set launch role when a StackSet rule is already defined for association ${this.prettyPrintAssociation(portfolio, product)}`);
    }

    const constructId = this.launchRoleConstraintLogicalId(association.associationKey);
    if (!portfolio.node.tryFindChild(constructId)) {
      const constraint = new CfnLaunchRoleConstraint(portfolio as unknown as cdk.Resource, constructId, {
        acceptLanguage: options.messageLanguage,
        description: options.description,
        portfolioId: portfolio.portfolioId,
        productId: product.productId,
        roleArn: launchRole.roleArn,
      });

      // Add dependsOn to force proper order in deployment.
      constraint.addDependsOn(association.cfnPortfolioProductAssociation);
    } else {
      throw new Error(`Cannot set multiple launch roles for association ${this.prettyPrintAssociation(portfolio, product)}`);
    }
  }

  public static deployWithStackSets(portfolio: IPortfolio, product: IProduct, options: StackSetsConstraintOptions) {
    this.validateCommonConstraintOptions(portfolio, product, options);
    const association = this.associateProductWithPortfolio(portfolio, product);
    // Check if a launch role has already been set.
    if (portfolio.node.tryFindChild(this.launchRoleConstraintLogicalId(association.associationKey))) {
      throw new Error(`Cannot configure StackSet deployment when a launch role is already defined for association ${this.prettyPrintAssociation(portfolio, product)}`);
    }

    const constructId = this.stackSetConstraintLogicalId(association.associationKey);
    if (!portfolio.node.tryFindChild(constructId)) {
      const constraint = new CfnStackSetConstraint(portfolio as unknown as cdk.Resource, constructId, {
        acceptLanguage: options.messageLanguage,
        description: options.description ?? '',
        portfolioId: portfolio.portfolioId,
        productId: product.productId,
        accountList: options.accounts,
        regionList: options.regions,
        adminRole: options.adminRole.roleArn,
        executionRole: options.executionRoleName,
        stackInstanceControl: options.allowStackSetInstanceOperations ? 'ALLOWED' : 'NOT_ALLOWED',
      });

      // Add dependsOn to force proper order in deployment.
      constraint.addDependsOn(association.cfnPortfolioProductAssociation);
    } else {
      throw new Error(`Cannot configure multiple StackSet deployment constraints for association ${this.prettyPrintAssociation(portfolio, product)}`);
    }
  }

  public static associateTagOptions(portfolio: IPortfolio, tagOptions: TagOptions): void {
    const portfolioStack = cdk.Stack.of(portfolio);
    for (const [key, tagOptionsList] of Object.entries(tagOptions.tagOptionsMap)) {
      InputValidator.validateLength(portfolio.node.addr, 'TagOption key', 1, 128, key);
      tagOptionsList.forEach((value: string) => {
        InputValidator.validateLength(portfolio.node.addr, 'TagOption value', 1, 256, value);
        const tagOptionKey = hashValues(key, value, portfolioStack.node.addr);
        const tagOptionConstructId = `TagOption${tagOptionKey}`;
        let cfnTagOption = portfolioStack.node.tryFindChild(tagOptionConstructId) as CfnTagOption;
        if (!cfnTagOption) {
          cfnTagOption = new CfnTagOption(portfolioStack, tagOptionConstructId, {
            key: key,
            value: value,
            active: true,
          });
        }
        const tagAssocationKey = hashValues(key, value, portfolio.node.addr);
        const tagAssocationConstructId = `TagOptionAssociation${tagAssocationKey}`;
        if (!portfolio.node.tryFindChild(tagAssocationConstructId)) {
          new CfnTagOptionAssociation(portfolio as unknown as cdk.Resource, tagAssocationConstructId, {
            resourceId: portfolio.portfolioId,
            tagOptionId: cfnTagOption.ref,
          });
        }
      });
    };
  }

  private static stackSetConstraintLogicalId(associationKey: string): string {
    return `StackSetConstraint${associationKey}`;
  }

  private static launchRoleConstraintLogicalId(associationKey:string): string {
    return `LaunchRoleConstraint${associationKey}`;
  }

  private static prettyPrintAssociation(portfolio: IPortfolio, product: IProduct): string {
    return `- Portfolio: ${portfolio.node.path} | Product: ${product.node.path}`;
  }

  private static validateCommonConstraintOptions(portfolio: IPortfolio, product: IProduct, options: CommonConstraintOptions): void {
    InputValidator.validateLength(this.prettyPrintAssociation(portfolio, product), 'description', 0, 2000, options.description);
  }
}
