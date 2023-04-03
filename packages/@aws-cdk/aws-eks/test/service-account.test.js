"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const util_1 = require("./util");
const eks = require("../lib");
/* eslint-disable max-len */
describe('service account', () => {
    describe('add Service Account', () => {
        test('defaults should have default namespace and lowercase unique id', () => {
            // GIVEN
            const { stack, cluster } = util_1.testFixtureCluster();
            // WHEN
            new eks.ServiceAccount(stack, 'MyServiceAccount', { cluster });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'awscdkawseksKubectlProviderNestedStackawscdkawseksKubectlProviderNestedStackResourceA7AEBA6B',
                        'Outputs.StackawscdkawseksKubectlProviderframeworkonEvent8897FD9BArn',
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
            const { stack, cluster } = util_1.testFixtureCluster();
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
                        'awscdkawseksKubectlProviderNestedStackawscdkawseksKubectlProviderNestedStackResourceA7AEBA6B',
                        'Outputs.StackawscdkawseksKubectlProviderframeworkonEvent8897FD9BArn',
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
            const { stack, cluster } = util_1.testFixtureCluster();
            // WHEN
            cluster.addServiceAccount('MyServiceAccount');
            cluster.addServiceAccount('MyOtherServiceAccount');
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'awscdkawseksKubectlProviderNestedStackawscdkawseksKubectlProviderNestedStackResourceA7AEBA6B',
                        'Outputs.StackawscdkawseksKubectlProviderframeworkonEvent8897FD9BArn',
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
            const { cluster } = util_1.testFixtureCluster();
            // WHEN
            cluster.addServiceAccount('MyServiceAccount');
            // THEN
            expect(() => cluster.addServiceAccount('MyServiceAccount')).toThrow();
        });
        test('addServiceAccount for imported cluster', () => {
            const { stack } = util_1.testFixture();
            const oidcProvider = new iam.OpenIdConnectProvider(stack, 'ClusterOpenIdConnectProvider', {
                url: 'oidc_issuer',
            });
            const cluster = eks.Cluster.fromClusterAttributes(stack, 'Cluster', {
                clusterName: 'Cluster',
                openIdConnectProvider: oidcProvider,
                kubectlRoleArn: 'arn:aws:iam::123456:role/service-role/k8sservicerole',
            });
            cluster.addServiceAccount('MyServiceAccount');
            assertions_1.Template.fromStack(stack).hasResourceProperties(eks.KubernetesManifest.RESOURCE_TYPE, {
                ServiceToken: {
                    'Fn::GetAtt': [
                        'StackClusterF0EB02FAKubectlProviderNestedStackStackClusterF0EB02FAKubectlProviderNestedStackResource739D12C4',
                        'Outputs.StackStackClusterF0EB02FAKubectlProviderframeworkonEvent8377F076Arn',
                    ],
                },
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
            const { cluster } = util_1.testFixtureCluster();
            // WHEN
            expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
                name: 'XXX',
            }))
                // THEN
                .toThrowError(RangeError);
        });
        test('throw error if ends with dot', () => {
            // GIVEN
            const { cluster } = util_1.testFixtureCluster();
            // WHEN
            expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
                name: 'test.',
            }))
                // THEN
                .toThrowError(RangeError);
        });
        test('dot in the name is allowed', () => {
            // GIVEN
            const { cluster } = util_1.testFixtureCluster();
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
            const { cluster } = util_1.testFixtureCluster();
            // WHEN
            expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
                name: 'x'.repeat(255),
            }))
                // THEN
                .toThrowError(RangeError);
        });
    });
    describe('Service Account namespace must follow Kubernetes spec', () => {
        test('throw error on capital letters', () => {
            // GIVEN
            const { cluster } = util_1.testFixtureCluster();
            // WHEN
            expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
                namespace: 'XXX',
            }))
                // THEN
                .toThrowError(RangeError);
        });
        test('throw error if ends with dot', () => {
            // GIVEN
            const { cluster } = util_1.testFixtureCluster();
            // WHEN
            expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
                namespace: 'test.',
            }))
                // THEN
                .toThrowError(RangeError);
        });
        test('throw error if dot is in the name', () => {
            // GIVEN
            const { cluster } = util_1.testFixtureCluster();
            const valueWithDot = 'test.name';
            // WHEN
            expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
                namespace: valueWithDot,
            }))
                // THEN
                .toThrowError(RangeError);
        });
        test('throw error if name is too long', () => {
            // GIVEN
            const { cluster } = util_1.testFixtureCluster();
            // WHEN
            expect(() => cluster.addServiceAccount('InvalidServiceAccount', {
                namespace: 'x'.repeat(65),
            }))
                // THEN
                .toThrowError(RangeError);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS1hY2NvdW50LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZXJ2aWNlLWFjY291bnQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBd0M7QUFDeEMsaUNBQXlEO0FBQ3pELDhCQUE4QjtBQUU5Qiw0QkFBNEI7QUFFNUIsUUFBUSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtJQUMvQixRQUFRLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO1FBQ25DLElBQUksQ0FBQyxnRUFBZ0UsRUFBRSxHQUFHLEVBQUU7WUFDMUUsUUFBUTtZQUNSLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcseUJBQWtCLEVBQUUsQ0FBQztZQUVoRCxPQUFPO1lBQ1AsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFFL0QsT0FBTztZQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxhQUFhLEVBQUU7Z0JBQ3BGLFlBQVksRUFBRTtvQkFDWixZQUFZLEVBQUU7d0JBQ1osOEZBQThGO3dCQUM5RixxRUFBcUU7cUJBQ3RFO2lCQUNGO2dCQUNELFFBQVEsRUFBRTtvQkFDUixVQUFVLEVBQUU7d0JBQ1YsRUFBRTt3QkFDRjs0QkFDRSxxUUFBcVE7NEJBQ3JRO2dDQUNFLFlBQVksRUFBRTtvQ0FDWiw4QkFBOEI7b0NBQzlCLEtBQUs7aUNBQ047NkJBQ0Y7NEJBQ0QsUUFBUTt5QkFDVDtxQkFDRjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUNILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUU7Z0JBQ2xGLHdCQUF3QixFQUFFO29C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VSxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsaUNBQWlDLEVBQUUsR0FBRyxFQUFFO1lBQzNDLFFBQVE7WUFDUixNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcseUJBQWtCLEVBQUUsQ0FBQztZQUV6QyxPQUFPO1lBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyx1QkFBdUIsRUFBRTtnQkFDOUQsU0FBUyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO2FBQzFCLENBQUMsQ0FBQztnQkFDSCxPQUFPO2lCQUNKLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgdGVzdEZpeHR1cmUsIHRlc3RGaXh0dXJlQ2x1c3RlciB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgKiBhcyBla3MgZnJvbSAnLi4vbGliJztcblxuLyogZXNsaW50LWRpc2FibGUgbWF4LWxlbiAqL1xuXG5kZXNjcmliZSgnc2VydmljZSBhY2NvdW50JywgKCkgPT4ge1xuICBkZXNjcmliZSgnYWRkIFNlcnZpY2UgQWNjb3VudCcsICgpID0+IHtcbiAgICB0ZXN0KCdkZWZhdWx0cyBzaG91bGQgaGF2ZSBkZWZhdWx0IG5hbWVzcGFjZSBhbmQgbG93ZXJjYXNlIHVuaXF1ZSBpZCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrLCBjbHVzdGVyIH0gPSB0ZXN0Rml4dHVyZUNsdXN0ZXIoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVrcy5TZXJ2aWNlQWNjb3VudChzdGFjaywgJ015U2VydmljZUFjY291bnQnLCB7IGNsdXN0ZXIgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKGVrcy5LdWJlcm5ldGVzTWFuaWZlc3QuUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgICBTZXJ2aWNlVG9rZW46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdhd3NjZGthd3Nla3NLdWJlY3RsUHJvdmlkZXJOZXN0ZWRTdGFja2F3c2Nka2F3c2Vrc0t1YmVjdGxQcm92aWRlck5lc3RlZFN0YWNrUmVzb3VyY2VBN0FFQkE2QicsXG4gICAgICAgICAgICAnT3V0cHV0cy5TdGFja2F3c2Nka2F3c2Vrc0t1YmVjdGxQcm92aWRlcmZyYW1ld29ya29uRXZlbnQ4ODk3RkQ5QkFybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgTWFuaWZlc3Q6IHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgJ1t7XFxcImFwaVZlcnNpb25cXFwiOlxcXCJ2MVxcXCIsXFxcImtpbmRcXFwiOlxcXCJTZXJ2aWNlQWNjb3VudFxcXCIsXFxcIm1ldGFkYXRhXFxcIjp7XFxcIm5hbWVcXFwiOlxcXCJzdGFja215c2VydmljZWFjY291bnQ1OGI5NTI5ZVxcXCIsXFxcIm5hbWVzcGFjZVxcXCI6XFxcImRlZmF1bHRcXFwiLFxcXCJsYWJlbHNcXFwiOntcXFwiYXBwLmt1YmVybmV0ZXMuaW8vbmFtZVxcXCI6XFxcInN0YWNrbXlzZXJ2aWNlYWNjb3VudDU4Yjk1MjllXFxcIn0sXFxcImFubm90YXRpb25zXFxcIjp7XFxcImVrcy5hbWF6b25hd3MuY29tL3JvbGUtYXJuXFxcIjpcXFwiJyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ015U2VydmljZUFjY291bnRSb2xlQjQxNzA5RkYnLFxuICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ1xcXCJ9fX1dJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoaWFtLkNmblJvbGUuQ0ZOX1JFU09VUkNFX1RZUEVfTkFNRSwge1xuICAgICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGVXaXRoV2ViSWRlbnRpdHknLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICAgIEZlZGVyYXRlZDoge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQ2x1c3Rlck9wZW5JZENvbm5lY3RQcm92aWRlckU3RUIwNTMwJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICAgICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAnTXlTZXJ2aWNlQWNjb3VudENvbmRpdGlvbkpzb24xRUQzQkM1NCcsXG4gICAgICAgICAgICAgICAgICAgICdWYWx1ZScsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpdCBpcyBwb3NzaWJsZSB0byBhZGQgYW5ub3RhdGlvbnMgYW5kIGxhYmVscycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IHN0YWNrLCBjbHVzdGVyIH0gPSB0ZXN0Rml4dHVyZUNsdXN0ZXIoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGVrcy5TZXJ2aWNlQWNjb3VudChzdGFjaywgJ015U2VydmljZUFjY291bnQnLCB7XG4gICAgICAgIGNsdXN0ZXIsXG4gICAgICAgIGFubm90YXRpb25zOiB7XG4gICAgICAgICAgJ2Vrcy5hbWF6b25hd3MuY29tL3N0cy1yZWdpb25hbC1lbmRwb2ludHMnOiAnZmFsc2UnLFxuICAgICAgICB9LFxuICAgICAgICBsYWJlbHM6IHtcbiAgICAgICAgICAnc29tZS1sYWJlbCc6ICd3aXRoLXNvbWUtdmFsdWUnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKGVrcy5LdWJlcm5ldGVzTWFuaWZlc3QuUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgICBTZXJ2aWNlVG9rZW46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdhd3NjZGthd3Nla3NLdWJlY3RsUHJvdmlkZXJOZXN0ZWRTdGFja2F3c2Nka2F3c2Vrc0t1YmVjdGxQcm92aWRlck5lc3RlZFN0YWNrUmVzb3VyY2VBN0FFQkE2QicsXG4gICAgICAgICAgICAnT3V0cHV0cy5TdGFja2F3c2Nka2F3c2Vrc0t1YmVjdGxQcm92aWRlcmZyYW1ld29ya29uRXZlbnQ4ODk3RkQ5QkFybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgTWFuaWZlc3Q6IHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgJ1t7XFxcImFwaVZlcnNpb25cXFwiOlxcXCJ2MVxcXCIsXFxcImtpbmRcXFwiOlxcXCJTZXJ2aWNlQWNjb3VudFxcXCIsXFxcIm1ldGFkYXRhXFxcIjp7XFxcIm5hbWVcXFwiOlxcXCJzdGFja215c2VydmljZWFjY291bnQ1OGI5NTI5ZVxcXCIsXFxcIm5hbWVzcGFjZVxcXCI6XFxcImRlZmF1bHRcXFwiLFxcXCJsYWJlbHNcXFwiOntcXFwiYXBwLmt1YmVybmV0ZXMuaW8vbmFtZVxcXCI6XFxcInN0YWNrbXlzZXJ2aWNlYWNjb3VudDU4Yjk1MjllXFxcIixcXFwic29tZS1sYWJlbFxcXCI6XFxcIndpdGgtc29tZS12YWx1ZVxcXCJ9LFxcXCJhbm5vdGF0aW9uc1xcXCI6e1xcXCJla3MuYW1hem9uYXdzLmNvbS9yb2xlLWFyblxcXCI6XFxcIicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdNeVNlcnZpY2VBY2NvdW50Um9sZUI0MTcwOUZGJyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdcXFwiLFxcXCJla3MuYW1hem9uYXdzLmNvbS9zdHMtcmVnaW9uYWwtZW5kcG9pbnRzXFxcIjpcXFwiZmFsc2VcXFwifX19XScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKGlhbS5DZm5Sb2xlLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHtcbiAgICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlV2l0aFdlYklkZW50aXR5JyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgICBGZWRlcmF0ZWQ6IHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0NsdXN0ZXJPcGVuSWRDb25uZWN0UHJvdmlkZXJFN0VCMDUzMCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ015U2VydmljZUFjY291bnRDb25kaXRpb25Kc29uMUVEM0JDNTQnLFxuICAgICAgICAgICAgICAgICAgICAnVmFsdWUnLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnc2hvdWxkIGhhdmUgYWxsb3cgbXVsdGlwbGUgc2VydmljZXMgYWNjb3VudHMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBzdGFjaywgY2x1c3RlciB9ID0gdGVzdEZpeHR1cmVDbHVzdGVyKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNsdXN0ZXIuYWRkU2VydmljZUFjY291bnQoJ015U2VydmljZUFjY291bnQnKTtcbiAgICAgIGNsdXN0ZXIuYWRkU2VydmljZUFjY291bnQoJ015T3RoZXJTZXJ2aWNlQWNjb3VudCcpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhla3MuS3ViZXJuZXRlc01hbmlmZXN0LlJFU09VUkNFX1RZUEUsIHtcbiAgICAgICAgU2VydmljZVRva2VuOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnYXdzY2RrYXdzZWtzS3ViZWN0bFByb3ZpZGVyTmVzdGVkU3RhY2thd3NjZGthd3Nla3NLdWJlY3RsUHJvdmlkZXJOZXN0ZWRTdGFja1Jlc291cmNlQTdBRUJBNkInLFxuICAgICAgICAgICAgJ091dHB1dHMuU3RhY2thd3NjZGthd3Nla3NLdWJlY3RsUHJvdmlkZXJmcmFtZXdvcmtvbkV2ZW50ODg5N0ZEOUJBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIE1hbmlmZXN0OiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICdbe1xcXCJhcGlWZXJzaW9uXFxcIjpcXFwidjFcXFwiLFxcXCJraW5kXFxcIjpcXFwiU2VydmljZUFjY291bnRcXFwiLFxcXCJtZXRhZGF0YVxcXCI6e1xcXCJuYW1lXFxcIjpcXFwic3RhY2tjbHVzdGVybXlvdGhlcnNlcnZpY2VhY2NvdW50YTQ3Mjc2MWFcXFwiLFxcXCJuYW1lc3BhY2VcXFwiOlxcXCJkZWZhdWx0XFxcIixcXFwibGFiZWxzXFxcIjp7XFxcImFwcC5rdWJlcm5ldGVzLmlvL25hbWVcXFwiOlxcXCJzdGFja2NsdXN0ZXJteW90aGVyc2VydmljZWFjY291bnRhNDcyNzYxYVxcXCJ9LFxcXCJhbm5vdGF0aW9uc1xcXCI6e1xcXCJla3MuYW1hem9uYXdzLmNvbS9yb2xlLWFyblxcXCI6XFxcIicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdDbHVzdGVyTXlPdGhlclNlcnZpY2VBY2NvdW50Um9sZTc2NDU4M0M1JyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdcXFwifX19XScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Nob3VsZCBoYXZlIHVuaXF1ZSByZXNvdXJjZSBuYW1lJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgY2x1c3RlciB9ID0gdGVzdEZpeHR1cmVDbHVzdGVyKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNsdXN0ZXIuYWRkU2VydmljZUFjY291bnQoJ015U2VydmljZUFjY291bnQnKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkU2VydmljZUFjY291bnQoJ015U2VydmljZUFjY291bnQnKSkudG9UaHJvdygpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWRkU2VydmljZUFjY291bnQgZm9yIGltcG9ydGVkIGNsdXN0ZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICAgICAgY29uc3Qgb2lkY1Byb3ZpZGVyID0gbmV3IGlhbS5PcGVuSWRDb25uZWN0UHJvdmlkZXIoc3RhY2ssICdDbHVzdGVyT3BlbklkQ29ubmVjdFByb3ZpZGVyJywge1xuICAgICAgICB1cmw6ICdvaWRjX2lzc3VlcicsXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGNsdXN0ZXIgPSBla3MuQ2x1c3Rlci5mcm9tQ2x1c3RlckF0dHJpYnV0ZXMoc3RhY2ssICdDbHVzdGVyJywge1xuICAgICAgICBjbHVzdGVyTmFtZTogJ0NsdXN0ZXInLFxuICAgICAgICBvcGVuSWRDb25uZWN0UHJvdmlkZXI6IG9pZGNQcm92aWRlcixcbiAgICAgICAga3ViZWN0bFJvbGVBcm46ICdhcm46YXdzOmlhbTo6MTIzNDU2OnJvbGUvc2VydmljZS1yb2xlL2s4c3NlcnZpY2Vyb2xlJyxcbiAgICAgIH0pO1xuXG4gICAgICBjbHVzdGVyLmFkZFNlcnZpY2VBY2NvdW50KCdNeVNlcnZpY2VBY2NvdW50Jyk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKGVrcy5LdWJlcm5ldGVzTWFuaWZlc3QuUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgICBTZXJ2aWNlVG9rZW46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdTdGFja0NsdXN0ZXJGMEVCMDJGQUt1YmVjdGxQcm92aWRlck5lc3RlZFN0YWNrU3RhY2tDbHVzdGVyRjBFQjAyRkFLdWJlY3RsUHJvdmlkZXJOZXN0ZWRTdGFja1Jlc291cmNlNzM5RDEyQzQnLFxuICAgICAgICAgICAgJ091dHB1dHMuU3RhY2tTdGFja0NsdXN0ZXJGMEVCMDJGQUt1YmVjdGxQcm92aWRlcmZyYW1ld29ya29uRXZlbnQ4Mzc3RjA3NkFybicsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgUHJ1bmVMYWJlbDogJ2F3cy5jZGsuZWtzL3BydW5lLWM4ZDhlMTcyMmE0ZjNlZDMzMmY4YWM3NGNiM2Q5NjJmMDFmYmI2MjI5MScsXG4gICAgICAgIE1hbmlmZXN0OiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICdbe1wiYXBpVmVyc2lvblwiOlwidjFcIixcImtpbmRcIjpcIlNlcnZpY2VBY2NvdW50XCIsXCJtZXRhZGF0YVwiOntcIm5hbWVcIjpcInN0YWNrY2x1c3Rlcm15c2VydmljZWFjY291bnQzNzNiOTMzY1wiLFwibmFtZXNwYWNlXCI6XCJkZWZhdWx0XCIsXCJsYWJlbHNcIjp7XCJhd3MuY2RrLmVrcy9wcnVuZS1jOGQ4ZTE3MjJhNGYzZWQzMzJmOGFjNzRjYjNkOTYyZjAxZmJiNjIyOTFcIjpcIlwiLFwiYXBwLmt1YmVybmV0ZXMuaW8vbmFtZVwiOlwic3RhY2tjbHVzdGVybXlzZXJ2aWNlYWNjb3VudDM3M2I5MzNjXCJ9LFwiYW5ub3RhdGlvbnNcIjp7XCJla3MuYW1hem9uYXdzLmNvbS9yb2xlLWFyblwiOlwiJyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ0NsdXN0ZXJNeVNlcnZpY2VBY2NvdW50Um9sZTg1MzM3QjI5JyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdcIn19fV0nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKGlhbS5DZm5Sb2xlLkNGTl9SRVNPVVJDRV9UWVBFX05BTUUsIHtcbiAgICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlV2l0aFdlYklkZW50aXR5JyxcbiAgICAgICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ0NsdXN0ZXJNeVNlcnZpY2VBY2NvdW50Q29uZGl0aW9uSnNvbjY3MUMwNjMzJyxcbiAgICAgICAgICAgICAgICAgICAgJ1ZhbHVlJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgICBGZWRlcmF0ZWQ6IHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0NsdXN0ZXJPcGVuSWRDb25uZWN0UHJvdmlkZXJBOEI4RTk4NycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ1NlcnZpY2UgQWNjb3VudCBuYW1lIG11c3QgZm9sbG93IEt1YmVybmV0ZXMgc3BlYycsICgpID0+IHtcbiAgICB0ZXN0KCd0aHJvdyBlcnJvciBvbiBjYXBpdGFsIGxldHRlcnMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBjbHVzdGVyIH0gPSB0ZXN0Rml4dHVyZUNsdXN0ZXIoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkU2VydmljZUFjY291bnQoJ0ludmFsaWRTZXJ2aWNlQWNjb3VudCcsIHtcbiAgICAgICAgbmFtZTogJ1hYWCcsXG4gICAgICB9KSlcbiAgICAgIC8vIFRIRU5cbiAgICAgICAgLnRvVGhyb3dFcnJvcihSYW5nZUVycm9yKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93IGVycm9yIGlmIGVuZHMgd2l0aCBkb3QnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBjbHVzdGVyIH0gPSB0ZXN0Rml4dHVyZUNsdXN0ZXIoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkU2VydmljZUFjY291bnQoJ0ludmFsaWRTZXJ2aWNlQWNjb3VudCcsIHtcbiAgICAgICAgbmFtZTogJ3Rlc3QuJyxcbiAgICAgIH0pKVxuICAgICAgLy8gVEhFTlxuICAgICAgICAudG9UaHJvd0Vycm9yKFJhbmdlRXJyb3IpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZG90IGluIHRoZSBuYW1lIGlzIGFsbG93ZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBjbHVzdGVyIH0gPSB0ZXN0Rml4dHVyZUNsdXN0ZXIoKTtcbiAgICAgIGNvbnN0IHZhbHVlV2l0aERvdCA9ICd0ZXN0Lm5hbWUnO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBzYSA9IGNsdXN0ZXIuYWRkU2VydmljZUFjY291bnQoJ0ludmFsaWRTZXJ2aWNlQWNjb3VudCcsIHtcbiAgICAgICAgbmFtZTogdmFsdWVXaXRoRG90LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChzYS5zZXJ2aWNlQWNjb3VudE5hbWUpLnRvRXF1YWwodmFsdWVXaXRoRG90KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93IGVycm9yIGlmIG5hbWUgaXMgdG9vIGxvbmcnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBjbHVzdGVyIH0gPSB0ZXN0Rml4dHVyZUNsdXN0ZXIoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkU2VydmljZUFjY291bnQoJ0ludmFsaWRTZXJ2aWNlQWNjb3VudCcsIHtcbiAgICAgICAgbmFtZTogJ3gnLnJlcGVhdCgyNTUpLFxuICAgICAgfSkpXG4gICAgICAvLyBUSEVOXG4gICAgICAgIC50b1Rocm93RXJyb3IoUmFuZ2VFcnJvcik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdTZXJ2aWNlIEFjY291bnQgbmFtZXNwYWNlIG11c3QgZm9sbG93IEt1YmVybmV0ZXMgc3BlYycsICgpID0+IHtcbiAgICB0ZXN0KCd0aHJvdyBlcnJvciBvbiBjYXBpdGFsIGxldHRlcnMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgeyBjbHVzdGVyIH0gPSB0ZXN0Rml4dHVyZUNsdXN0ZXIoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgZXhwZWN0KCgpID0+IGNsdXN0ZXIuYWRkU2VydmljZUFjY291bnQoJ0ludmFsaWRTZXJ2aWNlQWNjb3VudCcsIHtcbiAgICAgICAgbmFtZXNwYWNlOiAnWFhYJyxcbiAgICAgIH0pKVxuICAgICAgLy8gVEhFTlxuICAgICAgICAudG9UaHJvd0Vycm9yKFJhbmdlRXJyb3IpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3cgZXJyb3IgaWYgZW5kcyB3aXRoIGRvdCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IGNsdXN0ZXIgfSA9IHRlc3RGaXh0dXJlQ2x1c3RlcigpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBleHBlY3QoKCkgPT4gY2x1c3Rlci5hZGRTZXJ2aWNlQWNjb3VudCgnSW52YWxpZFNlcnZpY2VBY2NvdW50Jywge1xuICAgICAgICBuYW1lc3BhY2U6ICd0ZXN0LicsXG4gICAgICB9KSlcbiAgICAgIC8vIFRIRU5cbiAgICAgICAgLnRvVGhyb3dFcnJvcihSYW5nZUVycm9yKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93IGVycm9yIGlmIGRvdCBpcyBpbiB0aGUgbmFtZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCB7IGNsdXN0ZXIgfSA9IHRlc3RGaXh0dXJlQ2x1c3RlcigpO1xuICAgICAgY29uc3QgdmFsdWVXaXRoRG90ID0gJ3Rlc3QubmFtZSc7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiBjbHVzdGVyLmFkZFNlcnZpY2VBY2NvdW50KCdJbnZhbGlkU2VydmljZUFjY291bnQnLCB7XG4gICAgICAgIG5hbWVzcGFjZTogdmFsdWVXaXRoRG90LFxuICAgICAgfSkpXG4gICAgICAvLyBUSEVOXG4gICAgICAgIC50b1Rocm93RXJyb3IoUmFuZ2VFcnJvcik7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvdyBlcnJvciBpZiBuYW1lIGlzIHRvbyBsb25nJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHsgY2x1c3RlciB9ID0gdGVzdEZpeHR1cmVDbHVzdGVyKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGV4cGVjdCgoKSA9PiBjbHVzdGVyLmFkZFNlcnZpY2VBY2NvdW50KCdJbnZhbGlkU2VydmljZUFjY291bnQnLCB7XG4gICAgICAgIG5hbWVzcGFjZTogJ3gnLnJlcGVhdCg2NSksXG4gICAgICB9KSlcbiAgICAgIC8vIFRIRU5cbiAgICAgICAgLnRvVGhyb3dFcnJvcihSYW5nZUVycm9yKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==