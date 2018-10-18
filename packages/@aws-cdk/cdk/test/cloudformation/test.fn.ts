import nodeunit = require('nodeunit');
import fn = require('../../lib/cloudformation/fn');

export = nodeunit.testCase({
  'Fn::Join': {
    'rejects empty list of arguments to join'(test: nodeunit.Test) {
      test.throws(() => new fn.FnJoin('.', []));
      test.done();
    }
  }
});
