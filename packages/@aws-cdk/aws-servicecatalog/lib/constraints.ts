import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { MessageLanguage } from './common';

/**
 * Properties for governance mechanisms and constraints.
 */
export interface CommonConstraintOptions {
  /**
   * The language code.
   * Configures the language for error messages from service catalog.
   *
   * @default - English
   */
  readonly messageLanguage?: MessageLanguage;

  /**
   * The description of the constraint.
   *
   * @default - No description provided
   */
  readonly description?: string;
}

/**
 * Properties for deploying with Stackset, which creates a StackSet constraint.
 */
export interface StackSetsConstraintOptions extends CommonConstraintOptions {
  /**
   * List of accounts to deploy stacks to.
   */
  readonly accounts: string[];

  /**
   * List of regions to deploy stacks to.
   */
  readonly regions: string[];

  /**
   * IAM role used to administer the StackSets configuration.
   */
  readonly adminRole: iam.IRole;

  /**
   * IAM role used to provision the products in the Stacks.
   */
  readonly executionRoleName: string;

  /**
   * Wether to allow end users to create, update, and delete stacks.
   *
   * @default false
   */
  readonly allowStackSetInstanceOperations?: boolean;
}

/**
 * Properties for ResourceUpdateConstraint.
 */
export interface TagUpdateConstraintOptions extends CommonConstraintOptions {
  /**
   * Toggle for if users should be allowed to change/update tags on provisioned products.
   * @default true
   */
  readonly allow?: boolean;
}

/**
 * An assertion within a template rule, defined by intrinsic functions.
 */
export interface TemplateRuleAssertion {
  /**
   * The assertion condition.
   */
  readonly assert: cdk.ICfnRuleConditionExpression;

  /**
   * The description for the asssertion.
   * @default - no description provided for the assertion.
   */
  readonly description?: string;
}

/**
 * Defines the provisioning template constraints.
 */
export interface TemplateRule {
  /**
   * Name of the rule.
   */
  readonly ruleName: string;

  /**
   * Specify when to apply rule with a rule-specific intrinsic function.
   * @default - no rule condition provided
   */
  readonly condition?: cdk.ICfnRuleConditionExpression;

  /**
   * A list of assertions that make up the rule.
   */
  readonly assertions: TemplateRuleAssertion[];
}

/**
 * Properties for provisoning rule constraint.
 */
export interface CloudFormationRuleConstraintOptions extends CommonConstraintOptions {
  /**
   * The rule with condition and assertions to apply to template.
   */
  readonly rule: TemplateRule;
}