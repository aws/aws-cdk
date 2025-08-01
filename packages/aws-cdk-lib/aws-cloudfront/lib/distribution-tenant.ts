import { Construct } from 'constructs';
import { CfnDistributionTenant } from './cloudfront.generated';
import { CfnTag, IResource, Resource } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';

export interface IDistributionTenant extends IResource {

  readonly distributionId: string;

  readonly name: string;

  readonly domains: string[];

  readonly connectionGroupId: string | undefined;

}

/**
 * Attributes for importing an existing distribution tenant
 */
export interface DistributionTenantAttributes {
  /**
   * The distribution ID for this tenant.
   */
  readonly distributionId: string;

  /**
   * The name of the distribution tenant.
   */
  readonly name: string;

  /**
   * The domains associated with this tenant.
   */
  readonly domains: string[];

  /**
   * The connection group ID associated with this tenant.
   */
  readonly connectionGroupId: string;
}

export interface CustomizationProps extends CfnDistributionTenant.CustomizationsProperty {

}

export interface ManagedCertificateRequestProps extends CfnDistributionTenant.ManagedCertificateRequestProperty{

}

export interface ParameterProps extends CfnDistributionTenant.ParameterProperty{

}

export interface DistributionTenantProps {

  readonly distributionId: string;

  readonly name: string;

  readonly domains: string[];

  readonly connectionGroupId?: string;

  readonly customizations?: CustomizationProps;

  readonly enabled?: boolean;

  readonly managedCertificateRequest?: ManagedCertificateRequestProps;

  readonly parameters?: ParameterProps[];

  readonly tags?: CfnTag [];
}

export class DistributionTenant extends Resource implements IDistributionTenant {
  /**
   * Import an existing distribution tenant
   */
  public static fromDistributionTenantAttributes(scope: Construct, id: string, attrs: DistributionTenantAttributes): IDistributionTenant {
    return new class extends Resource implements IDistributionTenant {
      public readonly distributionId: string;
      public readonly name: string;
      public readonly domains: string[];
      public readonly connectionGroupId: string;

      constructor() {
        super(scope, id);
        this.distributionId = attrs.distributionId;
        this.name = attrs.name;
        this.domains = attrs.domains;
        this.connectionGroupId = attrs.connectionGroupId;
      }
    }();
  }

  public readonly distributionId: string;
  public readonly name: string;
  public readonly domains: string[];
  public readonly connectionGroupId: string | undefined;

  constructor(scope: Construct, id: string, props: DistributionTenantProps) {
    super(scope, id);

    addConstructMetadata(this, props);

    this.name = props.name;
    this.domains = props.domains;
    this.distributionId = props.distributionId;

    const distributionTenant = new CfnDistributionTenant(this, 'Resource', {
      distributionId: props.distributionId,
      domains: props.domains,
      name: props.name,
      connectionGroupId: props.connectionGroupId,
      customizations: props.customizations,
      enabled: props.enabled ?? true,
      managedCertificateRequest: props.managedCertificateRequest,
      parameters: props.parameters,
      tags: props.tags,
    });

    this.connectionGroupId = distributionTenant.connectionGroupId;
  }
}
