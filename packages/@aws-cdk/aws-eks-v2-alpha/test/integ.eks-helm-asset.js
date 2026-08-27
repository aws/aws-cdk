"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const path = require("path");
const integ = require("@aws-cdk/integ-tests-alpha");
const lambda_layer_kubectl_v33_1 = require("@aws-cdk/lambda-layer-kubectl-v33");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
const aws_s3_assets_1 = require("aws-cdk-lib/aws-s3-assets");
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
        this.vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1, restrictDefaultSecurityGroup: false });
        // create the cluster with a default nodegroup capacity
        this.cluster = new eks.Cluster(this, 'Cluster', {
            vpc: this.vpc,
            mastersRole,
            version: eks.KubernetesVersion.V1_33,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(this, 'kubectlLayer'),
            },
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
        // https://gallery.ecr.aws/aws-controllers-k8s/s3-chart
        this.cluster.addHelmChart('test-oci-chart', {
            chart: 's3-chart',
            release: 's3-chart',
            repository: 'oci://public.ecr.aws/aws-controllers-k8s/s3-chart',
            version: 'v0.1.0',
            namespace: 'ack-system',
            createNamespace: true,
            values: { aws: { region: this.region } },
        });
        // https://gallery.ecr.aws/aws-controllers-k8s/lambda-chart
        this.cluster.addHelmChart('test-oci-chart-different-release-name', {
            chart: 'lambda-chart',
            release: 'lambda-chart-release',
            repository: 'oci://public.ecr.aws/aws-controllers-k8s/lambda-chart',
            version: 'v0.1.4',
            namespace: 'ack-system',
            createNamespace: true,
            values: { aws: { region: this.region } },
        });
        // testing the disable mechanism of the installation of CRDs
        // https://gallery.ecr.aws/aws-controllers-k8s/rds-chart
        const rdsChart = this.cluster.addHelmChart('test-skip-crd-installation', {
            chart: 'rds-chart',
            release: 'rds-chart-release',
            repository: 'oci://public.ecr.aws/aws-controllers-k8s/rds-chart',
            version: '1.4.1',
            namespace: 'ack-system',
            createNamespace: true,
            skipCrds: true,
            values: { aws: { region: this.region } },
        });
        // testing installation with atomic flag set to true
        // https://gallery.ecr.aws/aws-controllers-k8s/sns-chart
        // this service account has to be created in `ack-system`
        // we need to ensure that the namespace is created before the service account
        const sa = this.cluster.addServiceAccount('ec2-controller-sa', {
            namespace: 'ack-system',
        });
        // rdsChart should create the namespace `ack-system` if not available
        // adding the dependency ensures that the namespace is created before the service account
        sa.node.addDependency(rdsChart);
        sa.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2FullAccess'));
        this.cluster.addHelmChart('test-atomic-installation', {
            chart: 'ec2-chart',
            release: 'ec2-chart-release',
            repository: 'oci://public.ecr.aws/aws-controllers-k8s/ec2-chart',
            version: '1.2.13',
            namespace: 'ack-system',
            createNamespace: true,
            skipCrds: true,
            atomic: true,
            values: {
                aws: { region: this.region },
                serviceAccount: {
                    name: sa.serviceAccountName,
                    create: false,
                    annotations: {
                        // implicit dependency on the service account
                        'eks.amazonaws.com/role-arn': sa.role.roleArn,
                    },
                },
            },
        });
        // https://github.com/orgs/grafana-operator/packages/container/package/helm-charts%2Fgrafana-operator
        this.cluster.addHelmChart('test-non-ecr-oci-chart', {
            chart: 'grafana-operator',
            release: 'grafana-operator-release',
            repository: 'oci://ghcr.io/grafana-operator/helm-charts/grafana-operator',
            version: 'v5.0.0-rc1',
            namespace: 'ack-system',
            createNamespace: true,
        });
    }
}
const app = new aws_cdk_lib_1.App({
    postCliContext: {
        '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
        '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    },
});
const stack = new EksClusterStack(app, 'aws-cdk-eks-helm-test');
new integ.IntegTest(app, 'aws-cdk-eks-helm', {
    testCases: [stack],
    // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
    diffAssets: false,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLWhlbG0tYXNzZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5la3MtaGVsbS1hc3NldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUE2QztBQUM3Qyw2QkFBNkI7QUFDN0Isb0RBQW9EO0FBQ3BELGdGQUFvRTtBQUNwRSw2Q0FBeUM7QUFDekMsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyw2REFBa0Q7QUFDbEQsOEJBQThCO0FBRTlCLE1BQU0sZUFBZ0IsU0FBUSxtQkFBSztJQUN6QixPQUFPLENBQWM7SUFDckIsR0FBRyxDQUFXO0lBRXRCLFlBQVksS0FBVSxFQUFFLEVBQVU7UUFDaEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQiw0RUFBNEU7UUFDNUUsTUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDbEQsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLG9CQUFvQixFQUFFO1NBQzFDLENBQUMsQ0FBQztRQUVILGlEQUFpRDtRQUNqRCxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSw0QkFBNEIsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBRTdGLHVEQUF1RDtRQUN2RCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQzlDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztZQUNiLFdBQVc7WUFDWCxPQUFPLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUs7WUFDcEMsc0JBQXNCLEVBQUU7Z0JBQ3RCLFlBQVksRUFBRSxJQUFJLDBDQUFlLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQzthQUN4RDtTQUNGLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0tBQzdCO0lBRU8sb0JBQW9CO1FBQzFCLDRCQUE0QjtRQUM1QixNQUFNLFVBQVUsR0FBRyxJQUFJLHFCQUFLLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUMvQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDO1NBQ3pDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRTtZQUN0QyxVQUFVLEVBQUUsVUFBVTtTQUN2QixDQUFDLENBQUM7UUFFSCx1REFBdUQ7UUFDdkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUU7WUFDMUMsS0FBSyxFQUFFLFVBQVU7WUFDakIsT0FBTyxFQUFFLFVBQVU7WUFDbkIsVUFBVSxFQUFFLG1EQUFtRDtZQUMvRCxPQUFPLEVBQUUsUUFBUTtZQUNqQixTQUFTLEVBQUUsWUFBWTtZQUN2QixlQUFlLEVBQUUsSUFBSTtZQUNyQixNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFO1NBQ3pDLENBQUMsQ0FBQztRQUVILDJEQUEyRDtRQUMzRCxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyx1Q0FBdUMsRUFBRTtZQUNqRSxLQUFLLEVBQUUsY0FBYztZQUNyQixPQUFPLEVBQUUsc0JBQXNCO1lBQy9CLFVBQVUsRUFBRSx1REFBdUQ7WUFDbkUsT0FBTyxFQUFFLFFBQVE7WUFDakIsU0FBUyxFQUFFLFlBQVk7WUFDdkIsZUFBZSxFQUFFLElBQUk7WUFDckIsTUFBTSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRTtTQUN6QyxDQUFDLENBQUM7UUFFSCw0REFBNEQ7UUFDNUQsd0RBQXdEO1FBQ3hELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLDRCQUE0QixFQUFFO1lBQ3ZFLEtBQUssRUFBRSxXQUFXO1lBQ2xCLE9BQU8sRUFBRSxtQkFBbUI7WUFDNUIsVUFBVSxFQUFFLG9EQUFvRDtZQUNoRSxPQUFPLEVBQUUsT0FBTztZQUNoQixTQUFTLEVBQUUsWUFBWTtZQUN2QixlQUFlLEVBQUUsSUFBSTtZQUNyQixRQUFRLEVBQUUsSUFBSTtZQUNkLE1BQU0sRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUU7U0FDekMsQ0FBQyxDQUFDO1FBRUgsb0RBQW9EO1FBQ3BELHdEQUF3RDtRQUN4RCx5REFBeUQ7UUFDekQsNkVBQTZFO1FBQzdFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsbUJBQW1CLEVBQUU7WUFDN0QsU0FBUyxFQUFFLFlBQVk7U0FDeEIsQ0FBQyxDQUFDO1FBRUgscUVBQXFFO1FBQ3JFLHlGQUF5RjtRQUN6RixFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVoQyxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsd0JBQXdCLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1FBRTVGLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLDBCQUEwQixFQUFFO1lBQ3BELEtBQUssRUFBRSxXQUFXO1lBQ2xCLE9BQU8sRUFBRSxtQkFBbUI7WUFDNUIsVUFBVSxFQUFFLG9EQUFvRDtZQUNoRSxPQUFPLEVBQUUsUUFBUTtZQUNqQixTQUFTLEVBQUUsWUFBWTtZQUN2QixlQUFlLEVBQUUsSUFBSTtZQUNyQixRQUFRLEVBQUUsSUFBSTtZQUNkLE1BQU0sRUFBRSxJQUFJO1lBQ1osTUFBTSxFQUFFO2dCQUNOLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUM1QixjQUFjLEVBQUU7b0JBQ2QsSUFBSSxFQUFFLEVBQUUsQ0FBQyxrQkFBa0I7b0JBQzNCLE1BQU0sRUFBRSxLQUFLO29CQUNiLFdBQVcsRUFBRTt3QkFDWCw2Q0FBNkM7d0JBQzdDLDRCQUE0QixFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTztxQkFDOUM7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILHFHQUFxRztRQUNyRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyx3QkFBd0IsRUFBRTtZQUNsRCxLQUFLLEVBQUUsa0JBQWtCO1lBQ3pCLE9BQU8sRUFBRSwwQkFBMEI7WUFDbkMsVUFBVSxFQUFFLDZEQUE2RDtZQUN6RSxPQUFPLEVBQUUsWUFBWTtZQUNyQixTQUFTLEVBQUUsWUFBWTtZQUN2QixlQUFlLEVBQUUsSUFBSTtTQUN0QixDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxDQUFDO0lBQ2xCLGNBQWMsRUFBRTtRQUNkLDBEQUEwRCxFQUFFLElBQUk7UUFDaEUsMkNBQTJDLEVBQUUsS0FBSztLQUNuRDtDQUNGLENBQUMsQ0FBQztBQUVILE1BQU0sS0FBSyxHQUFHLElBQUksZUFBZSxDQUFDLEdBQUcsRUFBRSx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2hFLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsa0JBQWtCLEVBQUU7SUFDM0MsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0lBQ2xCLDJGQUEyRjtJQUMzRixVQUFVLEVBQUUsS0FBSztDQUNsQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gIWNkay1pbnRlZyBwcmFnbWE6ZGlzYWJsZS11cGRhdGUtd29ya2Zsb3dcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBpbnRlZyBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgeyBLdWJlY3RsVjMzTGF5ZXIgfSBmcm9tICdAYXdzLWNkay9sYW1iZGEtbGF5ZXIta3ViZWN0bC12MzMnO1xuaW1wb3J0IHsgQXBwLCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IEFzc2V0IH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzLWFzc2V0cyc7XG5pbXBvcnQgKiBhcyBla3MgZnJvbSAnLi4vbGliJztcblxuY2xhc3MgRWtzQ2x1c3RlclN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBwcml2YXRlIGNsdXN0ZXI6IGVrcy5DbHVzdGVyO1xuICBwcml2YXRlIHZwYzogZWMyLklWcGM7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IEFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAvLyBhbGxvdyBhbGwgYWNjb3VudCB1c2VycyB0byBhc3N1bWUgdGhpcyByb2xlIGluIG9yZGVyIHRvIGFkbWluIHRoZSBjbHVzdGVyXG4gICAgY29uc3QgbWFzdGVyc1JvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ0FkbWluUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50Um9vdFByaW5jaXBhbCgpLFxuICAgIH0pO1xuXG4gICAgLy8ganVzdCBuZWVkIG9uZSBuYXQgZ2F0ZXdheSB0byBzaW1wbGlmeSB0aGUgdGVzdFxuICAgIHRoaXMudnBjID0gbmV3IGVjMi5WcGModGhpcywgJ1ZwYycsIHsgbmF0R2F0ZXdheXM6IDEsIHJlc3RyaWN0RGVmYXVsdFNlY3VyaXR5R3JvdXA6IGZhbHNlIH0pO1xuXG4gICAgLy8gY3JlYXRlIHRoZSBjbHVzdGVyIHdpdGggYSBkZWZhdWx0IG5vZGVncm91cCBjYXBhY2l0eVxuICAgIHRoaXMuY2x1c3RlciA9IG5ldyBla3MuQ2x1c3Rlcih0aGlzLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYzogdGhpcy52cGMsXG4gICAgICBtYXN0ZXJzUm9sZSxcbiAgICAgIHZlcnNpb246IGVrcy5LdWJlcm5ldGVzVmVyc2lvbi5WMV8zMyxcbiAgICAgIGt1YmVjdGxQcm92aWRlck9wdGlvbnM6IHtcbiAgICAgICAga3ViZWN0bExheWVyOiBuZXcgS3ViZWN0bFYzM0xheWVyKHRoaXMsICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmFzc2VydEhlbG1DaGFydEFzc2V0KCk7XG4gIH1cblxuICBwcml2YXRlIGFzc2VydEhlbG1DaGFydEFzc2V0KCkge1xuICAgIC8vIGdldCBoZWxtIGNoYXJ0IGZyb20gQXNzZXRcbiAgICBjb25zdCBjaGFydEFzc2V0ID0gbmV3IEFzc2V0KHRoaXMsICdDaGFydEFzc2V0Jywge1xuICAgICAgcGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJ3Rlc3QtY2hhcnQnKSxcbiAgICB9KTtcbiAgICB0aGlzLmNsdXN0ZXIuYWRkSGVsbUNoYXJ0KCd0ZXN0LWNoYXJ0Jywge1xuICAgICAgY2hhcnRBc3NldDogY2hhcnRBc3NldCxcbiAgICB9KTtcblxuICAgIC8vIGh0dHBzOi8vZ2FsbGVyeS5lY3IuYXdzL2F3cy1jb250cm9sbGVycy1rOHMvczMtY2hhcnRcbiAgICB0aGlzLmNsdXN0ZXIuYWRkSGVsbUNoYXJ0KCd0ZXN0LW9jaS1jaGFydCcsIHtcbiAgICAgIGNoYXJ0OiAnczMtY2hhcnQnLFxuICAgICAgcmVsZWFzZTogJ3MzLWNoYXJ0JyxcbiAgICAgIHJlcG9zaXRvcnk6ICdvY2k6Ly9wdWJsaWMuZWNyLmF3cy9hd3MtY29udHJvbGxlcnMtazhzL3MzLWNoYXJ0JyxcbiAgICAgIHZlcnNpb246ICd2MC4xLjAnLFxuICAgICAgbmFtZXNwYWNlOiAnYWNrLXN5c3RlbScsXG4gICAgICBjcmVhdGVOYW1lc3BhY2U6IHRydWUsXG4gICAgICB2YWx1ZXM6IHsgYXdzOiB7IHJlZ2lvbjogdGhpcy5yZWdpb24gfSB9LFxuICAgIH0pO1xuXG4gICAgLy8gaHR0cHM6Ly9nYWxsZXJ5LmVjci5hd3MvYXdzLWNvbnRyb2xsZXJzLWs4cy9sYW1iZGEtY2hhcnRcbiAgICB0aGlzLmNsdXN0ZXIuYWRkSGVsbUNoYXJ0KCd0ZXN0LW9jaS1jaGFydC1kaWZmZXJlbnQtcmVsZWFzZS1uYW1lJywge1xuICAgICAgY2hhcnQ6ICdsYW1iZGEtY2hhcnQnLFxuICAgICAgcmVsZWFzZTogJ2xhbWJkYS1jaGFydC1yZWxlYXNlJyxcbiAgICAgIHJlcG9zaXRvcnk6ICdvY2k6Ly9wdWJsaWMuZWNyLmF3cy9hd3MtY29udHJvbGxlcnMtazhzL2xhbWJkYS1jaGFydCcsXG4gICAgICB2ZXJzaW9uOiAndjAuMS40JyxcbiAgICAgIG5hbWVzcGFjZTogJ2Fjay1zeXN0ZW0nLFxuICAgICAgY3JlYXRlTmFtZXNwYWNlOiB0cnVlLFxuICAgICAgdmFsdWVzOiB7IGF3czogeyByZWdpb246IHRoaXMucmVnaW9uIH0gfSxcbiAgICB9KTtcblxuICAgIC8vIHRlc3RpbmcgdGhlIGRpc2FibGUgbWVjaGFuaXNtIG9mIHRoZSBpbnN0YWxsYXRpb24gb2YgQ1JEc1xuICAgIC8vIGh0dHBzOi8vZ2FsbGVyeS5lY3IuYXdzL2F3cy1jb250cm9sbGVycy1rOHMvcmRzLWNoYXJ0XG4gICAgY29uc3QgcmRzQ2hhcnQgPSB0aGlzLmNsdXN0ZXIuYWRkSGVsbUNoYXJ0KCd0ZXN0LXNraXAtY3JkLWluc3RhbGxhdGlvbicsIHtcbiAgICAgIGNoYXJ0OiAncmRzLWNoYXJ0JyxcbiAgICAgIHJlbGVhc2U6ICdyZHMtY2hhcnQtcmVsZWFzZScsXG4gICAgICByZXBvc2l0b3J5OiAnb2NpOi8vcHVibGljLmVjci5hd3MvYXdzLWNvbnRyb2xsZXJzLWs4cy9yZHMtY2hhcnQnLFxuICAgICAgdmVyc2lvbjogJzEuNC4xJyxcbiAgICAgIG5hbWVzcGFjZTogJ2Fjay1zeXN0ZW0nLFxuICAgICAgY3JlYXRlTmFtZXNwYWNlOiB0cnVlLFxuICAgICAgc2tpcENyZHM6IHRydWUsXG4gICAgICB2YWx1ZXM6IHsgYXdzOiB7IHJlZ2lvbjogdGhpcy5yZWdpb24gfSB9LFxuICAgIH0pO1xuXG4gICAgLy8gdGVzdGluZyBpbnN0YWxsYXRpb24gd2l0aCBhdG9taWMgZmxhZyBzZXQgdG8gdHJ1ZVxuICAgIC8vIGh0dHBzOi8vZ2FsbGVyeS5lY3IuYXdzL2F3cy1jb250cm9sbGVycy1rOHMvc25zLWNoYXJ0XG4gICAgLy8gdGhpcyBzZXJ2aWNlIGFjY291bnQgaGFzIHRvIGJlIGNyZWF0ZWQgaW4gYGFjay1zeXN0ZW1gXG4gICAgLy8gd2UgbmVlZCB0byBlbnN1cmUgdGhhdCB0aGUgbmFtZXNwYWNlIGlzIGNyZWF0ZWQgYmVmb3JlIHRoZSBzZXJ2aWNlIGFjY291bnRcbiAgICBjb25zdCBzYSA9IHRoaXMuY2x1c3Rlci5hZGRTZXJ2aWNlQWNjb3VudCgnZWMyLWNvbnRyb2xsZXItc2EnLCB7XG4gICAgICBuYW1lc3BhY2U6ICdhY2stc3lzdGVtJyxcbiAgICB9KTtcblxuICAgIC8vIHJkc0NoYXJ0IHNob3VsZCBjcmVhdGUgdGhlIG5hbWVzcGFjZSBgYWNrLXN5c3RlbWAgaWYgbm90IGF2YWlsYWJsZVxuICAgIC8vIGFkZGluZyB0aGUgZGVwZW5kZW5jeSBlbnN1cmVzIHRoYXQgdGhlIG5hbWVzcGFjZSBpcyBjcmVhdGVkIGJlZm9yZSB0aGUgc2VydmljZSBhY2NvdW50XG4gICAgc2Eubm9kZS5hZGREZXBlbmRlbmN5KHJkc0NoYXJ0KTtcblxuICAgIHNhLnJvbGUuYWRkTWFuYWdlZFBvbGljeShpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0FtYXpvbkVDMkZ1bGxBY2Nlc3MnKSk7XG5cbiAgICB0aGlzLmNsdXN0ZXIuYWRkSGVsbUNoYXJ0KCd0ZXN0LWF0b21pYy1pbnN0YWxsYXRpb24nLCB7XG4gICAgICBjaGFydDogJ2VjMi1jaGFydCcsXG4gICAgICByZWxlYXNlOiAnZWMyLWNoYXJ0LXJlbGVhc2UnLFxuICAgICAgcmVwb3NpdG9yeTogJ29jaTovL3B1YmxpYy5lY3IuYXdzL2F3cy1jb250cm9sbGVycy1rOHMvZWMyLWNoYXJ0JyxcbiAgICAgIHZlcnNpb246ICcxLjIuMTMnLFxuICAgICAgbmFtZXNwYWNlOiAnYWNrLXN5c3RlbScsXG4gICAgICBjcmVhdGVOYW1lc3BhY2U6IHRydWUsXG4gICAgICBza2lwQ3JkczogdHJ1ZSxcbiAgICAgIGF0b21pYzogdHJ1ZSxcbiAgICAgIHZhbHVlczoge1xuICAgICAgICBhd3M6IHsgcmVnaW9uOiB0aGlzLnJlZ2lvbiB9LFxuICAgICAgICBzZXJ2aWNlQWNjb3VudDoge1xuICAgICAgICAgIG5hbWU6IHNhLnNlcnZpY2VBY2NvdW50TmFtZSxcbiAgICAgICAgICBjcmVhdGU6IGZhbHNlLFxuICAgICAgICAgIGFubm90YXRpb25zOiB7XG4gICAgICAgICAgICAvLyBpbXBsaWNpdCBkZXBlbmRlbmN5IG9uIHRoZSBzZXJ2aWNlIGFjY291bnRcbiAgICAgICAgICAgICdla3MuYW1hem9uYXdzLmNvbS9yb2xlLWFybic6IHNhLnJvbGUucm9sZUFybixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9vcmdzL2dyYWZhbmEtb3BlcmF0b3IvcGFja2FnZXMvY29udGFpbmVyL3BhY2thZ2UvaGVsbS1jaGFydHMlMkZncmFmYW5hLW9wZXJhdG9yXG4gICAgdGhpcy5jbHVzdGVyLmFkZEhlbG1DaGFydCgndGVzdC1ub24tZWNyLW9jaS1jaGFydCcsIHtcbiAgICAgIGNoYXJ0OiAnZ3JhZmFuYS1vcGVyYXRvcicsXG4gICAgICByZWxlYXNlOiAnZ3JhZmFuYS1vcGVyYXRvci1yZWxlYXNlJyxcbiAgICAgIHJlcG9zaXRvcnk6ICdvY2k6Ly9naGNyLmlvL2dyYWZhbmEtb3BlcmF0b3IvaGVsbS1jaGFydHMvZ3JhZmFuYS1vcGVyYXRvcicsXG4gICAgICB2ZXJzaW9uOiAndjUuMC4wLXJjMScsXG4gICAgICBuYW1lc3BhY2U6ICdhY2stc3lzdGVtJyxcbiAgICAgIGNyZWF0ZU5hbWVzcGFjZTogdHJ1ZSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgcG9zdENsaUNvbnRleHQ6IHtcbiAgICAnQGF3cy1jZGsvYXdzLWxhbWJkYTpjcmVhdGVOZXdQb2xpY2llc1dpdGhBZGRUb1JvbGVQb2xpY3knOiB0cnVlLFxuICAgICdAYXdzLWNkay9hd3MtbGFtYmRhOnVzZUNka01hbmFnZWRMb2dHcm91cCc6IGZhbHNlLFxuICB9LFxufSk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IEVrc0NsdXN0ZXJTdGFjayhhcHAsICdhd3MtY2RrLWVrcy1oZWxtLXRlc3QnKTtcbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnYXdzLWNkay1la3MtaGVsbScsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxuICAvLyBUZXN0IGluY2x1ZGVzIGFzc2V0cyB0aGF0IGFyZSB1cGRhdGVkIHdlZWtseS4gSWYgbm90IGRpc2FibGVkLCB0aGUgdXBncmFkZSBQUiB3aWxsIGZhaWwuXG4gIGRpZmZBc3NldHM6IGZhbHNlLFxufSk7XG4iXX0=