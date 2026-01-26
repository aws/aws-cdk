import { Construct } from 'constructs';
import { CfnForEachFragment } from './cfn-foreach-fragment';
import { ICfnConditionExpression } from './cfn-condition';
import { Fn } from './cfn-fn';
import { IResolvable } from './resolvable';
import { Stack } from './stack';

/**
 * Properties for ForEachCondition.
 */
export interface ForEachConditionProps {
  /** Unique identifier for this loop */
  readonly loopName: string;

  /** Values to iterate over */
  readonly collection: string[] | IResolvable;

  /** Condition key template - use ${loopName} as placeholder */
  readonly conditionKeyTemplate: string;

  /** Condition expression */
  readonly expression: ICfnConditionExpression;
}

/**
 * Creates multiple CloudFormation conditions using Fn::ForEach.
 */
export class ForEachCondition extends Construct {
  constructor(scope: Construct, id: string, props: ForEachConditionProps) {
    super(scope, id);

    Stack.of(this).addTransform('AWS::LanguageExtensions');

    const fragment = Fn.forEach(
      props.loopName,
      props.collection,
      props.conditionKeyTemplate,
      props.expression,
    );

    new CfnForEachFragment(this, 'Fragment', 'Conditions', fragment);
  }
}
