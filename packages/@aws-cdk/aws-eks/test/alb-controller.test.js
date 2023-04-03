"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const util_1 = require("./util");
const lib_1 = require("../lib");
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
    const { stack } = util_1.testFixture();
    const cluster = new lib_1.Cluster(stack, 'Cluster', {
        version: lib_1.KubernetesVersion.V1_21,
    });
    lib_1.AlbController.create(stack, {
        cluster,
        version: lib_1.AlbControllerVersion.V2_4_1,
        repository: 'custom',
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties(lib_1.HelmChart.RESOURCE_TYPE, {
        Values: {
            'Fn::Join': [
                '',
                [
                    '{"clusterName":"',
                    {
                        Ref: 'Cluster9EE0221C',
                    },
                    '","serviceAccount":{"create":false,"name":"aws-load-balancer-controller"},"region":"us-east-1","vpcId":"',
                    {
                        Ref: 'ClusterDefaultVpcFA9F2722',
                    },
                    '","image":{"repository":"custom","tag":"v2.4.1"}}',
                ],
            ],
        },
    });
});
test('throws when a policy is not defined for a custom version', () => {
    const { stack } = util_1.testFixture();
    const cluster = new lib_1.Cluster(stack, 'Cluster', {
        version: lib_1.KubernetesVersion.V1_21,
    });
    expect(() => lib_1.AlbController.create(stack, {
        cluster,
        version: lib_1.AlbControllerVersion.of('custom'),
    })).toThrowError("'albControllerOptions.policy' is required when using a custom controller version");
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxiLWNvbnRyb2xsZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFsYi1jb250cm9sbGVyLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLG9EQUErQztBQUMvQyx3Q0FBd0M7QUFDeEMsaUNBQXFDO0FBQ3JDLGdDQUFvRztBQUVwRyxJQUFJLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFFOUQsS0FBSyxNQUFNLEtBQUssSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQzdDLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ3RDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDbkYsSUFBSTtnQkFFRixLQUFLLE1BQU0sU0FBUyxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7b0JBQ3hDLEdBQUcsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2lCQUN6QzthQUVGO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsS0FBSyxLQUFLLEtBQUssRUFBRSxDQUFDLENBQUM7YUFDdkQ7U0FDRjtLQUNGO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO0lBQzdDLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxrQkFBVyxFQUFFLENBQUM7SUFFaEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxhQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUM1QyxPQUFPLEVBQUUsdUJBQWlCLENBQUMsS0FBSztLQUNqQyxDQUFDLENBQUM7SUFFSCxtQkFBYSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUU7UUFDMUIsT0FBTztRQUNQLE9BQU8sRUFBRSwwQkFBb0IsQ0FBQyxNQUFNO1FBQ3BDLFVBQVUsRUFBRSxRQUFRO0tBQ3JCLENBQUMsQ0FBQztJQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGVBQVMsQ0FBQyxhQUFhLEVBQUU7UUFDdkUsTUFBTSxFQUFFO1lBQ04sVUFBVSxFQUFFO2dCQUNWLEVBQUU7Z0JBQ0Y7b0JBQ0Usa0JBQWtCO29CQUNsQjt3QkFDRSxHQUFHLEVBQUUsaUJBQWlCO3FCQUN2QjtvQkFDRCwwR0FBMEc7b0JBQzFHO3dCQUNFLEdBQUcsRUFBRSwyQkFBMkI7cUJBQ2pDO29CQUNELG1EQUFtRDtpQkFDcEQ7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsMERBQTBELEVBQUUsR0FBRyxFQUFFO0lBQ3BFLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxrQkFBVyxFQUFFLENBQUM7SUFFaEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxhQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUM1QyxPQUFPLEVBQUUsdUJBQWlCLENBQUMsS0FBSztLQUNqQyxDQUFDLENBQUM7SUFFSCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsbUJBQWEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ3ZDLE9BQU87UUFDUCxPQUFPLEVBQUUsMEJBQW9CLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQztLQUMzQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsa0ZBQWtGLENBQUMsQ0FBQztBQUN2RyxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgdGVzdEZpeHR1cmUgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgQ2x1c3RlciwgS3ViZXJuZXRlc1ZlcnNpb24sIEFsYkNvbnRyb2xsZXIsIEFsYkNvbnRyb2xsZXJWZXJzaW9uLCBIZWxtQ2hhcnQgfSBmcm9tICcuLi9saWInO1xuXG50ZXN0KCdhbGwgdmVuZGVkIHBvbGljaWVzIGFyZSB2YWxpZCcsICgpID0+IHtcbiAgY29uc3QgYWRkT25zRGlyID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ2xpYicsICdhZGRvbnMnKTtcblxuICBmb3IgKGNvbnN0IGFkZE9uIG9mIGZzLnJlYWRkaXJTeW5jKGFkZE9uc0RpcikpIHtcbiAgICBpZiAoYWRkT24uc3RhcnRzV2l0aCgnYWxiLWlhbV9wb2xpY3knKSkge1xuICAgICAgY29uc3QgcG9saWN5ID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKGFkZE9uc0RpciwgYWRkT24pKS50b1N0cmluZygpKTtcbiAgICAgIHRyeSB7XG5cbiAgICAgICAgZm9yIChjb25zdCBzdGF0ZW1lbnQgb2YgcG9saWN5LlN0YXRlbWVudCkge1xuICAgICAgICAgIGlhbS5Qb2xpY3lTdGF0ZW1lbnQuZnJvbUpzb24oc3RhdGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcG9saWN5OiAke2FkZE9ufTogJHtlcnJvcn1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuXG50ZXN0KCdjYW4gY29uZmlndXJlIGEgY3VzdG9tIHJlcG9zaXRvcnknLCAoKSA9PiB7XG4gIGNvbnN0IHsgc3RhY2sgfSA9IHRlc3RGaXh0dXJlKCk7XG5cbiAgY29uc3QgY2x1c3RlciA9IG5ldyBDbHVzdGVyKHN0YWNrLCAnQ2x1c3RlcicsIHtcbiAgICB2ZXJzaW9uOiBLdWJlcm5ldGVzVmVyc2lvbi5WMV8yMSxcbiAgfSk7XG5cbiAgQWxiQ29udHJvbGxlci5jcmVhdGUoc3RhY2ssIHtcbiAgICBjbHVzdGVyLFxuICAgIHZlcnNpb246IEFsYkNvbnRyb2xsZXJWZXJzaW9uLlYyXzRfMSxcbiAgICByZXBvc2l0b3J5OiAnY3VzdG9tJyxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoSGVsbUNoYXJ0LlJFU09VUkNFX1RZUEUsIHtcbiAgICBWYWx1ZXM6IHtcbiAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgJycsXG4gICAgICAgIFtcbiAgICAgICAgICAne1wiY2x1c3Rlck5hbWVcIjpcIicsXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnQ2x1c3RlcjlFRTAyMjFDJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdcIixcInNlcnZpY2VBY2NvdW50XCI6e1wiY3JlYXRlXCI6ZmFsc2UsXCJuYW1lXCI6XCJhd3MtbG9hZC1iYWxhbmNlci1jb250cm9sbGVyXCJ9LFwicmVnaW9uXCI6XCJ1cy1lYXN0LTFcIixcInZwY0lkXCI6XCInLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ0NsdXN0ZXJEZWZhdWx0VnBjRkE5RjI3MjInLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1wiLFwiaW1hZ2VcIjp7XCJyZXBvc2l0b3J5XCI6XCJjdXN0b21cIixcInRhZ1wiOlwidjIuNC4xXCJ9fScsXG4gICAgICAgIF0sXG4gICAgICBdLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3Rocm93cyB3aGVuIGEgcG9saWN5IGlzIG5vdCBkZWZpbmVkIGZvciBhIGN1c3RvbSB2ZXJzaW9uJywgKCkgPT4ge1xuICBjb25zdCB7IHN0YWNrIH0gPSB0ZXN0Rml4dHVyZSgpO1xuXG4gIGNvbnN0IGNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihzdGFjaywgJ0NsdXN0ZXInLCB7XG4gICAgdmVyc2lvbjogS3ViZXJuZXRlc1ZlcnNpb24uVjFfMjEsXG4gIH0pO1xuXG4gIGV4cGVjdCgoKSA9PiBBbGJDb250cm9sbGVyLmNyZWF0ZShzdGFjaywge1xuICAgIGNsdXN0ZXIsXG4gICAgdmVyc2lvbjogQWxiQ29udHJvbGxlclZlcnNpb24ub2YoJ2N1c3RvbScpLFxuICB9KSkudG9UaHJvd0Vycm9yKFwiJ2FsYkNvbnRyb2xsZXJPcHRpb25zLnBvbGljeScgaXMgcmVxdWlyZWQgd2hlbiB1c2luZyBhIGN1c3RvbSBjb250cm9sbGVyIHZlcnNpb25cIik7XG59KTtcbiJdfQ==