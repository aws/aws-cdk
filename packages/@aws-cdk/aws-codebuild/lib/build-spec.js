"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeBuildSpecs = exports.BuildSpec = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const s3_assets = require("@aws-cdk/aws-s3-assets");
const core_1 = require("@aws-cdk/core");
const yaml_cfn = require("./private/yaml-cfn");
/**
 * BuildSpec for CodeBuild projects
 */
class BuildSpec {
    constructor() {
    }
    static fromObject(value) {
        return new ObjectBuildSpec(value);
    }
    /**
     * Create a buildspec from an object that will be rendered as YAML in the resulting CloudFormation template.
     *
     * @param value the object containing the buildspec that will be rendered as YAML
     */
    static fromObjectToYaml(value) {
        return new YamlBuildSpec(value);
    }
    /**
     * Use a file from the source as buildspec
     *
     * Use this if you want to use a file different from 'buildspec.yml'`
     */
    static fromSourceFilename(filename) {
        return new FilenameBuildSpec(filename);
    }
    /**
      * Use the contents of a local file as the build spec string
      *
      * Use this if you have a local .yml or .json file that you want to use as the buildspec
      */
    static fromAsset(path) {
        return new AssetBuildSpec(path);
    }
}
exports.BuildSpec = BuildSpec;
_a = JSII_RTTI_SYMBOL_1;
BuildSpec[_a] = { fqn: "@aws-cdk/aws-codebuild.BuildSpec", version: "0.0.0" };
/**
 * BuildSpec that just returns the contents of a local file
 */
class AssetBuildSpec extends BuildSpec {
    constructor(path, options = {}) {
        super();
        this.path = path;
        this.options = options;
        this.isImmediate = true;
    }
    toBuildSpec(scope) {
        if (!scope) {
            throw new Error('`AssetBuildSpec` requires a `scope` argument');
        }
        // If the same AssetCode is used multiple times, retain only the first instantiation.
        if (!this.asset) {
            this.asset = new s3_assets.Asset(scope, 'Code', {
                path: this.path,
                ...this.options,
            });
        }
        else if (core_1.Stack.of(this.asset) !== core_1.Stack.of(scope)) {
            throw new Error(`Asset is already associated with another stack '${core_1.Stack.of(this.asset).stackName}'. ` +
                'Create a new BuildSpec instance for every stack.');
        }
        this.asset.grantRead(scope);
        return this.asset.bucket.arnForObjects(this.asset.s3ObjectKey);
    }
    toString() {
        return `<buildspec file: ${this.path}>`;
    }
}
/**
 * BuildSpec that just returns the input unchanged
 */
class FilenameBuildSpec extends BuildSpec {
    constructor(filename) {
        super();
        this.filename = filename;
        this.isImmediate = false;
    }
    toBuildSpec() {
        return this.filename;
    }
    toString() {
        return `<buildspec file: ${this.filename}>`;
    }
}
/**
 * BuildSpec that understands about structure
 */
class ObjectBuildSpec extends BuildSpec {
    constructor(spec) {
        super();
        this.spec = spec;
        this.isImmediate = true;
    }
    toBuildSpec() {
        // We have to pretty-print the buildspec, otherwise
        // CodeBuild will not recognize it as an inline buildspec.
        return core_1.Lazy.uncachedString({
            produce: (ctx) => core_1.Stack.of(ctx.scope).toJsonString(this.spec, 2),
        });
    }
}
/**
 * BuildSpec that exports into YAML format
 */
class YamlBuildSpec extends BuildSpec {
    constructor(spec) {
        super();
        this.spec = spec;
        this.isImmediate = true;
    }
    toBuildSpec() {
        return yaml_cfn.serialize(this.spec);
    }
}
/**
 * Merge two buildspecs into a new BuildSpec by doing a deep merge
 *
 * We decided to disallow merging of artifact specs, which is
 * actually impossible since we can't merge two buildspecs with a
 * single primary output into a buildspec with multiple outputs.
 * In case of multiple outputs they must have identifiers but we won't have that information.
 *
 * In case of test reports we replace the whole object with the RHS (instead of recursively merging)
*/
function mergeBuildSpecs(lhs, rhs) {
    if (!(lhs instanceof ObjectBuildSpec) || !(rhs instanceof ObjectBuildSpec)) {
        throw new Error('Can only merge buildspecs created using BuildSpec.fromObject()');
    }
    if (lhs.spec.version === '0.1') {
        throw new Error('Cannot extend buildspec at version "0.1". Set the version to "0.2" or higher instead.');
    }
    if (lhs.spec.artifacts && rhs.spec.artifacts) {
        // We decided to disallow merging of artifact specs, which is
        // actually impossible since we can't merge two buildspecs with a
        // single primary output into a buildspec with multiple outputs.
        // In case of multiple outputs they must have identifiers but we won't have that information.
        throw new Error('Only one build spec is allowed to specify artifacts.');
    }
    const lhsSpec = JSON.parse(JSON.stringify(lhs.spec));
    const rhsSpec = JSON.parse(JSON.stringify(rhs.spec));
    normalizeSpec(lhsSpec);
    normalizeSpec(rhsSpec);
    const merged = mergeDeep(lhsSpec, rhsSpec);
    // In case of test reports we replace the whole object with the RHS (instead of recursively merging)
    if (lhsSpec.reports && rhsSpec.reports) {
        merged.reports = { ...lhsSpec.reports, ...rhsSpec.reports };
    }
    return new ObjectBuildSpec(merged);
}
exports.mergeBuildSpecs = mergeBuildSpecs;
/*
 * Normalizes the build spec
 * The CodeBuild runtime allows fields that are defined as string[] to be strings
 * and interprets them as singleton lists.
 * When merging we need to normalize this to have the correct concat semantics
 */
function normalizeSpec(spec) {
    if (spec.env && typeof spec.env['exported-variables'] === 'string') {
        spec.env['exported-variables'] = [spec.env['exported-variables']];
    }
    for (const key in spec.phases) {
        if (Object.prototype.hasOwnProperty.call(spec.phases, key)) {
            normalizeSpecPhase(spec.phases[key]);
        }
    }
    if (spec.reports) {
        for (const key in spec.reports) {
            if (Object.prototype.hasOwnProperty.call(spec.reports, key)) {
                const report = spec.reports[key];
                if (typeof report.files === 'string') {
                    report.files = [report.files];
                }
            }
        }
    }
    if (spec.artifacts) {
        if (typeof spec.artifacts.files === 'string') {
            spec.artifacts.files = [spec.artifacts.files];
        }
        for (const key in spec.artifacts['secondary-artifacts']) {
            if (Object.prototype.hasOwnProperty.call(spec.artifacts['secondary-artifacts'], key)) {
                const secArtifact = spec.artifacts['secondary-artifacts'][key];
                if (typeof secArtifact.files === 'string') {
                    secArtifact.files = [secArtifact.files];
                }
            }
        }
    }
    if (spec.cache && typeof spec.cache.paths === 'string') {
        spec.cache.paths = [spec.cache.paths];
    }
}
function normalizeSpecPhase(phase) {
    if (phase.commands && typeof phase.commands === 'string') {
        phase.commands = [phase.commands];
    }
    if (phase.finally && typeof phase.finally === 'string') {
        phase.finally = [phase.finally];
    }
}
function mergeDeep(lhs, rhs) {
    if (Array.isArray(lhs) && Array.isArray(rhs)) {
        return [...lhs, ...rhs];
    }
    if (Array.isArray(lhs) || Array.isArray(rhs)) {
        return rhs;
    }
    const isObject = (obj) => obj && typeof obj === 'object';
    if (isObject(lhs) && isObject(rhs)) {
        const ret = { ...lhs };
        for (const k of Object.keys(rhs)) {
            ret[k] = k in lhs ? mergeDeep(lhs[k], rhs[k]) : rhs[k];
        }
        return ret;
    }
    return rhs;
}
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGQtc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJ1aWxkLXNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvREFBb0Q7QUFDcEQsd0NBQTZEO0FBRTdELCtDQUErQztBQUcvQzs7R0FFRztBQUNILE1BQXNCLFNBQVM7SUFxQzdCO0tBQ0M7SUFyQ00sTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUE2QjtRQUNwRCxPQUFPLElBQUksZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ25DO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUE2QjtRQUMxRCxPQUFPLElBQUksYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2pDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxRQUFnQjtRQUMvQyxPQUFPLElBQUksaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDeEM7SUFFRDs7OztRQUlJO0lBQ0csTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFZO1FBQ2xDLE9BQU8sSUFBSSxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDakM7O0FBOUJILDhCQTRDQzs7O0FBRUQ7O0dBRUc7QUFDSCxNQUFNLGNBQWUsU0FBUSxTQUFTO0lBSXBDLFlBQTRCLElBQVksRUFBbUIsVUFBa0MsRUFBRztRQUM5RixLQUFLLEVBQUUsQ0FBQztRQURrQixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQW1CLFlBQU8sR0FBUCxPQUFPLENBQThCO1FBSGhGLGdCQUFXLEdBQVksSUFBSSxDQUFDO0tBSzNDO0lBRU0sV0FBVyxDQUFDLEtBQWU7UUFDaEMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQztTQUNqRTtRQUVELHFGQUFxRjtRQUNyRixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNmLElBQUksQ0FBQyxLQUFLLEdB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RUFBRTtRQUNsQyxNQUFNLEdBQUcsR0FBUSxFQUFFLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDNUIsS0FBSyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2hDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDeEQ7UUFDRCxPQUFPLEdBQUcsQ0FBQztLQUNaO0lBRUQsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBQUEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHMzX2Fzc2V0cyBmcm9tICdAYXdzLWNkay9hd3MtczMtYXNzZXRzJztcbmltcG9ydCB7IElSZXNvbHZlQ29udGV4dCwgTGF6eSwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgeWFtbF9jZm4gZnJvbSAnLi9wcml2YXRlL3lhbWwtY2ZuJztcbmltcG9ydCB7IFByb2plY3QgfSBmcm9tICcuL3Byb2plY3QnO1xuXG4vKipcbiAqIEJ1aWxkU3BlYyBmb3IgQ29kZUJ1aWxkIHByb2plY3RzXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCdWlsZFNwZWMge1xuICBwdWJsaWMgc3RhdGljIGZyb21PYmplY3QodmFsdWU6IHsgW2tleTogc3RyaW5nXTogYW55IH0pOiBCdWlsZFNwZWMge1xuICAgIHJldHVybiBuZXcgT2JqZWN0QnVpbGRTcGVjKHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBidWlsZHNwZWMgZnJvbSBhbiBvYmplY3QgdGhhdCB3aWxsIGJlIHJlbmRlcmVkIGFzIFlBTUwgaW4gdGhlIHJlc3VsdGluZyBDbG91ZEZvcm1hdGlvbiB0ZW1wbGF0ZS5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIHRoZSBvYmplY3QgY29udGFpbmluZyB0aGUgYnVpbGRzcGVjIHRoYXQgd2lsbCBiZSByZW5kZXJlZCBhcyBZQU1MXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21PYmplY3RUb1lhbWwodmFsdWU6IHsgW2tleTogc3RyaW5nXTogYW55IH0pOiBCdWlsZFNwZWMge1xuICAgIHJldHVybiBuZXcgWWFtbEJ1aWxkU3BlYyh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIGEgZmlsZSBmcm9tIHRoZSBzb3VyY2UgYXMgYnVpbGRzcGVjXG4gICAqXG4gICAqIFVzZSB0aGlzIGlmIHlvdSB3YW50IHRvIHVzZSBhIGZpbGUgZGlmZmVyZW50IGZyb20gJ2J1aWxkc3BlYy55bWwnYFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tU291cmNlRmlsZW5hbWUoZmlsZW5hbWU6IHN0cmluZyk6IEJ1aWxkU3BlYyB7XG4gICAgcmV0dXJuIG5ldyBGaWxlbmFtZUJ1aWxkU3BlYyhmaWxlbmFtZSk7XG4gIH1cblxuICAvKipcbiAgICAqIFVzZSB0aGUgY29udGVudHMgb2YgYSBsb2NhbCBmaWxlIGFzIHRoZSBidWlsZCBzcGVjIHN0cmluZ1xuICAgICpcbiAgICAqIFVzZSB0aGlzIGlmIHlvdSBoYXZlIGEgbG9jYWwgLnltbCBvciAuanNvbiBmaWxlIHRoYXQgeW91IHdhbnQgdG8gdXNlIGFzIHRoZSBidWlsZHNwZWNcbiAgICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Bc3NldChwYXRoOiBzdHJpbmcpOiBCdWlsZFNwZWMge1xuICAgIHJldHVybiBuZXcgQXNzZXRCdWlsZFNwZWMocGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0aGUgYnVpbGRzcGVjIGlzIGRpcmVjdGx5IGF2YWlsYWJsZSBvciBkZWZlcnJlZCB1bnRpbCBidWlsZC10aW1lXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgaXNJbW1lZGlhdGU6IGJvb2xlYW47XG5cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKCkge1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgcmVwcmVzZW50ZWQgQnVpbGRTcGVjXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgdG9CdWlsZFNwZWMoc2NvcGU/OiBDb25zdHJ1Y3QpOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQnVpbGRTcGVjIHRoYXQganVzdCByZXR1cm5zIHRoZSBjb250ZW50cyBvZiBhIGxvY2FsIGZpbGVcbiAqL1xuY2xhc3MgQXNzZXRCdWlsZFNwZWMgZXh0ZW5kcyBCdWlsZFNwZWMge1xuICBwdWJsaWMgcmVhZG9ubHkgaXNJbW1lZGlhdGU6IGJvb2xlYW4gPSB0cnVlO1xuICBwdWJsaWMgYXNzZXQ/OiBzM19hc3NldHMuQXNzZXQ7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHBhdGg6IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSBvcHRpb25zOiBzM19hc3NldHMuQXNzZXRPcHRpb25zID0geyB9KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyB0b0J1aWxkU3BlYyhzY29wZT86IFByb2plY3QpOiBzdHJpbmcge1xuICAgIGlmICghc2NvcGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYEFzc2V0QnVpbGRTcGVjYCByZXF1aXJlcyBhIGBzY29wZWAgYXJndW1lbnQnKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgc2FtZSBBc3NldENvZGUgaXMgdXNlZCBtdWx0aXBsZSB0aW1lcywgcmV0YWluIG9ubHkgdGhlIGZpcnN0IGluc3RhbnRpYXRpb24uXG4gICAgaWYgKCF0aGlzLmFzc2V0KSB7XG4gICAgICB0aGlzLmFzc2V0ID0gbmV3IHMzX2Fzc2V0cy5Bc3NldChzY29wZSwgJ0NvZGUnLCB7XG4gICAgICAgIHBhdGg6IHRoaXMucGF0aCxcbiAgICAgICAgLi4udGhpcy5vcHRpb25zLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChTdGFjay5vZih0aGlzLmFzc2V0KSAhPT0gU3RhY2sub2Yoc2NvcGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFzc2V0IGlzIGFscmVhZHkgYXNzb2NpYXRlZCB3aXRoIGFub3RoZXIgc3RhY2sgJyR7U3RhY2sub2YodGhpcy5hc3NldCkuc3RhY2tOYW1lfScuIGAgK1xuICAgICAgICAnQ3JlYXRlIGEgbmV3IEJ1aWxkU3BlYyBpbnN0YW5jZSBmb3IgZXZlcnkgc3RhY2suJyk7XG4gICAgfVxuXG4gICAgdGhpcy5hc3NldC5ncmFudFJlYWQoc2NvcGUpO1xuICAgIHJldHVybiB0aGlzLmFzc2V0LmJ1Y2tldC5hcm5Gb3JPYmplY3RzKHRoaXMuYXNzZXQuczNPYmplY3RLZXkpO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgPGJ1aWxkc3BlYyBmaWxlOiAke3RoaXMucGF0aH0+YDtcbiAgfVxufVxuXG4vKipcbiAqIEJ1aWxkU3BlYyB0aGF0IGp1c3QgcmV0dXJucyB0aGUgaW5wdXQgdW5jaGFuZ2VkXG4gKi9cbmNsYXNzIEZpbGVuYW1lQnVpbGRTcGVjIGV4dGVuZHMgQnVpbGRTcGVjIHtcbiAgcHVibGljIHJlYWRvbmx5IGlzSW1tZWRpYXRlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBmaWxlbmFtZTogc3RyaW5nKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyB0b0J1aWxkU3BlYygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmZpbGVuYW1lO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgPGJ1aWxkc3BlYyBmaWxlOiAke3RoaXMuZmlsZW5hbWV9PmA7XG4gIH1cbn1cblxuLyoqXG4gKiBCdWlsZFNwZWMgdGhhdCB1bmRlcnN0YW5kcyBhYm91dCBzdHJ1Y3R1cmVcbiAqL1xuY2xhc3MgT2JqZWN0QnVpbGRTcGVjIGV4dGVuZHMgQnVpbGRTcGVjIHtcbiAgcHVibGljIHJlYWRvbmx5IGlzSW1tZWRpYXRlOiBib29sZWFuID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgc3BlYzogeyBba2V5OiBzdHJpbmddOiBhbnkgfSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgdG9CdWlsZFNwZWMoKTogc3RyaW5nIHtcbiAgICAvLyBXZSBoYXZlIHRvIHByZXR0eS1wcmludCB0aGUgYnVpbGRzcGVjLCBvdGhlcndpc2VcbiAgICAvLyBDb2RlQnVpbGQgd2lsbCBub3QgcmVjb2duaXplIGl0IGFzIGFuIGlubGluZSBidWlsZHNwZWMuXG4gICAgcmV0dXJuIExhenkudW5jYWNoZWRTdHJpbmcoe1xuICAgICAgcHJvZHVjZTogKGN0eDogSVJlc29sdmVDb250ZXh0KSA9PlxuICAgICAgICBTdGFjay5vZihjdHguc2NvcGUpLnRvSnNvblN0cmluZyh0aGlzLnNwZWMsIDIpLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQnVpbGRTcGVjIHRoYXQgZXhwb3J0cyBpbnRvIFlBTUwgZm9ybWF0XG4gKi9cbmNsYXNzIFlhbWxCdWlsZFNwZWMgZXh0ZW5kcyBCdWlsZFNwZWMge1xuICBwdWJsaWMgcmVhZG9ubHkgaXNJbW1lZGlhdGU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBzcGVjOiB7IFtrZXk6IHN0cmluZ106IGFueSB9KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyB0b0J1aWxkU3BlYygpOiBzdHJpbmcge1xuICAgIHJldHVybiB5YW1sX2Nmbi5zZXJpYWxpemUodGhpcy5zcGVjKTtcbiAgfVxufVxuXG4vKipcbiAqIE1lcmdlIHR3byBidWlsZHNwZWNzIGludG8gYSBuZXcgQnVpbGRTcGVjIGJ5IGRvaW5nIGEgZGVlcCBtZXJnZVxuICpcbiAqIFdlIGRlY2lkZWQgdG8gZGlzYWxsb3cgbWVyZ2luZyBvZiBhcnRpZmFjdCBzcGVjcywgd2hpY2ggaXNcbiAqIGFjdHVhbGx5IGltcG9zc2libGUgc2luY2Ugd2UgY2FuJ3QgbWVyZ2UgdHdvIGJ1aWxkc3BlY3Mgd2l0aCBhXG4gKiBzaW5nbGUgcHJpbWFyeSBvdXRwdXQgaW50byBhIGJ1aWxkc3BlYyB3aXRoIG11bHRpcGxlIG91dHB1dHMuXG4gKiBJbiBjYXNlIG9mIG11bHRpcGxlIG91dHB1dHMgdGhleSBtdXN0IGhhdmUgaWRlbnRpZmllcnMgYnV0IHdlIHdvbid0IGhhdmUgdGhhdCBpbmZvcm1hdGlvbi5cbiAqXG4gKiBJbiBjYXNlIG9mIHRlc3QgcmVwb3J0cyB3ZSByZXBsYWNlIHRoZSB3aG9sZSBvYmplY3Qgd2l0aCB0aGUgUkhTIChpbnN0ZWFkIG9mIHJlY3Vyc2l2ZWx5IG1lcmdpbmcpXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlQnVpbGRTcGVjcyhsaHM6IEJ1aWxkU3BlYywgcmhzOiBCdWlsZFNwZWMpOiBCdWlsZFNwZWMge1xuICBpZiAoIShsaHMgaW5zdGFuY2VvZiBPYmplY3RCdWlsZFNwZWMpIHx8ICEocmhzIGluc3RhbmNlb2YgT2JqZWN0QnVpbGRTcGVjKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2FuIG9ubHkgbWVyZ2UgYnVpbGRzcGVjcyBjcmVhdGVkIHVzaW5nIEJ1aWxkU3BlYy5mcm9tT2JqZWN0KCknKTtcbiAgfVxuXG4gIGlmIChsaHMuc3BlYy52ZXJzaW9uID09PSAnMC4xJykge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGV4dGVuZCBidWlsZHNwZWMgYXQgdmVyc2lvbiBcIjAuMVwiLiBTZXQgdGhlIHZlcnNpb24gdG8gXCIwLjJcIiBvciBoaWdoZXIgaW5zdGVhZC4nKTtcbiAgfVxuICBpZiAobGhzLnNwZWMuYXJ0aWZhY3RzICYmIHJocy5zcGVjLmFydGlmYWN0cykge1xuICAgIC8vIFdlIGRlY2lkZWQgdG8gZGlzYWxsb3cgbWVyZ2luZyBvZiBhcnRpZmFjdCBzcGVjcywgd2hpY2ggaXNcbiAgICAvLyBhY3R1YWxseSBpbXBvc3NpYmxlIHNpbmNlIHdlIGNhbid0IG1lcmdlIHR3byBidWlsZHNwZWNzIHdpdGggYVxuICAgIC8vIHNpbmdsZSBwcmltYXJ5IG91dHB1dCBpbnRvIGEgYnVpbGRzcGVjIHdpdGggbXVsdGlwbGUgb3V0cHV0cy5cbiAgICAvLyBJbiBjYXNlIG9mIG11bHRpcGxlIG91dHB1dHMgdGhleSBtdXN0IGhhdmUgaWRlbnRpZmllcnMgYnV0IHdlIHdvbid0IGhhdmUgdGhhdCBpbmZvcm1hdGlvbi5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgb25lIGJ1aWxkIHNwZWMgaXMgYWxsb3dlZCB0byBzcGVjaWZ5IGFydGlmYWN0cy4nKTtcbiAgfVxuXG4gIGNvbnN0IGxoc1NwZWMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGxocy5zcGVjKSk7XG4gIGNvbnN0IHJoc1NwZWMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJocy5zcGVjKSk7XG5cbiAgbm9ybWFsaXplU3BlYyhsaHNTcGVjKTtcbiAgbm9ybWFsaXplU3BlYyhyaHNTcGVjKTtcblxuICBjb25zdCBtZXJnZWQgPSBtZXJnZURlZXAobGhzU3BlYywgcmhzU3BlYyk7XG5cbiAgLy8gSW4gY2FzZSBvZiB0ZXN0IHJlcG9ydHMgd2UgcmVwbGFjZSB0aGUgd2hvbGUgb2JqZWN0IHdpdGggdGhlIFJIUyAoaW5zdGVhZCBvZiByZWN1cnNpdmVseSBtZXJnaW5nKVxuICBpZiAobGhzU3BlYy5yZXBvcnRzICYmIHJoc1NwZWMucmVwb3J0cykge1xuICAgIG1lcmdlZC5yZXBvcnRzID0geyAuLi5saHNTcGVjLnJlcG9ydHMsIC4uLnJoc1NwZWMucmVwb3J0cyB9O1xuICB9XG5cbiAgcmV0dXJuIG5ldyBPYmplY3RCdWlsZFNwZWMobWVyZ2VkKTtcbn1cblxuLypcbiAqIE5vcm1hbGl6ZXMgdGhlIGJ1aWxkIHNwZWNcbiAqIFRoZSBDb2RlQnVpbGQgcnVudGltZSBhbGxvd3MgZmllbGRzIHRoYXQgYXJlIGRlZmluZWQgYXMgc3RyaW5nW10gdG8gYmUgc3RyaW5nc1xuICogYW5kIGludGVycHJldHMgdGhlbSBhcyBzaW5nbGV0b24gbGlzdHMuXG4gKiBXaGVuIG1lcmdpbmcgd2UgbmVlZCB0byBub3JtYWxpemUgdGhpcyB0byBoYXZlIHRoZSBjb3JyZWN0IGNvbmNhdCBzZW1hbnRpY3NcbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplU3BlYyhzcGVjOiB7IFtrZXk6IHN0cmluZ106IGFueSB9KTogdm9pZCB7XG4gIGlmIChzcGVjLmVudiAmJiB0eXBlb2Ygc3BlYy5lbnZbJ2V4cG9ydGVkLXZhcmlhYmxlcyddID09PSAnc3RyaW5nJykge1xuICAgIHNwZWMuZW52WydleHBvcnRlZC12YXJpYWJsZXMnXSA9IFtzcGVjLmVudlsnZXhwb3J0ZWQtdmFyaWFibGVzJ11dO1xuICB9XG4gIGZvciAoY29uc3Qga2V5IGluIHNwZWMucGhhc2VzKSB7XG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzcGVjLnBoYXNlcywga2V5KSkge1xuICAgICAgbm9ybWFsaXplU3BlY1BoYXNlKHNwZWMucGhhc2VzW2tleV0pO1xuICAgIH1cbiAgfVxuICBpZiAoc3BlYy5yZXBvcnRzKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gc3BlYy5yZXBvcnRzKSB7XG4gICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNwZWMucmVwb3J0cywga2V5KSkge1xuICAgICAgICBjb25zdCByZXBvcnQgPSBzcGVjLnJlcG9ydHNba2V5XTtcbiAgICAgICAgaWYgKHR5cGVvZiByZXBvcnQuZmlsZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgcmVwb3J0LmZpbGVzID0gW3JlcG9ydC5maWxlc107XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKHNwZWMuYXJ0aWZhY3RzKSB7XG4gICAgaWYgKHR5cGVvZiBzcGVjLmFydGlmYWN0cy5maWxlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHNwZWMuYXJ0aWZhY3RzLmZpbGVzID0gW3NwZWMuYXJ0aWZhY3RzLmZpbGVzXTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBrZXkgaW4gc3BlYy5hcnRpZmFjdHNbJ3NlY29uZGFyeS1hcnRpZmFjdHMnXSkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzcGVjLmFydGlmYWN0c1snc2Vjb25kYXJ5LWFydGlmYWN0cyddLCBrZXkpKSB7XG4gICAgICAgIGNvbnN0IHNlY0FydGlmYWN0ID0gc3BlYy5hcnRpZmFjdHNbJ3NlY29uZGFyeS1hcnRpZmFjdHMnXVtrZXldO1xuICAgICAgICBpZiAodHlwZW9mIHNlY0FydGlmYWN0LmZpbGVzID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHNlY0FydGlmYWN0LmZpbGVzID0gW3NlY0FydGlmYWN0LmZpbGVzXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoc3BlYy5jYWNoZSAmJiB0eXBlb2Ygc3BlYy5jYWNoZS5wYXRocyA9PT0gJ3N0cmluZycpIHtcbiAgICBzcGVjLmNhY2hlLnBhdGhzID0gW3NwZWMuY2FjaGUucGF0aHNdO1xuICB9XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVNwZWNQaGFzZShwaGFzZTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSk6IHZvaWQge1xuICBpZiAocGhhc2UuY29tbWFuZHMgJiYgdHlwZW9mIHBoYXNlLmNvbW1hbmRzID09PSAnc3RyaW5nJykge1xuICAgIHBoYXNlLmNvbW1hbmRzID0gW3BoYXNlLmNvbW1hbmRzXTtcbiAgfVxuICBpZiAocGhhc2UuZmluYWxseSAmJiB0eXBlb2YgcGhhc2UuZmluYWxseSA9PT0gJ3N0cmluZycpIHtcbiAgICBwaGFzZS5maW5hbGx5ID0gW3BoYXNlLmZpbmFsbHldO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1lcmdlRGVlcChsaHM6IGFueSwgcmhzOiBhbnkpOiBhbnkge1xuICBpZiAoQXJyYXkuaXNBcnJheShsaHMpICYmIEFycmF5LmlzQXJyYXkocmhzKSkge1xuICAgIHJldHVybiBbLi4ubGhzLCAuLi5yaHNdO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KGxocykgfHwgQXJyYXkuaXNBcnJheShyaHMpKSB7XG4gICAgcmV0dXJuIHJocztcbiAgfVxuXG4gIGNvbnN0IGlzT2JqZWN0ID0gKG9iajogYW55KSA9PiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCc7XG5cbiAgaWYgKGlzT2JqZWN0KGxocykgJiYgaXNPYmplY3QocmhzKSkge1xuICAgIGNvbnN0IHJldDogYW55ID0geyAuLi5saHMgfTtcbiAgICBmb3IgKGNvbnN0IGsgb2YgT2JqZWN0LmtleXMocmhzKSkge1xuICAgICAgcmV0W2tdID0gayBpbiBsaHMgPyBtZXJnZURlZXAobGhzW2tdLCByaHNba10pIDogcmhzW2tdO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgcmV0dXJuIHJocztcbn07XG4iXX0=