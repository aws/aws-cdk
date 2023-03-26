"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stage = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cxapi = require("@aws-cdk/cx-api");
const constructs_1 = require("constructs");
const synthesis_1 = require("./private/synthesis");
const STAGE_SYMBOL = Symbol.for('@aws-cdk/core.Stage');
/**
 * An abstract application modeling unit consisting of Stacks that should be
 * deployed together.
 *
 * Derive a subclass of `Stage` and use it to model a single instance of your
 * application.
 *
 * You can then instantiate your subclass multiple times to model multiple
 * copies of your application which should be be deployed to different
 * environments.
 */
class Stage extends constructs_1.Construct {
    /**
     * Return the stage this construct is contained with, if available. If called
     * on a nested stage, returns its parent.
     *
     */
    static of(construct) {
        return constructs_1.Node.of(construct).scopes.reverse().slice(1).find(Stage.isStage);
    }
    /**
     * Test whether the given construct is a stage.
     *
     */
    static isStage(x) {
        return x !== null && typeof (x) === 'object' && STAGE_SYMBOL in x;
    }
    constructor(scope, id, props = {}) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_core_StageProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Stage);
            }
            throw error;
        }
        if (id !== '' && !/^[a-z][a-z0-9\-\_\.]+$/i.test(id)) {
            throw new Error(`invalid stage name "${id}". Stage name must start with a letter and contain only alphanumeric characters, hypens ('-'), underscores ('_') and periods ('.')`);
        }
        Object.defineProperty(this, STAGE_SYMBOL, { value: true });
        this.parentStage = Stage.of(this);
        this.region = props.env?.region ?? this.parentStage?.region;
        this.account = props.env?.account ?? this.parentStage?.account;
        props.permissionsBoundary?._bind(this);
        this._assemblyBuilder = this.createBuilder(props.outdir);
        this.stageName = [this.parentStage?.stageName, props.stageName ?? id].filter(x => x).join('-');
    }
    /**
     * The cloud assembly output directory.
     */
    get outdir() {
        return this._assemblyBuilder.outdir;
    }
    /**
     * The cloud assembly asset output directory.
     */
    get assetOutdir() {
        return this._assemblyBuilder.assetOutdir;
    }
    /**
     * Artifact ID of the assembly if it is a nested stage. The root stage (app)
     * will return an empty string.
     *
     * Derived from the construct path.
     *
     */
    get artifactId() {
        if (!this.node.path) {
            return '';
        }
        return `assembly-${this.node.path.replace(/\//g, '-').replace(/^-+|-+$/g, '')}`;
    }
    /**
     * Synthesize this stage into a cloud assembly.
     *
     * Once an assembly has been synthesized, it cannot be modified. Subsequent
     * calls will return the same assembly.
     */
    synth(options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_StageSynthesisOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.synth);
            }
            throw error;
        }
        if (!this.assembly || options.force) {
            this.assembly = (0, synthesis_1.synthesize)(this, {
                skipValidation: options.skipValidation,
                validateOnSynthesis: options.validateOnSynthesis,
            });
        }
        return this.assembly;
    }
    createBuilder(outdir) {
        // cannot specify "outdir" if we are a nested stage
        if (this.parentStage && outdir) {
            throw new Error('"outdir" cannot be specified for nested stages');
        }
        // Need to determine fixed output directory already, because we must know where
        // to write sub-assemblies (which must happen before we actually get to this app's
        // synthesize() phase).
        return this.parentStage
            ? this.parentStage._assemblyBuilder.createNestedAssembly(this.artifactId, this.node.path)
            : new cxapi.CloudAssemblyBuilder(outdir);
    }
}
_a = JSII_RTTI_SYMBOL_1;
Stage[_a] = { fqn: "@aws-cdk/core.Stage", version: "0.0.0" };
exports.Stage = Stage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx5Q0FBeUM7QUFDekMsMkNBQXlEO0FBR3pELG1EQUFpRDtBQUVqRCxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFtRXZEOzs7Ozs7Ozs7O0dBVUc7QUFDSCxNQUFhLEtBQU0sU0FBUSxzQkFBUztJQUNsQzs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFxQjtRQUNwQyxPQUFPLGlCQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUN6RTtJQUVEOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBTTtRQUMxQixPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksT0FBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsSUFBSSxZQUFZLElBQUksQ0FBQyxDQUFDO0tBQ2xFO0lBdUNELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsUUFBb0IsRUFBRTtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBeERSLEtBQUs7Ozs7UUEwRGQsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ3BELE1BQU0sSUFBSSxLQUFLLENBQUMsdUJBQXVCLEVBQUUsb0lBQW9JLENBQUMsQ0FBQztTQUNoTDtRQUVELE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRTNELElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVsQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDO1FBQzVELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUM7UUFHL0QsS0FBSyxDQUFDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV2QyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2hHO0lBRUQ7O09BRUc7SUFDSCxJQUFXLE1BQU07UUFDZixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUM7S0FDckM7SUFFRDs7T0FFRztJQUNILElBQVcsV0FBVztRQUNwQixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUM7S0FDMUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxJQUFXLFVBQVU7UUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQUUsT0FBTyxFQUFFLENBQUM7U0FBRTtRQUNuQyxPQUFPLFlBQVksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7S0FDakY7SUFFRDs7Ozs7T0FLRztJQUNJLEtBQUssQ0FBQyxVQUFpQyxFQUFHOzs7Ozs7Ozs7O1FBQy9DLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7WUFDbkMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFBLHNCQUFVLEVBQUMsSUFBSSxFQUFFO2dCQUMvQixjQUFjLEVBQUUsT0FBTyxDQUFDLGNBQWM7Z0JBQ3RDLG1CQUFtQixFQUFFLE9BQU8sQ0FBQyxtQkFBbUI7YUFDakQsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7S0FDdEI7SUFFTyxhQUFhLENBQUMsTUFBZTtRQUNuQyxtREFBbUQ7UUFDbkQsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLE1BQU0sRUFBRTtZQUM5QixNQUFNLElBQUksS0FBSyxDQUFDLGdEQUFnRCxDQUFDLENBQUM7U0FDbkU7UUFFRCwrRUFBK0U7UUFDL0Usa0ZBQWtGO1FBQ2xGLHVCQUF1QjtRQUN2QixPQUFPLElBQUksQ0FBQyxXQUFXO1lBQ3JCLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDekYsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzVDOzs7O0FBbklVLHNCQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IElDb25zdHJ1Y3QsIENvbnN0cnVjdCwgTm9kZSB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgRW52aXJvbm1lbnQgfSBmcm9tICcuL2Vudmlyb25tZW50JztcbmltcG9ydCB7IFBlcm1pc3Npb25zQm91bmRhcnkgfSBmcm9tICcuL3Blcm1pc3Npb25zLWJvdW5kYXJ5JztcbmltcG9ydCB7IHN5bnRoZXNpemUgfSBmcm9tICcuL3ByaXZhdGUvc3ludGhlc2lzJztcblxuY29uc3QgU1RBR0VfU1lNQk9MID0gU3ltYm9sLmZvcignQGF3cy1jZGsvY29yZS5TdGFnZScpO1xuXG4vKipcbiAqIEluaXRpYWxpemF0aW9uIHByb3BzIGZvciBhIHN0YWdlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFN0YWdlUHJvcHMge1xuICAvKipcbiAgICogRGVmYXVsdCBBV1MgZW52aXJvbm1lbnQgKGFjY291bnQvcmVnaW9uKSBmb3IgYFN0YWNrYHMgaW4gdGhpcyBgU3RhZ2VgLlxuICAgKlxuICAgKiBTdGFja3MgZGVmaW5lZCBpbnNpZGUgdGhpcyBgU3RhZ2VgIHdpdGggZWl0aGVyIGByZWdpb25gIG9yIGBhY2NvdW50YCBtaXNzaW5nXG4gICAqIGZyb20gaXRzIGVudiB3aWxsIHVzZSB0aGUgY29ycmVzcG9uZGluZyBmaWVsZCBnaXZlbiBoZXJlLlxuICAgKlxuICAgKiBJZiBlaXRoZXIgYHJlZ2lvbmAgb3IgYGFjY291bnRgaXMgaXMgbm90IGNvbmZpZ3VyZWQgZm9yIGBTdGFja2AgKGVpdGhlciBvblxuICAgKiB0aGUgYFN0YWNrYCBpdHNlbGYgb3Igb24gdGhlIGNvbnRhaW5pbmcgYFN0YWdlYCksIHRoZSBTdGFjayB3aWxsIGJlXG4gICAqICplbnZpcm9ubWVudC1hZ25vc3RpYyouXG4gICAqXG4gICAqIEVudmlyb25tZW50LWFnbm9zdGljIHN0YWNrcyBjYW4gYmUgZGVwbG95ZWQgdG8gYW55IGVudmlyb25tZW50LCBtYXkgbm90IGJlXG4gICAqIGFibGUgdG8gdGFrZSBhZHZhbnRhZ2Ugb2YgYWxsIGZlYXR1cmVzIG9mIHRoZSBDREsuIEZvciBleGFtcGxlLCB0aGV5IHdpbGxcbiAgICogbm90IGJlIGFibGUgdG8gdXNlIGVudmlyb25tZW50YWwgY29udGV4dCBsb29rdXBzLCB3aWxsIG5vdCBhdXRvbWF0aWNhbGx5XG4gICAqIHRyYW5zbGF0ZSBTZXJ2aWNlIFByaW5jaXBhbHMgdG8gdGhlIHJpZ2h0IGZvcm1hdCBiYXNlZCBvbiB0aGUgZW52aXJvbm1lbnQnc1xuICAgKiBBV1MgcGFydGl0aW9uLCBhbmQgb3RoZXIgc3VjaCBlbmhhbmNlbWVudHMuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIC8vIFVzZSBhIGNvbmNyZXRlIGFjY291bnQgYW5kIHJlZ2lvbiB0byBkZXBsb3kgdGhpcyBTdGFnZSB0b1xuICAgKiBuZXcgU3RhZ2UoYXBwLCAnU3RhZ2UxJywge1xuICAgKiAgIGVudjogeyBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJywgcmVnaW9uOiAndXMtZWFzdC0xJyB9LFxuICAgKiB9KTtcbiAgICpcbiAgICogLy8gVXNlIHRoZSBDTEkncyBjdXJyZW50IGNyZWRlbnRpYWxzIHRvIGRldGVybWluZSB0aGUgdGFyZ2V0IGVudmlyb25tZW50XG4gICAqIG5ldyBTdGFnZShhcHAsICdTdGFnZTInLCB7XG4gICAqICAgZW52OiB7IGFjY291bnQ6IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX0FDQ09VTlQsIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfUkVHSU9OIH0sXG4gICAqIH0pO1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIFRoZSBlbnZpcm9ubWVudHMgc2hvdWxkIGJlIGNvbmZpZ3VyZWQgb24gdGhlIGBTdGFja2BzLlxuICAgKi9cbiAgcmVhZG9ubHkgZW52PzogRW52aXJvbm1lbnQ7XG5cbiAgLyoqXG4gICAqIFRoZSBvdXRwdXQgZGlyZWN0b3J5IGludG8gd2hpY2ggdG8gZW1pdCBzeW50aGVzaXplZCBhcnRpZmFjdHMuXG4gICAqXG4gICAqIENhbiBvbmx5IGJlIHNwZWNpZmllZCBpZiB0aGlzIHN0YWdlIGlzIHRoZSByb290IHN0YWdlICh0aGUgYXBwKS4gSWYgdGhpcyBpc1xuICAgKiBzcGVjaWZpZWQgYW5kIHRoaXMgc3RhZ2UgaXMgbmVzdGVkIHdpdGhpbiBhbm90aGVyIHN0YWdlLCBhbiBlcnJvciB3aWxsIGJlXG4gICAqIHRocm93bi5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBmb3IgbmVzdGVkIHN0YWdlcywgb3V0ZGlyIHdpbGwgYmUgZGV0ZXJtaW5lZCBhcyBhIHJlbGF0aXZlXG4gICAqIGRpcmVjdG9yeSB0byB0aGUgb3V0ZGlyIG9mIHRoZSBhcHAuIEZvciBhcHBzLCBpZiBvdXRkaXIgaXMgbm90IHNwZWNpZmllZCwgYVxuICAgKiB0ZW1wb3JhcnkgZGlyZWN0b3J5IHdpbGwgYmUgY3JlYXRlZC5cbiAgICovXG4gIHJlYWRvbmx5IG91dGRpcj86IHN0cmluZztcblxuICAvKipcbiAgICogTmFtZSBvZiB0aGlzIHN0YWdlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIERlcml2ZWQgZnJvbSB0aGUgaWQuXG4gICAqL1xuICByZWFkb25seSBzdGFnZU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE9wdGlvbnMgZm9yIGFwcGx5aW5nIGEgcGVybWlzc2lvbnMgYm91bmRhcnkgdG8gYWxsIElBTSBSb2xlc1xuICAgKiBhbmQgVXNlcnMgY3JlYXRlZCB3aXRoaW4gdGhpcyBTdGFnZVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHBlcm1pc3Npb25zIGJvdW5kYXJ5IGlzIGFwcGxpZWRcbiAgICovXG4gIHJlYWRvbmx5IHBlcm1pc3Npb25zQm91bmRhcnk/OiBQZXJtaXNzaW9uc0JvdW5kYXJ5O1xufVxuXG4vKipcbiAqIEFuIGFic3RyYWN0IGFwcGxpY2F0aW9uIG1vZGVsaW5nIHVuaXQgY29uc2lzdGluZyBvZiBTdGFja3MgdGhhdCBzaG91bGQgYmVcbiAqIGRlcGxveWVkIHRvZ2V0aGVyLlxuICpcbiAqIERlcml2ZSBhIHN1YmNsYXNzIG9mIGBTdGFnZWAgYW5kIHVzZSBpdCB0byBtb2RlbCBhIHNpbmdsZSBpbnN0YW5jZSBvZiB5b3VyXG4gKiBhcHBsaWNhdGlvbi5cbiAqXG4gKiBZb3UgY2FuIHRoZW4gaW5zdGFudGlhdGUgeW91ciBzdWJjbGFzcyBtdWx0aXBsZSB0aW1lcyB0byBtb2RlbCBtdWx0aXBsZVxuICogY29waWVzIG9mIHlvdXIgYXBwbGljYXRpb24gd2hpY2ggc2hvdWxkIGJlIGJlIGRlcGxveWVkIHRvIGRpZmZlcmVudFxuICogZW52aXJvbm1lbnRzLlxuICovXG5leHBvcnQgY2xhc3MgU3RhZ2UgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAvKipcbiAgICogUmV0dXJuIHRoZSBzdGFnZSB0aGlzIGNvbnN0cnVjdCBpcyBjb250YWluZWQgd2l0aCwgaWYgYXZhaWxhYmxlLiBJZiBjYWxsZWRcbiAgICogb24gYSBuZXN0ZWQgc3RhZ2UsIHJldHVybnMgaXRzIHBhcmVudC5cbiAgICpcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgb2YoY29uc3RydWN0OiBJQ29uc3RydWN0KTogU3RhZ2UgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiBOb2RlLm9mKGNvbnN0cnVjdCkuc2NvcGVzLnJldmVyc2UoKS5zbGljZSgxKS5maW5kKFN0YWdlLmlzU3RhZ2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRlc3Qgd2hldGhlciB0aGUgZ2l2ZW4gY29uc3RydWN0IGlzIGEgc3RhZ2UuXG4gICAqXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlzU3RhZ2UoeDogYW55ICk6IHggaXMgU3RhZ2Uge1xuICAgIHJldHVybiB4ICE9PSBudWxsICYmIHR5cGVvZih4KSA9PT0gJ29iamVjdCcgJiYgU1RBR0VfU1lNQk9MIGluIHg7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGRlZmF1bHQgcmVnaW9uIGZvciBhbGwgcmVzb3VyY2VzIGRlZmluZWQgd2l0aGluIHRoaXMgc3RhZ2UuXG4gICAqXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcmVnaW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVmYXVsdCBhY2NvdW50IGZvciBhbGwgcmVzb3VyY2VzIGRlZmluZWQgd2l0aGluIHRoaXMgc3RhZ2UuXG4gICAqXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYWNjb3VudD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGNsb3VkIGFzc2VtYmx5IGJ1aWxkZXIgdGhhdCBpcyBiZWluZyB1c2VkIGZvciB0aGlzIEFwcFxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBfYXNzZW1ibHlCdWlsZGVyOiBjeGFwaS5DbG91ZEFzc2VtYmx5QnVpbGRlcjtcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHN0YWdlLiBCYXNlZCBvbiBuYW1lcyBvZiB0aGUgcGFyZW50IHN0YWdlcyBzZXBhcmF0ZWQgYnlcbiAgICogaHlwZW5zLlxuICAgKlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHN0YWdlTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcGFyZW50IHN0YWdlIG9yIGB1bmRlZmluZWRgIGlmIHRoaXMgaXMgdGhlIGFwcC5cbiAgICogKlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHBhcmVudFN0YWdlPzogU3RhZ2U7XG5cbiAgLyoqXG4gICAqIFRoZSBjYWNoZWQgYXNzZW1ibHkgaWYgaXQgd2FzIGFscmVhZHkgYnVpbHRcbiAgICovXG4gIHByaXZhdGUgYXNzZW1ibHk/OiBjeGFwaS5DbG91ZEFzc2VtYmx5O1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTdGFnZVByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgaWYgKGlkICE9PSAnJyAmJiAhL15bYS16XVthLXowLTlcXC1cXF9cXC5dKyQvaS50ZXN0KGlkKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBpbnZhbGlkIHN0YWdlIG5hbWUgXCIke2lkfVwiLiBTdGFnZSBuYW1lIG11c3Qgc3RhcnQgd2l0aCBhIGxldHRlciBhbmQgY29udGFpbiBvbmx5IGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzLCBoeXBlbnMgKCctJyksIHVuZGVyc2NvcmVzICgnXycpIGFuZCBwZXJpb2RzICgnLicpYCk7XG4gICAgfVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFNUQUdFX1NZTUJPTCwgeyB2YWx1ZTogdHJ1ZSB9KTtcblxuICAgIHRoaXMucGFyZW50U3RhZ2UgPSBTdGFnZS5vZih0aGlzKTtcblxuICAgIHRoaXMucmVnaW9uID0gcHJvcHMuZW52Py5yZWdpb24gPz8gdGhpcy5wYXJlbnRTdGFnZT8ucmVnaW9uO1xuICAgIHRoaXMuYWNjb3VudCA9IHByb3BzLmVudj8uYWNjb3VudCA/PyB0aGlzLnBhcmVudFN0YWdlPy5hY2NvdW50O1xuXG5cbiAgICBwcm9wcy5wZXJtaXNzaW9uc0JvdW5kYXJ5Py5fYmluZCh0aGlzKTtcblxuICAgIHRoaXMuX2Fzc2VtYmx5QnVpbGRlciA9IHRoaXMuY3JlYXRlQnVpbGRlcihwcm9wcy5vdXRkaXIpO1xuICAgIHRoaXMuc3RhZ2VOYW1lID0gW3RoaXMucGFyZW50U3RhZ2U/LnN0YWdlTmFtZSwgcHJvcHMuc3RhZ2VOYW1lID8/IGlkXS5maWx0ZXIoeCA9PiB4KS5qb2luKCctJyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNsb3VkIGFzc2VtYmx5IG91dHB1dCBkaXJlY3RvcnkuXG4gICAqL1xuICBwdWJsaWMgZ2V0IG91dGRpcigpIHtcbiAgICByZXR1cm4gdGhpcy5fYXNzZW1ibHlCdWlsZGVyLm91dGRpcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY2xvdWQgYXNzZW1ibHkgYXNzZXQgb3V0cHV0IGRpcmVjdG9yeS5cbiAgICovXG4gIHB1YmxpYyBnZXQgYXNzZXRPdXRkaXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Fzc2VtYmx5QnVpbGRlci5hc3NldE91dGRpcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcnRpZmFjdCBJRCBvZiB0aGUgYXNzZW1ibHkgaWYgaXQgaXMgYSBuZXN0ZWQgc3RhZ2UuIFRoZSByb290IHN0YWdlIChhcHApXG4gICAqIHdpbGwgcmV0dXJuIGFuIGVtcHR5IHN0cmluZy5cbiAgICpcbiAgICogRGVyaXZlZCBmcm9tIHRoZSBjb25zdHJ1Y3QgcGF0aC5cbiAgICpcbiAgICovXG4gIHB1YmxpYyBnZXQgYXJ0aWZhY3RJZCgpIHtcbiAgICBpZiAoIXRoaXMubm9kZS5wYXRoKSB7IHJldHVybiAnJzsgfVxuICAgIHJldHVybiBgYXNzZW1ibHktJHt0aGlzLm5vZGUucGF0aC5yZXBsYWNlKC9cXC8vZywgJy0nKS5yZXBsYWNlKC9eLSt8LSskL2csICcnKX1gO1xuICB9XG5cbiAgLyoqXG4gICAqIFN5bnRoZXNpemUgdGhpcyBzdGFnZSBpbnRvIGEgY2xvdWQgYXNzZW1ibHkuXG4gICAqXG4gICAqIE9uY2UgYW4gYXNzZW1ibHkgaGFzIGJlZW4gc3ludGhlc2l6ZWQsIGl0IGNhbm5vdCBiZSBtb2RpZmllZC4gU3Vic2VxdWVudFxuICAgKiBjYWxscyB3aWxsIHJldHVybiB0aGUgc2FtZSBhc3NlbWJseS5cbiAgICovXG4gIHB1YmxpYyBzeW50aChvcHRpb25zOiBTdGFnZVN5bnRoZXNpc09wdGlvbnMgPSB7IH0pOiBjeGFwaS5DbG91ZEFzc2VtYmx5IHtcbiAgICBpZiAoIXRoaXMuYXNzZW1ibHkgfHwgb3B0aW9ucy5mb3JjZSkge1xuICAgICAgdGhpcy5hc3NlbWJseSA9IHN5bnRoZXNpemUodGhpcywge1xuICAgICAgICBza2lwVmFsaWRhdGlvbjogb3B0aW9ucy5za2lwVmFsaWRhdGlvbixcbiAgICAgICAgdmFsaWRhdGVPblN5bnRoZXNpczogb3B0aW9ucy52YWxpZGF0ZU9uU3ludGhlc2lzLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuYXNzZW1ibHk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUJ1aWxkZXIob3V0ZGlyPzogc3RyaW5nKSB7XG4gICAgLy8gY2Fubm90IHNwZWNpZnkgXCJvdXRkaXJcIiBpZiB3ZSBhcmUgYSBuZXN0ZWQgc3RhZ2VcbiAgICBpZiAodGhpcy5wYXJlbnRTdGFnZSAmJiBvdXRkaXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCJvdXRkaXJcIiBjYW5ub3QgYmUgc3BlY2lmaWVkIGZvciBuZXN0ZWQgc3RhZ2VzJyk7XG4gICAgfVxuXG4gICAgLy8gTmVlZCB0byBkZXRlcm1pbmUgZml4ZWQgb3V0cHV0IGRpcmVjdG9yeSBhbHJlYWR5LCBiZWNhdXNlIHdlIG11c3Qga25vdyB3aGVyZVxuICAgIC8vIHRvIHdyaXRlIHN1Yi1hc3NlbWJsaWVzICh3aGljaCBtdXN0IGhhcHBlbiBiZWZvcmUgd2UgYWN0dWFsbHkgZ2V0IHRvIHRoaXMgYXBwJ3NcbiAgICAvLyBzeW50aGVzaXplKCkgcGhhc2UpLlxuICAgIHJldHVybiB0aGlzLnBhcmVudFN0YWdlXG4gICAgICA/IHRoaXMucGFyZW50U3RhZ2UuX2Fzc2VtYmx5QnVpbGRlci5jcmVhdGVOZXN0ZWRBc3NlbWJseSh0aGlzLmFydGlmYWN0SWQsIHRoaXMubm9kZS5wYXRoKVxuICAgICAgOiBuZXcgY3hhcGkuQ2xvdWRBc3NlbWJseUJ1aWxkZXIob3V0ZGlyKTtcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGFzc2VtYmx5IHN5bnRoZXNpcy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdGFnZVN5bnRoZXNpc09wdGlvbnMge1xuICAvKipcbiAgICogU2hvdWxkIHdlIHNraXAgY29uc3RydWN0IHZhbGlkYXRpb24uXG4gICAqIEBkZWZhdWx0IC0gZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHNraXBWYWxpZGF0aW9uPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgc3RhY2sgc2hvdWxkIGJlIHZhbGlkYXRlZCBhZnRlciBzeW50aGVzaXMgdG8gY2hlY2sgZm9yIGVycm9yIG1ldGFkYXRhXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHZhbGlkYXRlT25TeW50aGVzaXM/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBGb3JjZSBhIHJlLXN5bnRoLCBldmVuIGlmIHRoZSBzdGFnZSBoYXMgYWxyZWFkeSBiZWVuIHN5bnRoZXNpemVkLlxuICAgKiBUaGlzIGlzIHVzZWQgYnkgdGVzdHMgdG8gYWxsb3cgZm9yIGluY3JlbWVudGFsIHZlcmlmaWNhdGlvbiBvZiB0aGUgb3V0cHV0LlxuICAgKiBEbyBub3QgdXNlIGluIHByb2R1Y3Rpb24uXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBmb3JjZT86IGJvb2xlYW47XG59XG4iXX0=