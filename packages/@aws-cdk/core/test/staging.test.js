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
    cdk_build_tools_1.testDeprecated('bundling with BUNDLE asset hash type', () => {
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
    cdk_build_tools_1.testDeprecated('throws with BUNDLE hash type and no bundling', () => {
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
            'test.zip',
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
            'test.zip',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhZ2luZy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RhZ2luZy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3Qiw4REFBMEQ7QUFDMUQsMEVBQW9FO0FBQ3BFLHlDQUF5QztBQUN6QywrQkFBK0I7QUFDL0IsK0JBQStCO0FBQy9CLGdDQUFzSjtBQUV0SixNQUFNLGVBQWUsR0FBRyx3QkFBd0IsQ0FBQztBQUNqRCxNQUFNLHNCQUFzQixHQUFHLCtCQUErQixDQUFDO0FBRS9ELE1BQU0sa0JBQWtCLEdBQUcsMkJBQTJCLENBQUM7QUFDdkQsTUFBTSx5QkFBeUIsR0FBRyxrQ0FBa0MsQ0FBQztBQUVyRSxJQUFLLGlCQU9KO0FBUEQsV0FBSyxpQkFBaUI7SUFDcEIsb0RBQStCLENBQUE7SUFDL0IsOENBQXlCLENBQUE7SUFDekIsd0VBQW1ELENBQUE7SUFDbkQsa0VBQTZDLENBQUE7SUFDN0Msa0VBQTZDLENBQUE7SUFDN0MsZ0ZBQTJELENBQUE7QUFDN0QsQ0FBQyxFQVBJLGlCQUFpQixLQUFqQixpQkFBaUIsUUFPckI7QUFFRCxNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDMUUsTUFBTSxrQkFBa0IsR0FBRyxrRUFBa0UsQ0FBQztBQUM5RixNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUN0RSxNQUFNLHlCQUF5QixHQUFHLGtFQUFrRSxDQUFDO0FBQ3JHLE1BQU0seUJBQXlCLEdBQUcsa0VBQWtFLENBQUM7QUFFckcsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQy9CLE1BQU0sUUFBUSxHQUFHLE1BQU0sUUFBUSxDQUFDLEdBQUcsSUFBSSxRQUFR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O0FBRUQsd0NBQXdDO0FBQ3hDLFNBQVMsbUJBQW1CLENBQUMsSUFBYTtJQUN4QyxPQUFPLDJCQUEyQixDQUFDLElBQUksSUFBSSxlQUFlLENBQUMsQ0FBQztBQUM5RCxDQUFDO0FBQ0QsaURBQWlEO0FBQ2pELFNBQVMseUJBQXlCLENBQUMsSUFBYTtJQUM5QyxPQUFPLDJCQUEyQixDQUFDLElBQUksSUFBSSxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3JFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBvcyBmcm9tICdvcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgdGVzdERlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0IHsgRmlsZUFzc2V0UGFja2FnaW5nIH0gZnJvbSAnQGF3cy1jZGsvY2xvdWQtYXNzZW1ibHktc2NoZW1hJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgKiBhcyBzaW5vbiBmcm9tICdzaW5vbic7XG5pbXBvcnQgeyBBcHAsIEFzc2V0SGFzaFR5cGUsIEFzc2V0U3RhZ2luZywgRG9ja2VySW1hZ2UsIEJ1bmRsaW5nT3B0aW9ucywgQnVuZGxpbmdPdXRwdXQsIEZpbGVTeXN0ZW0sIFN0YWNrLCBTdGFnZSwgQnVuZGxpbmdGaWxlQWNjZXNzIH0gZnJvbSAnLi4vbGliJztcblxuY29uc3QgU1RVQl9JTlBVVF9GSUxFID0gJy90bXAvZG9ja2VyLXN0dWIuaW5wdXQnO1xuY29uc3QgU1RVQl9JTlBVVF9DT05DQVRfRklMRSA9ICcvdG1wL2RvY2tlci1zdHViLmlucHV0LmNvbmNhdCc7XG5cbmNvbnN0IFNUVUJfSU5QVVRfQ1BfRklMRSA9ICcvdG1wL2RvY2tlci1zdHViLWNwLmlucHV0JztcbmNvbnN0IFNUVUJfSU5QVVRfQ1BfQ09OQ0FUX0ZJTEUgPSAnL3RtcC9kb2NrZXItc3R1Yi1jcC5pbnB1dC5jb25jYXQnO1xuXG5lbnVtIERvY2tlclN0dWJDb21tYW5kIHtcbiAgU1VDQ0VTUyA9ICdET0NLRVJfU1RVQl9TVUNDRVNTJyxcbiAgRkFJTCA9ICdET0NLRVJfU1RVQl9GQUlMJyxcbiAgU1VDQ0VTU19OT19PVVRQVVQgPSAnRE9DS0VSX1NUVUJfU1VDQ0VTU19OT19PVVRQVVQnLFxuICBNVUxUSVBMRV9GSUxFUyA9ICdET0NLRVJfU1RVQl9NVUxUSVBMRV9GSUxFUycsXG4gIFNJTkdMRV9BUkNISVZFID0gJ0RPQ0tFUl9TVFVCX1NJTkdMRV9BUkNISVZFJyxcbiAgVk9MVU1FX1NJTkdMRV9BUkNISVZFID0gJ0RPQ0tFUl9TVFVCX1ZPTFVNRV9TSU5HTEVfQVJDSElWRScsXG59XG5cbmNvbnN0IEZJWFRVUkVfVEVTVDFfRElSID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzJywgJ2ZpeHR1cmVzJywgJ3Rlc3QxJyk7XG5jb25zdCBGSVhUVVJFX1RFU1QxX0hBU0ggPSAnMmYzN2Y5MzdjNTFlMmMxOTFhZjY2YWNmOWIwOWY1NDg5MjYwMDhlYzY4YzU3NWJkMmVlNTRiNmU5OTdjMGUwMCc7XG5jb25zdCBGSVhUVVJFX1RBUkJBTEwgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMudGFyLmd6Jyk7XG5jb25zdCBOT1RfQVJDSElWRURfWklQX1RYVF9IQVNIID0gJzk1YzkyNGM4NGY1ZDAyM2JlNGVkZWU1NDBjYjJjYjQwMWE0OWYxMTVkMDFlZDQwM2IyODhmNmNiNDEyNzcxZGYnO1xuY29uc3QgQVJDSElWRV9UQVJCQUxMX1RFU1RfSEFTSCA9ICczZTk0OGZmNTRhMjc3ZDYwMDFlMjQ1MmZkYmM0YTllZjYxZjkxNmZmNjYyYmE1ZTA1ZWNlMWUyZWM2ZGVjOWY1JztcblxuY29uc3QgdXNlckluZm8gPSBvcy51c2VySW5mbygpO1xuY29uc3QgVVNFUl9BUkcgPSBgLXUgJHt1c2VySW5mby51aWR9OiR7dXNlckluZm8uZ2lkfWA7XG5cblxuZGVzY3JpYmUoJ3N0YWdpbmcnLCAoKSA9PiB7XG4gIGJlZm9yZUFsbCgoKSA9PiB7XG4gICAgLy8gdGhpcyBpcyBhIHdheSB0byBwcm92aWRlIGEgY3VzdG9tIFwiZG9ja2VyXCIgY29tbWFuZCBmb3Igc3RhZ2luZy5cbiAgICBwcm9jZXNzLmVudi5DREtfRE9DS0VSID0gYCR7X19kaXJuYW1lfS9kb2NrZXItc3R1Yi5zaGA7XG4gIH0pO1xuXG4gIGFmdGVyQWxsKCgpID0+IHtcbiAgICBkZWxldGUgcHJvY2Vzcy5lbnYuQ0RLX0RPQ0tFUjtcbiAgfSk7XG5cbiAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICBBc3NldFN0YWdpbmcuY2xlYXJBc3NldEhhc2hDYWNoZSgpO1xuICAgIGlmIChmcy5leGlzdHNTeW5jKFNUVUJfSU5QVVRfRklMRSkpIHtcbiAgICAgIGZzLnVubGlua1N5bmMoU1RVQl9JTlBVVF9GSUxFKTtcbiAgICB9XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoU1RVQl9JTlBVVF9DT05DQVRfRklMRSkpIHtcbiAgICAgIGZzLnVubGlua1N5bmMoU1RVQl9JTlBVVF9DT05DQVRfRklMRSk7XG4gICAgfVxuICAgIHNpbm9uLnJlc3RvcmUoKTtcbiAgfSk7XG5cbiAgdGVzdCgnYmFzZSBjYXNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBzb3VyY2VQYXRoID0gRklYVFVSRV9URVNUMV9ESVI7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc3RhZ2luZyA9IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdzMScsIHsgc291cmNlUGF0aCB9KTtcblxuICAgIGV4cGVjdChzdGFnaW5nLmFzc2V0SGFzaCkudG9FcXVhbChGSVhUVVJFX1RFU1QxX0hBU0gpO1xuICAgIGV4cGVjdChzdGFnaW5nLnNvdXJjZVBhdGgpLnRvRXF1YWwoc291cmNlUGF0aCk7XG4gICAgZXhwZWN0KHBhdGguYmFzZW5hbWUoc3RhZ2luZy5hYnNvbHV0ZVN0YWdlZFBhdGgpKS50b0VxdWFsKGBhc3NldC4ke0ZJWFRVUkVfVEVTVDFfSEFTSH1gKTtcbiAgICBleHBlY3QocGF0aC5iYXNlbmFtZShzdGFnaW5nLnJlbGF0aXZlU3RhZ2VkUGF0aChzdGFjaykpKS50b0VxdWFsKGBhc3NldC4ke0ZJWFRVUkVfVEVTVDFfSEFTSH1gKTtcbiAgICBleHBlY3Qoc3RhZ2luZy5wYWNrYWdpbmcpLnRvRXF1YWwoRmlsZUFzc2V0UGFja2FnaW5nLlpJUF9ESVJFQ1RPUlkpO1xuICAgIGV4cGVjdChzdGFnaW5nLmlzQXJjaGl2ZSkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdCgnYmFzZSBjYXNlIGlmIHNvdXJjZSBkaXJlY3RvcnkgaXMgYSBzeW1saW5rJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBzb3VyY2VQYXRoID0gcGF0aC5qb2luKG9zLnRtcGRpcigpLCAnYXNzZXQtc3ltbGluaycpO1xuICAgIGlmIChmcy5leGlzdHNTeW5jKHNvdXJjZVBhdGgpKSB7IGZzLnVubGlua1N5bmMoc291cmNlUGF0aCk7IH1cbiAgICBmcy5zeW1saW5rU3luYyhGSVhUVVJFX1RFU1QxX0RJUiwgc291cmNlUGF0aCk7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3Qgc3RhZ2luZyA9IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdzMScsIHsgc291cmNlUGF0aCB9KTtcblxuICAgICAgLy8gU2hvdWxkIGJlIHRoZSBzYW1lIGFzc2V0IGhhc2ggYXMgaW4gdGhlIHByZXZpb3VzIHRlc3RcbiAgICAgIGV4cGVjdChzdGFnaW5nLmFzc2V0SGFzaCkudG9FcXVhbChGSVhUVVJFX1RFU1QxX0hBU0gpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBpZiAoZnMuZXhpc3RzU3luYyhzb3VyY2VQYXRoKSkge1xuICAgICAgICBmcy51bmxpbmtTeW5jKHNvdXJjZVBhdGgpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgdGVzdCgnc3RhZ2luZyBvZiBhbiBhcmNoaXZlIGZpbGUgY29ycmVjdGx5IHNldHMgcGFja2FnaW5nIGFuZCBpc0FyY2hpdmUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHNvdXJjZVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnYXJjaGl2ZScsICdhcmNoaXZlLnppcCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHN0YWdpbmcgPSBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnczEnLCB7IHNvdXJjZVBhdGggfSk7XG5cbiAgICBleHBlY3Qoc3RhZ2luZy5wYWNrYWdpbmcpLnRvRXF1YWwoRmlsZUFzc2V0UGFja2FnaW5nLkZJTEUpO1xuICAgIGV4cGVjdChzdGFnaW5nLmlzQXJjaGl2ZSkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdCgnc3RhZ2luZyBvZiBhbiBhcmNoaXZlIHdpdGggbXVsdGlwbGUgZXh0ZW5zaW9uIG5hbWUgY29ycmVjdGx5IHNldHMgcGFja2FnaW5nIGFuZCBpc0FyY2hpdmUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHNvdXJjZVBhdGhUYXJHejEgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnYXJjaGl2ZScsICdhcnRpZmFjdC50YXIuZ3onKTtcbiAgICBjb25zdCBzb3VyY2VQYXRoVGFyR3oyID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2FyY2hpdmUnLCAnYXJ0aWZhY3QuZGEudmluY2kubW9uYWxpc2EudGFyLmd6Jyk7XG4gICAgY29uc3Qgc291cmNlUGF0aFRneiA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdhcmNoaXZlJywgJ2FydGlmYWN0LnRneicpO1xuICAgIGNvbnN0IHNvdXJjZVBhdGhUYXIgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnYXJjaGl2ZScsICdhcnRpZmFjdC50YXInKTtcbiAgICBjb25zdCBzb3VyY2VQYXRoTm90QXJjaGl2ZSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdhcmNoaXZlJywgJ2FydGlmYWN0LnppcC50eHQnKTtcbiAgICBjb25zdCBzb3VyY2VQYXRoRG9ja2VyRmlsZSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdhcmNoaXZlJywgJ0RvY2tlckZpbGUnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzdGFnaW5nVGFyR3oxID0gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ3MxJywgeyBzb3VyY2VQYXRoOiBzb3VyY2VQYXRoVGFyR3oxIH0pO1xuICAgIGNvbnN0IHN0YWdpbmdUYXJHejIgPSBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnczInLCB7IHNvdXJjZVBhdGg6IHNvdXJjZVBhdGhUYXJHejIgfSk7XG4gICAgY29uc3Qgc3RhZ2luZ1RneiA9IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdzMycsIHsgc291cmNlUGF0aDogc291cmNlUGF0aFRneiB9KTtcbiAgICBjb25zdCBzdGFnaW5nVGFyID0gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ3M0JywgeyBzb3VyY2VQYXRoOiBzb3VyY2VQYXRoVGFyIH0pO1xuICAgIGNvbnN0IHN0YWdpbmdOb3RBcmNoaXZlID0gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ3M1JywgeyBzb3VyY2VQYXRoOiBzb3VyY2VQYXRoTm90QXJjaGl2ZSB9KTtcbiAgICBjb25zdCBzdGFnaW5nRG9ja2VyRmlsZSA9IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdzNicsIHsgc291cmNlUGF0aDogc291cmNlUGF0aERvY2tlckZpbGUgfSk7XG5cbiAgICBleHBlY3Qoc3RhZ2luZ1Rhckd6MS5wYWNrYWdpbmcpLnRvRXF1YWwoRmlsZUFzc2V0UGFja2FnaW5nLkZJTEUpO1xuICAgIGV4cGVjdChzdGFnaW5nVGFyR3oxLmlzQXJjaGl2ZSkudG9FcXVhbCh0cnVlKTtcbiAgICBleHBlY3Qoc3RhZ2luZ1Rhckd6Mi5wYWNrYWdpbmcpLnRvRXF1YWwoRmlsZUFzc2V0UGFja2FnaW5nLkZJTEUpO1xuICAgIGV4cGVjdChwYXRoLmJhc2VuYW1lKHN0YWdpbmdUYXJHejIuYWJzb2x1dGVTdGFnZWRQYXRoKSkudG9FcXVhbChgYXNzZXQuJHtBUkNISVZFX1RBUkJBTExfVEVTVF9IQVNIfS50YXIuZ3pgKTtcbiAgICBleHBlY3QocGF0aC5iYXNlbmFtZShzdGFnaW5nVGFyR3oyLnJlbGF0aXZlU3RhZ2VkUGF0aChzdGFjaykpKS50b0VxdWFsKGBhc3NldC4ke0FSQ0hJVkVfVEFSQkFMTF9URVNUX0hBU0h9LnRhci5nemApO1xuICAgIGV4cGVjdChzdGFnaW5nVGFyR3oyLmlzQXJjaGl2ZSkudG9FcXVhbCh0cnVlKTtcbiAgICBleHBlY3Qoc3RhZ2luZ1Rnei5wYWNrYWdpbmcpLnRvRXF1YWwoRmlsZUFzc2V0UGFja2FnaW5nLkZJTEUpO1xuICAgIGV4cGVjdChzdGFnaW5nVGd6LmlzQXJjaGl2ZSkudG9FcXVhbCh0cnVlKTtcbiAgICBleHBlY3Qoc3RhZ2luZ1Rhci5wYWNrYWdpbmcpLnRvRXF1YWwoRmlsZUFzc2V0UGFja2FnaW5nLkZJTEUpO1xuICAgIGV4cGVjdChzdGFnaW5nVGFyLmlzQXJjaGl2ZSkudG9FcXVhbCh0cnVlKTtcbiAgICBleHBlY3Qoc3RhZ2luZ05vdEFyY2hpdmUucGFja2FnaW5nKS50b0VxdWFsKEZpbGVBc3NldFBhY2thZ2luZy5GSUxFKTtcbiAgICBleHBlY3QocGF0aC5iYXNlbmFtZShzdGFnaW5nTm90QXJjaGl2ZS5hYnNvbHV0ZVN0YWdlZFBhdGgpKS50b0VxdWFsKGBhc3NldC4ke05PVF9BUkNISVZFRF9aSVBfVFhUX0hBU0h9LnR4dGApO1xuICAgIGV4cGVjdChwYXRoLmJhc2VuYW1lKHN0YWdpbmdOb3RBcmNoaXZlLnJlbGF0aXZlU3RhZ2VkUGF0aChzdGFjaykpKS50b0VxdWFsKGBhc3NldC4ke05PVF9BUkNISVZFRF9aSVBfVFhUX0hBU0h9LnR4dGApO1xuICAgIGV4cGVjdChzdGFnaW5nTm90QXJjaGl2ZS5pc0FyY2hpdmUpLnRvRXF1YWwoZmFsc2UpO1xuICAgIGV4cGVjdChzdGFnaW5nRG9ja2VyRmlsZS5wYWNrYWdpbmcpLnRvRXF1YWwoRmlsZUFzc2V0UGFja2FnaW5nLkZJTEUpO1xuICAgIGV4cGVjdChzdGFnaW5nRG9ja2VyRmlsZS5pc0FyY2hpdmUpLnRvRXF1YWwoZmFsc2UpO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ2Fzc2V0IHBhY2thZ2luZyB0eXBlIGlzIGNvcnJlY3Qgd2hlbiBzdGFnaW5nIGlzIHNraXBwZWQgYmVjYXVzZSBvZiBtZW1vcnkgY2FjaGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHNvdXJjZVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnYXJjaGl2ZScsICdhcmNoaXZlLnppcCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHN0YWdpbmcxID0gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ3MxJywgeyBzb3VyY2VQYXRoIH0pO1xuICAgIGNvbnN0IHN0YWdpbmcyID0gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ3MyJywgeyBzb3VyY2VQYXRoIH0pO1xuXG4gICAgZXhwZWN0KHN0YWdpbmcxLnBhY2thZ2luZykudG9FcXVhbChGaWxlQXNzZXRQYWNrYWdpbmcuRklMRSk7XG4gICAgZXhwZWN0KHN0YWdpbmcxLmlzQXJjaGl2ZSkudG9FcXVhbCh0cnVlKTtcbiAgICBleHBlY3Qoc3RhZ2luZzIucGFja2FnaW5nKS50b0VxdWFsKHN0YWdpbmcxLnBhY2thZ2luZyk7XG4gICAgZXhwZWN0KHN0YWdpbmcyLmlzQXJjaGl2ZSkudG9FcXVhbChzdGFnaW5nMS5pc0FyY2hpdmUpO1xuICB9KTtcblxuICB0ZXN0KCdhc3NldCBwYWNrYWdpbmcgdHlwZSBpcyBjb3JyZWN0IHdoZW4gc3RhZ2luZyBpcyBza2lwcGVkIGJlY2F1c2Ugb2YgZGlzayBjYWNoZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IFRFU1RfT1VURElSID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2Nkay5vdXQnKTtcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhURVNUX09VVERJUikpIHtcbiAgICAgIGZzLnJlbW92ZVN5bmMoVEVTVF9PVVRESVIpO1xuICAgIH1cblxuICAgIGNvbnN0IHNvdXJjZVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnYXJjaGl2ZScsICdhcmNoaXZlLnppcCcpO1xuXG4gICAgY29uc3QgYXBwMSA9IG5ldyBBcHAoeyBvdXRkaXI6IFRFU1RfT1VURElSIH0pO1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAxLCAnU3RhY2snKTtcblxuICAgIGNvbnN0IGFwcDIgPSBuZXcgQXBwKHsgb3V0ZGlyOiBURVNUX09VVERJUiB9KTsgLy8gc2FtZSBPVVRESVJcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwMiwgJ3N0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc3RhZ2luZzEgPSBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrMSwgJ0Fzc2V0JywgeyBzb3VyY2VQYXRoIH0pO1xuXG4gICAgLy8gTm93IGNsZWFyIGFzc2V0IGhhc2ggY2FjaGUgdG8gc2hvdyB0aGF0IGR1cmluZyB0aGUgc2Vjb25kIHN0YWdpbmdcbiAgICAvLyBldmVuIHRob3VnaCB0aGUgYXNzZXQgaXMgYWxyZWFkeSBhdmFpbGFibGUgb24gZGlzayBpdCB3aWxsIGNvcnJlY3RseVxuICAgIC8vIGJlIGNvbnNpZGVyZWQgYXMgYSBGaWxlQXNzZXRQYWNrYWdpbmcuRklMRS5cbiAgICBBc3NldFN0YWdpbmcuY2xlYXJBc3NldEhhc2hDYWNoZSgpO1xuXG4gICAgY29uc3Qgc3RhZ2luZzIgPSBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrMiwgJ0Fzc2V0JywgeyBzb3VyY2VQYXRoIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFnaW5nMS5wYWNrYWdpbmcpLnRvRXF1YWwoRmlsZUFzc2V0UGFja2FnaW5nLkZJTEUpO1xuICAgIGV4cGVjdChzdGFnaW5nMS5pc0FyY2hpdmUpLnRvRXF1YWwodHJ1ZSk7XG4gICAgZXhwZWN0KHN0YWdpbmcyLnBhY2thZ2luZykudG9FcXVhbChzdGFnaW5nMS5wYWNrYWdpbmcpO1xuICAgIGV4cGVjdChzdGFnaW5nMi5pc0FyY2hpdmUpLnRvRXF1YWwoc3RhZ2luZzEuaXNBcmNoaXZlKTtcbiAgfSk7XG5cbiAgdGVzdCgnc3RhZ2luZyBvZiBhIG5vbi1hcmNoaXZlIGZpbGUgY29ycmVjdGx5IHNldHMgcGFja2FnaW5nIGFuZCBpc0FyY2hpdmUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHNvdXJjZVBhdGggPSBfX2ZpbGVuYW1lO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHN0YWdpbmcgPSBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnczEnLCB7IHNvdXJjZVBhdGggfSk7XG5cbiAgICBleHBlY3Qoc3RhZ2luZy5wYWNrYWdpbmcpLnRvRXF1YWwoRmlsZUFzc2V0UGFja2FnaW5nLkZJTEUpO1xuICAgIGV4cGVjdChzdGFnaW5nLmlzQXJjaGl2ZSkudG9FcXVhbChmYWxzZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N0YWdpbmcgY2FuIGJlIGRpc2FibGVkIHRocm91Z2ggY29udGV4dCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgc3RhY2subm9kZS5zZXRDb250ZXh0KGN4YXBpLkRJU0FCTEVfQVNTRVRfU1RBR0lOR19DT05URVhULCB0cnVlKTtcbiAgICBjb25zdCBzb3VyY2VQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzJywgJ2ZpeHR1cmVzJywgJ3Rlc3QxJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc3RhZ2luZyA9IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdzMScsIHsgc291cmNlUGF0aCB9KTtcblxuICAgIGV4cGVjdChzdGFnaW5nLmFzc2V0SGFzaCkudG9FcXVhbChGSVhUVVJFX1RFU1QxX0hBU0gpO1xuICAgIGV4cGVjdChzdGFnaW5nLnNvdXJjZVBhdGgpLnRvRXF1YWwoc291cmNlUGF0aCk7XG4gICAgZXhwZWN0KHN0YWdpbmcuYWJzb2x1dGVTdGFnZWRQYXRoKS50b0VxdWFsKHNvdXJjZVBhdGgpO1xuICAgIGV4cGVjdChzdGFnaW5nLnJlbGF0aXZlU3RhZ2VkUGF0aChzdGFjaykpLnRvRXF1YWwoc291cmNlUGF0aCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZpbGVzIGFyZSBjb3BpZWQgdG8gdGhlIG91dHB1dCBkaXJlY3RvcnkgZHVyaW5nIHN5bnRoJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IGNvbnRleHQ6IHsgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlIH0gfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnczEnLCB7IHNvdXJjZVBhdGg6IEZJWFRVUkVfVEVTVDFfRElSIH0pO1xuICAgIG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdmaWxlJywgeyBzb3VyY2VQYXRoOiBGSVhUVVJFX1RBUkJBTEwgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBleHBlY3QoZnMucmVhZGRpclN5bmMoYXNzZW1ibHkuZGlyZWN0b3J5KSkudG9FcXVhbChbXG4gICAgICBgYXNzZXQuJHtGSVhUVVJFX1RFU1QxX0hBU0h9YCxcbiAgICAgICdhc3NldC5hZjEwYWMwNGIzYjYwN2IwZjg2NTljOGYwY2VlOGMzNDMwMjVlZTc1YmFmMGIxNDZmMTBmMGU1MzExZDJjNDZiLnRhci5neicsXG4gICAgICAnY2RrLm91dCcsXG4gICAgICAnbWFuaWZlc3QuanNvbicsXG4gICAgICAnc3RhY2sudGVtcGxhdGUuanNvbicsXG4gICAgICAndHJlZS5qc29uJyxcbiAgICBdKTtcbiAgfSk7XG5cbiAgdGVzdCgnYXNzZXRzIGluIG5lc3RlZCBhc3NlbWJsaWVzIGdldCBzdGFnZWQgaW50byBhc3NlbWJseSByb290IGRpcmVjdG9yeScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjazEgPSBuZXcgU3RhY2sobmV3IFN0YWdlKGFwcCwgJ1N0YWdlMScpLCAnU3RhY2snKTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2sobmV3IFN0YWdlKGFwcCwgJ1N0YWdlMicpLCAnU3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrMSwgJ3MxJywgeyBzb3VyY2VQYXRoOiBGSVhUVVJFX1RFU1QxX0RJUiB9KTtcbiAgICBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrMiwgJ3MxJywgeyBzb3VyY2VQYXRoOiBGSVhUVVJFX1RFU1QxX0RJUiB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuXG4gICAgLy8gT25lIGFzc2V0IGRpcmVjdG9yeSBhdCB0aGUgdG9wXG4gICAgZXhwZWN0KGZzLnJlYWRkaXJTeW5jKGFzc2VtYmx5LmRpcmVjdG9yeSkpLnRvRXF1YWwoW1xuICAgICAgJ2Fzc2VtYmx5LVN0YWdlMScsXG4gICAgICAnYXNzZW1ibHktU3RhZ2UyJyxcbiAgICAgIGBhc3NldC4ke0ZJWFRVUkVfVEVTVDFfSEFTSH1gLFxuICAgICAgJ2Nkay5vdXQnLFxuICAgICAgJ21hbmlmZXN0Lmpzb24nLFxuICAgICAgJ3RyZWUuanNvbicsXG4gICAgXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FsbG93IHNwZWNpZnlpbmcgZXh0cmEgZGF0YSB0byBpbmNsdWRlIGluIHRoZSBzb3VyY2UgaGFzaCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdzdGFjaycpO1xuICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHdpdGhvdXRFeHRyYSA9IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICd3aXRob3V0RXh0cmEnLCB7IHNvdXJjZVBhdGg6IGRpcmVjdG9yeSB9KTtcbiAgICBjb25zdCB3aXRoRXh0cmEgPSBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnd2l0aEV4dHJhJywgeyBzb3VyY2VQYXRoOiBkaXJlY3RvcnksIGV4dHJhSGFzaDogJ2Jvb20nIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCh3aXRob3V0RXh0cmEuYXNzZXRIYXNoKS5ub3QudG9FcXVhbCh3aXRoRXh0cmEuYXNzZXRIYXNoKTtcbiAgICBleHBlY3Qod2l0aG91dEV4dHJhLmFzc2V0SGFzaCkudG9FcXVhbChGSVhUVVJFX1RFU1QxX0hBU0gpO1xuICAgIGV4cGVjdCh3aXRoRXh0cmEuYXNzZXRIYXNoKS50b0VxdWFsKCdjOTVjOTE1YTU3MjJiYjkwMTllMmM3MjVkMTE4NjhlNWE2MTliNTVmMzYxNzJmNzZiY2JjYWE4YmIyZDEwYzVmJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBzcGVjaWZ5IGV4dHJhIGFzc2V0IHNhbHQgdmlhIGNvbnRleHQga2V5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgZGlyZWN0b3J5ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzJywgJ2ZpeHR1cmVzJywgJ3Rlc3QxJyk7XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcblxuICAgIGNvbnN0IHNhbHRlZEFwcCA9IG5ldyBBcHAoeyBjb250ZXh0OiB7ICdAYXdzLWNkay9jb3JlOmFzc2V0SGFzaFNhbHQnOiAnbWFnaWMnIH0gfSk7XG4gICAgY29uc3Qgc2FsdGVkU3RhY2sgPSBuZXcgU3RhY2soc2FsdGVkQXBwLCAnc3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhc3NldCA9IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdYJywgeyBzb3VyY2VQYXRoOiBkaXJlY3RvcnkgfSk7XG4gICAgY29uc3Qgc2FsdGVkQXNzZXQgPSBuZXcgQXNzZXRTdGFnaW5nKHNhbHRlZFN0YWNrLCAnWCcsIHsgc291cmNlUGF0aDogZGlyZWN0b3J5IH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChhc3NldC5hc3NldEhhc2gpLm5vdC50b0VxdWFsKHNhbHRlZEFzc2V0LmFzc2V0SGFzaCk7XG4gIH0pO1xuXG4gIHRlc3QoJ3dpdGggYnVuZGxpbmcnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHsgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdzdGFjaycpO1xuICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuICAgIGNvbnN0IHByb2Nlc3NTdGRFcnJXcml0ZVNweSA9IHNpbm9uLnNweShwcm9jZXNzLnN0ZGVyciwgJ3dyaXRlJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5TVUNDRVNTXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBleHBlY3QoXG4gICAgICByZWFkRG9ja2VyU3R1YklucHV0KCkpLnRvRXF1YWwoXG4gICAgICBgcnVuIC0tcm0gJHtVU0VSX0FSR30gLXYgL2lucHV0Oi9hc3NldC1pbnB1dDpkZWxlZ2F0ZWQgLXYgL291dHB1dDovYXNzZXQtb3V0cHV0OmRlbGVnYXRlZCAtdyAvYXNzZXQtaW5wdXQgYWxwaW5lIERPQ0tFUl9TVFVCX1NVQ0NFU1NgLFxuICAgICk7XG4gICAgZXhwZWN0KGZzLnJlYWRkaXJTeW5jKGFzc2VtYmx5LmRpcmVjdG9yeSkpLnRvRXF1YWwoW1xuICAgICAgJ2Fzc2V0LmIxZTMyZTg2YjM1MjNmMmZhNTEyZWI5OTE4MGVlMjk3NWE1MGE0NDM5ZTYzZThiYWRkMTUzZjJhNjhkNjFhYTQnLFxuICAgICAgJ2Nkay5vdXQnLFxuICAgICAgJ21hbmlmZXN0Lmpzb24nLFxuICAgICAgJ3N0YWNrLnRlbXBsYXRlLmpzb24nLFxuICAgICAgJ3RyZWUuanNvbicsXG4gICAgXSk7XG5cbiAgICAvLyBzaG93cyBhIG1lc3NhZ2UgYmVmb3JlIGJ1bmRsaW5nXG4gICAgZXhwZWN0KHByb2Nlc3NTdGRFcnJXcml0ZVNweS5jYWxsZWRXaXRoKCdCdW5kbGluZyBhc3NldCBzdGFjay9Bc3NldC4uLlxcbicpKS50b0VxdWFsKHRydWUpO1xuICB9KTtcblxuICB0ZXN0KCdidW5kbGVkIHJlc291cmNlcyBoYXZlIGFic29sdXRlIHBhdGggd2hlbiBzdGFnaW5nIGlzIGRpc2FibGVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IGNvbnRleHQ6IHsgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlIH0gfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcbiAgICBzdGFjay5ub2RlLnNldENvbnRleHQoY3hhcGkuRElTQUJMRV9BU1NFVF9TVEFHSU5HX0NPTlRFWFQsIHRydWUpO1xuICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFzc2V0ID0gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5TVUNDRVNTXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcblxuICAgIGV4cGVjdChmcy5yZWFkZGlyU3luYyhhc3NlbWJseS5kaXJlY3RvcnkpKS50b0VxdWFsKFtcbiAgICAgICdhc3NldC5iMWUzMmU4NmIzNTIzZjJmYTUxMmViOTkxODBlZTI5NzVhNTBhNDQzOWU2M2U4YmFkZDE1M2YyYTY4ZDYxYWE0JyxcbiAgICAgICdjZGsub3V0JyxcbiAgICAgICdtYW5pZmVzdC5qc29uJyxcbiAgICAgICdzdGFjay50ZW1wbGF0ZS5qc29uJyxcbiAgICAgICd0cmVlLmpzb24nLFxuICAgIF0pO1xuXG4gICAgZXhwZWN0KGFzc2V0LmFzc2V0SGFzaCkudG9FcXVhbCgnYjFlMzJlODZiMzUyM2YyZmE1MTJlYjk5MTgwZWUyOTc1YTUwYTQ0MzllNjNlOGJhZGQxNTNmMmE2OGQ2MWFhNCcpO1xuICAgIGV4cGVjdChhc3NldC5zb3VyY2VQYXRoKS50b0VxdWFsKGRpcmVjdG9yeSk7XG5cbiAgICBjb25zdCByZXNvbHZlZFN0YWdlUGF0aCA9IGFzc2V0LnJlbGF0aXZlU3RhZ2VkUGF0aChzdGFjayk7XG4gICAgLy8gYWJzb2x1dGUgcGF0aCBlbmRpbmcgd2l0aCBidW5kbGluZyBkaXJcbiAgICBleHBlY3QocGF0aC5pc0Fic29sdXRlKHJlc29sdmVkU3RhZ2VQYXRoKSkudG9FcXVhbCh0cnVlKTtcbiAgICBleHBlY3QobmV3IFJlZ0V4cCgnYXNzZXQuYjFlMzJlODZiMzUyM2YyZmE1MTJlYjk5MTgwZWUyOTc1YTUwYTQ0MzllNjNlOGJhZGQxNTNmMmE2OGQ2MWFhNCQnKS50ZXN0KHJlc29sdmVkU3RhZ2VQYXRoKSkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdCgnYnVuZGxlciByZXVzZXMgaXRzIG91dHB1dCB3aGVuIGl0IGNhbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoeyBjb250ZXh0OiB7IFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSB9IH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJyk7XG4gICAgY29uc3QgZGlyZWN0b3J5ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzJywgJ2ZpeHR1cmVzJywgJ3Rlc3QxJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5TVUNDRVNTXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnQXNzZXREdXBsaWNhdGUnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBpbWFnZTogRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKSxcbiAgICAgICAgY29tbWFuZDogW0RvY2tlclN0dWJDb21tYW5kLlNVQ0NFU1NdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuXG4gICAgLy8gV2UncmUgdGVzdGluZyB0aGF0IGRvY2tlciB3YXMgcnVuIGV4YWN0bHkgb25jZSBldmVuIHRob3VnaCB0aGVyZSBhcmUgdHdvIGJ1bmRsaW5nIGFzc2V0cy5cbiAgICBleHBlY3QoXG4gICAgICByZWFkRG9ja2VyU3R1YklucHV0Q29uY2F0KCkpLnRvRXF1YWwoXG4gICAgICBgcnVuIC0tcm0gJHtVU0VSX0FSR30gLXYgL2lucHV0Oi9hc3NldC1pbnB1dDpkZWxlZ2F0ZWQgLXYgL291dHB1dDovYXNzZXQtb3V0cHV0OmRlbGVnYXRlZCAtdyAvYXNzZXQtaW5wdXQgYWxwaW5lIERPQ0tFUl9TVFVCX1NVQ0NFU1NgLFxuICAgICk7XG5cbiAgICBleHBlY3QoZnMucmVhZGRpclN5bmMoYXNzZW1ibHkuZGlyZWN0b3J5KSkudG9FcXVhbChbXG4gICAgICAnYXNzZXQuYjFlMzJlODZiMzUyM2YyZmE1MTJlYjk5MTgwZWUyOTc1YTUwYTQ0MzllNjNlOGJhZGQxNTNmMmE2OGQ2MWFhNCcsXG4gICAgICAnY2RrLm91dCcsXG4gICAgICAnbWFuaWZlc3QuanNvbicsXG4gICAgICAnc3RhY2sudGVtcGxhdGUuanNvbicsXG4gICAgICAndHJlZS5qc29uJyxcbiAgICBdKTtcbiAgfSk7XG5cbiAgdGVzdCgndXNlcyBhc3NldCBoYXNoIGNhY2hlIHdpdGggQXNzZXRIYXNoVHlwZS5PVVRQVVQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHsgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdzdGFjaycpO1xuICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuICAgIGNvbnN0IGZpbmdlclByaW50U3B5ID0gc2lub24uc3B5KEZpbGVTeXN0ZW0sICdmaW5nZXJwcmludCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGFzc2V0SGFzaFR5cGU6IEFzc2V0SGFzaFR5cGUuT1VUUFVULFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5TVUNDRVNTXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnQXNzZXREdXBsaWNhdGUnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBhc3NldEhhc2hUeXBlOiBBc3NldEhhc2hUeXBlLk9VVFBVVCxcbiAgICAgIGJ1bmRsaW5nOiB7IC8vIFNhbWUgYnVuZGxpbmcgYnV0IHdpdGgga2V5cyBvcmRlcmVkIGRpZmZlcmVudGx5XG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5TVUNDRVNTXSxcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG5cbiAgICAvLyBXZSdyZSB0ZXN0aW5nIHRoYXQgZG9ja2VyIHdhcyBydW4gZXhhY3RseSBvbmNlIGV2ZW4gdGhvdWdoIHRoZXJlIGFyZSB0d28gYnVuZGxpbmcgYXNzZXRzXG4gICAgLy8gYW5kIHRoYXQgdGhlIGhhc2ggaXMgYmFzZWQgb24gdGhlIG91dHB1dFxuICAgIGV4cGVjdChcbiAgICAgIHJlYWREb2NrZXJTdHViSW5wdXRDb25jYXQoKSkudG9FcXVhbChcbiAgICAgIGBydW4gLS1ybSAke1VTRVJfQVJHfSAtdiAvaW5wdXQ6L2Fzc2V0LWlucHV0OmRlbGVnYXRlZCAtdiAvb3V0cHV0Oi9hc3NldC1vdXRwdXQ6ZGVsZWdhdGVkIC13IC9hc3NldC1pbnB1dCBhbHBpbmUgRE9DS0VSX1NUVUJfU1VDQ0VTU2AsXG4gICAgKTtcblxuICAgIGV4cGVjdChmcy5yZWFkZGlyU3luYyhhc3NlbWJseS5kaXJlY3RvcnkpKS50b0VxdWFsKFtcbiAgICAgICdhc3NldC4zM2NiZjJjYWU1NDMyNDM4ZTBmMDQ2YmM0NWJhOGMzY2VmN2I2YWZjZjQ3YjU5ZDFjMTgzNzc1YzE5MThmYjFmJyxcbiAgICAgICdjZGsub3V0JyxcbiAgICAgICdtYW5pZmVzdC5qc29uJyxcbiAgICAgICdzdGFjay50ZW1wbGF0ZS5qc29uJyxcbiAgICAgICd0cmVlLmpzb24nLFxuICAgIF0pO1xuXG4gICAgLy8gT25seSBvbmUgZmluZ2VycHJpbnRpbmdcbiAgICBleHBlY3QoZmluZ2VyUHJpbnRTcHkuY2FsbGVkT25jZSkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdCgnYnVuZGxlciBjb25zaWRlcnMgaXRzIG9wdGlvbnMgd2hlbiByZXVzaW5nIGJ1bmRsZSBvdXRwdXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHsgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdzdGFjaycpO1xuICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ0Fzc2V0V2l0aERpZmZlcmVudEJ1bmRsaW5nT3B0aW9ucycsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU10sXG4gICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgVU5JUVVFX0VOVl9WQVI6ICdTT01FVkFMVUUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuXG4gICAgLy8gV2UncmUgdGVzdGluZyB0aGF0IGRvY2tlciB3YXMgcnVuIHR3aWNlIC0gb25jZSBmb3IgZWFjaCBzZXQgb2YgYnVuZGxlciBvcHRpb25zXG4gICAgLy8gb3BlcmF0aW5nIG9uIHRoZSBzYW1lIHNvdXJjZSBhc3NldC5cbiAgICBleHBlY3QoXG4gICAgICByZWFkRG9ja2VyU3R1YklucHV0Q29uY2F0KCkpLnRvRXF1YWwoXG4gICAgICBgcnVuIC0tcm0gJHtVU0VSX0FSR30gLXYgL2lucHV0Oi9hc3NldC1pbnB1dDpkZWxlZ2F0ZWQgLXYgL291dHB1dDovYXNzZXQtb3V0cHV0OmRlbGVnYXRlZCAtdyAvYXNzZXQtaW5wdXQgYWxwaW5lIERPQ0tFUl9TVFVCX1NVQ0NFU1NcXG5gICtcbiAgICAgIGBydW4gLS1ybSAke1VTRVJfQVJHfSAtdiAvaW5wdXQ6L2Fzc2V0LWlucHV0OmRlbGVnYXRlZCAtdiAvb3V0cHV0Oi9hc3NldC1vdXRwdXQ6ZGVsZWdhdGVkIC0tZW52IFVOSVFVRV9FTlZfVkFSPVNPTUVWQUxVRSAtdyAvYXNzZXQtaW5wdXQgYWxwaW5lIERPQ0tFUl9TVFVCX1NVQ0NFU1NgLFxuICAgICk7XG5cbiAgICBleHBlY3QoZnMucmVhZGRpclN5bmMoYXNzZW1ibHkuZGlyZWN0b3J5KSkudG9FcXVhbChbXG4gICAgICAnYXNzZXQuYjFlMzJlODZiMzUyM2YyZmE1MTJlYjk5MTgwZWUyOTc1YTUwYTQ0MzllNjNlOGJhZGQxNTNmMmE2OGQ2MWFhNCcsIC8vICdBc3NldCdcbiAgICAgICdhc3NldC5lODBiYjhmOTMxYjg3ZTg0OTc1ZGUxOTNmNWE3ZWNkZGQ3NTU4ZDNjYWYzZDM1ZDNhNTM2ZDlhZTY1MzkyMzRmJywgLy8gJ0Fzc2V0V2l0aERpZmZlcmVudEJ1bmRsaW5nT3B0aW9ucydcbiAgICAgICdjZGsub3V0JyxcbiAgICAgICdtYW5pZmVzdC5qc29uJyxcbiAgICAgICdzdGFjay50ZW1wbGF0ZS5qc29uJyxcbiAgICAgICd0cmVlLmpzb24nLFxuICAgIF0pO1xuICB9KTtcblxuICB0ZXN0KCdidW5kbGVyIG91dHB1dHMgdG8gaW50ZXJtZWRpYXRlIGRpciBhbmQgcmVuYW1lcyB0byBhc3NldCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoeyBjb250ZXh0OiB7IFtjeGFwaS5ORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFRdOiBmYWxzZSB9IH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJyk7XG4gICAgY29uc3QgZGlyZWN0b3J5ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzJywgJ2ZpeHR1cmVzJywgJ3Rlc3QxJyk7XG4gICAgY29uc3QgZW5zdXJlRGlyU3luYyA9IHNpbm9uLnNweShmcywgJ2Vuc3VyZURpclN5bmMnKTtcbiAgICBjb25zdCBjaG1vZFN5bmNTcHkgPSBzaW5vbi5zcHkoZnMsICdjaG1vZFN5bmMnKTtcbiAgICBjb25zdCByZW5hbWVTeW5jU3B5ID0gc2lub24uc3B5KGZzLCAncmVuYW1lU3luYycpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGFzc2V0SGFzaFR5cGU6IEFzc2V0SGFzaFR5cGUuT1VUUFVULFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5TVUNDRVNTXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcblxuICAgIGV4cGVjdChlbnN1cmVEaXJTeW5jLmNhbGxlZFdpdGgoc2lub24ubWF0Y2gocGF0aC5qb2luKGFzc2VtYmx5LmRpcmVjdG9yeSwgJ2J1bmRsaW5nLXRlbXAtJykpKSkudG9FcXVhbCh0cnVlKTtcbiAgICBleHBlY3QoY2htb2RTeW5jU3B5LmNhbGxlZFdpdGgoc2lub24ubWF0Y2gocGF0aC5qb2luKGFzc2VtYmx5LmRpcmVjdG9yeSwgJ2J1bmRsaW5nLXRlbXAtJykpLCAwbzc3NykpLnRvRXF1YWwodHJ1ZSk7XG4gICAgZXhwZWN0KHJlbmFtZVN5bmNTcHkuY2FsbGVkV2l0aChzaW5vbi5tYXRjaChwYXRoLmpvaW4oYXNzZW1ibHkuZGlyZWN0b3J5LCAnYnVuZGxpbmctdGVtcC0nKSksIHNpbm9uLm1hdGNoKHBhdGguam9pbihhc3NlbWJseS5kaXJlY3RvcnksICdhc3NldC4nKSkpKS50b0VxdWFsKHRydWUpO1xuXG4gICAgZXhwZWN0KGZzLnJlYWRkaXJTeW5jKGFzc2VtYmx5LmRpcmVjdG9yeSkpLnRvRXF1YWwoW1xuICAgICAgJ2Fzc2V0LjMzY2JmMmNhZTU0MzI0MzhlMGYwNDZiYzQ1YmE4YzNjZWY3YjZhZmNmNDdiNTlkMWMxODM3NzVjMTkxOGZiMWYnLCAvLyAnQXNzZXQnXG4gICAgICAnY2RrLm91dCcsXG4gICAgICAnbWFuaWZlc3QuanNvbicsXG4gICAgICAnc3RhY2sudGVtcGxhdGUuanNvbicsXG4gICAgICAndHJlZS5qc29uJyxcbiAgICBdKTtcbiAgfSk7XG5cbiAgdGVzdCgnYnVuZGxpbmcgZmFpbHVyZSBwcmVzZXJ2ZXMgdGhlIGJ1bmRsZURpciBmb3IgZGlhZ25vc2FiaWxpdHknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBleHBlY3QoKCkgPT4gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5GQUlMXSxcbiAgICAgIH0sXG4gICAgfSkpLnRvVGhyb3coL0ZhaWxlZC4qYnVuZGwuKmFzc2V0LiotZXJyb3IvKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuXG4gICAgY29uc3QgZGlyID0gZnMucmVhZGRpclN5bmMoYXNzZW1ibHkuZGlyZWN0b3J5KTtcbiAgICBleHBlY3QoZGlyLnNvbWUoZW50cnkgPT4gZW50cnkubWF0Y2goL2Fzc2V0LiotZXJyb3IvKSkpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1bmRsZXIgcmUtdXNlcyBhc3NldHMgZnJvbSBwcmV2aW91cyBzeW50aHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBURVNUX09VVERJUiA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdjZGsub3V0Jyk7XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoVEVTVF9PVVRESVIpKSB7XG4gICAgICBmcy5yZW1vdmVTeW5jKFRFU1RfT1VURElSKTtcbiAgICB9XG5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHsgb3V0ZGlyOiBURVNUX09VVERJUiwgY29udGV4dDogeyBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UgfSB9KTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdzdGFjaycpO1xuICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gQ2xlYXIgYXNzZXQgaGFzaCBjYWNoZSB0byBzaG93IHRoYXQgZHVyaW5nIHRoZSBzZWNvbmQgc3ludGggYnVuZGxpbmdcbiAgICAvLyB3aWxsIGNvbnNpZGVyIHRoZSBleGlzdGluZyBidW5kbGluZyBkaXIgKGZpbGUgc3lzdGVtIGNhY2hlKS5cbiAgICBBc3NldFN0YWdpbmcuY2xlYXJBc3NldEhhc2hDYWNoZSgpO1xuXG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAyID0gbmV3IEFwcCh7IG91dGRpcjogVEVTVF9PVVRESVIsIGNvbnRleHQ6IHsgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlIH0gfSk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcDIsICdzdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBBc3NldFN0YWdpbmcoc3RhY2syLCAnQXNzZXQnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBpbWFnZTogRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKSxcbiAgICAgICAgY29tbWFuZDogW0RvY2tlclN0dWJDb21tYW5kLlNVQ0NFU1NdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhcHBBc3NlbWJseSA9IGFwcC5zeW50aCgpO1xuICAgIGNvbnN0IGFwcDJBc3NlbWJseSA9IGFwcDIuc3ludGgoKTtcblxuICAgIGV4cGVjdChcbiAgICAgIHJlYWREb2NrZXJTdHViSW5wdXRDb25jYXQoKSkudG9FcXVhbChcbiAgICAgIGBydW4gLS1ybSAke1VTRVJfQVJHfSAtdiAvaW5wdXQ6L2Fzc2V0LWlucHV0OmRlbGVnYXRlZCAtdiAvb3V0cHV0Oi9hc3NldC1vdXRwdXQ6ZGVsZWdhdGVkIC13IC9hc3NldC1pbnB1dCBhbHBpbmUgRE9DS0VSX1NUVUJfU1VDQ0VTU2AsXG4gICAgKTtcblxuICAgIGV4cGVjdChhcHBBc3NlbWJseS5kaXJlY3RvcnkpLnRvRXF1YWwoYXBwMkFzc2VtYmx5LmRpcmVjdG9yeSk7XG4gICAgZXhwZWN0KGZzLnJlYWRkaXJTeW5jKGFwcEFzc2VtYmx5LmRpcmVjdG9yeSkpLnRvRXF1YWwoW1xuICAgICAgJ2Fzc2V0LmIxZTMyZTg2YjM1MjNmMmZhNTEyZWI5OTE4MGVlMjk3NWE1MGE0NDM5ZTYzZThiYWRkMTUzZjJhNjhkNjFhYTQnLFxuICAgICAgJ2Nkay5vdXQnLFxuICAgICAgJ21hbmlmZXN0Lmpzb24nLFxuICAgICAgJ3N0YWNrLnRlbXBsYXRlLmpzb24nLFxuICAgICAgJ3RyZWUuanNvbicsXG4gICAgXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1bmRsaW5nIHRocm93cyB3aGVuIC9hc3NldC1vdXRwdXQgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5TVUNDRVNTX05PX09VVFBVVF0sXG4gICAgICB9LFxuICAgIH0pKS50b1Rocm93KC9CdW5kbGluZyBkaWQgbm90IHByb2R1Y2UgYW55IG91dHB1dC8pO1xuXG4gICAgZXhwZWN0KFxuICAgICAgcmVhZERvY2tlclN0dWJJbnB1dCgpKS50b0VxdWFsKFxuICAgICAgYHJ1biAtLXJtICR7VVNFUl9BUkd9IC12IC9pbnB1dDovYXNzZXQtaW5wdXQ6ZGVsZWdhdGVkIC12IC9vdXRwdXQ6L2Fzc2V0LW91dHB1dDpkZWxlZ2F0ZWQgLXcgL2Fzc2V0LWlucHV0IGFscGluZSBET0NLRVJfU1RVQl9TVUNDRVNTX05PX09VVFBVVGAsXG4gICAgKTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ2J1bmRsaW5nIHdpdGggQlVORExFIGFzc2V0IGhhc2ggdHlwZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdzdGFjaycpO1xuICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFzc2V0ID0gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5TVUNDRVNTXSxcbiAgICAgIH0sXG4gICAgICBhc3NldEhhc2hUeXBlOiBBc3NldEhhc2hUeXBlLkJVTkRMRSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoXG4gICAgICByZWFkRG9ja2VyU3R1YklucHV0KCkpLnRvRXF1YWwoXG4gICAgICBgcnVuIC0tcm0gJHtVU0VSX0FSR30gLXYgL2lucHV0Oi9hc3NldC1pbnB1dDpkZWxlZ2F0ZWQgLXYgL291dHB1dDovYXNzZXQtb3V0cHV0OmRlbGVnYXRlZCAtdyAvYXNzZXQtaW5wdXQgYWxwaW5lIERPQ0tFUl9TVFVCX1NVQ0NFU1NgLFxuICAgICk7XG4gICAgZXhwZWN0KGFzc2V0LmFzc2V0SGFzaCkudG9FcXVhbCgnMzNjYmYyY2FlNTQzMjQzOGUwZjA0NmJjNDViYThjM2NlZjdiNmFmY2Y0N2I1OWQxYzE4Mzc3NWMxOTE4ZmIxZicpO1xuICB9KTtcblxuICB0ZXN0KCdidW5kbGluZyB3aXRoIGRvY2tlciBzZWN1cml0eSBvcHRpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhc3NldCA9IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU10sXG4gICAgICAgIHNlY3VyaXR5T3B0OiAnbm8tbmV3LXByaXZpbGVnZXMnLFxuICAgICAgfSxcbiAgICAgIGFzc2V0SGFzaFR5cGU6IEFzc2V0SGFzaFR5cGUuQlVORExFLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChcbiAgICAgIHJlYWREb2NrZXJTdHViSW5wdXQoKSkudG9FcXVhbChcbiAgICAgIGBydW4gLS1ybSAtLXNlY3VyaXR5LW9wdCBuby1uZXctcHJpdmlsZWdlcyAke1VTRVJfQVJHfSAtdiAvaW5wdXQ6L2Fzc2V0LWlucHV0OmRlbGVnYXRlZCAtdiAvb3V0cHV0Oi9hc3NldC1vdXRwdXQ6ZGVsZWdhdGVkIC13IC9hc3NldC1pbnB1dCBhbHBpbmUgRE9DS0VSX1NUVUJfU1VDQ0VTU2AsXG4gICAgKTtcbiAgICBleHBlY3QoYXNzZXQuYXNzZXRIYXNoKS50b0VxdWFsKCczM2NiZjJjYWU1NDMyNDM4ZTBmMDQ2YmM0NWJhOGMzY2VmN2I2YWZjZjQ3YjU5ZDFjMTgzNzc1YzE5MThmYjFmJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1bmRsaW5nIHdpdGggZG9ja2VyIGVudHJ5cG9pbnQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhc3NldCA9IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBlbnRyeXBvaW50OiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU10sXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5TVUNDRVNTXSxcbiAgICAgIH0sXG4gICAgICBhc3NldEhhc2hUeXBlOiBBc3NldEhhc2hUeXBlLk9VVFBVVCxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoXG4gICAgICByZWFkRG9ja2VyU3R1YklucHV0KCkpLnRvRXF1YWwoXG4gICAgICBgcnVuIC0tcm0gJHtVU0VSX0FSR30gLXYgL2lucHV0Oi9hc3NldC1pbnB1dDpkZWxlZ2F0ZWQgLXYgL291dHB1dDovYXNzZXQtb3V0cHV0OmRlbGVnYXRlZCAtdyAvYXNzZXQtaW5wdXQgLS1lbnRyeXBvaW50IERPQ0tFUl9TVFVCX1NVQ0NFU1MgYWxwaW5lIERPQ0tFUl9TVFVCX1NVQ0NFU1NgLFxuICAgICk7XG4gICAgZXhwZWN0KGFzc2V0LmFzc2V0SGFzaCkudG9FcXVhbCgnMzNjYmYyY2FlNTQzMjQzOGUwZjA0NmJjNDViYThjM2NlZjdiNmFmY2Y0N2I1OWQxYzE4Mzc3NWMxOTE4ZmIxZicpO1xuICB9KTtcblxuICB0ZXN0KCdidW5kbGluZyB3aXRoIE9VVFBVVCBhc3NldCBoYXNoIHR5cGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBhc3NldCA9IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU10sXG4gICAgICB9LFxuICAgICAgYXNzZXRIYXNoVHlwZTogQXNzZXRIYXNoVHlwZS5PVVRQVVQsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGFzc2V0LmFzc2V0SGFzaCkudG9FcXVhbCgnMzNjYmYyY2FlNTQzMjQzOGUwZjA0NmJjNDViYThjM2NlZjdiNmFmY2Y0N2I1OWQxYzE4Mzc3NWMxOTE4ZmIxZicpO1xuICB9KTtcblxuICB0ZXN0KCdjdXN0b20gaGFzaCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdzdGFjaycpO1xuICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFzc2V0ID0gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYXNzZXRIYXNoOiAnbXktY3VzdG9tLWhhc2gnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChmcy5leGlzdHNTeW5jKFNUVUJfSU5QVVRfRklMRSkpLnRvRXF1YWwoZmFsc2UpO1xuICAgIGV4cGVjdChhc3NldC5hc3NldEhhc2gpLnRvRXF1YWwoJ2I5Yzc3MDUzZjViODNiYmU1YmEzNDNiYzE4ZTkyZGI5MzlhNDkwMTcwMTA4MTMyMjVmZWE5MWZhODkyYzQ4MjMnKTsgLy8gaGFzaCBvZiAnbXktY3VzdG9tLWhhc2gnXG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aXRoIGFzc2V0SGFzaCBhbmQgbm90IENVU1RPTSBoYXNoIHR5cGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5TVUNDRVNTXSxcbiAgICAgIH0sXG4gICAgICBhc3NldEhhc2g6ICdteS1jdXN0b20taGFzaCcsXG4gICAgICBhc3NldEhhc2hUeXBlOiBBc3NldEhhc2hUeXBlLk9VVFBVVCxcbiAgICB9KSkudG9UaHJvdygvQ2Fubm90IHNwZWNpZnkgYG91dHB1dGAgZm9yIGBhc3NldEhhc2hUeXBlYC8pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgndGhyb3dzIHdpdGggQlVORExFIGhhc2ggdHlwZSBhbmQgbm8gYnVuZGxpbmcnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYXNzZXRIYXNoVHlwZTogQXNzZXRIYXNoVHlwZS5CVU5ETEUsXG4gICAgfSkpLnRvVGhyb3coL0Nhbm5vdCB1c2UgYGJ1bmRsZWAgaGFzaCB0eXBlIHdoZW4gYGJ1bmRsaW5nYCBpcyBub3Qgc3BlY2lmaWVkLyk7XG4gICAgZXhwZWN0KGZzLmV4aXN0c1N5bmMoU1RVQl9JTlBVVF9GSUxFKSkudG9FcXVhbChmYWxzZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aXRoIE9VVFBVVCBoYXNoIHR5cGUgYW5kIG5vIGJ1bmRsaW5nJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJyk7XG4gICAgY29uc3QgZGlyZWN0b3J5ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzJywgJ2ZpeHR1cmVzJywgJ3Rlc3QxJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGFzc2V0SGFzaFR5cGU6IEFzc2V0SGFzaFR5cGUuT1VUUFVULFxuICAgIH0pKS50b1Rocm93KC9DYW5ub3QgdXNlIGBvdXRwdXRgIGhhc2ggdHlwZSB3aGVuIGBidW5kbGluZ2AgaXMgbm90IHNwZWNpZmllZC8pO1xuICAgIGV4cGVjdChmcy5leGlzdHNTeW5jKFNUVUJfSU5QVVRfRklMRSkpLnRvRXF1YWwoZmFsc2UpO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2l0aCBDVVNUT00gYW5kIG5vIGhhc2gnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYXNzZXRIYXNoVHlwZTogQXNzZXRIYXNoVHlwZS5DVVNUT00sXG4gICAgfSkpLnRvVGhyb3coL2Bhc3NldEhhc2hgIG11c3QgYmUgc3BlY2lmaWVkIHdoZW4gYGFzc2V0SGFzaFR5cGVgIGlzIHNldCB0byBgQXNzZXRIYXNoVHlwZS5DVVNUT01gLyk7XG4gICAgZXhwZWN0KGZzLmV4aXN0c1N5bmMoU1RVQl9JTlBVVF9GSUxFKSkudG9FcXVhbChmYWxzZSk7IC8vIFwiZG9ja2VyXCIgbm90IGV4ZWN1dGVkXG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyB3aGVuIGJ1bmRsaW5nIGZhaWxzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJyk7XG4gICAgY29uc3QgZGlyZWN0b3J5ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzJywgJ2ZpeHR1cmVzJywgJ3Rlc3QxJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ3RoaXMtaXMtYW4taW52YWxpZC1kb2NrZXItaW1hZ2UnKSxcbiAgICAgICAgY29tbWFuZDogW0RvY2tlclN0dWJDb21tYW5kLkZBSUxdLFxuICAgICAgfSxcbiAgICB9KSkudG9UaHJvdygvRmFpbGVkIHRvIGJ1bmRsZSBhc3NldCBzdGFja1xcL0Fzc2V0Lyk7XG4gICAgZXhwZWN0KFxuICAgICAgcmVhZERvY2tlclN0dWJJbnB1dCgpKS50b0VxdWFsKFxuICAgICAgYHJ1biAtLXJtICR7VVNFUl9BUkd9IC12IC9pbnB1dDovYXNzZXQtaW5wdXQ6ZGVsZWdhdGVkIC12IC9vdXRwdXQ6L2Fzc2V0LW91dHB1dDpkZWxlZ2F0ZWQgLXcgL2Fzc2V0LWlucHV0IHRoaXMtaXMtYW4taW52YWxpZC1kb2NrZXItaW1hZ2UgRE9DS0VSX1NUVUJfRkFJTGAsXG4gICAgKTtcbiAgfSk7XG5cbiAgdGVzdCgnd2l0aCBsb2NhbCBidW5kbGluZycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdzdGFjaycpO1xuICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGxldCBkaXI6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBsZXQgb3B0czogQnVuZGxpbmdPcHRpb25zIHwgdW5kZWZpbmVkO1xuICAgIG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU10sXG4gICAgICAgIGxvY2FsOiB7XG4gICAgICAgICAgdHJ5QnVuZGxlKG91dHB1dERpcjogc3RyaW5nLCBvcHRpb25zOiBCdW5kbGluZ09wdGlvbnMpOiBib29sZWFuIHtcbiAgICAgICAgICAgIGRpciA9IG91dHB1dERpcjtcbiAgICAgICAgICAgIG9wdHMgPSBvcHRpb25zO1xuICAgICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4ob3V0cHV0RGlyLCAnaGVsbG8udHh0JyksICdoZWxsbycpOyAvLyBvdXRwdXQgY2Fubm90IGJlIGVtcHR5XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoZGlyICYmIC9hc3NldC5bMC05YS1mXXsxNix9Ly50ZXN0KGRpcikpLnRvRXF1YWwodHJ1ZSk7XG4gICAgZXhwZWN0KG9wdHM/LmNvbW1hbmQ/LlswXSkudG9FcXVhbChEb2NrZXJTdHViQ29tbWFuZC5TVUNDRVNTKTtcbiAgICBleHBlY3QoKCkgPT4gcmVhZERvY2tlclN0dWJJbnB1dCgpKS50b1Rocm93KCk7XG5cbiAgICBpZiAoZGlyKSB7XG4gICAgICBmcy5yZW1vdmVTeW5jKHBhdGguam9pbihkaXIsICdoZWxsby50eHQnKSk7XG4gICAgfVxuICB9KTtcblxuICB0ZXN0KCd3aXRoIGxvY2FsIGJ1bmRsaW5nIHJldHVybmluZyBmYWxzZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdzdGFjaycpO1xuICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBBc3NldFN0YWdpbmcoc3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU10sXG4gICAgICAgIGxvY2FsOiB7XG4gICAgICAgICAgdHJ5QnVuZGxlKF9idW5kbGVEaXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZWFkRG9ja2VyU3R1YklucHV0KCkpLnRvQmVEZWZpbmVkKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1bmRsaW5nIGNhbiBiZSBza2lwcGVkIGJ5IHNldHRpbmcgY29udGV4dCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdNeVN0YWNrJyk7XG4gICAgc3RhY2subm9kZS5zZXRDb250ZXh0KGN4YXBpLkJVTkRMSU5HX1NUQUNLUywgWydPdGhlclN0YWNrJ10pO1xuICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGFzc2V0ID0gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYXNzZXRIYXNoVHlwZTogQXNzZXRIYXNoVHlwZS5PVVRQVVQsXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBpbWFnZTogRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKSxcbiAgICAgICAgY29tbWFuZDogW0RvY2tlclN0dWJDb21tYW5kLlNVQ0NFU1NdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiByZWFkRG9ja2VyU3R1YklucHV0KCkpLnRvVGhyb3coKTsgLy8gQnVuZGxpbmcgZGlkIG5vdCBydW5cbiAgICBleHBlY3QoYXNzZXQuc291cmNlUGF0aCkudG9FcXVhbChkaXJlY3RvcnkpO1xuICAgIGV4cGVjdChhc3NldC5zdGFnZWRQYXRoKS50b0VxdWFsKGRpcmVjdG9yeSk7XG4gICAgZXhwZWN0KGFzc2V0LnJlbGF0aXZlU3RhZ2VkUGF0aChzdGFjaykpLnRvRXF1YWwoZGlyZWN0b3J5KTtcbiAgICBleHBlY3QoYXNzZXQuYXNzZXRIYXNoKS50b0VxdWFsKCdmNjZkNzQyMWFhMmQwNDRhNmMxZjYwZGRmYzc2ZGM3ODU3MWZjZDhiZDIyOGViNDhlYjM5NGUyZGJhZDk0YTVjJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvcnJlY3RseSBza2lwcyBidW5kbGluZyB3aXRoIHN0YWNrIHVuZGVyIHN0YWdlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG4gICAgY29uc3Qgc3RhZ2UgPSBuZXcgU3RhZ2UoYXBwLCAnU3RhZ2UnKTtcbiAgICBzdGFnZS5ub2RlLnNldENvbnRleHQoY3hhcGkuQlVORExJTkdfU1RBQ0tTLCBbJ1N0YWdlL1N0YWNrMSddKTtcblxuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhzdGFnZSwgJ1N0YWNrMScpO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhzdGFnZSwgJ1N0YWNrMicpO1xuICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuXG4gICAgbmV3IEFzc2V0U3RhZ2luZyhzdGFjazEsICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGFzc2V0SGFzaFR5cGU6IEFzc2V0SGFzaFR5cGUuT1VUUFVULFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5TVUNDRVNTXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrMiwgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYXNzZXRIYXNoVHlwZTogQXNzZXRIYXNoVHlwZS5PVVRQVVQsXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBpbWFnZTogRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKSxcbiAgICAgICAgY29tbWFuZDogW0RvY2tlclN0dWJDb21tYW5kLk1VTFRJUExFX0ZJTEVTXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBkb2NrZXJTdHViSW5wdXQgPSByZWFkRG9ja2VyU3R1YklucHV0Q29uY2F0KCk7XG4gICAgLy8gRG9ja2VyIHJhbiBmb3IgdGhlIGFzc2V0IGluIFN0YWNrMVxuICAgIGV4cGVjdChkb2NrZXJTdHViSW5wdXQpLnRvTWF0Y2goRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTUyk7XG4gICAgLy8gRE9ja2VyIGRpZCBub3QgcnVuIGZvciB0aGUgYXNzZXQgaW4gU3RhY2syXG4gICAgZXhwZWN0KGRvY2tlclN0dWJJbnB1dCkubm90LnRvTWF0Y2goRG9ja2VyU3R1YkNvbW1hbmQuTVVMVElQTEVfRklMRVMpO1xuICB9KTtcblxuICB0ZXN0KCdjb3JyZWN0bHkgc2tpcHMgYnVuZGxpbmcgd2l0aCBzdGFjayB1bmRlciBzdGFnZSBhbmQgY3VzdG9tIHN0YWNrIG5hbWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICBjb25zdCBzdGFnZSA9IG5ldyBTdGFnZShhcHAsICdTdGFnZScpO1xuICAgIHN0YWdlLm5vZGUuc2V0Q29udGV4dChjeGFwaS5CVU5ETElOR19TVEFDS1MsIFsnU3RhZ2UvU3RhY2sxJ10pO1xuXG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKHN0YWdlLCAnU3RhY2sxJywgeyBzdGFja05hbWU6ICd1bnJlbGF0ZWQtc3RhY2sxLW5hbWUnIH0pO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhzdGFnZSwgJ1N0YWNrMicsIHsgc3RhY2tOYW1lOiAndW5yZWxhdGVkLXN0YWNrMi1uYW1lJyB9KTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrMSwgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYXNzZXRIYXNoVHlwZTogQXNzZXRIYXNoVHlwZS5PVVRQVVQsXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBpbWFnZTogRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKSxcbiAgICAgICAgY29tbWFuZDogW0RvY2tlclN0dWJDb21tYW5kLlNVQ0NFU1NdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIG5ldyBBc3NldFN0YWdpbmcoc3RhY2syLCAnQXNzZXQnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBhc3NldEhhc2hUeXBlOiBBc3NldEhhc2hUeXBlLk9VVFBVVCxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuTVVMVElQTEVfRklMRVNdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBkb2NrZXJTdHViSW5wdXQgPSByZWFkRG9ja2VyU3R1YklucHV0Q29uY2F0KCk7XG4gICAgLy8gRG9ja2VyIHJhbiBmb3IgdGhlIGFzc2V0IGluIFN0YWNrMVxuICAgIGV4cGVjdChkb2NrZXJTdHViSW5wdXQpLnRvTWF0Y2goRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTUyk7XG4gICAgLy8gRG9ja2VyIGRpZCBub3QgcnVuIGZvciB0aGUgYXNzZXQgaW4gU3RhY2syXG4gICAgZXhwZWN0KGRvY2tlclN0dWJJbnB1dCkubm90LnRvTWF0Y2goRG9ja2VyU3R1YkNvbW1hbmQuTVVMVElQTEVfRklMRVMpO1xuICB9KTtcblxuICB0ZXN0KCdjb3JyZWN0bHkgYnVuZGxlcyB3aXRoIHN0YWNrIHVuZGVyIHN0YWdlIGFuZCB0aGUgZGVmYXVsdCBzdGFjayBwYXR0ZXJuJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG4gICAgY29uc3Qgc3RhZ2UgPSBuZXcgU3RhZ2UoYXBwLCAnU3RhZ2UnKTtcblxuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhzdGFnZSwgJ1N0YWNrMScpO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhzdGFnZSwgJ1N0YWNrMicpO1xuICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBBc3NldFN0YWdpbmcoc3RhY2sxLCAnQXNzZXQnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBhc3NldEhhc2hUeXBlOiBBc3NldEhhc2hUeXBlLk9VVFBVVCxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbmV3IEFzc2V0U3RhZ2luZyhzdGFjazIsICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGFzc2V0SGFzaFR5cGU6IEFzc2V0SGFzaFR5cGUuT1VUUFVULFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5NVUxUSVBMRV9GSUxFU10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGRvY2tlclN0dWJJbnB1dCA9IHJlYWREb2NrZXJTdHViSW5wdXRDb25jYXQoKTtcbiAgICAvLyBEb2NrZXIgcmFuIGZvciB0aGUgYXNzZXQgaW4gU3RhY2sxXG4gICAgZXhwZWN0KGRvY2tlclN0dWJJbnB1dCkudG9NYXRjaChEb2NrZXJTdHViQ29tbWFuZC5TVUNDRVNTKTtcbiAgICAvLyBEb2NrZXIgcmFuIGZvciB0aGUgYXNzZXQgaW4gU3RhY2syXG4gICAgZXhwZWN0KGRvY2tlclN0dWJJbnB1dCkudG9NYXRjaChEb2NrZXJTdHViQ29tbWFuZC5NVUxUSVBMRV9GSUxFUyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvcnJlY3RseSBidW5kbGVzIHdpdGggc3RhY2sgdW5kZXIgc3RhZ2UgYW5kIHBhcnRpYWwgZ2xvYnN0YXIgd2lsZGNhcmQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICBjb25zdCBzdGFnZSA9IG5ldyBTdGFnZShhcHAsICdTdGFnZScpO1xuICAgIHN0YWdlLm5vZGUuc2V0Q29udGV4dChjeGFwaS5CVU5ETElOR19TVEFDS1MsIFsnKiovU3RhY2sxJ10pOyAvLyBhIHNpbmdsZSB3aWxkY2FyZCBwcmVmaXggKCcqU3RhY2sxJykgd29uJ3QgbWF0Y2hcblxuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhzdGFnZSwgJ1N0YWNrMScpO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhzdGFnZSwgJ1N0YWNrMicpO1xuICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBBc3NldFN0YWdpbmcoc3RhY2sxLCAnQXNzZXQnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBhc3NldEhhc2hUeXBlOiBBc3NldEhhc2hUeXBlLk9VVFBVVCxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbmV3IEFzc2V0U3RhZ2luZyhzdGFjazIsICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGFzc2V0SGFzaFR5cGU6IEFzc2V0SGFzaFR5cGUuT1VUUFVULFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5NVUxUSVBMRV9GSUxFU10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGRvY2tlclN0dWJJbnB1dCA9IHJlYWREb2NrZXJTdHViSW5wdXRDb25jYXQoKTtcbiAgICAvLyBEb2NrZXIgcmFuIGZvciB0aGUgYXNzZXQgaW4gU3RhY2sxXG4gICAgZXhwZWN0KGRvY2tlclN0dWJJbnB1dCkudG9NYXRjaChEb2NrZXJTdHViQ29tbWFuZC5TVUNDRVNTKTtcbiAgICAvLyBEb2NrZXIgZGlkIG5vdCBydW4gZm9yIHRoZSBhc3NldCBpbiBTdGFjazJcbiAgICBleHBlY3QoZG9ja2VyU3R1YklucHV0KS5ub3QudG9NYXRjaChEb2NrZXJTdHViQ29tbWFuZC5NVUxUSVBMRV9GSUxFUyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvcnJlY3RseSBidW5kbGVzIHNlbGVjdGVkIHN0YWNrcyBuZXN0ZWQgaW4gU3RhY2svU3RhZ2UvU3RhY2snLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICBjb25zdCB0b3BTdGFjayA9IG5ldyBTdGFjayhhcHAsICdUb3BTdGFjaycpO1xuICAgIHRvcFN0YWNrLm5vZGUuc2V0Q29udGV4dChjeGFwaS5CVU5ETElOR19TVEFDS1MsIFsnVG9wU3RhY2svTWlkZGxlU3RhZ2UvQm90dG9tU3RhY2snXSk7XG5cbiAgICBjb25zdCBtaWRkbGVTdGFnZSA9IG5ldyBTdGFnZSh0b3BTdGFjaywgJ01pZGRsZVN0YWdlJyk7XG4gICAgY29uc3QgYm90dG9tU3RhY2sgPSBuZXcgU3RhY2sobWlkZGxlU3RhZ2UsICdCb3R0b21TdGFjaycpO1xuICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBBc3NldFN0YWdpbmcoYm90dG9tU3RhY2ssICdBc3NldCcsIHtcbiAgICAgIHNvdXJjZVBhdGg6IGRpcmVjdG9yeSxcbiAgICAgIGFzc2V0SGFzaFR5cGU6IEFzc2V0SGFzaFR5cGUuT1VUUFVULFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5TVUNDRVNTXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgbmV3IEFzc2V0U3RhZ2luZyh0b3BTdGFjaywgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYXNzZXRIYXNoVHlwZTogQXNzZXRIYXNoVHlwZS5PVVRQVVQsXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBpbWFnZTogRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKSxcbiAgICAgICAgY29tbWFuZDogW0RvY2tlclN0dWJDb21tYW5kLk1VTFRJUExFX0ZJTEVTXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBkb2NrZXJTdHViSW5wdXQgPSByZWFkRG9ja2VyU3R1YklucHV0Q29uY2F0KCk7XG4gICAgLy8gRG9ja2VyIHJhbiBmb3IgdGhlIGFzc2V0IGluIEJvdHRvbVN0YWNrXG4gICAgZXhwZWN0KGRvY2tlclN0dWJJbnB1dCkudG9NYXRjaChEb2NrZXJTdHViQ29tbWFuZC5TVUNDRVNTKTtcbiAgICAvLyBEb2NrZXIgZGlkIG5vdCBydW4gZm9yIHRoZSBhc3NldCBpbiBUb3BTdGFja1xuICAgIGV4cGVjdChkb2NrZXJTdHViSW5wdXQpLm5vdC50b01hdGNoKERvY2tlclN0dWJDb21tYW5kLk1VTFRJUExFX0ZJTEVTKTtcbiAgfSk7XG5cbiAgdGVzdCgnYnVuZGxpbmcgc3RpbGwgb2NjdXJzIHdpdGggcGFydGlhbCB3aWxkY2FyZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdNeVN0YWNrJyk7XG4gICAgc3RhY2subm9kZS5zZXRDb250ZXh0KGN4YXBpLkJVTkRMSU5HX1NUQUNLUywgWycqU3RhY2snXSk7XG4gICAgY29uc3QgZGlyZWN0b3J5ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzJywgJ2ZpeHR1cmVzJywgJ3Rlc3QxJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXNzZXQgPSBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnQXNzZXQnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBhc3NldEhhc2hUeXBlOiBBc3NldEhhc2hUeXBlLk9VVFBVVCxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KFxuICAgICAgcmVhZERvY2tlclN0dWJJbnB1dCgpKS50b0VxdWFsKFxuICAgICAgYHJ1biAtLXJtICR7VVNFUl9BUkd9IC12IC9pbnB1dDovYXNzZXQtaW5wdXQ6ZGVsZWdhdGVkIC12IC9vdXRwdXQ6L2Fzc2V0LW91dHB1dDpkZWxlZ2F0ZWQgLXcgL2Fzc2V0LWlucHV0IGFscGluZSBET0NLRVJfU1RVQl9TVUNDRVNTYCxcbiAgICApO1xuICAgIGV4cGVjdChhc3NldC5hc3NldEhhc2gpLnRvRXF1YWwoJzMzY2JmMmNhZTU0MzI0MzhlMGYwNDZiYzQ1YmE4YzNjZWY3YjZhZmNmNDdiNTlkMWMxODM3NzVjMTkxOGZiMWYnKTsgLy8gaGFzaCBvZiBNeVN0YWNrL0Fzc2V0XG4gIH0pO1xuXG4gIHRlc3QoJ2J1bmRsaW5nIHN0aWxsIG9jY3VycyB3aXRoIGEgc2luZ2xlIHdpbGRjYXJkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2snKTtcbiAgICBzdGFjay5ub2RlLnNldENvbnRleHQoY3hhcGkuQlVORExJTkdfU1RBQ0tTLCBbJyonXSk7XG4gICAgY29uc3QgZGlyZWN0b3J5ID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzJywgJ2ZpeHR1cmVzJywgJ3Rlc3QxJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgYXNzZXQgPSBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrLCAnQXNzZXQnLCB7XG4gICAgICBzb3VyY2VQYXRoOiBkaXJlY3RvcnksXG4gICAgICBhc3NldEhhc2hUeXBlOiBBc3NldEhhc2hUeXBlLk9VVFBVVCxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIGltYWdlOiBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLFxuICAgICAgICBjb21tYW5kOiBbRG9ja2VyU3R1YkNvbW1hbmQuU1VDQ0VTU10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KFxuICAgICAgcmVhZERvY2tlclN0dWJJbnB1dCgpKS50b0VxdWFsKFxuICAgICAgYHJ1biAtLXJtICR7VVNFUl9BUkd9IC12IC9pbnB1dDovYXNzZXQtaW5wdXQ6ZGVsZWdhdGVkIC12IC9vdXRwdXQ6L2Fzc2V0LW91dHB1dDpkZWxlZ2F0ZWQgLXcgL2Fzc2V0LWlucHV0IGFscGluZSBET0NLRVJfU1RVQl9TVUNDRVNTYCxcbiAgICApO1xuICAgIGV4cGVjdChhc3NldC5hc3NldEhhc2gpLnRvRXF1YWwoJzMzY2JmMmNhZTU0MzI0MzhlMGYwNDZiYzQ1YmE4YzNjZWY3YjZhZmNmNDdiNTlkMWMxODM3NzVjMTkxOGZiMWYnKTsgLy8gaGFzaCBvZiBNeVN0YWNrL0Fzc2V0XG4gIH0pO1xuXG4gIHRlc3QoJ2J1bmRsaW5nIHRoYXQgcHJvZHVjZXMgYSBzaW5nbGUgYXJjaGl2ZSBmaWxlIGlzIGF1dG9kaXNjb3ZlcmVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IGNvbnRleHQ6IHsgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlIH0gfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzdGFnaW5nID0gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5TSU5HTEVfQVJDSElWRV0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgZXhwZWN0KGZzLnJlYWRkaXJTeW5jKGFzc2VtYmx5LmRpcmVjdG9yeSkpLnRvRXF1YWwoW1xuICAgICAgJ2Fzc2V0LmY0MzE0OGM2MTE3NGY0NDQ5MjUyMzFiNTg0OWI0NjhmMjFlOTNiNWQxNDY5Y2QwN2M1MzYyNWZmZDAzOWVmNDgnLCAvLyB0aGlzIGlzIHRoZSBidW5kbGUgZGlyXG4gICAgICAnYXNzZXQuZjQzMTQ4YzYxMTc0ZjQ0NDkyNTIzMWI1ODQ5YjQ2OGYyMWU5M2I1ZDE0NjljZDA3YzUzNjI1ZmZkMDM5ZWY0OC56aXAnLFxuICAgICAgJ2Nkay5vdXQnLFxuICAgICAgJ21hbmlmZXN0Lmpzb24nLFxuICAgICAgJ3N0YWNrLnRlbXBsYXRlLmpzb24nLFxuICAgICAgJ3RyZWUuanNvbicsXG4gICAgXSk7XG4gICAgZXhwZWN0KGZzLnJlYWRkaXJTeW5jKHBhdGguam9pbihhc3NlbWJseS5kaXJlY3RvcnksICdhc3NldC5mNDMxNDhjNjExNzRmNDQ0OTI1MjMxYjU4NDliNDY4ZjIxZTkzYjVkMTQ2OWNkMDdjNTM2MjVmZmQwMzllZjQ4JykpKS50b0VxdWFsKFtcbiAgICAgICd0ZXN0LnppcCcsIC8vIGJ1bmRsZSBkaXIgd2l0aCBcInRvdWNoZWRcIiBidW5kbGVkIG91dHB1dCBmaWxlXG4gICAgXSk7XG4gICAgZXhwZWN0KHN0YWdpbmcucGFja2FnaW5nKS50b0VxdWFsKEZpbGVBc3NldFBhY2thZ2luZy5GSUxFKTtcbiAgICBleHBlY3Qoc3RhZ2luZy5pc0FyY2hpdmUpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1bmRsaW5nIHRoYXQgcHJvZHVjZXMgYSBzaW5nbGUgYXJjaGl2ZSBmaWxlIHdpdGggZGlzayBjYWNoZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IFRFU1RfT1VURElSID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2Nkay5vdXQnKTtcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhURVNUX09VVERJUikpIHtcbiAgICAgIGZzLnJlbW92ZVN5bmMoVEVTVF9PVVRESVIpO1xuICAgIH1cblxuICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcycsICdmaXh0dXJlcycsICd0ZXN0MScpO1xuXG4gICAgY29uc3QgYXBwMSA9IG5ldyBBcHAoeyBvdXRkaXI6IFRFU1RfT1VURElSIH0pO1xuICAgIGNvbnN0IHN0YWNrMSA9IG5ldyBTdGFjayhhcHAxLCAnU3RhY2snKTtcblxuICAgIGNvbnN0IGFwcDIgPSBuZXcgQXBwKHsgb3V0ZGlyOiBURVNUX09VVERJUiB9KTsgLy8gc2FtZSBPVVRESVJcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwMiwgJ3N0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc3RhZ2luZzEgPSBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrMSwgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5TSU5HTEVfQVJDSElWRV0sXG4gICAgICAgIG91dHB1dFR5cGU6IEJ1bmRsaW5nT3V0cHV0LkFSQ0hJVkVELFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIE5vdyBjbGVhciBhc3NldCBoYXNoIGNhY2hlIHRvIHNob3cgdGhhdCBkdXJpbmcgdGhlIHNlY29uZCBzdGFnaW5nXG4gICAgLy8gZXZlbiB0aG91Z2ggYnVuZGxpbmcgaXMgc2tpcHBlZCBpdCB3aWxsIGNvcnJlY3RseSBiZSBjb25zaWRlcmVkXG4gICAgLy8gYXMgYSBGaWxlQXNzZXRQYWNrYWdpbmcuRklMRS5cbiAgICBBc3NldFN0YWdpbmcuY2xlYXJBc3NldEhhc2hDYWNoZSgpO1xuXG4gICAgY29uc3Qgc3RhZ2luZzIgPSBuZXcgQXNzZXRTdGFnaW5nKHN0YWNrMiwgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5TSU5HTEVfQVJDSElWRV0sXG4gICAgICAgIG91dHB1dFR5cGU6IEJ1bmRsaW5nT3V0cHV0LkFSQ0hJVkVELFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhZ2luZzEucGFja2FnaW5nKS50b0VxdWFsKEZpbGVBc3NldFBhY2thZ2luZy5GSUxFKTtcbiAgICBleHBlY3Qoc3RhZ2luZzEuaXNBcmNoaXZlKS50b0VxdWFsKHRydWUpO1xuICAgIGV4cGVjdChzdGFnaW5nMi5wYWNrYWdpbmcpLnRvRXF1YWwoc3RhZ2luZzEucGFja2FnaW5nKTtcbiAgICBleHBlY3Qoc3RhZ2luZzIuaXNBcmNoaXZlKS50b0VxdWFsKHN0YWdpbmcxLmlzQXJjaGl2ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1bmRsaW5nIHRoYXQgcHJvZHVjZXMgYSBzaW5nbGUgYXJjaGl2ZSBmaWxlIHdpdGggTk9UX0FSQ0hJVkVEJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IGNvbnRleHQ6IHsgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlIH0gfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzdGFnaW5nID0gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5TSU5HTEVfQVJDSElWRV0sXG4gICAgICAgIG91dHB1dFR5cGU6IEJ1bmRsaW5nT3V0cHV0Lk5PVF9BUkNISVZFRCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBleHBlY3QoZnMucmVhZGRpclN5bmMoYXNzZW1ibHkuZGlyZWN0b3J5KSkudG9FcXVhbChbXG4gICAgICAnYXNzZXQuODZlYzA3NzQ2ZTFkODU5MjkwY2ZkOGI5YzY0OGU1ODE1NTU2NDljNzVmNTFmNzQxZjExZTIyY2FiNjc3NWFiYycsXG4gICAgICAnY2RrLm91dCcsXG4gICAgICAnbWFuaWZlc3QuanNvbicsXG4gICAgICAnc3RhY2sudGVtcGxhdGUuanNvbicsXG4gICAgICAndHJlZS5qc29uJyxcbiAgICBdKTtcbiAgICBleHBlY3Qoc3RhZ2luZy5wYWNrYWdpbmcpLnRvRXF1YWwoRmlsZUFzc2V0UGFja2FnaW5nLlpJUF9ESVJFQ1RPUlkpO1xuICAgIGV4cGVjdChzdGFnaW5nLmlzQXJjaGl2ZSkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIHdpdGggQVJDSElWRUQgYW5kIGJ1bmRsaW5nIHRoYXQgZG9lcyBub3QgcHJvZHVjZSBhIHNpbmdsZSBhcmNoaXZlIGZpbGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBleHBlY3QoKCkgPT4gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5NVUxUSVBMRV9GSUxFU10sXG4gICAgICAgIG91dHB1dFR5cGU6IEJ1bmRsaW5nT3V0cHV0LkFSQ0hJVkVELFxuICAgICAgfSxcbiAgICB9KSkudG9UaHJvdygvQnVuZGxpbmcgb3V0cHV0IGRpcmVjdG9yeSBpcyBleHBlY3RlZCB0byBpbmNsdWRlIG9ubHkgYSBzaW5nbGUgYXJjaGl2ZSBmaWxlIHdoZW4gYG91dHB1dGAgaXMgc2V0IHRvIGBBUkNISVZFRGAvKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ3N0YWdpbmcgd2l0aCBkb2NrZXIgY3AnLCAoKSA9PiB7XG4gIGJlZm9yZUFsbCgoKSA9PiB7XG4gICAgLy8gdGhpcyBpcyBhIHdheSB0byBwcm92aWRlIGEgY3VzdG9tIFwiZG9ja2VyXCIgY29tbWFuZCBmb3Igc3RhZ2luZy5cbiAgICBwcm9jZXNzLmVudi5DREtfRE9DS0VSID0gYCR7X19kaXJuYW1lfS9kb2NrZXItc3R1Yi1jcC5zaGA7XG4gIH0pO1xuXG4gIGFmdGVyQWxsKCgpID0+IHtcbiAgICBkZWxldGUgcHJvY2Vzcy5lbnYuQ0RLX0RPQ0tFUjtcbiAgfSk7XG5cbiAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICBBc3NldFN0YWdpbmcuY2xlYXJBc3NldEhhc2hDYWNoZSgpO1xuICAgIGlmIChmcy5leGlzdHNTeW5jKFNUVUJfSU5QVVRfQ1BfRklMRSkpIHtcbiAgICAgIGZzLnVubGlua1N5bmMoU1RVQl9JTlBVVF9DUF9GSUxFKTtcbiAgICB9XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoU1RVQl9JTlBVVF9DUF9DT05DQVRfRklMRSkpIHtcbiAgICAgIGZzLnVubGlua1N5bmMoU1RVQl9JTlBVVF9DUF9DT05DQVRfRklMRSk7XG4gICAgfVxuICAgIHNpbm9uLnJlc3RvcmUoKTtcbiAgfSk7XG5cbiAgdGVzdCgnYnVuZGxpbmcgd2l0aCBkb2NrZXIgaW1hZ2UgY29weSB2YXJpYW50JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCh7IGNvbnRleHQ6IHsgW2N4YXBpLk5FV19TVFlMRV9TVEFDS19TWU5USEVTSVNfQ09OVEVYVF06IGZhbHNlIH0gfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnc3RhY2snKTtcbiAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMnLCAnZml4dHVyZXMnLCAndGVzdDEnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzdGFnaW5nID0gbmV3IEFzc2V0U3RhZ2luZyhzdGFjaywgJ0Fzc2V0Jywge1xuICAgICAgc291cmNlUGF0aDogZGlyZWN0b3J5LFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgaW1hZ2U6IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyksXG4gICAgICAgIGNvbW1hbmQ6IFtEb2NrZXJTdHViQ29tbWFuZC5WT0xVTUVfU0lOR0xFX0FSQ0hJVkVdLFxuICAgICAgICBidW5kbGluZ0ZpbGVBY2Nlc3M6IEJ1bmRsaW5nRmlsZUFjY2Vzcy5WT0xVTUVfQ09QWSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBleHBlY3QoZnMucmVhZGRpclN5bmMoYXNzZW1ibHkuZGlyZWN0b3J5KSkudG9FcXVhbChbXG4gICAgICAnYXNzZXQuMGVjMzcxYTIwMjJkMjlkZmQ4M2Y1ZGYxMDRlMGYwMWIzNDIzM2E0ZTNlODM5YzNjNGVjNjIwMDhmMGI5YTBlOCcsIC8vIHRoaXMgaXMgdGhlIGJ1bmRsZSBkaXJcbiAgICAgICdhc3NldC4wZWMzNzFhMjAyMmQyOWRmZDgzZjVkZjEwNGUwZjAxYjM0MjMzYTRlM2U4MzljM2M0ZWM2MjAwOGYwYjlhMGU4LnppcCcsXG4gICAgICAnY2RrLm91dCcsXG4gICAgICAnbWFuaWZlc3QuanNvbicsXG4gICAgICAnc3RhY2sudGVtcGxhdGUuanNvbicsXG4gICAgICAndHJlZS5qc29uJyxcbiAgICBdKTtcbiAgICBleHBlY3QoZnMucmVhZGRpclN5bmMocGF0aC5qb2luKGFzc2VtYmx5LmRpcmVjdG9yeSwgJ2Fzc2V0LjBlYzM3MWEyMDIyZDI5ZGZkODNmNWRmMTA0ZTBmMDFiMzQyMzNhNGUzZTgzOWMzYzRlYzYyMDA4ZjBiOWEwZTgnKSkpLnRvRXF1YWwoW1xuICAgICAgJ3Rlc3QuemlwJywgLy8gYnVuZGxlIGRpciB3aXRoIFwidG91Y2hlZFwiIGJ1bmRsZWQgb3V0cHV0IGZpbGVcbiAgICBdKTtcbiAgICBleHBlY3Qoc3RhZ2luZy5wYWNrYWdpbmcpLnRvRXF1YWwoRmlsZUFzc2V0UGFja2FnaW5nLkZJTEUpO1xuICAgIGV4cGVjdChzdGFnaW5nLmlzQXJjaGl2ZSkudG9FcXVhbCh0cnVlKTtcbiAgICBjb25zdCBkb2NrZXJDYWxsczogc3RyaW5nW10gPSByZWFkRG9ja2VyU3R1YklucHV0Q29uY2F0KFNUVUJfSU5QVVRfQ1BfQ09OQ0FUX0ZJTEUpLnNwbGl0KC9cXHI/XFxuLyk7XG4gICAgZXhwZWN0KGRvY2tlckNhbGxzKS50b0VxdWFsKGV4cGVjdC5hcnJheUNvbnRhaW5pbmcoW1xuICAgICAgZXhwZWN0LnN0cmluZ0NvbnRhaW5pbmcoJ3ZvbHVtZSBjcmVhdGUgYXNzZXRJbnB1dCcpLFxuICAgICAgZXhwZWN0LnN0cmluZ0NvbnRhaW5pbmcoJ3ZvbHVtZSBjcmVhdGUgYXNzZXRPdXRwdXQnKSxcbiAgICAgIGV4cGVjdC5zdHJpbmdNYXRjaGluZygncnVuIC0tbmFtZSBjb3B5Q29udGFpbmVyLiogLXYgL2lucHV0Oi9hc3NldC1pbnB1dCAtdiAvb3V0cHV0Oi9hc3NldC1vdXRwdXQgYWxwaW5lIHNoIC1jIG1rZGlyIC1wIC9hc3NldC1pbnB1dCAmJiBjaG93biAtUiAuKiAvYXNzZXQtb3V0cHV0ICYmIGNob3duIC1SIC4qIC9hc3NldC1pbnB1dCcpLFxuICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKCdjcCAuKmZzL2ZpeHR1cmVzL3Rlc3QxL1xcLiBjb3B5Q29udGFpbmVyLio6L2Fzc2V0LWlucHV0JyksXG4gICAgICBleHBlY3Quc3RyaW5nTWF0Y2hpbmcoJ3J1biAtLXJtIC11IC4qIC0tdm9sdW1lcy1mcm9tIGNvcHlDb250YWluZXIuKiAtdyAvYXNzZXQtaW5wdXQgYWxwaW5lIERPQ0tFUl9TVFVCX1ZPTFVNRV9TSU5HTEVfQVJDSElWRScpLFxuICAgICAgZXhwZWN0LnN0cmluZ01hdGNoaW5nKCdjcCBjb3B5Q29udGFpbmVyLio6L2Fzc2V0LW91dHB1dC9cXC4gLionKSxcbiAgICAgIGV4cGVjdC5zdHJpbmdDb250YWluaW5nKCdybSBjb3B5Q29udGFpbmVyJyksXG4gICAgICBleHBlY3Quc3RyaW5nQ29udGFpbmluZygndm9sdW1lIHJtIGFzc2V0SW5wdXQnKSxcbiAgICAgIGV4cGVjdC5zdHJpbmdDb250YWluaW5nKCd2b2x1bWUgcm0gYXNzZXRPdXRwdXQnKSxcbiAgICBdKSk7XG4gIH0pO1xufSk7XG5cbi8vIFJlYWRzIGEgZG9ja2VyIHN0dWIgYW5kIGNsZWFucyB0aGUgdm9sdW1lIHBhdGhzIG91dCBvZiB0aGUgc3R1Yi5cbmZ1bmN0aW9uIHJlYWRBbmRDbGVhbkRvY2tlclN0dWJJbnB1dChmaWxlOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGZzXG4gICAgLnJlYWRGaWxlU3luYyhmaWxlLCAndXRmLTgnKVxuICAgIC50cmltKClcbiAgICAucmVwbGFjZSgvLXYgKFteOl0rKTpcXC9hc3NldC1pbnB1dC9nLCAnLXYgL2lucHV0Oi9hc3NldC1pbnB1dCcpXG4gICAgLnJlcGxhY2UoLy12IChbXjpdKyk6XFwvYXNzZXQtb3V0cHV0L2csICctdiAvb3V0cHV0Oi9hc3NldC1vdXRwdXQnKTtcbn1cblxuLy8gTGFzdCBkb2NrZXIgaW5wdXQgc2luY2UgbGFzdCB0ZWFyZG93blxuZnVuY3Rpb24gcmVhZERvY2tlclN0dWJJbnB1dChmaWxlPzogc3RyaW5nKSB7XG4gIHJldHVybiByZWFkQW5kQ2xlYW5Eb2NrZXJTdHViSW5wdXQoZmlsZSA/PyBTVFVCX0lOUFVUX0ZJTEUpO1xufVxuLy8gQ29uY2F0ZW5hdGVkIGRvY2tlciBpbnB1dHMgc2luY2UgbGFzdCB0ZWFyZG93blxuZnVuY3Rpb24gcmVhZERvY2tlclN0dWJJbnB1dENvbmNhdChmaWxlPzogc3RyaW5nKSB7XG4gIHJldHVybiByZWFkQW5kQ2xlYW5Eb2NrZXJTdHViSW5wdXQoZmlsZSA/PyBTVFVCX0lOUFVUX0NPTkNBVF9GSUxFKTtcbn1cbiJdfQ==