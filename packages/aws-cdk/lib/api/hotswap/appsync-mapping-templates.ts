import {
  UpdateResolverCommand,
  ListFunctionsCommand,
  UpdateFunctionCommand,
  StartSchemaCreationCommand,
  GetSchemaCreationStatusCommand,
  UpdateApiKeyCommand,
  GetSchemaCreationStatusCommandOutput,
  GetSchemaCreationStatusCommandInput,
} from '@aws-sdk/client-appsync';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import {
  ChangeHotswapResult,
  classifyChanges,
  HotswappableChangeCandidate,
  lowerCaseFirstCharacter,
  transformObjectKeys,
} from './common';
import { ISDK } from '../aws-auth';

import { EvaluateCloudFormationTemplate } from '../evaluate-cloudformation-template';

export async function isHotswappableAppSyncChange(
  logicalId: string,
  change: HotswappableChangeCandidate,
  evaluateCfnTemplate: EvaluateCloudFormationTemplate,
): Promise<ChangeHotswapResult> {
  const isResolver = change.newValue.Type === 'AWS::AppSync::Resolver';
  const isFunction = change.newValue.Type === 'AWS::AppSync::FunctionConfiguration';
  const isGraphQLSchema = change.newValue.Type === 'AWS::AppSync::GraphQLSchema';
  const isAPIKey = change.newValue.Type === 'AWS::AppSync::ApiKey';
  if (!isResolver && !isFunction && !isGraphQLSchema && !isAPIKey) {
    return [];
  }

  const ret: ChangeHotswapResult = [];

  const classifiedChanges = classifyChanges(change, [
    'RequestMappingTemplate',
    'RequestMappingTemplateS3Location',
    'ResponseMappingTemplate',
    'ResponseMappingTemplateS3Location',
    'Code',
    'CodeS3Location',
    'Definition',
    'DefinitionS3Location',
    'Expires',
  ]);
  classifiedChanges.reportNonHotswappablePropertyChanges(ret);

  const namesOfHotswappableChanges = Object.keys(classifiedChanges.hotswappableProps);
  if (namesOfHotswappableChanges.length > 0) {
    let physicalName: string | undefined = undefined;
    const arn = await evaluateCfnTemplate.establishResourcePhysicalName(
      logicalId,
      isFunction ? change.newValue.Properties?.Name : undefined,
    );
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
          code: change.newValue.Properties?.Code,
          codeS3Location: change.newValue.Properties?.CodeS3Location,
          expires: change.newValue.Properties?.Expires,
        };
        const evaluatedResourceProperties = await evaluateCfnTemplate.evaluateCfnExpression(sdkProperties);
        const sdkRequestObject = transformObjectKeys(evaluatedResourceProperties, lowerCaseFirstCharacter);

        // resolve s3 location files as SDK doesn't take in s3 location but inline code
        if (sdkRequestObject.requestMappingTemplateS3Location) {
          sdkRequestObject.requestMappingTemplate = (
            await fetchFileFromS3(sdkRequestObject.requestMappingTemplateS3Location, sdk)
          )?.toString();
          delete sdkRequestObject.requestMappingTemplateS3Location;
        }
        if (sdkRequestObject.responseMappingTemplateS3Location) {
          sdkRequestObject.responseMappingTemplate = (
            await fetchFileFromS3(sdkRequestObject.responseMappingTemplateS3Location, sdk)
          )?.toString();
          delete sdkRequestObject.responseMappingTemplateS3Location;
        }
        if (sdkRequestObject.definitionS3Location) {
          sdkRequestObject.definition = (await fetchFileFromS3(sdkRequestObject.definitionS3Location, sdk))?.toString();
          delete sdkRequestObject.definitionS3Location;
        }
        if (sdkRequestObject.codeS3Location) {
          sdkRequestObject.code = (await fetchFileFromS3(sdkRequestObject.codeS3Location, sdk))?.toString();
          delete sdkRequestObject.codeS3Location;
        }

        if (isResolver) {
          const updateResolverCommand = new UpdateResolverCommand(sdkRequestObject);
          await sdk.appsync().send(updateResolverCommand);
        } else if (isFunction) {
          // Function version is only applicable when using VTL and mapping templates
          // Runtime only applicable when using code (JS mapping templates)
          if (sdkRequestObject.code) {
            delete sdkRequestObject.functionVersion;
          } else {
            delete sdkRequestObject.runtime;
          }
          const listFunctionsCommand = new ListFunctionsCommand({
            apiId: sdkRequestObject.apiId,
          });
          const { functions } = await sdk.appsync().send(listFunctionsCommand);
          const { functionId } = functions?.find((fn) => fn.name === physicalName) ?? {};
          // Updating multiple functions at the same time or along with graphql schema results in `ConcurrentModificationException`
          const updateFunctionCommand = new UpdateFunctionCommand({
            ...sdkRequestObject,
            functionId: functionId!,
          });
          await simpleRetry(() => sdk.appsync().send(updateFunctionCommand), 5, 'ConcurrentModificationException');
        } else if (isGraphQLSchema) {
          const startSchemaCreationCommand = new StartSchemaCreationCommand(sdkRequestObject);
          let schemaCreationResponse: GetSchemaCreationStatusCommandOutput = await sdk
            .appsync()
            .send(startSchemaCreationCommand);
          while (
            schemaCreationResponse.status &&
            ['PROCESSING', 'DELETING'].some((status) => status === schemaCreationResponse.status)
          ) {
            await sleep(1000); // poll every second
            const getSchemaCreationStatusRequest: GetSchemaCreationStatusCommandInput = {
              apiId: sdkRequestObject.apiId,
            };
            const getSchemaCreationCommand = new GetSchemaCreationStatusCommand(getSchemaCreationStatusRequest);
            schemaCreationResponse = await sdk.appsync().send(getSchemaCreationCommand);
          }
          if (schemaCreationResponse.status === 'FAILED') {
            throw new Error(schemaCreationResponse.details);
          }
        } else {
          //isApiKey
          if (!sdkRequestObject.id) {
            // ApiKeyId is optional in CFN but required in SDK. Grab the KeyId from physicalArn if not available as part of CFN template
            const arnParts = physicalName?.split('/');
            if (arnParts && arnParts.length === 4) {
              sdkRequestObject.id = arnParts[3];
            }
          }
          const updateApiKeyCommand = new UpdateApiKeyCommand(sdkRequestObject);
          await sdk.appsync().send(updateApiKeyCommand);
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
  return (await sdk.s3().send(new GetObjectCommand({ Bucket: s3Bucket, Key: s3Key }))).Body;
}

async function simpleRetry(fn: () => Promise<any>, numOfRetries: number, errorCodeToRetry: string) {
  try {
    await fn();
  } catch (error: any) {
    if (error && error.code === errorCodeToRetry && numOfRetries > 0) {
      await sleep(1000); // wait a whole second
      await simpleRetry(fn, numOfRetries - 1, errorCodeToRetry);
    } else {
      throw error;
    }
  }
}

async function sleep(ms: number) {
  return new Promise((ok) => setTimeout(ok, ms));
}
