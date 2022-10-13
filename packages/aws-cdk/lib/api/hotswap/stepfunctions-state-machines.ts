import { ISDK } from '../aws-auth';
import { EvaluateCloudFormationTemplate } from '../evaluate-cloudformation-template';
import { ChangeHotswapImpact, ChangeHotswapResult, HotswapOperation, HotswappableChangeCandidate } from './common';

export async function isHotswappableStateMachineChange(
  logicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  const stateMachineDefinitionChange = await isStateMachineDefinitionOnlyChange(change, evaluateCfnTemplate);
  if (stateMachineDefinitionChange === ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT ||
      stateMachineDefinitionChange === ChangeHotswapImpact.IRRELEVANT) {
    return stateMachineDefinitionChange;
  }

  const stateMachineNameInCfnTemplate = change.newValue?.Properties?.StateMachineName;
  const stateMachineArn = stateMachineNameInCfnTemplate
    ? await evaluateCfnTemplate.evaluateCfnExpression({
      'Fn::Sub': 'arn:${AWS::Partition}:states:${AWS::Region}:${AWS::AccountId}:stateMachine:' + stateMachineNameInCfnTemplate,
    })
    : await evaluateCfnTemplate.findPhysicalNameFor(logicalId);

  if (!stateMachineArn) {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  return new StateMachineHotswapOperation({
    definition: stateMachineDefinitionChange,
    stateMachineArn: stateMachineArn,
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
  if (Object.keys(propertyUpdates).length === 0) {
    return ChangeHotswapImpact.IRRELEVANT;
  }

  for (const updatedPropName in propertyUpdates) {
    // ensure that only changes to the definition string result in a hotswap
    if (updatedPropName !== 'DefinitionString') {
      return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
    }
  }

  return evaluateCfnTemplate.evaluateCfnExpression(propertyUpdates.DefinitionString.newValue);
}

interface StateMachineResource {
  readonly stateMachineArn: string;
  readonly definition: string;
}

class StateMachineHotswapOperation implements HotswapOperation {
  public readonly service = 'stepfunctions-state-machine';
  public readonly resourceNames: string[];

  constructor(private readonly stepFunctionResource: StateMachineResource) {
    this.resourceNames = [`StateMachine '${this.stepFunctionResource.stateMachineArn.split(':')[6]}'`];
  }

  public async apply(sdk: ISDK): Promise<any> {
    // not passing the optional properties leaves them unchanged
    return sdk.stepFunctions().updateStateMachine({
      stateMachineArn: this.stepFunctionResource.stateMachineArn,
      definition: this.stepFunctionResource.definition,
    }).promise();
  }
}
