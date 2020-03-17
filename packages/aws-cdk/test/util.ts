import * as cxapi from '@aws-cdk/cx-api';
import * as cxprotocol from '@aws-cdk/cloud-assembly-schema';
import * as fs from 'fs';
import * as path from 'path';

export interface TestStackArtifact {
  stackName: string;
  template: any;
  env?: string,
  depends?: string[];
  metadata?: cxapi.StackMetadata;
  assets?: cxprotocol.AssetMetadataEntry[];
}

export interface TestAssembly {
  stacks: TestStackArtifact[];
  missing?: cxprotocol.MissingContext[];
}

export function testAssembly(assembly: TestAssembly): cxapi.CloudAssembly {
  const builder = new cxapi.CloudAssemblyBuilder();

  for (const stack of assembly.stacks) {
    const templateFile = `${stack.stackName}.template.json`;
    fs.writeFileSync(path.join(builder.outdir, templateFile), JSON.stringify(stack.template, undefined, 2));

    const metadata: { [path: string]: cxprotocol.MetadataEntry[] } = { ...stack.metadata };

    for (const asset of stack.assets || []) {
      metadata[asset.id] = [
        { type: cxprotocol.ArtifactMetadataEntryType.ASSET, data: asset }
      ];
    }

    for (const missing of assembly.missing || []) {
      builder.addMissing(missing);
    }

    builder.addArtifact(stack.stackName, {
      type: cxprotocol.ArtifactType.AWS_CLOUDFORMATION_STACK,
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
