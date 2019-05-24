import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import os = require('os');
import path = require('path');
import { ConstructOrder, IConstruct } from './construct';
import { collectRuntimeInformation } from './runtime-info';
import { filterUndefined } from './util';

export interface ISynthesizable {
  synthesize(session: ISynthesisSession): void;
}

export interface ISynthesisSession {
  readonly outdir: string;
  readonly manifest: cxapi.AssemblyManifest;
  addArtifact(id: string, droplet: cxapi.Artifact): void;
  addBuildStep(id: string, step: cxapi.BuildStep): void;
  tryGetArtifact(id: string): cxapi.Artifact | undefined;
  getArtifact(id: string): cxapi.Artifact;
}

export interface SynthesisOptions extends ManifestOptions {
  /**
   * The file store used for this session.
   * @default - creates a temporary directory
   */
  readonly outdir?: string;

  /**
   * Whether synthesis should skip the validation phase.
   * @default false
   */
  readonly skipValidation?: boolean;
}

export class Synthesizer {
  public synthesize(root: IConstruct, options: SynthesisOptions = { }): ISynthesisSession {
    const session = new SynthesisSession(options);

    // the three holy phases of synthesis: prepare, validate and synthesize

    // prepare
    root.node.prepareTree();

    // validate
    const validate = options.skipValidation === undefined ? true : !options.skipValidation;
    if (validate) {
      const errors = root.node.validateTree();
      if (errors.length > 0) {
        const errorList = errors.map(e => `[${e.source.node.path}] ${e.message}`).join('\n  ');
        throw new Error(`Validation failed with the following errors:\n  ${errorList}`);
      }
    }

    // synthesize (leaves first)
    for (const c of root.node.findAll(ConstructOrder.PostOrder)) {
      if (SynthesisSession.isSynthesizable(c)) {
        c.synthesize(session);
      }
    }

    // write session manifest and lock store
    session.close(options);

    return session;
  }
}

export class SynthesisSession implements ISynthesisSession {
  /**
   * @returns true if `obj` implements `ISynthesizable`.
   */
  public static isSynthesizable(obj: any): obj is ISynthesizable {
    return 'synthesize' in obj;
  }

  public readonly outdir: string;

  private readonly artifacts: { [id: string]: cxapi.Artifact } = { };
  private readonly buildSteps: { [id: string]: cxapi.BuildStep } = { };
  private _manifest?: cxapi.AssemblyManifest;

  constructor(options: SynthesisOptions = { }) {
    this.outdir = options.outdir || fs.mkdtempSync(path.join(os.tmpdir(), 'cdk.out'));
    if (!fs.existsSync(this.outdir)) {
      fs.mkdirSync(this.outdir);
    }
  }

  public get manifest() {
    if (!this._manifest) {
      throw new Error(`Cannot read assembly manifest before the session has been finalized`);
    }

    return this._manifest;
  }

  public addArtifact(id: string, artifact: cxapi.Artifact): void {
    cxapi.validateArtifact(artifact);
    this.artifacts[id] = filterUndefined(artifact);
  }

  public tryGetArtifact(id: string): cxapi.Artifact | undefined {
    return this.artifacts[id];
  }

  public getArtifact(id: string): cxapi.Artifact {
    const artifact = this.tryGetArtifact(id);
    if (!artifact) {
      throw new Error(`Cannot find artifact ${id}`);
    }
    return artifact;
  }

  public addBuildStep(id: string, step: cxapi.BuildStep) {
    if (id in this.buildSteps) {
      throw new Error(`Build step ${id} already exists`);
    }
    this.buildSteps[id] = filterUndefined(step);
  }

  public close(options: ManifestOptions = { }): cxapi.AssemblyManifest {
    const legacyManifest = options.legacyManifest !== undefined ? options.legacyManifest : false;
    const runtimeInfo = options.runtimeInformation !== undefined ? options.runtimeInformation : true;

    const manifest: cxapi.AssemblyManifest = this._manifest = filterUndefined({
      version: cxapi.PROTO_RESPONSE_VERSION,
      artifacts: this.artifacts,
      runtime: runtimeInfo ? collectRuntimeInformation() : undefined
    });

    const manifestFilePath = path.join(this.outdir, cxapi.MANIFEST_FILE);
    fs.writeFileSync(manifestFilePath, JSON.stringify(manifest, undefined, 2));

    // write build manifest if we have build steps
    if (Object.keys(this.buildSteps).length > 0) {
      const buildManifest: cxapi.BuildManifest = {
        steps: this.buildSteps
      };

      const buildFilePath = path.join(this.outdir, cxapi.BUILD_FILE);
      fs.writeFileSync(buildFilePath, JSON.stringify(buildManifest, undefined, 2));
    }

    if (legacyManifest) {
      const legacy: cxapi.SynthesizeResponse = {
        ...manifest,
        stacks: renderLegacyStacks(manifest, this.outdir)
      };

      // render the legacy manifest (cdk.out) which also contains a "stacks" attribute with all the rendered stacks.
      const legacyManifestPath = path.join(this.outdir, cxapi.OUTFILE_NAME);
      fs.writeFileSync(legacyManifestPath, JSON.stringify(legacy, undefined, 2));
    }

    return manifest;
  }
}

export interface ManifestOptions {
  /**
   * Emit the legacy manifest (`cdk.out`) when the session is closed (alongside `manifest.json`).
   * @default false
   */
  readonly legacyManifest?: boolean;

  /**
   * Include runtime information (module versions) in manifest.
   * @default true
   */
  readonly runtimeInformation?: boolean;
}

export function renderLegacyStacks(manifest: cxapi.AssemblyManifest, outdir: string) {
  // special case for backwards compat. build a list of stacks for the manifest
  const stacks = new Array<cxapi.SynthesizedStack>();
  const artifacts = manifest.artifacts || { };

  for (const [ id, artifact ] of Object.entries(artifacts)) {
    if (artifact.type === cxapi.ArtifactType.AwsCloudFormationStack) {
      const templateFile = artifact.properties && artifact.properties.templateFile;
      if (!templateFile) {
        throw new Error(`Invalid cloudformation artifact. Missing "template" property`);
      }
      const templateFilePath = path.join(outdir, templateFile);
      const template = JSON.parse(fs.readFileSync(templateFilePath, 'utf-8'));

      const match = cxapi.AWS_ENV_REGEX.exec(artifact.environment);
      if (!match) {
        throw new Error(`"environment" must match regex: ${cxapi.AWS_ENV_REGEX}`);
      }

      stacks.push(filterUndefined({
        name: id,
        environment: { name: artifact.environment.substr('aws://'.length), account: match[1], region: match[2] },
        template,
        metadata: artifact.metadata || {},
        autoDeploy: artifact.autoDeploy,
        dependsOn: artifact.dependencies && artifact.dependencies.length > 0 ? artifact.dependencies : undefined,
        missing: artifact.missing
      }));
    }
  }

  return stacks;
}
