"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCompleteHandler = exports.onEventHandler = void 0;
/* eslint-disable no-console */
/// <reference path="../../../../../../../node_modules/aws-cdk-lib/custom-resources/lib/provider-framework/types.d.ts" />
const aws_sdk_1 = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
async function onEventHandler(event) {
    console.log('Event: %j', event);
    const rds = new aws_sdk_1.RDS();
    const physicalResourceId = `${event.ResourceProperties.DBClusterIdentifier}-${event.ResourceProperties.DBClusterIdentifier}`;
    if (event.RequestType === 'Create' || event.RequestType === 'Update') {
        const data = await rds.createDBClusterSnapshot({
            DBClusterIdentifier: event.ResourceProperties.DBClusterIdentifier,
            DBClusterSnapshotIdentifier: event.ResourceProperties.DBClusterSnapshotIdentifier,
        }).promise();
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
        }).promise();
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
        const rds = new aws_sdk_1.RDS();
        const data = await rds.describeDBClusterSnapshots({
            DBClusterSnapshotIdentifier: identifier,
        }).promise();
        return data.DBClusterSnapshots?.[0].Status;
    }
    catch (err) {
        if (err.code === 'DBClusterSnapshotNotFoundFault') {
            return undefined;
        }
        throw err;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBK0I7QUFDL0IseUhBQXlIO0FBQ3pILHFDQUE4QixDQUFDLHdEQUF3RDtBQUVoRixLQUFLLFVBQVUsY0FBYyxDQUFDLEtBQStDO0lBQ2xGLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRWhDLE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxFQUFFLENBQUM7SUFFdEIsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztJQUU3SCxJQUFJLEtBQUssQ0FBQyxXQUFXLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxXQUFXLEtBQUssUUFBUSxFQUFFO1FBQ3BFLE1BQU0sSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLHVCQUF1QixDQUFDO1lBQzdDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUI7WUFDakUsMkJBQTJCLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixDQUFDLDJCQUEyQjtTQUNsRixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDYixPQUFPO1lBQ0wsa0JBQWtCLEVBQUUsa0JBQWtCO1lBQ3RDLElBQUksRUFBRTtnQkFDSixvQkFBb0IsRUFBRSxJQUFJLENBQUMsaUJBQWlCLEVBQUUsb0JBQW9CO2FBQ25FO1NBQ0YsQ0FBQztLQUNIO0lBRUQsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsRUFBRTtRQUNsQyxNQUFNLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQztZQUNoQywyQkFBMkIsRUFBRSxLQUFLLENBQUMsa0JBQWtCLENBQUMsMkJBQTJCO1NBQ2xGLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNkO0lBRUQsT0FBTztRQUNMLGtCQUFrQixFQUFFLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsRUFBRTtLQUN0SCxDQUFDO0FBQ0osQ0FBQztBQTdCRCx3Q0E2QkM7QUFFTSxLQUFLLFVBQVUsaUJBQWlCLENBQUMsS0FBa0Q7SUFDeEYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFaEMsTUFBTSxjQUFjLEdBQUcsTUFBTSwyQkFBMkIsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsMkJBQTJCLENBQUMsQ0FBQztJQUUvRyxRQUFRLEtBQUssQ0FBQyxXQUFXLEVBQUU7UUFDekIsS0FBSyxRQUFRLENBQUM7UUFDZCxLQUFLLFFBQVE7WUFDWCxPQUFPLEVBQUUsVUFBVSxFQUFFLGNBQWMsS0FBSyxXQUFXLEVBQUUsQ0FBQztRQUN4RCxLQUFLLFFBQVE7WUFDWCxPQUFPLEVBQUUsVUFBVSxFQUFFLGNBQWMsS0FBSyxTQUFTLEVBQUUsQ0FBQztLQUN2RDtBQUNILENBQUM7QUFaRCw4Q0FZQztBQUVELEtBQUssVUFBVSwyQkFBMkIsQ0FBQyxVQUFrQjtJQUMzRCxJQUFJO1FBQ0YsTUFBTSxHQUFHLEdBQUcsSUFBSSxhQUFHLEVBQUUsQ0FBQztRQUN0QixNQUFNLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQztZQUNoRCwyQkFBMkIsRUFBRSxVQUFVO1NBQ3hDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNiLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0tBQzVDO0lBQUMsT0FBTyxHQUFRLEVBQUU7UUFDakIsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLGdDQUFnQyxFQUFFO1lBQ2pELE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBQ0QsTUFBTSxHQUFHLENBQUM7S0FDWDtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2F3cy1jZGstbGliL2N1c3RvbS1yZXNvdXJjZXMvbGliL3Byb3ZpZGVyLWZyYW1ld29yay90eXBlcy5kLnRzXCIgLz5cbmltcG9ydCB7IFJEUyB9IGZyb20gJ2F3cy1zZGsnOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gb25FdmVudEhhbmRsZXIoZXZlbnQ6IEFXU0NES0FzeW5jQ3VzdG9tUmVzb3VyY2UuT25FdmVudFJlcXVlc3QpOiBQcm9taXNlPEFXU0NES0FzeW5jQ3VzdG9tUmVzb3VyY2UuT25FdmVudFJlc3BvbnNlPiB7XG4gIGNvbnNvbGUubG9nKCdFdmVudDogJWonLCBldmVudCk7XG5cbiAgY29uc3QgcmRzID0gbmV3IFJEUygpO1xuXG4gIGNvbnN0IHBoeXNpY2FsUmVzb3VyY2VJZCA9IGAke2V2ZW50LlJlc291cmNlUHJvcGVydGllcy5EQkNsdXN0ZXJJZGVudGlmaWVyfS0ke2V2ZW50LlJlc291cmNlUHJvcGVydGllcy5EQkNsdXN0ZXJJZGVudGlmaWVyfWA7XG5cbiAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnQ3JlYXRlJyB8fCBldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ1VwZGF0ZScpIHtcbiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmRzLmNyZWF0ZURCQ2x1c3RlclNuYXBzaG90KHtcbiAgICAgIERCQ2x1c3RlcklkZW50aWZpZXI6IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EQkNsdXN0ZXJJZGVudGlmaWVyLFxuICAgICAgREJDbHVzdGVyU25hcHNob3RJZGVudGlmaWVyOiBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuREJDbHVzdGVyU25hcHNob3RJZGVudGlmaWVyLFxuICAgIH0pLnByb21pc2UoKTtcbiAgICByZXR1cm4ge1xuICAgICAgUGh5c2ljYWxSZXNvdXJjZUlkOiBwaHlzaWNhbFJlc291cmNlSWQsXG4gICAgICBEYXRhOiB7XG4gICAgICAgIERCQ2x1c3RlclNuYXBzaG90QXJuOiBkYXRhLkRCQ2x1c3RlclNuYXBzaG90Py5EQkNsdXN0ZXJTbmFwc2hvdEFybixcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIGlmIChldmVudC5SZXF1ZXN0VHlwZSA9PT0gJ0RlbGV0ZScpIHtcbiAgICBhd2FpdCByZHMuZGVsZXRlREJDbHVzdGVyU25hcHNob3Qoe1xuICAgICAgREJDbHVzdGVyU25hcHNob3RJZGVudGlmaWVyOiBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuREJDbHVzdGVyU25hcHNob3RJZGVudGlmaWVyLFxuICAgIH0pLnByb21pc2UoKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgUGh5c2ljYWxSZXNvdXJjZUlkOiBgJHtldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuREJDbHVzdGVySWRlbnRpZmllcn0tJHtldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuREJDbHVzdGVySWRlbnRpZmllcn1gLFxuICB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaXNDb21wbGV0ZUhhbmRsZXIoZXZlbnQ6IEFXU0NES0FzeW5jQ3VzdG9tUmVzb3VyY2UuSXNDb21wbGV0ZVJlcXVlc3QpOiBQcm9taXNlPEFXU0NES0FzeW5jQ3VzdG9tUmVzb3VyY2UuSXNDb21wbGV0ZVJlc3BvbnNlPiB7XG4gIGNvbnNvbGUubG9nKCdFdmVudDogJWonLCBldmVudCk7XG5cbiAgY29uc3Qgc25hcHNob3RTdGF0dXMgPSBhd2FpdCB0cnlHZXRDbHVzdGVyU25hcHNob3RTdGF0dXMoZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRCQ2x1c3RlclNuYXBzaG90SWRlbnRpZmllcik7XG5cbiAgc3dpdGNoIChldmVudC5SZXF1ZXN0VHlwZSkge1xuICAgIGNhc2UgJ0NyZWF0ZSc6XG4gICAgY2FzZSAnVXBkYXRlJzpcbiAgICAgIHJldHVybiB7IElzQ29tcGxldGU6IHNuYXBzaG90U3RhdHVzID09PSAnYXZhaWxhYmxlJyB9O1xuICAgIGNhc2UgJ0RlbGV0ZSc6XG4gICAgICByZXR1cm4geyBJc0NvbXBsZXRlOiBzbmFwc2hvdFN0YXR1cyA9PT0gdW5kZWZpbmVkIH07XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gdHJ5R2V0Q2x1c3RlclNuYXBzaG90U3RhdHVzKGlkZW50aWZpZXI6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nIHwgdW5kZWZpbmVkPiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmRzID0gbmV3IFJEUygpO1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZHMuZGVzY3JpYmVEQkNsdXN0ZXJTbmFwc2hvdHMoe1xuICAgICAgREJDbHVzdGVyU25hcHNob3RJZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgIH0pLnByb21pc2UoKTtcbiAgICByZXR1cm4gZGF0YS5EQkNsdXN0ZXJTbmFwc2hvdHM/LlswXS5TdGF0dXM7XG4gIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgaWYgKGVyci5jb2RlID09PSAnREJDbHVzdGVyU25hcHNob3ROb3RGb3VuZEZhdWx0Jykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgdGhyb3cgZXJyO1xuICB9XG59XG4iXX0=