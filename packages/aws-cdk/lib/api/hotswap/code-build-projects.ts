import type { UpdateProjectCommandInput } from '@aws-sdk/client-codebuild';
import {
  type ChangeHotswapResult,
  classifyChanges,
  type HotswappableChangeCandidate,
  lowerCaseFirstCharacter,
  transformObjectKeys,
} from './common';
import type { SDK } from '../aws-auth';
import type { EvaluateCloudFormationTemplate } from '../evaluate-cloudformation-template';

export async function isHotswappableCodeBuildProjectChange(
  logicalId: string,
  change: HotswappableChangeCandidate,
  evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  if (change.newValue.Type !== 'AWS::CodeBuild::Project') {
    return [];
  }

  const ret: ChangeHotswapResult = [];

  const classifiedChanges = classifyChanges(change, ['Source', 'Environment', 'SourceVersion']);
  classifiedChanges.reportNonHotswappablePropertyChanges(ret);
  if (classifiedChanges.namesOfHotswappableProps.length > 0) {
    const updateProjectInput: UpdateProjectCommandInput = {
      name: '',
    };
    const projectName = await evaluateCfnTemplate.establishResourcePhysicalName(
      logicalId,
      change.newValue.Properties?.Name,
    );
    ret.push({
      hotswappable: true,
      resourceType: change.newValue.Type,
      propsChanged: classifiedChanges.namesOfHotswappableProps,
      service: 'codebuild',
      resourceNames: [`CodeBuild Project '${projectName}'`],
      apply: async (sdk: SDK) => {
        if (!projectName) {
          return;
        }
        updateProjectInput.name = projectName;

        for (const updatedPropName in change.propertyUpdates) {
          const updatedProp = change.propertyUpdates[updatedPropName];
          switch (updatedPropName) {
            case 'Source':
              updateProjectInput.source = transformObjectKeys(
                await evaluateCfnTemplate.evaluateCfnExpression(updatedProp.newValue),
                convertSourceCloudformationKeyToSdkKey,
              );
              break;
            case 'Environment':
              updateProjectInput.environment = await transformObjectKeys(
                await evaluateCfnTemplate.evaluateCfnExpression(updatedProp.newValue),
                lowerCaseFirstCharacter,
              );
              break;
            case 'SourceVersion':
              updateProjectInput.sourceVersion = await evaluateCfnTemplate.evaluateCfnExpression(updatedProp.newValue);
              break;
          }
        }

        await sdk.codeBuild().updateProject(updateProjectInput);
      },
    });
  }

  return ret;
}

function convertSourceCloudformationKeyToSdkKey(key: string): string {
  if (key.toLowerCase() === 'buildspec') {
    return key.toLowerCase();
  }
  return lowerCaseFirstCharacter(key);
}
