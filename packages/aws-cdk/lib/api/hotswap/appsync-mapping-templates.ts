import * as AWS from 'aws-sdk';
import { ISDK } from '../aws-auth';
import { EvaluateCloudFormationTemplate } from '../evaluate-cloudformation-template';
import { ChangeHotswapImpact, ChangeHotswapResult, HotswapOperation, HotswappableChangeCandidate, lowerCaseFirstCharacter, transformObjectKeys } from './common';

export async function isHotswappableAppSyncChange(
  logicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  const isResolver = change.newValue.Type === 'AWS::AppSync::Resolver';
  const isFunction = change.newValue.Type === 'AWS::AppSync::FunctionConfiguration';

  if (!isResolver && !isFunction) {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  for (const updatedPropName in change.propertyUpdates) {
    if (updatedPropName !== 'RequestMappingTemplate' && updatedPropName !== 'ResponseMappingTemplate') {
      return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
    }
  }

  const resourceProperties = change.newValue.Properties;
  if (isResolver && resourceProperties?.Kind === 'PIPELINE') {
    // Pipeline resolvers can't be hotswapped as they reference
    // the FunctionId of the underlying functions, which can't be resolved.
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  const resourcePhysicalName = await evaluateCfnTemplate.establishResourcePhysicalName(logicalId, isFunction ? resourceProperties?.Name : undefined);
  if (!resourcePhysicalName) {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  const evaluatedResourceProperties = await evaluateCfnTemplate.evaluateCfnExpression(resourceProperties);
  const sdkCompatibleResourceProperties = transformObjectKeys(evaluatedResourceProperties, lowerCaseFirstCharacter);

  if (isResolver) {
    // Resolver physical name is the ARN in the format:
    // arn:aws:appsync:us-east-1:111111111111:apis/<apiId>/types/<type>/resolvers/<field>.
    // We'll use `<type>.<field>` as the resolver name.
    const arnParts = resourcePhysicalName.split('/');
    const resolverName = `${arnParts[3]}.${arnParts[5]}`;
    return new ResolverHotswapOperation(resolverName, sdkCompatibleResourceProperties);
  } else {
    return new FunctionHotswapOperation(resourcePhysicalName, sdkCompatibleResourceProperties);
  }
}

class ResolverHotswapOperation implements HotswapOperation {
  public readonly service = 'appsync'
  public readonly resourceNames: string[];

  constructor(resolverName: string, private readonly updateResolverRequest: AWS.AppSync.UpdateResolverRequest) {
    this.resourceNames = [`AppSync resolver '${resolverName}'`];
  }

  public async apply(sdk: ISDK): Promise<any> {
    return sdk.appsync().updateResolver(this.updateResolverRequest).promise();
  }
}

class FunctionHotswapOperation implements HotswapOperation {
  public readonly service = 'appsync'
  public readonly resourceNames: string[];

  constructor(
    private readonly functionName: string,
    private readonly updateFunctionRequest: Omit<AWS.AppSync.UpdateFunctionRequest, 'functionId'>,
  ) {
    this.resourceNames = [`AppSync function '${functionName}'`];
  }

  public async apply(sdk: ISDK): Promise<any> {
    const { functions } = await sdk.appsync().listFunctions({ apiId: this.updateFunctionRequest.apiId }).promise();
    const { functionId } = functions?.find(fn => fn.name === this.functionName) ?? {};
    const request = {
      ...this.updateFunctionRequest,
      functionId: functionId!,
    };
    return sdk.appsync().updateFunction(request).promise();
  }
}
