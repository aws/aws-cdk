"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const integ = require("@aws-cdk/integ-tests-alpha");
const lambda_layer_kubectl_v32_1 = require("@aws-cdk/lambda-layer-kubectl-v32");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const cx_api_1 = require("aws-cdk-lib/cx-api");
const eks = require("../lib");
class EksClusterInferenceStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        // just need one nat gateway to simplify the test
        const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });
        const cluster = new eks.Cluster(this, 'Cluster', {
            vpc,
            version: eks.KubernetesVersion.V1_32,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v32_1.KubectlV32Layer(this, 'kubectlLayer'),
            },
            albController: {
                version: eks.AlbControllerVersion.V2_8_2,
            },
            defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
        });
        cluster.addNodegroupCapacity('InferenceInstances', {
            instanceTypes: [new ec2.InstanceType('inf1.2xlarge')],
        });
        cluster.addNodegroupCapacity('Inference2Instances', {
            instanceTypes: [new ec2.InstanceType('inf2.xlarge')],
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
const stack = new EksClusterInferenceStack(app, 'aws-cdk-eks-cluster-inference-nodegroup');
new integ.IntegTest(app, 'aws-cdk-eks-cluster-interence-nodegroup-integ', {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLWluZmVyZW5jZS1ub2RlZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5la3MtaW5mZXJlbmNlLW5vZGVncm91cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUE2QztBQUM3QyxvREFBb0Q7QUFDcEQsZ0ZBQW9FO0FBQ3BFLDZDQUF5QztBQUN6QywyQ0FBMkM7QUFDM0MsK0NBQThFO0FBQzlFLDhCQUE4QjtBQUU5QixNQUFNLHdCQUF5QixTQUFRLG1CQUFLO0lBQzFDLFlBQVksS0FBVSxFQUFFLEVBQVU7UUFDaEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixpREFBaUQ7UUFDakQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsNEJBQTRCLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUV6RyxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUMvQyxHQUFHO1lBQ0gsT0FBTyxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLO1lBQ3BDLHNCQUFzQixFQUFFO2dCQUN0QixZQUFZLEVBQUUsSUFBSSwwQ0FBZSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUM7YUFDeEQ7WUFDRCxhQUFhLEVBQUU7Z0JBQ2IsT0FBTyxFQUFFLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNO2FBQ3pDO1lBQ0QsbUJBQW1CLEVBQUUsR0FBRyxDQUFDLG1CQUFtQixDQUFDLFNBQVM7U0FDdkQsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLG9CQUFvQixDQUFDLG9CQUFvQixFQUFFO1lBQ2pELGFBQWEsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUN0RCxDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsb0JBQW9CLENBQUMscUJBQXFCLEVBQUU7WUFDbEQsYUFBYSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ3JELENBQUMsQ0FBQztLQUNKO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLENBQUM7SUFDbEIsY0FBYyxFQUFFO1FBQ2QsQ0FBQyxpREFBd0MsQ0FBQyxFQUFFLEtBQUs7UUFDakQsMERBQTBELEVBQUUsSUFBSTtRQUNoRSwyQ0FBMkMsRUFBRSxLQUFLO0tBQ25EO0NBQ0YsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxLQUFLLEdBQUcsSUFBSSx3QkFBd0IsQ0FBQyxHQUFHLEVBQUUseUNBQXlDLENBQUMsQ0FBQztBQUMzRixJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLCtDQUErQyxFQUFFO0lBQ3hFLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztJQUNsQiwyRkFBMkY7SUFDM0YsVUFBVSxFQUFFLEtBQUs7SUFDakIsaUJBQWlCLEVBQUU7UUFDakIsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFO2dCQUNKLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vICFjZGstaW50ZWcgcHJhZ21hOmRpc2FibGUtdXBkYXRlLXdvcmtmbG93XG5pbXBvcnQgKiBhcyBpbnRlZyBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgeyBLdWJlY3RsVjMyTGF5ZXIgfSBmcm9tICdAYXdzLWNkay9sYW1iZGEtbGF5ZXIta3ViZWN0bC12MzInO1xuaW1wb3J0IHsgQXBwLCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCB7IElBTV9PSURDX1JFSkVDVF9VTkFVVEhPUklaRURfQ09OTkVDVElPTlMgfSBmcm9tICdhd3MtY2RrLWxpYi9jeC1hcGknO1xuaW1wb3J0ICogYXMgZWtzIGZyb20gJy4uL2xpYic7XG5cbmNsYXNzIEVrc0NsdXN0ZXJJbmZlcmVuY2VTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IEFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAvLyBqdXN0IG5lZWQgb25lIG5hdCBnYXRld2F5IHRvIHNpbXBsaWZ5IHRoZSB0ZXN0XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgJ1ZwYycsIHsgbWF4QXpzOiAyLCBuYXRHYXRld2F5czogMSwgcmVzdHJpY3REZWZhdWx0U2VjdXJpdHlHcm91cDogZmFsc2UgfSk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHRoaXMsICdDbHVzdGVyJywge1xuICAgICAgdnBjLFxuICAgICAgdmVyc2lvbjogZWtzLkt1YmVybmV0ZXNWZXJzaW9uLlYxXzMyLFxuICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICBrdWJlY3RsTGF5ZXI6IG5ldyBLdWJlY3RsVjMyTGF5ZXIodGhpcywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgfSxcbiAgICAgIGFsYkNvbnRyb2xsZXI6IHtcbiAgICAgICAgdmVyc2lvbjogZWtzLkFsYkNvbnRyb2xsZXJWZXJzaW9uLlYyXzhfMixcbiAgICAgIH0sXG4gICAgICBkZWZhdWx0Q2FwYWNpdHlUeXBlOiBla3MuRGVmYXVsdENhcGFjaXR5VHlwZS5OT0RFR1JPVVAsXG4gICAgfSk7XG5cbiAgICBjbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCdJbmZlcmVuY2VJbnN0YW5jZXMnLCB7XG4gICAgICBpbnN0YW5jZVR5cGVzOiBbbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2luZjEuMnhsYXJnZScpXSxcbiAgICB9KTtcblxuICAgIGNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ0luZmVyZW5jZTJJbnN0YW5jZXMnLCB7XG4gICAgICBpbnN0YW5jZVR5cGVzOiBbbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2luZjIueGxhcmdlJyldLFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICBwb3N0Q2xpQ29udGV4dDoge1xuICAgIFtJQU1fT0lEQ19SRUpFQ1RfVU5BVVRIT1JJWkVEX0NPTk5FQ1RJT05TXTogZmFsc2UsXG4gICAgJ0Bhd3MtY2RrL2F3cy1sYW1iZGE6Y3JlYXRlTmV3UG9saWNpZXNXaXRoQWRkVG9Sb2xlUG9saWN5JzogdHJ1ZSxcbiAgICAnQGF3cy1jZGsvYXdzLWxhbWJkYTp1c2VDZGtNYW5hZ2VkTG9nR3JvdXAnOiBmYWxzZSxcbiAgfSxcbn0pO1xuY29uc3Qgc3RhY2sgPSBuZXcgRWtzQ2x1c3RlckluZmVyZW5jZVN0YWNrKGFwcCwgJ2F3cy1jZGstZWtzLWNsdXN0ZXItaW5mZXJlbmNlLW5vZGVncm91cCcpO1xubmV3IGludGVnLkludGVnVGVzdChhcHAsICdhd3MtY2RrLWVrcy1jbHVzdGVyLWludGVyZW5jZS1ub2RlZ3JvdXAtaW50ZWcnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbiAgLy8gVGVzdCBpbmNsdWRlcyBhc3NldHMgdGhhdCBhcmUgdXBkYXRlZCB3ZWVrbHkuIElmIG5vdCBkaXNhYmxlZCwgdGhlIHVwZ3JhZGUgUFIgd2lsbCBmYWlsLlxuICBkaWZmQXNzZXRzOiBmYWxzZSxcbiAgY2RrQ29tbWFuZE9wdGlvbnM6IHtcbiAgICBkZXBsb3k6IHtcbiAgICAgIGFyZ3M6IHtcbiAgICAgICAgcm9sbGJhY2s6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiJdfQ==