"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const ec2 = require("@aws-cdk/aws-ec2");
const core_1 = require("@aws-cdk/core");
const integ = require("@aws-cdk/integ-tests");
const integ_tests_kubernetes_version_1 = require("./integ-tests-kubernetes-version");
const eks = require("../lib");
class EksClusterInferenceStack extends core_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        // just need one nat gateway to simplify the test
        const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1 });
        const cluster = new eks.Cluster(this, 'Cluster', {
            vpc,
            ...integ_tests_kubernetes_version_1.getClusterVersionConfig(this),
            albController: {
                version: eks.AlbControllerVersion.V2_4_1,
            },
        });
        cluster.addAutoScalingGroupCapacity('InferenceInstances', {
            instanceType: new ec2.InstanceType('inf1.2xlarge'),
            minCapacity: 1,
        });
    }
}
const app = new core_1.App();
const stack = new EksClusterInferenceStack(app, 'aws-cdk-eks-cluster-inference-test');
new integ.IntegTest(app, 'aws-cdk-eks-cluster-interence', {
    testCases: [stack],
    cdkCommandOptions: {
        deploy: {
            args: {
                rollback: true,
            },
        },
    },
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLWluZmVyZW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmVrcy1pbmZlcmVuY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBNkM7QUFDN0Msd0NBQXdDO0FBQ3hDLHdDQUEyQztBQUMzQyw4Q0FBOEM7QUFDOUMscUZBQTJFO0FBQzNFLDhCQUE4QjtBQUU5QixNQUFNLHdCQUF5QixTQUFRLFlBQUs7SUFFMUMsWUFBWSxLQUFVLEVBQUUsRUFBVTtRQUNoQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLGlEQUFpRDtRQUNqRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFcEUsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDL0MsR0FBRztZQUNILEdBQUcsd0RBQXVCLENBQUMsSUFBSSxDQUFDO1lBQ2hDLGFBQWEsRUFBRTtnQkFDYixPQUFPLEVBQUUsR0FBRyxDQUFDLG9CQUFvQixDQUFDLE1BQU07YUFDekM7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsMkJBQTJCLENBQUMsb0JBQW9CLEVBQUU7WUFDeEQsWUFBWSxFQUFFLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUM7WUFDbEQsV0FBVyxFQUFFLENBQUM7U0FDZixDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLHdCQUF3QixDQUFDLEdBQUcsRUFBRSxvQ0FBb0MsQ0FBQyxDQUFDO0FBQ3RGLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsK0JBQStCLEVBQUU7SUFDeEQsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0lBQ2xCLGlCQUFpQixFQUFFO1FBQ2pCLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRTtnQkFDSixRQUFRLEVBQUUsSUFBSTthQUNmO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyAhY2RrLWludGVnIHByYWdtYTpkaXNhYmxlLXVwZGF0ZS13b3JrZmxvd1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0IHsgQXBwLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0IHsgZ2V0Q2x1c3RlclZlcnNpb25Db25maWcgfSBmcm9tICcuL2ludGVnLXRlc3RzLWt1YmVybmV0ZXMtdmVyc2lvbic7XG5pbXBvcnQgKiBhcyBla3MgZnJvbSAnLi4vbGliJztcblxuY2xhc3MgRWtzQ2x1c3RlckluZmVyZW5jZVN0YWNrIGV4dGVuZHMgU3RhY2sge1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8ganVzdCBuZWVkIG9uZSBuYXQgZ2F0ZXdheSB0byBzaW1wbGlmeSB0aGUgdGVzdFxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWcGMnLCB7IG1heEF6czogMiwgbmF0R2F0ZXdheXM6IDEgfSk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHRoaXMsICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgLi4uZ2V0Q2x1c3RlclZlcnNpb25Db25maWcodGhpcyksXG4gICAgICBhbGJDb250cm9sbGVyOiB7XG4gICAgICAgIHZlcnNpb246IGVrcy5BbGJDb250cm9sbGVyVmVyc2lvbi5WMl80XzEsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY2x1c3Rlci5hZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHkoJ0luZmVyZW5jZUluc3RhbmNlcycsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2luZjEuMnhsYXJnZScpLFxuICAgICAgbWluQ2FwYWNpdHk6IDEsXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgRWtzQ2x1c3RlckluZmVyZW5jZVN0YWNrKGFwcCwgJ2F3cy1jZGstZWtzLWNsdXN0ZXItaW5mZXJlbmNlLXRlc3QnKTtcbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnYXdzLWNkay1la3MtY2x1c3Rlci1pbnRlcmVuY2UnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbiAgY2RrQ29tbWFuZE9wdGlvbnM6IHtcbiAgICBkZXBsb3k6IHtcbiAgICAgIGFyZ3M6IHtcbiAgICAgICAgcm9sbGJhY2s6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbmFwcC5zeW50aCgpO1xuIl19