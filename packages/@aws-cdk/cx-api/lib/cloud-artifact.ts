import { CloudAssembly, MissingContext } from './cloud-assembly';
import { Environment, EnvironmentUtils } from './environment';
import { ERROR_METADATA_KEY, INFO_METADATA_KEY, MetadataEntry, SynthesisMessage, SynthesisMessageLevel, WARNING_METADATA_KEY } from './metadata';

export enum ArtifactType {
  None = 'none',
  AwsCloudFormationStack = 'aws:cloudformation:stack',
}

export interface Artifact {
  readonly type: ArtifactType;
  readonly environment: string; // format: aws://account/region
  readonly metadata?: { [path: string]: MetadataEntry[] };
  readonly dependencies?: string[];
  readonly missing?: { [key: string]: MissingContext };
  readonly properties?: { [name: string]: any };
  readonly autoDeploy?: boolean;
}

export interface AwsCloudFormationStackProperties {
  readonly templateFile: string;
  readonly parameters?: { [id: string]: string };
}

export class CloudArtifact {
  public static from(assembly: CloudAssembly, name: string, artifact: Artifact): CloudArtifact {
    switch (artifact.type) {
      case ArtifactType.AwsCloudFormationStack:
        return new CloudFormationStackArtifact(assembly, name, artifact);

      default:
        throw new Error(`unsupported artifact type: ${artifact.type}`);
    }
  }

  public readonly type: ArtifactType;
  public readonly missing: { [key: string]: MissingContext };
  public readonly autoDeploy: boolean;
  public readonly messages: SynthesisMessage[];
  public readonly environment: Environment;
  public readonly metadata: { [path: string]: MetadataEntry[] };
  public readonly dependsIDs: string[];
  public readonly properties: { [name: string]: any };

  private _deps?: CloudArtifact[]; // cache

  constructor(public readonly assembly: CloudAssembly, public readonly id: string, artifact: Artifact) {
    this.missing = artifact.missing || { };

    this.type = artifact.type;
    this.environment = EnvironmentUtils.parse(artifact.environment);
    this.autoDeploy = artifact.autoDeploy === undefined ? true : artifact.autoDeploy;
    this.metadata = artifact.metadata || { };
    this.messages = this.renderMessages();
    this.dependsIDs = artifact.dependencies || [];
    this.properties = artifact.properties || { };
  }

  public get depends(): CloudArtifact[] {
    if (this._deps) { return this._deps; }

    this._deps = this.dependsIDs.map(id => {
      const dep = this.assembly.artifacts.find(a => a.id === id);
      if (!dep) {
        throw new Error(`Artifact ${this.id} depends on non-existing artifact ${id}`);
      }
      return dep;
    });

    return this._deps;
  }

  private renderMessages() {
    const messages = new Array<SynthesisMessage>();

    for (const [ id, metadata ] of Object.entries(this.metadata)) {
      for (const entry of metadata) {
        let level: SynthesisMessageLevel;
        switch (entry.type) {
          case WARNING_METADATA_KEY:
            level = SynthesisMessageLevel.WARNING;
            break;
          case ERROR_METADATA_KEY:
            level = SynthesisMessageLevel.ERROR;
            break;
          case INFO_METADATA_KEY:
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
}

// needs to be defined at the end to avoid a cyclic dependency
import { CloudFormationStackArtifact } from './cloudformation-artifact';
