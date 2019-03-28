// tslint:disable:no-console
import AWS = require('aws-sdk');

/**
 * Flattens a nested object
 *
 * @param object the object to be flattened
 * @returns a flat object with path as keys
 */
function flatten(object: object): object {
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

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent, context: AWSLambda.Context) {
  try {
    console.log(JSON.stringify(event));
    console.log('AWS SDK VERSION: ' + (AWS as any).VERSION);

    let data = {};

    const physicalResourceId = event.ResourceProperties.PhysicalResourceId;

    if (event.ResourceProperties[event.RequestType]) {
      const { service, action, parameters = {} } = event.ResourceProperties[event.RequestType];

      const awsService = new (AWS as any)[service]();

      const response = await awsService[action](parameters).promise();

      data = flatten(response);
    }

    await respond('SUCCESS', 'OK', physicalResourceId, data);
  } catch (e) {
    console.log(e);
    await respond('FAILED', e.message, context.logStreamName, {});
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
