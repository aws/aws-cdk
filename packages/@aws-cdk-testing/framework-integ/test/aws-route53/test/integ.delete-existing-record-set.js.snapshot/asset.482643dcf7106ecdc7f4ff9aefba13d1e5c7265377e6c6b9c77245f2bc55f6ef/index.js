"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_route_53_1 = require("@aws-sdk/client-route-53"); // eslint-disable-line import/no-extraneous-dependencies
async function handler(event) {
    const resourceProps = event.ResourceProperties;
    // Only delete the existing record when the new one gets created
    if (event.RequestType !== 'Create') {
        return;
    }
    const route53 = new client_route_53_1.Route53();
    const listResourceRecordSets = await route53.listResourceRecordSets({
        HostedZoneId: resourceProps.HostedZoneId,
        StartRecordName: resourceProps.RecordName,
        StartRecordType: resourceProps.RecordType,
    });
    const existingRecord = listResourceRecordSets.ResourceRecordSets
        ?.find(r => r.Name === resourceProps.RecordName && r.Type === resourceProps.RecordType);
    if (!existingRecord) {
        // There is no existing record, we can safely return
        return;
    }
    const changeResourceRecordSets = await route53.changeResourceRecordSets({
        HostedZoneId: resourceProps.HostedZoneId,
        ChangeBatch: {
            Changes: [{
                    Action: 'DELETE',
                    ResourceRecordSet: removeUndefinedAndEmpty({
                        Name: existingRecord.Name,
                        Type: existingRecord.Type,
                        TTL: existingRecord.TTL,
                        AliasTarget: existingRecord.AliasTarget,
                        ResourceRecords: existingRecord.ResourceRecords,
                    }),
                }],
        },
    });
    await (0, client_route_53_1.waitUntilResourceRecordSetsChanged)({ client: route53, maxWaitTime: 890 }, { Id: changeResourceRecordSets?.ChangeInfo?.Id });
    return {
        PhysicalResourceId: `${existingRecord.Name}-${existingRecord.Type}`,
    };
}
exports.handler = handler;
// https://github.com/aws/aws-sdk-js/issues/3411
// https://github.com/aws/aws-sdk-js/issues/3506
function removeUndefinedAndEmpty(obj) {
    const ret = {};
    for (const [k, v] of Object.entries(obj)) {
        if (v && (!Array.isArray(v) || v.length !== 0)) {
            ret[k] = v;
        }
    }
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4REFBdUYsQ0FBQyx3REFBd0Q7QUFRekksS0FBSyxVQUFVLE9BQU8sQ0FBQyxLQUFrRDtJQUM5RSxNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsa0JBQW1ELENBQUM7SUFFaEYsZ0VBQWdFO0lBQ2hFLElBQUksS0FBSyxDQUFDLFdBQVcsS0FBSyxRQUFRLEVBQUU7UUFDbEMsT0FBTztLQUNSO0lBRUQsTUFBTSxPQUFPLEdBQUcsSUFBSSx5QkFBTyxFQUFFLENBQUM7SUFFOUIsTUFBTSxzQkFBc0IsR0FBRyxNQUFNLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQztRQUNsRSxZQUFZLEVBQUUsYUFBYSxDQUFDLFlBQVk7UUFDeEMsZUFBZSxFQUFFLGFBQWEsQ0FBQyxVQUFVO1FBQ3pDLGVBQWUsRUFBRSxhQUFhLENBQUMsVUFBVTtLQUMxQyxDQUFDLENBQUM7SUFFSCxNQUFNLGNBQWMsR0FBRyxzQkFBc0IsQ0FBQyxrQkFBa0I7UUFDOUQsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLGFBQWEsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFMUYsSUFBSSxDQUFDLGNBQWMsRUFBRTtRQUNuQixvREFBb0Q7UUFDcEQsT0FBTztLQUNSO0lBRUQsTUFBTSx3QkFBd0IsR0FBRyxNQUFNLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQztRQUN0RSxZQUFZLEVBQUUsYUFBYSxDQUFDLFlBQVk7UUFDeEMsV0FBVyxFQUFFO1lBQ1gsT0FBTyxFQUFFLENBQUM7b0JBQ1IsTUFBTSxFQUFFLFFBQVE7b0JBQ2hCLGlCQUFpQixFQUFFLHVCQUF1QixDQUFDO3dCQUN6QyxJQUFJLEVBQUUsY0FBYyxDQUFDLElBQUk7d0JBQ3pCLElBQUksRUFBRSxjQUFjLENBQUMsSUFBSTt3QkFDekIsR0FBRyxFQUFFLGNBQWMsQ0FBQyxHQUFHO3dCQUN2QixXQUFXLEVBQUUsY0FBYyxDQUFDLFdBQVc7d0JBQ3ZDLGVBQWUsRUFBRSxjQUFjLENBQUMsZUFBZTtxQkFDaEQsQ0FBQztpQkFDSCxDQUFDO1NBQ0g7S0FDRixDQUFDLENBQUM7SUFFSCxNQUFNLElBQUEsb0RBQWtDLEVBQUMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSx3QkFBd0IsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUVsSSxPQUFPO1FBQ0wsa0JBQWtCLEVBQUUsR0FBRyxjQUFjLENBQUMsSUFBSSxJQUFJLGNBQWMsQ0FBQyxJQUFJLEVBQUU7S0FDcEUsQ0FBQztBQUNKLENBQUM7QUE3Q0QsMEJBNkNDO0FBRUQsZ0RBQWdEO0FBQ2hELGdEQUFnRDtBQUNoRCxTQUFTLHVCQUF1QixDQUF1QyxHQUFNO0lBQzNFLE1BQU0sR0FBRyxHQUEyQixFQUFFLENBQUM7SUFFdkMsS0FBSyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDeEMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsRUFBRTtZQUM5QyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ1o7S0FDRjtJQUVELE9BQU8sR0FBUSxDQUFDO0FBQ2xCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSb3V0ZTUzLCB3YWl0VW50aWxSZXNvdXJjZVJlY29yZFNldHNDaGFuZ2VkIH0gZnJvbSAnQGF3cy1zZGsvY2xpZW50LXJvdXRlLTUzJzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcblxuaW50ZXJmYWNlIFJlc291cmNlUHJvcGVydGllcyB7XG4gIEhvc3RlZFpvbmVJZDogc3RyaW5nO1xuICBSZWNvcmROYW1lOiBzdHJpbmc7XG4gIFJlY29yZFR5cGU6IHN0cmluZztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQpIHtcbiAgY29uc3QgcmVzb3VyY2VQcm9wcyA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcyBhcyB1bmtub3duIGFzIFJlc291cmNlUHJvcGVydGllcztcblxuICAvLyBPbmx5IGRlbGV0ZSB0aGUgZXhpc3RpbmcgcmVjb3JkIHdoZW4gdGhlIG5ldyBvbmUgZ2V0cyBjcmVhdGVkXG4gIGlmIChldmVudC5SZXF1ZXN0VHlwZSAhPT0gJ0NyZWF0ZScpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCByb3V0ZTUzID0gbmV3IFJvdXRlNTMoKTtcblxuICBjb25zdCBsaXN0UmVzb3VyY2VSZWNvcmRTZXRzID0gYXdhaXQgcm91dGU1My5saXN0UmVzb3VyY2VSZWNvcmRTZXRzKHtcbiAgICBIb3N0ZWRab25lSWQ6IHJlc291cmNlUHJvcHMuSG9zdGVkWm9uZUlkLFxuICAgIFN0YXJ0UmVjb3JkTmFtZTogcmVzb3VyY2VQcm9wcy5SZWNvcmROYW1lLFxuICAgIFN0YXJ0UmVjb3JkVHlwZTogcmVzb3VyY2VQcm9wcy5SZWNvcmRUeXBlLFxuICB9KTtcblxuICBjb25zdCBleGlzdGluZ1JlY29yZCA9IGxpc3RSZXNvdXJjZVJlY29yZFNldHMuUmVzb3VyY2VSZWNvcmRTZXRzXG4gICAgPy5maW5kKHIgPT4gci5OYW1lID09PSByZXNvdXJjZVByb3BzLlJlY29yZE5hbWUgJiYgci5UeXBlID09PSByZXNvdXJjZVByb3BzLlJlY29yZFR5cGUpO1xuXG4gIGlmICghZXhpc3RpbmdSZWNvcmQpIHtcbiAgICAvLyBUaGVyZSBpcyBubyBleGlzdGluZyByZWNvcmQsIHdlIGNhbiBzYWZlbHkgcmV0dXJuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgY2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzID0gYXdhaXQgcm91dGU1My5jaGFuZ2VSZXNvdXJjZVJlY29yZFNldHMoe1xuICAgIEhvc3RlZFpvbmVJZDogcmVzb3VyY2VQcm9wcy5Ib3N0ZWRab25lSWQsXG4gICAgQ2hhbmdlQmF0Y2g6IHtcbiAgICAgIENoYW5nZXM6IFt7XG4gICAgICAgIEFjdGlvbjogJ0RFTEVURScsXG4gICAgICAgIFJlc291cmNlUmVjb3JkU2V0OiByZW1vdmVVbmRlZmluZWRBbmRFbXB0eSh7XG4gICAgICAgICAgTmFtZTogZXhpc3RpbmdSZWNvcmQuTmFtZSxcbiAgICAgICAgICBUeXBlOiBleGlzdGluZ1JlY29yZC5UeXBlLFxuICAgICAgICAgIFRUTDogZXhpc3RpbmdSZWNvcmQuVFRMLFxuICAgICAgICAgIEFsaWFzVGFyZ2V0OiBleGlzdGluZ1JlY29yZC5BbGlhc1RhcmdldCxcbiAgICAgICAgICBSZXNvdXJjZVJlY29yZHM6IGV4aXN0aW5nUmVjb3JkLlJlc291cmNlUmVjb3JkcyxcbiAgICAgICAgfSksXG4gICAgICB9XSxcbiAgICB9LFxuICB9KTtcblxuICBhd2FpdCB3YWl0VW50aWxSZXNvdXJjZVJlY29yZFNldHNDaGFuZ2VkKHsgY2xpZW50OiByb3V0ZTUzLCBtYXhXYWl0VGltZTogODkwIH0sIHsgSWQ6IGNoYW5nZVJlc291cmNlUmVjb3JkU2V0cz8uQ2hhbmdlSW5mbz8uSWQgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBQaHlzaWNhbFJlc291cmNlSWQ6IGAke2V4aXN0aW5nUmVjb3JkLk5hbWV9LSR7ZXhpc3RpbmdSZWNvcmQuVHlwZX1gLFxuICB9O1xufVxuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1zZGstanMvaXNzdWVzLzM0MTFcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLXNkay1qcy9pc3N1ZXMvMzUwNlxuZnVuY3Rpb24gcmVtb3ZlVW5kZWZpbmVkQW5kRW1wdHk8VCBleHRlbmRzIHsgW2tleTogc3RyaW5nXTogdW5rbm93biB9PihvYmo6IFQpOiBUIHtcbiAgY29uc3QgcmV0OiB7IFtrZXk6IHN0cmluZ106IGFueSB9ID0ge307XG5cbiAgZm9yIChjb25zdCBbaywgdl0gb2YgT2JqZWN0LmVudHJpZXMob2JqKSkge1xuICAgIGlmICh2ICYmICghQXJyYXkuaXNBcnJheSh2KSB8fCB2Lmxlbmd0aCAhPT0gMCkpIHtcbiAgICAgIHJldFtrXSA9IHY7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldCBhcyBUO1xufVxuIl19