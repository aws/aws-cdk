"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudAssemblyBuilder = exports.CloudAssembly = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const os = require("os");
const path = require("path");
const cloudformation_artifact_1 = require("./artifacts/cloudformation-artifact");
const nested_cloud_assembly_artifact_1 = require("./artifacts/nested-cloud-assembly-artifact");
const tree_cloud_artifact_1 = require("./artifacts/tree-cloud-artifact");
const cloud_artifact_1 = require("./cloud-artifact");
const toposort_1 = require("./toposort");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
/**
 * The name of the root manifest file of the assembly.
 */
const MANIFEST_FILE = 'manifest.json';
/**
 * Represents a deployable cloud application.
 */
class CloudAssembly {
    /**
     * Reads a cloud assembly from the specified directory.
     * @param directory The root directory of the assembly.
     */
    constructor(directory, loadOptions) {
        this.directory = directory;
        this.manifest = cxschema.Manifest.loadAssemblyManifest(path.join(directory, MANIFEST_FILE), loadOptions);
        this.version = this.manifest.version;
        this.artifacts = this.renderArtifacts(loadOptions?.topoSort ?? true);
        this.runtime = this.manifest.runtime || { libraries: {} };
        // force validation of deps by accessing 'depends' on all artifacts
        this.validateDeps();
    }
    /**
     * Attempts to find an artifact with a specific identity.
     * @returns A `CloudArtifact` object or `undefined` if the artifact does not exist in this assembly.
     * @param id The artifact ID
     */
    tryGetArtifact(id) {
        return this.artifacts.find(a => a.id === id);
    }
    /**
     * Returns a CloudFormation stack artifact from this assembly.
     *
     * Will only search the current assembly.
     *
     * @param stackName the name of the CloudFormation stack.
     * @throws if there is no stack artifact by that name
     * @throws if there is more than one stack with the same stack name. You can
     * use `getStackArtifact(stack.artifactId)` instead.
     * @returns a `CloudFormationStackArtifact` object.
     */
    getStackByName(stackName) {
        const artifacts = this.artifacts.filter(a => a instanceof cloudformation_artifact_1.CloudFormationStackArtifact && a.stackName === stackName);
        if (!artifacts || artifacts.length === 0) {
            throw new Error(`Unable to find stack with stack name "${stackName}"`);
        }
        if (artifacts.length > 1) {
            // eslint-disable-next-line max-len
            throw new Error(`There are multiple stacks with the stack name "${stackName}" (${artifacts.map(a => a.id).join(',')}). Use "getStackArtifact(id)" instead`);
        }
        return artifacts[0];
    }
    /**
     * Returns a CloudFormation stack artifact by name from this assembly.
     * @deprecated renamed to `getStackByName` (or `getStackArtifact(id)`)
     */
    getStack(stackName) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/cx-api.CloudAssembly#getStack", "renamed to `getStackByName` (or `getStackArtifact(id)`)");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.getStack);
            }
            throw error;
        }
        return this.getStackByName(stackName);
    }
    /**
     * Returns a CloudFormation stack artifact from this assembly.
     *
     * @param artifactId the artifact id of the stack (can be obtained through `stack.artifactId`).
     * @throws if there is no stack artifact with that id
     * @returns a `CloudFormationStackArtifact` object.
     */
    getStackArtifact(artifactId) {
        const artifact = this.tryGetArtifactRecursively(artifactId);
        if (!artifact) {
            throw new Error(`Unable to find artifact with id "${artifactId}"`);
        }
        if (!(artifact instanceof cloudformation_artifact_1.CloudFormationStackArtifact)) {
            throw new Error(`Artifact ${artifactId} is not a CloudFormation stack`);
        }
        return artifact;
    }
    tryGetArtifactRecursively(artifactId) {
        return this.stacksRecursively.find(a => a.id === artifactId);
    }
    /**
     * Returns all the stacks, including the ones in nested assemblies
     */
    get stacksRecursively() {
        function search(stackArtifacts, assemblies) {
            if (assemblies.length === 0) {
                return stackArtifacts;
            }
            const [head, ...tail] = assemblies;
            const nestedAssemblies = head.nestedAssemblies.map(asm => asm.nestedAssembly);
            return search(stackArtifacts.concat(head.stacks), tail.concat(nestedAssemblies));
        }
        ;
        return search([], [this]);
    }
    /**
     * Returns a nested assembly artifact.
     *
     * @param artifactId The artifact ID of the nested assembly
     */
    getNestedAssemblyArtifact(artifactId) {
        const artifact = this.tryGetArtifact(artifactId);
        if (!artifact) {
            throw new Error(`Unable to find artifact with id "${artifactId}"`);
        }
        if (!(artifact instanceof nested_cloud_assembly_artifact_1.NestedCloudAssemblyArtifact)) {
            throw new Error(`Found artifact '${artifactId}' but it's not a nested cloud assembly`);
        }
        return artifact;
    }
    /**
     * Returns a nested assembly.
     *
     * @param artifactId The artifact ID of the nested assembly
     */
    getNestedAssembly(artifactId) {
        return this.getNestedAssemblyArtifact(artifactId).nestedAssembly;
    }
    /**
     * Returns the tree metadata artifact from this assembly.
     * @throws if there is no metadata artifact by that name
     * @returns a `TreeCloudArtifact` object if there is one defined in the manifest, `undefined` otherwise.
     */
    tree() {
        const trees = this.artifacts.filter(a => a.manifest.type === cxschema.ArtifactType.CDK_TREE);
        if (trees.length === 0) {
            return undefined;
        }
        else if (trees.length > 1) {
            throw new Error(`Multiple artifacts of type ${cxschema.ArtifactType.CDK_TREE} found in manifest`);
        }
        const tree = trees[0];
        if (!(tree instanceof tree_cloud_artifact_1.TreeCloudArtifact)) {
            throw new Error('"Tree" artifact is not of expected type');
        }
        return tree;
    }
    /**
     * @returns all the CloudFormation stack artifacts that are included in this assembly.
     */
    get stacks() {
        return this.artifacts.filter(isCloudFormationStackArtifact);
        function isCloudFormationStackArtifact(x) {
            return x instanceof cloudformation_artifact_1.CloudFormationStackArtifact;
        }
    }
    /**
     * The nested assembly artifacts in this assembly
     */
    get nestedAssemblies() {
        return this.artifacts.filter(isNestedCloudAssemblyArtifact);
        function isNestedCloudAssemblyArtifact(x) {
            return x instanceof nested_cloud_assembly_artifact_1.NestedCloudAssemblyArtifact;
        }
    }
    validateDeps() {
        for (const artifact of this.artifacts) {
            ignore(artifact.dependencies);
        }
    }
    renderArtifacts(topoSort) {
        const result = new Array();
        for (const [name, artifact] of Object.entries(this.manifest.artifacts || {})) {
            const cloudartifact = cloud_artifact_1.CloudArtifact.fromManifest(this, name, artifact);
            if (cloudartifact) {
                result.push(cloudartifact);
            }
        }
        return topoSort ? (0, toposort_1.topologicalSort)(result, x => x.id, x => x._dependencyIDs) : result;
    }
}
_a = JSII_RTTI_SYMBOL_1;
CloudAssembly[_a] = { fqn: "@aws-cdk/cx-api.CloudAssembly", version: "0.0.0" };
exports.CloudAssembly = CloudAssembly;
/**
 * Can be used to build a cloud assembly.
 */
class CloudAssemblyBuilder {
    /**
     * Initializes a cloud assembly builder.
     * @param outdir The output directory, uses temporary directory if undefined
     */
    constructor(outdir, props = {}) {
        this.artifacts = {};
        this.missing = new Array();
        try {
            jsiiDeprecationWarnings._aws_cdk_cx_api_CloudAssemblyBuilderProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CloudAssemblyBuilder);
            }
            throw error;
        }
        this.outdir = determineOutputDirectory(outdir);
        this.assetOutdir = props.assetOutdir ?? this.outdir;
        this.parentBuilder = props.parentBuilder;
        // we leverage the fact that outdir is long-lived to avoid staging assets into it
        // that were already staged (copying can be expensive). this is achieved by the fact
        // that assets use a source hash as their name. other artifacts, and the manifest itself,
        // will overwrite existing files as needed.
        ensureDirSync(this.outdir);
    }
    /**
     * Adds an artifact into the cloud assembly.
     * @param id The ID of the artifact.
     * @param manifest The artifact manifest
     */
    addArtifact(id, manifest) {
        this.artifacts[id] = filterUndefined(manifest);
    }
    /**
     * Reports that some context is missing in order for this cloud assembly to be fully synthesized.
     * @param missing Missing context information.
     */
    addMissing(missing) {
        if (this.missing.every(m => m.key !== missing.key)) {
            this.missing.push(missing);
        }
        // Also report in parent
        this.parentBuilder?.addMissing(missing);
    }
    /**
     * Finalizes the cloud assembly into the output directory returns a
     * `CloudAssembly` object that can be used to inspect the assembly.
     * @param options
     */
    buildAssembly(options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_cx_api_AssemblyBuildOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.buildAssembly);
            }
            throw error;
        }
        // explicitly initializing this type will help us detect
        // breaking changes. (For example adding a required property will break compilation).
        let manifest = {
            version: cxschema.Manifest.version(),
            artifacts: this.artifacts,
            runtime: options.runtimeInfo,
            missing: this.missing.length > 0 ? this.missing : undefined,
        };
        // now we can filter
        manifest = filterUndefined(manifest);
        const manifestFilePath = path.join(this.outdir, MANIFEST_FILE);
        cxschema.Manifest.saveAssemblyManifest(manifest, manifestFilePath);
        // "backwards compatibility": in order for the old CLI to tell the user they
        // need a new version, we'll emit the legacy manifest with only "version".
        // this will result in an error "CDK Toolkit >= CLOUD_ASSEMBLY_VERSION is required in order to interact with this program."
        fs.writeFileSync(path.join(this.outdir, 'cdk.out'), JSON.stringify({ version: manifest.version }));
        return new CloudAssembly(this.outdir);
    }
    /**
     * Creates a nested cloud assembly
     */
    createNestedAssembly(artifactId, displayName) {
        const directoryName = artifactId;
        const innerAsmDir = path.join(this.outdir, directoryName);
        this.addArtifact(artifactId, {
            type: cxschema.ArtifactType.NESTED_CLOUD_ASSEMBLY,
            properties: {
                directoryName,
                displayName,
            },
        });
        return new CloudAssemblyBuilder(innerAsmDir, {
            // Reuse the same asset output directory as the current Casm builder
            assetOutdir: this.assetOutdir,
            parentBuilder: this,
        });
    }
    /**
     * Delete the cloud assembly directory
     */
    delete() {
        fs.rmSync(this.outdir, { recursive: true, force: true });
    }
}
_b = JSII_RTTI_SYMBOL_1;
CloudAssemblyBuilder[_b] = { fqn: "@aws-cdk/cx-api.CloudAssemblyBuilder", version: "0.0.0" };
exports.CloudAssemblyBuilder = CloudAssemblyBuilder;
/**
 * Returns a copy of `obj` without undefined values in maps or arrays.
 */
function filterUndefined(obj) {
    if (Array.isArray(obj)) {
        return obj.filter(x => x !== undefined).map(x => filterUndefined(x));
    }
    if (typeof (obj) === 'object') {
        const ret = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value === undefined) {
                continue;
            }
            ret[key] = filterUndefined(value);
        }
        return ret;
    }
    return obj;
}
function ignore(_x) {
    return;
}
/**
 * Turn the given optional output directory into a fixed output directory
 */
function determineOutputDirectory(outdir) {
    return outdir ?? fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'cdk.out'));
}
function ensureDirSync(dir) {
    if (fs.existsSync(dir)) {
        if (!fs.statSync(dir).isDirectory()) {
            throw new Error(`${dir} must be a directory`);
        }
    }
    else {
        fs.mkdirSync(dir, { recursive: true });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvdWQtYXNzZW1ibHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjbG91ZC1hc3NlbWJseS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx5QkFBeUI7QUFDekIseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixpRkFBa0Y7QUFDbEYsK0ZBQXlGO0FBQ3pGLHlFQUFvRTtBQUNwRSxxREFBaUQ7QUFDakQseUNBQTZDO0FBQzdDLDJEQUEyRDtBQUUzRDs7R0FFRztBQUNILE1BQU0sYUFBYSxHQUFHLGVBQWUsQ0FBQztBQUV0Qzs7R0FFRztBQUNILE1BQWEsYUFBYTtJQTBCeEI7OztPQUdHO0lBQ0gsWUFBWSxTQUFpQixFQUFFLFdBQTBDO1FBQ3ZFLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBRTNCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN6RyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLEVBQUUsUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLElBQUksRUFBRSxTQUFTLEVBQUUsRUFBRyxFQUFFLENBQUM7UUFFM0QsbUVBQW1FO1FBQ25FLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztLQUNyQjtJQUVEOzs7O09BSUc7SUFDSSxjQUFjLENBQUMsRUFBVTtRQUM5QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztL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QUFDO0FBRUQsU0FBUyxhQUFhLENBQUMsR0FBVztJQUNoQyxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDdEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLEdBQUcsc0JBQXNCLENBQUMsQ0FBQztTQUMvQztLQUNGO1NBQU07UUFDTCxFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQ3hDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIG9zIGZyb20gJ29zJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBDbG91ZEZvcm1hdGlvblN0YWNrQXJ0aWZhY3QgfSBmcm9tICcuL2FydGlmYWN0cy9jbG91ZGZvcm1hdGlvbi1hcnRpZmFjdCc7XG5pbXBvcnQgeyBOZXN0ZWRDbG91ZEFzc2VtYmx5QXJ0aWZhY3QgfSBmcm9tICcuL2FydGlmYWN0cy9uZXN0ZWQtY2xvdWQtYXNzZW1ibHktYXJ0aWZhY3QnO1xuaW1wb3J0IHsgVHJlZUNsb3VkQXJ0aWZhY3QgfSBmcm9tICcuL2FydGlmYWN0cy90cmVlLWNsb3VkLWFydGlmYWN0JztcbmltcG9ydCB7IENsb3VkQXJ0aWZhY3QgfSBmcm9tICcuL2Nsb3VkLWFydGlmYWN0JztcbmltcG9ydCB7IHRvcG9sb2dpY2FsU29ydCB9IGZyb20gJy4vdG9wb3NvcnQnO1xuaW1wb3J0ICogYXMgY3hzY2hlbWEgZnJvbSAnQGF3cy1jZGsvY2xvdWQtYXNzZW1ibHktc2NoZW1hJztcblxuLyoqXG4gKiBUaGUgbmFtZSBvZiB0aGUgcm9vdCBtYW5pZmVzdCBmaWxlIG9mIHRoZSBhc3NlbWJseS5cbiAqL1xuY29uc3QgTUFOSUZFU1RfRklMRSA9ICdtYW5pZmVzdC5qc29uJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgZGVwbG95YWJsZSBjbG91ZCBhcHBsaWNhdGlvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIENsb3VkQXNzZW1ibHkge1xuICAvKipcbiAgICogVGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoZSBjbG91ZCBhc3NlbWJseS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkaXJlY3Rvcnk6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHNjaGVtYSB2ZXJzaW9uIG9mIHRoZSBhc3NlbWJseSBtYW5pZmVzdC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB2ZXJzaW9uOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFsbCBhcnRpZmFjdHMgaW5jbHVkZWQgaW4gdGhpcyBhc3NlbWJseS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBhcnRpZmFjdHM6IENsb3VkQXJ0aWZhY3RbXTtcblxuICAvKipcbiAgICogUnVudGltZSBpbmZvcm1hdGlvbiBzdWNoIGFzIG1vZHVsZSB2ZXJzaW9ucyB1c2VkIHRvIHN5bnRoZXNpemUgdGhpcyBhc3NlbWJseS5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBydW50aW1lOiBjeHNjaGVtYS5SdW50aW1lSW5mbztcblxuICAvKipcbiAgICogVGhlIHJhdyBhc3NlbWJseSBtYW5pZmVzdC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBtYW5pZmVzdDogY3hzY2hlbWEuQXNzZW1ibHlNYW5pZmVzdDtcblxuICAvKipcbiAgICogUmVhZHMgYSBjbG91ZCBhc3NlbWJseSBmcm9tIHRoZSBzcGVjaWZpZWQgZGlyZWN0b3J5LlxuICAgKiBAcGFyYW0gZGlyZWN0b3J5IFRoZSByb290IGRpcmVjdG9yeSBvZiB0aGUgYXNzZW1ibHkuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihkaXJlY3Rvcnk6IHN0cmluZywgbG9hZE9wdGlvbnM/OiBjeHNjaGVtYS5Mb2FkTWFuaWZlc3RPcHRpb25zKSB7XG4gICAgdGhpcy5kaXJlY3RvcnkgPSBkaXJlY3Rvcnk7XG5cbiAgICB0aGlzLm1hbmlmZXN0ID0gY3hzY2hlbWEuTWFuaWZlc3QubG9hZEFzc2VtYmx5TWFuaWZlc3QocGF0aC5qb2luKGRpcmVjdG9yeSwgTUFOSUZFU1RfRklMRSksIGxvYWRPcHRpb25zKTtcbiAgICB0aGlzLnZlcnNpb24gPSB0aGlzLm1hbmlmZXN0LnZlcnNpb247XG4gICAgdGhpcy5hcnRpZmFjdHMgPSB0aGlzLnJlbmRlckFydGlmYWN0cyhsb2FkT3B0aW9ucz8udG9wb1NvcnQgPz8gdHJ1ZSk7XG4gICAgdGhpcy5ydW50aW1lID0gdGhpcy5tYW5pZmVzdC5ydW50aW1lIHx8IHsgbGlicmFyaWVzOiB7IH0gfTtcblxuICAgIC8vIGZvcmNlIHZhbGlkYXRpb24gb2YgZGVwcyBieSBhY2Nlc3NpbmcgJ2RlcGVuZHMnIG9uIGFsbCBhcnRpZmFjdHNcbiAgICB0aGlzLnZhbGlkYXRlRGVwcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHRzIHRvIGZpbmQgYW4gYXJ0aWZhY3Qgd2l0aCBhIHNwZWNpZmljIGlkZW50aXR5LlxuICAgKiBAcmV0dXJucyBBIGBDbG91ZEFydGlmYWN0YCBvYmplY3Qgb3IgYHVuZGVmaW5lZGAgaWYgdGhlIGFydGlmYWN0IGRvZXMgbm90IGV4aXN0IGluIHRoaXMgYXNzZW1ibHkuXG4gICAqIEBwYXJhbSBpZCBUaGUgYXJ0aWZhY3QgSURcbiAgICovXG4gIHB1YmxpYyB0cnlHZXRBcnRpZmFjdChpZDogc3RyaW5nKTogQ2xvdWRBcnRpZmFjdCB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuYXJ0aWZhY3RzLmZpbmQoYSA9PiBhLmlkID09PSBpZCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIENsb3VkRm9ybWF0aW9uIHN0YWNrIGFydGlmYWN0IGZyb20gdGhpcyBhc3NlbWJseS5cbiAgICpcbiAgICogV2lsbCBvbmx5IHNlYXJjaCB0aGUgY3VycmVudCBhc3NlbWJseS5cbiAgICpcbiAgICogQHBhcmFtIHN0YWNrTmFtZSB0aGUgbmFtZSBvZiB0aGUgQ2xvdWRGb3JtYXRpb24gc3RhY2suXG4gICAqIEB0aHJvd3MgaWYgdGhlcmUgaXMgbm8gc3RhY2sgYXJ0aWZhY3QgYnkgdGhhdCBuYW1lXG4gICAqIEB0aHJvd3MgaWYgdGhlcmUgaXMgbW9yZSB0aGFuIG9uZSBzdGFjayB3aXRoIHRoZSBzYW1lIHN0YWNrIG5hbWUuIFlvdSBjYW5cbiAgICogdXNlIGBnZXRTdGFja0FydGlmYWN0KHN0YWNrLmFydGlmYWN0SWQpYCBpbnN0ZWFkLlxuICAgKiBAcmV0dXJucyBhIGBDbG91ZEZvcm1hdGlvblN0YWNrQXJ0aWZhY3RgIG9iamVjdC5cbiAgICovXG4gIHB1YmxpYyBnZXRTdGFja0J5TmFtZShzdGFja05hbWU6IHN0cmluZyk6IENsb3VkRm9ybWF0aW9uU3RhY2tBcnRpZmFjdCB7XG4gICAgY29uc3QgYXJ0aWZhY3RzID0gdGhpcy5hcnRpZmFjdHMuZmlsdGVyKGEgPT4gYSBpbnN0YW5jZW9mIENsb3VkRm9ybWF0aW9uU3RhY2tBcnRpZmFjdCAmJiBhLnN0YWNrTmFtZSA9PT0gc3RhY2tOYW1lKTtcbiAgICBpZiAoIWFydGlmYWN0cyB8fCBhcnRpZmFjdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBmaW5kIHN0YWNrIHdpdGggc3RhY2sgbmFtZSBcIiR7c3RhY2tOYW1lfVwiYCk7XG4gICAgfVxuXG4gICAgaWYgKGFydGlmYWN0cy5sZW5ndGggPiAxKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGVyZSBhcmUgbXVsdGlwbGUgc3RhY2tzIHdpdGggdGhlIHN0YWNrIG5hbWUgXCIke3N0YWNrTmFtZX1cIiAoJHthcnRpZmFjdHMubWFwKGEgPT4gYS5pZCkuam9pbignLCcpfSkuIFVzZSBcImdldFN0YWNrQXJ0aWZhY3QoaWQpXCIgaW5zdGVhZGApO1xuICAgIH1cblxuICAgIHJldHVybiBhcnRpZmFjdHNbMF0gYXMgQ2xvdWRGb3JtYXRpb25TdGFja0FydGlmYWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBDbG91ZEZvcm1hdGlvbiBzdGFjayBhcnRpZmFjdCBieSBuYW1lIGZyb20gdGhpcyBhc3NlbWJseS5cbiAgICogQGRlcHJlY2F0ZWQgcmVuYW1lZCB0byBgZ2V0U3RhY2tCeU5hbWVgIChvciBgZ2V0U3RhY2tBcnRpZmFjdChpZClgKVxuICAgKi9cbiAgcHVibGljIGdldFN0YWNrKHN0YWNrTmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U3RhY2tCeU5hbWUoc3RhY2tOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgQ2xvdWRGb3JtYXRpb24gc3RhY2sgYXJ0aWZhY3QgZnJvbSB0aGlzIGFzc2VtYmx5LlxuICAgKlxuICAgKiBAcGFyYW0gYXJ0aWZhY3RJZCB0aGUgYXJ0aWZhY3QgaWQgb2YgdGhlIHN0YWNrIChjYW4gYmUgb2J0YWluZWQgdGhyb3VnaCBgc3RhY2suYXJ0aWZhY3RJZGApLlxuICAgKiBAdGhyb3dzIGlmIHRoZXJlIGlzIG5vIHN0YWNrIGFydGlmYWN0IHdpdGggdGhhdCBpZFxuICAgKiBAcmV0dXJucyBhIGBDbG91ZEZvcm1hdGlvblN0YWNrQXJ0aWZhY3RgIG9iamVjdC5cbiAgICovXG4gIHB1YmxpYyBnZXRTdGFja0FydGlmYWN0KGFydGlmYWN0SWQ6IHN0cmluZyk6IENsb3VkRm9ybWF0aW9uU3RhY2tBcnRpZmFjdCB7XG4gICAgY29uc3QgYXJ0aWZhY3QgPSB0aGlzLnRyeUdldEFydGlmYWN0UmVjdXJzaXZlbHkoYXJ0aWZhY3RJZCk7XG5cbiAgICBpZiAoIWFydGlmYWN0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBmaW5kIGFydGlmYWN0IHdpdGggaWQgXCIke2FydGlmYWN0SWR9XCJgKTtcbiAgICB9XG5cbiAgICBpZiAoIShhcnRpZmFjdCBpbnN0YW5jZW9mIENsb3VkRm9ybWF0aW9uU3RhY2tBcnRpZmFjdCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQXJ0aWZhY3QgJHthcnRpZmFjdElkfSBpcyBub3QgYSBDbG91ZEZvcm1hdGlvbiBzdGFja2ApO1xuICAgIH1cblxuICAgIHJldHVybiBhcnRpZmFjdDtcbiAgfVxuXG4gIHByaXZhdGUgdHJ5R2V0QXJ0aWZhY3RSZWN1cnNpdmVseShhcnRpZmFjdElkOiBzdHJpbmcpOiBDbG91ZEFydGlmYWN0IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5zdGFja3NSZWN1cnNpdmVseS5maW5kKGEgPT4gYS5pZCA9PT0gYXJ0aWZhY3RJZCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbGwgdGhlIHN0YWNrcywgaW5jbHVkaW5nIHRoZSBvbmVzIGluIG5lc3RlZCBhc3NlbWJsaWVzXG4gICAqL1xuICBwdWJsaWMgZ2V0IHN0YWNrc1JlY3Vyc2l2ZWx5KCk6IENsb3VkRm9ybWF0aW9uU3RhY2tBcnRpZmFjdFtdIHtcbiAgICBmdW5jdGlvbiBzZWFyY2goc3RhY2tBcnRpZmFjdHM6IENsb3VkRm9ybWF0aW9uU3RhY2tBcnRpZmFjdFtdLCBhc3NlbWJsaWVzOiBDbG91ZEFzc2VtYmx5W10pOiBDbG91ZEZvcm1hdGlvblN0YWNrQXJ0aWZhY3RbXSB7XG4gICAgICBpZiAoYXNzZW1ibGllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHN0YWNrQXJ0aWZhY3RzO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBbaGVhZCwgLi4udGFpbF0gPSBhc3NlbWJsaWVzO1xuICAgICAgY29uc3QgbmVzdGVkQXNzZW1ibGllcyA9IGhlYWQubmVzdGVkQXNzZW1ibGllcy5tYXAoYXNtID0+IGFzbS5uZXN0ZWRBc3NlbWJseSk7XG4gICAgICByZXR1cm4gc2VhcmNoKHN0YWNrQXJ0aWZhY3RzLmNvbmNhdChoZWFkLnN0YWNrcyksIHRhaWwuY29uY2F0KG5lc3RlZEFzc2VtYmxpZXMpKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHNlYXJjaChbXSwgW3RoaXNdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbmVzdGVkIGFzc2VtYmx5IGFydGlmYWN0LlxuICAgKlxuICAgKiBAcGFyYW0gYXJ0aWZhY3RJZCBUaGUgYXJ0aWZhY3QgSUQgb2YgdGhlIG5lc3RlZCBhc3NlbWJseVxuICAgKi9cbiAgcHVibGljIGdldE5lc3RlZEFzc2VtYmx5QXJ0aWZhY3QoYXJ0aWZhY3RJZDogc3RyaW5nKTogTmVzdGVkQ2xvdWRBc3NlbWJseUFydGlmYWN0IHtcbiAgICBjb25zdCBhcnRpZmFjdCA9IHRoaXMudHJ5R2V0QXJ0aWZhY3QoYXJ0aWZhY3RJZCk7XG4gICAgaWYgKCFhcnRpZmFjdCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gZmluZCBhcnRpZmFjdCB3aXRoIGlkIFwiJHthcnRpZmFjdElkfVwiYCk7XG4gICAgfVxuXG4gICAgaWYgKCEoYXJ0aWZhY3QgaW5zdGFuY2VvZiBOZXN0ZWRDbG91ZEFzc2VtYmx5QXJ0aWZhY3QpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEZvdW5kIGFydGlmYWN0ICcke2FydGlmYWN0SWR9JyBidXQgaXQncyBub3QgYSBuZXN0ZWQgY2xvdWQgYXNzZW1ibHlgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJ0aWZhY3Q7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIG5lc3RlZCBhc3NlbWJseS5cbiAgICpcbiAgICogQHBhcmFtIGFydGlmYWN0SWQgVGhlIGFydGlmYWN0IElEIG9mIHRoZSBuZXN0ZWQgYXNzZW1ibHlcbiAgICovXG4gIHB1YmxpYyBnZXROZXN0ZWRBc3NlbWJseShhcnRpZmFjdElkOiBzdHJpbmcpOiBDbG91ZEFzc2VtYmx5IHtcbiAgICByZXR1cm4gdGhpcy5nZXROZXN0ZWRBc3NlbWJseUFydGlmYWN0KGFydGlmYWN0SWQpLm5lc3RlZEFzc2VtYmx5O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRyZWUgbWV0YWRhdGEgYXJ0aWZhY3QgZnJvbSB0aGlzIGFzc2VtYmx5LlxuICAgKiBAdGhyb3dzIGlmIHRoZXJlIGlzIG5vIG1ldGFkYXRhIGFydGlmYWN0IGJ5IHRoYXQgbmFtZVxuICAgKiBAcmV0dXJucyBhIGBUcmVlQ2xvdWRBcnRpZmFjdGAgb2JqZWN0IGlmIHRoZXJlIGlzIG9uZSBkZWZpbmVkIGluIHRoZSBtYW5pZmVzdCwgYHVuZGVmaW5lZGAgb3RoZXJ3aXNlLlxuICAgKi9cbiAgcHVibGljIHRyZWUoKTogVHJlZUNsb3VkQXJ0aWZhY3QgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IHRyZWVzID0gdGhpcy5hcnRpZmFjdHMuZmlsdGVyKGEgPT4gYS5tYW5pZmVzdC50eXBlID09PSBjeHNjaGVtYS5BcnRpZmFjdFR5cGUuQ0RLX1RSRUUpO1xuICAgIGlmICh0cmVlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIGlmICh0cmVlcy5sZW5ndGggPiAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE11bHRpcGxlIGFydGlmYWN0cyBvZiB0eXBlICR7Y3hzY2hlbWEuQXJ0aWZhY3RUeXBlLkNES19UUkVFfSBmb3VuZCBpbiBtYW5pZmVzdGApO1xuICAgIH1cbiAgICBjb25zdCB0cmVlID0gdHJlZXNbMF07XG5cbiAgICBpZiAoISh0cmVlIGluc3RhbmNlb2YgVHJlZUNsb3VkQXJ0aWZhY3QpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiVHJlZVwiIGFydGlmYWN0IGlzIG5vdCBvZiBleHBlY3RlZCB0eXBlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRyZWU7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgYWxsIHRoZSBDbG91ZEZvcm1hdGlvbiBzdGFjayBhcnRpZmFjdHMgdGhhdCBhcmUgaW5jbHVkZWQgaW4gdGhpcyBhc3NlbWJseS5cbiAgICovXG4gIHB1YmxpYyBnZXQgc3RhY2tzKCk6IENsb3VkRm9ybWF0aW9uU3RhY2tBcnRpZmFjdFtdIHtcbiAgICByZXR1cm4gdGhpcy5hcnRpZmFjdHMuZmlsdGVyKGlzQ2xvdWRGb3JtYXRpb25TdGFja0FydGlmYWN0KTtcblxuICAgIGZ1bmN0aW9uIGlzQ2xvdWRGb3JtYXRpb25TdGFja0FydGlmYWN0KHg6IGFueSk6IHggaXMgQ2xvdWRGb3JtYXRpb25TdGFja0FydGlmYWN0IHtcbiAgICAgIHJldHVybiB4IGluc3RhbmNlb2YgQ2xvdWRGb3JtYXRpb25TdGFja0FydGlmYWN0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbmVzdGVkIGFzc2VtYmx5IGFydGlmYWN0cyBpbiB0aGlzIGFzc2VtYmx5XG4gICAqL1xuICBwdWJsaWMgZ2V0IG5lc3RlZEFzc2VtYmxpZXMoKTogTmVzdGVkQ2xvdWRBc3NlbWJseUFydGlmYWN0W10ge1xuICAgIHJldHVybiB0aGlzLmFydGlmYWN0cy5maWx0ZXIoaXNOZXN0ZWRDbG91ZEFzc2VtYmx5QXJ0aWZhY3QpO1xuXG4gICAgZnVuY3Rpb24gaXNOZXN0ZWRDbG91ZEFzc2VtYmx5QXJ0aWZhY3QoeDogYW55KTogeCBpcyBOZXN0ZWRDbG91ZEFzc2VtYmx5QXJ0aWZhY3Qge1xuICAgICAgcmV0dXJuIHggaW5zdGFuY2VvZiBOZXN0ZWRDbG91ZEFzc2VtYmx5QXJ0aWZhY3Q7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZURlcHMoKSB7XG4gICAgZm9yIChjb25zdCBhcnRpZmFjdCBvZiB0aGlzLmFydGlmYWN0cykge1xuICAgICAgaWdub3JlKGFydGlmYWN0LmRlcGVuZGVuY2llcyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJBcnRpZmFjdHModG9wb1NvcnQ6IGJvb2xlYW4pIHtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgQXJyYXk8Q2xvdWRBcnRpZmFjdD4oKTtcbiAgICBmb3IgKGNvbnN0IFtuYW1lLCBhcnRpZmFjdF0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5tYW5pZmVzdC5hcnRpZmFjdHMgfHwgeyB9KSkge1xuICAgICAgY29uc3QgY2xvdWRhcnRpZmFjdCA9IENsb3VkQXJ0aWZhY3QuZnJvbU1hbmlmZXN0KHRoaXMsIG5hbWUsIGFydGlmYWN0KTtcbiAgICAgIGlmIChjbG91ZGFydGlmYWN0KSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKGNsb3VkYXJ0aWZhY3QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0b3BvU29ydCA/IHRvcG9sb2dpY2FsU29ydChyZXN1bHQsIHggPT4geC5pZCwgeCA9PiB4Ll9kZXBlbmRlbmN5SURzKSA6IHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIGZvciBDbG91ZEFzc2VtYmx5QnVpbGRlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIENsb3VkQXNzZW1ibHlCdWlsZGVyUHJvcHMge1xuICAvKipcbiAgICogVXNlIHRoZSBnaXZlbiBhc3NldCBvdXRwdXQgZGlyZWN0b3J5XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gU2FtZSBhcyB0aGUgbWFuaWZlc3Qgb3V0ZGlyXG4gICAqL1xuICByZWFkb25seSBhc3NldE91dGRpcj86IHN0cmluZztcblxuICAvKipcbiAgICogSWYgdGhpcyBidWlsZGVyIGlzIGZvciBhIG5lc3RlZCBhc3NlbWJseSwgdGhlIHBhcmVudCBhc3NlbWJseSBidWlsZGVyXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVGhpcyBpcyBhIHJvb3QgYXNzZW1ibHlcbiAgICovXG4gIHJlYWRvbmx5IHBhcmVudEJ1aWxkZXI/OiBDbG91ZEFzc2VtYmx5QnVpbGRlcjtcbn1cblxuLyoqXG4gKiBDYW4gYmUgdXNlZCB0byBidWlsZCBhIGNsb3VkIGFzc2VtYmx5LlxuICovXG5leHBvcnQgY2xhc3MgQ2xvdWRBc3NlbWJseUJ1aWxkZXIge1xuICAvKipcbiAgICogVGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoZSByZXN1bHRpbmcgY2xvdWQgYXNzZW1ibHkuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgb3V0ZGlyOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBkaXJlY3Rvcnkgd2hlcmUgYXNzZXRzIG9mIHRoaXMgQ2xvdWQgQXNzZW1ibHkgc2hvdWxkIGJlIHN0b3JlZFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGFzc2V0T3V0ZGlyOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBhcnRpZmFjdHM6IHsgW2lkOiBzdHJpbmddOiBjeHNjaGVtYS5BcnRpZmFjdE1hbmlmZXN0IH0gPSB7IH07XG4gIHByaXZhdGUgcmVhZG9ubHkgbWlzc2luZyA9IG5ldyBBcnJheTxjeHNjaGVtYS5NaXNzaW5nQ29udGV4dD4oKTtcbiAgcHJpdmF0ZSByZWFkb25seSBwYXJlbnRCdWlsZGVyPzogQ2xvdWRBc3NlbWJseUJ1aWxkZXI7XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIGEgY2xvdWQgYXNzZW1ibHkgYnVpbGRlci5cbiAgICogQHBhcmFtIG91dGRpciBUaGUgb3V0cHV0IGRpcmVjdG9yeSwgdXNlcyB0ZW1wb3JhcnkgZGlyZWN0b3J5IGlmIHVuZGVmaW5lZFxuICAgKi9cbiAgY29uc3RydWN0b3Iob3V0ZGlyPzogc3RyaW5nLCBwcm9wczogQ2xvdWRBc3NlbWJseUJ1aWxkZXJQcm9wcyA9IHt9KSB7XG4gICAgdGhpcy5vdXRkaXIgPSBkZXRlcm1pbmVPdXRwdXREaXJlY3Rvcnkob3V0ZGlyKTtcbiAgICB0aGlzLmFzc2V0T3V0ZGlyID0gcHJvcHMuYXNzZXRPdXRkaXIgPz8gdGhpcy5vdXRkaXI7XG4gICAgdGhpcy5wYXJlbnRCdWlsZGVyID0gcHJvcHMucGFyZW50QnVpbGRlcjtcblxuICAgIC8vIHdlIGxldmVyYWdlIHRoZSBmYWN0IHRoYXQgb3V0ZGlyIGlzIGxvbmctbGl2ZWQgdG8gYXZvaWQgc3RhZ2luZyBhc3NldHMgaW50byBpdFxuICAgIC8vIHRoYXQgd2VyZSBhbHJlYWR5IHN0YWdlZCAoY29weWluZyBjYW4gYmUgZXhwZW5zaXZlKS4gdGhpcyBpcyBhY2hpZXZlZCBieSB0aGUgZmFjdFxuICAgIC8vIHRoYXQgYXNzZXRzIHVzZSBhIHNvdXJjZSBoYXNoIGFzIHRoZWlyIG5hbWUuIG90aGVyIGFydGlmYWN0cywgYW5kIHRoZSBtYW5pZmVzdCBpdHNlbGYsXG4gICAgLy8gd2lsbCBvdmVyd3JpdGUgZXhpc3RpbmcgZmlsZXMgYXMgbmVlZGVkLlxuICAgIGVuc3VyZURpclN5bmModGhpcy5vdXRkaXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gYXJ0aWZhY3QgaW50byB0aGUgY2xvdWQgYXNzZW1ibHkuXG4gICAqIEBwYXJhbSBpZCBUaGUgSUQgb2YgdGhlIGFydGlmYWN0LlxuICAgKiBAcGFyYW0gbWFuaWZlc3QgVGhlIGFydGlmYWN0IG1hbmlmZXN0XG4gICAqL1xuICBwdWJsaWMgYWRkQXJ0aWZhY3QoaWQ6IHN0cmluZywgbWFuaWZlc3Q6IGN4c2NoZW1hLkFydGlmYWN0TWFuaWZlc3QpIHtcbiAgICB0aGlzLmFydGlmYWN0c1tpZF0gPSBmaWx0ZXJVbmRlZmluZWQobWFuaWZlc3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcG9ydHMgdGhhdCBzb21lIGNvbnRleHQgaXMgbWlzc2luZyBpbiBvcmRlciBmb3IgdGhpcyBjbG91ZCBhc3NlbWJseSB0byBiZSBmdWxseSBzeW50aGVzaXplZC5cbiAgICogQHBhcmFtIG1pc3NpbmcgTWlzc2luZyBjb250ZXh0IGluZm9ybWF0aW9uLlxuICAgKi9cbiAgcHVibGljIGFkZE1pc3NpbmcobWlzc2luZzogY3hzY2hlbWEuTWlzc2luZ0NvbnRleHQpIHtcbiAgICBpZiAodGhpcy5taXNzaW5nLmV2ZXJ5KG0gPT4gbS5rZXkgIT09IG1pc3Npbmcua2V5KSkge1xuICAgICAgdGhpcy5taXNzaW5nLnB1c2gobWlzc2luZyk7XG4gICAgfVxuICAgIC8vIEFsc28gcmVwb3J0IGluIHBhcmVudFxuICAgIHRoaXMucGFyZW50QnVpbGRlcj8uYWRkTWlzc2luZyhtaXNzaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5hbGl6ZXMgdGhlIGNsb3VkIGFzc2VtYmx5IGludG8gdGhlIG91dHB1dCBkaXJlY3RvcnkgcmV0dXJucyBhXG4gICAqIGBDbG91ZEFzc2VtYmx5YCBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byBpbnNwZWN0IHRoZSBhc3NlbWJseS5cbiAgICogQHBhcmFtIG9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBidWlsZEFzc2VtYmx5KG9wdGlvbnM6IEFzc2VtYmx5QnVpbGRPcHRpb25zID0geyB9KTogQ2xvdWRBc3NlbWJseSB7XG5cbiAgICAvLyBleHBsaWNpdGx5IGluaXRpYWxpemluZyB0aGlzIHR5cGUgd2lsbCBoZWxwIHVzIGRldGVjdFxuICAgIC8vIGJyZWFraW5nIGNoYW5nZXMuIChGb3IgZXhhbXBsZSBhZGRpbmcgYSByZXF1aXJlZCBwcm9wZXJ0eSB3aWxsIGJyZWFrIGNvbXBpbGF0aW9uKS5cbiAgICBsZXQgbWFuaWZlc3Q6IGN4c2NoZW1hLkFzc2VtYmx5TWFuaWZlc3QgPSB7XG4gICAgICB2ZXJzaW9uOiBjeHNjaGVtYS5NYW5pZmVzdC52ZXJzaW9uKCksXG4gICAgICBhcnRpZmFjdHM6IHRoaXMuYXJ0aWZhY3RzLFxuICAgICAgcnVudGltZTogb3B0aW9ucy5ydW50aW1lSW5mbyxcbiAgICAgIG1pc3Npbmc6IHRoaXMubWlzc2luZy5sZW5ndGggPiAwID8gdGhpcy5taXNzaW5nIDogdW5kZWZpbmVkLFxuICAgIH07XG5cbiAgICAvLyBub3cgd2UgY2FuIGZpbHRlclxuICAgIG1hbmlmZXN0ID0gZmlsdGVyVW5kZWZpbmVkKG1hbmlmZXN0KTtcblxuICAgIGNvbnN0IG1hbmlmZXN0RmlsZVBhdGggPSBwYXRoLmpvaW4odGhpcy5vdXRkaXIsIE1BTklGRVNUX0ZJTEUpO1xuICAgIGN4c2NoZW1hLk1hbmlmZXN0LnNhdmVBc3NlbWJseU1hbmlmZXN0KG1hbmlmZXN0LCBtYW5pZmVzdEZpbGVQYXRoKTtcblxuICAgIC8vIFwiYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcIjogaW4gb3JkZXIgZm9yIHRoZSBvbGQgQ0xJIHRvIHRlbGwgdGhlIHVzZXIgdGhleVxuICAgIC8vIG5lZWQgYSBuZXcgdmVyc2lvbiwgd2UnbGwgZW1pdCB0aGUgbGVnYWN5IG1hbmlmZXN0IHdpdGggb25seSBcInZlcnNpb25cIi5cbiAgICAvLyB0aGlzIHdpbGwgcmVzdWx0IGluIGFuIGVycm9yIFwiQ0RLIFRvb2xraXQgPj0gQ0xPVURfQVNTRU1CTFlfVkVSU0lPTiBpcyByZXF1aXJlZCBpbiBvcmRlciB0byBpbnRlcmFjdCB3aXRoIHRoaXMgcHJvZ3JhbS5cIlxuICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKHRoaXMub3V0ZGlyLCAnY2RrLm91dCcpLCBKU09OLnN0cmluZ2lmeSh7IHZlcnNpb246IG1hbmlmZXN0LnZlcnNpb24gfSkpO1xuXG4gICAgcmV0dXJuIG5ldyBDbG91ZEFzc2VtYmx5KHRoaXMub3V0ZGlyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmVzdGVkIGNsb3VkIGFzc2VtYmx5XG4gICAqL1xuICBwdWJsaWMgY3JlYXRlTmVzdGVkQXNzZW1ibHkoYXJ0aWZhY3RJZDogc3RyaW5nLCBkaXNwbGF5TmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgZGlyZWN0b3J5TmFtZSA9IGFydGlmYWN0SWQ7XG4gICAgY29uc3QgaW5uZXJBc21EaXIgPSBwYXRoLmpvaW4odGhpcy5vdXRkaXIsIGRpcmVjdG9yeU5hbWUpO1xuXG4gICAgdGhpcy5hZGRBcnRpZmFjdChhcnRpZmFjdElkLCB7XG4gICAgICB0eXBlOiBjeHNjaGVtYS5BcnRpZmFjdFR5cGUuTkVTVEVEX0NMT1VEX0FTU0VNQkxZLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBkaXJlY3RvcnlOYW1lLFxuICAgICAgICBkaXNwbGF5TmFtZSxcbiAgICAgIH0gYXMgY3hzY2hlbWEuTmVzdGVkQ2xvdWRBc3NlbWJseVByb3BlcnRpZXMsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gbmV3IENsb3VkQXNzZW1ibHlCdWlsZGVyKGlubmVyQXNtRGlyLCB7XG4gICAgICAvLyBSZXVzZSB0aGUgc2FtZSBhc3NldCBvdXRwdXQgZGlyZWN0b3J5IGFzIHRoZSBjdXJyZW50IENhc20gYnVpbGRlclxuICAgICAgYXNzZXRPdXRkaXI6IHRoaXMuYXNzZXRPdXRkaXIsXG4gICAgICBwYXJlbnRCdWlsZGVyOiB0aGlzLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZSB0aGUgY2xvdWQgYXNzZW1ibHkgZGlyZWN0b3J5XG4gICAqL1xuICBwdWJsaWMgZGVsZXRlKCkge1xuICAgIGZzLnJtU3luYyh0aGlzLm91dGRpciwgeyByZWN1cnNpdmU6IHRydWUsIGZvcmNlOiB0cnVlIH0pO1xuICB9XG59XG5cbi8qKlxuICogQmFja3dhcmRzIGNvbXBhdGliaWxpdHkgZm9yIHdoZW4gYFJ1bnRpbWVJbmZvYFxuICogd2FzIGRlZmluZWQgaGVyZS4gVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSBpdHMgdXNlZCBhcyBhbiBpbnB1dCBpbiB0aGUgc3RhYmxlXG4gKiBAYXdzLWNkay9jb3JlIGxpYnJhcnkuXG4gKlxuICogQGRlcHJlY2F0ZWQgbW92ZWQgdG8gcGFja2FnZSAnY2xvdWQtYXNzZW1ibHktc2NoZW1hJ1xuICogQHNlZSBjb3JlLkNvbnN0cnVjdE5vZGUuc3ludGhcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSdW50aW1lSW5mbyBleHRlbmRzIGN4c2NoZW1hLlJ1bnRpbWVJbmZvIHtcblxufVxuXG4vKipcbiAqIEJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IGZvciB3aGVuIGBNZXRhZGF0YUVudHJ5YFxuICogd2FzIGRlZmluZWQgaGVyZS4gVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSBpdHMgdXNlZCBhcyBhbiBpbnB1dCBpbiB0aGUgc3RhYmxlXG4gKiBAYXdzLWNkay9jb3JlIGxpYnJhcnkuXG4gKlxuICogQGRlcHJlY2F0ZWQgbW92ZWQgdG8gcGFja2FnZSAnY2xvdWQtYXNzZW1ibHktc2NoZW1hJ1xuICogQHNlZSBjb3JlLkNvbnN0cnVjdE5vZGUubWV0YWRhdGFcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNZXRhZGF0YUVudHJ5IGV4dGVuZHMgY3hzY2hlbWEuTWV0YWRhdGFFbnRyeSB7XG5cbn1cblxuLyoqXG4gKiBCYWNrd2FyZHMgY29tcGF0aWJpbGl0eSBmb3Igd2hlbiBgTWlzc2luZ0NvbnRleHRgXG4gKiB3YXMgZGVmaW5lZCBoZXJlLiBUaGlzIGlzIG5lY2Vzc2FyeSBiZWNhdXNlIGl0cyB1c2VkIGFzIGFuIGlucHV0IGluIHRoZSBzdGFibGVcbiAqIEBhd3MtY2RrL2NvcmUgbGlicmFyeS5cbiAqXG4gKiBAZGVwcmVjYXRlZCBtb3ZlZCB0byBwYWNrYWdlICdjbG91ZC1hc3NlbWJseS1zY2hlbWEnXG4gKiBAc2VlIGNvcmUuU3RhY2sucmVwb3J0TWlzc2luZ0NvbnRleHRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNaXNzaW5nQ29udGV4dCB7XG4gIC8qKlxuICAgKiBUaGUgbWlzc2luZyBjb250ZXh0IGtleS5cbiAgICovXG4gIHJlYWRvbmx5IGtleTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcHJvdmlkZXIgZnJvbSB3aGljaCB3ZSBleHBlY3QgdGhpcyBjb250ZXh0IGtleSB0byBiZSBvYnRhaW5lZC5cbiAgICpcbiAgICogKFRoaXMgaXMgdGhlIG9sZCB1bnR5cGVkIGRlZmluaXRpb24sIHdoaWNoIGlzIG5lY2Vzc2FyeSBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuXG4gICAqIFNlZSBjeHNjaGVtYSBmb3IgYSB0eXBlIGRlZmluaXRpb24uKVxuICAgKi9cbiAgcmVhZG9ubHkgcHJvdmlkZXI6IHN0cmluZztcblxuICAvKipcbiAgICogQSBzZXQgb2YgcHJvdmlkZXItc3BlY2lmaWMgb3B0aW9ucy5cbiAgICpcbiAgICogKFRoaXMgaXMgdGhlIG9sZCB1bnR5cGVkIGRlZmluaXRpb24sIHdoaWNoIGlzIG5lY2Vzc2FyeSBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuXG4gICAqIFNlZSBjeHNjaGVtYSBmb3IgYSB0eXBlIGRlZmluaXRpb24uKVxuICAgKi9cbiAgcmVhZG9ubHkgcHJvcHM6IFJlY29yZDxzdHJpbmcsIGFueT47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXNzZW1ibHlCdWlsZE9wdGlvbnMge1xuICAvKipcbiAgICogSW5jbHVkZSB0aGUgc3BlY2lmaWVkIHJ1bnRpbWUgaW5mb3JtYXRpb24gKG1vZHVsZSB2ZXJzaW9ucykgaW4gbWFuaWZlc3QuXG4gICAqIEBkZWZhdWx0IC0gaWYgdGhpcyBvcHRpb24gaXMgbm90IHNwZWNpZmllZCwgcnVudGltZSBpbmZvIHdpbGwgbm90IGJlIGluY2x1ZGVkXG4gICAqIEBkZXByZWNhdGVkIEFsbCB0ZW1wbGF0ZSBtb2RpZmljYXRpb25zIHRoYXQgc2hvdWxkIHJlc3VsdCBmcm9tIHRoaXMgc2hvdWxkXG4gICAqIGhhdmUgYWxyZWFkeSBiZWVuIGluc2VydGVkIGludG8gdGhlIHRlbXBsYXRlLlxuICAgKi9cbiAgcmVhZG9ubHkgcnVudGltZUluZm8/OiBSdW50aW1lSW5mbztcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgY29weSBvZiBgb2JqYCB3aXRob3V0IHVuZGVmaW5lZCB2YWx1ZXMgaW4gbWFwcyBvciBhcnJheXMuXG4gKi9cbmZ1bmN0aW9uIGZpbHRlclVuZGVmaW5lZChvYmo6IGFueSk6IGFueSB7XG4gIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICByZXR1cm4gb2JqLmZpbHRlcih4ID0+IHggIT09IHVuZGVmaW5lZCkubWFwKHggPT4gZmlsdGVyVW5kZWZpbmVkKHgpKTtcbiAgfVxuXG4gIGlmICh0eXBlb2Yob2JqKSA9PT0gJ29iamVjdCcpIHtcbiAgICBjb25zdCByZXQ6IGFueSA9IHsgfTtcbiAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhvYmopKSB7XG4gICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJldFtrZXldID0gZmlsdGVyVW5kZWZpbmVkKHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XG5cbmZ1bmN0aW9uIGlnbm9yZShfeDogYW55KSB7XG4gIHJldHVybjtcbn1cblxuLyoqXG4gKiBUdXJuIHRoZSBnaXZlbiBvcHRpb25hbCBvdXRwdXQgZGlyZWN0b3J5IGludG8gYSBmaXhlZCBvdXRwdXQgZGlyZWN0b3J5XG4gKi9cbmZ1bmN0aW9uIGRldGVybWluZU91dHB1dERpcmVjdG9yeShvdXRkaXI/OiBzdHJpbmcpIHtcbiAgcmV0dXJuIG91dGRpciA/PyBmcy5ta2R0ZW1wU3luYyhwYXRoLmpvaW4oZnMucmVhbHBhdGhTeW5jKG9zLnRtcGRpcigpKSwgJ2Nkay5vdXQnKSk7XG59XG5cbmZ1bmN0aW9uIGVuc3VyZURpclN5bmMoZGlyOiBzdHJpbmcpIHtcbiAgaWYgKGZzLmV4aXN0c1N5bmMoZGlyKSkge1xuICAgIGlmICghZnMuc3RhdFN5bmMoZGlyKS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7ZGlyfSBtdXN0IGJlIGEgZGlyZWN0b3J5YCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZzLm1rZGlyU3luYyhkaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICB9XG59Il19