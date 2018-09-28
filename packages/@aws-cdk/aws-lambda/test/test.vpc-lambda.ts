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
      const securityGroup = new ec2.SecurityGroup(this.stack, 'SomeSecurityGroup', { vpc: this.vpc });
      const somethingConnectable = new SomethingConnectable(new ec2.Connections({ securityGroup }));

      // WHEN
      this.lambda.connections.allowTo(somethingConnectable, new ec2.TcpAllPorts(), 'Lambda can call connectable');

      // THEN: SomeSecurityGroup accepts connections from Lambda
      expect(this.stack).to(haveResource("AWS::EC2::SecurityGroupEgress", {
        GroupId: {"Fn::GetAtt": ["LambdaSecurityGroupE74659A1", "GroupId"]},
        IpProtocol: "tcp",
        Description: "Lambda can call connectable",
        DestinationSecurityGroupId: {"Fn::GetAtt": [ "SomeSecurityGroupEF219AD6", "GroupId" ]},
        FromPort: 0,
        ToPort: 65535
      }));

      // THEN: Lambda can connect to SomeSecurityGroup
      expect(this.stack).to(haveResource("AWS::EC2::SecurityGroupIngress", {
        IpProtocol: "tcp",
        Description: "Lambda can call connectable",
        FromPort: 0,
        GroupId: { "Fn::GetAtt": ["SomeSecurityGroupEF219AD6", "GroupId"] },
        SourceSecurityGroupId: {"Fn::GetAtt": ["LambdaSecurityGroupE74659A1", "GroupId" ]},
        ToPort: 65535
      }));

      test.done();
    }

    public 'can still make Connections after export/import'(test: Test) {
      // GIVEN
      const stack2 = new cdk.Stack();
      const securityGroup = new ec2.SecurityGroup(stack2, 'SomeSecurityGroup', { vpc: this.vpc });
      const somethingConnectable = new SomethingConnectable(new ec2.Connections({ securityGroup }));

      // WHEN
      const importedLambda = lambda.FunctionRef.import(stack2, 'Lambda', this.lambda.export());
      importedLambda.connections.allowTo(somethingConnectable, new ec2.TcpAllPorts(), 'Lambda can call connectable');

      // THEN: SomeSecurityGroup accepts connections from Lambda
      expect(stack2).to(haveResource("AWS::EC2::SecurityGroupEgress", {
        GroupId: { "Fn::ImportValue": "LambdaSecurityGroupId9A2717B3" },
        IpProtocol: "tcp",
        Description: "Lambda can call connectable",
        DestinationSecurityGroupId: { "Fn::GetAtt": [ "SomeSecurityGroupEF219AD6", "GroupId" ] },
        FromPort: 0,
        ToPort: 65535
      }));

      // THEN: Lambda can connect to SomeSecurityGroup
      expect(stack2).to(haveResource("AWS::EC2::SecurityGroupIngress", {
        IpProtocol: "tcp",
        Description: "Lambda can call connectable",
        FromPort: 0,
        GroupId: { "Fn::GetAtt": [ "SomeSecurityGroupEF219AD6", "GroupId" ] },
        SourceSecurityGroupId: { "Fn::ImportValue": "LambdaSecurityGroupId9A2717B3" },
        ToPort: 65535
      }));

      test.done();
    }
  }),

  'lambda without VPC throws Error upon accessing connections'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const lambdaFn = new lambda.Function(stack, 'Lambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS610,
    });

    // WHEN
    test.throws(() => {
      lambdaFn.connections.allowToAnyIPv4(new ec2.TcpAllPorts(), 'Reach for the world Lambda!');
    });

    test.done();
  },

  'picking public subnets is not allowed'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.VpcNetwork(stack, 'VPC');

    // WHEN
    test.throws(() => {
      new lambda.Function(stack, 'Lambda', {
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NodeJS610,
        vpc,
        vpcPlacement: { subnetsToUse: ec2.SubnetType.Public }
      });
    });

    test.done();
  }
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
