import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/core');
import { ICallbackFunction, Test } from 'nodeunit';
import lambda = require('../lib');

export = {
  'lambda in a VPC': classFixture(class Henk {
    private readonly app: cdk.App;
    private readonly stack: cdk.Stack;
    private readonly vpc: ec2.Vpc;
    private readonly lambda: lambda.Function;

    constructor() {
      // GIVEN
      this.app = new cdk.App();
      this.stack = new cdk.Stack(this.app, 'stack');
      this.vpc = new ec2.Vpc(this.stack, 'VPC');

      // WHEN
      this.lambda = new lambda.Function(this.stack, 'Lambda', {
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_10_X,
        vpc: this.vpc,
        allowAllOutbound: false
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
          ]
        }
      }));

      test.done();
    }
	
	 public 'has securitygroup that is passed in props'(test: Test) {
	  // WHEN
      this.lambda = new lambda.Function(this.stack, 'LambdaWithCustomSG', {
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_8_10,
        vpc: this.vpc,
        securityGroup: new ec2.SecurityGroup(this.stack, 'CustomSecurityGroup', { vpc: this.vpc }),
      });
	  
      // THEN
      expect(this.stack).to(haveResource('AWS::Lambda::Function', {
        VpcConfig: {
          SecurityGroupIds: [
            {"Fn::GetAtt": [ "CustomSecurityGroupE5E500E5", "GroupId" ]}
          ],
          SubnetIds: [
            {Ref: "VPCPrivateSubnet1Subnet8BCA10E0"},
            {Ref: "VPCPrivateSubnet2SubnetCFCDAA7A"},
          ]
        }
      }));

      test.done();
    }
	
	public 'has all the securitygroups that are passed as a list of SG in props'(test: Test) {
	  // WHEN
      this.lambda = new lambda.Function(this.stack, 'LambdaWithCustomSGList', {
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_8_10,
        vpc: this.vpc,
        securityGroupsList: [
			new ec2.SecurityGroup(this.stack, 'CustomSecurityGroupA', { vpc: this.vpc }),
			new ec2.SecurityGroup(this.stack, 'CustomSecurityGroupB', { vpc: this.vpc }),
		],
      });
	  
      // THEN
      expect(this.stack).to(haveResource('AWS::Lambda::Function', {
        VpcConfig: {
          SecurityGroupIds: [
            {"Fn::GetAtt": [ "CustomSecurityGroupA267F62DE", "GroupId" ]},
			{"Fn::GetAtt": [ "CustomSecurityGroupB1118D0D5", "GroupId" ]}
          ],
          SubnetIds: [
            {Ref: "VPCPrivateSubnet1Subnet8BCA10E0"},
            {Ref: "VPCPrivateSubnet2SubnetCFCDAA7A"},
          ]
        }
      }));

      test.done();
    }
	
	public 'fails if both of securityGroup and securityGroupsList are passed in props at once'(test: Test) {	  
      // THEN
	  test.throws(() => {
		  new lambda.Function(this.stack, 'LambdaWithWrongProps', {
			code: new lambda.InlineCode('foo'),
			handler: 'index.handler',
			runtime: lambda.Runtime.NODEJS_8_10,
			vpc: this.vpc,
			securityGroup: new ec2.SecurityGroup(this.stack, 'CustomSecurityGroupB', { vpc: this.vpc }),
			securityGroupsList: [
				new ec2.SecurityGroup(this.stack, 'CustomSecurityGroupC', { vpc: this.vpc }),
				new ec2.SecurityGroup(this.stack, 'CustomSecurityGroupD', { vpc: this.vpc }),
			],
		  });
	  }, /Only one of the function props, securityGroup or securityGroupsList, is allowed/);

      test.done();
    }	

    public 'participates in Connections objects'(test: Test) {
      // GIVEN
      const securityGroup = new ec2.SecurityGroup(this.stack, 'SomeSecurityGroup', { vpc: this.vpc });
      const somethingConnectable = new SomethingConnectable(new ec2.Connections({ securityGroups: [securityGroup] }));

      // WHEN
      this.lambda.connections.allowTo(somethingConnectable, ec2.Port.allTcp(), 'Lambda can call connectable');

      // THEN: Lambda can connect to SomeSecurityGroup
      expect(this.stack).to(haveResource("AWS::EC2::SecurityGroupEgress", {
        GroupId: {"Fn::GetAtt": ["LambdaSecurityGroupE74659A1", "GroupId"]},
        IpProtocol: "tcp",
        Description: "Lambda can call connectable",
        DestinationSecurityGroupId: {"Fn::GetAtt": [ "SomeSecurityGroupEF219AD6", "GroupId" ]},
        FromPort: 0,
        ToPort: 65535
      }));

      // THEN: SomeSecurityGroup accepts connections from Lambda
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
      const stack2 = new cdk.Stack(this.app, 'stack2');
      const securityGroup = new ec2.SecurityGroup(stack2, 'SomeSecurityGroup', { vpc: this.vpc });
      const somethingConnectable = new SomethingConnectable(new ec2.Connections({ securityGroups: [securityGroup] }));

      // WHEN
      somethingConnectable.connections.allowFrom(this.lambda.connections, ec2.Port.allTcp(), 'Lambda can call connectable');

      // THEN: SomeSecurityGroup accepts connections from Lambda
      expect(stack2).to(haveResource("AWS::EC2::SecurityGroupEgress", {
        GroupId: {
          "Fn::ImportValue": "stack:ExportsOutputFnGetAttLambdaSecurityGroupE74659A1GroupId8F3EC6F1"
        },
        IpProtocol: "tcp",
        Description: "Lambda can call connectable",
        DestinationSecurityGroupId: {
          "Fn::GetAtt": [
            "SomeSecurityGroupEF219AD6",
            "GroupId"
          ]
        },
        FromPort: 0,
        ToPort: 65535
      }));

      // THEN: Lambda can connect to SomeSecurityGroup
      expect(stack2).to(haveResource("AWS::EC2::SecurityGroupIngress", {
        IpProtocol: "tcp",
        Description: "Lambda can call connectable",
        FromPort: 0,
        GroupId: {
          "Fn::GetAtt": [
            "SomeSecurityGroupEF219AD6",
            "GroupId"
          ]
        },
        SourceSecurityGroupId: {
          "Fn::ImportValue": "stack:ExportsOutputFnGetAttLambdaSecurityGroupE74659A1GroupId8F3EC6F1"
        },
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
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    // WHEN
    test.throws(() => {
      lambdaFn.connections.allowToAnyIpv4(ec2.Port.allTcp(), 'Reach for the world Lambda!');
    });

    test.done();
  },

  'picking public subnets is not allowed'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');

    // WHEN
    test.throws(() => {
      new lambda.Function(stack, 'Lambda', {
        code: new lambda.InlineCode('foo'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_10_X,
        vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC }
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
