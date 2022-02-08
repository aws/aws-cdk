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

  const resource = change.newValue.Properties;
  const evaluatedResource = {
    ...await evaluateCfnTemplate.evaluateCfnExpression({
      ...(resource ?? {}),
    }),
  };
  const sdkCompatibleResource = transformObjectKeys(evaluatedResource, lowerCaseFirstCharacter);

  const resourcePhysicalName = await evaluateCfnTemplate.establishResourcePhysicalName(logicalId, isFunction ? resource?.Name : null);
  if (!resourcePhysicalName) {
    return ChangeHotswapImpact.REQUIRES_FULL_DEPLOYMENT;
  }

  if (isResolver) {
    // Resolver physical name is the ARN in the format:
    // arn:aws:appsync:us-east-1:111111111111:apis/<apiId>/types/<type>/resolvers/<field>.
    // We'll use `<type>.<field>` as the resolver name.
    const arnParts = resourcePhysicalName.split('/');
    const resolverName = `${arnParts[3]}.${arnParts[5]}`;

    const updateResolverRequest = {
      resolverName,
      request: sdkCompatibleResource,
    };
    return new ResolverHotswapOperation(updateResolverRequest);
  } else {
    const updateFunctionRequest = {
      functionName: resourcePhysicalName,
      request: sdkCompatibleResource,
    };
    return new FunctionHotswapOperation(updateFunctionRequest);
  }
}

interface ResolverUpdateRequest {
  resolverName: string
  request: AWS.AppSync.UpdateResolverRequest
}

class ResolverHotswapOperation implements HotswapOperation {
  public readonly service = 'appsync'
  public readonly resourceNames: string[];

  constructor(
    private readonly resolverUpdateRequest: ResolverUpdateRequest,
  ) {
    this.resourceNames = [`AppSync resolver '${resolverUpdateRequest.resolverName}'`];
  }

  public async apply(sdk: ISDK): Promise<any> {
    return sdk.appsync().updateResolver(this.resolverUpdateRequest.request).promise();
  }
}

interface FunctionUpdateRequest {
  functionName: string
  request: Omit<AWS.AppSync.UpdateFunctionRequest, 'functionId'>
}

class FunctionHotswapOperation implements HotswapOperation {
  public readonly service = 'appsync'
  public readonly resourceNames: string[];

  constructor(
    private readonly functionUpdateRequest: FunctionUpdateRequest,
  ) {
    this.resourceNames = [`AppSync function '${functionUpdateRequest.functionName}'`];
  }

  public async apply(sdk: ISDK): Promise<any> {
    const { functions } = await sdk.appsync().listFunctions({ apiId: this.functionUpdateRequest.request.apiId }).promise();
    const { functionId } = functions?.find(fn => fn.name === this.functionUpdateRequest.functionName) ?? {};
    const request = {
      ...this.functionUpdateRequest.request,
      functionId: functionId!,
    };
    return sdk.appsync().updateFunction(request).promise();
  }
}
