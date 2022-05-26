"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCompleteHandler = exports.onEventHandler = void 0;
const aws_sdk_1 = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
async function onEventHandler(event) {
    var _a;
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
                DBClusterSnapshotArn: (_a = data.DBClusterSnapshot) === null || _a === void 0 ? void 0 : _a.DBClusterSnapshotArn,
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
    var _a, _b;
    console.log('Event: %j', event);
    const rds = new aws_sdk_1.RDS();
    const data = await rds.describeDBClusterSnapshots({
        DBClusterSnapshotIdentifier: event.ResourceProperties.DBClusterSnapshotIdentifier,
    }).promise();
    switch (event.RequestType) {
        case 'Create':
        case 'Update':
            return { IsComplete: ((_a = data.DBClusterSnapshots) === null || _a === void 0 ? void 0 : _a[0].Status) === 'available' };
        case 'Delete':
            return { IsComplete: ((_b = data.DBClusterSnapshots) === null || _b === void 0 ? void 0 : _b.length) === 0 };
    }
}
exports.isCompleteHandler = isCompleteHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxxQ0FBOEIsQ0FBQyx3REFBd0Q7QUFFaEYsS0FBSyxVQUFVLGNBQWMsQ0FBQyxLQUFxQjs7SUFDeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFaEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxhQUFHLEVBQUUsQ0FBQztJQUV0QixNQUFNLGtCQUFrQixHQUFHLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0lBRTdILElBQUksS0FBSyxDQUFDLFdBQVcsS0FBSyxRQUFRLElBQUksS0FBSyxDQUFDLFdBQVcsS0FBSyxRQUFRLEVBQUU7UUFDcEUsTUFBTSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsdUJBQXVCLENBQUM7WUFDN0MsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQjtZQUNqRSwyQkFBMkIsRUFBRSxLQUFLLENBQUMsa0JBQWtCLENBQUMsMkJBQTJCO1NBQ2xGLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNiLE9BQU87WUFDTCxrQkFBa0IsRUFBRSxrQkFBa0I7WUFDdEMsSUFBSSxFQUFFO2dCQUNKLG9CQUFvQixRQUFFLElBQUksQ0FBQyxpQkFBaUIsMENBQUUsb0JBQW9CO2FBQ25FO1NBQ0YsQ0FBQztLQUNIO0lBRUQsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsRUFBRTtRQUNsQyxNQUFNLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQztZQUNoQywyQkFBMkIsRUFBRSxLQUFLLENBQUMsa0JBQWtCLENBQUMsMkJBQTJCO1NBQ2xGLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNkO0lBRUQsT0FBTztRQUNMLGtCQUFrQixFQUFFLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLG1CQUFtQixJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxtQkFBbUIsRUFBRTtLQUN0SCxDQUFDO0FBQ0osQ0FBQztBQTdCRCx3Q0E2QkM7QUFFTSxLQUFLLFVBQVUsaUJBQWlCLENBQUMsS0FBd0I7O0lBQzlELE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRWhDLE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxFQUFFLENBQUM7SUFFdEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsMEJBQTBCLENBQUM7UUFDaEQsMkJBQTJCLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixDQUFDLDJCQUEyQjtLQUNsRixDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFFYixRQUFRLEtBQUssQ0FBQyxXQUFXLEVBQUU7UUFDekIsS0FBSyxRQUFRLENBQUM7UUFDZCxLQUFLLFFBQVE7WUFDWCxPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQUEsSUFBSSxDQUFDLGtCQUFrQiwwQ0FBRyxDQUFDLEVBQUUsTUFBTSxNQUFLLFdBQVcsRUFBRSxDQUFDO1FBQzdFLEtBQUssUUFBUTtZQUNYLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBQSxJQUFJLENBQUMsa0JBQWtCLDBDQUFFLE1BQU0sTUFBSyxDQUFDLEVBQUUsQ0FBQztLQUNoRTtBQUNILENBQUM7QUFoQkQsOENBZ0JDIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuaW1wb3J0IHR5cGUgeyBJc0NvbXBsZXRlUmVxdWVzdCwgSXNDb21wbGV0ZVJlc3BvbnNlLCBPbkV2ZW50UmVxdWVzdCwgT25FdmVudFJlc3BvbnNlIH0gZnJvbSAnQGF3cy1jZGsvY3VzdG9tLXJlc291cmNlcy9saWIvcHJvdmlkZXItZnJhbWV3b3JrL3R5cGVzJztcbmltcG9ydCB7IFJEUyB9IGZyb20gJ2F3cy1zZGsnOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gb25FdmVudEhhbmRsZXIoZXZlbnQ6IE9uRXZlbnRSZXF1ZXN0KTogUHJvbWlzZTxPbkV2ZW50UmVzcG9uc2U+IHtcbiAgY29uc29sZS5sb2coJ0V2ZW50OiAlaicsIGV2ZW50KTtcblxuICBjb25zdCByZHMgPSBuZXcgUkRTKCk7XG5cbiAgY29uc3QgcGh5c2ljYWxSZXNvdXJjZUlkID0gYCR7ZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRCQ2x1c3RlcklkZW50aWZpZXJ9LSR7ZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRCQ2x1c3RlcklkZW50aWZpZXJ9YDtcblxuICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgPT09ICdDcmVhdGUnIHx8IGV2ZW50LlJlcXVlc3RUeXBlID09PSAnVXBkYXRlJykge1xuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZHMuY3JlYXRlREJDbHVzdGVyU25hcHNob3Qoe1xuICAgICAgREJDbHVzdGVySWRlbnRpZmllcjogZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkRCQ2x1c3RlcklkZW50aWZpZXIsXG4gICAgICBEQkNsdXN0ZXJTbmFwc2hvdElkZW50aWZpZXI6IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EQkNsdXN0ZXJTbmFwc2hvdElkZW50aWZpZXIsXG4gICAgfSkucHJvbWlzZSgpO1xuICAgIHJldHVybiB7XG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6IHBoeXNpY2FsUmVzb3VyY2VJZCxcbiAgICAgIERhdGE6IHtcbiAgICAgICAgREJDbHVzdGVyU25hcHNob3RBcm46IGRhdGEuREJDbHVzdGVyU25hcHNob3Q/LkRCQ2x1c3RlclNuYXBzaG90QXJuLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGV2ZW50LlJlcXVlc3RUeXBlID09PSAnRGVsZXRlJykge1xuICAgIGF3YWl0IHJkcy5kZWxldGVEQkNsdXN0ZXJTbmFwc2hvdCh7XG4gICAgICBEQkNsdXN0ZXJTbmFwc2hvdElkZW50aWZpZXI6IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EQkNsdXN0ZXJTbmFwc2hvdElkZW50aWZpZXIsXG4gICAgfSkucHJvbWlzZSgpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBQaHlzaWNhbFJlc291cmNlSWQ6IGAke2V2ZW50LlJlc291cmNlUHJvcGVydGllcy5EQkNsdXN0ZXJJZGVudGlmaWVyfS0ke2V2ZW50LlJlc291cmNlUHJvcGVydGllcy5EQkNsdXN0ZXJJZGVudGlmaWVyfWAsXG4gIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpc0NvbXBsZXRlSGFuZGxlcihldmVudDogSXNDb21wbGV0ZVJlcXVlc3QpOiBQcm9taXNlPElzQ29tcGxldGVSZXNwb25zZT4ge1xuICBjb25zb2xlLmxvZygnRXZlbnQ6ICVqJywgZXZlbnQpO1xuXG4gIGNvbnN0IHJkcyA9IG5ldyBSRFMoKTtcblxuICBjb25zdCBkYXRhID0gYXdhaXQgcmRzLmRlc2NyaWJlREJDbHVzdGVyU25hcHNob3RzKHtcbiAgICBEQkNsdXN0ZXJTbmFwc2hvdElkZW50aWZpZXI6IGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5EQkNsdXN0ZXJTbmFwc2hvdElkZW50aWZpZXIsXG4gIH0pLnByb21pc2UoKTtcblxuICBzd2l0Y2ggKGV2ZW50LlJlcXVlc3RUeXBlKSB7XG4gICAgY2FzZSAnQ3JlYXRlJzpcbiAgICBjYXNlICdVcGRhdGUnOlxuICAgICAgcmV0dXJuIHsgSXNDb21wbGV0ZTogZGF0YS5EQkNsdXN0ZXJTbmFwc2hvdHM/LlswXS5TdGF0dXMgPT09ICdhdmFpbGFibGUnIH07XG4gICAgY2FzZSAnRGVsZXRlJzpcbiAgICAgIHJldHVybiB7IElzQ29tcGxldGU6IGRhdGEuREJDbHVzdGVyU25hcHNob3RzPy5sZW5ndGggPT09IDAgfTtcbiAgfVxufVxuIl19