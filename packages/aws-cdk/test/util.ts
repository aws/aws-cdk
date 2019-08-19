import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import path = require('path');

export interface TestStackArtifact {
  stackName: string;
  template: any;
  env?: string,
  depends?: string[];
  metadata?: cxapi.StackMetadata;
  assets?: cxapi.AssetMetadataEntry[];
}

export function testAssembly(...stacks: TestStackArtifact[]): cxapi.CloudAssembly {
  const builder = new cxapi.CloudAssemblyBuilder();

  for (const stack of stacks) {
    const templateFile = `${stack.stackName}.template.json`;
    fs.writeFileSync(path.join(builder.outdir, templateFile), JSON.stringify(stack.template, undefined, 2));

    const metadata: { [path: string]: cxapi.MetadataEntry[] } = { ...stack.metadata };

    for (const asset of stack.assets || []) {
      metadata[asset.id] = [
        { type: cxapi.ASSET_METADATA, data: asset }
      ];
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
  const assembly = testAssembly(stack);
  return assembly.getStack(stack.stackName);
}
