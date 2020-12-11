import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '../lib';

test('cloud assembly builder', () => {
  // GIVEN
  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'cloud-assembly-builder-tests'));
  const session = new cxapi.CloudAssemblyBuilder(outdir);
  const templateFile = 'foo.template.json';

  // WHEN
  session.addArtifact('my-first-artifact', {
    type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
    environment: 'aws://1222344/us-east-1',
    dependencies: ['minimal-artifact'],
    metadata: {
      foo: [{ data: '123', type: 'foo', trace: [] }],
    },
    properties: {
      templateFile,
      parameters: {
        prop1: '1234',
        prop2: '555',
      },
    },
  });

  session.addArtifact('tree-artifact', {
    type: cxschema.ArtifactType.CDK_TREE,
    properties: {
      file: 'foo.tree.json',
    },
  });

  session.addMissing({
    key: 'foo',
    provider: cxschema.ContextProvider.VPC_PROVIDER,
    props: {
      account: '1234',
      region: 'us-east-1',
      filter: {
        a: 'a',
      },
    },
  });

  session.addArtifact('minimal-artifact', {
    type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
    environment: 'aws://111/helo-world',
    properties: {
      templateFile,
    },
  });

  fs.writeFileSync(path.join(session.outdir, templateFile), JSON.stringify({
    Resources: {
      MyTopic: {
        Type: 'AWS::S3::Topic',
      },
    },
  }));

  const assembly = session.buildAssembly();
  const manifest = assembly.manifest;

  // THEN
  // verify the manifest looks right
  expect(manifest).toStrictEqual({
    version: cxschema.Manifest.version(),
    missing: [
      {
        key: 'foo',
        provider: cxschema.ContextProvider.VPC_PROVIDER,
        props: {
          account: '1234',
          region: 'us-east-1',
          filter: {
            a: 'a',
          },
        },
      },
    ],
    artifacts: {
      'tree-artifact': {
        type: cxschema.ArtifactType.CDK_TREE,
        properties: {
          file: 'foo.tree.json',
        },
      },
      'my-first-artifact': {
        type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
        environment: 'aws://1222344/us-east-1',
        dependencies: ['minimal-artifact'],
        metadata: { foo: [{ data: '123', type: 'foo', trace: [] }] },
        properties: {
          templateFile: 'foo.template.json',
          parameters: {
            prop1: '1234',
            prop2: '555',
          },
        },
      },
      'minimal-artifact': {
        type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
        environment: 'aws://111/helo-world',
        properties: { templateFile: 'foo.template.json' },
      },
    },
  });

  // verify we have a template file
  expect(assembly.getStackByName('minimal-artifact').template).toStrictEqual({
    Resources: {
      MyTopic: {
        Type: 'AWS::S3::Topic',
      },
    },
  });
});

test('outdir must be a directory', () => {
  expect(() => new cxapi.CloudAssemblyBuilder(__filename)).toThrow('must be a directory');
});

test('outdir defaults to a temporary directory', () => {
  const assembly = new cxapi.CloudAssemblyBuilder();
  const realTmpDir = fs.realpathSync(os.tmpdir());
  expect(assembly.outdir).toMatch(new RegExp(`^${path.join(realTmpDir, 'cdk.out')}`));
});

test('duplicate missing values with the same key are only reported once', () => {
  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'cloud-assembly-builder-tests'));
  const session = new cxapi.CloudAssemblyBuilder(outdir);

  const props: cxschema.ContextQueryProperties = {
    account: '1234',
    region: 'asdf',
    filter: { a: 'a' },
  };

  session.addMissing({ key: 'foo', provider: cxschema.ContextProvider.VPC_PROVIDER, props });
  session.addMissing({ key: 'foo', provider: cxschema.ContextProvider.VPC_PROVIDER, props });

  const assembly = session.buildAssembly();

  expect(assembly.manifest.missing!.length).toEqual(1);
});

test('write and read nested cloud assembly artifact', () => {
  // GIVEN
  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'cloud-assembly-builder-tests'));
  const session = new cxapi.CloudAssemblyBuilder(outdir);

  const innerAsmDir = path.join(outdir, 'hello');
  new cxapi.CloudAssemblyBuilder(innerAsmDir).buildAssembly();

  // WHEN
  session.addArtifact('Assembly', {
    type: cxschema.ArtifactType.NESTED_CLOUD_ASSEMBLY,
    properties: {
      directoryName: 'hello',
    } as cxschema.NestedCloudAssemblyProperties,
  });
  const asm = session.buildAssembly();

  // THEN
  const art = asm.tryGetArtifact('Assembly') as cxapi.NestedCloudAssemblyArtifact | undefined;
  expect(art).toBeInstanceOf(cxapi.NestedCloudAssemblyArtifact);
  expect(art?.fullPath).toEqual(path.join(outdir, 'hello'));

  const nested = art?.nestedAssembly;
  expect(nested?.artifacts.length).toEqual(0);
});

test('missing values are reported to top-level asm', () => {
  // GIVEN
  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'cloud-assembly-builder-tests'));
  const session = new cxapi.CloudAssemblyBuilder(outdir);

  const innerAsm = session.createNestedAssembly('hello', 'hello');

  // WHEN
  const props: cxschema.ContextQueryProperties = {
    account: '1234',
    region: 'asdf',
    filter: { a: 'a' },
  };

  innerAsm.addMissing({ key: 'foo', provider: cxschema.ContextProvider.VPC_PROVIDER, props });

  // THEN
  const assembly = session.buildAssembly();

  expect(assembly.manifest.missing?.length).toEqual(1);
});

test('artifcats are written in topological order', () => {
  // GIVEN
  const outdir = fs.mkdtempSync(path.join(os.tmpdir(), 'cloud-assembly-builder-tests'));
  const session = new cxapi.CloudAssemblyBuilder(outdir);
  const templateFile = 'foo.template.json';

  const innerAsmDir = path.join(outdir, 'hello');
  new cxapi.CloudAssemblyBuilder(innerAsmDir).buildAssembly();

  // WHEN

  // Create the following dependency order:
  // A ->
  //      C -> D
  // B ->
  session.addArtifact('artifact-D', {
    type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
    environment: 'aws://1222344/us-east-1',
    dependencies: ['artifact-C'],
    properties: {
      templateFile,
    },
  });

  session.addArtifact('artifact-C', {
    type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
    environment: 'aws://1222344/us-east-1',
    dependencies: ['artifact-B', 'artifact-A'],
    properties: {
      templateFile,
    },
  });

  session.addArtifact('artifact-B', {
    type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
    environment: 'aws://1222344/us-east-1',
    properties: {
      templateFile,
    },
  });

  session.addArtifact('artifact-A', {
    type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
    environment: 'aws://1222344/us-east-1',
    properties: {
      templateFile,
    },
  });

  const asm = session.buildAssembly();
  const artifactsIds = asm.artifacts.map(a => a.id);

  // THEN
  expect(artifactsIds.indexOf('artifact-A')).toBeLessThan(artifactsIds.indexOf('artifact-C'));
  expect(artifactsIds.indexOf('artifact-B')).toBeLessThan(artifactsIds.indexOf('artifact-C'));
  expect(artifactsIds.indexOf('artifact-C')).toBeLessThan(artifactsIds.indexOf('artifact-D'));
});
