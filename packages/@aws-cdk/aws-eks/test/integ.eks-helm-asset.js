"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const path = require("path");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const aws_s3_assets_1 = require("@aws-cdk/aws-s3-assets");
const core_1 = require("@aws-cdk/core");
const integ = require("@aws-cdk/integ-tests");
const integ_tests_kubernetes_version_1 = require("./integ-tests-kubernetes-version");
const eks = require("../lib/index");
class EksClusterStack extends core_1.Stack {
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
            ...integ_tests_kubernetes_version_1.getClusterVersionConfig(this),
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
            release: 'lambda-chart-release-skip-crd',
            repository: 'oci://public.ecr.aws/aws-controllers-k8s/lambda-chart',
            version: 'v0.1.4',
            namespace: 'ack-system',
            createNamespace: true,
            skipCrds: true,
        });
        // testing the disable mechanism of the installation of CRDs
        this.cluster.addHelmChart('test-atomic-flag', {
            chart: 'lambda-chart',
            release: 'lambda-chart-release-atomic',
            repository: 'oci://public.ecr.aws/aws-controllers-k8s/lambda-chart',
            version: 'v0.1.4',
            namespace: 'ack-system',
            createNamespace: true,
            atomic: true,
        });
    }
}
const app = new core_1.App();
const stack = new EksClusterStack(app, 'aws-cdk-eks-helm-test');
new integ.IntegTest(app, 'aws-cdk-eks-helm', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLWhlbG0tYXNzZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5la3MtaGVsbS1hc3NldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUE2QztBQUM3Qyw2QkFBNkI7QUFDN0Isd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4QywwREFBK0M7QUFDL0Msd0NBQTJDO0FBQzNDLDhDQUE4QztBQUM5QyxxRkFBMkU7QUFDM0Usb0NBQW9DO0FBRXBDLE1BQU0sZUFBZ0IsU0FBUSxZQUFLO0lBSWpDLFlBQVksS0FBVSxFQUFFLEVBQVU7UUFDaEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQiw0RUFBNEU7UUFDNUUsTUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDbEQsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLG9CQUFvQixFQUFFO1NBQzFDLENBQUMsQ0FBQztRQUVILGlEQUFpRDtRQUNqRCxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFeEQsdURBQXVEO1FBQ3ZELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDOUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1lBQ2IsV0FBVztZQUNYLGVBQWUsRUFBRSxDQUFDO1lBQ2xCLEdBQUcsd0RBQXVCLENBQUMsSUFBSSxDQUFDO1lBQ2hDLElBQUksRUFBRTtnQkFDSixHQUFHLEVBQUUsS0FBSzthQUNYO1lBQ0QsY0FBYyxFQUFFO2dCQUNkLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHO2dCQUMzQixHQUFHLENBQUMsbUJBQW1CLENBQUMsYUFBYTtnQkFDckMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLFNBQVM7YUFDbEM7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztLQUM3QjtJQUVPLG9CQUFvQjtRQUMxQiw0QkFBNEI7UUFDNUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxxQkFBSyxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDL0MsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQztTQUN6QyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUU7WUFDdEMsVUFBVSxFQUFFLFVBQVU7U0FDdkIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUU7WUFDMUMsS0FBSyxFQUFFLFVBQVU7WUFDakIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsVUFBVSxFQUFFLG1EQUFtRDtZQUMvRCxPQUFPLEVBQUUsUUFBUTtZQUNqQixTQUFTLEVBQUUsWUFBWTtZQUN2QixlQUFlLEVBQUUsSUFBSTtTQUN0QixDQUFDLENBQUM7UUFFSCwrSEFBK0g7UUFDL0gseUlBQXlJO1FBQ3pJLG9GQUFvRjtRQUNwRiwwR0FBMEc7UUFDMUcsK0dBQStHO1FBQy9HLG1IQUFtSDtRQUNuSCxvQ0FBb0M7UUFFcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsdUNBQXVDLEVBQUU7WUFDakUsS0FBSyxFQUFFLGNBQWM7WUFDckIsT0FBTyxFQUFFLHNCQUFzQjtZQUMvQixVQUFVLEVBQUUsdURBQXVEO1lBQ25FLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLGVBQWUsRUFBRSxJQUFJO1NBQ3RCLENBQUMsQ0FBQztRQUVILDREQUE0RDtRQUM1RCxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyw0QkFBNEIsRUFBRTtZQUN0RCxLQUFLLEVBQUUsY0FBYztZQUNyQixPQUFPLEVBQUUsK0JBQStCO1lBQ3hDLFVBQVUsRUFBRSx1REFBdUQ7WUFDbkUsT0FBTyxFQUFFLFFBQVE7WUFDakIsU0FBUyxFQUFFLFlBQVk7WUFDdkIsZUFBZSxFQUFFLElBQUk7WUFDckIsUUFBUSxFQUFFLElBQUk7U0FDZixDQUFDLENBQUM7UUFFSCw0REFBNEQ7UUFDNUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsa0JBQWtCLEVBQUU7WUFDNUMsS0FBSyxFQUFFLGNBQWM7WUFDckIsT0FBTyxFQUFFLDZCQUE2QjtZQUN0QyxVQUFVLEVBQUUsdURBQXVEO1lBQ25FLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLFNBQVMsRUFBRSxZQUFZO1lBQ3ZCLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLE1BQU0sRUFBRSxJQUFJO1NBQ2IsQ0FBQyxDQUFDO0tBQ0o7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7QUFFdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFlLENBQUMsR0FBRyxFQUFFLHVCQUF1QixDQUFDLENBQUM7QUFDaEUsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxrQkFBa0IsRUFBRTtJQUMzQyxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7Q0FDbkIsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vICFjZGstaW50ZWcgcHJhZ21hOmRpc2FibGUtdXBkYXRlLXdvcmtmbG93XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgQXNzZXQgfSBmcm9tICdAYXdzLWNkay9hd3MtczMtYXNzZXRzJztcbmltcG9ydCB7IEFwcCwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzJztcbmltcG9ydCB7IGdldENsdXN0ZXJWZXJzaW9uQ29uZmlnIH0gZnJvbSAnLi9pbnRlZy10ZXN0cy1rdWJlcm5ldGVzLXZlcnNpb24nO1xuaW1wb3J0ICogYXMgZWtzIGZyb20gJy4uL2xpYi9pbmRleCc7XG5cbmNsYXNzIEVrc0NsdXN0ZXJTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgcHJpdmF0ZSBjbHVzdGVyOiBla3MuQ2x1c3RlcjtcbiAgcHJpdmF0ZSB2cGM6IGVjMi5JVnBjO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8gYWxsb3cgYWxsIGFjY291bnQgdXNlcnMgdG8gYXNzdW1lIHRoaXMgcm9sZSBpbiBvcmRlciB0byBhZG1pbiB0aGUgY2x1c3RlclxuICAgIGNvbnN0IG1hc3RlcnNSb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdBZG1pblJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKSxcbiAgICB9KTtcblxuICAgIC8vIGp1c3QgbmVlZCBvbmUgbmF0IGdhdGV3YXkgdG8gc2ltcGxpZnkgdGhlIHRlc3RcbiAgICB0aGlzLnZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWcGMnLCB7IG5hdEdhdGV3YXlzOiAxIH0pO1xuXG4gICAgLy8gY3JlYXRlIHRoZSBjbHVzdGVyIHdpdGggYSBkZWZhdWx0IG5vZGVncm91cCBjYXBhY2l0eVxuICAgIHRoaXMuY2x1c3RlciA9IG5ldyBla3MuQ2x1c3Rlcih0aGlzLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYzogdGhpcy52cGMsXG4gICAgICBtYXN0ZXJzUm9sZSxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMixcbiAgICAgIC4uLmdldENsdXN0ZXJWZXJzaW9uQ29uZmlnKHRoaXMpLFxuICAgICAgdGFnczoge1xuICAgICAgICBmb286ICdiYXInLFxuICAgICAgfSxcbiAgICAgIGNsdXN0ZXJMb2dnaW5nOiBbXG4gICAgICAgIGVrcy5DbHVzdGVyTG9nZ2luZ1R5cGVzLkFQSSxcbiAgICAgICAgZWtzLkNsdXN0ZXJMb2dnaW5nVHlwZXMuQVVUSEVOVElDQVRPUixcbiAgICAgICAgZWtzLkNsdXN0ZXJMb2dnaW5nVHlwZXMuU0NIRURVTEVSLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHRoaXMuYXNzZXJ0SGVsbUNoYXJ0QXNzZXQoKTtcbiAgfVxuXG4gIHByaXZhdGUgYXNzZXJ0SGVsbUNoYXJ0QXNzZXQoKSB7XG4gICAgLy8gZ2V0IGhlbG0gY2hhcnQgZnJvbSBBc3NldFxuICAgIGNvbnN0IGNoYXJ0QXNzZXQgPSBuZXcgQXNzZXQodGhpcywgJ0NoYXJ0QXNzZXQnLCB7XG4gICAgICBwYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAndGVzdC1jaGFydCcpLFxuICAgIH0pO1xuICAgIHRoaXMuY2x1c3Rlci5hZGRIZWxtQ2hhcnQoJ3Rlc3QtY2hhcnQnLCB7XG4gICAgICBjaGFydEFzc2V0OiBjaGFydEFzc2V0LFxuICAgIH0pO1xuXG4gICAgdGhpcy5jbHVzdGVyLmFkZEhlbG1DaGFydCgndGVzdC1vY2ktY2hhcnQnLCB7XG4gICAgICBjaGFydDogJ3MzLWNoYXJ0JyxcbiAgICAgIHJlbGVhc2U6ICdzMy1jaGFydCcsXG4gICAgICByZXBvc2l0b3J5OiAnb2NpOi8vcHVibGljLmVjci5hd3MvYXdzLWNvbnRyb2xsZXJzLWs4cy9zMy1jaGFydCcsXG4gICAgICB2ZXJzaW9uOiAndjAuMS4wJyxcbiAgICAgIG5hbWVzcGFjZTogJ2Fjay1zeXN0ZW0nLFxuICAgICAgY3JlYXRlTmFtZXNwYWNlOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gdGhlcmUgaXMgbm8gb3BpbmlvbmF0ZWQgd2F5IG9mIHRlc3RpbmcgY2hhcnRzIGZyb20gcHJpdmF0ZSBFQ1IsIHNvIHRoZXJlIGlzIGRlc2NyaXB0aW9uIG9mIG1hbnVhbCBzdGVwcyBuZWVkZWQgdG8gcmVwcm9kdWNlOlxuICAgIC8vIDEuIGBleHBvcnQgQVdTX1BST0ZJTEU9eW91cmFjY291bnRwcm9maWxlOyBhd3MgZWNyIGNyZWF0ZS1yZXBvc2l0b3J5IC0tcmVwb3NpdG9yeS1uYW1lIGhlbG0tY2hhcnRzLXRlc3QvczMtY2hhcnQgLS1yZWdpb24gWU9VUl9SRUdJT05gXG4gICAgLy8gMi4gYGhlbG0gcHVsbCBvY2k6Ly9wdWJsaWMuZWNyLmF3cy9hd3MtY29udHJvbGxlcnMtazhzL3MzLWNoYXJ0IC0tdmVyc2lvbiB2MC4xLjBgXG4gICAgLy8gMy4gTG9naW4gdG8gRUNSIChob3d0bzogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkVDUi9sYXRlc3QvdXNlcmd1aWRlL3B1c2gtb2NpLWFydGlmYWN0Lmh0bWwgKVxuICAgIC8vIDQuIGBoZWxtIHB1c2ggczMtY2hhcnQtdjAuMS4wLnRneiBvY2k6Ly9ZT1VSX0FDQ09VTlRfSUQuZGtyLmVjci5ZT1VSX1JFR0lPTi5hbWF6b25hd3MuY29tL2hlbG0tY2hhcnRzLXRlc3QvYFxuICAgIC8vIDUuIENoYW5nZSBgcmVwb3NpdG9yeWAgaW4gYWJvdmUgdGVzdCB0byBvY2k6Ly9ZT1VSX0FDQ09VTlRfSUQuZGtyLmVjci5ZT1VSX1JFR0lPTi5hbWF6b25hd3MuY29tL2hlbG0tY2hhcnRzLXRlc3RcbiAgICAvLyA2LiBSdW4gaW50ZWdyYXRpb24gdGVzdHMgYXMgdXN1YWxcblxuICAgIHRoaXMuY2x1c3Rlci5hZGRIZWxtQ2hhcnQoJ3Rlc3Qtb2NpLWNoYXJ0LWRpZmZlcmVudC1yZWxlYXNlLW5hbWUnLCB7XG4gICAgICBjaGFydDogJ2xhbWJkYS1jaGFydCcsXG4gICAgICByZWxlYXNlOiAnbGFtYmRhLWNoYXJ0LXJlbGVhc2UnLFxuICAgICAgcmVwb3NpdG9yeTogJ29jaTovL3B1YmxpYy5lY3IuYXdzL2F3cy1jb250cm9sbGVycy1rOHMvbGFtYmRhLWNoYXJ0JyxcbiAgICAgIHZlcnNpb246ICd2MC4xLjQnLFxuICAgICAgbmFtZXNwYWNlOiAnYWNrLXN5c3RlbScsXG4gICAgICBjcmVhdGVOYW1lc3BhY2U6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyB0ZXN0aW5nIHRoZSBkaXNhYmxlIG1lY2hhbmlzbSBvZiB0aGUgaW5zdGFsbGF0aW9uIG9mIENSRHNcbiAgICB0aGlzLmNsdXN0ZXIuYWRkSGVsbUNoYXJ0KCd0ZXN0LXNraXAtY3JkLWluc3RhbGxhdGlvbicsIHtcbiAgICAgIGNoYXJ0OiAnbGFtYmRhLWNoYXJ0JyxcbiAgICAgIHJlbGVhc2U6ICdsYW1iZGEtY2hhcnQtcmVsZWFzZS1za2lwLWNyZCcsXG4gICAgICByZXBvc2l0b3J5OiAnb2NpOi8vcHVibGljLmVjci5hd3MvYXdzLWNvbnRyb2xsZXJzLWs4cy9sYW1iZGEtY2hhcnQnLFxuICAgICAgdmVyc2lvbjogJ3YwLjEuNCcsXG4gICAgICBuYW1lc3BhY2U6ICdhY2stc3lzdGVtJyxcbiAgICAgIGNyZWF0ZU5hbWVzcGFjZTogdHJ1ZSxcbiAgICAgIHNraXBDcmRzOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gdGVzdGluZyB0aGUgZGlzYWJsZSBtZWNoYW5pc20gb2YgdGhlIGluc3RhbGxhdGlvbiBvZiBDUkRzXG4gICAgdGhpcy5jbHVzdGVyLmFkZEhlbG1DaGFydCgndGVzdC1hdG9taWMtZmxhZycsIHtcbiAgICAgIGNoYXJ0OiAnbGFtYmRhLWNoYXJ0JyxcbiAgICAgIHJlbGVhc2U6ICdsYW1iZGEtY2hhcnQtcmVsZWFzZS1hdG9taWMnLFxuICAgICAgcmVwb3NpdG9yeTogJ29jaTovL3B1YmxpYy5lY3IuYXdzL2F3cy1jb250cm9sbGVycy1rOHMvbGFtYmRhLWNoYXJ0JyxcbiAgICAgIHZlcnNpb246ICd2MC4xLjQnLFxuICAgICAgbmFtZXNwYWNlOiAnYWNrLXN5c3RlbScsXG4gICAgICBjcmVhdGVOYW1lc3BhY2U6IHRydWUsXG4gICAgICBhdG9taWM6IHRydWUsXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG5jb25zdCBzdGFjayA9IG5ldyBFa3NDbHVzdGVyU3RhY2soYXBwLCAnYXdzLWNkay1la3MtaGVsbS10ZXN0Jyk7XG5uZXcgaW50ZWcuSW50ZWdUZXN0KGFwcCwgJ2F3cy1jZGstZWtzLWhlbG0nLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==