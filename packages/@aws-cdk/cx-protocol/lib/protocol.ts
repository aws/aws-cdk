import * as fs from 'fs';
import { ArtifactMetadataEntryType, ArtifactType, AssemblyManifest, Tag } from './assembly-manifest';

/**
 * Protocol utility class.
 */
export class Manifest {

    /**
     * Savel manifest to to file.
     *
     * @param manifest - manifest.
     */
    public static save(manifest: AssemblyManifest, filePath: string) {
        fs.writeFileSync(filePath, JSON.stringify(manifest, undefined, 2));
    }

    /**
     * Load manifest from file.
     */
    public static load(filePath: string): AssemblyManifest {
        const manifest: AssemblyManifest = JSON.parse(fs.readFileSync(filePath, 'UTF-8'));
        Manifest.patchStackTags(manifest);
        return manifest;
    }

    private static patchStackTags(manifest: AssemblyManifest) {
        if (manifest.artifacts) {
            for (const artifact of Object.values(manifest.artifacts)) {
                if (artifact.type === ArtifactType.AWS_CLOUDFORMATION_STACK) {
                    if (artifact.metadata) {
                        for (const metaentry of Object.values(artifact.metadata)) {
                            for (const metadata of metaentry) {
                                if (metadata.type === ArtifactMetadataEntryType.STACK_TAGS && metadata.data) {
                                    const fixedTags = new Array<Tag>();
                                    for (const tag of metadata.data as any[]) {
                                        fixedTags.push({ key: tag.Key, value: tag.Value });
                                    }
                                    Object.assign(metadata.data, fixedTags);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private constructor() {}

}
