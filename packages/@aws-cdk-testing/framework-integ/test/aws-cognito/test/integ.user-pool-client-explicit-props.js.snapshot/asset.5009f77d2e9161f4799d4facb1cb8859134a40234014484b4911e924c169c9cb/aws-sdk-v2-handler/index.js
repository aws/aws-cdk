"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.forceSdkInstallation = void 0;
/* eslint-disable no-console */
const child_process_1 = require("child_process");
const fs = require("fs");
const path_1 = require("path");
const shared_1 = require("../shared");
let latestSdkInstalled = false;
function forceSdkInstallation() {
    latestSdkInstalled = false;
}
exports.forceSdkInstallation = forceSdkInstallation;
/**
 * Installs latest AWS SDK v2
 */
function installLatestSdk() {
    console.log('Installing latest AWS SDK v2');
    // Both HOME and --prefix are needed here because /tmp is the only writable location
    (0, child_process_1.execSync)('HOME=/tmp npm install aws-sdk@2 --production --no-package-lock --no-save --prefix /tmp');
    latestSdkInstalled = true;
}
// no currently patched services
const patchedServices = [];
/**
 * Patches the AWS SDK by loading service models in the same manner as the actual SDK
 */
function patchSdk(awsSdk) {
    const apiLoader = awsSdk.apiLoader;
    patchedServices.forEach(({ serviceName, apiVersions }) => {
        const lowerServiceName = serviceName.toLowerCase();
        if (!awsSdk.Service.hasService(lowerServiceName)) {
            apiLoader.services[lowerServiceName] = {};
            awsSdk[serviceName] = awsSdk.Service.defineService(lowerServiceName, apiVersions);
        }
        else {
            awsSdk.Service.addVersions(awsSdk[serviceName], apiVersions);
        }
        apiVersions.forEach(apiVersion => {
            Object.defineProperty(apiLoader.services[lowerServiceName], apiVersion, {
                get: function get() {
                    const modelFilePrefix = `aws-sdk-patch/${lowerServiceName}-${apiVersion}`;
                    const model = JSON.parse(fs.readFileSync((0, path_1.join)(__dirname, `${modelFilePrefix}.service.json`), 'utf-8'));
                    model.paginators = JSON.parse(fs.readFileSync((0, path_1.join)(__dirname, `${modelFilePrefix}.paginators.json`), 'utf-8')).pagination;
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
async function handler(event, context) {
    try {
        let AWS;
        if (!latestSdkInstalled && event.ResourceProperties.InstallLatestAwsSdk === 'true') {
            try {
                installLatestSdk();
                AWS = require('/tmp/node_modules/aws-sdk');
            }
            catch (e) {
                console.log(`Failed to install latest AWS SDK v2: ${e}`);
                AWS = require('aws-sdk'); // Fallback to pre-installed version
            }
        }
        else if (latestSdkInstalled) {
            AWS = require('/tmp/node_modules/aws-sdk');
        }
        else {
            AWS = require('aws-sdk');
        }
        try {
            AWS = patchSdk(AWS);
        }
        catch (e) {
            console.log(`Failed to patch AWS SDK: ${e}. Proceeding with the installed copy.`);
        }
        console.log(JSON.stringify({ ...event, ResponseURL: '...' }));
        console.log('AWS SDK VERSION: ' + AWS.VERSION);
        event.ResourceProperties.Create = (0, shared_1.decodeCall)(event.ResourceProperties.Create);
        event.ResourceProperties.Update = (0, shared_1.decodeCall)(event.ResourceProperties.Update);
        event.ResourceProperties.Delete = (0, shared_1.decodeCall)(event.ResourceProperties.Delete);
        // Default physical resource id
        let physicalResourceId;
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
        let flatData = {};
        let data = {};
        const call = event.ResourceProperties[event.RequestType];
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
            const awsService = new AWS[call.service]({
                apiVersion: call.apiVersion,
                credentials: credentials,
                region: call.region,
            });
            try {
                const response = await awsService[call.action](call.parameters && (0, shared_1.decodeSpecialValues)(call.parameters, physicalResourceId)).promise();
                flatData = {
                    apiVersion: awsService.config.apiVersion,
                    region: awsService.config.region,
                    ...(0, shared_1.flatten)(response),
                };
                let outputPaths;
                if (call.outputPath) {
                    outputPaths = [call.outputPath];
                }
                else if (call.outputPaths) {
                    outputPaths = call.outputPaths;
                }
                if (outputPaths) {
                    data = (0, shared_1.filterKeys)(flatData, (0, shared_1.startsWithOneOf)(outputPaths));
                }
                else {
                    data = flatData;
                }
            }
            catch (e) {
                if (!call.ignoreErrorCodesMatching || !new RegExp(call.ignoreErrorCodesMatching).test(e.code)) {
                    throw e;
                }
            }
            if (call.physicalResourceId?.responsePath) {
                physicalResourceId = flatData[call.physicalResourceId.responsePath];
            }
        }
        await (0, shared_1.respond)(event, 'SUCCESS', 'OK', physicalResourceId, data);
    }
    catch (e) {
        console.log(e);
        await (0, shared_1.respond)(event, 'FAILED', e.message || 'Internal Error', context.logStreamName, {});
    }
}
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBK0I7QUFDL0IsaURBQXlDO0FBQ3pDLHlCQUF5QjtBQUN6QiwrQkFBNEI7QUFRNUIsc0NBQTJHO0FBRTNHLElBQUksa0JBQWtCLEdBQUcsS0FBSyxDQUFDO0FBRS9CLFNBQWdCLG9CQUFvQjtJQUNsQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7QUFDN0IsQ0FBQztBQUZELG9EQUVDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLGdCQUFnQjtJQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUM7SUFDNUMsb0ZBQW9GO0lBQ3BGLElBQUEsd0JBQVEsRUFBQyx3RkFBd0YsQ0FBQyxDQUFDO0lBQ25HLGtCQUFrQixHQUFHLElBQUksQ0FBQztBQUM1QixDQUFDO0FBRUQsZ0NBQWdDO0FBQ2hDLE1BQU0sZUFBZSxHQUFxRCxFQUFFLENBQUM7QUFDN0U7O0dBRUc7QUFDSCxTQUFTLFFBQVEsQ0FBQyxNQUFXO0lBQzNCLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDbkMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsV0FBVyxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUU7UUFDdkQsTUFBTSxnQkFBZ0IsR0FBRyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLEVBQUU7WUFDaEQsU0FBUyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUMxQyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLENBQUM7U0FDbkY7YUFBTTtZQUNMLE1BQU0sQ0FBQyxPQUFPLENBQUMs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LENBQUM7aUJBQ2hDO2dCQUVELElBQUksV0FBVyxFQUFFO29CQUNmLElBQUksR0FBRyxJQUFBLG1CQUFVLEVBQUMsUUFBUSxFQUFFLElBQUEsd0JBQWUsRUFBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2lCQUMzRDtxQkFBTTtvQkFDTCxJQUFJLEdBQUcsUUFBUSxDQUFDO2lCQUNqQjthQUNGO1lBQUMsT0FBTyxDQUFNLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQzdGLE1BQU0sQ0FBQyxDQUFDO2lCQUNUO2FBQ0Y7WUFFRCxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxZQUFZLEVBQUU7Z0JBQ3pDLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDckU7U0FDRjtRQUVELE1BQU0sSUFBQSxnQkFBTyxFQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ2pFO0lBQUMsT0FBTyxDQUFNLEVBQUU7UUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2YsTUFBTSxJQUFBLGdCQUFPLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDMUY7QUFDSCxDQUFDO0FBOUdELDBCQThHQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbmltcG9ydCB7IGV4ZWNTeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XG4vLyBpbXBvcnQgdGhlIEFXU0xhbWJkYSBwYWNrYWdlIGV4cGxpY2l0bHksXG4vLyB3aGljaCBpcyBnbG9iYWxseSBhdmFpbGFibGUgaW4gdGhlIExhbWJkYSBydW50aW1lLFxuLy8gYXMgb3RoZXJ3aXNlIGxpbmtpbmcgdGhpcyByZXBvc2l0b3J5IHdpdGggbGluay1hbGwuc2hcbi8vIGZhaWxzIGluIHRoZSBDREsgYXBwIGV4ZWN1dGVkIHdpdGggdHMtbm9kZVxuLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llcyxpbXBvcnQvbm8tdW5yZXNvbHZlZCAqL1xuaW1wb3J0ICogYXMgQVdTTGFtYmRhIGZyb20gJ2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgQXdzU2RrQ2FsbCB9IGZyb20gJy4uLy4uL2F3cy1jdXN0b20tcmVzb3VyY2UnO1xuaW1wb3J0IHsgZGVjb2RlQ2FsbCwgZGVjb2RlU3BlY2lhbFZhbHVlcywgZmlsdGVyS2V5cywgZmxhdHRlbiwgcmVzcG9uZCwgc3RhcnRzV2l0aE9uZU9mIH0gZnJvbSAnLi4vc2hhcmVkJztcblxubGV0IGxhdGVzdFNka0luc3RhbGxlZCA9IGZhbHNlO1xuXG5leHBvcnQgZnVuY3Rpb24gZm9yY2VTZGtJbnN0YWxsYXRpb24oKSB7XG4gIGxhdGVzdFNka0luc3RhbGxlZCA9IGZhbHNlO1xufVxuXG4vKipcbiAqIEluc3RhbGxzIGxhdGVzdCBBV1MgU0RLIHYyXG4gKi9cbmZ1bmN0aW9uIGluc3RhbGxMYXRlc3RTZGsoKTogdm9pZCB7XG4gIGNvbnNvbGUubG9nKCdJbnN0YWxsaW5nIGxhdGVzdCBBV1MgU0RLIHYyJyk7XG4gIC8vIEJvdGggSE9NRSBhbmQgLS1wcmVmaXggYXJlIG5lZWRlZCBoZXJlIGJlY2F1c2UgL3RtcCBpcyB0aGUgb25seSB3cml0YWJsZSBsb2NhdGlvblxuICBleGVjU3luYygnSE9NRT0vdG1wIG5wbSBpbnN0YWxsIGF3cy1zZGtAMiAtLXByb2R1Y3Rpb24gLS1uby1wYWNrYWdlLWxvY2sgLS1uby1zYXZlIC0tcHJlZml4IC90bXAnKTtcbiAgbGF0ZXN0U2RrSW5zdGFsbGVkID0gdHJ1ZTtcbn1cblxuLy8gbm8gY3VycmVudGx5IHBhdGNoZWQgc2VydmljZXNcbmNvbnN0IHBhdGNoZWRTZXJ2aWNlczogeyBzZXJ2aWNlTmFtZTogc3RyaW5nOyBhcGlWZXJzaW9uczogc3RyaW5nW10gfVtdID0gW107XG4vKipcbiAqIFBhdGNoZXMgdGhlIEFXUyBTREsgYnkgbG9hZGluZyBzZXJ2aWNlIG1vZGVscyBpbiB0aGUgc2FtZSBtYW5uZXIgYXMgdGhlIGFjdHVhbCBTREtcbiAqL1xuZnVuY3Rpb24gcGF0Y2hTZGsoYXdzU2RrOiBhbnkpOiBhbnkge1xuICBjb25zdCBhcGlMb2FkZXIgPSBhd3NTZGsuYXBpTG9hZGVyO1xuICBwYXRjaGVkU2VydmljZXMuZm9yRWFjaCgoeyBzZXJ2aWNlTmFtZSwgYXBpVmVyc2lvbnMgfSkgPT4ge1xuICAgIGNvbnN0IGxvd2VyU2VydmljZU5hbWUgPSBzZXJ2aWNlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGlmICghYXdzU2RrLlNlcnZpY2UuaGFzU2VydmljZShsb3dlclNlcnZpY2VOYW1lKSkge1xuICAgICAgYXBpTG9hZGVyLnNlcnZpY2VzW2xvd2VyU2VydmljZU5hbWVdID0ge307XG4gICAgICBhd3NTZGtbc2VydmljZU5hbWVdID0gYXdzU2RrLlNlcnZpY2UuZGVmaW5lU2VydmljZShsb3dlclNlcnZpY2VOYW1lLCBhcGlWZXJzaW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3c1Nkay5TZXJ2aWNlLmFkZFZlcnNpb25zKGF3c1Nka1tzZXJ2aWNlTmFtZV0sIGFwaVZlcnNpb25zKTtcbiAgICB9XG4gICAgYXBpVmVyc2lvbnMuZm9yRWFjaChhcGlWZXJzaW9uID0+IHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShhcGlMb2FkZXIuc2VydmljZXNbbG93ZXJTZXJ2aWNlTmFtZV0sIGFwaVZlcnNpb24sIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgY29uc3QgbW9kZWxGaWxlUHJlZml4ID0gYGF3cy1zZGstcGF0Y2gvJHtsb3dlclNlcnZpY2VOYW1lfS0ke2FwaVZlcnNpb259YDtcbiAgICAgICAgICBjb25zdCBtb2RlbCA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGpvaW4oX19kaXJuYW1lLCBgJHttb2RlbEZpbGVQcmVmaXh9LnNlcnZpY2UuanNvbmApLCAndXRmLTgnKSk7XG4gICAgICAgICAgbW9kZWwucGFnaW5hdG9ycyA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGpvaW4oX19kaXJuYW1lLCBgJHttb2RlbEZpbGVQcmVmaXh9LnBhZ2luYXRvcnMuanNvbmApLCAndXRmLTgnKSkucGFnaW5hdGlvbjtcbiAgICAgICAgICByZXR1cm4gbW9kZWw7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbiAgcmV0dXJuIGF3c1Nkaztcbn1cblxuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0cywgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCwgY29udGV4dDogQVdTTGFtYmRhLkNvbnRleHQpIHtcbiAgdHJ5IHtcbiAgICBsZXQgQVdTOiBhbnk7XG4gICAgaWYgKCFsYXRlc3RTZGtJbnN0YWxsZWQgJiYgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkluc3RhbGxMYXRlc3RBd3NTZGsgPT09ICd0cnVlJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaW5zdGFsbExhdGVzdFNkaygpO1xuICAgICAgICBBV1MgPSByZXF1aXJlKCcvdG1wL25vZGVfbW9kdWxlcy9hd3Mtc2RrJyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBGYWlsZWQgdG8gaW5zdGFsbCBsYXRlc3QgQVdTIFNESyB2MjogJHtlfWApO1xuICAgICAgICBBV1MgPSByZXF1aXJlKCdhd3Mtc2RrJyk7IC8vIEZhbGxiYWNrIHRvIHByZS1pbnN0YWxsZWQgdmVyc2lvblxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobGF0ZXN0U2RrSW5zdGFsbGVkKSB7XG4gICAgICBBV1MgPSByZXF1aXJlKCcvdG1wL25vZGVfbW9kdWxlcy9hd3Mtc2RrJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIEFXUyA9IHJlcXVpcmUoJ2F3cy1zZGsnKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIEFXUyA9IHBhdGNoU2RrKEFXUyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coYEZhaWxlZCB0byBwYXRjaCBBV1MgU0RLOiAke2V9LiBQcm9jZWVkaW5nIHdpdGggdGhlIGluc3RhbGxlZCBjb3B5LmApO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHsgLi4uZXZlbnQsIFJlc3BvbnNlVVJMOiAnLi4uJyB9KSk7XG4gICAgY29uc29sZS5sb2coJ0FXUyBTREsgVkVSU0lPTjogJyArIEFXUy5WRVJTSU9OKTtcblxuICAgIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5DcmVhdGUgPSBkZWNvZGVDYWxsKGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5DcmVhdGUpO1xuICAgIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5VcGRhdGUgPSBkZWNvZGVDYWxsKGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5VcGRhdGUpO1xuICAgIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EZWxldGUgPSBkZWNvZGVDYWxsKGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EZWxldGUpO1xuICAgIC8vIERlZmF1bHQgcGh5c2ljYWwgcmVzb3VyY2UgaWRcbiAgICBsZXQgcGh5c2ljYWxSZXNvdXJjZUlkOiBzdHJpbmc7XG4gICAgc3dpdGNoIChldmVudC5SZXF1ZXN0VHlwZSkge1xuICAgICAgY2FzZSAnQ3JlYXRlJzpcbiAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkNyZWF0ZT8ucGh5c2ljYWxSZXNvdXJjZUlkPy5pZCA/P1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuVXBkYXRlPy5waHlzaWNhbFJlc291cmNlSWQ/LmlkID8/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EZWxldGU/LnBoeXNpY2FsUmVzb3VyY2VJZD8uaWQgPz9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuTG9naWNhbFJlc291cmNlSWQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnVXBkYXRlJzpcbiAgICAgIGNhc2UgJ0RlbGV0ZSc6XG4gICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZCA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllc1tldmVudC5SZXF1ZXN0VHlwZV0/LnBoeXNpY2FsUmVzb3VyY2VJZD8uaWQgPz8gZXZlbnQuUGh5c2ljYWxSZXNvdXJjZUlkO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBsZXQgZmxhdERhdGE6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcbiAgICBsZXQgZGF0YTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICAgIGNvbnN0IGNhbGw6IEF3c1Nka0NhbGwgfCB1bmRlZmluZWQgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXNbZXZlbnQuUmVxdWVzdFR5cGVdO1xuXG4gICAgaWYgKGNhbGwpIHtcblxuICAgICAgbGV0IGNyZWRlbnRpYWxzO1xuICAgICAgaWYgKGNhbGwuYXNzdW1lZFJvbGVBcm4pIHtcbiAgICAgICAgY29uc3QgdGltZXN0YW1wID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcblxuICAgICAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgICAgUm9sZUFybjogY2FsbC5hc3N1bWVkUm9sZUFybixcbiAgICAgICAgICBSb2xlU2Vzc2lvbk5hbWU6IGAke3RpbWVzdGFtcH0tJHtwaHlzaWNhbFJlc291cmNlSWR9YC5zdWJzdHJpbmcoMCwgNjQpLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNyZWRlbnRpYWxzID0gbmV3IEFXUy5DaGFpbmFibGVUZW1wb3JhcnlDcmVkZW50aWFscyh7XG4gICAgICAgICAgcGFyYW1zOiBwYXJhbXMsXG4gICAgICAgICAgc3RzQ29uZmlnOiB7IHN0c1JlZ2lvbmFsRW5kcG9pbnRzOiAncmVnaW9uYWwnIH0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChBV1MsIGNhbGwuc2VydmljZSkpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoYFNlcnZpY2UgJHtjYWxsLnNlcnZpY2V9IGRvZXMgbm90IGV4aXN0IGluIEFXUyBTREsgdmVyc2lvbiAke0FXUy5WRVJTSU9OfS5gKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGF3c1NlcnZpY2UgPSBuZXcgKEFXUyBhcyBhbnkpW2NhbGwuc2VydmljZV0oe1xuICAgICAgICBhcGlWZXJzaW9uOiBjYWxsLmFwaVZlcnNpb24sXG4gICAgICAgIGNyZWRlbnRpYWxzOiBjcmVkZW50aWFscyxcbiAgICAgICAgcmVnaW9uOiBjYWxsLnJlZ2lvbixcbiAgICAgIH0pO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGF3c1NlcnZpY2VbY2FsbC5hY3Rpb25dKFxuICAgICAgICAgIGNhbGwucGFyYW1ldGVycyAmJiBkZWNvZGVTcGVjaWFsVmFsdWVzKGNhbGwucGFyYW1ldGVycywgcGh5c2ljYWxSZXNvdXJjZUlkKSkucHJvbWlzZSgpO1xuICAgICAgICBmbGF0RGF0YSA9IHtcbiAgICAgICAgICBhcGlWZXJzaW9uOiBhd3NTZXJ2aWNlLmNvbmZpZy5hcGlWZXJzaW9uLCAvLyBGb3IgdGVzdCBwdXJwb3NlczogY2hlY2sgaWYgYXBpVmVyc2lvbiB3YXMgY29ycmVjdGx5IHBhc3NlZC5cbiAgICAgICAgICByZWdpb246IGF3c1NlcnZpY2UuY29uZmlnLnJlZ2lvbiwgLy8gRm9yIHRlc3QgcHVycG9zZXM6IGNoZWNrIGlmIHJlZ2lvbiB3YXMgY29ycmVjdGx5IHBhc3NlZC5cbiAgICAgICAgICAuLi5mbGF0dGVuKHJlc3BvbnNlKSxcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgb3V0cHV0UGF0aHM6IHN0cmluZ1tdIHwgdW5kZWZpbmVkO1xuICAgICAgICBpZiAoY2FsbC5vdXRwdXRQYXRoKSB7XG4gICAgICAgICAgb3V0cHV0UGF0aHMgPSBbY2FsbC5vdXRwdXRQYXRoXTtcbiAgICAgICAgfSBlbHNlIGlmIChjYWxsLm91dHB1dFBhdGhzKSB7XG4gICAgICAgICAgb3V0cHV0UGF0aHMgPSBjYWxsLm91dHB1dFBhdGhzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG91dHB1dFBhdGhzKSB7XG4gICAgICAgICAgZGF0YSA9IGZpbHRlcktleXMoZmxhdERhdGEsIHN0YXJ0c1dpdGhPbmVPZihvdXRwdXRQYXRocykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRhdGEgPSBmbGF0RGF0YTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIGlmICghY2FsbC5pZ25vcmVFcnJvckNvZGVzTWF0Y2hpbmcgfHwgIW5ldyBSZWdFeHAoY2FsbC5pZ25vcmVFcnJvckNvZGVzTWF0Y2hpbmcpLnRlc3QoZS5jb2RlKSkge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGNhbGwucGh5c2ljYWxSZXNvdXJjZUlkPy5yZXNwb25zZVBhdGgpIHtcbiAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkID0gZmxhdERhdGFbY2FsbC5waHlzaWNhbFJlc291cmNlSWQucmVzcG9uc2VQYXRoXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCByZXNwb25kKGV2ZW50LCAnU1VDQ0VTUycsICdPSycsIHBoeXNpY2FsUmVzb3VyY2VJZCwgZGF0YSk7XG4gIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgIGNvbnNvbGUubG9nKGUpO1xuICAgIGF3YWl0IHJlc3BvbmQoZXZlbnQsICdGQUlMRUQnLCBlLm1lc3NhZ2UgfHwgJ0ludGVybmFsIEVycm9yJywgY29udGV4dC5sb2dTdHJlYW1OYW1lLCB7fSk7XG4gIH1cbn0iXX0=