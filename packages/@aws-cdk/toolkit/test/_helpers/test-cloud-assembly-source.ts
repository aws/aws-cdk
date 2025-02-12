import * as fs from 'fs';
import * as path from 'path';
import { ArtifactType, ArtifactMetadataEntryType, AssetManifest, AssetMetadataEntry, AwsCloudFormationStackProperties, MetadataEntry, MissingContext } from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { ICloudAssemblySource } from '../../lib';

const DEFAULT_FAKE_TEMPLATE = { No: 'Resources' };
const SOME_RECENT_SCHEMA_VERSION = '30.0.0';

export interface TestStackArtifact {
  stackName: string;
  template?: any;
  env?: string;
  depends?: string[];
  metadata?: cxapi.StackMetadata;
  notificationArns?: string[];

  /** Old-style assets */
  assets?: AssetMetadataEntry[];
  properties?: Partial<AwsCloudFormationStackProperties>;
  terminationProtection?: boolean;
  displayName?: string;

  /** New-style assets */
  assetManifest?: AssetManifest;
}

export interface TestAssembly {
  stacks: TestStackArtifact[];
  missing?: MissingContext[];
  nestedAssemblies?: TestAssembly[];
  schemaVersion?: string;
}

export class TestCloudAssemblySource implements ICloudAssemblySource {
  mock: TestAssembly;

  constructor(mock: TestAssembly) {
    this.mock = mock;
  }

  public async produce(): Promise<cxapi.CloudAssembly> {
    return testAssembly(this.mock);
  }
}

function testAssembly(assembly: TestAssembly): cxapi.CloudAssembly {
  const builder = new cxapi.CloudAssemblyBuilder();
  addAttributes(assembly, builder);

  if (assembly.nestedAssemblies != null && assembly.nestedAssemblies.length > 0) {
    assembly.nestedAssemblies?.forEach((nestedAssembly: TestAssembly, i: number) => {
      const nestedAssemblyBuilder = builder.createNestedAssembly(`nested${i}`, `nested${i}`);
      addAttributes(nestedAssembly, nestedAssemblyBuilder);
      nestedAssemblyBuilder.buildAssembly();
    });
  }

  const asm = builder.buildAssembly();
  return cxapiAssemblyWithForcedVersion(asm, assembly.schemaVersion ?? SOME_RECENT_SCHEMA_VERSION);
}

function addAttributes(assembly: TestAssembly, builder: cxapi.CloudAssemblyBuilder) {
  for (const stack of assembly.stacks) {
    const templateFile = `${stack.stackName}.template.json`;
    const template = stack.template ?? DEFAULT_FAKE_TEMPLATE;
    fs.writeFileSync(path.join(builder.outdir, templateFile), JSON.stringify(template, undefined, 2));
    addNestedStacks(templateFile, builder.outdir, template);

    // we call patchStackTags here to simulate the tags formatter
    // that is used when building real manifest files.
    const metadata: { [path: string]: MetadataEntry[] } = patchStackTags({ ...stack.metadata });
    for (const asset of stack.assets || []) {
      metadata[asset.id] = [{ type: ArtifactMetadataEntryType.ASSET, data: asset }];
    }

    for (const missing of assembly.missing || []) {
      builder.addMissing(missing);
    }

    const dependencies = [...(stack.depends ?? [])];

    if (stack.assetManifest) {
      const manifestFile = `${stack.stackName}.assets.json`;
      fs.writeFileSync(path.join(builder.outdir, manifestFile), JSON.stringify(stack.assetManifest, undefined, 2));
      dependencies.push(`${stack.stackName}.assets`);
      builder.addArtifact(`${stack.stackName}.assets`, {
        type: ArtifactType.ASSET_MANIFEST,
        environment: stack.env || 'aws://123456789012/here',
        properties: {
          file: manifestFile,
        },
      });
    }

    builder.addArtifact(stack.stackName, {
      type: ArtifactType.AWS_CLOUDFORMATION_STACK,
      environment: stack.env || 'aws://123456789012/here',

      dependencies,
      metadata,
      properties: {
        ...stack.properties,
        templateFile,
        terminationProtection: stack.terminationProtection,
        notificationArns: stack.notificationArns,
      },
      displayName: stack.displayName,
    });
  }
}

function addNestedStacks(templatePath: string, outdir: string, rootStackTemplate?: any) {
  let template = rootStackTemplate;

  if (!template) {
    const templatePathWithDir = path.join('nested-stack-templates', templatePath);
    template = JSON.parse(fs.readFileSync(path.join(__dirname, templatePathWithDir)).toString());
    fs.writeFileSync(path.join(outdir, templatePath), JSON.stringify(template, undefined, 2));
  }

  for (const logicalId in template.Resources) {
    if (template.Resources[logicalId].Type === 'AWS::CloudFormation::Stack') {
      if (template.Resources[logicalId].Metadata && template.Resources[logicalId].Metadata['aws:asset:path']) {
        const nestedTemplatePath = template.Resources[logicalId].Metadata['aws:asset:path'];
        addNestedStacks(nestedTemplatePath, outdir);
      }
    }
  }
}

/**
 * Transform stack tags from how they are declared in source code (lower cased)
 * to how they are stored on disk (upper cased). In real synthesis this is done
 * by a special tags formatter.
 *
 * @see aws-cdk-lib/lib/stack.ts
 */
function patchStackTags(metadata: { [path: string]: MetadataEntry[] }): {
  [path: string]: MetadataEntry[];
} {
  const cloned = clone(metadata) as { [path: string]: MetadataEntry[] };

  for (const metadataEntries of Object.values(cloned)) {
    for (const metadataEntry of metadataEntries) {
      if (metadataEntry.type === ArtifactMetadataEntryType.STACK_TAGS && metadataEntry.data) {
        const metadataAny = metadataEntry as any;

        metadataAny.data = metadataAny.data.map((t: any) => {
          return { Key: t.key, Value: t.value };
        });
      }
    }
  }
  return cloned;
}

function clone(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * The cloud-assembly-schema in the new monorepo will use its own package version as the schema version, which is always `0.0.0` when tests are running.
 *
 * If we want to test the CLI's behavior when presented with specific schema versions, we will have to
 * mutate `manifest.json` on disk after writing it, and write the schema version that we want to test for in there.
 *
 * After we raise the schema version in the file on disk from `0.0.0` to
 * `30.0.0`, `cx-api` will refuse to load `manifest.json` back, because the
 * version is higher than its own package version ("Maximum schema version
 * supported is 0.x.x, but found 30.0.0"), so we have to turn on `skipVersionCheck`.
 */
function cxapiAssemblyWithForcedVersion(asm: cxapi.CloudAssembly, version: string) {
  rewriteManifestVersion(asm.directory, version);
  return new cxapi.CloudAssembly(asm.directory, { skipVersionCheck: true });
}

function rewriteManifestVersion(directory: string, version: string) {
  const manifestFile = `${directory}/manifest.json`;
  const contents = JSON.parse(fs.readFileSync(`${directory}/manifest.json`, 'utf-8'));
  contents.version = version;
  fs.writeFileSync(manifestFile, JSON.stringify(contents, undefined, 2));
}
