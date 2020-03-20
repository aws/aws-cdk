import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs';
import * as path from 'path';
import { CloudExecutable } from '../lib/api/cxapp/cloud-executable';
import { Configuration } from '../lib/settings';
import { MockSdkProvider } from './util/mock-sdk';

export interface TestStackArtifact {
  stackName: string;
  template: any;
  env?: string,
  depends?: string[];
  metadata?: cxapi.StackMetadata;
  assets?: cxapi.AssetMetadataEntry[];
}

export interface TestAssembly {
  stacks: TestStackArtifact[];
  missing?: cxapi.MissingContext[];
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
      synthesizer: () => Promise.resolve(testAssembly(assembly))
    });

    this.configuration = configuration;
    this.sdkProvider = sdkProvider;
  }
}

export function testAssembly(assembly: TestAssembly): cxapi.CloudAssembly {
  const builder = new cxapi.CloudAssemblyBuilder();

  for (const stack of assembly.stacks) {
    const templateFile = `${stack.stackName}.template.json`;
    fs.writeFileSync(path.join(builder.outdir, templateFile), JSON.stringify(stack.template, undefined, 2));

    const metadata: { [path: string]: cxapi.MetadataEntry[] } = { ...stack.metadata };

    for (const asset of stack.assets || []) {
      metadata[asset.id] = [
        { type: cxapi.ASSET_METADATA, data: asset }
      ];
    }

    for (const missing of assembly.missing || []) {
      builder.addMissing(missing);
    }

    builder.addArtifact(stack.stackName, {
      type: cxapi.ArtifactType.AWS_CLOUDFORMATION_STACK,
      environment: stack.env || 'aws://12345/here',

      dependencies: stack.depends,
      metadata,
      properties: {
        templateFile
      }
    });
  }

  return builder.buildAssembly();
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