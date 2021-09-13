import * as cfn_diff from '@aws-cdk/cloudformation-diff';
import { ISDK } from '../aws-auth';
import { /*assetMetadataChanged,*/ ChangeHotswapImpact, ChangeHotswapResult, HotswapOperation, ListStackResources, stringifyPotentialCfnExpression } from './common';

/**
 * currently, we need to check this:
 * newval.type == 'AWS::StepFunctions::StateMachine',
 * updatedpropname: DefinitionString
 * These two => a hotswappable change
 */

/**
 * deleteme
 * Updates an existing state machine by modifying its definition, roleArn, or loggingConfiguration. Running executions will continue to use the previous definition and roleArn. You must include at least one of definition or roleArn or you will receive a MissingRequiredParameter error. All StartExecution calls within a few seconds will use the updated definition and roleArn. Executions started immediately after calling UpdateStateMachine may use the previous state machine definition and roleArn.
 */
/*eslint-disable*/

export function isHotswappableStepFunctionChange(
  logicalId: string, change: cfn_diff.ResourceDifference, assetParamsWithEnv: { [key: string]: string },
): ChangeHotswapResult {
  const stepDefinitionChange = isStepFunctionDefinitionOnlyChange(change, assetParamsWithEnv);

  if ((stepDefinitionChange === ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT) || 
      (stepDefinitionChange === ChangeHotswapImpact.IRRELEVANT)) {
    return stepDefinitionChange;
  }

  let machineName: string | undefined;
  try {
    machineName = stringifyPotentialCfnExpression(change.newValue?.Properties?.StateMachineName, assetParamsWithEnv);
  } catch (e) {
    // It's possible we can't evaluate the function's name -
    // for example, it can use a Ref to a different resource,
    // which we wouldn't have in `assetParamsWithEnv`.
    // That's fine though - ignore any errors,
    // and treat this case the same way as if the name wasn't provided at all,
    // which means it will be looked up using the listStackResources() call
    // by the later phase (which actually does the Lambda function update)
    machineName = undefined;
  }


  return new StepFunctionHotswapOperation({
    logicalId: logicalId,
    definition: stepDefinitionChange,
    stateMachineName: machineName,
  });
}

/**
 * Returns `ChangeHotswapImpact.IRRELEVANT` if the change is not for a AWS::StepFunctions::StateMachine,
 * but doesn't prevent short-circuiting
 * (like a change to CDKMetadata resource),
 * `ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT` if the change is to a AWS::Lambda::Function,
 * but not only to its Code property,
 * or a LambdaFunctionCode if the change is to a AWS::Lambda::Function,
 * and only affects its Code property.
 */
function isStepFunctionDefinitionOnlyChange(
  change: cfn_diff.ResourceDifference, assetParamsWithEnv: { [key: string]: string },
): string | ChangeHotswapImpact {
  // TODO: this is where the change.newValue === undefined check might go if we need it

  // if we see a different resource type, it will be caught by isNonHotswappableResourceChange()
  // this also ignores Metadata changes
  const newResourceType = change.newValue?.Type;
  if (newResourceType !== 'AWS::StepFunctions::StateMachine') {
    return ChangeHotswapImpact.IRRELEVANT;
  }

  if (change.oldValue?.Type == null) {
    // can't short-circuit a brand new StateMachine
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  const propertyUpdates = change.propertyUpdates;

  // ensure that only changes to the definition string result in a hotswap
  for (const updatedPropName in propertyUpdates) {
    const updatedProp = propertyUpdates[updatedPropName];

    for (const newPropName in updatedProp.newValue) {
      if (newPropName === 'Fn::Join') {
        const joinString = updatedProp.newValue[newPropName];
        const updatedDefinition = JSON.parse(joinString[1]); // new value is located here

        return stringifyPotentialCfnExpression(JSON.stringify(updatedDefinition), assetParamsWithEnv);
      }

      return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
    }
  }

  return ChangeHotswapImpact.IRRELEVANT;
}

interface StepFunctionResource {
  readonly logicalId: string;
  readonly stateMachineName?: string;
  readonly definition: string;
}

class StepFunctionHotswapOperation implements HotswapOperation {
  constructor(private readonly stepFunctionResource: StepFunctionResource) {
  }

  public async apply(sdk: ISDK, stackResources: ListStackResources): Promise<any> {
    let stateMachineName: string;
    if (this.stepFunctionResource.stateMachineName) {
      stateMachineName = this.stepFunctionResource.stateMachineName;
    } else {
      const stackResourceList = await stackResources.listStackResources();
      const foundMachineName = stackResourceList
        .find(resSummary => resSummary.LogicalResourceId === this.stepFunctionResource.logicalId)
        ?.PhysicalResourceId;
      if (!foundMachineName) {
        // if we couldn't find the function in the current stack, we can't update it
        return;
      }
      stateMachineName = foundMachineName;
    }

   return sdk.stepFunctions().updateStateMachine({
     // CloudFormation Docs state that we can use the Ref intrinsic with the state machine name to get the ARN
     // but it turns out that the name is automatically magically converted to the arn
     //stateMachineArn: '{ Ref: ' + stateMachineName  + ' }',
     // magic
     stateMachineArn: stateMachineName,
     definition: this.stepFunctionResource.definition,
   }).promise();
  }
}