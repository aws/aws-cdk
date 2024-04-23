/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-console */
import { execSync } from 'child_process';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ApiCall } from '@aws-cdk/aws-custom-resource-sdk-adapter';
// import the AWSLambda package explicitly,
// which is globally available in the Lambda runtime,
// as otherwise linking this repository with link-all.sh
// fails in the CDK app executed with ts-node
/* eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved */
import type * as AWSLambda from 'aws-lambda';
import type { AwsSdkCall } from './construct-types';

type Event = AWSLambda.CloudFormationCustomResourceEvent;

/**
 * Serialized form of the physical resource id for use in the operation parameters
 */
export const PHYSICAL_RESOURCE_ID_REFERENCE = 'PHYSICAL:RESOURCEID:';

let installedSdk: { [service: string]: boolean } = {};

export function forceSdkInstallation() {
  installedSdk = {};
}

/**
 * Installs latest AWS SDK v3
 */
function installLatestSdk(packageName: string): void {
  console.log(`Installing latest AWS SDK v3: ${packageName}`);
  // Both HOME and --prefix are needed here because /tmp is the only writable location
  execSync(
    `NPM_CONFIG_UPDATE_NOTIFIER=false HOME=/tmp npm install ${JSON.stringify(packageName)} --omit=dev --no-package-lock --no-save --prefix /tmp`,
  );
  installedSdk = {
    ...installedSdk,
    [packageName]: true,
  };
}

interface AwsSdk {
  [key: string]: any;
}

async function loadAwsSdk(
  packageName: string,
  installLatestAwsSdk?: 'true' | 'false',
) {
  let awsSdk: AwsSdk;
  try {
    if (!installedSdk[packageName] && installLatestAwsSdk === 'true') {
      try {
        installLatestSdk(packageName);
        // MUST use require here. Dynamic import() do not support importing from directories
        // esbuild-disable unsupported-require-call -- not esbuildable but that's fine
        awsSdk = require(`/tmp/node_modules/${packageName}`);
      } catch (e) {
        console.log(`Failed to install latest AWS SDK v3. Falling back to pre-installed version. Error: ${e}`);
        // MUST use require as dynamic import() does not support importing from directories
        // esbuild-disable unsupported-require-call -- not esbuildable but that's fine
        return require(packageName); // Fallback to pre-installed version
      }

    } else if (installedSdk[packageName]) {
      // MUST use require here. Dynamic import() do not support importing from directories
      // esbuild-disable unsupported-require-call -- not esbuildable but that's fine
      awsSdk = require(`/tmp/node_modules/${packageName}`);
    } else {
      // esbuild-disable unsupported-require-call -- not esbuildable but that's fine
      awsSdk = require(packageName);
    }
  } catch (error) {
    throw Error(`Package ${packageName} does not exist.`);
  }
  return awsSdk;
}

/**
 * Decodes encoded special values (physicalResourceId)
 */
function decodeSpecialValues(object: object, physicalResourceId: string) {
  return recurse(object);

  function recurse(x: any): any {
    if (x === PHYSICAL_RESOURCE_ID_REFERENCE) {
      return physicalResourceId;
    }
    if (Array.isArray(x)) {
      return x.map(recurse);
    }
    if (x && typeof x === 'object') {
      for (const [key, value] of Object.entries(x)) {
        x[key] = recurse(value);
      }
      return x;
    }
    return x;
  }
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

function respond(event: Event, responseStatus: string, reason: string, physicalResourceId: string, data: any, logApiResponseData: boolean) {
  const responseObject = {
    Status: responseStatus,
    Reason: reason,
    PhysicalResourceId: physicalResourceId,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    NoEcho: false,
    Data: data,
  };

  if (logApiResponseData) {
    console.log('Responding', JSON.stringify(responseObject));
  } else {
    const { Data, ...filteredResponseObject } = responseObject;
    console.log('Responding', JSON.stringify(filteredResponseObject));
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const parsedUrl = require('url').parse(event.ResponseURL);
  const responseBody = JSON.stringify(responseObject);
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
    // if there is a call there will always be logging configured -- otherwise, in the event of no call, logging
    // wasn't configured so just default to existing behavior
    const logApiResponseData = call?.logApiResponseData ?? true;
    if (call) {
      const apiCall = new ApiCall(call.service, call.action);

      let awsSdk: AwsSdk | Promise<AwsSdk> = loadAwsSdk(apiCall.v3PackageName, event.ResourceProperties.InstallLatestAwsSdk);

      console.log(JSON.stringify({ ...event, ResponseURL: '...' }));

      let credentials;
      if (call.assumedRoleArn) {
        const timestamp = (new Date()).getTime();

        const params = {
          RoleArn: call.assumedRoleArn,
          RoleSessionName: `${timestamp}-${physicalResourceId}`.substring(0, 64),
        };

        const { fromTemporaryCredentials } = await import('@aws-sdk/credential-providers');
        credentials = fromTemporaryCredentials({
          params,
          clientConfig: call.region !== undefined ? { region: call.region } : undefined,
        });
      }

      awsSdk = await awsSdk;

      const flatData: { [key: string]: string } = {};
      try {
        const response = await apiCall.invoke({
          sdkPackage: awsSdk,
          apiVersion: call.apiVersion,
          credentials: credentials,
          region: call.region,
          parameters: decodeSpecialValues(call.parameters, physicalResourceId),
          flattenResponse: true,
        });

        if (logApiResponseData) {
          console.log('API response', response);
        }

        flatData.apiVersion = apiCall.client.config.apiVersion; // For test purposes: check if apiVersion was correctly passed.
        flatData.region = await apiCall.client.config.region().catch(() => undefined); // For test purposes: check if region was correctly passed.
        Object.assign(flatData, response);

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
        // empirecal evidence show e.name is not always set
        const exceptionName = e.name ?? e.constructor.name;
        if (!call.ignoreErrorCodesMatching || !new RegExp(call.ignoreErrorCodesMatching).test(exceptionName)) {
          throw e;
        }
      }

      if (call.physicalResourceId?.responsePath) {
        physicalResourceId = flatData[call.physicalResourceId.responsePath];
      }
    }

    await respond(event, 'SUCCESS', 'OK', physicalResourceId, data, logApiResponseData);
  } catch (e: any) {
    console.log(e);
    await respond(event, 'FAILED', e.message || 'Internal Error', context.logStreamName, {}, true);
  }
}
