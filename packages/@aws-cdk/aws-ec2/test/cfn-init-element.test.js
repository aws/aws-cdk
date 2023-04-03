"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const iam = require("@aws-cdk/aws-iam");
const s3 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const ec2 = require("../lib");
const cfn_init_internal_1 = require("../lib/private/cfn-init-internal");
let app;
let stack;
beforeEach(() => {
    app = new core_1.App();
    stack = new core_1.Stack(app, 'Stack', {
        env: { account: '1234', region: 'testregion' },
    });
});
describe('InitCommand', () => {
    test('throws error on empty argv command', () => {
        expect(() => { ec2.InitCommand.argvCommand([]); }).toThrow();
    });
    test('auto-generates an indexed command key if none is provided', () => {
        // GIVEN
        const command = ec2.InitCommand.shellCommand('/bin/sh');
        // WHEN
        const rendered = getElementConfig(command, cfn_init_internal_1.InitPlatform.LINUX);
        // THEN
        expect(rendered['000']).toBeDefined();
    });
    test('renders a minimalist template when no options are defined', () => {
        // GIVEN
        const command = ec2.InitCommand.shellCommand('/bin/sh');
        // WHEN
        const rendered = getElementConfig(command, cfn_init_internal_1.InitPlatform.LINUX);
        // THEN
        expect(rendered).toEqual({
            '000': { command: '/bin/sh' },
        });
    });
    test('shell command is rendered as string', () => {
        // GIVEN
        const command = ec2.InitCommand.shellCommand('/bin/sh -c "echo hello"');
        // WHEN
        const rendered = getElementConfig(command, cfn_init_internal_1.InitPlatform.LINUX);
        // THEN
        expect(rendered).toEqual({
            '000': { command: '/bin/sh -c "echo hello"' },
        });
    });
    test('creates a shell command with all provided options', () => {
        // GIVEN
        const command = ec2.InitCommand.shellCommand('/bin/sh', {
            key: 'command_0',
            env: { SECRETS_FILE: '/tmp/secrets' },
            cwd: '/home/myUser',
            testCmd: 'test -d /home/myUser',
            ignoreErrors: false,
            waitAfterCompletion: ec2.InitCommandWaitDuration.of(core_1.Duration.hours(2)),
        });
        // WHEN
        const rendered = getElementConfig(command, cfn_init_internal_1.InitPlatform.WINDOWS);
        // THEN
        expect(rendered).toEqual({
            command_0: {
                command: '/bin/sh',
                env: { SECRETS_FILE: '/tmp/secrets' },
                cwd: '/home/myUser',
                test: 'test -d /home/myUser',
                ignoreErrors: false,
                waitAfterCompletion: 7200,
            },
        });
    });
    test('creates an argv command with all provided options', () => {
        // GIVEN
        const command = ec2.InitCommand.argvCommand(['/bin/sh', '-c', 'doStuff'], {
            key: 'command_0',
            env: { SECRETS_FILE: '/tmp/secrets' },
            cwd: '/home/myUser',
            testCmd: 'test -d /home/myUser',
            ignoreErrors: false,
            waitAfterCompletion: ec2.InitCommandWaitDuration.of(core_1.Duration.hours(2)),
        });
        // WHEN
        const rendered = getElementConfig(command, cfn_init_internal_1.InitPlatform.WINDOWS);
        // THEN
        expect(rendered).toEqual({
            command_0: {
                command: ['/bin/sh', '-c', 'doStuff'],
                env: { SECRETS_FILE: '/tmp/secrets' },
                cwd: '/home/myUser',
                test: 'test -d /home/myUser',
                ignoreErrors: false,
                waitAfterCompletion: 7200,
            },
        });
    });
    test('errors when waitAfterCompletion is specified for Linux systems', () => {
        // GIVEN
        const command = ec2.InitCommand.shellCommand('/bin/sh', {
            key: 'command_0',
            env: { SECRETS_FILE: '/tmp/secrets' },
            cwd: '/home/myUser',
            testCmd: 'test -d /home/myUser',
            ignoreErrors: false,
            waitAfterCompletion: ec2.InitCommandWaitDuration.of(core_1.Duration.hours(2)),
        });
        // THEN
        expect(() => {
            command._bind(defaultOptions(cfn_init_internal_1.InitPlatform.LINUX));
        }).toThrow(/'waitAfterCompletion' is only valid for Windows/);
    });
});
describe('InitFile', () => {
    test('fromString creates inline content', () => {
        // GIVEN
        const file = ec2.InitFile.fromString('/tmp/foo', 'My content');
        // WHEN
        const rendered = getElementConfig(file, cfn_init_internal_1.InitPlatform.LINUX);
        // THEN
        expect(rendered).toEqual({
            '/tmp/foo': {
                content: 'My content',
                encoding: 'plain',
                owner: 'root',
                group: 'root',
                mode: '000644',
            },
        });
    });
    test('fromString creates inline content from base64-encoded content', () => {
        // GIVEN
        const file = ec2.InitFile.fromString('/tmp/foo', Buffer.from('Hello').toString('base64'), {
            base64Encoded: true,
        });
        // WHEN
        const rendered = getElementConfig(file, cfn_init_internal_1.InitPlatform.LINUX);
        // THEN
        expect(rendered).toEqual({
            '/tmp/foo': {
                content: 'SGVsbG8=',
                encoding: 'base64',
                owner: 'root',
                group: 'root',
                mode: '000644',
            },
        });
    });
    test('mode, user, group settings not allowed for Windows', () => {
        // GIVEN
        const file = ec2.InitFile.fromString('/tmp/foo', 'My content', {
            group: 'root',
            owner: 'root',
            mode: '000644',
        });
        // WHEN
        expect(() => {
            file._bind(defaultOptions(cfn_init_internal_1.InitPlatform.WINDOWS));
        }).toThrow('Owner, group, and mode options not supported for Windows.');
    });
    test('file renders properly on Windows', () => {
        // GIVEN
        const file = ec2.InitFile.fromString('/tmp/foo', 'My content');
        // WHEN
        const rendered = getElementConfig(file, cfn_init_internal_1.InitPlatform.WINDOWS);
        // THEN
        expect(rendered).toEqual({
            '/tmp/foo': {
                content: 'My content',
                encoding: 'plain',
            },
        });
    });
    test('empty content string throws error', () => {
        expect(() => {
            ec2.InitFile.fromString('/tmp/foo', '');
        }).toThrow('InitFile /tmp/foo: cannot create empty file. Please supply at least one character of content.');
    });
    test('symlink throws an error if mode is set incorrectly', () => {
        expect(() => {
            ec2.InitFile.symlink('/tmp/foo', '/tmp/bar', {
                mode: '000644',
            });
        }).toThrow('File mode for symlinks must begin with 120XXX');
    });
    test('symlink sets mode is not set', () => {
        // GIVEN
        const file = ec2.InitFile.symlink('/tmp/foo', '/tmp/bar');
        // WHEN
        const rendered = getElementConfig(file, cfn_init_internal_1.InitPlatform.LINUX);
        // THEN
        expect(rendered).toEqual({
            '/tmp/foo': {
                content: '/tmp/bar',
                encoding: 'plain',
                owner: 'root',
                group: 'root',
                mode: '120644',
            },
        });
    });
    test('fromFileInline renders the file contents inline', () => {
        // GIVEN
        const tmpFilePath = createTmpFileWithContent('Hello World!');
        const file = ec2.InitFile.fromFileInline('/tmp/foo', tmpFilePath);
        // WHEN
        const rendered = getElementConfig(file, cfn_init_internal_1.InitPlatform.LINUX);
        // THEN
        expect(rendered).toEqual({
            '/tmp/foo': {
                content: 'Hello World!',
                encoding: 'plain',
                owner: 'root',
                group: 'root',
                mode: '000644',
            },
        });
    });
    test('fromObject renders the contents inline as an object', () => {
        // GIVEN
        const content = {
            version: '1234',
            secretsFile: '/tmp/secrets',
            maxThreads: 15,
            isEnabled: true,
            floatNumber: 23.18,
        };
        const file = ec2.InitFile.fromObject('/tmp/foo', content);
        // WHEN
        const rendered = getElementConfig(file, cfn_init_internal_1.InitPlatform.LINUX);
        // THEN
        expect(rendered).toEqual({
            '/tmp/foo': {
                content: {
                    version: '1234',
                    secretsFile: '/tmp/secrets',
                    maxThreads: 15,
                    isEnabled: true,
                    floatNumber: 23.18,
                },
                owner: 'root',
                group: 'root',
                mode: '000644',
            },
        });
    });
    test('fromFileInline respects the base64 flag', () => {
        // GIVEN
        const tmpFilePath = createTmpFileWithContent('Hello');
        const file = ec2.InitFile.fromFileInline('/tmp/foo', tmpFilePath, {
            base64Encoded: true,
        });
        // WHEN
        const rendered = getElementConfig(file, cfn_init_internal_1.InitPlatform.LINUX);
        // THEN
        expect(rendered).toEqual({
            '/tmp/foo': {
                content: 'SGVsbG8=',
                encoding: 'base64',
                owner: 'root',
                group: 'root',
                mode: '000644',
            },
        });
    });
    test('fromUrl uses the provided URL as a source', () => {
        // GIVEN
        const file = ec2.InitFile.fromUrl('/tmp/foo', 'https://aws.amazon.com/');
        // WHEN
        const rendered = getElementConfig(file, cfn_init_internal_1.InitPlatform.LINUX);
        // THEN
        expect(rendered).toEqual({
            '/tmp/foo': {
                source: 'https://aws.amazon.com/',
                owner: 'root',
                group: 'root',
                mode: '000644',
            },
        });
    });
});
describe('InitGroup', () => {
    test('renders without a group id', () => {
        // GIVEN
        const group = ec2.InitGroup.fromName('amazon');
        // WHEN
        const rendered = getElementConfig(group, cfn_init_internal_1.InitPlatform.LINUX);
        // THEN
        expect(rendered).toEqual({ amazon: {} });
    });
    test('renders with a group id', () => {
        // GIVEN
        const group = ec2.InitGroup.fromName('amazon', 42);
        // WHEN
        const rendered = getElementConfig(group, cfn_init_internal_1.InitPlatform.LINUX);
        // THEN
        expect(rendered).toEqual({ amazon: { gid: 42 } });
    });
    test('groups are not supported for Windows', () => {
        // GIVEN
        const group = ec2.InitGroup.fromName('amazon');
        // WHEN
        expect(() => {
            group._bind(defaultOptions(cfn_init_internal_1.InitPlatform.WINDOWS));
        }).toThrow('Init groups are not supported on Windows');
    });
});
describe('InitUser', () => {
    test('fromName accepts just a name to create a user', () => {
        // GIVEN
        const group = ec2.InitUser.fromName('sysuser1');
        // WHEN
        const rendered = getElementConfig(group, cfn_init_internal_1.InitPlatform.LINUX);
        // THEN
        expect(rendered).toEqual({ sysuser1: {} });
    });
    test('renders with all options present', () => {
        // GIVEN
        const group = ec2.InitUser.fromName('sysuser1', {
            userId: 42,
            homeDir: '/home/sysuser1',
            groups: ['amazon'],
        });
        // WHEN
        const rendered = getElementConfig(group, cfn_init_internal_1.InitPlatform.LINUX);
        // THEN
        expect(rendered).toEqual({
            sysuser1: {
                uid: 42,
                homeDir: '/home/sysuser1',
                groups: ['amazon'],
            },
        });
    });
    test('users are not supported for Windows', () => {
        // GIVEN
        const group = ec2.InitUser.fromName('sysuser1');
        // WHEN
        expect(() => {
            group._bind(defaultOptions(cfn_init_internal_1.InitPlatform.WINDOWS));
        }).toThrow('Init users are not supported on Windows');
    });
});
describe('InitPackage', () => {
    test('rpm auto-generates a name if none is provided', () => {
        // GIVEN
        const pkg = ec2.InitPackage.rpm('https://example.com/rpm/mypkg.rpm');
        // WHEN
        const rendered = getElementConfig(pkg, cfn_init_internal_1.InitPlatform.LINUX);
        // THEN
        expect(rendered).toEqual({
            rpm: {
                '000': ['https://example.com/rpm/mypkg.rpm'],
            },
        });
    });
    test('rpm uses name if provided', () => {
        // GIVEN
        const pkg = ec2.InitPackage.rpm('https://example.com/rpm/mypkg.rpm', { key: 'myPkg' });
        // WHEN
        const rendered = getElementConfig(pkg, cfn_init_internal_1.InitPlatform.LINUX);
        // THEN
        expect(rendered).toEqual({
            rpm: {
                myPkg: ['https://example.com/rpm/mypkg.rpm'],
            },
        });
    });
    test('rpm is not supported for Windows', () => {
        // GIVEN
        const pkg = ec2.InitPackage.rpm('https://example.com/rpm/mypkg.rpm');
        // THEN
        expect(() => {
            pkg._bind(defaultOptions(cfn_init_internal_1.InitPlatform.WINDOWS));
        }).toThrow('Windows only supports the MSI package type');
    });
    test.each([
        ['yum', ec2.InitPackage.yum],
        ['rubygems', ec2.InitPackage.rubyGem],
        ['python', ec2.InitPackage.python],
        ['apt', ec2.InitPackage.apt],
    ])('%s accepts a package without versions', (pkgType, fn) => {
        // GIVEN
        const pkg = fn('httpd');
        // WHEN
        const rendered = getElementConfig(pkg, cfn_init_internal_1.InitPlatform.LINUX);
        // THEN
        expect(rendered).toEqual({
            [pkgType]: { httpd: [] },
        });
    });
    test.each([
        ['yum', ec2.InitPackage.yum],
        ['rubygems', ec2.InitPackage.rubyGem],
        ['python', ec2.InitPackage.python],
        ['apt', ec2.InitPackage.apt],
    ])('%s accepts a package with versions', (pkgType, fn) => {
        // GIVEN
        const pkg = fn('httpd', { version: ['1.0', '2.0'] });
        // WHEN
        const rendered = getElementConfig(pkg, cfn_init_internal_1.InitPlatform.LINUX);
        // THEN
        expect(rendered).toEqual({
            [pkgType]: { httpd: ['1.0', '2.0'] },
        });
    });
    test.each([
        ['yum', ec2.InitPackage.yum],
        ['rubygems', ec2.InitPackage.rubyGem],
        ['python', ec2.InitPackage.python],
        ['apt', ec2.InitPackage.apt],
    ])('%s is not supported on Windows', (_pkgType, fn) => {
        // GIVEN
        const pkg = fn('httpd');
        expect(() => {
            pkg._bind(defaultOptions(cfn_init_internal_1.InitPlatform.WINDOWS));
        }).toThrow('Windows only supports the MSI package type');
    });
    test('msi auto-generates a name if none is provided', () => {
        // GIVEN
        const pkg = ec2.InitPackage.msi('https://example.com/rpm/mypkg.msi');
        // WHEN
        const rendered = getElementConfig(pkg, cfn_init_internal_1.InitPlatform.WINDOWS);
        // THEN
        expect(rendered).toEqual({
            msi: {
                '000': 'https://example.com/rpm/mypkg.msi',
            },
        });
    });
    test('msi uses name if provided', () => {
        // GIVEN
        const pkg = ec2.InitPackage.msi('https://example.com/rpm/mypkg.msi', { key: 'myPkg' });
        // WHEN
        const rendered = getElementConfig(pkg, cfn_init_internal_1.InitPlatform.WINDOWS);
        // THEN
        expect(rendered).toEqual({
            msi: {
                myPkg: 'https://example.com/rpm/mypkg.msi',
            },
        });
    });
    test('msi is not supported for Linux', () => {
        // GIVEN
        const pkg = ec2.InitPackage.msi('https://example.com/rpm/mypkg.msi');
        // THEN
        expect(() => {
            pkg._bind(defaultOptions(cfn_init_internal_1.InitPlatform.LINUX));
        }).toThrow('MSI installers are only supported on Windows systems.');
    });
});
describe('InitService', () => {
    test.each([
        ['Linux', 'sysvinit', cfn_init_internal_1.InitPlatform.LINUX],
        ['Windows', 'windows', cfn_init_internal_1.InitPlatform.WINDOWS],
    ])('enable always sets enabled and running to true for %s', (_platform, key, platform) => {
        // GIVEN
        const service = ec2.InitService.enable('httpd');
        // WHEN
        const rendered = service._bind(defaultOptions(platform)).config;
        // THEN
        expect(rendered[key]).toBeDefined();
        expect(rendered[key]).toEqual({
            httpd: {
                enabled: true,
                ensureRunning: true,
            },
        });
    });
    test.each([
        ['Linux', 'sysvinit', cfn_init_internal_1.InitPlatform.LINUX],
        ['Windows', 'windows', cfn_init_internal_1.InitPlatform.WINDOWS],
    ])('disable returns a minimalist disabled service for %s', (_platform, key, platform) => {
        // GIVEN
        const service = ec2.InitService.disable('httpd');
        // WHEN
        const rendered = service._bind(defaultOptions(platform)).config;
        // THEN
        expect(rendered[key]).toBeDefined();
        expect(rendered[key]).toEqual({
            httpd: {
                enabled: false,
                ensureRunning: false,
            },
        });
    });
    test('fromOptions renders all options', () => {
        // GIVEN
        const restartHandle = new ec2.InitServiceRestartHandle();
        const serviceRestartHandles = [restartHandle];
        const initFile = ec2.InitFile.fromString('/etc/my.cnf', '[mysql]', { serviceRestartHandles });
        const initSource = ec2.InitSource.fromUrl('/tmp/foo', 'https://example.com/archive.zip', { serviceRestartHandles });
        const initPackage = ec2.InitPackage.yum('httpd', { serviceRestartHandles });
        const initCommand = ec2.InitCommand.shellCommand('/bin/true', { serviceRestartHandles, key: 'myCmd' });
        const service = ec2.InitService.enable('httpd', { serviceRestartHandle: restartHandle });
        // WHEN
        const bindOptions = defaultOptions(cfn_init_internal_1.InitPlatform.LINUX);
        initFile._bind(bindOptions);
        initSource._bind(bindOptions);
        initPackage._bind(bindOptions);
        initCommand._bind(bindOptions);
        const rendered = service._bind(bindOptions).config;
        // THEN
        expect(rendered.sysvinit).toEqual({
            httpd: {
                enabled: true,
                ensureRunning: true,
                files: ['/etc/my.cnf'],
                sources: ['/tmp/foo'],
                packages: { yum: ['httpd'] },
                commands: ['myCmd'],
            },
        });
    });
    test('can request systemd service', () => {
        // WHEN
        const service = ec2.InitService.enable('httpd', {
            serviceManager: ec2.ServiceManager.SYSTEMD,
        });
        // THEN
        const bindOptions = defaultOptions(cfn_init_internal_1.InitPlatform.LINUX);
        const rendered = service._bind(bindOptions).config;
        // THEN
        expect(rendered.systemd).toEqual({
            httpd: {
                enabled: true,
                ensureRunning: true,
            },
        });
    });
    test('can create simple systemd config file', () => {
        // WHEN
        const file = ec2.InitService.systemdConfigFile('myserver', {
            command: '/start/my/service',
            cwd: '/my/dir',
            user: 'ec2-user',
            group: 'ec2-user',
            description: 'my service',
        });
        // THEN
        const bindOptions = defaultOptions(cfn_init_internal_1.InitPlatform.LINUX);
        const rendered = file._bind(bindOptions).config;
        expect(rendered).toEqual({
            '/etc/systemd/system/myserver.service': expect.objectContaining({
                content: expect.any(String),
            }),
        });
        const capture = rendered['/etc/systemd/system/myserver.service'].content;
        expect(capture).toContain('ExecStart=/start/my/service');
        expect(capture).toContain('WorkingDirectory=/my/dir');
        expect(capture).toContain('User=ec2-user');
        expect(capture).toContain('Group=ec2-user');
        expect(capture).toContain('Description=my service');
    });
});
describe('InitSource', () => {
    test('fromUrl renders correctly', () => {
        // GIVEN
        const source = ec2.InitSource.fromUrl('/tmp/foo', 'https://example.com/archive.zip');
        // WHEN
        const rendered = getElementConfig(source, cfn_init_internal_1.InitPlatform.LINUX);
        // THEN
        expect(rendered).toEqual({
            '/tmp/foo': 'https://example.com/archive.zip',
        });
    });
    test('fromGitHub builds a path to the tarball', () => {
        // GIVEN
        const source = ec2.InitSource.fromGitHub('/tmp/foo', 'aws', 'aws-cdk', 'master');
        // WHEN
        const rendered = getElementConfig(source, cfn_init_internal_1.InitPlatform.LINUX);
        // THEN
        expect(rendered).toEqual({
            '/tmp/foo': 'https://github.com/aws/aws-cdk/tarball/master',
        });
    });
    test('fromGitHub defaults to master if refspec is omitted', () => {
        // GIVEN
        const source = ec2.InitSource.fromGitHub('/tmp/foo', 'aws', 'aws-cdk');
        // WHEN
        const rendered = getElementConfig(source, cfn_init_internal_1.InitPlatform.LINUX);
        // THEN
        expect(rendered).toEqual({
            '/tmp/foo': 'https://github.com/aws/aws-cdk/tarball/master',
        });
    });
    test('fromS3Object uses object URL', () => {
        // GIVEN
        const bucket = s3.Bucket.fromBucketName(stack, 'bucket', 'mybucket');
        const source = ec2.InitSource.fromS3Object('/tmp/foo', bucket, 'myKey');
        // WHEN
        const rendered = getElementConfig(source, cfn_init_internal_1.InitPlatform.LINUX);
        // THEN
        expect(rendered).toEqual({
            '/tmp/foo': expect.stringContaining('/mybucket/myKey'),
        });
    });
});
function getElementConfig(element, platform) {
    return element._bind(defaultOptions(platform)).config;
}
function defaultOptions(platform) {
    return {
        scope: stack,
        index: 0,
        platform,
        instanceRole: new iam.Role(stack, 'InstanceRole', {
            assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
        }),
    };
}
function createTmpFileWithContent(content) {
    const suffix = crypto.randomBytes(4).toString('hex');
    const fileName = path.join(os.tmpdir(), `cfn-init-element-test-${suffix}`);
    fs.writeFileSync(fileName, content);
    return fileName;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWluaXQtZWxlbWVudC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2ZuLWluaXQtZWxlbWVudC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQWlDO0FBQ2pDLHlCQUF5QjtBQUN6Qix5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLHdDQUF3QztBQUN4QyxzQ0FBc0M7QUFDdEMsd0NBQXFEO0FBQ3JELDhCQUE4QjtBQUM5Qix3RUFBZ0U7QUFFaEUsSUFBSSxHQUFRLENBQUM7QUFDYixJQUFJLEtBQVksQ0FBQztBQUVqQixVQUFVLENBQUMsR0FBRyxFQUFFO0lBQ2QsR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7SUFDaEIsS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUU7UUFDOUIsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFO0tBQy9DLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7SUFFM0IsSUFBSSxDQUFDLG9DQUFvQyxFQUFFLEdBQUcsRUFBRTtRQUM5QyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMvRCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywyREFBMkQsRUFBRSxHQUFHLEVBQUU7UUFDckUsUUFBUTtRQUNSLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXhELE9BQU87UUFDUCxNQUFNLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsZ0NBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUvRCxPQUFP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dG8nO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgb3MgZnJvbSAnb3MnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgeyBBcHAsIER1cmF0aW9uLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBJbml0UGxhdGZvcm0gfSBmcm9tICcuLi9saWIvcHJpdmF0ZS9jZm4taW5pdC1pbnRlcm5hbCc7XG5cbmxldCBhcHA6IEFwcDtcbmxldCBzdGFjazogU3RhY2s7XG5cbmJlZm9yZUVhY2goKCkgPT4ge1xuICBhcHAgPSBuZXcgQXBwKCk7XG4gIHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJywge1xuICAgIGVudjogeyBhY2NvdW50OiAnMTIzNCcsIHJlZ2lvbjogJ3Rlc3RyZWdpb24nIH0sXG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdJbml0Q29tbWFuZCcsICgpID0+IHtcblxuICB0ZXN0KCd0aHJvd3MgZXJyb3Igb24gZW1wdHkgYXJndiBjb21tYW5kJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB7IGVjMi5Jbml0Q29tbWFuZC5hcmd2Q29tbWFuZChbXSk7IH0pLnRvVGhyb3coKTtcbiAgfSk7XG5cbiAgdGVzdCgnYXV0by1nZW5lcmF0ZXMgYW4gaW5kZXhlZCBjb21tYW5kIGtleSBpZiBub25lIGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgY29tbWFuZCA9IGVjMi5Jbml0Q29tbWFuZC5zaGVsbENvbW1hbmQoJy9iaW4vc2gnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZW5kZXJlZCA9IGdldEVsZW1lbnRDb25maWcoY29tbWFuZCwgSW5pdFBsYXRmb3JtLkxJTlVYKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVuZGVyZWRbJzAwMCddKS50b0JlRGVmaW5lZCgpO1xuICB9KTtcblxuICB0ZXN0KCdyZW5kZXJzIGEgbWluaW1hbGlzdCB0ZW1wbGF0ZSB3aGVuIG5vIG9wdGlvbnMgYXJlIGRlZmluZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBjb21tYW5kID0gZWMyLkluaXRDb21tYW5kLnNoZWxsQ29tbWFuZCgnL2Jpbi9zaCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlbmRlcmVkID0gZ2V0RWxlbWVudENvbmZpZyhjb21tYW5kLCBJbml0UGxhdGZvcm0uTElOVVgpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZW5kZXJlZCkudG9FcXVhbCh7XG4gICAgICAnMDAwJzogeyBjb21tYW5kOiAnL2Jpbi9zaCcgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc2hlbGwgY29tbWFuZCBpcyByZW5kZXJlZCBhcyBzdHJpbmcnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBjb21tYW5kID0gZWMyLkluaXRDb21tYW5kLnNoZWxsQ29tbWFuZCgnL2Jpbi9zaCAtYyBcImVjaG8gaGVsbG9cIicpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlbmRlcmVkID0gZ2V0RWxlbWVudENvbmZpZyhjb21tYW5kLCBJbml0UGxhdGZvcm0uTElOVVgpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZW5kZXJlZCkudG9FcXVhbCh7XG4gICAgICAnMDAwJzogeyBjb21tYW5kOiAnL2Jpbi9zaCAtYyBcImVjaG8gaGVsbG9cIicgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlcyBhIHNoZWxsIGNvbW1hbmQgd2l0aCBhbGwgcHJvdmlkZWQgb3B0aW9ucycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGNvbW1hbmQgPSBlYzIuSW5pdENvbW1hbmQuc2hlbGxDb21tYW5kKCcvYmluL3NoJywge1xuICAgICAga2V5OiAnY29tbWFuZF8wJyxcbiAgICAgIGVudjogeyBTRUNSRVRTX0ZJTEU6ICcvdG1wL3NlY3JldHMnIH0sXG4gICAgICBjd2Q6ICcvaG9tZS9teVVzZXInLFxuICAgICAgdGVzdENtZDogJ3Rlc3QgLWQgL2hvbWUvbXlVc2VyJyxcbiAgICAgIGlnbm9yZUVycm9yczogZmFsc2UsXG4gICAgICB3YWl0QWZ0ZXJDb21wbGV0aW9uOiBlYzIuSW5pdENvbW1hbmRXYWl0RHVyYXRpb24ub2YoRHVyYXRpb24uaG91cnMoMikpLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlbmRlcmVkID0gZ2V0RWxlbWVudENvbmZpZyhjb21tYW5kLCBJbml0UGxhdGZvcm0uV0lORE9XUyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlcmVkKS50b0VxdWFsKHtcbiAgICAgIGNvbW1hbmRfMDoge1xuICAgICAgICBjb21tYW5kOiAnL2Jpbi9zaCcsXG4gICAgICAgIGVudjogeyBTRUNSRVRTX0ZJTEU6ICcvdG1wL3NlY3JldHMnIH0sXG4gICAgICAgIGN3ZDogJy9ob21lL215VXNlcicsXG4gICAgICAgIHRlc3Q6ICd0ZXN0IC1kIC9ob21lL215VXNlcicsXG4gICAgICAgIGlnbm9yZUVycm9yczogZmFsc2UsXG4gICAgICAgIHdhaXRBZnRlckNvbXBsZXRpb246IDcyMDAsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGVzIGFuIGFyZ3YgY29tbWFuZCB3aXRoIGFsbCBwcm92aWRlZCBvcHRpb25zJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgY29tbWFuZCA9IGVjMi5Jbml0Q29tbWFuZC5hcmd2Q29tbWFuZChbJy9iaW4vc2gnLCAnLWMnLCAnZG9TdHVmZiddLCB7XG4gICAgICBrZXk6ICdjb21tYW5kXzAnLFxuICAgICAgZW52OiB7IFNFQ1JFVFNfRklMRTogJy90bXAvc2VjcmV0cycgfSxcbiAgICAgIGN3ZDogJy9ob21lL215VXNlcicsXG4gICAgICB0ZXN0Q21kOiAndGVzdCAtZCAvaG9tZS9teVVzZXInLFxuICAgICAgaWdub3JlRXJyb3JzOiBmYWxzZSxcbiAgICAgIHdhaXRBZnRlckNvbXBsZXRpb246IGVjMi5Jbml0Q29tbWFuZFdhaXREdXJhdGlvbi5vZihEdXJhdGlvbi5ob3VycygyKSksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcmVuZGVyZWQgPSBnZXRFbGVtZW50Q29uZmlnKGNvbW1hbmQsIEluaXRQbGF0Zm9ybS5XSU5ET1dTKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVuZGVyZWQpLnRvRXF1YWwoe1xuICAgICAgY29tbWFuZF8wOiB7XG4gICAgICAgIGNvbW1hbmQ6IFsnL2Jpbi9zaCcsICctYycsICdkb1N0dWZmJ10sXG4gICAgICAgIGVudjogeyBTRUNSRVRTX0ZJTEU6ICcvdG1wL3NlY3JldHMnIH0sXG4gICAgICAgIGN3ZDogJy9ob21lL215VXNlcicsXG4gICAgICAgIHRlc3Q6ICd0ZXN0IC1kIC9ob21lL215VXNlcicsXG4gICAgICAgIGlnbm9yZUVycm9yczogZmFsc2UsXG4gICAgICAgIHdhaXRBZnRlckNvbXBsZXRpb246IDcyMDAsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdlcnJvcnMgd2hlbiB3YWl0QWZ0ZXJDb21wbGV0aW9uIGlzIHNwZWNpZmllZCBmb3IgTGludXggc3lzdGVtcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGNvbW1hbmQgPSBlYzIuSW5pdENvbW1hbmQuc2hlbGxDb21tYW5kKCcvYmluL3NoJywge1xuICAgICAga2V5OiAnY29tbWFuZF8wJyxcbiAgICAgIGVudjogeyBTRUNSRVRTX0ZJTEU6ICcvdG1wL3NlY3JldHMnIH0sXG4gICAgICBjd2Q6ICcvaG9tZS9teVVzZXInLFxuICAgICAgdGVzdENtZDogJ3Rlc3QgLWQgL2hvbWUvbXlVc2VyJyxcbiAgICAgIGlnbm9yZUVycm9yczogZmFsc2UsXG4gICAgICB3YWl0QWZ0ZXJDb21wbGV0aW9uOiBlYzIuSW5pdENvbW1hbmRXYWl0RHVyYXRpb24ub2YoRHVyYXRpb24uaG91cnMoMikpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBjb21tYW5kLl9iaW5kKGRlZmF1bHRPcHRpb25zKEluaXRQbGF0Zm9ybS5MSU5VWCkpO1xuICAgIH0pLnRvVGhyb3coLyd3YWl0QWZ0ZXJDb21wbGV0aW9uJyBpcyBvbmx5IHZhbGlkIGZvciBXaW5kb3dzLyk7XG4gIH0pO1xuXG59KTtcblxuZGVzY3JpYmUoJ0luaXRGaWxlJywgKCkgPT4ge1xuXG4gIHRlc3QoJ2Zyb21TdHJpbmcgY3JlYXRlcyBpbmxpbmUgY29udGVudCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGZpbGUgPSBlYzIuSW5pdEZpbGUuZnJvbVN0cmluZygnL3RtcC9mb28nLCAnTXkgY29udGVudCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlbmRlcmVkID0gZ2V0RWxlbWVudENvbmZpZyhmaWxlLCBJbml0UGxhdGZvcm0uTElOVVgpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZW5kZXJlZCkudG9FcXVhbCh7XG4gICAgICAnL3RtcC9mb28nOiB7XG4gICAgICAgIGNvbnRlbnQ6ICdNeSBjb250ZW50JyxcbiAgICAgICAgZW5jb2Rpbmc6ICdwbGFpbicsXG4gICAgICAgIG93bmVyOiAncm9vdCcsXG4gICAgICAgIGdyb3VwOiAncm9vdCcsXG4gICAgICAgIG1vZGU6ICcwMDA2NDQnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZnJvbVN0cmluZyBjcmVhdGVzIGlubGluZSBjb250ZW50IGZyb20gYmFzZTY0LWVuY29kZWQgY29udGVudCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGZpbGUgPSBlYzIuSW5pdEZpbGUuZnJvbVN0cmluZygnL3RtcC9mb28nLCBCdWZmZXIuZnJvbSgnSGVsbG8nKS50b1N0cmluZygnYmFzZTY0JyksIHtcbiAgICAgIGJhc2U2NEVuY29kZWQ6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcmVuZGVyZWQgPSBnZXRFbGVtZW50Q29uZmlnKGZpbGUsIEluaXRQbGF0Zm9ybS5MSU5VWCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlcmVkKS50b0VxdWFsKHtcbiAgICAgICcvdG1wL2Zvbyc6IHtcbiAgICAgICAgY29udGVudDogJ1NHVnNiRzg9JyxcbiAgICAgICAgZW5jb2Rpbmc6ICdiYXNlNjQnLFxuICAgICAgICBvd25lcjogJ3Jvb3QnLFxuICAgICAgICBncm91cDogJ3Jvb3QnLFxuICAgICAgICBtb2RlOiAnMDAwNjQ0JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ21vZGUsIHVzZXIsIGdyb3VwIHNldHRpbmdzIG5vdCBhbGxvd2VkIGZvciBXaW5kb3dzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgZmlsZSA9IGVjMi5Jbml0RmlsZS5mcm9tU3RyaW5nKCcvdG1wL2ZvbycsICdNeSBjb250ZW50Jywge1xuICAgICAgZ3JvdXA6ICdyb290JyxcbiAgICAgIG93bmVyOiAncm9vdCcsXG4gICAgICBtb2RlOiAnMDAwNjQ0JyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgZmlsZS5fYmluZChkZWZhdWx0T3B0aW9ucyhJbml0UGxhdGZvcm0uV0lORE9XUykpO1xuICAgIH0pLnRvVGhyb3coJ093bmVyLCBncm91cCwgYW5kIG1vZGUgb3B0aW9ucyBub3Qgc3VwcG9ydGVkIGZvciBXaW5kb3dzLicpO1xuICB9KTtcblxuICB0ZXN0KCdmaWxlIHJlbmRlcnMgcHJvcGVybHkgb24gV2luZG93cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGZpbGUgPSBlYzIuSW5pdEZpbGUuZnJvbVN0cmluZygnL3RtcC9mb28nLCAnTXkgY29udGVudCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlbmRlcmVkID0gZ2V0RWxlbWVudENvbmZpZyhmaWxlLCBJbml0UGxhdGZvcm0uV0lORE9XUyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlcmVkKS50b0VxdWFsKHtcbiAgICAgICcvdG1wL2Zvbyc6IHtcbiAgICAgICAgY29udGVudDogJ015IGNvbnRlbnQnLFxuICAgICAgICBlbmNvZGluZzogJ3BsYWluJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2VtcHR5IGNvbnRlbnQgc3RyaW5nIHRocm93cyBlcnJvcicsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgZWMyLkluaXRGaWxlLmZyb21TdHJpbmcoJy90bXAvZm9vJywgJycpO1xuICAgIH0pLnRvVGhyb3coJ0luaXRGaWxlIC90bXAvZm9vOiBjYW5ub3QgY3JlYXRlIGVtcHR5IGZpbGUuIFBsZWFzZSBzdXBwbHkgYXQgbGVhc3Qgb25lIGNoYXJhY3RlciBvZiBjb250ZW50LicpO1xuICB9KTtcblxuICB0ZXN0KCdzeW1saW5rIHRocm93cyBhbiBlcnJvciBpZiBtb2RlIGlzIHNldCBpbmNvcnJlY3RseScsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgZWMyLkluaXRGaWxlLnN5bWxpbmsoJy90bXAvZm9vJywgJy90bXAvYmFyJywge1xuICAgICAgICBtb2RlOiAnMDAwNjQ0JyxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coJ0ZpbGUgbW9kZSBmb3Igc3ltbGlua3MgbXVzdCBiZWdpbiB3aXRoIDEyMFhYWCcpO1xuICB9KTtcblxuICB0ZXN0KCdzeW1saW5rIHNldHMgbW9kZSBpcyBub3Qgc2V0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgZmlsZSA9IGVjMi5Jbml0RmlsZS5zeW1saW5rKCcvdG1wL2ZvbycsICcvdG1wL2JhcicpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlbmRlcmVkID0gZ2V0RWxlbWVudENvbmZpZyhmaWxlLCBJbml0UGxhdGZvcm0uTElOVVgpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZW5kZXJlZCkudG9FcXVhbCh7XG4gICAgICAnL3RtcC9mb28nOiB7XG4gICAgICAgIGNvbnRlbnQ6ICcvdG1wL2JhcicsXG4gICAgICAgIGVuY29kaW5nOiAncGxhaW4nLFxuICAgICAgICBvd25lcjogJ3Jvb3QnLFxuICAgICAgICBncm91cDogJ3Jvb3QnLFxuICAgICAgICBtb2RlOiAnMTIwNjQ0JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Zyb21GaWxlSW5saW5lIHJlbmRlcnMgdGhlIGZpbGUgY29udGVudHMgaW5saW5lJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgdG1wRmlsZVBhdGggPSBjcmVhdGVUbXBGaWxlV2l0aENvbnRlbnQoJ0hlbGxvIFdvcmxkIScpO1xuICAgIGNvbnN0IGZpbGUgPSBlYzIuSW5pdEZpbGUuZnJvbUZpbGVJbmxpbmUoJy90bXAvZm9vJywgdG1wRmlsZVBhdGgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlbmRlcmVkID0gZ2V0RWxlbWVudENvbmZpZyhmaWxlLCBJbml0UGxhdGZvcm0uTElOVVgpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZW5kZXJlZCkudG9FcXVhbCh7XG4gICAgICAnL3RtcC9mb28nOiB7XG4gICAgICAgIGNvbnRlbnQ6ICdIZWxsbyBXb3JsZCEnLFxuICAgICAgICBlbmNvZGluZzogJ3BsYWluJyxcbiAgICAgICAgb3duZXI6ICdyb290JyxcbiAgICAgICAgZ3JvdXA6ICdyb290JyxcbiAgICAgICAgbW9kZTogJzAwMDY0NCcsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdmcm9tT2JqZWN0IHJlbmRlcnMgdGhlIGNvbnRlbnRzIGlubGluZSBhcyBhbiBvYmplY3QnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBjb250ZW50ID0ge1xuICAgICAgdmVyc2lvbjogJzEyMzQnLFxuICAgICAgc2VjcmV0c0ZpbGU6ICcvdG1wL3NlY3JldHMnLFxuICAgICAgbWF4VGhyZWFkczogMTUsXG4gICAgICBpc0VuYWJsZWQ6IHRydWUsXG4gICAgICBmbG9hdE51bWJlcjogMjMuMTgsXG4gICAgfTtcbiAgICBjb25zdCBmaWxlID0gZWMyLkluaXRGaWxlLmZyb21PYmplY3QoJy90bXAvZm9vJywgY29udGVudCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcmVuZGVyZWQgPSBnZXRFbGVtZW50Q29uZmlnKGZpbGUsIEluaXRQbGF0Zm9ybS5MSU5VWCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlcmVkKS50b0VxdWFsKHtcbiAgICAgICcvdG1wL2Zvbyc6IHtcbiAgICAgICAgY29udGVudDoge1xuICAgICAgICAgIHZlcnNpb246ICcxMjM0JyxcbiAgICAgICAgICBzZWNyZXRzRmlsZTogJy90bXAvc2VjcmV0cycsXG4gICAgICAgICAgbWF4VGhyZWFkczogMTUsXG4gICAgICAgICAgaXNFbmFibGVkOiB0cnVlLFxuICAgICAgICAgIGZsb2F0TnVtYmVyOiAyMy4xOCxcbiAgICAgICAgfSxcbiAgICAgICAgb3duZXI6ICdyb290JyxcbiAgICAgICAgZ3JvdXA6ICdyb290JyxcbiAgICAgICAgbW9kZTogJzAwMDY0NCcsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdmcm9tRmlsZUlubGluZSByZXNwZWN0cyB0aGUgYmFzZTY0IGZsYWcnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB0bXBGaWxlUGF0aCA9IGNyZWF0ZVRtcEZpbGVXaXRoQ29udGVudCgnSGVsbG8nKTtcbiAgICBjb25zdCBmaWxlID0gZWMyLkluaXRGaWxlLmZyb21GaWxlSW5saW5lKCcvdG1wL2ZvbycsIHRtcEZpbGVQYXRoLCB7XG4gICAgICBiYXNlNjRFbmNvZGVkOiB0cnVlLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlbmRlcmVkID0gZ2V0RWxlbWVudENvbmZpZyhmaWxlLCBJbml0UGxhdGZvcm0uTElOVVgpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZW5kZXJlZCkudG9FcXVhbCh7XG4gICAgICAnL3RtcC9mb28nOiB7XG4gICAgICAgIGNvbnRlbnQ6ICdTR1ZzYkc4PScsXG4gICAgICAgIGVuY29kaW5nOiAnYmFzZTY0JyxcbiAgICAgICAgb3duZXI6ICdyb290JyxcbiAgICAgICAgZ3JvdXA6ICdyb290JyxcbiAgICAgICAgbW9kZTogJzAwMDY0NCcsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdmcm9tVXJsIHVzZXMgdGhlIHByb3ZpZGVkIFVSTCBhcyBhIHNvdXJjZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGZpbGUgPSBlYzIuSW5pdEZpbGUuZnJvbVVybCgnL3RtcC9mb28nLCAnaHR0cHM6Ly9hd3MuYW1hem9uLmNvbS8nKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZW5kZXJlZCA9IGdldEVsZW1lbnRDb25maWcoZmlsZSwgSW5pdFBsYXRmb3JtLkxJTlVYKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVuZGVyZWQpLnRvRXF1YWwoe1xuICAgICAgJy90bXAvZm9vJzoge1xuICAgICAgICBzb3VyY2U6ICdodHRwczovL2F3cy5hbWF6b24uY29tLycsXG4gICAgICAgIG93bmVyOiAncm9vdCcsXG4gICAgICAgIGdyb3VwOiAncm9vdCcsXG4gICAgICAgIG1vZGU6ICcwMDA2NDQnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbn0pO1xuXG5kZXNjcmliZSgnSW5pdEdyb3VwJywgKCkgPT4ge1xuXG4gIHRlc3QoJ3JlbmRlcnMgd2l0aG91dCBhIGdyb3VwIGlkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgZ3JvdXAgPSBlYzIuSW5pdEdyb3VwLmZyb21OYW1lKCdhbWF6b24nKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZW5kZXJlZCA9IGdldEVsZW1lbnRDb25maWcoZ3JvdXAsIEluaXRQbGF0Zm9ybS5MSU5VWCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlcmVkKS50b0VxdWFsKHsgYW1hem9uOiB7fSB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVuZGVycyB3aXRoIGEgZ3JvdXAgaWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBncm91cCA9IGVjMi5Jbml0R3JvdXAuZnJvbU5hbWUoJ2FtYXpvbicsIDQyKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZW5kZXJlZCA9IGdldEVsZW1lbnRDb25maWcoZ3JvdXAsIEluaXRQbGF0Zm9ybS5MSU5VWCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlcmVkKS50b0VxdWFsKHsgYW1hem9uOiB7IGdpZDogNDIgfSB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZ3JvdXBzIGFyZSBub3Qgc3VwcG9ydGVkIGZvciBXaW5kb3dzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgZ3JvdXAgPSBlYzIuSW5pdEdyb3VwLmZyb21OYW1lKCdhbWF6b24nKTtcblxuICAgIC8vIFdIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgZ3JvdXAuX2JpbmQoZGVmYXVsdE9wdGlvbnMoSW5pdFBsYXRmb3JtLldJTkRPV1MpKTtcbiAgICB9KS50b1Rocm93KCdJbml0IGdyb3VwcyBhcmUgbm90IHN1cHBvcnRlZCBvbiBXaW5kb3dzJyk7XG4gIH0pO1xuXG59KTtcblxuZGVzY3JpYmUoJ0luaXRVc2VyJywgKCkgPT4ge1xuXG4gIHRlc3QoJ2Zyb21OYW1lIGFjY2VwdHMganVzdCBhIG5hbWUgdG8gY3JlYXRlIGEgdXNlcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGdyb3VwID0gZWMyLkluaXRVc2VyLmZyb21OYW1lKCdzeXN1c2VyMScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlbmRlcmVkID0gZ2V0RWxlbWVudENvbmZpZyhncm91cCwgSW5pdFBsYXRmb3JtLkxJTlVYKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVuZGVyZWQpLnRvRXF1YWwoeyBzeXN1c2VyMToge30gfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JlbmRlcnMgd2l0aCBhbGwgb3B0aW9ucyBwcmVzZW50JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgZ3JvdXAgPSBlYzIuSW5pdFVzZXIuZnJvbU5hbWUoJ3N5c3VzZXIxJywge1xuICAgICAgdXNlcklkOiA0MixcbiAgICAgIGhvbWVEaXI6ICcvaG9tZS9zeXN1c2VyMScsXG4gICAgICBncm91cHM6IFsnYW1hem9uJ10sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcmVuZGVyZWQgPSBnZXRFbGVtZW50Q29uZmlnKGdyb3VwLCBJbml0UGxhdGZvcm0uTElOVVgpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZW5kZXJlZCkudG9FcXVhbCh7XG4gICAgICBzeXN1c2VyMToge1xuICAgICAgICB1aWQ6IDQyLFxuICAgICAgICBob21lRGlyOiAnL2hvbWUvc3lzdXNlcjEnLFxuICAgICAgICBncm91cHM6IFsnYW1hem9uJ10sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd1c2VycyBhcmUgbm90IHN1cHBvcnRlZCBmb3IgV2luZG93cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGdyb3VwID0gZWMyLkluaXRVc2VyLmZyb21OYW1lKCdzeXN1c2VyMScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBncm91cC5fYmluZChkZWZhdWx0T3B0aW9ucyhJbml0UGxhdGZvcm0uV0lORE9XUykpO1xuICAgIH0pLnRvVGhyb3coJ0luaXQgdXNlcnMgYXJlIG5vdCBzdXBwb3J0ZWQgb24gV2luZG93cycpO1xuICB9KTtcblxufSk7XG5cbmRlc2NyaWJlKCdJbml0UGFja2FnZScsICgpID0+IHtcblxuICB0ZXN0KCdycG0gYXV0by1nZW5lcmF0ZXMgYSBuYW1lIGlmIG5vbmUgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBwa2cgPSBlYzIuSW5pdFBhY2thZ2UucnBtKCdodHRwczovL2V4YW1wbGUuY29tL3JwbS9teXBrZy5ycG0nKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZW5kZXJlZCA9IGdldEVsZW1lbnRDb25maWcocGtnLCBJbml0UGxhdGZvcm0uTElOVVgpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZW5kZXJlZCkudG9FcXVhbCh7XG4gICAgICBycG06IHtcbiAgICAgICAgJzAwMCc6IFsnaHR0cHM6Ly9leGFtcGxlLmNvbS9ycG0vbXlwa2cucnBtJ10sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdycG0gdXNlcyBuYW1lIGlmIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgcGtnID0gZWMyLkluaXRQYWNrYWdlLnJwbSgnaHR0cHM6Ly9leGFtcGxlLmNvbS9ycG0vbXlwa2cucnBtJywgeyBrZXk6ICdteVBrZycgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcmVuZGVyZWQgPSBnZXRFbGVtZW50Q29uZmlnKHBrZywgSW5pdFBsYXRmb3JtLkxJTlVYKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVuZGVyZWQpLnRvRXF1YWwoe1xuICAgICAgcnBtOiB7XG4gICAgICAgIG15UGtnOiBbJ2h0dHBzOi8vZXhhbXBsZS5jb20vcnBtL215cGtnLnJwbSddLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncnBtIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIFdpbmRvd3MnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBwa2cgPSBlYzIuSW5pdFBhY2thZ2UucnBtKCdodHRwczovL2V4YW1wbGUuY29tL3JwbS9teXBrZy5ycG0nKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgcGtnLl9iaW5kKGRlZmF1bHRPcHRpb25zKEluaXRQbGF0Zm9ybS5XSU5ET1dTKSk7XG4gICAgfSkudG9UaHJvdygnV2luZG93cyBvbmx5IHN1cHBvcnRzIHRoZSBNU0kgcGFja2FnZSB0eXBlJyk7XG4gIH0pO1xuXG4gIHRlc3QuZWFjaChbXG4gICAgWyd5dW0nLCBlYzIuSW5pdFBhY2thZ2UueXVtXSxcbiAgICBbJ3J1YnlnZW1zJywgZWMyLkluaXRQYWNrYWdlLnJ1YnlHZW1dLFxuICAgIFsncHl0aG9uJywgZWMyLkluaXRQYWNrYWdlLnB5dGhvbl0sXG4gICAgWydhcHQnLCBlYzIuSW5pdFBhY2thZ2UuYXB0XSxcbiAgXSkoJyVzIGFjY2VwdHMgYSBwYWNrYWdlIHdpdGhvdXQgdmVyc2lvbnMnLCAocGtnVHlwZSwgZm4pID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHBrZyA9IGZuKCdodHRwZCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlbmRlcmVkID0gZ2V0RWxlbWVudENvbmZpZyhwa2csIEluaXRQbGF0Zm9ybS5MSU5VWCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlcmVkKS50b0VxdWFsKHtcbiAgICAgIFtwa2dUeXBlXTogeyBodHRwZDogW10gfSxcbiAgICB9KTtcbiAgfSxcbiAgKTtcblxuICB0ZXN0LmVhY2goW1xuICAgIFsneXVtJywgZWMyLkluaXRQYWNrYWdlLnl1bV0sXG4gICAgWydydWJ5Z2VtcycsIGVjMi5Jbml0UGFja2FnZS5ydWJ5R2VtXSxcbiAgICBbJ3B5dGhvbicsIGVjMi5Jbml0UGFja2FnZS5weXRob25dLFxuICAgIFsnYXB0JywgZWMyLkluaXRQYWNrYWdlLmFwdF0sXG4gIF0pKCclcyBhY2NlcHRzIGEgcGFja2FnZSB3aXRoIHZlcnNpb25zJywgKHBrZ1R5cGUsIGZuKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBwa2cgPSBmbignaHR0cGQnLCB7IHZlcnNpb246IFsnMS4wJywgJzIuMCddIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlbmRlcmVkID0gZ2V0RWxlbWVudENvbmZpZyhwa2csIEluaXRQbGF0Zm9ybS5MSU5VWCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlcmVkKS50b0VxdWFsKHtcbiAgICAgIFtwa2dUeXBlXTogeyBodHRwZDogWycxLjAnLCAnMi4wJ10gfSxcbiAgICB9KTtcbiAgfSxcbiAgKTtcblxuICB0ZXN0LmVhY2goW1xuICAgIFsneXVtJywgZWMyLkluaXRQYWNrYWdlLnl1bV0sXG4gICAgWydydWJ5Z2VtcycsIGVjMi5Jbml0UGFja2FnZS5ydWJ5R2VtXSxcbiAgICBbJ3B5dGhvbicsIGVjMi5Jbml0UGFja2FnZS5weXRob25dLFxuICAgIFsnYXB0JywgZWMyLkluaXRQYWNrYWdlLmFwdF0sXG4gIF0pKCclcyBpcyBub3Qgc3VwcG9ydGVkIG9uIFdpbmRvd3MnLCAoX3BrZ1R5cGUsIGZuKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBwa2cgPSBmbignaHR0cGQnKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBwa2cuX2JpbmQoZGVmYXVsdE9wdGlvbnMoSW5pdFBsYXRmb3JtLldJTkRPV1MpKTtcbiAgICB9KS50b1Rocm93KCdXaW5kb3dzIG9ubHkgc3VwcG9ydHMgdGhlIE1TSSBwYWNrYWdlIHR5cGUnKTtcbiAgfSxcbiAgKTtcblxuICB0ZXN0KCdtc2kgYXV0by1nZW5lcmF0ZXMgYSBuYW1lIGlmIG5vbmUgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBwa2cgPSBlYzIuSW5pdFBhY2thZ2UubXNpKCdodHRwczovL2V4YW1wbGUuY29tL3JwbS9teXBrZy5tc2knKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZW5kZXJlZCA9IGdldEVsZW1lbnRDb25maWcocGtnLCBJbml0UGxhdGZvcm0uV0lORE9XUyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlcmVkKS50b0VxdWFsKHtcbiAgICAgIG1zaToge1xuICAgICAgICAnMDAwJzogJ2h0dHBzOi8vZXhhbXBsZS5jb20vcnBtL215cGtnLm1zaScsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdtc2kgdXNlcyBuYW1lIGlmIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgcGtnID0gZWMyLkluaXRQYWNrYWdlLm1zaSgnaHR0cHM6Ly9leGFtcGxlLmNvbS9ycG0vbXlwa2cubXNpJywgeyBrZXk6ICdteVBrZycgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcmVuZGVyZWQgPSBnZXRFbGVtZW50Q29uZmlnKHBrZywgSW5pdFBsYXRmb3JtLldJTkRPV1MpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZW5kZXJlZCkudG9FcXVhbCh7XG4gICAgICBtc2k6IHtcbiAgICAgICAgbXlQa2c6ICdodHRwczovL2V4YW1wbGUuY29tL3JwbS9teXBrZy5tc2knLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnbXNpIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIExpbnV4JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgcGtnID0gZWMyLkluaXRQYWNrYWdlLm1zaSgnaHR0cHM6Ly9leGFtcGxlLmNvbS9ycG0vbXlwa2cubXNpJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHBrZy5fYmluZChkZWZhdWx0T3B0aW9ucyhJbml0UGxhdGZvcm0uTElOVVgpKTtcbiAgICB9KS50b1Rocm93KCdNU0kgaW5zdGFsbGVycyBhcmUgb25seSBzdXBwb3J0ZWQgb24gV2luZG93cyBzeXN0ZW1zLicpO1xuICB9KTtcblxufSk7XG5cbmRlc2NyaWJlKCdJbml0U2VydmljZScsICgpID0+IHtcblxuICB0ZXN0LmVhY2goW1xuICAgIFsnTGludXgnLCAnc3lzdmluaXQnLCBJbml0UGxhdGZvcm0uTElOVVhdLFxuICAgIFsnV2luZG93cycsICd3aW5kb3dzJywgSW5pdFBsYXRmb3JtLldJTkRPV1NdLFxuICBdKSgnZW5hYmxlIGFsd2F5cyBzZXRzIGVuYWJsZWQgYW5kIHJ1bm5pbmcgdG8gdHJ1ZSBmb3IgJXMnLCAoX3BsYXRmb3JtLCBrZXksIHBsYXRmb3JtKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzZXJ2aWNlID0gZWMyLkluaXRTZXJ2aWNlLmVuYWJsZSgnaHR0cGQnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZW5kZXJlZCA9IHNlcnZpY2UuX2JpbmQoZGVmYXVsdE9wdGlvbnMocGxhdGZvcm0pKS5jb25maWc7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlcmVkW2tleV0pLnRvQmVEZWZpbmVkKCk7XG4gICAgZXhwZWN0KHJlbmRlcmVkW2tleV0pLnRvRXF1YWwoe1xuICAgICAgaHR0cGQ6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgZW5zdXJlUnVubmluZzogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QuZWFjaChbXG4gICAgWydMaW51eCcsICdzeXN2aW5pdCcsIEluaXRQbGF0Zm9ybS5MSU5VWF0sXG4gICAgWydXaW5kb3dzJywgJ3dpbmRvd3MnLCBJbml0UGxhdGZvcm0uV0lORE9XU10sXG4gIF0pKCdkaXNhYmxlIHJldHVybnMgYSBtaW5pbWFsaXN0IGRpc2FibGVkIHNlcnZpY2UgZm9yICVzJywgKF9wbGF0Zm9ybSwga2V5LCBwbGF0Zm9ybSkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc2VydmljZSA9IGVjMi5Jbml0U2VydmljZS5kaXNhYmxlKCdodHRwZCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlbmRlcmVkID0gc2VydmljZS5fYmluZChkZWZhdWx0T3B0aW9ucyhwbGF0Zm9ybSkpLmNvbmZpZztcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVuZGVyZWRba2V5XSkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3QocmVuZGVyZWRba2V5XSkudG9FcXVhbCh7XG4gICAgICBodHRwZDoge1xuICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgZW5zdXJlUnVubmluZzogZmFsc2UsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdmcm9tT3B0aW9ucyByZW5kZXJzIGFsbCBvcHRpb25zJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgcmVzdGFydEhhbmRsZSA9IG5ldyBlYzIuSW5pdFNlcnZpY2VSZXN0YXJ0SGFuZGxlKCk7XG4gICAgY29uc3Qgc2VydmljZVJlc3RhcnRIYW5kbGVzID0gW3Jlc3RhcnRIYW5kbGVdO1xuICAgIGNvbnN0IGluaXRGaWxlID0gZWMyLkluaXRGaWxlLmZyb21TdHJpbmcoJy9ldGMvbXkuY25mJywgJ1tteXNxbF0nLCB7IHNlcnZpY2VSZXN0YXJ0SGFuZGxlcyB9KTtcbiAgICBjb25zdCBpbml0U291cmNlID0gZWMyLkluaXRTb3VyY2UuZnJvbVVybCgnL3RtcC9mb28nLCAnaHR0cHM6Ly9leGFtcGxlLmNvbS9hcmNoaXZlLnppcCcsIHsgc2VydmljZVJlc3RhcnRIYW5kbGVzIH0pO1xuICAgIGNvbnN0IGluaXRQYWNrYWdlID0gZWMyLkluaXRQYWNrYWdlLnl1bSgnaHR0cGQnLCB7IHNlcnZpY2VSZXN0YXJ0SGFuZGxlcyB9KTtcbiAgICBjb25zdCBpbml0Q29tbWFuZCA9IGVjMi5Jbml0Q29tbWFuZC5zaGVsbENvbW1hbmQoJy9iaW4vdHJ1ZScsIHsgc2VydmljZVJlc3RhcnRIYW5kbGVzLCBrZXk6ICdteUNtZCcgfSk7XG5cbiAgICBjb25zdCBzZXJ2aWNlID0gZWMyLkluaXRTZXJ2aWNlLmVuYWJsZSgnaHR0cGQnLCB7IHNlcnZpY2VSZXN0YXJ0SGFuZGxlOiByZXN0YXJ0SGFuZGxlIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGJpbmRPcHRpb25zID0gZGVmYXVsdE9wdGlvbnMoSW5pdFBsYXRmb3JtLkxJTlVYKTtcbiAgICBpbml0RmlsZS5fYmluZChiaW5kT3B0aW9ucyk7XG4gICAgaW5pdFNvdXJjZS5fYmluZChiaW5kT3B0aW9ucyk7XG4gICAgaW5pdFBhY2thZ2UuX2JpbmQoYmluZE9wdGlvbnMpO1xuICAgIGluaXRDb21tYW5kLl9iaW5kKGJpbmRPcHRpb25zKTtcbiAgICBjb25zdCByZW5kZXJlZCA9IHNlcnZpY2UuX2JpbmQoYmluZE9wdGlvbnMpLmNvbmZpZztcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVuZGVyZWQuc3lzdmluaXQpLnRvRXF1YWwoe1xuICAgICAgaHR0cGQ6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgZW5zdXJlUnVubmluZzogdHJ1ZSxcbiAgICAgICAgZmlsZXM6IFsnL2V0Yy9teS5jbmYnXSxcbiAgICAgICAgc291cmNlczogWycvdG1wL2ZvbyddLFxuICAgICAgICBwYWNrYWdlczogeyB5dW06IFsnaHR0cGQnXSB9LFxuICAgICAgICBjb21tYW5kczogWydteUNtZCddLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHJlcXVlc3Qgc3lzdGVtZCBzZXJ2aWNlJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzZXJ2aWNlID0gZWMyLkluaXRTZXJ2aWNlLmVuYWJsZSgnaHR0cGQnLCB7XG4gICAgICBzZXJ2aWNlTWFuYWdlcjogZWMyLlNlcnZpY2VNYW5hZ2VyLlNZU1RFTUQsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYmluZE9wdGlvbnMgPSBkZWZhdWx0T3B0aW9ucyhJbml0UGxhdGZvcm0uTElOVVgpO1xuICAgIGNvbnN0IHJlbmRlcmVkID0gc2VydmljZS5fYmluZChiaW5kT3B0aW9ucykuY29uZmlnO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZW5kZXJlZC5zeXN0ZW1kKS50b0VxdWFsKHtcbiAgICAgIGh0dHBkOiB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGVuc3VyZVJ1bm5pbmc6IHRydWUsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gY3JlYXRlIHNpbXBsZSBzeXN0ZW1kIGNvbmZpZyBmaWxlJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBmaWxlID0gZWMyLkluaXRTZXJ2aWNlLnN5c3RlbWRDb25maWdGaWxlKCdteXNlcnZlcicsIHtcbiAgICAgIGNvbW1hbmQ6ICcvc3RhcnQvbXkvc2VydmljZScsXG4gICAgICBjd2Q6ICcvbXkvZGlyJyxcbiAgICAgIHVzZXI6ICdlYzItdXNlcicsXG4gICAgICBncm91cDogJ2VjMi11c2VyJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnbXkgc2VydmljZScsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgYmluZE9wdGlvbnMgPSBkZWZhdWx0T3B0aW9ucyhJbml0UGxhdGZvcm0uTElOVVgpO1xuICAgIGNvbnN0IHJlbmRlcmVkID0gZmlsZS5fYmluZChiaW5kT3B0aW9ucykuY29uZmlnO1xuICAgIGV4cGVjdChyZW5kZXJlZCkudG9FcXVhbCh7XG4gICAgICAnL2V0Yy9zeXN0ZW1kL3N5c3RlbS9teXNlcnZlci5zZXJ2aWNlJzogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICBjb250ZW50OiBleHBlY3QuYW55KFN0cmluZyksXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGNhcHR1cmUgPSByZW5kZXJlZFsnL2V0Yy9zeXN0ZW1kL3N5c3RlbS9teXNlcnZlci5zZXJ2aWNlJ10uY29udGVudDtcbiAgICBleHBlY3QoY2FwdHVyZSkudG9Db250YWluKCdFeGVjU3RhcnQ9L3N0YXJ0L215L3NlcnZpY2UnKTtcbiAgICBleHBlY3QoY2FwdHVyZSkudG9Db250YWluKCdXb3JraW5nRGlyZWN0b3J5PS9teS9kaXInKTtcbiAgICBleHBlY3QoY2FwdHVyZSkudG9Db250YWluKCdVc2VyPWVjMi11c2VyJyk7XG4gICAgZXhwZWN0KGNhcHR1cmUpLnRvQ29udGFpbignR3JvdXA9ZWMyLXVzZXInKTtcbiAgICBleHBlY3QoY2FwdHVyZSkudG9Db250YWluKCdEZXNjcmlwdGlvbj1teSBzZXJ2aWNlJyk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdJbml0U291cmNlJywgKCkgPT4ge1xuXG4gIHRlc3QoJ2Zyb21VcmwgcmVuZGVycyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzb3VyY2UgPSBlYzIuSW5pdFNvdXJjZS5mcm9tVXJsKCcvdG1wL2ZvbycsICdodHRwczovL2V4YW1wbGUuY29tL2FyY2hpdmUuemlwJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcmVuZGVyZWQgPSBnZXRFbGVtZW50Q29uZmlnKHNvdXJjZSwgSW5pdFBsYXRmb3JtLkxJTlVYKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVuZGVyZWQpLnRvRXF1YWwoe1xuICAgICAgJy90bXAvZm9vJzogJ2h0dHBzOi8vZXhhbXBsZS5jb20vYXJjaGl2ZS56aXAnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdmcm9tR2l0SHViIGJ1aWxkcyBhIHBhdGggdG8gdGhlIHRhcmJhbGwnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzb3VyY2UgPSBlYzIuSW5pdFNvdXJjZS5mcm9tR2l0SHViKCcvdG1wL2ZvbycsICdhd3MnLCAnYXdzLWNkaycsICdtYXN0ZXInKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZW5kZXJlZCA9IGdldEVsZW1lbnRDb25maWcoc291cmNlLCBJbml0UGxhdGZvcm0uTElOVVgpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZW5kZXJlZCkudG9FcXVhbCh7XG4gICAgICAnL3RtcC9mb28nOiAnaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3MtY2RrL3RhcmJhbGwvbWFzdGVyJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZnJvbUdpdEh1YiBkZWZhdWx0cyB0byBtYXN0ZXIgaWYgcmVmc3BlYyBpcyBvbWl0dGVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc291cmNlID0gZWMyLkluaXRTb3VyY2UuZnJvbUdpdEh1YignL3RtcC9mb28nLCAnYXdzJywgJ2F3cy1jZGsnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZW5kZXJlZCA9IGdldEVsZW1lbnRDb25maWcoc291cmNlLCBJbml0UGxhdGZvcm0uTElOVVgpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZW5kZXJlZCkudG9FcXVhbCh7XG4gICAgICAnL3RtcC9mb28nOiAnaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3MtY2RrL3RhcmJhbGwvbWFzdGVyJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZnJvbVMzT2JqZWN0IHVzZXMgb2JqZWN0IFVSTCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGJ1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0TmFtZShzdGFjaywgJ2J1Y2tldCcsICdteWJ1Y2tldCcpO1xuICAgIGNvbnN0IHNvdXJjZSA9IGVjMi5Jbml0U291cmNlLmZyb21TM09iamVjdCgnL3RtcC9mb28nLCBidWNrZXQsICdteUtleScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlbmRlcmVkID0gZ2V0RWxlbWVudENvbmZpZyhzb3VyY2UsIEluaXRQbGF0Zm9ybS5MSU5VWCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlbmRlcmVkKS50b0VxdWFsKHtcbiAgICAgICcvdG1wL2Zvbyc6IGV4cGVjdC5zdHJpbmdDb250YWluaW5nKCcvbXlidWNrZXQvbXlLZXknKSxcbiAgICB9KTtcbiAgfSk7XG5cbn0pO1xuXG5mdW5jdGlvbiBnZXRFbGVtZW50Q29uZmlnKGVsZW1lbnQ6IGVjMi5Jbml0RWxlbWVudCwgcGxhdGZvcm06IEluaXRQbGF0Zm9ybSkge1xuICByZXR1cm4gZWxlbWVudC5fYmluZChkZWZhdWx0T3B0aW9ucyhwbGF0Zm9ybSkpLmNvbmZpZztcbn1cblxuZnVuY3Rpb24gZGVmYXVsdE9wdGlvbnMocGxhdGZvcm06IEluaXRQbGF0Zm9ybSkge1xuICByZXR1cm4ge1xuICAgIHNjb3BlOiBzdGFjayxcbiAgICBpbmRleDogMCxcbiAgICBwbGF0Zm9ybSxcbiAgICBpbnN0YW5jZVJvbGU6IG5ldyBpYW0uUm9sZShzdGFjaywgJ0luc3RhbmNlUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlYzIuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pLFxuICB9O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVUbXBGaWxlV2l0aENvbnRlbnQoY29udGVudDogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3Qgc3VmZml4ID0gY3J5cHRvLnJhbmRvbUJ5dGVzKDQpLnRvU3RyaW5nKCdoZXgnKTtcbiAgY29uc3QgZmlsZU5hbWUgPSBwYXRoLmpvaW4ob3MudG1wZGlyKCksIGBjZm4taW5pdC1lbGVtZW50LXRlc3QtJHtzdWZmaXh9YCk7XG4gIGZzLndyaXRlRmlsZVN5bmMoZmlsZU5hbWUsIGNvbnRlbnQpO1xuICByZXR1cm4gZmlsZU5hbWU7XG59XG4iXX0=