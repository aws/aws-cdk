import { expect } from '@aws-cdk/assert';
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
            roles: [ testEc2Role ],
            path: "/"
        });

        expect(stack).toMatch({ Resources: {
            TestEC2RoleBD27AEF4: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [{
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {
                                Service: 'ec2.amazonaws.com'
                            }
                        }],
                        Version: '2012-10-17'
                    }
                }
            },
            TestEC2InstanceProfile8AF426F8: {
                Type: 'AWS::IAM::InstanceProfile',
                Properties: {
                    Roles: [
                       { Ref: "TestEC2RoleBD27AEF4" }
                    ],
                    InstanceProfileName: 'TestInstanceProfile',
                    Path: '/'
                }
            }
        }
        });
        test.done();
    },

    'test generated instance profile name'(test: Test) {
        const stack = new Stack();

        const testEc2Role = new Role(stack, 'TestEC2Role', {
          assumedBy: new ServicePrincipal('ec2.amazonaws.com')
        });

        new InstanceProfile(stack, 'TestEC2InstanceProfile', {
            roles: [ testEc2Role ],
            path: "/"
        });

        expect(stack).toMatch({ Resources: {
            TestEC2RoleBD27AEF4: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [{
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {
                                Service: 'ec2.amazonaws.com'
                            }
                        }],
                        Version: '2012-10-17'
                    }
                }
            },
            TestEC2InstanceProfile8AF426F8: {
                Type: 'AWS::IAM::InstanceProfile',
                Properties: {
                    Roles: [
                       { Ref: "TestEC2RoleBD27AEF4" }
                    ],
                    InstanceProfileName: "TestEC2InstanceProfile8AF426F8",
                    Path: '/'
                }
            }
        }
        });
        test.done();
    },

    'test without path'(test: Test) {
        const stack = new Stack();

        const testEc2Role = new Role(stack, 'TestEC2Role', {
          assumedBy: new ServicePrincipal('ec2.amazonaws.com')
        });

        new InstanceProfile(stack, 'TestEC2InstanceProfile', {
            instanceProfileName: 'InstanceProfileWithoutPath',
            roles: [ testEc2Role ]
        });

        expect(stack).toMatch({ Resources: {
            TestEC2RoleBD27AEF4: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [{
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {
                                Service: 'ec2.amazonaws.com'
                            }
                        }],
                        Version: '2012-10-17'
                    }
                }
            },
            TestEC2InstanceProfile8AF426F8: {
                Type: 'AWS::IAM::InstanceProfile',
                Properties: {
                    Roles: [
                       { Ref: "TestEC2RoleBD27AEF4" }
                    ],
                    InstanceProfileName: 'InstanceProfileWithoutPath'
                }
            }
        }
        });
        test.done();
    },

    'test role only'(test: Test) {
        const stack = new Stack();

        const testEc2Role = new Role(stack, 'TestEC2Role', {
          assumedBy: new ServicePrincipal('ec2.amazonaws.com')
        });

        new InstanceProfile(stack, 'TestEC2InstanceProfile', {
            roles: [ testEc2Role ]
        });

        expect(stack).toMatch({ Resources: {
            TestEC2RoleBD27AEF4: {
                Type: 'AWS::IAM::Role',
                Properties: {
                    AssumeRolePolicyDocument: {
                        Statement: [{
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: {
                                Service: 'ec2.amazonaws.com'
                            }
                        }],
                        Version: '2012-10-17'
                    }
                }
            },
            TestEC2InstanceProfile8AF426F8: {
                Type: 'AWS::IAM::InstanceProfile',
                Properties: {
                    Roles: [
                       { Ref: "TestEC2RoleBD27AEF4" }
                    ],
                    InstanceProfileName: "TestEC2InstanceProfile8AF426F8"
                }
            }
        }
        });
        test.done();
    },

    'test fails with multiple rolea'(test: Test) {
        const stack = new Stack();

        const testEc2Role = new Role(stack, 'TestEC2Role', {
          assumedBy: new ServicePrincipal('ec2.amazonaws.com')
        });

        const testAnotherEc2Role = new Role(stack, 'TestAnotherEC2Role', {
            assumedBy: new ServicePrincipal('ec2.amazonaws.com')
          });

        test.throws(() =>
            new InstanceProfile(stack, 'TestEC2InstanceProfile', { roles: [ testEc2Role, testAnotherEc2Role ] }),
            'Currently, you can assign a maximum of one role to an instance profile.'
        );
        test.done();
    }
};