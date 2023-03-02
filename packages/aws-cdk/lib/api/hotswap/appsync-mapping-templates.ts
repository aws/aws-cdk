import { ChangeHotswapResult, classifyChanges, HotswappableChangeCandidate, lowerCaseFirstCharacter, reportNonHotswappableChange, transformObjectKeys } from './common';
import { ISDK } from '../aws-auth';
import { EvaluateCloudFormationTemplate } from '../evaluate-cloudformation-template';

export async function isHotswappableAppSyncChange(
  logicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  const isResolver = change.newValue.Type === 'AWS::AppSync::Resolver';
  const isFunction = change.newValue.Type === 'AWS::AppSync::FunctionConfiguration';

  if (!isResolver && !isFunction) {
    return [];
  }

  const ret: ChangeHotswapResult = [];
  if (isResolver && change.newValue.Properties?.Kind === 'PIPELINE') {
    reportNonHotswappableChange(
      ret,
      change,
      undefined,
      'Pipeline resolvers cannot be hotswapped since they reference the FunctionId of the underlying functions, which cannot be resolved',
    );
    return ret;
  }

  const classifiedChanges = classifyChanges(change, ['RequestMappingTemplate', 'ResponseMappingTemplate']);
  classifiedChanges.reportNonHotswappablePropertyChanges(ret);

  const namesOfHotswappableChanges = Object.keys(classifiedChanges.hotswappableProps);
  if (namesOfHotswappableChanges.length > 0) {
    let physicalName: string | undefined = undefined;
    const arn = await evaluateCfnTemplate.establishResourcePhysicalName(logicalId, isFunction ? change.newValue.Properties?.Name : undefined);
    if (isResolver) {
      const arnParts = arn?.split('/');
      physicalName = arnParts ? `${arnParts[3]}.${arnParts[5]}` : undefined;
    } else {
      physicalName = arn;
    }
    ret.push({
      hotswappable: true,
      resourceType: change.newValue.Type,
      propsChanged: namesOfHotswappableChanges,
      service: 'appsync',
      resourceNames: [`${change.newValue.Type} '${physicalName}'`],
      apply: async (sdk: ISDK) => {
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
