import * as nodeunit from 'nodeunit';
import { IdentitySource } from '../../lib';

export = nodeunit.testCase({
  'blank amount'(test: nodeunit.Test) {
    test.throws(() => IdentitySource.context(''), /empty/);
    test.done();
  },

  'IdentitySource header'(test: nodeunit.Test) {
    const identitySource = IdentitySource.header('Authorization');
    test.equal(identitySource.toString(), 'method.request.header.Authorization');
    test.done();
  },

  'IdentitySource queryString'(test: nodeunit.Test) {
    const identitySource = IdentitySource.queryString('param');
    test.equal(identitySource.toString(), 'method.request.querystring.param');
    test.done();
  },

  'IdentitySource stageVariable'(test: nodeunit.Test) {
    const identitySource = IdentitySource.stageVariable('var1');
    test.equal(identitySource.toString(), 'stageVariables.var1');
    test.done();
  },

  'IdentitySource context'(test: nodeunit.Test) {
    const identitySource = IdentitySource.context('httpMethod');
    test.equal(identitySource.toString(), 'context.httpMethod');
    test.done();
  },
});
