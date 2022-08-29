"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelmChart = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const path = require("path");
const lambda = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const kubectl_layer_1 = require("./kubectl-layer");
/**
 * Represents a helm chart within the Kubernetes system.
 *
 * Applies/deletes the resources using `kubectl` in sync with the resource.
 */
class HelmChart extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-eks-legacy.HelmChart", "");
            jsiiDeprecationWarnings._aws_cdk_aws_eks_legacy_HelmChartProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, HelmChart);
            }
            throw error;
        }
        const stack = core_1.Stack.of(this);
        // we maintain a single manifest custom resource handler for each cluster
        const handler = this.getOrCreateHelmChartHandler(props.cluster);
        if (!handler) {
            throw new Error('Cannot define a Helm chart on a cluster with kubectl disabled');
        }
        new core_1.CustomResource(this, 'Resource', {
            serviceToken: handler.functionArn,
            resourceType: HelmChart.RESOURCE_TYPE,
            properties: {
                Release: props.release || core_1.Names.uniqueId(this).slice(-63).toLowerCase(),
                Chart: props.chart,
                Version: props.version,
                Values: (props.values ? stack.toJsonString(props.values) : undefined),
                Namespace: props.namespace || 'default',
                Repository: props.repository,
            },
        });
    }
    getOrCreateHelmChartHandler(cluster) {
        if (!cluster.kubectlEnabled) {
            return undefined;
        }
        let handler = cluster.node.tryFindChild('HelmChartHandler');
        if (!handler) {
            handler = new lambda.Function(cluster, 'HelmChartHandler', {
                code: lambda.Code.fromAsset(path.join(__dirname, 'helm-chart')),
                runtime: lambda.Runtime.PYTHON_3_7,
                handler: 'index.handler',
                timeout: core_1.Duration.minutes(15),
                layers: [kubectl_layer_1.KubectlLayer.getOrCreate(this, { version: '2.0.0-beta1' })],
                memorySize: 256,
                environment: {
                    CLUSTER_NAME: cluster.clusterName,
                },
                // NOTE: we must use the default IAM role that's mapped to "system:masters"
                // as the execution role of this custom resource handler. This is the only
                // way to be able to interact with the cluster after it's been created.
                role: cluster._defaultMastersRole,
            });
        }
        return handler;
    }
}
exports.HelmChart = HelmChart;
_a = JSII_RTTI_SYMBOL_1;
HelmChart[_a] = { fqn: "@aws-cdk/aws-eks-legacy.HelmChart", version: "0.0.0" };
/**
 * The CloudFormation reosurce type.
 */
HelmChart.RESOURCE_TYPE = 'Custom::AWSCDK-EKS-HelmChart';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVsbS1jaGFydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhlbG0tY2hhcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNkJBQTZCO0FBQzdCLDhDQUE4QztBQUM5Qyx3Q0FBdUU7QUFDdkUsMkNBQXVDO0FBRXZDLG1EQUErQztBQXVEL0M7Ozs7R0FJRztBQUNILE1BQWEsU0FBVSxTQUFRLHNCQUFTO0lBTXRDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBcUI7UUFDN0QsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OzsrQ0FQUixTQUFTOzs7O1FBU2xCLE1BQU0sS0FBSyxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFN0IseUVBQXlFO1FBQ3pFLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMsK0RBQStELENBQUMsQ0FBQztTQUNsRjtRQUVELElBQUkscUJBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ25DLFlBQVksRUFBRSxPQUFPLENBQUMsV0FBVztZQUNqQyxZQUFZLEVBQUUsU0FBUyxDQUFDLGFBQWE7WUFDckMsVUFBVSxFQUFFO2dCQUNWLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxJQUFJLFlBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFO2dCQUN2RSxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7Z0JBQ2xCLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztnQkFDdEIsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztnQkFDckUsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTLElBQUksU0FBUztnQkFDdkMsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO2FBQzdCO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7SUFFTywyQkFBMkIsQ0FBQyxPQUFnQjtRQUNsRCxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRTtZQUMzQixPQUFPLFNBQVMsQ0FBQztTQUNsQjtRQUVELElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFxQixDQUFDO1FBQ2hGLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRTtnQkFDekQsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO2dCQUMvRCxPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO2dCQUNsQyxPQUFPLEVBQUUsZUFBZTtnQkFDeEIsT0FBTyxFQUFFLGVBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO2dCQUM3QixNQUFNLEVBQUUsQ0FBQyw0QkFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztnQkFDcEUsVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsV0FBVyxFQUFFO29CQUNYLFlBQVksRUFBRSxPQUFPLENBQUMsV0FBVztpQkFDbEM7Z0JBRUQsMkVBQTJFO2dCQUMzRSwwRUFBMEU7Z0JBQzFFLHVFQUF1RTtnQkFDdkUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxtQkFBbUI7YUFDbEMsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxPQUFPLE9BQU8sQ0FBQztLQUNoQjs7QUF4REgsOEJBeURDOzs7QUF4REM7O0dBRUc7QUFDb0IsdUJBQWEsR0FBRyw4QkFBOEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBDdXN0b21SZXNvdXJjZSwgRHVyYXRpb24sIE5hbWVzLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDbHVzdGVyIH0gZnJvbSAnLi9jbHVzdGVyJztcbmltcG9ydCB7IEt1YmVjdGxMYXllciB9IGZyb20gJy4va3ViZWN0bC1sYXllcic7XG5cbi8qKlxuICogSGVsbSBDaGFydCBvcHRpb25zLlxuICovXG5cbmV4cG9ydCBpbnRlcmZhY2UgSGVsbUNoYXJ0T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgY2hhcnQuXG4gICAqL1xuICByZWFkb25seSBjaGFydDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgcmVsZWFzZS5cbiAgICogQGRlZmF1bHQgLSBJZiBubyByZWxlYXNlIG5hbWUgaXMgZ2l2ZW4sIGl0IHdpbGwgdXNlIHRoZSBsYXN0IDYzIGNoYXJhY3RlcnMgb2YgdGhlIG5vZGUncyB1bmlxdWUgaWQuXG4gICAqL1xuICByZWFkb25seSByZWxlYXNlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgY2hhcnQgdmVyc2lvbiB0byBpbnN0YWxsLlxuICAgKiBAZGVmYXVsdCAtIElmIHRoaXMgaXMgbm90IHNwZWNpZmllZCwgdGhlIGxhdGVzdCB2ZXJzaW9uIGlzIGluc3RhbGxlZFxuICAgKi9cbiAgcmVhZG9ubHkgdmVyc2lvbj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHJlcG9zaXRvcnkgd2hpY2ggY29udGFpbnMgdGhlIGNoYXJ0LiBGb3IgZXhhbXBsZTogaHR0cHM6Ly9rdWJlcm5ldGVzLWNoYXJ0cy5zdG9yYWdlLmdvb2dsZWFwaXMuY29tL1xuICAgKiBAZGVmYXVsdCAtIE5vIHJlcG9zaXRvcnkgd2lsbCBiZSB1c2VkLCB3aGljaCBtZWFucyB0aGF0IHRoZSBjaGFydCBuZWVkcyB0byBiZSBhbiBhYnNvbHV0ZSBVUkwuXG4gICAqL1xuICByZWFkb25seSByZXBvc2l0b3J5Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgS3ViZXJuZXRlcyBuYW1lc3BhY2Ugc2NvcGUgb2YgdGhlIHJlcXVlc3RzLlxuICAgKiBAZGVmYXVsdCBkZWZhdWx0XG4gICAqL1xuICByZWFkb25seSBuYW1lc3BhY2U/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSB2YWx1ZXMgdG8gYmUgdXNlZCBieSB0aGUgY2hhcnQuXG4gICAqIEBkZWZhdWx0IC0gTm8gdmFsdWVzIGFyZSBwcm92aWRlZCB0byB0aGUgY2hhcnQuXG4gICAqL1xuICByZWFkb25seSB2YWx1ZXM/OiB7W2tleTogc3RyaW5nXTogYW55fTtcbn1cblxuLyoqXG4gKiBIZWxtIENoYXJ0IHByb3BlcnRpZXMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSGVsbUNoYXJ0UHJvcHMgZXh0ZW5kcyBIZWxtQ2hhcnRPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBFS1MgY2x1c3RlciB0byBhcHBseSB0aGlzIGNvbmZpZ3VyYXRpb24gdG8uXG4gICAqXG4gICAqIFtkaXNhYmxlLWF3c2xpbnQ6cmVmLXZpYS1pbnRlcmZhY2VdXG4gICAqL1xuICByZWFkb25seSBjbHVzdGVyOiBDbHVzdGVyO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBoZWxtIGNoYXJ0IHdpdGhpbiB0aGUgS3ViZXJuZXRlcyBzeXN0ZW0uXG4gKlxuICogQXBwbGllcy9kZWxldGVzIHRoZSByZXNvdXJjZXMgdXNpbmcgYGt1YmVjdGxgIGluIHN5bmMgd2l0aCB0aGUgcmVzb3VyY2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBIZWxtQ2hhcnQgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAvKipcbiAgICogVGhlIENsb3VkRm9ybWF0aW9uIHJlb3N1cmNlIHR5cGUuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJFU09VUkNFX1RZUEUgPSAnQ3VzdG9tOjpBV1NDREstRUtTLUhlbG1DaGFydCc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEhlbG1DaGFydFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2YodGhpcyk7XG5cbiAgICAvLyB3ZSBtYWludGFpbiBhIHNpbmdsZSBtYW5pZmVzdCBjdXN0b20gcmVzb3VyY2UgaGFuZGxlciBmb3IgZWFjaCBjbHVzdGVyXG4gICAgY29uc3QgaGFuZGxlciA9IHRoaXMuZ2V0T3JDcmVhdGVIZWxtQ2hhcnRIYW5kbGVyKHByb3BzLmNsdXN0ZXIpO1xuICAgIGlmICghaGFuZGxlcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZGVmaW5lIGEgSGVsbSBjaGFydCBvbiBhIGNsdXN0ZXIgd2l0aCBrdWJlY3RsIGRpc2FibGVkJyk7XG4gICAgfVxuXG4gICAgbmV3IEN1c3RvbVJlc291cmNlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHNlcnZpY2VUb2tlbjogaGFuZGxlci5mdW5jdGlvbkFybixcbiAgICAgIHJlc291cmNlVHlwZTogSGVsbUNoYXJ0LlJFU09VUkNFX1RZUEUsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFJlbGVhc2U6IHByb3BzLnJlbGVhc2UgfHwgTmFtZXMudW5pcXVlSWQodGhpcykuc2xpY2UoLTYzKS50b0xvd2VyQ2FzZSgpLCAvLyBIZWxtIGhhcyBhIDYzIGNoYXJhY3RlciBsaW1pdCBmb3IgdGhlIG5hbWVcbiAgICAgICAgQ2hhcnQ6IHByb3BzLmNoYXJ0LFxuICAgICAgICBWZXJzaW9uOiBwcm9wcy52ZXJzaW9uLFxuICAgICAgICBWYWx1ZXM6IChwcm9wcy52YWx1ZXMgPyBzdGFjay50b0pzb25TdHJpbmcocHJvcHMudmFsdWVzKSA6IHVuZGVmaW5lZCksXG4gICAgICAgIE5hbWVzcGFjZTogcHJvcHMubmFtZXNwYWNlIHx8ICdkZWZhdWx0JyxcbiAgICAgICAgUmVwb3NpdG9yeTogcHJvcHMucmVwb3NpdG9yeSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGdldE9yQ3JlYXRlSGVsbUNoYXJ0SGFuZGxlcihjbHVzdGVyOiBDbHVzdGVyKTogbGFtYmRhLklGdW5jdGlvbiB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCFjbHVzdGVyLmt1YmVjdGxFbmFibGVkKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGxldCBoYW5kbGVyID0gY2x1c3Rlci5ub2RlLnRyeUZpbmRDaGlsZCgnSGVsbUNoYXJ0SGFuZGxlcicpIGFzIGxhbWJkYS5JRnVuY3Rpb247XG4gICAgaWYgKCFoYW5kbGVyKSB7XG4gICAgICBoYW5kbGVyID0gbmV3IGxhbWJkYS5GdW5jdGlvbihjbHVzdGVyLCAnSGVsbUNoYXJ0SGFuZGxlcicsIHtcbiAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdoZWxtLWNoYXJ0JykpLFxuICAgICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM183LFxuICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgIHRpbWVvdXQ6IER1cmF0aW9uLm1pbnV0ZXMoMTUpLFxuICAgICAgICBsYXllcnM6IFtLdWJlY3RsTGF5ZXIuZ2V0T3JDcmVhdGUodGhpcywgeyB2ZXJzaW9uOiAnMi4wLjAtYmV0YTEnIH0pXSxcbiAgICAgICAgbWVtb3J5U2l6ZTogMjU2LFxuICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgIENMVVNURVJfTkFNRTogY2x1c3Rlci5jbHVzdGVyTmFtZSxcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBOT1RFOiB3ZSBtdXN0IHVzZSB0aGUgZGVmYXVsdCBJQU0gcm9sZSB0aGF0J3MgbWFwcGVkIHRvIFwic3lzdGVtOm1hc3RlcnNcIlxuICAgICAgICAvLyBhcyB0aGUgZXhlY3V0aW9uIHJvbGUgb2YgdGhpcyBjdXN0b20gcmVzb3VyY2UgaGFuZGxlci4gVGhpcyBpcyB0aGUgb25seVxuICAgICAgICAvLyB3YXkgdG8gYmUgYWJsZSB0byBpbnRlcmFjdCB3aXRoIHRoZSBjbHVzdGVyIGFmdGVyIGl0J3MgYmVlbiBjcmVhdGVkLlxuICAgICAgICByb2xlOiBjbHVzdGVyLl9kZWZhdWx0TWFzdGVyc1JvbGUsXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGhhbmRsZXI7XG4gIH1cbn1cbiJdfQ==