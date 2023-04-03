"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BootstraplessSynthesizer = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const default_synthesizer_1 = require("./default-synthesizer");
/**
 * Synthesizer that reuses bootstrap roles from a different region
 *
 * A special synthesizer that behaves similarly to `DefaultStackSynthesizer`,
 * but doesn't require bootstrapping the environment it operates in. Instead,
 * it will re-use the Roles that were created for a different region (which
 * is possible because IAM is a global service).
 *
 * However, it will not assume asset buckets or repositories have been created,
 * and therefore does not support assets.
 *
 * The name is poorly chosen -- it does still require bootstrapping, it just
 * does not support assets.
 *
 * Used by the CodePipeline construct for the support stacks needed for
 * cross-region replication S3 buckets. App builders do not need to use this
 * synthesizer directly.
 */
class BootstraplessSynthesizer extends default_synthesizer_1.DefaultStackSynthesizer {
    constructor(props) {
        super({
            deployRoleArn: props.deployRoleArn,
            cloudFormationExecutionRole: props.cloudFormationExecutionRoleArn,
            generateBootstrapVersionRule: false,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_core_BootstraplessSynthesizerProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, BootstraplessSynthesizer);
            }
            throw error;
        }
    }
    addFileAsset(_asset) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_FileAssetSource(_asset);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addFileAsset);
            }
            throw error;
        }
        throw new Error('Cannot add assets to a Stack that uses the BootstraplessSynthesizer');
    }
    addDockerImageAsset(_asset) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_DockerImageAssetSource(_asset);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addDockerImageAsset);
            }
            throw error;
        }
        throw new Error('Cannot add assets to a Stack that uses the BootstraplessSynthesizer');
    }
    synthesize(session) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_ISynthesisSession(session);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.synthesize);
            }
            throw error;
        }
        this.synthesizeStackTemplate(this.boundStack, session);
        // do _not_ treat the template as an asset,
        // because this synthesizer doesn't have a bootstrap bucket to put it in
        this.emitArtifact(session, {
            assumeRoleArn: this.deployRoleArn,
            cloudFormationExecutionRoleArn: this.cloudFormationExecutionRoleArn,
        });
    }
}
exports.BootstraplessSynthesizer = BootstraplessSynthesizer;
_a = JSII_RTTI_SYMBOL_1;
BootstraplessSynthesizer[_a] = { fqn: "@aws-cdk/core.BootstraplessSynthesizer", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwbGVzcy1zeW50aGVzaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJvb3RzdHJhcGxlc3Mtc3ludGhlc2l6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsK0RBQWdFO0FBd0JoRTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFDSCxNQUFhLHdCQUF5QixTQUFRLDZDQUF1QjtJQUNuRSxZQUFZLEtBQW9DO1FBQzlDLEtBQUssQ0FBQztZQUNKLGFBQWEsRUFBRSxLQUFLLENBQUMsYUFBYTtZQUNsQywyQkFBMkIsRUFBRSxLQUFLLENBQUMsOEJBQThCO1lBQ2pFLDRCQUE0QixFQUFFLEtBQUs7U0FDcEMsQ0FBQyxDQUFDOzs7Ozs7K0NBTk0sd0JBQXdCOzs7O0tBT2xDO0lBRU0sWUFBWSxDQUFDLE1BQXVCOzs7Ozs7Ozs7O1FBQ3pDLE1BQU0sSUFBSSxLQUFLLENBQUMscUVBQXFFLENBQUMsQ0FBQztLQUN4RjtJQUVNLG1CQUFtQixDQUFDLE1BQThCOzs7Ozs7Ozs7O1FBQ3ZELE1BQU0sSUFBSSxLQUFLLENBQUMscUVBQXFFLENBQUMsQ0FBQztLQUN4RjtJQUVNLFVBQVUsQ0FBQyxPQUEwQjs7Ozs7Ozs7OztRQUMxQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUV2RCwyQ0FBMkM7UUFDM0Msd0VBQXdFO1FBQ3hFLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFO1lBQ3pCLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYTtZQUNqQyw4QkFBOEIsRUFBRSxJQUFJLENBQUMsOEJBQThCO1NBQ3BFLENBQUMsQ0FBQztLQUNKOztBQTFCSCw0REEyQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEZWZhdWx0U3RhY2tTeW50aGVzaXplciB9IGZyb20gJy4vZGVmYXVsdC1zeW50aGVzaXplcic7XG5pbXBvcnQgeyBJU3ludGhlc2lzU2Vzc2lvbiB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgRG9ja2VySW1hZ2VBc3NldExvY2F0aW9uLCBEb2NrZXJJbWFnZUFzc2V0U291cmNlLCBGaWxlQXNzZXRMb2NhdGlvbiwgRmlsZUFzc2V0U291cmNlIH0gZnJvbSAnLi4vYXNzZXRzJztcblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBvZiBgQm9vdHN0cmFwbGVzc1N5bnRoZXNpemVyYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBCb290c3RyYXBsZXNzU3ludGhlc2l6ZXJQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgZGVwbG95IFJvbGUgQVJOIHRvIHVzZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBkZXBsb3kgcm9sZSAodXNlIENMSSBjcmVkZW50aWFscylcbiAgICpcbiAgICovXG4gIHJlYWRvbmx5IGRlcGxveVJvbGVBcm4/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBDRk4gZXhlY3V0aW9uIFJvbGUgQVJOIHRvIHVzZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBDbG91ZEZvcm1hdGlvbiByb2xlICh1c2UgQ0xJIGNyZWRlbnRpYWxzKVxuICAgKi9cbiAgcmVhZG9ubHkgY2xvdWRGb3JtYXRpb25FeGVjdXRpb25Sb2xlQXJuPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFN5bnRoZXNpemVyIHRoYXQgcmV1c2VzIGJvb3RzdHJhcCByb2xlcyBmcm9tIGEgZGlmZmVyZW50IHJlZ2lvblxuICpcbiAqIEEgc3BlY2lhbCBzeW50aGVzaXplciB0aGF0IGJlaGF2ZXMgc2ltaWxhcmx5IHRvIGBEZWZhdWx0U3RhY2tTeW50aGVzaXplcmAsXG4gKiBidXQgZG9lc24ndCByZXF1aXJlIGJvb3RzdHJhcHBpbmcgdGhlIGVudmlyb25tZW50IGl0IG9wZXJhdGVzIGluLiBJbnN0ZWFkLFxuICogaXQgd2lsbCByZS11c2UgdGhlIFJvbGVzIHRoYXQgd2VyZSBjcmVhdGVkIGZvciBhIGRpZmZlcmVudCByZWdpb24gKHdoaWNoXG4gKiBpcyBwb3NzaWJsZSBiZWNhdXNlIElBTSBpcyBhIGdsb2JhbCBzZXJ2aWNlKS5cbiAqXG4gKiBIb3dldmVyLCBpdCB3aWxsIG5vdCBhc3N1bWUgYXNzZXQgYnVja2V0cyBvciByZXBvc2l0b3JpZXMgaGF2ZSBiZWVuIGNyZWF0ZWQsXG4gKiBhbmQgdGhlcmVmb3JlIGRvZXMgbm90IHN1cHBvcnQgYXNzZXRzLlxuICpcbiAqIFRoZSBuYW1lIGlzIHBvb3JseSBjaG9zZW4gLS0gaXQgZG9lcyBzdGlsbCByZXF1aXJlIGJvb3RzdHJhcHBpbmcsIGl0IGp1c3RcbiAqIGRvZXMgbm90IHN1cHBvcnQgYXNzZXRzLlxuICpcbiAqIFVzZWQgYnkgdGhlIENvZGVQaXBlbGluZSBjb25zdHJ1Y3QgZm9yIHRoZSBzdXBwb3J0IHN0YWNrcyBuZWVkZWQgZm9yXG4gKiBjcm9zcy1yZWdpb24gcmVwbGljYXRpb24gUzMgYnVja2V0cy4gQXBwIGJ1aWxkZXJzIGRvIG5vdCBuZWVkIHRvIHVzZSB0aGlzXG4gKiBzeW50aGVzaXplciBkaXJlY3RseS5cbiAqL1xuZXhwb3J0IGNsYXNzIEJvb3RzdHJhcGxlc3NTeW50aGVzaXplciBleHRlbmRzIERlZmF1bHRTdGFja1N5bnRoZXNpemVyIHtcbiAgY29uc3RydWN0b3IocHJvcHM6IEJvb3RzdHJhcGxlc3NTeW50aGVzaXplclByb3BzKSB7XG4gICAgc3VwZXIoe1xuICAgICAgZGVwbG95Um9sZUFybjogcHJvcHMuZGVwbG95Um9sZUFybixcbiAgICAgIGNsb3VkRm9ybWF0aW9uRXhlY3V0aW9uUm9sZTogcHJvcHMuY2xvdWRGb3JtYXRpb25FeGVjdXRpb25Sb2xlQXJuLFxuICAgICAgZ2VuZXJhdGVCb290c3RyYXBWZXJzaW9uUnVsZTogZmFsc2UsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYWRkRmlsZUFzc2V0KF9hc3NldDogRmlsZUFzc2V0U291cmNlKTogRmlsZUFzc2V0TG9jYXRpb24ge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGFkZCBhc3NldHMgdG8gYSBTdGFjayB0aGF0IHVzZXMgdGhlIEJvb3RzdHJhcGxlc3NTeW50aGVzaXplcicpO1xuICB9XG5cbiAgcHVibGljIGFkZERvY2tlckltYWdlQXNzZXQoX2Fzc2V0OiBEb2NrZXJJbWFnZUFzc2V0U291cmNlKTogRG9ja2VySW1hZ2VBc3NldExvY2F0aW9uIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBhZGQgYXNzZXRzIHRvIGEgU3RhY2sgdGhhdCB1c2VzIHRoZSBCb290c3RyYXBsZXNzU3ludGhlc2l6ZXInKTtcbiAgfVxuXG4gIHB1YmxpYyBzeW50aGVzaXplKHNlc3Npb246IElTeW50aGVzaXNTZXNzaW9uKTogdm9pZCB7XG4gICAgdGhpcy5zeW50aGVzaXplU3RhY2tUZW1wbGF0ZSh0aGlzLmJvdW5kU3RhY2ssIHNlc3Npb24pO1xuXG4gICAgLy8gZG8gX25vdF8gdHJlYXQgdGhlIHRlbXBsYXRlIGFzIGFuIGFzc2V0LFxuICAgIC8vIGJlY2F1c2UgdGhpcyBzeW50aGVzaXplciBkb2Vzbid0IGhhdmUgYSBib290c3RyYXAgYnVja2V0IHRvIHB1dCBpdCBpblxuICAgIHRoaXMuZW1pdEFydGlmYWN0KHNlc3Npb24sIHtcbiAgICAgIGFzc3VtZVJvbGVBcm46IHRoaXMuZGVwbG95Um9sZUFybixcbiAgICAgIGNsb3VkRm9ybWF0aW9uRXhlY3V0aW9uUm9sZUFybjogdGhpcy5jbG91ZEZvcm1hdGlvbkV4ZWN1dGlvblJvbGVBcm4sXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==