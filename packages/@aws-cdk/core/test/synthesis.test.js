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
            // no logicalId entry
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
    (0, cdk_build_tools_1.testDeprecated)('it should be possible to synthesize without an app', () => {
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
        const assembly = (0, synthesis_1.synthesize)(root, { outdir: fs.mkdtempSync(path.join(os.tmpdir(), 'outdir')) });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ludGhlc2lzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzeW50aGVzaXMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlCQUF5QjtBQUN6Qix5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLDhEQUEwRDtBQUMxRCwyREFBMkQ7QUFDM0QseUNBQXlDO0FBQ3pDLDJDQUF1QztBQUN2Qyw4QkFBOEI7QUFDOUIsd0RBQXNEO0FBRXRELFNBQVMsZUFBZTtJQUN0QixPQUFPLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLENBQUM7QUFFRCxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtJQUN6QixJQUFJLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO1FBQ3ZDLFFBQVE7UUFDUixNQUFNLEdBQUcsR0FBRyxlQUFlLEVBQUUsQ0FBQztRQUU5QixPQUFPO1FBQ1AsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTVCLE9BQU87UUFDUCxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsbUNBQW1DO1FBQ3pFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxFQUFFLGVBQWUsRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ25GLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDckUsSUFBSSxFQUFFO2dCQUNKLElBQUksRUFBRSxVQUFVO2dCQUNoQixVQUFVLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO2FBQ2xDO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FB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TUFBYyxFQUFFLElBQVk7SUFDNUMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUN2RSxDQUFDO0FBRUQsU0FBUyxTQUFTLENBQUMsTUFBYyxFQUFFLElBQVksRUFBRSxJQUFTO0lBQ3hELEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIG9zIGZyb20gJ29zJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyB0ZXN0RGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgKiBhcyBjeHNjaGVtYSBmcm9tICdAYXdzLWNkay9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuaW1wb3J0ICogYXMgY3hhcGkgZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBzeW50aGVzaXplIH0gZnJvbSAnLi4vbGliL3ByaXZhdGUvc3ludGhlc2lzJztcblxuZnVuY3Rpb24gY3JlYXRlTW9kZXJuQXBwKCkge1xuICByZXR1cm4gbmV3IGNkay5BcHAoKTtcbn1cblxuZGVzY3JpYmUoJ3N5bnRoZXNpcycsICgpID0+IHtcbiAgdGVzdCgnc3ludGhlc2lzIHdpdGggYW4gZW1wdHkgYXBwJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gY3JlYXRlTW9kZXJuQXBwKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc2Vzc2lvbiA9IGFwcC5zeW50aCgpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChhcHAuc3ludGgoKSkudG9FcXVhbChzZXNzaW9uKTsgLy8gc2FtZSBzZXNzaW9uIGlmIHdlIHN5bnRoKCkgYWdhaW5cbiAgICBleHBlY3QobGlzdChzZXNzaW9uLmRpcmVjdG9yeSkpLnRvRXF1YWwoWydjZGsub3V0JywgJ21hbmlmZXN0Lmpzb24nLCAndHJlZS5qc29uJ10pO1xuICAgIGV4cGVjdChyZWFkSnNvbihzZXNzaW9uLmRpcmVjdG9yeSwgJ21hbmlmZXN0Lmpzb24nKS5hcnRpZmFjdHMpLnRvRXF1YWwoe1xuICAgICAgVHJlZToge1xuICAgICAgICB0eXBlOiAnY2RrOnRyZWUnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7IGZpbGU6ICd0cmVlLmpzb24nIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGV4cGVjdChyZWFkSnNvbihzZXNzaW9uLmRpcmVjdG9yeSwgJ3RyZWUuanNvbicpKS50b0VxdWFsKHtcbiAgICAgIHZlcnNpb246ICd0cmVlLTAuMScsXG4gICAgICB0cmVlOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgIGlkOiAnQXBwJyxcbiAgICAgICAgcGF0aDogJycsXG4gICAgICAgIGNoaWxkcmVuOiB7XG4gICAgICAgICAgVHJlZTogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyBpZDogJ1RyZWUnLCBwYXRoOiAnVHJlZScgfSksXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc3ludGhlc2lzIHJlc3BlY3RzIGRpc2FibGluZyB0cmVlIG1ldGFkYXRhJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKHtcbiAgICAgIHRyZWVNZXRhZGF0YTogZmFsc2UsXG4gICAgfSk7XG4gICAgY29uc3QgYXNzZW1ibHkgPSBhcHAuc3ludGgoKTtcbiAgICBleHBlY3QobGlzdChhc3NlbWJseS5kaXJlY3RvcnkpKS50b0VxdWFsKFsnY2RrLm91dCcsICdtYW5pZmVzdC5qc29uJ10pO1xuICB9KTtcblxuICB0ZXN0KCdzeW50aGVzaXMgcmVzcGVjdHMgZGlzYWJsaW5nIGxvZ2ljYWxJZCBtZXRhZGF0YScsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCh7XG4gICAgICBjb250ZXh0OiB7XG4gICAgICAgIFtjeGFwaS5ESVNBQkxFX0xPR0lDQUxfSURfTUVUQURBVEFdOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnb25lLXN0YWNrJyk7XG4gICAgbmV3IGNkay5DZm5SZXNvdXJjZShzdGFjaywgJ01hZ2ljUmVzb3VyY2UnLCB7IHR5cGU6ICdSZXNvdXJjZTo6VHlwZScgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc2Vzc2lvbiA9IGFwcC5zeW50aCgpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChPYmplY3Qua2V5cygoc2Vzc2lvbi5tYW5pZmVzdC5hcnRpZmFjdHMgPz8ge30pWydvbmUtc3RhY2snXSkpLm5vdC50b0NvbnRhaW4oJ21ldGFkYXRhJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N5bnRoZXNpcyByZXNwZWN0cyBkaXNhYmxpbmcgbG9naWNhbElkIG1ldGFkYXRhLCBhbmQgZG9lcyBub3QgZGlzYWJsZSBvdGhlciBtZXRhZGF0YScsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCh7XG4gICAgICBjb250ZXh0OiB7XG4gICAgICAgIFtjeGFwaS5ESVNBQkxFX0xPR0lDQUxfSURfTUVUQURBVEFdOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHN0YWNrVHJhY2VzOiBmYWxzZSxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnb25lLXN0YWNrJywgeyB0YWdzOiB7IGJvb21UYWc6ICdCT09NJyB9IH0pO1xuICAgIG5ldyBjZGsuQ2ZuUmVzb3VyY2Uoc3RhY2ssICdNYWdpY1Jlc291cmNlJywgeyB0eXBlOiAnUmVzb3VyY2U6OlR5cGUnIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHNlc3Npb24gPSBhcHAuc3ludGgoKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc2Vzc2lvbi5tYW5pZmVzdC5hcnRpZmFjdHM/Llsnb25lLXN0YWNrJ10ubWV0YWRhdGEpLnRvRXF1YWwoe1xuICAgICAgJy9vbmUtc3RhY2snOiBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnYXdzOmNkazpzdGFjay10YWdzJyxcbiAgICAgICAgICBkYXRhOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGtleTogJ2Jvb21UYWcnLFxuICAgICAgICAgICAgICB2YWx1ZTogJ0JPT00nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIC8vIG5vIGxvZ2ljYWxJZCBlbnRyeVxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzaW5nbGUgZW1wdHkgc3RhY2snLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBjcmVhdGVNb2Rlcm5BcHAoKTtcbiAgICBuZXcgY2RrLlN0YWNrKGFwcCwgJ29uZS1zdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHNlc3Npb24gPSBhcHAuc3ludGgoKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QobGlzdChzZXNzaW9uLmRpcmVjdG9yeSkuaW5jbHVkZXMoJ29uZS1zdGFjay50ZW1wbGF0ZS5qc29uJykpLnRvRXF1YWwodHJ1ZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3NvbWUgcmFuZG9tIGNvbnN0cnVjdCBpbXBsZW1lbnRzIFwic3ludGhlc2l6ZVwiJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gY3JlYXRlTW9kZXJuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ29uZS1zdGFjaycpO1xuXG4gICAgY2xhc3MgTXlDb25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAgICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgICAgIGNkay5hdHRhY2hDdXN0b21TeW50aGVzaXModGhpcywge1xuICAgICAgICAgIG9uU3ludGhlc2l6ZShzOiBjZGsuSVN5bnRoZXNpc1Nlc3Npb24pIHtcbiAgICAgICAgICAgIHdyaXRlSnNvbihzLmFzc2VtYmx5Lm91dGRpciwgJ2Zvby5qc29uJywgeyBiYXI6IDEyMyB9KTtcbiAgICAgICAgICAgIHMuYXNzZW1ibHkuYWRkQXJ0aWZhY3QoJ215LXJhbmRvbS1jb25zdHJ1Y3QnLCB7XG4gICAgICAgICAgICAgIHR5cGU6IGN4c2NoZW1hLkFydGlmYWN0VHlwZS5BV1NfQ0xPVURGT1JNQVRJT05fU1RBQ0ssXG4gICAgICAgICAgICAgIGVudmlyb25tZW50OiAnYXdzOi8vMTIzNDUvYmFyJyxcbiAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgIHRlbXBsYXRlRmlsZTogJ2Zvby5qc29uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIG5ldyBNeUNvbnN0cnVjdChzdGFjaywgJ015Q29uc3RydWN0Jyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgc2Vzc2lvbiA9IGFwcC5zeW50aCgpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChsaXN0KHNlc3Npb24uZGlyZWN0b3J5KS5pbmNsdWRlcygnb25lLXN0YWNrLnRlbXBsYXRlLmpzb24nKSkudG9FcXVhbCh0cnVlKTtcbiAgICBleHBlY3QobGlzdChzZXNzaW9uLmRpcmVjdG9yeSkuaW5jbHVkZXMoJ2Zvby5qc29uJykpLnRvRXF1YWwodHJ1ZSk7XG5cbiAgICBleHBlY3QocmVhZEpzb24oc2Vzc2lvbi5kaXJlY3RvcnksICdmb28uanNvbicpKS50b0VxdWFsKHsgYmFyOiAxMjMgfSk7XG4gICAgZXhwZWN0KHNlc3Npb24ubWFuaWZlc3QpLnRvRXF1YWwoe1xuICAgICAgdmVyc2lvbjogY3hzY2hlbWEuTWFuaWZlc3QudmVyc2lvbigpLFxuICAgICAgYXJ0aWZhY3RzOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICdUcmVlJzoge1xuICAgICAgICAgIHR5cGU6ICdjZGs6dHJlZScsXG4gICAgICAgICAgcHJvcGVydGllczogeyBmaWxlOiAndHJlZS5qc29uJyB9LFxuICAgICAgICB9LFxuICAgICAgICAnbXktcmFuZG9tLWNvbnN0cnVjdCc6IHtcbiAgICAgICAgICB0eXBlOiAnYXdzOmNsb3VkZm9ybWF0aW9uOnN0YWNrJyxcbiAgICAgICAgICBlbnZpcm9ubWVudDogJ2F3czovLzEyMzQ1L2JhcicsXG4gICAgICAgICAgcHJvcGVydGllczogeyB0ZW1wbGF0ZUZpbGU6ICdmb28uanNvbicgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ29uZS1zdGFjayc6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICB0eXBlOiAnYXdzOmNsb3VkZm9ybWF0aW9uOnN0YWNrJyxcbiAgICAgICAgICBlbnZpcm9ubWVudDogJ2F3czovL3Vua25vd24tYWNjb3VudC91bmtub3duLXJlZ2lvbicsXG4gICAgICAgICAgcHJvcGVydGllczogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgdGVtcGxhdGVGaWxlOiAnb25lLXN0YWNrLnRlbXBsYXRlLmpzb24nLFxuICAgICAgICAgICAgdmFsaWRhdGVPblN5bnRoOiBmYWxzZSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBkaXNwbGF5TmFtZTogJ29uZS1zdGFjaycsXG4gICAgICAgIH0pLFxuICAgICAgfSksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JhbmRvbSBjb25zdHJ1Y3QgdXNlcyBhZGRDdXN0b21TeW50aGVzaXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBjcmVhdGVNb2Rlcm5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnb25lLXN0YWNrJyk7XG5cbiAgICBjbGFzcyBNeUNvbnN0cnVjdCBleHRlbmRzIENvbnN0cnVjdCB7XG4gICAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAgICAgY2RrLmF0dGFjaEN1c3RvbVN5bnRoZXNpcyh0aGlzLCB7XG4gICAgICAgICAgb25TeW50aGVzaXplKHM6IGNkay5JU3ludGhlc2lzU2Vzc2lvbikge1xuICAgICAgICAgICAgd3JpdGVKc29uKHMuYXNzZW1ibHkub3V0ZGlyLCAnZm9vLmpzb24nLCB7IGJhcjogMTIzIH0pO1xuICAgICAgICAgICAgcy5hc3NlbWJseS5hZGRBcnRpZmFjdCgnbXktcmFuZG9tLWNvbnN0cnVjdCcsIHtcbiAgICAgICAgICAgICAgdHlwZTogY3hzY2hlbWEuQXJ0aWZhY3RUeXBlLkFXU19DTE9VREZPUk1BVElPTl9TVEFDSyxcbiAgICAgICAgICAgICAgZW52aXJvbm1lbnQ6ICdhd3M6Ly8xMjM0NS9iYXInLFxuICAgICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGVGaWxlOiAnZm9vLmpzb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbmV3IE15Q29uc3RydWN0KHN0YWNrLCAnTXlDb25zdHJ1Y3QnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzZXNzaW9uID0gYXBwLnN5bnRoKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KGxpc3Qoc2Vzc2lvbi5kaXJlY3RvcnkpLmluY2x1ZGVzKCdvbmUtc3RhY2sudGVtcGxhdGUuanNvbicpKS50b0VxdWFsKHRydWUpO1xuICAgIGV4cGVjdChsaXN0KHNlc3Npb24uZGlyZWN0b3J5KS5pbmNsdWRlcygnZm9vLmpzb24nKSkudG9FcXVhbCh0cnVlKTtcblxuICAgIGV4cGVjdChyZWFkSnNvbihzZXNzaW9uLmRpcmVjdG9yeSwgJ2Zvby5qc29uJykpLnRvRXF1YWwoeyBiYXI6IDEyMyB9KTtcbiAgICBleHBlY3Qoc2Vzc2lvbi5tYW5pZmVzdCkudG9FcXVhbCh7XG4gICAgICB2ZXJzaW9uOiBjeHNjaGVtYS5NYW5pZmVzdC52ZXJzaW9uKCksXG4gICAgICBhcnRpZmFjdHM6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgJ1RyZWUnOiB7XG4gICAgICAgICAgdHlwZTogJ2Nkazp0cmVlJyxcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7IGZpbGU6ICd0cmVlLmpzb24nIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdteS1yYW5kb20tY29uc3RydWN0Jzoge1xuICAgICAgICAgIHR5cGU6ICdhd3M6Y2xvdWRmb3JtYXRpb246c3RhY2snLFxuICAgICAgICAgIGVudmlyb25tZW50OiAnYXdzOi8vMTIzNDUvYmFyJyxcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7IHRlbXBsYXRlRmlsZTogJ2Zvby5qc29uJyB9LFxuICAgICAgICB9LFxuICAgICAgICAnb25lLXN0YWNrJzogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIHR5cGU6ICdhd3M6Y2xvdWRmb3JtYXRpb246c3RhY2snLFxuICAgICAgICAgIGVudmlyb25tZW50OiAnYXdzOi8vdW5rbm93bi1hY2NvdW50L3Vua25vd24tcmVnaW9uJyxcbiAgICAgICAgICBwcm9wZXJ0aWVzOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICB0ZW1wbGF0ZUZpbGU6ICdvbmUtc3RhY2sudGVtcGxhdGUuanNvbicsXG4gICAgICAgICAgICB2YWxpZGF0ZU9uU3ludGg6IGZhbHNlLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIGRpc3BsYXlOYW1lOiAnb25lLXN0YWNrJyxcbiAgICAgICAgfSksXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ2l0IHNob3VsZCBiZSBwb3NzaWJsZSB0byBzeW50aGVzaXplIHdpdGhvdXQgYW4gYXBwJywgKCkgPT4ge1xuICAgIGNvbnN0IGNhbGxzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblxuICAgIGNsYXNzIFN5bnRoZXNpemVNZSBleHRlbmRzIGNkay5TdGFjayB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgdGVtcGxhdGVGaWxlID0gJ2hleS5qc29uJztcblxuICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKHVuZGVmaW5lZCBhcyBhbnksICdoZXknLCB7XG4gICAgICAgICAgc3ludGhlc2l6ZXI6IG5ldyBjZGsuTGVnYWN5U3RhY2tTeW50aGVzaXplcigpLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5ub2RlLmFkZFZhbGlkYXRpb24oe1xuICAgICAgICAgIHZhbGlkYXRlOiAoKSA9PiB7XG4gICAgICAgICAgICBjYWxscy5wdXNoKCd2YWxpZGF0ZScpO1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBwdWJsaWMgX3N5bnRoZXNpemVUZW1wbGF0ZShzZXNzaW9uOiBjZGsuSVN5bnRoZXNpc1Nlc3Npb24pIHtcbiAgICAgICAgY2FsbHMucHVzaCgnc3ludGhlc2l6ZScpO1xuXG4gICAgICAgIHNlc3Npb24uYXNzZW1ibHkuYWRkQXJ0aWZhY3QoJ2FydCcsIHtcbiAgICAgICAgICB0eXBlOiBjeHNjaGVtYS5BcnRpZmFjdFR5cGUuQVdTX0NMT1VERk9STUFUSU9OX1NUQUNLLFxuICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIHRlbXBsYXRlRmlsZTogJ2hleS5qc29uJyxcbiAgICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgcGFyYW1JZDogJ3BhcmFtVmFsdWUnLFxuICAgICAgICAgICAgICBwYXJhbUlkMjogJ3BhcmFtVmFsdWUyJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBlbnZpcm9ubWVudDogJ2F3czovL3Vua25vd24tYWNjb3VudC91cy1lYXN0LTEnLFxuICAgICAgICB9KTtcblxuICAgICAgICB3cml0ZUpzb24oc2Vzc2lvbi5hc3NlbWJseS5vdXRkaXIsICdoZXkuanNvbicsIHsgaGVsbG86IDEyMyB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCByb290ID0gbmV3IFN5bnRoZXNpemVNZSgpO1xuICAgIGNvbnN0IGFzc2VtYmx5ID0gc3ludGhlc2l6ZShyb290LCB7IG91dGRpcjogZnMubWtkdGVtcFN5bmMocGF0aC5qb2luKG9zLnRtcGRpcigpLCAnb3V0ZGlyJykpIH0pO1xuXG4gICAgZXhwZWN0KGNhbGxzKS50b0VxdWFsKFsndmFsaWRhdGUnLCAnc3ludGhlc2l6ZSddKTtcbiAgICBjb25zdCBzdGFjayA9IGFzc2VtYmx5LmdldFN0YWNrQnlOYW1lKCdhcnQnKTtcbiAgICBleHBlY3Qoc3RhY2sudGVtcGxhdGUpLnRvRXF1YWwoeyBoZWxsbzogMTIzIH0pO1xuICAgIGV4cGVjdChzdGFjay50ZW1wbGF0ZUZpbGUpLnRvRXF1YWwoJ2hleS5qc29uJyk7XG4gICAgZXhwZWN0KHN0YWNrLnBhcmFtZXRlcnMpLnRvRXF1YWwoeyBwYXJhbUlkOiAncGFyYW1WYWx1ZScsIHBhcmFtSWQyOiAncGFyYW1WYWx1ZTInIH0pO1xuICAgIGV4cGVjdChzdGFjay5lbnZpcm9ubWVudCkudG9FcXVhbCh7IHJlZ2lvbjogJ3VzLWVhc3QtMScsIGFjY291bnQ6ICd1bmtub3duLWFjY291bnQnLCBuYW1lOiAnYXdzOi8vdW5rbm93bi1hY2NvdW50L3VzLWVhc3QtMScgfSk7XG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIGxpc3Qob3V0ZGlyOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGZzLnJlYWRkaXJTeW5jKG91dGRpcikuc29ydCgpO1xufVxuXG5mdW5jdGlvbiByZWFkSnNvbihvdXRkaXI6IHN0cmluZywgZmlsZTogc3RyaW5nKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4ob3V0ZGlyLCBmaWxlKSwgJ3V0Zi04JykpO1xufVxuXG5mdW5jdGlvbiB3cml0ZUpzb24ob3V0ZGlyOiBzdHJpbmcsIGZpbGU6IHN0cmluZywgZGF0YTogYW55KSB7XG4gIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKG91dGRpciwgZmlsZSksIEpTT04uc3RyaW5naWZ5KGRhdGEsIHVuZGVmaW5lZCwgMikpO1xufVxuIl19