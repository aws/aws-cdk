import { CfnElement } from './cfn-element';
import { Construct } from './construct-compat';
import { IResolvable, IResolveContext } from './resolvable';

export interface CfnConditionProps {
  /**
   * The expression that the condition will evaluate.
   *
   * @default - None.
   */
  readonly expression?: ICfnConditionExpression;
}

/**
 * Represents a CloudFormation condition, for resources which must be conditionally created and
 * the determination must be made at deploy time.
 */
export class CfnCondition extends CfnElement implements ICfnConditionExpression, IResolvable {
  /**
   * The condition statement.
   */
  public expression?: ICfnConditionExpression;

  /**
   * Build a new condition. The condition must be constructed with a condition token,
   * that the condition is based on.
   */
  constructor(scope: Construct, id: string, props?: CfnConditionProps) {
    super(scope, id);
    this.expression = props && props.expression;
  }

  /**
   * @internal
   */
  public _toCloudFormation(): object {
    if (!this.expression) {
      return { };
    }

    return {
      Conditions: {
        [this.logicalId]: this.expression
      }
    };
  }

  /**
   * Synthesizes the condition.
   */
  public resolve(_context: IResolveContext): any {
    return { Condition: this.logicalId };
  }
}

/**
 * Represents a CloudFormation element that can be used within a Condition.
 *
 * You can use intrinsic functions, such as ``Fn.conditionIf``,
 * ``Fn.conditionEquals``, and ``Fn.conditionNot``, to conditionally create
 * stack resources. These conditions are evaluated based on input parameters
 * that you declare when you create or update a stack. After you define all your
 * conditions, you can associate them with resources or resource properties in
 * the Resources and Outputs sections of a template.
 *
 * You define all conditions in the Conditions section of a template except for
 * ``Fn.conditionIf`` conditions. You can use the ``Fn.conditionIf`` condition
 * in the metadata attribute, update policy attribute, and property values in
 * the Resources section and Outputs sections of a template.
 *
 * You might use conditions when you want to reuse a template that can create
 * resources in different contexts, such as a test environment versus a
 * production environment. In your template, you can add an EnvironmentType
 * input parameter, which accepts either prod or test as inputs. For the
 * production environment, you might include Amazon EC2 instances with certain
 * capabilities; however, for the test environment, you want to use less
 * capabilities to save costs. With conditions, you can define which resources
 * are created and how they're configured for each environment type.
 *
 * You can use `toString` when you wish to embed a condition expression
 * in a property value that accepts a `string`. For example:
 *
 * ```ts
 * new sqs.Queue(this, 'MyQueue', {
 *   queueName: Fn.conditionIf('Condition', 'Hello', 'World').toString()
 * });
 * ```
 */
export interface ICfnConditionExpression extends IResolvable { }
