"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
async function handler(event) {
    const resourceProps = event.ResourceProperties;
    // Only delete the existing record when the new one gets created
    if (event.RequestType !== 'Create') {
        return;
    }
    const route53 = new aws_sdk_1.Route53({ apiVersion: '2013-04-01' });
    const listResourceRecordSets = await route53.listResourceRecordSets({
        HostedZoneId: resourceProps.HostedZoneId,
        StartRecordName: resourceProps.RecordName,
        StartRecordType: resourceProps.RecordType,
    }).promise();
    const existingRecord = listResourceRecordSets.ResourceRecordSets
        .find(r => r.Name === resourceProps.RecordName && r.Type === resourceProps.RecordType);
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
    }).promise();
    await route53.waitFor('resourceRecordSetsChanged', { Id: changeResourceRecordSets.ChangeInfo.Id }).promise();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBa0MsQ0FBQyx3REFBd0Q7QUFRcEYsS0FBSyxVQUFVLE9BQU8sQ0FBQyxLQUFrRDtJQUM5RSxNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsa0JBQW1ELENBQUM7SUFFaEYsZ0VBQWdFO0lBQ2hFLElBQUksS0FBSyxDQUFDLFdBQVcsS0FBSyxRQUFRLEVBQUU7UUFDbEMsT0FBTztLQUNSO0lBRUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7SUFFMUQsTUFBTSxzQkFBc0IsR0FBRyxNQUFNLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQztRQUNsRSxZQUFZLEVBQUUsYUFBYSxDQUFDLFlBQVk7UUFDeEMsZUFBZSxFQUFFLGFBQWEsQ0FBQyxVQUFVO1FBQ3pDLGVBQWUsRUFBRSxhQUFhLENBQUMsVUFBVTtLQUMxQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFFYixNQUFNLGNBQWMsR0FBRyxzQkFBc0IsQ0FBQyxrQkFBa0I7U0FDN0QsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxhQUFhLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRXpGLElBQUksQ0FBQyxjQUFjLEVBQUU7UUFDbkIsb0RBQW9EO1FBQ3BELE9BQU87S0FDUjtJQUVELE1BQU0sd0JBQXdCLEdBQUcsTUFBTSxPQUFPLENBQUMsd0JBQXdCLENBQUM7UUFDdEUsWUFBWSxFQUFFLGFBQWEsQ0FBQyxZQUFZO1FBQ3hDLFdBQVcsRUFBRTtZQUNYLE9BQU8sRUFBRSxDQUFDO29CQUNSLE1BQU0sRUFBRSxRQUFRO29CQUNoQixpQkFBaUIsRUFBRSx1QkFBdUIsQ0FBQzt3QkFDekMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxJQUFJO3dCQUN6QixJQUFJLEVBQUUsY0FBYyxDQUFDLElBQUk7d0JBQ3pCLEdBQUcsRUFBRSxjQUFjLENBQUMsR0FBRzt3QkFDdkIsV0FBVyxFQUFFLGNBQWMsQ0FBQyxXQUFXO3dCQUN2QyxlQUFlLEVBQUUsY0FBYyxDQUFDLGVBQWU7cUJBQ2hELENBQUM7aUJBQ0gsQ0FBQztTQUNIO0tBQ0YsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBRWIsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLDJCQUEyQixFQUFFLEVBQUUsRUFBRSxFQUFFLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBRTdHLE9BQU87UUFDTCxrQkFBa0IsRUFBRSxHQUFHLGNBQWMsQ0FBQyxJQUFJLElBQUksY0FBYyxDQUFDLElBQUksRUFBRTtLQUNwRSxDQUFDO0FBQ0osQ0FBQztBQTdDRCwwQkE2Q0M7QUFFRCxnREFBZ0Q7QUFDaEQsZ0RBQWdEO0FBQ2hELFNBQVMsdUJBQXVCLENBQUksR0FBTTtJQUN4QyxNQUFNLEdBQUcsR0FBMkIsRUFBRSxDQUFDO0lBRXZDLEtBQUssTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3hDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDOUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNaO0tBQ0Y7SUFFRCxPQUFPLEdBQVEsQ0FBQztBQUNsQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUm91dGU1MyB9IGZyb20gJ2F3cy1zZGsnOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuXG5pbnRlcmZhY2UgUmVzb3VyY2VQcm9wZXJ0aWVzIHtcbiAgSG9zdGVkWm9uZUlkOiBzdHJpbmc7XG4gIFJlY29yZE5hbWU6IHN0cmluZztcbiAgUmVjb3JkVHlwZTogc3RyaW5nO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCkge1xuICBjb25zdCByZXNvdXJjZVByb3BzID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzIGFzIHVua25vd24gYXMgUmVzb3VyY2VQcm9wZXJ0aWVzO1xuXG4gIC8vIE9ubHkgZGVsZXRlIHRoZSBleGlzdGluZyByZWNvcmQgd2hlbiB0aGUgbmV3IG9uZSBnZXRzIGNyZWF0ZWRcbiAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlICE9PSAnQ3JlYXRlJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHJvdXRlNTMgPSBuZXcgUm91dGU1Myh7IGFwaVZlcnNpb246ICcyMDEzLTA0LTAxJyB9KTtcblxuICBjb25zdCBsaXN0UmVzb3VyY2VSZWNvcmRTZXRzID0gYXdhaXQgcm91dGU1My5saXN0UmVzb3VyY2VSZWNvcmRTZXRzKHtcbiAgICBIb3N0ZWRab25lSWQ6IHJlc291cmNlUHJvcHMuSG9zdGVkWm9uZUlkLFxuICAgIFN0YXJ0UmVjb3JkTmFtZTogcmVzb3VyY2VQcm9wcy5SZWNvcmROYW1lLFxuICAgIFN0YXJ0UmVjb3JkVHlwZTogcmVzb3VyY2VQcm9wcy5SZWNvcmRUeXBlLFxuICB9KS5wcm9taXNlKCk7XG5cbiAgY29uc3QgZXhpc3RpbmdSZWNvcmQgPSBsaXN0UmVzb3VyY2VSZWNvcmRTZXRzLlJlc291cmNlUmVjb3JkU2V0c1xuICAgIC5maW5kKHIgPT4gci5OYW1lID09PSByZXNvdXJjZVByb3BzLlJlY29yZE5hbWUgJiYgci5UeXBlID09PSByZXNvdXJjZVByb3BzLlJlY29yZFR5cGUpO1xuXG4gIGlmICghZXhpc3RpbmdSZWNvcmQpIHtcbiAgICAvLyBUaGVyZSBpcyBubyBleGlzdGluZyByZWNvcmQsIHdlIGNhbiBzYWZlbHkgcmV0dXJuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgY2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzID0gYXdhaXQgcm91dGU1My5jaGFuZ2VSZXNvdXJjZVJlY29yZFNldHMoe1xuICAgIEhvc3RlZFpvbmVJZDogcmVzb3VyY2VQcm9wcy5Ib3N0ZWRab25lSWQsXG4gICAgQ2hhbmdlQmF0Y2g6IHtcbiAgICAgIENoYW5nZXM6IFt7XG4gICAgICAgIEFjdGlvbjogJ0RFTEVURScsXG4gICAgICAgIFJlc291cmNlUmVjb3JkU2V0OiByZW1vdmVVbmRlZmluZWRBbmRFbXB0eSh7XG4gICAgICAgICAgTmFtZTogZXhpc3RpbmdSZWNvcmQuTmFtZSxcbiAgICAgICAgICBUeXBlOiBleGlzdGluZ1JlY29yZC5UeXBlLFxuICAgICAgICAgIFRUTDogZXhpc3RpbmdSZWNvcmQuVFRMLFxuICAgICAgICAgIEFsaWFzVGFyZ2V0OiBleGlzdGluZ1JlY29yZC5BbGlhc1RhcmdldCxcbiAgICAgICAgICBSZXNvdXJjZVJlY29yZHM6IGV4aXN0aW5nUmVjb3JkLlJlc291cmNlUmVjb3JkcyxcbiAgICAgICAgfSksXG4gICAgICB9XSxcbiAgICB9LFxuICB9KS5wcm9taXNlKCk7XG5cbiAgYXdhaXQgcm91dGU1My53YWl0Rm9yKCdyZXNvdXJjZVJlY29yZFNldHNDaGFuZ2VkJywgeyBJZDogY2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzLkNoYW5nZUluZm8uSWQgfSkucHJvbWlzZSgpO1xuXG4gIHJldHVybiB7XG4gICAgUGh5c2ljYWxSZXNvdXJjZUlkOiBgJHtleGlzdGluZ1JlY29yZC5OYW1lfS0ke2V4aXN0aW5nUmVjb3JkLlR5cGV9YCxcbiAgfTtcbn1cblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3Mtc2RrLWpzL2lzc3Vlcy8zNDExXG4vLyBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1zZGstanMvaXNzdWVzLzM1MDZcbmZ1bmN0aW9uIHJlbW92ZVVuZGVmaW5lZEFuZEVtcHR5PFQ+KG9iajogVCk6IFQge1xuICBjb25zdCByZXQ6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fTtcblxuICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhvYmopKSB7XG4gICAgaWYgKHYgJiYgKCFBcnJheS5pc0FycmF5KHYpIHx8IHYubGVuZ3RoICE9PSAwKSkge1xuICAgICAgcmV0W2tdID0gdjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmV0IGFzIFQ7XG59XG4iXX0=