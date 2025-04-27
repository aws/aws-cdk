import { Construct } from 'constructs';
import { CfnVdmAttributes } from './ses.generated';
import { IResource, Resource } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';

/**
 * Virtual Deliverability Manager (VDM) attributes
 */
export interface IVdmAttributes extends IResource {
  /**
   * The name of the resource behind the Virtual Deliverability Manager attributes.
   *
   * @attribute
   */
  readonly vdmAttributesName: string;
}

/**
 * Properties for the Virtual Deliverability Manager (VDM) attributes
 */
export interface VdmAttributesProps {
  /**
   * Whether engagement metrics are enabled for your account
   *
   * @default true
   */
  readonly engagementMetrics?: boolean;

  /**
   * Whether optimized shared delivery is enabled for your account
   *
   * @default true
   */
  readonly optimizedSharedDelivery?: boolean;
}

/**
 * Virtual Deliverability Manager (VDM) attributes
 */
export class VdmAttributes extends Resource implements IVdmAttributes {
  /**
   * Use an existing Virtual Deliverability Manager attributes resource
   */
  public static fromVdmAttributesName(scope: Construct, id: string, vdmAttributesName: string): IVdmAttributes {
    class Import extends Resource implements IVdmAttributes {
      public readonly vdmAttributesName = vdmAttributesName;
    }
    return new Import(scope, id);
  }

  public readonly vdmAttributesName: string;

  /**
   * Resource ID for the Virtual Deliverability Manager attributes
   *
   * @attribute
   */
  public readonly vdmAttributesResourceId: string;

  constructor(scope: Construct, id: string, props: VdmAttributesProps = {}) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

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
