import * as iam from '@aws-cdk/aws-iam';
import { Resource, IResource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDetectorModel } from './iotevents.generated';
import { State } from './state';

/**
 * Represents an AWS IoT Events detector model.
 */
export interface IDetectorModel extends IResource {
  /**
   * The name of the detector model.
   *
   * @attribute
   */
  readonly detectorModelName: string;
}

/**
 * Information about the order in which events are evaluated and how actions are executed.
 */
export enum EventEvaluation {
  /**
   * When setting to BATCH, variables within a state are updated and events within a state are
   * performed only after all event conditions are evaluated.
   */
  BATCH = 'BATCH',

  /**
   * When setting to SERIAL, variables are updated and event conditions are evaluated in the order
   * that the events are defined.
   */
  SERIAL = 'SERIAL',
}

/**
 * Properties for defining an AWS IoT Events detector model.
 */
export interface DetectorModelProps {
  /**
   * The name of the detector model.
   *
   * @default - CloudFormation will generate a unique name of the detector model
   */
  readonly detectorModelName?: string;

  /**
   * A brief description of the detector model.
   *
   * @default none
   */
  readonly description?: string;

  /**
   * Information about the order in which events are evaluated and how actions are executed.
   *
   * When setting to SERIAL, variables are updated and event conditions are evaluated in the order
   * that the events are defined.
   * When setting to BATCH, variables within a state are updated and events within a state are
   * performed only after all event conditions are evaluated.
   *
   * @default EventEvaluation.BATCH
   */
  readonly evaluationMethod?: EventEvaluation;

  /**
   * The value used to identify a detector instance. When a device or system sends input, a new
   * detector instance with a unique key value is created. AWS IoT Events can continue to route
   * input to its corresponding detector instance based on this identifying information.
   *
   * This parameter uses a JSON-path expression to select the attribute-value pair in the message
   * payload that is used for identification. To route the message to the correct detector instance,
   * the device must send a message payload that contains the same attribute-value.
   *
   * @default - none (single detector instance will be created and all inputs will be routed to it)
   */
  readonly detectorKey?: string;

  /**
   * The state that is entered at the creation of each detector.
   */
  readonly initialState: State;

  /**
   * The role that grants permission to AWS IoT Events to perform its operations.
   *
   * @default - a role will be created with default permissions
   */
  readonly role?: iam.IRole;
}

/**
 * Defines an AWS IoT Events detector model in this stack.
 */
export class DetectorModel extends Resource implements IDetectorModel {
  /**
   * Import an existing detector model.
   */
  public static fromDetectorModelName(scope: Construct, id: string, detectorModelName: string): IDetectorModel {
    return new class extends Resource implements IDetectorModel {
      public readonly detectorModelName = detectorModelName;
    }(scope, id);
  }

  public readonly detectorModelName: string;

  constructor(scope: Construct, id: string, props: DetectorModelProps) {
    super(scope, id, {
      physicalName: props.detectorModelName,
    });

    if (!props.initialState._onEnterEventsHaveAtLeastOneCondition()) {
      throw new Error('Detector Model must have at least one Input with a condition');
    }

    const role = props.role ?? new iam.Role(this, 'DetectorModelRole', {
      assumedBy: new iam.ServicePrincipal('iotevents.amazonaws.com'),
    });

    const resource = new CfnDetectorModel(this, 'Resource', {
      detectorModelName: this.physicalName,
      detectorModelDescription: props.description,
      evaluationMethod: props.evaluationMethod,
      key: props.detectorKey,
      detectorModelDefinition: {
        initialStateName: props.initialState.stateName,
        states: props.initialState._collectStateJsons(this, { role }, new Set<State>()),
      },
      roleArn: role.roleArn,
    });

    this.detectorModelName = this.getResourceNameAttribute(resource.ref);
  }
}
