import type { Construct } from 'constructs';
import type { LogType } from './log-type';
import { CfnDeliverySource } from './logs.generated';
import type { IResource } from '../../core';
import { ArnFormat, Resource } from '../../core';
import * as cdk from '../../core';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { IDeliverySourceRef, DeliverySourceReference } from '../../interfaces/generated/aws-logs-interfaces.generated';

/**
 * A log delivery source.
 */
export interface IDeliverySource extends IResource, IDeliverySourceRef {}

/**
 * Properties for a DeliverySource
 */
export interface DeliverySourceProps {
  /**
   * The name for this delivery source.
   *
   * @default Automatically generated
   */
  readonly deliverySourceName?: string;

  /**
   * The ARN of the AWS resource that will emit logs.
   *
   * For example, an Amazon EKS cluster ARN, an Amazon Bedrock agent ARN, or a Network Firewall ARN.
   * For V1 Permissions services (API Gateway, NLB, etc.), this is the ARN of the service resource.
   */
  readonly resourceArn: string;

  /**
   * The type of log to deliver.
   *
   * Use the static constants on `LogType` for known V2 Permissions services, or
   * `LogType.of()` for V1 Permissions services and types not yet listed.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AWS-logs-and-resource-policy.html
   */
  readonly logType: LogType;
}

/**
 * Define a CloudWatch Logs delivery source.
 *
 * A delivery source represents an AWS resource that emits logs to a
 * CloudWatch Logs delivery destination. Use together with `DeliveryDestination`
 * and `Delivery` to configure log delivery.
 *
 * @resource AWS::Logs::DeliverySource
 */
@propertyInjectable
export class DeliverySource extends Resource implements IDeliverySource {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-logs.DeliverySource';

  /**
   * Import an existing DeliverySource by its name.
   */
  public static fromDeliverySourceName(scope: Construct, id: string, deliverySourceName: string): IDeliverySource {
    class Import extends Resource implements IDeliverySource {
      public get deliverySourceRef(): DeliverySourceReference {
        const arn = cdk.Stack.of(this).formatArn({
          service: 'logs',
          resource: 'delivery-source',
          resourceName: deliverySourceName,
          arnFormat: ArnFormat.COLON_RESOURCE_NAME,
        });
        return { deliverySourceName, deliverySourceArn: arn };
      }
    }
    return new Import(scope, id);
  }

  /**
   * Import an existing DeliverySource by its ARN.
   */
  public static fromDeliverySourceArn(scope: Construct, id: string, deliverySourceArn: string): IDeliverySource {
    const deliverySourceName = cdk.Stack.of(scope).splitArn(deliverySourceArn, ArnFormat.COLON_RESOURCE_NAME).resourceName!;
    class Import extends Resource implements IDeliverySource {
      public get deliverySourceRef(): DeliverySourceReference {
        return { deliverySourceName, deliverySourceArn };
      }
    }
    return new Import(scope, id, { environmentFromArn: deliverySourceArn });
  }

  private readonly resource: CfnDeliverySource;

  /**
   * The ARN of this delivery source.
   * @attribute
   */
  @memoizedGetter
  public get deliverySourceArn(): string {
    return this.getResourceArnAttribute(this.resource.attrArn, {
      service: 'logs',
      resource: 'delivery-source',
      resourceName: this.physicalName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });
  }

  /**
   * The name of this delivery source.
   * @attribute
   */
  @memoizedGetter
  public get deliverySourceName(): string {
    return this.getResourceNameAttribute(this.resource.ref);
  }

  public get deliverySourceRef(): DeliverySourceReference {
    return {
      deliverySourceName: this.deliverySourceName,
      deliverySourceArn: this.deliverySourceArn,
    };
  }

  constructor(scope: Construct, id: string, props: DeliverySourceProps) {
    super(scope, id, {
      physicalName: props.deliverySourceName ??
        cdk.Lazy.string({ produce: () => this.generateUniqueName() }),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.resource = new CfnDeliverySource(this, 'Resource', {
      name: this.physicalName!,
      resourceArn: props.resourceArn,
      logType: props.logType.value,
    });
  }

  private generateUniqueName(): string {
    return cdk.Stack.of(this).stackName + '-' + this.resource.logicalId;
  }
}
