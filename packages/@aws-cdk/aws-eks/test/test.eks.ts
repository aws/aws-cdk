import { expect, haveResource } from "@aws-cdk/assert";
import ec2 = require("@aws-cdk/aws-ec2");
import cdk = require("@aws-cdk/cdk");
import { Test } from "nodeunit";
import eks = require("../lib");

// tslint:disable:object-literal-key-quotes

export = {
  "can create default cluster, no worker nodes"(test: Test) {
    const stack = new cdk.Stack(undefined, "TestStack", {
      env: { region: "us-east-1", account: "123456" }
    });

    new eks.Cluster(stack, "MyCluster", {
      vpc: exportedVpc(stack),
      vpcPlacement: {
        subnetsToUse: ec2.SubnetType.Public
      }
    });

    expect(stack).toMatch({
      Resources: {
        MyClusterClusterRole0A67D5C4: {
          Type: "AWS::IAM::Role",
          Properties: {
            AssumeRolePolicyDocument: {
              Statement: [
                {
                  Action: "sts:AssumeRole",
                  Effect: "Allow",
                  Principal: {
                    Service: "eks.amazonaws.com"
                  }
                }
              ],
              Version: "2012-10-17"
            },
            ManagedPolicyArns: [
              "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
              "arn:aws:iam::aws:policy/AmazonEKSServicePolicy"
            ]
          }
        },
        MyClusterClusterSecurityGroup17ACDE00: {
          Type: "AWS::EC2::SecurityGroup",
          Properties: {
            GroupDescription: "Cluster API Server Security Group.",
            SecurityGroupEgress: [],
            SecurityGroupIngress: [],
            Tags: [
              {
                Key: "Name",
                Value: "Cluster SecurityGroup"
              },
              {
                Key: "Description",
                Value: "The security group assigned to the cluster"
              }
            ],
            VpcId: "test-vpc-1234"
          }
        },
        MyCluster9CF8BB78: {
          Type: "AWS::EKS::Cluster",
          Properties: {
            ResourcesVpcConfig: {
              SecurityGroupIds: [
                {
                  "Fn::GetAtt": [
                    "MyClusterClusterSecurityGroup17ACDE00",
                    "GroupId"
                  ]
                }
              ],
              SubnetIds: ["pub1"]
            },
            RoleArn: {
              "Fn::GetAtt": ["MyClusterClusterRole0A67D5C4", "Arn"]
            }
          }
        }
      }
    });

    test.done();
  },
  "can create worker group, default settings"(test: Test) {
    const stack = new cdk.Stack(undefined, "TestStack", {
      env: { region: "us-east-1", account: "123456" }
    });

    const testVpc = exportedVpc(stack);

    const cl = new eks.Cluster(stack, "MyCluster", {
      vpc: testVpc,
      vpcPlacement: {
        subnetsToUse: ec2.SubnetType.Public
      }
    });

    new eks.Nodes(stack, "NodeGroup1", {
      vpc: testVpc,
      cluster: cl
    });

    expect(stack).to(
      haveResource("AWS::AutoScaling::AutoScalingGroup", {
        MaxSize: "1",
        MinSize: "1",
        DesiredCapacity: "1",
        LaunchConfigurationName: {
          Ref: "NodeGroup1NodeGroupm5largeLaunchConfig593791C7"
        },
        Tags: [
          {
            Key: "Name",
            PropagateAtLaunch: true,
            Value: "NodeGroup1/NodeGroup-m5.large"
          },
          {
            Key: {
              "Fn::Join": [
                "",
                [
                  "kubernetes.io/cluster/",
                  {
                    Ref: "MyCluster9CF8BB78"
                  }
                ]
              ]
            },
            PropagateAtLaunch: true,
            Value: "owned"
          }
        ]
      })
    );

    expect(stack).to(
      haveResource("AWS::AutoScaling::LaunchConfiguration", {
        ImageId: "ami-0440e4f6b9713faf6",
        InstanceType: "m5.large",
        IamInstanceProfile: {
          Ref: "NodeGroup1NodeGroupm5largeInstanceProfileCED4339B"
        },
        SecurityGroups: [
          {
            "Fn::GetAtt": [
              "NodeGroup1NodeGroupm5largeInstanceSecurityGroup68AD5F49",
              "GroupId"
            ]
          }
        ],
        UserData: {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ",
                {
                  Ref: "MyCluster9CF8BB78"
                },
                " --use-max-pods 29"
              ]
            ]
          }
        }
      })
    );

    expect(stack).to(
      haveResource("AWS::IAM::Role", {
        AssumeRolePolicyDocument: {
          Statement: [
            {
              Action: "sts:AssumeRole",
              Effect: "Allow",
              Principal: {
                Service: "ec2.amazonaws.com"
              }
            }
          ],
          Version: "2012-10-17"
        },
        ManagedPolicyArns: [
          "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
          "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
          "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
        ]
      })
    );

    expect(stack).to(
      haveResource("AWS::IAM::InstanceProfile", {
        Roles: [
          {
            Ref: "NodeGroup1NodeGroupm5largeInstanceRoleA66DE8CA"
          }
        ]
      })
    );

    expect(stack).to(
      haveResource("AWS::EC2::SecurityGroup", {
        GroupDescription: "NodeGroup1/NodeGroup-m5.large/InstanceSecurityGroup",
        SecurityGroupEgress: [
          {
            CidrIp: "0.0.0.0/0",
            Description: "Outbound traffic allowed by default",
            FromPort: -1,
            IpProtocol: "-1",
            ToPort: -1
          }
        ],
        SecurityGroupIngress: [],
        Tags: [
          {
            Key: "Name",
            Value: "NodeGroup1/NodeGroup-m5.large"
          },
          {
            Key: {
              "Fn::Join": [
                "",
                [
                  "kubernetes.io/cluster/",
                  {
                    Ref: "MyCluster9CF8BB78"
                  }
                ]
              ]
            },
            Value: "owned"
          }
        ],
        VpcId: "test-vpc-1234"
      })
    );

    test.done();
  },
  "can create second worker group, custom settings"(test: Test) {
    const stack = new cdk.Stack(undefined, "TestStack", {
      env: { region: "us-east-1", account: "123456" }
    });

    const testVpc = exportedVpc(stack);

    const cl = new eks.Cluster(stack, "MyCluster", {
      vpc: testVpc,
      vpcPlacement: {
        subnetsToUse: ec2.SubnetType.Public
      }
    });

    new eks.Nodes(stack, "NodeGroup1", {
      vpc: testVpc,
      cluster: cl
    });

    new eks.Nodes(stack, "NodeGroup2", {
      vpc: testVpc,
      cluster: cl,
      nodeClass: ec2.InstanceClass.T2,
      nodeSize: ec2.InstanceSize.Medium,
      nodeType: eks.NodeType.Normal,
      minNodes: 2,
      maxNodes: 4,
      sshKeyName: "aws-dev-key"
    });

    expect(stack).to(
      haveResource("AWS::AutoScaling::AutoScalingGroup", {
        MaxSize: "1",
        MinSize: "1",
        DesiredCapacity: "1",
        LaunchConfigurationName: {
          Ref: "NodeGroup1NodeGroupm5largeLaunchConfig593791C7"
        },
        Tags: [
          {
            Key: "Name",
            PropagateAtLaunch: true,
            Value: "NodeGroup1/NodeGroup-m5.large"
          },
          {
            Key: {
              "Fn::Join": [
                "",
                [
                  "kubernetes.io/cluster/",
                  {
                    Ref: "MyCluster9CF8BB78"
                  }
                ]
              ]
            },
            PropagateAtLaunch: true,
            Value: "owned"
          }
        ]
      })
    );

    expect(stack).to(
      haveResource("AWS::AutoScaling::LaunchConfiguration", {
        ImageId: "ami-0440e4f6b9713faf6",
        InstanceType: "m5.large",
        IamInstanceProfile: {
          Ref: "NodeGroup1NodeGroupm5largeInstanceProfileCED4339B"
        },
        SecurityGroups: [
          {
            "Fn::GetAtt": [
              "NodeGroup1NodeGroupm5largeInstanceSecurityGroup68AD5F49",
              "GroupId"
            ]
          }
        ],
        UserData: {
          "Fn::Base64": {
            "Fn::Join": [
              "",
              [
                "#!/bin/bash\nset -o xtrace\n/etc/eks/bootstrap.sh ",
                {
                  Ref: "MyCluster9CF8BB78"
                },
                " --use-max-pods 29"
              ]
            ]
          }
        }
      })
    );

    expect(stack).to(
      haveResource("AWS::IAM::Role", {
        AssumeRolePolicyDocument: {
          Statement: [
            {
              Action: "sts:AssumeRole",
              Effect: "Allow",
              Principal: {
                Service: "ec2.amazonaws.com"
              }
            }
          ],
          Version: "2012-10-17"
        },
        ManagedPolicyArns: [
          "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
          "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
          "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
        ]
      })
    );

    expect(stack).to(
      haveResource("AWS::IAM::InstanceProfile", {
        Roles: [
          {
            Ref: "NodeGroup1NodeGroupm5largeInstanceRoleA66DE8CA"
          }
        ]
      })
    );

    expect(stack).to(
      haveResource("AWS::EC2::SecurityGroup", {
        GroupDescription: "NodeGroup1/NodeGroup-m5.large/InstanceSecurityGroup",
        SecurityGroupEgress: [
          {
            CidrIp: "0.0.0.0/0",
            Description: "Outbound traffic allowed by default",
            FromPort: -1,
            IpProtocol: "-1",
            ToPort: -1
          }
        ],
        SecurityGroupIngress: [],
        Tags: [
          {
            Key: "Name",
            Value: "NodeGroup1/NodeGroup-m5.large"
          },
          {
            Key: {
              "Fn::Join": [
                "",
                [
                  "kubernetes.io/cluster/",
                  {
                    Ref: "MyCluster9CF8BB78"
                  }
                ]
              ]
            },
            Value: "owned"
          }
        ],
        VpcId: "test-vpc-1234"
      })
    );

    expect(stack).to(
      haveResource("AWS::AutoScaling::AutoScalingGroup", {
        MaxSize: "4",
        MinSize: "2",
        DesiredCapacity: "2",
        LaunchConfigurationName: {
          Ref: "NodeGroup2NodeGroupt2mediumLaunchConfigA973C952"
        },
        Tags: [
          {
            Key: "Name",
            PropagateAtLaunch: true,
            Value: "NodeGroup2/NodeGroup-t2.medium"
          },
          {
            Key: {
              "Fn::Join": [
                "",
                [
                  "kubernetes.io/cluster/",
                  {
                    Ref: "MyCluster9CF8BB78"
                  }
                ]
              ]
            },
            PropagateAtLaunch: true,
            Value: "owned"
          }
        ],
        VPCZoneIdentifier: ["pub1"]
      })
    );

    expect(stack).to(
      haveResource("AWS::IAM::Role", {
        AssumeRolePolicyDocument: {
          Statement: [
            {
              Action: "sts:AssumeRole",
              Effect: "Allow",
              Principal: {
                Service: "ec2.amazonaws.com"
              }
            }
          ],
          Version: "2012-10-17"
        },
        ManagedPolicyArns: [
          "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
          "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
          "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
        ]
      })
    );

    expect(stack).to(
      haveResource("AWS::IAM::InstanceProfile", {
        Roles: [
          {
            Ref: "NodeGroup2NodeGroupt2mediumInstanceRoleFDAFEE3C"
          }
        ]
      })
    );

    expect(stack).to(
      haveResource("AWS::EC2::SecurityGroup", {
        GroupDescription:
          "NodeGroup2/NodeGroup-t2.medium/InstanceSecurityGroup",
        SecurityGroupEgress: [
          {
            CidrIp: "0.0.0.0/0",
            Description: "Outbound traffic allowed by default",
            FromPort: -1,
            IpProtocol: "-1",
            ToPort: -1
          }
        ],
        SecurityGroupIngress: [],
        Tags: [
          {
            Key: "Name",
            Value: "NodeGroup2/NodeGroup-t2.medium"
          },
          {
            Key: {
              "Fn::Join": [
                "",
                [
                  "kubernetes.io/cluster/",
                  {
                    Ref: "MyCluster9CF8BB78"
                  }
                ]
              ]
            },
            Value: "owned"
          }
        ],
        VpcId: "test-vpc-1234"
      })
    );

    test.done();
  }
};

function exportedVpc(stack: cdk.Stack) {
  return ec2.VpcNetwork.import(stack, "TestVpc", {
    vpcId: "test-vpc-1234",
    availabilityZones: ["us-east-1d"],
    publicSubnetIds: ["pub1"],
    isolatedSubnetIds: []
  });
}
