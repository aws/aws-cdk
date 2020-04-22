import { Test } from 'nodeunit';

export = {
  create: {
    'defaults'(test: Test) {
      test.done();
    },
    'with no specific version'(test: Test) {
      test.done();
    },
  },

  update: {
    'requires replacement': {
      'change of "name" creates a new cluster with the new name and deletes the old cluster'(test: Test) {
        test.done();
      },
      'change of "resourcesVpcConfig"'(test: Test) {
        test.done();
      },
      'change of "roleArn"'(test: Test) {
        test.done();
      },
      'change of "roleArn" and "version"'(test: Test) {
        test.done();
      },
    },

    'in-place': {
      'version change': {
        'from undefined to a specific value'(test: Test) {
          test.done();
        },

        'from a specific value to another value'(test: Test) {
          test.done();
        },

        'fails from specific value to undefined'(test: Test) {
          test.done();
        },
      },
    },

    'update failure returns the previous physical name': {

      'for "version" updates'(test: Test) {
        test.done();
      },

      'for "name" updates'(test: Test) {
        test.done();
      },

      'for "roleArn" updates'(test: Test) {
        test.done();
      },

    },
  },

  delete: {
    'delete failure': {
      'returns correct physical name'(test: Test) {
        test.done();
      },
    },
  },
};