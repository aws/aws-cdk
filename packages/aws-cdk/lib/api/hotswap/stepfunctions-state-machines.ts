import { type ChangeHotswapResult, classifyChanges, type HotswappableChangeCandidate } from './common';
import type { SDK } from '../aws-auth';
import type { EvaluateCloudFormationTemplate } from '../evaluate-cloudformation-template';

export async function isHotswappableStateMachineChange(
  logicalId: string,
  change: HotswappableChangeCandidate,
  evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  if (change.newValue.Type !== 'AWS::StepFunctions::StateMachine') {
    return [];
  }
  const ret: ChangeHotswapResult = [];
  const classifiedChanges = classifyChanges(change, ['DefinitionString']);
  classifiedChanges.reportNonHotswappablePropertyChanges(ret);

  const namesOfHotswappableChanges = Object.keys(classifiedChanges.hotswappableProps);
  if (namesOfHotswappableChanges.length > 0) {
    const stateMachineNameInCfnTemplate = change.newValue?.Properties?.StateMachineName;
    const stateMachineArn = stateMachineNameInCfnTemplate
      ? await evaluateCfnTemplate.evaluateCfnExpression({
        'Fn::Sub':
            'arn:${AWS::Partition}:states:${AWS::Region}:${AWS::AccountId}:stateMachine:' +
            stateMachineNameInCfnTemplate,
      })
      : await evaluateCfnTemplate.findPhysicalNameFor(logicalId);
    ret.push({
      hotswappable: true,
      resourceType: change.newValue.Type,
      propsChanged: namesOfHotswappableChanges,
      service: 'stepfunctions-service',
      resourceNames: [`${change.newValue.Type} '${stateMachineArn?.split(':')[6]}'`],
      apply: async (sdk: SDK) => {
        if (!stateMachineArn) {
          return;
        }

        // not passing the optional properties leaves them unchanged
        await sdk.stepFunctions().updateStateMachine({
          stateMachineArn,
          definition: await evaluateCfnTemplate.evaluateCfnExpression(change.propertyUpdates.DefinitionString.newValue),
        });
      },
    });
  }

  return ret;
}
