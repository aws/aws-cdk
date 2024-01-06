import { IRole } from 'aws-cdk-lib/aws-iam';
import { CfnPipe } from 'aws-cdk-lib/aws-pipes';
import { IPipe } from '.';

/**
 * Target config properties.
 */
export interface TargetConfig {
  /**
   * The ARN of the target resource.
   */
  readonly targetArn: string;

  /**
   * The parameters required to set up a target for your pipe.
   */
  readonly targetParameters: CfnPipe.PipeTargetParametersProperty;
}

/**
 * Target configuration.
 */
export interface ITarget {
  /**
   * Grant the pipe role to push to the target.
   */
  grantPush(grantee: IRole): void;

  /**
   * Bind this target to a pipe.
   */
  bind(pipe: IPipe): TargetConfig;
}