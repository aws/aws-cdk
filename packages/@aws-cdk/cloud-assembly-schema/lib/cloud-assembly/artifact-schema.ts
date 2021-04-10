
/**
 * Artifact properties for CloudFormation stacks.
 */
export interface AwsCloudFormationStackProperties {
  /**
   * A file relative to the assembly root which contains the CloudFormation template for this stack.
   */
  readonly templateFile: string;

  /**
   * Values for CloudFormation stack parameters that should be passed when the stack is deployed.
   *
   * @default - No parameters
   */
  readonly parameters?: { [id: string]: string };

  /**
   * Values for CloudFormation stack tags that should be passed when the stack is deployed.
   *
   * @default - No tags
   */
  readonly tags?: { [id: string]: string };

  /**
   * The name to use for the CloudFormation stack.
   * @default - name derived from artifact ID
   */
  readonly stackName?: string;

  /**
   * Whether to enable termination protection for this stack.
   *
   * @default false
   */
  readonly terminationProtection?: boolean;

  /**
   * The role that needs to be assumed to deploy the stack
   *
   * @default - No role is assumed (current credentials are used)
   */
  readonly assumeRoleArn?: string;

  /**
   * The role that is passed to CloudFormation to execute the change set
   *
   * @default - No role is passed (currently assumed role/credentials are used)
   */
  readonly cloudFormationExecutionRoleArn?: string;

  /**
   * If the stack template has already been included in the asset manifest, its asset URL
   *
   * @default - Not uploaded yet, upload just before deploying
   */
  readonly stackTemplateAssetObjectUrl?: string;

  /**
   * Version of bootstrap stack required to deploy this stack
   *
   * @default - No bootstrap stack required
   */
  readonly requiresBootstrapStackVersion?: number;

  /**
   * SSM parameter where the bootstrap stack version number can be found
   *
   * Only used if `requiresBootstrapStackVersion` is set.
   *
   * - If this value is not set, the bootstrap stack name must be known at
   *   deployment time so the stack version can be looked up from the stack
   *   outputs.
   * - If this value is set, the bootstrap stack can have any name because
   *   we won't need to look it up.
   *
   * @default - Bootstrap stack version number looked up
   */
  readonly bootstrapStackVersionSsmParameter?: string;
}

/**
 * Artifact properties for the Asset Manifest
 */
export interface AssetManifestProperties {
  /**
   * Filename of the asset manifest
   */
  readonly file: string;

  /**
   * Version of bootstrap stack required to deploy this stack
   *
   * @default - Version 1 (basic modern bootstrap stack)
   */
  readonly requiresBootstrapStackVersion?: number;

  /**
   * SSM parameter where the bootstrap stack version number can be found
   *
   * - If this value is not set, the bootstrap stack name must be known at
   *   deployment time so the stack version can be looked up from the stack
   *   outputs.
   * - If this value is set, the bootstrap stack can have any name because
   *   we won't need to look it up.
   *
   * @default - Bootstrap stack version number looked up
   */
  readonly bootstrapStackVersionSsmParameter?: string;
}

/**
 * Artifact properties for the Construct Tree Artifact
 */
export interface TreeArtifactProperties {
  /**
   * Filename of the tree artifact
   */
  readonly file: string;
}

/**
 * Artifact properties for nested cloud assemblies
 */
export interface NestedCloudAssemblyProperties {
  /**
   * Relative path to the nested cloud assembly
   */
  readonly directoryName: string;

  /**
   * Display name for the cloud assembly
   *
   * @default - The artifact ID
   */
  readonly displayName?: string;
}

/**
 * Properties for manifest artifacts
 */
export type ArtifactProperties = AwsCloudFormationStackProperties
| AssetManifestProperties
| TreeArtifactProperties
| NestedCloudAssemblyProperties;