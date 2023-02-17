"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// eslint-disable-next-line import/no-extraneous-dependencies
const aws_sdk_1 = require("aws-sdk");
const redshift = new aws_sdk_1.Redshift();
async function handler(event) {
    if (event.RequestType !== 'Delete') {
        return rebootClusterIfRequired(event.ResourceProperties?.ClusterId, event.ResourceProperties?.ParameterGroupName);
    }
    else {
        return;
    }
}
exports.handler = handler;
async function rebootClusterIfRequired(clusterId, parameterGroupName) {
    return executeActionForStatus(await getApplyStatus());
    // https://docs.aws.amazon.com/redshift/latest/APIReference/API_ClusterParameterStatus.html
    async function executeActionForStatus(status, retryDurationMs) {
        await sleep(retryDurationMs ?? 0);
        if (['pending-reboot', 'apply-deferred', 'apply-error', 'unknown-error'].includes(status)) {
            try {
                await redshift.rebootCluster({ ClusterIdentifier: clusterId }).promise();
            }
            catch (err) {
                if (err.code === 'InvalidClusterState') {
                    return await executeActionForStatus(status, 30000);
                }
                else {
                    throw err;
                }
            }
            return;
        }
        else if (['applying', 'retry'].includes(status)) {
            return executeActionForStatus(await getApplyStatus(), 30000);
        }
        return;
    }
    async function getApplyStatus() {
        const clusterDetails = await redshift.describeClusters({ ClusterIdentifier: clusterId }).promise();
        if (clusterDetails.Clusters?.[0].ClusterParameterGroups === undefined) {
            throw new Error(`Unable to find any Parameter Groups associated with ClusterId "${clusterId}".`);
        }
        for (const group of clusterDetails.Clusters?.[0].ClusterParameterGroups) {
            if (group.ParameterGroupName === parameterGroupName) {
                return group.ParameterApplyStatus ?? 'retry';
            }
        }
        throw new Error(`Unable to find Parameter Group named "${parameterGroupName}" associated with ClusterId "${clusterId}".`);
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2REFBNkQ7QUFDN0QscUNBQW1DO0FBRW5DLE1BQU0sUUFBUSxHQUFHLElBQUksa0JBQVEsRUFBRSxDQUFDO0FBRXpCLEtBQUssVUFBVSxPQUFPLENBQUMsS0FBa0Q7SUFDOUUsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsRUFBRTtRQUNsQyxPQUFPLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixFQUFFLGtCQUFrQixDQUFDLENBQUM7S0FDbkg7U0FBTTtRQUNMLE9BQU87S0FDUjtBQUNILENBQUM7QUFORCwwQkFNQztBQUVELEtBQUssVUFBVSx1QkFBdUIsQ0FBQyxTQUFpQixFQUFFLGtCQUEwQjtJQUNsRixPQUFPLHNCQUFzQixDQUFDLE1BQU0sY0FBYyxFQUFFLENBQUMsQ0FBQztJQUV0RCwyRkFBMkY7SUFDM0YsS0FBSyxVQUFVLHNCQUFzQixDQUFDLE1BQWMsRUFBRSxlQUF3QjtRQUM1RSxNQUFNLEtBQUssQ0FBQyxlQUFlLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGFBQWEsRUFBRSxlQUFlLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDekYsSUFBSTtnQkFDRixNQUFNLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQzFFO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1osSUFBVSxHQUFJLENBQUMsSUFBSSxLQUFLLHFCQUFxQixFQUFFO29CQUM3QyxPQUFPLE1BQU0sc0JBQXNCLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUNwRDtxQkFBTTtvQkFDTCxNQUFNLEdBQUcsQ0FBQztpQkFDWDthQUNGO1lBQ0QsT0FBTztTQUNSO2FBQU0sSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDakQsT0FBTyxzQkFBc0IsQ0FBQyxNQUFNLGNBQWMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzlEO1FBQ0QsT0FBTztJQUNULENBQUM7SUFFRCxLQUFLLFVBQVUsY0FBYztRQUMzQixNQUFNLGNBQWMsR0FBRyxNQUFNLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbkcsSUFBSSxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLEtBQUssU0FBUyxFQUFFO1lBQ3JFLE1BQU0sSUFBSSxLQUFLLENBQUMsa0VBQWtFLFNBQVMsSUFBSSxDQUFDLENBQUM7U0FDbEc7UUFDRCxLQUFLLE1BQU0sS0FBSyxJQUFJLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxzQkFBc0IsRUFBRTtZQUN2RSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsS0FBSyxrQkFBa0IsRUFBRTtnQkFDbkQsT0FBTyxLQUFLLENBQUMsb0JBQW9CLElBQUksT0FBTyxDQUFDO2FBQzlDO1NBQ0Y7UUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxrQkFBa0IsZ0NBQWdDLFNBQVMsSUFBSSxDQUFDLENBQUM7SUFDNUgsQ0FBQztBQUNILENBQUM7QUFFRCxTQUFTLEtBQUssQ0FBQyxFQUFVO0lBQ3ZCLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IFJlZHNoaWZ0IH0gZnJvbSAnYXdzLXNkayc7XG5cbmNvbnN0IHJlZHNoaWZ0ID0gbmV3IFJlZHNoaWZ0KCk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50KTogUHJvbWlzZTx2b2lkPiB7XG4gIGlmIChldmVudC5SZXF1ZXN0VHlwZSAhPT0gJ0RlbGV0ZScpIHtcbiAgICByZXR1cm4gcmVib290Q2x1c3RlcklmUmVxdWlyZWQoZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzPy5DbHVzdGVySWQsIGV2ZW50LlJlc291cmNlUHJvcGVydGllcz8uUGFyYW1ldGVyR3JvdXBOYW1lKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm47XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gcmVib290Q2x1c3RlcklmUmVxdWlyZWQoY2x1c3RlcklkOiBzdHJpbmcsIHBhcmFtZXRlckdyb3VwTmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIHJldHVybiBleGVjdXRlQWN0aW9uRm9yU3RhdHVzKGF3YWl0IGdldEFwcGx5U3RhdHVzKCkpO1xuXG4gIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9yZWRzaGlmdC9sYXRlc3QvQVBJUmVmZXJlbmNlL0FQSV9DbHVzdGVyUGFyYW1ldGVyU3RhdHVzLmh0bWxcbiAgYXN5bmMgZnVuY3Rpb24gZXhlY3V0ZUFjdGlvbkZvclN0YXR1cyhzdGF0dXM6IHN0cmluZywgcmV0cnlEdXJhdGlvbk1zPzogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgc2xlZXAocmV0cnlEdXJhdGlvbk1zID8/IDApO1xuICAgIGlmIChbJ3BlbmRpbmctcmVib290JywgJ2FwcGx5LWRlZmVycmVkJywgJ2FwcGx5LWVycm9yJywgJ3Vua25vd24tZXJyb3InXS5pbmNsdWRlcyhzdGF0dXMpKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCByZWRzaGlmdC5yZWJvb3RDbHVzdGVyKHsgQ2x1c3RlcklkZW50aWZpZXI6IGNsdXN0ZXJJZCB9KS5wcm9taXNlKCk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgaWYgKCg8YW55PmVycikuY29kZSA9PT0gJ0ludmFsaWRDbHVzdGVyU3RhdGUnKSB7XG4gICAgICAgICAgcmV0dXJuIGF3YWl0IGV4ZWN1dGVBY3Rpb25Gb3JTdGF0dXMoc3RhdHVzLCAzMDAwMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gICAgfSBlbHNlIGlmIChbJ2FwcGx5aW5nJywgJ3JldHJ5J10uaW5jbHVkZXMoc3RhdHVzKSkge1xuICAgICAgcmV0dXJuIGV4ZWN1dGVBY3Rpb25Gb3JTdGF0dXMoYXdhaXQgZ2V0QXBwbHlTdGF0dXMoKSwgMzAwMDApO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBnZXRBcHBseVN0YXR1cygpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IGNsdXN0ZXJEZXRhaWxzID0gYXdhaXQgcmVkc2hpZnQuZGVzY3JpYmVDbHVzdGVycyh7IENsdXN0ZXJJZGVudGlmaWVyOiBjbHVzdGVySWQgfSkucHJvbWlzZSgpO1xuICAgIGlmIChjbHVzdGVyRGV0YWlscy5DbHVzdGVycz8uWzBdLkNsdXN0ZXJQYXJhbWV0ZXJHcm91cHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gZmluZCBhbnkgUGFyYW1ldGVyIEdyb3VwcyBhc3NvY2lhdGVkIHdpdGggQ2x1c3RlcklkIFwiJHtjbHVzdGVySWR9XCIuYCk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgZ3JvdXAgb2YgY2x1c3RlckRldGFpbHMuQ2x1c3RlcnM/LlswXS5DbHVzdGVyUGFyYW1ldGVyR3JvdXBzKSB7XG4gICAgICBpZiAoZ3JvdXAuUGFyYW1ldGVyR3JvdXBOYW1lID09PSBwYXJhbWV0ZXJHcm91cE5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGdyb3VwLlBhcmFtZXRlckFwcGx5U3RhdHVzID8/ICdyZXRyeSc7XG4gICAgICB9XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGZpbmQgUGFyYW1ldGVyIEdyb3VwIG5hbWVkIFwiJHtwYXJhbWV0ZXJHcm91cE5hbWV9XCIgYXNzb2NpYXRlZCB3aXRoIENsdXN0ZXJJZCBcIiR7Y2x1c3RlcklkfVwiLmApO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNsZWVwKG1zOiBudW1iZXIpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufSJdfQ==