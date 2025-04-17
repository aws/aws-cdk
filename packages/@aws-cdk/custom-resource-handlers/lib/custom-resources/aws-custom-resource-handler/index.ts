/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { ApiCall } from '@aws-cdk/aws-custom-resource-sdk-adapter';
// import the AWSLambda package explicitly,
// which is globally available in the Lambda runtime,
// as otherwise linking this repository with link-all.sh
// fails in the CDK app executed with ts-node
/* eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved */
import type * as AWSLambda from 'aws-lambda';
import type { AwsSdkCall } from './construct-types';
import { loadAwsSdk } from './load-sdk';
import { decodeCall, decodeSpecialValues, respond, getCredentials, formatData } from './utils';

/* eslint-disable @typescript-eslint/no-require-imports, import/no-extraneous-dependencies */
export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent, context: AWSLambda.Context): Promise<void> {
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

      let awsSdk = await loadAwsSdk(apiCall.v3PackageName, event.ResourceProperties.InstallLatestAwsSdk);

      console.log(JSON.stringify({ ...event, ResponseURL: '...' }));

      const credentials = await getCredentials(call, physicalResourceId);

      const flatData: { [key: string]: string } = {};
      try {
        const response = await apiCall.invoke({
          sdkPackage: awsSdk,
          apiVersion: call.apiVersion,
          credentials,
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

        data = formatData(call, flatData);
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
