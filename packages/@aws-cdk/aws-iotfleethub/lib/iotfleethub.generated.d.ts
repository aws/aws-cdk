import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnApplication`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleethub-application.html
 */
export interface CfnApplicationProps {
    /**
     * The name of the web application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleethub-application.html#cfn-iotfleethub-application-applicationname
     */
    readonly applicationName: string;
    /**
     * The ARN of the role that the web application assumes when it interacts with AWS IoT Core .
     *
     * > The name of the role must be in the form `FleetHub_random_string` .
     *
     * Pattern: `^arn:[!-~]+$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleethub-application.html#cfn-iotfleethub-application-rolearn
     */
    readonly roleArn: string;
    /**
     * An optional description of the web application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleethub-application.html#cfn-iotfleethub-application-applicationdescription
     */
    readonly applicationDescription?: string;
    /**
     * A set of key/value pairs that you can use to manage the web application resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleethub-application.html#cfn-iotfleethub-application-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::IoTFleetHub::Application`
 *
 * Represents a Fleet Hub for AWS IoT Device Management web application.
 *
 * @cloudformationResource AWS::IoTFleetHub::Application
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleethub-application.html
 */
export declare class CfnApplication extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::IoTFleetHub::Application";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplication;
    /**
     * The ARN of the web application.
     * @cloudformationAttribute ApplicationArn
     */
    readonly attrApplicationArn: string;
    /**
     * The date (in Unix epoch time) when the web application was created.
     * @cloudformationAttribute ApplicationCreationDate
     */
    readonly attrApplicationCreationDate: number;
    /**
     * The unique Id of the web application.
     * @cloudformationAttribute ApplicationId
     */
    readonly attrApplicationId: string;
    /**
     * The date (in Unix epoch time) when the web application was last updated.
     * @cloudformationAttribute ApplicationLastUpdateDate
     */
    readonly attrApplicationLastUpdateDate: number;
    /**
     * The current state of the web application.
     * @cloudformationAttribute ApplicationState
     */
    readonly attrApplicationState: string;
    /**
     * The URL of the web application.
     * @cloudformationAttribute ApplicationUrl
     */
    readonly attrApplicationUrl: string;
    /**
     * A message that explains any failures included in the applicationState response field. This message explains failures in the `CreateApplication` and `DeleteApplication` actions.
     * @cloudformationAttribute ErrorMessage
     */
    readonly attrErrorMessage: string;
    /**
     * The Id of the single sign-on client that you use to authenticate and authorize users on the web application.
     * @cloudformationAttribute SsoClientId
     */
    readonly attrSsoClientId: string;
    /**
     * The name of the web application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleethub-application.html#cfn-iotfleethub-application-applicationname
     */
    applicationName: string;
    /**
     * The ARN of the role that the web application assumes when it interacts with AWS IoT Core .
     *
     * > The name of the role must be in the form `FleetHub_random_string` .
     *
     * Pattern: `^arn:[!-~]+$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleethub-application.html#cfn-iotfleethub-application-rolearn
     */
    roleArn: string;
    /**
     * An optional description of the web application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleethub-application.html#cfn-iotfleethub-application-applicationdescription
     */
    applicationDescription: string | undefined;
    /**
     * A set of key/value pairs that you can use to manage the web application resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotfleethub-application.html#cfn-iotfleethub-application-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::IoTFleetHub::Application`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps);
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
