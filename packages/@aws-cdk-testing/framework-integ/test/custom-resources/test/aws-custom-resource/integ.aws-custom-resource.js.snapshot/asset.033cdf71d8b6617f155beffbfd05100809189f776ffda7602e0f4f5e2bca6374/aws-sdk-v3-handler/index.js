"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.forceSdkInstallation = void 0;
/* eslint-disable no-console */
const child_process_1 = require("child_process");
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
    var _a, _b, _c;
    let awsSdk;
    try {
        if (!installedSdk[packageName] && installLatestAwsSdk === 'true') {
            installLatestSdk(packageName);
            awsSdk = await (_a = `/tmp/node_modules/${packageName}`, Promise.resolve().then(() => require(_a))).catch(async (e) => {
                var _a;
                console.log(`Failed to install latest AWS SDK v3: ${e}`);
                return _a = packageName, Promise.resolve().then(() => require(_a)); // Fallback to pre-installed version
            });
        }
        else if (installedSdk[packageName]) {
            awsSdk = await (_b = `/tmp/node_modules/${packageName}`, Promise.resolve().then(() => require(_b)));
        }
        else {
            awsSdk = await (_c = packageName, Promise.resolve().then(() => require(_c)));
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
                const { fromTemporaryCredentials } = await (_a = '@aws-sdk/credential-providers', Promise.resolve().then(() => require(_a)));
                credentials = fromTemporaryCredentials({
                    params: params,
                });
            }
            awsSdk = await awsSdk;
            const ServiceClient = Object.entries(awsSdk).find(
            // @ts-ignore
            ([name]) => name.toLowerCase() === `${packageName.replace('@aws-sdk/client-', '').replaceAll('-', '')}Client`.toLowerCase())?.[1];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsK0JBQStCO0FBQy9CLGlEQUF5QztBQU96QyxzRkFBK0U7QUFFL0Usc0NBQTJHO0FBRTNHLElBQUksWUFBWSxHQUFtQyxFQUFFLENBQUM7QUFFdEQsU0FBZ0Isb0JBQW9CO0lBQ2xDLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDcEIsQ0FBQztBQUZELG9EQUVDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLGdCQUFnQixDQUFDLFdBQW1CO0lBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUM1QyxvRkFBb0Y7SUFDcEYsSUFBQSx3QkFBUSxFQUNOLHlCQUF5QixXQUFXLHVEQUF1RCxDQUM1RixDQUFDO0lBQ0YsWUFBWSxHQUFHO1FBQ2IsR0FBRyxZQUFZO1FBQ2YsQ0FBQyxXQUFXLENBQUMsRUFBRSxJQUFJO0tBQ3BCLENBQUM7QUFDSixDQUFDO0FBS0QsS0FBSyxVQUFVLFVBQVUsQ0FDdkIsV0FBbUIsRUFDbkIsbUJBQXNDOztJQUV0QyxJQUFJLE1BQWMsQ0FBQztJQUNuQixJQUFJO1FBQ0YsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsSUFBSSxtQkFBbUIsS0FBSyxNQUFNLEVBQUU7WUFDaEUsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDOUIsTUFBTSxHQUFHLE1BQU0sTUFBTyxxQkFBcUIsV0FBVyxFQUFFLDZDQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O2dCQUMxRSxPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN6RCxZQUFjLFdBQVcsNENBQUUsQ0FBQyxvQ0FBb0M7WUFDbEUsQ0FBQyxDQUFDLENBQUM7U0FDSjthQUFNLElBQUksWUFBWSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQ3BDLE1BQU0sR0FBRyxZ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QUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUNyRTtTQUNGO1FBRUQsTUFBTSxJQUFBLGdCQUFPLEVBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDakU7SUFBQyxPQUFPLENBQU0sRUFBRTtRQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZixNQUFNLElBQUEsZ0JBQU8sRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUMxRjtBQUNILENBQUM7QUE1R0QsMEJBNEdDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbi8vIGltcG9ydCB0aGUgQVdTTGFtYmRhIHBhY2thZ2UgZXhwbGljaXRseSxcbi8vIHdoaWNoIGlzIGdsb2JhbGx5IGF2YWlsYWJsZSBpbiB0aGUgTGFtYmRhIHJ1bnRpbWUsXG4vLyBhcyBvdGhlcndpc2UgbGlua2luZyB0aGlzIHJlcG9zaXRvcnkgd2l0aCBsaW5rLWFsbC5zaFxuLy8gZmFpbHMgaW4gdGhlIENESyBhcHAgZXhlY3V0ZWQgd2l0aCB0cy1ub2RlXG4vKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzLGltcG9ydC9uby11bnJlc29sdmVkICovXG5pbXBvcnQgKiBhcyBBV1NMYW1iZGEgZnJvbSAnYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBnZXRWM0NsaWVudFBhY2thZ2VOYW1lIH0gZnJvbSAnLi92Mi10by12My9nZXQtdjMtY2xpZW50LXBhY2thZ2UtbmFtZSc7XG5pbXBvcnQgeyBBd3NTZGtDYWxsIH0gZnJvbSAnLi4vLi4vYXdzLWN1c3RvbS1yZXNvdXJjZSc7XG5pbXBvcnQgeyBkZWNvZGVDYWxsLCBkZWNvZGVTcGVjaWFsVmFsdWVzLCBmaWx0ZXJLZXlzLCBmbGF0dGVuLCByZXNwb25kLCBzdGFydHNXaXRoT25lT2YgfSBmcm9tICcuLi9zaGFyZWQnO1xuXG5sZXQgaW5zdGFsbGVkU2RrOiB7IFtzZXJ2aWNlOiBzdHJpbmddOiBib29sZWFuIH0gPSB7fTtcblxuZXhwb3J0IGZ1bmN0aW9uIGZvcmNlU2RrSW5zdGFsbGF0aW9uKCkge1xuICBpbnN0YWxsZWRTZGsgPSB7fTtcbn1cblxuLyoqXG4gKiBJbnN0YWxscyBsYXRlc3QgQVdTIFNESyB2M1xuICovXG5mdW5jdGlvbiBpbnN0YWxsTGF0ZXN0U2RrKHBhY2thZ2VOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgY29uc29sZS5sb2coJ0luc3RhbGxpbmcgbGF0ZXN0IEFXUyBTREsgdjMnKTtcbiAgLy8gQm90aCBIT01FIGFuZCAtLXByZWZpeCBhcmUgbmVlZGVkIGhlcmUgYmVjYXVzZSAvdG1wIGlzIHRoZSBvbmx5IHdyaXRhYmxlIGxvY2F0aW9uXG4gIGV4ZWNTeW5jKFxuICAgIGBIT01FPS90bXAgbnBtIGluc3RhbGwgJHtwYWNrYWdlTmFtZX0gLS1vbWl0PWRldiAtLW5vLXBhY2thZ2UtbG9jayAtLW5vLXNhdmUgLS1wcmVmaXggL3RtcGAsXG4gICk7XG4gIGluc3RhbGxlZFNkayA9IHtcbiAgICAuLi5pbnN0YWxsZWRTZGssXG4gICAgW3BhY2thZ2VOYW1lXTogdHJ1ZSxcbiAgfTtcbn1cblxuaW50ZXJmYWNlIEF3c1NkayB7XG4gIFtrZXk6IHN0cmluZ106IGFueVxufVxuYXN5bmMgZnVuY3Rpb24gbG9hZEF3c1NkayhcbiAgcGFja2FnZU5hbWU6IHN0cmluZyxcbiAgaW5zdGFsbExhdGVzdEF3c1Nkaz86ICd0cnVlJyB8ICdmYWxzZScsXG4pIHtcbiAgbGV0IGF3c1NkazogQXdzU2RrO1xuICB0cnkge1xuICAgIGlmICghaW5zdGFsbGVkU2RrW3BhY2thZ2VOYW1lXSAmJiBpbnN0YWxsTGF0ZXN0QXdzU2RrID09PSAndHJ1ZScpIHtcbiAgICAgIGluc3RhbGxMYXRlc3RTZGsocGFja2FnZU5hbWUpO1xuICAgICAgYXdzU2RrID0gYXdhaXQgaW1wb3J0KGAvdG1wL25vZGVfbW9kdWxlcy8ke3BhY2thZ2VOYW1lfWApLmNhdGNoKGFzeW5jIChlKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBGYWlsZWQgdG8gaW5zdGFsbCBsYXRlc3QgQVdTIFNESyB2MzogJHtlfWApO1xuICAgICAgICByZXR1cm4gaW1wb3J0KHBhY2thZ2VOYW1lKTsgLy8gRmFsbGJhY2sgdG8gcHJlLWluc3RhbGxlZCB2ZXJzaW9uXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGluc3RhbGxlZFNka1twYWNrYWdlTmFtZV0pIHtcbiAgICAgIGF3c1NkayA9IGF3YWl0IGltcG9ydChgL3RtcC9ub2RlX21vZHVsZXMvJHtwYWNrYWdlTmFtZX1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdzU2RrID0gYXdhaXQgaW1wb3J0KHBhY2thZ2VOYW1lKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhyb3cgRXJyb3IoYFBhY2thZ2UgJHtwYWNrYWdlTmFtZX0gZG9lcyBub3QgZXhpc3QuYCk7XG4gIH1cbiAgcmV0dXJuIGF3c1Nkaztcbn1cblxuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0cywgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCwgY29udGV4dDogQVdTTGFtYmRhLkNvbnRleHQpIHtcbiAgdHJ5IHtcbiAgICBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ3JlYXRlID0gZGVjb2RlQ2FsbChldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ3JlYXRlKTtcbiAgICBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuVXBkYXRlID0gZGVjb2RlQ2FsbChldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuVXBkYXRlKTtcbiAgICBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuRGVsZXRlID0gZGVjb2RlQ2FsbChldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuRGVsZXRlKTtcbiAgICBsZXQgZGF0YTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuXG4gICAgLy8gRGVmYXVsdCBwaHlzaWNhbCByZXNvdXJjZSBpZFxuICAgIGxldCBwaHlzaWNhbFJlc291cmNlSWQ6IHN0cmluZztcbiAgICBzd2l0Y2ggKGV2ZW50LlJlcXVlc3RUeXBlKSB7XG4gICAgICBjYXNlICdDcmVhdGUnOlxuICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ3JlYXRlPy5waHlzaWNhbFJlc291cmNlSWQ/LmlkID8/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5VcGRhdGU/LnBoeXNpY2FsUmVzb3VyY2VJZD8uaWQgPz9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRlbGV0ZT8ucGh5c2ljYWxSZXNvdXJjZUlkPy5pZCA/P1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5Mb2dpY2FsUmVzb3VyY2VJZDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdVcGRhdGUnOlxuICAgICAgY2FzZSAnRGVsZXRlJzpcbiAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzW2V2ZW50LlJlcXVlc3RUeXBlXT8ucGh5c2ljYWxSZXNvdXJjZUlkPy5pZCA/PyBldmVudC5QaHlzaWNhbFJlc291cmNlSWQ7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjb25zdCBjYWxsOiBBd3NTZGtDYWxsIHwgdW5kZWZpbmVkID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzW2V2ZW50LlJlcXVlc3RUeXBlXTtcbiAgICBpZiAoY2FsbCkge1xuICAgICAgLy8gd2hlbiBwcm92aWRlIHYyIHNlcnZpY2UgbmFtZSwgdHJhbnNmb3JtIGl0IHYzIHBhY2thZ2UgbmFtZS5cbiAgICAgIGNvbnN0IHBhY2thZ2VOYW1lID0gY2FsbC5zZXJ2aWNlLnN0YXJ0c1dpdGgoJ0Bhd3Mtc2RrLycpID8gY2FsbC5zZXJ2aWNlIDogZ2V0VjNDbGllbnRQYWNrYWdlTmFtZShjYWxsLnNlcnZpY2UpO1xuICAgICAgbGV0IGF3c1NkazogQXdzU2RrIHwgUHJvbWlzZTxBd3NTZGs+ID0gbG9hZEF3c1NkayhcbiAgICAgICAgcGFja2FnZU5hbWUsXG4gICAgICAgIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5JbnN0YWxsTGF0ZXN0QXdzU2RrLFxuICAgICAgKTtcblxuICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoeyAuLi5ldmVudCwgUmVzcG9uc2VVUkw6ICcuLi4nIH0pKTtcblxuICAgICAgbGV0IGNyZWRlbnRpYWxzO1xuICAgICAgaWYgKGNhbGwuYXNzdW1lZFJvbGVBcm4pIHtcbiAgICAgICAgY29uc3QgdGltZXN0YW1wID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcblxuICAgICAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgICAgUm9sZUFybjogY2FsbC5hc3N1bWVkUm9sZUFybixcbiAgICAgICAgICBSb2xlU2Vzc2lvbk5hbWU6IGAke3RpbWVzdGFtcH0tJHtwaHlzaWNhbFJlc291cmNlSWR9YC5zdWJzdHJpbmcoMCwgNjQpLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHsgZnJvbVRlbXBvcmFyeUNyZWRlbnRpYWxzIH0gPSBhd2FpdCBpbXBvcnQoJ0Bhd3Mtc2RrL2NyZWRlbnRpYWwtcHJvdmlkZXJzJyBhcyBzdHJpbmcpO1xuICAgICAgICBjcmVkZW50aWFscyA9IGZyb21UZW1wb3JhcnlDcmVkZW50aWFscyh7XG4gICAgICAgICAgcGFyYW1zOiBwYXJhbXMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBhd3NTZGsgPSBhd2FpdCBhd3NTZGs7XG4gICAgICBjb25zdCBTZXJ2aWNlQ2xpZW50ID0gT2JqZWN0LmVudHJpZXMoYXdzU2RrKS5maW5kKFxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIChbbmFtZV0pID0+IG5hbWUudG9Mb3dlckNhc2UoKSA9PT0gYCR7cGFja2FnZU5hbWUucmVwbGFjZSgnQGF3cy1zZGsvY2xpZW50LScsICcnKS5yZXBsYWNlQWxsKCctJywgJycpfUNsaWVudGAudG9Mb3dlckNhc2UoKSxcbiAgICAgICk/LlsxXSBhcyB7IG5ldyAoY29uZmlnOiBhbnkpOiB7XG4gICAgICAgIHNlbmQ6IChjb21tYW5kOiBhbnkpID0+IFByb21pc2U8YW55PlxuICAgICAgICBjb25maWc6IGFueVxuICAgICAgfSB9O1xuICAgICAgY29uc3QgY2xpZW50ID0gbmV3IFNlcnZpY2VDbGllbnQoe1xuICAgICAgICBhcGlWZXJzaW9uOiBjYWxsLmFwaVZlcnNpb24sXG4gICAgICAgIGNyZWRlbnRpYWxzOiBjcmVkZW50aWFscyxcbiAgICAgICAgcmVnaW9uOiBjYWxsLnJlZ2lvbixcbiAgICAgIH0pO1xuICAgICAgY29uc3QgY29tbWFuZE5hbWUgPSBjYWxsLmFjdGlvbi5lbmRzV2l0aCgnQ29tbWFuZCcpID8gY2FsbC5hY3Rpb24gOiBgJHtjYWxsLmFjdGlvbn1Db21tYW5kYDtcbiAgICAgIGNvbnN0IENvbW1hbmQgPSBPYmplY3QuZW50cmllcyhhd3NTZGspLmZpbmQoXG4gICAgICAgIChbbmFtZV0pID0+IG5hbWUudG9Mb3dlckNhc2UoKSA9PT0gY29tbWFuZE5hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICk/LlsxXSBhcyB7IG5ldyAoaW5wdXQ6IGFueSk6IGFueSB9O1xuXG4gICAgICBsZXQgZmxhdERhdGE6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIENvbW1hbmQgbXVzdCBwYXNzIGlucHV0IHZhbHVlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLXNkay1qcy12My9pc3N1ZXMvNDI0XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgY2xpZW50LnNlbmQoXG4gICAgICAgICAgbmV3IENvbW1hbmQoXG4gICAgICAgICAgICAoY2FsbC5wYXJhbWV0ZXJzICYmXG4gICAgICAgICAgICBkZWNvZGVTcGVjaWFsVmFsdWVzKGNhbGwucGFyYW1ldGVycywgcGh5c2ljYWxSZXNvdXJjZUlkKSkgPz8ge30sXG4gICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICAgICAgZmxhdERhdGEgPSB7XG4gICAgICAgICAgYXBpVmVyc2lvbjogY2xpZW50LmNvbmZpZy5hcGlWZXJzaW9uLCAvLyBGb3IgdGVzdCBwdXJwb3NlczogY2hlY2sgaWYgYXBpVmVyc2lvbiB3YXMgY29ycmVjdGx5IHBhc3NlZC5cbiAgICAgICAgICByZWdpb246IGF3YWl0IGNsaWVudC5jb25maWcucmVnaW9uKCkuY2F0Y2goKCkgPT4gdW5kZWZpbmVkKSwgLy8gRm9yIHRlc3QgcHVycG9zZXM6IGNoZWNrIGlmIHJlZ2lvbiB3YXMgY29ycmVjdGx5IHBhc3NlZC5cbiAgICAgICAgICAuLi5mbGF0dGVuKHJlc3BvbnNlKSxcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgb3V0cHV0UGF0aHM6IHN0cmluZ1tdIHwgdW5kZWZpbmVkO1xuICAgICAgICBpZiAoY2FsbC5vdXRwdXRQYXRoKSB7XG4gICAgICAgICAgb3V0cHV0UGF0aHMgPSBbY2FsbC5vdXRwdXRQYXRoXTtcbiAgICAgICAgfSBlbHNlIGlmIChjYWxsLm91dHB1dFBhdGhzKSB7XG4gICAgICAgICAgb3V0cHV0UGF0aHMgPSBjYWxsLm91dHB1dFBhdGhzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG91dHB1dFBhdGhzKSB7XG4gICAgICAgICAgZGF0YSA9IGZpbHRlcktleXMoZmxhdERhdGEsIHN0YXJ0c1dpdGhPbmVPZihvdXRwdXRQYXRocykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRhdGEgPSBmbGF0RGF0YTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIGlmICghY2FsbC5pZ25vcmVFcnJvckNvZGVzTWF0Y2hpbmcgfHwgIW5ldyBSZWdFeHAoY2FsbC5pZ25vcmVFcnJvckNvZGVzTWF0Y2hpbmcpLnRlc3QoZS5jb2RlKSkge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGNhbGwucGh5c2ljYWxSZXNvdXJjZUlkPy5yZXNwb25zZVBhdGgpIHtcbiAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkID0gZmxhdERhdGFbY2FsbC5waHlzaWNhbFJlc291cmNlSWQucmVzcG9uc2VQYXRoXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCByZXNwb25kKGV2ZW50LCAnU1VDQ0VTUycsICdPSycsIHBoeXNpY2FsUmVzb3VyY2VJZCwgZGF0YSk7XG4gIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgIGNvbnNvbGUubG9nKGUpO1xuICAgIGF3YWl0IHJlc3BvbmQoZXZlbnQsICdGQUlMRUQnLCBlLm1lc3NhZ2UgfHwgJ0ludGVybmFsIEVycm9yJywgY29udGV4dC5sb2dTdHJlYW1OYW1lLCB7fSk7XG4gIH1cbn0iXX0=