"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeProxyAgentLayer = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const asset_node_proxy_agent_v5_1 = require("@aws-cdk/asset-node-proxy-agent-v5");
const lambda = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
/**
 * An AWS Lambda layer that includes the NPM dependency `proxy-agent`.
 */
class NodeProxyAgentLayer extends lambda.LayerVersion {
    constructor(scope, id) {
        super(scope, id, {
            code: lambda.Code.fromAsset(asset_node_proxy_agent_v5_1.ASSET_FILE, {
                // we hash the layer directory (it contains the tools versions and Dockerfile) because hashing the zip is non-deterministic
                assetHash: core_1.FileSystem.fingerprint(asset_node_proxy_agent_v5_1.LAYER_SOURCE_DIR),
            }),
            description: '/opt/nodejs/node_modules/proxy-agent',
        });
    }
}
exports.NodeProxyAgentLayer = NodeProxyAgentLayer;
_a = JSII_RTTI_SYMBOL_1;
NodeProxyAgentLayer[_a] = { fqn: "@aws-cdk/lambda-layer-node-proxy-agent.NodeProxyAgentLayer", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1wcm94eS1hZ2VudC1sYXllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5vZGUtcHJveHktYWdlbnQtbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrRkFBa0Y7QUFDbEYsOENBQThDO0FBQzlDLHdDQUEyQztBQUczQzs7R0FFRztBQUNILE1BQWEsbUJBQW9CLFNBQVEsTUFBTSxDQUFDLFlBQVk7SUFDMUQsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDdEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDZixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsc0NBQVUsRUFBRTtnQkFDdEMsMkhBQTJIO2dCQUMzSCxTQUFTLEVBQUUsaUJBQVUsQ0FBQyxXQUFXLENBQUMsNENBQWdCLENBQUM7YUFDcEQsQ0FBQztZQUNGLFdBQVcsRUFBRSxzQ0FBc0M7U0FDcEQsQ0FBQyxDQUFDO0tBQ0o7O0FBVEgsa0RBVUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBU1NFVF9GSUxFLCBMQVlFUl9TT1VSQ0VfRElSIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXQtbm9kZS1wcm94eS1hZ2VudC12NSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBGaWxlU3lzdGVtIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuLyoqXG4gKiBBbiBBV1MgTGFtYmRhIGxheWVyIHRoYXQgaW5jbHVkZXMgdGhlIE5QTSBkZXBlbmRlbmN5IGBwcm94eS1hZ2VudGAuXG4gKi9cbmV4cG9ydCBjbGFzcyBOb2RlUHJveHlBZ2VudExheWVyIGV4dGVuZHMgbGFtYmRhLkxheWVyVmVyc2lvbiB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChBU1NFVF9GSUxFLCB7XG4gICAgICAgIC8vIHdlIGhhc2ggdGhlIGxheWVyIGRpcmVjdG9yeSAoaXQgY29udGFpbnMgdGhlIHRvb2xzIHZlcnNpb25zIGFuZCBEb2NrZXJmaWxlKSBiZWNhdXNlIGhhc2hpbmcgdGhlIHppcCBpcyBub24tZGV0ZXJtaW5pc3RpY1xuICAgICAgICBhc3NldEhhc2g6IEZpbGVTeXN0ZW0uZmluZ2VycHJpbnQoTEFZRVJfU09VUkNFX0RJUiksXG4gICAgICB9KSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnL29wdC9ub2RlanMvbm9kZV9tb2R1bGVzL3Byb3h5LWFnZW50JyxcbiAgICB9KTtcbiAgfVxufVxuIl19