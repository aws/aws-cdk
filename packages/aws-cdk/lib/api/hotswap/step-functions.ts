import * as cfn_diff from '@aws-cdk/cloudformation-diff';
import { ISDK } from '../aws-auth';
import { assetMetadataChanged, ChangeHotswapImpact, ChangeHotswapResult, HotswapOperation, ListStackResources, stringifyPotentialCfnExpression } from './common';

/**
 * currently, we need to check this:
 * newval.type == 'AWS::StepFunctions::StateMachine',
 * updatedpropname: DefinitionString
 * These two => a hotswappable change
 */

/**
 * Updates an existing state machine by modifying its definition, roleArn, or loggingConfiguration. Running executions will continue to use the previous definition and roleArn. You must include at least one of definition or roleArn or you will receive a MissingRequiredParameter error. All StartExecution calls within a few seconds will use the updated definition and roleArn. Executions started immediately after calling UpdateStateMachine may use the previous state machine definition and roleArn.
 */

export function isHotswappableStepFunctionChange(
  logicalId: string, change: cfn_diff.ResourceDifference, assetParamsWithEnv: { [key: string]: string },
): ChangeHotswapResult {
  const stepDefinitionChange = isStepFunctionDefinitionOnlyChange(change, assetParamsWithEnv);
}

// returns true if a change to the definition string occured and false otherwise
function isStepFunctionDefinitionOnlyChange(
  change: cfn_diff.ResourceDifference, assetParamsWithEnv: { [key: string]: string },
): string | ChangeHotswapImpact {

}