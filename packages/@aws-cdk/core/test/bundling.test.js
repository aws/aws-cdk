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
        ], { stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
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
        expect(() => image.run()).toThrow(/\[Status -1\]/);
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
        ], { stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
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
        ], { stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
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
        ], { stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
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
        catch (e) {
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
        ], { stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
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
        ], { stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
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
        ], { stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
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
        ], { stdio: ['ignore', process.stderr, 'inherit'] })).toEqual(true);
    });
    test('ensure correct Docker CLI arguments are returned', () => {
        // GIVEN
        const fromSrc = lib_1.DockerBuildSecret.fromSrc('path.json');
        // THEN
        expect(fromSrc).toEqual('src=path.json');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxpbmcudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJ1bmRsaW5nLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQ0FBK0M7QUFDL0MsaUNBQWlDO0FBQ2pDLDZCQUE2QjtBQUM3QiwrQkFBK0I7QUFDL0IsZ0NBQW9FO0FBRXBFLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLFFBQVEsQ0FBQztBQUVyRCxRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtJQUN4QixTQUFTLENBQUMsR0FBRyxFQUFFO1FBQ2IsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBRWxCLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtRQUM3QyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEQsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ25FLE1BQU0sRUFBRSxDQUFDO1lBQ1QsTUFBTSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQzdCLE1BQU0sRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUM3QixHQUFHLEVBQUUsR0FBRztZQUNSLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUM7WUFDNUIsTUFBTSxFQUFFLElBQUk7U0FDYixDQUFDLENBQUM7UUFFSCxNQUFNLEtBQUssR0FBRyxpQkFBVyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqRCxLQUFLLENBQUMsR0FBRyxDQUFDO1lBQ1IsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQztZQUM1QixXQUFXLEVBQUU7Z0JBQ1gsSUFBSSxFQUFF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QWlCLEVBQUUsQ0FBQztZQUN2RSxnQkFBZ0IsRUFBRSxvQkFBb0I7WUFDdEMsSUFBSSxFQUFFLFlBQVk7U0FDbkIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUU7WUFDcEQsS0FBSyxFQUFFLE1BQU07WUFDYixJQUFJLEVBQUUsWUFBWTtZQUNsQixJQUFJLEVBQUUsc0NBQXNDO1lBQzVDLElBQUksRUFBRSxvQkFBb0I7WUFDMUIsUUFBUTtZQUNSLE1BQU0sRUFBRSxTQUFTO1NBQ2xCLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEUsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsa0RBQWtELEVBQUUsR0FBRyxFQUFFO1FBQzVELFFBQVE7UUFDUixNQUFNLE9BQU8sR0FBRyx1QkFBaUIsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFdkQsT0FBTztRQUNQLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDM0MsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNoaWxkX3Byb2Nlc3MgZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgKiBhcyBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBzaW5vbiBmcm9tICdzaW5vbic7XG5pbXBvcnQgeyBEb2NrZXJCdWlsZFNlY3JldCwgRG9ja2VySW1hZ2UsIEZpbGVTeXN0ZW0gfSBmcm9tICcuLi9saWInO1xuXG5jb25zdCBkb2NrZXJDbWQgPSBwcm9jZXNzLmVudi5DREtfRE9DS0VSID8/ICdkb2NrZXInO1xuXG5kZXNjcmliZSgnYnVuZGxpbmcnLCAoKSA9PiB7XG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgc2lub24ucmVzdG9yZSgpO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ2J1bmRsaW5nIHdpdGggaW1hZ2UgZnJvbSByZWdpc3RyeScsICgpID0+IHtcbiAgICBzaW5vbi5zdHViKHByb2Nlc3MsICdwbGF0Zm9ybScpLnZhbHVlKCdkYXJ3aW4nKTtcbiAgICBjb25zdCBzcGF3blN5bmNTdHViID0gc2lub24uc3R1YihjaGlsZF9wcm9jZXNzLCAnc3Bhd25TeW5jJykucmV0dXJucyh7XG4gICAgICBzdGF0dXM6IDAsXG4gICAgICBzdGRlcnI6IEJ1ZmZlci5mcm9tKCdzdGRlcnInKSxcbiAgICAgIHN0ZG91dDogQnVmZmVyLmZyb20oJ3N0ZG91dCcpLFxuICAgICAgcGlkOiAxMjMsXG4gICAgICBvdXRwdXQ6IFsnc3Rkb3V0JywgJ3N0ZGVyciddLFxuICAgICAgc2lnbmFsOiBudWxsLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaW1hZ2UgPSBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpO1xuICAgIGltYWdlLnJ1bih7XG4gICAgICBjb21tYW5kOiBbJ2Nvb2wnLCAnY29tbWFuZCddLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgVkFSMTogJ3ZhbHVlMScsXG4gICAgICAgIFZBUjI6ICd2YWx1ZTInLFxuICAgICAgfSxcbiAgICAgIHZvbHVtZXM6IFt7IGhvc3RQYXRoOiAnL2hvc3QtcGF0aCcsIGNvbnRhaW5lclBhdGg6ICcvY29udGFpbmVyLXBhdGgnIH1dLFxuICAgICAgd29ya2luZ0RpcmVjdG9yeTogJy93b3JraW5nLWRpcmVjdG9yeScsXG4gICAgICB1c2VyOiAndXNlcjpncm91cCcsXG4gICAgfSk7XG5cbiAgICBleHBlY3Qoc3Bhd25TeW5jU3R1Yi5jYWxsZWRXaXRoKGRvY2tlckNtZCwgW1xuICAgICAgJ3J1bicsICctLXJtJyxcbiAgICAgICctdScsICd1c2VyOmdyb3VwJyxcbiAgICAgICctdicsICcvaG9zdC1wYXRoOi9jb250YWluZXItcGF0aDpkZWxlZ2F0ZWQnLFxuICAgICAgJy0tZW52JywgJ1ZBUjE9dmFsdWUxJyxcbiAgICAgICctLWVudicsICdWQVIyPXZhbHVlMicsXG4gICAgICAnLXcnLCAnL3dvcmtpbmctZGlyZWN0b3J5JyxcbiAgICAgICdhbHBpbmUnLFxuICAgICAgJ2Nvb2wnLCAnY29tbWFuZCcsXG4gICAgXSwgeyBzdGRpbzogWydpZ25vcmUnLCBwcm9jZXNzLnN0ZGVyciwgJ2luaGVyaXQnXSB9KSkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdCgnYnVuZGxpbmcgd2l0aCBpbWFnZSBmcm9tIGFzc2V0JywgKCkgPT4ge1xuICAgIGNvbnN0IHNwYXduU3luY1N0dWIgPSBzaW5vbi5zdHViKGNoaWxkX3Byb2Nlc3MsICdzcGF3blN5bmMnKS5yZXR1cm5zKHtcbiAgICAgIHN0YXR1czogMCxcbiAgICAgIHN0ZGVycjogQnVmZmVyLmZyb20oJ3N0ZGVycicpLFxuICAgICAgc3Rkb3V0OiBCdWZmZXIuZnJvbSgnc3Rkb3V0JyksXG4gICAgICBwaWQ6IDEyMyxcbiAgICAgIG91dHB1dDogWydzdGRvdXQnLCAnc3RkZXJyJ10sXG4gICAgICBzaWduYWw6IG51bGwsXG4gICAgfSk7XG5cbiAgICBjb25zdCBpbWFnZUhhc2ggPSAnMTIzNDU2YWJjZGVmJztcbiAgICBjb25zdCBmaW5nZXJwcmludFN0dWIgPSBzaW5vbi5zdHViKEZpbGVTeXN0ZW0sICdmaW5nZXJwcmludCcpO1xuICAgIGZpbmdlcnByaW50U3R1Yi5jYWxsc0Zha2UoKCkgPT4gaW1hZ2VIYXNoKTtcblxuICAgIGNvbnN0IGltYWdlID0gRG9ja2VySW1hZ2UuZnJvbUJ1aWxkKCdkb2NrZXItcGF0aCcsIHtcbiAgICAgIGJ1aWxkQXJnczoge1xuICAgICAgICBURVNUX0FSRzogJ2Nkay10ZXN0JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgaW1hZ2UucnVuKCk7XG5cbiAgICBjb25zdCB0YWdIYXNoID0gY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTI1NicpLnVwZGF0ZShKU09OLnN0cmluZ2lmeSh7XG4gICAgICBwYXRoOiAnZG9ja2VyLXBhdGgnLFxuICAgICAgYnVpbGRBcmdzOiB7XG4gICAgICAgIFRFU1RfQVJHOiAnY2RrLXRlc3QnLFxuICAgICAgfSxcbiAgICB9KSkuZGlnZXN0KCdoZXgnKTtcbiAgICBjb25zdCB0YWcgPSBgY2RrLSR7dGFnSGFzaH1gO1xuXG4gICAgZXhwZWN0KHNwYXduU3luY1N0dWIuZmlyc3RDYWxsLmNhbGxlZFdpdGgoZG9ja2VyQ21kLCBbXG4gICAgICAnYnVpbGQnLCAnLXQnLCB0YWcsXG4gICAgICAnLS1idWlsZC1hcmcnLCAnVEVTVF9BUkc9Y2RrLXRlc3QnLFxuICAgICAgJ2RvY2tlci1wYXRoJyxcbiAgICBdKSkudG9FcXVhbCh0cnVlKTtcblxuICAgIGV4cGVjdChzcGF3blN5bmNTdHViLnNlY29uZENhbGwuY2FsbGVkV2l0aChkb2NrZXJDbWQsIFtcbiAgICAgICdydW4nLCAnLS1ybScsXG4gICAgICB0YWcsXG4gICAgXSkpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1bmRsaW5nIHdpdGggaW1hZ2UgZnJvbSBhc3NldCB3aXRoIHBsYXRmb3JtJywgKCkgPT4ge1xuICAgIGNvbnN0IHNwYXduU3luY1N0dWIgPSBzaW5vbi5zdHViKGNoaWxkX3Byb2Nlc3MsICdzcGF3blN5bmMnKS5yZXR1cm5zKHtcbiAgICAgIHN0YXR1czogMCxcbiAgICAgIHN0ZGVycjogQnVmZmVyLmZyb20oJ3N0ZGVycicpLFxuICAgICAgc3Rkb3V0OiBCdWZmZXIuZnJvbSgnc3Rkb3V0JyksXG4gICAgICBwaWQ6IDEyMyxcbiAgICAgIG91dHB1dDogWydzdGRvdXQnLCAnc3RkZXJyJ10sXG4gICAgICBzaWduYWw6IG51bGwsXG4gICAgfSk7XG5cbiAgICBjb25zdCBpbWFnZUhhc2ggPSAnMTIzNDU2YWJjZGVmJztcbiAgICBjb25zdCBmaW5nZXJwcmludFN0dWIgPSBzaW5vbi5zdHViKEZpbGVTeXN0ZW0sICdmaW5nZXJwcmludCcpO1xuICAgIGZpbmdlcnByaW50U3R1Yi5jYWxsc0Zha2UoKCkgPT4gaW1hZ2VIYXNoKTtcbiAgICBjb25zdCBwbGF0Zm9ybSA9ICdsaW51eC9zb21lQXJjaDk5JztcblxuICAgIGNvbnN0IGltYWdlID0gRG9ja2VySW1hZ2UuZnJvbUJ1aWxkKCdkb2NrZXItcGF0aCcsIHsgcGxhdGZvcm06IHBsYXRmb3JtIH0pO1xuICAgIGltYWdlLnJ1bigpO1xuXG4gICAgY29uc3QgdGFnSGFzaCA9IGNyeXB0by5jcmVhdGVIYXNoKCdzaGEyNTYnKS51cGRhdGUoSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgcGF0aDogJ2RvY2tlci1wYXRoJyxcbiAgICAgIHBsYXRmb3JtLFxuICAgIH0pKS5kaWdlc3QoJ2hleCcpO1xuICAgIGNvbnN0IHRhZyA9IGBjZGstJHt0YWdIYXNofWA7XG5cbiAgICBleHBlY3Qoc3Bhd25TeW5jU3R1Yi5maXJzdENhbGwuY2FsbGVkV2l0aChkb2NrZXJDbWQsIFtcbiAgICAgICdidWlsZCcsICctdCcsIHRhZyxcbiAgICAgICctLXBsYXRmb3JtJywgcGxhdGZvcm0sXG4gICAgICAnZG9ja2VyLXBhdGgnLFxuICAgIF0pKS50b0VxdWFsKHRydWUpO1xuXG4gICAgZXhwZWN0KHNwYXduU3luY1N0dWIuc2Vjb25kQ2FsbC5jYWxsZWRXaXRoKGRvY2tlckNtZCwgW1xuICAgICAgJ3J1bicsICctLXJtJyxcbiAgICAgIHRhZyxcbiAgICBdKSkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdCgnYnVuZGxpbmcgd2l0aCBpbWFnZSBmcm9tIGFzc2V0IHdpdGggdGFyZ2V0IHN0YWdlJywgKCkgPT4ge1xuICAgIGNvbnN0IHNwYXduU3luY1N0dWIgPSBzaW5vbi5zdHViKGNoaWxkX3Byb2Nlc3MsICdzcGF3blN5bmMnKS5yZXR1cm5zKHtcbiAgICAgIHN0YXR1czogMCxcbiAgICAgIHN0ZGVycjogQnVmZmVyLmZyb20oJ3N0ZGVycicpLFxuICAgICAgc3Rkb3V0OiBCdWZmZXIuZnJvbSgnc3Rkb3V0JyksXG4gICAgICBwaWQ6IDEyMyxcbiAgICAgIG91dHB1dDogWydzdGRvdXQnLCAnc3RkZXJyJ10sXG4gICAgICBzaWduYWw6IG51bGwsXG4gICAgfSk7XG5cbiAgICBjb25zdCBpbWFnZUhhc2ggPSAnMTIzNDU2YWJjZGVmJztcbiAgICBjb25zdCBmaW5nZXJwcmludFN0dWIgPSBzaW5vbi5zdHViKEZpbGVTeXN0ZW0sICdmaW5nZXJwcmludCcpO1xuICAgIGZpbmdlcnByaW50U3R1Yi5jYWxsc0Zha2UoKCkgPT4gaW1hZ2VIYXNoKTtcbiAgICBjb25zdCB0YXJnZXRTdGFnZSA9ICdpLWxvdmUtdGVzdGluZyc7XG5cbiAgICBjb25zdCBpbWFnZSA9IERvY2tlckltYWdlLmZyb21CdWlsZCgnZG9ja2VyLXBhdGgnLCB7IHRhcmdldFN0YWdlOiB0YXJnZXRTdGFnZSB9KTtcbiAgICBpbWFnZS5ydW4oKTtcblxuICAgIGNvbnN0IHRhZ0hhc2ggPSBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMjU2JykudXBkYXRlKEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHBhdGg6ICdkb2NrZXItcGF0aCcsXG4gICAgICB0YXJnZXRTdGFnZSxcbiAgICB9KSkuZGlnZXN0KCdoZXgnKTtcbiAgICBjb25zdCB0YWcgPSBgY2RrLSR7dGFnSGFzaH1gO1xuXG4gICAgZXhwZWN0KHNwYXduU3luY1N0dWIuZmlyc3RDYWxsLmNhbGxlZFdpdGgoZG9ja2VyQ21kLCBbXG4gICAgICAnYnVpbGQnLCAnLXQnLCB0YWcsXG4gICAgICAnLS10YXJnZXQnLCB0YXJnZXRTdGFnZSxcbiAgICAgICdkb2NrZXItcGF0aCcsXG4gICAgXSkpLnRvRXF1YWwodHJ1ZSk7XG5cbiAgICBleHBlY3Qoc3Bhd25TeW5jU3R1Yi5zZWNvbmRDYWxsLmNhbGxlZFdpdGgoZG9ja2VyQ21kLCBbXG4gICAgICAncnVuJywgJy0tcm0nLFxuICAgICAgdGFnLFxuICAgIF0pKS50b0VxdWFsKHRydWUpO1xuXG4gIH0pO1xuXG5cbiAgdGVzdCgndGhyb3dzIGluIGNhc2Ugb2Ygc3Bhd25TeW5jIGVycm9yJywgKCkgPT4ge1xuICAgIHNpbm9uLnN0dWIoY2hpbGRfcHJvY2VzcywgJ3NwYXduU3luYycpLnJldHVybnMoe1xuICAgICAgc3RhdHVzOiAwLFxuICAgICAgc3RkZXJyOiBCdWZmZXIuZnJvbSgnc3RkZXJyJyksXG4gICAgICBzdGRvdXQ6IEJ1ZmZlci5mcm9tKCdzdGRvdXQnKSxcbiAgICAgIHBpZDogMTIzLFxuICAgICAgb3V0cHV0OiBbJ3N0ZG91dCcsICdzdGRlcnInXSxcbiAgICAgIHNpZ25hbDogbnVsbCxcbiAgICAgIGVycm9yOiBuZXcgRXJyb3IoJ1Vua25vd25FcnJvcicpLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaW1hZ2UgPSBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpO1xuICAgIGV4cGVjdCgoKSA9PiBpbWFnZS5ydW4oKSkudG9UaHJvdygvVW5rbm93bkVycm9yLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Rocm93cyBpZiBzdGF0dXMgaXMgbm90IDAnLCAoKSA9PiB7XG4gICAgc2lub24uc3R1YihjaGlsZF9wcm9jZXNzLCAnc3Bhd25TeW5jJykucmV0dXJucyh7XG4gICAgICBzdGF0dXM6IC0xLFxuICAgICAgc3RkZXJyOiBCdWZmZXIuZnJvbSgnc3RkZXJyJyksXG4gICAgICBzdGRvdXQ6IEJ1ZmZlci5mcm9tKCdzdGRvdXQnKSxcbiAgICAgIHBpZDogMTIzLFxuICAgICAgb3V0cHV0OiBbJ3N0ZG91dCcsICdzdGRlcnInXSxcbiAgICAgIHNpZ25hbDogbnVsbCxcbiAgICB9KTtcblxuICAgIGNvbnN0IGltYWdlID0gRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKTtcbiAgICBleHBlY3QoKCkgPT4gaW1hZ2UucnVuKCkpLnRvVGhyb3coL1xcW1N0YXR1cyAtMVxcXS8pO1xuICB9KTtcblxuICB0ZXN0KCdCdW5kbGVyRG9ja2VySW1hZ2UganNvbiBpcyB0aGUgYnVuZGxlciBpbWFnZSBuYW1lIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgY29uc3QgaW1hZ2UgPSBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpO1xuXG4gICAgZXhwZWN0KGltYWdlLnRvSlNPTigpKS50b0VxdWFsKCdhbHBpbmUnKTtcbiAgfSk7XG5cbiAgdGVzdCgnQnVuZGxlckRvY2tlckltYWdlIGpzb24gaXMgdGhlIGJ1bmRsZXIgaW1hZ2UgaWYgYnVpbGRpbmcgYW4gaW1hZ2UnLCAoKSA9PiB7XG4gICAgc2lub24uc3R1YihjaGlsZF9wcm9jZXNzLCAnc3Bhd25TeW5jJykucmV0dXJucyh7XG4gICAgICBzdGF0dXM6IDAsXG4gICAgICBzdGRlcnI6IEJ1ZmZlci5mcm9tKCdzdGRlcnInKSxcbiAgICAgIHN0ZG91dDogQnVmZmVyLmZyb20oJ3N0ZG91dCcpLFxuICAgICAgcGlkOiAxMjMsXG4gICAgICBvdXRwdXQ6IFsnc3Rkb3V0JywgJ3N0ZGVyciddLFxuICAgICAgc2lnbmFsOiBudWxsLFxuICAgIH0pO1xuICAgIGNvbnN0IGltYWdlSGFzaCA9ICcxMjM0NTZhYmNkZWYnO1xuICAgIGNvbnN0IGZpbmdlcnByaW50U3R1YiA9IHNpbm9uLnN0dWIoRmlsZVN5c3RlbSwgJ2ZpbmdlcnByaW50Jyk7XG4gICAgZmluZ2VycHJpbnRTdHViLmNhbGxzRmFrZSgoKSA9PiBpbWFnZUhhc2gpO1xuXG4gICAgY29uc3QgaW1hZ2UgPSBEb2NrZXJJbWFnZS5mcm9tQnVpbGQoJ2RvY2tlci1wYXRoJyk7XG5cbiAgICBjb25zdCB0YWdIYXNoID0gY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTI1NicpLnVwZGF0ZShKU09OLnN0cmluZ2lmeSh7XG4gICAgICBwYXRoOiAnZG9ja2VyLXBhdGgnLFxuICAgIH0pKS5kaWdlc3QoJ2hleCcpO1xuXG4gICAgZXhwZWN0KGltYWdlLmltYWdlKS50b0VxdWFsKGBjZGstJHt0YWdIYXNofWApO1xuICAgIGV4cGVjdChpbWFnZS50b0pTT04oKSkudG9FcXVhbChpbWFnZUhhc2gpO1xuICAgIGV4cGVjdChmaW5nZXJwcmludFN0dWIuY2FsbGVkV2l0aCgnZG9ja2VyLXBhdGgnLCBzaW5vbi5tYXRjaCh7IGV4dHJhSGFzaDogSlNPTi5zdHJpbmdpZnkoe30pIH0pKSkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdCgnY3VzdG9tIGRvY2tlcmZpbGUgaXMgcGFzc2VkIHRocm91Z2ggdG8gZG9ja2VyIGV4ZWMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3Bhd25TeW5jU3R1YiA9IHNpbm9uLnN0dWIoY2hpbGRfcHJvY2VzcywgJ3NwYXduU3luYycpLnJldHVybnMoe1xuICAgICAgc3RhdHVzOiAwLFxuICAgICAgc3RkZXJyOiBCdWZmZXIuZnJvbSgnc3RkZXJyJyksXG4gICAgICBzdGRvdXQ6IEJ1ZmZlci5mcm9tKCdzaGEyNTY6MTIzNDU2Nzg5MGFiY2RlZicpLFxuICAgICAgcGlkOiAxMjMsXG4gICAgICBvdXRwdXQ6IFsnc3Rkb3V0JywgJ3N0ZGVyciddLFxuICAgICAgc2lnbmFsOiBudWxsLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaW1hZ2VQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZzL2ZpeHR1cmVzL3Rlc3QxJyk7XG4gICAgRG9ja2VySW1hZ2UuZnJvbUFzc2V0KGltYWdlUGF0aCwge1xuICAgICAgZmlsZTogJ215LWRvY2tlcmZpbGUnLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHNwYXduU3luY1N0dWIuY2FsbGVkT25jZSkudG9FcXVhbCh0cnVlKTtcbiAgICBjb25zdCBleHBlY3RlZCA9IHBhdGguam9pbihpbWFnZVBhdGgsICdteS1kb2NrZXJmaWxlJyk7XG4gICAgZXhwZWN0KG5ldyBSZWdFeHAoYC1mICR7ZXhwZWN0ZWR9YCkudGVzdChzcGF3blN5bmNTdHViLmZpcnN0Q2FsbC5hcmdzWzFdPy5qb2luKCcgJykgPz8gJycpKS50b0VxdWFsKHRydWUpO1xuICB9KTtcblxuICB0ZXN0KCdmcm9tQXNzZXQnLCAoKSA9PiB7XG4gICAgc2lub24uc3R1YihjaGlsZF9wcm9jZXNzLCAnc3Bhd25TeW5jJykucmV0dXJucyh7XG4gICAgICBzdGF0dXM6IDAsXG4gICAgICBzdGRlcnI6IEJ1ZmZlci5mcm9tKCdzdGRlcnInKSxcbiAgICAgIHN0ZG91dDogQnVmZmVyLmZyb20oJ3NoYTI1NjoxMjM0NTY3ODkwYWJjZGVmJyksXG4gICAgICBwaWQ6IDEyMyxcbiAgICAgIG91dHB1dDogWydzdGRvdXQnLCAnc3RkZXJyJ10sXG4gICAgICBzaWduYWw6IG51bGwsXG4gICAgfSk7XG5cbiAgICBjb25zdCBpbWFnZVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZnMvZml4dHVyZXMvdGVzdDEnKTtcbiAgICBjb25zdCBpbWFnZSA9IERvY2tlckltYWdlLmZyb21Bc3NldChpbWFnZVBhdGgsIHtcbiAgICAgIGZpbGU6ICdteS1kb2NrZXJmaWxlJyxcbiAgICB9KTtcbiAgICBleHBlY3QoaW1hZ2UpLnRvQmVEZWZpbmVkKCk7XG4gICAgZXhwZWN0KGltYWdlLmltYWdlKS50b0JlRGVmaW5lZCgpO1xuICB9KTtcblxuICB0ZXN0KCdjdXN0b20gZW50cnlwb2ludCBpcyBwYXNzZWQgdGhyb3VnaCB0byBkb2NrZXIgZXhlYycsICgpID0+IHtcbiAgICBzaW5vbi5zdHViKHByb2Nlc3MsICdwbGF0Zm9ybScpLnZhbHVlKCdkYXJ3aW4nKTtcbiAgICBjb25zdCBzcGF3blN5bmNTdHViID0gc2lub24uc3R1YihjaGlsZF9wcm9jZXNzLCAnc3Bhd25TeW5jJykucmV0dXJucyh7XG4gICAgICBzdGF0dXM6IDAsXG4gICAgICBzdGRlcnI6IEJ1ZmZlci5mcm9tKCdzdGRlcnInKSxcbiAgICAgIHN0ZG91dDogQnVmZmVyLmZyb20oJ3N0ZG91dCcpLFxuICAgICAgcGlkOiAxMjMsXG4gICAgICBvdXRwdXQ6IFsnc3Rkb3V0JywgJ3N0ZGVyciddLFxuICAgICAgc2lnbmFsOiBudWxsLFxuICAgIH0pO1xuXG4gICAgY29uc3QgaW1hZ2UgPSBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpO1xuICAgIGltYWdlLnJ1bih7XG4gICAgICBlbnRyeXBvaW50OiBbJy9jb29sL2VudHJ5cG9pbnQnLCAnLS1jb29sLWVudHJ5cG9pbnQtYXJnJ10sXG4gICAgICBjb21tYW5kOiBbJ2Nvb2wnLCAnY29tbWFuZCddLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgVkFSMTogJ3ZhbHVlMScsXG4gICAgICAgIFZBUjI6ICd2YWx1ZTInLFxuICAgICAgfSxcbiAgICAgIHZvbHVtZXM6IFt7IGhvc3RQYXRoOiAnL2hvc3QtcGF0aCcsIGNvbnRhaW5lclBhdGg6ICcvY29udGFpbmVyLXBhdGgnIH1dLFxuICAgICAgd29ya2luZ0RpcmVjdG9yeTogJy93b3JraW5nLWRpcmVjdG9yeScsXG4gICAgICB1c2VyOiAndXNlcjpncm91cCcsXG4gICAgfSk7XG5cbiAgICBleHBlY3Qoc3Bhd25TeW5jU3R1Yi5jYWxsZWRXaXRoKGRvY2tlckNtZCwgW1xuICAgICAgJ3J1bicsICctLXJtJyxcbiAgICAgICctdScsICd1c2VyOmdyb3VwJyxcbiAgICAgICctdicsICcvaG9zdC1wYXRoOi9jb250YWluZXItcGF0aDpkZWxlZ2F0ZWQnLFxuICAgICAgJy0tZW52JywgJ1ZBUjE9dmFsdWUxJyxcbiAgICAgICctLWVudicsICdWQVIyPXZhbHVlMicsXG4gICAgICAnLXcnLCAnL3dvcmtpbmctZGlyZWN0b3J5JyxcbiAgICAgICctLWVudHJ5cG9pbnQnLCAnL2Nvb2wvZW50cnlwb2ludCcsXG4gICAgICAnYWxwaW5lJyxcbiAgICAgICctLWNvb2wtZW50cnlwb2ludC1hcmcnLFxuICAgICAgJ2Nvb2wnLCAnY29tbWFuZCcsXG4gICAgXSwgeyBzdGRpbzogWydpZ25vcmUnLCBwcm9jZXNzLnN0ZGVyciwgJ2luaGVyaXQnXSB9KSkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdCgnY3AgdXRpbGl0eSBjb3BpZXMgZnJvbSBhbiBpbWFnZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGNvbnRhaW5lcklkID0gJzEyMzQ1Njc4OTBhYmNkZWYxMjM0NTY3ODkwYWJjZGVmJztcbiAgICBjb25zdCBzcGF3blN5bmNTdHViID0gc2lub24uc3R1YihjaGlsZF9wcm9jZXNzLCAnc3Bhd25TeW5jJykucmV0dXJucyh7XG4gICAgICBzdGF0dXM6IDAsXG4gICAgICBzdGRlcnI6IEJ1ZmZlci5mcm9tKCdzdGRlcnInKSxcbiAgICAgIHN0ZG91dDogQnVmZmVyLmZyb20oYCR7Y29udGFpbmVySWR9XFxuYCksXG4gICAgICBwaWQ6IDEyMyxcbiAgICAgIG91dHB1dDogWydzdGRvdXQnLCAnc3RkZXJyJ10sXG4gICAgICBzaWduYWw6IG51bGwsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKS5jcCgnL2Zvby9iYXInLCAnL2JheicpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzcGF3blN5bmNTdHViLmNhbGxlZFdpdGgoc2lub24ubWF0Y2guYW55LCBbJ2NyZWF0ZScsICdhbHBpbmUnXSwgc2lub24ubWF0Y2guYW55KSkudG9FcXVhbCh0cnVlKTtcbiAgICBleHBlY3Qoc3Bhd25TeW5jU3R1Yi5jYWxsZWRXaXRoKHNpbm9uLm1hdGNoLmFueSwgWydjcCcsIGAke2NvbnRhaW5lcklkfTovZm9vL2JhcmAsICcvYmF6J10sIHNpbm9uLm1hdGNoLmFueSkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgZXhwZWN0KHNwYXduU3luY1N0dWIuY2FsbGVkV2l0aChzaW5vbi5tYXRjaC5hbnksIFsncm0nLCAnLXYnLCBjb250YWluZXJJZF0pKS50b0VxdWFsKHRydWUpO1xuICB9KTtcblxuICB0ZXN0KCdjcCB1dGlsaXR5IGNsZWFucyB1cCBhZnRlciBpdHNlbGYnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBjb250YWluZXJJZCA9ICcxMjM0NTY3ODkwYWJjZGVmMTIzNDU2Nzg5MGFiY2RlZic7XG4gICAgY29uc3Qgc3Bhd25TeW5jU3R1YiA9IHNpbm9uLnN0dWIoY2hpbGRfcHJvY2VzcywgJ3NwYXduU3luYycpLnJldHVybnMoe1xuICAgICAgc3RhdHVzOiAwLFxuICAgICAgc3RkZXJyOiBCdWZmZXIuZnJvbSgnc3RkZXJyJyksXG4gICAgICBzdGRvdXQ6IEJ1ZmZlci5mcm9tKGAke2NvbnRhaW5lcklkfVxcbmApLFxuICAgICAgcGlkOiAxMjMsXG4gICAgICBvdXRwdXQ6IFsnc3Rkb3V0JywgJ3N0ZGVyciddLFxuICAgICAgc2lnbmFsOiBudWxsLFxuICAgIH0pO1xuXG4gICAgc3Bhd25TeW5jU3R1Yi53aXRoQXJncyhzaW5vbi5tYXRjaC5hbnksIHNpbm9uLm1hdGNoLmFycmF5LnN0YXJ0c1dpdGgoWydjcCddKSwgc2lub24ubWF0Y2guYW55KVxuICAgICAgLnJldHVybnMoe1xuICAgICAgICBzdGF0dXM6IDEsXG4gICAgICAgIHN0ZGVycjogQnVmZmVyLmZyb20oJ2l0IGZhaWxlZCBmb3IgYSB2ZXJ5IGdvb2QgcmVhc29uJyksXG4gICAgICAgIHN0ZG91dDogQnVmZmVyLmZyb20oJ3N0ZG91dCcpLFxuICAgICAgICBwaWQ6IDEyMyxcbiAgICAgICAgb3V0cHV0OiBbJ3N0ZG91dCcsICdzdGRlcnInXSxcbiAgICAgICAgc2lnbmFsOiBudWxsLFxuICAgICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJykuY3AoJy9mb28vYmFyJywgJy9iYXonKTtcbiAgICB9KS50b1Rocm93KC9GYWlsZWQuKmNvcHkvaSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHNwYXduU3luY1N0dWIuY2FsbGVkV2l0aChzaW5vbi5tYXRjaC5hbnksIFsncm0nLCAnLXYnLCBjb250YWluZXJJZF0pKS50b0VxdWFsKHRydWUpO1xuICB9KTtcblxuICB0ZXN0KCdjcCB1dGlsaXR5IGNvcGllcyB0byBhIHRlbXAgZGlyIG9mIG91dHB1dFBhdGggaXMgb21pdHRlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGNvbnRhaW5lcklkID0gJzEyMzQ1Njc4OTBhYmNkZWYxMjM0NTY3ODkwYWJjZGVmJztcbiAgICBzaW5vbi5zdHViKGNoaWxkX3Byb2Nlc3MsICdzcGF3blN5bmMnKS5yZXR1cm5zKHtcbiAgICAgIHN0YXR1czogMCxcbiAgICAgIHN0ZGVycjogQnVmZmVyLmZyb20oJ3N0ZGVycicpLFxuICAgICAgc3Rkb3V0OiBCdWZmZXIuZnJvbShgJHtjb250YWluZXJJZH1cXG5gKSxcbiAgICAgIHBpZDogMTIzLFxuICAgICAgb3V0cHV0OiBbJ3N0ZG91dCcsICdzdGRlcnInXSxcbiAgICAgIHNpZ25hbDogbnVsbCxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB0ZW1wUGF0aCA9IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJykuY3AoJy9mb28vYmFyJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KC9jZGstZG9ja2VyLWNwLS8udGVzdCh0ZW1wUGF0aCkpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZGluZyB1c2VyIHByb3ZpZGVkIHNlY3VyaXR5LW9wdCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIHNpbm9uLnN0dWIocHJvY2VzcywgJ3BsYXRmb3JtJykudmFsdWUoJ2RhcndpbicpO1xuICAgIGNvbnN0IHNwYXduU3luY1N0dWIgPSBzaW5vbi5zdHViKGNoaWxkX3Byb2Nlc3MsICdzcGF3blN5bmMnKS5yZXR1cm5zKHtcbiAgICAgIHN0YXR1czogMCxcbiAgICAgIHN0ZGVycjogQnVmZmVyLmZyb20oJ3N0ZGVycicpLFxuICAgICAgc3Rkb3V0OiBCdWZmZXIuZnJvbSgnc3Rkb3V0JyksXG4gICAgICBwaWQ6IDEyMyxcbiAgICAgIG91dHB1dDogWydzdGRvdXQnLCAnc3RkZXJyJ10sXG4gICAgICBzaWduYWw6IG51bGwsXG4gICAgfSk7XG4gICAgY29uc3QgaW1hZ2UgPSBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpO1xuXG4gICAgLy8gR0lWRU5cbiAgICBpbWFnZS5ydW4oe1xuICAgICAgY29tbWFuZDogWydjb29sJywgJ2NvbW1hbmQnXSxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIFZBUjE6ICd2YWx1ZTEnLFxuICAgICAgICBWQVIyOiAndmFsdWUyJyxcbiAgICAgIH0sXG4gICAgICBzZWN1cml0eU9wdDogJ25vLW5ldy1wcml2aWxlZ2VzJyxcbiAgICAgIHZvbHVtZXM6IFt7IGhvc3RQYXRoOiAnL2hvc3QtcGF0aCcsIGNvbnRhaW5lclBhdGg6ICcvY29udGFpbmVyLXBhdGgnIH1dLFxuICAgICAgd29ya2luZ0RpcmVjdG9yeTogJy93b3JraW5nLWRpcmVjdG9yeScsXG4gICAgICB1c2VyOiAndXNlcjpncm91cCcsXG4gICAgfSk7XG5cbiAgICBleHBlY3Qoc3Bhd25TeW5jU3R1Yi5jYWxsZWRXaXRoKGRvY2tlckNtZCwgW1xuICAgICAgJ3J1bicsICctLXJtJyxcbiAgICAgICctLXNlY3VyaXR5LW9wdCcsICduby1uZXctcHJpdmlsZWdlcycsXG4gICAgICAnLXUnLCAndXNlcjpncm91cCcsXG4gICAgICAnLXYnLCAnL2hvc3QtcGF0aDovY29udGFpbmVyLXBhdGg6ZGVsZWdhdGVkJyxcbiAgICAgICctLWVudicsICdWQVIxPXZhbHVlMScsXG4gICAgICAnLS1lbnYnLCAnVkFSMj12YWx1ZTInLFxuICAgICAgJy13JywgJy93b3JraW5nLWRpcmVjdG9yeScsXG4gICAgICAnYWxwaW5lJyxcbiAgICAgICdjb29sJywgJ2NvbW1hbmQnLFxuICAgIF0sIHsgc3RkaW86IFsnaWdub3JlJywgcHJvY2Vzcy5zdGRlcnIsICdpbmhlcml0J10gfSkpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZGluZyB1c2VyIHByb3ZpZGVkIG5ldHdvcmsgb3B0aW9ucycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIHNpbm9uLnN0dWIocHJvY2VzcywgJ3BsYXRmb3JtJykudmFsdWUoJ2RhcndpbicpO1xuICAgIGNvbnN0IHNwYXduU3luY1N0dWIgPSBzaW5vbi5zdHViKGNoaWxkX3Byb2Nlc3MsICdzcGF3blN5bmMnKS5yZXR1cm5zKHtcbiAgICAgIHN0YXR1czogMCxcbiAgICAgIHN0ZGVycjogQnVmZmVyLmZyb20oJ3N0ZGVycicpLFxuICAgICAgc3Rkb3V0OiBCdWZmZXIuZnJvbSgnc3Rkb3V0JyksXG4gICAgICBwaWQ6IDEyMyxcbiAgICAgIG91dHB1dDogWydzdGRvdXQnLCAnc3RkZXJyJ10sXG4gICAgICBzaWduYWw6IG51bGwsXG4gICAgfSk7XG4gICAgY29uc3QgaW1hZ2UgPSBEb2NrZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FscGluZScpO1xuXG4gICAgLy8gR0lWRU5cbiAgICBpbWFnZS5ydW4oe1xuICAgICAgY29tbWFuZDogWydjb29sJywgJ2NvbW1hbmQnXSxcbiAgICAgIG5ldHdvcms6ICdob3N0JyxcbiAgICAgIHZvbHVtZXM6IFt7IGhvc3RQYXRoOiAnL2hvc3QtcGF0aCcsIGNvbnRhaW5lclBhdGg6ICcvY29udGFpbmVyLXBhdGgnIH1dLFxuICAgICAgd29ya2luZ0RpcmVjdG9yeTogJy93b3JraW5nLWRpcmVjdG9yeScsXG4gICAgICB1c2VyOiAndXNlcjpncm91cCcsXG4gICAgfSk7XG5cbiAgICBleHBlY3Qoc3Bhd25TeW5jU3R1Yi5jYWxsZWRXaXRoKGRvY2tlckNtZCwgW1xuICAgICAgJ3J1bicsICctLXJtJyxcbiAgICAgICctLW5ldHdvcmsnLCAnaG9zdCcsXG4gICAgICAnLXUnLCAndXNlcjpncm91cCcsXG4gICAgICAnLXYnLCAnL2hvc3QtcGF0aDovY29udGFpbmVyLXBhdGg6ZGVsZWdhdGVkJyxcbiAgICAgICctdycsICcvd29ya2luZy1kaXJlY3RvcnknLFxuICAgICAgJ2FscGluZScsXG4gICAgICAnY29vbCcsICdjb21tYW5kJyxcbiAgICBdLCB7IHN0ZGlvOiBbJ2lnbm9yZScsIHByb2Nlc3Muc3RkZXJyLCAnaW5oZXJpdCddIH0pKS50b0VxdWFsKHRydWUpO1xuICB9KTtcblxuICB0ZXN0KCdhZGRpbmcgdXNlciBwcm92aWRlZCBkb2NrZXIgdm9sdW1lIG9wdGlvbnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBzaW5vbi5zdHViKHByb2Nlc3MsICdwbGF0Zm9ybScpLnZhbHVlKCdkYXJ3aW4nKTtcbiAgICBjb25zdCBzcGF3blN5bmNTdHViID0gc2lub24uc3R1YihjaGlsZF9wcm9jZXNzLCAnc3Bhd25TeW5jJykucmV0dXJucyh7XG4gICAgICBzdGF0dXM6IDEsXG4gICAgICBzdGRlcnI6IEJ1ZmZlci5mcm9tKCdzdGRlcnInKSxcbiAgICAgIHN0ZG91dDogQnVmZmVyLmZyb20oJ3N0ZG91dCcpLFxuICAgICAgcGlkOiAxMjMsXG4gICAgICBvdXRwdXQ6IFsnc3Rkb3V0JywgJ3N0ZGVyciddLFxuICAgICAgc2lnbmFsOiBudWxsLFxuICAgIH0pO1xuICAgIGNvbnN0IGltYWdlID0gRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKTtcblxuICAgIHRyeSB7XG4gICAgICBpbWFnZS5ydW4oe1xuICAgICAgICBjb21tYW5kOiBbJ2Nvb2wnLCAnY29tbWFuZCddLFxuICAgICAgICB2b2x1bWVzRnJvbTogWydmb28nLCAnYmFyJ10sXG4gICAgICAgIHZvbHVtZXM6IFt7IGhvc3RQYXRoOiAnL2hvc3QtcGF0aCcsIGNvbnRhaW5lclBhdGg6ICcvY29udGFpbmVyLXBhdGgnIH1dLFxuICAgICAgICB3b3JraW5nRGlyZWN0b3J5OiAnL3dvcmtpbmctZGlyZWN0b3J5JyxcbiAgICAgICAgdXNlcjogJ3VzZXI6Z3JvdXAnLFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gV2UgZXhwZWN0IHRoaXMgdG8gZmFpbCBhcyB0aGUgdGVzdCBlbnZpcm9ubWVudCB3aWxsIG5vdCBoYXZlIHRoZSByZXF1aXJlZCBkb2NrZXIgc2V0dXAgZm9yIHRoZSBjb21tYW5kIHRvIGV4aXQgc3VjY2Vzc2Z1bGx5XG4gICAgICAvLyBuZXZlcnRoZWxlc3Mgd2hhdCB3ZSB3YW50IHRvIGNoZWNrIGhlcmUgaXMgdGhhdCB0aGUgY29tbWFuZCB3YXMgYnVpbHQgY29ycmVjdGx5IGFuZCB0cmlnZ2VyZWRcbiAgICB9O1xuXG4gICAgZXhwZWN0KHNwYXduU3luY1N0dWIuY2FsbGVkV2l0aChkb2NrZXJDbWQsIFtcbiAgICAgICdydW4nLCAnLS1ybScsXG4gICAgICAnLXUnLCAndXNlcjpncm91cCcsXG4gICAgICAnLS12b2x1bWVzLWZyb20nLCAnZm9vJyxcbiAgICAgICctLXZvbHVtZXMtZnJvbScsICdiYXInLFxuICAgICAgJy12JywgJy9ob3N0LXBhdGg6L2NvbnRhaW5lci1wYXRoOmRlbGVnYXRlZCcsXG4gICAgICAnLXcnLCAnL3dvcmtpbmctZGlyZWN0b3J5JyxcbiAgICAgICdhbHBpbmUnLFxuICAgICAgJ2Nvb2wnLCAnY29tbWFuZCcsXG4gICAgXSwgeyBzdGRpbzogWydpZ25vcmUnLCBwcm9jZXNzLnN0ZGVyciwgJ2luaGVyaXQnXSB9KSkudG9FcXVhbCh0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdCgnZW5zdXJlIHNlbGludXggZG9ja2VyIG1vdW50JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgc2lub24uc3R1Yihwcm9jZXNzLCAncGxhdGZvcm0nKS52YWx1ZSgnbGludXgnKTtcbiAgICBjb25zdCBzcGF3blN5bmNTdHViID0gc2lub24uc3R1YihjaGlsZF9wcm9jZXNzLCAnc3Bhd25TeW5jJyk7XG4gICAgc3Bhd25TeW5jU3R1Yi5vbkZpcnN0Q2FsbCgpLnJldHVybnMoe1xuICAgICAgc3RhdHVzOiAwLFxuICAgICAgc3RkZXJyOiBCdWZmZXIuZnJvbSgnc3RkZXJyJyksXG4gICAgICBzdGRvdXQ6IEJ1ZmZlci5mcm9tKCdzdGRvdXQnKSxcbiAgICAgIHBpZDogMTIzLFxuICAgICAgb3V0cHV0OiBbJ3NlbGludXhlbmFibGUtY29tbWFuZCcsICdzdGRlcnInXSxcbiAgICAgIHNpZ25hbDogbnVsbCxcbiAgICB9KTtcbiAgICBzcGF3blN5bmNTdHViLm9uU2Vjb25kQ2FsbCgpLnJldHVybnMoe1xuICAgICAgc3RhdHVzOiAwLFxuICAgICAgc3RkZXJyOiBCdWZmZXIuZnJvbSgnc3RkZXJyJyksXG4gICAgICBzdGRvdXQ6IEJ1ZmZlci5mcm9tKCdzdGRvdXQnKSxcbiAgICAgIHBpZDogMTI0LFxuICAgICAgb3V0cHV0OiBbJ2RvY2tlciBydW4gY29tbWFuZCcsICdzdGRlcnInXSxcbiAgICAgIHNpZ25hbDogbnVsbCxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBpbWFnZSA9IERvY2tlckltYWdlLmZyb21SZWdpc3RyeSgnYWxwaW5lJyk7XG4gICAgaW1hZ2UucnVuKHtcbiAgICAgIGNvbW1hbmQ6IFsnY29vbCcsICdjb21tYW5kJ10sXG4gICAgICB2b2x1bWVzOiBbeyBob3N0UGF0aDogJy9ob3N0LXBhdGgnLCBjb250YWluZXJQYXRoOiAnL2NvbnRhaW5lci1wYXRoJyB9XSxcbiAgICAgIHdvcmtpbmdEaXJlY3Rvcnk6ICcvd29ya2luZy1kaXJlY3RvcnknLFxuICAgICAgdXNlcjogJ3VzZXI6Z3JvdXAnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzcGF3blN5bmNTdHViLnNlY29uZENhbGwuY2FsbGVkV2l0aChkb2NrZXJDbWQsIFtcbiAgICAgICdydW4nLCAnLS1ybScsXG4gICAgICAnLXUnLCAndXNlcjpncm91cCcsXG4gICAgICAnLXYnLCAnL2hvc3QtcGF0aDovY29udGFpbmVyLXBhdGg6eixkZWxlZ2F0ZWQnLFxuICAgICAgJy13JywgJy93b3JraW5nLWRpcmVjdG9yeScsXG4gICAgICAnYWxwaW5lJyxcbiAgICAgICdjb29sJywgJ2NvbW1hbmQnLFxuICAgIF0sIHsgc3RkaW86IFsnaWdub3JlJywgcHJvY2Vzcy5zdGRlcnIsICdpbmhlcml0J10gfSkpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Vuc3VyZSBzZWxpbnV4IGRvY2tlciBtb3VudCBvbiBsaW51eCB3aXRoIHNlbGludXggZGlzYWJsZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBzaW5vbi5zdHViKHByb2Nlc3MsICdwbGF0Zm9ybScpLnZhbHVlKCdsaW51eCcpO1xuICAgIGNvbnN0IHNwYXduU3luY1N0dWIgPSBzaW5vbi5zdHViKGNoaWxkX3Byb2Nlc3MsICdzcGF3blN5bmMnKTtcbiAgICBzcGF3blN5bmNTdHViLm9uRmlyc3RDYWxsKCkucmV0dXJucyh7XG4gICAgICBzdGF0dXM6IDEsXG4gICAgICBzdGRlcnI6IEJ1ZmZlci5mcm9tKCdzdGRlcnInKSxcbiAgICAgIHN0ZG91dDogQnVmZmVyLmZyb20oJ3N0ZG91dCcpLFxuICAgICAgcGlkOiAxMjMsXG4gICAgICBvdXRwdXQ6IFsnc2VsaW51eGVuYWJsZWQgb3V0cHV0JywgJ3N0ZGVyciddLFxuICAgICAgc2lnbmFsOiBudWxsLFxuICAgIH0pO1xuICAgIHNwYXduU3luY1N0dWIub25TZWNvbmRDYWxsKCkucmV0dXJucyh7XG4gICAgICBzdGF0dXM6IDAsXG4gICAgICBzdGRlcnI6IEJ1ZmZlci5mcm9tKCdzdGRlcnInKSxcbiAgICAgIHN0ZG91dDogQnVmZmVyLmZyb20oJ3N0ZG91dCcpLFxuICAgICAgcGlkOiAxMjQsXG4gICAgICBvdXRwdXQ6IFsnZG9ja2VyIHJ1biBjb21tYW5kJywgJ3N0ZGVyciddLFxuICAgICAgc2lnbmFsOiBudWxsLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGltYWdlID0gRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKTtcbiAgICBpbWFnZS5ydW4oe1xuICAgICAgY29tbWFuZDogWydjb29sJywgJ2NvbW1hbmQnXSxcbiAgICAgIHZvbHVtZXM6IFt7IGhvc3RQYXRoOiAnL2hvc3QtcGF0aCcsIGNvbnRhaW5lclBhdGg6ICcvY29udGFpbmVyLXBhdGgnIH1dLFxuICAgICAgd29ya2luZ0RpcmVjdG9yeTogJy93b3JraW5nLWRpcmVjdG9yeScsXG4gICAgICB1c2VyOiAndXNlcjpncm91cCcsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHNwYXduU3luY1N0dWIuc2Vjb25kQ2FsbC5jYWxsZWRXaXRoKGRvY2tlckNtZCwgW1xuICAgICAgJ3J1bicsICctLXJtJyxcbiAgICAgICctdScsICd1c2VyOmdyb3VwJyxcbiAgICAgICctdicsICcvaG9zdC1wYXRoOi9jb250YWluZXItcGF0aDpkZWxlZ2F0ZWQnLFxuICAgICAgJy13JywgJy93b3JraW5nLWRpcmVjdG9yeScsXG4gICAgICAnYWxwaW5lJyxcbiAgICAgICdjb29sJywgJ2NvbW1hbmQnLFxuICAgIF0sIHsgc3RkaW86IFsnaWdub3JlJywgcHJvY2Vzcy5zdGRlcnIsICdpbmhlcml0J10gfSkpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Vuc3VyZSBubyBzZWxpbnV4IGRvY2tlciBtb3VudCBpZiBzZWxpbnV4ZW5hYmxlZCBpc25cXCd0IGFuIGF2YWlsYWJsZSBjb21tYW5kJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgc2lub24uc3R1Yihwcm9jZXNzLCAncGxhdGZvcm0nKS52YWx1ZSgnbGludXgnKTtcbiAgICBjb25zdCBzcGF3blN5bmNTdHViID0gc2lub24uc3R1YihjaGlsZF9wcm9jZXNzLCAnc3Bhd25TeW5jJyk7XG4gICAgc3Bhd25TeW5jU3R1Yi5vbkZpcnN0Q2FsbCgpLnJldHVybnMoe1xuICAgICAgc3RhdHVzOiAxMjcsXG4gICAgICBzdGRlcnI6IEJ1ZmZlci5mcm9tKCdzdGRlcnInKSxcbiAgICAgIHN0ZG91dDogQnVmZmVyLmZyb20oJ3N0ZG91dCcpLFxuICAgICAgcGlkOiAxMjMsXG4gICAgICBvdXRwdXQ6IFsnc2VsaW51eGVuYWJsZWQgb3V0cHV0JywgJ3N0ZGVyciddLFxuICAgICAgc2lnbmFsOiBudWxsLFxuICAgIH0pO1xuICAgIHNwYXduU3luY1N0dWIub25TZWNvbmRDYWxsKCkucmV0dXJucyh7XG4gICAgICBzdGF0dXM6IDAsXG4gICAgICBzdGRlcnI6IEJ1ZmZlci5mcm9tKCdzdGRlcnInKSxcbiAgICAgIHN0ZG91dDogQnVmZmVyLmZyb20oJ3N0ZG91dCcpLFxuICAgICAgcGlkOiAxMjQsXG4gICAgICBvdXRwdXQ6IFsnZG9ja2VyIHJ1biBjb21tYW5kJywgJ3N0ZGVyciddLFxuICAgICAgc2lnbmFsOiBudWxsLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGltYWdlID0gRG9ja2VySW1hZ2UuZnJvbVJlZ2lzdHJ5KCdhbHBpbmUnKTtcbiAgICBpbWFnZS5ydW4oe1xuICAgICAgY29tbWFuZDogWydjb29sJywgJ2NvbW1hbmQnXSxcbiAgICAgIHZvbHVtZXM6IFt7IGhvc3RQYXRoOiAnL2hvc3QtcGF0aCcsIGNvbnRhaW5lclBhdGg6ICcvY29udGFpbmVyLXBhdGgnIH1dLFxuICAgICAgd29ya2luZ0RpcmVjdG9yeTogJy93b3JraW5nLWRpcmVjdG9yeScsXG4gICAgICB1c2VyOiAndXNlcjpncm91cCcsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHNwYXduU3luY1N0dWIuc2Vjb25kQ2FsbC5jYWxsZWRXaXRoKGRvY2tlckNtZCwgW1xuICAgICAgJ3J1bicsICctLXJtJyxcbiAgICAgICctdScsICd1c2VyOmdyb3VwJyxcbiAgICAgICctdicsICcvaG9zdC1wYXRoOi9jb250YWluZXItcGF0aDpkZWxlZ2F0ZWQnLFxuICAgICAgJy13JywgJy93b3JraW5nLWRpcmVjdG9yeScsXG4gICAgICAnYWxwaW5lJyxcbiAgICAgICdjb29sJywgJ2NvbW1hbmQnLFxuICAgIF0sIHsgc3RkaW86IFsnaWdub3JlJywgcHJvY2Vzcy5zdGRlcnIsICdpbmhlcml0J10gfSkpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Vuc3VyZSBjb3JyZWN0IERvY2tlciBDTEkgYXJndW1lbnRzIGFyZSByZXR1cm5lZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGZyb21TcmMgPSBEb2NrZXJCdWlsZFNlY3JldC5mcm9tU3JjKCdwYXRoLmpzb24nKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoZnJvbVNyYykudG9FcXVhbCgnc3JjPXBhdGguanNvbicpO1xuICB9KTtcbn0pO1xuIl19