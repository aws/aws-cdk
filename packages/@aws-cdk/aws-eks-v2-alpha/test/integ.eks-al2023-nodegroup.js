"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const integ = require("@aws-cdk/integ-tests-alpha");
const lambda_layer_kubectl_v34_1 = require("@aws-cdk/lambda-layer-kubectl-v34");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const aws_eks_1 = require("aws-cdk-lib/aws-eks");
const iam = require("aws-cdk-lib/aws-iam");
const eks = require("../lib");
class EksClusterStack extends aws_cdk_lib_1.Stack {
    cluster;
    vpc;
    constructor(scope, id, props) {
        super(scope, id, props);
        // allow all account users to assume this role in order to admin the cluster
        const mastersRole = new iam.Role(this, 'AdminRole', {
            assumedBy: new iam.AccountRootPrincipal(),
        });
        // just need one nat gateway to simplify the test
        this.vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1, restrictDefaultSecurityGroup: false });
        // create the cluster with no defaultCapacity, nodegroup will be created later
        this.cluster = new eks.Cluster(this, 'Cluster', {
            vpc: this.vpc,
            mastersRole,
            defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
            defaultCapacity: 0,
            version: eks.KubernetesVersion.V1_34,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v34_1.KubectlV34Layer(this, 'kubectlLayer'),
            },
        });
        // create nodegroup with AL2023_X86_64_STANDARD
        this.cluster.addNodegroupCapacity('MNG_AL2023_X86_64_STANDARD', {
            amiType: aws_eks_1.NodegroupAmiType.AL2023_X86_64_STANDARD,
        });
        // create nodegroup with AL2023_ARM_64_STANDARD
        this.cluster.addNodegroupCapacity('MNG_AL2023_ARM_64_STANDARD', {
            amiType: aws_eks_1.NodegroupAmiType.AL2023_ARM_64_STANDARD,
        });
        // create nodegroup with AL2023_X86_64_NEURON
        this.cluster.addNodegroupCapacity('MNG_AL2023_X86_64_NEURON', {
            amiType: aws_eks_1.NodegroupAmiType.AL2023_X86_64_NEURON,
        });
        // create nodegroup with AL2023_X86_64_NVIDIA
        this.cluster.addNodegroupCapacity('MNG_AL2023_X86_64_NVIDIA', {
            amiType: aws_eks_1.NodegroupAmiType.AL2023_X86_64_NVIDIA,
        });
    }
}
const app = new aws_cdk_lib_1.App({
    postCliContext: {
        '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
        '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    },
});
const stack = new EksClusterStack(app, 'aws-cdk-eks-cluster-al2023-nodegroup-test');
new integ.IntegTest(app, 'aws-cdk-eks-cluster-al2023-nodegroup', {
    testCases: [stack],
    // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
    diffAssets: false,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLWFsMjAyMy1ub2RlZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5la3MtYWwyMDIzLW5vZGVncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUE2QztBQUM3QyxvREFBb0Q7QUFDcEQsZ0ZBQW9FO0FBQ3BFLDZDQUFxRDtBQUNyRCwyQ0FBMkM7QUFDM0MsaURBQXVEO0FBQ3ZELDJDQUEyQztBQUMzQyw4QkFBOEI7QUFFOUIsTUFBTSxlQUFnQixTQUFRLG1CQUFLO0lBQ3pCLE9BQU8sQ0FBYztJQUNyQixHQUFHLENBQVc7SUFFdEIsWUFBWSxLQUFVLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQ3BELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLDRFQUE0RTtRQUM1RSxNQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUNsRCxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsb0JBQW9CLEVBQUU7U0FDMUMsQ0FBQyxDQUFDO1FBRUgsaURBQWlEO1FBQ2pELElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLDRCQUE0QixFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFN0YsOEVBQThFO1FBQzlFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDOUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1lBQ2IsV0FBVztZQUNYLG1CQUFtQixFQUFFLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTO1lBQ3RELGVBQWUsRUFBRSxDQUFDO1lBQ2xCLE9BQU8sRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSztZQUNwQyxzQkFBc0IsRUFBRTtnQkFDdEIsWUFBWSxFQUFFLElBQUksMENBQWUsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDO2FBQ3hEO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsK0NBQStDO1FBQy9DLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsNEJBQTRCLEVBQUU7WUFDOUQsT0FBTyxFQUFFLDBCQUFnQixDQUFDLHNCQUFzQjtTQUNqRCxDQUFDLENBQUM7UUFFSCwrQ0FBK0M7UUFDL0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyw0QkFBNEIsRUFBRTtZQUM5RCxPQUFPLEVBQUUsMEJBQWdCLENBQUMsc0JBQXNCO1NBQ2pELENBQUMsQ0FBQztRQUVILDZDQUE2QztRQUM3QyxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLDBCQUEwQixFQUFFO1lBQzVELE9BQU8sRUFBRSwwQkFBZ0IsQ0FBQyxvQkFBb0I7U0FDL0MsQ0FBQyxDQUFDO1FBRUgsNkNBQTZDO1FBQzdDLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsMEJBQTBCLEVBQUU7WUFDNUQsT0FBTyxFQUFFLDBCQUFnQixDQUFDLG9CQUFvQjtTQUMvQyxDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxDQUFDO0lBQ2xCLGNBQWMsRUFBRTtRQUNkLDBEQUEwRCxFQUFFLElBQUk7UUFDaEUsMkNBQTJDLEVBQUUsS0FBSztLQUNuRDtDQUNGLENBQUMsQ0FBQztBQUVILE1BQU0sS0FBSyxHQUFHLElBQUksZUFBZSxDQUFDLEdBQUcsRUFBRSwyQ0FBMkMsQ0FBQyxDQUFDO0FBQ3BGLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsc0NBQXNDLEVBQUU7SUFDL0QsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0lBQ2xCLDJGQUEyRjtJQUMzRixVQUFVLEVBQUUsS0FBSztDQUNsQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gIWNkay1pbnRlZyBwcmFnbWE6ZGlzYWJsZS11cGRhdGUtd29ya2Zsb3dcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IEt1YmVjdGxWMzRMYXllciB9IGZyb20gJ0Bhd3MtY2RrL2xhbWJkYS1sYXllci1rdWJlY3RsLXYzNCc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0IHsgTm9kZWdyb3VwQW1pVHlwZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1la3MnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgZWtzIGZyb20gJy4uL2xpYic7XG5cbmNsYXNzIEVrc0NsdXN0ZXJTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgcHJpdmF0ZSBjbHVzdGVyOiBla3MuQ2x1c3RlcjtcbiAgcHJpdmF0ZSB2cGM6IGVjMi5JVnBjO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gYWxsb3cgYWxsIGFjY291bnQgdXNlcnMgdG8gYXNzdW1lIHRoaXMgcm9sZSBpbiBvcmRlciB0byBhZG1pbiB0aGUgY2x1c3RlclxuICAgIGNvbnN0IG1hc3RlcnNSb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdBZG1pblJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKSxcbiAgICB9KTtcblxuICAgIC8vIGp1c3QgbmVlZCBvbmUgbmF0IGdhdGV3YXkgdG8gc2ltcGxpZnkgdGhlIHRlc3RcbiAgICB0aGlzLnZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWcGMnLCB7IG5hdEdhdGV3YXlzOiAxLCByZXN0cmljdERlZmF1bHRTZWN1cml0eUdyb3VwOiBmYWxzZSB9KTtcblxuICAgIC8vIGNyZWF0ZSB0aGUgY2x1c3RlciB3aXRoIG5vIGRlZmF1bHRDYXBhY2l0eSwgbm9kZWdyb3VwIHdpbGwgYmUgY3JlYXRlZCBsYXRlclxuICAgIHRoaXMuY2x1c3RlciA9IG5ldyBla3MuQ2x1c3Rlcih0aGlzLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYzogdGhpcy52cGMsXG4gICAgICBtYXN0ZXJzUm9sZSxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eVR5cGU6IGVrcy5EZWZhdWx0Q2FwYWNpdHlUeXBlLk5PREVHUk9VUCxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IGVrcy5LdWJlcm5ldGVzVmVyc2lvbi5WMV8zNCxcbiAgICAgIGt1YmVjdGxQcm92aWRlck9wdGlvbnM6IHtcbiAgICAgICAga3ViZWN0bExheWVyOiBuZXcgS3ViZWN0bFYzNExheWVyKHRoaXMsICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBjcmVhdGUgbm9kZWdyb3VwIHdpdGggQUwyMDIzX1g4Nl82NF9TVEFOREFSRFxuICAgIHRoaXMuY2x1c3Rlci5hZGROb2RlZ3JvdXBDYXBhY2l0eSgnTU5HX0FMMjAyM19YODZfNjRfU1RBTkRBUkQnLCB7XG4gICAgICBhbWlUeXBlOiBOb2RlZ3JvdXBBbWlUeXBlLkFMMjAyM19YODZfNjRfU1RBTkRBUkQsXG4gICAgfSk7XG5cbiAgICAvLyBjcmVhdGUgbm9kZWdyb3VwIHdpdGggQUwyMDIzX0FSTV82NF9TVEFOREFSRFxuICAgIHRoaXMuY2x1c3Rlci5hZGROb2RlZ3JvdXBDYXBhY2l0eSgnTU5HX0FMMjAyM19BUk1fNjRfU1RBTkRBUkQnLCB7XG4gICAgICBhbWlUeXBlOiBOb2RlZ3JvdXBBbWlUeXBlLkFMMjAyM19BUk1fNjRfU1RBTkRBUkQsXG4gICAgfSk7XG5cbiAgICAvLyBjcmVhdGUgbm9kZWdyb3VwIHdpdGggQUwyMDIzX1g4Nl82NF9ORVVST05cbiAgICB0aGlzLmNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ01OR19BTDIwMjNfWDg2XzY0X05FVVJPTicsIHtcbiAgICAgIGFtaVR5cGU6IE5vZGVncm91cEFtaVR5cGUuQUwyMDIzX1g4Nl82NF9ORVVST04sXG4gICAgfSk7XG5cbiAgICAvLyBjcmVhdGUgbm9kZWdyb3VwIHdpdGggQUwyMDIzX1g4Nl82NF9OVklESUFcbiAgICB0aGlzLmNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ01OR19BTDIwMjNfWDg2XzY0X05WSURJQScsIHtcbiAgICAgIGFtaVR5cGU6IE5vZGVncm91cEFtaVR5cGUuQUwyMDIzX1g4Nl82NF9OVklESUEsXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gIHBvc3RDbGlDb250ZXh0OiB7XG4gICAgJ0Bhd3MtY2RrL2F3cy1sYW1iZGE6Y3JlYXRlTmV3UG9saWNpZXNXaXRoQWRkVG9Sb2xlUG9saWN5JzogdHJ1ZSxcbiAgICAnQGF3cy1jZGsvYXdzLWxhbWJkYTp1c2VDZGtNYW5hZ2VkTG9nR3JvdXAnOiBmYWxzZSxcbiAgfSxcbn0pO1xuXG5jb25zdCBzdGFjayA9IG5ldyBFa3NDbHVzdGVyU3RhY2soYXBwLCAnYXdzLWNkay1la3MtY2x1c3Rlci1hbDIwMjMtbm9kZWdyb3VwLXRlc3QnKTtcbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnYXdzLWNkay1la3MtY2x1c3Rlci1hbDIwMjMtbm9kZWdyb3VwJywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG4gIC8vIFRlc3QgaW5jbHVkZXMgYXNzZXRzIHRoYXQgYXJlIHVwZGF0ZWQgd2Vla2x5LiBJZiBub3QgZGlzYWJsZWQsIHRoZSB1cGdyYWRlIFBSIHdpbGwgZmFpbC5cbiAgZGlmZkFzc2V0czogZmFsc2UsXG59KTtcbiJdfQ==