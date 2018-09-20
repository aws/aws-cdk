import { expect, haveResource } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import codedeploy = require('../lib');

// tslint:disable:object-literal-key-quotes

export = {
    'CodeDeploy Deployment Group': {
        "can be created by explicitly passing an Application"(test: Test) {
            const stack = new cdk.Stack();

            const application = new codedeploy.ServerApplication(stack, 'MyApp');
            new codedeploy.ServerDeploymentGroup(stack, 'MyDG', {
                application,
            });

            expect(stack).to(haveResource('AWS::CodeDeploy::DeploymentGroup', {
                "ApplicationName": {
                    "Ref": "MyApp3CE31C26"
                },
            }));

            test.done();
        },

        'can be imported'(test: Test) {
            const stack = new cdk.Stack();

            const application = codedeploy.ServerApplicationRef.import(stack, 'MyApp', {
                applicationName: 'MyApp',
            });
            const deploymentGroup = codedeploy.ServerDeploymentGroupRef.import(stack, 'MyDG', {
                application,
                deploymentGroupName: 'MyDG',
            });

            test.notEqual(deploymentGroup, undefined);

            test.done();
        }
    },
};
