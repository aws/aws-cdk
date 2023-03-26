import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnEnvironment`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html
 */
export interface CfnEnvironmentProps {
    /**
     * The name of the FinSpace environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-name
     */
    readonly name: string;
    /**
     * The list of Amazon Resource Names (ARN) of the data bundles to install. Currently supported data bundle ARNs:
     *
     * - `arn:aws:finspace:${Region}::data-bundle/capital-markets-sample` - Contains sample Capital Markets datasets, categories and controlled vocabularies.
     * - `arn:aws:finspace:${Region}::data-bundle/taq` (default) - Contains trades and quotes data in addition to sample Capital Markets data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-databundles
     */
    readonly dataBundles?: string[];
    /**
     * The description of the FinSpace environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-description
     */
    readonly description?: string;
    /**
     * The authentication mode for the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-federationmode
     */
    readonly federationMode?: string;
    /**
     * Configuration information when authentication mode is FEDERATED.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-federationparameters
     */
    readonly federationParameters?: CfnEnvironment.FederationParametersProperty | cdk.IResolvable;
    /**
     * The KMS key id used to encrypt in the FinSpace environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-kmskeyid
     */
    readonly kmsKeyId?: string;
    /**
     * Configuration information for the superuser.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-superuserparameters
     */
    readonly superuserParameters?: CfnEnvironment.SuperuserParametersProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::FinSpace::Environment`
 *
 * The `AWS::FinSpace::Environment` resource represents an Amazon FinSpace environment.
 *
 * @cloudformationResource AWS::FinSpace::Environment
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html
 */
export declare class CfnEnvironment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::FinSpace::Environment";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEnvironment;
    /**
     * The ID of the AWS account in which the FinSpace environment is created.
     * @cloudformationAttribute AwsAccountId
     */
    readonly attrAwsAccountId: string;
    /**
     * The AWS account ID of the dedicated service account associated with your FinSpace environment.
     * @cloudformationAttribute DedicatedServiceAccountId
     */
    readonly attrDedicatedServiceAccountId: string;
    /**
     * The Amazon Resource Name (ARN) of your FinSpace environment.
     * @cloudformationAttribute EnvironmentArn
     */
    readonly attrEnvironmentArn: string;
    /**
     * The identifier of the FinSpace environment.
     * @cloudformationAttribute EnvironmentId
     */
    readonly attrEnvironmentId: string;
    /**
     * The sign-in url for the web application of your FinSpace environment.
     * @cloudformationAttribute EnvironmentUrl
     */
    readonly attrEnvironmentUrl: string;
    /**
     * The url of the integrated FinSpace notebook environment in your web application.
     * @cloudformationAttribute SageMakerStudioDomainUrl
     */
    readonly attrSageMakerStudioDomainUrl: string;
    /**
     * The current status of creation of the FinSpace environment.
     * @cloudformationAttribute Status
     */
    readonly attrStatus: string;
    /**
     * The name of the FinSpace environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-name
     */
    name: string;
    /**
     * The list of Amazon Resource Names (ARN) of the data bundles to install. Currently supported data bundle ARNs:
     *
     * - `arn:aws:finspace:${Region}::data-bundle/capital-markets-sample` - Contains sample Capital Markets datasets, categories and controlled vocabularies.
     * - `arn:aws:finspace:${Region}::data-bundle/taq` (default) - Contains trades and quotes data in addition to sample Capital Markets data.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-databundles
     */
    dataBundles: string[] | undefined;
    /**
     * The description of the FinSpace environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-description
     */
    description: string | undefined;
    /**
     * The authentication mode for the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-federationmode
     */
    federationMode: string | undefined;
    /**
     * Configuration information when authentication mode is FEDERATED.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-federationparameters
     */
    federationParameters: CfnEnvironment.FederationParametersProperty | cdk.IResolvable | undefined;
    /**
     * The KMS key id used to encrypt in the FinSpace environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-kmskeyid
     */
    kmsKeyId: string | undefined;
    /**
     * Configuration information for the superuser.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-finspace-environment.html#cfn-finspace-environment-superuserparameters
     */
    superuserParameters: CfnEnvironment.SuperuserParametersProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::FinSpace::Environment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnEnvironmentProps);
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
export declare namespace CfnEnvironment {
    /**
     * Configuration information when authentication mode is FEDERATED.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-federationparameters.html
     */
    interface FederationParametersProperty {
        /**
         * The redirect or sign-in URL that should be entered into the SAML 2.0 compliant identity provider configuration (IdP).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-federationparameters.html#cfn-finspace-environment-federationparameters-applicationcallbackurl
         */
        readonly applicationCallBackUrl?: string;
        /**
         * SAML attribute name and value. The name must always be `Email` and the value should be set to the attribute definition in which user email is set. For example, name would be `Email` and value `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress` . Please check your SAML 2.0 compliant identity provider (IdP) documentation for details.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-federationparameters.html#cfn-finspace-environment-federationparameters-attributemap
         */
        readonly attributeMap?: any | cdk.IResolvable;
        /**
         * Name of the identity provider (IdP).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-federationparameters.html#cfn-finspace-environment-federationparameters-federationprovidername
         */
        readonly federationProviderName?: string;
        /**
         * The Uniform Resource Name (URN). Also referred as Service Provider URN or Audience URI or Service Provider Entity ID.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-federationparameters.html#cfn-finspace-environment-federationparameters-federationurn
         */
        readonly federationUrn?: string;
        /**
         * SAML 2.0 Metadata document from identity provider (IdP).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-federationparameters.html#cfn-finspace-environment-federationparameters-samlmetadatadocument
         */
        readonly samlMetadataDocument?: string;
        /**
         * Provide the metadata URL from your SAML 2.0 compliant identity provider (IdP).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-federationparameters.html#cfn-finspace-environment-federationparameters-samlmetadataurl
         */
        readonly samlMetadataUrl?: string;
    }
}
export declare namespace CfnEnvironment {
    /**
     * Configuration information for the superuser.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-superuserparameters.html
     */
    interface SuperuserParametersProperty {
        /**
         * The email address of the superuser.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-superuserparameters.html#cfn-finspace-environment-superuserparameters-emailaddress
         */
        readonly emailAddress?: string;
        /**
         * The first name of the superuser.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-superuserparameters.html#cfn-finspace-environment-superuserparameters-firstname
         */
        readonly firstName?: string;
        /**
         * The last name of the superuser.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-finspace-environment-superuserparameters.html#cfn-finspace-environment-superuserparameters-lastname
         */
        readonly lastName?: string;
    }
}
