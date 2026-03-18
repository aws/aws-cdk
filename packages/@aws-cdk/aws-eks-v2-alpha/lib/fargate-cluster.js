"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FargateCluster = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const metadata_resource_1 = require("aws-cdk-lib/core/lib/metadata-resource");
const prop_injectable_1 = require("aws-cdk-lib/core/lib/prop-injectable");
const cluster_1 = require("./cluster");
/**
 * Defines an EKS cluster that runs entirely on AWS Fargate.
 *
 * The cluster is created with a default Fargate Profile that matches the
 * "default" and "kube-system" namespaces. You can add additional profiles using
 * `addFargateProfile`.
 */
let FargateCluster = (() => {
    let _classDecorators = [prop_injectable_1.propertyInjectable];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = cluster_1.Cluster;
    var FargateCluster = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            FargateCluster = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static [JSII_RTTI_SYMBOL_1] = { fqn: "@aws-cdk/aws-eks-v2-alpha.FargateCluster", version: "0.0.0" };
        /** Uniquely identifies this class. */
        static PROPERTY_INJECTION_ID = '@aws-cdk.aws-eks-v2-alpha.FargateCluster';
        /**
         * Fargate Profile that was created with the cluster.
         */
        defaultProfile;
        constructor(scope, id, props) {
            super(scope, id, {
                ...props,
                defaultCapacity: 0,
                defaultCapacityType: cluster_1.DefaultCapacityType.NODEGROUP,
                coreDnsComputeType: props.coreDnsComputeType ?? cluster_1.CoreDnsComputeType.FARGATE,
                version: props.version,
            });
            try {
                jsiiDeprecationWarnings._aws_cdk_aws_eks_v2_alpha_FargateClusterProps(props);
            }
            catch (error) {
                if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                    Error.captureStackTrace(error, FargateCluster);
                }
                throw error;
            }
            // Enhanced CDK Analytics Telemetry
            (0, metadata_resource_1.addConstructMetadata)(this, props);
            this.defaultProfile = this.addFargateProfile(props.defaultProfile?.fargateProfileName ?? (props.defaultProfile ? 'custom' : 'default'), props.defaultProfile ?? {
                selectors: [
                    { namespace: 'default' },
                    { namespace: 'kube-system' },
                ],
            });
        }
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    };
    return FargateCluster = _classThis;
})();
exports.FargateCluster = FargateCluster;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFyZ2F0ZS1jbHVzdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmFyZ2F0ZS1jbHVzdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDhFQUE4RTtBQUM5RSwwRUFBMEU7QUFFMUUsdUNBQW1HO0FBZ0JuRzs7Ozs7O0dBTUc7SUFFVSxjQUFjOzRCQUQxQixvQ0FBa0I7Ozs7c0JBQ2lCLGlCQUFPOzhCQUFmLFNBQVEsV0FBTzs7OztZQUEzQyw2S0E2QkM7Ozs7O1FBNUJDLHNDQUFzQztRQUMvQixNQUFNLENBQVUscUJBQXFCLEdBQVcsMENBQTBDLENBQUM7UUFDbEc7O1dBRUc7UUFDYSxjQUFjLENBQWlCO1FBRS9DLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBMEI7WUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7Z0JBQ2YsR0FBRyxLQUFLO2dCQUNSLGVBQWUsRUFBRSxDQUFDO2dCQUNsQixtQkFBbUIsRUFBRSw2QkFBbUIsQ0FBQyxTQUFTO2dCQUNsRCxrQkFBa0IsRUFBRSxLQUFLLENBQUMsa0JBQWtCLElBQUksNEJBQWtCLENBQUMsT0FBTztnQkFDMUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO2FBQ3ZCLENBQUMsQ0FBQzs7Ozs7O21EQWZNLGNBQWM7Ozs7WUFnQnZCLG1DQUFtQztZQUNuQyxJQUFBLHdDQUFvQixFQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVsQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FDMUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxrQkFBa0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQ3pGLEtBQUssQ0FBQyxjQUFjLElBQUk7Z0JBQ3RCLFNBQVMsRUFBRTtvQkFDVCxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUU7b0JBQ3hCLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRTtpQkFDN0I7YUFDRixDQUNGLENBQUM7U0FDSDs7WUE1QlUsdURBQWM7Ozs7O0FBQWQsd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhZGRDb25zdHJ1Y3RNZXRhZGF0YSB9IGZyb20gJ2F3cy1jZGstbGliL2NvcmUvbGliL21ldGFkYXRhLXJlc291cmNlJztcbmltcG9ydCB7IHByb3BlcnR5SW5qZWN0YWJsZSB9IGZyb20gJ2F3cy1jZGstbGliL2NvcmUvbGliL3Byb3AtaW5qZWN0YWJsZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENsdXN0ZXIsIENsdXN0ZXJDb21tb25PcHRpb25zLCBDb3JlRG5zQ29tcHV0ZVR5cGUsIERlZmF1bHRDYXBhY2l0eVR5cGUgfSBmcm9tICcuL2NsdXN0ZXInO1xuaW1wb3J0IHsgRmFyZ2F0ZVByb2ZpbGUsIEZhcmdhdGVQcm9maWxlT3B0aW9ucyB9IGZyb20gJy4vZmFyZ2F0ZS1wcm9maWxlJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIHByb3BzIGZvciBFS1MgRmFyZ2F0ZS5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGYXJnYXRlQ2x1c3RlclByb3BzIGV4dGVuZHMgQ2x1c3RlckNvbW1vbk9wdGlvbnMge1xuICAvKipcbiAgICogRmFyZ2F0ZSBQcm9maWxlIHRvIGNyZWF0ZSBhbG9uZyB3aXRoIHRoZSBjbHVzdGVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgcHJvZmlsZSBjYWxsZWQgXCJkZWZhdWx0XCIgd2l0aCAnZGVmYXVsdCcgYW5kICdrdWJlLXN5c3RlbSdcbiAgICogICAgICAgICAgICBzZWxlY3RvcnMgd2lsbCBiZSBjcmVhdGVkIGlmIHRoaXMgaXMgbGVmdCB1bmRlZmluZWQuXG4gICAqL1xuICByZWFkb25seSBkZWZhdWx0UHJvZmlsZT86IEZhcmdhdGVQcm9maWxlT3B0aW9ucztcbn1cblxuLyoqXG4gKiBEZWZpbmVzIGFuIEVLUyBjbHVzdGVyIHRoYXQgcnVucyBlbnRpcmVseSBvbiBBV1MgRmFyZ2F0ZS5cbiAqXG4gKiBUaGUgY2x1c3RlciBpcyBjcmVhdGVkIHdpdGggYSBkZWZhdWx0IEZhcmdhdGUgUHJvZmlsZSB0aGF0IG1hdGNoZXMgdGhlXG4gKiBcImRlZmF1bHRcIiBhbmQgXCJrdWJlLXN5c3RlbVwiIG5hbWVzcGFjZXMuIFlvdSBjYW4gYWRkIGFkZGl0aW9uYWwgcHJvZmlsZXMgdXNpbmdcbiAqIGBhZGRGYXJnYXRlUHJvZmlsZWAuXG4gKi9cbkBwcm9wZXJ0eUluamVjdGFibGVcbmV4cG9ydCBjbGFzcyBGYXJnYXRlQ2x1c3RlciBleHRlbmRzIENsdXN0ZXIge1xuICAvKiogVW5pcXVlbHkgaWRlbnRpZmllcyB0aGlzIGNsYXNzLiAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFBST1BFUlRZX0lOSkVDVElPTl9JRDogc3RyaW5nID0gJ0Bhd3MtY2RrLmF3cy1la3MtdjItYWxwaGEuRmFyZ2F0ZUNsdXN0ZXInO1xuICAvKipcbiAgICogRmFyZ2F0ZSBQcm9maWxlIHRoYXQgd2FzIGNyZWF0ZWQgd2l0aCB0aGUgY2x1c3Rlci5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkZWZhdWx0UHJvZmlsZTogRmFyZ2F0ZVByb2ZpbGU7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEZhcmdhdGVDbHVzdGVyUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIC4uLnByb3BzLFxuICAgICAgZGVmYXVsdENhcGFjaXR5OiAwLFxuICAgICAgZGVmYXVsdENhcGFjaXR5VHlwZTogRGVmYXVsdENhcGFjaXR5VHlwZS5OT0RFR1JPVVAsXG4gICAgICBjb3JlRG5zQ29tcHV0ZVR5cGU6IHByb3BzLmNvcmVEbnNDb21wdXRlVHlwZSA/PyBDb3JlRG5zQ29tcHV0ZVR5cGUuRkFSR0FURSxcbiAgICAgIHZlcnNpb246IHByb3BzLnZlcnNpb24sXG4gICAgfSk7XG4gICAgLy8gRW5oYW5jZWQgQ0RLIEFuYWx5dGljcyBUZWxlbWV0cnlcbiAgICBhZGRDb25zdHJ1Y3RNZXRhZGF0YSh0aGlzLCBwcm9wcyk7XG5cbiAgICB0aGlzLmRlZmF1bHRQcm9maWxlID0gdGhpcy5hZGRGYXJnYXRlUHJvZmlsZShcbiAgICAgIHByb3BzLmRlZmF1bHRQcm9maWxlPy5mYXJnYXRlUHJvZmlsZU5hbWUgPz8gKHByb3BzLmRlZmF1bHRQcm9maWxlID8gJ2N1c3RvbScgOiAnZGVmYXVsdCcpLFxuICAgICAgcHJvcHMuZGVmYXVsdFByb2ZpbGUgPz8ge1xuICAgICAgICBzZWxlY3RvcnM6IFtcbiAgICAgICAgICB7IG5hbWVzcGFjZTogJ2RlZmF1bHQnIH0sXG4gICAgICAgICAgeyBuYW1lc3BhY2U6ICdrdWJlLXN5c3RlbScgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgKTtcbiAgfVxufVxuIl19