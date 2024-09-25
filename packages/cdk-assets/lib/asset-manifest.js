"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DestinationPattern = exports.DestinationIdentifier = exports.DockerImageManifestEntry = exports.FileManifestEntry = exports.AssetManifest = void 0;
const fs = require("fs");
const path = require("path");
const cloud_assembly_schema_1 = require("@aws-cdk/cloud-assembly-schema");
/**
 * A manifest of assets
 */
class AssetManifest {
    /**
     * Load an asset manifest from the given file
     */
    static fromFile(fileName) {
        try {
            const obj = cloud_assembly_schema_1.Manifest.loadAssetManifest(fileName);
            return new AssetManifest(path.dirname(fileName), obj);
        }
        catch (e) {
            throw new Error(`Canot read asset manifest '${fileName}': ${e.message}`);
        }
    }
    /**
     * Load an asset manifest from the given file or directory
     *
     * If the argument given is a directoy, the default asset file name will be used.
     */
    static fromPath(filePath) {
        let st;
        try {
            st = fs.statSync(filePath);
        }
        catch (e) {
            throw new Error(`Cannot read asset manifest at '${filePath}': ${e.message}`);
        }
        if (st.isDirectory()) {
            return AssetManifest.fromFile(path.join(filePath, AssetManifest.DEFAULT_FILENAME));
        }
        return AssetManifest.fromFile(filePath);
    }
    constructor(directory, manifest) {
        this.manifest = manifest;
        this.directory = directory;
    }
    /**
     * Select a subset of assets and destinations from this manifest.
     *
     * Only assets with at least 1 selected destination are retained.
     *
     * If selection is not given, everything is returned.
     */
    select(selection) {
        if (selection === undefined) {
            return this;
        }
        const ret = { version: this.manifest.version, dockerImages: {}, files: {} };
        for (const assetType of ASSET_TYPES) {
            for (const [assetId, asset] of Object.entries(this.manifest[assetType] || {})) {
                const filteredDestinations = filterDict(asset.destinations, (_, destId) => selection.some(sel => sel.matches(new DestinationIdentifier(assetId, destId))));
                if (Object.keys(filteredDestinations).length > 0) {
                    ret[assetType][assetId] = {
                        ...asset,
                        destinations: filteredDestinations,
                    };
                }
            }
        }
        return new AssetManifest(this.directory, ret);
    }
    /**
     * Describe the asset manifest as a list of strings
     */
    list() {
        return [
            ...describeAssets('file', this.manifest.files || {}),
            ...describeAssets('docker-image', this.manifest.dockerImages || {}),
        ];
        function describeAssets(type, assets) {
            const ret = new Array();
            for (const [assetId, asset] of Object.entries(assets || {})) {
                ret.push(`${assetId} ${type} ${JSON.stringify(asset.source)}`);
                const destStrings = Object.entries(asset.destinations).map(([destId, dest]) => ` ${assetId}:${destId} ${JSON.stringify(dest)}`);
                ret.push(...prefixTreeChars(destStrings, '  '));
            }
            return ret;
        }
    }
    /**
     * List of assets per destination
     *
     * Returns one asset for every publishable destination. Multiple asset
     * destinations may share the same asset source.
     */
    get entries() {
        return [
            ...makeEntries(this.manifest.files || {}, FileManifestEntry),
            ...makeEntries(this.manifest.dockerImages || {}, DockerImageManifestEntry),
        ];
    }
    /**
     * List of file assets, splat out to destinations
     */
    get files() {
        return makeEntries(this.manifest.files || {}, FileManifestEntry);
    }
}
exports.AssetManifest = AssetManifest;
/**
 * The default name of the asset manifest in a cdk.out directory
 */
AssetManifest.DEFAULT_FILENAME = 'assets.json';
function makeEntries(assets, ctor) {
    const ret = new Array();
    for (const [assetId, asset] of Object.entries(assets)) {
        for (const [destId, destination] of Object.entries(asset.destinations)) {
            ret.push(new ctor(new DestinationIdentifier(assetId, destId), asset.source, destination));
        }
    }
    return ret;
}
const ASSET_TYPES = ['files', 'dockerImages'];
/**
 * A manifest entry for a file asset
 */
class FileManifestEntry {
    constructor(
    /** Identifier for this asset */
    id, 
    /** Source of the file asset */
    source, 
    /** Destination for the file asset */
    destination) {
        this.id = id;
        this.source = source;
        this.destination = destination;
        this.type = 'file';
        this.genericSource = source;
        this.genericDestination = destination;
    }
}
exports.FileManifestEntry = FileManifestEntry;
/**
 * A manifest entry for a docker image asset
 */
class DockerImageManifestEntry {
    constructor(
    /** Identifier for this asset */
    id, 
    /** Source of the file asset */
    source, 
    /** Destination for the file asset */
    destination) {
        this.id = id;
        this.source = source;
        this.destination = destination;
        this.type = 'docker-image';
        this.genericSource = source;
        this.genericDestination = destination;
    }
}
exports.DockerImageManifestEntry = DockerImageManifestEntry;
/**
 * Identify an asset destination in an asset manifest
 *
 * When stringified, this will be a combination of the source
 * and destination IDs.
 */
class DestinationIdentifier {
    constructor(assetId, destinationId) {
        this.assetId = assetId;
        this.destinationId = destinationId;
    }
    /**
     * Return a string representation for this asset identifier
     */
    toString() {
        return this.destinationId ? `${this.assetId}:${this.destinationId}` : this.assetId;
    }
}
exports.DestinationIdentifier = DestinationIdentifier;
function filterDict(xs, pred) {
    const ret = {};
    for (const [key, value] of Object.entries(xs)) {
        if (pred(value, key)) {
            ret[key] = value;
        }
    }
    return ret;
}
/**
 * A filter pattern for an destination identifier
 */
class DestinationPattern {
    /**
     * Parse a ':'-separated string into an asset/destination identifier
     */
    static parse(s) {
        if (!s) {
            throw new Error('Empty string is not a valid destination identifier');
        }
        const parts = s.split(':').map(x => x !== '*' ? x : undefined);
        if (parts.length === 1) {
            return new DestinationPattern(parts[0]);
        }
        if (parts.length === 2) {
            return new DestinationPattern(parts[0] || undefined, parts[1] || undefined);
        }
        throw new Error(`Asset identifier must contain at most 2 ':'-separated parts, got '${s}'`);
    }
    constructor(assetId, destinationId) {
        this.assetId = assetId;
        this.destinationId = destinationId;
    }
    /**
     * Whether or not this pattern matches the given identifier
     */
    matches(id) {
        return (this.assetId === undefined || this.assetId === id.assetId)
            && (this.destinationId === undefined || this.destinationId === id.destinationId);
    }
    /**
     * Return a string representation for this asset identifier
     */
    toString() {
        return `${this.assetId ?? '*'}:${this.destinationId ?? '*'}`;
    }
}
exports.DestinationPattern = DestinationPattern;
/**
 * Prefix box-drawing characters to make lines look like a hanging tree
 */
function prefixTreeChars(xs, prefix = '') {
    const ret = new Array();
    for (let i = 0; i < xs.length; i++) {
        const isLast = i === xs.length - 1;
        const boxChar = isLast ? '└' : '├';
        ret.push(`${prefix}${boxChar}${xs[i]}`);
    }
    return ret;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZXQtbWFuaWZlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhc3NldC1tYW5pZmVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLDBFQUd3QztBQUV4Qzs7R0FFRztBQUNILE1BQWEsYUFBYTtJQU14Qjs7T0FFRztJQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBZ0I7UUFDckMsSUFBSSxDQUFDO1lBQ0gsTUFBTSxHQUFHLEdBQUcsZ0NBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNqRCxPQUFPLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUFDLE9BQU8sQ0FBTSxFQUFFLENBQUM7WUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsUUFBUSxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQzNFLENBQUM7SUFDSCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBZ0I7UUFDckMsSUFBSSxFQUFFLENBQUM7UUFDUCxJQUFJLENBQUM7WUFDSCxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM3QixDQUFDO1FBQUMsT0FBTyxDQUFNLEVBQUUsQ0FBQztZQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLGtDQUFrQyxRQUFRLE1BQU0sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDL0UsQ0FBQztRQUNELElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUM7WUFDckIsT0FBTyxhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7UUFDckYsQ0FBQztRQUNELE9BQU8sYUFBYSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBT0QsWUFBWSxTQUFpQixFQUFtQixRQUE2QjtRQUE3QixhQUFRLEdBQVIsUUFBUSxDQUFxQjtRQUMzRSxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUM3QixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLFNBQWdDO1FBQzVDLElBQUksU0FBUyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQUMsT0FBTyxJQUFJLENBQUM7UUFBQyxDQUFDO1FBRTdDLE1BQU0sR0FBRyxHQUNOLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDO1FBRW5FLEtBQUssTUFBTSxTQUFTLElBQUksV0FBVyxFQUFFLENBQUM7WUFDcEMsS0FBSyxNQUFNLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUM5RSxNQUFNLG9CQUFvQixHQUFHLFVBQVUsQ0FDckMsS0FBSyxDQUFDLFlBQVksRUFDbEIsQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFakcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO29CQUNqRCxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUc7d0JBQ3hCLEdBQUcsS0FBSzt3QkFDUixZQUFZLEVBQUUsb0JBQW9CO3FCQUNuQyxDQUFDO2dCQUNKLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztRQUVELE9BQU8sSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQ7O09BRUc7SUFDSSxJQUFJO1FBQ1QsT0FBTztZQUNMLEdBQUcsY0FBYyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDcEQsR0FBRyxjQUFjLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQztTQUNwRSxDQUFDO1FBRUYsU0FBUyxjQUFjLENBQUMsSUFBWSxFQUFFLE1BQTBFO1lBQzlHLE1BQU0sR0FBRyxHQUFHLElBQUksS0FBSyxFQUFVLENBQUM7WUFDaEMsS0FBSyxNQUFNLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQzVELEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFFL0QsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksT0FBTyxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDaEksR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLGVBQWUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNsRCxDQUFDO1lBQ0QsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDO0lBQ0gsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsSUFBVyxPQUFPO1FBQ2hCLE9BQU87WUFDTCxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxFQUFFLEVBQUUsaUJBQWlCLENBQUM7WUFDNUQsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLElBQUksRUFBRSxFQUFFLHdCQUF3QixDQUFDO1NBQzNFLENBQUM7SUFDSixDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFXLEtBQUs7UUFDZCxPQUFPLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxFQUFFLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUNuRSxDQUFDOztBQW5ISCxzQ0FvSEM7QUFuSEM7O0dBRUc7QUFDb0IsOEJBQWdCLEdBQUcsYUFBYSxDQUFDO0FBa0gxRCxTQUFTLFdBQVcsQ0FDbEIsTUFBc0UsRUFDdEUsSUFBcUU7SUFFckUsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUssQ0FBQztJQUMzQixLQUFLLE1BQU0sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ3RELEtBQUssTUFBTSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDO1lBQ3ZFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzVGLENBQUM7SUFDSCxDQUFDO0lBQ0QsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBSUQsTUFBTSxXQUFXLEdBQWdCLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBMkIzRDs7R0FFRztBQUNILE1BQWEsaUJBQWlCO0lBSzVCO0lBQ0UsZ0NBQWdDO0lBQ2hCLEVBQXlCO0lBQ3pDLCtCQUErQjtJQUNmLE1BQWtCO0lBQ2xDLHFDQUFxQztJQUNyQixXQUE0QjtRQUo1QixPQUFFLEdBQUYsRUFBRSxDQUF1QjtRQUV6QixXQUFNLEdBQU4sTUFBTSxDQUFZO1FBRWxCLGdCQUFXLEdBQVgsV0FBVyxDQUFpQjtRQVI5QixTQUFJLEdBQUcsTUFBTSxDQUFDO1FBVTVCLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDO1FBQzVCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxXQUFXLENBQUM7SUFDeEMsQ0FBQztDQUNGO0FBaEJELDhDQWdCQztBQUVEOztHQUVHO0FBQ0gsTUFBYSx3QkFBd0I7SUFLbkM7SUFDRSxnQ0FBZ0M7SUFDaEIsRUFBeUI7SUFDekMsK0JBQStCO0lBQ2YsTUFBeUI7SUFDekMscUNBQXFDO0lBQ3JCLFdBQW1DO1FBSm5DLE9BQUUsR0FBRixFQUFFLENBQXVCO1FBRXpCLFdBQU0sR0FBTixNQUFNLENBQW1CO1FBRXpCLGdCQUFXLEdBQVgsV0FBVyxDQUF3QjtRQVJyQyxTQUFJLEdBQUcsY0FBYyxDQUFDO1FBVXBDLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDO1FBQzVCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxXQUFXLENBQUM7SUFDeEMsQ0FBQztDQUNGO0FBaEJELDREQWdCQztBQUVEOzs7OztHQUtHO0FBQ0gsTUFBYSxxQkFBcUI7SUFjaEMsWUFBWSxPQUFlLEVBQUUsYUFBcUI7UUFDaEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7SUFDckMsQ0FBQztJQUVEOztPQUVHO0lBQ0ksUUFBUTtRQUNiLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUNyRixDQUFDO0NBQ0Y7QUF6QkQsc0RBeUJDO0FBRUQsU0FBUyxVQUFVLENBQUksRUFBcUIsRUFBRSxJQUFvQztJQUNoRixNQUFNLEdBQUcsR0FBc0IsRUFBRSxDQUFDO0lBQ2xDLEtBQUssTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDOUMsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDckIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUNuQixDQUFDO0lBQ0gsQ0FBQztJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUVEOztHQUVHO0FBQ0gsTUFBYSxrQkFBa0I7SUFDN0I7O09BRUc7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQVM7UUFDM0IsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO1FBQUMsQ0FBQztRQUNsRixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0QsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQUMsT0FBTyxJQUFJLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQUMsQ0FBQztRQUNwRSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFBQyxPQUFPLElBQUksa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUM7UUFBQyxDQUFDO1FBQ3hHLE1BQU0sSUFBSSxLQUFLLENBQUMscUVBQXFFLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0YsQ0FBQztJQVlELFlBQVksT0FBZ0IsRUFBRSxhQUFzQjtRQUNsRCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztJQUNyQyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxPQUFPLENBQUMsRUFBeUI7UUFDdEMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQztlQUMvRCxDQUFDLElBQUksQ0FBQyxhQUFhLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxhQUFhLEtBQUssRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ25GLENBQUM7SUFFRDs7T0FFRztJQUNJLFFBQVE7UUFDYixPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUMvRCxDQUFDO0NBQ0Y7QUF6Q0QsZ0RBeUNDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLGVBQWUsQ0FBQyxFQUFZLEVBQUUsTUFBTSxHQUFHLEVBQUU7SUFDaEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQVUsQ0FBQztJQUNoQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQ25DLE1BQU0sTUFBTSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNuQyxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ25DLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLEdBQUcsT0FBTyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge1xuICBBc3NldE1hbmlmZXN0IGFzIEFzc2V0TWFuaWZlc3RTY2hlbWEsIERvY2tlckltYWdlRGVzdGluYXRpb24sIERvY2tlckltYWdlU291cmNlLFxuICBGaWxlRGVzdGluYXRpb24sIEZpbGVTb3VyY2UsIE1hbmlmZXN0LFxufSBmcm9tICdAYXdzLWNkay9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuXG4vKipcbiAqIEEgbWFuaWZlc3Qgb2YgYXNzZXRzXG4gKi9cbmV4cG9ydCBjbGFzcyBBc3NldE1hbmlmZXN0IHtcbiAgLyoqXG4gICAqIFRoZSBkZWZhdWx0IG5hbWUgb2YgdGhlIGFzc2V0IG1hbmlmZXN0IGluIGEgY2RrLm91dCBkaXJlY3RvcnlcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgREVGQVVMVF9GSUxFTkFNRSA9ICdhc3NldHMuanNvbic7XG5cbiAgLyoqXG4gICAqIExvYWQgYW4gYXNzZXQgbWFuaWZlc3QgZnJvbSB0aGUgZ2l2ZW4gZmlsZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tRmlsZShmaWxlTmFtZTogc3RyaW5nKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG9iaiA9IE1hbmlmZXN0LmxvYWRBc3NldE1hbmlmZXN0KGZpbGVOYW1lKTtcbiAgICAgIHJldHVybiBuZXcgQXNzZXRNYW5pZmVzdChwYXRoLmRpcm5hbWUoZmlsZU5hbWUpLCBvYmopO1xuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5vdCByZWFkIGFzc2V0IG1hbmlmZXN0ICcke2ZpbGVOYW1lfSc6ICR7ZS5tZXNzYWdlfWApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIGFuIGFzc2V0IG1hbmlmZXN0IGZyb20gdGhlIGdpdmVuIGZpbGUgb3IgZGlyZWN0b3J5XG4gICAqXG4gICAqIElmIHRoZSBhcmd1bWVudCBnaXZlbiBpcyBhIGRpcmVjdG95LCB0aGUgZGVmYXVsdCBhc3NldCBmaWxlIG5hbWUgd2lsbCBiZSB1c2VkLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tUGF0aChmaWxlUGF0aDogc3RyaW5nKSB7XG4gICAgbGV0IHN0O1xuICAgIHRyeSB7XG4gICAgICBzdCA9IGZzLnN0YXRTeW5jKGZpbGVQYXRoKTtcbiAgICB9IGNhdGNoIChlOiBhbnkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHJlYWQgYXNzZXQgbWFuaWZlc3QgYXQgJyR7ZmlsZVBhdGh9JzogJHtlLm1lc3NhZ2V9YCk7XG4gICAgfVxuICAgIGlmIChzdC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICByZXR1cm4gQXNzZXRNYW5pZmVzdC5mcm9tRmlsZShwYXRoLmpvaW4oZmlsZVBhdGgsIEFzc2V0TWFuaWZlc3QuREVGQVVMVF9GSUxFTkFNRSkpO1xuICAgIH1cbiAgICByZXR1cm4gQXNzZXRNYW5pZmVzdC5mcm9tRmlsZShmaWxlUGF0aCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGRpcmVjdG9yeSB3aGVyZSB0aGUgbWFuaWZlc3Qgd2FzIGZvdW5kXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGlyZWN0b3J5OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoZGlyZWN0b3J5OiBzdHJpbmcsIHByaXZhdGUgcmVhZG9ubHkgbWFuaWZlc3Q6IEFzc2V0TWFuaWZlc3RTY2hlbWEpIHtcbiAgICB0aGlzLmRpcmVjdG9yeSA9IGRpcmVjdG9yeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3QgYSBzdWJzZXQgb2YgYXNzZXRzIGFuZCBkZXN0aW5hdGlvbnMgZnJvbSB0aGlzIG1hbmlmZXN0LlxuICAgKlxuICAgKiBPbmx5IGFzc2V0cyB3aXRoIGF0IGxlYXN0IDEgc2VsZWN0ZWQgZGVzdGluYXRpb24gYXJlIHJldGFpbmVkLlxuICAgKlxuICAgKiBJZiBzZWxlY3Rpb24gaXMgbm90IGdpdmVuLCBldmVyeXRoaW5nIGlzIHJldHVybmVkLlxuICAgKi9cbiAgcHVibGljIHNlbGVjdChzZWxlY3Rpb24/OiBEZXN0aW5hdGlvblBhdHRlcm5bXSk6IEFzc2V0TWFuaWZlc3Qge1xuICAgIGlmIChzZWxlY3Rpb24gPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gdGhpczsgfVxuXG4gICAgY29uc3QgcmV0OiBBc3NldE1hbmlmZXN0U2NoZW1hICYgUmVxdWlyZWQ8UGljazxBc3NldE1hbmlmZXN0U2NoZW1hLCBBc3NldFR5cGU+PlxuICAgICA9IHsgdmVyc2lvbjogdGhpcy5tYW5pZmVzdC52ZXJzaW9uLCBkb2NrZXJJbWFnZXM6IHt9LCBmaWxlczoge30gfTtcblxuICAgIGZvciAoY29uc3QgYXNzZXRUeXBlIG9mIEFTU0VUX1RZUEVTKSB7XG4gICAgICBmb3IgKGNvbnN0IFthc3NldElkLCBhc3NldF0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5tYW5pZmVzdFthc3NldFR5cGVdIHx8IHt9KSkge1xuICAgICAgICBjb25zdCBmaWx0ZXJlZERlc3RpbmF0aW9ucyA9IGZpbHRlckRpY3QoXG4gICAgICAgICAgYXNzZXQuZGVzdGluYXRpb25zLFxuICAgICAgICAgIChfLCBkZXN0SWQpID0+IHNlbGVjdGlvbi5zb21lKHNlbCA9PiBzZWwubWF0Y2hlcyhuZXcgRGVzdGluYXRpb25JZGVudGlmaWVyKGFzc2V0SWQsIGRlc3RJZCkpKSk7XG5cbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGZpbHRlcmVkRGVzdGluYXRpb25zKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0W2Fzc2V0VHlwZV1bYXNzZXRJZF0gPSB7XG4gICAgICAgICAgICAuLi5hc3NldCxcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uczogZmlsdGVyZWREZXN0aW5hdGlvbnMsXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgQXNzZXRNYW5pZmVzdCh0aGlzLmRpcmVjdG9yeSwgcmV0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXNjcmliZSB0aGUgYXNzZXQgbWFuaWZlc3QgYXMgYSBsaXN0IG9mIHN0cmluZ3NcbiAgICovXG4gIHB1YmxpYyBsaXN0KCkge1xuICAgIHJldHVybiBbXG4gICAgICAuLi5kZXNjcmliZUFzc2V0cygnZmlsZScsIHRoaXMubWFuaWZlc3QuZmlsZXMgfHwge30pLFxuICAgICAgLi4uZGVzY3JpYmVBc3NldHMoJ2RvY2tlci1pbWFnZScsIHRoaXMubWFuaWZlc3QuZG9ja2VySW1hZ2VzIHx8IHt9KSxcbiAgICBdO1xuXG4gICAgZnVuY3Rpb24gZGVzY3JpYmVBc3NldHModHlwZTogc3RyaW5nLCBhc3NldHM6IFJlY29yZDxzdHJpbmcsIHsgc291cmNlOiBhbnk7IGRlc3RpbmF0aW9uczogUmVjb3JkPHN0cmluZywgYW55PiB9Pikge1xuICAgICAgY29uc3QgcmV0ID0gbmV3IEFycmF5PHN0cmluZz4oKTtcbiAgICAgIGZvciAoY29uc3QgW2Fzc2V0SWQsIGFzc2V0XSBvZiBPYmplY3QuZW50cmllcyhhc3NldHMgfHwge30pKSB7XG4gICAgICAgIHJldC5wdXNoKGAke2Fzc2V0SWR9ICR7dHlwZX0gJHtKU09OLnN0cmluZ2lmeShhc3NldC5zb3VyY2UpfWApO1xuXG4gICAgICAgIGNvbnN0IGRlc3RTdHJpbmdzID0gT2JqZWN0LmVudHJpZXMoYXNzZXQuZGVzdGluYXRpb25zKS5tYXAoKFtkZXN0SWQsIGRlc3RdKSA9PiBgICR7YXNzZXRJZH06JHtkZXN0SWR9ICR7SlNPTi5zdHJpbmdpZnkoZGVzdCl9YCk7XG4gICAgICAgIHJldC5wdXNoKC4uLnByZWZpeFRyZWVDaGFycyhkZXN0U3RyaW5ncywgJyAgJykpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTGlzdCBvZiBhc3NldHMgcGVyIGRlc3RpbmF0aW9uXG4gICAqXG4gICAqIFJldHVybnMgb25lIGFzc2V0IGZvciBldmVyeSBwdWJsaXNoYWJsZSBkZXN0aW5hdGlvbi4gTXVsdGlwbGUgYXNzZXRcbiAgICogZGVzdGluYXRpb25zIG1heSBzaGFyZSB0aGUgc2FtZSBhc3NldCBzb3VyY2UuXG4gICAqL1xuICBwdWJsaWMgZ2V0IGVudHJpZXMoKTogSU1hbmlmZXN0RW50cnlbXSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIC4uLm1ha2VFbnRyaWVzKHRoaXMubWFuaWZlc3QuZmlsZXMgfHwge30sIEZpbGVNYW5pZmVzdEVudHJ5KSxcbiAgICAgIC4uLm1ha2VFbnRyaWVzKHRoaXMubWFuaWZlc3QuZG9ja2VySW1hZ2VzIHx8IHt9LCBEb2NrZXJJbWFnZU1hbmlmZXN0RW50cnkpLFxuICAgIF07XG4gIH1cblxuICAvKipcbiAgICogTGlzdCBvZiBmaWxlIGFzc2V0cywgc3BsYXQgb3V0IHRvIGRlc3RpbmF0aW9uc1xuICAgKi9cbiAgcHVibGljIGdldCBmaWxlcygpOiBGaWxlTWFuaWZlc3RFbnRyeVtdIHtcbiAgICByZXR1cm4gbWFrZUVudHJpZXModGhpcy5tYW5pZmVzdC5maWxlcyB8fCB7fSwgRmlsZU1hbmlmZXN0RW50cnkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1ha2VFbnRyaWVzPEEsIEIsIEM+KFxuICBhc3NldHM6IFJlY29yZDxzdHJpbmcsIHsgc291cmNlOiBBOyBkZXN0aW5hdGlvbnM6IFJlY29yZDxzdHJpbmcsIEI+IH0+LFxuICBjdG9yOiBuZXcgKGlkOiBEZXN0aW5hdGlvbklkZW50aWZpZXIsIHNvdXJjZTogQSwgZGVzdGluYXRpb246IEIpID0+IEMpOiBDW10ge1xuXG4gIGNvbnN0IHJldCA9IG5ldyBBcnJheTxDPigpO1xuICBmb3IgKGNvbnN0IFthc3NldElkLCBhc3NldF0gb2YgT2JqZWN0LmVudHJpZXMoYXNzZXRzKSkge1xuICAgIGZvciAoY29uc3QgW2Rlc3RJZCwgZGVzdGluYXRpb25dIG9mIE9iamVjdC5lbnRyaWVzKGFzc2V0LmRlc3RpbmF0aW9ucykpIHtcbiAgICAgIHJldC5wdXNoKG5ldyBjdG9yKG5ldyBEZXN0aW5hdGlvbklkZW50aWZpZXIoYXNzZXRJZCwgZGVzdElkKSwgYXNzZXQuc291cmNlLCBkZXN0aW5hdGlvbikpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG50eXBlIEFzc2V0VHlwZSA9ICdmaWxlcycgfCAnZG9ja2VySW1hZ2VzJztcblxuY29uc3QgQVNTRVRfVFlQRVM6IEFzc2V0VHlwZVtdID0gWydmaWxlcycsICdkb2NrZXJJbWFnZXMnXTtcblxuLyoqXG4gKiBBIHNpbmdsZSBhc3NldCBmcm9tIGFuIGFzc2V0IG1hbmlmZXN0J1xuICovXG5leHBvcnQgaW50ZXJmYWNlIElNYW5pZmVzdEVudHJ5IHtcbiAgLyoqXG4gICAqIFRoZSBpZGVudGlmaWVyIG9mIHRoZSBhc3NldCBhbmQgaXRzIGRlc3RpbmF0aW9uXG4gICAqL1xuICByZWFkb25seSBpZDogRGVzdGluYXRpb25JZGVudGlmaWVyO1xuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiBhc3NldFxuICAgKi9cbiAgcmVhZG9ubHkgdHlwZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUeXBlLWRlcGVuZGVudCBzb3VyY2UgZGF0YVxuICAgKi9cbiAgcmVhZG9ubHkgZ2VuZXJpY1NvdXJjZTogdW5rbm93bjtcblxuICAvKipcbiAgICogVHlwZS1kZXBlbmRlbnQgZGVzdGluYXRpb24gZGF0YVxuICAgKi9cbiAgcmVhZG9ubHkgZ2VuZXJpY0Rlc3RpbmF0aW9uOiB1bmtub3duO1xufVxuXG4vKipcbiAqIEEgbWFuaWZlc3QgZW50cnkgZm9yIGEgZmlsZSBhc3NldFxuICovXG5leHBvcnQgY2xhc3MgRmlsZU1hbmlmZXN0RW50cnkgaW1wbGVtZW50cyBJTWFuaWZlc3RFbnRyeSB7XG4gIHB1YmxpYyByZWFkb25seSBnZW5lcmljU291cmNlOiB1bmtub3duO1xuICBwdWJsaWMgcmVhZG9ubHkgZ2VuZXJpY0Rlc3RpbmF0aW9uOiB1bmtub3duO1xuICBwdWJsaWMgcmVhZG9ubHkgdHlwZSA9ICdmaWxlJztcblxuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogSWRlbnRpZmllciBmb3IgdGhpcyBhc3NldCAqL1xuICAgIHB1YmxpYyByZWFkb25seSBpZDogRGVzdGluYXRpb25JZGVudGlmaWVyLFxuICAgIC8qKiBTb3VyY2Ugb2YgdGhlIGZpbGUgYXNzZXQgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgc291cmNlOiBGaWxlU291cmNlLFxuICAgIC8qKiBEZXN0aW5hdGlvbiBmb3IgdGhlIGZpbGUgYXNzZXQgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgZGVzdGluYXRpb246IEZpbGVEZXN0aW5hdGlvbixcbiAgKSB7XG4gICAgdGhpcy5nZW5lcmljU291cmNlID0gc291cmNlO1xuICAgIHRoaXMuZ2VuZXJpY0Rlc3RpbmF0aW9uID0gZGVzdGluYXRpb247XG4gIH1cbn1cblxuLyoqXG4gKiBBIG1hbmlmZXN0IGVudHJ5IGZvciBhIGRvY2tlciBpbWFnZSBhc3NldFxuICovXG5leHBvcnQgY2xhc3MgRG9ja2VySW1hZ2VNYW5pZmVzdEVudHJ5IGltcGxlbWVudHMgSU1hbmlmZXN0RW50cnkge1xuICBwdWJsaWMgcmVhZG9ubHkgZ2VuZXJpY1NvdXJjZTogdW5rbm93bjtcbiAgcHVibGljIHJlYWRvbmx5IGdlbmVyaWNEZXN0aW5hdGlvbjogdW5rbm93bjtcbiAgcHVibGljIHJlYWRvbmx5IHR5cGUgPSAnZG9ja2VyLWltYWdlJztcblxuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogSWRlbnRpZmllciBmb3IgdGhpcyBhc3NldCAqL1xuICAgIHB1YmxpYyByZWFkb25seSBpZDogRGVzdGluYXRpb25JZGVudGlmaWVyLFxuICAgIC8qKiBTb3VyY2Ugb2YgdGhlIGZpbGUgYXNzZXQgKi9cbiAgICBwdWJsaWMgcmVhZG9ubHkgc291cmNlOiBEb2NrZXJJbWFnZVNvdXJjZSxcbiAgICAvKiogRGVzdGluYXRpb24gZm9yIHRoZSBmaWxlIGFzc2V0ICovXG4gICAgcHVibGljIHJlYWRvbmx5IGRlc3RpbmF0aW9uOiBEb2NrZXJJbWFnZURlc3RpbmF0aW9uLFxuICApIHtcbiAgICB0aGlzLmdlbmVyaWNTb3VyY2UgPSBzb3VyY2U7XG4gICAgdGhpcy5nZW5lcmljRGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbjtcbiAgfVxufVxuXG4vKipcbiAqIElkZW50aWZ5IGFuIGFzc2V0IGRlc3RpbmF0aW9uIGluIGFuIGFzc2V0IG1hbmlmZXN0XG4gKlxuICogV2hlbiBzdHJpbmdpZmllZCwgdGhpcyB3aWxsIGJlIGEgY29tYmluYXRpb24gb2YgdGhlIHNvdXJjZVxuICogYW5kIGRlc3RpbmF0aW9uIElEcy5cbiAqL1xuZXhwb3J0IGNsYXNzIERlc3RpbmF0aW9uSWRlbnRpZmllciB7XG4gIC8qKlxuICAgKiBJZGVudGlmaWVzIHRoZSBhc3NldCwgYnkgc291cmNlLlxuICAgKlxuICAgKiBUaGUgYXNzZXRJZCB3aWxsIGJlIHRoZSBzYW1lIGJldHdlZW4gYXNzZXRzIHRoYXQgcmVwcmVzZW50XG4gICAqIHRoZSBzYW1lIHBoeXNpY2FsIGZpbGUgb3IgaW1hZ2UuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYXNzZXRJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJZGVudGlmaWVzIHRoZSBkZXN0aW5hdGlvbiB3aGVyZSB0aGlzIGFzc2V0IHdpbGwgYmUgcHVibGlzaGVkXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGVzdGluYXRpb25JZDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGFzc2V0SWQ6IHN0cmluZywgZGVzdGluYXRpb25JZDogc3RyaW5nKSB7XG4gICAgdGhpcy5hc3NldElkID0gYXNzZXRJZDtcbiAgICB0aGlzLmRlc3RpbmF0aW9uSWQgPSBkZXN0aW5hdGlvbklkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBmb3IgdGhpcyBhc3NldCBpZGVudGlmaWVyXG4gICAqL1xuICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVzdGluYXRpb25JZCA/IGAke3RoaXMuYXNzZXRJZH06JHt0aGlzLmRlc3RpbmF0aW9uSWR9YCA6IHRoaXMuYXNzZXRJZDtcbiAgfVxufVxuXG5mdW5jdGlvbiBmaWx0ZXJEaWN0PEE+KHhzOiBSZWNvcmQ8c3RyaW5nLCBBPiwgcHJlZDogKHg6IEEsIGtleTogc3RyaW5nKSA9PiBib29sZWFuKTogUmVjb3JkPHN0cmluZywgQT4ge1xuICBjb25zdCByZXQ6IFJlY29yZDxzdHJpbmcsIEE+ID0ge307XG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHhzKSkge1xuICAgIGlmIChwcmVkKHZhbHVlLCBrZXkpKSB7XG4gICAgICByZXRba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG4vKipcbiAqIEEgZmlsdGVyIHBhdHRlcm4gZm9yIGFuIGRlc3RpbmF0aW9uIGlkZW50aWZpZXJcbiAqL1xuZXhwb3J0IGNsYXNzIERlc3RpbmF0aW9uUGF0dGVybiB7XG4gIC8qKlxuICAgKiBQYXJzZSBhICc6Jy1zZXBhcmF0ZWQgc3RyaW5nIGludG8gYW4gYXNzZXQvZGVzdGluYXRpb24gaWRlbnRpZmllclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBwYXJzZShzOiBzdHJpbmcpIHtcbiAgICBpZiAoIXMpIHsgdGhyb3cgbmV3IEVycm9yKCdFbXB0eSBzdHJpbmcgaXMgbm90IGEgdmFsaWQgZGVzdGluYXRpb24gaWRlbnRpZmllcicpOyB9XG4gICAgY29uc3QgcGFydHMgPSBzLnNwbGl0KCc6JykubWFwKHggPT4geCAhPT0gJyonID8geCA6IHVuZGVmaW5lZCk7XG4gICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMSkgeyByZXR1cm4gbmV3IERlc3RpbmF0aW9uUGF0dGVybihwYXJ0c1swXSk7IH1cbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAyKSB7IHJldHVybiBuZXcgRGVzdGluYXRpb25QYXR0ZXJuKHBhcnRzWzBdIHx8IHVuZGVmaW5lZCwgcGFydHNbMV0gfHwgdW5kZWZpbmVkKTsgfVxuICAgIHRocm93IG5ldyBFcnJvcihgQXNzZXQgaWRlbnRpZmllciBtdXN0IGNvbnRhaW4gYXQgbW9zdCAyICc6Jy1zZXBhcmF0ZWQgcGFydHMsIGdvdCAnJHtzfSdgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZGVudGlmaWVzIHRoZSBhc3NldCwgYnkgc291cmNlLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGFzc2V0SWQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIElkZW50aWZpZXMgdGhlIGRlc3RpbmF0aW9uIHdoZXJlIHRoaXMgYXNzZXQgd2lsbCBiZSBwdWJsaXNoZWRcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkZXN0aW5hdGlvbklkPzogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKGFzc2V0SWQ/OiBzdHJpbmcsIGRlc3RpbmF0aW9uSWQ/OiBzdHJpbmcpIHtcbiAgICB0aGlzLmFzc2V0SWQgPSBhc3NldElkO1xuICAgIHRoaXMuZGVzdGluYXRpb25JZCA9IGRlc3RpbmF0aW9uSWQ7XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciBvciBub3QgdGhpcyBwYXR0ZXJuIG1hdGNoZXMgdGhlIGdpdmVuIGlkZW50aWZpZXJcbiAgICovXG4gIHB1YmxpYyBtYXRjaGVzKGlkOiBEZXN0aW5hdGlvbklkZW50aWZpZXIpIHtcbiAgICByZXR1cm4gKHRoaXMuYXNzZXRJZCA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuYXNzZXRJZCA9PT0gaWQuYXNzZXRJZClcbiAgICAmJiAodGhpcy5kZXN0aW5hdGlvbklkID09PSB1bmRlZmluZWQgfHwgdGhpcy5kZXN0aW5hdGlvbklkID09PSBpZC5kZXN0aW5hdGlvbklkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gZm9yIHRoaXMgYXNzZXQgaWRlbnRpZmllclxuICAgKi9cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgJHt0aGlzLmFzc2V0SWQgPz8gJyonfToke3RoaXMuZGVzdGluYXRpb25JZCA/PyAnKid9YDtcbiAgfVxufVxuXG4vKipcbiAqIFByZWZpeCBib3gtZHJhd2luZyBjaGFyYWN0ZXJzIHRvIG1ha2UgbGluZXMgbG9vayBsaWtlIGEgaGFuZ2luZyB0cmVlXG4gKi9cbmZ1bmN0aW9uIHByZWZpeFRyZWVDaGFycyh4czogc3RyaW5nW10sIHByZWZpeCA9ICcnKSB7XG4gIGNvbnN0IHJldCA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBpc0xhc3QgPSBpID09PSB4cy5sZW5ndGggLSAxO1xuICAgIGNvbnN0IGJveENoYXIgPSBpc0xhc3QgPyAn4pSUJyA6ICfilJwnO1xuICAgIHJldC5wdXNoKGAke3ByZWZpeH0ke2JveENoYXJ9JHt4c1tpXX1gKTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuIl19