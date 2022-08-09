import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import type { CloudAssembly } from './cloud-assembly';
import { MetadataEntryResult, SynthesisMessage, SynthesisMessageLevel } from './metadata';

/**
 * Artifact properties for CloudFormation stacks.
 */
export interface AwsCloudFormationStackProperties {
  /**
   * A file relative to the assembly root which contains the CloudFormation template for this stack.
   */
  readonly templateFile: string;

  /**
   * Values for CloudFormation stack parameters that should be passed when the stack is deployed.
   */
  readonly parameters?: { [id: string]: string };

  /**
   * The name to use for the CloudFormation stack.
   * @default - name derived from artifact ID
   */
  readonly stackName?: string;

  /**
   * Whether to enable termination protection for this stack.
   *
   * @default false
   */
  readonly terminationProtection?: boolean;
}

/**
 * Represents an artifact within a cloud assembly.
 */
export class CloudArtifact {
  /**
   * Returns a subclass of `CloudArtifact` based on the artifact type defined in the artifact manifest.
   *
   * @param assembly The cloud assembly from which to load the artifact
   * @param id The artifact ID
   * @param artifact The artifact manifest
   * @returns the `CloudArtifact` that matches the artifact type or `undefined` if it's an artifact type that is unrecognized by this module.
   */
  public static fromManifest(assembly: CloudAssembly, id: string, artifact: cxschema.ArtifactManifest): CloudArtifact | undefined {
    // Implementation is defined in a separate file to break cyclic dependencies
    void(assembly), void(id), void(artifact);
    throw new Error('Implementation not overridden yet');
  }

  /**
   * The artifact's manifest
   */
  public readonly manifest: cxschema.ArtifactManifest;

  /**
   * The set of messages extracted from the artifact's metadata.
   */
  public readonly messages: SynthesisMessage[];

  /**
   * IDs of all dependencies. Used when topologically sorting the artifacts within the cloud assembly.
   * @internal
   */
  public readonly _dependencyIDs: string[];

  /**
   * Cache of resolved dependencies.
   */
  private _deps?: CloudArtifact[];

  protected constructor(public readonly assembly: CloudAssembly, public readonly id: string, manifest: cxschema.ArtifactManifest) {
    this.manifest = manifest;
    this.messages = this.renderMessages();
    this._dependencyIDs = manifest.dependencies || [];
  }

  /**
   * Returns all the artifacts that this artifact depends on.
   */
  public get dependencies(): CloudArtifact[] {
    if (this._deps) { return this._deps; }

    this._deps = this._dependencyIDs.map(id => {
      const dep = this.assembly.tryGetArtifact(id);
      if (!dep) {
        throw new Error(`Artifact ${this.id} depends on non-existing artifact ${id}`);
      }
      return dep;
    });

    return this._deps;
  }

  /**
   * @returns all the metadata entries of a specific type in this artifact.
   * @param type
   */
  public findMetadataByType(type: string): MetadataEntryResult[] {
    const result = new Array<MetadataEntryResult>();
    for (const path of Object.keys(this.manifest.metadata || {})) {
      for (const entry of (this.manifest.metadata || {})[path]) {
        if (entry.type === type) {
          result.push({ path, ...entry });
        }
      }
    }
    return result;
  }

  private renderMessages() {
    const messages = new Array<SynthesisMessage>();

    for (const [id, metadata] of Object.entries(this.manifest.metadata || { })) {
      for (const entry of metadata) {
        let level: SynthesisMessageLevel;
        switch (entry.type) {
          case cxschema.ArtifactMetadataEntryType.WARN:
            level = SynthesisMessageLevel.WARNING;
            break;
          case cxschema.ArtifactMetadataEntryType.ERROR:
            level = SynthesisMessageLevel.ERROR;
            break;
          case cxschema.ArtifactMetadataEntryType.INFO:
            level = SynthesisMessageLevel.INFO;
            break;
          default:
            continue;
        }

        messages.push({ level, entry, id });
      }
    }

    return messages;
  }

  /**
   * An identifier that shows where this artifact is located in the tree
   * of nested assemblies, based on their manifests. Defaults to the normal
   * id. Should only be used in user interfaces.
   */
  public get hierarchicalId(): string {
    return this.manifest.displayName ?? this.id;
  }
}
