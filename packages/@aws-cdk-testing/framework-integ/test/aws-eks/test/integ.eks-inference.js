"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const ec2 = require("aws-cdk-lib/aws-ec2");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const integ_tests_kubernetes_version_1 = require("./integ-tests-kubernetes-version");
const eks = require("aws-cdk-lib/aws-eks");
class EksClusterInferenceStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        // just need one nat gateway to simplify the test
        const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1 });
        const cluster = new eks.Cluster(this, 'Cluster', {
            vpc,
            ...(0, integ_tests_kubernetes_version_1.getClusterVersionConfig)(this),
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
const app = new aws_cdk_lib_1.App();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLWluZmVyZW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmVrcy1pbmZlcmVuY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBNkM7QUFDN0MsMkNBQTJDO0FBQzNDLDZDQUF5QztBQUN6QyxvREFBb0Q7QUFDcEQscUZBQTJFO0FBQzNFLDJDQUEyQztBQUUzQyxNQUFNLHdCQUF5QixTQUFRLG1CQUFLO0lBRTFDLFlBQVksS0FBVSxFQUFFLEVBQVU7UUFDaEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixpREFBaUQ7UUFDakQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXBFLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQy9DLEdBQUc7WUFDSCxHQUFHLElBQUEsd0RBQXVCLEVBQUMsSUFBSSxDQUFDO1lBQ2hDLGFBQWEsRUFBRTtnQkFDYixPQUFPLEVBQUUsR0FBRyxDQUFDLG9CQUFvQixDQUFDLE1BQU07YUFDekM7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsMkJBQTJCLENBQUMsb0JBQW9CLEVBQUU7WUFDeEQsWUFBWSxFQUFFLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUM7WUFDbEQsV0FBVyxFQUFFLENBQUM7U0FDZixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLHdCQUF3QixDQUFDLEdBQUcsRUFBRSxvQ0FBb0MsQ0FBQyxDQUFDO0FBQ3RGLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsK0JBQStCLEVBQUU7SUFDeEQsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0lBQ2xCLGlCQUFpQixFQUFFO1FBQ2pCLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRTtnQkFDSixRQUFRLEVBQUUsSUFBSTthQUNmO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUNILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyAhY2RrLWludGVnIHByYWdtYTpkaXNhYmxlLXVwZGF0ZS13b3JrZmxvd1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0IHsgQXBwLCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IGdldENsdXN0ZXJWZXJzaW9uQ29uZmlnIH0gZnJvbSAnLi9pbnRlZy10ZXN0cy1rdWJlcm5ldGVzLXZlcnNpb24nO1xuaW1wb3J0ICogYXMgZWtzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1la3MnO1xuXG5jbGFzcyBFa3NDbHVzdGVySW5mZXJlbmNlU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IEFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAvLyBqdXN0IG5lZWQgb25lIG5hdCBnYXRld2F5IHRvIHNpbXBsaWZ5IHRoZSB0ZXN0XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgJ1ZwYycsIHsgbWF4QXpzOiAyLCBuYXRHYXRld2F5czogMSB9KTtcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIodGhpcywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5nZXRDbHVzdGVyVmVyc2lvbkNvbmZpZyh0aGlzKSxcbiAgICAgIGFsYkNvbnRyb2xsZXI6IHtcbiAgICAgICAgdmVyc2lvbjogZWtzLkFsYkNvbnRyb2xsZXJWZXJzaW9uLlYyXzRfMSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjbHVzdGVyLmFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eSgnSW5mZXJlbmNlSW5zdGFuY2VzJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgnaW5mMS4yeGxhcmdlJyksXG4gICAgICBtaW5DYXBhY2l0eTogMSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBFa3NDbHVzdGVySW5mZXJlbmNlU3RhY2soYXBwLCAnYXdzLWNkay1la3MtY2x1c3Rlci1pbmZlcmVuY2UtdGVzdCcpO1xubmV3IGludGVnLkludGVnVGVzdChhcHAsICdhd3MtY2RrLWVrcy1jbHVzdGVyLWludGVyZW5jZScsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxuICBjZGtDb21tYW5kT3B0aW9uczoge1xuICAgIGRlcGxveToge1xuICAgICAgYXJnczoge1xuICAgICAgICByb2xsYmFjazogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbn0pO1xuYXBwLnN5bnRoKCk7XG4iXX0=