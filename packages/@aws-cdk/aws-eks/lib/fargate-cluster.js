"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FargateCluster = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cluster_1 = require("./cluster");
/**
 * Defines an EKS cluster that runs entirely on AWS Fargate.
 *
 * The cluster is created with a default Fargate Profile that matches the
 * "default" and "kube-system" namespaces. You can add additional profiles using
 * `addFargateProfile`.
 */
class FargateCluster extends cluster_1.Cluster {
    constructor(scope, id, props) {
        super(scope, id, {
            ...props,
            defaultCapacity: 0,
            coreDnsComputeType: props.coreDnsComputeType ?? cluster_1.CoreDnsComputeType.FARGATE,
            version: props.version,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_eks_FargateClusterProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, FargateCluster);
            }
            throw error;
        }
        this.defaultProfile = this.addFargateProfile(props.defaultProfile?.fargateProfileName ?? (props.defaultProfile ? 'custom' : 'default'), props.defaultProfile ?? {
            selectors: [
                { namespace: 'default' },
                { namespace: 'kube-system' },
            ],
        });
    }
}
exports.FargateCluster = FargateCluster;
_a = JSII_RTTI_SYMBOL_1;
FargateCluster[_a] = { fqn: "@aws-cdk/aws-eks.FargateCluster", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFyZ2F0ZS1jbHVzdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmFyZ2F0ZS1jbHVzdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHVDQUF3RTtBQWdCeEU7Ozs7OztHQU1HO0FBQ0gsTUFBYSxjQUFlLFNBQVEsaUJBQU87SUFNekMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEwQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLEdBQUcsS0FBSztZQUNSLGVBQWUsRUFBRSxDQUFDO1lBQ2xCLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxrQkFBa0IsSUFBSSw0QkFBa0IsQ0FBQyxPQUFPO1lBQzFFLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztTQUN2QixDQUFDLENBQUM7Ozs7OzsrQ0FaTSxjQUFjOzs7O1FBY3ZCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUMxQyxLQUFLLENBQUMsY0FBYyxFQUFFLGtCQUFrQixJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFDekYsS0FBSyxDQUFDLGNBQWMsSUFBSTtZQUN0QixTQUFTLEVBQUU7Z0JBQ1QsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFO2dCQUN4QixFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUU7YUFDN0I7U0FDRixDQUNGLENBQUM7S0FDSDs7QUF2Qkgsd0NBd0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDbHVzdGVyLCBDbHVzdGVyT3B0aW9ucywgQ29yZURuc0NvbXB1dGVUeXBlIH0gZnJvbSAnLi9jbHVzdGVyJztcbmltcG9ydCB7IEZhcmdhdGVQcm9maWxlLCBGYXJnYXRlUHJvZmlsZU9wdGlvbnMgfSBmcm9tICcuL2ZhcmdhdGUtcHJvZmlsZSc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBwcm9wcyBmb3IgRUtTIEZhcmdhdGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRmFyZ2F0ZUNsdXN0ZXJQcm9wcyBleHRlbmRzIENsdXN0ZXJPcHRpb25zIHtcbiAgLyoqXG4gICAqIEZhcmdhdGUgUHJvZmlsZSB0byBjcmVhdGUgYWxvbmcgd2l0aCB0aGUgY2x1c3Rlci5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIHByb2ZpbGUgY2FsbGVkIFwiZGVmYXVsdFwiIHdpdGggJ2RlZmF1bHQnIGFuZCAna3ViZS1zeXN0ZW0nXG4gICAqICAgICAgICAgICAgc2VsZWN0b3JzIHdpbGwgYmUgY3JlYXRlZCBpZiB0aGlzIGlzIGxlZnQgdW5kZWZpbmVkLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVmYXVsdFByb2ZpbGU/OiBGYXJnYXRlUHJvZmlsZU9wdGlvbnM7XG59XG5cbi8qKlxuICogRGVmaW5lcyBhbiBFS1MgY2x1c3RlciB0aGF0IHJ1bnMgZW50aXJlbHkgb24gQVdTIEZhcmdhdGUuXG4gKlxuICogVGhlIGNsdXN0ZXIgaXMgY3JlYXRlZCB3aXRoIGEgZGVmYXVsdCBGYXJnYXRlIFByb2ZpbGUgdGhhdCBtYXRjaGVzIHRoZVxuICogXCJkZWZhdWx0XCIgYW5kIFwia3ViZS1zeXN0ZW1cIiBuYW1lc3BhY2VzLiBZb3UgY2FuIGFkZCBhZGRpdGlvbmFsIHByb2ZpbGVzIHVzaW5nXG4gKiBgYWRkRmFyZ2F0ZVByb2ZpbGVgLlxuICovXG5leHBvcnQgY2xhc3MgRmFyZ2F0ZUNsdXN0ZXIgZXh0ZW5kcyBDbHVzdGVyIHtcbiAgLyoqXG4gICAqIEZhcmdhdGUgUHJvZmlsZSB0aGF0IHdhcyBjcmVhdGVkIHdpdGggdGhlIGNsdXN0ZXIuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGVmYXVsdFByb2ZpbGU6IEZhcmdhdGVQcm9maWxlO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBGYXJnYXRlQ2x1c3RlclByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIGNvcmVEbnNDb21wdXRlVHlwZTogcHJvcHMuY29yZURuc0NvbXB1dGVUeXBlID8/IENvcmVEbnNDb21wdXRlVHlwZS5GQVJHQVRFLFxuICAgICAgdmVyc2lvbjogcHJvcHMudmVyc2lvbixcbiAgICB9KTtcblxuICAgIHRoaXMuZGVmYXVsdFByb2ZpbGUgPSB0aGlzLmFkZEZhcmdhdGVQcm9maWxlKFxuICAgICAgcHJvcHMuZGVmYXVsdFByb2ZpbGU/LmZhcmdhdGVQcm9maWxlTmFtZSA/PyAocHJvcHMuZGVmYXVsdFByb2ZpbGUgPyAnY3VzdG9tJyA6ICdkZWZhdWx0JyksXG4gICAgICBwcm9wcy5kZWZhdWx0UHJvZmlsZSA/PyB7XG4gICAgICAgIHNlbGVjdG9yczogW1xuICAgICAgICAgIHsgbmFtZXNwYWNlOiAnZGVmYXVsdCcgfSxcbiAgICAgICAgICB7IG5hbWVzcGFjZTogJ2t1YmUtc3lzdGVtJyB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICApO1xuICB9XG59XG4iXX0=