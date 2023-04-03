"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const lib_1 = require("../../lib");
describe('RequireImdsv2Aspect', () => {
    let app;
    let stack;
    let vpc;
    beforeEach(() => {
        app = new cdk.App();
        stack = new cdk.Stack(app, 'Stack');
        vpc = new lib_1.Vpc(stack, 'Vpc');
    });
    test('suppresses warnings', () => {
        // GIVEN
        const aspect = new lib_1.LaunchTemplateRequireImdsv2Aspect({
            suppressWarnings: true,
        });
        const errmsg = 'ERROR';
        const visitMock = jest.spyOn(aspect, 'visit').mockImplementation((node) => {
            // @ts-ignore
            aspect.warn(node, errmsg);
        });
        const construct = new constructs_1.Construct(stack, 'Construct');
        // WHEN
        aspect.visit(construct);
        // THEN
        expect(visitMock).toHaveBeenCalled();
        assertions_1.Annotations.fromStack(stack).hasNoWarning('/Stack/Construct', errmsg);
    });
    describe('InstanceRequireImdsv2Aspect', () => {
        test('requires IMDSv2', () => {
            // GIVEN
            const instance = new lib_1.Instance(stack, 'Instance', {
                vpc,
                instanceType: new lib_1.InstanceType('t2.micro'),
                machineImage: lib_1.MachineImage.latestAmazonLinux(),
            });
            const aspect = new lib_1.InstanceRequireImdsv2Aspect();
            // WHEN
            cdk.Aspects.of(stack).add(aspect);
            app.synth();
            // THEN
            const launchTemplate = instance.node.tryFindChild('LaunchTemplate');
            expect(launchTemplate).toBeDefined();
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
                LaunchTemplateName: stack.resolve(launchTemplate.launchTemplateName),
                LaunchTemplateData: {
                    MetadataOptions: {
                        HttpTokens: 'required',
                    },
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::Instance', {
                LaunchTemplate: {
                    LaunchTemplateName: stack.resolve(launchTemplate.launchTemplateName),
                },
            });
        });
        test('does not toggle when Instance has a LaunchTemplate', () => {
            // GIVEN
            const instance = new lib_1.Instance(stack, 'Instance', {
                vpc,
                instanceType: new lib_1.InstanceType('t2.micro'),
                machineImage: lib_1.MachineImage.latestAmazonLinux(),
            });
            instance.instance.launchTemplate = {
                launchTemplateName: 'name',
                version: 'version',
            };
            const aspect = new lib_1.InstanceRequireImdsv2Aspect();
            // WHEN
            cdk.Aspects.of(stack).add(aspect);
            // THEN
            // Aspect normally creates a LaunchTemplate for the Instance to toggle IMDSv1,
            // so we can assert that one was not created
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::LaunchTemplate', 0);
            assertions_1.Annotations.fromStack(stack).hasWarning('/Stack/Instance', assertions_1.Match.stringLikeRegexp('.*Cannot toggle IMDSv1 because this Instance is associated with an existing Launch Template.'));
        });
        test('suppresses Launch Template warnings', () => {
            // GIVEN
            const instance = new lib_1.Instance(stack, 'Instance', {
                vpc,
                instanceType: new lib_1.InstanceType('t2.micro'),
                machineImage: lib_1.MachineImage.latestAmazonLinux(),
            });
            instance.instance.launchTemplate = {
                launchTemplateName: 'name',
                version: 'version',
            };
            const aspect = new lib_1.InstanceRequireImdsv2Aspect({
                suppressLaunchTemplateWarning: true,
            });
            // WHEN
            aspect.visit(instance);
            // THEN
            assertions_1.Annotations.fromStack(stack).hasNoWarning('/Stack/Instance', 'Cannot toggle IMDSv1 because this Instance is associated with an existing Launch Template.');
        });
        test('launch template name is unique with feature flag', () => {
            // GIVEN
            const app2 = new cdk.App();
            const otherStack = new cdk.Stack(app2, 'OtherStack');
            const otherVpc = new lib_1.Vpc(otherStack, 'OtherVpc');
            const otherInstance = new lib_1.Instance(otherStack, 'OtherInstance', {
                vpc: otherVpc,
                instanceType: new lib_1.InstanceType('t2.micro'),
                machineImage: lib_1.MachineImage.latestAmazonLinux(),
            });
            const imdsv2Stack = new cdk.Stack(app2, 'RequireImdsv2Stack');
            const imdsv2Vpc = new lib_1.Vpc(imdsv2Stack, 'Vpc');
            const instance = new lib_1.Instance(imdsv2Stack, 'Instance', {
                vpc: imdsv2Vpc,
                instanceType: new lib_1.InstanceType('t2.micro'),
                machineImage: lib_1.MachineImage.latestAmazonLinux(),
            });
            const aspect = new lib_1.InstanceRequireImdsv2Aspect();
            // WHEN
            cdk.Aspects.of(imdsv2Stack).add(aspect);
            cdk.Aspects.of(otherStack).add(aspect);
            app2.synth();
            // THEN
            const launchTemplate = instance.node.tryFindChild('LaunchTemplate');
            const otherLaunchTemplate = otherInstance.node.tryFindChild('LaunchTemplate');
            expect(launchTemplate).toBeDefined();
            expect(otherLaunchTemplate).toBeDefined();
            expect(launchTemplate.launchTemplateName !== otherLaunchTemplate.launchTemplateName);
        });
    });
    describe('LaunchTemplateRequireImdsv2Aspect', () => {
        test('warns when LaunchTemplateData is a CDK token', () => {
            // GIVEN
            const launchTemplate = new lib_1.LaunchTemplate(stack, 'LaunchTemplate');
            const cfnLaunchTemplate = launchTemplate.node.tryFindChild('Resource');
            cfnLaunchTemplate.launchTemplateData = cdk.Token.asAny({
                kernelId: 'asfd',
            });
            const aspect = new lib_1.LaunchTemplateRequireImdsv2Aspect();
            // WHEN
            aspect.visit(launchTemplate);
            // THEN
            assertions_1.Annotations.fromStack(stack).hasWarning('/Stack/LaunchTemplate', assertions_1.Match.stringLikeRegexp('.*LaunchTemplateData is a CDK token.'));
        });
        test('warns when MetadataOptions is a CDK token', () => {
            // GIVEN
            const launchTemplate = new lib_1.LaunchTemplate(stack, 'LaunchTemplate');
            const cfnLaunchTemplate = launchTemplate.node.tryFindChild('Resource');
            cfnLaunchTemplate.launchTemplateData = {
                metadataOptions: cdk.Token.asAny({
                    httpEndpoint: 'http://bla',
                }),
            };
            const aspect = new lib_1.LaunchTemplateRequireImdsv2Aspect();
            // WHEN
            aspect.visit(launchTemplate);
            // THEN
            assertions_1.Annotations.fromStack(stack).hasWarning('/Stack/LaunchTemplate', assertions_1.Match.stringLikeRegexp('.*LaunchTemplateData.MetadataOptions is a CDK token.'));
        });
        test('requires IMDSv2', () => {
            // GIVEN
            new lib_1.LaunchTemplate(stack, 'LaunchTemplate');
            const aspect = new lib_1.LaunchTemplateRequireImdsv2Aspect();
            // WHEN
            cdk.Aspects.of(stack).add(aspect);
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::LaunchTemplate', {
                LaunchTemplateData: {
                    MetadataOptions: {
                        HttpTokens: 'required',
                    },
                },
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWlyZS1pbWRzdjItYXNwZWN0LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZXF1aXJlLWltZHN2Mi1hc3BlY3QudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFtRTtBQUNuRSxxQ0FBcUM7QUFDckMsMkNBQXVDO0FBQ3ZDLG1DQVNtQjtBQUVuQixRQUFRLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO0lBQ25DLElBQUksR0FBWSxDQUFDO0lBQ2pCLElBQUksS0FBZ0IsQ0FBQztJQUNyQixJQUFJLEdBQVEsQ0FBQztJQUViLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDcEIsS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDcEMsR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM5QixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7UUFDL0IsUUFBUTtRQUNSLE1BQU0sTUFBTSxHQUFHLElBQUksdUNBQWlDLENBQUM7WUFDbkQsZ0JBQWdCLEVBQUUsSUFBSTtTQUN2QixDQUFDLENBQUM7UUFDSCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUM7UUFDdkIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUN4RSxhQUFhO1lBQ2IsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLFNBQVMsR0FBRyxJQUFJLHNCQUFTLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FB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O2FBQ0EsQ0FBQztZQUNsRCxNQUFNLE1BQU0sR0FBRyxJQUFJLHVDQUFpQyxFQUFFLENBQUM7WUFFdkQsT0FBTztZQUNQLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFN0IsT0FBTztZQUNQLHdCQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsRUFBRSxrQkFBSyxDQUFDLGdCQUFnQixDQUFDLHNEQUFzRCxDQUFDLENBQUMsQ0FBQztRQUNuSixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7WUFDM0IsUUFBUTtZQUNSLElBQUksb0JBQWMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUM1QyxNQUFNLE1BQU0sR0FBRyxJQUFJLHVDQUFpQyxFQUFFLENBQUM7WUFFdkQsT0FBTztZQUNQLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVsQyxPQUFPO1lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsMEJBQTBCLEVBQUU7Z0JBQzFFLGtCQUFrQixFQUFFO29CQUNsQixlQUFlLEVBQUU7d0JBQ2YsVUFBVSxFQUFFLFVBQVU7cUJBQ3ZCO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQW5ub3RhdGlvbnMsIFRlbXBsYXRlLCBNYXRjaCB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQge1xuICBDZm5MYXVuY2hUZW1wbGF0ZSxcbiAgSW5zdGFuY2UsXG4gIEluc3RhbmNlUmVxdWlyZUltZHN2MkFzcGVjdCxcbiAgSW5zdGFuY2VUeXBlLFxuICBMYXVuY2hUZW1wbGF0ZSxcbiAgTGF1bmNoVGVtcGxhdGVSZXF1aXJlSW1kc3YyQXNwZWN0LFxuICBNYWNoaW5lSW1hZ2UsXG4gIFZwYyxcbn0gZnJvbSAnLi4vLi4vbGliJztcblxuZGVzY3JpYmUoJ1JlcXVpcmVJbWRzdjJBc3BlY3QnLCAoKSA9PiB7XG4gIGxldCBhcHA6IGNkay5BcHA7XG4gIGxldCBzdGFjazogY2RrLlN0YWNrO1xuICBsZXQgdnBjOiBWcGM7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnU3RhY2snKTtcbiAgICB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVnBjJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N1cHByZXNzZXMgd2FybmluZ3MnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhc3BlY3QgPSBuZXcgTGF1bmNoVGVtcGxhdGVSZXF1aXJlSW1kc3YyQXNwZWN0KHtcbiAgICAgIHN1cHByZXNzV2FybmluZ3M6IHRydWUsXG4gICAgfSk7XG4gICAgY29uc3QgZXJybXNnID0gJ0VSUk9SJztcbiAgICBjb25zdCB2aXNpdE1vY2sgPSBqZXN0LnNweU9uKGFzcGVjdCwgJ3Zpc2l0JykubW9ja0ltcGxlbWVudGF0aW9uKChub2RlKSA9PiB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBhc3BlY3Qud2Fybihub2RlLCBlcnJtc2cpO1xuICAgIH0pO1xuICAgIGNvbnN0IGNvbnN0cnVjdCA9IG5ldyBDb25zdHJ1Y3Qoc3RhY2ssICdDb25zdHJ1Y3QnKTtcblxuICAgIC8vIFdIRU5cbiAgICBhc3BlY3QudmlzaXQoY29uc3RydWN0KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodmlzaXRNb2NrKS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgQW5ub3RhdGlvbnMuZnJvbVN0YWNrKHN0YWNrKS5oYXNOb1dhcm5pbmcoJy9TdGFjay9Db25zdHJ1Y3QnLCBlcnJtc2cpO1xuICB9KTtcblxuICBkZXNjcmliZSgnSW5zdGFuY2VSZXF1aXJlSW1kc3YyQXNwZWN0JywgKCkgPT4ge1xuICAgIHRlc3QoJ3JlcXVpcmVzIElNRFN2MicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBpbnN0YW5jZSA9IG5ldyBJbnN0YW5jZShzdGFjaywgJ0luc3RhbmNlJywge1xuICAgICAgICB2cGMsXG4gICAgICAgIGluc3RhbmNlVHlwZTogbmV3IEluc3RhbmNlVHlwZSgndDIubWljcm8nKSxcbiAgICAgICAgbWFjaGluZUltYWdlOiBNYWNoaW5lSW1hZ2UubGF0ZXN0QW1hem9uTGludXgoKSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgYXNwZWN0ID0gbmV3IEluc3RhbmNlUmVxdWlyZUltZHN2MkFzcGVjdCgpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjZGsuQXNwZWN0cy5vZihzdGFjaykuYWRkKGFzcGVjdCk7XG4gICAgICBhcHAuc3ludGgoKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgY29uc3QgbGF1bmNoVGVtcGxhdGUgPSBpbnN0YW5jZS5ub2RlLnRyeUZpbmRDaGlsZCgnTGF1bmNoVGVtcGxhdGUnKSBhcyBMYXVuY2hUZW1wbGF0ZTtcbiAgICAgIGV4cGVjdChsYXVuY2hUZW1wbGF0ZSkudG9CZURlZmluZWQoKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICAgIExhdW5jaFRlbXBsYXRlTmFtZTogc3RhY2sucmVzb2x2ZShsYXVuY2hUZW1wbGF0ZS5sYXVuY2hUZW1wbGF0ZU5hbWUpLFxuICAgICAgICBMYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgICBNZXRhZGF0YU9wdGlvbnM6IHtcbiAgICAgICAgICAgIEh0dHBUb2tlbnM6ICdyZXF1aXJlZCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpJbnN0YW5jZScsIHtcbiAgICAgICAgTGF1bmNoVGVtcGxhdGU6IHtcbiAgICAgICAgICBMYXVuY2hUZW1wbGF0ZU5hbWU6IHN0YWNrLnJlc29sdmUobGF1bmNoVGVtcGxhdGUubGF1bmNoVGVtcGxhdGVOYW1lKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZG9lcyBub3QgdG9nZ2xlIHdoZW4gSW5zdGFuY2UgaGFzIGEgTGF1bmNoVGVtcGxhdGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZScsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgICAgIG1hY2hpbmVJbWFnZTogTWFjaGluZUltYWdlLmxhdGVzdEFtYXpvbkxpbnV4KCksXG4gICAgICB9KTtcbiAgICAgIGluc3RhbmNlLmluc3RhbmNlLmxhdW5jaFRlbXBsYXRlID0ge1xuICAgICAgICBsYXVuY2hUZW1wbGF0ZU5hbWU6ICduYW1lJyxcbiAgICAgICAgdmVyc2lvbjogJ3ZlcnNpb24nLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGFzcGVjdCA9IG5ldyBJbnN0YW5jZVJlcXVpcmVJbWRzdjJBc3BlY3QoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY2RrLkFzcGVjdHMub2Yoc3RhY2spLmFkZChhc3BlY3QpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICAvLyBBc3BlY3Qgbm9ybWFsbHkgY3JlYXRlcyBhIExhdW5jaFRlbXBsYXRlIGZvciB0aGUgSW5zdGFuY2UgdG8gdG9nZ2xlIElNRFN2MSxcbiAgICAgIC8vIHNvIHdlIGNhbiBhc3NlcnQgdGhhdCBvbmUgd2FzIG5vdCBjcmVhdGVkXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OkxhdW5jaFRlbXBsYXRlJywgMCk7XG4gICAgICBBbm5vdGF0aW9ucy5mcm9tU3RhY2soc3RhY2spLmhhc1dhcm5pbmcoJy9TdGFjay9JbnN0YW5jZScsIE1hdGNoLnN0cmluZ0xpa2VSZWdleHAoJy4qQ2Fubm90IHRvZ2dsZSBJTURTdjEgYmVjYXVzZSB0aGlzIEluc3RhbmNlIGlzIGFzc29jaWF0ZWQgd2l0aCBhbiBleGlzdGluZyBMYXVuY2ggVGVtcGxhdGUuJykpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnc3VwcHJlc3NlcyBMYXVuY2ggVGVtcGxhdGUgd2FybmluZ3MnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgSW5zdGFuY2Uoc3RhY2ssICdJbnN0YW5jZScsIHtcbiAgICAgICAgdnBjLFxuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgICAgIG1hY2hpbmVJbWFnZTogTWFjaGluZUltYWdlLmxhdGVzdEFtYXpvbkxpbnV4KCksXG4gICAgICB9KTtcbiAgICAgIGluc3RhbmNlLmluc3RhbmNlLmxhdW5jaFRlbXBsYXRlID0ge1xuICAgICAgICBsYXVuY2hUZW1wbGF0ZU5hbWU6ICduYW1lJyxcbiAgICAgICAgdmVyc2lvbjogJ3ZlcnNpb24nLFxuICAgICAgfTtcbiAgICAgIGNvbnN0IGFzcGVjdCA9IG5ldyBJbnN0YW5jZVJlcXVpcmVJbWRzdjJBc3BlY3Qoe1xuICAgICAgICBzdXBwcmVzc0xhdW5jaFRlbXBsYXRlV2FybmluZzogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBhc3BlY3QudmlzaXQoaW5zdGFuY2UpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBBbm5vdGF0aW9ucy5mcm9tU3RhY2soc3RhY2spLmhhc05vV2FybmluZygnL1N0YWNrL0luc3RhbmNlJywgJ0Nhbm5vdCB0b2dnbGUgSU1EU3YxIGJlY2F1c2UgdGhpcyBJbnN0YW5jZSBpcyBhc3NvY2lhdGVkIHdpdGggYW4gZXhpc3RpbmcgTGF1bmNoIFRlbXBsYXRlLicpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbGF1bmNoIHRlbXBsYXRlIG5hbWUgaXMgdW5pcXVlIHdpdGggZmVhdHVyZSBmbGFnJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcDIgPSBuZXcgY2RrLkFwcCgpO1xuICAgICAgY29uc3Qgb3RoZXJTdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwMiwgJ090aGVyU3RhY2snKTtcbiAgICAgIGNvbnN0IG90aGVyVnBjID0gbmV3IFZwYyhvdGhlclN0YWNrLCAnT3RoZXJWcGMnKTtcbiAgICAgIGNvbnN0IG90aGVySW5zdGFuY2UgPSBuZXcgSW5zdGFuY2Uob3RoZXJTdGFjaywgJ090aGVySW5zdGFuY2UnLCB7XG4gICAgICAgIHZwYzogb3RoZXJWcGMsXG4gICAgICAgIGluc3RhbmNlVHlwZTogbmV3IEluc3RhbmNlVHlwZSgndDIubWljcm8nKSxcbiAgICAgICAgbWFjaGluZUltYWdlOiBNYWNoaW5lSW1hZ2UubGF0ZXN0QW1hem9uTGludXgoKSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgaW1kc3YyU3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcDIsICdSZXF1aXJlSW1kc3YyU3RhY2snKTtcbiAgICAgIGNvbnN0IGltZHN2MlZwYyA9IG5ldyBWcGMoaW1kc3YyU3RhY2ssICdWcGMnKTtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IEluc3RhbmNlKGltZHN2MlN0YWNrLCAnSW5zdGFuY2UnLCB7XG4gICAgICAgIHZwYzogaW1kc3YyVnBjLFxuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBJbnN0YW5jZVR5cGUoJ3QyLm1pY3JvJyksXG4gICAgICAgIG1hY2hpbmVJbWFnZTogTWFjaGluZUltYWdlLmxhdGVzdEFtYXpvbkxpbnV4KCksXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGFzcGVjdCA9IG5ldyBJbnN0YW5jZVJlcXVpcmVJbWRzdjJBc3BlY3QoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY2RrLkFzcGVjdHMub2YoaW1kc3YyU3RhY2spLmFkZChhc3BlY3QpO1xuICAgICAgY2RrLkFzcGVjdHMub2Yob3RoZXJTdGFjaykuYWRkKGFzcGVjdCk7XG4gICAgICBhcHAyLnN5bnRoKCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvbnN0IGxhdW5jaFRlbXBsYXRlID0gaW5zdGFuY2Uubm9kZS50cnlGaW5kQ2hpbGQoJ0xhdW5jaFRlbXBsYXRlJykgYXMgTGF1bmNoVGVtcGxhdGU7XG4gICAgICBjb25zdCBvdGhlckxhdW5jaFRlbXBsYXRlID0gb3RoZXJJbnN0YW5jZS5ub2RlLnRyeUZpbmRDaGlsZCgnTGF1bmNoVGVtcGxhdGUnKSBhcyBMYXVuY2hUZW1wbGF0ZTtcbiAgICAgIGV4cGVjdChsYXVuY2hUZW1wbGF0ZSkudG9CZURlZmluZWQoKTtcbiAgICAgIGV4cGVjdChvdGhlckxhdW5jaFRlbXBsYXRlKS50b0JlRGVmaW5lZCgpO1xuICAgICAgZXhwZWN0KGxhdW5jaFRlbXBsYXRlLmxhdW5jaFRlbXBsYXRlTmFtZSAhPT0gb3RoZXJMYXVuY2hUZW1wbGF0ZS5sYXVuY2hUZW1wbGF0ZU5hbWUpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnTGF1bmNoVGVtcGxhdGVSZXF1aXJlSW1kc3YyQXNwZWN0JywgKCkgPT4ge1xuICAgIHRlc3QoJ3dhcm5zIHdoZW4gTGF1bmNoVGVtcGxhdGVEYXRhIGlzIGEgQ0RLIHRva2VuJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGxhdW5jaFRlbXBsYXRlID0gbmV3IExhdW5jaFRlbXBsYXRlKHN0YWNrLCAnTGF1bmNoVGVtcGxhdGUnKTtcbiAgICAgIGNvbnN0IGNmbkxhdW5jaFRlbXBsYXRlID0gbGF1bmNoVGVtcGxhdGUubm9kZS50cnlGaW5kQ2hpbGQoJ1Jlc291cmNlJykgYXMgQ2ZuTGF1bmNoVGVtcGxhdGU7XG4gICAgICBjZm5MYXVuY2hUZW1wbGF0ZS5sYXVuY2hUZW1wbGF0ZURhdGEgPSBjZGsuVG9rZW4uYXNBbnkoe1xuICAgICAgICBrZXJuZWxJZDogJ2FzZmQnLFxuICAgICAgfSBhcyBDZm5MYXVuY2hUZW1wbGF0ZS5MYXVuY2hUZW1wbGF0ZURhdGFQcm9wZXJ0eSk7XG4gICAgICBjb25zdCBhc3BlY3QgPSBuZXcgTGF1bmNoVGVtcGxhdGVSZXF1aXJlSW1kc3YyQXNwZWN0KCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGFzcGVjdC52aXNpdChsYXVuY2hUZW1wbGF0ZSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIEFubm90YXRpb25zLmZyb21TdGFjayhzdGFjaykuaGFzV2FybmluZygnL1N0YWNrL0xhdW5jaFRlbXBsYXRlJywgTWF0Y2guc3RyaW5nTGlrZVJlZ2V4cCgnLipMYXVuY2hUZW1wbGF0ZURhdGEgaXMgYSBDREsgdG9rZW4uJykpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnd2FybnMgd2hlbiBNZXRhZGF0YU9wdGlvbnMgaXMgYSBDREsgdG9rZW4nLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgbGF1bmNoVGVtcGxhdGUgPSBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdMYXVuY2hUZW1wbGF0ZScpO1xuICAgICAgY29uc3QgY2ZuTGF1bmNoVGVtcGxhdGUgPSBsYXVuY2hUZW1wbGF0ZS5ub2RlLnRyeUZpbmRDaGlsZCgnUmVzb3VyY2UnKSBhcyBDZm5MYXVuY2hUZW1wbGF0ZTtcbiAgICAgIGNmbkxhdW5jaFRlbXBsYXRlLmxhdW5jaFRlbXBsYXRlRGF0YSA9IHtcbiAgICAgICAgbWV0YWRhdGFPcHRpb25zOiBjZGsuVG9rZW4uYXNBbnkoe1xuICAgICAgICAgIGh0dHBFbmRwb2ludDogJ2h0dHA6Ly9ibGEnLFxuICAgICAgICB9IGFzIENmbkxhdW5jaFRlbXBsYXRlLk1ldGFkYXRhT3B0aW9uc1Byb3BlcnR5KSxcbiAgICAgIH0gYXMgQ2ZuTGF1bmNoVGVtcGxhdGUuTGF1bmNoVGVtcGxhdGVEYXRhUHJvcGVydHk7XG4gICAgICBjb25zdCBhc3BlY3QgPSBuZXcgTGF1bmNoVGVtcGxhdGVSZXF1aXJlSW1kc3YyQXNwZWN0KCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGFzcGVjdC52aXNpdChsYXVuY2hUZW1wbGF0ZSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIEFubm90YXRpb25zLmZyb21TdGFjayhzdGFjaykuaGFzV2FybmluZygnL1N0YWNrL0xhdW5jaFRlbXBsYXRlJywgTWF0Y2guc3RyaW5nTGlrZVJlZ2V4cCgnLipMYXVuY2hUZW1wbGF0ZURhdGEuTWV0YWRhdGFPcHRpb25zIGlzIGEgQ0RLIHRva2VuLicpKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3JlcXVpcmVzIElNRFN2MicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBuZXcgTGF1bmNoVGVtcGxhdGUoc3RhY2ssICdMYXVuY2hUZW1wbGF0ZScpO1xuICAgICAgY29uc3QgYXNwZWN0ID0gbmV3IExhdW5jaFRlbXBsYXRlUmVxdWlyZUltZHN2MkFzcGVjdCgpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjZGsuQXNwZWN0cy5vZihzdGFjaykuYWRkKGFzcGVjdCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6TGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICAgIExhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICAgIE1ldGFkYXRhT3B0aW9uczoge1xuICAgICAgICAgICAgSHR0cFRva2VuczogJ3JlcXVpcmVkJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=