"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCompleteHandler = exports.onEventHandler = void 0;
/* eslint-disable no-console */
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb"); // eslint-disable-line import/no-extraneous-dependencies
async function onEventHandler(event) {
    console.log('Event: %j', { ...event, ResponseURL: '...' });
    const dynamodb = new client_dynamodb_1.DynamoDB({});
    const tableName = event.ResourceProperties.TableName;
    const region = event.ResourceProperties.Region;
    let updateTableAction;
    if (event.RequestType === 'Create' || event.RequestType === 'Delete') {
        updateTableAction = event.RequestType;
    }
    else { // Update
        // There are two cases where an Update can happen:
        // 1. A table replacement. In that case, we need to create the replica in the new Table
        // (the replica for the "old" Table will be deleted when CFN issues a Delete event on the old physical resource id).
        // 2. A customer has changed one of the properties of the Custom Resource,
        // like 'waitForReplicationToFinish'. In that case, we don't have to do anything.
        // To differentiate the two cases, we make an API call to DynamoDB to check whether a replica already exists.
        const describeTableResult = await dynamodb.describeTable({
            TableName: tableName,
        });
        console.log('Describe table: %j', describeTableResult);
        const replicaExists = describeTableResult.Table?.Replicas?.some(replica => replica.RegionName === region);
        updateTableAction = replicaExists ? undefined : 'Create';
    }
    if (updateTableAction) {
        const data = await dynamodb.updateTable({
            TableName: tableName,
            ReplicaUpdates: [
                {
                    [updateTableAction]: {
                        RegionName: region,
                    },
                },
            ],
        });
        console.log('Update table: %j', data);
    }
    else {
        console.log("Skipping updating Table, as a replica in '%s' already exists", region);
    }
    return event.RequestType === 'Create' || event.RequestType === 'Update'
        ? { PhysicalResourceId: `${tableName}-${region}` }
        : {};
}
exports.onEventHandler = onEventHandler;
async function isCompleteHandler(event) {
    console.log('Event: %j', { ...event, ResponseURL: '...' });
    const dynamodb = new client_dynamodb_1.DynamoDB({});
    const data = await dynamodb.describeTable({
        TableName: event.ResourceProperties.TableName,
    });
    console.log('Describe table: %j', data);
    const tableActive = data.Table?.TableStatus === 'ACTIVE';
    const replicas = data.Table?.Replicas ?? [];
    const regionReplica = replicas.find(r => r.RegionName === event.ResourceProperties.Region);
    const replicaActive = regionReplica?.ReplicaStatus === 'ACTIVE';
    const skipReplicationCompletedWait = event.ResourceProperties.SkipReplicationCompletedWait === 'true';
    switch (event.RequestType) {
        case 'Create':
        case 'Update':
            // Complete when replica is reported as ACTIVE
            return { IsComplete: tableActive && (replicaActive || skipReplicationCompletedWait) };
        case 'Delete':
            // Complete when replica is gone
            return { IsComplete: tableActive && regionReplica === undefined };
    }
}
exports.isCompleteHandler = isCompleteHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBK0I7QUFDL0IsOERBQW9ELENBQUMsd0RBQXdEO0FBR3RHLEtBQUssVUFBVSxjQUFjLENBQUMsS0FBcUI7SUFDeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBRSxHQUFHLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUUzRCxNQUFNLFFBQVEsR0FBRyxJQUFJLDBCQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFbEMsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQztJQUNyRCxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDO0lBRS9DLElBQUksaUJBQTZELENBQUM7SUFDbEUsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsRUFBRTtRQUNwRSxpQkFBaUIsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO0tBQ3ZDO1NBQU0sRUFBRSxTQUFTO1FBQ2hCLGtEQUFrRDtRQUNsRCx1RkFBdUY7UUFDdkYsb0hBQW9IO1FBQ3BILDBFQUEwRTtRQUMxRSxpRkFBaUY7UUFDakYsNkdBQTZHO1FBQzdHLE1BQU0sbUJBQW1CLEdBQUcsTUFBTSxRQUFRLENBQUMsYUFBYSxDQUFDO1lBQ3ZELFNBQVMsRUFBRSxTQUFTO1NBQ3JCLENBQUMsQ0FBQztRQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztRQUN2RCxNQUFNLGFBQWEsR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEtBQUssTUFBTSxDQUFDLENBQUM7UUFDMUcsaUJBQWlCLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztLQUMxRDtJQUVELElBQUksaUJBQWlCLEVBQUU7UUFDckIsTUFBTSxJQUFJLEdBQUcsTUFBTSxRQUFRLENBQUMsV0FBVyxDQUFDO1lBQ3RDLFNBQVMsRUFBRSxTQUFTO1lBQ3BCLGNBQWMsRUFBRTtnQkFDZDtvQkFDRSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7d0JBQ25CLFVBQVUsRUFBRSxNQUFNO3FCQUNuQjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUN2QztTQUFNO1FBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4REFBOEQsRUFBRSxNQUFNLENBQUMsQ0FBQztLQUNyRjtJQUVELE9BQU8sS0FBSyxDQUFDLFdBQVcsS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLFdBQVcsS0FBSyxRQUFRO1FBQ3JFLENBQUMsQ0FBQyxFQUFFLGtCQUFrQixFQUFFLEdBQUcsU0FBUyxJQUFJLE1BQU0sRUFBRSxFQUFFO1FBQ2xELENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDVCxDQUFDO0FBN0NELHdDQTZDQztBQUVNLEtBQUssVUFBVSxpQkFBaUIsQ0FBQyxLQUF3QjtJQUM5RCxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxFQUFFLEdBQUcsS0FBSyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBRTNELE1BQU0sUUFBUSxHQUFHLElBQUksMEJBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUVsQyxNQUFNLElBQUksR0FBRyxNQUFNLFFBQVEsQ0FBQyxhQUFhLENBQUM7UUFDeEMsU0FBUyxFQUFFLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTO0tBQzlDLENBQUMsQ0FBQztJQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFeEMsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxXQUFXLEtBQUssUUFBUSxDQUFDO0lBQ3pELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxJQUFJLEVBQUUsQ0FBQztJQUM1QyxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0YsTUFBTSxhQUFhLEdBQUcsYUFBYSxFQUFFLGFBQWEsS0FBSyxRQUFRLENBQUM7SUFDaEUsTUFBTSw0QkFBNEIsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsNEJBQTRCLEtBQUssTUFBTSxDQUFDO0lBRXRHLFFBQVEsS0FBSyxDQUFDLFdBQVcsRUFBRTtRQUN6QixLQUFLLFFBQVEsQ0FBQztRQUNkLEtBQUssUUFBUTtZQUNYLDhDQUE4QztZQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsSUFBSSxDQUFDLGFBQWEsSUFBSSw0QkFBNEIsQ0FBQyxFQUFFLENBQUM7UUFDeEYsS0FBSyxRQUFRO1lBQ1gsZ0NBQWdDO1lBQ2hDLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxJQUFJLGFBQWEsS0FBSyxTQUFTLEVBQUUsQ0FBQztLQUNyRTtBQUNILENBQUM7QUF6QkQsOENBeUJDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuaW1wb3J0IHsgRHluYW1vREIgfSBmcm9tICdAYXdzLXNkay9jbGllbnQtZHluYW1vZGInOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHR5cGUgeyBJc0NvbXBsZXRlUmVxdWVzdCwgSXNDb21wbGV0ZVJlc3BvbnNlLCBPbkV2ZW50UmVxdWVzdCwgT25FdmVudFJlc3BvbnNlIH0gZnJvbSAnLi4vLi4vLi4vY3VzdG9tLXJlc291cmNlcy9saWIvcHJvdmlkZXItZnJhbWV3b3JrL3R5cGVzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9uRXZlbnRIYW5kbGVyKGV2ZW50OiBPbkV2ZW50UmVxdWVzdCk6IFByb21pc2U8T25FdmVudFJlc3BvbnNlPiB7XG4gIGNvbnNvbGUubG9nKCdFdmVudDogJWonLCB7IC4uLmV2ZW50LCBSZXNwb25zZVVSTDogJy4uLicgfSk7XG5cbiAgY29uc3QgZHluYW1vZGIgPSBuZXcgRHluYW1vREIoe30pO1xuXG4gIGNvbnN0IHRhYmxlTmFtZSA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5UYWJsZU5hbWU7XG4gIGNvbnN0IHJlZ2lvbiA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5SZWdpb247XG5cbiAgbGV0IHVwZGF0ZVRhYmxlQWN0aW9uOiAnQ3JlYXRlJyB8ICdVcGRhdGUnIHwgJ0RlbGV0ZScgfCB1bmRlZmluZWQ7XG4gIGlmIChldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ0NyZWF0ZScgfHwgZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdEZWxldGUnKSB7XG4gICAgdXBkYXRlVGFibGVBY3Rpb24gPSBldmVudC5SZXF1ZXN0VHlwZTtcbiAgfSBlbHNlIHsgLy8gVXBkYXRlXG4gICAgLy8gVGhlcmUgYXJlIHR3byBjYXNlcyB3aGVyZSBhbiBVcGRhdGUgY2FuIGhhcHBlbjpcbiAgICAvLyAxLiBBIHRhYmxlIHJlcGxhY2VtZW50LiBJbiB0aGF0IGNhc2UsIHdlIG5lZWQgdG8gY3JlYXRlIHRoZSByZXBsaWNhIGluIHRoZSBuZXcgVGFibGVcbiAgICAvLyAodGhlIHJlcGxpY2EgZm9yIHRoZSBcIm9sZFwiIFRhYmxlIHdpbGwgYmUgZGVsZXRlZCB3aGVuIENGTiBpc3N1ZXMgYSBEZWxldGUgZXZlbnQgb24gdGhlIG9sZCBwaHlzaWNhbCByZXNvdXJjZSBpZCkuXG4gICAgLy8gMi4gQSBjdXN0b21lciBoYXMgY2hhbmdlZCBvbmUgb2YgdGhlIHByb3BlcnRpZXMgb2YgdGhlIEN1c3RvbSBSZXNvdXJjZSxcbiAgICAvLyBsaWtlICd3YWl0Rm9yUmVwbGljYXRpb25Ub0ZpbmlzaCcuIEluIHRoYXQgY2FzZSwgd2UgZG9uJ3QgaGF2ZSB0byBkbyBhbnl0aGluZy5cbiAgICAvLyBUbyBkaWZmZXJlbnRpYXRlIHRoZSB0d28gY2FzZXMsIHdlIG1ha2UgYW4gQVBJIGNhbGwgdG8gRHluYW1vREIgdG8gY2hlY2sgd2hldGhlciBhIHJlcGxpY2EgYWxyZWFkeSBleGlzdHMuXG4gICAgY29uc3QgZGVzY3JpYmVUYWJsZVJlc3VsdCA9IGF3YWl0IGR5bmFtb2RiLmRlc2NyaWJlVGFibGUoe1xuICAgICAgVGFibGVOYW1lOiB0YWJsZU5hbWUsXG4gICAgfSk7XG4gICAgY29uc29sZS5sb2coJ0Rlc2NyaWJlIHRhYmxlOiAlaicsIGRlc2NyaWJlVGFibGVSZXN1bHQpO1xuICAgIGNvbnN0IHJlcGxpY2FFeGlzdHMgPSBkZXNjcmliZVRhYmxlUmVzdWx0LlRhYmxlPy5SZXBsaWNhcz8uc29tZShyZXBsaWNhID0+IHJlcGxpY2EuUmVnaW9uTmFtZSA9PT0gcmVnaW9uKTtcbiAgICB1cGRhdGVUYWJsZUFjdGlvbiA9IHJlcGxpY2FFeGlzdHMgPyB1bmRlZmluZWQgOiAnQ3JlYXRlJztcbiAgfVxuXG4gIGlmICh1cGRhdGVUYWJsZUFjdGlvbikge1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBkeW5hbW9kYi51cGRhdGVUYWJsZSh7XG4gICAgICBUYWJsZU5hbWU6IHRhYmxlTmFtZSxcbiAgICAgIFJlcGxpY2FVcGRhdGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBbdXBkYXRlVGFibGVBY3Rpb25dOiB7XG4gICAgICAgICAgICBSZWdpb25OYW1lOiByZWdpb24sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgY29uc29sZS5sb2coJ1VwZGF0ZSB0YWJsZTogJWonLCBkYXRhKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZyhcIlNraXBwaW5nIHVwZGF0aW5nIFRhYmxlLCBhcyBhIHJlcGxpY2EgaW4gJyVzJyBhbHJlYWR5IGV4aXN0c1wiLCByZWdpb24pO1xuICB9XG5cbiAgcmV0dXJuIGV2ZW50LlJlcXVlc3RUeXBlID09PSAnQ3JlYXRlJyB8fCBldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ1VwZGF0ZSdcbiAgICA/IHsgUGh5c2ljYWxSZXNvdXJjZUlkOiBgJHt0YWJsZU5hbWV9LSR7cmVnaW9ufWAgfVxuICAgIDoge307XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpc0NvbXBsZXRlSGFuZGxlcihldmVudDogSXNDb21wbGV0ZVJlcXVlc3QpOiBQcm9taXNlPElzQ29tcGxldGVSZXNwb25zZT4ge1xuICBjb25zb2xlLmxvZygnRXZlbnQ6ICVqJywgeyAuLi5ldmVudCwgUmVzcG9uc2VVUkw6ICcuLi4nIH0pO1xuXG4gIGNvbnN0IGR5bmFtb2RiID0gbmV3IER5bmFtb0RCKHt9KTtcblxuICBjb25zdCBkYXRhID0gYXdhaXQgZHluYW1vZGIuZGVzY3JpYmVUYWJsZSh7XG4gICAgVGFibGVOYW1lOiBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuVGFibGVOYW1lLFxuICB9KTtcbiAgY29uc29sZS5sb2coJ0Rlc2NyaWJlIHRhYmxlOiAlaicsIGRhdGEpO1xuXG4gIGNvbnN0IHRhYmxlQWN0aXZlID0gZGF0YS5UYWJsZT8uVGFibGVTdGF0dXMgPT09ICdBQ1RJVkUnO1xuICBjb25zdCByZXBsaWNhcyA9IGRhdGEuVGFibGU/LlJlcGxpY2FzID8/IFtdO1xuICBjb25zdCByZWdpb25SZXBsaWNhID0gcmVwbGljYXMuZmluZChyID0+IHIuUmVnaW9uTmFtZSA9PT0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlJlZ2lvbik7XG4gIGNvbnN0IHJlcGxpY2FBY3RpdmUgPSByZWdpb25SZXBsaWNhPy5SZXBsaWNhU3RhdHVzID09PSAnQUNUSVZFJztcbiAgY29uc3Qgc2tpcFJlcGxpY2F0aW9uQ29tcGxldGVkV2FpdCA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Ta2lwUmVwbGljYXRpb25Db21wbGV0ZWRXYWl0ID09PSAndHJ1ZSc7XG5cbiAgc3dpdGNoIChldmVudC5SZXF1ZXN0VHlwZSkge1xuICAgIGNhc2UgJ0NyZWF0ZSc6XG4gICAgY2FzZSAnVXBkYXRlJzpcbiAgICAgIC8vIENvbXBsZXRlIHdoZW4gcmVwbGljYSBpcyByZXBvcnRlZCBhcyBBQ1RJVkVcbiAgICAgIHJldHVybiB7IElzQ29tcGxldGU6IHRhYmxlQWN0aXZlICYmIChyZXBsaWNhQWN0aXZlIHx8IHNraXBSZXBsaWNhdGlvbkNvbXBsZXRlZFdhaXQpIH07XG4gICAgY2FzZSAnRGVsZXRlJzpcbiAgICAgIC8vIENvbXBsZXRlIHdoZW4gcmVwbGljYSBpcyBnb25lXG4gICAgICByZXR1cm4geyBJc0NvbXBsZXRlOiB0YWJsZUFjdGl2ZSAmJiByZWdpb25SZXBsaWNhID09PSB1bmRlZmluZWQgfTtcbiAgfVxufVxuIl19