import { ISDK } from '../aws-auth';
import { EvaluateCloudFormationTemplate } from '../evaluate-cloudformation-template';
import { ChangeHotswapResult, classifyChanges, HotswappableChangeCandidate } from './common';

export async function isHotswappableStateMachineChange(
  logicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  if (change.newValue.Type !== 'AWS::StepFunctions::StateMachine') {
    return [];
  }
  /*const stateMachineDefinitionChange = await isStateMachineDefinitionOnlyChange(change, evaluateCfnTemplate, hotswapType);
  if (stateMachineDefinitionChange === ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT ||
      stateMachineDefinitionChange === ChangeHotswapImpact.IRRELEVANT) {
    return stateMachineDefinitionChange;
  }
  */
  const { yes, no } = classifyChanges(change, ['DefinitionString']);
  const ret: ChangeHotswapResult = [];

  const noKeys = Object.keys(no);
  if (noKeys.length > 0) {
    ret.push({
      hotswappable: false,
      reason: 'WTF IS THIS',
      rejectedChanges: noKeys,
      resourceType: change.newValue.Type,
    });
  }

  const namesOfHotswappableChanges = Object.keys(yes);
  if (namesOfHotswappableChanges.length > 0) {
    ret.push({
      hotswappable: true,
      resourceType: change.newValue.Type,
      propsChanged: namesOfHotswappableChanges,
      service: 'ecs-service',
      resourceNames: ['blah'], //TODO: this will probably have to be resovled during `apply()` somehow
      apply: async (sdk: ISDK) => {
        const stateMachineNameInCfnTemplate = change.newValue?.Properties?.StateMachineName;
        const stateMachineArn = stateMachineNameInCfnTemplate
          ? await evaluateCfnTemplate.evaluateCfnExpression({
            'Fn::Sub': 'arn:${AWS::Partition}:states:${AWS::Region}:${AWS::AccountId}:stateMachine:' + stateMachineNameInCfnTemplate,
          })
          : await evaluateCfnTemplate.findPhysicalNameFor(logicalId);

        if (!stateMachineArn) {
          return;
        }

        // not passing the optional properties leaves them unchanged
        await sdk.stepFunctions().updateStateMachine({
          stateMachineArn,
          definition: await evaluateCfnTemplate.evaluateCfnExpression(change.propertyUpdates.DefinitionString.newValue),
        }).promise();
      },
    });
  }

  return ret;
}

/*async function isStateMachineDefinitionOnlyChange(
  change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate, hotswapType: HotswapType,
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
    if (updatedPropName !== 'DefinitionString' && hotswapType === HotswapType.HOTSWAP) {
      return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
    }
  }

  return evaluateCfnTemplate.evaluateCfnExpression(propertyUpdates.DefinitionString.newValue);
}
*/

