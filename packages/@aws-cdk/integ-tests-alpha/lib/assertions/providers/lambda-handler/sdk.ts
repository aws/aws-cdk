/* eslint-disable no-console */
import { CustomResourceHandler } from './base';
import { AwsApiCallRequest, AwsApiCallResult } from './types';
import { ApiCall, flatten } from '@aws-cdk/aws-custom-resource-sdk-adapter';
import { decodeParameters, deepParseJson } from './utils';

export class AwsApiCallHandler extends CustomResourceHandler<AwsApiCallRequest, AwsApiCallResult | { [key: string]: unknown }> {
  protected async processEvent(request: AwsApiCallRequest): Promise<AwsApiCallResult | { [key: string]: unknown } | undefined> {
    const apiCall = new ApiCall(request.service, request.api);

    const parameters = request.parameters ? decodeParameters(request.parameters) : {};
    console.log(`SDK request to ${apiCall.service}.${apiCall.action} with parameters ${JSON.stringify(parameters)}`);
    const response = await apiCall.invoke({ parameters }) as Record<string, unknown>;

    console.log(`SDK response received ${JSON.stringify(response)}`);
    delete response.$metadata;

    let resp: AwsApiCallResult | { [key: string]: unknown };
    if (request.outputPaths || request.flattenResponse === 'true') {
      // Flatten and explode JSON fields
      const flattened = flatten(deepParseJson({ apiCallResponse: response }));
      resp = request.outputPaths ? filterKeys(flattened, request.outputPaths) : flattened;
    } else {
      // Otherwise just return the response as-is, without exploding JSON fields
      resp = { apiCallResponse: response };
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
