import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnConnector`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connector.html
 */
export interface CfnConnectorProps {
    /**
     * The configuration required for registering the connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connector.html#cfn-appflow-connector-connectorprovisioningconfig
     */
    readonly connectorProvisioningConfig: CfnConnector.ConnectorProvisioningConfigProperty | cdk.IResolvable;
    /**
     * The provisioning type used to register the connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connector.html#cfn-appflow-connector-connectorprovisioningtype
     */
    readonly connectorProvisioningType: string;
    /**
     * The label used for registering the connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connector.html#cfn-appflow-connector-connectorlabel
     */
    readonly connectorLabel?: string;
    /**
     * A description about the connector runtime setting.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connector.html#cfn-appflow-connector-description
     */
    readonly description?: string;
}
/**
 * A CloudFormation `AWS::AppFlow::Connector`
 *
 * Creates a new connector profile associated with your AWS account . There is a soft quota of 100 connector profiles per AWS account . If you need more connector profiles than this quota allows, you can submit a request to the Amazon AppFlow team through the Amazon AppFlow support channel. In each connector profile that you create, you can provide the credentials and properties for only one connector.
 *
 * @cloudformationResource AWS::AppFlow::Connector
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connector.html
 */
export declare class CfnConnector extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppFlow::Connector";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConnector;
    /**
     *
     * @cloudformationAttribute ConnectorArn
     */
    readonly attrConnectorArn: string;
    /**
     * The configuration required for registering the connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connector.html#cfn-appflow-connector-connectorprovisioningconfig
     */
    connectorProvisioningConfig: CfnConnector.ConnectorProvisioningConfigProperty | cdk.IResolvable;
    /**
     * The provisioning type used to register the connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connector.html#cfn-appflow-connector-connectorprovisioningtype
     */
    connectorProvisioningType: string;
    /**
     * The label used for registering the connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connector.html#cfn-appflow-connector-connectorlabel
     */
    connectorLabel: string | undefined;
    /**
     * A description about the connector runtime setting.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connector.html#cfn-appflow-connector-description
     */
    description: string | undefined;
    /**
     * Create a new `AWS::AppFlow::Connector`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnConnectorProps);
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
export declare namespace CfnConnector {
    /**
     * Contains information about the configuration of the connector being registered.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connector-connectorprovisioningconfig.html
     */
    interface ConnectorProvisioningConfigProperty {
        /**
         * Contains information about the configuration of the lambda which is being registered as the connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connector-connectorprovisioningconfig.html#cfn-appflow-connector-connectorprovisioningconfig-lambda
         */
        readonly lambda?: CfnConnector.LambdaConnectorProvisioningConfigProperty | cdk.IResolvable;
    }
}
export declare namespace CfnConnector {
    /**
     * Contains information about the configuration of the lambda which is being registered as the connector.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connector-lambdaconnectorprovisioningconfig.html
     */
    interface LambdaConnectorProvisioningConfigProperty {
        /**
         * Lambda ARN of the connector being registered.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connector-lambdaconnectorprovisioningconfig.html#cfn-appflow-connector-lambdaconnectorprovisioningconfig-lambdaarn
         */
        readonly lambdaArn: string;
    }
}
/**
 * Properties for defining a `CfnConnectorProfile`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connectorprofile.html
 */
export interface CfnConnectorProfileProps {
    /**
     * Indicates the connection mode and if it is public or private.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connectorprofile.html#cfn-appflow-connectorprofile-connectionmode
     */
    readonly connectionMode: string;
    /**
     * The name of the connector profile. The name is unique for each `ConnectorProfile` in the AWS account .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connectorprofile.html#cfn-appflow-connectorprofile-connectorprofilename
     */
    readonly connectorProfileName: string;
    /**
     * The type of connector, such as Salesforce, Amplitude, and so on.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connectorprofile.html#cfn-appflow-connectorprofile-connectortype
     */
    readonly connectorType: string;
    /**
     * The label for the connector profile being created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connectorprofile.html#cfn-appflow-connectorprofile-connectorlabel
     */
    readonly connectorLabel?: string;
    /**
     * Defines the connector-specific configuration and credentials.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connectorprofile.html#cfn-appflow-connectorprofile-connectorprofileconfig
     */
    readonly connectorProfileConfig?: CfnConnectorProfile.ConnectorProfileConfigProperty | cdk.IResolvable;
    /**
     * The ARN (Amazon Resource Name) of the Key Management Service (KMS) key you provide for encryption. This is required if you do not want to use the Amazon AppFlow-managed KMS key. If you don't provide anything here, Amazon AppFlow uses the Amazon AppFlow-managed KMS key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connectorprofile.html#cfn-appflow-connectorprofile-kmsarn
     */
    readonly kmsArn?: string;
}
/**
 * A CloudFormation `AWS::AppFlow::ConnectorProfile`
 *
 * The `AWS::AppFlow::ConnectorProfile` resource is an Amazon AppFlow resource type that specifies the configuration profile for an instance of a connector. This includes the provided name, credentials ARN, connection-mode, and so on. The fields that are common to all types of connector profiles are explicitly specified under the `Properties` field. The rest of the connector-specific properties are specified under `Properties/ConnectorProfileConfig` .
 *
 * > If you want to use AWS CloudFormation to create a connector profile for connectors that implement OAuth (such as Salesforce, Slack, Zendesk, and Google Analytics), you must fetch the access and refresh tokens. You can do this by implementing your own UI for OAuth, or by retrieving the tokens from elsewhere. Alternatively, you can use the Amazon AppFlow console to create the connector profile, and then use that connector profile in the flow creation CloudFormation template.
 *
 * @cloudformationResource AWS::AppFlow::ConnectorProfile
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connectorprofile.html
 */
export declare class CfnConnectorProfile extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppFlow::ConnectorProfile";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConnectorProfile;
    /**
     * The Amazon Resource Name (ARN) of the connector profile.
     * @cloudformationAttribute ConnectorProfileArn
     */
    readonly attrConnectorProfileArn: string;
    /**
     * The Amazon Resource Name (ARN) of the connector profile credentials.
     * @cloudformationAttribute CredentialsArn
     */
    readonly attrCredentialsArn: string;
    /**
     * Indicates the connection mode and if it is public or private.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connectorprofile.html#cfn-appflow-connectorprofile-connectionmode
     */
    connectionMode: string;
    /**
     * The name of the connector profile. The name is unique for each `ConnectorProfile` in the AWS account .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connectorprofile.html#cfn-appflow-connectorprofile-connectorprofilename
     */
    connectorProfileName: string;
    /**
     * The type of connector, such as Salesforce, Amplitude, and so on.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connectorprofile.html#cfn-appflow-connectorprofile-connectortype
     */
    connectorType: string;
    /**
     * The label for the connector profile being created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connectorprofile.html#cfn-appflow-connectorprofile-connectorlabel
     */
    connectorLabel: string | undefined;
    /**
     * Defines the connector-specific configuration and credentials.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connectorprofile.html#cfn-appflow-connectorprofile-connectorprofileconfig
     */
    connectorProfileConfig: CfnConnectorProfile.ConnectorProfileConfigProperty | cdk.IResolvable | undefined;
    /**
     * The ARN (Amazon Resource Name) of the Key Management Service (KMS) key you provide for encryption. This is required if you do not want to use the Amazon AppFlow-managed KMS key. If you don't provide anything here, Amazon AppFlow uses the Amazon AppFlow-managed KMS key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-connectorprofile.html#cfn-appflow-connectorprofile-kmsarn
     */
    kmsArn: string | undefined;
    /**
     * Create a new `AWS::AppFlow::ConnectorProfile`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnConnectorProfileProps);
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
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific credentials required when using Amplitude.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-amplitudeconnectorprofilecredentials.html
     */
    interface AmplitudeConnectorProfileCredentialsProperty {
        /**
         * A unique alphanumeric identifier used to authenticate a user, developer, or calling program to your API.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-amplitudeconnectorprofilecredentials.html#cfn-appflow-connectorprofile-amplitudeconnectorprofilecredentials-apikey
         */
        readonly apiKey: string;
        /**
         * The Secret Access Key portion of the credentials.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-amplitudeconnectorprofilecredentials.html#cfn-appflow-connectorprofile-amplitudeconnectorprofilecredentials-secretkey
         */
        readonly secretKey: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The API key credentials required for API key authentication.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-apikeycredentials.html
     */
    interface ApiKeyCredentialsProperty {
        /**
         * The API key required for API key authentication.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-apikeycredentials.html#cfn-appflow-connectorprofile-apikeycredentials-apikey
         */
        readonly apiKey: string;
        /**
         * The API secret key required for API key authentication.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-apikeycredentials.html#cfn-appflow-connectorprofile-apikeycredentials-apisecretkey
         */
        readonly apiSecretKey?: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The basic auth credentials required for basic authentication.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-basicauthcredentials.html
     */
    interface BasicAuthCredentialsProperty {
        /**
         * The password to use to connect to a resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-basicauthcredentials.html#cfn-appflow-connectorprofile-basicauthcredentials-password
         */
        readonly password: string;
        /**
         * The username to use to connect to a resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-basicauthcredentials.html#cfn-appflow-connectorprofile-basicauthcredentials-username
         */
        readonly username: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * Used by select connectors for which the OAuth workflow is supported, such as Salesforce, Google Analytics, Marketo, Zendesk, and Slack.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectoroauthrequest.html
     */
    interface ConnectorOAuthRequestProperty {
        /**
         * The code provided by the connector when it has been authenticated via the connected app.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectoroauthrequest.html#cfn-appflow-connectorprofile-connectoroauthrequest-authcode
         */
        readonly authCode?: string;
        /**
         * The URL to which the authentication server redirects the browser after authorization has been granted.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectoroauthrequest.html#cfn-appflow-connectorprofile-connectoroauthrequest-redirecturi
         */
        readonly redirectUri?: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * Defines the connector-specific configuration and credentials for the connector profile.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileconfig.html
     */
    interface ConnectorProfileConfigProperty {
        /**
         * The connector-specific credentials required by each connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileconfig.html#cfn-appflow-connectorprofile-connectorprofileconfig-connectorprofilecredentials
         */
        readonly connectorProfileCredentials?: CfnConnectorProfile.ConnectorProfileCredentialsProperty | cdk.IResolvable;
        /**
         * The connector-specific properties of the profile configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileconfig.html#cfn-appflow-connectorprofile-connectorprofileconfig-connectorprofileproperties
         */
        readonly connectorProfileProperties?: CfnConnectorProfile.ConnectorProfilePropertiesProperty | cdk.IResolvable;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific credentials required by a connector.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html
     */
    interface ConnectorProfileCredentialsProperty {
        /**
         * The connector-specific credentials required when using Amplitude.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-amplitude
         */
        readonly amplitude?: CfnConnectorProfile.AmplitudeConnectorProfileCredentialsProperty | cdk.IResolvable;
        /**
         * The connector-specific profile credentials that are required when using the custom connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-customconnector
         */
        readonly customConnector?: CfnConnectorProfile.CustomConnectorProfileCredentialsProperty | cdk.IResolvable;
        /**
         * The connector-specific credentials required when using Datadog.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-datadog
         */
        readonly datadog?: CfnConnectorProfile.DatadogConnectorProfileCredentialsProperty | cdk.IResolvable;
        /**
         * The connector-specific credentials required when using Dynatrace.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-dynatrace
         */
        readonly dynatrace?: CfnConnectorProfile.DynatraceConnectorProfileCredentialsProperty | cdk.IResolvable;
        /**
         * The connector-specific credentials required when using Google Analytics.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-googleanalytics
         */
        readonly googleAnalytics?: CfnConnectorProfile.GoogleAnalyticsConnectorProfileCredentialsProperty | cdk.IResolvable;
        /**
         * The connector-specific credentials required when using Infor Nexus.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-infornexus
         */
        readonly inforNexus?: CfnConnectorProfile.InforNexusConnectorProfileCredentialsProperty | cdk.IResolvable;
        /**
         * The connector-specific credentials required when using Marketo.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-marketo
         */
        readonly marketo?: CfnConnectorProfile.MarketoConnectorProfileCredentialsProperty | cdk.IResolvable;
        /**
         * The connector-specific credentials required when using Amazon Redshift.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-redshift
         */
        readonly redshift?: CfnConnectorProfile.RedshiftConnectorProfileCredentialsProperty | cdk.IResolvable;
        /**
         * The connector-specific profile credentials required when using SAPOData.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-sapodata
         */
        readonly sapoData?: CfnConnectorProfile.SAPODataConnectorProfileCredentialsProperty | cdk.IResolvable;
        /**
         * The connector-specific credentials required when using Salesforce.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-salesforce
         */
        readonly salesforce?: CfnConnectorProfile.SalesforceConnectorProfileCredentialsProperty | cdk.IResolvable;
        /**
         * The connector-specific credentials required when using ServiceNow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-servicenow
         */
        readonly serviceNow?: CfnConnectorProfile.ServiceNowConnectorProfileCredentialsProperty | cdk.IResolvable;
        /**
         * The connector-specific credentials required when using Singular.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-singular
         */
        readonly singular?: CfnConnectorProfile.SingularConnectorProfileCredentialsProperty | cdk.IResolvable;
        /**
         * The connector-specific credentials required when using Slack.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-slack
         */
        readonly slack?: CfnConnectorProfile.SlackConnectorProfileCredentialsProperty | cdk.IResolvable;
        /**
         * The connector-specific credentials required when using Snowflake.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-snowflake
         */
        readonly snowflake?: CfnConnectorProfile.SnowflakeConnectorProfileCredentialsProperty | cdk.IResolvable;
        /**
         * The connector-specific credentials required when using Trend Micro.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-trendmicro
         */
        readonly trendmicro?: CfnConnectorProfile.TrendmicroConnectorProfileCredentialsProperty | cdk.IResolvable;
        /**
         * The connector-specific credentials required when using Veeva.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-veeva
         */
        readonly veeva?: CfnConnectorProfile.VeevaConnectorProfileCredentialsProperty | cdk.IResolvable;
        /**
         * The connector-specific credentials required when using Zendesk.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofilecredentials.html#cfn-appflow-connectorprofile-connectorprofilecredentials-zendesk
         */
        readonly zendesk?: CfnConnectorProfile.ZendeskConnectorProfileCredentialsProperty | cdk.IResolvable;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile properties required by each connector.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html
     */
    interface ConnectorProfilePropertiesProperty {
        /**
         * The properties required by the custom connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-customconnector
         */
        readonly customConnector?: CfnConnectorProfile.CustomConnectorProfilePropertiesProperty | cdk.IResolvable;
        /**
         * The connector-specific properties required by Datadog.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-datadog
         */
        readonly datadog?: CfnConnectorProfile.DatadogConnectorProfilePropertiesProperty | cdk.IResolvable;
        /**
         * The connector-specific properties required by Dynatrace.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-dynatrace
         */
        readonly dynatrace?: CfnConnectorProfile.DynatraceConnectorProfilePropertiesProperty | cdk.IResolvable;
        /**
         * The connector-specific properties required by Infor Nexus.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-infornexus
         */
        readonly inforNexus?: CfnConnectorProfile.InforNexusConnectorProfilePropertiesProperty | cdk.IResolvable;
        /**
         * The connector-specific properties required by Marketo.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-marketo
         */
        readonly marketo?: CfnConnectorProfile.MarketoConnectorProfilePropertiesProperty | cdk.IResolvable;
        /**
         * The connector-specific properties required by Amazon Redshift.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-redshift
         */
        readonly redshift?: CfnConnectorProfile.RedshiftConnectorProfilePropertiesProperty | cdk.IResolvable;
        /**
         * The connector-specific profile properties required when using SAPOData.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-sapodata
         */
        readonly sapoData?: CfnConnectorProfile.SAPODataConnectorProfilePropertiesProperty | cdk.IResolvable;
        /**
         * The connector-specific properties required by Salesforce.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-salesforce
         */
        readonly salesforce?: CfnConnectorProfile.SalesforceConnectorProfilePropertiesProperty | cdk.IResolvable;
        /**
         * The connector-specific properties required by serviceNow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-servicenow
         */
        readonly serviceNow?: CfnConnectorProfile.ServiceNowConnectorProfilePropertiesProperty | cdk.IResolvable;
        /**
         * The connector-specific properties required by Slack.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-slack
         */
        readonly slack?: CfnConnectorProfile.SlackConnectorProfilePropertiesProperty | cdk.IResolvable;
        /**
         * The connector-specific properties required by Snowflake.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-snowflake
         */
        readonly snowflake?: CfnConnectorProfile.SnowflakeConnectorProfilePropertiesProperty | cdk.IResolvable;
        /**
         * The connector-specific properties required by Veeva.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-veeva
         */
        readonly veeva?: CfnConnectorProfile.VeevaConnectorProfilePropertiesProperty | cdk.IResolvable;
        /**
         * The connector-specific properties required by Zendesk.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-connectorprofileproperties.html#cfn-appflow-connectorprofile-connectorprofileproperties-zendesk
         */
        readonly zendesk?: CfnConnectorProfile.ZendeskConnectorProfilePropertiesProperty | cdk.IResolvable;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The custom credentials required for custom authentication.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customauthcredentials.html
     */
    interface CustomAuthCredentialsProperty {
        /**
         * A map that holds custom authentication credentials.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customauthcredentials.html#cfn-appflow-connectorprofile-customauthcredentials-credentialsmap
         */
        readonly credentialsMap?: {
            [key: string]: (string);
        } | cdk.IResolvable;
        /**
         * The custom authentication type that the connector uses.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customauthcredentials.html#cfn-appflow-connectorprofile-customauthcredentials-customauthenticationtype
         */
        readonly customAuthenticationType: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile credentials that are required when using the custom connector.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customconnectorprofilecredentials.html
     */
    interface CustomConnectorProfileCredentialsProperty {
        /**
         * The API keys required for the authentication of the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customconnectorprofilecredentials.html#cfn-appflow-connectorprofile-customconnectorprofilecredentials-apikey
         */
        readonly apiKey?: CfnConnectorProfile.ApiKeyCredentialsProperty | cdk.IResolvable;
        /**
         * The authentication type that the custom connector uses for authenticating while creating a connector profile.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customconnectorprofilecredentials.html#cfn-appflow-connectorprofile-customconnectorprofilecredentials-authenticationtype
         */
        readonly authenticationType: string;
        /**
         * The basic credentials that are required for the authentication of the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customconnectorprofilecredentials.html#cfn-appflow-connectorprofile-customconnectorprofilecredentials-basic
         */
        readonly basic?: CfnConnectorProfile.BasicAuthCredentialsProperty | cdk.IResolvable;
        /**
         * If the connector uses the custom authentication mechanism, this holds the required credentials.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customconnectorprofilecredentials.html#cfn-appflow-connectorprofile-customconnectorprofilecredentials-custom
         */
        readonly custom?: CfnConnectorProfile.CustomAuthCredentialsProperty | cdk.IResolvable;
        /**
         * The OAuth 2.0 credentials required for the authentication of the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customconnectorprofilecredentials.html#cfn-appflow-connectorprofile-customconnectorprofilecredentials-oauth2
         */
        readonly oauth2?: CfnConnectorProfile.OAuth2CredentialsProperty | cdk.IResolvable;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The profile properties required by the custom connector.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customconnectorprofileproperties.html
     */
    interface CustomConnectorProfilePropertiesProperty {
        /**
         * The OAuth 2.0 properties required for OAuth 2.0 authentication.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customconnectorprofileproperties.html#cfn-appflow-connectorprofile-customconnectorprofileproperties-oauth2properties
         */
        readonly oAuth2Properties?: CfnConnectorProfile.OAuth2PropertiesProperty | cdk.IResolvable;
        /**
         * A map of properties that are required to create a profile for the custom connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-customconnectorprofileproperties.html#cfn-appflow-connectorprofile-customconnectorprofileproperties-profileproperties
         */
        readonly profileProperties?: {
            [key: string]: (string);
        } | cdk.IResolvable;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific credentials required by Datadog.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-datadogconnectorprofilecredentials.html
     */
    interface DatadogConnectorProfileCredentialsProperty {
        /**
         * A unique alphanumeric identifier used to authenticate a user, developer, or calling program to your API.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-datadogconnectorprofilecredentials.html#cfn-appflow-connectorprofile-datadogconnectorprofilecredentials-apikey
         */
        readonly apiKey: string;
        /**
         * Application keys, in conjunction with your API key, give you full access to Datadog’s programmatic API. Application keys are associated with the user account that created them. The application key is used to log all requests made to the API.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-datadogconnectorprofilecredentials.html#cfn-appflow-connectorprofile-datadogconnectorprofilecredentials-applicationkey
         */
        readonly applicationKey: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile properties required by Datadog.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-datadogconnectorprofileproperties.html
     */
    interface DatadogConnectorProfilePropertiesProperty {
        /**
         * The location of the Datadog resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-datadogconnectorprofileproperties.html#cfn-appflow-connectorprofile-datadogconnectorprofileproperties-instanceurl
         */
        readonly instanceUrl: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile credentials required by Dynatrace.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-dynatraceconnectorprofilecredentials.html
     */
    interface DynatraceConnectorProfileCredentialsProperty {
        /**
         * The API tokens used by Dynatrace API to authenticate various API calls.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-dynatraceconnectorprofilecredentials.html#cfn-appflow-connectorprofile-dynatraceconnectorprofilecredentials-apitoken
         */
        readonly apiToken: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile properties required by Dynatrace.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-dynatraceconnectorprofileproperties.html
     */
    interface DynatraceConnectorProfilePropertiesProperty {
        /**
         * The location of the Dynatrace resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-dynatraceconnectorprofileproperties.html#cfn-appflow-connectorprofile-dynatraceconnectorprofileproperties-instanceurl
         */
        readonly instanceUrl: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile credentials required by Google Analytics.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-googleanalyticsconnectorprofilecredentials.html
     */
    interface GoogleAnalyticsConnectorProfileCredentialsProperty {
        /**
         * The credentials used to access protected Google Analytics resources.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-googleanalyticsconnectorprofilecredentials.html#cfn-appflow-connectorprofile-googleanalyticsconnectorprofilecredentials-accesstoken
         */
        readonly accessToken?: string;
        /**
         * The identifier for the desired client.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-googleanalyticsconnectorprofilecredentials.html#cfn-appflow-connectorprofile-googleanalyticsconnectorprofilecredentials-clientid
         */
        readonly clientId: string;
        /**
         * The client secret used by the OAuth client to authenticate to the authorization server.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-googleanalyticsconnectorprofilecredentials.html#cfn-appflow-connectorprofile-googleanalyticsconnectorprofilecredentials-clientsecret
         */
        readonly clientSecret: string;
        /**
         * Used by select connectors for which the OAuth workflow is supported, such as Salesforce, Google Analytics, Marketo, Zendesk, and Slack.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-googleanalyticsconnectorprofilecredentials.html#cfn-appflow-connectorprofile-googleanalyticsconnectorprofilecredentials-connectoroauthrequest
         */
        readonly connectorOAuthRequest?: CfnConnectorProfile.ConnectorOAuthRequestProperty | cdk.IResolvable;
        /**
         * The credentials used to acquire new access tokens. This is required only for OAuth2 access tokens, and is not required for OAuth1 access tokens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-googleanalyticsconnectorprofilecredentials.html#cfn-appflow-connectorprofile-googleanalyticsconnectorprofilecredentials-refreshtoken
         */
        readonly refreshToken?: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile credentials required by Infor Nexus.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-infornexusconnectorprofilecredentials.html
     */
    interface InforNexusConnectorProfileCredentialsProperty {
        /**
         * The Access Key portion of the credentials.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-infornexusconnectorprofilecredentials.html#cfn-appflow-connectorprofile-infornexusconnectorprofilecredentials-accesskeyid
         */
        readonly accessKeyId: string;
        /**
         * The encryption keys used to encrypt data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-infornexusconnectorprofilecredentials.html#cfn-appflow-connectorprofile-infornexusconnectorprofilecredentials-datakey
         */
        readonly datakey: string;
        /**
         * The secret key used to sign requests.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-infornexusconnectorprofilecredentials.html#cfn-appflow-connectorprofile-infornexusconnectorprofilecredentials-secretaccesskey
         */
        readonly secretAccessKey: string;
        /**
         * The identifier for the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-infornexusconnectorprofilecredentials.html#cfn-appflow-connectorprofile-infornexusconnectorprofilecredentials-userid
         */
        readonly userId: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile properties required by Infor Nexus.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-infornexusconnectorprofileproperties.html
     */
    interface InforNexusConnectorProfilePropertiesProperty {
        /**
         * The location of the Infor Nexus resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-infornexusconnectorprofileproperties.html#cfn-appflow-connectorprofile-infornexusconnectorprofileproperties-instanceurl
         */
        readonly instanceUrl: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile credentials required by Marketo.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-marketoconnectorprofilecredentials.html
     */
    interface MarketoConnectorProfileCredentialsProperty {
        /**
         * The credentials used to access protected Marketo resources.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-marketoconnectorprofilecredentials.html#cfn-appflow-connectorprofile-marketoconnectorprofilecredentials-accesstoken
         */
        readonly accessToken?: string;
        /**
         * The identifier for the desired client.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-marketoconnectorprofilecredentials.html#cfn-appflow-connectorprofile-marketoconnectorprofilecredentials-clientid
         */
        readonly clientId: string;
        /**
         * The client secret used by the OAuth client to authenticate to the authorization server.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-marketoconnectorprofilecredentials.html#cfn-appflow-connectorprofile-marketoconnectorprofilecredentials-clientsecret
         */
        readonly clientSecret: string;
        /**
         * Used by select connectors for which the OAuth workflow is supported, such as Salesforce, Google Analytics, Marketo, Zendesk, and Slack.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-marketoconnectorprofilecredentials.html#cfn-appflow-connectorprofile-marketoconnectorprofilecredentials-connectoroauthrequest
         */
        readonly connectorOAuthRequest?: CfnConnectorProfile.ConnectorOAuthRequestProperty | cdk.IResolvable;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile properties required when using Marketo.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-marketoconnectorprofileproperties.html
     */
    interface MarketoConnectorProfilePropertiesProperty {
        /**
         * The location of the Marketo resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-marketoconnectorprofileproperties.html#cfn-appflow-connectorprofile-marketoconnectorprofileproperties-instanceurl
         */
        readonly instanceUrl: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The OAuth 2.0 credentials required for OAuth 2.0 authentication.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauth2credentials.html
     */
    interface OAuth2CredentialsProperty {
        /**
         * The access token used to access the connector on your behalf.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauth2credentials.html#cfn-appflow-connectorprofile-oauth2credentials-accesstoken
         */
        readonly accessToken?: string;
        /**
         * The identifier for the desired client.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauth2credentials.html#cfn-appflow-connectorprofile-oauth2credentials-clientid
         */
        readonly clientId?: string;
        /**
         * The client secret used by the OAuth client to authenticate to the authorization server.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauth2credentials.html#cfn-appflow-connectorprofile-oauth2credentials-clientsecret
         */
        readonly clientSecret?: string;
        /**
         * `CfnConnectorProfile.OAuth2CredentialsProperty.OAuthRequest`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauth2credentials.html#cfn-appflow-connectorprofile-oauth2credentials-oauthrequest
         */
        readonly oAuthRequest?: CfnConnectorProfile.ConnectorOAuthRequestProperty | cdk.IResolvable;
        /**
         * The refresh token used to refresh an expired access token.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauth2credentials.html#cfn-appflow-connectorprofile-oauth2credentials-refreshtoken
         */
        readonly refreshToken?: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The OAuth 2.0 properties required for OAuth 2.0 authentication.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauth2properties.html
     */
    interface OAuth2PropertiesProperty {
        /**
         * The OAuth 2.0 grant type used by connector for OAuth 2.0 authentication.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauth2properties.html#cfn-appflow-connectorprofile-oauth2properties-oauth2granttype
         */
        readonly oAuth2GrantType?: string;
        /**
         * The token URL required for OAuth 2.0 authentication.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauth2properties.html#cfn-appflow-connectorprofile-oauth2properties-tokenurl
         */
        readonly tokenUrl?: string;
        /**
         * Associates your token URL with a map of properties that you define. Use this parameter to provide any additional details that the connector requires to authenticate your request.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauth2properties.html#cfn-appflow-connectorprofile-oauth2properties-tokenurlcustomproperties
         */
        readonly tokenUrlCustomProperties?: {
            [key: string]: (string);
        } | cdk.IResolvable;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The OAuth credentials required for OAuth type authentication.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauthcredentials.html
     */
    interface OAuthCredentialsProperty {
        /**
         * The access token used to access protected SAPOData resources.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauthcredentials.html#cfn-appflow-connectorprofile-oauthcredentials-accesstoken
         */
        readonly accessToken?: string;
        /**
         * The identifier for the desired client.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauthcredentials.html#cfn-appflow-connectorprofile-oauthcredentials-clientid
         */
        readonly clientId?: string;
        /**
         * The client secret used by the OAuth client to authenticate to the authorization server.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauthcredentials.html#cfn-appflow-connectorprofile-oauthcredentials-clientsecret
         */
        readonly clientSecret?: string;
        /**
         * `CfnConnectorProfile.OAuthCredentialsProperty.ConnectorOAuthRequest`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauthcredentials.html#cfn-appflow-connectorprofile-oauthcredentials-connectoroauthrequest
         */
        readonly connectorOAuthRequest?: CfnConnectorProfile.ConnectorOAuthRequestProperty | cdk.IResolvable;
        /**
         * The refresh token used to refresh expired access token.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauthcredentials.html#cfn-appflow-connectorprofile-oauthcredentials-refreshtoken
         */
        readonly refreshToken?: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The OAuth properties required for OAuth type authentication.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauthproperties.html
     */
    interface OAuthPropertiesProperty {
        /**
         * The authorization code url required to redirect to SAP Login Page to fetch authorization code for OAuth type authentication.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauthproperties.html#cfn-appflow-connectorprofile-oauthproperties-authcodeurl
         */
        readonly authCodeUrl?: string;
        /**
         * The OAuth scopes required for OAuth type authentication.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauthproperties.html#cfn-appflow-connectorprofile-oauthproperties-oauthscopes
         */
        readonly oAuthScopes?: string[];
        /**
         * The token url required to fetch access/refresh tokens using authorization code and also to refresh expired access token using refresh token.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-oauthproperties.html#cfn-appflow-connectorprofile-oauthproperties-tokenurl
         */
        readonly tokenUrl?: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile credentials required when using Amazon Redshift.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofilecredentials.html
     */
    interface RedshiftConnectorProfileCredentialsProperty {
        /**
         * The password that corresponds to the user name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofilecredentials.html#cfn-appflow-connectorprofile-redshiftconnectorprofilecredentials-password
         */
        readonly password?: string;
        /**
         * The name of the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofilecredentials.html#cfn-appflow-connectorprofile-redshiftconnectorprofilecredentials-username
         */
        readonly username?: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile properties when using Amazon Redshift.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofileproperties.html
     */
    interface RedshiftConnectorProfilePropertiesProperty {
        /**
         * A name for the associated Amazon S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofileproperties.html#cfn-appflow-connectorprofile-redshiftconnectorprofileproperties-bucketname
         */
        readonly bucketName: string;
        /**
         * The object key for the destination bucket in which Amazon AppFlow places the files.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofileproperties.html#cfn-appflow-connectorprofile-redshiftconnectorprofileproperties-bucketprefix
         */
        readonly bucketPrefix?: string;
        /**
         * The unique ID that's assigned to an Amazon Redshift cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofileproperties.html#cfn-appflow-connectorprofile-redshiftconnectorprofileproperties-clusteridentifier
         */
        readonly clusterIdentifier?: string;
        /**
         * The Amazon Resource Name (ARN) of an IAM role that permits Amazon AppFlow to access your Amazon Redshift database through the Data API. For more information, and for the polices that you attach to this role, see [Allow Amazon AppFlow to access Amazon Redshift databases with the Data API](https://docs.aws.amazon.com/appflow/latest/userguide/security_iam_service-role-policies.html#access-redshift) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofileproperties.html#cfn-appflow-connectorprofile-redshiftconnectorprofileproperties-dataapirolearn
         */
        readonly dataApiRoleArn?: string;
        /**
         * The name of an Amazon Redshift database.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofileproperties.html#cfn-appflow-connectorprofile-redshiftconnectorprofileproperties-databasename
         */
        readonly databaseName?: string;
        /**
         * The JDBC URL of the Amazon Redshift cluster.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofileproperties.html#cfn-appflow-connectorprofile-redshiftconnectorprofileproperties-databaseurl
         */
        readonly databaseUrl?: string;
        /**
         * Indicates whether the connector profile defines a connection to an Amazon Redshift Serverless data warehouse.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofileproperties.html#cfn-appflow-connectorprofile-redshiftconnectorprofileproperties-isredshiftserverless
         */
        readonly isRedshiftServerless?: boolean | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) of IAM role that grants Amazon Redshift read-only access to Amazon S3. For more information, and for the polices that you attach to this role, see [Allow Amazon Redshift to access your Amazon AppFlow data in Amazon S3](https://docs.aws.amazon.com/appflow/latest/userguide/security_iam_service-role-policies.html#redshift-access-s3) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofileproperties.html#cfn-appflow-connectorprofile-redshiftconnectorprofileproperties-rolearn
         */
        readonly roleArn: string;
        /**
         * The name of an Amazon Redshift workgroup.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-redshiftconnectorprofileproperties.html#cfn-appflow-connectorprofile-redshiftconnectorprofileproperties-workgroupname
         */
        readonly workgroupName?: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile credentials required when using SAPOData.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-sapodataconnectorprofilecredentials.html
     */
    interface SAPODataConnectorProfileCredentialsProperty {
        /**
         * The SAPOData basic authentication credentials.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-sapodataconnectorprofilecredentials.html#cfn-appflow-connectorprofile-sapodataconnectorprofilecredentials-basicauthcredentials
         */
        readonly basicAuthCredentials?: CfnConnectorProfile.BasicAuthCredentialsProperty | cdk.IResolvable;
        /**
         * The SAPOData OAuth type authentication credentials.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-sapodataconnectorprofilecredentials.html#cfn-appflow-connectorprofile-sapodataconnectorprofilecredentials-oauthcredentials
         */
        readonly oAuthCredentials?: CfnConnectorProfile.OAuthCredentialsProperty | cdk.IResolvable;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile properties required when using SAPOData.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-sapodataconnectorprofileproperties.html
     */
    interface SAPODataConnectorProfilePropertiesProperty {
        /**
         * The location of the SAPOData resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-sapodataconnectorprofileproperties.html#cfn-appflow-connectorprofile-sapodataconnectorprofileproperties-applicationhosturl
         */
        readonly applicationHostUrl?: string;
        /**
         * The application path to catalog service.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-sapodataconnectorprofileproperties.html#cfn-appflow-connectorprofile-sapodataconnectorprofileproperties-applicationservicepath
         */
        readonly applicationServicePath?: string;
        /**
         * The client number for the client creating the connection.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-sapodataconnectorprofileproperties.html#cfn-appflow-connectorprofile-sapodataconnectorprofileproperties-clientnumber
         */
        readonly clientNumber?: string;
        /**
         * The logon language of SAPOData instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-sapodataconnectorprofileproperties.html#cfn-appflow-connectorprofile-sapodataconnectorprofileproperties-logonlanguage
         */
        readonly logonLanguage?: string;
        /**
         * The SAPOData OAuth properties required for OAuth type authentication.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-sapodataconnectorprofileproperties.html#cfn-appflow-connectorprofile-sapodataconnectorprofileproperties-oauthproperties
         */
        readonly oAuthProperties?: CfnConnectorProfile.OAuthPropertiesProperty | cdk.IResolvable;
        /**
         * The port number of the SAPOData instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-sapodataconnectorprofileproperties.html#cfn-appflow-connectorprofile-sapodataconnectorprofileproperties-portnumber
         */
        readonly portNumber?: number;
        /**
         * The SAPOData Private Link service name to be used for private data transfers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-sapodataconnectorprofileproperties.html#cfn-appflow-connectorprofile-sapodataconnectorprofileproperties-privatelinkservicename
         */
        readonly privateLinkServiceName?: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile credentials required when using Salesforce.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-salesforceconnectorprofilecredentials.html
     */
    interface SalesforceConnectorProfileCredentialsProperty {
        /**
         * The credentials used to access protected Salesforce resources.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-salesforceconnectorprofilecredentials.html#cfn-appflow-connectorprofile-salesforceconnectorprofilecredentials-accesstoken
         */
        readonly accessToken?: string;
        /**
         * The secret manager ARN, which contains the client ID and client secret of the connected app.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-salesforceconnectorprofilecredentials.html#cfn-appflow-connectorprofile-salesforceconnectorprofilecredentials-clientcredentialsarn
         */
        readonly clientCredentialsArn?: string;
        /**
         * Used by select connectors for which the OAuth workflow is supported, such as Salesforce, Google Analytics, Marketo, Zendesk, and Slack.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-salesforceconnectorprofilecredentials.html#cfn-appflow-connectorprofile-salesforceconnectorprofilecredentials-connectoroauthrequest
         */
        readonly connectorOAuthRequest?: CfnConnectorProfile.ConnectorOAuthRequestProperty | cdk.IResolvable;
        /**
         * The credentials used to acquire new access tokens.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-salesforceconnectorprofilecredentials.html#cfn-appflow-connectorprofile-salesforceconnectorprofilecredentials-refreshtoken
         */
        readonly refreshToken?: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile properties required when using Salesforce.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-salesforceconnectorprofileproperties.html
     */
    interface SalesforceConnectorProfilePropertiesProperty {
        /**
         * The location of the Salesforce resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-salesforceconnectorprofileproperties.html#cfn-appflow-connectorprofile-salesforceconnectorprofileproperties-instanceurl
         */
        readonly instanceUrl?: string;
        /**
         * Indicates whether the connector profile applies to a sandbox or production environment.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-salesforceconnectorprofileproperties.html#cfn-appflow-connectorprofile-salesforceconnectorprofileproperties-issandboxenvironment
         */
        readonly isSandboxEnvironment?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile credentials required when using ServiceNow.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-servicenowconnectorprofilecredentials.html
     */
    interface ServiceNowConnectorProfileCredentialsProperty {
        /**
         * The password that corresponds to the user name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-servicenowconnectorprofilecredentials.html#cfn-appflow-connectorprofile-servicenowconnectorprofilecredentials-password
         */
        readonly password: string;
        /**
         * The name of the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-servicenowconnectorprofilecredentials.html#cfn-appflow-connectorprofile-servicenowconnectorprofilecredentials-username
         */
        readonly username: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile properties required when using ServiceNow.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-servicenowconnectorprofileproperties.html
     */
    interface ServiceNowConnectorProfilePropertiesProperty {
        /**
         * The location of the ServiceNow resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-servicenowconnectorprofileproperties.html#cfn-appflow-connectorprofile-servicenowconnectorprofileproperties-instanceurl
         */
        readonly instanceUrl: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile credentials required when using Singular.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-singularconnectorprofilecredentials.html
     */
    interface SingularConnectorProfileCredentialsProperty {
        /**
         * A unique alphanumeric identifier used to authenticate a user, developer, or calling program to your API.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-singularconnectorprofilecredentials.html#cfn-appflow-connectorprofile-singularconnectorprofilecredentials-apikey
         */
        readonly apiKey: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile credentials required when using Slack.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-slackconnectorprofilecredentials.html
     */
    interface SlackConnectorProfileCredentialsProperty {
        /**
         * The credentials used to access protected Slack resources.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-slackconnectorprofilecredentials.html#cfn-appflow-connectorprofile-slackconnectorprofilecredentials-accesstoken
         */
        readonly accessToken?: string;
        /**
         * The identifier for the client.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-slackconnectorprofilecredentials.html#cfn-appflow-connectorprofile-slackconnectorprofilecredentials-clientid
         */
        readonly clientId: string;
        /**
         * The client secret used by the OAuth client to authenticate to the authorization server.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-slackconnectorprofilecredentials.html#cfn-appflow-connectorprofile-slackconnectorprofilecredentials-clientsecret
         */
        readonly clientSecret: string;
        /**
         * Used by select connectors for which the OAuth workflow is supported, such as Salesforce, Google Analytics, Marketo, Zendesk, and Slack.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-slackconnectorprofilecredentials.html#cfn-appflow-connectorprofile-slackconnectorprofilecredentials-connectoroauthrequest
         */
        readonly connectorOAuthRequest?: CfnConnectorProfile.ConnectorOAuthRequestProperty | cdk.IResolvable;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile properties required when using Slack.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-slackconnectorprofileproperties.html
     */
    interface SlackConnectorProfilePropertiesProperty {
        /**
         * The location of the Slack resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-slackconnectorprofileproperties.html#cfn-appflow-connectorprofile-slackconnectorprofileproperties-instanceurl
         */
        readonly instanceUrl: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile credentials required when using Snowflake.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-snowflakeconnectorprofilecredentials.html
     */
    interface SnowflakeConnectorProfileCredentialsProperty {
        /**
         * The password that corresponds to the user name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-snowflakeconnectorprofilecredentials.html#cfn-appflow-connectorprofile-snowflakeconnectorprofilecredentials-password
         */
        readonly password: string;
        /**
         * The name of the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-snowflakeconnectorprofilecredentials.html#cfn-appflow-connectorprofile-snowflakeconnectorprofilecredentials-username
         */
        readonly username: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile properties required when using Snowflake.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-snowflakeconnectorprofileproperties.html
     */
    interface SnowflakeConnectorProfilePropertiesProperty {
        /**
         * The name of the account.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-snowflakeconnectorprofileproperties.html#cfn-appflow-connectorprofile-snowflakeconnectorprofileproperties-accountname
         */
        readonly accountName?: string;
        /**
         * The name of the Amazon S3 bucket associated with Snowflake.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-snowflakeconnectorprofileproperties.html#cfn-appflow-connectorprofile-snowflakeconnectorprofileproperties-bucketname
         */
        readonly bucketName: string;
        /**
         * The bucket path that refers to the Amazon S3 bucket associated with Snowflake.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-snowflakeconnectorprofileproperties.html#cfn-appflow-connectorprofile-snowflakeconnectorprofileproperties-bucketprefix
         */
        readonly bucketPrefix?: string;
        /**
         * The Snowflake Private Link service name to be used for private data transfers.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-snowflakeconnectorprofileproperties.html#cfn-appflow-connectorprofile-snowflakeconnectorprofileproperties-privatelinkservicename
         */
        readonly privateLinkServiceName?: string;
        /**
         * The AWS Region of the Snowflake account.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-snowflakeconnectorprofileproperties.html#cfn-appflow-connectorprofile-snowflakeconnectorprofileproperties-region
         */
        readonly region?: string;
        /**
         * The name of the Amazon S3 stage that was created while setting up an Amazon S3 stage in the Snowflake account. This is written in the following format: < Database>< Schema><Stage Name>.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-snowflakeconnectorprofileproperties.html#cfn-appflow-connectorprofile-snowflakeconnectorprofileproperties-stage
         */
        readonly stage: string;
        /**
         * The name of the Snowflake warehouse.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-snowflakeconnectorprofileproperties.html#cfn-appflow-connectorprofile-snowflakeconnectorprofileproperties-warehouse
         */
        readonly warehouse: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile credentials required when using Trend Micro.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-trendmicroconnectorprofilecredentials.html
     */
    interface TrendmicroConnectorProfileCredentialsProperty {
        /**
         * The Secret Access Key portion of the credentials.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-trendmicroconnectorprofilecredentials.html#cfn-appflow-connectorprofile-trendmicroconnectorprofilecredentials-apisecretkey
         */
        readonly apiSecretKey: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile credentials required when using Veeva.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-veevaconnectorprofilecredentials.html
     */
    interface VeevaConnectorProfileCredentialsProperty {
        /**
         * The password that corresponds to the user name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-veevaconnectorprofilecredentials.html#cfn-appflow-connectorprofile-veevaconnectorprofilecredentials-password
         */
        readonly password: string;
        /**
         * The name of the user.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-veevaconnectorprofilecredentials.html#cfn-appflow-connectorprofile-veevaconnectorprofilecredentials-username
         */
        readonly username: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile properties required when using Veeva.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-veevaconnectorprofileproperties.html
     */
    interface VeevaConnectorProfilePropertiesProperty {
        /**
         * The location of the Veeva resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-veevaconnectorprofileproperties.html#cfn-appflow-connectorprofile-veevaconnectorprofileproperties-instanceurl
         */
        readonly instanceUrl: string;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile credentials required when using Zendesk.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-zendeskconnectorprofilecredentials.html
     */
    interface ZendeskConnectorProfileCredentialsProperty {
        /**
         * The credentials used to access protected Zendesk resources.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-zendeskconnectorprofilecredentials.html#cfn-appflow-connectorprofile-zendeskconnectorprofilecredentials-accesstoken
         */
        readonly accessToken?: string;
        /**
         * The identifier for the desired client.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-zendeskconnectorprofilecredentials.html#cfn-appflow-connectorprofile-zendeskconnectorprofilecredentials-clientid
         */
        readonly clientId: string;
        /**
         * The client secret used by the OAuth client to authenticate to the authorization server.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-zendeskconnectorprofilecredentials.html#cfn-appflow-connectorprofile-zendeskconnectorprofilecredentials-clientsecret
         */
        readonly clientSecret: string;
        /**
         * Used by select connectors for which the OAuth workflow is supported, such as Salesforce, Google Analytics, Marketo, Zendesk, and Slack.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-zendeskconnectorprofilecredentials.html#cfn-appflow-connectorprofile-zendeskconnectorprofilecredentials-connectoroauthrequest
         */
        readonly connectorOAuthRequest?: CfnConnectorProfile.ConnectorOAuthRequestProperty | cdk.IResolvable;
    }
}
export declare namespace CfnConnectorProfile {
    /**
     * The connector-specific profile properties required when using Zendesk.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-zendeskconnectorprofileproperties.html
     */
    interface ZendeskConnectorProfilePropertiesProperty {
        /**
         * The location of the Zendesk resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-connectorprofile-zendeskconnectorprofileproperties.html#cfn-appflow-connectorprofile-zendeskconnectorprofileproperties-instanceurl
         */
        readonly instanceUrl: string;
    }
}
/**
 * Properties for defining a `CfnFlow`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html
 */
export interface CfnFlowProps {
    /**
     * The configuration that controls how Amazon AppFlow places data in the destination connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-destinationflowconfiglist
     */
    readonly destinationFlowConfigList: Array<CfnFlow.DestinationFlowConfigProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The specified name of the flow. Spaces are not allowed. Use underscores (_) or hyphens (-) only.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-flowname
     */
    readonly flowName: string;
    /**
     * Contains information about the configuration of the source connector used in the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-sourceflowconfig
     */
    readonly sourceFlowConfig: CfnFlow.SourceFlowConfigProperty | cdk.IResolvable;
    /**
     * A list of tasks that Amazon AppFlow performs while transferring the data in the flow run.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-tasks
     */
    readonly tasks: Array<CfnFlow.TaskProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The trigger settings that determine how and when Amazon AppFlow runs the specified flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-triggerconfig
     */
    readonly triggerConfig: CfnFlow.TriggerConfigProperty | cdk.IResolvable;
    /**
     * A user-entered description of the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-description
     */
    readonly description?: string;
    /**
     * The ARN (Amazon Resource Name) of the Key Management Service (KMS) key you provide for encryption. This is required if you do not want to use the Amazon AppFlow-managed KMS key. If you don't provide anything here, Amazon AppFlow uses the Amazon AppFlow-managed KMS key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-kmsarn
     */
    readonly kmsArn?: string;
    /**
     * `AWS::AppFlow::Flow.MetadataCatalogConfig`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-metadatacatalogconfig
     */
    readonly metadataCatalogConfig?: CfnFlow.MetadataCatalogConfigProperty | cdk.IResolvable;
    /**
     * The tags used to organize, track, or control access for your flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::AppFlow::Flow`
 *
 * The `AWS::AppFlow::Flow` resource is an Amazon AppFlow resource type that specifies a new flow.
 *
 * > If you want to use AWS CloudFormation to create a connector profile for connectors that implement OAuth (such as Salesforce, Slack, Zendesk, and Google Analytics), you must fetch the access and refresh tokens. You can do this by implementing your own UI for OAuth, or by retrieving the tokens from elsewhere. Alternatively, you can use the Amazon AppFlow console to create the connector profile, and then use that connector profile in the flow creation CloudFormation template.
 *
 * @cloudformationResource AWS::AppFlow::Flow
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html
 */
export declare class CfnFlow extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::AppFlow::Flow";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFlow;
    /**
     * The flow's Amazon Resource Name (ARN).
     * @cloudformationAttribute FlowArn
     */
    readonly attrFlowArn: string;
    /**
     * The configuration that controls how Amazon AppFlow places data in the destination connector.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-destinationflowconfiglist
     */
    destinationFlowConfigList: Array<CfnFlow.DestinationFlowConfigProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The specified name of the flow. Spaces are not allowed. Use underscores (_) or hyphens (-) only.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-flowname
     */
    flowName: string;
    /**
     * Contains information about the configuration of the source connector used in the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-sourceflowconfig
     */
    sourceFlowConfig: CfnFlow.SourceFlowConfigProperty | cdk.IResolvable;
    /**
     * A list of tasks that Amazon AppFlow performs while transferring the data in the flow run.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-tasks
     */
    tasks: Array<CfnFlow.TaskProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The trigger settings that determine how and when Amazon AppFlow runs the specified flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-triggerconfig
     */
    triggerConfig: CfnFlow.TriggerConfigProperty | cdk.IResolvable;
    /**
     * A user-entered description of the flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-description
     */
    description: string | undefined;
    /**
     * The ARN (Amazon Resource Name) of the Key Management Service (KMS) key you provide for encryption. This is required if you do not want to use the Amazon AppFlow-managed KMS key. If you don't provide anything here, Amazon AppFlow uses the Amazon AppFlow-managed KMS key.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-kmsarn
     */
    kmsArn: string | undefined;
    /**
     * `AWS::AppFlow::Flow.MetadataCatalogConfig`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-metadatacatalogconfig
     */
    metadataCatalogConfig: CfnFlow.MetadataCatalogConfigProperty | cdk.IResolvable | undefined;
    /**
     * The tags used to organize, track, or control access for your flow.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appflow-flow.html#cfn-appflow-flow-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::AppFlow::Flow`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFlowProps);
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
export declare namespace CfnFlow {
    /**
     * The aggregation settings that you can use to customize the output format of your flow data.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-aggregationconfig.html
     */
    interface AggregationConfigProperty {
        /**
         * Specifies whether Amazon AppFlow aggregates the flow records into a single file, or leave them unaggregated.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-aggregationconfig.html#cfn-appflow-flow-aggregationconfig-aggregationtype
         */
        readonly aggregationType?: string;
        /**
         * The desired file size, in MB, for each output file that Amazon AppFlow writes to the flow destination. For each file, Amazon AppFlow attempts to achieve the size that you specify. The actual file sizes might differ from this target based on the number and size of the records that each file contains.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-aggregationconfig.html#cfn-appflow-flow-aggregationconfig-targetfilesize
         */
        readonly targetFileSize?: number;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when Amplitude is being used as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-amplitudesourceproperties.html
     */
    interface AmplitudeSourcePropertiesProperty {
        /**
         * The object specified in the Amplitude flow source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-amplitudesourceproperties.html#cfn-appflow-flow-amplitudesourceproperties-object
         */
        readonly object: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The operation to be performed on the provided source fields.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html
     */
    interface ConnectorOperatorProperty {
        /**
         * The operation to be performed on the provided Amplitude source fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-amplitude
         */
        readonly amplitude?: string;
        /**
         * Operators supported by the custom connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-customconnector
         */
        readonly customConnector?: string;
        /**
         * The operation to be performed on the provided Datadog source fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-datadog
         */
        readonly datadog?: string;
        /**
         * The operation to be performed on the provided Dynatrace source fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-dynatrace
         */
        readonly dynatrace?: string;
        /**
         * The operation to be performed on the provided Google Analytics source fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-googleanalytics
         */
        readonly googleAnalytics?: string;
        /**
         * The operation to be performed on the provided Infor Nexus source fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-infornexus
         */
        readonly inforNexus?: string;
        /**
         * The operation to be performed on the provided Marketo source fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-marketo
         */
        readonly marketo?: string;
        /**
         * The operation to be performed on the provided Amazon S3 source fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-s3
         */
        readonly s3?: string;
        /**
         * The operation to be performed on the provided SAPOData source fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-sapodata
         */
        readonly sapoData?: string;
        /**
         * The operation to be performed on the provided Salesforce source fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-salesforce
         */
        readonly salesforce?: string;
        /**
         * The operation to be performed on the provided ServiceNow source fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-servicenow
         */
        readonly serviceNow?: string;
        /**
         * The operation to be performed on the provided Singular source fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-singular
         */
        readonly singular?: string;
        /**
         * The operation to be performed on the provided Slack source fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-slack
         */
        readonly slack?: string;
        /**
         * The operation to be performed on the provided Trend Micro source fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-trendmicro
         */
        readonly trendmicro?: string;
        /**
         * The operation to be performed on the provided Veeva source fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-veeva
         */
        readonly veeva?: string;
        /**
         * The operation to be performed on the provided Zendesk source fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-connectoroperator.html#cfn-appflow-flow-connectoroperator-zendesk
         */
        readonly zendesk?: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when the custom connector is being used as a destination.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-customconnectordestinationproperties.html
     */
    interface CustomConnectorDestinationPropertiesProperty {
        /**
         * The custom properties that are specific to the connector when it's used as a destination in the flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-customconnectordestinationproperties.html#cfn-appflow-flow-customconnectordestinationproperties-customproperties
         */
        readonly customProperties?: {
            [key: string]: (string);
        } | cdk.IResolvable;
        /**
         * The entity specified in the custom connector as a destination in the flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-customconnectordestinationproperties.html#cfn-appflow-flow-customconnectordestinationproperties-entityname
         */
        readonly entityName: string;
        /**
         * The settings that determine how Amazon AppFlow handles an error when placing data in the custom connector as destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-customconnectordestinationproperties.html#cfn-appflow-flow-customconnectordestinationproperties-errorhandlingconfig
         */
        readonly errorHandlingConfig?: CfnFlow.ErrorHandlingConfigProperty | cdk.IResolvable;
        /**
         * The name of the field that Amazon AppFlow uses as an ID when performing a write operation such as update, delete, or upsert.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-customconnectordestinationproperties.html#cfn-appflow-flow-customconnectordestinationproperties-idfieldnames
         */
        readonly idFieldNames?: string[];
        /**
         * Specifies the type of write operation to be performed in the custom connector when it's used as destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-customconnectordestinationproperties.html#cfn-appflow-flow-customconnectordestinationproperties-writeoperationtype
         */
        readonly writeOperationType?: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when the custom connector is being used as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-customconnectorsourceproperties.html
     */
    interface CustomConnectorSourcePropertiesProperty {
        /**
         * Custom properties that are required to use the custom connector as a source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-customconnectorsourceproperties.html#cfn-appflow-flow-customconnectorsourceproperties-customproperties
         */
        readonly customProperties?: {
            [key: string]: (string);
        } | cdk.IResolvable;
        /**
         * The entity specified in the custom connector as a source in the flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-customconnectorsourceproperties.html#cfn-appflow-flow-customconnectorsourceproperties-entityname
         */
        readonly entityName: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when Datadog is being used as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-datadogsourceproperties.html
     */
    interface DatadogSourcePropertiesProperty {
        /**
         * The object specified in the Datadog flow source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-datadogsourceproperties.html#cfn-appflow-flow-datadogsourceproperties-object
         */
        readonly object: string;
    }
}
export declare namespace CfnFlow {
    /**
     * This stores the information that is required to query a particular connector.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html
     */
    interface DestinationConnectorPropertiesProperty {
        /**
         * The properties that are required to query the custom Connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html#cfn-appflow-flow-destinationconnectorproperties-customconnector
         */
        readonly customConnector?: CfnFlow.CustomConnectorDestinationPropertiesProperty | cdk.IResolvable;
        /**
         * The properties required to query Amazon EventBridge.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html#cfn-appflow-flow-destinationconnectorproperties-eventbridge
         */
        readonly eventBridge?: CfnFlow.EventBridgeDestinationPropertiesProperty | cdk.IResolvable;
        /**
         * The properties required to query Amazon Lookout for Metrics.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html#cfn-appflow-flow-destinationconnectorproperties-lookoutmetrics
         */
        readonly lookoutMetrics?: CfnFlow.LookoutMetricsDestinationPropertiesProperty | cdk.IResolvable;
        /**
         * The properties required to query Marketo.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html#cfn-appflow-flow-destinationconnectorproperties-marketo
         */
        readonly marketo?: CfnFlow.MarketoDestinationPropertiesProperty | cdk.IResolvable;
        /**
         * The properties required to query Amazon Redshift.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html#cfn-appflow-flow-destinationconnectorproperties-redshift
         */
        readonly redshift?: CfnFlow.RedshiftDestinationPropertiesProperty | cdk.IResolvable;
        /**
         * The properties required to query Amazon S3.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html#cfn-appflow-flow-destinationconnectorproperties-s3
         */
        readonly s3?: CfnFlow.S3DestinationPropertiesProperty | cdk.IResolvable;
        /**
         * The properties required to query SAPOData.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html#cfn-appflow-flow-destinationconnectorproperties-sapodata
         */
        readonly sapoData?: CfnFlow.SAPODataDestinationPropertiesProperty | cdk.IResolvable;
        /**
         * The properties required to query Salesforce.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html#cfn-appflow-flow-destinationconnectorproperties-salesforce
         */
        readonly salesforce?: CfnFlow.SalesforceDestinationPropertiesProperty | cdk.IResolvable;
        /**
         * The properties required to query Snowflake.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html#cfn-appflow-flow-destinationconnectorproperties-snowflake
         */
        readonly snowflake?: CfnFlow.SnowflakeDestinationPropertiesProperty | cdk.IResolvable;
        /**
         * The properties required to query Upsolver.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html#cfn-appflow-flow-destinationconnectorproperties-upsolver
         */
        readonly upsolver?: CfnFlow.UpsolverDestinationPropertiesProperty | cdk.IResolvable;
        /**
         * The properties required to query Zendesk.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationconnectorproperties.html#cfn-appflow-flow-destinationconnectorproperties-zendesk
         */
        readonly zendesk?: CfnFlow.ZendeskDestinationPropertiesProperty | cdk.IResolvable;
    }
}
export declare namespace CfnFlow {
    /**
     * Contains information about the configuration of destination connectors present in the flow.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationflowconfig.html
     */
    interface DestinationFlowConfigProperty {
        /**
         * The API version that the destination connector uses.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationflowconfig.html#cfn-appflow-flow-destinationflowconfig-apiversion
         */
        readonly apiVersion?: string;
        /**
         * The name of the connector profile. This name must be unique for each connector profile in the AWS account .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationflowconfig.html#cfn-appflow-flow-destinationflowconfig-connectorprofilename
         */
        readonly connectorProfileName?: string;
        /**
         * The type of destination connector, such as Sales force, Amazon S3, and so on.
         *
         * *Allowed Values* : `EventBridge | Redshift | S3 | Salesforce | Snowflake`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationflowconfig.html#cfn-appflow-flow-destinationflowconfig-connectortype
         */
        readonly connectorType: string;
        /**
         * This stores the information that is required to query a particular connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-destinationflowconfig.html#cfn-appflow-flow-destinationflowconfig-destinationconnectorproperties
         */
        readonly destinationConnectorProperties: CfnFlow.DestinationConnectorPropertiesProperty | cdk.IResolvable;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when Dynatrace is being used as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-dynatracesourceproperties.html
     */
    interface DynatraceSourcePropertiesProperty {
        /**
         * The object specified in the Dynatrace flow source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-dynatracesourceproperties.html#cfn-appflow-flow-dynatracesourceproperties-object
         */
        readonly object: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The settings that determine how Amazon AppFlow handles an error when placing data in the destination. For example, this setting would determine if the flow should fail after one insertion error, or continue and attempt to insert every record regardless of the initial failure. `ErrorHandlingConfig` is a part of the destination connector details.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-errorhandlingconfig.html
     */
    interface ErrorHandlingConfigProperty {
        /**
         * Specifies the name of the Amazon S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-errorhandlingconfig.html#cfn-appflow-flow-errorhandlingconfig-bucketname
         */
        readonly bucketName?: string;
        /**
         * Specifies the Amazon S3 bucket prefix.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-errorhandlingconfig.html#cfn-appflow-flow-errorhandlingconfig-bucketprefix
         */
        readonly bucketPrefix?: string;
        /**
         * Specifies if the flow should fail after the first instance of a failure when attempting to place data in the destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-errorhandlingconfig.html#cfn-appflow-flow-errorhandlingconfig-failonfirsterror
         */
        readonly failOnFirstError?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when Amazon EventBridge is being used as a destination.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-eventbridgedestinationproperties.html
     */
    interface EventBridgeDestinationPropertiesProperty {
        /**
         * The object specified in the Amplitude flow source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-eventbridgedestinationproperties.html#cfn-appflow-flow-eventbridgedestinationproperties-errorhandlingconfig
         */
        readonly errorHandlingConfig?: CfnFlow.ErrorHandlingConfigProperty | cdk.IResolvable;
        /**
         * The object specified in the Amazon EventBridge flow destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-eventbridgedestinationproperties.html#cfn-appflow-flow-eventbridgedestinationproperties-object
         */
        readonly object: string;
    }
}
export declare namespace CfnFlow {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-gluedatacatalog.html
     */
    interface GlueDataCatalogProperty {
        /**
         * `CfnFlow.GlueDataCatalogProperty.DatabaseName`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-gluedatacatalog.html#cfn-appflow-flow-gluedatacatalog-databasename
         */
        readonly databaseName: string;
        /**
         * `CfnFlow.GlueDataCatalogProperty.RoleArn`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-gluedatacatalog.html#cfn-appflow-flow-gluedatacatalog-rolearn
         */
        readonly roleArn: string;
        /**
         * `CfnFlow.GlueDataCatalogProperty.TablePrefix`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-gluedatacatalog.html#cfn-appflow-flow-gluedatacatalog-tableprefix
         */
        readonly tablePrefix: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when Google Analytics is being used as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-googleanalyticssourceproperties.html
     */
    interface GoogleAnalyticsSourcePropertiesProperty {
        /**
         * The object specified in the Google Analytics flow source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-googleanalyticssourceproperties.html#cfn-appflow-flow-googleanalyticssourceproperties-object
         */
        readonly object: string;
    }
}
export declare namespace CfnFlow {
    /**
     * Specifies the configuration used when importing incremental records from the source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-incrementalpullconfig.html
     */
    interface IncrementalPullConfigProperty {
        /**
         * A field that specifies the date time or timestamp field as the criteria to use when importing incremental records from the source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-incrementalpullconfig.html#cfn-appflow-flow-incrementalpullconfig-datetimetypefieldname
         */
        readonly datetimeTypeFieldName?: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when Infor Nexus is being used as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-infornexussourceproperties.html
     */
    interface InforNexusSourcePropertiesProperty {
        /**
         * The object specified in the Infor Nexus flow source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-infornexussourceproperties.html#cfn-appflow-flow-infornexussourceproperties-object
         */
        readonly object: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when Amazon Lookout for Metrics is used as a destination.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-lookoutmetricsdestinationproperties.html
     */
    interface LookoutMetricsDestinationPropertiesProperty {
        /**
         * The object specified in the Amazon Lookout for Metrics flow destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-lookoutmetricsdestinationproperties.html#cfn-appflow-flow-lookoutmetricsdestinationproperties-object
         */
        readonly object?: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that Amazon AppFlow applies when you use Marketo as a flow destination.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-marketodestinationproperties.html
     */
    interface MarketoDestinationPropertiesProperty {
        /**
         * The settings that determine how Amazon AppFlow handles an error when placing data in the destination. For example, this setting would determine if the flow should fail after one insertion error, or continue and attempt to insert every record regardless of the initial failure. `ErrorHandlingConfig` is a part of the destination connector details.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-marketodestinationproperties.html#cfn-appflow-flow-marketodestinationproperties-errorhandlingconfig
         */
        readonly errorHandlingConfig?: CfnFlow.ErrorHandlingConfigProperty | cdk.IResolvable;
        /**
         * The object specified in the Marketo flow destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-marketodestinationproperties.html#cfn-appflow-flow-marketodestinationproperties-object
         */
        readonly object: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when Marketo is being used as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-marketosourceproperties.html
     */
    interface MarketoSourcePropertiesProperty {
        /**
         * The object specified in the Marketo flow source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-marketosourceproperties.html#cfn-appflow-flow-marketosourceproperties-object
         */
        readonly object: string;
    }
}
export declare namespace CfnFlow {
    /**
     * Specifies the configuration that Amazon AppFlow uses when it catalogs your data. When Amazon AppFlow catalogs your data, it stores metadata in a data catalog.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-metadatacatalogconfig.html
     */
    interface MetadataCatalogConfigProperty {
        /**
         * Specifies the configuration that Amazon AppFlow uses when it catalogs your data with the AWS Glue Data Catalog .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-metadatacatalogconfig.html#cfn-appflow-flow-metadatacatalogconfig-gluedatacatalog
         */
        readonly glueDataCatalog?: CfnFlow.GlueDataCatalogProperty | cdk.IResolvable;
    }
}
export declare namespace CfnFlow {
    /**
     * Specifies elements that Amazon AppFlow includes in the file and folder names in the flow destination.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-prefixconfig.html
     */
    interface PrefixConfigProperty {
        /**
         * Specifies whether the destination file path includes either or both of the following elements:
         *
         * - **EXECUTION_ID** - The ID that Amazon AppFlow assigns to the flow run.
         * - **SCHEMA_VERSION** - The version number of your data schema. Amazon AppFlow assigns this version number. The version number increases by one when you change any of the following settings in your flow configuration:
         *
         * - Source-to-destination field mappings
         * - Field data types
         * - Partition keys
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-prefixconfig.html#cfn-appflow-flow-prefixconfig-pathprefixhierarchy
         */
        readonly pathPrefixHierarchy?: string[];
        /**
         * Determines the level of granularity for the date and time that's included in the prefix.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-prefixconfig.html#cfn-appflow-flow-prefixconfig-prefixformat
         */
        readonly prefixFormat?: string;
        /**
         * Determines the format of the prefix, and whether it applies to the file name, file path, or both.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-prefixconfig.html#cfn-appflow-flow-prefixconfig-prefixtype
         */
        readonly prefixType?: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when Amazon Redshift is being used as a destination.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-redshiftdestinationproperties.html
     */
    interface RedshiftDestinationPropertiesProperty {
        /**
         * The object key for the bucket in which Amazon AppFlow places the destination files.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-redshiftdestinationproperties.html#cfn-appflow-flow-redshiftdestinationproperties-bucketprefix
         */
        readonly bucketPrefix?: string;
        /**
         * The settings that determine how Amazon AppFlow handles an error when placing data in the Amazon Redshift destination. For example, this setting would determine if the flow should fail after one insertion error, or continue and attempt to insert every record regardless of the initial failure. `ErrorHandlingConfig` is a part of the destination connector details.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-redshiftdestinationproperties.html#cfn-appflow-flow-redshiftdestinationproperties-errorhandlingconfig
         */
        readonly errorHandlingConfig?: CfnFlow.ErrorHandlingConfigProperty | cdk.IResolvable;
        /**
         * The intermediate bucket that Amazon AppFlow uses when moving data into Amazon Redshift.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-redshiftdestinationproperties.html#cfn-appflow-flow-redshiftdestinationproperties-intermediatebucketname
         */
        readonly intermediateBucketName: string;
        /**
         * The object specified in the Amazon Redshift flow destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-redshiftdestinationproperties.html#cfn-appflow-flow-redshiftdestinationproperties-object
         */
        readonly object: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when Amazon S3 is used as a destination.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3destinationproperties.html
     */
    interface S3DestinationPropertiesProperty {
        /**
         * The Amazon S3 bucket name in which Amazon AppFlow places the transferred data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3destinationproperties.html#cfn-appflow-flow-s3destinationproperties-bucketname
         */
        readonly bucketName: string;
        /**
         * The object key for the destination bucket in which Amazon AppFlow places the files.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3destinationproperties.html#cfn-appflow-flow-s3destinationproperties-bucketprefix
         */
        readonly bucketPrefix?: string;
        /**
         * The configuration that determines how Amazon AppFlow should format the flow output data when Amazon S3 is used as the destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3destinationproperties.html#cfn-appflow-flow-s3destinationproperties-s3outputformatconfig
         */
        readonly s3OutputFormatConfig?: CfnFlow.S3OutputFormatConfigProperty | cdk.IResolvable;
    }
}
export declare namespace CfnFlow {
    /**
     * When you use Amazon S3 as the source, the configuration format that you provide the flow input data.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3inputformatconfig.html
     */
    interface S3InputFormatConfigProperty {
        /**
         * The file type that Amazon AppFlow gets from your Amazon S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3inputformatconfig.html#cfn-appflow-flow-s3inputformatconfig-s3inputfiletype
         */
        readonly s3InputFileType?: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The configuration that determines how Amazon AppFlow should format the flow output data when Amazon S3 is used as the destination.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3outputformatconfig.html
     */
    interface S3OutputFormatConfigProperty {
        /**
         * The aggregation settings that you can use to customize the output format of your flow data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3outputformatconfig.html#cfn-appflow-flow-s3outputformatconfig-aggregationconfig
         */
        readonly aggregationConfig?: CfnFlow.AggregationConfigProperty | cdk.IResolvable;
        /**
         * Indicates the file type that Amazon AppFlow places in the Amazon S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3outputformatconfig.html#cfn-appflow-flow-s3outputformatconfig-filetype
         */
        readonly fileType?: string;
        /**
         * Determines the prefix that Amazon AppFlow applies to the folder name in the Amazon S3 bucket. You can name folders according to the flow frequency and date.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3outputformatconfig.html#cfn-appflow-flow-s3outputformatconfig-prefixconfig
         */
        readonly prefixConfig?: CfnFlow.PrefixConfigProperty | cdk.IResolvable;
        /**
         * `CfnFlow.S3OutputFormatConfigProperty.PreserveSourceDataTyping`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3outputformatconfig.html#cfn-appflow-flow-s3outputformatconfig-preservesourcedatatyping
         */
        readonly preserveSourceDataTyping?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when Amazon S3 is being used as the flow source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3sourceproperties.html
     */
    interface S3SourcePropertiesProperty {
        /**
         * The Amazon S3 bucket name where the source files are stored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3sourceproperties.html#cfn-appflow-flow-s3sourceproperties-bucketname
         */
        readonly bucketName: string;
        /**
         * The object key for the Amazon S3 bucket in which the source files are stored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3sourceproperties.html#cfn-appflow-flow-s3sourceproperties-bucketprefix
         */
        readonly bucketPrefix: string;
        /**
         * When you use Amazon S3 as the source, the configuration format that you provide the flow input data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-s3sourceproperties.html#cfn-appflow-flow-s3sourceproperties-s3inputformatconfig
         */
        readonly s3InputFormatConfig?: CfnFlow.S3InputFormatConfigProperty | cdk.IResolvable;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when using SAPOData as a flow destination
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sapodatadestinationproperties.html
     */
    interface SAPODataDestinationPropertiesProperty {
        /**
         * The settings that determine how Amazon AppFlow handles an error when placing data in the destination. For example, this setting would determine if the flow should fail after one insertion error, or continue and attempt to insert every record regardless of the initial failure. `ErrorHandlingConfig` is a part of the destination connector details.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sapodatadestinationproperties.html#cfn-appflow-flow-sapodatadestinationproperties-errorhandlingconfig
         */
        readonly errorHandlingConfig?: CfnFlow.ErrorHandlingConfigProperty | cdk.IResolvable;
        /**
         * A list of field names that can be used as an ID field when performing a write operation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sapodatadestinationproperties.html#cfn-appflow-flow-sapodatadestinationproperties-idfieldnames
         */
        readonly idFieldNames?: string[];
        /**
         * The object path specified in the SAPOData flow destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sapodatadestinationproperties.html#cfn-appflow-flow-sapodatadestinationproperties-objectpath
         */
        readonly objectPath: string;
        /**
         * Determines how Amazon AppFlow handles the success response that it gets from the connector after placing data.
         *
         * For example, this setting would determine where to write the response from a destination connector upon a successful insert operation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sapodatadestinationproperties.html#cfn-appflow-flow-sapodatadestinationproperties-successresponsehandlingconfig
         */
        readonly successResponseHandlingConfig?: CfnFlow.SuccessResponseHandlingConfigProperty | cdk.IResolvable;
        /**
         * The possible write operations in the destination connector. When this value is not provided, this defaults to the `INSERT` operation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sapodatadestinationproperties.html#cfn-appflow-flow-sapodatadestinationproperties-writeoperationtype
         */
        readonly writeOperationType?: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when using SAPOData as a flow source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sapodatasourceproperties.html
     */
    interface SAPODataSourcePropertiesProperty {
        /**
         * The object path specified in the SAPOData flow source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sapodatasourceproperties.html#cfn-appflow-flow-sapodatasourceproperties-objectpath
         */
        readonly objectPath: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when Salesforce is being used as a destination.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-salesforcedestinationproperties.html
     */
    interface SalesforceDestinationPropertiesProperty {
        /**
         * Specifies which Salesforce API is used by Amazon AppFlow when your flow transfers data to Salesforce.
         *
         * - **AUTOMATIC** - The default. Amazon AppFlow selects which API to use based on the number of records that your flow transfers to Salesforce. If your flow transfers fewer than 1,000 records, Amazon AppFlow uses Salesforce REST API. If your flow transfers 1,000 records or more, Amazon AppFlow uses Salesforce Bulk API 2.0.
         *
         * Each of these Salesforce APIs structures data differently. If Amazon AppFlow selects the API automatically, be aware that, for recurring flows, the data output might vary from one flow run to the next. For example, if a flow runs daily, it might use REST API on one day to transfer 900 records, and it might use Bulk API 2.0 on the next day to transfer 1,100 records. For each of these flow runs, the respective Salesforce API formats the data differently. Some of the differences include how dates are formatted and null values are represented. Also, Bulk API 2.0 doesn't transfer Salesforce compound fields.
         *
         * By choosing this option, you optimize flow performance for both small and large data transfers, but the tradeoff is inconsistent formatting in the output.
         * - **BULKV2** - Amazon AppFlow uses only Salesforce Bulk API 2.0. This API runs asynchronous data transfers, and it's optimal for large sets of data. By choosing this option, you ensure that your flow writes consistent output, but you optimize performance only for large data transfers.
         *
         * Note that Bulk API 2.0 does not transfer Salesforce compound fields.
         * - **REST_SYNC** - Amazon AppFlow uses only Salesforce REST API. By choosing this option, you ensure that your flow writes consistent output, but you decrease performance for large data transfers that are better suited for Bulk API 2.0. In some cases, if your flow attempts to transfer a vary large set of data, it might fail with a timed out error.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-salesforcedestinationproperties.html#cfn-appflow-flow-salesforcedestinationproperties-datatransferapi
         */
        readonly dataTransferApi?: string;
        /**
         * The settings that determine how Amazon AppFlow handles an error when placing data in the Salesforce destination. For example, this setting would determine if the flow should fail after one insertion error, or continue and attempt to insert every record regardless of the initial failure. `ErrorHandlingConfig` is a part of the destination connector details.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-salesforcedestinationproperties.html#cfn-appflow-flow-salesforcedestinationproperties-errorhandlingconfig
         */
        readonly errorHandlingConfig?: CfnFlow.ErrorHandlingConfigProperty | cdk.IResolvable;
        /**
         * The name of the field that Amazon AppFlow uses as an ID when performing a write operation such as update or delete.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-salesforcedestinationproperties.html#cfn-appflow-flow-salesforcedestinationproperties-idfieldnames
         */
        readonly idFieldNames?: string[];
        /**
         * The object specified in the Salesforce flow destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-salesforcedestinationproperties.html#cfn-appflow-flow-salesforcedestinationproperties-object
         */
        readonly object: string;
        /**
         * This specifies the type of write operation to be performed in Salesforce. When the value is `UPSERT` , then `idFieldNames` is required.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-salesforcedestinationproperties.html#cfn-appflow-flow-salesforcedestinationproperties-writeoperationtype
         */
        readonly writeOperationType?: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when Salesforce is being used as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-salesforcesourceproperties.html
     */
    interface SalesforceSourcePropertiesProperty {
        /**
         * Specifies which Salesforce API is used by Amazon AppFlow when your flow transfers data from Salesforce.
         *
         * - **AUTOMATIC** - The default. Amazon AppFlow selects which API to use based on the number of records that your flow transfers from Salesforce. If your flow transfers fewer than 1,000,000 records, Amazon AppFlow uses Salesforce REST API. If your flow transfers 1,000,000 records or more, Amazon AppFlow uses Salesforce Bulk API 2.0.
         *
         * Each of these Salesforce APIs structures data differently. If Amazon AppFlow selects the API automatically, be aware that, for recurring flows, the data output might vary from one flow run to the next. For example, if a flow runs daily, it might use REST API on one day to transfer 900,000 records, and it might use Bulk API 2.0 on the next day to transfer 1,100,000 records. For each of these flow runs, the respective Salesforce API formats the data differently. Some of the differences include how dates are formatted and null values are represented. Also, Bulk API 2.0 doesn't transfer Salesforce compound fields.
         *
         * By choosing this option, you optimize flow performance for both small and large data transfers, but the tradeoff is inconsistent formatting in the output.
         * - **BULKV2** - Amazon AppFlow uses only Salesforce Bulk API 2.0. This API runs asynchronous data transfers, and it's optimal for large sets of data. By choosing this option, you ensure that your flow writes consistent output, but you optimize performance only for large data transfers.
         *
         * Note that Bulk API 2.0 does not transfer Salesforce compound fields.
         * - **REST_SYNC** - Amazon AppFlow uses only Salesforce REST API. By choosing this option, you ensure that your flow writes consistent output, but you decrease performance for large data transfers that are better suited for Bulk API 2.0. In some cases, if your flow attempts to transfer a vary large set of data, it might fail wituh a timed out error.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-salesforcesourceproperties.html#cfn-appflow-flow-salesforcesourceproperties-datatransferapi
         */
        readonly dataTransferApi?: string;
        /**
         * The flag that enables dynamic fetching of new (recently added) fields in the Salesforce objects while running a flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-salesforcesourceproperties.html#cfn-appflow-flow-salesforcesourceproperties-enabledynamicfieldupdate
         */
        readonly enableDynamicFieldUpdate?: boolean | cdk.IResolvable;
        /**
         * Indicates whether Amazon AppFlow includes deleted files in the flow run.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-salesforcesourceproperties.html#cfn-appflow-flow-salesforcesourceproperties-includedeletedrecords
         */
        readonly includeDeletedRecords?: boolean | cdk.IResolvable;
        /**
         * The object specified in the Salesforce flow source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-salesforcesourceproperties.html#cfn-appflow-flow-salesforcesourceproperties-object
         */
        readonly object: string;
    }
}
export declare namespace CfnFlow {
    /**
     * Specifies the configuration details of a schedule-triggered flow as defined by the user. Currently, these settings only apply to the `Scheduled` trigger type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-scheduledtriggerproperties.html
     */
    interface ScheduledTriggerPropertiesProperty {
        /**
         * Specifies whether a scheduled flow has an incremental data transfer or a complete data transfer for each flow run.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-scheduledtriggerproperties.html#cfn-appflow-flow-scheduledtriggerproperties-datapullmode
         */
        readonly dataPullMode?: string;
        /**
         * Specifies the date range for the records to import from the connector in the first flow run.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-scheduledtriggerproperties.html#cfn-appflow-flow-scheduledtriggerproperties-firstexecutionfrom
         */
        readonly firstExecutionFrom?: number;
        /**
         * `CfnFlow.ScheduledTriggerPropertiesProperty.FlowErrorDeactivationThreshold`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-scheduledtriggerproperties.html#cfn-appflow-flow-scheduledtriggerproperties-flowerrordeactivationthreshold
         */
        readonly flowErrorDeactivationThreshold?: number;
        /**
         * The time at which the scheduled flow ends. The time is formatted as a timestamp that follows the ISO 8601 standard, such as `2022-04-27T13:00:00-07:00` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-scheduledtriggerproperties.html#cfn-appflow-flow-scheduledtriggerproperties-scheduleendtime
         */
        readonly scheduleEndTime?: number;
        /**
         * The scheduling expression that determines the rate at which the schedule will run, for example `rate(5minutes)` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-scheduledtriggerproperties.html#cfn-appflow-flow-scheduledtriggerproperties-scheduleexpression
         */
        readonly scheduleExpression: string;
        /**
         * Specifies the optional offset that is added to the time interval for a schedule-triggered flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-scheduledtriggerproperties.html#cfn-appflow-flow-scheduledtriggerproperties-scheduleoffset
         */
        readonly scheduleOffset?: number;
        /**
         * The time at which the scheduled flow starts. The time is formatted as a timestamp that follows the ISO 8601 standard, such as `2022-04-26T13:00:00-07:00` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-scheduledtriggerproperties.html#cfn-appflow-flow-scheduledtriggerproperties-schedulestarttime
         */
        readonly scheduleStartTime?: number;
        /**
         * Specifies the time zone used when referring to the dates and times of a scheduled flow, such as `America/New_York` . This time zone is only a descriptive label. It doesn't affect how Amazon AppFlow interprets the timestamps that you specify to schedule the flow.
         *
         * If you want to schedule a flow by using times in a particular time zone, indicate the time zone as a UTC offset in your timestamps. For example, the UTC offsets for the `America/New_York` timezone are `-04:00` EDT and `-05:00 EST` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-scheduledtriggerproperties.html#cfn-appflow-flow-scheduledtriggerproperties-timezone
         */
        readonly timeZone?: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when ServiceNow is being used as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-servicenowsourceproperties.html
     */
    interface ServiceNowSourcePropertiesProperty {
        /**
         * The object specified in the ServiceNow flow source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-servicenowsourceproperties.html#cfn-appflow-flow-servicenowsourceproperties-object
         */
        readonly object: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when Singular is being used as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-singularsourceproperties.html
     */
    interface SingularSourcePropertiesProperty {
        /**
         * The object specified in the Singular flow source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-singularsourceproperties.html#cfn-appflow-flow-singularsourceproperties-object
         */
        readonly object: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when Slack is being used as a source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-slacksourceproperties.html
     */
    interface SlackSourcePropertiesProperty {
        /**
         * The object specified in the Slack flow source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-slacksourceproperties.html#cfn-appflow-flow-slacksourceproperties-object
         */
        readonly object: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when Snowflake is being used as a destination.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-snowflakedestinationproperties.html
     */
    interface SnowflakeDestinationPropertiesProperty {
        /**
         * The object key for the destination bucket in which Amazon AppFlow places the files.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-snowflakedestinationproperties.html#cfn-appflow-flow-snowflakedestinationproperties-bucketprefix
         */
        readonly bucketPrefix?: string;
        /**
         * The settings that determine how Amazon AppFlow handles an error when placing data in the Snowflake destination. For example, this setting would determine if the flow should fail after one insertion error, or continue and attempt to insert every record regardless of the initial failure. `ErrorHandlingConfig` is a part of the destination connector details.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-snowflakedestinationproperties.html#cfn-appflow-flow-snowflakedestinationproperties-errorhandlingconfig
         */
        readonly errorHandlingConfig?: CfnFlow.ErrorHandlingConfigProperty | cdk.IResolvable;
        /**
         * The intermediate bucket that Amazon AppFlow uses when moving data into Snowflake.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-snowflakedestinationproperties.html#cfn-appflow-flow-snowflakedestinationproperties-intermediatebucketname
         */
        readonly intermediateBucketName: string;
        /**
         * The object specified in the Snowflake flow destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-snowflakedestinationproperties.html#cfn-appflow-flow-snowflakedestinationproperties-object
         */
        readonly object: string;
    }
}
export declare namespace CfnFlow {
    /**
     * Specifies the information that is required to query a particular connector.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html
     */
    interface SourceConnectorPropertiesProperty {
        /**
         * Specifies the information that is required for querying Amplitude.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-amplitude
         */
        readonly amplitude?: CfnFlow.AmplitudeSourcePropertiesProperty | cdk.IResolvable;
        /**
         * The properties that are applied when the custom connector is being used as a source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-customconnector
         */
        readonly customConnector?: CfnFlow.CustomConnectorSourcePropertiesProperty | cdk.IResolvable;
        /**
         * Specifies the information that is required for querying Datadog.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-datadog
         */
        readonly datadog?: CfnFlow.DatadogSourcePropertiesProperty | cdk.IResolvable;
        /**
         * Specifies the information that is required for querying Dynatrace.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-dynatrace
         */
        readonly dynatrace?: CfnFlow.DynatraceSourcePropertiesProperty | cdk.IResolvable;
        /**
         * Specifies the information that is required for querying Google Analytics.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-googleanalytics
         */
        readonly googleAnalytics?: CfnFlow.GoogleAnalyticsSourcePropertiesProperty | cdk.IResolvable;
        /**
         * Specifies the information that is required for querying Infor Nexus.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-infornexus
         */
        readonly inforNexus?: CfnFlow.InforNexusSourcePropertiesProperty | cdk.IResolvable;
        /**
         * Specifies the information that is required for querying Marketo.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-marketo
         */
        readonly marketo?: CfnFlow.MarketoSourcePropertiesProperty | cdk.IResolvable;
        /**
         * Specifies the information that is required for querying Amazon S3.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-s3
         */
        readonly s3?: CfnFlow.S3SourcePropertiesProperty | cdk.IResolvable;
        /**
         * The properties that are applied when using SAPOData as a flow source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-sapodata
         */
        readonly sapoData?: CfnFlow.SAPODataSourcePropertiesProperty | cdk.IResolvable;
        /**
         * Specifies the information that is required for querying Salesforce.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-salesforce
         */
        readonly salesforce?: CfnFlow.SalesforceSourcePropertiesProperty | cdk.IResolvable;
        /**
         * Specifies the information that is required for querying ServiceNow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-servicenow
         */
        readonly serviceNow?: CfnFlow.ServiceNowSourcePropertiesProperty | cdk.IResolvable;
        /**
         * Specifies the information that is required for querying Singular.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-singular
         */
        readonly singular?: CfnFlow.SingularSourcePropertiesProperty | cdk.IResolvable;
        /**
         * Specifies the information that is required for querying Slack.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-slack
         */
        readonly slack?: CfnFlow.SlackSourcePropertiesProperty | cdk.IResolvable;
        /**
         * Specifies the information that is required for querying Trend Micro.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-trendmicro
         */
        readonly trendmicro?: CfnFlow.TrendmicroSourcePropertiesProperty | cdk.IResolvable;
        /**
         * Specifies the information that is required for querying Veeva.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-veeva
         */
        readonly veeva?: CfnFlow.VeevaSourcePropertiesProperty | cdk.IResolvable;
        /**
         * Specifies the information that is required for querying Zendesk.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceconnectorproperties.html#cfn-appflow-flow-sourceconnectorproperties-zendesk
         */
        readonly zendesk?: CfnFlow.ZendeskSourcePropertiesProperty | cdk.IResolvable;
    }
}
export declare namespace CfnFlow {
    /**
     * Contains information about the configuration of the source connector used in the flow.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceflowconfig.html
     */
    interface SourceFlowConfigProperty {
        /**
         * The API version of the connector when it's used as a source in the flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceflowconfig.html#cfn-appflow-flow-sourceflowconfig-apiversion
         */
        readonly apiVersion?: string;
        /**
         * The name of the connector profile. This name must be unique for each connector profile in the AWS account .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceflowconfig.html#cfn-appflow-flow-sourceflowconfig-connectorprofilename
         */
        readonly connectorProfileName?: string;
        /**
         * The type of source connector, such as Salesforce, Amplitude, and so on.
         *
         * *Allowed Values* : S3 | Amplitude | Datadog | Dynatrace | Googleanalytics | Infornexus | Salesforce | Servicenow | Singular | Slack | Trendmicro | Veeva | Zendesk
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceflowconfig.html#cfn-appflow-flow-sourceflowconfig-connectortype
         */
        readonly connectorType: string;
        /**
         * Defines the configuration for a scheduled incremental data pull. If a valid configuration is provided, the fields specified in the configuration are used when querying for the incremental data pull.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceflowconfig.html#cfn-appflow-flow-sourceflowconfig-incrementalpullconfig
         */
        readonly incrementalPullConfig?: CfnFlow.IncrementalPullConfigProperty | cdk.IResolvable;
        /**
         * Specifies the information that is required to query a particular source connector.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-sourceflowconfig.html#cfn-appflow-flow-sourceflowconfig-sourceconnectorproperties
         */
        readonly sourceConnectorProperties: CfnFlow.SourceConnectorPropertiesProperty | cdk.IResolvable;
    }
}
export declare namespace CfnFlow {
    /**
     * Determines how Amazon AppFlow handles the success response that it gets from the connector after placing data.
     *
     * For example, this setting would determine where to write the response from the destination connector upon a successful insert operation.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-successresponsehandlingconfig.html
     */
    interface SuccessResponseHandlingConfigProperty {
        /**
         * The name of the Amazon S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-successresponsehandlingconfig.html#cfn-appflow-flow-successresponsehandlingconfig-bucketname
         */
        readonly bucketName?: string;
        /**
         * The Amazon S3 bucket prefix.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-successresponsehandlingconfig.html#cfn-appflow-flow-successresponsehandlingconfig-bucketprefix
         */
        readonly bucketPrefix?: string;
    }
}
export declare namespace CfnFlow {
    /**
     * A class for modeling different type of tasks. Task implementation varies based on the `TaskType` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-task.html
     */
    interface TaskProperty {
        /**
         * The operation to be performed on the provided source fields.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-task.html#cfn-appflow-flow-task-connectoroperator
         */
        readonly connectorOperator?: CfnFlow.ConnectorOperatorProperty | cdk.IResolvable;
        /**
         * A field in a destination connector, or a field value against which Amazon AppFlow validates a source field.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-task.html#cfn-appflow-flow-task-destinationfield
         */
        readonly destinationField?: string;
        /**
         * The source fields to which a particular task is applied.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-task.html#cfn-appflow-flow-task-sourcefields
         */
        readonly sourceFields: string[];
        /**
         * A map used to store task-related information. The execution service looks for particular information based on the `TaskType` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-task.html#cfn-appflow-flow-task-taskproperties
         */
        readonly taskProperties?: Array<CfnFlow.TaskPropertiesObjectProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * Specifies the particular task implementation that Amazon AppFlow performs.
         *
         * *Allowed values* : `Arithmetic` | `Filter` | `Map` | `Map_all` | `Mask` | `Merge` | `Truncate` | `Validate`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-task.html#cfn-appflow-flow-task-tasktype
         */
        readonly taskType: string;
    }
}
export declare namespace CfnFlow {
    /**
     * A map used to store task-related information. The execution service looks for particular information based on the `TaskType` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-taskpropertiesobject.html
     */
    interface TaskPropertiesObjectProperty {
        /**
         * The task property key.
         *
         * *Allowed Values* : `VALUE | VALUES | DATA_TYPE | UPPER_BOUND | LOWER_BOUND | SOURCE_DATA_TYPE | DESTINATION_DATA_TYPE | VALIDATION_ACTION | MASK_VALUE | MASK_LENGTH | TRUNCATE_LENGTH | MATH_OPERATION_FIELDS_ORDER | CONCAT_FORMAT | SUBFIELD_CATEGORY_MAP` | `EXCLUDE_SOURCE_FIELDS_LIST`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-taskpropertiesobject.html#cfn-appflow-flow-taskpropertiesobject-key
         */
        readonly key: string;
        /**
         * The task property value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-taskpropertiesobject.html#cfn-appflow-flow-taskpropertiesobject-value
         */
        readonly value: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when using Trend Micro as a flow source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-trendmicrosourceproperties.html
     */
    interface TrendmicroSourcePropertiesProperty {
        /**
         * The object specified in the Trend Micro flow source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-trendmicrosourceproperties.html#cfn-appflow-flow-trendmicrosourceproperties-object
         */
        readonly object: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The trigger settings that determine how and when Amazon AppFlow runs the specified flow.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-triggerconfig.html
     */
    interface TriggerConfigProperty {
        /**
         * Specifies the configuration details of a schedule-triggered flow as defined by the user. Currently, these settings only apply to the `Scheduled` trigger type.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-triggerconfig.html#cfn-appflow-flow-triggerconfig-triggerproperties
         */
        readonly triggerProperties?: CfnFlow.ScheduledTriggerPropertiesProperty | cdk.IResolvable;
        /**
         * Specifies the type of flow trigger. This can be `OnDemand` , `Scheduled` , or `Event` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-triggerconfig.html#cfn-appflow-flow-triggerconfig-triggertype
         */
        readonly triggerType: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when Upsolver is used as a destination.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-upsolverdestinationproperties.html
     */
    interface UpsolverDestinationPropertiesProperty {
        /**
         * The Upsolver Amazon S3 bucket name in which Amazon AppFlow places the transferred data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-upsolverdestinationproperties.html#cfn-appflow-flow-upsolverdestinationproperties-bucketname
         */
        readonly bucketName: string;
        /**
         * The object key for the destination Upsolver Amazon S3 bucket in which Amazon AppFlow places the files.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-upsolverdestinationproperties.html#cfn-appflow-flow-upsolverdestinationproperties-bucketprefix
         */
        readonly bucketPrefix?: string;
        /**
         * The configuration that determines how data is formatted when Upsolver is used as the flow destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-upsolverdestinationproperties.html#cfn-appflow-flow-upsolverdestinationproperties-s3outputformatconfig
         */
        readonly s3OutputFormatConfig: CfnFlow.UpsolverS3OutputFormatConfigProperty | cdk.IResolvable;
    }
}
export declare namespace CfnFlow {
    /**
     * The configuration that determines how Amazon AppFlow formats the flow output data when Upsolver is used as the destination.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-upsolvers3outputformatconfig.html
     */
    interface UpsolverS3OutputFormatConfigProperty {
        /**
         * The aggregation settings that you can use to customize the output format of your flow data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-upsolvers3outputformatconfig.html#cfn-appflow-flow-upsolvers3outputformatconfig-aggregationconfig
         */
        readonly aggregationConfig?: CfnFlow.AggregationConfigProperty | cdk.IResolvable;
        /**
         * Indicates the file type that Amazon AppFlow places in the Upsolver Amazon S3 bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-upsolvers3outputformatconfig.html#cfn-appflow-flow-upsolvers3outputformatconfig-filetype
         */
        readonly fileType?: string;
        /**
         * Specifies elements that Amazon AppFlow includes in the file and folder names in the flow destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-upsolvers3outputformatconfig.html#cfn-appflow-flow-upsolvers3outputformatconfig-prefixconfig
         */
        readonly prefixConfig: CfnFlow.PrefixConfigProperty | cdk.IResolvable;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when using Veeva as a flow source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-veevasourceproperties.html
     */
    interface VeevaSourcePropertiesProperty {
        /**
         * The document type specified in the Veeva document extract flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-veevasourceproperties.html#cfn-appflow-flow-veevasourceproperties-documenttype
         */
        readonly documentType?: string;
        /**
         * Boolean value to include All Versions of files in Veeva document extract flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-veevasourceproperties.html#cfn-appflow-flow-veevasourceproperties-includeallversions
         */
        readonly includeAllVersions?: boolean | cdk.IResolvable;
        /**
         * Boolean value to include file renditions in Veeva document extract flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-veevasourceproperties.html#cfn-appflow-flow-veevasourceproperties-includerenditions
         */
        readonly includeRenditions?: boolean | cdk.IResolvable;
        /**
         * Boolean value to include source files in Veeva document extract flow.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-veevasourceproperties.html#cfn-appflow-flow-veevasourceproperties-includesourcefiles
         */
        readonly includeSourceFiles?: boolean | cdk.IResolvable;
        /**
         * The object specified in the Veeva flow source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-veevasourceproperties.html#cfn-appflow-flow-veevasourceproperties-object
         */
        readonly object: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when Zendesk is used as a destination.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-zendeskdestinationproperties.html
     */
    interface ZendeskDestinationPropertiesProperty {
        /**
         * The settings that determine how Amazon AppFlow handles an error when placing data in the destination. For example, this setting would determine if the flow should fail after one insertion error, or continue and attempt to insert every record regardless of the initial failure. `ErrorHandlingConfig` is a part of the destination connector details.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-zendeskdestinationproperties.html#cfn-appflow-flow-zendeskdestinationproperties-errorhandlingconfig
         */
        readonly errorHandlingConfig?: CfnFlow.ErrorHandlingConfigProperty | cdk.IResolvable;
        /**
         * A list of field names that can be used as an ID field when performing a write operation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-zendeskdestinationproperties.html#cfn-appflow-flow-zendeskdestinationproperties-idfieldnames
         */
        readonly idFieldNames?: string[];
        /**
         * The object specified in the Zendesk flow destination.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-zendeskdestinationproperties.html#cfn-appflow-flow-zendeskdestinationproperties-object
         */
        readonly object: string;
        /**
         * The possible write operations in the destination connector. When this value is not provided, this defaults to the `INSERT` operation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-zendeskdestinationproperties.html#cfn-appflow-flow-zendeskdestinationproperties-writeoperationtype
         */
        readonly writeOperationType?: string;
    }
}
export declare namespace CfnFlow {
    /**
     * The properties that are applied when using Zendesk as a flow source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-zendesksourceproperties.html
     */
    interface ZendeskSourcePropertiesProperty {
        /**
         * The object specified in the Zendesk flow source.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appflow-flow-zendesksourceproperties.html#cfn-appflow-flow-zendesksourceproperties-object
         */
        readonly object: string;
    }
}
