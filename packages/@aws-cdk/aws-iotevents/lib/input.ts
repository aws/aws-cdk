import { Resource, IResource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnInput } from './iotevents.generated';

/**
 * Represents an AWS IoT Events input
 */
export interface IInput extends IResource {
  /**
   * The name of the input
   * @attribute
   */
  readonly inputName: string;
}

/**
 * Properties for defining an AWS IoT Events input
 */
export interface InputProps {
  /**
   * The name of the input
   *
   * @default - CloudFormation will generate a unique name of the input
   */
  readonly inputName?: string,

  /**
   * An expression that specifies an attribute-value pair in a JSON structure.
   * Use this to specify an attribute from the JSON payload that is made available
   * by the input. Inputs are derived from messages sent to AWS IoT Events (BatchPutMessage).
   * Each such message contains a JSON payload. The attribute (and its paired value)
   * specified here are available for use in the condition expressions used by detectors.
   */
  readonly attributeJsonPaths: string[];
}

/**
 * Defines an AWS IoT Events input in this stack.
 */
export class Input extends Resource implements IInput {
  /**
   * Import an existing input
   */
  public static fromInputName(scope: Construct, id: string, inputName: string): IInput {
    class Import extends Resource implements IInput {
      public readonly inputName = inputName;
    }
    return new Import(scope, id);
  }

  public readonly inputName: string;

  constructor(scope: Construct, id: string, props: InputProps) {
    super(scope, id, {
      physicalName: props.inputName,
    });

    if (props.attributeJsonPaths.length === 0) {
      throw new Error('attributeJsonPaths property cannot be empty');
    }

    const resource = new CfnInput(this, 'Resource', {
      inputName: this.physicalName,
      inputDefinition: {
        attributes: props.attributeJsonPaths.map(path => ({ jsonPath: path })),
      },
    });

    this.inputName = this.getResourceNameAttribute(resource.ref);
  }
}
