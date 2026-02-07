import * as child_process from 'child_process';
import * as os from 'os';
import * as sinon from 'sinon';
import { AssetStaging, DockerImage } from '../lib';
import { Construct } from 'constructs';
import { App, Stack } from '../lib';
import * as cxapi from '../../cx-api';

describe('bundling ownership', () => {
    let app: App;
    let stack: Stack;

    beforeEach(() => {
        app = new App();
        stack = new Stack(app, 'Stack');
        sinon.restore();
    });

    afterEach(() => {
        sinon.restore();
    });

    test('fixOwnership wraps command on Linux', () => {
        const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns({
            status: 0,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from('stdout'),
            pid: 123,
            output: ['stdout', 'stderr'],
            signal: null,
        } as any);

        sinon.stub(process, 'platform').value('linux');
        sinon.stub(os, 'userInfo').returns({
            uid: 1001,
            gid: 1002,
            username: 'test-user',
            homedir: '/home/test-user',
            shell: '/bin/bash',
        });

        const image = DockerImage.fromRegistry('alpine');

        // Trigger bundling through AssetStaging to test the context key interaction
        const scope = new Construct(stack, 'Staging');
        scope.node.setContext(cxapi.BUNDLING_FIX_DOCKER_OWNERSHIP, true);

        new AssetStaging(scope, 'Asset', {
            sourcePath: __dirname,
            bundling: {
                image,
                command: ['npm', 'install'],
                user: 'root',
            },
        });

        // Check if the command was wrapped
        // The expected wrapped command is:
        // ['sh', '-c', 'npm install && chown -R 1001:1002 /asset-output']

        // We need to find the call where 'run' was executed.
        // AssetStaging calls bundling logic which eventually calls image.run()

        const dockerArgs = spawnSyncStub.getCalls().find(call => call.args[1][0] === 'run')?.args[1];
        expect(dockerArgs).toBeDefined();

        const commandIdx = dockerArgs!.indexOf('alpine') + 1;
        const command = dockerArgs!.slice(commandIdx);

        expect(command).toEqual(['sh', '-c', 'npm install && chown -R 1001:1002 /asset-output']);
    });

    test('fixOwnership does not wrap command on non-Linux', () => {
        const spawnSyncStub = sinon.stub(child_process, 'spawnSync').returns({
            status: 0,
            stderr: Buffer.from('stderr'),
            stdout: Buffer.from('stdout'),
            pid: 123,
            output: ['stdout', 'stderr'],
            signal: null,
        } as any);

        sinon.stub(process, 'platform').value('darwin');
        sinon.stub(os, 'userInfo').returns({
            uid: 1001,
            gid: 1002,
            username: 'test-user',
            homedir: '/home/test-user',
            shell: '/bin/bash',
        });

        const image = DockerImage.fromRegistry('alpine');
        const scope = new Construct(stack, 'Staging');
        scope.node.setContext(cxapi.BUNDLING_FIX_DOCKER_OWNERSHIP, true);

        new AssetStaging(scope, 'Asset', {
            sourcePath: __dirname,
            bundling: {
                image,
                command: ['npm', 'install'],
            },
        });

        const dockerArgs = spawnSyncStub.getCalls().find(call => call.args[1][0] === 'run')?.args[1];
        const commandIdx = dockerArgs!.indexOf('alpine') + 1;
        const command = dockerArgs!.slice(commandIdx);

        expect(command).toEqual(['npm', 'install']);
    });
});
