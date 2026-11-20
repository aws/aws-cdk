
import { spawnSync, execSync } from 'child_process';
import * as os from 'os';
import * as path from 'path';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import { Construct } from 'constructs';
import fs from 'fs-extra';
import sinon from 'sinon';
import { FileAssetPackaging } from '../../cloud-assembly-schema';
import * as cxapi from '../../cx-api';
import type { AssetStagingProps, BundlingOptions } from '../lib';
import { App, AssetHashType, AssetStaging, DockerImage, BundlingOutput, FileSystem, IgnoreMode, Stack, NestedStack, Stage, BundlingFileAccess, SymlinkFollowMode } from '../lib';

const STUB_INPUT_FILE = '/tmp/docker-stub.input';
const STUB_INPUT_CONCAT_FILE = '/tmp/docker-stub.input.concat';

const STUB_INPUT_CP_FILE = '/tmp/docker-stub-cp.input';
const STUB_INPUT_CP_CONCAT_FILE = '/tmp/docker-stub-cp.input.concat';

const DOCKER_STUB_SUCCESS_HASH = '97bb77db984edc91b0d7ddc0949cf479cc1d7d5f25d19a66ae3a483323c9e7c3';

enum DockerStubCommand {
  SUCCESS = 'DOCKER_STUB_SUCCESS',
  FAIL = 'DOCKER_STUB_FAIL',
  SUCCESS_NO_OUTPUT = 'DOCKER_STUB_SUCCESS_NO_OUTPUT',
  MULTIPLE_FILES = 'DOCKER_STUB_MULTIPLE_FILES',
  SINGLE_ARCHIVE = 'DOCKER_STUB_SINGLE_ARCHIVE',
  SINGLE_FILE = 'DOCKER_STUB_SINGLE_FILE',
  SINGLE_FILE_WITHOUT_EXT = 'DOCKER_STUB_SINGLE_FILE_WITHOUT_EXT',
  VOLUME_SINGLE_ARCHIVE = 'DOCKER_STUB_VOLUME_SINGLE_ARCHIVE',
  SYMLINK = 'DOCKER_STUB_SYMLINK',
  DIR_WITH_LOCAL_SYMLINK = 'DOCKER_STUB_DIR_WITH_LOCAL_SYMLINK',
  DIR_WITH_EXTERNAL_SYMLINK = 'DOCKER_STUB_DIR_WITH_EXTERNAL_SYMLINK',
  DIR_WITH_NESTED_EXTERNAL_SYMLINK = 'DOCKER_STUB_DIR_WITH_NESTED_EXTERNAL_SYMLINK',
  DIR_WITH_EXTERNAL_DIR_SYMLINK = 'DOCKER_STUB_DIR_WITH_EXTERNAL_DIR_SYMLINK',
}

const FIXTURE_TEST1_DIR = path.join(__dirname, 'fs', 'fixtures', 'test1');
const FIXTURE_TEST1_HASH = '0ed6a91d0269df25c265bdeb5c55dca958a86769bcc97e406a3d16ba1a08985a';
const FIXTURE_TARBALL = path.join(__dirname, 'fs', 'fixtures.tar.gz');
const NOT_ARCHIVED_ZIP_TXT_HASH = '95c924c84f5d023be4edee540cb2cb401a49f115d01ed403b288f6cb412771df';
const ARCHIVE_TARBALL_TEST_HASH = '3e948ff54a277d6001e2452fdbc4a9ef61f916ff662ba5e05ece1e2ec6dec9f5';

const userInfo = os.userInfo();
const USER_ARG = `-u ${userInfo.uid}:${userInfo.gid}`;
const delegated = isSeLinux() ? 'z,delegated' : 'delegated';

describe('staging', () => {
  beforeAll(() => {
    // this is a way to provide a custom "docker" command for staging.
    process.env.CDK_DOCKER = `${__dirname}/docker-stub.sh`;
  });

  afterAll(() => {
    delete process.env.CDK_DOCKER;
  });

  afterEach(() => {
    AssetStaging.clearAssetHashCache();
    if (fs.existsSync(STUB_INPUT_FILE)) {
      fs.unlinkSync(STUB_INPUT_FILE);
    }
    if (fs.existsSync(STUB_INPUT_CONCAT_FILE)) {
      fs.unlinkSync(STUB_INPUT_CONCAT_FILE);
    }
    sinon.restore();
    jest.restoreAllMocks();
  });

  test('base case', () => {
    // GIVEN
    const stack = new Stack();
    const sourcePath = FIXTURE_TEST1_DIR;

    // WHEN
    const staging = new AssetStaging(stack, 's1', { sourcePath });

    expect(staging.assetHash).toEqual(FIXTURE_TEST1_HASH);
    expect(staging.sourcePath).toEqual(sourcePath);
    expect(path.basename(staging.absoluteStagedPath)).toEqual(`asset.${FIXTURE_TEST1_HASH}`);
    expect(path.basename(staging.relativeStagedPath(stack))).toEqual(`asset.${FIXTURE_TEST1_HASH}`);
    expect(staging.packaging).toEqual(FileAssetPackaging.ZIP_DIRECTORY);
    expect(staging.isArchive).toEqual(true);
  });

  test('base case if source directory is a symlink', () => {
    // GIVEN
    const stack = new Stack();
    const sourcePath = path.join(os.tmpdir(), 'asset-symlink');
    if (fs.existsSync(sourcePath)) { fs.unlinkSync(sourcePath); }
    fs.symlinkSync(FIXTURE_TEST1_DIR, sourcePath);

    try {
      const staging = new AssetStaging(stack, 's1', { sourcePath });

      // Should be the same asset hash as in the previous test
      expect(staging.assetHash).toEqual(FIXTURE_TEST1_HASH);
    } finally {
      if (fs.existsSync(sourcePath)) {
        fs.unlinkSync(sourcePath);
      }
    }
  });

  test('staging of an archive file correctly sets packaging and isArchive', () => {
    // GIVEN
    const stack = new Stack();
    const sourcePath = path.join(__dirname, 'archive', 'archive.zip');

    // WHEN
    const staging = new AssetStaging(stack, 's1', { sourcePath });

    expect(staging.packaging).toEqual(FileAssetPackaging.FILE);
    expect(staging.isArchive).toEqual(true);
  });

  test('staging of an archive with multiple extension name correctly sets packaging and isArchive', () => {
    // GIVEN
    const stack = new Stack();
    const sourcePathTarGz1 = path.join(__dirname, 'archive', 'artifact.tar.gz');
    const sourcePathTarGz2 = path.join(__dirname, 'archive', 'artifact.da.vinci.monalisa.tar.gz');
    const sourcePathTgz = path.join(__dirname, 'archive', 'artifact.tgz');
    const sourcePathTar = path.join(__dirname, 'archive', 'artifact.tar');
    const sourcePathNotArchive = path.join(__dirname, 'archive', 'artifact.zip.txt');
    const sourcePathDockerFile = path.join(__dirname, 'archive', 'DockerFile');

    // WHEN
    const stagingTarGz1 = new AssetStaging(stack, 's1', { sourcePath: sourcePathTarGz1 });
    const stagingTarGz2 = new AssetStaging(stack, 's2', { sourcePath: sourcePathTarGz2 });
    const stagingTgz = new AssetStaging(stack, 's3', { sourcePath: sourcePathTgz });
    const stagingTar = new AssetStaging(stack, 's4', { sourcePath: sourcePathTar });
    const stagingNotArchive = new AssetStaging(stack, 's5', { sourcePath: sourcePathNotArchive });
    const stagingDockerFile = new AssetStaging(stack, 's6', { sourcePath: sourcePathDockerFile });

    expect(stagingTarGz1.packaging).toEqual(FileAssetPackaging.FILE);
    expect(stagingTarGz1.isArchive).toEqual(true);
    expect(stagingTarGz2.packaging).toEqual(FileAssetPackaging.FILE);
    expect(path.basename(stagingTarGz2.absoluteStagedPath)).toEqual(`asset.${ARCHIVE_TARBALL_TEST_HASH}.tar.gz`);
    expect(path.basename(stagingTarGz2.relativeStagedPath(stack))).toEqual(`asset.${ARCHIVE_TARBALL_TEST_HASH}.tar.gz`);
    expect(stagingTarGz2.isArchive).toEqual(true);
    expect(stagingTgz.packaging).toEqual(FileAssetPackaging.FILE);
    expect(stagingTgz.isArchive).toEqual(true);
    expect(stagingTar.packaging).toEqual(FileAssetPackaging.FILE);
    expect(stagingTar.isArchive).toEqual(true);
    expect(stagingNotArchive.packaging).toEqual(FileAssetPackaging.FILE);
    expect(path.basename(stagingNotArchive.absoluteStagedPath)).toEqual(`asset.${NOT_ARCHIVED_ZIP_TXT_HASH}.txt`);
    expect(path.basename(stagingNotArchive.relativeStagedPath(stack))).toEqual(`asset.${NOT_ARCHIVED_ZIP_TXT_HASH}.txt`);
    expect(stagingNotArchive.isArchive).toEqual(false);
    expect(stagingDockerFile.packaging).toEqual(FileAssetPackaging.FILE);
    expect(stagingDockerFile.isArchive).toEqual(false);
  });

  test('asset packaging type is correct when staging is skipped because of memory cache', () => {
    // GIVEN
    const stack = new Stack();
    const sourcePath = path.join(__dirname, 'archive', 'archive.zip');

    // WHEN
    const staging1 = new AssetStaging(stack, 's1', { sourcePath });
    const staging2 = new AssetStaging(stack, 's2', { sourcePath });

    expect(staging1.packaging).toEqual(FileAssetPackaging.FILE);
    expect(staging1.isArchive).toEqual(true);
    expect(staging2.packaging).toEqual(staging1.packaging);
    expect(staging2.isArchive).toEqual(staging1.isArchive);
  });

  test('asset packaging type is correct when staging is skipped because of disk cache', () => {
    // GIVEN
    const TEST_OUTDIR = path.join(__dirname, 'cdk.out');
    if (fs.existsSync(TEST_OUTDIR)) {
      fs.removeSync(TEST_OUTDIR);
    }

    const sourcePath = path.join(__dirname, 'archive', 'archive.zip');

    const app1 = new App({ outdir: TEST_OUTDIR });
    const stack1 = new Stack(app1, 'Stack');

    const app2 = new App({ outdir: TEST_OUTDIR }); // same OUTDIR
    const stack2 = new Stack(app2, 'stack');

    // WHEN
    const staging1 = new AssetStaging(stack1, 'Asset', { sourcePath });

    // Now clear asset hash cache to show that during the second staging
    // even though the asset is already available on disk it will correctly
    // be considered as a FileAssetPackaging.FILE.
    AssetStaging.clearAssetHashCache();

    const staging2 = new AssetStaging(stack2, 'Asset', { sourcePath });

    // THEN
    expect(staging1.packaging).toEqual(FileAssetPackaging.FILE);
    expect(staging1.isArchive).toEqual(true);
    expect(staging2.packaging).toEqual(staging1.packaging);
    expect(staging2.isArchive).toEqual(staging1.isArchive);
  });

  test('staging of a non-archive file correctly sets packaging and isArchive', () => {
    // GIVEN
    const stack = new Stack();
    const sourcePath = __filename;

    // WHEN
    const staging = new AssetStaging(stack, 's1', { sourcePath });

    expect(staging.packaging).toEqual(FileAssetPackaging.FILE);
    expect(staging.isArchive).toEqual(false);
  });

  test('staging can be disabled through context', () => {
    // GIVEN
    const stack = new Stack();
    stack.node.setContext(cxapi.DISABLE_ASSET_STAGING_CONTEXT, true);
    const sourcePath = FIXTURE_TEST1_DIR;

    // WHEN
    const staging = new AssetStaging(stack, 's1', { sourcePath });

    expect(staging.assetHash).toEqual(FIXTURE_TEST1_HASH);
    expect(staging.sourcePath).toEqual(sourcePath);
    expect(staging.absoluteStagedPath).toEqual(sourcePath);
    expect(staging.relativeStagedPath(stack)).toEqual(sourcePath);
  });

  test('files are copied to the output directory during synth', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'stack');

    // WHEN
    new AssetStaging(stack, 's1', { sourcePath: FIXTURE_TEST1_DIR });
    new AssetStaging(stack, 'file', { sourcePath: FIXTURE_TARBALL });

    // THEN
    const assembly = app.synth();
    expect(fs.readdirSync(assembly.directory)).toEqual([
      `asset.${FIXTURE_TEST1_HASH}`,
      'asset.245e31402d71cfe7e9307561109ec33f76649c0a9e9caab8ac02a56f927823c8.tar.gz',
      'cdk.out',
      'manifest.json',
      'stack.metadata.json',
      'stack.template.json',
      'tree.json',
      'validation-report.json',
    ]);
  });

  test('assets in nested assemblies get staged into assembly root directory', () => {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(new Stage(app, 'Stage1'), 'Stack');
    const stack2 = new Stack(new Stage(app, 'Stage2'), 'Stack');

    // WHEN
    new AssetStaging(stack1, 's1', { sourcePath: FIXTURE_TEST1_DIR });
    new AssetStaging(stack2, 's1', { sourcePath: FIXTURE_TEST1_DIR });

    // THEN
    const assembly = app.synth();

    // One asset directory at the top
    expect(fs.readdirSync(assembly.directory)).toEqual([
      'assembly-Stage1',
      'assembly-Stage2',
      `asset.${FIXTURE_TEST1_HASH}`,
      'cdk.out',
      'manifest.json',
      'tree.json',
      'validation-report.json',
    ]);
  });

  test('allow specifying extra data to include in the source hash', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    const withoutExtra = new AssetStaging(stack, 'withoutExtra', { sourcePath: directory });
    const withExtra = new AssetStaging(stack, 'withExtra', { sourcePath: directory, extraHash: 'boom' });

    // THEN
    expect(withoutExtra.assetHash).not.toEqual(withExtra.assetHash);
    expect(withoutExtra.assetHash).toEqual(FIXTURE_TEST1_HASH);
    expect(withExtra.assetHash).toEqual('546e4a1731df2753503162a5a260ae037df45ce6dc49f0a98711f5824cddec02');
  });

  test('can specify extra asset salt via context key', () => {
    // GIVEN
    const directory = FIXTURE_TEST1_DIR;

    const app = new App();
    const stack = new Stack(app, 'stack');

    const saltedApp = new App({ context: { '@aws-cdk/core:assetHashSalt': 'magic' } });
    const saltedStack = new Stack(saltedApp, 'stack');

    // WHEN
    const asset = new AssetStaging(stack, 'X', { sourcePath: directory });
    const saltedAsset = new AssetStaging(saltedStack, 'X', { sourcePath: directory });

    // THEN
    expect(asset.assetHash).not.toEqual(saltedAsset.assetHash);
  });

  test('with bundling', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;
    const processStdErrWriteSpy = sinon.spy(process.stderr, 'write');

    // WHEN
    new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
      },
    });

    // THEN
    const assembly = app.synth();
    expect(
      readDockerStubInput()).toEqual(
      `run --rm ${USER_ARG} -v /input:/asset-input:${delegated} -v /output:/asset-output:${delegated} -w /asset-input alpine DOCKER_STUB_SUCCESS`,
    );
    expect(fs.readdirSync(assembly.directory)).toEqual([
      'asset.73f25aa93681e01831ecafe334b79916f3cead51b5bc3cadbfc4459dbafd4a3c',
      'cdk.out',
      'manifest.json',
      'stack.metadata.json',
      'stack.template.json',
      'tree.json',
      'validation-report.json',
    ]);

    // shows a message before bundling
    expect(processStdErrWriteSpy.calledWith('Bundling asset stack/Asset...\n')).toEqual(true);
  });

  test('bundled resources have absolute path when staging is disabled', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'stack');
    stack.node.setContext(cxapi.DISABLE_ASSET_STAGING_CONTEXT, true);
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    const asset = new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
      },
    });

    // THEN
    const assembly = app.synth();

    expect(fs.readdirSync(assembly.directory)).toEqual([
      'asset.73f25aa93681e01831ecafe334b79916f3cead51b5bc3cadbfc4459dbafd4a3c',
      'cdk.out',
      'manifest.json',
      'stack.metadata.json',
      'stack.template.json',
      'tree.json',
      'validation-report.json',
    ]);

    expect(asset.assetHash).toEqual('73f25aa93681e01831ecafe334b79916f3cead51b5bc3cadbfc4459dbafd4a3c');
    expect(asset.sourcePath).toEqual(directory);

    const resolvedStagePath = asset.relativeStagedPath(stack);
    // absolute path ending with bundling dir
    expect(path.isAbsolute(resolvedStagePath)).toEqual(true);
    expect(new RegExp('asset.73f25aa93681e01831ecafe334b79916f3cead51b5bc3cadbfc4459dbafd4a3c$').test(resolvedStagePath)).toEqual(true);
  });

  test('bundler reuses its output when it can', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
      },
    });

    new AssetStaging(stack, 'AssetDuplicate', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
      },
    });

    // THEN
    const assembly = app.synth();

    // We're testing that docker was run exactly once even though there are two bundling assets.
    expect(
      readDockerStubInputConcat()).toEqual(
      `run --rm ${USER_ARG} -v /input:/asset-input:${delegated} -v /output:/asset-output:${delegated} -w /asset-input alpine DOCKER_STUB_SUCCESS`,
    );

    expect(fs.readdirSync(assembly.directory)).toEqual([
      'asset.73f25aa93681e01831ecafe334b79916f3cead51b5bc3cadbfc4459dbafd4a3c',
      'cdk.out',
      'manifest.json',
      'stack.metadata.json',
      'stack.template.json',
      'tree.json',
      'validation-report.json',
    ]);
  });

  test('uses asset hash cache with AssetHashType.OUTPUT', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;
    const fingerPrintSpy = sinon.spy(FileSystem, 'fingerprint');

    // WHEN
    new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      assetHashType: AssetHashType.OUTPUT,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
      },
    });

    new AssetStaging(stack, 'AssetDuplicate', {
      sourcePath: directory,
      assetHashType: AssetHashType.OUTPUT,
      bundling: { // Same bundling but with keys ordered differently
        command: [DockerStubCommand.SUCCESS],
        image: DockerImage.fromRegistry('alpine'),
      },
    });

    // THEN
    const assembly = app.synth();

    // We're testing that docker was run exactly once even though there are two bundling assets
    // and that the hash is based on the output
    expect(
      readDockerStubInputConcat()).toEqual(
      `run --rm ${USER_ARG} -v /input:/asset-input:${delegated} -v /output:/asset-output:${delegated} -w /asset-input alpine DOCKER_STUB_SUCCESS`,
    );

    expect(fs.readdirSync(assembly.directory)).toEqual([
      `asset.${DOCKER_STUB_SUCCESS_HASH}`,
      'cdk.out',
      'manifest.json',
      'stack.metadata.json',
      'stack.template.json',
      'tree.json',
      'validation-report.json',
    ]);

    // Only one fingerprinting
    expect(fingerPrintSpy.calledOnce).toEqual(true);
  });

  test('bundler considers its options when reusing bundle output', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
      },
    });

    new AssetStaging(stack, 'AssetWithDifferentBundlingOptions', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
        environment: {
          UNIQUE_ENV_VAR: 'SOMEVALUE',
        },
      },
    });

    // THEN
    const assembly = app.synth();

    // We're testing that docker was run twice - once for each set of bundler options
    // operating on the same source asset.
    expect(
      readDockerStubInputConcat()).toEqual(
      `run --rm ${USER_ARG} -v /input:/asset-input:${delegated} -v /output:/asset-output:${delegated} -w /asset-input alpine DOCKER_STUB_SUCCESS\n` +
      `run --rm ${USER_ARG} -v /input:/asset-input:${delegated} -v /output:/asset-output:${delegated} --env UNIQUE_ENV_VAR=SOMEVALUE -w /asset-input alpine DOCKER_STUB_SUCCESS`,
    );

    expect(fs.readdirSync(assembly.directory)).toEqual([
      'asset.73f25aa93681e01831ecafe334b79916f3cead51b5bc3cadbfc4459dbafd4a3c', // 'Asset'
      'asset.c16eb04e5e6f7a2e62afaf27abee04bc36da8999efc73d6853ac3dcdd04b6a98', // 'AssetWithDifferentBundlingOptions'
      'cdk.out',
      'manifest.json',
      'stack.metadata.json',
      'stack.template.json',
      'tree.json',
      'validation-report.json',
    ]);
  });

  test('bundler ignores secret tokens in code artifact URLs', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
        environment: {
          PIP_INDEX_URL: 'https://aws:MY_SECRET_TOKEN@your-code-repo.d.codeartifact.us-west-2.amazonaws.com/pypi/python/simple/',
        },
      },
    });

    new AssetStaging(stack, 'AssetWithDifferentBundlingOptions', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
        environment: {
          PIP_INDEX_URL: 'https://aws:MY_OTHER_SECRET_TOKEN@your-code-repo.d.codeartifact.us-west-2.amazonaws.com/pypi/python/simple/',
        },
      },
    });

    // THEN
    const assembly = app.synth();

    // We're testing that docker was run once, only for the first Asset, since the only difference is the token.
    expect(
      readDockerStubInputConcat()).toEqual(
      `run --rm ${USER_ARG} -v /input:/asset-input:${delegated} -v /output:/asset-output:${delegated} --env PIP_INDEX_URL=https://aws:MY_SECRET_TOKEN@your-code-repo.d.codeartifact.us-west-2.amazonaws.com/pypi/python/simple/ -w /asset-input alpine DOCKER_STUB_SUCCESS`,
    );

    expect(fs.readdirSync(assembly.directory)).toEqual([
      'asset.feebd77844651944d530c7600e6f3dc440a9bad66abf76ab95a0a7d168aabca0', // 'Asset'
      'cdk.out',
      'manifest.json',
      'stack.metadata.json',
      'stack.template.json',
      'tree.json',
      'validation-report.json',
    ]);
  });

  test('bundler throws n error when the PIP url is not a valid url', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    expect(() => new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
        environment: {
          PIP_INDEX_URL: 'NOT_A_URL',
        },
      },
    })).toThrow('PIP_INDEX_URL must be a valid URL, got NOT_A_URL.');
  });

  test('bundler outputs to intermediate dir and renames to asset', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;
    const ensureDirSync = jest.spyOn(fs, 'ensureDirSync');
    const chmodSyncSpy = jest.spyOn(fs, 'chmodSync');
    const renameSyncSpy = jest.spyOn(fs, 'renameSync');

    // WHEN
    new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      assetHashType: AssetHashType.OUTPUT,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
      },
    });

    // THEN
    const assembly = app.synth();

    expect(ensureDirSync).toHaveBeenCalledWith(expect.stringContaining('-building'));
    expect(chmodSyncSpy).toHaveBeenCalledWith(expect.stringContaining('-building'), 0o777);
    expect(renameSyncSpy).toHaveBeenCalledWith(expect.stringContaining('-building'), expect.stringMatching(/asset\.[a-f0-9]+$/));

    expect(fs.readdirSync(assembly.directory)).toEqual([
      `asset.${DOCKER_STUB_SUCCESS_HASH}`, // 'Asset'
      'cdk.out',
      'manifest.json',
      'stack.metadata.json',
      'stack.template.json',
      'tree.json',
      'validation-report.json',
    ]);
  });

  test('bundling failure preserves the bundleDir for diagnosability', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    expect(() => new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.FAIL],
      },
    })).toThrow(/Failed.*bundl.*asset.*-building/);

    // THEN
    const assembly = app.synth();

    const dir = fs.readdirSync(assembly.directory);
    expect(dir.some(entry => entry.match(/asset.*-building/))).toEqual(true);
  });

  test('bundler re-uses assets from previous synths', () => {
    // GIVEN
    const TEST_OUTDIR = path.join(__dirname, 'cdk.out');
    if (fs.existsSync(TEST_OUTDIR)) {
      fs.removeSync(TEST_OUTDIR);
    }

    const app = new App({ outdir: TEST_OUTDIR, context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
      },
    });

    // Clear asset hash cache to show that during the second synth bundling
    // will consider the existing bundling dir (file system cache).
    AssetStaging.clearAssetHashCache();

    // GIVEN
    const app2 = new App({ outdir: TEST_OUTDIR, context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack2 = new Stack(app2, 'stack');

    // WHEN
    new AssetStaging(stack2, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
      },
    });

    // THEN
    const appAssembly = app.synth();
    const app2Assembly = app2.synth();

    expect(
      readDockerStubInputConcat()).toEqual(
      `run --rm ${USER_ARG} -v /input:/asset-input:${delegated} -v /output:/asset-output:${delegated} -w /asset-input alpine DOCKER_STUB_SUCCESS`,
    );

    expect(appAssembly.directory).toEqual(app2Assembly.directory);
    expect(fs.readdirSync(appAssembly.directory)).toEqual([
      'asset.73f25aa93681e01831ecafe334b79916f3cead51b5bc3cadbfc4459dbafd4a3c',
      'cdk.out',
      'manifest.json',
      'stack.metadata.json',
      'stack.template.json',
      'tree.json',
      'validation-report.json',
    ]);
  });

  test('bundling with OUTPUT hash type replaces existing asset directory, even if the hash is the same', () => {
    // GIVEN
    const directory = FIXTURE_TEST1_DIR;
    const props = {
      sourcePath: directory,
      assetHashType: AssetHashType.OUTPUT,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
      },
    };

    const app1 = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const staging1 = new AssetStaging(new Stack(app1, 'stack'), 'Asset', props);
    app1.synth();

    // Leave a marker in the staged directory, so we can tell whether it was replaced or merged into
    fs.writeFileSync(path.join(staging1.absoluteStagedPath, 'stale.txt'), 'stale');

    // Clear the in-memory cache so the second synth isn't bypassed
    AssetStaging.clearAssetHashCache();

    // WHEN - OUTPUT can't know its hash before bundling, so this bundles again onto the existing asset.<hash>
    const app2 = new App({ outdir: app1.outdir, context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const staging2 = new AssetStaging(new Stack(app2, 'stack'), 'Asset', props);
    app2.synth();

    // THEN
    const dockerRun = `run --rm ${USER_ARG} -v /input:/asset-input:${delegated} -v /output:/asset-output:${delegated} -w /asset-input alpine DOCKER_STUB_SUCCESS`;
    expect(readDockerStubInputConcat()).toEqual(`${dockerRun}\n${dockerRun}`);

    expect(staging2.assetHash).toEqual(staging1.assetHash);
    expect(staging2.absoluteStagedPath).toEqual(staging1.absoluteStagedPath);
    expect(fs.readdirSync(staging2.absoluteStagedPath)).toEqual(['test.txt']);
    expect(fs.readdirSync(app1.outdir).filter(f => f.startsWith('asset.'))).toEqual([`asset.${staging1.assetHash}`]);
  });

  test('bundler builds its image only when it bundles', () => {
    // GIVEN
    const TEST_OUTDIR = path.join(__dirname, 'cdk.out');
    if (fs.existsSync(TEST_OUTDIR)) {
      fs.removeSync(TEST_OUTDIR);
    }
    const image = DockerImage.fromRegistry('alpine');
    const build = jest.spyOn(image, 'buildImage');
    const bundling = {
      image,
      command: [DockerStubCommand.SUCCESS],
    };

    // WHEN
    const app = new App({ outdir: TEST_OUTDIR });
    new AssetStaging(new Stack(app, 'stack'), 'Asset', { sourcePath: FIXTURE_TEST1_DIR, bundling });
    // Once from asset staging before it sets up the container, once from DockerImage.run()
    expect(build).toHaveBeenCalledTimes(2);
    build.mockClear();
    AssetStaging.clearAssetHashCache();
    const app2 = new App({ outdir: TEST_OUTDIR });
    new AssetStaging(new Stack(app2, 'stack'), 'Asset', { sourcePath: FIXTURE_TEST1_DIR, bundling });

    // THEN
    expect(build).not.toHaveBeenCalled();
  });

  test('bundler fails before it sets up bundling containers when its on-demand image fails to build', () => {
    // GIVEN
    const stack = new Stack(new App(), 'stack');
    // The Docker stub fails every command without a stub keyword, including `build`
    const image = DockerImage.fromBuildV2(FIXTURE_TEST1_DIR);

    // WHEN
    expect(() => new AssetStaging(stack, 'Asset', {
      sourcePath: FIXTURE_TEST1_DIR,
      bundling: { image, command: [DockerStubCommand.SUCCESS], bundlingFileAccess: BundlingFileAccess.VOLUME_COPY },
    })).toThrow(/Failed to bundle asset/);

    // THEN
    const calls = fs.readFileSync(STUB_INPUT_CONCAT_FILE, 'utf-8').trim().split('\n');
    expect(calls.some(c => c.startsWith('build '))).toBe(true);
    expect(calls.filter(c => /^(volume create|create|run) /.test(c))).toEqual([]);
  });

  test('bundler works with an image object that has no buildImage method', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack');
    const run = jest.fn((options: { volumes?: { hostPath: string; containerPath: string }[] }) => {
      const output = options.volumes?.find(v => v.containerPath === AssetStaging.BUNDLING_OUTPUT_DIR);
      if (!output) {
        throw new Error('Expected an output volume');
      }
      fs.writeFileSync(path.join(output.hostPath, 'hello.txt'), 'hello');
    });

    // WHEN
    new AssetStaging(stack, 'Asset', {
      sourcePath: FIXTURE_TEST1_DIR,
      bundling: {
        image: { image: 'alpine', run, toJSON: () => 'alpine' } as any,
        command: ['echo'],
      },
    });

    // THEN
    expect(run).toHaveBeenCalled();
  });

  test('bundler does not build its image when local bundling succeeds', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack');
    const image = DockerImage.fromRegistry('alpine');
    const build = jest.spyOn(image, 'buildImage');

    // WHEN
    new AssetStaging(stack, 'Asset', {
      sourcePath: FIXTURE_TEST1_DIR,
      bundling: {
        image,
        local: {
          tryBundle(outputDir: string): boolean {
            fs.writeFileSync(path.join(outputDir, 'hello.txt'), 'hello');
            return true;
          },
        },
      },
    });

    // THEN
    expect(build).not.toHaveBeenCalled();
  });

  test('if bundling is interrupted, target asset directory is not produced', () => {
    // GIVEN
    const TEST_OUTDIR = path.join(__dirname, 'cdk.out');
    if (fs.existsSync(TEST_OUTDIR)) {
      fs.removeSync(TEST_OUTDIR);
    }

    // WHEN
    try {
      execSync(`npx ts-node --preferTsExts ${__dirname}/app-that-is-interrupted-during-staging.ts`, {
        env: {
          ...process.env,
          CDK_OUTDIR: TEST_OUTDIR,
        },
      });
      throw new Error('We expected the above command to fail');
    } catch (e: any) {
      // We expect the command to be terminated with a signal, which sometimes shows
      // as 'signal' is set to SIGTERM, and on some Linuxes as exitCode = 128 + 15 = 143
      if (e.signal === 'SIGTERM' || e.status === 143) {
        // pass
      } else {
        throw e;
      }
    }

    // THEN
    const generatedFiles = fs.readdirSync(TEST_OUTDIR);
    // We expect a 'building' asset directory...
    expect(generatedFiles).toContainEqual(
      expect.stringMatching(/^asset\.[0-9a-f]+-building$/),
    );
    // ...not a complete asset directory
    expect(generatedFiles).not.toContainEqual(
      expect.stringMatching(/^asset\.[0-9a-f]+$/),
    );
  });

  test('if copying is interrupted, target asset directory is not produced, and the next synth recovers', () => {
    // GIVEN
    const TEST_OUTDIR = path.join(__dirname, 'cdk.out');
    if (fs.existsSync(TEST_OUTDIR)) {
      fs.removeSync(TEST_OUTDIR);
    }

    // WHEN
    try {
      execSync(`npx ts-node --preferTsExts ${__dirname}/app-that-is-interrupted-during-copy.ts`, {
        env: {
          ...process.env,
          CDK_OUTDIR: TEST_OUTDIR,
        },
      });
      throw new Error('We expected the above command to fail');
    } catch (e: any) {
      // See 'if bundling is interrupted' for why both are checked
      if (e.signal === 'SIGTERM' || e.status === 143) {
        // pass
      } else {
        throw e;
      }
    }

    // THEN - only the half-written temporary directory exists...
    const generatedFiles = fs.readdirSync(TEST_OUTDIR);
    expect(generatedFiles).toContainEqual(`asset.${FIXTURE_TEST1_HASH}.tmp`);
    expect(generatedFiles).not.toContainEqual(`asset.${FIXTURE_TEST1_HASH}`);

    // ...and a regular synth into the same directory produces the complete asset
    AssetStaging.clearAssetHashCache();
    const app = new App({ outdir: TEST_OUTDIR });
    const staging = new AssetStaging(new Stack(app, 'stack'), 'Asset', { sourcePath: FIXTURE_TEST1_DIR });
    app.synth();

    expect(fs.readdirSync(staging.absoluteStagedPath).sort()).toEqual(fs.readdirSync(FIXTURE_TEST1_DIR).sort());
    expect(fs.readdirSync(TEST_OUTDIR)).not.toContainEqual(expect.stringMatching(/\.tmp$/));
  });

  test('bundler re-uses assets from previous synths, ignoring tokens', () => {
    // GIVEN
    const TEST_OUTDIR = path.join(__dirname, 'cdk.out');
    if (fs.existsSync(TEST_OUTDIR)) {
      fs.removeSync(TEST_OUTDIR);
    }

    const app = new App({ outdir: TEST_OUTDIR, context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
        environment: {
          PIP_EXTRA_INDEX_URL: 'https://aws:MY_SECRET_TOKEN@your-code-repo.d.codeartifact.us-west-2.amazonaws.com/pypi/python/simple/',
        },
      },
    });

    // Clear asset hash cache to show that during the second synth bundling
    // will consider the existing bundling dir (file system cache).
    AssetStaging.clearAssetHashCache();

    // GIVEN
    const app2 = new App({ outdir: TEST_OUTDIR, context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack2 = new Stack(app2, 'stack');

    // WHEN
    new AssetStaging(stack2, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
        environment: {
          PIP_EXTRA_INDEX_URL: 'https://aws:MY_OTHER_SECRET_TOKEN@your-code-repo.d.codeartifact.us-west-2.amazonaws.com/pypi/python/simple/',
        },
      },
    });

    // THEN
    const appAssembly = app.synth();
    const app2Assembly = app2.synth();

    expect(
      readDockerStubInputConcat()).toEqual(
      `run --rm ${USER_ARG} -v /input:/asset-input:${delegated} -v /output:/asset-output:${delegated} --env PIP_EXTRA_INDEX_URL=https://aws:MY_SECRET_TOKEN@your-code-repo.d.codeartifact.us-west-2.amazonaws.com/pypi/python/simple/ -w /asset-input alpine DOCKER_STUB_SUCCESS`,
    );

    expect(appAssembly.directory).toEqual(app2Assembly.directory);
    expect(fs.readdirSync(appAssembly.directory)).toEqual([
      'asset.2a30c05d99c7036854ab5df0a01e8fbf1fad277598e2b0b6a2a29c7e09ebb4dc',
      'cdk.out',
      'manifest.json',
      'stack.metadata.json',
      'stack.template.json',
      'tree.json',
      'validation-report.json',
    ]);
  });

  test('bundling throws when /asset-output is empty', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // THEN
    expect(() => new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS_NO_OUTPUT],
      },
    })).toThrow(/Bundling did not produce any output/);

    expect(
      readDockerStubInput()).toEqual(
      `run --rm ${USER_ARG} -v /input:/asset-input:${delegated} -v /output:/asset-output:${delegated} -w /asset-input alpine DOCKER_STUB_SUCCESS_NO_OUTPUT`,
    );
  });

  testDeprecated('bundling with BUNDLE asset hash type', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    const asset = new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
      },
      assetHashType: AssetHashType.BUNDLE,
    });

    // THEN
    expect(
      readDockerStubInput()).toEqual(
      `run --rm ${USER_ARG} -v /input:/asset-input:${delegated} -v /output:/asset-output:${delegated} -w /asset-input alpine DOCKER_STUB_SUCCESS`,
    );
    expect(asset.assetHash).toEqual(DOCKER_STUB_SUCCESS_HASH);
  });

  test('bundling with docker security option', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    const asset = new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
        securityOpt: 'no-new-privileges',
      },
      assetHashType: AssetHashType.BUNDLE,
    });

    // THEN
    expect(
      readDockerStubInput()).toEqual(
      `run --rm --security-opt no-new-privileges ${USER_ARG} -v /input:/asset-input:${delegated} -v /output:/asset-output:${delegated} -w /asset-input alpine DOCKER_STUB_SUCCESS`,
    );
    expect(asset.assetHash).toEqual(DOCKER_STUB_SUCCESS_HASH);
  });

  test('bundling forwards sshForwarding through to docker run', () => {
    // GIVEN
    sinon.stub(process, 'env').value({ ...process.env, SSH_AUTH_SOCK: '/tmp/ssh-agent.sock' });
    const app = new App();
    const stack = new Stack(app, 'stack');
    const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');

    // WHEN
    new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
        sshForwarding: true,
      },
      assetHashType: AssetHashType.BUNDLE,
    });

    // THEN
    expect(
      readDockerStubInput()).toEqual(
      `run --rm ${USER_ARG} -v /input:/asset-input:${delegated} -v /output:/asset-output:${delegated} -v /tmp/ssh-agent.sock:/run/host-services/ssh-auth.sock:${delegated} --env SSH_AUTH_SOCK=/run/host-services/ssh-auth.sock -w /asset-input alpine DOCKER_STUB_SUCCESS`,
    );
  });

  test('bundling with sshForwarding throws when SSH_AUTH_SOCK is not set on the host', () => {
    // GIVEN
    const { SSH_AUTH_SOCK: _omit, ...envWithoutSshAuthSock } = process.env;
    sinon.stub(process, 'env').value(envWithoutSshAuthSock);
    const app = new App();
    const stack = new Stack(app, 'stack');
    const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');

    // WHEN / THEN
    expect(() => new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
        sshForwarding: true,
      },
    })).toThrow(/SSH_AUTH_SOCK environment variable is not set/);
  });

  test('bundling with docker entrypoint', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    const asset = new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        entrypoint: [DockerStubCommand.SUCCESS],
        command: [DockerStubCommand.SUCCESS],
      },
      assetHashType: AssetHashType.OUTPUT,
    });

    // THEN
    expect(
      readDockerStubInput()).toEqual(
      `run --rm ${USER_ARG} -v /input:/asset-input:${delegated} -v /output:/asset-output:${delegated} -w /asset-input --entrypoint DOCKER_STUB_SUCCESS alpine DOCKER_STUB_SUCCESS`,
    );
    expect(asset.assetHash).toEqual(DOCKER_STUB_SUCCESS_HASH);
  });

  test('bundling with OUTPUT asset hash type', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    const asset = new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
      },
      assetHashType: AssetHashType.OUTPUT,
    });

    // THEN
    expect(asset.assetHash).toEqual(DOCKER_STUB_SUCCESS_HASH);
  });

  describe('OUTPUT asset hash ignores the source fingerprinting options', () => {
    // The output has a regular file and an internal symlink, so `exclude` and `follow`
    // would both change the fingerprint if they were applied to it.
    const BASE_PROPS: AssetStagingProps = {
      sourcePath: path.join(FIXTURE_TEST1_DIR, 'subdir'),
      assetHashType: AssetHashType.OUTPUT,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.DIR_WITH_LOCAL_SYMLINK],
        outputType: BundlingOutput.NOT_ARCHIVED,
      },
    };

    function outputHash(props: Partial<AssetStagingProps>) {
      // Each construction must really bundle and hash, not be served from the in-memory cache
      AssetStaging.clearAssetHashCache();
      const stack = new Stack(new App(), 'stack');
      return new AssetStaging(stack, 'Asset', { ...BASE_PROPS, ...props }).assetHash;
    }

    test.each<[string, Partial<AssetStagingProps>]>([
      ['exclude', { exclude: ['test.txt'] }],
      ['ignoreMode', { ignoreMode: IgnoreMode.DOCKER }],
      ['exclude with ignoreMode', { exclude: ['test.txt'], ignoreMode: IgnoreMode.GIT }],
      ['follow ALWAYS', { follow: SymlinkFollowMode.ALWAYS }],
      ['follow EXTERNAL', { follow: SymlinkFollowMode.EXTERNAL }],
      ['follow NEVER', { follow: SymlinkFollowMode.NEVER }],
    ])('%s does not change the hash', (_, props) => {
      expect(outputHash(props)).toEqual(outputHash({}));
    });

    // Control: the hash does react to inputs that are documented to affect it
    test('extraHash does change the hash', () => {
      expect(outputHash({ extraHash: 'extra' })).not.toEqual(outputHash({}));
    });
  });

  test('custom hash', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    const asset = new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      assetHash: 'my-custom-hash',
    });

    // THEN
    expect(fs.existsSync(STUB_INPUT_FILE)).toEqual(false);
    expect(asset.assetHash).toEqual('b9c77053f5b83bbe5ba343bc18e92db939a49017010813225fea91fa892c4823'); // hash of 'my-custom-hash'
  });

  test('throws with assetHash and not CUSTOM hash type', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // THEN
    expect(() => new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
      },
      assetHash: 'my-custom-hash',
      assetHashType: AssetHashType.OUTPUT,
    })).toThrow(/Cannot specify `output` for `assetHashType`/);
  });

  testDeprecated('throws with BUNDLE hash type and no bundling', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // THEN
    expect(() => new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      assetHashType: AssetHashType.BUNDLE,
    })).toThrow(/Cannot use `bundle` hash type when `bundling` is not specified/);
    expect(fs.existsSync(STUB_INPUT_FILE)).toEqual(false);
  });

  test('throws with OUTPUT hash type and no bundling', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // THEN
    expect(() => new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      assetHashType: AssetHashType.OUTPUT,
    })).toThrow(/Cannot use `output` hash type when `bundling` is not specified/);
    expect(fs.existsSync(STUB_INPUT_FILE)).toEqual(false);
  });

  test('throws with CUSTOM and no hash', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // THEN
    expect(() => new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      assetHashType: AssetHashType.CUSTOM,
    })).toThrow(/`assetHash` must be specified when `assetHashType` is set to `AssetHashType.CUSTOM`/);
    expect(fs.existsSync(STUB_INPUT_FILE)).toEqual(false); // "docker" not executed
  });

  test('throws when bundling fails', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // THEN
    expect(() => new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('this-is-an-invalid-docker-image'),
        command: [DockerStubCommand.FAIL],
      },
    })).toThrow(/Failed to bundle asset stack\/Asset/);
    expect(
      readDockerStubInput()).toEqual(
      `run --rm ${USER_ARG} -v /input:/asset-input:${delegated} -v /output:/asset-output:${delegated} -w /asset-input this-is-an-invalid-docker-image DOCKER_STUB_FAIL`,
    );
  });

  test('with local bundling', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    let dir: string | undefined;
    let opts: BundlingOptions | undefined;
    new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
        local: {
          tryBundle(outputDir: string, options: BundlingOptions): boolean {
            dir = outputDir;
            opts = options;
            fs.writeFileSync(path.join(outputDir, 'hello.txt'), 'hello'); // output cannot be empty
            return true;
          },
        },
      },
    });

    // THEN
    expect(dir && /asset.[0-9a-f]{16,}/.test(dir)).toEqual(true);
    expect(opts?.command?.[0]).toEqual(DockerStubCommand.SUCCESS);
    expect(() => readDockerStubInput()).toThrow();

    if (dir) {
      fs.removeSync(path.join(dir, 'hello.txt'));
    }
  });

  test('with local bundling returning false', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
        local: {
          tryBundle(_bundleDir: string): boolean {
            return false;
          },
        },
      },
    });

    // THEN
    expect(readDockerStubInput()).toBeDefined();
  });

  test('bundling can be skipped by setting context', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    stack.node.setContext(cxapi.BUNDLING_STACKS, ['OtherStack']);
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    const asset = new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      assetHashType: AssetHashType.OUTPUT,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
      },
    });

    expect(() => readDockerStubInput()).toThrow(); // Bundling did not run
    expect(asset.sourcePath).toEqual(directory);
    expect(asset.stagedPath).toEqual(directory);
    expect(asset.relativeStagedPath(stack)).toEqual(directory);
    expect(asset.assetHash).toEqual('729a2fdb899011ee9f3f226f4cfc03b1c2a83b97ff9c4105192430e6bc18bff3');
  });

  test('correctly skips bundling with stack under stage', () => {
    // GIVEN
    const app = new App();

    const stage = new Stage(app, 'Stage');
    stage.node.setContext(cxapi.BUNDLING_STACKS, ['Stage/Stack1']);

    const stack1 = new Stack(stage, 'Stack1');
    const stack2 = new Stack(stage, 'Stack2');
    const directory = FIXTURE_TEST1_DIR;

    new AssetStaging(stack1, 'Asset', {
      sourcePath: directory,
      assetHashType: AssetHashType.OUTPUT,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
      },
    });

    new AssetStaging(stack2, 'Asset', {
      sourcePath: directory,
      assetHashType: AssetHashType.OUTPUT,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.MULTIPLE_FILES],
      },
    });

    const dockerStubInput = readDockerStubInputConcat();
    // Docker ran for the asset in Stack1
    expect(dockerStubInput).toMatch(DockerStubCommand.SUCCESS);
    // DOcker did not run for the asset in Stack2
    expect(dockerStubInput).not.toMatch(DockerStubCommand.MULTIPLE_FILES);
  });

  test('correctly skips bundling with stack under stage and custom stack name', () => {
    // GIVEN
    const app = new App();

    const stage = new Stage(app, 'Stage');
    stage.node.setContext(cxapi.BUNDLING_STACKS, ['Stage/Stack1']);

    const stack1 = new Stack(stage, 'Stack1', { stackName: 'unrelated-stack1-name' });
    const stack2 = new Stack(stage, 'Stack2', { stackName: 'unrelated-stack2-name' });
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    new AssetStaging(stack1, 'Asset', {
      sourcePath: directory,
      assetHashType: AssetHashType.OUTPUT,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
      },
    });

    new AssetStaging(stack2, 'Asset', {
      sourcePath: directory,
      assetHashType: AssetHashType.OUTPUT,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.MULTIPLE_FILES],
      },
    });

    // THEN
    const dockerStubInput = readDockerStubInputConcat();
    // Docker ran for the asset in Stack1
    expect(dockerStubInput).toMatch(DockerStubCommand.SUCCESS);
    // Docker did not run for the asset in Stack2
    expect(dockerStubInput).not.toMatch(DockerStubCommand.MULTIPLE_FILES);
  });

  test('correctly skips bundling with stack under stage and nested stack', () => {
    // GIVEN
    const app = new App();

    const stage = new Stage(app, 'Stage');
    stage.node.setContext(cxapi.BUNDLING_STACKS, ['Stage/Stack1']);

    const stack1 = new Stack(stage, 'Stack1', { stackName: 'unrelated-stack1-name' });
    const stack1Nested = new NestedStack(stack1, 'Stack1Nest');

    const stack2 = new Stack(stage, 'Stack2', { stackName: 'unrelated-stack2-name' });
    const stack2Nested = new NestedStack(stack2, 'Stack2Nest');

    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    new AssetStaging(stack1Nested, 'Asset', {
      sourcePath: directory,
      assetHashType: AssetHashType.OUTPUT,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
      },
    });

    new AssetStaging(stack2Nested, 'Asset', {
      sourcePath: directory,
      assetHashType: AssetHashType.OUTPUT,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.MULTIPLE_FILES],
      },
    });

    // THEN
    const dockerStubInput = readDockerStubInputConcat();
    // Docker ran for the asset in Stack1
    expect(dockerStubInput).toMatch(DockerStubCommand.SUCCESS);
    // Docker did not run for the asset in Stack2
    expect(dockerStubInput).not.toMatch(DockerStubCommand.MULTIPLE_FILES);
  });

  test('correctly bundles with stack under stage and the default stack pattern', () => {
    // GIVEN
    const app = new App();

    const stage = new Stage(app, 'Stage');

    const stack1 = new Stack(stage, 'Stack1');
    const stack2 = new Stack(stage, 'Stack2');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    new AssetStaging(stack1, 'Asset', {
      sourcePath: directory,
      assetHashType: AssetHashType.OUTPUT,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
      },
    });

    new AssetStaging(stack2, 'Asset', {
      sourcePath: directory,
      assetHashType: AssetHashType.OUTPUT,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.MULTIPLE_FILES],
      },
    });

    // THEN
    const dockerStubInput = readDockerStubInputConcat();
    // Docker ran for the asset in Stack1
    expect(dockerStubInput).toMatch(DockerStubCommand.SUCCESS);
    // Docker ran for the asset in Stack2
    expect(dockerStubInput).toMatch(DockerStubCommand.MULTIPLE_FILES);
  });

  test('correctly bundles with stack under stage and partial globstar wildcard', () => {
    // GIVEN
    const app = new App();

    const stage = new Stage(app, 'Stage');
    stage.node.setContext(cxapi.BUNDLING_STACKS, ['**/Stack1']); // a single wildcard prefix ('*Stack1') won't match

    const stack1 = new Stack(stage, 'Stack1');
    const stack2 = new Stack(stage, 'Stack2');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    new AssetStaging(stack1, 'Asset', {
      sourcePath: directory,
      assetHashType: AssetHashType.OUTPUT,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
      },
    });

    new AssetStaging(stack2, 'Asset', {
      sourcePath: directory,
      assetHashType: AssetHashType.OUTPUT,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.MULTIPLE_FILES],
      },
    });

    // THEN
    const dockerStubInput = readDockerStubInputConcat();
    // Docker ran for the asset in Stack1
    expect(dockerStubInput).toMatch(DockerStubCommand.SUCCESS);
    // Docker did not run for the asset in Stack2
    expect(dockerStubInput).not.toMatch(DockerStubCommand.MULTIPLE_FILES);
  });

  test('correctly bundles selected stacks nested in Stack/Stage/Stack', () => {
    // GIVEN
    const app = new App();

    const topStack = new Stack(app, 'TopStack');
    topStack.node.setContext(cxapi.BUNDLING_STACKS, ['TopStack/MiddleStage/BottomStack']);

    const middleStage = new Stage(topStack, 'MiddleStage');
    const bottomStack = new Stack(middleStage, 'BottomStack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    new AssetStaging(bottomStack, 'Asset', {
      sourcePath: directory,
      assetHashType: AssetHashType.OUTPUT,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
      },
    });
    new AssetStaging(topStack, 'Asset', {
      sourcePath: directory,
      assetHashType: AssetHashType.OUTPUT,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.MULTIPLE_FILES],
      },
    });

    const dockerStubInput = readDockerStubInputConcat();
    // Docker ran for the asset in BottomStack
    expect(dockerStubInput).toMatch(DockerStubCommand.SUCCESS);
    // Docker did not run for the asset in TopStack
    expect(dockerStubInput).not.toMatch(DockerStubCommand.MULTIPLE_FILES);
  });

  test('bundling still occurs with partial wildcard', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    stack.node.setContext(cxapi.BUNDLING_STACKS, ['*Stack']);
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    const asset = new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      assetHashType: AssetHashType.OUTPUT,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
      },
    });

    expect(
      readDockerStubInput()).toEqual(
      `run --rm ${USER_ARG} -v /input:/asset-input:${delegated} -v /output:/asset-output:${delegated} -w /asset-input alpine DOCKER_STUB_SUCCESS`,
    );
    expect(asset.assetHash).toEqual(DOCKER_STUB_SUCCESS_HASH); // hash of MyStack/Asset
  });

  test('bundling still occurs with a single wildcard', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'MyStack');
    stack.node.setContext(cxapi.BUNDLING_STACKS, ['*']);
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    const asset = new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      assetHashType: AssetHashType.OUTPUT,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SUCCESS],
      },
    });

    expect(
      readDockerStubInput()).toEqual(
      `run --rm ${USER_ARG} -v /input:/asset-input:${delegated} -v /output:/asset-output:${delegated} -w /asset-input alpine DOCKER_STUB_SUCCESS`,
    );
    expect(asset.assetHash).toEqual(DOCKER_STUB_SUCCESS_HASH); // hash of MyStack/Asset
  });

  test('bundling that produces a single archive file is autodiscovered', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    const staging = new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SINGLE_ARCHIVE],
      },
    });

    // THEN
    const assembly = app.synth();
    expect(fs.readdirSync(assembly.directory)).toEqual([
      'asset.ab484104b6aae238176ac35262399d0db8aee2c7d385b27a10f8e0722b3512a9', // this is the bundle dir
      'cdk.out',
      'manifest.json',
      'stack.metadata.json',
      'stack.template.json',
      'tree.json',
      'validation-report.json',
    ]);
    expect(fs.readdirSync(path.join(assembly.directory, 'asset.ab484104b6aae238176ac35262399d0db8aee2c7d385b27a10f8e0722b3512a9'))).toEqual([
      'test.zip', // bundle dir with "touched" bundled output file
    ]);
    expect(staging.packaging).toEqual(FileAssetPackaging.FILE);
    expect(staging.isArchive).toEqual(true);
  });

  test('bundling that produces a single archive file with disk cache', () => {
    // GIVEN
    const TEST_OUTDIR = path.join(__dirname, 'cdk.out');
    if (fs.existsSync(TEST_OUTDIR)) {
      fs.removeSync(TEST_OUTDIR);
    }

    const directory = FIXTURE_TEST1_DIR;

    const app1 = new App({ outdir: TEST_OUTDIR });
    const stack1 = new Stack(app1, 'Stack');

    const app2 = new App({ outdir: TEST_OUTDIR }); // same OUTDIR
    const stack2 = new Stack(app2, 'stack');

    // WHEN
    const staging1 = new AssetStaging(stack1, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SINGLE_ARCHIVE],
        outputType: BundlingOutput.ARCHIVED,
      },
    });

    // Now clear asset hash cache to show that during the second staging
    // even though bundling is skipped it will correctly be considered
    // as a FileAssetPackaging.FILE.
    AssetStaging.clearAssetHashCache();

    const staging2 = new AssetStaging(stack2, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SINGLE_ARCHIVE],
        outputType: BundlingOutput.ARCHIVED,
      },
    });

    // THEN
    expect(staging1.packaging).toEqual(FileAssetPackaging.FILE);
    expect(staging1.isArchive).toEqual(true);
    expect(staging2.packaging).toEqual(staging1.packaging);
    expect(staging2.isArchive).toEqual(staging1.isArchive);
  });

  test.each(['normal', 'legacy placeholder'] as const)('bundling if the bundling dir already exists: %s', (mode) => {
    // The old implementation used to move a SINGLE_FILE bundling output to a sibling file and leave a 0-byte placeholder behind.
    // We don't do that anymore, but we also have to be sure not to mistake a 0-byte placeholder for a complete asset.
    // mode='normal': write a zip file with contents, we expect bundling to be skipped
    // mode='legacy placeholder': write an empty zip file, we expect bundling to be performed

    const app = new App({ });
    const stack = new Stack(app, 'Stack');

    // Will get asset properties mixed into the custom hash
    const predictedAssetHash = '528df5030cd644fab9bf55368aea1a6914b20290ec6e231d34eb6b298a2e2674';

    const assetDir = path.join(app.assetOutdir, `asset.${predictedAssetHash}`);
    fs.mkdirSync(assetDir, { recursive: true });
    fs.writeFileSync(path.join(assetDir, 'test.zip'), mode === 'normal' ? 'zip contents' : '');

    let bundleCount = 0;
    const staging = new AssetStaging(stack, 'Asset', {
      sourcePath: FIXTURE_TEST1_DIR,

      // Easiest way to make this collission is to use a CUSTOM hash
      assetHash: 'custom-hash',

      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        outputType: BundlingOutput.ARCHIVED,
        local: {
          tryBundle(outputDir: string) {
            bundleCount++;
            fs.writeFileSync(path.join(outputDir, 'test.zip'), 'zip contents');
            return true;
          },
        },
      },
    });

    // Compare this first so that we can fix the source code if the predicted hash ever changes
    expect(staging.assetHash).toEqual(predictedAssetHash);

    expect(bundleCount).toEqual(mode === 'normal' ? 0 : 1);
  });

  test('bundling that produces a single archive file with NOT_ARCHIVED', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    const staging = new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SINGLE_ARCHIVE],
        outputType: BundlingOutput.NOT_ARCHIVED,
      },
    });

    // THEN
    const assembly = app.synth();
    expect(fs.readdirSync(assembly.directory)).toEqual([
      'asset.7c7d7f5e01d066e4167fee3b098f209de7f45e1be53b77e2b757df73a749f1ea',
      'cdk.out',
      'manifest.json',
      'stack.metadata.json',
      'stack.template.json',
      'tree.json',
      'validation-report.json',
    ]);
    expect(staging.packaging).toEqual(FileAssetPackaging.ZIP_DIRECTORY);
    expect(staging.isArchive).toEqual(true);
  });

  test('throws with ARCHIVED and bundling that does not produce a single archive file', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    expect(() => new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.MULTIPLE_FILES],
        outputType: BundlingOutput.ARCHIVED,
      },
    })).toThrow(/Bundling output directory is expected to include only a single file when `output` is set to `ARCHIVED` or `SINGLE_FILE`/);
  });

  test('rejects bundled output that is a symlink', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN / THEN
    expect(() => new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SYMLINK],
      },
    })).toThrow(/output from bundling is not allowed to be a symlink/);
  });

  test('bundling that produces a single file with SINGLE_FILE', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'stack');
    const directory = path.join(FIXTURE_TEST1_DIR, 'subdir');

    // WHEN
    const staging = new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SINGLE_FILE],
        outputType: BundlingOutput.SINGLE_FILE,
      },
    });

    // THEN
    const assembly = app.synth();
    expect(fs.readdirSync(assembly.directory)).toEqual([
      'asset.adb7bb3f9419564842d16f48e6b90468f63ec759d2775e8e40d6a87e6b8e3469',
      'cdk.out',
      'manifest.json',
      'stack.metadata.json',
      'stack.template.json',
      'tree.json',
      'validation-report.json',
    ]);
    expect(staging.packaging).toEqual(FileAssetPackaging.FILE);
    expect(staging.isArchive).toEqual(false);
  });

  test.each([
    ['test.zip', true],
    ['test.jar', true],
    ['test.tar.gz', true],
    ['test.txt', false],
  ])('bundling that produces a single file %p with SINGLE_FILE sets isArchive to %p', (fileName, expectedIsArchive) => {
    // GIVEN
    AssetStaging.clearAssetHashCache();
    const stack = new Stack(new App(), 'stack');

    // WHEN
    const staging = new AssetStaging(stack, 'Asset', {
      sourcePath: FIXTURE_TEST1_DIR,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        outputType: BundlingOutput.SINGLE_FILE,
        environment: { FILE_NAME: fileName }, // keeps the cases from sharing a source hash
        local: {
          tryBundle(outputDir: string) {
            fs.writeFileSync(path.join(outputDir, fileName), 'contents');
            return true;
          },
        },
      },
    });

    // THEN
    expect(path.basename(staging.absoluteStagedPath)).toEqual(fileName);
    expect(staging.packaging).toEqual(FileAssetPackaging.FILE);
    expect(staging.isArchive).toEqual(expectedIsArchive);
  });

  test('bundling that produces a single file with SINGLE_FILE and hash type OUTPUT', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'stack');
    const directory = path.join(FIXTURE_TEST1_DIR, 'subdir');

    // WHEN
    const staging = new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      assetHashType: AssetHashType.OUTPUT,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SINGLE_FILE],
        outputType: BundlingOutput.SINGLE_FILE,
      },
    });

    // THEN
    const assembly = app.synth();
    expect(fs.readdirSync(assembly.directory)).toEqual([
      // 'bundling-temp-0e346bd27baa32f4f2d15d1d73c8972db3293080f6c2836328b7bf77747683db', this directory gets removed and does no longer exist
      'asset.a21231a7501c0fa20720b8e4c708417bf3b20a5bfe2b9b42af04917a1392a4eb',
      'cdk.out',
      'manifest.json',
      'stack.metadata.json',
      'stack.template.json',
      'tree.json',
      'validation-report.json',
    ]);
    expect(staging.packaging).toEqual(FileAssetPackaging.FILE);
    expect(staging.isArchive).toEqual(false);
  });

  test('bundling that produces a single file with SINGLE_FILE_WITHOUT_EXT and hash type SOURCE', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    const staging = new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SINGLE_FILE_WITHOUT_EXT],
        outputType: BundlingOutput.SINGLE_FILE,
      },
      assetHashType: AssetHashType.SOURCE, // default
    });

    // THEN
    const assembly = app.synth();
    expect(fs.readdirSync(assembly.directory)).toEqual([
      'asset.390ed165e2a0a8741f7c86d1c9cd5c0c5aa251e234f5785cda765b25611e1df4',
      'cdk.out',
      'manifest.json',
      'stack.metadata.json',
      'stack.template.json',
      'tree.json',
      'validation-report.json',
    ]);
    expect(staging.packaging).toEqual(FileAssetPackaging.FILE);
    expect(staging.isArchive).toEqual(false);
  });

  test('bundling that produces a single file with SINGLE_FILE_WITHOUT_EXT and hash type CUSTOM', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    const staging = new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SINGLE_FILE_WITHOUT_EXT],
        outputType: BundlingOutput.SINGLE_FILE,
      },
      assetHashType: AssetHashType.CUSTOM,
      assetHash: 'custom',
    });

    // THEN
    const assembly = app.synth();
    expect(fs.readdirSync(assembly.directory)).toEqual([
      'asset.f81c5ba9e81eebb202881a8e61a83ab4b69f6bee261989eb93625c9cf5d35335',
      'cdk.out',
      'manifest.json',
      'stack.metadata.json',
      'stack.template.json',
      'tree.json',
      'validation-report.json',
    ]);
    expect(staging.packaging).toEqual(FileAssetPackaging.FILE);
    expect(staging.isArchive).toEqual(false);
  });

  describe('bundling output that is a single symbolic link', () => {
    const SYMLINK_THROW = /forbids the symbolic link/;

    test.each([
      [undefined], // EXTERNAL is also the default when `follow` is unset
      [SymlinkFollowMode.EXTERNAL],
      [SymlinkFollowMode.ALWAYS],
      [SymlinkFollowMode.NEVER],
    ])('follows an external symlink under mode %s and uses it as a single-file asset', (follow) => {
      // GIVEN
      const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
      const stack = new Stack(app, 'stack');
      const directory = FIXTURE_TEST1_DIR;

      // WHEN
      const staging = new AssetStaging(stack, 'Asset', {
        sourcePath: directory,
        assetHashType: AssetHashType.OUTPUT,
        follow,
        bundling: {
          image: DockerImage.fromRegistry('alpine'),
          command: [DockerStubCommand.SINGLE_FILE],
          outputType: BundlingOutput.SINGLE_FILE,
        },
      });

      expect(staging.packaging).toEqual(FileAssetPackaging.FILE);
      expect(staging.isArchive).toEqual(false);
    });

    test.each([
      [AssetHashType.SOURCE, true],
      [AssetHashType.OUTPUT, false],
      [AssetHashType.CUSTOM, false],
    ])('BLOCK_EXTERNAL with an external symlink in the source directory and AssetHashType %p throws: %p', (assetHashType, expected) => {
      // GIVEN
      const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
      const stack = new Stack(app, 'stack');
      const directory = FIXTURE_TEST1_DIR;

      // WHEN - we should throw because there is an external symlink in the /test1 fixture
      const theStaging = () => new AssetStaging(stack, 'Asset', {
        sourcePath: directory,
        assetHashType,
        follow: SymlinkFollowMode.BLOCK_EXTERNAL,
        assetHash: assetHashType === AssetHashType.CUSTOM ? 'custom-hash' : undefined,
        bundling: {
          image: DockerImage.fromRegistry('alpine'),
          command: [DockerStubCommand.SINGLE_FILE],
          outputType: BundlingOutput.SINGLE_FILE,
        },
      });

      if (expected) {
        expect(theStaging).toThrow(SYMLINK_THROW);
      } else {
        theStaging();
        // Expecting to get here without an exception
      }
    });

    test.each([
      [AssetHashType.SOURCE, false],
      [AssetHashType.OUTPUT, false],
      [AssetHashType.CUSTOM, false],
      [AssetHashType.SOURCE, true],
      [AssetHashType.OUTPUT, true],
      [AssetHashType.CUSTOM, true],
    ])('BLOCK_EXTERNAL leads to blocking external symlinks in the bundled output with AssetHashType %p, event with exludes %p', (assetHashType, useExcludes) => {
      // GIVEN
      const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
      const stack = new Stack(app, 'stack');
      const directory = path.join(FIXTURE_TEST1_DIR, 'subdir');

      expect(() => new AssetStaging(stack, 'Asset', {
        sourcePath: directory,
        assetHashType,
        assetHash: assetHashType === AssetHashType.CUSTOM ? 'custom-hash' : undefined,
        follow: SymlinkFollowMode.BLOCK_EXTERNAL,
        exclude: useExcludes ? ['*'] : undefined,
        bundling: {
          image: DockerImage.fromRegistry('alpine'),
          command: [DockerStubCommand.DIR_WITH_EXTERNAL_SYMLINK],
        },
      })).toThrow(SYMLINK_THROW);
    });

    test('does not fail if there is a local link', () => {
      // GIVEN
      const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
      const stack = new Stack(app, 'stack');
      const directory = path.join(FIXTURE_TEST1_DIR, 'subdir4');

      // WHEN - should be successful if we are dealing with a local symlink
      const staging = new AssetStaging(stack, 'Asset', {
        sourcePath: directory,
        assetHashType: AssetHashType.OUTPUT,
        follow: SymlinkFollowMode.BLOCK_EXTERNAL,
        bundling: {
          image: DockerImage.fromRegistry('alpine'),
          command: [DockerStubCommand.SINGLE_FILE],
          outputType: BundlingOutput.SINGLE_FILE,
        },
      });

      const assembly = app.synth();

      expect(staging.packaging).toEqual(FileAssetPackaging.FILE);
      expect(staging.isArchive).toEqual(false);

      expect(fs.readdirSync(assembly.directory)).toEqual([
        'asset.96cb3cd74e6a266f73bac604d3fbd467be211facec5b06cd0ab12936112f4bf4',
        'cdk.out',
        'manifest.json',
        'stack.metadata.json',
        'stack.template.json',
        'tree.json',
        'validation-report.json',
      ]);
    });

    // A top-level source symlink has no enclosing "source tree" to escape, the link is
    // followed, a real regular file is written. BLOCK_EXTERNAL must NOT reject
    // the symlink whether the link target is inside or outside the link's
    // own directory - the staged asset ends up self-contained.

    test('does not fail under BLOCK_EXTERNAL when the source is an external file symlink, and materializes it', () => {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'stack');
      // external-link.txt -> ../symlinks/normal-file.txt (target is outside the link's directory)
      const sourcePath = path.join(FIXTURE_TEST1_DIR, 'external-link.txt');

      // WHEN
      const staging = new AssetStaging(stack, 'Asset', {
        sourcePath,
        follow: SymlinkFollowMode.BLOCK_EXTERNAL,
      });
      app.synth();

      // THEN - staged as a single, self-contained file with the target's content inlined
      expect(staging.packaging).toEqual(FileAssetPackaging.FILE);
      expect(staging.isArchive).toEqual(false);
      const staged = staging.absoluteStagedPath;
      expect(fs.lstatSync(staged).isSymbolicLink()).toBe(false);
      expect(fs.readFileSync(staged, 'utf8')).toEqual('this is a normal file\n');
    });

    test('does not fail under BLOCK_EXTERNAL when the source is a local file symlink, and materializes it', () => {
      // GIVEN
      const app = new App();
      const stack = new Stack(app, 'stack');
      // local-link.txt -> file1.txt (target is inside the link's directory)
      const sourcePath = path.join(FIXTURE_TEST1_DIR, 'local-link.txt');

      // WHEN
      const staging = new AssetStaging(stack, 'Asset', {
        sourcePath,
        follow: SymlinkFollowMode.BLOCK_EXTERNAL,
      });
      app.synth();

      // THEN
      expect(staging.packaging).toEqual(FileAssetPackaging.FILE);
      expect(staging.isArchive).toEqual(false);
      const staged = staging.absoluteStagedPath;
      expect(fs.lstatSync(staged).isSymbolicLink()).toBe(false);
      expect(fs.readFileSync(staged, 'utf8')).toEqual('file1\n');
    });
  });

  describe('bundling output that is a directory containing symbolic links', () => {
    const SYMLINK_THROW = /forbids the symbolic link/;

    // The source directory has no symlinks of its own, so only the symlinks that bundling
    // writes into the output directory can trigger the BLOCK_EXTERNAL check.
    const directory = path.join(FIXTURE_TEST1_DIR, 'subdir');

    test('fails under mode BLOCK_EXTERNAL if the bundling output contains an external symlink', () => {
      // GIVEN
      const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
      const stack = new Stack(app, 'stack');

      // WHEN - bundling writes an external symlink next to a second file, so the output is
      // a directory (ZIP_DIRECTORY) instead of a single archive
      expect(() => new AssetStaging(stack, 'Asset', {
        sourcePath: directory,
        follow: SymlinkFollowMode.BLOCK_EXTERNAL,
        bundling: {
          image: DockerImage.fromRegistry('alpine'),
          command: [DockerStubCommand.DIR_WITH_EXTERNAL_SYMLINK],
        },
      })).toThrow(SYMLINK_THROW);
    });

    test('fails under mode BLOCK_EXTERNAL if the bundling output contains an external symlink and outputType is NOT_ARCHIVED', () => {
      // GIVEN
      const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
      const stack = new Stack(app, 'stack');

      // WHEN - we throw whether NOT_ARCHIVED was asked for or auto-discovered
      expect(() => new AssetStaging(stack, 'Asset', {
        sourcePath: directory,
        follow: SymlinkFollowMode.BLOCK_EXTERNAL,
        bundling: {
          image: DockerImage.fromRegistry('alpine'),
          command: [DockerStubCommand.DIR_WITH_EXTERNAL_SYMLINK],
          outputType: BundlingOutput.NOT_ARCHIVED,
        },
      })).toThrow(SYMLINK_THROW);
    });

    test('fails under mode BLOCK_EXTERNAL if the bundling output contains an external symlink and AssetHashType is Output', () => {
      // GIVEN
      const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
      const stack = new Stack(app, 'stack');

      // WHEN - we should throw no matter the Asset Hash Type
      expect(() => new AssetStaging(stack, 'Asset', {
        sourcePath: directory,
        assetHashType: AssetHashType.OUTPUT,
        follow: SymlinkFollowMode.BLOCK_EXTERNAL,
        bundling: {
          image: DockerImage.fromRegistry('alpine'),
          command: [DockerStubCommand.DIR_WITH_EXTERNAL_SYMLINK],
          outputType: BundlingOutput.NOT_ARCHIVED,
        },
      })).toThrow(SYMLINK_THROW);
    });

    test('fails under mode BLOCK_EXTERNAL if there is an external symlink in a subdirectory of the bundling output', () => {
      // GIVEN
      const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
      const stack = new Stack(app, 'stack');

      // WHEN - the whole output tree is walked, not just its top level
      expect(() => new AssetStaging(stack, 'Asset', {
        sourcePath: directory,
        follow: SymlinkFollowMode.BLOCK_EXTERNAL,
        bundling: {
          image: DockerImage.fromRegistry('alpine'),
          command: [DockerStubCommand.DIR_WITH_NESTED_EXTERNAL_SYMLINK],
          outputType: BundlingOutput.NOT_ARCHIVED,
        },
      })).toThrow(SYMLINK_THROW);
    });

    test('fails under mode BLOCK_EXTERNAL if the bundling output contains a symlink to an external directory', () => {
      // GIVEN
      const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
      const stack = new Stack(app, 'stack');

      // WHEN - a symlink to a directory is rejected, not descended into
      expect(() => new AssetStaging(stack, 'Asset', {
        sourcePath: directory,
        follow: SymlinkFollowMode.BLOCK_EXTERNAL,
        bundling: {
          image: DockerImage.fromRegistry('alpine'),
          command: [DockerStubCommand.DIR_WITH_EXTERNAL_DIR_SYMLINK],
          outputType: BundlingOutput.NOT_ARCHIVED,
        },
      })).toThrow(SYMLINK_THROW);
    });

    // A symlink that resolves inside the bundling output is self-contained: whether the
    // publisher follows it or preserves it, nothing outside the asset is packaged. Those
    // must keep working, in every follow mode.
    test.each([
      [SymlinkFollowMode.BLOCK_EXTERNAL],
      [SymlinkFollowMode.ALWAYS],
    ])('does not fail under mode %s if the symlink in the bundling output resolves inside the output', (follow) => {
      // GIVEN
      const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
      const stack = new Stack(app, 'stack');

      // WHEN
      const staging = new AssetStaging(stack, 'Asset', {
        sourcePath: directory,
        follow,
        bundling: {
          image: DockerImage.fromRegistry('alpine'),
          command: [DockerStubCommand.DIR_WITH_LOCAL_SYMLINK],
          outputType: BundlingOutput.NOT_ARCHIVED,
        },
      });
      app.synth();

      // THEN - the output directory is staged as it was bundled, symlink intact
      expect(staging.packaging).toEqual(FileAssetPackaging.ZIP_DIRECTORY);
      expect(staging.isArchive).toEqual(true);
      expect(fs.readdirSync(staging.absoluteStagedPath).sort()).toEqual(['file2.txt', 'local-link.txt', 'test.txt']);
      const link = path.join(staging.absoluteStagedPath, 'local-link.txt');
      expect(fs.lstatSync(link).isSymbolicLink()).toBe(true);
      expect(fs.readlinkSync(link)).toEqual('test.txt');
    });

    // Only BLOCK_EXTERNAL asks for external symlinks to be blocked. The other modes are
    // documented to follow or preserve them, so the bundling output is not inspected.
    test.each([
      [undefined], // EXTERNAL is also the default when `follow` is unset
      [SymlinkFollowMode.EXTERNAL],
      [SymlinkFollowMode.ALWAYS],
      [SymlinkFollowMode.NEVER],
    ])('does not inspect the bundling output under mode %s', (follow) => {
      // GIVEN
      const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
      const stack = new Stack(app, 'stack');

      // WHEN
      const staging = new AssetStaging(stack, 'Asset', {
        sourcePath: directory,
        follow,
        bundling: {
          image: DockerImage.fromRegistry('alpine'),
          command: [DockerStubCommand.DIR_WITH_EXTERNAL_SYMLINK],
          outputType: BundlingOutput.NOT_ARCHIVED,
        },
      });

      // THEN
      expect(staging.packaging).toEqual(FileAssetPackaging.ZIP_DIRECTORY);
      expect(fs.lstatSync(path.join(staging.absoluteStagedPath, 'payload.zip')).isSymbolicLink()).toBe(true);
    });
  });

  describe('external symlinks in the source directory that are excluded from the asset', () => {
    const SYMLINK_THROW = /forbids the symbolic link/;

    // An excluded symlink is never copied into the staged asset, so nothing from outside the
    // source tree ends up being packaged and there is nothing for BLOCK_EXTERNAL to block.
    const symlinksDir = path.join(__dirname, 'fs', 'fixtures', 'symlinks');
    const EXTERNAL_LINKS = ['external-link.txt', 'external-dir-link'];

    test('does not fail under mode BLOCK_EXTERNAL if the external symlink is excluded', () => {
      // GIVEN
      const stack = new Stack(new App(), 'stack');

      // WHEN
      const staging = new AssetStaging(stack, 'Asset', {
        sourcePath: FIXTURE_TEST1_DIR,
        follow: SymlinkFollowMode.BLOCK_EXTERNAL,
        exclude: ['external-link.txt'],
      });

      // THEN - the rest of the source directory is staged, without the excluded symlink
      expect(fs.readdirSync(staging.absoluteStagedPath).sort()).toEqual([
        'file1.txt',
        'local-link.txt',
        'subdir',
        'subdir2',
        'subdir4',
      ]);
    });

    test('does not fail under mode BLOCK_EXTERNAL if the excluded symlink points to an external directory', () => {
      // GIVEN
      const stack = new Stack(new App(), 'stack');

      // WHEN - a symlink to a directory is excluded by name, like any other entry
      const staging = new AssetStaging(stack, 'Asset', {
        sourcePath: symlinksDir,
        follow: SymlinkFollowMode.BLOCK_EXTERNAL,
        exclude: EXTERNAL_LINKS,
      });

      // THEN - only the entries that resolve inside the source directory are staged
      expect(fs.readdirSync(staging.absoluteStagedPath).sort()).toEqual([
        'indirect-external-link.txt',
        'local-dir-link',
        'local-link.txt',
        'normal-dir',
        'normal-file.txt',
      ]);
    });

    test('does not fail under mode BLOCK_EXTERNAL if the external symlink is excluded and the asset is bundled', () => {
      // GIVEN
      const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
      const stack = new Stack(app, 'stack');

      // WHEN - the source directory is validated before bundling starts
      const staging = new AssetStaging(stack, 'Asset', {
        sourcePath: FIXTURE_TEST1_DIR,
        assetHashType: AssetHashType.SOURCE,
        follow: SymlinkFollowMode.BLOCK_EXTERNAL,
        exclude: ['external-link.txt'],
        bundling: {
          image: DockerImage.fromRegistry('alpine'),
          command: [DockerStubCommand.SINGLE_FILE],
          outputType: BundlingOutput.SINGLE_FILE,
        },
      });

      // THEN
      expect(staging.packaging).toEqual(FileAssetPackaging.FILE);
      expect(staging.isArchive).toEqual(false);
    });

    test('fails under mode BLOCK_EXTERNAL if the exclude patterns do not match the external symlink', () => {
      // GIVEN
      const stack = new Stack(new App(), 'stack');

      // WHEN - excluding an unrelated file leaves external-link.txt part of the asset
      expect(() => new AssetStaging(stack, 'Asset', {
        sourcePath: FIXTURE_TEST1_DIR,
        follow: SymlinkFollowMode.BLOCK_EXTERNAL,
        exclude: ['file1.txt'],
      })).toThrow(SYMLINK_THROW);
    });

    test('fails under mode BLOCK_EXTERNAL if only some of the external symlinks are excluded', () => {
      // GIVEN
      const stack = new Stack(new App(), 'stack');

      // WHEN - external-dir-link is still part of the asset
      expect(() => new AssetStaging(stack, 'Asset', {
        sourcePath: symlinksDir,
        follow: SymlinkFollowMode.BLOCK_EXTERNAL,
        exclude: ['external-link.txt'],
      })).toThrow(SYMLINK_THROW);
    });

    // The patterns must be interpreted with the `ignoreMode` that will be used for copying,
    // otherwise a pattern could exclude a symlink from the asset without excluding it from
    // validation, or the other way around.
    test.each([
      [IgnoreMode.GLOB, EXTERNAL_LINKS],
      [IgnoreMode.GIT, EXTERNAL_LINKS],
      [IgnoreMode.DOCKER, EXTERNAL_LINKS],
    ])('does not fail under mode BLOCK_EXTERNAL if the external symlinks are excluded using ignoreMode %s', (ignoreMode, exclude) => {
      // GIVEN
      const stack = new Stack(new App(), 'stack');

      // WHEN
      const staging = new AssetStaging(stack, 'Asset', {
        sourcePath: symlinksDir,
        follow: SymlinkFollowMode.BLOCK_EXTERNAL,
        ignoreMode,
        exclude,
      });

      // THEN
      expect(fs.readdirSync(staging.absoluteStagedPath).sort()).toEqual([
        'indirect-external-link.txt',
        'local-dir-link',
        'local-link.txt',
        'normal-dir',
        'normal-file.txt',
      ]);
    });
  });

  // Check that the AssetStaging deduplication key includes every relevant property
  describe('deduplication key includes every property', () => {
    // A cache miss is observable as a call to the (private) staging function
    function countStagings(build: (stack: Stack, id: string) => void, buildOther: (stack: Stack, id: string) => void) {
      AssetStaging.clearAssetHashCache();
      const spies = [
        jest.spyOn(AssetStaging.prototype as any, 'stageByBundling'),
        jest.spyOn(AssetStaging.prototype as any, 'stageByCopying'),
      ];
      const stack = new Stack(new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } }), 'stack');
      build(stack, 'Base');
      buildOther(stack, 'Variant');
      return spies.reduce((n, s) => n + s.mock.calls.length, 0);
    }

    const BUNDLING: BundlingOptions = {
      image: DockerImage.fromRegistry('alpine'),
      command: [DockerStubCommand.SUCCESS],
    };
    const BASE: AssetStagingProps = { sourcePath: path.join(FIXTURE_TEST1_DIR, 'subdir'), bundling: BUNDLING };

    /**
     * One entry per prop; the compiler rejects this object if a prop is missing.
     * `base` is merged into BASE for both assets, `other` only into the variant.
     */
    type Variation = { base?: Partial<AssetStagingProps>; other: Partial<AssetStagingProps> };
    const PROP_VARIATIONS: { [K in keyof Required<AssetStagingProps>]: Variation } = {
      sourcePath: { other: { sourcePath: path.join(FIXTURE_TEST1_DIR, 'subdir2') } },
      exclude: { other: { exclude: ['file1.txt'] } },
      ignoreMode: { base: { exclude: ['file1.txt'] }, other: { ignoreMode: IgnoreMode.DOCKER } },
      follow: { other: { follow: SymlinkFollowMode.BLOCK_EXTERNAL } },
      extraHash: { other: { extraHash: 'extra' } },
      assetHashType: { other: { assetHashType: AssetHashType.OUTPUT } },
      assetHash: { base: { assetHashType: AssetHashType.CUSTOM, assetHash: 'one' }, other: { assetHash: 'two' } },
      bundling: { other: { bundling: undefined } },
    };

    const BUNDLING_VARIATIONS: { [K in keyof Required<BundlingOptions>]: Partial<BundlingOptions> } = {
      image: { image: DockerImage.fromRegistry('busybox') },
      entrypoint: { entrypoint: ['DOCKER_STUB_SUCCESS'] },
      command: { command: [DockerStubCommand.SUCCESS, 'extra-arg'] },
      volumes: { volumes: [{ hostPath: '/tmp', containerPath: '/x' }] },
      volumesFrom: { volumesFrom: ['other'] },
      environment: { environment: { A: 'b' } },
      workingDirectory: { workingDirectory: '/x' },
      user: { user: '1000:1000' },
      local: { local: { tryBundle: (dir) => { fs.writeFileSync(path.join(dir, 'other.txt'), 'x'); return true; } } },
      outputType: { outputType: BundlingOutput.NOT_ARCHIVED },
      securityOpt: { securityOpt: 'no-new-privileges' },
      network: { network: 'host' },
      bundlingFileAccess: { bundlingFileAccess: BundlingFileAccess.BIND_MOUNT },
      platform: { platform: 'linux/arm64' },
    };

    test.each(Object.entries(PROP_VARIATIONS))('prop %s', (_, { base, other }) => {
      const baseProps = { ...BASE, ...base };
      expect(countStagings(
        (s, id) => new AssetStaging(s, id, baseProps),
        (s, id) => new AssetStaging(s, id, { ...baseProps, ...other }),
      )).toEqual(2);
    });

    test.each(Object.entries(BUNDLING_VARIATIONS))('bundling.%s', (_, other) => {
      expect(countStagings(
        (s, id) => new AssetStaging(s, id, BASE),
        (s, id) => new AssetStaging(s, id, { ...BASE, bundling: { ...BUNDLING, ...other } }),
      )).toEqual(2);
    });

    // Not props, but inputs that change the result; the compiler can't enforce this list
    test.each([
      ['asset salt', '@aws-cdk/core:assetHashSalt', 'salty'],
      ['staging disabled', cxapi.DISABLE_ASSET_STAGING_CONTEXT, true],
    ])('context: %s', (_, key, value) => {
      expect(countStagings(
        (s, id) => new AssetStaging(s, id, BASE),
        (s, id) => { const scope = new Construct(s, `${id}Scope`); scope.node.setContext(key, value); new AssetStaging(scope, id, BASE); },
      )).toEqual(2);
    });

    // Control: without a difference, it must be 1, otherwise every case above passes trivially
    test('identical props are deduplicated', () => {
      expect(countStagings((s, id) => new AssetStaging(s, id, BASE), (s, id) => new AssetStaging(s, id, BASE))).toEqual(1);
    });
  });
});

describe('staging with docker cp', () => {
  beforeAll(() => {
    // this is a way to provide a custom "docker" command for staging.
    process.env.CDK_DOCKER = `${__dirname}/docker-stub-cp.sh`;
  });

  afterAll(() => {
    delete process.env.CDK_DOCKER;
  });

  afterEach(() => {
    AssetStaging.clearAssetHashCache();
    if (fs.existsSync(STUB_INPUT_CP_FILE)) {
      fs.unlinkSync(STUB_INPUT_CP_FILE);
    }
    if (fs.existsSync(STUB_INPUT_CP_CONCAT_FILE)) {
      fs.unlinkSync(STUB_INPUT_CP_CONCAT_FILE);
    }
    sinon.restore();
  });

  test('bundling with docker image copy variant', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    const staging = new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.VOLUME_SINGLE_ARCHIVE],
        bundlingFileAccess: BundlingFileAccess.VOLUME_COPY,
      },
    });

    // THEN
    const assembly = app.synth();
    expect(fs.readdirSync(assembly.directory)).toEqual([
      'asset.c0a5fa22d478764f48802d4ff41174892273b02445015e8e8e08a9596792550c', // this is the bundle dir
      'cdk.out',
      'manifest.json',
      'stack.metadata.json',
      'stack.template.json',
      'tree.json',
      'validation-report.json',
    ]);
    expect(fs.readdirSync(path.join(assembly.directory, 'asset.c0a5fa22d478764f48802d4ff41174892273b02445015e8e8e08a9596792550c'))).toEqual([
      'test.zip', // bundle dir with "touched" bundled output file
    ]);
    expect(staging.packaging).toEqual(FileAssetPackaging.FILE);
    expect(staging.isArchive).toEqual(true);
    const dockerCalls: string[] = readDockerStubInputConcat(STUB_INPUT_CP_CONCAT_FILE).split(/\r?\n/);
    expect(dockerCalls).toEqual(expect.arrayContaining([
      expect.stringContaining('volume create assetInput'),
      expect.stringContaining('volume create assetOutput'),
      expect.stringMatching('run --name copyContainer.* -v /input:/asset-input -v /output:/asset-output public.ecr.aws/docker/library/alpine sh -c mkdir -p /asset-input && chown -R .* /asset-output && chown -R .* /asset-input'),
      expect.stringMatching('cp .*fs/fixtures/test1/\. copyContainer.*:/asset-input'),
      expect.stringMatching('run --rm -u .* --volumes-from copyContainer.* -w /asset-input alpine DOCKER_STUB_VOLUME_SINGLE_ARCHIVE'),
      expect.stringMatching('cp copyContainer.*:/asset-output/\. .*'),
      expect.stringContaining('rm copyContainer'),
      expect.stringContaining('volume rm assetInput'),
      expect.stringContaining('volume rm assetOutput'),
    ]));
  });

  test('bundling that produces a single file with docker image copy variant and hash type SOURCE', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    const staging = new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SINGLE_FILE_WITHOUT_EXT],
        outputType: BundlingOutput.SINGLE_FILE,
        bundlingFileAccess: BundlingFileAccess.VOLUME_COPY,
      },
      assetHashType: AssetHashType.SOURCE, // default
    });

    // THEN
    const assembly = app.synth();
    expect(fs.readdirSync(assembly.directory)).toEqual([
      'asset.4697ea6b345c96a20246f80b874dfd6d640c6d0fd9c097d02ede1f45d37e1732',
      'cdk.out',
      'manifest.json',
      'stack.metadata.json',
      'stack.template.json',
      'tree.json',
      'validation-report.json',
    ]);
    expect(staging.packaging).toEqual(FileAssetPackaging.FILE);
    expect(staging.isArchive).toEqual(false);
  });

  test('bundling that produces a single file with docker image copy variant and hash type CUSTOM', () => {
    // GIVEN
    const app = new App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
    const stack = new Stack(app, 'stack');
    const directory = FIXTURE_TEST1_DIR;

    // WHEN
    const staging = new AssetStaging(stack, 'Asset', {
      sourcePath: directory,
      bundling: {
        image: DockerImage.fromRegistry('alpine'),
        command: [DockerStubCommand.SINGLE_FILE_WITHOUT_EXT],
        outputType: BundlingOutput.SINGLE_FILE,
        bundlingFileAccess: BundlingFileAccess.VOLUME_COPY,
      },
      assetHashType: AssetHashType.CUSTOM,
      assetHash: 'custom',
    });

    // THEN
    const assembly = app.synth();

    expect(fs.readdirSync(assembly.directory)).toEqual([
      'asset.53a51b4c68874a8e831e24e8982120be2a608f50b2e05edb8501143b3305baa8',
      'cdk.out',
      'manifest.json',
      'stack.metadata.json',
      'stack.template.json',
      'tree.json',
      'validation-report.json',
    ]);
    expect(staging.packaging).toEqual(FileAssetPackaging.FILE);
    expect(staging.isArchive).toEqual(false);
  });
});

// Reads a docker stub and cleans the volume paths out of the stub.
function readAndCleanDockerStubInput(file: string) {
  return fs
    .readFileSync(file, 'utf-8')
    .trim()
    .replace(/-v ([^:]+):\/asset-input/g, '-v /input:/asset-input')
    .replace(/-v ([^:]+):\/asset-output/g, '-v /output:/asset-output');
}

// Last docker input since last teardown
function readDockerStubInput(file?: string) {
  return readAndCleanDockerStubInput(file ?? STUB_INPUT_FILE);
}
// Concatenated docker inputs since last teardown
function readDockerStubInputConcat(file?: string) {
  return readAndCleanDockerStubInput(file ?? STUB_INPUT_CONCAT_FILE);
}

function isSeLinux(): boolean {
  if (process.platform != 'linux') {
    return false;
  }
  const prog = 'selinuxenabled';
  const proc = spawnSync(prog, [], {
    stdio: [ // show selinux status output
      'pipe', // get value of stdio
      process.stderr, // redirect stdout to stderr
      'inherit', // inherit stderr
    ],
  });
  if (proc.error) {
    // selinuxenabled not a valid command, therefore not enabled
    return false;
  }
  if (proc.status == 0) {
    // selinux enabled
    return true;
  } else {
    // selinux not enabled
    return false;
  }
}
