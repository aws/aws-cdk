import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnFHIRDatastore`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html
 */
export interface CfnFHIRDatastoreProps {
    /**
     * The FHIR version of the Data Store. The only supported version is R4.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-datastoretypeversion
     */
    readonly datastoreTypeVersion: string;
    /**
     * The user generated name for the Data Store.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-datastorename
     */
    readonly datastoreName?: string;
    /**
     * The preloaded data configuration for the Data Store. Only data preloaded from Synthea is supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-preloaddataconfig
     */
    readonly preloadDataConfig?: CfnFHIRDatastore.PreloadDataConfigProperty | cdk.IResolvable;
    /**
     * The server-side encryption key configuration for a customer provided encryption key specified for creating a Data Store.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-sseconfiguration
     */
    readonly sseConfiguration?: CfnFHIRDatastore.SseConfigurationProperty | cdk.IResolvable;
    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::HealthLake::FHIRDatastore`
 *
 * Creates a Data Store that can ingest and export FHIR formatted data.
 *
 * > Please note that when a user tries to do an Update operation via CloudFormation, changes to the Data Store name, Type Version, PreloadDataConfig, or SSEConfiguration will delete their existing Data Store for the stack and create a new one. This will lead to potential loss of data.
 *
 * @cloudformationResource AWS::HealthLake::FHIRDatastore
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html
 */
export declare class CfnFHIRDatastore extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::HealthLake::FHIRDatastore";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFHIRDatastore;
    /**
     *
     * @cloudformationAttribute CreatedAt.Nanos
     */
    readonly attrCreatedAtNanos: number;
    /**
     *
     * @cloudformationAttribute CreatedAt.Seconds
     */
    readonly attrCreatedAtSeconds: string;
    /**
     * The Data Store ARN is generated during the creation of the Data Store and can be found in the output from the initial Data Store creation request.
     * @cloudformationAttribute DatastoreArn
     */
    readonly attrDatastoreArn: string;
    /**
     * The endpoint for the created Data Store.
     * @cloudformationAttribute DatastoreEndpoint
     */
    readonly attrDatastoreEndpoint: string;
    /**
     * The Amazon generated Data Store id. This id is in the output from the initial Data Store creation call.
     * @cloudformationAttribute DatastoreId
     */
    readonly attrDatastoreId: string;
    /**
     * The status of the FHIR Data Store. Possible statuses are ‘CREATING’, ‘ACTIVE’, ‘DELETING’, ‘DELETED’.
     * @cloudformationAttribute DatastoreStatus
     */
    readonly attrDatastoreStatus: string;
    /**
     * The FHIR version of the Data Store. The only supported version is R4.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-datastoretypeversion
     */
    datastoreTypeVersion: string;
    /**
     * The user generated name for the Data Store.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-datastorename
     */
    datastoreName: string | undefined;
    /**
     * The preloaded data configuration for the Data Store. Only data preloaded from Synthea is supported.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-preloaddataconfig
     */
    preloadDataConfig: CfnFHIRDatastore.PreloadDataConfigProperty | cdk.IResolvable | undefined;
    /**
     * The server-side encryption key configuration for a customer provided encryption key specified for creating a Data Store.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-sseconfiguration
     */
    sseConfiguration: CfnFHIRDatastore.SseConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-healthlake-fhirdatastore.html#cfn-healthlake-fhirdatastore-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::HealthLake::FHIRDatastore`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnFHIRDatastoreProps);
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
export declare namespace CfnFHIRDatastore {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-createdat.html
     */
    interface CreatedAtProperty {
        /**
         * `CfnFHIRDatastore.CreatedAtProperty.Nanos`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-createdat.html#cfn-healthlake-fhirdatastore-createdat-nanos
         */
        readonly nanos: number;
        /**
         * `CfnFHIRDatastore.CreatedAtProperty.Seconds`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-createdat.html#cfn-healthlake-fhirdatastore-createdat-seconds
         */
        readonly seconds: string;
    }
}
export declare namespace CfnFHIRDatastore {
    /**
     * The customer-managed-key(CMK) used when creating a Data Store. If a customer owned key is not specified, an Amazon owned key will be used for encryption.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-kmsencryptionconfig.html
     */
    interface KmsEncryptionConfigProperty {
        /**
         * The type of customer-managed-key(CMK) used for encryption. The two types of supported CMKs are customer owned CMKs and Amazon owned CMKs. For more information on CMK types, see [KmsEncryptionConfig](https://docs.aws.amazon.com/healthlake/latest/APIReference/API_KmsEncryptionConfig.html#HealthLake-Type-KmsEncryptionConfig-CmkType) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-kmsencryptionconfig.html#cfn-healthlake-fhirdatastore-kmsencryptionconfig-cmktype
         */
        readonly cmkType: string;
        /**
         * The KMS encryption key id/alias used to encrypt the Data Store contents at rest.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-kmsencryptionconfig.html#cfn-healthlake-fhirdatastore-kmsencryptionconfig-kmskeyid
         */
        readonly kmsKeyId?: string;
    }
}
export declare namespace CfnFHIRDatastore {
    /**
     * Optional parameter to preload data upon creation of the Data Store. Currently, the only supported preloaded data is synthetic data generated from Synthea.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-preloaddataconfig.html
     */
    interface PreloadDataConfigProperty {
        /**
         * The type of preloaded data. Only Synthea preloaded data is supported.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-preloaddataconfig.html#cfn-healthlake-fhirdatastore-preloaddataconfig-preloaddatatype
         */
        readonly preloadDataType: string;
    }
}
export declare namespace CfnFHIRDatastore {
    /**
     * The server-side encryption key configuration for a customer provided encryption key.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-sseconfiguration.html
     */
    interface SseConfigurationProperty {
        /**
         * The server-side encryption key configuration for a customer provided encryption key (CMK).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-healthlake-fhirdatastore-sseconfiguration.html#cfn-healthlake-fhirdatastore-sseconfiguration-kmsencryptionconfig
         */
        readonly kmsEncryptionConfig: CfnFHIRDatastore.KmsEncryptionConfigProperty | cdk.IResolvable;
    }
}
