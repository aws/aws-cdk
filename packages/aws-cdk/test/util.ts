import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs');
import path = require('path');

export interface TestStackArtifact {
  stackName: string;
  template: any;
  autoDeploy?: boolean;
  depends?: string[];
  metadata?: cxapi.StackMetadata;
  assets?: any[];
}

export function testAssembly(...stacks: TestStackArtifact[]): cxapi.CloudAssembly {
  const builder = new cxapi.CloudAssemblyBuilder();

  for (const stack of stacks) {
    const templateFile = `${stack.stackName}.template.json`;
    fs.writeFileSync(path.join(builder.outdir, templateFile), templateFile);

    builder.addArtifact(stack.stackName, {
      type: cxapi.ArtifactType.AwsCloudFormationStack,
      environment: 'aws://12345/here',
      autoDeploy: stack.autoDeploy,
      dependencies: stack.depends,
      metadata: stack.metadata,
      properties: {
        templateFile
      }
    });
  }

  return builder.build();
}

export function testStack(stack: TestStackArtifact) {
  const assembly = testAssembly(stack);
  return assembly.getStack(stack.stackName);
}