/* eslint-disable no-console */
import { CustomResourceHandler } from './base';
import { AwsApiCallRequest, AwsApiCallResult } from './types';
import { decode } from './utils';

/**
 * Flattens a nested object
 *
 * @param object the object to be flattened
 * @returns a flat object with path as keys
 */
export function flatten(object: object): { [key: string]: any } {
  return Object.assign(
    {},
    ...function _flatten(child: any, path: string[] = []): any {
      return [].concat(...Object.keys(child)
        .map(key => {
          let childKey = Buffer.isBuffer(child[key]) ? child[key].toString('utf8') : child[key];
          // if the value is a json string then treat it as an object
          // and keep recursing. This allows for easier assertions against complex json strings
          if (typeof childKey === 'string') {
            childKey = isJsonString(childKey);
          }
          return typeof childKey === 'object' && childKey !== null
            ? _flatten(childKey, path.concat([key]))
            : ({ [path.concat([key]).join('.')]: childKey });
        }));
    }(object),
  );
}


export class AwsApiCallHandler extends CustomResourceHandler<AwsApiCallRequest, AwsApiCallResult | { [key: string]: string }> {
  protected async processEvent(request: AwsApiCallRequest): Promise<AwsApiCallResult | { [key: string]: string } | undefined> {
    // eslint-disable-next-line
    const AWS: any = require('aws-sdk');
    console.log(`AWS SDK VERSION: ${AWS.VERSION}`);


    if (!Object.prototype.hasOwnProperty.call(AWS, request.service)) {
      throw Error(`Service ${request.service} does not exist in AWS SDK version ${AWS.VERSION}.`);
    }

    const service = new (AWS as any)[request.service]();
    const response = await service[request.api](request.parameters && decode(request.parameters)).promise();
    console.log(`SDK response received ${JSON.stringify(response)}`);
    delete response.ResponseMetadata;
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

function isJsonString(value: string): any {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
