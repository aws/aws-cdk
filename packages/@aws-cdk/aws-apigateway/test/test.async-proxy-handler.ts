import AWS = require('aws-sdk-mock');
import { Test } from 'nodeunit';
import sinon = require('sinon');
import { handler } from '../lib/integrations/async-proxy-handler';

AWS.setSDK(require.resolve('aws-sdk'));

export = {
  'setUp'(callback: any) {
    process.env.TARGET_FUNCTION_NAME = 'target-function';
    callback();
  },

  'tearDown'(callback: any) {
    delete process.env.TARGET_FUNCTION_NAME;
    AWS.restore();
    callback();
  },

  async 'invokes the target lambda function and responds with 202'(test: Test) {
    const invokeFake = sinon.fake.resolves({ StatusCode: 204 });

    AWS.mock('Lambda', 'invoke', invokeFake);

    const event = {
      body: '{"key":"value"}',
    };

    const data = await handler(event);

    sinon.assert.calledWith(invokeFake, {
      FunctionName: process.env.TARGET_FUNCTION_NAME,
      InvocationType: 'Event',
      Payload: JSON.stringify(event)
    });

    test.deepEqual(data, {
      statusCode: 202,
      body: ''
    });

    test.done();
  },

  async 'responds with 500 in case of invocation error'(test: Test) {
    const invokeFake = sinon.fake.rejects({ error: 'error' });

    AWS.mock('Lambda', 'invoke', invokeFake);

    const event = {
      body: '{"key":"value"}',
    };

    const data = await handler(event);

    test.deepEqual(data, {
      statusCode: 500,
      body: ''
    });

    test.done();
  },
};
