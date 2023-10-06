/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-console */
import { execSync } from 'child_process';
// eslint-disable-next-line import/no-extraneous-dependencies
import { findV3ClientConstructor, getV3ClientPackageName } from '@aws-cdk/sdk-v2-to-v3-adapter';
// import the AWSLambda package explicitly,
// which is globally available in the Lambda runtime,
// as otherwise linking this repository with link-all.sh
// fails in the CDK app executed with ts-node
/* eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved */
import type * as AWSLambda from 'aws-lambda';
import { decodeCall, decodeSpecialValues, filterKeys, flatten, respond, startsWithOneOf } from './shared';
import type { AwsSdkCall } from '../aws-custom-resource';

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
    `NPM_CONFIG_UPDATE_NOTIFIER=false HOME=/tmp npm install ${packageName} --omit=dev --no-package-lock --no-save --prefix /tmp`,
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
        awsSdk = require(`/tmp/node_modules/${packageName}`);
      } catch (e) {
        console.log(`Failed to install latest AWS SDK v3. Falling back to pre-installed version. Error: ${e}`);
        // MUST use require as dynamic import() does not support importing from directories
        return require(packageName); // Fallback to pre-installed version
      }

    } else if (installedSdk[packageName]) {
      // MUST use require here. Dynamic import() do not support importing from directories
      awsSdk = require(`/tmp/node_modules/${packageName}`);
    } else {
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
      // when provide v2 service name, transform it v3 package name.
      const packageName = call.service.startsWith('@aws-sdk/') ? call.service : getV3ClientPackageName(call.service);
      let awsSdk: AwsSdk | Promise<AwsSdk> = loadAwsSdk(
        packageName,
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
          params,
          clientConfig: call.region !== undefined ? { region: call.region } : undefined,
        });
      }

      awsSdk = await awsSdk;
      const ServiceClient = findV3ClientConstructor(awsSdk);

      const client = new ServiceClient({
        apiVersion: call.apiVersion,
        credentials: credentials,
        region: call.region,
      });
      const commandName = call.action.endsWith('Command') ? call.action : `${call.action}Command`;
      const Command = Object.entries(awsSdk).find(
        ([name]) => name.toLowerCase() === commandName.toLowerCase(),
      )?.[1] as { new (input: any): any };

      let flatData: { [key: string]: string } = {};
      try {
        // Command must pass input value https://github.com/aws/aws-sdk-js-v3/issues/424
        const response = await client.send(
          new Command(
            (call.parameters &&
            decodeSpecialValues(call.parameters, physicalResourceId)) ?? {},
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
