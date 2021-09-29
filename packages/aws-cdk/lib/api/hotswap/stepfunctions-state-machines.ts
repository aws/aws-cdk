import { ISDK } from '../aws-auth';
import { CloudFormationExecutableTemplate } from './cloudformation-executable-template';
import { ChangeHotswapImpact, ChangeHotswapResult, HotswapOperation/*, ListStackResources/*, stringifyPotentialCfnExpression*/, HotswappableResourceChange } from './common';

export function isHotswappableStateMachineChange(
  logicalId: string, change: HotswappableResourceChange,
): ChangeHotswapResult {
  const stateMachineDefinitionChange = isStateMachineDefinitionOnlyChange(change);

  if ((stateMachineDefinitionChange === ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT) ||
      (stateMachineDefinitionChange === ChangeHotswapImpact.IRRELEVANT)) {
    return stateMachineDefinitionChange;
  }

  /*let machineName: string | undefined;
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
  }*/

  return new StateMachineHotswapOperation({
    logicalId: logicalId,
    definition: stateMachineDefinitionChange,
    stateMachineName: change.newValue?.Properties?.StateMachineName,
  });
}

function isStateMachineDefinitionOnlyChange(
  change: HotswappableResourceChange,
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
  }

  // ensure that only changes to the definition string result in a hotswap
  for (const updatedPropName in propertyUpdates) {
    if (updatedPropName !== 'DefinitionString') {
      return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
    }
  }

  const definitionString = propertyUpdates.DefinitionString;

  return 'DefinitionString' in propertyUpdates ? definitionString.newValue : ChangeHotswapImpact.IRRELEVANT;
}

interface StateMachineResource {
  readonly logicalId: string;
  readonly stateMachineName?: string;
  readonly definition: string;
}

class StateMachineHotswapOperation implements HotswapOperation {
  constructor(private readonly stepFunctionResource: StateMachineResource) {
  }

  public async apply(sdk: ISDK, cfnExecutableTemplate: CloudFormationExecutableTemplate): Promise<any> {
    const stateMachineName = await this.establishFunctionPhysicalName(cfnExecutableTemplate);
    if (!stateMachineName) {
      return;
    }

    const machineDefinition = await cfnExecutableTemplate.evaluateCfnExpression(this.stepFunctionResource.definition);

    return sdk.stepFunctions().updateStateMachine({
      // when left unspecified, the optional properties are left unchanged
      // even though the name of the property is stateMachineArn, passing the name of the state machine is allowed here
      stateMachineArn: stateMachineName,
      definition: machineDefinition,
    }).promise();
  }

  private async establishFunctionPhysicalName(cfnExectuableTemplate: CloudFormationExecutableTemplate): Promise<string | undefined> {
    if (this.stepFunctionResource.stateMachineName) {
      try {
        return await cfnExectuableTemplate.evaluateCfnExpression(this.stepFunctionResource.stateMachineName);
      } catch (e) {
        // If we can't evaluate the function's name CloudFormation expression,
        // just look it up in the currently deployed Stack
      }
    }
    return cfnExectuableTemplate.findPhysicalNameFor(this.stepFunctionResource.logicalId);
  }
}
