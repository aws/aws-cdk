"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCompleteHandler = exports.onEventHandler = void 0;
const aws_sdk_1 = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
async function onEventHandler(event) {
    console.log('Event: %j', { ...event, ResponseURL: '...' });
    const dynamodb = new aws_sdk_1.DynamoDB();
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
        }).promise();
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
        }).promise();
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
    const dynamodb = new aws_sdk_1.DynamoDB();
    const data = await dynamodb.describeTable({
        TableName: event.ResourceProperties.TableName,
    }).promise();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxxQ0FBbUMsQ0FBQyx3REFBd0Q7QUFFckYsS0FBSyxVQUFVLGNBQWMsQ0FBQyxLQUFxQjtJQUN4RCxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxFQUFFLEdBQUcsS0FBSyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBRTNELE1BQU0sUUFBUSxHQUFHLElBQUksa0JBQVEsRUFBRSxDQUFDO0lBRWhDLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUM7SUFDckQsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQztJQUUvQyxJQUFJLGlCQUE2RCxDQUFDO0lBQ2xFLElBQUksS0FBSyxDQUFDLFdBQVcsS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLFdBQVcsS0FBSyxRQUFRLEVBQUU7UUFDcEUsaUJBQWlCLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztLQUN2QztTQUFNLEVBQUUsU0FBUztRQUNoQixrREFBa0Q7UUFDbEQsdUZBQXVGO1FBQ3ZGLG9IQUFvSDtRQUNwSCwwRUFBMEU7UUFDMUUsaUZBQWlGO1FBQ2pGLDZHQUE2RztRQUM3RyxNQUFNLG1CQUFtQixHQUFHLE1BQU0sUUFBUSxDQUFDLGFBQWEsQ0FBQztZQUN2RCxTQUFTLEVBQUUsU0FBUztTQUNyQixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFDdkQsTUFBTSxhQUFhLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBVSxLQUFLLE1BQU0sQ0FBQyxDQUFDO1FBQzFHLGlCQUFpQixHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7S0FDMUQ7SUFFRCxJQUFJLGlCQUFpQixFQUFFO1FBQ3JCLE1BQU0sSUFBSSxHQUFHLE1BQU0sUUFBUSxDQUFDLFdBQVcsQ0FBQztZQUN0QyxTQUFTLEVBQUUsU0FBUztZQUNwQixjQUFjLEVBQUU7Z0JBQ2Q7b0JBQ0UsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO3dCQUNuQixVQUFVLEVBQUUsTUFBTTtxQkFDbkI7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDdkM7U0FBTTtRQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsOERBQThELEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDckY7SUFFRCxPQUFPLEtBQUssQ0FBQyxXQUFXLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxXQUFXLEtBQUssUUFBUTtRQUNyRSxDQUFDLENBQUMsRUFBRSxrQkFBa0IsRUFBRSxHQUFHLFNBQVMsSUFBSSxNQUFNLEVBQUUsRUFBRTtRQUNsRCxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ1QsQ0FBQztBQTdDRCx3Q0E2Q0M7QUFFTSxLQUFLLFVBQVUsaUJBQWlCLENBQUMsS0FBd0I7SUFDOUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBRSxHQUFHLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUUzRCxNQUFNLFFBQVEsR0FBRyxJQUFJLGtCQUFRLEVBQUUsQ0FBQztJQUVoQyxNQUFNLElBQUksR0FBRyxNQUFNLFFBQVEsQ0FBQyxhQUFhLENBQUM7UUFDeEMsU0FBUyxFQUFFLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTO0tBQzlDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFFeEMsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxXQUFXLEtBQUssUUFBUSxDQUFDO0lBQ3pELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxJQUFJLEVBQUUsQ0FBQztJQUM1QyxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0YsTUFBTSxhQUFhLEdBQUcsYUFBYSxFQUFFLGFBQWEsS0FBSyxRQUFRLENBQUM7SUFDaEUsTUFBTSw0QkFBNEIsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsNEJBQTRCLEtBQUssTUFBTSxDQUFDO0lBRXRHLFFBQVEsS0FBSyxDQUFDLFdBQVcsRUFBRTtRQUN6QixLQUFLLFFBQVEsQ0FBQztRQUNkLEtBQUssUUFBUTtZQUNYLDhDQUE4QztZQUM5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsSUFBSSxDQUFDLGFBQWEsSUFBSSw0QkFBNEIsQ0FBQyxFQUFFLENBQUM7UUFDeEYsS0FBSyxRQUFRO1lBQ1gsZ0NBQWdDO1lBQ2hDLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxJQUFJLGFBQWEsS0FBSyxTQUFTLEVBQUUsQ0FBQztLQUNyRTtBQUNILENBQUM7QUF6QkQsOENBeUJDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuaW1wb3J0IHR5cGUgeyBJc0NvbXBsZXRlUmVxdWVzdCwgSXNDb21wbGV0ZVJlc3BvbnNlLCBPbkV2ZW50UmVxdWVzdCwgT25FdmVudFJlc3BvbnNlIH0gZnJvbSAnQGF3cy1jZGsvY3VzdG9tLXJlc291cmNlcy9saWIvcHJvdmlkZXItZnJhbWV3b3JrL3R5cGVzJztcbmltcG9ydCB7IER5bmFtb0RCIH0gZnJvbSAnYXdzLXNkayc7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBvbkV2ZW50SGFuZGxlcihldmVudDogT25FdmVudFJlcXVlc3QpOiBQcm9taXNlPE9uRXZlbnRSZXNwb25zZT4ge1xuICBjb25zb2xlLmxvZygnRXZlbnQ6ICVqJywgeyAuLi5ldmVudCwgUmVzcG9uc2VVUkw6ICcuLi4nIH0pO1xuXG4gIGNvbnN0IGR5bmFtb2RiID0gbmV3IER5bmFtb0RCKCk7XG5cbiAgY29uc3QgdGFibGVOYW1lID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlRhYmxlTmFtZTtcbiAgY29uc3QgcmVnaW9uID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlJlZ2lvbjtcblxuICBsZXQgdXBkYXRlVGFibGVBY3Rpb246ICdDcmVhdGUnIHwgJ1VwZGF0ZScgfCAnRGVsZXRlJyB8IHVuZGVmaW5lZDtcbiAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnQ3JlYXRlJyB8fCBldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ0RlbGV0ZScpIHtcbiAgICB1cGRhdGVUYWJsZUFjdGlvbiA9IGV2ZW50LlJlcXVlc3RUeXBlO1xuICB9IGVsc2UgeyAvLyBVcGRhdGVcbiAgICAvLyBUaGVyZSBhcmUgdHdvIGNhc2VzIHdoZXJlIGFuIFVwZGF0ZSBjYW4gaGFwcGVuOlxuICAgIC8vIDEuIEEgdGFibGUgcmVwbGFjZW1lbnQuIEluIHRoYXQgY2FzZSwgd2UgbmVlZCB0byBjcmVhdGUgdGhlIHJlcGxpY2EgaW4gdGhlIG5ldyBUYWJsZVxuICAgIC8vICh0aGUgcmVwbGljYSBmb3IgdGhlIFwib2xkXCIgVGFibGUgd2lsbCBiZSBkZWxldGVkIHdoZW4gQ0ZOIGlzc3VlcyBhIERlbGV0ZSBldmVudCBvbiB0aGUgb2xkIHBoeXNpY2FsIHJlc291cmNlIGlkKS5cbiAgICAvLyAyLiBBIGN1c3RvbWVyIGhhcyBjaGFuZ2VkIG9uZSBvZiB0aGUgcHJvcGVydGllcyBvZiB0aGUgQ3VzdG9tIFJlc291cmNlLFxuICAgIC8vIGxpa2UgJ3dhaXRGb3JSZXBsaWNhdGlvblRvRmluaXNoJy4gSW4gdGhhdCBjYXNlLCB3ZSBkb24ndCBoYXZlIHRvIGRvIGFueXRoaW5nLlxuICAgIC8vIFRvIGRpZmZlcmVudGlhdGUgdGhlIHR3byBjYXNlcywgd2UgbWFrZSBhbiBBUEkgY2FsbCB0byBEeW5hbW9EQiB0byBjaGVjayB3aGV0aGVyIGEgcmVwbGljYSBhbHJlYWR5IGV4aXN0cy5cbiAgICBjb25zdCBkZXNjcmliZVRhYmxlUmVzdWx0ID0gYXdhaXQgZHluYW1vZGIuZGVzY3JpYmVUYWJsZSh7XG4gICAgICBUYWJsZU5hbWU6IHRhYmxlTmFtZSxcbiAgICB9KS5wcm9taXNlKCk7XG4gICAgY29uc29sZS5sb2coJ0Rlc2NyaWJlIHRhYmxlOiAlaicsIGRlc2NyaWJlVGFibGVSZXN1bHQpO1xuICAgIGNvbnN0IHJlcGxpY2FFeGlzdHMgPSBkZXNjcmliZVRhYmxlUmVzdWx0LlRhYmxlPy5SZXBsaWNhcz8uc29tZShyZXBsaWNhID0+IHJlcGxpY2EuUmVnaW9uTmFtZSA9PT0gcmVnaW9uKTtcbiAgICB1cGRhdGVUYWJsZUFjdGlvbiA9IHJlcGxpY2FFeGlzdHMgPyB1bmRlZmluZWQgOiAnQ3JlYXRlJztcbiAgfVxuXG4gIGlmICh1cGRhdGVUYWJsZUFjdGlvbikge1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBkeW5hbW9kYi51cGRhdGVUYWJsZSh7XG4gICAgICBUYWJsZU5hbWU6IHRhYmxlTmFtZSxcbiAgICAgIFJlcGxpY2FVcGRhdGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBbdXBkYXRlVGFibGVBY3Rpb25dOiB7XG4gICAgICAgICAgICBSZWdpb25OYW1lOiByZWdpb24sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSkucHJvbWlzZSgpO1xuICAgIGNvbnNvbGUubG9nKCdVcGRhdGUgdGFibGU6ICVqJywgZGF0YSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coXCJTa2lwcGluZyB1cGRhdGluZyBUYWJsZSwgYXMgYSByZXBsaWNhIGluICclcycgYWxyZWFkeSBleGlzdHNcIiwgcmVnaW9uKTtcbiAgfVxuXG4gIHJldHVybiBldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ0NyZWF0ZScgfHwgZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdVcGRhdGUnXG4gICAgPyB7IFBoeXNpY2FsUmVzb3VyY2VJZDogYCR7dGFibGVOYW1lfS0ke3JlZ2lvbn1gIH1cbiAgICA6IHt9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaXNDb21wbGV0ZUhhbmRsZXIoZXZlbnQ6IElzQ29tcGxldGVSZXF1ZXN0KTogUHJvbWlzZTxJc0NvbXBsZXRlUmVzcG9uc2U+IHtcbiAgY29uc29sZS5sb2coJ0V2ZW50OiAlaicsIHsgLi4uZXZlbnQsIFJlc3BvbnNlVVJMOiAnLi4uJyB9KTtcblxuICBjb25zdCBkeW5hbW9kYiA9IG5ldyBEeW5hbW9EQigpO1xuXG4gIGNvbnN0IGRhdGEgPSBhd2FpdCBkeW5hbW9kYi5kZXNjcmliZVRhYmxlKHtcbiAgICBUYWJsZU5hbWU6IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5UYWJsZU5hbWUsXG4gIH0pLnByb21pc2UoKTtcbiAgY29uc29sZS5sb2coJ0Rlc2NyaWJlIHRhYmxlOiAlaicsIGRhdGEpO1xuXG4gIGNvbnN0IHRhYmxlQWN0aXZlID0gZGF0YS5UYWJsZT8uVGFibGVTdGF0dXMgPT09ICdBQ1RJVkUnO1xuICBjb25zdCByZXBsaWNhcyA9IGRhdGEuVGFibGU/LlJlcGxpY2FzID8/IFtdO1xuICBjb25zdCByZWdpb25SZXBsaWNhID0gcmVwbGljYXMuZmluZChyID0+IHIuUmVnaW9uTmFtZSA9PT0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlJlZ2lvbik7XG4gIGNvbnN0IHJlcGxpY2FBY3RpdmUgPSByZWdpb25SZXBsaWNhPy5SZXBsaWNhU3RhdHVzID09PSAnQUNUSVZFJztcbiAgY29uc3Qgc2tpcFJlcGxpY2F0aW9uQ29tcGxldGVkV2FpdCA9IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5Ta2lwUmVwbGljYXRpb25Db21wbGV0ZWRXYWl0ID09PSAndHJ1ZSc7XG5cbiAgc3dpdGNoIChldmVudC5SZXF1ZXN0VHlwZSkge1xuICAgIGNhc2UgJ0NyZWF0ZSc6XG4gICAgY2FzZSAnVXBkYXRlJzpcbiAgICAgIC8vIENvbXBsZXRlIHdoZW4gcmVwbGljYSBpcyByZXBvcnRlZCBhcyBBQ1RJVkVcbiAgICAgIHJldHVybiB7IElzQ29tcGxldGU6IHRhYmxlQWN0aXZlICYmIChyZXBsaWNhQWN0aXZlIHx8IHNraXBSZXBsaWNhdGlvbkNvbXBsZXRlZFdhaXQpIH07XG4gICAgY2FzZSAnRGVsZXRlJzpcbiAgICAgIC8vIENvbXBsZXRlIHdoZW4gcmVwbGljYSBpcyBnb25lXG4gICAgICByZXR1cm4geyBJc0NvbXBsZXRlOiB0YWJsZUFjdGl2ZSAmJiByZWdpb25SZXBsaWNhID09PSB1bmRlZmluZWQgfTtcbiAgfVxufVxuIl19