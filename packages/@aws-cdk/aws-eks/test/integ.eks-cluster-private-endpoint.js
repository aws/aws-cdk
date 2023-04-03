"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const integ = require("@aws-cdk/integ-tests");
const integ_tests_kubernetes_version_1 = require("./integ-tests-kubernetes-version");
const eks = require("../lib");
class EksClusterStack extends core_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        // allow all account users to assume this role in order to admin the cluster
        const mastersRole = new iam.Role(this, 'AdminRole', {
            assumedBy: new iam.AccountRootPrincipal(),
        });
        // just need one nat gateway to simplify the test
        const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 3, natGateways: 1 });
        const cluster = new eks.Cluster(this, 'Cluster', {
            vpc,
            mastersRole,
            defaultCapacity: 2,
            ...integ_tests_kubernetes_version_1.getClusterVersionConfig(this),
            endpointAccess: eks.EndpointAccess.PRIVATE,
            prune: false,
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
const app = new core_1.App();
const stack = new EksClusterStack(app, 'aws-cdk-eks-cluster-private-endpoint-test');
new integ.IntegTest(app, 'aws-cdk-eks-cluster-private-endpoint', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLWNsdXN0ZXItcHJpdmF0ZS1lbmRwb2ludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmVrcy1jbHVzdGVyLXByaXZhdGUtZW5kcG9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBNkM7QUFDN0Msd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4Qyx3Q0FBMkM7QUFDM0MsOENBQThDO0FBQzlDLHFGQUEyRTtBQUMzRSw4QkFBOEI7QUFFOUIsTUFBTSxlQUFnQixTQUFRLFlBQUs7SUFDakMsWUFBWSxLQUFVLEVBQUUsRUFBVTtRQUNoQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLDRFQUE0RTtRQUM1RSxNQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUNsRCxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsb0JBQW9CLEVBQUU7U0FDMUMsQ0FBQyxDQUFDO1FBRUgsaURBQWlEO1FBQ2pELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVwRSxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUMvQyxHQUFHO1lBQ0gsV0FBVztZQUNYLGVBQWUsRUFBRSxDQUFDO1lBQ2xCLEdBQUcsd0RBQXVCLENBQUMsSUFBSSxDQUFDO1lBQ2hDLGNBQWMsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLE9BQU87WUFDMUMsS0FBSyxFQUFFLEtBQUs7U0FDYixDQUFDLENBQUM7UUFFSCxxRkFBcUY7UUFDckYsT0FBTyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUU7WUFDaEMsSUFBSSxFQUFFLFdBQVc7WUFDakIsVUFBVSxFQUFFLElBQUk7WUFDaEIsSUFBSSxFQUFFO2dCQUNKLEtBQUssRUFBRSxPQUFPO2FBQ2Y7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLFlBQVk7YUFDbkI7U0FDRixDQUFDLENBQUM7S0FFSjtDQUNGO0FBR0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUV0QixNQUFNLEtBQUssR0FBRyxJQUFJLGVBQWUsQ0FBQyxHQUFHLEVBQUUsMkNBQTJDLENBQUMsQ0FBQztBQUNwRixJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLHNDQUFzQyxFQUFFO0lBQy9ELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gIWNkay1pbnRlZyBwcmFnbWE6ZGlzYWJsZS11cGRhdGUtd29ya2Zsb3dcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IEFwcCwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzJztcbmltcG9ydCB7IGdldENsdXN0ZXJWZXJzaW9uQ29uZmlnIH0gZnJvbSAnLi9pbnRlZy10ZXN0cy1rdWJlcm5ldGVzLXZlcnNpb24nO1xuaW1wb3J0ICogYXMgZWtzIGZyb20gJy4uL2xpYic7XG5cbmNsYXNzIEVrc0NsdXN0ZXJTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IEFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAvLyBhbGxvdyBhbGwgYWNjb3VudCB1c2VycyB0byBhc3N1bWUgdGhpcyByb2xlIGluIG9yZGVyIHRvIGFkbWluIHRoZSBjbHVzdGVyXG4gICAgY29uc3QgbWFzdGVyc1JvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ0FkbWluUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50Um9vdFByaW5jaXBhbCgpLFxuICAgIH0pO1xuXG4gICAgLy8ganVzdCBuZWVkIG9uZSBuYXQgZ2F0ZXdheSB0byBzaW1wbGlmeSB0aGUgdGVzdFxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWcGMnLCB7IG1heEF6czogMywgbmF0R2F0ZXdheXM6IDEgfSk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHRoaXMsICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgbWFzdGVyc1JvbGUsXG4gICAgICBkZWZhdWx0Q2FwYWNpdHk6IDIsXG4gICAgICAuLi5nZXRDbHVzdGVyVmVyc2lvbkNvbmZpZyh0aGlzKSxcbiAgICAgIGVuZHBvaW50QWNjZXNzOiBla3MuRW5kcG9pbnRBY2Nlc3MuUFJJVkFURSxcbiAgICAgIHBydW5lOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIC8vIHRoaXMgaXMgdGhlIHZhbGRpYXRpb24uIGl0IHdvbid0IHdvcmsgaWYgdGhlIHByaXZhdGUgYWNjZXNzIGlzIG5vdCBzZXR1cCBwcm9wZXJseS5cbiAgICBjbHVzdGVyLmFkZE1hbmlmZXN0KCdjb25maWctbWFwJywge1xuICAgICAga2luZDogJ0NvbmZpZ01hcCcsXG4gICAgICBhcGlWZXJzaW9uOiAndjEnLFxuICAgICAgZGF0YToge1xuICAgICAgICBoZWxsbzogJ3dvcmxkJyxcbiAgICAgIH0sXG4gICAgICBtZXRhZGF0YToge1xuICAgICAgICBuYW1lOiAnY29uZmlnLW1hcCcsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gIH1cbn1cblxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IEVrc0NsdXN0ZXJTdGFjayhhcHAsICdhd3MtY2RrLWVrcy1jbHVzdGVyLXByaXZhdGUtZW5kcG9pbnQtdGVzdCcpO1xubmV3IGludGVnLkludGVnVGVzdChhcHAsICdhd3MtY2RrLWVrcy1jbHVzdGVyLXByaXZhdGUtZW5kcG9pbnQnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==