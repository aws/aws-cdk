import { expect, haveResource } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { Stack, Tag } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as eks from '../lib';

export = {
  'can be added to a cluster'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster');

    // WHEN
    cluster.addFargateProfile('MyProfile', {
      selectors: [ { namespace: 'default' } ]
    });

    // THEN
    expect(stack).to(haveResource('Custom::AWSCDK-EKS-FargateProfile', {
      Config: {
        clusterName: { Ref: "MyCluster8AD82BF8" },
        podExecutionRoleArn: { "Fn::GetAtt": [ "MyClusterfargateprofileMyProfilePodExecutionRole4795C054", "Arn" ] },
        selectors: [ { namespace: "default" } ]
      }
    }));
    test.done();
  },

  'supports specifying a profile name'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster');

    // WHEN
    cluster.addFargateProfile('MyProfile', {
      fargateProfileName: 'MyProfileName',
      selectors: [ { namespace: 'default' } ]
    });

    // THEN
    expect(stack).to(haveResource('Custom::AWSCDK-EKS-FargateProfile', {
      Config: {
        clusterName: { Ref: "MyCluster8AD82BF8" },
        podExecutionRoleArn: { "Fn::GetAtt": [ "MyClusterfargateprofileMyProfilePodExecutionRole4795C054", "Arn" ] },
        selectors: [ { namespace: 'default' } ],
        fargateProfileName: 'MyProfileName',
      }
    }));
    test.done();
  },

  'supports custom execution role'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster');
    const myRole = new iam.Role(stack, 'MyRole', { assumedBy: new iam.AnyPrincipal() });

    // WHEN
    cluster.addFargateProfile('MyProfile', {
      podExecutionRole: myRole,
      selectors: [ { namespace: 'default' } ]
    });

    // THEN
    expect(stack).to(haveResource('Custom::AWSCDK-EKS-FargateProfile', {
      Config: {
        clusterName: { Ref: "MyCluster8AD82BF8" },
        podExecutionRoleArn: { "Fn::GetAtt": [ "MyRoleF48FFE04", "Arn" ] },
        selectors: [ { namespace: "default" } ]
      }
    }));
    test.done();
  },

  'supports tags through aspects'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster');

    // WHEN
    cluster.addFargateProfile('MyProfile', {
      selectors: [ { namespace: 'default' } ],
    });

    Tag.add(stack, 'aspectTag', 'hello');
    Tag.add(cluster, 'propTag', '123');

    // THEN
    expect(stack).to(haveResource('Custom::AWSCDK-EKS-FargateProfile', {
      Config: {
        selectors: [ { namespace: 'default' } ],
        clusterName: { Ref: "MyCluster8AD82BF8" },
        podExecutionRoleArn: { "Fn::GetAtt": [ "MyClusterfargateprofileMyProfilePodExecutionRole4795C054", "Arn" ] },
        tags: {
          propTag: "123",
          aspectTag: "hello"
        }
      }
    }));
    test.done();
  },

  'supports specifying vpc'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster');
    const vpc = ec2.Vpc.fromVpcAttributes(stack, 'MyVpc', {
      vpcId: 'vpc123',
      availabilityZones: [ 'az1' ],
      privateSubnetIds: [ 'priv1' ]
    });

    // WHEN
    cluster.addFargateProfile('MyProfile', {
      selectors: [ { namespace: 'default' } ],
      vpc
    });

    // THEN
    expect(stack).to(haveResource('Custom::AWSCDK-EKS-FargateProfile', {
      Config: {
        clusterName: { Ref: "MyCluster8AD82BF8" },
        podExecutionRoleArn: { "Fn::GetAtt": [ "MyClusterfargateprofileMyProfilePodExecutionRole4795C054", "Arn" ] },
        selectors: [ { namespace: "default" } ],
        subnets: [ "priv1" ]
      }
    }));
    test.done();
  },

  'fails if there are no selectors or if there are more than 5'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const cluster = new eks.Cluster(stack, 'MyCluster');

    // THEN
    test.throws(() => cluster.addFargateProfile('MyProfile', { selectors: [ ] }));
    test.throws(() => cluster.addFargateProfile('MyProfile', {
      selectors: [
        { namespace: '1' },
        { namespace: '2' },
        { namespace: '3' },
        { namespace: '4' },
        { namespace: '5' },
        { namespace: '6' },
      ]
    }));
    test.done();
  },

  'FargateCluster creates an EKS cluster fully managed by Fargate'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new eks.FargateCluster(stack, 'FargateCluster');

    // THEN
    expect(stack).to(haveResource('Custom::AWSCDK-EKS-KubernetesPatch', {
      ResourceName: "deployment/coredns",
      ResourceNamespace: "kube-system",
      ApplyPatchJson: "{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"eks.amazonaws.com/compute-type\":\"fargate\"}}}}}",
      RestorePatchJson: "{\"spec\":{\"template\":{\"metadata\":{\"annotations\":{\"eks.amazonaws.com/compute-type\":\"ec2\"}}}}}",
      ClusterName: {
        Ref: "FargateCluster019F03E8"
      },
    }));

    expect(stack).to(haveResource('Custom::AWSCDK-EKS-FargateProfile', {
      Config: {
        clusterName: {
          Ref: "FargateCluster019F03E8"
        },
        podExecutionRoleArn: {
          "Fn::GetAtt": [
            "FargateClusterfargateprofiledefaultPodExecutionRole66F2610E",
            "Arn"
          ]
        },
        selectors: [
          { namespace: "default" },
          { namespace: "kube-system" }
        ]
      }
    }));
    test.done();
  },

  'can create FargateCluster with a custom profile'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new eks.FargateCluster(stack, 'FargateCluster', {
      defaultProfile: {
        fargateProfileName: 'my-app', selectors: [{namespace: 'foo'}, {namespace: 'bar'}]
      }
    });

    // THEN
    expect(stack).to(haveResource('Custom::AWSCDK-EKS-FargateProfile', {
      Config: {
        clusterName: {
          Ref: "FargateCluster019F03E8"
        },
        fargateProfileName: "my-app",
        podExecutionRoleArn: {
          "Fn::GetAtt": [
            "FargateClusterfargateprofilemyappPodExecutionRole875B4635",
            "Arn"
          ]
        },
        selectors: [
          { namespace: "foo" },
          { namespace: "bar" }
        ]
      }
    }));
    test.done();
  },

  'custom profile name is "custom" if no custom profile name is provided'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new eks.FargateCluster(stack, 'FargateCluster', {
      defaultProfile: {
        selectors: [{namespace: 'foo'}, {namespace: 'bar'}]
      }
    });

    // THEN
    expect(stack).to(haveResource('Custom::AWSCDK-EKS-FargateProfile', {
      Config: {
        clusterName: {
          Ref: "FargateCluster019F03E8"
        },
        podExecutionRoleArn: {
          "Fn::GetAtt": [
            "FargateClusterfargateprofilecustomPodExecutionRoleDB415F19",
            "Arn"
          ]
        },
        selectors: [
          { namespace: "foo" },
          { namespace: "bar" }
        ]
      }
    }));
    test.done();
  }
};
