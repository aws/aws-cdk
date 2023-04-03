"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsCliLayer = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const asset_awscli_v1_1 = require("@aws-cdk/asset-awscli-v1");
const lambda = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
/**
 * An AWS Lambda layer that includes the AWS CLI.
 */
class AwsCliLayer extends lambda.LayerVersion {
    constructor(scope, id) {
        super(scope, id, {
            code: lambda.Code.fromAsset(asset_awscli_v1_1.ASSET_FILE, {
                // we hash the layer directory (it contains the tools versions and Dockerfile) because hashing the zip is non-deterministic
                assetHash: core_1.FileSystem.fingerprint(asset_awscli_v1_1.LAYER_SOURCE_DIR),
            }),
            description: '/opt/awscli/aws',
        });
    }
}
exports.AwsCliLayer = AwsCliLayer;
_a = JSII_RTTI_SYMBOL_1;
AwsCliLayer[_a] = { fqn: "@aws-cdk/lambda-layer-awscli.AwsCliLayer", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzY2xpLWxheWVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXdzY2xpLWxheWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOERBQXdFO0FBQ3hFLDhDQUE4QztBQUM5Qyx3Q0FBMkM7QUFHM0M7O0dBRUc7QUFDSCxNQUFhLFdBQVksU0FBUSxNQUFNLENBQUMsWUFBWTtJQUNsRCxZQUFZLEtBQWdCLEVBQUUsRUFBVTtRQUN0QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyw0QkFBVSxFQUFFO2dCQUN0QywySEFBMkg7Z0JBQzNILFNBQVMsRUFBRSxpQkFBVSxDQUFDLFdBQVcsQ0FBQyxrQ0FBZ0IsQ0FBQzthQUNwRCxDQUFDO1lBQ0YsV0FBVyxFQUFFLGlCQUFpQjtTQUMvQixDQUFDLENBQUM7S0FDSjs7QUFUSCxrQ0FVQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFTU0VUX0ZJTEUsIExBWUVSX1NPVVJDRV9ESVIgfSBmcm9tICdAYXdzLWNkay9hc3NldC1hd3NjbGktdjEnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgRmlsZVN5c3RlbSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbi8qKlxuICogQW4gQVdTIExhbWJkYSBsYXllciB0aGF0IGluY2x1ZGVzIHRoZSBBV1MgQ0xJLlxuICovXG5leHBvcnQgY2xhc3MgQXdzQ2xpTGF5ZXIgZXh0ZW5kcyBsYW1iZGEuTGF5ZXJWZXJzaW9uIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KEFTU0VUX0ZJTEUsIHtcbiAgICAgICAgLy8gd2UgaGFzaCB0aGUgbGF5ZXIgZGlyZWN0b3J5IChpdCBjb250YWlucyB0aGUgdG9vbHMgdmVyc2lvbnMgYW5kIERvY2tlcmZpbGUpIGJlY2F1c2UgaGFzaGluZyB0aGUgemlwIGlzIG5vbi1kZXRlcm1pbmlzdGljXG4gICAgICAgIGFzc2V0SGFzaDogRmlsZVN5c3RlbS5maW5nZXJwcmludChMQVlFUl9TT1VSQ0VfRElSKSxcbiAgICAgIH0pLFxuICAgICAgZGVzY3JpcHRpb246ICcvb3B0L2F3c2NsaS9hd3MnLFxuICAgIH0pO1xuICB9XG59XG4iXX0=