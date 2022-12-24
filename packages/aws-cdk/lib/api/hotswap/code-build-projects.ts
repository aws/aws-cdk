import * as AWS from 'aws-sdk';
import { ISDK } from '../aws-auth';
import { EvaluateCloudFormationTemplate } from '../evaluate-cloudformation-template';
import { ChangeHotswapResult, classifyChanges, HotswappableChangeCandidate, lowerCaseFirstCharacter, transformObjectKeys } from './common';

export async function isHotswappableCodeBuildProjectChange(
  logicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  if (change.newValue.Type !== 'AWS::CodeBuild::Project') {
    return [];
  }

  const ret: ChangeHotswapResult = [];

  const { yes, no } = classifyChanges(change, ['Source', 'Environment', 'SourceVersion']);

  const noKeys = Object.keys(no);
  if (noKeys.length > 0) {
    ret.push({
      hotswappable: false,
      reason: 'WTF IS THIS',
      rejectedChanges: noKeys,
      resourceType: change.newValue.Type,
    });
  }

  const updateProjectInput: AWS.CodeBuild.UpdateProjectInput = {
    name: '',
  };
  const namesOfHotswappableChanges = Object.keys(yes);
  if (namesOfHotswappableChanges.length > 0) {
    let _projectName: string | undefined = undefined;
    const projectNameLazy = async () => {
      if (!_projectName) {
        _projectName = await evaluateCfnTemplate.establishResourcePhysicalName(logicalId, change.newValue.Properties?.Name);
      }
      return _projectName;
    };
    ret.push({
      hotswappable: true,
      resourceType: change.newValue.Type,
      propsChanged: namesOfHotswappableChanges,
      service: 'codebuild',
      resourceNames: [`CodeBuild Project '${await projectNameLazy()}'`],
      apply: async (sdk: ISDK) => {
        const projectName = await projectNameLazy();
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
