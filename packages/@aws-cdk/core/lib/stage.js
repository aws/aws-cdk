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
            this.assembly = synthesis_1.synthesize(this, {
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
exports.Stage = Stage;
_a = JSII_RTTI_SYMBOL_1;
Stage[_a] = { fqn: "@aws-cdk/core.Stage", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx5Q0FBeUM7QUFDekMsMkNBQXlEO0FBR3pELG1EQUFpRDtBQUVqRCxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFtRXZEOzs7Ozs7Ozs7O0dBVUc7QUFDSCxNQUFhLEtBQU0sU0FBUSxzQkFBUztJQXVEbEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUFvQixFQUFFO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0F4RFIsS0FBSzs7OztRQTBEZCxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDcEQsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsRUFBRSxvSUFBb0ksQ0FBQyxDQUFDO1NBQ2hMO1FBRUQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFFM0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWxDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxNQUFNLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUM7UUFDNUQsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQztRQUcvRCxLQUFLLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXZDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDaEc7SUF6RUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBcUI7UUFDcEMsT0FBTyxpQkFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDekU7SUFFRDs7O09BR0c7SUFDSSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQU07UUFDMUIsT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJLE9BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLElBQUksWUFBWSxJQUFJLENBQUMsQ0FBQztLQUNsRTtJQTRERDs7T0FFRztJQUNILElBQVcsTUFBTTtRQUNmLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQztLQUNyQztJQUVEOztPQUVHO0lBQ0gsSUFBVyxXQUFXO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQztLQUMxQztJQUVEOzs7Ozs7T0FNRztJQUNILElBQVcsVUFBVTtRQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFBRSxPQUFPLEVBQUUsQ0FBQztTQUFFO1FBQ25DLE9BQU8sWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQztLQUNqRjtJQUVEOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLFVBQWlDLEVBQUc7Ozs7Ozs7Ozs7UUFDL0MsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtZQUNuQyxJQUFJLENBQUMsUUFBUSxHQUFHLHNCQUFVLENBQUMsSUFBSSxFQUFFO2dCQUMvQixjQUFjLEVBQUUsT0FBTyxDQUFDLGNBQWM7Z0JBQ3RDLG1CQUFtQixFQUFFLE9BQU8sQ0FBQyxtQkFBbUI7YUFDakQsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7S0FDdEI7SUFFTyxhQUFhLENBQUMsTUFBZTtRQUNuQyxtREFBbUQ7UUFDbkQsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLE1BQU0sRUFBRTtZQUM5QixNQUFNLElBQUksS0FBSyxDQUFDLGdEQUFnRCxDQUFDLENBQUM7U0FDbkU7UUFFRCwrRUFBK0U7UUFDL0Usa0ZBQWtGO1FBQ2xGLHVCQUF1QjtRQUN2QixPQUFPLElBQUksQ0FBQyxXQUFXO1lBQ3JCLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDekYsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzVDOztBQW5JSCxzQkFvSUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgSUNvbnN0cnVjdCwgQ29uc3RydWN0LCBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBFbnZpcm9ubWVudCB9IGZyb20gJy4vZW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgUGVybWlzc2lvbnNCb3VuZGFyeSB9IGZyb20gJy4vcGVybWlzc2lvbnMtYm91bmRhcnknO1xuaW1wb3J0IHsgc3ludGhlc2l6ZSB9IGZyb20gJy4vcHJpdmF0ZS9zeW50aGVzaXMnO1xuXG5jb25zdCBTVEFHRV9TWU1CT0wgPSBTeW1ib2wuZm9yKCdAYXdzLWNkay9jb3JlLlN0YWdlJyk7XG5cbi8qKlxuICogSW5pdGlhbGl6YXRpb24gcHJvcHMgZm9yIGEgc3RhZ2UuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3RhZ2VQcm9wcyB7XG4gIC8qKlxuICAgKiBEZWZhdWx0IEFXUyBlbnZpcm9ubWVudCAoYWNjb3VudC9yZWdpb24pIGZvciBgU3RhY2tgcyBpbiB0aGlzIGBTdGFnZWAuXG4gICAqXG4gICAqIFN0YWNrcyBkZWZpbmVkIGluc2lkZSB0aGlzIGBTdGFnZWAgd2l0aCBlaXRoZXIgYHJlZ2lvbmAgb3IgYGFjY291bnRgIG1pc3NpbmdcbiAgICogZnJvbSBpdHMgZW52IHdpbGwgdXNlIHRoZSBjb3JyZXNwb25kaW5nIGZpZWxkIGdpdmVuIGhlcmUuXG4gICAqXG4gICAqIElmIGVpdGhlciBgcmVnaW9uYCBvciBgYWNjb3VudGBpcyBpcyBub3QgY29uZmlndXJlZCBmb3IgYFN0YWNrYCAoZWl0aGVyIG9uXG4gICAqIHRoZSBgU3RhY2tgIGl0c2VsZiBvciBvbiB0aGUgY29udGFpbmluZyBgU3RhZ2VgKSwgdGhlIFN0YWNrIHdpbGwgYmVcbiAgICogKmVudmlyb25tZW50LWFnbm9zdGljKi5cbiAgICpcbiAgICogRW52aXJvbm1lbnQtYWdub3N0aWMgc3RhY2tzIGNhbiBiZSBkZXBsb3llZCB0byBhbnkgZW52aXJvbm1lbnQsIG1heSBub3QgYmVcbiAgICogYWJsZSB0byB0YWtlIGFkdmFudGFnZSBvZiBhbGwgZmVhdHVyZXMgb2YgdGhlIENESy4gRm9yIGV4YW1wbGUsIHRoZXkgd2lsbFxuICAgKiBub3QgYmUgYWJsZSB0byB1c2UgZW52aXJvbm1lbnRhbCBjb250ZXh0IGxvb2t1cHMsIHdpbGwgbm90IGF1dG9tYXRpY2FsbHlcbiAgICogdHJhbnNsYXRlIFNlcnZpY2UgUHJpbmNpcGFscyB0byB0aGUgcmlnaHQgZm9ybWF0IGJhc2VkIG9uIHRoZSBlbnZpcm9ubWVudCdzXG4gICAqIEFXUyBwYXJ0aXRpb24sIGFuZCBvdGhlciBzdWNoIGVuaGFuY2VtZW50cy5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogLy8gVXNlIGEgY29uY3JldGUgYWNjb3VudCBhbmQgcmVnaW9uIHRvIGRlcGxveSB0aGlzIFN0YWdlIHRvXG4gICAqIG5ldyBTdGFnZShhcHAsICdTdGFnZTEnLCB7XG4gICAqICAgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLCByZWdpb246ICd1cy1lYXN0LTEnIH0sXG4gICAqIH0pO1xuICAgKlxuICAgKiAvLyBVc2UgdGhlIENMSSdzIGN1cnJlbnQgY3JlZGVudGlhbHMgdG8gZGV0ZXJtaW5lIHRoZSB0YXJnZXQgZW52aXJvbm1lbnRcbiAgICogbmV3IFN0YWdlKGFwcCwgJ1N0YWdlMicsIHtcbiAgICogICBlbnY6IHsgYWNjb3VudDogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfQUNDT1VOVCwgcmVnaW9uOiBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9SRUdJT04gfSxcbiAgICogfSk7XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVGhlIGVudmlyb25tZW50cyBzaG91bGQgYmUgY29uZmlndXJlZCBvbiB0aGUgYFN0YWNrYHMuXG4gICAqL1xuICByZWFkb25seSBlbnY/OiBFbnZpcm9ubWVudDtcblxuICAvKipcbiAgICogVGhlIG91dHB1dCBkaXJlY3RvcnkgaW50byB3aGljaCB0byBlbWl0IHN5bnRoZXNpemVkIGFydGlmYWN0cy5cbiAgICpcbiAgICogQ2FuIG9ubHkgYmUgc3BlY2lmaWVkIGlmIHRoaXMgc3RhZ2UgaXMgdGhlIHJvb3Qgc3RhZ2UgKHRoZSBhcHApLiBJZiB0aGlzIGlzXG4gICAqIHNwZWNpZmllZCBhbmQgdGhpcyBzdGFnZSBpcyBuZXN0ZWQgd2l0aGluIGFub3RoZXIgc3RhZ2UsIGFuIGVycm9yIHdpbGwgYmVcbiAgICogdGhyb3duLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGZvciBuZXN0ZWQgc3RhZ2VzLCBvdXRkaXIgd2lsbCBiZSBkZXRlcm1pbmVkIGFzIGEgcmVsYXRpdmVcbiAgICogZGlyZWN0b3J5IHRvIHRoZSBvdXRkaXIgb2YgdGhlIGFwcC4gRm9yIGFwcHMsIGlmIG91dGRpciBpcyBub3Qgc3BlY2lmaWVkLCBhXG4gICAqIHRlbXBvcmFyeSBkaXJlY3Rvcnkgd2lsbCBiZSBjcmVhdGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgb3V0ZGlyPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoaXMgc3RhZ2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRGVyaXZlZCBmcm9tIHRoZSBpZC5cbiAgICovXG4gIHJlYWRvbmx5IHN0YWdlTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogT3B0aW9ucyBmb3IgYXBwbHlpbmcgYSBwZXJtaXNzaW9ucyBib3VuZGFyeSB0byBhbGwgSUFNIFJvbGVzXG4gICAqIGFuZCBVc2VycyBjcmVhdGVkIHdpdGhpbiB0aGlzIFN0YWdlXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gcGVybWlzc2lvbnMgYm91bmRhcnkgaXMgYXBwbGllZFxuICAgKi9cbiAgcmVhZG9ubHkgcGVybWlzc2lvbnNCb3VuZGFyeT86IFBlcm1pc3Npb25zQm91bmRhcnk7XG59XG5cbi8qKlxuICogQW4gYWJzdHJhY3QgYXBwbGljYXRpb24gbW9kZWxpbmcgdW5pdCBjb25zaXN0aW5nIG9mIFN0YWNrcyB0aGF0IHNob3VsZCBiZVxuICogZGVwbG95ZWQgdG9nZXRoZXIuXG4gKlxuICogRGVyaXZlIGEgc3ViY2xhc3Mgb2YgYFN0YWdlYCBhbmQgdXNlIGl0IHRvIG1vZGVsIGEgc2luZ2xlIGluc3RhbmNlIG9mIHlvdXJcbiAqIGFwcGxpY2F0aW9uLlxuICpcbiAqIFlvdSBjYW4gdGhlbiBpbnN0YW50aWF0ZSB5b3VyIHN1YmNsYXNzIG11bHRpcGxlIHRpbWVzIHRvIG1vZGVsIG11bHRpcGxlXG4gKiBjb3BpZXMgb2YgeW91ciBhcHBsaWNhdGlvbiB3aGljaCBzaG91bGQgYmUgYmUgZGVwbG95ZWQgdG8gZGlmZmVyZW50XG4gKiBlbnZpcm9ubWVudHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBTdGFnZSBleHRlbmRzIENvbnN0cnVjdCB7XG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHN0YWdlIHRoaXMgY29uc3RydWN0IGlzIGNvbnRhaW5lZCB3aXRoLCBpZiBhdmFpbGFibGUuIElmIGNhbGxlZFxuICAgKiBvbiBhIG5lc3RlZCBzdGFnZSwgcmV0dXJucyBpdHMgcGFyZW50LlxuICAgKlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBvZihjb25zdHJ1Y3Q6IElDb25zdHJ1Y3QpOiBTdGFnZSB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIE5vZGUub2YoY29uc3RydWN0KS5zY29wZXMucmV2ZXJzZSgpLnNsaWNlKDEpLmZpbmQoU3RhZ2UuaXNTdGFnZSk7XG4gIH1cblxuICAvKipcbiAgICogVGVzdCB3aGV0aGVyIHRoZSBnaXZlbiBjb25zdHJ1Y3QgaXMgYSBzdGFnZS5cbiAgICpcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNTdGFnZSh4OiBhbnkgKTogeCBpcyBTdGFnZSB7XG4gICAgcmV0dXJuIHggIT09IG51bGwgJiYgdHlwZW9mKHgpID09PSAnb2JqZWN0JyAmJiBTVEFHRV9TWU1CT0wgaW4geDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgZGVmYXVsdCByZWdpb24gZm9yIGFsbCByZXNvdXJjZXMgZGVmaW5lZCB3aXRoaW4gdGhpcyBzdGFnZS5cbiAgICpcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSByZWdpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IGFjY291bnQgZm9yIGFsbCByZXNvdXJjZXMgZGVmaW5lZCB3aXRoaW4gdGhpcyBzdGFnZS5cbiAgICpcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBhY2NvdW50Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgY2xvdWQgYXNzZW1ibHkgYnVpbGRlciB0aGF0IGlzIGJlaW5nIHVzZWQgZm9yIHRoaXMgQXBwXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IF9hc3NlbWJseUJ1aWxkZXI6IGN4YXBpLkNsb3VkQXNzZW1ibHlCdWlsZGVyO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgc3RhZ2UuIEJhc2VkIG9uIG5hbWVzIG9mIHRoZSBwYXJlbnQgc3RhZ2VzIHNlcGFyYXRlZCBieVxuICAgKiBoeXBlbnMuXG4gICAqXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgc3RhZ2VOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBwYXJlbnQgc3RhZ2Ugb3IgYHVuZGVmaW5lZGAgaWYgdGhpcyBpcyB0aGUgYXBwLlxuICAgKiAqXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcGFyZW50U3RhZ2U/OiBTdGFnZTtcblxuICAvKipcbiAgICogVGhlIGNhY2hlZCBhc3NlbWJseSBpZiBpdCB3YXMgYWxyZWFkeSBidWlsdFxuICAgKi9cbiAgcHJpdmF0ZSBhc3NlbWJseT86IGN4YXBpLkNsb3VkQXNzZW1ibHk7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFN0YWdlUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBpZiAoaWQgIT09ICcnICYmICEvXlthLXpdW2EtejAtOVxcLVxcX1xcLl0rJC9pLnRlc3QoaWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGludmFsaWQgc3RhZ2UgbmFtZSBcIiR7aWR9XCIuIFN0YWdlIG5hbWUgbXVzdCBzdGFydCB3aXRoIGEgbGV0dGVyIGFuZCBjb250YWluIG9ubHkgYWxwaGFudW1lcmljIGNoYXJhY3RlcnMsIGh5cGVucyAoJy0nKSwgdW5kZXJzY29yZXMgKCdfJykgYW5kIHBlcmlvZHMgKCcuJylgKTtcbiAgICB9XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgU1RBR0VfU1lNQk9MLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG4gICAgdGhpcy5wYXJlbnRTdGFnZSA9IFN0YWdlLm9mKHRoaXMpO1xuXG4gICAgdGhpcy5yZWdpb24gPSBwcm9wcy5lbnY/LnJlZ2lvbiA/PyB0aGlzLnBhcmVudFN0YWdlPy5yZWdpb247XG4gICAgdGhpcy5hY2NvdW50ID0gcHJvcHMuZW52Py5hY2NvdW50ID8/IHRoaXMucGFyZW50U3RhZ2U/LmFjY291bnQ7XG5cblxuICAgIHByb3BzLnBlcm1pc3Npb25zQm91bmRhcnk/Ll9iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5fYXNzZW1ibHlCdWlsZGVyID0gdGhpcy5jcmVhdGVCdWlsZGVyKHByb3BzLm91dGRpcik7XG4gICAgdGhpcy5zdGFnZU5hbWUgPSBbdGhpcy5wYXJlbnRTdGFnZT8uc3RhZ2VOYW1lLCBwcm9wcy5zdGFnZU5hbWUgPz8gaWRdLmZpbHRlcih4ID0+IHgpLmpvaW4oJy0nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY2xvdWQgYXNzZW1ibHkgb3V0cHV0IGRpcmVjdG9yeS5cbiAgICovXG4gIHB1YmxpYyBnZXQgb3V0ZGlyKCkge1xuICAgIHJldHVybiB0aGlzLl9hc3NlbWJseUJ1aWxkZXIub3V0ZGlyO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBjbG91ZCBhc3NlbWJseSBhc3NldCBvdXRwdXQgZGlyZWN0b3J5LlxuICAgKi9cbiAgcHVibGljIGdldCBhc3NldE91dGRpcigpIHtcbiAgICByZXR1cm4gdGhpcy5fYXNzZW1ibHlCdWlsZGVyLmFzc2V0T3V0ZGlyO1xuICB9XG5cbiAgLyoqXG4gICAqIEFydGlmYWN0IElEIG9mIHRoZSBhc3NlbWJseSBpZiBpdCBpcyBhIG5lc3RlZCBzdGFnZS4gVGhlIHJvb3Qgc3RhZ2UgKGFwcClcbiAgICogd2lsbCByZXR1cm4gYW4gZW1wdHkgc3RyaW5nLlxuICAgKlxuICAgKiBEZXJpdmVkIGZyb20gdGhlIGNvbnN0cnVjdCBwYXRoLlxuICAgKlxuICAgKi9cbiAgcHVibGljIGdldCBhcnRpZmFjdElkKCkge1xuICAgIGlmICghdGhpcy5ub2RlLnBhdGgpIHsgcmV0dXJuICcnOyB9XG4gICAgcmV0dXJuIGBhc3NlbWJseS0ke3RoaXMubm9kZS5wYXRoLnJlcGxhY2UoL1xcLy9nLCAnLScpLnJlcGxhY2UoL14tK3wtKyQvZywgJycpfWA7XG4gIH1cblxuICAvKipcbiAgICogU3ludGhlc2l6ZSB0aGlzIHN0YWdlIGludG8gYSBjbG91ZCBhc3NlbWJseS5cbiAgICpcbiAgICogT25jZSBhbiBhc3NlbWJseSBoYXMgYmVlbiBzeW50aGVzaXplZCwgaXQgY2Fubm90IGJlIG1vZGlmaWVkLiBTdWJzZXF1ZW50XG4gICAqIGNhbGxzIHdpbGwgcmV0dXJuIHRoZSBzYW1lIGFzc2VtYmx5LlxuICAgKi9cbiAgcHVibGljIHN5bnRoKG9wdGlvbnM6IFN0YWdlU3ludGhlc2lzT3B0aW9ucyA9IHsgfSk6IGN4YXBpLkNsb3VkQXNzZW1ibHkge1xuICAgIGlmICghdGhpcy5hc3NlbWJseSB8fCBvcHRpb25zLmZvcmNlKSB7XG4gICAgICB0aGlzLmFzc2VtYmx5ID0gc3ludGhlc2l6ZSh0aGlzLCB7XG4gICAgICAgIHNraXBWYWxpZGF0aW9uOiBvcHRpb25zLnNraXBWYWxpZGF0aW9uLFxuICAgICAgICB2YWxpZGF0ZU9uU3ludGhlc2lzOiBvcHRpb25zLnZhbGlkYXRlT25TeW50aGVzaXMsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5hc3NlbWJseTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlQnVpbGRlcihvdXRkaXI/OiBzdHJpbmcpIHtcbiAgICAvLyBjYW5ub3Qgc3BlY2lmeSBcIm91dGRpclwiIGlmIHdlIGFyZSBhIG5lc3RlZCBzdGFnZVxuICAgIGlmICh0aGlzLnBhcmVudFN0YWdlICYmIG91dGRpcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcIm91dGRpclwiIGNhbm5vdCBiZSBzcGVjaWZpZWQgZm9yIG5lc3RlZCBzdGFnZXMnKTtcbiAgICB9XG5cbiAgICAvLyBOZWVkIHRvIGRldGVybWluZSBmaXhlZCBvdXRwdXQgZGlyZWN0b3J5IGFscmVhZHksIGJlY2F1c2Ugd2UgbXVzdCBrbm93IHdoZXJlXG4gICAgLy8gdG8gd3JpdGUgc3ViLWFzc2VtYmxpZXMgKHdoaWNoIG11c3QgaGFwcGVuIGJlZm9yZSB3ZSBhY3R1YWxseSBnZXQgdG8gdGhpcyBhcHAnc1xuICAgIC8vIHN5bnRoZXNpemUoKSBwaGFzZSkuXG4gICAgcmV0dXJuIHRoaXMucGFyZW50U3RhZ2VcbiAgICAgID8gdGhpcy5wYXJlbnRTdGFnZS5fYXNzZW1ibHlCdWlsZGVyLmNyZWF0ZU5lc3RlZEFzc2VtYmx5KHRoaXMuYXJ0aWZhY3RJZCwgdGhpcy5ub2RlLnBhdGgpXG4gICAgICA6IG5ldyBjeGFwaS5DbG91ZEFzc2VtYmx5QnVpbGRlcihvdXRkaXIpO1xuICB9XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgYXNzZW1ibHkgc3ludGhlc2lzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFN0YWdlU3ludGhlc2lzT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBTaG91bGQgd2Ugc2tpcCBjb25zdHJ1Y3QgdmFsaWRhdGlvbi5cbiAgICogQGRlZmF1bHQgLSBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgc2tpcFZhbGlkYXRpb24/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBzdGFjayBzaG91bGQgYmUgdmFsaWRhdGVkIGFmdGVyIHN5bnRoZXNpcyB0byBjaGVjayBmb3IgZXJyb3IgbWV0YWRhdGFcbiAgICpcbiAgICogQGRlZmF1bHQgLSBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgdmFsaWRhdGVPblN5bnRoZXNpcz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEZvcmNlIGEgcmUtc3ludGgsIGV2ZW4gaWYgdGhlIHN0YWdlIGhhcyBhbHJlYWR5IGJlZW4gc3ludGhlc2l6ZWQuXG4gICAqIFRoaXMgaXMgdXNlZCBieSB0ZXN0cyB0byBhbGxvdyBmb3IgaW5jcmVtZW50YWwgdmVyaWZpY2F0aW9uIG9mIHRoZSBvdXRwdXQuXG4gICAqIERvIG5vdCB1c2UgaW4gcHJvZHVjdGlvbi5cbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGZvcmNlPzogYm9vbGVhbjtcbn1cbiJdfQ==