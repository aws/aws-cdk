import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './applicationautoscaling.generated';
import { IScalableTarget } from './scalable-target';

/**
 * Properties for a scaling policy
 */
export interface BaseScalingPolicyProps {
  /**
   * A name for the scaling policy
   *
   * @default Automatically generated name
   */
  policyName?: string;

  /**
   * The scalable target
   */
  scalingTarget: IScalableTarget;
}

export abstract class BaseScalingPolicy extends cdk.Construct {
  public readonly scalingPolicyArn: string;

  constructor(parent: cdk.Construct, id: string, props: BaseScalingPolicyProps, additionalProps: any) {
    super(parent, id);

    // scalingTargetId == "" means look at the other properties
    const scalingTargetId = props.scalingTarget.scalableTargetId !== "" ? props.scalingTarget.scalableTargetId : undefined;
    let resourceId;
    let scalableDimension;
    let serviceNamespace;
    if (scalingTargetId === undefined) {
      if (props.scalingTarget.scalableDimension === "" || props.scalingTarget.resourceId === ""
          || props.scalingTarget.serviceNamespace === "") {
        throw new Error(`A scaling target requires either a 'scalableTargetId' or all of 'resourceId', 'scalableDimension', 'serviceNamespace'`);
      }
      resourceId = props.scalingTarget.resourceId;
      scalableDimension = props.scalingTarget.scalableDimension;
      serviceNamespace = props.scalingTarget.serviceNamespace;
    }

    const resource = new cloudformation.ScalingPolicyResource(this, 'Resource', {
      policyName: props.policyName || this.uniqueId,
      scalingTargetId,
      resourceId,
      scalableDimension,
      serviceNamespace,
      ...additionalProps
    });

    this.scalingPolicyArn = resource.scalingPolicyArn;
  }
}