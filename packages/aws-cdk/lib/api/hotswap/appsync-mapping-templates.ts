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
    'RequestMappingTemplateS3Location',
    'ResponseMappingTemplate',
    'ResponseMappingTemplateS3Location',
    'Definition',
    'DefinitionS3Location',
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
          DefinitionS3Location: change.newValue.Properties?.DefinitionS3Location,
          requestMappingTemplate: change.newValue.Properties?.RequestMappingTemplate,
          requestMappingTemplateS3Location: change.newValue.Properties?.RequestMappingTemplateS3Location,
          responseMappingTemplate: change.newValue.Properties?.ResponseMappingTemplate,
          responseMappingTemplateS3Location: change.newValue.Properties?.ResponseMappingTemplateS3Location,
        };
        const evaluatedResourceProperties = await evaluateCfnTemplate.evaluateCfnExpression(sdkProperties);
        const sdkRequestObject = transformObjectKeys(evaluatedResourceProperties, lowerCaseFirstCharacter);

        // resolve s3 location files as SDK doesn't take in s3 location but inline code
        if (sdkRequestObject.requestMappingTemplateS3Location) {
          sdkRequestObject.requestMappingTemplate = (await fetchFileFromS3(sdkRequestObject.requestMappingTemplateS3Location, sdk))?.toString('utf8');
          delete sdkRequestObject.requestMappingTemplateS3Location;
        }
        if (sdkRequestObject.responseMappingTemplateS3Location) {
          sdkRequestObject.responseMappingTemplate = (await fetchFileFromS3(sdkRequestObject.responseMappingTemplateS3Location, sdk))?.toString('utf8');
          delete sdkRequestObject.responseMappingTemplateS3Location;
        }
        if (sdkRequestObject.definitionS3Location) {
          sdkRequestObject.definition = await fetchFileFromS3(sdkRequestObject.definitionS3Location, sdk);
          delete sdkRequestObject.definitionS3Location;
        }

        if (isResolver) {
          await sdk.appsync().updateResolver(sdkRequestObject).promise();
        } else if (isFunction) {

          const { functions } = await sdk.appsync().listFunctions({ apiId: sdkRequestObject.apiId }).promise();
          const { functionId } = functions?.find(fn => fn.name === physicalName) ?? {};
          await simpleRetry(
            () => sdk.appsync().updateFunction({ ...sdkRequestObject, functionId: functionId! }).promise(),
            3,
            'ConcurrentModificationException');
        } else {
          let schemaCreationResponse: GetSchemaCreationStatusResponse = await sdk.appsync().startSchemaCreation(sdkRequestObject).promise();
          while (schemaCreationResponse.status && ['PROCESSING', 'DELETING'].some(status => status === schemaCreationResponse.status)) {
            await sleep(1000); // poll every second
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

async function fetchFileFromS3(s3Url: string, sdk: ISDK) {
  const s3PathParts = s3Url.split('/');
  const s3Bucket = s3PathParts[2]; // first two are "s3:" and "" due to s3://
  const s3Key = s3PathParts.splice(3).join('/'); // after removing first three we reconstruct the key
  return (await sdk.s3().getObject({ Bucket: s3Bucket, Key: s3Key }).promise()).Body;
}

async function simpleRetry(fn: () => Promise<any>, numOfRetries: number, errorCodeToRetry: string) {
  try {
    await fn();
  } catch (error: any) {
    if (error && error.code === errorCodeToRetry && numOfRetries > 0) {
      await sleep(500); // wait half a second
      await simpleRetry(fn, numOfRetries - 1, errorCodeToRetry);
    } else {
      throw error;
    }
  }
}

async function sleep(ms: number) {
  return new Promise(ok => setTimeout(ok, ms));
}
