"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process = require("child_process");
const crypto = require("crypto");
const path = require("path");
const sinon = require("sinon");
const lib_1 = require("../lib");
const dockerCmd = process.env.CDK_DOCKER ?? 'docker';
describe('bundling', () => {
    afterEach(() => {
        sinon.restore();
    });
    test('bundling with image from registry', () => {
        sinon.stub(process, 'platform').value('darwin');
        const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns({
            status: 0,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from('stdout'),
            pid: 123,
            output: ['stdout', 'stderr'],
            signal: null,
        });
        const image = lib_1.DockerImage.fromRegistry('alpine');
        image.run({
            command: ['cool', 'command'],
            environment: {
                VAR1: 'value1',
                VAR2: 'value2',
            },
            volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
            workingDirectory: '/working-directory',
            user: 'user:group',
        });
        expect(spawnSyncStub.calledWith(dockerCmd, [
            'run', '--rm',
            '-u', 'user:group',
            '-v', '/host-path:/container-path:delegated',
            '--env', 'VAR1=value1',
            '--env', 'VAR2=value2',
            '-w', '/working-directory',
            'alpine',
            'cool', 'command',
        ], { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
    });
    test('bundling with image from asset', () => {
        const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns({
            status: 0,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from('stdout'),
            pid: 123,
            output: ['stdout', 'stderr'],
            signal: null,
        });
        const imageHash = '123456abcdef';
        const fingerprintStub = sinon.stub(lib_1.FileSystem, 'fingerprint');
        fingerprintStub.callsFake(() => imageHash);
        const image = lib_1.DockerImage.fromBuild('docker-path', {
            buildArgs: {
                TEST_ARG: 'cdk-test',
            },
        });
        image.run();
        const tagHash = crypto.createHash('sha256').update(JSON.stringify({
            path: 'docker-path',
            buildArgs: {
                TEST_ARG: 'cdk-test',
            },
        })).digest('hex');
        const tag = `cdk-${tagHash}`;
        expect(spawnSyncStub.firstCall.calledWith(dockerCmd, [
            'build', '-t', tag,
            '--build-arg', 'TEST_ARG=cdk-test',
            'docker-path',
        ])).toEqual(true);
        expect(spawnSyncStub.secondCall.calledWith(dockerCmd, [
            'run', '--rm',
            tag,
        ])).toEqual(true);
    });
    test('bundling with image from asset with platform', () => {
        const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns({
            status: 0,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from('stdout'),
            pid: 123,
            output: ['stdout', 'stderr'],
            signal: null,
        });
        const imageHash = '123456abcdef';
        const fingerprintStub = sinon.stub(lib_1.FileSystem, 'fingerprint');
        fingerprintStub.callsFake(() => imageHash);
        const platform = 'linux/someArch99';
        const image = lib_1.DockerImage.fromBuild('docker-path', { platform: platform });
        image.run();
        const tagHash = crypto.createHash('sha256').update(JSON.stringify({
            path: 'docker-path',
            platform,
        })).digest('hex');
        const tag = `cdk-${tagHash}`;
        expect(spawnSyncStub.firstCall.calledWith(dockerCmd, [
            'build', '-t', tag,
            '--platform', platform,
            'docker-path',
        ])).toEqual(true);
        expect(spawnSyncStub.secondCall.calledWith(dockerCmd, [
            'run', '--rm',
            tag,
        ])).toEqual(true);
    });
    test('bundling with image from asset with target stage', () => {
        const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns({
            status: 0,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from('stdout'),
            pid: 123,
            output: ['stdout', 'stderr'],
            signal: null,
        });
        const imageHash = '123456abcdef';
        const fingerprintStub = sinon.stub(lib_1.FileSystem, 'fingerprint');
        fingerprintStub.callsFake(() => imageHash);
        const targetStage = 'i-love-testing';
        const image = lib_1.DockerImage.fromBuild('docker-path', { targetStage: targetStage });
        image.run();
        const tagHash = crypto.createHash('sha256').update(JSON.stringify({
            path: 'docker-path',
            targetStage,
        })).digest('hex');
        const tag = `cdk-${tagHash}`;
        expect(spawnSyncStub.firstCall.calledWith(dockerCmd, [
            'build', '-t', tag,
            '--target', targetStage,
            'docker-path',
        ])).toEqual(true);
        expect(spawnSyncStub.secondCall.calledWith(dockerCmd, [
            'run', '--rm',
            tag,
        ])).toEqual(true);
    });
    test('throws in case of spawnSync error', () => {
        sinon.stub(child_process, 'spawnSync').returns({
            status: 0,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from('stdout'),
            pid: 123,
            output: ['stdout', 'stderr'],
            signal: null,
            error: new Error('UnknownError'),
        });
        const image = lib_1.DockerImage.fromRegistry('alpine');
        expect(() => image.run()).toThrow(/UnknownError/);
    });
    test('throws if status is not 0', () => {
        sinon.stub(child_process, 'spawnSync').returns({
            status: -1,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from('stdout'),
            pid: 123,
            output: ['stdout', 'stderr'],
            signal: null,
        });
        const image = lib_1.DockerImage.fromRegistry('alpine');
        expect(() => image.run()).toThrow(/exited with status -1/);
    });
    test('BundlerDockerImage json is the bundler image name by default', () => {
        const image = lib_1.DockerImage.fromRegistry('alpine');
        expect(image.toJSON()).toEqual('alpine');
    });
    test('BundlerDockerImage json is the bundler image if building an image', () => {
        sinon.stub(child_process, 'spawnSync').returns({
            status: 0,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from('stdout'),
            pid: 123,
            output: ['stdout', 'stderr'],
            signal: null,
        });
        const imageHash = '123456abcdef';
        const fingerprintStub = sinon.stub(lib_1.FileSystem, 'fingerprint');
        fingerprintStub.callsFake(() => imageHash);
        const image = lib_1.DockerImage.fromBuild('docker-path');
        const tagHash = crypto.createHash('sha256').update(JSON.stringify({
            path: 'docker-path',
        })).digest('hex');
        expect(image.image).toEqual(`cdk-${tagHash}`);
        expect(image.toJSON()).toEqual(imageHash);
        expect(fingerprintStub.calledWith('docker-path', sinon.match({ extraHash: JSON.stringify({}) }))).toEqual(true);
    });
    test('custom dockerfile is passed through to docker exec', () => {
        const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns({
            status: 0,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from('sha256:1234567890abcdef'),
            pid: 123,
            output: ['stdout', 'stderr'],
            signal: null,
        });
        const imagePath = path.join(__dirname, 'fs/fixtures/test1');
        lib_1.DockerImage.fromAsset(imagePath, {
            file: 'my-dockerfile',
        });
        expect(spawnSyncStub.calledOnce).toEqual(true);
        const expected = path.join(imagePath, 'my-dockerfile');
        expect(new RegExp(`-f ${expected}`).test(spawnSyncStub.firstCall.args[1]?.join(' ') ?? '')).toEqual(true);
    });
    test('fromAsset', () => {
        sinon.stub(child_process, 'spawnSync').returns({
            status: 0,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from('sha256:1234567890abcdef'),
            pid: 123,
            output: ['stdout', 'stderr'],
            signal: null,
        });
        const imagePath = path.join(__dirname, 'fs/fixtures/test1');
        const image = lib_1.DockerImage.fromAsset(imagePath, {
            file: 'my-dockerfile',
        });
        expect(image).toBeDefined();
        expect(image.image).toBeDefined();
    });
    test('custom entrypoint is passed through to docker exec', () => {
        sinon.stub(process, 'platform').value('darwin');
        const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns({
            status: 0,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from('stdout'),
            pid: 123,
            output: ['stdout', 'stderr'],
            signal: null,
        });
        const image = lib_1.DockerImage.fromRegistry('alpine');
        image.run({
            entrypoint: ['/cool/entrypoint', '--cool-entrypoint-arg'],
            command: ['cool', 'command'],
            environment: {
                VAR1: 'value1',
                VAR2: 'value2',
            },
            volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
            workingDirectory: '/working-directory',
            user: 'user:group',
        });
        expect(spawnSyncStub.calledWith(dockerCmd, [
            'run', '--rm',
            '-u', 'user:group',
            '-v', '/host-path:/container-path:delegated',
            '--env', 'VAR1=value1',
            '--env', 'VAR2=value2',
            '-w', '/working-directory',
            '--entrypoint', '/cool/entrypoint',
            'alpine',
            '--cool-entrypoint-arg',
            'cool', 'command',
        ], { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
    });
    test('cp utility copies from an image', () => {
        // GIVEN
        const containerId = '1234567890abcdef1234567890abcdef';
        const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns({
            status: 0,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from(`${containerId}\n`),
            pid: 123,
            output: ['stdout', 'stderr'],
            signal: null,
        });
        // WHEN
        lib_1.DockerImage.fromRegistry('alpine').cp('/foo/bar', '/baz');
        // THEN
        expect(spawnSyncStub.calledWith(sinon.match.any, ['create', 'alpine'], sinon.match.any)).toEqual(true);
        expect(spawnSyncStub.calledWith(sinon.match.any, ['cp', `${containerId}:/foo/bar`, '/baz'], sinon.match.any)).toEqual(true);
        expect(spawnSyncStub.calledWith(sinon.match.any, ['rm', '-v', containerId])).toEqual(true);
    });
    test('cp utility cleans up after itself', () => {
        // GIVEN
        const containerId = '1234567890abcdef1234567890abcdef';
        const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns({
            status: 0,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from(`${containerId}\n`),
            pid: 123,
            output: ['stdout', 'stderr'],
            signal: null,
        });
        spawnSyncStub.withArgs(sinon.match.any, sinon.match.array.startsWith(['cp']), sinon.match.any)
            .returns({
            status: 1,
            stderr: Buffer.from('it failed for a very good reason'),
            stdout: Buffer.from('stdout'),
            pid: 123,
            output: ['stdout', 'stderr'],
            signal: null,
        });
        // WHEN
        expect(() => {
            lib_1.DockerImage.fromRegistry('alpine').cp('/foo/bar', '/baz');
        }).toThrow(/Failed.*copy/i);
        // THEN
        expect(spawnSyncStub.calledWith(sinon.match.any, ['rm', '-v', containerId])).toEqual(true);
    });
    test('cp utility copies to a temp dir of outputPath is omitted', () => {
        // GIVEN
        const containerId = '1234567890abcdef1234567890abcdef';
        sinon.stub(child_process, 'spawnSync').returns({
            status: 0,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from(`${containerId}\n`),
            pid: 123,
            output: ['stdout', 'stderr'],
            signal: null,
        });
        // WHEN
        const tempPath = lib_1.DockerImage.fromRegistry('alpine').cp('/foo/bar');
        // THEN
        expect(/cdk-docker-cp-/.test(tempPath)).toEqual(true);
    });
    test('adding user provided security-opt', () => {
        // GIVEN
        sinon.stub(process, 'platform').value('darwin');
        const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns({
            status: 0,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from('stdout'),
            pid: 123,
            output: ['stdout', 'stderr'],
            signal: null,
        });
        const image = lib_1.DockerImage.fromRegistry('alpine');
        // GIVEN
        image.run({
            command: ['cool', 'command'],
            environment: {
                VAR1: 'value1',
                VAR2: 'value2',
            },
            securityOpt: 'no-new-privileges',
            volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
            workingDirectory: '/working-directory',
            user: 'user:group',
        });
        expect(spawnSyncStub.calledWith(dockerCmd, [
            'run', '--rm',
            '--security-opt', 'no-new-privileges',
            '-u', 'user:group',
            '-v', '/host-path:/container-path:delegated',
            '--env', 'VAR1=value1',
            '--env', 'VAR2=value2',
            '-w', '/working-directory',
            'alpine',
            'cool', 'command',
        ], { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
    });
    test('adding user provided network options', () => {
        // GIVEN
        sinon.stub(process, 'platform').value('darwin');
        const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns({
            status: 0,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from('stdout'),
            pid: 123,
            output: ['stdout', 'stderr'],
            signal: null,
        });
        const image = lib_1.DockerImage.fromRegistry('alpine');
        // GIVEN
        image.run({
            command: ['cool', 'command'],
            network: 'host',
            volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
            workingDirectory: '/working-directory',
            user: 'user:group',
        });
        expect(spawnSyncStub.calledWith(dockerCmd, [
            'run', '--rm',
            '--network', 'host',
            '-u', 'user:group',
            '-v', '/host-path:/container-path:delegated',
            '-w', '/working-directory',
            'alpine',
            'cool', 'command',
        ], { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
    });
    test('adding user provided docker volume options', () => {
        // GIVEN
        sinon.stub(process, 'platform').value('darwin');
        const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns({
            status: 1,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from('stdout'),
            pid: 123,
            output: ['stdout', 'stderr'],
            signal: null,
        });
        const image = lib_1.DockerImage.fromRegistry('alpine');
        try {
            image.run({
                command: ['cool', 'command'],
                volumesFrom: ['foo', 'bar'],
                volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
                workingDirectory: '/working-directory',
                user: 'user:group',
            });
        }
        catch {
            // We expect this to fail as the test environment will not have the required docker setup for the command to exit successfully
            // nevertheless what we want to check here is that the command was built correctly and triggered
        }
        ;
        expect(spawnSyncStub.calledWith(dockerCmd, [
            'run', '--rm',
            '-u', 'user:group',
            '--volumes-from', 'foo',
            '--volumes-from', 'bar',
            '-v', '/host-path:/container-path:delegated',
            '-w', '/working-directory',
            'alpine',
            'cool', 'command',
        ], { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
    });
    test('ensure selinux docker mount', () => {
        // GIVEN
        sinon.stub(process, 'platform').value('linux');
        const spawnSyncStub = sinon.stub(child_process, 'spawnSync');
        spawnSyncStub.onFirstCall().returns({
            status: 0,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from('stdout'),
            pid: 123,
            output: ['selinuxenable-command', 'stderr'],
            signal: null,
        });
        spawnSyncStub.onSecondCall().returns({
            status: 0,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from('stdout'),
            pid: 124,
            output: ['docker run command', 'stderr'],
            signal: null,
        });
        // WHEN
        const image = lib_1.DockerImage.fromRegistry('alpine');
        image.run({
            command: ['cool', 'command'],
            volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
            workingDirectory: '/working-directory',
            user: 'user:group',
        });
        // THEN
        expect(spawnSyncStub.secondCall.calledWith(dockerCmd, [
            'run', '--rm',
            '-u', 'user:group',
            '-v', '/host-path:/container-path:z,delegated',
            '-w', '/working-directory',
            'alpine',
            'cool', 'command',
        ], { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
    });
    test('ensure selinux docker mount on linux with selinux disabled', () => {
        // GIVEN
        sinon.stub(process, 'platform').value('linux');
        const spawnSyncStub = sinon.stub(child_process, 'spawnSync');
        spawnSyncStub.onFirstCall().returns({
            status: 1,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from('stdout'),
            pid: 123,
            output: ['selinuxenabled output', 'stderr'],
            signal: null,
        });
        spawnSyncStub.onSecondCall().returns({
            status: 0,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from('stdout'),
            pid: 124,
            output: ['docker run command', 'stderr'],
            signal: null,
        });
        // WHEN
        const image = lib_1.DockerImage.fromRegistry('alpine');
        image.run({
            command: ['cool', 'command'],
            volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
            workingDirectory: '/working-directory',
            user: 'user:group',
        });
        // THEN
        expect(spawnSyncStub.secondCall.calledWith(dockerCmd, [
            'run', '--rm',
            '-u', 'user:group',
            '-v', '/host-path:/container-path:delegated',
            '-w', '/working-directory',
            'alpine',
            'cool', 'command',
        ], { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
    });
    test('ensure no selinux docker mount if selinuxenabled isn\'t an available command', () => {
        // GIVEN
        sinon.stub(process, 'platform').value('linux');
        const spawnSyncStub = sinon.stub(child_process, 'spawnSync');
        spawnSyncStub.onFirstCall().returns({
            status: 127,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from('stdout'),
            pid: 123,
            output: ['selinuxenabled output', 'stderr'],
            signal: null,
        });
        spawnSyncStub.onSecondCall().returns({
            status: 0,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from('stdout'),
            pid: 124,
            output: ['docker run command', 'stderr'],
            signal: null,
        });
        // WHEN
        const image = lib_1.DockerImage.fromRegistry('alpine');
        image.run({
            command: ['cool', 'command'],
            volumes: [{ hostPath: '/host-path', containerPath: '/container-path' }],
            workingDirectory: '/working-directory',
            user: 'user:group',
        });
        // THEN
        expect(spawnSyncStub.secondCall.calledWith(dockerCmd, [
            'run', '--rm',
            '-u', 'user:group',
            '-v', '/host-path:/container-path:delegated',
            '-w', '/working-directory',
            'alpine',
            'cool', 'command',
        ], { encoding: 'utf-8', stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
    });
    test('ensure correct Docker CLI arguments are returned', () => {
        // GIVEN
        process.env.TEST_FIXTURE_ENV = 'abc';
        const fromSrc = lib_1.DockerBuildSecret.fromSrc('path.json');
        const fromEnvironment = lib_1.DockerBuildSecret.fromEnvironment('TEST_FIXTURE_ENV');
        // THEN
        expect(fromSrc).toEqual('src=path.json');
        expect(fromEnvironment).toEqual('env=TEST_FIXTURE_ENV');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxpbmcudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJ1bmRsaW5nLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQ0FBK0M7QUFDL0MsaUNBQWlDO0FBQ2pDLDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFDL0IsZ0NBQW9FO0FBRXBFLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLFFBQVEsQ0FBQztBQUVyRCxRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtJQUN4QixTQUFTLENBQUMsR0FBRyxFQUFFO1FBQ2IsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBRWxCLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtRQUM3QyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEQsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ25FLE1BQU0sRUFBRSxDQUFDO1lBQ1QsTUFBTSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQzdCLE1BQU0sRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUM3QixHQUFHLEVBQUUsR0FBRztZQUNSLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUM7WUFDNUIsTUFBTSxFQUFFLElBQUk7U0FDYixDQUFDLENBQUM7UUFFSCxNQUFNLEtBQUssR0FBRyxpQkFBVyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRCxLQUFLLENBQUMsR0FBRyxDQUFDO1lBQ1IsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQztZQUM1QixXQUFXLEVBQUU7Z0JBQ1gsSUFBSSxFQUFF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LENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNoaWxkX3Byb2Nlc3MgZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgKiBhcyBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBzaW5vbiBmcm9tICdzaW5vbic7XG5pbXBvcnQgeyBEb2NrZXJCdWlsZFNlY3JldCwgRG9ja2VySW1hZ2UsIEZpbGVTeXN0ZW0gfSBmcm9tICcuLi9saWInO1xuXG5jb25zdCBkb2NrZXJDbWQgPSBwcm9jZXNzLmVudi5DREtfRE9DS0VSID8/ICdkb2NrZXInO1xuXG5kZXNjcmliZSgnYnVuZGxpbmcnLCAoKSA9PiB7XG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgc2lub24ucmVzdG9yZSgpO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ2J1bmRsaW5nIHdpdGggaW1hZ2UgZnJvbSByZWdpc3RyeScsICgpID0+IHtcbiAgICBzaW5vbi5zdHViKHByb2Nlc3MsICdwbGF0Zm9ybScpLnZhbHVlKCdkYXJ3aW4nKTtcbiAgICBjb25zdCBzcGF3blN5bmNTdHViID0gc2lub24uc3R1YihjaGlsZF9wcm9jZXNzLCAnc3Bhd25TeW5jJykucmV0dXJucyh7XG4gICAgICBzdGF0dXM6IDAsXG4gICAgICBzdGRlcnI6IEJ1ZmZlci5mcm9tKCdzdGRlcnInKSxcbiAgICAgIHN0ZG91dDogQnVmZmVyLmZyb20oJ3N0ZG91dCcpLFxuICAgICAgcGlkOiAxMjMsXG4gICAgICBvdXRwdXQ6IFsnc3Rkb3V0JywgJ3N0ZGVyciddLFxuICAgICAgc2lnbmFsOiBudWxsLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaW1hZ2UgPSBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpO1xuICAgIGltYWdlLnJ1bih7XG4gICAgICBjb21tYW5kOiBbJ2Nvb2wnLCAnY29tbWFuZCddLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgVkFSMTogJ3ZhbHVlMScsXG4gICAgICAgIFZBUjI6ICd2YWx1ZTInLFxuICAgICAgfSxcbiAgICAgIHZvbHVtZXM6IFt7IGhvc3RQYXRoOiAnL2hvc3QtcGF0aCcsIGNvbnRhaW5lclBhdGg6ICcvY29udGFpbmVyLXBhdGgnIH1dLFxuICAgICAgd29ya2luZ0RpcmVjdG9yeTogJy93b3JraW5nLWRpcmVjdG9yeScsXG4gICAgICB1c2VyOiAndXNlcjpncm91cCcsXG4gICAgfSk7XG5cbiAgICBleHBlY3Qoc3Bhd25TeW5jU3R1Yi5jYWxsZWRXaXRoKGRvY2tlckNtZCwgW1xuICAgICAgJ3J1bicsICctLXJtJyxcbiAgICAgICctdScsICd1c2VyOmdyb3VwJyxcbiAgICAgICctdicsICcvaG9zdC1wYXRoOi9jb250YWluZXItcGF0aDpkZWxlZ2F0ZWQnLFxuICAgICAgJy0tZW52JywgJ1ZBUjE9dmFsdWUxJyxcbiAgICAgICctLWVudicsICdWQVIyPXZhbHVlMicsXG4gICAgICAnLXcnLCAnL3dvcmtpbmctZGlyZWN0b3J5JyxcbiAgICAgICdhbHBpbmUnLFxuICAgICAgJ2Nvb2wnLCAnY29tbWFuZCcsXG4gICAgXSwgeyBlbmNvZGluZzogJ3V0Zi04Jywgc3RkaW86IFsnaWdub3JlJywgcHJvY2Vzcy5zdGRlcnIsICdpbmhlcml0J10gfSkpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1bmRsaW5nIHdpdGggaW1hZ2UgZnJvbSBhc3NldCcsICgpID0+IHtcbiAgICBjb25zdCBzcGF3blN5bmNTdHViID0gc2lub24uc3R1YihjaGlsZF9wcm9jZXNzLCAnc3Bhd25TeW5jJykucmV0dXJucyh7XG4gICAgICBzdGF0dXM6IDAsXG4gICAgICBzdGRlcnI6IEJ1ZmZlci5mcm9tKCdzdGRlcnInKSxcbiAgICAgIHN0ZG91dDogQnVmZmVyLmZyb20oJ3N0ZG91dCcpLFxuICAgICAgcGlkOiAxMjMsXG4gICAgICBvdXRwdXQ6IFsnc3Rkb3V0JywgJ3N0ZGVyciddLFxuICAgICAgc2lnbmFsOiBudWxsLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaW1hZ2VIYXNoID0gJzEyMzQ1NmFiY2RlZic7XG4gICAgY29uc3QgZmluZ2VycHJpbnRTdHViID0gc2lub24uc3R1YihGaWxlU3lzdGVtLCAnZmluZ2VycHJpbnQnKTtcbiAgICBmaW5nZXJwcmludFN0dWIuY2FsbHNGYWtlKCgpID0+IGltYWdlSGFzaCk7XG5cbiAgICBjb25zdCBpbWFnZSA9IERvY2tlckltYWdlLmZyb21CdWlsZCgnZG9ja2VyLXBhdGgnLCB7XG4gICAgICBidWlsZEFyZ3M6IHtcbiAgICAgICAgVEVTVF9BUkc6ICdjZGstdGVzdCcsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGltYWdlLnJ1bigpO1xuXG4gICAgY29uc3QgdGFnSGFzaCA9IGNyeXB0by5jcmVhdGVIYXNoKCdzaGEyNTYnKS51cGRhdGUoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgcGF0aDogJ2RvY2tlci1wYXRoJyxcbiAgICAgIGJ1aWxkQXJnczoge1xuICAgICAgICBURVNUX0FSRzogJ2Nkay10ZXN0JyxcbiAgICAgIH0sXG4gICAgfSkpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgY29uc3QgdGFnID0gYGNkay0ke3RhZ0hhc2h9YDtcblxuICAgIGV4cGVjdChzcGF3blN5bmNTdHViLmZpcnN0Q2FsbC5jYWxsZWRXaXRoKGRvY2tlckNtZCwgW1xuICAgICAgJ2J1aWxkJywgJy10JywgdGFnLFxuICAgICAgJy0tYnVpbGQtYXJnJywgJ1RFU1RfQVJHPWNkay10ZXN0JyxcbiAgICAgICdkb2NrZXItcGF0aCcsXG4gICAgXSkpLnRvRXF1YWwodHJ1ZSk7XG5cbiAgICBleHBlY3Qoc3Bhd25TeW5jU3R1Yi5zZWNvbmRDYWxsLmNhbGxlZFdpdGgoZG9ja2VyQ21kLCBbXG4gICAgICAncnVuJywgJy0tcm0nLFxuICAgICAgdGFnLFxuICAgIF0pKS50b0VxdWFsKHRydWUpO1xuICB9KTtcblxuICB0ZXN0KCdidW5kbGluZyB3aXRoIGltYWdlIGZyb20gYXNzZXQgd2l0aCBwbGF0Zm9ybScsICgpID0+IHtcbiAgICBjb25zdCBzcGF3blN5bmNTdHViID0gc2lub24uc3R1YihjaGlsZF9wcm9jZXNzLCAnc3Bhd25TeW5jJykucmV0dXJucyh7XG4gICAgICBzdGF0dXM6IDAsXG4gICAgICBzdGRlcnI6IEJ1ZmZlci5mcm9tKCdzdGRlcnInKSxcbiAgICAgIHN0ZG91dDogQnVmZmVyLmZyb20oJ3N0ZG91dCcpLFxuICAgICAgcGlkOiAxMjMsXG4gICAgICBvdXRwdXQ6IFsnc3Rkb3V0JywgJ3N0ZGVyciddLFxuICAgICAgc2lnbmFsOiBudWxsLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaW1hZ2VIYXNoID0gJzEyMzQ1NmFiY2RlZic7XG4gICAgY29uc3QgZmluZ2VycHJpbnRTdHViID0gc2lub24uc3R1YihGaWxlU3lzdGVtLCAnZmluZ2VycHJpbnQnKTtcbiAgICBmaW5nZXJwcmludFN0dWIuY2FsbHNGYWtlKCgpID0+IGltYWdlSGFzaCk7XG4gICAgY29uc3QgcGxhdGZvcm0gPSAnbGludXgvc29tZUFyY2g5OSc7XG5cbiAgICBjb25zdCBpbWFnZSA9IERvY2tlckltYWdlLmZyb21CdWlsZCgnZG9ja2VyLXBhdGgnLCB7IHBsYXRmb3JtOiBwbGF0Zm9ybSB9KTtcbiAgICBpbWFnZS5ydW4oKTtcblxuICAgIGNvbnN0IHRhZ0hhc2ggPSBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMjU2JykudXBkYXRlKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHBhdGg6ICdkb2NrZXItcGF0aCcsXG4gICAgICBwbGF0Zm9ybSxcbiAgICB9KSkuZGlnZXN0KCdoZXgnKTtcbiAgICBjb25zdCB0YWcgPSBgY2RrLSR7dGFnSGFzaH1gO1xuXG4gICAgZXhwZWN0KHNwYXduU3luY1N0dWIuZmlyc3RDYWxsLmNhbGxlZFdpdGgoZG9ja2VyQ21kLCBbXG4gICAgICAnYnVpbGQnLCAnLXQnLCB0YWcsXG4gICAgICAnLS1wbGF0Zm9ybScsIHBsYXRmb3JtLFxuICAgICAgJ2RvY2tlci1wYXRoJyxcbiAgICBdKSkudG9FcXVhbCh0cnVlKTtcblxuICAgIGV4cGVjdChzcGF3blN5bmNTdHViLnNlY29uZENhbGwuY2FsbGVkV2l0aChkb2NrZXJDbWQsIFtcbiAgICAgICdydW4nLCAnLS1ybScsXG4gICAgICB0YWcsXG4gICAgXSkpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1bmRsaW5nIHdpdGggaW1hZ2UgZnJvbSBhc3NldCB3aXRoIHRhcmdldCBzdGFnZScsICgpID0+IHtcbiAgICBjb25zdCBzcGF3blN5bmNTdHViID0gc2lub24uc3R1YihjaGlsZF9wcm9jZXNzLCAnc3Bhd25TeW5jJykucmV0dXJucyh7XG4gICAgICBzdGF0dXM6IDAsXG4gICAgICBzdGRlcnI6IEJ1ZmZlci5mcm9tKCdzdGRlcnInKSxcbiAgICAgIHN0ZG91dDogQnVmZmVyLmZyb20oJ3N0ZG91dCcpLFxuICAgICAgcGlkOiAxMjMsXG4gICAgICBvdXRwdXQ6IFsnc3Rkb3V0JywgJ3N0ZGVyciddLFxuICAgICAgc2lnbmFsOiBudWxsLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaW1hZ2VIYXNoID0gJzEyMzQ1NmFiY2RlZic7XG4gICAgY29uc3QgZmluZ2VycHJpbnRTdHViID0gc2lub24uc3R1YihGaWxlU3lzdGVtLCAnZmluZ2VycHJpbnQnKTtcbiAgICBmaW5nZXJwcmludFN0dWIuY2FsbHNGYWtlKCgpID0+IGltYWdlSGFzaCk7XG4gICAgY29uc3QgdGFyZ2V0U3RhZ2UgPSAnaS1sb3ZlLXRlc3RpbmcnO1xuXG4gICAgY29uc3QgaW1hZ2UgPSBEb2NrZXJJbWFnZS5mcm9tQnVpbGQoJ2RvY2tlci1wYXRoJywgeyB0YXJnZXRTdGFnZTogdGFyZ2V0U3RhZ2UgfSk7XG4gICAgaW1hZ2UucnVuKCk7XG5cbiAgICBjb25zdCB0YWdIYXNoID0gY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTI1NicpLnVwZGF0ZShKU09OLnN0cmluZ2lmeSh7XG4gICAgICBwYXRoOiAnZG9ja2VyLXBhdGgnLFxuICAgICAgdGFyZ2V0U3RhZ2UsXG4gICAgfSkpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgY29uc3QgdGFnID0gYGNkay0ke3RhZ0hhc2h9YDtcblxuICAgIGV4cGVjdChzcGF3blN5bmNTdHViLmZpcnN0Q2FsbC5jYWxsZWRXaXRoKGRvY2tlckNtZCwgW1xuICAgICAgJ2J1aWxkJywgJy10JywgdGFnLFxuICAgICAgJy0tdGFyZ2V0JywgdGFyZ2V0U3RhZ2UsXG4gICAgICAnZG9ja2VyLXBhdGgnLFxuICAgIF0pKS50b0VxdWFsKHRydWUpO1xuXG4gICAgZXhwZWN0KHNwYXduU3luY1N0dWIuc2Vjb25kQ2FsbC5jYWxsZWRXaXRoKGRvY2tlckNtZCwgW1xuICAgICAgJ3J1bicsICctLXJtJyxcbiAgICAgIHRhZyxcbiAgICBdKSkudG9FcXVhbCh0cnVlKTtcblxuICB9KTtcblxuXG4gIHRlc3QoJ3Rocm93cyBpbiBjYXNlIG9mIHNwYXduU3luYyBlcnJvcicsICgpID0+IHtcbiAgICBzaW5vbi5zdHViKGNoaWxkX3Byb2Nlc3MsICdzcGF3blN5bmMnKS5yZXR1cm5zKHtcbiAgICAgIHN0YXR1czogMCxcbiAgICAgIHN0ZGVycjogQnVmZmVyLmZyb20oJ3N0ZGVycicpLFxuICAgICAgc3Rkb3V0OiBCdWZmZXIuZnJvbSgnc3Rkb3V0JyksXG4gICAgICBwaWQ6IDEyMyxcbiAgICAgIG91dHB1dDogWydzdGRvdXQnLCAnc3RkZXJyJ10sXG4gICAgICBzaWduYWw6IG51bGwsXG4gICAgICBlcnJvcjogbmV3IEVycm9yKCdVbmtub3duRXJyb3InKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGltYWdlID0gRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKTtcbiAgICBleHBlY3QoKCkgPT4gaW1hZ2UucnVuKCkpLnRvVGhyb3coL1Vua25vd25FcnJvci8pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3MgaWYgc3RhdHVzIGlzIG5vdCAwJywgKCkgPT4ge1xuICAgIHNpbm9uLnN0dWIoY2hpbGRfcHJvY2VzcywgJ3NwYXduU3luYycpLnJldHVybnMoe1xuICAgICAgc3RhdHVzOiAtMSxcbiAgICAgIHN0ZGVycjogQnVmZmVyLmZyb20oJ3N0ZGVycicpLFxuICAgICAgc3Rkb3V0OiBCdWZmZXIuZnJvbSgnc3Rkb3V0JyksXG4gICAgICBwaWQ6IDEyMyxcbiAgICAgIG91dHB1dDogWydzdGRvdXQnLCAnc3RkZXJyJ10sXG4gICAgICBzaWduYWw6IG51bGwsXG4gICAgfSk7XG5cbiAgICBjb25zdCBpbWFnZSA9IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyk7XG4gICAgZXhwZWN0KCgpID0+IGltYWdlLnJ1bigpKS50b1Rocm93KC9leGl0ZWQgd2l0aCBzdGF0dXMgLTEvKTtcbiAgfSk7XG5cbiAgdGVzdCgnQnVuZGxlckRvY2tlckltYWdlIGpzb24gaXMgdGhlIGJ1bmRsZXIgaW1hZ2UgbmFtZSBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgIGNvbnN0IGltYWdlID0gRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKTtcblxuICAgIGV4cGVjdChpbWFnZS50b0pTT04oKSkudG9FcXVhbCgnYWxwaW5lJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ0J1bmRsZXJEb2NrZXJJbWFnZSBqc29uIGlzIHRoZSBidW5kbGVyIGltYWdlIGlmIGJ1aWxkaW5nIGFuIGltYWdlJywgKCkgPT4ge1xuICAgIHNpbm9uLnN0dWIoY2hpbGRfcHJvY2VzcywgJ3NwYXduU3luYycpLnJldHVybnMoe1xuICAgICAgc3RhdHVzOiAwLFxuICAgICAgc3RkZXJyOiBCdWZmZXIuZnJvbSgnc3RkZXJyJyksXG4gICAgICBzdGRvdXQ6IEJ1ZmZlci5mcm9tKCdzdGRvdXQnKSxcbiAgICAgIHBpZDogMTIzLFxuICAgICAgb3V0cHV0OiBbJ3N0ZG91dCcsICdzdGRlcnInXSxcbiAgICAgIHNpZ25hbDogbnVsbCxcbiAgICB9KTtcbiAgICBjb25zdCBpbWFnZUhhc2ggPSAnMTIzNDU2YWJjZGVmJztcbiAgICBjb25zdCBmaW5nZXJwcmludFN0dWIgPSBzaW5vbi5zdHViKEZpbGVTeXN0ZW0sICdmaW5nZXJwcmludCcpO1xuICAgIGZpbmdlcnByaW50U3R1Yi5jYWxsc0Zha2UoKCkgPT4gaW1hZ2VIYXNoKTtcblxuICAgIGNvbnN0IGltYWdlID0gRG9ja2VySW1hZ2UuZnJvbUJ1aWxkKCdkb2NrZXItcGF0aCcpO1xuXG4gICAgY29uc3QgdGFnSGFzaCA9IGNyeXB0by5jcmVhdGVIYXNoKCdzaGEyNTYnKS51cGRhdGUoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgcGF0aDogJ2RvY2tlci1wYXRoJyxcbiAgICB9KSkuZGlnZXN0KCdoZXgnKTtcblxuICAgIGV4cGVjdChpbWFnZS5pbWFnZSkudG9FcXVhbChgY2RrLSR7dGFnSGFzaH1gKTtcbiAgICBleHBlY3QoaW1hZ2UudG9KU09OKCkpLnRvRXF1YWwoaW1hZ2VIYXNoKTtcbiAgICBleHBlY3QoZmluZ2VycHJpbnRTdHViLmNhbGxlZFdpdGgoJ2RvY2tlci1wYXRoJywgc2lub24ubWF0Y2goeyBleHRyYUhhc2g6IEpTT04uc3RyaW5naWZ5KHt9KSB9KSkpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2N1c3RvbSBkb2NrZXJmaWxlIGlzIHBhc3NlZCB0aHJvdWdoIHRvIGRvY2tlciBleGVjJywgKCkgPT4ge1xuICAgIGNvbnN0IHNwYXduU3luY1N0dWIgPSBzaW5vbi5zdHViKGNoaWxkX3Byb2Nlc3MsICdzcGF3blN5bmMnKS5yZXR1cm5zKHtcbiAgICAgIHN0YXR1czogMCxcbiAgICAgIHN0ZGVycjogQnVmZmVyLmZyb20oJ3N0ZGVycicpLFxuICAgICAgc3Rkb3V0OiBCdWZmZXIuZnJvbSgnc2hhMjU2OjEyMzQ1Njc4OTBhYmNkZWYnKSxcbiAgICAgIHBpZDogMTIzLFxuICAgICAgb3V0cHV0OiBbJ3N0ZG91dCcsICdzdGRlcnInXSxcbiAgICAgIHNpZ25hbDogbnVsbCxcbiAgICB9KTtcblxuICAgIGNvbnN0IGltYWdlUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmcy9maXh0dXJlcy90ZXN0MScpO1xuICAgIERvY2tlckltYWdlLmZyb21Bc3NldChpbWFnZVBhdGgsIHtcbiAgICAgIGZpbGU6ICdteS1kb2NrZXJmaWxlJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdChzcGF3blN5bmNTdHViLmNhbGxlZE9uY2UpLnRvRXF1YWwodHJ1ZSk7XG4gICAgY29uc3QgZXhwZWN0ZWQgPSBwYXRoLmpvaW4oaW1hZ2VQYXRoLCAnbXktZG9ja2VyZmlsZScpO1xuICAgIGV4cGVjdChuZXcgUmVnRXhwKGAtZiAke2V4cGVjdGVkfWApLnRlc3Qoc3Bhd25TeW5jU3R1Yi5maXJzdENhbGwuYXJnc1sxXT8uam9pbignICcpID8/ICcnKSkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdCgnZnJvbUFzc2V0JywgKCkgPT4ge1xuICAgIHNpbm9uLnN0dWIoY2hpbGRfcHJvY2VzcywgJ3NwYXduU3luYycpLnJldHVybnMoe1xuICAgICAgc3RhdHVzOiAwLFxuICAgICAgc3RkZXJyOiBCdWZmZXIuZnJvbSgnc3RkZXJyJyksXG4gICAgICBzdGRvdXQ6IEJ1ZmZlci5mcm9tKCdzaGEyNTY6MTIzNDU2Nzg5MGFiY2RlZicpLFxuICAgICAgcGlkOiAxMjMsXG4gICAgICBvdXRwdXQ6IFsnc3Rkb3V0JywgJ3N0ZGVyciddLFxuICAgICAgc2lnbmFsOiBudWxsLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaW1hZ2VQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzL2ZpeHR1cmVzL3Rlc3QxJyk7XG4gICAgY29uc3QgaW1hZ2UgPSBEb2NrZXJJbWFnZS5mcm9tQXNzZXQoaW1hZ2VQYXRoLCB7XG4gICAgICBmaWxlOiAnbXktZG9ja2VyZmlsZScsXG4gICAgfSk7XG4gICAgZXhwZWN0KGltYWdlKS50b0JlRGVmaW5lZCgpO1xuICAgIGV4cGVjdChpbWFnZS5pbWFnZSkudG9CZURlZmluZWQoKTtcbiAgfSk7XG5cbiAgdGVzdCgnY3VzdG9tIGVudHJ5cG9pbnQgaXMgcGFzc2VkIHRocm91Z2ggdG8gZG9ja2VyIGV4ZWMnLCAoKSA9PiB7XG4gICAgc2lub24uc3R1Yihwcm9jZXNzLCAncGxhdGZvcm0nKS52YWx1ZSgnZGFyd2luJyk7XG4gICAgY29uc3Qgc3Bhd25TeW5jU3R1YiA9IHNpbm9uLnN0dWIoY2hpbGRfcHJvY2VzcywgJ3NwYXduU3luYycpLnJldHVybnMoe1xuICAgICAgc3RhdHVzOiAwLFxuICAgICAgc3RkZXJyOiBCdWZmZXIuZnJvbSgnc3RkZXJyJyksXG4gICAgICBzdGRvdXQ6IEJ1ZmZlci5mcm9tKCdzdGRvdXQnKSxcbiAgICAgIHBpZDogMTIzLFxuICAgICAgb3V0cHV0OiBbJ3N0ZG91dCcsICdzdGRlcnInXSxcbiAgICAgIHNpZ25hbDogbnVsbCxcbiAgICB9KTtcblxuICAgIGNvbnN0IGltYWdlID0gRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKTtcbiAgICBpbWFnZS5ydW4oe1xuICAgICAgZW50cnlwb2ludDogWycvY29vbC9lbnRyeXBvaW50JywgJy0tY29vbC1lbnRyeXBvaW50LWFyZyddLFxuICAgICAgY29tbWFuZDogWydjb29sJywgJ2NvbW1hbmQnXSxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIFZBUjE6ICd2YWx1ZTEnLFxuICAgICAgICBWQVIyOiAndmFsdWUyJyxcbiAgICAgIH0sXG4gICAgICB2b2x1bWVzOiBbeyBob3N0UGF0aDogJy9ob3N0LXBhdGgnLCBjb250YWluZXJQYXRoOiAnL2NvbnRhaW5lci1wYXRoJyB9XSxcbiAgICAgIHdvcmtpbmdEaXJlY3Rvcnk6ICcvd29ya2luZy1kaXJlY3RvcnknLFxuICAgICAgdXNlcjogJ3VzZXI6Z3JvdXAnLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHNwYXduU3luY1N0dWIuY2FsbGVkV2l0aChkb2NrZXJDbWQsIFtcbiAgICAgICdydW4nLCAnLS1ybScsXG4gICAgICAnLXUnLCAndXNlcjpncm91cCcsXG4gICAgICAnLXYnLCAnL2hvc3QtcGF0aDovY29udGFpbmVyLXBhdGg6ZGVsZWdhdGVkJyxcbiAgICAgICctLWVudicsICdWQVIxPXZhbHVlMScsXG4gICAgICAnLS1lbnYnLCAnVkFSMj12YWx1ZTInLFxuICAgICAgJy13JywgJy93b3JraW5nLWRpcmVjdG9yeScsXG4gICAgICAnLS1lbnRyeXBvaW50JywgJy9jb29sL2VudHJ5cG9pbnQnLFxuICAgICAgJ2FscGluZScsXG4gICAgICAnLS1jb29sLWVudHJ5cG9pbnQtYXJnJyxcbiAgICAgICdjb29sJywgJ2NvbW1hbmQnLFxuICAgIF0sIHsgZW5jb2Rpbmc6ICd1dGYtOCcsIHN0ZGlvOiBbJ2lnbm9yZScsIHByb2Nlc3Muc3RkZXJyLCAnaW5oZXJpdCddIH0pKS50b0VxdWFsKHRydWUpO1xuICB9KTtcblxuICB0ZXN0KCdjcCB1dGlsaXR5IGNvcGllcyBmcm9tIGFuIGltYWdlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgY29udGFpbmVySWQgPSAnMTIzNDU2Nzg5MGFiY2RlZjEyMzQ1Njc4OTBhYmNkZWYnO1xuICAgIGNvbnN0IHNwYXduU3luY1N0dWIgPSBzaW5vbi5zdHViKGNoaWxkX3Byb2Nlc3MsICdzcGF3blN5bmMnKS5yZXR1cm5zKHtcbiAgICAgIHN0YXR1czogMCxcbiAgICAgIHN0ZGVycjogQnVmZmVyLmZyb20oJ3N0ZGVycicpLFxuICAgICAgc3Rkb3V0OiBCdWZmZXIuZnJvbShgJHtjb250YWluZXJJZH1cXG5gKSxcbiAgICAgIHBpZDogMTIzLFxuICAgICAgb3V0cHV0OiBbJ3N0ZG91dCcsICdzdGRlcnInXSxcbiAgICAgIHNpZ25hbDogbnVsbCxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpLmNwKCcvZm9vL2JhcicsICcvYmF6Jyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHNwYXduU3luY1N0dWIuY2FsbGVkV2l0aChzaW5vbi5tYXRjaC5hbnksIFsnY3JlYXRlJywgJ2FscGluZSddLCBzaW5vbi5tYXRjaC5hbnkpKS50b0VxdWFsKHRydWUpO1xuICAgIGV4cGVjdChzcGF3blN5bmNTdHViLmNhbGxlZFdpdGgoc2lub24ubWF0Y2guYW55LCBbJ2NwJywgYCR7Y29udGFpbmVySWR9Oi9mb28vYmFyYCwgJy9iYXonXSwgc2lub24ubWF0Y2guYW55KSkudG9FcXVhbCh0cnVlKTtcbiAgICBleHBlY3Qoc3Bhd25TeW5jU3R1Yi5jYWxsZWRXaXRoKHNpbm9uLm1hdGNoLmFueSwgWydybScsICctdicsIGNvbnRhaW5lcklkXSkpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NwIHV0aWxpdHkgY2xlYW5zIHVwIGFmdGVyIGl0c2VsZicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGNvbnRhaW5lcklkID0gJzEyMzQ1Njc4OTBhYmNkZWYxMjM0NTY3ODkwYWJjZGVmJztcbiAgICBjb25zdCBzcGF3blN5bmNTdHViID0gc2lub24uc3R1YihjaGlsZF9wcm9jZXNzLCAnc3Bhd25TeW5jJykucmV0dXJucyh7XG4gICAgICBzdGF0dXM6IDAsXG4gICAgICBzdGRlcnI6IEJ1ZmZlci5mcm9tKCdzdGRlcnInKSxcbiAgICAgIHN0ZG91dDogQnVmZmVyLmZyb20oYCR7Y29udGFpbmVySWR9XFxuYCksXG4gICAgICBwaWQ6IDEyMyxcbiAgICAgIG91dHB1dDogWydzdGRvdXQnLCAnc3RkZXJyJ10sXG4gICAgICBzaWduYWw6IG51bGwsXG4gICAgfSk7XG5cbiAgICBzcGF3blN5bmNTdHViLndpdGhBcmdzKHNpbm9uLm1hdGNoLmFueSwgc2lub24ubWF0Y2guYXJyYXkuc3RhcnRzV2l0aChbJ2NwJ10pLCBzaW5vbi5tYXRjaC5hbnkpXG4gICAgICAucmV0dXJucyh7XG4gICAgICAgIHN0YXR1czogMSxcbiAgICAgICAgc3RkZXJyOiBCdWZmZXIuZnJvbSgnaXQgZmFpbGVkIGZvciBhIHZlcnkgZ29vZCByZWFzb24nKSxcbiAgICAgICAgc3Rkb3V0OiBCdWZmZXIuZnJvbSgnc3Rkb3V0JyksXG4gICAgICAgIHBpZDogMTIzLFxuICAgICAgICBvdXRwdXQ6IFsnc3Rkb3V0JywgJ3N0ZGVyciddLFxuICAgICAgICBzaWduYWw6IG51bGwsXG4gICAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKS5jcCgnL2Zvby9iYXInLCAnL2JheicpO1xuICAgIH0pLnRvVGhyb3coL0ZhaWxlZC4qY29weS9pKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3Bhd25TeW5jU3R1Yi5jYWxsZWRXaXRoKHNpbm9uLm1hdGNoLmFueSwgWydybScsICctdicsIGNvbnRhaW5lcklkXSkpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NwIHV0aWxpdHkgY29waWVzIHRvIGEgdGVtcCBkaXIgb2Ygb3V0cHV0UGF0aCBpcyBvbWl0dGVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgY29udGFpbmVySWQgPSAnMTIzNDU2Nzg5MGFiY2RlZjEyMzQ1Njc4OTBhYmNkZWYnO1xuICAgIHNpbm9uLnN0dWIoY2hpbGRfcHJvY2VzcywgJ3NwYXduU3luYycpLnJldHVybnMoe1xuICAgICAgc3RhdHVzOiAwLFxuICAgICAgc3RkZXJyOiBCdWZmZXIuZnJvbSgnc3RkZXJyJyksXG4gICAgICBzdGRvdXQ6IEJ1ZmZlci5mcm9tKGAke2NvbnRhaW5lcklkfVxcbmApLFxuICAgICAgcGlkOiAxMjMsXG4gICAgICBvdXRwdXQ6IFsnc3Rkb3V0JywgJ3N0ZGVyciddLFxuICAgICAgc2lnbmFsOiBudWxsLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHRlbXBQYXRoID0gRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKS5jcCgnL2Zvby9iYXInKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoL2Nkay1kb2NrZXItY3AtLy50ZXN0KHRlbXBQYXRoKSkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkaW5nIHVzZXIgcHJvdmlkZWQgc2VjdXJpdHktb3B0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgc2lub24uc3R1Yihwcm9jZXNzLCAncGxhdGZvcm0nKS52YWx1ZSgnZGFyd2luJyk7XG4gICAgY29uc3Qgc3Bhd25TeW5jU3R1YiA9IHNpbm9uLnN0dWIoY2hpbGRfcHJvY2VzcywgJ3NwYXduU3luYycpLnJldHVybnMoe1xuICAgICAgc3RhdHVzOiAwLFxuICAgICAgc3RkZXJyOiBCdWZmZXIuZnJvbSgnc3RkZXJyJyksXG4gICAgICBzdGRvdXQ6IEJ1ZmZlci5mcm9tKCdzdGRvdXQnKSxcbiAgICAgIHBpZDogMTIzLFxuICAgICAgb3V0cHV0OiBbJ3N0ZG91dCcsICdzdGRlcnInXSxcbiAgICAgIHNpZ25hbDogbnVsbCxcbiAgICB9KTtcbiAgICBjb25zdCBpbWFnZSA9IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyk7XG5cbiAgICAvLyBHSVZFTlxuICAgIGltYWdlLnJ1bih7XG4gICAgICBjb21tYW5kOiBbJ2Nvb2wnLCAnY29tbWFuZCddLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgVkFSMTogJ3ZhbHVlMScsXG4gICAgICAgIFZBUjI6ICd2YWx1ZTInLFxuICAgICAgfSxcbiAgICAgIHNlY3VyaXR5T3B0OiAnbm8tbmV3LXByaXZpbGVnZXMnLFxuICAgICAgdm9sdW1lczogW3sgaG9zdFBhdGg6ICcvaG9zdC1wYXRoJywgY29udGFpbmVyUGF0aDogJy9jb250YWluZXItcGF0aCcgfV0sXG4gICAgICB3b3JraW5nRGlyZWN0b3J5OiAnL3dvcmtpbmctZGlyZWN0b3J5JyxcbiAgICAgIHVzZXI6ICd1c2VyOmdyb3VwJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdChzcGF3blN5bmNTdHViLmNhbGxlZFdpdGgoZG9ja2VyQ21kLCBbXG4gICAgICAncnVuJywgJy0tcm0nLFxuICAgICAgJy0tc2VjdXJpdHktb3B0JywgJ25vLW5ldy1wcml2aWxlZ2VzJyxcbiAgICAgICctdScsICd1c2VyOmdyb3VwJyxcbiAgICAgICctdicsICcvaG9zdC1wYXRoOi9jb250YWluZXItcGF0aDpkZWxlZ2F0ZWQnLFxuICAgICAgJy0tZW52JywgJ1ZBUjE9dmFsdWUxJyxcbiAgICAgICctLWVudicsICdWQVIyPXZhbHVlMicsXG4gICAgICAnLXcnLCAnL3dvcmtpbmctZGlyZWN0b3J5JyxcbiAgICAgICdhbHBpbmUnLFxuICAgICAgJ2Nvb2wnLCAnY29tbWFuZCcsXG4gICAgXSwgeyBlbmNvZGluZzogJ3V0Zi04Jywgc3RkaW86IFsnaWdub3JlJywgcHJvY2Vzcy5zdGRlcnIsICdpbmhlcml0J10gfSkpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZGluZyB1c2VyIHByb3ZpZGVkIG5ldHdvcmsgb3B0aW9ucycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIHNpbm9uLnN0dWIocHJvY2VzcywgJ3BsYXRmb3JtJykudmFsdWUoJ2RhcndpbicpO1xuICAgIGNvbnN0IHNwYXduU3luY1N0dWIgPSBzaW5vbi5zdHViKGNoaWxkX3Byb2Nlc3MsICdzcGF3blN5bmMnKS5yZXR1cm5zKHtcbiAgICAgIHN0YXR1czogMCxcbiAgICAgIHN0ZGVycjogQnVmZmVyLmZyb20oJ3N0ZGVycicpLFxuICAgICAgc3Rkb3V0OiBCdWZmZXIuZnJvbSgnc3Rkb3V0JyksXG4gICAgICBwaWQ6IDEyMyxcbiAgICAgIG91dHB1dDogWydzdGRvdXQnLCAnc3RkZXJyJ10sXG4gICAgICBzaWduYWw6IG51bGwsXG4gICAgfSk7XG4gICAgY29uc3QgaW1hZ2UgPSBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpO1xuXG4gICAgLy8gR0lWRU5cbiAgICBpbWFnZS5ydW4oe1xuICAgICAgY29tbWFuZDogWydjb29sJywgJ2NvbW1hbmQnXSxcbiAgICAgIG5ldHdvcms6ICdob3N0JyxcbiAgICAgIHZvbHVtZXM6IFt7IGhvc3RQYXRoOiAnL2hvc3QtcGF0aCcsIGNvbnRhaW5lclBhdGg6ICcvY29udGFpbmVyLXBhdGgnIH1dLFxuICAgICAgd29ya2luZ0RpcmVjdG9yeTogJy93b3JraW5nLWRpcmVjdG9yeScsXG4gICAgICB1c2VyOiAndXNlcjpncm91cCcsXG4gICAgfSk7XG5cbiAgICBleHBlY3Qoc3Bhd25TeW5jU3R1Yi5jYWxsZWRXaXRoKGRvY2tlckNtZCwgW1xuICAgICAgJ3J1bicsICctLXJtJyxcbiAgICAgICctLW5ldHdvcmsnLCAnaG9zdCcsXG4gICAgICAnLXUnLCAndXNlcjpncm91cCcsXG4gICAgICAnLXYnLCAnL2hvc3QtcGF0aDovY29udGFpbmVyLXBhdGg6ZGVsZWdhdGVkJyxcbiAgICAgICctdycsICcvd29ya2luZy1kaXJlY3RvcnknLFxuICAgICAgJ2FscGluZScsXG4gICAgICAnY29vbCcsICdjb21tYW5kJyxcbiAgICBdLCB7IGVuY29kaW5nOiAndXRmLTgnLCBzdGRpbzogWydpZ25vcmUnLCBwcm9jZXNzLnN0ZGVyciwgJ2luaGVyaXQnXSB9KSkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkaW5nIHVzZXIgcHJvdmlkZWQgZG9ja2VyIHZvbHVtZSBvcHRpb25zJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgc2lub24uc3R1Yihwcm9jZXNzLCAncGxhdGZvcm0nKS52YWx1ZSgnZGFyd2luJyk7XG4gICAgY29uc3Qgc3Bhd25TeW5jU3R1YiA9IHNpbm9uLnN0dWIoY2hpbGRfcHJvY2VzcywgJ3NwYXduU3luYycpLnJldHVybnMoe1xuICAgICAgc3RhdHVzOiAxLFxuICAgICAgc3RkZXJyOiBCdWZmZXIuZnJvbSgnc3RkZXJyJyksXG4gICAgICBzdGRvdXQ6IEJ1ZmZlci5mcm9tKCdzdGRvdXQnKSxcbiAgICAgIHBpZDogMTIzLFxuICAgICAgb3V0cHV0OiBbJ3N0ZG91dCcsICdzdGRlcnInXSxcbiAgICAgIHNpZ25hbDogbnVsbCxcbiAgICB9KTtcbiAgICBjb25zdCBpbWFnZSA9IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyk7XG5cbiAgICB0cnkge1xuICAgICAgaW1hZ2UucnVuKHtcbiAgICAgICAgY29tbWFuZDogWydjb29sJywgJ2NvbW1hbmQnXSxcbiAgICAgICAgdm9sdW1lc0Zyb206IFsnZm9vJywgJ2JhciddLFxuICAgICAgICB2b2x1bWVzOiBbeyBob3N0UGF0aDogJy9ob3N0LXBhdGgnLCBjb250YWluZXJQYXRoOiAnL2NvbnRhaW5lci1wYXRoJyB9XSxcbiAgICAgICAgd29ya2luZ0RpcmVjdG9yeTogJy93b3JraW5nLWRpcmVjdG9yeScsXG4gICAgICAgIHVzZXI6ICd1c2VyOmdyb3VwJyxcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gV2UgZXhwZWN0IHRoaXMgdG8gZmFpbCBhcyB0aGUgdGVzdCBlbnZpcm9ubWVudCB3aWxsIG5vdCBoYXZlIHRoZSByZXF1aXJlZCBkb2NrZXIgc2V0dXAgZm9yIHRoZSBjb21tYW5kIHRvIGV4aXQgc3VjY2Vzc2Z1bGx5XG4gICAgICAvLyBuZXZlcnRoZWxlc3Mgd2hhdCB3ZSB3YW50IHRvIGNoZWNrIGhlcmUgaXMgdGhhdCB0aGUgY29tbWFuZCB3YXMgYnVpbHQgY29ycmVjdGx5IGFuZCB0cmlnZ2VyZWRcbiAgICB9O1xuXG4gICAgZXhwZWN0KHNwYXduU3luY1N0dWIuY2FsbGVkV2l0aChkb2NrZXJDbWQsIFtcbiAgICAgICdydW4nLCAnLS1ybScsXG4gICAgICAnLXUnLCAndXNlcjpncm91cCcsXG4gICAgICAnLS12b2x1bWVzLWZyb20nLCAnZm9vJyxcbiAgICAgICctLXZvbHVtZXMtZnJvbScsICdiYXInLFxuICAgICAgJy12JywgJy9ob3N0LXBhdGg6L2NvbnRhaW5lci1wYXRoOmRlbGVnYXRlZCcsXG4gICAgICAnLXcnLCAnL3dvcmtpbmctZGlyZWN0b3J5JyxcbiAgICAgICdhbHBpbmUnLFxuICAgICAgJ2Nvb2wnLCAnY29tbWFuZCcsXG4gICAgXSwgeyBlbmNvZGluZzogJ3V0Zi04Jywgc3RkaW86IFsnaWdub3JlJywgcHJvY2Vzcy5zdGRlcnIsICdpbmhlcml0J10gfSkpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Vuc3VyZSBzZWxpbnV4IGRvY2tlciBtb3VudCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIHNpbm9uLnN0dWIocHJvY2VzcywgJ3BsYXRmb3JtJykudmFsdWUoJ2xpbnV4Jyk7XG4gICAgY29uc3Qgc3Bhd25TeW5jU3R1YiA9IHNpbm9uLnN0dWIoY2hpbGRfcHJvY2VzcywgJ3NwYXduU3luYycpO1xuICAgIHNwYXduU3luY1N0dWIub25GaXJzdENhbGwoKS5yZXR1cm5zKHtcbiAgICAgIHN0YXR1czogMCxcbiAgICAgIHN0ZGVycjogQnVmZmVyLmZyb20oJ3N0ZGVycicpLFxuICAgICAgc3Rkb3V0OiBCdWZmZXIuZnJvbSgnc3Rkb3V0JyksXG4gICAgICBwaWQ6IDEyMyxcbiAgICAgIG91dHB1dDogWydzZWxpbnV4ZW5hYmxlLWNvbW1hbmQnLCAnc3RkZXJyJ10sXG4gICAgICBzaWduYWw6IG51bGwsXG4gICAgfSk7XG4gICAgc3Bhd25TeW5jU3R1Yi5vblNlY29uZENhbGwoKS5yZXR1cm5zKHtcbiAgICAgIHN0YXR1czogMCxcbiAgICAgIHN0ZGVycjogQnVmZmVyLmZyb20oJ3N0ZGVycicpLFxuICAgICAgc3Rkb3V0OiBCdWZmZXIuZnJvbSgnc3Rkb3V0JyksXG4gICAgICBwaWQ6IDEyNCxcbiAgICAgIG91dHB1dDogWydkb2NrZXIgcnVuIGNvbW1hbmQnLCAnc3RkZXJyJ10sXG4gICAgICBzaWduYWw6IG51bGwsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgaW1hZ2UgPSBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpO1xuICAgIGltYWdlLnJ1bih7XG4gICAgICBjb21tYW5kOiBbJ2Nvb2wnLCAnY29tbWFuZCddLFxuICAgICAgdm9sdW1lczogW3sgaG9zdFBhdGg6ICcvaG9zdC1wYXRoJywgY29udGFpbmVyUGF0aDogJy9jb250YWluZXItcGF0aCcgfV0sXG4gICAgICB3b3JraW5nRGlyZWN0b3J5OiAnL3dvcmtpbmctZGlyZWN0b3J5JyxcbiAgICAgIHVzZXI6ICd1c2VyOmdyb3VwJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3Bhd25TeW5jU3R1Yi5zZWNvbmRDYWxsLmNhbGxlZFdpdGgoZG9ja2VyQ21kLCBbXG4gICAgICAncnVuJywgJy0tcm0nLFxuICAgICAgJy11JywgJ3VzZXI6Z3JvdXAnLFxuICAgICAgJy12JywgJy9ob3N0LXBhdGg6L2NvbnRhaW5lci1wYXRoOnosZGVsZWdhdGVkJyxcbiAgICAgICctdycsICcvd29ya2luZy1kaXJlY3RvcnknLFxuICAgICAgJ2FscGluZScsXG4gICAgICAnY29vbCcsICdjb21tYW5kJyxcbiAgICBdLCB7IGVuY29kaW5nOiAndXRmLTgnLCBzdGRpbzogWydpZ25vcmUnLCBwcm9jZXNzLnN0ZGVyciwgJ2luaGVyaXQnXSB9KSkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdCgnZW5zdXJlIHNlbGludXggZG9ja2VyIG1vdW50IG9uIGxpbnV4IHdpdGggc2VsaW51eCBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIHNpbm9uLnN0dWIocHJvY2VzcywgJ3BsYXRmb3JtJykudmFsdWUoJ2xpbnV4Jyk7XG4gICAgY29uc3Qgc3Bhd25TeW5jU3R1YiA9IHNpbm9uLnN0dWIoY2hpbGRfcHJvY2VzcywgJ3NwYXduU3luYycpO1xuICAgIHNwYXduU3luY1N0dWIub25GaXJzdENhbGwoKS5yZXR1cm5zKHtcbiAgICAgIHN0YXR1czogMSxcbiAgICAgIHN0ZGVycjogQnVmZmVyLmZyb20oJ3N0ZGVycicpLFxuICAgICAgc3Rkb3V0OiBCdWZmZXIuZnJvbSgnc3Rkb3V0JyksXG4gICAgICBwaWQ6IDEyMyxcbiAgICAgIG91dHB1dDogWydzZWxpbnV4ZW5hYmxlZCBvdXRwdXQnLCAnc3RkZXJyJ10sXG4gICAgICBzaWduYWw6IG51bGwsXG4gICAgfSk7XG4gICAgc3Bhd25TeW5jU3R1Yi5vblNlY29uZENhbGwoKS5yZXR1cm5zKHtcbiAgICAgIHN0YXR1czogMCxcbiAgICAgIHN0ZGVycjogQnVmZmVyLmZyb20oJ3N0ZGVycicpLFxuICAgICAgc3Rkb3V0OiBCdWZmZXIuZnJvbSgnc3Rkb3V0JyksXG4gICAgICBwaWQ6IDEyNCxcbiAgICAgIG91dHB1dDogWydkb2NrZXIgcnVuIGNvbW1hbmQnLCAnc3RkZXJyJ10sXG4gICAgICBzaWduYWw6IG51bGwsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgaW1hZ2UgPSBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpO1xuICAgIGltYWdlLnJ1bih7XG4gICAgICBjb21tYW5kOiBbJ2Nvb2wnLCAnY29tbWFuZCddLFxuICAgICAgdm9sdW1lczogW3sgaG9zdFBhdGg6ICcvaG9zdC1wYXRoJywgY29udGFpbmVyUGF0aDogJy9jb250YWluZXItcGF0aCcgfV0sXG4gICAgICB3b3JraW5nRGlyZWN0b3J5OiAnL3dvcmtpbmctZGlyZWN0b3J5JyxcbiAgICAgIHVzZXI6ICd1c2VyOmdyb3VwJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3Bhd25TeW5jU3R1Yi5zZWNvbmRDYWxsLmNhbGxlZFdpdGgoZG9ja2VyQ21kLCBbXG4gICAgICAncnVuJywgJy0tcm0nLFxuICAgICAgJy11JywgJ3VzZXI6Z3JvdXAnLFxuICAgICAgJy12JywgJy9ob3N0LXBhdGg6L2NvbnRhaW5lci1wYXRoOmRlbGVnYXRlZCcsXG4gICAgICAnLXcnLCAnL3dvcmtpbmctZGlyZWN0b3J5JyxcbiAgICAgICdhbHBpbmUnLFxuICAgICAgJ2Nvb2wnLCAnY29tbWFuZCcsXG4gICAgXSwgeyBlbmNvZGluZzogJ3V0Zi04Jywgc3RkaW86IFsnaWdub3JlJywgcHJvY2Vzcy5zdGRlcnIsICdpbmhlcml0J10gfSkpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Vuc3VyZSBubyBzZWxpbnV4IGRvY2tlciBtb3VudCBpZiBzZWxpbnV4ZW5hYmxlZCBpc25cXCd0IGFuIGF2YWlsYWJsZSBjb21tYW5kJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgc2lub24uc3R1Yihwcm9jZXNzLCAncGxhdGZvcm0nKS52YWx1ZSgnbGludXgnKTtcbiAgICBjb25zdCBzcGF3blN5bmNTdHViID0gc2lub24uc3R1YihjaGlsZF9wcm9jZXNzLCAnc3Bhd25TeW5jJyk7XG4gICAgc3Bhd25TeW5jU3R1Yi5vbkZpcnN0Q2FsbCgpLnJldHVybnMoe1xuICAgICAgc3RhdHVzOiAxMjcsXG4gICAgICBzdGRlcnI6IEJ1ZmZlci5mcm9tKCdzdGRlcnInKSxcbiAgICAgIHN0ZG91dDogQnVmZmVyLmZyb20oJ3N0ZG91dCcpLFxuICAgICAgcGlkOiAxMjMsXG4gICAgICBvdXRwdXQ6IFsnc2VsaW51eGVuYWJsZWQgb3V0cHV0JywgJ3N0ZGVyciddLFxuICAgICAgc2lnbmFsOiBudWxsLFxuICAgIH0pO1xuICAgIHNwYXduU3luY1N0dWIub25TZWNvbmRDYWxsKCkucmV0dXJucyh7XG4gICAgICBzdGF0dXM6IDAsXG4gICAgICBzdGRlcnI6IEJ1ZmZlci5mcm9tKCdzdGRlcnInKSxcbiAgICAgIHN0ZG91dDogQnVmZmVyLmZyb20oJ3N0ZG91dCcpLFxuICAgICAgcGlkOiAxMjQsXG4gICAgICBvdXRwdXQ6IFsnZG9ja2VyIHJ1biBjb21tYW5kJywgJ3N0ZGVyciddLFxuICAgICAgc2lnbmFsOiBudWxsLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGltYWdlID0gRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKTtcbiAgICBpbWFnZS5ydW4oe1xuICAgICAgY29tbWFuZDogWydjb29sJywgJ2NvbW1hbmQnXSxcbiAgICAgIHZvbHVtZXM6IFt7IGhvc3RQYXRoOiAnL2hvc3QtcGF0aCcsIGNvbnRhaW5lclBhdGg6ICcvY29udGFpbmVyLXBhdGgnIH1dLFxuICAgICAgd29ya2luZ0RpcmVjdG9yeTogJy93b3JraW5nLWRpcmVjdG9yeScsXG4gICAgICB1c2VyOiAndXNlcjpncm91cCcsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHNwYXduU3luY1N0dWIuc2Vjb25kQ2FsbC5jYWxsZWRXaXRoKGRvY2tlckNtZCwgW1xuICAgICAgJ3J1bicsICctLXJtJyxcbiAgICAgICctdScsICd1c2VyOmdyb3VwJyxcbiAgICAgICctdicsICcvaG9zdC1wYXRoOi9jb250YWluZXItcGF0aDpkZWxlZ2F0ZWQnLFxuICAgICAgJy13JywgJy93b3JraW5nLWRpcmVjdG9yeScsXG4gICAgICAnYWxwaW5lJyxcbiAgICAgICdjb29sJywgJ2NvbW1hbmQnLFxuICAgIF0sIHsgZW5jb2Rpbmc6ICd1dGYtOCcsIHN0ZGlvOiBbJ2lnbm9yZScsIHByb2Nlc3Muc3RkZXJyLCAnaW5oZXJpdCddIH0pKS50b0VxdWFsKHRydWUpO1xuICB9KTtcblxuICB0ZXN0KCdlbnN1cmUgY29ycmVjdCBEb2NrZXIgQ0xJIGFyZ3VtZW50cyBhcmUgcmV0dXJuZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBwcm9jZXNzLmVudi5URVNUX0ZJWFRVUkVfRU5WID0gJ2FiYyc7XG4gICAgY29uc3QgZnJvbVNyYyA9IERvY2tlckJ1aWxkU2VjcmV0LmZyb21TcmMoJ3BhdGguanNvbicpO1xuICAgIGNvbnN0IGZyb21FbnZpcm9ubWVudCA9IERvY2tlckJ1aWxkU2VjcmV0LmZyb21FbnZpcm9ubWVudCgnVEVTVF9GSVhUVVJFX0VOVicpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChmcm9tU3JjKS50b0VxdWFsKCdzcmM9cGF0aC5qc29uJyk7XG4gICAgZXhwZWN0KGZyb21FbnZpcm9ubWVudCkudG9FcXVhbCgnZW52PVRFU1RfRklYVFVSRV9FTlYnKTtcbiAgfSk7XG59KTtcbiJdfQ==