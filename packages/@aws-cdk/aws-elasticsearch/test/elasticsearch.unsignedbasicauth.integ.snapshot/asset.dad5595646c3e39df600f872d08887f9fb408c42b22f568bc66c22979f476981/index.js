"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.forceSdkInstallation = exports.flatten = exports.PHYSICAL_RESOURCE_ID_REFERENCE = void 0;
/* eslint-disable no-console */
const child_process_1 = require("child_process");
const fs = require("fs");
const path_1 = require("path");
/**
 * Serialized form of the physical resource id for use in the operation parameters
 */
exports.PHYSICAL_RESOURCE_ID_REFERENCE = 'PHYSICAL:RESOURCEID:';
/**
 * Flattens a nested object
 *
 * @param object the object to be flattened
 * @returns a flat object with path as keys
 */
function flatten(object) {
    return Object.assign({}, ...function _flatten(child, path = []) {
        return [].concat(...Object.keys(child)
            .map(key => {
            const childKey = Buffer.isBuffer(child[key]) ? child[key].toString('utf8') : child[key];
            return typeof childKey === 'object' && childKey !== null
                ? _flatten(childKey, path.concat([key]))
                : ({ [path.concat([key]).join('.')]: childKey });
        }));
    }(object));
}
exports.flatten = flatten;
/**
 * Decodes encoded special values (physicalResourceId)
 */
function decodeSpecialValues(object, physicalResourceId) {
    return JSON.parse(JSON.stringify(object), (_k, v) => {
        switch (v) {
            case exports.PHYSICAL_RESOURCE_ID_REFERENCE:
                return physicalResourceId;
            default:
                return v;
        }
    });
}
/**
 * Filters the keys of an object.
 */
function filterKeys(object, pred) {
    return Object.entries(object)
        .reduce((acc, [k, v]) => pred(k)
        ? { ...acc, [k]: v }
        : acc, {});
}
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
    child_process_1.execSync('HOME=/tmp npm install aws-sdk@2 --production --no-package-lock --no-save --prefix /tmp');
    latestSdkInstalled = true;
}
const patchedServices = [
    { serviceName: 'OpenSearch', apiVersions: ['2021-01-01'] },
];
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
                    const model = JSON.parse(fs.readFileSync(path_1.join(__dirname, `${modelFilePrefix}.service.json`), 'utf-8'));
                    model.paginators = JSON.parse(fs.readFileSync(path_1.join(__dirname, `${modelFilePrefix}.paginators.json`), 'utf-8')).pagination;
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
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _l, _m, _o, _p;
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
        console.log(JSON.stringify(event));
        console.log('AWS SDK VERSION: ' + AWS.VERSION);
        event.ResourceProperties.Create = decodeCall(event.ResourceProperties.Create);
        event.ResourceProperties.Update = decodeCall(event.ResourceProperties.Update);
        event.ResourceProperties.Delete = decodeCall(event.ResourceProperties.Delete);
        // Default physical resource id
        let physicalResourceId;
        switch (event.RequestType) {
            case 'Create':
                physicalResourceId = (_j = (_f = (_c = (_b = (_a = event.ResourceProperties.Create) === null || _a === void 0 ? void 0 : _a.physicalResourceId) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : (_e = (_d = event.ResourceProperties.Update) === null || _d === void 0 ? void 0 : _d.physicalResourceId) === null || _e === void 0 ? void 0 : _e.id) !== null && _f !== void 0 ? _f : (_h = (_g = event.ResourceProperties.Delete) === null || _g === void 0 ? void 0 : _g.physicalResourceId) === null || _h === void 0 ? void 0 : _h.id) !== null && _j !== void 0 ? _j : event.LogicalResourceId;
                break;
            case 'Update':
            case 'Delete':
                physicalResourceId = (_o = (_m = (_l = event.ResourceProperties[event.RequestType]) === null || _l === void 0 ? void 0 : _l.physicalResourceId) === null || _m === void 0 ? void 0 : _m.id) !== null && _o !== void 0 ? _o : event.PhysicalResourceId;
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
                const response = await awsService[call.action](call.parameters && decodeSpecialValues(call.parameters, physicalResourceId)).promise();
                flatData = {
                    apiVersion: awsService.config.apiVersion,
                    region: awsService.config.region,
                    ...flatten(response),
                };
                let outputPaths;
                if (call.outputPath) {
                    outputPaths = [call.outputPath];
                }
                else if (call.outputPaths) {
                    outputPaths = call.outputPaths;
                }
                if (outputPaths) {
                    data = filterKeys(flatData, startsWithOneOf(outputPaths));
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
            if ((_p = call.physicalResourceId) === null || _p === void 0 ? void 0 : _p.responsePath) {
                physicalResourceId = flatData[call.physicalResourceId.responsePath];
            }
        }
        await respond('SUCCESS', 'OK', physicalResourceId, data);
    }
    catch (e) {
        console.log(e);
        await respond('FAILED', e.message || 'Internal Error', context.logStreamName, {});
    }
    function respond(responseStatus, reason, physicalResourceId, data) {
        const responseBody = JSON.stringify({
            Status: responseStatus,
            Reason: reason,
            PhysicalResourceId: physicalResourceId,
            StackId: event.StackId,
            RequestId: event.RequestId,
            LogicalResourceId: event.LogicalResourceId,
            NoEcho: false,
            Data: data,
        });
        console.log('Responding', responseBody);
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const parsedUrl = require('url').parse(event.ResponseURL);
        const requestOptions = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.path,
            method: 'PUT',
            headers: { 'content-type': '', 'content-length': responseBody.length },
        };
        return new Promise((resolve, reject) => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-require-imports
                const request = require('https').request(requestOptions, resolve);
                request.on('error', reject);
                request.write(responseBody);
                request.end();
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
exports.handler = handler;
function decodeCall(call) {
    if (!call) {
        return undefined;
    }
    return JSON.parse(call);
}
function startsWithOneOf(searchStrings) {
    return function (string) {
        for (const searchString of searchStrings) {
            if (string.startsWith(searchString)) {
                return true;
            }
        }
        return false;
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBK0I7QUFDL0IsaURBQXlDO0FBQ3pDLHlCQUF5QjtBQUN6QiwrQkFBNEI7QUFTNUI7O0dBRUc7QUFDVSxRQUFBLDhCQUE4QixHQUFHLHNCQUFzQixDQUFDO0FBRXJFOzs7OztHQUtHO0FBQ0gsU0FBZ0IsT0FBTyxDQUFDLE1BQWM7SUFDcEMsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUNsQixFQUFFLEVBQ0YsR0FBRyxTQUFTLFFBQVEsQ0FBQyxLQUFVLEVBQUUsT0FBaUIsRUFBRTtRQUNsRCxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQzthQUNuQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDVCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEYsT0FBTyxPQUFPLFFBQVEsS0FBSyxRQUFRLElBQUksUUFBUSxLQUFLLElBQUk7Z0JBQ3RELENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUNWLENBQUM7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QUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDbEUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQzVCLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQzVCLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQzthQUNmO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1YsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ1g7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7QUFDSCxDQUFDO0FBakpELDBCQWlKQztBQUVELFNBQVMsVUFBVSxDQUFDLElBQXdCO0lBQzFDLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFBRSxPQUFPLFNBQVMsQ0FBQztLQUFFO0lBQ2hDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMxQixDQUFDO0FBRUQsU0FBUyxlQUFlLENBQUMsYUFBdUI7SUFDOUMsT0FBTyxVQUFTLE1BQWM7UUFDNUIsS0FBSyxNQUFNLFlBQVksSUFBSSxhQUFhLEVBQUU7WUFDeEMsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxFQUFFO2dCQUNuQyxPQUFPLElBQUksQ0FBQzthQUNiO1NBQ0Y7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUMsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5pbXBvcnQgeyBleGVjU3luYyB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuLy8gaW1wb3J0IHRoZSBBV1NMYW1iZGEgcGFja2FnZSBleHBsaWNpdGx5LFxuLy8gd2hpY2ggaXMgZ2xvYmFsbHkgYXZhaWxhYmxlIGluIHRoZSBMYW1iZGEgcnVudGltZSxcbi8vIGFzIG90aGVyd2lzZSBsaW5raW5nIHRoaXMgcmVwb3NpdG9yeSB3aXRoIGxpbmstYWxsLnNoXG4vLyBmYWlscyBpbiB0aGUgQ0RLIGFwcCBleGVjdXRlZCB3aXRoIHRzLW5vZGVcbi8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMsaW1wb3J0L25vLXVucmVzb2x2ZWQgKi9cbmltcG9ydCAqIGFzIEFXU0xhbWJkYSBmcm9tICdhd3MtbGFtYmRhJztcbmltcG9ydCB7IEF3c1Nka0NhbGwgfSBmcm9tICcuLi9hd3MtY3VzdG9tLXJlc291cmNlJztcblxuLyoqXG4gKiBTZXJpYWxpemVkIGZvcm0gb2YgdGhlIHBoeXNpY2FsIHJlc291cmNlIGlkIGZvciB1c2UgaW4gdGhlIG9wZXJhdGlvbiBwYXJhbWV0ZXJzXG4gKi9cbmV4cG9ydCBjb25zdCBQSFlTSUNBTF9SRVNPVVJDRV9JRF9SRUZFUkVOQ0UgPSAnUEhZU0lDQUw6UkVTT1VSQ0VJRDonO1xuXG4vKipcbiAqIEZsYXR0ZW5zIGEgbmVzdGVkIG9iamVjdFxuICpcbiAqIEBwYXJhbSBvYmplY3QgdGhlIG9iamVjdCB0byBiZSBmbGF0dGVuZWRcbiAqIEByZXR1cm5zIGEgZmxhdCBvYmplY3Qgd2l0aCBwYXRoIGFzIGtleXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZsYXR0ZW4ob2JqZWN0OiBvYmplY3QpOiB7IFtrZXk6IHN0cmluZ106IGFueSB9IHtcbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oXG4gICAge30sXG4gICAgLi4uZnVuY3Rpb24gX2ZsYXR0ZW4oY2hpbGQ6IGFueSwgcGF0aDogc3RyaW5nW10gPSBbXSk6IGFueSB7XG4gICAgICByZXR1cm4gW10uY29uY2F0KC4uLk9iamVjdC5rZXlzKGNoaWxkKVxuICAgICAgICAubWFwKGtleSA9PiB7XG4gICAgICAgICAgY29uc3QgY2hpbGRLZXkgPSBCdWZmZXIuaXNCdWZmZXIoY2hpbGRba2V5XSkgPyBjaGlsZFtrZXldLnRvU3RyaW5nKCd1dGY4JykgOiBjaGlsZFtrZXldO1xuICAgICAgICAgIHJldHVybiB0eXBlb2YgY2hpbGRLZXkgPT09ICdvYmplY3QnICYmIGNoaWxkS2V5ICE9PSBudWxsXG4gICAgICAgICAgICA/IF9mbGF0dGVuKGNoaWxkS2V5LCBwYXRoLmNvbmNhdChba2V5XSkpXG4gICAgICAgICAgICA6ICh7IFtwYXRoLmNvbmNhdChba2V5XSkuam9pbignLicpXTogY2hpbGRLZXkgfSk7XG4gICAgICAgIH0pKTtcbiAgICB9KG9iamVjdCksXG4gICk7XG59XG5cbi8qKlxuICogRGVjb2RlcyBlbmNvZGVkIHNwZWNpYWwgdmFsdWVzIChwaHlzaWNhbFJlc291cmNlSWQpXG4gKi9cbmZ1bmN0aW9uIGRlY29kZVNwZWNpYWxWYWx1ZXMob2JqZWN0OiBvYmplY3QsIHBoeXNpY2FsUmVzb3VyY2VJZDogc3RyaW5nKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iamVjdCksIChfaywgdikgPT4ge1xuICAgIHN3aXRjaCAodikge1xuICAgICAgY2FzZSBQSFlTSUNBTF9SRVNPVVJDRV9JRF9SRUZFUkVOQ0U6XG4gICAgICAgIHJldHVybiBwaHlzaWNhbFJlc291cmNlSWQ7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdjtcbiAgICB9XG4gIH0pO1xufVxuXG4vKipcbiAqIEZpbHRlcnMgdGhlIGtleXMgb2YgYW4gb2JqZWN0LlxuICovXG5mdW5jdGlvbiBmaWx0ZXJLZXlzKG9iamVjdDogb2JqZWN0LCBwcmVkOiAoa2V5OiBzdHJpbmcpID0+IGJvb2xlYW4pIHtcbiAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKG9iamVjdClcbiAgICAucmVkdWNlKFxuICAgICAgKGFjYywgW2ssIHZdKSA9PiBwcmVkKGspXG4gICAgICAgID8geyAuLi5hY2MsIFtrXTogdiB9XG4gICAgICAgIDogYWNjLFxuICAgICAge30sXG4gICAgKTtcbn1cblxubGV0IGxhdGVzdFNka0luc3RhbGxlZCA9IGZhbHNlO1xuXG5leHBvcnQgZnVuY3Rpb24gZm9yY2VTZGtJbnN0YWxsYXRpb24oKSB7XG4gIGxhdGVzdFNka0luc3RhbGxlZCA9IGZhbHNlO1xufVxuXG4vKipcbiAqIEluc3RhbGxzIGxhdGVzdCBBV1MgU0RLIHYyXG4gKi9cbmZ1bmN0aW9uIGluc3RhbGxMYXRlc3RTZGsoKTogdm9pZCB7XG4gIGNvbnNvbGUubG9nKCdJbnN0YWxsaW5nIGxhdGVzdCBBV1MgU0RLIHYyJyk7XG4gIC8vIEJvdGggSE9NRSBhbmQgLS1wcmVmaXggYXJlIG5lZWRlZCBoZXJlIGJlY2F1c2UgL3RtcCBpcyB0aGUgb25seSB3cml0YWJsZSBsb2NhdGlvblxuICBleGVjU3luYygnSE9NRT0vdG1wIG5wbSBpbnN0YWxsIGF3cy1zZGtAMiAtLXByb2R1Y3Rpb24gLS1uby1wYWNrYWdlLWxvY2sgLS1uby1zYXZlIC0tcHJlZml4IC90bXAnKTtcbiAgbGF0ZXN0U2RrSW5zdGFsbGVkID0gdHJ1ZTtcbn1cblxuY29uc3QgcGF0Y2hlZFNlcnZpY2VzOiB7IHNlcnZpY2VOYW1lOiBzdHJpbmc7IGFwaVZlcnNpb25zOiBzdHJpbmdbXSB9W10gPSBbXG4gIHsgc2VydmljZU5hbWU6ICdPcGVuU2VhcmNoJywgYXBpVmVyc2lvbnM6IFsnMjAyMS0wMS0wMSddIH0sXG5dO1xuLyoqXG4gKiBQYXRjaGVzIHRoZSBBV1MgU0RLIGJ5IGxvYWRpbmcgc2VydmljZSBtb2RlbHMgaW4gdGhlIHNhbWUgbWFubmVyIGFzIHRoZSBhY3R1YWwgU0RLXG4gKi9cbmZ1bmN0aW9uIHBhdGNoU2RrKGF3c1NkazogYW55KTogYW55IHtcbiAgY29uc3QgYXBpTG9hZGVyID0gYXdzU2RrLmFwaUxvYWRlcjtcbiAgcGF0Y2hlZFNlcnZpY2VzLmZvckVhY2goKHsgc2VydmljZU5hbWUsIGFwaVZlcnNpb25zIH0pID0+IHtcbiAgICBjb25zdCBsb3dlclNlcnZpY2VOYW1lID0gc2VydmljZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICBpZiAoIWF3c1Nkay5TZXJ2aWNlLmhhc1NlcnZpY2UobG93ZXJTZXJ2aWNlTmFtZSkpIHtcbiAgICAgIGFwaUxvYWRlci5zZXJ2aWNlc1tsb3dlclNlcnZpY2VOYW1lXSA9IHt9O1xuICAgICAgYXdzU2RrW3NlcnZpY2VOYW1lXSA9IGF3c1Nkay5TZXJ2aWNlLmRlZmluZVNlcnZpY2UobG93ZXJTZXJ2aWNlTmFtZSwgYXBpVmVyc2lvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd3NTZGsuU2VydmljZS5hZGRWZXJzaW9ucyhhd3NTZGtbc2VydmljZU5hbWVdLCBhcGlWZXJzaW9ucyk7XG4gICAgfVxuICAgIGFwaVZlcnNpb25zLmZvckVhY2goYXBpVmVyc2lvbiA9PiB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoYXBpTG9hZGVyLnNlcnZpY2VzW2xvd2VyU2VydmljZU5hbWVdLCBhcGlWZXJzaW9uLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgIGNvbnN0IG1vZGVsRmlsZVByZWZpeCA9IGBhd3Mtc2RrLXBhdGNoLyR7bG93ZXJTZXJ2aWNlTmFtZX0tJHthcGlWZXJzaW9ufWA7XG4gICAgICAgICAgY29uc3QgbW9kZWwgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhqb2luKF9fZGlybmFtZSwgYCR7bW9kZWxGaWxlUHJlZml4fS5zZXJ2aWNlLmpzb25gKSwgJ3V0Zi04JykpO1xuICAgICAgICAgIG1vZGVsLnBhZ2luYXRvcnMgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhqb2luKF9fZGlybmFtZSwgYCR7bW9kZWxGaWxlUHJlZml4fS5wYWdpbmF0b3JzLmpzb25gKSwgJ3V0Zi04JykpLnBhZ2luYXRpb247XG4gICAgICAgICAgcmV0dXJuIG1vZGVsO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBhd3NTZGs7XG59XG5cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHMsIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llcyAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQsIGNvbnRleHQ6IEFXU0xhbWJkYS5Db250ZXh0KSB7XG4gIHRyeSB7XG4gICAgbGV0IEFXUzogYW55O1xuICAgIGlmICghbGF0ZXN0U2RrSW5zdGFsbGVkICYmIGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5JbnN0YWxsTGF0ZXN0QXdzU2RrID09PSAndHJ1ZScpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGluc3RhbGxMYXRlc3RTZGsoKTtcbiAgICAgICAgQVdTID0gcmVxdWlyZSgnL3RtcC9ub2RlX21vZHVsZXMvYXdzLXNkaycpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhgRmFpbGVkIHRvIGluc3RhbGwgbGF0ZXN0IEFXUyBTREsgdjI6ICR7ZX1gKTtcbiAgICAgICAgQVdTID0gcmVxdWlyZSgnYXdzLXNkaycpOyAvLyBGYWxsYmFjayB0byBwcmUtaW5zdGFsbGVkIHZlcnNpb25cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGxhdGVzdFNka0luc3RhbGxlZCkge1xuICAgICAgQVdTID0gcmVxdWlyZSgnL3RtcC9ub2RlX21vZHVsZXMvYXdzLXNkaycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBBV1MgPSByZXF1aXJlKCdhd3Mtc2RrJyk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBBV1MgPSBwYXRjaFNkayhBV1MpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBGYWlsZWQgdG8gcGF0Y2ggQVdTIFNESzogJHtlfS4gUHJvY2VlZGluZyB3aXRoIHRoZSBpbnN0YWxsZWQgY29weS5gKTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShldmVudCkpO1xuICAgIGNvbnNvbGUubG9nKCdBV1MgU0RLIFZFUlNJT046ICcgKyBBV1MuVkVSU0lPTik7XG5cbiAgICBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ3JlYXRlID0gZGVjb2RlQ2FsbChldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ3JlYXRlKTtcbiAgICBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuVXBkYXRlID0gZGVjb2RlQ2FsbChldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuVXBkYXRlKTtcbiAgICBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuRGVsZXRlID0gZGVjb2RlQ2FsbChldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuRGVsZXRlKTtcbiAgICAvLyBEZWZhdWx0IHBoeXNpY2FsIHJlc291cmNlIGlkXG4gICAgbGV0IHBoeXNpY2FsUmVzb3VyY2VJZDogc3RyaW5nO1xuICAgIHN3aXRjaCAoZXZlbnQuUmVxdWVzdFR5cGUpIHtcbiAgICAgIGNhc2UgJ0NyZWF0ZSc6XG4gICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZCA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5DcmVhdGU/LnBoeXNpY2FsUmVzb3VyY2VJZD8uaWQgPz9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlVwZGF0ZT8ucGh5c2ljYWxSZXNvdXJjZUlkPy5pZCA/P1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuRGVsZXRlPy5waHlzaWNhbFJlc291cmNlSWQ/LmlkID8/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LkxvZ2ljYWxSZXNvdXJjZUlkO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ1VwZGF0ZSc6XG4gICAgICBjYXNlICdEZWxldGUnOlxuICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXNbZXZlbnQuUmVxdWVzdFR5cGVdPy5waHlzaWNhbFJlc291cmNlSWQ/LmlkID8/IGV2ZW50LlBoeXNpY2FsUmVzb3VyY2VJZDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgbGV0IGZsYXREYXRhOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG4gICAgbGV0IGRhdGE6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcbiAgICBjb25zdCBjYWxsOiBBd3NTZGtDYWxsIHwgdW5kZWZpbmVkID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzW2V2ZW50LlJlcXVlc3RUeXBlXTtcblxuICAgIGlmIChjYWxsKSB7XG5cbiAgICAgIGxldCBjcmVkZW50aWFscztcbiAgICAgIGlmIChjYWxsLmFzc3VtZWRSb2xlQXJuKSB7XG4gICAgICAgIGNvbnN0IHRpbWVzdGFtcCA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgICAgIFJvbGVBcm46IGNhbGwuYXNzdW1lZFJvbGVBcm4sXG4gICAgICAgICAgUm9sZVNlc3Npb25OYW1lOiBgJHt0aW1lc3RhbXB9LSR7cGh5c2ljYWxSZXNvdXJjZUlkfWAuc3Vic3RyaW5nKDAsIDY0KSxcbiAgICAgICAgfTtcblxuICAgICAgICBjcmVkZW50aWFscyA9IG5ldyBBV1MuQ2hhaW5hYmxlVGVtcG9yYXJ5Q3JlZGVudGlhbHMoe1xuICAgICAgICAgIHBhcmFtczogcGFyYW1zLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoQVdTLCBjYWxsLnNlcnZpY2UpKSB7XG4gICAgICAgIHRocm93IEVycm9yKGBTZXJ2aWNlICR7Y2FsbC5zZXJ2aWNlfSBkb2VzIG5vdCBleGlzdCBpbiBBV1MgU0RLIHZlcnNpb24gJHtBV1MuVkVSU0lPTn0uYCk7XG4gICAgICB9XG4gICAgICBjb25zdCBhd3NTZXJ2aWNlID0gbmV3IChBV1MgYXMgYW55KVtjYWxsLnNlcnZpY2VdKHtcbiAgICAgICAgYXBpVmVyc2lvbjogY2FsbC5hcGlWZXJzaW9uLFxuICAgICAgICBjcmVkZW50aWFsczogY3JlZGVudGlhbHMsXG4gICAgICAgIHJlZ2lvbjogY2FsbC5yZWdpb24sXG4gICAgICB9KTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBhd3NTZXJ2aWNlW2NhbGwuYWN0aW9uXShcbiAgICAgICAgICBjYWxsLnBhcmFtZXRlcnMgJiYgZGVjb2RlU3BlY2lhbFZhbHVlcyhjYWxsLnBhcmFtZXRlcnMsIHBoeXNpY2FsUmVzb3VyY2VJZCkpLnByb21pc2UoKTtcbiAgICAgICAgZmxhdERhdGEgPSB7XG4gICAgICAgICAgYXBpVmVyc2lvbjogYXdzU2VydmljZS5jb25maWcuYXBpVmVyc2lvbiwgLy8gRm9yIHRlc3QgcHVycG9zZXM6IGNoZWNrIGlmIGFwaVZlcnNpb24gd2FzIGNvcnJlY3RseSBwYXNzZWQuXG4gICAgICAgICAgcmVnaW9uOiBhd3NTZXJ2aWNlLmNvbmZpZy5yZWdpb24sIC8vIEZvciB0ZXN0IHB1cnBvc2VzOiBjaGVjayBpZiByZWdpb24gd2FzIGNvcnJlY3RseSBwYXNzZWQuXG4gICAgICAgICAgLi4uZmxhdHRlbihyZXNwb25zZSksXG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IG91dHB1dFBhdGhzOiBzdHJpbmdbXSB8IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKGNhbGwub3V0cHV0UGF0aCkge1xuICAgICAgICAgIG91dHB1dFBhdGhzID0gW2NhbGwub3V0cHV0UGF0aF07XG4gICAgICAgIH0gZWxzZSBpZiAoY2FsbC5vdXRwdXRQYXRocykge1xuICAgICAgICAgIG91dHB1dFBhdGhzID0gY2FsbC5vdXRwdXRQYXRocztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvdXRwdXRQYXRocykge1xuICAgICAgICAgIGRhdGEgPSBmaWx0ZXJLZXlzKGZsYXREYXRhLCBzdGFydHNXaXRoT25lT2Yob3V0cHV0UGF0aHMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkYXRhID0gZmxhdERhdGE7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKCFjYWxsLmlnbm9yZUVycm9yQ29kZXNNYXRjaGluZyB8fCAhbmV3IFJlZ0V4cChjYWxsLmlnbm9yZUVycm9yQ29kZXNNYXRjaGluZykudGVzdChlLmNvZGUpKSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoY2FsbC5waHlzaWNhbFJlc291cmNlSWQ/LnJlc3BvbnNlUGF0aCkge1xuICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQgPSBmbGF0RGF0YVtjYWxsLnBoeXNpY2FsUmVzb3VyY2VJZC5yZXNwb25zZVBhdGhdO1xuICAgICAgfVxuICAgIH1cblxuICAgIGF3YWl0IHJlc3BvbmQoJ1NVQ0NFU1MnLCAnT0snLCBwaHlzaWNhbFJlc291cmNlSWQsIGRhdGEpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coZSk7XG4gICAgYXdhaXQgcmVzcG9uZCgnRkFJTEVEJywgZS5tZXNzYWdlIHx8ICdJbnRlcm5hbCBFcnJvcicsIGNvbnRleHQubG9nU3RyZWFtTmFtZSwge30pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzcG9uZChyZXNwb25zZVN0YXR1czogc3RyaW5nLCByZWFzb246IHN0cmluZywgcGh5c2ljYWxSZXNvdXJjZUlkOiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgIGNvbnN0IHJlc3BvbnNlQm9keSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIFN0YXR1czogcmVzcG9uc2VTdGF0dXMsXG4gICAgICBSZWFzb246IHJlYXNvbixcbiAgICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogcGh5c2ljYWxSZXNvdXJjZUlkLFxuICAgICAgU3RhY2tJZDogZXZlbnQuU3RhY2tJZCxcbiAgICAgIFJlcXVlc3RJZDogZXZlbnQuUmVxdWVzdElkLFxuICAgICAgTG9naWNhbFJlc291cmNlSWQ6IGV2ZW50LkxvZ2ljYWxSZXNvdXJjZUlkLFxuICAgICAgTm9FY2hvOiBmYWxzZSxcbiAgICAgIERhdGE6IGRhdGEsXG4gICAgfSk7XG5cbiAgICBjb25zb2xlLmxvZygnUmVzcG9uZGluZycsIHJlc3BvbnNlQm9keSk7XG5cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xuICAgIGNvbnN0IHBhcnNlZFVybCA9IHJlcXVpcmUoJ3VybCcpLnBhcnNlKGV2ZW50LlJlc3BvbnNlVVJMKTtcbiAgICBjb25zdCByZXF1ZXN0T3B0aW9ucyA9IHtcbiAgICAgIGhvc3RuYW1lOiBwYXJzZWRVcmwuaG9zdG5hbWUsXG4gICAgICBwYXRoOiBwYXJzZWRVcmwucGF0aCxcbiAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICBoZWFkZXJzOiB7ICdjb250ZW50LXR5cGUnOiAnJywgJ2NvbnRlbnQtbGVuZ3RoJzogcmVzcG9uc2VCb2R5Lmxlbmd0aCB9LFxuICAgIH07XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcbiAgICAgICAgY29uc3QgcmVxdWVzdCA9IHJlcXVpcmUoJ2h0dHBzJykucmVxdWVzdChyZXF1ZXN0T3B0aW9ucywgcmVzb2x2ZSk7XG4gICAgICAgIHJlcXVlc3Qub24oJ2Vycm9yJywgcmVqZWN0KTtcbiAgICAgICAgcmVxdWVzdC53cml0ZShyZXNwb25zZUJvZHkpO1xuICAgICAgICByZXF1ZXN0LmVuZCgpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGVjb2RlQ2FsbChjYWxsOiBzdHJpbmcgfCB1bmRlZmluZWQpIHtcbiAgaWYgKCFjYWxsKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgcmV0dXJuIEpTT04ucGFyc2UoY2FsbCk7XG59XG5cbmZ1bmN0aW9uIHN0YXJ0c1dpdGhPbmVPZihzZWFyY2hTdHJpbmdzOiBzdHJpbmdbXSk6IChzdHJpbmc6IHN0cmluZykgPT4gYm9vbGVhbiB7XG4gIHJldHVybiBmdW5jdGlvbihzdHJpbmc6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGZvciAoY29uc3Qgc2VhcmNoU3RyaW5nIG9mIHNlYXJjaFN0cmluZ3MpIHtcbiAgICAgIGlmIChzdHJpbmcuc3RhcnRzV2l0aChzZWFyY2hTdHJpbmcpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG59XG4iXX0=