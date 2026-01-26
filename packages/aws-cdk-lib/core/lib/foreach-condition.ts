import { Construct } from 'constructs';
import { ICfnConditionExpression } from './cfn-condition';
import { Fn } from './cfn-fn';
import { CfnForEachFragment } from './cfn-foreach-fragment';
import { Stack } from './stack';

const FOR_EACH_CONDITION_SYMBOL = Symbol.for('@aws-cdk/core.ForEachCondition');

/**
 * Properties for ForEachCondition.
 */
export interface ForEachConditionProps {
  /**
   * Unique identifier for this loop.
   */
  readonly loopName: string;

  /**
   * Values to iterate over.
   */
  readonly collection: string[];

  /**
   * Condition key template - use ${loopName} as placeholder.
   */
  readonly conditionKeyTemplate: string;

  /**
   * Condition expression.
   */
  readonly expression: ICfnConditionExpression;
}

/**
 * Creates multiple CloudFormation conditions using Fn::ForEach.
 *
 * @example
 * new ForEachCondition(this, 'EnvConditions', {
 *   loopName: 'Env',
 *   collection: ['dev', 'prod'],
 *   conditionKeyTemplate: 'Is${Env}',
 *   expression: Fn.conditionEquals(Fn.ref('Environment'), Fn.forEachRef('Env')),
 * });
 */
export class ForEachCondition extends Construct {
  /**
   * Checks if the given construct is a ForEachCondition.
   */
  public static isForEachCondition(x: any): x is ForEachCondition {
    return x !== null && typeof x === 'object' && FOR_EACH_CONDITION_SYMBOL in x;
  }

  constructor(scope: Construct, id: string, props: ForEachConditionProps) {
    super(scope, id);

    Object.defineProperty(this, FOR_EACH_CONDITION_SYMBOL, { value: true });

    Stack.of(this).addTransform('AWS::LanguageExtensions');

    const fragment = Fn.forEach(
      props.loopName,
      props.collection,
      props.conditionKeyTemplate,
      props.expression,
    );

    new CfnForEachFragment(this, 'Fragment', { section: 'Conditions', fragment });
  }
}
