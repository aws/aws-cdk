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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsK0JBQStCO0FBQy9CLGlEQUF5QztBQU96QyxzRkFBK0U7QUFFL0Usc0NBQTJHO0FBRTNHLElBQUksWUFBWSxHQUFtQyxFQUFFLENBQUM7QUFFdEQsU0FBZ0Isb0JBQW9CO0lBQ2xDLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDcEIsQ0FBQztBQUZELG9EQUVDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLGdCQUFnQixDQUFDLFdBQW1CO0lBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUM1QyxvRkFBb0Y7SUFDcEYsSUFBQSx3QkFBUSxFQUNOLHlCQUF5QixXQUFXLHVEQUF1RCxDQUM1RixDQUFDO0lBQ0YsWUFBWSxHQUFHO1FBQ2IsR0FBRyxZQUFZO1FBQ2YsQ0FBQyxXQUFXLENBQUMsRUFBRSxJQUFJO0tBQ3BCLENBQUM7QUFDSixDQUFDO0FBS0QsS0FBSyxVQUFVLFVBQVUsQ0FDdkIsV0FBbUIsRUFDbkIsbUJBQXNDOztJQUV0QyxJQUFJLE1BQWMsQ0FBQztJQUNuQixJQUFJO1FBQ0YsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsSUFBSSxtQkFBbUIsS0FBSyxNQUFNLEVBQUU7WUFDaEUsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDOUIsTUFBTSxHQUFHLE1BQU0sTUFBTyxxQkFBcUIsV0FBVyxFQUFFLDZDQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O2dCQUMxRSxPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN6RCxZQUFjLFdBQVcsNENBQUUsQ0FBQyxvQ0FBb0M7WUFDbEUsQ0FBQyxDQUFDLENBQUM7U0FDSjthQUFNLElBQUksWUFBWSxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQ3BDLE1BQU0sR0FBRyxZQUFhLHFCQUFxQixXQUFXLEVBQUUsNENBQUMsQ0FBQztTQUMzRDthQUFNO1lBQ0wsTUFBTSxHQUFHLFlBQWEsV0FBVyw0Q0FBQyxDQUFDO1NBQ3BDO0tBQ0Y7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLE1BQU0sS0FBSyxDQUFDLFdBQVcsV0FBVyxrQkFBa0IsQ0FBQyxDQUFDO0tBQ3ZEO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELDZGQUE2RjtBQUN0RixLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQWtELEVBQUUsT0FBMEI7SUFDMUcsSUFBSTtRQUNGLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEdBQUcsSUFBQSxtQkFBVSxFQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5RSxLQUFLLENBQUMsa0JBQWtCLENBQUMsTUFBTSxHQUFHLElBQUEsbUJBQVUsRUFBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUUsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sR0FBRyxJQUFBLG1CQUFVLEVBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzlFLElBQUksSUFBSSxHQUE4QixFQUFFLENBQUM7UUFFekMsK0JBQStCO1FBQy9CLElBQUksa0JBQTBCLENBQUM7UUFDL0IsUUFBUSxLQUFLLENBQUMsV0FBVyxFQUFFO1lBQ3pCLEtBQUssUUFBUTtnQkFDWCxrQkFBa0IsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLGtCQUFrQixFQUFFLEVBQUU7b0JBQ3ZELEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsRUFBRTtvQkFDdkQsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxFQUFFO29CQUN2RCxLQUFLLENBQUMsaUJBQWlCLENBQUM7Z0JBQzdDLE1BQU07WUFDUixLQUFLLFFBQVEsQ0FBQztZQUNkLEtBQUssUUFBUTtnQkFDWCxrQkFBa0IsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFLGtCQUFrQixFQUFFLEVBQUUsSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUM7Z0JBQ3JILE1BQU07U0FDVDtRQUNELE1BQU0sSUFBSSxHQUEyQixLQUFLLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2pGLElBQUksSUFBSSxFQUFFO1lBQ1IsOERBQThEO1lBQzlELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFBLG1EQUFzQixFQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMvRyxJQUFJLE1BQU0sR0FBNkIsVUFBVSxDQUMvQyxXQUFXLEVBQ1gsS0FBSyxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixDQUM3QyxDQUFDO1lBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxLQUFLLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUU5RCxJQUFJLFdBQVcsQ0FBQztZQUNoQixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7Z0JBQ3ZCLE1BQU0sU0FBUyxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUV6QyxNQUFNLE1BQU0sR0FBRztvQkFDYixPQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWM7b0JBQzVCLGVBQWUsRUFBRSxHQUFHLFNBQVMsSUFBSSxrQkFBa0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO2lCQUN2RSxDQUFDO2dCQUVGLE1BQU0sRUFBRSx3QkFBd0IsRUFBRSxHQUFHLFlBQWEsK0JBQXlDLDRDQUFDLENBQUM7Z0JBQzdGLFdBQVcsR0FBRyx3QkFBd0IsQ0FBQztvQkFDckMsTUFBTTtpQkFDUCxDQUFDLENBQUM7YUFDSjtZQUVELE1BQU0sR0FBRyxNQUFNLE1BQU0sQ0FBQztZQUN0QixNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUUsRUFBRSxDQUFDLENBQUMsQ0FLM0YsQ0FBQztZQUNGLE1BQU0sTUFBTSxHQUFHLElBQUksYUFBYSxDQUFDO2dCQUMvQixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7Z0JBQzNCLFdBQVcsRUFBRSxXQUFXO2dCQUN4QixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07YUFDcEIsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sU0FBUyxDQUFDO1lBQzVGLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUN6QyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxXQUFXLENBQUMsV0FBVyxFQUFFLENBQzdELEVBQUUsQ0FBQyxDQUFDLENBQThCLENBQUM7WUFFcEMsSUFBSSxRQUFRLEdBQThCLEVBQUUsQ0FBQztZQUM3QyxJQUFJO2dCQUNGLGdGQUFnRjtnQkFDaEYsTUFBTSxRQUFRLEdBQUcsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUNoQyxJQUFJLE9BQU8sQ0FDVCxDQUFDLElBQUksQ0FBQyxVQUFVO29CQUNoQixJQUFBLDRCQUFtQixFQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FDaEUsQ0FDRixDQUFDO2dCQUNGLFFBQVEsR0FBRztvQkFDVCxVQUFVLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVO29CQUNwQyxNQUFNLEVBQUUsTUFBTSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUM7b0JBQzNELEdBQUcsSUFBQSxnQkFBTyxFQUFDLFFBQVEsQ0FBQztpQkFDckIsQ0FBQztnQkFFRixJQUFJLFdBQWlDLENBQUM7Z0JBQ3RDLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtvQkFDbkIsV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2lCQUNqQztxQkFBTSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7b0JBQzNCLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO2lCQUNoQztnQkFFRCxJQUFJLFdBQVcsRUFBRTtvQkFDZixJQUFJLEdBQUcsSUFBQSxtQkFBVSxFQUFDLFFBQVEsRUFBRSxJQUFBLHdCQUFlLEVBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztpQkFDM0Q7cUJBQU07b0JBQ0wsSUFBSSxHQUFHLFFBQVEsQ0FBQztpQkFDakI7YUFDRjtZQUFDLE9BQU8sQ0FBTSxFQUFFO2dCQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsd0JBQXdCLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUM3RixNQUFNLENBQUMsQ0FBQztpQkFDVDthQUNGO1lBRUQsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsWUFBWSxFQUFFO2dCQUN6QyxrQkFBa0IsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ3JFO1NBQ0Y7UUFFRCxNQUFNLElBQUEsZ0JBQU8sRUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNqRTtJQUFDLE9BQU8sQ0FBTSxFQUFFO1FBQ2YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNmLE1BQU0sSUFBQSxnQkFBTyxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQzFGO0FBQ0gsQ0FBQztBQTNHRCwwQkEyR0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5pbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuLy8gaW1wb3J0IHRoZSBBV1NMYW1iZGEgcGFja2FnZSBleHBsaWNpdGx5LFxuLy8gd2hpY2ggaXMgZ2xvYmFsbHkgYXZhaWxhYmxlIGluIHRoZSBMYW1iZGEgcnVudGltZSxcbi8vIGFzIG90aGVyd2lzZSBsaW5raW5nIHRoaXMgcmVwb3NpdG9yeSB3aXRoIGxpbmstYWxsLnNoXG4vLyBmYWlscyBpbiB0aGUgQ0RLIGFwcCBleGVjdXRlZCB3aXRoIHRzLW5vZGVcbi8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMsaW1wb3J0L25vLXVucmVzb2x2ZWQgKi9cbmltcG9ydCAqIGFzIEFXU0xhbWJkYSBmcm9tICdhd3MtbGFtYmRhJztcbmltcG9ydCB7IGdldFYzQ2xpZW50UGFja2FnZU5hbWUgfSBmcm9tICcuL3YyLXRvLXYzL2dldC12My1jbGllbnQtcGFja2FnZS1uYW1lJztcbmltcG9ydCB7IEF3c1Nka0NhbGwgfSBmcm9tICcuLi8uLi9hd3MtY3VzdG9tLXJlc291cmNlJztcbmltcG9ydCB7IGRlY29kZUNhbGwsIGRlY29kZVNwZWNpYWxWYWx1ZXMsIGZpbHRlcktleXMsIGZsYXR0ZW4sIHJlc3BvbmQsIHN0YXJ0c1dpdGhPbmVPZiB9IGZyb20gJy4uL3NoYXJlZCc7XG5cbmxldCBpbnN0YWxsZWRTZGs6IHsgW3NlcnZpY2U6IHN0cmluZ106IGJvb2xlYW4gfSA9IHt9O1xuXG5leHBvcnQgZnVuY3Rpb24gZm9yY2VTZGtJbnN0YWxsYXRpb24oKSB7XG4gIGluc3RhbGxlZFNkayA9IHt9O1xufVxuXG4vKipcbiAqIEluc3RhbGxzIGxhdGVzdCBBV1MgU0RLIHYzXG4gKi9cbmZ1bmN0aW9uIGluc3RhbGxMYXRlc3RTZGsocGFja2FnZU5hbWU6IHN0cmluZyk6IHZvaWQge1xuICBjb25zb2xlLmxvZygnSW5zdGFsbGluZyBsYXRlc3QgQVdTIFNESyB2MycpO1xuICAvLyBCb3RoIEhPTUUgYW5kIC0tcHJlZml4IGFyZSBuZWVkZWQgaGVyZSBiZWNhdXNlIC90bXAgaXMgdGhlIG9ubHkgd3JpdGFibGUgbG9jYXRpb25cbiAgZXhlY1N5bmMoXG4gICAgYEhPTUU9L3RtcCBucG0gaW5zdGFsbCAke3BhY2thZ2VOYW1lfSAtLW9taXQ9ZGV2IC0tbm8tcGFja2FnZS1sb2NrIC0tbm8tc2F2ZSAtLXByZWZpeCAvdG1wYCxcbiAgKTtcbiAgaW5zdGFsbGVkU2RrID0ge1xuICAgIC4uLmluc3RhbGxlZFNkayxcbiAgICBbcGFja2FnZU5hbWVdOiB0cnVlLFxuICB9O1xufVxuXG5pbnRlcmZhY2UgQXdzU2RrIHtcbiAgW2tleTogc3RyaW5nXTogYW55XG59XG5hc3luYyBmdW5jdGlvbiBsb2FkQXdzU2RrKFxuICBwYWNrYWdlTmFtZTogc3RyaW5nLFxuICBpbnN0YWxsTGF0ZXN0QXdzU2RrPzogJ3RydWUnIHwgJ2ZhbHNlJyxcbikge1xuICBsZXQgYXdzU2RrOiBBd3NTZGs7XG4gIHRyeSB7XG4gICAgaWYgKCFpbnN0YWxsZWRTZGtbcGFja2FnZU5hbWVdICYmIGluc3RhbGxMYXRlc3RBd3NTZGsgPT09ICd0cnVlJykge1xuICAgICAgaW5zdGFsbExhdGVzdFNkayhwYWNrYWdlTmFtZSk7XG4gICAgICBhd3NTZGsgPSBhd2FpdCBpbXBvcnQoYC90bXAvbm9kZV9tb2R1bGVzLyR7cGFja2FnZU5hbWV9YCkuY2F0Y2goYXN5bmMgKGUpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coYEZhaWxlZCB0byBpbnN0YWxsIGxhdGVzdCBBV1MgU0RLIHYzOiAke2V9YCk7XG4gICAgICAgIHJldHVybiBpbXBvcnQocGFja2FnZU5hbWUpOyAvLyBGYWxsYmFjayB0byBwcmUtaW5zdGFsbGVkIHZlcnNpb25cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoaW5zdGFsbGVkU2RrW3BhY2thZ2VOYW1lXSkge1xuICAgICAgYXdzU2RrID0gYXdhaXQgaW1wb3J0KGAvdG1wL25vZGVfbW9kdWxlcy8ke3BhY2thZ2VOYW1lfWApO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd3NTZGsgPSBhd2FpdCBpbXBvcnQocGFja2FnZU5hbWUpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB0aHJvdyBFcnJvcihgUGFja2FnZSAke3BhY2thZ2VOYW1lfSBkb2VzIG5vdCBleGlzdC5gKTtcbiAgfVxuICByZXR1cm4gYXdzU2RrO1xufVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzLCBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMgKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50LCBjb250ZXh0OiBBV1NMYW1iZGEuQ29udGV4dCkge1xuICB0cnkge1xuICAgIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5DcmVhdGUgPSBkZWNvZGVDYWxsKGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5DcmVhdGUpO1xuICAgIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5VcGRhdGUgPSBkZWNvZGVDYWxsKGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5VcGRhdGUpO1xuICAgIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EZWxldGUgPSBkZWNvZGVDYWxsKGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EZWxldGUpO1xuICAgIGxldCBkYXRhOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG5cbiAgICAvLyBEZWZhdWx0IHBoeXNpY2FsIHJlc291cmNlIGlkXG4gICAgbGV0IHBoeXNpY2FsUmVzb3VyY2VJZDogc3RyaW5nO1xuICAgIHN3aXRjaCAoZXZlbnQuUmVxdWVzdFR5cGUpIHtcbiAgICAgIGNhc2UgJ0NyZWF0ZSc6XG4gICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZCA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5DcmVhdGU/LnBoeXNpY2FsUmVzb3VyY2VJZD8uaWQgPz9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlVwZGF0ZT8ucGh5c2ljYWxSZXNvdXJjZUlkPy5pZCA/P1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuRGVsZXRlPy5waHlzaWNhbFJlc291cmNlSWQ/LmlkID8/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LkxvZ2ljYWxSZXNvdXJjZUlkO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ1VwZGF0ZSc6XG4gICAgICBjYXNlICdEZWxldGUnOlxuICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXNbZXZlbnQuUmVxdWVzdFR5cGVdPy5waHlzaWNhbFJlc291cmNlSWQ/LmlkID8/IGV2ZW50LlBoeXNpY2FsUmVzb3VyY2VJZDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNvbnN0IGNhbGw6IEF3c1Nka0NhbGwgfCB1bmRlZmluZWQgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXNbZXZlbnQuUmVxdWVzdFR5cGVdO1xuICAgIGlmIChjYWxsKSB7XG4gICAgICAvLyB3aGVuIHByb3ZpZGUgdjIgc2VydmljZSBuYW1lLCB0cmFuc2Zvcm0gaXQgdjMgcGFja2FnZSBuYW1lLlxuICAgICAgY29uc3QgcGFja2FnZU5hbWUgPSBjYWxsLnNlcnZpY2Uuc3RhcnRzV2l0aCgnQGF3cy1zZGsvJykgPyBjYWxsLnNlcnZpY2UgOiBnZXRWM0NsaWVudFBhY2thZ2VOYW1lKGNhbGwuc2VydmljZSk7XG4gICAgICBsZXQgYXdzU2RrOiBBd3NTZGsgfCBQcm9taXNlPEF3c1Nkaz4gPSBsb2FkQXdzU2RrKFxuICAgICAgICBwYWNrYWdlTmFtZSxcbiAgICAgICAgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkluc3RhbGxMYXRlc3RBd3NTZGssXG4gICAgICApO1xuXG4gICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSh7IC4uLmV2ZW50LCBSZXNwb25zZVVSTDogJy4uLicgfSkpO1xuXG4gICAgICBsZXQgY3JlZGVudGlhbHM7XG4gICAgICBpZiAoY2FsbC5hc3N1bWVkUm9sZUFybikge1xuICAgICAgICBjb25zdCB0aW1lc3RhbXAgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgICAgICBSb2xlQXJuOiBjYWxsLmFzc3VtZWRSb2xlQXJuLFxuICAgICAgICAgIFJvbGVTZXNzaW9uTmFtZTogYCR7dGltZXN0YW1wfS0ke3BoeXNpY2FsUmVzb3VyY2VJZH1gLnN1YnN0cmluZygwLCA2NCksXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgeyBmcm9tVGVtcG9yYXJ5Q3JlZGVudGlhbHMgfSA9IGF3YWl0IGltcG9ydCgnQGF3cy1zZGsvY3JlZGVudGlhbC1wcm92aWRlcnMnIGFzIHN0cmluZyk7XG4gICAgICAgIGNyZWRlbnRpYWxzID0gZnJvbVRlbXBvcmFyeUNyZWRlbnRpYWxzKHtcbiAgICAgICAgICBwYXJhbXMsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBhd3NTZGsgPSBhd2FpdCBhd3NTZGs7XG4gICAgICBjb25zdCBTZXJ2aWNlQ2xpZW50ID0gT2JqZWN0LmVudHJpZXMoYXdzU2RrKS5maW5kKCAoW25hbWVdKSA9PiBuYW1lLmVuZHNXaXRoKCdDbGllbnQnKSApPy5bMV0gYXMge1xuICAgICAgICBuZXcgKGNvbmZpZzogYW55KToge1xuICAgICAgICAgIHNlbmQ6IChjb21tYW5kOiBhbnkpID0+IFByb21pc2U8YW55PlxuICAgICAgICAgIGNvbmZpZzogYW55XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjb25zdCBjbGllbnQgPSBuZXcgU2VydmljZUNsaWVudCh7XG4gICAgICAgIGFwaVZlcnNpb246IGNhbGwuYXBpVmVyc2lvbixcbiAgICAgICAgY3JlZGVudGlhbHM6IGNyZWRlbnRpYWxzLFxuICAgICAgICByZWdpb246IGNhbGwucmVnaW9uLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBjb21tYW5kTmFtZSA9IGNhbGwuYWN0aW9uLmVuZHNXaXRoKCdDb21tYW5kJykgPyBjYWxsLmFjdGlvbiA6IGAke2NhbGwuYWN0aW9ufUNvbW1hbmRgO1xuICAgICAgY29uc3QgQ29tbWFuZCA9IE9iamVjdC5lbnRyaWVzKGF3c1NkaykuZmluZChcbiAgICAgICAgKFtuYW1lXSkgPT4gbmFtZS50b0xvd2VyQ2FzZSgpID09PSBjb21tYW5kTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgKT8uWzFdIGFzIHsgbmV3IChpbnB1dDogYW55KTogYW55IH07XG5cbiAgICAgIGxldCBmbGF0RGF0YTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gQ29tbWFuZCBtdXN0IHBhc3MgaW5wdXQgdmFsdWUgaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3Mtc2RrLWpzLXYzL2lzc3Vlcy80MjRcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBjbGllbnQuc2VuZChcbiAgICAgICAgICBuZXcgQ29tbWFuZChcbiAgICAgICAgICAgIChjYWxsLnBhcmFtZXRlcnMgJiZcbiAgICAgICAgICAgIGRlY29kZVNwZWNpYWxWYWx1ZXMoY2FsbC5wYXJhbWV0ZXJzLCBwaHlzaWNhbFJlc291cmNlSWQpKSA/PyB7fSxcbiAgICAgICAgICApLFxuICAgICAgICApO1xuICAgICAgICBmbGF0RGF0YSA9IHtcbiAgICAgICAgICBhcGlWZXJzaW9uOiBjbGllbnQuY29uZmlnLmFwaVZlcnNpb24sIC8vIEZvciB0ZXN0IHB1cnBvc2VzOiBjaGVjayBpZiBhcGlWZXJzaW9uIHdhcyBjb3JyZWN0bHkgcGFzc2VkLlxuICAgICAgICAgIHJlZ2lvbjogYXdhaXQgY2xpZW50LmNvbmZpZy5yZWdpb24oKS5jYXRjaCgoKSA9PiB1bmRlZmluZWQpLCAvLyBGb3IgdGVzdCBwdXJwb3NlczogY2hlY2sgaWYgcmVnaW9uIHdhcyBjb3JyZWN0bHkgcGFzc2VkLlxuICAgICAgICAgIC4uLmZsYXR0ZW4ocmVzcG9uc2UpLFxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBvdXRwdXRQYXRoczogc3RyaW5nW10gfCB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChjYWxsLm91dHB1dFBhdGgpIHtcbiAgICAgICAgICBvdXRwdXRQYXRocyA9IFtjYWxsLm91dHB1dFBhdGhdO1xuICAgICAgICB9IGVsc2UgaWYgKGNhbGwub3V0cHV0UGF0aHMpIHtcbiAgICAgICAgICBvdXRwdXRQYXRocyA9IGNhbGwub3V0cHV0UGF0aHM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3V0cHV0UGF0aHMpIHtcbiAgICAgICAgICBkYXRhID0gZmlsdGVyS2V5cyhmbGF0RGF0YSwgc3RhcnRzV2l0aE9uZU9mKG91dHB1dFBhdGhzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGF0YSA9IGZsYXREYXRhO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgICAgaWYgKCFjYWxsLmlnbm9yZUVycm9yQ29kZXNNYXRjaGluZyB8fCAhbmV3IFJlZ0V4cChjYWxsLmlnbm9yZUVycm9yQ29kZXNNYXRjaGluZykudGVzdChlLmNvZGUpKSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoY2FsbC5waHlzaWNhbFJlc291cmNlSWQ/LnJlc3BvbnNlUGF0aCkge1xuICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQgPSBmbGF0RGF0YVtjYWxsLnBoeXNpY2FsUmVzb3VyY2VJZC5yZXNwb25zZVBhdGhdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGF3YWl0IHJlc3BvbmQoZXZlbnQsICdTVUNDRVNTJywgJ09LJywgcGh5c2ljYWxSZXNvdXJjZUlkLCBkYXRhKTtcbiAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgY29uc29sZS5sb2coZSk7XG4gICAgYXdhaXQgcmVzcG9uZChldmVudCwgJ0ZBSUxFRCcsIGUubWVzc2FnZSB8fCAnSW50ZXJuYWwgRXJyb3InLCBjb250ZXh0LmxvZ1N0cmVhbU5hbWUsIHt9KTtcbiAgfVxufSJdfQ==