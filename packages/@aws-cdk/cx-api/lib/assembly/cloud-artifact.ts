import { Artifact, ArtifactType } from '../artifacts';
import { ERROR_METADATA_KEY, INFO_METADATA_KEY, MetadataEntry, MissingContext, WARNING_METADATA_KEY } from '../cxapi';
import { CloudAssembly } from './cloud-assembly';
import { Environment, ICloudArtifact, SynthesisMessage, SynthesisMessageLevel } from './cloud-assembly-api';

const ENVIRONMENT_PARSER = /aws:\/\/([0-9a-z\-]+)\/([a-z\-0-9]+)/;

export class CloudArtifact implements ICloudArtifact {
  public static from(assembly: CloudAssembly, name: string, artifact: Artifact): CloudArtifact {
    switch (artifact.type) {
      case ArtifactType.AwsCloudFormationStack:
        return new CloudFormationStackArtifact(assembly, name, artifact);

      default:
        throw new Error(`unsupported artifact type: ${artifact.type}`);
    }
  }

  public readonly missing: { [key: string]: MissingContext };
  public readonly autoDeploy: boolean;
  public readonly messages: SynthesisMessage[];
  public readonly environment: Environment;
  public readonly metadata: { [path: string]: MetadataEntry[] };
  public readonly dependsIDs: string[];

  private _deps?: ICloudArtifact[]; // cache

  constructor(public readonly assembly: CloudAssembly, public readonly id: string, artifact: Artifact) {
    this.missing = artifact.missing || { };

    this.environment = parseEnvironment(artifact.environment, id);
    this.autoDeploy = artifact.autoDeploy === undefined ? true : artifact.autoDeploy;
    this.metadata = artifact.metadata || { };
    this.messages = this.renderMessages();
    this.dependsIDs = artifact.dependencies || [];
  }

  public get depends(): ICloudArtifact[] {
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

function parseEnvironment(environment: string, artifactId: string): Environment {
  const env = ENVIRONMENT_PARSER.exec(environment);
  if (!env) {
    throw new Error(
      `Unable to parse environment specification "${environment}" for artifact ${artifactId}. ` +
      `Expected format: aws://acount/region`);
  }

  const [ , account, region ] = env;
  if (!account || !region) {
    throw new Error(`Invalid environment specification: ${environment}`);
  }

  return { account, region, name: environment };
}

import { CloudFormationStackArtifact } from './cloudformation-stack';
