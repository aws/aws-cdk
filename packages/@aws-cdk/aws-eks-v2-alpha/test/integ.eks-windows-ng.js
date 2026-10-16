"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const integ = require("@aws-cdk/integ-tests-alpha");
const lambda_layer_kubectl_v33_1 = require("@aws-cdk/lambda-layer-kubectl-v33");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const aws_eks_1 = require("aws-cdk-lib/aws-eks");
const iam = require("aws-cdk-lib/aws-iam");
const eks = require("../lib");
class EksClusterStack extends aws_cdk_lib_1.Stack {
    cluster;
    vpc;
    constructor(scope, id) {
        super(scope, id);
        // allow all account users to assume this role in order to admin the cluster
        const mastersRole = new iam.Role(this, 'AdminRole', {
            assumedBy: new iam.AccountRootPrincipal(),
        });
        // just need one nat gateway to simplify the test
        this.vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1 });
        // create the cluster with a default nodegroup capacity
        this.cluster = new eks.Cluster(this, 'Cluster', {
            vpc: this.vpc,
            mastersRole,
            defaultCapacity: 0,
            version: eks.KubernetesVersion.V1_33,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(this, 'kubectlLayer'),
            },
            defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
        });
        this.cluster.addNodegroupCapacity('LinuxNodegroup', {
            amiType: aws_eks_1.NodegroupAmiType.AL2023_X86_64_STANDARD,
        });
        this.cluster.addNodegroupCapacity('WindowsNodegroup', {
            amiType: aws_eks_1.NodegroupAmiType.WINDOWS_FULL_2022_X86_64,
            taints: [
                {
                    effect: aws_eks_1.TaintEffect.NO_SCHEDULE,
                    key: 'os',
                    value: 'windows',
                },
            ],
        });
    }
}
const app = new aws_cdk_lib_1.App({
    postCliContext: {
        '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
        '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    },
});
const stack = new EksClusterStack(app, 'aws-cdk-eks-cluster-windows-ng-test');
new integ.IntegTest(app, 'aws-cdk-eks-cluster-windows-ng', {
    testCases: [stack],
    // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
    diffAssets: false,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLXdpbmRvd3MtbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5la3Mtd2luZG93cy1uZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUE2QztBQUM3QyxvREFBb0Q7QUFDcEQsZ0ZBQW9FO0FBQ3BFLDZDQUF5QztBQUN6QywyQ0FBMkM7QUFDM0MsaURBQW9FO0FBQ3BFLDJDQUEyQztBQUMzQyw4QkFBOEI7QUFFOUIsTUFBTSxlQUFnQixTQUFRLG1CQUFLO0lBQ3pCLE9BQU8sQ0FBYztJQUNyQixHQUFHLENBQVc7SUFFdEIsWUFBWSxLQUFVLEVBQUUsRUFBVTtRQUNoQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLDRFQUE0RTtRQUM1RSxNQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUNsRCxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsb0JBQW9CLEVBQUU7U0FDMUMsQ0FBQyxDQUFDO1FBRUgsaURBQWlEO1FBQ2pELElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV4RCx1REFBdUQ7UUFDdkQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUM5QyxHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7WUFDYixXQUFXO1lBQ1gsZUFBZSxFQUFFLENBQUM7WUFDbEIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLO1lBQ3BDLHNCQUFzQixFQUFFO2dCQUN0QixZQUFZLEVBQUUsSUFBSSwwQ0FBZSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUM7YUFDeEQ7WUFDRCxtQkFBbUIsRUFBRSxHQUFHLENBQUMsbUJBQW1CLENBQUMsU0FBUztTQUN2RCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLGdCQUFnQixFQUFFO1lBQ2xELE9BQU8sRUFBRSwwQkFBZ0IsQ0FBQyxzQkFBc0I7U0FDakQsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxrQkFBa0IsRUFBRTtZQUNwRCxPQUFPLEVBQUUsMEJBQWdCLENBQUMsd0JBQXdCO1lBQ2xELE1BQU0sRUFBRTtnQkFDTjtvQkFDRSxNQUFNLEVBQUUscUJBQVcsQ0FBQyxXQUFXO29CQUMvQixHQUFHLEVBQUUsSUFBSTtvQkFDVCxLQUFLLEVBQUUsU0FBUztpQkFDakI7YUFDRjtTQUNGLENBQUMsQ0FBQztLQUNKO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLENBQUM7SUFDbEIsY0FBYyxFQUFFO1FBQ2QsMERBQTBELEVBQUUsSUFBSTtRQUNoRSwyQ0FBMkMsRUFBRSxLQUFLO0tBQ25EO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsTUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFlLENBQUMsR0FBRyxFQUFFLHFDQUFxQyxDQUFDLENBQUM7QUFDOUUsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxnQ0FBZ0MsRUFBRTtJQUN6RCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7SUFDbEIsMkZBQTJGO0lBQzNGLFVBQVUsRUFBRSxLQUFLO0NBQ2xCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyAhY2RrLWludGVnIHByYWdtYTpkaXNhYmxlLXVwZGF0ZS13b3JrZmxvd1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgS3ViZWN0bFYzM0xheWVyIH0gZnJvbSAnQGF3cy1jZGsvbGFtYmRhLWxheWVyLWt1YmVjdGwtdjMzJztcbmltcG9ydCB7IEFwcCwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgeyBOb2RlZ3JvdXBBbWlUeXBlLCBUYWludEVmZmVjdCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1la3MnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgZWtzIGZyb20gJy4uL2xpYic7XG5cbmNsYXNzIEVrc0NsdXN0ZXJTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgcHJpdmF0ZSBjbHVzdGVyOiBla3MuQ2x1c3RlcjtcbiAgcHJpdmF0ZSB2cGM6IGVjMi5JVnBjO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8gYWxsb3cgYWxsIGFjY291bnQgdXNlcnMgdG8gYXNzdW1lIHRoaXMgcm9sZSBpbiBvcmRlciB0byBhZG1pbiB0aGUgY2x1c3RlclxuICAgIGNvbnN0IG1hc3RlcnNSb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdBZG1pblJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKSxcbiAgICB9KTtcblxuICAgIC8vIGp1c3QgbmVlZCBvbmUgbmF0IGdhdGV3YXkgdG8gc2ltcGxpZnkgdGhlIHRlc3RcbiAgICB0aGlzLnZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWcGMnLCB7IG5hdEdhdGV3YXlzOiAxIH0pO1xuXG4gICAgLy8gY3JlYXRlIHRoZSBjbHVzdGVyIHdpdGggYSBkZWZhdWx0IG5vZGVncm91cCBjYXBhY2l0eVxuICAgIHRoaXMuY2x1c3RlciA9IG5ldyBla3MuQ2x1c3Rlcih0aGlzLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYzogdGhpcy52cGMsXG4gICAgICBtYXN0ZXJzUm9sZSxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IGVrcy5LdWJlcm5ldGVzVmVyc2lvbi5WMV8zMyxcbiAgICAgIGt1YmVjdGxQcm92aWRlck9wdGlvbnM6IHtcbiAgICAgICAga3ViZWN0bExheWVyOiBuZXcgS3ViZWN0bFYzM0xheWVyKHRoaXMsICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0Q2FwYWNpdHlUeXBlOiBla3MuRGVmYXVsdENhcGFjaXR5VHlwZS5OT0RFR1JPVVAsXG4gICAgfSk7XG5cbiAgICB0aGlzLmNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ0xpbnV4Tm9kZWdyb3VwJywge1xuICAgICAgYW1pVHlwZTogTm9kZWdyb3VwQW1pVHlwZS5BTDIwMjNfWDg2XzY0X1NUQU5EQVJELFxuICAgIH0pO1xuICAgIHRoaXMuY2x1c3Rlci5hZGROb2RlZ3JvdXBDYXBhY2l0eSgnV2luZG93c05vZGVncm91cCcsIHtcbiAgICAgIGFtaVR5cGU6IE5vZGVncm91cEFtaVR5cGUuV0lORE9XU19GVUxMXzIwMjJfWDg2XzY0LFxuICAgICAgdGFpbnRzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBlZmZlY3Q6IFRhaW50RWZmZWN0Lk5PX1NDSEVEVUxFLFxuICAgICAgICAgIGtleTogJ29zJyxcbiAgICAgICAgICB2YWx1ZTogJ3dpbmRvd3MnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgcG9zdENsaUNvbnRleHQ6IHtcbiAgICAnQGF3cy1jZGsvYXdzLWxhbWJkYTpjcmVhdGVOZXdQb2xpY2llc1dpdGhBZGRUb1JvbGVQb2xpY3knOiB0cnVlLFxuICAgICdAYXdzLWNkay9hd3MtbGFtYmRhOnVzZUNka01hbmFnZWRMb2dHcm91cCc6IGZhbHNlLFxuICB9LFxufSk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IEVrc0NsdXN0ZXJTdGFjayhhcHAsICdhd3MtY2RrLWVrcy1jbHVzdGVyLXdpbmRvd3MtbmctdGVzdCcpO1xubmV3IGludGVnLkludGVnVGVzdChhcHAsICdhd3MtY2RrLWVrcy1jbHVzdGVyLXdpbmRvd3MtbmcnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbiAgLy8gVGVzdCBpbmNsdWRlcyBhc3NldHMgdGhhdCBhcmUgdXBkYXRlZCB3ZWVrbHkuIElmIG5vdCBkaXNhYmxlZCwgdGhlIHVwZ3JhZGUgUFIgd2lsbCBmYWlsLlxuICBkaWZmQXNzZXRzOiBmYWxzZSxcbn0pO1xuIl19