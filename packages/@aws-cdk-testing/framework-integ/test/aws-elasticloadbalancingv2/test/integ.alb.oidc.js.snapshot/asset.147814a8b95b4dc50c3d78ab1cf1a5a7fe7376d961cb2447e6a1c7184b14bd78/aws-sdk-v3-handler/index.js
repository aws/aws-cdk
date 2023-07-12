"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.forceSdkInstallation = void 0;
/* eslint-disable no-console */
const child_process_1 = require("child_process");
const find_client_constructor_1 = require("./v2-to-v3/find-client-constructor");
const get_v3_client_package_name_1 = require("./v2-to-v3/get-v3-client-package-name");
const shared_1 = require("../shared");
let installedSdk = {};
function forceSdkInstallation() {
    installedSdk = {};
}
exports.forceSdkInstallation = forceSdkInstallation;
/**
 * Installs latest AWS SDK v3
 */
function installLatestSdk(packageName) {
    console.log('Installing latest AWS SDK v3');
    // Both HOME and --prefix are needed here because /tmp is the only writable location
    (0, child_process_1.execSync)(`HOME=/tmp npm install ${packageName} --omit=dev --no-package-lock --no-save --prefix /tmp`);
    installedSdk = {
        ...installedSdk,
        [packageName]: true,
    };
}
async function loadAwsSdk(packageName, installLatestAwsSdk) {
    let awsSdk;
    try {
        if (!installedSdk[packageName] && installLatestAwsSdk === 'true') {
            installLatestSdk(packageName);
            awsSdk = await Promise.resolve(`${`/tmp/node_modules/${packageName}`}`).then(s => require(s)).catch(async (e) => {
                console.log(`Failed to install latest AWS SDK v3: ${e}`);
                return Promise.resolve(`${packageName}`).then(s => require(s)); // Fallback to pre-installed version
            });
        }
        else if (installedSdk[packageName]) {
            awsSdk = await Promise.resolve(`${`/tmp/node_modules/${packageName}`}`).then(s => require(s));
        }
        else {
            awsSdk = await Promise.resolve(`${packageName}`).then(s => require(s));
        }
    }
    catch (error) {
        throw Error(`Package ${packageName} does not exist.`);
    }
    return awsSdk;
}
/* eslint-disable @typescript-eslint/no-require-imports, import/no-extraneous-dependencies */
async function handler(event, context) {
    try {
        event.ResourceProperties.Create = (0, shared_1.decodeCall)(event.ResourceProperties.Create);
        event.ResourceProperties.Update = (0, shared_1.decodeCall)(event.ResourceProperties.Update);
        event.ResourceProperties.Delete = (0, shared_1.decodeCall)(event.ResourceProperties.Delete);
        let data = {};
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
        const call = event.ResourceProperties[event.RequestType];
        if (call) {
            // when provide v2 service name, transform it v3 package name.
            const packageName = call.service.startsWith('@aws-sdk/') ? call.service : (0, get_v3_client_package_name_1.getV3ClientPackageName)(call.service);
            let awsSdk = loadAwsSdk(packageName, event.ResourceProperties.InstallLatestAwsSdk);
            console.log(JSON.stringify({ ...event, ResponseURL: '...' }));
            let credentials;
            if (call.assumedRoleArn) {
                const timestamp = (new Date()).getTime();
                const params = {
                    RoleArn: call.assumedRoleArn,
                    RoleSessionName: `${timestamp}-${physicalResourceId}`.substring(0, 64),
                };
                const { fromTemporaryCredentials } = await Promise.resolve(`${'@aws-sdk/credential-providers'}`).then(s => require(s));
                credentials = fromTemporaryCredentials({
                    params,
                });
            }
            awsSdk = await awsSdk;
            const ServiceClient = (0, find_client_constructor_1.findV3ClientConstructor)(awsSdk);
            const client = new ServiceClient({
                apiVersion: call.apiVersion,
                credentials: credentials,
                region: call.region,
            });
            const commandName = call.action.endsWith('Command') ? call.action : `${call.action}Command`;
            const Command = Object.entries(awsSdk).find(([name]) => name.toLowerCase() === commandName.toLowerCase())?.[1];
            let flatData = {};
            try {
                // Command must pass input value https://github.com/aws/aws-sdk-js-v3/issues/424
                const response = await client.send(new Command((call.parameters &&
                    (0, shared_1.decodeSpecialValues)(call.parameters, physicalResourceId)) ?? {}));
                flatData = {
                    apiVersion: client.config.apiVersion,
                    region: await client.config.region().catch(() => undefined),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBK0I7QUFDL0IsaURBQXlDO0FBT3pDLGdGQUE2RTtBQUM3RSxzRkFBK0U7QUFFL0Usc0NBQTJHO0FBRTNHLElBQUksWUFBWSxHQUFtQyxFQUFFLENBQUM7QUFFdEQsU0FBZ0Isb0JBQW9CO0lBQ2xDLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDcEIsQ0FBQztBQUZELG9EQUVDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLGdCQUFnQixDQUFDLFdBQW1CO0lBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUM1QyxvRkFBb0Y7SUFDcEYsSUFBQSx3QkFBUSxFQUNOLHlCQUF5QixXQUFXLHVEQUF1RCxDQUM1RixDQUFDO0lBQ0YsWUFBWSxHQUFHO1FBQ2IsR0FBRyxZQUFZO1FBQ2YsQ0FBQyxXQUFXLENBQUMsRUFBRSxJQUFJO0tBQ3BCLENBQUM7QUFDSixDQUFDO0FBS0QsS0FBSyxVQUFVLFVBQVUsQ0FDdkIsV0FBbUIsRUFDbkIsbUJBQXNDO0lBRXRDLElBQUksTUFBYyxDQUFDO0lBQ25CLElBQUk7UUFDRixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLG1CQUFtQixLQUFLLE1BQU0sRUFBRTtZQUNoRSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUM5QixNQUFNLEdBQUcsTUFBTSxtQkFBTyxxQkFBcUIsV0FBVyxFQUFFLDBCQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3pELDBCQUFjLFdBQVcsMEJBQUUsQ0FBQyxvQ0FBb0M7WUFDbEUsQ0FBQyxDQUFDLENBQUM7U0FDSjthQUFNLElBQUksWUFBWSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQ3BD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SUFBQSxnQkFBTyxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQzFGO0FBQ0gsQ0FBQztBQXZHRCwwQkF1R0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5pbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuLy8gaW1wb3J0IHRoZSBBV1NMYW1iZGEgcGFja2FnZSBleHBsaWNpdGx5LFxuLy8gd2hpY2ggaXMgZ2xvYmFsbHkgYXZhaWxhYmxlIGluIHRoZSBMYW1iZGEgcnVudGltZSxcbi8vIGFzIG90aGVyd2lzZSBsaW5raW5nIHRoaXMgcmVwb3NpdG9yeSB3aXRoIGxpbmstYWxsLnNoXG4vLyBmYWlscyBpbiB0aGUgQ0RLIGFwcCBleGVjdXRlZCB3aXRoIHRzLW5vZGVcbi8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMsaW1wb3J0L25vLXVucmVzb2x2ZWQgKi9cbmltcG9ydCAqIGFzIEFXU0xhbWJkYSBmcm9tICdhd3MtbGFtYmRhJztcbmltcG9ydCB7IGZpbmRWM0NsaWVudENvbnN0cnVjdG9yIH0gZnJvbSAnLi92Mi10by12My9maW5kLWNsaWVudC1jb25zdHJ1Y3Rvcic7XG5pbXBvcnQgeyBnZXRWM0NsaWVudFBhY2thZ2VOYW1lIH0gZnJvbSAnLi92Mi10by12My9nZXQtdjMtY2xpZW50LXBhY2thZ2UtbmFtZSc7XG5pbXBvcnQgeyBBd3NTZGtDYWxsIH0gZnJvbSAnLi4vLi4vYXdzLWN1c3RvbS1yZXNvdXJjZSc7XG5pbXBvcnQgeyBkZWNvZGVDYWxsLCBkZWNvZGVTcGVjaWFsVmFsdWVzLCBmaWx0ZXJLZXlzLCBmbGF0dGVuLCByZXNwb25kLCBzdGFydHNXaXRoT25lT2YgfSBmcm9tICcuLi9zaGFyZWQnO1xuXG5sZXQgaW5zdGFsbGVkU2RrOiB7IFtzZXJ2aWNlOiBzdHJpbmddOiBib29sZWFuIH0gPSB7fTtcblxuZXhwb3J0IGZ1bmN0aW9uIGZvcmNlU2RrSW5zdGFsbGF0aW9uKCkge1xuICBpbnN0YWxsZWRTZGsgPSB7fTtcbn1cblxuLyoqXG4gKiBJbnN0YWxscyBsYXRlc3QgQVdTIFNESyB2M1xuICovXG5mdW5jdGlvbiBpbnN0YWxsTGF0ZXN0U2RrKHBhY2thZ2VOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgY29uc29sZS5sb2coJ0luc3RhbGxpbmcgbGF0ZXN0IEFXUyBTREsgdjMnKTtcbiAgLy8gQm90aCBIT01FIGFuZCAtLXByZWZpeCBhcmUgbmVlZGVkIGhlcmUgYmVjYXVzZSAvdG1wIGlzIHRoZSBvbmx5IHdyaXRhYmxlIGxvY2F0aW9uXG4gIGV4ZWNTeW5jKFxuICAgIGBIT01FPS90bXAgbnBtIGluc3RhbGwgJHtwYWNrYWdlTmFtZX0gLS1vbWl0PWRldiAtLW5vLXBhY2thZ2UtbG9jayAtLW5vLXNhdmUgLS1wcmVmaXggL3RtcGAsXG4gICk7XG4gIGluc3RhbGxlZFNkayA9IHtcbiAgICAuLi5pbnN0YWxsZWRTZGssXG4gICAgW3BhY2thZ2VOYW1lXTogdHJ1ZSxcbiAgfTtcbn1cblxuaW50ZXJmYWNlIEF3c1NkayB7XG4gIFtrZXk6IHN0cmluZ106IGFueVxufVxuYXN5bmMgZnVuY3Rpb24gbG9hZEF3c1NkayhcbiAgcGFja2FnZU5hbWU6IHN0cmluZyxcbiAgaW5zdGFsbExhdGVzdEF3c1Nkaz86ICd0cnVlJyB8ICdmYWxzZScsXG4pIHtcbiAgbGV0IGF3c1NkazogQXdzU2RrO1xuICB0cnkge1xuICAgIGlmICghaW5zdGFsbGVkU2RrW3BhY2thZ2VOYW1lXSAmJiBpbnN0YWxsTGF0ZXN0QXdzU2RrID09PSAndHJ1ZScpIHtcbiAgICAgIGluc3RhbGxMYXRlc3RTZGsocGFja2FnZU5hbWUpO1xuICAgICAgYXdzU2RrID0gYXdhaXQgaW1wb3J0KGAvdG1wL25vZGVfbW9kdWxlcy8ke3BhY2thZ2VOYW1lfWApLmNhdGNoKGFzeW5jIChlKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBGYWlsZWQgdG8gaW5zdGFsbCBsYXRlc3QgQVdTIFNESyB2MzogJHtlfWApO1xuICAgICAgICByZXR1cm4gaW1wb3J0KHBhY2thZ2VOYW1lKTsgLy8gRmFsbGJhY2sgdG8gcHJlLWluc3RhbGxlZCB2ZXJzaW9uXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGluc3RhbGxlZFNka1twYWNrYWdlTmFtZV0pIHtcbiAgICAgIGF3c1NkayA9IGF3YWl0IGltcG9ydChgL3RtcC9ub2RlX21vZHVsZXMvJHtwYWNrYWdlTmFtZX1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdzU2RrID0gYXdhaXQgaW1wb3J0KHBhY2thZ2VOYW1lKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhyb3cgRXJyb3IoYFBhY2thZ2UgJHtwYWNrYWdlTmFtZX0gZG9lcyBub3QgZXhpc3QuYCk7XG4gIH1cbiAgcmV0dXJuIGF3c1Nkaztcbn1cblxuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0cywgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCwgY29udGV4dDogQVdTTGFtYmRhLkNvbnRleHQpIHtcbiAgdHJ5IHtcbiAgICBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ3JlYXRlID0gZGVjb2RlQ2FsbChldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ3JlYXRlKTtcbiAgICBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuVXBkYXRlID0gZGVjb2RlQ2FsbChldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuVXBkYXRlKTtcbiAgICBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuRGVsZXRlID0gZGVjb2RlQ2FsbChldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuRGVsZXRlKTtcbiAgICBsZXQgZGF0YTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuXG4gICAgLy8gRGVmYXVsdCBwaHlzaWNhbCByZXNvdXJjZSBpZFxuICAgIGxldCBwaHlzaWNhbFJlc291cmNlSWQ6IHN0cmluZztcbiAgICBzd2l0Y2ggKGV2ZW50LlJlcXVlc3RUeXBlKSB7XG4gICAgICBjYXNlICdDcmVhdGUnOlxuICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ3JlYXRlPy5waHlzaWNhbFJlc291cmNlSWQ/LmlkID8/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5VcGRhdGU/LnBoeXNpY2FsUmVzb3VyY2VJZD8uaWQgPz9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRlbGV0ZT8ucGh5c2ljYWxSZXNvdXJjZUlkPy5pZCA/P1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5Mb2dpY2FsUmVzb3VyY2VJZDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdVcGRhdGUnOlxuICAgICAgY2FzZSAnRGVsZXRlJzpcbiAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzW2V2ZW50LlJlcXVlc3RUeXBlXT8ucGh5c2ljYWxSZXNvdXJjZUlkPy5pZCA/PyBldmVudC5QaHlzaWNhbFJlc291cmNlSWQ7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjb25zdCBjYWxsOiBBd3NTZGtDYWxsIHwgdW5kZWZpbmVkID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzW2V2ZW50LlJlcXVlc3RUeXBlXTtcbiAgICBpZiAoY2FsbCkge1xuICAgICAgLy8gd2hlbiBwcm92aWRlIHYyIHNlcnZpY2UgbmFtZSwgdHJhbnNmb3JtIGl0IHYzIHBhY2thZ2UgbmFtZS5cbiAgICAgIGNvbnN0IHBhY2thZ2VOYW1lID0gY2FsbC5zZXJ2aWNlLnN0YXJ0c1dpdGgoJ0Bhd3Mtc2RrLycpID8gY2FsbC5zZXJ2aWNlIDogZ2V0VjNDbGllbnRQYWNrYWdlTmFtZShjYWxsLnNlcnZpY2UpO1xuICAgICAgbGV0IGF3c1NkazogQXdzU2RrIHwgUHJvbWlzZTxBd3NTZGs+ID0gbG9hZEF3c1NkayhcbiAgICAgICAgcGFja2FnZU5hbWUsXG4gICAgICAgIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5JbnN0YWxsTGF0ZXN0QXdzU2RrLFxuICAgICAgKTtcblxuICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoeyAuLi5ldmVudCwgUmVzcG9uc2VVUkw6ICcuLi4nIH0pKTtcblxuICAgICAgbGV0IGNyZWRlbnRpYWxzO1xuICAgICAgaWYgKGNhbGwuYXNzdW1lZFJvbGVBcm4pIHtcbiAgICAgICAgY29uc3QgdGltZXN0YW1wID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcblxuICAgICAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgICAgUm9sZUFybjogY2FsbC5hc3N1bWVkUm9sZUFybixcbiAgICAgICAgICBSb2xlU2Vzc2lvbk5hbWU6IGAke3RpbWVzdGFtcH0tJHtwaHlzaWNhbFJlc291cmNlSWR9YC5zdWJzdHJpbmcoMCwgNjQpLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHsgZnJvbVRlbXBvcmFyeUNyZWRlbnRpYWxzIH0gPSBhd2FpdCBpbXBvcnQoJ0Bhd3Mtc2RrL2NyZWRlbnRpYWwtcHJvdmlkZXJzJyBhcyBzdHJpbmcpO1xuICAgICAgICBjcmVkZW50aWFscyA9IGZyb21UZW1wb3JhcnlDcmVkZW50aWFscyh7XG4gICAgICAgICAgcGFyYW1zLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgYXdzU2RrID0gYXdhaXQgYXdzU2RrO1xuICAgICAgY29uc3QgU2VydmljZUNsaWVudCA9IGZpbmRWM0NsaWVudENvbnN0cnVjdG9yKGF3c1Nkayk7XG5cbiAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBTZXJ2aWNlQ2xpZW50KHtcbiAgICAgICAgYXBpVmVyc2lvbjogY2FsbC5hcGlWZXJzaW9uLFxuICAgICAgICBjcmVkZW50aWFsczogY3JlZGVudGlhbHMsXG4gICAgICAgIHJlZ2lvbjogY2FsbC5yZWdpb24sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGNvbW1hbmROYW1lID0gY2FsbC5hY3Rpb24uZW5kc1dpdGgoJ0NvbW1hbmQnKSA/IGNhbGwuYWN0aW9uIDogYCR7Y2FsbC5hY3Rpb259Q29tbWFuZGA7XG4gICAgICBjb25zdCBDb21tYW5kID0gT2JqZWN0LmVudHJpZXMoYXdzU2RrKS5maW5kKFxuICAgICAgICAoW25hbWVdKSA9PiBuYW1lLnRvTG93ZXJDYXNlKCkgPT09IGNvbW1hbmROYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICApPy5bMV0gYXMgeyBuZXcgKGlucHV0OiBhbnkpOiBhbnkgfTtcblxuICAgICAgbGV0IGZsYXREYXRhOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG4gICAgICB0cnkge1xuICAgICAgICAvLyBDb21tYW5kIG11c3QgcGFzcyBpbnB1dCB2YWx1ZSBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1zZGstanMtdjMvaXNzdWVzLzQyNFxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGNsaWVudC5zZW5kKFxuICAgICAgICAgIG5ldyBDb21tYW5kKFxuICAgICAgICAgICAgKGNhbGwucGFyYW1ldGVycyAmJlxuICAgICAgICAgICAgZGVjb2RlU3BlY2lhbFZhbHVlcyhjYWxsLnBhcmFtZXRlcnMsIHBoeXNpY2FsUmVzb3VyY2VJZCkpID8/IHt9LFxuICAgICAgICAgICksXG4gICAgICAgICk7XG4gICAgICAgIGZsYXREYXRhID0ge1xuICAgICAgICAgIGFwaVZlcnNpb246IGNsaWVudC5jb25maWcuYXBpVmVyc2lvbiwgLy8gRm9yIHRlc3QgcHVycG9zZXM6IGNoZWNrIGlmIGFwaVZlcnNpb24gd2FzIGNvcnJlY3RseSBwYXNzZWQuXG4gICAgICAgICAgcmVnaW9uOiBhd2FpdCBjbGllbnQuY29uZmlnLnJlZ2lvbigpLmNhdGNoKCgpID0+IHVuZGVmaW5lZCksIC8vIEZvciB0ZXN0IHB1cnBvc2VzOiBjaGVjayBpZiByZWdpb24gd2FzIGNvcnJlY3RseSBwYXNzZWQuXG4gICAgICAgICAgLi4uZmxhdHRlbihyZXNwb25zZSksXG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IG91dHB1dFBhdGhzOiBzdHJpbmdbXSB8IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKGNhbGwub3V0cHV0UGF0aCkge1xuICAgICAgICAgIG91dHB1dFBhdGhzID0gW2NhbGwub3V0cHV0UGF0aF07XG4gICAgICAgIH0gZWxzZSBpZiAoY2FsbC5vdXRwdXRQYXRocykge1xuICAgICAgICAgIG91dHB1dFBhdGhzID0gY2FsbC5vdXRwdXRQYXRocztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvdXRwdXRQYXRocykge1xuICAgICAgICAgIGRhdGEgPSBmaWx0ZXJLZXlzKGZsYXREYXRhLCBzdGFydHNXaXRoT25lT2Yob3V0cHV0UGF0aHMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkYXRhID0gZmxhdERhdGE7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBpZiAoIWNhbGwuaWdub3JlRXJyb3JDb2Rlc01hdGNoaW5nIHx8ICFuZXcgUmVnRXhwKGNhbGwuaWdub3JlRXJyb3JDb2Rlc01hdGNoaW5nKS50ZXN0KGUuY29kZSkpIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjYWxsLnBoeXNpY2FsUmVzb3VyY2VJZD8ucmVzcG9uc2VQYXRoKSB7XG4gICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZCA9IGZsYXREYXRhW2NhbGwucGh5c2ljYWxSZXNvdXJjZUlkLnJlc3BvbnNlUGF0aF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXdhaXQgcmVzcG9uZChldmVudCwgJ1NVQ0NFU1MnLCAnT0snLCBwaHlzaWNhbFJlc291cmNlSWQsIGRhdGEpO1xuICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICBjb25zb2xlLmxvZyhlKTtcbiAgICBhd2FpdCByZXNwb25kKGV2ZW50LCAnRkFJTEVEJywgZS5tZXNzYWdlIHx8ICdJbnRlcm5hbCBFcnJvcicsIGNvbnRleHQubG9nU3RyZWFtTmFtZSwge30pO1xuICB9XG59XG4iXX0=