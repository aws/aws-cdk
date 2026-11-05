"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const integ = require("@aws-cdk/integ-tests-alpha");
const lambda_layer_kubectl_v32_1 = require("@aws-cdk/lambda-layer-kubectl-v32");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const eks = require("../lib");
/**
 * Integration test for improved Helm chart error logging in aws-eks-v2-alpha
 *
 * This test creates a minimal EKS cluster and installs a Helm chart
 * to verify the improved error logging functionality.
 */
class HelmChartLoggingV2Stack extends aws_cdk_lib_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        // Create a minimal VPC with just one NAT gateway
        const vpc = new ec2.Vpc(this, 'Vpc', {
            natGateways: 1,
            restrictDefaultSecurityGroup: false,
        });
        // Create a minimal EKS cluster using v2-alpha
        const cluster = new eks.Cluster(this, 'Cluster', {
            vpc,
            version: eks.KubernetesVersion.V1_32,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v32_1.KubectlV32Layer(this, 'kubectlLayer'),
            },
        });
        // Install a simple Helm chart from a public repository
        // Using the AWS Load Balancer Controller chart as it's commonly used
        cluster.addHelmChart('aws-load-balancer-controller', {
            chart: 'aws-load-balancer-controller',
            repository: 'https://aws.github.io/eks-charts',
            namespace: 'kube-system',
            version: '1.6.0',
            values: {
                clusterName: cluster.clusterName,
            },
        });
    }
}
const app = new aws_cdk_lib_1.App();
const stack = new HelmChartLoggingV2Stack(app, 'aws-cdk-eks-v2-alpha-helm-logging-test');
new integ.IntegTest(app, 'aws-cdk-eks-v2-alpha-helm-logging', {
    testCases: [stack],
    // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
    diffAssets: false,
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuaGVsbS1jaGFydC1sb2dnaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuaGVsbS1jaGFydC1sb2dnaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQTZDO0FBQzdDLG9EQUFvRDtBQUNwRCxnRkFBb0U7QUFDcEUsNkNBQXlDO0FBQ3pDLDJDQUEyQztBQUMzQyw4QkFBOEI7QUFFOUI7Ozs7O0dBS0c7QUFDSCxNQUFNLHVCQUF3QixTQUFRLG1CQUFLO0lBQ3pDLFlBQVksS0FBVSxFQUFFLEVBQVU7UUFDaEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixpREFBaUQ7UUFDakQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7WUFDbkMsV0FBVyxFQUFFLENBQUM7WUFDZCw0QkFBNEIsRUFBRSxLQUFLO1NBQ3BDLENBQUMsQ0FBQztRQUVILDhDQUE4QztRQUM5QyxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUMvQyxHQUFHO1lBQ0gsT0FBTyxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLO1lBQ3BDLHNCQUFzQixFQUFFO2dCQUN0QixZQUFZLEVBQUUsSUFBSSwwQ0FBZSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUM7YUFDeEQ7U0FDRixDQUFDLENBQUM7UUFFSCx1REFBdUQ7UUFDdkQscUVBQXFFO1FBQ3JFLE9BQU8sQ0FBQyxZQUFZLENBQUMsOEJBQThCLEVBQUU7WUFDbkQsS0FBSyxFQUFFLDhCQUE4QjtZQUNyQyxVQUFVLEVBQUUsa0NBQWtDO1lBQzlDLFNBQVMsRUFBRSxhQUFhO1lBQ3hCLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLE1BQU0sRUFBRTtnQkFDTixXQUFXLEVBQUUsT0FBTyxDQUFDLFdBQVc7YUFDakM7U0FDRixDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7QUFFdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSx1QkFBdUIsQ0FBQyxHQUFHLEVBQUUsd0NBQXdDLENBQUMsQ0FBQztBQUV6RixJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLG1DQUFtQyxFQUFFO0lBQzVELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztJQUNsQiwyRkFBMkY7SUFDM0YsVUFBVSxFQUFFLEtBQUs7Q0FDbEIsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vICFjZGstaW50ZWcgcHJhZ21hOmRpc2FibGUtdXBkYXRlLXdvcmtmbG93XG5pbXBvcnQgKiBhcyBpbnRlZyBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgeyBLdWJlY3RsVjMyTGF5ZXIgfSBmcm9tICdAYXdzLWNkay9sYW1iZGEtbGF5ZXIta3ViZWN0bC12MzInO1xuaW1wb3J0IHsgQXBwLCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVrcyBmcm9tICcuLi9saWInO1xuXG4vKipcbiAqIEludGVncmF0aW9uIHRlc3QgZm9yIGltcHJvdmVkIEhlbG0gY2hhcnQgZXJyb3IgbG9nZ2luZyBpbiBhd3MtZWtzLXYyLWFscGhhXG4gKlxuICogVGhpcyB0ZXN0IGNyZWF0ZXMgYSBtaW5pbWFsIEVLUyBjbHVzdGVyIGFuZCBpbnN0YWxscyBhIEhlbG0gY2hhcnRcbiAqIHRvIHZlcmlmeSB0aGUgaW1wcm92ZWQgZXJyb3IgbG9nZ2luZyBmdW5jdGlvbmFsaXR5LlxuICovXG5jbGFzcyBIZWxtQ2hhcnRMb2dnaW5nVjJTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IEFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAvLyBDcmVhdGUgYSBtaW5pbWFsIFZQQyB3aXRoIGp1c3Qgb25lIE5BVCBnYXRld2F5XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgJ1ZwYycsIHtcbiAgICAgIG5hdEdhdGV3YXlzOiAxLFxuICAgICAgcmVzdHJpY3REZWZhdWx0U2VjdXJpdHlHcm91cDogZmFsc2UsXG4gICAgfSk7XG5cbiAgICAvLyBDcmVhdGUgYSBtaW5pbWFsIEVLUyBjbHVzdGVyIHVzaW5nIHYyLWFscGhhXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3Rlcih0aGlzLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIHZlcnNpb246IGVrcy5LdWJlcm5ldGVzVmVyc2lvbi5WMV8zMixcbiAgICAgIGt1YmVjdGxQcm92aWRlck9wdGlvbnM6IHtcbiAgICAgICAga3ViZWN0bExheWVyOiBuZXcgS3ViZWN0bFYzMkxheWVyKHRoaXMsICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBJbnN0YWxsIGEgc2ltcGxlIEhlbG0gY2hhcnQgZnJvbSBhIHB1YmxpYyByZXBvc2l0b3J5XG4gICAgLy8gVXNpbmcgdGhlIEFXUyBMb2FkIEJhbGFuY2VyIENvbnRyb2xsZXIgY2hhcnQgYXMgaXQncyBjb21tb25seSB1c2VkXG4gICAgY2x1c3Rlci5hZGRIZWxtQ2hhcnQoJ2F3cy1sb2FkLWJhbGFuY2VyLWNvbnRyb2xsZXInLCB7XG4gICAgICBjaGFydDogJ2F3cy1sb2FkLWJhbGFuY2VyLWNvbnRyb2xsZXInLFxuICAgICAgcmVwb3NpdG9yeTogJ2h0dHBzOi8vYXdzLmdpdGh1Yi5pby9la3MtY2hhcnRzJyxcbiAgICAgIG5hbWVzcGFjZTogJ2t1YmUtc3lzdGVtJyxcbiAgICAgIHZlcnNpb246ICcxLjYuMCcsXG4gICAgICB2YWx1ZXM6IHtcbiAgICAgICAgY2x1c3Rlck5hbWU6IGNsdXN0ZXIuY2x1c3Rlck5hbWUsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgSGVsbUNoYXJ0TG9nZ2luZ1YyU3RhY2soYXBwLCAnYXdzLWNkay1la3MtdjItYWxwaGEtaGVsbS1sb2dnaW5nLXRlc3QnKTtcblxubmV3IGludGVnLkludGVnVGVzdChhcHAsICdhd3MtY2RrLWVrcy12Mi1hbHBoYS1oZWxtLWxvZ2dpbmcnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbiAgLy8gVGVzdCBpbmNsdWRlcyBhc3NldHMgdGhhdCBhcmUgdXBkYXRlZCB3ZWVrbHkuIElmIG5vdCBkaXNhYmxlZCwgdGhlIHVwZ3JhZGUgUFIgd2lsbCBmYWlsLlxuICBkaWZmQXNzZXRzOiBmYWxzZSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==