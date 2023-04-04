"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const path = require("path");
const ec2 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
const aws_s3_assets_1 = require("aws-cdk-lib/aws-s3-assets");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const integ_tests_kubernetes_version_1 = require("./integ-tests-kubernetes-version");
const eks = require("aws-cdk-lib/aws-eks");
class EksClusterStack extends aws_cdk_lib_1.Stack {
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
            defaultCapacity: 2,
            ...(0, integ_tests_kubernetes_version_1.getClusterVersionConfig)(this),
            tags: {
                foo: 'bar',
            },
            clusterLogging: [
                eks.ClusterLoggingTypes.API,
                eks.ClusterLoggingTypes.AUTHENTICATOR,
                eks.ClusterLoggingTypes.SCHEDULER,
            ],
        });
        this.assertHelmChartAsset();
    }
    assertHelmChartAsset() {
        // get helm chart from Asset
        const chartAsset = new aws_s3_assets_1.Asset(this, 'ChartAsset', {
            path: path.join(__dirname, 'test-chart'),
        });
        this.cluster.addHelmChart('test-chart', {
            chartAsset: chartAsset,
        });
        this.cluster.addHelmChart('test-oci-chart', {
            chart: 's3-chart',
            release: 's3-chart',
            repository: 'oci://public.ecr.aws/aws-controllers-k8s/s3-chart',
            version: 'v0.1.0',
            namespace: 'ack-system',
            createNamespace: true,
        });
        // there is no opinionated way of testing charts from private ECR, so there is description of manual steps needed to reproduce:
        // 1. `export AWS_PROFILE=youraccountprofile; aws ecr create-repository --repository-name helm-charts-test/s3-chart --region YOUR_REGION`
        // 2. `helm pull oci://public.ecr.aws/aws-controllers-k8s/s3-chart --version v0.1.0`
        // 3. Login to ECR (howto: https://docs.aws.amazon.com/AmazonECR/latest/userguide/push-oci-artifact.html )
        // 4. `helm push s3-chart-v0.1.0.tgz oci://YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/helm-charts-test/`
        // 5. Change `repository` in above test to oci://YOUR_ACCOUNT_ID.dkr.ecr.YOUR_REGION.amazonaws.com/helm-charts-test
        // 6. Run integration tests as usual
        this.cluster.addHelmChart('test-oci-chart-different-release-name', {
            chart: 'lambda-chart',
            release: 'lambda-chart-release',
            repository: 'oci://public.ecr.aws/aws-controllers-k8s/lambda-chart',
            version: 'v0.1.4',
            namespace: 'ack-system',
            createNamespace: true,
        });
        // testing the disable mechanism of the installation of CRDs
        this.cluster.addHelmChart('test-skip-crd-installation', {
            chart: 'lambda-chart',
            release: 'lambda-chart-release',
            repository: 'oci://public.ecr.aws/aws-controllers-k8s/lambda-chart',
            version: 'v0.1.4',
            namespace: 'ack-system',
            createNamespace: true,
            skipCrds: true,
        });
    }
}
const app = new aws_cdk_lib_1.App();
const stack = new EksClusterStack(app, 'aws-cdk-eks-helm-test');
new integ.IntegTest(app, 'aws-cdk-eks-helm', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLWhlbG0tYXNzZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5la3MtaGVsbS1hc3NldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUE2QztBQUM3Qyw2QkFBNkI7QUFDN0IsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyw2REFBa0Q7QUFDbEQsNkNBQXlDO0FBQ3pDLG9EQUFvRDtBQUNwRCxxRkFBMkU7QUFDM0UsMkNBQTJDO0FBRTNDLE1BQU0sZUFBZ0IsU0FBUSxtQkFBSztJQUlqQyxZQUFZLEtBQVUsRUFBRSxFQUFVO1FBQ2hDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsNEVBQTRFO1FBQzVFLE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQ2xELFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRTtTQUMxQyxDQUFDLENBQUM7UUFFSCxpREFBaUQ7UUFDakQsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXhELHVEQUF1RDtRQUN2RCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQzlDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztZQUNiLFdBQVc7WUFDWCxlQUFlLEVBQUUsQ0FBQztZQUNsQixHQUFHLElBQUEsd0RBQXVCLEVBQUMsSUFBSSxDQUFDO1lBQ2hDLElBQUksRUFBRTtnQkFDSixHQUFHLEVBQUUsS0FBSzthQUNYO1lBQ0QsY0FBYyxFQUFFO2dCQUNkLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHO2dCQUMzQixHQUFHLENBQUMsbUJBQW1CLENBQUMsYUFBYTtnQkFDckMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLFNBQVM7YUFDbEM7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRU8sb0JBQW9CO1FBQzFCLDRCQUE0QjtRQUM1QixNQUFNLFVBQVUsR0FBRyxJQUFJLHFCQUFLLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUMvQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDO1NBQ3pDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRTtZQUN0QyxVQUFVLEVBQUUsVUFBVTtTQUN2QixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRTtZQUMxQyxLQUFLLEVBQUUsVUFBVTtZQUNqQixPQUFPLEVBQUUsVUFBVTtZQUNuQixVQUFVLEVBQUUsbURBQW1EO1lBQy9ELE9BQU8sRUFBRSxRQUFRO1lBQ2pCLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLGVBQWUsRUFBRSxJQUFJO1NBQ3RCLENBQUMsQ0FBQztRQUVILCtIQUErSDtRQUMvSCx5SUFBeUk7UUFDekksb0ZBQW9GO1FBQ3BGLDBHQUEwRztRQUMxRywrR0FBK0c7UUFDL0csbUhBQW1IO1FBQ25ILG9DQUFvQztRQUVwQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyx1Q0FBdUMsRUFBRTtZQUNqRSxLQUFLLEVBQUUsY0FBYztZQUNyQixPQUFPLEVBQUUsc0JBQXNCO1lBQy9CLFVBQVUsRUFBRSx1REFBdUQ7WUFDbkUsT0FBTyxFQUFFLFFBQVE7WUFDakIsU0FBUyxFQUFFLFlBQVk7WUFDdkIsZUFBZSxFQUFFLElBQUk7U0FDdEIsQ0FBQyxDQUFDO1FBRUgsNERBQTREO1FBQzVELElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLDRCQUE0QixFQUFFO1lBQ3RELEtBQUssRUFBRSxjQUFjO1lBQ3JCLE9BQU8sRUFBRSxzQkFBc0I7WUFDL0IsVUFBVSxFQUFFLHVEQUF1RDtZQUNuRSxPQUFPLEVBQUUsUUFBUTtZQUNqQixTQUFTLEVBQUUsWUFBWTtZQUN2QixlQUFlLEVBQUUsSUFBSTtZQUNyQixRQUFRLEVBQUUsSUFBSTtTQUNmLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBRXRCLE1BQU0sS0FBSyxHQUFHLElBQUksZUFBZSxDQUFDLEdBQUcsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2hFLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsa0JBQWtCLEVBQUU7SUFDM0MsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyAhY2RrLWludGVnIHByYWdtYTpkaXNhYmxlLXVwZGF0ZS13b3JrZmxvd1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IEFzc2V0IH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzLWFzc2V0cyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgZ2V0Q2x1c3RlclZlcnNpb25Db25maWcgfSBmcm9tICcuL2ludGVnLXRlc3RzLWt1YmVybmV0ZXMtdmVyc2lvbic7XG5pbXBvcnQgKiBhcyBla3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVrcyc7XG5cbmNsYXNzIEVrc0NsdXN0ZXJTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgcHJpdmF0ZSBjbHVzdGVyOiBla3MuQ2x1c3RlcjtcbiAgcHJpdmF0ZSB2cGM6IGVjMi5JVnBjO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8gYWxsb3cgYWxsIGFjY291bnQgdXNlcnMgdG8gYXNzdW1lIHRoaXMgcm9sZSBpbiBvcmRlciB0byBhZG1pbiB0aGUgY2x1c3RlclxuICAgIGNvbnN0IG1hc3RlcnNSb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdBZG1pblJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKSxcbiAgICB9KTtcblxuICAgIC8vIGp1c3QgbmVlZCBvbmUgbmF0IGdhdGV3YXkgdG8gc2ltcGxpZnkgdGhlIHRlc3RcbiAgICB0aGlzLnZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWcGMnLCB7IG5hdEdhdGV3YXlzOiAxIH0pO1xuXG4gICAgLy8gY3JlYXRlIHRoZSBjbHVzdGVyIHdpdGggYSBkZWZhdWx0IG5vZGVncm91cCBjYXBhY2l0eVxuICAgIHRoaXMuY2x1c3RlciA9IG5ldyBla3MuQ2x1c3Rlcih0aGlzLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYzogdGhpcy52cGMsXG4gICAgICBtYXN0ZXJzUm9sZSxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMixcbiAgICAgIC4uLmdldENsdXN0ZXJWZXJzaW9uQ29uZmlnKHRoaXMpLFxuICAgICAgdGFnczoge1xuICAgICAgICBmb286ICdiYXInLFxuICAgICAgfSxcbiAgICAgIGNsdXN0ZXJMb2dnaW5nOiBbXG4gICAgICAgIGVrcy5DbHVzdGVyTG9nZ2luZ1R5cGVzLkFQSSxcbiAgICAgICAgZWtzLkNsdXN0ZXJMb2dnaW5nVHlwZXMuQVVUSEVOVElDQVRPUixcbiAgICAgICAgZWtzLkNsdXN0ZXJMb2dnaW5nVHlwZXMuU0NIRURVTEVSLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHRoaXMuYXNzZXJ0SGVsbUNoYXJ0QXNzZXQoKTtcbiAgfVxuXG4gIHByaXZhdGUgYXNzZXJ0SGVsbUNoYXJ0QXNzZXQoKSB7XG4gICAgLy8gZ2V0IGhlbG0gY2hhcnQgZnJvbSBBc3NldFxuICAgIGNvbnN0IGNoYXJ0QXNzZXQgPSBuZXcgQXNzZXQodGhpcywgJ0NoYXJ0QXNzZXQnLCB7XG4gICAgICBwYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAndGVzdC1jaGFydCcpLFxuICAgIH0pO1xuICAgIHRoaXMuY2x1c3Rlci5hZGRIZWxtQ2hhcnQoJ3Rlc3QtY2hhcnQnLCB7XG4gICAgICBjaGFydEFzc2V0OiBjaGFydEFzc2V0LFxuICAgIH0pO1xuXG4gICAgdGhpcy5jbHVzdGVyLmFkZEhlbG1DaGFydCgndGVzdC1vY2ktY2hhcnQnLCB7XG4gICAgICBjaGFydDogJ3MzLWNoYXJ0JyxcbiAgICAgIHJlbGVhc2U6ICdzMy1jaGFydCcsXG4gICAgICByZXBvc2l0b3J5OiAnb2NpOi8vcHVibGljLmVjci5hd3MvYXdzLWNvbnRyb2xsZXJzLWs4cy9zMy1jaGFydCcsXG4gICAgICB2ZXJzaW9uOiAndjAuMS4wJyxcbiAgICAgIG5hbWVzcGFjZTogJ2Fjay1zeXN0ZW0nLFxuICAgICAgY3JlYXRlTmFtZXNwYWNlOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gdGhlcmUgaXMgbm8gb3BpbmlvbmF0ZWQgd2F5IG9mIHRlc3RpbmcgY2hhcnRzIGZyb20gcHJpdmF0ZSBFQ1IsIHNvIHRoZXJlIGlzIGRlc2NyaXB0aW9uIG9mIG1hbnVhbCBzdGVwcyBuZWVkZWQgdG8gcmVwcm9kdWNlOlxuICAgIC8vIDEuIGBleHBvcnQgQVdTX1BST0ZJTEU9eW91cmFjY291bnRwcm9maWxlOyBhd3MgZWNyIGNyZWF0ZS1yZXBvc2l0b3J5IC0tcmVwb3NpdG9yeS1uYW1lIGhlbG0tY2hhcnRzLXRlc3QvczMtY2hhcnQgLS1yZWdpb24gWU9VUl9SRUdJT05gXG4gICAgLy8gMi4gYGhlbG0gcHVsbCBvY2k6Ly9wdWJsaWMuZWNyLmF3cy9hd3MtY29udHJvbGxlcnMtazhzL3MzLWNoYXJ0IC0tdmVyc2lvbiB2MC4xLjBgXG4gICAgLy8gMy4gTG9naW4gdG8gRUNSIChob3d0bzogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkVDUi9sYXRlc3QvdXNlcmd1aWRlL3B1c2gtb2NpLWFydGlmYWN0Lmh0bWwgKVxuICAgIC8vIDQuIGBoZWxtIHB1c2ggczMtY2hhcnQtdjAuMS4wLnRneiBvY2k6Ly9ZT1VSX0FDQ09VTlRfSUQuZGtyLmVjci5ZT1VSX1JFR0lPTi5hbWF6b25hd3MuY29tL2hlbG0tY2hhcnRzLXRlc3QvYFxuICAgIC8vIDUuIENoYW5nZSBgcmVwb3NpdG9yeWAgaW4gYWJvdmUgdGVzdCB0byBvY2k6Ly9ZT1VSX0FDQ09VTlRfSUQuZGtyLmVjci5ZT1VSX1JFR0lPTi5hbWF6b25hd3MuY29tL2hlbG0tY2hhcnRzLXRlc3RcbiAgICAvLyA2LiBSdW4gaW50ZWdyYXRpb24gdGVzdHMgYXMgdXN1YWxcblxuICAgIHRoaXMuY2x1c3Rlci5hZGRIZWxtQ2hhcnQoJ3Rlc3Qtb2NpLWNoYXJ0LWRpZmZlcmVudC1yZWxlYXNlLW5hbWUnLCB7XG4gICAgICBjaGFydDogJ2xhbWJkYS1jaGFydCcsXG4gICAgICByZWxlYXNlOiAnbGFtYmRhLWNoYXJ0LXJlbGVhc2UnLFxuICAgICAgcmVwb3NpdG9yeTogJ29jaTovL3B1YmxpYy5lY3IuYXdzL2F3cy1jb250cm9sbGVycy1rOHMvbGFtYmRhLWNoYXJ0JyxcbiAgICAgIHZlcnNpb246ICd2MC4xLjQnLFxuICAgICAgbmFtZXNwYWNlOiAnYWNrLXN5c3RlbScsXG4gICAgICBjcmVhdGVOYW1lc3BhY2U6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyB0ZXN0aW5nIHRoZSBkaXNhYmxlIG1lY2hhbmlzbSBvZiB0aGUgaW5zdGFsbGF0aW9uIG9mIENSRHNcbiAgICB0aGlzLmNsdXN0ZXIuYWRkSGVsbUNoYXJ0KCd0ZXN0LXNraXAtY3JkLWluc3RhbGxhdGlvbicsIHtcbiAgICAgIGNoYXJ0OiAnbGFtYmRhLWNoYXJ0JyxcbiAgICAgIHJlbGVhc2U6ICdsYW1iZGEtY2hhcnQtcmVsZWFzZScsXG4gICAgICByZXBvc2l0b3J5OiAnb2NpOi8vcHVibGljLmVjci5hd3MvYXdzLWNvbnRyb2xsZXJzLWs4cy9sYW1iZGEtY2hhcnQnLFxuICAgICAgdmVyc2lvbjogJ3YwLjEuNCcsXG4gICAgICBuYW1lc3BhY2U6ICdhY2stc3lzdGVtJyxcbiAgICAgIGNyZWF0ZU5hbWVzcGFjZTogdHJ1ZSxcbiAgICAgIHNraXBDcmRzOiB0cnVlLFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgRWtzQ2x1c3RlclN0YWNrKGFwcCwgJ2F3cy1jZGstZWtzLWhlbG0tdGVzdCcpO1xubmV3IGludGVnLkludGVnVGVzdChhcHAsICdhd3MtY2RrLWVrcy1oZWxtJywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=