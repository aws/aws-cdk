import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnLaunchProfile`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html
 */
export interface CfnLaunchProfileProps {
    /**
     * Unique identifiers for a collection of EC2 subnets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-ec2subnetids
     */
    readonly ec2SubnetIds: string[];
    /**
     * The version number of the protocol that is used by the launch profile. The only valid version is "2021-03-31".
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-launchprofileprotocolversions
     */
    readonly launchProfileProtocolVersions: string[];
    /**
     * A friendly name for the launch profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-name
     */
    readonly name: string;
    /**
     * A configuration for a streaming session.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-streamconfiguration
     */
    readonly streamConfiguration: CfnLaunchProfile.StreamConfigurationProperty | cdk.IResolvable;
    /**
     * Unique identifiers for a collection of studio components that can be used with this launch profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-studiocomponentids
     */
    readonly studioComponentIds: string[];
    /**
     * The unique identifier for a studio resource. In Nimble Studio , all other resources are contained in a studio resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-studioid
     */
    readonly studioId: string;
    /**
     * A human-readable description of the launch profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-description
     */
    readonly description?: string;
    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
}
/**
 * A CloudFormation `AWS::NimbleStudio::LaunchProfile`
 *
 * The `AWS::NimbleStudio::LaunchProfile` resource represents access permissions for a set of studio components, including types of workstations, render farms, and shared file systems. Launch profiles are shared with studio users to give them access to the set of studio components.
 *
 * @cloudformationResource AWS::NimbleStudio::LaunchProfile
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html
 */
export declare class CfnLaunchProfile extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NimbleStudio::LaunchProfile";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLaunchProfile;
    /**
     * The unique identifier for the launch profile resource.
     * @cloudformationAttribute LaunchProfileId
     */
    readonly attrLaunchProfileId: string;
    /**
     * Unique identifiers for a collection of EC2 subnets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-ec2subnetids
     */
    ec2SubnetIds: string[];
    /**
     * The version number of the protocol that is used by the launch profile. The only valid version is "2021-03-31".
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-launchprofileprotocolversions
     */
    launchProfileProtocolVersions: string[];
    /**
     * A friendly name for the launch profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-name
     */
    name: string;
    /**
     * A configuration for a streaming session.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-streamconfiguration
     */
    streamConfiguration: CfnLaunchProfile.StreamConfigurationProperty | cdk.IResolvable;
    /**
     * Unique identifiers for a collection of studio components that can be used with this launch profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-studiocomponentids
     */
    studioComponentIds: string[];
    /**
     * The unique identifier for a studio resource. In Nimble Studio , all other resources are contained in a studio resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-studioid
     */
    studioId: string;
    /**
     * A human-readable description of the launch profile.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-description
     */
    description: string | undefined;
    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::NimbleStudio::LaunchProfile`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLaunchProfileProps);
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
export declare namespace CfnLaunchProfile {
    /**
     * A configuration for a streaming session.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html
     */
    interface StreamConfigurationProperty {
        /**
         * Indicates if a streaming session created from this launch profile should be terminated automatically or retained without termination after being in a `STOPPED` state.
         *
         * - When `ACTIVATED` , the streaming session is scheduled for termination after being in the `STOPPED` state for the time specified in `maxStoppedSessionLengthInMinutes` .
         * - When `DEACTIVATED` , the streaming session can remain in the `STOPPED` state indefinitely.
         *
         * This parameter is only allowed when `sessionPersistenceMode` is `ACTIVATED` . When allowed, the default value for this parameter is `DEACTIVATED` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-automaticterminationmode
         */
        readonly automaticTerminationMode?: string;
        /**
         * Allows or deactivates the use of the system clipboard to copy and paste between the streaming session and streaming client.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-clipboardmode
         */
        readonly clipboardMode: string;
        /**
         * The EC2 instance types that users can select from when launching a streaming session with this launch profile.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-ec2instancetypes
         */
        readonly ec2InstanceTypes: string[];
        /**
         * The length of time, in minutes, that a streaming session can be active before it is stopped or terminated. After this point, Nimble Studio automatically terminates or stops the session. The default length of time is 690 minutes, and the maximum length of time is 30 days.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-maxsessionlengthinminutes
         */
        readonly maxSessionLengthInMinutes?: number;
        /**
         * Integer that determines if you can start and stop your sessions and how long a session can stay in the `STOPPED` state. The default value is 0. The maximum value is 5760.
         *
         * This field is allowed only when `sessionPersistenceMode` is `ACTIVATED` and `automaticTerminationMode` is `ACTIVATED` .
         *
         * If the value is set to 0, your sessions can’t be `STOPPED` . If you then call `StopStreamingSession` , the session fails. If the time that a session stays in the `READY` state exceeds the `maxSessionLengthInMinutes` value, the session will automatically be terminated (instead of `STOPPED` ).
         *
         * If the value is set to a positive number, the session can be stopped. You can call `StopStreamingSession` to stop sessions in the `READY` state. If the time that a session stays in the `READY` state exceeds the `maxSessionLengthInMinutes` value, the session will automatically be stopped (instead of terminated).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-maxstoppedsessionlengthinminutes
         */
        readonly maxStoppedSessionLengthInMinutes?: number;
        /**
         * Determine if a streaming session created from this launch profile can configure persistent storage. This means that `volumeConfiguration` and `automaticTerminationMode` are configured.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-sessionpersistencemode
         */
        readonly sessionPersistenceMode?: string;
        /**
         * The upload storage for a streaming session.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-sessionstorage
         */
        readonly sessionStorage?: CfnLaunchProfile.StreamConfigurationSessionStorageProperty | cdk.IResolvable;
        /**
         * The streaming images that users can select from when launching a streaming session with this launch profile.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-streamingimageids
         */
        readonly streamingImageIds: string[];
        /**
         * Custom volume configuration for the root volumes that are attached to streaming sessions.
         *
         * This parameter is only allowed when `sessionPersistenceMode` is `ACTIVATED` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-volumeconfiguration
         */
        readonly volumeConfiguration?: CfnLaunchProfile.VolumeConfigurationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnLaunchProfile {
    /**
     * The configuration for a streaming session’s upload storage.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfigurationsessionstorage.html
     */
    interface StreamConfigurationSessionStorageProperty {
        /**
         * Allows artists to upload files to their workstations. The only valid option is `UPLOAD` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfigurationsessionstorage.html#cfn-nimblestudio-launchprofile-streamconfigurationsessionstorage-mode
         */
        readonly mode: string[];
        /**
         * The configuration for the upload storage root of the streaming session.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfigurationsessionstorage.html#cfn-nimblestudio-launchprofile-streamconfigurationsessionstorage-root
         */
        readonly root?: CfnLaunchProfile.StreamingSessionStorageRootProperty | cdk.IResolvable;
    }
}
export declare namespace CfnLaunchProfile {
    /**
     * The upload storage root location (folder) on streaming workstations where files are uploaded.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamingsessionstorageroot.html
     */
    interface StreamingSessionStorageRootProperty {
        /**
         * The folder path in Linux workstations where files are uploaded.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamingsessionstorageroot.html#cfn-nimblestudio-launchprofile-streamingsessionstorageroot-linux
         */
        readonly linux?: string;
        /**
         * The folder path in Windows workstations where files are uploaded.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamingsessionstorageroot.html#cfn-nimblestudio-launchprofile-streamingsessionstorageroot-windows
         */
        readonly windows?: string;
    }
}
export declare namespace CfnLaunchProfile {
    /**
     * Custom volume configuration for the root volumes that are attached to streaming sessions.
     *
     * This parameter is only allowed when `sessionPersistenceMode` is `ACTIVATED` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-volumeconfiguration.html
     */
    interface VolumeConfigurationProperty {
        /**
         * The number of I/O operations per second for the root volume that is attached to streaming session.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-volumeconfiguration.html#cfn-nimblestudio-launchprofile-volumeconfiguration-iops
         */
        readonly iops?: number;
        /**
         * The size of the root volume that is attached to the streaming session. The root volume size is measured in GiBs.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-volumeconfiguration.html#cfn-nimblestudio-launchprofile-volumeconfiguration-size
         */
        readonly size?: number;
        /**
         * The throughput to provision for the root volume that is attached to the streaming session. The throughput is measured in MiB/s.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-volumeconfiguration.html#cfn-nimblestudio-launchprofile-volumeconfiguration-throughput
         */
        readonly throughput?: number;
    }
}
/**
 * Properties for defining a `CfnStreamingImage`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html
 */
export interface CfnStreamingImageProps {
    /**
     * The ID of an EC2 machine image with which to create the streaming image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-ec2imageid
     */
    readonly ec2ImageId: string;
    /**
     * A friendly name for a streaming image resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-name
     */
    readonly name: string;
    /**
     * The unique identifier for a studio resource. In Nimble Studio , all other resources are contained in a studio resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-studioid
     */
    readonly studioId: string;
    /**
     * A human-readable description of the streaming image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-description
     */
    readonly description?: string;
    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
}
/**
 * A CloudFormation `AWS::NimbleStudio::StreamingImage`
 *
 * The `AWS::NimbleStudio::StreamingImage` resource creates a streaming image in a studio. A streaming image defines the operating system and software to be used in an  streaming session.
 *
 * @cloudformationResource AWS::NimbleStudio::StreamingImage
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html
 */
export declare class CfnStreamingImage extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NimbleStudio::StreamingImage";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStreamingImage;
    /**
     *
     * @cloudformationAttribute EncryptionConfiguration.KeyArn
     */
    readonly attrEncryptionConfigurationKeyArn: string;
    /**
     *
     * @cloudformationAttribute EncryptionConfiguration.KeyType
     */
    readonly attrEncryptionConfigurationKeyType: string;
    /**
     * The list of IDs of EULAs that must be accepted before a streaming session can be started using this streaming image.
     * @cloudformationAttribute EulaIds
     */
    readonly attrEulaIds: string[];
    /**
     * The owner of the streaming image, either the studioId that contains the streaming image or 'amazon' for images that are provided by  .
     * @cloudformationAttribute Owner
     */
    readonly attrOwner: string;
    /**
     * The platform of the streaming image, either WINDOWS or LINUX.
     * @cloudformationAttribute Platform
     */
    readonly attrPlatform: string;
    /**
     * The unique identifier for the streaming image resource.
     * @cloudformationAttribute StreamingImageId
     */
    readonly attrStreamingImageId: string;
    /**
     * The ID of an EC2 machine image with which to create the streaming image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-ec2imageid
     */
    ec2ImageId: string;
    /**
     * A friendly name for a streaming image resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-name
     */
    name: string;
    /**
     * The unique identifier for a studio resource. In Nimble Studio , all other resources are contained in a studio resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-studioid
     */
    studioId: string;
    /**
     * A human-readable description of the streaming image.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-description
     */
    description: string | undefined;
    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::NimbleStudio::StreamingImage`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStreamingImageProps);
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
export declare namespace CfnStreamingImage {
    /**
     * Specifies how a streaming image is encrypted.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-streamingimage-streamingimageencryptionconfiguration.html
     */
    interface StreamingImageEncryptionConfigurationProperty {
        /**
         * The ARN for a KMS key that is used to encrypt studio data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-streamingimage-streamingimageencryptionconfiguration.html#cfn-nimblestudio-streamingimage-streamingimageencryptionconfiguration-keyarn
         */
        readonly keyArn?: string;
        /**
         * The type of KMS key that is used to encrypt studio data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-streamingimage-streamingimageencryptionconfiguration.html#cfn-nimblestudio-streamingimage-streamingimageencryptionconfiguration-keytype
         */
        readonly keyType: string;
    }
}
/**
 * Properties for defining a `CfnStudio`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html
 */
export interface CfnStudioProps {
    /**
     * The IAM role that studio admins assume when logging in to the Nimble Studio portal.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-adminrolearn
     */
    readonly adminRoleArn: string;
    /**
     * A friendly name for the studio.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-displayname
     */
    readonly displayName: string;
    /**
     * The name of the studio, as included in the URL when accessing it in the Nimble Studio portal.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-studioname
     */
    readonly studioName: string;
    /**
     * The IAM role that studio users assume when logging in to the Nimble Studio portal.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-userrolearn
     */
    readonly userRoleArn: string;
    /**
     * Configuration of the encryption method that is used for the studio.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-studioencryptionconfiguration
     */
    readonly studioEncryptionConfiguration?: CfnStudio.StudioEncryptionConfigurationProperty | cdk.IResolvable;
    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
}
/**
 * A CloudFormation `AWS::NimbleStudio::Studio`
 *
 * The `AWS::NimbleStudio::Studio` resource creates a new studio resource. In  , all other resources are contained in a studio.
 *
 * When creating a studio, two IAM roles must be provided: the admin role and the user role. These roles are assumed by your users when they log in to the  portal. The user role must have the AmazonNimbleStudio-StudioUser managed policy attached for the portal to function properly. The Admin Role must have the AmazonNimbleStudio-StudioAdmin managed policy attached for the portal to function properly.
 *
 * You can optionally specify an AWS Key Management Service key in the StudioEncryptionConfiguration. In Nimble Studio, resource names, descriptions, initialization scripts, and other data you provide are always encrypted at rest using an AWS Key Management Service key. By default, this key is owned by AWS and managed on your behalf. You may provide your own AWS Key Management Service key when calling CreateStudio to encrypt this data using a key that you own and manage. When providing an AWS Key Management Service key during studio creation,  creates AWS Key Management Service grants in your account to provide your studio user and admin roles access to these AWS Key Management Service keys. If you delete this grant, the studio will no longer be accessible to your portal users. If you delete the studio AWS Key Management Service key, your studio will no longer be accessible.
 *
 * @cloudformationResource AWS::NimbleStudio::Studio
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html
 */
export declare class CfnStudio extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NimbleStudio::Studio";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStudio;
    /**
     * The AWS Region where the studio resource is located. For example, `us-west-2` .
     * @cloudformationAttribute HomeRegion
     */
    readonly attrHomeRegion: string;
    /**
     * The IAM Identity Center application client ID that is used to integrate with IAM Identity Center , which enables IAM Identity Center users to log into the  portal.
     * @cloudformationAttribute SsoClientId
     */
    readonly attrSsoClientId: string;
    /**
     * The unique identifier for the studio resource.
     * @cloudformationAttribute StudioId
     */
    readonly attrStudioId: string;
    /**
     * The unique identifier for the studio resource.
     * @cloudformationAttribute StudioUrl
     */
    readonly attrStudioUrl: string;
    /**
     * The IAM role that studio admins assume when logging in to the Nimble Studio portal.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-adminrolearn
     */
    adminRoleArn: string;
    /**
     * A friendly name for the studio.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-displayname
     */
    displayName: string;
    /**
     * The name of the studio, as included in the URL when accessing it in the Nimble Studio portal.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-studioname
     */
    studioName: string;
    /**
     * The IAM role that studio users assume when logging in to the Nimble Studio portal.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-userrolearn
     */
    userRoleArn: string;
    /**
     * Configuration of the encryption method that is used for the studio.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-studioencryptionconfiguration
     */
    studioEncryptionConfiguration: CfnStudio.StudioEncryptionConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::NimbleStudio::Studio`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStudioProps);
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
export declare namespace CfnStudio {
    /**
     * Configuration of the encryption method that is used for the studio.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studio-studioencryptionconfiguration.html
     */
    interface StudioEncryptionConfigurationProperty {
        /**
         * The ARN for a KMS key that is used to encrypt studio data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studio-studioencryptionconfiguration.html#cfn-nimblestudio-studio-studioencryptionconfiguration-keyarn
         */
        readonly keyArn?: string;
        /**
         * The type of KMS key that is used to encrypt studio data.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studio-studioencryptionconfiguration.html#cfn-nimblestudio-studio-studioencryptionconfiguration-keytype
         */
        readonly keyType: string;
    }
}
/**
 * Properties for defining a `CfnStudioComponent`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html
 */
export interface CfnStudioComponentProps {
    /**
     * A friendly name for the studio component resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-name
     */
    readonly name: string;
    /**
     * The unique identifier for a studio resource. In Nimble Studio , all other resources are contained in a studio resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-studioid
     */
    readonly studioId: string;
    /**
     * The type of the studio component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-type
     */
    readonly type: string;
    /**
     * The configuration of the studio component, based on component type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-configuration
     */
    readonly configuration?: CfnStudioComponent.StudioComponentConfigurationProperty | cdk.IResolvable;
    /**
     * A human-readable description for the studio component resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-description
     */
    readonly description?: string;
    /**
     * The EC2 security groups that control access to the studio component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-ec2securitygroupids
     */
    readonly ec2SecurityGroupIds?: string[];
    /**
     * Initialization scripts for studio components.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-initializationscripts
     */
    readonly initializationScripts?: Array<CfnStudioComponent.StudioComponentInitializationScriptProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * Parameters for the studio component scripts.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-scriptparameters
     */
    readonly scriptParameters?: Array<CfnStudioComponent.ScriptParameterKeyValueProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The specific subtype of a studio component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-subtype
     */
    readonly subtype?: string;
    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
}
/**
 * A CloudFormation `AWS::NimbleStudio::StudioComponent`
 *
 * The `AWS::NimbleStudio::StudioComponent` resource represents a network resource that is used by a studio's users and workflows. A typical studio contains studio components for the following: a render farm, an Active Directory, a licensing service, and a shared file system.
 *
 * Access to a studio component is managed by specifying security groups for the resource, as well as its endpoint.
 *
 * A studio component also has a set of initialization scripts, which are returned by `GetLaunchProfileInitialization` . These initialization scripts run on streaming sessions when they start. They provide users with flexibility in controlling how studio resources are configured on a streaming session.
 *
 * @cloudformationResource AWS::NimbleStudio::StudioComponent
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html
 */
export declare class CfnStudioComponent extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::NimbleStudio::StudioComponent";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStudioComponent;
    /**
     * The unique identifier for the studio component resource.
     * @cloudformationAttribute StudioComponentId
     */
    readonly attrStudioComponentId: string;
    /**
     * A friendly name for the studio component resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-name
     */
    name: string;
    /**
     * The unique identifier for a studio resource. In Nimble Studio , all other resources are contained in a studio resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-studioid
     */
    studioId: string;
    /**
     * The type of the studio component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-type
     */
    type: string;
    /**
     * The configuration of the studio component, based on component type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-configuration
     */
    configuration: CfnStudioComponent.StudioComponentConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * A human-readable description for the studio component resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-description
     */
    description: string | undefined;
    /**
     * The EC2 security groups that control access to the studio component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-ec2securitygroupids
     */
    ec2SecurityGroupIds: string[] | undefined;
    /**
     * Initialization scripts for studio components.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-initializationscripts
     */
    initializationScripts: Array<CfnStudioComponent.StudioComponentInitializationScriptProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * Parameters for the studio component scripts.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-scriptparameters
     */
    scriptParameters: Array<CfnStudioComponent.ScriptParameterKeyValueProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The specific subtype of a studio component.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-subtype
     */
    subtype: string | undefined;
    /**
     * An array of key-value pairs to apply to this resource.
     *
     * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::NimbleStudio::StudioComponent`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnStudioComponentProps);
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
export declare namespace CfnStudioComponent {
    /**
     * An LDAP attribute of an Active Directory computer account, in the form of a name:value pair.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-activedirectorycomputerattribute.html
     */
    interface ActiveDirectoryComputerAttributeProperty {
        /**
         * The name for the LDAP attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-activedirectorycomputerattribute.html#cfn-nimblestudio-studiocomponent-activedirectorycomputerattribute-name
         */
        readonly name?: string;
        /**
         * The value for the LDAP attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-activedirectorycomputerattribute.html#cfn-nimblestudio-studiocomponent-activedirectorycomputerattribute-value
         */
        readonly value?: string;
    }
}
export declare namespace CfnStudioComponent {
    /**
     * The configuration for a AWS Directory Service for Microsoft Active Directory studio resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-activedirectoryconfiguration.html
     */
    interface ActiveDirectoryConfigurationProperty {
        /**
         * A collection of custom attributes for an Active Directory computer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-activedirectoryconfiguration.html#cfn-nimblestudio-studiocomponent-activedirectoryconfiguration-computerattributes
         */
        readonly computerAttributes?: Array<CfnStudioComponent.ActiveDirectoryComputerAttributeProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The directory ID of the AWS Directory Service for Microsoft Active Directory to access using this studio component.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-activedirectoryconfiguration.html#cfn-nimblestudio-studiocomponent-activedirectoryconfiguration-directoryid
         */
        readonly directoryId?: string;
        /**
         * The distinguished name (DN) and organizational unit (OU) of an Active Directory computer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-activedirectoryconfiguration.html#cfn-nimblestudio-studiocomponent-activedirectoryconfiguration-organizationalunitdistinguishedname
         */
        readonly organizationalUnitDistinguishedName?: string;
    }
}
export declare namespace CfnStudioComponent {
    /**
     * The configuration for a render farm that is associated with a studio resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-computefarmconfiguration.html
     */
    interface ComputeFarmConfigurationProperty {
        /**
         * The name of an Active Directory user that is used on ComputeFarm worker instances.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-computefarmconfiguration.html#cfn-nimblestudio-studiocomponent-computefarmconfiguration-activedirectoryuser
         */
        readonly activeDirectoryUser?: string;
        /**
         * The endpoint of the ComputeFarm that is accessed by the studio component resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-computefarmconfiguration.html#cfn-nimblestudio-studiocomponent-computefarmconfiguration-endpoint
         */
        readonly endpoint?: string;
    }
}
export declare namespace CfnStudioComponent {
    /**
     * The configuration for a license service that is associated with a studio resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-licenseserviceconfiguration.html
     */
    interface LicenseServiceConfigurationProperty {
        /**
         * The endpoint of the license service that is accessed by the studio component resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-licenseserviceconfiguration.html#cfn-nimblestudio-studiocomponent-licenseserviceconfiguration-endpoint
         */
        readonly endpoint?: string;
    }
}
export declare namespace CfnStudioComponent {
    /**
     * A parameter for a studio component script, in the form of a key-value pair.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-scriptparameterkeyvalue.html
     */
    interface ScriptParameterKeyValueProperty {
        /**
         * A script parameter key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-scriptparameterkeyvalue.html#cfn-nimblestudio-studiocomponent-scriptparameterkeyvalue-key
         */
        readonly key?: string;
        /**
         * A script parameter value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-scriptparameterkeyvalue.html#cfn-nimblestudio-studiocomponent-scriptparameterkeyvalue-value
         */
        readonly value?: string;
    }
}
export declare namespace CfnStudioComponent {
    /**
     * The configuration for a shared file storage system that is associated with a studio resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-sharedfilesystemconfiguration.html
     */
    interface SharedFileSystemConfigurationProperty {
        /**
         * The endpoint of the shared file system that is accessed by the studio component resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-sharedfilesystemconfiguration.html#cfn-nimblestudio-studiocomponent-sharedfilesystemconfiguration-endpoint
         */
        readonly endpoint?: string;
        /**
         * The unique identifier for a file system.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-sharedfilesystemconfiguration.html#cfn-nimblestudio-studiocomponent-sharedfilesystemconfiguration-filesystemid
         */
        readonly fileSystemId?: string;
        /**
         * The mount location for a shared file system on a Linux virtual workstation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-sharedfilesystemconfiguration.html#cfn-nimblestudio-studiocomponent-sharedfilesystemconfiguration-linuxmountpoint
         */
        readonly linuxMountPoint?: string;
        /**
         * The name of the file share.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-sharedfilesystemconfiguration.html#cfn-nimblestudio-studiocomponent-sharedfilesystemconfiguration-sharename
         */
        readonly shareName?: string;
        /**
         * The mount location for a shared file system on a Windows virtual workstation.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-sharedfilesystemconfiguration.html#cfn-nimblestudio-studiocomponent-sharedfilesystemconfiguration-windowsmountdrive
         */
        readonly windowsMountDrive?: string;
    }
}
export declare namespace CfnStudioComponent {
    /**
     * The configuration of the studio component, based on component type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentconfiguration.html
     */
    interface StudioComponentConfigurationProperty {
        /**
         * The configuration for a AWS Directory Service for Microsoft Active Directory studio resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentconfiguration.html#cfn-nimblestudio-studiocomponent-studiocomponentconfiguration-activedirectoryconfiguration
         */
        readonly activeDirectoryConfiguration?: CfnStudioComponent.ActiveDirectoryConfigurationProperty | cdk.IResolvable;
        /**
         * The configuration for a render farm that is associated with a studio resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentconfiguration.html#cfn-nimblestudio-studiocomponent-studiocomponentconfiguration-computefarmconfiguration
         */
        readonly computeFarmConfiguration?: CfnStudioComponent.ComputeFarmConfigurationProperty | cdk.IResolvable;
        /**
         * The configuration for a license service that is associated with a studio resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentconfiguration.html#cfn-nimblestudio-studiocomponent-studiocomponentconfiguration-licenseserviceconfiguration
         */
        readonly licenseServiceConfiguration?: CfnStudioComponent.LicenseServiceConfigurationProperty | cdk.IResolvable;
        /**
         * The configuration for a shared file storage system that is associated with a studio resource.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentconfiguration.html#cfn-nimblestudio-studiocomponent-studiocomponentconfiguration-sharedfilesystemconfiguration
         */
        readonly sharedFileSystemConfiguration?: CfnStudioComponent.SharedFileSystemConfigurationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnStudioComponent {
    /**
     * Initialization scripts for studio components.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentinitializationscript.html
     */
    interface StudioComponentInitializationScriptProperty {
        /**
         * The version number of the protocol that is used by the launch profile. The only valid version is "2021-03-31".
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentinitializationscript.html#cfn-nimblestudio-studiocomponent-studiocomponentinitializationscript-launchprofileprotocolversion
         */
        readonly launchProfileProtocolVersion?: string;
        /**
         * The platform of the initialization script, either Windows or Linux.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentinitializationscript.html#cfn-nimblestudio-studiocomponent-studiocomponentinitializationscript-platform
         */
        readonly platform?: string;
        /**
         * The method to use when running the initialization script.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentinitializationscript.html#cfn-nimblestudio-studiocomponent-studiocomponentinitializationscript-runcontext
         */
        readonly runContext?: string;
        /**
         * The initialization script.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentinitializationscript.html#cfn-nimblestudio-studiocomponent-studiocomponentinitializationscript-script
         */
        readonly script?: string;
    }
}
