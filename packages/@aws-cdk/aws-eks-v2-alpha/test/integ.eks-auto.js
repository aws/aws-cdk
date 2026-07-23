"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EksAutoModeNodePoolsStack = exports.EksAutoModeBaseStack = void 0;
const integ = require("@aws-cdk/integ-tests-alpha");
const lambda_layer_kubectl_v33_1 = require("@aws-cdk/lambda-layer-kubectl-v33");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
const constructs_1 = require("constructs");
const eks = require("../lib");
class EksMinimalCluster extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const clusterProps = {
            vpc: props.vpc,
            mastersRole: props.mastersRole,
            version: eks.KubernetesVersion.V1_33,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(this, 'kubectl'),
            },
            defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
        };
        // Add compute configuration if provided
        if (props.compute) {
            clusterProps.compute = props.compute;
        }
        new eks.Cluster(this, 'cluster', clusterProps);
    }
}
/**
 * This stack is used to test the EKS cluster with auto mode enabled.
 */
class EksAutoModeBaseStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1 });
        const mastersRole = new iam.Role(this, 'Role', {
            assumedBy: new iam.AccountRootPrincipal(),
        });
        new EksMinimalCluster(this, 'hello-eks', {
            vpc,
            mastersRole,
        });
    }
}
exports.EksAutoModeBaseStack = EksAutoModeBaseStack;
/**
 * This stack is used to test the EKS cluster with auto mode enabled with empty node pools.
 */
class EksAutoModeNodePoolsStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1 });
        const mastersRole = new iam.Role(this, 'Role', {
            assumedBy: new iam.AccountRootPrincipal(),
        });
        new EksMinimalCluster(this, 'hello-eks', {
            vpc,
            mastersRole,
            compute: {
                nodePools: [],
            },
        });
    }
}
exports.EksAutoModeNodePoolsStack = EksAutoModeNodePoolsStack;
const app = new aws_cdk_lib_1.App({
    postCliContext: {
        '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
        '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    },
});
const stack1 = new EksAutoModeBaseStack(app, 'eks-auto-mode-stack', { env: { region: 'us-east-1' } });
const stack2 = new EksAutoModeNodePoolsStack(app, 'eks-auto-mode-empty-nodepools-stack', { env: { region: 'us-east-1' } });
new integ.IntegTest(app, 'aws-cdk-eks-cluster-integ', {
    testCases: [stack1, stack2],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLWF1dG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5la3MtYXV0by50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxvREFBb0Q7QUFDcEQsZ0ZBQW9FO0FBQ3BFLDZDQUFxRDtBQUNyRCwyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDLDJDQUF1QztBQUN2Qyw4QkFBOEI7QUFVOUIsTUFBTSxpQkFBa0IsU0FBUSxzQkFBUztJQUN2QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTZCO1FBQ3JFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxZQUFZLEdBQVE7WUFDeEIsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLE9BQU8sRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSztZQUNwQyxzQkFBc0IsRUFBRTtnQkFDdEIsWUFBWSxFQUFFLElBQUksMENBQWUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDO2FBQ25EO1lBQ0QsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLG1CQUFtQixDQUFDLFFBQVE7U0FDdEQsQ0FBQztRQUVGLHdDQUF3QztRQUN4QyxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNsQixZQUFZLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDdkMsQ0FBQztRQUVELElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO0tBQ2hEO0NBQ0Y7QUFFRDs7R0FFRztBQUNILE1BQWEsb0JBQXFCLFNBQVEsbUJBQUs7SUFDN0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFpQjtRQUN6RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQzdDLFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRTtTQUMxQyxDQUFDLENBQUM7UUFFSCxJQUFJLGlCQUFpQixDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDdkMsR0FBRztZQUNILFdBQVc7U0FDWixDQUFDLENBQUM7S0FDSjtDQUNGO0FBZEQsb0RBY0M7QUFFRDs7R0FFRztBQUNILE1BQWEseUJBQTBCLFNBQVEsbUJBQUs7SUFDbEQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFpQjtRQUN6RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQzdDLFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRTtTQUMxQyxDQUFDLENBQUM7UUFFSCxJQUFJLGlCQUFpQixDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDdkMsR0FBRztZQUNILFdBQVc7WUFDWCxPQUFPLEVBQUU7Z0JBQ1AsU0FBUyxFQUFFLEVBQUU7YUFDZDtTQUNGLENBQUMsQ0FBQztLQUNKO0NBQ0Y7QUFqQkQsOERBaUJDO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxDQUFDO0lBQ2xCLGNBQWMsRUFBRTtRQUNkLDBEQUEwRCxFQUFFLElBQUk7UUFDaEUsMkNBQTJDLEVBQUUsS0FBSztLQUNuRDtDQUNGLENBQUMsQ0FBQztBQUVILE1BQU0sTUFBTSxHQUFHLElBQUksb0JBQW9CLENBQUMsR0FBRyxFQUFFLHFCQUFxQixFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN0RyxNQUFNLE1BQU0sR0FBRyxJQUFJLHlCQUF5QixDQUFDLEdBQUcsRUFBRSxxQ0FBcUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFFM0gsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSwyQkFBMkIsRUFBRTtJQUNwRCxTQUFTLEVBQUUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO0NBQzVCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IEt1YmVjdGxWMzNMYXllciB9IGZyb20gJ0Bhd3MtY2RrL2xhbWJkYS1sYXllci1rdWJlY3RsLXYzMyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBla3MgZnJvbSAnLi4vbGliJztcblxuaW50ZXJmYWNlIEVrc01pbmltYWxDbHVzdGVyUHJvcHMge1xuICByZWFkb25seSB2cGM6IGVjMi5WcGM7XG4gIHJlYWRvbmx5IG1hc3RlcnNSb2xlOiBpYW0uUm9sZTtcbiAgcmVhZG9ubHkgY29tcHV0ZT86IHtcbiAgICBub2RlUG9vbHM6IGFueVtdO1xuICB9O1xufVxuXG5jbGFzcyBFa3NNaW5pbWFsQ2x1c3RlciBleHRlbmRzIENvbnN0cnVjdCB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBFa3NNaW5pbWFsQ2x1c3RlclByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IGNsdXN0ZXJQcm9wczogYW55ID0ge1xuICAgICAgdnBjOiBwcm9wcy52cGMsXG4gICAgICBtYXN0ZXJzUm9sZTogcHJvcHMubWFzdGVyc1JvbGUsXG4gICAgICB2ZXJzaW9uOiBla3MuS3ViZXJuZXRlc1ZlcnNpb24uVjFfMzMsXG4gICAgICBrdWJlY3RsUHJvdmlkZXJPcHRpb25zOiB7XG4gICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzNMYXllcih0aGlzLCAna3ViZWN0bCcpLFxuICAgICAgfSxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eVR5cGU6IGVrcy5EZWZhdWx0Q2FwYWNpdHlUeXBlLkFVVE9NT0RFLFxuICAgIH07XG5cbiAgICAvLyBBZGQgY29tcHV0ZSBjb25maWd1cmF0aW9uIGlmIHByb3ZpZGVkXG4gICAgaWYgKHByb3BzLmNvbXB1dGUpIHtcbiAgICAgIGNsdXN0ZXJQcm9wcy5jb21wdXRlID0gcHJvcHMuY29tcHV0ZTtcbiAgICB9XG5cbiAgICBuZXcgZWtzLkNsdXN0ZXIodGhpcywgJ2NsdXN0ZXInLCBjbHVzdGVyUHJvcHMpO1xuICB9XG59XG5cbi8qKlxuICogVGhpcyBzdGFjayBpcyB1c2VkIHRvIHRlc3QgdGhlIEVLUyBjbHVzdGVyIHdpdGggYXV0byBtb2RlIGVuYWJsZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBFa3NBdXRvTW9kZUJhc2VTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWcGMnLCB7IG5hdEdhdGV3YXlzOiAxIH0pO1xuICAgIGNvbnN0IG1hc3RlcnNSb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkFjY291bnRSb290UHJpbmNpcGFsKCksXG4gICAgfSk7XG5cbiAgICBuZXcgRWtzTWluaW1hbENsdXN0ZXIodGhpcywgJ2hlbGxvLWVrcycsIHtcbiAgICAgIHZwYyxcbiAgICAgIG1hc3RlcnNSb2xlLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogVGhpcyBzdGFjayBpcyB1c2VkIHRvIHRlc3QgdGhlIEVLUyBjbHVzdGVyIHdpdGggYXV0byBtb2RlIGVuYWJsZWQgd2l0aCBlbXB0eSBub2RlIHBvb2xzLlxuICovXG5leHBvcnQgY2xhc3MgRWtzQXV0b01vZGVOb2RlUG9vbHNTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWcGMnLCB7IG5hdEdhdGV3YXlzOiAxIH0pO1xuICAgIGNvbnN0IG1hc3RlcnNSb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkFjY291bnRSb290UHJpbmNpcGFsKCksXG4gICAgfSk7XG5cbiAgICBuZXcgRWtzTWluaW1hbENsdXN0ZXIodGhpcywgJ2hlbGxvLWVrcycsIHtcbiAgICAgIHZwYyxcbiAgICAgIG1hc3RlcnNSb2xlLFxuICAgICAgY29tcHV0ZToge1xuICAgICAgICBub2RlUG9vbHM6IFtdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgcG9zdENsaUNvbnRleHQ6IHtcbiAgICAnQGF3cy1jZGsvYXdzLWxhbWJkYTpjcmVhdGVOZXdQb2xpY2llc1dpdGhBZGRUb1JvbGVQb2xpY3knOiB0cnVlLFxuICAgICdAYXdzLWNkay9hd3MtbGFtYmRhOnVzZUNka01hbmFnZWRMb2dHcm91cCc6IGZhbHNlLFxuICB9LFxufSk7XG5cbmNvbnN0IHN0YWNrMSA9IG5ldyBFa3NBdXRvTW9kZUJhc2VTdGFjayhhcHAsICdla3MtYXV0by1tb2RlLXN0YWNrJywgeyBlbnY6IHsgcmVnaW9uOiAndXMtZWFzdC0xJyB9IH0pO1xuY29uc3Qgc3RhY2syID0gbmV3IEVrc0F1dG9Nb2RlTm9kZVBvb2xzU3RhY2soYXBwLCAnZWtzLWF1dG8tbW9kZS1lbXB0eS1ub2RlcG9vbHMtc3RhY2snLCB7IGVudjogeyByZWdpb246ICd1cy1lYXN0LTEnIH0gfSk7XG5cbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnYXdzLWNkay1la3MtY2x1c3Rlci1pbnRlZycsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2sxLCBzdGFjazJdLFxufSk7XG4iXX0=