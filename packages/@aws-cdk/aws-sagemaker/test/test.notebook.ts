import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import sagemaker = require('../lib');

export = {
    "When creating Sagemaker Notebook Instance": {
        "with only required properties set, it correctly sets default properties"(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            // create the notebook instance
            new sagemaker.NotebookInstance(stack, 'Notebook');

            // THEN
            expect(stack).to(haveResource("AWS::SageMaker::NotebookInstance", {
                InstanceType: "ml.t2.medium",
                RoleArn: {
                    "Fn::GetAtt": [ "NotebookSagemakerRole48081954", "Arn" ]
                },
                LifecycleConfigName: {
                    "Fn::GetAtt": [ "NotebookLifecycleConfig48B89718", "NotebookInstanceLifecycleConfigName" ]
                }
            }));

            test.done();
        },
        "with all properties set, it correctly configures the resource"(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const vpc = new ec2.Vpc(stack, "Vpc");
            const subnets = vpc.privateSubnets;
            const sg = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc, allowAllOutbound: true });
            const key = new kms.Key(stack, 'Key');
            const role = new iam.Role(stack, 'Role', { assumedBy: new iam.ServicePrincipal("sagemaker.amazonaws.com") } );
            const instanceType = new ec2.InstanceTypePair(ec2.InstanceClass.M4, ec2.InstanceSize.XLarge);

            // create the notebook instance
            new sagemaker.NotebookInstance(stack, 'Notebook', {
                kmsKeyId: key,
                role,
                instanceType,
                notebookInstanceName: "mynotebook",
                tags: {
                    Name: "myname",
                    Project: "myproject"
                },
                subnet: subnets[0],
                securityGroups: [ sg ],
                enableDirectInternetAccess: true,
                enableRootAccess: false,
                volumeSizeInGB: 100,
            });

            // THEN
            expect(stack).to(haveResource("AWS::SageMaker::NotebookInstance", {
                InstanceType: "ml.m4.xlarge",
                RoleArn: {
                    "Fn::GetAtt": [ "Role1ABCC5F0", "Arn" ]
                },
                LifecycleConfigName: {
                    "Fn::GetAtt": [ "NotebookLifecycleConfig48B89718", "NotebookInstanceLifecycleConfigName" ]
                },
                NotebookInstanceName: "mynotebook",
                Tags: [
                    { Key: "Name", Value: "myname" },
                    { Key: "Project", Value: "myproject" },
                ],
                SubnetId: {
                    Ref: "VpcPrivateSubnet1Subnet536B997A"
                },
                SecurityGroupIds: [
                    { "Fn::GetAtt": [ "SecurityGroupDD263621", "GroupId" ] },
                ],
                VolumeSizeInGB: 100,
                DirectInternetAccess: 'Enabled',
                RootAccess: 'Disabled',
                KmsKeyId: {
                    "Fn::GetAtt": [ "Key961B73FD", "Arn" ]
                }
            }));

            test.done();
        },
        "it configures the lifecycle config object"(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const notebook = new sagemaker.NotebookInstance(stack, 'Notebook');
            notebook.addOnCreateScript(
                'echo "Creating Notebook"',
            );
            notebook.addOnStartScript(
                'echo "Starting Notebook"',
            );
            // THEN
            expect(stack).to(haveResource("AWS::SageMaker::NotebookInstanceLifecycleConfig", {
                OnCreate: [
                    {
                        Content: { "Fn::Base64": "#!/bin/bash\necho \"Creating Notebook\""}
                    }
                ],
                OnStart: [
                    {
                        Content: { "Fn::Base64": "#!/bin/bash\necho \"Starting Notebook\""}
                    }
                ]
            }));
            test.done();
        },
        "it throws error when incorrect volume size given"(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            test.throws(() => new sagemaker.NotebookInstance(stack, 'Notebook', {
                volumeSizeInGB: 1
            }));
            test.done();
        },
        "it throws error when incorrect instance type given"(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            test.throws(() => new sagemaker.NotebookInstance(stack, 'Notebook', {
                instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.X1, ec2.InstanceSize.XLarge32)
            }), /Invalid instance type/);
            test.done();
        },
    }
};
