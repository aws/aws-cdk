
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
   * The name to use for the CloudFormation stack.
   * @default - name derived from artifact ID
   */
  readonly stackName?: string;

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
   * @default - Version 0 (legacy bootstrap stack)
   */
  readonly requiresBootstrapStackVersion?: number;
}

/**
 * Artifact properties for the Asset Manifest
 */
export interface AssetManifestProperties {
  /**
   * Filename of the asset manifest
   */
  readonly file: string;
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
 * Properties for manifest artifacts
 */
export type ArtifactProperties = AwsCloudFormationStackProperties | AssetManifestProperties | TreeArtifactProperties;