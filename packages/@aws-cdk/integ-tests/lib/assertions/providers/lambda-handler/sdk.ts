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
          const childKey = Buffer.isBuffer(child[key]) ? child[key].toString('utf8') : child[key];
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

    const service = new AWS[request.service]();
    const response = await service[request.api](request.parameters && decode(request.parameters)).promise();
    console.log(`SDK response received ${JSON.stringify(response)}`);
    delete response.ResponseMetadata;
    const respond = {
      apiCallResponse: response,
    };
    const flatData: { [key: string]: string } = {
      ...flatten(respond),
    };

    return request.flattenResponse === 'true' ? flatData : respond;
  }
}
