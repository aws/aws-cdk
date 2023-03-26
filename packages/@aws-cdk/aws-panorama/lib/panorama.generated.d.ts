import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnApplicationInstance`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html
 */
export interface CfnApplicationInstanceProps {
    /**
     * The device's ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-defaultruntimecontextdevice
     */
    readonly defaultRuntimeContextDevice: string;
    /**
     * The application's manifest document.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-manifestpayload
     */
    readonly manifestPayload: CfnApplicationInstance.ManifestPayloadProperty | cdk.IResolvable;
    /**
     * The ID of an application instance to replace with the new instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-applicationinstanceidtoreplace
     */
    readonly applicationInstanceIdToReplace?: string;
    /**
     * A description for the application instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-description
     */
    readonly description?: string;
    /**
     * A device's ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-deviceid
     */
    readonly deviceId?: string;
    /**
     * Setting overrides for the application manifest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-manifestoverridespayload
     */
    readonly manifestOverridesPayload?: CfnApplicationInstance.ManifestOverridesPayloadProperty | cdk.IResolvable;
    /**
     * A name for the application instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-name
     */
    readonly name?: string;
    /**
     * The ARN of a runtime role for the application instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-runtimerolearn
     */
    readonly runtimeRoleArn?: string;
    /**
     * Only include instances with a specific status.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-statusfilter
     */
    readonly statusFilter?: string;
    /**
     * Tags for the application instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::Panorama::ApplicationInstance`
 *
 * Creates an application instance and deploys it to a device.
 *
 * @cloudformationResource AWS::Panorama::ApplicationInstance
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html
 */
export declare class CfnApplicationInstance extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Panorama::ApplicationInstance";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplicationInstance;
    /**
     * The application instance's ID.
     * @cloudformationAttribute ApplicationInstanceId
     */
    readonly attrApplicationInstanceId: string;
    /**
     * The application instance's ARN.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The application instance's created time.
     * @cloudformationAttribute CreatedTime
     */
    readonly attrCreatedTime: number;
    /**
     * The application instance's default runtime context device name.
     * @cloudformationAttribute DefaultRuntimeContextDeviceName
     */
    readonly attrDefaultRuntimeContextDeviceName: string;
    /**
     * The application instance's health status.
     * @cloudformationAttribute HealthStatus
     */
    readonly attrHealthStatus: string;
    /**
     * The application instance's last updated time.
     * @cloudformationAttribute LastUpdatedTime
     */
    readonly attrLastUpdatedTime: number;
    /**
     * The application instance's status.
     * @cloudformationAttribute Status
     */
    readonly attrStatus: string;
    /**
     * The application instance's status description.
     * @cloudformationAttribute StatusDescription
     */
    readonly attrStatusDescription: string;
    /**
     * The device's ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-defaultruntimecontextdevice
     */
    defaultRuntimeContextDevice: string;
    /**
     * The application's manifest document.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-manifestpayload
     */
    manifestPayload: CfnApplicationInstance.ManifestPayloadProperty | cdk.IResolvable;
    /**
     * The ID of an application instance to replace with the new instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-applicationinstanceidtoreplace
     */
    applicationInstanceIdToReplace: string | undefined;
    /**
     * A description for the application instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-description
     */
    description: string | undefined;
    /**
     * A device's ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-deviceid
     */
    deviceId: string | undefined;
    /**
     * Setting overrides for the application manifest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-manifestoverridespayload
     */
    manifestOverridesPayload: CfnApplicationInstance.ManifestOverridesPayloadProperty | cdk.IResolvable | undefined;
    /**
     * A name for the application instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-name
     */
    name: string | undefined;
    /**
     * The ARN of a runtime role for the application instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-runtimerolearn
     */
    runtimeRoleArn: string | undefined;
    /**
     * Only include instances with a specific status.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-statusfilter
     */
    statusFilter: string | undefined;
    /**
     * Tags for the application instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-applicationinstance.html#cfn-panorama-applicationinstance-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::Panorama::ApplicationInstance`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApplicationInstanceProps);
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
export declare namespace CfnApplicationInstance {
    /**
     * Parameter overrides for an application instance. This is a JSON document that has a single key ( `PayloadData` ) where the value is an escaped string representation of the overrides document.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-panorama-applicationinstance-manifestoverridespayload.html
     */
    interface ManifestOverridesPayloadProperty {
        /**
         * The overrides document.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-panorama-applicationinstance-manifestoverridespayload.html#cfn-panorama-applicationinstance-manifestoverridespayload-payloaddata
         */
        readonly payloadData?: string;
    }
}
export declare namespace CfnApplicationInstance {
    /**
     * A application verion's manifest file. This is a JSON document that has a single key ( `PayloadData` ) where the value is an escaped string representation of the application manifest ( `graph.json` ). This file is located in the `graphs` folder in your application source.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-panorama-applicationinstance-manifestpayload.html
     */
    interface ManifestPayloadProperty {
        /**
         * The application manifest.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-panorama-applicationinstance-manifestpayload.html#cfn-panorama-applicationinstance-manifestpayload-payloaddata
         */
        readonly payloadData?: string;
    }
}
/**
 * Properties for defining a `CfnPackage`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-package.html
 */
export interface CfnPackageProps {
    /**
     * A name for the package.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-package.html#cfn-panorama-package-packagename
     */
    readonly packageName: string;
    /**
     * `AWS::Panorama::Package.StorageLocation`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-package.html#cfn-panorama-package-storagelocation
     */
    readonly storageLocation?: CfnPackage.StorageLocationProperty | cdk.IResolvable;
    /**
     * Tags for the package.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-package.html#cfn-panorama-package-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::Panorama::Package`
 *
 * Creates a package and storage location in an Amazon S3 access point.
 *
 * @cloudformationResource AWS::Panorama::Package
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-package.html
 */
export declare class CfnPackage extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Panorama::Package";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPackage;
    /**
     * The package's ARN.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The item's created time.
     * @cloudformationAttribute CreatedTime
     */
    readonly attrCreatedTime: number;
    /**
     * The package's ID.
     * @cloudformationAttribute PackageId
     */
    readonly attrPackageId: string;
    /**
     *
     * @cloudformationAttribute StorageLocation.BinaryPrefixLocation
     */
    readonly attrStorageLocationBinaryPrefixLocation: string;
    /**
     *
     * @cloudformationAttribute StorageLocation.Bucket
     */
    readonly attrStorageLocationBucket: string;
    /**
     *
     * @cloudformationAttribute StorageLocation.GeneratedPrefixLocation
     */
    readonly attrStorageLocationGeneratedPrefixLocation: string;
    /**
     *
     * @cloudformationAttribute StorageLocation.ManifestPrefixLocation
     */
    readonly attrStorageLocationManifestPrefixLocation: string;
    /**
     *
     * @cloudformationAttribute StorageLocation.RepoPrefixLocation
     */
    readonly attrStorageLocationRepoPrefixLocation: string;
    /**
     * A name for the package.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-package.html#cfn-panorama-package-packagename
     */
    packageName: string;
    /**
     * `AWS::Panorama::Package.StorageLocation`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-package.html#cfn-panorama-package-storagelocation
     */
    storageLocation: CfnPackage.StorageLocationProperty | cdk.IResolvable | undefined;
    /**
     * Tags for the package.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-package.html#cfn-panorama-package-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::Panorama::Package`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPackageProps);
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
export declare namespace CfnPackage {
    /**
     * A storage location.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-panorama-package-storagelocation.html
     */
    interface StorageLocationProperty {
        /**
         * The location's binary prefix.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-panorama-package-storagelocation.html#cfn-panorama-package-storagelocation-binaryprefixlocation
         */
        readonly binaryPrefixLocation?: string;
        /**
         * The location's bucket.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-panorama-package-storagelocation.html#cfn-panorama-package-storagelocation-bucket
         */
        readonly bucket?: string;
        /**
         * The location's generated prefix.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-panorama-package-storagelocation.html#cfn-panorama-package-storagelocation-generatedprefixlocation
         */
        readonly generatedPrefixLocation?: string;
        /**
         * The location's manifest prefix.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-panorama-package-storagelocation.html#cfn-panorama-package-storagelocation-manifestprefixlocation
         */
        readonly manifestPrefixLocation?: string;
        /**
         * The location's repo prefix.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-panorama-package-storagelocation.html#cfn-panorama-package-storagelocation-repoprefixlocation
         */
        readonly repoPrefixLocation?: string;
    }
}
/**
 * Properties for defining a `CfnPackageVersion`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-packageversion.html
 */
export interface CfnPackageVersionProps {
    /**
     * A package ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-packageversion.html#cfn-panorama-packageversion-packageid
     */
    readonly packageId: string;
    /**
     * A package version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-packageversion.html#cfn-panorama-packageversion-packageversion
     */
    readonly packageVersion: string;
    /**
     * A patch version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-packageversion.html#cfn-panorama-packageversion-patchversion
     */
    readonly patchVersion: string;
    /**
     * Whether to mark the new version as the latest version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-packageversion.html#cfn-panorama-packageversion-marklatest
     */
    readonly markLatest?: boolean | cdk.IResolvable;
    /**
     * An owner account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-packageversion.html#cfn-panorama-packageversion-owneraccount
     */
    readonly ownerAccount?: string;
    /**
     * If the version was marked latest, the new version to maker as latest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-packageversion.html#cfn-panorama-packageversion-updatedlatestpatchversion
     */
    readonly updatedLatestPatchVersion?: string;
}
/**
 * A CloudFormation `AWS::Panorama::PackageVersion`
 *
 * Registers a package version.
 *
 * @cloudformationResource AWS::Panorama::PackageVersion
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-packageversion.html
 */
export declare class CfnPackageVersion extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Panorama::PackageVersion";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPackageVersion;
    /**
     * Whether the package version is the latest version.
     * @cloudformationAttribute IsLatestPatch
     */
    readonly attrIsLatestPatch: cdk.IResolvable;
    /**
     * The package version's ARN.
     * @cloudformationAttribute PackageArn
     */
    readonly attrPackageArn: string;
    /**
     * The package version's name.
     * @cloudformationAttribute PackageName
     */
    readonly attrPackageName: string;
    /**
     * The package version's registered time.
     * @cloudformationAttribute RegisteredTime
     */
    readonly attrRegisteredTime: number;
    /**
     * The package version's status.
     * @cloudformationAttribute Status
     */
    readonly attrStatus: string;
    /**
     * The package version's status description.
     * @cloudformationAttribute StatusDescription
     */
    readonly attrStatusDescription: string;
    /**
     * A package ID.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-packageversion.html#cfn-panorama-packageversion-packageid
     */
    packageId: string;
    /**
     * A package version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-packageversion.html#cfn-panorama-packageversion-packageversion
     */
    packageVersion: string;
    /**
     * A patch version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-packageversion.html#cfn-panorama-packageversion-patchversion
     */
    patchVersion: string;
    /**
     * Whether to mark the new version as the latest version.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-packageversion.html#cfn-panorama-packageversion-marklatest
     */
    markLatest: boolean | cdk.IResolvable | undefined;
    /**
     * An owner account.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-packageversion.html#cfn-panorama-packageversion-owneraccount
     */
    ownerAccount: string | undefined;
    /**
     * If the version was marked latest, the new version to maker as latest.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-panorama-packageversion.html#cfn-panorama-packageversion-updatedlatestpatchversion
     */
    updatedLatestPatchVersion: string | undefined;
    /**
     * Create a new `AWS::Panorama::PackageVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPackageVersionProps);
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
