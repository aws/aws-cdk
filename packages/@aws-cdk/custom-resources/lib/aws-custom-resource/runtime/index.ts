/* eslint-disable no-console */
import { execSync } from 'child_process';
// import the AWSLambda package explicitly,
// which is globally available in the Lambda runtime,
// as otherwise linking this repository with link-all.sh
// fails in the CDK app executed with ts-node
/* eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved */
import * as AWSLambda from 'aws-lambda';
import { AwsSdkCall } from '../aws-custom-resource';

/**
 * Serialized form of the physical resource id for use in the operation parameters
 */
export const PHYSICAL_RESOURCE_ID_REFERENCE = 'PHYSICAL:RESOURCEID:';

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

/**
 * Decodes encoded special values (physicalResourceId)
 */
function decodeSpecialValues(object: object, physicalResourceId: string) {
  return JSON.parse(JSON.stringify(object), (_k, v) => {
    switch (v) {
      case PHYSICAL_RESOURCE_ID_REFERENCE:
        return physicalResourceId;
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
      {},
    );
}

let installedSdk: { [service: string]: boolean } = {};

export function forceSdkInstallation() {
  installedSdk = {};
}

/**
 * Installs latest AWS SDK v3
 */
function installLatestSdk(serviceName: string): void {
  console.log('Installing latest AWS SDK v3');
  // Both HOME and --prefix are needed here because /tmp is the only writable location
  execSync(
    `HOME=/tmp npm install @aws-sdk/client-${serviceName} --production --no-package-lock --no-save --prefix /tmp`,
  );
  installedSdk = {
    ...installedSdk,
    [serviceName]: true,
  };
}

async function loadAwsSdk(
  serviceName: string,
  installLatestAwsSdk?: 'true' | 'false',
) {
  const lowerServiceName = serviceName.toLowerCase();
  let awsSdk: { [key: string]: any };
  try {
    if (!installedSdk[lowerServiceName] && installLatestAwsSdk === 'true') {
      installLatestSdk(lowerServiceName);
      awsSdk = await import(`/tmp/node_modules/@aws-sdk/client-${lowerServiceName}`).catch(async (e) => {
        console.log(`Failed to install latest AWS SDK v3: ${e}`);
        return import(`@aws-sdk/client-${lowerServiceName}`); // Fallback to pre-installed version
      });
    } else if (installedSdk[lowerServiceName]) {
      awsSdk = await import(`/tmp/node_modules/@aws-sdk/client-${lowerServiceName}`);
    } else {
      awsSdk = await import(`@aws-sdk/client-${lowerServiceName}`);
    }
  } catch (error) {
    throw Error(`Service ${serviceName} does not exist in AWS SDK.`);
  }
  return awsSdk;
}

/* eslint-disable @typescript-eslint/no-require-imports, import/no-extraneous-dependencies */
export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent, context: AWSLambda.Context) {
  try {
    event.ResourceProperties.Create = decodeCall(event.ResourceProperties.Create);
    event.ResourceProperties.Update = decodeCall(event.ResourceProperties.Update);
    event.ResourceProperties.Delete = decodeCall(event.ResourceProperties.Delete);
    let data: { [key: string]: string } = {};

    // Default physical resource id
    let physicalResourceId: string;
    switch (event.RequestType) {
      case 'Create':
        physicalResourceId = event.ResourceProperties.Create?.physicalResourceId?.id ??
                             event.ResourceProperties.Update?.physicalResourceId?.id ??
                             event.ResourceProperties.Delete?.physicalResourceId?.id ??
                             event.LogicalResourceId;
        break;
      case 'Update':
      case 'Delete':
        physicalResourceId = event.ResourceProperties[event.RequestType]?.physicalResourceId?.id ?? event.PhysicalResourceId;
        break;
    }
    const call: AwsSdkCall | undefined = event.ResourceProperties[event.RequestType];
    if (call) {
      const awsSdk = await loadAwsSdk(
        call.service,
        event.ResourceProperties.InstallLatestAwsSdk,
      );

      console.log(JSON.stringify({ ...event, ResponseURL: '...' }));

      let credentials;
      if (call.assumedRoleArn) {
        const timestamp = (new Date()).getTime();

        const params = {
          RoleArn: call.assumedRoleArn,
          RoleSessionName: `${timestamp}-${physicalResourceId}`.substring(0, 64),
        };

        const { fromTemporaryCredentials } = await import('@aws-sdk/credential-providers' as string);
        credentials = fromTemporaryCredentials({
          params: params,
        });
      }

      const ServiceClient = Object.entries(awsSdk).find(
        ([name]) => name.toLowerCase() === `${call.service}Client`.toLowerCase(),
      )?.[1] as { new (config: any): any };
      const client = new ServiceClient({
        apiVersion: call.apiVersion,
        credentials: credentials,
        region: call.region,
      });

      const Command = Object.entries(awsSdk).find(
        ([name]) => name.toLowerCase() === `${call.action}Command`.toLowerCase(),
      )?.[1] as { new (input: any): any };

      let flatData: { [key: string]: string } = {};
      try {
        const response = await client.send(
          new Command(
            call.parameters &&
              decodeSpecialValues(call.parameters, physicalResourceId),
          ),
        );
        flatData = {
          apiVersion: client.config.apiVersion, // For test purposes: check if apiVersion was correctly passed.
          region: await client.config.region().catch(() => undefined), // For test purposes: check if region was correctly passed.
          ...flatten(response),
        };

        let outputPaths: string[] | undefined;
        if (call.outputPath) {
          outputPaths = [call.outputPath];
        } else if (call.outputPaths) {
          outputPaths = call.outputPaths;
        }

        if (outputPaths) {
          data = filterKeys(flatData, startsWithOneOf(outputPaths));
        } else {
          data = flatData;
        }
      } catch (e: any) {
        if (!call.ignoreErrorCodesMatching || !new RegExp(call.ignoreErrorCodesMatching).test(e.code)) {
          throw e;
        }
      }

      if (call.physicalResourceId?.responsePath) {
        physicalResourceId = flatData[call.physicalResourceId.responsePath];
      }
    }

    await respond('SUCCESS', 'OK', physicalResourceId, data);
  } catch (e: any) {
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
      Data: data,
    });

    console.log('Responding', responseBody);

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const parsedUrl = require('url').parse(event.ResponseURL);
    const requestOptions = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      method: 'PUT',
      headers: {
        'content-type': '',
        'content-length': Buffer.byteLength(responseBody, 'utf8'),
      },
    };

    return new Promise((resolve, reject) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
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

function decodeCall(call: string | undefined) {
  if (!call) { return undefined; }
  return JSON.parse(call);
}

function startsWithOneOf(searchStrings: string[]): (string: string) => boolean {
  return function(string: string): boolean {
    for (const searchString of searchStrings) {
      if (string.startsWith(searchString)) {
        return true;
      }
    }
    return false;
  };
}
