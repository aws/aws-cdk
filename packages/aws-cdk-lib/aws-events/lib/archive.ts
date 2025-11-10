import { Construct } from 'constructs';
import { IEventBus } from './event-bus';
import { EventPattern } from './event-pattern';
import { CfnArchive } from './events.generated';
import { renderEventPattern } from './util';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import { Duration, Resource } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * The event archive base properties
 */
export interface BaseArchiveProps {
  /**
   * The name of the archive.
   *
   * @default - Automatically generated
   */
  readonly archiveName?: string;
  /**
   * A description for the archive.
   *
   * @default - none
   */
  readonly description?: string;
  /**
   * An event pattern to use to filter events sent to the archive.
   */
  readonly eventPattern: EventPattern;
  /**
   * The number of days to retain events for. Default value is 0. If set to 0, events are retained indefinitely.
   * @default - Infinite
   */
  readonly retention?: Duration;

  /**
   * The customer managed key that encrypts this archive
   *
   * @default - Use an AWS managed key
   */
  readonly kmsKey?: kms.IKey;
}

/**
 * The event archive properties
 */
export interface ArchiveProps extends BaseArchiveProps {
  /**
   * The event source associated with the archive.
   */
  readonly sourceEventBus: IEventBus;
}

/**
 * Define an EventBridge Archive
 *
 * @resource AWS::Events::Archive
 */
@propertyInjectable
export class Archive extends Resource {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-events.Archive';
  /**
   * The archive name.
   * @attribute
   */
  public readonly archiveName: string;

  /**
   * The ARN of the archive created.
   * @attribute
   */
  public readonly archiveArn: string;

  constructor(scope: Construct, id: string, props: ArchiveProps) {
    super(scope, id, { physicalName: props.archiveName });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // Add the EventBridge in all stages policy statement if a customer key is supplied
    if (props?.kmsKey) {
      props?.kmsKey.addToResourcePolicy(new iam.PolicyStatement({
        resources: ['*'],
        actions: ['kms:Decrypt', 'kms:GenerateDataKey', 'kms:ReEncrypt*'],
        principals: [
          new iam.ServicePrincipal('events.amazonaws.com'),
        ],
        sid: 'Allow EventBridge to use kms operations',
        effect: iam.Effect.ALLOW,
        conditions: {
          StringEquals: {
            'kms:EncryptionContext:aws:events:event-bus:arn': props.sourceEventBus.eventBusArn,
          },
        },
      }));

      props?.kmsKey.addToResourcePolicy(new iam.PolicyStatement({
        resources: ['*'],
        actions: ['kms:DescribeKey'],
        principals: [
          new iam.ServicePrincipal('events.amazonaws.com'),
        ],
        sid: 'Allow EventBridge to call kms:DescribeKey',
        effect: iam.Effect.ALLOW,
      }));
    }

    // When an empty string is supplied to the L1 template, it means to use an AWS managed key
    // This empty string is necessary as the definitions in the L1 requires an empty string to enforce an update that removes any previously used CMK
    let archive = new CfnArchive(this, 'Archive', {
      sourceArn: props.sourceEventBus.eventBusArn,
      description: props.description,
      eventPattern: renderEventPattern(props.eventPattern),
      retentionDays: props.retention?.toDays({ integral: true }) || 0,
      archiveName: this.physicalName,
      kmsKeyIdentifier: props?.kmsKey?.keyArn || '',
    });

    this.archiveArn = archive.attrArn;
    this.archiveName = archive.ref;
    this.node.defaultChild = archive;
  }
}
