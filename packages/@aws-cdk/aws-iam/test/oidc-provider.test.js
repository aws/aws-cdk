"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const sinon = require("sinon");
const iam = require("../lib");
const diff_1 = require("../lib/oidc-provider/diff");
const external_1 = require("../lib/oidc-provider/external");
const handler = require("../lib/oidc-provider/index");
const arnOfProvider = 'arn:aws:iam::1234567:oidc-provider/oidc.eks.us-east-1.amazonaws.com/id/someid';
describe('OpenIdConnectProvider resource', () => {
    test('minimal configuration (no clients and no thumbprint)', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new iam.OpenIdConnectProvider(stack, 'MyProvider', {
            url: 'https://openid-endpoint',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDKOpenIdConnectProvider', {
            Url: 'https://openid-endpoint',
        });
    });
    test('"openIdConnectProviderArn" resolves to the ref', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const provider = new iam.OpenIdConnectProvider(stack, 'MyProvider', {
            url: 'https://openid-endpoint',
        });
        // THEN
        expect(stack.resolve(provider.openIdConnectProviderArn)).toStrictEqual({ Ref: 'MyProvider730BA1C8' });
    });
    test('static fromOpenIdConnectProviderArn can be used to import a provider', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const provider = iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(stack, 'MyProvider', arnOfProvider);
        // THEN
        expect(stack.resolve(provider.openIdConnectProviderArn)).toStrictEqual(arnOfProvider);
    });
    test('thumbprint list and client ids can be specified', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new iam.OpenIdConnectProvider(stack, 'MyProvider', {
            url: 'https://my-url',
            clientIds: ['client1', 'client2'],
            thumbprints: ['thumb1'],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDKOpenIdConnectProvider', {
            Url: 'https://my-url',
            ClientIDList: ['client1', 'client2'],
            ThumbprintList: ['thumb1'],
        });
    });
});
describe('custom resource provider infrastructure', () => {
    test('two resources share the same cr provider', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'stack');
        // WHEN
        new iam.OpenIdConnectProvider(stack, 'Provider1', { url: 'provider1' });
        new iam.OpenIdConnectProvider(stack, 'Provider2', { url: 'provider2' });
        // THEN
        const template = app.synth().getStackArtifact(stack.artifactId).template;
        const resourceTypes = Object.values(template.Resources).map((r) => r.Type).sort();
        expect(resourceTypes).toStrictEqual([
            // custom resource perovider resources
            'AWS::IAM::Role',
            'AWS::Lambda::Function',
            // open id connect resources
            'Custom::AWSCDKOpenIdConnectProvider',
            'Custom::AWSCDKOpenIdConnectProvider',
        ]);
    });
    test('iam policy', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new iam.OpenIdConnectProvider(stack, 'Provider1', { url: 'provider1' });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            Policies: [
                {
                    PolicyName: 'Inline',
                    PolicyDocument: {
                        Version: '2012-10-17',
                        Statement: [
                            {
                                Effect: 'Allow',
                                Resource: '*',
                                Action: [
                                    'iam:CreateOpenIDConnectProvider',
                                    'iam:DeleteOpenIDConnectProvider',
                                    'iam:UpdateOpenIDConnectProviderThumbprint',
                                    'iam:AddClientIDToOpenIDConnectProvider',
                                    'iam:RemoveClientIDFromOpenIDConnectProvider',
                                ],
                            },
                        ],
                    },
                },
            ],
        });
    });
});
describe('custom resource provider handler', () => {
    external_1.external.log = () => { return; }; // disable verbosity for tests
    const downloadThumbprint = external_1.external.downloadThumbprint = sinon.fake.returns('FAKE-THUMBPRINT');
    const createOpenIDConnectProvider = external_1.external.createOpenIDConnectProvider = sinon.fake.resolves({ OpenIDConnectProviderArn: 'FAKE-ARN' });
    const deleteOpenIDConnectProvider = external_1.external.deleteOpenIDConnectProvider = sinon.fake.resolves({});
    const updateOpenIDConnectProviderThumbprint = external_1.external.updateOpenIDConnectProviderThumbprint = sinon.fake.resolves({});
    const addClientIDToOpenIDConnectProvider = external_1.external.addClientIDToOpenIDConnectProvider = sinon.fake.resolves({});
    const removeClientIDFromOpenIDConnectProvider = external_1.external.removeClientIDFromOpenIDConnectProvider = sinon.fake.resolves({});
    beforeEach(() => sinon.reset());
    test('create with url will download thumbprint from host', async () => {
        // WHEN
        const response = await invokeHandler({
            RequestType: 'Create',
            ResourceProperties: {
                ServiceToken: 'Foo',
                Url: 'https://my-urlx',
                ThumbprintList: ['MyThumbprint'],
            },
        });
        // THEN
        sinon.assert.notCalled(downloadThumbprint);
        sinon.assert.calledWithExactly(createOpenIDConnectProvider, {
            ClientIDList: [],
            Url: 'https://my-urlx',
            ThumbprintList: ['MyThumbprint'],
        });
        expect(response).toStrictEqual({
            PhysicalResourceId: 'FAKE-ARN',
            Data: {
                Thumbprints: '["MyThumbprint"]',
            },
        });
    });
    test('create without thumbprint will download from host', async () => {
        // WHEN
        const response = await invokeHandler({
            RequestType: 'Create',
            ResourceProperties: {
                ServiceToken: 'Foo',
                Url: 'https://my-urlx',
            },
        });
        // THEN
        sinon.assert.calledWithExactly(downloadThumbprint, 'https://my-urlx');
        sinon.assert.calledWithExactly(createOpenIDConnectProvider, {
            ClientIDList: [],
            Url: 'https://my-urlx',
            ThumbprintList: ['FAKE-THUMBPRINT'],
        });
        expect(response).toStrictEqual({
            PhysicalResourceId: 'FAKE-ARN',
            Data: {
                Thumbprints: '["FAKE-THUMBPRINT"]',
            },
        });
    });
    test('delete', async () => {
        // WHEN
        await invokeHandler({
            RequestType: 'Delete',
            PhysicalResourceId: 'FAKE-ARN',
        });
        // THEN
        sinon.assert.notCalled(downloadThumbprint);
        sinon.assert.notCalled(createOpenIDConnectProvider);
        sinon.assert.calledWithExactly(deleteOpenIDConnectProvider, {
            OpenIDConnectProviderArn: 'FAKE-ARN',
        });
    });
    test('update url with explicit thumbprints (replace)', async () => {
        // WHEN
        const response = await invokeHandler({
            RequestType: 'Update',
            ResourceProperties: {
                ServiceToken: 'Foo',
                Url: 'https://new',
                ThumbprintList: ['THUMB1', 'THUMB2'],
            },
            OldResourceProperties: {
                Url: 'https://old',
            },
        });
        // THEN
        expect(response).toStrictEqual({
            PhysicalResourceId: 'FAKE-ARN',
            Data: {
                Thumbprints: '["THUMB1","THUMB2"]',
            },
        });
        sinon.assert.notCalled(downloadThumbprint);
        sinon.assert.calledWithExactly(createOpenIDConnectProvider, {
            ClientIDList: [],
            Url: 'https://new',
            ThumbprintList: ['THUMB1', 'THUMB2'],
        });
    });
    test('update url with no thumbprint (replace)', async () => {
        // WHEN
        const response = await invokeHandler({
            RequestType: 'Update',
            ResourceProperties: {
                ServiceToken: 'Foo',
                Url: 'https://new',
            },
            OldResourceProperties: {
                Url: 'https://old',
            },
        });
        // THEN
        expect(response).toStrictEqual({
            PhysicalResourceId: 'FAKE-ARN',
            Data: {
                Thumbprints: '["FAKE-THUMBPRINT"]',
            },
        });
        sinon.assert.calledOnceWithExactly(downloadThumbprint, 'https://new');
        sinon.assert.calledOnceWithExactly(createOpenIDConnectProvider, {
            ClientIDList: [],
            Url: 'https://new',
            ThumbprintList: ['FAKE-THUMBPRINT'],
        });
        sinon.assert.notCalled(deleteOpenIDConnectProvider);
    });
    test('update thumbprint list', async () => {
        // WHEN
        await invokeHandler({
            RequestType: 'Update',
            PhysicalResourceId: 'FAKE-PhysicalResourceId',
            ResourceProperties: {
                ServiceToken: 'Foo',
                Url: 'https://url',
                ThumbprintList: ['Foo', 'Bar'],
            },
            OldResourceProperties: {
                Url: 'https://url',
                ThumbprintList: ['Foo'],
            },
        });
        // THEN
        sinon.assert.notCalled(downloadThumbprint);
        sinon.assert.notCalled(createOpenIDConnectProvider);
        sinon.assert.notCalled(deleteOpenIDConnectProvider);
        sinon.assert.calledOnceWithExactly(updateOpenIDConnectProviderThumbprint, {
            OpenIDConnectProviderArn: 'FAKE-PhysicalResourceId',
            ThumbprintList: ['Bar', 'Foo'],
        });
    });
    test('add/remove client ids', async () => {
        // WHEN
        await invokeHandler({
            RequestType: 'Update',
            PhysicalResourceId: 'FAKE-PhysicalResourceId',
            ResourceProperties: {
                ServiceToken: 'Foo',
                Url: 'https://url',
                ClientIDList: ['A', 'B', 'C'],
            },
            OldResourceProperties: {
                Url: 'https://url',
                ClientIDList: ['A', 'D'],
            },
        });
        // THEN
        sinon.assert.notCalled(createOpenIDConnectProvider);
        sinon.assert.notCalled(deleteOpenIDConnectProvider);
        sinon.assert.calledTwice(addClientIDToOpenIDConnectProvider);
        sinon.assert.calledWithExactly(addClientIDToOpenIDConnectProvider, {
            OpenIDConnectProviderArn: 'FAKE-PhysicalResourceId', ClientID: 'B',
        });
        sinon.assert.calledWithExactly(addClientIDToOpenIDConnectProvider, {
            OpenIDConnectProviderArn: 'FAKE-PhysicalResourceId', ClientID: 'C',
        });
        sinon.assert.calledOnceWithExactly(removeClientIDFromOpenIDConnectProvider, {
            OpenIDConnectProviderArn: 'FAKE-PhysicalResourceId', ClientID: 'D',
        });
    });
    test('multiple in-place updates (no replace)', async () => {
        // WHEN
        await invokeHandler({
            RequestType: 'Update',
            PhysicalResourceId: 'FAKE-PhysicalResourceId',
            ResourceProperties: {
                ServiceToken: 'Foo',
                Url: 'https://url',
                ThumbprintList: ['NEW-LIST'],
                ClientIDList: ['A'],
            },
            OldResourceProperties: {
                Url: 'https://url',
                ThumbprintList: ['OLD-LIST'],
                ClientIDList: [],
            },
        });
        // THEN
        sinon.assert.notCalled(downloadThumbprint);
        sinon.assert.notCalled(createOpenIDConnectProvider);
        sinon.assert.notCalled(deleteOpenIDConnectProvider);
        sinon.assert.notCalled(removeClientIDFromOpenIDConnectProvider);
        sinon.assert.calledOnceWithExactly(updateOpenIDConnectProviderThumbprint, {
            OpenIDConnectProviderArn: 'FAKE-PhysicalResourceId',
            ThumbprintList: ['NEW-LIST'],
        });
        sinon.assert.calledOnceWithExactly(addClientIDToOpenIDConnectProvider, {
            OpenIDConnectProviderArn: 'FAKE-PhysicalResourceId',
            ClientID: 'A',
        });
    });
    test('multiple updates that include a url update, which means replacement', async () => {
        // WHEN
        await invokeHandler({
            RequestType: 'Update',
            PhysicalResourceId: 'FAKE-PhysicalResourceId',
            ResourceProperties: {
                ServiceToken: 'Foo',
                Url: 'https://new-url',
                ClientIDList: ['A'],
            },
            OldResourceProperties: {
                Url: 'https://old-url',
                ThumbprintList: ['OLD-LIST'],
                ClientIDList: [],
            },
        });
        // THEN
        sinon.assert.notCalled(deleteOpenIDConnectProvider);
        sinon.assert.notCalled(removeClientIDFromOpenIDConnectProvider);
        sinon.assert.notCalled(updateOpenIDConnectProviderThumbprint);
        sinon.assert.notCalled(addClientIDToOpenIDConnectProvider);
        sinon.assert.calledOnceWithExactly(downloadThumbprint, 'https://new-url'); // since thumbprint list is empty
        sinon.assert.calledOnceWithExactly(createOpenIDConnectProvider, {
            ClientIDList: ['A'],
            ThumbprintList: ['FAKE-THUMBPRINT'],
            Url: 'https://new-url',
        });
    });
});
describe('arrayDiff', () => {
    test('calculates the difference between two arrays', () => {
        expect((0, diff_1.arrayDiff)(['a', 'b', 'c'], ['a', 'd'])).toStrictEqual({ adds: ['d'], deletes: ['b', 'c'] });
        expect((0, diff_1.arrayDiff)(['a', 'b', 'c'], [])).toStrictEqual({ adds: [], deletes: ['a', 'b', 'c'] });
        expect((0, diff_1.arrayDiff)(['a', 'b', 'c'], ['a', 'c', 'b'])).toStrictEqual({ adds: [], deletes: [] });
        expect((0, diff_1.arrayDiff)([], ['a', 'c', 'b'])).toStrictEqual({ adds: ['a', 'c', 'b'], deletes: [] });
        expect((0, diff_1.arrayDiff)(['x', 'y'], ['a', 'c', 'b'])).toStrictEqual({ adds: ['a', 'c', 'b'], deletes: ['x', 'y'] });
        expect((0, diff_1.arrayDiff)([], [])).toStrictEqual({ adds: [], deletes: [] });
        expect((0, diff_1.arrayDiff)(['a', 'a'], ['a', 'b', 'a', 'b', 'b'])).toStrictEqual({ adds: ['b'], deletes: [] });
    });
});
describe('OIDC issuer', () => {
    test('extract issuer properly in the new provider', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const provider = new iam.OpenIdConnectProvider(stack, 'MyProvider', {
            url: 'https://my-issuer',
        });
        // THEN
        expect(stack.resolve(provider.openIdConnectProviderIssuer)).toStrictEqual({ 'Fn::Select': [1, { 'Fn::Split': [':oidc-provider/', { Ref: 'MyProvider730BA1C8' }] }] });
    });
    test('extract issuer properly in a literal imported provider', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const provider = iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(stack, 'MyProvider', arnOfProvider);
        // THEN
        expect(stack.resolve(provider.openIdConnectProviderIssuer)).toStrictEqual('oidc.eks.us-east-1.amazonaws.com/id/someid');
    });
    test('extract issuer properly in a Token imported provider', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const provider = iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(stack, 'MyProvider', core_1.Token.asString({ Ref: 'ARN' }));
        // THEN
        expect(stack.resolve(provider.openIdConnectProviderIssuer)).toStrictEqual({
            'Fn::Select': [1, { 'Fn::Split': [':oidc-provider/', { Ref: 'ARN' }] }],
        });
    });
});
async function invokeHandler(event) {
    return handler.handler(event);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy1wcm92aWRlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsib2lkYy1wcm92aWRlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUFrRDtBQUNsRCwrQkFBK0I7QUFDL0IsOEJBQThCO0FBQzlCLG9EQUFzRDtBQUN0RCw0REFBeUQ7QUFDekQsc0RBQXNEO0FBRXRELE1BQU0sYUFBYSxHQUFHLCtFQUErRSxDQUFDO0FBRXRHLFFBQVEsQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7SUFFOUMsSUFBSSxDQUFDLHNEQUFzRCxFQUFFLEdBQUcsRUFBRTtRQUNoRSxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBQ1AsSUFBSSxHQUFHLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUNqRCxHQUFHLEVBQUUseUJBQXlCO1NBQy9CLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxxQ0FBcUMsRUFBRTtZQUNyRixHQUFHLEVBQUUseUJBQXlCO1NBQy9CLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGdEQUFnRCxFQUFFLEdBQUcsRUFBRTtRQUMxRCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBQ1AsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUNsRSxHQUFHLEVBQUUseUJBQXlCO1NBQy9CLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxF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ImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBUb2tlbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgc2lub24gZnJvbSAnc2lub24nO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBhcnJheURpZmYgfSBmcm9tICcuLi9saWIvb2lkYy1wcm92aWRlci9kaWZmJztcbmltcG9ydCB7IGV4dGVybmFsIH0gZnJvbSAnLi4vbGliL29pZGMtcHJvdmlkZXIvZXh0ZXJuYWwnO1xuaW1wb3J0ICogYXMgaGFuZGxlciBmcm9tICcuLi9saWIvb2lkYy1wcm92aWRlci9pbmRleCc7XG5cbmNvbnN0IGFybk9mUHJvdmlkZXIgPSAnYXJuOmF3czppYW06OjEyMzQ1Njc6b2lkYy1wcm92aWRlci9vaWRjLmVrcy51cy1lYXN0LTEuYW1hem9uYXdzLmNvbS9pZC9zb21laWQnO1xuXG5kZXNjcmliZSgnT3BlbklkQ29ubmVjdFByb3ZpZGVyIHJlc291cmNlJywgKCkgPT4ge1xuXG4gIHRlc3QoJ21pbmltYWwgY29uZmlndXJhdGlvbiAobm8gY2xpZW50cyBhbmQgbm8gdGh1bWJwcmludCknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBpYW0uT3BlbklkQ29ubmVjdFByb3ZpZGVyKHN0YWNrLCAnTXlQcm92aWRlcicsIHtcbiAgICAgIHVybDogJ2h0dHBzOi8vb3BlbmlkLWVuZHBvaW50JyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpBV1NDREtPcGVuSWRDb25uZWN0UHJvdmlkZXInLCB7XG4gICAgICBVcmw6ICdodHRwczovL29wZW5pZC1lbmRwb2ludCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ1wib3BlbklkQ29ubmVjdFByb3ZpZGVyQXJuXCIgcmVzb2x2ZXMgdG8gdGhlIHJlZicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcHJvdmlkZXIgPSBuZXcgaWFtLk9wZW5JZENvbm5lY3RQcm92aWRlcihzdGFjaywgJ015UHJvdmlkZXInLCB7XG4gICAgICB1cmw6ICdodHRwczovL29wZW5pZC1lbmRwb2ludCcsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocHJvdmlkZXIub3BlbklkQ29ubmVjdFByb3ZpZGVyQXJuKSkudG9TdHJpY3RFcXVhbCh7IFJlZjogJ015UHJvdmlkZXI3MzBCQTFDOCcgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N0YXRpYyBmcm9tT3BlbklkQ29ubmVjdFByb3ZpZGVyQXJuIGNhbiBiZSB1c2VkIHRvIGltcG9ydCBhIHByb3ZpZGVyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBwcm92aWRlciA9IGlhbS5PcGVuSWRDb25uZWN0UHJvdmlkZXIuZnJvbU9wZW5JZENvbm5lY3RQcm92aWRlckFybihzdGFjaywgJ015UHJvdmlkZXInLCBhcm5PZlByb3ZpZGVyKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwcm92aWRlci5vcGVuSWRDb25uZWN0UHJvdmlkZXJBcm4pKS50b1N0cmljdEVxdWFsKGFybk9mUHJvdmlkZXIpO1xuICB9KTtcblxuICB0ZXN0KCd0aHVtYnByaW50IGxpc3QgYW5kIGNsaWVudCBpZHMgY2FuIGJlIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGlhbS5PcGVuSWRDb25uZWN0UHJvdmlkZXIoc3RhY2ssICdNeVByb3ZpZGVyJywge1xuICAgICAgdXJsOiAnaHR0cHM6Ly9teS11cmwnLFxuICAgICAgY2xpZW50SWRzOiBbJ2NsaWVudDEnLCAnY2xpZW50MiddLFxuICAgICAgdGh1bWJwcmludHM6IFsndGh1bWIxJ10sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6QVdTQ0RLT3BlbklkQ29ubmVjdFByb3ZpZGVyJywge1xuICAgICAgVXJsOiAnaHR0cHM6Ly9teS11cmwnLFxuICAgICAgQ2xpZW50SURMaXN0OiBbJ2NsaWVudDEnLCAnY2xpZW50MiddLFxuICAgICAgVGh1bWJwcmludExpc3Q6IFsndGh1bWIxJ10sXG4gICAgfSk7XG4gIH0pO1xuXG59KTtcblxuZGVzY3JpYmUoJ2N1c3RvbSByZXNvdXJjZSBwcm92aWRlciBpbmZyYXN0cnVjdHVyZScsICgpID0+IHtcblxuICB0ZXN0KCd0d28gcmVzb3VyY2VzIHNoYXJlIHRoZSBzYW1lIGNyIHByb3ZpZGVyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3N0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGlhbS5PcGVuSWRDb25uZWN0UHJvdmlkZXIoc3RhY2ssICdQcm92aWRlcjEnLCB7IHVybDogJ3Byb3ZpZGVyMScgfSk7XG4gICAgbmV3IGlhbS5PcGVuSWRDb25uZWN0UHJvdmlkZXIoc3RhY2ssICdQcm92aWRlcjInLCB7IHVybDogJ3Byb3ZpZGVyMicgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgdGVtcGxhdGUgPSBhcHAuc3ludGgoKS5nZXRTdGFja0FydGlmYWN0KHN0YWNrLmFydGlmYWN0SWQpLnRlbXBsYXRlO1xuICAgIGNvbnN0IHJlc291cmNlVHlwZXMgPSBPYmplY3QudmFsdWVzKHRlbXBsYXRlLlJlc291cmNlcykubWFwKChyOiBhbnkpID0+IHIuVHlwZSkuc29ydCgpO1xuICAgIGV4cGVjdChyZXNvdXJjZVR5cGVzKS50b1N0cmljdEVxdWFsKFtcbiAgICAgIC8vIGN1c3RvbSByZXNvdXJjZSBwZXJvdmlkZXIgcmVzb3VyY2VzXG4gICAgICAnQVdTOjpJQU06OlJvbGUnLFxuICAgICAgJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsXG5cbiAgICAgIC8vIG9wZW4gaWQgY29ubmVjdCByZXNvdXJjZXNcbiAgICAgICdDdXN0b206OkFXU0NES09wZW5JZENvbm5lY3RQcm92aWRlcicsXG4gICAgICAnQ3VzdG9tOjpBV1NDREtPcGVuSWRDb25uZWN0UHJvdmlkZXInLFxuICAgIF0pO1xuICB9KTtcblxuICB0ZXN0KCdpYW0gcG9saWN5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgaWFtLk9wZW5JZENvbm5lY3RQcm92aWRlcihzdGFjaywgJ1Byb3ZpZGVyMScsIHsgdXJsOiAncHJvdmlkZXIxJyB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBQb2xpY2llczogW1xuICAgICAgICB7XG4gICAgICAgICAgUG9saWN5TmFtZTogJ0lubGluZScsXG4gICAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgICAnaWFtOkNyZWF0ZU9wZW5JRENvbm5lY3RQcm92aWRlcicsXG4gICAgICAgICAgICAgICAgICAnaWFtOkRlbGV0ZU9wZW5JRENvbm5lY3RQcm92aWRlcicsXG4gICAgICAgICAgICAgICAgICAnaWFtOlVwZGF0ZU9wZW5JRENvbm5lY3RQcm92aWRlclRodW1icHJpbnQnLFxuICAgICAgICAgICAgICAgICAgJ2lhbTpBZGRDbGllbnRJRFRvT3BlbklEQ29ubmVjdFByb3ZpZGVyJyxcbiAgICAgICAgICAgICAgICAgICdpYW06UmVtb3ZlQ2xpZW50SURGcm9tT3BlbklEQ29ubmVjdFByb3ZpZGVyJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2N1c3RvbSByZXNvdXJjZSBwcm92aWRlciBoYW5kbGVyJywgKCkgPT4ge1xuICBleHRlcm5hbC5sb2cgPSAoKSA9PiB7IHJldHVybjsgfTsgLy8gZGlzYWJsZSB2ZXJib3NpdHkgZm9yIHRlc3RzXG4gIGNvbnN0IGRvd25sb2FkVGh1bWJwcmludCA9IGV4dGVybmFsLmRvd25sb2FkVGh1bWJwcmludCA9IHNpbm9uLmZha2UucmV0dXJucygnRkFLRS1USFVNQlBSSU5UJyk7XG4gIGNvbnN0IGNyZWF0ZU9wZW5JRENvbm5lY3RQcm92aWRlciA9IGV4dGVybmFsLmNyZWF0ZU9wZW5JRENvbm5lY3RQcm92aWRlciA9IHNpbm9uLmZha2UucmVzb2x2ZXMoeyBPcGVuSURDb25uZWN0UHJvdmlkZXJBcm46ICdGQUtFLUFSTicgfSk7XG4gIGNvbnN0IGRlbGV0ZU9wZW5JRENvbm5lY3RQcm92aWRlciA9IGV4dGVybmFsLmRlbGV0ZU9wZW5JRENvbm5lY3RQcm92aWRlciA9IHNpbm9uLmZha2UucmVzb2x2ZXMoeyB9KTtcbiAgY29uc3QgdXBkYXRlT3BlbklEQ29ubmVjdFByb3ZpZGVyVGh1bWJwcmludCA9IGV4dGVybmFsLnVwZGF0ZU9wZW5JRENvbm5lY3RQcm92aWRlclRodW1icHJpbnQgPSBzaW5vbi5mYWtlLnJlc29sdmVzKHsgfSk7XG4gIGNvbnN0IGFkZENsaWVudElEVG9PcGVuSURDb25uZWN0UHJvdmlkZXIgPSBleHRlcm5hbC5hZGRDbGllbnRJRFRvT3BlbklEQ29ubmVjdFByb3ZpZGVyID0gc2lub24uZmFrZS5yZXNvbHZlcyh7IH0pO1xuICBjb25zdCByZW1vdmVDbGllbnRJREZyb21PcGVuSURDb25uZWN0UHJvdmlkZXIgPSBleHRlcm5hbC5yZW1vdmVDbGllbnRJREZyb21PcGVuSURDb25uZWN0UHJvdmlkZXIgPSBzaW5vbi5mYWtlLnJlc29sdmVzKHsgfSk7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiBzaW5vbi5yZXNldCgpKTtcblxuICB0ZXN0KCdjcmVhdGUgd2l0aCB1cmwgd2lsbCBkb3dubG9hZCB0aHVtYnByaW50IGZyb20gaG9zdCcsIGFzeW5jICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBpbnZva2VIYW5kbGVyKHtcbiAgICAgIFJlcXVlc3RUeXBlOiAnQ3JlYXRlJyxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBTZXJ2aWNlVG9rZW46ICdGb28nLFxuICAgICAgICBVcmw6ICdodHRwczovL215LXVybHgnLFxuICAgICAgICBUaHVtYnByaW50TGlzdDogWydNeVRodW1icHJpbnQnXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgc2lub24uYXNzZXJ0Lm5vdENhbGxlZChkb3dubG9hZFRodW1icHJpbnQpO1xuICAgIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoRXhhY3RseShjcmVhdGVPcGVuSURDb25uZWN0UHJvdmlkZXIsIHtcbiAgICAgIENsaWVudElETGlzdDogW10sXG4gICAgICBVcmw6ICdodHRwczovL215LXVybHgnLFxuICAgICAgVGh1bWJwcmludExpc3Q6IFsnTXlUaHVtYnByaW50J10sXG4gICAgfSk7XG5cbiAgICBleHBlY3QocmVzcG9uc2UpLnRvU3RyaWN0RXF1YWwoe1xuICAgICAgUGh5c2ljYWxSZXNvdXJjZUlkOiAnRkFLRS1BUk4nLFxuICAgICAgRGF0YToge1xuICAgICAgICBUaHVtYnByaW50czogJ1tcIk15VGh1bWJwcmludFwiXScsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGUgd2l0aG91dCB0aHVtYnByaW50IHdpbGwgZG93bmxvYWQgZnJvbSBob3N0JywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGludm9rZUhhbmRsZXIoe1xuICAgICAgUmVxdWVzdFR5cGU6ICdDcmVhdGUnLFxuICAgICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFNlcnZpY2VUb2tlbjogJ0ZvbycsXG4gICAgICAgIFVybDogJ2h0dHBzOi8vbXktdXJseCcsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoRXhhY3RseShkb3dubG9hZFRodW1icHJpbnQsICdodHRwczovL215LXVybHgnKTtcbiAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aEV4YWN0bHkoY3JlYXRlT3BlbklEQ29ubmVjdFByb3ZpZGVyLCB7XG4gICAgICBDbGllbnRJRExpc3Q6IFtdLFxuICAgICAgVXJsOiAnaHR0cHM6Ly9teS11cmx4JyxcbiAgICAgIFRodW1icHJpbnRMaXN0OiBbJ0ZBS0UtVEhVTUJQUklOVCddLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b1N0cmljdEVxdWFsKHtcbiAgICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogJ0ZBS0UtQVJOJyxcbiAgICAgIERhdGE6IHtcbiAgICAgICAgVGh1bWJwcmludHM6ICdbXCJGQUtFLVRIVU1CUFJJTlRcIl0nLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZGVsZXRlJywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBhd2FpdCBpbnZva2VIYW5kbGVyKHtcbiAgICAgIFJlcXVlc3RUeXBlOiAnRGVsZXRlJyxcbiAgICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogJ0ZBS0UtQVJOJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBzaW5vbi5hc3NlcnQubm90Q2FsbGVkKGRvd25sb2FkVGh1bWJwcmludCk7XG4gICAgc2lub24uYXNzZXJ0Lm5vdENhbGxlZChjcmVhdGVPcGVuSURDb25uZWN0UHJvdmlkZXIpO1xuICAgIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoRXhhY3RseShkZWxldGVPcGVuSURDb25uZWN0UHJvdmlkZXIsIHtcbiAgICAgIE9wZW5JRENvbm5lY3RQcm92aWRlckFybjogJ0ZBS0UtQVJOJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndXBkYXRlIHVybCB3aXRoIGV4cGxpY2l0IHRodW1icHJpbnRzIChyZXBsYWNlKScsIGFzeW5jICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBpbnZva2VIYW5kbGVyKHtcbiAgICAgIFJlcXVlc3RUeXBlOiAnVXBkYXRlJyxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBTZXJ2aWNlVG9rZW46ICdGb28nLFxuICAgICAgICBVcmw6ICdodHRwczovL25ldycsXG4gICAgICAgIFRodW1icHJpbnRMaXN0OiBbJ1RIVU1CMScsICdUSFVNQjInXSxcbiAgICAgIH0sXG4gICAgICBPbGRSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgVXJsOiAnaHR0cHM6Ly9vbGQnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QocmVzcG9uc2UpLnRvU3RyaWN0RXF1YWwoe1xuICAgICAgUGh5c2ljYWxSZXNvdXJjZUlkOiAnRkFLRS1BUk4nLFxuICAgICAgRGF0YToge1xuICAgICAgICBUaHVtYnByaW50czogJ1tcIlRIVU1CMVwiLFwiVEhVTUIyXCJdJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgc2lub24uYXNzZXJ0Lm5vdENhbGxlZChkb3dubG9hZFRodW1icHJpbnQpO1xuICAgIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoRXhhY3RseShjcmVhdGVPcGVuSURDb25uZWN0UHJvdmlkZXIsIHtcbiAgICAgIENsaWVudElETGlzdDogW10sXG4gICAgICBVcmw6ICdodHRwczovL25ldycsXG4gICAgICBUaHVtYnByaW50TGlzdDogWydUSFVNQjEnLCAnVEhVTUIyJ10sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3VwZGF0ZSB1cmwgd2l0aCBubyB0aHVtYnByaW50IChyZXBsYWNlKScsIGFzeW5jICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBpbnZva2VIYW5kbGVyKHtcbiAgICAgIFJlcXVlc3RUeXBlOiAnVXBkYXRlJyxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBTZXJ2aWNlVG9rZW46ICdGb28nLFxuICAgICAgICBVcmw6ICdodHRwczovL25ldycsXG4gICAgICB9LFxuICAgICAgT2xkUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFVybDogJ2h0dHBzOi8vb2xkJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b1N0cmljdEVxdWFsKHtcbiAgICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogJ0ZBS0UtQVJOJyxcbiAgICAgIERhdGE6IHtcbiAgICAgICAgVGh1bWJwcmludHM6ICdbXCJGQUtFLVRIVU1CUFJJTlRcIl0nLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBzaW5vbi5hc3NlcnQuY2FsbGVkT25jZVdpdGhFeGFjdGx5KGRvd25sb2FkVGh1bWJwcmludCwgJ2h0dHBzOi8vbmV3Jyk7XG4gICAgc2lub24uYXNzZXJ0LmNhbGxlZE9uY2VXaXRoRXhhY3RseShjcmVhdGVPcGVuSURDb25uZWN0UHJvdmlkZXIsIHtcbiAgICAgIENsaWVudElETGlzdDogW10sXG4gICAgICBVcmw6ICdodHRwczovL25ldycsXG4gICAgICBUaHVtYnByaW50TGlzdDogWydGQUtFLVRIVU1CUFJJTlQnXSxcbiAgICB9KTtcbiAgICBzaW5vbi5hc3NlcnQubm90Q2FsbGVkKGRlbGV0ZU9wZW5JRENvbm5lY3RQcm92aWRlcik7XG4gIH0pO1xuXG4gIHRlc3QoJ3VwZGF0ZSB0aHVtYnByaW50IGxpc3QnLCBhc3luYyAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGF3YWl0IGludm9rZUhhbmRsZXIoe1xuICAgICAgUmVxdWVzdFR5cGU6ICdVcGRhdGUnLFxuICAgICAgUGh5c2ljYWxSZXNvdXJjZUlkOiAnRkFLRS1QaHlzaWNhbFJlc291cmNlSWQnLFxuICAgICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFNlcnZpY2VUb2tlbjogJ0ZvbycsXG4gICAgICAgIFVybDogJ2h0dHBzOi8vdXJsJyxcbiAgICAgICAgVGh1bWJwcmludExpc3Q6IFsnRm9vJywgJ0JhciddLFxuICAgICAgfSxcbiAgICAgIE9sZFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBVcmw6ICdodHRwczovL3VybCcsXG4gICAgICAgIFRodW1icHJpbnRMaXN0OiBbJ0ZvbyddLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBzaW5vbi5hc3NlcnQubm90Q2FsbGVkKGRvd25sb2FkVGh1bWJwcmludCk7XG4gICAgc2lub24uYXNzZXJ0Lm5vdENhbGxlZChjcmVhdGVPcGVuSURDb25uZWN0UHJvdmlkZXIpO1xuICAgIHNpbm9uLmFzc2VydC5ub3RDYWxsZWQoZGVsZXRlT3BlbklEQ29ubmVjdFByb3ZpZGVyKTtcbiAgICBzaW5vbi5hc3NlcnQuY2FsbGVkT25jZVdpdGhFeGFjdGx5KHVwZGF0ZU9wZW5JRENvbm5lY3RQcm92aWRlclRodW1icHJpbnQsIHtcbiAgICAgIE9wZW5JRENvbm5lY3RQcm92aWRlckFybjogJ0ZBS0UtUGh5c2ljYWxSZXNvdXJjZUlkJyxcbiAgICAgIFRodW1icHJpbnRMaXN0OiBbJ0JhcicsICdGb28nXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkL3JlbW92ZSBjbGllbnQgaWRzJywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBhd2FpdCBpbnZva2VIYW5kbGVyKHtcbiAgICAgIFJlcXVlc3RUeXBlOiAnVXBkYXRlJyxcbiAgICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogJ0ZBS0UtUGh5c2ljYWxSZXNvdXJjZUlkJyxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBTZXJ2aWNlVG9rZW46ICdGb28nLFxuICAgICAgICBVcmw6ICdodHRwczovL3VybCcsXG4gICAgICAgIENsaWVudElETGlzdDogWydBJywgJ0InLCAnQyddLFxuICAgICAgfSxcbiAgICAgIE9sZFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBVcmw6ICdodHRwczovL3VybCcsXG4gICAgICAgIENsaWVudElETGlzdDogWydBJywgJ0QnXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgc2lub24uYXNzZXJ0Lm5vdENhbGxlZChjcmVhdGVPcGVuSURDb25uZWN0UHJvdmlkZXIpO1xuICAgIHNpbm9uLmFzc2VydC5ub3RDYWxsZWQoZGVsZXRlT3BlbklEQ29ubmVjdFByb3ZpZGVyKTtcbiAgICBzaW5vbi5hc3NlcnQuY2FsbGVkVHdpY2UoYWRkQ2xpZW50SURUb09wZW5JRENvbm5lY3RQcm92aWRlcik7XG4gICAgc2lub24uYXNzZXJ0LmNhbGxlZFdpdGhFeGFjdGx5KGFkZENsaWVudElEVG9PcGVuSURDb25uZWN0UHJvdmlkZXIsIHtcbiAgICAgIE9wZW5JRENvbm5lY3RQcm92aWRlckFybjogJ0ZBS0UtUGh5c2ljYWxSZXNvdXJjZUlkJywgQ2xpZW50SUQ6ICdCJyxcbiAgICB9KTtcbiAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aEV4YWN0bHkoYWRkQ2xpZW50SURUb09wZW5JRENvbm5lY3RQcm92aWRlciwge1xuICAgICAgT3BlbklEQ29ubmVjdFByb3ZpZGVyQXJuOiAnRkFLRS1QaHlzaWNhbFJlc291cmNlSWQnLCBDbGllbnRJRDogJ0MnLFxuICAgIH0pO1xuICAgIHNpbm9uLmFzc2VydC5jYWxsZWRPbmNlV2l0aEV4YWN0bHkocmVtb3ZlQ2xpZW50SURGcm9tT3BlbklEQ29ubmVjdFByb3ZpZGVyLCB7XG4gICAgICBPcGVuSURDb25uZWN0UHJvdmlkZXJBcm46ICdGQUtFLVBoeXNpY2FsUmVzb3VyY2VJZCcsIENsaWVudElEOiAnRCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ211bHRpcGxlIGluLXBsYWNlIHVwZGF0ZXMgKG5vIHJlcGxhY2UpJywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBhd2FpdCBpbnZva2VIYW5kbGVyKHtcbiAgICAgIFJlcXVlc3RUeXBlOiAnVXBkYXRlJyxcbiAgICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogJ0ZBS0UtUGh5c2ljYWxSZXNvdXJjZUlkJyxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBTZXJ2aWNlVG9rZW46ICdGb28nLFxuICAgICAgICBVcmw6ICdodHRwczovL3VybCcsXG4gICAgICAgIFRodW1icHJpbnRMaXN0OiBbJ05FVy1MSVNUJ10sXG4gICAgICAgIENsaWVudElETGlzdDogWydBJ10sXG4gICAgICB9LFxuICAgICAgT2xkUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFVybDogJ2h0dHBzOi8vdXJsJyxcbiAgICAgICAgVGh1bWJwcmludExpc3Q6IFsnT0xELUxJU1QnXSxcbiAgICAgICAgQ2xpZW50SURMaXN0OiBbXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgc2lub24uYXNzZXJ0Lm5vdENhbGxlZChkb3dubG9hZFRodW1icHJpbnQpO1xuICAgIHNpbm9uLmFzc2VydC5ub3RDYWxsZWQoY3JlYXRlT3BlbklEQ29ubmVjdFByb3ZpZGVyKTtcbiAgICBzaW5vbi5hc3NlcnQubm90Q2FsbGVkKGRlbGV0ZU9wZW5JRENvbm5lY3RQcm92aWRlcik7XG4gICAgc2lub24uYXNzZXJ0Lm5vdENhbGxlZChyZW1vdmVDbGllbnRJREZyb21PcGVuSURDb25uZWN0UHJvdmlkZXIpO1xuICAgIHNpbm9uLmFzc2VydC5jYWxsZWRPbmNlV2l0aEV4YWN0bHkodXBkYXRlT3BlbklEQ29ubmVjdFByb3ZpZGVyVGh1bWJwcmludCwge1xuICAgICAgT3BlbklEQ29ubmVjdFByb3ZpZGVyQXJuOiAnRkFLRS1QaHlzaWNhbFJlc291cmNlSWQnLFxuICAgICAgVGh1bWJwcmludExpc3Q6IFsnTkVXLUxJU1QnXSxcbiAgICB9KTtcbiAgICBzaW5vbi5hc3NlcnQuY2FsbGVkT25jZVdpdGhFeGFjdGx5KGFkZENsaWVudElEVG9PcGVuSURDb25uZWN0UHJvdmlkZXIsIHtcbiAgICAgIE9wZW5JRENvbm5lY3RQcm92aWRlckFybjogJ0ZBS0UtUGh5c2ljYWxSZXNvdXJjZUlkJyxcbiAgICAgIENsaWVudElEOiAnQScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ211bHRpcGxlIHVwZGF0ZXMgdGhhdCBpbmNsdWRlIGEgdXJsIHVwZGF0ZSwgd2hpY2ggbWVhbnMgcmVwbGFjZW1lbnQnLCBhc3luYyAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGF3YWl0IGludm9rZUhhbmRsZXIoe1xuICAgICAgUmVxdWVzdFR5cGU6ICdVcGRhdGUnLFxuICAgICAgUGh5c2ljYWxSZXNvdXJjZUlkOiAnRkFLRS1QaHlzaWNhbFJlc291cmNlSWQnLFxuICAgICAgUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFNlcnZpY2VUb2tlbjogJ0ZvbycsXG4gICAgICAgIFVybDogJ2h0dHBzOi8vbmV3LXVybCcsXG4gICAgICAgIENsaWVudElETGlzdDogWydBJ10sXG4gICAgICB9LFxuICAgICAgT2xkUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFVybDogJ2h0dHBzOi8vb2xkLXVybCcsXG4gICAgICAgIFRodW1icHJpbnRMaXN0OiBbJ09MRC1MSVNUJ10sXG4gICAgICAgIENsaWVudElETGlzdDogW10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIHNpbm9uLmFzc2VydC5ub3RDYWxsZWQoZGVsZXRlT3BlbklEQ29ubmVjdFByb3ZpZGVyKTtcbiAgICBzaW5vbi5hc3NlcnQubm90Q2FsbGVkKHJlbW92ZUNsaWVudElERnJvbU9wZW5JRENvbm5lY3RQcm92aWRlcik7XG4gICAgc2lub24uYXNzZXJ0Lm5vdENhbGxlZCh1cGRhdGVPcGVuSURDb25uZWN0UHJvdmlkZXJUaHVtYnByaW50KTtcbiAgICBzaW5vbi5hc3NlcnQubm90Q2FsbGVkKGFkZENsaWVudElEVG9PcGVuSURDb25uZWN0UHJvdmlkZXIpO1xuICAgIHNpbm9uLmFzc2VydC5jYWxsZWRPbmNlV2l0aEV4YWN0bHkoZG93bmxvYWRUaHVtYnByaW50LCAnaHR0cHM6Ly9uZXctdXJsJyk7IC8vIHNpbmNlIHRodW1icHJpbnQgbGlzdCBpcyBlbXB0eVxuICAgIHNpbm9uLmFzc2VydC5jYWxsZWRPbmNlV2l0aEV4YWN0bHkoY3JlYXRlT3BlbklEQ29ubmVjdFByb3ZpZGVyLCB7XG4gICAgICBDbGllbnRJRExpc3Q6IFsnQSddLFxuICAgICAgVGh1bWJwcmludExpc3Q6IFsnRkFLRS1USFVNQlBSSU5UJ10sXG4gICAgICBVcmw6ICdodHRwczovL25ldy11cmwnLFxuICAgIH0pO1xuICB9KTtcblxufSk7XG5cbmRlc2NyaWJlKCdhcnJheURpZmYnLCAoKSA9PiB7XG4gIHRlc3QoJ2NhbGN1bGF0ZXMgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB0d28gYXJyYXlzJywgKCkgPT4ge1xuICAgIGV4cGVjdChhcnJheURpZmYoWydhJywgJ2InLCAnYyddLCBbJ2EnLCAnZCddKSkudG9TdHJpY3RFcXVhbCh7IGFkZHM6IFsnZCddLCBkZWxldGVzOiBbJ2InLCAnYyddIH0pO1xuICAgIGV4cGVjdChhcnJheURpZmYoWydhJywgJ2InLCAnYyddLCBbXSkpLnRvU3RyaWN0RXF1YWwoeyBhZGRzOiBbXSwgZGVsZXRlczogWydhJywgJ2InLCAnYyddIH0pO1xuICAgIGV4cGVjdChhcnJheURpZmYoWydhJywgJ2InLCAnYyddLCBbJ2EnLCAnYycsICdiJ10pKS50b1N0cmljdEVxdWFsKHsgYWRkczogW10sIGRlbGV0ZXM6IFtdIH0pO1xuICAgIGV4cGVjdChhcnJheURpZmYoW10sIFsnYScsICdjJywgJ2InXSkpLnRvU3RyaWN0RXF1YWwoeyBhZGRzOiBbJ2EnLCAnYycsICdiJ10sIGRlbGV0ZXM6IFtdIH0pO1xuICAgIGV4cGVjdChhcnJheURpZmYoWyd4JywgJ3knXSwgWydhJywgJ2MnLCAnYiddKSkudG9TdHJpY3RFcXVhbCh7IGFkZHM6IFsnYScsICdjJywgJ2InXSwgZGVsZXRlczogWyd4JywgJ3knXSB9KTtcbiAgICBleHBlY3QoYXJyYXlEaWZmKFtdLCBbXSkpLnRvU3RyaWN0RXF1YWwoeyBhZGRzOiBbXSwgZGVsZXRlczogW10gfSk7XG4gICAgZXhwZWN0KGFycmF5RGlmZihbJ2EnLCAnYSddLCBbJ2EnLCAnYicsICdhJywgJ2InLCAnYiddKSkudG9TdHJpY3RFcXVhbCh7IGFkZHM6IFsnYiddLCBkZWxldGVzOiBbXSB9KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ09JREMgaXNzdWVyJywgKCkgPT4ge1xuICB0ZXN0KCdleHRyYWN0IGlzc3VlciBwcm9wZXJseSBpbiB0aGUgbmV3IHByb3ZpZGVyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBwcm92aWRlciA9IG5ldyBpYW0uT3BlbklkQ29ubmVjdFByb3ZpZGVyKHN0YWNrLCAnTXlQcm92aWRlcicsIHtcbiAgICAgIHVybDogJ2h0dHBzOi8vbXktaXNzdWVyJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwcm92aWRlci5vcGVuSWRDb25uZWN0UHJvdmlkZXJJc3N1ZXIpKS50b1N0cmljdEVxdWFsKFxuICAgICAgeyAnRm46OlNlbGVjdCc6IFsxLCB7ICdGbjo6U3BsaXQnOiBbJzpvaWRjLXByb3ZpZGVyLycsIHsgUmVmOiAnTXlQcm92aWRlcjczMEJBMUM4JyB9XSB9XSB9LFxuICAgICk7XG4gIH0pO1xuXG4gIHRlc3QoJ2V4dHJhY3QgaXNzdWVyIHByb3Blcmx5IGluIGEgbGl0ZXJhbCBpbXBvcnRlZCBwcm92aWRlcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcHJvdmlkZXIgPSBpYW0uT3BlbklkQ29ubmVjdFByb3ZpZGVyLmZyb21PcGVuSWRDb25uZWN0UHJvdmlkZXJBcm4oc3RhY2ssICdNeVByb3ZpZGVyJywgYXJuT2ZQcm92aWRlcik7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocHJvdmlkZXIub3BlbklkQ29ubmVjdFByb3ZpZGVySXNzdWVyKSkudG9TdHJpY3RFcXVhbCgnb2lkYy5la3MudXMtZWFzdC0xLmFtYXpvbmF3cy5jb20vaWQvc29tZWlkJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2V4dHJhY3QgaXNzdWVyIHByb3Blcmx5IGluIGEgVG9rZW4gaW1wb3J0ZWQgcHJvdmlkZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHByb3ZpZGVyID0gaWFtLk9wZW5JZENvbm5lY3RQcm92aWRlci5mcm9tT3BlbklkQ29ubmVjdFByb3ZpZGVyQXJuKHN0YWNrLCAnTXlQcm92aWRlcicsIFRva2VuLmFzU3RyaW5nKHsgUmVmOiAnQVJOJyB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocHJvdmlkZXIub3BlbklkQ29ubmVjdFByb3ZpZGVySXNzdWVyKSkudG9TdHJpY3RFcXVhbCh7XG4gICAgICAnRm46OlNlbGVjdCc6IFsxLCB7ICdGbjo6U3BsaXQnOiBbJzpvaWRjLXByb3ZpZGVyLycsIHsgUmVmOiAnQVJOJyB9XSB9XSxcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuYXN5bmMgZnVuY3Rpb24gaW52b2tlSGFuZGxlcihldmVudDogUGFydGlhbDxBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50Pikge1xuICByZXR1cm4gaGFuZGxlci5oYW5kbGVyKGV2ZW50IGFzIGFueSk7XG59XG4iXX0=