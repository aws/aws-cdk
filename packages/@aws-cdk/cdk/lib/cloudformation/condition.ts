import { Construct } from '../core/construct';
import { CloudFormationToken } from './cloudformation-token';
import { Referenceable } from './stack';

export interface ConditionProps {
  expression?: FnCondition;
}

/**
 * Represents a CloudFormation condition, for resources which must be conditionally created and
 * the determination must be made at deploy time.
 */
export class Condition extends Referenceable {
  /**
   * The condition statement.
   */
  public expression?: FnCondition;

  /**
   * Build a new condition. The condition must be constructed with a condition token,
   * that the condition is based on.
   */
  constructor(parent: Construct, name: string, props?: ConditionProps) {
    super(parent, name);
    this.expression = props && props.expression;
  }

  public toCloudFormation(): object {
    return {
      Conditions: {
        [this.logicalId]: this.expression
      }
    };
  }
}

/**
 * You can use intrinsic functions, such as ``Fn::If``, ``Fn::Equals``, and ``Fn::Not``, to conditionally
 * create stack resources. These conditions are evaluated based on input parameters that you
 * declare when you create or update a stack. After you define all your conditions, you can
 * associate them with resources or resource properties in the Resources and Outputs sections
 * of a template.
 *
 * You define all conditions in the Conditions section of a template except for ``Fn::If`` conditions.
 * You can use the ``Fn::If`` condition in the metadata attribute, update policy attribute, and property
 * values in the Resources section and Outputs sections of a template.
 *
 * You might use conditions when you want to reuse a template that can create resources in different
 * contexts, such as a test environment versus a production environment. In your template, you can
 * add an EnvironmentType input parameter, which accepts either prod or test as inputs. For the
 * production environment, you might include Amazon EC2 instances with certain capabilities;
 * however, for the test environment, you want to use less capabilities to save costs. With
 * conditions, you can define which resources are created and how they're configured for each
 * environment type.
 */
export class FnCondition extends CloudFormationToken {
  constructor(type: string, value: any) {
    super({ [type]: value });
  }
}
