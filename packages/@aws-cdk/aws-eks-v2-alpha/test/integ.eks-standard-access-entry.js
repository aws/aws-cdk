"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const integ = require("@aws-cdk/integ-tests-alpha");
const lambda_layer_kubectl_v33_1 = require("@aws-cdk/lambda-layer-kubectl-v33");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
const eks = require("../lib");
class EksStandardAccessEntry extends aws_cdk_lib_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const vpc = new ec2.Vpc(this, 'Vpc', {
            maxAzs: 2,
            natGateways: 1,
            restrictDefaultSecurityGroup: false,
        });
        const cluster = new eks.Cluster(this, 'Cluster', {
            vpc,
            defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
            defaultCapacity: 0,
            version: eks.KubernetesVersion.V1_33,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v33_1.KubectlV33Layer(this, 'kubectlLayer'),
            },
        });
        const role = new iam.Role(this, 'Role', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        });
        new eks.AccessEntry(this, 'AccessEntry', {
            accessPolicies: [
                eks.AccessPolicy.fromAccessPolicyName('AmazonEKSClusterAdminPolicy', {
                    accessScopeType: eks.AccessScopeType.CLUSTER,
                }),
            ],
            cluster,
            principal: role.roleArn,
            accessEntryType: eks.AccessEntryType.STANDARD,
        });
    }
}
const app = new aws_cdk_lib_1.App({
    postCliContext: {
        '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
        '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    },
});
const stack = new EksStandardAccessEntry(app, 'EKSStandardAccessEntry');
new integ.IntegTest(app, 'aws-cdk-eks-standard-access-entry-integ', {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLXN0YW5kYXJkLWFjY2Vzcy1lbnRyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmVrcy1zdGFuZGFyZC1hY2Nlc3MtZW50cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBNkM7QUFDN0Msb0RBQW9EO0FBQ3BELGdGQUFvRTtBQUNwRSw2Q0FBeUM7QUFDekMsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyw4QkFBOEI7QUFFOUIsTUFBTSxzQkFBdUIsU0FBUSxtQkFBSztJQUN4QyxZQUFZLEtBQVUsRUFBRSxFQUFVO1FBQ2hDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7WUFDbkMsTUFBTSxFQUFFLENBQUM7WUFDVCxXQUFXLEVBQUUsQ0FBQztZQUNkLDRCQUE0QixFQUFFLEtBQUs7U0FDcEMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDL0MsR0FBRztZQUNILG1CQUFtQixFQUFFLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTO1lBQ3RELGVBQWUsRUFBRSxDQUFDO1lBQ2xCLE9BQU8sRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSztZQUNwQyxzQkFBc0IsRUFBRTtnQkFDdEIsWUFBWSxFQUFFLElBQUksMENBQWUsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDO2FBQ3hEO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUU7WUFDdEMsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLHNCQUFzQixDQUFDO1NBQzVELENBQUMsQ0FBQztRQUVILElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3ZDLGNBQWMsRUFBRTtnQkFDZCxHQUFHLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLDZCQUE2QixFQUFFO29CQUNuRSxlQUFlLEVBQUUsR0FBRyxDQUFDLGVBQWUsQ0FBQyxPQUFPO2lCQUM3QyxDQUFDO2FBQ0g7WUFDRCxPQUFPO1lBQ1AsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3ZCLGVBQWUsRUFBRSxHQUFHLENBQUMsZUFBZSxDQUFDLFFBQVE7U0FDOUMsQ0FBQyxDQUFDO0tBQ0o7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsQ0FBQztJQUNsQixjQUFjLEVBQUU7UUFDZCwwREFBMEQsRUFBRSxJQUFJO1FBQ2hFLDJDQUEyQyxFQUFFLEtBQUs7S0FDbkQ7Q0FDRixDQUFDLENBQUM7QUFDSCxNQUFNLEtBQUssR0FBRyxJQUFJLHNCQUFzQixDQUFDLEdBQUcsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO0FBQ3hFLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUseUNBQXlDLEVBQUU7SUFDbEUsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0lBQ2xCLDJGQUEyRjtJQUMzRixVQUFVLEVBQUUsS0FBSztJQUNqQixpQkFBaUIsRUFBRTtRQUNqQixNQUFNLEVBQUU7WUFDTixJQUFJLEVBQUU7Z0JBQ0osUUFBUSxFQUFFLElBQUk7YUFDZjtTQUNGO0tBQ0Y7Q0FDRixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gIWNkay1pbnRlZyBwcmFnbWE6ZGlzYWJsZS11cGRhdGUtd29ya2Zsb3dcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IEt1YmVjdGxWMzNMYXllciB9IGZyb20gJ0Bhd3MtY2RrL2xhbWJkYS1sYXllci1rdWJlY3RsLXYzMyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgZWtzIGZyb20gJy4uL2xpYic7XG5cbmNsYXNzIEVrc1N0YW5kYXJkQWNjZXNzRW50cnkgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgJ1ZwYycsIHtcbiAgICAgIG1heEF6czogMixcbiAgICAgIG5hdEdhdGV3YXlzOiAxLFxuICAgICAgcmVzdHJpY3REZWZhdWx0U2VjdXJpdHlHcm91cDogZmFsc2UsXG4gICAgfSk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3Rlcih0aGlzLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eVR5cGU6IGVrcy5EZWZhdWx0Q2FwYWNpdHlUeXBlLk5PREVHUk9VUCxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IGVrcy5LdWJlcm5ldGVzVmVyc2lvbi5WMV8zMyxcbiAgICAgIGt1YmVjdGxQcm92aWRlck9wdGlvbnM6IHtcbiAgICAgICAga3ViZWN0bExheWVyOiBuZXcgS3ViZWN0bFYzM0xheWVyKHRoaXMsICdrdWJlY3RsTGF5ZXInKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICBuZXcgZWtzLkFjY2Vzc0VudHJ5KHRoaXMsICdBY2Nlc3NFbnRyeScsIHtcbiAgICAgIGFjY2Vzc1BvbGljaWVzOiBbXG4gICAgICAgIGVrcy5BY2Nlc3NQb2xpY3kuZnJvbUFjY2Vzc1BvbGljeU5hbWUoJ0FtYXpvbkVLU0NsdXN0ZXJBZG1pblBvbGljeScsIHtcbiAgICAgICAgICBhY2Nlc3NTY29wZVR5cGU6IGVrcy5BY2Nlc3NTY29wZVR5cGUuQ0xVU1RFUixcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgICAgY2x1c3RlcixcbiAgICAgIHByaW5jaXBhbDogcm9sZS5yb2xlQXJuLFxuICAgICAgYWNjZXNzRW50cnlUeXBlOiBla3MuQWNjZXNzRW50cnlUeXBlLlNUQU5EQVJELFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICBwb3N0Q2xpQ29udGV4dDoge1xuICAgICdAYXdzLWNkay9hd3MtbGFtYmRhOmNyZWF0ZU5ld1BvbGljaWVzV2l0aEFkZFRvUm9sZVBvbGljeSc6IHRydWUsXG4gICAgJ0Bhd3MtY2RrL2F3cy1sYW1iZGE6dXNlQ2RrTWFuYWdlZExvZ0dyb3VwJzogZmFsc2UsXG4gIH0sXG59KTtcbmNvbnN0IHN0YWNrID0gbmV3IEVrc1N0YW5kYXJkQWNjZXNzRW50cnkoYXBwLCAnRUtTU3RhbmRhcmRBY2Nlc3NFbnRyeScpO1xubmV3IGludGVnLkludGVnVGVzdChhcHAsICdhd3MtY2RrLWVrcy1zdGFuZGFyZC1hY2Nlc3MtZW50cnktaW50ZWcnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbiAgLy8gVGVzdCBpbmNsdWRlcyBhc3NldHMgdGhhdCBhcmUgdXBkYXRlZCB3ZWVrbHkuIElmIG5vdCBkaXNhYmxlZCwgdGhlIHVwZ3JhZGUgUFIgd2lsbCBmYWlsLlxuICBkaWZmQXNzZXRzOiBmYWxzZSxcbiAgY2RrQ29tbWFuZE9wdGlvbnM6IHtcbiAgICBkZXBsb3k6IHtcbiAgICAgIGFyZ3M6IHtcbiAgICAgICAgcm9sbGJhY2s6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiJdfQ==