import { Resource, IResource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnThing } from './iot.generated';

/**
 * Represents an AWS IoT Thing
 */
export interface IThing extends IResource {
  /**
   * The name of the Thing.
   *
   * @attribute
   */
  readonly thingName: string;
}

/**
 * Properties for defining an AWS IoT Thing
 */
export interface ThingProps {
  /**
   * The name of the Thing.
   *
   * @default - an automatically generated name
   */
  readonly thingName?: string;

  /**
   * A JSON string containing up to three key-value pair in JSON format.
   *
   * @default - None
   */
  readonly attributes?: { [key: string]: string }
}

/**
 * Defines an AWS IoT Thing in this stack.
 */
export class Thing extends Resource {
  /**
   * Import an existing AWS IoT Thing provided an ARN
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param thingName AWS IoT Thing name.
   */
  public static fromThingName(scope: Construct, id: string, thingName: string): IThing {
    const resourceName = thingName;

    class Import extends Resource implements IThing {
      public readonly thingName = resourceName;
    }
    return new Import(scope, id);
  }

  /**
   * The name of the Thing.
   *
   * @attribute
   */
  public readonly thingName: string;

  constructor(scope: Construct, id: string, props?: ThingProps) {
    super(scope, id, { physicalName: props?.thingName });

    if (props?.attributes && Object.keys(props?.attributes).length > 3) {
      throw new Error('Thing cannot have more than three attributes.');
    }

    const resource = new CfnThing(this, 'Resource', {
      thingName: this.physicalName,
      attributePayload: props?.attributes && { attributes: props.attributes },
    });

    this.thingName = this.getResourceNameAttribute(resource.ref);
  }
}
