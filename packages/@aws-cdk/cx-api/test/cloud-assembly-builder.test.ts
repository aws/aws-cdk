import fs = require('fs');
import os = require('os');
import path = require('path');
import { ArtifactType, CloudAssemblyBuilder } from '../lib';
import { CLOUD_ASSEMBLY_VERSION } from '../lib/versioning';

test('cloud assembly builder', () => {
  // GIVEN
  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'cloud-assembly-builder-tests'));
  const session = new CloudAssemblyBuilder(outdir);
  const templateFile = 'foo.template.json';

  // WHEN
  session.addArtifact('my-first-artifact', {
    type: ArtifactType.AwsCloudFormationStack,
    environment: 'aws://1222344/us-east-1',
    dependencies: ['minimal-artifact'],
    metadata: {
      foo: [ { data: 123, type: 'foo', trace: [] } ]
    },
    properties: {
      templateFile,
      parameters: {
        prop1: '1234',
        prop2: '555'
      }
    },
    missing: {
      foo: {
        provider: 'context-provider',
        props: {
          a: 'A',
          b: 2
        }
      }
    }
  });

  session.addArtifact('minimal-artifact', {
    type: ArtifactType.AwsCloudFormationStack,
    environment: 'aws://111/helo-world',
    properties: {
      templateFile
    }
  });

  fs.writeFileSync(path.join(session.outdir, templateFile), JSON.stringify({
    Resources: {
      MyTopic: {
        Type: 'AWS::S3::Topic'
      }
    }
  }));

  const assembly = session.build();

  const manifest = assembly.manifest;

  // THEN
  // verify the manifest looks right
  expect(manifest).toStrictEqual({
    version: CLOUD_ASSEMBLY_VERSION,
    artifacts: {
      'my-first-artifact': {
        type: 'aws:cloudformation:stack',
        environment: 'aws://1222344/us-east-1',
        dependencies: ['minimal-artifact'],
        metadata: { foo: [ { data: 123, type: 'foo', trace: [] } ] },
        properties: {
          templateFile: 'foo.template.json',
          parameters: {
            prop1: '1234',
            prop2: '555'
          },
        },
        missing: {
          foo: { provider: 'context-provider', props: { a: 'A', b: 2 } }
        }
      },
      'minimal-artifact': {
        type: 'aws:cloudformation:stack',
        environment: 'aws://111/helo-world',
        properties: { templateFile: 'foo.template.json' }
      }
    }
  });

  // verify we have a template file
  expect(assembly.getStack('minimal-artifact').template).toStrictEqual({
    Resources: {
      MyTopic: {
        Type: 'AWS::S3::Topic'
      }
    }
  });
});

test('outdir must be a directory', () => {
  expect(() => new CloudAssemblyBuilder(__filename)).toThrow('must be a directory');
});
