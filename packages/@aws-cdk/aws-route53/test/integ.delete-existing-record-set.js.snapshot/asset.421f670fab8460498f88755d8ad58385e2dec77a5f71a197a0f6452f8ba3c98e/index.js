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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBa0MsQ0FBQyx3REFBd0Q7QUFRcEYsS0FBSyxVQUFVLE9BQU8sQ0FBQyxLQUFrRDtJQUM5RSxNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsa0JBQW1ELENBQUM7SUFFaEYsZ0VBQWdFO0lBQ2hFLElBQUksS0FBSyxDQUFDLFdBQVcsS0FBSyxRQUFRLEVBQUU7UUFDbEMsT0FBTztLQUNSO0lBRUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7SUFFMUQsTUFBTSxzQkFBc0IsR0FBRyxNQUFNLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQztRQUNsRSxZQUFZLEVBQUUsYUFBYSxDQUFDLFlBQVk7UUFDeEMsZUFBZSxFQUFFLGFBQWEsQ0FBQyxVQUFVO1FBQ3pDLGVBQWUsRUFBRSxhQUFhLENBQUMsVUFBVTtLQUMxQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFFYixNQUFNLGNBQWMsR0FBRyxzQkFBc0IsQ0FBQyxrQkFBa0I7U0FDN0QsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxhQUFhLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRXpGLElBQUksQ0FBQyxjQUFjLEVBQUU7UUFDbkIsb0RBQW9EO1FBQ3BELE9BQU87S0FDUjtJQUVELE1BQU0sd0JBQXdCLEdBQUcsTUFBTSxPQUFPLENBQUMsd0JBQXdCLENBQUM7UUFDdEUsWUFBWSxFQUFFLGFBQWEsQ0FBQyxZQUFZO1FBQ3hDLFdBQVcsRUFBRTtZQUNYLE9BQU8sRUFBRSxDQUFDO29CQUNSLE1BQU0sRUFBRSxRQUFRO29CQUNoQixpQkFBaUIsRUFBRSx1QkFBdUIsQ0FBQzt3QkFDekMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxJQUFJO3dCQUN6QixJQUFJLEVBQUUsY0FBYyxDQUFDLElBQUk7d0JBQ3pCLEdBQUcsRUFBRSxjQUFjLENBQUMsR0FBRzt3QkFDdkIsV0FBVyxFQUFFLGNBQWMsQ0FBQyxXQUFXO3dCQUN2QyxlQUFlLEVBQUUsY0FBYyxDQUFDLGVBQWU7cUJBQ2hELENBQUM7aUJBQ0gsQ0FBQztTQUNIO0tBQ0YsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBRWIsTUFBTSxPQUFPLENBQUMsT0FBTyxDQUFDLDJCQUEyQixFQUFFLEVBQUUsRUFBRSxFQUFFLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBRTdHLE9BQU87UUFDTCxrQkFBa0IsRUFBRSxHQUFHLGNBQWMsQ0FBQyxJQUFJLElBQUksY0FBYyxDQUFDLElBQUksRUFBRTtLQUNwRSxDQUFDO0FBQ0osQ0FBQztBQTdDRCwwQkE2Q0M7QUFFRCxnREFBZ0Q7QUFDaEQsZ0RBQWdEO0FBQ2hELFNBQVMsdUJBQXVCLENBQXVDLEdBQU07SUFDM0UsTUFBTSxHQUFHLEdBQTJCLEVBQUUsQ0FBQztJQUV2QyxLQUFLLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUN4QyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQzlDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDWjtLQUNGO0lBRUQsT0FBTyxHQUFRLENBQUM7QUFDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJvdXRlNTMgfSBmcm9tICdhd3Mtc2RrJzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcblxuaW50ZXJmYWNlIFJlc291cmNlUHJvcGVydGllcyB7XG4gIEhvc3RlZFpvbmVJZDogc3RyaW5nO1xuICBSZWNvcmROYW1lOiBzdHJpbmc7XG4gIFJlY29yZFR5cGU6IHN0cmluZztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQpIHtcbiAgY29uc3QgcmVzb3VyY2VQcm9wcyA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcyBhcyB1bmtub3duIGFzIFJlc291cmNlUHJvcGVydGllcztcblxuICAvLyBPbmx5IGRlbGV0ZSB0aGUgZXhpc3RpbmcgcmVjb3JkIHdoZW4gdGhlIG5ldyBvbmUgZ2V0cyBjcmVhdGVkXG4gIGlmIChldmVudC5SZXF1ZXN0VHlwZSAhPT0gJ0NyZWF0ZScpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCByb3V0ZTUzID0gbmV3IFJvdXRlNTMoeyBhcGlWZXJzaW9uOiAnMjAxMy0wNC0wMScgfSk7XG5cbiAgY29uc3QgbGlzdFJlc291cmNlUmVjb3JkU2V0cyA9IGF3YWl0IHJvdXRlNTMubGlzdFJlc291cmNlUmVjb3JkU2V0cyh7XG4gICAgSG9zdGVkWm9uZUlkOiByZXNvdXJjZVByb3BzLkhvc3RlZFpvbmVJZCxcbiAgICBTdGFydFJlY29yZE5hbWU6IHJlc291cmNlUHJvcHMuUmVjb3JkTmFtZSxcbiAgICBTdGFydFJlY29yZFR5cGU6IHJlc291cmNlUHJvcHMuUmVjb3JkVHlwZSxcbiAgfSkucHJvbWlzZSgpO1xuXG4gIGNvbnN0IGV4aXN0aW5nUmVjb3JkID0gbGlzdFJlc291cmNlUmVjb3JkU2V0cy5SZXNvdXJjZVJlY29yZFNldHNcbiAgICAuZmluZChyID0+IHIuTmFtZSA9PT0gcmVzb3VyY2VQcm9wcy5SZWNvcmROYW1lICYmIHIuVHlwZSA9PT0gcmVzb3VyY2VQcm9wcy5SZWNvcmRUeXBlKTtcblxuICBpZiAoIWV4aXN0aW5nUmVjb3JkKSB7XG4gICAgLy8gVGhlcmUgaXMgbm8gZXhpc3RpbmcgcmVjb3JkLCB3ZSBjYW4gc2FmZWx5IHJldHVyblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGNoYW5nZVJlc291cmNlUmVjb3JkU2V0cyA9IGF3YWl0IHJvdXRlNTMuY2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzKHtcbiAgICBIb3N0ZWRab25lSWQ6IHJlc291cmNlUHJvcHMuSG9zdGVkWm9uZUlkLFxuICAgIENoYW5nZUJhdGNoOiB7XG4gICAgICBDaGFuZ2VzOiBbe1xuICAgICAgICBBY3Rpb246ICdERUxFVEUnLFxuICAgICAgICBSZXNvdXJjZVJlY29yZFNldDogcmVtb3ZlVW5kZWZpbmVkQW5kRW1wdHkoe1xuICAgICAgICAgIE5hbWU6IGV4aXN0aW5nUmVjb3JkLk5hbWUsXG4gICAgICAgICAgVHlwZTogZXhpc3RpbmdSZWNvcmQuVHlwZSxcbiAgICAgICAgICBUVEw6IGV4aXN0aW5nUmVjb3JkLlRUTCxcbiAgICAgICAgICBBbGlhc1RhcmdldDogZXhpc3RpbmdSZWNvcmQuQWxpYXNUYXJnZXQsXG4gICAgICAgICAgUmVzb3VyY2VSZWNvcmRzOiBleGlzdGluZ1JlY29yZC5SZXNvdXJjZVJlY29yZHMsXG4gICAgICAgIH0pLFxuICAgICAgfV0sXG4gICAgfSxcbiAgfSkucHJvbWlzZSgpO1xuXG4gIGF3YWl0IHJvdXRlNTMud2FpdEZvcigncmVzb3VyY2VSZWNvcmRTZXRzQ2hhbmdlZCcsIHsgSWQ6IGNoYW5nZVJlc291cmNlUmVjb3JkU2V0cy5DaGFuZ2VJbmZvLklkIH0pLnByb21pc2UoKTtcblxuICByZXR1cm4ge1xuICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogYCR7ZXhpc3RpbmdSZWNvcmQuTmFtZX0tJHtleGlzdGluZ1JlY29yZC5UeXBlfWAsXG4gIH07XG59XG5cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLXNkay1qcy9pc3N1ZXMvMzQxMVxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3Mtc2RrLWpzL2lzc3Vlcy8zNTA2XG5mdW5jdGlvbiByZW1vdmVVbmRlZmluZWRBbmRFbXB0eTxUIGV4dGVuZHMgeyBba2V5OiBzdHJpbmddOiB1bmtub3duIH0+KG9iajogVCk6IFQge1xuICBjb25zdCByZXQ6IHsgW2tleTogc3RyaW5nXTogYW55IH0gPSB7fTtcblxuICBmb3IgKGNvbnN0IFtrLCB2XSBvZiBPYmplY3QuZW50cmllcyhvYmopKSB7XG4gICAgaWYgKHYgJiYgKCFBcnJheS5pc0FycmF5KHYpIHx8IHYubGVuZ3RoICE9PSAwKSkge1xuICAgICAgcmV0W2tdID0gdjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmV0IGFzIFQ7XG59XG4iXX0=