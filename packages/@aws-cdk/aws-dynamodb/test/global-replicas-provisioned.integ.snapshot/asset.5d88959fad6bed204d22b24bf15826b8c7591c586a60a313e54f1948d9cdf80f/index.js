"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCompleteHandler = exports.onEventHandler = void 0;
const aws_sdk_1 = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
async function onEventHandler(event) {
    console.log('Event: %j', event);
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
    console.log('Event: %j', event);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxxQ0FBbUMsQ0FBQyx3REFBd0Q7QUFFckYsS0FBSyxVQUFVLGNBQWMsQ0FBQyxLQUFxQjtJQUN4RCxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUVoQyxNQUFNLFFBQVEsR0FBRyxJQUFJLGtCQUFRLEVBQUUsQ0FBQztJQUVoQyxNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDO0lBQ3JELE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUM7SUFFL0MsSUFBSSxpQkFBNkQsQ0FBQztJQUNsRSxJQUFJLEtBQUssQ0FBQyxXQUFXLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxXQUFXLEtBQUssUUFBUSxFQUFFO1FBQ3BFLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7S0FDdkM7U0FBTSxFQUFFLFNBQVM7UUFDaEIsa0RBQWtEO1FBQ2xELHVGQUF1RjtRQUN2RixvSEFBb0g7UUFDcEgsMEVBQTBFO1FBQzFFLGlGQUFpRjtRQUNqRiw2R0FBNkc7UUFDN0csTUFBTSxtQkFBbUIsR0FBRyxNQUFNLFFBQVEsQ0FBQyxhQUFhLENBQUM7WUFDdkQsU0FBUyxFQUFFLFNBQVM7U0FDckIsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sYUFBYSxHQUFHLG1CQUFtQixDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQVUsS0FBSyxNQUFNLENBQUMsQ0FBQztRQUMxRyxpQkFBaUIsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO0tBQzFEO0lBRUQsSUFBSSxpQkFBaUIsRUFBRTtRQUNyQixNQUFNLElBQUksR0FBRyxNQUFNLFFBQVEsQ0FBQyxXQUFXLENBQUM7WUFDdEMsU0FBUyxFQUFFLFNBQVM7WUFDcEIsY0FBYyxFQUFFO2dCQUNkO29CQUNFLENBQUMsaUJBQWlCLENBQUMsRUFBRTt3QkFDbkIsVUFBVSxFQUFFLE1BQU07cUJBQ25CO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDYixPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3ZDO1NBQU07UUFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLDhEQUE4RCxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQ3JGO0lBRUQsT0FBTyxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVE7UUFDckUsQ0FBQyxDQUFDLEVBQUUsa0JBQWtCLEVBQUUsR0FBRyxTQUFTLElBQUksTUFBTSxFQUFFLEVBQUU7UUFDbEQsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUNULENBQUM7QUE3Q0Qsd0NBNkNDO0FBRU0sS0FBSyxVQUFVLGlCQUFpQixDQUFDLEtBQXdCO0lBQzlELE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRWhDLE1BQU0sUUFBUSxHQUFHLElBQUksa0JBQVEsRUFBRSxDQUFDO0lBRWhDLE1BQU0sSUFBSSxHQUFHLE1BQU0sUUFBUSxDQUFDLGFBQWEsQ0FBQztRQUN4QyxTQUFTLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixDQUFDLFNBQVM7S0FDOUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUV4QyxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLFdBQVcsS0FBSyxRQUFRLENBQUM7SUFDekQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLElBQUksRUFBRSxDQUFDO0lBQzVDLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxLQUFLLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMzRixNQUFNLGFBQWEsR0FBRyxhQUFhLEVBQUUsYUFBYSxLQUFLLFFBQVEsQ0FBQztJQUNoRSxNQUFNLDRCQUE0QixHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyw0QkFBNEIsS0FBSyxNQUFNLENBQUM7SUFFdEcsUUFBUSxLQUFLLENBQUMsV0FBVyxFQUFFO1FBQ3pCLEtBQUssUUFBUSxDQUFDO1FBQ2QsS0FBSyxRQUFRO1lBQ1gsOENBQThDO1lBQzlDLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxJQUFJLENBQUMsYUFBYSxJQUFJLDRCQUE0QixDQUFDLEVBQUUsQ0FBQztRQUN4RixLQUFLLFFBQVE7WUFDWCxnQ0FBZ0M7WUFDaEMsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLElBQUksYUFBYSxLQUFLLFNBQVMsRUFBRSxDQUFDO0tBQ3JFO0FBQ0gsQ0FBQztBQXpCRCw4Q0F5QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5pbXBvcnQgdHlwZSB7IElzQ29tcGxldGVSZXF1ZXN0LCBJc0NvbXBsZXRlUmVzcG9uc2UsIE9uRXZlbnRSZXF1ZXN0LCBPbkV2ZW50UmVzcG9uc2UgfSBmcm9tICdAYXdzLWNkay9jdXN0b20tcmVzb3VyY2VzL2xpYi9wcm92aWRlci1mcmFtZXdvcmsvdHlwZXMnO1xuaW1wb3J0IHsgRHluYW1vREIgfSBmcm9tICdhd3Mtc2RrJzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9uRXZlbnRIYW5kbGVyKGV2ZW50OiBPbkV2ZW50UmVxdWVzdCk6IFByb21pc2U8T25FdmVudFJlc3BvbnNlPiB7XG4gIGNvbnNvbGUubG9nKCdFdmVudDogJWonLCBldmVudCk7XG5cbiAgY29uc3QgZHluYW1vZGIgPSBuZXcgRHluYW1vREIoKTtcblxuICBjb25zdCB0YWJsZU5hbWUgPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuVGFibGVOYW1lO1xuICBjb25zdCByZWdpb24gPSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuUmVnaW9uO1xuXG4gIGxldCB1cGRhdGVUYWJsZUFjdGlvbjogJ0NyZWF0ZScgfCAnVXBkYXRlJyB8ICdEZWxldGUnIHwgdW5kZWZpbmVkO1xuICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdDcmVhdGUnIHx8IGV2ZW50LlJlcXVlc3RUeXBlID09PSAnRGVsZXRlJykge1xuICAgIHVwZGF0ZVRhYmxlQWN0aW9uID0gZXZlbnQuUmVxdWVzdFR5cGU7XG4gIH0gZWxzZSB7IC8vIFVwZGF0ZVxuICAgIC8vIFRoZXJlIGFyZSB0d28gY2FzZXMgd2hlcmUgYW4gVXBkYXRlIGNhbiBoYXBwZW46XG4gICAgLy8gMS4gQSB0YWJsZSByZXBsYWNlbWVudC4gSW4gdGhhdCBjYXNlLCB3ZSBuZWVkIHRvIGNyZWF0ZSB0aGUgcmVwbGljYSBpbiB0aGUgbmV3IFRhYmxlXG4gICAgLy8gKHRoZSByZXBsaWNhIGZvciB0aGUgXCJvbGRcIiBUYWJsZSB3aWxsIGJlIGRlbGV0ZWQgd2hlbiBDRk4gaXNzdWVzIGEgRGVsZXRlIGV2ZW50IG9uIHRoZSBvbGQgcGh5c2ljYWwgcmVzb3VyY2UgaWQpLlxuICAgIC8vIDIuIEEgY3VzdG9tZXIgaGFzIGNoYW5nZWQgb25lIG9mIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBDdXN0b20gUmVzb3VyY2UsXG4gICAgLy8gbGlrZSAnd2FpdEZvclJlcGxpY2F0aW9uVG9GaW5pc2gnLiBJbiB0aGF0IGNhc2UsIHdlIGRvbid0IGhhdmUgdG8gZG8gYW55dGhpbmcuXG4gICAgLy8gVG8gZGlmZmVyZW50aWF0ZSB0aGUgdHdvIGNhc2VzLCB3ZSBtYWtlIGFuIEFQSSBjYWxsIHRvIER5bmFtb0RCIHRvIGNoZWNrIHdoZXRoZXIgYSByZXBsaWNhIGFscmVhZHkgZXhpc3RzLlxuICAgIGNvbnN0IGRlc2NyaWJlVGFibGVSZXN1bHQgPSBhd2FpdCBkeW5hbW9kYi5kZXNjcmliZVRhYmxlKHtcbiAgICAgIFRhYmxlTmFtZTogdGFibGVOYW1lLFxuICAgIH0pLnByb21pc2UoKTtcbiAgICBjb25zb2xlLmxvZygnRGVzY3JpYmUgdGFibGU6ICVqJywgZGVzY3JpYmVUYWJsZVJlc3VsdCk7XG4gICAgY29uc3QgcmVwbGljYUV4aXN0cyA9IGRlc2NyaWJlVGFibGVSZXN1bHQuVGFibGU/LlJlcGxpY2FzPy5zb21lKHJlcGxpY2EgPT4gcmVwbGljYS5SZWdpb25OYW1lID09PSByZWdpb24pO1xuICAgIHVwZGF0ZVRhYmxlQWN0aW9uID0gcmVwbGljYUV4aXN0cyA/IHVuZGVmaW5lZCA6ICdDcmVhdGUnO1xuICB9XG5cbiAgaWYgKHVwZGF0ZVRhYmxlQWN0aW9uKSB7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IGR5bmFtb2RiLnVwZGF0ZVRhYmxlKHtcbiAgICAgIFRhYmxlTmFtZTogdGFibGVOYW1lLFxuICAgICAgUmVwbGljYVVwZGF0ZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFt1cGRhdGVUYWJsZUFjdGlvbl06IHtcbiAgICAgICAgICAgIFJlZ2lvbk5hbWU6IHJlZ2lvbixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KS5wcm9taXNlKCk7XG4gICAgY29uc29sZS5sb2coJ1VwZGF0ZSB0YWJsZTogJWonLCBkYXRhKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmxvZyhcIlNraXBwaW5nIHVwZGF0aW5nIFRhYmxlLCBhcyBhIHJlcGxpY2EgaW4gJyVzJyBhbHJlYWR5IGV4aXN0c1wiLCByZWdpb24pO1xuICB9XG5cbiAgcmV0dXJuIGV2ZW50LlJlcXVlc3RUeXBlID09PSAnQ3JlYXRlJyB8fCBldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ1VwZGF0ZSdcbiAgICA/IHsgUGh5c2ljYWxSZXNvdXJjZUlkOiBgJHt0YWJsZU5hbWV9LSR7cmVnaW9ufWAgfVxuICAgIDoge307XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpc0NvbXBsZXRlSGFuZGxlcihldmVudDogSXNDb21wbGV0ZVJlcXVlc3QpOiBQcm9taXNlPElzQ29tcGxldGVSZXNwb25zZT4ge1xuICBjb25zb2xlLmxvZygnRXZlbnQ6ICVqJywgZXZlbnQpO1xuXG4gIGNvbnN0IGR5bmFtb2RiID0gbmV3IER5bmFtb0RCKCk7XG5cbiAgY29uc3QgZGF0YSA9IGF3YWl0IGR5bmFtb2RiLmRlc2NyaWJlVGFibGUoe1xuICAgIFRhYmxlTmFtZTogZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlRhYmxlTmFtZSxcbiAgfSkucHJvbWlzZSgpO1xuICBjb25zb2xlLmxvZygnRGVzY3JpYmUgdGFibGU6ICVqJywgZGF0YSk7XG5cbiAgY29uc3QgdGFibGVBY3RpdmUgPSBkYXRhLlRhYmxlPy5UYWJsZVN0YXR1cyA9PT0gJ0FDVElWRSc7XG4gIGNvbnN0IHJlcGxpY2FzID0gZGF0YS5UYWJsZT8uUmVwbGljYXMgPz8gW107XG4gIGNvbnN0IHJlZ2lvblJlcGxpY2EgPSByZXBsaWNhcy5maW5kKHIgPT4gci5SZWdpb25OYW1lID09PSBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuUmVnaW9uKTtcbiAgY29uc3QgcmVwbGljYUFjdGl2ZSA9IHJlZ2lvblJlcGxpY2E/LlJlcGxpY2FTdGF0dXMgPT09ICdBQ1RJVkUnO1xuICBjb25zdCBza2lwUmVwbGljYXRpb25Db21wbGV0ZWRXYWl0ID0gZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlNraXBSZXBsaWNhdGlvbkNvbXBsZXRlZFdhaXQgPT09ICd0cnVlJztcblxuICBzd2l0Y2ggKGV2ZW50LlJlcXVlc3RUeXBlKSB7XG4gICAgY2FzZSAnQ3JlYXRlJzpcbiAgICBjYXNlICdVcGRhdGUnOlxuICAgICAgLy8gQ29tcGxldGUgd2hlbiByZXBsaWNhIGlzIHJlcG9ydGVkIGFzIEFDVElWRVxuICAgICAgcmV0dXJuIHsgSXNDb21wbGV0ZTogdGFibGVBY3RpdmUgJiYgKHJlcGxpY2FBY3RpdmUgfHwgc2tpcFJlcGxpY2F0aW9uQ29tcGxldGVkV2FpdCkgfTtcbiAgICBjYXNlICdEZWxldGUnOlxuICAgICAgLy8gQ29tcGxldGUgd2hlbiByZXBsaWNhIGlzIGdvbmVcbiAgICAgIHJldHVybiB7IElzQ29tcGxldGU6IHRhYmxlQWN0aXZlICYmIHJlZ2lvblJlcGxpY2EgPT09IHVuZGVmaW5lZCB9O1xuICB9XG59XG4iXX0=