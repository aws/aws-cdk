"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const os = require("os");
const path = require("path");
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const s3 = require("@aws-cdk/aws-s3");
const aws_s3_assets_1 = require("@aws-cdk/aws-s3-assets");
const core_1 = require("@aws-cdk/core");
const cxapi = require("@aws-cdk/cx-api");
const util_1 = require("./util");
const ec2 = require("../lib");
let app;
let stack;
let instanceRole;
let resource;
let linuxUserData;
let signalResource;
function resetState() {
    resetStateWithSynthesizer();
}
function resetStateWithSynthesizer(customSynthesizer) {
    app = new core_1.App({
        context: {
            [cxapi.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: false,
        },
    });
    stack = new core_1.Stack(app, 'Stack', {
        env: { account: '1234', region: 'testregion' },
        synthesizer: customSynthesizer,
    });
    instanceRole = new iam.Role(stack, 'InstanceRole', {
        assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });
    resource = new core_1.CfnResource(stack, 'Resource', {
        type: 'CDK::Test::Resource',
    });
    signalResource = new core_1.CfnResource(stack, 'SignalResource', {
        type: 'CDK::Test::Resource',
    });
    linuxUserData = ec2.UserData.forLinux();
}
;
beforeEach(resetState);
test('whole config with restart handles', () => {
    // WHEN
    const handle = new ec2.InitServiceRestartHandle();
    const config = new ec2.InitConfig([
        ec2.InitFile.fromString('/etc/my.cnf', '[mysql]\ngo_fast=true', { serviceRestartHandles: [handle] }),
        ec2.InitSource.fromUrl('/tmp/foo', 'https://amazon.com/foo.zip', { serviceRestartHandles: [handle] }),
        ec2.InitPackage.yum('httpd', { serviceRestartHandles: [handle] }),
        ec2.InitCommand.argvCommand(['/bin/true'], { serviceRestartHandles: [handle] }),
        ec2.InitService.enable('httpd', { serviceRestartHandle: handle }),
    ]);
    // THEN
    expect(config._bind(stack, linuxOptions()).config).toEqual(expect.objectContaining({
        services: {
            sysvinit: {
                httpd: {
                    enabled: true,
                    ensureRunning: true,
                    commands: ['000'],
                    files: ['/etc/my.cnf'],
                    packages: {
                        yum: ['httpd'],
                    },
                    sources: ['/tmp/foo'],
                },
            },
        },
    }));
});
test('CloudFormationInit can be added to after instantiation', () => {
    // GIVEN
    const config = new ec2.InitConfig([]);
    const init = ec2.CloudFormationInit.fromConfig(config);
    // WHEN
    config.add(ec2.InitCommand.argvCommand(['/bin/true']));
    init.attach(resource, linuxOptions());
    // THEN
    expectMetadataLike({
        'AWS::CloudFormation::Init': {
            config: {
                commands: {
                    '000': { command: ['/bin/true'] },
                },
            },
        },
    });
});
test('CloudFormationInit cannot be attached twice', () => {
    // GIVEN
    const init = ec2.CloudFormationInit.fromElements();
    // WHEN
    init.attach(resource, linuxOptions());
    // THEN
    expect(() => { init.attach(resource, linuxOptions()); }).toThrow(/already has/);
});
test('empty configs are not rendered', () => {
    // GIVEN
    const config1 = new ec2.InitConfig([]);
    const config2 = new ec2.InitConfig([
        ec2.InitCommand.argvCommand(['/bin/true']),
    ]);
    // WHEN
    const init = ec2.CloudFormationInit.fromConfigSets({
        configSets: { default: ['config2', 'config1'] },
        configs: { config1, config2 },
    });
    init.attach(resource, linuxOptions());
    // THEN
    expectMetadataLike({
        'AWS::CloudFormation::Init': {
            configSets: {
                default: ['config2'],
            },
            config2: {
                commands: {
                    '000': { command: ['/bin/true'] },
                },
            },
        },
    });
});
describe('userdata', () => {
    let simpleInit;
    beforeEach(() => {
        simpleInit = ec2.CloudFormationInit.fromElements(ec2.InitCommand.argvCommand(['/bin/true']));
    });
    function linuxUserDataTest(signalLogicalId) {
        const lines = linuxUserData.render().split('\n');
        expectLine(lines, cmdArg('cfn-init', `--region ${core_1.Aws.REGION}`));
        expectLine(lines, cmdArg('cfn-init', `--stack ${core_1.Aws.STACK_NAME}`));
        expectLine(lines, cmdArg('cfn-init', `--resource ${resource.logicalId}`));
        expectLine(lines, cmdArg('cfn-init', '-c default'));
        expectLine(lines, cmdArg('cfn-signal', `--region ${core_1.Aws.REGION}`));
        expectLine(lines, cmdArg('cfn-signal', `--stack ${core_1.Aws.STACK_NAME}`));
        expectLine(lines, cmdArg('cfn-signal', `--resource ${signalLogicalId}`));
        expectLine(lines, cmdArg('cfn-signal', '-e $?'));
        expectLine(lines, cmdArg('cat', 'cfn-init.log'));
        expectLine(lines, /fingerprint/);
    }
    function windowsUserDataTest(windowsUserData, signalLogicalId) {
        const lines = windowsUserData.render().split('\n');
        expectLine(lines, cmdArg('cfn-init', `--region ${core_1.Aws.REGION}`));
        expectLine(lines, cmdArg('cfn-init', `--stack ${core_1.Aws.STACK_NAME}`));
        expectLine(lines, cmdArg('cfn-init', `--resource ${resource.logicalId}`));
        expectLine(lines, cmdArg('cfn-init', '-c default'));
        expectLine(lines, cmdArg('cfn-signal', `--region ${core_1.Aws.REGION}`));
        expectLine(lines, cmdArg('cfn-signal', `--stack ${core_1.Aws.STACK_NAME}`));
        expectLine(lines, cmdArg('cfn-signal', `--resource ${signalLogicalId}`));
        expectLine(lines, cmdArg('cfn-signal', '-e $LASTEXITCODE'));
        expectLine(lines, cmdArg('type', 'cfn-init.log'));
        expectLine(lines, /fingerprint/);
    }
    test('linux userdata contains right commands', () => {
        // WHEN
        simpleInit.attach(resource, linuxOptions());
        // THEN
        linuxUserDataTest(resource.logicalId);
    });
    test('linux userdata contains right commands with different signal resource', () => {
        // WHEN
        simpleInit.attach(resource, {
            ...linuxOptions(),
            signalResource,
        });
        // THEN
        linuxUserDataTest(signalResource.logicalId);
    });
    test('linux userdata contains right commands when url and role included', () => {
        // WHEN
        simpleInit.attach(resource, {
            platform: ec2.OperatingSystemType.LINUX,
            instanceRole,
            includeUrl: true,
            includeRole: true,
            userData: linuxUserData,
        });
        // THEN
        const lines = linuxUserData.render().split('\n');
        expectLine(lines, cmdArg('cfn-init', `--region ${core_1.Aws.REGION}`));
        expectLine(lines, cmdArg('cfn-init', `--stack ${core_1.Aws.STACK_NAME}`));
        expectLine(lines, cmdArg('cfn-init', `--resource ${resource.logicalId}`));
        expectLine(lines, cmdArg('cfn-init', `--role ${instanceRole.roleName}`));
        expectLine(lines, cmdArg('cfn-init', `--url https://cloudformation.${core_1.Aws.REGION}.${core_1.Aws.URL_SUFFIX}`));
        expectLine(lines, cmdArg('cfn-init', '-c default'));
        expectLine(lines, cmdArg('cfn-signal', `--region ${core_1.Aws.REGION}`));
        expectLine(lines, cmdArg('cfn-signal', `--stack ${core_1.Aws.STACK_NAME}`));
        expectLine(lines, cmdArg('cfn-signal', `--resource ${resource.logicalId}`));
        expectLine(lines, cmdArg('cfn-init', `--role ${instanceRole.roleName}`));
        expectLine(lines, cmdArg('cfn-init', `--url https://cloudformation.${core_1.Aws.REGION}.${core_1.Aws.URL_SUFFIX}`));
        expectLine(lines, cmdArg('cfn-signal', '-e $?'));
        expectLine(lines, cmdArg('cat', 'cfn-init.log'));
        expectLine(lines, /fingerprint/);
    });
    test('Windows userdata contains right commands', () => {
        // WHEN
        const windowsUserData = ec2.UserData.forWindows();
        simpleInit.attach(resource, {
            platform: ec2.OperatingSystemType.WINDOWS,
            instanceRole,
            userData: windowsUserData,
        });
        // THEN
        windowsUserDataTest(windowsUserData, resource.logicalId);
    });
    test('Windows userdata contains right commands with different signal resource', () => {
        // WHEN
        const windowsUserData = ec2.UserData.forWindows();
        simpleInit.attach(resource, {
            platform: ec2.OperatingSystemType.WINDOWS,
            instanceRole,
            userData: windowsUserData,
            signalResource,
        });
        // THEN
        windowsUserDataTest(windowsUserData, signalResource.logicalId);
    });
    test('ignoreFailures disables result code reporting', () => {
        // WHEN
        simpleInit.attach(resource, {
            ...linuxOptions(),
            ignoreFailures: true,
        });
        // THEN
        const lines = linuxUserData.render().split('\n');
        dontExpectLine(lines, cmdArg('cfn-signal', '-e $?'));
        expectLine(lines, cmdArg('cfn-signal', '-e 0'));
    });
    test('can disable log printing', () => {
        // WHEN
        simpleInit.attach(resource, {
            ...linuxOptions(),
            printLog: false,
        });
        // THEN
        const lines = linuxUserData.render().split('\n');
        dontExpectLine(lines, cmdArg('cat', 'cfn-init.log'));
    });
    test('can disable fingerprinting', () => {
        // WHEN
        simpleInit.attach(resource, {
            ...linuxOptions(),
            embedFingerprint: false,
        });
        // THEN
        const lines = linuxUserData.render().split('\n');
        dontExpectLine(lines, /fingerprint/);
    });
    test('can request multiple different configsets to be used', () => {
        // WHEN
        simpleInit.attach(resource, {
            ...linuxOptions(),
            configSets: ['banana', 'peach'],
        });
        // THEN
        const lines = linuxUserData.render().split('\n');
        expectLine(lines, cmdArg('cfn-init', '-c banana,peach'));
    });
});
const ASSET_STATEMENT = {
    Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
    Effect: 'Allow',
    Resource: [
        {
            'Fn::Join': ['', [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':s3:::',
                    { Ref: (0, util_1.stringLike)(/AssetParameter.*S3Bucket.*/) },
                ]],
        },
        {
            'Fn::Join': ['', [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':s3:::',
                    { Ref: (0, util_1.stringLike)(/AssetParameter.*S3Bucket.*/) },
                    '/*',
                ]],
        },
    ],
};
describe('assets n buckets', () => {
    test.each([
        ['Existing'],
        [''],
    ])('InitFile.from%sAsset', (existing) => {
        // GIVEN
        const asset = new aws_s3_assets_1.Asset(stack, 'Asset', { path: __filename });
        const init = ec2.CloudFormationInit.fromElements(existing
            ? ec2.InitFile.fromExistingAsset('/etc/fun.js', asset)
            : ec2.InitFile.fromAsset('/etc/fun.js', __filename));
        // WHEN
        init.attach(resource, linuxOptions());
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: assertions_1.Match.arrayWith([ASSET_STATEMENT]),
                Version: '2012-10-17',
            },
        });
        expectMetadataLike({
            'AWS::CloudFormation::Init': {
                config: {
                    files: {
                        '/etc/fun.js': {
                            source: {
                                'Fn::Join': ['', [
                                        'https://s3.testregion.',
                                        { Ref: 'AWS::URLSuffix' },
                                        '/',
                                        { Ref: (0, util_1.stringLike)(/AssetParameters.*/) },
                                        '/',
                                        { 'Fn::Select': [0, { 'Fn::Split': ['||', { Ref: (0, util_1.stringLike)(/AssetParameters.*/) }] }] },
                                        { 'Fn::Select': [1, { 'Fn::Split': ['||', { Ref: (0, util_1.stringLike)(/AssetParameters.*/) }] }] },
                                    ]],
                            },
                        },
                    },
                },
            },
            'AWS::CloudFormation::Authentication': {
                S3AccessCreds: {
                    type: 'S3',
                    roleName: { Ref: 'InstanceRole3CCE2F1D' },
                    buckets: [
                        { Ref: (0, util_1.stringLike)(/AssetParameters.*S3Bucket.*/) },
                    ],
                },
            },
        });
    });
    test.each([
        ['Existing'],
        [''],
    ])('InitSource.from%sAsset', (existing) => {
        // GIVEN
        const asset = new aws_s3_assets_1.Asset(stack, 'Asset', { path: path.join(__dirname, 'asset-fixture') });
        const init = ec2.CloudFormationInit.fromElements(existing
            ? ec2.InitSource.fromExistingAsset('/etc/fun', asset)
            : ec2.InitSource.fromAsset('/etc/fun', path.join(__dirname, 'asset-fixture')));
        // WHEN
        init.attach(resource, linuxOptions());
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: assertions_1.Match.arrayWith([ASSET_STATEMENT]),
                Version: '2012-10-17',
            },
        });
        expectMetadataLike({
            'AWS::CloudFormation::Init': {
                config: {
                    sources: {
                        '/etc/fun': {
                            'Fn::Join': ['', [
                                    'https://s3.testregion.',
                                    { Ref: 'AWS::URLSuffix' },
                                    '/',
                                    { Ref: (0, util_1.stringLike)(/AssetParameters.*/) },
                                    '/',
                                    { 'Fn::Select': [0, { 'Fn::Split': ['||', { Ref: (0, util_1.stringLike)(/AssetParameters.*/) }] }] },
                                    { 'Fn::Select': [1, { 'Fn::Split': ['||', { Ref: (0, util_1.stringLike)(/AssetParameters.*/) }] }] },
                                ]],
                        },
                    },
                },
            },
            'AWS::CloudFormation::Authentication': {
                S3AccessCreds: {
                    type: 'S3',
                    roleName: { Ref: 'InstanceRole3CCE2F1D' },
                    buckets: [
                        { Ref: (0, util_1.stringLike)(/AssetParameters.*S3Bucket.*/) },
                    ],
                },
            },
        });
    });
    test('InitFile.fromS3Object', () => {
        const bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'my-bucket');
        const init = ec2.CloudFormationInit.fromElements(ec2.InitFile.fromS3Object('/etc/fun.js', bucket, 'file.js'));
        // WHEN
        init.attach(resource, linuxOptions());
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: assertions_1.Match.arrayWith([{
                        Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
                        Effect: 'Allow',
                        Resource: [
                            { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':s3:::my-bucket']] },
                            { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':s3:::my-bucket/file.js']] },
                        ],
                    }]),
                Version: '2012-10-17',
            },
        });
        expectMetadataLike({
            'AWS::CloudFormation::Init': {
                config: {
                    files: {
                        '/etc/fun.js': {
                            source: { 'Fn::Join': ['', ['https://s3.testregion.', { Ref: 'AWS::URLSuffix' }, '/my-bucket/file.js']] },
                        },
                    },
                },
            },
            'AWS::CloudFormation::Authentication': {
                S3AccessCreds: {
                    type: 'S3',
                    roleName: { Ref: 'InstanceRole3CCE2F1D' },
                    buckets: ['my-bucket'],
                },
            },
        });
    });
    test('InitSource.fromS3Object', () => {
        const bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'my-bucket');
        const init = ec2.CloudFormationInit.fromElements(ec2.InitSource.fromS3Object('/etc/fun', bucket, 'file.zip'));
        // WHEN
        init.attach(resource, linuxOptions());
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: assertions_1.Match.arrayWith([{
                        Action: ['s3:GetObject*', 's3:GetBucket*', 's3:List*'],
                        Effect: 'Allow',
                        Resource: [
                            { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':s3:::my-bucket']] },
                            { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':s3:::my-bucket/file.zip']] },
                        ],
                    }]),
                Version: '2012-10-17',
            },
        });
        expectMetadataLike({
            'AWS::CloudFormation::Init': {
                config: {
                    sources: {
                        '/etc/fun': { 'Fn::Join': ['', ['https://s3.testregion.', { Ref: 'AWS::URLSuffix' }, '/my-bucket/file.zip']] },
                    },
                },
            },
            'AWS::CloudFormation::Authentication': {
                S3AccessCreds: {
                    type: 'S3',
                    roleName: { Ref: 'InstanceRole3CCE2F1D' },
                    buckets: ['my-bucket'],
                },
            },
        });
    });
    test('no duplication of bucket names when using multiple assets', () => {
        // GIVEN
        const init = ec2.CloudFormationInit.fromElements(ec2.InitFile.fromAsset('/etc/fun.js', __filename), ec2.InitSource.fromAsset('/etc/fun', path.join(__dirname, 'asset-fixture')));
        // WHEN
        init.attach(resource, linuxOptions());
        // THEN
        expectMetadataLike({
            'AWS::CloudFormation::Authentication': {
                S3AccessCreds: {
                    type: 'S3',
                    roleName: { Ref: 'InstanceRole3CCE2F1D' },
                    buckets: assertions_1.Match.arrayWith([
                        { Ref: (0, util_1.stringLike)(/AssetParameters.*S3Bucket.*/) },
                    ]),
                },
            },
        });
    });
    test('multiple buckets appear in the same auth block', () => {
        // GIVEN
        const bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'my-bucket');
        const init = ec2.CloudFormationInit.fromElements(ec2.InitFile.fromS3Object('/etc/fun.js', bucket, 'file.js'), ec2.InitSource.fromAsset('/etc/fun', path.join(__dirname, 'asset-fixture')));
        // WHEN
        init.attach(resource, linuxOptions());
        // THEN
        expectMetadataLike({
            'AWS::CloudFormation::Authentication': {
                S3AccessCreds: {
                    type: 'S3',
                    roleName: { Ref: 'InstanceRole3CCE2F1D' },
                    buckets: assertions_1.Match.arrayWith([
                        { Ref: (0, util_1.stringLike)(/AssetParameters.*S3Bucket.*/) },
                        'my-bucket',
                    ]),
                },
            },
        });
    });
    test('fingerprint data changes on asset hash update', () => {
        function calculateFingerprint(assetFilePath) {
            resetState(); // Needed so the same resources/assets/filenames can be used.
            core_1.AssetStaging.clearAssetHashCache(); // Needed so changing the content of the file will update the hash
            const init = ec2.CloudFormationInit.fromElements(ec2.InitFile.fromAsset('/etc/myFile', assetFilePath));
            init.attach(resource, linuxOptions());
            return linuxUserData.render().split('\n').find(line => line.match(/# fingerprint:/));
        }
        // Setup initial asset file
        const assetFileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cfn-init-test'));
        const assetFilePath = path.join(assetFileDir, 'fingerprint-test');
        fs.writeFileSync(assetFilePath, 'hello');
        const fingerprintOne = calculateFingerprint(assetFilePath);
        const fingerprintOneAgain = calculateFingerprint(assetFilePath);
        // Consistent without changes.
        expect(fingerprintOneAgain).toEqual(fingerprintOne);
        // Change asset file content/hash
        fs.writeFileSync(assetFilePath, ' world');
        const fingerprintTwo = calculateFingerprint(assetFilePath);
        expect(fingerprintTwo).not.toEqual(fingerprintOne);
    });
    test('fingerprint data changes on existing asset update, even for assets with unchanging URLs', () => {
        function calculateFingerprint(assetFilePath) {
            resetStateWithSynthesizer(new SingletonLocationSythesizer());
            core_1.AssetStaging.clearAssetHashCache(); // Needed so changing the content of the file will update the hash
            const init = ec2.CloudFormationInit.fromElements(ec2.InitFile.fromExistingAsset('/etc/myFile', new aws_s3_assets_1.Asset(stack, 'FileAsset', { path: assetFilePath })));
            init.attach(resource, linuxOptions());
            return linuxUserData.render().split('\n').find(line => line.match(/# fingerprint:/));
        }
        // Setup initial asset file
        const assetFileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cfn-init-test'));
        const assetFilePath = path.join(assetFileDir, 'fingerprint-test');
        fs.writeFileSync(assetFilePath, 'hello');
        const fingerprintOne = calculateFingerprint(assetFilePath);
        const fingerprintOneAgain = calculateFingerprint(assetFilePath);
        // Consistent without changes.
        expect(fingerprintOneAgain).toEqual(fingerprintOne);
        // Change asset file content/hash
        fs.writeFileSync(assetFilePath, ' world');
        const fingerprintTwo = calculateFingerprint(assetFilePath);
        expect(fingerprintTwo).not.toEqual(fingerprintOne);
    });
});
function linuxOptions() {
    return {
        platform: ec2.OperatingSystemType.LINUX,
        instanceRole,
        userData: linuxUserData,
    };
}
function expectMetadataLike(pattern) {
    assertions_1.Template.fromStack(stack).hasResource('CDK::Test::Resource', {
        Metadata: pattern,
    });
}
function expectLine(lines, re) {
    for (const line of lines) {
        if (re.test(line)) {
            return;
        }
    }
    throw new Error(`None of the lines matched '${re}': ${lines.join('\n')}`);
}
function dontExpectLine(lines, re) {
    try {
        expectLine(lines, re);
    }
    catch (e) {
        return;
    }
    throw new Error(`Found unexpected line matching '${re}': ${lines.join('\n')}`);
}
function cmdArg(command, argument) {
    return new RegExp(`${escapeRegex(command)}(\.exe)? .*${escapeRegex(argument)}`);
}
function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
/** Creates file assets that have a hard-coded asset url, rather than the default based on asset hash */
class SingletonLocationSythesizer extends core_1.DefaultStackSynthesizer {
    addFileAsset(_asset) {
        const httpUrl = 'https://MyBucket.s3.amazonaws.com/MyAsset';
        return {
            bucketName: 'myassetbucket',
            objectKey: 'MyAssetFile',
            httpUrl,
            s3ObjectUrl: httpUrl,
            s3Url: httpUrl,
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWluaXQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNmbi1pbml0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5QkFBeUI7QUFDekIseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixvREFBc0Q7QUFDdEQsd0NBQXdDO0FBQ3hDLHNDQUFzQztBQUN0QywwREFBK0M7QUFDL0Msd0NBQTJKO0FBQzNKLHlDQUF5QztBQUN6QyxpQ0FBb0M7QUFDcEMsOEJBQThCO0FBRTlCLElBQUksR0FBUSxDQUFDO0FBQ2IsSUFBSSxLQUFZLENBQUM7QUFDakIsSUFBSSxZQUFzQixDQUFDO0FBQzNCLElBQUksUUFBcUIsQ0FBQztBQUMxQixJQUFJLGFBQTJCLENBQUM7QUFDaEMsSUFBSSxjQUEyQixDQUFDO0FBRWhDLFNBQVMsVUFBVTtJQUNqQix5QkFBeUIsRUFBRSxDQUFDO0FBQzlCLENBQUM7QUFFRCxTQUFTLHlCQUF5QixDQUFDLGlCQUFxQztJQUN0RSxHQUFHLEdBQUcsSUFBSSxVQUFHLENBQUM7UUFDWixPQUFPLEVBQUU7WUFDUCxDQUFDLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxFQUFFLEtBQUs7U0FDakQ7S0FDRixDQUFDLENBQUM7SUFDSCxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRTtRQUM5QixHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUU7UUFDOUMsV0FBVyxFQUFFLGlCQUFpQjtLQUMvQixDQUFDLENBQUM7SUFDSCxZQUFZLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7UUFDakQsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDO0tBQ3pELENBQUMsQ0FBQztJQUNILFFBQVEsR0FBRyxJQUFJLGtCQUFXLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtRQUM1QyxJQUFJLEVBQUUscUJBQXFCO0tBQzVCLENBQUMsQ0FBQztJQUNILGNBQWMsR0FBRyxJQUFJLGtCQUFXLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO1FBQ3hELElBQUksRUFBRSxxQkFBcUI7S0FDNUIsQ0FBQyxDQUFDO0lBQ0gsYUFBYSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDMUMsQ0FBQztBQUFBLENBQUM7QUFFRixVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFdkIsSUFBSSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtJQUM3QyxPQUFPO0lBQ1AsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztJQUNsRCxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUM7UUFDaEMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLHVCQUF1QixFQUFFLEVBQUUscUJBQXFCLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ3BHLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSw0QkFBNEIsRUFBRSxFQUFFLHFCQUFxQixFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNyRyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxxQkFBcUIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDakUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLHFCQUFxQixFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUMvRSxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLEVBQUUsQ0FBQztLQUNsRSxDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztRQUNqRixRQUFRLEVBQUU7WUFDUixRQUFRLEVBQUU7Z0JBQ1IsS0FBSyxFQUFFO29CQUNMLE9BQU8sRUFBRSxJQUFJO29CQUNiLGFBQWEsRUFBRSxJQUFJO29CQUNuQixRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUM7b0JBQ2pCLEtBQUssRUFBRSxDQUFDLGFBQWEsQ0FBQztvQkFDdEIsUUFBUSxFQUFFO3dCQUNSLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztxQkFDZjtvQkFDRCxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUM7aUJBQ3RCO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsd0RBQXdELEVBQUUsR0FBRyxFQUFFO0lBQ2xFLFFBQVE7SUFDUixNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEMsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUV2RCxPQUFPO0lBQ1AsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2RCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO0lBRXRDLE9BQU87SUFDUCxrQkFBa0IsQ0FBQztRQUNqQiwyQkFBMkIsRUFBRTtZQUMzQixNQUFNLEVBQUU7Z0JBQ04sUUFBUSxFQUFFO29CQUNSLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFO2lCQUNsQzthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUU7SUFDdkQsUUFBUTtJQUNSLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUVuRCxPQUFPO0lBQ1AsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztJQUV0QyxPQUFPO0lBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDbEYsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLFFBQVE7SUFDUixNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdkMsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDO1FBQ2pDLEdBQUcsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDM0MsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLENBQUM7UUFDakQsVUFBVSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxFQUFFO1FBQy9DLE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7S0FDOUIsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQztJQUV0QyxPQUFPO0lBQ1Asa0JBQWtCLENBQUM7UUFDakIsMkJBQTJCLEVBQUU7WUFDM0IsVUFBVSxFQUFFO2dCQUNWLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQzthQUNyQjtZQUNELE9BQU8sRUFBRTtnQkFDUCxRQUFRLEVBQUU7b0JBQ1IsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUU7aUJBQ2xDO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUU7SUFDeEIsSUFBSSxVQUFrQyxDQUFDO0lBQ3ZDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxVQUFVLEdBQUcsR0FBRyxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FDOUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUMzQyxDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxTQUFTLGlCQUFpQixDQUFDLGVBQXVCO1FBQ2hELE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakQsVUFBVSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLFlBQVksVUFBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoRSxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVLEVBQUUsV0FBVyxVQUFHLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ25FLFVBQVUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFVBQVUsRUFBRSxjQUFjLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUUsVUFBVSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDcEQsVUFBVSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsWUFBWSxFQUFFLFlBQVksVUFBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsRSxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxZQUFZLEVBQUUsV0FBVyxVQUFHLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLFVBQVUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFlBQVksRUFBRSxjQUFjLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN6RSxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUNqRCxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUNqRCxVQUFVLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxTQUFTLG1CQUFtQixDQUMxQixlQUE2QixFQUM3QixlQUF1QjtRQUV2QixNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25ELFVBQVUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFVBQVUsRUFBRSxZQUFZLFVBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDaEUsVUFBVSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLFdBQVcsVUFBRyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuRSxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVLEVBQUUsY0FBYyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFFLFVBQVUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ3BELFVBQVUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFlBQVksRUFBRSxZQUFZLFVBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEUsVUFBVSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsWUFBWSxFQUFFLFdBQVcsVUFBRyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNyRSxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxZQUFZLEVBQUUsY0FBYyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDekUsVUFBVSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsWUFBWSxFQUFFLGtCQUFrQixDQUFDLENBQUMsQ0FBQztRQUM1RCxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUNsRCxVQUFVLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxJQUFJLENBQUMsd0NBQXdDLEVBQUUsR0FBRyxFQUFFO1FBQ2xELE9BQU87UUFDUCxVQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBRTVDLE9BQU87UUFDUCxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDeEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsdUVBQXVFLEVBQUUsR0FBRyxFQUFFO1FBQ2pGLE9BQU87UUFDUCxVQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtZQUMxQixHQUFHLFlBQVksRUFBRTtZQUNqQixjQUFjO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5QyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxtRUFBbUUsRUFBRSxHQUFHLEVBQUU7UUFDN0UsT0FBTztRQUNQLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQzFCLFFBQVEsRUFBRSxHQUFHLENBQUMsbUJBQW1CLENBQUMsS0FBSztZQUN2QyxZQUFZO1lBQ1osVUFBVSxFQUFFLElBQUk7WUFDaEIsV0FBVyxFQUFFLElBQUk7WUFDakIsUUFBUSxFQUFFLGFBQWE7U0FDeEIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakQsVUFBVSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLFlBQVksVUFBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoRSxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVLEVBQUUsV0FBVyxVQUFHLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ25FLFVBQVUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFVBQVUsRUFBRSxjQUFjLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUUsVUFBVSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLFVBQVUsWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN6RSxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVLEVBQUUsZ0NBQWdDLFVBQUcsQ0FBQyxNQUFNLElBQUksVUFBRyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN0RyxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUNwRCxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxZQUFZLEVBQUUsWUFBWSxVQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLFVBQVUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFlBQVksRUFBRSxXQUFXLFVBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckUsVUFBVSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsWUFBWSxFQUFFLGNBQWMsUUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1RSxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxVQUFVLEVBQUUsVUFBVSxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLFVBQVUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFVBQVUsRUFBRSxnQ0FBZ0MsVUFBRyxDQUFDLE1BQU0sSUFBSSxVQUFHLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RHLFVBQVUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2pELFVBQVUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQ2pELFVBQVUsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDbkMsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO1FBQ3BELE9BQU87UUFDUCxNQUFNLGVBQWUsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRWxELFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQzFCLFFBQVEsRUFBRSxHQUFHLENBQUMsbUJBQW1CLENBQUMsT0FBTztZQUN6QyxZQUFZO1lBQ1osUUFBUSxFQUFFLGVBQWU7U0FDMUIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLG1CQUFtQixDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDM0QsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMseUVBQXlFLEVBQUUsR0FBRyxFQUFFO1FBQ25GLE9BQU87UUFDUCxNQUFNLGVBQWUsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRWxELFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQzFCLFFBQVEsRUFBRSxHQUFHLENBQUMsbUJBQW1CLENBQUMsT0FBTztZQUN6QyxZQUFZO1lBQ1osUUFBUSxFQUFFLGVBQWU7WUFDekIsY0FBYztTQUNmLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxtQkFBbUIsQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2pFLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLCtDQUErQyxFQUFFLEdBQUcsRUFBRTtRQUN6RCxPQUFPO1FBQ1AsVUFBVSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7WUFDMUIsR0FBRyxZQUFZLEVBQUU7WUFDakIsY0FBYyxFQUFFLElBQUk7U0FDckIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakQsY0FBYyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDckQsVUFBVSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1FBQ3BDLE9BQU87UUFDUCxVQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtZQUMxQixHQUFHLFlBQVksRUFBRTtZQUNqQixRQUFRLEVBQUUsS0FBSztTQUNoQixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqRCxjQUFjLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUN2RCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7UUFDdEMsT0FBTztRQUNQLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQzFCLEdBQUcsWUFBWSxFQUFFO1lBQ2pCLGdCQUFnQixFQUFFLEtBQUs7U0FDeEIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakQsY0FBYyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztJQUN2QyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxzREFBc0QsRUFBRSxHQUFHLEVBQUU7UUFDaEUsT0FBTztRQUNQLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO1lBQzFCLEdBQUcsWUFBWSxFQUFFO1lBQ2pCLFVBQVUsRUFBRSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUM7U0FDaEMsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakQsVUFBVSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQztJQUMzRCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxlQUFlLEdBQUc7SUFDdEIsTUFBTSxFQUFFLENBQUMsZUFBZSxFQUFFLGVBQWUsRUFBRSxVQUFVLENBQUM7SUFDdEQsTUFBTSxFQUFFLE9BQU87SUFDZixRQUFRLEVBQUU7UUFDUjtZQUNFLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDZixNQUFNO29CQUNOLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFFO29CQUN6QixRQUFRO29CQUNSLEVBQUUsR0FBRyxFQUFFLElBQUEsaUJBQVUsRUFBQyw0QkFBNEIsQ0FBQyxFQUFFO2lCQUNsRCxDQUFDO1NBQ0g7UUFDRDtZQUNFLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDZixNQUFNO29CQUNOLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFFO29CQUN6QixRQUFRO29CQUNSLEVBQUUsR0FBRyxFQUFFLElBQUEsaUJBQVUsRUFBQyw0QkFBNEIsQ0FBQyxFQUFFO29CQUNqRCxJQUFJO2lCQUNMLENBQUM7U0FDSDtLQUNGO0NBQ0YsQ0FBQztBQUVGLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFFaEMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNSLENBQUMsVUFBVSxDQUFDO1FBQ1osQ0FBQyxFQUFFLENBQUM7S0FDTCxDQUFDLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxRQUFnQixFQUFFLEVBQUU7UUFDOUMsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUkscUJBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDOUQsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FDOUMsUUFBUTtZQUNOLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUM7WUFDdEQsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FDdEQsQ0FBQztRQUVGLE9BQU87UUFDUCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBRXRDLE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsRUFBRTtZQUNsRSxjQUFjLEVBQUU7Z0JBQ2QsU0FBUyxFQUFFLGtCQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQzdDLE9BQU8sRUFBRSxZQUFZO2FBQ3RCO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsa0JBQWtCLENBQUM7WUFDakIsMkJBQTJCLEVBQUU7Z0JBQzNCLE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUU7d0JBQ0wsYUFBYSxFQUFFOzRCQUNiLE1BQU0sRUFBRTtnQ0FDTixVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0NBQ2Ysd0JBQXdCO3dDQUN4QixFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRTt3Q0FDekIsR0FBRzt3Q0FDSCxFQUFFLEdBQUcsRUFBRSxJQUFBLGlCQUFVLEVBQUMsbUJBQW1CLENBQUMsRUFBRTt3Q0FDeEMsR0FBRzt3Q0FDSCxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFBLGlCQUFVLEVBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO3dDQUN4RixFQUFFLFlBQVksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFBLGlCQUFVLEVBQUMsbUJBQW1CLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO3FDQUN6RixDQUFDOzZCQUNIO3lCQUNGO3FCQUNGO2lCQUNGO2FBQ0Y7WUFDRCxxQ0FBcUMsRUFBRTtnQkFDckMsYUFBYSxFQUFFO29CQUNiLElBQUksRUFBRSxJQUFJO29CQUNWLFFBQVEsRUFBRSxFQUFFLEdBQUcsRUFBRSxzQkFBc0IsRUFBRTtvQkFDekMsT0FBTyxFQUFFO3dCQUNQLEVBQUUsR0FBRyxFQUFFLElBQUEsaUJBQVUsRUFBQyw2QkFBNkIsQ0FBQyxFQUFFO3FCQUNuRDtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ1IsQ0FBQyxVQUFVLENBQUM7UUFDWixDQUFDLEVBQUUsQ0FBQztLQUNMLENBQUMsQ0FBQyx3QkFBd0IsRUFBRSxDQUFDLFFBQWdCLEVBQUUsRUFBRTtRQUNoRCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxxQkFBSyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pGLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQzlDLFFBQVE7WUFDTixDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDO1lBQ3JELENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FDaEYsQ0FBQztRQUVGLE9BQU87UUFDUCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBRXRDLE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsRUFBRTtZQUNsRSxjQUFjLEVBQUU7Z0JBQ2QsU0FBUyxFQUFFLGtCQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUM7Z0JBQzdDLE9BQU8sRUFBRSxZQUFZO2FBQ3RCO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsa0JBQWtCLENBQUM7WUFDakIsMkJBQTJCLEVBQUU7Z0JBQzNCLE1BQU0sRUFBRTtvQkFDTixPQUFPLEVBQUU7d0JBQ1AsVUFBVSxFQUFFOzRCQUNWLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQ0FDZix3QkFBd0I7b0NBQ3hCLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFFO29DQUN6QixHQUFHO29DQUNILEVBQUUsR0FBRyxFQUFFLElBQUEsaUJBQVUsRUFBQyxtQkFBbUIsQ0FBQyxFQUFFO29DQUN4QyxHQUFHO29DQUNILEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsV0FBVyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUEsaUJBQVUsRUFBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7b0NBQ3hGLEVBQUUsWUFBWSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsV0FBVyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUEsaUJBQVUsRUFBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7aUNBQ3pGLENBQUM7eUJBQ0g7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNELHFDQUFxQyxFQUFFO2dCQUNyQyxhQUFhLEVBQUU7b0JBQ2IsSUFBSSxFQUFFLElBQUk7b0JBQ1YsUUFBUSxFQUFFLEVBQUUsR0FBRyxFQUFFLHNCQUFzQixFQUFFO29CQUN6QyxPQUFPLEVBQUU7d0JBQ1AsRUFBRSxHQUFHLEVBQUUsSUFBQSxpQkFBVSxFQUFDLDZCQUE2QixDQUFDLEVBQUU7cUJBQ25EO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUU7UUFDakMsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN0RSxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUM5QyxHQUFHLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUM1RCxDQUFDO1FBRUYsT0FBTztRQUNQLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7UUFFdEMsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFO1lBQ2xFLGNBQWMsRUFBRTtnQkFDZCxTQUFTLEVBQUUsa0JBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQzt3QkFDMUIsTUFBTSxFQUFFLENBQUMsZUFBZSxFQUFFLGVBQWUsRUFBRSxVQUFVLENBQUM7d0JBQ3RELE1BQU0sRUFBRSxPQUFPO3dCQUNmLFFBQVEsRUFBRTs0QkFDUixFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLGlCQUFpQixDQUFDLENBQUMsRUFBRTs0QkFDNUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDLEVBQUU7eUJBQ3JGO3FCQUNGLENBQUMsQ0FBQztnQkFDSCxPQUFPLEVBQUUsWUFBWTthQUN0QjtTQUNGLENBQUMsQ0FBQztRQUNILGtCQUFrQixDQUFDO1lBQ2pCLDJCQUEyQixFQUFFO2dCQUMzQixNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFO3dCQUNMLGFBQWEsRUFBRTs0QkFDYixNQUFNLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLG9CQUFvQixDQUFDLENBQUMsRUFBRTt5QkFDMUc7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNELHFDQUFxQyxFQUFFO2dCQUNyQyxhQUFhLEVBQUU7b0JBQ2IsSUFBSSxFQUFFLElBQUk7b0JBQ1YsUUFBUSxFQUFFLEVBQUUsR0FBRyxFQUFFLHNCQUFzQixFQUFFO29CQUN6QyxPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUM7aUJBQ3ZCO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUU7UUFDbkMsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN0RSxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUM5QyxHQUFHLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUM1RCxDQUFDO1FBRUYsT0FBTztRQUNQLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7UUFFdEMsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFO1lBQ2xFLGNBQWMsRUFBRTtnQkFDZCxTQUFTLEVBQUUsa0JBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQzt3QkFDMUIsTUFBTSxFQUFFLENBQUMsZUFBZSxFQUFFLGVBQWUsRUFBRSxVQUFVLENBQUM7d0JBQ3RELE1BQU0sRUFBRSxPQUFPO3dCQUNmLFFBQVEsRUFBRTs0QkFDUixFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLGlCQUFpQixDQUFDLENBQUMsRUFBRTs0QkFDNUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDLEVBQUU7eUJBQ3RGO3FCQUNGLENBQUMsQ0FBQztnQkFDSCxPQUFPLEVBQUUsWUFBWTthQUN0QjtTQUNGLENBQUMsQ0FBQztRQUNILGtCQUFrQixDQUFDO1lBQ2pCLDJCQUEyQixFQUFFO2dCQUMzQixNQUFNLEVBQUU7b0JBQ04sT0FBTyxFQUFFO3dCQUNQLFVBQVUsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLHdCQUF3QixFQUFFLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFFLEVBQUUscUJBQXFCLENBQUMsQ0FBQyxFQUFFO3FCQUMvRztpQkFDRjthQUNGO1lBQ0QscUNBQXFDLEVBQUU7Z0JBQ3JDLGFBQWEsRUFBRTtvQkFDYixJQUFJLEVBQUUsSUFBSTtvQkFDVixRQUFRLEVBQUUsRUFBRSxHQUFHLEVBQUUsc0JBQXNCLEVBQUU7b0JBQ3pDLE9BQU8sRUFBRSxDQUFDLFdBQVcsQ0FBQztpQkFDdkI7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDJEQUEyRCxFQUFFLEdBQUcsRUFBRTtRQUNyRSxRQUFRO1FBQ1IsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FDOUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxFQUNqRCxHQUFHLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FDNUUsQ0FBQztRQUVGLE9BQU87UUFDUCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO1FBRXRDLE9BQU87UUFDUCxrQkFBa0IsQ0FBQztZQUNqQixxQ0FBcUMsRUFBRTtnQkFDckMsYUFBYSxFQUFFO29CQUNiLElBQUksRUFBRSxJQUFJO29CQUNWLFFBQVEsRUFBRSxFQUFFLEdBQUcsRUFBRSxzQkFBc0IsRUFBRTtvQkFDekMsT0FBTyxFQUFFLGtCQUFLLENBQUMsU0FBUyxDQUFDO3dCQUN2QixFQUFFLEdBQUcsRUFBRSxJQUFBLGlCQUFVLEVBQUMsNkJBQTZCLENBQUMsRUFBRTtxQkFDbkQsQ0FBQztpQkFDSDthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsZ0RBQWdELEVBQUUsR0FBRyxFQUFFO1FBQzFELFFBQVE7UUFDUixNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQzlDLEdBQUcsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLEVBQzNELEdBQUcsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUM1RSxDQUFDO1FBRUYsT0FBTztRQUNQLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7UUFFdEMsT0FBTztRQUNQLGtCQUFrQixDQUFDO1lBQ2pCLHFDQUFxQyxFQUFFO2dCQUNyQyxhQUFhLEVBQUU7b0JBQ2IsSUFBSSxFQUFFLElBQUk7b0JBQ1YsUUFBUSxFQUFFLEVBQUUsR0FBRyxFQUFFLHNCQUFzQixFQUFFO29CQUN6QyxPQUFPLEVBQUUsa0JBQUssQ0FBQyxTQUFTLENBQUM7d0JBQ3ZCLEVBQUUsR0FBRyxFQUFFLElBQUEsaUJBQVUsRUFBQyw2QkFBNkIsQ0FBQyxFQUFFO3dCQUNsRCxXQUFXO3FCQUNaLENBQUM7aUJBQ0g7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLCtDQUErQyxFQUFFLEdBQUcsRUFBRTtRQUN6RCxTQUFTLG9CQUFvQixDQUFDLGFBQXFCO1lBQ2pELFVBQVUsRUFBRSxDQUFDLENBQUMsNkRBQTZEO1lBQzNFLG1CQUFZLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLGtFQUFrRTtZQUN0RyxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUM5QyxHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLENBQ3JELENBQUM7WUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsQ0FBQyxDQUFDO1lBRXRDLE9BQU8sYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztRQUN2RixDQUFDO1FBRUQsMkJBQTJCO1FBQzNCLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQztRQUM3RSxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2xFLEVBQUUsQ0FBQyxhQUFhLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXpDLE1BQU0sY0FBYyxHQUFHLG9CQUFvQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzNELE1BQU0sbUJBQW1CLEdBQUcsb0JBQW9CLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDaEUsOEJBQThCO1FBQzlCLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVwRCxpQ0FBaUM7UUFDakMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFMUMsTUFBTSxjQUFjLEdBQUcsb0JBQW9CLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFM0QsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDckQsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMseUZBQXlGLEVBQUUsR0FBRyxFQUFFO1FBQ25HLFNBQVMsb0JBQW9CLENBQUMsYUFBcUI7WUFDakQseUJBQXlCLENBQUMsSUFBSSwyQkFBMkIsRUFBRSxDQUFDLENBQUM7WUFDN0QsbUJBQVksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUMsa0VBQWtFO1lBQ3RHLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLENBQzlDLEdBQUcsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLElBQUkscUJBQUssQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FDdEcsQ0FBQztZQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7WUFFdEMsT0FBTyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1FBQ3ZGLENBQUM7UUFFRCwyQkFBMkI7UUFDM0IsTUFBTSxZQUFZLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBQzdFLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDbEUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFekMsTUFBTSxjQUFjLEdBQUcsb0JBQW9CLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDM0QsTUFBTSxtQkFBbUIsR0FBRyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNoRSw4QkFBOEI7UUFDOUIsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRXBELGlDQUFpQztRQUNqQyxFQUFFLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUUxQyxNQUFNLGNBQWMsR0FBRyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUUzRCxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUNyRCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsU0FBUyxZQUFZO0lBQ25CLE9BQU87UUFDTCxRQUFRLEVBQUUsR0FBRyxDQUFDLG1CQUFtQixDQUFDLEtBQUs7UUFDdkMsWUFBWTtRQUNaLFFBQVEsRUFBRSxhQUFhO0tBQ3hCLENBQUM7QUFDSixDQUFDO0FBRUQsU0FBUyxrQkFBa0IsQ0FBQyxPQUFZO0lBQ3RDLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsRUFBRTtRQUMzRCxRQUFRLEVBQUUsT0FBTztLQUNsQixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsU0FBUyxVQUFVLENBQUMsS0FBZSxFQUFFLEVBQVU7SUFDN0MsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7UUFDeEIsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQUUsT0FBTztTQUFFO0tBQy9CO0lBRUQsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsRUFBRSxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzVFLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxLQUFlLEVBQUUsRUFBVTtJQUNqRCxJQUFJO1FBQ0YsVUFBVSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUN2QjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTztLQUNSO0lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQ0FBbUMsRUFBRSxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2pGLENBQUM7QUFFRCxTQUFTLE1BQU0sQ0FBQyxPQUFlLEVBQUUsUUFBZ0I7SUFDL0MsT0FBTyxJQUFJLE1BQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsY0FBYyxXQUFXLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2xGLENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxDQUFTO0lBQzVCLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLG9DQUFvQztBQUN2RixDQUFDO0FBRUQsd0dBQXdHO0FBQ3hHLE1BQU0sMkJBQTRCLFNBQVEsOEJBQXVCO0lBQ3hELFlBQVksQ0FBQyxNQUF1QjtRQUN6QyxNQUFNLE9BQU8sR0FBRywyQ0FBMkMsQ0FBQztRQUM1RCxPQUFPO1lBQ0wsVUFBVSxFQUFFLGVBQWU7WUFDM0IsU0FBUyxFQUFFLGFBQWE7WUFDeEIsT0FBTztZQUNQLFdBQVcsRUFBRSxPQUFPO1lBQ3BCLEtBQUssRUFBRSxPQUFPO1NBQ2YsQ0FBQztLQUNIO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBvcyBmcm9tICdvcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0IHsgQXNzZXQgfSBmcm9tICdAYXdzLWNkay9hd3MtczMtYXNzZXRzJztcbmltcG9ydCB7IEFzc2V0U3RhZ2luZywgQXBwLCBBd3MsIENmblJlc291cmNlLCBTdGFjaywgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIsIElTdGFja1N5bnRoZXNpemVyLCBGaWxlQXNzZXRTb3VyY2UsIEZpbGVBc3NldExvY2F0aW9uIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgc3RyaW5nTGlrZSB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnLi4vbGliJztcblxubGV0IGFwcDogQXBwO1xubGV0IHN0YWNrOiBTdGFjaztcbmxldCBpbnN0YW5jZVJvbGU6IGlhbS5Sb2xlO1xubGV0IHJlc291cmNlOiBDZm5SZXNvdXJjZTtcbmxldCBsaW51eFVzZXJEYXRhOiBlYzIuVXNlckRhdGE7XG5sZXQgc2lnbmFsUmVzb3VyY2U6IENmblJlc291cmNlO1xuXG5mdW5jdGlvbiByZXNldFN0YXRlKCkge1xuICByZXNldFN0YXRlV2l0aFN5bnRoZXNpemVyKCk7XG59XG5cbmZ1bmN0aW9uIHJlc2V0U3RhdGVXaXRoU3ludGhlc2l6ZXIoY3VzdG9tU3ludGhlc2l6ZXI/OiBJU3RhY2tTeW50aGVzaXplcikge1xuICBhcHAgPSBuZXcgQXBwKHtcbiAgICBjb250ZXh0OiB7XG4gICAgICBbY3hhcGkuTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXTogZmFsc2UsXG4gICAgfSxcbiAgfSk7XG4gIHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJywge1xuICAgIGVudjogeyBhY2NvdW50OiAnMTIzNCcsIHJlZ2lvbjogJ3Rlc3RyZWdpb24nIH0sXG4gICAgc3ludGhlc2l6ZXI6IGN1c3RvbVN5bnRoZXNpemVyLFxuICB9KTtcbiAgaW5zdGFuY2VSb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnSW5zdGFuY2VSb2xlJywge1xuICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlYzIuYW1hem9uYXdzLmNvbScpLFxuICB9KTtcbiAgcmVzb3VyY2UgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZScsIHtcbiAgICB0eXBlOiAnQ0RLOjpUZXN0OjpSZXNvdXJjZScsXG4gIH0pO1xuICBzaWduYWxSZXNvdXJjZSA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1NpZ25hbFJlc291cmNlJywge1xuICAgIHR5cGU6ICdDREs6OlRlc3Q6OlJlc291cmNlJyxcbiAgfSk7XG4gIGxpbnV4VXNlckRhdGEgPSBlYzIuVXNlckRhdGEuZm9yTGludXgoKTtcbn07XG5cbmJlZm9yZUVhY2gocmVzZXRTdGF0ZSk7XG5cbnRlc3QoJ3dob2xlIGNvbmZpZyB3aXRoIHJlc3RhcnQgaGFuZGxlcycsICgpID0+IHtcbiAgLy8gV0hFTlxuICBjb25zdCBoYW5kbGUgPSBuZXcgZWMyLkluaXRTZXJ2aWNlUmVzdGFydEhhbmRsZSgpO1xuICBjb25zdCBjb25maWcgPSBuZXcgZWMyLkluaXRDb25maWcoW1xuICAgIGVjMi5Jbml0RmlsZS5mcm9tU3RyaW5nKCcvZXRjL215LmNuZicsICdbbXlzcWxdXFxuZ29fZmFzdD10cnVlJywgeyBzZXJ2aWNlUmVzdGFydEhhbmRsZXM6IFtoYW5kbGVdIH0pLFxuICAgIGVjMi5Jbml0U291cmNlLmZyb21VcmwoJy90bXAvZm9vJywgJ2h0dHBzOi8vYW1hem9uLmNvbS9mb28uemlwJywgeyBzZXJ2aWNlUmVzdGFydEhhbmRsZXM6IFtoYW5kbGVdIH0pLFxuICAgIGVjMi5Jbml0UGFja2FnZS55dW0oJ2h0dHBkJywgeyBzZXJ2aWNlUmVzdGFydEhhbmRsZXM6IFtoYW5kbGVdIH0pLFxuICAgIGVjMi5Jbml0Q29tbWFuZC5hcmd2Q29tbWFuZChbJy9iaW4vdHJ1ZSddLCB7IHNlcnZpY2VSZXN0YXJ0SGFuZGxlczogW2hhbmRsZV0gfSksXG4gICAgZWMyLkluaXRTZXJ2aWNlLmVuYWJsZSgnaHR0cGQnLCB7IHNlcnZpY2VSZXN0YXJ0SGFuZGxlOiBoYW5kbGUgfSksXG4gIF0pO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KGNvbmZpZy5fYmluZChzdGFjaywgbGludXhPcHRpb25zKCkpLmNvbmZpZykudG9FcXVhbChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgc2VydmljZXM6IHtcbiAgICAgIHN5c3Zpbml0OiB7XG4gICAgICAgIGh0dHBkOiB7XG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICBlbnN1cmVSdW5uaW5nOiB0cnVlLFxuICAgICAgICAgIGNvbW1hbmRzOiBbJzAwMCddLFxuICAgICAgICAgIGZpbGVzOiBbJy9ldGMvbXkuY25mJ10sXG4gICAgICAgICAgcGFja2FnZXM6IHtcbiAgICAgICAgICAgIHl1bTogWydodHRwZCddLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgc291cmNlczogWycvdG1wL2ZvbyddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9KSk7XG59KTtcblxudGVzdCgnQ2xvdWRGb3JtYXRpb25Jbml0IGNhbiBiZSBhZGRlZCB0byBhZnRlciBpbnN0YW50aWF0aW9uJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBjb25maWcgPSBuZXcgZWMyLkluaXRDb25maWcoW10pO1xuICBjb25zdCBpbml0ID0gZWMyLkNsb3VkRm9ybWF0aW9uSW5pdC5mcm9tQ29uZmlnKGNvbmZpZyk7XG5cbiAgLy8gV0hFTlxuICBjb25maWcuYWRkKGVjMi5Jbml0Q29tbWFuZC5hcmd2Q29tbWFuZChbJy9iaW4vdHJ1ZSddKSk7XG4gIGluaXQuYXR0YWNoKHJlc291cmNlLCBsaW51eE9wdGlvbnMoKSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3RNZXRhZGF0YUxpa2Uoe1xuICAgICdBV1M6OkNsb3VkRm9ybWF0aW9uOjpJbml0Jzoge1xuICAgICAgY29uZmlnOiB7XG4gICAgICAgIGNvbW1hbmRzOiB7XG4gICAgICAgICAgJzAwMCc6IHsgY29tbWFuZDogWycvYmluL3RydWUnXSB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdDbG91ZEZvcm1hdGlvbkluaXQgY2Fubm90IGJlIGF0dGFjaGVkIHR3aWNlJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBpbml0ID0gZWMyLkNsb3VkRm9ybWF0aW9uSW5pdC5mcm9tRWxlbWVudHMoKTtcblxuICAvLyBXSEVOXG4gIGluaXQuYXR0YWNoKHJlc291cmNlLCBsaW51eE9wdGlvbnMoKSk7XG5cbiAgLy8gVEhFTlxuICBleHBlY3QoKCkgPT4geyBpbml0LmF0dGFjaChyZXNvdXJjZSwgbGludXhPcHRpb25zKCkpOyB9KS50b1Rocm93KC9hbHJlYWR5IGhhcy8pO1xufSk7XG5cbnRlc3QoJ2VtcHR5IGNvbmZpZ3MgYXJlIG5vdCByZW5kZXJlZCcsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3QgY29uZmlnMSA9IG5ldyBlYzIuSW5pdENvbmZpZyhbXSk7XG4gIGNvbnN0IGNvbmZpZzIgPSBuZXcgZWMyLkluaXRDb25maWcoW1xuICAgIGVjMi5Jbml0Q29tbWFuZC5hcmd2Q29tbWFuZChbJy9iaW4vdHJ1ZSddKSxcbiAgXSk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBpbml0ID0gZWMyLkNsb3VkRm9ybWF0aW9uSW5pdC5mcm9tQ29uZmlnU2V0cyh7XG4gICAgY29uZmlnU2V0czogeyBkZWZhdWx0OiBbJ2NvbmZpZzInLCAnY29uZmlnMSddIH0sXG4gICAgY29uZmlnczogeyBjb25maWcxLCBjb25maWcyIH0sXG4gIH0pO1xuICBpbml0LmF0dGFjaChyZXNvdXJjZSwgbGludXhPcHRpb25zKCkpO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0TWV0YWRhdGFMaWtlKHtcbiAgICAnQVdTOjpDbG91ZEZvcm1hdGlvbjo6SW5pdCc6IHtcbiAgICAgIGNvbmZpZ1NldHM6IHtcbiAgICAgICAgZGVmYXVsdDogWydjb25maWcyJ10sXG4gICAgICB9LFxuICAgICAgY29uZmlnMjoge1xuICAgICAgICBjb21tYW5kczoge1xuICAgICAgICAgICcwMDAnOiB7IGNvbW1hbmQ6IFsnL2Jpbi90cnVlJ10gfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ3VzZXJkYXRhJywgKCkgPT4ge1xuICBsZXQgc2ltcGxlSW5pdDogZWMyLkNsb3VkRm9ybWF0aW9uSW5pdDtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgc2ltcGxlSW5pdCA9IGVjMi5DbG91ZEZvcm1hdGlvbkluaXQuZnJvbUVsZW1lbnRzKFxuICAgICAgZWMyLkluaXRDb21tYW5kLmFyZ3ZDb21tYW5kKFsnL2Jpbi90cnVlJ10pLFxuICAgICk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGxpbnV4VXNlckRhdGFUZXN0KHNpZ25hbExvZ2ljYWxJZDogc3RyaW5nKSB7XG4gICAgY29uc3QgbGluZXMgPSBsaW51eFVzZXJEYXRhLnJlbmRlcigpLnNwbGl0KCdcXG4nKTtcbiAgICBleHBlY3RMaW5lKGxpbmVzLCBjbWRBcmcoJ2Nmbi1pbml0JywgYC0tcmVnaW9uICR7QXdzLlJFR0lPTn1gKSk7XG4gICAgZXhwZWN0TGluZShsaW5lcywgY21kQXJnKCdjZm4taW5pdCcsIGAtLXN0YWNrICR7QXdzLlNUQUNLX05BTUV9YCkpO1xuICAgIGV4cGVjdExpbmUobGluZXMsIGNtZEFyZygnY2ZuLWluaXQnLCBgLS1yZXNvdXJjZSAke3Jlc291cmNlLmxvZ2ljYWxJZH1gKSk7XG4gICAgZXhwZWN0TGluZShsaW5lcywgY21kQXJnKCdjZm4taW5pdCcsICctYyBkZWZhdWx0JykpO1xuICAgIGV4cGVjdExpbmUobGluZXMsIGNtZEFyZygnY2ZuLXNpZ25hbCcsIGAtLXJlZ2lvbiAke0F3cy5SRUdJT059YCkpO1xuICAgIGV4cGVjdExpbmUobGluZXMsIGNtZEFyZygnY2ZuLXNpZ25hbCcsIGAtLXN0YWNrICR7QXdzLlNUQUNLX05BTUV9YCkpO1xuICAgIGV4cGVjdExpbmUobGluZXMsIGNtZEFyZygnY2ZuLXNpZ25hbCcsIGAtLXJlc291cmNlICR7c2lnbmFsTG9naWNhbElkfWApKTtcbiAgICBleHBlY3RMaW5lKGxpbmVzLCBjbWRBcmcoJ2Nmbi1zaWduYWwnLCAnLWUgJD8nKSk7XG4gICAgZXhwZWN0TGluZShsaW5lcywgY21kQXJnKCdjYXQnLCAnY2ZuLWluaXQubG9nJykpO1xuICAgIGV4cGVjdExpbmUobGluZXMsIC9maW5nZXJwcmludC8pO1xuICB9XG5cbiAgZnVuY3Rpb24gd2luZG93c1VzZXJEYXRhVGVzdChcbiAgICB3aW5kb3dzVXNlckRhdGE6IGVjMi5Vc2VyRGF0YSxcbiAgICBzaWduYWxMb2dpY2FsSWQ6IHN0cmluZyxcbiAgKSB7XG4gICAgY29uc3QgbGluZXMgPSB3aW5kb3dzVXNlckRhdGEucmVuZGVyKCkuc3BsaXQoJ1xcbicpO1xuICAgIGV4cGVjdExpbmUobGluZXMsIGNtZEFyZygnY2ZuLWluaXQnLCBgLS1yZWdpb24gJHtBd3MuUkVHSU9OfWApKTtcbiAgICBleHBlY3RMaW5lKGxpbmVzLCBjbWRBcmcoJ2Nmbi1pbml0JywgYC0tc3RhY2sgJHtBd3MuU1RBQ0tfTkFNRX1gKSk7XG4gICAgZXhwZWN0TGluZShsaW5lcywgY21kQXJnKCdjZm4taW5pdCcsIGAtLXJlc291cmNlICR7cmVzb3VyY2UubG9naWNhbElkfWApKTtcbiAgICBleHBlY3RMaW5lKGxpbmVzLCBjbWRBcmcoJ2Nmbi1pbml0JywgJy1jIGRlZmF1bHQnKSk7XG4gICAgZXhwZWN0TGluZShsaW5lcywgY21kQXJnKCdjZm4tc2lnbmFsJywgYC0tcmVnaW9uICR7QXdzLlJFR0lPTn1gKSk7XG4gICAgZXhwZWN0TGluZShsaW5lcywgY21kQXJnKCdjZm4tc2lnbmFsJywgYC0tc3RhY2sgJHtBd3MuU1RBQ0tfTkFNRX1gKSk7XG4gICAgZXhwZWN0TGluZShsaW5lcywgY21kQXJnKCdjZm4tc2lnbmFsJywgYC0tcmVzb3VyY2UgJHtzaWduYWxMb2dpY2FsSWR9YCkpO1xuICAgIGV4cGVjdExpbmUobGluZXMsIGNtZEFyZygnY2ZuLXNpZ25hbCcsICctZSAkTEFTVEVYSVRDT0RFJykpO1xuICAgIGV4cGVjdExpbmUobGluZXMsIGNtZEFyZygndHlwZScsICdjZm4taW5pdC5sb2cnKSk7XG4gICAgZXhwZWN0TGluZShsaW5lcywgL2ZpbmdlcnByaW50Lyk7XG4gIH1cblxuICB0ZXN0KCdsaW51eCB1c2VyZGF0YSBjb250YWlucyByaWdodCBjb21tYW5kcycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgc2ltcGxlSW5pdC5hdHRhY2gocmVzb3VyY2UsIGxpbnV4T3B0aW9ucygpKTtcblxuICAgIC8vIFRIRU5cbiAgICBsaW51eFVzZXJEYXRhVGVzdChyZXNvdXJjZS5sb2dpY2FsSWQpO1xuICB9KTtcblxuICB0ZXN0KCdsaW51eCB1c2VyZGF0YSBjb250YWlucyByaWdodCBjb21tYW5kcyB3aXRoIGRpZmZlcmVudCBzaWduYWwgcmVzb3VyY2UnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIHNpbXBsZUluaXQuYXR0YWNoKHJlc291cmNlLCB7XG4gICAgICAuLi5saW51eE9wdGlvbnMoKSxcbiAgICAgIHNpZ25hbFJlc291cmNlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGxpbnV4VXNlckRhdGFUZXN0KHNpZ25hbFJlc291cmNlLmxvZ2ljYWxJZCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2xpbnV4IHVzZXJkYXRhIGNvbnRhaW5zIHJpZ2h0IGNvbW1hbmRzIHdoZW4gdXJsIGFuZCByb2xlIGluY2x1ZGVkJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBzaW1wbGVJbml0LmF0dGFjaChyZXNvdXJjZSwge1xuICAgICAgcGxhdGZvcm06IGVjMi5PcGVyYXRpbmdTeXN0ZW1UeXBlLkxJTlVYLFxuICAgICAgaW5zdGFuY2VSb2xlLFxuICAgICAgaW5jbHVkZVVybDogdHJ1ZSxcbiAgICAgIGluY2x1ZGVSb2xlOiB0cnVlLFxuICAgICAgdXNlckRhdGE6IGxpbnV4VXNlckRhdGEsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgbGluZXMgPSBsaW51eFVzZXJEYXRhLnJlbmRlcigpLnNwbGl0KCdcXG4nKTtcbiAgICBleHBlY3RMaW5lKGxpbmVzLCBjbWRBcmcoJ2Nmbi1pbml0JywgYC0tcmVnaW9uICR7QXdzLlJFR0lPTn1gKSk7XG4gICAgZXhwZWN0TGluZShsaW5lcywgY21kQXJnKCdjZm4taW5pdCcsIGAtLXN0YWNrICR7QXdzLlNUQUNLX05BTUV9YCkpO1xuICAgIGV4cGVjdExpbmUobGluZXMsIGNtZEFyZygnY2ZuLWluaXQnLCBgLS1yZXNvdXJjZSAke3Jlc291cmNlLmxvZ2ljYWxJZH1gKSk7XG4gICAgZXhwZWN0TGluZShsaW5lcywgY21kQXJnKCdjZm4taW5pdCcsIGAtLXJvbGUgJHtpbnN0YW5jZVJvbGUucm9sZU5hbWV9YCkpO1xuICAgIGV4cGVjdExpbmUobGluZXMsIGNtZEFyZygnY2ZuLWluaXQnLCBgLS11cmwgaHR0cHM6Ly9jbG91ZGZvcm1hdGlvbi4ke0F3cy5SRUdJT059LiR7QXdzLlVSTF9TVUZGSVh9YCkpO1xuICAgIGV4cGVjdExpbmUobGluZXMsIGNtZEFyZygnY2ZuLWluaXQnLCAnLWMgZGVmYXVsdCcpKTtcbiAgICBleHBlY3RMaW5lKGxpbmVzLCBjbWRBcmcoJ2Nmbi1zaWduYWwnLCBgLS1yZWdpb24gJHtBd3MuUkVHSU9OfWApKTtcbiAgICBleHBlY3RMaW5lKGxpbmVzLCBjbWRBcmcoJ2Nmbi1zaWduYWwnLCBgLS1zdGFjayAke0F3cy5TVEFDS19OQU1FfWApKTtcbiAgICBleHBlY3RMaW5lKGxpbmVzLCBjbWRBcmcoJ2Nmbi1zaWduYWwnLCBgLS1yZXNvdXJjZSAke3Jlc291cmNlLmxvZ2ljYWxJZH1gKSk7XG4gICAgZXhwZWN0TGluZShsaW5lcywgY21kQXJnKCdjZm4taW5pdCcsIGAtLXJvbGUgJHtpbnN0YW5jZVJvbGUucm9sZU5hbWV9YCkpO1xuICAgIGV4cGVjdExpbmUobGluZXMsIGNtZEFyZygnY2ZuLWluaXQnLCBgLS11cmwgaHR0cHM6Ly9jbG91ZGZvcm1hdGlvbi4ke0F3cy5SRUdJT059LiR7QXdzLlVSTF9TVUZGSVh9YCkpO1xuICAgIGV4cGVjdExpbmUobGluZXMsIGNtZEFyZygnY2ZuLXNpZ25hbCcsICctZSAkPycpKTtcbiAgICBleHBlY3RMaW5lKGxpbmVzLCBjbWRBcmcoJ2NhdCcsICdjZm4taW5pdC5sb2cnKSk7XG4gICAgZXhwZWN0TGluZShsaW5lcywgL2ZpbmdlcnByaW50Lyk7XG4gIH0pO1xuXG4gIHRlc3QoJ1dpbmRvd3MgdXNlcmRhdGEgY29udGFpbnMgcmlnaHQgY29tbWFuZHMnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHdpbmRvd3NVc2VyRGF0YSA9IGVjMi5Vc2VyRGF0YS5mb3JXaW5kb3dzKCk7XG5cbiAgICBzaW1wbGVJbml0LmF0dGFjaChyZXNvdXJjZSwge1xuICAgICAgcGxhdGZvcm06IGVjMi5PcGVyYXRpbmdTeXN0ZW1UeXBlLldJTkRPV1MsXG4gICAgICBpbnN0YW5jZVJvbGUsXG4gICAgICB1c2VyRGF0YTogd2luZG93c1VzZXJEYXRhLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIHdpbmRvd3NVc2VyRGF0YVRlc3Qod2luZG93c1VzZXJEYXRhLCByZXNvdXJjZS5sb2dpY2FsSWQpO1xuICB9KTtcblxuICB0ZXN0KCdXaW5kb3dzIHVzZXJkYXRhIGNvbnRhaW5zIHJpZ2h0IGNvbW1hbmRzIHdpdGggZGlmZmVyZW50IHNpZ25hbCByZXNvdXJjZScsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgd2luZG93c1VzZXJEYXRhID0gZWMyLlVzZXJEYXRhLmZvcldpbmRvd3MoKTtcblxuICAgIHNpbXBsZUluaXQuYXR0YWNoKHJlc291cmNlLCB7XG4gICAgICBwbGF0Zm9ybTogZWMyLk9wZXJhdGluZ1N5c3RlbVR5cGUuV0lORE9XUyxcbiAgICAgIGluc3RhbmNlUm9sZSxcbiAgICAgIHVzZXJEYXRhOiB3aW5kb3dzVXNlckRhdGEsXG4gICAgICBzaWduYWxSZXNvdXJjZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICB3aW5kb3dzVXNlckRhdGFUZXN0KHdpbmRvd3NVc2VyRGF0YSwgc2lnbmFsUmVzb3VyY2UubG9naWNhbElkKTtcbiAgfSk7XG5cbiAgdGVzdCgnaWdub3JlRmFpbHVyZXMgZGlzYWJsZXMgcmVzdWx0IGNvZGUgcmVwb3J0aW5nJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBzaW1wbGVJbml0LmF0dGFjaChyZXNvdXJjZSwge1xuICAgICAgLi4ubGludXhPcHRpb25zKCksXG4gICAgICBpZ25vcmVGYWlsdXJlczogdHJ1ZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBsaW5lcyA9IGxpbnV4VXNlckRhdGEucmVuZGVyKCkuc3BsaXQoJ1xcbicpO1xuICAgIGRvbnRFeHBlY3RMaW5lKGxpbmVzLCBjbWRBcmcoJ2Nmbi1zaWduYWwnLCAnLWUgJD8nKSk7XG4gICAgZXhwZWN0TGluZShsaW5lcywgY21kQXJnKCdjZm4tc2lnbmFsJywgJy1lIDAnKSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBkaXNhYmxlIGxvZyBwcmludGluZycsICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgc2ltcGxlSW5pdC5hdHRhY2gocmVzb3VyY2UsIHtcbiAgICAgIC4uLmxpbnV4T3B0aW9ucygpLFxuICAgICAgcHJpbnRMb2c6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGxpbmVzID0gbGludXhVc2VyRGF0YS5yZW5kZXIoKS5zcGxpdCgnXFxuJyk7XG4gICAgZG9udEV4cGVjdExpbmUobGluZXMsIGNtZEFyZygnY2F0JywgJ2Nmbi1pbml0LmxvZycpKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGRpc2FibGUgZmluZ2VycHJpbnRpbmcnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIHNpbXBsZUluaXQuYXR0YWNoKHJlc291cmNlLCB7XG4gICAgICAuLi5saW51eE9wdGlvbnMoKSxcbiAgICAgIGVtYmVkRmluZ2VycHJpbnQ6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGxpbmVzID0gbGludXhVc2VyRGF0YS5yZW5kZXIoKS5zcGxpdCgnXFxuJyk7XG4gICAgZG9udEV4cGVjdExpbmUobGluZXMsIC9maW5nZXJwcmludC8pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gcmVxdWVzdCBtdWx0aXBsZSBkaWZmZXJlbnQgY29uZmlnc2V0cyB0byBiZSB1c2VkJywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBzaW1wbGVJbml0LmF0dGFjaChyZXNvdXJjZSwge1xuICAgICAgLi4ubGludXhPcHRpb25zKCksXG4gICAgICBjb25maWdTZXRzOiBbJ2JhbmFuYScsICdwZWFjaCddLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IGxpbmVzID0gbGludXhVc2VyRGF0YS5yZW5kZXIoKS5zcGxpdCgnXFxuJyk7XG4gICAgZXhwZWN0TGluZShsaW5lcywgY21kQXJnKCdjZm4taW5pdCcsICctYyBiYW5hbmEscGVhY2gnKSk7XG4gIH0pO1xufSk7XG5cbmNvbnN0IEFTU0VUX1NUQVRFTUVOVCA9IHtcbiAgQWN0aW9uOiBbJ3MzOkdldE9iamVjdConLCAnczM6R2V0QnVja2V0KicsICdzMzpMaXN0KiddLFxuICBFZmZlY3Q6ICdBbGxvdycsXG4gIFJlc291cmNlOiBbXG4gICAge1xuICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICdhcm46JyxcbiAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgJzpzMzo6OicsXG4gICAgICAgIHsgUmVmOiBzdHJpbmdMaWtlKC9Bc3NldFBhcmFtZXRlci4qUzNCdWNrZXQuKi8pIH0sXG4gICAgICBdXSxcbiAgICB9LFxuICAgIHtcbiAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAnYXJuOicsXG4gICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICc6czM6OjonLFxuICAgICAgICB7IFJlZjogc3RyaW5nTGlrZSgvQXNzZXRQYXJhbWV0ZXIuKlMzQnVja2V0LiovKSB9LFxuICAgICAgICAnLyonLFxuICAgICAgXV0sXG4gICAgfSxcbiAgXSxcbn07XG5cbmRlc2NyaWJlKCdhc3NldHMgbiBidWNrZXRzJywgKCkgPT4ge1xuXG4gIHRlc3QuZWFjaChbXG4gICAgWydFeGlzdGluZyddLFxuICAgIFsnJ10sXG4gIF0pKCdJbml0RmlsZS5mcm9tJXNBc3NldCcsIChleGlzdGluZzogc3RyaW5nKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhc3NldCA9IG5ldyBBc3NldChzdGFjaywgJ0Fzc2V0JywgeyBwYXRoOiBfX2ZpbGVuYW1lIH0pO1xuICAgIGNvbnN0IGluaXQgPSBlYzIuQ2xvdWRGb3JtYXRpb25Jbml0LmZyb21FbGVtZW50cyhcbiAgICAgIGV4aXN0aW5nXG4gICAgICAgID8gZWMyLkluaXRGaWxlLmZyb21FeGlzdGluZ0Fzc2V0KCcvZXRjL2Z1bi5qcycsIGFzc2V0KVxuICAgICAgICA6IGVjMi5Jbml0RmlsZS5mcm9tQXNzZXQoJy9ldGMvZnVuLmpzJywgX19maWxlbmFtZSksXG4gICAgKTtcblxuICAgIC8vIFdIRU5cbiAgICBpbml0LmF0dGFjaChyZXNvdXJjZSwgbGludXhPcHRpb25zKCkpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBNYXRjaC5hcnJheVdpdGgoW0FTU0VUX1NUQVRFTUVOVF0pLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGV4cGVjdE1ldGFkYXRhTGlrZSh7XG4gICAgICAnQVdTOjpDbG91ZEZvcm1hdGlvbjo6SW5pdCc6IHtcbiAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgZmlsZXM6IHtcbiAgICAgICAgICAgICcvZXRjL2Z1bi5qcyc6IHtcbiAgICAgICAgICAgICAgc291cmNlOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgICAgICAgICAnaHR0cHM6Ly9zMy50ZXN0cmVnaW9uLicsXG4gICAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6VVJMU3VmZml4JyB9LFxuICAgICAgICAgICAgICAgICAgJy8nLFxuICAgICAgICAgICAgICAgICAgeyBSZWY6IHN0cmluZ0xpa2UoL0Fzc2V0UGFyYW1ldGVycy4qLykgfSxcbiAgICAgICAgICAgICAgICAgICcvJyxcbiAgICAgICAgICAgICAgICAgIHsgJ0ZuOjpTZWxlY3QnOiBbMCwgeyAnRm46OlNwbGl0JzogWyd8fCcsIHsgUmVmOiBzdHJpbmdMaWtlKC9Bc3NldFBhcmFtZXRlcnMuKi8pIH1dIH1dIH0sXG4gICAgICAgICAgICAgICAgICB7ICdGbjo6U2VsZWN0JzogWzEsIHsgJ0ZuOjpTcGxpdCc6IFsnfHwnLCB7IFJlZjogc3RyaW5nTGlrZSgvQXNzZXRQYXJhbWV0ZXJzLiovKSB9XSB9XSB9LFxuICAgICAgICAgICAgICAgIF1dLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgICdBV1M6OkNsb3VkRm9ybWF0aW9uOjpBdXRoZW50aWNhdGlvbic6IHtcbiAgICAgICAgUzNBY2Nlc3NDcmVkczoge1xuICAgICAgICAgIHR5cGU6ICdTMycsXG4gICAgICAgICAgcm9sZU5hbWU6IHsgUmVmOiAnSW5zdGFuY2VSb2xlM0NDRTJGMUQnIH0sXG4gICAgICAgICAgYnVja2V0czogW1xuICAgICAgICAgICAgeyBSZWY6IHN0cmluZ0xpa2UoL0Fzc2V0UGFyYW1ldGVycy4qUzNCdWNrZXQuKi8pIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QuZWFjaChbXG4gICAgWydFeGlzdGluZyddLFxuICAgIFsnJ10sXG4gIF0pKCdJbml0U291cmNlLmZyb20lc0Fzc2V0JywgKGV4aXN0aW5nOiBzdHJpbmcpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFzc2V0ID0gbmV3IEFzc2V0KHN0YWNrLCAnQXNzZXQnLCB7IHBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICdhc3NldC1maXh0dXJlJykgfSk7XG4gICAgY29uc3QgaW5pdCA9IGVjMi5DbG91ZEZvcm1hdGlvbkluaXQuZnJvbUVsZW1lbnRzKFxuICAgICAgZXhpc3RpbmdcbiAgICAgICAgPyBlYzIuSW5pdFNvdXJjZS5mcm9tRXhpc3RpbmdBc3NldCgnL2V0Yy9mdW4nLCBhc3NldClcbiAgICAgICAgOiBlYzIuSW5pdFNvdXJjZS5mcm9tQXNzZXQoJy9ldGMvZnVuJywgcGF0aC5qb2luKF9fZGlybmFtZSwgJ2Fzc2V0LWZpeHR1cmUnKSksXG4gICAgKTtcblxuICAgIC8vIFdIRU5cbiAgICBpbml0LmF0dGFjaChyZXNvdXJjZSwgbGludXhPcHRpb25zKCkpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBNYXRjaC5hcnJheVdpdGgoW0FTU0VUX1NUQVRFTUVOVF0pLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGV4cGVjdE1ldGFkYXRhTGlrZSh7XG4gICAgICAnQVdTOjpDbG91ZEZvcm1hdGlvbjo6SW5pdCc6IHtcbiAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgc291cmNlczoge1xuICAgICAgICAgICAgJy9ldGMvZnVuJzoge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgICAnaHR0cHM6Ly9zMy50ZXN0cmVnaW9uLicsXG4gICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlVSTFN1ZmZpeCcgfSxcbiAgICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgICAgeyBSZWY6IHN0cmluZ0xpa2UoL0Fzc2V0UGFyYW1ldGVycy4qLykgfSxcbiAgICAgICAgICAgICAgICAnLycsXG4gICAgICAgICAgICAgICAgeyAnRm46OlNlbGVjdCc6IFswLCB7ICdGbjo6U3BsaXQnOiBbJ3x8JywgeyBSZWY6IHN0cmluZ0xpa2UoL0Fzc2V0UGFyYW1ldGVycy4qLykgfV0gfV0gfSxcbiAgICAgICAgICAgICAgICB7ICdGbjo6U2VsZWN0JzogWzEsIHsgJ0ZuOjpTcGxpdCc6IFsnfHwnLCB7IFJlZjogc3RyaW5nTGlrZSgvQXNzZXRQYXJhbWV0ZXJzLiovKSB9XSB9XSB9LFxuICAgICAgICAgICAgICBdXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnQVdTOjpDbG91ZEZvcm1hdGlvbjo6QXV0aGVudGljYXRpb24nOiB7XG4gICAgICAgIFMzQWNjZXNzQ3JlZHM6IHtcbiAgICAgICAgICB0eXBlOiAnUzMnLFxuICAgICAgICAgIHJvbGVOYW1lOiB7IFJlZjogJ0luc3RhbmNlUm9sZTNDQ0UyRjFEJyB9LFxuICAgICAgICAgIGJ1Y2tldHM6IFtcbiAgICAgICAgICAgIHsgUmVmOiBzdHJpbmdMaWtlKC9Bc3NldFBhcmFtZXRlcnMuKlMzQnVja2V0LiovKSB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdJbml0RmlsZS5mcm9tUzNPYmplY3QnLCAoKSA9PiB7XG4gICAgY29uc3QgYnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXROYW1lKHN0YWNrLCAnQnVja2V0JywgJ215LWJ1Y2tldCcpO1xuICAgIGNvbnN0IGluaXQgPSBlYzIuQ2xvdWRGb3JtYXRpb25Jbml0LmZyb21FbGVtZW50cyhcbiAgICAgIGVjMi5Jbml0RmlsZS5mcm9tUzNPYmplY3QoJy9ldGMvZnVuLmpzJywgYnVja2V0LCAnZmlsZS5qcycpLFxuICAgICk7XG5cbiAgICAvLyBXSEVOXG4gICAgaW5pdC5hdHRhY2gocmVzb3VyY2UsIGxpbnV4T3B0aW9ucygpKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogTWF0Y2guYXJyYXlXaXRoKFt7XG4gICAgICAgICAgQWN0aW9uOiBbJ3MzOkdldE9iamVjdConLCAnczM6R2V0QnVja2V0KicsICdzMzpMaXN0KiddLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZTogW1xuICAgICAgICAgICAgeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6czM6OjpteS1idWNrZXQnXV0gfSxcbiAgICAgICAgICAgIHsgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOnMzOjo6bXktYnVja2V0L2ZpbGUuanMnXV0gfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9XSksXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgZXhwZWN0TWV0YWRhdGFMaWtlKHtcbiAgICAgICdBV1M6OkNsb3VkRm9ybWF0aW9uOjpJbml0Jzoge1xuICAgICAgICBjb25maWc6IHtcbiAgICAgICAgICBmaWxlczoge1xuICAgICAgICAgICAgJy9ldGMvZnVuLmpzJzoge1xuICAgICAgICAgICAgICBzb3VyY2U6IHsgJ0ZuOjpKb2luJzogWycnLCBbJ2h0dHBzOi8vczMudGVzdHJlZ2lvbi4nLCB7IFJlZjogJ0FXUzo6VVJMU3VmZml4JyB9LCAnL215LWJ1Y2tldC9maWxlLmpzJ11dIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgJ0FXUzo6Q2xvdWRGb3JtYXRpb246OkF1dGhlbnRpY2F0aW9uJzoge1xuICAgICAgICBTM0FjY2Vzc0NyZWRzOiB7XG4gICAgICAgICAgdHlwZTogJ1MzJyxcbiAgICAgICAgICByb2xlTmFtZTogeyBSZWY6ICdJbnN0YW5jZVJvbGUzQ0NFMkYxRCcgfSxcbiAgICAgICAgICBidWNrZXRzOiBbJ215LWJ1Y2tldCddLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnSW5pdFNvdXJjZS5mcm9tUzNPYmplY3QnLCAoKSA9PiB7XG4gICAgY29uc3QgYnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXROYW1lKHN0YWNrLCAnQnVja2V0JywgJ215LWJ1Y2tldCcpO1xuICAgIGNvbnN0IGluaXQgPSBlYzIuQ2xvdWRGb3JtYXRpb25Jbml0LmZyb21FbGVtZW50cyhcbiAgICAgIGVjMi5Jbml0U291cmNlLmZyb21TM09iamVjdCgnL2V0Yy9mdW4nLCBidWNrZXQsICdmaWxlLnppcCcpLFxuICAgICk7XG5cbiAgICAvLyBXSEVOXG4gICAgaW5pdC5hdHRhY2gocmVzb3VyY2UsIGxpbnV4T3B0aW9ucygpKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogTWF0Y2guYXJyYXlXaXRoKFt7XG4gICAgICAgICAgQWN0aW9uOiBbJ3MzOkdldE9iamVjdConLCAnczM6R2V0QnVja2V0KicsICdzMzpMaXN0KiddLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZTogW1xuICAgICAgICAgICAgeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6czM6OjpteS1idWNrZXQnXV0gfSxcbiAgICAgICAgICAgIHsgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOnMzOjo6bXktYnVja2V0L2ZpbGUuemlwJ11dIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfV0pLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGV4cGVjdE1ldGFkYXRhTGlrZSh7XG4gICAgICAnQVdTOjpDbG91ZEZvcm1hdGlvbjo6SW5pdCc6IHtcbiAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgc291cmNlczoge1xuICAgICAgICAgICAgJy9ldGMvZnVuJzogeyAnRm46OkpvaW4nOiBbJycsIFsnaHR0cHM6Ly9zMy50ZXN0cmVnaW9uLicsIHsgUmVmOiAnQVdTOjpVUkxTdWZmaXgnIH0sICcvbXktYnVja2V0L2ZpbGUuemlwJ11dIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICAnQVdTOjpDbG91ZEZvcm1hdGlvbjo6QXV0aGVudGljYXRpb24nOiB7XG4gICAgICAgIFMzQWNjZXNzQ3JlZHM6IHtcbiAgICAgICAgICB0eXBlOiAnUzMnLFxuICAgICAgICAgIHJvbGVOYW1lOiB7IFJlZjogJ0luc3RhbmNlUm9sZTNDQ0UyRjFEJyB9LFxuICAgICAgICAgIGJ1Y2tldHM6IFsnbXktYnVja2V0J10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdubyBkdXBsaWNhdGlvbiBvZiBidWNrZXQgbmFtZXMgd2hlbiB1c2luZyBtdWx0aXBsZSBhc3NldHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBpbml0ID0gZWMyLkNsb3VkRm9ybWF0aW9uSW5pdC5mcm9tRWxlbWVudHMoXG4gICAgICBlYzIuSW5pdEZpbGUuZnJvbUFzc2V0KCcvZXRjL2Z1bi5qcycsIF9fZmlsZW5hbWUpLFxuICAgICAgZWMyLkluaXRTb3VyY2UuZnJvbUFzc2V0KCcvZXRjL2Z1bicsIHBhdGguam9pbihfX2Rpcm5hbWUsICdhc3NldC1maXh0dXJlJykpLFxuICAgICk7XG5cbiAgICAvLyBXSEVOXG4gICAgaW5pdC5hdHRhY2gocmVzb3VyY2UsIGxpbnV4T3B0aW9ucygpKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3RNZXRhZGF0YUxpa2Uoe1xuICAgICAgJ0FXUzo6Q2xvdWRGb3JtYXRpb246OkF1dGhlbnRpY2F0aW9uJzoge1xuICAgICAgICBTM0FjY2Vzc0NyZWRzOiB7XG4gICAgICAgICAgdHlwZTogJ1MzJyxcbiAgICAgICAgICByb2xlTmFtZTogeyBSZWY6ICdJbnN0YW5jZVJvbGUzQ0NFMkYxRCcgfSxcbiAgICAgICAgICBidWNrZXRzOiBNYXRjaC5hcnJheVdpdGgoW1xuICAgICAgICAgICAgeyBSZWY6IHN0cmluZ0xpa2UoL0Fzc2V0UGFyYW1ldGVycy4qUzNCdWNrZXQuKi8pIH0sXG4gICAgICAgICAgXSksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdtdWx0aXBsZSBidWNrZXRzIGFwcGVhciBpbiB0aGUgc2FtZSBhdXRoIGJsb2NrJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXROYW1lKHN0YWNrLCAnQnVja2V0JywgJ215LWJ1Y2tldCcpO1xuICAgIGNvbnN0IGluaXQgPSBlYzIuQ2xvdWRGb3JtYXRpb25Jbml0LmZyb21FbGVtZW50cyhcbiAgICAgIGVjMi5Jbml0RmlsZS5mcm9tUzNPYmplY3QoJy9ldGMvZnVuLmpzJywgYnVja2V0LCAnZmlsZS5qcycpLFxuICAgICAgZWMyLkluaXRTb3VyY2UuZnJvbUFzc2V0KCcvZXRjL2Z1bicsIHBhdGguam9pbihfX2Rpcm5hbWUsICdhc3NldC1maXh0dXJlJykpLFxuICAgICk7XG5cbiAgICAvLyBXSEVOXG4gICAgaW5pdC5hdHRhY2gocmVzb3VyY2UsIGxpbnV4T3B0aW9ucygpKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3RNZXRhZGF0YUxpa2Uoe1xuICAgICAgJ0FXUzo6Q2xvdWRGb3JtYXRpb246OkF1dGhlbnRpY2F0aW9uJzoge1xuICAgICAgICBTM0FjY2Vzc0NyZWRzOiB7XG4gICAgICAgICAgdHlwZTogJ1MzJyxcbiAgICAgICAgICByb2xlTmFtZTogeyBSZWY6ICdJbnN0YW5jZVJvbGUzQ0NFMkYxRCcgfSxcbiAgICAgICAgICBidWNrZXRzOiBNYXRjaC5hcnJheVdpdGgoW1xuICAgICAgICAgICAgeyBSZWY6IHN0cmluZ0xpa2UoL0Fzc2V0UGFyYW1ldGVycy4qUzNCdWNrZXQuKi8pIH0sXG4gICAgICAgICAgICAnbXktYnVja2V0JyxcbiAgICAgICAgICBdKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZpbmdlcnByaW50IGRhdGEgY2hhbmdlcyBvbiBhc3NldCBoYXNoIHVwZGF0ZScsICgpID0+IHtcbiAgICBmdW5jdGlvbiBjYWxjdWxhdGVGaW5nZXJwcmludChhc3NldEZpbGVQYXRoOiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgICAgcmVzZXRTdGF0ZSgpOyAvLyBOZWVkZWQgc28gdGhlIHNhbWUgcmVzb3VyY2VzL2Fzc2V0cy9maWxlbmFtZXMgY2FuIGJlIHVzZWQuXG4gICAgICBBc3NldFN0YWdpbmcuY2xlYXJBc3NldEhhc2hDYWNoZSgpOyAvLyBOZWVkZWQgc28gY2hhbmdpbmcgdGhlIGNvbnRlbnQgb2YgdGhlIGZpbGUgd2lsbCB1cGRhdGUgdGhlIGhhc2hcbiAgICAgIGNvbnN0IGluaXQgPSBlYzIuQ2xvdWRGb3JtYXRpb25Jbml0LmZyb21FbGVtZW50cyhcbiAgICAgICAgZWMyLkluaXRGaWxlLmZyb21Bc3NldCgnL2V0Yy9teUZpbGUnLCBhc3NldEZpbGVQYXRoKSxcbiAgICAgICk7XG4gICAgICBpbml0LmF0dGFjaChyZXNvdXJjZSwgbGludXhPcHRpb25zKCkpO1xuXG4gICAgICByZXR1cm4gbGludXhVc2VyRGF0YS5yZW5kZXIoKS5zcGxpdCgnXFxuJykuZmluZChsaW5lID0+IGxpbmUubWF0Y2goLyMgZmluZ2VycHJpbnQ6LykpO1xuICAgIH1cblxuICAgIC8vIFNldHVwIGluaXRpYWwgYXNzZXQgZmlsZVxuICAgIGNvbnN0IGFzc2V0RmlsZURpciA9IGZzLm1rZHRlbXBTeW5jKHBhdGguam9pbihvcy50bXBkaXIoKSwgJ2Nmbi1pbml0LXRlc3QnKSk7XG4gICAgY29uc3QgYXNzZXRGaWxlUGF0aCA9IHBhdGguam9pbihhc3NldEZpbGVEaXIsICdmaW5nZXJwcmludC10ZXN0Jyk7XG4gICAgZnMud3JpdGVGaWxlU3luYyhhc3NldEZpbGVQYXRoLCAnaGVsbG8nKTtcblxuICAgIGNvbnN0IGZpbmdlcnByaW50T25lID0gY2FsY3VsYXRlRmluZ2VycHJpbnQoYXNzZXRGaWxlUGF0aCk7XG4gICAgY29uc3QgZmluZ2VycHJpbnRPbmVBZ2FpbiA9IGNhbGN1bGF0ZUZpbmdlcnByaW50KGFzc2V0RmlsZVBhdGgpO1xuICAgIC8vIENvbnNpc3RlbnQgd2l0aG91dCBjaGFuZ2VzLlxuICAgIGV4cGVjdChmaW5nZXJwcmludE9uZUFnYWluKS50b0VxdWFsKGZpbmdlcnByaW50T25lKTtcblxuICAgIC8vIENoYW5nZSBhc3NldCBmaWxlIGNvbnRlbnQvaGFzaFxuICAgIGZzLndyaXRlRmlsZVN5bmMoYXNzZXRGaWxlUGF0aCwgJyB3b3JsZCcpO1xuXG4gICAgY29uc3QgZmluZ2VycHJpbnRUd28gPSBjYWxjdWxhdGVGaW5nZXJwcmludChhc3NldEZpbGVQYXRoKTtcblxuICAgIGV4cGVjdChmaW5nZXJwcmludFR3bykubm90LnRvRXF1YWwoZmluZ2VycHJpbnRPbmUpO1xuICB9KTtcblxuICB0ZXN0KCdmaW5nZXJwcmludCBkYXRhIGNoYW5nZXMgb24gZXhpc3RpbmcgYXNzZXQgdXBkYXRlLCBldmVuIGZvciBhc3NldHMgd2l0aCB1bmNoYW5naW5nIFVSTHMnLCAoKSA9PiB7XG4gICAgZnVuY3Rpb24gY2FsY3VsYXRlRmluZ2VycHJpbnQoYXNzZXRGaWxlUGF0aDogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICAgIHJlc2V0U3RhdGVXaXRoU3ludGhlc2l6ZXIobmV3IFNpbmdsZXRvbkxvY2F0aW9uU3l0aGVzaXplcigpKTtcbiAgICAgIEFzc2V0U3RhZ2luZy5jbGVhckFzc2V0SGFzaENhY2hlKCk7IC8vIE5lZWRlZCBzbyBjaGFuZ2luZyB0aGUgY29udGVudCBvZiB0aGUgZmlsZSB3aWxsIHVwZGF0ZSB0aGUgaGFzaFxuICAgICAgY29uc3QgaW5pdCA9IGVjMi5DbG91ZEZvcm1hdGlvbkluaXQuZnJvbUVsZW1lbnRzKFxuICAgICAgICBlYzIuSW5pdEZpbGUuZnJvbUV4aXN0aW5nQXNzZXQoJy9ldGMvbXlGaWxlJywgbmV3IEFzc2V0KHN0YWNrLCAnRmlsZUFzc2V0JywgeyBwYXRoOiBhc3NldEZpbGVQYXRoIH0pKSxcbiAgICAgICk7XG4gICAgICBpbml0LmF0dGFjaChyZXNvdXJjZSwgbGludXhPcHRpb25zKCkpO1xuXG4gICAgICByZXR1cm4gbGludXhVc2VyRGF0YS5yZW5kZXIoKS5zcGxpdCgnXFxuJykuZmluZChsaW5lID0+IGxpbmUubWF0Y2goLyMgZmluZ2VycHJpbnQ6LykpO1xuICAgIH1cblxuICAgIC8vIFNldHVwIGluaXRpYWwgYXNzZXQgZmlsZVxuICAgIGNvbnN0IGFzc2V0RmlsZURpciA9IGZzLm1rZHRlbXBTeW5jKHBhdGguam9pbihvcy50bXBkaXIoKSwgJ2Nmbi1pbml0LXRlc3QnKSk7XG4gICAgY29uc3QgYXNzZXRGaWxlUGF0aCA9IHBhdGguam9pbihhc3NldEZpbGVEaXIsICdmaW5nZXJwcmludC10ZXN0Jyk7XG4gICAgZnMud3JpdGVGaWxlU3luYyhhc3NldEZpbGVQYXRoLCAnaGVsbG8nKTtcblxuICAgIGNvbnN0IGZpbmdlcnByaW50T25lID0gY2FsY3VsYXRlRmluZ2VycHJpbnQoYXNzZXRGaWxlUGF0aCk7XG4gICAgY29uc3QgZmluZ2VycHJpbnRPbmVBZ2FpbiA9IGNhbGN1bGF0ZUZpbmdlcnByaW50KGFzc2V0RmlsZVBhdGgpO1xuICAgIC8vIENvbnNpc3RlbnQgd2l0aG91dCBjaGFuZ2VzLlxuICAgIGV4cGVjdChmaW5nZXJwcmludE9uZUFnYWluKS50b0VxdWFsKGZpbmdlcnByaW50T25lKTtcblxuICAgIC8vIENoYW5nZSBhc3NldCBmaWxlIGNvbnRlbnQvaGFzaFxuICAgIGZzLndyaXRlRmlsZVN5bmMoYXNzZXRGaWxlUGF0aCwgJyB3b3JsZCcpO1xuXG4gICAgY29uc3QgZmluZ2VycHJpbnRUd28gPSBjYWxjdWxhdGVGaW5nZXJwcmludChhc3NldEZpbGVQYXRoKTtcblxuICAgIGV4cGVjdChmaW5nZXJwcmludFR3bykubm90LnRvRXF1YWwoZmluZ2VycHJpbnRPbmUpO1xuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiBsaW51eE9wdGlvbnMoKSB7XG4gIHJldHVybiB7XG4gICAgcGxhdGZvcm06IGVjMi5PcGVyYXRpbmdTeXN0ZW1UeXBlLkxJTlVYLFxuICAgIGluc3RhbmNlUm9sZSxcbiAgICB1c2VyRGF0YTogbGludXhVc2VyRGF0YSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gZXhwZWN0TWV0YWRhdGFMaWtlKHBhdHRlcm46IGFueSkge1xuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdDREs6OlRlc3Q6OlJlc291cmNlJywge1xuICAgIE1ldGFkYXRhOiBwYXR0ZXJuLFxuICB9KTtcbn1cblxuZnVuY3Rpb24gZXhwZWN0TGluZShsaW5lczogc3RyaW5nW10sIHJlOiBSZWdFeHApIHtcbiAgZm9yIChjb25zdCBsaW5lIG9mIGxpbmVzKSB7XG4gICAgaWYgKHJlLnRlc3QobGluZSkpIHsgcmV0dXJuOyB9XG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoYE5vbmUgb2YgdGhlIGxpbmVzIG1hdGNoZWQgJyR7cmV9JzogJHtsaW5lcy5qb2luKCdcXG4nKX1gKTtcbn1cblxuZnVuY3Rpb24gZG9udEV4cGVjdExpbmUobGluZXM6IHN0cmluZ1tdLCByZTogUmVnRXhwKSB7XG4gIHRyeSB7XG4gICAgZXhwZWN0TGluZShsaW5lcywgcmUpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcihgRm91bmQgdW5leHBlY3RlZCBsaW5lIG1hdGNoaW5nICcke3JlfSc6ICR7bGluZXMuam9pbignXFxuJyl9YCk7XG59XG5cbmZ1bmN0aW9uIGNtZEFyZyhjb21tYW5kOiBzdHJpbmcsIGFyZ3VtZW50OiBzdHJpbmcpIHtcbiAgcmV0dXJuIG5ldyBSZWdFeHAoYCR7ZXNjYXBlUmVnZXgoY29tbWFuZCl9KFxcLmV4ZSk/IC4qJHtlc2NhcGVSZWdleChhcmd1bWVudCl9YCk7XG59XG5cbmZ1bmN0aW9uIGVzY2FwZVJlZ2V4KHM6IHN0cmluZykge1xuICByZXR1cm4gcy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgJ1xcXFwkJicpOyAvLyAkJiBtZWFucyB0aGUgd2hvbGUgbWF0Y2hlZCBzdHJpbmdcbn1cblxuLyoqIENyZWF0ZXMgZmlsZSBhc3NldHMgdGhhdCBoYXZlIGEgaGFyZC1jb2RlZCBhc3NldCB1cmwsIHJhdGhlciB0aGFuIHRoZSBkZWZhdWx0IGJhc2VkIG9uIGFzc2V0IGhhc2ggKi9cbmNsYXNzIFNpbmdsZXRvbkxvY2F0aW9uU3l0aGVzaXplciBleHRlbmRzIERlZmF1bHRTdGFja1N5bnRoZXNpemVyIHtcbiAgcHVibGljIGFkZEZpbGVBc3NldChfYXNzZXQ6IEZpbGVBc3NldFNvdXJjZSk6IEZpbGVBc3NldExvY2F0aW9uIHtcbiAgICBjb25zdCBodHRwVXJsID0gJ2h0dHBzOi8vTXlCdWNrZXQuczMuYW1hem9uYXdzLmNvbS9NeUFzc2V0JztcbiAgICByZXR1cm4ge1xuICAgICAgYnVja2V0TmFtZTogJ215YXNzZXRidWNrZXQnLFxuICAgICAgb2JqZWN0S2V5OiAnTXlBc3NldEZpbGUnLFxuICAgICAgaHR0cFVybCxcbiAgICAgIHMzT2JqZWN0VXJsOiBodHRwVXJsLFxuICAgICAgczNVcmw6IGh0dHBVcmwsXG4gICAgfTtcbiAgfVxufVxuIl19