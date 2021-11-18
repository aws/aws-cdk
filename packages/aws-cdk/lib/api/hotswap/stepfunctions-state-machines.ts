import { ISDK } from '../aws-auth';
import { ChangeHotswapImpact, ChangeHotswapResult, HotswapOperation, HotswappableChangeCandidate, establishResourcePhysicalName } from './common';
import { EvaluateCloudFormationTemplate } from './evaluate-cloudformation-template';

export async function isHotswappableStateMachineChange(
  logicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  const stateMachineDefinitionChange = await isStateMachineDefinitionOnlyChange(change, evaluateCfnTemplate);
  if (stateMachineDefinitionChange === ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT ||
      stateMachineDefinitionChange === ChangeHotswapImpact.IRRELEVANT) {
    return stateMachineDefinitionChange;
  }

  const machineNameInCfnTemplate = change.newValue?.Properties?.StateMachineName;
  const machineName = await establishResourcePhysicalName(logicalId, machineNameInCfnTemplate, evaluateCfnTemplate);
  if (!machineName) {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  return new StateMachineHotswapOperation({
    definition: stateMachineDefinitionChange,
    stateMachineName: machineName,
  });
}

async function isStateMachineDefinitionOnlyChange(
  change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<string | ChangeHotswapImpact> {
  const newResourceType = change.newValue.Type;
  if (newResourceType !== 'AWS::StepFunctions::StateMachine') {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  const propertyUpdates = change.propertyUpdates;
  for (const updatedPropName in propertyUpdates) {
    // ensure that only changes to the definition string result in a hotswap
    if (updatedPropName !== 'DefinitionString') {
      return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
    }
  }

  return evaluateCfnTemplate.evaluateCfnExpression(propertyUpdates.DefinitionString.newValue);
}

interface StateMachineResource {
  readonly stateMachineName: string;
  readonly definition: string;
}

class StateMachineHotswapOperation implements HotswapOperation {
  public readonly service = 'stepfunctions-state-machine';

  constructor(private readonly stepFunctionResource: StateMachineResource) {
  }

  public async apply(sdk: ISDK): Promise<any> {
    // not passing the optional properties leaves them unchanged
    return sdk.stepFunctions().updateStateMachine({
      // even though the name of the property is stateMachineArn, passing the name of the state machine is allowed here
      stateMachineArn: this.stepFunctionResource.stateMachineName,
      definition: this.stepFunctionResource.definition,
    }).promise();
  }
}
