import * as AWS from 'aws-sdk';
import { ChangeHotswapResult, classifyChanges, HotswappableChangeCandidate, lowerCaseFirstCharacter, transformObjectKeys } from './common';
import { ISDK } from '../aws-auth';
import { EvaluateCloudFormationTemplate } from '../evaluate-cloudformation-template';

export async function isHotswappableCodeBuildProjectChange(
  logicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  if (change.newValue.Type !== 'AWS::CodeBuild::Project') {
    return [];
  }

  const ret: ChangeHotswapResult = [];

  const classifiedChanges = classifyChanges(change, ['Source', 'Environment', 'SourceVersion']);
  classifiedChanges.reportNonHotswappablePropertyChanges(ret);
  if (classifiedChanges.namesOfHotswappableProps.length > 0) {
    const updateProjectInput: AWS.CodeBuild.UpdateProjectInput = {
      name: '',
    };
    const projectName = await evaluateCfnTemplate.establishResourcePhysicalName(logicalId, change.newValue.Properties?.Name);
    ret.push({
      hotswappable: true,
      resourceType: change.newValue.Type,
      propsChanged: classifiedChanges.namesOfHotswappableProps,
      service: 'codebuild',
      resourceNames: [`CodeBuild Project '${projectName}'`],
      apply: async (sdk: ISDK) => {
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

        await sdk.codeBuild().updateProject(updateProjectInput).promise();
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
