// tslint:disable:no-console
import AWS = require('aws-sdk');
import { AwsSdkCall } from '../aws-custom-resource';

/**
 * Flattens a nested object
 *
 * @param object the object to be flattened
 * @returns a flat object with path as keys
 */
function flatten(object: object): { [key: string]: string } {
  return Object.assign(
    {},
    ...function _flatten(child: any, path: string[] = []): any {
      return [].concat(...Object.keys(child)
        .map(key =>
          typeof child[key] === 'object'
            ? _flatten(child[key], path.concat([key]))
            : ({ [path.concat([key]).join('.')]: child[key] })
      ));
    }(object)
  );
}

/**
 * Converts true/false strings to booleans in an object
 */
function fixBooleans(object: object) {
  return JSON.parse(JSON.stringify(object), (_k, v) => {
    switch (v) {
      case 'true':
        return true;
      case 'true!':
        return 'true';
      case 'false':
        return false;
      case 'false!':
        return 'false';
      default:
        return v;
    }
  });
}

/**
 * Filters the keys of an object.
 */
function filterKeys(object: object, pred: (key: string) => boolean) {
  return Object.entries(object)
    .reduce(
      (acc, [k, v]) => pred(k)
        ? { ...acc, [k]: v }
        : acc,
        {}
    );
}

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent, context: AWSLambda.Context) {
  try {
    console.log(JSON.stringify(event));
    console.log('AWS SDK VERSION: ' + (AWS as any).VERSION);

    let physicalResourceId = (event as any).PhysicalResourceId;
    let flatData: { [key: string]: string } = {};
    let data: { [key: string]: string } = {};
    const call: AwsSdkCall | undefined = event.ResourceProperties[event.RequestType];

    if (call) {
      const awsService = new (AWS as any)[call.service](call.apiVersion && { apiVersion: call.apiVersion });

      try {
        const response = await awsService[call.action](call.parameters && fixBooleans(call.parameters)).promise();
        flatData = flatten(response);
        data = call.outputPath
          ? filterKeys(flatData, k => k.startsWith(call.outputPath!))
          : flatData;
      } catch (e) {
        if (!call.catchErrorPattern || !new RegExp(call.catchErrorPattern).test(e.code)) {
          throw e;
        }
      }

      physicalResourceId = call.physicalResourceIdPath
        ? flatData[call.physicalResourceIdPath]
        : call.physicalResourceId;
    }

    await respond('SUCCESS', 'OK', physicalResourceId, data);
  } catch (e) {
    console.log(e);
    await respond('FAILED', e.message || 'Internal Error', context.logStreamName, {});
  }

  function respond(responseStatus: string, reason: string, physicalResourceId: string, data: any) {
    const responseBody = JSON.stringify({
      Status: responseStatus,
      Reason: reason,
      PhysicalResourceId: physicalResourceId,
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      NoEcho: false,
      Data: data
    });

    console.log('Responding', responseBody);

    const parsedUrl = require('url').parse(event.ResponseURL);
    const requestOptions = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      method: 'PUT',
      headers: { 'content-type': '', 'content-length': responseBody.length }
    };

    return new Promise((resolve, reject) => {
      try {
        const request = require('https').request(requestOptions, resolve);
        request.on('error', reject);
        request.write(responseBody);
        request.end();
      } catch (e) {
        reject(e);
      }
    });
  }
}
