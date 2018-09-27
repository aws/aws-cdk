import { Construct } from '../core/construct';
import { capitalizePropertyNames } from '../core/util';
import { FnCondition } from './fn';
import { Referenceable } from './stack';

/**
 * A rule can include a RuleCondition property and must include an Assertions property.
 * For each rule, you can define only one rule condition; you can define one or more asserts within the Assertions property.
 * You define a rule condition and assertions by using rule-specific intrinsic functions.
 *
 * You can use the following rule-specific intrinsic functions to define rule conditions and assertions:
 *
 *  Fn::And
 *  Fn::Contains
 *  Fn::EachMemberEquals
 *  Fn::EachMemberIn
 *  Fn::Equals
 *  Fn::If
 *  Fn::Not
 *  Fn::Or
 *  Fn::RefAll
 *  Fn::ValueOf
 *  Fn::ValueOfAll
 *
 * https://docs.aws.amazon.com/servicecatalog/latest/adminguide/reference-template_constraint_rules.html
 */
export interface RuleProps {
  /**
   * If the rule condition evaluates to false, the rule doesn't take effect.
   * If the function in the rule condition evaluates to true, expressions in each assert are evaluated and applied.
   */
  ruleCondition?: FnCondition;

  /**
   * Assertions which define the rule.
   */
  assertions?: RuleAssertion[];
}

/**
 * The Rules that define template constraints in an AWS Service Catalog portfolio describe when
 * end users can use the template and which values they can specify for parameters that are declared
 * in the AWS CloudFormation template used to create the product they are attempting to use. Rules
 * are useful for preventing end users from inadvertently specifying an incorrect value.
 * For example, you can add a rule to verify whether end users specified a valid subnet in a
 * given VPC or used m1.small instance types for test environments. AWS CloudFormation uses
 * rules to validate parameter values before it creates the resources for the product.
 *
 * A rule can include a RuleCondition property and must include an Assertions property.
 * For each rule, you can define only one rule condition; you can define one or more asserts within the Assertions property.
 * You define a rule condition and assertions by using rule-specific intrinsic functions.
 *
 * @link https://docs.aws.amazon.com/servicecatalog/latest/adminguide/reference-template_constraint_rules.html
 */
export class Rule extends Referenceable {
  /**
   * If the rule condition evaluates to false, the rule doesn't take effect.
   * If the function in the rule condition evaluates to true, expressions in each assert are evaluated and applied.
   */
  public ruleCondition?: FnCondition;

  /**
   * Assertions which define the rule.
   */
  public assertions?: RuleAssertion[];

  /**
   * Creates and adds a rule.
   * @param parent The parent construct.
   * @param props The rule props.
   */
  constructor(parent: Construct, name: string, props?: RuleProps) {
    super(parent, name);

    this.ruleCondition = props && props.ruleCondition;
    this.assertions = props && props.assertions;
  }

  /**
   * Adds an assertion to the rule.
   * @param condition The expression to evaluation.
   * @param description The description of the assertion.
   */
  public addAssertion(condition: FnCondition, description: string) {
    if (!this.assertions) {
      this.assertions = [];
    }

    this.assertions.push({
      assert: condition,
      assertDescription: description
    });
  }

  public toCloudFormation(): object {
    return {
      Rules: {
        [this.logicalId]: {
          RuleCondition: this.ruleCondition,
          Assertions: capitalizePropertyNames(this.assertions)
        }
      }
    };
  }
}

/**
 * A rule assertion.
 */
export interface RuleAssertion {
  /**
   * The assertion.
   */
  assert: FnCondition;

  /**
   * The assertion description.
   */
  assertDescription: string;
}
