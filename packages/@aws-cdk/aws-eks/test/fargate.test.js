"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const core_1 = require("@aws-cdk/core");
const eks = require("../lib");
const CLUSTER_VERSION = eks.KubernetesVersion.V1_25;
describe('fargate', () => {
    test('can be added to a cluster', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const cluster = new eks.Cluster(stack, 'MyCluster', { version: CLUSTER_VERSION });
        // WHEN
        cluster.addFargateProfile('MyProfile', {
            selectors: [{ namespace: 'default' }],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-FargateProfile', {
            Config: {
                clusterName: { Ref: 'MyCluster8AD82BF8' },
                podExecutionRoleArn: { 'Fn::GetAtt': ['MyClusterfargateprofileMyProfilePodExecutionRole4795C054', 'Arn'] },
                selectors: [{ namespace: 'default' }],
            },
        });
    });
    test('supports specifying a profile name', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const cluster = new eks.Cluster(stack, 'MyCluster', { version: CLUSTER_VERSION });
        // WHEN
        cluster.addFargateProfile('MyProfile', {
            fargateProfileName: 'MyProfileName',
            selectors: [{ namespace: 'default' }],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-FargateProfile', {
            Config: {
                clusterName: { Ref: 'MyCluster8AD82BF8' },
                podExecutionRoleArn: { 'Fn::GetAtt': ['MyClusterfargateprofileMyProfilePodExecutionRole4795C054', 'Arn'] },
                selectors: [{ namespace: 'default' }],
                fargateProfileName: 'MyProfileName',
            },
        });
    });
    test('supports custom execution role', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const cluster = new eks.Cluster(stack, 'MyCluster', { version: CLUSTER_VERSION });
        const myRole = new iam.Role(stack, 'MyRole', { assumedBy: new iam.AnyPrincipal() });
        // WHEN
        cluster.addFargateProfile('MyProfile', {
            podExecutionRole: myRole,
            selectors: [{ namespace: 'default' }],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-FargateProfile', {
            Config: {
                clusterName: { Ref: 'MyCluster8AD82BF8' },
                podExecutionRoleArn: { 'Fn::GetAtt': ['MyRoleF48FFE04', 'Arn'] },
                selectors: [{ namespace: 'default' }],
            },
        });
    });
    test('supports tags through aspects', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const cluster = new eks.Cluster(stack, 'MyCluster', { version: CLUSTER_VERSION });
        // WHEN
        cluster.addFargateProfile('MyProfile', {
            selectors: [{ namespace: 'default' }],
        });
        core_1.Tags.of(stack).add('aspectTag', 'hello');
        core_1.Tags.of(cluster).add('propTag', '123');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-FargateProfile', {
            Config: {
                selectors: [{ namespace: 'default' }],
                clusterName: { Ref: 'MyCluster8AD82BF8' },
                podExecutionRoleArn: { 'Fn::GetAtt': ['MyClusterfargateprofileMyProfilePodExecutionRole4795C054', 'Arn'] },
                tags: {
                    propTag: '123',
                    aspectTag: 'hello',
                },
            },
        });
    });
    test('supports specifying vpc', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const cluster = new eks.Cluster(stack, 'MyCluster', { version: CLUSTER_VERSION });
        const vpc = ec2.Vpc.fromVpcAttributes(stack, 'MyVpc', {
            vpcId: 'vpc123',
            availabilityZones: ['az1'],
            privateSubnetIds: ['priv1'],
        });
        // WHEN
        cluster.addFargateProfile('MyProfile', {
            selectors: [{ namespace: 'default' }],
            vpc,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-FargateProfile', {
            Config: {
                clusterName: { Ref: 'MyCluster8AD82BF8' },
                podExecutionRoleArn: { 'Fn::GetAtt': ['MyClusterfargateprofileMyProfilePodExecutionRole4795C054', 'Arn'] },
                selectors: [{ namespace: 'default' }],
                subnets: ['priv1'],
            },
        });
    });
    test('fails if there are no selectors or if there are more than 5', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const cluster = new eks.Cluster(stack, 'MyCluster', { version: CLUSTER_VERSION });
        // THEN
        expect(() => cluster.addFargateProfile('MyProfile', { selectors: [] }));
        expect(() => cluster.addFargateProfile('MyProfile', {
            selectors: [
                { namespace: '1' },
                { namespace: '2' },
                { namespace: '3' },
                { namespace: '4' },
                { namespace: '5' },
                { namespace: '6' },
            ],
        }));
    });
    test('FargateCluster creates an EKS cluster fully managed by Fargate', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new eks.FargateCluster(stack, 'FargateCluster', { version: CLUSTER_VERSION });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-KubernetesPatch', {
            ResourceName: 'deployment/coredns',
            ResourceNamespace: 'kube-system',
            ApplyPatchJson: '{"spec":{"template":{"metadata":{"annotations":{"eks.amazonaws.com/compute-type":"fargate"}}}}}',
            RestorePatchJson: '{"spec":{"template":{"metadata":{"annotations":{"eks.amazonaws.com/compute-type":"ec2"}}}}}',
            ClusterName: {
                Ref: 'FargateCluster019F03E8',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-FargateProfile', {
            Config: {
                clusterName: {
                    Ref: 'FargateCluster019F03E8',
                },
                podExecutionRoleArn: {
                    'Fn::GetAtt': [
                        'FargateClusterfargateprofiledefaultPodExecutionRole66F2610E',
                        'Arn',
                    ],
                },
                selectors: [
                    { namespace: 'default' },
                    { namespace: 'kube-system' },
                ],
            },
        });
    });
    test('can create FargateCluster with a custom profile', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new eks.FargateCluster(stack, 'FargateCluster', {
            defaultProfile: {
                fargateProfileName: 'my-app', selectors: [{ namespace: 'foo' }, { namespace: 'bar' }],
            },
            version: CLUSTER_VERSION,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-FargateProfile', {
            Config: {
                clusterName: {
                    Ref: 'FargateCluster019F03E8',
                },
                fargateProfileName: 'my-app',
                podExecutionRoleArn: {
                    'Fn::GetAtt': [
                        'FargateClusterfargateprofilemyappPodExecutionRole875B4635',
                        'Arn',
                    ],
                },
                selectors: [
                    { namespace: 'foo' },
                    { namespace: 'bar' },
                ],
            },
        });
    });
    test('custom profile name is "custom" if no custom profile name is provided', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new eks.FargateCluster(stack, 'FargateCluster', {
            defaultProfile: {
                selectors: [{ namespace: 'foo' }, { namespace: 'bar' }],
            },
            version: CLUSTER_VERSION,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-FargateProfile', {
            Config: {
                clusterName: {
                    Ref: 'FargateCluster019F03E8',
                },
                podExecutionRoleArn: {
                    'Fn::GetAtt': [
                        'FargateClusterfargateprofilecustomPodExecutionRoleDB415F19',
                        'Arn',
                    ],
                },
                selectors: [
                    { namespace: 'foo' },
                    { namespace: 'bar' },
                ],
            },
        });
    });
    test('multiple Fargate profiles added to a cluster are processed sequentially', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const cluster = new eks.Cluster(stack, 'MyCluster', { version: CLUSTER_VERSION });
        // WHEN
        cluster.addFargateProfile('MyProfile1', {
            selectors: [{ namespace: 'namespace1' }],
        });
        cluster.addFargateProfile('MyProfile2', {
            selectors: [{ namespace: 'namespace2' }],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-FargateProfile', {
            Config: {
                clusterName: { Ref: 'MyCluster8AD82BF8' },
                podExecutionRoleArn: { 'Fn::GetAtt': ['MyClusterfargateprofileMyProfile1PodExecutionRole794E9E37', 'Arn'] },
                selectors: [{ namespace: 'namespace1' }],
            },
        });
        assertions_1.Template.fromStack(stack).hasResource('Custom::AWSCDK-EKS-FargateProfile', {
            Properties: {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'awscdkawseksClusterResourceProviderNestedStackawscdkawseksClusterResourceProviderNestedStackResource9827C454',
                        'Outputs.awscdkawseksClusterResourceProviderframeworkonEventEA97AA31Arn',
                    ],
                },
                AssumeRoleArn: { 'Fn::GetAtt': ['MyClusterCreationRoleB5FA4FF3', 'Arn'] },
                Config: {
                    clusterName: { Ref: 'MyCluster8AD82BF8' },
                    podExecutionRoleArn: { 'Fn::GetAtt': ['MyClusterfargateprofileMyProfile2PodExecutionRoleD1151CCF', 'Arn'] },
                    selectors: [{ namespace: 'namespace2' }],
                },
            },
            DependsOn: [
                'MyClusterfargateprofileMyProfile1PodExecutionRole794E9E37',
                'MyClusterfargateprofileMyProfile1879D501A',
            ],
        });
    });
    test('fargate role is added to RBAC', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new eks.FargateCluster(stack, 'FargateCluster', { version: CLUSTER_VERSION });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-KubernetesResource', {
            Manifest: {
                'Fn::Join': [
                    '',
                    [
                        '[{"apiVersion":"v1","kind":"ConfigMap","metadata":{"name":"aws-auth","namespace":"kube-system","labels":{"aws.cdk.eks/prune-c858eb9c291620a59a3334f61f9b8a259e9786af60":""}},"data":{"mapRoles":"[{\\"rolearn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'FargateClusterMastersRole50BAF9FD',
                                'Arn',
                            ],
                        },
                        '\\",\\"username\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'FargateClusterMastersRole50BAF9FD',
                                'Arn',
                            ],
                        },
                        '\\",\\"groups\\":[\\"system:masters\\"]},{\\"rolearn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'FargateClusterfargateprofiledefaultPodExecutionRole66F2610E',
                                'Arn',
                            ],
                        },
                        '\\",\\"username\\":\\"system:node:{{SessionName}}\\",\\"groups\\":[\\"system:bootstrappers\\",\\"system:nodes\\",\\"system:node-proxier\\"]}]","mapUsers":"[]","mapAccounts":"[]"}}]',
                    ],
                ],
            },
        });
    });
    test('allow cluster creation role to iam:PassRole on fargate pod execution role', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new eks.FargateCluster(stack, 'FargateCluster', { version: CLUSTER_VERSION });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'iam:PassRole',
                        Effect: 'Allow',
                        Resource: {
                            'Fn::GetAtt': [
                                'FargateClusterRole8E36B33A',
                                'Arn',
                            ],
                        },
                    },
                    {
                        Action: [
                            'eks:CreateCluster',
                            'eks:DescribeCluster',
                            'eks:DescribeUpdate',
                            'eks:DeleteCluster',
                            'eks:UpdateClusterVersion',
                            'eks:UpdateClusterConfig',
                            'eks:CreateFargateProfile',
                            'eks:TagResource',
                            'eks:UntagResource',
                        ],
                        Effect: 'Allow',
                        Resource: [
                            '*',
                        ],
                    },
                    {
                        Action: [
                            'eks:DescribeFargateProfile',
                            'eks:DeleteFargateProfile',
                        ],
                        Effect: 'Allow',
                        Resource: '*',
                    },
                    {
                        Action: ['iam:GetRole', 'iam:listAttachedRolePolicies'],
                        Effect: 'Allow',
                        Resource: '*',
                    },
                    {
                        Action: 'iam:CreateServiceLinkedRole',
                        Effect: 'Allow',
                        Resource: '*',
                    },
                    {
                        Action: [
                            'ec2:DescribeInstances',
                            'ec2:DescribeNetworkInterfaces',
                            'ec2:DescribeSecurityGroups',
                            'ec2:DescribeSubnets',
                            'ec2:DescribeRouteTables',
                            'ec2:DescribeDhcpOptions',
                            'ec2:DescribeVpcs',
                        ],
                        Effect: 'Allow',
                        Resource: '*',
                    },
                    {
                        Action: 'iam:PassRole',
                        Effect: 'Allow',
                        Resource: {
                            'Fn::GetAtt': [
                                'FargateClusterfargateprofiledefaultPodExecutionRole66F2610E',
                                'Arn',
                            ],
                        },
                    },
                ],
            },
        });
    });
    test('supports passing secretsEncryptionKey with FargateCluster', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new eks.FargateCluster(stack, 'FargateCluster', {
            version: CLUSTER_VERSION,
            secretsEncryptionKey: new kms.Key(stack, 'Key'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-Cluster', {
            Config: {
                encryptionConfig: [{
                        provider: {
                            keyArn: {
                                'Fn::GetAtt': [
                                    'Key961B73FD',
                                    'Arn',
                                ],
                            },
                        },
                        resources: ['secrets'],
                    }],
            },
        });
    });
    test('supports cluster logging with FargateCluster', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new eks.FargateCluster(stack, 'FargateCluster', {
            version: CLUSTER_VERSION,
            clusterLogging: [
                eks.ClusterLoggingTypes.API,
                eks.ClusterLoggingTypes.AUTHENTICATOR,
                eks.ClusterLoggingTypes.SCHEDULER,
            ],
        });
        //THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWSCDK-EKS-Cluster', {
            Config: {
                logging: {
                    clusterLogging: [
                        { enabled: true, types: ['api', 'authenticator', 'scheduler'] },
                    ],
                },
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFyZ2F0ZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmFyZ2F0ZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLHdDQUE0QztBQUM1Qyw4QkFBOEI7QUFFOUIsTUFBTSxlQUFlLEdBQUcsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQztBQUVwRCxRQUFRLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtJQUN2QixJQUFJLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFO1FBQ3JDLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBQzFCLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUM7UUFFbEYsT0FBTztRQUNQLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUU7WUFDckMsU0FBUyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLENBQUM7U0FDdEMsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLG1DQUFtQyxFQUFFO1lBQ25GLE1BQU0sRUFBRTtnQkFDTixXQUFXLEVBQUUsRUFBRSxHQUFHLEVBQUUsbUJBQW1CLEVBQUU7Z0JBQ3pDLG1CQUFtQixFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsMERBQTBELEVBQUUsS0FBSyxDQUFDLEVBQUU7Z0JBQzFHLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxDQUFDO2FBQ3RDO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsb0NBQW9DLEVBQUUs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RTtnQkFDTixnQkFBZ0IsRUFBRSxDQUFDO3dCQUNqQixRQUFRLEVBQUU7NEJBQ1IsTUFBTSxFQUFFO2dDQUNOLFlBQVksRUFBRTtvQ0FDWixhQUFhO29DQUNiLEtBQUs7aUNBQ047NkJBQ0Y7eUJBQ0Y7d0JBQ0QsU0FBUyxFQUFFLENBQUMsU0FBUyxDQUFDO3FCQUN2QixDQUFDO2FBQ0g7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw4Q0FBOEMsRUFBRSxHQUFHLEVBQUU7UUFDeEQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUVQLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7WUFDOUMsT0FBTyxFQUFFLGVBQWU7WUFDeEIsY0FBYyxFQUFFO2dCQUNkLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHO2dCQUMzQixHQUFHLENBQUMsbUJBQW1CLENBQUMsYUFBYTtnQkFDckMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLFNBQVM7YUFDbEM7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNO1FBQ04scUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsNEJBQTRCLEVBQUU7WUFDNUUsTUFBTSxFQUFFO2dCQUNOLE9BQU8sRUFBRTtvQkFDUCxjQUFjLEVBQUU7d0JBQ2QsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsV0FBVyxDQUFDLEVBQUU7cUJBQ2hFO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdAYXdzLWNkay9hd3Mta21zJztcbmltcG9ydCB7IFN0YWNrLCBUYWdzIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBla3MgZnJvbSAnLi4vbGliJztcblxuY29uc3QgQ0xVU1RFUl9WRVJTSU9OID0gZWtzLkt1YmVybmV0ZXNWZXJzaW9uLlYxXzI1O1xuXG5kZXNjcmliZSgnZmFyZ2F0ZScsICgpID0+IHtcbiAgdGVzdCgnY2FuIGJlIGFkZGVkIHRvIGEgY2x1c3RlcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ015Q2x1c3RlcicsIHsgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNsdXN0ZXIuYWRkRmFyZ2F0ZVByb2ZpbGUoJ015UHJvZmlsZScsIHtcbiAgICAgIHNlbGVjdG9yczogW3sgbmFtZXNwYWNlOiAnZGVmYXVsdCcgfV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6QVdTQ0RLLUVLUy1GYXJnYXRlUHJvZmlsZScsIHtcbiAgICAgIENvbmZpZzoge1xuICAgICAgICBjbHVzdGVyTmFtZTogeyBSZWY6ICdNeUNsdXN0ZXI4QUQ4MkJGOCcgfSxcbiAgICAgICAgcG9kRXhlY3V0aW9uUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnTXlDbHVzdGVyZmFyZ2F0ZXByb2ZpbGVNeVByb2ZpbGVQb2RFeGVjdXRpb25Sb2xlNDc5NUMwNTQnLCAnQXJuJ10gfSxcbiAgICAgICAgc2VsZWN0b3JzOiBbeyBuYW1lc3BhY2U6ICdkZWZhdWx0JyB9XSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N1cHBvcnRzIHNwZWNpZnlpbmcgYSBwcm9maWxlIG5hbWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdNeUNsdXN0ZXInLCB7IHZlcnNpb246IENMVVNURVJfVkVSU0lPTiB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjbHVzdGVyLmFkZEZhcmdhdGVQcm9maWxlKCdNeVByb2ZpbGUnLCB7XG4gICAgICBmYXJnYXRlUHJvZmlsZU5hbWU6ICdNeVByb2ZpbGVOYW1lJyxcbiAgICAgIHNlbGVjdG9yczogW3sgbmFtZXNwYWNlOiAnZGVmYXVsdCcgfV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6QVdTQ0RLLUVLUy1GYXJnYXRlUHJvZmlsZScsIHtcbiAgICAgIENvbmZpZzoge1xuICAgICAgICBjbHVzdGVyTmFtZTogeyBSZWY6ICdNeUNsdXN0ZXI4QUQ4MkJGOCcgfSxcbiAgICAgICAgcG9kRXhlY3V0aW9uUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnTXlDbHVzdGVyZmFyZ2F0ZXByb2ZpbGVNeVByb2ZpbGVQb2RFeGVjdXRpb25Sb2xlNDc5NUMwNTQnLCAnQXJuJ10gfSxcbiAgICAgICAgc2VsZWN0b3JzOiBbeyBuYW1lc3BhY2U6ICdkZWZhdWx0JyB9XSxcbiAgICAgICAgZmFyZ2F0ZVByb2ZpbGVOYW1lOiAnTXlQcm9maWxlTmFtZScsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzdXBwb3J0cyBjdXN0b20gZXhlY3V0aW9uIHJvbGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdNeUNsdXN0ZXInLCB7IHZlcnNpb246IENMVVNURVJfVkVSU0lPTiB9KTtcbiAgICBjb25zdCBteVJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdNeVJvbGUnLCB7IGFzc3VtZWRCeTogbmV3IGlhbS5BbnlQcmluY2lwYWwoKSB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjbHVzdGVyLmFkZEZhcmdhdGVQcm9maWxlKCdNeVByb2ZpbGUnLCB7XG4gICAgICBwb2RFeGVjdXRpb25Sb2xlOiBteVJvbGUsXG4gICAgICBzZWxlY3RvcnM6IFt7IG5hbWVzcGFjZTogJ2RlZmF1bHQnIH1dLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkFXU0NESy1FS1MtRmFyZ2F0ZVByb2ZpbGUnLCB7XG4gICAgICBDb25maWc6IHtcbiAgICAgICAgY2x1c3Rlck5hbWU6IHsgUmVmOiAnTXlDbHVzdGVyOEFEODJCRjgnIH0sXG4gICAgICAgIHBvZEV4ZWN1dGlvblJvbGVBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ015Um9sZUY0OEZGRTA0JywgJ0FybiddIH0sXG4gICAgICAgIHNlbGVjdG9yczogW3sgbmFtZXNwYWNlOiAnZGVmYXVsdCcgfV0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzdXBwb3J0cyB0YWdzIHRocm91Z2ggYXNwZWN0cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ015Q2x1c3RlcicsIHsgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNsdXN0ZXIuYWRkRmFyZ2F0ZVByb2ZpbGUoJ015UHJvZmlsZScsIHtcbiAgICAgIHNlbGVjdG9yczogW3sgbmFtZXNwYWNlOiAnZGVmYXVsdCcgfV0sXG4gICAgfSk7XG5cbiAgICBUYWdzLm9mKHN0YWNrKS5hZGQoJ2FzcGVjdFRhZycsICdoZWxsbycpO1xuICAgIFRhZ3Mub2YoY2x1c3RlcikuYWRkKCdwcm9wVGFnJywgJzEyMycpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkFXU0NESy1FS1MtRmFyZ2F0ZVByb2ZpbGUnLCB7XG4gICAgICBDb25maWc6IHtcbiAgICAgICAgc2VsZWN0b3JzOiBbeyBuYW1lc3BhY2U6ICdkZWZhdWx0JyB9XSxcbiAgICAgICAgY2x1c3Rlck5hbWU6IHsgUmVmOiAnTXlDbHVzdGVyOEFEODJCRjgnIH0sXG4gICAgICAgIHBvZEV4ZWN1dGlvblJvbGVBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ015Q2x1c3RlcmZhcmdhdGVwcm9maWxlTXlQcm9maWxlUG9kRXhlY3V0aW9uUm9sZTQ3OTVDMDU0JywgJ0FybiddIH0sXG4gICAgICAgIHRhZ3M6IHtcbiAgICAgICAgICBwcm9wVGFnOiAnMTIzJyxcbiAgICAgICAgICBhc3BlY3RUYWc6ICdoZWxsbycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzdXBwb3J0cyBzcGVjaWZ5aW5nIHZwYycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBla3MuQ2x1c3RlcihzdGFjaywgJ015Q2x1c3RlcicsIHsgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OIH0pO1xuICAgIGNvbnN0IHZwYyA9IGVjMi5WcGMuZnJvbVZwY0F0dHJpYnV0ZXMoc3RhY2ssICdNeVZwYycsIHtcbiAgICAgIHZwY0lkOiAndnBjMTIzJyxcbiAgICAgIGF2YWlsYWJpbGl0eVpvbmVzOiBbJ2F6MSddLFxuICAgICAgcHJpdmF0ZVN1Ym5ldElkczogWydwcml2MSddLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNsdXN0ZXIuYWRkRmFyZ2F0ZVByb2ZpbGUoJ015UHJvZmlsZScsIHtcbiAgICAgIHNlbGVjdG9yczogW3sgbmFtZXNwYWNlOiAnZGVmYXVsdCcgfV0sXG4gICAgICB2cGMsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6QVdTQ0RLLUVLUy1GYXJnYXRlUHJvZmlsZScsIHtcbiAgICAgIENvbmZpZzoge1xuICAgICAgICBjbHVzdGVyTmFtZTogeyBSZWY6ICdNeUNsdXN0ZXI4QUQ4MkJGOCcgfSxcbiAgICAgICAgcG9kRXhlY3V0aW9uUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnTXlDbHVzdGVyZmFyZ2F0ZXByb2ZpbGVNeVByb2ZpbGVQb2RFeGVjdXRpb25Sb2xlNDc5NUMwNTQnLCAnQXJuJ10gfSxcbiAgICAgICAgc2VsZWN0b3JzOiBbeyBuYW1lc3BhY2U6ICdkZWZhdWx0JyB9XSxcbiAgICAgICAgc3VibmV0czogWydwcml2MSddLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgaWYgdGhlcmUgYXJlIG5vIHNlbGVjdG9ycyBvciBpZiB0aGVyZSBhcmUgbW9yZSB0aGFuIDUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIoc3RhY2ssICdNeUNsdXN0ZXInLCB7IHZlcnNpb246IENMVVNURVJfVkVSU0lPTiB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gY2x1c3Rlci5hZGRGYXJnYXRlUHJvZmlsZSgnTXlQcm9maWxlJywgeyBzZWxlY3RvcnM6IFtdIH0pKTtcbiAgICBleHBlY3QoKCkgPT4gY2x1c3Rlci5hZGRGYXJnYXRlUHJvZmlsZSgnTXlQcm9maWxlJywge1xuICAgICAgc2VsZWN0b3JzOiBbXG4gICAgICAgIHsgbmFtZXNwYWNlOiAnMScgfSxcbiAgICAgICAgeyBuYW1lc3BhY2U6ICcyJyB9LFxuICAgICAgICB7IG5hbWVzcGFjZTogJzMnIH0sXG4gICAgICAgIHsgbmFtZXNwYWNlOiAnNCcgfSxcbiAgICAgICAgeyBuYW1lc3BhY2U6ICc1JyB9LFxuICAgICAgICB7IG5hbWVzcGFjZTogJzYnIH0sXG4gICAgICBdLFxuICAgIH0pKTtcbiAgfSk7XG5cbiAgdGVzdCgnRmFyZ2F0ZUNsdXN0ZXIgY3JlYXRlcyBhbiBFS1MgY2x1c3RlciBmdWxseSBtYW5hZ2VkIGJ5IEZhcmdhdGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBla3MuRmFyZ2F0ZUNsdXN0ZXIoc3RhY2ssICdGYXJnYXRlQ2x1c3RlcicsIHsgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkFXU0NESy1FS1MtS3ViZXJuZXRlc1BhdGNoJywge1xuICAgICAgUmVzb3VyY2VOYW1lOiAnZGVwbG95bWVudC9jb3JlZG5zJyxcbiAgICAgIFJlc291cmNlTmFtZXNwYWNlOiAna3ViZS1zeXN0ZW0nLFxuICAgICAgQXBwbHlQYXRjaEpzb246ICd7XCJzcGVjXCI6e1widGVtcGxhdGVcIjp7XCJtZXRhZGF0YVwiOntcImFubm90YXRpb25zXCI6e1wiZWtzLmFtYXpvbmF3cy5jb20vY29tcHV0ZS10eXBlXCI6XCJmYXJnYXRlXCJ9fX19fScsXG4gICAgICBSZXN0b3JlUGF0Y2hKc29uOiAne1wic3BlY1wiOntcInRlbXBsYXRlXCI6e1wibWV0YWRhdGFcIjp7XCJhbm5vdGF0aW9uc1wiOntcImVrcy5hbWF6b25hd3MuY29tL2NvbXB1dGUtdHlwZVwiOlwiZWMyXCJ9fX19fScsXG4gICAgICBDbHVzdGVyTmFtZToge1xuICAgICAgICBSZWY6ICdGYXJnYXRlQ2x1c3RlcjAxOUYwM0U4JyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpBV1NDREstRUtTLUZhcmdhdGVQcm9maWxlJywge1xuICAgICAgQ29uZmlnOiB7XG4gICAgICAgIGNsdXN0ZXJOYW1lOiB7XG4gICAgICAgICAgUmVmOiAnRmFyZ2F0ZUNsdXN0ZXIwMTlGMDNFOCcsXG4gICAgICAgIH0sXG4gICAgICAgIHBvZEV4ZWN1dGlvblJvbGVBcm46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdGYXJnYXRlQ2x1c3RlcmZhcmdhdGVwcm9maWxlZGVmYXVsdFBvZEV4ZWN1dGlvblJvbGU2NkYyNjEwRScsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBzZWxlY3RvcnM6IFtcbiAgICAgICAgICB7IG5hbWVzcGFjZTogJ2RlZmF1bHQnIH0sXG4gICAgICAgICAgeyBuYW1lc3BhY2U6ICdrdWJlLXN5c3RlbScgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBjcmVhdGUgRmFyZ2F0ZUNsdXN0ZXIgd2l0aCBhIGN1c3RvbSBwcm9maWxlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWtzLkZhcmdhdGVDbHVzdGVyKHN0YWNrLCAnRmFyZ2F0ZUNsdXN0ZXInLCB7XG4gICAgICBkZWZhdWx0UHJvZmlsZToge1xuICAgICAgICBmYXJnYXRlUHJvZmlsZU5hbWU6ICdteS1hcHAnLCBzZWxlY3RvcnM6IFt7IG5hbWVzcGFjZTogJ2ZvbycgfSwgeyBuYW1lc3BhY2U6ICdiYXInIH1dLFxuICAgICAgfSxcbiAgICAgIHZlcnNpb246IENMVVNURVJfVkVSU0lPTixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpBV1NDREstRUtTLUZhcmdhdGVQcm9maWxlJywge1xuICAgICAgQ29uZmlnOiB7XG4gICAgICAgIGNsdXN0ZXJOYW1lOiB7XG4gICAgICAgICAgUmVmOiAnRmFyZ2F0ZUNsdXN0ZXIwMTlGMDNFOCcsXG4gICAgICAgIH0sXG4gICAgICAgIGZhcmdhdGVQcm9maWxlTmFtZTogJ215LWFwcCcsXG4gICAgICAgIHBvZEV4ZWN1dGlvblJvbGVBcm46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdGYXJnYXRlQ2x1c3RlcmZhcmdhdGVwcm9maWxlbXlhcHBQb2RFeGVjdXRpb25Sb2xlODc1QjQ2MzUnLFxuICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgc2VsZWN0b3JzOiBbXG4gICAgICAgICAgeyBuYW1lc3BhY2U6ICdmb28nIH0sXG4gICAgICAgICAgeyBuYW1lc3BhY2U6ICdiYXInIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjdXN0b20gcHJvZmlsZSBuYW1lIGlzIFwiY3VzdG9tXCIgaWYgbm8gY3VzdG9tIHByb2ZpbGUgbmFtZSBpcyBwcm92aWRlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVrcy5GYXJnYXRlQ2x1c3RlcihzdGFjaywgJ0ZhcmdhdGVDbHVzdGVyJywge1xuICAgICAgZGVmYXVsdFByb2ZpbGU6IHtcbiAgICAgICAgc2VsZWN0b3JzOiBbeyBuYW1lc3BhY2U6ICdmb28nIH0sIHsgbmFtZXNwYWNlOiAnYmFyJyB9XSxcbiAgICAgIH0sXG4gICAgICB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6QVdTQ0RLLUVLUy1GYXJnYXRlUHJvZmlsZScsIHtcbiAgICAgIENvbmZpZzoge1xuICAgICAgICBjbHVzdGVyTmFtZToge1xuICAgICAgICAgIFJlZjogJ0ZhcmdhdGVDbHVzdGVyMDE5RjAzRTgnLFxuICAgICAgICB9LFxuICAgICAgICBwb2RFeGVjdXRpb25Sb2xlQXJuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnRmFyZ2F0ZUNsdXN0ZXJmYXJnYXRlcHJvZmlsZWN1c3RvbVBvZEV4ZWN1dGlvblJvbGVEQjQxNUYxOScsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBzZWxlY3RvcnM6IFtcbiAgICAgICAgICB7IG5hbWVzcGFjZTogJ2ZvbycgfSxcbiAgICAgICAgICB7IG5hbWVzcGFjZTogJ2JhcicgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ211bHRpcGxlIEZhcmdhdGUgcHJvZmlsZXMgYWRkZWQgdG8gYSBjbHVzdGVyIGFyZSBwcm9jZXNzZWQgc2VxdWVudGlhbGx5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHN0YWNrLCAnTXlDbHVzdGVyJywgeyB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04gfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY2x1c3Rlci5hZGRGYXJnYXRlUHJvZmlsZSgnTXlQcm9maWxlMScsIHtcbiAgICAgIHNlbGVjdG9yczogW3sgbmFtZXNwYWNlOiAnbmFtZXNwYWNlMScgfV0sXG4gICAgfSk7XG4gICAgY2x1c3Rlci5hZGRGYXJnYXRlUHJvZmlsZSgnTXlQcm9maWxlMicsIHtcbiAgICAgIHNlbGVjdG9yczogW3sgbmFtZXNwYWNlOiAnbmFtZXNwYWNlMicgfV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6QVdTQ0RLLUVLUy1GYXJnYXRlUHJvZmlsZScsIHtcbiAgICAgIENvbmZpZzoge1xuICAgICAgICBjbHVzdGVyTmFtZTogeyBSZWY6ICdNeUNsdXN0ZXI4QUQ4MkJGOCcgfSxcbiAgICAgICAgcG9kRXhlY3V0aW9uUm9sZUFybjogeyAnRm46OkdldEF0dCc6IFsnTXlDbHVzdGVyZmFyZ2F0ZXByb2ZpbGVNeVByb2ZpbGUxUG9kRXhlY3V0aW9uUm9sZTc5NEU5RTM3JywgJ0FybiddIH0sXG4gICAgICAgIHNlbGVjdG9yczogW3sgbmFtZXNwYWNlOiAnbmFtZXNwYWNlMScgfV0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0N1c3RvbTo6QVdTQ0RLLUVLUy1GYXJnYXRlUHJvZmlsZScsIHtcbiAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgU2VydmljZVRva2VuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnYXdzY2RrYXdzZWtzQ2x1c3RlclJlc291cmNlUHJvdmlkZXJOZXN0ZWRTdGFja2F3c2Nka2F3c2Vrc0NsdXN0ZXJSZXNvdXJjZVByb3ZpZGVyTmVzdGVkU3RhY2tSZXNvdXJjZTk4MjdDNDU0JyxcbiAgICAgICAgICAgICdPdXRwdXRzLmF3c2Nka2F3c2Vrc0NsdXN0ZXJSZXNvdXJjZVByb3ZpZGVyZnJhbWV3b3Jrb25FdmVudEVBOTdBQTMxQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBBc3N1bWVSb2xlQXJuOiB7ICdGbjo6R2V0QXR0JzogWydNeUNsdXN0ZXJDcmVhdGlvblJvbGVCNUZBNEZGMycsICdBcm4nXSB9LFxuICAgICAgICBDb25maWc6IHtcbiAgICAgICAgICBjbHVzdGVyTmFtZTogeyBSZWY6ICdNeUNsdXN0ZXI4QUQ4MkJGOCcgfSxcbiAgICAgICAgICBwb2RFeGVjdXRpb25Sb2xlQXJuOiB7ICdGbjo6R2V0QXR0JzogWydNeUNsdXN0ZXJmYXJnYXRlcHJvZmlsZU15UHJvZmlsZTJQb2RFeGVjdXRpb25Sb2xlRDExNTFDQ0YnLCAnQXJuJ10gfSxcbiAgICAgICAgICBzZWxlY3RvcnM6IFt7IG5hbWVzcGFjZTogJ25hbWVzcGFjZTInIH1dLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIERlcGVuZHNPbjogW1xuICAgICAgICAnTXlDbHVzdGVyZmFyZ2F0ZXByb2ZpbGVNeVByb2ZpbGUxUG9kRXhlY3V0aW9uUm9sZTc5NEU5RTM3JyxcbiAgICAgICAgJ015Q2x1c3RlcmZhcmdhdGVwcm9maWxlTXlQcm9maWxlMTg3OUQ1MDFBJyxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhcmdhdGUgcm9sZSBpcyBhZGRlZCB0byBSQkFDJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgZWtzLkZhcmdhdGVDbHVzdGVyKHN0YWNrLCAnRmFyZ2F0ZUNsdXN0ZXInLCB7IHZlcnNpb246IENMVVNURVJfVkVSU0lPTiB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpBV1NDREstRUtTLUt1YmVybmV0ZXNSZXNvdXJjZScsIHtcbiAgICAgIE1hbmlmZXN0OiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnW3tcImFwaVZlcnNpb25cIjpcInYxXCIsXCJraW5kXCI6XCJDb25maWdNYXBcIixcIm1ldGFkYXRhXCI6e1wibmFtZVwiOlwiYXdzLWF1dGhcIixcIm5hbWVzcGFjZVwiOlwia3ViZS1zeXN0ZW1cIixcImxhYmVsc1wiOntcImF3cy5jZGsuZWtzL3BydW5lLWM4NThlYjljMjkxNjIwYTU5YTMzMzRmNjFmOWI4YTI1OWU5Nzg2YWY2MFwiOlwiXCJ9fSxcImRhdGFcIjp7XCJtYXBSb2xlc1wiOlwiW3tcXFxcXCJyb2xlYXJuXFxcXFwiOlxcXFxcIicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdGYXJnYXRlQ2x1c3Rlck1hc3RlcnNSb2xlNTBCQUY5RkQnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdcXFxcXCIsXFxcXFwidXNlcm5hbWVcXFxcXCI6XFxcXFwiJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0ZhcmdhdGVDbHVzdGVyTWFzdGVyc1JvbGU1MEJBRjlGRCcsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1xcXFxcIixcXFxcXCJncm91cHNcXFxcXCI6W1xcXFxcInN5c3RlbTptYXN0ZXJzXFxcXFwiXX0se1xcXFxcInJvbGVhcm5cXFxcXCI6XFxcXFwiJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0ZhcmdhdGVDbHVzdGVyZmFyZ2F0ZXByb2ZpbGVkZWZhdWx0UG9kRXhlY3V0aW9uUm9sZTY2RjI2MTBFJyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnXFxcXFwiLFxcXFxcInVzZXJuYW1lXFxcXFwiOlxcXFxcInN5c3RlbTpub2RlOnt7U2Vzc2lvbk5hbWV9fVxcXFxcIixcXFxcXCJncm91cHNcXFxcXCI6W1xcXFxcInN5c3RlbTpib290c3RyYXBwZXJzXFxcXFwiLFxcXFxcInN5c3RlbTpub2Rlc1xcXFxcIixcXFxcXCJzeXN0ZW06bm9kZS1wcm94aWVyXFxcXFwiXX1dXCIsXCJtYXBVc2Vyc1wiOlwiW11cIixcIm1hcEFjY291bnRzXCI6XCJbXVwifX1dJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWxsb3cgY2x1c3RlciBjcmVhdGlvbiByb2xlIHRvIGlhbTpQYXNzUm9sZSBvbiBmYXJnYXRlIHBvZCBleGVjdXRpb24gcm9sZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVrcy5GYXJnYXRlQ2x1c3RlcihzdGFjaywgJ0ZhcmdhdGVDbHVzdGVyJywgeyB2ZXJzaW9uOiBDTFVTVEVSX1ZFUlNJT04gfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdpYW06UGFzc1JvbGUnLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0ZhcmdhdGVDbHVzdGVyUm9sZThFMzZCMzNBJyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgJ2VrczpDcmVhdGVDbHVzdGVyJyxcbiAgICAgICAgICAgICAgJ2VrczpEZXNjcmliZUNsdXN0ZXInLFxuICAgICAgICAgICAgICAnZWtzOkRlc2NyaWJlVXBkYXRlJyxcbiAgICAgICAgICAgICAgJ2VrczpEZWxldGVDbHVzdGVyJyxcbiAgICAgICAgICAgICAgJ2VrczpVcGRhdGVDbHVzdGVyVmVyc2lvbicsXG4gICAgICAgICAgICAgICdla3M6VXBkYXRlQ2x1c3RlckNvbmZpZycsXG4gICAgICAgICAgICAgICdla3M6Q3JlYXRlRmFyZ2F0ZVByb2ZpbGUnLFxuICAgICAgICAgICAgICAnZWtzOlRhZ1Jlc291cmNlJyxcbiAgICAgICAgICAgICAgJ2VrczpVbnRhZ1Jlc291cmNlJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZTogW1xuICAgICAgICAgICAgICAnKicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICdla3M6RGVzY3JpYmVGYXJnYXRlUHJvZmlsZScsXG4gICAgICAgICAgICAgICdla3M6RGVsZXRlRmFyZ2F0ZVByb2ZpbGUnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IFsnaWFtOkdldFJvbGUnLCAnaWFtOmxpc3RBdHRhY2hlZFJvbGVQb2xpY2llcyddLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ2lhbTpDcmVhdGVTZXJ2aWNlTGlua2VkUm9sZScsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICdlYzI6RGVzY3JpYmVJbnN0YW5jZXMnLFxuICAgICAgICAgICAgICAnZWMyOkRlc2NyaWJlTmV0d29ya0ludGVyZmFjZXMnLFxuICAgICAgICAgICAgICAnZWMyOkRlc2NyaWJlU2VjdXJpdHlHcm91cHMnLFxuICAgICAgICAgICAgICAnZWMyOkRlc2NyaWJlU3VibmV0cycsXG4gICAgICAgICAgICAgICdlYzI6RGVzY3JpYmVSb3V0ZVRhYmxlcycsXG4gICAgICAgICAgICAgICdlYzI6RGVzY3JpYmVEaGNwT3B0aW9ucycsXG4gICAgICAgICAgICAgICdlYzI6RGVzY3JpYmVWcGNzJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnaWFtOlBhc3NSb2xlJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdGYXJnYXRlQ2x1c3RlcmZhcmdhdGVwcm9maWxlZGVmYXVsdFBvZEV4ZWN1dGlvblJvbGU2NkYyNjEwRScsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzdXBwb3J0cyBwYXNzaW5nIHNlY3JldHNFbmNyeXB0aW9uS2V5IHdpdGggRmFyZ2F0ZUNsdXN0ZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuXG4gICAgbmV3IGVrcy5GYXJnYXRlQ2x1c3RlcihzdGFjaywgJ0ZhcmdhdGVDbHVzdGVyJywge1xuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgc2VjcmV0c0VuY3J5cHRpb25LZXk6IG5ldyBrbXMuS2V5KHN0YWNrLCAnS2V5JyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6QVdTQ0RLLUVLUy1DbHVzdGVyJywge1xuICAgICAgQ29uZmlnOiB7XG4gICAgICAgIGVuY3J5cHRpb25Db25maWc6IFt7XG4gICAgICAgICAgcHJvdmlkZXI6IHtcbiAgICAgICAgICAgIGtleUFybjoge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnS2V5OTYxQjczRkQnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJlc291cmNlczogWydzZWNyZXRzJ10sXG4gICAgICAgIH1dLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc3VwcG9ydHMgY2x1c3RlciBsb2dnaW5nIHdpdGggRmFyZ2F0ZUNsdXN0ZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuXG4gICAgbmV3IGVrcy5GYXJnYXRlQ2x1c3RlcihzdGFjaywgJ0ZhcmdhdGVDbHVzdGVyJywge1xuICAgICAgdmVyc2lvbjogQ0xVU1RFUl9WRVJTSU9OLFxuICAgICAgY2x1c3RlckxvZ2dpbmc6IFtcbiAgICAgICAgZWtzLkNsdXN0ZXJMb2dnaW5nVHlwZXMuQVBJLFxuICAgICAgICBla3MuQ2x1c3RlckxvZ2dpbmdUeXBlcy5BVVRIRU5USUNBVE9SLFxuICAgICAgICBla3MuQ2x1c3RlckxvZ2dpbmdUeXBlcy5TQ0hFRFVMRVIsXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy9USEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6QVdTQ0RLLUVLUy1DbHVzdGVyJywge1xuICAgICAgQ29uZmlnOiB7XG4gICAgICAgIGxvZ2dpbmc6IHtcbiAgICAgICAgICBjbHVzdGVyTG9nZ2luZzogW1xuICAgICAgICAgICAgeyBlbmFibGVkOiB0cnVlLCB0eXBlczogWydhcGknLCAnYXV0aGVudGljYXRvcicsICdzY2hlZHVsZXInXSB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19