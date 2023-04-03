import * as iam from '@aws-cdk/aws-iam';
import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Archive, BaseArchiveProps } from './archive';
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
declare abstract class EventBusBase extends Resource implements IEventBus {
    /**
     * The physical ID of this event bus resource
     */
    abstract readonly eventBusName: string;
    /**
     * The ARN of the event bus, such as:
     * arn:aws:events:us-east-2:123456789012:event-bus/aws.partner/PartnerName/acct1/repo1.
     */
    abstract readonly eventBusArn: string;
    /**
     * The policy for the event bus in JSON form.
     */
    abstract readonly eventBusPolicy: string;
    /**
     * The name of the partner event source
     */
    abstract readonly eventSourceName?: string;
    archive(id: string, props: BaseArchiveProps): Archive;
    grantPutEventsTo(grantee: iam.IGrantable): iam.Grant;
}
/**
 * Define an EventBridge EventBus
 *
 * @resource AWS::Events::EventBus
 */
export declare class EventBus extends EventBusBase {
    /**
     * Import an existing event bus resource
     * @param scope Parent construct
     * @param id Construct ID
     * @param eventBusArn ARN of imported event bus
     */
    static fromEventBusArn(scope: Construct, id: string, eventBusArn: string): IEventBus;
    /**
     * Import an existing event bus resource
     * @param scope Parent construct
     * @param id Construct ID
     * @param eventBusName Name of imported event bus
     */
    static fromEventBusName(scope: Construct, id: string, eventBusName: string): IEventBus;
    /**
     * Import an existing event bus resource
     * @param scope Parent construct
     * @param id Construct ID
     * @param attrs Imported event bus properties
     */
    static fromEventBusAttributes(scope: Construct, id: string, attrs: EventBusAttributes): IEventBus;
    /**
     * Permits an IAM Principal to send custom events to EventBridge
     * so that they can be matched to rules.
     *
     * @param grantee The principal (no-op if undefined)
     * @deprecated use grantAllPutEvents instead
     */
    static grantPutEvents(grantee: iam.IGrantable): iam.Grant;
    /**
     * Permits an IAM Principal to send custom events to EventBridge
     * so that they can be matched to rules.
     *
     * @param grantee The principal (no-op if undefined)
     */
    static grantAllPutEvents(grantee: iam.IGrantable): iam.Grant;
    private static eventBusProps;
    /**
     * The physical ID of this event bus resource
     */
    readonly eventBusName: string;
    /**
     * The ARN of the event bus, such as:
     * arn:aws:events:us-east-2:123456789012:event-bus/aws.partner/PartnerName/acct1/repo1.
     */
    readonly eventBusArn: string;
    /**
     * The policy for the event bus in JSON form.
     */
    readonly eventBusPolicy: string;
    /**
     * The name of the partner event source
     */
    readonly eventSourceName?: string;
    private policy?;
    constructor(scope: Construct, id: string, props?: EventBusProps);
    /**
     * Adds a statement to the IAM resource policy associated with this event bus.
     */
    addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult;
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
export declare class EventBusPolicy extends Resource {
    constructor(scope: Construct, id: string, props: EventBusPolicyProps);
}
export {};
