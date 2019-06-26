import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import sagemaker = require('../lib');
import { GenericContainerDefinition } from '../lib';

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
                    ]
                },
                Tags: [
                    { Key: "Name", Value: "Model" },
                    { Key: "Project", Value: "myproject" },
                ]
            }));

            test.done();
        },
        "use list of containers in inference pipeline"(test: Test) {
            // GIVEN
            const region = 'us-west-2'; // hardcode the region
            const stack = new cdk.Stack(undefined, undefined, {
                env: {
                    region
                },
            });
            // create the notebook instance
            const containerImage1 = new sagemaker.GenericContainerDefinition({
                amiMap: { 'us-west-2': "123456789012.dkr.ecr.us-west-2.amazonaws.com/mymodel1:latest" },
            });
            const containerImage2 = new sagemaker.GenericContainerDefinition({
                amiMap: { 'us-west-2': "123456789012.dkr.ecr.us-west-2.amazonaws.com/mymodel2:latest" },
            });
            const model = new sagemaker.Model(stack, 'Model', {
                modelName: "MyModel",
            });
            model.addContainer(containerImage1);
            model.addContainer(containerImage2);

            // THEN
            expect(stack).to(haveResource("AWS::SageMaker::Model", {
                Containers: [
                    { Image: "123456789012.dkr.ecr.us-west-2.amazonaws.com/mymodel1:latest" },
                    { Image: "123456789012.dkr.ecr.us-west-2.amazonaws.com/mymodel2:latest" },
                ],
                Tags: [
                    { Key: "Name", Value: "Model" },
                ]
            }));

            test.done();
        },
        "it throws error when no primary nor containers defined"(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            // create the model
            const model = new sagemaker.Model(stack, 'Model');

            // WHEN
            const errors = validate(stack);

            test.equal(errors.length, 1);
            const error = errors[0];
            test.same(error.source, model);
            test.equal(error.message, "Must define either Primary Container or list of inference containers");

            test.done();
        },
        "it throws error when more than 5 containers defined"(test: Test) {
            // GIVEN
            const region = 'test-region'; // hardcode the region
            const stack = new cdk.Stack(undefined, undefined, {
                env: {
                    region
                },
            });
            // create the model
            const model = new sagemaker.Model(stack, 'Model');
            const container = new GenericContainerDefinition();
            times (6) (() => model.addContainer(container));

            // WHEN
            const errors = validate(stack);

            test.equal(errors.length, 1);
            const error = errors[0];
            test.same(error.source, model);
            test.equal(error.message, "Cannot have more than 5 containers in inference pipeline");

            test.done();
        },
    }
};

function validate(construct: cdk.IConstruct): cdk.ValidationError[] {
    cdk.ConstructNode.prepare(construct.node);
    return cdk.ConstructNode.validate(construct.node);
}

const times = (x: number) => (f: () => void) => {
    if (x > 0) {
      f();
      times (x - 1) (f);
    }
};