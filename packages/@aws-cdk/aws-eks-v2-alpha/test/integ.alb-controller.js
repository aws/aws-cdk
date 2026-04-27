"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const integ = require("@aws-cdk/integ-tests-alpha");
const lambda_layer_kubectl_v33_1 = require("@aws-cdk/lambda-layer-kubectl-v33");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const cx_api_1 = require("aws-cdk-lib/cx-api");
const cdk8s = require("cdk8s");
const kplus = require("cdk8s-plus-27");
const eks = require("../lib");
const pinger_1 = require("./pinger/pinger");
const LATEST_VERSION = eks.AlbControllerVersion.V2_8_2;
class EksClusterAlbControllerStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        // just need one nat gateway to simplify the test
        const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });
        const cluster = new eks.Cluster(this, 'Cluster', {
            vpc,
            version: eks.KubernetesVersion.V1_33,
            albController: {
                version: LATEST_VERSION,
            },
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(this, 'kubectlLayer'),
            },
        });
        const chart = new cdk8s.Chart(new cdk8s.App(), 'hello-server');
        const ingress = new kplus.Deployment(chart, 'Deployment', {
            containers: [{
                    image: 'hashicorp/http-echo',
                    args: ['-text', 'hello'],
                    port: 5678,
                    securityContext: {
                        user: 1005,
                    },
                }],
        })
            .exposeViaService({ serviceType: kplus.ServiceType.NODE_PORT })
            .exposeViaIngress('/');
        // allow vpc to access the ELB so our pinger can hit it.
        ingress.metadata.addAnnotation('alb.ingress.kubernetes.io/inbound-cidrs', cluster.vpc.vpcCidrBlock);
        const echoServer = cluster.addCdk8sChart('echo-server', chart, { ingressAlb: true, ingressAlbScheme: eks.AlbScheme.INTERNAL });
        // the deletion of `echoServer` is what instructs the controller to delete the ELB.
        // so we need to make sure this happens before the controller is deleted.
        echoServer.node.addDependency(cluster.albController ?? []);
        const loadBalancerAddress = cluster.getIngressLoadBalancerAddress(ingress.name, { timeout: aws_cdk_lib_1.Duration.minutes(10) });
        // create a resource that hits the load balancer to make sure
        // everything is wired properly.
        const pinger = new pinger_1.Pinger(this, 'IngressPinger', {
            url: `http://${loadBalancerAddress}`,
            vpc: cluster.vpc,
        });
        // the pinger must wait for the ingress and echoServer to be deployed.
        pinger.node.addDependency(ingress, echoServer);
        // this should display the 'hello' text we gave to the server
        new aws_cdk_lib_1.CfnOutput(this, 'IngressPingerResponse', {
            value: pinger.response,
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
const stack = new EksClusterAlbControllerStack(app, 'aws-cdk-eks-cluster-alb-controller');
new integ.IntegTest(app, 'aws-cdk-cluster-alb-controller-integ', {
    testCases: [stack],
    // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
    diffAssets: false,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYWxiLWNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5hbGItY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUE2QztBQUM3QyxvREFBb0Q7QUFDcEQsZ0ZBQW9FO0FBQ3BFLDZDQUE4RDtBQUM5RCwyQ0FBMkM7QUFDM0MsK0NBQThFO0FBQzlFLCtCQUErQjtBQUMvQix1Q0FBdUM7QUFDdkMsOEJBQThCO0FBQzlCLDRDQUF5QztBQUV6QyxNQUFNLGNBQWMsR0FBNkIsR0FBRyxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQztBQUNqRixNQUFNLDRCQUE2QixTQUFRLG1CQUFLO0lBQzlDLFlBQVksS0FBVSxFQUFFLEVBQVU7UUFDaEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixpREFBaUQ7UUFDakQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsNEJBQTRCLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUV6RyxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUMvQyxHQUFHO1lBQ0gsT0FBTyxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLO1lBQ3BDLGFBQWEsRUFBRTtnQkFDYixPQUFPLEVBQUUsY0FBYzthQUN4QjtZQUNELHNCQUFzQixFQUFFO2dCQUN0QixZQUFZLEVBQUUsSUFBSSwwQ0FBZSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUM7YUFDeEQ7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFFL0QsTUFBTSxPQUFPLEdBQUcsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7WUFDeEQsVUFBVSxFQUFFLENBQUM7b0JBQ1gsS0FBSyxFQUFFLHFCQUFxQjtvQkFDNUIsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQztvQkFDeEIsSUFBSSxFQUFFLElBQUk7b0JBQ1YsZUFBZSxFQUFFO3dCQUNmLElBQUksRUFBRSxJQUFJO3FCQUNYO2lCQUNGLENBQUM7U0FDSCxDQUFDO2FBQ0MsZ0JBQWdCLENBQUMsRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzthQUM5RCxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV6Qix3REFBd0Q7UUFDeEQsT0FBTyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMseUNBQXlDLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVwRyxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUUvSCxtRkFBbUY7UUFDbkYseUVBQXlFO1FBQ3pFLFVBQVUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxhQUFhLElBQUksRUFBRSxDQUFDLENBQUM7UUFFM0QsTUFBTSxtQkFBbUIsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFbkgsNkRBQTZEO1FBQzdELGdDQUFnQztRQUNoQyxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQy9DLEdBQUcsRUFBRSxVQUFVLG1CQUFtQixFQUFFO1lBQ3BDLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRztTQUNqQixDQUFDLENBQUM7UUFFSCxzRUFBc0U7UUFDdEUsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRS9DLDZEQUE2RDtRQUM3RCxJQUFJLHVCQUFTLENBQUMsSUFBSSxFQUFFLHVCQUF1QixFQUFFO1lBQzNDLEtBQUssRUFBRSxNQUFNLENBQUMsUUFBUTtTQUN2QixDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxDQUFDO0lBQ2xCLGNBQWMsRUFBRTtRQUNkLENBQUMsaURBQXdDLENBQUMsRUFBRSxLQUFLO1FBQ2pELDBEQUEwRCxFQUFFLElBQUk7UUFDaEUsMkNBQTJDLEVBQUUsS0FBSztLQUNuRDtDQUNGLENBQUMsQ0FBQztBQUNILE1BQU0sS0FBSyxHQUFHLElBQUksNEJBQTRCLENBQUMsR0FBRyxFQUFFLG9DQUFvQyxDQUFDLENBQUM7QUFDMUYsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxzQ0FBc0MsRUFBRTtJQUMvRCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7SUFDbEIsMkZBQTJGO0lBQzNGLFVBQVUsRUFBRSxLQUFLO0NBQ2xCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyAhY2RrLWludGVnIHByYWdtYTpkaXNhYmxlLXVwZGF0ZS13b3JrZmxvd1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgS3ViZWN0bFYzM0xheWVyIH0gZnJvbSAnQGF3cy1jZGsvbGFtYmRhLWxheWVyLWt1YmVjdGwtdjMzJztcbmltcG9ydCB7IEFwcCwgQ2ZuT3V0cHV0LCBEdXJhdGlvbiwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgeyBJQU1fT0lEQ19SRUpFQ1RfVU5BVVRIT1JJWkVEX0NPTk5FQ1RJT05TIH0gZnJvbSAnYXdzLWNkay1saWIvY3gtYXBpJztcbmltcG9ydCAqIGFzIGNkazhzIGZyb20gJ2NkazhzJztcbmltcG9ydCAqIGFzIGtwbHVzIGZyb20gJ2NkazhzLXBsdXMtMjcnO1xuaW1wb3J0ICogYXMgZWtzIGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBQaW5nZXIgfSBmcm9tICcuL3Bpbmdlci9waW5nZXInO1xuXG5jb25zdCBMQVRFU1RfVkVSU0lPTjogZWtzLkFsYkNvbnRyb2xsZXJWZXJzaW9uID0gZWtzLkFsYkNvbnRyb2xsZXJWZXJzaW9uLlYyXzhfMjtcbmNsYXNzIEVrc0NsdXN0ZXJBbGJDb250cm9sbGVyU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8ganVzdCBuZWVkIG9uZSBuYXQgZ2F0ZXdheSB0byBzaW1wbGlmeSB0aGUgdGVzdFxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWcGMnLCB7IG1heEF6czogMiwgbmF0R2F0ZXdheXM6IDEsIHJlc3RyaWN0RGVmYXVsdFNlY3VyaXR5R3JvdXA6IGZhbHNlIH0pO1xuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3Rlcih0aGlzLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIHZlcnNpb246IGVrcy5LdWJlcm5ldGVzVmVyc2lvbi5WMV8zMyxcbiAgICAgIGFsYkNvbnRyb2xsZXI6IHtcbiAgICAgICAgdmVyc2lvbjogTEFURVNUX1ZFUlNJT04sXG4gICAgICB9LFxuICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICBrdWJlY3RsTGF5ZXI6IG5ldyBLdWJlY3RsVjMzTGF5ZXIodGhpcywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGNoYXJ0ID0gbmV3IGNkazhzLkNoYXJ0KG5ldyBjZGs4cy5BcHAoKSwgJ2hlbGxvLXNlcnZlcicpO1xuXG4gICAgY29uc3QgaW5ncmVzcyA9IG5ldyBrcGx1cy5EZXBsb3ltZW50KGNoYXJ0LCAnRGVwbG95bWVudCcsIHtcbiAgICAgIGNvbnRhaW5lcnM6IFt7XG4gICAgICAgIGltYWdlOiAnaGFzaGljb3JwL2h0dHAtZWNobycsXG4gICAgICAgIGFyZ3M6IFsnLXRleHQnLCAnaGVsbG8nXSxcbiAgICAgICAgcG9ydDogNTY3OCxcbiAgICAgICAgc2VjdXJpdHlDb250ZXh0OiB7XG4gICAgICAgICAgdXNlcjogMTAwNSxcbiAgICAgICAgfSxcbiAgICAgIH1dLFxuICAgIH0pXG4gICAgICAuZXhwb3NlVmlhU2VydmljZSh7IHNlcnZpY2VUeXBlOiBrcGx1cy5TZXJ2aWNlVHlwZS5OT0RFX1BPUlQgfSlcbiAgICAgIC5leHBvc2VWaWFJbmdyZXNzKCcvJyk7XG5cbiAgICAvLyBhbGxvdyB2cGMgdG8gYWNjZXNzIHRoZSBFTEIgc28gb3VyIHBpbmdlciBjYW4gaGl0IGl0LlxuICAgIGluZ3Jlc3MubWV0YWRhdGEuYWRkQW5ub3RhdGlvbignYWxiLmluZ3Jlc3Mua3ViZXJuZXRlcy5pby9pbmJvdW5kLWNpZHJzJywgY2x1c3Rlci52cGMudnBjQ2lkckJsb2NrKTtcblxuICAgIGNvbnN0IGVjaG9TZXJ2ZXIgPSBjbHVzdGVyLmFkZENkazhzQ2hhcnQoJ2VjaG8tc2VydmVyJywgY2hhcnQsIHsgaW5ncmVzc0FsYjogdHJ1ZSwgaW5ncmVzc0FsYlNjaGVtZTogZWtzLkFsYlNjaGVtZS5JTlRFUk5BTCB9KTtcblxuICAgIC8vIHRoZSBkZWxldGlvbiBvZiBgZWNob1NlcnZlcmAgaXMgd2hhdCBpbnN0cnVjdHMgdGhlIGNvbnRyb2xsZXIgdG8gZGVsZXRlIHRoZSBFTEIuXG4gICAgLy8gc28gd2UgbmVlZCB0byBtYWtlIHN1cmUgdGhpcyBoYXBwZW5zIGJlZm9yZSB0aGUgY29udHJvbGxlciBpcyBkZWxldGVkLlxuICAgIGVjaG9TZXJ2ZXIubm9kZS5hZGREZXBlbmRlbmN5KGNsdXN0ZXIuYWxiQ29udHJvbGxlciA/PyBbXSk7XG5cbiAgICBjb25zdCBsb2FkQmFsYW5jZXJBZGRyZXNzID0gY2x1c3Rlci5nZXRJbmdyZXNzTG9hZEJhbGFuY2VyQWRkcmVzcyhpbmdyZXNzLm5hbWUsIHsgdGltZW91dDogRHVyYXRpb24ubWludXRlcygxMCkgfSk7XG5cbiAgICAvLyBjcmVhdGUgYSByZXNvdXJjZSB0aGF0IGhpdHMgdGhlIGxvYWQgYmFsYW5jZXIgdG8gbWFrZSBzdXJlXG4gICAgLy8gZXZlcnl0aGluZyBpcyB3aXJlZCBwcm9wZXJseS5cbiAgICBjb25zdCBwaW5nZXIgPSBuZXcgUGluZ2VyKHRoaXMsICdJbmdyZXNzUGluZ2VyJywge1xuICAgICAgdXJsOiBgaHR0cDovLyR7bG9hZEJhbGFuY2VyQWRkcmVzc31gLFxuICAgICAgdnBjOiBjbHVzdGVyLnZwYyxcbiAgICB9KTtcblxuICAgIC8vIHRoZSBwaW5nZXIgbXVzdCB3YWl0IGZvciB0aGUgaW5ncmVzcyBhbmQgZWNob1NlcnZlciB0byBiZSBkZXBsb3llZC5cbiAgICBwaW5nZXIubm9kZS5hZGREZXBlbmRlbmN5KGluZ3Jlc3MsIGVjaG9TZXJ2ZXIpO1xuXG4gICAgLy8gdGhpcyBzaG91bGQgZGlzcGxheSB0aGUgJ2hlbGxvJyB0ZXh0IHdlIGdhdmUgdG8gdGhlIHNlcnZlclxuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ0luZ3Jlc3NQaW5nZXJSZXNwb25zZScsIHtcbiAgICAgIHZhbHVlOiBwaW5nZXIucmVzcG9uc2UsXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gIHBvc3RDbGlDb250ZXh0OiB7XG4gICAgW0lBTV9PSURDX1JFSkVDVF9VTkFVVEhPUklaRURfQ09OTkVDVElPTlNdOiBmYWxzZSxcbiAgICAnQGF3cy1jZGsvYXdzLWxhbWJkYTpjcmVhdGVOZXdQb2xpY2llc1dpdGhBZGRUb1JvbGVQb2xpY3knOiB0cnVlLFxuICAgICdAYXdzLWNkay9hd3MtbGFtYmRhOnVzZUNka01hbmFnZWRMb2dHcm91cCc6IGZhbHNlLFxuICB9LFxufSk7XG5jb25zdCBzdGFjayA9IG5ldyBFa3NDbHVzdGVyQWxiQ29udHJvbGxlclN0YWNrKGFwcCwgJ2F3cy1jZGstZWtzLWNsdXN0ZXItYWxiLWNvbnRyb2xsZXInKTtcbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnYXdzLWNkay1jbHVzdGVyLWFsYi1jb250cm9sbGVyLWludGVnJywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG4gIC8vIFRlc3QgaW5jbHVkZXMgYXNzZXRzIHRoYXQgYXJlIHVwZGF0ZWQgd2Vla2x5LiBJZiBub3QgZGlzYWJsZWQsIHRoZSB1cGdyYWRlIFBSIHdpbGwgZmFpbC5cbiAgZGlmZkFzc2V0czogZmFsc2UsXG59KTtcbiJdfQ==