import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnGrant`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html
 */
export interface CfnGrantProps {
    /**
     * Allowed operations for the grant.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-allowedoperations
     */
    readonly allowedOperations?: string[];
    /**
     * Grant name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-grantname
     */
    readonly grantName?: string;
    /**
     * Home Region of the grant.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-homeregion
     */
    readonly homeRegion?: string;
    /**
     * License ARN.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-licensearn
     */
    readonly licenseArn?: string;
    /**
     * The grant principals. You can specify one of the following as an Amazon Resource Name (ARN):
     *
     * - An AWS account, which includes only the account specified.
     *
     * - An organizational unit (OU), which includes all accounts in the OU.
     *
     * - An organization, which will include all accounts across your organization.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-principals
     */
    readonly principals?: string[];
    /**
     * Granted license status.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-status
     */
    readonly status?: string;
}
/**
 * A CloudFormation `AWS::LicenseManager::Grant`
 *
 * Specifies a grant.
 *
 * A grant shares the use of license entitlements with specific AWS accounts . For more information, see [Granted licenses](https://docs.aws.amazon.com/license-manager/latest/userguide/granted-licenses.html) in the *AWS License Manager User Guide* .
 *
 * @cloudformationResource AWS::LicenseManager::Grant
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html
 */
export declare class CfnGrant extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::LicenseManager::Grant";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnGrant;
    /**
     * The Amazon Resource Name (ARN) of the grant.
     * @cloudformationAttribute GrantArn
     */
    readonly attrGrantArn: string;
    /**
     * The grant version.
     * @cloudformationAttribute Version
     */
    readonly attrVersion: string;
    /**
     * Allowed operations for the grant.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-allowedoperations
     */
    allowedOperations: string[] | undefined;
    /**
     * Grant name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-grantname
     */
    grantName: string | undefined;
    /**
     * Home Region of the grant.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-homeregion
     */
    homeRegion: string | undefined;
    /**
     * License ARN.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-licensearn
     */
    licenseArn: string | undefined;
    /**
     * The grant principals. You can specify one of the following as an Amazon Resource Name (ARN):
     *
     * - An AWS account, which includes only the account specified.
     *
     * - An organizational unit (OU), which includes all accounts in the OU.
     *
     * - An organization, which will include all accounts across your organization.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-principals
     */
    principals: string[] | undefined;
    /**
     * Granted license status.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-grant.html#cfn-licensemanager-grant-status
     */
    status: string | undefined;
    /**
     * Create a new `AWS::LicenseManager::Grant`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnGrantProps);
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
/**
 * Properties for defining a `CfnLicense`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html
 */
export interface CfnLicenseProps {
    /**
     * Configuration for consumption of the license.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-consumptionconfiguration
     */
    readonly consumptionConfiguration: CfnLicense.ConsumptionConfigurationProperty | cdk.IResolvable;
    /**
     * License entitlements.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-entitlements
     */
    readonly entitlements: Array<CfnLicense.EntitlementProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Home Region of the license.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-homeregion
     */
    readonly homeRegion: string;
    /**
     * License issuer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-issuer
     */
    readonly issuer: CfnLicense.IssuerDataProperty | cdk.IResolvable;
    /**
     * License name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-licensename
     */
    readonly licenseName: string;
    /**
     * Product name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-productname
     */
    readonly productName: string;
    /**
     * Date and time range during which the license is valid, in ISO8601-UTC format.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-validity
     */
    readonly validity: CfnLicense.ValidityDateFormatProperty | cdk.IResolvable;
    /**
     * License beneficiary.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-beneficiary
     */
    readonly beneficiary?: string;
    /**
     * License metadata.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-licensemetadata
     */
    readonly licenseMetadata?: Array<CfnLicense.MetadataProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Product SKU.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-productsku
     */
    readonly productSku?: string;
    /**
     * License status.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-status
     */
    readonly status?: string;
}
/**
 * A CloudFormation `AWS::LicenseManager::License`
 *
 * Specifies a granted license.
 *
 * Granted licenses are licenses for products that your organization purchased from AWS Marketplace or directly from a seller who integrated their software with managed entitlements. For more information, see [Granted licenses](https://docs.aws.amazon.com/license-manager/latest/userguide/granted-licenses.html) in the *AWS License Manager User Guide* .
 *
 * @cloudformationResource AWS::LicenseManager::License
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html
 */
export declare class CfnLicense extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::LicenseManager::License";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLicense;
    /**
     * The Amazon Resource Name (ARN) of the license.
     * @cloudformationAttribute LicenseArn
     */
    readonly attrLicenseArn: string;
    /**
     * The license version.
     * @cloudformationAttribute Version
     */
    readonly attrVersion: string;
    /**
     * Configuration for consumption of the license.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-consumptionconfiguration
     */
    consumptionConfiguration: CfnLicense.ConsumptionConfigurationProperty | cdk.IResolvable;
    /**
     * License entitlements.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-entitlements
     */
    entitlements: Array<CfnLicense.EntitlementProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Home Region of the license.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-homeregion
     */
    homeRegion: string;
    /**
     * License issuer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-issuer
     */
    issuer: CfnLicense.IssuerDataProperty | cdk.IResolvable;
    /**
     * License name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-licensename
     */
    licenseName: string;
    /**
     * Product name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-productname
     */
    productName: string;
    /**
     * Date and time range during which the license is valid, in ISO8601-UTC format.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-validity
     */
    validity: CfnLicense.ValidityDateFormatProperty | cdk.IResolvable;
    /**
     * License beneficiary.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-beneficiary
     */
    beneficiary: string | undefined;
    /**
     * License metadata.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-licensemetadata
     */
    licenseMetadata: Array<CfnLicense.MetadataProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Product SKU.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-productsku
     */
    productSku: string | undefined;
    /**
     * License status.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-licensemanager-license.html#cfn-licensemanager-license-status
     */
    status: string | undefined;
    /**
     * Create a new `AWS::LicenseManager::License`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLicenseProps);
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
export declare namespace CfnLicense {
    /**
     * Details about a borrow configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-borrowconfiguration.html
     */
    interface BorrowConfigurationProperty {
        /**
         * Indicates whether early check-ins are allowed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-borrowconfiguration.html#cfn-licensemanager-license-borrowconfiguration-allowearlycheckin
         */
        readonly allowEarlyCheckIn: boolean | cdk.IResolvable;
        /**
         * Maximum time for the borrow configuration, in minutes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-borrowconfiguration.html#cfn-licensemanager-license-borrowconfiguration-maxtimetoliveinminutes
         */
        readonly maxTimeToLiveInMinutes: number;
    }
}
export declare namespace CfnLicense {
    /**
     * Details about a consumption configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-consumptionconfiguration.html
     */
    interface ConsumptionConfigurationProperty {
        /**
         * Details about a borrow configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-consumptionconfiguration.html#cfn-licensemanager-license-consumptionconfiguration-borrowconfiguration
         */
        readonly borrowConfiguration?: CfnLicense.BorrowConfigurationProperty | cdk.IResolvable;
        /**
         * Details about a provisional configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-consumptionconfiguration.html#cfn-licensemanager-license-consumptionconfiguration-provisionalconfiguration
         */
        readonly provisionalConfiguration?: CfnLicense.ProvisionalConfigurationProperty | cdk.IResolvable;
        /**
         * Renewal frequency.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-consumptionconfiguration.html#cfn-licensemanager-license-consumptionconfiguration-renewtype
         */
        readonly renewType?: string;
    }
}
export declare namespace CfnLicense {
    /**
     * Describes a resource entitled for use with a license.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-entitlement.html
     */
    interface EntitlementProperty {
        /**
         * Indicates whether check-ins are allowed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-entitlement.html#cfn-licensemanager-license-entitlement-allowcheckin
         */
        readonly allowCheckIn?: boolean | cdk.IResolvable;
        /**
         * Maximum entitlement count. Use if the unit is not None.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-entitlement.html#cfn-licensemanager-license-entitlement-maxcount
         */
        readonly maxCount?: number;
        /**
         * Entitlement name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-entitlement.html#cfn-licensemanager-license-entitlement-name
         */
        readonly name: string;
        /**
         * Indicates whether overages are allowed.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-entitlement.html#cfn-licensemanager-license-entitlement-overage
         */
        readonly overage?: boolean | cdk.IResolvable;
        /**
         * Entitlement unit.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-entitlement.html#cfn-licensemanager-license-entitlement-unit
         */
        readonly unit: string;
        /**
         * Entitlement resource. Use only if the unit is None.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-entitlement.html#cfn-licensemanager-license-entitlement-value
         */
        readonly value?: string;
    }
}
export declare namespace CfnLicense {
    /**
     * Details associated with the issuer of a license.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-issuerdata.html
     */
    interface IssuerDataProperty {
        /**
         * Issuer name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-issuerdata.html#cfn-licensemanager-license-issuerdata-name
         */
        readonly name: string;
        /**
         * Asymmetric KMS key from AWS Key Management Service . The KMS key must have a key usage of sign and verify, and support the RSASSA-PSS SHA-256 signing algorithm.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-issuerdata.html#cfn-licensemanager-license-issuerdata-signkey
         */
        readonly signKey?: string;
    }
}
export declare namespace CfnLicense {
    /**
     * Describes key/value pairs.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-metadata.html
     */
    interface MetadataProperty {
        /**
         * The key name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-metadata.html#cfn-licensemanager-license-metadata-name
         */
        readonly name: string;
        /**
         * The value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-metadata.html#cfn-licensemanager-license-metadata-value
         */
        readonly value: string;
    }
}
export declare namespace CfnLicense {
    /**
     * Details about a provisional configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-provisionalconfiguration.html
     */
    interface ProvisionalConfigurationProperty {
        /**
         * Maximum time for the provisional configuration, in minutes.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-provisionalconfiguration.html#cfn-licensemanager-license-provisionalconfiguration-maxtimetoliveinminutes
         */
        readonly maxTimeToLiveInMinutes: number;
    }
}
export declare namespace CfnLicense {
    /**
     * Date and time range during which the license is valid, in ISO8601-UTC format.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-validitydateformat.html
     */
    interface ValidityDateFormatProperty {
        /**
         * Start of the time range.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-validitydateformat.html#cfn-licensemanager-license-validitydateformat-begin
         */
        readonly begin: string;
        /**
         * End of the time range.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-licensemanager-license-validitydateformat.html#cfn-licensemanager-license-validitydateformat-end
         */
        readonly end: string;
    }
}
