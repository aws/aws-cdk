// Tests some properties of the generated code
import { Stack, Token } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { elasticloadbalancing, serverless } from '../lib';

export = {
    'missing properties in resource are reported at construction time'(test: Test) {
        const stack = new Stack();

        // Bypass TypeScript's checking with a type assertion
        test.throws(
            () => {
                new elasticloadbalancing.LoadBalancerResource(stack, 'LB', {} as elasticloadbalancing.LoadBalancerResourceProps);
            },
            /missing required property: listeners/
        );

        test.done();
    },

    'missing properties in property type reported at synthesis time'(test: Test) {
        const stack = new Stack();

        const lb = new elasticloadbalancing.LoadBalancerResource(stack, 'LB', {
            // Bypass TypeScript's checking with a type assertion
            listeners: [{
                instancePort: '80'
            } as elasticloadbalancing.LoadBalancerResource.ListenersProperty]
        });

        test.throws(
            () => {
                lb.toCloudFormation();
            },
            /loadBalancerPort/
        )
;
        test.done();
    },

    'properties of invalid primitive type are reported'(test: Test) {
        const stack = new Stack();

        const lb = new elasticloadbalancing.LoadBalancerResource(stack, 'LB', {
            // Bypass TypeScript's checking with a type assertion
            listeners: [{
                instancePort: 80 as any,
                loadBalancerPort: '8080',
                protocol: 'HTTP',
            }]
        });

        test.throws(
            () => {
                lb.toCloudFormation();
            },
            /80 should be a string/
        );

        test.done();
    },

    'scalar unions: primitive'(test: Test) {
        const stack = new Stack();

        const strUri = new serverless.FunctionResource(stack, 'LB', {
            handler: 'handler',
            runtime: 'runtime',
            codeUri: 'uri',
        });

        test.deepEqual(deepRemoveEmpty(strUri.toCloudFormation()), {
            Resources: {
                [strUri.logicalId]:  {
                    Type: 'AWS::Serverless::Function',
                    Properties: {
                        Handler: 'handler',
                        Runtime: 'runtime',
                        CodeUri: 'uri'
                    }
                }
            }
        });

        test.done();
    },

    'scalar unions: complex'(test: Test) {
        const stack = new Stack();

        const s3Uri = new serverless.FunctionResource(stack, 'LB', {
            handler: 'handler',
            runtime: 'runtime',
            codeUri: {
                bucket: 'bucket',
                key: 'key',
                version: 1
            }
        });

        test.deepEqual(deepRemoveEmpty(s3Uri.toCloudFormation()), {
            Resources: {
                [s3Uri.logicalId]:  {
                    Type: 'AWS::Serverless::Function',
                    Properties: {
                        Handler: 'handler',
                        Runtime: 'runtime',
                        CodeUri: {
                            Bucket: 'bucket',
                            Key: 'key',
                            Version: 1
                        }
                    }
                }
            }
        });

        test.done();
    },

    'scalar unions: neither'(test: Test) {
        const stack = new Stack();

        const brokenPrimitiveUri = new serverless.FunctionResource(stack, 'Fn', {
            handler: 'handler',
            runtime: 'runtime',
            codeUri: 3 as any
        });

        test.throws(
            () => {
                brokenPrimitiveUri.toCloudFormation();
            },
            /not one of the possible types/
        );

        test.done();
    },

    'both lists and scalars accepted: list'(test: Test) {
        const stack = new Stack();

        const strUri = new serverless.FunctionResource(stack, 'Fn', {
            handler: 'handler',
            runtime: 'runtime',
            codeUri: 'uri',
            policies: [
                // Alternative 1 is a IAMPolicyDocumentProperty
                {
                    statement: {argument: 'connected series of statements intended to establish a definite proposition'}
                },
                // Alternative 2 is just a string
                "no it's not",
            ]
        });

        test.deepEqual(deepRemoveEmpty(strUri.toCloudFormation()), {
            Resources: {
                [strUri.logicalId]:  {
                    Type: 'AWS::Serverless::Function',
                    Properties: {
                        Handler: 'handler',
                        Runtime: 'runtime',
                        CodeUri: 'uri',
                        Policies: [
                            {
                                Statement: {argument: 'connected series of statements intended to establish a definite proposition'}
                            },
                            // Alternative 2 is just a string
                            "no it's not",
                        ]
                    }
                }
            }
        });

        test.done();
    },

    'both lists and scalars accepted: primitive scalar'(test: Test) {
        const stack = new Stack();

        const strUri = new serverless.FunctionResource(stack, 'Fn', {
            handler: 'handler',
            runtime: 'runtime',
            codeUri: 'uri',
            policies: "no it's not",
        });

        test.deepEqual(deepRemoveEmpty(strUri.toCloudFormation()), {
            Resources: {
                [strUri.logicalId]:  {
                    Type: 'AWS::Serverless::Function',
                    Properties: {
                        Handler: 'handler',
                        Runtime: 'runtime',
                        CodeUri: 'uri',
                        Policies: "no it's not"
                    }
                }
            }
        });

        test.done();
    },

    'both lists and scalars accepted: complex scalar'(test: Test) {
        const stack = new Stack();

        const strUri = new serverless.FunctionResource(stack, 'Fn', {
            handler: 'handler',
            runtime: 'runtime',
            codeUri: 'uri',
            policies: {
                statement: {argument: 'connected series of statements intended to establish a definite proposition'}
            },
        });

        test.deepEqual(deepRemoveEmpty(strUri.toCloudFormation()), {
            Resources: {
                [strUri.logicalId]:  {
                    Type: 'AWS::Serverless::Function',
                    Properties: {
                        Handler: 'handler',
                        Runtime: 'runtime',
                        CodeUri: 'uri',
                        Policies: {
                            Statement: {argument: 'connected series of statements intended to establish a definite proposition'}
                        },
                    }
                }
            }
        });

        test.done();
    },

    'return values of tokens are checked: success'(test: Test) {
        const stack = new Stack();

        const lb = new elasticloadbalancing.LoadBalancerResource(stack, 'LB', {
            listeners: [new Token(() => ({
                instancePort: '80',
                loadBalancerPort: '8080',
                protocol: 'HTTP',
            }))]
        });

        const actual = deepRemoveEmpty(lb.toCloudFormation());
        const expected = {
            Resources: {
                [lb.logicalId]:  {
                    Type: 'AWS::ElasticLoadBalancing::LoadBalancer',
                    Properties: {
                        Listeners: [
                            {
                                InstancePort: '80',
                                LoadBalancerPort: '8080',
                                Protocol: 'HTTP'
                            }
                        ]
                    }
                }
            }
        };

        test.deepEqual(actual, expected);

        test.done();
    },

    'return values of tokens are checked: failure'(test: Test) {
        const stack = new Stack();

        const lb = new elasticloadbalancing.LoadBalancerResource(stack, 'LB', {
            listeners: [new Token(() => ({
                instancePort: 80 as any,  // Incorrect
                loadBalancerPort: '8080',
                protocol: 'HTTP',
            }))]
        });

        test.throws(
            () => {
                lb.toCloudFormation();
            },
            /instancePort: 80 should be a string/
        );

        test.done();
    },
};

/**
 * Deep remove undefined and empty lists/dicts from an object, to generate a minimal model
 *
 * Modifies the object in-place for efficiency, but also returns it for easier function composition.
 */
function deepRemoveEmpty(obj: any) {
    Object.keys(obj).forEach(key => {
        let del = false;
        if (obj[key]) {
            if (typeof obj[key] === 'object') {
                deepRemoveEmpty(obj[key]);
                del = Object.keys(obj[key]).length === 0;
            } else if (obj[key] instanceof Array) {
                obj[key] = obj[key].map(deepRemoveEmpty).filter((x: any) => x != null);
                del = obj[key].length === 0;
            }
        } else {
            del = obj[key] == null;
        }
        if (del) {
            delete obj[key];
        }
    });
    return obj;
}
