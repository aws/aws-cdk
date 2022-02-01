import * as fs from 'fs';
import * as path from 'path';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';

export function mkStack(template: any): cxapi.CloudFormationStackArtifact {
  const assembly = new cxapi.CloudAssemblyBuilder();
  assembly.addArtifact('test', {
    type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
    environment: cxapi.EnvironmentUtils.format('123456789012', 'bermuda-triangle-1'),
    properties: {
      templateFile: 'template.json',
    },
  });

  fs.writeFileSync(path.join(assembly.outdir, 'template.json'), JSON.stringify(template));
  return assembly.buildAssembly().getStackByName('test');
}

export function mkResource(props: any): cxapi.CloudFormationStackArtifact {
  return mkStack({
    Resources: {
      SomeResource: {
        Type: 'Some::Resource',
        Properties: props,
      },
    },
  });
}