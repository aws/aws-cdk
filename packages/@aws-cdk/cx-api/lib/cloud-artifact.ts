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
   */
  readonly parameters?: { [id: string]: string };

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
}

export { CloudArtifact } from './cloud-assembly';
