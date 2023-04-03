"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeMetadata = void 0;
const fs = require("fs");
const path = require("path");
const cloud_assembly_schema_1 = require("@aws-cdk/cloud-assembly-schema");
const constructs_1 = require("constructs");
const runtime_info_1 = require("./runtime-info");
const annotations_1 = require("../annotations");
const stack_1 = require("../stack");
const tree_1 = require("../tree");
const FILE_PATH = 'tree.json';
/**
 * Construct that is automatically attached to the top-level `App`.
 * This generates, as part of synthesis, a file containing the construct tree and the metadata for each node in the tree.
 * The output is in a tree format so as to preserve the construct hierarchy.
 *
 */
class TreeMetadata extends constructs_1.Construct {
    constructor(scope) {
        super(scope, 'Tree');
    }
    /**
     * Create tree.json
     * @internal
     */
    _synthesizeTree(session) {
        const lookup = {};
        const visit = (construct) => {
            const children = construct.node.children.map((c) => {
                try {
                    return visit(c);
                }
                catch (e) {
                    annotations_1.Annotations.of(this).addWarning(`Failed to render tree metadata for node [${c.node.id}]. Reason: ${e}`);
                    return undefined;
                }
            });
            const childrenMap = children
                .filter((child) => child !== undefined)
                .reduce((map, child) => Object.assign(map, { [child.id]: child }), {});
            const node = {
                id: construct.node.id || 'App',
                path: construct.node.path,
                children: Object.keys(childrenMap).length === 0 ? undefined : childrenMap,
                attributes: this.synthAttributes(construct),
                constructInfo: runtime_info_1.constructInfoFromConstruct(construct),
            };
            lookup[node.path] = node;
            return node;
        };
        const tree = {
            version: 'tree-0.1',
            tree: visit(this.node.root),
        };
        const builder = session.assembly;
        fs.writeFileSync(path.join(builder.outdir, FILE_PATH), JSON.stringify(tree, undefined, 2), { encoding: 'utf-8' });
        builder.addArtifact('Tree', {
            type: cloud_assembly_schema_1.ArtifactType.CDK_TREE,
            properties: {
                file: FILE_PATH,
            },
        });
    }
    synthAttributes(construct) {
        // check if a construct implements IInspectable
        function canInspect(inspectable) {
            return inspectable.inspect !== undefined;
        }
        const inspector = new tree_1.TreeInspector();
        // get attributes from the inspector
        if (canInspect(construct)) {
            construct.inspect(inspector);
            return stack_1.Stack.of(construct).resolve(inspector.attributes);
        }
        return undefined;
    }
}
exports.TreeMetadata = TreeMetadata;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1tZXRhZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRyZWUtbWV0YWRhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUU3QiwwRUFBOEQ7QUFDOUQsMkNBQW1EO0FBQ25ELGlEQUEyRTtBQUMzRSxnREFBNkM7QUFDN0Msb0NBQWlDO0FBRWpDLGtDQUFzRDtBQUV0RCxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUM7QUFFOUI7Ozs7O0dBS0c7QUFDSCxNQUFhLFlBQWEsU0FBUSxzQkFBUztJQUN6QyxZQUFZLEtBQWdCO1FBQzFCLEtBQUssQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDdEI7SUFFRDs7O09BR0c7SUFDSSxlQUFlLENBQUMsT0FBMEI7UUFDL0MsTUFBTSxNQUFNLEdBQTZCLEVBQUcsQ0FBQztRQUU3QyxNQUFNLEtBQUssR0FBRyxDQUFDLFNBQXFCLEVBQVEsRUFBRTtZQUM1QyxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDakQsSUFBSTtvQkFDRixPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDakI7Z0JBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ1YseUJBQVcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLDRDQUE0QyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUN4RyxPQUFPLFNBQVMsQ0FBQztpQkFDbEI7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sV0FBVyxHQUFHLFFBQVE7aUJBQ3pCLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQztpQkFDdEMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEtBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRTFFLE1BQU0sSUFBSSxHQUFTO2dCQUNqQixFQUFFLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksS0FBSztnQkFDOUIsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSTtnQkFDekIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxXQUFXO2dCQUN6RSxVQUFVLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUM7Z0JBQzNDLGFBQWEsRUFBRSx5Q0FBMEIsQ0FBQyxTQUFTLENBQUM7YUFDckQsQ0FBQztZQUVGLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBRXpCLE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQyxDQUFDO1FBRUYsTUFBTSxJQUFJLEdBQUc7WUFDWCxPQUFPLEVBQUUsVUFBVTtZQUNuQixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQzVCLENBQUM7UUFFRixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBQ2pDLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBRWxILE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO1lBQzFCLElBQUksRUFBRSxvQ0FBWSxDQUFDLFFBQVE7WUFDM0IsVUFBVSxFQUFFO2dCQUNWLElBQUksRUFBRSxTQUFTO2FBQ2hCO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7SUFFTyxlQUFlLENBQUMsU0FBcUI7UUFDM0MsK0NBQStDO1FBQy9DLFNBQVMsVUFBVSxDQUFDLFdBQWdCO1lBQ2xDLE9BQU8sV0FBVyxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUM7UUFDM0MsQ0FBQztRQUVELE1BQU0sU0FBUyxHQUFHLElBQUksb0JBQWEsRUFBRSxDQUFDO1FBRXRDLG9DQUFvQztRQUNwQyxJQUFJLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUN6QixTQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzdCLE9BQU8sYUFBSyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQzFEO1FBQ0QsT0FBTyxTQUFTLENBQUM7S0FDbEI7Q0FDRjtBQXJFRCxvQ0FxRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgeyBBcnRpZmFjdFR5cGUgfSBmcm9tICdAYXdzLWNkay9jbG91ZC1hc3NlbWJseS1zY2hlbWEnO1xuaW1wb3J0IHsgQ29uc3RydWN0LCBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3RJbmZvLCBjb25zdHJ1Y3RJbmZvRnJvbUNvbnN0cnVjdCB9IGZyb20gJy4vcnVudGltZS1pbmZvJztcbmltcG9ydCB7IEFubm90YXRpb25zIH0gZnJvbSAnLi4vYW5ub3RhdGlvbnMnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICcuLi9zdGFjayc7XG5pbXBvcnQgeyBJU3ludGhlc2lzU2Vzc2lvbiB9IGZyb20gJy4uL3N0YWNrLXN5bnRoZXNpemVycyc7XG5pbXBvcnQgeyBJSW5zcGVjdGFibGUsIFRyZWVJbnNwZWN0b3IgfSBmcm9tICcuLi90cmVlJztcblxuY29uc3QgRklMRV9QQVRIID0gJ3RyZWUuanNvbic7XG5cbi8qKlxuICogQ29uc3RydWN0IHRoYXQgaXMgYXV0b21hdGljYWxseSBhdHRhY2hlZCB0byB0aGUgdG9wLWxldmVsIGBBcHBgLlxuICogVGhpcyBnZW5lcmF0ZXMsIGFzIHBhcnQgb2Ygc3ludGhlc2lzLCBhIGZpbGUgY29udGFpbmluZyB0aGUgY29uc3RydWN0IHRyZWUgYW5kIHRoZSBtZXRhZGF0YSBmb3IgZWFjaCBub2RlIGluIHRoZSB0cmVlLlxuICogVGhlIG91dHB1dCBpcyBpbiBhIHRyZWUgZm9ybWF0IHNvIGFzIHRvIHByZXNlcnZlIHRoZSBjb25zdHJ1Y3QgaGllcmFyY2h5LlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIFRyZWVNZXRhZGF0YSBleHRlbmRzIENvbnN0cnVjdCB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QpIHtcbiAgICBzdXBlcihzY29wZSwgJ1RyZWUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdHJlZS5qc29uXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF9zeW50aGVzaXplVHJlZShzZXNzaW9uOiBJU3ludGhlc2lzU2Vzc2lvbikge1xuICAgIGNvbnN0IGxvb2t1cDogeyBbcGF0aDogc3RyaW5nXTogTm9kZSB9ID0geyB9O1xuXG4gICAgY29uc3QgdmlzaXQgPSAoY29uc3RydWN0OiBJQ29uc3RydWN0KTogTm9kZSA9PiB7XG4gICAgICBjb25zdCBjaGlsZHJlbiA9IGNvbnN0cnVjdC5ub2RlLmNoaWxkcmVuLm1hcCgoYykgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiB2aXNpdChjKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIEFubm90YXRpb25zLm9mKHRoaXMpLmFkZFdhcm5pbmcoYEZhaWxlZCB0byByZW5kZXIgdHJlZSBtZXRhZGF0YSBmb3Igbm9kZSBbJHtjLm5vZGUuaWR9XS4gUmVhc29uOiAke2V9YCk7XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBjaGlsZHJlbk1hcCA9IGNoaWxkcmVuXG4gICAgICAgIC5maWx0ZXIoKGNoaWxkKSA9PiBjaGlsZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAucmVkdWNlKChtYXAsIGNoaWxkKSA9PiBPYmplY3QuYXNzaWduKG1hcCwgeyBbY2hpbGQhLmlkXTogY2hpbGQgfSksIHt9KTtcblxuICAgICAgY29uc3Qgbm9kZTogTm9kZSA9IHtcbiAgICAgICAgaWQ6IGNvbnN0cnVjdC5ub2RlLmlkIHx8ICdBcHAnLFxuICAgICAgICBwYXRoOiBjb25zdHJ1Y3Qubm9kZS5wYXRoLFxuICAgICAgICBjaGlsZHJlbjogT2JqZWN0LmtleXMoY2hpbGRyZW5NYXApLmxlbmd0aCA9PT0gMCA/IHVuZGVmaW5lZCA6IGNoaWxkcmVuTWFwLFxuICAgICAgICBhdHRyaWJ1dGVzOiB0aGlzLnN5bnRoQXR0cmlidXRlcyhjb25zdHJ1Y3QpLFxuICAgICAgICBjb25zdHJ1Y3RJbmZvOiBjb25zdHJ1Y3RJbmZvRnJvbUNvbnN0cnVjdChjb25zdHJ1Y3QpLFxuICAgICAgfTtcblxuICAgICAgbG9va3VwW25vZGUucGF0aF0gPSBub2RlO1xuXG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9O1xuXG4gICAgY29uc3QgdHJlZSA9IHtcbiAgICAgIHZlcnNpb246ICd0cmVlLTAuMScsXG4gICAgICB0cmVlOiB2aXNpdCh0aGlzLm5vZGUucm9vdCksXG4gICAgfTtcblxuICAgIGNvbnN0IGJ1aWxkZXIgPSBzZXNzaW9uLmFzc2VtYmx5O1xuICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKGJ1aWxkZXIub3V0ZGlyLCBGSUxFX1BBVEgpLCBKU09OLnN0cmluZ2lmeSh0cmVlLCB1bmRlZmluZWQsIDIpLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pO1xuXG4gICAgYnVpbGRlci5hZGRBcnRpZmFjdCgnVHJlZScsIHtcbiAgICAgIHR5cGU6IEFydGlmYWN0VHlwZS5DREtfVFJFRSxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgZmlsZTogRklMRV9QQVRILFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc3ludGhBdHRyaWJ1dGVzKGNvbnN0cnVjdDogSUNvbnN0cnVjdCk6IHsgW2tleTogc3RyaW5nXTogYW55IH0gfCB1bmRlZmluZWQge1xuICAgIC8vIGNoZWNrIGlmIGEgY29uc3RydWN0IGltcGxlbWVudHMgSUluc3BlY3RhYmxlXG4gICAgZnVuY3Rpb24gY2FuSW5zcGVjdChpbnNwZWN0YWJsZTogYW55KTogaW5zcGVjdGFibGUgaXMgSUluc3BlY3RhYmxlIHtcbiAgICAgIHJldHVybiBpbnNwZWN0YWJsZS5pbnNwZWN0ICE9PSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3QgaW5zcGVjdG9yID0gbmV3IFRyZWVJbnNwZWN0b3IoKTtcblxuICAgIC8vIGdldCBhdHRyaWJ1dGVzIGZyb20gdGhlIGluc3BlY3RvclxuICAgIGlmIChjYW5JbnNwZWN0KGNvbnN0cnVjdCkpIHtcbiAgICAgIGNvbnN0cnVjdC5pbnNwZWN0KGluc3BlY3Rvcik7XG4gICAgICByZXR1cm4gU3RhY2sub2YoY29uc3RydWN0KS5yZXNvbHZlKGluc3BlY3Rvci5hdHRyaWJ1dGVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxufVxuXG5pbnRlcmZhY2UgTm9kZSB7XG4gIHJlYWRvbmx5IGlkOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHBhdGg6IHN0cmluZztcbiAgcmVhZG9ubHkgY2hpbGRyZW4/OiB7IFtrZXk6IHN0cmluZ106IE5vZGUgfTtcbiAgcmVhZG9ubHkgYXR0cmlidXRlcz86IHsgW2tleTogc3RyaW5nXTogYW55IH07XG5cbiAgLyoqXG4gICAqIEluZm9ybWF0aW9uIG9uIHRoZSBjb25zdHJ1Y3QgY2xhc3MgdGhhdCBsZWQgdG8gdGhpcyBub2RlLCBpZiBhdmFpbGFibGVcbiAgICovXG4gIHJlYWRvbmx5IGNvbnN0cnVjdEluZm8/OiBDb25zdHJ1Y3RJbmZvO1xufVxuIl19