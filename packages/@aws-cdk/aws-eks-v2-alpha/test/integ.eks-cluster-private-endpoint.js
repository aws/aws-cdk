"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const integ = require("@aws-cdk/integ-tests-alpha");
const lambda_layer_kubectl_v33_1 = require("@aws-cdk/lambda-layer-kubectl-v33");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
const eks = require("../lib");
class EksClusterStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        // allow all account users to assume this role in order to admin the cluster
        const mastersRole = new iam.Role(this, 'AdminRole', {
            assumedBy: new iam.AccountRootPrincipal(),
        });
        // just need one nat gateway to simplify the test
        const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 3, natGateways: 1, restrictDefaultSecurityGroup: false });
        const cluster = new eks.Cluster(this, 'Cluster', {
            vpc,
            mastersRole,
            endpointAccess: eks.EndpointAccess.PRIVATE,
            version: eks.KubernetesVersion.V1_33,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(this, 'kubectlLayer'),
            },
        });
        // this is the valdiation. it won't work if the private access is not setup properly.
        cluster.addManifest('config-map', {
            kind: 'ConfigMap',
            apiVersion: 'v1',
            data: {
                hello: 'world',
            },
            metadata: {
                name: 'config-map',
            },
        });
    }
}
const app = new aws_cdk_lib_1.App({
    postCliContext: {
        '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
        '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    },
});
const stack = new EksClusterStack(app, 'aws-cdk-eks-cluster-private-endpoint-test');
new integ.IntegTest(app, 'aws-cdk-eks-cluster-private-endpoint', {
    testCases: [stack],
    // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
    diffAssets: false,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLWNsdXN0ZXItcHJpdmF0ZS1lbmRwb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmVrcy1jbHVzdGVyLXByaXZhdGUtZW5kcG9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBNkM7QUFDN0Msb0RBQW9EO0FBQ3BELGdGQUFvRTtBQUNwRSw2Q0FBeUM7QUFDekMsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyw4QkFBOEI7QUFFOUIsTUFBTSxlQUFnQixTQUFRLG1CQUFLO0lBQ2pDLFlBQVksS0FBVSxFQUFFLEVBQVU7UUFDaEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQiw0RUFBNEU7UUFDNUUsTUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDbEQsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLG9CQUFvQixFQUFFO1NBQzFDLENBQUMsQ0FBQztRQUVILGlEQUFpRDtRQUNqRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSw0QkFBNEIsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBRXpHLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQy9DLEdBQUc7WUFDSCxXQUFXO1lBQ1gsY0FBYyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsT0FBTztZQUMxQyxPQUFPLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUs7WUFDcEMsc0JBQXNCLEVBQUU7Z0JBQ3RCLFlBQVksRUFBRSxJQUFJLDBDQUFlLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQzthQUN4RDtTQUNGLENBQUMsQ0FBQztRQUVILHFGQUFxRjtRQUNyRixPQUFPLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRTtZQUNoQyxJQUFJLEVBQUUsV0FBVztZQUNqQixVQUFVLEVBQUUsSUFBSTtZQUNoQixJQUFJLEVBQUU7Z0JBQ0osS0FBSyxFQUFFLE9BQU87YUFDZjtZQUNELFFBQVEsRUFBRTtnQkFDUixJQUFJLEVBQUUsWUFBWTthQUNuQjtTQUNGLENBQUMsQ0FBQztLQUNKO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLENBQUM7SUFDbEIsY0FBYyxFQUFFO1FBQ2QsMERBQTBELEVBQUUsSUFBSTtRQUNoRSwyQ0FBMkMsRUFBRSxLQUFLO0tBQ25EO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsTUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFlLENBQUMsR0FBRyxFQUFFLDJDQUEyQyxDQUFDLENBQUM7QUFDcEYsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxzQ0FBc0MsRUFBRTtJQUMvRCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7SUFDbEIsMkZBQTJGO0lBQzNGLFVBQVUsRUFBRSxLQUFLO0NBQ2xCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyAhY2RrLWludGVnIHByYWdtYTpkaXNhYmxlLXVwZGF0ZS13b3JrZmxvd1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgS3ViZWN0bFYzM0xheWVyIH0gZnJvbSAnQGF3cy1jZGsvbGFtYmRhLWxheWVyLWt1YmVjdGwtdjMzJztcbmltcG9ydCB7IEFwcCwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBla3MgZnJvbSAnLi4vbGliJztcblxuY2xhc3MgRWtzQ2x1c3RlclN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQXBwLCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIC8vIGFsbG93IGFsbCBhY2NvdW50IHVzZXJzIHRvIGFzc3VtZSB0aGlzIHJvbGUgaW4gb3JkZXIgdG8gYWRtaW4gdGhlIGNsdXN0ZXJcbiAgICBjb25zdCBtYXN0ZXJzUm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnQWRtaW5Sb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkFjY291bnRSb290UHJpbmNpcGFsKCksXG4gICAgfSk7XG5cbiAgICAvLyBqdXN0IG5lZWQgb25lIG5hdCBnYXRld2F5IHRvIHNpbXBsaWZ5IHRoZSB0ZXN0XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgJ1ZwYycsIHsgbWF4QXpzOiAzLCBuYXRHYXRld2F5czogMSwgcmVzdHJpY3REZWZhdWx0U2VjdXJpdHlHcm91cDogZmFsc2UgfSk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHRoaXMsICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgbWFzdGVyc1JvbGUsXG4gICAgICBlbmRwb2ludEFjY2VzczogZWtzLkVuZHBvaW50QWNjZXNzLlBSSVZBVEUsXG4gICAgICB2ZXJzaW9uOiBla3MuS3ViZXJuZXRlc1ZlcnNpb24uVjFfMzMsXG4gICAgICBrdWJlY3RsUHJvdmlkZXJPcHRpb25zOiB7XG4gICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzNMYXllcih0aGlzLCAna3ViZWN0bExheWVyJyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gdGhpcyBpcyB0aGUgdmFsZGlhdGlvbi4gaXQgd29uJ3Qgd29yayBpZiB0aGUgcHJpdmF0ZSBhY2Nlc3MgaXMgbm90IHNldHVwIHByb3Blcmx5LlxuICAgIGNsdXN0ZXIuYWRkTWFuaWZlc3QoJ2NvbmZpZy1tYXAnLCB7XG4gICAgICBraW5kOiAnQ29uZmlnTWFwJyxcbiAgICAgIGFwaVZlcnNpb246ICd2MScsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGhlbGxvOiAnd29ybGQnLFxuICAgICAgfSxcbiAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgIG5hbWU6ICdjb25maWctbWFwJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gIHBvc3RDbGlDb250ZXh0OiB7XG4gICAgJ0Bhd3MtY2RrL2F3cy1sYW1iZGE6Y3JlYXRlTmV3UG9saWNpZXNXaXRoQWRkVG9Sb2xlUG9saWN5JzogdHJ1ZSxcbiAgICAnQGF3cy1jZGsvYXdzLWxhbWJkYTp1c2VDZGtNYW5hZ2VkTG9nR3JvdXAnOiBmYWxzZSxcbiAgfSxcbn0pO1xuXG5jb25zdCBzdGFjayA9IG5ldyBFa3NDbHVzdGVyU3RhY2soYXBwLCAnYXdzLWNkay1la3MtY2x1c3Rlci1wcml2YXRlLWVuZHBvaW50LXRlc3QnKTtcbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnYXdzLWNkay1la3MtY2x1c3Rlci1wcml2YXRlLWVuZHBvaW50Jywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG4gIC8vIFRlc3QgaW5jbHVkZXMgYXNzZXRzIHRoYXQgYXJlIHVwZGF0ZWQgd2Vla2x5LiBJZiBub3QgZGlzYWJsZWQsIHRoZSB1cGdyYWRlIFBSIHdpbGwgZmFpbC5cbiAgZGlmZkFzc2V0czogZmFsc2UsXG59KTtcbiJdfQ==