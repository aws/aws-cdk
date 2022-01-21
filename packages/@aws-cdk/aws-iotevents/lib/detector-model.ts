import * as iam from '@aws-cdk/aws-iam';
import { Resource, IResource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDetectorModel } from './iotevents.generated';
import { State } from './state';

/**
 * Represents an AWS IoT Events detector model
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
 * Properties for defining an AWS IoT Events detector model
 */
export interface DetectorModelProps {
  /**
   * The name of the detector model.
   *
   * @default - CloudFormation will generate a unique name of the detector model
   */
  readonly detectorModelName?: string;

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
   * Import an existing detector model
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

    if (!props.initialState.hasCondition()) {
      throw new Error('Detector Model must use at least one Input in a condition.');
    }

    const role = props.role ?? new iam.Role(this, 'DetectorModelRole', {
      assumedBy: new iam.ServicePrincipal('iotevents.amazonaws.com'),
    });

    const resource = new CfnDetectorModel(this, 'Resource', {
      detectorModelName: this.physicalName,
      detectorModelDefinition: {
        initialStateName: props.initialState.stateName,
        states: [props.initialState.toStateJson()],
      },
      roleArn: role.roleArn,
    });

    this.detectorModelName = this.getResourceNameAttribute(resource.ref);
  }
}
