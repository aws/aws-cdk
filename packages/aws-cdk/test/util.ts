import * as fs from 'fs';
import * as path from 'path';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { CloudExecutable } from '../lib/api/cxapp/cloud-executable';
import { Configuration } from '../lib/settings';
import { MockSdkProvider } from './util/mock-sdk';

export const DEFAULT_FAKE_TEMPLATE = { No: 'Resources' };

export interface TestStackArtifact {
  stackName: string;
  template?: any;
  env?: string,
  depends?: string[];
  metadata?: cxapi.StackMetadata;
  assets?: cxschema.AssetMetadataEntry[];
  properties?: Partial<cxschema.AwsCloudFormationStackProperties>;
  terminationProtection?: boolean;
}

export interface TestAssembly {
  stacks: TestStackArtifact[];
  missing?: cxschema.MissingContext[];
}

export class MockCloudExecutable extends CloudExecutable {
  public readonly configuration: Configuration;
  public readonly sdkProvider: MockSdkProvider;

  constructor(assembly: TestAssembly) {
    const configuration = new Configuration();
    const sdkProvider = new MockSdkProvider();

    super({
      configuration,
      sdkProvider,
      synthesizer: () => Promise.resolve(testAssembly(assembly)),
    });

    this.configuration = configuration;
    this.sdkProvider = sdkProvider;
  }
}

function clone(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

export function testAssembly(assembly: TestAssembly): cxapi.CloudAssembly {
  const builder = new cxapi.CloudAssemblyBuilder();

  for (const stack of assembly.stacks) {
    const templateFile = `${stack.stackName}.template.json`;
    const template = stack.template ?? DEFAULT_FAKE_TEMPLATE;
    fs.writeFileSync(path.join(builder.outdir, templateFile), JSON.stringify(template, undefined, 2));

    // we call patchStackTags here to simulate the tags formatter
    // that is used when building real manifest files.
    const metadata: { [path: string]: cxschema.MetadataEntry[] } = patchStackTags({ ...stack.metadata });
    for (const asset of stack.assets || []) {
      metadata[asset.id] = [
        { type: cxschema.ArtifactMetadataEntryType.ASSET, data: asset },
      ];
    }

    for (const missing of assembly.missing || []) {
      builder.addMissing(missing);
    }

    builder.addArtifact(stack.stackName, {
      type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
      environment: stack.env || 'aws://12345/here',

      dependencies: stack.depends,
      metadata,
      properties: {
        ...stack.properties,
        templateFile,
        terminationProtection: stack.terminationProtection,
      },
    });
  }

  return builder.buildAssembly();
}

/**
 * Transform stack tags from how they are decalred in source code (lower cased)
 * to how they are stored on disk (upper cased). In real synthesis this is done
 * by a special tags formatter.
 *
 * @see @aws-cdk/core/lib/stack.ts
 */
function patchStackTags(metadata: { [path: string]: cxschema.MetadataEntry[] }): { [path: string]: cxschema.MetadataEntry[] } {

  const cloned = clone(metadata) as { [path: string]: cxschema.MetadataEntry[] };

  for (const metadataEntries of Object.values(cloned)) {
    for (const metadataEntry of metadataEntries) {
      if (metadataEntry.type === cxschema.ArtifactMetadataEntryType.STACK_TAGS && metadataEntry.data) {

        const metadataAny = metadataEntry as any;

        metadataAny.data = metadataAny.data.map((t: any) => {
          return { Key: t.key, Value: t.value };
        });
      }
    }
  }
  return cloned;
}

export function testStack(stack: TestStackArtifact) {
  const assembly = testAssembly({ stacks: [stack] });
  return assembly.getStackByName(stack.stackName);
}

/**
 * Return a mocked instance of a class, given its constructor
 *
 * I don't understand why jest doesn't provide this by default,
 * but there you go.
 *
 * FIXME: Currently very limited. Doesn't support inheritance, getters or
 * automatic detection of properties (as those exist on instances, not
 * classes).
 */
export function classMockOf<A>(ctr: new (...args: any[]) => A): jest.Mocked<A> {
  const ret: any = {};
  for (const methodName of Object.getOwnPropertyNames(ctr.prototype)) {
    ret[methodName] = jest.fn();
  }
  return ret;
}
