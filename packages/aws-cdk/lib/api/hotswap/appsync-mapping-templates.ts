import { GetSchemaCreationStatusRequest, GetSchemaCreationStatusResponse } from 'aws-sdk/clients/appsync';
import { ChangeHotswapResult, classifyChanges, HotswappableChangeCandidate, lowerCaseFirstCharacter, transformObjectKeys } from './common';
import { ISDK } from '../aws-auth';

import { EvaluateCloudFormationTemplate } from '../evaluate-cloudformation-template';

export async function isHotswappableAppSyncChange(
  logicalId: string, change: HotswappableChangeCandidate, evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  const isResolver = change.newValue.Type === 'AWS::AppSync::Resolver';
  const isFunction = change.newValue.Type === 'AWS::AppSync::FunctionConfiguration';
  const isGraphQLSchema = change.newValue.Type === 'AWS::AppSync::GraphQLSchema';

  if (!isResolver && !isFunction && !isGraphQLSchema) {
    return [];
  }

  const ret: ChangeHotswapResult = [];

  const classifiedChanges = classifyChanges(change, [
    'RequestMappingTemplate',
    'ResponseMappingTemplate',
    'Definition',
  ]);
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
          Definition: change.newValue.Properties?.Definition,
          requestMappingTemplate: change.newValue.Properties?.RequestMappingTemplate,
          responseMappingTemplate: change.newValue.Properties?.ResponseMappingTemplate,
        };
        const evaluatedResourceProperties = await evaluateCfnTemplate.evaluateCfnExpression(sdkProperties);
        const sdkRequestObject = transformObjectKeys(evaluatedResourceProperties, lowerCaseFirstCharacter);

        if (isResolver) {
          await sdk.appsync().updateResolver(sdkRequestObject).promise();
        } else if (isFunction) {
          const { functions } = await sdk.appsync().listFunctions({ apiId: sdkRequestObject.apiId }).promise();
          const { functionId } = functions?.find(fn => fn.name === physicalName) ?? {};
          await sdk.appsync().updateFunction({
            ...sdkRequestObject,
            functionId: functionId!,
          }).promise();
        } else {
          let schemaCreationResponse: GetSchemaCreationStatusResponse = await sdk.appsync().startSchemaCreation(sdkRequestObject).promise();
          while (schemaCreationResponse.status && ['PROCESSING', 'DELETING'].some(status => status === schemaCreationResponse.status)) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // poll every second
            const getSchemaCreationStatusRequest: GetSchemaCreationStatusRequest = {
              apiId: sdkRequestObject.apiId,
            };
            schemaCreationResponse = await sdk.appsync().getSchemaCreationStatus(getSchemaCreationStatusRequest).promise();
          }
          if (schemaCreationResponse.status === 'FAILED') {
            throw new Error(schemaCreationResponse.details);
          }
        }
      },
    });
  }

  return ret;
}
