import * as iam from '@aws-cdk/aws-iam';
import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDetectorModel } from './iotevents.generated';
import { State } from './state';

/**
 * Properties for defining an AWS IoT Events detector model
 */
export interface DetectorModelProps {
  /**
   * The name of the detector model
   *
   * @default - CloudFormation will generate a unique name of the detector model
   */
  readonly detectorModelName?: string,

  /**
   * The state that is entered at the creation of each detector.
   */
  readonly initialState: State;
}

/**
 * Defines an AWS IoT Events detector model in this stack.
 */
export class DetectorModel extends Resource {
  constructor(scope: Construct, id: string, props: DetectorModelProps) {
    super(scope, id, {
      physicalName: props.detectorModelName,
    });

    const role = new iam.Role(this, 'DetectorModelRole', {
      assumedBy: new iam.ServicePrincipal('iotevents.amazonaws.com'),
    });

    new CfnDetectorModel(this, 'Resource', {
      detectorModelName: this.physicalName,
      detectorModelDefinition: {
        initialStateName: props.initialState.stateName,
        states: [props.initialState.toStateJson()],
      },
      roleArn: role.roleArn,
    });
  }
}
