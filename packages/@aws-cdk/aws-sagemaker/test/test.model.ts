import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import sagemaker = require('../lib');

export = {
    "When creating Sagemaker Model": {
        "with only required properties set, it correctly sets default properties"(test: Test) {
            // GIVEN
            const region = 'test-region'; // hardcode the region
            const stack = new cdk.Stack(undefined, undefined, {
                env: {
                    region
                },
            });
            const containerImage = new sagemaker.GenericContainerDefinition();
            // create the notebook instance
            new sagemaker.Model(stack, 'Model', {
                primaryContainer: containerImage
            });

            // THEN
            expect(stack).to(haveResource("AWS::SageMaker::Model", {
                PrimaryContainer: {
                    Image: "123456789012.dkr.ecr.us-west-2.amazonaws.com/mymodel:latest",
                },
                ExecutionRoleArn: {
                    "Fn::GetAtt": [ "ModelSagemakerRole321FBBBD", "Arn" ]
                },
                Tags: [
                    { Key: "Name", Value: "Model" }
                ]
            }));

            test.done();
        },
        "with all avaiable properties set, it correctly creates the needed resources"(test: Test) {
            // GIVEN
            const region = 'test-region'; // hardcode the region
            const stack = new cdk.Stack(undefined, undefined, {
                env: {
                    region
                },
            });
            const vpc = new ec2.Vpc(stack, 'Vpc');
            const role = new iam.Role(stack, 'Role', {
                assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
            });
            // create the notebook instance
            const containerImage = new sagemaker.GenericContainerDefinition({
                amiMap: { 'test-region': "123456789012.dkr.ecr.us-west-2.amazonaws.com/mymodel:latest" },
                modelDataUrl: 's3://modelbucket/model.tar.gz',
                environment: { SOMEVAR: "SOMEVALUE" },
                containerHostname: "myhostname"
            });
            const model = new sagemaker.Model(stack, 'Model', {
                modelName: "MyModel",
                primaryContainer: containerImage,
                vpc,
                role,
            });
            model.node.applyAspect(new cdk.Tag("Project", "myproject"));

            // THEN
            expect(stack).to(haveResource("AWS::SageMaker::Model", {
                ExecutionRoleArn: {
                    "Fn::GetAtt": [ "Role1ABCC5F0", "Arn" ]
                },
                ModelName: "MyModel",
                PrimaryContainer: {
                    ContainerHostname: "myhostname",
                    Environment: {
                        SOMEVAR: "SOMEVALUE"
                    },
                    Image: "123456789012.dkr.ecr.us-west-2.amazonaws.com/mymodel:latest",
                    ModelDataUrl: "s3://modelbucket/model.tar.gz"
                },
                VpcConfig: {
                    SecurityGroupIds: [ { "Fn::GetAtt": [ "ModelModelSecurityGroupF33B0A56", "GroupId" ] } ],
                    Subnets: [
                        { Ref: "VpcPrivateSubnet1Subnet536B997A" },
                        { Ref: "VpcPrivateSubnet2Subnet3788AAA1" },
                        { Ref: "VpcPrivateSubnet3SubnetF258B56E" },
                    ]
                },
                Tags: [
                    { Key: "Name", Value: "Model" },
                    { Key: "Project", Value: "myproject" },
                ]
            }));

            test.done();
        },
    }
};