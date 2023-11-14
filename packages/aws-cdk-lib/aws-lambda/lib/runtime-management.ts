import { CfnFunction } from './lambda.generated';

/**
 * Specify the runtime update mode.
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
  public static readonly FUNCTION_UPDATE = new RuntimeManagementMode('FunctionUpdate');
  /**
   * You specify a runtime version in your function configuration.
   * The function uses this runtime version indefinitely.
   * In the rare case in which a new runtime version is incompatible with an existing function,
   * you can use this mode to roll back your function to an earlier runtime version.
   */
  public static manual(arn: string): RuntimeManagementMode {
    return new RuntimeManagementMode('Manual', arn);
  }

  /**
   * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-runtimemanagementconfig.html
   */
  readonly runtimeManagementConfig: CfnFunction.RuntimeManagementConfigProperty;

  protected constructor(public readonly mode: string, public readonly arn?: string) {
    if (arn) {
      this.runtimeManagementConfig = {
        runtimeVersionArn: arn,
        updateRuntimeOn: mode,
      };
    } else {
      this.runtimeManagementConfig = {
        updateRuntimeOn: mode,
      };
    }
  }
}
