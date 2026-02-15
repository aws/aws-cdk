import { Construct } from 'constructs';
import { Fn } from './cfn-fn';
import { CfnForEachFragment } from './cfn-foreach-fragment';
import { IResolvable } from './resolvable';
import { Stack } from './stack';

const FOR_EACH_OUTPUT_SYMBOL = Symbol.for('@aws-cdk/core.ForEachOutput');

/**
 * Properties for ForEachOutput.
 */
export interface ForEachOutputProps {
  /**
   * Unique identifier for this loop.
   */
  readonly loopName: string;

  /**
   * Values to iterate over.
   */
  readonly collection: string[];

  /**
   * Output key template - use ${loopName} as placeholder.
   */
  readonly outputKeyTemplate: string;

  /**
   * Output value.
   */
  readonly value: string | IResolvable;

  /**
   * Optional description.
   *
   * @default - no description
   */
  readonly description?: string;

  /**
   * Optional export name template.
   *
   * @default - no export
   */
  readonly exportNameTemplate?: string;
}

/**
 * Creates multiple CloudFormation outputs using Fn::ForEach.
 *
 * @example
 * new ForEachOutput(this, 'BucketArns', {
 *   loopName: 'Env',
 *   collection: ['dev', 'prod'],
 *   outputKeyTemplate: 'BucketArn${Env}',
 *   value: Fn.sub('arn:aws:s3:::bucket-${Env}'),
 * });
 */
export class ForEachOutput extends Construct {
  /**
   * Checks if the given construct is a ForEachOutput.
   */
  public static isForEachOutput(x: any): x is ForEachOutput {
    return x !== null && typeof x === 'object' && FOR_EACH_OUTPUT_SYMBOL in x;
  }

  constructor(scope: Construct, id: string, props: ForEachOutputProps) {
    super(scope, id);

    Object.defineProperty(this, FOR_EACH_OUTPUT_SYMBOL, { value: true });

    Stack.of(this).addTransform('AWS::LanguageExtensions');

    const outputDef: Record<string, any> = {
      Value: props.value,
    };

    if (props.description) {
      outputDef.Description = props.description;
    }
    if (props.exportNameTemplate) {
      outputDef.Export = { Name: props.exportNameTemplate };
    }

    const fragment = Fn.forEach(
      props.loopName,
      props.collection,
      props.outputKeyTemplate,
      outputDef,
    );

    new CfnForEachFragment(this, 'Fragment', { section: 'Outputs', fragment });
  }
}
