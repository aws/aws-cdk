"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const path = require("path");
const integ = require("@aws-cdk/integ-tests-alpha");
const lambda_layer_kubectl_v32_1 = require("@aws-cdk/lambda-layer-kubectl-v32");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_s3_assets_1 = require("aws-cdk-lib/aws-s3-assets");
const cx_api_1 = require("aws-cdk-lib/cx-api");
const cdk8s = require("cdk8s");
const kplus = require("cdk8s-plus-27");
const hello = require("./hello-k8s");
const eks = require("../lib");
class EksClusterStack extends aws_cdk_lib_1.Stack {
    cluster;
    importedCluster;
    vpc;
    constructor(scope, id, props) {
        super(scope, id, props);
        // just need one nat gateway to simplify the test
        this.vpc = new aws_cdk_lib_1.aws_ec2.Vpc(this, 'Vpc', { maxAzs: 3, natGateways: 1, restrictDefaultSecurityGroup: false });
        // create a eks admin role that allows restricted principles to assume
        const mastersRole = new aws_cdk_lib_1.aws_iam.Role(this, 'EksAdminRole', {
            roleName: `eksAdminrole-${aws_cdk_lib_1.Stack.of(this).stackName}`,
            /**
             * Specify your principal arn below so you are allowed to assume this role and run kubectl to verify cluster status.
             * For this integ testing we simply use AccountRootPrincipal, which should be avoided in production.
             */
            assumedBy: new aws_cdk_lib_1.aws_iam.AccountRootPrincipal(),
        });
        // create the cluster with a default nodegroup capacity
        this.cluster = new eks.Cluster(this, 'Cluster', {
            vpc: this.vpc,
            defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
            defaultCapacity: 2,
            version: eks.KubernetesVersion.V1_32,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v32_1.KubectlV32Layer(this, 'kubectlLayer'),
            },
            mastersRole,
        });
        const mainStack = this.cluster.stack.node.findChild('Cluster');
        const kubectlProvider = mainStack.node.findChild('KubectlProvider');
        const crProvider = kubectlProvider.node.tryFindChild('Provider');
        // import the kubectl provider
        const importedKubectlProvider = eks.KubectlProvider.fromKubectlProviderAttributes(this, 'KubectlProvider', {
            serviceToken: crProvider.serviceToken,
            role: kubectlProvider.role,
        });
        this.importedCluster = eks.Cluster.fromClusterAttributes(this, 'ImportedCluster', {
            clusterName: this.cluster.clusterName,
            openIdConnectProvider: this.cluster.openIdConnectProvider,
            vpc: this.vpc,
            kubectlProvider: importedKubectlProvider,
        });
        this.assertSimpleManifest();
        this.assertManifestWithoutValidation();
        this.assertSimpleHelmChart();
        this.assertHelmChartAsset();
        this.assertSimpleCdk8sChart();
        this.assertCreateNamespace();
        this.assertServiceAccount();
        this.assertExtendedServiceAccount();
        // EKS service role
        new aws_cdk_lib_1.CfnOutput(this, 'ClusterRole', { value: this.cluster.role.roleArn });
        // EKS masters role(this role will be added in system:masters)
        new aws_cdk_lib_1.CfnOutput(this, 'EksMastersRoleOutput', { value: mastersRole.roleArn });
    }
    assertServiceAccount() {
        // add a service account connected to a IAM role
        this.importedCluster.addServiceAccount('MyServiceAccount', {
            name: 'sa',
        });
    }
    assertExtendedServiceAccount() {
        // add a service account connected to a IAM role
        this.importedCluster.addServiceAccount('MyExtendedServiceAccount', {
            name: 'ext-sa',
            annotations: {
                'eks.amazonaws.com/sts-regional-endpoints': 'false',
            },
            labels: {
                'some-label': 'with-some-value',
            },
        });
    }
    assertCreateNamespace() {
        // deploy an nginx ingress in a namespace
        const nginxNamespace = this.importedCluster.addManifest('nginx-namespace', {
            apiVersion: 'v1',
            kind: 'Namespace',
            metadata: {
                name: 'nginx',
            },
        });
        const nginxIngress = this.importedCluster.addHelmChart('nginx-ingress', {
            chart: 'nginx-ingress',
            repository: 'https://helm.nginx.com/stable',
            namespace: 'nginx',
            wait: true,
            release: 'nginx-ingress',
            // https://github.com/nginxinc/helm-charts/tree/master/stable
            version: '0.17.1',
            values: {
                controller: {
                    service: {
                        create: false,
                    },
                },
            },
            createNamespace: false,
            timeout: aws_cdk_lib_1.Duration.minutes(15),
        });
        // make sure namespace is deployed before the chart
        nginxIngress.node.addDependency(nginxNamespace);
    }
    assertSimpleCdk8sChart() {
        class Chart extends cdk8s.Chart {
            constructor(scope, ns, cluster) {
                super(scope, ns);
                new kplus.ConfigMap(this, 'config-map', {
                    data: {
                        clusterName: cluster.clusterName,
                    },
                });
            }
        }
        const app = new cdk8s.App();
        const chart = new Chart(app, 'Chart', this.importedCluster);
        this.importedCluster.addCdk8sChart('cdk8s-chart', chart);
    }
    assertSimpleHelmChart() {
        // deploy the Kubernetes dashboard through a helm chart
        this.importedCluster.addHelmChart('dashboard', {
            chart: 'kubernetes-dashboard',
            // https://artifacthub.io/packages/helm/k8s-dashboard/kubernetes-dashboard
            version: '6.0.8',
            repository: 'https://kubernetes.github.io/dashboard/',
        });
    }
    assertHelmChartAsset() {
        // get helm chart from Asset
        const chartAsset = new aws_s3_assets_1.Asset(this, 'ChartAsset', {
            path: path.join(__dirname, 'test-chart'),
        });
        this.importedCluster.addHelmChart('test-chart', {
            chartAsset: chartAsset,
        });
    }
    assertSimpleManifest() {
        // apply a kubernetes manifest
        this.importedCluster.addManifest('HelloApp', ...hello.resources);
    }
    assertManifestWithoutValidation() {
        // apply a kubernetes manifest
        new eks.KubernetesManifest(this, 'HelloAppWithoutValidation', {
            cluster: this.importedCluster,
            manifest: [{
                    apiVersion: 'v1',
                    kind: 'ConfigMap',
                    data: { hello: 'world' },
                    metadata: { name: 'config-map' },
                    unknown: { key: 'value' },
                }],
            skipValidation: true,
        });
    }
}
const app = new aws_cdk_lib_1.App({
    postCliContext: {
        [cx_api_1.IAM_OIDC_REJECT_UNAUTHORIZED_CONNECTIONS]: false,
        '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
        '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    },
});
const stack = new EksClusterStack(app, 'aws-cdk-eks-import-cluster-test');
new integ.IntegTest(app, 'aws-cdk-eks-import-cluster', {
    testCases: [stack],
    // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
    diffAssets: false,
    cdkCommandOptions: {
        deploy: {
            args: {
                rollback: true,
            },
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLWNsdXN0ZXItaW1wb3J0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5la3MtY2x1c3Rlci1pbXBvcnRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUE2QztBQUM3Qyw2QkFBNkI7QUFDN0Isb0RBQW9EO0FBQ3BELGdGQUFvRTtBQUNwRSw2Q0FLcUI7QUFDckIsNkRBQWtEO0FBQ2xELCtDQUE4RTtBQUM5RSwrQkFBK0I7QUFDL0IsdUNBQXVDO0FBRXZDLHFDQUFxQztBQUNyQyw4QkFBOEI7QUFFOUIsTUFBTSxlQUFnQixTQUFRLG1CQUFLO0lBQ3pCLE9BQU8sQ0FBYztJQUNyQixlQUFlLENBQWU7SUFDOUIsR0FBRyxDQUFXO0lBRXRCLFlBQVksS0FBVSxFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUNwRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixpREFBaUQ7UUFDakQsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLHFCQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsNEJBQTRCLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUV4RyxzRUFBc0U7UUFDdEUsTUFBTSxXQUFXLEdBQUcsSUFBSSxxQkFBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3JELFFBQVEsRUFBRSxnQkFBZ0IsbUJBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFO1lBQ3BEOzs7ZUFHRztZQUNILFNBQVMsRUFBRSxJQUFJLHFCQUFHLENBQUMsb0JBQW9CLEVBQUU7U0FDMUMsQ0FBQyxDQUFDO1FBRUgsdURBQXVEO1FBQ3ZELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxT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QixDQUFDO1lBQ0YsY0FBYyxFQUFFLElBQUk7U0FDckIsQ0FBQyxDQUFDO0tBQ0o7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsQ0FBQztJQUNsQixjQUFjLEVBQUU7UUFDZCxDQUFDLGlEQUF3QyxDQUFDLEVBQUUsS0FBSztRQUNqRCwwREFBMEQsRUFBRSxJQUFJO1FBQ2hFLDJDQUEyQyxFQUFFLEtBQUs7S0FDbkQ7Q0FDRixDQUFDLENBQUM7QUFDSCxNQUFNLEtBQUssR0FBRyxJQUFJLGVBQWUsQ0FBQyxHQUFHLEVBQUUsaUNBQWlDLENBQUMsQ0FBQztBQUUxRSxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLDRCQUE0QixFQUFFO0lBQ3JELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztJQUNsQiwyRkFBMkY7SUFDM0YsVUFBVSxFQUFFLEtBQUs7SUFDakIsaUJBQWlCLEVBQUU7UUFDakIsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFO2dCQUNKLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vICFjZGstaW50ZWcgcHJhZ21hOmRpc2FibGUtdXBkYXRlLXdvcmtmbG93XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgS3ViZWN0bFYzMkxheWVyIH0gZnJvbSAnQGF3cy1jZGsvbGFtYmRhLWxheWVyLWt1YmVjdGwtdjMyJztcbmltcG9ydCB7XG4gIEFwcCwgQ2ZuT3V0cHV0LCBTdGFjaywgU3RhY2tQcm9wcywgRHVyYXRpb24sXG4gIGN1c3RvbV9yZXNvdXJjZXMgYXMgY3IsXG4gIGF3c19pYW0gYXMgaWFtLFxuICBhd3NfZWMyIGFzIGVjMixcbn0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQXNzZXQgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMtYXNzZXRzJztcbmltcG9ydCB7IElBTV9PSURDX1JFSkVDVF9VTkFVVEhPUklaRURfQ09OTkVDVElPTlMgfSBmcm9tICdhd3MtY2RrLWxpYi9jeC1hcGknO1xuaW1wb3J0ICogYXMgY2RrOHMgZnJvbSAnY2RrOHMnO1xuaW1wb3J0ICogYXMga3BsdXMgZnJvbSAnY2RrOHMtcGx1cy0yNyc7XG5pbXBvcnQgKiBhcyBjb25zdHJ1Y3RzIGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgaGVsbG8gZnJvbSAnLi9oZWxsby1rOHMnO1xuaW1wb3J0ICogYXMgZWtzIGZyb20gJy4uL2xpYic7XG5cbmNsYXNzIEVrc0NsdXN0ZXJTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgcHJpdmF0ZSBjbHVzdGVyOiBla3MuQ2x1c3RlcjtcbiAgcHJpdmF0ZSBpbXBvcnRlZENsdXN0ZXI6IGVrcy5JQ2x1c3RlcjtcbiAgcHJpdmF0ZSB2cGM6IGVjMi5JVnBjO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8ganVzdCBuZWVkIG9uZSBuYXQgZ2F0ZXdheSB0byBzaW1wbGlmeSB0aGUgdGVzdFxuICAgIHRoaXMudnBjID0gbmV3IGVjMi5WcGModGhpcywgJ1ZwYycsIHsgbWF4QXpzOiAzLCBuYXRHYXRld2F5czogMSwgcmVzdHJpY3REZWZhdWx0U2VjdXJpdHlHcm91cDogZmFsc2UgfSk7XG5cbiAgICAvLyBjcmVhdGUgYSBla3MgYWRtaW4gcm9sZSB0aGF0IGFsbG93cyByZXN0cmljdGVkIHByaW5jaXBsZXMgdG8gYXNzdW1lXG4gICAgY29uc3QgbWFzdGVyc1JvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ0Vrc0FkbWluUm9sZScsIHtcbiAgICAgIHJvbGVOYW1lOiBgZWtzQWRtaW5yb2xlLSR7U3RhY2sub2YodGhpcykuc3RhY2tOYW1lfWAsXG4gICAgICAvKipcbiAgICAgICAqIFNwZWNpZnkgeW91ciBwcmluY2lwYWwgYXJuIGJlbG93IHNvIHlvdSBhcmUgYWxsb3dlZCB0byBhc3N1bWUgdGhpcyByb2xlIGFuZCBydW4ga3ViZWN0bCB0byB2ZXJpZnkgY2x1c3RlciBzdGF0dXMuXG4gICAgICAgKiBGb3IgdGhpcyBpbnRlZyB0ZXN0aW5nIHdlIHNpbXBseSB1c2UgQWNjb3VudFJvb3RQcmluY2lwYWwsIHdoaWNoIHNob3VsZCBiZSBhdm9pZGVkIGluIHByb2R1Y3Rpb24uXG4gICAgICAgKi9cbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50Um9vdFByaW5jaXBhbCgpLFxuICAgIH0pO1xuXG4gICAgLy8gY3JlYXRlIHRoZSBjbHVzdGVyIHdpdGggYSBkZWZhdWx0IG5vZGVncm91cCBjYXBhY2l0eVxuICAgIHRoaXMuY2x1c3RlciA9IG5ldyBla3MuQ2x1c3Rlcih0aGlzLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYzogdGhpcy52cGMsXG4gICAgICBkZWZhdWx0Q2FwYWNpdHlUeXBlOiBla3MuRGVmYXVsdENhcGFjaXR5VHlwZS5OT0RFR1JPVVAsXG4gICAgICBkZWZhdWx0Q2FwYWNpdHk6IDIsXG4gICAgICB2ZXJzaW9uOiBla3MuS3ViZXJuZXRlc1ZlcnNpb24uVjFfMzIsXG4gICAgICBrdWJlY3RsUHJvdmlkZXJPcHRpb25zOiB7XG4gICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzJMYXllcih0aGlzLCAna3ViZWN0bExheWVyJyksXG4gICAgICB9LFxuICAgICAgbWFzdGVyc1JvbGUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBtYWluU3RhY2sgPSB0aGlzLmNsdXN0ZXIuc3RhY2subm9kZS5maW5kQ2hpbGQoJ0NsdXN0ZXInKSBhcyBla3MuQ2x1c3RlcjtcblxuICAgIGNvbnN0IGt1YmVjdGxQcm92aWRlciA9IG1haW5TdGFjay5ub2RlLmZpbmRDaGlsZCgnS3ViZWN0bFByb3ZpZGVyJykgYXMgZWtzLkt1YmVjdGxQcm92aWRlcjtcblxuICAgIGNvbnN0IGNyUHJvdmlkZXIgPSBrdWJlY3RsUHJvdmlkZXIubm9kZS50cnlGaW5kQ2hpbGQoJ1Byb3ZpZGVyJykgYXMgY3IuUHJvdmlkZXI7XG5cbiAgICAvLyBpbXBvcnQgdGhlIGt1YmVjdGwgcHJvdmlkZXJcbiAgICBjb25zdCBpbXBvcnRlZEt1YmVjdGxQcm92aWRlciA9IGVrcy5LdWJlY3RsUHJvdmlkZXIuZnJvbUt1YmVjdGxQcm92aWRlckF0dHJpYnV0ZXModGhpcywgJ0t1YmVjdGxQcm92aWRlcicsIHtcbiAgICAgIHNlcnZpY2VUb2tlbjogY3JQcm92aWRlci5zZXJ2aWNlVG9rZW4sXG4gICAgICByb2xlOiBrdWJlY3RsUHJvdmlkZXIucm9sZSxcbiAgICB9KTtcblxuICAgIHRoaXMuaW1wb3J0ZWRDbHVzdGVyID0gZWtzLkNsdXN0ZXIuZnJvbUNsdXN0ZXJBdHRyaWJ1dGVzKHRoaXMsICdJbXBvcnRlZENsdXN0ZXInLCB7XG4gICAgICBjbHVzdGVyTmFtZTogdGhpcy5jbHVzdGVyLmNsdXN0ZXJOYW1lLFxuICAgICAgb3BlbklkQ29ubmVjdFByb3ZpZGVyOiB0aGlzLmNsdXN0ZXIub3BlbklkQ29ubmVjdFByb3ZpZGVyLFxuICAgICAgdnBjOiB0aGlzLnZwYyxcbiAgICAgIGt1YmVjdGxQcm92aWRlcjogaW1wb3J0ZWRLdWJlY3RsUHJvdmlkZXIsXG4gICAgfSk7XG5cbiAgICB0aGlzLmFzc2VydFNpbXBsZU1hbmlmZXN0KCk7XG5cbiAgICB0aGlzLmFzc2VydE1hbmlmZXN0V2l0aG91dFZhbGlkYXRpb24oKTtcblxuICAgIHRoaXMuYXNzZXJ0U2ltcGxlSGVsbUNoYXJ0KCk7XG5cbiAgICB0aGlzLmFzc2VydEhlbG1DaGFydEFzc2V0KCk7XG5cbiAgICB0aGlzLmFzc2VydFNpbXBsZUNkazhzQ2hhcnQoKTtcblxuICAgIHRoaXMuYXNzZXJ0Q3JlYXRlTmFtZXNwYWNlKCk7XG5cbiAgICB0aGlzLmFzc2VydFNlcnZpY2VBY2NvdW50KCk7XG5cbiAgICB0aGlzLmFzc2VydEV4dGVuZGVkU2VydmljZUFjY291bnQoKTtcblxuICAgIC8vIEVLUyBzZXJ2aWNlIHJvbGVcbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdDbHVzdGVyUm9sZScsIHsgdmFsdWU6IHRoaXMuY2x1c3Rlci5yb2xlLnJvbGVBcm4gfSk7XG4gICAgLy8gRUtTIG1hc3RlcnMgcm9sZSh0aGlzIHJvbGUgd2lsbCBiZSBhZGRlZCBpbiBzeXN0ZW06bWFzdGVycylcbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdFa3NNYXN0ZXJzUm9sZU91dHB1dCcsIHsgdmFsdWU6IG1hc3RlcnNSb2xlLnJvbGVBcm4gfSk7XG4gIH1cblxuICBwcml2YXRlIGFzc2VydFNlcnZpY2VBY2NvdW50KCkge1xuICAgIC8vIGFkZCBhIHNlcnZpY2UgYWNjb3VudCBjb25uZWN0ZWQgdG8gYSBJQU0gcm9sZVxuICAgIHRoaXMuaW1wb3J0ZWRDbHVzdGVyLmFkZFNlcnZpY2VBY2NvdW50KCdNeVNlcnZpY2VBY2NvdW50Jywge1xuICAgICAgbmFtZTogJ3NhJyxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYXNzZXJ0RXh0ZW5kZWRTZXJ2aWNlQWNjb3VudCgpIHtcbiAgICAvLyBhZGQgYSBzZXJ2aWNlIGFjY291bnQgY29ubmVjdGVkIHRvIGEgSUFNIHJvbGVcbiAgICB0aGlzLmltcG9ydGVkQ2x1c3Rlci5hZGRTZXJ2aWNlQWNjb3VudCgnTXlFeHRlbmRlZFNlcnZpY2VBY2NvdW50Jywge1xuICAgICAgbmFtZTogJ2V4dC1zYScsXG4gICAgICBhbm5vdGF0aW9uczoge1xuICAgICAgICAnZWtzLmFtYXpvbmF3cy5jb20vc3RzLXJlZ2lvbmFsLWVuZHBvaW50cyc6ICdmYWxzZScsXG4gICAgICB9LFxuICAgICAgbGFiZWxzOiB7XG4gICAgICAgICdzb21lLWxhYmVsJzogJ3dpdGgtc29tZS12YWx1ZScsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3NlcnRDcmVhdGVOYW1lc3BhY2UoKSB7XG4gICAgLy8gZGVwbG95IGFuIG5naW54IGluZ3Jlc3MgaW4gYSBuYW1lc3BhY2VcbiAgICBjb25zdCBuZ2lueE5hbWVzcGFjZSA9IHRoaXMuaW1wb3J0ZWRDbHVzdGVyLmFkZE1hbmlmZXN0KCduZ2lueC1uYW1lc3BhY2UnLCB7XG4gICAgICBhcGlWZXJzaW9uOiAndjEnLFxuICAgICAga2luZDogJ05hbWVzcGFjZScsXG4gICAgICBtZXRhZGF0YToge1xuICAgICAgICBuYW1lOiAnbmdpbngnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IG5naW54SW5ncmVzcyA9IHRoaXMuaW1wb3J0ZWRDbHVzdGVyLmFkZEhlbG1DaGFydCgnbmdpbngtaW5ncmVzcycsIHtcbiAgICAgIGNoYXJ0OiAnbmdpbngtaW5ncmVzcycsXG4gICAgICByZXBvc2l0b3J5OiAnaHR0cHM6Ly9oZWxtLm5naW54LmNvbS9zdGFibGUnLFxuICAgICAgbmFtZXNwYWNlOiAnbmdpbngnLFxuICAgICAgd2FpdDogdHJ1ZSxcbiAgICAgIHJlbGVhc2U6ICduZ2lueC1pbmdyZXNzJyxcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9uZ2lueGluYy9oZWxtLWNoYXJ0cy90cmVlL21hc3Rlci9zdGFibGVcbiAgICAgIHZlcnNpb246ICcwLjE3LjEnLFxuICAgICAgdmFsdWVzOiB7XG4gICAgICAgIGNvbnRyb2xsZXI6IHtcbiAgICAgICAgICBzZXJ2aWNlOiB7XG4gICAgICAgICAgICBjcmVhdGU6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgY3JlYXRlTmFtZXNwYWNlOiBmYWxzZSxcbiAgICAgIHRpbWVvdXQ6IER1cmF0aW9uLm1pbnV0ZXMoMTUpLFxuICAgIH0pO1xuXG4gICAgLy8gbWFrZSBzdXJlIG5hbWVzcGFjZSBpcyBkZXBsb3llZCBiZWZvcmUgdGhlIGNoYXJ0XG4gICAgbmdpbnhJbmdyZXNzLm5vZGUuYWRkRGVwZW5kZW5jeShuZ2lueE5hbWVzcGFjZSk7XG4gIH1cblxuICBwcml2YXRlIGFzc2VydFNpbXBsZUNkazhzQ2hhcnQoKSB7XG4gICAgY2xhc3MgQ2hhcnQgZXh0ZW5kcyBjZGs4cy5DaGFydCB7XG4gICAgICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIG5zOiBzdHJpbmcsIGNsdXN0ZXI6IGVrcy5JQ2x1c3Rlcikge1xuICAgICAgICBzdXBlcihzY29wZSwgbnMpO1xuXG4gICAgICAgIG5ldyBrcGx1cy5Db25maWdNYXAodGhpcywgJ2NvbmZpZy1tYXAnLCB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgY2x1c3Rlck5hbWU6IGNsdXN0ZXIuY2x1c3Rlck5hbWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGs4cy5BcHAoKTtcbiAgICBjb25zdCBjaGFydCA9IG5ldyBDaGFydChhcHAsICdDaGFydCcsIHRoaXMuaW1wb3J0ZWRDbHVzdGVyKTtcblxuICAgIHRoaXMuaW1wb3J0ZWRDbHVzdGVyLmFkZENkazhzQ2hhcnQoJ2NkazhzLWNoYXJ0JywgY2hhcnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3NlcnRTaW1wbGVIZWxtQ2hhcnQoKSB7XG4gICAgLy8gZGVwbG95IHRoZSBLdWJlcm5ldGVzIGRhc2hib2FyZCB0aHJvdWdoIGEgaGVsbSBjaGFydFxuICAgIHRoaXMuaW1wb3J0ZWRDbHVzdGVyLmFkZEhlbG1DaGFydCgnZGFzaGJvYXJkJywge1xuICAgICAgY2hhcnQ6ICdrdWJlcm5ldGVzLWRhc2hib2FyZCcsXG4gICAgICAvLyBodHRwczovL2FydGlmYWN0aHViLmlvL3BhY2thZ2VzL2hlbG0vazhzLWRhc2hib2FyZC9rdWJlcm5ldGVzLWRhc2hib2FyZFxuICAgICAgdmVyc2lvbjogJzYuMC44JyxcbiAgICAgIHJlcG9zaXRvcnk6ICdodHRwczovL2t1YmVybmV0ZXMuZ2l0aHViLmlvL2Rhc2hib2FyZC8nLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3NlcnRIZWxtQ2hhcnRBc3NldCgpIHtcbiAgICAvLyBnZXQgaGVsbSBjaGFydCBmcm9tIEFzc2V0XG4gICAgY29uc3QgY2hhcnRBc3NldCA9IG5ldyBBc3NldCh0aGlzLCAnQ2hhcnRBc3NldCcsIHtcbiAgICAgIHBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICd0ZXN0LWNoYXJ0JyksXG4gICAgfSk7XG4gICAgdGhpcy5pbXBvcnRlZENsdXN0ZXIuYWRkSGVsbUNoYXJ0KCd0ZXN0LWNoYXJ0Jywge1xuICAgICAgY2hhcnRBc3NldDogY2hhcnRBc3NldCxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYXNzZXJ0U2ltcGxlTWFuaWZlc3QoKSB7XG4gICAgLy8gYXBwbHkgYSBrdWJlcm5ldGVzIG1hbmlmZXN0XG4gICAgdGhpcy5pbXBvcnRlZENsdXN0ZXIuYWRkTWFuaWZlc3QoJ0hlbGxvQXBwJywgLi4uaGVsbG8ucmVzb3VyY2VzKTtcbiAgfVxuXG4gIHByaXZhdGUgYXNzZXJ0TWFuaWZlc3RXaXRob3V0VmFsaWRhdGlvbigpIHtcbiAgICAvLyBhcHBseSBhIGt1YmVybmV0ZXMgbWFuaWZlc3RcbiAgICBuZXcgZWtzLkt1YmVybmV0ZXNNYW5pZmVzdCh0aGlzLCAnSGVsbG9BcHBXaXRob3V0VmFsaWRhdGlvbicsIHtcbiAgICAgIGNsdXN0ZXI6IHRoaXMuaW1wb3J0ZWRDbHVzdGVyLFxuICAgICAgbWFuaWZlc3Q6IFt7XG4gICAgICAgIGFwaVZlcnNpb246ICd2MScsXG4gICAgICAgIGtpbmQ6ICdDb25maWdNYXAnLFxuICAgICAgICBkYXRhOiB7IGhlbGxvOiAnd29ybGQnIH0sXG4gICAgICAgIG1ldGFkYXRhOiB7IG5hbWU6ICdjb25maWctbWFwJyB9LFxuICAgICAgICB1bmtub3duOiB7IGtleTogJ3ZhbHVlJyB9LFxuICAgICAgfV0sXG4gICAgICBza2lwVmFsaWRhdGlvbjogdHJ1ZSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgcG9zdENsaUNvbnRleHQ6IHtcbiAgICBbSUFNX09JRENfUkVKRUNUX1VOQVVUSE9SSVpFRF9DT05ORUNUSU9OU106IGZhbHNlLFxuICAgICdAYXdzLWNkay9hd3MtbGFtYmRhOmNyZWF0ZU5ld1BvbGljaWVzV2l0aEFkZFRvUm9sZVBvbGljeSc6IHRydWUsXG4gICAgJ0Bhd3MtY2RrL2F3cy1sYW1iZGE6dXNlQ2RrTWFuYWdlZExvZ0dyb3VwJzogZmFsc2UsXG4gIH0sXG59KTtcbmNvbnN0IHN0YWNrID0gbmV3IEVrc0NsdXN0ZXJTdGFjayhhcHAsICdhd3MtY2RrLWVrcy1pbXBvcnQtY2x1c3Rlci10ZXN0Jyk7XG5cbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnYXdzLWNkay1la3MtaW1wb3J0LWNsdXN0ZXInLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbiAgLy8gVGVzdCBpbmNsdWRlcyBhc3NldHMgdGhhdCBhcmUgdXBkYXRlZCB3ZWVrbHkuIElmIG5vdCBkaXNhYmxlZCwgdGhlIHVwZ3JhZGUgUFIgd2lsbCBmYWlsLlxuICBkaWZmQXNzZXRzOiBmYWxzZSxcbiAgY2RrQ29tbWFuZE9wdGlvbnM6IHtcbiAgICBkZXBsb3k6IHtcbiAgICAgIGFyZ3M6IHtcbiAgICAgICAgcm9sbGJhY2s6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiJdfQ==