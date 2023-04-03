"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constructs_1 = require("constructs");
const util_1 = require("./util");
const lib_1 = require("../lib");
const annotations_1 = require("../lib/annotations");
const restore = process.env.CDK_BLOCK_DEPRECATIONS;
describe('annotations', () => {
    afterEach(() => {
        process.env.CDK_BLOCK_DEPRECATIONS = restore; // restore to the original value
    });
    test('addDeprecation() annotates the usage of a deprecated API', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'MyStack');
        const c1 = new constructs_1.Construct(stack, 'Hello');
        // WHEN
        delete process.env.CDK_BLOCK_DEPRECATIONS;
        annotations_1.Annotations.of(c1).addDeprecation('@aws-cdk/core.Construct.node', 'use @aws-Construct.construct instead');
        // THEN
        expect((0, util_1.getWarnings)(app.synth())).toEqual([
            {
                path: '/MyStack/Hello',
                message: 'The API @aws-cdk/core.Construct.node is deprecated: use @aws-Construct.construct instead. This API will be removed in the next major release',
            },
        ]);
    });
    test('deduplicated per node based on "api"', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack1 = new lib_1.Stack(app, 'MyStack1');
        const stack2 = new lib_1.Stack(app, 'MyStack2');
        const c1 = new constructs_1.Construct(stack1, 'Hello');
        const c2 = new constructs_1.Construct(stack1, 'World');
        const c3 = new constructs_1.Construct(stack2, 'FooBar');
        // WHEN
        delete process.env.CDK_BLOCK_DEPRECATIONS;
        annotations_1.Annotations.of(c1).addDeprecation('@aws-cdk/core.Construct.node', 'use @aws-Construct.construct instead');
        annotations_1.Annotations.of(c2).addDeprecation('@aws-cdk/core.Construct.node', 'use @aws-Construct.construct instead');
        annotations_1.Annotations.of(c1).addDeprecation('@aws-cdk/core.Construct.node', 'use @aws-Construct.construct instead');
        annotations_1.Annotations.of(c3).addDeprecation('@aws-cdk/core.Construct.node', 'use @aws-Construct.construct instead');
        annotations_1.Annotations.of(c1).addDeprecation('@aws-cdk/core.Construct.node', 'use @aws-Construct.construct instead');
        annotations_1.Annotations.of(c1).addDeprecation('@aws-cdk/core.Construct.node', 'use @aws-Construct.construct instead');
        // THEN
        expect((0, util_1.getWarnings)(app.synth())).toEqual([
            {
                path: '/MyStack1/Hello',
                message: 'The API @aws-cdk/core.Construct.node is deprecated: use @aws-Construct.construct instead. This API will be removed in the next major release',
            },
            {
                path: '/MyStack1/World',
                message: 'The API @aws-cdk/core.Construct.node is deprecated: use @aws-Construct.construct instead. This API will be removed in the next major release',
            },
            {
                path: '/MyStack2/FooBar',
                message: 'The API @aws-cdk/core.Construct.node is deprecated: use @aws-Construct.construct instead. This API will be removed in the next major release',
            },
        ]);
    });
    test('CDK_BLOCK_DEPRECATIONS will throw if a deprecated API is used', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'MyStack');
        const c1 = new constructs_1.Construct(stack, 'Hello');
        // THEN
        process.env.CDK_BLOCK_DEPRECATIONS = '1';
        expect(() => annotations_1.Annotations.of(c1).addDeprecation('foo', 'bar')).toThrow(/MyStack\/Hello: The API foo is deprecated: bar\. This API will be removed in the next major release/);
    });
    test('addMessage deduplicates the message on the node level', () => {
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'S1');
        const c1 = new constructs_1.Construct(stack, 'C1');
        annotations_1.Annotations.of(c1).addWarning('You should know this!');
        annotations_1.Annotations.of(c1).addWarning('You should know this!');
        annotations_1.Annotations.of(c1).addWarning('You should know this!');
        annotations_1.Annotations.of(c1).addWarning('You should know this, too!');
        expect((0, util_1.getWarnings)(app.synth())).toEqual([{
                path: '/S1/C1',
                message: 'You should know this!',
            },
            {
                path: '/S1/C1',
                message: 'You should know this, too!',
            }]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ub3RhdGlvbnMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFubm90YXRpb25zLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBdUM7QUFDdkMsaUNBQXFDO0FBQ3JDLGdDQUFvQztBQUNwQyxvREFBaUQ7QUFFakQsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQztBQUVuRCxRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtJQUMzQixTQUFTLENBQUMsR0FBRyxFQUFFO1FBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsR0FBRyxPQUFPLENBQUMsQ0FBQyxnQ0FBZ0M7SUFDaEYsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMERBQTBELEVBQUUsR0FBRyxFQUFFO1FBQ3BFLFFBQVE7UUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQUcsRUFBRSxDQUFDO1FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN4QyxNQUFNLEVBQUUsR0FBRyxJQUFJLHNCQUFTLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXpDLE9BQU87UUFDUCxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUM7UUFDMUMseUJBQVcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLDhCQUE4QixFQUFFLHNDQUFzQyxDQUFDLENBQUM7UUFFMUcsT0FBTztRQUNQLE1BQU0sQ0FBQyxJQUFBLGtCQUFXLEVBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDdkM7Z0JBQ0UsSUFBSSxFQUFFLGdCQUFnQjtnQkFDdEIsT0FBTyxFQUFFLDhJQUE4STthQUN4SjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxD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R0FBRyxJQUFJLHNCQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RDLHlCQUFXLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQ3ZELHlCQUFXLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQ3ZELHlCQUFXLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1FBQ3ZELHlCQUFXLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1FBQzVELE1BQU0sQ0FBQyxJQUFBLGtCQUFXLEVBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDeEMsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsT0FBTyxFQUFFLHVCQUF1QjthQUNqQztZQUNEO2dCQUNFLElBQUksRUFBRSxRQUFRO2dCQUNkLE9BQU8sRUFBRSw0QkFBNEI7YUFDdEMsQ0FBQyxDQUNELENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBnZXRXYXJuaW5ncyB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IEFubm90YXRpb25zIH0gZnJvbSAnLi4vbGliL2Fubm90YXRpb25zJztcblxuY29uc3QgcmVzdG9yZSA9IHByb2Nlc3MuZW52LkNES19CTE9DS19ERVBSRUNBVElPTlM7XG5cbmRlc2NyaWJlKCdhbm5vdGF0aW9ucycsICgpID0+IHtcbiAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICBwcm9jZXNzLmVudi5DREtfQkxPQ0tfREVQUkVDQVRJT05TID0gcmVzdG9yZTsgLy8gcmVzdG9yZSB0byB0aGUgb3JpZ2luYWwgdmFsdWVcbiAgfSk7XG5cbiAgdGVzdCgnYWRkRGVwcmVjYXRpb24oKSBhbm5vdGF0ZXMgdGhlIHVzYWdlIG9mIGEgZGVwcmVjYXRlZCBBUEknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnTXlTdGFjaycpO1xuICAgIGNvbnN0IGMxID0gbmV3IENvbnN0cnVjdChzdGFjaywgJ0hlbGxvJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgZGVsZXRlIHByb2Nlc3MuZW52LkNES19CTE9DS19ERVBSRUNBVElPTlM7XG4gICAgQW5ub3RhdGlvbnMub2YoYzEpLmFkZERlcHJlY2F0aW9uKCdAYXdzLWNkay9jb3JlLkNvbnN0cnVjdC5ub2RlJywgJ3VzZSBAYXdzLUNvbnN0cnVjdC5jb25zdHJ1Y3QgaW5zdGVhZCcpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChnZXRXYXJuaW5ncyhhcHAuc3ludGgoKSkpLnRvRXF1YWwoW1xuICAgICAge1xuICAgICAgICBwYXRoOiAnL015U3RhY2svSGVsbG8nLFxuICAgICAgICBtZXNzYWdlOiAnVGhlIEFQSSBAYXdzLWNkay9jb3JlLkNvbnN0cnVjdC5ub2RlIGlzIGRlcHJlY2F0ZWQ6IHVzZSBAYXdzLUNvbnN0cnVjdC5jb25zdHJ1Y3QgaW5zdGVhZC4gVGhpcyBBUEkgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IG1ham9yIHJlbGVhc2UnLFxuICAgICAgfSxcbiAgICBdKTtcbiAgfSk7XG5cbiAgdGVzdCgnZGVkdXBsaWNhdGVkIHBlciBub2RlIGJhc2VkIG9uIFwiYXBpXCInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sxID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2sxJyk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2syJyk7XG4gICAgY29uc3QgYzEgPSBuZXcgQ29uc3RydWN0KHN0YWNrMSwgJ0hlbGxvJyk7XG4gICAgY29uc3QgYzIgPSBuZXcgQ29uc3RydWN0KHN0YWNrMSwgJ1dvcmxkJyk7XG4gICAgY29uc3QgYzMgPSBuZXcgQ29uc3RydWN0KHN0YWNrMiwgJ0Zvb0JhcicpO1xuXG4gICAgLy8gV0hFTlxuICAgIGRlbGV0ZSBwcm9jZXNzLmVudi5DREtfQkxPQ0tfREVQUkVDQVRJT05TO1xuICAgIEFubm90YXRpb25zLm9mKGMxKS5hZGREZXByZWNhdGlvbignQGF3cy1jZGsvY29yZS5Db25zdHJ1Y3Qubm9kZScsICd1c2UgQGF3cy1Db25zdHJ1Y3QuY29uc3RydWN0IGluc3RlYWQnKTtcbiAgICBBbm5vdGF0aW9ucy5vZihjMikuYWRkRGVwcmVjYXRpb24oJ0Bhd3MtY2RrL2NvcmUuQ29uc3RydWN0Lm5vZGUnLCAndXNlIEBhd3MtQ29uc3RydWN0LmNvbnN0cnVjdCBpbnN0ZWFkJyk7XG4gICAgQW5ub3RhdGlvbnMub2YoYzEpLmFkZERlcHJlY2F0aW9uKCdAYXdzLWNkay9jb3JlLkNvbnN0cnVjdC5ub2RlJywgJ3VzZSBAYXdzLUNvbnN0cnVjdC5jb25zdHJ1Y3QgaW5zdGVhZCcpO1xuICAgIEFubm90YXRpb25zLm9mKGMzKS5hZGREZXByZWNhdGlvbignQGF3cy1jZGsvY29yZS5Db25zdHJ1Y3Qubm9kZScsICd1c2UgQGF3cy1Db25zdHJ1Y3QuY29uc3RydWN0IGluc3RlYWQnKTtcbiAgICBBbm5vdGF0aW9ucy5vZihjMSkuYWRkRGVwcmVjYXRpb24oJ0Bhd3MtY2RrL2NvcmUuQ29uc3RydWN0Lm5vZGUnLCAndXNlIEBhd3MtQ29uc3RydWN0LmNvbnN0cnVjdCBpbnN0ZWFkJyk7XG4gICAgQW5ub3RhdGlvbnMub2YoYzEpLmFkZERlcHJlY2F0aW9uKCdAYXdzLWNkay9jb3JlLkNvbnN0cnVjdC5ub2RlJywgJ3VzZSBAYXdzLUNvbnN0cnVjdC5jb25zdHJ1Y3QgaW5zdGVhZCcpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChnZXRXYXJuaW5ncyhhcHAuc3ludGgoKSkpLnRvRXF1YWwoW1xuICAgICAge1xuICAgICAgICBwYXRoOiAnL015U3RhY2sxL0hlbGxvJyxcbiAgICAgICAgbWVzc2FnZTogJ1RoZSBBUEkgQGF3cy1jZGsvY29yZS5Db25zdHJ1Y3Qubm9kZSBpcyBkZXByZWNhdGVkOiB1c2UgQGF3cy1Db25zdHJ1Y3QuY29uc3RydWN0IGluc3RlYWQuIFRoaXMgQVBJIHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgbmV4dCBtYWpvciByZWxlYXNlJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHBhdGg6ICcvTXlTdGFjazEvV29ybGQnLFxuICAgICAgICBtZXNzYWdlOiAnVGhlIEFQSSBAYXdzLWNkay9jb3JlLkNvbnN0cnVjdC5ub2RlIGlzIGRlcHJlY2F0ZWQ6IHVzZSBAYXdzLUNvbnN0cnVjdC5jb25zdHJ1Y3QgaW5zdGVhZC4gVGhpcyBBUEkgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IG1ham9yIHJlbGVhc2UnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcGF0aDogJy9NeVN0YWNrMi9Gb29CYXInLFxuICAgICAgICBtZXNzYWdlOiAnVGhlIEFQSSBAYXdzLWNkay9jb3JlLkNvbnN0cnVjdC5ub2RlIGlzIGRlcHJlY2F0ZWQ6IHVzZSBAYXdzLUNvbnN0cnVjdC5jb25zdHJ1Y3QgaW5zdGVhZC4gVGhpcyBBUEkgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IG1ham9yIHJlbGVhc2UnLFxuICAgICAgfSxcbiAgICBdKTtcbiAgfSk7XG5cbiAgdGVzdCgnQ0RLX0JMT0NLX0RFUFJFQ0FUSU9OUyB3aWxsIHRocm93IGlmIGEgZGVwcmVjYXRlZCBBUEkgaXMgdXNlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdNeVN0YWNrJyk7XG4gICAgY29uc3QgYzEgPSBuZXcgQ29uc3RydWN0KHN0YWNrLCAnSGVsbG8nKTtcblxuICAgIC8vIFRIRU5cbiAgICBwcm9jZXNzLmVudi5DREtfQkxPQ0tfREVQUkVDQVRJT05TID0gJzEnO1xuICAgIGV4cGVjdCgoKSA9PiBBbm5vdGF0aW9ucy5vZihjMSkuYWRkRGVwcmVjYXRpb24oJ2ZvbycsICdiYXInKSkudG9UaHJvdygvTXlTdGFja1xcL0hlbGxvOiBUaGUgQVBJIGZvbyBpcyBkZXByZWNhdGVkOiBiYXJcXC4gVGhpcyBBUEkgd2lsbCBiZSByZW1vdmVkIGluIHRoZSBuZXh0IG1ham9yIHJlbGVhc2UvKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkTWVzc2FnZSBkZWR1cGxpY2F0ZXMgdGhlIG1lc3NhZ2Ugb24gdGhlIG5vZGUgbGV2ZWwnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1MxJyk7XG4gICAgY29uc3QgYzEgPSBuZXcgQ29uc3RydWN0KHN0YWNrLCAnQzEnKTtcbiAgICBBbm5vdGF0aW9ucy5vZihjMSkuYWRkV2FybmluZygnWW91IHNob3VsZCBrbm93IHRoaXMhJyk7XG4gICAgQW5ub3RhdGlvbnMub2YoYzEpLmFkZFdhcm5pbmcoJ1lvdSBzaG91bGQga25vdyB0aGlzIScpO1xuICAgIEFubm90YXRpb25zLm9mKGMxKS5hZGRXYXJuaW5nKCdZb3Ugc2hvdWxkIGtub3cgdGhpcyEnKTtcbiAgICBBbm5vdGF0aW9ucy5vZihjMSkuYWRkV2FybmluZygnWW91IHNob3VsZCBrbm93IHRoaXMsIHRvbyEnKTtcbiAgICBleHBlY3QoZ2V0V2FybmluZ3MoYXBwLnN5bnRoKCkpKS50b0VxdWFsKFt7XG4gICAgICBwYXRoOiAnL1MxL0MxJyxcbiAgICAgIG1lc3NhZ2U6ICdZb3Ugc2hvdWxkIGtub3cgdGhpcyEnLFxuICAgIH0sXG4gICAge1xuICAgICAgcGF0aDogJy9TMS9DMScsXG4gICAgICBtZXNzYWdlOiAnWW91IHNob3VsZCBrbm93IHRoaXMsIHRvbyEnLFxuICAgIH1dLFxuICAgICk7XG4gIH0pO1xufSk7XG4iXX0=