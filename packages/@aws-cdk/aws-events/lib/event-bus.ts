import * as iam from '@aws-cdk/aws-iam';
import { IResource, Lazy, Names, Resource, Stack, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnEventBus } from './events.generated';

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

/**
 * Define an EventBridge EventBus
 *
 * @resource AWS::Events::EventBus
 */
export class EventBus extends Resource implements IEventBus {

  /**
   * Import an existing event bus resource
   * @param scope Parent construct
   * @param id Construct ID
   * @param eventBusArn ARN of imported event bus
   */
  public static fromEventBusArn(scope: Construct, id: string, eventBusArn: string): IEventBus {
    const parts = Stack.of(scope).parseArn(eventBusArn);

    class Import extends Resource implements IEventBus {
      public readonly eventBusArn = eventBusArn;
      public readonly eventBusName = parts.resourceName || '';
      public readonly eventBusPolicy = '';
    }

    return new Import(scope, id);
  }

  /**
   * Import an existing event bus resource
   * @param scope Parent construct
   * @param id Construct ID
   * @param attrs Imported event bus properties
   */
  public static fromEventBusAttributes(scope: Construct, id: string, attrs: EventBusAttributes): IEventBus {
    class Import extends Resource implements IEventBus {
      public readonly eventBusArn = attrs.eventBusArn;
      public readonly eventBusName = attrs.eventBusName;
      public readonly eventBusPolicy = attrs.eventBusPolicy;
      public readonly eventSourceName = attrs.eventSourceName;
    }

    return new Import(scope, id);
  }

  /**
   * Permits an IAM Principal to send custom events to EventBridge
   * so that they can be matched to rules.
   *
   * @param grantee The principal (no-op if undefined)
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

  private static eventBusProps(defaultEventBusName: string, props?: EventBusProps) {
    if (props) {
      const { eventBusName, eventSourceName } = props;
      const eventBusNameRegex = /^[\/\.\-_A-Za-z0-9]{1,256}$/;

      if (eventBusName !== undefined && eventSourceName !== undefined) {
        throw new Error(
          '\'eventBusName\' and \'eventSourceName\' cannot both be provided',
        );
      } else if (eventBusName !== undefined && !Token.isUnresolved(eventBusName)) {
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
        return { eventBusName };
      } else if (eventSourceName !== undefined) {
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
        return { eventBusName: eventSourceName, eventSourceName };
      }
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

    const eventBus = new CfnEventBus(this, 'Resource', {
      name: eventBusName,
      eventSourceName,
    });

    this.eventBusArn = this.getResourceArnAttribute(eventBus.attrArn, {
      service: 'events',
      resource: 'event-bus',
      resourceName: eventBus.name,
    });

    this.eventBusName = this.getResourceNameAttribute(eventBus.ref);
    this.eventBusPolicy = eventBus.attrPolicy;
    this.eventSourceName = eventBus.eventSourceName;
  }
}
