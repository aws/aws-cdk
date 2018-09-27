import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import codedeploy = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
  'CodeDeploy DeploymentConfig': {
    "cannot be created without specifying minHealthyHostCount or minHealthyHostPercentage"(test: Test) {
      const stack = new cdk.Stack();

      test.throws(() => {
        new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
        });
      }, /minHealthyHost/i);

      test.done();
    },

    "cannot be created specifying both minHealthyHostCount and minHealthyHostPercentage"(test: Test) {
      const stack = new cdk.Stack();

      test.throws(() => {
        new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
          minHealthyHostCount: 1,
          minHealthyHostPercentage: 1,
        });
      }, /minHealthyHost/i);

      test.done();
    },

    "can be created by specifying only minHealthyHostCount"(test: Test) {
      const stack = new cdk.Stack();

      new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
        minHealthyHostCount: 1,
      });

      expect(stack).to(haveResource('AWS::CodeDeploy::DeploymentConfig', {
        "MinimumHealthyHosts": {
          "Type": "HOST_COUNT",
          "Value": 1,
        },
      }));

      test.done();
    },

    "can be created by specifying only minHealthyHostPercentage"(test: Test) {
      const stack = new cdk.Stack();

      new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
        minHealthyHostPercentage: 75,
      });

      expect(stack).to(haveResource('AWS::CodeDeploy::DeploymentConfig', {
        "MinimumHealthyHosts": {
          "Type": "FLEET_PERCENT",
          "Value": 75,
        },
      }));

      test.done();
    },

    'can be imported'(test: Test) {
      const stack = new cdk.Stack();

      const deploymentConfig = codedeploy.ServerDeploymentConfigRef.import(stack, 'MyDC', {
        deploymentConfigName: 'MyDC',
      });

      test.notEqual(deploymentConfig, undefined);

      test.done();
    },
  },
};
