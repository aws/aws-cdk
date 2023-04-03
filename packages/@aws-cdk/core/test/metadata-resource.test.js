"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const zlib = require("zlib");
const constructs_1 = require("constructs");
const lib_1 = require("../lib");
const metadata_resource_1 = require("../lib/private/metadata-resource");
describe('MetadataResource', () => {
    let app;
    let stack;
    beforeEach(() => {
        app = new lib_1.App({
            analyticsReporting: true,
        });
        stack = new lib_1.Stack(app, 'Stack');
    });
    test('is not included if the region is known and metadata is not available', () => {
        new lib_1.Stack(app, 'StackUnavailable', {
            env: { region: 'definitely-no-metadata-resource-available-here' },
        });
        const stackTemplate = app.synth().getStackByName('StackUnavailable').template;
        expect(stackTemplate.Resources?.CDKMetadata).toBeUndefined();
    });
    test('is included if the region is known and metadata is available', () => {
        new lib_1.Stack(app, 'StackPresent', {
            env: { region: 'us-east-1' },
        });
        const stackTemplate = app.synth().getStackByName('StackPresent').template;
        expect(stackTemplate.Resources?.CDKMetadata).toBeDefined();
    });
    test('is included if the region is unknown with conditions', () => {
        new lib_1.Stack(app, 'StackUnknown');
        const stackTemplate = app.synth().getStackByName('StackUnknown').template;
        expect(stackTemplate.Resources?.CDKMetadata).toBeDefined();
        expect(stackTemplate.Resources?.CDKMetadata?.Condition).toBeDefined();
    });
    test('includes the formatted Analytics property', () => {
        // A very simple check that the jsii runtime psuedo-construct is present.
        // This check works whether we're running locally or on CodeBuild, on v1 or v2.
        // Other tests(in app.test.ts) will test version-specific results.
        expect(stackAnalytics()).toMatch(/jsii-runtime.Runtime/);
    });
    test('includes the current jsii runtime version', () => {
        process.env.JSII_AGENT = 'Java/1.2.3.4';
        expect(stackAnalytics()).toContain('Java/1.2.3.4!jsii-runtime.Runtime');
        delete process.env.JSII_AGENT;
    });
    test('includes constructs added to the stack', () => {
        new TestConstruct(stack, 'Test');
        expect(stackAnalytics()).toContain('FakeVersion.2.3!@amzn/core.TestConstruct');
    });
    test('only includes constructs in the allow list', () => {
        new TestThirdPartyConstruct(stack, 'Test');
        expect(stackAnalytics()).not.toContain('TestConstruct');
    });
    function stackAnalytics(stackName = 'Stack') {
        const encodedAnalytics = app.synth().getStackByName(stackName).template.Resources?.CDKMetadata?.Properties?.Analytics;
        return plaintextConstructsFromAnalytics(encodedAnalytics);
    }
});
describe('formatAnalytics', () => {
    test('analytics are formatted with a prefix of v2:deflate64:', () => {
        const constructInfo = [{ fqn: 'aws-cdk-lib.Construct', version: '1.2.3' }];
        expect(metadata_resource_1.formatAnalytics(constructInfo)).toMatch(/v2:deflate64:.*/);
    });
    test('single construct', () => {
        const constructInfo = [{ fqn: 'aws-cdk-lib.Construct', version: '1.2.3' }];
        expectAnalytics(constructInfo, '1.2.3!aws-cdk-lib.Construct');
    });
    test('common prefixes with same versions are combined', () => {
        const constructInfo = [
            { fqn: 'aws-cdk-lib.Construct', version: '1.2.3' },
            { fqn: 'aws-cdk-lib.CfnResource', version: '1.2.3' },
            { fqn: 'aws-cdk-lib.Stack', version: '1.2.3' },
        ];
        expectAnalytics(constructInfo, '1.2.3!aws-cdk-lib.{Construct,CfnResource,Stack}');
    });
    test('nested modules with common prefixes and same versions are combined', () => {
        const constructInfo = [
            { fqn: 'aws-cdk-lib.Construct', version: '1.2.3' },
            { fqn: 'aws-cdk-lib.CfnResource', version: '1.2.3' },
            { fqn: 'aws-cdk-lib.Stack', version: '1.2.3' },
            { fqn: 'aws-cdk-lib.aws_servicefoo.CoolResource', version: '1.2.3' },
            { fqn: 'aws-cdk-lib.aws_servicefoo.OtherResource', version: '1.2.3' },
        ];
        expectAnalytics(constructInfo, '1.2.3!aws-cdk-lib.{Construct,CfnResource,Stack,aws_servicefoo.{CoolResource,OtherResource}}');
    });
    test('constructs are grouped by version', () => {
        const constructInfo = [
            { fqn: 'aws-cdk-lib.Construct', version: '1.2.3' },
            { fqn: 'aws-cdk-lib.CfnResource', version: '1.2.3' },
            { fqn: 'aws-cdk-lib.Stack', version: '1.2.3' },
            { fqn: 'aws-cdk-lib.CoolResource', version: '0.1.2' },
            { fqn: 'aws-cdk-lib.OtherResource', version: '0.1.2' },
        ];
        expectAnalytics(constructInfo, '1.2.3!aws-cdk-lib.{Construct,CfnResource,Stack},0.1.2!aws-cdk-lib.{CoolResource,OtherResource}');
    });
    test('ensure gzip is encoded with "unknown" operating system to maintain consistent output across systems', () => {
        const constructInfo = [{ fqn: 'aws-cdk-lib.Construct', version: '1.2.3' }];
        const analytics = metadata_resource_1.formatAnalytics(constructInfo);
        const gzip = Buffer.from(analytics.split(':')[2], 'base64');
        expect(gzip[9]).toBe(255);
    });
    // Compares the output of formatAnalytics with an expected (plaintext) output.
    // For ease of testing, the plaintext versions are compared rather than the encoded versions.
    function expectAnalytics(constructs, expectedPlaintext) {
        expect(plaintextConstructsFromAnalytics(metadata_resource_1.formatAnalytics(constructs))).toEqual(expectedPlaintext);
    }
});
function plaintextConstructsFromAnalytics(analytics) {
    return zlib.gunzipSync(Buffer.from(analytics.split(':')[2], 'base64')).toString('utf-8');
}
const JSII_RUNTIME_SYMBOL = Symbol.for('jsii.rtti');
class TestConstruct extends constructs_1.Construct {
}
_a = JSII_RUNTIME_SYMBOL;
// @ts-ignore
TestConstruct[_a] = { fqn: '@amzn/core.TestConstruct', version: 'FakeVersion.2.3' };
class TestThirdPartyConstruct extends constructs_1.Construct {
}
_b = JSII_RUNTIME_SYMBOL;
// @ts-ignore
TestThirdPartyConstruct[_b] = { fqn: 'mycoolthing.TestConstruct', version: '1.2.3' };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGEtcmVzb3VyY2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1ldGFkYXRhLXJlc291cmNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTZCO0FBQzdCLDJDQUF1QztBQUN2QyxnQ0FBb0M7QUFDcEMsd0VBQW1FO0FBR25FLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDaEMsSUFBSSxHQUFRLENBQUM7SUFDYixJQUFJLEtBQVksQ0FBQztJQUVqQixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDO1lBQ1osa0JBQWtCLEVBQUUsSUFBSTtTQUN6QixDQUFDLENBQUM7UUFDSCxLQUFLLEdBQUcsSUFBSSxXQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHNFQUFzRSxFQUFFLEdBQUcsRUFBRTtRQUNoRixJQUFJLFdBQUssQ0FBQyxHQUFHLEVBQUUsa0JBQWtCLEVBQUU7WUFDakMsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLGdEQUFnRCxFQUFFO1NBQ2xFLENBQUMsQ0FBQztRQUVILE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFFOUUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDL0QsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsOERBQThELEVBQUUsR0FBRyxFQUFFO1FBQ3hFLElBQUksV0FBSyxDQUFDLEdBQUcsRUFBRSxjQUFjLEVBQUU7WUFDN0IsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRTtTQUM3QixDQUFDLENBQUM7UUFFSCxNQUFNLGFBQWEsR0FBRyxHQUFHLENB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QyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNGLENBQUM7QUFFRCxNQUFNLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7QUFFcEQsTUFBTSxhQUFjLFNBQVEsc0JBQVM7O0tBRVYsbUJBQW1CO0FBRDVDLGFBQWE7QUFDVyxpQkFBcUIsR0FBRyxFQUFFLEdBQUcsRUFBRSwwQkFBMEIsRUFBRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQTtBQUdqSCxNQUFNLHVCQUF3QixTQUFRLHNCQUFTOztLQUVwQixtQkFBbUI7QUFENUMsYUFBYTtBQUNXLDJCQUFxQixHQUFHLEVBQUUsR0FBRyxFQUFFLDJCQUEyQixFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHpsaWIgZnJvbSAnemxpYic7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEFwcCwgU3RhY2sgfSBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgZm9ybWF0QW5hbHl0aWNzIH0gZnJvbSAnLi4vbGliL3ByaXZhdGUvbWV0YWRhdGEtcmVzb3VyY2UnO1xuaW1wb3J0IHsgQ29uc3RydWN0SW5mbyB9IGZyb20gJy4uL2xpYi9wcml2YXRlL3J1bnRpbWUtaW5mbyc7XG5cbmRlc2NyaWJlKCdNZXRhZGF0YVJlc291cmNlJywgKCkgPT4ge1xuICBsZXQgYXBwOiBBcHA7XG4gIGxldCBzdGFjazogU3RhY2s7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYXBwID0gbmV3IEFwcCh7XG4gICAgICBhbmFseXRpY3NSZXBvcnRpbmc6IHRydWUsXG4gICAgfSk7XG4gICAgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2snKTtcbiAgfSk7XG5cbiAgdGVzdCgnaXMgbm90IGluY2x1ZGVkIGlmIHRoZSByZWdpb24gaXMga25vd24gYW5kIG1ldGFkYXRhIGlzIG5vdCBhdmFpbGFibGUnLCAoKSA9PiB7XG4gICAgbmV3IFN0YWNrKGFwcCwgJ1N0YWNrVW5hdmFpbGFibGUnLCB7XG4gICAgICBlbnY6IHsgcmVnaW9uOiAnZGVmaW5pdGVseS1uby1tZXRhZGF0YS1yZXNvdXJjZS1hdmFpbGFibGUtaGVyZScgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHN0YWNrVGVtcGxhdGUgPSBhcHAuc3ludGgoKS5nZXRTdGFja0J5TmFtZSgnU3RhY2tVbmF2YWlsYWJsZScpLnRlbXBsYXRlO1xuXG4gICAgZXhwZWN0KHN0YWNrVGVtcGxhdGUuUmVzb3VyY2VzPy5DREtNZXRhZGF0YSkudG9CZVVuZGVmaW5lZCgpO1xuICB9KTtcblxuICB0ZXN0KCdpcyBpbmNsdWRlZCBpZiB0aGUgcmVnaW9uIGlzIGtub3duIGFuZCBtZXRhZGF0YSBpcyBhdmFpbGFibGUnLCAoKSA9PiB7XG4gICAgbmV3IFN0YWNrKGFwcCwgJ1N0YWNrUHJlc2VudCcsIHtcbiAgICAgIGVudjogeyByZWdpb246ICd1cy1lYXN0LTEnIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBzdGFja1RlbXBsYXRlID0gYXBwLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUoJ1N0YWNrUHJlc2VudCcpLnRlbXBsYXRlO1xuXG4gICAgZXhwZWN0KHN0YWNrVGVtcGxhdGUuUmVzb3VyY2VzPy5DREtNZXRhZGF0YSkudG9CZURlZmluZWQoKTtcbiAgfSk7XG5cbiAgdGVzdCgnaXMgaW5jbHVkZWQgaWYgdGhlIHJlZ2lvbiBpcyB1bmtub3duIHdpdGggY29uZGl0aW9ucycsICgpID0+IHtcbiAgICBuZXcgU3RhY2soYXBwLCAnU3RhY2tVbmtub3duJyk7XG5cbiAgICBjb25zdCBzdGFja1RlbXBsYXRlID0gYXBwLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUoJ1N0YWNrVW5rbm93bicpLnRlbXBsYXRlO1xuXG4gICAgZXhwZWN0KHN0YWNrVGVtcGxhdGUuUmVzb3VyY2VzPy5DREtNZXRhZGF0YSkudG9CZURlZmluZWQoKTtcbiAgICBleHBlY3Qoc3RhY2tUZW1wbGF0ZS5SZXNvdXJjZXM/LkNES01ldGFkYXRhPy5Db25kaXRpb24pLnRvQmVEZWZpbmVkKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2luY2x1ZGVzIHRoZSBmb3JtYXR0ZWQgQW5hbHl0aWNzIHByb3BlcnR5JywgKCkgPT4ge1xuICAgIC8vIEEgdmVyeSBzaW1wbGUgY2hlY2sgdGhhdCB0aGUganNpaSBydW50aW1lIHBzdWVkby1jb25zdHJ1Y3QgaXMgcHJlc2VudC5cbiAgICAvLyBUaGlzIGNoZWNrIHdvcmtzIHdoZXRoZXIgd2UncmUgcnVubmluZyBsb2NhbGx5IG9yIG9uIENvZGVCdWlsZCwgb24gdjEgb3IgdjIuXG4gICAgLy8gT3RoZXIgdGVzdHMoaW4gYXBwLnRlc3QudHMpIHdpbGwgdGVzdCB2ZXJzaW9uLXNwZWNpZmljIHJlc3VsdHMuXG4gICAgZXhwZWN0KHN0YWNrQW5hbHl0aWNzKCkpLnRvTWF0Y2goL2pzaWktcnVudGltZS5SdW50aW1lLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2luY2x1ZGVzIHRoZSBjdXJyZW50IGpzaWkgcnVudGltZSB2ZXJzaW9uJywgKCkgPT4ge1xuICAgIHByb2Nlc3MuZW52LkpTSUlfQUdFTlQgPSAnSmF2YS8xLjIuMy40JztcblxuICAgIGV4cGVjdChzdGFja0FuYWx5dGljcygpKS50b0NvbnRhaW4oJ0phdmEvMS4yLjMuNCFqc2lpLXJ1bnRpbWUuUnVudGltZScpO1xuICAgIGRlbGV0ZSBwcm9jZXNzLmVudi5KU0lJX0FHRU5UO1xuICB9KTtcblxuICB0ZXN0KCdpbmNsdWRlcyBjb25zdHJ1Y3RzIGFkZGVkIHRvIHRoZSBzdGFjaycsICgpID0+IHtcbiAgICBuZXcgVGVzdENvbnN0cnVjdChzdGFjaywgJ1Rlc3QnKTtcblxuICAgIGV4cGVjdChzdGFja0FuYWx5dGljcygpKS50b0NvbnRhaW4oJ0Zha2VWZXJzaW9uLjIuMyFAYW16bi9jb3JlLlRlc3RDb25zdHJ1Y3QnKTtcbiAgfSk7XG5cbiAgdGVzdCgnb25seSBpbmNsdWRlcyBjb25zdHJ1Y3RzIGluIHRoZSBhbGxvdyBsaXN0JywgKCkgPT4ge1xuICAgIG5ldyBUZXN0VGhpcmRQYXJ0eUNvbnN0cnVjdChzdGFjaywgJ1Rlc3QnKTtcblxuICAgIGV4cGVjdChzdGFja0FuYWx5dGljcygpKS5ub3QudG9Db250YWluKCdUZXN0Q29uc3RydWN0Jyk7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHN0YWNrQW5hbHl0aWNzKHN0YWNrTmFtZTogc3RyaW5nID0gJ1N0YWNrJykge1xuICAgIGNvbnN0IGVuY29kZWRBbmFseXRpY3MgPSBhcHAuc3ludGgoKS5nZXRTdGFja0J5TmFtZShzdGFja05hbWUpLnRlbXBsYXRlLlJlc291cmNlcz8uQ0RLTWV0YWRhdGE/LlByb3BlcnRpZXM/LkFuYWx5dGljcyBhcyBzdHJpbmc7XG4gICAgcmV0dXJuIHBsYWludGV4dENvbnN0cnVjdHNGcm9tQW5hbHl0aWNzKGVuY29kZWRBbmFseXRpY3MpO1xuICB9XG59KTtcblxuZGVzY3JpYmUoJ2Zvcm1hdEFuYWx5dGljcycsICgpID0+IHtcbiAgdGVzdCgnYW5hbHl0aWNzIGFyZSBmb3JtYXR0ZWQgd2l0aCBhIHByZWZpeCBvZiB2MjpkZWZsYXRlNjQ6JywgKCkgPT4ge1xuICAgIGNvbnN0IGNvbnN0cnVjdEluZm8gPSBbeyBmcW46ICdhd3MtY2RrLWxpYi5Db25zdHJ1Y3QnLCB2ZXJzaW9uOiAnMS4yLjMnIH1dO1xuXG4gICAgZXhwZWN0KGZvcm1hdEFuYWx5dGljcyhjb25zdHJ1Y3RJbmZvKSkudG9NYXRjaCgvdjI6ZGVmbGF0ZTY0Oi4qLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3NpbmdsZSBjb25zdHJ1Y3QnLCAoKSA9PiB7XG4gICAgY29uc3QgY29uc3RydWN0SW5mbyA9IFt7IGZxbjogJ2F3cy1jZGstbGliLkNvbnN0cnVjdCcsIHZlcnNpb246ICcxLjIuMycgfV07XG5cbiAgICBleHBlY3RBbmFseXRpY3MoY29uc3RydWN0SW5mbywgJzEuMi4zIWF3cy1jZGstbGliLkNvbnN0cnVjdCcpO1xuICB9KTtcblxuICB0ZXN0KCdjb21tb24gcHJlZml4ZXMgd2l0aCBzYW1lIHZlcnNpb25zIGFyZSBjb21iaW5lZCcsICgpID0+IHtcbiAgICBjb25zdCBjb25zdHJ1Y3RJbmZvID0gW1xuICAgICAgeyBmcW46ICdhd3MtY2RrLWxpYi5Db25zdHJ1Y3QnLCB2ZXJzaW9uOiAnMS4yLjMnIH0sXG4gICAgICB7IGZxbjogJ2F3cy1jZGstbGliLkNmblJlc291cmNlJywgdmVyc2lvbjogJzEuMi4zJyB9LFxuICAgICAgeyBmcW46ICdhd3MtY2RrLWxpYi5TdGFjaycsIHZlcnNpb246ICcxLjIuMycgfSxcbiAgICBdO1xuXG4gICAgZXhwZWN0QW5hbHl0aWNzKGNvbnN0cnVjdEluZm8sICcxLjIuMyFhd3MtY2RrLWxpYi57Q29uc3RydWN0LENmblJlc291cmNlLFN0YWNrfScpO1xuICB9KTtcblxuICB0ZXN0KCduZXN0ZWQgbW9kdWxlcyB3aXRoIGNvbW1vbiBwcmVmaXhlcyBhbmQgc2FtZSB2ZXJzaW9ucyBhcmUgY29tYmluZWQnLCAoKSA9PiB7XG4gICAgY29uc3QgY29uc3RydWN0SW5mbyA9IFtcbiAgICAgIHsgZnFuOiAnYXdzLWNkay1saWIuQ29uc3RydWN0JywgdmVyc2lvbjogJzEuMi4zJyB9LFxuICAgICAgeyBmcW46ICdhd3MtY2RrLWxpYi5DZm5SZXNvdXJjZScsIHZlcnNpb246ICcxLjIuMycgfSxcbiAgICAgIHsgZnFuOiAnYXdzLWNkay1saWIuU3RhY2snLCB2ZXJzaW9uOiAnMS4yLjMnIH0sXG4gICAgICB7IGZxbjogJ2F3cy1jZGstbGliLmF3c19zZXJ2aWNlZm9vLkNvb2xSZXNvdXJjZScsIHZlcnNpb246ICcxLjIuMycgfSxcbiAgICAgIHsgZnFuOiAnYXdzLWNkay1saWIuYXdzX3NlcnZpY2Vmb28uT3RoZXJSZXNvdXJjZScsIHZlcnNpb246ICcxLjIuMycgfSxcbiAgICBdO1xuXG4gICAgZXhwZWN0QW5hbHl0aWNzKGNvbnN0cnVjdEluZm8sICcxLjIuMyFhd3MtY2RrLWxpYi57Q29uc3RydWN0LENmblJlc291cmNlLFN0YWNrLGF3c19zZXJ2aWNlZm9vLntDb29sUmVzb3VyY2UsT3RoZXJSZXNvdXJjZX19Jyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NvbnN0cnVjdHMgYXJlIGdyb3VwZWQgYnkgdmVyc2lvbicsICgpID0+IHtcbiAgICBjb25zdCBjb25zdHJ1Y3RJbmZvID0gW1xuICAgICAgeyBmcW46ICdhd3MtY2RrLWxpYi5Db25zdHJ1Y3QnLCB2ZXJzaW9uOiAnMS4yLjMnIH0sXG4gICAgICB7IGZxbjogJ2F3cy1jZGstbGliLkNmblJlc291cmNlJywgdmVyc2lvbjogJzEuMi4zJyB9LFxuICAgICAgeyBmcW46ICdhd3MtY2RrLWxpYi5TdGFjaycsIHZlcnNpb246ICcxLjIuMycgfSxcbiAgICAgIHsgZnFuOiAnYXdzLWNkay1saWIuQ29vbFJlc291cmNlJywgdmVyc2lvbjogJzAuMS4yJyB9LFxuICAgICAgeyBmcW46ICdhd3MtY2RrLWxpYi5PdGhlclJlc291cmNlJywgdmVyc2lvbjogJzAuMS4yJyB9LFxuICAgIF07XG5cbiAgICBleHBlY3RBbmFseXRpY3MoY29uc3RydWN0SW5mbywgJzEuMi4zIWF3cy1jZGstbGliLntDb25zdHJ1Y3QsQ2ZuUmVzb3VyY2UsU3RhY2t9LDAuMS4yIWF3cy1jZGstbGliLntDb29sUmVzb3VyY2UsT3RoZXJSZXNvdXJjZX0nKTtcbiAgfSk7XG5cbiAgdGVzdCgnZW5zdXJlIGd6aXAgaXMgZW5jb2RlZCB3aXRoIFwidW5rbm93blwiIG9wZXJhdGluZyBzeXN0ZW0gdG8gbWFpbnRhaW4gY29uc2lzdGVudCBvdXRwdXQgYWNyb3NzIHN5c3RlbXMnLCAoKSA9PiB7XG4gICAgY29uc3QgY29uc3RydWN0SW5mbyA9IFt7IGZxbjogJ2F3cy1jZGstbGliLkNvbnN0cnVjdCcsIHZlcnNpb246ICcxLjIuMycgfV07XG4gICAgY29uc3QgYW5hbHl0aWNzID0gZm9ybWF0QW5hbHl0aWNzKGNvbnN0cnVjdEluZm8pO1xuICAgIGNvbnN0IGd6aXAgPSBCdWZmZXIuZnJvbShhbmFseXRpY3Muc3BsaXQoJzonKVsyXSwgJ2Jhc2U2NCcpO1xuICAgIGV4cGVjdChnemlwWzldKS50b0JlKDI1NSk7XG4gIH0pO1xuXG4gIC8vIENvbXBhcmVzIHRoZSBvdXRwdXQgb2YgZm9ybWF0QW5hbHl0aWNzIHdpdGggYW4gZXhwZWN0ZWQgKHBsYWludGV4dCkgb3V0cHV0LlxuICAvLyBGb3IgZWFzZSBvZiB0ZXN0aW5nLCB0aGUgcGxhaW50ZXh0IHZlcnNpb25zIGFyZSBjb21wYXJlZCByYXRoZXIgdGhhbiB0aGUgZW5jb2RlZCB2ZXJzaW9ucy5cbiAgZnVuY3Rpb24gZXhwZWN0QW5hbHl0aWNzKGNvbnN0cnVjdHM6IENvbnN0cnVjdEluZm9bXSwgZXhwZWN0ZWRQbGFpbnRleHQ6IHN0cmluZykge1xuICAgIGV4cGVjdChwbGFpbnRleHRDb25zdHJ1Y3RzRnJvbUFuYWx5dGljcyhmb3JtYXRBbmFseXRpY3MoY29uc3RydWN0cykpKS50b0VxdWFsKGV4cGVjdGVkUGxhaW50ZXh0KTtcbiAgfVxuXG59KTtcblxuZnVuY3Rpb24gcGxhaW50ZXh0Q29uc3RydWN0c0Zyb21BbmFseXRpY3MoYW5hbHl0aWNzOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHpsaWIuZ3VuemlwU3luYyhCdWZmZXIuZnJvbShhbmFseXRpY3Muc3BsaXQoJzonKVsyXSwgJ2Jhc2U2NCcpKS50b1N0cmluZygndXRmLTgnKTtcbn1cblxuY29uc3QgSlNJSV9SVU5USU1FX1NZTUJPTCA9IFN5bWJvbC5mb3IoJ2pzaWkucnR0aScpO1xuXG5jbGFzcyBUZXN0Q29uc3RydWN0IGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgLy8gQHRzLWlnbm9yZVxuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBbSlNJSV9SVU5USU1FX1NZTUJPTF0gPSB7IGZxbjogJ0BhbXpuL2NvcmUuVGVzdENvbnN0cnVjdCcsIHZlcnNpb246ICdGYWtlVmVyc2lvbi4yLjMnIH1cbn1cblxuY2xhc3MgVGVzdFRoaXJkUGFydHlDb25zdHJ1Y3QgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICAvLyBAdHMtaWdub3JlXG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFtKU0lJX1JVTlRJTUVfU1lNQk9MXSA9IHsgZnFuOiAnbXljb29sdGhpbmcuVGVzdENvbnN0cnVjdCcsIHZlcnNpb246ICcxLjIuMycgfVxufVxuIl19