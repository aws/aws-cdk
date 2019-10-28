// tslint:disable: max-line-length
// tslint:disable: no-console
import url = require('url');
import { defaultHttpRequest } from './outbound';
import { log } from './util';

// allow mocking for unit-tests
export let httpRequest = defaultHttpRequest;

export interface CloudFormationResponseOptions {
  readonly reason?: string;
  readonly noEcho?: boolean;
}

export interface CloudFormationEventContext {
  StackId: string;
  RequestId: string;
  PhysicalResourceId?: string;
  LogicalResourceId: string;
  ResponseURL: string;
  Data?: any
}

export async function submitCloudFormationResponse(status: 'SUCCESS' | 'FAILED', event: CloudFormationEventContext, options: CloudFormationResponseOptions = { }) {
  const json: AWSLambda.CloudFormationCustomResourceResponse = {
    Status: status,
    Reason: options.reason || status,
    StackId: event.StackId,
    RequestId: event.RequestId,
    PhysicalResourceId: event.PhysicalResourceId || event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    NoEcho: options.noEcho,
    Data: event.Data
  };

  log('submit response to cloudformation', json);

  const responseBody = JSON.stringify(json);

  const parsedUrl = url.parse(event.ResponseURL);
  await httpRequest({
    hostname: parsedUrl.hostname,
    path: parsedUrl.path,
    method: 'PUT',
    headers: {
      'content-type': '',
      'content-length': responseBody.length
    }
  }, responseBody);
}