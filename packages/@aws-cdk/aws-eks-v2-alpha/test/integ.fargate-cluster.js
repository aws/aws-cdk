"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const integ = require("@aws-cdk/integ-tests-alpha");
const lambda_layer_kubectl_v34_1 = require("@aws-cdk/lambda-layer-kubectl-v34");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const eks = require("../lib");
class EksFargateClusterStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new eks.FargateCluster(this, 'FargateTestCluster', {
            vpc: props?.vpc,
            version: eks.KubernetesVersion.V1_34,
            prune: false,
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v34_1.KubectlV34Layer(this, 'kubectlLayer'),
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
const stack = new EksFargateClusterStack(app, 'eks-fargate-cluster-test-stack', {});
new integ.IntegTest(app, 'eks-fargate-cluster', {
    testCases: [stack],
    diffAssets: false,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZmFyZ2F0ZS1jbHVzdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZmFyZ2F0ZS1jbHVzdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQTZDO0FBQzdDLG9EQUFvRDtBQUNwRCxnRkFBb0U7QUFDcEUsNkNBQXFEO0FBRXJELDhCQUE4QjtBQUs5QixNQUFNLHNCQUF1QixTQUFRLG1CQUFLO0lBQ3hDLFlBQVksS0FBVSxFQUFFLEVBQVUsRUFBRSxLQUFtQztRQUNyRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFO1lBQ2pELEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRztZQUNmLE9BQU8sRUFBRSxHQUFHLENBQUMsaUJBQWlCLENBQUMsS0FBSztZQUNwQyxLQUFLLEVBQUUsS0FBSztZQUNaLHNCQUFzQixFQUFFO2dCQUN0QixZQUFZLEVBQUUsSUFBSSwwQ0FBZSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUM7YUFDeEQ7U0FDRixDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxDQUFDO0lBQ2xCLGNBQWMsRUFBRTtRQUNkLDBEQUEwRCxFQUFFLElBQUk7UUFDaEUsMkNBQTJDLEVBQUUsS0FBSztLQUNuRDtDQUNGLENBQUMsQ0FBQztBQUNILE1BQU0sS0FBSyxHQUFHLElBQUksc0JBQXNCLENBQUMsR0FBRyxFQUFFLGdDQUFnQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3BGLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUscUJBQXFCLEVBQUU7SUFDOUMsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0lBQ2xCLFVBQVUsRUFBRSxLQUFLO0NBQ2xCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyAhY2RrLWludGVnIHByYWdtYTpkaXNhYmxlLXVwZGF0ZS13b3JrZmxvd1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgS3ViZWN0bFYzNExheWVyIH0gZnJvbSAnQGF3cy1jZGsvbGFtYmRhLWxheWVyLWt1YmVjdGwtdjM0JztcbmltcG9ydCB7IEFwcCwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBla3MgZnJvbSAnLi4vbGliJztcblxuaW50ZXJmYWNlIEVrc0ZhcmdhdGVDbHVzdGVyU3RhY2tQcm9wcyBleHRlbmRzIFN0YWNrUHJvcHMge1xuICB2cGM/OiBlYzIuSVZwYztcbn1cbmNsYXNzIEVrc0ZhcmdhdGVDbHVzdGVyU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogRWtzRmFyZ2F0ZUNsdXN0ZXJTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBuZXcgZWtzLkZhcmdhdGVDbHVzdGVyKHRoaXMsICdGYXJnYXRlVGVzdENsdXN0ZXInLCB7XG4gICAgICB2cGM6IHByb3BzPy52cGMsXG4gICAgICB2ZXJzaW9uOiBla3MuS3ViZXJuZXRlc1ZlcnNpb24uVjFfMzQsXG4gICAgICBwcnVuZTogZmFsc2UsXG4gICAgICBrdWJlY3RsUHJvdmlkZXJPcHRpb25zOiB7XG4gICAgICAgIGt1YmVjdGxMYXllcjogbmV3IEt1YmVjdGxWMzRMYXllcih0aGlzLCAna3ViZWN0bExheWVyJyksXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICBwb3N0Q2xpQ29udGV4dDoge1xuICAgICdAYXdzLWNkay9hd3MtbGFtYmRhOmNyZWF0ZU5ld1BvbGljaWVzV2l0aEFkZFRvUm9sZVBvbGljeSc6IHRydWUsXG4gICAgJ0Bhd3MtY2RrL2F3cy1sYW1iZGE6dXNlQ2RrTWFuYWdlZExvZ0dyb3VwJzogZmFsc2UsXG4gIH0sXG59KTtcbmNvbnN0IHN0YWNrID0gbmV3IEVrc0ZhcmdhdGVDbHVzdGVyU3RhY2soYXBwLCAnZWtzLWZhcmdhdGUtY2x1c3Rlci10ZXN0LXN0YWNrJywge30pO1xubmV3IGludGVnLkludGVnVGVzdChhcHAsICdla3MtZmFyZ2F0ZS1jbHVzdGVyJywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG4gIGRpZmZBc3NldHM6IGZhbHNlLFxufSk7XG4iXX0=