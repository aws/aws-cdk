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
exports.NestedStackSynthesizer = NestedStackSynthesizer;
_a = JSII_RTTI_SYMBOL_1;
NestedStackSynthesizer[_a] = { fqn: "@aws-cdk/core.NestedStackSynthesizer", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVzdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibmVzdGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDJEQUF1RDtBQUl2RDs7Ozs7OztHQU9HO0FBQ0gsTUFBYSxzQkFBdUIsU0FBUSxvQ0FBZ0I7SUFDMUQsWUFBNkIsZ0JBQW1DO1FBQzlELEtBQUssRUFBRSxDQUFDO1FBRG1CLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBbUI7Ozs7OzsrQ0FEckQsc0JBQXNCOzs7O0tBR2hDO0lBRUQsSUFBVyxrQkFBa0I7UUFDM0IsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUM7S0FDakQ7SUFFTSxZQUFZLENBQUMsS0FBc0I7Ozs7Ozs7Ozs7UUFDeEMscUZBQXFGO1FBQ3JGLHFFQUFxRTtRQUNyRSxPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDbEQ7SUFFTSxtQkFBbUIsQ0FBQyxLQUE2Qjs7Ozs7Ozs7OztRQUN0RCxxRkFBcUY7UUFDckYscUVBQXFFO1FBQ3JFLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3pEO0lBRU0sVUFBVSxDQUFDLE9BQTBCOzs7Ozs7Ozs7O1FBQzFDLHdFQUF3RTtRQUN4RSw4REFBOEQ7UUFDOUQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ2xDOztBQXpCSCx3REEwQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdGFja1N5bnRoZXNpemVyIH0gZnJvbSAnLi9zdGFjay1zeW50aGVzaXplcic7XG5pbXBvcnQgeyBJU3RhY2tTeW50aGVzaXplciwgSVN5bnRoZXNpc1Nlc3Npb24gfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IERvY2tlckltYWdlQXNzZXRMb2NhdGlvbiwgRG9ja2VySW1hZ2VBc3NldFNvdXJjZSwgRmlsZUFzc2V0TG9jYXRpb24sIEZpbGVBc3NldFNvdXJjZSB9IGZyb20gJy4uL2Fzc2V0cyc7XG5cbi8qKlxuICogU3ludGhlc2l6ZXIgZm9yIGEgbmVzdGVkIHN0YWNrXG4gKlxuICogRm9yd2FyZHMgYWxsIGNhbGxzIHRvIHRoZSBwYXJlbnQgc3RhY2sncyBzeW50aGVzaXplci5cbiAqXG4gKiBUaGlzIHN5bnRoZXNpemVyIGlzIGF1dG9tYXRpY2FsbHkgdXNlZCBmb3IgYE5lc3RlZFN0YWNrYCBjb25zdHJ1Y3RzLlxuICogQXBwIGJ1aWxkZXIgZG8gbm90IG5lZWQgdG8gdXNlIHRoaXMgY2xhc3MgZGlyZWN0bHkuXG4gKi9cbmV4cG9ydCBjbGFzcyBOZXN0ZWRTdGFja1N5bnRoZXNpemVyIGV4dGVuZHMgU3RhY2tTeW50aGVzaXplciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcGFyZW50RGVwbG95bWVudDogSVN0YWNrU3ludGhlc2l6ZXIpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIGdldCBib290c3RyYXBRdWFsaWZpZXIoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5wYXJlbnREZXBsb3ltZW50LmJvb3RzdHJhcFF1YWxpZmllcjtcbiAgfVxuXG4gIHB1YmxpYyBhZGRGaWxlQXNzZXQoYXNzZXQ6IEZpbGVBc3NldFNvdXJjZSk6IEZpbGVBc3NldExvY2F0aW9uIHtcbiAgICAvLyBGb3J3YXJkIHRvIHBhcmVudCBkZXBsb3ltZW50LiBCeSB0aGUgbWFnaWMgb2YgY3Jvc3Mtc3RhY2sgcmVmZXJlbmNlcyBhbnkgcGFyYW1ldGVyXG4gICAgLy8gcmV0dXJuZWQgYW5kIHVzZWQgd2lsbCBtYWdpY2FsbHkgYmUgZm9yd2FyZGVkIHRvIHRoZSBuZXN0ZWQgc3RhY2suXG4gICAgcmV0dXJuIHRoaXMucGFyZW50RGVwbG95bWVudC5hZGRGaWxlQXNzZXQoYXNzZXQpO1xuICB9XG5cbiAgcHVibGljIGFkZERvY2tlckltYWdlQXNzZXQoYXNzZXQ6IERvY2tlckltYWdlQXNzZXRTb3VyY2UpOiBEb2NrZXJJbWFnZUFzc2V0TG9jYXRpb24ge1xuICAgIC8vIEZvcndhcmQgdG8gcGFyZW50IGRlcGxveW1lbnQuIEJ5IHRoZSBtYWdpYyBvZiBjcm9zcy1zdGFjayByZWZlcmVuY2VzIGFueSBwYXJhbWV0ZXJcbiAgICAvLyByZXR1cm5lZCBhbmQgdXNlZCB3aWxsIG1hZ2ljYWxseSBiZSBmb3J3YXJkZWQgdG8gdGhlIG5lc3RlZCBzdGFjay5cbiAgICByZXR1cm4gdGhpcy5wYXJlbnREZXBsb3ltZW50LmFkZERvY2tlckltYWdlQXNzZXQoYXNzZXQpO1xuICB9XG5cbiAgcHVibGljIHN5bnRoZXNpemUoc2Vzc2lvbjogSVN5bnRoZXNpc1Nlc3Npb24pOiB2b2lkIHtcbiAgICAvLyBTeW50aGVzaXplIHRoZSB0ZW1wbGF0ZSwgYnV0IGRvbid0IGVtaXQgYXMgYSBjbG91ZCBhc3NlbWJseSBhcnRpZmFjdC5cbiAgICAvLyBJdCB3aWxsIGJlIHJlZ2lzdGVyZWQgYXMgYW4gUzMgYXNzZXQgb2YgaXRzIHBhcmVudCBpbnN0ZWFkLlxuICAgIHRoaXMuc3ludGhlc2l6ZVRlbXBsYXRlKHNlc3Npb24pO1xuICB9XG59XG4iXX0=