/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import fetch, { Response } from 'node-fetch';
// TODO: can use builtin fetch on node18
import { flatten } from '@aws-cdk/aws-custom-resource-sdk-adapter';
import { CustomResourceHandler } from './base';
import { HttpRequest, HttpResponseWrapper } from './types';
import { deepParseJson } from './utils';

export class HttpHandler extends CustomResourceHandler<HttpRequest, HttpResponseWrapper | { [key: string]: unknown }> {
  protected async processEvent(request: HttpRequest): Promise<HttpResponseWrapper | { [key: string]: unknown }> {
    console.log('request', request);
    const response: Response = await fetch(request.parameters.url, request.parameters.fetchOptions);
    const result: any = {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers.raw(),
    };

    result.body = await response.text();
    try {
      result.body = JSON.parse(result.body);
    } catch (e) {
      // Okay
    }

    let resp: HttpResponseWrapper | { [key: string]: unknown };
    if (request.flattenResponse === 'true') {
      // Flatten and explode JSON fields
      resp = flatten(deepParseJson({ apiCallResponse: result }));
    } else {
      // Otherwise just return the response as-is, without exploding JSON fields
      resp = { apiCallResponse: result };
    }
    console.log(`Returning result ${JSON.stringify(resp)}`);

    return resp;
  }
}
