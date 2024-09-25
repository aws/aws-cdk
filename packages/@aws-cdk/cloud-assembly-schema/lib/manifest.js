"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manifest = exports.VERSION_MISMATCH = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const jsonschema = require("jsonschema");
const semver = require("semver");
const assembly = require("./cloud-assembly");
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
// this prefix is used by the CLI to identify this specific error.
// in which case we want to instruct the user to upgrade his CLI.
// see exec.ts#createAssembly
exports.VERSION_MISMATCH = 'Cloud assembly schema version mismatch';
const ASSETS_SCHEMA = require('../schema/assets.schema.json');
const ASSEMBLY_SCHEMA = require('../schema/cloud-assembly.schema.json');
/**
 * Version is shared for both manifests
 */
const SCHEMA_VERSION = require('../schema/cloud-assembly.version.json').version;
const INTEG_SCHEMA = require('../schema/integ.schema.json');
/**
 * Protocol utility class.
 */
class Manifest {
    /**
     * Validates and saves the cloud assembly manifest to file.
     *
     * @param manifest - manifest.
     * @param filePath - output file path.
     */
    static saveAssemblyManifest(manifest, filePath) {
        try {
            jsiiDeprecationWarnings._aws_cdk_cloud_assembly_schema_AssemblyManifest(manifest);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.saveAssemblyManifest);
            }
            throw error;
        }
        Manifest.saveManifest(manifest, filePath, ASSEMBLY_SCHEMA, Manifest.patchStackTagsOnWrite);
    }
    /**
     * Load and validates the cloud assembly manifest from file.
     *
     * @param filePath - path to the manifest file.
     */
    static loadAssemblyManifest(filePath, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_cloud_assembly_schema_LoadManifestOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.loadAssemblyManifest);
            }
            throw error;
        }
        return Manifest.loadManifest(filePath, ASSEMBLY_SCHEMA, Manifest.patchStackTagsOnRead, options);
    }
    /**
     * Validates and saves the asset manifest to file.
     *
     * @param manifest - manifest.
     * @param filePath - output file path.
     */
    static saveAssetManifest(manifest, filePath) {
        try {
            jsiiDeprecationWarnings._aws_cdk_cloud_assembly_schema_AssetManifest(manifest);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.saveAssetManifest);
            }
            throw error;
        }
        Manifest.saveManifest(manifest, filePath, ASSETS_SCHEMA, Manifest.patchStackTagsOnRead);
    }
    /**
     * Load and validates the asset manifest from file.
     *
     * @param filePath - path to the manifest file.
     */
    static loadAssetManifest(filePath) {
        return this.loadManifest(filePath, ASSETS_SCHEMA);
    }
    /**
     * Validates and saves the integ manifest to file.
     *
     * @param manifest - manifest.
     * @param filePath - output file path.
     */
    static saveIntegManifest(manifest, filePath) {
        try {
            jsiiDeprecationWarnings._aws_cdk_cloud_assembly_schema_IntegManifest(manifest);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.saveIntegManifest);
            }
            throw error;
        }
        Manifest.saveManifest(manifest, filePath, INTEG_SCHEMA);
    }
    /**
     * Load and validates the integ manifest from file.
     *
     * @param filePath - path to the manifest file.
     */
    static loadIntegManifest(filePath) {
        return this.loadManifest(filePath, INTEG_SCHEMA);
    }
    /**
     * Fetch the current schema version number.
     */
    static version() {
        return SCHEMA_VERSION;
    }
    /**
     * Deprecated
     * @deprecated use `saveAssemblyManifest()`
     */
    static save(manifest, filePath) { try {
        jsiiDeprecationWarnings.print("@aws-cdk/cloud-assembly-schema.Manifest#save", "use `saveAssemblyManifest()`");
        jsiiDeprecationWarnings._aws_cdk_cloud_assembly_schema_AssemblyManifest(manifest);
    }
    catch (error) {
        if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
            Error.captureStackTrace(error, this.save);
        }
        throw error;
    } return this.saveAssemblyManifest(manifest, filePath); }
    /**
     * Deprecated
     * @deprecated use `loadAssemblyManifest()`
     */
    static load(filePath) { try {
        jsiiDeprecationWarnings.print("@aws-cdk/cloud-assembly-schema.Manifest#load", "use `loadAssemblyManifest()`");
    }
    catch (error) {
        if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
            Error.captureStackTrace(error, this.load);
        }
        throw error;
    } return this.loadAssemblyManifest(filePath); }
    static validate(manifest, schema, options) {
        function parseVersion(version) {
            const ver = semver.valid(version);
            if (!ver) {
                throw new Error(`Invalid semver string: "${version}"`);
            }
            return ver;
        }
        const maxSupported = parseVersion(Manifest.version());
        const actual = parseVersion(manifest.version);
        // first validate the version should be accepted.
        if (semver.gt(actual, maxSupported) && !options?.skipVersionCheck) {
            // we use a well known error prefix so that the CLI can identify this specific error
            // and print some more context to the user.
            throw new Error(`${exports.VERSION_MISMATCH}: Maximum schema version supported is ${maxSupported}, but found ${actual}`);
        }
        // now validate the format is good.
        const validator = new jsonschema.Validator();
        const result = validator.validate(manifest, schema, {
            // does exist but is not in the TypeScript definitions
            nestedErrors: true,
            allowUnknownAttributes: false,
        });
        let errors = result.errors;
        if (options?.skipEnumCheck) {
            // Enum validations aren't useful when
            errors = stripEnumErrors(errors);
        }
        if (errors.length > 0) {
            throw new Error(`Invalid assembly manifest:\n${errors.map(e => e.stack).join('\n')}`);
        }
    }
    static saveManifest(manifest, filePath, schema, preprocess) {
        let withVersion = { ...manifest, version: Manifest.version() };
        Manifest.validate(withVersion, schema);
        if (preprocess) {
            withVersion = preprocess(withVersion);
        }
        fs.writeFileSync(filePath, JSON.stringify(withVersion, undefined, 2));
    }
    static loadManifest(filePath, schema, preprocess, options) {
        const contents = fs.readFileSync(filePath, { encoding: 'utf-8' });
        let obj;
        try {
            obj = JSON.parse(contents);
        }
        catch (e) {
            throw new Error(`${e.message}, while parsing ${JSON.stringify(contents)}`);
        }
        if (preprocess) {
            obj = preprocess(obj);
        }
        Manifest.validate(obj, schema, options);
        return obj;
    }
    /**
     * This requires some explaining...
     *
     * We previously used `{ Key, Value }` for the object that represents a stack tag. (Notice the casing)
     * @link https://github.com/aws/aws-cdk/blob/v1.27.0/packages/aws-cdk/lib/api/cxapp/stacks.ts#L427.
     *
     * When that object moved to this package, it had to be JSII compliant, which meant the property
     * names must be `camelCased`, and not `PascalCased`. This meant it no longer matches the structure in the `manifest.json` file.
     * In order to support current manifest files, we have to translate the `PascalCased` representation to the new `camelCased` one.
     *
     * Note that the serialization itself still writes `PascalCased` because it relates to how CloudFormation expects it.
     *
     * Ideally, we would start writing the `camelCased` and translate to how CloudFormation expects it when needed. But this requires nasty
     * backwards-compatibility code and it just doesn't seem to be worth the effort.
     */
    static patchStackTagsOnRead(manifest) {
        return Manifest.replaceStackTags(manifest, tags => tags.map((diskTag) => ({
            key: diskTag.Key,
            value: diskTag.Value,
        })));
    }
    /**
     * See explanation on `patchStackTagsOnRead`
     *
     * Translate stack tags metadata if it has the "right" casing.
     */
    static patchStackTagsOnWrite(manifest) {
        return Manifest.replaceStackTags(manifest, tags => tags.map(memTag => 
        // Might already be uppercased (because stack synthesis generates it in final form yet)
        ('Key' in memTag ? memTag : { Key: memTag.key, Value: memTag.value })));
    }
    /**
     * Recursively replace stack tags in the stack metadata
     */
    static replaceStackTags(manifest, fn) {
        // Need to add in the `noUndefined`s because otherwise jest snapshot tests are going to freak out
        // about the keys with values that are `undefined` (even though they would never be JSON.stringified)
        return noUndefined({
            ...manifest,
            artifacts: mapValues(manifest.artifacts, artifact => {
                if (artifact.type !== assembly.ArtifactType.AWS_CLOUDFORMATION_STACK) {
                    return artifact;
                }
                return noUndefined({
                    ...artifact,
                    metadata: mapValues(artifact.metadata, metadataEntries => metadataEntries.map(metadataEntry => {
                        if (metadataEntry.type !== assembly.ArtifactMetadataEntryType.STACK_TAGS || !metadataEntry.data) {
                            return metadataEntry;
                        }
                        return {
                            ...metadataEntry,
                            data: fn(metadataEntry.data),
                        };
                    })),
                });
            }),
        });
    }
    constructor() { }
}
exports.Manifest = Manifest;
_a = JSII_RTTI_SYMBOL_1;
Manifest[_a] = { fqn: "@aws-cdk/cloud-assembly-schema.Manifest", version: "0.0.0" };
function mapValues(xs, fn) {
    if (!xs) {
        return undefined;
    }
    const ret = {};
    for (const [k, v] of Object.entries(xs)) {
        ret[k] = fn(v);
    }
    return ret;
}
function noUndefined(xs) {
    const ret = {};
    for (const [k, v] of Object.entries(xs)) {
        if (v !== undefined) {
            ret[k] = v;
        }
    }
    return ret;
}
function stripEnumErrors(errors) {
    return errors.filter(e => typeof e.schema === 'string' || !('enum' in e.schema));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuaWZlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYW5pZmVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx5QkFBeUI7QUFDekIseUNBQXlDO0FBQ3pDLGlDQUFpQztBQUVqQyw2Q0FBNkM7QUFHN0MsdURBQXVEO0FBQ3ZELDBEQUEwRDtBQUUxRCxrRUFBa0U7QUFDbEUsaUVBQWlFO0FBQ2pFLDZCQUE2QjtBQUNoQixRQUFBLGdCQUFnQixHQUFXLHdDQUF3QyxDQUFDO0FBRWpGLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0FBRTlELE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0FBRXhFOztHQUVHO0FBQ0gsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLHVDQUF1QyxDQUFDLENBQUMsT0FBTyxDQUFDO0FBRWhGLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBc0M1RDs7R0FFRztBQUNILE1BQWEsUUFBUTtJQUNuQjs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxRQUFtQyxFQUFFLFFBQWdCOzs7Ozs7Ozs7O1FBQ3RGLFFBQVEsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxlQUFlLEVBQUUsUUFBUSxDQUFDLHFCQUFxQixDQUFDLENBQUM7S0FDNUY7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLG9CQUFvQixDQUFDLFFBQWdCLEVBQUUsT0FBNkI7Ozs7Ozs7Ozs7UUFDaEYsT0FBTyxRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUUsUUFBUSxDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ2pHO0lBRUQ7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsaUJBQWlCLENBQUMsUUFBOEIsRUFBRSxRQUFnQjs7Ozs7Ozs7OztRQUM5RSxRQUFRLENBQUMsWUFB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LENBQUM7UUFDeEMsSUFBSSxDQUFDLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDcEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNiLENBQUM7SUFDSCxDQUFDO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQsU0FBUyxlQUFlLENBQUMsTUFBb0M7SUFDM0QsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxLQUFJLFFBQVEsSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ2xGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBqc29uc2NoZW1hIGZyb20gJ2pzb25zY2hlbWEnO1xuaW1wb3J0ICogYXMgc2VtdmVyIGZyb20gJ3NlbXZlcic7XG5pbXBvcnQgKiBhcyBhc3NldHMgZnJvbSAnLi9hc3NldHMnO1xuaW1wb3J0ICogYXMgYXNzZW1ibHkgZnJvbSAnLi9jbG91ZC1hc3NlbWJseSc7XG5pbXBvcnQgKiBhcyBpbnRlZyBmcm9tICcuL2ludGVnLXRlc3RzJztcblxuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXZhci1yZXF1aXJlcyAqL1xuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0cyAqL1xuXG4vLyB0aGlzIHByZWZpeCBpcyB1c2VkIGJ5IHRoZSBDTEkgdG8gaWRlbnRpZnkgdGhpcyBzcGVjaWZpYyBlcnJvci5cbi8vIGluIHdoaWNoIGNhc2Ugd2Ugd2FudCB0byBpbnN0cnVjdCB0aGUgdXNlciB0byB1cGdyYWRlIGhpcyBDTEkuXG4vLyBzZWUgZXhlYy50cyNjcmVhdGVBc3NlbWJseVxuZXhwb3J0IGNvbnN0IFZFUlNJT05fTUlTTUFUQ0g6IHN0cmluZyA9ICdDbG91ZCBhc3NlbWJseSBzY2hlbWEgdmVyc2lvbiBtaXNtYXRjaCc7XG5cbmNvbnN0IEFTU0VUU19TQ0hFTUEgPSByZXF1aXJlKCcuLi9zY2hlbWEvYXNzZXRzLnNjaGVtYS5qc29uJyk7XG5cbmNvbnN0IEFTU0VNQkxZX1NDSEVNQSA9IHJlcXVpcmUoJy4uL3NjaGVtYS9jbG91ZC1hc3NlbWJseS5zY2hlbWEuanNvbicpO1xuXG4vKipcbiAqIFZlcnNpb24gaXMgc2hhcmVkIGZvciBib3RoIG1hbmlmZXN0c1xuICovXG5jb25zdCBTQ0hFTUFfVkVSU0lPTiA9IHJlcXVpcmUoJy4uL3NjaGVtYS9jbG91ZC1hc3NlbWJseS52ZXJzaW9uLmpzb24nKS52ZXJzaW9uO1xuXG5jb25zdCBJTlRFR19TQ0hFTUEgPSByZXF1aXJlKCcuLi9zY2hlbWEvaW50ZWcuc2NoZW1hLmpzb24nKTtcblxuLyoqXG4gKiBPcHRpb25zIGZvciB0aGUgbG9hZE1hbmlmZXN0IG9wZXJhdGlvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIExvYWRNYW5pZmVzdE9wdGlvbnMge1xuICAvKipcbiAgICogU2tpcCB0aGUgdmVyc2lvbiBjaGVja1xuICAgKlxuICAgKiBUaGlzIG1lYW5zIHlvdSBtYXkgcmVhZCBhIG5ld2VyIGNsb3VkIGFzc2VtYmx5IHRoYW4gdGhlIENYIEFQSSBpcyBkZXNpZ25lZFxuICAgKiB0byBzdXBwb3J0LCBhbmQgeW91ciBhcHBsaWNhdGlvbiBtYXkgbm90IGJlIGF3YXJlIG9mIGFsbCBmZWF0dXJlcyB0aGF0IGluIHVzZVxuICAgKiBpbiB0aGUgQ2xvdWQgQXNzZW1ibHkuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBza2lwVmVyc2lvbkNoZWNrPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogU2tpcCBlbnVtIGNoZWNrc1xuICAgKlxuICAgKiBUaGlzIG1lYW5zIHlvdSBtYXkgcmVhZCBlbnVtIHZhbHVlcyB5b3UgZG9uJ3Qga25vdyBhYm91dCB5ZXQuIE1ha2Ugc3VyZSB0byBhbHdheXNcbiAgICogY2hlY2sgdGhlIHZhbHVlcyBvZiBlbnVtcyB5b3UgZW5jb3VudGVyIGluIHRoZSBtYW5pZmVzdC5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHNraXBFbnVtQ2hlY2s/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUb3BvbG9naWNhbGx5IHNvcnQgYWxsIGFydGlmYWN0c1xuICAgKlxuICAgKiBUaGlzIHBhcmFtZXRlciBpcyBvbmx5IHJlc3BlY3RlZCBieSB0aGUgY29uc3RydWN0b3Igb2YgYENsb3VkQXNzZW1ibHlgLiBUaGVcbiAgICogcHJvcGVydHkgbGl2ZXMgaGVyZSBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgcmVhc29ucy5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgdG9wb1NvcnQ/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIFByb3RvY29sIHV0aWxpdHkgY2xhc3MuXG4gKi9cbmV4cG9ydCBjbGFzcyBNYW5pZmVzdCB7XG4gIC8qKlxuICAgKiBWYWxpZGF0ZXMgYW5kIHNhdmVzIHRoZSBjbG91ZCBhc3NlbWJseSBtYW5pZmVzdCB0byBmaWxlLlxuICAgKlxuICAgKiBAcGFyYW0gbWFuaWZlc3QgLSBtYW5pZmVzdC5cbiAgICogQHBhcmFtIGZpbGVQYXRoIC0gb3V0cHV0IGZpbGUgcGF0aC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc2F2ZUFzc2VtYmx5TWFuaWZlc3QobWFuaWZlc3Q6IGFzc2VtYmx5LkFzc2VtYmx5TWFuaWZlc3QsIGZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICBNYW5pZmVzdC5zYXZlTWFuaWZlc3QobWFuaWZlc3QsIGZpbGVQYXRoLCBBU1NFTUJMWV9TQ0hFTUEsIE1hbmlmZXN0LnBhdGNoU3RhY2tUYWdzT25Xcml0ZSk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZCBhbmQgdmFsaWRhdGVzIHRoZSBjbG91ZCBhc3NlbWJseSBtYW5pZmVzdCBmcm9tIGZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSBmaWxlUGF0aCAtIHBhdGggdG8gdGhlIG1hbmlmZXN0IGZpbGUuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGxvYWRBc3NlbWJseU1hbmlmZXN0KGZpbGVQYXRoOiBzdHJpbmcsIG9wdGlvbnM/OiBMb2FkTWFuaWZlc3RPcHRpb25zKTogYXNzZW1ibHkuQXNzZW1ibHlNYW5pZmVzdCB7XG4gICAgcmV0dXJuIE1hbmlmZXN0LmxvYWRNYW5pZmVzdChmaWxlUGF0aCwgQVNTRU1CTFlfU0NIRU1BLCBNYW5pZmVzdC5wYXRjaFN0YWNrVGFnc09uUmVhZCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGVzIGFuZCBzYXZlcyB0aGUgYXNzZXQgbWFuaWZlc3QgdG8gZmlsZS5cbiAgICpcbiAgICogQHBhcmFtIG1hbmlmZXN0IC0gbWFuaWZlc3QuXG4gICAqIEBwYXJhbSBmaWxlUGF0aCAtIG91dHB1dCBmaWxlIHBhdGguXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHNhdmVBc3NldE1hbmlmZXN0KG1hbmlmZXN0OiBhc3NldHMuQXNzZXRNYW5pZmVzdCwgZmlsZVBhdGg6IHN0cmluZykge1xuICAgIE1hbmlmZXN0LnNhdmVNYW5pZmVzdChtYW5pZmVzdCwgZmlsZVBhdGgsIEFTU0VUU19TQ0hFTUEsIE1hbmlmZXN0LnBhdGNoU3RhY2tUYWdzT25SZWFkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIGFuZCB2YWxpZGF0ZXMgdGhlIGFzc2V0IG1hbmlmZXN0IGZyb20gZmlsZS5cbiAgICpcbiAgICogQHBhcmFtIGZpbGVQYXRoIC0gcGF0aCB0byB0aGUgbWFuaWZlc3QgZmlsZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbG9hZEFzc2V0TWFuaWZlc3QoZmlsZVBhdGg6IHN0cmluZyk6IGFzc2V0cy5Bc3NldE1hbmlmZXN0IHtcbiAgICByZXR1cm4gdGhpcy5sb2FkTWFuaWZlc3QoZmlsZVBhdGgsIEFTU0VUU19TQ0hFTUEpO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlcyBhbmQgc2F2ZXMgdGhlIGludGVnIG1hbmlmZXN0IHRvIGZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSBtYW5pZmVzdCAtIG1hbmlmZXN0LlxuICAgKiBAcGFyYW0gZmlsZVBhdGggLSBvdXRwdXQgZmlsZSBwYXRoLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzYXZlSW50ZWdNYW5pZmVzdChtYW5pZmVzdDogaW50ZWcuSW50ZWdNYW5pZmVzdCwgZmlsZVBhdGg6IHN0cmluZykge1xuICAgIE1hbmlmZXN0LnNhdmVNYW5pZmVzdChtYW5pZmVzdCwgZmlsZVBhdGgsIElOVEVHX1NDSEVNQSk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZCBhbmQgdmFsaWRhdGVzIHRoZSBpbnRlZyBtYW5pZmVzdCBmcm9tIGZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSBmaWxlUGF0aCAtIHBhdGggdG8gdGhlIG1hbmlmZXN0IGZpbGUuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGxvYWRJbnRlZ01hbmlmZXN0KGZpbGVQYXRoOiBzdHJpbmcpOiBpbnRlZy5JbnRlZ01hbmlmZXN0IHtcbiAgICByZXR1cm4gdGhpcy5sb2FkTWFuaWZlc3QoZmlsZVBhdGgsIElOVEVHX1NDSEVNQSk7XG4gIH1cblxuICAvKipcbiAgICogRmV0Y2ggdGhlIGN1cnJlbnQgc2NoZW1hIHZlcnNpb24gbnVtYmVyLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB2ZXJzaW9uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFNDSEVNQV9WRVJTSU9OO1xuICB9XG5cbiAgLyoqXG4gICAqIERlcHJlY2F0ZWRcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGBzYXZlQXNzZW1ibHlNYW5pZmVzdCgpYFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzYXZlKG1hbmlmZXN0OiBhc3NlbWJseS5Bc3NlbWJseU1hbmlmZXN0LCBmaWxlUGF0aDogc3RyaW5nKSB7IHJldHVybiB0aGlzLnNhdmVBc3NlbWJseU1hbmlmZXN0KG1hbmlmZXN0LCBmaWxlUGF0aCk7IH1cblxuICAvKipcbiAgICogRGVwcmVjYXRlZFxuICAgKiBAZGVwcmVjYXRlZCB1c2UgYGxvYWRBc3NlbWJseU1hbmlmZXN0KClgXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGxvYWQoZmlsZVBhdGg6IHN0cmluZyk6IGFzc2VtYmx5LkFzc2VtYmx5TWFuaWZlc3QgeyByZXR1cm4gdGhpcy5sb2FkQXNzZW1ibHlNYW5pZmVzdChmaWxlUGF0aCk7IH1cblxuICBwcml2YXRlIHN0YXRpYyB2YWxpZGF0ZShtYW5pZmVzdDogeyB2ZXJzaW9uOiBzdHJpbmcgfSwgc2NoZW1hOiBqc29uc2NoZW1hLlNjaGVtYSwgb3B0aW9ucz86IExvYWRNYW5pZmVzdE9wdGlvbnMpIHtcbiAgICBmdW5jdGlvbiBwYXJzZVZlcnNpb24odmVyc2lvbjogc3RyaW5nKSB7XG4gICAgICBjb25zdCB2ZXIgPSBzZW12ZXIudmFsaWQodmVyc2lvbik7XG4gICAgICBpZiAoIXZlcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgc2VtdmVyIHN0cmluZzogXCIke3ZlcnNpb259XCJgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2ZXI7XG4gICAgfVxuXG4gICAgY29uc3QgbWF4U3VwcG9ydGVkID0gcGFyc2VWZXJzaW9uKE1hbmlmZXN0LnZlcnNpb24oKSk7XG4gICAgY29uc3QgYWN0dWFsID0gcGFyc2VWZXJzaW9uKG1hbmlmZXN0LnZlcnNpb24pO1xuXG4gICAgLy8gZmlyc3QgdmFsaWRhdGUgdGhlIHZlcnNpb24gc2hvdWxkIGJlIGFjY2VwdGVkLlxuICAgIGlmIChzZW12ZXIuZ3QoYWN0dWFsLCBtYXhTdXBwb3J0ZWQpICYmICFvcHRpb25zPy5za2lwVmVyc2lvbkNoZWNrKSB7XG4gICAgICAvLyB3ZSB1c2UgYSB3ZWxsIGtub3duIGVycm9yIHByZWZpeCBzbyB0aGF0IHRoZSBDTEkgY2FuIGlkZW50aWZ5IHRoaXMgc3BlY2lmaWMgZXJyb3JcbiAgICAgIC8vIGFuZCBwcmludCBzb21lIG1vcmUgY29udGV4dCB0byB0aGUgdXNlci5cbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHtWRVJTSU9OX01JU01BVENIfTogTWF4aW11bSBzY2hlbWEgdmVyc2lvbiBzdXBwb3J0ZWQgaXMgJHttYXhTdXBwb3J0ZWR9LCBidXQgZm91bmQgJHthY3R1YWx9YCk7XG4gICAgfVxuXG4gICAgLy8gbm93IHZhbGlkYXRlIHRoZSBmb3JtYXQgaXMgZ29vZC5cbiAgICBjb25zdCB2YWxpZGF0b3IgPSBuZXcganNvbnNjaGVtYS5WYWxpZGF0b3IoKTtcbiAgICBjb25zdCByZXN1bHQgPSB2YWxpZGF0b3IudmFsaWRhdGUobWFuaWZlc3QsIHNjaGVtYSwge1xuXG4gICAgICAvLyBkb2VzIGV4aXN0IGJ1dCBpcyBub3QgaW4gdGhlIFR5cGVTY3JpcHQgZGVmaW5pdGlvbnNcbiAgICAgIG5lc3RlZEVycm9yczogdHJ1ZSxcblxuICAgICAgYWxsb3dVbmtub3duQXR0cmlidXRlczogZmFsc2UsXG5cbiAgICB9IGFzIGFueSk7XG5cbiAgICBsZXQgZXJyb3JzID0gcmVzdWx0LmVycm9ycztcbiAgICBpZiAob3B0aW9ucz8uc2tpcEVudW1DaGVjaykge1xuICAgICAgLy8gRW51bSB2YWxpZGF0aW9ucyBhcmVuJ3QgdXNlZnVsIHdoZW5cbiAgICAgIGVycm9ycyA9IHN0cmlwRW51bUVycm9ycyhlcnJvcnMpO1xuICAgIH1cblxuICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGFzc2VtYmx5IG1hbmlmZXN0OlxcbiR7ZXJyb3JzLm1hcChlID0+IGUuc3RhY2spLmpvaW4oJ1xcbicpfWApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIHNhdmVNYW5pZmVzdChtYW5pZmVzdDogYW55LCBmaWxlUGF0aDogc3RyaW5nLCBzY2hlbWE6IGpzb25zY2hlbWEuU2NoZW1hLCBwcmVwcm9jZXNzPzogKG9iajogYW55KSA9PiBhbnkpIHtcbiAgICBsZXQgd2l0aFZlcnNpb24gPSB7IC4uLm1hbmlmZXN0LCB2ZXJzaW9uOiBNYW5pZmVzdC52ZXJzaW9uKCkgfTtcbiAgICBNYW5pZmVzdC52YWxpZGF0ZSh3aXRoVmVyc2lvbiwgc2NoZW1hKTtcbiAgICBpZiAocHJlcHJvY2Vzcykge1xuICAgICAgd2l0aFZlcnNpb24gPSBwcmVwcm9jZXNzKHdpdGhWZXJzaW9uKTtcbiAgICB9XG4gICAgZnMud3JpdGVGaWxlU3luYyhmaWxlUGF0aCwgSlNPTi5zdHJpbmdpZnkod2l0aFZlcnNpb24sIHVuZGVmaW5lZCwgMikpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgbG9hZE1hbmlmZXN0KGZpbGVQYXRoOiBzdHJpbmcsIHNjaGVtYToganNvbnNjaGVtYS5TY2hlbWEsIHByZXByb2Nlc3M/OiAob2JqOiBhbnkpID0+IGFueSwgb3B0aW9ucz86IExvYWRNYW5pZmVzdE9wdGlvbnMpIHtcbiAgICBjb25zdCBjb250ZW50cyA9IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KTtcbiAgICBsZXQgb2JqO1xuICAgIHRyeSB7XG4gICAgICBvYmogPSBKU09OLnBhcnNlKGNvbnRlbnRzKTtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHtlLm1lc3NhZ2V9LCB3aGlsZSBwYXJzaW5nICR7SlNPTi5zdHJpbmdpZnkoY29udGVudHMpfWApO1xuICAgIH1cbiAgICBpZiAocHJlcHJvY2Vzcykge1xuICAgICAgb2JqID0gcHJlcHJvY2VzcyhvYmopO1xuICAgIH1cbiAgICBNYW5pZmVzdC52YWxpZGF0ZShvYmosIHNjaGVtYSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIHJlcXVpcmVzIHNvbWUgZXhwbGFpbmluZy4uLlxuICAgKlxuICAgKiBXZSBwcmV2aW91c2x5IHVzZWQgYHsgS2V5LCBWYWx1ZSB9YCBmb3IgdGhlIG9iamVjdCB0aGF0IHJlcHJlc2VudHMgYSBzdGFjayB0YWcuIChOb3RpY2UgdGhlIGNhc2luZylcbiAgICogQGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3MtY2RrL2Jsb2IvdjEuMjcuMC9wYWNrYWdlcy9hd3MtY2RrL2xpYi9hcGkvY3hhcHAvc3RhY2tzLnRzI0w0MjcuXG4gICAqXG4gICAqIFdoZW4gdGhhdCBvYmplY3QgbW92ZWQgdG8gdGhpcyBwYWNrYWdlLCBpdCBoYWQgdG8gYmUgSlNJSSBjb21wbGlhbnQsIHdoaWNoIG1lYW50IHRoZSBwcm9wZXJ0eVxuICAgKiBuYW1lcyBtdXN0IGJlIGBjYW1lbENhc2VkYCwgYW5kIG5vdCBgUGFzY2FsQ2FzZWRgLiBUaGlzIG1lYW50IGl0IG5vIGxvbmdlciBtYXRjaGVzIHRoZSBzdHJ1Y3R1cmUgaW4gdGhlIGBtYW5pZmVzdC5qc29uYCBmaWxlLlxuICAgKiBJbiBvcmRlciB0byBzdXBwb3J0IGN1cnJlbnQgbWFuaWZlc3QgZmlsZXMsIHdlIGhhdmUgdG8gdHJhbnNsYXRlIHRoZSBgUGFzY2FsQ2FzZWRgIHJlcHJlc2VudGF0aW9uIHRvIHRoZSBuZXcgYGNhbWVsQ2FzZWRgIG9uZS5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoZSBzZXJpYWxpemF0aW9uIGl0c2VsZiBzdGlsbCB3cml0ZXMgYFBhc2NhbENhc2VkYCBiZWNhdXNlIGl0IHJlbGF0ZXMgdG8gaG93IENsb3VkRm9ybWF0aW9uIGV4cGVjdHMgaXQuXG4gICAqXG4gICAqIElkZWFsbHksIHdlIHdvdWxkIHN0YXJ0IHdyaXRpbmcgdGhlIGBjYW1lbENhc2VkYCBhbmQgdHJhbnNsYXRlIHRvIGhvdyBDbG91ZEZvcm1hdGlvbiBleHBlY3RzIGl0IHdoZW4gbmVlZGVkLiBCdXQgdGhpcyByZXF1aXJlcyBuYXN0eVxuICAgKiBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSBjb2RlIGFuZCBpdCBqdXN0IGRvZXNuJ3Qgc2VlbSB0byBiZSB3b3J0aCB0aGUgZWZmb3J0LlxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgcGF0Y2hTdGFja1RhZ3NPblJlYWQobWFuaWZlc3Q6IGFzc2VtYmx5LkFzc2VtYmx5TWFuaWZlc3QpIHtcbiAgICByZXR1cm4gTWFuaWZlc3QucmVwbGFjZVN0YWNrVGFncyhtYW5pZmVzdCwgdGFncyA9PiB0YWdzLm1hcCgoZGlza1RhZzogYW55KSA9PiAoe1xuICAgICAga2V5OiBkaXNrVGFnLktleSxcbiAgICAgIHZhbHVlOiBkaXNrVGFnLlZhbHVlLFxuICAgIH0pKSk7XG4gIH1cblxuICAvKipcbiAgICogU2VlIGV4cGxhbmF0aW9uIG9uIGBwYXRjaFN0YWNrVGFnc09uUmVhZGBcbiAgICpcbiAgICogVHJhbnNsYXRlIHN0YWNrIHRhZ3MgbWV0YWRhdGEgaWYgaXQgaGFzIHRoZSBcInJpZ2h0XCIgY2FzaW5nLlxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgcGF0Y2hTdGFja1RhZ3NPbldyaXRlKG1hbmlmZXN0OiBhc3NlbWJseS5Bc3NlbWJseU1hbmlmZXN0KSB7XG4gICAgcmV0dXJuIE1hbmlmZXN0LnJlcGxhY2VTdGFja1RhZ3MobWFuaWZlc3QsIHRhZ3MgPT4gdGFncy5tYXAobWVtVGFnID0+XG4gICAgICAvLyBNaWdodCBhbHJlYWR5IGJlIHVwcGVyY2FzZWQgKGJlY2F1c2Ugc3RhY2sgc3ludGhlc2lzIGdlbmVyYXRlcyBpdCBpbiBmaW5hbCBmb3JtIHlldClcbiAgICAgICgnS2V5JyBpbiBtZW1UYWcgPyBtZW1UYWcgOiB7IEtleTogbWVtVGFnLmtleSwgVmFsdWU6IG1lbVRhZy52YWx1ZSB9KSBhcyBhbnksXG4gICAgKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVjdXJzaXZlbHkgcmVwbGFjZSBzdGFjayB0YWdzIGluIHRoZSBzdGFjayBtZXRhZGF0YVxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgcmVwbGFjZVN0YWNrVGFncyhtYW5pZmVzdDogYXNzZW1ibHkuQXNzZW1ibHlNYW5pZmVzdCwgZm46IEVuZG9mdW5jdG9yPGFzc2VtYmx5LlN0YWNrVGFnc01ldGFkYXRhRW50cnk+KTogYXNzZW1ibHkuQXNzZW1ibHlNYW5pZmVzdCB7XG4gICAgLy8gTmVlZCB0byBhZGQgaW4gdGhlIGBub1VuZGVmaW5lZGBzIGJlY2F1c2Ugb3RoZXJ3aXNlIGplc3Qgc25hcHNob3QgdGVzdHMgYXJlIGdvaW5nIHRvIGZyZWFrIG91dFxuICAgIC8vIGFib3V0IHRoZSBrZXlzIHdpdGggdmFsdWVzIHRoYXQgYXJlIGB1bmRlZmluZWRgIChldmVuIHRob3VnaCB0aGV5IHdvdWxkIG5ldmVyIGJlIEpTT04uc3RyaW5naWZpZWQpXG4gICAgcmV0dXJuIG5vVW5kZWZpbmVkKHtcbiAgICAgIC4uLm1hbmlmZXN0LFxuICAgICAgYXJ0aWZhY3RzOiBtYXBWYWx1ZXMobWFuaWZlc3QuYXJ0aWZhY3RzLCBhcnRpZmFjdCA9PiB7XG4gICAgICAgIGlmIChhcnRpZmFjdC50eXBlICE9PSBhc3NlbWJseS5BcnRpZmFjdFR5cGUuQVdTX0NMT1VERk9STUFUSU9OX1NUQUNLKSB7IHJldHVybiBhcnRpZmFjdDsgfVxuICAgICAgICByZXR1cm4gbm9VbmRlZmluZWQoe1xuICAgICAgICAgIC4uLmFydGlmYWN0LFxuICAgICAgICAgIG1ldGFkYXRhOiBtYXBWYWx1ZXMoYXJ0aWZhY3QubWV0YWRhdGEsIG1ldGFkYXRhRW50cmllcyA9PiBtZXRhZGF0YUVudHJpZXMubWFwKG1ldGFkYXRhRW50cnkgPT4ge1xuICAgICAgICAgICAgaWYgKG1ldGFkYXRhRW50cnkudHlwZSAhPT0gYXNzZW1ibHkuQXJ0aWZhY3RNZXRhZGF0YUVudHJ5VHlwZS5TVEFDS19UQUdTIHx8ICFtZXRhZGF0YUVudHJ5LmRhdGEpIHsgcmV0dXJuIG1ldGFkYXRhRW50cnk7IH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIC4uLm1ldGFkYXRhRW50cnksXG4gICAgICAgICAgICAgIGRhdGE6IGZuKG1ldGFkYXRhRW50cnkuZGF0YSBhcyBhc3NlbWJseS5TdGFja1RhZ3NNZXRhZGF0YUVudHJ5KSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSkpLFxuICAgICAgICB9IGFzIGFzc2VtYmx5LkFydGlmYWN0TWFuaWZlc3QpO1xuICAgICAgfSksXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge31cbn1cblxudHlwZSBFbmRvZnVuY3RvcjxBPiA9ICh4OiBBKSA9PiBBO1xuXG5mdW5jdGlvbiBtYXBWYWx1ZXM8QSwgQj4oeHM6IFJlY29yZDxzdHJpbmcsIEE+IHwgdW5kZWZpbmVkLCBmbjogKHg6IEEpID0+IEIpOiBSZWNvcmQ8c3RyaW5nLCBCPiB8IHVuZGVmaW5lZCB7XG4gIGlmICgheHMpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICBjb25zdCByZXQ6IFJlY29yZDxzdHJpbmcsIEI+IHwgdW5kZWZpbmVkID0ge307XG4gIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKHhzKSkge1xuICAgIHJldFtrXSA9IGZuKHYpO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIG5vVW5kZWZpbmVkPEEgZXh0ZW5kcyBvYmplY3Q+KHhzOiBBKTogQSB7XG4gIGNvbnN0IHJldDogYW55ID0ge307XG4gIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKHhzKSkge1xuICAgIGlmICh2ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldFtrXSA9IHY7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIHN0cmlwRW51bUVycm9ycyhlcnJvcnM6IGpzb25zY2hlbWEuVmFsaWRhdGlvbkVycm9yW10pIHtcbiAgcmV0dXJuIGVycm9ycy5maWx0ZXIoZSA9PiB0eXBlb2YgZS5zY2hlbWEgPT09J3N0cmluZycgfHwgISgnZW51bScgaW4gZS5zY2hlbWEpKTtcbn1cbiJdfQ==