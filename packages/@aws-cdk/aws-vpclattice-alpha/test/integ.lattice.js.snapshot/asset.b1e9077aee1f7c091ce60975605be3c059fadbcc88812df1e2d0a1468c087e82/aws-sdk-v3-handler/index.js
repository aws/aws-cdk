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
            const ServiceClient = Object.entries(awsSdk).find(([name]) => name.endsWith('Client'))?.[1];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBK0I7QUFDL0IsaURBQXlDO0FBT3pDLHNGQUErRTtBQUUvRSxzQ0FBMkc7QUFFM0csSUFBSSxZQUFZLEdBQW1DLEVBQUUsQ0FBQztBQUV0RCxTQUFnQixvQkFBb0I7SUFDbEMsWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUNwQixDQUFDO0FBRkQsb0RBRUM7QUFFRDs7R0FFRztBQUNILFNBQVMsZ0JBQWdCLENBQUMsV0FBbUI7SUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0lBQzVDLG9GQUFvRjtJQUNwRixJQUFBLHdCQUFRLEVBQ04seUJBQXlCLFdBQVcsdURBQXVELENBQzVGLENBQUM7SUFDRixZQUFZLEdBQUc7UUFDYixHQUFHLFlBQVk7UUFDZixDQUFDLFdBQVcsQ0FBQyxFQUFFLElBQUk7S0FDcEIsQ0FBQztBQUNKLENBQUM7QUFLRCxLQUFLLFVBQVUsVUFBVSxDQUN2QixXQUFtQixFQUNuQixtQkFBc0M7SUFFdEMsSUFBSSxNQUFjLENBQUM7SUFDbkIsSUFBSTtRQUNGLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLElBQUksbUJBQW1CLEtBQUssTUFBTSxFQUFFO1lBQ2hFLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sR0FBRyxNQUFNLG1CQUFPLHFCQUFxQixXQUFXLEVBQUUsMEJBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDMUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDekQsMEJBQWMsV0FBVywwQkFBRSxDQUFDLG9DQUFvQztZQUNsRSxDQUFDLENBQUMsQ0FBQztTQUNKO2FBQU0sSUFBSSxZQUFZLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDcEMsTUFBTSxHQUFHLHlC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QUFFLElBQUksQ0FBQyxDQUFDO0tBQ2pFO0lBQUMsT0FBTyxDQUFNLEVBQUU7UUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2YsTUFBTSxJQUFBLGdCQUFPLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDMUY7QUFDSCxDQUFDO0FBM0dELDBCQTJHQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbmltcG9ydCB7IGV4ZWNTeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG4vLyBpbXBvcnQgdGhlIEFXU0xhbWJkYSBwYWNrYWdlIGV4cGxpY2l0bHksXG4vLyB3aGljaCBpcyBnbG9iYWxseSBhdmFpbGFibGUgaW4gdGhlIExhbWJkYSBydW50aW1lLFxuLy8gYXMgb3RoZXJ3aXNlIGxpbmtpbmcgdGhpcyByZXBvc2l0b3J5IHdpdGggbGluay1hbGwuc2hcbi8vIGZhaWxzIGluIHRoZSBDREsgYXBwIGV4ZWN1dGVkIHdpdGggdHMtbm9kZVxuLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llcyxpbXBvcnQvbm8tdW5yZXNvbHZlZCAqL1xuaW1wb3J0ICogYXMgQVdTTGFtYmRhIGZyb20gJ2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgZ2V0VjNDbGllbnRQYWNrYWdlTmFtZSB9IGZyb20gJy4vdjItdG8tdjMvZ2V0LXYzLWNsaWVudC1wYWNrYWdlLW5hbWUnO1xuaW1wb3J0IHsgQXdzU2RrQ2FsbCB9IGZyb20gJy4uLy4uL2F3cy1jdXN0b20tcmVzb3VyY2UnO1xuaW1wb3J0IHsgZGVjb2RlQ2FsbCwgZGVjb2RlU3BlY2lhbFZhbHVlcywgZmlsdGVyS2V5cywgZmxhdHRlbiwgcmVzcG9uZCwgc3RhcnRzV2l0aE9uZU9mIH0gZnJvbSAnLi4vc2hhcmVkJztcblxubGV0IGluc3RhbGxlZFNkazogeyBbc2VydmljZTogc3RyaW5nXTogYm9vbGVhbiB9ID0ge307XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JjZVNka0luc3RhbGxhdGlvbigpIHtcbiAgaW5zdGFsbGVkU2RrID0ge307XG59XG5cbi8qKlxuICogSW5zdGFsbHMgbGF0ZXN0IEFXUyBTREsgdjNcbiAqL1xuZnVuY3Rpb24gaW5zdGFsbExhdGVzdFNkayhwYWNrYWdlTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gIGNvbnNvbGUubG9nKCdJbnN0YWxsaW5nIGxhdGVzdCBBV1MgU0RLIHYzJyk7XG4gIC8vIEJvdGggSE9NRSBhbmQgLS1wcmVmaXggYXJlIG5lZWRlZCBoZXJlIGJlY2F1c2UgL3RtcCBpcyB0aGUgb25seSB3cml0YWJsZSBsb2NhdGlvblxuICBleGVjU3luYyhcbiAgICBgSE9NRT0vdG1wIG5wbSBpbnN0YWxsICR7cGFja2FnZU5hbWV9IC0tb21pdD1kZXYgLS1uby1wYWNrYWdlLWxvY2sgLS1uby1zYXZlIC0tcHJlZml4IC90bXBgLFxuICApO1xuICBpbnN0YWxsZWRTZGsgPSB7XG4gICAgLi4uaW5zdGFsbGVkU2RrLFxuICAgIFtwYWNrYWdlTmFtZV06IHRydWUsXG4gIH07XG59XG5cbmludGVyZmFjZSBBd3NTZGsge1xuICBba2V5OiBzdHJpbmddOiBhbnlcbn1cbmFzeW5jIGZ1bmN0aW9uIGxvYWRBd3NTZGsoXG4gIHBhY2thZ2VOYW1lOiBzdHJpbmcsXG4gIGluc3RhbGxMYXRlc3RBd3NTZGs/OiAndHJ1ZScgfCAnZmFsc2UnLFxuKSB7XG4gIGxldCBhd3NTZGs6IEF3c1NkaztcbiAgdHJ5IHtcbiAgICBpZiAoIWluc3RhbGxlZFNka1twYWNrYWdlTmFtZV0gJiYgaW5zdGFsbExhdGVzdEF3c1NkayA9PT0gJ3RydWUnKSB7XG4gICAgICBpbnN0YWxsTGF0ZXN0U2RrKHBhY2thZ2VOYW1lKTtcbiAgICAgIGF3c1NkayA9IGF3YWl0IGltcG9ydChgL3RtcC9ub2RlX21vZHVsZXMvJHtwYWNrYWdlTmFtZX1gKS5jYXRjaChhc3luYyAoZSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhgRmFpbGVkIHRvIGluc3RhbGwgbGF0ZXN0IEFXUyBTREsgdjM6ICR7ZX1gKTtcbiAgICAgICAgcmV0dXJuIGltcG9ydChwYWNrYWdlTmFtZSk7IC8vIEZhbGxiYWNrIHRvIHByZS1pbnN0YWxsZWQgdmVyc2lvblxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChpbnN0YWxsZWRTZGtbcGFja2FnZU5hbWVdKSB7XG4gICAgICBhd3NTZGsgPSBhd2FpdCBpbXBvcnQoYC90bXAvbm9kZV9tb2R1bGVzLyR7cGFja2FnZU5hbWV9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3c1NkayA9IGF3YWl0IGltcG9ydChwYWNrYWdlTmFtZSk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHRocm93IEVycm9yKGBQYWNrYWdlICR7cGFja2FnZU5hbWV9IGRvZXMgbm90IGV4aXN0LmApO1xuICB9XG4gIHJldHVybiBhd3NTZGs7XG59XG5cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHMsIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llcyAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQsIGNvbnRleHQ6IEFXU0xhbWJkYS5Db250ZXh0KSB7XG4gIHRyeSB7XG4gICAgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkNyZWF0ZSA9IGRlY29kZUNhbGwoZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkNyZWF0ZSk7XG4gICAgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlVwZGF0ZSA9IGRlY29kZUNhbGwoZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlVwZGF0ZSk7XG4gICAgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRlbGV0ZSA9IGRlY29kZUNhbGwoZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRlbGV0ZSk7XG4gICAgbGV0IGRhdGE6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcblxuICAgIC8vIERlZmF1bHQgcGh5c2ljYWwgcmVzb3VyY2UgaWRcbiAgICBsZXQgcGh5c2ljYWxSZXNvdXJjZUlkOiBzdHJpbmc7XG4gICAgc3dpdGNoIChldmVudC5SZXF1ZXN0VHlwZSkge1xuICAgICAgY2FzZSAnQ3JlYXRlJzpcbiAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkNyZWF0ZT8ucGh5c2ljYWxSZXNvdXJjZUlkPy5pZCA/P1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuVXBkYXRlPy5waHlzaWNhbFJlc291cmNlSWQ/LmlkID8/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EZWxldGU/LnBoeXNpY2FsUmVzb3VyY2VJZD8uaWQgPz9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuTG9naWNhbFJlc291cmNlSWQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnVXBkYXRlJzpcbiAgICAgIGNhc2UgJ0RlbGV0ZSc6XG4gICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZCA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllc1tldmVudC5SZXF1ZXN0VHlwZV0/LnBoeXNpY2FsUmVzb3VyY2VJZD8uaWQgPz8gZXZlbnQuUGh5c2ljYWxSZXNvdXJjZUlkO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgY29uc3QgY2FsbDogQXdzU2RrQ2FsbCB8IHVuZGVmaW5lZCA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllc1tldmVudC5SZXF1ZXN0VHlwZV07XG4gICAgaWYgKGNhbGwpIHtcbiAgICAgIC8vIHdoZW4gcHJvdmlkZSB2MiBzZXJ2aWNlIG5hbWUsIHRyYW5zZm9ybSBpdCB2MyBwYWNrYWdlIG5hbWUuXG4gICAgICBjb25zdCBwYWNrYWdlTmFtZSA9IGNhbGwuc2VydmljZS5zdGFydHNXaXRoKCdAYXdzLXNkay8nKSA/IGNhbGwuc2VydmljZSA6IGdldFYzQ2xpZW50UGFja2FnZU5hbWUoY2FsbC5zZXJ2aWNlKTtcbiAgICAgIGxldCBhd3NTZGs6IEF3c1NkayB8IFByb21pc2U8QXdzU2RrPiA9IGxvYWRBd3NTZGsoXG4gICAgICAgIHBhY2thZ2VOYW1lLFxuICAgICAgICBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuSW5zdGFsbExhdGVzdEF3c1NkayxcbiAgICAgICk7XG5cbiAgICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHsgLi4uZXZlbnQsIFJlc3BvbnNlVVJMOiAnLi4uJyB9KSk7XG5cbiAgICAgIGxldCBjcmVkZW50aWFscztcbiAgICAgIGlmIChjYWxsLmFzc3VtZWRSb2xlQXJuKSB7XG4gICAgICAgIGNvbnN0IHRpbWVzdGFtcCA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgICAgIFJvbGVBcm46IGNhbGwuYXNzdW1lZFJvbGVBcm4sXG4gICAgICAgICAgUm9sZVNlc3Npb25OYW1lOiBgJHt0aW1lc3RhbXB9LSR7cGh5c2ljYWxSZXNvdXJjZUlkfWAuc3Vic3RyaW5nKDAsIDY0KSxcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCB7IGZyb21UZW1wb3JhcnlDcmVkZW50aWFscyB9ID0gYXdhaXQgaW1wb3J0KCdAYXdzLXNkay9jcmVkZW50aWFsLXByb3ZpZGVycycgYXMgc3RyaW5nKTtcbiAgICAgICAgY3JlZGVudGlhbHMgPSBmcm9tVGVtcG9yYXJ5Q3JlZGVudGlhbHMoe1xuICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGF3c1NkayA9IGF3YWl0IGF3c1NkaztcbiAgICAgIGNvbnN0IFNlcnZpY2VDbGllbnQgPSBPYmplY3QuZW50cmllcyhhd3NTZGspLmZpbmQoIChbbmFtZV0pID0+IG5hbWUuZW5kc1dpdGgoJ0NsaWVudCcpICk/LlsxXSBhcyB7XG4gICAgICAgIG5ldyAoY29uZmlnOiBhbnkpOiB7XG4gICAgICAgICAgc2VuZDogKGNvbW1hbmQ6IGFueSkgPT4gUHJvbWlzZTxhbnk+XG4gICAgICAgICAgY29uZmlnOiBhbnlcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IGNsaWVudCA9IG5ldyBTZXJ2aWNlQ2xpZW50KHtcbiAgICAgICAgYXBpVmVyc2lvbjogY2FsbC5hcGlWZXJzaW9uLFxuICAgICAgICBjcmVkZW50aWFsczogY3JlZGVudGlhbHMsXG4gICAgICAgIHJlZ2lvbjogY2FsbC5yZWdpb24sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGNvbW1hbmROYW1lID0gY2FsbC5hY3Rpb24uZW5kc1dpdGgoJ0NvbW1hbmQnKSA/IGNhbGwuYWN0aW9uIDogYCR7Y2FsbC5hY3Rpb259Q29tbWFuZGA7XG4gICAgICBjb25zdCBDb21tYW5kID0gT2JqZWN0LmVudHJpZXMoYXdzU2RrKS5maW5kKFxuICAgICAgICAoW25hbWVdKSA9PiBuYW1lLnRvTG93ZXJDYXNlKCkgPT09IGNvbW1hbmROYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICApPy5bMV0gYXMgeyBuZXcgKGlucHV0OiBhbnkpOiBhbnkgfTtcblxuICAgICAgbGV0IGZsYXREYXRhOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG4gICAgICB0cnkge1xuICAgICAgICAvLyBDb21tYW5kIG11c3QgcGFzcyBpbnB1dCB2YWx1ZSBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1zZGstanMtdjMvaXNzdWVzLzQyNFxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGNsaWVudC5zZW5kKFxuICAgICAgICAgIG5ldyBDb21tYW5kKFxuICAgICAgICAgICAgKGNhbGwucGFyYW1ldGVycyAmJlxuICAgICAgICAgICAgZGVjb2RlU3BlY2lhbFZhbHVlcyhjYWxsLnBhcmFtZXRlcnMsIHBoeXNpY2FsUmVzb3VyY2VJZCkpID8/IHt9LFxuICAgICAgICAgICksXG4gICAgICAgICk7XG4gICAgICAgIGZsYXREYXRhID0ge1xuICAgICAgICAgIGFwaVZlcnNpb246IGNsaWVudC5jb25maWcuYXBpVmVyc2lvbiwgLy8gRm9yIHRlc3QgcHVycG9zZXM6IGNoZWNrIGlmIGFwaVZlcnNpb24gd2FzIGNvcnJlY3RseSBwYXNzZWQuXG4gICAgICAgICAgcmVnaW9uOiBhd2FpdCBjbGllbnQuY29uZmlnLnJlZ2lvbigpLmNhdGNoKCgpID0+IHVuZGVmaW5lZCksIC8vIEZvciB0ZXN0IHB1cnBvc2VzOiBjaGVjayBpZiByZWdpb24gd2FzIGNvcnJlY3RseSBwYXNzZWQuXG4gICAgICAgICAgLi4uZmxhdHRlbihyZXNwb25zZSksXG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IG91dHB1dFBhdGhzOiBzdHJpbmdbXSB8IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKGNhbGwub3V0cHV0UGF0aCkge1xuICAgICAgICAgIG91dHB1dFBhdGhzID0gW2NhbGwub3V0cHV0UGF0aF07XG4gICAgICAgIH0gZWxzZSBpZiAoY2FsbC5vdXRwdXRQYXRocykge1xuICAgICAgICAgIG91dHB1dFBhdGhzID0gY2FsbC5vdXRwdXRQYXRocztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvdXRwdXRQYXRocykge1xuICAgICAgICAgIGRhdGEgPSBmaWx0ZXJLZXlzKGZsYXREYXRhLCBzdGFydHNXaXRoT25lT2Yob3V0cHV0UGF0aHMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkYXRhID0gZmxhdERhdGE7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgICBpZiAoIWNhbGwuaWdub3JlRXJyb3JDb2Rlc01hdGNoaW5nIHx8ICFuZXcgUmVnRXhwKGNhbGwuaWdub3JlRXJyb3JDb2Rlc01hdGNoaW5nKS50ZXN0KGUuY29kZSkpIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChjYWxsLnBoeXNpY2FsUmVzb3VyY2VJZD8ucmVzcG9uc2VQYXRoKSB7XG4gICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZCA9IGZsYXREYXRhW2NhbGwucGh5c2ljYWxSZXNvdXJjZUlkLnJlc3BvbnNlUGF0aF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXdhaXQgcmVzcG9uZChldmVudCwgJ1NVQ0NFU1MnLCAnT0snLCBwaHlzaWNhbFJlc291cmNlSWQsIGRhdGEpO1xuICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICBjb25zb2xlLmxvZyhlKTtcbiAgICBhd2FpdCByZXNwb25kKGV2ZW50LCAnRkFJTEVEJywgZS5tZXNzYWdlIHx8ICdJbnRlcm5hbCBFcnJvcicsIGNvbnRleHQubG9nU3RyZWFtTmFtZSwge30pO1xuICB9XG59Il19