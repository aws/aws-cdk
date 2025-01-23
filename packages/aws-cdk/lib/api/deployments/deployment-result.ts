import { ToolkitError } from '../../toolkit/error';

export type DeployStackResult =
  | SuccessfulDeployStackResult
  | NeedRollbackFirstDeployStackResult
  | ReplacementRequiresRollbackStackResult
  ;

/** Successfully deployed a stack */
export interface SuccessfulDeployStackResult {
  readonly type: 'did-deploy-stack';
  readonly noOp: boolean;
  readonly outputs: { [name: string]: string };
  readonly stackArn: string;
}

/** The stack is currently in a failpaused state, and needs to be rolled back before the deployment */
export interface NeedRollbackFirstDeployStackResult {
  readonly type: 'failpaused-need-rollback-first';
  readonly reason: 'not-norollback' | 'replacement';
  readonly status: string;
}

/** The upcoming change has a replacement, which requires deploying with --rollback */
export interface ReplacementRequiresRollbackStackResult {
  readonly type: 'replacement-requires-rollback';
}

export function assertIsSuccessfulDeployStackResult(x: DeployStackResult): asserts x is SuccessfulDeployStackResult {
  if (x.type !== 'did-deploy-stack') {
    throw new ToolkitError(`Unexpected deployStack result. This should not happen: ${JSON.stringify(x)}. If you are seeing this error, please report it at https://github.com/aws/aws-cdk/issues/new/choose.`);
  }
}
