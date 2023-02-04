/**
 * Specify the runtime update mode.
 * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-runtimemanagementconfig.html#cfn-lambda-function-runtimemanagementconfig-updateruntimeon
 */
export class RuntimeManagementMode {
  /**
   * Automatically update to the most recent and secure runtime version using Two-phase runtime version rollout.
   * We recommend this mode for most customers so that you always benefit from runtime updates.
   */
  public static readonly AUTO = new RuntimeManagementMode('Auto');
  /**
   * When you update your function, Lambda updates the runtime of your function to the most recent and secure runtime version.
   * This approach synchronizes runtime updates with function deployments,
   * giving you control over when Lambda applies runtime updates.
   * With this mode, you can detect and mitigate rare runtime update incompatibilities early.
   * When using this mode, you must regularly update your functions to keep their runtime up to date.
   */
  public static readonly FUNCTION_UPDATE = new RuntimeManagementMode('Function update');
  /**
   * You specify a runtime version in your function configuration.
   * The function uses this runtime version indefinitely.
   * In the rare case in which a new runtime version is incompatible with an existing function,
   * you can use this mode to roll back your function to an earlier runtime version.
   */
  public static manual(arn: string): RuntimeManagementMode {
    return new RuntimeManagementMode(arn);
  }

  /**
   * RuntimeManagementConfig.UpdateRuntimeOn
   */
  readonly mode: string;
  /**
   * RuntimeManagementConfig.RuntimeVersionArn
   */
  readonly arn?: string;

  protected constructor(public readonly value: string) {
    if (value.startsWith('arn:')) {
      this.arn = value;
      this.mode = 'Manual';
    } else {
      this.mode = value;
    }
  }
}
