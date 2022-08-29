"use strict";
/// !cdk-integ * pragma:enable-lookups
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
const env = {
    region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
};
class VpcStack extends core_1.Stack {
    constructor(scope, id) {
        super(scope, id, { env });
        this.vpc = new ec2.Vpc(this, 'vpc', { maxAzs: 2 });
    }
}
class ClusterStack extends core_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, { env });
        /// !show
        // define the cluster. kubectl is enabled by default.
        this.cluster = new lib_1.Cluster(this, 'cluster22', {
            vpc: props.vpc,
            defaultCapacity: 0,
        });
        // define an IAM role assumable by anyone in the account and map it to the k8s
        // `system:masters` group this is required if you want to be able to issue
        // manual `kubectl` commands against the cluster.
        const mastersRole = new iam.Role(this, 'AdminRole', { assumedBy: new iam.AccountRootPrincipal() });
        this.cluster.awsAuth.addMastersRole(mastersRole);
        // add some capacity to the cluster. The IAM instance role will
        // automatically be mapped via aws-auth to allow nodes to join the cluster.
        this.cluster.addCapacity('Nodes', {
            instanceType: new ec2.InstanceType('t2.medium'),
            desiredCapacity: 3,
        });
        // add two Helm charts to the cluster. This will be the Kubernetes dashboard and the Nginx Ingress Controller
        this.cluster.addChart('dashboard', { chart: 'kubernetes-dashboard', repository: 'https://kubernetes-charts.storage.googleapis.com' });
        this.cluster.addChart('nginx-ingress', { chart: 'nginx-ingress', repository: 'https://helm.nginx.com/stable', namespace: 'kube-system' });
    }
}
const app = new core_1.App();
const vpcStack = new VpcStack(app, 'k8s-vpc');
new ClusterStack(app, 'k8s-cluster', { vpc: vpcStack.vpc });
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLWhlbG0ubGl0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZWtzLWhlbG0ubGl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxzQ0FBc0M7O0FBRXRDLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsd0NBQTJDO0FBRTNDLGdDQUFpQztBQUVqQyxNQUFNLEdBQUcsR0FBRztJQUNWLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCO0lBQ3RFLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CO0NBQzFFLENBQUM7QUFFRixNQUFNLFFBQVMsU0FBUSxZQUFLO0lBRzFCLFlBQVksS0FBZ0IsRUFBRSxFQUFVO1FBQ3RDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUMxQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDcEQ7Q0FDRjtBQUVELE1BQU0sWUFBYSxTQUFRLFlBQUs7SUFHOUIsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF1QjtRQUMvRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFFMUIsU0FBUztRQUNULHFEQUFxRDtRQUNyRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksYUFBTyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDNUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsZUFBZSxFQUFFLENBQUM7U0FDbkIsQ0FBQyxDQUFDO1FBRUgsOEVBQThFO1FBQzlFLDBFQUEwRTtRQUMxRSxpREFBaUQ7UUFDakQsTUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbkcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRWpELCtEQUErRDtRQUMvRCwyRUFBMkU7UUFDM0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFO1lBQ2hDLFlBQVksRUFBRSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDO1lBQy9DLGVBQWUsRUFBRSxDQUFDO1NBQ25CLENBQUMsQ0FBQztRQUVILDZHQUE2RztRQUM3RyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsRUFBRSxLQUFLLEVBQUUsc0JBQXNCLEVBQUUsVUFBVSxFQUFFLGtEQUFrRCxFQUFFLENBQUMsQ0FBQztRQUN0SSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFLFVBQVUsRUFBRSwrQkFBK0IsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztLQUUzSTtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDOUMsSUFBSSxZQUFZLENBQUMsR0FBRyxFQUFFLGFBQWEsRUFBRSxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUM1RCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gIWNkay1pbnRlZyAqIHByYWdtYTplbmFibGUtbG9va3Vwc1xuXG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENsdXN0ZXIgfSBmcm9tICcuLi9saWInO1xuXG5jb25zdCBlbnYgPSB7XG4gIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQ0RLX0lOVEVHX1JFR0lPTiB8fCBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9SRUdJT04sXG4gIGFjY291bnQ6IHByb2Nlc3MuZW52LkNES19JTlRFR19BQ0NPVU5UIHx8IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX0FDQ09VTlQsXG59O1xuXG5jbGFzcyBWcGNTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgcHVibGljIHJlYWRvbmx5IHZwYzogZWMyLlZwYztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7IGVudiB9KTtcbiAgICB0aGlzLnZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICd2cGMnLCB7IG1heEF6czogMiB9KTtcbiAgfVxufVxuXG5jbGFzcyBDbHVzdGVyU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIHB1YmxpYyByZWFkb25seSBjbHVzdGVyOiBDbHVzdGVyO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiB7IHZwYzogZWMyLlZwYyB9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7IGVudiB9KTtcblxuICAgIC8vLyAhc2hvd1xuICAgIC8vIGRlZmluZSB0aGUgY2x1c3Rlci4ga3ViZWN0bCBpcyBlbmFibGVkIGJ5IGRlZmF1bHQuXG4gICAgdGhpcy5jbHVzdGVyID0gbmV3IENsdXN0ZXIodGhpcywgJ2NsdXN0ZXIyMicsIHtcbiAgICAgIHZwYzogcHJvcHMudnBjLFxuICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgIH0pO1xuXG4gICAgLy8gZGVmaW5lIGFuIElBTSByb2xlIGFzc3VtYWJsZSBieSBhbnlvbmUgaW4gdGhlIGFjY291bnQgYW5kIG1hcCBpdCB0byB0aGUgazhzXG4gICAgLy8gYHN5c3RlbTptYXN0ZXJzYCBncm91cCB0aGlzIGlzIHJlcXVpcmVkIGlmIHlvdSB3YW50IHRvIGJlIGFibGUgdG8gaXNzdWVcbiAgICAvLyBtYW51YWwgYGt1YmVjdGxgIGNvbW1hbmRzIGFnYWluc3QgdGhlIGNsdXN0ZXIuXG4gICAgY29uc3QgbWFzdGVyc1JvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ0FkbWluUm9sZScsIHsgYXNzdW1lZEJ5OiBuZXcgaWFtLkFjY291bnRSb290UHJpbmNpcGFsKCkgfSk7XG4gICAgdGhpcy5jbHVzdGVyLmF3c0F1dGguYWRkTWFzdGVyc1JvbGUobWFzdGVyc1JvbGUpO1xuXG4gICAgLy8gYWRkIHNvbWUgY2FwYWNpdHkgdG8gdGhlIGNsdXN0ZXIuIFRoZSBJQU0gaW5zdGFuY2Ugcm9sZSB3aWxsXG4gICAgLy8gYXV0b21hdGljYWxseSBiZSBtYXBwZWQgdmlhIGF3cy1hdXRoIHRvIGFsbG93IG5vZGVzIHRvIGpvaW4gdGhlIGNsdXN0ZXIuXG4gICAgdGhpcy5jbHVzdGVyLmFkZENhcGFjaXR5KCdOb2RlcycsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1lZGl1bScpLFxuICAgICAgZGVzaXJlZENhcGFjaXR5OiAzLFxuICAgIH0pO1xuXG4gICAgLy8gYWRkIHR3byBIZWxtIGNoYXJ0cyB0byB0aGUgY2x1c3Rlci4gVGhpcyB3aWxsIGJlIHRoZSBLdWJlcm5ldGVzIGRhc2hib2FyZCBhbmQgdGhlIE5naW54IEluZ3Jlc3MgQ29udHJvbGxlclxuICAgIHRoaXMuY2x1c3Rlci5hZGRDaGFydCgnZGFzaGJvYXJkJywgeyBjaGFydDogJ2t1YmVybmV0ZXMtZGFzaGJvYXJkJywgcmVwb3NpdG9yeTogJ2h0dHBzOi8va3ViZXJuZXRlcy1jaGFydHMuc3RvcmFnZS5nb29nbGVhcGlzLmNvbScgfSk7XG4gICAgdGhpcy5jbHVzdGVyLmFkZENoYXJ0KCduZ2lueC1pbmdyZXNzJywgeyBjaGFydDogJ25naW54LWluZ3Jlc3MnLCByZXBvc2l0b3J5OiAnaHR0cHM6Ly9oZWxtLm5naW54LmNvbS9zdGFibGUnLCBuYW1lc3BhY2U6ICdrdWJlLXN5c3RlbScgfSk7XG4gICAgLy8vICFoaWRlXG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuY29uc3QgdnBjU3RhY2sgPSBuZXcgVnBjU3RhY2soYXBwLCAnazhzLXZwYycpO1xubmV3IENsdXN0ZXJTdGFjayhhcHAsICdrOHMtY2x1c3RlcicsIHsgdnBjOiB2cGNTdGFjay52cGMgfSk7XG5hcHAuc3ludGgoKTtcbiJdfQ==