import * as https from 'https';
import * as url from 'url';

export const MISSING_PHYSICAL_ID_MARKER = 'AWSCDK::StateMachineProvider::MISSING_PHYSICAL_ID';

interface CloudFormationResponse {
  StackId: string;
  RequestId: string;
  PhysicalResourceId?: string;
  LogicalResourceId: string;
  ResponseURL: string;
  Data?: any;
  NoEcho?: boolean;
  Reason?: string;
}

export function respond(status: 'SUCCESS' | 'FAILED', event: CloudFormationResponse) {
  const json: AWSLambda.CloudFormationCustomResourceResponse = {
    Status: status,
    Reason: event.Reason ?? status,
    PhysicalResourceId: event.PhysicalResourceId || MISSING_PHYSICAL_ID_MARKER,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    NoEcho: event.NoEcho ?? false,
    Data: event.Data,
  };

  console.log('Responding: %j', json); // tslint:disable-line no-console

  const responseBody = JSON.stringify(json);

  const parsedUrl = url.parse(event.ResponseURL);
  const requestOptions = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.path,
    method: 'PUT',
    headers: { 'content-type': '', 'content-length': responseBody.length },
  };

  return new Promise((resolve, reject) => {
    try {
      const request = https.request(requestOptions, resolve);
      request.on('error', reject);
      request.write(responseBody);
      request.end();
    } catch (e) {
      reject(e);
    }
  });
}
