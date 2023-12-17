import { IRole } from 'aws-cdk-lib/aws-iam';
import { CfnPipe } from 'aws-cdk-lib/aws-pipes';

// TODO refactor to build your own representation of CfnPipe.PipeTargetParametersProperty;
// /**
//  * Common parameters for all pipe targets.
//  */
// export interface IPipeTargetCommonParameters {
//   /**
//    * Input template applied for the target.
//    */
//   readonly inputTemplate?: IInputTransformation;
// }

/**
 * Target configuration.
 */
export interface IPipeTarget {
  /**
   * The ARN of the target resource.
   */
  readonly targetArn: string;

  /**
   * The parameters required to set up a target for your pipe.
   */
  readonly targetParameters: CfnPipe.PipeTargetParametersProperty;

  /**
   * Grant the pipe role to push to the target.
   */
  grantPush(grantee: IRole): void;
}

