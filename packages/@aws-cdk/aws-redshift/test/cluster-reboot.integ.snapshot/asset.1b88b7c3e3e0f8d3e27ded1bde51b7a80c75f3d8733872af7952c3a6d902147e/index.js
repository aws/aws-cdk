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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2REFBNkQ7QUFDN0QscUNBQW1DO0FBRW5DLE1BQU0sUUFBUSxHQUFHLElBQUksa0JBQVEsRUFBRSxDQUFDO0FBRXpCLEtBQUssVUFBVSxPQUFPLENBQUMsS0FBa0Q7SUFDOUUsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLFFBQVEsRUFBRTtRQUNsQyxPQUFPLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixFQUFFLGtCQUFrQixDQUFDLENBQUM7S0FDbkg7U0FBTTtRQUNMLE9BQU87S0FDUjtBQUNILENBQUM7QUFORCwwQkFNQztBQUVELEtBQUssVUFBVSx1QkFBdUIsQ0FBQyxTQUFpQixFQUFFLGtCQUEwQjtJQUNsRixPQUFPLHNCQUFzQixDQUFDLE1BQU0sY0FBYyxFQUFFLENBQUMsQ0FBQztJQUV0RCwyRkFBMkY7SUFDM0YsS0FBSyxVQUFVLHNCQUFzQixDQUFDLE1BQWMsRUFBRSxlQUF3QjtRQUM1RSxNQUFNLEtBQUssQ0FBQyxlQUFlLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLGFBQWEsRUFBRSxlQUFlLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDekYsSUFBSTtnQkFDRixNQUFNLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQzFFO1lBQUMsT0FBTyxHQUFRLEVBQUU7Z0JBQ2pCLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxxQkFBcUIsRUFBRTtvQkFDdEMsT0FBTyxNQUFNLHNCQUFzQixDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDcEQ7cUJBQU07b0JBQ0wsTUFBTSxHQUFHLENBQUM7aUJBQ1g7YUFDRjtZQUNELE9BQU87U0FDUjthQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ2pELE9BQU8sc0JBQXNCLENBQUMsTUFBTSxjQUFjLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM5RDtRQUNELE9BQU87SUFDVCxDQUFDO0lBRUQsS0FBSyxVQUFVLGNBQWM7UUFDM0IsTUFBTSxjQUFjLEdBQUcsTUFBTSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ25HLElBQUksY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixLQUFLLFNBQVMsRUFBRTtZQUNyRSxNQUFNLElBQUksS0FBSyxDQUFDLGtFQUFrRSxTQUFTLElBQUksQ0FBQyxDQUFDO1NBQ2xHO1FBQ0QsS0FBSyxNQUFNLEtBQUssSUFBSSxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLEVBQUU7WUFDdkUsSUFBSSxLQUFLLENBQUMsa0JBQWtCLEtBQUssa0JBQWtCLEVBQUU7Z0JBQ25ELE9BQU8sS0FBSyxDQUFDLG9CQUFvQixJQUFJLE9BQU8sQ0FBQzthQUM5QztTQUNGO1FBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyx5Q0FBeUMsa0JBQWtCLGdDQUFnQyxTQUFTLElBQUksQ0FBQyxDQUFDO0lBQzVILENBQUM7QUFDSCxDQUFDO0FBRUQsU0FBUyxLQUFLLENBQUMsRUFBVTtJQUN2QixPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5pbXBvcnQgeyBSZWRzaGlmdCB9IGZyb20gJ2F3cy1zZGsnO1xuXG5jb25zdCByZWRzaGlmdCA9IG5ldyBSZWRzaGlmdCgpO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCk6IFByb21pc2U8dm9pZD4ge1xuICBpZiAoZXZlbnQuUmVxdWVzdFR5cGUgIT09ICdEZWxldGUnKSB7XG4gICAgcmV0dXJuIHJlYm9vdENsdXN0ZXJJZlJlcXVpcmVkKGV2ZW50LlJlc291cmNlUHJvcGVydGllcz8uQ2x1c3RlcklkLCBldmVudC5SZXNvdXJjZVByb3BlcnRpZXM/LlBhcmFtZXRlckdyb3VwTmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJlYm9vdENsdXN0ZXJJZlJlcXVpcmVkKGNsdXN0ZXJJZDogc3RyaW5nLCBwYXJhbWV0ZXJHcm91cE5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICByZXR1cm4gZXhlY3V0ZUFjdGlvbkZvclN0YXR1cyhhd2FpdCBnZXRBcHBseVN0YXR1cygpKTtcblxuICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vcmVkc2hpZnQvbGF0ZXN0L0FQSVJlZmVyZW5jZS9BUElfQ2x1c3RlclBhcmFtZXRlclN0YXR1cy5odG1sXG4gIGFzeW5jIGZ1bmN0aW9uIGV4ZWN1dGVBY3Rpb25Gb3JTdGF0dXMoc3RhdHVzOiBzdHJpbmcsIHJldHJ5RHVyYXRpb25Ncz86IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHNsZWVwKHJldHJ5RHVyYXRpb25NcyA/PyAwKTtcbiAgICBpZiAoWydwZW5kaW5nLXJlYm9vdCcsICdhcHBseS1kZWZlcnJlZCcsICdhcHBseS1lcnJvcicsICd1bmtub3duLWVycm9yJ10uaW5jbHVkZXMoc3RhdHVzKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgcmVkc2hpZnQucmVib290Q2x1c3Rlcih7IENsdXN0ZXJJZGVudGlmaWVyOiBjbHVzdGVySWQgfSkucHJvbWlzZSgpO1xuICAgICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgaWYgKGVyci5jb2RlID09PSAnSW52YWxpZENsdXN0ZXJTdGF0ZScpIHtcbiAgICAgICAgICByZXR1cm4gYXdhaXQgZXhlY3V0ZUFjdGlvbkZvclN0YXR1cyhzdGF0dXMsIDMwMDAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKFsnYXBwbHlpbmcnLCAncmV0cnknXS5pbmNsdWRlcyhzdGF0dXMpKSB7XG4gICAgICByZXR1cm4gZXhlY3V0ZUFjdGlvbkZvclN0YXR1cyhhd2FpdCBnZXRBcHBseVN0YXR1cygpLCAzMDAwMCk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGdldEFwcGx5U3RhdHVzKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgY29uc3QgY2x1c3RlckRldGFpbHMgPSBhd2FpdCByZWRzaGlmdC5kZXNjcmliZUNsdXN0ZXJzKHsgQ2x1c3RlcklkZW50aWZpZXI6IGNsdXN0ZXJJZCB9KS5wcm9taXNlKCk7XG4gICAgaWYgKGNsdXN0ZXJEZXRhaWxzLkNsdXN0ZXJzPy5bMF0uQ2x1c3RlclBhcmFtZXRlckdyb3VwcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBmaW5kIGFueSBQYXJhbWV0ZXIgR3JvdXBzIGFzc29jaWF0ZWQgd2l0aCBDbHVzdGVySWQgXCIke2NsdXN0ZXJJZH1cIi5gKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBncm91cCBvZiBjbHVzdGVyRGV0YWlscy5DbHVzdGVycz8uWzBdLkNsdXN0ZXJQYXJhbWV0ZXJHcm91cHMpIHtcbiAgICAgIGlmIChncm91cC5QYXJhbWV0ZXJHcm91cE5hbWUgPT09IHBhcmFtZXRlckdyb3VwTmFtZSkge1xuICAgICAgICByZXR1cm4gZ3JvdXAuUGFyYW1ldGVyQXBwbHlTdGF0dXMgPz8gJ3JldHJ5JztcbiAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gZmluZCBQYXJhbWV0ZXIgR3JvdXAgbmFtZWQgXCIke3BhcmFtZXRlckdyb3VwTmFtZX1cIiBhc3NvY2lhdGVkIHdpdGggQ2x1c3RlcklkIFwiJHtjbHVzdGVySWR9XCIuYCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2xlZXAobXM6IG51bWJlcikge1xuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XG59XG4iXX0=