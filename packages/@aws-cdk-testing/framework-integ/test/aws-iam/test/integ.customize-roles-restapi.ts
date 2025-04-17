import { Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { App, Stack, RemovalPolicy } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';

const app = new App();
const stack = new Stack(app, 'integ-customize-roles-restapi');
Role.customizeRoles(stack, {
  usePrecreatedRoles: {
    'integ-customize-roles-restapi/Role': 'precreated-role',
    'integ-customize-roles-restapi/RestApi/CloudWatchRole':
      'precreated-role-api',
  },
});

// test not throws an error with RestApi that calls `applyRemovalPolicy` internally
const api = new RestApi(stack, 'RestApi', {
  cloudWatchRole: true,
});
api.root.addMethod('GET');

// test not throws an error with explicitly calling `applyRemovalPolicy`
const role = new Role(stack, 'Role', {
  assumedBy: new ServicePrincipal('sns.amazonaws.com'),
});
role.applyRemovalPolicy(RemovalPolicy.DESTROY);

/**
 * This test will not deploy and is only used to provide an example
 * of the synthesized iam policy report
 */
new IntegTest(app, 'IntegTest', {
  testCases: [stack],
  cdkCommandOptions: {
    deploy: {
      enabled: false,
    },
    destroy: {
      enabled: false,
    },
  },
});
