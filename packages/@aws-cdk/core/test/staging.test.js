"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const path = require("path");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cloud_assembly_schema_1 = require("@aws-cdk/cloud-assembly-schema");
const cxapi = require("@aws-cdk/cx-api");
const fs = require("fs-extra");
const sinon = require("sinon");
const lib_1 = require("../lib");
const STUB_INPUT_FILE = '/tmp/docker-stub.input';
const STUB_INPUT_CONCAT_FILE = '/tmp/docker-stub.input.concat';
const STUB_INPUT_CP_FILE = '/tmp/docker-stub-cp.input';
const STUB_INPUT_CP_CONCAT_FILE = '/tmp/docker-stub-cp.input.concat';
var DockerStubCommand;
(function (DockerStubCommand) {
    DockerStubCommand["SUCCESS"] = "DOCKER_STUB_SUCCESS";
    DockerStubCommand["FAIL"] = "DOCKER_STUB_FAIL";
    DockerStubCommand["SUCCESS_NO_OUTPUT"] = "DOCKER_STUB_SUCCESS_NO_OUTPUT";
    DockerStubCommand["MULTIPLE_FILES"] = "DOCKER_STUB_MULTIPLE_FILES";
    DockerStubCommand["SINGLE_ARCHIVE"] = "DOCKER_STUB_SINGLE_ARCHIVE";
    DockerStubCommand["VOLUME_SINGLE_ARCHIVE"] = "DOCKER_STUB_VOLUME_SINGLE_ARCHIVE";
})(DockerStubCommand || (DockerStubCommand = {}));
const FIXTURE_TEST1_DIR = path.join(__dirname, 'fs', 'fixtures', 'test1');
const FIXTURE_TEST1_HASH = '2f37f937c51e2c191af66acf9b09f548926008ec68c575bd2ee54b6e997c0e00';
const FIXTURE_TARBALL = path.join(__dirname, 'fs', 'fixtures.tar.gz');
const NOT_ARCHIVED_ZIP_TXT_HASH = '95c924c84f5d023be4edee540cb2cb401a49f115d01ed403b288f6cb412771df';
const ARCHIVE_TARBALL_TEST_HASH = '3e948ff54a277d6001e2452fdbc4a9ef61f916ff662ba5e05ece1e2ec6dec9f5';
const userInfo = os.userInfo();
const USER_ARG = `-u ${userInfo.uid}:${userInfo.gid}`;
describe('staging', () => {
    beforeAll(() => {
        // this is a way to provide a custom "docker" command for staging.
        process.env.CDK_DOCKER = `${__dirname}/docker-stub.sh`;
    });
    afterAll(() => {
        delete process.env.CDK_DOCKER;
    });
    afterEach(() => {
        lib_1.AssetStaging.clearAssetHashCache();
        if (fs.existsSync(STUB_INPUT_FILE)) {
            fs.unlinkSync(STUB_INPUT_FILE);
        }
        if (fs.existsSync(STUB_INPUT_CONCAT_FILE)) {
            fs.unlinkSync(STUB_INPUT_CONCAT_FILE);
        }
        sinon.restore();
    });
    test('base case', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        const sourcePath = FIXTURE_TEST1_DIR;
        // WHEN
        const staging = new lib_1.AssetStaging(stack, 's1', { sourcePath });
        expect(staging.assetHash).toEqual(FIXTURE_TEST1_HASH);
        expect(staging.sourcePath).toEqual(sourcePath);
        expect(path.basename(staging.absoluteStagedPath)).toEqual(`asset.${FIXTURE_TEST1_HASH}`);
        expect(path.basename(staging.relativeStagedPath(stack))).toEqual(`asset.${FIXTURE_TEST1_HASH}`);
        expect(staging.packaging).toEqual(cloud_assembly_schema_1.FileAssetPackaging.ZIP_DIRECTORY);
        expect(staging.isArchive).toEqual(true);
    });
    test('base case if source directory is a symlink', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        const sourcePath = path.join(os.tmpdir(), 'asset-symlink');
        if (fs.existsSync(sourcePath)) {
            fs.unlinkSync(sourcePath);
        }
        fs.symlinkSync(FIXTURE_TEST1_DIR, sourcePath);
        try {
            const staging = new lib_1.AssetStaging(stack, 's1', { sourcePath });
            // Should be the same asset hash as in the previous test
            expect(staging.assetHash).toEqual(FIXTURE_TEST1_HASH);
        }
        finally {
            if (fs.existsSync(sourcePath)) {
                fs.unlinkSync(sourcePath);
            }
        }
    });
    test('staging of an archive file correctly sets packaging and isArchive', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        const sourcePath = path.join(__dirname, 'archive', 'archive.zip');
        // WHEN
        const staging = new lib_1.AssetStaging(stack, 's1', { sourcePath });
        expect(staging.packaging).toEqual(cloud_assembly_schema_1.FileAssetPackaging.FILE);
        expect(staging.isArchive).toEqual(true);
    });
    test('staging of an archive with multiple extension name correctly sets packaging and isArchive', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        const sourcePathTarGz1 = path.join(__dirname, 'archive', 'artifact.tar.gz');
        const sourcePathTarGz2 = path.join(__dirname, 'archive', 'artifact.da.vinci.monalisa.tar.gz');
        const sourcePathTgz = path.join(__dirname, 'archive', 'artifact.tgz');
        const sourcePathTar = path.join(__dirname, 'archive', 'artifact.tar');
        const sourcePathNotArchive = path.join(__dirname, 'archive', 'artifact.zip.txt');
        const sourcePathDockerFile = path.join(__dirname, 'archive', 'DockerFile');
        // WHEN
        const stagingTarGz1 = new lib_1.AssetStaging(stack, 's1', { sourcePath: sourcePathTarGz1 });
        const stagingTarGz2 = new lib_1.AssetStaging(stack, 's2', { sourcePath: sourcePathTarGz2 });
        const stagingTgz = new lib_1.AssetStaging(stack, 's3', { sourcePath: sourcePathTgz });
        const stagingTar = new lib_1.AssetStaging(stack, 's4', { sourcePath: sourcePathTar });
        const stagingNotArchive = new lib_1.AssetStaging(stack, 's5', { sourcePath: sourcePathNotArchive });
        const stagingDockerFile = new lib_1.AssetStaging(stack, 's6', { sourcePath: sourcePathDockerFile });
        expect(stagingTarGz1.packaging).toEqual(cloud_assembly_schema_1.FileAssetPackaging.FILE);
        expect(stagingTarGz1.isArchive).toEqual(true);
        expect(stagingTarGz2.packaging).toEqual(cloud_assembly_schema_1.FileAssetPackaging.FILE);
        expect(path.basename(stagingTarGz2.absoluteStagedPath)).toEqual(`asset.${ARCHIVE_TARBALL_TEST_HASH}.tar.gz`);
        expect(path.basename(stagingTarGz2.relativeStagedPath(stack))).toEqual(`asset.${ARCHIVE_TARBALL_TEST_HASH}.tar.gz`);
        expect(stagingTarGz2.isArchive).toEqual(true);
        expect(stagingTgz.packaging).toEqual(cloud_assembly_schema_1.FileAssetPackaging.FILE);
        expect(stagingTgz.isArchive).toEqual(true);
        expect(stagingTar.packaging).toEqual(cloud_assembly_schema_1.FileAssetPackaging.FILE);
        expect(stagingTar.isArchive).toEqual(true);
        expect(stagingNotArchive.packaging).toEqual(cloud_assembly_schema_1.FileAssetPackaging.FILE);
        expect(path.basename(stagingNotArchive.absoluteStagedPath)).toEqual(`asset.${NOT_ARCHIVED_ZIP_TXT_HASH}.txt`);
        expect(path.basename(stagingNotArchive.relativeStagedPath(stack))).toEqual(`asset.${NOT_ARCHIVED_ZIP_TXT_HASH}.txt`);
        expect(stagingNotArchive.isArchive).toEqual(false);
        expect(stagingDockerFile.packaging).toEqual(cloud_assembly_schema_1.FileAssetPackaging.FILE);
        expect(stagingDockerFile.isArchive).toEqual(false);
    });
    test('asset packaging type is correct when staging is skipped because of memory cache', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        const sourcePath = path.join(__dirname, 'archive', 'archive.zip');
        // WHEN
        const staging1 = new lib_1.AssetStaging(stack, 's1', { sourcePath });
        const staging2 = new lib_1.AssetStaging(stack, 's2', { sourcePath });
        expect(staging1.packaging).toEqual(cloud_assembly_schema_1.FileAssetPackaging.FILE);
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
        const app1 = new lib_1.App({ outdir: TEST_OUTDIR });
        const stack1 = new lib_1.Stack(app1, 'Stack');
        const app2 = new lib_1.App({ outdir: TEST_OUTDIR }); // same OUTDIR
        const stack2 = new lib_1.Stack(app2, 'stack');
        // WHEN
        const staging1 = new lib_1.AssetStaging(stack1, 'Asset', { sourcePath });
        // Now clear asset hash cache to show that during the second staging
        // even though the asset is already available on disk it will correctly
        // be considered as a FileAssetPackaging.FILE.
        lib_1.AssetStaging.clearAssetHashCache();
        const staging2 = new lib_1.AssetStaging(stack2, 'Asset', { sourcePath });
        // THEN
        expect(staging1.packaging).toEqual(cloud_assembly_schema_1.FileAssetPackaging.FILE);
        expect(staging1.isArchive).toEqual(true);
        expect(staging2.packaging).toEqual(staging1.packaging);
        expect(staging2.isArchive).toEqual(staging1.isArchive);
    });
    test('staging of a non-archive file correctly sets packaging and isArchive', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        const sourcePath = __filename;
        // WHEN
        const staging = new lib_1.AssetStaging(stack, 's1', { sourcePath });
        expect(staging.packaging).toEqual(cloud_assembly_schema_1.FileAssetPackaging.FILE);
        expect(staging.isArchive).toEqual(false);
    });
    test('staging can be disabled through context', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        stack.node.setContext(cxapi.DISABLE_ASSET_STAGING_CONTEXT, true);
        const sourcePath = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        const staging = new lib_1.AssetStaging(stack, 's1', { sourcePath });
        expect(staging.assetHash).toEqual(FIXTURE_TEST1_HASH);
        expect(staging.sourcePath).toEqual(sourcePath);
        expect(staging.absoluteStagedPath).toEqual(sourcePath);
        expect(staging.relativeStagedPath(stack)).toEqual(sourcePath);
    });
    test('files are copied to the output directory during synth', () => {
        // GIVEN
        const app = new lib_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack = new lib_1.Stack(app, 'stack');
        // WHEN
        new lib_1.AssetStaging(stack, 's1', { sourcePath: FIXTURE_TEST1_DIR });
        new lib_1.AssetStaging(stack, 'file', { sourcePath: FIXTURE_TARBALL });
        // THEN
        const assembly = app.synth();
        expect(fs.readdirSync(assembly.directory)).toEqual([
            `asset.${FIXTURE_TEST1_HASH}`,
            'asset.af10ac04b3b607b0f8659c8f0cee8c343025ee75baf0b146f10f0e5311d2c46b.tar.gz',
            'cdk.out',
            'manifest.json',
            'stack.template.json',
            'tree.json',
        ]);
    });
    test('assets in nested assemblies get staged into assembly root directory', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack1 = new lib_1.Stack(new lib_1.Stage(app, 'Stage1'), 'Stack');
        const stack2 = new lib_1.Stack(new lib_1.Stage(app, 'Stage2'), 'Stack');
        // WHEN
        new lib_1.AssetStaging(stack1, 's1', { sourcePath: FIXTURE_TEST1_DIR });
        new lib_1.AssetStaging(stack2, 's1', { sourcePath: FIXTURE_TEST1_DIR });
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
        ]);
    });
    test('allow specifying extra data to include in the source hash', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        const withoutExtra = new lib_1.AssetStaging(stack, 'withoutExtra', { sourcePath: directory });
        const withExtra = new lib_1.AssetStaging(stack, 'withExtra', { sourcePath: directory, extraHash: 'boom' });
        // THEN
        expect(withoutExtra.assetHash).not.toEqual(withExtra.assetHash);
        expect(withoutExtra.assetHash).toEqual(FIXTURE_TEST1_HASH);
        expect(withExtra.assetHash).toEqual('c95c915a5722bb9019e2c725d11868e5a619b55f36172f76bcbcaa8bb2d10c5f');
    });
    test('can specify extra asset salt via context key', () => {
        // GIVEN
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'stack');
        const saltedApp = new lib_1.App({ context: { '@aws-cdk/core:assetHashSalt': 'magic' } });
        const saltedStack = new lib_1.Stack(saltedApp, 'stack');
        // WHEN
        const asset = new lib_1.AssetStaging(stack, 'X', { sourcePath: directory });
        const saltedAsset = new lib_1.AssetStaging(saltedStack, 'X', { sourcePath: directory });
        // THEN
        expect(asset.assetHash).not.toEqual(saltedAsset.assetHash);
    });
    test('with bundling', () => {
        // GIVEN
        const app = new lib_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        const processStdErrWriteSpy = sinon.spy(process.stderr, 'write');
        // WHEN
        new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS],
            },
        });
        // THEN
        const assembly = app.synth();
        expect(readDockerStubInput()).toEqual(`run --rm ${USER_ARG} -v /input:/asset-input:delegated -v /output:/asset-output:delegated -w /asset-input alpine DOCKER_STUB_SUCCESS`);
        expect(fs.readdirSync(assembly.directory)).toEqual([
            'asset.b1e32e86b3523f2fa512eb99180ee2975a50a4439e63e8badd153f2a68d61aa4',
            'cdk.out',
            'manifest.json',
            'stack.template.json',
            'tree.json',
        ]);
        // shows a message before bundling
        expect(processStdErrWriteSpy.calledWith('Bundling asset stack/Asset...\n')).toEqual(true);
    });
    test('bundled resources have absolute path when staging is disabled', () => {
        // GIVEN
        const app = new lib_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack = new lib_1.Stack(app, 'stack');
        stack.node.setContext(cxapi.DISABLE_ASSET_STAGING_CONTEXT, true);
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        const asset = new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS],
            },
        });
        // THEN
        const assembly = app.synth();
        expect(fs.readdirSync(assembly.directory)).toEqual([
            'asset.b1e32e86b3523f2fa512eb99180ee2975a50a4439e63e8badd153f2a68d61aa4',
            'cdk.out',
            'manifest.json',
            'stack.template.json',
            'tree.json',
        ]);
        expect(asset.assetHash).toEqual('b1e32e86b3523f2fa512eb99180ee2975a50a4439e63e8badd153f2a68d61aa4');
        expect(asset.sourcePath).toEqual(directory);
        const resolvedStagePath = asset.relativeStagedPath(stack);
        // absolute path ending with bundling dir
        expect(path.isAbsolute(resolvedStagePath)).toEqual(true);
        expect(new RegExp('asset.b1e32e86b3523f2fa512eb99180ee2975a50a4439e63e8badd153f2a68d61aa4$').test(resolvedStagePath)).toEqual(true);
    });
    test('bundler reuses its output when it can', () => {
        // GIVEN
        const app = new lib_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS],
            },
        });
        new lib_1.AssetStaging(stack, 'AssetDuplicate', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS],
            },
        });
        // THEN
        const assembly = app.synth();
        // We're testing that docker was run exactly once even though there are two bundling assets.
        expect(readDockerStubInputConcat()).toEqual(`run --rm ${USER_ARG} -v /input:/asset-input:delegated -v /output:/asset-output:delegated -w /asset-input alpine DOCKER_STUB_SUCCESS`);
        expect(fs.readdirSync(assembly.directory)).toEqual([
            'asset.b1e32e86b3523f2fa512eb99180ee2975a50a4439e63e8badd153f2a68d61aa4',
            'cdk.out',
            'manifest.json',
            'stack.template.json',
            'tree.json',
        ]);
    });
    test('uses asset hash cache with AssetHashType.OUTPUT', () => {
        // GIVEN
        const app = new lib_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        const fingerPrintSpy = sinon.spy(lib_1.FileSystem, 'fingerprint');
        // WHEN
        new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            assetHashType: lib_1.AssetHashType.OUTPUT,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS],
            },
        });
        new lib_1.AssetStaging(stack, 'AssetDuplicate', {
            sourcePath: directory,
            assetHashType: lib_1.AssetHashType.OUTPUT,
            bundling: {
                command: [DockerStubCommand.SUCCESS],
                image: lib_1.DockerImage.fromRegistry('alpine'),
            },
        });
        // THEN
        const assembly = app.synth();
        // We're testing that docker was run exactly once even though there are two bundling assets
        // and that the hash is based on the output
        expect(readDockerStubInputConcat()).toEqual(`run --rm ${USER_ARG} -v /input:/asset-input:delegated -v /output:/asset-output:delegated -w /asset-input alpine DOCKER_STUB_SUCCESS`);
        expect(fs.readdirSync(assembly.directory)).toEqual([
            'asset.33cbf2cae5432438e0f046bc45ba8c3cef7b6afcf47b59d1c183775c1918fb1f',
            'cdk.out',
            'manifest.json',
            'stack.template.json',
            'tree.json',
        ]);
        // Only one fingerprinting
        expect(fingerPrintSpy.calledOnce).toEqual(true);
    });
    test('bundler considers its options when reusing bundle output', () => {
        // GIVEN
        const app = new lib_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS],
            },
        });
        new lib_1.AssetStaging(stack, 'AssetWithDifferentBundlingOptions', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
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
        expect(readDockerStubInputConcat()).toEqual(`run --rm ${USER_ARG} -v /input:/asset-input:delegated -v /output:/asset-output:delegated -w /asset-input alpine DOCKER_STUB_SUCCESS\n` +
            `run --rm ${USER_ARG} -v /input:/asset-input:delegated -v /output:/asset-output:delegated --env UNIQUE_ENV_VAR=SOMEVALUE -w /asset-input alpine DOCKER_STUB_SUCCESS`);
        expect(fs.readdirSync(assembly.directory)).toEqual([
            'asset.b1e32e86b3523f2fa512eb99180ee2975a50a4439e63e8badd153f2a68d61aa4',
            'asset.e80bb8f931b87e84975de193f5a7ecddd7558d3caf3d35d3a536d9ae6539234f',
            'cdk.out',
            'manifest.json',
            'stack.template.json',
            'tree.json',
        ]);
    });
    test('bundler outputs to intermediate dir and renames to asset', () => {
        // GIVEN
        const app = new lib_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        const ensureDirSync = sinon.spy(fs, 'ensureDirSync');
        const chmodSyncSpy = sinon.spy(fs, 'chmodSync');
        const renameSyncSpy = sinon.spy(fs, 'renameSync');
        // WHEN
        new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            assetHashType: lib_1.AssetHashType.OUTPUT,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS],
            },
        });
        // THEN
        const assembly = app.synth();
        expect(ensureDirSync.calledWith(sinon.match(path.join(assembly.directory, 'bundling-temp-')))).toEqual(true);
        expect(chmodSyncSpy.calledWith(sinon.match(path.join(assembly.directory, 'bundling-temp-')), 0o777)).toEqual(true);
        expect(renameSyncSpy.calledWith(sinon.match(path.join(assembly.directory, 'bundling-temp-')), sinon.match(path.join(assembly.directory, 'asset.')))).toEqual(true);
        expect(fs.readdirSync(assembly.directory)).toEqual([
            'asset.33cbf2cae5432438e0f046bc45ba8c3cef7b6afcf47b59d1c183775c1918fb1f',
            'cdk.out',
            'manifest.json',
            'stack.template.json',
            'tree.json',
        ]);
    });
    test('bundling failure preserves the bundleDir for diagnosability', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        expect(() => new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.FAIL],
            },
        })).toThrow(/Failed.*bundl.*asset.*-error/);
        // THEN
        const assembly = app.synth();
        const dir = fs.readdirSync(assembly.directory);
        expect(dir.some(entry => entry.match(/asset.*-error/))).toEqual(true);
    });
    test('bundler re-uses assets from previous synths', () => {
        // GIVEN
        const TEST_OUTDIR = path.join(__dirname, 'cdk.out');
        if (fs.existsSync(TEST_OUTDIR)) {
            fs.removeSync(TEST_OUTDIR);
        }
        const app = new lib_1.App({ outdir: TEST_OUTDIR, context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS],
            },
        });
        // Clear asset hash cache to show that during the second synth bundling
        // will consider the existing bundling dir (file system cache).
        lib_1.AssetStaging.clearAssetHashCache();
        // GIVEN
        const app2 = new lib_1.App({ outdir: TEST_OUTDIR, context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack2 = new lib_1.Stack(app2, 'stack');
        // WHEN
        new lib_1.AssetStaging(stack2, 'Asset', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS],
            },
        });
        // THEN
        const appAssembly = app.synth();
        const app2Assembly = app2.synth();
        expect(readDockerStubInputConcat()).toEqual(`run --rm ${USER_ARG} -v /input:/asset-input:delegated -v /output:/asset-output:delegated -w /asset-input alpine DOCKER_STUB_SUCCESS`);
        expect(appAssembly.directory).toEqual(app2Assembly.directory);
        expect(fs.readdirSync(appAssembly.directory)).toEqual([
            'asset.b1e32e86b3523f2fa512eb99180ee2975a50a4439e63e8badd153f2a68d61aa4',
            'cdk.out',
            'manifest.json',
            'stack.template.json',
            'tree.json',
        ]);
    });
    test('bundling throws when /asset-output is empty', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // THEN
        expect(() => new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS_NO_OUTPUT],
            },
        })).toThrow(/Bundling did not produce any output/);
        expect(readDockerStubInput()).toEqual(`run --rm ${USER_ARG} -v /input:/asset-input:delegated -v /output:/asset-output:delegated -w /asset-input alpine DOCKER_STUB_SUCCESS_NO_OUTPUT`);
    });
    (0, cdk_build_tools_1.testDeprecated)('bundling with BUNDLE asset hash type', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        const asset = new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS],
            },
            assetHashType: lib_1.AssetHashType.BUNDLE,
        });
        // THEN
        expect(readDockerStubInput()).toEqual(`run --rm ${USER_ARG} -v /input:/asset-input:delegated -v /output:/asset-output:delegated -w /asset-input alpine DOCKER_STUB_SUCCESS`);
        expect(asset.assetHash).toEqual('33cbf2cae5432438e0f046bc45ba8c3cef7b6afcf47b59d1c183775c1918fb1f');
    });
    test('bundling with docker security option', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        const asset = new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS],
                securityOpt: 'no-new-privileges',
            },
            assetHashType: lib_1.AssetHashType.BUNDLE,
        });
        // THEN
        expect(readDockerStubInput()).toEqual(`run --rm --security-opt no-new-privileges ${USER_ARG} -v /input:/asset-input:delegated -v /output:/asset-output:delegated -w /asset-input alpine DOCKER_STUB_SUCCESS`);
        expect(asset.assetHash).toEqual('33cbf2cae5432438e0f046bc45ba8c3cef7b6afcf47b59d1c183775c1918fb1f');
    });
    test('bundling with docker entrypoint', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        const asset = new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                entrypoint: [DockerStubCommand.SUCCESS],
                command: [DockerStubCommand.SUCCESS],
            },
            assetHashType: lib_1.AssetHashType.OUTPUT,
        });
        // THEN
        expect(readDockerStubInput()).toEqual(`run --rm ${USER_ARG} -v /input:/asset-input:delegated -v /output:/asset-output:delegated -w /asset-input --entrypoint DOCKER_STUB_SUCCESS alpine DOCKER_STUB_SUCCESS`);
        expect(asset.assetHash).toEqual('33cbf2cae5432438e0f046bc45ba8c3cef7b6afcf47b59d1c183775c1918fb1f');
    });
    test('bundling with OUTPUT asset hash type', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        const asset = new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS],
            },
            assetHashType: lib_1.AssetHashType.OUTPUT,
        });
        // THEN
        expect(asset.assetHash).toEqual('33cbf2cae5432438e0f046bc45ba8c3cef7b6afcf47b59d1c183775c1918fb1f');
    });
    test('custom hash', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        const asset = new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            assetHash: 'my-custom-hash',
        });
        // THEN
        expect(fs.existsSync(STUB_INPUT_FILE)).toEqual(false);
        expect(asset.assetHash).toEqual('b9c77053f5b83bbe5ba343bc18e92db939a49017010813225fea91fa892c4823'); // hash of 'my-custom-hash'
    });
    test('throws with assetHash and not CUSTOM hash type', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // THEN
        expect(() => new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS],
            },
            assetHash: 'my-custom-hash',
            assetHashType: lib_1.AssetHashType.OUTPUT,
        })).toThrow(/Cannot specify `output` for `assetHashType`/);
    });
    (0, cdk_build_tools_1.testDeprecated)('throws with BUNDLE hash type and no bundling', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // THEN
        expect(() => new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            assetHashType: lib_1.AssetHashType.BUNDLE,
        })).toThrow(/Cannot use `bundle` hash type when `bundling` is not specified/);
        expect(fs.existsSync(STUB_INPUT_FILE)).toEqual(false);
    });
    test('throws with OUTPUT hash type and no bundling', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // THEN
        expect(() => new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            assetHashType: lib_1.AssetHashType.OUTPUT,
        })).toThrow(/Cannot use `output` hash type when `bundling` is not specified/);
        expect(fs.existsSync(STUB_INPUT_FILE)).toEqual(false);
    });
    test('throws with CUSTOM and no hash', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // THEN
        expect(() => new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            assetHashType: lib_1.AssetHashType.CUSTOM,
        })).toThrow(/`assetHash` must be specified when `assetHashType` is set to `AssetHashType.CUSTOM`/);
        expect(fs.existsSync(STUB_INPUT_FILE)).toEqual(false); // "docker" not executed
    });
    test('throws when bundling fails', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // THEN
        expect(() => new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('this-is-an-invalid-docker-image'),
                command: [DockerStubCommand.FAIL],
            },
        })).toThrow(/Failed to bundle asset stack\/Asset/);
        expect(readDockerStubInput()).toEqual(`run --rm ${USER_ARG} -v /input:/asset-input:delegated -v /output:/asset-output:delegated -w /asset-input this-is-an-invalid-docker-image DOCKER_STUB_FAIL`);
    });
    test('with local bundling', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        let dir;
        let opts;
        new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS],
                local: {
                    tryBundle(outputDir, options) {
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
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS],
                local: {
                    tryBundle(_bundleDir) {
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
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'MyStack');
        stack.node.setContext(cxapi.BUNDLING_STACKS, ['OtherStack']);
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        const asset = new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            assetHashType: lib_1.AssetHashType.OUTPUT,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS],
            },
        });
        expect(() => readDockerStubInput()).toThrow(); // Bundling did not run
        expect(asset.sourcePath).toEqual(directory);
        expect(asset.stagedPath).toEqual(directory);
        expect(asset.relativeStagedPath(stack)).toEqual(directory);
        expect(asset.assetHash).toEqual('f66d7421aa2d044a6c1f60ddfc76dc78571fcd8bd228eb48eb394e2dbad94a5c');
    });
    test('correctly skips bundling with stack under stage', () => {
        // GIVEN
        const app = new lib_1.App();
        const stage = new lib_1.Stage(app, 'Stage');
        stage.node.setContext(cxapi.BUNDLING_STACKS, ['Stage/Stack1']);
        const stack1 = new lib_1.Stack(stage, 'Stack1');
        const stack2 = new lib_1.Stack(stage, 'Stack2');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        new lib_1.AssetStaging(stack1, 'Asset', {
            sourcePath: directory,
            assetHashType: lib_1.AssetHashType.OUTPUT,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS],
            },
        });
        new lib_1.AssetStaging(stack2, 'Asset', {
            sourcePath: directory,
            assetHashType: lib_1.AssetHashType.OUTPUT,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
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
        const app = new lib_1.App();
        const stage = new lib_1.Stage(app, 'Stage');
        stage.node.setContext(cxapi.BUNDLING_STACKS, ['Stage/Stack1']);
        const stack1 = new lib_1.Stack(stage, 'Stack1', { stackName: 'unrelated-stack1-name' });
        const stack2 = new lib_1.Stack(stage, 'Stack2', { stackName: 'unrelated-stack2-name' });
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        new lib_1.AssetStaging(stack1, 'Asset', {
            sourcePath: directory,
            assetHashType: lib_1.AssetHashType.OUTPUT,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS],
            },
        });
        new lib_1.AssetStaging(stack2, 'Asset', {
            sourcePath: directory,
            assetHashType: lib_1.AssetHashType.OUTPUT,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
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
        const app = new lib_1.App();
        const stage = new lib_1.Stage(app, 'Stage');
        const stack1 = new lib_1.Stack(stage, 'Stack1');
        const stack2 = new lib_1.Stack(stage, 'Stack2');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        new lib_1.AssetStaging(stack1, 'Asset', {
            sourcePath: directory,
            assetHashType: lib_1.AssetHashType.OUTPUT,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS],
            },
        });
        new lib_1.AssetStaging(stack2, 'Asset', {
            sourcePath: directory,
            assetHashType: lib_1.AssetHashType.OUTPUT,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
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
        const app = new lib_1.App();
        const stage = new lib_1.Stage(app, 'Stage');
        stage.node.setContext(cxapi.BUNDLING_STACKS, ['**/Stack1']); // a single wildcard prefix ('*Stack1') won't match
        const stack1 = new lib_1.Stack(stage, 'Stack1');
        const stack2 = new lib_1.Stack(stage, 'Stack2');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        new lib_1.AssetStaging(stack1, 'Asset', {
            sourcePath: directory,
            assetHashType: lib_1.AssetHashType.OUTPUT,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS],
            },
        });
        new lib_1.AssetStaging(stack2, 'Asset', {
            sourcePath: directory,
            assetHashType: lib_1.AssetHashType.OUTPUT,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
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
        const app = new lib_1.App();
        const topStack = new lib_1.Stack(app, 'TopStack');
        topStack.node.setContext(cxapi.BUNDLING_STACKS, ['TopStack/MiddleStage/BottomStack']);
        const middleStage = new lib_1.Stage(topStack, 'MiddleStage');
        const bottomStack = new lib_1.Stack(middleStage, 'BottomStack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        new lib_1.AssetStaging(bottomStack, 'Asset', {
            sourcePath: directory,
            assetHashType: lib_1.AssetHashType.OUTPUT,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS],
            },
        });
        new lib_1.AssetStaging(topStack, 'Asset', {
            sourcePath: directory,
            assetHashType: lib_1.AssetHashType.OUTPUT,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
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
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'MyStack');
        stack.node.setContext(cxapi.BUNDLING_STACKS, ['*Stack']);
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        const asset = new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            assetHashType: lib_1.AssetHashType.OUTPUT,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS],
            },
        });
        expect(readDockerStubInput()).toEqual(`run --rm ${USER_ARG} -v /input:/asset-input:delegated -v /output:/asset-output:delegated -w /asset-input alpine DOCKER_STUB_SUCCESS`);
        expect(asset.assetHash).toEqual('33cbf2cae5432438e0f046bc45ba8c3cef7b6afcf47b59d1c183775c1918fb1f'); // hash of MyStack/Asset
    });
    test('bundling still occurs with a single wildcard', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'MyStack');
        stack.node.setContext(cxapi.BUNDLING_STACKS, ['*']);
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        const asset = new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            assetHashType: lib_1.AssetHashType.OUTPUT,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SUCCESS],
            },
        });
        expect(readDockerStubInput()).toEqual(`run --rm ${USER_ARG} -v /input:/asset-input:delegated -v /output:/asset-output:delegated -w /asset-input alpine DOCKER_STUB_SUCCESS`);
        expect(asset.assetHash).toEqual('33cbf2cae5432438e0f046bc45ba8c3cef7b6afcf47b59d1c183775c1918fb1f'); // hash of MyStack/Asset
    });
    test('bundling that produces a single archive file is autodiscovered', () => {
        // GIVEN
        const app = new lib_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        const staging = new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SINGLE_ARCHIVE],
            },
        });
        // THEN
        const assembly = app.synth();
        expect(fs.readdirSync(assembly.directory)).toEqual([
            'asset.f43148c61174f444925231b5849b468f21e93b5d1469cd07c53625ffd039ef48',
            'asset.f43148c61174f444925231b5849b468f21e93b5d1469cd07c53625ffd039ef48.zip',
            'cdk.out',
            'manifest.json',
            'stack.template.json',
            'tree.json',
        ]);
        expect(fs.readdirSync(path.join(assembly.directory, 'asset.f43148c61174f444925231b5849b468f21e93b5d1469cd07c53625ffd039ef48'))).toEqual([
            'test.zip', // bundle dir with "touched" bundled output file
        ]);
        expect(staging.packaging).toEqual(cloud_assembly_schema_1.FileAssetPackaging.FILE);
        expect(staging.isArchive).toEqual(true);
    });
    test('bundling that produces a single archive file with disk cache', () => {
        // GIVEN
        const TEST_OUTDIR = path.join(__dirname, 'cdk.out');
        if (fs.existsSync(TEST_OUTDIR)) {
            fs.removeSync(TEST_OUTDIR);
        }
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        const app1 = new lib_1.App({ outdir: TEST_OUTDIR });
        const stack1 = new lib_1.Stack(app1, 'Stack');
        const app2 = new lib_1.App({ outdir: TEST_OUTDIR }); // same OUTDIR
        const stack2 = new lib_1.Stack(app2, 'stack');
        // WHEN
        const staging1 = new lib_1.AssetStaging(stack1, 'Asset', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SINGLE_ARCHIVE],
                outputType: lib_1.BundlingOutput.ARCHIVED,
            },
        });
        // Now clear asset hash cache to show that during the second staging
        // even though bundling is skipped it will correctly be considered
        // as a FileAssetPackaging.FILE.
        lib_1.AssetStaging.clearAssetHashCache();
        const staging2 = new lib_1.AssetStaging(stack2, 'Asset', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SINGLE_ARCHIVE],
                outputType: lib_1.BundlingOutput.ARCHIVED,
            },
        });
        // THEN
        expect(staging1.packaging).toEqual(cloud_assembly_schema_1.FileAssetPackaging.FILE);
        expect(staging1.isArchive).toEqual(true);
        expect(staging2.packaging).toEqual(staging1.packaging);
        expect(staging2.isArchive).toEqual(staging1.isArchive);
    });
    test('bundling that produces a single archive file with NOT_ARCHIVED', () => {
        // GIVEN
        const app = new lib_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        const staging = new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.SINGLE_ARCHIVE],
                outputType: lib_1.BundlingOutput.NOT_ARCHIVED,
            },
        });
        // THEN
        const assembly = app.synth();
        expect(fs.readdirSync(assembly.directory)).toEqual([
            'asset.86ec07746e1d859290cfd8b9c648e581555649c75f51f741f11e22cab6775abc',
            'cdk.out',
            'manifest.json',
            'stack.template.json',
            'tree.json',
        ]);
        expect(staging.packaging).toEqual(cloud_assembly_schema_1.FileAssetPackaging.ZIP_DIRECTORY);
        expect(staging.isArchive).toEqual(true);
    });
    test('throws with ARCHIVED and bundling that does not produce a single archive file', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        expect(() => new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.MULTIPLE_FILES],
                outputType: lib_1.BundlingOutput.ARCHIVED,
            },
        })).toThrow(/Bundling output directory is expected to include only a single archive file when `output` is set to `ARCHIVED`/);
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
        lib_1.AssetStaging.clearAssetHashCache();
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
        const app = new lib_1.App({ context: { [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false } });
        const stack = new lib_1.Stack(app, 'stack');
        const directory = path.join(__dirname, 'fs', 'fixtures', 'test1');
        // WHEN
        const staging = new lib_1.AssetStaging(stack, 'Asset', {
            sourcePath: directory,
            bundling: {
                image: lib_1.DockerImage.fromRegistry('alpine'),
                command: [DockerStubCommand.VOLUME_SINGLE_ARCHIVE],
                bundlingFileAccess: lib_1.BundlingFileAccess.VOLUME_COPY,
            },
        });
        // THEN
        const assembly = app.synth();
        expect(fs.readdirSync(assembly.directory)).toEqual([
            'asset.0ec371a2022d29dfd83f5df104e0f01b34233a4e3e839c3c4ec62008f0b9a0e8',
            'asset.0ec371a2022d29dfd83f5df104e0f01b34233a4e3e839c3c4ec62008f0b9a0e8.zip',
            'cdk.out',
            'manifest.json',
            'stack.template.json',
            'tree.json',
        ]);
        expect(fs.readdirSync(path.join(assembly.directory, 'asset.0ec371a2022d29dfd83f5df104e0f01b34233a4e3e839c3c4ec62008f0b9a0e8'))).toEqual([
            'test.zip', // bundle dir with "touched" bundled output file
        ]);
        expect(staging.packaging).toEqual(cloud_assembly_schema_1.FileAssetPackaging.FILE);
        expect(staging.isArchive).toEqual(true);
        const dockerCalls = readDockerStubInputConcat(STUB_INPUT_CP_CONCAT_FILE).split(/\r?\n/);
        expect(dockerCalls).toEqual(expect.arrayContaining([
            expect.stringContaining('volume create assetInput'),
            expect.stringContaining('volume create assetOutput'),
            expect.stringMatching('run --name copyContainer.* -v /input:/asset-input -v /output:/asset-output alpine sh -c mkdir -p /asset-input && chown -R .* /asset-output && chown -R .* /asset-input'),
            expect.stringMatching('cp .*fs/fixtures/test1/\. copyContainer.*:/asset-input'),
            expect.stringMatching('run --rm -u .* --volumes-from copyContainer.* -w /asset-input alpine DOCKER_STUB_VOLUME_SINGLE_ARCHIVE'),
            expect.stringMatching('cp copyContainer.*:/asset-output/\. .*'),
            expect.stringContaining('rm copyContainer'),
            expect.stringContaining('volume rm assetInput'),
            expect.stringContaining('volume rm assetOutput'),
        ]));
    });
});
// Reads a docker stub and cleans the volume paths out of the stub.
function readAndCleanDockerStubInput(file) {
    return fs
        .readFileSync(file, 'utf-8')
        .trim()
        .replace(/-v ([^:]+):\/asset-input/g, '-v /input:/asset-input')
        .replace(/-v ([^:]+):\/asset-output/g, '-v /output:/asset-output');
}
// Last docker input since last teardown
function readDockerStubInput(file) {
    return readAndCleanDockerStubInput(file ?? STUB_INPUT_FILE);
}
// Concatenated docker inputs since last teardown
function readDockerStubInputConcat(file) {
    return readAndCleanDockerStubInput(file ?? STUB_INPUT_CONCAT_FILE);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhZ2luZy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RhZ2luZy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3Qiw4REFBMEQ7QUFDMUQsMEVBQW9FO0FBQ3BFLHlDQUF5QztBQUN6QywrQkFBK0I7QUFDL0IsK0JBQStCO0FBQy9CLGdDQUFzSjtBQUV0SixNQUFNLGVBQWUsR0FBRyx3QkFBd0IsQ0FBQztBQUNqRCxNQUFNLHNCQUFzQixHQUFHLCtCQUErQixDQUFDO0FBRS9ELE1BQU0sa0JBQWtCLEdBQUcsMkJBQTJCLENBQUM7QUFDdkQsTUFBTSx5QkFBeUIsR0FBRyxrQ0FBa0MsQ0FBQztBQUVyRSxJQUFLLGlCQU9KO0FBUEQsV0FBSyxpQkFBaUI7SUFDcEIsb0RBQStCLENBQUE7SUFDL0IsOENBQXlCLENBQUE7SUFDekIsd0VBQW1ELENBQUE7SUFDbkQsa0VBQTZDLENBQUE7SUFDN0Msa0VBQTZDLENBQUE7SUFDN0MsZ0ZBQTJELENBQUE7QUFDN0QsQ0FBQyxFQVBJLGlCQUFpQixLQUFqQixpQkFBaUIsUUFPckI7QUFFRCxNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDMUUsTUFBTSxrQkFBa0IsR0FBRyxrRUFBa0UsQ0FBQztBQUM5RixNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUN0RSxNQUFNLHlCQUF5QixHQUFHLGtFQUFrRSxDQUFDO0FBQ3JHLE1BQU0seUJBQXlCLEdBQUcsa0VBQWtFLENBQUM7QUFFckcsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQy9CLE1BQU0sUUFBUSxHQUFHLE1BQU0sUUFBUSxDQUFDLEdBQUcsSUFBSSxRQUFR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TyxDQUFDLDRCQUE0QixFQUFFLDBCQUEwQixDQUFDLENBQUM7QUFDdkUsQ0FBQztBQUVELHdDQUF3QztBQUN4QyxTQUFTLG1CQUFtQixDQUFDLElBQWE7SUFDeEMsT0FBTywyQkFBMkIsQ0FBQyxJQUFJLElBQUksZUFBZSxDQUFDLENBQUM7QUFDOUQsQ0FBQztBQUNELGlEQUFpRDtBQUNqRCxTQUFTLHlCQUF5QixDQUFDLElBQWE7SUFDOUMsT0FBTywyQkFBMkIsQ0FBQyxJQUFJLElBQUksc0JBQXNCLENBQUMsQ0FBQztBQUNyRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgb3MgZnJvbSAnb3MnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IHRlc3REZXByZWNhdGVkIH0gZnJvbSAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJztcbmltcG9ydCB7IEZpbGVBc3NldFBhY2thZ2luZyB9IGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0ICogYXMgc2lub24gZnJvbSAnc2lub24nO1xuaW1wb3J0IHsgQXBwLCBBc3NldEhhc2hUeXBlLCBBc3NldFN0YWdpbmcsIERvY2tlckltYWdlLCBCdW5kbGluZ09wdGlvbnMsIEJ1bmRsaW5nT3V0cHV0LCBGaWxlU3lzdGVtLCBTdGFjaywgU3RhZ2UsIEJ1bmRsaW5nRmlsZUFjY2VzcyB9IGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IFNUVUJfSU5QVVRfRklMRSA9ICcvdG1wL2RvY2tlci1zdHViLmlucHV0JztcbmNvbnN0IFNUVUJfSU5QVVRfQ09OQ0FUX0ZJTEUgPSAnL3RtcC9kb2NrZXItc3R1Yi5pbnB1dC5jb25jYXQnO1xuXG5jb25zdCBTVFVCX0lOUFVUX0NQX0ZJTEUgPSAnL3RtcC9kb2NrZXItc3R1Yi1jcC5pbnB1dCc7XG5jb25zdCBTVFVCX0lOUFVUX0NQX0NPTkNBVF9GSUxFID0gJy90bXAvZG9ja2VyLXN0dWItY3AuaW5wdXQuY29uY2F0JztcblxuZW51bSBEb2NrZXJTdHViQ29tbWFuZCB7XG4gIFNVQ0NFU1MgPSAnRE9DS0VSX1NUVUJfU1VDQ0VTUycsXG4gIEZBSUwgPSAnRE9DS0VSX1NUVUJfRkFJTCcsXG4gIFNVQ0NFU1NfTk9fT1VUUFVUID0gJ0RPQ0tFUl9TVFVCX1NVQ0NFU1NfTk9fT1VUUFVUJyxcbiAgTVVMVElQTEVfRklMRVMgPSAnRE9DS0VSX1NUVUJfTVVMVElQTEVfRklMRVMnLFxuICBTSU5HTEVfQVJDSElWRSA9ICdET0NLRVJfU1RVQl9TSU5HTEVfQVJDSElWRScsXG4gIFZPTFVNRV9TSU5HTEVfQVJDSElWRSA9ICdET0NLRVJfU1RVQl9WT0xVTUVfU0lOR0xFX0FSQ0hJVkUnLFxufVxuXG5jb25zdCBGSVhUVVJFX1RFU1QxX0RJUiA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuY29uc3QgRklYVFVSRV9URVNUMV9IQVNIID0gJzJmMzdmOTM3YzUxZTJjMTkxYWY2NmFjZjliMDlmNTQ4OTI2MDA4ZWM2OGM1NzViZDJlZTU0YjZlOTk3YzBlMDAnO1xuY29uc3QgRklYVFVSRV9UQVJCQUxMID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzJywgJ2ZpeHR1cmVzLnRhci5neicpO1xuY29uc3QgTk9UX0FSQ0hJVkVEX1pJUF9UWFRfSEFTSCA9ICc5NWM5MjRjODRmNWQwMjNiZTRlZGVlNTQwY2IyY2I0MDFhNDlmMTE1ZDAxZWQ0MDNiMjg4ZjZjYjQxMjc3MWRmJztcbmNvbnN0IEFSQ0hJVkVfVEFSQkFMTF9URVNUX0hBU0ggPSAnM2U5NDhmZjU0YTI3N2Q2MDAxZTI0NTJmZGJjNGE5ZWY2MWY5MTZmZjY2MmJhNWUwNWVjZTFlMmVjNmRlYzlmNSc7XG5cbmNvbnN0IHVzZXJJbmZvID0gb3MudXNlckluZm8oKTtcbmNvbnN0IFVTRVJfQVJHID0gYC11ICR7dXNlckluZm8udWlkfToke3VzZXJJbmZvLmdpZH1gO1xuXG5cbmRlc2NyaWJlKCdzdGFnaW5nJywgKCkgPT4ge1xuICBiZWZvcmVBbGwoKCkgPT4ge1xuICAgIC8vIHRoaXMgaXMgYSB3YXkgdG8gcHJvdmlkZSBhIGN1c3RvbSBcImRvY2tlclwiIGNvbW1hbmQgZm9yIHN0YWdpbmcuXG4gICAgcHJvY2Vzcy5lbnYuQ0RLX0RPQ0tFUiA9IGAke19fZGlybmFtZX0vZG9ja2VyLXN0dWIuc2hgO1xuICB9KTtcblxuICBhZnRlckFsbCgoKSA9PiB7XG4gICAgZGVsZXRlIHByb2Nlc3MuZW52LkNES19ET0NLRVI7XG4gIH0pO1xuXG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgQXNzZXRTdGFnaW5nLmNsZWFyQXNzZXRIYXNoQ2FjaGUoKTtcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhTVFVCX0lOUFVUX0ZJTEUpKSB7XG4gICAgICBmcy51bmxpbmtTeW5jKFNUVUJfSU5QVVRfRklMRSk7XG4gICAgfVxuICAgIGlmIChmcy5leGlzdHNTeW5jKFNUVUJfSU5QVVRfQ09OQ0FUX0ZJTEUpKSB7XG4gICAgICBmcy51bmxpbmtTeW5jKFNUVUJfSU5QVVRfQ09OQ0FUX0ZJTEUpO1xuICAgIH1cbiAgICBzaW5vbi5yZXN0b3JlKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Jhc2UgY2FzZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3Qgc291cmNlUGF0aCA9IEZJWFRVUkVfVEVTVDFfRElSO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHN0YWdpbmcgPSBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnczEnLCB7IHNvdXJjZVBhdGggfSk7XG5cbiAgICBleHBlY3Qoc3RhZ2luZy5hc3NldEhhc2gpLnRvRXF1YWwoRklYVFVSRV9URVNUMV9IQVNIKTtcbiAgICBleHBlY3Qoc3RhZ2luZy5zb3VyY2VQYXRoKS50b0VxdWFsKHNvdXJjZVBhdGgpO1xuICAgIGV4cGVjdChwYXRoLmJhc2VuYW1lKHN0YWdpbmcuYWJzb2x1dGVTdGFnZWRQYXRoKSkudG9FcXVhbChgYXNzZXQuJHtGSVhUVVJFX1RFU1QxX0hBU0h9YCk7XG4gICAgZXhwZWN0KHBhdGguYmFzZW5hbWUoc3RhZ2luZy5yZWxhdGl2ZVN0YWdlZFBhdGgoc3RhY2spKSkudG9FcXVhbChgYXNzZXQuJHtGSVhUVVJFX1RFU1QxX0hBU0h9YCk7XG4gICAgZXhwZWN0KHN0YWdpbmcucGFja2FnaW5nKS50b0VxdWFsKEZpbGVBc3NldFBhY2thZ2luZy5aSVBfRElSRUNUT1JZKTtcbiAgICBleHBlY3Qoc3RhZ2luZy5pc0FyY2hpdmUpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Jhc2UgY2FzZSBpZiBzb3VyY2UgZGlyZWN0b3J5IGlzIGEgc3ltbGluaycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3Qgc291cmNlUGF0aCA9IHBhdGguam9pbihvcy50bXBkaXIoKSwgJ2Fzc2V0LXN5bWxpbmsnKTtcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhzb3VyY2VQYXRoKSkgeyBmcy51bmxpbmtTeW5jKHNvdXJjZVBhdGgpOyB9XG4gICAgZnMuc3ltbGlua1N5bmMoRklYVFVSRV9URVNUMV9ESVIsIHNvdXJjZVBhdGgpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHN0YWdpbmcgPSBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnczEnLCB7IHNvdXJjZVBhdGggfSk7XG5cbiAgICAgIC8vIFNob3VsZCBiZSB0aGUgc2FtZSBhc3NldCBoYXNoIGFzIGluIHRoZSBwcmV2aW91cyB0ZXN0XG4gICAgICBleHBlY3Qoc3RhZ2luZy5hc3NldEhhc2gpLnRvRXF1YWwoRklYVFVSRV9URVNUMV9IQVNIKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoc291cmNlUGF0aCkpIHtcbiAgICAgICAgZnMudW5saW5rU3luYyhzb3VyY2VQYXRoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHRlc3QoJ3N0YWdpbmcgb2YgYW4gYXJjaGl2ZSBmaWxlIGNvcnJlY3RseSBzZXRzIHBhY2thZ2luZyBhbmQgaXNBcmNoaXZlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBzb3VyY2VQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2FyY2hpdmUnLCAnYXJjaGl2ZS56aXAnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzdGFnaW5nID0gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ3MxJywgeyBzb3VyY2VQYXRoIH0pO1xuXG4gICAgZXhwZWN0KHN0YWdpbmcucGFja2FnaW5nKS50b0VxdWFsKEZpbGVBc3NldFBhY2thZ2luZy5GSUxFKTtcbiAgICBleHBlY3Qoc3RhZ2luZy5pc0FyY2hpdmUpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N0YWdpbmcgb2YgYW4gYXJjaGl2ZSB3aXRoIG11bHRpcGxlIGV4dGVuc2lvbiBuYW1lIGNvcnJlY3RseSBzZXRzIHBhY2thZ2luZyBhbmQgaXNBcmNoaXZlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBzb3VyY2VQYXRoVGFyR3oxID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2FyY2hpdmUnLCAnYXJ0aWZhY3QudGFyLmd6Jyk7XG4gICAgY29uc3Qgc291cmNlUGF0aFRhckd6MiA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdhcmNoaXZlJywgJ2FydGlmYWN0LmRhLnZpbmNpLm1vbmFsaXNhLnRhci5neicpO1xuICAgIGNvbnN0IHNvdXJjZVBhdGhUZ3ogPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnYXJjaGl2ZScsICdhcnRpZmFjdC50Z3onKTtcbiAgICBjb25zdCBzb3VyY2VQYXRoVGFyID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2FyY2hpdmUnLCAnYXJ0aWZhY3QudGFyJyk7XG4gICAgY29uc3Qgc291cmNlUGF0aE5vdEFyY2hpdmUgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnYXJjaGl2ZScsICdhcnRpZmFjdC56aXAudHh0Jyk7XG4gICAgY29uc3Qgc291cmNlUGF0aERvY2tlckZpbGUgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnYXJjaGl2ZScsICdEb2NrZXJGaWxlJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc3RhZ2luZ1Rhckd6MSA9IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdzMScsIHsgc291cmNlUGF0aDogc291cmNlUGF0aFRhckd6MSB9KTtcbiAgICBjb25zdCBzdGFnaW5nVGFyR3oyID0gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ3MyJywgeyBzb3VyY2VQYXRoOiBzb3VyY2VQYXRoVGFyR3oyIH0pO1xuICAgIGNvbnN0IHN0YWdpbmdUZ3ogPSBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnczMnLCB7IHNvdXJjZVBhdGg6IHNvdXJjZVBhdGhUZ3ogfSk7XG4gICAgY29uc3Qgc3RhZ2luZ1RhciA9IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdzNCcsIHsgc291cmNlUGF0aDogc291cmNlUGF0aFRhciB9KTtcbiAgICBjb25zdCBzdGFnaW5nTm90QXJjaGl2ZSA9IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdzNScsIHsgc291cmNlUGF0aDogc291cmNlUGF0aE5vdEFyY2hpdmUgfSk7XG4gICAgY29uc3Qgc3RhZ2luZ0RvY2tlckZpbGUgPSBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnczYnLCB7IHNvdXJjZVBhdGg6IHNvdXJjZVBhdGhEb2NrZXJGaWxlIH0pO1xuXG4gICAgZXhwZWN0KHN0YWdpbmdUYXJHejEucGFja2FnaW5nKS50b0VxdWFsKEZpbGVBc3NldFBhY2thZ2luZy5GSUxFKTtcbiAgICBleHBlY3Qoc3RhZ2luZ1Rhckd6MS5pc0FyY2hpdmUpLnRvRXF1YWwodHJ1ZSk7XG4gICAgZXhwZWN0KHN0YWdpbmdUYXJHejIucGFja2FnaW5nKS50b0VxdWFsKEZpbGVBc3NldFBhY2thZ2luZy5GSUxFKTtcbiAgICBleHBlY3QocGF0aC5iYXNlbmFtZShzdGFnaW5nVGFyR3oyLmFic29sdXRlU3RhZ2VkUGF0aCkpLnRvRXF1YWwoYGFzc2V0LiR7QVJDSElWRV9UQVJCQUxMX1RFU1RfSEFTSH0udGFyLmd6YCk7XG4gICAgZXhwZWN0KHBhdGguYmFzZW5hbWUoc3RhZ2luZ1Rhckd6Mi5yZWxhdGl2ZVN0YWdlZFBhdGgoc3RhY2spKSkudG9FcXVhbChgYXNzZXQuJHtBUkNISVZFX1RBUkJBTExfVEVTVF9IQVNIfS50YXIuZ3pgKTtcbiAgICBleHBlY3Qoc3RhZ2luZ1Rhckd6Mi5pc0FyY2hpdmUpLnRvRXF1YWwodHJ1ZSk7XG4gICAgZXhwZWN0KHN0YWdpbmdUZ3oucGFja2FnaW5nKS50b0VxdWFsKEZpbGVBc3NldFBhY2thZ2luZy5GSUxFKTtcbiAgICBleHBlY3Qoc3RhZ2luZ1Rnei5pc0FyY2hpdmUpLnRvRXF1YWwodHJ1ZSk7XG4gICAgZXhwZWN0KHN0YWdpbmdUYXIucGFja2FnaW5nKS50b0VxdWFsKEZpbGVBc3NldFBhY2thZ2luZy5GSUxFKTtcbiAgICBleHBlY3Qoc3RhZ2luZ1Rhci5pc0FyY2hpdmUpLnRvRXF1YWwodHJ1ZSk7XG4gICAgZXhwZWN0KHN0YWdpbmdOb3RBcmNoaXZlLnBhY2thZ2luZykudG9FcXVhbChGaWxlQXNzZXRQYWNrYWdpbmcuRklMRSk7XG4gICAgZXhwZWN0KHBhdGguYmFzZW5hbWUoc3RhZ2luZ05vdEFyY2hpdmUuYWJzb2x1dGVTdGFnZWRQYXRoKSkudG9FcXVhbChgYXNzZXQuJHtOT1RfQVJDSElWRURfWklQX1RYVF9IQVNIfS50eHRgKTtcbiAgICBleHBlY3QocGF0aC5iYXNlbmFtZShzdGFnaW5nTm90QXJjaGl2ZS5yZWxhdGl2ZVN0YWdlZFBhdGgoc3RhY2spKSkudG9FcXVhbChgYXNzZXQuJHtOT1RfQVJDSElWRURfWklQX1RYVF9IQVNIfS50eHRgKTtcbiAgICBleHBlY3Qoc3RhZ2luZ05vdEFyY2hpdmUuaXNBcmNoaXZlKS50b0VxdWFsKGZhbHNlKTtcbiAgICBleHBlY3Qoc3RhZ2luZ0RvY2tlckZpbGUucGFja2FnaW5nKS50b0VxdWFsKEZpbGVBc3NldFBhY2thZ2luZy5GSUxFKTtcbiAgICBleHBlY3Qoc3RhZ2luZ0RvY2tlckZpbGUuaXNBcmNoaXZlKS50b0VxdWFsKGZhbHNlKTtcblxuICB9KTtcblxuICB0ZXN0KCdhc3NldCBwYWNrYWdpbmcgdHlwZSBpcyBjb3JyZWN0IHdoZW4gc3RhZ2luZyBpcyBza2lwcGVkIGJlY2F1c2Ugb2YgbWVtb3J5IGNhY2hlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBzb3VyY2VQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2FyY2hpdmUnLCAnYXJjaGl2ZS56aXAnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzdGFnaW5nMSA9IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdzMScsIHsgc291cmNlUGF0aCB9KTtcbiAgICBjb25zdCBzdGFnaW5nMiA9IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdzMicsIHsgc291cmNlUGF0aCB9KTtcblxuICAgIGV4cGVjdChzdGFnaW5nMS5wYWNrYWdpbmcpLnRvRXF1YWwoRmlsZUFzc2V0UGFja2FnaW5nLkZJTEUpO1xuICAgIGV4cGVjdChzdGFnaW5nMS5pc0FyY2hpdmUpLnRvRXF1YWwodHJ1ZSk7XG4gICAgZXhwZWN0KHN0YWdpbmcyLnBhY2thZ2luZykudG9FcXVhbChzdGFnaW5nMS5wYWNrYWdpbmcpO1xuICAgIGV4cGVjdChzdGFnaW5nMi5pc0FyY2hpdmUpLnRvRXF1YWwoc3RhZ2luZzEuaXNBcmNoaXZlKTtcbiAgfSk7XG5cbiAgdGVzdCgnYXNzZXQgcGFja2FnaW5nIHR5cGUgaXMgY29ycmVjdCB3aGVuIHN0YWdpbmcgaXMgc2tpcHBlZCBiZWNhdXNlIG9mIGRpc2sgY2FjaGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBURVNUX09VVERJUiA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdjZGsub3V0Jyk7XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoVEVTVF9PVVRESVIpKSB7XG4gICAgICBmcy5yZW1vdmVTeW5jKFRFU1RfT1VURElSKTtcbiAgICB9XG5cbiAgICBjb25zdCBzb3VyY2VQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2FyY2hpdmUnLCAnYXJjaGl2ZS56aXAnKTtcblxuICAgIGNvbnN0IGFwcDEgPSBuZXcgQXBwKHsgb3V0ZGlyOiBURVNUX09VVERJUiB9KTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwMSwgJ1N0YWNrJyk7XG5cbiAgICBjb25zdCBhcHAyID0gbmV3IEFwcCh7IG91dGRpcjogVEVTVF9PVVRESVIgfSk7IC8vIHNhbWUgT1VURElSXG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcDIsICdzdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHN0YWdpbmcxID0gbmV3IEFzc2V0U3RhZ2luZyhzdGFjazEsICdBc3NldCcsIHsgc291cmNlUGF0aCB9KTtcblxuICAgIC8vIE5vdyBjbGVhciBhc3NldCBoYXNoIGNhY2hlIHRvIHNob3cgdGhhdCBkdXJpbmcgdGhlIHNlY29uZCBzdGFnaW5nXG4gICAgLy8gZXZlbiB0aG91Z2ggdGhlIGFzc2V0IGlzIGFscmVhZHkgYXZhaWxhYmxlIG9uIGRpc2sgaXQgd2lsbCBjb3JyZWN0bHlcbiAgICAvLyBiZSBjb25zaWRlcmVkIGFzIGEgRmlsZUFzc2V0UGFja2FnaW5nLkZJTEUuXG4gICAgQXNzZXRTdGFnaW5nLmNsZWFyQXNzZXRIYXNoQ2FjaGUoKTtcblxuICAgIGNvbnN0IHN0YWdpbmcyID0gbmV3IEFzc2V0U3RhZ2luZyhzdGFjazIsICdBc3NldCcsIHsgc291cmNlUGF0aCB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhZ2luZzEucGFja2FnaW5nKS50b0VxdWFsKEZpbGVBc3NldFBhY2thZ2luZy5GSUxFKTtcbiAgICBleHBlY3Qoc3RhZ2luZzEuaXNBcmNoaXZlKS50b0VxdWFsKHRydWUpO1xuICAgIGV4cGVjdChzdGFnaW5nMi5wYWNrYWdpbmcpLnRvRXF1YWwoc3RhZ2luZzEucGFja2FnaW5nKTtcbiAgICBleHBlY3Qoc3RhZ2luZzIuaXNBcmNoaXZlKS50b0VxdWFsKHN0YWdpbmcxLmlzQXJjaGl2ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N0YWdpbmcgb2YgYSBub24tYXJjaGl2ZSBmaWxlIGNvcnJlY3RseSBzZXRzIHBhY2thZ2luZyBhbmQgaXNBcmNoaXZlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBzb3VyY2VQYXRoID0gX19maWxlbmFtZTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzdGFnaW5nID0gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ3MxJywgeyBzb3VyY2VQYXRoIH0pO1xuXG4gICAgZXhwZWN0KHN0YWdpbmcucGFja2FnaW5nKS50b0VxdWFsKEZpbGVBc3NldFBhY2thZ2luZy5GSUxFKTtcbiAgICBleHBlY3Qoc3RhZ2luZy5pc0FyY2hpdmUpLnRvRXF1YWwoZmFsc2UpO1xuICB9KTtcblxuICB0ZXN0KCdzdGFnaW5nIGNhbiBiZSBkaXNhYmxlZCB0aHJvdWdoIGNvbnRleHQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dChjeGFwaS5ESVNBQkxFX0FTU0VUX1NUQUdJTkdfQ09OVEVYVCwgdHJ1ZSk7XG4gICAgY29uc3Qgc291cmNlUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHN0YWdpbmcgPSBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnczEnLCB7IHNvdXJjZVBhdGggfSk7XG5cbiAgICBleHBlY3Qoc3RhZ2luZy5hc3NldEhhc2gpLnRvRXF1YWwoRklYVFVSRV9URVNUMV9IQVNIKTtcbiAgICBleHBlY3Qoc3RhZ2luZy5zb3VyY2VQYXRoKS50b0VxdWFsKHNvdXJjZVBhdGgpO1xuICAgIGV4cGVjdChzdGFnaW5nLmFic29sdXRlU3RhZ2VkUGF0aCkudG9FcXVhbChzb3VyY2VQYXRoKTtcbiAgICBleHBlY3Qoc3RhZ2luZy5yZWxhdGl2ZVN0YWdlZFBhdGgoc3RhY2spKS50b0VxdWFsKHNvdXJjZVBhdGgpO1xuICB9KTtcblxuICB0ZXN0KCdmaWxlcyBhcmUgY29waWVkIHRvIHRoZSBvdXRwdXQgZGlyZWN0b3J5IGR1cmluZyBzeW50aCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoeyBjb250ZXh0OiB7IFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSB9IH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ3MxJywgeyBzb3VyY2VQYXRoOiBGSVhUVVJFX1RFU1QxX0RJUiB9KTtcbiAgICBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnZmlsZScsIHsgc291cmNlUGF0aDogRklYVFVSRV9UQVJCQUxMIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgZXhwZWN0KGZzLnJlYWRkaXJTeW5jKGFzc2VtYmx5LmRpcmVjdG9yeSkpLnRvRXF1YWwoW1xuICAgICAgYGFzc2V0LiR7RklYVFVSRV9URVNUMV9IQVNIfWAsXG4gICAgICAnYXNzZXQuYWYxMGFjMDRiM2I2MDdiMGY4NjU5YzhmMGNlZThjMzQzMDI1ZWU3NWJhZjBiMTQ2ZjEwZjBlNTMxMWQyYzQ2Yi50YXIuZ3onLFxuICAgICAgJ2Nkay5vdXQnLFxuICAgICAgJ21hbmlmZXN0Lmpzb24nLFxuICAgICAgJ3N0YWNrLnRlbXBsYXRlLmpzb24nLFxuICAgICAgJ3RyZWUuanNvbicsXG4gICAgXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Fzc2V0cyBpbiBuZXN0ZWQgYXNzZW1ibGllcyBnZXQgc3RhZ2VkIGludG8gYXNzZW1ibHkgcm9vdCBkaXJlY3RvcnknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKG5ldyBTdGFnZShhcHAsICdTdGFnZTEnKSwgJ1N0YWNrJyk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKG5ldyBTdGFnZShhcHAsICdTdGFnZTInKSwgJ1N0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IEFzc2V0U3RhZ2luZyhzdGFjazEsICdzMScsIHsgc291cmNlUGF0aDogRklYVFVSRV9URVNUMV9ESVIgfSk7XG4gICAgbmV3IEFzc2V0U3RhZ2luZyhzdGFjazIsICdzMScsIHsgc291cmNlUGF0aDogRklYVFVSRV9URVNUMV9ESVIgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcblxuICAgIC8vIE9uZSBhc3NldCBkaXJlY3RvcnkgYXQgdGhlIHRvcFxuICAgIGV4cGVjdChmcy5yZWFkZGlyU3luYyhhc3NlbWJseS5kaXJlY3RvcnkpKS50b0VxdWFsKFtcbiAgICAgICdhc3NlbWJseS1TdGFnZTEnLFxuICAgICAgJ2Fzc2VtYmx5LVN0YWdlMicsXG4gICAgICBgYXNzZXQuJHtGSVhUVVJFX1RFU1QxX0hBU0h9YCxcbiAgICAgICdjZGsub3V0JyxcbiAgICAgICdtYW5pZmVzdC5qc29uJyxcbiAgICAgICd0cmVlLmpzb24nLFxuICAgIF0pO1xuICB9KTtcblxuICB0ZXN0KCdhbGxvdyBzcGVjaWZ5aW5nIGV4dHJhIGRhdGEgdG8gaW5jbHVkZSBpbiB0aGUgc291cmNlIGhhc2gnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB3aXRob3V0RXh0cmEgPSBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnd2l0aG91dEV4dHJhJywgeyBzb3VyY2VQYXRoOiBkaXJlY3RvcnkgfSk7XG4gICAgY29uc3Qgd2l0aEV4dHJhID0gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ3dpdGhFeHRyYScsIHsgc291cmNlUGF0aDogZGlyZWN0b3J5LCBleHRyYUhhc2g6ICdib29tJyB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qod2l0aG91dEV4dHJhLmFzc2V0SGFzaCkubm90LnRvRXF1YWwod2l0aEV4dHJhLmFzc2V0SGFzaCk7XG4gICAgZXhwZWN0KHdpdGhvdXRFeHRyYS5hc3NldEhhc2gpLnRvRXF1YWwoRklYVFVSRV9URVNUMV9IQVNIKTtcbiAgICBleHBlY3Qod2l0aEV4dHJhLmFzc2V0SGFzaCkudG9FcXVhbCgnYzk1YzkxNWE1NzIyYmI5MDE5ZTJjNzI1ZDExODY4ZTVhNjE5YjU1ZjM2MTcyZjc2YmNiY2FhOGJiMmQxMGM1ZicpO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gc3BlY2lmeSBleHRyYSBhc3NldCBzYWx0IHZpYSBjb250ZXh0IGtleScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJyk7XG5cbiAgICBjb25zdCBzYWx0ZWRBcHAgPSBuZXcgQXBwKHsgY29udGV4dDogeyAnQGF3cy1jZGsvY29yZTphc3NldEhhc2hTYWx0JzogJ21hZ2ljJyB9IH0pO1xuICAgIGNvbnN0IHNhbHRlZFN0YWNrID0gbmV3IFN0YWNrKHNhbHRlZEFwcCwgJ3N0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXNzZXQgPSBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnWCcsIHsgc291cmNlUGF0aDogZGlyZWN0b3J5IH0pO1xuICAgIGNvbnN0IHNhbHRlZEFzc2V0ID0gbmV3IEFzc2V0U3RhZ2luZyhzYWx0ZWRTdGFjaywgJ1gnLCB7IHNvdXJjZVBhdGg6IGRpcmVjdG9yeSB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoYXNzZXQuYXNzZXRIYXNoKS5ub3QudG9FcXVhbChzYWx0ZWRBc3NldC5hc3NldEhhc2gpO1xuICB9KTtcblxuICB0ZXN0KCd3aXRoIGJ1bmRsaW5nJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IGNvbnRleHQ6IHsgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlIH0gfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcbiAgICBjb25zdCBwcm9jZXNzU3RkRXJyV3JpdGVTcHkgPSBzaW5vbi5zcHkocHJvY2Vzcy5zdGRlcnIsICd3cml0ZScpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgZXhwZWN0KFxuICAgICAgcmVhZERvY2tlclN0dWJJbnB1dCgpKS50b0VxdWFsKFxuICAgICAgYHJ1biAtLXJtICR7VVNFUl9BUkd9IC12IC9pbnB1dDovYXNzZXQtaW5wdXQ6ZGVsZWdhdGVkIC12IC9vdXRwdXQ6L2Fzc2V0LW91dHB1dDpkZWxlZ2F0ZWQgLXcgL2Fzc2V0LWlucHV0IGFscGluZSBET0NLRVJfU1RVQl9TVUNDRVNTYCxcbiAgICApO1xuICAgIGV4cGVjdChmcy5yZWFkZGlyU3luYyhhc3NlbWJseS5kaXJlY3RvcnkpKS50b0VxdWFsKFtcbiAgICAgICdhc3NldC5iMWUzMmU4NmIzNTIzZjJmYTUxMmViOTkxODBlZTI5NzVhNTBhNDQzOWU2M2U4YmFkZDE1M2YyYTY4ZDYxYWE0JyxcbiAgICAgICdjZGsub3V0JyxcbiAgICAgICdtYW5pZmVzdC5qc29uJyxcbiAgICAgICdzdGFjay50ZW1wbGF0ZS5qc29uJyxcbiAgICAgICd0cmVlLmpzb24nLFxuICAgIF0pO1xuXG4gICAgLy8gc2hvd3MgYSBtZXNzYWdlIGJlZm9yZSBidW5kbGluZ1xuICAgIGV4cGVjdChwcm9jZXNzU3RkRXJyV3JpdGVTcHkuY2FsbGVkV2l0aCgnQnVuZGxpbmcgYXNzZXQgc3RhY2svQXNzZXQuLi5cXG4nKSkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdCgnYnVuZGxlZCByZXNvdXJjZXMgaGF2ZSBhYnNvbHV0ZSBwYXRoIHdoZW4gc3RhZ2luZyBpcyBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoeyBjb250ZXh0OiB7IFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSB9IH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJyk7XG4gICAgc3RhY2subm9kZS5zZXRDb250ZXh0KGN4YXBpLkRJU0FCTEVfQVNTRVRfU1RBR0lOR19DT05URVhULCB0cnVlKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhc3NldCA9IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG5cbiAgICBleHBlY3QoZnMucmVhZGRpclN5bmMoYXNzZW1ibHkuZGlyZWN0b3J5KSkudG9FcXVhbChbXG4gICAgICAnYXNzZXQuYjFlMzJlODZiMzUyM2YyZmE1MTJlYjk5MTgwZWUyOTc1YTUwYTQ0MzllNjNlOGJhZGQxNTNmMmE2OGQ2MWFhNCcsXG4gICAgICAnY2RrLm91dCcsXG4gICAgICAnbWFuaWZlc3QuanNvbicsXG4gICAgICAnc3RhY2sudGVtcGxhdGUuanNvbicsXG4gICAgICAndHJlZS5qc29uJyxcbiAgICBdKTtcblxuICAgIGV4cGVjdChhc3NldC5hc3NldEhhc2gpLnRvRXF1YWwoJ2IxZTMyZTg2YjM1MjNmMmZhNTEyZWI5OTE4MGVlMjk3NWE1MGE0NDM5ZTYzZThiYWRkMTUzZjJhNjhkNjFhYTQnKTtcbiAgICBleHBlY3QoYXNzZXQuc291cmNlUGF0aCkudG9FcXVhbChkaXJlY3RvcnkpO1xuXG4gICAgY29uc3QgcmVzb2x2ZWRTdGFnZVBhdGggPSBhc3NldC5yZWxhdGl2ZVN0YWdlZFBhdGgoc3RhY2spO1xuICAgIC8vIGFic29sdXRlIHBhdGggZW5kaW5nIHdpdGggYnVuZGxpbmcgZGlyXG4gICAgZXhwZWN0KHBhdGguaXNBYnNvbHV0ZShyZXNvbHZlZFN0YWdlUGF0aCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgZXhwZWN0KG5ldyBSZWdFeHAoJ2Fzc2V0LmIxZTMyZTg2YjM1MjNmMmZhNTEyZWI5OTE4MGVlMjk3NWE1MGE0NDM5ZTYzZThiYWRkMTUzZjJhNjhkNjFhYTQkJykudGVzdChyZXNvbHZlZFN0YWdlUGF0aCkpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1bmRsZXIgcmV1c2VzIGl0cyBvdXRwdXQgd2hlbiBpdCBjYW4nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHsgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdzdGFjaycpO1xuICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ0Fzc2V0RHVwbGljYXRlJywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5TVUNDRVNTXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcblxuICAgIC8vIFdlJ3JlIHRlc3RpbmcgdGhhdCBkb2NrZXIgd2FzIHJ1biBleGFjdGx5IG9uY2UgZXZlbiB0aG91Z2ggdGhlcmUgYXJlIHR3byBidW5kbGluZyBhc3NldHMuXG4gICAgZXhwZWN0KFxuICAgICAgcmVhZERvY2tlclN0dWJJbnB1dENvbmNhdCgpKS50b0VxdWFsKFxuICAgICAgYHJ1biAtLXJtICR7VVNFUl9BUkd9IC12IC9pbnB1dDovYXNzZXQtaW5wdXQ6ZGVsZWdhdGVkIC12IC9vdXRwdXQ6L2Fzc2V0LW91dHB1dDpkZWxlZ2F0ZWQgLXcgL2Fzc2V0LWlucHV0IGFscGluZSBET0NLRVJfU1RVQl9TVUNDRVNTYCxcbiAgICApO1xuXG4gICAgZXhwZWN0KGZzLnJlYWRkaXJTeW5jKGFzc2VtYmx5LmRpcmVjdG9yeSkpLnRvRXF1YWwoW1xuICAgICAgJ2Fzc2V0LmIxZTMyZTg2YjM1MjNmMmZhNTEyZWI5OTE4MGVlMjk3NWE1MGE0NDM5ZTYzZThiYWRkMTUzZjJhNjhkNjFhYTQnLFxuICAgICAgJ2Nkay5vdXQnLFxuICAgICAgJ21hbmlmZXN0Lmpzb24nLFxuICAgICAgJ3N0YWNrLnRlbXBsYXRlLmpzb24nLFxuICAgICAgJ3RyZWUuanNvbicsXG4gICAgXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3VzZXMgYXNzZXQgaGFzaCBjYWNoZSB3aXRoIEFzc2V0SGFzaFR5cGUuT1VUUFVUJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IGNvbnRleHQ6IHsgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlIH0gfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcbiAgICBjb25zdCBmaW5nZXJQcmludFNweSA9IHNpbm9uLnNweShGaWxlU3lzdGVtLCAnZmluZ2VycHJpbnQnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnQXNzZXQnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBhc3NldEhhc2hUeXBlOiBBc3NldEhhc2hUeXBlLk9VVFBVVCxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ0Fzc2V0RHVwbGljYXRlJywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYXNzZXRIYXNoVHlwZTogQXNzZXRIYXNoVHlwZS5PVVRQVVQsXG4gICAgICBidW5kbGluZzogeyAvLyBTYW1lIGJ1bmRsaW5nIGJ1dCB3aXRoIGtleXMgb3JkZXJlZCBkaWZmZXJlbnRseVxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU10sXG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuXG4gICAgLy8gV2UncmUgdGVzdGluZyB0aGF0IGRvY2tlciB3YXMgcnVuIGV4YWN0bHkgb25jZSBldmVuIHRob3VnaCB0aGVyZSBhcmUgdHdvIGJ1bmRsaW5nIGFzc2V0c1xuICAgIC8vIGFuZCB0aGF0IHRoZSBoYXNoIGlzIGJhc2VkIG9uIHRoZSBvdXRwdXRcbiAgICBleHBlY3QoXG4gICAgICByZWFkRG9ja2VyU3R1YklucHV0Q29uY2F0KCkpLnRvRXF1YWwoXG4gICAgICBgcnVuIC0tcm0gJHtVU0VSX0FSR30gLXYgL2lucHV0Oi9hc3NldC1pbnB1dDpkZWxlZ2F0ZWQgLXYgL291dHB1dDovYXNzZXQtb3V0cHV0OmRlbGVnYXRlZCAtdyAvYXNzZXQtaW5wdXQgYWxwaW5lIERPQ0tFUl9TVFVCX1NVQ0NFU1NgLFxuICAgICk7XG5cbiAgICBleHBlY3QoZnMucmVhZGRpclN5bmMoYXNzZW1ibHkuZGlyZWN0b3J5KSkudG9FcXVhbChbXG4gICAgICAnYXNzZXQuMzNjYmYyY2FlNTQzMjQzOGUwZjA0NmJjNDViYThjM2NlZjdiNmFmY2Y0N2I1OWQxYzE4Mzc3NWMxOTE4ZmIxZicsXG4gICAgICAnY2RrLm91dCcsXG4gICAgICAnbWFuaWZlc3QuanNvbicsXG4gICAgICAnc3RhY2sudGVtcGxhdGUuanNvbicsXG4gICAgICAndHJlZS5qc29uJyxcbiAgICBdKTtcblxuICAgIC8vIE9ubHkgb25lIGZpbmdlcnByaW50aW5nXG4gICAgZXhwZWN0KGZpbmdlclByaW50U3B5LmNhbGxlZE9uY2UpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1bmRsZXIgY29uc2lkZXJzIGl0cyBvcHRpb25zIHdoZW4gcmV1c2luZyBidW5kbGUgb3V0cHV0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IGNvbnRleHQ6IHsgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlIH0gfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnQXNzZXQnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBpbWFnZTogRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKSxcbiAgICAgICAgY29tbWFuZDogW0RvY2tlclN0dWJDb21tYW5kLlNVQ0NFU1NdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldFdpdGhEaWZmZXJlbnRCdW5kbGluZ09wdGlvbnMnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBpbWFnZTogRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKSxcbiAgICAgICAgY29tbWFuZDogW0RvY2tlclN0dWJDb21tYW5kLlNVQ0NFU1NdLFxuICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgIFVOSVFVRV9FTlZfVkFSOiAnU09NRVZBTFVFJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcblxuICAgIC8vIFdlJ3JlIHRlc3RpbmcgdGhhdCBkb2NrZXIgd2FzIHJ1biB0d2ljZSAtIG9uY2UgZm9yIGVhY2ggc2V0IG9mIGJ1bmRsZXIgb3B0aW9uc1xuICAgIC8vIG9wZXJhdGluZyBvbiB0aGUgc2FtZSBzb3VyY2UgYXNzZXQuXG4gICAgZXhwZWN0KFxuICAgICAgcmVhZERvY2tlclN0dWJJbnB1dENvbmNhdCgpKS50b0VxdWFsKFxuICAgICAgYHJ1biAtLXJtICR7VVNFUl9BUkd9IC12IC9pbnB1dDovYXNzZXQtaW5wdXQ6ZGVsZWdhdGVkIC12IC9vdXRwdXQ6L2Fzc2V0LW91dHB1dDpkZWxlZ2F0ZWQgLXcgL2Fzc2V0LWlucHV0IGFscGluZSBET0NLRVJfU1RVQl9TVUNDRVNTXFxuYCArXG4gICAgICBgcnVuIC0tcm0gJHtVU0VSX0FSR30gLXYgL2lucHV0Oi9hc3NldC1pbnB1dDpkZWxlZ2F0ZWQgLXYgL291dHB1dDovYXNzZXQtb3V0cHV0OmRlbGVnYXRlZCAtLWVudiBVTklRVUVfRU5WX1ZBUj1TT01FVkFMVUUgLXcgL2Fzc2V0LWlucHV0IGFscGluZSBET0NLRVJfU1RVQl9TVUNDRVNTYCxcbiAgICApO1xuXG4gICAgZXhwZWN0KGZzLnJlYWRkaXJTeW5jKGFzc2VtYmx5LmRpcmVjdG9yeSkpLnRvRXF1YWwoW1xuICAgICAgJ2Fzc2V0LmIxZTMyZTg2YjM1MjNmMmZhNTEyZWI5OTE4MGVlMjk3NWE1MGE0NDM5ZTYzZThiYWRkMTUzZjJhNjhkNjFhYTQnLCAvLyAnQXNzZXQnXG4gICAgICAnYXNzZXQuZTgwYmI4ZjkzMWI4N2U4NDk3NWRlMTkzZjVhN2VjZGRkNzU1OGQzY2FmM2QzNWQzYTUzNmQ5YWU2NTM5MjM0ZicsIC8vICdBc3NldFdpdGhEaWZmZXJlbnRCdW5kbGluZ09wdGlvbnMnXG4gICAgICAnY2RrLm91dCcsXG4gICAgICAnbWFuaWZlc3QuanNvbicsXG4gICAgICAnc3RhY2sudGVtcGxhdGUuanNvbicsXG4gICAgICAndHJlZS5qc29uJyxcbiAgICBdKTtcbiAgfSk7XG5cbiAgdGVzdCgnYnVuZGxlciBvdXRwdXRzIHRvIGludGVybWVkaWF0ZSBkaXIgYW5kIHJlbmFtZXMgdG8gYXNzZXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHsgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdzdGFjaycpO1xuICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuICAgIGNvbnN0IGVuc3VyZURpclN5bmMgPSBzaW5vbi5zcHkoZnMsICdlbnN1cmVEaXJTeW5jJyk7XG4gICAgY29uc3QgY2htb2RTeW5jU3B5ID0gc2lub24uc3B5KGZzLCAnY2htb2RTeW5jJyk7XG4gICAgY29uc3QgcmVuYW1lU3luY1NweSA9IHNpbm9uLnNweShmcywgJ3JlbmFtZVN5bmMnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnQXNzZXQnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBhc3NldEhhc2hUeXBlOiBBc3NldEhhc2hUeXBlLk9VVFBVVCxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG5cbiAgICBleHBlY3QoZW5zdXJlRGlyU3luYy5jYWxsZWRXaXRoKHNpbm9uLm1hdGNoKHBhdGguam9pbihhc3NlbWJseS5kaXJlY3RvcnksICdidW5kbGluZy10ZW1wLScpKSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgZXhwZWN0KGNobW9kU3luY1NweS5jYWxsZWRXaXRoKHNpbm9uLm1hdGNoKHBhdGguam9pbihhc3NlbWJseS5kaXJlY3RvcnksICdidW5kbGluZy10ZW1wLScpKSwgMG83NzcpKS50b0VxdWFsKHRydWUpO1xuICAgIGV4cGVjdChyZW5hbWVTeW5jU3B5LmNhbGxlZFdpdGgoc2lub24ubWF0Y2gocGF0aC5qb2luKGFzc2VtYmx5LmRpcmVjdG9yeSwgJ2J1bmRsaW5nLXRlbXAtJykpLCBzaW5vbi5tYXRjaChwYXRoLmpvaW4oYXNzZW1ibHkuZGlyZWN0b3J5LCAnYXNzZXQuJykpKSkudG9FcXVhbCh0cnVlKTtcblxuICAgIGV4cGVjdChmcy5yZWFkZGlyU3luYyhhc3NlbWJseS5kaXJlY3RvcnkpKS50b0VxdWFsKFtcbiAgICAgICdhc3NldC4zM2NiZjJjYWU1NDMyNDM4ZTBmMDQ2YmM0NWJhOGMzY2VmN2I2YWZjZjQ3YjU5ZDFjMTgzNzc1YzE5MThmYjFmJywgLy8gJ0Fzc2V0J1xuICAgICAgJ2Nkay5vdXQnLFxuICAgICAgJ21hbmlmZXN0Lmpzb24nLFxuICAgICAgJ3N0YWNrLnRlbXBsYXRlLmpzb24nLFxuICAgICAgJ3RyZWUuanNvbicsXG4gICAgXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1bmRsaW5nIGZhaWx1cmUgcHJlc2VydmVzIHRoZSBidW5kbGVEaXIgZm9yIGRpYWdub3NhYmlsaXR5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJyk7XG4gICAgY29uc3QgZGlyZWN0b3J5ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzJywgJ2ZpeHR1cmVzJywgJ3Rlc3QxJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuRkFJTF0sXG4gICAgICB9LFxuICAgIH0pKS50b1Rocm93KC9GYWlsZWQuKmJ1bmRsLiphc3NldC4qLWVycm9yLyk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcblxuICAgIGNvbnN0IGRpciA9IGZzLnJlYWRkaXJTeW5jKGFzc2VtYmx5LmRpcmVjdG9yeSk7XG4gICAgZXhwZWN0KGRpci5zb21lKGVudHJ5ID0+IGVudHJ5Lm1hdGNoKC9hc3NldC4qLWVycm9yLykpKS50b0VxdWFsKHRydWUpO1xuICB9KTtcblxuICB0ZXN0KCdidW5kbGVyIHJlLXVzZXMgYXNzZXRzIGZyb20gcHJldmlvdXMgc3ludGhzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgVEVTVF9PVVRESVIgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnY2RrLm91dCcpO1xuICAgIGlmIChmcy5leGlzdHNTeW5jKFRFU1RfT1VURElSKSkge1xuICAgICAgZnMucmVtb3ZlU3luYyhURVNUX09VVERJUik7XG4gICAgfVxuXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IG91dGRpcjogVEVTVF9PVVRESVIsIGNvbnRleHQ6IHsgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlIH0gfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnQXNzZXQnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBpbWFnZTogRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKSxcbiAgICAgICAgY29tbWFuZDogW0RvY2tlclN0dWJDb21tYW5kLlNVQ0NFU1NdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIENsZWFyIGFzc2V0IGhhc2ggY2FjaGUgdG8gc2hvdyB0aGF0IGR1cmluZyB0aGUgc2Vjb25kIHN5bnRoIGJ1bmRsaW5nXG4gICAgLy8gd2lsbCBjb25zaWRlciB0aGUgZXhpc3RpbmcgYnVuZGxpbmcgZGlyIChmaWxlIHN5c3RlbSBjYWNoZSkuXG4gICAgQXNzZXRTdGFnaW5nLmNsZWFyQXNzZXRIYXNoQ2FjaGUoKTtcblxuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwMiA9IG5ldyBBcHAoeyBvdXRkaXI6IFRFU1RfT1VURElSLCBjb250ZXh0OiB7IFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSB9IH0pO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAyLCAnc3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrMiwgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5TVUNDRVNTXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXBwQXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBjb25zdCBhcHAyQXNzZW1ibHkgPSBhcHAyLnN5bnRoKCk7XG5cbiAgICBleHBlY3QoXG4gICAgICByZWFkRG9ja2VyU3R1YklucHV0Q29uY2F0KCkpLnRvRXF1YWwoXG4gICAgICBgcnVuIC0tcm0gJHtVU0VSX0FSR30gLXYgL2lucHV0Oi9hc3NldC1pbnB1dDpkZWxlZ2F0ZWQgLXYgL291dHB1dDovYXNzZXQtb3V0cHV0OmRlbGVnYXRlZCAtdyAvYXNzZXQtaW5wdXQgYWxwaW5lIERPQ0tFUl9TVFVCX1NVQ0NFU1NgLFxuICAgICk7XG5cbiAgICBleHBlY3QoYXBwQXNzZW1ibHkuZGlyZWN0b3J5KS50b0VxdWFsKGFwcDJBc3NlbWJseS5kaXJlY3RvcnkpO1xuICAgIGV4cGVjdChmcy5yZWFkZGlyU3luYyhhcHBBc3NlbWJseS5kaXJlY3RvcnkpKS50b0VxdWFsKFtcbiAgICAgICdhc3NldC5iMWUzMmU4NmIzNTIzZjJmYTUxMmViOTkxODBlZTI5NzVhNTBhNDQzOWU2M2U4YmFkZDE1M2YyYTY4ZDYxYWE0JyxcbiAgICAgICdjZGsub3V0JyxcbiAgICAgICdtYW5pZmVzdC5qc29uJyxcbiAgICAgICdzdGFjay50ZW1wbGF0ZS5qc29uJyxcbiAgICAgICd0cmVlLmpzb24nLFxuICAgIF0pO1xuICB9KTtcblxuICB0ZXN0KCdidW5kbGluZyB0aHJvd3Mgd2hlbiAvYXNzZXQtb3V0cHV0IGlzIGVtcHR5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJyk7XG4gICAgY29uc3QgZGlyZWN0b3J5ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzJywgJ2ZpeHR1cmVzJywgJ3Rlc3QxJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU19OT19PVVRQVVRdLFxuICAgICAgfSxcbiAgICB9KSkudG9UaHJvdygvQnVuZGxpbmcgZGlkIG5vdCBwcm9kdWNlIGFueSBvdXRwdXQvKTtcblxuICAgIGV4cGVjdChcbiAgICAgIHJlYWREb2NrZXJTdHViSW5wdXQoKSkudG9FcXVhbChcbiAgICAgIGBydW4gLS1ybSAke1VTRVJfQVJHfSAtdiAvaW5wdXQ6L2Fzc2V0LWlucHV0OmRlbGVnYXRlZCAtdiAvb3V0cHV0Oi9hc3NldC1vdXRwdXQ6ZGVsZWdhdGVkIC13IC9hc3NldC1pbnB1dCBhbHBpbmUgRE9DS0VSX1NUVUJfU1VDQ0VTU19OT19PVVRQVVRgLFxuICAgICk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdidW5kbGluZyB3aXRoIEJVTkRMRSBhc3NldCBoYXNoIHR5cGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhc3NldCA9IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU10sXG4gICAgICB9LFxuICAgICAgYXNzZXRIYXNoVHlwZTogQXNzZXRIYXNoVHlwZS5CVU5ETEUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KFxuICAgICAgcmVhZERvY2tlclN0dWJJbnB1dCgpKS50b0VxdWFsKFxuICAgICAgYHJ1biAtLXJtICR7VVNFUl9BUkd9IC12IC9pbnB1dDovYXNzZXQtaW5wdXQ6ZGVsZWdhdGVkIC12IC9vdXRwdXQ6L2Fzc2V0LW91dHB1dDpkZWxlZ2F0ZWQgLXcgL2Fzc2V0LWlucHV0IGFscGluZSBET0NLRVJfU1RVQl9TVUNDRVNTYCxcbiAgICApO1xuICAgIGV4cGVjdChhc3NldC5hc3NldEhhc2gpLnRvRXF1YWwoJzMzY2JmMmNhZTU0MzI0MzhlMGYwNDZiYzQ1YmE4YzNjZWY3YjZhZmNmNDdiNTlkMWMxODM3NzVjMTkxOGZiMWYnKTtcbiAgfSk7XG5cbiAgdGVzdCgnYnVuZGxpbmcgd2l0aCBkb2NrZXIgc2VjdXJpdHkgb3B0aW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJyk7XG4gICAgY29uc3QgZGlyZWN0b3J5ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzJywgJ2ZpeHR1cmVzJywgJ3Rlc3QxJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXNzZXQgPSBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnQXNzZXQnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBpbWFnZTogRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKSxcbiAgICAgICAgY29tbWFuZDogW0RvY2tlclN0dWJDb21tYW5kLlNVQ0NFU1NdLFxuICAgICAgICBzZWN1cml0eU9wdDogJ25vLW5ldy1wcml2aWxlZ2VzJyxcbiAgICAgIH0sXG4gICAgICBhc3NldEhhc2hUeXBlOiBBc3NldEhhc2hUeXBlLkJVTkRMRSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoXG4gICAgICByZWFkRG9ja2VyU3R1YklucHV0KCkpLnRvRXF1YWwoXG4gICAgICBgcnVuIC0tcm0gLS1zZWN1cml0eS1vcHQgbm8tbmV3LXByaXZpbGVnZXMgJHtVU0VSX0FSR30gLXYgL2lucHV0Oi9hc3NldC1pbnB1dDpkZWxlZ2F0ZWQgLXYgL291dHB1dDovYXNzZXQtb3V0cHV0OmRlbGVnYXRlZCAtdyAvYXNzZXQtaW5wdXQgYWxwaW5lIERPQ0tFUl9TVFVCX1NVQ0NFU1NgLFxuICAgICk7XG4gICAgZXhwZWN0KGFzc2V0LmFzc2V0SGFzaCkudG9FcXVhbCgnMzNjYmYyY2FlNTQzMjQzOGUwZjA0NmJjNDViYThjM2NlZjdiNmFmY2Y0N2I1OWQxYzE4Mzc3NWMxOTE4ZmIxZicpO1xuICB9KTtcblxuICB0ZXN0KCdidW5kbGluZyB3aXRoIGRvY2tlciBlbnRyeXBvaW50JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJyk7XG4gICAgY29uc3QgZGlyZWN0b3J5ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzJywgJ2ZpeHR1cmVzJywgJ3Rlc3QxJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXNzZXQgPSBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnQXNzZXQnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBpbWFnZTogRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKSxcbiAgICAgICAgZW50cnlwb2ludDogW0RvY2tlclN0dWJDb21tYW5kLlNVQ0NFU1NdLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU10sXG4gICAgICB9LFxuICAgICAgYXNzZXRIYXNoVHlwZTogQXNzZXRIYXNoVHlwZS5PVVRQVVQsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KFxuICAgICAgcmVhZERvY2tlclN0dWJJbnB1dCgpKS50b0VxdWFsKFxuICAgICAgYHJ1biAtLXJtICR7VVNFUl9BUkd9IC12IC9pbnB1dDovYXNzZXQtaW5wdXQ6ZGVsZWdhdGVkIC12IC9vdXRwdXQ6L2Fzc2V0LW91dHB1dDpkZWxlZ2F0ZWQgLXcgL2Fzc2V0LWlucHV0IC0tZW50cnlwb2ludCBET0NLRVJfU1RVQl9TVUNDRVNTIGFscGluZSBET0NLRVJfU1RVQl9TVUNDRVNTYCxcbiAgICApO1xuICAgIGV4cGVjdChhc3NldC5hc3NldEhhc2gpLnRvRXF1YWwoJzMzY2JmMmNhZTU0MzI0MzhlMGYwNDZiYzQ1YmE4YzNjZWY3YjZhZmNmNDdiNTlkMWMxODM3NzVjMTkxOGZiMWYnKTtcbiAgfSk7XG5cbiAgdGVzdCgnYnVuZGxpbmcgd2l0aCBPVVRQVVQgYXNzZXQgaGFzaCB0eXBlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJyk7XG4gICAgY29uc3QgZGlyZWN0b3J5ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzJywgJ2ZpeHR1cmVzJywgJ3Rlc3QxJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXNzZXQgPSBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnQXNzZXQnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBpbWFnZTogRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKSxcbiAgICAgICAgY29tbWFuZDogW0RvY2tlclN0dWJDb21tYW5kLlNVQ0NFU1NdLFxuICAgICAgfSxcbiAgICAgIGFzc2V0SGFzaFR5cGU6IEFzc2V0SGFzaFR5cGUuT1VUUFVULFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChhc3NldC5hc3NldEhhc2gpLnRvRXF1YWwoJzMzY2JmMmNhZTU0MzI0MzhlMGYwNDZiYzQ1YmE4YzNjZWY3YjZhZmNmNDdiNTlkMWMxODM3NzVjMTkxOGZiMWYnKTtcbiAgfSk7XG5cbiAgdGVzdCgnY3VzdG9tIGhhc2gnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhc3NldCA9IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGFzc2V0SGFzaDogJ215LWN1c3RvbS1oYXNoJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoZnMuZXhpc3RzU3luYyhTVFVCX0lOUFVUX0ZJTEUpKS50b0VxdWFsKGZhbHNlKTtcbiAgICBleHBlY3QoYXNzZXQuYXNzZXRIYXNoKS50b0VxdWFsKCdiOWM3NzA1M2Y1YjgzYmJlNWJhMzQzYmMxOGU5MmRiOTM5YTQ5MDE3MDEwODEzMjI1ZmVhOTFmYTg5MmM0ODIzJyk7IC8vIGhhc2ggb2YgJ215LWN1c3RvbS1oYXNoJ1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2l0aCBhc3NldEhhc2ggYW5kIG5vdCBDVVNUT00gaGFzaCB0eXBlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJyk7XG4gICAgY29uc3QgZGlyZWN0b3J5ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzJywgJ2ZpeHR1cmVzJywgJ3Rlc3QxJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU10sXG4gICAgICB9LFxuICAgICAgYXNzZXRIYXNoOiAnbXktY3VzdG9tLWhhc2gnLFxuICAgICAgYXNzZXRIYXNoVHlwZTogQXNzZXRIYXNoVHlwZS5PVVRQVVQsXG4gICAgfSkpLnRvVGhyb3coL0Nhbm5vdCBzcGVjaWZ5IGBvdXRwdXRgIGZvciBgYXNzZXRIYXNoVHlwZWAvKTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ3Rocm93cyB3aXRoIEJVTkRMRSBoYXNoIHR5cGUgYW5kIG5vIGJ1bmRsaW5nJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJyk7XG4gICAgY29uc3QgZGlyZWN0b3J5ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzJywgJ2ZpeHR1cmVzJywgJ3Rlc3QxJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGFzc2V0SGFzaFR5cGU6IEFzc2V0SGFzaFR5cGUuQlVORExFLFxuICAgIH0pKS50b1Rocm93KC9DYW5ub3QgdXNlIGBidW5kbGVgIGhhc2ggdHlwZSB3aGVuIGBidW5kbGluZ2AgaXMgbm90IHNwZWNpZmllZC8pO1xuICAgIGV4cGVjdChmcy5leGlzdHNTeW5jKFNUVUJfSU5QVVRfRklMRSkpLnRvRXF1YWwoZmFsc2UpO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2l0aCBPVVRQVVQgaGFzaCB0eXBlIGFuZCBubyBidW5kbGluZycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdzdGFjaycpO1xuICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnQXNzZXQnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBhc3NldEhhc2hUeXBlOiBBc3NldEhhc2hUeXBlLk9VVFBVVCxcbiAgICB9KSkudG9UaHJvdygvQ2Fubm90IHVzZSBgb3V0cHV0YCBoYXNoIHR5cGUgd2hlbiBgYnVuZGxpbmdgIGlzIG5vdCBzcGVjaWZpZWQvKTtcbiAgICBleHBlY3QoZnMuZXhpc3RzU3luYyhTVFVCX0lOUFVUX0ZJTEUpKS50b0VxdWFsKGZhbHNlKTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIHdpdGggQ1VTVE9NIGFuZCBubyBoYXNoJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJyk7XG4gICAgY29uc3QgZGlyZWN0b3J5ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzJywgJ2ZpeHR1cmVzJywgJ3Rlc3QxJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGFzc2V0SGFzaFR5cGU6IEFzc2V0SGFzaFR5cGUuQ1VTVE9NLFxuICAgIH0pKS50b1Rocm93KC9gYXNzZXRIYXNoYCBtdXN0IGJlIHNwZWNpZmllZCB3aGVuIGBhc3NldEhhc2hUeXBlYCBpcyBzZXQgdG8gYEFzc2V0SGFzaFR5cGUuQ1VTVE9NYC8pO1xuICAgIGV4cGVjdChmcy5leGlzdHNTeW5jKFNUVUJfSU5QVVRfRklMRSkpLnRvRXF1YWwoZmFsc2UpOyAvLyBcImRvY2tlclwiIG5vdCBleGVjdXRlZFxuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2hlbiBidW5kbGluZyBmYWlscycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdzdGFjaycpO1xuICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnQXNzZXQnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBpbWFnZTogRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCd0aGlzLWlzLWFuLWludmFsaWQtZG9ja2VyLWltYWdlJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5GQUlMXSxcbiAgICAgIH0sXG4gICAgfSkpLnRvVGhyb3coL0ZhaWxlZCB0byBidW5kbGUgYXNzZXQgc3RhY2tcXC9Bc3NldC8pO1xuICAgIGV4cGVjdChcbiAgICAgIHJlYWREb2NrZXJTdHViSW5wdXQoKSkudG9FcXVhbChcbiAgICAgIGBydW4gLS1ybSAke1VTRVJfQVJHfSAtdiAvaW5wdXQ6L2Fzc2V0LWlucHV0OmRlbGVnYXRlZCAtdiAvb3V0cHV0Oi9hc3NldC1vdXRwdXQ6ZGVsZWdhdGVkIC13IC9hc3NldC1pbnB1dCB0aGlzLWlzLWFuLWludmFsaWQtZG9ja2VyLWltYWdlIERPQ0tFUl9TVFVCX0ZBSUxgLFxuICAgICk7XG4gIH0pO1xuXG4gIHRlc3QoJ3dpdGggbG9jYWwgYnVuZGxpbmcnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBsZXQgZGlyOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgbGV0IG9wdHM6IEJ1bmRsaW5nT3B0aW9ucyB8IHVuZGVmaW5lZDtcbiAgICBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnQXNzZXQnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBpbWFnZTogRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKSxcbiAgICAgICAgY29tbWFuZDogW0RvY2tlclN0dWJDb21tYW5kLlNVQ0NFU1NdLFxuICAgICAgICBsb2NhbDoge1xuICAgICAgICAgIHRyeUJ1bmRsZShvdXRwdXREaXI6IHN0cmluZywgb3B0aW9uczogQnVuZGxpbmdPcHRpb25zKTogYm9vbGVhbiB7XG4gICAgICAgICAgICBkaXIgPSBvdXRwdXREaXI7XG4gICAgICAgICAgICBvcHRzID0gb3B0aW9ucztcbiAgICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dHB1dERpciwgJ2hlbGxvLnR4dCcpLCAnaGVsbG8nKTsgLy8gb3V0cHV0IGNhbm5vdCBiZSBlbXB0eVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGRpciAmJiAvYXNzZXQuWzAtOWEtZl17MTYsfS8udGVzdChkaXIpKS50b0VxdWFsKHRydWUpO1xuICAgIGV4cGVjdChvcHRzPy5jb21tYW5kPy5bMF0pLnRvRXF1YWwoRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTUyk7XG4gICAgZXhwZWN0KCgpID0+IHJlYWREb2NrZXJTdHViSW5wdXQoKSkudG9UaHJvdygpO1xuXG4gICAgaWYgKGRpcikge1xuICAgICAgZnMucmVtb3ZlU3luYyhwYXRoLmpvaW4oZGlyLCAnaGVsbG8udHh0JykpO1xuICAgIH1cbiAgfSk7XG5cbiAgdGVzdCgnd2l0aCBsb2NhbCBidW5kbGluZyByZXR1cm5pbmcgZmFsc2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnQXNzZXQnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBpbWFnZTogRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKSxcbiAgICAgICAgY29tbWFuZDogW0RvY2tlclN0dWJDb21tYW5kLlNVQ0NFU1NdLFxuICAgICAgICBsb2NhbDoge1xuICAgICAgICAgIHRyeUJ1bmRsZShfYnVuZGxlRGlyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVhZERvY2tlclN0dWJJbnB1dCgpKS50b0JlRGVmaW5lZCgpO1xuICB9KTtcblxuICB0ZXN0KCdidW5kbGluZyBjYW4gYmUgc2tpcHBlZCBieSBzZXR0aW5nIGNvbnRleHQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnTXlTdGFjaycpO1xuICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dChjeGFwaS5CVU5ETElOR19TVEFDS1MsIFsnT3RoZXJTdGFjayddKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhc3NldCA9IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGFzc2V0SGFzaFR5cGU6IEFzc2V0SGFzaFR5cGUuT1VUUFVULFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5TVUNDRVNTXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QoKCkgPT4gcmVhZERvY2tlclN0dWJJbnB1dCgpKS50b1Rocm93KCk7IC8vIEJ1bmRsaW5nIGRpZCBub3QgcnVuXG4gICAgZXhwZWN0KGFzc2V0LnNvdXJjZVBhdGgpLnRvRXF1YWwoZGlyZWN0b3J5KTtcbiAgICBleHBlY3QoYXNzZXQuc3RhZ2VkUGF0aCkudG9FcXVhbChkaXJlY3RvcnkpO1xuICAgIGV4cGVjdChhc3NldC5yZWxhdGl2ZVN0YWdlZFBhdGgoc3RhY2spKS50b0VxdWFsKGRpcmVjdG9yeSk7XG4gICAgZXhwZWN0KGFzc2V0LmFzc2V0SGFzaCkudG9FcXVhbCgnZjY2ZDc0MjFhYTJkMDQ0YTZjMWY2MGRkZmM3NmRjNzg1NzFmY2Q4YmQyMjhlYjQ4ZWIzOTRlMmRiYWQ5NGE1YycpO1xuICB9KTtcblxuICB0ZXN0KCdjb3JyZWN0bHkgc2tpcHMgYnVuZGxpbmcgd2l0aCBzdGFjayB1bmRlciBzdGFnZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuICAgIGNvbnN0IHN0YWdlID0gbmV3IFN0YWdlKGFwcCwgJ1N0YWdlJyk7XG4gICAgc3RhZ2Uubm9kZS5zZXRDb250ZXh0KGN4YXBpLkJVTkRMSU5HX1NUQUNLUywgWydTdGFnZS9TdGFjazEnXSk7XG5cbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soc3RhZ2UsICdTdGFjazEnKTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soc3RhZ2UsICdTdGFjazInKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIG5ldyBBc3NldFN0YWdpbmcoc3RhY2sxLCAnQXNzZXQnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBhc3NldEhhc2hUeXBlOiBBc3NldEhhc2hUeXBlLk9VVFBVVCxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbmV3IEFzc2V0U3RhZ2luZyhzdGFjazIsICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGFzc2V0SGFzaFR5cGU6IEFzc2V0SGFzaFR5cGUuT1VUUFVULFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5NVUxUSVBMRV9GSUxFU10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgZG9ja2VyU3R1YklucHV0ID0gcmVhZERvY2tlclN0dWJJbnB1dENvbmNhdCgpO1xuICAgIC8vIERvY2tlciByYW4gZm9yIHRoZSBhc3NldCBpbiBTdGFjazFcbiAgICBleHBlY3QoZG9ja2VyU3R1YklucHV0KS50b01hdGNoKERvY2tlclN0dWJDb21tYW5kLlNVQ0NFU1MpO1xuICAgIC8vIERPY2tlciBkaWQgbm90IHJ1biBmb3IgdGhlIGFzc2V0IGluIFN0YWNrMlxuICAgIGV4cGVjdChkb2NrZXJTdHViSW5wdXQpLm5vdC50b01hdGNoKERvY2tlclN0dWJDb21tYW5kLk1VTFRJUExFX0ZJTEVTKTtcbiAgfSk7XG5cbiAgdGVzdCgnY29ycmVjdGx5IHNraXBzIGJ1bmRsaW5nIHdpdGggc3RhY2sgdW5kZXIgc3RhZ2UgYW5kIGN1c3RvbSBzdGFjayBuYW1lJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG4gICAgY29uc3Qgc3RhZ2UgPSBuZXcgU3RhZ2UoYXBwLCAnU3RhZ2UnKTtcbiAgICBzdGFnZS5ub2RlLnNldENvbnRleHQoY3hhcGkuQlVORExJTkdfU1RBQ0tTLCBbJ1N0YWdlL1N0YWNrMSddKTtcblxuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhzdGFnZSwgJ1N0YWNrMScsIHsgc3RhY2tOYW1lOiAndW5yZWxhdGVkLXN0YWNrMS1uYW1lJyB9KTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soc3RhZ2UsICdTdGFjazInLCB7IHN0YWNrTmFtZTogJ3VucmVsYXRlZC1zdGFjazItbmFtZScgfSk7XG4gICAgY29uc3QgZGlyZWN0b3J5ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzJywgJ2ZpeHR1cmVzJywgJ3Rlc3QxJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IEFzc2V0U3RhZ2luZyhzdGFjazEsICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGFzc2V0SGFzaFR5cGU6IEFzc2V0SGFzaFR5cGUuT1VUUFVULFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5TVUNDRVNTXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrMiwgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYXNzZXRIYXNoVHlwZTogQXNzZXRIYXNoVHlwZS5PVVRQVVQsXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBpbWFnZTogRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKSxcbiAgICAgICAgY29tbWFuZDogW0RvY2tlclN0dWJDb21tYW5kLk1VTFRJUExFX0ZJTEVTXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgZG9ja2VyU3R1YklucHV0ID0gcmVhZERvY2tlclN0dWJJbnB1dENvbmNhdCgpO1xuICAgIC8vIERvY2tlciByYW4gZm9yIHRoZSBhc3NldCBpbiBTdGFjazFcbiAgICBleHBlY3QoZG9ja2VyU3R1YklucHV0KS50b01hdGNoKERvY2tlclN0dWJDb21tYW5kLlNVQ0NFU1MpO1xuICAgIC8vIERvY2tlciBkaWQgbm90IHJ1biBmb3IgdGhlIGFzc2V0IGluIFN0YWNrMlxuICAgIGV4cGVjdChkb2NrZXJTdHViSW5wdXQpLm5vdC50b01hdGNoKERvY2tlclN0dWJDb21tYW5kLk1VTFRJUExFX0ZJTEVTKTtcbiAgfSk7XG5cbiAgdGVzdCgnY29ycmVjdGx5IGJ1bmRsZXMgd2l0aCBzdGFjayB1bmRlciBzdGFnZSBhbmQgdGhlIGRlZmF1bHQgc3RhY2sgcGF0dGVybicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuICAgIGNvbnN0IHN0YWdlID0gbmV3IFN0YWdlKGFwcCwgJ1N0YWdlJyk7XG5cbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soc3RhZ2UsICdTdGFjazEnKTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soc3RhZ2UsICdTdGFjazInKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrMSwgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYXNzZXRIYXNoVHlwZTogQXNzZXRIYXNoVHlwZS5PVVRQVVQsXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBpbWFnZTogRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKSxcbiAgICAgICAgY29tbWFuZDogW0RvY2tlclN0dWJDb21tYW5kLlNVQ0NFU1NdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIG5ldyBBc3NldFN0YWdpbmcoc3RhY2syLCAnQXNzZXQnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBhc3NldEhhc2hUeXBlOiBBc3NldEhhc2hUeXBlLk9VVFBVVCxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuTVVMVElQTEVfRklMRVNdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBkb2NrZXJTdHViSW5wdXQgPSByZWFkRG9ja2VyU3R1YklucHV0Q29uY2F0KCk7XG4gICAgLy8gRG9ja2VyIHJhbiBmb3IgdGhlIGFzc2V0IGluIFN0YWNrMVxuICAgIGV4cGVjdChkb2NrZXJTdHViSW5wdXQpLnRvTWF0Y2goRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTUyk7XG4gICAgLy8gRG9ja2VyIHJhbiBmb3IgdGhlIGFzc2V0IGluIFN0YWNrMlxuICAgIGV4cGVjdChkb2NrZXJTdHViSW5wdXQpLnRvTWF0Y2goRG9ja2VyU3R1YkNvbW1hbmQuTVVMVElQTEVfRklMRVMpO1xuICB9KTtcblxuICB0ZXN0KCdjb3JyZWN0bHkgYnVuZGxlcyB3aXRoIHN0YWNrIHVuZGVyIHN0YWdlIGFuZCBwYXJ0aWFsIGdsb2JzdGFyIHdpbGRjYXJkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG4gICAgY29uc3Qgc3RhZ2UgPSBuZXcgU3RhZ2UoYXBwLCAnU3RhZ2UnKTtcbiAgICBzdGFnZS5ub2RlLnNldENvbnRleHQoY3hhcGkuQlVORExJTkdfU1RBQ0tTLCBbJyoqL1N0YWNrMSddKTsgLy8gYSBzaW5nbGUgd2lsZGNhcmQgcHJlZml4ICgnKlN0YWNrMScpIHdvbid0IG1hdGNoXG5cbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soc3RhZ2UsICdTdGFjazEnKTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soc3RhZ2UsICdTdGFjazInKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrMSwgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYXNzZXRIYXNoVHlwZTogQXNzZXRIYXNoVHlwZS5PVVRQVVQsXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBpbWFnZTogRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKSxcbiAgICAgICAgY29tbWFuZDogW0RvY2tlclN0dWJDb21tYW5kLlNVQ0NFU1NdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIG5ldyBBc3NldFN0YWdpbmcoc3RhY2syLCAnQXNzZXQnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBhc3NldEhhc2hUeXBlOiBBc3NldEhhc2hUeXBlLk9VVFBVVCxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuTVVMVElQTEVfRklMRVNdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBkb2NrZXJTdHViSW5wdXQgPSByZWFkRG9ja2VyU3R1YklucHV0Q29uY2F0KCk7XG4gICAgLy8gRG9ja2VyIHJhbiBmb3IgdGhlIGFzc2V0IGluIFN0YWNrMVxuICAgIGV4cGVjdChkb2NrZXJTdHViSW5wdXQpLnRvTWF0Y2goRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTUyk7XG4gICAgLy8gRG9ja2VyIGRpZCBub3QgcnVuIGZvciB0aGUgYXNzZXQgaW4gU3RhY2syXG4gICAgZXhwZWN0KGRvY2tlclN0dWJJbnB1dCkubm90LnRvTWF0Y2goRG9ja2VyU3R1YkNvbW1hbmQuTVVMVElQTEVfRklMRVMpO1xuICB9KTtcblxuICB0ZXN0KCdjb3JyZWN0bHkgYnVuZGxlcyBzZWxlY3RlZCBzdGFja3MgbmVzdGVkIGluIFN0YWNrL1N0YWdlL1N0YWNrJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG4gICAgY29uc3QgdG9wU3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnVG9wU3RhY2snKTtcbiAgICB0b3BTdGFjay5ub2RlLnNldENvbnRleHQoY3hhcGkuQlVORExJTkdfU1RBQ0tTLCBbJ1RvcFN0YWNrL01pZGRsZVN0YWdlL0JvdHRvbVN0YWNrJ10pO1xuXG4gICAgY29uc3QgbWlkZGxlU3RhZ2UgPSBuZXcgU3RhZ2UodG9wU3RhY2ssICdNaWRkbGVTdGFnZScpO1xuICAgIGNvbnN0IGJvdHRvbVN0YWNrID0gbmV3IFN0YWNrKG1pZGRsZVN0YWdlLCAnQm90dG9tU3RhY2snKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQXNzZXRTdGFnaW5nKGJvdHRvbVN0YWNrLCAnQXNzZXQnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBhc3NldEhhc2hUeXBlOiBBc3NldEhhc2hUeXBlLk9VVFBVVCxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU10sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIG5ldyBBc3NldFN0YWdpbmcodG9wU3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGFzc2V0SGFzaFR5cGU6IEFzc2V0SGFzaFR5cGUuT1VUUFVULFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5NVUxUSVBMRV9GSUxFU10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgZG9ja2VyU3R1YklucHV0ID0gcmVhZERvY2tlclN0dWJJbnB1dENvbmNhdCgpO1xuICAgIC8vIERvY2tlciByYW4gZm9yIHRoZSBhc3NldCBpbiBCb3R0b21TdGFja1xuICAgIGV4cGVjdChkb2NrZXJTdHViSW5wdXQpLnRvTWF0Y2goRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTUyk7XG4gICAgLy8gRG9ja2VyIGRpZCBub3QgcnVuIGZvciB0aGUgYXNzZXQgaW4gVG9wU3RhY2tcbiAgICBleHBlY3QoZG9ja2VyU3R1YklucHV0KS5ub3QudG9NYXRjaChEb2NrZXJTdHViQ29tbWFuZC5NVUxUSVBMRV9GSUxFUyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1bmRsaW5nIHN0aWxsIG9jY3VycyB3aXRoIHBhcnRpYWwgd2lsZGNhcmQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnTXlTdGFjaycpO1xuICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dChjeGFwaS5CVU5ETElOR19TVEFDS1MsIFsnKlN0YWNrJ10pO1xuICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFzc2V0ID0gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYXNzZXRIYXNoVHlwZTogQXNzZXRIYXNoVHlwZS5PVVRQVVQsXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBpbWFnZTogRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKSxcbiAgICAgICAgY29tbWFuZDogW0RvY2tlclN0dWJDb21tYW5kLlNVQ0NFU1NdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGV4cGVjdChcbiAgICAgIHJlYWREb2NrZXJTdHViSW5wdXQoKSkudG9FcXVhbChcbiAgICAgIGBydW4gLS1ybSAke1VTRVJfQVJHfSAtdiAvaW5wdXQ6L2Fzc2V0LWlucHV0OmRlbGVnYXRlZCAtdiAvb3V0cHV0Oi9hc3NldC1vdXRwdXQ6ZGVsZWdhdGVkIC13IC9hc3NldC1pbnB1dCBhbHBpbmUgRE9DS0VSX1NUVUJfU1VDQ0VTU2AsXG4gICAgKTtcbiAgICBleHBlY3QoYXNzZXQuYXNzZXRIYXNoKS50b0VxdWFsKCczM2NiZjJjYWU1NDMyNDM4ZTBmMDQ2YmM0NWJhOGMzY2VmN2I2YWZjZjQ3YjU5ZDFjMTgzNzc1YzE5MThmYjFmJyk7IC8vIGhhc2ggb2YgTXlTdGFjay9Bc3NldFxuICB9KTtcblxuICB0ZXN0KCdidW5kbGluZyBzdGlsbCBvY2N1cnMgd2l0aCBhIHNpbmdsZSB3aWxkY2FyZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdNeVN0YWNrJyk7XG4gICAgc3RhY2subm9kZS5zZXRDb250ZXh0KGN4YXBpLkJVTkRMSU5HX1NUQUNLUywgWycqJ10pO1xuICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFzc2V0ID0gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYXNzZXRIYXNoVHlwZTogQXNzZXRIYXNoVHlwZS5PVVRQVVQsXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBpbWFnZTogRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKSxcbiAgICAgICAgY29tbWFuZDogW0RvY2tlclN0dWJDb21tYW5kLlNVQ0NFU1NdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGV4cGVjdChcbiAgICAgIHJlYWREb2NrZXJTdHViSW5wdXQoKSkudG9FcXVhbChcbiAgICAgIGBydW4gLS1ybSAke1VTRVJfQVJHfSAtdiAvaW5wdXQ6L2Fzc2V0LWlucHV0OmRlbGVnYXRlZCAtdiAvb3V0cHV0Oi9hc3NldC1vdXRwdXQ6ZGVsZWdhdGVkIC13IC9hc3NldC1pbnB1dCBhbHBpbmUgRE9DS0VSX1NUVUJfU1VDQ0VTU2AsXG4gICAgKTtcbiAgICBleHBlY3QoYXNzZXQuYXNzZXRIYXNoKS50b0VxdWFsKCczM2NiZjJjYWU1NDMyNDM4ZTBmMDQ2YmM0NWJhOGMzY2VmN2I2YWZjZjQ3YjU5ZDFjMTgzNzc1YzE5MThmYjFmJyk7IC8vIGhhc2ggb2YgTXlTdGFjay9Bc3NldFxuICB9KTtcblxuICB0ZXN0KCdidW5kbGluZyB0aGF0IHByb2R1Y2VzIGEgc2luZ2xlIGFyY2hpdmUgZmlsZSBpcyBhdXRvZGlzY292ZXJlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoeyBjb250ZXh0OiB7IFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSB9IH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJyk7XG4gICAgY29uc3QgZGlyZWN0b3J5ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzJywgJ2ZpeHR1cmVzJywgJ3Rlc3QxJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc3RhZ2luZyA9IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU0lOR0xFX0FSQ0hJVkVdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgIGV4cGVjdChmcy5yZWFkZGlyU3luYyhhc3NlbWJseS5kaXJlY3RvcnkpKS50b0VxdWFsKFtcbiAgICAgICdhc3NldC5mNDMxNDhjNjExNzRmNDQ0OTI1MjMxYjU4NDliNDY4ZjIxZTkzYjVkMTQ2OWNkMDdjNTM2MjVmZmQwMzllZjQ4JywgLy8gdGhpcyBpcyB0aGUgYnVuZGxlIGRpclxuICAgICAgJ2Fzc2V0LmY0MzE0OGM2MTE3NGY0NDQ5MjUyMzFiNTg0OWI0NjhmMjFlOTNiNWQxNDY5Y2QwN2M1MzYyNWZmZDAzOWVmNDguemlwJyxcbiAgICAgICdjZGsub3V0JyxcbiAgICAgICdtYW5pZmVzdC5qc29uJyxcbiAgICAgICdzdGFjay50ZW1wbGF0ZS5qc29uJyxcbiAgICAgICd0cmVlLmpzb24nLFxuICAgIF0pO1xuICAgIGV4cGVjdChmcy5yZWFkZGlyU3luYyhwYXRoLmpvaW4oYXNzZW1ibHkuZGlyZWN0b3J5LCAnYXNzZXQuZjQzMTQ4YzYxMTc0ZjQ0NDkyNTIzMWI1ODQ5YjQ2OGYyMWU5M2I1ZDE0NjljZDA3YzUzNjI1ZmZkMDM5ZWY0OCcpKSkudG9FcXVhbChbXG4gICAgICAndGVzdC56aXAnLCAvLyBidW5kbGUgZGlyIHdpdGggXCJ0b3VjaGVkXCIgYnVuZGxlZCBvdXRwdXQgZmlsZVxuICAgIF0pO1xuICAgIGV4cGVjdChzdGFnaW5nLnBhY2thZ2luZykudG9FcXVhbChGaWxlQXNzZXRQYWNrYWdpbmcuRklMRSk7XG4gICAgZXhwZWN0KHN0YWdpbmcuaXNBcmNoaXZlKS50b0VxdWFsKHRydWUpO1xuICB9KTtcblxuICB0ZXN0KCdidW5kbGluZyB0aGF0IHByb2R1Y2VzIGEgc2luZ2xlIGFyY2hpdmUgZmlsZSB3aXRoIGRpc2sgY2FjaGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBURVNUX09VVERJUiA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdjZGsub3V0Jyk7XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoVEVTVF9PVVRESVIpKSB7XG4gICAgICBmcy5yZW1vdmVTeW5jKFRFU1RfT1VURElSKTtcbiAgICB9XG5cbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIGNvbnN0IGFwcDEgPSBuZXcgQXBwKHsgb3V0ZGlyOiBURVNUX09VVERJUiB9KTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2soYXBwMSwgJ1N0YWNrJyk7XG5cbiAgICBjb25zdCBhcHAyID0gbmV3IEFwcCh7IG91dGRpcjogVEVTVF9PVVRESVIgfSk7IC8vIHNhbWUgT1VURElSXG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcDIsICdzdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHN0YWdpbmcxID0gbmV3IEFzc2V0U3RhZ2luZyhzdGFjazEsICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU0lOR0xFX0FSQ0hJVkVdLFxuICAgICAgICBvdXRwdXRUeXBlOiBCdW5kbGluZ091dHB1dC5BUkNISVZFRCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBOb3cgY2xlYXIgYXNzZXQgaGFzaCBjYWNoZSB0byBzaG93IHRoYXQgZHVyaW5nIHRoZSBzZWNvbmQgc3RhZ2luZ1xuICAgIC8vIGV2ZW4gdGhvdWdoIGJ1bmRsaW5nIGlzIHNraXBwZWQgaXQgd2lsbCBjb3JyZWN0bHkgYmUgY29uc2lkZXJlZFxuICAgIC8vIGFzIGEgRmlsZUFzc2V0UGFja2FnaW5nLkZJTEUuXG4gICAgQXNzZXRTdGFnaW5nLmNsZWFyQXNzZXRIYXNoQ2FjaGUoKTtcblxuICAgIGNvbnN0IHN0YWdpbmcyID0gbmV3IEFzc2V0U3RhZ2luZyhzdGFjazIsICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU0lOR0xFX0FSQ0hJVkVdLFxuICAgICAgICBvdXRwdXRUeXBlOiBCdW5kbGluZ091dHB1dC5BUkNISVZFRCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWdpbmcxLnBhY2thZ2luZykudG9FcXVhbChGaWxlQXNzZXRQYWNrYWdpbmcuRklMRSk7XG4gICAgZXhwZWN0KHN0YWdpbmcxLmlzQXJjaGl2ZSkudG9FcXVhbCh0cnVlKTtcbiAgICBleHBlY3Qoc3RhZ2luZzIucGFja2FnaW5nKS50b0VxdWFsKHN0YWdpbmcxLnBhY2thZ2luZyk7XG4gICAgZXhwZWN0KHN0YWdpbmcyLmlzQXJjaGl2ZSkudG9FcXVhbChzdGFnaW5nMS5pc0FyY2hpdmUpO1xuICB9KTtcblxuICB0ZXN0KCdidW5kbGluZyB0aGF0IHByb2R1Y2VzIGEgc2luZ2xlIGFyY2hpdmUgZmlsZSB3aXRoIE5PVF9BUkNISVZFRCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoeyBjb250ZXh0OiB7IFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSB9IH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJyk7XG4gICAgY29uc3QgZGlyZWN0b3J5ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzJywgJ2ZpeHR1cmVzJywgJ3Rlc3QxJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc3RhZ2luZyA9IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU0lOR0xFX0FSQ0hJVkVdLFxuICAgICAgICBvdXRwdXRUeXBlOiBCdW5kbGluZ091dHB1dC5OT1RfQVJDSElWRUQsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgZXhwZWN0KGZzLnJlYWRkaXJTeW5jKGFzc2VtYmx5LmRpcmVjdG9yeSkpLnRvRXF1YWwoW1xuICAgICAgJ2Fzc2V0Ljg2ZWMwNzc0NmUxZDg1OTI5MGNmZDhiOWM2NDhlNTgxNTU1NjQ5Yzc1ZjUxZjc0MWYxMWUyMmNhYjY3NzVhYmMnLFxuICAgICAgJ2Nkay5vdXQnLFxuICAgICAgJ21hbmlmZXN0Lmpzb24nLFxuICAgICAgJ3N0YWNrLnRlbXBsYXRlLmpzb24nLFxuICAgICAgJ3RyZWUuanNvbicsXG4gICAgXSk7XG4gICAgZXhwZWN0KHN0YWdpbmcucGFja2FnaW5nKS50b0VxdWFsKEZpbGVBc3NldFBhY2thZ2luZy5aSVBfRElSRUNUT1JZKTtcbiAgICBleHBlY3Qoc3RhZ2luZy5pc0FyY2hpdmUpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aXRoIEFSQ0hJVkVEIGFuZCBidW5kbGluZyB0aGF0IGRvZXMgbm90IHByb2R1Y2UgYSBzaW5nbGUgYXJjaGl2ZSBmaWxlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJyk7XG4gICAgY29uc3QgZGlyZWN0b3J5ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzJywgJ2ZpeHR1cmVzJywgJ3Rlc3QxJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuTVVMVElQTEVfRklMRVNdLFxuICAgICAgICBvdXRwdXRUeXBlOiBCdW5kbGluZ091dHB1dC5BUkNISVZFRCxcbiAgICAgIH0sXG4gICAgfSkpLnRvVGhyb3coL0J1bmRsaW5nIG91dHB1dCBkaXJlY3RvcnkgaXMgZXhwZWN0ZWQgdG8gaW5jbHVkZSBvbmx5IGEgc2luZ2xlIGFyY2hpdmUgZmlsZSB3aGVuIGBvdXRwdXRgIGlzIHNldCB0byBgQVJDSElWRURgLyk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdzdGFnaW5nIHdpdGggZG9ja2VyIGNwJywgKCkgPT4ge1xuICBiZWZvcmVBbGwoKCkgPT4ge1xuICAgIC8vIHRoaXMgaXMgYSB3YXkgdG8gcHJvdmlkZSBhIGN1c3RvbSBcImRvY2tlclwiIGNvbW1hbmQgZm9yIHN0YWdpbmcuXG4gICAgcHJvY2Vzcy5lbnYuQ0RLX0RPQ0tFUiA9IGAke19fZGlybmFtZX0vZG9ja2VyLXN0dWItY3Auc2hgO1xuICB9KTtcblxuICBhZnRlckFsbCgoKSA9PiB7XG4gICAgZGVsZXRlIHByb2Nlc3MuZW52LkNES19ET0NLRVI7XG4gIH0pO1xuXG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgQXNzZXRTdGFnaW5nLmNsZWFyQXNzZXRIYXNoQ2FjaGUoKTtcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhTVFVCX0lOUFVUX0NQX0ZJTEUpKSB7XG4gICAgICBmcy51bmxpbmtTeW5jKFNUVUJfSU5QVVRfQ1BfRklMRSk7XG4gICAgfVxuICAgIGlmIChmcy5leGlzdHNTeW5jKFNUVUJfSU5QVVRfQ1BfQ09OQ0FUX0ZJTEUpKSB7XG4gICAgICBmcy51bmxpbmtTeW5jKFNUVUJfSU5QVVRfQ1BfQ09OQ0FUX0ZJTEUpO1xuICAgIH1cbiAgICBzaW5vbi5yZXN0b3JlKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1bmRsaW5nIHdpdGggZG9ja2VyIGltYWdlIGNvcHkgdmFyaWFudCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoeyBjb250ZXh0OiB7IFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSB9IH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJyk7XG4gICAgY29uc3QgZGlyZWN0b3J5ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzJywgJ2ZpeHR1cmVzJywgJ3Rlc3QxJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc3RhZ2luZyA9IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuVk9MVU1FX1NJTkdMRV9BUkNISVZFXSxcbiAgICAgICAgYnVuZGxpbmdGaWxlQWNjZXNzOiBCdW5kbGluZ0ZpbGVBY2Nlc3MuVk9MVU1FX0NPUFksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgZXhwZWN0KGZzLnJlYWRkaXJTeW5jKGFzc2VtYmx5LmRpcmVjdG9yeSkpLnRvRXF1YWwoW1xuICAgICAgJ2Fzc2V0LjBlYzM3MWEyMDIyZDI5ZGZkODNmNWRmMTA0ZTBmMDFiMzQyMzNhNGUzZTgzOWMzYzRlYzYyMDA4ZjBiOWEwZTgnLCAvLyB0aGlzIGlzIHRoZSBidW5kbGUgZGlyXG4gICAgICAnYXNzZXQuMGVjMzcxYTIwMjJkMjlkZmQ4M2Y1ZGYxMDRlMGYwMWIzNDIzM2E0ZTNlODM5YzNjNGVjNjIwMDhmMGI5YTBlOC56aXAnLFxuICAgICAgJ2Nkay5vdXQnLFxuICAgICAgJ21hbmlmZXN0Lmpzb24nLFxuICAgICAgJ3N0YWNrLnRlbXBsYXRlLmpzb24nLFxuICAgICAgJ3RyZWUuanNvbicsXG4gICAgXSk7XG4gICAgZXhwZWN0KGZzLnJlYWRkaXJTeW5jKHBhdGguam9pbihhc3NlbWJseS5kaXJlY3RvcnksICdhc3NldC4wZWMzNzFhMjAyMmQyOWRmZDgzZjVkZjEwNGUwZjAxYjM0MjMzYTRlM2U4MzljM2M0ZWM2MjAwOGYwYjlhMGU4JykpKS50b0VxdWFsKFtcbiAgICAgICd0ZXN0LnppcCcsIC8vIGJ1bmRsZSBkaXIgd2l0aCBcInRvdWNoZWRcIiBidW5kbGVkIG91dHB1dCBmaWxlXG4gICAgXSk7XG4gICAgZXhwZWN0KHN0YWdpbmcucGFja2FnaW5nKS50b0VxdWFsKEZpbGVBc3NldFBhY2thZ2luZy5GSUxFKTtcbiAgICBleHBlY3Qoc3RhZ2luZy5pc0FyY2hpdmUpLnRvRXF1YWwodHJ1ZSk7XG4gICAgY29uc3QgZG9ja2VyQ2FsbHM6IHN0cmluZ1tdID0gcmVhZERvY2tlclN0dWJJbnB1dENvbmNhdChTVFVCX0lOUFVUX0NQX0NPTkNBVF9GSUxFKS5zcGxpdCgvXFxyP1xcbi8pO1xuICAgIGV4cGVjdChkb2NrZXJDYWxscykudG9FcXVhbChleHBlY3QuYXJyYXlDb250YWluaW5nKFtcbiAgICAgIGV4cGVjdC5zdHJpbmdDb250YWluaW5nKCd2b2x1bWUgY3JlYXRlIGFzc2V0SW5wdXQnKSxcbiAgICAgIGV4cGVjdC5zdHJpbmdDb250YWluaW5nKCd2b2x1bWUgY3JlYXRlIGFzc2V0T3V0cHV0JyksXG4gICAgICBleHBlY3Quc3RyaW5nTWF0Y2hpbmcoJ3J1biAtLW5hbWUgY29weUNvbnRhaW5lci4qIC12IC9pbnB1dDovYXNzZXQtaW5wdXQgLXYgL291dHB1dDovYXNzZXQtb3V0cHV0IGFscGluZSBzaCAtYyBta2RpciAtcCAvYXNzZXQtaW5wdXQgJiYgY2hvd24gLVIgLiogL2Fzc2V0LW91dHB1dCAmJiBjaG93biAtUiAuKiAvYXNzZXQtaW5wdXQnKSxcbiAgICAgIGV4cGVjdC5zdHJpbmdNYXRjaGluZygnY3AgLipmcy9maXh0dXJlcy90ZXN0MS9cXC4gY29weUNvbnRhaW5lci4qOi9hc3NldC1pbnB1dCcpLFxuICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKCdydW4gLS1ybSAtdSAuKiAtLXZvbHVtZXMtZnJvbSBjb3B5Q29udGFpbmVyLiogLXcgL2Fzc2V0LWlucHV0IGFscGluZSBET0NLRVJfU1RVQl9WT0xVTUVfU0lOR0xFX0FSQ0hJVkUnKSxcbiAgICAgIGV4cGVjdC5zdHJpbmdNYXRjaGluZygnY3AgY29weUNvbnRhaW5lci4qOi9hc3NldC1vdXRwdXQvXFwuIC4qJyksXG4gICAgICBleHBlY3Quc3RyaW5nQ29udGFpbmluZygncm0gY29weUNvbnRhaW5lcicpLFxuICAgICAgZXhwZWN0LnN0cmluZ0NvbnRhaW5pbmcoJ3ZvbHVtZSBybSBhc3NldElucHV0JyksXG4gICAgICBleHBlY3Quc3RyaW5nQ29udGFpbmluZygndm9sdW1lIHJtIGFzc2V0T3V0cHV0JyksXG4gICAgXSkpO1xuICB9KTtcbn0pO1xuXG4vLyBSZWFkcyBhIGRvY2tlciBzdHViIGFuZCBjbGVhbnMgdGhlIHZvbHVtZSBwYXRocyBvdXQgb2YgdGhlIHN0dWIuXG5mdW5jdGlvbiByZWFkQW5kQ2xlYW5Eb2NrZXJTdHViSW5wdXQoZmlsZTogc3RyaW5nKSB7XG4gIHJldHVybiBmc1xuICAgIC5yZWFkRmlsZVN5bmMoZmlsZSwgJ3V0Zi04JylcbiAgICAudHJpbSgpXG4gICAgLnJlcGxhY2UoLy12IChbXjpdKyk6XFwvYXNzZXQtaW5wdXQvZywgJy12IC9pbnB1dDovYXNzZXQtaW5wdXQnKVxuICAgIC5yZXBsYWNlKC8tdiAoW146XSspOlxcL2Fzc2V0LW91dHB1dC9nLCAnLXYgL291dHB1dDovYXNzZXQtb3V0cHV0Jyk7XG59XG5cbi8vIExhc3QgZG9ja2VyIGlucHV0IHNpbmNlIGxhc3QgdGVhcmRvd25cbmZ1bmN0aW9uIHJlYWREb2NrZXJTdHViSW5wdXQoZmlsZT86IHN0cmluZykge1xuICByZXR1cm4gcmVhZEFuZENsZWFuRG9ja2VyU3R1YklucHV0KGZpbGUgPz8gU1RVQl9JTlBVVF9GSUxFKTtcbn1cbi8vIENvbmNhdGVuYXRlZCBkb2NrZXIgaW5wdXRzIHNpbmNlIGxhc3QgdGVhcmRvd25cbmZ1bmN0aW9uIHJlYWREb2NrZXJTdHViSW5wdXRDb25jYXQoZmlsZT86IHN0cmluZykge1xuICByZXR1cm4gcmVhZEFuZENsZWFuRG9ja2VyU3R1YklucHV0KGZpbGUgPz8gU1RVQl9JTlBVVF9DT05DQVRfRklMRSk7XG59XG4iXX0=