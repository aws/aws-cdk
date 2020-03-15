import * as fs from 'fs';
import { AssemblyManifest, Tag } from './assembly-manifest';

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
        return JSON.parse(fs.readFileSync(filePath, 'UTF-8'));
    }

    /**
     * Transform CX Protocol tags to CloudFormation tags.
     *
     * CX Protocol tag properties must be camelCase according to JSII.
     * But CloudFormation needs them to be PascalCased.
     *
     * @param tags CX Protocol tags.
     */
    public static toCloudFormationTags(tags: Tag[]) {
        return tags.map(t => {
            return { Key: t.key, Value: t.value };
        });
    }

    private constructor() {}

}
