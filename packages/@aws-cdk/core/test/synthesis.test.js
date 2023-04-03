"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const os = require("os");
const path = require("path");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const cxapi = require("@aws-cdk/cx-api");
const constructs_1 = require("constructs");
const cdk = require("../lib");
const synthesis_1 = require("../lib/private/synthesis");
function createModernApp() {
    return new cdk.App();
}
describe('synthesis', () => {
    test('synthesis with an empty app', () => {
        // GIVEN
        const app = createModernApp();
        // WHEN
        const session = app.synth();
        // THEN
        expect(app.synth()).toEqual(session); // same session if we synth() again
        expect(list(session.directory)).toEqual(['cdk.out', 'manifest.json', 'tree.json']);
        expect(readJson(session.directory, 'manifest.json').artifacts).toEqual({
            Tree: {
                type: 'cdk:tree',
                properties: { file: 'tree.json' },
            },
        });
        expect(readJson(session.directory, 'tree.json')).toEqual({
            version: 'tree-0.1',
            tree: expect.objectContaining({
                id: 'App',
                path: '',
                children: {
                    Tree: expect.objectContaining({ id: 'Tree', path: 'Tree' }),
                },
            }),
        });
    });
    test('synthesis respects disabling tree metadata', () => {
        const app = new cdk.App({
            treeMetadata: false,
        });
        const assembly = app.synth();
        expect(list(assembly.directory)).toEqual(['cdk.out', 'manifest.json']);
    });
    test('synthesis respects disabling logicalId metadata', () => {
        const app = new cdk.App({
            context: {
                [cxapi.DISABLE_LOGICAL_ID_METADATA]: true,
            },
        });
        const stack = new cdk.Stack(app, 'one-stack');
        new cdk.CfnResource(stack, 'MagicResource', { type: 'Resource::Type' });
        // WHEN
        const session = app.synth();
        // THEN
        expect(Object.keys((session.manifest.artifacts ?? {})['one-stack'])).not.toContain('metadata');
    });
    test('synthesis respects disabling logicalId metadata, and does not disable other metadata', () => {
        const app = new cdk.App({
            context: {
                [cxapi.DISABLE_LOGICAL_ID_METADATA]: true,
            },
            stackTraces: false,
        });
        const stack = new cdk.Stack(app, 'one-stack', { tags: { boomTag: 'BOOM' } });
        new cdk.CfnResource(stack, 'MagicResource', { type: 'Resource::Type' });
        // WHEN
        const session = app.synth();
        // THEN
        expect(session.manifest.artifacts?.['one-stack'].metadata).toEqual({
            '/one-stack': [
                {
                    type: 'aws:cdk:stack-tags',
                    data: [
                        {
                            key: 'boomTag',
                            value: 'BOOM',
                        },
                    ],
                },
            ],
        });
    });
    test('single empty stack', () => {
        // GIVEN
        const app = createModernApp();
        new cdk.Stack(app, 'one-stack');
        // WHEN
        const session = app.synth();
        // THEN
        expect(list(session.directory).includes('one-stack.template.json')).toEqual(true);
    });
    test('some random construct implements "synthesize"', () => {
        // GIVEN
        const app = createModernApp();
        const stack = new cdk.Stack(app, 'one-stack');
        class MyConstruct extends constructs_1.Construct {
            constructor(scope, id) {
                super(scope, id);
                cdk.attachCustomSynthesis(this, {
                    onSynthesize(s) {
                        writeJson(s.assembly.outdir, 'foo.json', { bar: 123 });
                        s.assembly.addArtifact('my-random-construct', {
                            type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
                            environment: 'aws://12345/bar',
                            properties: {
                                templateFile: 'foo.json',
                            },
                        });
                    },
                });
            }
        }
        new MyConstruct(stack, 'MyConstruct');
        // WHEN
        const session = app.synth();
        // THEN
        expect(list(session.directory).includes('one-stack.template.json')).toEqual(true);
        expect(list(session.directory).includes('foo.json')).toEqual(true);
        expect(readJson(session.directory, 'foo.json')).toEqual({ bar: 123 });
        expect(session.manifest).toEqual({
            version: cxschema.Manifest.version(),
            artifacts: expect.objectContaining({
                'Tree': {
                    type: 'cdk:tree',
                    properties: { file: 'tree.json' },
                },
                'my-random-construct': {
                    type: 'aws:cloudformation:stack',
                    environment: 'aws://12345/bar',
                    properties: { templateFile: 'foo.json' },
                },
                'one-stack': expect.objectContaining({
                    type: 'aws:cloudformation:stack',
                    environment: 'aws://unknown-account/unknown-region',
                    properties: expect.objectContaining({
                        templateFile: 'one-stack.template.json',
                        validateOnSynth: false,
                    }),
                    displayName: 'one-stack',
                }),
            }),
        });
    });
    test('random construct uses addCustomSynthesis', () => {
        // GIVEN
        const app = createModernApp();
        const stack = new cdk.Stack(app, 'one-stack');
        class MyConstruct extends constructs_1.Construct {
            constructor(scope, id) {
                super(scope, id);
                cdk.attachCustomSynthesis(this, {
                    onSynthesize(s) {
                        writeJson(s.assembly.outdir, 'foo.json', { bar: 123 });
                        s.assembly.addArtifact('my-random-construct', {
                            type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
                            environment: 'aws://12345/bar',
                            properties: {
                                templateFile: 'foo.json',
                            },
                        });
                    },
                });
            }
        }
        new MyConstruct(stack, 'MyConstruct');
        // WHEN
        const session = app.synth();
        // THEN
        expect(list(session.directory).includes('one-stack.template.json')).toEqual(true);
        expect(list(session.directory).includes('foo.json')).toEqual(true);
        expect(readJson(session.directory, 'foo.json')).toEqual({ bar: 123 });
        expect(session.manifest).toEqual({
            version: cxschema.Manifest.version(),
            artifacts: expect.objectContaining({
                'Tree': {
                    type: 'cdk:tree',
                    properties: { file: 'tree.json' },
                },
                'my-random-construct': {
                    type: 'aws:cloudformation:stack',
                    environment: 'aws://12345/bar',
                    properties: { templateFile: 'foo.json' },
                },
                'one-stack': expect.objectContaining({
                    type: 'aws:cloudformation:stack',
                    environment: 'aws://unknown-account/unknown-region',
                    properties: expect.objectContaining({
                        templateFile: 'one-stack.template.json',
                        validateOnSynth: false,
                    }),
                    displayName: 'one-stack',
                }),
            }),
        });
    });
    cdk_build_tools_1.testDeprecated('it should be possible to synthesize without an app', () => {
        const calls = new Array();
        class SynthesizeMe extends cdk.Stack {
            constructor() {
                super(undefined, 'hey', {
                    synthesizer: new cdk.LegacyStackSynthesizer(),
                });
                this.templateFile = 'hey.json';
                this.node.addValidation({
                    validate: () => {
                        calls.push('validate');
                        return [];
                    },
                });
            }
            _synthesizeTemplate(session) {
                calls.push('synthesize');
                session.assembly.addArtifact('art', {
                    type: cxschema.ArtifactType.AWS_CLOUDFORMATION_STACK,
                    properties: {
                        templateFile: 'hey.json',
                        parameters: {
                            paramId: 'paramValue',
                            paramId2: 'paramValue2',
                        },
                    },
                    environment: 'aws://unknown-account/us-east-1',
                });
                writeJson(session.assembly.outdir, 'hey.json', { hello: 123 });
            }
        }
        const root = new SynthesizeMe();
        const assembly = synthesis_1.synthesize(root, { outdir: fs.mkdtempSync(path.join(os.tmpdir(), 'outdir')) });
        expect(calls).toEqual(['validate', 'synthesize']);
        const stack = assembly.getStackByName('art');
        expect(stack.template).toEqual({ hello: 123 });
        expect(stack.templateFile).toEqual('hey.json');
        expect(stack.parameters).toEqual({ paramId: 'paramValue', paramId2: 'paramValue2' });
        expect(stack.environment).toEqual({ region: 'us-east-1', account: 'unknown-account', name: 'aws://unknown-account/us-east-1' });
    });
});
function list(outdir) {
    return fs.readdirSync(outdir).sort();
}
function readJson(outdir, file) {
    return JSON.parse(fs.readFileSync(path.join(outdir, file), 'utf-8'));
}
function writeJson(outdir, file, data) {
    fs.writeFileSync(path.join(outdir, file), JSON.stringify(data, undefined, 2));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ludGhlc2lzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzeW50aGVzaXMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlCQUF5QjtBQUN6Qix5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLDhEQUEwRDtBQUMxRCwyREFBMkQ7QUFDM0QseUNBQXlDO0FBQ3pDLDJDQUF1QztBQUN2Qyw4QkFBOEI7QUFDOUIsd0RBQXNEO0FBRXRELFNBQVMsZUFBZTtJQUN0QixPQUFPLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLENBQUM7QUFFRCxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtJQUN6QixJQUFJLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO1FBQ3ZDLFFBQVE7UUFDUixNQUFNLEdBQUcsR0FBRyxlQUFlLEVBQUUsQ0FBQztRQUU5QixPQUFPO1FBQ1AsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTVCLE9BQU87UUFDUCxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsbUNBQW1DO1FBQ3pFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxFQUFFLGVBQWUsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ25GLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDckUsSUFBSSxFQUFFO2dCQUNKLElBQUksRUFBRSxVQUFVO2dCQUNoQixVQUFVLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO2FBQ2xDO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FB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QU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDdkUsQ0FBQztBQUVELFNBQVMsU0FBUyxDQUFDLE1BQWMsRUFBRSxJQUFZLEVBQUUsSUFBUztJQUN4RCxFQUFFLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBvcyBmcm9tICdvcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgdGVzdERlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0ICogYXMgY3hzY2hlbWEgZnJvbSAnQGF3cy1jZGsvY2xvdWQtYXNzZW1ibHktc2NoZW1hJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgc3ludGhlc2l6ZSB9IGZyb20gJy4uL2xpYi9wcml2YXRlL3N5bnRoZXNpcyc7XG5cbmZ1bmN0aW9uIGNyZWF0ZU1vZGVybkFwcCgpIHtcbiAgcmV0dXJuIG5ldyBjZGsuQXBwKCk7XG59XG5cbmRlc2NyaWJlKCdzeW50aGVzaXMnLCAoKSA9PiB7XG4gIHRlc3QoJ3N5bnRoZXNpcyB3aXRoIGFuIGVtcHR5IGFwcCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IGNyZWF0ZU1vZGVybkFwcCgpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHNlc3Npb24gPSBhcHAuc3ludGgoKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoYXBwLnN5bnRoKCkpLnRvRXF1YWwoc2Vzc2lvbik7IC8vIHNhbWUgc2Vzc2lvbiBpZiB3ZSBzeW50aCgpIGFnYWluXG4gICAgZXhwZWN0KGxpc3Qoc2Vzc2lvbi5kaXJlY3RvcnkpKS50b0VxdWFsKFsnY2RrLm91dCcsICdtYW5pZmVzdC5qc29uJywgJ3RyZWUuanNvbiddKTtcbiAgICBleHBlY3QocmVhZEpzb24oc2Vzc2lvbi5kaXJlY3RvcnksICdtYW5pZmVzdC5qc29uJykuYXJ0aWZhY3RzKS50b0VxdWFsKHtcbiAgICAgIFRyZWU6IHtcbiAgICAgICAgdHlwZTogJ2Nkazp0cmVlJyxcbiAgICAgICAgcHJvcGVydGllczogeyBmaWxlOiAndHJlZS5qc29uJyB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBleHBlY3QocmVhZEpzb24oc2Vzc2lvbi5kaXJlY3RvcnksICd0cmVlLmpzb24nKSkudG9FcXVhbCh7XG4gICAgICB2ZXJzaW9uOiAndHJlZS0wLjEnLFxuICAgICAgdHJlZTogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICBpZDogJ0FwcCcsXG4gICAgICAgIHBhdGg6ICcnLFxuICAgICAgICBjaGlsZHJlbjoge1xuICAgICAgICAgIFRyZWU6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgaWQ6ICdUcmVlJywgcGF0aDogJ1RyZWUnIH0pLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N5bnRoZXNpcyByZXNwZWN0cyBkaXNhYmxpbmcgdHJlZSBtZXRhZGF0YScsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCh7XG4gICAgICB0cmVlTWV0YWRhdGE6IGZhbHNlLFxuICAgIH0pO1xuICAgIGNvbnN0IGFzc2VtYmx5ID0gYXBwLnN5bnRoKCk7XG4gICAgZXhwZWN0KGxpc3QoYXNzZW1ibHkuZGlyZWN0b3J5KSkudG9FcXVhbChbJ2Nkay5vdXQnLCAnbWFuaWZlc3QuanNvbiddKTtcbiAgfSk7XG5cbiAgdGVzdCgnc3ludGhlc2lzIHJlc3BlY3RzIGRpc2FibGluZyBsb2dpY2FsSWQgbWV0YWRhdGEnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoe1xuICAgICAgY29udGV4dDoge1xuICAgICAgICBbY3hhcGkuRElTQUJMRV9MT0dJQ0FMX0lEX01FVEFEQVRBXTogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ29uZS1zdGFjaycpO1xuICAgIG5ldyBjZGsuQ2ZuUmVzb3VyY2Uoc3RhY2ssICdNYWdpY1Jlc291cmNlJywgeyB0eXBlOiAnUmVzb3VyY2U6OlR5cGUnIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHNlc3Npb24gPSBhcHAuc3ludGgoKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoT2JqZWN0LmtleXMoKHNlc3Npb24ubWFuaWZlc3QuYXJ0aWZhY3RzID8/IHt9KVsnb25lLXN0YWNrJ10pKS5ub3QudG9Db250YWluKCdtZXRhZGF0YScpO1xuICB9KTtcblxuICB0ZXN0KCdzeW50aGVzaXMgcmVzcGVjdHMgZGlzYWJsaW5nIGxvZ2ljYWxJZCBtZXRhZGF0YSwgYW5kIGRvZXMgbm90IGRpc2FibGUgb3RoZXIgbWV0YWRhdGEnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoe1xuICAgICAgY29udGV4dDoge1xuICAgICAgICBbY3hhcGkuRElTQUJMRV9MT0dJQ0FMX0lEX01FVEFEQVRBXTogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBzdGFja1RyYWNlczogZmFsc2UsXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ29uZS1zdGFjaycsIHsgdGFnczogeyBib29tVGFnOiAnQk9PTScgfSB9KTtcbiAgICBuZXcgY2RrLkNmblJlc291cmNlKHN0YWNrLCAnTWFnaWNSZXNvdXJjZScsIHsgdHlwZTogJ1Jlc291cmNlOjpUeXBlJyB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzZXNzaW9uID0gYXBwLnN5bnRoKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHNlc3Npb24ubWFuaWZlc3QuYXJ0aWZhY3RzPy5bJ29uZS1zdGFjayddLm1ldGFkYXRhKS50b0VxdWFsKHtcbiAgICAgICcvb25lLXN0YWNrJzogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ2F3czpjZGs6c3RhY2stdGFncycsXG4gICAgICAgICAgZGF0YTogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBrZXk6ICdib29tVGFnJyxcbiAgICAgICAgICAgICAgdmFsdWU6ICdCT09NJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICAvLyBubyBsb2dpY2FsSWQgZW50cnlcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc2luZ2xlIGVtcHR5IHN0YWNrJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gY3JlYXRlTW9kZXJuQXBwKCk7XG4gICAgbmV3IGNkay5TdGFjayhhcHAsICdvbmUtc3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzZXNzaW9uID0gYXBwLnN5bnRoKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGxpc3Qoc2Vzc2lvbi5kaXJlY3RvcnkpLmluY2x1ZGVzKCdvbmUtc3RhY2sudGVtcGxhdGUuanNvbicpKS50b0VxdWFsKHRydWUpO1xuICB9KTtcblxuICB0ZXN0KCdzb21lIHJhbmRvbSBjb25zdHJ1Y3QgaW1wbGVtZW50cyBcInN5bnRoZXNpemVcIicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IGNyZWF0ZU1vZGVybkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdvbmUtc3RhY2snKTtcblxuICAgIGNsYXNzIE15Q29uc3RydWN0IGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgICAgICBjZGsuYXR0YWNoQ3VzdG9tU3ludGhlc2lzKHRoaXMsIHtcbiAgICAgICAgICBvblN5bnRoZXNpemUoczogY2RrLklTeW50aGVzaXNTZXNzaW9uKSB7XG4gICAgICAgICAgICB3cml0ZUpzb24ocy5hc3NlbWJseS5vdXRkaXIsICdmb28uanNvbicsIHsgYmFyOiAxMjMgfSk7XG4gICAgICAgICAgICBzLmFzc2VtYmx5LmFkZEFydGlmYWN0KCdteS1yYW5kb20tY29uc3RydWN0Jywge1xuICAgICAgICAgICAgICB0eXBlOiBjeHNjaGVtYS5BcnRpZmFjdFR5cGUuQVdTX0NMT1VERk9STUFUSU9OX1NUQUNLLFxuICAgICAgICAgICAgICBlbnZpcm9ubWVudDogJ2F3czovLzEyMzQ1L2JhcicsXG4gICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZUZpbGU6ICdmb28uanNvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBuZXcgTXlDb25zdHJ1Y3Qoc3RhY2ssICdNeUNvbnN0cnVjdCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHNlc3Npb24gPSBhcHAuc3ludGgoKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QobGlzdChzZXNzaW9uLmRpcmVjdG9yeSkuaW5jbHVkZXMoJ29uZS1zdGFjay50ZW1wbGF0ZS5qc29uJykpLnRvRXF1YWwodHJ1ZSk7XG4gICAgZXhwZWN0KGxpc3Qoc2Vzc2lvbi5kaXJlY3RvcnkpLmluY2x1ZGVzKCdmb28uanNvbicpKS50b0VxdWFsKHRydWUpO1xuXG4gICAgZXhwZWN0KHJlYWRKc29uKHNlc3Npb24uZGlyZWN0b3J5LCAnZm9vLmpzb24nKSkudG9FcXVhbCh7IGJhcjogMTIzIH0pO1xuICAgIGV4cGVjdChzZXNzaW9uLm1hbmlmZXN0KS50b0VxdWFsKHtcbiAgICAgIHZlcnNpb246IGN4c2NoZW1hLk1hbmlmZXN0LnZlcnNpb24oKSxcbiAgICAgIGFydGlmYWN0czogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAnVHJlZSc6IHtcbiAgICAgICAgICB0eXBlOiAnY2RrOnRyZWUnLFxuICAgICAgICAgIHByb3BlcnRpZXM6IHsgZmlsZTogJ3RyZWUuanNvbicgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ215LXJhbmRvbS1jb25zdHJ1Y3QnOiB7XG4gICAgICAgICAgdHlwZTogJ2F3czpjbG91ZGZvcm1hdGlvbjpzdGFjaycsXG4gICAgICAgICAgZW52aXJvbm1lbnQ6ICdhd3M6Ly8xMjM0NS9iYXInLFxuICAgICAgICAgIHByb3BlcnRpZXM6IHsgdGVtcGxhdGVGaWxlOiAnZm9vLmpzb24nIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdvbmUtc3RhY2snOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgdHlwZTogJ2F3czpjbG91ZGZvcm1hdGlvbjpzdGFjaycsXG4gICAgICAgICAgZW52aXJvbm1lbnQ6ICdhd3M6Ly91bmtub3duLWFjY291bnQvdW5rbm93bi1yZWdpb24nLFxuICAgICAgICAgIHByb3BlcnRpZXM6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIHRlbXBsYXRlRmlsZTogJ29uZS1zdGFjay50ZW1wbGF0ZS5qc29uJyxcbiAgICAgICAgICAgIHZhbGlkYXRlT25TeW50aDogZmFsc2UsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgZGlzcGxheU5hbWU6ICdvbmUtc3RhY2snLFxuICAgICAgICB9KSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyYW5kb20gY29uc3RydWN0IHVzZXMgYWRkQ3VzdG9tU3ludGhlc2lzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gY3JlYXRlTW9kZXJuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ29uZS1zdGFjaycpO1xuXG4gICAgY2xhc3MgTXlDb25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAgICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgICAgIGNkay5hdHRhY2hDdXN0b21TeW50aGVzaXModGhpcywge1xuICAgICAgICAgIG9uU3ludGhlc2l6ZShzOiBjZGsuSVN5bnRoZXNpc1Nlc3Npb24pIHtcbiAgICAgICAgICAgIHdyaXRlSnNvbihzLmFzc2VtYmx5Lm91dGRpciwgJ2Zvby5qc29uJywgeyBiYXI6IDEyMyB9KTtcbiAgICAgICAgICAgIHMuYXNzZW1ibHkuYWRkQXJ0aWZhY3QoJ215LXJhbmRvbS1jb25zdHJ1Y3QnLCB7XG4gICAgICAgICAgICAgIHR5cGU6IGN4c2NoZW1hLkFydGlmYWN0VHlwZS5BV1NfQ0xPVURGT1JNQVRJT05fU1RBQ0ssXG4gICAgICAgICAgICAgIGVudmlyb25tZW50OiAnYXdzOi8vMTIzNDUvYmFyJyxcbiAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlRmlsZTogJ2Zvby5qc29uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIG5ldyBNeUNvbnN0cnVjdChzdGFjaywgJ015Q29uc3RydWN0Jyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc2Vzc2lvbiA9IGFwcC5zeW50aCgpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChsaXN0KHNlc3Npb24uZGlyZWN0b3J5KS5pbmNsdWRlcygnb25lLXN0YWNrLnRlbXBsYXRlLmpzb24nKSkudG9FcXVhbCh0cnVlKTtcbiAgICBleHBlY3QobGlzdChzZXNzaW9uLmRpcmVjdG9yeSkuaW5jbHVkZXMoJ2Zvby5qc29uJykpLnRvRXF1YWwodHJ1ZSk7XG5cbiAgICBleHBlY3QocmVhZEpzb24oc2Vzc2lvbi5kaXJlY3RvcnksICdmb28uanNvbicpKS50b0VxdWFsKHsgYmFyOiAxMjMgfSk7XG4gICAgZXhwZWN0KHNlc3Npb24ubWFuaWZlc3QpLnRvRXF1YWwoe1xuICAgICAgdmVyc2lvbjogY3hzY2hlbWEuTWFuaWZlc3QudmVyc2lvbigpLFxuICAgICAgYXJ0aWZhY3RzOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICdUcmVlJzoge1xuICAgICAgICAgIHR5cGU6ICdjZGs6dHJlZScsXG4gICAgICAgICAgcHJvcGVydGllczogeyBmaWxlOiAndHJlZS5qc29uJyB9LFxuICAgICAgICB9LFxuICAgICAgICAnbXktcmFuZG9tLWNvbnN0cnVjdCc6IHtcbiAgICAgICAgICB0eXBlOiAnYXdzOmNsb3VkZm9ybWF0aW9uOnN0YWNrJyxcbiAgICAgICAgICBlbnZpcm9ubWVudDogJ2F3czovLzEyMzQ1L2JhcicsXG4gICAgICAgICAgcHJvcGVydGllczogeyB0ZW1wbGF0ZUZpbGU6ICdmb28uanNvbicgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ29uZS1zdGFjayc6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICB0eXBlOiAnYXdzOmNsb3VkZm9ybWF0aW9uOnN0YWNrJyxcbiAgICAgICAgICBlbnZpcm9ubWVudDogJ2F3czovL3Vua25vd24tYWNjb3VudC91bmtub3duLXJlZ2lvbicsXG4gICAgICAgICAgcHJvcGVydGllczogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgdGVtcGxhdGVGaWxlOiAnb25lLXN0YWNrLnRlbXBsYXRlLmpzb24nLFxuICAgICAgICAgICAgdmFsaWRhdGVPblN5bnRoOiBmYWxzZSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBkaXNwbGF5TmFtZTogJ29uZS1zdGFjaycsXG4gICAgICAgIH0pLFxuICAgICAgfSksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdpdCBzaG91bGQgYmUgcG9zc2libGUgdG8gc3ludGhlc2l6ZSB3aXRob3V0IGFuIGFwcCcsICgpID0+IHtcbiAgICBjb25zdCBjYWxscyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgICBjbGFzcyBTeW50aGVzaXplTWUgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICAgICAgcHVibGljIHJlYWRvbmx5IHRlbXBsYXRlRmlsZSA9ICdoZXkuanNvbic7XG5cbiAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcih1bmRlZmluZWQgYXMgYW55LCAnaGV5Jywge1xuICAgICAgICAgIHN5bnRoZXNpemVyOiBuZXcgY2RrLkxlZ2FjeVN0YWNrU3ludGhlc2l6ZXIoKSxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHtcbiAgICAgICAgICB2YWxpZGF0ZTogKCkgPT4ge1xuICAgICAgICAgICAgY2FsbHMucHVzaCgndmFsaWRhdGUnKTtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcHVibGljIF9zeW50aGVzaXplVGVtcGxhdGUoc2Vzc2lvbjogY2RrLklTeW50aGVzaXNTZXNzaW9uKSB7XG4gICAgICAgIGNhbGxzLnB1c2goJ3N5bnRoZXNpemUnKTtcblxuICAgICAgICBzZXNzaW9uLmFzc2VtYmx5LmFkZEFydGlmYWN0KCdhcnQnLCB7XG4gICAgICAgICAgdHlwZTogY3hzY2hlbWEuQXJ0aWZhY3RUeXBlLkFXU19DTE9VREZPUk1BVElPTl9TVEFDSyxcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICB0ZW1wbGF0ZUZpbGU6ICdoZXkuanNvbicsXG4gICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAgIHBhcmFtSWQ6ICdwYXJhbVZhbHVlJyxcbiAgICAgICAgICAgICAgcGFyYW1JZDI6ICdwYXJhbVZhbHVlMicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZW52aXJvbm1lbnQ6ICdhd3M6Ly91bmtub3duLWFjY291bnQvdXMtZWFzdC0xJyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgd3JpdGVKc29uKHNlc3Npb24uYXNzZW1ibHkub3V0ZGlyLCAnaGV5Lmpzb24nLCB7IGhlbGxvOiAxMjMgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdCA9IG5ldyBTeW50aGVzaXplTWUoKTtcbiAgICBjb25zdCBhc3NlbWJseSA9IHN5bnRoZXNpemUocm9vdCwgeyBvdXRkaXI6IGZzLm1rZHRlbXBTeW5jKHBhdGguam9pbihvcy50bXBkaXIoKSwgJ291dGRpcicpKSB9KTtcblxuICAgIGV4cGVjdChjYWxscykudG9FcXVhbChbJ3ZhbGlkYXRlJywgJ3N5bnRoZXNpemUnXSk7XG4gICAgY29uc3Qgc3RhY2sgPSBhc3NlbWJseS5nZXRTdGFja0J5TmFtZSgnYXJ0Jyk7XG4gICAgZXhwZWN0KHN0YWNrLnRlbXBsYXRlKS50b0VxdWFsKHsgaGVsbG86IDEyMyB9KTtcbiAgICBleHBlY3Qoc3RhY2sudGVtcGxhdGVGaWxlKS50b0VxdWFsKCdoZXkuanNvbicpO1xuICAgIGV4cGVjdChzdGFjay5wYXJhbWV0ZXJzKS50b0VxdWFsKHsgcGFyYW1JZDogJ3BhcmFtVmFsdWUnLCBwYXJhbUlkMjogJ3BhcmFtVmFsdWUyJyB9KTtcbiAgICBleHBlY3Qoc3RhY2suZW52aXJvbm1lbnQpLnRvRXF1YWwoeyByZWdpb246ICd1cy1lYXN0LTEnLCBhY2NvdW50OiAndW5rbm93bi1hY2NvdW50JywgbmFtZTogJ2F3czovL3Vua25vd24tYWNjb3VudC91cy1lYXN0LTEnIH0pO1xuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiBsaXN0KG91dGRpcjogc3RyaW5nKSB7XG4gIHJldHVybiBmcy5yZWFkZGlyU3luYyhvdXRkaXIpLnNvcnQoKTtcbn1cblxuZnVuY3Rpb24gcmVhZEpzb24ob3V0ZGlyOiBzdHJpbmcsIGZpbGU6IHN0cmluZykge1xuICByZXR1cm4gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKG91dGRpciwgZmlsZSksICd1dGYtOCcpKTtcbn1cblxuZnVuY3Rpb24gd3JpdGVKc29uKG91dGRpcjogc3RyaW5nLCBmaWxlOiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihvdXRkaXIsIGZpbGUpLCBKU09OLnN0cmluZ2lmeShkYXRhLCB1bmRlZmluZWQsIDIpKTtcbn1cbiJdfQ==