"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("aws-cdk-lib/assertions");
const iam = require("aws-cdk-lib/aws-iam");
const util_1 = require("./util");
const eks = require("../lib");
describe('service account', () => {
    describe('add Service Account', () => {
        test('defaults should have default namespace and lowercase unique id', () => {
            // GIVEN
            const { stack, cluster } = (0, util_1.testFixtureCluster)();
            // WHEN
            new eks.ServiceAccount(stack, 'MyServiceAccount', { cluster });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'ClusterKubectlProviderframeworkonEvent68E0CF80',
                        'Arn',
                    ],
                },
                Manifest: {
                    'Fn::Join': [
                        '',
                        [
                            '[{\"apiVersion\":\"v1\",\"kind\":\"ServiceAccount\",\"metadata\":{\"name\":\"stackmyserviceaccount58b9529e\",\"namespace\":\"default\",\"labels\":{\"app.kubernetes.io/name\":\"stackmyserviceaccount58b9529e\"},\"annotations\":{\"eks.amazonaws.com/role-arn\":\"',
                            {
                                'Fn::GetAtt': [
                                    'MyServiceAccountRoleB41709FF',
                                    'Arn',
                                ],
                            },
                            '\"}}}]',
                        ],
                    ],
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties(iam.CfnRole.CFN_RESOURCE_TYPE_NAME, {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRoleWithWebIdentity',
                            Effect: 'Allow',
                            Principal: {
                                Federated: {
                                    Ref: 'ClusterOpenIdConnectProviderE7EB0530',
                                },
                            },
                            Condition: {
                                StringEquals: {
                                    'Fn::GetAtt': [
                                        'MyServiceAccountConditionJson1ED3BC54',
                                        'Value',
                                    ],
                                },
                            },
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
        });
        test('it is possible to add annotations and labels', () => {
            // GIVEN
            const { stack, cluster } = (0, util_1.testFixtureCluster)();
            // WHEN
            new eks.ServiceAccount(stack, 'MyServiceAccount', {
                cluster,
                annotations: {
                    'eks.amazonaws.com/sts-regional-endpoints': 'false',
                },
                labels: {
                    'some-label': 'with-some-value',
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'ClusterKubectlProviderframeworkonEvent68E0CF80',
                        'Arn',
                    ],
                },
                Manifest: {
                    'Fn::Join': [
                        '',
                        [
                            '[{\"apiVersion\":\"v1\",\"kind\":\"ServiceAccount\",\"metadata\":{\"name\":\"stackmyserviceaccount58b9529e\",\"namespace\":\"default\",\"labels\":{\"app.kubernetes.io/name\":\"stackmyserviceaccount58b9529e\",\"some-label\":\"with-some-value\"},\"annotations\":{\"eks.amazonaws.com/role-arn\":\"',
                            {
                                'Fn::GetAtt': [
                                    'MyServiceAccountRoleB41709FF',
                                    'Arn',
                                ],
                            },
                            '\",\"eks.amazonaws.com/sts-regional-endpoints\":\"false\"}}}]',
                        ],
                    ],
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties(iam.CfnRole.CFN_RESOURCE_TYPE_NAME, {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRoleWithWebIdentity',
                            Effect: 'Allow',
                            Principal: {
                                Federated: {
                                    Ref: 'ClusterOpenIdConnectProviderE7EB0530',
                                },
                            },
                            Condition: {
                                StringEquals: {
                                    'Fn::GetAtt': [
                                        'MyServiceAccountConditionJson1ED3BC54',
                                        'Value',
                                    ],
                                },
                            },
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
        });
        test('should have allow multiple services accounts', () => {
            // GIVEN
            const { stack, cluster } = (0, util_1.testFixtureCluster)();
            // WHEN
            cluster.addServiceAccount('MyServiceAccount');
            cluster.addServiceAccount('MyOtherServiceAccount');
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'ClusterKubectlProviderframeworkonEvent68E0CF80',
                        'Arn',
                    ],
                },
                Manifest: {
                    'Fn::Join': [
                        '',
                        [
                            '[{\"apiVersion\":\"v1\",\"kind\":\"ServiceAccount\",\"metadata\":{\"name\":\"stackclustermyotherserviceaccounta472761a\",\"namespace\":\"default\",\"labels\":{\"app.kubernetes.io/name\":\"stackclustermyotherserviceaccounta472761a\"},\"annotations\":{\"eks.amazonaws.com/role-arn\":\"',
                            {
                                'Fn::GetAtt': [
                                    'ClusterMyOtherServiceAccountRole764583C5',
                                    'Arn',
                                ],
                            },
                            '\"}}}]',
                        ],
                    ],
                },
            });
        });
        test('should have unique resource name', () => {
            // GIVEN
            const { cluster } = (0, util_1.testFixtureCluster)();
            // WHEN
            cluster.addServiceAccount('MyServiceAccount');
            // THEN
            expect(() => cluster.addServiceAccount('MyServiceAccount')).toThrow();
        });
        test('addServiceAccount for imported cluster', () => {
            const { stack } = (0, util_1.testFixture)();
            const oidcProvider = new iam.OpenIdConnectProvider(stack, 'ClusterOpenIdConnectProvider', {
                url: 'oidc_issuer',
            });
            const handlerRole = iam.Role.fromRoleArn(stack, 'HandlerRole', 'arn:aws:iam::123456789012:role/lambda-role');
            const kubectlProvider = eks.KubectlProvider.fromKubectlProviderAttributes(stack, 'KubectlProvider', {
                serviceToken: 'arn:aws:lambda:us-east-2:123456789012:function:myfunc',
                role: handlerRole,
            });
            const cluster = eks.Cluster.fromClusterAttributes(stack, 'Cluster', {
                clusterName: 'Cluster',
                openIdConnectProvider: oidcProvider,
                kubectlProvider: kubectlProvider,
            });
            cluster.addServiceAccount('MyServiceAccount');
            assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
                ServiceToken: 'arn:aws:lambda:us-east-2:123456789012:function:myfunc',
                PruneLabel: 'aws.cdk.eks/prune-c8d8e1722a4f3ed332f8ac74cb3d962f01fbb62291',
                Manifest: {
                    'Fn::Join': [
                        '',
                        [
                            '[{"apiVersion":"v1","kind":"ServiceAccount","metadata":{"name":"stackclustermyserviceaccount373b933c","namespace":"default","labels":{"aws.cdk.eks/prune-c8d8e1722a4f3ed332f8ac74cb3d962f01fbb62291":"","app.kubernetes.io/name":"stackclustermyserviceaccount373b933c"},"annotations":{"eks.amazonaws.com/role-arn":"',
                            {
                                'Fn::GetAtt': [
                                    'ClusterMyServiceAccountRole85337B29',
                                    'Arn',
                                ],
                            },
                            '"}}}]',
                        ],
                    ],
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties(iam.CfnRole.CFN_RESOURCE_TYPE_NAME, {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRoleWithWebIdentity',
                            Condition: {
                                StringEquals: {
                                    'Fn::GetAtt': [
                                        'ClusterMyServiceAccountConditionJson671C0633',
                                        'Value',
                                    ],
                                },
                            },
                            Effect: 'Allow',
                            Principal: {
                                Federated: {
                                    Ref: 'ClusterOpenIdConnectProviderA8B8E987',
                                },
                            },
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
        });
    });
    describe('Service Account name must follow Kubernetes spec', () => {
        test('throw error on capital letters', () => {
            // GIVEN
            const { cluster } = (0, util_1.testFixtureCluster)();
            // WHEN
            expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
                name: 'XXX',
            }))
                // THEN
                .toThrow(RangeError);
        });
        test('throw error if ends with dot', () => {
            // GIVEN
            const { cluster } = (0, util_1.testFixtureCluster)();
            // WHEN
            expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
                name: 'test.',
            }))
                // THEN
                .toThrow(RangeError);
        });
        test('dot in the name is allowed', () => {
            // GIVEN
            const { cluster } = (0, util_1.testFixtureCluster)();
            const valueWithDot = 'test.name';
            // WHEN
            const sa = cluster.addServiceAccount('InvalidServiceAccount', {
                name: valueWithDot,
            });
            // THEN
            expect(sa.serviceAccountName).toEqual(valueWithDot);
        });
        test('throw error if name is too long', () => {
            // GIVEN
            const { cluster } = (0, util_1.testFixtureCluster)();
            // WHEN
            expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
                name: 'x'.repeat(255),
            }))
                // THEN
                .toThrow(RangeError);
        });
    });
    describe('Service Account namespace must follow Kubernetes spec', () => {
        test('throw error on capital letters', () => {
            // GIVEN
            const { cluster } = (0, util_1.testFixtureCluster)();
            // WHEN
            expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
                namespace: 'XXX',
            }))
                // THEN
                .toThrow(RangeError);
        });
        test('throw error if ends with dot', () => {
            // GIVEN
            const { cluster } = (0, util_1.testFixtureCluster)();
            // WHEN
            expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
                namespace: 'test.',
            }))
                // THEN
                .toThrow(RangeError);
        });
        test('throw error if dot is in the name', () => {
            // GIVEN
            const { cluster } = (0, util_1.testFixtureCluster)();
            const valueWithDot = 'test.name';
            // WHEN
            expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
                namespace: valueWithDot,
            }))
                // THEN
                .toThrow(RangeError);
        });
        test('throw error if name is too long', () => {
            // GIVEN
            const { cluster } = (0, util_1.testFixtureCluster)();
            // WHEN
            expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
                namespace: 'x'.repeat(65),
            }))
                // THEN
                .toThrow(RangeError);
        });
    });
    describe('Service Account with eks.IdentityType.POD_IDENTITY', () => {
        test('default', () => {
            // GIVEN
            const { stack, cluster } = (0, util_1.testFixtureCluster)();
            // WHEN
            new eks.ServiceAccount(stack, 'MyServiceAccount', {
                cluster,
                identityType: eks.IdentityType.POD_IDENTITY,
            });
            const t = assertions_1.Template.fromStack(stack);
            // THEN
            // should create an IAM role with correct assume role policy
            t.hasResourceProperties('AWS::IAM::Role', {
                AssumeRolePolicyDocument: {
                    Statement: [
                        { Action: 'sts:AssumeRole', Effect: 'Allow', Principal: { Service: 'pods.eks.amazonaws.com' } },
                        { Action: ['sts:AssumeRole', 'sts:TagSession'], Effect: 'Allow', Principal: { Service: 'pods.eks.amazonaws.com' } },
                    ],
                },
            });
            // should have a eks pod identity agent addon
            t.hasResourceProperties('AWS::EKS::Addon', {
                AddonName: 'eks-pod-identity-agent',
                ClusterName: { Ref: 'ClusterEB0386A7' },
            });
            // should have pod identity association
            t.hasResourceProperties('AWS::EKS::PodIdentityAssociation', {
                ClusterName: { Ref: 'ClusterEB0386A7' },
                Namespace: 'default',
                RoleArn: { 'Fn::GetAtt': ['MyServiceAccountRoleB41709FF', 'Arn'] },
                ServiceAccount: 'stackmyserviceaccount58b9529e',
            });
            // should not create OpenIdConnectProvider
            t.resourceCountIs('Custom::AWSCDKOpenIdConnectProvider', 0);
        });
    });
    describe('Service Account with eks.IdentityType.IRSA', () => {
        test('default', () => {
            // GIVEN
            const { stack, cluster } = (0, util_1.testFixtureCluster)();
            // WHEN
            new eks.ServiceAccount(stack, 'MyServiceAccount', {
                cluster,
                identityType: eks.IdentityType.IRSA,
            });
            const t = assertions_1.Template.fromStack(stack);
            // THEN
            // should create an IAM role with correct assume role policy
            t.hasResourceProperties('AWS::IAM::Role', {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRoleWithWebIdentity',
                            Condition: { StringEquals: { 'Fn::GetAtt': ['MyServiceAccountConditionJson1ED3BC54', 'Value'] } },
                            Effect: 'Allow',
                            Principal: { Federated: { Ref: 'ClusterOpenIdConnectProviderE7EB0530' } },
                        },
                    ],
                },
            });
            // should create an OpenIdConnectProvider
            t.resourceCountIs('Custom::AWSCDKOpenIdConnectProvider', 1);
            // should not have any eks pod identity agent addon
            t.resourcePropertiesCountIs('AWS::EKS::Addon', {
                AddonName: 'eks-pod-identity-agent',
            }, 0);
            // should not have pod identity association
            t.resourceCountIs('AWS::EKS::PodIdentityAssociation', 0);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS1hY2NvdW50LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXJ2aWNlLWFjY291bnQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVEQUFrRDtBQUNsRCwyQ0FBMkM7QUFDM0MsaUNBQXlEO0FBQ3pELDhCQUE4QjtBQUU5QixRQUFRLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO0lBQy9CLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7UUFDbkMsSUFBSSxDQUFDLGdFQUFnRSxFQUFFLEdBQUcsRUFBRTtZQUMxRSxRQUFRO1lBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFBLHlCQUFrQixHQUFFLENBQUM7WUFFaEQsT0FBTztZQUNQLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBRS9ELE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsYUFBYSxFQUFFO2dCQUNwRixZQUFZLEVBQUU7b0JBQ1osWUFBWSxFQUFFO3dCQUNaLGdEQUFnRDt3QkFDaEQsS0FBSztxQkFDTjtpQkFDRjtnQkFDRCxRQUFRLEVBQUU7b0JBQ1IsVUFBVSxFQUFFO3dCQUNWLEVBQUU7d0JBQ0Y7NEJBQ0UscVFBQXFROzRCQUNyUTtnQ0FDRSxZQUFZLEVBQUU7b0NBQ1osOEJBQThCO29DQUM5QixLQUFLO2lDQUNOOzZCQUNGOzRCQUNELFFBQVE7eUJBQ1Q7cUJBQ0Y7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFDSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLHNCQUFzQixFQUFFO2dCQUNsRix3QkFBd0IsRUFBRTtvQkFDeEIsU0FBUyxF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IH0gZnJvbSAnYXdzLWNkay1saWIvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgeyB0ZXN0Rml4dHVyZSwgdGVzdEZpeHR1cmVDbHVzdGVyIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCAqIGFzIGVrcyBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnc2VydmljZSBhY2NvdW50JywgKCkgPT4ge1xuICBkZXNjcmliZSgnYWRkIFNlcnZpY2UgQWNjb3VudCcsICgpID0+IHtcbiAgICB0ZXN0KCdkZWZhdWx0cyBzaG91bGQgaGF2ZSBkZWZhdWx0IG5hbWVzcGFjZSBhbmQgbG93ZXJjYXNlIHVuaXF1ZSBpZCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrLCBjbHVzdGVyIH0gPSB0ZXN0Rml4dHVyZUNsdXN0ZXIoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVrcy5TZXJ2aWNlQWNjb3VudChzdGFjaywgJ015U2VydmljZUFjY291bnQnLCB7IGNsdXN0ZXIgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKGVrcy5LdWJlcm5ldGVzTWFuaWZlc3QuUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgICBTZXJ2aWNlVG9rZW46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdDbHVzdGVyS3ViZWN0bFByb3ZpZGVyZnJhbWV3b3Jrb25FdmVudDY4RTBDRjgwJyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIE1hbmlmZXN0OiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICdbe1xcXCJhcGlWZXJzaW9uXFxcIjpcXFwidjFcXFwiLFxcXCJraW5kXFxcIjpcXFwiU2VydmljZUFjY291bnRcXFwiLFxcXCJtZXRhZGF0YVxcXCI6e1xcXCJuYW1lXFxcIjpcXFwic3RhY2tteXNlcnZpY2VhY2NvdW50NThiOTUyOWVcXFwiLFxcXCJuYW1lc3BhY2VcXFwiOlxcXCJkZWZhdWx0XFxcIixcXFwibGFiZWxzXFxcIjp7XFxcImFwcC5rdWJlcm5ldGVzLmlvL25hbWVcXFwiOlxcXCJzdGFja215c2VydmljZWFjY291bnQ1OGI5NTI5ZVxcXCJ9LFxcXCJhbm5vdGF0aW9uc1xcXCI6e1xcXCJla3MuYW1hem9uYXdzLmNvbS9yb2xlLWFyblxcXCI6XFxcIicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdNeVNlcnZpY2VBY2NvdW50Um9sZUI0MTcwOUZGJyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdcXFwifX19XScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKGlhbS5DZm5Sb2xlLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHtcbiAgICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlV2l0aFdlYklkZW50aXR5JyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgICBGZWRlcmF0ZWQ6IHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0NsdXN0ZXJPcGVuSWRDb25uZWN0UHJvdmlkZXJFN0VCMDUzMCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ015U2VydmljZUFjY291bnRDb25kaXRpb25Kc29uMUVEM0JDNTQnLFxuICAgICAgICAgICAgICAgICAgICAnVmFsdWUnLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnaXQgaXMgcG9zc2libGUgdG8gYWRkIGFubm90YXRpb25zIGFuZCBsYWJlbHMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjaywgY2x1c3RlciB9ID0gdGVzdEZpeHR1cmVDbHVzdGVyKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBla3MuU2VydmljZUFjY291bnQoc3RhY2ssICdNeVNlcnZpY2VBY2NvdW50Jywge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICBhbm5vdGF0aW9uczoge1xuICAgICAgICAgICdla3MuYW1hem9uYXdzLmNvbS9zdHMtcmVnaW9uYWwtZW5kcG9pbnRzJzogJ2ZhbHNlJyxcbiAgICAgICAgfSxcbiAgICAgICAgbGFiZWxzOiB7XG4gICAgICAgICAgJ3NvbWUtbGFiZWwnOiAnd2l0aC1zb21lLXZhbHVlJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhla3MuS3ViZXJuZXRlc01hbmlmZXN0LlJFU09VUkNFX1RZUEUsIHtcbiAgICAgICAgU2VydmljZVRva2VuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnQ2x1c3Rlckt1YmVjdGxQcm92aWRlcmZyYW1ld29ya29uRXZlbnQ2OEUwQ0Y4MCcsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICBNYW5pZmVzdDoge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnW3tcXFwiYXBpVmVyc2lvblxcXCI6XFxcInYxXFxcIixcXFwia2luZFxcXCI6XFxcIlNlcnZpY2VBY2NvdW50XFxcIixcXFwibWV0YWRhdGFcXFwiOntcXFwibmFtZVxcXCI6XFxcInN0YWNrbXlzZXJ2aWNlYWNjb3VudDU4Yjk1MjllXFxcIixcXFwibmFtZXNwYWNlXFxcIjpcXFwiZGVmYXVsdFxcXCIsXFxcImxhYmVsc1xcXCI6e1xcXCJhcHAua3ViZXJuZXRlcy5pby9uYW1lXFxcIjpcXFwic3RhY2tteXNlcnZpY2VhY2NvdW50NThiOTUyOWVcXFwiLFxcXCJzb21lLWxhYmVsXFxcIjpcXFwid2l0aC1zb21lLXZhbHVlXFxcIn0sXFxcImFubm90YXRpb25zXFxcIjp7XFxcImVrcy5hbWF6b25hd3MuY29tL3JvbGUtYXJuXFxcIjpcXFwiJyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ015U2VydmljZUFjY291bnRSb2xlQjQxNzA5RkYnLFxuICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ1xcXCIsXFxcImVrcy5hbWF6b25hd3MuY29tL3N0cy1yZWdpb25hbC1lbmRwb2ludHNcXFwiOlxcXCJmYWxzZVxcXCJ9fX1dJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoaWFtLkNmblJvbGUuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwge1xuICAgICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGVXaXRoV2ViSWRlbnRpdHknLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICAgIEZlZGVyYXRlZDoge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQ2x1c3Rlck9wZW5JZENvbm5lY3RQcm92aWRlckU3RUIwNTMwJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICAgICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAnTXlTZXJ2aWNlQWNjb3VudENvbmRpdGlvbkpzb24xRUQzQkM1NCcsXG4gICAgICAgICAgICAgICAgICAgICdWYWx1ZScsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdzaG91bGQgaGF2ZSBhbGxvdyBtdWx0aXBsZSBzZXJ2aWNlcyBhY2NvdW50cycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrLCBjbHVzdGVyIH0gPSB0ZXN0Rml4dHVyZUNsdXN0ZXIoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY2x1c3Rlci5hZGRTZXJ2aWNlQWNjb3VudCgnTXlTZXJ2aWNlQWNjb3VudCcpO1xuICAgICAgY2x1c3Rlci5hZGRTZXJ2aWNlQWNjb3VudCgnTXlPdGhlclNlcnZpY2VBY2NvdW50Jyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKGVrcy5LdWJlcm5ldGVzTWFuaWZlc3QuUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgICBTZXJ2aWNlVG9rZW46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdDbHVzdGVyS3ViZWN0bFByb3ZpZGVyZnJhbWV3b3Jrb25FdmVudDY4RTBDRjgwJyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIE1hbmlmZXN0OiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICdbe1xcXCJhcGlWZXJzaW9uXFxcIjpcXFwidjFcXFwiLFxcXCJraW5kXFxcIjpcXFwiU2VydmljZUFjY291bnRcXFwiLFxcXCJtZXRhZGF0YVxcXCI6e1xcXCJuYW1lXFxcIjpcXFwic3RhY2tjbHVzdGVybXlvdGhlcnNlcnZpY2VhY2NvdW50YTQ3Mjc2MWFcXFwiLFxcXCJuYW1lc3BhY2VcXFwiOlxcXCJkZWZhdWx0XFxcIixcXFwibGFiZWxzXFxcIjp7XFxcImFwcC5rdWJlcm5ldGVzLmlvL25hbWVcXFwiOlxcXCJzdGFja2NsdXN0ZXJteW90aGVyc2VydmljZWFjY291bnRhNDcyNzYxYVxcXCJ9LFxcXCJhbm5vdGF0aW9uc1xcXCI6e1xcXCJla3MuYW1hem9uYXdzLmNvbS9yb2xlLWFyblxcXCI6XFxcIicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdDbHVzdGVyTXlPdGhlclNlcnZpY2VBY2NvdW50Um9sZTc2NDU4M0M1JyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdcXFwifX19XScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Nob3VsZCBoYXZlIHVuaXF1ZSByZXNvdXJjZSBuYW1lJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgY2x1c3RlciB9ID0gdGVzdEZpeHR1cmVDbHVzdGVyKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNsdXN0ZXIuYWRkU2VydmljZUFjY291bnQoJ015U2VydmljZUFjY291bnQnKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkU2VydmljZUFjY291bnQoJ015U2VydmljZUFjY291bnQnKSkudG9UaHJvdygpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWRkU2VydmljZUFjY291bnQgZm9yIGltcG9ydGVkIGNsdXN0ZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgICAgY29uc3Qgb2lkY1Byb3ZpZGVyID0gbmV3IGlhbS5PcGVuSWRDb25uZWN0UHJvdmlkZXIoc3RhY2ssICdDbHVzdGVyT3BlbklkQ29ubmVjdFByb3ZpZGVyJywge1xuICAgICAgICB1cmw6ICdvaWRjX2lzc3VlcicsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGhhbmRsZXJSb2xlID0gaWFtLlJvbGUuZnJvbVJvbGVBcm4oc3RhY2ssICdIYW5kbGVyUm9sZScsICdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvbGFtYmRhLXJvbGUnKTtcblxuICAgICAgY29uc3Qga3ViZWN0bFByb3ZpZGVyID0gZWtzLkt1YmVjdGxQcm92aWRlci5mcm9tS3ViZWN0bFByb3ZpZGVyQXR0cmlidXRlcyhzdGFjaywgJ0t1YmVjdGxQcm92aWRlcicsIHtcbiAgICAgICAgc2VydmljZVRva2VuOiAnYXJuOmF3czpsYW1iZGE6dXMtZWFzdC0yOjEyMzQ1Njc4OTAxMjpmdW5jdGlvbjpteWZ1bmMnLFxuICAgICAgICByb2xlOiBoYW5kbGVyUm9sZSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjbHVzdGVyID0gZWtzLkNsdXN0ZXIuZnJvbUNsdXN0ZXJBdHRyaWJ1dGVzKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICAgICAgY2x1c3Rlck5hbWU6ICdDbHVzdGVyJyxcbiAgICAgICAgb3BlbklkQ29ubmVjdFByb3ZpZGVyOiBvaWRjUHJvdmlkZXIsXG4gICAgICAgIGt1YmVjdGxQcm92aWRlcjoga3ViZWN0bFByb3ZpZGVyLFxuICAgICAgfSk7XG5cbiAgICAgIGNsdXN0ZXIuYWRkU2VydmljZUFjY291bnQoJ015U2VydmljZUFjY291bnQnKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoZWtzLkt1YmVybmV0ZXNNYW5pZmVzdC5SRVNPVVJDRV9UWVBFLCB7XG4gICAgICAgIFNlcnZpY2VUb2tlbjogJ2Fybjphd3M6bGFtYmRhOnVzLWVhc3QtMjoxMjM0NTY3ODkwMTI6ZnVuY3Rpb246bXlmdW5jJyxcbiAgICAgICAgUHJ1bmVMYWJlbDogJ2F3cy5jZGsuZWtzL3BydW5lLWM4ZDhlMTcyMmE0ZjNlZDMzMmY4YWM3NGNiM2Q5NjJmMDFmYmI2MjI5MScsXG4gICAgICAgIE1hbmlmZXN0OiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICdbe1wiYXBpVmVyc2lvblwiOlwidjFcIixcImtpbmRcIjpcIlNlcnZpY2VBY2NvdW50XCIsXCJtZXRhZGF0YVwiOntcIm5hbWVcIjpcInN0YWNrY2x1c3Rlcm15c2VydmljZWFjY291bnQzNzNiOTMzY1wiLFwibmFtZXNwYWNlXCI6XCJkZWZhdWx0XCIsXCJsYWJlbHNcIjp7XCJhd3MuY2RrLmVrcy9wcnVuZS1jOGQ4ZTE3MjJhNGYzZWQzMzJmOGFjNzRjYjNkOTYyZjAxZmJiNjIyOTFcIjpcIlwiLFwiYXBwLmt1YmVybmV0ZXMuaW8vbmFtZVwiOlwic3RhY2tjbHVzdGVybXlzZXJ2aWNlYWNjb3VudDM3M2I5MzNjXCJ9LFwiYW5ub3RhdGlvbnNcIjp7XCJla3MuYW1hem9uYXdzLmNvbS9yb2xlLWFyblwiOlwiJyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ0NsdXN0ZXJNeVNlcnZpY2VBY2NvdW50Um9sZTg1MzM3QjI5JyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdcIn19fV0nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKGlhbS5DZm5Sb2xlLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHtcbiAgICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlV2l0aFdlYklkZW50aXR5JyxcbiAgICAgICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ0NsdXN0ZXJNeVNlcnZpY2VBY2NvdW50Q29uZGl0aW9uSnNvbjY3MUMwNjMzJyxcbiAgICAgICAgICAgICAgICAgICAgJ1ZhbHVlJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgICBGZWRlcmF0ZWQ6IHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0NsdXN0ZXJPcGVuSWRDb25uZWN0UHJvdmlkZXJBOEI4RTk4NycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ1NlcnZpY2UgQWNjb3VudCBuYW1lIG11c3QgZm9sbG93IEt1YmVybmV0ZXMgc3BlYycsICgpID0+IHtcbiAgICB0ZXN0KCd0aHJvdyBlcnJvciBvbiBjYXBpdGFsIGxldHRlcnMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBjbHVzdGVyIH0gPSB0ZXN0Rml4dHVyZUNsdXN0ZXIoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkU2VydmljZUFjY291bnQoJ0ludmFsaWRTZXJ2aWNlQWNjb3VudCcsIHtcbiAgICAgICAgbmFtZTogJ1hYWCcsXG4gICAgICB9KSlcbiAgICAgIC8vIFRIRU5cbiAgICAgICAgLnRvVGhyb3coUmFuZ2VFcnJvcik7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvdyBlcnJvciBpZiBlbmRzIHdpdGggZG90JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgY2x1c3RlciB9ID0gdGVzdEZpeHR1cmVDbHVzdGVyKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiBjbHVzdGVyLmFkZFNlcnZpY2VBY2NvdW50KCdJbnZhbGlkU2VydmljZUFjY291bnQnLCB7XG4gICAgICAgIG5hbWU6ICd0ZXN0LicsXG4gICAgICB9KSlcbiAgICAgIC8vIFRIRU5cbiAgICAgICAgLnRvVGhyb3coUmFuZ2VFcnJvcik7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdkb3QgaW4gdGhlIG5hbWUgaXMgYWxsb3dlZCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IGNsdXN0ZXIgfSA9IHRlc3RGaXh0dXJlQ2x1c3RlcigpO1xuICAgICAgY29uc3QgdmFsdWVXaXRoRG90ID0gJ3Rlc3QubmFtZSc7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHNhID0gY2x1c3Rlci5hZGRTZXJ2aWNlQWNjb3VudCgnSW52YWxpZFNlcnZpY2VBY2NvdW50Jywge1xuICAgICAgICBuYW1lOiB2YWx1ZVdpdGhEb3QsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHNhLnNlcnZpY2VBY2NvdW50TmFtZSkudG9FcXVhbCh2YWx1ZVdpdGhEb3QpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3cgZXJyb3IgaWYgbmFtZSBpcyB0b28gbG9uZycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IGNsdXN0ZXIgfSA9IHRlc3RGaXh0dXJlQ2x1c3RlcigpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBleHBlY3QoKCkgPT4gY2x1c3Rlci5hZGRTZXJ2aWNlQWNjb3VudCgnSW52YWxpZFNlcnZpY2VBY2NvdW50Jywge1xuICAgICAgICBuYW1lOiAneCcucmVwZWF0KDI1NSksXG4gICAgICB9KSlcbiAgICAgIC8vIFRIRU5cbiAgICAgICAgLnRvVGhyb3coUmFuZ2VFcnJvcik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdTZXJ2aWNlIEFjY291bnQgbmFtZXNwYWNlIG11c3QgZm9sbG93IEt1YmVybmV0ZXMgc3BlYycsICgpID0+IHtcbiAgICB0ZXN0KCd0aHJvdyBlcnJvciBvbiBjYXBpdGFsIGxldHRlcnMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBjbHVzdGVyIH0gPSB0ZXN0Rml4dHVyZUNsdXN0ZXIoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkU2VydmljZUFjY291bnQoJ0ludmFsaWRTZXJ2aWNlQWNjb3VudCcsIHtcbiAgICAgICAgbmFtZXNwYWNlOiAnWFhYJyxcbiAgICAgIH0pKVxuICAgICAgLy8gVEhFTlxuICAgICAgICAudG9UaHJvdyhSYW5nZUVycm9yKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93IGVycm9yIGlmIGVuZHMgd2l0aCBkb3QnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBjbHVzdGVyIH0gPSB0ZXN0Rml4dHVyZUNsdXN0ZXIoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkU2VydmljZUFjY291bnQoJ0ludmFsaWRTZXJ2aWNlQWNjb3VudCcsIHtcbiAgICAgICAgbmFtZXNwYWNlOiAndGVzdC4nLFxuICAgICAgfSkpXG4gICAgICAvLyBUSEVOXG4gICAgICAgIC50b1Rocm93KFJhbmdlRXJyb3IpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3cgZXJyb3IgaWYgZG90IGlzIGluIHRoZSBuYW1lJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgY2x1c3RlciB9ID0gdGVzdEZpeHR1cmVDbHVzdGVyKCk7XG4gICAgICBjb25zdCB2YWx1ZVdpdGhEb3QgPSAndGVzdC5uYW1lJztcblxuICAgICAgLy8gV0hFTlxuICAgICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkU2VydmljZUFjY291bnQoJ0ludmFsaWRTZXJ2aWNlQWNjb3VudCcsIHtcbiAgICAgICAgbmFtZXNwYWNlOiB2YWx1ZVdpdGhEb3QsXG4gICAgICB9KSlcbiAgICAgIC8vIFRIRU5cbiAgICAgICAgLnRvVGhyb3coUmFuZ2VFcnJvcik7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvdyBlcnJvciBpZiBuYW1lIGlzIHRvbyBsb25nJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgY2x1c3RlciB9ID0gdGVzdEZpeHR1cmVDbHVzdGVyKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiBjbHVzdGVyLmFkZFNlcnZpY2VBY2NvdW50KCdJbnZhbGlkU2VydmljZUFjY291bnQnLCB7XG4gICAgICAgIG5hbWVzcGFjZTogJ3gnLnJlcGVhdCg2NSksXG4gICAgICB9KSlcbiAgICAgIC8vIFRIRU5cbiAgICAgICAgLnRvVGhyb3coUmFuZ2VFcnJvcik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdTZXJ2aWNlIEFjY291bnQgd2l0aCBla3MuSWRlbnRpdHlUeXBlLlBPRF9JREVOVElUWScsICgpID0+IHtcbiAgICB0ZXN0KCdkZWZhdWx0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgc3RhY2ssIGNsdXN0ZXIgfSA9IHRlc3RGaXh0dXJlQ2x1c3RlcigpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgZWtzLlNlcnZpY2VBY2NvdW50KHN0YWNrLCAnTXlTZXJ2aWNlQWNjb3VudCcsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgaWRlbnRpdHlUeXBlOiBla3MuSWRlbnRpdHlUeXBlLlBPRF9JREVOVElUWSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgdCA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIC8vIHNob3VsZCBjcmVhdGUgYW4gSUFNIHJvbGUgd2l0aCBjb3JyZWN0IGFzc3VtZSByb2xlIHBvbGljeVxuICAgICAgdC5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgIHsgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLCBFZmZlY3Q6ICdBbGxvdycsIFByaW5jaXBhbDogeyBTZXJ2aWNlOiAncG9kcy5la3MuYW1hem9uYXdzLmNvbScgfSB9LFxuICAgICAgICAgICAgeyBBY3Rpb246IFsnc3RzOkFzc3VtZVJvbGUnLCAnc3RzOlRhZ1Nlc3Npb24nXSwgRWZmZWN0OiAnQWxsb3cnLCBQcmluY2lwYWw6IHsgU2VydmljZTogJ3BvZHMuZWtzLmFtYXpvbmF3cy5jb20nIH0gfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICAvLyBzaG91bGQgaGF2ZSBhIGVrcyBwb2QgaWRlbnRpdHkgYWdlbnQgYWRkb25cbiAgICAgIHQuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6QWRkb24nLCB7XG4gICAgICAgIEFkZG9uTmFtZTogJ2Vrcy1wb2QtaWRlbnRpdHktYWdlbnQnLFxuICAgICAgICBDbHVzdGVyTmFtZTogeyBSZWY6ICdDbHVzdGVyRUIwMzg2QTcnIH0sXG4gICAgICB9KTtcbiAgICAgIC8vIHNob3VsZCBoYXZlIHBvZCBpZGVudGl0eSBhc3NvY2lhdGlvblxuICAgICAgdC5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpQb2RJZGVudGl0eUFzc29jaWF0aW9uJywge1xuICAgICAgICBDbHVzdGVyTmFtZTogeyBSZWY6ICdDbHVzdGVyRUIwMzg2QTcnIH0sXG4gICAgICAgIE5hbWVzcGFjZTogJ2RlZmF1bHQnLFxuICAgICAgICBSb2xlQXJuOiB7ICdGbjo6R2V0QXR0JzogWydNeVNlcnZpY2VBY2NvdW50Um9sZUI0MTcwOUZGJywgJ0FybiddIH0sXG4gICAgICAgIFNlcnZpY2VBY2NvdW50OiAnc3RhY2tteXNlcnZpY2VhY2NvdW50NThiOTUyOWUnLFxuICAgICAgfSk7XG4gICAgICAvLyBzaG91bGQgbm90IGNyZWF0ZSBPcGVuSWRDb25uZWN0UHJvdmlkZXJcbiAgICAgIHQucmVzb3VyY2VDb3VudElzKCdDdXN0b206OkFXU0NES09wZW5JZENvbm5lY3RQcm92aWRlcicsIDApO1xuICAgIH0pO1xuICB9KTtcbiAgZGVzY3JpYmUoJ1NlcnZpY2UgQWNjb3VudCB3aXRoIGVrcy5JZGVudGl0eVR5cGUuSVJTQScsICgpID0+IHtcbiAgICB0ZXN0KCdkZWZhdWx0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgc3RhY2ssIGNsdXN0ZXIgfSA9IHRlc3RGaXh0dXJlQ2x1c3RlcigpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgZWtzLlNlcnZpY2VBY2NvdW50KHN0YWNrLCAnTXlTZXJ2aWNlQWNjb3VudCcsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgaWRlbnRpdHlUeXBlOiBla3MuSWRlbnRpdHlUeXBlLklSU0EsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHQgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICAvLyBzaG91bGQgY3JlYXRlIGFuIElBTSByb2xlIHdpdGggY29ycmVjdCBhc3N1bWUgcm9sZSBwb2xpY3lcbiAgICAgIHQuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlV2l0aFdlYklkZW50aXR5JyxcbiAgICAgICAgICAgICAgQ29uZGl0aW9uOiB7IFN0cmluZ0VxdWFsczogeyAnRm46OkdldEF0dCc6IFsnTXlTZXJ2aWNlQWNjb3VudENvbmRpdGlvbkpzb24xRUQzQkM1NCcsICdWYWx1ZSddIH0gfSxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHsgRmVkZXJhdGVkOiB7IFJlZjogJ0NsdXN0ZXJPcGVuSWRDb25uZWN0UHJvdmlkZXJFN0VCMDUzMCcgfSB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIHNob3VsZCBjcmVhdGUgYW4gT3BlbklkQ29ubmVjdFByb3ZpZGVyXG4gICAgICB0LnJlc291cmNlQ291bnRJcygnQ3VzdG9tOjpBV1NDREtPcGVuSWRDb25uZWN0UHJvdmlkZXInLCAxKTtcbiAgICAgIC8vIHNob3VsZCBub3QgaGF2ZSBhbnkgZWtzIHBvZCBpZGVudGl0eSBhZ2VudCBhZGRvblxuICAgICAgdC5yZXNvdXJjZVByb3BlcnRpZXNDb3VudElzKCdBV1M6OkVLUzo6QWRkb24nLCB7XG4gICAgICAgIEFkZG9uTmFtZTogJ2Vrcy1wb2QtaWRlbnRpdHktYWdlbnQnLFxuICAgICAgfSwgMCk7XG4gICAgICAvLyBzaG91bGQgbm90IGhhdmUgcG9kIGlkZW50aXR5IGFzc29jaWF0aW9uXG4gICAgICB0LnJlc291cmNlQ291bnRJcygnQVdTOjpFS1M6OlBvZElkZW50aXR5QXNzb2NpYXRpb24nLCAwKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==