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
                constructInfo: (0, runtime_info_1.constructInfoFromConstruct)(construct),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1tZXRhZGF0YS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRyZWUtbWV0YWRhdGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUU3QiwwRUFBOEQ7QUFDOUQsMkNBQW1EO0FBQ25ELGlEQUEyRTtBQUMzRSxnREFBNkM7QUFDN0Msb0NBQWlDO0FBRWpDLGtDQUFzRDtBQUV0RCxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUM7QUFFOUI7Ozs7O0dBS0c7QUFDSCxNQUFhLFlBQWEsU0FBUSxzQkFBUztJQUN6QyxZQUFZLEtBQWdCO1FBQzFCLEtBQUssQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDdEI7SUFFRDs7O09BR0c7SUFDSSxlQUFlLENBQUMsT0FBMEI7UUFDL0MsTUFBTSxNQUFNLEdBQTZCLEVBQUcsQ0FBQztRQUU3QyxNQUFNLEtBQUssR0FBRyxDQUFDLFNBQXFCLEVBQVEsRUFBRTtZQUM1QyxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDakQsSUFBSTtvQkFDRixPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDakI7Z0JBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ1YseUJBQVcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLDRDQUE0QyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUN4RyxPQUFPLFNBQVMsQ0FBQztpQkFDbEI7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUNILE1BQU0sV0FBVyxHQUFHLFFBQVE7aUJBQ3pCLE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQztpQkFDdEMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEtBQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRTFFLE1BQU0sSUFBSSxHQUFTO2dCQUNqQixFQUFFLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksS0FBSztnQkFDOUIsSUFBSSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSTtnQkFDekIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxXQUFXO2dCQUN6RSxVQUFVLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUM7Z0JBQzNDLGFBQWEsRUFBRSxJQUFBLHlDQUEwQixFQUFDLFNBQVMsQ0FBQzthQUNyRCxDQUFDO1lBRUYsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7WUFFekIsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDLENBQUM7UUFFRixNQUFNLElBQUksR0FBRztZQUNYLE9BQU8sRUFBRSxVQUFVO1lBQ25CLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDNUIsQ0FBQztRQUVGLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7UUFDakMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFFbEgsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUU7WUFDMUIsSUFBSSxFQUFFLG9DQUFZLENBQUMsUUFBUTtZQUMzQixVQUFVLEVBQUU7Z0JBQ1YsSUFBSSxFQUFFLFNBQVM7YUFDaEI7U0FDRixDQUFDLENBQUM7S0FDSjtJQUVPLGVBQWUsQ0FBQyxTQUFxQjtRQUMzQywrQ0FBK0M7UUFDL0MsU0FBUyxVQUFVLENBQUMsV0FBZ0I7WUFDbEMsT0FBTyxXQUFXLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQztRQUMzQyxDQUFDO1FBRUQsTUFBTSxTQUFTLEdBQUcsSUFBSSxvQkFBYSxFQUFFLENBQUM7UUFFdEMsb0NBQW9DO1FBQ3BDLElBQUksVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3pCLFNBQVMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDN0IsT0FBTyxhQUFLLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDMUQ7UUFDRCxPQUFPLFNBQVMsQ0FBQztLQUNsQjtDQUNGO0FBckVELG9DQXFFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCB7IEFydGlmYWN0VHlwZSB9IGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QsIElDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENvbnN0cnVjdEluZm8sIGNvbnN0cnVjdEluZm9Gcm9tQ29uc3RydWN0IH0gZnJvbSAnLi9ydW50aW1lLWluZm8nO1xuaW1wb3J0IHsgQW5ub3RhdGlvbnMgfSBmcm9tICcuLi9hbm5vdGF0aW9ucyc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJy4uL3N0YWNrJztcbmltcG9ydCB7IElTeW50aGVzaXNTZXNzaW9uIH0gZnJvbSAnLi4vc3RhY2stc3ludGhlc2l6ZXJzJztcbmltcG9ydCB7IElJbnNwZWN0YWJsZSwgVHJlZUluc3BlY3RvciB9IGZyb20gJy4uL3RyZWUnO1xuXG5jb25zdCBGSUxFX1BBVEggPSAndHJlZS5qc29uJztcblxuLyoqXG4gKiBDb25zdHJ1Y3QgdGhhdCBpcyBhdXRvbWF0aWNhbGx5IGF0dGFjaGVkIHRvIHRoZSB0b3AtbGV2ZWwgYEFwcGAuXG4gKiBUaGlzIGdlbmVyYXRlcywgYXMgcGFydCBvZiBzeW50aGVzaXMsIGEgZmlsZSBjb250YWluaW5nIHRoZSBjb25zdHJ1Y3QgdHJlZSBhbmQgdGhlIG1ldGFkYXRhIGZvciBlYWNoIG5vZGUgaW4gdGhlIHRyZWUuXG4gKiBUaGUgb3V0cHV0IGlzIGluIGEgdHJlZSBmb3JtYXQgc28gYXMgdG8gcHJlc2VydmUgdGhlIGNvbnN0cnVjdCBoaWVyYXJjaHkuXG4gKlxuICovXG5leHBvcnQgY2xhc3MgVHJlZU1ldGFkYXRhIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCkge1xuICAgIHN1cGVyKHNjb3BlLCAnVHJlZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0cmVlLmpzb25cbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgX3N5bnRoZXNpemVUcmVlKHNlc3Npb246IElTeW50aGVzaXNTZXNzaW9uKSB7XG4gICAgY29uc3QgbG9va3VwOiB7IFtwYXRoOiBzdHJpbmddOiBOb2RlIH0gPSB7IH07XG5cbiAgICBjb25zdCB2aXNpdCA9IChjb25zdHJ1Y3Q6IElDb25zdHJ1Y3QpOiBOb2RlID0+IHtcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gY29uc3RydWN0Lm5vZGUuY2hpbGRyZW4ubWFwKChjKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIHZpc2l0KGMpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgQW5ub3RhdGlvbnMub2YodGhpcykuYWRkV2FybmluZyhgRmFpbGVkIHRvIHJlbmRlciB0cmVlIG1ldGFkYXRhIGZvciBub2RlIFske2Mubm9kZS5pZH1dLiBSZWFzb246ICR7ZX1gKTtcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGNoaWxkcmVuTWFwID0gY2hpbGRyZW5cbiAgICAgICAgLmZpbHRlcigoY2hpbGQpID0+IGNoaWxkICE9PSB1bmRlZmluZWQpXG4gICAgICAgIC5yZWR1Y2UoKG1hcCwgY2hpbGQpID0+IE9iamVjdC5hc3NpZ24obWFwLCB7IFtjaGlsZCEuaWRdOiBjaGlsZCB9KSwge30pO1xuXG4gICAgICBjb25zdCBub2RlOiBOb2RlID0ge1xuICAgICAgICBpZDogY29uc3RydWN0Lm5vZGUuaWQgfHwgJ0FwcCcsXG4gICAgICAgIHBhdGg6IGNvbnN0cnVjdC5ub2RlLnBhdGgsXG4gICAgICAgIGNoaWxkcmVuOiBPYmplY3Qua2V5cyhjaGlsZHJlbk1hcCkubGVuZ3RoID09PSAwID8gdW5kZWZpbmVkIDogY2hpbGRyZW5NYXAsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHRoaXMuc3ludGhBdHRyaWJ1dGVzKGNvbnN0cnVjdCksXG4gICAgICAgIGNvbnN0cnVjdEluZm86IGNvbnN0cnVjdEluZm9Gcm9tQ29uc3RydWN0KGNvbnN0cnVjdCksXG4gICAgICB9O1xuXG4gICAgICBsb29rdXBbbm9kZS5wYXRoXSA9IG5vZGU7XG5cbiAgICAgIHJldHVybiBub2RlO1xuICAgIH07XG5cbiAgICBjb25zdCB0cmVlID0ge1xuICAgICAgdmVyc2lvbjogJ3RyZWUtMC4xJyxcbiAgICAgIHRyZWU6IHZpc2l0KHRoaXMubm9kZS5yb290KSxcbiAgICB9O1xuXG4gICAgY29uc3QgYnVpbGRlciA9IHNlc3Npb24uYXNzZW1ibHk7XG4gICAgZnMud3JpdGVGaWxlU3luYyhwYXRoLmpvaW4oYnVpbGRlci5vdXRkaXIsIEZJTEVfUEFUSCksIEpTT04uc3RyaW5naWZ5KHRyZWUsIHVuZGVmaW5lZCwgMiksIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSk7XG5cbiAgICBidWlsZGVyLmFkZEFydGlmYWN0KCdUcmVlJywge1xuICAgICAgdHlwZTogQXJ0aWZhY3RUeXBlLkNES19UUkVFLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBmaWxlOiBGSUxFX1BBVEgsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzeW50aEF0dHJpYnV0ZXMoY29uc3RydWN0OiBJQ29uc3RydWN0KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB8IHVuZGVmaW5lZCB7XG4gICAgLy8gY2hlY2sgaWYgYSBjb25zdHJ1Y3QgaW1wbGVtZW50cyBJSW5zcGVjdGFibGVcbiAgICBmdW5jdGlvbiBjYW5JbnNwZWN0KGluc3BlY3RhYmxlOiBhbnkpOiBpbnNwZWN0YWJsZSBpcyBJSW5zcGVjdGFibGUge1xuICAgICAgcmV0dXJuIGluc3BlY3RhYmxlLmluc3BlY3QgIT09IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCBpbnNwZWN0b3IgPSBuZXcgVHJlZUluc3BlY3RvcigpO1xuXG4gICAgLy8gZ2V0IGF0dHJpYnV0ZXMgZnJvbSB0aGUgaW5zcGVjdG9yXG4gICAgaWYgKGNhbkluc3BlY3QoY29uc3RydWN0KSkge1xuICAgICAgY29uc3RydWN0Lmluc3BlY3QoaW5zcGVjdG9yKTtcbiAgICAgIHJldHVybiBTdGFjay5vZihjb25zdHJ1Y3QpLnJlc29sdmUoaW5zcGVjdG9yLmF0dHJpYnV0ZXMpO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG5cbmludGVyZmFjZSBOb2RlIHtcbiAgcmVhZG9ubHkgaWQ6IHN0cmluZztcbiAgcmVhZG9ubHkgcGF0aDogc3RyaW5nO1xuICByZWFkb25seSBjaGlsZHJlbj86IHsgW2tleTogc3RyaW5nXTogTm9kZSB9O1xuICByZWFkb25seSBhdHRyaWJ1dGVzPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfTtcblxuICAvKipcbiAgICogSW5mb3JtYXRpb24gb24gdGhlIGNvbnN0cnVjdCBjbGFzcyB0aGF0IGxlZCB0byB0aGlzIG5vZGUsIGlmIGF2YWlsYWJsZVxuICAgKi9cbiAgcmVhZG9ubHkgY29uc3RydWN0SW5mbz86IENvbnN0cnVjdEluZm87XG59XG4iXX0=