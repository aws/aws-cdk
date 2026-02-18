import type { Construct } from 'constructs';
import type { BaseNamespaceProps, INamespace } from './namespace';
import { NamespaceType } from './namespace';
import type { DnsServiceProps } from './service';
import { Service } from './service';
import { CfnPrivateDnsNamespace } from './servicediscovery.generated';
import type * as ec2 from '../../aws-ec2';
import { Resource, ValidationError } from '../../core';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { IPrivateDnsNamespaceRef, PrivateDnsNamespaceReference } from '../../interfaces/generated/aws-servicediscovery-interfaces.generated';

export interface PrivateDnsNamespaceProps extends BaseNamespaceProps {
  /**
   * The Amazon VPC that you want to associate the namespace with.
   */
  readonly vpc: ec2.IVpc;
}

export interface IPrivateDnsNamespace extends INamespace, IPrivateDnsNamespaceRef { }

export interface PrivateDnsNamespaceAttributes {
  /**
   * A name for the Namespace.
   */
  readonly namespaceName: string;

  /**
   * Namespace Id for the Namespace.
   */
  readonly namespaceId: string;

  /**
   * Namespace ARN for the Namespace.
   */
  readonly namespaceArn: string;
}

/**
 * Define a Service Discovery HTTP Namespace
 */
@propertyInjectable
export class PrivateDnsNamespace extends Resource implements IPrivateDnsNamespace {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-servicediscovery.PrivateDnsNamespace';

  public static fromPrivateDnsNamespaceAttributes(scope: Construct, id: string, attrs: PrivateDnsNamespaceAttributes): IPrivateDnsNamespace {
    class Import extends Resource implements IPrivateDnsNamespace {
      public namespaceName = attrs.namespaceName;
      public namespaceId = attrs.namespaceId;
      public namespaceArn = attrs.namespaceArn;
      public type = NamespaceType.DNS_PRIVATE;
      public get privateDnsNamespaceRef(): PrivateDnsNamespaceReference {
        return {
          privateDnsNamespaceId: attrs.namespaceId,
          privateDnsNamespaceArn: attrs.namespaceArn,
        };
      }
    }
    return new Import(scope, id);
  }

  /**
   * The name of the PrivateDnsNamespace.
   */
  public readonly namespaceName: string;

  /**
   * Namespace Id of the PrivateDnsNamespace.
   */
  public readonly namespaceId: string;

  /**
   * Namespace Arn of the namespace.
   */
  public readonly namespaceArn: string;

  /**
   * ID of hosted zone created by namespace
   */
  public readonly namespaceHostedZoneId: string;

  /**
   * Type of the namespace.
   */
  public readonly type: NamespaceType;

  constructor(scope: Construct, id: string, props: PrivateDnsNamespaceProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
    if (props.vpc === undefined) {
      throw new ValidationError('VPC must be specified for PrivateDNSNamespaces', this);
    }

    const ns = new CfnPrivateDnsNamespace(this, 'Resource', {
      name: props.name,
      description: props.description,
      vpc: props.vpc.vpcId,
    });

    this.namespaceName = props.name;
    this.namespaceId = ns.attrId;
    this.namespaceArn = ns.attrArn;
    this.namespaceHostedZoneId = ns.attrHostedZoneId;
    this.type = NamespaceType.DNS_PRIVATE;
  }

  /** @attribute */
  public get privateDnsNamespaceArn() { return this.namespaceArn; }

  /** @attribute */
  public get privateDnsNamespaceName() { return this.namespaceName; }

  /** @attribute */
  public get privateDnsNamespaceId() { return this.namespaceId; }

  public get privateDnsNamespaceRef(): PrivateDnsNamespaceReference {
    return {
      privateDnsNamespaceId: this.namespaceId,
      privateDnsNamespaceArn: this.namespaceArn,
    };
  }

  /**
   * Creates a service within the namespace
   */
  @MethodMetadata()
  public createService(id: string, props?: DnsServiceProps): Service {
    return new Service(this, id, {
      namespace: this,
      ...props,
    });
  }
}
