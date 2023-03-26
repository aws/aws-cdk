"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestedStackSynthesizer = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const stack_synthesizer_1 = require("./stack-synthesizer");
/**
 * Synthesizer for a nested stack
 *
 * Forwards all calls to the parent stack's synthesizer.
 *
 * This synthesizer is automatically used for `NestedStack` constructs.
 * App builder do not need to use this class directly.
 */
class NestedStackSynthesizer extends stack_synthesizer_1.StackSynthesizer {
    constructor(parentDeployment) {
        super();
        this.parentDeployment = parentDeployment;
        try {
            jsiiDeprecationWarnings._aws_cdk_core_IStackSynthesizer(parentDeployment);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, NestedStackSynthesizer);
            }
            throw error;
        }
    }
    get bootstrapQualifier() {
        return this.parentDeployment.bootstrapQualifier;
    }
    addFileAsset(asset) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_FileAssetSource(asset);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addFileAsset);
            }
            throw error;
        }
        // Forward to parent deployment. By the magic of cross-stack references any parameter
        // returned and used will magically be forwarded to the nested stack.
        return this.parentDeployment.addFileAsset(asset);
    }
    addDockerImageAsset(asset) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_DockerImageAssetSource(asset);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addDockerImageAsset);
            }
            throw error;
        }
        // Forward to parent deployment. By the magic of cross-stack references any parameter
        // returned and used will magically be forwarded to the nested stack.
        return this.parentDeployment.addDockerImageAsset(asset);
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
        // Synthesize the template, but don't emit as a cloud assembly artifact.
        // It will be registered as an S3 asset of its parent instead.
        this.synthesizeTemplate(session);
    }
}
_a = JSII_RTTI_SYMBOL_1;
NestedStackSynthesizer[_a] = { fqn: "@aws-cdk/core.NestedStackSynthesizer", version: "0.0.0" };
exports.NestedStackSynthesizer = NestedStackSynthesizer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVzdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibmVzdGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDJEQUF1RDtBQUl2RDs7Ozs7OztHQU9HO0FBQ0gsTUFBYSxzQkFBdUIsU0FBUSxvQ0FBZ0I7SUFDMUQsWUFBNkIsZ0JBQW1DO1FBQzlELEtBQUssRUFBRSxDQUFDO1FBRG1CLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBbUI7Ozs7OzsrQ0FEckQsc0JBQXNCOzs7O0tBR2hDO0lBRUQsSUFBVyxrQkFBa0I7UUFDM0IsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUM7S0FDakQ7SUFFTSxZQUFZLENBQUMsS0FBc0I7Ozs7Ozs7Ozs7UUFDeEMscUZBQXFGO1FBQ3JGLHFFQUFxRTtRQUNyRSxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDbEQ7SUFFTSxtQkFBbUIsQ0FBQyxLQUE2Qjs7Ozs7Ozs7OztRQUN0RCxxRkFBcUY7UUFDckYscUVBQXFFO1FBQ3JFLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3pEO0lBRU0sVUFBVSxDQUFDLE9BQTBCOzs7Ozs7Ozs7O1FBQzFDLHdFQUF3RTtRQUN4RSw4REFBOEQ7UUFDOUQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ2xDOzs7O0FBekJVLHdEQUFzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrU3ludGhlc2l6ZXIgfSBmcm9tICcuL3N0YWNrLXN5bnRoZXNpemVyJztcbmltcG9ydCB7IElTdGFja1N5bnRoZXNpemVyLCBJU3ludGhlc2lzU2Vzc2lvbiB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgRG9ja2VySW1hZ2VBc3NldExvY2F0aW9uLCBEb2NrZXJJbWFnZUFzc2V0U291cmNlLCBGaWxlQXNzZXRMb2NhdGlvbiwgRmlsZUFzc2V0U291cmNlIH0gZnJvbSAnLi4vYXNzZXRzJztcblxuLyoqXG4gKiBTeW50aGVzaXplciBmb3IgYSBuZXN0ZWQgc3RhY2tcbiAqXG4gKiBGb3J3YXJkcyBhbGwgY2FsbHMgdG8gdGhlIHBhcmVudCBzdGFjaydzIHN5bnRoZXNpemVyLlxuICpcbiAqIFRoaXMgc3ludGhlc2l6ZXIgaXMgYXV0b21hdGljYWxseSB1c2VkIGZvciBgTmVzdGVkU3RhY2tgIGNvbnN0cnVjdHMuXG4gKiBBcHAgYnVpbGRlciBkbyBub3QgbmVlZCB0byB1c2UgdGhpcyBjbGFzcyBkaXJlY3RseS5cbiAqL1xuZXhwb3J0IGNsYXNzIE5lc3RlZFN0YWNrU3ludGhlc2l6ZXIgZXh0ZW5kcyBTdGFja1N5bnRoZXNpemVyIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwYXJlbnREZXBsb3ltZW50OiBJU3RhY2tTeW50aGVzaXplcikge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGJvb3RzdHJhcFF1YWxpZmllcigpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLnBhcmVudERlcGxveW1lbnQuYm9vdHN0cmFwUXVhbGlmaWVyO1xuICB9XG5cbiAgcHVibGljIGFkZEZpbGVBc3NldChhc3NldDogRmlsZUFzc2V0U291cmNlKTogRmlsZUFzc2V0TG9jYXRpb24ge1xuICAgIC8vIEZvcndhcmQgdG8gcGFyZW50IGRlcGxveW1lbnQuIEJ5IHRoZSBtYWdpYyBvZiBjcm9zcy1zdGFjayByZWZlcmVuY2VzIGFueSBwYXJhbWV0ZXJcbiAgICAvLyByZXR1cm5lZCBhbmQgdXNlZCB3aWxsIG1hZ2ljYWxseSBiZSBmb3J3YXJkZWQgdG8gdGhlIG5lc3RlZCBzdGFjay5cbiAgICByZXR1cm4gdGhpcy5wYXJlbnREZXBsb3ltZW50LmFkZEZpbGVBc3NldChhc3NldCk7XG4gIH1cblxuICBwdWJsaWMgYWRkRG9ja2VySW1hZ2VBc3NldChhc3NldDogRG9ja2VySW1hZ2VBc3NldFNvdXJjZSk6IERvY2tlckltYWdlQXNzZXRMb2NhdGlvbiB7XG4gICAgLy8gRm9yd2FyZCB0byBwYXJlbnQgZGVwbG95bWVudC4gQnkgdGhlIG1hZ2ljIG9mIGNyb3NzLXN0YWNrIHJlZmVyZW5jZXMgYW55IHBhcmFtZXRlclxuICAgIC8vIHJldHVybmVkIGFuZCB1c2VkIHdpbGwgbWFnaWNhbGx5IGJlIGZvcndhcmRlZCB0byB0aGUgbmVzdGVkIHN0YWNrLlxuICAgIHJldHVybiB0aGlzLnBhcmVudERlcGxveW1lbnQuYWRkRG9ja2VySW1hZ2VBc3NldChhc3NldCk7XG4gIH1cblxuICBwdWJsaWMgc3ludGhlc2l6ZShzZXNzaW9uOiBJU3ludGhlc2lzU2Vzc2lvbik6IHZvaWQge1xuICAgIC8vIFN5bnRoZXNpemUgdGhlIHRlbXBsYXRlLCBidXQgZG9uJ3QgZW1pdCBhcyBhIGNsb3VkIGFzc2VtYmx5IGFydGlmYWN0LlxuICAgIC8vIEl0IHdpbGwgYmUgcmVnaXN0ZXJlZCBhcyBhbiBTMyBhc3NldCBvZiBpdHMgcGFyZW50IGluc3RlYWQuXG4gICAgdGhpcy5zeW50aGVzaXplVGVtcGxhdGUoc2Vzc2lvbik7XG4gIH1cbn1cbiJdfQ==