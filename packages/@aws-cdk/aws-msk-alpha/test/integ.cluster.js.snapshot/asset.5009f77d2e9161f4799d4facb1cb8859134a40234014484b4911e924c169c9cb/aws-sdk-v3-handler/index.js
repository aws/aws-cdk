"use strict";
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
            const [_clientName, ServiceClient] = Object.entries(awsSdk).find(([name]) => {
                // Services expose a base __Client class that we don't want ever
                return name.endsWith('Client') && name !== '__Client';
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBK0I7QUFDL0IsaURBQXlDO0FBT3pDLHNGQUErRTtBQUUvRSxzQ0FBMkc7QUFFM0csSUFBSSxZQUFZLEdBQW1DLEVBQUUsQ0FBQztBQUV0RCxTQUFnQixvQkFBb0I7SUFDbEMsWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUNwQixDQUFDO0FBRkQsb0RBRUM7QUFFRDs7R0FFRztBQUNILFNBQVMsZ0JBQWdCLENBQUMsV0FBbUI7SUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0lBQzVDLG9GQUFvRjtJQUNwRixJQUFBLHdCQUFRLEVBQ04seUJBQXlCLFdBQVcsdURBQXVELENBQzVGLENBQUM7SUFDRixZQUFZLEdBQUc7UUFDYixHQUFHLFlBQVk7UUFDZixDQUFDLFdBQVcsQ0FBQyxFQUFFLElBQUk7S0FDcEIsQ0FBQztBQUNKLENBQUM7QUFLRCxLQUFLLFVBQVUsVUFBVSxDQUN2QixXQUFtQixFQUNuQixtQkFBc0M7SUFFdEMsSUFBSSxNQUFjLENBQUM7SUFDbkIsSUFBSTtRQUNGLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksbUJBQW1CLEtBQUssTUFBTSxFQUFFO1lBQ2hFLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sR0FBRyxNQUFNLG1CQUFPLHFCQUFxQixXQUFXLEVBQUUsMEJBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDMUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDekQsMEJBQWMsV0FBVywwQkFBRSxDQUFDLG9DQUFvQztZQUNsRSxDQUFDLENBQUMsQ0FBQztTQUNKO2FBQU0sSUFBSSxZQUFZLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDcEMsTUFBTSxHQUFHLHlC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TSxJQUFBLGdCQUFPLEVBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDakU7SUFBQyxPQUFPLENBQU0sRUFBRTtRQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZixNQUFNLElBQUEsZ0JBQU8sRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUMxRjtBQUNILENBQUM7QUFqSEQsMEJBaUhDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbi8vIGltcG9ydCB0aGUgQVdTTGFtYmRhIHBhY2thZ2UgZXhwbGljaXRseSxcbi8vIHdoaWNoIGlzIGdsb2JhbGx5IGF2YWlsYWJsZSBpbiB0aGUgTGFtYmRhIHJ1bnRpbWUsXG4vLyBhcyBvdGhlcndpc2UgbGlua2luZyB0aGlzIHJlcG9zaXRvcnkgd2l0aCBsaW5rLWFsbC5zaFxuLy8gZmFpbHMgaW4gdGhlIENESyBhcHAgZXhlY3V0ZWQgd2l0aCB0cy1ub2RlXG4vKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzLGltcG9ydC9uby11bnJlc29sdmVkICovXG5pbXBvcnQgKiBhcyBBV1NMYW1iZGEgZnJvbSAnYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBnZXRWM0NsaWVudFBhY2thZ2VOYW1lIH0gZnJvbSAnLi92Mi10by12My9nZXQtdjMtY2xpZW50LXBhY2thZ2UtbmFtZSc7XG5pbXBvcnQgeyBBd3NTZGtDYWxsIH0gZnJvbSAnLi4vLi4vYXdzLWN1c3RvbS1yZXNvdXJjZSc7XG5pbXBvcnQgeyBkZWNvZGVDYWxsLCBkZWNvZGVTcGVjaWFsVmFsdWVzLCBmaWx0ZXJLZXlzLCBmbGF0dGVuLCByZXNwb25kLCBzdGFydHNXaXRoT25lT2YgfSBmcm9tICcuLi9zaGFyZWQnO1xuXG5sZXQgaW5zdGFsbGVkU2RrOiB7IFtzZXJ2aWNlOiBzdHJpbmddOiBib29sZWFuIH0gPSB7fTtcblxuZXhwb3J0IGZ1bmN0aW9uIGZvcmNlU2RrSW5zdGFsbGF0aW9uKCkge1xuICBpbnN0YWxsZWRTZGsgPSB7fTtcbn1cblxuLyoqXG4gKiBJbnN0YWxscyBsYXRlc3QgQVdTIFNESyB2M1xuICovXG5mdW5jdGlvbiBpbnN0YWxsTGF0ZXN0U2RrKHBhY2thZ2VOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgY29uc29sZS5sb2coJ0luc3RhbGxpbmcgbGF0ZXN0IEFXUyBTREsgdjMnKTtcbiAgLy8gQm90aCBIT01FIGFuZCAtLXByZWZpeCBhcmUgbmVlZGVkIGhlcmUgYmVjYXVzZSAvdG1wIGlzIHRoZSBvbmx5IHdyaXRhYmxlIGxvY2F0aW9uXG4gIGV4ZWNTeW5jKFxuICAgIGBIT01FPS90bXAgbnBtIGluc3RhbGwgJHtwYWNrYWdlTmFtZX0gLS1vbWl0PWRldiAtLW5vLXBhY2thZ2UtbG9jayAtLW5vLXNhdmUgLS1wcmVmaXggL3RtcGAsXG4gICk7XG4gIGluc3RhbGxlZFNkayA9IHtcbiAgICAuLi5pbnN0YWxsZWRTZGssXG4gICAgW3BhY2thZ2VOYW1lXTogdHJ1ZSxcbiAgfTtcbn1cblxuaW50ZXJmYWNlIEF3c1NkayB7XG4gIFtrZXk6IHN0cmluZ106IGFueVxufVxuYXN5bmMgZnVuY3Rpb24gbG9hZEF3c1NkayhcbiAgcGFja2FnZU5hbWU6IHN0cmluZyxcbiAgaW5zdGFsbExhdGVzdEF3c1Nkaz86ICd0cnVlJyB8ICdmYWxzZScsXG4pIHtcbiAgbGV0IGF3c1NkazogQXdzU2RrO1xuICB0cnkge1xuICAgIGlmICghaW5zdGFsbGVkU2RrW3BhY2thZ2VOYW1lXSAmJiBpbnN0YWxsTGF0ZXN0QXdzU2RrID09PSAndHJ1ZScpIHtcbiAgICAgIGluc3RhbGxMYXRlc3RTZGsocGFja2FnZU5hbWUpO1xuICAgICAgYXdzU2RrID0gYXdhaXQgaW1wb3J0KGAvdG1wL25vZGVfbW9kdWxlcy8ke3BhY2thZ2VOYW1lfWApLmNhdGNoKGFzeW5jIChlKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBGYWlsZWQgdG8gaW5zdGFsbCBsYXRlc3QgQVdTIFNESyB2MzogJHtlfWApO1xuICAgICAgICByZXR1cm4gaW1wb3J0KHBhY2thZ2VOYW1lKTsgLy8gRmFsbGJhY2sgdG8gcHJlLWluc3RhbGxlZCB2ZXJzaW9uXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGluc3RhbGxlZFNka1twYWNrYWdlTmFtZV0pIHtcbiAgICAgIGF3c1NkayA9IGF3YWl0IGltcG9ydChgL3RtcC9ub2RlX21vZHVsZXMvJHtwYWNrYWdlTmFtZX1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdzU2RrID0gYXdhaXQgaW1wb3J0KHBhY2thZ2VOYW1lKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhyb3cgRXJyb3IoYFBhY2thZ2UgJHtwYWNrYWdlTmFtZX0gZG9lcyBub3QgZXhpc3QuYCk7XG4gIH1cbiAgcmV0dXJuIGF3c1Nkaztcbn1cblxuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0cywgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCwgY29udGV4dDogQVdTTGFtYmRhLkNvbnRleHQpIHtcbiAgdHJ5IHtcbiAgICBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ3JlYXRlID0gZGVjb2RlQ2FsbChldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ3JlYXRlKTtcbiAgICBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuVXBkYXRlID0gZGVjb2RlQ2FsbChldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuVXBkYXRlKTtcbiAgICBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuRGVsZXRlID0gZGVjb2RlQ2FsbChldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuRGVsZXRlKTtcbiAgICBsZXQgZGF0YTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuXG4gICAgLy8gRGVmYXVsdCBwaHlzaWNhbCByZXNvdXJjZSBpZFxuICAgIGxldCBwaHlzaWNhbFJlc291cmNlSWQ6IHN0cmluZztcbiAgICBzd2l0Y2ggKGV2ZW50LlJlcXVlc3RUeXBlKSB7XG4gICAgICBjYXNlICdDcmVhdGUnOlxuICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ3JlYXRlPy5waHlzaWNhbFJlc291cmNlSWQ/LmlkID8/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5VcGRhdGU/LnBoeXNpY2FsUmVzb3VyY2VJZD8uaWQgPz9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRlbGV0ZT8ucGh5c2ljYWxSZXNvdXJjZUlkPy5pZCA/P1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5Mb2dpY2FsUmVzb3VyY2VJZDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdVcGRhdGUnOlxuICAgICAgY2FzZSAnRGVsZXRlJzpcbiAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzW2V2ZW50LlJlcXVlc3RUeXBlXT8ucGh5c2ljYWxSZXNvdXJjZUlkPy5pZCA/PyBldmVudC5QaHlzaWNhbFJlc291cmNlSWQ7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjb25zdCBjYWxsOiBBd3NTZGtDYWxsIHwgdW5kZWZpbmVkID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzW2V2ZW50LlJlcXVlc3RUeXBlXTtcbiAgICBpZiAoY2FsbCkge1xuICAgICAgLy8gd2hlbiBwcm92aWRlIHYyIHNlcnZpY2UgbmFtZSwgdHJhbnNmb3JtIGl0IHYzIHBhY2thZ2UgbmFtZS5cbiAgICAgIGNvbnN0IHBhY2thZ2VOYW1lID0gY2FsbC5zZXJ2aWNlLnN0YXJ0c1dpdGgoJ0Bhd3Mtc2RrLycpID8gY2FsbC5zZXJ2aWNlIDogZ2V0VjNDbGllbnRQYWNrYWdlTmFtZShjYWxsLnNlcnZpY2UpO1xuICAgICAgbGV0IGF3c1NkazogQXdzU2RrIHwgUHJvbWlzZTxBd3NTZGs+ID0gbG9hZEF3c1NkayhcbiAgICAgICAgcGFja2FnZU5hbWUsXG4gICAgICAgIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5JbnN0YWxsTGF0ZXN0QXdzU2RrLFxuICAgICAgKTtcblxuICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoeyAuLi5ldmVudCwgUmVzcG9uc2VVUkw6ICcuLi4nIH0pKTtcblxuICAgICAgbGV0IGNyZWRlbnRpYWxzO1xuICAgICAgaWYgKGNhbGwuYXNzdW1lZFJvbGVBcm4pIHtcbiAgICAgICAgY29uc3QgdGltZXN0YW1wID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcblxuICAgICAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgICAgUm9sZUFybjogY2FsbC5hc3N1bWVkUm9sZUFybixcbiAgICAgICAgICBSb2xlU2Vzc2lvbk5hbWU6IGAke3RpbWVzdGFtcH0tJHtwaHlzaWNhbFJlc291cmNlSWR9YC5zdWJzdHJpbmcoMCwgNjQpLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHsgZnJvbVRlbXBvcmFyeUNyZWRlbnRpYWxzIH0gPSBhd2FpdCBpbXBvcnQoJ0Bhd3Mtc2RrL2NyZWRlbnRpYWwtcHJvdmlkZXJzJyBhcyBzdHJpbmcpO1xuICAgICAgICBjcmVkZW50aWFscyA9IGZyb21UZW1wb3JhcnlDcmVkZW50aWFscyh7XG4gICAgICAgICAgcGFyYW1zLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgYXdzU2RrID0gYXdhaXQgYXdzU2RrO1xuICAgICAgY29uc3QgW19jbGllbnROYW1lLCBTZXJ2aWNlQ2xpZW50XSA9IE9iamVjdC5lbnRyaWVzKGF3c1NkaykuZmluZChcbiAgICAgICAgKFtuYW1lXSkgPT4ge1xuICAgICAgICAgIC8vIFNlcnZpY2VzIGV4cG9zZSBhIGJhc2UgX19DbGllbnQgY2xhc3MgdGhhdCB3ZSBkb24ndCB3YW50IGV2ZXJcbiAgICAgICAgICByZXR1cm4gbmFtZS5lbmRzV2l0aCgnQ2xpZW50JykgJiYgbmFtZSAhPT0gJ19fQ2xpZW50JztcbiAgICAgICAgfSxcbiAgICAgICkgYXMgW3N0cmluZywge1xuICAgICAgICBuZXcgKGNvbmZpZzogYW55KToge1xuICAgICAgICAgIHNlbmQ6IChjb21tYW5kOiBhbnkpID0+IFByb21pc2U8YW55PlxuICAgICAgICAgIGNvbmZpZzogYW55XG4gICAgICAgIH1cbiAgICAgIH1dO1xuXG4gICAgICBjb25zdCBjbGllbnQgPSBuZXcgU2VydmljZUNsaWVudCh7XG4gICAgICAgIGFwaVZlcnNpb246IGNhbGwuYXBpVmVyc2lvbixcbiAgICAgICAgY3JlZGVudGlhbHM6IGNyZWRlbnRpYWxzLFxuICAgICAgICByZWdpb246IGNhbGwucmVnaW9uLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBjb21tYW5kTmFtZSA9IGNhbGwuYWN0aW9uLmVuZHNXaXRoKCdDb21tYW5kJykgPyBjYWxsLmFjdGlvbiA6IGAke2NhbGwuYWN0aW9ufUNvbW1hbmRgO1xuICAgICAgY29uc3QgQ29tbWFuZCA9IE9iamVjdC5lbnRyaWVzKGF3c1NkaykuZmluZChcbiAgICAgICAgKFtuYW1lXSkgPT4gbmFtZS50b0xvd2VyQ2FzZSgpID09PSBjb21tYW5kTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgKT8uWzFdIGFzIHsgbmV3IChpbnB1dDogYW55KTogYW55IH07XG5cbiAgICAgIGxldCBmbGF0RGF0YTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gQ29tbWFuZCBtdXN0IHBhc3MgaW5wdXQgdmFsdWUgaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3Mtc2RrLWpzLXYzL2lzc3Vlcy80MjRcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBjbGllbnQuc2VuZChcbiAgICAgICAgICBuZXcgQ29tbWFuZChcbiAgICAgICAgICAgIChjYWxsLnBhcmFtZXRlcnMgJiZcbiAgICAgICAgICAgIGRlY29kZVNwZWNpYWxWYWx1ZXMoY2FsbC5wYXJhbWV0ZXJzLCBwaHlzaWNhbFJlc291cmNlSWQpKSA/PyB7fSxcbiAgICAgICAgICApLFxuICAgICAgICApO1xuICAgICAgICBmbGF0RGF0YSA9IHtcbiAgICAgICAgICBhcGlWZXJzaW9uOiBjbGllbnQuY29uZmlnLmFwaVZlcnNpb24sIC8vIEZvciB0ZXN0IHB1cnBvc2VzOiBjaGVjayBpZiBhcGlWZXJzaW9uIHdhcyBjb3JyZWN0bHkgcGFzc2VkLlxuICAgICAgICAgIHJlZ2lvbjogYXdhaXQgY2xpZW50LmNvbmZpZy5yZWdpb24oKS5jYXRjaCgoKSA9PiB1bmRlZmluZWQpLCAvLyBGb3IgdGVzdCBwdXJwb3NlczogY2hlY2sgaWYgcmVnaW9uIHdhcyBjb3JyZWN0bHkgcGFzc2VkLlxuICAgICAgICAgIC4uLmZsYXR0ZW4ocmVzcG9uc2UpLFxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBvdXRwdXRQYXRoczogc3RyaW5nW10gfCB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChjYWxsLm91dHB1dFBhdGgpIHtcbiAgICAgICAgICBvdXRwdXRQYXRocyA9IFtjYWxsLm91dHB1dFBhdGhdO1xuICAgICAgICB9IGVsc2UgaWYgKGNhbGwub3V0cHV0UGF0aHMpIHtcbiAgICAgICAgICBvdXRwdXRQYXRocyA9IGNhbGwub3V0cHV0UGF0aHM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3V0cHV0UGF0aHMpIHtcbiAgICAgICAgICBkYXRhID0gZmlsdGVyS2V5cyhmbGF0RGF0YSwgc3RhcnRzV2l0aE9uZU9mKG91dHB1dFBhdGhzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGF0YSA9IGZsYXREYXRhO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgaWYgKCFjYWxsLmlnbm9yZUVycm9yQ29kZXNNYXRjaGluZyB8fCAhbmV3IFJlZ0V4cChjYWxsLmlnbm9yZUVycm9yQ29kZXNNYXRjaGluZykudGVzdChlLmNvZGUpKSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoY2FsbC5waHlzaWNhbFJlc291cmNlSWQ/LnJlc3BvbnNlUGF0aCkge1xuICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQgPSBmbGF0RGF0YVtjYWxsLnBoeXNpY2FsUmVzb3VyY2VJZC5yZXNwb25zZVBhdGhdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGF3YWl0IHJlc3BvbmQoZXZlbnQsICdTVUNDRVNTJywgJ09LJywgcGh5c2ljYWxSZXNvdXJjZUlkLCBkYXRhKTtcbiAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgY29uc29sZS5sb2coZSk7XG4gICAgYXdhaXQgcmVzcG9uZChldmVudCwgJ0ZBSUxFRCcsIGUubWVzc2FnZSB8fCAnSW50ZXJuYWwgRXJyb3InLCBjb250ZXh0LmxvZ1N0cmVhbU5hbWUsIHt9KTtcbiAgfVxufVxuIl19