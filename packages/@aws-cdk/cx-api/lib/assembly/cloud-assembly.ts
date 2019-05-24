import fs = require('fs');
import path = require('path');
import semver = require('semver');
import { AppRuntime, AssemblyManifest, MANIFEST_FILE, MissingContext, PROTO_RESPONSE_VERSION } from '../cxapi';
import { CloudArtifact } from './cloud-artifact';
import { ICloudArtifact, ICloudAssembly, ICloudFormationStackArtifact } from './cloud-assembly-api';
import { CloudFormationStackArtifact } from './cloudformation-stack';
import { topologicalSort } from './toposort';

export class CloudAssembly implements ICloudAssembly {
  public readonly artifacts: ICloudArtifact[];
  public readonly version: string;
  public readonly missing?: { [key: string]: MissingContext };
  public readonly runtime: AppRuntime;

  private readonly manifest: AssemblyManifest;

  constructor(public readonly directory: string) {
    this.manifest = this.readJson(MANIFEST_FILE);

    this.version = this.manifest.version;
    verifyManifestVersion(this.manifest.version);

    this.artifacts = this.renderArtifacts();
    this.missing = this.renderMissing();
    this.runtime = this.manifest.runtime || { libraries: { } };

    // force validation of deps by accessing 'depends' on all artifacts
    this.validateDeps();
  }

  public readJson(filePath: string) {
    return JSON.parse(fs.readFileSync(path.join(this.directory, filePath), 'utf-8'));
  }

  public get stacks(): ICloudFormationStackArtifact[] {
    const result = new Array<ICloudFormationStackArtifact>();
    for (const a of this.artifacts) {
      if (a instanceof CloudFormationStackArtifact) {
        result.push(a);
      }
    }
    return result;
  }

  private validateDeps() {
    for (const artifact of this.artifacts) {
      ignore(artifact.depends);
    }
  }

  private renderArtifacts() {
    const result = new Array<CloudArtifact>();
    for (const [ name, artifact ] of Object.entries(this.manifest.artifacts || { })) {
      result.push(CloudArtifact.from(this, name, artifact));
    }

    return topologicalSort(result, x => x.id, x => x.dependsIDs);
  }

  private renderMissing() {
    const missing: { [key: string]: MissingContext } = { };
    for (const artifact of this.artifacts) {
      for (const [ key, m ] of Object.entries(artifact.missing)) {
        missing[key] = m;
      }
    }

    return Object.keys(missing).length > 0 ? missing : undefined;
  }
}

/**
 * Look at the type of response we get and upgrade it to the latest expected version
 */
function verifyManifestVersion(version?: string) {
  if (!version) {
    // tslint:disable-next-line:max-line-length
    throw new Error(`CDK Framework >= ${PROTO_RESPONSE_VERSION} is required in order to interact with this version of the Toolkit.`);
  }

  const frameworkVersion = semver.coerce(version);
  const toolkitVersion = semver.coerce(PROTO_RESPONSE_VERSION);

  // Should not happen, but I don't trust this library 100% either, so let's check for it to be safe
  if (!frameworkVersion || !toolkitVersion) { throw new Error('SemVer library could not parse versions'); }

  if (semver.gt(frameworkVersion, toolkitVersion)) {
    throw new Error(`CDK Toolkit >= ${version} is required in order to interact with this program.`);
  }

  if (semver.lt(frameworkVersion, toolkitVersion)) {
    // Toolkit protocol is newer than the framework version, and we KNOW the
    // version. This is a scenario in which we could potentially do some
    // upgrading of the response in the future.
    //
    // For now though, we simply reject old responses.
    throw new Error(`Cloud assembly created by CDK version ${frameworkVersion} but it must be >= ${PROTO_RESPONSE_VERSION} ` +
      `in order to interact with this version of the toolkit (${toolkitVersion}).`);
  }
}

function ignore(_x: any) {
  return;
}