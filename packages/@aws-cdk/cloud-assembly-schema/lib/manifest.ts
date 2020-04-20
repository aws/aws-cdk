import * as fs from 'fs';
import * as jsonschema from 'jsonschema';
import * as semver from 'semver';
import * as assembly from './schema';

// this prefix is used by the CLI to identify this specific error.
// in which case we want to instruct the user to upgrade his CLI.
// see exec.ts#createAssembly
export const VERSION_MISMATCH: string = 'Cloud assembly schema version mismatch';

/**
 * Protocol utility class.
 */
export class Manifest {
  /**
   * Save manifest to file.
   *
   * @param manifest - manifest.
   */
  public static save(manifest: assembly.AssemblyManifest, filePath: string) {
    fs.writeFileSync(filePath, JSON.stringify(manifest, undefined, 2));
  }

  /**
   * Load manifest from file.
   *
   * @param filePath - path to the manifest file.
   */
  public static load(filePath: string): assembly.AssemblyManifest {
    const raw: assembly.AssemblyManifest = JSON.parse(fs.readFileSync(filePath, 'UTF-8'));
    Manifest.patchStackTags(raw);
    Manifest.validate(raw);
    return raw;
  }

  /**
   * Fetch the current schema version number.
   */
  public static version(): string {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('../schema/cloud-assembly.version.json').version;
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  private static schema: jsonschema.Schema = require('../schema/cloud-assembly.schema.json');

  private static validate(manifest: assembly.AssemblyManifest) {

    function parseVersion(version: string) {
      const ver = semver.valid(version);
      if (!ver) {
        throw new Error(`Invalid semver string: "${version}"`);
      }
      return ver;
    }

    const maxSupported = parseVersion(Manifest.version());
    const actual = parseVersion(manifest.version);

    // first validate the version should be accepted.
    if (semver.gt(actual, maxSupported)) {
      // we use a well known error prefix so that the CLI can identify this specific error
      // and print some more context to the user.
      throw new Error(`${VERSION_MISMATCH}: Maximum schema version supported is ${maxSupported}, but found ${actual}`);
    }

    // now validate the format is good.
    const validator = new jsonschema.Validator();
    const result = validator.validate(manifest, Manifest.schema, {

      // does exist but is not in the TypeScript definitions
      nestedErrors: true,

      allowUnknownAttributes: false,

    } as any);
    if (!result.valid) {
      throw new Error(`Invalid assembly manifest:\n${result}`);
    }

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
  private static patchStackTags(manifest: assembly.AssemblyManifest) {
    for (const artifact of Object.values(manifest.artifacts || [])) {
      if (artifact.type === assembly.ArtifactType.AWS_CLOUDFORMATION_STACK) {
        for (const metadataEntries of Object.values(artifact.metadata || [])) {
          for (const metadataEntry of metadataEntries) {
            if (metadataEntry.type === assembly.ArtifactMetadataEntryType.STACK_TAGS && metadataEntry.data) {

              const metadataAny = metadataEntry as any;

              metadataAny.data = metadataAny.data.map((t: any) => {
                return { key: t.Key, value: t.Value };
              });
            }
          }
        }
      }
    }
  }

  private constructor() {}

}
