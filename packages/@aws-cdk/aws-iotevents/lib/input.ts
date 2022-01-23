import * as iam from '@aws-cdk/aws-iam';
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

  /**
   * The ARN of the input
   * @attribute
   */
  readonly inputArn: string;

  /**
   * Grant the indicated permissions on this input to the given IAM principal (Role/Group/User).
   *
   * @param grantee The principal (no-op if undefined)
   * @param actions The set of actions to allow (i.e. "dynamodb:PutItem", "dynamodb:GetItem", ...)
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant

  /**
   * Grant the putting message permission to the given IAM principal (Role/Group/User).
   *
   * @param grantee The principal (no-op if undefined)
   */
  grantPutMessage(grantee: iam.IGrantable): iam.Grant
}


abstract class InputBase extends Resource implements IInput {
  /**
   * @attribute
   */
  public abstract readonly inputName: string;
  /**
   * @attribute
   */
  public abstract readonly inputArn: string;

  /**
   * Grant the indicated permissions on this input to the given IAM principal (Role/Group/User).
   *
   * @param grantee The principal (no-op if undefined)
   * @param actions The set of actions to allow (i.e. "dynamodb:PutItem", "dynamodb:GetItem", ...)
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]) {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.inputArn],
      scope: this,
    });
  }

  /**
   * Grant the putting message permission to the given IAM principal (Role/Group/User).
   *
   * @param grantee The principal (no-op if undefined)
   */
  public grantPutMessage(grantee: iam.IGrantable) {
    return this.grant(grantee, 'iotevents:BatchPutMessage');
  }
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
export class Input extends InputBase {
  /**
   * Import an existing input
   */
  public static fromInputName(scope: Construct, id: string, inputName: string): IInput {
    return new class Import extends InputBase {
      public readonly inputName = inputName;
      public readonly inputArn = this.stack.formatArn({
        service: 'iotevents',
        resource: 'input',
        resourceName: inputName,
      });
    }(scope, id);
  }

  public readonly inputName: string;
  public readonly inputArn: string;

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
    this.inputArn = this.stack.formatArn({
      service: 'iotevents',
      resource: 'input',
      resourceName: this.inputName,
    });
  }
}
