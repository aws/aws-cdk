import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { ICallbackFunction, Test } from 'nodeunit';
import lambda = require('../lib');

export = {
    'lambda in a VPC': classFixture(class Henk {
        private readonly stack: cdk.Stack;
        private readonly vpc: ec2.VpcNetwork;
        private readonly lambda: lambda.Function;

        constructor() {
            // GIVEN
            this.stack = new cdk.Stack();
            this.vpc = new ec2.VpcNetwork(this.stack, 'VPC');

            // WHEN
            this.lambda = new lambda.Function(this.stack, 'Lambda', {
                code: new lambda.InlineCode('foo'),
                handler: 'index.handler',
                runtime: lambda.Runtime.NodeJS610,
                vpc: this.vpc
            });
        }

        public 'has subnet and securitygroup'(test: Test) {
            // THEN
            expect(this.stack).to(haveResource('AWS::Lambda::Function', {
                VpcConfig: {
                    SecurityGroupIds: [
                        {"Fn::GetAtt": [ "LambdaSecurityGroupE74659A1", "GroupId" ]}
                    ],
                    SubnetIds: [
                        {Ref: "VPCPrivateSubnet1Subnet8BCA10E0"},
                        {Ref: "VPCPrivateSubnet2SubnetCFCDAA7A"},
                        {Ref: "VPCPrivateSubnet3Subnet3EDCD457"}
                    ]
                }
            }));

            test.done();
        }

        public 'participates in Connections objects'(test: Test) {
            // GIVEN
            const securityGroup = new ec2.SecurityGroup(this.stack, 'SomeSecurityGroup');
            const somethingConnectable = new SomethingConnectable(new ec2.Connections({ securityGroup }));

            // WHEN
            this.lambda.connections.allowTo(somethingConnectable, new ec2.TcpAllPorts(), 'Lambda can call ASG');

            // THEN: rule to generated security group to connect to imported
            expect(this.stack).to(haveResource("AWS::EC2::SecurityGroupEgress", {
                GroupId: { "Fn::GetAtt": [ "ASGInstanceSecurityGroup0525485D", "GroupId" ] },
                IpProtocol: "tcp",
                Description: "Connect there",
                DestinationSecurityGroupId: "sg-12345",
                FromPort: 0,
                ToPort: 65535
            }));

            // THEN: rule to imported security group to allow connections from generated
            expect(this.stack).to(haveResource("AWS::EC2::SecurityGroupIngress", {
                IpProtocol: "tcp",
                Description: "Connect there",
                FromPort: 0,
                GroupId: "sg-12345",
                SourceSecurityGroupId: { "Fn::GetAtt": [ "ASGInstanceSecurityGroup0525485D", "GroupId" ] },
                ToPort: 65535
            }));

            test.done();
        }

        public 'can still make Connections after export/import'(test: Test) {
            test.done();
        }
    }),
};

/**
 * Use a class as test fixture
 *
 * setUp() will be mapped to the (synchronous) constructor. tearDown(cb) will be called if available.
 */
function classFixture(klass: any) {
    let fixture: any;

    const ret: any = {
        setUp(cb: ICallbackFunction) {
            fixture = new klass();
            cb();
        },

        tearDown(cb: ICallbackFunction) {
            if (fixture.tearDown) {
                fixture.tearDown(cb);
            } else {
                cb();
            }
        }
    };

    const testNames = Reflect.ownKeys(klass.prototype).filter(m => m !== 'tearDown' && m !== 'constructor');
    for (const testName of testNames) {
        ret[testName] = (test: Test) => fixture[testName](test);
    }

    return ret;
}

class SomethingConnectable implements ec2.IConnectable {
    constructor(public readonly connections: ec2.Connections) {
    }
}
