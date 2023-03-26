import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnSkill`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ask-skill.html
 */
export interface CfnSkillProps {
    /**
     * Login with Amazon (LWA) configuration used to authenticate with the Alexa service. Only Login with Amazon clients created through the  are supported. The client ID, client secret, and refresh token are required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ask-skill.html#cfn-ask-skill-authenticationconfiguration
     */
    readonly authenticationConfiguration: CfnSkill.AuthenticationConfigurationProperty | cdk.IResolvable;
    /**
     * Configuration for the skill package that contains the components of the Alexa skill. Skill packages are retrieved from an Amazon S3 bucket and key and used to create and update the skill. For more information about the skill package format, see the  .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ask-skill.html#cfn-ask-skill-skillpackage
     */
    readonly skillPackage: CfnSkill.SkillPackageProperty | cdk.IResolvable;
    /**
     * The vendor ID associated with the Amazon developer account that will host the skill. Details for retrieving the vendor ID are in  . The provided LWA credentials must be linked to the developer account associated with this vendor ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ask-skill.html#cfn-ask-skill-vendorid
     */
    readonly vendorId: string;
}
/**
 * A CloudFormation `Alexa::ASK::Skill`
 *
 * The `Alexa::ASK::Skill` resource creates an Alexa skill that enables customers to access new abilities. For more information about developing a skill, see the  .
 *
 * @cloudformationResource Alexa::ASK::Skill
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ask-skill.html
 */
export declare class CfnSkill extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "Alexa::ASK::Skill";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSkill;
    /**
     * Login with Amazon (LWA) configuration used to authenticate with the Alexa service. Only Login with Amazon clients created through the  are supported. The client ID, client secret, and refresh token are required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ask-skill.html#cfn-ask-skill-authenticationconfiguration
     */
    authenticationConfiguration: CfnSkill.AuthenticationConfigurationProperty | cdk.IResolvable;
    /**
     * Configuration for the skill package that contains the components of the Alexa skill. Skill packages are retrieved from an Amazon S3 bucket and key and used to create and update the skill. For more information about the skill package format, see the  .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ask-skill.html#cfn-ask-skill-skillpackage
     */
    skillPackage: CfnSkill.SkillPackageProperty | cdk.IResolvable;
    /**
     * The vendor ID associated with the Amazon developer account that will host the skill. Details for retrieving the vendor ID are in  . The provided LWA credentials must be linked to the developer account associated with this vendor ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ask-skill.html#cfn-ask-skill-vendorid
     */
    vendorId: string;
    /**
     * Create a new `Alexa::ASK::Skill`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSkillProps);
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
export declare namespace CfnSkill {
    /**
     * The `AuthenticationConfiguration` property type specifies the Login with Amazon (LWA) configuration used to authenticate with the Alexa service. Only Login with Amazon security profiles created through the  are supported for authentication. A client ID, client secret, and refresh token are required. You can generate a client ID and client secret by creating a new  on the Amazon Developer Portal or you can retrieve them from an existing profile. You can then retrieve the refresh token using the Alexa Skills Kit CLI. For instructions, see  in the  .
     *
     * `AuthenticationConfiguration` is a property of the `Alexa::ASK::Skill` resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-authenticationconfiguration.html
     */
    interface AuthenticationConfigurationProperty {
        /**
         * Client ID from Login with Amazon (LWA).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-authenticationconfiguration.html#cfn-ask-skill-authenticationconfiguration-clientid
         */
        readonly clientId: string;
        /**
         * Client secret from Login with Amazon (LWA).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-authenticationconfiguration.html#cfn-ask-skill-authenticationconfiguration-clientsecret
         */
        readonly clientSecret: string;
        /**
         * Refresh token from Login with Amazon (LWA). This token is secret.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-authenticationconfiguration.html#cfn-ask-skill-authenticationconfiguration-refreshtoken
         */
        readonly refreshToken: string;
    }
}
export declare namespace CfnSkill {
    /**
     * The `Overrides` property type provides overrides to the skill package to apply when creating or updating the skill. Values provided here do not modify the contents of the original skill package. Currently, only overriding values inside of the skill manifest component of the package is supported.
     *
     * `Overrides` is a property of the `Alexa::ASK::Skill SkillPackage` property type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-overrides.html
     */
    interface OverridesProperty {
        /**
         * Overrides to apply to the skill manifest inside of the skill package. The skill manifest contains metadata about the skill. For more information, see  .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-overrides.html#cfn-ask-skill-overrides-manifest
         */
        readonly manifest?: any | cdk.IResolvable;
    }
}
export declare namespace CfnSkill {
    /**
     * The `SkillPackage` property type contains configuration details for the skill package that contains the components of the Alexa skill. Skill packages are retrieved from an Amazon S3 bucket and key and used to create and update the skill. More details about the skill package format are located in the  .
     *
     * `SkillPackage` is a property of the `Alexa::ASK::Skill` resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-skillpackage.html
     */
    interface SkillPackageProperty {
        /**
         * Overrides to the skill package to apply when creating or updating the skill. Values provided here do not modify the contents of the original skill package. Currently, only overriding values inside of the skill manifest component of the package is supported.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-skillpackage.html#cfn-ask-skill-skillpackage-overrides
         */
        readonly overrides?: CfnSkill.OverridesProperty | cdk.IResolvable;
        /**
         * The name of the Amazon S3 bucket where the .zip file that contains the skill package is stored.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-skillpackage.html#cfn-ask-skill-skillpackage-s3bucket
         */
        readonly s3Bucket: string;
        /**
         * ARN of the IAM role that grants the Alexa service ( `alexa-appkit.amazon.com` ) permission to access the bucket and retrieve the skill package. This property is optional. If you do not provide it, the bucket must be publicly accessible or configured with a policy that allows this access. Otherwise, AWS CloudFormation cannot create the skill.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-skillpackage.html#cfn-ask-skill-skillpackage-s3bucketrole
         */
        readonly s3BucketRole?: string;
        /**
         * The location and name of the skill package .zip file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-skillpackage.html#cfn-ask-skill-skillpackage-s3key
         */
        readonly s3Key: string;
        /**
         * If you have S3 versioning enabled, the version ID of the skill package.zip file.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ask-skill-skillpackage.html#cfn-ask-skill-skillpackage-s3objectversion
         */
        readonly s3ObjectVersion?: string;
    }
}
