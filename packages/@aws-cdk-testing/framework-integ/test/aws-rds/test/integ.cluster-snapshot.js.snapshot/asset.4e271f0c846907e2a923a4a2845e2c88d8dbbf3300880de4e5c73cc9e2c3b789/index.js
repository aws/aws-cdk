"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCompleteHandler = exports.onEventHandler = void 0;
/* eslint-disable no-console */
/// <reference path="../../../../../../../node_modules/@aws-cdk/custom-resource-handlers/lib/types.d.ts" />
const client_rds_1 = require("@aws-sdk/client-rds"); // eslint-disable-line import/no-extraneous-dependencies
async function onEventHandler(event) {
    console.log('Event: %j', event);
    const rds = new client_rds_1.RDS();
    const physicalResourceId = `${event.ResourceProperties.DBClusterIdentifier}-${event.ResourceProperties.DBClusterIdentifier}`;
    if (event.RequestType === 'Create' || event.RequestType === 'Update') {
        const data = await rds.createDBClusterSnapshot({
            DBClusterIdentifier: event.ResourceProperties.DBClusterIdentifier,
            DBClusterSnapshotIdentifier: event.ResourceProperties.DBClusterSnapshotIdentifier,
        });
        return {
            PhysicalResourceId: physicalResourceId,
            Data: {
                DBClusterSnapshotArn: data.DBClusterSnapshot?.DBClusterSnapshotArn,
            },
        };
    }
    if (event.RequestType === 'Delete') {
        await rds.deleteDBClusterSnapshot({
            DBClusterSnapshotIdentifier: event.ResourceProperties.DBClusterSnapshotIdentifier,
        });
    }
    return {
        PhysicalResourceId: `${event.ResourceProperties.DBClusterIdentifier}-${event.ResourceProperties.DBClusterIdentifier}`,
    };
}
exports.onEventHandler = onEventHandler;
async function isCompleteHandler(event) {
    console.log('Event: %j', event);
    const snapshotStatus = await tryGetClusterSnapshotStatus(event.ResourceProperties.DBClusterSnapshotIdentifier);
    switch (event.RequestType) {
        case 'Create':
        case 'Update':
            return { IsComplete: snapshotStatus === 'available' };
        case 'Delete':
            return { IsComplete: snapshotStatus === undefined };
    }
}
exports.isCompleteHandler = isCompleteHandler;
async function tryGetClusterSnapshotStatus(identifier) {
    try {
        const rds = new client_rds_1.RDS();
        const data = await rds.describeDBClusterSnapshots({
            DBClusterSnapshotIdentifier: identifier,
        });
        return data.DBClusterSnapshots?.[0].Status;
    }
    catch (err) {
        if (err.code === 'DBClusterSnapshotNotFoundFault') {
            return undefined;
        }
        throw err;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBK0I7QUFDL0IsMkdBQTJHO0FBQzNHLG9EQUEwQyxDQUFDLHdEQUF3RDtBQUU1RixLQUFLLFVBQVUsY0FBYyxDQUFDLEtBQStDO0lBQ2xGLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRWhDLE1BQU0sR0FBRyxHQUFHLElBQUksZ0JBQUcsRUFBRSxDQUFDO0lBRXRCLE1BQU0sa0JBQWtCLEdBQUcsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFFN0gsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsRUFBRTtRQUNwRSxNQUFNLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQztZQUM3QyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CO1lBQ2pFLDJCQUEyQixFQUFFLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQywyQkFBMkI7U0FDbEYsQ0FBQyxDQUFDO1FBQ0gsT0FBTztZQUNMLGtCQUFrQixFQUFFLGtCQUFrQjtZQUN0QyxJQUFJLEVBQUU7Z0JBQ0osb0JBQW9CLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLG9CQUFvQjthQUNuRTtTQUNGLENBQUM7S0FDSDtJQUVELElBQUksS0FBSyxDQUFDLFdBQVcsS0FBSyxRQUFRLEVBQUU7UUFDbEMsTUFBTSxHQUFHLENBQUMsdUJBQXVCLENBQUM7WUFDaEMsMkJBQTJCLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixDQUFDLDJCQUEyQjtTQUNsRixDQUFDLENBQUM7S0FDSjtJQUVELE9BQU87UUFDTCxrQkFBa0IsRUFBRSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLEVBQUU7S0FDdEgsQ0FBQztBQUNKLENBQUM7QUE3QkQsd0NBNkJDO0FBRU0sS0FBSyxVQUFVLGlCQUFpQixDQUFDLEtBQWtEO0lBQ3hGLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRWhDLE1BQU0sY0FBYyxHQUFHLE1BQU0sMkJBQTJCLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFFL0csUUFBUSxLQUFLLENBQUMsV0FBVyxFQUFFO1FBQ3pCLEtBQUssUUFBUSxDQUFDO1FBQ2QsS0FBSyxRQUFRO1lBQ1gsT0FBTyxFQUFFLFVBQVUsRUFBRSxjQUFjLEtBQUssV0FBVyxFQUFFLENBQUM7UUFDeEQsS0FBSyxRQUFRO1lBQ1gsT0FBTyxFQUFFLFVBQVUsRUFBRSxjQUFjLEtBQUssU0FBUyxFQUFFLENBQUM7S0FDdkQ7QUFDSCxDQUFDO0FBWkQsOENBWUM7QUFFRCxLQUFLLFVBQVUsMkJBQTJCLENBQUMsVUFBa0I7SUFDM0QsSUFBSTtRQUNGLE1BQU0sR0FBRyxHQUFHLElBQUksZ0JBQUcsRUFBRSxDQUFDO1FBQ3RCLE1BQU0sSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLDBCQUEwQixDQUFDO1lBQ2hELDJCQUEyQixFQUFFLFVBQVU7U0FDeEMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7S0FDNUM7SUFBQyxPQUFPLEdBQVEsRUFBRTtRQUNqQixJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssZ0NBQWdDLEVBQUU7WUFDakQsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFDRCxNQUFNLEdBQUcsQ0FBQztLQUNYO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvQGF3cy1jZGsvY3VzdG9tLXJlc291cmNlLWhhbmRsZXJzL2xpYi90eXBlcy5kLnRzXCIgLz5cbmltcG9ydCB7IFJEUyB9IGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1yZHMnOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gb25FdmVudEhhbmRsZXIoZXZlbnQ6IEFXU0NES0FzeW5jQ3VzdG9tUmVzb3VyY2UuT25FdmVudFJlcXVlc3QpOiBQcm9taXNlPEFXU0NES0FzeW5jQ3VzdG9tUmVzb3VyY2UuT25FdmVudFJlc3BvbnNlPiB7XG4gIGNvbnNvbGUubG9nKCdFdmVudDogJWonLCBldmVudCk7XG5cbiAgY29uc3QgcmRzID0gbmV3IFJEUygpO1xuXG4gIGNvbnN0IHBoeXNpY2FsUmVzb3VyY2VJZCA9IGAke2V2ZW50LlJlc291cmNlUHJvcGVydGllcy5EQkNsdXN0ZXJJZGVudGlmaWVyfS0ke2V2ZW50LlJlc291cmNlUHJvcGVydGllcy5EQkNsdXN0ZXJJZGVudGlmaWVyfWA7XG5cbiAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnQ3JlYXRlJyB8fCBldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ1VwZGF0ZScpIHtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmRzLmNyZWF0ZURCQ2x1c3RlclNuYXBzaG90KHtcbiAgICAgIERCQ2x1c3RlcklkZW50aWZpZXI6IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EQkNsdXN0ZXJJZGVudGlmaWVyLFxuICAgICAgREJDbHVzdGVyU25hcHNob3RJZGVudGlmaWVyOiBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuREJDbHVzdGVyU25hcHNob3RJZGVudGlmaWVyLFxuICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6IHBoeXNpY2FsUmVzb3VyY2VJZCxcbiAgICAgIERhdGE6IHtcbiAgICAgICAgREJDbHVzdGVyU25hcHNob3RBcm46IGRhdGEuREJDbHVzdGVyU25hcHNob3Q/LkRCQ2x1c3RlclNuYXBzaG90QXJuLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnRGVsZXRlJykge1xuICAgIGF3YWl0IHJkcy5kZWxldGVEQkNsdXN0ZXJTbmFwc2hvdCh7XG4gICAgICBEQkNsdXN0ZXJTbmFwc2hvdElkZW50aWZpZXI6IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EQkNsdXN0ZXJTbmFwc2hvdElkZW50aWZpZXIsXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogYCR7ZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRCQ2x1c3RlcklkZW50aWZpZXJ9LSR7ZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRCQ2x1c3RlcklkZW50aWZpZXJ9YCxcbiAgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGlzQ29tcGxldGVIYW5kbGVyKGV2ZW50OiBBV1NDREtBc3luY0N1c3RvbVJlc291cmNlLklzQ29tcGxldGVSZXF1ZXN0KTogUHJvbWlzZTxBV1NDREtBc3luY0N1c3RvbVJlc291cmNlLklzQ29tcGxldGVSZXNwb25zZT4ge1xuICBjb25zb2xlLmxvZygnRXZlbnQ6ICVqJywgZXZlbnQpO1xuXG4gIGNvbnN0IHNuYXBzaG90U3RhdHVzID0gYXdhaXQgdHJ5R2V0Q2x1c3RlclNuYXBzaG90U3RhdHVzKGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EQkNsdXN0ZXJTbmFwc2hvdElkZW50aWZpZXIpO1xuXG4gIHN3aXRjaCAoZXZlbnQuUmVxdWVzdFR5cGUpIHtcbiAgICBjYXNlICdDcmVhdGUnOlxuICAgIGNhc2UgJ1VwZGF0ZSc6XG4gICAgICByZXR1cm4geyBJc0NvbXBsZXRlOiBzbmFwc2hvdFN0YXR1cyA9PT0gJ2F2YWlsYWJsZScgfTtcbiAgICBjYXNlICdEZWxldGUnOlxuICAgICAgcmV0dXJuIHsgSXNDb21wbGV0ZTogc25hcHNob3RTdGF0dXMgPT09IHVuZGVmaW5lZCB9O1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHRyeUdldENsdXN0ZXJTbmFwc2hvdFN0YXR1cyhpZGVudGlmaWVyOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZyB8IHVuZGVmaW5lZD4ge1xuICB0cnkge1xuICAgIGNvbnN0IHJkcyA9IG5ldyBSRFMoKTtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmRzLmRlc2NyaWJlREJDbHVzdGVyU25hcHNob3RzKHtcbiAgICAgIERCQ2x1c3RlclNuYXBzaG90SWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICB9KTtcbiAgICByZXR1cm4gZGF0YS5EQkNsdXN0ZXJTbmFwc2hvdHM/LlswXS5TdGF0dXM7XG4gIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgaWYgKGVyci5jb2RlID09PSAnREJDbHVzdGVyU25hcHNob3ROb3RGb3VuZEZhdWx0Jykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdGhyb3cgZXJyO1xuICB9XG59XG4iXX0=