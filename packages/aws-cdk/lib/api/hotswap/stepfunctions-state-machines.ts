import { ISDK } from '../aws-auth';
import { ChangeHotswapImpact, ChangeHotswapResult, HotswapOperation, ListStackResources, stringifyPotentialCfnExpression, HotswappableResourceChange } from './common';

export function isHotswappableStateMachineChange(
  logicalId: string, change: HotswappableResourceChange, assetParamsWithEnv: { [key: string]: string },
): ChangeHotswapResult {
  const stateMachineDefinitionChange = isStateMachineDefinitionOnlyChange(change, assetParamsWithEnv);

  if ((stateMachineDefinitionChange === ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT) ||
      (stateMachineDefinitionChange === ChangeHotswapImpact.IRRELEVANT)) {
    return stateMachineDefinitionChange;
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
    // by the later phase (which actually does the StepFunctions state machine update)
    machineName = undefined;
  }

  return new StateMachineHotswapOperation({
    logicalId: logicalId,
    definition: stateMachineDefinitionChange,
    stateMachineName: machineName,
  });
}

function isStateMachineDefinitionOnlyChange(
  change: HotswappableResourceChange, assetParamsWithEnv: { [key: string]: string },
): string | ChangeHotswapImpact {
  const newResourceType = change.newValue.Type;
  if (newResourceType !== 'AWS::StepFunctions::StateMachine') {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  const propertyUpdates = change.propertyUpdates;

  for (const updatedPropName in propertyUpdates) {
    const updatedProp = propertyUpdates[updatedPropName];
    if (updatedProp.newValue === undefined) {
      return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
    }
    /*eslint-disable*/
    //for (const newPropName in updatedProp.newValue) {
      //console.log('newPropName: ' + newPropName);
    //}
  }

  // ensure that only changes to the definition string result in a hotswap
  for (const updatedPropName in propertyUpdates) {
    const updatedProp = propertyUpdates[updatedPropName];

    //console.log('name: ' + updatedPropName);
    //console.log(propertyUpdates);

    if (updatedPropName === 'DefinitionString') {
        //const joinString = updatedProp.newValue['Fn::Join'];
        //const updatedDefinition = JSON.parse(joinString[1]);
      //console.log('newValue');
      //console.log(updatedProp.newValue);
      //console.log('returning: ');
      //console.log(stringifyPotentialCfnExpression(JSON.stringify(updatedProp.newValue), assetParamsWithEnv));
      //return stringifyPotentialCfnExpression(updatedDefinition, assetParamsWithEnv);
      //return stringifyPotentialCfnExpression(JSON.stringify(updatedProp.newValue), assetParamsWithEnv);
      //return stringifyPotentialCfnExpression(JSON.parse(JSON.stringify(updatedProp.newValue)), assetParamsWithEnv);
      return stringifyPotentialCfnExpression(updatedProp.newValue, assetParamsWithEnv);
    }

    for (const newPropName in updatedProp.newValue) {
      if (newPropName === 'DefinitionString') {
        //console.log('--------------------------------------');
      }


      if (newPropName === 'Fn::Join') {
        const joinString = updatedProp.newValue[newPropName];
        const updatedDefinition = JSON.parse(joinString[1]);

        return stringifyPotentialCfnExpression(JSON.stringify(updatedDefinition), assetParamsWithEnv);
      }

      return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
    }
  }

  return ChangeHotswapImpact.IRRELEVANT;
}

interface StateMachineResource {
  readonly logicalId: string;
  readonly stateMachineName?: string;
  readonly definition: string;
}

class StateMachineHotswapOperation implements HotswapOperation {
  constructor(private readonly stepFunctionResource: StateMachineResource) {
  }

  public async apply(sdk: ISDK, stackResources: ListStackResources): Promise<any> {
    let stateMachineName: string | undefined;
    if (this.stepFunctionResource.stateMachineName) {
      stateMachineName = this.stepFunctionResource.stateMachineName;
    } else {
      stateMachineName = await stackResources.findHotswappableResource(this.stepFunctionResource);
      if (stateMachineName === undefined) {
        return;
      }
    }

    return sdk.stepFunctions().updateStateMachine({
      // when left unspecified, the optional properties are left unchanged
      // even though the name of the property is stateMachineArn, passing the name of the state machine is allowed here
      stateMachineArn: stateMachineName,
      definition: this.stepFunctionResource.definition,
    }).promise();
  }
}
