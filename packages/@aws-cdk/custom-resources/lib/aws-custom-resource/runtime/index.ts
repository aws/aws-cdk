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
 * Decodes encoded true/false values
 */
function decodeBooleans(object: object) {
  return JSON.parse(JSON.stringify(object), (_k, v) => {
    switch (v) {
      case 'TRUE:BOOLEAN':
        return true;
      case 'FALSE:BOOLEAN':
        return false;
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
      const awsService = new (AWS as any)[call.service]({
        apiVersion: call.apiVersion,
        region: call.region,
      });

      try {
        const response = await awsService[call.action](call.parameters && decodeBooleans(call.parameters)).promise();
        flatData = {
          apiVersion: awsService.config.apiVersion, // For test purposes: check if apiVersion was correctly passed.
          region: awsService.config.region, // For test purposes: check if region was correctly passed.
          ...flatten(response),
        };
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
