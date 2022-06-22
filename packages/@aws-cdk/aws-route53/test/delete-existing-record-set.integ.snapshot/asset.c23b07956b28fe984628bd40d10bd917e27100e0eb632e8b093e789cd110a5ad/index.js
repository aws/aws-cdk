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
                    ResourceRecordSet: {
                        Name: existingRecord.Name,
                        Type: existingRecord.Type,
                        // changeResourceRecordSets does not correctly handle undefined values
                        // https://github.com/aws/aws-sdk-js/issues/3506
                        ...existingRecord.TTL ? { TTL: existingRecord.TTL } : {},
                        ...existingRecord.AliasTarget ? { AliasTarget: existingRecord.AliasTarget } : {},
                        ...existingRecord.ResourceRecords ? { ResourceRecords: existingRecord.ResourceRecords } : {},
                    },
                }],
        },
    }).promise();
    await route53.waitFor('resourceRecordSetsChanged', { Id: changeResourceRecordSets.ChangeInfo.Id }).promise();
    return {
        PhysicalResourceId: `${existingRecord.Name}-${existingRecord.Type}`,
    };
}
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBa0MsQ0FBQyx3REFBd0Q7QUFRcEYsS0FBSyxVQUFVLE9BQU8sQ0FBQyxLQUFrRDtJQUM5RSxNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsa0JBQW1ELENBQUM7SUFFaEYsZ0VBQWdFO0lBQ2hFLElBQUksS0FBSyxDQUFDLFdBQVcsS0FBSyxRQUFRLEVBQUU7UUFDbEMsT0FBTztLQUNSO0lBRUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7SUFFMUQsTUFBTSxzQkFBc0IsR0FBRyxNQUFNLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQztRQUNsRSxZQUFZLEVBQUUsYUFBYSxDQUFDLFlBQVk7UUFDeEMsZUFBZSxFQUFFLGFBQWEsQ0FBQyxVQUFVO1FBQ3pDLGVBQWUsRUFBRSxhQUFhLENBQUMsVUFBVTtLQUMxQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFFYixNQUFNLGNBQWMsR0FBRyxzQkFBc0IsQ0FBQyxrQkFBa0I7U0FDN0QsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxhQUFhLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBRXpGLElBQUksQ0FBQyxjQUFjLEVBQUU7UUFDbkIsb0RBQW9EO1FBQ3BELE9BQU87S0FDUjtJQUVELE1BQU0sd0JBQXdCLEdBQUcsTUFBTSxPQUFPLENBQUMsd0JBQXdCLENBQUM7UUFDdEUsWUFBWSxFQUFFLGFBQWEsQ0FBQyxZQUFZO1FBQ3hDLFdBQVcsRUFBRTtZQUNYLE9BQU8sRUFBRSxDQUFDO29CQUNSLE1BQU0sRUFBRSxRQUFRO29CQUNoQixpQkFBaUIsRUFBRTt3QkFDakIsSUFBSSxFQUFFLGNBQWMsQ0FBQyxJQUFJO3dCQUN6QixJQUFJLEVBQUUsY0FBYyxDQUFDLElBQUk7d0JBQ3pCLHNFQUFzRTt3QkFDdEUsZ0RBQWdEO3dCQUNoRCxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDeEQsR0FBRyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxjQUFjLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQ2hGLEdBQUcsY0FBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRSxlQUFlLEVBQUUsY0FBYyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFO3FCQUM3RjtpQkFDRixDQUFDO1NBQ0g7S0FDRixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFFYixNQUFNLE9BQU8sQ0FBQyxPQUFPLENBQUMsMkJBQTJCLEVBQUUsRUFBRSxFQUFFLEVBQUUsd0JBQXdCLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFFN0csT0FBTztRQUNMLGtCQUFrQixFQUFFLEdBQUcsY0FBYyxDQUFDLElBQUksSUFBSSxjQUFjLENBQUMsSUFBSSxFQUFFO0tBQ3BFLENBQUM7QUFDSixDQUFDO0FBL0NELDBCQStDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJvdXRlNTMgfSBmcm9tICdhd3Mtc2RrJzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcblxuaW50ZXJmYWNlIFJlc291cmNlUHJvcGVydGllcyB7XG4gIEhvc3RlZFpvbmVJZDogc3RyaW5nO1xuICBSZWNvcmROYW1lOiBzdHJpbmc7XG4gIFJlY29yZFR5cGU6IHN0cmluZztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQpIHtcbiAgY29uc3QgcmVzb3VyY2VQcm9wcyA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcyBhcyB1bmtub3duIGFzIFJlc291cmNlUHJvcGVydGllcztcblxuICAvLyBPbmx5IGRlbGV0ZSB0aGUgZXhpc3RpbmcgcmVjb3JkIHdoZW4gdGhlIG5ldyBvbmUgZ2V0cyBjcmVhdGVkXG4gIGlmIChldmVudC5SZXF1ZXN0VHlwZSAhPT0gJ0NyZWF0ZScpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCByb3V0ZTUzID0gbmV3IFJvdXRlNTMoeyBhcGlWZXJzaW9uOiAnMjAxMy0wNC0wMScgfSk7XG5cbiAgY29uc3QgbGlzdFJlc291cmNlUmVjb3JkU2V0cyA9IGF3YWl0IHJvdXRlNTMubGlzdFJlc291cmNlUmVjb3JkU2V0cyh7XG4gICAgSG9zdGVkWm9uZUlkOiByZXNvdXJjZVByb3BzLkhvc3RlZFpvbmVJZCxcbiAgICBTdGFydFJlY29yZE5hbWU6IHJlc291cmNlUHJvcHMuUmVjb3JkTmFtZSxcbiAgICBTdGFydFJlY29yZFR5cGU6IHJlc291cmNlUHJvcHMuUmVjb3JkVHlwZSxcbiAgfSkucHJvbWlzZSgpO1xuXG4gIGNvbnN0IGV4aXN0aW5nUmVjb3JkID0gbGlzdFJlc291cmNlUmVjb3JkU2V0cy5SZXNvdXJjZVJlY29yZFNldHNcbiAgICAuZmluZChyID0+IHIuTmFtZSA9PT0gcmVzb3VyY2VQcm9wcy5SZWNvcmROYW1lICYmIHIuVHlwZSA9PT0gcmVzb3VyY2VQcm9wcy5SZWNvcmRUeXBlKTtcblxuICBpZiAoIWV4aXN0aW5nUmVjb3JkKSB7XG4gICAgLy8gVGhlcmUgaXMgbm8gZXhpc3RpbmcgcmVjb3JkLCB3ZSBjYW4gc2FmZWx5IHJldHVyblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGNoYW5nZVJlc291cmNlUmVjb3JkU2V0cyA9IGF3YWl0IHJvdXRlNTMuY2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzKHtcbiAgICBIb3N0ZWRab25lSWQ6IHJlc291cmNlUHJvcHMuSG9zdGVkWm9uZUlkLFxuICAgIENoYW5nZUJhdGNoOiB7XG4gICAgICBDaGFuZ2VzOiBbe1xuICAgICAgICBBY3Rpb246ICdERUxFVEUnLFxuICAgICAgICBSZXNvdXJjZVJlY29yZFNldDoge1xuICAgICAgICAgIE5hbWU6IGV4aXN0aW5nUmVjb3JkLk5hbWUsXG4gICAgICAgICAgVHlwZTogZXhpc3RpbmdSZWNvcmQuVHlwZSxcbiAgICAgICAgICAvLyBjaGFuZ2VSZXNvdXJjZVJlY29yZFNldHMgZG9lcyBub3QgY29ycmVjdGx5IGhhbmRsZSB1bmRlZmluZWQgdmFsdWVzXG4gICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3Mtc2RrLWpzL2lzc3Vlcy8zNTA2XG4gICAgICAgICAgLi4uZXhpc3RpbmdSZWNvcmQuVFRMID8geyBUVEw6IGV4aXN0aW5nUmVjb3JkLlRUTCB9IDoge30sXG4gICAgICAgICAgLi4uZXhpc3RpbmdSZWNvcmQuQWxpYXNUYXJnZXQgPyB7IEFsaWFzVGFyZ2V0OiBleGlzdGluZ1JlY29yZC5BbGlhc1RhcmdldCB9IDoge30sXG4gICAgICAgICAgLi4uZXhpc3RpbmdSZWNvcmQuUmVzb3VyY2VSZWNvcmRzID8geyBSZXNvdXJjZVJlY29yZHM6IGV4aXN0aW5nUmVjb3JkLlJlc291cmNlUmVjb3JkcyB9IDoge30sXG4gICAgICAgIH0sXG4gICAgICB9XSxcbiAgICB9LFxuICB9KS5wcm9taXNlKCk7XG5cbiAgYXdhaXQgcm91dGU1My53YWl0Rm9yKCdyZXNvdXJjZVJlY29yZFNldHNDaGFuZ2VkJywgeyBJZDogY2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzLkNoYW5nZUluZm8uSWQgfSkucHJvbWlzZSgpO1xuXG4gIHJldHVybiB7XG4gICAgUGh5c2ljYWxSZXNvdXJjZUlkOiBgJHtleGlzdGluZ1JlY29yZC5OYW1lfS0ke2V4aXN0aW5nUmVjb3JkLlR5cGV9YCxcbiAgfTtcbn1cbiJdfQ==