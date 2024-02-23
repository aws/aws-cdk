/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::NimbleStudio::LaunchProfile` resource represents access permissions for a set of studio components, including types of workstations, render farms, and shared file systems.
 *
 * Launch profiles are shared with studio users to give them access to the set of studio components.
 *
 * @cloudformationResource AWS::NimbleStudio::LaunchProfile
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html
 */
export class CfnLaunchProfile extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NimbleStudio::LaunchProfile";

  /**
   * Build a CfnLaunchProfile from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLaunchProfile {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLaunchProfilePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLaunchProfile(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique identifier for the launch profile resource.
   *
   * @cloudformationAttribute LaunchProfileId
   */
  public readonly attrLaunchProfileId: string;

  /**
   * A human-readable description of the launch profile.
   */
  public description?: string;

  /**
   * Unique identifiers for a collection of EC2 subnets.
   */
  public ec2SubnetIds: Array<string>;

  /**
   * The version number of the protocol that is used by the launch profile.
   */
  public launchProfileProtocolVersions: Array<string>;

  /**
   * A friendly name for the launch profile.
   */
  public name: string;

  /**
   * A configuration for a streaming session.
   */
  public streamConfiguration: cdk.IResolvable | CfnLaunchProfile.StreamConfigurationProperty;

  /**
   * Unique identifiers for a collection of studio components that can be used with this launch profile.
   */
  public studioComponentIds: Array<string>;

  /**
   * The unique identifier for a studio resource.
   */
  public studioId: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLaunchProfileProps) {
    super(scope, id, {
      "type": CfnLaunchProfile.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "ec2SubnetIds", this);
    cdk.requireProperty(props, "launchProfileProtocolVersions", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "streamConfiguration", this);
    cdk.requireProperty(props, "studioComponentIds", this);
    cdk.requireProperty(props, "studioId", this);

    this.attrLaunchProfileId = cdk.Token.asString(this.getAtt("LaunchProfileId", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.ec2SubnetIds = props.ec2SubnetIds;
    this.launchProfileProtocolVersions = props.launchProfileProtocolVersions;
    this.name = props.name;
    this.streamConfiguration = props.streamConfiguration;
    this.studioComponentIds = props.studioComponentIds;
    this.studioId = props.studioId;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::NimbleStudio::LaunchProfile", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "ec2SubnetIds": this.ec2SubnetIds,
      "launchProfileProtocolVersions": this.launchProfileProtocolVersions,
      "name": this.name,
      "streamConfiguration": this.streamConfiguration,
      "studioComponentIds": this.studioComponentIds,
      "studioId": this.studioId,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLaunchProfile.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLaunchProfilePropsToCloudFormation(props);
  }
}

export namespace CfnLaunchProfile {
  /**
   * A configuration for a streaming session.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html
   */
  export interface StreamConfigurationProperty {
    /**
     * Indicates if a streaming session created from this launch profile should be terminated automatically or retained without termination after being in a `STOPPED` state.
     *
     * - When `ACTIVATED` , the streaming session is scheduled for termination after being in the `STOPPED` state for the time specified in `maxStoppedSessionLengthInMinutes` .
     * - When `DEACTIVATED` , the streaming session can remain in the `STOPPED` state indefinitely.
     *
     * This parameter is only allowed when `sessionPersistenceMode` is `ACTIVATED` . When allowed, the default value for this parameter is `DEACTIVATED` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-automaticterminationmode
     */
    readonly automaticTerminationMode?: string;

    /**
     * Allows or deactivates the use of the system clipboard to copy and paste between the streaming session and streaming client.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-clipboardmode
     */
    readonly clipboardMode: string;

    /**
     * The EC2 instance types that users can select from when launching a streaming session with this launch profile.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-ec2instancetypes
     */
    readonly ec2InstanceTypes: Array<string>;

    /**
     * The length of time, in minutes, that a streaming session can be active before it is stopped or terminated.
     *
     * After this point, Nimble Studio automatically terminates or stops the session. The default length of time is 690 minutes, and the maximum length of time is 30 days.
     *
     * @default - 690
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-maxsessionlengthinminutes
     */
    readonly maxSessionLengthInMinutes?: number;

    /**
     * Integer that determines if you can start and stop your sessions and how long a session can stay in the `STOPPED` state.
     *
     * The default value is 0. The maximum value is 5760.
     *
     * This field is allowed only when `sessionPersistenceMode` is `ACTIVATED` and `automaticTerminationMode` is `ACTIVATED` .
     *
     * If the value is set to 0, your sessions can’t be `STOPPED` . If you then call `StopStreamingSession` , the session fails. If the time that a session stays in the `READY` state exceeds the `maxSessionLengthInMinutes` value, the session will automatically be terminated (instead of `STOPPED` ).
     *
     * If the value is set to a positive number, the session can be stopped. You can call `StopStreamingSession` to stop sessions in the `READY` state. If the time that a session stays in the `READY` state exceeds the `maxSessionLengthInMinutes` value, the session will automatically be stopped (instead of terminated).
     *
     * @default - 0
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-maxstoppedsessionlengthinminutes
     */
    readonly maxStoppedSessionLengthInMinutes?: number;

    /**
     * Information about the streaming session backup.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-sessionbackup
     */
    readonly sessionBackup?: cdk.IResolvable | CfnLaunchProfile.StreamConfigurationSessionBackupProperty;

    /**
     * Determine if a streaming session created from this launch profile can configure persistent storage.
     *
     * This means that `volumeConfiguration` and `automaticTerminationMode` are configured.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-sessionpersistencemode
     */
    readonly sessionPersistenceMode?: string;

    /**
     * The upload storage for a streaming session.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-sessionstorage
     */
    readonly sessionStorage?: cdk.IResolvable | CfnLaunchProfile.StreamConfigurationSessionStorageProperty;

    /**
     * The streaming images that users can select from when launching a streaming session with this launch profile.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-streamingimageids
     */
    readonly streamingImageIds: Array<string>;

    /**
     * Custom volume configuration for the root volumes that are attached to streaming sessions.
     *
     * This parameter is only allowed when `sessionPersistenceMode` is `ACTIVATED` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfiguration.html#cfn-nimblestudio-launchprofile-streamconfiguration-volumeconfiguration
     */
    readonly volumeConfiguration?: cdk.IResolvable | CfnLaunchProfile.VolumeConfigurationProperty;
  }

  /**
   * Configures how streaming sessions are backed up when launched from this launch profile.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfigurationsessionbackup.html
   */
  export interface StreamConfigurationSessionBackupProperty {
    /**
     * The maximum number of backups that each streaming session created from this launch profile can have.
     *
     * @default - 0
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfigurationsessionbackup.html#cfn-nimblestudio-launchprofile-streamconfigurationsessionbackup-maxbackupstoretain
     */
    readonly maxBackupsToRetain?: number;

    /**
     * Specifies how artists sessions are backed up.
     *
     * Configures backups for streaming sessions launched with this launch profile. The default value is `DEACTIVATED` , which means that backups are deactivated. To allow backups, set this value to `AUTOMATIC` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfigurationsessionbackup.html#cfn-nimblestudio-launchprofile-streamconfigurationsessionbackup-mode
     */
    readonly mode?: string;
  }

  /**
   * The configuration for a streaming session’s upload storage.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfigurationsessionstorage.html
   */
  export interface StreamConfigurationSessionStorageProperty {
    /**
     * Allows artists to upload files to their workstations.
     *
     * The only valid option is `UPLOAD` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfigurationsessionstorage.html#cfn-nimblestudio-launchprofile-streamconfigurationsessionstorage-mode
     */
    readonly mode: Array<string>;

    /**
     * The configuration for the upload storage root of the streaming session.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamconfigurationsessionstorage.html#cfn-nimblestudio-launchprofile-streamconfigurationsessionstorage-root
     */
    readonly root?: cdk.IResolvable | CfnLaunchProfile.StreamingSessionStorageRootProperty;
  }

  /**
   * The upload storage root location (folder) on streaming workstations where files are uploaded.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamingsessionstorageroot.html
   */
  export interface StreamingSessionStorageRootProperty {
    /**
     * The folder path in Linux workstations where files are uploaded.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamingsessionstorageroot.html#cfn-nimblestudio-launchprofile-streamingsessionstorageroot-linux
     */
    readonly linux?: string;

    /**
     * The folder path in Windows workstations where files are uploaded.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-streamingsessionstorageroot.html#cfn-nimblestudio-launchprofile-streamingsessionstorageroot-windows
     */
    readonly windows?: string;
  }

  /**
   * Custom volume configuration for the root volumes that are attached to streaming sessions.
   *
   * This parameter is only allowed when `sessionPersistenceMode` is `ACTIVATED` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-volumeconfiguration.html
   */
  export interface VolumeConfigurationProperty {
    /**
     * The number of I/O operations per second for the root volume that is attached to streaming session.
     *
     * @default - 3000
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-volumeconfiguration.html#cfn-nimblestudio-launchprofile-volumeconfiguration-iops
     */
    readonly iops?: number;

    /**
     * The size of the root volume that is attached to the streaming session.
     *
     * The root volume size is measured in GiBs.
     *
     * @default - 500
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-volumeconfiguration.html#cfn-nimblestudio-launchprofile-volumeconfiguration-size
     */
    readonly size?: number;

    /**
     * The throughput to provision for the root volume that is attached to the streaming session.
     *
     * The throughput is measured in MiB/s.
     *
     * @default - 125
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-launchprofile-volumeconfiguration.html#cfn-nimblestudio-launchprofile-volumeconfiguration-throughput
     */
    readonly throughput?: number;
  }
}

/**
 * Properties for defining a `CfnLaunchProfile`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html
 */
export interface CfnLaunchProfileProps {
  /**
   * A human-readable description of the launch profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-description
   */
  readonly description?: string;

  /**
   * Unique identifiers for a collection of EC2 subnets.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-ec2subnetids
   */
  readonly ec2SubnetIds: Array<string>;

  /**
   * The version number of the protocol that is used by the launch profile.
   *
   * The only valid version is "2021-03-31".
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-launchprofileprotocolversions
   */
  readonly launchProfileProtocolVersions: Array<string>;

  /**
   * A friendly name for the launch profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-name
   */
  readonly name: string;

  /**
   * A configuration for a streaming session.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-streamconfiguration
   */
  readonly streamConfiguration: cdk.IResolvable | CfnLaunchProfile.StreamConfigurationProperty;

  /**
   * Unique identifiers for a collection of studio components that can be used with this launch profile.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-studiocomponentids
   */
  readonly studioComponentIds: Array<string>;

  /**
   * The unique identifier for a studio resource.
   *
   * In Nimble Studio , all other resources are contained in a studio resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-studioid
   */
  readonly studioId: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-launchprofile.html#cfn-nimblestudio-launchprofile-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `StreamConfigurationSessionBackupProperty`
 *
 * @param properties - the TypeScript properties of a `StreamConfigurationSessionBackupProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLaunchProfileStreamConfigurationSessionBackupPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxBackupsToRetain", cdk.validateNumber)(properties.maxBackupsToRetain));
  errors.collect(cdk.propertyValidator("mode", cdk.validateString)(properties.mode));
  return errors.wrap("supplied properties not correct for \"StreamConfigurationSessionBackupProperty\"");
}

// @ts-ignore TS6133
function convertCfnLaunchProfileStreamConfigurationSessionBackupPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLaunchProfileStreamConfigurationSessionBackupPropertyValidator(properties).assertSuccess();
  return {
    "MaxBackupsToRetain": cdk.numberToCloudFormation(properties.maxBackupsToRetain),
    "Mode": cdk.stringToCloudFormation(properties.mode)
  };
}

// @ts-ignore TS6133
function CfnLaunchProfileStreamConfigurationSessionBackupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLaunchProfile.StreamConfigurationSessionBackupProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunchProfile.StreamConfigurationSessionBackupProperty>();
  ret.addPropertyResult("maxBackupsToRetain", "MaxBackupsToRetain", (properties.MaxBackupsToRetain != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxBackupsToRetain) : undefined));
  ret.addPropertyResult("mode", "Mode", (properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StreamingSessionStorageRootProperty`
 *
 * @param properties - the TypeScript properties of a `StreamingSessionStorageRootProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLaunchProfileStreamingSessionStorageRootPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("linux", cdk.validateString)(properties.linux));
  errors.collect(cdk.propertyValidator("windows", cdk.validateString)(properties.windows));
  return errors.wrap("supplied properties not correct for \"StreamingSessionStorageRootProperty\"");
}

// @ts-ignore TS6133
function convertCfnLaunchProfileStreamingSessionStorageRootPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLaunchProfileStreamingSessionStorageRootPropertyValidator(properties).assertSuccess();
  return {
    "Linux": cdk.stringToCloudFormation(properties.linux),
    "Windows": cdk.stringToCloudFormation(properties.windows)
  };
}

// @ts-ignore TS6133
function CfnLaunchProfileStreamingSessionStorageRootPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLaunchProfile.StreamingSessionStorageRootProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunchProfile.StreamingSessionStorageRootProperty>();
  ret.addPropertyResult("linux", "Linux", (properties.Linux != null ? cfn_parse.FromCloudFormation.getString(properties.Linux) : undefined));
  ret.addPropertyResult("windows", "Windows", (properties.Windows != null ? cfn_parse.FromCloudFormation.getString(properties.Windows) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StreamConfigurationSessionStorageProperty`
 *
 * @param properties - the TypeScript properties of a `StreamConfigurationSessionStorageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLaunchProfileStreamConfigurationSessionStoragePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("mode", cdk.requiredValidator)(properties.mode));
  errors.collect(cdk.propertyValidator("mode", cdk.listValidator(cdk.validateString))(properties.mode));
  errors.collect(cdk.propertyValidator("root", CfnLaunchProfileStreamingSessionStorageRootPropertyValidator)(properties.root));
  return errors.wrap("supplied properties not correct for \"StreamConfigurationSessionStorageProperty\"");
}

// @ts-ignore TS6133
function convertCfnLaunchProfileStreamConfigurationSessionStoragePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLaunchProfileStreamConfigurationSessionStoragePropertyValidator(properties).assertSuccess();
  return {
    "Mode": cdk.listMapper(cdk.stringToCloudFormation)(properties.mode),
    "Root": convertCfnLaunchProfileStreamingSessionStorageRootPropertyToCloudFormation(properties.root)
  };
}

// @ts-ignore TS6133
function CfnLaunchProfileStreamConfigurationSessionStoragePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLaunchProfile.StreamConfigurationSessionStorageProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunchProfile.StreamConfigurationSessionStorageProperty>();
  ret.addPropertyResult("mode", "Mode", (properties.Mode != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Mode) : undefined));
  ret.addPropertyResult("root", "Root", (properties.Root != null ? CfnLaunchProfileStreamingSessionStorageRootPropertyFromCloudFormation(properties.Root) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VolumeConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `VolumeConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLaunchProfileVolumeConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("iops", cdk.validateNumber)(properties.iops));
  errors.collect(cdk.propertyValidator("size", cdk.validateNumber)(properties.size));
  errors.collect(cdk.propertyValidator("throughput", cdk.validateNumber)(properties.throughput));
  return errors.wrap("supplied properties not correct for \"VolumeConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnLaunchProfileVolumeConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLaunchProfileVolumeConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Iops": cdk.numberToCloudFormation(properties.iops),
    "Size": cdk.numberToCloudFormation(properties.size),
    "Throughput": cdk.numberToCloudFormation(properties.throughput)
  };
}

// @ts-ignore TS6133
function CfnLaunchProfileVolumeConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLaunchProfile.VolumeConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunchProfile.VolumeConfigurationProperty>();
  ret.addPropertyResult("iops", "Iops", (properties.Iops != null ? cfn_parse.FromCloudFormation.getNumber(properties.Iops) : undefined));
  ret.addPropertyResult("size", "Size", (properties.Size != null ? cfn_parse.FromCloudFormation.getNumber(properties.Size) : undefined));
  ret.addPropertyResult("throughput", "Throughput", (properties.Throughput != null ? cfn_parse.FromCloudFormation.getNumber(properties.Throughput) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StreamConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `StreamConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLaunchProfileStreamConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("automaticTerminationMode", cdk.validateString)(properties.automaticTerminationMode));
  errors.collect(cdk.propertyValidator("clipboardMode", cdk.requiredValidator)(properties.clipboardMode));
  errors.collect(cdk.propertyValidator("clipboardMode", cdk.validateString)(properties.clipboardMode));
  errors.collect(cdk.propertyValidator("ec2InstanceTypes", cdk.requiredValidator)(properties.ec2InstanceTypes));
  errors.collect(cdk.propertyValidator("ec2InstanceTypes", cdk.listValidator(cdk.validateString))(properties.ec2InstanceTypes));
  errors.collect(cdk.propertyValidator("maxSessionLengthInMinutes", cdk.validateNumber)(properties.maxSessionLengthInMinutes));
  errors.collect(cdk.propertyValidator("maxStoppedSessionLengthInMinutes", cdk.validateNumber)(properties.maxStoppedSessionLengthInMinutes));
  errors.collect(cdk.propertyValidator("sessionBackup", CfnLaunchProfileStreamConfigurationSessionBackupPropertyValidator)(properties.sessionBackup));
  errors.collect(cdk.propertyValidator("sessionPersistenceMode", cdk.validateString)(properties.sessionPersistenceMode));
  errors.collect(cdk.propertyValidator("sessionStorage", CfnLaunchProfileStreamConfigurationSessionStoragePropertyValidator)(properties.sessionStorage));
  errors.collect(cdk.propertyValidator("streamingImageIds", cdk.requiredValidator)(properties.streamingImageIds));
  errors.collect(cdk.propertyValidator("streamingImageIds", cdk.listValidator(cdk.validateString))(properties.streamingImageIds));
  errors.collect(cdk.propertyValidator("volumeConfiguration", CfnLaunchProfileVolumeConfigurationPropertyValidator)(properties.volumeConfiguration));
  return errors.wrap("supplied properties not correct for \"StreamConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnLaunchProfileStreamConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLaunchProfileStreamConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AutomaticTerminationMode": cdk.stringToCloudFormation(properties.automaticTerminationMode),
    "ClipboardMode": cdk.stringToCloudFormation(properties.clipboardMode),
    "Ec2InstanceTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.ec2InstanceTypes),
    "MaxSessionLengthInMinutes": cdk.numberToCloudFormation(properties.maxSessionLengthInMinutes),
    "MaxStoppedSessionLengthInMinutes": cdk.numberToCloudFormation(properties.maxStoppedSessionLengthInMinutes),
    "SessionBackup": convertCfnLaunchProfileStreamConfigurationSessionBackupPropertyToCloudFormation(properties.sessionBackup),
    "SessionPersistenceMode": cdk.stringToCloudFormation(properties.sessionPersistenceMode),
    "SessionStorage": convertCfnLaunchProfileStreamConfigurationSessionStoragePropertyToCloudFormation(properties.sessionStorage),
    "StreamingImageIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.streamingImageIds),
    "VolumeConfiguration": convertCfnLaunchProfileVolumeConfigurationPropertyToCloudFormation(properties.volumeConfiguration)
  };
}

// @ts-ignore TS6133
function CfnLaunchProfileStreamConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLaunchProfile.StreamConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunchProfile.StreamConfigurationProperty>();
  ret.addPropertyResult("automaticTerminationMode", "AutomaticTerminationMode", (properties.AutomaticTerminationMode != null ? cfn_parse.FromCloudFormation.getString(properties.AutomaticTerminationMode) : undefined));
  ret.addPropertyResult("clipboardMode", "ClipboardMode", (properties.ClipboardMode != null ? cfn_parse.FromCloudFormation.getString(properties.ClipboardMode) : undefined));
  ret.addPropertyResult("ec2InstanceTypes", "Ec2InstanceTypes", (properties.Ec2InstanceTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Ec2InstanceTypes) : undefined));
  ret.addPropertyResult("maxSessionLengthInMinutes", "MaxSessionLengthInMinutes", (properties.MaxSessionLengthInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxSessionLengthInMinutes) : undefined));
  ret.addPropertyResult("maxStoppedSessionLengthInMinutes", "MaxStoppedSessionLengthInMinutes", (properties.MaxStoppedSessionLengthInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxStoppedSessionLengthInMinutes) : undefined));
  ret.addPropertyResult("sessionBackup", "SessionBackup", (properties.SessionBackup != null ? CfnLaunchProfileStreamConfigurationSessionBackupPropertyFromCloudFormation(properties.SessionBackup) : undefined));
  ret.addPropertyResult("sessionPersistenceMode", "SessionPersistenceMode", (properties.SessionPersistenceMode != null ? cfn_parse.FromCloudFormation.getString(properties.SessionPersistenceMode) : undefined));
  ret.addPropertyResult("sessionStorage", "SessionStorage", (properties.SessionStorage != null ? CfnLaunchProfileStreamConfigurationSessionStoragePropertyFromCloudFormation(properties.SessionStorage) : undefined));
  ret.addPropertyResult("streamingImageIds", "StreamingImageIds", (properties.StreamingImageIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.StreamingImageIds) : undefined));
  ret.addPropertyResult("volumeConfiguration", "VolumeConfiguration", (properties.VolumeConfiguration != null ? CfnLaunchProfileVolumeConfigurationPropertyFromCloudFormation(properties.VolumeConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLaunchProfileProps`
 *
 * @param properties - the TypeScript properties of a `CfnLaunchProfileProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLaunchProfilePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("ec2SubnetIds", cdk.requiredValidator)(properties.ec2SubnetIds));
  errors.collect(cdk.propertyValidator("ec2SubnetIds", cdk.listValidator(cdk.validateString))(properties.ec2SubnetIds));
  errors.collect(cdk.propertyValidator("launchProfileProtocolVersions", cdk.requiredValidator)(properties.launchProfileProtocolVersions));
  errors.collect(cdk.propertyValidator("launchProfileProtocolVersions", cdk.listValidator(cdk.validateString))(properties.launchProfileProtocolVersions));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("streamConfiguration", cdk.requiredValidator)(properties.streamConfiguration));
  errors.collect(cdk.propertyValidator("streamConfiguration", CfnLaunchProfileStreamConfigurationPropertyValidator)(properties.streamConfiguration));
  errors.collect(cdk.propertyValidator("studioComponentIds", cdk.requiredValidator)(properties.studioComponentIds));
  errors.collect(cdk.propertyValidator("studioComponentIds", cdk.listValidator(cdk.validateString))(properties.studioComponentIds));
  errors.collect(cdk.propertyValidator("studioId", cdk.requiredValidator)(properties.studioId));
  errors.collect(cdk.propertyValidator("studioId", cdk.validateString)(properties.studioId));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnLaunchProfileProps\"");
}

// @ts-ignore TS6133
function convertCfnLaunchProfilePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLaunchProfilePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Ec2SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.ec2SubnetIds),
    "LaunchProfileProtocolVersions": cdk.listMapper(cdk.stringToCloudFormation)(properties.launchProfileProtocolVersions),
    "Name": cdk.stringToCloudFormation(properties.name),
    "StreamConfiguration": convertCfnLaunchProfileStreamConfigurationPropertyToCloudFormation(properties.streamConfiguration),
    "StudioComponentIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.studioComponentIds),
    "StudioId": cdk.stringToCloudFormation(properties.studioId),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnLaunchProfilePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLaunchProfileProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLaunchProfileProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("ec2SubnetIds", "Ec2SubnetIds", (properties.Ec2SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Ec2SubnetIds) : undefined));
  ret.addPropertyResult("launchProfileProtocolVersions", "LaunchProfileProtocolVersions", (properties.LaunchProfileProtocolVersions != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.LaunchProfileProtocolVersions) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("streamConfiguration", "StreamConfiguration", (properties.StreamConfiguration != null ? CfnLaunchProfileStreamConfigurationPropertyFromCloudFormation(properties.StreamConfiguration) : undefined));
  ret.addPropertyResult("studioComponentIds", "StudioComponentIds", (properties.StudioComponentIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.StudioComponentIds) : undefined));
  ret.addPropertyResult("studioId", "StudioId", (properties.StudioId != null ? cfn_parse.FromCloudFormation.getString(properties.StudioId) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::NimbleStudio::StreamingImage` resource creates a streaming image in a studio.
 *
 * A streaming image defines the operating system and software to be used in an  streaming session.
 *
 * @cloudformationResource AWS::NimbleStudio::StreamingImage
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html
 */
export class CfnStreamingImage extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NimbleStudio::StreamingImage";

  /**
   * Build a CfnStreamingImage from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStreamingImage {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStreamingImagePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStreamingImage(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The encryption configuration.
   *
   * @cloudformationAttribute EncryptionConfiguration
   */
  public readonly attrEncryptionConfiguration: cdk.IResolvable;

  /**
   * @cloudformationAttribute EncryptionConfiguration.KeyArn
   */
  public readonly attrEncryptionConfigurationKeyArn: string;

  /**
   * @cloudformationAttribute EncryptionConfiguration.KeyType
   */
  public readonly attrEncryptionConfigurationKeyType: string;

  /**
   * The list of IDs of EULAs that must be accepted before a streaming session can be started using this streaming image.
   *
   * @cloudformationAttribute EulaIds
   */
  public readonly attrEulaIds: Array<string>;

  /**
   * The owner of the streaming image, either the studioId that contains the streaming image or 'amazon' for images that are provided by  .
   *
   * @cloudformationAttribute Owner
   */
  public readonly attrOwner: string;

  /**
   * The platform of the streaming image, either WINDOWS or LINUX.
   *
   * @cloudformationAttribute Platform
   */
  public readonly attrPlatform: string;

  /**
   * The unique identifier for the streaming image resource.
   *
   * @cloudformationAttribute StreamingImageId
   */
  public readonly attrStreamingImageId: string;

  /**
   * A human-readable description of the streaming image.
   */
  public description?: string;

  /**
   * The ID of an EC2 machine image with which to create the streaming image.
   */
  public ec2ImageId: string;

  /**
   * A friendly name for a streaming image resource.
   */
  public name: string;

  /**
   * The unique identifier for a studio resource.
   */
  public studioId: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStreamingImageProps) {
    super(scope, id, {
      "type": CfnStreamingImage.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "ec2ImageId", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "studioId", this);

    this.attrEncryptionConfiguration = this.getAtt("EncryptionConfiguration");
    this.attrEncryptionConfigurationKeyArn = cdk.Token.asString(this.getAtt("EncryptionConfiguration.KeyArn", cdk.ResolutionTypeHint.STRING));
    this.attrEncryptionConfigurationKeyType = cdk.Token.asString(this.getAtt("EncryptionConfiguration.KeyType", cdk.ResolutionTypeHint.STRING));
    this.attrEulaIds = cdk.Token.asList(this.getAtt("EulaIds", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrOwner = cdk.Token.asString(this.getAtt("Owner", cdk.ResolutionTypeHint.STRING));
    this.attrPlatform = cdk.Token.asString(this.getAtt("Platform", cdk.ResolutionTypeHint.STRING));
    this.attrStreamingImageId = cdk.Token.asString(this.getAtt("StreamingImageId", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.ec2ImageId = props.ec2ImageId;
    this.name = props.name;
    this.studioId = props.studioId;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::NimbleStudio::StreamingImage", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "ec2ImageId": this.ec2ImageId,
      "name": this.name,
      "studioId": this.studioId,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStreamingImage.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStreamingImagePropsToCloudFormation(props);
  }
}

export namespace CfnStreamingImage {
  /**
   * Specifies how a streaming image is encrypted.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-streamingimage-streamingimageencryptionconfiguration.html
   */
  export interface StreamingImageEncryptionConfigurationProperty {
    /**
     * The ARN for a KMS key that is used to encrypt studio data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-streamingimage-streamingimageencryptionconfiguration.html#cfn-nimblestudio-streamingimage-streamingimageencryptionconfiguration-keyarn
     */
    readonly keyArn?: string;

    /**
     * The type of KMS key that is used to encrypt studio data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-streamingimage-streamingimageencryptionconfiguration.html#cfn-nimblestudio-streamingimage-streamingimageencryptionconfiguration-keytype
     */
    readonly keyType: string;
  }
}

/**
 * Properties for defining a `CfnStreamingImage`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html
 */
export interface CfnStreamingImageProps {
  /**
   * A human-readable description of the streaming image.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-description
   */
  readonly description?: string;

  /**
   * The ID of an EC2 machine image with which to create the streaming image.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-ec2imageid
   */
  readonly ec2ImageId: string;

  /**
   * A friendly name for a streaming image resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-name
   */
  readonly name: string;

  /**
   * The unique identifier for a studio resource.
   *
   * In Nimble Studio , all other resources are contained in a studio resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-studioid
   */
  readonly studioId: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-streamingimage.html#cfn-nimblestudio-streamingimage-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `StreamingImageEncryptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `StreamingImageEncryptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStreamingImageStreamingImageEncryptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("keyArn", cdk.validateString)(properties.keyArn));
  errors.collect(cdk.propertyValidator("keyType", cdk.requiredValidator)(properties.keyType));
  errors.collect(cdk.propertyValidator("keyType", cdk.validateString)(properties.keyType));
  return errors.wrap("supplied properties not correct for \"StreamingImageEncryptionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnStreamingImageStreamingImageEncryptionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStreamingImageStreamingImageEncryptionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "KeyArn": cdk.stringToCloudFormation(properties.keyArn),
    "KeyType": cdk.stringToCloudFormation(properties.keyType)
  };
}

// @ts-ignore TS6133
function CfnStreamingImageStreamingImageEncryptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStreamingImage.StreamingImageEncryptionConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamingImage.StreamingImageEncryptionConfigurationProperty>();
  ret.addPropertyResult("keyArn", "KeyArn", (properties.KeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KeyArn) : undefined));
  ret.addPropertyResult("keyType", "KeyType", (properties.KeyType != null ? cfn_parse.FromCloudFormation.getString(properties.KeyType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnStreamingImageProps`
 *
 * @param properties - the TypeScript properties of a `CfnStreamingImageProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStreamingImagePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("ec2ImageId", cdk.requiredValidator)(properties.ec2ImageId));
  errors.collect(cdk.propertyValidator("ec2ImageId", cdk.validateString)(properties.ec2ImageId));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("studioId", cdk.requiredValidator)(properties.studioId));
  errors.collect(cdk.propertyValidator("studioId", cdk.validateString)(properties.studioId));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnStreamingImageProps\"");
}

// @ts-ignore TS6133
function convertCfnStreamingImagePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStreamingImagePropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Ec2ImageId": cdk.stringToCloudFormation(properties.ec2ImageId),
    "Name": cdk.stringToCloudFormation(properties.name),
    "StudioId": cdk.stringToCloudFormation(properties.studioId),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnStreamingImagePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamingImageProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamingImageProps>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("ec2ImageId", "Ec2ImageId", (properties.Ec2ImageId != null ? cfn_parse.FromCloudFormation.getString(properties.Ec2ImageId) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("studioId", "StudioId", (properties.StudioId != null ? cfn_parse.FromCloudFormation.getString(properties.StudioId) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::NimbleStudio::Studio` resource creates a new studio resource. In  , all other resources are contained in a studio.
 *
 * When creating a studio, two IAM roles must be provided: the admin role and the user role. These roles are assumed by your users when they log in to the  portal. The user role must have the AmazonNimbleStudio-StudioUser managed policy attached for the portal to function properly. The Admin Role must have the AmazonNimbleStudio-StudioAdmin managed policy attached for the portal to function properly.
 *
 * You can optionally specify an AWS Key Management Service key in the StudioEncryptionConfiguration. In Nimble Studio, resource names, descriptions, initialization scripts, and other data you provide are always encrypted at rest using an AWS Key Management Service key. By default, this key is owned by AWS and managed on your behalf. You may provide your own AWS Key Management Service key when calling CreateStudio to encrypt this data using a key that you own and manage. When providing an AWS Key Management Service key during studio creation,  creates AWS Key Management Service grants in your account to provide your studio user and admin roles access to these AWS Key Management Service keys. If you delete this grant, the studio will no longer be accessible to your portal users. If you delete the studio AWS Key Management Service key, your studio will no longer be accessible.
 *
 * @cloudformationResource AWS::NimbleStudio::Studio
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html
 */
export class CfnStudio extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NimbleStudio::Studio";

  /**
   * Build a CfnStudio from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStudio {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStudioPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStudio(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The AWS Region where the studio resource is located. For example, `us-west-2` .
   *
   * @cloudformationAttribute HomeRegion
   */
  public readonly attrHomeRegion: string;

  /**
   * The IAM Identity Center application client ID that is used to integrate with IAM Identity Center , which enables IAM Identity Center users to log into the  portal.
   *
   * @cloudformationAttribute SsoClientId
   */
  public readonly attrSsoClientId: string;

  /**
   * The unique identifier for the studio resource.
   *
   * @cloudformationAttribute StudioId
   */
  public readonly attrStudioId: string;

  /**
   * The unique identifier for the studio resource.
   *
   * @cloudformationAttribute StudioUrl
   */
  public readonly attrStudioUrl: string;

  /**
   * The IAM role that studio admins assume when logging in to the Nimble Studio portal.
   */
  public adminRoleArn: string;

  /**
   * A friendly name for the studio.
   */
  public displayName: string;

  /**
   * Configuration of the encryption method that is used for the studio.
   */
  public studioEncryptionConfiguration?: cdk.IResolvable | CfnStudio.StudioEncryptionConfigurationProperty;

  /**
   * The name of the studio, as included in the URL when accessing it in the Nimble Studio portal.
   */
  public studioName: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * The IAM role that studio users assume when logging in to the Nimble Studio portal.
   */
  public userRoleArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStudioProps) {
    super(scope, id, {
      "type": CfnStudio.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "adminRoleArn", this);
    cdk.requireProperty(props, "displayName", this);
    cdk.requireProperty(props, "studioName", this);
    cdk.requireProperty(props, "userRoleArn", this);

    this.attrHomeRegion = cdk.Token.asString(this.getAtt("HomeRegion", cdk.ResolutionTypeHint.STRING));
    this.attrSsoClientId = cdk.Token.asString(this.getAtt("SsoClientId", cdk.ResolutionTypeHint.STRING));
    this.attrStudioId = cdk.Token.asString(this.getAtt("StudioId", cdk.ResolutionTypeHint.STRING));
    this.attrStudioUrl = cdk.Token.asString(this.getAtt("StudioUrl", cdk.ResolutionTypeHint.STRING));
    this.adminRoleArn = props.adminRoleArn;
    this.displayName = props.displayName;
    this.studioEncryptionConfiguration = props.studioEncryptionConfiguration;
    this.studioName = props.studioName;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::NimbleStudio::Studio", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.userRoleArn = props.userRoleArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "adminRoleArn": this.adminRoleArn,
      "displayName": this.displayName,
      "studioEncryptionConfiguration": this.studioEncryptionConfiguration,
      "studioName": this.studioName,
      "tags": this.tags.renderTags(),
      "userRoleArn": this.userRoleArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStudio.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStudioPropsToCloudFormation(props);
  }
}

export namespace CfnStudio {
  /**
   * Configuration of the encryption method that is used for the studio.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studio-studioencryptionconfiguration.html
   */
  export interface StudioEncryptionConfigurationProperty {
    /**
     * The ARN for a KMS key that is used to encrypt studio data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studio-studioencryptionconfiguration.html#cfn-nimblestudio-studio-studioencryptionconfiguration-keyarn
     */
    readonly keyArn?: string;

    /**
     * The type of KMS key that is used to encrypt studio data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studio-studioencryptionconfiguration.html#cfn-nimblestudio-studio-studioencryptionconfiguration-keytype
     */
    readonly keyType: string;
  }
}

/**
 * Properties for defining a `CfnStudio`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html
 */
export interface CfnStudioProps {
  /**
   * The IAM role that studio admins assume when logging in to the Nimble Studio portal.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-adminrolearn
   */
  readonly adminRoleArn: string;

  /**
   * A friendly name for the studio.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-displayname
   */
  readonly displayName: string;

  /**
   * Configuration of the encryption method that is used for the studio.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-studioencryptionconfiguration
   */
  readonly studioEncryptionConfiguration?: cdk.IResolvable | CfnStudio.StudioEncryptionConfigurationProperty;

  /**
   * The name of the studio, as included in the URL when accessing it in the Nimble Studio portal.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-studioname
   */
  readonly studioName: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * The IAM role that studio users assume when logging in to the Nimble Studio portal.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studio.html#cfn-nimblestudio-studio-userrolearn
   */
  readonly userRoleArn: string;
}

/**
 * Determine whether the given properties match those of a `StudioEncryptionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `StudioEncryptionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStudioStudioEncryptionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("keyArn", cdk.validateString)(properties.keyArn));
  errors.collect(cdk.propertyValidator("keyType", cdk.requiredValidator)(properties.keyType));
  errors.collect(cdk.propertyValidator("keyType", cdk.validateString)(properties.keyType));
  return errors.wrap("supplied properties not correct for \"StudioEncryptionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnStudioStudioEncryptionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStudioStudioEncryptionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "KeyArn": cdk.stringToCloudFormation(properties.keyArn),
    "KeyType": cdk.stringToCloudFormation(properties.keyType)
  };
}

// @ts-ignore TS6133
function CfnStudioStudioEncryptionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStudio.StudioEncryptionConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudio.StudioEncryptionConfigurationProperty>();
  ret.addPropertyResult("keyArn", "KeyArn", (properties.KeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KeyArn) : undefined));
  ret.addPropertyResult("keyType", "KeyType", (properties.KeyType != null ? cfn_parse.FromCloudFormation.getString(properties.KeyType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnStudioProps`
 *
 * @param properties - the TypeScript properties of a `CfnStudioProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStudioPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("adminRoleArn", cdk.requiredValidator)(properties.adminRoleArn));
  errors.collect(cdk.propertyValidator("adminRoleArn", cdk.validateString)(properties.adminRoleArn));
  errors.collect(cdk.propertyValidator("displayName", cdk.requiredValidator)(properties.displayName));
  errors.collect(cdk.propertyValidator("displayName", cdk.validateString)(properties.displayName));
  errors.collect(cdk.propertyValidator("studioEncryptionConfiguration", CfnStudioStudioEncryptionConfigurationPropertyValidator)(properties.studioEncryptionConfiguration));
  errors.collect(cdk.propertyValidator("studioName", cdk.requiredValidator)(properties.studioName));
  errors.collect(cdk.propertyValidator("studioName", cdk.validateString)(properties.studioName));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("userRoleArn", cdk.requiredValidator)(properties.userRoleArn));
  errors.collect(cdk.propertyValidator("userRoleArn", cdk.validateString)(properties.userRoleArn));
  return errors.wrap("supplied properties not correct for \"CfnStudioProps\"");
}

// @ts-ignore TS6133
function convertCfnStudioPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStudioPropsValidator(properties).assertSuccess();
  return {
    "AdminRoleArn": cdk.stringToCloudFormation(properties.adminRoleArn),
    "DisplayName": cdk.stringToCloudFormation(properties.displayName),
    "StudioEncryptionConfiguration": convertCfnStudioStudioEncryptionConfigurationPropertyToCloudFormation(properties.studioEncryptionConfiguration),
    "StudioName": cdk.stringToCloudFormation(properties.studioName),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "UserRoleArn": cdk.stringToCloudFormation(properties.userRoleArn)
  };
}

// @ts-ignore TS6133
function CfnStudioPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStudioProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioProps>();
  ret.addPropertyResult("adminRoleArn", "AdminRoleArn", (properties.AdminRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.AdminRoleArn) : undefined));
  ret.addPropertyResult("displayName", "DisplayName", (properties.DisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayName) : undefined));
  ret.addPropertyResult("studioEncryptionConfiguration", "StudioEncryptionConfiguration", (properties.StudioEncryptionConfiguration != null ? CfnStudioStudioEncryptionConfigurationPropertyFromCloudFormation(properties.StudioEncryptionConfiguration) : undefined));
  ret.addPropertyResult("studioName", "StudioName", (properties.StudioName != null ? cfn_parse.FromCloudFormation.getString(properties.StudioName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("userRoleArn", "UserRoleArn", (properties.UserRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.UserRoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::NimbleStudio::StudioComponent` resource represents a network resource that is used by a studio's users and workflows.
 *
 * A typical studio contains studio components for the following: a render farm, an Active Directory, a licensing service, and a shared file system.
 *
 * Access to a studio component is managed by specifying security groups for the resource, as well as its endpoint.
 *
 * A studio component also has a set of initialization scripts, which are returned by `GetLaunchProfileInitialization` . These initialization scripts run on streaming sessions when they start. They provide users with flexibility in controlling how studio resources are configured on a streaming session.
 *
 * @cloudformationResource AWS::NimbleStudio::StudioComponent
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html
 */
export class CfnStudioComponent extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::NimbleStudio::StudioComponent";

  /**
   * Build a CfnStudioComponent from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStudioComponent {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStudioComponentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStudioComponent(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique identifier for the studio component resource.
   *
   * @cloudformationAttribute StudioComponentId
   */
  public readonly attrStudioComponentId: string;

  /**
   * The configuration of the studio component, based on component type.
   */
  public configuration?: cdk.IResolvable | CfnStudioComponent.StudioComponentConfigurationProperty;

  /**
   * A human-readable description for the studio component resource.
   */
  public description?: string;

  /**
   * The EC2 security groups that control access to the studio component.
   */
  public ec2SecurityGroupIds?: Array<string>;

  /**
   * Initialization scripts for studio components.
   */
  public initializationScripts?: Array<cdk.IResolvable | CfnStudioComponent.StudioComponentInitializationScriptProperty> | cdk.IResolvable;

  /**
   * A friendly name for the studio component resource.
   */
  public name: string;

  /**
   * An IAM role attached to a Studio Component that gives the studio component access to AWS resources at anytime while the instance is running.
   */
  public runtimeRoleArn?: string;

  /**
   * Parameters for the studio component scripts.
   */
  public scriptParameters?: Array<cdk.IResolvable | CfnStudioComponent.ScriptParameterKeyValueProperty> | cdk.IResolvable;

  /**
   * An IAM role attached to Studio Component when the system initialization script runs which give the studio component access to AWS resources when the system initialization script runs.
   */
  public secureInitializationRoleArn?: string;

  /**
   * The unique identifier for a studio resource.
   */
  public studioId: string;

  /**
   * The specific subtype of a studio component.
   */
  public subtype?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Record<string, string>;

  /**
   * The type of the studio component.
   */
  public type: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStudioComponentProps) {
    super(scope, id, {
      "type": CfnStudioComponent.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "studioId", this);
    cdk.requireProperty(props, "type", this);

    this.attrStudioComponentId = cdk.Token.asString(this.getAtt("StudioComponentId", cdk.ResolutionTypeHint.STRING));
    this.configuration = props.configuration;
    this.description = props.description;
    this.ec2SecurityGroupIds = props.ec2SecurityGroupIds;
    this.initializationScripts = props.initializationScripts;
    this.name = props.name;
    this.runtimeRoleArn = props.runtimeRoleArn;
    this.scriptParameters = props.scriptParameters;
    this.secureInitializationRoleArn = props.secureInitializationRoleArn;
    this.studioId = props.studioId;
    this.subtype = props.subtype;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::NimbleStudio::StudioComponent", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "configuration": this.configuration,
      "description": this.description,
      "ec2SecurityGroupIds": this.ec2SecurityGroupIds,
      "initializationScripts": this.initializationScripts,
      "name": this.name,
      "runtimeRoleArn": this.runtimeRoleArn,
      "scriptParameters": this.scriptParameters,
      "secureInitializationRoleArn": this.secureInitializationRoleArn,
      "studioId": this.studioId,
      "subtype": this.subtype,
      "tags": this.tags.renderTags(),
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStudioComponent.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStudioComponentPropsToCloudFormation(props);
  }
}

export namespace CfnStudioComponent {
  /**
   * The configuration of the studio component, based on component type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentconfiguration.html
   */
  export interface StudioComponentConfigurationProperty {
    /**
     * The configuration for a AWS Directory Service for Microsoft Active Directory studio resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentconfiguration.html#cfn-nimblestudio-studiocomponent-studiocomponentconfiguration-activedirectoryconfiguration
     */
    readonly activeDirectoryConfiguration?: CfnStudioComponent.ActiveDirectoryConfigurationProperty | cdk.IResolvable;

    /**
     * The configuration for a render farm that is associated with a studio resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentconfiguration.html#cfn-nimblestudio-studiocomponent-studiocomponentconfiguration-computefarmconfiguration
     */
    readonly computeFarmConfiguration?: CfnStudioComponent.ComputeFarmConfigurationProperty | cdk.IResolvable;

    /**
     * The configuration for a license service that is associated with a studio resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentconfiguration.html#cfn-nimblestudio-studiocomponent-studiocomponentconfiguration-licenseserviceconfiguration
     */
    readonly licenseServiceConfiguration?: cdk.IResolvable | CfnStudioComponent.LicenseServiceConfigurationProperty;

    /**
     * The configuration for a shared file storage system that is associated with a studio resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentconfiguration.html#cfn-nimblestudio-studiocomponent-studiocomponentconfiguration-sharedfilesystemconfiguration
     */
    readonly sharedFileSystemConfiguration?: cdk.IResolvable | CfnStudioComponent.SharedFileSystemConfigurationProperty;
  }

  /**
   * The configuration for a license service that is associated with a studio resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-licenseserviceconfiguration.html
   */
  export interface LicenseServiceConfigurationProperty {
    /**
     * The endpoint of the license service that is accessed by the studio component resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-licenseserviceconfiguration.html#cfn-nimblestudio-studiocomponent-licenseserviceconfiguration-endpoint
     */
    readonly endpoint?: string;
  }

  /**
   * The configuration for a render farm that is associated with a studio resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-computefarmconfiguration.html
   */
  export interface ComputeFarmConfigurationProperty {
    /**
     * The name of an Active Directory user that is used on ComputeFarm worker instances.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-computefarmconfiguration.html#cfn-nimblestudio-studiocomponent-computefarmconfiguration-activedirectoryuser
     */
    readonly activeDirectoryUser?: string;

    /**
     * The endpoint of the ComputeFarm that is accessed by the studio component resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-computefarmconfiguration.html#cfn-nimblestudio-studiocomponent-computefarmconfiguration-endpoint
     */
    readonly endpoint?: string;
  }

  /**
   * The configuration for a AWS Directory Service for Microsoft Active Directory studio resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-activedirectoryconfiguration.html
   */
  export interface ActiveDirectoryConfigurationProperty {
    /**
     * A collection of custom attributes for an Active Directory computer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-activedirectoryconfiguration.html#cfn-nimblestudio-studiocomponent-activedirectoryconfiguration-computerattributes
     */
    readonly computerAttributes?: Array<CfnStudioComponent.ActiveDirectoryComputerAttributeProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The directory ID of the AWS Directory Service for Microsoft Active Directory to access using this studio component.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-activedirectoryconfiguration.html#cfn-nimblestudio-studiocomponent-activedirectoryconfiguration-directoryid
     */
    readonly directoryId?: string;

    /**
     * The distinguished name (DN) and organizational unit (OU) of an Active Directory computer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-activedirectoryconfiguration.html#cfn-nimblestudio-studiocomponent-activedirectoryconfiguration-organizationalunitdistinguishedname
     */
    readonly organizationalUnitDistinguishedName?: string;
  }

  /**
   * An LDAP attribute of an Active Directory computer account, in the form of a name:value pair.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-activedirectorycomputerattribute.html
   */
  export interface ActiveDirectoryComputerAttributeProperty {
    /**
     * The name for the LDAP attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-activedirectorycomputerattribute.html#cfn-nimblestudio-studiocomponent-activedirectorycomputerattribute-name
     */
    readonly name?: string;

    /**
     * The value for the LDAP attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-activedirectorycomputerattribute.html#cfn-nimblestudio-studiocomponent-activedirectorycomputerattribute-value
     */
    readonly value?: string;
  }

  /**
   * The configuration for a shared file storage system that is associated with a studio resource.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-sharedfilesystemconfiguration.html
   */
  export interface SharedFileSystemConfigurationProperty {
    /**
     * The endpoint of the shared file system that is accessed by the studio component resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-sharedfilesystemconfiguration.html#cfn-nimblestudio-studiocomponent-sharedfilesystemconfiguration-endpoint
     */
    readonly endpoint?: string;

    /**
     * The unique identifier for a file system.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-sharedfilesystemconfiguration.html#cfn-nimblestudio-studiocomponent-sharedfilesystemconfiguration-filesystemid
     */
    readonly fileSystemId?: string;

    /**
     * The mount location for a shared file system on a Linux virtual workstation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-sharedfilesystemconfiguration.html#cfn-nimblestudio-studiocomponent-sharedfilesystemconfiguration-linuxmountpoint
     */
    readonly linuxMountPoint?: string;

    /**
     * The name of the file share.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-sharedfilesystemconfiguration.html#cfn-nimblestudio-studiocomponent-sharedfilesystemconfiguration-sharename
     */
    readonly shareName?: string;

    /**
     * The mount location for a shared file system on a Windows virtual workstation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-sharedfilesystemconfiguration.html#cfn-nimblestudio-studiocomponent-sharedfilesystemconfiguration-windowsmountdrive
     */
    readonly windowsMountDrive?: string;
  }

  /**
   * Initialization scripts for studio components.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentinitializationscript.html
   */
  export interface StudioComponentInitializationScriptProperty {
    /**
     * The version number of the protocol that is used by the launch profile.
     *
     * The only valid version is "2021-03-31".
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentinitializationscript.html#cfn-nimblestudio-studiocomponent-studiocomponentinitializationscript-launchprofileprotocolversion
     */
    readonly launchProfileProtocolVersion?: string;

    /**
     * The platform of the initialization script, either Windows or Linux.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentinitializationscript.html#cfn-nimblestudio-studiocomponent-studiocomponentinitializationscript-platform
     */
    readonly platform?: string;

    /**
     * The method to use when running the initialization script.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentinitializationscript.html#cfn-nimblestudio-studiocomponent-studiocomponentinitializationscript-runcontext
     */
    readonly runContext?: string;

    /**
     * The initialization script.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-studiocomponentinitializationscript.html#cfn-nimblestudio-studiocomponent-studiocomponentinitializationscript-script
     */
    readonly script?: string;
  }

  /**
   * A parameter for a studio component script, in the form of a key-value pair.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-scriptparameterkeyvalue.html
   */
  export interface ScriptParameterKeyValueProperty {
    /**
     * A script parameter key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-scriptparameterkeyvalue.html#cfn-nimblestudio-studiocomponent-scriptparameterkeyvalue-key
     */
    readonly key?: string;

    /**
     * A script parameter value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-nimblestudio-studiocomponent-scriptparameterkeyvalue.html#cfn-nimblestudio-studiocomponent-scriptparameterkeyvalue-value
     */
    readonly value?: string;
  }
}

/**
 * Properties for defining a `CfnStudioComponent`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html
 */
export interface CfnStudioComponentProps {
  /**
   * The configuration of the studio component, based on component type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-configuration
   */
  readonly configuration?: cdk.IResolvable | CfnStudioComponent.StudioComponentConfigurationProperty;

  /**
   * A human-readable description for the studio component resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-description
   */
  readonly description?: string;

  /**
   * The EC2 security groups that control access to the studio component.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-ec2securitygroupids
   */
  readonly ec2SecurityGroupIds?: Array<string>;

  /**
   * Initialization scripts for studio components.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-initializationscripts
   */
  readonly initializationScripts?: Array<cdk.IResolvable | CfnStudioComponent.StudioComponentInitializationScriptProperty> | cdk.IResolvable;

  /**
   * A friendly name for the studio component resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-name
   */
  readonly name: string;

  /**
   * An IAM role attached to a Studio Component that gives the studio component access to AWS resources at anytime while the instance is running.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-runtimerolearn
   */
  readonly runtimeRoleArn?: string;

  /**
   * Parameters for the studio component scripts.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-scriptparameters
   */
  readonly scriptParameters?: Array<cdk.IResolvable | CfnStudioComponent.ScriptParameterKeyValueProperty> | cdk.IResolvable;

  /**
   * An IAM role attached to Studio Component when the system initialization script runs which give the studio component access to AWS resources when the system initialization script runs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-secureinitializationrolearn
   */
  readonly secureInitializationRoleArn?: string;

  /**
   * The unique identifier for a studio resource.
   *
   * In Nimble Studio , all other resources are contained in a studio resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-studioid
   */
  readonly studioId: string;

  /**
   * The specific subtype of a studio component.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-subtype
   */
  readonly subtype?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * The type of the studio component.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-nimblestudio-studiocomponent.html#cfn-nimblestudio-studiocomponent-type
   */
  readonly type: string;
}

/**
 * Determine whether the given properties match those of a `LicenseServiceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LicenseServiceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStudioComponentLicenseServiceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("endpoint", cdk.validateString)(properties.endpoint));
  return errors.wrap("supplied properties not correct for \"LicenseServiceConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnStudioComponentLicenseServiceConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStudioComponentLicenseServiceConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Endpoint": cdk.stringToCloudFormation(properties.endpoint)
  };
}

// @ts-ignore TS6133
function CfnStudioComponentLicenseServiceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStudioComponent.LicenseServiceConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioComponent.LicenseServiceConfigurationProperty>();
  ret.addPropertyResult("endpoint", "Endpoint", (properties.Endpoint != null ? cfn_parse.FromCloudFormation.getString(properties.Endpoint) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ComputeFarmConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ComputeFarmConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStudioComponentComputeFarmConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("activeDirectoryUser", cdk.validateString)(properties.activeDirectoryUser));
  errors.collect(cdk.propertyValidator("endpoint", cdk.validateString)(properties.endpoint));
  return errors.wrap("supplied properties not correct for \"ComputeFarmConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnStudioComponentComputeFarmConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStudioComponentComputeFarmConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ActiveDirectoryUser": cdk.stringToCloudFormation(properties.activeDirectoryUser),
    "Endpoint": cdk.stringToCloudFormation(properties.endpoint)
  };
}

// @ts-ignore TS6133
function CfnStudioComponentComputeFarmConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStudioComponent.ComputeFarmConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioComponent.ComputeFarmConfigurationProperty>();
  ret.addPropertyResult("activeDirectoryUser", "ActiveDirectoryUser", (properties.ActiveDirectoryUser != null ? cfn_parse.FromCloudFormation.getString(properties.ActiveDirectoryUser) : undefined));
  ret.addPropertyResult("endpoint", "Endpoint", (properties.Endpoint != null ? cfn_parse.FromCloudFormation.getString(properties.Endpoint) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ActiveDirectoryComputerAttributeProperty`
 *
 * @param properties - the TypeScript properties of a `ActiveDirectoryComputerAttributeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStudioComponentActiveDirectoryComputerAttributePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"ActiveDirectoryComputerAttributeProperty\"");
}

// @ts-ignore TS6133
function convertCfnStudioComponentActiveDirectoryComputerAttributePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStudioComponentActiveDirectoryComputerAttributePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnStudioComponentActiveDirectoryComputerAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStudioComponent.ActiveDirectoryComputerAttributeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioComponent.ActiveDirectoryComputerAttributeProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ActiveDirectoryConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ActiveDirectoryConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStudioComponentActiveDirectoryConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("computerAttributes", cdk.listValidator(CfnStudioComponentActiveDirectoryComputerAttributePropertyValidator))(properties.computerAttributes));
  errors.collect(cdk.propertyValidator("directoryId", cdk.validateString)(properties.directoryId));
  errors.collect(cdk.propertyValidator("organizationalUnitDistinguishedName", cdk.validateString)(properties.organizationalUnitDistinguishedName));
  return errors.wrap("supplied properties not correct for \"ActiveDirectoryConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnStudioComponentActiveDirectoryConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStudioComponentActiveDirectoryConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ComputerAttributes": cdk.listMapper(convertCfnStudioComponentActiveDirectoryComputerAttributePropertyToCloudFormation)(properties.computerAttributes),
    "DirectoryId": cdk.stringToCloudFormation(properties.directoryId),
    "OrganizationalUnitDistinguishedName": cdk.stringToCloudFormation(properties.organizationalUnitDistinguishedName)
  };
}

// @ts-ignore TS6133
function CfnStudioComponentActiveDirectoryConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStudioComponent.ActiveDirectoryConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioComponent.ActiveDirectoryConfigurationProperty>();
  ret.addPropertyResult("computerAttributes", "ComputerAttributes", (properties.ComputerAttributes != null ? cfn_parse.FromCloudFormation.getArray(CfnStudioComponentActiveDirectoryComputerAttributePropertyFromCloudFormation)(properties.ComputerAttributes) : undefined));
  ret.addPropertyResult("directoryId", "DirectoryId", (properties.DirectoryId != null ? cfn_parse.FromCloudFormation.getString(properties.DirectoryId) : undefined));
  ret.addPropertyResult("organizationalUnitDistinguishedName", "OrganizationalUnitDistinguishedName", (properties.OrganizationalUnitDistinguishedName != null ? cfn_parse.FromCloudFormation.getString(properties.OrganizationalUnitDistinguishedName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SharedFileSystemConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `SharedFileSystemConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStudioComponentSharedFileSystemConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("endpoint", cdk.validateString)(properties.endpoint));
  errors.collect(cdk.propertyValidator("fileSystemId", cdk.validateString)(properties.fileSystemId));
  errors.collect(cdk.propertyValidator("linuxMountPoint", cdk.validateString)(properties.linuxMountPoint));
  errors.collect(cdk.propertyValidator("shareName", cdk.validateString)(properties.shareName));
  errors.collect(cdk.propertyValidator("windowsMountDrive", cdk.validateString)(properties.windowsMountDrive));
  return errors.wrap("supplied properties not correct for \"SharedFileSystemConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnStudioComponentSharedFileSystemConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStudioComponentSharedFileSystemConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Endpoint": cdk.stringToCloudFormation(properties.endpoint),
    "FileSystemId": cdk.stringToCloudFormation(properties.fileSystemId),
    "LinuxMountPoint": cdk.stringToCloudFormation(properties.linuxMountPoint),
    "ShareName": cdk.stringToCloudFormation(properties.shareName),
    "WindowsMountDrive": cdk.stringToCloudFormation(properties.windowsMountDrive)
  };
}

// @ts-ignore TS6133
function CfnStudioComponentSharedFileSystemConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStudioComponent.SharedFileSystemConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioComponent.SharedFileSystemConfigurationProperty>();
  ret.addPropertyResult("endpoint", "Endpoint", (properties.Endpoint != null ? cfn_parse.FromCloudFormation.getString(properties.Endpoint) : undefined));
  ret.addPropertyResult("fileSystemId", "FileSystemId", (properties.FileSystemId != null ? cfn_parse.FromCloudFormation.getString(properties.FileSystemId) : undefined));
  ret.addPropertyResult("linuxMountPoint", "LinuxMountPoint", (properties.LinuxMountPoint != null ? cfn_parse.FromCloudFormation.getString(properties.LinuxMountPoint) : undefined));
  ret.addPropertyResult("shareName", "ShareName", (properties.ShareName != null ? cfn_parse.FromCloudFormation.getString(properties.ShareName) : undefined));
  ret.addPropertyResult("windowsMountDrive", "WindowsMountDrive", (properties.WindowsMountDrive != null ? cfn_parse.FromCloudFormation.getString(properties.WindowsMountDrive) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StudioComponentConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `StudioComponentConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStudioComponentStudioComponentConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("activeDirectoryConfiguration", CfnStudioComponentActiveDirectoryConfigurationPropertyValidator)(properties.activeDirectoryConfiguration));
  errors.collect(cdk.propertyValidator("computeFarmConfiguration", CfnStudioComponentComputeFarmConfigurationPropertyValidator)(properties.computeFarmConfiguration));
  errors.collect(cdk.propertyValidator("licenseServiceConfiguration", CfnStudioComponentLicenseServiceConfigurationPropertyValidator)(properties.licenseServiceConfiguration));
  errors.collect(cdk.propertyValidator("sharedFileSystemConfiguration", CfnStudioComponentSharedFileSystemConfigurationPropertyValidator)(properties.sharedFileSystemConfiguration));
  return errors.wrap("supplied properties not correct for \"StudioComponentConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnStudioComponentStudioComponentConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStudioComponentStudioComponentConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ActiveDirectoryConfiguration": convertCfnStudioComponentActiveDirectoryConfigurationPropertyToCloudFormation(properties.activeDirectoryConfiguration),
    "ComputeFarmConfiguration": convertCfnStudioComponentComputeFarmConfigurationPropertyToCloudFormation(properties.computeFarmConfiguration),
    "LicenseServiceConfiguration": convertCfnStudioComponentLicenseServiceConfigurationPropertyToCloudFormation(properties.licenseServiceConfiguration),
    "SharedFileSystemConfiguration": convertCfnStudioComponentSharedFileSystemConfigurationPropertyToCloudFormation(properties.sharedFileSystemConfiguration)
  };
}

// @ts-ignore TS6133
function CfnStudioComponentStudioComponentConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStudioComponent.StudioComponentConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioComponent.StudioComponentConfigurationProperty>();
  ret.addPropertyResult("activeDirectoryConfiguration", "ActiveDirectoryConfiguration", (properties.ActiveDirectoryConfiguration != null ? CfnStudioComponentActiveDirectoryConfigurationPropertyFromCloudFormation(properties.ActiveDirectoryConfiguration) : undefined));
  ret.addPropertyResult("computeFarmConfiguration", "ComputeFarmConfiguration", (properties.ComputeFarmConfiguration != null ? CfnStudioComponentComputeFarmConfigurationPropertyFromCloudFormation(properties.ComputeFarmConfiguration) : undefined));
  ret.addPropertyResult("licenseServiceConfiguration", "LicenseServiceConfiguration", (properties.LicenseServiceConfiguration != null ? CfnStudioComponentLicenseServiceConfigurationPropertyFromCloudFormation(properties.LicenseServiceConfiguration) : undefined));
  ret.addPropertyResult("sharedFileSystemConfiguration", "SharedFileSystemConfiguration", (properties.SharedFileSystemConfiguration != null ? CfnStudioComponentSharedFileSystemConfigurationPropertyFromCloudFormation(properties.SharedFileSystemConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StudioComponentInitializationScriptProperty`
 *
 * @param properties - the TypeScript properties of a `StudioComponentInitializationScriptProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStudioComponentStudioComponentInitializationScriptPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("launchProfileProtocolVersion", cdk.validateString)(properties.launchProfileProtocolVersion));
  errors.collect(cdk.propertyValidator("platform", cdk.validateString)(properties.platform));
  errors.collect(cdk.propertyValidator("runContext", cdk.validateString)(properties.runContext));
  errors.collect(cdk.propertyValidator("script", cdk.validateString)(properties.script));
  return errors.wrap("supplied properties not correct for \"StudioComponentInitializationScriptProperty\"");
}

// @ts-ignore TS6133
function convertCfnStudioComponentStudioComponentInitializationScriptPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStudioComponentStudioComponentInitializationScriptPropertyValidator(properties).assertSuccess();
  return {
    "LaunchProfileProtocolVersion": cdk.stringToCloudFormation(properties.launchProfileProtocolVersion),
    "Platform": cdk.stringToCloudFormation(properties.platform),
    "RunContext": cdk.stringToCloudFormation(properties.runContext),
    "Script": cdk.stringToCloudFormation(properties.script)
  };
}

// @ts-ignore TS6133
function CfnStudioComponentStudioComponentInitializationScriptPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStudioComponent.StudioComponentInitializationScriptProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioComponent.StudioComponentInitializationScriptProperty>();
  ret.addPropertyResult("launchProfileProtocolVersion", "LaunchProfileProtocolVersion", (properties.LaunchProfileProtocolVersion != null ? cfn_parse.FromCloudFormation.getString(properties.LaunchProfileProtocolVersion) : undefined));
  ret.addPropertyResult("platform", "Platform", (properties.Platform != null ? cfn_parse.FromCloudFormation.getString(properties.Platform) : undefined));
  ret.addPropertyResult("runContext", "RunContext", (properties.RunContext != null ? cfn_parse.FromCloudFormation.getString(properties.RunContext) : undefined));
  ret.addPropertyResult("script", "Script", (properties.Script != null ? cfn_parse.FromCloudFormation.getString(properties.Script) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScriptParameterKeyValueProperty`
 *
 * @param properties - the TypeScript properties of a `ScriptParameterKeyValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStudioComponentScriptParameterKeyValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"ScriptParameterKeyValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnStudioComponentScriptParameterKeyValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStudioComponentScriptParameterKeyValuePropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnStudioComponentScriptParameterKeyValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStudioComponent.ScriptParameterKeyValueProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioComponent.ScriptParameterKeyValueProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnStudioComponentProps`
 *
 * @param properties - the TypeScript properties of a `CfnStudioComponentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStudioComponentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("configuration", CfnStudioComponentStudioComponentConfigurationPropertyValidator)(properties.configuration));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("ec2SecurityGroupIds", cdk.listValidator(cdk.validateString))(properties.ec2SecurityGroupIds));
  errors.collect(cdk.propertyValidator("initializationScripts", cdk.listValidator(CfnStudioComponentStudioComponentInitializationScriptPropertyValidator))(properties.initializationScripts));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("runtimeRoleArn", cdk.validateString)(properties.runtimeRoleArn));
  errors.collect(cdk.propertyValidator("scriptParameters", cdk.listValidator(CfnStudioComponentScriptParameterKeyValuePropertyValidator))(properties.scriptParameters));
  errors.collect(cdk.propertyValidator("secureInitializationRoleArn", cdk.validateString)(properties.secureInitializationRoleArn));
  errors.collect(cdk.propertyValidator("studioId", cdk.requiredValidator)(properties.studioId));
  errors.collect(cdk.propertyValidator("studioId", cdk.validateString)(properties.studioId));
  errors.collect(cdk.propertyValidator("subtype", cdk.validateString)(properties.subtype));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnStudioComponentProps\"");
}

// @ts-ignore TS6133
function convertCfnStudioComponentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStudioComponentPropsValidator(properties).assertSuccess();
  return {
    "Configuration": convertCfnStudioComponentStudioComponentConfigurationPropertyToCloudFormation(properties.configuration),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Ec2SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.ec2SecurityGroupIds),
    "InitializationScripts": cdk.listMapper(convertCfnStudioComponentStudioComponentInitializationScriptPropertyToCloudFormation)(properties.initializationScripts),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RuntimeRoleArn": cdk.stringToCloudFormation(properties.runtimeRoleArn),
    "ScriptParameters": cdk.listMapper(convertCfnStudioComponentScriptParameterKeyValuePropertyToCloudFormation)(properties.scriptParameters),
    "SecureInitializationRoleArn": cdk.stringToCloudFormation(properties.secureInitializationRoleArn),
    "StudioId": cdk.stringToCloudFormation(properties.studioId),
    "Subtype": cdk.stringToCloudFormation(properties.subtype),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnStudioComponentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStudioComponentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStudioComponentProps>();
  ret.addPropertyResult("configuration", "Configuration", (properties.Configuration != null ? CfnStudioComponentStudioComponentConfigurationPropertyFromCloudFormation(properties.Configuration) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("ec2SecurityGroupIds", "Ec2SecurityGroupIds", (properties.Ec2SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Ec2SecurityGroupIds) : undefined));
  ret.addPropertyResult("initializationScripts", "InitializationScripts", (properties.InitializationScripts != null ? cfn_parse.FromCloudFormation.getArray(CfnStudioComponentStudioComponentInitializationScriptPropertyFromCloudFormation)(properties.InitializationScripts) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("runtimeRoleArn", "RuntimeRoleArn", (properties.RuntimeRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RuntimeRoleArn) : undefined));
  ret.addPropertyResult("scriptParameters", "ScriptParameters", (properties.ScriptParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnStudioComponentScriptParameterKeyValuePropertyFromCloudFormation)(properties.ScriptParameters) : undefined));
  ret.addPropertyResult("secureInitializationRoleArn", "SecureInitializationRoleArn", (properties.SecureInitializationRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecureInitializationRoleArn) : undefined));
  ret.addPropertyResult("studioId", "StudioId", (properties.StudioId != null ? cfn_parse.FromCloudFormation.getString(properties.StudioId) : undefined));
  ret.addPropertyResult("subtype", "Subtype", (properties.Subtype != null ? cfn_parse.FromCloudFormation.getString(properties.Subtype) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}