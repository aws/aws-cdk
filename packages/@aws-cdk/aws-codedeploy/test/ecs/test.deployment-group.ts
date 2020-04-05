import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as codedeploy from '../../lib';

export = {
  'CodeDeploy ECS DeploymentGroup': {
    'imported with fromEcsDeploymentGroupAttributes': {
      'defaults the Deployment Config to AllAtOnce'(test: Test) {
        const stack = new cdk.Stack();

        const ecsApp = codedeploy.EcsApplication.fromEcsApplicationName(stack, 'EA', 'EcsApplication');
        const importedGroup = codedeploy.EcsDeploymentGroup.fromEcsDeploymentGroupAttributes(stack, 'EDG', {
          application: ecsApp,
          deploymentGroupName: 'EcsDeploymentGroup',
        });

        test.equal(importedGroup.deploymentConfig, codedeploy.EcsDeploymentConfig.ALL_AT_ONCE);

        test.done();
      },
    },
  },
};
