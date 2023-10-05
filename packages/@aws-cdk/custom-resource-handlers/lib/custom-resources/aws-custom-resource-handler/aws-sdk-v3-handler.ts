/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-console */
import { execSync } from 'child_process';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ApiCall } from '@aws-cdk/sdk-v2-to-v3-adapter';
// import the AWSLambda package explicitly,
// which is globally available in the Lambda runtime,
// as otherwise linking this repository with link-all.sh
// fails in the CDK app executed with ts-node
/* eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved */
import type * as AWSLambda from 'aws-lambda';
import type { AwsSdkCall } from './construct-types';
import { decodeCall, decodeSpecialValues, filterKeys, respond, startsWithOneOf } from './shared';

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
  [key: string]: any
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

        console.log('API response', response);

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

    await respond(event, 'SUCCESS', 'OK', physicalResourceId, data);
  } catch (e: any) {
    console.log(e);
    await respond(event, 'FAILED', e.message || 'Internal Error', context.logStreamName, {});
  }
}
