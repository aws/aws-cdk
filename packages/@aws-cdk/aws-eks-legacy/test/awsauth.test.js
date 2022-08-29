"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const lib_1 = require("../lib");
const aws_auth_1 = require("../lib/aws-auth");
const util_1 = require("./util");
/* eslint-disable max-len */
cdk_build_tools_1.describeDeprecated('awsauth', () => {
    test('empty aws-auth', () => {
        // GIVEN
        const { stack } = util_1.testFixtureNoVpc();
        const cluster = new lib_1.Cluster(stack, 'cluster');
        // WHEN
        new aws_auth_1.AwsAuth(stack, 'AwsAuth', { cluster });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.KubernetesResource.RESOURCE_TYPE, {
            Manifest: JSON.stringify([{
                    apiVersion: 'v1',
                    kind: 'ConfigMap',
                    metadata: { name: 'aws-auth', namespace: 'kube-system' },
                    data: { mapRoles: '[]', mapUsers: '[]', mapAccounts: '[]' },
                }]),
        });
    });
    test('addRoleMapping and addUserMapping can be used to define the aws-auth ConfigMap', () => {
        // GIVEN
        const { stack } = util_1.testFixtureNoVpc();
        const cluster = new lib_1.Cluster(stack, 'Cluster');
        const role = new iam.Role(stack, 'role', { assumedBy: new iam.AnyPrincipal() });
        const user = new iam.User(stack, 'user');
        // WHEN
        cluster.awsAuth.addRoleMapping(role, { groups: ['role-group1'], username: 'roleuser' });
        cluster.awsAuth.addRoleMapping(role, { groups: ['role-group2', 'role-group3'] });
        cluster.awsAuth.addUserMapping(user, { groups: ['user-group1', 'user-group2'] });
        cluster.awsAuth.addUserMapping(user, { groups: ['user-group1', 'user-group2'], username: 'foo' });
        cluster.awsAuth.addAccount('112233');
        cluster.awsAuth.addAccount('5566776655');
        // THEN
        assertions_1.Template.fromStack(stack).resourceCountIs(lib_1.KubernetesResource.RESOURCE_TYPE, 1);
        assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.KubernetesResource.RESOURCE_TYPE, {
            Manifest: {
                'Fn::Join': [
                    '',
                    [
                        '[{"apiVersion":"v1","kind":"ConfigMap","metadata":{"name":"aws-auth","namespace":"kube-system"},"data":{"mapRoles":"[{\\"rolearn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'ClusterDefaultCapacityInstanceRole3E209969',
                                'Arn',
                            ],
                        },
                        '\\",\\"username\\":\\"system:node:{{EC2PrivateDNSName}}\\",\\"groups\\":[\\"system:bootstrappers\\",\\"system:nodes\\"]},{\\"rolearn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'roleC7B7E775',
                                'Arn',
                            ],
                        },
                        '\\",\\"username\\":\\"roleuser\\",\\"groups\\":[\\"role-group1\\"]},{\\"rolearn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'roleC7B7E775',
                                'Arn',
                            ],
                        },
                        '\\",\\"groups\\":[\\"role-group2\\",\\"role-group3\\"]}]","mapUsers":"[{\\"userarn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'user2C2B57AE',
                                'Arn',
                            ],
                        },
                        '\\",\\"groups\\":[\\"user-group1\\",\\"user-group2\\"]},{\\"userarn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'user2C2B57AE',
                                'Arn',
                            ],
                        },
                        '\\",\\"username\\":\\"foo\\",\\"groups\\":[\\"user-group1\\",\\"user-group2\\"]}]","mapAccounts":"[\\"112233\\",\\"5566776655\\"]"}}]',
                    ],
                ],
            },
        });
    });
    test('imported users and roles can be also be used', () => {
        // GIVEN
        const { stack } = util_1.testFixtureNoVpc();
        const cluster = new lib_1.Cluster(stack, 'Cluster');
        const role = iam.Role.fromRoleArn(stack, 'imported-role', 'arn:aws:iam::123456789012:role/S3Access');
        const user = iam.User.fromUserName(stack, 'import-user', 'MyUserName');
        // WHEN
        cluster.awsAuth.addRoleMapping(role, { groups: ['group1'] });
        cluster.awsAuth.addUserMapping(user, { groups: ['group2'] });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.KubernetesResource.RESOURCE_TYPE, {
            Manifest: {
                'Fn::Join': [
                    '',
                    [
                        '[{"apiVersion":"v1","kind":"ConfigMap","metadata":{"name":"aws-auth","namespace":"kube-system"},"data":{"mapRoles":"[{\\"rolearn\\":\\"',
                        {
                            'Fn::GetAtt': [
                                'ClusterDefaultCapacityInstanceRole3E209969',
                                'Arn',
                            ],
                        },
                        '\\",\\"username\\":\\"system:node:{{EC2PrivateDNSName}}\\",\\"groups\\":[\\"system:bootstrappers\\",\\"system:nodes\\"]},{\\"rolearn\\":\\"arn:aws:iam::123456789012:role/S3Access\\",\\"groups\\":[\\"group1\\"]}]","mapUsers":"[{\\"userarn\\":\\"arn:',
                        {
                            Ref: 'AWS::Partition',
                        },
                        ':iam::',
                        {
                            Ref: 'AWS::AccountId',
                        },
                        ':user/MyUserName\\",\\"groups\\":[\\"group2\\"]}]","mapAccounts":"[]"}}]',
                    ],
                ],
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzYXV0aC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXdzYXV0aC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUF3QztBQUN4Qyw4REFBOEQ7QUFDOUQsZ0NBQXFEO0FBQ3JELDhDQUEwQztBQUMxQyxpQ0FBMEM7QUFFMUMsNEJBQTRCO0FBRTVCLG9DQUFrQixDQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUU7SUFDakMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRTtRQUMxQixRQUFRO1FBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLHVCQUFnQixFQUFFLENBQUM7UUFDckMsTUFBTSxPQUFPLEdBQUcsSUFBSSxhQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRTlDLE9BQU87UUFDUCxJQUFJLGtCQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFFM0MsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUFrQixDQUFDLGFBQWEsRUFBRTtZQUNoRixRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUN4QixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsSUFBSSxFQUFFLFdBQVc7b0JBQ2pCLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRTtvQkFDeEQsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUU7aUJBQzVELENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztJQUVMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGdGQUFnRixFQUFFLEdBQUcsRUFBRTtRQUMxRixRQUFRO1FBQ1IsTUFBTSxFQUFF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Q0FBQztRQUV2RSxPQUFPO1FBQ1AsT0FBTyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdELE9BQU8sQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUU3RCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQWtCLENBQUMsYUFBYSxFQUFFO1lBQ2hGLFFBQVEsRUFBRTtnQkFDUixVQUFVLEVBQUU7b0JBQ1YsRUFBRTtvQkFDRjt3QkFDRSx5SUFBeUk7d0JBQ3pJOzRCQUNFLFlBQVksRUFBRTtnQ0FDWiw0Q0FBNEM7Z0NBQzVDLEtBQUs7NkJBQ047eUJBQ0Y7d0JBQ0QsMFBBQTBQO3dCQUMxUDs0QkFDRSxHQUFHLEVBQUUsZ0JBQWdCO3lCQUN0Qjt3QkFDRCxRQUFRO3dCQUNSOzRCQUNFLEdBQUcsRUFBRSxnQkFBZ0I7eUJBQ3RCO3dCQUNELDBFQUEwRTtxQkFDM0U7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUdMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgZGVzY3JpYmVEZXByZWNhdGVkIH0gZnJvbSAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJztcbmltcG9ydCB7IENsdXN0ZXIsIEt1YmVybmV0ZXNSZXNvdXJjZSB9IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBBd3NBdXRoIH0gZnJvbSAnLi4vbGliL2F3cy1hdXRoJztcbmltcG9ydCB7IHRlc3RGaXh0dXJlTm9WcGMgfSBmcm9tICcuL3V0aWwnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG5cbmRlc2NyaWJlRGVwcmVjYXRlZCgnYXdzYXV0aCcsICgpID0+IHtcbiAgdGVzdCgnZW1wdHkgYXdzLWF1dGgnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZU5vVnBjKCk7XG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyBDbHVzdGVyKHN0YWNrLCAnY2x1c3RlcicpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBBd3NBdXRoKHN0YWNrLCAnQXdzQXV0aCcsIHsgY2x1c3RlciB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhLdWJlcm5ldGVzUmVzb3VyY2UuUkVTT1VSQ0VfVFlQRSwge1xuICAgICAgTWFuaWZlc3Q6IEpTT04uc3RyaW5naWZ5KFt7XG4gICAgICAgIGFwaVZlcnNpb246ICd2MScsXG4gICAgICAgIGtpbmQ6ICdDb25maWdNYXAnLFxuICAgICAgICBtZXRhZGF0YTogeyBuYW1lOiAnYXdzLWF1dGgnLCBuYW1lc3BhY2U6ICdrdWJlLXN5c3RlbScgfSxcbiAgICAgICAgZGF0YTogeyBtYXBSb2xlczogJ1tdJywgbWFwVXNlcnM6ICdbXScsIG1hcEFjY291bnRzOiAnW10nIH0sXG4gICAgICB9XSksXG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnYWRkUm9sZU1hcHBpbmcgYW5kIGFkZFVzZXJNYXBwaW5nIGNhbiBiZSB1c2VkIHRvIGRlZmluZSB0aGUgYXdzLWF1dGggQ29uZmlnTWFwJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBzdGFjayB9ID0gdGVzdEZpeHR1cmVOb1ZwYygpO1xuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInKTtcbiAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAncm9sZScsIHsgYXNzdW1lZEJ5OiBuZXcgaWFtLkFueVByaW5jaXBhbCgpIH0pO1xuICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICd1c2VyJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY2x1c3Rlci5hd3NBdXRoLmFkZFJvbGVNYXBwaW5nKHJvbGUsIHsgZ3JvdXBzOiBbJ3JvbGUtZ3JvdXAxJ10sIHVzZXJuYW1lOiAncm9sZXVzZXInIH0pO1xuICAgIGNsdXN0ZXIuYXdzQXV0aC5hZGRSb2xlTWFwcGluZyhyb2xlLCB7IGdyb3VwczogWydyb2xlLWdyb3VwMicsICdyb2xlLWdyb3VwMyddIH0pO1xuICAgIGNsdXN0ZXIuYXdzQXV0aC5hZGRVc2VyTWFwcGluZyh1c2VyLCB7IGdyb3VwczogWyd1c2VyLWdyb3VwMScsICd1c2VyLWdyb3VwMiddIH0pO1xuICAgIGNsdXN0ZXIuYXdzQXV0aC5hZGRVc2VyTWFwcGluZyh1c2VyLCB7IGdyb3VwczogWyd1c2VyLWdyb3VwMScsICd1c2VyLWdyb3VwMiddLCB1c2VybmFtZTogJ2ZvbycgfSk7XG4gICAgY2x1c3Rlci5hd3NBdXRoLmFkZEFjY291bnQoJzExMjIzMycpO1xuICAgIGNsdXN0ZXIuYXdzQXV0aC5hZGRBY2NvdW50KCc1NTY2Nzc2NjU1Jyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoS3ViZXJuZXRlc1Jlc291cmNlLlJFU09VUkNFX1RZUEUsIDEpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKEt1YmVybmV0ZXNSZXNvdXJjZS5SRVNPVVJDRV9UWVBFLCB7XG4gICAgICBNYW5pZmVzdDoge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ1t7XCJhcGlWZXJzaW9uXCI6XCJ2MVwiLFwia2luZFwiOlwiQ29uZmlnTWFwXCIsXCJtZXRhZGF0YVwiOntcIm5hbWVcIjpcImF3cy1hdXRoXCIsXCJuYW1lc3BhY2VcIjpcImt1YmUtc3lzdGVtXCJ9LFwiZGF0YVwiOntcIm1hcFJvbGVzXCI6XCJbe1xcXFxcInJvbGVhcm5cXFxcXCI6XFxcXFwiJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0NsdXN0ZXJEZWZhdWx0Q2FwYWNpdHlJbnN0YW5jZVJvbGUzRTIwOTk2OScsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1xcXFxcIixcXFxcXCJ1c2VybmFtZVxcXFxcIjpcXFxcXCJzeXN0ZW06bm9kZTp7e0VDMlByaXZhdGVETlNOYW1lfX1cXFxcXCIsXFxcXFwiZ3JvdXBzXFxcXFwiOltcXFxcXCJzeXN0ZW06Ym9vdHN0cmFwcGVyc1xcXFxcIixcXFxcXCJzeXN0ZW06bm9kZXNcXFxcXCJdfSx7XFxcXFwicm9sZWFyblxcXFxcIjpcXFxcXCInLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAncm9sZUM3QjdFNzc1JyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnXFxcXFwiLFxcXFxcInVzZXJuYW1lXFxcXFwiOlxcXFxcInJvbGV1c2VyXFxcXFwiLFxcXFxcImdyb3Vwc1xcXFxcIjpbXFxcXFwicm9sZS1ncm91cDFcXFxcXCJdfSx7XFxcXFwicm9sZWFyblxcXFxcIjpcXFxcXCInLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAncm9sZUM3QjdFNzc1JyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnXFxcXFwiLFxcXFxcImdyb3Vwc1xcXFxcIjpbXFxcXFwicm9sZS1ncm91cDJcXFxcXCIsXFxcXFwicm9sZS1ncm91cDNcXFxcXCJdfV1cIixcIm1hcFVzZXJzXCI6XCJbe1xcXFxcInVzZXJhcm5cXFxcXCI6XFxcXFwiJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ3VzZXIyQzJCNTdBRScsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1xcXFxcIixcXFxcXCJncm91cHNcXFxcXCI6W1xcXFxcInVzZXItZ3JvdXAxXFxcXFwiLFxcXFxcInVzZXItZ3JvdXAyXFxcXFwiXX0se1xcXFxcInVzZXJhcm5cXFxcXCI6XFxcXFwiJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ3VzZXIyQzJCNTdBRScsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1xcXFxcIixcXFxcXCJ1c2VybmFtZVxcXFxcIjpcXFxcXCJmb29cXFxcXCIsXFxcXFwiZ3JvdXBzXFxcXFwiOltcXFxcXCJ1c2VyLWdyb3VwMVxcXFxcIixcXFxcXCJ1c2VyLWdyb3VwMlxcXFxcIl19XVwiLFwibWFwQWNjb3VudHNcIjpcIltcXFxcXCIxMTIyMzNcXFxcXCIsXFxcXFwiNTU2Njc3NjY1NVxcXFxcIl1cIn19XScsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdpbXBvcnRlZCB1c2VycyBhbmQgcm9sZXMgY2FuIGJlIGFsc28gYmUgdXNlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlTm9WcGMoKTtcbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IENsdXN0ZXIoc3RhY2ssICdDbHVzdGVyJyk7XG4gICAgY29uc3Qgcm9sZSA9IGlhbS5Sb2xlLmZyb21Sb2xlQXJuKHN0YWNrLCAnaW1wb3J0ZWQtcm9sZScsICdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvUzNBY2Nlc3MnKTtcbiAgICBjb25zdCB1c2VyID0gaWFtLlVzZXIuZnJvbVVzZXJOYW1lKHN0YWNrLCAnaW1wb3J0LXVzZXInLCAnTXlVc2VyTmFtZScpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNsdXN0ZXIuYXdzQXV0aC5hZGRSb2xlTWFwcGluZyhyb2xlLCB7IGdyb3VwczogWydncm91cDEnXSB9KTtcbiAgICBjbHVzdGVyLmF3c0F1dGguYWRkVXNlck1hcHBpbmcodXNlciwgeyBncm91cHM6IFsnZ3JvdXAyJ10gfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoS3ViZXJuZXRlc1Jlc291cmNlLlJFU09VUkNFX1RZUEUsIHtcbiAgICAgIE1hbmlmZXN0OiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnW3tcImFwaVZlcnNpb25cIjpcInYxXCIsXCJraW5kXCI6XCJDb25maWdNYXBcIixcIm1ldGFkYXRhXCI6e1wibmFtZVwiOlwiYXdzLWF1dGhcIixcIm5hbWVzcGFjZVwiOlwia3ViZS1zeXN0ZW1cIn0sXCJkYXRhXCI6e1wibWFwUm9sZXNcIjpcIlt7XFxcXFwicm9sZWFyblxcXFxcIjpcXFxcXCInLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnQ2x1c3RlckRlZmF1bHRDYXBhY2l0eUluc3RhbmNlUm9sZTNFMjA5OTY5JyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnXFxcXFwiLFxcXFxcInVzZXJuYW1lXFxcXFwiOlxcXFxcInN5c3RlbTpub2RlOnt7RUMyUHJpdmF0ZUROU05hbWV9fVxcXFxcIixcXFxcXCJncm91cHNcXFxcXCI6W1xcXFxcInN5c3RlbTpib290c3RyYXBwZXJzXFxcXFwiLFxcXFxcInN5c3RlbTpub2Rlc1xcXFxcIl19LHtcXFxcXCJyb2xlYXJuXFxcXFwiOlxcXFxcImFybjphd3M6aWFtOjoxMjM0NTY3ODkwMTI6cm9sZS9TM0FjY2Vzc1xcXFxcIixcXFxcXCJncm91cHNcXFxcXCI6W1xcXFxcImdyb3VwMVxcXFxcIl19XVwiLFwibWFwVXNlcnNcIjpcIlt7XFxcXFwidXNlcmFyblxcXFxcIjpcXFxcXCJhcm46JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6aWFtOjonLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJzp1c2VyL015VXNlck5hbWVcXFxcXCIsXFxcXFwiZ3JvdXBzXFxcXFwiOltcXFxcXCJncm91cDJcXFxcXCJdfV1cIixcIm1hcEFjY291bnRzXCI6XCJbXVwifX1dJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcblxuXG4gIH0pO1xufSk7XG4iXX0=