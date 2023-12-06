import * as sinon from 'sinon';
import { arrayDiff } from '../../lib/aws-iam/oidc-handler/diff';
import { external } from '../../lib/aws-iam/oidc-handler/external';
import * as handler from '../../lib/aws-iam/oidc-handler/index';

describe('custom resource provider handler', () => {
  external.log = () => { return; }; // disable verbosity for tests
  const downloadThumbprint = external.downloadThumbprint = sinon.fake.returns('FAKE-THUMBPRINT');
  const createOpenIDConnectProvider = external.createOpenIDConnectProvider = sinon.fake.resolves({ OpenIDConnectProviderArn: 'FAKE-ARN' });
  const deleteOpenIDConnectProvider = external.deleteOpenIDConnectProvider = sinon.fake.resolves({ });
  const updateOpenIDConnectProviderThumbprint = external.updateOpenIDConnectProviderThumbprint = sinon.fake.resolves({ });
  const addClientIDToOpenIDConnectProvider = external.addClientIDToOpenIDConnectProvider = sinon.fake.resolves({ });
  const removeClientIDFromOpenIDConnectProvider = external.removeClientIDFromOpenIDConnectProvider = sinon.fake.resolves({ });

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
    expect(arrayDiff(['a', 'b', 'c'], ['a', 'd'])).toStrictEqual({ adds: ['d'], deletes: ['b', 'c'] });
    expect(arrayDiff(['a', 'b', 'c'], [])).toStrictEqual({ adds: [], deletes: ['a', 'b', 'c'] });
    expect(arrayDiff(['a', 'b', 'c'], ['a', 'c', 'b'])).toStrictEqual({ adds: [], deletes: [] });
    expect(arrayDiff([], ['a', 'c', 'b'])).toStrictEqual({ adds: ['a', 'c', 'b'], deletes: [] });
    expect(arrayDiff(['x', 'y'], ['a', 'c', 'b'])).toStrictEqual({ adds: ['a', 'c', 'b'], deletes: ['x', 'y'] });
    expect(arrayDiff([], [])).toStrictEqual({ adds: [], deletes: [] });
    expect(arrayDiff(['a', 'a'], ['a', 'b', 'a', 'b', 'b'])).toStrictEqual({ adds: ['b'], deletes: [] });
  });
});

async function invokeHandler(event: Partial<AWSLambda.CloudFormationCustomResourceEvent>) {
  return handler.handler(event as any);
}