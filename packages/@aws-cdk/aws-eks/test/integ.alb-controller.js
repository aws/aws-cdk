"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const ec2 = require("@aws-cdk/aws-ec2");
const core_1 = require("@aws-cdk/core");
const integ = require("@aws-cdk/integ-tests");
const cdk8s = require("cdk8s");
const kplus = require("cdk8s-plus-24");
const integ_tests_kubernetes_version_1 = require("./integ-tests-kubernetes-version");
const pinger_1 = require("./pinger/pinger");
const eks = require("../lib");
class EksClusterAlbControllerStack extends core_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        // just need one nat gateway to simplify the test
        const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1 });
        const cluster = new eks.Cluster(this, 'Cluster', {
            vpc,
            ...integ_tests_kubernetes_version_1.getClusterVersionConfig(this),
            albController: {
                version: eks.AlbControllerVersion.V2_4_1,
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
        const loadBalancerAddress = cluster.getIngressLoadBalancerAddress(ingress.name, { timeout: core_1.Duration.minutes(10) });
        // create a resource that hits the load balancer to make sure
        // everything is wired properly.
        const pinger = new pinger_1.Pinger(this, 'IngressPinger', {
            url: `http://${loadBalancerAddress}`,
            vpc: cluster.vpc,
        });
        // the pinger must wait for the ingress and echoServer to be deployed.
        pinger.node.addDependency(ingress, echoServer);
        // this should display the 'hello' text we gave to the server
        new core_1.CfnOutput(this, 'IngressPingerResponse', {
            value: pinger.response,
        });
    }
}
const app = new core_1.App();
const stack = new EksClusterAlbControllerStack(app, 'aws-cdk-eks-cluster-alb-controller-test');
new integ.IntegTest(app, 'aws-cdk-cluster-alb-controller', {
    testCases: [stack],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYWxiLWNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5hbGItY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUE2QztBQUM3Qyx3Q0FBd0M7QUFDeEMsd0NBQWdFO0FBQ2hFLDhDQUE4QztBQUM5QywrQkFBK0I7QUFDL0IsdUNBQXVDO0FBQ3ZDLHFGQUEyRTtBQUMzRSw0Q0FBeUM7QUFDekMsOEJBQThCO0FBRTlCLE1BQU0sNEJBQTZCLFNBQVEsWUFBSztJQUU5QyxZQUFZLEtBQVUsRUFBRSxFQUFVO1FBQ2hDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsaURBQWlEO1FBQ2pELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVwRSxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUMvQyxHQUFHO1lBQ0gsR0FBRyx3REFBdUIsQ0FBQyxJQUFJLENBQUM7WUFDaEMsYUFBYSxFQUFFO2dCQUNiLE9BQU8sRUFBRSxHQUFHLENBQUMsb0JBQW9CLENBQUMsTUFBTTthQUN6QztTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUUvRCxNQUFNLE9BQU8sR0FBRyxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUN4RCxVQUFVLEVBQUUsQ0FBQztvQkFDWCxLQUFLLEVBQUUscUJBQXFCO29CQUM1QixJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDO29CQUN4QixJQUFJLEVBQUUsSUFBSTtvQkFDVixlQUFlLEVBQUU7d0JBQ2YsSUFBSSxFQUFFLElBQUk7cUJBQ1g7aUJBQ0YsQ0FBQztTQUNILENBQUM7YUFDQyxnQkFBZ0IsQ0FBQyxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO2FBQzlELGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXpCLHdEQUF3RDtRQUN4RCxPQUFPLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyx5Q0FBeUMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRXBHLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBRS9ILG1GQUFtRjtRQUNuRix5RUFBeUU7UUFDekUsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUUzRCxNQUFNLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLGVBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRW5ILDZEQUE2RDtRQUM3RCxnQ0FBZ0M7UUFDaEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUMvQyxHQUFHLEVBQUUsVUFBVSxtQkFBbUIsRUFBRTtZQUNwQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUc7U0FDakIsQ0FBQyxDQUFDO1FBRUgsc0VBQXNFO1FBQ3RFLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztRQUUvQyw2REFBNkQ7UUFDN0QsSUFBSSxnQkFBUyxDQUFDLElBQUksRUFBRSx1QkFBdUIsRUFBRTtZQUMzQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFFBQVE7U0FDdkIsQ0FBQyxDQUFDO0tBRUo7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSw0QkFBNEIsQ0FBQyxHQUFHLEVBQUUseUNBQXlDLENBQUMsQ0FBQztBQUMvRixJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLGdDQUFnQyxFQUFFO0lBQ3pELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUM7QUFDSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gIWNkay1pbnRlZyBwcmFnbWE6ZGlzYWJsZS11cGRhdGUtd29ya2Zsb3dcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCB7IEFwcCwgQ2ZuT3V0cHV0LCBEdXJhdGlvbiwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzJztcbmltcG9ydCAqIGFzIGNkazhzIGZyb20gJ2NkazhzJztcbmltcG9ydCAqIGFzIGtwbHVzIGZyb20gJ2NkazhzLXBsdXMtMjQnO1xuaW1wb3J0IHsgZ2V0Q2x1c3RlclZlcnNpb25Db25maWcgfSBmcm9tICcuL2ludGVnLXRlc3RzLWt1YmVybmV0ZXMtdmVyc2lvbic7XG5pbXBvcnQgeyBQaW5nZXIgfSBmcm9tICcuL3Bpbmdlci9waW5nZXInO1xuaW1wb3J0ICogYXMgZWtzIGZyb20gJy4uL2xpYic7XG5cbmNsYXNzIEVrc0NsdXN0ZXJBbGJDb250cm9sbGVyU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IEFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAvLyBqdXN0IG5lZWQgb25lIG5hdCBnYXRld2F5IHRvIHNpbXBsaWZ5IHRoZSB0ZXN0XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgJ1ZwYycsIHsgbWF4QXpzOiAyLCBuYXRHYXRld2F5czogMSB9KTtcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIodGhpcywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGMsXG4gICAgICAuLi5nZXRDbHVzdGVyVmVyc2lvbkNvbmZpZyh0aGlzKSxcbiAgICAgIGFsYkNvbnRyb2xsZXI6IHtcbiAgICAgICAgdmVyc2lvbjogZWtzLkFsYkNvbnRyb2xsZXJWZXJzaW9uLlYyXzRfMSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBjaGFydCA9IG5ldyBjZGs4cy5DaGFydChuZXcgY2RrOHMuQXBwKCksICdoZWxsby1zZXJ2ZXInKTtcblxuICAgIGNvbnN0IGluZ3Jlc3MgPSBuZXcga3BsdXMuRGVwbG95bWVudChjaGFydCwgJ0RlcGxveW1lbnQnLCB7XG4gICAgICBjb250YWluZXJzOiBbe1xuICAgICAgICBpbWFnZTogJ2hhc2hpY29ycC9odHRwLWVjaG8nLFxuICAgICAgICBhcmdzOiBbJy10ZXh0JywgJ2hlbGxvJ10sXG4gICAgICAgIHBvcnQ6IDU2NzgsXG4gICAgICAgIHNlY3VyaXR5Q29udGV4dDoge1xuICAgICAgICAgIHVzZXI6IDEwMDUsXG4gICAgICAgIH0sXG4gICAgICB9XSxcbiAgICB9KVxuICAgICAgLmV4cG9zZVZpYVNlcnZpY2UoeyBzZXJ2aWNlVHlwZToga3BsdXMuU2VydmljZVR5cGUuTk9ERV9QT1JUIH0pXG4gICAgICAuZXhwb3NlVmlhSW5ncmVzcygnLycpO1xuXG4gICAgLy8gYWxsb3cgdnBjIHRvIGFjY2VzcyB0aGUgRUxCIHNvIG91ciBwaW5nZXIgY2FuIGhpdCBpdC5cbiAgICBpbmdyZXNzLm1ldGFkYXRhLmFkZEFubm90YXRpb24oJ2FsYi5pbmdyZXNzLmt1YmVybmV0ZXMuaW8vaW5ib3VuZC1jaWRycycsIGNsdXN0ZXIudnBjLnZwY0NpZHJCbG9jayk7XG5cbiAgICBjb25zdCBlY2hvU2VydmVyID0gY2x1c3Rlci5hZGRDZGs4c0NoYXJ0KCdlY2hvLXNlcnZlcicsIGNoYXJ0LCB7IGluZ3Jlc3NBbGI6IHRydWUsIGluZ3Jlc3NBbGJTY2hlbWU6IGVrcy5BbGJTY2hlbWUuSU5URVJOQUwgfSk7XG5cbiAgICAvLyB0aGUgZGVsZXRpb24gb2YgYGVjaG9TZXJ2ZXJgIGlzIHdoYXQgaW5zdHJ1Y3RzIHRoZSBjb250cm9sbGVyIHRvIGRlbGV0ZSB0aGUgRUxCLlxuICAgIC8vIHNvIHdlIG5lZWQgdG8gbWFrZSBzdXJlIHRoaXMgaGFwcGVucyBiZWZvcmUgdGhlIGNvbnRyb2xsZXIgaXMgZGVsZXRlZC5cbiAgICBlY2hvU2VydmVyLm5vZGUuYWRkRGVwZW5kZW5jeShjbHVzdGVyLmFsYkNvbnRyb2xsZXIgPz8gW10pO1xuXG4gICAgY29uc3QgbG9hZEJhbGFuY2VyQWRkcmVzcyA9IGNsdXN0ZXIuZ2V0SW5ncmVzc0xvYWRCYWxhbmNlckFkZHJlc3MoaW5ncmVzcy5uYW1lLCB7IHRpbWVvdXQ6IER1cmF0aW9uLm1pbnV0ZXMoMTApIH0pO1xuXG4gICAgLy8gY3JlYXRlIGEgcmVzb3VyY2UgdGhhdCBoaXRzIHRoZSBsb2FkIGJhbGFuY2VyIHRvIG1ha2Ugc3VyZVxuICAgIC8vIGV2ZXJ5dGhpbmcgaXMgd2lyZWQgcHJvcGVybHkuXG4gICAgY29uc3QgcGluZ2VyID0gbmV3IFBpbmdlcih0aGlzLCAnSW5ncmVzc1BpbmdlcicsIHtcbiAgICAgIHVybDogYGh0dHA6Ly8ke2xvYWRCYWxhbmNlckFkZHJlc3N9YCxcbiAgICAgIHZwYzogY2x1c3Rlci52cGMsXG4gICAgfSk7XG5cbiAgICAvLyB0aGUgcGluZ2VyIG11c3Qgd2FpdCBmb3IgdGhlIGluZ3Jlc3MgYW5kIGVjaG9TZXJ2ZXIgdG8gYmUgZGVwbG95ZWQuXG4gICAgcGluZ2VyLm5vZGUuYWRkRGVwZW5kZW5jeShpbmdyZXNzLCBlY2hvU2VydmVyKTtcblxuICAgIC8vIHRoaXMgc2hvdWxkIGRpc3BsYXkgdGhlICdoZWxsbycgdGV4dCB3ZSBnYXZlIHRvIHRoZSBzZXJ2ZXJcbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdJbmdyZXNzUGluZ2VyUmVzcG9uc2UnLCB7XG4gICAgICB2YWx1ZTogcGluZ2VyLnJlc3BvbnNlLFxuICAgIH0pO1xuXG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgRWtzQ2x1c3RlckFsYkNvbnRyb2xsZXJTdGFjayhhcHAsICdhd3MtY2RrLWVrcy1jbHVzdGVyLWFsYi1jb250cm9sbGVyLXRlc3QnKTtcbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnYXdzLWNkay1jbHVzdGVyLWFsYi1jb250cm9sbGVyJywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG59KTtcbmFwcC5zeW50aCgpO1xuIl19