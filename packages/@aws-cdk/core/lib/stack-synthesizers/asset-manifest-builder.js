"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetManifestBuilder = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const path = require("path");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const _shared_1 = require("./_shared");
const assets_1 = require("../assets");
/**
 * Build an asset manifest from assets added to a stack
 *
 * This class does not need to be used by app builders; it is only nessary for building Stack Synthesizers.
 */
class AssetManifestBuilder {
    constructor() {
        this.files = {};
        this.dockerImages = {};
    }
    /**
     * Add a file asset to the manifest with default settings
     *
     * Derive the region from the stack, use the asset hash as the key, copy the
     * file extension over, and set the prefix.
     */
    defaultAddFileAsset(stack, asset, target) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_Stack(stack);
            jsiiDeprecationWarnings._aws_cdk_core_FileAssetSource(asset);
            jsiiDeprecationWarnings._aws_cdk_core_AssetManifestFileDestination(target);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.defaultAddFileAsset);
            }
            throw error;
        }
        validateFileAssetSource(asset);
        const extension = asset.fileName != undefined ? path.extname(asset.fileName) : '';
        const objectKey = (target.bucketPrefix ?? '') +
            asset.sourceHash +
            (asset.packaging === assets_1.FileAssetPackaging.ZIP_DIRECTORY
                ? '.zip'
                : extension);
        // Add to manifest
        return this.addFileAsset(stack, asset.sourceHash, {
            path: asset.fileName,
            executable: asset.executable,
            packaging: asset.packaging,
        }, {
            bucketName: target.bucketName,
            objectKey,
            region: _shared_1.resolvedOr(stack.region, undefined),
            assumeRoleArn: target.role?.assumeRoleArn,
            assumeRoleExternalId: target.role?.assumeRoleExternalId,
        });
    }
    /**
     * Add a docker image asset to the manifest with default settings
     *
     * Derive the region from the stack, use the asset hash as the key, and set the prefix.
     */
    defaultAddDockerImageAsset(stack, asset, target) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_Stack(stack);
            jsiiDeprecationWarnings._aws_cdk_core_DockerImageAssetSource(asset);
            jsiiDeprecationWarnings._aws_cdk_core_AssetManifestDockerImageDestination(target);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.defaultAddDockerImageAsset);
            }
            throw error;
        }
        validateDockerImageAssetSource(asset);
        const imageTag = `${target.dockerTagPrefix ?? ''}${asset.sourceHash}`;
        // Add to manifest
        return this.addDockerImageAsset(stack, asset.sourceHash, {
            executable: asset.executable,
            directory: asset.directoryName,
            dockerBuildArgs: asset.dockerBuildArgs,
            dockerBuildSecrets: asset.dockerBuildSecrets,
            dockerBuildTarget: asset.dockerBuildTarget,
            dockerFile: asset.dockerFile,
            networkMode: asset.networkMode,
            platform: asset.platform,
            dockerOutputs: asset.dockerOutputs,
            cacheFrom: asset.dockerCacheFrom,
            cacheTo: asset.dockerCacheTo,
        }, {
            repositoryName: target.repositoryName,
            imageTag,
            region: _shared_1.resolvedOr(stack.region, undefined),
            assumeRoleArn: target.role?.assumeRoleArn,
            assumeRoleExternalId: target.role?.assumeRoleExternalId,
        });
    }
    /**
     * Add a file asset source and destination to the manifest
     *
     * sourceHash should be unique for every source.
     */
    addFileAsset(stack, sourceHash, source, dest) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_Stack(stack);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addFileAsset);
            }
            throw error;
        }
        if (!this.files[sourceHash]) {
            this.files[sourceHash] = {
                source,
                destinations: {},
            };
        }
        this.files[sourceHash].destinations[this.manifestEnvName(stack)] = dest;
        return dest;
    }
    /**
     * Add a docker asset source and destination to the manifest
     *
     * sourceHash should be unique for every source.
     */
    addDockerImageAsset(stack, sourceHash, source, dest) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_Stack(stack);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addDockerImageAsset);
            }
            throw error;
        }
        if (!this.dockerImages[sourceHash]) {
            this.dockerImages[sourceHash] = {
                source,
                destinations: {},
            };
        }
        this.dockerImages[sourceHash].destinations[this.manifestEnvName(stack)] = dest;
        return dest;
    }
    /**
     * Whether there are any assets registered in the manifest
     */
    get hasAssets() {
        return Object.keys(this.files).length + Object.keys(this.dockerImages).length > 0;
    }
    /**
     * Write the manifest to disk, and add it to the synthesis session
     *
     * Return the artifact id, which should be added to the `additionalDependencies`
     * field of the stack artifact.
     */
    emitManifest(stack, session, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_Stack(stack);
            jsiiDeprecationWarnings._aws_cdk_core_ISynthesisSession(session);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.emitManifest);
            }
            throw error;
        }
        const artifactId = `${stack.artifactId}.assets`;
        const manifestFile = `${artifactId}.json`;
        const outPath = path.join(session.assembly.outdir, manifestFile);
        const manifest = {
            version: cxschema.Manifest.version(),
            files: this.files,
            dockerImages: this.dockerImages,
        };
        fs.writeFileSync(outPath, JSON.stringify(manifest, undefined, 2));
        session.assembly.addArtifact(artifactId, {
            type: cxschema.ArtifactType.ASSET_MANIFEST,
            properties: {
                file: manifestFile,
                ...options,
            },
        });
        return artifactId;
    }
    manifestEnvName(stack) {
        return [
            _shared_1.resolvedOr(stack.account, 'current_account'),
            _shared_1.resolvedOr(stack.region, 'current_region'),
        ].join('-');
    }
}
exports.AssetManifestBuilder = AssetManifestBuilder;
_a = JSII_RTTI_SYMBOL_1;
AssetManifestBuilder[_a] = { fqn: "@aws-cdk/core.AssetManifestBuilder", version: "0.0.0" };
function validateFileAssetSource(asset) {
    if (!!asset.executable === !!asset.fileName) {
        throw new Error(`Exactly one of 'fileName' or 'executable' is required, got: ${JSON.stringify(asset)}`);
    }
    if (!!asset.packaging !== !!asset.fileName) {
        throw new Error(`'packaging' is expected in combination with 'fileName', got: ${JSON.stringify(asset)}`);
    }
}
function validateDockerImageAssetSource(asset) {
    if (!!asset.executable === !!asset.directoryName) {
        throw new Error(`Exactly one of 'directoryName' or 'executable' is required, got: ${JSON.stringify(asset)}`);
    }
    check('dockerBuildArgs');
    check('dockerBuildTarget');
    check('dockerOutputs');
    check('dockerFile');
    function check(key) {
        if (asset[key] && !asset.directoryName) {
            throw new Error(`'${key}' is only allowed in combination with 'directoryName', got: ${JSON.stringify(asset)}`);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXQtbWFuaWZlc3QtYnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFzc2V0LW1hbmlmZXN0LWJ1aWxkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QiwyREFBMkQ7QUFDM0QsdUNBQXVDO0FBRXZDLHNDQUF3RjtBQUd4Rjs7OztHQUlHO0FBQ0gsTUFBYSxvQkFBb0I7SUFBakM7UUFDbUIsVUFBSyxHQUFpRCxFQUFFLENBQUM7UUFDekQsaUJBQVksR0FBd0QsRUFBRSxDQUFDO0tBb0p6RjtJQWxKQzs7Ozs7T0FLRztJQUNJLG1CQUFtQixDQUFDLEtBQVksRUFBRSxLQUFzQixFQUFFLE1BQW9DOzs7Ozs7Ozs7Ozs7UUFDbkcsdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFL0IsTUFBTSxTQUFTLEdBQ2IsS0FBSyxDQUFDLFFBQVEsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDbEUsTUFBTSxTQUFTLEdBQ2IsQ0FBQyxNQUFNLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQztZQUMzQixLQUFLLENBQUMsVUFBVTtZQUNoQixDQUFDLEtBQUssQ0FBQyxTQUFTLEtBQUssMkJBQWtCLENBQUMsYUFBYTtnQkFDbkQsQ0FBQyxDQUFDLE1BQU07Z0JBQ1IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRWpCLGtCQUFrQjtRQUNsQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDaEQsSUFBSSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3BCLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtZQUM1QixTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVM7U0FDM0IsRUFBRTtZQUNELFVBQVUsRUFBRSxNQUFN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b3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGN4c2NoZW1hIGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgeyByZXNvbHZlZE9yIH0gZnJvbSAnLi9fc2hhcmVkJztcbmltcG9ydCB7IElTeW50aGVzaXNTZXNzaW9uIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBGaWxlQXNzZXRTb3VyY2UsIEZpbGVBc3NldFBhY2thZ2luZywgRG9ja2VySW1hZ2VBc3NldFNvdXJjZSB9IGZyb20gJy4uL2Fzc2V0cyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4uL3N0YWNrJztcblxuLyoqXG4gKiBCdWlsZCBhbiBhc3NldCBtYW5pZmVzdCBmcm9tIGFzc2V0cyBhZGRlZCB0byBhIHN0YWNrXG4gKlxuICogVGhpcyBjbGFzcyBkb2VzIG5vdCBuZWVkIHRvIGJlIHVzZWQgYnkgYXBwIGJ1aWxkZXJzOyBpdCBpcyBvbmx5IG5lc3NhcnkgZm9yIGJ1aWxkaW5nIFN0YWNrIFN5bnRoZXNpemVycy5cbiAqL1xuZXhwb3J0IGNsYXNzIEFzc2V0TWFuaWZlc3RCdWlsZGVyIHtcbiAgcHJpdmF0ZSByZWFkb25seSBmaWxlczogTm9uTnVsbGFibGU8Y3hzY2hlbWEuQXNzZXRNYW5pZmVzdFsnZmlsZXMnXT4gPSB7fTtcbiAgcHJpdmF0ZSByZWFkb25seSBkb2NrZXJJbWFnZXM6IE5vbk51bGxhYmxlPGN4c2NoZW1hLkFzc2V0TWFuaWZlc3RbJ2RvY2tlckltYWdlcyddPiA9IHt9O1xuXG4gIC8qKlxuICAgKiBBZGQgYSBmaWxlIGFzc2V0IHRvIHRoZSBtYW5pZmVzdCB3aXRoIGRlZmF1bHQgc2V0dGluZ3NcbiAgICpcbiAgICogRGVyaXZlIHRoZSByZWdpb24gZnJvbSB0aGUgc3RhY2ssIHVzZSB0aGUgYXNzZXQgaGFzaCBhcyB0aGUga2V5LCBjb3B5IHRoZVxuICAgKiBmaWxlIGV4dGVuc2lvbiBvdmVyLCBhbmQgc2V0IHRoZSBwcmVmaXguXG4gICAqL1xuICBwdWJsaWMgZGVmYXVsdEFkZEZpbGVBc3NldChzdGFjazogU3RhY2ssIGFzc2V0OiBGaWxlQXNzZXRTb3VyY2UsIHRhcmdldDogQXNzZXRNYW5pZmVzdEZpbGVEZXN0aW5hdGlvbikge1xuICAgIHZhbGlkYXRlRmlsZUFzc2V0U291cmNlKGFzc2V0KTtcblxuICAgIGNvbnN0IGV4dGVuc2lvbiA9XG4gICAgICBhc3NldC5maWxlTmFtZSAhPSB1bmRlZmluZWQgPyBwYXRoLmV4dG5hbWUoYXNzZXQuZmlsZU5hbWUpIDogJyc7XG4gICAgY29uc3Qgb2JqZWN0S2V5ID1cbiAgICAgICh0YXJnZXQuYnVja2V0UHJlZml4ID8/ICcnKSArXG4gICAgICBhc3NldC5zb3VyY2VIYXNoICtcbiAgICAgIChhc3NldC5wYWNrYWdpbmcgPT09IEZpbGVBc3NldFBhY2thZ2luZy5aSVBfRElSRUNUT1JZXG4gICAgICAgID8gJy56aXAnXG4gICAgICAgIDogZXh0ZW5zaW9uKTtcblxuICAgIC8vIEFkZCB0byBtYW5pZmVzdFxuICAgIHJldHVybiB0aGlzLmFkZEZpbGVBc3NldChzdGFjaywgYXNzZXQuc291cmNlSGFzaCwge1xuICAgICAgcGF0aDogYXNzZXQuZmlsZU5hbWUsXG4gICAgICBleGVjdXRhYmxlOiBhc3NldC5leGVjdXRhYmxlLFxuICAgICAgcGFja2FnaW5nOiBhc3NldC5wYWNrYWdpbmcsXG4gICAgfSwge1xuICAgICAgYnVja2V0TmFtZTogdGFyZ2V0LmJ1Y2tldE5hbWUsXG4gICAgICBvYmplY3RLZXksXG4gICAgICByZWdpb246IHJlc29sdmVkT3Ioc3RhY2sucmVnaW9uLCB1bmRlZmluZWQpLFxuICAgICAgYXNzdW1lUm9sZUFybjogdGFyZ2V0LnJvbGU/LmFzc3VtZVJvbGVBcm4sXG4gICAgICBhc3N1bWVSb2xlRXh0ZXJuYWxJZDogdGFyZ2V0LnJvbGU/LmFzc3VtZVJvbGVFeHRlcm5hbElkLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGRvY2tlciBpbWFnZSBhc3NldCB0byB0aGUgbWFuaWZlc3Qgd2l0aCBkZWZhdWx0IHNldHRpbmdzXG4gICAqXG4gICAqIERlcml2ZSB0aGUgcmVnaW9uIGZyb20gdGhlIHN0YWNrLCB1c2UgdGhlIGFzc2V0IGhhc2ggYXMgdGhlIGtleSwgYW5kIHNldCB0aGUgcHJlZml4LlxuICAgKi9cbiAgcHVibGljIGRlZmF1bHRBZGREb2NrZXJJbWFnZUFzc2V0KFxuICAgIHN0YWNrOiBTdGFjayxcbiAgICBhc3NldDogRG9ja2VySW1hZ2VBc3NldFNvdXJjZSxcbiAgICB0YXJnZXQ6IEFzc2V0TWFuaWZlc3REb2NrZXJJbWFnZURlc3RpbmF0aW9uLFxuICApIHtcbiAgICB2YWxpZGF0ZURvY2tlckltYWdlQXNzZXRTb3VyY2UoYXNzZXQpO1xuICAgIGNvbnN0IGltYWdlVGFnID0gYCR7dGFyZ2V0LmRvY2tlclRhZ1ByZWZpeCA/PyAnJ30ke2Fzc2V0LnNvdXJjZUhhc2h9YDtcblxuICAgIC8vIEFkZCB0byBtYW5pZmVzdFxuICAgIHJldHVybiB0aGlzLmFkZERvY2tlckltYWdlQXNzZXQoc3RhY2ssIGFzc2V0LnNvdXJjZUhhc2gsIHtcbiAgICAgIGV4ZWN1dGFibGU6IGFzc2V0LmV4ZWN1dGFibGUsXG4gICAgICBkaXJlY3Rvcnk6IGFzc2V0LmRpcmVjdG9yeU5hbWUsXG4gICAgICBkb2NrZXJCdWlsZEFyZ3M6IGFzc2V0LmRvY2tlckJ1aWxkQXJncyxcbiAgICAgIGRvY2tlckJ1aWxkU2VjcmV0czogYXNzZXQuZG9ja2VyQnVpbGRTZWNyZXRzLFxuICAgICAgZG9ja2VyQnVpbGRUYXJnZXQ6IGFzc2V0LmRvY2tlckJ1aWxkVGFyZ2V0LFxuICAgICAgZG9ja2VyRmlsZTogYXNzZXQuZG9ja2VyRmlsZSxcbiAgICAgIG5ldHdvcmtNb2RlOiBhc3NldC5uZXR3b3JrTW9kZSxcbiAgICAgIHBsYXRmb3JtOiBhc3NldC5wbGF0Zm9ybSxcbiAgICAgIGRvY2tlck91dHB1dHM6IGFzc2V0LmRvY2tlck91dHB1dHMsXG4gICAgICBjYWNoZUZyb206IGFzc2V0LmRvY2tlckNhY2hlRnJvbSxcbiAgICAgIGNhY2hlVG86IGFzc2V0LmRvY2tlckNhY2hlVG8sXG4gICAgfSwge1xuICAgICAgcmVwb3NpdG9yeU5hbWU6IHRhcmdldC5yZXBvc2l0b3J5TmFtZSxcbiAgICAgIGltYWdlVGFnLFxuICAgICAgcmVnaW9uOiByZXNvbHZlZE9yKHN0YWNrLnJlZ2lvbiwgdW5kZWZpbmVkKSxcbiAgICAgIGFzc3VtZVJvbGVBcm46IHRhcmdldC5yb2xlPy5hc3N1bWVSb2xlQXJuLFxuICAgICAgYXNzdW1lUm9sZUV4dGVybmFsSWQ6IHRhcmdldC5yb2xlPy5hc3N1bWVSb2xlRXh0ZXJuYWxJZCxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBmaWxlIGFzc2V0IHNvdXJjZSBhbmQgZGVzdGluYXRpb24gdG8gdGhlIG1hbmlmZXN0XG4gICAqXG4gICAqIHNvdXJjZUhhc2ggc2hvdWxkIGJlIHVuaXF1ZSBmb3IgZXZlcnkgc291cmNlLlxuICAgKi9cbiAgcHVibGljIGFkZEZpbGVBc3NldChzdGFjazogU3RhY2ssIHNvdXJjZUhhc2g6IHN0cmluZywgc291cmNlOiBjeHNjaGVtYS5GaWxlU291cmNlLCBkZXN0OiBjeHNjaGVtYS5GaWxlRGVzdGluYXRpb24pIHtcbiAgICBpZiAoIXRoaXMuZmlsZXNbc291cmNlSGFzaF0pIHtcbiAgICAgIHRoaXMuZmlsZXNbc291cmNlSGFzaF0gPSB7XG4gICAgICAgIHNvdXJjZSxcbiAgICAgICAgZGVzdGluYXRpb25zOiB7fSxcbiAgICAgIH07XG4gICAgfVxuICAgIHRoaXMuZmlsZXNbc291cmNlSGFzaF0uZGVzdGluYXRpb25zW3RoaXMubWFuaWZlc3RFbnZOYW1lKHN0YWNrKV0gPSBkZXN0O1xuICAgIHJldHVybiBkZXN0O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGRvY2tlciBhc3NldCBzb3VyY2UgYW5kIGRlc3RpbmF0aW9uIHRvIHRoZSBtYW5pZmVzdFxuICAgKlxuICAgKiBzb3VyY2VIYXNoIHNob3VsZCBiZSB1bmlxdWUgZm9yIGV2ZXJ5IHNvdXJjZS5cbiAgICovXG4gIHB1YmxpYyBhZGREb2NrZXJJbWFnZUFzc2V0KHN0YWNrOiBTdGFjaywgc291cmNlSGFzaDogc3RyaW5nLCBzb3VyY2U6IGN4c2NoZW1hLkRvY2tlckltYWdlU291cmNlLCBkZXN0OiBjeHNjaGVtYS5Eb2NrZXJJbWFnZURlc3RpbmF0aW9uKSB7XG4gICAgaWYgKCF0aGlzLmRvY2tlckltYWdlc1tzb3VyY2VIYXNoXSkge1xuICAgICAgdGhpcy5kb2NrZXJJbWFnZXNbc291cmNlSGFzaF0gPSB7XG4gICAgICAgIHNvdXJjZSxcbiAgICAgICAgZGVzdGluYXRpb25zOiB7fSxcbiAgICAgIH07XG4gICAgfVxuICAgIHRoaXMuZG9ja2VySW1hZ2VzW3NvdXJjZUhhc2hdLmRlc3RpbmF0aW9uc1t0aGlzLm1hbmlmZXN0RW52TmFtZShzdGFjayldID0gZGVzdDtcbiAgICByZXR1cm4gZGVzdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZXJlIGFyZSBhbnkgYXNzZXRzIHJlZ2lzdGVyZWQgaW4gdGhlIG1hbmlmZXN0XG4gICAqL1xuICBwdWJsaWMgZ2V0IGhhc0Fzc2V0cygpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5maWxlcykubGVuZ3RoICsgT2JqZWN0LmtleXModGhpcy5kb2NrZXJJbWFnZXMpLmxlbmd0aCA+IDA7XG4gIH1cblxuICAvKipcbiAgICogV3JpdGUgdGhlIG1hbmlmZXN0IHRvIGRpc2ssIGFuZCBhZGQgaXQgdG8gdGhlIHN5bnRoZXNpcyBzZXNzaW9uXG4gICAqXG4gICAqIFJldHVybiB0aGUgYXJ0aWZhY3QgaWQsIHdoaWNoIHNob3VsZCBiZSBhZGRlZCB0byB0aGUgYGFkZGl0aW9uYWxEZXBlbmRlbmNpZXNgXG4gICAqIGZpZWxkIG9mIHRoZSBzdGFjayBhcnRpZmFjdC5cbiAgICovXG4gIHB1YmxpYyBlbWl0TWFuaWZlc3QoXG4gICAgc3RhY2s6IFN0YWNrLFxuICAgIHNlc3Npb246IElTeW50aGVzaXNTZXNzaW9uLFxuICAgIG9wdGlvbnM6IGN4c2NoZW1hLkFzc2V0TWFuaWZlc3RPcHRpb25zID0ge30sXG4gICk6IHN0cmluZyB7XG4gICAgY29uc3QgYXJ0aWZhY3RJZCA9IGAke3N0YWNrLmFydGlmYWN0SWR9LmFzc2V0c2A7XG4gICAgY29uc3QgbWFuaWZlc3RGaWxlID0gYCR7YXJ0aWZhY3RJZH0uanNvbmA7XG4gICAgY29uc3Qgb3V0UGF0aCA9IHBhdGguam9pbihzZXNzaW9uLmFzc2VtYmx5Lm91dGRpciwgbWFuaWZlc3RGaWxlKTtcblxuICAgIGNvbnN0IG1hbmlmZXN0OiBjeHNjaGVtYS5Bc3NldE1hbmlmZXN0ID0ge1xuICAgICAgdmVyc2lvbjogY3hzY2hlbWEuTWFuaWZlc3QudmVyc2lvbigpLFxuICAgICAgZmlsZXM6IHRoaXMuZmlsZXMsXG4gICAgICBkb2NrZXJJbWFnZXM6IHRoaXMuZG9ja2VySW1hZ2VzLFxuICAgIH07XG5cbiAgICBmcy53cml0ZUZpbGVTeW5jKG91dFBhdGgsIEpTT04uc3RyaW5naWZ5KG1hbmlmZXN0LCB1bmRlZmluZWQsIDIpKTtcblxuICAgIHNlc3Npb24uYXNzZW1ibHkuYWRkQXJ0aWZhY3QoYXJ0aWZhY3RJZCwge1xuICAgICAgdHlwZTogY3hzY2hlbWEuQXJ0aWZhY3RUeXBlLkFTU0VUX01BTklGRVNULFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBmaWxlOiBtYW5pZmVzdEZpbGUsXG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGFydGlmYWN0SWQ7XG4gIH1cblxuICBwcml2YXRlIG1hbmlmZXN0RW52TmFtZShzdGFjazogU3RhY2spOiBzdHJpbmcge1xuICAgIHJldHVybiBbXG4gICAgICByZXNvbHZlZE9yKHN0YWNrLmFjY291bnQsICdjdXJyZW50X2FjY291bnQnKSxcbiAgICAgIHJlc29sdmVkT3Ioc3RhY2sucmVnaW9uLCAnY3VycmVudF9yZWdpb24nKSxcbiAgICBdLmpvaW4oJy0nKTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBkZXN0aW5hdGlvbiBmb3IgYSBmaWxlIGFzc2V0LCB3aGVuIGl0IGlzIGdpdmVuIHRvIHRoZSBBc3NldE1hbmlmZXN0QnVpbGRlclxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFzc2V0TWFuaWZlc3RGaWxlRGVzdGluYXRpb24ge1xuICAvKipcbiAgICogQnVja2V0IG5hbWUgd2hlcmUgdGhlIGZpbGUgYXNzZXQgc2hvdWxkIGJlIHdyaXR0ZW5cbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldE5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogUHJlZml4IHRvIHByZXBlbmQgdG8gdGhlIGFzc2V0IGhhc2hcbiAgICpcbiAgICogQGRlZmF1bHQgJydcbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldFByZWZpeD86IHN0cmluZztcblxuICAvKipcbiAgICogUm9sZSB0byB1c2UgZm9yIHVwbG9hZGluZ1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIGN1cnJlbnQgcm9sZVxuICAgKi9cbiAgcmVhZG9ubHkgcm9sZT86IFJvbGVPcHRpb25zO1xufVxuXG4vKipcbiAqIFRoZSBkZXN0aW5hdGlvbiBmb3IgYSBkb2NrZXIgaW1hZ2UgYXNzZXQsIHdoZW4gaXQgaXMgZ2l2ZW4gdG8gdGhlIEFzc2V0TWFuaWZlc3RCdWlsZGVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXNzZXRNYW5pZmVzdERvY2tlckltYWdlRGVzdGluYXRpb24ge1xuICAvKipcbiAgICogUmVwb3NpdG9yeSBuYW1lIHdoZXJlIHRoZSBkb2NrZXIgaW1hZ2UgYXNzZXQgc2hvdWxkIGJlIHdyaXR0ZW5cbiAgICovXG4gIHJlYWRvbmx5IHJlcG9zaXRvcnlOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFByZWZpeCB0byBhZGQgdG8gdGhlIGFzc2V0IGhhc2ggdG8gbWFrZSB0aGUgRG9ja2VyIGltYWdlIHRhZ1xuICAgKlxuICAgKiBAZGVmYXVsdCAnJ1xuICAgKi9cbiAgcmVhZG9ubHkgZG9ja2VyVGFnUHJlZml4Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSb2xlIHRvIHVzZSB0byBwZXJmb3JtIHRoZSB1cGxvYWRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyByb2xlXG4gICAqL1xuICByZWFkb25seSByb2xlPzogUm9sZU9wdGlvbnM7XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3Igc3BlY2lmeWluZyBhIHJvbGVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSb2xlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBBUk4gb2YgdGhlIHJvbGUgdG8gYXNzdW1lXG4gICAqL1xuICByZWFkb25seSBhc3N1bWVSb2xlQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEV4dGVybmFsIElEIHRvIHVzZSB3aGVuIGFzc3VtaW5nIHRoZSByb2xlXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZXh0ZXJuYWwgSURcbiAgICovXG4gIHJlYWRvbmx5IGFzc3VtZVJvbGVFeHRlcm5hbElkPzogc3RyaW5nO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUZpbGVBc3NldFNvdXJjZShhc3NldDogRmlsZUFzc2V0U291cmNlKSB7XG4gIGlmICghIWFzc2V0LmV4ZWN1dGFibGUgPT09ICEhYXNzZXQuZmlsZU5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEV4YWN0bHkgb25lIG9mICdmaWxlTmFtZScgb3IgJ2V4ZWN1dGFibGUnIGlzIHJlcXVpcmVkLCBnb3Q6ICR7SlNPTi5zdHJpbmdpZnkoYXNzZXQpfWApO1xuICB9XG5cbiAgaWYgKCEhYXNzZXQucGFja2FnaW5nICE9PSAhIWFzc2V0LmZpbGVOYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGAncGFja2FnaW5nJyBpcyBleHBlY3RlZCBpbiBjb21iaW5hdGlvbiB3aXRoICdmaWxlTmFtZScsIGdvdDogJHtKU09OLnN0cmluZ2lmeShhc3NldCl9YCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVEb2NrZXJJbWFnZUFzc2V0U291cmNlKGFzc2V0OiBEb2NrZXJJbWFnZUFzc2V0U291cmNlKSB7XG4gIGlmICghIWFzc2V0LmV4ZWN1dGFibGUgPT09ICEhYXNzZXQuZGlyZWN0b3J5TmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgRXhhY3RseSBvbmUgb2YgJ2RpcmVjdG9yeU5hbWUnIG9yICdleGVjdXRhYmxlJyBpcyByZXF1aXJlZCwgZ290OiAke0pTT04uc3RyaW5naWZ5KGFzc2V0KX1gKTtcbiAgfVxuXG4gIGNoZWNrKCdkb2NrZXJCdWlsZEFyZ3MnKTtcbiAgY2hlY2soJ2RvY2tlckJ1aWxkVGFyZ2V0Jyk7XG4gIGNoZWNrKCdkb2NrZXJPdXRwdXRzJyk7XG4gIGNoZWNrKCdkb2NrZXJGaWxlJyk7XG5cbiAgZnVuY3Rpb24gY2hlY2s8SyBleHRlbmRzIGtleW9mIERvY2tlckltYWdlQXNzZXRTb3VyY2U+KGtleTogSykge1xuICAgIGlmIChhc3NldFtrZXldICYmICFhc3NldC5kaXJlY3RvcnlOYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCcke2tleX0nIGlzIG9ubHkgYWxsb3dlZCBpbiBjb21iaW5hdGlvbiB3aXRoICdkaXJlY3RvcnlOYW1lJywgZ290OiAke0pTT04uc3RyaW5naWZ5KGFzc2V0KX1gKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==