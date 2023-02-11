import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnVdmAttributes } from './ses.generated';

/**
 * Virtual Deliverablity Manager (VDM) attributes
 */
export interface IVdmAttributes extends IResource {
  /**
   * The name of the resource behind the Virtual Deliverablity Manager attributes.
   *
   * @attribute
   */
  readonly vdmAttributesName: string;
}

/**
 * Properties for the Virtual Deliverablity Manager (VDM) attributes
 */
export interface VdmAttributesProps {
  /**
   * Whether engagement metrics are enabled for your account
   *
   * @default true
   */
  readonly engagementMetrics?: boolean

  /**
   * Whether optimized shared delivery is enabled for your account
   *
   * @default true
   */
  readonly optimizedSharedDelivery?: boolean
}

/**
 * Virtual Deliverablity Manager (VDM) attributes
 */
export class VdmAttributes extends Resource implements IVdmAttributes {
  /**
   * Use an existing Virtual Deliverablity Manager attributes resource
   */
  public static fromVdmAttributesName(scope: Construct, id: string, vdmAttributesName: string): IVdmAttributes {
    class Import extends Resource implements IVdmAttributes {
      public readonly vdmAttributesName = vdmAttributesName;
    }
    return new Import(scope, id);
  }

  public readonly vdmAttributesName: string;

  /**
   * Resource ID for the Virtual Deliverablity Manager attributes
   *
   * @attribute
   */
  public readonly vdmAttributesResourceId: string;

  constructor(scope: Construct, id: string, props: VdmAttributesProps = {}) {
    super(scope, id);

    const resource = new CfnVdmAttributes(this, 'Resource', {
      dashboardAttributes: {
        engagementMetrics: booleanToEnabledDisabled(props.engagementMetrics ?? true),
      },
      guardianAttributes: {
        optimizedSharedDelivery: booleanToEnabledDisabled(props.optimizedSharedDelivery ?? true),
      },
    });

    this.vdmAttributesName = resource.ref;
    this.vdmAttributesResourceId = resource.attrVdmAttributesResourceId;
  }
}

function booleanToEnabledDisabled(value: boolean): 'ENABLED' | 'DISABLED' {
  return value === true
    ? 'ENABLED'
    : 'DISABLED';
}
