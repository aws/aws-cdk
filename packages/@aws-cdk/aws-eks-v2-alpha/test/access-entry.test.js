"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("aws-cdk-lib/assertions");
const core_1 = require("aws-cdk-lib/core");
const lib_1 = require("../lib");
describe('AccessEntry', () => {
    let app;
    let stack;
    let cluster;
    let mockAccessPolicies;
    let mockProps;
    beforeEach(() => {
        app = new core_1.App();
        stack = new core_1.Stack(app, 'test-stack');
        cluster = new lib_1.Cluster(stack, 'Cluster', {
            version: lib_1.KubernetesVersion.V1_29,
        });
        mockAccessPolicies = [
            {
                accessScope: {
                    type: lib_1.AccessScopeType.NAMESPACE,
                    namespaces: ['default'],
                },
                policy: 'mock-policy-arn',
            },
        ];
        mockProps = {
            cluster,
            accessPolicies: mockAccessPolicies,
            principal: 'mock-principal-arn',
        };
    });
    test('creates a new AccessEntry', () => {
        // WHEN
        new lib_1.AccessEntry(stack, 'AccessEntry', {
            cluster,
            accessPolicies: mockAccessPolicies,
            principal: 'mock-principal-arn',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::AccessEntry', {
            ClusterName: { Ref: 'ClusterEB0386A7' },
            PrincipalArn: 'mock-principal-arn',
            AccessPolicies: [
                {
                    AccessScope: {
                        Namespaces: ['default'],
                        Type: 'namespace',
                    },
                    PolicyArn: 'mock-policy-arn',
                },
            ],
        });
    });
    test.each(Object.values(lib_1.AccessEntryType))('creates a new AccessEntry for AccessEntryType %s', (accessEntryType) => {
        // WHEN
        new lib_1.AccessEntry(stack, `AccessEntry-${accessEntryType}`, {
            cluster,
            accessPolicies: mockAccessPolicies,
            principal: 'mock-principal-arn',
            accessEntryType,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::AccessEntry', {
            ClusterName: { Ref: 'ClusterEB0386A7' },
            PrincipalArn: 'mock-principal-arn',
            Type: accessEntryType,
        });
    });
    test('adds new access policies with addAccessPolicies()', () => {
        // GIVEN
        const accessEntry = new lib_1.AccessEntry(stack, 'AccessEntry', mockProps);
        const newAccessPolicy = lib_1.AccessPolicy.fromAccessPolicyName('AmazonEKSClusterAdminPolicy', {
            accessScopeType: lib_1.AccessScopeType.CLUSTER,
        });
        // WHEN
        accessEntry.addAccessPolicies([newAccessPolicy]);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EKS::AccessEntry', {
            ClusterName: { Ref: 'ClusterEB0386A7' },
            PrincipalArn: mockProps.principal,
            AccessPolicies: [
                { PolicyArn: mockProps.accessPolicies[0].policy },
                {
                    AccessScope: {
                        Type: 'cluster',
                    },
                    PolicyArn: {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {
                                    Ref: 'AWS::Partition',
                                },
                                ':eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy',
                            ],
                        ],
                    },
                },
            ],
        });
    });
    test('imports an AccessEntry from attributes', () => {
        // GIVEN
        const importedAccessEntryName = 'imported-access-entry-name';
        const importedAccessEntryArn = 'imported-access-entry-arn';
        // WHEN
        const importedAccessEntry = lib_1.AccessEntry.fromAccessEntryAttributes(stack, 'ImportedAccessEntry', {
            accessEntryName: importedAccessEntryName,
            accessEntryArn: importedAccessEntryArn,
        });
        // THEN
        expect(importedAccessEntry.accessEntryName).toEqual(importedAccessEntryName);
        expect(importedAccessEntry.accessEntryArn).toEqual(importedAccessEntryArn);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EKS::AccessEntry', 0);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjZXNzLWVudHJ5LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhY2Nlc3MtZW50cnkudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVEQUFrRDtBQUNsRCwyQ0FBOEM7QUFDOUMsZ0NBR2dCO0FBRWhCLFFBQVEsQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO0lBQzNCLElBQUksR0FBUSxDQUFDO0lBQ2IsSUFBSSxLQUFZLENBQUM7SUFDakIsSUFBSSxPQUFnQixDQUFDO0lBQ3JCLElBQUksa0JBQW1DLENBQUM7SUFDeEMsSUFBSSxTQUEyQixDQUFDO0lBRWhDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztRQUNoQixLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sR0FBRyxJQUFJLGFBQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1lBQ3RDLE9BQU8sRUFBRSx1QkFBaUIsQ0FBQyxLQUFLO1NBQ2pDLENBQUMsQ0FBQztRQUVILGtCQUFrQixHQUFHO1lBQ25CO2dCQUNFLFdBQVcsRUFBRTtvQkFDWCxJQUFJLEVBQUUscUJBQWUsQ0FBQyxTQUFTO29CQUMvQixVQUFVLEVBQUUsQ0FBQyxTQUFTLENBQUM7aUJBQ3hCO2dCQUNELE1BQU0sRUFBRSxpQkFBaUI7YUFDMUI7U0FDRixDQUFDO1FBRUYsU0FBUyxHQUFHO1lBQ1YsT0FBTztZQUNQLGNBQWMsRUFBRSxrQkFBa0I7WUFDbEMsU0FBUyxFQUFFLG9CQUFvQjtTQUNoQyxDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFO1FBQ3JDLE9BQU87UUFDUCxJQUFJLGlCQUFXLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtZQUNwQyxPQUFPO1lBQ1AsY0FBYyxFQUFFLGtCQUFrQjtZQUNsQyxTQUFT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Q0FBQyxtQkFBbUIsQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUM3RSxNQUFNLENBQUMsbUJBQW1CLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFFM0UscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDLHVCQUF1QixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ2F3cy1jZGstbGliL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgQXBwLCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliL2NvcmUnO1xuaW1wb3J0IHtcbiAgQWNjZXNzRW50cnksIEFjY2Vzc0VudHJ5UHJvcHMsIEFjY2Vzc0VudHJ5VHlwZSxcbiAgQWNjZXNzU2NvcGVUeXBlLCBJQWNjZXNzUG9saWN5LCBDbHVzdGVyLCBBY2Nlc3NQb2xpY3ksIEt1YmVybmV0ZXNWZXJzaW9uLFxufSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnQWNjZXNzRW50cnknLCAoKSA9PiB7XG4gIGxldCBhcHA6IEFwcDtcbiAgbGV0IHN0YWNrOiBTdGFjaztcbiAgbGV0IGNsdXN0ZXI6IENsdXN0ZXI7XG4gIGxldCBtb2NrQWNjZXNzUG9saWNpZXM6IElBY2Nlc3NQb2xpY3lbXTtcbiAgbGV0IG1vY2tQcm9wczogQWNjZXNzRW50cnlQcm9wcztcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBhcHAgPSBuZXcgQXBwKCk7XG4gICAgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAndGVzdC1zdGFjaycpO1xuICAgIGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgICB2ZXJzaW9uOiBLdWJlcm5ldGVzVmVyc2lvbi5WMV8yOSxcbiAgICB9KTtcblxuICAgIG1vY2tBY2Nlc3NQb2xpY2llcyA9IFtcbiAgICAgIHtcbiAgICAgICAgYWNjZXNzU2NvcGU6IHtcbiAgICAgICAgICB0eXBlOiBBY2Nlc3NTY29wZVR5cGUuTkFNRVNQQUNFLFxuICAgICAgICAgIG5hbWVzcGFjZXM6IFsnZGVmYXVsdCddLFxuICAgICAgICB9LFxuICAgICAgICBwb2xpY3k6ICdtb2NrLXBvbGljeS1hcm4nLFxuICAgICAgfSxcbiAgICBdO1xuXG4gICAgbW9ja1Byb3BzID0ge1xuICAgICAgY2x1c3RlcixcbiAgICAgIGFjY2Vzc1BvbGljaWVzOiBtb2NrQWNjZXNzUG9saWNpZXMsXG4gICAgICBwcmluY2lwYWw6ICdtb2NrLXByaW5jaXBhbC1hcm4nLFxuICAgIH07XG4gIH0pO1xuXG4gIHRlc3QoJ2NyZWF0ZXMgYSBuZXcgQWNjZXNzRW50cnknLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIG5ldyBBY2Nlc3NFbnRyeShzdGFjaywgJ0FjY2Vzc0VudHJ5Jywge1xuICAgICAgY2x1c3RlcixcbiAgICAgIGFjY2Vzc1BvbGljaWVzOiBtb2NrQWNjZXNzUG9saWNpZXMsXG4gICAgICBwcmluY2lwYWw6ICdtb2NrLXByaW5jaXBhbC1hcm4nLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6QWNjZXNzRW50cnknLCB7XG4gICAgICBDbHVzdGVyTmFtZTogeyBSZWY6ICdDbHVzdGVyRUIwMzg2QTcnIH0sXG4gICAgICBQcmluY2lwYWxBcm46ICdtb2NrLXByaW5jaXBhbC1hcm4nLFxuICAgICAgQWNjZXNzUG9saWNpZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFjY2Vzc1Njb3BlOiB7XG4gICAgICAgICAgICBOYW1lc3BhY2VzOiBbJ2RlZmF1bHQnXSxcbiAgICAgICAgICAgIFR5cGU6ICduYW1lc3BhY2UnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgUG9saWN5QXJuOiAnbW9jay1wb2xpY3ktYXJuJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QuZWFjaChPYmplY3QudmFsdWVzKEFjY2Vzc0VudHJ5VHlwZSkpKFxuICAgICdjcmVhdGVzIGEgbmV3IEFjY2Vzc0VudHJ5IGZvciBBY2Nlc3NFbnRyeVR5cGUgJXMnLFxuICAgIChhY2Nlc3NFbnRyeVR5cGUpID0+IHtcbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBBY2Nlc3NFbnRyeShzdGFjaywgYEFjY2Vzc0VudHJ5LSR7YWNjZXNzRW50cnlUeXBlfWAsIHtcbiAgICAgICAgY2x1c3RlcixcbiAgICAgICAgYWNjZXNzUG9saWNpZXM6IG1vY2tBY2Nlc3NQb2xpY2llcyxcbiAgICAgICAgcHJpbmNpcGFsOiAnbW9jay1wcmluY2lwYWwtYXJuJyxcbiAgICAgICAgYWNjZXNzRW50cnlUeXBlLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVLUzo6QWNjZXNzRW50cnknLCB7XG4gICAgICAgIENsdXN0ZXJOYW1lOiB7IFJlZjogJ0NsdXN0ZXJFQjAzODZBNycgfSxcbiAgICAgICAgUHJpbmNpcGFsQXJuOiAnbW9jay1wcmluY2lwYWwtYXJuJyxcbiAgICAgICAgVHlwZTogYWNjZXNzRW50cnlUeXBlLFxuICAgICAgfSk7XG4gICAgfSxcbiAgKTtcblxuICB0ZXN0KCdhZGRzIG5ldyBhY2Nlc3MgcG9saWNpZXMgd2l0aCBhZGRBY2Nlc3NQb2xpY2llcygpJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYWNjZXNzRW50cnkgPSBuZXcgQWNjZXNzRW50cnkoc3RhY2ssICdBY2Nlc3NFbnRyeScsIG1vY2tQcm9wcyk7XG4gICAgY29uc3QgbmV3QWNjZXNzUG9saWN5ID0gQWNjZXNzUG9saWN5LmZyb21BY2Nlc3NQb2xpY3lOYW1lKCdBbWF6b25FS1NDbHVzdGVyQWRtaW5Qb2xpY3knLCB7XG4gICAgICBhY2Nlc3NTY29wZVR5cGU6IEFjY2Vzc1Njb3BlVHlwZS5DTFVTVEVSLFxuICAgIH0pO1xuICAgIC8vIFdIRU5cbiAgICBhY2Nlc3NFbnRyeS5hZGRBY2Nlc3NQb2xpY2llcyhbbmV3QWNjZXNzUG9saWN5XSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUtTOjpBY2Nlc3NFbnRyeScsIHtcbiAgICAgIENsdXN0ZXJOYW1lOiB7IFJlZjogJ0NsdXN0ZXJFQjAzODZBNycgfSxcbiAgICAgIFByaW5jaXBhbEFybjogbW9ja1Byb3BzLnByaW5jaXBhbCxcbiAgICAgIEFjY2Vzc1BvbGljaWVzOiBbXG4gICAgICAgIHsgUG9saWN5QXJuOiBtb2NrUHJvcHMuYWNjZXNzUG9saWNpZXNbMF0ucG9saWN5IH0sXG4gICAgICAgIHtcbiAgICAgICAgICBBY2Nlc3NTY29wZToge1xuICAgICAgICAgICAgVHlwZTogJ2NsdXN0ZXInLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgUG9saWN5QXJuOiB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICc6ZWtzOjphd3M6Y2x1c3Rlci1hY2Nlc3MtcG9saWN5L0FtYXpvbkVLU0NsdXN0ZXJBZG1pblBvbGljeScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpbXBvcnRzIGFuIEFjY2Vzc0VudHJ5IGZyb20gYXR0cmlidXRlcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGltcG9ydGVkQWNjZXNzRW50cnlOYW1lID0gJ2ltcG9ydGVkLWFjY2Vzcy1lbnRyeS1uYW1lJztcbiAgICBjb25zdCBpbXBvcnRlZEFjY2Vzc0VudHJ5QXJuID0gJ2ltcG9ydGVkLWFjY2Vzcy1lbnRyeS1hcm4nO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGltcG9ydGVkQWNjZXNzRW50cnkgPSBBY2Nlc3NFbnRyeS5mcm9tQWNjZXNzRW50cnlBdHRyaWJ1dGVzKHN0YWNrLCAnSW1wb3J0ZWRBY2Nlc3NFbnRyeScsIHtcbiAgICAgIGFjY2Vzc0VudHJ5TmFtZTogaW1wb3J0ZWRBY2Nlc3NFbnRyeU5hbWUsXG4gICAgICBhY2Nlc3NFbnRyeUFybjogaW1wb3J0ZWRBY2Nlc3NFbnRyeUFybixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoaW1wb3J0ZWRBY2Nlc3NFbnRyeS5hY2Nlc3NFbnRyeU5hbWUpLnRvRXF1YWwoaW1wb3J0ZWRBY2Nlc3NFbnRyeU5hbWUpO1xuICAgIGV4cGVjdChpbXBvcnRlZEFjY2Vzc0VudHJ5LmFjY2Vzc0VudHJ5QXJuKS50b0VxdWFsKGltcG9ydGVkQWNjZXNzRW50cnlBcm4pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUtTOjpBY2Nlc3NFbnRyeScsIDApO1xuICB9KTtcbn0pO1xuIl19