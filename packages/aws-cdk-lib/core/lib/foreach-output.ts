import { Construct } from 'constructs';
import { CfnForEachFragment } from './cfn-foreach-fragment';
import { Fn } from './cfn-fn';
import { IResolvable } from './resolvable';
import { Stack } from './stack';

/**
 * Properties for ForEachOutput.
 */
export interface ForEachOutputProps {
  /** Unique identifier for this loop */
  readonly loopName: string;

  /** Values to iterate over */
  readonly collection: string[] | IResolvable;

  /** Output key template - use ${loopName} as placeholder */
  readonly outputKeyTemplate: string;

  /** Output value */
  readonly value: string | IResolvable;

  /** Optional description */
  readonly description?: string;

  /** Optional export name template */
  readonly exportNameTemplate?: string;
}

/**
 * Creates multiple CloudFormation outputs using Fn::ForEach.
 */
export class ForEachOutput extends Construct {
  constructor(scope: Construct, id: string, props: ForEachOutputProps) {
    super(scope, id);

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

    new CfnForEachFragment(this, 'Fragment', 'Outputs', fragment);
  }
}
