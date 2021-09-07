import * as cfn_diff from '@aws-cdk/cloudformation-diff';
//import { ISDK } from '../aws-auth';
import { /*assetMetadataChanged,*/ ChangeHotswapImpact, ChangeHotswapResult/*, HotswapOperation, ListStackResources, stringifyPotentialCfnExpression*/ } from './common';

/**
 * currently, we need to check this:
 * newval.type == 'AWS::StepFunctions::StateMachine',
 * updatedpropname: DefinitionString
 * These two => a hotswappable change
 */

/**
 * Updates an existing state machine by modifying its definition, roleArn, or loggingConfiguration. Running executions will continue to use the previous definition and roleArn. You must include at least one of definition or roleArn or you will receive a MissingRequiredParameter error. All StartExecution calls within a few seconds will use the updated definition and roleArn. Executions started immediately after calling UpdateStateMachine may use the previous state machine definition and roleArn.
 */
/*eslint-disable*/

export function isHotswappableStepFunctionChange(
  logicalId: string, change: cfn_diff.ResourceDifference, assetParamsWithEnv: { [key: string]: string },
): ChangeHotswapResult {
    console.log('ignore: ' + logicalId)
  const stepDefinitionChange = isStepFunctionDefinitionOnlyChange(change, assetParamsWithEnv);

  return stepDefinitionChange;
}

// returns true if a change to the definition string occured and false otherwise
function isStepFunctionDefinitionOnlyChange(
  change: cfn_diff.ResourceDifference, assetParamsWithEnv: { [key: string]: string },
): string | ChangeHotswapImpact {
  // TODO: this is where the change.newValue === undefined check might go if we need it

  // non StateMachine changes require full deployment
  if (change.newValue?.Type != 'AWS::StepFunctions::StateMachine') {
    console.log('ignore: ' + assetParamsWithEnv)

    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  const propertyUpdates = change.propertyUpdates;

  for (const updatedPropName in propertyUpdates) {
    const updatedProp = propertyUpdates[updatedPropName];

    //console.log("updatedProp.newValue")
    //console.log(updatedProp.newValue)
    for (const newPropName in updatedProp.newValue) {
      console.log("newPropName");
      console.log(newPropName);

      //console.log("updateProp.newValue[newPropName]");
      //console.log(updatedProp.newValue[newPropName]);

      /*console.log("updateProp.newValue[newPropName][0]");
      console.log(updatedProp.newValue[newPropName][0]);
      console.log("updateProp.newValue[newPropName][1]");
      console.log(updatedProp.newValue[newPropName][1]);

      for (const idx in updatedProp.newValue[newPropName]) {
        const stringElt = updatedProp.newValue[newPropName][idx];

        for (const stringEltLvl2 in stringElt) {
          console.log(stringEltLvl2);
        }
      }*/

      console.log("type")
      console.log(typeof updatedProp.newValue)
      console.log("keys")
      console.log(Object.keys(updatedProp.newValue));
      console.log("stringified:")
      console.log(JSON.stringify(updatedProp.newValue));

      if (newPropName == 'Fn::Join') {
        return JSON.stringify(updatedProp.newValue);
      }
    }

  }

  return ChangeHotswapImpact.IRRELEVANT;
}