import * as path from 'path';
import * as semver from 'semver';
import { DockerImageAsset } from './docker-image-asset';
import { FileAsset } from './file-asset';
import { ManifestFile } from "./manifest-schema";
import { assertIsObject, expectKey, isMapOf, isObjectAnd, isString } from './private/schema-helpers';

// tslint:disable:no-var-requires
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PACKAGE_VERSION = require(path.join(__dirname, '..', 'package.json')).version;
// tslint:enable:no-var-requires

/**
 * Static class with loader routines
 *
 * This class mostly exists to put the schema structs into input position
 * (taken into a function), so that the jsii-diff checker will make sure all
 * structs are only allowed to be weakened in future updates. For example,
 * it is now allowed to add new required fields, since old CDK frameworks
 * would not be emitting those fields yet.
 *
 * At the same time, we might as well validate the structure so code doesn't
 * barf on invalid disk input.
 */
export class AssetManifestSchema {
  /**
   * Validate the given structured object as a valid ManifestFile schema
   */
  public static validate(file: any): asserts file is ManifestFile {
    const obj: unknown = file;

    if (typeof obj !== 'object' || obj === null) {
      throw new Error(`Expected object, got '${obj}`);
    }
    expectKey(obj, 'version', isString);

    // Current tool must be >= the version used to write the manifest
    // (disregarding MVs) which we can verify by ^-prefixing the file version.
    if (!semver.satisfies(AssetManifestSchema.currentVersion(), `^${obj.version}`)) {
      throw new Error(`Need CDK Tools >= '${obj.version}' to read this file (current is '${AssetManifestSchema.currentVersion()}')`);
    }

    expectKey(obj, 'files', isMapOf(isObjectAnd(isFileAsset)), true);
    expectKey(obj, 'dockerImages', isMapOf(isObjectAnd(isDockerImageAsset)), true);
  }

  /**
   * Take a ManifestFile as input
   *
   * The presence of this method makes sure the struct is only ever weakened
   * in future releases.
   */
  public static input(file: ManifestFile) {
    this.validate(file);
  }

  /**
   * Return the version of the schema module
   */
  public static currentVersion(): string {
    return PACKAGE_VERSION;
  }
}

function isFileAsset(entry: object): FileAsset {
  expectKey(entry, 'source', source => {
    assertIsObject(source);
    expectKey(source, 'path', isString);
    expectKey(source, 'packaging', isString, true);
    return source;
  });

  expectKey(entry, 'destinations', isMapOf(destination => {
    assertIsObject(destination);
    expectKey(destination, 'region', isString, true);
    expectKey(destination, 'assumeRoleArn', isString, true);
    expectKey(destination, 'assumeRoleExternalId', isString, true);
    expectKey(destination, 'bucketName', isString);
    expectKey(destination, 'objectKey', isString);
    return destination;
  }));

  return entry;
}

function isDockerImageAsset(entry: object): DockerImageAsset {
  expectKey(entry, 'source', source => {
    assertIsObject(source);
    expectKey(source, 'directory', isString);
    expectKey(source, 'dockerFile', isString, true);
    expectKey(source, 'dockerBuildTarget', isString, true);
    expectKey(source, 'dockerBuildArgs', isMapOf(isString), true);
    return source;
  });

  expectKey(entry, 'destinations', isMapOf(destination => {
    assertIsObject(destination);
    expectKey(destination, 'region', isString, true);
    expectKey(destination, 'assumeRoleArn', isString, true);
    expectKey(destination, 'assumeRoleExternalId', isString, true);
    expectKey(destination, 'repositoryName', isString);
    expectKey(destination, 'imageTag', isString);
    expectKey(destination, 'imageUri', isString);
    return destination;
  }));

  return entry;
}