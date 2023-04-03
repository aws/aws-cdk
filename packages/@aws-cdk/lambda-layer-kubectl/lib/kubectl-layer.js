"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KubectlLayer = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const asset_kubectl_v20_1 = require("@aws-cdk/asset-kubectl-v20");
const lambda = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
/**
 * An AWS Lambda layer that includes `kubectl` and `helm`.
 */
class KubectlLayer extends lambda.LayerVersion {
    constructor(scope, id) {
        super(scope, id, {
            code: lambda.Code.fromAsset(asset_kubectl_v20_1.ASSET_FILE, {
                // we hash the layer directory (it contains the tools versions and Dockerfile) because hashing the zip is non-deterministic
                assetHash: core_1.FileSystem.fingerprint(asset_kubectl_v20_1.LAYER_SOURCE_DIR),
            }),
            description: '/opt/kubectl/kubectl and /opt/helm/helm',
        });
    }
}
exports.KubectlLayer = KubectlLayer;
_a = JSII_RTTI_SYMBOL_1;
KubectlLayer[_a] = { fqn: "@aws-cdk/lambda-layer-kubectl.KubectlLayer", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia3ViZWN0bC1sYXllci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImt1YmVjdGwtbGF5ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrRUFBMEU7QUFDMUUsOENBQThDO0FBQzlDLHdDQUEyQztBQUczQzs7R0FFRztBQUNILE1BQWEsWUFBYSxTQUFRLE1BQU0sQ0FBQyxZQUFZO0lBQ25ELFlBQVksS0FBZ0IsRUFBRSxFQUFVO1FBQ3RDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLDhCQUFVLEVBQUU7Z0JBQ3RDLDJIQUEySDtnQkFDM0gsU0FBUyxFQUFFLGlCQUFVLENBQUMsV0FBVyxDQUFDLG9DQUFnQixDQUFDO2FBQ3BELENBQUM7WUFDRixXQUFXLEVBQUUseUNBQXlDO1NBQ3ZELENBQUMsQ0FBQztLQUNKOztBQVRILG9DQVVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQVNTRVRfRklMRSwgTEFZRVJfU09VUkNFX0RJUiB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2V0LWt1YmVjdGwtdjIwJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCB7IEZpbGVTeXN0ZW0gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG4vKipcbiAqIEFuIEFXUyBMYW1iZGEgbGF5ZXIgdGhhdCBpbmNsdWRlcyBga3ViZWN0bGAgYW5kIGBoZWxtYC5cbiAqL1xuZXhwb3J0IGNsYXNzIEt1YmVjdGxMYXllciBleHRlbmRzIGxhbWJkYS5MYXllclZlcnNpb24ge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoQVNTRVRfRklMRSwge1xuICAgICAgICAvLyB3ZSBoYXNoIHRoZSBsYXllciBkaXJlY3RvcnkgKGl0IGNvbnRhaW5zIHRoZSB0b29scyB2ZXJzaW9ucyBhbmQgRG9ja2VyZmlsZSkgYmVjYXVzZSBoYXNoaW5nIHRoZSB6aXAgaXMgbm9uLWRldGVybWluaXN0aWNcbiAgICAgICAgYXNzZXRIYXNoOiBGaWxlU3lzdGVtLmZpbmdlcnByaW50KExBWUVSX1NPVVJDRV9ESVIpLFxuICAgICAgfSksXG4gICAgICBkZXNjcmlwdGlvbjogJy9vcHQva3ViZWN0bC9rdWJlY3RsIGFuZCAvb3B0L2hlbG0vaGVsbScsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==