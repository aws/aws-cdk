/* eslint-disable no-console */
import { execSync } from 'child_process';
import * as fs from 'fs';
import { join } from 'path';
// import the AWSLambda package explicitly,
// which is globally available in the Lambda runtime,
// as otherwise linking this repository with link-all.sh
// fails in the CDK app executed with ts-node
/* eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved */
import * as AWSLambda from 'aws-lambda';
import { AwsSdkCall } from './construct-types';
import { decodeCall, decodeSpecialValues, filterKeys, respond, startsWithOneOf } from './shared';
// eslint-disable-next-line import/no-extraneous-dependencies
import { flatten } from '@aws-cdk/sdk-v2-to-v3-adapter';

let latestSdkInstalled = false;

export function forceSdkInstallation() {
  latestSdkInstalled = false;
}

/**
 * Installs latest AWS SDK v2
 */
function installLatestSdk(): void {
  console.log('Installing latest AWS SDK v2');
  // Both HOME and --prefix are needed here because /tmp is the only writable location
  execSync('HOME=/tmp npm install aws-sdk@2 --production --no-package-lock --no-save --prefix /tmp');
  latestSdkInstalled = true;
}

// no currently patched services
const patchedServices: { serviceName: string; apiVersions: string[] }[] = [];
/**
 * Patches the AWS SDK by loading service models in the same manner as the actual SDK
 */
function patchSdk(awsSdk: any): any {
  const apiLoader = awsSdk.apiLoader;
  patchedServices.forEach(({ serviceName, apiVersions }) => {
    const lowerServiceName = serviceName.toLowerCase();
    if (!awsSdk.Service.hasService(lowerServiceName)) {
      apiLoader.services[lowerServiceName] = {};
      awsSdk[serviceName] = awsSdk.Service.defineService(lowerServiceName, apiVersions);
    } else {
      awsSdk.Service.addVersions(awsSdk[serviceName], apiVersions);
    }
    apiVersions.forEach(apiVersion => {
      Object.defineProperty(apiLoader.services[lowerServiceName], apiVersion, {
        get: function get() {
          const modelFilePrefix = `aws-sdk-patch/${lowerServiceName}-${apiVersion}`;
          const model = JSON.parse(fs.readFileSync(join(__dirname, `${modelFilePrefix}.service.json`), 'utf-8'));
          model.paginators = JSON.parse(fs.readFileSync(join(__dirname, `${modelFilePrefix}.paginators.json`), 'utf-8')).pagination;
          return model;
        },
        enumerable: true,
        configurable: true,
      });
    });
  });
  return awsSdk;
}

/* eslint-disable @typescript-eslint/no-require-imports, import/no-extraneous-dependencies */
export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent, context: AWSLambda.Context) {
  try {
    let AWS: any;
    if (!latestSdkInstalled && event.ResourceProperties.InstallLatestAwsSdk === 'true') {
      try {
        installLatestSdk();
        AWS = require('/tmp/node_modules/aws-sdk');
      } catch (e) {
        console.log(`Failed to install latest AWS SDK v2: ${e}`);
        AWS = require('aws-sdk'); // Fallback to pre-installed version
      }
    } else if (latestSdkInstalled) {
      AWS = require('/tmp/node_modules/aws-sdk');
    } else {
      AWS = require('aws-sdk');
    }
    try {
      AWS = patchSdk(AWS);
    } catch (e) {
      console.log(`Failed to patch AWS SDK: ${e}. Proceeding with the installed copy.`);
    }

    console.log(JSON.stringify({ ...event, ResponseURL: '...' }));
    console.log('AWS SDK VERSION: ' + AWS.VERSION);

    event.ResourceProperties.Create = decodeCall(event.ResourceProperties.Create);
    event.ResourceProperties.Update = decodeCall(event.ResourceProperties.Update);
    event.ResourceProperties.Delete = decodeCall(event.ResourceProperties.Delete);
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

    let flatData: { [key: string]: string } = {};
    let data: { [key: string]: string } = {};
    const call: AwsSdkCall | undefined = event.ResourceProperties[event.RequestType];

    if (call) {

      let credentials;
      if (call.assumedRoleArn) {
        const timestamp = (new Date()).getTime();

        const params = {
          RoleArn: call.assumedRoleArn,
          RoleSessionName: `${timestamp}-${physicalResourceId}`.substring(0, 64),
        };

        credentials = new AWS.ChainableTemporaryCredentials({
          params: params,
          stsConfig: { stsRegionalEndpoints: 'regional' },
        });
      }

      if (!Object.prototype.hasOwnProperty.call(AWS, call.service)) {
        throw Error(`Service ${call.service} does not exist in AWS SDK version ${AWS.VERSION}.`);
      }
      const awsService = new (AWS as any)[call.service]({
        apiVersion: call.apiVersion,
        credentials: credentials,
        region: call.region,
      });

      try {
        const response = await awsService[call.action](
          call.parameters && decodeSpecialValues(call.parameters, physicalResourceId)).promise();
        flatData = {
          apiVersion: awsService.config.apiVersion, // For test purposes: check if apiVersion was correctly passed.
          region: awsService.config.region, // For test purposes: check if region was correctly passed.
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

    await respond(event, 'SUCCESS', 'OK', physicalResourceId, data);
  } catch (e: any) {
    console.log(e);
    await respond(event, 'FAILED', e.message || 'Internal Error', context.logStreamName, {});
  }
}