import { Test } from 'nodeunit';
import { parseAwsApiCall, parseMethodOptionsPath } from '../lib/util';

export = {
  parseMethodResourcePath: {
    'fails if path does not start with a /'(test: Test) {
      test.throws(() => parseMethodOptionsPath('foo'), /Method options path must start with \'\/\'/);
      test.done();
    },

    'fails if there are less than two components'(test: Test) {
      test.throws(() => parseMethodOptionsPath('/'), /Method options path must include at least two components/);
      test.throws(() => parseMethodOptionsPath('/foo'), /Method options path must include at least two components/);
      test.throws(() => parseMethodOptionsPath('/foo/'), /Invalid HTTP method ""/);
      test.done();
    },

    'fails if a non-supported http method is used'(test: Test) {
      test.throws(() => parseMethodOptionsPath('/foo/bar'), /Invalid HTTP method "BAR"/);
      test.done();
    },

    'extracts resource path and method correctly'(test: Test) {
      test.deepEqual(parseMethodOptionsPath('/foo/GET'),   { resourcePath: '/~1foo', httpMethod: 'GET' });
      test.deepEqual(parseMethodOptionsPath('/foo/bar/GET'), { resourcePath: '/~1foo~1bar', httpMethod: 'GET' });
      test.deepEqual(parseMethodOptionsPath('/foo/*/GET'),   { resourcePath: '/~1foo~1*', httpMethod: 'GET' });
      test.deepEqual(parseMethodOptionsPath('/*/GET'),     { resourcePath: '/*', httpMethod: 'GET' });
      test.deepEqual(parseMethodOptionsPath('/*/*'),     { resourcePath: '/*', httpMethod: '*' });
      test.deepEqual(parseMethodOptionsPath('//POST'),     { resourcePath: '/', httpMethod: 'POST' });
      test.done();
    }
  },

  parseAwsApiCall: {
    'fails if "actionParams" is set but "action" is undefined'(test: Test) {
      test.throws(() => parseAwsApiCall(undefined, undefined, { foo: '123' }), /"actionParams" requires that "action" will be set/);
      test.done();
    },

    'fails since "action" and "path" are mutually exclusive'(test: Test) {
      test.throws(() => parseAwsApiCall('foo', 'bar'), /"path" and "action" are mutually exclusive \(path="foo", action="bar"\)/);
      test.done();
    },

    'fails if "path" and "action" are both undefined'(test: Test) {
      test.throws(() => parseAwsApiCall(), /Either "path" or "action" are required/);
      test.done();
    },

    '"path" mode'(test: Test) {
      test.deepEqual(parseAwsApiCall('my/path'), { apiType: 'path', apiValue: 'my/path' });
      test.done();
    },

    '"action" mode with no parameters'(test: Test) {
      test.deepEqual(parseAwsApiCall(undefined, 'MyAction'), { apiType: 'action', apiValue: 'MyAction' });
      test.done();
    },

    '"action" mode with parameters (url-encoded)'(test: Test) {
      test.deepEqual(parseAwsApiCall(undefined, 'GetObject', { Bucket: 'MyBucket', Key: 'MyKey' }), {
        apiType: 'action',
        apiValue: 'GetObject&Bucket=MyBucket&Key=MyKey'
      });
      test.done();
    }
  }
};
