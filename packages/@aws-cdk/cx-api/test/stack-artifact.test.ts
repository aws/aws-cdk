import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '../lib';
import { rimraf } from './util';

let builder: cxapi.CloudAssemblyBuilder;
beforeEach(() => {
  builder = new cxapi.CloudAssemblyBuilder();
});

afterEach(() => {
  rimraf(builder.outdir);
});

test('read tags', () => {
  // GIVEN
  builder.addArtifact('Stack', {
    type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
    environment: 'aws://1222344/us-east-1',
    properties: {
      templateFile: 'bla.json',
      tags: {
        foo: 'bar',
      },
    },
  });

  // WHEN
  const assembly = builder.buildAssembly();

  // THEN
  expect(assembly.getStackByName('Stack').tags).toEqual({ foo: 'bar' });
});
