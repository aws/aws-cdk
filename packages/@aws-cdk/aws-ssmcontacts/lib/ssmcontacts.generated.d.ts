import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnContact`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html
 */
export interface CfnContactProps {
    /**
     * The unique and identifiable alias of the contact or escalation plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html#cfn-ssmcontacts-contact-alias
     */
    readonly alias: string;
    /**
     * The full name of the contact or escalation plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html#cfn-ssmcontacts-contact-displayname
     */
    readonly displayName: string;
    /**
     * A list of stages. A contact has an engagement plan with stages that contact specified contact channels. An escalation plan uses stages that contact specified contacts.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html#cfn-ssmcontacts-contact-plan
     */
    readonly plan: Array<CfnContact.StageProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Refers to the type of contact. A single contact is type `PERSONAL` and an escalation plan is type `ESCALATION` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html#cfn-ssmcontacts-contact-type
     */
    readonly type: string;
}
/**
 * A CloudFormation `AWS::SSMContacts::Contact`
 *
 * The `AWS::SSMContacts::Contact` resource specifies a contact or escalation plan. Incident Manager contacts are a subset of actions and data types that you can use for managing responder engagement and interaction.
 *
 * @cloudformationResource AWS::SSMContacts::Contact
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html
 */
export declare class CfnContact extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::SSMContacts::Contact";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnContact;
    /**
     * The Amazon Resource Name (ARN) of the `Contact` resource, such as `arn:aws:ssm-contacts:us-west-2:123456789012:contact/contactalias` .
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The unique and identifiable alias of the contact or escalation plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html#cfn-ssmcontacts-contact-alias
     */
    alias: string;
    /**
     * The full name of the contact or escalation plan.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html#cfn-ssmcontacts-contact-displayname
     */
    displayName: string;
    /**
     * A list of stages. A contact has an engagement plan with stages that contact specified contact channels. An escalation plan uses stages that contact specified contacts.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html#cfn-ssmcontacts-contact-plan
     */
    plan: Array<CfnContact.StageProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Refers to the type of contact. A single contact is type `PERSONAL` and an escalation plan is type `ESCALATION` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contact.html#cfn-ssmcontacts-contact-type
     */
    type: string;
    /**
     * Create a new `AWS::SSMContacts::Contact`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnContactProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnContact {
    /**
     * Information about the contact channel that Incident Manager uses to engage the contact.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-channeltargetinfo.html
     */
    interface ChannelTargetInfoProperty {
        /**
         * The Amazon Resource Name (ARN) of the contact channel.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-channeltargetinfo.html#cfn-ssmcontacts-contact-channeltargetinfo-channelid
         */
        readonly channelId: string;
        /**
         * The number of minutes to wait to retry sending engagement in the case the engagement initially fails.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-channeltargetinfo.html#cfn-ssmcontacts-contact-channeltargetinfo-retryintervalinminutes
         */
        readonly retryIntervalInMinutes: number;
    }
}
export declare namespace CfnContact {
    /**
     * The contact that Incident Manager is engaging during an incident.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-contacttargetinfo.html
     */
    interface ContactTargetInfoProperty {
        /**
         * The Amazon Resource Name (ARN) of the contact.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-contacttargetinfo.html#cfn-ssmcontacts-contact-contacttargetinfo-contactid
         */
        readonly contactId: string;
        /**
         * A Boolean value determining if the contact's acknowledgement stops the progress of stages in the plan.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-contacttargetinfo.html#cfn-ssmcontacts-contact-contacttargetinfo-isessential
         */
        readonly isEssential: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnContact {
    /**
     * The `Stage` property type specifies a set amount of time that an escalation plan or engagement plan engages the specified contacts or contact methods.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-stage.html
     */
    interface StageProperty {
        /**
         * The time to wait until beginning the next stage. The duration can only be set to 0 if a target is specified.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-stage.html#cfn-ssmcontacts-contact-stage-durationinminutes
         */
        readonly durationInMinutes: number;
        /**
         * The contacts or contact methods that the escalation plan or engagement plan is engaging.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-stage.html#cfn-ssmcontacts-contact-stage-targets
         */
        readonly targets?: Array<CfnContact.TargetsProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnContact {
    /**
     * The contact or contact channel that's being engaged.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-targets.html
     */
    interface TargetsProperty {
        /**
         * Information about the contact channel Incident Manager is engaging.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-targets.html#cfn-ssmcontacts-contact-targets-channeltargetinfo
         */
        readonly channelTargetInfo?: CfnContact.ChannelTargetInfoProperty | cdk.IResolvable;
        /**
         * The contact that Incident Manager is engaging during an incident.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmcontacts-contact-targets.html#cfn-ssmcontacts-contact-targets-contacttargetinfo
         */
        readonly contactTargetInfo?: CfnContact.ContactTargetInfoProperty | cdk.IResolvable;
    }
}
/**
 * Properties for defining a `CfnContactChannel`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html
 */
export interface CfnContactChannelProps {
    /**
     * The details that Incident Manager uses when trying to engage the contact channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-channeladdress
     */
    readonly channelAddress: string;
    /**
     * The name of the contact channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-channelname
     */
    readonly channelName: string;
    /**
     * The type of the contact channel. Incident Manager supports three contact methods:
     *
     * - SMS
     * - VOICE
     * - EMAIL
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-channeltype
     */
    readonly channelType: string;
    /**
     * The Amazon Resource Name (ARN) of the contact you are adding the contact channel to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-contactid
     */
    readonly contactId: string;
    /**
     * If you want to activate the channel at a later time, you can choose to defer activation. Incident Manager can't engage your contact channel until it has been activated.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-deferactivation
     */
    readonly deferActivation?: boolean | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::SSMContacts::ContactChannel`
 *
 * The `AWS::SSMContacts::ContactChannel` resource specifies a contact channel as the method that Incident Manager uses to engage your contact.
 *
 * @cloudformationResource AWS::SSMContacts::ContactChannel
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html
 */
export declare class CfnContactChannel extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::SSMContacts::ContactChannel";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnContactChannel;
    /**
     * The Amazon Resource Name (ARN) of the `ContactChannel` resource.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The details that Incident Manager uses when trying to engage the contact channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-channeladdress
     */
    channelAddress: string;
    /**
     * The name of the contact channel.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-channelname
     */
    channelName: string;
    /**
     * The type of the contact channel. Incident Manager supports three contact methods:
     *
     * - SMS
     * - VOICE
     * - EMAIL
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-channeltype
     */
    channelType: string;
    /**
     * The Amazon Resource Name (ARN) of the contact you are adding the contact channel to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-contactid
     */
    contactId: string;
    /**
     * If you want to activate the channel at a later time, you can choose to defer activation. Incident Manager can't engage your contact channel until it has been activated.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmcontacts-contactchannel.html#cfn-ssmcontacts-contactchannel-deferactivation
     */
    deferActivation: boolean | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::SSMContacts::ContactChannel`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnContactChannelProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
