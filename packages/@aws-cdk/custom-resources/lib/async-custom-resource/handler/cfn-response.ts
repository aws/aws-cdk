// tslint:disable: no-console
import https = require('https');
import url = require('url');
import { LifecycleEvent } from "./api";

export function cfnRespond(event: LifecycleEvent, responseStatus: 'SUCCESS' | 'FAILED', reason: string) {
  const responseBody = JSON.stringify({
    Status: responseStatus,
    Reason: reason,
    StackId: event.StackId,
    RequestId: event.RequestId,
    PhysicalResourceId: event.PhysicalResourceId,
    LogicalResourceId: event.LogicalResourceId,
    NoEcho: false,
    Data: event.Data
  });

  console.log('sending response to cloudformation', responseBody);

  const parsedUrl = url.parse(event.ResponseURL);
  const requestOptions = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.path,
    method: 'PUT',
    headers: { 'content-type': '', 'content-length': responseBody.length }
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