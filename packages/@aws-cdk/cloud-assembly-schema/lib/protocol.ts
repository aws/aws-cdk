import * as fs from 'fs';
import { Schema, Validator } from 'jsonschema';
import { ArtifactMetadataEntryType, ArtifactType, AssemblyManifest } from './assembly-manifest';

/**
 * Protocol utility class.
 */
export class Manifest {

    /**
     * Save manifest to file.
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
        const raw = JSON.parse(fs.readFileSync(filePath, 'UTF-8'));
        const manifest: AssemblyManifest = Manifest.validate(raw);
        Manifest.patchStackTags(manifest);
        return manifest;
    }

    private static schema: Schema = require('../schema/cloud-assembly.schema.json');

    private static validate(manifest: any) {
        const validator = new Validator();
        const result = validator.validate(manifest, Manifest.schema, {
            // nestedErrors does exist but is not in the TypeScript definitions
            nestedErrors: true
        } as any);
        if (result.valid) { return manifest; }
        throw new Error(`Invalid assembly manifest:\n${result}`);
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
    private static patchStackTags(manifest: AssemblyManifest) {
        for (const artifact of Object.values(manifest.artifacts || [])) {
            if (artifact.type === ArtifactType.AWS_CLOUDFORMATION_STACK) {
                for (const metadataEntries of Object.values(artifact.metadata || [])) {
                    for (const metadataEntry of metadataEntries) {
                        if (metadataEntry.type === ArtifactMetadataEntryType.STACK_TAGS && metadataEntry.data) {
                            Object.assign(metadataEntry.data, (metadataEntry.data as any[]).map(t => {
                                return { key: t.Key, value: t.Value };
                             }));
                        }
                    }
                }
            }
        }
    }

    private constructor() {}

}
