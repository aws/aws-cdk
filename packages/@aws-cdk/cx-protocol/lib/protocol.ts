import * as fs from 'fs';
import { AssemblyManifest } from './assembly-manifest';

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

    private constructor() {}

}
