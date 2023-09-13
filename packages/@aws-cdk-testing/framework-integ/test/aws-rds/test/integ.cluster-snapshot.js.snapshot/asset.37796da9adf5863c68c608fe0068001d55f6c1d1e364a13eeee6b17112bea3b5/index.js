"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCompleteHandler = exports.onEventHandler = void 0;
/* eslint-disable no-console */
/// <reference path="../../../../../../../node_modules/aws-cdk-lib/custom-resources/lib/provider-framework/types.d.ts" />
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBK0I7QUFDL0IseUhBQXlIO0FBQ3pILG9EQUEwQyxDQUFDLHdEQUF3RDtBQUU1RixLQUFLLFVBQVUsY0FBYyxDQUFDLEtBQStDO0lBQ2xGLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRWhDLE1BQU0sR0FBRyxHQUFHLElBQUksZ0JBQUcsRUFBRSxDQUFDO0lBRXRCLE1BQU0sa0JBQWtCLEdBQUcsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFFN0gsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsRUFBRTtRQUNwRSxNQUFNLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQztZQUM3QyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CO1lBQ2pFLDJCQUEyQixFQUFFLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQywyQkFBMkI7U0FDbEYsQ0FBQyxDQUFDO1FBQ0gsT0FBTztZQUNMLGtCQUFrQixFQUFFLGtCQUFrQjtZQUN0QyxJQUFJLEVBQUU7Z0JBQ0osb0JBQW9CLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFLG9CQUFvQjthQUNuRTtTQUNGLENBQUM7S0FDSDtJQUVELElBQUksS0FBSyxDQUFDLFdBQVcsS0FBSyxRQUFRLEVBQUU7UUFDbEMsTUFBTSxHQUFHLENBQUMsdUJBQXVCLENBQUM7WUFDaEMsMkJBQTJCLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixDQUFDLDJCQUEyQjtTQUNsRixDQUFDLENBQUM7S0FDSjtJQUVELE9BQU87UUFDTCxrQkFBa0IsRUFBRSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLEVBQUU7S0FDdEgsQ0FBQztBQUNKLENBQUM7QUE3QkQsd0NBNkJDO0FBRU0sS0FBSyxVQUFVLGlCQUFpQixDQUFDLEtBQWtEO0lBQ3hGLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRWhDLE1BQU0sY0FBYyxHQUFHLE1BQU0sMkJBQTJCLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFFL0csUUFBUSxLQUFLLENBQUMsV0FBVyxFQUFFO1FBQ3pCLEtBQUssUUFBUSxDQUFDO1FBQ2QsS0FBSyxRQUFRO1lBQ1gsT0FBTyxFQUFFLFVBQVUsRUFBRSxjQUFjLEtBQUssV0FBVyxFQUFFLENBQUM7UUFDeEQsS0FBSyxRQUFRO1lBQ1gsT0FBTyxFQUFFLFVBQVUsRUFBRSxjQUFjLEtBQUssU0FBUyxFQUFFLENBQUM7S0FDdkQ7QUFDSCxDQUFDO0FBWkQsOENBWUM7QUFFRCxLQUFLLFVBQVUsMkJBQTJCLENBQUMsVUFBa0I7SUFDM0QsSUFBSTtRQUNGLE1BQU0sR0FBRyxHQUFHLElBQUksZ0JBQUcsRUFBRSxDQUFDO1FBQ3RCLE1BQU0sSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLDBCQUEwQixDQUFDO1lBQ2hELDJCQUEyQixFQUFFLFVBQVU7U0FDeEMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7S0FDNUM7SUFBQyxPQUFPLEdBQVEsRUFBRTtRQUNqQixJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssZ0NBQWdDLEVBQUU7WUFDakQsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFDRCxNQUFNLEdBQUcsQ0FBQztLQUNYO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi8uLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYXdzLWNkay1saWIvY3VzdG9tLXJlc291cmNlcy9saWIvcHJvdmlkZXItZnJhbWV3b3JrL3R5cGVzLmQudHNcIiAvPlxuaW1wb3J0IHsgUkRTIH0gZnJvbSAnQGF3cy1zZGsvY2xpZW50LXJkcyc7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBvbkV2ZW50SGFuZGxlcihldmVudDogQVdTQ0RLQXN5bmNDdXN0b21SZXNvdXJjZS5PbkV2ZW50UmVxdWVzdCk6IFByb21pc2U8QVdTQ0RLQXN5bmNDdXN0b21SZXNvdXJjZS5PbkV2ZW50UmVzcG9uc2U+IHtcbiAgY29uc29sZS5sb2coJ0V2ZW50OiAlaicsIGV2ZW50KTtcblxuICBjb25zdCByZHMgPSBuZXcgUkRTKCk7XG5cbiAgY29uc3QgcGh5c2ljYWxSZXNvdXJjZUlkID0gYCR7ZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRCQ2x1c3RlcklkZW50aWZpZXJ9LSR7ZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRCQ2x1c3RlcklkZW50aWZpZXJ9YDtcblxuICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdDcmVhdGUnIHx8IGV2ZW50LlJlcXVlc3RUeXBlID09PSAnVXBkYXRlJykge1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZHMuY3JlYXRlREJDbHVzdGVyU25hcHNob3Qoe1xuICAgICAgREJDbHVzdGVySWRlbnRpZmllcjogZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRCQ2x1c3RlcklkZW50aWZpZXIsXG4gICAgICBEQkNsdXN0ZXJTbmFwc2hvdElkZW50aWZpZXI6IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EQkNsdXN0ZXJTbmFwc2hvdElkZW50aWZpZXIsXG4gICAgfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogcGh5c2ljYWxSZXNvdXJjZUlkLFxuICAgICAgRGF0YToge1xuICAgICAgICBEQkNsdXN0ZXJTbmFwc2hvdEFybjogZGF0YS5EQkNsdXN0ZXJTbmFwc2hvdD8uREJDbHVzdGVyU25hcHNob3RBcm4sXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdEZWxldGUnKSB7XG4gICAgYXdhaXQgcmRzLmRlbGV0ZURCQ2x1c3RlclNuYXBzaG90KHtcbiAgICAgIERCQ2x1c3RlclNuYXBzaG90SWRlbnRpZmllcjogZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRCQ2x1c3RlclNuYXBzaG90SWRlbnRpZmllcixcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgUGh5c2ljYWxSZXNvdXJjZUlkOiBgJHtldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuREJDbHVzdGVySWRlbnRpZmllcn0tJHtldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuREJDbHVzdGVySWRlbnRpZmllcn1gLFxuICB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaXNDb21wbGV0ZUhhbmRsZXIoZXZlbnQ6IEFXU0NES0FzeW5jQ3VzdG9tUmVzb3VyY2UuSXNDb21wbGV0ZVJlcXVlc3QpOiBQcm9taXNlPEFXU0NES0FzeW5jQ3VzdG9tUmVzb3VyY2UuSXNDb21wbGV0ZVJlc3BvbnNlPiB7XG4gIGNvbnNvbGUubG9nKCdFdmVudDogJWonLCBldmVudCk7XG5cbiAgY29uc3Qgc25hcHNob3RTdGF0dXMgPSBhd2FpdCB0cnlHZXRDbHVzdGVyU25hcHNob3RTdGF0dXMoZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRCQ2x1c3RlclNuYXBzaG90SWRlbnRpZmllcik7XG5cbiAgc3dpdGNoIChldmVudC5SZXF1ZXN0VHlwZSkge1xuICAgIGNhc2UgJ0NyZWF0ZSc6XG4gICAgY2FzZSAnVXBkYXRlJzpcbiAgICAgIHJldHVybiB7IElzQ29tcGxldGU6IHNuYXBzaG90U3RhdHVzID09PSAnYXZhaWxhYmxlJyB9O1xuICAgIGNhc2UgJ0RlbGV0ZSc6XG4gICAgICByZXR1cm4geyBJc0NvbXBsZXRlOiBzbmFwc2hvdFN0YXR1cyA9PT0gdW5kZWZpbmVkIH07XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gdHJ5R2V0Q2x1c3RlclNuYXBzaG90U3RhdHVzKGlkZW50aWZpZXI6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nIHwgdW5kZWZpbmVkPiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmRzID0gbmV3IFJEUygpO1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZHMuZGVzY3JpYmVEQkNsdXN0ZXJTbmFwc2hvdHMoe1xuICAgICAgREJDbHVzdGVyU25hcHNob3RJZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgIH0pO1xuICAgIHJldHVybiBkYXRhLkRCQ2x1c3RlclNuYXBzaG90cz8uWzBdLlN0YXR1cztcbiAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICBpZiAoZXJyLmNvZGUgPT09ICdEQkNsdXN0ZXJTbmFwc2hvdE5vdEZvdW5kRmF1bHQnKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB0aHJvdyBlcnI7XG4gIH1cbn1cbiJdfQ==