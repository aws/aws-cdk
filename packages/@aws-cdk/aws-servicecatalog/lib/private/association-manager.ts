import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { hashValues } from './util';
import { InputValidator } from './validation';
import {
  CloudFormationRuleConstraintOptions, CommonConstraintOptions, StackSetsConstraintOptions,
  TagUpdateConstraintOptions, TemplateRule, TemplateRuleAssertion,
} from '../constraints';
import { IPortfolio } from '../portfolio';
import { IProduct } from '../product';
import {
  CfnLaunchNotificationConstraint, CfnLaunchRoleConstraint, CfnLaunchTemplateConstraint, CfnPortfolioProductAssociation,
  CfnResourceUpdateConstraint, CfnStackSetConstraint, CfnTagOptionAssociation,
} from '../servicecatalog.generated';
import { TagOptions } from '../tag-options';

export class AssociationManager {
  public static associateProductWithPortfolio(
    portfolio: IPortfolio, product: IProduct, options: CommonConstraintOptions | undefined,
  ): { associationKey: string, cfnPortfolioProductAssociation: CfnPortfolioProductAssociation } {
    InputValidator.validateLength(this.prettyPrintAssociation(portfolio, product), 'description', 0, 2000, options?.description);
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
    const association = this.associateProductWithPortfolio(portfolio, product, options);
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
      constraint.addDependency(association.cfnPortfolioProductAssociation);
    } else {
      throw new Error(`Cannot have multiple tag update constraints for association ${this.prettyPrintAssociation(portfolio, product)}`);
    }
  }

  public static notifyOnStackEvents(portfolio: IPortfolio, product: IProduct, topic: sns.ITopic, options: CommonConstraintOptions): void {
    const association = this.associateProductWithPortfolio(portfolio, product, options);
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
      constraint.addDependency(association.cfnPortfolioProductAssociation);
    } else {
      throw new Error(`Topic ${topic.node.path} is already subscribed to association ${this.prettyPrintAssociation(portfolio, product)}`);
    }
  }

  public static constrainCloudFormationParameters(
    portfolio: IPortfolio, product: IProduct,
    options: CloudFormationRuleConstraintOptions,
  ): void {
    const association = this.associateProductWithPortfolio(portfolio, product, options);
    const constructId = `LaunchTemplateConstraint${hashValues(association.associationKey, options.rule.ruleName)}`;

    if (!portfolio.node.tryFindChild(constructId)) {
      const constraint = new CfnLaunchTemplateConstraint(portfolio as unknown as cdk.Resource, constructId, {
        acceptLanguage: options.messageLanguage,
        description: options.description,
        portfolioId: portfolio.portfolioId,
        productId: product.productId,
        rules: this.formatTemplateRule(portfolio.stack, options.rule),
      });

      // Add dependsOn to force proper order in deployment.
      constraint.addDependency(association.cfnPortfolioProductAssociation);
    } else {
      throw new Error(`Provisioning rule ${options.rule.ruleName} already configured on association ${this.prettyPrintAssociation(portfolio, product)}`);
    }
  }

  public static setLaunchRole(portfolio: IPortfolio, product: IProduct, launchRole: iam.IRole, options: CommonConstraintOptions): void {
    this.setLaunchRoleConstraint(portfolio, product, options, {
      roleArn: launchRole.roleArn,
    });
  }

  public static setLocalLaunchRoleName(portfolio: IPortfolio, product: IProduct, launchRoleName: string, options: CommonConstraintOptions): void {
    this.setLaunchRoleConstraint(portfolio, product, options, {
      localRoleName: launchRoleName,
    });
  }

  public static deployWithStackSets(portfolio: IPortfolio, product: IProduct, options: StackSetsConstraintOptions) {
    const association = this.associateProductWithPortfolio(portfolio, product, options);
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
      constraint.addDependency(association.cfnPortfolioProductAssociation);
    } else {
      throw new Error(`Cannot configure multiple StackSet deployment constraints for association ${this.prettyPrintAssociation(portfolio, product)}`);
    }
  }

  public static associateTagOptions(resource: cdk.IResource, resourceId: string, tagOptions: TagOptions): void {
    for (const cfnTagOption of tagOptions._cfnTagOptions) {
      const tagAssocationConstructId = `TagOptionAssociation${hashValues(cfnTagOption.key, cfnTagOption.value, resource.node.addr)}`;
      if (!resource.node.tryFindChild(tagAssocationConstructId)) {
        new CfnTagOptionAssociation(resource as cdk.Resource, tagAssocationConstructId, {
          resourceId: resourceId,
          tagOptionId: cfnTagOption.ref,
        });
      }
    }
  }

  private static setLaunchRoleConstraint(
    portfolio: IPortfolio, product: IProduct, options: CommonConstraintOptions,
    roleOptions: LaunchRoleConstraintRoleOptions,
  ): void {
    const association = this.associateProductWithPortfolio(portfolio, product, options);
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
        roleArn: roleOptions.roleArn,
        localRoleName: roleOptions.localRoleName,
      });

      // Add dependsOn to force proper order in deployment.
      constraint.addDependency(association.cfnPortfolioProductAssociation);
    } else {
      throw new Error(`Cannot set multiple launch roles for association ${this.prettyPrintAssociation(portfolio, product)}`);
    }
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

  private static formatTemplateRule(stack: cdk.Stack, rule: TemplateRule): string {
    return JSON.stringify({
      [rule.ruleName]: {
        Assertions: this.formatAssertions(stack, rule.assertions),
        RuleCondition: rule.condition ? stack.resolve(rule.condition) : undefined,
      },
    });
  }

  private static formatAssertions(
    stack: cdk.Stack, assertions : TemplateRuleAssertion[],
  ): { Assert: string, AssertDescription: string | undefined }[] {
    return assertions.reduce((formattedAssertions, assertion) => {
      formattedAssertions.push( {
        Assert: stack.resolve(assertion.assert),
        AssertDescription: assertion.description,
      });
      return formattedAssertions;
    }, new Array<{ Assert: string, AssertDescription: string | undefined }>());
  };
}

interface LaunchRoleArnOption {
  readonly roleArn: string,
  readonly localRoleName?: never,
}

interface LaunchRoleNameOption {
  readonly localRoleName: string,
  readonly roleArn?: never,
}

type LaunchRoleConstraintRoleOptions = LaunchRoleArnOption | LaunchRoleNameOption;
