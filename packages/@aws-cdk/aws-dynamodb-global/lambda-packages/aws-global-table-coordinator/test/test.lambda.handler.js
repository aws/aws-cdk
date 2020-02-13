'use strict';

const handler = require('../lib');
const AWS = require('aws-sdk-mock');
const LambdaTester = require('lambda-tester').noVersionCheck();
const sinon = require('sinon');
const nock = require('nock');

AWS.setSDK(require.resolve('aws-sdk'));

describe('Global DynamoDB Handler', () => {
  const origLog = console.log;
  const testRequestId = 'f4ef1b10-c39a-44e3-99c0-fbf7e53c3943';
  const testTableName = 'testTable';
  const ResponseURL = 'https://cloudwatch-response-mock.example.com/';

  beforeEach(() => {
    handler.withDefaultResponseURL(ResponseURL);
    console.log = function () {};
  });
  afterEach(() => {
    AWS.restore();
    console.log = origLog;
  });

  test('Fails if the event payload is empty', () => {
    const request = nock(ResponseURL).put('/', body => {
      return body.Status === 'FAILED' && body.Reason === 'Unsupported request type undefined';
    }).reply(200);
    return LambdaTester(handler.handler)
      .event({})
      .expectResolve(() => {
        expect(request.isDone()).toBe(true);
      });
  });

  test('Fails if the request type is bogus', () => {
    const bogusType = 'bogus';
    const request = nock(ResponseURL).put('/', body => {
      return body.Status === 'FAILED' && body.Reason === 'Unsupported request type ' + bogusType;
    }).reply(200);
    return LambdaTester(handler.handler)
      .event({
        RequestType: bogusType
      })
      .expectResolve(() => {
        expect(request.isDone()).toBe(true);
      });
  });

  test('Call createGlobalTable if RequestType is Create', () => {
    const createTableFake = sinon.fake.resolves({
      GlobalTableDescription: {
        GlobalTableName: testTableName,
        ReplicationGroup: [{ RegionName: "us-west-2" }, { RegionName: "us-east-1" }]
      }
    });

    AWS.mock('DynamoDB', 'createGlobalTable', createTableFake);

    const request = nock(ResponseURL).put('/', body => {
      return body.Status === 'SUCCESS';
    }).reply(200);

    return LambdaTester(handler.handler)
      .event({
        RequestType: 'Create',
        RequestId: testRequestId,
        ResourceProperties: {
          TableName: testTableName,
          Regions: [ 'us-west-2', 'us-east-1']
        }
      })
      .expectResolve(() => {
        sinon.assert.calledWith(createTableFake, sinon.match({
          GlobalTableName: testTableName,
          ReplicationGroup: [{ RegionName: "us-west-2" }, { RegionName: "us-east-1" }]
        }));
        expect(request.isDone()).toBe(true);
      });
  });

  test('Call describeGlobalTable and updateGlobalTable if RequestType is Update', () => {
    const describeTablesFake = sinon.fake.resolves({
      GlobalTableDescription: {
        GlobalTableName: testTableName,
        ReplicationGroup: [{ RegionName: 'us-west-2' }, { RegionName: 'us-east-2' }]
      }
    });

    const updateTablesFake = sinon.fake.resolves({
      GlobalTableDescription: {
        GlobalTableName: testTableName
      }
    });

    AWS.mock('DynamoDB', 'describeGlobalTable', describeTablesFake);
    AWS.mock('DynamoDB', 'updateGlobalTable', updateTablesFake);

    const request = nock(ResponseURL).put('/', body => {
      return body.Status === 'SUCCESS';
    }).reply(200);

    return LambdaTester(handler.handler)
      .event({
        RequestType: 'Update',
        RequestId: testRequestId,
        ResourceProperties: {
          TableName: testTableName,
          Regions: [ 'us-west-2', 'us-east-1']
        }
      })
      .expectResolve(() => {
        sinon.assert.calledWith(updateTablesFake, sinon.match({
          GlobalTableName: testTableName
        }));
        sinon.assert.calledWith(describeTablesFake, sinon.match({
          GlobalTableName: testTableName
        }));
        expect(request.isDone()).toBe(true);
      });
  });

  test('Do nothing if RequestType is Delete', () => {
    const request = nock(ResponseURL).put('/', body => {
      return body.Status === 'SUCCESS';
    }).reply(200);

    return LambdaTester(handler.handler)
      .event({
        RequestType: 'Delete',
        RequestId: testRequestId,
        ResourceProperties: {}
      })
      .expectResolve(() => {
        expect(request.isDone()).toBe(true);
      });
  });
});
