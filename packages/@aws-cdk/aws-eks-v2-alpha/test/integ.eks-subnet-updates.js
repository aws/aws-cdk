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
        new eks.Cluster(this, 'Cluster', {
            vpc,
            version: eks.KubernetesVersion.V1_33,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(this, 'kubectlLayer'),
            },
            defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
            defaultCapacity: 0,
            endpointAccess: eks.EndpointAccess.PUBLIC_AND_PRIVATE,
            vpcSubnets: [{ subnetType: ec2.SubnetType.PUBLIC }],
        });
    }
}
const app = new aws_cdk_lib_1.App({
    postCliContext: {
        '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
        '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    },
});
const stack = new EksClusterStack(app, 'aws-cdk-eks-cluster-stack');
new integ.IntegTest(app, 'aws-cdk-eks-cluster', {
    testCases: [stack],
    // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
    diffAssets: false,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLXN1Ym5ldC11cGRhdGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZWtzLXN1Ym5ldC11cGRhdGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQW9EO0FBQ3BELGdGQUFvRTtBQUNwRSw2Q0FBeUM7QUFDekMsMkNBQTJDO0FBQzNDLDhCQUE4QjtBQUU5QixNQUFNLGVBQWdCLFNBQVEsbUJBQUs7SUFDakMsWUFBWSxLQUFVLEVBQUUsRUFBVTtRQUNoQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekQsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDL0IsR0FBRztZQUNILE9BQU8sRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSztZQUNwQyxzQkFBc0IsRUFBRTtnQkFDdEIsWUFBWSxFQUFFLElBQUksMENBQWUsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDO2FBQ3hEO1lBQ0QsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLG1CQUFtQixDQUFDLFNBQVM7WUFDdEQsZUFBZSxFQUFFLENBQUM7WUFDbEIsY0FBYyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsa0JBQWtCO1lBQ3JELFVBQVUsRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDcEQsQ0FBQyxDQUFDO0tBQ0o7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsQ0FBQztJQUNsQixjQUFjLEVBQUU7UUFDZCwwREFBMEQsRUFBRSxJQUFJO1FBQ2hFLDJDQUEyQyxFQUFFLEtBQUs7S0FDbkQ7Q0FDRixDQUFDLENBQUM7QUFFSCxNQUFNLEtBQUssR0FBRyxJQUFJLGVBQWUsQ0FBQyxHQUFHLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztBQUNwRSxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLHFCQUFxQixFQUFFO0lBQzlDLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztJQUNsQiwyRkFBMkY7SUFDM0YsVUFBVSxFQUFFLEtBQUs7Q0FDbEIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgS3ViZWN0bFYzM0xheWVyIH0gZnJvbSAnQGF3cy1jZGsvbGFtYmRhLWxheWVyLWt1YmVjdGwtdjMzJztcbmltcG9ydCB7IEFwcCwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBla3MgZnJvbSAnLi4vbGliJztcblxuY2xhc3MgRWtzQ2x1c3RlclN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQXBwLCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWcGMnLCB7IG5hdEdhdGV3YXlzOiAxIH0pO1xuICAgIG5ldyBla3MuQ2x1c3Rlcih0aGlzLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIHZlcnNpb246IGVrcy5LdWJlcm5ldGVzVmVyc2lvbi5WMV8zMyxcbiAgICAgIGt1YmVjdGxQcm92aWRlck9wdGlvbnM6IHtcbiAgICAgICAga3ViZWN0bExheWVyOiBuZXcgS3ViZWN0bFYzM0xheWVyKHRoaXMsICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0Q2FwYWNpdHlUeXBlOiBla3MuRGVmYXVsdENhcGFjaXR5VHlwZS5OT0RFR1JPVVAsXG4gICAgICBkZWZhdWx0Q2FwYWNpdHk6IDAsXG4gICAgICBlbmRwb2ludEFjY2VzczogZWtzLkVuZHBvaW50QWNjZXNzLlBVQkxJQ19BTkRfUFJJVkFURSxcbiAgICAgIHZwY1N1Ym5ldHM6IFt7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyB9XSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgcG9zdENsaUNvbnRleHQ6IHtcbiAgICAnQGF3cy1jZGsvYXdzLWxhbWJkYTpjcmVhdGVOZXdQb2xpY2llc1dpdGhBZGRUb1JvbGVQb2xpY3knOiB0cnVlLFxuICAgICdAYXdzLWNkay9hd3MtbGFtYmRhOnVzZUNka01hbmFnZWRMb2dHcm91cCc6IGZhbHNlLFxuICB9LFxufSk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IEVrc0NsdXN0ZXJTdGFjayhhcHAsICdhd3MtY2RrLWVrcy1jbHVzdGVyLXN0YWNrJyk7XG5uZXcgaW50ZWcuSW50ZWdUZXN0KGFwcCwgJ2F3cy1jZGstZWtzLWNsdXN0ZXInLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbiAgLy8gVGVzdCBpbmNsdWRlcyBhc3NldHMgdGhhdCBhcmUgdXBkYXRlZCB3ZWVrbHkuIElmIG5vdCBkaXNhYmxlZCwgdGhlIHVwZ3JhZGUgUFIgd2lsbCBmYWlsLlxuICBkaWZmQXNzZXRzOiBmYWxzZSxcbn0pO1xuIl19