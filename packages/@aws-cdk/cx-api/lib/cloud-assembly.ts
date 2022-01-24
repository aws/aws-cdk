import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { Environment, EnvironmentUtils } from './environment';
import { MetadataEntryResult, SynthesisMessage, SynthesisMessageLevel } from './metadata';
import { topologicalSort } from './toposort';

/**
 * The name of the root manifest file of the assembly.
 */
const MANIFEST_FILE = 'manifest.json';

/**
 * Represents a deployable cloud application.
 */
export class CloudAssembly {
  /**
   * The root directory of the cloud assembly.
   */
  public readonly directory: string;

  /**
   * The schema version of the assembly manifest.
   */
  public readonly version: string;

  /**
   * All artifacts included in this assembly.
   */
  public readonly artifacts: CloudArtifact[];

  /**
   * Runtime information such as module versions used to synthesize this assembly.
   */
  public readonly runtime: cxschema.RuntimeInfo;

  /**
   * The raw assembly manifest.
   */
  public readonly manifest: cxschema.AssemblyManifest;

  /**
   * Reads a cloud assembly from the specified directory.
   * @param directory The root directory of the assembly.
   */
  constructor(directory: string) {
    this.directory = directory;

    this.manifest = cxschema.Manifest.loadAssemblyManifest(path.join(directory, MANIFEST_FILE));
    this.version = this.manifest.version;
    this.artifacts = this.renderArtifacts();
    this.runtime = this.manifest.runtime || { libraries: { } };

    // force validation of deps by accessing 'depends' on all artifacts
    this.validateDeps();
  }

  /**
   * Attempts to find an artifact with a specific identity.
   * @returns A `CloudArtifact` object or `undefined` if the artifact does not exist in this assembly.
   * @param id The artifact ID
   */
  public tryGetArtifact(id: string): CloudArtifact | undefined {
    return this.artifacts.find(a => a.id === id);
  }

  /**
   * Returns a CloudFormation stack artifact from this assembly.
   *
   * Will only search the current assembly.
   *
   * @param stackName the name of the CloudFormation stack.
   * @throws if there is no stack artifact by that name
   * @throws if there is more than one stack with the same stack name. You can
   * use `getStackArtifact(stack.artifactId)` instead.
   * @returns a `CloudFormationStackArtifact` object.
   */
  public getStackByName(stackName: string): CloudFormationStackArtifact {
    const artifacts = this.artifacts.filter(a => a instanceof CloudFormationStackArtifact && a.stackName === stackName);
    if (!artifacts || artifacts.length === 0) {
      throw new Error(`Unable to find stack with stack name "${stackName}"`);
    }

    if (artifacts.length > 1) {
      // eslint-disable-next-line max-len
      throw new Error(`There are multiple stacks with the stack name "${stackName}" (${artifacts.map(a => a.id).join(',')}). Use "getStackArtifact(id)" instead`);
    }

    return artifacts[0] as CloudFormationStackArtifact;
  }

  /**
   * Returns a CloudFormation stack artifact by name from this assembly.
   * @deprecated renamed to `getStackByName` (or `getStackArtifact(id)`)
   */
  public getStack(stackName: string) {
    return this.getStackByName(stackName);
  }

  /**
   * Returns a CloudFormation stack artifact from this assembly.
   *
   * @param artifactId the artifact id of the stack (can be obtained through `stack.artifactId`).
   * @throws if there is no stack artifact with that id
   * @returns a `CloudFormationStackArtifact` object.
   */
  public getStackArtifact(artifactId: string): CloudFormationStackArtifact {
    const artifact = this.tryGetArtifactRecursively(artifactId);

    if (!artifact) {
      throw new Error(`Unable to find artifact with id "${artifactId}"`);
    }

    if (!(artifact instanceof CloudFormationStackArtifact)) {
      throw new Error(`Artifact ${artifactId} is not a CloudFormation stack`);
    }

    return artifact;
  }

  private tryGetArtifactRecursively(artifactId: string): CloudArtifact | undefined {
    return this.stacksRecursively.find(a => a.id === artifactId);
  }

  /**
   * Returns all the stacks, including the ones in nested assemblies
   */
  public get stacksRecursively(): CloudFormationStackArtifact[] {
    function search(stackArtifacts: CloudFormationStackArtifact[], assemblies: CloudAssembly[]): CloudFormationStackArtifact[] {
      if (assemblies.length === 0) {
        return stackArtifacts;
      }

      const [head, ...tail] = assemblies;
      const nestedAssemblies = head.nestedAssemblies.map(asm => asm.nestedAssembly);
      return search(stackArtifacts.concat(head.stacks), tail.concat(nestedAssemblies));
    };

    return search([], [this]);
  }

  /**
   * Returns a nested assembly artifact.
   *
   * @param artifactId The artifact ID of the nested assembly
   */
  public getNestedAssemblyArtifact(artifactId: string): NestedCloudAssemblyArtifact {
    const artifact = this.tryGetArtifact(artifactId);
    if (!artifact) {
      throw new Error(`Unable to find artifact with id "${artifactId}"`);
    }

    if (!(artifact instanceof NestedCloudAssemblyArtifact)) {
      throw new Error(`Found artifact '${artifactId}' but it's not a nested cloud assembly`);
    }

    return artifact;
  }

  /**
   * Returns a nested assembly.
   *
   * @param artifactId The artifact ID of the nested assembly
   */
  public getNestedAssembly(artifactId: string): CloudAssembly {
    return this.getNestedAssemblyArtifact(artifactId).nestedAssembly;
  }

  /**
   * Returns the tree metadata artifact from this assembly.
   * @throws if there is no metadata artifact by that name
   * @returns a `TreeCloudArtifact` object if there is one defined in the manifest, `undefined` otherwise.
   */
  public tree(): TreeCloudArtifact | undefined {
    const trees = this.artifacts.filter(a => a.manifest.type === cxschema.ArtifactType.CDK_TREE);
    if (trees.length === 0) {
      return undefined;
    } else if (trees.length > 1) {
      throw new Error(`Multiple artifacts of type ${cxschema.ArtifactType.CDK_TREE} found in manifest`);
    }
    const tree = trees[0];

    if (!(tree instanceof TreeCloudArtifact)) {
      throw new Error('"Tree" artifact is not of expected type');
    }

    return tree;
  }

  /**
   * @returns all the CloudFormation stack artifacts that are included in this assembly.
   */
  public get stacks(): CloudFormationStackArtifact[] {
    return this.artifacts.filter(isCloudFormationStackArtifact);

    function isCloudFormationStackArtifact(x: any): x is CloudFormationStackArtifact {
      return x instanceof CloudFormationStackArtifact;
    }
  }

  /**
   * The nested assembly artifacts in this assembly
   */
  public get nestedAssemblies(): NestedCloudAssemblyArtifact[] {
    return this.artifacts.filter(isNestedCloudAssemblyArtifact);

    function isNestedCloudAssemblyArtifact(x: any): x is NestedCloudAssemblyArtifact {
      return x instanceof NestedCloudAssemblyArtifact;
    }
  }

  private validateDeps() {
    for (const artifact of this.artifacts) {
      ignore(artifact.dependencies);
    }
  }

  private renderArtifacts() {
    const result = new Array<CloudArtifact>();
    for (const [name, artifact] of Object.entries(this.manifest.artifacts || { })) {
      const cloudartifact = CloudArtifact.fromManifest(this, name, artifact);
      if (cloudartifact) {
        result.push(cloudartifact);
      }
    }

    return topologicalSort(result, x => x.id, x => x._dependencyIDs);
  }
}

/**
 * Construction properties for CloudAssemblyBuilder
 */
export interface CloudAssemblyBuilderProps {
  /**
   * Use the given asset output directory
   *
   * @default - Same as the manifest outdir
   */
  readonly assetOutdir?: string;

  /**
   * If this builder is for a nested assembly, the parent assembly builder
   *
   * @default - This is a root assembly
   */
  readonly parentBuilder?: CloudAssemblyBuilder;
}

/**
 * Can be used to build a cloud assembly.
 */
export class CloudAssemblyBuilder {
  /**
   * The root directory of the resulting cloud assembly.
   */
  public readonly outdir: string;

  /**
   * The directory where assets of this Cloud Assembly should be stored
   */
  public readonly assetOutdir: string;

  private readonly artifacts: { [id: string]: cxschema.ArtifactManifest } = { };
  private readonly missing = new Array<cxschema.MissingContext>();
  private readonly parentBuilder?: CloudAssemblyBuilder;

  /**
   * Initializes a cloud assembly builder.
   * @param outdir The output directory, uses temporary directory if undefined
   */
  constructor(outdir?: string, props: CloudAssemblyBuilderProps = {}) {
    this.outdir = determineOutputDirectory(outdir);
    this.assetOutdir = props.assetOutdir ?? this.outdir;
    this.parentBuilder = props.parentBuilder;

    // we leverage the fact that outdir is long-lived to avoid staging assets into it
    // that were already staged (copying can be expensive). this is achieved by the fact
    // that assets use a source hash as their name. other artifacts, and the manifest itself,
    // will overwrite existing files as needed.
    ensureDirSync(this.outdir);
  }

  /**
   * Adds an artifact into the cloud assembly.
   * @param id The ID of the artifact.
   * @param manifest The artifact manifest
   */
  public addArtifact(id: string, manifest: cxschema.ArtifactManifest) {
    this.artifacts[id] = filterUndefined(manifest);
  }

  /**
   * Reports that some context is missing in order for this cloud assembly to be fully synthesized.
   * @param missing Missing context information.
   */
  public addMissing(missing: cxschema.MissingContext) {
    if (this.missing.every(m => m.key !== missing.key)) {
      this.missing.push(missing);
    }
    // Also report in parent
    this.parentBuilder?.addMissing(missing);
  }

  /**
   * Finalizes the cloud assembly into the output directory returns a
   * `CloudAssembly` object that can be used to inspect the assembly.
   * @param options
   */
  public buildAssembly(options: AssemblyBuildOptions = { }): CloudAssembly {

    // explicitly initializing this type will help us detect
    // breaking changes. (For example adding a required property will break compilation).
    let manifest: cxschema.AssemblyManifest = {
      version: cxschema.Manifest.version(),
      artifacts: this.artifacts,
      runtime: options.runtimeInfo,
      missing: this.missing.length > 0 ? this.missing : undefined,
    };

    // now we can filter
    manifest = filterUndefined(manifest);

    const manifestFilePath = path.join(this.outdir, MANIFEST_FILE);
    cxschema.Manifest.saveAssemblyManifest(manifest, manifestFilePath);

    // "backwards compatibility": in order for the old CLI to tell the user they
    // need a new version, we'll emit the legacy manifest with only "version".
    // this will result in an error "CDK Toolkit >= CLOUD_ASSEMBLY_VERSION is required in order to interact with this program."
    fs.writeFileSync(path.join(this.outdir, 'cdk.out'), JSON.stringify({ version: manifest.version }));

    return new CloudAssembly(this.outdir);
  }

  /**
   * Creates a nested cloud assembly
   */
  public createNestedAssembly(artifactId: string, displayName: string) {
    const directoryName = artifactId;
    const innerAsmDir = path.join(this.outdir, directoryName);

    this.addArtifact(artifactId, {
      type: cxschema.ArtifactType.NESTED_CLOUD_ASSEMBLY,
      properties: {
        directoryName,
        displayName,
      } as cxschema.NestedCloudAssemblyProperties,
    });

    return new CloudAssemblyBuilder(innerAsmDir, {
      // Reuse the same asset output directory as the current Casm builder
      assetOutdir: this.assetOutdir,
      parentBuilder: this,
    });
  }
}

/**
 * Backwards compatibility for when `RuntimeInfo`
 * was defined here. This is necessary because its used as an input in the stable
 * @aws-cdk/core library.
 *
 * @deprecated moved to package 'cloud-assembly-schema'
 * @see core.ConstructNode.synth
 */
export interface RuntimeInfo extends cxschema.RuntimeInfo {

}

/**
 * Backwards compatibility for when `MetadataEntry`
 * was defined here. This is necessary because its used as an input in the stable
 * @aws-cdk/core library.
 *
 * @deprecated moved to package 'cloud-assembly-schema'
 * @see core.ConstructNode.metadata
 */
export interface MetadataEntry extends cxschema.MetadataEntry {

}

/**
 * Backwards compatibility for when `MissingContext`
 * was defined here. This is necessary because its used as an input in the stable
 * @aws-cdk/core library.
 *
 * @deprecated moved to package 'cloud-assembly-schema'
 * @see core.Stack.reportMissingContext
 */
export interface MissingContext {
  /**
   * The missing context key.
   */
  readonly key: string;

  /**
   * The provider from which we expect this context key to be obtained.
   *
   * (This is the old untyped definition, which is necessary for backwards compatibility.
   * See cxschema for a type definition.)
   */
  readonly provider: string;

  /**
   * A set of provider-specific options.
   *
   * (This is the old untyped definition, which is necessary for backwards compatibility.
   * See cxschema for a type definition.)
   */
  readonly props: Record<string, any>;
}

export interface AssemblyBuildOptions {
  /**
   * Include the specified runtime information (module versions) in manifest.
   * @default - if this option is not specified, runtime info will not be included
   * @deprecated All template modifications that should result from this should
   * have already been inserted into the template.
   */
  readonly runtimeInfo?: RuntimeInfo;
}

/**
 * Returns a copy of `obj` without undefined values in maps or arrays.
 */
function filterUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.filter(x => x !== undefined).map(x => filterUndefined(x));
  }

  if (typeof(obj) === 'object') {
    const ret: any = { };
    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined) {
        continue;
      }
      ret[key] = filterUndefined(value);
    }
    return ret;
  }

  return obj;
}

function ignore(_x: any) {
  return;
}

/**
 * Turn the given optional output directory into a fixed output directory
 */
function determineOutputDirectory(outdir?: string) {
  return outdir ?? fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'cdk.out'));
}

function ensureDirSync(dir: string) {
  if (fs.existsSync(dir)) {
    if (!fs.statSync(dir).isDirectory()) {
      throw new Error(`${dir} must be a directory`);
    }
  } else {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Represents an artifact within a cloud assembly.
 */
export class CloudArtifact {
  /**
   * Returns a subclass of `CloudArtifact` based on the artifact type defined in the artifact manifest.
   * @param assembly The cloud assembly from which to load the artifact
   * @param id The artifact ID
   * @param artifact The artifact manifest
   * @returns the `CloudArtifact` that matches the artifact type or `undefined` if it's an artifact type that is unrecognized by this module.
   */
  public static fromManifest(assembly: CloudAssembly, id: string, artifact: cxschema.ArtifactManifest): CloudArtifact | undefined {
    switch (artifact.type) {
      case cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK:
        return new CloudFormationStackArtifact(assembly, id, artifact);
      case cxschema.ArtifactType.CDK_TREE:
        return new TreeCloudArtifact(assembly, id, artifact);
      case cxschema.ArtifactType.ASSET_MANIFEST:
        return new AssetManifestArtifact(assembly, id, artifact);
      case cxschema.ArtifactType.NESTED_CLOUD_ASSEMBLY:
        return new NestedCloudAssemblyArtifact(assembly, id, artifact);
      default:
        return undefined;
    }
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
    for (const p of Object.keys(this.manifest.metadata || {})) {
      for (const entry of (this.manifest.metadata || {})[p]) {
        if (entry.type === type) {
          result.push({ path: p, ...entry });
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

/**
 * Asset manifest is a description of a set of assets which need to be built and published
 */
export class AssetManifestArtifact extends CloudArtifact {
  /**
   * The file name of the asset manifest
   */
  public readonly file: string;

  /**
   * Version of bootstrap stack required to deploy this stack
   */
  public readonly requiresBootstrapStackVersion: number;

  /**
   * Name of SSM parameter with bootstrap stack version
   *
   * @default - Discover SSM parameter by reading stack
   */
  public readonly bootstrapStackVersionSsmParameter?: string;

  constructor(assembly: CloudAssembly, name: string, artifact: cxschema.ArtifactManifest) {
    super(assembly, name, artifact);

    const properties = (this.manifest.properties || {}) as cxschema.AssetManifestProperties;
    if (!properties.file) {
      throw new Error('Invalid AssetManifestArtifact. Missing "file" property');
    }
    this.file = path.resolve(this.assembly.directory, properties.file);
    this.requiresBootstrapStackVersion = properties.requiresBootstrapStackVersion ?? 1;
    this.bootstrapStackVersionSsmParameter = properties.bootstrapStackVersionSsmParameter;
  }
}

export class CloudFormationStackArtifact extends CloudArtifact {
  /**
   * The file name of the template.
   */
  public readonly templateFile: string;

  /**
   * The original name as defined in the CDK app.
   */
  public readonly originalName: string;

  /**
   * Any assets associated with this stack.
   */
  public readonly assets: cxschema.AssetMetadataEntry[];

  /**
   * CloudFormation parameters to pass to the stack.
   */
  public readonly parameters: { [id: string]: string };

  /**
   * CloudFormation tags to pass to the stack.
   */
  public readonly tags: { [id: string]: string };

  /**
   * The physical name of this stack.
   */
  public readonly stackName: string;

  /**
   * A string that represents this stack. Should only be used in user interfaces.
   * If the stackName and artifactId are the same, it will just return that. Otherwise,
   * it will return something like "<artifactId> (<stackName>)"
   */
  public readonly displayName: string;

  /**
   * The physical name of this stack.
   * @deprecated renamed to `stackName`
   */
  public readonly name: string;

  /**
   * The environment into which to deploy this artifact.
   */
  public readonly environment: Environment;

  /**
   * The role that needs to be assumed to deploy the stack
   *
   * @default - No role is assumed (current credentials are used)
   */
  public readonly assumeRoleArn?: string;

  /**
   * External ID to use when assuming role for cloudformation deployments
   *
   * @default - No external ID
   */
  readonly assumeRoleExternalId?: string;

  /**
   * The role that is passed to CloudFormation to execute the change set
   *
   * @default - No role is passed (currently assumed role/credentials are used)
   */
  public readonly cloudFormationExecutionRoleArn?: string;

  /**
   * The role to use to look up values from the target AWS account
   *
   * @default - No role is assumed (current credentials are used)
   */
  public readonly lookupRole?: cxschema.BootstrapRole;

  /**
   * If the stack template has already been included in the asset manifest, its asset URL
   *
   * @default - Not uploaded yet, upload just before deploying
   */
  public readonly stackTemplateAssetObjectUrl?: string;

  /**
   * Version of bootstrap stack required to deploy this stack
   *
   * @default - No bootstrap stack required
   */
  public readonly requiresBootstrapStackVersion?: number;

  /**
   * Name of SSM parameter with bootstrap stack version
   *
   * @default - Discover SSM parameter by reading stack
   */
  public readonly bootstrapStackVersionSsmParameter?: string;

  /**
   * Whether termination protection is enabled for this stack.
   */
  public readonly terminationProtection?: boolean;

  /**
   * Whether this stack should be validated by the CLI after synthesis
   *
   * @default - false
   */
  public readonly validateOnSynth?: boolean;

  private _template: any | undefined;

  constructor(assembly: CloudAssembly, artifactId: string, artifact: cxschema.ArtifactManifest) {
    super(assembly, artifactId, artifact);

    const properties = (this.manifest.properties || {}) as cxschema.AwsCloudFormationStackProperties;
    if (!properties.templateFile) {
      throw new Error('Invalid CloudFormation stack artifact. Missing "templateFile" property in cloud assembly manifest');
    }
    if (!artifact.environment) {
      throw new Error('Invalid CloudFormation stack artifact. Missing environment');
    }
    this.environment = EnvironmentUtils.parse(artifact.environment);
    this.templateFile = properties.templateFile;
    this.parameters = properties.parameters ?? {};

    // We get the tags from 'properties' if available (cloud assembly format >= 6.0.0), otherwise
    // from the stack metadata
    this.tags = properties.tags ?? this.tagsFromMetadata();
    this.assumeRoleArn = properties.assumeRoleArn;
    this.assumeRoleExternalId = properties.assumeRoleExternalId;
    this.cloudFormationExecutionRoleArn = properties.cloudFormationExecutionRoleArn;
    this.stackTemplateAssetObjectUrl = properties.stackTemplateAssetObjectUrl;
    this.requiresBootstrapStackVersion = properties.requiresBootstrapStackVersion;
    this.bootstrapStackVersionSsmParameter = properties.bootstrapStackVersionSsmParameter;
    this.terminationProtection = properties.terminationProtection;
    this.validateOnSynth = properties.validateOnSynth;
    this.lookupRole = properties.lookupRole;

    this.stackName = properties.stackName || artifactId;
    this.assets = this.findMetadataByType(cxschema.ArtifactMetadataEntryType.ASSET).map(e => e.data as cxschema.AssetMetadataEntry);

    this.displayName = this.stackName === artifactId
      ? this.stackName
      : `${artifactId} (${this.stackName})`;

    this.name = this.stackName; // backwards compat
    this.originalName = this.stackName;
  }

  /**
   * Full path to the template file
   */
  public get templateFullPath() {
    return path.join(this.assembly.directory, this.templateFile);
  }

  /**
   * The CloudFormation template for this stack.
   */
  public get template(): any {
    if (this._template === undefined) {
      this._template = JSON.parse(fs.readFileSync(this.templateFullPath, 'utf-8'));
    }
    return this._template;
  }

  private tagsFromMetadata() {
    const ret: Record<string, string> = {};
    for (const metadataEntry of this.findMetadataByType(cxschema.ArtifactMetadataEntryType.STACK_TAGS)) {
      for (const tag of (metadataEntry.data ?? []) as cxschema.StackTagsMetadataEntry) {
        ret[tag.key] = tag.value;
      }
    }
    return ret;
  }
}

/**
 * Asset manifest is a description of a set of assets which need to be built and published
 */
export class NestedCloudAssemblyArtifact extends CloudArtifact {
  /**
   * The relative directory name of the asset manifest
   */
  public readonly directoryName: string;

  /**
   * Display name
   */
  public readonly displayName: string;

  /**
   * Cache for the inner assembly loading
   */
  private _nestedAssembly?: CloudAssembly;

  constructor(assembly: CloudAssembly, name: string, artifact: cxschema.ArtifactManifest) {
    super(assembly, name, artifact);

    const properties = (this.manifest.properties || {}) as cxschema.NestedCloudAssemblyProperties;
    this.directoryName = properties.directoryName;
    this.displayName = properties.displayName ?? name;
  }

  /**
   * Full path to the nested assembly directory
   */
  public get fullPath(): string {
    return path.join(this.assembly.directory, this.directoryName);
  }

  /**
   * The nested Assembly
   */
  public get nestedAssembly(): CloudAssembly {
    if (!this._nestedAssembly) {
      this._nestedAssembly = new CloudAssembly(this.fullPath);
    }
    return this._nestedAssembly;
  }
}

export class TreeCloudArtifact extends CloudArtifact {
  public readonly file: string;

  constructor(assembly: CloudAssembly, name: string, artifact: cxschema.ArtifactManifest) {
    super(assembly, name, artifact);

    const properties = (this.manifest.properties || {}) as cxschema.TreeArtifactProperties;
    if (!properties.file) {
      throw new Error('Invalid TreeCloudArtifact. Missing "file" property');
    }
    this.file = properties.file;
  }
}