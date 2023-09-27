/* eslint-disable no-console */
import { CustomResourceHandler } from './base';
import { AwsApiCallRequest, AwsApiCallResult } from './types';
import { ApiCall, flatten } from '@aws-cdk/sdk-v2-to-v3-adapter';
import { decodeParameters, deepParseJson } from './utils';

export class AwsApiCallHandler extends CustomResourceHandler<AwsApiCallRequest, AwsApiCallResult | { [key: string]: string }> {
  protected async processEvent(request: AwsApiCallRequest): Promise<AwsApiCallResult | { [key: string]: string } | undefined> {
    const apiCall = new ApiCall(request.service, request.api);

    const parameters = request.parameters ? decodeParameters(request.parameters) : {};
    console.log(`SDK request to ${apiCall.service}.${apiCall.action} with parameters ${JSON.stringify(parameters)}`);
    const response = await apiCall.invoke({ parameters }) as Record<string, unknown>;
    const parsedResponse = deepParseJson(response);

    console.log(`SDK response received ${JSON.stringify(parsedResponse)}`);
    delete parsedResponse.$metadata;

    const respond = {
      apiCallResponse: response,
    };
    const flatData: { [key: string]: string } = {
      ...flatten(respond),
    };

    let resp: AwsApiCallResult | { [key: string]: string } = respond;
    if (request.outputPaths) {
      resp = filterKeys(flatData, request.outputPaths!);
    } else if (request.flattenResponse === 'true') {
      resp = flatData;
    }
    console.log(`Returning result ${JSON.stringify(resp)}`);
    return resp;
  }
}

function filterKeys(object: object, searchStrings: string[]): { [key: string]: string } {
  return Object.entries(object).reduce((filteredObject: { [key: string]: string }, [key, value]) => {
    for (const searchString of searchStrings) {
      if (key.startsWith(`apiCallResponse.${searchString}`)) {
        filteredObject[key] = value;
      }
    }
    return filteredObject;
  }, {});
}