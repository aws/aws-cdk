/**
 * Specify the runtime update mode.
 */
export enum UpdateRuntimeOn {
  /**
   * Automatically update to the most recent and secure runtime version using Two-phase runtime version rollout.
   * We recommend this mode for most customers so that you always benefit from runtime updates.
   */
  AUTO = 'Auto',
  /**
   * When you update your function, Lambda updates the runtime of your function to the most recent and secure runtime version.
   * This approach synchronizes runtime updates with function deployments,
   * giving you control over when Lambda applies runtime updates.
   * With this mode, you can detect and mitigate rare runtime update incompatibilities early.
   * When using this mode, you must regularly update your functions to keep their runtime up to date.
   */
  FUNCTION_UPDATE = 'Function update',
  /**
   * You specify a runtime version in your function configuration.
   * The function uses this runtime version indefinitely.
   * In the rare case in which a new runtime version is incompatible with an existing function,
   * you can use this mode to roll back your function to an earlier runtime version.
   */
  MANUAL = 'Manual'
}


/**
 * AWS::Lambda::Function
 * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-runtimemanagementconfig.html#cfn-lambda-function-runtimemanagementconfig-updateruntimeon
 */
export interface RuntimeManagement {
  /**
   * The ARN of the runtime version you want the function to use.
   *
   * Note.
   * This is only required if you're using the Manual runtime update mode.
   *
   * @default none
   */
  readonly arn?: string;
  /**
   * Specify the runtime update mode.
   */
  readonly mode: UpdateRuntimeOn;
}
