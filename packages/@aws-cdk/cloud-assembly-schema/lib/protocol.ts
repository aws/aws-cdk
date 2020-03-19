import * as fs from 'fs';
import { Schema, Validator } from 'jsonschema';
import { AssemblyManifest } from './assembly-manifest';

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
        const raw: AssemblyManifest = JSON.parse(fs.readFileSync(filePath, 'UTF-8'));
        const manifest: AssemblyManifest = Manifest.validate(raw);
        return manifest;
    }

    /**
     * Fetch the current schema version number.
     */
    public static version(): string {
        if (!Manifest.schema.id) {
            throw new Error("Invalid schema: missing id");
        }
        return Manifest.schema.id;
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    private static schema: Schema = require('../schema/cloud-assembly.schema.json');

    private static validate(manifest: any): AssemblyManifest {
        const validator = new Validator();
        const result = validator.validate(manifest, Manifest.schema, {

            // does exist but is not in the TypeScript definitions
            nestedErrors: true,

            allowUnknownAttributes: false

        } as any);
        if (result.valid) { return manifest; }
        throw new Error(`Invalid assembly manifest:\n${result}`);
    }

    private constructor() {}

}
