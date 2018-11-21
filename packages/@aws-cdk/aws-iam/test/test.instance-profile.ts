import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { InstanceProfile, Role, ServicePrincipal } from '../lib';

export = {
    'default instance profile'(test: Test) {
        const stack = new Stack();

        const testEc2Role = new Role(stack, 'TestEC2Role', {
          assumedBy: new ServicePrincipal('ec2.amazonaws.com')
        });

        new InstanceProfile(stack, 'TestEC2InstanceProfile', {
            instanceProfileName: "TestInstanceProfile",
            role: testEc2Role,
            path: "/"
        });
        expect(stack).to(haveResource('AWS::IAM::InstanceProfile', {
            Roles: [
                { Ref: "TestEC2RoleBD27AEF4" }
            ],
            InstanceProfileName: 'TestInstanceProfile',
            Path: '/'
        }));
        test.done();
    },

    'test without path'(test: Test) {
        const stack = new Stack();

        const testEc2Role = new Role(stack, 'TestEC2Role', {
          assumedBy: new ServicePrincipal('ec2.amazonaws.com')
        });

        new InstanceProfile(stack, 'TestEC2InstanceProfile', {
            instanceProfileName: 'InstanceProfileWithoutPath',
            role: testEc2Role
        });

        expect(stack).to(haveResource('AWS::IAM::InstanceProfile', {
            Roles: [
                { Ref: "TestEC2RoleBD27AEF4" }
            ],
            InstanceProfileName: 'InstanceProfileWithoutPath'
        }));
        test.done();
    },

    'test role only'(test: Test) {
        const stack = new Stack();

        const testEc2Role = new Role(stack, 'TestEC2Role', {
          assumedBy: new ServicePrincipal('ec2.amazonaws.com')
        });

        new InstanceProfile(stack, 'TestEC2InstanceProfile', {
            role: testEc2Role
        });

        expect(stack).to(haveResource('AWS::IAM::InstanceProfile', {
            Roles: [
                { Ref: "TestEC2RoleBD27AEF4" }
            ]
        }));
        test.done();
    },

    'test role other than ec2'(test: Test) {
        const stack = new Stack();

        const testEc2Role = new Role(stack, 'TestEC2SNSRole', {
          assumedBy: new ServicePrincipal('sns.amazonaws.com')
        });

        new InstanceProfile(stack, 'TestEC2InstanceProfile', {
            role: testEc2Role
        });

        expect(stack).to(haveResource('AWS::IAM::InstanceProfile', {
            Roles: [
                { Ref: "TestEC2SNSRole3159CBC5" }
            ]
        }));
        test.done();
    },

    'default ec2 role created'(test: Test) {
        const stack = new Stack();

        new InstanceProfile(stack, 'TestEC2InstanceProfile', {});
        expect(stack).to(haveResource('AWS::IAM::InstanceProfile', {
            Roles: [
                { Ref: "TestEC2InstanceProfileEC2Role5106A065" }
            ]
        }));
        test.done();
    }
};