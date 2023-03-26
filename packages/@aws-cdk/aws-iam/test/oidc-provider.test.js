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
        expect(diff_1.arrayDiff(['a', 'b', 'c'], ['a', 'd'])).toStrictEqual({ adds: ['d'], deletes: ['b', 'c'] });
        expect(diff_1.arrayDiff(['a', 'b', 'c'], [])).toStrictEqual({ adds: [], deletes: ['a', 'b', 'c'] });
        expect(diff_1.arrayDiff(['a', 'b', 'c'], ['a', 'c', 'b'])).toStrictEqual({ adds: [], deletes: [] });
        expect(diff_1.arrayDiff([], ['a', 'c', 'b'])).toStrictEqual({ adds: ['a', 'c', 'b'], deletes: [] });
        expect(diff_1.arrayDiff(['x', 'y'], ['a', 'c', 'b'])).toStrictEqual({ adds: ['a', 'c', 'b'], deletes: ['x', 'y'] });
        expect(diff_1.arrayDiff([], [])).toStrictEqual({ adds: [], deletes: [] });
        expect(diff_1.arrayDiff(['a', 'a'], ['a', 'b', 'a', 'b', 'b'])).toStrictEqual({ adds: ['b'], deletes: [] });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2lkYy1wcm92aWRlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsib2lkYy1wcm92aWRlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUFrRDtBQUNsRCwrQkFBK0I7QUFDL0IsOEJBQThCO0FBQzlCLG9EQUFzRDtBQUN0RCw0REFBeUQ7QUFDekQsc0RBQXNEO0FBRXRELE1BQU0sYUFBYSxHQUFHLCtFQUErRSxDQUFDO0FBRXRHLFFBQVEsQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7SUFFOUMsSUFBSSxDQUFDLHNEQUFzRCxFQUFFLEdBQUcsRUFBRTtRQUNoRSxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBQ1AsSUFBSSxHQUFHLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUNqRCxHQUFHLEVBQUUseUJBQXlCO1NBQy9CLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxxQ0FBcUMsRUFBRTtZQUNyRixHQUFHLEVBQUUseUJBQXlCO1NBQy9CLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGdEQUFnRCxFQUFFLEdBQUcsRUFBRTtRQUMxRCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBQ1AsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtZQUNsRSxHQUFHLEVBQUUseUJBQXlCO1NBQy9CLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxF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L2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgQXBwLCBTdGFjaywgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIHNpbm9uIGZyb20gJ3Npbm9uJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgYXJyYXlEaWZmIH0gZnJvbSAnLi4vbGliL29pZGMtcHJvdmlkZXIvZGlmZic7XG5pbXBvcnQgeyBleHRlcm5hbCB9IGZyb20gJy4uL2xpYi9vaWRjLXByb3ZpZGVyL2V4dGVybmFsJztcbmltcG9ydCAqIGFzIGhhbmRsZXIgZnJvbSAnLi4vbGliL29pZGMtcHJvdmlkZXIvaW5kZXgnO1xuXG5jb25zdCBhcm5PZlByb3ZpZGVyID0gJ2Fybjphd3M6aWFtOjoxMjM0NTY3Om9pZGMtcHJvdmlkZXIvb2lkYy5la3MudXMtZWFzdC0xLmFtYXpvbmF3cy5jb20vaWQvc29tZWlkJztcblxuZGVzY3JpYmUoJ09wZW5JZENvbm5lY3RQcm92aWRlciByZXNvdXJjZScsICgpID0+IHtcblxuICB0ZXN0KCdtaW5pbWFsIGNvbmZpZ3VyYXRpb24gKG5vIGNsaWVudHMgYW5kIG5vIHRodW1icHJpbnQpJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgaWFtLk9wZW5JZENvbm5lY3RQcm92aWRlcihzdGFjaywgJ015UHJvdmlkZXInLCB7XG4gICAgICB1cmw6ICdodHRwczovL29wZW5pZC1lbmRwb2ludCcsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6QVdTQ0RLT3BlbklkQ29ubmVjdFByb3ZpZGVyJywge1xuICAgICAgVXJsOiAnaHR0cHM6Ly9vcGVuaWQtZW5kcG9pbnQnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdcIm9wZW5JZENvbm5lY3RQcm92aWRlckFyblwiIHJlc29sdmVzIHRvIHRoZSByZWYnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHByb3ZpZGVyID0gbmV3IGlhbS5PcGVuSWRDb25uZWN0UHJvdmlkZXIoc3RhY2ssICdNeVByb3ZpZGVyJywge1xuICAgICAgdXJsOiAnaHR0cHM6Ly9vcGVuaWQtZW5kcG9pbnQnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHByb3ZpZGVyLm9wZW5JZENvbm5lY3RQcm92aWRlckFybikpLnRvU3RyaWN0RXF1YWwoeyBSZWY6ICdNeVByb3ZpZGVyNzMwQkExQzgnIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzdGF0aWMgZnJvbU9wZW5JZENvbm5lY3RQcm92aWRlckFybiBjYW4gYmUgdXNlZCB0byBpbXBvcnQgYSBwcm92aWRlcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcHJvdmlkZXIgPSBpYW0uT3BlbklkQ29ubmVjdFByb3ZpZGVyLmZyb21PcGVuSWRDb25uZWN0UHJvdmlkZXJBcm4oc3RhY2ssICdNeVByb3ZpZGVyJywgYXJuT2ZQcm92aWRlcik7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocHJvdmlkZXIub3BlbklkQ29ubmVjdFByb3ZpZGVyQXJuKSkudG9TdHJpY3RFcXVhbChhcm5PZlByb3ZpZGVyKTtcbiAgfSk7XG5cbiAgdGVzdCgndGh1bWJwcmludCBsaXN0IGFuZCBjbGllbnQgaWRzIGNhbiBiZSBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBpYW0uT3BlbklkQ29ubmVjdFByb3ZpZGVyKHN0YWNrLCAnTXlQcm92aWRlcicsIHtcbiAgICAgIHVybDogJ2h0dHBzOi8vbXktdXJsJyxcbiAgICAgIGNsaWVudElkczogWydjbGllbnQxJywgJ2NsaWVudDInXSxcbiAgICAgIHRodW1icHJpbnRzOiBbJ3RodW1iMSddLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkFXU0NES09wZW5JZENvbm5lY3RQcm92aWRlcicsIHtcbiAgICAgIFVybDogJ2h0dHBzOi8vbXktdXJsJyxcbiAgICAgIENsaWVudElETGlzdDogWydjbGllbnQxJywgJ2NsaWVudDInXSxcbiAgICAgIFRodW1icHJpbnRMaXN0OiBbJ3RodW1iMSddLFxuICAgIH0pO1xuICB9KTtcblxufSk7XG5cbmRlc2NyaWJlKCdjdXN0b20gcmVzb3VyY2UgcHJvdmlkZXIgaW5mcmFzdHJ1Y3R1cmUnLCAoKSA9PiB7XG5cbiAgdGVzdCgndHdvIHJlc291cmNlcyBzaGFyZSB0aGUgc2FtZSBjciBwcm92aWRlcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdzdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBpYW0uT3BlbklkQ29ubmVjdFByb3ZpZGVyKHN0YWNrLCAnUHJvdmlkZXIxJywgeyB1cmw6ICdwcm92aWRlcjEnIH0pO1xuICAgIG5ldyBpYW0uT3BlbklkQ29ubmVjdFByb3ZpZGVyKHN0YWNrLCAnUHJvdmlkZXIyJywgeyB1cmw6ICdwcm92aWRlcjInIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHRlbXBsYXRlID0gYXBwLnN5bnRoKCkuZ2V0U3RhY2tBcnRpZmFjdChzdGFjay5hcnRpZmFjdElkKS50ZW1wbGF0ZTtcbiAgICBjb25zdCByZXNvdXJjZVR5cGVzID0gT2JqZWN0LnZhbHVlcyh0ZW1wbGF0ZS5SZXNvdXJjZXMpLm1hcCgocjogYW55KSA9PiByLlR5cGUpLnNvcnQoKTtcbiAgICBleHBlY3QocmVzb3VyY2VUeXBlcykudG9TdHJpY3RFcXVhbChbXG4gICAgICAvLyBjdXN0b20gcmVzb3VyY2UgcGVyb3ZpZGVyIHJlc291cmNlc1xuICAgICAgJ0FXUzo6SUFNOjpSb2xlJyxcbiAgICAgICdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLFxuXG4gICAgICAvLyBvcGVuIGlkIGNvbm5lY3QgcmVzb3VyY2VzXG4gICAgICAnQ3VzdG9tOjpBV1NDREtPcGVuSWRDb25uZWN0UHJvdmlkZXInLFxuICAgICAgJ0N1c3RvbTo6QVdTQ0RLT3BlbklkQ29ubmVjdFByb3ZpZGVyJyxcbiAgICBdKTtcbiAgfSk7XG5cbiAgdGVzdCgnaWFtIHBvbGljeScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGlhbS5PcGVuSWRDb25uZWN0UHJvdmlkZXIoc3RhY2ssICdQcm92aWRlcjEnLCB7IHVybDogJ3Byb3ZpZGVyMScgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgUG9saWNpZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFBvbGljeU5hbWU6ICdJbmxpbmUnLFxuICAgICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICAgJ2lhbTpDcmVhdGVPcGVuSURDb25uZWN0UHJvdmlkZXInLFxuICAgICAgICAgICAgICAgICAgJ2lhbTpEZWxldGVPcGVuSURDb25uZWN0UHJvdmlkZXInLFxuICAgICAgICAgICAgICAgICAgJ2lhbTpVcGRhdGVPcGVuSURDb25uZWN0UHJvdmlkZXJUaHVtYnByaW50JyxcbiAgICAgICAgICAgICAgICAgICdpYW06QWRkQ2xpZW50SURUb09wZW5JRENvbm5lY3RQcm92aWRlcicsXG4gICAgICAgICAgICAgICAgICAnaWFtOlJlbW92ZUNsaWVudElERnJvbU9wZW5JRENvbm5lY3RQcm92aWRlcicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdjdXN0b20gcmVzb3VyY2UgcHJvdmlkZXIgaGFuZGxlcicsICgpID0+IHtcbiAgZXh0ZXJuYWwubG9nID0gKCkgPT4geyByZXR1cm47IH07IC8vIGRpc2FibGUgdmVyYm9zaXR5IGZvciB0ZXN0c1xuICBjb25zdCBkb3dubG9hZFRodW1icHJpbnQgPSBleHRlcm5hbC5kb3dubG9hZFRodW1icHJpbnQgPSBzaW5vbi5mYWtlLnJldHVybnMoJ0ZBS0UtVEhVTUJQUklOVCcpO1xuICBjb25zdCBjcmVhdGVPcGVuSURDb25uZWN0UHJvdmlkZXIgPSBleHRlcm5hbC5jcmVhdGVPcGVuSURDb25uZWN0UHJvdmlkZXIgPSBzaW5vbi5mYWtlLnJlc29sdmVzKHsgT3BlbklEQ29ubmVjdFByb3ZpZGVyQXJuOiAnRkFLRS1BUk4nIH0pO1xuICBjb25zdCBkZWxldGVPcGVuSURDb25uZWN0UHJvdmlkZXIgPSBleHRlcm5hbC5kZWxldGVPcGVuSURDb25uZWN0UHJvdmlkZXIgPSBzaW5vbi5mYWtlLnJlc29sdmVzKHsgfSk7XG4gIGNvbnN0IHVwZGF0ZU9wZW5JRENvbm5lY3RQcm92aWRlclRodW1icHJpbnQgPSBleHRlcm5hbC51cGRhdGVPcGVuSURDb25uZWN0UHJvdmlkZXJUaHVtYnByaW50ID0gc2lub24uZmFrZS5yZXNvbHZlcyh7IH0pO1xuICBjb25zdCBhZGRDbGllbnRJRFRvT3BlbklEQ29ubmVjdFByb3ZpZGVyID0gZXh0ZXJuYWwuYWRkQ2xpZW50SURUb09wZW5JRENvbm5lY3RQcm92aWRlciA9IHNpbm9uLmZha2UucmVzb2x2ZXMoeyB9KTtcbiAgY29uc3QgcmVtb3ZlQ2xpZW50SURGcm9tT3BlbklEQ29ubmVjdFByb3ZpZGVyID0gZXh0ZXJuYWwucmVtb3ZlQ2xpZW50SURGcm9tT3BlbklEQ29ubmVjdFByb3ZpZGVyID0gc2lub24uZmFrZS5yZXNvbHZlcyh7IH0pO1xuXG4gIGJlZm9yZUVhY2goKCkgPT4gc2lub24ucmVzZXQoKSk7XG5cbiAgdGVzdCgnY3JlYXRlIHdpdGggdXJsIHdpbGwgZG93bmxvYWQgdGh1bWJwcmludCBmcm9tIGhvc3QnLCBhc3luYyAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW52b2tlSGFuZGxlcih7XG4gICAgICBSZXF1ZXN0VHlwZTogJ0NyZWF0ZScsXG4gICAgICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgU2VydmljZVRva2VuOiAnRm9vJyxcbiAgICAgICAgVXJsOiAnaHR0cHM6Ly9teS11cmx4JyxcbiAgICAgICAgVGh1bWJwcmludExpc3Q6IFsnTXlUaHVtYnByaW50J10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIHNpbm9uLmFzc2VydC5ub3RDYWxsZWQoZG93bmxvYWRUaHVtYnByaW50KTtcbiAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aEV4YWN0bHkoY3JlYXRlT3BlbklEQ29ubmVjdFByb3ZpZGVyLCB7XG4gICAgICBDbGllbnRJRExpc3Q6IFtdLFxuICAgICAgVXJsOiAnaHR0cHM6Ly9teS11cmx4JyxcbiAgICAgIFRodW1icHJpbnRMaXN0OiBbJ015VGh1bWJwcmludCddLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b1N0cmljdEVxdWFsKHtcbiAgICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogJ0ZBS0UtQVJOJyxcbiAgICAgIERhdGE6IHtcbiAgICAgICAgVGh1bWJwcmludHM6ICdbXCJNeVRodW1icHJpbnRcIl0nLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlIHdpdGhvdXQgdGh1bWJwcmludCB3aWxsIGRvd25sb2FkIGZyb20gaG9zdCcsIGFzeW5jICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBpbnZva2VIYW5kbGVyKHtcbiAgICAgIFJlcXVlc3RUeXBlOiAnQ3JlYXRlJyxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBTZXJ2aWNlVG9rZW46ICdGb28nLFxuICAgICAgICBVcmw6ICdodHRwczovL215LXVybHgnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aEV4YWN0bHkoZG93bmxvYWRUaHVtYnByaW50LCAnaHR0cHM6Ly9teS11cmx4Jyk7XG4gICAgc2lub24uYXNzZXJ0LmNhbGxlZFdpdGhFeGFjdGx5KGNyZWF0ZU9wZW5JRENvbm5lY3RQcm92aWRlciwge1xuICAgICAgQ2xpZW50SURMaXN0OiBbXSxcbiAgICAgIFVybDogJ2h0dHBzOi8vbXktdXJseCcsXG4gICAgICBUaHVtYnByaW50TGlzdDogWydGQUtFLVRIVU1CUFJJTlQnXSxcbiAgICB9KTtcblxuICAgIGV4cGVjdChyZXNwb25zZSkudG9TdHJpY3RFcXVhbCh7XG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6ICdGQUtFLUFSTicsXG4gICAgICBEYXRhOiB7XG4gICAgICAgIFRodW1icHJpbnRzOiAnW1wiRkFLRS1USFVNQlBSSU5UXCJdJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RlbGV0ZScsIGFzeW5jICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgYXdhaXQgaW52b2tlSGFuZGxlcih7XG4gICAgICBSZXF1ZXN0VHlwZTogJ0RlbGV0ZScsXG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6ICdGQUtFLUFSTicsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgc2lub24uYXNzZXJ0Lm5vdENhbGxlZChkb3dubG9hZFRodW1icHJpbnQpO1xuICAgIHNpbm9uLmFzc2VydC5ub3RDYWxsZWQoY3JlYXRlT3BlbklEQ29ubmVjdFByb3ZpZGVyKTtcbiAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aEV4YWN0bHkoZGVsZXRlT3BlbklEQ29ubmVjdFByb3ZpZGVyLCB7XG4gICAgICBPcGVuSURDb25uZWN0UHJvdmlkZXJBcm46ICdGQUtFLUFSTicsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3VwZGF0ZSB1cmwgd2l0aCBleHBsaWNpdCB0aHVtYnByaW50cyAocmVwbGFjZSknLCBhc3luYyAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW52b2tlSGFuZGxlcih7XG4gICAgICBSZXF1ZXN0VHlwZTogJ1VwZGF0ZScsXG4gICAgICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgU2VydmljZVRva2VuOiAnRm9vJyxcbiAgICAgICAgVXJsOiAnaHR0cHM6Ly9uZXcnLFxuICAgICAgICBUaHVtYnByaW50TGlzdDogWydUSFVNQjEnLCAnVEhVTUIyJ10sXG4gICAgICB9LFxuICAgICAgT2xkUmVzb3VyY2VQcm9wZXJ0aWVzOiB7XG4gICAgICAgIFVybDogJ2h0dHBzOi8vb2xkJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHJlc3BvbnNlKS50b1N0cmljdEVxdWFsKHtcbiAgICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogJ0ZBS0UtQVJOJyxcbiAgICAgIERhdGE6IHtcbiAgICAgICAgVGh1bWJwcmludHM6ICdbXCJUSFVNQjFcIixcIlRIVU1CMlwiXScsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHNpbm9uLmFzc2VydC5ub3RDYWxsZWQoZG93bmxvYWRUaHVtYnByaW50KTtcbiAgICBzaW5vbi5hc3NlcnQuY2FsbGVkV2l0aEV4YWN0bHkoY3JlYXRlT3BlbklEQ29ubmVjdFByb3ZpZGVyLCB7XG4gICAgICBDbGllbnRJRExpc3Q6IFtdLFxuICAgICAgVXJsOiAnaHR0cHM6Ly9uZXcnLFxuICAgICAgVGh1bWJwcmludExpc3Q6IFsnVEhVTUIxJywgJ1RIVU1CMiddLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd1cGRhdGUgdXJsIHdpdGggbm8gdGh1bWJwcmludCAocmVwbGFjZSknLCBhc3luYyAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaW52b2tlSGFuZGxlcih7XG4gICAgICBSZXF1ZXN0VHlwZTogJ1VwZGF0ZScsXG4gICAgICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgU2VydmljZVRva2VuOiAnRm9vJyxcbiAgICAgICAgVXJsOiAnaHR0cHM6Ly9uZXcnLFxuICAgICAgfSxcbiAgICAgIE9sZFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBVcmw6ICdodHRwczovL29sZCcsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChyZXNwb25zZSkudG9TdHJpY3RFcXVhbCh7XG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6ICdGQUtFLUFSTicsXG4gICAgICBEYXRhOiB7XG4gICAgICAgIFRodW1icHJpbnRzOiAnW1wiRkFLRS1USFVNQlBSSU5UXCJdJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgc2lub24uYXNzZXJ0LmNhbGxlZE9uY2VXaXRoRXhhY3RseShkb3dubG9hZFRodW1icHJpbnQsICdodHRwczovL25ldycpO1xuICAgIHNpbm9uLmFzc2VydC5jYWxsZWRPbmNlV2l0aEV4YWN0bHkoY3JlYXRlT3BlbklEQ29ubmVjdFByb3ZpZGVyLCB7XG4gICAgICBDbGllbnRJRExpc3Q6IFtdLFxuICAgICAgVXJsOiAnaHR0cHM6Ly9uZXcnLFxuICAgICAgVGh1bWJwcmludExpc3Q6IFsnRkFLRS1USFVNQlBSSU5UJ10sXG4gICAgfSk7XG4gICAgc2lub24uYXNzZXJ0Lm5vdENhbGxlZChkZWxldGVPcGVuSURDb25uZWN0UHJvdmlkZXIpO1xuICB9KTtcblxuICB0ZXN0KCd1cGRhdGUgdGh1bWJwcmludCBsaXN0JywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBhd2FpdCBpbnZva2VIYW5kbGVyKHtcbiAgICAgIFJlcXVlc3RUeXBlOiAnVXBkYXRlJyxcbiAgICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogJ0ZBS0UtUGh5c2ljYWxSZXNvdXJjZUlkJyxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBTZXJ2aWNlVG9rZW46ICdGb28nLFxuICAgICAgICBVcmw6ICdodHRwczovL3VybCcsXG4gICAgICAgIFRodW1icHJpbnRMaXN0OiBbJ0ZvbycsICdCYXInXSxcbiAgICAgIH0sXG4gICAgICBPbGRSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgVXJsOiAnaHR0cHM6Ly91cmwnLFxuICAgICAgICBUaHVtYnByaW50TGlzdDogWydGb28nXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgc2lub24uYXNzZXJ0Lm5vdENhbGxlZChkb3dubG9hZFRodW1icHJpbnQpO1xuICAgIHNpbm9uLmFzc2VydC5ub3RDYWxsZWQoY3JlYXRlT3BlbklEQ29ubmVjdFByb3ZpZGVyKTtcbiAgICBzaW5vbi5hc3NlcnQubm90Q2FsbGVkKGRlbGV0ZU9wZW5JRENvbm5lY3RQcm92aWRlcik7XG4gICAgc2lub24uYXNzZXJ0LmNhbGxlZE9uY2VXaXRoRXhhY3RseSh1cGRhdGVPcGVuSURDb25uZWN0UHJvdmlkZXJUaHVtYnByaW50LCB7XG4gICAgICBPcGVuSURDb25uZWN0UHJvdmlkZXJBcm46ICdGQUtFLVBoeXNpY2FsUmVzb3VyY2VJZCcsXG4gICAgICBUaHVtYnByaW50TGlzdDogWydCYXInLCAnRm9vJ10sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZC9yZW1vdmUgY2xpZW50IGlkcycsIGFzeW5jICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgYXdhaXQgaW52b2tlSGFuZGxlcih7XG4gICAgICBSZXF1ZXN0VHlwZTogJ1VwZGF0ZScsXG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6ICdGQUtFLVBoeXNpY2FsUmVzb3VyY2VJZCcsXG4gICAgICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgU2VydmljZVRva2VuOiAnRm9vJyxcbiAgICAgICAgVXJsOiAnaHR0cHM6Ly91cmwnLFxuICAgICAgICBDbGllbnRJRExpc3Q6IFsnQScsICdCJywgJ0MnXSxcbiAgICAgIH0sXG4gICAgICBPbGRSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgVXJsOiAnaHR0cHM6Ly91cmwnLFxuICAgICAgICBDbGllbnRJRExpc3Q6IFsnQScsICdEJ10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIHNpbm9uLmFzc2VydC5ub3RDYWxsZWQoY3JlYXRlT3BlbklEQ29ubmVjdFByb3ZpZGVyKTtcbiAgICBzaW5vbi5hc3NlcnQubm90Q2FsbGVkKGRlbGV0ZU9wZW5JRENvbm5lY3RQcm92aWRlcik7XG4gICAgc2lub24uYXNzZXJ0LmNhbGxlZFR3aWNlKGFkZENsaWVudElEVG9PcGVuSURDb25uZWN0UHJvdmlkZXIpO1xuICAgIHNpbm9uLmFzc2VydC5jYWxsZWRXaXRoRXhhY3RseShhZGRDbGllbnRJRFRvT3BlbklEQ29ubmVjdFByb3ZpZGVyLCB7XG4gICAgICBPcGVuSURDb25uZWN0UHJvdmlkZXJBcm46ICdGQUtFLVBoeXNpY2FsUmVzb3VyY2VJZCcsIENsaWVudElEOiAnQicsXG4gICAgfSk7XG4gICAgc2lub24uYXNzZXJ0LmNhbGxlZFdpdGhFeGFjdGx5KGFkZENsaWVudElEVG9PcGVuSURDb25uZWN0UHJvdmlkZXIsIHtcbiAgICAgIE9wZW5JRENvbm5lY3RQcm92aWRlckFybjogJ0ZBS0UtUGh5c2ljYWxSZXNvdXJjZUlkJywgQ2xpZW50SUQ6ICdDJyxcbiAgICB9KTtcbiAgICBzaW5vbi5hc3NlcnQuY2FsbGVkT25jZVdpdGhFeGFjdGx5KHJlbW92ZUNsaWVudElERnJvbU9wZW5JRENvbm5lY3RQcm92aWRlciwge1xuICAgICAgT3BlbklEQ29ubmVjdFByb3ZpZGVyQXJuOiAnRkFLRS1QaHlzaWNhbFJlc291cmNlSWQnLCBDbGllbnRJRDogJ0QnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdtdWx0aXBsZSBpbi1wbGFjZSB1cGRhdGVzIChubyByZXBsYWNlKScsIGFzeW5jICgpID0+IHtcbiAgICAvLyBXSEVOXG4gICAgYXdhaXQgaW52b2tlSGFuZGxlcih7XG4gICAgICBSZXF1ZXN0VHlwZTogJ1VwZGF0ZScsXG4gICAgICBQaHlzaWNhbFJlc291cmNlSWQ6ICdGQUtFLVBoeXNpY2FsUmVzb3VyY2VJZCcsXG4gICAgICBSZXNvdXJjZVByb3BlcnRpZXM6IHtcbiAgICAgICAgU2VydmljZVRva2VuOiAnRm9vJyxcbiAgICAgICAgVXJsOiAnaHR0cHM6Ly91cmwnLFxuICAgICAgICBUaHVtYnByaW50TGlzdDogWydORVctTElTVCddLFxuICAgICAgICBDbGllbnRJRExpc3Q6IFsnQSddLFxuICAgICAgfSxcbiAgICAgIE9sZFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBVcmw6ICdodHRwczovL3VybCcsXG4gICAgICAgIFRodW1icHJpbnRMaXN0OiBbJ09MRC1MSVNUJ10sXG4gICAgICAgIENsaWVudElETGlzdDogW10sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIHNpbm9uLmFzc2VydC5ub3RDYWxsZWQoZG93bmxvYWRUaHVtYnByaW50KTtcbiAgICBzaW5vbi5hc3NlcnQubm90Q2FsbGVkKGNyZWF0ZU9wZW5JRENvbm5lY3RQcm92aWRlcik7XG4gICAgc2lub24uYXNzZXJ0Lm5vdENhbGxlZChkZWxldGVPcGVuSURDb25uZWN0UHJvdmlkZXIpO1xuICAgIHNpbm9uLmFzc2VydC5ub3RDYWxsZWQocmVtb3ZlQ2xpZW50SURGcm9tT3BlbklEQ29ubmVjdFByb3ZpZGVyKTtcbiAgICBzaW5vbi5hc3NlcnQuY2FsbGVkT25jZVdpdGhFeGFjdGx5KHVwZGF0ZU9wZW5JRENvbm5lY3RQcm92aWRlclRodW1icHJpbnQsIHtcbiAgICAgIE9wZW5JRENvbm5lY3RQcm92aWRlckFybjogJ0ZBS0UtUGh5c2ljYWxSZXNvdXJjZUlkJyxcbiAgICAgIFRodW1icHJpbnRMaXN0OiBbJ05FVy1MSVNUJ10sXG4gICAgfSk7XG4gICAgc2lub24uYXNzZXJ0LmNhbGxlZE9uY2VXaXRoRXhhY3RseShhZGRDbGllbnRJRFRvT3BlbklEQ29ubmVjdFByb3ZpZGVyLCB7XG4gICAgICBPcGVuSURDb25uZWN0UHJvdmlkZXJBcm46ICdGQUtFLVBoeXNpY2FsUmVzb3VyY2VJZCcsXG4gICAgICBDbGllbnRJRDogJ0EnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdtdWx0aXBsZSB1cGRhdGVzIHRoYXQgaW5jbHVkZSBhIHVybCB1cGRhdGUsIHdoaWNoIG1lYW5zIHJlcGxhY2VtZW50JywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBhd2FpdCBpbnZva2VIYW5kbGVyKHtcbiAgICAgIFJlcXVlc3RUeXBlOiAnVXBkYXRlJyxcbiAgICAgIFBoeXNpY2FsUmVzb3VyY2VJZDogJ0ZBS0UtUGh5c2ljYWxSZXNvdXJjZUlkJyxcbiAgICAgIFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBTZXJ2aWNlVG9rZW46ICdGb28nLFxuICAgICAgICBVcmw6ICdodHRwczovL25ldy11cmwnLFxuICAgICAgICBDbGllbnRJRExpc3Q6IFsnQSddLFxuICAgICAgfSxcbiAgICAgIE9sZFJlc291cmNlUHJvcGVydGllczoge1xuICAgICAgICBVcmw6ICdodHRwczovL29sZC11cmwnLFxuICAgICAgICBUaHVtYnByaW50TGlzdDogWydPTEQtTElTVCddLFxuICAgICAgICBDbGllbnRJRExpc3Q6IFtdLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBzaW5vbi5hc3NlcnQubm90Q2FsbGVkKGRlbGV0ZU9wZW5JRENvbm5lY3RQcm92aWRlcik7XG4gICAgc2lub24uYXNzZXJ0Lm5vdENhbGxlZChyZW1vdmVDbGllbnRJREZyb21PcGVuSURDb25uZWN0UHJvdmlkZXIpO1xuICAgIHNpbm9uLmFzc2VydC5ub3RDYWxsZWQodXBkYXRlT3BlbklEQ29ubmVjdFByb3ZpZGVyVGh1bWJwcmludCk7XG4gICAgc2lub24uYXNzZXJ0Lm5vdENhbGxlZChhZGRDbGllbnRJRFRvT3BlbklEQ29ubmVjdFByb3ZpZGVyKTtcbiAgICBzaW5vbi5hc3NlcnQuY2FsbGVkT25jZVdpdGhFeGFjdGx5KGRvd25sb2FkVGh1bWJwcmludCwgJ2h0dHBzOi8vbmV3LXVybCcpOyAvLyBzaW5jZSB0aHVtYnByaW50IGxpc3QgaXMgZW1wdHlcbiAgICBzaW5vbi5hc3NlcnQuY2FsbGVkT25jZVdpdGhFeGFjdGx5KGNyZWF0ZU9wZW5JRENvbm5lY3RQcm92aWRlciwge1xuICAgICAgQ2xpZW50SURMaXN0OiBbJ0EnXSxcbiAgICAgIFRodW1icHJpbnRMaXN0OiBbJ0ZBS0UtVEhVTUJQUklOVCddLFxuICAgICAgVXJsOiAnaHR0cHM6Ly9uZXctdXJsJyxcbiAgICB9KTtcbiAgfSk7XG5cbn0pO1xuXG5kZXNjcmliZSgnYXJyYXlEaWZmJywgKCkgPT4ge1xuICB0ZXN0KCdjYWxjdWxhdGVzIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdHdvIGFycmF5cycsICgpID0+IHtcbiAgICBleHBlY3QoYXJyYXlEaWZmKFsnYScsICdiJywgJ2MnXSwgWydhJywgJ2QnXSkpLnRvU3RyaWN0RXF1YWwoeyBhZGRzOiBbJ2QnXSwgZGVsZXRlczogWydiJywgJ2MnXSB9KTtcbiAgICBleHBlY3QoYXJyYXlEaWZmKFsnYScsICdiJywgJ2MnXSwgW10pKS50b1N0cmljdEVxdWFsKHsgYWRkczogW10sIGRlbGV0ZXM6IFsnYScsICdiJywgJ2MnXSB9KTtcbiAgICBleHBlY3QoYXJyYXlEaWZmKFsnYScsICdiJywgJ2MnXSwgWydhJywgJ2MnLCAnYiddKSkudG9TdHJpY3RFcXVhbCh7IGFkZHM6IFtdLCBkZWxldGVzOiBbXSB9KTtcbiAgICBleHBlY3QoYXJyYXlEaWZmKFtdLCBbJ2EnLCAnYycsICdiJ10pKS50b1N0cmljdEVxdWFsKHsgYWRkczogWydhJywgJ2MnLCAnYiddLCBkZWxldGVzOiBbXSB9KTtcbiAgICBleHBlY3QoYXJyYXlEaWZmKFsneCcsICd5J10sIFsnYScsICdjJywgJ2InXSkpLnRvU3RyaWN0RXF1YWwoeyBhZGRzOiBbJ2EnLCAnYycsICdiJ10sIGRlbGV0ZXM6IFsneCcsICd5J10gfSk7XG4gICAgZXhwZWN0KGFycmF5RGlmZihbXSwgW10pKS50b1N0cmljdEVxdWFsKHsgYWRkczogW10sIGRlbGV0ZXM6IFtdIH0pO1xuICAgIGV4cGVjdChhcnJheURpZmYoWydhJywgJ2EnXSwgWydhJywgJ2InLCAnYScsICdiJywgJ2InXSkpLnRvU3RyaWN0RXF1YWwoeyBhZGRzOiBbJ2InXSwgZGVsZXRlczogW10gfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdPSURDIGlzc3VlcicsICgpID0+IHtcbiAgdGVzdCgnZXh0cmFjdCBpc3N1ZXIgcHJvcGVybHkgaW4gdGhlIG5ldyBwcm92aWRlcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcHJvdmlkZXIgPSBuZXcgaWFtLk9wZW5JZENvbm5lY3RQcm92aWRlcihzdGFjaywgJ015UHJvdmlkZXInLCB7XG4gICAgICB1cmw6ICdodHRwczovL215LWlzc3VlcicsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocHJvdmlkZXIub3BlbklkQ29ubmVjdFByb3ZpZGVySXNzdWVyKSkudG9TdHJpY3RFcXVhbChcbiAgICAgIHsgJ0ZuOjpTZWxlY3QnOiBbMSwgeyAnRm46OlNwbGl0JzogWyc6b2lkYy1wcm92aWRlci8nLCB7IFJlZjogJ015UHJvdmlkZXI3MzBCQTFDOCcgfV0gfV0gfSxcbiAgICApO1xuICB9KTtcblxuICB0ZXN0KCdleHRyYWN0IGlzc3VlciBwcm9wZXJseSBpbiBhIGxpdGVyYWwgaW1wb3J0ZWQgcHJvdmlkZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHByb3ZpZGVyID0gaWFtLk9wZW5JZENvbm5lY3RQcm92aWRlci5mcm9tT3BlbklkQ29ubmVjdFByb3ZpZGVyQXJuKHN0YWNrLCAnTXlQcm92aWRlcicsIGFybk9mUHJvdmlkZXIpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHByb3ZpZGVyLm9wZW5JZENvbm5lY3RQcm92aWRlcklzc3VlcikpLnRvU3RyaWN0RXF1YWwoJ29pZGMuZWtzLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tL2lkL3NvbWVpZCcpO1xuICB9KTtcblxuICB0ZXN0KCdleHRyYWN0IGlzc3VlciBwcm9wZXJseSBpbiBhIFRva2VuIGltcG9ydGVkIHByb3ZpZGVyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBwcm92aWRlciA9IGlhbS5PcGVuSWRDb25uZWN0UHJvdmlkZXIuZnJvbU9wZW5JZENvbm5lY3RQcm92aWRlckFybihzdGFjaywgJ015UHJvdmlkZXInLCBUb2tlbi5hc1N0cmluZyh7IFJlZjogJ0FSTicgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHByb3ZpZGVyLm9wZW5JZENvbm5lY3RQcm92aWRlcklzc3VlcikpLnRvU3RyaWN0RXF1YWwoe1xuICAgICAgJ0ZuOjpTZWxlY3QnOiBbMSwgeyAnRm46OlNwbGl0JzogWyc6b2lkYy1wcm92aWRlci8nLCB7IFJlZjogJ0FSTicgfV0gfV0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmFzeW5jIGZ1bmN0aW9uIGludm9rZUhhbmRsZXIoZXZlbnQ6IFBhcnRpYWw8QVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudD4pIHtcbiAgcmV0dXJuIGhhbmRsZXIuaGFuZGxlcihldmVudCBhcyBhbnkpO1xufVxuIl19