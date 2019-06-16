import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import kms = require('@aws-cdk/aws-kms');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import sagemaker = require('../lib');

export = {
    "When creating Sagemaker Endpoint": {
        "with only required properties set, it correctly sets default properties"(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const model = sagemaker.Model.fromModelName(stack, 'Model', "mymodel");

            // WHEN
            new sagemaker.Endpoint(stack, 'Endpoint', {
                productionVariants: [ { model } ],
            });

            // THEN
            expect(stack).to(haveResource("AWS::SageMaker::EndpointConfig", {
                ProductionVariants: [
                    {
                        InitialInstanceCount: 1,
                        InitialVariantWeight: 100,
                        InstanceType: 'ml.c4.xlarge',
                        ModelName: "mymodel",
                        VariantName: "mymodel",
                    }
                ]
            }));
            expect(stack).to(haveResource("AWS::SageMaker::Endpoint", {
                EndpointConfigName: { "Fn::GetAtt": [ "EndpointEndpointConfig5871F635", "EndpointConfigName" ] },
                Tags: [
                    { Key: "Name", Value: "Endpoint" }
                ]
            }));

            test.done();
        },
        "with many properties set, it correctly creates the endpoint resources"(test: Test) {
            // GIVEN
            const region = 'test-region'; // hardcode the region
            const stack = new cdk.Stack(undefined, undefined, {
                env: {
                    region
                },
            });
            const containerImage = new sagemaker.GenericContainerDefinition();
            // create the notebook instance
            const model = new sagemaker.Model(stack, 'Model', {
                primaryContainer: containerImage,
            });
            const kmsKey = new kms.Key(stack, "Key");

            // WHEN
            const endpoint = new sagemaker.Endpoint(stack, 'Endpoint', {
                configName: "myconfig",
                productionVariants: [
                    {
                        model,
                        variantName: "myvariant",
                        initialInstanceCount: 10,
                        initialVariantWeight: 20,
                        instanceType: new ec2.InstanceType('p3.2xlarge'),
                    }
                ],
                kmsKey,
            });
            endpoint.node.applyAspect(new cdk.Tag("Project", "myproject"));

            // THEN
            expect(stack).to(haveResource("AWS::SageMaker::EndpointConfig", {
                EndpointConfigName: "myconfig",
                ProductionVariants: [
                    {
                        InitialInstanceCount: 10,
                        InitialVariantWeight: 20,
                        InstanceType: 'ml.p3.2xlarge',
                        ModelName: { "Fn::GetAtt": [ "Model2AD80A05", "ModelName" ]},
                        VariantName: "myvariant",
                    }
                ],
                KmsKeyId: { "Fn::GetAtt": [ "Key961B73FD", "Arn" ]  }
            }));
            expect(stack).to(haveResource("AWS::SageMaker::Endpoint", {
                EndpointConfigName: { "Fn::GetAtt": [ "EndpointEndpointConfig5871F635", "EndpointConfigName" ] },
                Tags: [
                    { Key: "Name", Value: "Endpoint" },
                    { Key: "Project", Value: "myproject" },
                ]
            }));

            test.done();
        },
        "it throws error when no production variant given"(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();

            // WHEN
            const endpoint = new sagemaker.Endpoint(stack, 'Endpoint');

            const errors = validate(stack);

            test.equal(errors.length, 1);
            const error = errors[0];
            test.same(error.source, endpoint);
            test.equal(error.message, "Must have at least one Production Variant");

            test.done();
        },
        "it throws error when incorrect instance count given"(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const model = sagemaker.Model.fromModelName(stack, 'Model', "mymodel");

            // WHEN
            const endpoint = new sagemaker.Endpoint(stack, 'Endpoint', {
                productionVariants: [
                    {
                        initialInstanceCount: -1,
                        initialVariantWeight: 100,
                        instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.C4, ec2.InstanceSize.XLarge),
                        model,
                        variantName: "production",
                    }
                ]
            });
            const errors = validate(stack);

            test.equal(errors.length, 1);
            const error = errors[0];
            test.same(error.source, endpoint);
            test.equal(error.message, "Must have at least one instance");

            test.done();
        },
        "it throws error when incorrect variant weight given"(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const model = sagemaker.Model.fromModelName(stack, 'Model', "mymodel");

            // WHEN
            const endpoint = new sagemaker.Endpoint(stack, 'Endpoint', {
                productionVariants: [
                    {
                        initialInstanceCount: 1,
                        initialVariantWeight: -100,
                        instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.C4, ec2.InstanceSize.XLarge),
                        model,
                        variantName: "production",
                    }
                ]
            });
            const errors = validate(stack);

            test.equal(errors.length, 1);
            const error = errors[0];
            test.same(error.source, endpoint);
            test.equal(error.message, "Cannot have negative variant weight");

            test.done();
        },
    }
};

function validate(construct: cdk.IConstruct): cdk.ValidationError[] {
    cdk.ConstructNode.prepare(construct.node);
    return cdk.ConstructNode.validate(construct.node);
}