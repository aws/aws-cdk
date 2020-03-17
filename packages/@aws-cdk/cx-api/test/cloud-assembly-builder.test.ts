import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { CloudAssemblyBuilder } from '../lib';

/**
 * This method is intentionally duplicated from cloud-assembly.ts
 * because I doesn't seem right exposing it just for the sake of the test.
 * Also, this makes sure that if a bug is intorduced in the way the version number
 * is extracted in cloud-assembly.ts, this test will fail.
 *
 * (Assuming here that this is correct)
 */
function versionNumber(): string {

  function extract(packageJson: string) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(packageJson).version.replace(/\+[0-9a-f]+$/, '');
  }

  try {
    return extract('../../package.json');
  } catch (err) {
    // monocdk support
    return extract('../../../../package.json');
  }
}

test('cloud assembly builder', () => {
  // GIVEN
  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'cloud-assembly-builder-tests'));
  const session = new CloudAssemblyBuilder(outdir);
  const templateFile = 'foo.template.json';

  // WHEN
  session.addArtifact('my-first-artifact', {
    type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
    environment: 'aws://1222344/us-east-1',
    dependencies: ['minimal-artifact'],
    metadata: {
      foo: [ { data: "123", type: 'foo', trace: [] } ]
    },
    properties: {
      templateFile,
      parameters: {
        prop1: '1234',
        prop2: '555'
      }
    },
  });

  session.addArtifact('tree-artifact', {
    type: cxschema.ArtifactType.CDK_TREE,
    properties: {
      file: 'foo.tree.json'
    }
  });

  session.addMissing({
    key: 'foo',
    provider: 'context-provider',
    props: {
      a: 'A',
      b: 2
    }
  });

  session.addArtifact('minimal-artifact', {
    type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
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

  const assembly = session.buildAssembly();
  const manifest = assembly.manifest;

  // THEN
  // verify the manifest looks right
  expect(manifest).toStrictEqual({
    version: versionNumber(),
    missing: [
      { key: 'foo', provider: 'context-provider', props: { a: 'A', b: 2 } }
    ],
    artifacts: {
      'tree-artifact': {
        type: 'cdk:tree',
        properties: {
          file: 'foo.tree.json'
        }
      },
      'my-first-artifact': {
        type: 'aws:cloudformation:stack',
        environment: 'aws://1222344/us-east-1',
        dependencies: ['minimal-artifact'],
        metadata: { foo: [ { data: "123", type: 'foo', trace: [] } ] },
        properties: {
          templateFile: 'foo.template.json',
          parameters: {
            prop1: '1234',
            prop2: '555'
          },
        },
      },
      'minimal-artifact': {
        type: 'aws:cloudformation:stack',
        environment: 'aws://111/helo-world',
        properties: { templateFile: 'foo.template.json' }
      }
    }
  });

  // verify we have a template file
  expect(assembly.getStackByName('minimal-artifact').template).toStrictEqual({
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

test('duplicate missing values with the same key are only reported once', () => {
  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'cloud-assembly-builder-tests'));
  const session = new CloudAssemblyBuilder(outdir);

  session.addMissing({ key: 'foo', provider: 'context-provider', props: { } });
  session.addMissing({ key: 'foo', provider: 'context-provider', props: { } });

  const assembly = session.buildAssembly();

  expect(assembly.manifest.missing!.length).toEqual(1);
});
