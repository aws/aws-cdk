import * as fs from 'fs';
import * as path from 'path';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '../lib';
import { rimraf } from './util';

const stackBase = {
  type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
  environment: 'aws://1222344/us-east-1',
  properties: {
    templateFile: 'bla.json',
  },
};

let builder: cxapi.CloudAssemblyBuilder;
beforeEach(() => {
  builder = new cxapi.CloudAssemblyBuilder();
});

afterEach(() => {
  rimraf(builder.outdir);
});

test('read tags from artifact properties', () => {
  // GIVEN
  builder.addArtifact('Stack', {
    ...stackBase,
    properties: {
      ...stackBase.properties,
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

test('stack tags get uppercased when written to Cloud Assembly', () => {
  // Backwards compatibility test
  // GIVEN
  builder.addArtifact('Stack', {
    ...stackBase,
    metadata: {
      '/Stack': [
        {
          type: 'aws:cdk:stack-tags',
          data: [{ key: 'foo', value: 'bar' }],
        },
      ],
    },
  });

  // WHEN
  const assembly = builder.buildAssembly();

  // THEN
  const manifestStructure = JSON.parse(fs.readFileSync(path.join(assembly.directory, 'manifest.json'), { encoding: 'utf-8' }));
  expect(manifestStructure.artifacts.Stack.metadata['/Stack']).toEqual([
    {
      type: 'aws:cdk:stack-tags',
      data: [
        {
          // Note: uppercase due to historical accident
          Key: 'foo',
          Value: 'bar',
        },
      ],
    },
  ]);
});

test('already uppercased stack tags get left alone', () => {
  // Backwards compatibility test
  // GIVEN
  builder.addArtifact('Stack', {
    ...stackBase,
    metadata: {
      '/Stack': [
        {
          type: 'aws:cdk:stack-tags',
          data: [{ Key: 'foo', Value: 'bar' } as any],
        },
      ],
    },
  });

  // WHEN
  const assembly = builder.buildAssembly();

  // THEN
  const manifestStructure = JSON.parse(fs.readFileSync(path.join(assembly.directory, 'manifest.json'), { encoding: 'utf-8' }));
  expect(manifestStructure.artifacts.Stack.metadata['/Stack']).toEqual([
    {
      type: 'aws:cdk:stack-tags',
      data: [
        {
          // Note: uppercase due to historical accident
          Key: 'foo',
          Value: 'bar',
        },
      ],
    },
  ]);
});


test('read tags from stack metadata', () => {
  // Backwards compatibility test
  // GIVEN
  builder.addArtifact('Stack', {
    ...stackBase,
    metadata: {
      '/Stack': [
        {
          type: 'aws:cdk:stack-tags',
          data: [{ key: 'foo', value: 'bar' }],
        },
      ],
    },
  });

  // WHEN
  const assembly = builder.buildAssembly();

  // THEN
  expect(assembly.getStackByName('Stack').tags).toEqual({ foo: 'bar' });
});
