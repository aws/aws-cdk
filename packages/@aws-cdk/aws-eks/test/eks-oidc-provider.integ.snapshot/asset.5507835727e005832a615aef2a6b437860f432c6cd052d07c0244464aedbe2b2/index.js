"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const diff_1 = require("./diff");
const external_1 = require("./external");
async function handler(event) {
    if (event.RequestType === 'Create') {
        return onCreate(event);
    }
    if (event.RequestType === 'Update') {
        return onUpdate(event);
    }
    if (event.RequestType === 'Delete') {
        return onDelete(event);
    }
    throw new Error('invalid request type');
}
exports.handler = handler;
async function onCreate(event) {
    var _a, _b;
    const issuerUrl = event.ResourceProperties.Url;
    const thumbprints = ((_a = event.ResourceProperties.ThumbprintList) !== null && _a !== void 0 ? _a : []).sort(); // keep sorted for UPDATE
    const clients = ((_b = event.ResourceProperties.ClientIDList) !== null && _b !== void 0 ? _b : []).sort();
    if (thumbprints.length === 0) {
        thumbprints.push(await external_1.external.downloadThumbprint(issuerUrl));
    }
    const resp = await external_1.external.createOpenIDConnectProvider({
        Url: issuerUrl,
        ClientIDList: clients,
        ThumbprintList: thumbprints,
    });
    return {
        PhysicalResourceId: resp.OpenIDConnectProviderArn,
    };
}
async function onUpdate(event) {
    var _a, _b;
    const issuerUrl = event.ResourceProperties.Url;
    const thumbprints = ((_a = event.ResourceProperties.ThumbprintList) !== null && _a !== void 0 ? _a : []).sort(); // keep sorted for UPDATE
    const clients = ((_b = event.ResourceProperties.ClientIDList) !== null && _b !== void 0 ? _b : []).sort();
    // determine which update we are talking about.
    const oldIssuerUrl = event.OldResourceProperties.Url;
    // if this is a URL update, then we basically create a new resource and cfn will delete the old one
    // since the physical resource ID will change.
    if (oldIssuerUrl !== issuerUrl) {
        return onCreate({ ...event, RequestType: 'Create' });
    }
    const providerArn = event.PhysicalResourceId;
    // if thumbprints changed, we can update in-place, but bear in mind that if the new thumbprint list
    // is empty, we will grab it from the server like we do in CREATE
    const oldThumbprints = (event.OldResourceProperties.ThumbprintList || []).sort();
    if (JSON.stringify(oldThumbprints) !== JSON.stringify(thumbprints)) {
        const thumbprintList = thumbprints.length > 0 ? thumbprints : [await external_1.external.downloadThumbprint(issuerUrl)];
        external_1.external.log('updating thumbprint list from', oldThumbprints, 'to', thumbprints);
        await external_1.external.updateOpenIDConnectProviderThumbprint({
            OpenIDConnectProviderArn: providerArn,
            ThumbprintList: thumbprintList,
        });
        // don't return, we might have more updates...
    }
    // if client ID list has changed, determine "diff" because the API is add/remove
    const oldClients = (event.OldResourceProperties.ClientIDList || []).sort();
    const diff = diff_1.arrayDiff(oldClients, clients);
    external_1.external.log(`client ID diff: ${JSON.stringify(diff)}`);
    for (const addClient of diff.adds) {
        external_1.external.log(`adding client id "${addClient}" to provider ${providerArn}`);
        await external_1.external.addClientIDToOpenIDConnectProvider({
            OpenIDConnectProviderArn: providerArn,
            ClientID: addClient,
        });
    }
    for (const deleteClient of diff.deletes) {
        external_1.external.log(`removing client id "${deleteClient}" from provider ${providerArn}`);
        await external_1.external.removeClientIDFromOpenIDConnectProvider({
            OpenIDConnectProviderArn: providerArn,
            ClientID: deleteClient,
        });
    }
    return;
}
async function onDelete(deleteEvent) {
    await external_1.external.deleteOpenIDConnectProvider({
        OpenIDConnectProviderArn: deleteEvent.PhysicalResourceId,
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBbUM7QUFDbkMseUNBQXNDO0FBRS9CLEtBQUssVUFBVSxPQUFPLENBQUMsS0FBa0Q7SUFDOUUsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsRUFBRTtRQUFFLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQUU7SUFDL0QsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsRUFBRTtRQUFFLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQUU7SUFDL0QsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsRUFBRTtRQUFFLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQUU7SUFDL0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFMRCwwQkFLQztBQUVELEtBQUssVUFBVSxRQUFRLENBQUMsS0FBd0Q7O0lBQzlFLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUM7SUFDL0MsTUFBTSxXQUFXLEdBQWEsT0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsY0FBYyxtQ0FBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QjtJQUMvRyxNQUFNLE9BQU8sR0FBYSxPQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLG1DQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBRS9FLElBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDNUIsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLG1CQUFRLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztLQUNoRTtJQUVELE1BQU0sSUFBSSxHQUFHLE1BQU0sbUJBQVEsQ0FBQywyQkFBMkIs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LFFBQVEsRUFBRSxZQUFZO1NBQ3ZCLENBQUMsQ0FBQztLQUNKO0lBRUQsT0FBTztBQUNULENBQUM7QUFFRCxLQUFLLFVBQVUsUUFBUSxDQUFDLFdBQThEO0lBQ3BGLE1BQU0sbUJBQVEsQ0FBQywyQkFBMkIsQ0FBQztRQUN6Qyx3QkFBd0IsRUFBRSxXQUFXLENBQUMsa0JBQWtCO0tBQ3pELENBQUMsQ0FBQztBQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhcnJheURpZmYgfSBmcm9tICcuL2RpZmYnO1xuaW1wb3J0IHsgZXh0ZXJuYWwgfSBmcm9tICcuL2V4dGVybmFsJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQpIHtcbiAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnQ3JlYXRlJykgeyByZXR1cm4gb25DcmVhdGUoZXZlbnQpOyB9XG4gIGlmIChldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ1VwZGF0ZScpIHsgcmV0dXJuIG9uVXBkYXRlKGV2ZW50KTsgfVxuICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdEZWxldGUnKSB7IHJldHVybiBvbkRlbGV0ZShldmVudCk7IH1cbiAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHJlcXVlc3QgdHlwZScpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBvbkNyZWF0ZShldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VDcmVhdGVFdmVudCkge1xuICBjb25zdCBpc3N1ZXJVcmwgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuVXJsO1xuICBjb25zdCB0aHVtYnByaW50czogc3RyaW5nW10gPSAoZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlRodW1icHJpbnRMaXN0ID8/IFtdKS5zb3J0KCk7IC8vIGtlZXAgc29ydGVkIGZvciBVUERBVEVcbiAgY29uc3QgY2xpZW50czogc3RyaW5nW10gPSAoZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkNsaWVudElETGlzdCA/PyBbXSkuc29ydCgpO1xuXG4gIGlmICh0aHVtYnByaW50cy5sZW5ndGggPT09IDApIHtcbiAgICB0aHVtYnByaW50cy5wdXNoKGF3YWl0IGV4dGVybmFsLmRvd25sb2FkVGh1bWJwcmludChpc3N1ZXJVcmwpKTtcbiAgfVxuXG4gIGNvbnN0IHJlc3AgPSBhd2FpdCBleHRlcm5hbC5jcmVhdGVPcGVuSURDb25uZWN0UHJvdmlkZXIoe1xuICAgIFVybDogaXNzdWVyVXJsLFxuICAgIENsaWVudElETGlzdDogY2xpZW50cyxcbiAgICBUaHVtYnByaW50TGlzdDogdGh1bWJwcmludHMsXG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgUGh5c2ljYWxSZXNvdXJjZUlkOiByZXNwLk9wZW5JRENvbm5lY3RQcm92aWRlckFybixcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gb25VcGRhdGUoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlVXBkYXRlRXZlbnQpIHtcbiAgY29uc3QgaXNzdWVyVXJsID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlVybDtcbiAgY29uc3QgdGh1bWJwcmludHM6IHN0cmluZ1tdID0gKGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5UaHVtYnByaW50TGlzdCA/PyBbXSkuc29ydCgpOyAvLyBrZWVwIHNvcnRlZCBmb3IgVVBEQVRFXG4gIGNvbnN0IGNsaWVudHM6IHN0cmluZ1tdID0gKGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5DbGllbnRJRExpc3QgPz8gW10pLnNvcnQoKTtcblxuICAvLyBkZXRlcm1pbmUgd2hpY2ggdXBkYXRlIHdlIGFyZSB0YWxraW5nIGFib3V0LlxuICBjb25zdCBvbGRJc3N1ZXJVcmwgPSBldmVudC5PbGRSZXNvdXJjZVByb3BlcnRpZXMuVXJsO1xuXG4gIC8vIGlmIHRoaXMgaXMgYSBVUkwgdXBkYXRlLCB0aGVuIHdlIGJhc2ljYWxseSBjcmVhdGUgYSBuZXcgcmVzb3VyY2UgYW5kIGNmbiB3aWxsIGRlbGV0ZSB0aGUgb2xkIG9uZVxuICAvLyBzaW5jZSB0aGUgcGh5c2ljYWwgcmVzb3VyY2UgSUQgd2lsbCBjaGFuZ2UuXG4gIGlmIChvbGRJc3N1ZXJVcmwgIT09IGlzc3VlclVybCkge1xuICAgIHJldHVybiBvbkNyZWF0ZSh7IC4uLmV2ZW50LCBSZXF1ZXN0VHlwZTogJ0NyZWF0ZScgfSk7XG4gIH1cblxuICBjb25zdCBwcm92aWRlckFybiA9IGV2ZW50LlBoeXNpY2FsUmVzb3VyY2VJZDtcblxuICAvLyBpZiB0aHVtYnByaW50cyBjaGFuZ2VkLCB3ZSBjYW4gdXBkYXRlIGluLXBsYWNlLCBidXQgYmVhciBpbiBtaW5kIHRoYXQgaWYgdGhlIG5ldyB0aHVtYnByaW50IGxpc3RcbiAgLy8gaXMgZW1wdHksIHdlIHdpbGwgZ3JhYiBpdCBmcm9tIHRoZSBzZXJ2ZXIgbGlrZSB3ZSBkbyBpbiBDUkVBVEVcbiAgY29uc3Qgb2xkVGh1bWJwcmludHMgPSAoZXZlbnQuT2xkUmVzb3VyY2VQcm9wZXJ0aWVzLlRodW1icHJpbnRMaXN0IHx8IFtdKS5zb3J0KCk7XG4gIGlmIChKU09OLnN0cmluZ2lmeShvbGRUaHVtYnByaW50cykgIT09IEpTT04uc3RyaW5naWZ5KHRodW1icHJpbnRzKSkge1xuICAgIGNvbnN0IHRodW1icHJpbnRMaXN0ID0gdGh1bWJwcmludHMubGVuZ3RoID4gMCA/IHRodW1icHJpbnRzIDogW2F3YWl0IGV4dGVybmFsLmRvd25sb2FkVGh1bWJwcmludChpc3N1ZXJVcmwpXTtcbiAgICBleHRlcm5hbC5sb2coJ3VwZGF0aW5nIHRodW1icHJpbnQgbGlzdCBmcm9tJywgb2xkVGh1bWJwcmludHMsICd0bycsIHRodW1icHJpbnRzKTtcbiAgICBhd2FpdCBleHRlcm5hbC51cGRhdGVPcGVuSURDb25uZWN0UHJvdmlkZXJUaHVtYnByaW50KHtcbiAgICAgIE9wZW5JRENvbm5lY3RQcm92aWRlckFybjogcHJvdmlkZXJBcm4sXG4gICAgICBUaHVtYnByaW50TGlzdDogdGh1bWJwcmludExpc3QsXG4gICAgfSk7XG5cbiAgICAvLyBkb24ndCByZXR1cm4sIHdlIG1pZ2h0IGhhdmUgbW9yZSB1cGRhdGVzLi4uXG4gIH1cblxuICAvLyBpZiBjbGllbnQgSUQgbGlzdCBoYXMgY2hhbmdlZCwgZGV0ZXJtaW5lIFwiZGlmZlwiIGJlY2F1c2UgdGhlIEFQSSBpcyBhZGQvcmVtb3ZlXG4gIGNvbnN0IG9sZENsaWVudHM6IHN0cmluZ1tdID0gKGV2ZW50Lk9sZFJlc291cmNlUHJvcGVydGllcy5DbGllbnRJRExpc3QgfHwgW10pLnNvcnQoKTtcbiAgY29uc3QgZGlmZiA9IGFycmF5RGlmZihvbGRDbGllbnRzLCBjbGllbnRzKTtcbiAgZXh0ZXJuYWwubG9nKGBjbGllbnQgSUQgZGlmZjogJHtKU09OLnN0cmluZ2lmeShkaWZmKX1gKTtcblxuICBmb3IgKGNvbnN0IGFkZENsaWVudCBvZiBkaWZmLmFkZHMpIHtcbiAgICBleHRlcm5hbC5sb2coYGFkZGluZyBjbGllbnQgaWQgXCIke2FkZENsaWVudH1cIiB0byBwcm92aWRlciAke3Byb3ZpZGVyQXJufWApO1xuICAgIGF3YWl0IGV4dGVybmFsLmFkZENsaWVudElEVG9PcGVuSURDb25uZWN0UHJvdmlkZXIoe1xuICAgICAgT3BlbklEQ29ubmVjdFByb3ZpZGVyQXJuOiBwcm92aWRlckFybixcbiAgICAgIENsaWVudElEOiBhZGRDbGllbnQsXG4gICAgfSk7XG4gIH1cblxuICBmb3IgKGNvbnN0IGRlbGV0ZUNsaWVudCBvZiBkaWZmLmRlbGV0ZXMpIHtcbiAgICBleHRlcm5hbC5sb2coYHJlbW92aW5nIGNsaWVudCBpZCBcIiR7ZGVsZXRlQ2xpZW50fVwiIGZyb20gcHJvdmlkZXIgJHtwcm92aWRlckFybn1gKTtcbiAgICBhd2FpdCBleHRlcm5hbC5yZW1vdmVDbGllbnRJREZyb21PcGVuSURDb25uZWN0UHJvdmlkZXIoe1xuICAgICAgT3BlbklEQ29ubmVjdFByb3ZpZGVyQXJuOiBwcm92aWRlckFybixcbiAgICAgIENsaWVudElEOiBkZWxldGVDbGllbnQsXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm47XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG9uRGVsZXRlKGRlbGV0ZUV2ZW50OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZURlbGV0ZUV2ZW50KSB7XG4gIGF3YWl0IGV4dGVybmFsLmRlbGV0ZU9wZW5JRENvbm5lY3RQcm92aWRlcih7XG4gICAgT3BlbklEQ29ubmVjdFByb3ZpZGVyQXJuOiBkZWxldGVFdmVudC5QaHlzaWNhbFJlc291cmNlSWQsXG4gIH0pO1xufVxuIl19