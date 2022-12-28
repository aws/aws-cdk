//import * as AWS from 'aws-sdk';
import { ISDK } from '../aws-auth';
import { EvaluateCloudFormationTemplate } from '../evaluate-cloudformation-template';
import { ChangeHotswapResult, classifyChanges, HotswappableChangeCandidate, lowerCaseFirstCharacter, transformObjectKeys } from './common';

export async function isHotswappableAppSyncChange(
  logicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  const isResolver = change.newValue.Type === 'AWS::AppSync::Resolver';
  const isFunction = change.newValue.Type === 'AWS::AppSync::FunctionConfiguration';

  if (!isResolver && !isFunction) {
    // This decider can't make decisions about this resource type
    return [];
  }

  if (isResolver && change.newValue.Properties?.Kind === 'PIPELINE') {
    return [{
      hotswappable: false,
      logicalId,
      reason: 'Pipeline resolvers cannot be hotswapped since they reference the FunctionId of the underlying functions, which cannot be resolved',
      rejectedChanges: Object.keys(change.propertyUpdates),
      resourceType: change.newValue.Type,
    }];
  }

  const ret: ChangeHotswapResult = [];

  const { hotswappableProps, nonHotswappableProps } = classifyChanges(change, ['RequestMappingTemplate', 'ResponseMappingTemplate']);

  const nonHotswappablePropNames = Object.keys(nonHotswappableProps);
  if (nonHotswappablePropNames.length > 0) {
    ret.push({
      hotswappable: false,
      logicalId,
      rejectedChanges: nonHotswappablePropNames,
      resourceType: change.newValue.Type,
    });
  }

  const namesOfHotswappableChanges = Object.keys(hotswappableProps);
  if (namesOfHotswappableChanges.length > 0) {
    let _physicalName: string | undefined = undefined;
    const physicalNameLazy = async () => {
      const arn = await evaluateCfnTemplate.establishResourcePhysicalName(logicalId, isFunction ? change.newValue.Properties?.Name : undefined);
      if (isResolver) {
        const arnParts = arn?.split('/');
        _physicalName = arnParts ? `${arnParts[3]}.${arnParts[5]}` : undefined;
      } else {
        _physicalName = arn;
      }
      return _physicalName;
    };
    ret.push({
      hotswappable: true,
      resourceType: change.newValue.Type,
      propsChanged: namesOfHotswappableChanges,
      service: 'appsync',
      resourceNames: [`${change.newValue.Type} '${await physicalNameLazy()}'`],
      apply: async (sdk: ISDK) => {
        const physicalName = await physicalNameLazy();
        if (!physicalName) {
          return;
        }

        const sdkProperties: { [name: string]: any } = {
          ...change.oldValue.Properties,
          requestMappingTemplate: change.newValue.Properties?.RequestMappingTemplate,
          responseMappingTemplate: change.newValue.Properties?.ResponseMappingTemplate,
        };
        const evaluatedResourceProperties = await evaluateCfnTemplate.evaluateCfnExpression(sdkProperties);
        const sdkRequestObject = transformObjectKeys(evaluatedResourceProperties, lowerCaseFirstCharacter);

        if (isResolver) {
          await sdk.appsync().updateResolver(sdkRequestObject).promise();
        } else {
          const { functions } = await sdk.appsync().listFunctions({ apiId: sdkRequestObject.apiId }).promise();
          const { functionId } = functions?.find(fn => fn.name === physicalName) ?? {};
          await sdk.appsync().updateFunction({
            ...sdkRequestObject,
            functionId: functionId!,
          }).promise();
        }
      },
    });
  }

  return ret;
}
