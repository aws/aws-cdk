import { Construct } from 'constructs';
import { Archive, BaseArchiveProps } from './archive';
import { CfnEventBus, CfnEventBusPolicy } from './events.generated';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import * as sqs from '../../aws-sqs';
import { ArnFormat, IResource, Lazy, Names, Resource, Stack, Token } from '../../core';

/**
 * Interface which all EventBus based classes MUST implement
 */
export interface IEventBus extends IResource {
  /**
   * The physical ID of this event bus resource
   *
   * @attribute
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbus.html#cfn-events-eventbus-name
   */
  readonly eventBusName: string;

  /**
   * The ARN of this event bus resource
   *
   * @attribute
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbus.html#Arn-fn::getatt
   */
  readonly eventBusArn: string;

  /**
   * The JSON policy of this event bus resource
   *
   * @attribute
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbus.html#Policy-fn::getatt
   */
  readonly eventBusPolicy: string;

  /**
   * The partner event source to associate with this event bus resource
   *
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbus.html#cfn-events-eventbus-eventsourcename
   */
  readonly eventSourceName?: string;

  /**
   * Create an EventBridge archive to send events to.
   * When you create an archive, incoming events might not immediately start being sent to the archive.
   * Allow a short period of time for changes to take effect.
   *
   * @param props Properties of the archive
   */
  archive(id: string, props: BaseArchiveProps): Archive;

  /**
   * Grants an IAM Principal to send custom events to the eventBus
   * so that they can be matched to rules.
   *
   * @param grantee The principal (no-op if undefined)
   */
  grantPutEventsTo(grantee: iam.IGrantable): iam.Grant;
}

/**
 * Properties to define an event bus
 */
export interface EventBusProps {
  /**
   * The name of the event bus you are creating
   * Note: If 'eventSourceName' is passed in, you cannot set this
   *
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbus.html#cfn-events-eventbus-name
   * @default - automatically generated name
   */
  readonly eventBusName?: string;

  /**
   * The partner event source to associate with this event bus resource
   * Note: If 'eventBusName' is passed in, you cannot set this
   *
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbus.html#cfn-events-eventbus-eventsourcename
   * @default - no partner event source
   */
  readonly eventSourceName?: string;

  /**
   * Dead-letter queue for the event bus
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-event-delivery.html#eb-rule-dlq
   *
   * @default - no dead-letter queue
   */
  readonly deadLetterQueue?: sqs.IQueue;

  /**
   * The event bus description.
   *
   * The description can be up to 512 characters long.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbus.html#cfn-events-eventbus-description
   *
   * @default - no description
   */
  readonly description?: string;

  /**
  * The customer managed key that encrypt events on this event bus.
  *
  * @default - Use an AWS managed key
  */
  readonly kmsKey?: kms.IKey;
}

/**
 * Interface with properties necessary to import a reusable EventBus
 */
export interface EventBusAttributes {
  /**
   * The physical ID of this event bus resource
   *
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbus.html#cfn-events-eventbus-name
   */
  readonly eventBusName: string;

  /**
   * The ARN of this event bus resource
   *
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbus.html#Arn-fn::getatt
   */
  readonly eventBusArn: string;

  /**
   * The JSON policy of this event bus resource
   *
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbus.html#Policy-fn::getatt
   */
  readonly eventBusPolicy: string;

  /**
   * The partner event source to associate with this event bus resource
   *
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-events-eventbus.html#cfn-events-eventbus-eventsourcename
   * @default - no partner event source
   */
  readonly eventSourceName?: string;
}

abstract class EventBusBase extends Resource implements IEventBus {
  /**
   * The physical ID of this event bus resource
   */
  public abstract readonly eventBusName: string;

  /**
   * The ARN of the event bus, such as:
   * arn:aws:events:us-east-2:123456789012:event-bus/aws.partner/PartnerName/acct1/repo1.
   */
  public abstract readonly eventBusArn: string;

  /**
   * The policy for the event bus in JSON form.
   */
  public abstract readonly eventBusPolicy: string;

  /**
   * The name of the partner event source
   */
  public abstract readonly eventSourceName?: string;

  public archive(id: string, props: BaseArchiveProps): Archive {
    return new Archive(this, id, {
      sourceEventBus: this,
      description: props.description || `Event Archive for ${this.eventBusName} Event Bus`,
      eventPattern: props.eventPattern,
      retention: props.retention,
      archiveName: props.archiveName,
    });
  }

  public grantPutEventsTo(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions: ['events:PutEvents'],
      resourceArns: [this.eventBusArn],
    });
  }
}

/**
 * Define an EventBridge EventBus
 *
 * @resource AWS::Events::EventBus
 */
export class EventBus extends EventBusBase {

  /**
   * Import an existing event bus resource
   * @param scope Parent construct
   * @param id Construct ID
   * @param eventBusArn ARN of imported event bus
   */
  public static fromEventBusArn(scope: Construct, id: string, eventBusArn: string): IEventBus {
    const parts = Stack.of(scope).splitArn(eventBusArn, ArnFormat.SLASH_RESOURCE_NAME);

    return new ImportedEventBus(scope, id, {
      eventBusArn: eventBusArn,
      eventBusName: parts.resourceName || '',
      eventBusPolicy: '',
    });
  }

  /**
   * Import an existing event bus resource
   * @param scope Parent construct
   * @param id Construct ID
   * @param eventBusName Name of imported event bus
   */
  public static fromEventBusName(scope: Construct, id: string, eventBusName: string): IEventBus {
    const eventBusArn = Stack.of(scope).formatArn({
      resource: 'event-bus',
      service: 'events',
      resourceName: eventBusName,
    });

    return EventBus.fromEventBusAttributes(scope, id, {
      eventBusName: eventBusName,
      eventBusArn: eventBusArn,
      eventBusPolicy: '',
    });
  }

  /**
   * Import an existing event bus resource
   * @param scope Parent construct
   * @param id Construct ID
   * @param attrs Imported event bus properties
   */
  public static fromEventBusAttributes(scope: Construct, id: string, attrs: EventBusAttributes): IEventBus {
    return new ImportedEventBus(scope, id, attrs);
  }

  /**
   * Permits an IAM Principal to send custom events to EventBridge
   * so that they can be matched to rules.
   *
   * @param grantee The principal (no-op if undefined)
   * @deprecated use grantAllPutEvents instead
   */
  public static grantPutEvents(grantee: iam.IGrantable): iam.Grant {
    // It's currently not possible to restrict PutEvents to specific resources.
    // See https://docs.aws.amazon.com/eventbridge/latest/userguide/permissions-reference-eventbridge.html
    return iam.Grant.addToPrincipal({
      grantee,
      actions: ['events:PutEvents'],
      resourceArns: ['*'],
    });
  }

  /**
   * Permits an IAM Principal to send custom events to EventBridge
   * so that they can be matched to rules.
   *
   * @param grantee The principal (no-op if undefined)
   */
  public static grantAllPutEvents(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions: ['events:PutEvents'],
      resourceArns: ['*'],
    });
  }

  private static eventBusProps(defaultEventBusName: string, props: EventBusProps = {}) {
    const { eventBusName, eventSourceName } = props;
    const eventBusNameRegex = /^[\/\.\-_A-Za-z0-9]{1,256}$/;

    if (eventBusName !== undefined && eventSourceName !== undefined) {
      throw new Error(
        '\'eventBusName\' and \'eventSourceName\' cannot both be provided',
      );
    }

    if (eventBusName !== undefined) {
      if (!Token.isUnresolved(eventBusName)) {
        if (eventBusName === 'default') {
          throw new Error(
            '\'eventBusName\' must not be \'default\'',
          );
        } else if (eventBusName.indexOf('/') > -1) {
          throw new Error(
            '\'eventBusName\' must not contain \'/\'',
          );
        } else if (!eventBusNameRegex.test(eventBusName)) {
          throw new Error(
            `'eventBusName' must satisfy: ${eventBusNameRegex}`,
          );
        }
      }
      return { eventBusName };
    }

    if (eventSourceName !== undefined) {
      if (!Token.isUnresolved(eventSourceName)) {
        // Ex: aws.partner/PartnerName/acct1/repo1
        const eventSourceNameRegex = /^aws\.partner(\/[\.\-_A-Za-z0-9]+){2,}$/;
        if (!eventSourceNameRegex.test(eventSourceName)) {
          throw new Error(
            `'eventSourceName' must satisfy: ${eventSourceNameRegex}`,
          );
        } else if (!eventBusNameRegex.test(eventSourceName)) {
          throw new Error(
            `'eventSourceName' must satisfy: ${eventBusNameRegex}`,
          );
        }
      }
      return { eventBusName: eventSourceName, eventSourceName };
    }

    return { eventBusName: defaultEventBusName };
  }

  /**
   * The physical ID of this event bus resource
   */
  public readonly eventBusName: string;

  /**
   * The ARN of the event bus, such as:
   * arn:aws:events:us-east-2:123456789012:event-bus/aws.partner/PartnerName/acct1/repo1.
   */
  public readonly eventBusArn: string;

  /**
   * The policy for the event bus in JSON form.
   */
  public readonly eventBusPolicy: string;

  /**
   * The name of the partner event source
   */
  public readonly eventSourceName?: string;

  constructor(scope: Construct, id: string, props?: EventBusProps) {
    const { eventBusName, eventSourceName } = EventBus.eventBusProps(
      Lazy.string({ produce: () => Names.uniqueId(this) }),
      props,
    );

    super(scope, id, { physicalName: eventBusName });

    if (props?.description && !Token.isUnresolved(props.description) && props.description.length > 512) {
      throw new Error(`description must be less than or equal to 512 characters, got ${props.description.length}`);
    }

    const eventBus = new CfnEventBus(this, 'Resource', {
      name: this.physicalName,
      eventSourceName,
      deadLetterConfig: props?.deadLetterQueue ? {
        arn: props.deadLetterQueue.queueArn,
      } : undefined,
      description: props?.description,
      kmsKeyIdentifier: props?.kmsKey?.keyArn,
    });

    this.eventBusArn = this.getResourceArnAttribute(eventBus.attrArn, {
      service: 'events',
      resource: 'event-bus',
      resourceName: eventBus.name,
    });

    /**
     * Allow EventBridge to use customer managed key
     *
     * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-encryption-key-policy.html#eb-encryption-key-policy-bus
     */
    if (props?.kmsKey) {
      props?.kmsKey.addToResourcePolicy(new iam.PolicyStatement({
        resources: ['*'],
        actions: ['kms:Decrypt', 'kms:GenerateDataKey', 'kms:DescribeKey'],
        principals: [new iam.ServicePrincipal('events.amazonaws.com')],
        conditions: {
          StringEquals: {
            'aws:SourceAccount': this.stack.account,
            'aws:SourceArn': Stack.of(this).formatArn({
              service: 'events',
              resource: 'event-bus',
              resourceName: eventBusName,
            }),
            'kms:EncryptionContext:aws:events:event-bus:arn': Stack.of(this).formatArn({
              service: 'events',
              resource: 'event-bus',
              resourceName: eventBusName,
            }),
          },
        },
      }));
    }

    this.eventBusName = this.getResourceNameAttribute(eventBus.ref);
    this.eventBusPolicy = eventBus.attrPolicy;
    this.eventSourceName = eventBus.eventSourceName;
  }

  /**
   * Adds a statement to the IAM resource policy associated with this event bus.
   */
  public addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult {
    if (statement.sid == null) {
      throw new Error('Event Bus policy statements must have a sid');
    }

    // In order to generate new statementIDs for the change in https://github.com/aws/aws-cdk/pull/27340
    const statementId = `cdk-${statement.sid}`.slice(0, 64);
    statement.sid = statementId;
    const policy = new EventBusPolicy(this, statementId, {
      eventBus: this,
      statement: statement.toJSON(),
      statementId,
    });

    return { statementAdded: true, policyDependable: policy };
  }
}

class ImportedEventBus extends EventBusBase {
  public readonly eventBusArn: string;
  public readonly eventBusName: string;
  public readonly eventBusPolicy: string;
  public readonly eventSourceName?: string;

  constructor(scope: Construct, id: string, attrs: EventBusAttributes) {
    const arnParts = Stack.of(scope).splitArn(attrs.eventBusArn, ArnFormat.SLASH_RESOURCE_NAME);
    super(scope, id, {
      account: arnParts.account,
      region: arnParts.region,
    });

    this.eventBusArn = attrs.eventBusArn;
    this.eventBusName = attrs.eventBusName;
    this.eventBusPolicy = attrs.eventBusPolicy;
    this.eventSourceName = attrs.eventSourceName;
  }
}

/**
 * Properties to associate Event Buses with a policy
 */
export interface EventBusPolicyProps {
  /**
   * The event bus to which the policy applies
   */
  readonly eventBus: IEventBus;

  /**
   * An IAM Policy Statement to apply to the Event Bus
   */
  readonly statement: iam.PolicyStatement;

  /**
   * An identifier string for the external account that
   * you are granting permissions to.
   */
  readonly statementId: string;
}

/**
 * The policy for an Event Bus
 *
 * Policies define the operations that are allowed on this resource.
 *
 * You almost never need to define this construct directly.
 *
 * All AWS resources that support resource policies have a method called
 * `addToResourcePolicy()`, which will automatically create a new resource
 * policy if one doesn't exist yet, otherwise it will add to the existing
 * policy.
 *
 * Prefer to use `addToResourcePolicy()` instead.
 */
export class EventBusPolicy extends Resource {
  constructor(scope: Construct, id: string, props: EventBusPolicyProps) {
    super(scope, id);

    new CfnEventBusPolicy(this, 'Resource', {
      statementId: props.statementId!,
      statement: props.statement,
      eventBusName: props.eventBus.eventBusName,
    });
  }
}
