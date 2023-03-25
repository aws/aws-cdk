"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.forceSdkInstallation = void 0;
/* eslint-disable no-console */
const child_process_1 = require("child_process");
const shared_1 = require("./shared");
let installedSdk = {};
function forceSdkInstallation() {
    installedSdk = {};
}
exports.forceSdkInstallation = forceSdkInstallation;
/**
 * Installs latest AWS SDK v3
 */
function installLatestSdk(serviceName) {
    console.log('Installing latest AWS SDK v3');
    // Both HOME and --prefix are needed here because /tmp is the only writable location
    (0, child_process_1.execSync)(`HOME=/tmp npm install @aws-sdk/client-${serviceName} --production --no-package-lock --no-save --prefix /tmp`);
    installedSdk = {
        ...installedSdk,
        [serviceName]: true,
    };
}
async function loadAwsSdk(serviceName, installLatestAwsSdk) {
    const lowerServiceName = serviceName.toLowerCase();
    let awsSdk;
    try {
        if (!installedSdk[lowerServiceName] && installLatestAwsSdk === 'true') {
            installLatestSdk(lowerServiceName);
            awsSdk = await Promise.resolve(`${`/tmp/node_modules/@aws-sdk/client-${lowerServiceName}`}`).then(s => require(s)).catch(async (e) => {
                console.log(`Failed to install latest AWS SDK v3: ${e}`);
                return Promise.resolve(`${`@aws-sdk/client-${lowerServiceName}`}`).then(s => require(s)); // Fallback to pre-installed version
            });
        }
        else if (installedSdk[lowerServiceName]) {
            awsSdk = await Promise.resolve(`${`/tmp/node_modules/@aws-sdk/client-${lowerServiceName}`}`).then(s => require(s));
        }
        else {
            awsSdk = await Promise.resolve(`${`@aws-sdk/client-${lowerServiceName}`}`).then(s => require(s));
        }
    }
    catch (error) {
        throw Error(`Service ${serviceName} does not exist in AWS SDK.`);
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
            let awsSdk = loadAwsSdk(call.service, event.ResourceProperties.InstallLatestAwsSdk);
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
                    params: params,
                });
            }
            awsSdk = await awsSdk;
            const ServiceClient = Object.entries(awsSdk).find(([name]) => name.toLowerCase() === `${call.service}Client`.toLowerCase())?.[1];
            const client = new ServiceClient({
                apiVersion: call.apiVersion,
                credentials: credentials,
                region: call.region,
            });
            const Command = Object.entries(awsSdk).find(([name]) => name.toLowerCase() === `${call.action}Command`.toLowerCase())?.[1];
            let flatData = {};
            try {
                const response = await client.send(new Command(call.parameters &&
                    (0, shared_1.decodeSpecialValues)(call.parameters, physicalResourceId)));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLXNkay12My1oYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXdzLXNkay12My1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLCtCQUErQjtBQUMvQixpREFBeUM7QUFPekMscUNBQTBHO0FBRzFHLElBQUksWUFBWSxHQUFtQyxFQUFFLENBQUM7QUFFdEQsU0FBZ0Isb0JBQW9CO0lBQ2xDLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDcEIsQ0FBQztBQUZELG9EQUVDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLGdCQUFnQixDQUFDLFdBQW1CO0lBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUM1QyxvRkFBb0Y7SUFDcEYsSUFBQSx3QkFBUSxFQUNOLHlDQUF5QyxXQUFXLHlEQUF5RCxDQUM5RyxDQUFDO0lBQ0YsWUFBWSxHQUFHO1FBQ2IsR0FBRyxZQUFZO1FBQ2YsQ0FBQyxXQUFXLENBQUMsRUFBRSxJQUFJO0tBQ3BCLENBQUM7QUFDSixDQUFDO0FBS0QsS0FBSyxVQUFVLFVBQVUsQ0FDdkIsV0FBbUIsRUFDbkIsbUJBQXNDO0lBRXRDLE1BQU0sZ0JBQWdCLEdBQUcsV0FBVyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ25ELElBQUksTUFBYyxDQUFDO0lBQ25CLElBQUk7UUFDRixJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLElBQUksbUJBQW1CLEtBQUssTUFBTSxFQUFFO1lBQ3JFLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDbkMsTUFBTSxHQUFHLE1BQU0sbUJBQU8scUNBQXFDLGdCQUFnQixFQUFFLDBCQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQy9GLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ3pELDBCQUFjLG1CQUFtQixnQkFBZ0IsRUFBRSwwQkFBRSxDQUFDLG9DQUFv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Z0IsRUFBRSxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQzFGO0FBQ0gsQ0FBQztBQXJHRCwwQkFxR0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5pbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuLy8gaW1wb3J0IHRoZSBBV1NMYW1iZGEgcGFja2FnZSBleHBsaWNpdGx5LFxuLy8gd2hpY2ggaXMgZ2xvYmFsbHkgYXZhaWxhYmxlIGluIHRoZSBMYW1iZGEgcnVudGltZSxcbi8vIGFzIG90aGVyd2lzZSBsaW5raW5nIHRoaXMgcmVwb3NpdG9yeSB3aXRoIGxpbmstYWxsLnNoXG4vLyBmYWlscyBpbiB0aGUgQ0RLIGFwcCBleGVjdXRlZCB3aXRoIHRzLW5vZGVcbi8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMsaW1wb3J0L25vLXVucmVzb2x2ZWQgKi9cbmltcG9ydCAqIGFzIEFXU0xhbWJkYSBmcm9tICdhd3MtbGFtYmRhJztcbmltcG9ydCB7IGRlY29kZUNhbGwsIGRlY29kZVNwZWNpYWxWYWx1ZXMsIGZpbHRlcktleXMsIGZsYXR0ZW4sIHJlc3BvbmQsIHN0YXJ0c1dpdGhPbmVPZiB9IGZyb20gJy4vc2hhcmVkJztcbmltcG9ydCB7IEF3c1Nka0NhbGwgfSBmcm9tICcuLi9hd3MtY3VzdG9tLXJlc291cmNlJztcblxubGV0IGluc3RhbGxlZFNkazogeyBbc2VydmljZTogc3RyaW5nXTogYm9vbGVhbiB9ID0ge307XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JjZVNka0luc3RhbGxhdGlvbigpIHtcbiAgaW5zdGFsbGVkU2RrID0ge307XG59XG5cbi8qKlxuICogSW5zdGFsbHMgbGF0ZXN0IEFXUyBTREsgdjNcbiAqL1xuZnVuY3Rpb24gaW5zdGFsbExhdGVzdFNkayhzZXJ2aWNlTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gIGNvbnNvbGUubG9nKCdJbnN0YWxsaW5nIGxhdGVzdCBBV1MgU0RLIHYzJyk7XG4gIC8vIEJvdGggSE9NRSBhbmQgLS1wcmVmaXggYXJlIG5lZWRlZCBoZXJlIGJlY2F1c2UgL3RtcCBpcyB0aGUgb25seSB3cml0YWJsZSBsb2NhdGlvblxuICBleGVjU3luYyhcbiAgICBgSE9NRT0vdG1wIG5wbSBpbnN0YWxsIEBhd3Mtc2RrL2NsaWVudC0ke3NlcnZpY2VOYW1lfSAtLXByb2R1Y3Rpb24gLS1uby1wYWNrYWdlLWxvY2sgLS1uby1zYXZlIC0tcHJlZml4IC90bXBgLFxuICApO1xuICBpbnN0YWxsZWRTZGsgPSB7XG4gICAgLi4uaW5zdGFsbGVkU2RrLFxuICAgIFtzZXJ2aWNlTmFtZV06IHRydWUsXG4gIH07XG59XG5cbmludGVyZmFjZSBBd3NTZGsge1xuICBba2V5OiBzdHJpbmddOiBhbnlcbn1cbmFzeW5jIGZ1bmN0aW9uIGxvYWRBd3NTZGsoXG4gIHNlcnZpY2VOYW1lOiBzdHJpbmcsXG4gIGluc3RhbGxMYXRlc3RBd3NTZGs/OiAndHJ1ZScgfCAnZmFsc2UnLFxuKSB7XG4gIGNvbnN0IGxvd2VyU2VydmljZU5hbWUgPSBzZXJ2aWNlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICBsZXQgYXdzU2RrOiBBd3NTZGs7XG4gIHRyeSB7XG4gICAgaWYgKCFpbnN0YWxsZWRTZGtbbG93ZXJTZXJ2aWNlTmFtZV0gJiYgaW5zdGFsbExhdGVzdEF3c1NkayA9PT0gJ3RydWUnKSB7XG4gICAgICBpbnN0YWxsTGF0ZXN0U2RrKGxvd2VyU2VydmljZU5hbWUpO1xuICAgICAgYXdzU2RrID0gYXdhaXQgaW1wb3J0KGAvdG1wL25vZGVfbW9kdWxlcy9AYXdzLXNkay9jbGllbnQtJHtsb3dlclNlcnZpY2VOYW1lfWApLmNhdGNoKGFzeW5jIChlKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBGYWlsZWQgdG8gaW5zdGFsbCBsYXRlc3QgQVdTIFNESyB2MzogJHtlfWApO1xuICAgICAgICByZXR1cm4gaW1wb3J0KGBAYXdzLXNkay9jbGllbnQtJHtsb3dlclNlcnZpY2VOYW1lfWApOyAvLyBGYWxsYmFjayB0byBwcmUtaW5zdGFsbGVkIHZlcnNpb25cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoaW5zdGFsbGVkU2RrW2xvd2VyU2VydmljZU5hbWVdKSB7XG4gICAgICBhd3NTZGsgPSBhd2FpdCBpbXBvcnQoYC90bXAvbm9kZV9tb2R1bGVzL0Bhd3Mtc2RrL2NsaWVudC0ke2xvd2VyU2VydmljZU5hbWV9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3c1NkayA9IGF3YWl0IGltcG9ydChgQGF3cy1zZGsvY2xpZW50LSR7bG93ZXJTZXJ2aWNlTmFtZX1gKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhyb3cgRXJyb3IoYFNlcnZpY2UgJHtzZXJ2aWNlTmFtZX0gZG9lcyBub3QgZXhpc3QgaW4gQVdTIFNESy5gKTtcbiAgfVxuICByZXR1cm4gYXdzU2RrO1xufVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzLCBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMgKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50LCBjb250ZXh0OiBBV1NMYW1iZGEuQ29udGV4dCkge1xuICB0cnkge1xuICAgIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5DcmVhdGUgPSBkZWNvZGVDYWxsKGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5DcmVhdGUpO1xuICAgIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5VcGRhdGUgPSBkZWNvZGVDYWxsKGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5VcGRhdGUpO1xuICAgIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EZWxldGUgPSBkZWNvZGVDYWxsKGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EZWxldGUpO1xuICAgIGxldCBkYXRhOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG5cbiAgICAvLyBEZWZhdWx0IHBoeXNpY2FsIHJlc291cmNlIGlkXG4gICAgbGV0IHBoeXNpY2FsUmVzb3VyY2VJZDogc3RyaW5nO1xuICAgIHN3aXRjaCAoZXZlbnQuUmVxdWVzdFR5cGUpIHtcbiAgICAgIGNhc2UgJ0NyZWF0ZSc6XG4gICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZCA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5DcmVhdGU/LnBoeXNpY2FsUmVzb3VyY2VJZD8uaWQgPz9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlVwZGF0ZT8ucGh5c2ljYWxSZXNvdXJjZUlkPy5pZCA/P1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuRGVsZXRlPy5waHlzaWNhbFJlc291cmNlSWQ/LmlkID8/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LkxvZ2ljYWxSZXNvdXJjZUlkO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ1VwZGF0ZSc6XG4gICAgICBjYXNlICdEZWxldGUnOlxuICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXNbZXZlbnQuUmVxdWVzdFR5cGVdPy5waHlzaWNhbFJlc291cmNlSWQ/LmlkID8/IGV2ZW50LlBoeXNpY2FsUmVzb3VyY2VJZDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNvbnN0IGNhbGw6IEF3c1Nka0NhbGwgfCB1bmRlZmluZWQgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXNbZXZlbnQuUmVxdWVzdFR5cGVdO1xuICAgIGlmIChjYWxsKSB7XG4gICAgICBsZXQgYXdzU2RrOiBBd3NTZGsgfCBQcm9taXNlPEF3c1Nkaz4gPSBsb2FkQXdzU2RrKFxuICAgICAgICBjYWxsLnNlcnZpY2UsXG4gICAgICAgIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5JbnN0YWxsTGF0ZXN0QXdzU2RrLFxuICAgICAgKTtcblxuICAgICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoeyAuLi5ldmVudCwgUmVzcG9uc2VVUkw6ICcuLi4nIH0pKTtcblxuICAgICAgbGV0IGNyZWRlbnRpYWxzO1xuICAgICAgaWYgKGNhbGwuYXNzdW1lZFJvbGVBcm4pIHtcbiAgICAgICAgY29uc3QgdGltZXN0YW1wID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcblxuICAgICAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgICAgUm9sZUFybjogY2FsbC5hc3N1bWVkUm9sZUFybixcbiAgICAgICAgICBSb2xlU2Vzc2lvbk5hbWU6IGAke3RpbWVzdGFtcH0tJHtwaHlzaWNhbFJlc291cmNlSWR9YC5zdWJzdHJpbmcoMCwgNjQpLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IHsgZnJvbVRlbXBvcmFyeUNyZWRlbnRpYWxzIH0gPSBhd2FpdCBpbXBvcnQoJ0Bhd3Mtc2RrL2NyZWRlbnRpYWwtcHJvdmlkZXJzJyBhcyBzdHJpbmcpO1xuICAgICAgICBjcmVkZW50aWFscyA9IGZyb21UZW1wb3JhcnlDcmVkZW50aWFscyh7XG4gICAgICAgICAgcGFyYW1zOiBwYXJhbXMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBhd3NTZGsgPSBhd2FpdCBhd3NTZGs7XG4gICAgICBjb25zdCBTZXJ2aWNlQ2xpZW50ID0gT2JqZWN0LmVudHJpZXMoYXdzU2RrKS5maW5kKFxuICAgICAgICAoW25hbWVdKSA9PiBuYW1lLnRvTG93ZXJDYXNlKCkgPT09IGAke2NhbGwuc2VydmljZX1DbGllbnRgLnRvTG93ZXJDYXNlKCksXG4gICAgICApPy5bMV0gYXMgeyBuZXcgKGNvbmZpZzogYW55KTogYW55IH07XG4gICAgICBjb25zdCBjbGllbnQgPSBuZXcgU2VydmljZUNsaWVudCh7XG4gICAgICAgIGFwaVZlcnNpb246IGNhbGwuYXBpVmVyc2lvbixcbiAgICAgICAgY3JlZGVudGlhbHM6IGNyZWRlbnRpYWxzLFxuICAgICAgICByZWdpb246IGNhbGwucmVnaW9uLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IENvbW1hbmQgPSBPYmplY3QuZW50cmllcyhhd3NTZGspLmZpbmQoXG4gICAgICAgIChbbmFtZV0pID0+IG5hbWUudG9Mb3dlckNhc2UoKSA9PT0gYCR7Y2FsbC5hY3Rpb259Q29tbWFuZGAudG9Mb3dlckNhc2UoKSxcbiAgICAgICk/LlsxXSBhcyB7IG5ldyAoaW5wdXQ6IGFueSk6IGFueSB9O1xuXG4gICAgICBsZXQgZmxhdERhdGE6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgY2xpZW50LnNlbmQoXG4gICAgICAgICAgbmV3IENvbW1hbmQoXG4gICAgICAgICAgICBjYWxsLnBhcmFtZXRlcnMgJiZcbiAgICAgICAgICAgICAgZGVjb2RlU3BlY2lhbFZhbHVlcyhjYWxsLnBhcmFtZXRlcnMsIHBoeXNpY2FsUmVzb3VyY2VJZCksXG4gICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICAgICAgZmxhdERhdGEgPSB7XG4gICAgICAgICAgYXBpVmVyc2lvbjogY2xpZW50LmNvbmZpZy5hcGlWZXJzaW9uLCAvLyBGb3IgdGVzdCBwdXJwb3NlczogY2hlY2sgaWYgYXBpVmVyc2lvbiB3YXMgY29ycmVjdGx5IHBhc3NlZC5cbiAgICAgICAgICByZWdpb246IGF3YWl0IGNsaWVudC5jb25maWcucmVnaW9uKCkuY2F0Y2goKCkgPT4gdW5kZWZpbmVkKSwgLy8gRm9yIHRlc3QgcHVycG9zZXM6IGNoZWNrIGlmIHJlZ2lvbiB3YXMgY29ycmVjdGx5IHBhc3NlZC5cbiAgICAgICAgICAuLi5mbGF0dGVuKHJlc3BvbnNlKSxcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgb3V0cHV0UGF0aHM6IHN0cmluZ1tdIHwgdW5kZWZpbmVkO1xuICAgICAgICBpZiAoY2FsbC5vdXRwdXRQYXRoKSB7XG4gICAgICAgICAgb3V0cHV0UGF0aHMgPSBbY2FsbC5vdXRwdXRQYXRoXTtcbiAgICAgICAgfSBlbHNlIGlmIChjYWxsLm91dHB1dFBhdGhzKSB7XG4gICAgICAgICAgb3V0cHV0UGF0aHMgPSBjYWxsLm91dHB1dFBhdGhzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG91dHB1dFBhdGhzKSB7XG4gICAgICAgICAgZGF0YSA9IGZpbHRlcktleXMoZmxhdERhdGEsIHN0YXJ0c1dpdGhPbmVPZihvdXRwdXRQYXRocykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRhdGEgPSBmbGF0RGF0YTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIGlmICghY2FsbC5pZ25vcmVFcnJvckNvZGVzTWF0Y2hpbmcgfHwgIW5ldyBSZWdFeHAoY2FsbC5pZ25vcmVFcnJvckNvZGVzTWF0Y2hpbmcpLnRlc3QoZS5jb2RlKSkge1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGNhbGwucGh5c2ljYWxSZXNvdXJjZUlkPy5yZXNwb25zZVBhdGgpIHtcbiAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkID0gZmxhdERhdGFbY2FsbC5waHlzaWNhbFJlc291cmNlSWQucmVzcG9uc2VQYXRoXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCByZXNwb25kKGV2ZW50LCAnU1VDQ0VTUycsICdPSycsIHBoeXNpY2FsUmVzb3VyY2VJZCwgZGF0YSk7XG4gIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgIGNvbnNvbGUubG9nKGUpO1xuICAgIGF3YWl0IHJlc3BvbmQoZXZlbnQsICdGQUlMRUQnLCBlLm1lc3NhZ2UgfHwgJ0ludGVybmFsIEVycm9yJywgY29udGV4dC5sb2dTdHJlYW1OYW1lLCB7fSk7XG4gIH1cbn1cbiJdfQ==