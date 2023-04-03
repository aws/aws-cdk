"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetManifestBuilder = void 0;
const fs = require("fs");
const path = require("path");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const _shared_1 = require("./_shared");
const assets_1 = require("../assets");
/**
 * Build an asset manifest from assets added to a stack
 *
 * This class does not need to be used by app builders; it is only necessary for building Stack Synthesizers.
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
            region: (0, _shared_1.resolvedOr)(stack.region, undefined),
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
            region: (0, _shared_1.resolvedOr)(stack.region, undefined),
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
            (0, _shared_1.resolvedOr)(stack.account, 'current_account'),
            (0, _shared_1.resolvedOr)(stack.region, 'current_region'),
        ].join('-');
    }
}
exports.AssetManifestBuilder = AssetManifestBuilder;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXQtbWFuaWZlc3QtYnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFzc2V0LW1hbmlmZXN0LWJ1aWxkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QiwyREFBMkQ7QUFDM0QsdUNBQXVDO0FBRXZDLHNDQUF3RjtBQUd4Rjs7OztHQUlHO0FBQ0gsTUFBYSxvQkFBb0I7SUFBakM7UUFDbUIsVUFBSyxHQUFpRCxFQUFFLENBQUM7UUFDekQsaUJBQVksR0FBd0QsRUFBRSxDQUFDO0lBb0oxRixDQUFDO0lBbEpDOzs7OztPQUtHO0lBQ0ksbUJBQW1CLENBQUMsS0FBWSxFQUFFLEtBQXNCLEVBQUUsTUFBb0M7UUFDbkcsdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFL0IsTUFBTSxTQUFTLEdBQ2IsS0FBSyxDQUFDLFFBQVEsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDbEUsTUFBTSxTQUFTLEdBQ2IsQ0FBQyxNQUFNLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQztZQUMzQixLQUFLLENBQUMsVUFBVTtZQUNoQixDQUFDLEtBQUssQ0FBQyxTQUFTLEtBQUssMkJBQWtCLENBQUMsYUFBYTtnQkFDbkQsQ0FBQyxDQUFDLE1BQU07Z0JBQ1IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRWpCLGtCQUFrQjtRQUNsQixPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDaEQsSUFBSSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3BCLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtZQUM1QixTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVM7U0FDM0IsRUFBRTtZQUNELFVBQVUsRUFBRSxNQUFNLENBQUMsVUFB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bnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGN4c2NoZW1hIGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgeyByZXNvbHZlZE9yIH0gZnJvbSAnLi9fc2hhcmVkJztcbmltcG9ydCB7IElTeW50aGVzaXNTZXNzaW9uIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBGaWxlQXNzZXRTb3VyY2UsIEZpbGVBc3NldFBhY2thZ2luZywgRG9ja2VySW1hZ2VBc3NldFNvdXJjZSB9IGZyb20gJy4uL2Fzc2V0cyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4uL3N0YWNrJztcblxuLyoqXG4gKiBCdWlsZCBhbiBhc3NldCBtYW5pZmVzdCBmcm9tIGFzc2V0cyBhZGRlZCB0byBhIHN0YWNrXG4gKlxuICogVGhpcyBjbGFzcyBkb2VzIG5vdCBuZWVkIHRvIGJlIHVzZWQgYnkgYXBwIGJ1aWxkZXJzOyBpdCBpcyBvbmx5IG5lY2Vzc2FyeSBmb3IgYnVpbGRpbmcgU3RhY2sgU3ludGhlc2l6ZXJzLlxuICovXG5leHBvcnQgY2xhc3MgQXNzZXRNYW5pZmVzdEJ1aWxkZXIge1xuICBwcml2YXRlIHJlYWRvbmx5IGZpbGVzOiBOb25OdWxsYWJsZTxjeHNjaGVtYS5Bc3NldE1hbmlmZXN0WydmaWxlcyddPiA9IHt9O1xuICBwcml2YXRlIHJlYWRvbmx5IGRvY2tlckltYWdlczogTm9uTnVsbGFibGU8Y3hzY2hlbWEuQXNzZXRNYW5pZmVzdFsnZG9ja2VySW1hZ2VzJ10+ID0ge307XG5cbiAgLyoqXG4gICAqIEFkZCBhIGZpbGUgYXNzZXQgdG8gdGhlIG1hbmlmZXN0IHdpdGggZGVmYXVsdCBzZXR0aW5nc1xuICAgKlxuICAgKiBEZXJpdmUgdGhlIHJlZ2lvbiBmcm9tIHRoZSBzdGFjaywgdXNlIHRoZSBhc3NldCBoYXNoIGFzIHRoZSBrZXksIGNvcHkgdGhlXG4gICAqIGZpbGUgZXh0ZW5zaW9uIG92ZXIsIGFuZCBzZXQgdGhlIHByZWZpeC5cbiAgICovXG4gIHB1YmxpYyBkZWZhdWx0QWRkRmlsZUFzc2V0KHN0YWNrOiBTdGFjaywgYXNzZXQ6IEZpbGVBc3NldFNvdXJjZSwgdGFyZ2V0OiBBc3NldE1hbmlmZXN0RmlsZURlc3RpbmF0aW9uKSB7XG4gICAgdmFsaWRhdGVGaWxlQXNzZXRTb3VyY2UoYXNzZXQpO1xuXG4gICAgY29uc3QgZXh0ZW5zaW9uID1cbiAgICAgIGFzc2V0LmZpbGVOYW1lICE9IHVuZGVmaW5lZCA/IHBhdGguZXh0bmFtZShhc3NldC5maWxlTmFtZSkgOiAnJztcbiAgICBjb25zdCBvYmplY3RLZXkgPVxuICAgICAgKHRhcmdldC5idWNrZXRQcmVmaXggPz8gJycpICtcbiAgICAgIGFzc2V0LnNvdXJjZUhhc2ggK1xuICAgICAgKGFzc2V0LnBhY2thZ2luZyA9PT0gRmlsZUFzc2V0UGFja2FnaW5nLlpJUF9ESVJFQ1RPUllcbiAgICAgICAgPyAnLnppcCdcbiAgICAgICAgOiBleHRlbnNpb24pO1xuXG4gICAgLy8gQWRkIHRvIG1hbmlmZXN0XG4gICAgcmV0dXJuIHRoaXMuYWRkRmlsZUFzc2V0KHN0YWNrLCBhc3NldC5zb3VyY2VIYXNoLCB7XG4gICAgICBwYXRoOiBhc3NldC5maWxlTmFtZSxcbiAgICAgIGV4ZWN1dGFibGU6IGFzc2V0LmV4ZWN1dGFibGUsXG4gICAgICBwYWNrYWdpbmc6IGFzc2V0LnBhY2thZ2luZyxcbiAgICB9LCB7XG4gICAgICBidWNrZXROYW1lOiB0YXJnZXQuYnVja2V0TmFtZSxcbiAgICAgIG9iamVjdEtleSxcbiAgICAgIHJlZ2lvbjogcmVzb2x2ZWRPcihzdGFjay5yZWdpb24sIHVuZGVmaW5lZCksXG4gICAgICBhc3N1bWVSb2xlQXJuOiB0YXJnZXQucm9sZT8uYXNzdW1lUm9sZUFybixcbiAgICAgIGFzc3VtZVJvbGVFeHRlcm5hbElkOiB0YXJnZXQucm9sZT8uYXNzdW1lUm9sZUV4dGVybmFsSWQsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgZG9ja2VyIGltYWdlIGFzc2V0IHRvIHRoZSBtYW5pZmVzdCB3aXRoIGRlZmF1bHQgc2V0dGluZ3NcbiAgICpcbiAgICogRGVyaXZlIHRoZSByZWdpb24gZnJvbSB0aGUgc3RhY2ssIHVzZSB0aGUgYXNzZXQgaGFzaCBhcyB0aGUga2V5LCBhbmQgc2V0IHRoZSBwcmVmaXguXG4gICAqL1xuICBwdWJsaWMgZGVmYXVsdEFkZERvY2tlckltYWdlQXNzZXQoXG4gICAgc3RhY2s6IFN0YWNrLFxuICAgIGFzc2V0OiBEb2NrZXJJbWFnZUFzc2V0U291cmNlLFxuICAgIHRhcmdldDogQXNzZXRNYW5pZmVzdERvY2tlckltYWdlRGVzdGluYXRpb24sXG4gICkge1xuICAgIHZhbGlkYXRlRG9ja2VySW1hZ2VBc3NldFNvdXJjZShhc3NldCk7XG4gICAgY29uc3QgaW1hZ2VUYWcgPSBgJHt0YXJnZXQuZG9ja2VyVGFnUHJlZml4ID8/ICcnfSR7YXNzZXQuc291cmNlSGFzaH1gO1xuXG4gICAgLy8gQWRkIHRvIG1hbmlmZXN0XG4gICAgcmV0dXJuIHRoaXMuYWRkRG9ja2VySW1hZ2VBc3NldChzdGFjaywgYXNzZXQuc291cmNlSGFzaCwge1xuICAgICAgZXhlY3V0YWJsZTogYXNzZXQuZXhlY3V0YWJsZSxcbiAgICAgIGRpcmVjdG9yeTogYXNzZXQuZGlyZWN0b3J5TmFtZSxcbiAgICAgIGRvY2tlckJ1aWxkQXJnczogYXNzZXQuZG9ja2VyQnVpbGRBcmdzLFxuICAgICAgZG9ja2VyQnVpbGRTZWNyZXRzOiBhc3NldC5kb2NrZXJCdWlsZFNlY3JldHMsXG4gICAgICBkb2NrZXJCdWlsZFRhcmdldDogYXNzZXQuZG9ja2VyQnVpbGRUYXJnZXQsXG4gICAgICBkb2NrZXJGaWxlOiBhc3NldC5kb2NrZXJGaWxlLFxuICAgICAgbmV0d29ya01vZGU6IGFzc2V0Lm5ldHdvcmtNb2RlLFxuICAgICAgcGxhdGZvcm06IGFzc2V0LnBsYXRmb3JtLFxuICAgICAgZG9ja2VyT3V0cHV0czogYXNzZXQuZG9ja2VyT3V0cHV0cyxcbiAgICAgIGNhY2hlRnJvbTogYXNzZXQuZG9ja2VyQ2FjaGVGcm9tLFxuICAgICAgY2FjaGVUbzogYXNzZXQuZG9ja2VyQ2FjaGVUbyxcbiAgICB9LCB7XG4gICAgICByZXBvc2l0b3J5TmFtZTogdGFyZ2V0LnJlcG9zaXRvcnlOYW1lLFxuICAgICAgaW1hZ2VUYWcsXG4gICAgICByZWdpb246IHJlc29sdmVkT3Ioc3RhY2sucmVnaW9uLCB1bmRlZmluZWQpLFxuICAgICAgYXNzdW1lUm9sZUFybjogdGFyZ2V0LnJvbGU/LmFzc3VtZVJvbGVBcm4sXG4gICAgICBhc3N1bWVSb2xlRXh0ZXJuYWxJZDogdGFyZ2V0LnJvbGU/LmFzc3VtZVJvbGVFeHRlcm5hbElkLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGZpbGUgYXNzZXQgc291cmNlIGFuZCBkZXN0aW5hdGlvbiB0byB0aGUgbWFuaWZlc3RcbiAgICpcbiAgICogc291cmNlSGFzaCBzaG91bGQgYmUgdW5pcXVlIGZvciBldmVyeSBzb3VyY2UuXG4gICAqL1xuICBwdWJsaWMgYWRkRmlsZUFzc2V0KHN0YWNrOiBTdGFjaywgc291cmNlSGFzaDogc3RyaW5nLCBzb3VyY2U6IGN4c2NoZW1hLkZpbGVTb3VyY2UsIGRlc3Q6IGN4c2NoZW1hLkZpbGVEZXN0aW5hdGlvbikge1xuICAgIGlmICghdGhpcy5maWxlc1tzb3VyY2VIYXNoXSkge1xuICAgICAgdGhpcy5maWxlc1tzb3VyY2VIYXNoXSA9IHtcbiAgICAgICAgc291cmNlLFxuICAgICAgICBkZXN0aW5hdGlvbnM6IHt9LFxuICAgICAgfTtcbiAgICB9XG4gICAgdGhpcy5maWxlc1tzb3VyY2VIYXNoXS5kZXN0aW5hdGlvbnNbdGhpcy5tYW5pZmVzdEVudk5hbWUoc3RhY2spXSA9IGRlc3Q7XG4gICAgcmV0dXJuIGRlc3Q7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgZG9ja2VyIGFzc2V0IHNvdXJjZSBhbmQgZGVzdGluYXRpb24gdG8gdGhlIG1hbmlmZXN0XG4gICAqXG4gICAqIHNvdXJjZUhhc2ggc2hvdWxkIGJlIHVuaXF1ZSBmb3IgZXZlcnkgc291cmNlLlxuICAgKi9cbiAgcHVibGljIGFkZERvY2tlckltYWdlQXNzZXQoc3RhY2s6IFN0YWNrLCBzb3VyY2VIYXNoOiBzdHJpbmcsIHNvdXJjZTogY3hzY2hlbWEuRG9ja2VySW1hZ2VTb3VyY2UsIGRlc3Q6IGN4c2NoZW1hLkRvY2tlckltYWdlRGVzdGluYXRpb24pIHtcbiAgICBpZiAoIXRoaXMuZG9ja2VySW1hZ2VzW3NvdXJjZUhhc2hdKSB7XG4gICAgICB0aGlzLmRvY2tlckltYWdlc1tzb3VyY2VIYXNoXSA9IHtcbiAgICAgICAgc291cmNlLFxuICAgICAgICBkZXN0aW5hdGlvbnM6IHt9LFxuICAgICAgfTtcbiAgICB9XG4gICAgdGhpcy5kb2NrZXJJbWFnZXNbc291cmNlSGFzaF0uZGVzdGluYXRpb25zW3RoaXMubWFuaWZlc3RFbnZOYW1lKHN0YWNrKV0gPSBkZXN0O1xuICAgIHJldHVybiBkZXN0O1xuICB9XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlcmUgYXJlIGFueSBhc3NldHMgcmVnaXN0ZXJlZCBpbiB0aGUgbWFuaWZlc3RcbiAgICovXG4gIHB1YmxpYyBnZXQgaGFzQXNzZXRzKCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmZpbGVzKS5sZW5ndGggKyBPYmplY3Qua2V5cyh0aGlzLmRvY2tlckltYWdlcykubGVuZ3RoID4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcml0ZSB0aGUgbWFuaWZlc3QgdG8gZGlzaywgYW5kIGFkZCBpdCB0byB0aGUgc3ludGhlc2lzIHNlc3Npb25cbiAgICpcbiAgICogUmV0dXJuIHRoZSBhcnRpZmFjdCBpZCwgd2hpY2ggc2hvdWxkIGJlIGFkZGVkIHRvIHRoZSBgYWRkaXRpb25hbERlcGVuZGVuY2llc2BcbiAgICogZmllbGQgb2YgdGhlIHN0YWNrIGFydGlmYWN0LlxuICAgKi9cbiAgcHVibGljIGVtaXRNYW5pZmVzdChcbiAgICBzdGFjazogU3RhY2ssXG4gICAgc2Vzc2lvbjogSVN5bnRoZXNpc1Nlc3Npb24sXG4gICAgb3B0aW9uczogY3hzY2hlbWEuQXNzZXRNYW5pZmVzdE9wdGlvbnMgPSB7fSxcbiAgKTogc3RyaW5nIHtcbiAgICBjb25zdCBhcnRpZmFjdElkID0gYCR7c3RhY2suYXJ0aWZhY3RJZH0uYXNzZXRzYDtcbiAgICBjb25zdCBtYW5pZmVzdEZpbGUgPSBgJHthcnRpZmFjdElkfS5qc29uYDtcbiAgICBjb25zdCBvdXRQYXRoID0gcGF0aC5qb2luKHNlc3Npb24uYXNzZW1ibHkub3V0ZGlyLCBtYW5pZmVzdEZpbGUpO1xuXG4gICAgY29uc3QgbWFuaWZlc3Q6IGN4c2NoZW1hLkFzc2V0TWFuaWZlc3QgPSB7XG4gICAgICB2ZXJzaW9uOiBjeHNjaGVtYS5NYW5pZmVzdC52ZXJzaW9uKCksXG4gICAgICBmaWxlczogdGhpcy5maWxlcyxcbiAgICAgIGRvY2tlckltYWdlczogdGhpcy5kb2NrZXJJbWFnZXMsXG4gICAgfTtcblxuICAgIGZzLndyaXRlRmlsZVN5bmMob3V0UGF0aCwgSlNPTi5zdHJpbmdpZnkobWFuaWZlc3QsIHVuZGVmaW5lZCwgMikpO1xuXG4gICAgc2Vzc2lvbi5hc3NlbWJseS5hZGRBcnRpZmFjdChhcnRpZmFjdElkLCB7XG4gICAgICB0eXBlOiBjeHNjaGVtYS5BcnRpZmFjdFR5cGUuQVNTRVRfTUFOSUZFU1QsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGZpbGU6IG1hbmlmZXN0RmlsZSxcbiAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICByZXR1cm4gYXJ0aWZhY3RJZDtcbiAgfVxuXG4gIHByaXZhdGUgbWFuaWZlc3RFbnZOYW1lKHN0YWNrOiBTdGFjayk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHJlc29sdmVkT3Ioc3RhY2suYWNjb3VudCwgJ2N1cnJlbnRfYWNjb3VudCcpLFxuICAgICAgcmVzb2x2ZWRPcihzdGFjay5yZWdpb24sICdjdXJyZW50X3JlZ2lvbicpLFxuICAgIF0uam9pbignLScpO1xuICB9XG59XG5cbi8qKlxuICogVGhlIGRlc3RpbmF0aW9uIGZvciBhIGZpbGUgYXNzZXQsIHdoZW4gaXQgaXMgZ2l2ZW4gdG8gdGhlIEFzc2V0TWFuaWZlc3RCdWlsZGVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXNzZXRNYW5pZmVzdEZpbGVEZXN0aW5hdGlvbiB7XG4gIC8qKlxuICAgKiBCdWNrZXQgbmFtZSB3aGVyZSB0aGUgZmlsZSBhc3NldCBzaG91bGQgYmUgd3JpdHRlblxuICAgKi9cbiAgcmVhZG9ubHkgYnVja2V0TmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBQcmVmaXggdG8gcHJlcGVuZCB0byB0aGUgYXNzZXQgaGFzaFxuICAgKlxuICAgKiBAZGVmYXVsdCAnJ1xuICAgKi9cbiAgcmVhZG9ubHkgYnVja2V0UHJlZml4Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSb2xlIHRvIHVzZSBmb3IgdXBsb2FkaW5nXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gY3VycmVudCByb2xlXG4gICAqL1xuICByZWFkb25seSByb2xlPzogUm9sZU9wdGlvbnM7XG59XG5cbi8qKlxuICogVGhlIGRlc3RpbmF0aW9uIGZvciBhIGRvY2tlciBpbWFnZSBhc3NldCwgd2hlbiBpdCBpcyBnaXZlbiB0byB0aGUgQXNzZXRNYW5pZmVzdEJ1aWxkZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBc3NldE1hbmlmZXN0RG9ja2VySW1hZ2VEZXN0aW5hdGlvbiB7XG4gIC8qKlxuICAgKiBSZXBvc2l0b3J5IG5hbWUgd2hlcmUgdGhlIGRvY2tlciBpbWFnZSBhc3NldCBzaG91bGQgYmUgd3JpdHRlblxuICAgKi9cbiAgcmVhZG9ubHkgcmVwb3NpdG9yeU5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogUHJlZml4IHRvIGFkZCB0byB0aGUgYXNzZXQgaGFzaCB0byBtYWtlIHRoZSBEb2NrZXIgaW1hZ2UgdGFnXG4gICAqXG4gICAqIEBkZWZhdWx0ICcnXG4gICAqL1xuICByZWFkb25seSBkb2NrZXJUYWdQcmVmaXg/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJvbGUgdG8gdXNlIHRvIHBlcmZvcm0gdGhlIHVwbG9hZFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHJvbGVcbiAgICovXG4gIHJlYWRvbmx5IHJvbGU/OiBSb2xlT3B0aW9ucztcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciBzcGVjaWZ5aW5nIGEgcm9sZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJvbGVPcHRpb25zIHtcbiAgLyoqXG4gICAqIEFSTiBvZiB0aGUgcm9sZSB0byBhc3N1bWVcbiAgICovXG4gIHJlYWRvbmx5IGFzc3VtZVJvbGVBcm46IHN0cmluZztcblxuICAvKipcbiAgICogRXh0ZXJuYWwgSUQgdG8gdXNlIHdoZW4gYXNzdW1pbmcgdGhlIHJvbGVcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBleHRlcm5hbCBJRFxuICAgKi9cbiAgcmVhZG9ubHkgYXNzdW1lUm9sZUV4dGVybmFsSWQ/OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlRmlsZUFzc2V0U291cmNlKGFzc2V0OiBGaWxlQXNzZXRTb3VyY2UpIHtcbiAgaWYgKCEhYXNzZXQuZXhlY3V0YWJsZSA9PT0gISFhc3NldC5maWxlTmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgRXhhY3RseSBvbmUgb2YgJ2ZpbGVOYW1lJyBvciAnZXhlY3V0YWJsZScgaXMgcmVxdWlyZWQsIGdvdDogJHtKU09OLnN0cmluZ2lmeShhc3NldCl9YCk7XG4gIH1cblxuICBpZiAoISFhc3NldC5wYWNrYWdpbmcgIT09ICEhYXNzZXQuZmlsZU5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCdwYWNrYWdpbmcnIGlzIGV4cGVjdGVkIGluIGNvbWJpbmF0aW9uIHdpdGggJ2ZpbGVOYW1lJywgZ290OiAke0pTT04uc3RyaW5naWZ5KGFzc2V0KX1gKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZURvY2tlckltYWdlQXNzZXRTb3VyY2UoYXNzZXQ6IERvY2tlckltYWdlQXNzZXRTb3VyY2UpIHtcbiAgaWYgKCEhYXNzZXQuZXhlY3V0YWJsZSA9PT0gISFhc3NldC5kaXJlY3RvcnlOYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBFeGFjdGx5IG9uZSBvZiAnZGlyZWN0b3J5TmFtZScgb3IgJ2V4ZWN1dGFibGUnIGlzIHJlcXVpcmVkLCBnb3Q6ICR7SlNPTi5zdHJpbmdpZnkoYXNzZXQpfWApO1xuICB9XG5cbiAgY2hlY2soJ2RvY2tlckJ1aWxkQXJncycpO1xuICBjaGVjaygnZG9ja2VyQnVpbGRUYXJnZXQnKTtcbiAgY2hlY2soJ2RvY2tlck91dHB1dHMnKTtcbiAgY2hlY2soJ2RvY2tlckZpbGUnKTtcblxuICBmdW5jdGlvbiBjaGVjazxLIGV4dGVuZHMga2V5b2YgRG9ja2VySW1hZ2VBc3NldFNvdXJjZT4oa2V5OiBLKSB7XG4gICAgaWYgKGFzc2V0W2tleV0gJiYgIWFzc2V0LmRpcmVjdG9yeU5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJyR7a2V5fScgaXMgb25seSBhbGxvd2VkIGluIGNvbWJpbmF0aW9uIHdpdGggJ2RpcmVjdG9yeU5hbWUnLCBnb3Q6ICR7SlNPTi5zdHJpbmdpZnkoYXNzZXQpfWApO1xuICAgIH1cbiAgfVxufVxuIl19