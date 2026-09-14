"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const lambda_layer_kubectl_v31_1 = require("@aws-cdk/lambda-layer-kubectl-v31");
const assertions_1 = require("aws-cdk-lib/assertions");
const iam = require("aws-cdk-lib/aws-iam");
const util_1 = require("./util");
const lib_1 = require("../lib");
const versions = Object.values(lib_1.AlbControllerVersion);
test.each(versions)('support AlbControllerVersion (%s)', (version) => {
    const { stack } = (0, util_1.testFixture)();
    const cluster = new lib_1.Cluster(stack, 'Cluster', {
        version: lib_1.KubernetesVersion.V1_27,
        kubectlProviderOptions: {
            kubectlLayer: new lambda_layer_kubectl_v31_1.KubectlV31Layer(stack, 'kubectlLayer'),
        },
    });
    lib_1.AlbController.create(stack, {
        cluster,
        version,
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.HelmChart.RESOURCE_TYPE, {
        Version: version.helmChartVersion,
        Values: {
            'Fn::Join': [
                '',
                [
                    '{"clusterName":"',
                    {
                        Ref: 'ClusterEB0386A7',
                    },
                    '","serviceAccount":{"create":false,"name":"aws-load-balancer-controller"},"region":"us-east-1","vpcId":"',
                    {
                        Ref: 'ClusterDefaultVpcFA9F2722',
                    },
                    `","image":{"repository":"602401143452.dkr.ecr.us-west-2.amazonaws.com/amazon/aws-load-balancer-controller","tag":"${version.version}"}}`,
                ],
            ],
        },
    });
});
test('all vended policies are valid', () => {
    const addOnsDir = path.join(__dirname, '..', 'lib', 'addons');
    for (const addOn of fs.readdirSync(addOnsDir)) {
        if (addOn.startsWith('alb-iam_policy')) {
            const policy = JSON.parse(fs.readFileSync(path.join(addOnsDir, addOn)).toString());
            try {
                for (const statement of policy.Statement) {
                    iam.PolicyStatement.fromJson(statement);
                }
            }
            catch (error) {
                throw new Error(`Invalid policy: ${addOn}: ${error}`);
            }
        }
    }
});
test('can configure a custom repository', () => {
    const { stack } = (0, util_1.testFixture)();
    const cluster = new lib_1.Cluster(stack, 'Cluster', {
        version: lib_1.KubernetesVersion.V1_27,
        kubectlProviderOptions: {
            kubectlLayer: new lambda_layer_kubectl_v31_1.KubectlV31Layer(stack, 'kubectlLayer'),
        },
    });
    lib_1.AlbController.create(stack, {
        cluster,
        version: lib_1.AlbControllerVersion.V2_6_2,
        repository: 'custom',
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.HelmChart.RESOURCE_TYPE, {
        Values: {
            'Fn::Join': [
                '',
                [
                    '{"clusterName":"',
                    {
                        Ref: 'ClusterEB0386A7',
                    },
                    '","serviceAccount":{"create":false,"name":"aws-load-balancer-controller"},"region":"us-east-1","vpcId":"',
                    {
                        Ref: 'ClusterDefaultVpcFA9F2722',
                    },
                    '","image":{"repository":"custom","tag":"v2.6.2"}}',
                ],
            ],
        },
    });
});
test('throws when a policy is not defined for a custom version', () => {
    const { stack } = (0, util_1.testFixture)();
    const cluster = new lib_1.Cluster(stack, 'Cluster', {
        version: lib_1.KubernetesVersion.V1_27,
        kubectlProviderOptions: {
            kubectlLayer: new lambda_layer_kubectl_v31_1.KubectlV31Layer(stack, 'kubectlLayer'),
        },
    });
    expect(() => lib_1.AlbController.create(stack, {
        cluster,
        version: lib_1.AlbControllerVersion.of('custom'),
    })).toThrow("'albControllerOptions.policy' is required when using a custom controller version");
});
test.each(['us-gov-west-1', 'cn-north-1'])('stack does not include hard-coded partition', (region) => {
    const { stack } = (0, util_1.testFixture)(region);
    const cluster = new lib_1.Cluster(stack, 'Cluster', {
        version: lib_1.KubernetesVersion.V1_27,
        kubectlProviderOptions: {
            kubectlLayer: new lambda_layer_kubectl_v31_1.KubectlV31Layer(stack, 'kubectlLayer'),
        },
    });
    lib_1.AlbController.create(stack, {
        cluster,
        version: lib_1.AlbControllerVersion.V2_6_2,
    });
    const template = assertions_1.Template.fromStack(stack);
    expect(JSON.stringify(template)).not.toContain('arn:aws');
});
test('correct helm chart version is set for selected alb controller version', () => {
    const { stack } = (0, util_1.testFixture)();
    const cluster = new lib_1.Cluster(stack, 'Cluster', {
        version: lib_1.KubernetesVersion.V1_27,
        kubectlProviderOptions: {
            kubectlLayer: new lambda_layer_kubectl_v31_1.KubectlV31Layer(stack, 'kubectlLayer'),
        },
    });
    lib_1.AlbController.create(stack, {
        cluster,
        version: lib_1.AlbControllerVersion.V2_6_2,
        repository: 'custom',
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.HelmChart.RESOURCE_TYPE, {
        Version: '1.6.2', // The helm chart version associated with AlbControllerVersion.V2_6_2
        Values: {
            'Fn::Join': [
                '',
                [
                    '{"clusterName":"',
                    {
                        Ref: 'ClusterEB0386A7',
                    },
                    '","serviceAccount":{"create":false,"name":"aws-load-balancer-controller"},"region":"us-east-1","vpcId":"',
                    {
                        Ref: 'ClusterDefaultVpcFA9F2722',
                    },
                    '","image":{"repository":"custom","tag":"v2.6.2"}}',
                ],
            ],
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxiLWNvbnRyb2xsZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFsYi1jb250cm9sbGVyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLGdGQUFvRTtBQUNwRSx1REFBa0Q7QUFDbEQsMkNBQTJDO0FBQzNDLGlDQUFxQztBQUNyQyxnQ0FBb0c7QUFFcEcsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQywwQkFBb0IsQ0FBQyxDQUFDO0FBRXJELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsbUNBQW1DLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRTtJQUNuRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBQSxrQkFBVyxHQUFFLENBQUM7SUFFaEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxhQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUM1QyxPQUFPLEVBQUUsdUJBQWlCLENBQUMsS0FBSztRQUNoQyxzQkFBc0IsRUFBRTtZQUN0QixZQUFZLEVBQUUsSUFBSSwwQ0FBZSxDQUFDLEtBQUssRUFBRSxjQUFjLENBQUM7U0FDekQ7S0FDRixDQUFDLENBQUM7SUFDSCxtQkFBYSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7UUFDMUIsT0FBTztRQUNQLE9BQU87S0FDUixDQUFDLENBQUM7SUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFTLENBQUMsYUFBYSxFQUFFO1FBQ3ZFLE9BQU8sRUFBRSxPQUFPLENBQUMsZ0JBQWdCO1FBQ2pDLE1BQU0sRUFBRTtZQUNOLFVBQVUsRUFBRTtnQkFDVixFQUFFO2dCQUNGO29CQUNFLGtCQUFrQjtvQkFDbEI7d0JBQ0UsR0FBRyxFQUFFLGlCQUFpQjtxQkFDdkI7b0JBQ0QsMEdBQTBHO29CQUMxRzt3QkFDRSxHQUFHLEVBQUUsMkJBQTJCO3FCQUNq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QUUsY0FBYyxDQUFDO1NBQ3pEO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsbUJBQWEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQzFCLE9BQU87UUFDUCxPQUFPLEVBQUUsMEJBQW9CLENBQUMsTUFBTTtRQUNwQyxVQUFVLEVBQUUsUUFBUTtLQUNyQixDQUFDLENBQUM7SUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxlQUFTLENBQUMsYUFBYSxFQUFFO1FBQ3ZFLE9BQU8sRUFBRSxPQUFPLEVBQUUscUVBQXFFO1FBQ3ZGLE1BQU0sRUFBRTtZQUNOLFVBQVUsRUFBRTtnQkFDVixFQUFFO2dCQUNGO29CQUNFLGtCQUFrQjtvQkFDbEI7d0JBQ0UsR0FBRyxFQUFFLGlCQUFpQjtxQkFDdkI7b0JBQ0QsMEdBQTBHO29CQUMxRzt3QkFDRSxHQUFHLEVBQUUsMkJBQTJCO3FCQUNqQztvQkFDRCxtREFBbUQ7aUJBQ3BEO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IEt1YmVjdGxWMzFMYXllciB9IGZyb20gJ0Bhd3MtY2RrL2xhbWJkYS1sYXllci1rdWJlY3RsLXYzMSc7XG5pbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ2F3cy1jZGstbGliL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0IHsgdGVzdEZpeHR1cmUgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgQ2x1c3RlciwgS3ViZXJuZXRlc1ZlcnNpb24sIEFsYkNvbnRyb2xsZXIsIEFsYkNvbnRyb2xsZXJWZXJzaW9uLCBIZWxtQ2hhcnQgfSBmcm9tICcuLi9saWInO1xuXG5jb25zdCB2ZXJzaW9ucyA9IE9iamVjdC52YWx1ZXMoQWxiQ29udHJvbGxlclZlcnNpb24pO1xuXG50ZXN0LmVhY2godmVyc2lvbnMpKCdzdXBwb3J0IEFsYkNvbnRyb2xsZXJWZXJzaW9uICglcyknLCAodmVyc2lvbikgPT4ge1xuICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgdmVyc2lvbjogS3ViZXJuZXRlc1ZlcnNpb24uVjFfMjcsXG4gICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAga3ViZWN0bExheWVyOiBuZXcgS3ViZWN0bFYzMUxheWVyKHN0YWNrLCAna3ViZWN0bExheWVyJyksXG4gICAgfSxcbiAgfSk7XG4gIEFsYkNvbnRyb2xsZXIuY3JlYXRlKHN0YWNrLCB7XG4gICAgY2x1c3RlcixcbiAgICB2ZXJzaW9uLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhIZWxtQ2hhcnQuUkVTT1VSQ0VfVFlQRSwge1xuICAgIFZlcnNpb246IHZlcnNpb24uaGVsbUNoYXJ0VmVyc2lvbixcbiAgICBWYWx1ZXM6IHtcbiAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgJycsXG4gICAgICAgIFtcbiAgICAgICAgICAne1wiY2x1c3Rlck5hbWVcIjpcIicsXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnQ2x1c3RlckVCMDM4NkE3JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdcIixcInNlcnZpY2VBY2NvdW50XCI6e1wiY3JlYXRlXCI6ZmFsc2UsXCJuYW1lXCI6XCJhd3MtbG9hZC1iYWxhbmNlci1jb250cm9sbGVyXCJ9LFwicmVnaW9uXCI6XCJ1cy1lYXN0LTFcIixcInZwY0lkXCI6XCInLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ0NsdXN0ZXJEZWZhdWx0VnBjRkE5RjI3MjInLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYFwiLFwiaW1hZ2VcIjp7XCJyZXBvc2l0b3J5XCI6XCI2MDI0MDExNDM0NTIuZGtyLmVjci51cy13ZXN0LTIuYW1hem9uYXdzLmNvbS9hbWF6b24vYXdzLWxvYWQtYmFsYW5jZXItY29udHJvbGxlclwiLFwidGFnXCI6XCIke3ZlcnNpb24udmVyc2lvbn1cIn19YCxcbiAgICAgICAgXSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnYWxsIHZlbmRlZCBwb2xpY2llcyBhcmUgdmFsaWQnLCAoKSA9PiB7XG4gIGNvbnN0IGFkZE9uc0RpciA9IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICdsaWInLCAnYWRkb25zJyk7XG5cbiAgZm9yIChjb25zdCBhZGRPbiBvZiBmcy5yZWFkZGlyU3luYyhhZGRPbnNEaXIpKSB7XG4gICAgaWYgKGFkZE9uLnN0YXJ0c1dpdGgoJ2FsYi1pYW1fcG9saWN5JykpIHtcbiAgICAgIGNvbnN0IHBvbGljeSA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKHBhdGguam9pbihhZGRPbnNEaXIsIGFkZE9uKSkudG9TdHJpbmcoKSk7XG4gICAgICB0cnkge1xuICAgICAgICBmb3IgKGNvbnN0IHN0YXRlbWVudCBvZiBwb2xpY3kuU3RhdGVtZW50KSB7XG4gICAgICAgICAgaWFtLlBvbGljeVN0YXRlbWVudC5mcm9tSnNvbihzdGF0ZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcG9saWN5OiAke2FkZE9ufTogJHtlcnJvcn1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuXG50ZXN0KCdjYW4gY29uZmlndXJlIGEgY3VzdG9tIHJlcG9zaXRvcnknLCAoKSA9PiB7XG4gIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgY29uc3QgY2x1c3RlciA9IG5ldyBDbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICB2ZXJzaW9uOiBLdWJlcm5ldGVzVmVyc2lvbi5WMV8yNyxcbiAgICBrdWJlY3RsUHJvdmlkZXJPcHRpb25zOiB7XG4gICAgICBrdWJlY3RsTGF5ZXI6IG5ldyBLdWJlY3RsVjMxTGF5ZXIoc3RhY2ssICdrdWJlY3RsTGF5ZXInKSxcbiAgICB9LFxuICB9KTtcblxuICBBbGJDb250cm9sbGVyLmNyZWF0ZShzdGFjaywge1xuICAgIGNsdXN0ZXIsXG4gICAgdmVyc2lvbjogQWxiQ29udHJvbGxlclZlcnNpb24uVjJfNl8yLFxuICAgIHJlcG9zaXRvcnk6ICdjdXN0b20nLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcyhIZWxtQ2hhcnQuUkVTT1VSQ0VfVFlQRSwge1xuICAgIFZhbHVlczoge1xuICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAnJyxcbiAgICAgICAgW1xuICAgICAgICAgICd7XCJjbHVzdGVyTmFtZVwiOlwiJyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdDbHVzdGVyRUIwMzg2QTcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1wiLFwic2VydmljZUFjY291bnRcIjp7XCJjcmVhdGVcIjpmYWxzZSxcIm5hbWVcIjpcImF3cy1sb2FkLWJhbGFuY2VyLWNvbnRyb2xsZXJcIn0sXCJyZWdpb25cIjpcInVzLWVhc3QtMVwiLFwidnBjSWRcIjpcIicsXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnQ2x1c3RlckRlZmF1bHRWcGNGQTlGMjcyMicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnXCIsXCJpbWFnZVwiOntcInJlcG9zaXRvcnlcIjpcImN1c3RvbVwiLFwidGFnXCI6XCJ2Mi42LjJcIn19JyxcbiAgICAgICAgXSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgndGhyb3dzIHdoZW4gYSBwb2xpY3kgaXMgbm90IGRlZmluZWQgZm9yIGEgY3VzdG9tIHZlcnNpb24nLCAoKSA9PiB7XG4gIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgY29uc3QgY2x1c3RlciA9IG5ldyBDbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICB2ZXJzaW9uOiBLdWJlcm5ldGVzVmVyc2lvbi5WMV8yNyxcbiAgICBrdWJlY3RsUHJvdmlkZXJPcHRpb25zOiB7XG4gICAgICBrdWJlY3RsTGF5ZXI6IG5ldyBLdWJlY3RsVjMxTGF5ZXIoc3RhY2ssICdrdWJlY3RsTGF5ZXInKSxcbiAgICB9LFxuICB9KTtcblxuICBleHBlY3QoKCkgPT4gQWxiQ29udHJvbGxlci5jcmVhdGUoc3RhY2ssIHtcbiAgICBjbHVzdGVyLFxuICAgIHZlcnNpb246IEFsYkNvbnRyb2xsZXJWZXJzaW9uLm9mKCdjdXN0b20nKSxcbiAgfSkpLnRvVGhyb3coXCInYWxiQ29udHJvbGxlck9wdGlvbnMucG9saWN5JyBpcyByZXF1aXJlZCB3aGVuIHVzaW5nIGEgY3VzdG9tIGNvbnRyb2xsZXIgdmVyc2lvblwiKTtcbn0pO1xuXG50ZXN0LmVhY2goWyd1cy1nb3Ytd2VzdC0xJywgJ2NuLW5vcnRoLTEnXSkoJ3N0YWNrIGRvZXMgbm90IGluY2x1ZGUgaGFyZC1jb2RlZCBwYXJ0aXRpb24nLCAocmVnaW9uKSA9PiB7XG4gIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKHJlZ2lvbik7XG4gIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgdmVyc2lvbjogS3ViZXJuZXRlc1ZlcnNpb24uVjFfMjcsXG4gICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAga3ViZWN0bExheWVyOiBuZXcgS3ViZWN0bFYzMUxheWVyKHN0YWNrLCAna3ViZWN0bExheWVyJyksXG4gICAgfSxcbiAgfSk7XG5cbiAgQWxiQ29udHJvbGxlci5jcmVhdGUoc3RhY2ssIHtcbiAgICBjbHVzdGVyLFxuICAgIHZlcnNpb246IEFsYkNvbnRyb2xsZXJWZXJzaW9uLlYyXzZfMixcbiAgfSk7XG5cbiAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICBleHBlY3QoSlNPTi5zdHJpbmdpZnkodGVtcGxhdGUpKS5ub3QudG9Db250YWluKCdhcm46YXdzJyk7XG59KTtcblxudGVzdCgnY29ycmVjdCBoZWxtIGNoYXJ0IHZlcnNpb24gaXMgc2V0IGZvciBzZWxlY3RlZCBhbGIgY29udHJvbGxlciB2ZXJzaW9uJywgKCkgPT4ge1xuICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgdmVyc2lvbjogS3ViZXJuZXRlc1ZlcnNpb24uVjFfMjcsXG4gICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAga3ViZWN0bExheWVyOiBuZXcgS3ViZWN0bFYzMUxheWVyKHN0YWNrLCAna3ViZWN0bExheWVyJyksXG4gICAgfSxcbiAgfSk7XG5cbiAgQWxiQ29udHJvbGxlci5jcmVhdGUoc3RhY2ssIHtcbiAgICBjbHVzdGVyLFxuICAgIHZlcnNpb246IEFsYkNvbnRyb2xsZXJWZXJzaW9uLlYyXzZfMixcbiAgICByZXBvc2l0b3J5OiAnY3VzdG9tJyxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoSGVsbUNoYXJ0LlJFU09VUkNFX1RZUEUsIHtcbiAgICBWZXJzaW9uOiAnMS42LjInLCAvLyBUaGUgaGVsbSBjaGFydCB2ZXJzaW9uIGFzc29jaWF0ZWQgd2l0aCBBbGJDb250cm9sbGVyVmVyc2lvbi5WMl82XzJcbiAgICBWYWx1ZXM6IHtcbiAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgJycsXG4gICAgICAgIFtcbiAgICAgICAgICAne1wiY2x1c3Rlck5hbWVcIjpcIicsXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnQ2x1c3RlckVCMDM4NkE3JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdcIixcInNlcnZpY2VBY2NvdW50XCI6e1wiY3JlYXRlXCI6ZmFsc2UsXCJuYW1lXCI6XCJhd3MtbG9hZC1iYWxhbmNlci1jb250cm9sbGVyXCJ9LFwicmVnaW9uXCI6XCJ1cy1lYXN0LTFcIixcInZwY0lkXCI6XCInLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ0NsdXN0ZXJEZWZhdWx0VnBjRkE5RjI3MjInLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1wiLFwiaW1hZ2VcIjp7XCJyZXBvc2l0b3J5XCI6XCJjdXN0b21cIixcInRhZ1wiOlwidjIuNi4yXCJ9fScsXG4gICAgICAgIF0sXG4gICAgICBdLFxuICAgIH0sXG4gIH0pO1xufSk7XG4iXX0=