import { Test } from 'nodeunit';
import * as cfnspec from '../lib';

module.exports = {
  'spot-check Bucket statefulness'(test: Test) {
    const anno = cfnspec.cfnLintAnnotations('AWS::S3::Bucket');
    test.equal(anno.stateful, true);
    test.equal(anno.mustBeEmptyToDelete, true);

    test.done();
  },

  'spot-check Table statefulness'(test: Test) {
    const anno = cfnspec.cfnLintAnnotations('AWS::DynamoDB::Table');
    test.equal(anno.stateful, true);
    test.equal(anno.mustBeEmptyToDelete, false);

    test.done();
  },

  'spot-check MediaStore metrics'(test: Test) {
    const anno = cfnspec.cfnLintAnnotations('AWS::MediaStore::Thingy');
    test.equal(anno.stateful, false);

    test.done();
  },
};

