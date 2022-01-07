import * as AWS from 'aws-sdk';
import { ISDK } from '../aws-auth';
import { EvaluateCloudFormationTemplate } from '../evaluate-cloudformation-template';
import { ChangeHotswapImpact, ChangeHotswapResult, HotswapOperation, HotswappableChangeCandidate, lowerCaseFirstCharacter, transformObjectKeys } from './common';

export async function isHotswappableCodeBuildProjectChange(
  logicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  if (change.newValue.Type !== 'AWS::CodeBuild::Project') {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  const updateProjectInput: AWS.CodeBuild.UpdateProjectInput = {
    name: '',
  };
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
      default:
        return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
    }
  }

  const projectName = await evaluateCfnTemplate.establishResourcePhysicalName(logicalId, change.newValue.Properties?.Name);
  if (!projectName) {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }
  updateProjectInput.name = projectName;
  return new ProjectHotswapOperation(updateProjectInput);
}

class ProjectHotswapOperation implements HotswapOperation {
  public readonly service = 'codebuild'
  public readonly resourceNames: string[];

  constructor(
    private readonly updateProjectInput: AWS.CodeBuild.UpdateProjectInput,
  ) {
    this.resourceNames = [`CodeBuild project '${updateProjectInput.name}'`];
  }

  public async apply(sdk: ISDK): Promise<any> {
    return sdk.codeBuild().updateProject(this.updateProjectInput).promise();
  }
}

function convertSourceCloudformationKeyToSdkKey(key: string): string {
  if (key.toLowerCase() === 'buildspec') {
    return key.toLowerCase();
  }
  return lowerCaseFirstCharacter(key);
}
