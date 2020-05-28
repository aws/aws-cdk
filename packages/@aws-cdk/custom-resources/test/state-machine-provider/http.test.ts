import * as nock from 'nock';
import * as http from '../../lib/state-machine-provider/runtime/http';

console.log = jest.fn(); // tslint:disable-line:no-console

beforeEach(() => {
  nock.cleanAll();
});

test('respond', async () => {
  const request = nock('https://localhost')
    .put('/', body =>
      body.Status === 'SUCCESS' &&
      body.PhysicalResourceId === 'physical-resource-id' &&
      body.Data.Key === 'Value',
    )
    .reply(200);

  await http.respond('SUCCESS', {
    LogicalResourceId: 'logical-resource-id',
    RequestId: 'request-id',
    ResponseURL: 'https://localhost',
    StackId: 'stack-id',
    PhysicalResourceId: 'physical-resource-id',
    Data: {
      Key: 'Value',
    },
  });

  expect(request.isDone()).toBeTruthy();
});

test('respond without physical resource id', async () => {
  const request = nock('https://localhost')
    .put('/', body => body.PhysicalResourceId === http.MISSING_PHYSICAL_ID_MARKER)
    .reply(200);

  await http.respond('SUCCESS', {
    LogicalResourceId: 'logical-resource-id',
    RequestId: 'request-id',
    ResponseURL: 'https://localhost',
    StackId: 'stack-id',
  });

  expect(request.isDone()).toBeTruthy();
});
