"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const integ = require("@aws-cdk/integ-tests-alpha");
const lambda_layer_kubectl_v33_1 = require("@aws-cdk/lambda-layer-kubectl-v33");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const eks = require("../lib");
class EksClusterStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1 });
        const cluster = new eks.Cluster(this, 'Cluster', {
            vpc,
            version: eks.KubernetesVersion.V1_33,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(this, 'kubectlLayer'),
            },
        });
        new eks.Addon(this, 'Addon', {
            addonName: 'coredns',
            cluster,
            preserveOnDelete: true,
            configurationValues: {
                replicaCount: 2,
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
const stack = new EksClusterStack(app, 'EksClusterWithAddonStack');
new integ.IntegTest(app, 'EksClusterwithAddon', {
    testCases: [stack],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLWFkZG9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZWtzLWFkZG9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQW9EO0FBQ3BELGdGQUFvRTtBQUNwRSw2Q0FBeUM7QUFDekMsMkNBQTJDO0FBQzNDLDhCQUE4QjtBQUU5QixNQUFNLGVBQWdCLFNBQVEsbUJBQUs7SUFDakMsWUFBWSxLQUFVLEVBQUUsRUFBVTtRQUNoQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekQsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDL0MsR0FBRztZQUNILE9BQU8sRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSztZQUNwQyxzQkFBc0IsRUFBRTtnQkFDdEIsWUFBWSxFQUFFLElBQUksMENBQWUsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDO2FBQ3hEO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDM0IsU0FBUyxFQUFFLFNBQVM7WUFDcEIsT0FBTztZQUNQLGdCQUFnQixFQUFFLElBQUk7WUFDdEIsbUJBQW1CLEVBQUU7Z0JBQ25CLFlBQVksRUFBRSxDQUFDO2FBQ2hCO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsQ0FBQztJQUNsQixjQUFjLEVBQUU7UUFDZCwwREFBMEQsRUFBRSxJQUFJO1FBQ2hFLDJDQUEyQyxFQUFFLEtBQUs7S0FDbkQ7Q0FDRixDQUFDLENBQUM7QUFFSCxNQUFNLEtBQUssR0FBRyxJQUFJLGVBQWUsQ0FBQyxHQUFHLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztBQUNuRSxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLHFCQUFxQixFQUFFO0lBQzlDLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBpbnRlZyBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgeyBLdWJlY3RsVjMzTGF5ZXIgfSBmcm9tICdAYXdzLWNkay9sYW1iZGEtbGF5ZXIta3ViZWN0bC12MzMnO1xuaW1wb3J0IHsgQXBwLCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVrcyBmcm9tICcuLi9saWInO1xuXG5jbGFzcyBFa3NDbHVzdGVyU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgJ1ZwYycsIHsgbmF0R2F0ZXdheXM6IDEgfSk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3Rlcih0aGlzLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIHZlcnNpb246IGVrcy5LdWJlcm5ldGVzVmVyc2lvbi5WMV8zMyxcbiAgICAgIGt1YmVjdGxQcm92aWRlck9wdGlvbnM6IHtcbiAgICAgICAga3ViZWN0bExheWVyOiBuZXcgS3ViZWN0bFYzM0xheWVyKHRoaXMsICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBuZXcgZWtzLkFkZG9uKHRoaXMsICdBZGRvbicsIHtcbiAgICAgIGFkZG9uTmFtZTogJ2NvcmVkbnMnLFxuICAgICAgY2x1c3RlcixcbiAgICAgIHByZXNlcnZlT25EZWxldGU6IHRydWUsXG4gICAgICBjb25maWd1cmF0aW9uVmFsdWVzOiB7XG4gICAgICAgIHJlcGxpY2FDb3VudDogMixcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gIHBvc3RDbGlDb250ZXh0OiB7XG4gICAgJ0Bhd3MtY2RrL2F3cy1sYW1iZGE6Y3JlYXRlTmV3UG9saWNpZXNXaXRoQWRkVG9Sb2xlUG9saWN5JzogdHJ1ZSxcbiAgICAnQGF3cy1jZGsvYXdzLWxhbWJkYTp1c2VDZGtNYW5hZ2VkTG9nR3JvdXAnOiBmYWxzZSxcbiAgfSxcbn0pO1xuXG5jb25zdCBzdGFjayA9IG5ldyBFa3NDbHVzdGVyU3RhY2soYXBwLCAnRWtzQ2x1c3RlcldpdGhBZGRvblN0YWNrJyk7XG5uZXcgaW50ZWcuSW50ZWdUZXN0KGFwcCwgJ0Vrc0NsdXN0ZXJ3aXRoQWRkb24nLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuIl19